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
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Search, Plus, Eye, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import {
  procurementInvoices, goodsReceipts, createInvoice, verifyInvoice,
  type ProcurementInvoice as InvType
} from "@/stores/procurementStore";

const statusColor: Record<string, string> = {
  Pending: "bg-amber-50 text-amber-700 border-amber-200",
  Verified: "bg-blue-50 text-blue-700 border-blue-200",
  Paid: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

const formatCurrency = (val: number) => `₹${val.toLocaleString("en-IN")}`;

const ProcurementInvoicePage = () => {
  const [, setTick] = useState(0);
  const refresh = () => setTick(t => t + 1);
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [selected, setSelected] = useState<InvType | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  // Form
  const [selectedGRNId, setSelectedGRNId] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");

  const eligibleGRNs = useMemo(() => {
    const invoicedGRNIds = new Set(procurementInvoices.map(i => i.grnId));
    return goodsReceipts.filter(g => !invoicedGRNIds.has(g.id) && g.status !== "Pending");
  }, [showCreate, procurementInvoices.length]);

  const handleSelectGRN = (grnId: string) => {
    setSelectedGRNId(grnId);
    const grn = goodsReceipts.find(g => g.id === grnId);
    if (grn) {
      const total = grn.items.reduce((s, item) => s + item.acceptedQty * item.unitPrice, 0);
      setAmount(String(total));
    }
  };

  const handleSave = () => {
    if (!selectedGRNId) { toast.error("Select a GRN"); return; }
    if (!invoiceNumber) { toast.error("Enter invoice number"); return; }
    if (!amount || Number(amount) <= 0) { toast.error("Enter valid amount"); return; }

    const grn = goodsReceipts.find(g => g.id === selectedGRNId);
    if (!grn) return;

    const inv = createInvoice({
      invoiceNumber,
      grnId: selectedGRNId,
      poId: grn.poId,
      requestId: grn.requestId,
      freelancerId: grn.freelancerId,
      freelancerName: grn.freelancerName,
      amount: Number(amount),
      invoiceDate: new Date().toISOString().slice(0, 10),
      dueDate: dueDate || new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
      notes,
    });

    if (!inv) { toast.error("Cannot create invoice. GRN not found."); return; }
    toast.success(`Invoice ${inv.id} created`);
    setShowCreate(false);
    resetForm();
    refresh();
  };

  const handleVerify = (invId: string) => {
    if (verifyInvoice(invId)) {
      toast.success("Invoice verified");
      refresh();
    }
  };

  const resetForm = () => {
    setSelectedGRNId(""); setInvoiceNumber(""); setAmount(""); setDueDate(""); setNotes("");
  };

  const filtered = useMemo(() =>
    procurementInvoices.filter(i =>
      !search || i.id.toLowerCase().includes(search.toLowerCase()) ||
      i.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      i.freelancerName.toLowerCase().includes(search.toLowerCase())
    ), [search, procurementInvoices.length]
  );

  const stats = useMemo(() => ({
    total: procurementInvoices.length,
    pending: procurementInvoices.filter(i => i.status === "Pending").length,
    verified: procurementInvoices.filter(i => i.status === "Verified").length,
    paid: procurementInvoices.filter(i => i.status === "Paid").length,
    totalAmount: procurementInvoices.reduce((s, i) => s + i.amount, 0),
  }), [procurementInvoices.length]);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Invoices</h1>
          <p className="text-muted-foreground text-sm">Supplier invoices linked to goods receipts</p>
        </div>
        <Button onClick={() => setShowCreate(true)} size="sm"><Plus className="h-4 w-4 mr-1" /> New Invoice</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card><CardContent className="p-4 text-center">
          <div className="text-2xl font-bold">{stats.total}</div>
          <div className="text-xs text-muted-foreground">Total</div>
        </CardContent></Card>
        <Card><CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-amber-600">{stats.pending}</div>
          <div className="text-xs text-muted-foreground">Pending</div>
        </CardContent></Card>
        <Card><CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.verified}</div>
          <div className="text-xs text-muted-foreground">Verified</div>
        </CardContent></Card>
        <Card><CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-emerald-600">{formatCurrency(stats.totalAmount)}</div>
          <div className="text-xs text-muted-foreground">Total Value</div>
        </CardContent></Card>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search invoices..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice ID</TableHead>
              <TableHead>Invoice #</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead>GRN</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(inv => (
              <TableRow key={inv.id} className="cursor-pointer hover:bg-muted/50" onClick={() => { setSelected(inv); setSheetOpen(true); }}>
                <TableCell className="font-medium">{inv.id}</TableCell>
                <TableCell>{inv.invoiceNumber}</TableCell>
                <TableCell>{inv.freelancerName}</TableCell>
                <TableCell>{inv.grnId}</TableCell>
                <TableCell className="text-right font-medium">{formatCurrency(inv.amount)}</TableCell>
                <TableCell>{inv.invoiceDate}</TableCell>
                <TableCell><Badge variant="outline" className={statusColor[inv.status]}>{inv.status}</Badge></TableCell>
                <TableCell className="text-right space-x-1">
                  {inv.status === "Pending" && (
                    <Button variant="outline" size="sm" onClick={e => { e.stopPropagation(); handleVerify(inv.id); }}>
                      <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Verify
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" onClick={e => { e.stopPropagation(); setSelected(inv); setSheetOpen(true); }}>
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">No invoices found</TableCell></TableRow>
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
                  <FileText className="h-5 w-5" /> {selected.id}
                </SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-3 text-sm">
                <div className="grid grid-cols-2 gap-3">
                  <div><span className="text-muted-foreground">Invoice #:</span> <span className="font-medium">{selected.invoiceNumber}</span></div>
                  <div><span className="text-muted-foreground">Supplier:</span> <span className="font-medium">{selected.freelancerName}</span></div>
                  <div><span className="text-muted-foreground">Amount:</span> <span className="font-medium">{formatCurrency(selected.amount)}</span></div>
                  <div><span className="text-muted-foreground">Status:</span> <Badge variant="outline" className={statusColor[selected.status]}>{selected.status}</Badge></div>
                  <div><span className="text-muted-foreground">Date:</span> <span className="font-medium">{selected.invoiceDate}</span></div>
                  <div><span className="text-muted-foreground">Due:</span> <span className="font-medium">{selected.dueDate}</span></div>
                </div>
                <div className="text-xs text-muted-foreground border-t pt-3 space-y-1">
                  <div>🔗 Request: {selected.requestId} → PO: {selected.poId} → GRN: {selected.grnId} → Invoice: {selected.id}</div>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Create Dialog */}
      <Dialog open={showCreate} onOpenChange={v => { if (!v) resetForm(); setShowCreate(v); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Create Invoice</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Goods Receipt *</Label>
              <Select value={selectedGRNId} onValueChange={handleSelectGRN}>
                <SelectTrigger><SelectValue placeholder="Select GRN..." /></SelectTrigger>
                <SelectContent>
                  {eligibleGRNs.length === 0 && <SelectItem value="none" disabled>No eligible GRNs</SelectItem>}
                  {eligibleGRNs.map(grn => (
                    <SelectItem key={grn.id} value={grn.id}>
                      {grn.id} — {grn.freelancerName} (PO: {grn.poId})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {eligibleGRNs.length === 0 && (
                <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> No GRNs available. Create a GRN first.
                </p>
              )}
            </div>
            <div>
              <Label>Invoice Number *</Label>
              <Input value={invoiceNumber} onChange={e => setInvoiceNumber(e.target.value)} placeholder="e.g., SUP-INV-2026-002" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Amount *</Label>
                <Input type="number" value={amount} onChange={e => setAmount(e.target.value)} />
              </div>
              <div>
                <Label>Due Date</Label>
                <Input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
              </div>
            </div>
            <div>
              <Label>Notes</Label>
              <Textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Optional remarks..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowCreate(false); resetForm(); }}>Cancel</Button>
            <Button onClick={handleSave}>Create Invoice</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default ProcurementInvoicePage;
