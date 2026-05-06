import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, CreditCard, IndianRupee } from "lucide-react";

const payments = [
  { id: "PAY-001", supplier: "Shiva Pooja Stores", poId: "PO-2026-004", invoiceNo: "INV-2026-018", invoiceAmount: 8200, paidAmount: 8200, paymentMode: "Bank Transfer", status: "Paid", paymentDate: "2026-02-09" },
  { id: "PAY-002", supplier: "Annapurna Grocery", poId: "PO-2026-002", invoiceNo: "INV-2026-019", invoiceAmount: 8500, paidAmount: 5000, paymentMode: "UPI", status: "Partially Paid", paymentDate: "2026-02-08" },
  { id: "PAY-003", supplier: "Sri Lakshmi Flowers", poId: "PO-2026-001", invoiceNo: "INV-2026-020", invoiceAmount: 9000, paidAmount: 0, paymentMode: "—", status: "Pending", paymentDate: "" },
  { id: "PAY-004", supplier: "Surya Milk Dairy", poId: "PO-2026-006", invoiceNo: "INV-2026-021", invoiceAmount: 3000, paidAmount: 0, paymentMode: "—", status: "Overdue", paymentDate: "" },
  { id: "PAY-005", supplier: "Nandi Oil & Ghee", poId: "PO-2026-003", invoiceNo: "—", invoiceAmount: 17250, paidAmount: 0, paymentMode: "—", status: "Pending", paymentDate: "" },
  { id: "PAY-006", supplier: "Devi Decorations", poId: "PO-2026-005", invoiceNo: "INV-2026-022", invoiceAmount: 10000, paidAmount: 10000, paymentMode: "Cheque", status: "Paid", paymentDate: "2026-02-07" },
];

const statusColor = (s: string) => {
  if (s === "Paid") return "text-green-700 border-green-300 bg-green-50";
  if (s === "Partially Paid") return "text-amber-700 border-amber-300 bg-amber-50";
  if (s === "Pending") return "text-blue-700 border-blue-300 bg-blue-50";
  if (s === "Overdue") return "text-red-700 border-red-300 bg-red-50";
  return "text-muted-foreground border-border bg-muted";
};

const Payments = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showRecord, setShowRecord] = useState(false);

  const filtered = payments.filter(p => {
    const matchSearch = p.supplier.toLowerCase().includes(search.toLowerCase()) || p.poId.toLowerCase().includes(search.toLowerCase()) || p.invoiceNo.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPending = payments.filter(p => p.status !== "Paid").reduce((s, p) => s + (p.invoiceAmount - p.paidAmount), 0);

  return (
    <div className="p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Payments & Settlements</h1>
            <p className="text-muted-foreground">Track supplier payments and invoices</p>
          </div>
          <Button size="sm" onClick={() => setShowRecord(true)}><Plus className="h-4 w-4 mr-2" />Record Payment</Button>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Total Paid (Feb)</p><p className="text-xl font-bold text-green-700">₹{payments.filter(p => p.status === "Paid").reduce((s, p) => s + p.paidAmount, 0).toLocaleString()}</p></CardContent></Card>
          <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Pending Amount</p><p className="text-xl font-bold text-amber-700">₹{totalPending.toLocaleString()}</p></CardContent></Card>
          <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Overdue</p><p className="text-xl font-bold text-red-700">₹{payments.filter(p => p.status === "Overdue").reduce((s, p) => s + p.invoiceAmount, 0).toLocaleString()}</p></CardContent></Card>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search payments..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Paid">Paid</SelectItem>
                  <SelectItem value="Partially Paid">Partially Paid</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Supplier</TableHead>
                  <TableHead>PO Ref</TableHead>
                  <TableHead>Invoice</TableHead>
                  <TableHead className="text-right">Invoice Amt</TableHead>
                  <TableHead className="text-right">Paid</TableHead>
                  <TableHead>Mode</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(p => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium text-sm">{p.supplier}</TableCell>
                    <TableCell className="font-mono text-xs">{p.poId}</TableCell>
                    <TableCell className="font-mono text-xs">{p.invoiceNo}</TableCell>
                    <TableCell className="text-right text-sm">₹{p.invoiceAmount.toLocaleString()}</TableCell>
                    <TableCell className="text-right font-medium text-sm">₹{p.paidAmount.toLocaleString()}</TableCell>
                    <TableCell className="text-sm">{p.paymentMode}</TableCell>
                    <TableCell><Badge variant="outline" className={`text-[10px] ${statusColor(p.status)}`}>{p.status}</Badge></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>

      {/* Record Payment Dialog */}
      <Dialog open={showRecord} onOpenChange={setShowRecord}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle className="flex items-center gap-2"><IndianRupee className="h-5 w-5" />Record Payment</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label className="text-xs">Supplier</Label><Select><SelectTrigger><SelectValue placeholder="Select supplier" /></SelectTrigger><SelectContent><SelectItem value="s1">Sri Lakshmi Flowers</SelectItem><SelectItem value="s2">Annapurna Grocery</SelectItem><SelectItem value="s3">Surya Milk Dairy</SelectItem></SelectContent></Select></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-xs">PO Reference</Label><Input placeholder="PO-2026-XXX" /></div>
              <div><Label className="text-xs">Invoice Number</Label><Input placeholder="INV-2026-XXX" /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-xs">Invoice Amount (₹)</Label><Input type="number" placeholder="0" /></div>
              <div><Label className="text-xs">Payment Amount (₹)</Label><Input type="number" placeholder="0" /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-xs">Payment Mode</Label><Select><SelectTrigger><SelectValue placeholder="Mode" /></SelectTrigger><SelectContent><SelectItem value="Bank Transfer">Bank Transfer</SelectItem><SelectItem value="UPI">UPI</SelectItem><SelectItem value="Cheque">Cheque</SelectItem><SelectItem value="Cash">Cash</SelectItem></SelectContent></Select></div>
              <div><Label className="text-xs">Payment Date</Label><Input type="date" /></div>
            </div>
            <div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setShowRecord(false)}>Cancel</Button><Button onClick={() => setShowRecord(false)}>Record Payment</Button></div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Payments;
