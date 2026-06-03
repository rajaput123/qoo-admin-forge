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
import { Plane, Camera, Map, Users, Clock, Shield, AlertTriangle, CheckCircle2, Eye } from "lucide-react";

const drones = [
  { id: "DRN-001", name: "Eagle-1", status: "Deployed", zone: "Main Sanctum Area", operator: "Suresh Kumar", altitude: "50m", battery: 72, since: "08:30 AM", compliance: "Verified" },
  { id: "DRN-002", name: "Eagle-2", status: "Deployed", zone: "Festival Ground", operator: "Ravi Shankar", altitude: "80m", battery: 85, since: "09:15 AM", compliance: "Verified" },
  { id: "DRN-003", name: "Hawk-1", status: "Standby", zone: "—", operator: "—", altitude: "—", battery: 100, since: "—", compliance: "Verified" },
  { id: "DRN-004", name: "Hawk-2", status: "Maintenance", zone: "—", operator: "—", altitude: "—", battery: 0, since: "—", compliance: "Expired" },
];

const snapshots = [
  { id: "SNP-0045", drone: "Eagle-1", zone: "Main Sanctum", timestamp: "10:42 AM", type: "Overcrowding Alert", density: "High", flagged: true },
  { id: "SNP-0044", drone: "Eagle-2", zone: "Festival Ground", timestamp: "10:38 AM", type: "Routine Scan", density: "Medium", flagged: false },
  { id: "SNP-0043", drone: "Eagle-1", zone: "Queue Corridor A", timestamp: "10:30 AM", type: "Queue Length", density: "High", flagged: true },
  { id: "SNP-0042", drone: "Eagle-2", zone: "East Courtyard", timestamp: "10:22 AM", type: "Routine Scan", density: "Low", flagged: false },
  { id: "SNP-0041", drone: "Eagle-1", zone: "Main Sanctum", timestamp: "10:15 AM", type: "Incident Spotting", density: "High", flagged: true },
];

const capabilities = [
  { feature: "Live Aerial Feed", icon: Camera, status: "Active", description: "Real-time video streaming from deployed drones" },
  { feature: "Heat-map Density", icon: Map, status: "Active", description: "Crowd density visualization overlaid on zone map" },
  { feature: "Queue Length Estimation", icon: Users, status: "Active", description: "Automated queue measurement using computer vision" },
  { feature: "Overcrowding Detection", icon: AlertTriangle, status: "Active", description: "AI-based alert when density exceeds thresholds" },
  { feature: "Incident Spotting", icon: Eye, status: "Beta", description: "Automated anomaly detection in crowd behavior" },
];

const DroneMonitoring = () => {
  const [showDeploy, setShowDeploy] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Drone Monitoring</h1>
          <p className="text-sm text-muted-foreground mt-1">Aerial crowd density monitoring and incident detection</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary" className="gap-1"><Plane className="h-3 w-3" /> Optional Integration</Badge>
          <Dialog open={showDeploy} onOpenChange={setShowDeploy}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2"><Plane className="h-4 w-4" /> Deploy Drone</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Deploy Drone</DialogTitle></DialogHeader>
              <div className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <Label>Select Drone</Label>
                  <Select><SelectTrigger><SelectValue placeholder="Select available drone" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="drn3">Hawk-1 (Standby)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Target Zone</Label>
                  <Select><SelectTrigger><SelectValue placeholder="Select zone" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="z1">Main Sanctum Area</SelectItem>
                      <SelectItem value="z2">Queue Corridor A</SelectItem>
                      <SelectItem value="z3">Festival Ground</SelectItem>
                      <SelectItem value="z4">East Courtyard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>Operator</Label>
                    <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="s1">Suresh Kumar</SelectItem>
                        <SelectItem value="s2">Ravi Shankar</SelectItem>
                        <SelectItem value="s3">Mohan Das</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Altitude (m)</Label>
                    <Input type="number" placeholder="50" />
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                  <Shield className="h-5 w-5 text-primary" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Aviation Compliance</p>
                    <p className="text-xs text-muted-foreground">Operator must have valid DGCA certification</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Button className="w-full" onClick={() => setShowDeploy(false)}>Deploy Drone</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card><CardContent className="p-4">
          <div className="flex items-center gap-2 mb-1"><Plane className="h-4 w-4 text-primary" /><span className="text-xs text-muted-foreground">Total Drones</span></div>
          <p className="text-2xl font-bold">4</p>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <div className="flex items-center gap-2 mb-1"><Camera className="h-4 w-4 text-green-600" /><span className="text-xs text-muted-foreground">Active Deployed</span></div>
          <p className="text-2xl font-bold">2</p>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <div className="flex items-center gap-2 mb-1"><AlertTriangle className="h-4 w-4 text-red-600" /><span className="text-xs text-muted-foreground">Flagged Snapshots</span></div>
          <p className="text-2xl font-bold">3</p>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <div className="flex items-center gap-2 mb-1"><Clock className="h-4 w-4 text-blue-600" /><span className="text-xs text-muted-foreground">Flight Hours Today</span></div>
          <p className="text-2xl font-bold">4.5 hrs</p>
        </CardContent></Card>
      </div>

      {/* Capabilities */}
      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-base">Drone Capabilities</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {capabilities.map(c => (
              <div key={c.feature} className="p-3 rounded-lg border bg-muted/30 flex items-start gap-3">
                <c.icon className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{c.feature}</p>
                    <Badge variant={c.status === "Active" ? "default" : "secondary"} className="text-[10px]">{c.status}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{c.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Drone Fleet */}
      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-base">Drone Fleet</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Zone</TableHead>
                <TableHead>Operator</TableHead>
                <TableHead>Altitude</TableHead>
                <TableHead>Battery</TableHead>
                <TableHead>Compliance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {drones.map(d => (
                <TableRow key={d.id}>
                  <TableCell className="font-mono text-xs">{d.id}</TableCell>
                  <TableCell className="font-medium">{d.name}</TableCell>
                  <TableCell>
                    <Badge variant={d.status === "Deployed" ? "default" : d.status === "Standby" ? "secondary" : "outline"} className="text-xs">{d.status}</Badge>
                  </TableCell>
                  <TableCell className="text-sm">{d.zone}</TableCell>
                  <TableCell className="text-sm">{d.operator}</TableCell>
                  <TableCell className="font-mono text-sm">{d.altitude}</TableCell>
                  <TableCell>
                    {d.battery > 0 ? (
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${d.battery > 50 ? "bg-green-500" : d.battery > 20 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${d.battery}%` }} />
                        </div>
                        <span className="text-xs font-mono">{d.battery}%</span>
                      </div>
                    ) : "—"}
                  </TableCell>
                  <TableCell>
                    {d.compliance === "Verified" ? <CheckCircle2 className="h-4 w-4 text-green-600" /> : <AlertTriangle className="h-4 w-4 text-red-500" />}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Snapshots */}
      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-base">Audit Snapshots</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Snapshot ID</TableHead>
                <TableHead>Drone</TableHead>
                <TableHead>Zone</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Density</TableHead>
                <TableHead>Flagged</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {snapshots.map(s => (
                <TableRow key={s.id}>
                  <TableCell className="font-mono text-xs">{s.id}</TableCell>
                  <TableCell className="text-sm">{s.drone}</TableCell>
                  <TableCell className="text-sm">{s.zone}</TableCell>
                  <TableCell className="text-sm">{s.timestamp}</TableCell>
                  <TableCell><Badge variant="outline" className="text-xs">{s.type}</Badge></TableCell>
                  <TableCell>
                    <Badge variant={s.density === "High" ? "destructive" : s.density === "Medium" ? "secondary" : "outline"} className="text-xs">{s.density}</Badge>
                  </TableCell>
                  <TableCell>{s.flagged ? <AlertTriangle className="h-4 w-4 text-amber-500" /> : "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default DroneMonitoring;
