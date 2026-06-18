import { useState, useMemo, useRef, useCallback } from "react";
import { toast } from "sonner";
import { CheckCircle2, Clock, AlertTriangle, Search, Upload, Eye, Printer, ArrowDownToLine, ArrowUpToLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { ReconciliationProvider, useReconciliation, getTransactionStatus, getStatementStatus, getDaysOverdue, formatINR } from "@/stores/reconciliationStore";
import { format, parseISO } from "date-fns";
import Papa from "papaparse";
import type { BankStatementLine, ReconciliationStatus } from "@/stores/reconciliationStore";

// ── Shared helpers ──────────────────────────────────────────────────────────

function StatusBadge({ s }: { s: ReconciliationStatus }) {
  const map = {
    Reconciled: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Pending:    "bg-amber-50 text-amber-700 border-amber-200",
    Priority:   "bg-red-50 text-red-700 border-red-200",
  };
  const Icon = s === "Reconciled" ? CheckCircle2 : s === "Pending" ? Clock : AlertTriangle;
  return (
    <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border", map[s])}>
      <Icon className="h-2.5 w-2.5" />{s}
    </span>
  );
}

function StatCard({ label, count, subtext, borderClass, active, onClick }: { label: string; count: number; subtext: string; borderClass: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className={cn(
      "text-left p-4 rounded-lg border bg-white transition-all w-full relative overflow-hidden",
      active ? "border-amber-500 ring-1 ring-amber-500" : "border-slate-200",
      borderClass
    )}>
      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">{label}</p>
      <p className="text-3xl font-bold mt-2 text-slate-800 leading-none">{count}</p>
      <p className="text-[11px] text-muted-foreground mt-2">{subtext}</p>
    </button>
  );
}

// ── Main Page Content ────────────────────────────────────────────────────────

function BankRecon() {
  const { statementLines, transactions, now, appendStatementLines } = useReconciliation();
  const [filter, setFilter] = useState<ReconciliationStatus | "All">("All");
  const [search, setSearch] = useState("");
  const [dragging, setDragging] = useState(false);
  const [viewModal, setViewModal] = useState<BankStatementLine | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const rows = useMemo(() => statementLines.map(l => ({ ...l, status: getStatementStatus(l, now) })), [statementLines, now]);

  const stats = useMemo(() => ({
    total:      rows.length,
    Reconciled: rows.filter(l => l.status==="Reconciled").length,
    Pending:    rows.filter(l => l.status==="Pending").length,
    Priority:   rows.filter(l => l.status==="Priority").length,
  }), [rows]);

  const filtered = useMemo(() => rows.filter(l =>
    (filter === "All" || l.status === filter) &&
    (!search || l.narration.toLowerCase().includes(search.toLowerCase()) || l.refNo.toLowerCase().includes(search.toLowerCase()))
  ), [rows, filter, search]);

  const handleFile = useCallback((file: File) => {
    Papa.parse(file, {
      header: true, skipEmptyLines: true,
      complete: (r) => {
        const data = r.data as Record<string, string>[];
        let matched = 0;
        const lines: BankStatementLine[] = data.map((row, i) => {
          const refNo = row["Ref/Cheque No"] ?? row["Ref"] ?? "";
          const credit = parseFloat(row["Credit"] ?? "") || null;
          const debit = parseFloat(row["Debit"] ?? "") || null;
          const linked = transactions.filter(t => t.bankRefNo === refNo || (credit && Math.abs(t.amount - credit) < 0.01)).map(t => t.id);
          if (linked.length) matched++;
          return { id: `UP-${Date.now()}-${i}`, txnDate: row["Txn Date"] ?? "", valueDate: row["Value Date"] ?? "", narration: row["Narration"] ?? "", refNo, debit, credit, balance: parseFloat(row["Balance"] ?? "0") || 0, linkedTxnIds: linked };
        });
        appendStatementLines(lines);
        toast.success(`Imported ${lines.length} lines · ${matched} auto-matched`);
      },
      error: () => toast.error("Failed to parse CSV"),
    });
  }, [transactions, appendStatementLines]);

  const linkedTxns = useMemo(() => viewModal ? transactions.filter(t => viewModal.linkedTxnIds.includes(t.id)) : [], [viewModal, transactions]);

  return (
    <div className="space-y-5">
      {/* Custom Page Header */}
      <div className="pb-4 border-b border-slate-100 shrink-0">
        <h1 className="text-xl font-bold text-slate-800 font-serif">Bank Statement Reconciliation</h1>
        <p className="text-[12px] text-muted-foreground mt-1">
          SBI Current A/c ..4471 — Temple Hundi & Operations · Statement period 01 Jun – 13 Jun 2026
        </p>
        
        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 mt-3.5">
          <Button variant="outline" size="sm" className="text-xs gap-1.5 bg-white text-slate-700 border-slate-200 hover:bg-slate-50 font-medium" onClick={() => toast.success("Sample file downloaded successfully.")}>
            <ArrowDownToLine className="h-3.5 w-3.5 text-slate-500" /> Sample import file
          </Button>
          <Button variant="outline" size="sm" className="text-xs gap-1.5 bg-white text-slate-700 border-slate-200 hover:bg-slate-50 font-medium" onClick={() => toast.success("Bank statement exported successfully.")}>
            <ArrowUpToLine className="h-3.5 w-3.5 text-slate-500" /> Export statement
          </Button>
          <Button variant="outline" size="sm" className="text-xs gap-1.5 bg-white text-slate-700 border-slate-200 hover:bg-slate-50 font-medium" onClick={() => window.print()}>
            <Printer className="h-3.5 w-3.5 text-slate-500" /> Print bank statement
          </Button>
          <Button variant="outline" size="sm" className="text-xs gap-1.5 bg-white text-slate-700 border-slate-200 hover:bg-slate-50 font-medium" onClick={() => window.print()}>
            <Printer className="h-3.5 w-3.5 text-slate-500" /> Print linked transactions
          </Button>
        </div>
      </div>

      {/* Upload Zone */}
      <div onDragOver={e => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); }}
        onClick={() => fileRef.current?.click()}
        className={cn(
          "rounded-lg border-2 border-dashed flex flex-col items-center py-6 cursor-pointer transition-all duration-200 bg-white",
          dragging ? "border-primary bg-primary/5" : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/30"
        )}>
        <Upload className={cn("h-6 w-6 mb-1 transition-colors", dragging ? "text-primary" : "text-muted-foreground")} />
        <p className="text-sm font-semibold text-slate-700">Upload bank statement <span className="font-normal text-muted-foreground">— drag & drop or click to browse</span></p>
        <p className="text-[11px] text-muted-foreground mt-0.5">Accepted: .csv, .xlsx as per the sample import format · Auto-matches on Ref No / UTR & amount</p>
        <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]); e.target.value = ""; }} />
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="TOTAL TRANSACTIONS" count={stats.total} subtext="All entries in period" borderClass="border-l-4 border-l-slate-400" active={filter==="All"} onClick={() => setFilter("All")} />
        <StatCard label="RECONCILED" count={stats.Reconciled} subtext="Bank ref mapped" borderClass="border-l-4 border-l-emerald-600" active={filter==="Reconciled"} onClick={() => setFilter(p => p==="Reconciled"?"All":"Reconciled")} />
        <StatCard label="PENDING" count={stats.Pending} subtext="Within T+7 days" borderClass="border-l-4 border-l-amber-500" active={filter==="Pending"} onClick={() => setFilter(p => p==="Pending"?"All":"Pending")} />
        <StatCard label="PRIORITY" count={stats.Priority} subtext="Exceeded T+7 days" borderClass="border-l-4 border-l-rose-600" active={filter==="Priority"} onClick={() => setFilter(p => p==="Priority"?"All":"Priority")} />
      </div>

      {/* Search */}
      <div className="relative w-56">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search narration, ref…" className="h-9 pl-8 pr-3 text-xs w-full bg-white" />
      </div>

      {/* Table */}
      <div className="rounded-xl border bg-white overflow-hidden shadow-none">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50">
                {["Txn Date","Narration","Ref / Cheque No","Debit (₹)","Credit (₹)","Balance (₹)","Linked TXN ID","Status"].map(h => (
                  <TableHead key={h} className={cn(
                    "font-semibold text-foreground py-3 text-[12px]",
                    (h.startsWith("Debit") || h.startsWith("Credit") || h.startsWith("Balance")) && "text-right"
                  )}>{h}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0
                ? <TableRow><TableCell colSpan={8} className="text-center py-10 text-muted-foreground">No statement lines</TableCell></TableRow>
                : filtered.map(l => (
                  <TableRow key={l.id}>
                    <TableCell className="py-2.5 whitespace-nowrap">
                      <div>{format(parseISO(l.txnDate), "dd MMM yyyy")}</div>
                      {l.status === "Priority" && <div className="text-[9px] text-destructive font-bold">T+{getDaysOverdue(l.txnDate, now)}d</div>}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate text-muted-foreground py-2.5">{l.narration}</TableCell>
                    <TableCell className="font-mono text-[11px] text-primary font-medium py-2.5">{l.refNo}</TableCell>
                    <TableCell className="text-right font-mono text-destructive py-2.5">{l.debit ? formatINR(l.debit) : "—"}</TableCell>
                    <TableCell className="text-right font-mono text-emerald-700 py-2.5">{l.credit ? formatINR(l.credit) : "—"}</TableCell>
                    <TableCell className="text-right font-mono text-muted-foreground py-2.5">{formatINR(l.balance)}</TableCell>
                    <TableCell className="py-2.5">
                      {l.linkedTxnIds.length === 0
                        ? <span className="text-muted-foreground/50 italic text-[11px]">— unmatched —</span>
                        : l.linkedTxnIds.length === 1
                          ? <span className="font-mono text-[11px] text-primary font-medium">{l.linkedTxnIds[0]}</span>
                          : <Button onClick={() => setViewModal(l)} variant="link" className="h-auto p-0 text-[11px] text-primary font-semibold flex items-center gap-1">
                              <Eye className="h-3 w-3" />{l.linkedTxnIds.length} IDs
                            </Button>
                      }
                    </TableCell>
                    <TableCell className="py-2.5"><StatusBadge s={l.status} /></TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
        <div className="px-4 py-2 border-t text-[10px] text-muted-foreground">{filtered.length} of {statementLines.length} lines</div>
      </div>

      {/* Linked TXNs modal */}
      <Dialog open={!!viewModal} onOpenChange={() => setViewModal(null)}>
        <DialogContent className="max-w-3xl max-h-[75vh] flex flex-col">
          <DialogHeader><DialogTitle className="text-sm">Linked Transactions — {viewModal?.refNo}</DialogTitle></DialogHeader>
          <div className="overflow-auto flex-1 text-xs">
            <Table>
              <TableHeader>
                <TableRow>
                  {["TXN ID","Date","Description","Amount (₹)","Status"].map(h => <TableHead key={h} className="font-semibold text-foreground">{h}</TableHead>)}
                </TableRow>
              </TableHeader>
              <TableBody>
                {linkedTxns.map(t => (
                  <TableRow key={t.id}>
                    <TableCell className="font-mono text-[11px] text-primary font-semibold">{t.id}</TableCell>
                    <TableCell>{format(parseISO(t.date), "dd MMM yyyy")}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{t.description}</TableCell>
                    <TableCell className={cn("text-right font-mono", t.amount<0?"text-destructive":"text-emerald-700")}>{formatINR(t.amount)}</TableCell>
                    <TableCell><StatusBadge s={getTransactionStatus(t, now)} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function BankReconciliationPage() {
  return (
    <ReconciliationProvider>
      <div className="w-full">
        <BankRecon />
      </div>
    </ReconciliationProvider>
  );
}
