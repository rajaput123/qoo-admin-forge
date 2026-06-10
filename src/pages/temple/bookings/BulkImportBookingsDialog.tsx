import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Upload, Clipboard, Download, CheckCircle, AlertTriangle, ArrowRight, Trash2, Info } from "lucide-react";
import { recordSevaBookings } from "@/modules/sevas/sevaStore";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ParsedRow {
  index: number;
  devoteeName: string;
  devoteePhone: string;
  sevaName: string;
  sevaCategory: string;
  date: string;
  time: string;
  amount: number;
  paymentMethod: "Cash" | "UPI" | "Bank" | "Online";
  paymentMode: string;
  referenceNo: string;
  status: "Confirmed" | "Completed" | "Cancelled";
  errors: string[];
}

// ──────────────────────────────────────────────────────────
// Parsing helpers
// ──────────────────────────────────────────────────────────

function isRegisterFormat(headerLine: string): boolean {
  const h = headerLine.toLowerCase();
  return (
    h.includes("book no") ||
    h.includes("rect no") ||
    h.includes("seva details") ||
    h.includes("cash/upi") ||
    h.includes("utr no") ||
    h.includes("chq amt") ||
    h.includes("remittance")
  );
}

function parsePayment(cashUpi: string, utrNo: string, chqNo: string): {
  paymentMethod: "Cash" | "UPI" | "Bank" | "Online";
  paymentMode: string;
  referenceNo: string;
} {
  if (chqNo?.trim())
    return { paymentMethod: "Bank", paymentMode: "Cheque", referenceNo: chqNo.trim() };
  if (utrNo?.trim())
    return { paymentMethod: "UPI", paymentMode: "UPI", referenceNo: utrNo.trim() };
  const v = (cashUpi || "").toLowerCase();
  if (v.includes("gpay") || v.includes("phonepe") || v.includes("paytm") || v.includes("upi"))
    return { paymentMethod: "UPI", paymentMode: cashUpi.trim() || "UPI", referenceNo: "" };
  if (v.includes("neft") || v.includes("rtgs") || v.includes("imps") || v.includes("bank"))
    return { paymentMethod: "Bank", paymentMode: "Bank Transfer", referenceNo: "" };
  return { paymentMethod: "Cash", paymentMode: "Cash", referenceNo: "" };
}

function parseDate(raw: string): { date: string; error?: string } {
  if (!raw?.trim()) return { date: "", error: "Date is required." };
  const s = raw.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return { date: s };
  // DD/MM/YYYY or DD-MM-YYYY
  const dmy = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})$/);
  if (dmy) {
    const [, d, m, y] = dmy;
    const year = y.length === 2 ? `20${y}` : y;
    return { date: `${year}-${m.padStart(2, "0")}-${d.padStart(2, "0")}` };
  }
  const js = new Date(s);
  if (!isNaN(js.getTime())) return { date: js.toISOString().split("T")[0] };
  return { date: "", error: `Cannot parse "${s}" — use DD/MM/YYYY or YYYY-MM-DD.` };
}

function splitLine(line: string, sep: string): string[] {
  if (sep === "\t") return line.split("\t").map(p => p.trim());
  const m = line.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g) || line.split(",");
  return m.map(p => p.replace(/^"|"$/g, "").trim());
}

// ──────────────────────────────────────────────────────────
// Component
// ──────────────────────────────────────────────────────────

export default function BulkImportBookingsDialog({ open, onOpenChange }: Props) {
  const [inputText, setInputText] = useState("");
  const [step, setStep] = useState<1 | 2>(1);
  const [parsedRows, setParsedRows] = useState<ParsedRow[]>([]);
  const [detectedFormat, setDetectedFormat] = useState<"register" | "csv" | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDownloadTemplate = () => {
    // Download their actual register format as a TSV template
    const headers = "Book No.\tDate\tRect No.\tSeva Details\tAmount\tCash/UPI\tUTR No.\tchq amt\tchq no\tDate\tremittance bank name\tRemitted to KBL on\tRemitted to SBI on\tRemitted to Bank\n";
    const sample = [
      "1\t15/06/2026\tRCT-001\tAbhishekam\t1100\tUPI\tUTR789012\t\t\t\t\t\t\t",
      "2\t15/06/2026\tRCT-002\tArchana\t251\tCash\t\t\t\t\t\t\t\t",
      "3\t16/06/2026\tRCT-003\tKalyanotsavam\t5100\tCheque\t\t5100\tCHQ-4567\t16/06/2026\tSBI\t\t17/06/2026\tSBI",
    ].join("\n");
    const blob = new Blob([headers + sample], { type: "text/tab-separated-values" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "seva_register_template.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Register template downloaded");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const text = ev.target?.result as string;
      if (text) { setInputText(text); processRawText(text); }
    };
    reader.readAsText(file);
    // Reset so same file can be re-selected
    e.target.value = "";
  };

  const processRawText = (text: string) => {
    if (!text.trim()) { toast.error("Please enter or upload some data first"); return; }

    const lines = text.split(/\r?\n/);
    const sep = lines[0]?.includes("\t") ? "\t" : ",";

    // Find header row (scan first 5 lines)
    let headerIdx = -1;
    for (let i = 0; i < Math.min(lines.length, 5); i++) {
      const l = lines[i].toLowerCase().trim();
      if (l.includes("book no") || l.includes("rect no") || l.includes("seva") ||
          l.includes("devotee") || l.includes("amount") || l.includes("date")) {
        headerIdx = i; break;
      }
    }

    const headerLine = headerIdx >= 0 ? lines[headerIdx] : "";
    const registerMode = isRegisterFormat(headerLine);
    setDetectedFormat(registerMode ? "register" : "csv");

    const startIdx = headerIdx >= 0 ? headerIdx + 1 : 0;
    const rows: ParsedRow[] = [];

    for (let i = startIdx; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line || line.replace(/[\t,]/g, "").trim() === "") continue;

      const p = splitLine(line, sep);
      if (p.join("").trim() === "") continue;

      let devoteeName = "", devoteePhone = "", sevaName = "", sevaCategory = "Daily Sevas";
      let dateRaw = "", time = "09:00 AM", amountRaw = "", referenceNo = "";
      let paymentMethod: "Cash" | "UPI" | "Bank" | "Online" = "Cash";
      let paymentMode = "Cash";
      let status: "Confirmed" | "Completed" | "Cancelled" = "Completed";

      if (registerMode) {
        // 0:Book No | 1:Date | 2:Rect No | 3:Seva Details | 4:Amount |
        // 5:Cash/UPI | 6:UTR No | 7:chq amt | 8:chq no | 9:chq Date |
        // 10:remittance bank | 11:KBL | 12:SBI | 13:Remitted to Bank
        dateRaw       = p[1] || "";
        const rectNo  = p[2] || "";
        sevaName      = p[3] || "";
        amountRaw     = p[4] || "";
        const cashUpi = p[5] || "";
        const utrNo   = p[6] || "";
        const chqNo   = p[8] || "";

        devoteeName = "—"; // Register doesn't capture devotee name
        const pay = parsePayment(cashUpi, utrNo, chqNo);
        paymentMethod = pay.paymentMethod;
        paymentMode   = pay.paymentMode;
        referenceNo   = rectNo || pay.referenceNo;
      } else {
        // 0:Devotee Name | 1:Phone | 2:Seva Name | 3:Category | 4:Date |
        // 5:Time | 6:Amount | 7:Method | 8:Mode | 9:Ref | 10:Status
        devoteeName   = p[0] || "";
        devoteePhone  = p[1] || "";
        sevaName      = p[2] || "";
        sevaCategory  = p[3] || "Daily Sevas";
        dateRaw       = p[4] || "";
        time          = p[5] || "09:00 AM";
        amountRaw     = p[6] || "";
        const method  = (p[7] || "Cash").toLowerCase();
        paymentMode   = p[8] || "Cash";
        referenceNo   = p[9] || "";
        const sRaw    = (p[10] || "Completed").toLowerCase();

        if (method.includes("upi") || method.includes("gpay") || method.includes("phonepe"))
          paymentMethod = "UPI";
        else if (method.includes("bank") || method.includes("neft") || method.includes("cheque"))
          paymentMethod = "Bank";
        else if (method.includes("online") || method.includes("razorpay"))
          paymentMethod = "Online";

        if (sRaw.includes("confirm")) status = "Confirmed";
        else if (sRaw.includes("cancel")) status = "Cancelled";
      }

      const errors: string[] = [];
      if (!sevaName) errors.push("Seva name is required.");
      const amount = parseFloat((amountRaw || "").replace(/[^0-9.]/g, ""));
      if (isNaN(amount) || amount <= 0) errors.push("Amount must be a positive number.");
      const { date, error: dateErr } = parseDate(dateRaw);
      if (dateErr) errors.push(dateErr);

      rows.push({ index: i + 1, devoteeName, devoteePhone, sevaName, sevaCategory,
        date, time, amount: isNaN(amount) ? 0 : amount, paymentMethod, paymentMode, referenceNo, status, errors });
    }

    setParsedRows(rows);
    setStep(2);
  };

  const handleImport = () => {
    const valid = parsedRows.filter(r => r.errors.length === 0);
    if (valid.length === 0) { toast.error("No valid records to import."); return; }

    recordSevaBookings(valid.map(r => ({
      sevaName: r.sevaName, sevaCategory: r.sevaCategory,
      devoteeName: r.devoteeName, devoteePhone: r.devoteePhone || "-",
      date: r.date, time: r.time, amount: r.amount,
      paymentMethod: r.paymentMethod, paymentMode: r.paymentMode,
      referenceNo: r.referenceNo, status: r.status, sourceModule: "Counter" as const,
    })));

    toast.success(`Imported ${valid.length} booking${valid.length !== 1 ? "s" : ""} successfully!`);
    onOpenChange(false);
    resetState();
  };

  const resetState = () => { setInputText(""); setParsedRows([]); setStep(1); setDetectedFormat(null); };
  const errorCount = parsedRows.filter(r => r.errors.length > 0).length;

  return (
    <Dialog open={open} onOpenChange={v => { onOpenChange(v); if (!v) resetState(); }}>
      <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col p-6 overflow-hidden">
        <DialogHeader className="shrink-0">
          <DialogTitle className="text-xl font-bold">Bulk Import Past Bookings</DialogTitle>
          <DialogDescription>
            Supports your physical register format <span className="font-medium text-foreground">(Book No / Date / Rect No / Seva Details / Amount / Cash/UPI / UTR No / Cheque...)</span> as well as generic CSV.
          </DialogDescription>
        </DialogHeader>

        {/* Step tabs */}
        <div className="flex items-center gap-2 mb-4 shrink-0 bg-muted/40 p-1 rounded-lg border text-sm w-fit">
          <button onClick={() => setStep(1)} className={`px-3 py-1.5 rounded-md transition-all ${step === 1 ? "bg-background shadow-sm font-medium text-foreground" : "text-muted-foreground"}`}>
            1. Enter Data
          </button>
          <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
          <button disabled={parsedRows.length === 0} onClick={() => setStep(2)}
            className={`px-3 py-1.5 rounded-md transition-all ${step === 2 ? "bg-background shadow-sm font-medium text-foreground" : "text-muted-foreground"} disabled:opacity-40`}>
            2. Preview & Validate ({parsedRows.length})
          </button>
        </div>

        <div className="flex-1 overflow-y-auto min-h-0 py-1">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div key="s1" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {/* Upload card */}
                  <div className="border-2 border-dashed rounded-xl p-5 flex flex-col items-center justify-center text-center hover:bg-muted/10 transition-colors">
                    <Upload className="h-8 w-8 text-primary mb-2 opacity-80" />
                    <p className="font-semibold text-sm">Upload CSV / Excel export</p>
                    <p className="text-xs text-muted-foreground mt-1">Save your Excel as CSV then upload here</p>
                    <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".csv,.tsv,.txt" className="hidden" />
                    <Button variant="outline" size="sm" className="mt-3" onClick={() => fileInputRef.current?.click()}>
                      Choose File
                    </Button>
                  </div>

                  {/* Instructions card */}
                  <div className="border rounded-xl p-5 flex flex-col justify-between bg-card">
                    <div>
                      <h4 className="font-semibold text-sm flex items-center gap-2"><Clipboard className="h-4 w-4 text-primary" />Copy-Paste from Excel</h4>
                      <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                        Select rows from your register spreadsheet (including the header row) and paste below. Supports your physical register format automatically.
                      </p>
                      <div className="mt-2 p-2 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-800 leading-relaxed">
                        <strong>Detected auto-formats:</strong><br />
                        📋 Register: Book No / Date / Rect No / Seva Details / Amount / Cash/UPI / UTR No / Cheque<br />
                        📄 Generic: Devotee Name / Phone / Seva / Date / Amount / Payment...
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="w-fit gap-1.5 text-xs text-amber-700 hover:bg-amber-50 mt-3" onClick={handleDownloadTemplate}>
                      <Download className="h-3.5 w-3.5" /> Download Register Template
                    </Button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Paste Data Here</label>
                  <Textarea
                    placeholder={"Book No.\tDate\tRect No.\tSeva Details\tAmount\tCash/UPI\tUTR No.\t...\n1\t15/06/2026\tRCT-001\tAbhishekam\t1100\tUPI\tUTR789012\t..."}
                    value={inputText}
                    onChange={e => setInputText(e.target.value)}
                    className="font-mono text-xs h-52 resize-none bg-muted/20 focus-visible:ring-primary transition-all"
                  />
                </div>
              </motion.div>
            ) : (
              <motion.div key="s2" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-4">
                {/* Summary bar */}
                <div className="flex items-center justify-between p-3.5 rounded-xl border bg-muted/30">
                  <div className="flex items-center gap-2.5">
                    {errorCount > 0
                      ? <AlertTriangle className="h-5 w-5 text-amber-600" />
                      : <CheckCircle className="h-5 w-5 text-green-600" />}
                    <div>
                      <p className="text-sm font-semibold">Parsed {parsedRows.length} records</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {parsedRows.length - errorCount} ready to import
                        {errorCount > 0 && ` · ${errorCount} with errors (will be skipped)`}
                        {detectedFormat && <span className="ml-2 text-primary">· {detectedFormat === "register" ? "📋 Register format" : "📄 CSV format"} detected</span>}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setStep(1)} className="text-xs">Back</Button>
                    <Button variant="ghost" size="sm" className="text-xs text-destructive hover:bg-destructive/10" onClick={resetState}>
                      <Trash2 className="h-3.5 w-3.5 mr-1" />Reset
                    </Button>
                  </div>
                </div>

                {detectedFormat === "register" && (
                  <div className="flex items-start gap-2 p-2.5 rounded-lg bg-blue-50 border border-blue-200 text-[11px] text-blue-800">
                    <Info className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                    Register format detected — Devotee Name is set to "—" since it's not in the physical register. You can update names after import.
                  </div>
                )}

                {/* Preview table */}
                <div className="border rounded-xl overflow-hidden">
                  <div className="max-h-72 overflow-y-auto">
                    <Table>
                      <TableHeader className="bg-muted/40 sticky top-0 z-10">
                        <TableRow>
                          <TableHead className="w-10 text-center">#</TableHead>
                          <TableHead>Devotee / Ref</TableHead>
                          <TableHead>Seva</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                          <TableHead>Payment</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Validation</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {parsedRows.map(row => (
                          <TableRow key={row.index} className={row.errors.length > 0 ? "bg-red-50/40" : ""}>
                            <TableCell className="text-center font-mono text-[10px] text-muted-foreground">{row.index}</TableCell>
                            <TableCell>
                              <p className="text-xs font-medium leading-none">{row.devoteeName || "—"}</p>
                              {row.referenceNo && <span className="text-[10px] font-mono text-muted-foreground">{row.referenceNo}</span>}
                            </TableCell>
                            <TableCell>
                              <p className="text-xs font-medium leading-none">{row.sevaName || <span className="text-destructive">Missing</span>}</p>
                              <span className="text-[10px] text-muted-foreground">{row.sevaCategory}</span>
                            </TableCell>
                            <TableCell className="text-xs">{row.date || "—"}</TableCell>
                            <TableCell className="text-right text-xs font-medium">₹{row.amount.toLocaleString("en-IN")}</TableCell>
                            <TableCell>
                              <p className="text-xs font-medium leading-none">{row.paymentMode}</p>
                              <span className="text-[10px] text-muted-foreground">{row.paymentMethod}</span>
                            </TableCell>
                            <TableCell>
                              <Badge variant={row.status === "Completed" ? "secondary" : row.status === "Confirmed" ? "outline" : "destructive"}
                                className="text-[10px] px-1 py-0 h-auto">{row.status}</Badge>
                            </TableCell>
                            <TableCell>
                              {row.errors.length > 0
                                ? <div>{row.errors.map((e, j) => <p key={j} className="text-[10px] text-destructive font-medium">❌ {e}</p>)}</div>
                                : <span className="text-[10px] text-green-700 font-medium">✅ Valid</span>}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <DialogFooter className="shrink-0 border-t pt-4 mt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          {step === 1 ? (
            <Button onClick={() => processRawText(inputText)} disabled={!inputText.trim()} className="gap-1.5">
              Validate Data <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleImport} disabled={parsedRows.length - errorCount === 0}
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-medium">
              Import {parsedRows.length - errorCount} Booking{parsedRows.length - errorCount !== 1 ? "s" : ""}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
