import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Link2, AlertTriangle, CheckCircle2, Clock, Trash2 } from "lucide-react";

const mockAttachedRituals = [
  { id: 1, ritual: "Suprabhatam", date: "2025-03-15", time: "05:00 AM", capacity: 500, booking: true, priest: "Sri Ramachandra Sharma", status: "Confirmed", conflict: false },
  { id: 2, ritual: "Sahasranama Archana", date: "2025-03-15", time: "07:00 AM", capacity: 200, booking: true, priest: "Sri Venkateshwara Dikshitar", status: "Confirmed", conflict: false },
  { id: 3, ritual: "Maha Abhishekam", date: "2025-03-16", time: "06:00 AM", capacity: 100, booking: true, priest: "Sri Gopala Bhatta", status: "Pending", conflict: false },
  { id: 4, ritual: "Special Darshan", date: "2025-03-16", time: "07:00 AM", capacity: 5000, booking: true, priest: "N/A", status: "Confirmed", conflict: true },
  { id: 5, ritual: "Annadanam Seva", date: "2025-03-17", time: "12:00 PM", capacity: 10000, booking: false, priest: "N/A", status: "Planned", conflict: false },
];

const masterRituals = [
  "Suprabhatam", "Sahasranama Archana", "Maha Abhishekam", "Special Darshan",
  "Ganapathi Homam", "Navagraha Puja", "Lakshmi Puja", "Rudra Abhishekam",
  "Annadanam Seva", "Vahana Seva", "Pallaki Seva", "Kalyanotsavam",
];

const RitualAttachment = () => {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Ritual Attachment</h1>
          <p className="text-sm text-muted-foreground mt-1">Attach existing rituals & sevas to the event schedule</p>
        </div>
        <div className="flex items-center gap-2">
          <Select>
            <SelectTrigger className="w-56">
              <SelectValue placeholder="Select Event" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="evt-001">EVT-001 — Brahmotsavam 2025</SelectItem>
              <SelectItem value="evt-002">EVT-002 — Vaikuntha Ekadasi</SelectItem>
              <SelectItem value="evt-003">EVT-003 — Annadanam Drive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Conflict Alert */}
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="p-4 flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
          <div>
            <p className="text-sm font-medium text-amber-800">Schedule Conflict Detected</p>
            <p className="text-xs text-amber-600">Special Darshan on Mar 16 overlaps with existing Darshan slot (06:30–07:30 AM). Review capacity.</p>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Total Rituals</p><p className="text-2xl font-bold">5</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Confirmed</p><p className="text-2xl font-bold text-green-600">3</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Pending Assignment</p><p className="text-2xl font-bold text-amber-600">1</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Conflicts</p><p className="text-2xl font-bold text-destructive">1</p></CardContent></Card>
      </div>

      {/* Attached Rituals Table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Attached Rituals — Brahmotsavam 2025</CardTitle>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm"><Plus className="h-4 w-4 mr-2" />Attach Ritual</Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Attach Ritual to Event</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label>Ritual / Seva</Label>
                    <Select>
                      <SelectTrigger><SelectValue placeholder="Select from master list" /></SelectTrigger>
                      <SelectContent>
                        {masterRituals.map((r) => (
                          <SelectItem key={r} value={r.toLowerCase().replace(/ /g, "-")}>{r}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">Only existing rituals can be attached. New rituals must be created in the Rituals module.</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Date</Label>
                      <Input type="date" />
                    </div>
                    <div className="space-y-2">
                      <Label>Time</Label>
                      <Input type="time" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Capacity</Label>
                      <Input type="number" placeholder="e.g. 500" />
                    </div>
                    <div className="space-y-2">
                      <Label>Booking Required</Label>
                      <Select>
                        <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Assigned Priest</Label>
                    <Select>
                      <SelectTrigger><SelectValue placeholder="Select priest" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="p1">Sri Ramachandra Sharma</SelectItem>
                        <SelectItem value="p2">Sri Venkateshwara Dikshitar</SelectItem>
                        <SelectItem value="p3">Sri Gopala Bhatta</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-6">
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                  <Button onClick={() => setDialogOpen(false)}>Attach Ritual</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ritual / Seva</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Booking</TableHead>
                <TableHead>Priest</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockAttachedRituals.map((r) => (
                <TableRow key={r.id} className={r.conflict ? "bg-amber-50/50" : ""}>
                  <TableCell className="font-medium flex items-center gap-2">
                    {r.conflict && <AlertTriangle className="h-4 w-4 text-amber-500" />}
                    {r.ritual}
                  </TableCell>
                  <TableCell className="text-sm">{r.date}</TableCell>
                  <TableCell className="text-sm">{r.time}</TableCell>
                  <TableCell className="text-sm">{r.capacity.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={r.booking ? "default" : "secondary"} className="text-xs">
                      {r.booking ? "Required" : "Open"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">{r.priest}</TableCell>
                  <TableCell>
                    <Badge className={`text-xs border-0 ${
                      r.status === "Confirmed" ? "bg-green-100 text-green-700" :
                      r.status === "Pending" ? "bg-amber-100 text-amber-700" :
                      "bg-muted text-muted-foreground"
                    }`}>
                      {r.status === "Confirmed" && <CheckCircle2 className="h-3 w-3 mr-1" />}
                      {r.status === "Pending" && <Clock className="h-3 w-3 mr-1" />}
                      {r.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
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

export default RitualAttachment;
