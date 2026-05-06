import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Eye, Truck, CheckCircle, XCircle } from "lucide-react";
import { stockItems, stockTransactions } from "@/data/inventoryData";
import { updateStock } from "@/services/stockService";

const seedDeliveries = [
  { id: "DEL-001", poId: "PO-2026-004", supplier: "Shiva Pooja Stores", deliveryDate: "2026-02-09", materials: [{ name: "Camphor", ordered: 5, delivered: 5, accepted: 5, rejected: 0 }, { name: "Kumkum", ordered: 3, delivered: 3, accepted: 3, rejected: 0 }, { name: "Incense Sticks", ordered: 100, delivered: 100, accepted: 98, rejected: 2 }], qualityStatus: "Passed", status: "Accepted", remarks: "Minor quality issue with 2 incense packs." },
  { id: "DEL-002", poId: "PO-2026-006", supplier: "Surya Milk Dairy", deliveryDate: "2026-02-09", materials: [{ name: "Milk (Full Cream)", ordered: 50, delivered: 30, accepted: 30, rejected: 0 }], qualityStatus: "Passed", status: "Partial", remarks: "Remaining 20 ltr expected tomorrow." },
  { id: "DEL-003", poId: "PO-2026-002", supplier: "Annapurna Grocery", deliveryDate: "2026-02-10", materials: [{ name: "Rice (Sona Masuri)", ordered: 100, delivered: 100, accepted: 100, rejected: 0 }, { name: "Toor Dal", ordered: 25, delivered: 25, accepted: 24, rejected: 1 }], qualityStatus: "Passed", status: "Accepted", remarks: "1 kg dal was damaged." },
  { id: "DEL-004", poId: "PO-2026-001", supplier: "Sri Lakshmi Flowers", deliveryDate: "2026-02-10", materials: [{ name: "Rose Petals", ordered: 10, delivered: 0, accepted: 0, rejected: 0 }, { name: "Jasmine Garlands", ordered: 50, delivered: 0, accepted: 0, rejected: 0 }], qualityStatus: "Pending", status: "Expected", remarks: "" },
];

const statusColor = (s: string) => {
  if (s === "Accepted") return "text-green-700 border-green-300 bg-green-50";
  if (s === "Partial") return "text-amber-700 border-amber-300 bg-amber-50";
  if (s === "Expected") return "text-blue-700 border-blue-300 bg-blue-50";
  if (s === "Rejected") return "text-red-700 border-red-300 bg-red-50";
  return "text-muted-foreground border-border bg-muted";
};

const Deliveries = () => {
  const [search, setSearch] = useState("");
  const [allDeliveries, setAllDeliveries] = useState(seedDeliveries);
  const [selected, setSelected] = useState<typeof seedDeliveries[0] | null>(null);
  const [viewing, setViewing] = useState<typeof seedDeliveries[0] | null>(null);
  const [showRecord, setShowRecord] = useState(false);
  const [recordForm, setRecordForm] = useState({ poId: "", supplier: "", deliveryDate: "", materialsText: "", qualityStatus: "Passed", status: "Accepted", remarks: "" });

  const filtered = allDeliveries.filter(d => d.poId.toLowerCase().includes(search.toLowerCase()) || d.supplier.toLowerCase().includes(search.toLowerCase()));

  if (viewing) {
    const d = viewing;
    return (
      <div className="p-6 space-y-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">{d.id}</h1>
              <p className="text-muted-foreground text-sm">{d.supplier} · {d.poId}</p>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className={`text-xs ${statusColor(d.status)}`}>{d.status}</Badge>
              <Button size="sm" onClick={() => setViewing(null)}>Back</Button>
            </div>
          </div>
          <Card>
            <CardHeader><CardTitle className="text-sm">Material Breakdown</CardTitle></CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader><TableRow><TableHead>Material</TableHead><TableHead className="text-center">Ordered</TableHead><TableHead className="text-center">Delivered</TableHead><TableHead className="text-center">Accepted</TableHead><TableHead className="text-center">Rejected</TableHead></TableRow></TableHeader>
                <TableBody>
                  {d.materials.map((m, i) => (
                    <TableRow key={i}>
                      <TableCell className="text-sm">{m.name}</TableCell>
                      <TableCell className="text-center text-sm">{m.ordered}</TableCell>
                      <TableCell className="text-center text-sm">{m.delivered}</TableCell>
                      <TableCell className="text-center text-sm text-green-700">{m.accepted}</TableCell>
                      <TableCell className="text-center text-sm text-red-700">{m.rejected}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          {d.remarks && <div className="p-3 bg-muted/50 rounded-lg"><p className="text-xs text-muted-foreground">Remarks</p><p className="text-sm">{d.remarks}</p></div>}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Deliveries</h1>
            <p className="text-muted-foreground">Track material receipts and quality checks</p>
          </div>
          <Button size="sm" onClick={() => { setRecordForm({ poId: "", supplier: "", deliveryDate: "", materialsText: "", qualityStatus: "Passed", status: "Accepted", remarks: "" }); setShowRecord(true); }}><Plus className="h-4 w-4 mr-2" />Record Delivery</Button>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search by PO or supplier..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>PO Reference</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Quality</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(d => (
                  <TableRow key={d.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setViewing(d)}>
                    <TableCell className="font-mono text-xs">{d.poId}</TableCell>
                    <TableCell className="font-medium text-sm">{d.supplier}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{d.deliveryDate}</TableCell>
                    <TableCell>
                      {d.qualityStatus === "Passed" ? <CheckCircle className="h-4 w-4 text-green-600" /> : <span className="text-xs text-muted-foreground">{d.qualityStatus}</span>}
                    </TableCell>
                    <TableCell><Badge variant="outline" className={`text-[10px] ${statusColor(d.status)}`}>{d.status}</Badge></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>

      {/* Detail Dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <Truck className="h-5 w-5" />{selected.id}
                  <Badge variant="outline" className={`text-xs ${statusColor(selected.status)}`}>{selected.status}</Badge>
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-3 bg-muted/50 rounded-lg"><p className="text-xs text-muted-foreground">PO Reference</p><p className="font-medium text-sm font-mono">{selected.poId}</p></div>
                  <div className="p-3 bg-muted/50 rounded-lg"><p className="text-xs text-muted-foreground">Supplier</p><p className="font-medium text-sm">{selected.supplier}</p></div>
                  <div className="p-3 bg-muted/50 rounded-lg"><p className="text-xs text-muted-foreground">Delivery Date</p><p className="font-medium text-sm">{selected.deliveryDate}</p></div>
                </div>
                <Card>
                  <CardHeader className="pb-2"><CardTitle className="text-sm">Material Breakdown</CardTitle></CardHeader>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader><TableRow><TableHead>Material</TableHead><TableHead className="text-center">Ordered</TableHead><TableHead className="text-center">Delivered</TableHead><TableHead className="text-center">Accepted</TableHead><TableHead className="text-center">Rejected</TableHead></TableRow></TableHeader>
                      <TableBody>
                        {selected.materials.map((m, i) => (
                          <TableRow key={i}>
                            <TableCell className="text-sm">{m.name}</TableCell>
                            <TableCell className="text-center text-sm">{m.ordered}</TableCell>
                            <TableCell className="text-center text-sm">{m.delivered}</TableCell>
                            <TableCell className="text-center text-sm text-green-700">{m.accepted}</TableCell>
                            <TableCell className="text-center text-sm text-red-700">{m.rejected}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
                {selected.remarks && (
                  <div className="p-3 bg-muted/50 rounded-lg"><p className="text-xs text-muted-foreground">Remarks</p><p className="text-sm">{selected.remarks}</p></div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Record Delivery Dialog */}
      <Dialog open={showRecord} onOpenChange={setShowRecord}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Record Delivery</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div>
              <Label className="text-xs">PO Reference</Label>
              <Input value={recordForm.poId} onChange={e => setRecordForm({...recordForm, poId: e.target.value})} placeholder="e.g., PO-2026-010" />
            </div>
            <div>
              <Label className="text-xs">Supplier</Label>
              <Input value={recordForm.supplier} onChange={e => setRecordForm({...recordForm, supplier: e.target.value})} placeholder="Supplier name" />
            </div>
            <div><Label className="text-xs">Delivery Date</Label><Input type="date" value={recordForm.deliveryDate} onChange={e => setRecordForm({...recordForm, deliveryDate: e.target.value})} /></div>
            <div>
              <Label className="text-xs">Materials (one per line as Name:delivered)</Label>
              <Textarea placeholder="Rice (Sona Masuri):100\nToor Dal:25" rows={4} value={recordForm.materialsText} onChange={e => setRecordForm({...recordForm, materialsText: e.target.value})} />
            </div>
            <div>
              <Label className="text-xs">Quality Check</Label>
              <Select value={recordForm.qualityStatus} onValueChange={v => setRecordForm({...recordForm, qualityStatus: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Passed">Passed</SelectItem>
                  <SelectItem value="Failed">Failed</SelectItem>
                  <SelectItem value="Partial">Partial</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label className="text-xs">Remarks</Label><Textarea placeholder="Add remarks" rows={2} value={recordForm.remarks} onChange={e => setRecordForm({...recordForm, remarks: e.target.value})} /></div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowRecord(false)}>Cancel</Button>
              <Button onClick={() => {
                // Parse materials
                const lines = recordForm.materialsText.split(/\n|,/).map(l => l.trim()).filter(Boolean);
                const materials = lines.map(l => {
                  const [n, q] = l.split(":").map(x => x && x.trim());
                  const qty = Number(q || 0);
                  return { name: n || "Unknown", ordered: qty, delivered: qty, accepted: qty, rejected: 0 };
                });
                const newId = `DEL-${String(allDeliveries.length + 1).padStart(3, "0")}`;
                const newDelivery = { id: newId, poId: recordForm.poId || "N/A", supplier: recordForm.supplier || "Unknown", deliveryDate: recordForm.deliveryDate || new Date().toISOString().slice(0,10), materials, qualityStatus: recordForm.qualityStatus, status: recordForm.status, remarks: recordForm.remarks };
                // Update inventory and transactions for each accepted material using centralized service
                materials.forEach(m => {
                  // match by exact name or fallback to substring
                  const item = stockItems.find(si => si.name.toLowerCase() === (m.name || "").toLowerCase()) || stockItems.find(si => si.name.toLowerCase().includes(((m.name || "").toLowerCase().split(" ")[0])));
                  if (item) {
                    updateStock(item.id, Number(m.accepted || 0), {
                      transactionType: "Purchase In",
                      notes: `Delivery ${newId} from ${recordForm.supplier}`,
                      createdBy: "Store Manager",
                    });
                  }
                });
                setAllDeliveries([...allDeliveries, newDelivery]);
                setShowRecord(false);
              }}>Record</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Deliveries;
