import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShieldAlert, Plus, AlertTriangle, CheckCircle2, Clock, FileEdit } from "lucide-react";

const risks = [
  { id: "RSK-001", description: "Monsoon delays for gopuram scaffolding work", project: "Gopuram Renovation", impact: "Timeline", severity: "High", mitigation: "Pre-monsoon completion target; waterproof covers for exposed areas", status: "Open" },
  { id: "RSK-002", description: "Gold price volatility for plating phase", project: "Gopuram Renovation", impact: "Budget", severity: "Medium", mitigation: "Advance procurement lock-in with supplier", status: "Open" },
  { id: "RSK-003", description: "Land acquisition delay for parking facility", project: "Parking Expansion", impact: "Legal", severity: "Critical", mitigation: "Legal team engagement; alternative site evaluation", status: "Open" },
  { id: "RSK-004", description: "Vendor delay for kitchen equipment", project: "New Annadanam Hall", impact: "Vendor", severity: "Low", mitigation: "Secondary vendor identified; penalty clause in PO", status: "Resolved" },
];

const changes = [
  { id: "CHG-001", description: "Additional reinforcement for east wall discovered during inspection", project: "Gopuram Renovation", budgetImpact: "+₹12 L", timelineImpact: "+2 weeks", approval: "Approved", date: "2026-01-28" },
  { id: "CHG-002", description: "Scope expansion: Add solar panels to new hall roof", project: "New Annadanam Hall", budgetImpact: "+₹18 L", timelineImpact: "None", approval: "Pending", date: "2026-02-05" },
  { id: "CHG-003", description: "Reduce parking capacity from 2000 to 1500 cars", project: "Parking Expansion", budgetImpact: "-₹40 L", timelineImpact: "-3 months", approval: "Pending", date: "2026-02-08" },
];

const severityColors: Record<string, "destructive" | "secondary" | "outline"> = {
  Critical: "destructive",
  High: "secondary",
  Medium: "outline",
  Low: "outline",
};

const RiskChange = () => {
  const [showAddRisk, setShowAddRisk] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Risk & Change Management</h1>
          <p className="text-sm text-muted-foreground mt-1">Track project risks and formal change requests</p>
        </div>
      </div>

      <Tabs defaultValue="risks">
        <TabsList><TabsTrigger value="risks">Risk Register</TabsTrigger><TabsTrigger value="changes">Change Control</TabsTrigger></TabsList>

        <TabsContent value="risks" className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="grid grid-cols-4 gap-4 flex-1 mr-4">
              {[
                { label: "Open Risks", value: "3", color: "text-amber-600" },
                { label: "Critical", value: "1", color: "text-red-600" },
                { label: "Resolved", value: "1", color: "text-green-600" },
                { label: "Total", value: "4", color: "text-primary" },
              ].map(s => (
                <Card key={s.label}>
                  <CardContent className="p-3 text-center">
                    <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Dialog open={showAddRisk} onOpenChange={setShowAddRisk}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-2"><Plus className="h-4 w-4" /> Add Risk</Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader><DialogTitle>Register New Risk</DialogTitle></DialogHeader>
                <div className="space-y-3 pt-2">
                  <div className="space-y-1.5"><Label>Risk Description</Label><Textarea rows={2} placeholder="Describe the risk..." /></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5"><Label>Project</Label>
                      <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="prj1">Gopuram Renovation</SelectItem>
                          <SelectItem value="prj2">New Annadanam Hall</SelectItem>
                          <SelectItem value="prj3">Parking Expansion</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5"><Label>Impact Area</Label>
                      <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="budget">Budget</SelectItem>
                          <SelectItem value="timeline">Timeline</SelectItem>
                          <SelectItem value="legal">Legal</SelectItem>
                          <SelectItem value="vendor">Vendor</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-1.5"><Label>Severity</Label>
                    <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="critical">Critical</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5"><Label>Mitigation Plan</Label><Textarea rows={2} placeholder="How to mitigate..." /></div>
                  <Button className="w-full" onClick={() => setShowAddRisk(false)}>Register Risk</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>Impact</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {risks.map(r => (
                    <TableRow key={r.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell className="font-mono text-xs">{r.id}</TableCell>
                      <TableCell>
                        <div><p className="text-sm font-medium">{r.description}</p><p className="text-xs text-muted-foreground mt-1">{r.mitigation}</p></div>
                      </TableCell>
                      <TableCell className="text-sm">{r.project}</TableCell>
                      <TableCell><Badge variant="outline" className="text-[10px]">{r.impact}</Badge></TableCell>
                      <TableCell><Badge variant={severityColors[r.severity]} className="text-[10px]">{r.severity}</Badge></TableCell>
                      <TableCell>
                        <Badge variant={r.status === "Open" ? "secondary" : "default"} className="text-[10px] gap-1">
                          {r.status === "Open" ? <AlertTriangle className="h-3 w-3" /> : <CheckCircle2 className="h-3 w-3" />}
                          {r.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="changes" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Change Request</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>Budget Impact</TableHead>
                    <TableHead>Timeline Impact</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {changes.map(c => (
                    <TableRow key={c.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell className="font-mono text-xs">{c.id}</TableCell>
                      <TableCell className="text-sm font-medium max-w-xs">{c.description}</TableCell>
                      <TableCell className="text-sm">{c.project}</TableCell>
                      <TableCell className="font-mono text-sm">{c.budgetImpact}</TableCell>
                      <TableCell className="text-sm">{c.timelineImpact}</TableCell>
                      <TableCell>
                        <Badge variant={c.approval === "Approved" ? "default" : "secondary"} className="text-[10px]">{c.approval}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{c.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RiskChange;
