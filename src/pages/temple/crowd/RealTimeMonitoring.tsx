import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, Users, ArrowUpRight, ArrowDownRight, Clock, AlertTriangle, Shield, Crown, DoorClosed, Route, Pause, Siren } from "lucide-react";

const liveStats = [
  { label: "Current Footfall", value: "32,450", trend: "+1,200/hr", icon: Users, color: "text-primary", trendUp: true },
  { label: "Entry Rate", value: "145/min", trend: "↑ from 120/min", icon: ArrowUpRight, color: "text-green-600", trendUp: true },
  { label: "Exit Rate", value: "128/min", trend: "↓ from 135/min", icon: ArrowDownRight, color: "text-blue-600", trendUp: false },
  { label: "Avg Wait Time", value: "42 min", trend: "General Darshan", icon: Clock, color: "text-amber-600", trendUp: false },
];

const zoneDensity = [
  { zone: "Main Sanctum", current: 420, max: 500, pct: 84, alert: "yellow" },
  { zone: "Queue Corridor A", current: 720, max: 800, pct: 90, alert: "red" },
  { zone: "Prasadam Hall", current: 480, max: 1200, pct: 40, alert: "green" },
  { zone: "East Courtyard", current: 1200, max: 3000, pct: 40, alert: "green" },
  { zone: "West Courtyard", current: 2100, max: 2500, pct: 84, alert: "yellow" },
  { zone: "VIP Lounge", current: 12, max: 100, pct: 12, alert: "green" },
];

const activeAlerts = [
  { id: 1, zone: "Queue Corridor A", type: "RED", message: "90% capacity reached — approaching critical threshold", time: "2 min ago" },
  { id: 2, zone: "West Courtyard", type: "YELLOW", message: "84% capacity — monitoring closely", time: "8 min ago" },
  { id: 3, zone: "Main Sanctum", type: "YELLOW", message: "84% capacity — security on standby", time: "12 min ago" },
];

const vipStatus = [
  { name: "Trustee Board Visit", persons: 8, zone: "VIP Lounge", eta: "In progress", security: "Assigned" },
  { name: "State Minister Visit", persons: 12, zone: "En route", eta: "30 min", security: "Standby" },
];

const RealTimeMonitoring = () => {
  const [showIncident, setShowIncident] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-foreground">Real-Time Monitoring</h1>
          <Badge variant="destructive" className="gap-1 animate-pulse">
            <Activity className="h-3 w-3" /> LIVE
          </Badge>
        </div>
        <div className="flex gap-2">
          <Dialog open={showIncident} onOpenChange={setShowIncident}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2"><AlertTriangle className="h-4 w-4" /> Log Incident</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Log Incident</DialogTitle></DialogHeader>
              <div className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Zone</label>
                  <Select><SelectTrigger><SelectValue placeholder="Select zone" /></SelectTrigger>
                    <SelectContent>
                      {zoneDensity.map(z => <SelectItem key={z.zone} value={z.zone}>{z.zone}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Severity</label>
                  <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea placeholder="Describe the incident..." rows={3} />
                </div>
                <Button className="w-full" onClick={() => setShowIncident(false)}>Submit Incident</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Live Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {liveStats.map(s => (
          <Card key={s.label}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <s.icon className={`h-5 w-5 ${s.color}`} />
                <span className={`text-xs ${s.trendUp ? "text-green-600" : "text-muted-foreground"}`}>{s.trend}</span>
              </div>
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Zone Density Grid */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Zone-wise Density</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {zoneDensity.map(z => (
              <div key={z.zone} className={`p-4 rounded-lg border-2 ${
                z.alert === "red" ? "border-red-300 bg-red-50" :
                z.alert === "yellow" ? "border-amber-300 bg-amber-50" :
                "border-green-200 bg-green-50"
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium">{z.zone}</p>
                  <Badge variant={z.alert === "red" ? "destructive" : z.alert === "yellow" ? "secondary" : "outline"} className="text-xs">
                    {z.pct}%
                  </Badge>
                </div>
                <Progress value={z.pct} className="h-2 mb-2" />
                <p className="text-xs text-muted-foreground">{z.current.toLocaleString()} / {z.max.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Active Alerts */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" /> Active Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {activeAlerts.map(a => (
              <div key={a.id} className={`p-3 rounded-lg border ${a.type === "RED" ? "border-red-200 bg-red-50" : "border-amber-200 bg-amber-50"}`}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Badge variant={a.type === "RED" ? "destructive" : "secondary"} className="text-[10px]">{a.type}</Badge>
                    <span className="text-sm font-medium">{a.zone}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{a.time}</span>
                </div>
                <p className="text-xs text-muted-foreground">{a.message}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* VIP Flow */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Crown className="h-4 w-4 text-amber-500" /> VIP Flow Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {vipStatus.map((v, i) => (
              <div key={i} className="p-3 rounded-lg border bg-muted/30">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium">{v.name}</p>
                  <Badge variant="outline" className="text-xs">{v.persons} persons</Badge>
                </div>
                <div className="flex gap-4 text-xs text-muted-foreground">
                  <span>Zone: {v.zone}</span>
                  <span>ETA: {v.eta}</span>
                  <span>Security: {v.security}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Admin Controls */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="h-4 w-4" /> Admin Controls
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button variant="outline" className="gap-2 h-auto py-3 flex-col">
              <DoorClosed className="h-5 w-5 text-red-500" />
              <span className="text-xs">Close Entry Gate</span>
            </Button>
            <Button variant="outline" className="gap-2 h-auto py-3 flex-col">
              <Route className="h-5 w-5 text-blue-500" />
              <span className="text-xs">Open Alt Route</span>
            </Button>
            <Button variant="outline" className="gap-2 h-auto py-3 flex-col">
              <Pause className="h-5 w-5 text-amber-500" />
              <span className="text-xs">Pause Booking</span>
            </Button>
            <Button variant="destructive" className="gap-2 h-auto py-3 flex-col">
              <Siren className="h-5 w-5" />
              <span className="text-xs">Emergency Protocol</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RealTimeMonitoring;
