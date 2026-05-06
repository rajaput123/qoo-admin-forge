import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, ShieldAlert, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { toast } from "sonner";

const incidents = [
  { id: "CRS-001", title: "Crowd Surge at South Gate", impact: "High", status: "resolved", date: "2024-02-09 16:30", spokesperson: "Sri Ramesh", response: "Immediate crowd diversion via North Gate. Police notified. Devotees redirected safely.", resolution: "Additional barriers installed. Security doubled for peak hours." },
  { id: "CRS-002", title: "Social Media Misinformation - Closure Rumor", impact: "Medium", status: "resolved", date: "2024-02-07 10:00", spokesperson: "Lakshmi R.", response: "Official statement issued on all social platforms within 30 minutes.", resolution: "Clarification reached 50K+ users. Rumor contained." },
  { id: "CRS-003", title: "Power Outage During Evening Aarti", impact: "Low", status: "resolved", date: "2024-02-05 18:45", spokesperson: "-", response: "Backup generators activated within 2 minutes. No disruption to ritual.", resolution: "Electrical systems inspected and upgraded." },
  { id: "CRS-004", title: "Water Supply Disruption - Kitchen", impact: "Medium", status: "active", date: "2024-02-10 08:00", spokesperson: "Suresh P.", response: "Tanker water arranged. Reduced Annadanam capacity communicated to devotees.", resolution: "Municipal repair in progress. Expected resolution by evening." },
  { id: "CRS-005", title: "VIP Protocol Complaint - Media Coverage", impact: "High", status: "monitoring", date: "2024-02-10 11:00", spokesperson: "Sri Ramesh", response: "Formal statement drafted. Awaiting senior trustee approval.", resolution: "Under review by governance committee." },
];

const impactColors: Record<string, string> = {
  High: "text-red-700 bg-red-50 border-red-200",
  Medium: "text-amber-700 bg-amber-50 border-amber-200",
  Low: "text-blue-700 bg-blue-50 border-blue-200",
};

const statusColors: Record<string, string> = {
  active: "text-red-700 bg-red-50 border-red-200",
  monitoring: "text-amber-700 bg-amber-50 border-amber-200",
  resolved: "text-green-700 bg-green-50 border-green-200",
};

const CrisisCommunication = () => {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<typeof incidents[0] | null>(null);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Active Incidents", value: String(incidents.filter(i => i.status === "active").length), icon: ShieldAlert, extra: "text-red-600" },
          { label: "Monitoring", value: String(incidents.filter(i => i.status === "monitoring").length), icon: AlertTriangle },
          { label: "Resolved This Month", value: String(incidents.filter(i => i.status === "resolved").length), icon: CheckCircle },
          { label: "Avg Response Time", value: "18 min", icon: Clock },
        ].map((kpi) => (
          <Card key={kpi.label}><CardContent className="p-4">
            <kpi.icon className={`h-5 w-5 mb-2 ${kpi.extra || "text-muted-foreground"}`} />
            <p className="text-2xl font-bold">{kpi.value}</p>
            <p className="text-xs text-muted-foreground">{kpi.label}</p>
          </CardContent></Card>
        ))}
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search incidents..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="destructive" size="sm"><Plus className="h-4 w-4 mr-1" />Report Incident</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Report Crisis Incident</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label>Incident Title</Label><Input placeholder="Brief description" /></div>
              <div><Label>Impact Level</Label>
                <Select><SelectTrigger><SelectValue placeholder="Select impact" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High - Immediate public impact</SelectItem>
                    <SelectItem value="medium">Medium - Potential escalation</SelectItem>
                    <SelectItem value="low">Low - Internal concern</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Description</Label><Textarea rows={3} placeholder="Detailed incident description..." /></div>
              <div><Label>Immediate Response Taken</Label><Textarea rows={2} placeholder="Actions already taken..." /></div>
              <div><Label>Assign Spokesperson</Label><Input placeholder="Spokesperson name" /></div>
              <div className="flex gap-2 justify-end">
                <Button variant="destructive" size="sm" onClick={() => toast.success("Crisis incident reported and escalated")}>Report & Escalate</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Incident ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Impact</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Spokesperson</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {incidents.filter(i => i.title.toLowerCase().includes(search.toLowerCase())).map((inc) => (
              <TableRow key={inc.id} className="cursor-pointer" onClick={() => setSelected(inc)}>
                <TableCell className="font-mono text-xs">{inc.id}</TableCell>
                <TableCell className="font-medium">{inc.title}</TableCell>
                <TableCell><Badge variant="outline" className={impactColors[inc.impact]}>{inc.impact}</Badge></TableCell>
                <TableCell><Badge variant="outline" className={statusColors[inc.status]}>{inc.status}</Badge></TableCell>
                <TableCell className="text-xs">{inc.date}</TableCell>
                <TableCell>{inc.spokesperson}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Crisis Incident Details</DialogTitle></DialogHeader>
          {selected && (
            <Tabs defaultValue="overview">
              <TabsList className="w-full"><TabsTrigger value="overview">Overview</TabsTrigger><TabsTrigger value="response">Response Log</TabsTrigger><TabsTrigger value="resolution">Resolution</TabsTrigger></TabsList>
              <TabsContent value="overview" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="text-muted-foreground">ID:</span> <span className="font-mono">{selected.id}</span></div>
                  <div><span className="text-muted-foreground">Impact:</span> <Badge variant="outline" className={impactColors[selected.impact]}>{selected.impact}</Badge></div>
                  <div><span className="text-muted-foreground">Status:</span> <Badge variant="outline" className={statusColors[selected.status]}>{selected.status}</Badge></div>
                  <div><span className="text-muted-foreground">Date:</span> {selected.date}</div>
                  <div className="col-span-2"><span className="text-muted-foreground">Spokesperson:</span> {selected.spokesperson}</div>
                </div>
              </TabsContent>
              <TabsContent value="response" className="space-y-4 mt-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Official Response</p>
                  <p className="text-sm border rounded-lg p-3 bg-muted/30">{selected.response}</p>
                </div>
                {selected.status === "active" && (
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => { toast.success("Public statement published"); setSelected(null); }}>Publish Statement</Button>
                    <Button variant="outline" size="sm">Update Response</Button>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="resolution" className="space-y-4 mt-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Resolution</p>
                  <p className="text-sm border rounded-lg p-3 bg-muted/30">{selected.resolution}</p>
                </div>
                {selected.status !== "resolved" && (
                  <Button size="sm" onClick={() => { toast.success("Incident marked as resolved"); setSelected(null); }}>Mark Resolved</Button>
                )}
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CrisisCommunication;
