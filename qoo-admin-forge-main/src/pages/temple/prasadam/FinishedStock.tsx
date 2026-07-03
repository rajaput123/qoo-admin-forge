import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Warehouse, TrendingDown, TrendingUp } from "lucide-react";

const stockData = [
  { batchId: "BTH-2024-0891", prasadam: "Laddu Prasadam", produced: 5000, allocated: 3200, remaining: 1800, expiry: "Today 6:00 PM", location: "Central Store", status: "Available" },
  { batchId: "BTH-2024-0890", prasadam: "Pulihora", produced: 3000, allocated: 2100, remaining: 900, expiry: "Today 1:30 PM", location: "Central Store", status: "Available" },
  { batchId: "BTH-2024-0889", prasadam: "Sweet Pongal", produced: 2500, allocated: 1700, remaining: 800, expiry: "Today 11:00 AM", location: "Central Store", status: "Expiring" },
  { batchId: "BTH-2024-0888", prasadam: "Vada", produced: 4000, allocated: 1500, remaining: 2500, expiry: "Today 3:00 PM", location: "Central Store", status: "Available" },
  { batchId: "BTH-2024-0891", prasadam: "Laddu Prasadam", produced: 0, allocated: 0, remaining: 1200, expiry: "Today 6:00 PM", location: "Counter C1", status: "At Counter" },
  { batchId: "BTH-2024-0891", prasadam: "Laddu Prasadam", produced: 0, allocated: 0, remaining: 800, expiry: "Today 6:00 PM", location: "Counter C2", status: "At Counter" },
];

const summaryData = [
  { prasadam: "Laddu Prasadam", totalProduced: 5000, totalAllocated: 3200, totalRemaining: 3800, utilization: "64%" },
  { prasadam: "Pulihora", totalProduced: 3000, totalAllocated: 2100, totalRemaining: 900, utilization: "70%" },
  { prasadam: "Sweet Pongal", totalProduced: 2500, totalAllocated: 1700, totalRemaining: 800, utilization: "68%" },
  { prasadam: "Vada", totalProduced: 4000, totalAllocated: 1500, totalRemaining: 2500, utilization: "38%" },
];

const FinishedStock = () => {
  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");

  const filtered = stockData.filter(s =>
    (locationFilter === "all" || s.location.includes(locationFilter === "central" ? "Central" : "Counter")) &&
    (s.prasadam.toLowerCase().includes(search.toLowerCase()) || s.batchId.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Finished Stock Ledger</h2>
        <p className="text-sm text-muted-foreground mt-1">Track finished prasadam stock separately from raw inventory</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {summaryData.map(s => (
          <Card key={s.prasadam}>
            <CardContent className="p-4">
              <p className="text-sm font-medium mb-1">{s.prasadam}</p>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xl font-bold text-foreground">{s.totalRemaining.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">remaining</p>
                </div>
                <Badge variant="outline" className="text-xs">{s.utilization} used</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Stock Table */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search stock..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
            </div>
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="central">Central Store</SelectItem>
                <SelectItem value="counter">At Counter</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Batch ID</TableHead>
                <TableHead>Prasadam</TableHead>
                <TableHead className="text-right">Produced</TableHead>
                <TableHead className="text-right">Allocated</TableHead>
                <TableHead className="text-right">Remaining</TableHead>
                <TableHead>Expiry</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((s, i) => (
                <TableRow key={`${s.batchId}-${s.location}-${i}`}>
                  <TableCell className="font-mono text-xs">{s.batchId}</TableCell>
                  <TableCell className="font-medium">{s.prasadam}</TableCell>
                  <TableCell className="text-right font-mono">{s.produced > 0 ? s.produced.toLocaleString() : "-"}</TableCell>
                  <TableCell className="text-right font-mono">{s.allocated > 0 ? s.allocated.toLocaleString() : "-"}</TableCell>
                  <TableCell className="text-right font-mono font-semibold">{s.remaining.toLocaleString()}</TableCell>
                  <TableCell className="text-xs">{s.expiry}</TableCell>
                  <TableCell className="text-xs">{s.location}</TableCell>
                  <TableCell>
                    <Badge variant={s.status === "Available" ? "default" : s.status === "Expiring" ? "secondary" : "outline"} className="text-xs">
                      {s.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinishedStock;
