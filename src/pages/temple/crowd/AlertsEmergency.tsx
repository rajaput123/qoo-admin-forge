import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Shield, CheckCircle2, Clock, Siren, Users, Bell, FileText } from "lucide-react";

const alertTiers = [
  { level: "GREEN", label: "Normal Operations", color: "bg-green-100 border-green-300 text-green-800", icon: CheckCircle2, description: "All zones within safe capacity. Normal operational flow.", occupancy: "< 80%", action: "Standard monitoring" },
  { level: "YELLOW", label: "High Density Alert", color: "bg-amber-100 border-amber-300 text-amber-800", icon: AlertTriangle, description: "One or more zones approaching capacity limits. Heightened awareness.", occupancy: "80% – 90%", action: "Notify Security Lead, increase monitoring" },
  { level: "RED", label: "Critical Overcrowding", color: "bg-red-100 border-red-300 text-red-800", icon: Siren, description: "Critical overcrowding detected. Immediate intervention required.", occupancy: "> 90%", action: "Notify all leads, close gates, activate emergency protocol" },
];

const activeAlerts = [
  { id: "ALT-0034", zone: "Queue Corridor A", level: "RED", message: "90% capacity — critical overcrowding risk", notified: "Security Lead, Event Admin", timestamp: "10:42 AM", resolved: false, resolution: "" },
  { id: "ALT-0033", zone: "West Courtyard", level: "YELLOW", message: "84% capacity — approaching threshold", notified: "Security Lead", timestamp: "10:35 AM", resolved: false, resolution: "" },
  { id: "ALT-0032", zone: "Main Sanctum", level: "YELLOW", message: "84% capacity — security on standby", notified: "Security Lead", timestamp: "10:28 AM", resolved: false, resolution: "" },
  { id: "ALT-0031", zone: "Queue Corridor A", level: "YELLOW", message: "80% threshold crossed", notified: "Security Lead", timestamp: "10:15 AM", resolved: true, resolution: "Additional route opened, flow improved" },
  { id: "ALT-0030", zone: "Prasadam Hall", level: "YELLOW", message: "80% capacity during distribution", notified: "Security Lead", timestamp: "09:45 AM", resolved: true, resolution: "Distribution counters increased to 6" },
];

const emergencyLog = [
  { id: "EMG-005", action: "Emergency Gate Closure", zone: "Gate 2", initiatedBy: "Admin - Ramesh K.", time: "10:44 AM", status: "Active", approval: "Senior Admin" },
  { id: "EMG-004", action: "Additional Route Opened", zone: "East Corridor", initiatedBy: "Security Lead", time: "10:16 AM", status: "Active", approval: "Auto-approved" },
  { id: "EMG-003", action: "Booking Paused", zone: "All", initiatedBy: "System Auto", time: "10:43 AM", status: "Active", approval: "Auto-triggered" },
];

const AlertsEmergency = () => {
  const [resolveAlert, setResolveAlert] = useState<typeof activeAlerts[0] | null>(null);

  const unresolvedCount = activeAlerts.filter(a => !a.resolved).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Alerts & Emergency Controls</h1>
          <p className="text-sm text-muted-foreground mt-1">Alert level management and emergency intervention logging</p>
        </div>
        <Badge variant="destructive" className="gap-1 text-sm">
          <Bell className="h-3.5 w-3.5" /> {unresolvedCount} Active Alerts
        </Badge>
      </div>

      {/* Alert Tiers */}
      <div className="grid md:grid-cols-3 gap-4">
        {alertTiers.map(t => {
          const Icon = t.icon;
          return (
            <Card key={t.level} className={`border-2 ${t.color}`}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="h-5 w-5" />
                  <span className="font-bold">{t.level}</span>
                  <span className="text-sm">— {t.label}</span>
                </div>
                <p className="text-xs mb-3">{t.description}</p>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between"><span className="font-medium">Occupancy:</span><span>{t.occupancy}</span></div>
                  <div className="flex justify-between"><span className="font-medium">Action:</span><span>{t.action}</span></div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Active Alerts */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500" /> Alert History
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Alert ID</TableHead>
                <TableHead>Zone</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Notified</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activeAlerts.map(a => (
                <TableRow key={a.id} className={a.resolved ? "opacity-60" : ""}>
                  <TableCell className="font-mono text-xs">{a.id}</TableCell>
                  <TableCell className="font-medium text-sm">{a.zone}</TableCell>
                  <TableCell>
                    <Badge variant={a.level === "RED" ? "destructive" : "secondary"} className="text-xs">{a.level}</Badge>
                  </TableCell>
                  <TableCell className="text-xs max-w-xs">{a.message}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{a.notified}</TableCell>
                  <TableCell className="text-sm">{a.timestamp}</TableCell>
                  <TableCell>
                    {a.resolved ? (
                      <Badge variant="outline" className="text-xs text-green-600">Resolved</Badge>
                    ) : (
                      <Badge variant="destructive" className="text-xs animate-pulse">Active</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {!a.resolved && (
                      <Button variant="outline" size="sm" className="text-xs" onClick={() => setResolveAlert(a)}>Resolve</Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Emergency Actions Log */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="h-4 w-4" /> Emergency Actions Log
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Zone</TableHead>
                <TableHead>Initiated By</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Approval</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {emergencyLog.map(e => (
                <TableRow key={e.id}>
                  <TableCell className="font-mono text-xs">{e.id}</TableCell>
                  <TableCell className="font-medium text-sm">{e.action}</TableCell>
                  <TableCell className="text-sm">{e.zone}</TableCell>
                  <TableCell className="text-xs">{e.initiatedBy}</TableCell>
                  <TableCell className="text-sm">{e.time}</TableCell>
                  <TableCell><Badge variant="outline" className="text-xs">{e.approval}</Badge></TableCell>
                  <TableCell><Badge variant="default" className="text-xs">{e.status}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* System Rules */}
      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><FileText className="h-4 w-4" /> System Rules</CardTitle></CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-2 text-sm">
            <div className="p-2 rounded bg-muted/50 flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-green-600 shrink-0 mt-0.5" /><span>Zone capacity must never exceed emergency threshold</span></div>
            <div className="p-2 rounded bg-muted/50 flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-green-600 shrink-0 mt-0.5" /><span>Emergency overrides require senior admin approval</span></div>
            <div className="p-2 rounded bg-muted/50 flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-green-600 shrink-0 mt-0.5" /><span>All live interventions must be audit logged</span></div>
            <div className="p-2 rounded bg-muted/50 flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-green-600 shrink-0 mt-0.5" /><span>VIP movement must not violate zone safety</span></div>
            <div className="p-2 rounded bg-muted/50 flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-green-600 shrink-0 mt-0.5" /><span>Compliance reports must be exportable</span></div>
            <div className="p-2 rounded bg-muted/50 flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-green-600 shrink-0 mt-0.5" /><span>Drone activity must be recorded</span></div>
          </div>
        </CardContent>
      </Card>

      {/* Resolve Dialog */}
      <Dialog open={!!resolveAlert} onOpenChange={() => setResolveAlert(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Resolve Alert</DialogTitle></DialogHeader>
          {resolveAlert && (
            <div className="space-y-4 pt-2">
              <div className="p-3 rounded-lg bg-muted/50 border">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant={resolveAlert.level === "RED" ? "destructive" : "secondary"} className="text-xs">{resolveAlert.level}</Badge>
                  <span className="font-medium text-sm">{resolveAlert.zone}</span>
                </div>
                <p className="text-xs text-muted-foreground">{resolveAlert.message}</p>
              </div>
              <div className="space-y-1.5">
                <Label>Resolution Entry <span className="text-red-500">*</span></Label>
                <Textarea placeholder="Describe the resolution action taken..." rows={3} />
              </div>
              <Button className="w-full" onClick={() => setResolveAlert(null)}>Mark as Resolved</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AlertsEmergency;
