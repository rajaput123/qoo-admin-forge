import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Wallet, Search, Plus, Eye, AlertCircle, CheckCircle2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import {
  procurementInvoices, procurementPayments, procurementTransactions, procurementLedger,
  createPayment, type ProcurementPayment as PayType
} from "@/stores/procurementStore";

const formatCurrency = (val: number) => `₹${val.toLocaleString("en-IN")}`;

const ProcurementPaymentPage = () => {
  const [, setTick] = useState(0);
  const refresh = () => setTick(t => t + 1);
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [selected, setSelected] = useState<PayType | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  // Form
  const [selectedInvoiceId, setSelectedInvoiceId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"Cash" | "Bank" | "UPI">("Bank");
  const [amount, setAmount] = useState("");
  const [referenceNumber, setReferenceNumber] = useState("");

  const payableInvoices = useMemo(() =>
    procurementInvoices.filter(i => i.status === "Verified"), [showCreate, procurementInvoices.length]
  );

  const handleSelectInvoice = (invId: string) => {
    setSelectedInvoiceId(invId);
    const inv = procurementInvoices.find(i => i.id === invId);
    if (inv) setAmount(String(inv.amount));
  };

  const handleSave = () => {
    if (!selectedInvoiceId) { toast.error("Select an invoice"); return; }
    if (!amount || Number(amount) <= 0) { toast.error("Enter valid amount"); return; }

    const inv = procurementInvoices.find(i => i.id === selectedInvoiceId);
    if (!inv) return;

    const result = createPayment({
      invoiceId: selectedInvoiceId,
      poId: inv.poId,
      requestId: inv.requestId,
      freelancerId: inv.freelancerId,
      freelancerName: inv.freelancerName,
      amount: Number(amount),
      paymentMethod,
      paymentDate: new Date().toISOString().slice(0, 10),
      referenceNumber,
      status: Number(amount) >= inv.amount ? "Full" : "Partial",
    });

    if (!result) { toast.error("Cannot create payment. Invoice may already be paid."); return; }

    toast.success(
      <div className="space-y-1">
        <div>✅ Payment {result.payment.id} recorded</div>
        <div className="text-xs text-muted-foreground">Transaction {result.transaction.id} & Ledger {result.ledger.id} auto-created</div>
      </div>
    );
    setShowCreate(false);
    resetForm();
    refresh();
  };

  const resetForm = () => {
    setSelectedInvoiceId(""); setPaymentMethod("Bank"); setAmount(""); setReferenceNumber("");
  };

  const filtered = useMemo(() =>
    procurementPayments.filter(p =>
      !search || p.id.toLowerCase().includes(search.toLowerCase()) ||
      p.freelancerName.toLowerCase().includes(search.toLowerCase()) ||
      p.invoiceId.toLowerCase().includes(search.toLowerCase())
    ), [search, procurementPayments.length]
  );

  const stats = useMemo(() => ({
    total: procurementPayments.length,
    totalAmount: procurementPayments.reduce((s, p) => s + p.amount, 0),
    transactions: procurementTransactions.length,
    ledgerEntries: procurementLedger.length,
  }), [procurementPayments.length]);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Payments</h1>
          <p className="text-muted-foreground text-sm">Record payments against verified invoices → auto-creates Transaction & Ledger</p>
        </div>
        <Button onClick={() => setShowCreate(true)} size="sm"><Plus className="h-4 w-4 mr-1" /> Record Payment</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card><CardContent className="p-4 text-center">
          <div className="text-2xl font-bold">{stats.total}</div>
          <div className="text-xs text-muted-foreground">Payments</div>
        </CardContent></Card>
        <Card><CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-emerald-600">{formatCurrency(stats.totalAmount)}</div>
          <div className="text-xs text-muted-foreground">Total Paid</div>
        </CardContent></Card>
        <Card><CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.transactions}</div>
          <div className="text-xs text-muted-foreground">Transactions</div>
        </CardContent></Card>
        <Card><CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">{stats.ledgerEntries}</div>
          <div className="text-xs text-muted-foreground">Ledger Entries</div>
        </CardContent></Card>
      </div>

      {/* Flow indicator */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 rounded-lg p-3">
        <span className="font-medium">Auto-flow:</span>
        <span>Payment</span> <ArrowRight className="h-3 w-3" />
        <span>Transaction</span> <ArrowRight className="h-3 w-3" />
        <span>Ledger Entry</span>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search payments..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Payment ID</TableHead>
              <TableHead>Invoice</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(pay => (
              <TableRow key={pay.id} className="cursor-pointer hover:bg-muted/50" onClick={() => { setSelected(pay); setSheetOpen(true); }}>
                <TableCell className="font-medium">{pay.id}</TableCell>
                <TableCell>{pay.invoiceId}</TableCell>
                <TableCell>{pay.freelancerName}</TableCell>
                <TableCell className="text-right font-medium">{formatCurrency(pay.amount)}</TableCell>
                <TableCell><Badge variant="outline">{pay.paymentMethod}</Badge></TableCell>
                <TableCell>{pay.paymentDate}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={pay.status === "Full" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}>
                    {pay.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={e => { e.stopPropagation(); setSelected(pay); setSheetOpen(true); }}>
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">No payments found</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Detail Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="sm:max-w-lg overflow-y-auto">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5" /> {selected.id}
                </SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-3">
                  <div><span className="text-muted-foreground">Invoice:</span> <span className="font-medium">{selected.invoiceId}</span></div>
                  <div><span className="text-muted-foreground">PO:</span> <span className="font-medium">{selected.poId}</span></div>
                  <div><span className="text-muted-foreground">Supplier:</span> <span className="font-medium">{selected.freelancerName}</span></div>
                  <div><span className="text-muted-foreground">Amount:</span> <span className="font-medium">{formatCurrency(selected.amount)}</span></div>
                  <div><span className="text-muted-foreground">Method:</span> <span className="font-medium">{selected.paymentMethod}</span></div>
                  <div><span className="text-muted-foreground">Reference:</span> <span className="font-medium">{selected.referenceNumber || "—"}</span></div>
                </div>
                <div className="text-xs text-muted-foreground border-t pt-3 space-y-1">
                  <div className="font-medium">Full Traceability Chain:</div>
                  <div>📋 Request: {selected.requestId}</div>
                  <div>📦 PO: {selected.poId}</div>
                  <div>📄 Invoice: {selected.invoiceId}</div>
                  <div>💰 Payment: {selected.id}</div>
                  <div>📊 Auto → Transaction & Ledger created</div>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Create Dialog */}
      <Dialog open={showCreate} onOpenChange={v => { if (!v) resetForm(); setShowCreate(v); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Record Payment</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Invoice *</Label>
              <Select value={selectedInvoiceId} onValueChange={handleSelectInvoice}>
                <SelectTrigger><SelectValue placeholder="Select verified invoice..." /></SelectTrigger>
                <SelectContent>
                  {payableInvoices.length === 0 && <SelectItem value="none" disabled>No verified invoices</SelectItem>}
                  {payableInvoices.map(inv => (
                    <SelectItem key={inv.id} value={inv.id}>
                      {inv.id} — {inv.freelancerName} ({formatCurrency(inv.amount)})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {payableInvoices.length === 0 && (
                <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> No verified invoices. Verify an invoice first.
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Amount *</Label>
                <Input type="number" value={amount} onChange={e => setAmount(e.target.value)} />
              </div>
              <div>
                <Label>Payment Method *</Label>
                <Select value={paymentMethod} onValueChange={v => setPaymentMethod(v as any)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cash">Cash</SelectItem>
                    <SelectItem value="Bank">Bank Transfer</SelectItem>
                    <SelectItem value="UPI">UPI</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Reference Number</Label>
              <Input value={referenceNumber} onChange={e => setReferenceNumber(e.target.value)} placeholder="UTR / Cheque No / Transaction ID" />
            </div>

            <div className="bg-muted/50 rounded-lg p-3 text-xs text-muted-foreground space-y-1">
              <div className="font-medium flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Auto-generated on payment:</div>
              <div>• Transaction record (Expense type)</div>
              <div>• Ledger entry (Debit: Expense, Credit: Cash/Bank)</div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowCreate(false); resetForm(); }}>Cancel</Button>
            <Button onClick={handleSave}>Record Payment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default ProcurementPaymentPage;
