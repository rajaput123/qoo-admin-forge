import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, Plus } from "lucide-react";
import { toast } from "sonner";

const formatCurrency = (val: number) => `₹${val.toLocaleString("en-IN")}`;

interface Invoice {
  id: string;
  poRef: string;
  grn: string;
  vendor: string;
  invDate: string;
  dueDate: string;
  base: number;
  total: number;
  status: string;
}

const mockInvoices: Invoice[] = [
  { id: "inv001", poRef: "a1b2c3", grn: "GRN-8821", vendor: "Sri Pooja Stores", invDate: "2026-06-05", dueDate: "2026-07-05", base: 10593, total: 12500, status: "pending" },
  { id: "inv002", poRef: "g7h8i9", grn: "GRN-7702", vendor: "Philips Electricals", invDate: "2026-05-30", dueDate: "2026-06-30", base: 8305, total: 9800, status: "paid" },
  { id: "inv003", poRef: "j1k2l3", grn: "GRN-6601", vendor: "Flower Vendor", invDate: "2026-05-22", dueDate: "2026-06-22", base: 5254, total: 6200, status: "partially paid" },
  { id: "inv004", poRef: "d4e5f6", grn: "—", vendor: "Temple Catering Co.", invDate: "2026-06-03", dueDate: "2026-07-03", base: 38136, total: 45000, status: "pending" },
];

const statusStyle = (status: string) => {
  const s = status.toLowerCase();
  if (s === "paid") return "bg-green-50 text-green-700 border-green-200";
  if (s.includes("partial")) return "bg-amber-50 text-amber-700 border-amber-200";
  return "bg-red-50 text-red-700 border-red-200";
};

const ProcurementInvoicePage = () => {
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterVendor, setFilterVendor] = useState("all");
  const [viewInvoice, setViewInvoice] = useState<Invoice | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [newInv, setNewInv] = useState({ vendor: "", poRef: "", amount: "", invDate: "" });

  const filtered = mockInvoices.filter((b) => {
    if (filterStatus !== "all" && b.status !== filterStatus) return false;
    if (filterVendor !== "all" && b.vendor !== filterVendor) return false;
    return true;
  });

  const handleAddInvoice = () => {
    if (!newInv.vendor || !newInv.amount) {
      toast.error("Vendor and amount are required");
      return;
    }
    toast.success("Invoice added (mock)");
    setAddOpen(false);
    setNewInv({ vendor: "", poRef: "", amount: "", invDate: "" });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <Card>
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-5">
            <h1 className="text-lg font-semibold">Bills & Invoices Register</h1>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="text-xs gap-1.5" onClick={() => toast.success("Invoices exported (mock PDF)")}>
                <Download className="h-3.5 w-3.5" /> Export PDF
              </Button>
              <Button size="sm" className="text-xs gap-1.5" onClick={() => setAddOpen(true)}>
                <Plus className="h-3.5 w-3.5" /> Add Invoice
              </Button>
            </div>
          </div>

          <div className="flex gap-2 mb-5">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="text-xs h-9 w-[160px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="partially paid">Partially Paid</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterVendor} onValueChange={setFilterVendor}>
              <SelectTrigger className="text-xs h-9 w-[180px]"><SelectValue placeholder="All Vendors" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Vendors</SelectItem>
                {[...new Set(mockInvoices.map((b) => b.vendor))].map((v) => (
                  <SelectItem key={v} value={v}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="text-xs">Invoice No</TableHead>
                <TableHead className="text-xs">PO Ref</TableHead>
                <TableHead className="text-xs text-center">GRN No</TableHead>
                <TableHead className="text-xs">Vendor</TableHead>
                <TableHead className="text-xs">Inv Date</TableHead>
                <TableHead className="text-xs">Due Date</TableHead>
                <TableHead className="text-xs text-right">Base (₹)</TableHead>
                <TableHead className="text-xs text-right">Total (₹)</TableHead>
                <TableHead className="text-xs text-center">Status</TableHead>
                <TableHead className="text-xs text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((bill) => (
                <TableRow key={bill.id}>
                  <TableCell className="text-xs font-mono text-primary font-medium">INV-{bill.id}</TableCell>
                  <TableCell className="text-xs">PO-{bill.poRef}</TableCell>
                  <TableCell className="text-xs text-center text-muted-foreground">{bill.grn}</TableCell>
                  <TableCell className="text-xs font-medium">{bill.vendor}</TableCell>
                  <TableCell className="text-xs">{bill.invDate}</TableCell>
                  <TableCell className="text-xs">{bill.dueDate}</TableCell>
                  <TableCell className="text-xs text-right">{bill.base.toLocaleString("en-IN")}</TableCell>
                  <TableCell className="text-xs font-bold text-right">{formatCurrency(bill.total)}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className={`text-[10px] uppercase ${statusStyle(bill.status)}`}>{bill.status}</Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button variant="outline" size="sm" className="text-[10px] h-7" onClick={() => setViewInvoice(bill)}>View</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex justify-between pt-5 mt-2 border-t text-xs text-muted-foreground">
            <span>Showing {filtered.length} of {mockInvoices.length} records</span>
          </div>
        </CardContent>
      </Card>

      {/* View Invoice Modal */}
      <Dialog open={!!viewInvoice} onOpenChange={(open) => !open && setViewInvoice(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>INV-{viewInvoice?.id}</DialogTitle>
          </DialogHeader>
          {viewInvoice && (
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div><span className="text-muted-foreground text-xs">Vendor</span><p className="font-medium">{viewInvoice.vendor}</p></div>
                <div><span className="text-muted-foreground text-xs">Status</span><p><Badge variant="outline" className={statusStyle(viewInvoice.status)}>{viewInvoice.status}</Badge></p></div>
                <div><span className="text-muted-foreground text-xs">PO Ref</span><p>PO-{viewInvoice.poRef}</p></div>
                <div><span className="text-muted-foreground text-xs">GRN No</span><p>{viewInvoice.grn}</p></div>
                <div><span className="text-muted-foreground text-xs">Invoice Date</span><p>{viewInvoice.invDate}</p></div>
                <div><span className="text-muted-foreground text-xs">Due Date</span><p>{viewInvoice.dueDate}</p></div>
              </div>
              <div className="pt-2 border-t space-y-1">
                <div className="flex justify-between"><span className="text-muted-foreground">Base Amount</span><span>{formatCurrency(viewInvoice.base)}</span></div>
                <div className="flex justify-between font-bold"><span>Total (incl. GST)</span><span className="text-red-700">{formatCurrency(viewInvoice.total)}</span></div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewInvoice(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Invoice Modal */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Invoice</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Vendor *</Label>
              <Select value={newInv.vendor} onValueChange={(v) => setNewInv((p) => ({ ...p, vendor: v }))}>
                <SelectTrigger className="text-xs h-9"><SelectValue placeholder="Select vendor" /></SelectTrigger>
                <SelectContent>
                  {[...new Set(mockInvoices.map((b) => b.vendor))].map((v) => (
                    <SelectItem key={v} value={v}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">PO Reference</Label>
              <Input placeholder="PO-a1b2c3" value={newInv.poRef} onChange={(e) => setNewInv((p) => ({ ...p, poRef: e.target.value }))} className="text-xs h-9" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Invoice Date</Label>
                <Input type="date" value={newInv.invDate} onChange={(e) => setNewInv((p) => ({ ...p, invDate: e.target.value }))} className="text-xs h-9" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Total Amount (₹) *</Label>
                <Input type="number" placeholder="12500" value={newInv.amount} onChange={(e) => setNewInv((p) => ({ ...p, amount: e.target.value }))} className="text-xs h-9" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button onClick={handleAddInvoice}>Save Invoice</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default ProcurementInvoicePage;
