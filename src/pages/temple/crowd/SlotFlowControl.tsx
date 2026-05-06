import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Gauge, Plus, Clock, DoorOpen, Users, ArrowRightLeft } from "lucide-react";

const slots = [
  { id: "SLT-001", type: "General Darshan", duration: "30 min", maxDevotees: 500, booked: 420, entryGate: "Gate 1, Gate 2", exitGate: "Gate 3", bookingIntegrated: true, status: "Active" },
  { id: "SLT-002", type: "Special Darshan", duration: "20 min", maxDevotees: 200, booked: 180, entryGate: "Gate 4", exitGate: "Gate 5", bookingIntegrated: true, status: "Active" },
  { id: "SLT-003", type: "VIP Darshan", duration: "15 min", maxDevotees: 50, booked: 32, entryGate: "VIP Gate", exitGate: "VIP Exit", bookingIntegrated: true, status: "Active" },
  { id: "SLT-004", type: "General Darshan", duration: "30 min", maxDevotees: 500, booked: 500, entryGate: "Gate 1, Gate 2", exitGate: "Gate 3", bookingIntegrated: true, status: "Full" },
  { id: "SLT-005", type: "Evening Darshan", duration: "45 min", maxDevotees: 800, booked: 0, entryGate: "All Gates", exitGate: "All Exits", bookingIntegrated: true, status: "Upcoming" },
];

const gateStatus = [
  { gate: "Gate 1 - Main Entrance", direction: "Entry", status: "Open", throughput: "42/min", queue: "~120 devotees" },
  { gate: "Gate 2 - East Entrance", direction: "Entry", status: "Open", throughput: "35/min", queue: "~80 devotees" },
  { gate: "Gate 3 - North Exit", direction: "Exit", status: "Open", throughput: "55/min", queue: "—" },
  { gate: "Gate 4 - Special Entry", direction: "Entry", status: "Open", throughput: "18/min", queue: "~30 devotees" },
  { gate: "VIP Gate", direction: "Entry", status: "Open", throughput: "5/min", queue: "—" },
];

const stats = [
  { label: "Active Slots", value: "3", icon: Clock, color: "text-primary" },
  { label: "Total Capacity", value: "2,050", icon: Users, color: "text-blue-600" },
  { label: "Entry Gates Open", value: "4/5", icon: DoorOpen, color: "text-green-600" },
  { label: "Avg Flow Rate", value: "150/min", icon: ArrowRightLeft, color: "text-purple-600" },
];

const SlotFlowControl = () => {
  const [showCreate, setShowCreate] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Slot & Flow Control</h1>
          <p className="text-sm text-muted-foreground mt-1">Control darshan entry flow and manage slot capacity</p>
        </div>
        <Dialog open={showCreate} onOpenChange={setShowCreate}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2"><Plus className="h-4 w-4" /> Add Slot</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Create Darshan Slot</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Darshan Type</Label>
                  <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General Darshan</SelectItem>
                      <SelectItem value="special">Special Darshan</SelectItem>
                      <SelectItem value="vip">VIP Darshan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Slot Duration</Label>
                  <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="20">20 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="45">45 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Max Devotees</Label>
                  <Input type="number" placeholder="500" />
                </div>
                <div className="space-y-1.5">
                  <Label>Entry Gate</Label>
                  <Input placeholder="Gate 1, Gate 2" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Exit Gate</Label>
                  <Input placeholder="Gate 3" />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <Switch defaultChecked />
                  <Label>Booking Integration</Label>
                </div>
              </div>
              <Button className="w-full" onClick={() => setShowCreate(false)}>Create Slot</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(s => (
          <Card key={s.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-muted ${s.color}`}><s.icon className="h-5 w-5" /></div>
              <div>
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Slot Table */}
      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-base">Darshan Slots</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Slot ID</TableHead>
                <TableHead>Darshan Type</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Entry Gate</TableHead>
                <TableHead>Exit Gate</TableHead>
                <TableHead className="text-center">Booking</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {slots.map(s => {
                const pct = (s.booked / s.maxDevotees) * 100;
                return (
                  <TableRow key={s.id}>
                    <TableCell className="font-mono text-xs">{s.id}</TableCell>
                    <TableCell className="font-medium">{s.type}</TableCell>
                    <TableCell>{s.duration}</TableCell>
                    <TableCell>
                      <div className="w-24">
                        <div className="flex justify-between text-xs mb-1">
                          <span>{s.booked}/{s.maxDevotees}</span>
                          <span className="text-muted-foreground">{Math.round(pct)}%</span>
                        </div>
                        <Progress value={pct} className="h-1.5" />
                      </div>
                    </TableCell>
                    <TableCell className="text-xs">{s.entryGate}</TableCell>
                    <TableCell className="text-xs">{s.exitGate}</TableCell>
                    <TableCell className="text-center">{s.bookingIntegrated ? "✓" : "—"}</TableCell>
                    <TableCell>
                      <Badge variant={s.status === "Active" ? "default" : s.status === "Full" ? "destructive" : "outline"} className="text-xs">{s.status}</Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Gate Status */}
      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-base">Gate Status</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Gate</TableHead>
                <TableHead>Direction</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Throughput</TableHead>
                <TableHead>Queue</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {gateStatus.map(g => (
                <TableRow key={g.gate}>
                  <TableCell className="font-medium">{g.gate}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">{g.direction}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="default" className="text-xs">{g.status}</Badge>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{g.throughput}</TableCell>
                  <TableCell className="text-sm">{g.queue}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" className="text-xs">Close Gate</Button>
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

export default SlotFlowControl;
