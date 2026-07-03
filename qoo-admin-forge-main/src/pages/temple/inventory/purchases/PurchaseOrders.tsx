import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Search, Plus, ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { stockItems } from "@/data/inventoryData";
import { supplierRefs } from "@/data/templeData";
import { purchaseOrders, addPurchaseOrder, nextPurchaseOrderId, type PurchaseOrder, type POLine } from "@/data/purchaseData";
import { getApprovedUnlinkedRequests, linkPOToRequest, type VoucherRequest } from "@/stores/voucherStore";

const statusColor: Record<string, string> = {
  "Draft": "bg-gray-50 text-gray-700 border-gray-200",
  "Ordered": "bg-blue-50 text-blue-700 border-blue-200",
  "Partial": "bg-amber-50 text-amber-700 border-amber-200",
  "Closed": "bg-green-50 text-green-700 border-green-200",
};

const PurchaseOrders = () => {
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const navigate = useNavigate();
  const [, setTick] = useState(0);

  // Create PO form state
  const [selectedRequestId, setSelectedRequestId] = useState("");
  const [poSupplier, setPoSupplier] = useState("");
  const [poExpectedDate, setPoExpectedDate] = useState("");
  const [poLines, setPoLines] = useState<POLine[]>([]);

  const approvedRequests = useMemo(() => getApprovedUnlinkedRequests(), [showCreate]);

  const addLine = () => {
    setPoLines(p => [...p, { id: `L-${p.length + 1}`, itemId: "", itemName: "", qty: 1, unitPrice: 0, total: 0 }]);
  };
  const updateLine = (idx: number, patch: Partial<POLine>) => {
    setPoLines(p => p.map((l, i) => i === idx ? { ...l, ...patch, total: (patch.qty ?? l.qty) * (patch.unitPrice ?? l.unitPrice) } : l));
  };

  const handleSelectRequest = (reqId: string) => {
    setSelectedRequestId(reqId);
    const req = approvedRequests.find(r => r.id === reqId);
    if (req) {
      // Pre-populate lines from request items
      setPoLines(req.items.map((item, i) => ({
        id: `L-${i + 1}`,
        itemId: "",
        itemName: item.name,
        qty: item.qty,
        unitPrice: item.estPrice,
        total: item.qty * item.estPrice,
      })));
    }
  };

  const handleSavePO = (status: PurchaseOrder["status"]) => {
    if (!selectedRequestId) { toast.error("Select an approved request to create PO"); return; }
    if (!poSupplier) { toast.error("Select supplier"); return; }
    if (poLines.length === 0) { toast.error("Add at least one line"); return; }
    const total = poLines.reduce((s, l) => s + (l.total || 0), 0);
    const next = nextPurchaseOrderId();
    const po: PurchaseOrder = {
      id: next,
      supplier: poSupplier,
      lines: poLines,
      totalAmount: total,
      expectedDate: poExpectedDate || new Date().toISOString().slice(0, 10),
      status,
      createdDate: new Date().toISOString().slice(0, 10),
      createdBy: "Store Manager",
    };
    addPurchaseOrder(po);
    // Link PO to the approved request → status becomes "PO Created"
    linkPOToRequest(selectedRequestId, next);
    toast.success(`PO ${next} created and linked to ${selectedRequestId}`);
    setShowCreate(false);
    setPoSupplier("");
    setPoExpectedDate("");
    setPoLines([]);
    setSelectedRequestId("");
    setTick(t => t + 1);
  };

  const filtered = useMemo(() => {
    return purchaseOrders.filter(p =>
      !search ||
      p.id.toLowerCase().includes(search.toLowerCase()) ||
      p.supplier.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);
  const totalPages = Math.ceil(filtered.length / perPage);
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search POs..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-9" />
          </div>
          <Button size="sm" onClick={() => setShowCreate(true)} className="gap-2">
            <Plus className="h-4 w-4" /> Create PO
          </Button>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>PO Number</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Expected Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paged.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">No purchase orders found</TableCell></TableRow>
              ) : paged.map(po => (
                <TableRow
                  key={po.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => navigate(`/temple/inventory/purchases/${po.id}`)}
                >
                  <TableCell className="font-medium text-sm text-primary">{po.id}</TableCell>
                  <TableCell className="text-sm">{po.supplier}</TableCell>
                  <TableCell className="text-sm">{po.expectedDate}</TableCell>
                  <TableCell className="text-right font-medium text-sm">₹{po.totalAmount.toLocaleString()}</TableCell>
                  <TableCell><Badge variant="outline" className={`text-xs ${statusColor[po.status]}`}>{po.status}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Show</span>
            <Select value={perPage.toString()} onValueChange={v => { setPerPage(Number(v)); setPage(1); }}>
              <SelectTrigger className="w-[70px] h-8 bg-background"><SelectValue /></SelectTrigger>
              <SelectContent className="bg-popover">{[10, 25, 50, 100].map(n => <SelectItem key={n} value={n.toString()}>{n}</SelectItem>)}</SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">of {filtered.length} records</span>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" className="h-8 w-8" disabled={page === 1} onClick={() => setPage(p => p - 1)}><ChevronLeft className="h-4 w-4" /></Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).slice(Math.max(0, page - 3), page + 2).map(p => (
              <Button key={p} variant={p === page ? "default" : "outline"} size="icon" className="h-8 w-8" onClick={() => setPage(p)}>{p}</Button>
            ))}
            <Button variant="outline" size="icon" className="h-8 w-8" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}><ChevronRight className="h-4 w-4" /></Button>
          </div>
        </div>
      </motion.div>

      {/* Create PO Dialog — Requires Approved Request */}
      <Dialog open={showCreate} onOpenChange={() => setShowCreate(false)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Create Purchase Order</DialogTitle></DialogHeader>
          <div className="space-y-4">
            {/* Step 1: Select Approved Request */}
            <div className="border rounded-lg p-3 bg-amber-50/50">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <p className="text-sm font-medium text-amber-800">PO requires an approved request</p>
              </div>
              <Select value={selectedRequestId} onValueChange={handleSelectRequest}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select approved request..." />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  {approvedRequests.length === 0 ? (
                    <SelectItem value="_none" disabled>No approved requests available</SelectItem>
                  ) : approvedRequests.map(r => (
                    <SelectItem key={r.id} value={r.id}>
                      {r.id} — {r.description} (₹{r.amount.toLocaleString()})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Supplier</Label>
                <Select value={poSupplier} onValueChange={v => setPoSupplier(v)}>
                  <SelectTrigger className="bg-background"><SelectValue placeholder="Select supplier" /></SelectTrigger>
                  <SelectContent className="bg-popover">
                    {supplierRefs.map(s => <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Expected Delivery</Label>
                <Input type="date" value={poExpectedDate} onChange={e => setPoExpectedDate(e.target.value)} />
              </div>
            </div>

            <div className="border rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium">Material Items</p>
                <Button size="sm" variant="outline" onClick={addLine}>Add Line</Button>
              </div>
              {poLines.map((l, idx) => (
                <div key={l.id} className="grid grid-cols-6 gap-2 items-end mb-2">
                  <div className="col-span-2">
                    <Label className="text-xs">Item</Label>
                    <Select value={l.itemId} onValueChange={v => {
                      const item = stockItems.find(si => si.id === v);
                      updateLine(idx, { itemId: v, itemName: item?.name || l.itemName });
                    }}>
                      <SelectTrigger className="bg-background"><SelectValue placeholder={l.itemName || "Select item"} /></SelectTrigger>
                      <SelectContent className="bg-popover">
                        {stockItems.map(i => <SelectItem key={i.id} value={i.id}>{i.name} ({i.unit})</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs">Qty</Label>
                    <Input type="number" value={String(l.qty)} onChange={e => updateLine(idx, { qty: Number(e.target.value) })} />
                  </div>
                  <div>
                    <Label className="text-xs">Rate (₹)</Label>
                    <Input type="number" value={String(l.unitPrice)} onChange={e => updateLine(idx, { unitPrice: Number(e.target.value) })} />
                  </div>
                  <div>
                    <Label className="text-xs">Total</Label>
                    <Input value={`₹${(l.total || 0).toFixed(2)}`} readOnly />
                  </div>
                  <div className="col-span-1">
                    <Button variant="outline" size="sm" onClick={() => setPoLines(pl => pl.filter((_, i) => i !== idx))}>Remove</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button onClick={() => handleSavePO("Draft")} disabled={!selectedRequestId}>Save as Draft</Button>
            <Button onClick={() => handleSavePO("Ordered")} disabled={!selectedRequestId}>Submit Order</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PurchaseOrders;
