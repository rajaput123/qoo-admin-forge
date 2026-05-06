import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Globe, Package, CheckCircle } from "lucide-react";

const reservations = [
  { bookingId: "BKG-2024-8821", devotee: "Rajesh Sharma", prasadam: "Laddu Prasadam", qty: 5, batchId: "BTH-2024-0891", pickupCounter: "Counter C1", pickupDate: "2024-12-15", status: "Reserved" },
  { bookingId: "BKG-2024-8820", devotee: "Priya Devi", prasadam: "Pulihora", qty: 3, batchId: "BTH-2024-0890", pickupCounter: "Counter C2", pickupDate: "2024-12-15", status: "Picked Up" },
  { bookingId: "BKG-2024-8819", devotee: "Venkat Rao", prasadam: "Laddu Prasadam", qty: 10, batchId: "BTH-2024-0891", pickupCounter: "Counter C1", pickupDate: "2024-12-15", status: "Reserved" },
  { bookingId: "BKG-2024-8818", devotee: "Lakshmi N", prasadam: "Sweet Pongal", qty: 2, batchId: "BTH-2024-0889", pickupCounter: "Counter C3", pickupDate: "2024-12-15", status: "No Show" },
  { bookingId: "BKG-2024-8817", devotee: "Karthik S", prasadam: "Festival Laddu (Large)", qty: 20, batchId: "-", pickupCounter: "Counter C1", pickupDate: "2024-12-16", status: "Pending Stock" },
];

const OnlineBooking = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showDetail, setShowDetail] = useState<typeof reservations[0] | null>(null);

  const filtered = reservations.filter(r =>
    (statusFilter === "all" || r.status === statusFilter) &&
    (r.devotee.toLowerCase().includes(search.toLowerCase()) || r.bookingId.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Online Booking Allocation</h2>
          <p className="text-sm text-muted-foreground mt-1">Manage prasadam reservations from online bookings</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-primary">2,450</p><p className="text-xs text-muted-foreground">Total Reserved</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-green-600">1,200</p><p className="text-xs text-muted-foreground">Picked Up</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-amber-600">1,150</p><p className="text-xs text-muted-foreground">Awaiting Pickup</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-red-600">100</p><p className="text-xs text-muted-foreground">No Show</p></CardContent></Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search by devotee or booking ID..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Reserved">Reserved</SelectItem>
                <SelectItem value="Picked Up">Picked Up</SelectItem>
                <SelectItem value="No Show">No Show</SelectItem>
                <SelectItem value="Pending Stock">Pending Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Booking ID</TableHead>
                <TableHead>Devotee</TableHead>
                <TableHead>Prasadam</TableHead>
                <TableHead className="text-right">Qty</TableHead>
                <TableHead>Batch</TableHead>
                <TableHead>Pickup Counter</TableHead>
                <TableHead>Pickup Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(r => (
                <TableRow key={r.bookingId}>
                  <TableCell className="font-mono text-xs">{r.bookingId}</TableCell>
                  <TableCell className="font-medium">{r.devotee}</TableCell>
                  <TableCell>{r.prasadam}</TableCell>
                  <TableCell className="text-right font-mono">{r.qty}</TableCell>
                  <TableCell className="font-mono text-xs">{r.batchId}</TableCell>
                  <TableCell className="text-xs">{r.pickupCounter}</TableCell>
                  <TableCell className="text-xs">{r.pickupDate}</TableCell>
                  <TableCell>
                    <Badge variant={r.status === "Picked Up" ? "default" : r.status === "No Show" ? "destructive" : r.status === "Pending Stock" ? "secondary" : "outline"} className="text-xs">
                      {r.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {r.status === "Reserved" && (
                      <Button variant="ghost" size="sm" className="text-xs h-7">
                        <CheckCircle className="h-3 w-3 mr-1" /> Mark Picked Up
                      </Button>
                    )}
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

export default OnlineBooking;
