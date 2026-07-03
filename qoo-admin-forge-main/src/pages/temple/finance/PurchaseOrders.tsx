import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
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

interface PO {
  id: string;
  date: string;
  vendor: string;
  temple: string;
  items: string;
  amount: number;
  grn: string;
  approvedBy: string;
  status: string;
}

const mockPOs: PO[] = [
  { id: "a1b2c3", date: "2026-06-04", vendor: "Sri Pooja Stores", temple: "Ganesha Temple", items: "Pooja Samagri Kit & 2 more", amount: 12500, grn: "GRN-8821", approvedBy: "Shashank", status: "Open" },
  { id: "d4e5f6", date: "2026-06-02", vendor: "Temple Catering Co.", temple: "Ganesha Temple", items: "Annadanam Supplies", amount: 45000, grn: "—", approvedBy: "Priya Sharma", status: "Partially Received" },
  { id: "g7h8i9", date: "2026-05-28", vendor: "Philips Electricals", temple: "Ganesha Temple", items: "LED Bulbs & Wiring", amount: 9800, grn: "GRN-7702", approvedBy: "Shashank", status: "GRN closed" },
  { id: "j1k2l3", date: "2026-05-20", vendor: "Flower Vendor", temple: "Ganesha Temple", items: "Daily Flower Supply", amount: 6200, grn: "GRN-6601", approvedBy: "Shashank", status: "GRN closed" },
];

const statusStyle = (status: string) => {
  const s = status.toLowerCase();
  if (s.includes("closed")) return "bg-green-50 text-green-700 border-green-200";
  if (s.includes("partial")) return "bg-amber-50 text-amber-700 border-amber-200";
  if (s.includes("cancel")) return "bg-red-50 text-red-700 border-red-200";
  return "bg-blue-50 text-blue-700 border-blue-200";
};

const FinancePurchaseOrders = () => {
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterVendor, setFilterVendor] = useState("all");
  const [viewPO, setViewPO] = useState<PO | null>(null);
  const [closeGrnPO, setCloseGrnPO] = useState<PO | null>(null);
  const [grnNo, setGrnNo] = useState("");
  const [receivedQty, setReceivedQty] = useState("");

  const filtered = mockPOs.filter((po) => {
    if (filterStatus !== "all" && po.status !== filterStatus) return false;
    if (filterVendor !== "all" && po.vendor !== filterVendor) return false;
    return true;
  });

  const handleCloseGrn = () => {
    if (!grnNo.trim()) {
      toast.error("Enter GRN number");
      return;
    }
    toast.success(`GRN ${grnNo} recorded for PO-${closeGrnPO?.id}`);
    setCloseGrnPO(null);
    setGrnNo("");
    setReceivedQty("");
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <Card>
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-5">
            <h1 className="text-lg font-semibold">Purchase Orders Register</h1>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="text-xs gap-1.5" onClick={() => toast.success("PO register exported (mock PDF)")}>
                <Download className="h-3.5 w-3.5" /> Export PDF
              </Button>
              <Button size="sm" className="text-xs gap-1.5" onClick={() => navigate("/temple/finance/create-po")}>
                <Plus className="h-3.5 w-3.5" /> Create PO
              </Button>
            </div>
          </div>

          <div className="flex gap-2 mb-5">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="text-xs h-9 w-[160px]"><SelectValue placeholder="All Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Open">Open</SelectItem>
                <SelectItem value="Partially Received">Partially Received</SelectItem>
                <SelectItem value="GRN closed">GRN Closed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterVendor} onValueChange={setFilterVendor}>
              <SelectTrigger className="text-xs h-9 w-[180px]"><SelectValue placeholder="All Vendors" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Vendors</SelectItem>
                {[...new Set(mockPOs.map((p) => p.vendor))].map((v) => (
                  <SelectItem key={v} value={v}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="text-xs">PO No</TableHead>
                <TableHead className="text-xs">Date</TableHead>
                <TableHead className="text-xs">Vendor</TableHead>
                <TableHead className="text-xs">Temple</TableHead>
                <TableHead className="text-xs">Items</TableHead>
                <TableHead className="text-xs text-right">Amount (₹)</TableHead>
                <TableHead className="text-xs text-center">GRN NO</TableHead>
                <TableHead className="text-xs text-center">Approved By</TableHead>
                <TableHead className="text-xs text-center">Status</TableHead>
                <TableHead className="text-xs text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((po) => (
                <TableRow key={po.id}>
                  <TableCell className="text-xs font-mono text-primary font-medium">PO-{po.id}</TableCell>
                  <TableCell className="text-xs">{po.date}</TableCell>
                  <TableCell className="text-xs font-medium">{po.vendor}</TableCell>
                  <TableCell className="text-xs">{po.temple}</TableCell>
                  <TableCell className="text-xs text-muted-foreground max-w-[180px]">{po.items}</TableCell>
                  <TableCell className="text-xs font-bold text-red-700 text-right">{formatCurrency(po.amount)}</TableCell>
                  <TableCell className="text-xs text-center text-muted-foreground">{po.grn}</TableCell>
                  <TableCell className="text-xs text-center text-muted-foreground">{po.approvedBy}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className={statusStyle(po.status)}>{po.status}</Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      {po.grn === "—" && (
                        <Button variant="outline" size="sm" className="text-[10px] h-7" onClick={() => setCloseGrnPO(po)}>
                          Close GRN
                        </Button>
                      )}
                      <Button variant="outline" size="sm" className="text-[10px] h-7" onClick={() => setViewPO(po)}>
                        View
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex justify-between pt-5 mt-2 border-t text-xs text-muted-foreground">
            <span>Showing {filtered.length} of {mockPOs.length} records</span>
          </div>
        </CardContent>
      </Card>

      {/* View PO Modal */}
      <Dialog open={!!viewPO} onOpenChange={(open) => !open && setViewPO(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>PO-{viewPO?.id}</DialogTitle>
          </DialogHeader>
          {viewPO && (
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div><span className="text-muted-foreground text-xs">Date</span><p className="font-medium">{viewPO.date}</p></div>
                <div><span className="text-muted-foreground text-xs">Status</span><p><Badge variant="outline" className={statusStyle(viewPO.status)}>{viewPO.status}</Badge></p></div>
                <div><span className="text-muted-foreground text-xs">Vendor</span><p className="font-medium">{viewPO.vendor}</p></div>
                <div><span className="text-muted-foreground text-xs">Temple</span><p>{viewPO.temple}</p></div>
                <div><span className="text-muted-foreground text-xs">GRN No</span><p>{viewPO.grn}</p></div>
                <div><span className="text-muted-foreground text-xs">Approved By</span><p>{viewPO.approvedBy}</p></div>
              </div>
              <div><span className="text-muted-foreground text-xs">Items</span><p>{viewPO.items}</p></div>
              <div className="pt-2 border-t flex justify-between items-center">
                <span className="font-semibold">Total Amount</span>
                <span className="text-lg font-bold text-red-700">{formatCurrency(viewPO.amount)}</span>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewPO(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Close GRN Modal */}
      <Dialog open={!!closeGrnPO} onOpenChange={(open) => { if (!open) { setCloseGrnPO(null); setGrnNo(""); setReceivedQty(""); } }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Close GRN — PO-{closeGrnPO?.id}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-xs text-muted-foreground">Record goods received for {closeGrnPO?.vendor}</p>
            <div className="space-y-1.5">
              <Label className="text-xs">GRN Number *</Label>
              <Input placeholder="GRN-XXXX" value={grnNo} onChange={(e) => setGrnNo(e.target.value)} className="text-xs h-9" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Received Quantity / Notes</Label>
              <Input placeholder="Full / Partial" value={receivedQty} onChange={(e) => setReceivedQty(e.target.value)} className="text-xs h-9" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCloseGrnPO(null)}>Cancel</Button>
            <Button onClick={handleCloseGrn}>Confirm GRN</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default FinancePurchaseOrders;
