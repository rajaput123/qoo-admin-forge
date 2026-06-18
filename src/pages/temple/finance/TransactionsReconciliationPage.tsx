import { useState, useMemo } from "react";
import { toast } from "sonner";
import { CheckCircle2, Clock, AlertTriangle, Search, Link2, Check, X, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { ReconciliationProvider, useReconciliation, getTransactionStatus, getDaysOverdue, formatINR } from "@/stores/reconciliationStore";
import { format, parseISO } from "date-fns";
import type { Transaction, ReconciliationStatus } from "@/stores/reconciliationStore";

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

// ── Map Modal (bank line selector) ─────────────────────────────────────────

function MapModal({ open, onClose, onSelect }: { open: boolean; onClose: () => void; onSelect: (id: string, ref: string) => void }) {
  const { statementLines } = useReconciliation();
  const free = statementLines.filter(l => l.linkedTxnIds.length === 0);
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[70vh] flex flex-col">
        <DialogHeader><DialogTitle className="text-sm">Select Bank Statement Line</DialogTitle></DialogHeader>
        <div className="overflow-auto flex-1 text-xs">
          <Table>
            <TableHeader>
              <TableRow>
                {["Date","Narration","Ref No","Debit","Credit",""].map(h => <TableHead key={h} className="font-semibold text-muted-foreground">{h}</TableHead>)}
              </TableRow>
            </TableHeader>
            <TableBody>
              {free.length === 0
                ? <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">All lines linked</TableCell></TableRow>
                : free.map(l => (
                  <TableRow key={l.id} className="hover:bg-muted/50">
                    <TableCell>{format(parseISO(l.txnDate), "dd MMM yyyy")}</TableCell>
                    <TableCell className="max-w-[180px] truncate">{l.narration}</TableCell>
                    <TableCell className="font-mono text-primary font-medium">{l.refNo}</TableCell>
                    <TableCell className="text-right text-destructive font-mono">{l.debit ? formatINR(l.debit) : "—"}</TableCell>
                    <TableCell className="text-right text-emerald-700 font-mono">{l.credit ? formatINR(l.credit) : "—"}</TableCell>
                    <TableCell>
                      <Button onClick={() => onSelect(l.id, l.refNo)} size="sm" className="h-7 text-[10px] px-2">Select</Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── Bank Ref Cell ──────────────────────────────────────────────────────────

function BankRefCell({ txn }: { txn: Transaction }) {
  const { applyBankRef } = useReconciliation();
  const [val, setVal] = useState(txn.bankRefNo ?? "");
  const [modal, setModal] = useState(false);
  if (txn.bankRefNo) return (
    <div className="flex items-center gap-1.5">
      <span className="font-mono text-[11px] text-primary font-medium">{txn.bankRefNo}</span>
      {txn.nature === "Payment Gateway" && <Badge variant="outline" className="text-[9px] bg-primary/10 text-primary border-none py-0">RZP</Badge>}
    </div>
  );
  return (
    <div className="flex items-center gap-1">
      <Input value={val} onChange={e => setVal(e.target.value)}
        onKeyDown={e => { if (e.key === "Enter" && val.trim()) { applyBankRef(txn.id, val.trim()); toast.success(`${txn.id} mapped`); }}}
        placeholder="Enter ref…" className="h-7 px-2 text-[11px] font-mono w-28 border-dashed" />
      <Button onClick={() => setModal(true)} variant="link" className="h-7 px-1.5 text-[10px] text-primary flex items-center gap-0.5">
        <Link2 className="h-2.5 w-2.5" />Map
      </Button>
      <MapModal open={modal} onClose={() => setModal(false)} onSelect={(id, ref) => { applyBankRef(txn.id, ref, id); setModal(false); toast.success(`Mapped to ${ref}`); }} />
    </div>
  );
}

// ── Main Page Content ────────────────────────────────────────────────────────

function TxnRecon() {
  const { transactions, now, bulkApplyBankRef } = useReconciliation();
  const [filter, setFilter] = useState<ReconciliationStatus | "All">("All");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkRef, setBulkRef] = useState("");

  const rows = useMemo(() => transactions.map(t => ({ ...t, status: getTransactionStatus(t, now) })), [transactions, now]);

  const stats = useMemo(() => ({
    total:      { count: rows.length, amount: rows.reduce((s,t) => s+t.amount,0) },
    Reconciled: { count: rows.filter(t=>t.status==="Reconciled").length, amount: rows.filter(t=>t.status==="Reconciled").reduce((s,t)=>s+t.amount,0) },
    Pending:    { count: rows.filter(t=>t.status==="Pending").length,    amount: rows.filter(t=>t.status==="Pending").reduce((s,t)=>s+t.amount,0) },
    Priority:   { count: rows.filter(t=>t.status==="Priority").length,   amount: rows.filter(t=>t.status==="Priority").reduce((s,t)=>s+t.amount,0) },
  }), [rows]);

  const filtered = useMemo(() => rows.filter(t =>
    (filter === "All" || t.status === filter) &&
    (!search || t.id.toLowerCase().includes(search.toLowerCase()) || t.description.toLowerCase().includes(search.toLowerCase()))
  ), [rows, filter, search]);

  const selectableIds = filtered.filter(t => t.status !== "Reconciled").map(t => t.id);
  const allSel = selectableIds.length > 0 && selectableIds.every(id => selected.has(id));

  const toggleAll = () => setSelected(allSel ? new Set() : new Set(selectableIds));
  const toggle = (id: string) => setSelected(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const applyBulk = () => {
    if (!bulkRef.trim() || selected.size === 0) return;
    bulkApplyBankRef(Array.from(selected), bulkRef.trim());
    toast.success(`${selected.size} transactions mapped`);
    setSelected(new Set()); setBulkRef("");
  };

  return (
    <div className="space-y-5">
      {/* Custom Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-100 shrink-0 gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-800 font-serif">Transactions Reconciliation</h1>
          <p className="text-[12px] text-muted-foreground mt-1">
            Match every temple receipt & payment to a bank reference. Pending items turn <span className="text-destructive font-semibold">Priority</span> after T+7 days.
          </p>
        </div>
        <Button variant="outline" size="sm" className="text-xs gap-1.5 bg-white text-slate-700 border-slate-200 shrink-0 font-medium hover:bg-slate-50" onClick={() => window.print()}>
          <Printer className="h-3.5 w-3.5" /> Print view
        </Button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="TOTAL TRANSACTIONS" count={stats.total.count} subtext="All entries in period" borderClass="border-l-4 border-l-slate-400" active={filter==="All"} onClick={() => setFilter("All")} />
        <StatCard label="RECONCILED" count={stats.Reconciled.count} subtext="Bank ref mapped" borderClass="border-l-4 border-l-emerald-600" active={filter==="Reconciled"} onClick={() => setFilter(p => p==="Reconciled"?"All":"Reconciled")} />
        <StatCard label="PENDING" count={stats.Pending.count} subtext="Within T+7 days" borderClass="border-l-4 border-l-amber-500" active={filter==="Pending"} onClick={() => setFilter(p => p==="Pending"?"All":"Pending")} />
        <StatCard label="PRIORITY" count={stats.Priority.count} subtext="Exceeded T+7 days" borderClass="border-l-4 border-l-rose-600" active={filter==="Priority"} onClick={() => setFilter(p => p==="Priority"?"All":"Priority")} />
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search ID, description…"
            className="h-9 pl-8 pr-3 text-xs w-56 bg-white" />
        </div>
        {filter !== "All" && <Badge variant="outline" className="text-[10px] bg-primary/5 text-primary border-primary/20 py-1">{filter} · {filtered.length} rows</Badge>}
      </div>

      {/* Bulk bar */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-foreground text-background text-xs animate-fadeIn">
          <span className="font-semibold text-white">{selected.size} selected</span>
          <Input value={bulkRef} onChange={e => setBulkRef(e.target.value)} onKeyDown={e => e.key==="Enter" && applyBulk()}
            placeholder="Bank ref no…" className="h-7 px-2 rounded bg-white/10 border-0 text-white placeholder:text-white/50 font-mono text-xs flex-1 max-w-[180px] focus-visible:ring-1 focus-visible:ring-white/20" />
          <Button onClick={applyBulk} disabled={!bulkRef.trim()} size="sm" className="h-7 px-3 text-[11px] gap-1 font-semibold bg-white text-slate-900 hover:bg-white/90">
            <Check className="h-3 w-3" /> Apply
          </Button>
          <Button onClick={() => { setSelected(new Set()); setBulkRef(""); }} variant="ghost" size="sm" className="h-7 text-[11px] text-white/70 hover:text-white hover:bg-white/10">
            <X className="h-3 w-3" /> Clear
          </Button>
        </div>
      )}

      {/* Table */}
      <div className="rounded-xl border bg-white overflow-hidden shadow-none">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50">
                <TableHead className="w-10 text-center"><Checkbox checked={allSel} onCheckedChange={toggleAll} className="h-3.5 w-3.5" /></TableHead>
                {["TXN ID","Date","Type","Description","Nature","Amount (₹)","Bank Ref No","Status"].map(h => (
                  <TableHead key={h} className={cn(
                    "font-semibold text-foreground py-3 text-[12px]",
                    h.startsWith("Amount") && "text-right"
                  )}>{h}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0
                ? <TableRow><TableCell colSpan={9} className="text-center py-10 text-muted-foreground">No records found</TableCell></TableRow>
                : filtered.map(txn => (
                  <TableRow key={txn.id} className={cn(selected.has(txn.id) && "bg-primary/5")}>
                    <TableCell className="text-center"><Checkbox checked={selected.has(txn.id)} disabled={txn.status==="Reconciled"} onCheckedChange={() => toggle(txn.id)} className="h-3.5 w-3.5" /></TableCell>
                    <TableCell className="font-mono text-[11px] text-primary font-semibold py-2.5">{txn.id}</TableCell>
                    <TableCell className="py-2.5 whitespace-nowrap">
                      <div>{format(parseISO(txn.date), "dd MMM yyyy")}</div>
                      {txn.status === "Priority" && <div className="text-[9px] text-destructive font-bold">T+{getDaysOverdue(txn.date, now)}d</div>}
                    </TableCell>
                    <TableCell className="py-2.5"><Badge variant="outline" className="bg-primary/5 text-primary border-none text-[10px] px-1.5 py-0">{txn.type}</Badge></TableCell>
                    <TableCell className="max-w-[200px] truncate text-muted-foreground py-2.5">{txn.description}</TableCell>
                    <TableCell className="text-muted-foreground py-2.5">{txn.nature}</TableCell>
                    <TableCell className={cn("text-right font-mono font-semibold py-2.5", txn.amount < 0 ? "text-destructive" : "text-emerald-700")}>
                      {txn.amount < 0 ? "−" : ""}{formatINR(txn.amount)}
                    </TableCell>
                    <TableCell className="min-w-[160px] py-2.5"><BankRefCell txn={txn} /></TableCell>
                    <TableCell className="py-2.5"><StatusBadge s={txn.status} /></TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
        <div className="px-4 py-2 border-t text-[10px] text-muted-foreground">{filtered.length} of {transactions.length} transactions</div>
      </div>
    </div>
  );
}

export default function TransactionsReconciliationPage() {
  return (
    <ReconciliationProvider>
      <div className="w-full">
        <TxnRecon />
      </div>
    </ReconciliationProvider>
  );
}
