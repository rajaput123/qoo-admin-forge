import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft } from "lucide-react";
import { Search, Plus, Factory, Clock, AlertTriangle, Package, Link2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import SelectWithAddNew from "@/components/SelectWithAddNew";
import { kitchenBatches, recipes, inventoryItems, eventRefs } from "@/data/templeData";

const BatchProduction = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showDetail, setShowDetail] = useState<typeof kitchenBatches[0] | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [selectedPrasadam, setSelectedPrasadam] = useState("");
  const [batchQty, setBatchQty] = useState("");

  const [prasadamOptions, setPrasadamOptions] = useState(recipes.map(r => r.prasadamName));
  const [eventOptions, setEventOptions] = useState(eventRefs.map(e => `${e.id} — ${e.name}`));

  const filtered = kitchenBatches.filter(b =>
    (statusFilter === "all" || b.status === statusFilter) &&
    (b.prasadam.toLowerCase().includes(search.toLowerCase()) || b.id.toLowerCase().includes(search.toLowerCase()))
  );

  // Calculate auto-deduction preview
  const selectedRecipe = recipes.find(r => r.prasadamName === selectedPrasadam);
  const qty = parseInt(batchQty) || 0;
  const deductionPreview = selectedRecipe?.items.map(item => {
    const inv = inventoryItems.find(i => i.id === item.inventoryId);
    const needed = (item.qtyPerUnit * qty) / 1000;
    return {
      ...item,
      needed,
      available: inv?.currentStock ?? 0,
      sufficient: (inv?.currentStock ?? 0) >= needed,
    };
  }) ?? [];

  if (showDetail) {
    const b = showDetail;
    return (
      <div className="p-6 space-y-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => setShowDetail(null)}><ChevronLeft className="h-4 w-4" /></Button>
              <div>
                <h1 className="text-2xl font-semibold tracking-tight">{b.id} · {b.prasadam}</h1>
                <p className="text-muted-foreground text-sm">{b.date} · {b.time}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={b.status === "Active" ? "default" : b.status === "Expiring Soon" ? "secondary" : "destructive"} className="text-xs">{b.status}</Badge>
            </div>
          </div>
          <Card>
            <CardHeader><CardTitle className="text-sm">Inventory Deductions</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Inventory ID</TableHead>
                    <TableHead>Material</TableHead>
                    <TableHead className="text-right">Consumed</TableHead>
                    <TableHead>Unit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {b.inventoryDeductions.map((d, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-mono text-xs text-primary">{d.inventoryId}</TableCell>
                      <TableCell className="font-medium">{d.inventoryName}</TableCell>
                      <TableCell className="text-right font-mono">{d.qty}</TableCell>
                      <TableCell>{d.unit}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Batch Production</h2>
          <p className="text-sm text-muted-foreground mt-1">Every batch auto-deducts raw materials from Inventory</p>
        </div>
        <Button size="sm" onClick={() => setShowCreate(true)}>
          <Plus className="h-4 w-4 mr-1" /> New Batch
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search batches..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40 bg-background"><SelectValue /></SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Expiring Soon">Expiring Soon</SelectItem>
                <SelectItem value="Expired">Expired</SelectItem>
                <SelectItem value="Closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Batch ID</TableHead>
                <TableHead>Prasadam</TableHead>
                <TableHead>Date / Time</TableHead>
                <TableHead className="text-right">Produced</TableHead>
                <TableHead className="text-right">Allocated</TableHead>
                <TableHead className="text-right">Remaining</TableHead>
                <TableHead>Inventory Consumed</TableHead>
                <TableHead>Event Link</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(b => (
                <TableRow key={b.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setShowDetail(b)}>
                  <TableCell className="font-mono text-xs">{b.id}</TableCell>
                  <TableCell className="font-medium">{b.prasadam}</TableCell>
                  <TableCell className="text-xs">{b.date} {b.time}</TableCell>
                  <TableCell className="text-right font-mono">{b.qty.toLocaleString()}</TableCell>
                  <TableCell className="text-right font-mono">{b.allocated.toLocaleString()}</TableCell>
                  <TableCell className="text-right font-mono">{b.remaining.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {b.inventoryDeductions.slice(0, 2).map((d, i) => (
                        <Badge key={i} variant="outline" className="text-[10px]">
                          <Package className="h-2.5 w-2.5 mr-0.5" />{d.inventoryName}: {d.qty}{d.unit}
                        </Badge>
                      ))}
                      {b.inventoryDeductions.length > 2 && (
                        <Badge variant="outline" className="text-[10px]">+{b.inventoryDeductions.length - 2}</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {b.eventId ? (
                      <span className="text-xs font-mono text-primary flex items-center gap-1">
                        <Link2 className="h-3 w-3" />{b.eventId}
                      </span>
                    ) : <span className="text-xs text-muted-foreground">Daily</span>}
                  </TableCell>
                  <TableCell>
                    <Badge variant={b.status === "Active" ? "default" : b.status === "Expired" ? "destructive" : b.status === "Expiring Soon" ? "secondary" : "outline"} className="text-xs">
                      {b.status === "Expiring Soon" && <Clock className="h-3 w-3 mr-1" />}
                      {b.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Batch Detail */}
      <Dialog open={!!showDetail} onOpenChange={() => setShowDetail(null)}>
        <DialogContent className="max-w-2xl bg-background">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Factory className="h-5 w-5 text-primary" />
              Batch {showDetail?.id}
              {showDetail?.eventId && (
                <Badge variant="outline" className="ml-2 text-xs">
                  <Link2 className="h-3 w-3 mr-1" />{showDetail.eventId}
                </Badge>
              )}
            </DialogTitle>
          </DialogHeader>
          {showDetail && (
            <Tabs defaultValue="overview">
              <TabsList className="w-full">
                <TabsTrigger value="overview" className="flex-1">Overview</TabsTrigger>
                <TabsTrigger value="ingredients" className="flex-1">Inventory Deductions</TabsTrigger>
                <TabsTrigger value="allocation" className="flex-1">Counter Allocation</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="mt-3 space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-muted-foreground">Prasadam:</span> <strong>{showDetail.prasadam}</strong></div>
                  <div><span className="text-muted-foreground">Date:</span> {showDetail.date} {showDetail.time}</div>
                  <div><span className="text-muted-foreground">Produced:</span> {showDetail.qty.toLocaleString()}</div>
                  <div><span className="text-muted-foreground">Allocated:</span> {showDetail.allocated.toLocaleString()}</div>
                  <div><span className="text-muted-foreground">Remaining:</span> {showDetail.remaining.toLocaleString()}</div>
                  <div><span className="text-muted-foreground">Team:</span> {showDetail.team}</div>
                  <div><span className="text-muted-foreground">Expiry:</span> {showDetail.expiry}</div>
                  <div><span className="text-muted-foreground">Status:</span> {showDetail.status}</div>
                  {showDetail.eventId && (
                    <div className="col-span-2"><span className="text-muted-foreground">Linked Event:</span> <span className="font-mono text-primary">{showDetail.eventId}</span> — {eventRefs.find(e => e.id === showDetail.eventId)?.name}</div>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="ingredients" className="mt-3">
                <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                  <Package className="h-3 w-3" /> These raw materials were auto-deducted from Inventory when this batch was created
                </p>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Inventory ID</TableHead>
                      <TableHead>Material</TableHead>
                      <TableHead className="text-right">Consumed</TableHead>
                      <TableHead>Unit</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {showDetail.inventoryDeductions.map((d, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-mono text-xs text-primary">{d.inventoryId}</TableCell>
                        <TableCell className="font-medium">{d.inventoryName}</TableCell>
                        <TableCell className="text-right font-mono">{d.qty}</TableCell>
                        <TableCell>{d.unit}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
              <TabsContent value="allocation" className="mt-3">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between p-2 bg-muted rounded"><span>Counter C1 - Main Gate</span><span className="font-mono">1,200</span></div>
                  <div className="flex justify-between p-2 bg-muted rounded"><span>Counter C2 - East Wing</span><span className="font-mono">800</span></div>
                  <div className="flex justify-between p-2 bg-muted rounded"><span>Counter C3 - South Gate</span><span className="font-mono">600</span></div>
                  <div className="flex justify-between p-2 bg-muted rounded"><span>Online Reservations</span><span className="font-mono">600</span></div>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Batch with Stock Check */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto bg-background">
          <DialogHeader><DialogTitle>Create New Batch — Stock Auto-Deduction</DialogTitle></DialogHeader>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Prasadam Type</Label>
                <SelectWithAddNew
                  value={selectedPrasadam}
                  onValueChange={setSelectedPrasadam}
                  placeholder="Select prasadam"
                  options={prasadamOptions}
                  onAddNew={v => setPrasadamOptions(p => [...p, v])}
                />
              </div>
              <div><Label className="text-xs">Quantity</Label><Input type="number" placeholder="e.g. 5000" value={batchQty} onChange={e => setBatchQty(e.target.value)} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-xs">Production Date</Label><Input type="date" /></div>
              <div><Label className="text-xs">Production Team</Label><Input placeholder="Team A" /></div>
            </div>
            <div>
              <Label className="text-xs">Link to Event (Optional)</Label>
              <Select>
                <SelectTrigger className="bg-background"><SelectValue placeholder="None — Daily production" /></SelectTrigger>
                <SelectContent className="bg-popover">
                  <SelectItem value="none">None — Daily production</SelectItem>
                  {eventRefs.map(e => (
                    <SelectItem key={e.id} value={e.id}>{e.id} — {e.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Real-time Stock Check */}
            {selectedPrasadam && qty > 0 && deductionPreview.length > 0 && (
              <Card className={deductionPreview.some(d => !d.sufficient) ? "border-amber-200 bg-amber-50/50" : "border-green-200 bg-green-50/50"}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    Inventory Stock Check — Auto-Deduction Preview
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Raw Material</TableHead>
                        <TableHead className="text-right">Required</TableHead>
                        <TableHead className="text-right">Available</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {deductionPreview.map((d, i) => (
                        <TableRow key={i} className={!d.sufficient ? "bg-red-50/50" : ""}>
                          <TableCell className="font-medium text-sm">{d.inventoryName}</TableCell>
                          <TableCell className="text-right font-mono text-sm">{d.needed.toFixed(1)} {d.unit}</TableCell>
                          <TableCell className="text-right font-mono text-sm">{d.available} {d.unit}</TableCell>
                          <TableCell>
                            {d.sufficient ? (
                              <Badge className="bg-green-100 text-green-700 border-0 text-xs">✓ Sufficient</Badge>
                            ) : (
                              <Badge className="bg-red-100 text-red-700 border-0 text-xs">
                                <AlertTriangle className="h-3 w-3 mr-1" />Shortage: {(d.needed - d.available).toFixed(1)} {d.unit}
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}

            {deductionPreview.some(d => !d.sufficient) && (
              <div className="border border-amber-200 rounded-lg p-3 bg-amber-50/50 text-xs text-amber-700">
                <AlertTriangle className="h-4 w-4 inline mr-1" />
                Insufficient stock detected. A procurement task will be auto-generated for the shortage items, and a PO request will be queued for the linked supplier.
              </div>
            )}
          </div>
            <DialogFooter>
            <Button variant="outline" onClick={() => { setShowCreate(false); setSelectedPrasadam(""); setBatchQty(""); }}>Cancel</Button>
            <Button onClick={() => {
              // perform actual deductions by inventoryId using stockService
              const qty = parseInt(batchQty) || 0;
              if (selectedRecipe && qty > 0) {
                import("@/services/stockService").then(svc => {
                  selectedRecipe.items.forEach(item => {
                    const needed = (item.qtyPerUnit * qty) / 1000;
                    // find inventory item by id
                    const inv = inventoryItems.find(i => i.id === item.inventoryId);
                    if (inv) {
                      svc.updateStock(inv.id, -needed, {
                        transactionType: "Usage Out",
                        linkedKitchenRequest: `BATCH-${Date.now()}`,
                        notes: `Batch production ${selectedPrasadam}`,
                        createdBy: "Kitchen",
                      });
                    }
                  });
                  // create a kitchen batch record (in-memory)
                  const newBatch = {
                    id: `BTH-${String(kitchenBatches.length + 1).padStart(6, "0")}`,
                    prasadam: selectedPrasadam,
                    date: new Date().toISOString().slice(0,10),
                    time: new Date().toLocaleTimeString(),
                    qty,
                    allocated: 0,
                    remaining: qty,
                    team: "Team",
                    expiry: "N/A",
                    status: "Active",
                    inventoryDeductions: selectedRecipe.items.map(it => ({ inventoryId: it.inventoryId, inventoryName: it.inventoryName, qty: (it.qtyPerUnit * qty) / 1000, unit: it.unit })),
                  };
                  kitchenBatches.push(newBatch as any);
                  toast.success("Batch created — inventory auto-deducted");
                  setShowCreate(false); setSelectedPrasadam(""); setBatchQty("");
                });
              } else {
                toast.error("Invalid batch or quantity");
              }
            }}>
              Create Batch & Deduct Stock
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BatchProduction;
