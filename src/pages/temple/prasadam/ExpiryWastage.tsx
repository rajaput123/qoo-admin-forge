import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, Clock, Trash2, Plus } from "lucide-react";

const expiringBatches = [
  { batchId: "BTH-2024-0889", prasadam: "Sweet Pongal", remaining: 800, expiry: "Today 11:00 AM", timeLeft: "2 hours", status: "Expiring Soon" },
  { batchId: "BTH-2024-0890", prasadam: "Pulihora", remaining: 900, expiry: "Today 1:30 PM", timeLeft: "4.5 hours", status: "Warning" },
  { batchId: "BTH-2024-0887", prasadam: "Curd Rice", remaining: 0, expiry: "Today 5:00 AM", timeLeft: "Expired", status: "Expired" },
];

const wastageLog = [
  { id: "WST-001", batchId: "BTH-2024-0887", prasadam: "Curd Rice", qty: 200, reason: "Expired - shelf life exceeded", date: "2024-12-15", approvedBy: "Ramesh Kumar" },
  { id: "WST-002", batchId: "BTH-2024-0885", prasadam: "Laddu Prasadam", qty: 50, reason: "Damaged during transport to counter", date: "2024-12-14", approvedBy: "Suresh M" },
  { id: "WST-003", batchId: "BTH-2024-0880", prasadam: "Pulihora", qty: 120, reason: "Quality rejected at counter", date: "2024-12-13", approvedBy: "Ramesh Kumar" },
  { id: "WST-004", batchId: "BTH-2024-0878", prasadam: "Sweet Pongal", qty: 300, reason: "Expired - not distributed in time", date: "2024-12-12", approvedBy: "Suresh M" },
];

const ExpiryWastage = () => {
  const [showWastage, setShowWastage] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Expiry & Wastage Control</h2>
          <p className="text-sm text-muted-foreground mt-1">Monitor shelf life and track wastage for audit compliance</p>
        </div>
        <Button size="sm" onClick={() => setShowWastage(true)}>
          <Plus className="h-4 w-4 mr-1" /> Log Wastage
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Card className="border-amber-200 bg-amber-50/30"><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-amber-600">2</p><p className="text-xs text-muted-foreground">Expiring Soon</p></CardContent></Card>
        <Card className="border-red-200 bg-red-50/30"><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-red-600">1</p><p className="text-xs text-muted-foreground">Expired Today</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold">670</p><p className="text-xs text-muted-foreground">Units Wasted (This Week)</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold">2.1%</p><p className="text-xs text-muted-foreground">Wastage Rate</p></CardContent></Card>
      </div>

      <Tabs defaultValue="expiry">
        <TabsList>
          <TabsTrigger value="expiry">Expiry Alerts</TabsTrigger>
          <TabsTrigger value="wastage">Wastage Log</TabsTrigger>
        </TabsList>

        <TabsContent value="expiry" className="mt-4 space-y-3">
          {expiringBatches.map(b => (
            <Card key={b.batchId} className={b.status === "Expired" ? "border-red-200 bg-red-50/30" : "border-amber-200 bg-amber-50/30"}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {b.status === "Expired" ? <Trash2 className="h-5 w-5 text-red-500" /> : <Clock className="h-5 w-5 text-amber-500" />}
                    <div>
                      <p className="font-medium">{b.prasadam}</p>
                      <p className="text-xs text-muted-foreground">Batch {b.batchId} • Expiry: {b.expiry}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="font-mono font-bold">{b.remaining} units</p>
                      <p className="text-xs text-muted-foreground">{b.timeLeft}</p>
                    </div>
                    <Badge variant={b.status === "Expired" ? "destructive" : "secondary"} className="text-xs">{b.status}</Badge>
                    {b.status === "Expired" && <Button size="sm" variant="destructive" className="text-xs">Move to Wastage</Button>}
                    {b.status !== "Expired" && <Button size="sm" variant="outline" className="text-xs">Rush Distribute</Button>}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="wastage" className="mt-4">
          <Card>
            <CardContent className="p-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Wastage ID</TableHead>
                    <TableHead>Batch</TableHead>
                    <TableHead>Prasadam</TableHead>
                    <TableHead className="text-right">Qty Wasted</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Approved By</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {wastageLog.map(w => (
                    <TableRow key={w.id}>
                      <TableCell className="font-mono text-xs">{w.id}</TableCell>
                      <TableCell className="font-mono text-xs">{w.batchId}</TableCell>
                      <TableCell className="font-medium">{w.prasadam}</TableCell>
                      <TableCell className="text-right font-mono text-red-600">{w.qty}</TableCell>
                      <TableCell className="text-xs max-w-[200px] truncate">{w.reason}</TableCell>
                      <TableCell className="text-xs">{w.date}</TableCell>
                      <TableCell className="text-xs">{w.approvedBy}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={showWastage} onOpenChange={setShowWastage}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Log Wastage</DialogTitle></DialogHeader>
          <div className="grid gap-4">
            <div><Label>Batch ID</Label><Input placeholder="BTH-2024-XXXX" /></div>
            <div><Label>Quantity Wasted</Label><Input type="number" placeholder="0" /></div>
            <div><Label>Reason</Label><Input placeholder="e.g. Expired, Quality issue" /></div>
            <div><Label>Approved By</Label><Input placeholder="Approver name" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowWastage(false)}>Cancel</Button>
            <Button onClick={() => setShowWastage(false)}>Log Wastage</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExpiryWastage;
