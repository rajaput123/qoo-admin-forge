import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import CustomFieldsSection, { CustomField } from "@/components/CustomFieldsSection";
import { stockAdjustments, AdjustmentReason, adjustmentReasons, stockItems, templeStructures, storageLocations } from "@/data/inventoryData";
import { updateStock } from "@/services/stockService";
import SelectWithAddNew from "@/components/SelectWithAddNew";

const reasonColor: Record<AdjustmentReason, string> = {
  "Physical Count": "bg-blue-50 text-blue-700 border-blue-200",
  Damage: "bg-red-50 text-red-700 border-red-200",
  Expired: "bg-orange-50 text-orange-700 border-orange-200",
  Correction: "bg-green-50 text-green-700 border-green-200",
  "Theft / Loss": "bg-red-50 text-red-700 border-red-200",
  "System Error": "bg-purple-50 text-purple-700 border-purple-200",
};

const Adjustments = () => {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [locations, setLocations] = useState(storageLocations);
  const [form, setForm] = useState({
    itemId: "", actualQty: "", reason: "Physical Count" as AdjustmentReason, structureName: "", storeLocation: "", notes: "",
  });

  const filtered = stockAdjustments.filter(a =>
    !search || a.itemName.toLowerCase().includes(search.toLowerCase()) || a.id.toLowerCase().includes(search.toLowerCase())
  );

  const selectedItem = stockItems.find(i => i.id === form.itemId);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Stock Adjustments</h1>
          <p className="text-muted-foreground text-sm">Physical count reconciliation & corrections</p>
        </div>
        <Button size="sm" onClick={() => { setCustomFields([]); setShowModal(true); }}><Plus className="h-4 w-4 mr-1.5" />New Adjustment</Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search adjustments..." className="pl-9 h-9" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Item</TableHead>
              <TableHead className="text-right">System Qty</TableHead>
              <TableHead className="text-right">Actual Qty</TableHead>
              <TableHead className="text-right">Difference</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Structure</TableHead>
              <TableHead>Adjusted By</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(adj => (
              <TableRow key={adj.id}>
                <TableCell className="text-sm">{adj.date}</TableCell>
                <TableCell className="font-medium text-sm">{adj.itemName}</TableCell>
                <TableCell className="text-right text-sm">{adj.systemQty}</TableCell>
                <TableCell className="text-right text-sm">{adj.actualQty}</TableCell>
                <TableCell className={`text-right text-sm font-medium ${adj.difference < 0 ? 'text-destructive' : adj.difference > 0 ? 'text-green-600' : ''}`}>
                  {adj.difference > 0 ? "+" : ""}{adj.difference}
                </TableCell>
                <TableCell><Badge variant="outline" className={`text-xs ${reasonColor[adj.reason]}`}>{adj.reason}</Badge></TableCell>
                <TableCell className="text-sm">{adj.structureName}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{adj.adjustedBy}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <p className="text-xs text-muted-foreground">Showing {filtered.length} of {stockAdjustments.length} adjustments</p>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>New Stock Adjustment</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Item *</Label>
              <Select value={form.itemId} onValueChange={v => setForm({...form, itemId: v})}>
                <SelectTrigger className="bg-background"><SelectValue placeholder="Select item" /></SelectTrigger>
                <SelectContent className="bg-popover">
                  {stockItems.map(i => <SelectItem key={i.id} value={i.id}>{i.name} (System: {i.currentStock} {i.unit})</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            {selectedItem && (
              <div className="p-3 bg-muted/50 rounded-lg text-sm">
                <span className="text-muted-foreground">System Quantity:</span>{" "}
                <span className="font-medium">{selectedItem.currentStock} {selectedItem.unit}</span>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Actual Quantity *</Label><Input type="number" value={form.actualQty} onChange={e => setForm({...form, actualQty: e.target.value})} /></div>
              <div>
                <Label>Reason *</Label>
                <Select value={form.reason} onValueChange={v => setForm({...form, reason: v as AdjustmentReason})}>
                  <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-popover">
                    {adjustmentReasons.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Structure</Label>
                <Select value={form.structureName} onValueChange={v => setForm({...form, structureName: v})}>
                  <SelectTrigger className="bg-background"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent className="bg-popover">
                    {templeStructures.map(s => <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Store Location</Label>
                <SelectWithAddNew value={form.storeLocation} onValueChange={v => setForm({...form, storeLocation: v})} options={locations} onAddNew={v => setLocations([...locations, v])} placeholder="Select location" />
              </div>
            </div>
            <div><Label>Notes</Label><Textarea value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} placeholder="Adjustment reason details..." /></div>
            <CustomFieldsSection fields={customFields} onFieldsChange={setCustomFields} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={() => {
              const item = stockItems.find(i => i.id === form.itemId);
              if (!item) { setShowModal(false); return; }
              const actual = Number(form.actualQty) || 0;
              const systemQty = item.currentStock || 0;
              const delta = actual - systemQty;
              // choose transaction type: positive => Purchase In, negative => Damage / Waste
              const txnType = delta >= 0 ? "Purchase In" : "Damage / Waste";
              // update stock and create transaction
              updateStock(form.itemId, delta, {
                transactionType: txnType,
                storeLocation: form.storeLocation,
                structureId: form.structureName,
                notes: form.notes,
                createdBy: "Inventory Auditor",
              });
              // add adjustment record
              const adjId = `ADJ-${String(stockAdjustments.length + 1).padStart(3, "0")}`;
              stockAdjustments.unshift({
                id: adjId,
                date: new Date().toISOString().slice(0,10),
                itemId: item.id,
                itemName: item.name,
                systemQty,
                actualQty: actual,
                difference: actual - systemQty,
                reason: form.reason,
                structureName: form.structureName,
                storeLocation: form.storeLocation,
                notes: form.notes,
                adjustedBy: "Inventory Auditor",
              });
              setShowModal(false);
            }}>Save Adjustment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default Adjustments;
