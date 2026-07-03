import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Search, Plus } from "lucide-react";
import { addDelivery, deliveries, getPurchaseOrder, getPOStatus, nextDeliveryId, purchaseOrders, type DeliveryLine } from "@/data/purchaseData";
import { updateStock } from "@/services/stockService";

const statusColor: Record<string, string> = {
  "Accepted": "bg-green-50 text-green-700 border-green-200",
  "Pending": "bg-amber-50 text-amber-700 border-amber-200",
  "Partial": "bg-blue-50 text-blue-700 border-blue-200",
};

const Deliveries = () => {
  const [search, setSearch] = useState("");
  const [showRecord, setShowRecord] = useState(false);
  const [recPoId, setRecPoId] = useState("");
  const [recReceivedDate, setRecReceivedDate] = useState(new Date().toISOString().slice(0, 10));
  const [recInvoiceNo, setRecInvoiceNo] = useState("");
  const [recReceivedBy, setRecReceivedBy] = useState("Store Manager");
  const [recNotes, setRecNotes] = useState("");
  const [recLines, setRecLines] = useState<DeliveryLine[]>([]);
  const navigate = useNavigate();

  const filtered = useMemo(() => {
    return deliveries.filter(d =>
      !search ||
      d.id.toLowerCase().includes(search.toLowerCase()) ||
      d.poId.toLowerCase().includes(search.toLowerCase()) ||
      d.supplier.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, showRecord]); // showRecord toggles after save/close, forcing refresh

  const selectedPO = recPoId ? getPurchaseOrder(recPoId) : undefined;

  const addLine = () => {
    if (!selectedPO) {
      toast.error("Select a PO first");
      return;
    }
    setRecLines(p => ([
      ...p,
      {
        id: `DL-${p.length + 1}`,
        poLineId: "",
        itemId: "",
        itemName: "",
        orderedQty: 0,
        deliveredQty: 0,
        acceptedQty: 0,
        rejectedQty: 0,
        unitPrice: 0,
        totalAmount: 0,
      }
    ]));
  };

  const updateLine = (idx: number, patch: Partial<DeliveryLine>) => {
    setRecLines(p => p.map((l, i) => {
      if (i !== idx) return l;
      const next: DeliveryLine = { ...l, ...patch } as DeliveryLine;
      const deliveredQty = Number(next.deliveredQty || 0);
      const acceptedQty = Math.min(Number(next.acceptedQty || 0), deliveredQty);
      next.deliveredQty = deliveredQty;
      next.acceptedQty = acceptedQty;
      next.rejectedQty = Math.max(deliveredQty - acceptedQty, 0);
      next.totalAmount = (acceptedQty || 0) * (Number(next.unitPrice || 0));
      return next;
    }));
  };

  const resetRecordForm = () => {
    setRecPoId("");
    setRecReceivedDate(new Date().toISOString().slice(0, 10));
    setRecInvoiceNo("");
    setRecReceivedBy("Store Manager");
    setRecNotes("");
    setRecLines([]);
  };

  const computeDeliveryStatus = (lines: DeliveryLine[]) => {
    if (lines.length === 0) return "Pending" as const;
    const anyAccepted = lines.some(l => (l.acceptedQty || 0) > 0);
    const allFull = lines.every(l => (l.orderedQty || 0) > 0 && (l.acceptedQty || 0) >= (l.orderedQty || 0) && (l.rejectedQty || 0) === 0);
    if (allFull) return "Accepted" as const;
    if (anyAccepted) return "Partial" as const;
    return "Pending" as const;
  };

  const handleSaveDelivery = () => {
    const po = selectedPO;
    if (!po) { toast.error("Select a PO"); return; }
    if (recLines.length === 0) { toast.error("Add at least one delivery line"); return; }
    if (recLines.some(l => !l.poLineId || !l.itemId)) { toast.error("Select PO line for each delivery line"); return; }
    if (recLines.some(l => (l.deliveredQty || 0) <= 0)) { toast.error("Delivered qty must be > 0"); return; }
    if (recLines.some(l => (l.acceptedQty || 0) < 0)) { toast.error("Accepted qty must be >= 0"); return; }

    const id = nextDeliveryId();
    const status = computeDeliveryStatus(recLines);

    const delivery = addDelivery({
      id,
      poId: po.id,
      supplier: po.supplier,
      receivedDate: recReceivedDate,
      status,
      receivedBy: recReceivedBy,
      notes: recNotes,
      invoiceNo: recInvoiceNo,
      lines: recLines,
    });

    // Update stock + create Purchase In transactions for accepted qty (amounts tracked only for Purchase In)
    for (const ln of recLines) {
      const accepted = Number(ln.acceptedQty || 0);
      if (accepted <= 0) continue;
      updateStock(ln.itemId, accepted, {
        transactionType: "Purchase In",
        unitPrice: ln.unitPrice,
        totalAmount: accepted * ln.unitPrice,
        notes: `PO ${po.id} • Delivery ${id} • Invoice ${recInvoiceNo || "—"}`,
        createdBy: recReceivedBy || "Store Manager",
      });
    }

    // Persist computed status on PO object for list consistency
    const newStatus = getPOStatus(po.id);
    const poIdx = purchaseOrders.findIndex(p => p.id === po.id);
    if (poIdx >= 0) purchaseOrders[poIdx].status = newStatus;

    toast.success(`Delivery ${delivery.id} recorded`);
    setShowRecord(false);
    resetRecordForm();
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search deliveries..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-9" />
          </div>
          <Button size="sm" className="gap-2" onClick={() => setShowRecord(true)}><Plus className="h-4 w-4" />Record Delivery</Button>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>PO Number</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Received Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">No deliveries found</TableCell></TableRow>
              ) : filtered.map(delivery => (
                <TableRow
                  key={delivery.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => navigate(`/temple/inventory/purchases/deliveries/${delivery.id}`)}
                >
                  <TableCell className="font-mono text-xs">{delivery.poId}</TableCell>
                  <TableCell className="font-medium text-sm">{delivery.supplier}</TableCell>
                  <TableCell className="text-sm">{delivery.receivedDate}</TableCell>
                  <TableCell><Badge variant="outline" className={`text-xs ${statusColor[delivery.status]}`}>{delivery.status}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <p className="text-xs text-muted-foreground mt-2">Showing {filtered.length} of {deliveries.length} deliveries</p>
      </motion.div>

      <Dialog open={showRecord} onOpenChange={(o) => { setShowRecord(o); if (!o) resetRecordForm(); }}>
        <DialogContent className="max-w-4xl">
          <DialogHeader><DialogTitle>Record Delivery (GRN)</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Purchase Order</Label>
                <Select value={recPoId} onValueChange={(v) => { setRecPoId(v); setRecLines([]); }}>
                  <SelectTrigger className="bg-background"><SelectValue placeholder="Select PO" /></SelectTrigger>
                  <SelectContent className="bg-popover">
                    {purchaseOrders.map(po => (
                      <SelectItem key={po.id} value={po.id}>
                        {po.id} • {po.supplier}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Received Date</Label>
                <Input type="date" value={recReceivedDate} onChange={e => setRecReceivedDate(e.target.value)} />
              </div>
              <div>
                <Label className="text-xs">Invoice No</Label>
                <Input value={recInvoiceNo} onChange={e => setRecInvoiceNo(e.target.value)} placeholder="e.g., INV-1234" />
              </div>
              <div>
                <Label className="text-xs">Received By</Label>
                <Input value={recReceivedBy} onChange={e => setRecReceivedBy(e.target.value)} placeholder="e.g., Store Manager" />
              </div>
            </div>

            <div>
              <Label className="text-xs">Notes</Label>
              <Input value={recNotes} onChange={e => setRecNotes(e.target.value)} placeholder="Optional notes (quality check, packing, etc.)" />
            </div>

            <div className="border rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium">Delivery Lines</p>
                <Button size="sm" variant="outline" onClick={addLine} disabled={!selectedPO}>Add Line</Button>
              </div>

              {recLines.length === 0 ? (
                <p className="text-sm text-muted-foreground">Add at least one line to record accepted qty into stock.</p>
              ) : recLines.map((l, idx) => (
                <div key={l.id} className="grid grid-cols-12 gap-2 items-end mb-2">
                  <div className="col-span-4">
                    <Label className="text-xs">PO Line / Item</Label>
                    <Select value={l.poLineId} onValueChange={(poLineId) => {
                      const po = selectedPO;
                      const line = po?.lines.find(pl => pl.id === poLineId);
                      if (!po || !line) return;
                      updateLine(idx, {
                        poLineId,
                        itemId: line.itemId,
                        itemName: line.itemName,
                        orderedQty: line.qty,
                        unitPrice: line.unitPrice,
                        deliveredQty: Math.max(l.deliveredQty || 0, 1),
                        acceptedQty: Math.min(l.acceptedQty || 0, Math.max(l.deliveredQty || 0, 1)),
                      });
                    }}>
                      <SelectTrigger className="bg-background"><SelectValue placeholder="Select PO line" /></SelectTrigger>
                      <SelectContent className="bg-popover">
                        {(selectedPO?.lines || []).map(pl => (
                          <SelectItem key={pl.id} value={pl.id}>
                            {pl.itemName} • Ordered {pl.qty}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="col-span-2">
                    <Label className="text-xs">Ordered</Label>
                    <Input value={String(l.orderedQty || 0)} readOnly />
                  </div>
                  <div className="col-span-2">
                    <Label className="text-xs">Delivered</Label>
                    <Input type="number" value={String(l.deliveredQty || 0)} onChange={e => updateLine(idx, { deliveredQty: Number(e.target.value) })} />
                  </div>
                  <div className="col-span-2">
                    <Label className="text-xs">Accepted</Label>
                    <Input type="number" value={String(l.acceptedQty || 0)} onChange={e => updateLine(idx, { acceptedQty: Number(e.target.value) })} />
                  </div>
                  <div className="col-span-2">
                    <Label className="text-xs">Rejected</Label>
                    <Input value={String(l.rejectedQty || 0)} readOnly />
                  </div>

                  <div className="col-span-10">
                    <p className="text-xs text-muted-foreground">
                      {l.itemName ? `${l.itemName} • Rate ₹${Number(l.unitPrice || 0).toFixed(2)} • Accepted Amount ₹${Number(l.totalAmount || 0).toFixed(2)}` : "Select a PO line"}
                    </p>
                  </div>
                  <div className="col-span-2 flex justify-end">
                    <Button variant="outline" size="sm" onClick={() => setRecLines(p => p.filter((_, i) => i !== idx))}>Remove</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRecord(false)}>Cancel</Button>
            <Button onClick={handleSaveDelivery}>Record Delivery</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Deliveries;
