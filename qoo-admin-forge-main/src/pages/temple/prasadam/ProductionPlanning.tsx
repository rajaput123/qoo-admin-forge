import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, AlertTriangle, CheckCircle, Calendar } from "lucide-react";

const plans = [
  { id: "PLN-001", date: "2024-12-15", prasadam: "Laddu Prasadam", planned: 15000, event: "-", onlineDemand: 2450, sponsorship: 5000, ingredientStatus: "Available", status: "Approved" },
  { id: "PLN-002", date: "2024-12-15", prasadam: "Pulihora", planned: 8000, event: "-", onlineDemand: 1200, sponsorship: 0, ingredientStatus: "Available", status: "Approved" },
  { id: "PLN-003", date: "2024-12-15", prasadam: "Sweet Pongal", planned: 6000, event: "-", onlineDemand: 800, sponsorship: 1000, ingredientStatus: "Low Stock", status: "Warning" },
  { id: "PLN-004", date: "2024-12-15", prasadam: "Vada", planned: 10000, event: "-", onlineDemand: 1500, sponsorship: 0, ingredientStatus: "Available", status: "Approved" },
  { id: "PLN-005", date: "2024-12-16", prasadam: "Festival Laddu (Large)", planned: 25000, event: "Vaikunta Ekadashi", onlineDemand: 8000, sponsorship: 10000, ingredientStatus: "Insufficient", status: "Blocked" },
];

const ProductionPlanning = () => {
  const [dateFilter, setDateFilter] = useState("2024-12-15");
  const [showAdd, setShowAdd] = useState(false);

  const filtered = plans.filter(p => p.date === dateFilter);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Approved": return <Badge className="text-xs bg-green-100 text-green-800 hover:bg-green-100"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>;
      case "Warning": return <Badge className="text-xs bg-amber-100 text-amber-800 hover:bg-amber-100"><AlertTriangle className="h-3 w-3 mr-1" />Warning</Badge>;
      case "Blocked": return <Badge variant="destructive" className="text-xs"><AlertTriangle className="h-3 w-3 mr-1" />Blocked</Badge>;
      default: return <Badge variant="secondary" className="text-xs">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Production Planning</h2>
          <p className="text-sm text-muted-foreground mt-1">Plan daily and festival production with stock validation</p>
        </div>
        <Button size="sm" onClick={() => setShowAdd(true)}>
          <Plus className="h-4 w-4 mr-1" /> Create Plan
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-foreground">39,000</p>
            <p className="text-xs text-muted-foreground">Total Planned</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600">3</p>
            <p className="text-xs text-muted-foreground">Stock Available</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-amber-600">1</p>
            <p className="text-xs text-muted-foreground">Low Stock Warning</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-red-600">0</p>
            <p className="text-xs text-muted-foreground">Blocked</p>
          </CardContent>
        </Card>
      </div>

      {/* Date Selector */}
      <div className="flex items-center gap-3">
        <Calendar className="h-4 w-4 text-muted-foreground" />
        <Input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)} className="w-48" />
        <Button variant="outline" size="sm" onClick={() => setDateFilter("2024-12-16")}>Tomorrow</Button>
        <Button variant="outline" size="sm" onClick={() => setDateFilter("2024-12-16")}>Festival Day</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Plan ID</TableHead>
                <TableHead>Prasadam</TableHead>
                <TableHead className="text-right">Planned Qty</TableHead>
                <TableHead>Event</TableHead>
                <TableHead className="text-right">Online</TableHead>
                <TableHead className="text-right">Sponsored</TableHead>
                <TableHead>Ingredients</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(p => (
                <TableRow key={p.id}>
                  <TableCell className="font-mono text-xs">{p.id}</TableCell>
                  <TableCell className="font-medium">{p.prasadam}</TableCell>
                  <TableCell className="text-right font-mono">{p.planned.toLocaleString()}</TableCell>
                  <TableCell className="text-xs">{p.event}</TableCell>
                  <TableCell className="text-right">{p.onlineDemand.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{p.sponsorship.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={p.ingredientStatus === "Available" ? "outline" : p.ingredientStatus === "Low Stock" ? "secondary" : "destructive"} className="text-xs">
                      {p.ingredientStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(p.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Alert for blocked plans */}
      {filtered.some(p => p.status === "Blocked") && (
        <Card className="border-red-200 bg-red-50/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm font-semibold">Production Blocked</span>
            </div>
            <p className="text-sm text-red-700 mt-1">Festival Laddu (Large) — Insufficient ghee stock. Required: 300 kg, Available: 180 kg. Raise purchase order immediately.</p>
          </CardContent>
        </Card>
      )}

      {/* Create Plan Dialog */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Create Production Plan</DialogTitle></DialogHeader>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Date</Label><Input type="date" /></div>
              <div>
                <Label>Prasadam Type</Label>
                <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="laddu">Laddu Prasadam</SelectItem>
                    <SelectItem value="pulihora">Pulihora</SelectItem>
                    <SelectItem value="pongal">Sweet Pongal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Planned Quantity</Label><Input type="number" placeholder="e.g. 15000" /></div>
              <div><Label>Linked Event (Optional)</Label><Input placeholder="Event name" /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Online Demand</Label><Input type="number" placeholder="0" /></div>
              <div><Label>Sponsorship Demand</Label><Input type="number" placeholder="0" /></div>
            </div>
            <Card className="bg-muted/50">
              <CardContent className="p-3">
                <p className="text-xs font-medium text-muted-foreground mb-1">Estimated Ingredient Requirement</p>
                <p className="text-sm">Will auto-calculate based on recipe mapping and planned quantity.</p>
              </CardContent>
            </Card>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
            <Button onClick={() => setShowAdd(false)}>Create Plan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductionPlanning;
