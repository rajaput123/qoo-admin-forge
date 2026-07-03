import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Map, Plus, Shield, AlertTriangle, Users, DoorOpen } from "lucide-react";

const zones = [
  { id: "Z-001", name: "Main Sanctum", structure: "Main Temple", maxStatic: 500, maxHourly: 2000, current: 420, risk: "High", exits: 3, securityTeam: "Alpha Team", status: "Active" },
  { id: "Z-002", name: "Queue Corridor A", structure: "Main Temple", maxStatic: 800, maxHourly: 3000, current: 650, risk: "High", exits: 4, securityTeam: "Alpha Team", status: "Active" },
  { id: "Z-003", name: "Prasadam Hall", structure: "Main Hall", maxStatic: 1200, maxHourly: 5000, current: 480, risk: "Medium", exits: 6, securityTeam: "Beta Team", status: "Active" },
  { id: "Z-004", name: "East Courtyard", structure: "Campus", maxStatic: 3000, maxHourly: 10000, current: 1200, risk: "Low", exits: 8, securityTeam: "Gamma Team", status: "Active" },
  { id: "Z-005", name: "Festival Ground", structure: "Campus", maxStatic: 15000, maxHourly: 25000, current: 0, risk: "High", exits: 12, securityTeam: "Delta Team", status: "Inactive" },
  { id: "Z-006", name: "VIP Lounge", structure: "Admin Block", maxStatic: 100, maxHourly: 200, current: 12, risk: "Low", exits: 2, securityTeam: "VIP Security", status: "Active" },
];

const stats = [
  { label: "Total Zones", value: "6", icon: Map, color: "text-primary" },
  { label: "Active Zones", value: "5", icon: Shield, color: "text-green-600" },
  { label: "High Risk Zones", value: "3", icon: AlertTriangle, color: "text-red-600" },
  { label: "Total Capacity", value: "20,600", icon: Users, color: "text-blue-600" },
];

const ZoneConfiguration = () => {
  const [showCreate, setShowCreate] = useState(false);

  const getOccupancy = (current: number, max: number) => {
    const pct = (current / max) * 100;
    return { pct, color: pct >= 90 ? "text-red-600" : pct >= 80 ? "text-amber-600" : "text-green-600" };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Zone Configuration</h1>
          <p className="text-sm text-muted-foreground mt-1">Define operational zones with capacity limits and safety thresholds</p>
        </div>
        <Dialog open={showCreate} onOpenChange={setShowCreate}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2"><Plus className="h-4 w-4" /> Add Zone</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Create New Zone</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Zone Name</Label>
                  <Input placeholder="e.g., West Courtyard" />
                </div>
                <div className="space-y-1.5">
                  <Label>Linked Structure</Label>
                  <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="main">Main Temple</SelectItem>
                      <SelectItem value="hall">Main Hall</SelectItem>
                      <SelectItem value="campus">Campus</SelectItem>
                      <SelectItem value="admin">Admin Block</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Max Static Capacity</Label>
                  <Input type="number" placeholder="500" />
                </div>
                <div className="space-y-1.5">
                  <Label>Max Hourly Throughput</Label>
                  <Input type="number" placeholder="2000" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Risk Category</Label>
                  <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Emergency Exits</Label>
                  <Input type="number" placeholder="4" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Assigned Security Team</Label>
                <Select><SelectTrigger><SelectValue placeholder="Select team" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alpha">Alpha Team</SelectItem>
                    <SelectItem value="beta">Beta Team</SelectItem>
                    <SelectItem value="gamma">Gamma Team</SelectItem>
                    <SelectItem value="delta">Delta Team</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full" onClick={() => setShowCreate(false)}>Create Zone</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
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

      {/* Zone Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Zone</TableHead>
                <TableHead>Structure</TableHead>
                <TableHead className="text-right">Max Capacity</TableHead>
                <TableHead className="text-right">Hourly Throughput</TableHead>
                <TableHead>Occupancy</TableHead>
                <TableHead>Risk</TableHead>
                <TableHead className="text-center">Exits</TableHead>
                <TableHead>Security</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {zones.map(z => {
                const occ = getOccupancy(z.current, z.maxStatic);
                return (
                  <TableRow key={z.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell>
                      <div>
                        <p className="font-medium">{z.name}</p>
                        <p className="text-xs text-muted-foreground font-mono">{z.id}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{z.structure}</TableCell>
                    <TableCell className="text-right font-mono">{z.maxStatic.toLocaleString()}</TableCell>
                    <TableCell className="text-right font-mono">{z.maxHourly.toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="w-28">
                        <div className="flex justify-between text-xs mb-1">
                          <span className={occ.color}>{z.current.toLocaleString()}</span>
                          <span className="text-muted-foreground">{Math.round(occ.pct)}%</span>
                        </div>
                        <Progress value={occ.pct} className="h-1.5" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={z.risk === "High" ? "destructive" : z.risk === "Medium" ? "secondary" : "outline"} className="text-xs">
                        {z.risk}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <DoorOpen className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-sm">{z.exits}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{z.securityTeam}</TableCell>
                    <TableCell>
                      <Badge variant={z.status === "Active" ? "default" : "outline"} className="text-xs">{z.status}</Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ZoneConfiguration;
