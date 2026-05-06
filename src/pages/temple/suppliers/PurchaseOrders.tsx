import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Eye, FileText } from "lucide-react";

const purchaseOrders = [
  { id: "PO-2026-001", supplier: "Sri Lakshmi Flowers", structure: "Main Temple", materials: [{ name: "Rose Petals", qty: 10, unit: "kg", rate: 500, total: 5000 }, { name: "Jasmine Garlands", qty: 50, unit: "pcs", rate: 80, total: 4000 }], totalAmount: 9000, expectedDate: "2026-02-10", status: "Approved", createdDate: "2026-02-06", approvedBy: "Admin Rajan" },
  { id: "PO-2026-002", supplier: "Annapurna Grocery", structure: "Kitchen", materials: [{ name: "Rice (Sona Masuri)", qty: 100, unit: "kg", rate: 55, total: 5500 }, { name: "Toor Dal", qty: 25, unit: "kg", rate: 120, total: 3000 }], totalAmount: 8500, expectedDate: "2026-02-11", status: "Sent", createdDate: "2026-02-05", approvedBy: "Admin Rajan" },
  { id: "PO-2026-003", supplier: "Nandi Oil & Ghee", structure: "Kitchen", materials: [{ name: "Ghee (Cow)", qty: 20, unit: "ltr", rate: 600, total: 12000 }, { name: "Sesame Oil", qty: 15, unit: "ltr", rate: 350, total: 5250 }], totalAmount: 17250, expectedDate: "2026-02-12", status: "Draft", createdDate: "2026-02-08", approvedBy: "" },
  { id: "PO-2026-004", supplier: "Shiva Pooja Stores", structure: "Main Temple", materials: [{ name: "Camphor", qty: 5, unit: "kg", rate: 800, total: 4000 }, { name: "Kumkum", qty: 3, unit: "kg", rate: 400, total: 1200 }, { name: "Incense Sticks", qty: 100, unit: "pkt", rate: 30, total: 3000 }], totalAmount: 8200, expectedDate: "2026-02-09", status: "Delivered", createdDate: "2026-02-03", approvedBy: "Admin Rajan" },
  { id: "PO-2026-005", supplier: "Devi Decorations", structure: "Main Temple", materials: [{ name: "Flower Arrangement", qty: 5, unit: "pcs", rate: 2000, total: 10000 }], totalAmount: 10000, expectedDate: "2026-02-14", status: "Approved", createdDate: "2026-02-07", approvedBy: "Admin Rajan" },
  { id: "PO-2026-006", supplier: "Surya Milk Dairy", structure: "Kitchen", materials: [{ name: "Milk (Full Cream)", qty: 50, unit: "ltr", rate: 60, total: 3000 }], totalAmount: 3000, expectedDate: "2026-02-09", status: "Partially Delivered", createdDate: "2026-02-06", approvedBy: "Admin Rajan" },
];

const statusColor = (s: string) => {
  if (s === "Draft") return "text-slate-700 border-slate-300 bg-slate-50";
  if (s === "Approved") return "text-blue-700 border-blue-300 bg-blue-50";
  if (s === "Sent") return "text-indigo-700 border-indigo-300 bg-indigo-50";
  if (s === "Partially Delivered") return "text-amber-700 border-amber-300 bg-amber-50";
  if (s === "Delivered") return "text-green-700 border-green-300 bg-green-50";
  if (s === "Closed") return "text-muted-foreground border-border bg-muted";
  return "text-muted-foreground border-border bg-muted";
};

const PurchaseOrders = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState<typeof purchaseOrders[0] | null>(null);
  const [viewing, setViewing] = useState<typeof purchaseOrders[0] | null>(null);
  const [showNew, setShowNew] = useState(false);

  const filtered = purchaseOrders.filter(p => {
    const matchSearch = p.id.toLowerCase().includes(search.toLowerCase()) || p.supplier.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  if (viewing) {
    const p = viewing;
    return (
      <div className="p-6 space-y-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">{p.id}</h1>
              <p className="text-muted-foreground text-sm">{p.supplier} · {p.structure}</p>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className={`text-xs ${statusColor(p.status)}`}>{p.status}</Badge>
              <Button size="sm" onClick={() => setViewing(null)}>Back</Button>
            </div>
          </div>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{p.id} · {p.supplier}</CardTitle>
                <div className="text-sm text-muted-foreground">Expected: {p.expectedDate}</div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader><TableRow><TableHead>Material</TableHead><TableHead className="text-center">Qty</TableHead><TableHead>Unit</TableHead><TableHead className="text-right">Rate</TableHead><TableHead className="text-right">Total</TableHead></TableRow></TableHeader>
                <TableBody>
                  {p.materials.map((m, i) => (
                    <TableRow key={i}><TableCell>{m.name}</TableCell><TableCell className="text-center">{m.qty}</TableCell><TableCell>{m.unit}</TableCell><TableCell className="text-right">₹{m.rate}</TableCell><TableCell className="text-right">₹{m.total}</TableCell></TableRow>
                  ))}
                  <TableRow><TableCell colSpan={4} className="text-right font-medium">Total</TableCell><TableCell className="text-right font-bold">₹{p.totalAmount.toLocaleString()}</TableCell></TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Purchase Orders</h1>
            <p className="text-muted-foreground">Manage all procurement activities</p>
          </div>
          <Button size="sm" onClick={() => setShowNew(true)}><Plus className="h-4 w-4 mr-2" />Create PO</Button>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search POs..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Sent">Sent</SelectItem>
                  <SelectItem value="Partially Delivered">Partially Delivered</SelectItem>
                  <SelectItem value="Delivered">Delivered</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Structure</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Expected</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(p => (
                  <TableRow key={p.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setViewing(p)}>
                    <TableCell className="font-medium text-sm">{p.supplier}</TableCell>
                    <TableCell className="text-sm">{p.structure}</TableCell>
                    <TableCell className="text-sm">{p.materials.length} items</TableCell>
                    <TableCell className="text-right font-medium text-sm">₹{p.totalAmount.toLocaleString()}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{p.expectedDate}</TableCell>
                    <TableCell><Badge variant="outline" className={`text-[10px] ${statusColor(p.status)}`}>{p.status}</Badge></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>

      {/* PO Detail Dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <FileText className="h-5 w-5" />Purchase Order
                  <Badge variant="outline" className={`text-xs ${statusColor(selected.status)}`}>{selected.status}</Badge>
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-3 bg-muted/50 rounded-lg"><p className="text-xs text-muted-foreground">Supplier</p><p className="font-medium text-sm">{selected.supplier}</p></div>
                  <div className="p-3 bg-muted/50 rounded-lg"><p className="text-xs text-muted-foreground">Structure</p><p className="font-medium text-sm">{selected.structure}</p></div>
                  <div className="p-3 bg-muted/50 rounded-lg"><p className="text-xs text-muted-foreground">Expected Delivery</p><p className="font-medium text-sm">{selected.expectedDate}</p></div>
                </div>
                <Card>
                  <CardHeader className="pb-2"><CardTitle className="text-sm">Material List</CardTitle></CardHeader>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader><TableRow><TableHead>Material</TableHead><TableHead className="text-center">Qty</TableHead><TableHead>Unit</TableHead><TableHead className="text-right">Rate</TableHead><TableHead className="text-right">Total</TableHead></TableRow></TableHeader>
                      <TableBody>
                        {selected.materials.map((m, i) => (
                          <TableRow key={i}><TableCell className="text-sm">{m.name}</TableCell><TableCell className="text-center text-sm">{m.qty}</TableCell><TableCell className="text-sm">{m.unit}</TableCell><TableCell className="text-right text-sm">₹{m.rate}</TableCell><TableCell className="text-right font-medium text-sm">₹{m.total.toLocaleString()}</TableCell></TableRow>
                        ))}
                        <TableRow><TableCell colSpan={4} className="text-right font-medium text-sm">Total</TableCell><TableCell className="text-right font-bold text-sm">₹{selected.totalAmount.toLocaleString()}</TableCell></TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-muted/50 rounded-lg"><p className="text-xs text-muted-foreground">Created</p><p className="text-sm">{selected.createdDate}</p></div>
                  <div className="p-3 bg-muted/50 rounded-lg"><p className="text-xs text-muted-foreground">Approved By</p><p className="text-sm">{selected.approvedBy || "Pending"}</p></div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Create PO Dialog */}
      <Dialog open={showNew} onOpenChange={setShowNew}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Create Purchase Order</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-xs">Supplier</Label><Select><SelectTrigger><SelectValue placeholder="Select supplier" /></SelectTrigger><SelectContent><SelectItem value="s1">Sri Lakshmi Flowers</SelectItem><SelectItem value="s2">Annapurna Grocery</SelectItem><SelectItem value="s3">Shiva Pooja Stores</SelectItem><SelectItem value="s4">Nandi Oil & Ghee</SelectItem><SelectItem value="s5">Devi Decorations</SelectItem></SelectContent></Select></div>
              <div><Label className="text-xs">Structure</Label><Select><SelectTrigger><SelectValue placeholder="Select structure" /></SelectTrigger><SelectContent><SelectItem value="main">Main Temple</SelectItem><SelectItem value="shrine">Shrine</SelectItem><SelectItem value="kitchen">Kitchen</SelectItem><SelectItem value="event">Event Area</SelectItem></SelectContent></Select></div>
              <div><Label className="text-xs">Expected Delivery Date</Label><Input type="date" /></div>
              <div><Label className="text-xs">Approval Authority</Label><Input placeholder="Approver name" /></div>
            </div>
            <div className="border rounded-lg p-4 space-y-3">
              <p className="text-sm font-medium">Material Items</p>
              <div className="grid grid-cols-5 gap-2">
                <div className="col-span-2"><Input placeholder="Material name" /></div>
                <div><Input type="number" placeholder="Qty" /></div>
                <div><Input placeholder="Unit" /></div>
                <div><Input type="number" placeholder="Rate" /></div>
              </div>
              <Button variant="outline" size="sm"><Plus className="h-3.5 w-3.5 mr-1" />Add Item</Button>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowNew(false)}>Cancel</Button>
              <Button variant="secondary">Save as Draft</Button>
              <Button onClick={() => setShowNew(false)}>Submit for Approval</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PurchaseOrders;
