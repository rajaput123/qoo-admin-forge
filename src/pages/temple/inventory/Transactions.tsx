import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search, ArrowDownToLine, ArrowUpFromLine, ArrowLeftRight, RotateCcw, Trash2, Gift, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import SelectWithAddNew from "@/components/SelectWithAddNew";
import CustomFieldsSection, { CustomField } from "@/components/CustomFieldsSection";
import { stockTransactions, StockTransaction, TransactionType, stockItems, templeStructures, eventRefs, freelancerRefs, storageLocations } from "@/data/inventoryData";
import { updateStock } from "@/services/stockService";

const txnTypeConfig: Record<TransactionType, { icon: any; color: string }> = {
  "Purchase In": { icon: ArrowDownToLine, color: "bg-green-50 text-green-700 border-green-200" },
  "Donation In": { icon: Gift, color: "bg-pink-50 text-pink-700 border-pink-200" },
  "Usage Out": { icon: ArrowUpFromLine, color: "bg-blue-50 text-blue-700 border-blue-200" },
  "Transfer": { icon: ArrowLeftRight, color: "bg-purple-50 text-purple-700 border-purple-200" },
  "Return": { icon: RotateCcw, color: "bg-cyan-50 text-cyan-700 border-cyan-200" },
  "Damage / Waste": { icon: Trash2, color: "bg-red-50 text-red-700 border-red-200" },
};

const Transactions = () => {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const [locations, setLocations] = useState(storageLocations);
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [form, setForm] = useState({
    itemId: "", transactionType: "Usage Out" as TransactionType, quantity: "", storeLocation: "", structureId: "",
    linkedEvent: "", linkedSeva: "", linkedDarshan: "", linkedKitchenRequest: "", linkedFreelancer: "", notes: "",
  });
  const handleSaveTransaction = () => {
    const qty = Number(form.quantity || 0);
    if (!form.itemId || qty <= 0) {
      setShowModal(false);
      return;
    }
    // use centralized service to update stock and create transaction
    updateStock(form.itemId, (form.transactionType === "Purchase In" || form.transactionType === "Donation In" || form.transactionType === "Return") ? qty : -qty, {
      transactionType: form.transactionType,
      storeLocation: form.storeLocation,
      structureId: form.structureId,
      structureName: form.structureId,
      linkedEvent: form.linkedEvent || undefined,
      linkedKitchenRequest: form.linkedKitchenRequest || undefined,
      linkedFreelancer: form.linkedFreelancer || undefined,
      notes: form.notes,
      createdBy: "Store Manager",
    });
    setShowModal(false);
  };

  const filtered = stockTransactions.filter(t => {
    const matchSearch = !search || t.itemName.toLowerCase().includes(search.toLowerCase()) || t.id.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "all" || t.transactionType === typeFilter;
    return matchSearch && matchType;
  });

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Stock Transactions</h1>
          <p className="text-muted-foreground text-sm">Unified inward / outward movement log</p>
        </div>
        <Button size="sm" onClick={() => { setCustomFields([]); setShowModal(true); }}><Plus className="h-4 w-4 mr-1.5" />Record Transaction</Button>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search transactions..." className="pl-9 h-9" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-44 h-9 bg-background"><SelectValue placeholder="Transaction Type" /></SelectTrigger>
          <SelectContent className="bg-popover">
            <SelectItem value="all">All Types</SelectItem>
            {(Object.keys(txnTypeConfig) as TransactionType[]).map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date / Time</TableHead>
              <TableHead>Item</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Qty</TableHead>
              <TableHead className="text-right">Balance</TableHead>
              <TableHead>Structure</TableHead>
              <TableHead>Linked To</TableHead>
              <TableHead>By</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
          {filtered.map(txn => {
              const config = txnTypeConfig[txn.transactionType];
              const linked = txn.linkedEvent || txn.linkedSeva || txn.linkedDarshan || txn.linkedKitchenRequest || txn.linkedFreelancer;
              return (
                <TableRow key={txn.id} className="cursor-pointer hover:bg-muted/50" onClick={() => navigate(`/temple/inventory/transactions/${txn.id}`)}>
                  <TableCell>
                    <p className="text-sm">{txn.date}</p>
                    <p className="text-xs text-muted-foreground">{txn.time}</p>
                  </TableCell>
                  <TableCell className="font-medium text-sm">{txn.itemName}</TableCell>
                  <TableCell><Badge variant="outline" className={`text-xs ${config.color}`}>{txn.transactionType}</Badge></TableCell>
                  <TableCell className="text-right font-medium text-sm">{txn.quantity}</TableCell>
                  <TableCell className={`text-right text-sm font-medium ${txn.balanceAfter < 0 ? 'text-destructive' : ''}`}>{txn.balanceAfter}</TableCell>
                  <TableCell className="text-sm">{txn.structureName}</TableCell>
                  <TableCell>{linked ? <Badge variant="outline" className="text-xs">{linked}</Badge> : <span className="text-xs text-muted-foreground">—</span>}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{txn.createdBy}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      {/* Detail view moved to dedicated route /temple/inventory/transactions/:id */}
      <p className="text-xs text-muted-foreground">Showing {filtered.length} of {stockTransactions.length} transactions</p>

      {/* Record Transaction Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Record Stock Transaction</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Item *</Label>
                <Select value={form.itemId} onValueChange={v => setForm({...form, itemId: v})}>
                  <SelectTrigger className="bg-background"><SelectValue placeholder="Select item" /></SelectTrigger>
                  <SelectContent className="bg-popover">
                    {stockItems.map(i => <SelectItem key={i.id} value={i.id}>{i.name} ({i.currentStock} {i.unit})</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Transaction Type *</Label>
                <Select value={form.transactionType} onValueChange={v => setForm({...form, transactionType: v as TransactionType})}>
                  <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-popover">
                    {(Object.keys(txnTypeConfig) as TransactionType[]).map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div><Label>Quantity *</Label><Input type="number" value={form.quantity} onChange={e => setForm({...form, quantity: e.target.value})} /></div>
              <div>
                <Label>Store Location *</Label>
                <SelectWithAddNew value={form.storeLocation} onValueChange={v => setForm({...form, storeLocation: v})} options={locations} onAddNew={v => setLocations([...locations, v])} placeholder="Select location" />
              </div>
              <div>
                <Label>Structure *</Label>
                <Select value={form.structureId} onValueChange={v => setForm({...form, structureId: v})}>
                  <SelectTrigger className="bg-background"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent className="bg-popover">
                    {templeStructures.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Linked References (Optional)</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Linked Event</Label>
                <Select value={form.linkedEvent} onValueChange={v => setForm({...form, linkedEvent: v})}>
                  <SelectTrigger className="bg-background"><SelectValue placeholder="None" /></SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="none">None</SelectItem>
                    {eventRefs.map(e => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Linked Seva</Label><Input value={form.linkedSeva} onChange={e => setForm({...form, linkedSeva: e.target.value})} placeholder="e.g., Suprabhatam" /></div>
              <div><Label>Linked Darshan</Label><Input value={form.linkedDarshan} onChange={e => setForm({...form, linkedDarshan: e.target.value})} placeholder="e.g., Morning Darshan" /></div>
              <div><Label>Linked Kitchen Request</Label><Input value={form.linkedKitchenRequest} onChange={e => setForm({...form, linkedKitchenRequest: e.target.value})} placeholder="e.g., REQ-001" /></div>
              <div>
                <Label>Linked Freelancer</Label>
                <Select value={form.linkedFreelancer} onValueChange={v => setForm({...form, linkedFreelancer: v})}>
                  <SelectTrigger className="bg-background"><SelectValue placeholder="None" /></SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="none">None</SelectItem>
                    {freelancerRefs.map(f => <SelectItem key={f.id} value={f.id}>{f.businessName}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div><Label>Notes</Label><Textarea value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} placeholder="Transaction notes..." /></div>
            <CustomFieldsSection fields={customFields} onFieldsChange={setCustomFields} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={handleSaveTransaction}>Save Transaction</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default Transactions;
