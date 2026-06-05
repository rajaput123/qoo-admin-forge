import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
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
import { ShoppingCart, Search, Plus, Eye, AlertCircle, Send } from "lucide-react";
import { toast } from "sonner";
import { getApprovedUnlinkedRequests, linkPOToRequest, type VoucherRequest } from "@/stores/voucherStore";
import {
  procurementPOs, createProcurementPO, updatePOStatus, getFreelancerList,
  type ProcurementPO, type POStatus
} from "@/stores/procurementStore";

const statusColor: Record<POStatus, string> = {
  Created: "bg-muted text-muted-foreground",
  Sent: "bg-blue-50 text-blue-700 border-blue-200",
  "Ready for Delivery": "bg-amber-50 text-amber-700 border-amber-200",
  Closed: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

const formatCurrency = (val: number) => `₹${val.toLocaleString("en-IN")}`;

const FinancePurchaseOrders = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [, setTick] = useState(0);
  const refresh = () => setTick(t => t + 1);
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(searchParams.get("action") === "create");
  
  useEffect(() => {
    if (searchParams.get("action") === "create") {
      setShowCreate(true);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams]);

  const [selected, setSelected] = useState<ProcurementPO | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  // Form
  const [selectedRequestId, setSelectedRequestId] = useState("");
  const [selectedFreelancerId, setSelectedFreelancerId] = useState("");
  const [expectedDate, setExpectedDate] = useState("");
  const [poItems, setPoItems] = useState<ProcurementPO["items"]>([]);

  const approvedRequests = useMemo(() => getApprovedUnlinkedRequests(), [showCreate]);
  const freelancers = getFreelancerList();

  const handleSelectRequest = (reqId: string) => {
    setSelectedRequestId(reqId);
    const req = approvedRequests.find(r => r.id === reqId);
    if (req) {
      setPoItems(req.items.map(item => ({
        name: item.name, qty: item.qty, unitPrice: item.estPrice, total: item.qty * item.estPrice,
      })));
    }
  };

  const updateItem = (idx: number, patch: Partial<ProcurementPO["items"][0]>) => {
    setPoItems(prev => prev.map((item, i) => {
      if (i !== idx) return item;
      const updated = { ...item, ...patch };
      updated.total = updated.qty * updated.unitPrice;
      return updated;
    }));
  };

  const addItem = () => {
    setPoItems(prev => [...prev, { name: "", qty: 1, unitPrice: 0, total: 0 }]);
  };

  const handleSave = () => {
    if (!selectedRequestId) { toast.error("Select an approved request"); return; }
    if (!selectedFreelancerId) { toast.error("Select a supplier (freelancer)"); return; }
    if (poItems.length === 0) { toast.error("Add at least one item"); return; }

    const freelancer = freelancers.find(f => f.id === selectedFreelancerId);
    if (!freelancer) return;

    const total = poItems.reduce((s, item) => s + item.total, 0);

    const po = createProcurementPO({
      requestId: selectedRequestId,
      freelancerId: selectedFreelancerId,
      freelancerName: freelancer.name,
      items: poItems,
      totalAmount: total,
      expectedDate: expectedDate || new Date().toISOString().slice(0, 10),
      createdBy: "Admin",
    });

    if (!po) { toast.error("Failed to create PO"); return; }

    // Link to voucher store
    linkPOToRequest(selectedRequestId, po.id);

    toast.success(`PO ${po.id} created from Request ${selectedRequestId}`);
    setShowCreate(false);
    resetForm();
    refresh();
  };

  const handleStatusChange = (poId: string, newStatus: POStatus) => {
    if (updatePOStatus(poId, newStatus)) {
      toast.success(`PO ${poId} status updated to ${newStatus}`);
      refresh();
    }
  };

  const resetForm = () => {
    setSelectedRequestId(""); setSelectedFreelancerId(""); setExpectedDate(""); setPoItems([]);
  };

  const filtered = useMemo(() =>
    procurementPOs.filter(po =>
      !search || po.id.toLowerCase().includes(search.toLowerCase()) ||
      po.freelancerName.toLowerCase().includes(search.toLowerCase()) ||
      po.requestId.toLowerCase().includes(search.toLowerCase())
    ), [search, procurementPOs.length]
  );

  const stats = useMemo(() => ({
    total: procurementPOs.length,
    created: procurementPOs.filter(p => p.status === "Created").length,
    sent: procurementPOs.filter(p => p.status === "Sent").length,
    ready: procurementPOs.filter(p => p.status === "Ready for Delivery").length,
    totalValue: procurementPOs.reduce((s, p) => s + p.totalAmount, 0),
  }), [procurementPOs.length]);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Purchase Orders</h1>
          <p className="text-muted-foreground text-sm">Create POs from approved requests, linked to suppliers (Freelancers)</p>
        </div>
        <Button onClick={() => setShowCreate(true)} size="sm"><Plus className="h-4 w-4 mr-1" /> New PO</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card><CardContent className="p-4 text-center">
          <div className="text-2xl font-bold">{stats.total}</div>
          <div className="text-xs text-muted-foreground">Total POs</div>
        </CardContent></Card>
        <Card><CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.sent}</div>
          <div className="text-xs text-muted-foreground">Sent</div>
        </CardContent></Card>
        <Card><CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-amber-600">{stats.ready}</div>
          <div className="text-xs text-muted-foreground">Ready for Delivery</div>
        </CardContent></Card>
        <Card><CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-emerald-600">{formatCurrency(stats.totalValue)}</div>
          <div className="text-xs text-muted-foreground">Total Value</div>
        </CardContent></Card>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search POs..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>PO ID</TableHead>
              <TableHead>Request</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Expected</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(po => (
              <TableRow key={po.id} className="cursor-pointer hover:bg-muted/50" onClick={() => { setSelected(po); setSheetOpen(true); }}>
                <TableCell className="font-medium">{po.id}</TableCell>
                <TableCell>{po.requestId}</TableCell>
                <TableCell>{po.freelancerName}</TableCell>
                <TableCell className="text-right font-medium">{formatCurrency(po.totalAmount)}</TableCell>
                <TableCell>{po.expectedDate}</TableCell>
                <TableCell><Badge variant="outline" className={statusColor[po.status]}>{po.status}</Badge></TableCell>
                <TableCell className="text-right space-x-1">
                  {po.status === "Created" && (
                    <Button variant="outline" size="sm" onClick={e => { e.stopPropagation(); handleStatusChange(po.id, "Sent"); }}>
                      <Send className="h-3.5 w-3.5 mr-1" /> Mark Sent
                    </Button>
                  )}
                  {po.status === "Sent" && (
                    <Button variant="outline" size="sm" onClick={e => { e.stopPropagation(); handleStatusChange(po.id, "Ready for Delivery"); }}>
                      Ready
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No purchase orders found</TableCell></TableRow>
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
                <SheetTitle className="flex items-center gap-2"><ShoppingCart className="h-5 w-5" /> {selected.id}</SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-3">
                  <div><span className="text-muted-foreground">Request:</span> <span className="font-medium">{selected.requestId}</span></div>
                  <div><span className="text-muted-foreground">Supplier:</span> <span className="font-medium">{selected.freelancerName}</span></div>
                  <div><span className="text-muted-foreground">Amount:</span> <span className="font-medium">{formatCurrency(selected.totalAmount)}</span></div>
                  <div><span className="text-muted-foreground">Status:</span> <Badge variant="outline" className={statusColor[selected.status]}>{selected.status}</Badge></div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Items</h4>
                  <Table>
                    <TableHeader><TableRow>
                      <TableHead>Item</TableHead><TableHead className="text-right">Qty</TableHead>
                      <TableHead className="text-right">Price</TableHead><TableHead className="text-right">Total</TableHead>
                    </TableRow></TableHeader>
                    <TableBody>
                      {selected.items.map((item, i) => (
                        <TableRow key={i}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell className="text-right">{item.qty}</TableCell>
                          <TableCell className="text-right">{formatCurrency(item.unitPrice)}</TableCell>
                          <TableCell className="text-right font-medium">{formatCurrency(item.total)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="text-xs text-muted-foreground border-t pt-3">
                  <div>🔗 Request: {selected.requestId} → PO: {selected.id}</div>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Create Dialog */}
      <Dialog open={showCreate} onOpenChange={v => { if (!v) resetForm(); setShowCreate(v); }}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Create Purchase Order</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Approved Request *</Label>
              <Select value={selectedRequestId} onValueChange={handleSelectRequest}>
                <SelectTrigger><SelectValue placeholder="Select approved request..." /></SelectTrigger>
                <SelectContent>
                  {approvedRequests.length === 0 && <SelectItem value="none" disabled>No approved requests</SelectItem>}
                  {approvedRequests.map(req => (
                    <SelectItem key={req.id} value={req.id}>
                      {req.id} — {req.description} ({formatCurrency(req.amount)})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {approvedRequests.length === 0 && (
                <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> No approved requests. Approve a request first.
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Supplier (Freelancer) *</Label>
                <Select value={selectedFreelancerId} onValueChange={setSelectedFreelancerId}>
                  <SelectTrigger><SelectValue placeholder="Select supplier..." /></SelectTrigger>
                  <SelectContent>
                    {freelancers.map(f => (
                      <SelectItem key={f.id} value={f.id}>{f.name} ({f.id})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Expected Date</Label>
                <Input type="date" value={expectedDate} onChange={e => setExpectedDate(e.target.value)} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Items</Label>
                <Button variant="outline" size="sm" onClick={addItem}><Plus className="h-3 w-3 mr-1" /> Add Item</Button>
              </div>
              <Table>
                <TableHeader><TableRow>
                  <TableHead>Item</TableHead><TableHead className="text-right">Qty</TableHead>
                  <TableHead className="text-right">Unit Price</TableHead><TableHead className="text-right">Total</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {poItems.map((item, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Input value={item.name} onChange={e => updateItem(i, { name: e.target.value })} placeholder="Item name" />
                      </TableCell>
                      <TableCell className="text-right">
                        <Input type="number" className="w-20 ml-auto text-right" value={item.qty} onChange={e => updateItem(i, { qty: Number(e.target.value) })} />
                      </TableCell>
                      <TableCell className="text-right">
                        <Input type="number" className="w-24 ml-auto text-right" value={item.unitPrice} onChange={e => updateItem(i, { unitPrice: Number(e.target.value) })} />
                      </TableCell>
                      <TableCell className="text-right font-medium">{formatCurrency(item.total)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="text-right font-medium mt-2">
                Total: {formatCurrency(poItems.reduce((s, item) => s + item.total, 0))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowCreate(false); resetForm(); }}>Cancel</Button>
            <Button onClick={handleSave}>Create PO</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default FinancePurchaseOrders;
