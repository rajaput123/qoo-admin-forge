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
import { Package, Search, Plus, Eye, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { toast } from "sonner";
import {
  goodsReceipts, procurementPOs, createGRN,
  type GoodsReceipt as GRNType, type ProcurementPO
} from "@/stores/procurementStore";

const statusColor: Record<string, string> = {
  Full: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Partial: "bg-amber-50 text-amber-700 border-amber-200",
  Pending: "bg-blue-50 text-blue-700 border-blue-200",
};

const formatCurrency = (val: number) => `₹${val.toLocaleString("en-IN")}`;

const GoodsReceiptPage = () => {
  const [, setTick] = useState(0);
  const refresh = () => setTick(t => t + 1);
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [selected, setSelected] = useState<GRNType | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  // Form state
  const [selectedPOId, setSelectedPOId] = useState("");
  const [receivedBy, setReceivedBy] = useState("");
  const [notes, setNotes] = useState("");
  const [grnItems, setGrnItems] = useState<GRNType["items"]>([]);

  const eligiblePOs = useMemo(() =>
    procurementPOs.filter(po => po.status !== "Created" && po.status !== "Closed"), [showCreate]
  );

  const handleSelectPO = (poId: string) => {
    setSelectedPOId(poId);
    const po = procurementPOs.find(p => p.id === poId);
    if (po) {
      setGrnItems(po.items.map(item => ({
        name: item.name, orderedQty: item.qty, receivedQty: item.qty,
        acceptedQty: item.qty, rejectedQty: 0, unitPrice: item.unitPrice
      })));
    }
  };

  const updateGrnItem = (idx: number, patch: Partial<GRNType["items"][0]>) => {
    setGrnItems(prev => prev.map((item, i) => {
      if (i !== idx) return item;
      const updated = { ...item, ...patch };
      updated.acceptedQty = updated.receivedQty - updated.rejectedQty;
      return updated;
    }));
  };

  const handleSave = () => {
    if (!selectedPOId) { toast.error("Select a Purchase Order"); return; }
    if (!receivedBy) { toast.error("Enter received by name"); return; }

    // Validate quantities
    const po = procurementPOs.find(p => p.id === selectedPOId);
    if (!po) return;
    for (let i = 0; i < grnItems.length; i++) {
      if (grnItems[i].receivedQty > grnItems[i].orderedQty) {
        toast.error(`Received qty cannot exceed ordered qty for ${grnItems[i].name}`);
        return;
      }
    }

    const allFull = grnItems.every(item => item.acceptedQty >= item.orderedQty);
    const status = allFull ? "Full" : grnItems.some(item => item.acceptedQty > 0) ? "Partial" : "Pending";

    const grn = createGRN({
      poId: selectedPOId,
      requestId: po.requestId,
      freelancerId: po.freelancerId,
      freelancerName: po.freelancerName,
      items: grnItems,
      receivedDate: new Date().toISOString().slice(0, 10),
      receivedBy,
      status,
      notes,
    });

    if (!grn) { toast.error("Cannot create GRN. PO must be in Sent or Ready status."); return; }

    toast.success(`GRN ${grn.id} created successfully`);
    setShowCreate(false);
    resetForm();
    refresh();
  };

  const resetForm = () => {
    setSelectedPOId(""); setReceivedBy(""); setNotes(""); setGrnItems([]);
  };

  const filtered = useMemo(() =>
    goodsReceipts.filter(g =>
      !search || g.id.toLowerCase().includes(search.toLowerCase()) ||
      g.freelancerName.toLowerCase().includes(search.toLowerCase()) ||
      g.poId.toLowerCase().includes(search.toLowerCase())
    ), [search, goodsReceipts.length]
  );

  const stats = useMemo(() => ({
    total: goodsReceipts.length,
    full: goodsReceipts.filter(g => g.status === "Full").length,
    partial: goodsReceipts.filter(g => g.status === "Partial").length,
    pending: goodsReceipts.filter(g => g.status === "Pending").length,
  }), [goodsReceipts.length]);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Goods Receipt (GRN)</h1>
          <p className="text-muted-foreground text-sm">Record delivery of goods against Purchase Orders</p>
        </div>
        <Button onClick={() => setShowCreate(true)} size="sm"><Plus className="h-4 w-4 mr-1" /> New GRN</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card><CardContent className="p-4 text-center">
          <div className="text-2xl font-bold">{stats.total}</div>
          <div className="text-xs text-muted-foreground">Total GRNs</div>
        </CardContent></Card>
        <Card><CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-emerald-600">{stats.full}</div>
          <div className="text-xs text-muted-foreground">Full Delivery</div>
        </CardContent></Card>
        <Card><CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-amber-600">{stats.partial}</div>
          <div className="text-xs text-muted-foreground">Partial</div>
        </CardContent></Card>
        <Card><CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.pending}</div>
          <div className="text-xs text-muted-foreground">Pending</div>
        </CardContent></Card>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search GRN, PO, Supplier..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>GRN ID</TableHead>
              <TableHead>PO ID</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead>Received Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Received By</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(grn => (
              <TableRow key={grn.id} className="cursor-pointer hover:bg-muted/50" onClick={() => { setSelected(grn); setSheetOpen(true); }}>
                <TableCell className="font-medium">{grn.id}</TableCell>
                <TableCell>{grn.poId}</TableCell>
                <TableCell>{grn.freelancerName}</TableCell>
                <TableCell>{grn.receivedDate}</TableCell>
                <TableCell><Badge variant="outline" className={statusColor[grn.status]}>{grn.status}</Badge></TableCell>
                <TableCell>{grn.receivedBy}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={e => { e.stopPropagation(); setSelected(grn); setSheetOpen(true); }}>
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No goods receipts found</TableCell></TableRow>
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
                  <Package className="h-5 w-5" /> {selected.id}
                </SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-muted-foreground">PO:</span> <span className="font-medium">{selected.poId}</span></div>
                  <div><span className="text-muted-foreground">Request:</span> <span className="font-medium">{selected.requestId}</span></div>
                  <div><span className="text-muted-foreground">Supplier:</span> <span className="font-medium">{selected.freelancerName}</span></div>
                  <div><span className="text-muted-foreground">Status:</span> <Badge variant="outline" className={statusColor[selected.status]}>{selected.status}</Badge></div>
                  <div><span className="text-muted-foreground">Received:</span> <span className="font-medium">{selected.receivedDate}</span></div>
                  <div><span className="text-muted-foreground">By:</span> <span className="font-medium">{selected.receivedBy}</span></div>
                </div>
                {selected.notes && <p className="text-sm bg-muted/50 p-2 rounded">{selected.notes}</p>}
                <div>
                  <h4 className="font-medium text-sm mb-2">Items Received</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead className="text-right">Ordered</TableHead>
                        <TableHead className="text-right">Received</TableHead>
                        <TableHead className="text-right">Accepted</TableHead>
                        <TableHead className="text-right">Rejected</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selected.items.map((item, i) => (
                        <TableRow key={i}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell className="text-right">{item.orderedQty}</TableCell>
                          <TableCell className="text-right">{item.receivedQty}</TableCell>
                          <TableCell className="text-right text-emerald-600">{item.acceptedQty}</TableCell>
                          <TableCell className="text-right text-red-600">{item.rejectedQty}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                {/* Traceability */}
                <div className="text-xs text-muted-foreground border-t pt-3 space-y-1">
                  <div>🔗 Request: {selected.requestId} → PO: {selected.poId} → GRN: {selected.id}</div>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Create Dialog */}
      <Dialog open={showCreate} onOpenChange={v => { if (!v) resetForm(); setShowCreate(v); }}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Goods Receipt</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Purchase Order *</Label>
              <Select value={selectedPOId} onValueChange={handleSelectPO}>
                <SelectTrigger><SelectValue placeholder="Select PO..." /></SelectTrigger>
                <SelectContent>
                  {eligiblePOs.length === 0 && <SelectItem value="none" disabled>No eligible POs</SelectItem>}
                  {eligiblePOs.map(po => (
                    <SelectItem key={po.id} value={po.id}>
                      {po.id} — {po.freelancerName} ({formatCurrency(po.totalAmount)})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {eligiblePOs.length === 0 && (
                <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> No POs available. PO must be in Sent or Ready status.
                </p>
              )}
            </div>

            <div>
              <Label>Received By *</Label>
              <Input value={receivedBy} onChange={e => setReceivedBy(e.target.value)} placeholder="Name of person receiving goods" />
            </div>

            {grnItems.length > 0 && (
              <div>
                <Label>Items</Label>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead className="text-right">Ordered</TableHead>
                      <TableHead className="text-right">Received</TableHead>
                      <TableHead className="text-right">Rejected</TableHead>
                      <TableHead className="text-right">Accepted</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {grnItems.map((item, i) => (
                      <TableRow key={i}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell className="text-right">{item.orderedQty}</TableCell>
                        <TableCell className="text-right">
                          <Input type="number" className="w-20 ml-auto text-right" value={item.receivedQty}
                            onChange={e => updateGrnItem(i, { receivedQty: Math.min(Number(e.target.value), item.orderedQty) })} />
                        </TableCell>
                        <TableCell className="text-right">
                          <Input type="number" className="w-20 ml-auto text-right" value={item.rejectedQty}
                            onChange={e => updateGrnItem(i, { rejectedQty: Math.min(Number(e.target.value), item.receivedQty) })} />
                        </TableCell>
                        <TableCell className="text-right font-medium text-emerald-600">{item.acceptedQty}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            <div>
              <Label>Notes</Label>
              <Textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Any remarks..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowCreate(false); resetForm(); }}>Cancel</Button>
            <Button onClick={handleSave}>Create GRN</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default GoodsReceiptPage;
