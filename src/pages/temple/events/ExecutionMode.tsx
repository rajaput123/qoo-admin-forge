import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Radio, Users, UtensilsCrossed, Package, UserCheck, Crown, AlertOctagon, RefreshCw, Plus, TrendingUp, Clock, CheckCircle2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const ritualStatus = [
  { ritual: "Suprabhatam", time: "05:00 AM", status: "Completed", priest: "Sri Ramachandra Sharma" },
  { ritual: "Sahasranama Archana", time: "07:00 AM", status: "Ongoing", priest: "Sri Venkateshwara Dikshitar" },
  { ritual: "Maha Abhishekam", time: "09:00 AM", status: "Pending", priest: "Sri Gopala Bhatta" },
  { ritual: "Special Darshan", time: "10:00 AM", status: "Pending", priest: "N/A" },
];

const incidents = [
  { id: "INC-001", time: "06:45 AM", type: "Crowd", description: "Queue overflow at Gate 3 — redirected to Gate 5", severity: "Medium", resolved: true },
  { id: "INC-002", time: "08:12 AM", type: "Medical", description: "Devotee fainted near main queue — first aid administered", severity: "Low", resolved: true },
  { id: "INC-003", time: "09:30 AM", type: "Logistics", description: "Flower supply delayed by 30 mins", severity: "Low", resolved: false },
];

const ExecutionMode = () => {
  const [incidentDialogOpen, setIncidentDialogOpen] = useState(false);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              Execution Mode
              <Badge className="bg-green-100 text-green-700 border-0 animate-pulse">● LIVE</Badge>
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Brahmotsavam 2025 — Day 2 of 10 — March 16, 2025</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm"><RefreshCw className="h-4 w-4 mr-2" />Refresh</Button>
          <Button variant="destructive" size="sm"><AlertOctagon className="h-4 w-4 mr-2" />Emergency Override</Button>
        </div>
      </div>

      {/* Live Dashboard Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground flex items-center gap-1"><Users className="h-4 w-4" /> Live Crowd</p>
                <p className="text-3xl font-bold text-foreground mt-1">42,350</p>
                <p className="text-xs text-green-600 flex items-center gap-1"><TrendingUp className="h-3 w-3" />+2,100 in last hour</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Capacity</p>
                <p className="text-sm font-medium">75,000</p>
                <Progress value={56} className="h-2 w-20 mt-1" />
                <p className="text-xs text-muted-foreground mt-1">56%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground flex items-center gap-1"><UtensilsCrossed className="h-4 w-4" /> Kitchen</p>
                <p className="text-lg font-bold text-foreground mt-1">Batch 3 — In Production</p>
                <p className="text-xs text-muted-foreground">Laddu: 32,000 produced</p>
              </div>
              <Badge className="bg-green-100 text-green-700 border-0">On Track</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground flex items-center gap-1"><Package className="h-4 w-4" /> Distribution</p>
                <p className="text-lg font-bold text-foreground mt-1">28,500 served</p>
                <p className="text-xs text-muted-foreground">Annadanam: 18,200 meals</p>
              </div>
              <Badge className="bg-green-100 text-green-700 border-0">Active</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground flex items-center gap-1"><UserCheck className="h-4 w-4" /> Volunteer Attendance</p>
            <p className="text-2xl font-bold mt-1">215 / 255</p>
            <Progress value={84} className="h-2 mt-2" />
            <p className="text-xs text-muted-foreground mt-1">84% checked in</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground flex items-center gap-1"><Crown className="h-4 w-4" /> VIP Status</p>
            <p className="text-lg font-bold mt-1">Hon. Governor — Arriving 11:00 AM</p>
            <p className="text-xs text-muted-foreground">Security briefing completed. VIP corridor active.</p>
          </CardContent>
        </Card>
      </div>

      {/* Ritual Status */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Ritual Status — Today</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ritual</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Priest</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ritualStatus.map((r, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{r.ritual}</TableCell>
                  <TableCell className="text-sm">{r.time}</TableCell>
                  <TableCell className="text-sm">{r.priest}</TableCell>
                  <TableCell>
                    <Badge className={`text-xs border-0 ${
                      r.status === "Completed" ? "bg-green-100 text-green-700" :
                      r.status === "Ongoing" ? "bg-blue-100 text-blue-700" :
                      "bg-muted text-muted-foreground"
                    }`}>
                      {r.status === "Completed" && <CheckCircle2 className="h-3 w-3 mr-1" />}
                      {r.status === "Ongoing" && <Radio className="h-3 w-3 mr-1" />}
                      {r.status === "Pending" && <Clock className="h-3 w-3 mr-1" />}
                      {r.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Incident Log */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Incident Log</CardTitle>
            <Dialog open={incidentDialogOpen} onOpenChange={setIncidentDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline"><Plus className="h-4 w-4 mr-2" />Log Incident</Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Log New Incident</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Type</Label>
                      <Select>
                        <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="crowd">Crowd</SelectItem>
                          <SelectItem value="medical">Medical</SelectItem>
                          <SelectItem value="logistics">Logistics</SelectItem>
                          <SelectItem value="security">Security</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Severity</Label>
                      <Select>
                        <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="critical">Critical</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea placeholder="Describe the incident..." rows={3} />
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-6">
                  <Button variant="outline" onClick={() => setIncidentDialogOpen(false)}>Cancel</Button>
                  <Button onClick={() => setIncidentDialogOpen(false)}>Log Incident</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Resolved</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {incidents.map((inc) => (
                <TableRow key={inc.id}>
                  <TableCell className="font-mono text-xs">{inc.id}</TableCell>
                  <TableCell className="text-sm">{inc.time}</TableCell>
                  <TableCell><Badge variant="outline" className="text-xs">{inc.type}</Badge></TableCell>
                  <TableCell className="text-sm max-w-xs">{inc.description}</TableCell>
                  <TableCell>
                    <Badge className={`text-xs border-0 ${
                      inc.severity === "Medium" ? "bg-amber-100 text-amber-700" :
                      inc.severity === "High" ? "bg-red-100 text-red-700" :
                      "bg-muted text-muted-foreground"
                    }`}>{inc.severity}</Badge>
                  </TableCell>
                  <TableCell>
                    {inc.resolved ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    ) : (
                      <Clock className="h-4 w-4 text-amber-500" />
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

export default ExecutionMode;
