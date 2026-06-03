import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Heart, Plus } from "lucide-react";

const sponsorships = [
  { id: "SPO-001", sponsor: "Sri Lakshmi Trust", donationId: "DON-2024-5501", prasadam: "Laddu Prasadam", qty: 5000, mode: "Free Distribution", date: "2024-12-15", batchId: "BTH-2024-0891", status: "Allocated" },
  { id: "SPO-002", sponsor: "Rajesh & Family", donationId: "DON-2024-5498", prasadam: "Pulihora", qty: 1000, mode: "Event - Vaikunta Ekadashi", date: "2024-12-16", batchId: "-", status: "Pending Production" },
  { id: "SPO-003", sponsor: "Annadanam Foundation", donationId: "DON-2024-5495", prasadam: "Curd Rice", qty: 3000, mode: "Free Distribution", date: "2024-12-15", batchId: "BTH-2024-0887", status: "Distributed" },
  { id: "SPO-004", sponsor: "Venkateshwara Bhakta Mandali", donationId: "DON-2024-5490", prasadam: "Sweet Pongal", qty: 1000, mode: "Ritual - Morning Abhishekam", date: "2024-12-15", batchId: "BTH-2024-0889", status: "Allocated" },
];

const SponsorshipAllocation = () => {
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  const filtered = sponsorships.filter(s =>
    s.sponsor.toLowerCase().includes(search.toLowerCase()) || s.donationId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Sponsorship Allocation</h2>
          <p className="text-sm text-muted-foreground mt-1">Track sponsored prasadam linked to donation records</p>
        </div>
        <Button size="sm" onClick={() => setShowAdd(true)}>
          <Plus className="h-4 w-4 mr-1" /> Link Sponsorship
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-rose-600">10,000</p><p className="text-xs text-muted-foreground">Total Sponsored Units</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-green-600">6,000</p><p className="text-xs text-muted-foreground">Allocated</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-blue-600">3,000</p><p className="text-xs text-muted-foreground">Distributed</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-amber-600">1,000</p><p className="text-xs text-muted-foreground">Pending Production</p></CardContent></Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="relative max-w-md mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search sponsor or donation ID..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Sponsor</TableHead>
                <TableHead>Donation ID</TableHead>
                <TableHead>Prasadam</TableHead>
                <TableHead className="text-right">Qty</TableHead>
                <TableHead>Distribution Mode</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Batch</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(s => (
                <TableRow key={s.id}>
                  <TableCell className="font-mono text-xs">{s.id}</TableCell>
                  <TableCell className="font-medium">{s.sponsor}</TableCell>
                  <TableCell className="font-mono text-xs">{s.donationId}</TableCell>
                  <TableCell>{s.prasadam}</TableCell>
                  <TableCell className="text-right font-mono">{s.qty.toLocaleString()}</TableCell>
                  <TableCell className="text-xs">{s.mode}</TableCell>
                  <TableCell className="text-xs">{s.date}</TableCell>
                  <TableCell className="font-mono text-xs">{s.batchId}</TableCell>
                  <TableCell>
                    <Badge variant={s.status === "Distributed" ? "default" : s.status === "Allocated" ? "outline" : "secondary"} className="text-xs">
                      {s.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Link Sponsorship</DialogTitle></DialogHeader>
          <div className="grid gap-4">
            <div><Label>Sponsor Name</Label><Input placeholder="Sponsor name" /></div>
            <div><Label>Linked Donation ID</Label><Input placeholder="DON-2024-XXXX" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Prasadam Type</Label>
                <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="laddu">Laddu Prasadam</SelectItem>
                    <SelectItem value="pulihora">Pulihora</SelectItem>
                    <SelectItem value="pongal">Sweet Pongal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Quantity</Label><Input type="number" placeholder="e.g. 1000" /></div>
            </div>
            <div><Label>Distribution Mode</Label>
              <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">Free Distribution</SelectItem>
                  <SelectItem value="event">Event</SelectItem>
                  <SelectItem value="ritual">Ritual</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label>Date</Label><Input type="date" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
            <Button onClick={() => setShowAdd(false)}>Link Sponsorship</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SponsorshipAllocation;
