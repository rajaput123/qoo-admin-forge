import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { NeftRtgsRemittanceForm } from "@/components/finance/NeftRtgsRemittanceForm";
import { VoucherPrintDialog } from "@/components/finance/VoucherPrintDialog";
import { defaultNeftRtgsTemplate, type NeftRtgsFormData } from "@/data/neftRtgsTemplateData";
import { isNeftRtgsMode, buildVendorNeftForm, mergeNeftForm } from "@/lib/neftRtgsUtils";

const formatCurrency = (val: number) => `₹${val.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

const mockStats = {
  paidThisMonth: { amount: 98000, count: 3 },
  pendingPayment: { amount: 57500, count: 2 },
  overdue: { amount: 45000, count: 1 },
  tdsDeducted: 4200,
};

const mockPayments = [
  { id: "vp001", date: "2026-06-05", vendor: "Philips Electricals", invoiceNo: "INV-inv002", mode: "NEFT", bank: "HDFC Bank", utr: "NEFT88291034", paid: 9800, tds: 980, status: "Paid" },
  { id: "vp002", date: "2026-06-02", vendor: "Flower Vendor", invoiceNo: "INV-inv003", mode: "BANK", bank: "SBI Current", utr: "UTR77283910", paid: 6200, tds: 620, status: "Paid" },
  { id: "vp003", date: "2026-05-28", vendor: "Security Services Ltd", invoiceNo: "INV-sec001", mode: "CHEQUE", bank: "—", utr: "CHQ-445821", paid: 22000, tds: 2200, status: "Paid" },
];

interface AgeingItem {
  invoiceNo: string;
  vendor: string;
  invoiceDate: string;
  dueDate: string;
  invoiceAmt: number;
  paid: number;
  outstanding: number;
  ageing: string;
  priority: string;
}

const mockAgeing: AgeingItem[] = [
  { invoiceNo: "INV-inv001", vendor: "Sri Pooja Stores", invoiceDate: "2026-06-05", dueDate: "2026-07-05", invoiceAmt: 12500, paid: 0, outstanding: 12500, ageing: "0 days", priority: "Routine" },
  { invoiceNo: "INV-inv004", vendor: "Temple Catering Co.", invoiceDate: "2026-06-03", dueDate: "2026-07-03", invoiceAmt: 45000, paid: 0, outstanding: 45000, ageing: "3 days", priority: "Urgent" },
];

const ProcurementPaymentPage = () => {
  const [recordOpen, setRecordOpen] = useState(false);
  const [payNowItem, setPayNowItem] = useState<AgeingItem | null>(null);
  const [form, setForm] = useState({ vendor: "", invoiceNo: "", amount: "", mode: "NEFT", utr: "" });
  const [voucherPreviewOpen, setVoucherPreviewOpen] = useState(false);
  const [previewNeftForm, setPreviewNeftForm] = useState<NeftRtgsFormData | null>(null);

  const showNeftForm = isNeftRtgsMode(form.mode);

  const openRecord = (prefill?: AgeingItem) => {
    if (prefill) {
      setForm({ vendor: prefill.vendor, invoiceNo: prefill.invoiceNo, amount: String(prefill.outstanding), mode: "NEFT", utr: "" });
      setPayNowItem(prefill);
    } else {
      setForm({ vendor: "", invoiceNo: "", amount: "", mode: "NEFT", utr: "" });
      setPayNowItem(null);
    }
    setPreviewNeftForm(null);
    setVoucherPreviewOpen(false);
    setRecordOpen(true);
  };

  const closeRecord = () => {
    setRecordOpen(false);
    setPayNowItem(null);
    setPreviewNeftForm(null);
    setVoucherPreviewOpen(false);
    setForm({ vendor: "", invoiceNo: "", amount: "", mode: "NEFT", utr: "" });
  };

  const handleOpenNeftPreview = () => {
    if (!form.vendor.trim()) {
      toast.error("Vendor is required");
      return;
    }
    if (!form.amount || Number(form.amount) <= 0) {
      toast.error("Amount is required");
      return;
    }
    setPreviewNeftForm(buildVendorNeftForm(form.vendor, form.amount, form.invoiceNo));
    setVoucherPreviewOpen(true);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Paid This Month", value: mockStats.paidThisMonth.amount, sub: `${mockStats.paidThisMonth.count} transactions`, color: "text-green-700", bg: "bg-green-50 border-green-200" },
          { label: "Pending Payment", value: mockStats.pendingPayment.amount, sub: `${mockStats.pendingPayment.count} invoices`, color: "text-amber-700", bg: "bg-amber-50 border-amber-200" },
          { label: "Overdue", value: mockStats.overdue.amount, sub: `${mockStats.overdue.count} overdue — Urgent`, color: "text-red-700", bg: "bg-red-50 border-red-200" },
          { label: "TDS Deducted", value: mockStats.tdsDeducted, sub: "This month", color: "text-blue-700", bg: "bg-blue-50 border-blue-200" },
        ].map((s) => (
          <Card key={s.label} className={`${s.bg} border`}>
            <CardContent className="p-4">
              <div className={`text-xs font-bold uppercase tracking-wider mb-2 ${s.color} opacity-80`}>{s.label}</div>
              <div className={`text-2xl font-bold ${s.color}`}>{formatCurrency(s.value)}</div>
              <div className={`text-xs mt-1 opacity-70 ${s.color}`}>{s.sub}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-5">
            <h1 className="text-lg font-semibold">Recent Payments Registry</h1>
            <Button size="sm" className="text-xs gap-1.5" onClick={() => openRecord()}>
              <Plus className="h-3.5 w-3.5" /> Record Payment
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="text-xs">Payment Ref</TableHead>
                <TableHead className="text-xs">Date</TableHead>
                <TableHead className="text-xs">Vendor</TableHead>
                <TableHead className="text-xs">Invoice No</TableHead>
                <TableHead className="text-xs">Mode</TableHead>
                <TableHead className="text-xs">Bank / UTR</TableHead>
                <TableHead className="text-xs text-right">Paid (₹)</TableHead>
                <TableHead className="text-xs text-right">TDS (₹)</TableHead>
                <TableHead className="text-xs text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockPayments.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="text-xs font-mono text-muted-foreground">V-{p.id.slice(2)}</TableCell>
                  <TableCell className="text-xs">{p.date}</TableCell>
                  <TableCell className="text-xs font-medium">{p.vendor}</TableCell>
                  <TableCell className="text-xs font-mono">{p.invoiceNo}</TableCell>
                  <TableCell><Badge variant="secondary" className="text-[10px] uppercase">{p.mode}</Badge></TableCell>
                  <TableCell className="text-xs font-mono text-muted-foreground">
                    <div className="opacity-60">{p.bank}</div>
                    <div className="font-bold">{p.utr}</div>
                  </TableCell>
                  <TableCell className="text-xs font-bold text-green-700 text-right">{formatCurrency(p.paid)}</TableCell>
                  <TableCell className="text-xs text-right">{formatCurrency(p.tds)}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-[10px] uppercase">{p.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-5">
          <h2 className="text-lg font-semibold mb-5">Payment Ageing Report — As on {new Date().toISOString().split("T")[0]}</h2>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="text-xs">Invoice No</TableHead>
                <TableHead className="text-xs">Vendor</TableHead>
                <TableHead className="text-xs">Invoice Date</TableHead>
                <TableHead className="text-xs">Due Date</TableHead>
                <TableHead className="text-xs text-right">Invoice Amt</TableHead>
                <TableHead className="text-xs text-right">Paid</TableHead>
                <TableHead className="text-xs text-right">Outstanding</TableHead>
                <TableHead className="text-xs text-center">Ageing</TableHead>
                <TableHead className="text-xs text-center">Priority</TableHead>
                <TableHead className="text-xs text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockAgeing.map((item) => (
                <TableRow key={item.invoiceNo}>
                  <TableCell className="text-xs font-mono">{item.invoiceNo}</TableCell>
                  <TableCell className="text-xs font-medium">{item.vendor}</TableCell>
                  <TableCell className="text-xs">{item.invoiceDate}</TableCell>
                  <TableCell className={`text-xs font-medium ${item.priority === "Urgent" ? "text-red-700" : ""}`}>{item.dueDate}</TableCell>
                  <TableCell className="text-xs font-bold text-right">{formatCurrency(item.invoiceAmt)}</TableCell>
                  <TableCell className="text-xs text-right">{formatCurrency(item.paid)}</TableCell>
                  <TableCell className={`text-xs font-bold text-right ${item.outstanding > 40000 ? "text-red-700" : "text-amber-700"}`}>{formatCurrency(item.outstanding)}</TableCell>
                  <TableCell className="text-center"><Badge variant="outline" className="text-[10px]">{item.ageing}</Badge></TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className={item.priority === "Urgent" ? "bg-red-50 text-red-700 border-red-200" : "bg-muted text-muted-foreground"}>{item.priority}</Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button size="sm" className="text-[10px] h-7" onClick={() => openRecord(item)}>Pay Now</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={recordOpen} onOpenChange={(open) => { if (!open) closeRecord(); else setRecordOpen(true); }}>
        <DialogContent className="max-w-md bg-white border">
          <DialogHeader>
            <DialogTitle>{payNowItem ? `Pay ${payNowItem.invoiceNo}` : "Record Vendor Payment"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs">Vendor *</Label>
                <Input value={form.vendor} onChange={(e) => setForm((p) => ({ ...p, vendor: e.target.value }))} className="text-xs h-9" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Invoice No</Label>
                <Input value={form.invoiceNo} onChange={(e) => setForm((p) => ({ ...p, invoiceNo: e.target.value }))} className="text-xs h-9" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Amount (₹) *</Label>
                <Input type="number" value={form.amount} onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))} className="text-xs h-9" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Payment Mode</Label>
                <Select value={form.mode} onValueChange={(v) => setForm((p) => ({ ...p, mode: v }))}>
                  <SelectTrigger className="text-xs h-9"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NEFT">NEFT</SelectItem>
                    <SelectItem value="RTGS">RTGS</SelectItem>
                    <SelectItem value="BANK">Bank Transfer</SelectItem>
                    <SelectItem value="CHEQUE">Cheque</SelectItem>
                    <SelectItem value="CASH">Cash</SelectItem>
                  </SelectContent>
                </Select>
                {showNeftForm && (
                  <button
                    type="button"
                    onClick={handleOpenNeftPreview}
                    className="text-[11px] text-[#7a3411] hover:text-[#63290d] hover:underline underline-offset-2 font-medium"
                  >
                    Preview bank remittance form →
                  </button>
                )}
              </div>
            </div>
            {!showNeftForm && (
              <div className="space-y-1.5">
                <Label className="text-xs">UTR / Cheque No</Label>
                <Input placeholder="Reference number" value={form.utr} onChange={(e) => setForm((p) => ({ ...p, utr: e.target.value }))} className="text-xs h-9 font-mono" />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeRecord}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <VoucherPrintDialog
        open={voucherPreviewOpen}
        onOpenChange={setVoucherPreviewOpen}
        title={`${form.mode} — Vendor Payment Remittance Preview`}
      >
        {previewNeftForm && (
          <NeftRtgsRemittanceForm
            template={defaultNeftRtgsTemplate}
            data={previewNeftForm}
            onChange={(patch) => setPreviewNeftForm((prev) => (prev ? mergeNeftForm(prev, patch) : prev))}
          />
        )}
      </VoucherPrintDialog>
    </motion.div>
  );
};

export default ProcurementPaymentPage;
