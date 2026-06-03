import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Store, Plus, CheckCircle, AlertTriangle } from "lucide-react";

const allocations = [
  { id: "ALC-001", counter: "Counter C1 - Main Gate", batchId: "BTH-2024-0891", prasadam: "Laddu Prasadam", allocated: 1200, sold: 800, free: 100, wastage: 20, balance: 280, collection: "₹20,000", date: "2024-12-15", approvedBy: "Ramesh Kumar", reconciled: false },
  { id: "ALC-002", counter: "Counter C2 - East Wing", batchId: "BTH-2024-0891", prasadam: "Laddu Prasadam", allocated: 800, sold: 600, free: 50, wastage: 10, balance: 140, collection: "₹15,000", date: "2024-12-15", approvedBy: "Ramesh Kumar", reconciled: false },
  { id: "ALC-003", counter: "Counter C3 - South Gate", batchId: "BTH-2024-0890", prasadam: "Pulihora", allocated: 600, sold: 450, free: 80, wastage: 5, balance: 65, collection: "₹6,750", date: "2024-12-15", approvedBy: "Suresh M", reconciled: true },
  { id: "ALC-004", counter: "Counter C4 - North Gate", batchId: "BTH-2024-0889", prasadam: "Sweet Pongal", allocated: 500, sold: 0, free: 0, wastage: 0, balance: 500, collection: "₹0", date: "2024-12-15", approvedBy: "Ramesh Kumar", reconciled: false },
  { id: "ALC-005", counter: "Counter C1 - Main Gate", batchId: "BTH-2024-0888", prasadam: "Vada", allocated: 1000, sold: 750, free: 100, wastage: 15, balance: 135, collection: "₹7,500", date: "2024-12-15", approvedBy: "Suresh M", reconciled: true },
];

const CounterAllocation = () => {
  const [showAllocate, setShowAllocate] = useState(false);
  const [showReconcile, setShowReconcile] = useState<typeof allocations[0] | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Counter Allocation & Reconciliation</h2>
          <p className="text-sm text-muted-foreground mt-1">Allocate finished stock to counters and reconcile daily</p>
        </div>
        <Button size="sm" onClick={() => setShowAllocate(true)}>
          <Plus className="h-4 w-4 mr-1" /> New Allocation
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-4 gap-4">
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold">5</p><p className="text-xs text-muted-foreground">Active Counters</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold">4,100</p><p className="text-xs text-muted-foreground">Total Allocated</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-green-600">2</p><p className="text-xs text-muted-foreground">Reconciled</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-amber-600">3</p><p className="text-xs text-muted-foreground">Pending Reconciliation</p></CardContent></Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <Tabs defaultValue="allocations">
            <TabsList>
              <TabsTrigger value="allocations">Allocations</TabsTrigger>
              <TabsTrigger value="reconciliation">Reconciliation</TabsTrigger>
            </TabsList>

            <TabsContent value="allocations" className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Counter</TableHead>
                    <TableHead>Prasadam</TableHead>
                    <TableHead>Batch</TableHead>
                    <TableHead className="text-right">Allocated</TableHead>
                    <TableHead className="text-right">Sold</TableHead>
                    <TableHead className="text-right">Free</TableHead>
                    <TableHead className="text-right">Balance</TableHead>
                    <TableHead>Collection</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allocations.map(a => (
                    <TableRow key={a.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setShowReconcile(a)}>
                      <TableCell className="font-medium text-sm">{a.counter}</TableCell>
                      <TableCell>{a.prasadam}</TableCell>
                      <TableCell className="font-mono text-xs">{a.batchId}</TableCell>
                      <TableCell className="text-right font-mono">{a.allocated.toLocaleString()}</TableCell>
                      <TableCell className="text-right font-mono">{a.sold.toLocaleString()}</TableCell>
                      <TableCell className="text-right font-mono">{a.free.toLocaleString()}</TableCell>
                      <TableCell className="text-right font-mono font-semibold">{a.balance.toLocaleString()}</TableCell>
                      <TableCell className="font-semibold">{a.collection}</TableCell>
                      <TableCell>
                        {a.reconciled ? (
                          <Badge className="text-xs bg-green-100 text-green-800 hover:bg-green-100"><CheckCircle className="h-3 w-3 mr-1" />Reconciled</Badge>
                        ) : (
                          <Badge variant="secondary" className="text-xs"><AlertTriangle className="h-3 w-3 mr-1" />Pending</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="reconciliation" className="mt-4">
              <div className="space-y-4">
                {allocations.filter(a => !a.reconciled).map(a => (
                  <Card key={a.id} className="border-amber-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-medium">{a.counter}</p>
                          <p className="text-sm text-muted-foreground">{a.prasadam} • Batch {a.batchId}</p>
                        </div>
                        <Button size="sm" onClick={() => setShowReconcile(a)}>Reconcile</Button>
                      </div>
                      <div className="grid grid-cols-5 gap-2 text-center text-sm">
                        <div className="bg-muted p-2 rounded"><p className="font-bold">{a.allocated}</p><p className="text-xs text-muted-foreground">Opening</p></div>
                        <div className="bg-muted p-2 rounded"><p className="font-bold">{a.sold}</p><p className="text-xs text-muted-foreground">Sold</p></div>
                        <div className="bg-muted p-2 rounded"><p className="font-bold">{a.free}</p><p className="text-xs text-muted-foreground">Free</p></div>
                        <div className="bg-muted p-2 rounded"><p className="font-bold">{a.wastage}</p><p className="text-xs text-muted-foreground">Wastage</p></div>
                        <div className="bg-primary/10 p-2 rounded"><p className="font-bold">{a.balance}</p><p className="text-xs text-muted-foreground">Closing</p></div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Formula: {a.allocated} - {a.sold} - {a.free} - {a.wastage} = {a.allocated - a.sold - a.free - a.wastage}
                        {a.balance !== a.allocated - a.sold - a.free - a.wastage && <span className="text-red-600 ml-2">⚠ Mismatch</span>}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Allocate Dialog */}
      <Dialog open={showAllocate} onOpenChange={setShowAllocate}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Allocate Stock to Counter</DialogTitle></DialogHeader>
          <div className="grid gap-4">
            <div><Label>Batch</Label>
              <Select><SelectTrigger><SelectValue placeholder="Select batch" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="BTH-2024-0891">BTH-2024-0891 - Laddu (1,800 remaining)</SelectItem>
                  <SelectItem value="BTH-2024-0888">BTH-2024-0888 - Vada (2,500 remaining)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label>Counter</Label>
              <Select><SelectTrigger><SelectValue placeholder="Select counter" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="c1">Counter C1 - Main Gate</SelectItem>
                  <SelectItem value="c2">Counter C2 - East Wing</SelectItem>
                  <SelectItem value="c3">Counter C3 - South Gate</SelectItem>
                  <SelectItem value="c4">Counter C4 - North Gate</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label>Quantity</Label><Input type="number" placeholder="e.g. 500" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAllocate(false)}>Cancel</Button>
            <Button onClick={() => setShowAllocate(false)}>Allocate</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reconcile Dialog */}
      <Dialog open={!!showReconcile} onOpenChange={() => setShowReconcile(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Counter Reconciliation</DialogTitle></DialogHeader>
          {showReconcile && (
            <div className="space-y-4">
              <div className="text-sm space-y-1">
                <p><span className="text-muted-foreground">Counter:</span> {showReconcile.counter}</p>
                <p><span className="text-muted-foreground">Prasadam:</span> {showReconcile.prasadam}</p>
                <p><span className="text-muted-foreground">Opening Allocation:</span> {showReconcile.allocated}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Qty Sold</Label><Input type="number" defaultValue={showReconcile.sold} /></div>
                <div><Label>Qty Free Distributed</Label><Input type="number" defaultValue={showReconcile.free} /></div>
                <div><Label>Wastage</Label><Input type="number" defaultValue={showReconcile.wastage} /></div>
                <div><Label>Collection Amount</Label><Input defaultValue={showReconcile.collection} /></div>
              </div>
              <div><Label>Closing Balance</Label><Input type="number" defaultValue={showReconcile.balance} /></div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReconcile(null)}>Cancel</Button>
            <Button onClick={() => setShowReconcile(null)}>Confirm Reconciliation</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CounterAllocation;
