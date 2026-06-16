import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Upload, Clipboard, Download, CheckCircle, AlertTriangle, ArrowRight, Trash2 } from "lucide-react";
import { recordDonation } from "@/modules/donations/donationsStore";
import type { DonationChannel, DonationNature } from "@/modules/donations/types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ParsedRow {
  index: number;
  donorName: string;
  phone: string;
  email: string;
  city: string;
  pan: string;
  amount: number;
  purpose: string;
  channel: DonationChannel;
  mode: string;
  referenceNo: string;
  date: string;
  time: string;
  remarks: string;
  wants80G: boolean;
  errors: string[];
}

export default function BulkImportDonationsDialog({ open, onOpenChange }: Props) {
  const [inputText, setInputText] = useState("");
  const [step, setStep] = useState<1 | 2>(1);
  const [parsedRows, setParsedRows] = useState<ParsedRow[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDownloadTemplate = () => {
    const headers = "Donor Name,Donor Phone,Donor Email,Donor City,Donor PAN,Amount,Purpose / Fund,Payment Channel,Payment Mode,Reference No,Date (YYYY-MM-DD),Time,Remarks,wants80G (yes/no)\n";
    const sample = "Amit Sharma,+91 9988776655,amit@email.com,Mumbai,ABCDE1234F,5000,General,UPI,GPay,TXN-9981,2026-06-10,10:30 AM,Anniversary donation,yes\nKiran Verma,,kiran@email.com,Delhi,,1000,Corpus Fund,Cash,Cash,,2026-06-09,11:45 AM,,no";
    const blob = new Blob([headers + sample], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "past_donations_template.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Template CSV downloaded");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        setInputText(text);
        processRawText(text);
      }
    };
    reader.readAsText(file);
  };

  const processRawText = (text: string) => {
    if (!text.trim()) {
      toast.error("Please enter or upload some data first");
      return;
    }

    const lines = text.split(/\r?\n/);
    if (lines.length === 0) return;

    const firstLine = lines[0];
    const isTab = firstLine.includes("\t");
    const separator = isTab ? "\t" : ",";

    let startIdx = 0;
    const headerDetect = firstLine.toLowerCase();
    if (headerDetect.includes("donor") || headerDetect.includes("amount") || headerDetect.includes("purpose") || headerDetect.includes("channel")) {
      startIdx = 1;
    }

    const rows: ParsedRow[] = [];
    for (let i = startIdx; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      let parts: string[] = [];
      if (separator === ",") {
        const matches = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || line.split(",");
        parts = matches.map(p => p.replace(/^"|"$/g, "").trim());
      } else {
        parts = line.split(separator).map(p => p.trim());
      }

      if (parts.length === 0 || parts.join("") === "") continue;

      // Columns layout:
      // 0: Donor Name, 1: Phone, 2: Email, 3: City, 4: PAN, 5: Amount, 6: Purpose, 7: Channel, 8: Mode, 9: Reference No, 10: Date, 11: Time, 12: Remarks, 13: wants80G
      const donorName = parts[0] || "";
      const phone = parts[1] || "";
      const email = parts[2] || "";
      const city = parts[3] || "";
      const pan = parts[4] || "";
      const amountRaw = parts[5] || "";
      const purpose = parts[6] || "General";
      const channelRaw = parts[7] || "Cash";
      const mode = parts[8] || "Cash";
      const referenceNo = parts[9] || "";
      const dateRaw = parts[10] || "";
      const time = parts[11] || "12:00 PM";
      const remarks = parts[12] || "";
      const wants80GRaw = parts[13] || "no";

      const errors: string[] = [];

      if (!donorName) {
        errors.push("Donor Name is required.");
      }

      const amount = parseFloat(amountRaw.replace(/[^0-9.]/g, ""));
      if (isNaN(amount) || amount <= 0) {
        errors.push("Amount must be a positive number.");
      }

      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      let date = dateRaw;
      if (!dateRegex.test(dateRaw)) {
        const parsedDate = new Date(dateRaw);
        if (!isNaN(parsedDate.getTime())) {
          date = parsedDate.toISOString().split("T")[0];
        } else {
          errors.push("Date must be in YYYY-MM-DD format.");
        }
      }

      // Channel mapping
      let channel: DonationChannel = "Cash";
      const chLower = channelRaw.toLowerCase();
      if (chLower.includes("upi") || chLower.includes("gpay") || chLower.includes("phonepe")) {
        channel = "UPI";
      } else if (chLower.includes("bank") || chLower.includes("transfer") || chLower.includes("neft")) {
        channel = "Bank Transfer";
      } else if (chLower.includes("cheque") || chLower.includes("check")) {
        channel = "Cheque";
      } else if (chLower.includes("kind") || chLower.includes("asset")) {
        channel = "In-Kind";
      }

      // wants80G boolean mapping
      const wants80G = wants80GRaw.toLowerCase() === "yes" || wants80GRaw.toLowerCase() === "true";

      // PAN Validation if wants 80G
      if (wants80G) {
        if (!pan) {
          errors.push("PAN number is required for 80G tax exemption.");
        } else {
          const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
          if (!panRegex.test(pan.toUpperCase())) {
            errors.push("Invalid Indian PAN format (e.g. ABCDE1234F).");
          }
        }
      }

      rows.push({
        index: i + 1,
        donorName,
        phone,
        email,
        city,
        pan,
        amount: isNaN(amount) ? 0 : amount,
        purpose,
        channel,
        mode,
        referenceNo,
        date,
        time,
        remarks,
        wants80G,
        errors,
      });
    }

    setParsedRows(rows);
    setStep(2);
  };

  const handleImport = () => {
    const validRows = parsedRows.filter(r => r.errors.length === 0);
    if (validRows.length === 0) {
      toast.error("No valid records to import. Please correct errors and try again.");
      return;
    }

    // Call recordDonation for each record.
    validRows.forEach(r => {
      const nature: DonationNature = r.channel === "In-Kind" ? "Non-Cash" : "Cash";
      recordDonation({
        donorName: r.donorName,
        phone: r.phone || undefined,
        email: r.email || undefined,
        city: r.city || undefined,
        pan: r.pan || undefined,
        nature,
        amount: r.amount,
        purpose: r.purpose,
        channel: r.channel,
        mode: r.mode,
        referenceNo: r.referenceNo || undefined,
        remarks: r.remarks || undefined,
        date: r.date,
        time: r.time,
        wants80G: r.wants80G,
        sourceModule: "Counter"
      });
    });

    toast.success(`Successfully imported ${validRows.length} donations!`);
    onOpenChange(false);
    resetState();
  };

  const resetState = () => {
    setInputText("");
    setParsedRows([]);
    setStep(1);
  };

  const errorCount = parsedRows.filter(r => r.errors.length > 0).length;

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) resetState(); }}>
      <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col p-6 overflow-hidden">
        <DialogHeader className="shrink-0">
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <span>Bulk Import Past Donations</span>
          </DialogTitle>
          <DialogDescription>
            Import historical donor contribution receipts in bulk.
          </DialogDescription>
        </DialogHeader>

        {/* Step Navigation Bar */}
        <div className="flex items-center gap-2 mb-4 shrink-0 bg-muted/40 p-1 rounded-lg border text-sm w-fit">
          <button onClick={() => setStep(1)} className={`px-3 py-1.5 rounded-md transition-all ${step === 1 ? "bg-background shadow-sm font-medium text-foreground" : "text-muted-foreground"}`}>
            1. Enter Data
          </button>
          <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
          <button disabled={parsedRows.length === 0} onClick={() => setStep(2)} className={`px-3 py-1.5 rounded-md transition-all ${step === 2 ? "bg-background shadow-sm font-medium text-foreground" : "text-muted-foreground"} disabled:opacity-50`}>
            2. Validate & Preview ({parsedRows.length} rows)
          </button>
        </div>

        {/* Step Contents */}
        <div className="flex-1 overflow-y-auto min-h-0 py-1">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div key="step1" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-4">
                {/* Upload Section */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="border border-dashed rounded-xl p-5 flex flex-col items-center justify-center text-center bg-card hover:bg-muted/10 transition-colors">
                    <Upload className="h-8 w-8 text-primary mb-2 opacity-80" />
                    <p className="font-semibold text-sm">Upload CSV File</p>
                    <p className="text-xs text-muted-foreground mt-1 max-w-[200px]">Drag and drop your file or browse local files</p>
                    <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".csv" className="hidden" />
                    <Button variant="outline" size="sm" className="mt-3" onClick={() => fileInputRef.current?.click()}>
                      Choose File
                    </Button>
                  </div>

                  <div className="border rounded-xl p-5 flex flex-col justify-between bg-card">
                    <div>
                      <h4 className="font-semibold text-sm flex items-center gap-2"><Clipboard className="h-4 w-4 text-primary" />Copy Paste Instructions</h4>
                      <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                        Copy rows directly from Excel or Google Sheets, including headings, and paste them in the text area below. We'll automatically map the columns.
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" className="w-fit gap-1.5 text-xs text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 mt-4" onClick={handleDownloadTemplate}>
                      <Download className="h-3.5 w-3.5" /> Download Template CSV
                    </Button>
                  </div>
                </div>

                {/* Text Input Area */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Paste Raw CSV / TSV Data</label>
                  <Textarea
                    placeholder="Donor Name,Donor Phone,Donor Email,Donor City,Donor PAN,Amount,Purpose / Fund,Payment Channel,Payment Mode,Reference No,Date (YYYY-MM-DD),Time,Remarks,wants80G (yes/no)"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="font-mono text-xs h-56 resize-none bg-muted/20 focus-visible:ring-primary focus-visible:bg-background transition-all"
                  />
                </div>
              </motion.div>
            ) : (
              <motion.div key="step2" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-4">
                {/* Summary Alert */}
                <div className="flex items-center justify-between p-3.5 rounded-xl border bg-muted/30">
                  <div className="flex items-center gap-2.5">
                    {errorCount > 0 ? (
                      <AlertTriangle className="h-5 w-5 text-amber-600" />
                    ) : (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    )}
                    <div>
                      <p className="text-sm font-semibold">
                        Parsed {parsedRows.length} donations.
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {parsedRows.length - errorCount} rows are ready to import. {errorCount > 0 && `${errorCount} rows have validation errors and will be skipped.`}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setStep(1)} className="text-xs">
                      Back to Edit
                    </Button>
                    <Button variant="ghost" size="sm" className="text-xs text-destructive hover:bg-destructive/10" onClick={resetState}>
                      <Trash2 className="h-3.5 w-3.5 mr-1" /> Reset
                    </Button>
                  </div>
                </div>

                {/* Table Preview */}
                <div className="border rounded-xl overflow-hidden bg-card">
                  <div className="max-h-72 overflow-y-auto">
                    <Table>
                      <TableHeader className="bg-muted/40 sticky top-0 z-10">
                        <TableRow>
                          <TableHead className="w-12 text-center">Row</TableHead>
                          <TableHead>Donor Name</TableHead>
                          <TableHead>Purpose</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                          <TableHead>Payment</TableHead>
                          <TableHead className="text-center">80G</TableHead>
                          <TableHead>Validation</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {parsedRows.map((row) => (
                          <TableRow key={row.index} className={row.errors.length > 0 ? "bg-red-50/40 hover:bg-red-50/60 dark:bg-red-950/10" : ""}>
                            <TableCell className="text-center font-mono text-[10px] text-muted-foreground">{row.index}</TableCell>
                            <TableCell className="font-medium">
                              <p className="text-xs leading-none">{row.donorName || <span className="text-destructive font-semibold">Missing</span>}</p>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                {row.phone && <span className="text-[10px] text-muted-foreground">{row.phone}</span>}
                                {row.pan && <span className="text-[10px] font-mono bg-muted px-1 rounded text-muted-foreground">{row.pan}</span>}
                              </div>
                            </TableCell>
                            <TableCell className="text-xs font-medium">{row.purpose}</TableCell>
                            <TableCell className="text-xs">
                              <p className="leading-none">{row.date || "—"}</p>
                              <span className="text-[10px] text-muted-foreground">{row.time}</span>
                            </TableCell>
                            <TableCell className="text-right font-medium text-xs">
                              ₹{row.amount.toLocaleString("en-IN")}
                            </TableCell>
                            <TableCell>
                              <p className="text-xs leading-none font-medium">{row.mode}</p>
                              <span className="text-[9px] font-mono text-muted-foreground">{row.channel}</span>
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge variant={row.wants80G ? "default" : "secondary"} className={`text-[10px] px-1.5 py-0 h-auto ${row.wants80G ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}`}>
                                {row.wants80G ? "Yes" : "No"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {row.errors.length > 0 ? (
                                <div className="space-y-0.5">
                                  {row.errors.map((err, idx) => (
                                    <p key={idx} className="text-[10px] text-destructive leading-tight font-medium flex items-center gap-1">
                                      ❌ {err}
                                    </p>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-[10px] text-green-700 font-medium flex items-center gap-1">
                                  ✅ Valid
                                </span>
                              )}
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          {step === 1 ? (
            <Button onClick={() => processRawText(inputText)} disabled={!inputText.trim()} className="gap-1.5">
              Validate Data <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleImport} disabled={parsedRows.length - errorCount === 0} className="bg-emerald-700 hover:bg-emerald-800 text-white font-medium">
              Import {parsedRows.length - errorCount} Donations
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
