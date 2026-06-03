import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Download, CheckCircle2, XCircle, Clock, AlertTriangle, FileText, Flame, Stethoscope, BadgeCheck } from "lucide-react";

const safetyChecklist = [
  { item: "Zone Capacity Limits Configured", status: "pass", lastChecked: "2024-01-15", notes: "All 6 zones configured" },
  { item: "Emergency Exit Mapping Complete", status: "pass", lastChecked: "2024-01-15", notes: "35 exits mapped" },
  { item: "Fire Safety Equipment Inspected", status: "pass", lastChecked: "2024-01-10", notes: "Next due: Feb 10" },
  { item: "Medical Team On-Duty", status: "pass", lastChecked: "Today", notes: "3 paramedics, 1 doctor" },
  { item: "Police Coordination Confirmed", status: "pass", lastChecked: "2024-01-14", notes: "15 officers assigned" },
  { item: "Emergency Drill Conducted", status: "warning", lastChecked: "2023-12-01", notes: "Overdue — due every 30 days" },
  { item: "CCTV Coverage Verified", status: "pass", lastChecked: "2024-01-12", notes: "42 cameras operational" },
  { item: "Barricade & Crowd Barrier Check", status: "fail", lastChecked: "2024-01-08", notes: "3 barricades need replacement" },
];

const monthlyReport = [
  { metric: "Peak Occupancy vs Zone Capacity", jan: "94%", dec: "72%", status: "warning" },
  { metric: "Emergency Exit Readiness", jan: "100%", dec: "97%", status: "pass" },
  { metric: "Fire Safety Compliance", jan: "98%", dec: "100%", status: "pass" },
  { metric: "Medical Response Time (avg)", jan: "4.2 min", dec: "3.8 min", status: "pass" },
  { metric: "Police Personnel Coverage", jan: "100%", dec: "100%", status: "pass" },
  { metric: "Drills Completed", jan: "0/1", dec: "1/1", status: "fail" },
  { metric: "Incident Response Time (avg)", jan: "6.5 min", dec: "5.1 min", status: "warning" },
  { metric: "Barricade Integrity", jan: "91%", dec: "100%", status: "warning" },
];

const eventCompliance = [
  { event: "Vaikuntha Ekadashi", date: "Jan 12", footfall: "98,000", peakVsCapacity: "96%", incidents: 5, responseTime: "5.8 min", drillDone: "No", verdict: "Needs Review" },
  { event: "Makara Sankranti", date: "Jan 15", footfall: "85,000", peakVsCapacity: "90%", incidents: 2, responseTime: "4.1 min", drillDone: "No", verdict: "Acceptable" },
];

const CompliancePreparedness = () => {
  const getStatusIcon = (status: string) => {
    if (status === "pass") return <CheckCircle2 className="h-4 w-4 text-green-600" />;
    if (status === "warning") return <Clock className="h-4 w-4 text-amber-600" />;
    return <XCircle className="h-4 w-4 text-red-600" />;
  };

  const passCount = safetyChecklist.filter(s => s.status === "pass").length;
  const totalCount = safetyChecklist.length;
  const readiness = Math.round((passCount / totalCount) * 100);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Compliance & Preparedness</h1>
          <p className="text-sm text-muted-foreground mt-1">Regulatory safety readiness and audit-ready reporting</p>
        </div>
        <Button variant="outline" size="sm" className="gap-2"><Download className="h-4 w-4" /> Export Audit Report</Button>
      </div>

      {/* Readiness Score */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card><CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2"><Shield className="h-4 w-4 text-primary" /><span className="text-xs text-muted-foreground">Overall Readiness</span></div>
          <p className="text-3xl font-bold">{readiness}%</p>
          <Progress value={readiness} className="h-2 mt-2" />
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2"><Flame className="h-4 w-4 text-orange-600" /><span className="text-xs text-muted-foreground">Fire Safety</span></div>
          <p className="text-2xl font-bold text-green-600">98%</p>
          <p className="text-xs text-muted-foreground">Last inspected Jan 10</p>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2"><Stethoscope className="h-4 w-4 text-blue-600" /><span className="text-xs text-muted-foreground">Medical Team</span></div>
          <p className="text-2xl font-bold text-green-600">Active</p>
          <p className="text-xs text-muted-foreground">4 personnel on duty</p>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2"><AlertTriangle className="h-4 w-4 text-red-600" /><span className="text-xs text-muted-foreground">Overdue Actions</span></div>
          <p className="text-2xl font-bold text-red-600">2</p>
          <p className="text-xs text-muted-foreground">Drill & barricades</p>
        </CardContent></Card>
      </div>

      <Tabs defaultValue="checklist">
        <TabsList>
          <TabsTrigger value="checklist">Safety Checklist</TabsTrigger>
          <TabsTrigger value="monthly">Monthly Report</TabsTrigger>
          <TabsTrigger value="event">Event Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="checklist" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-8"></TableHead>
                    <TableHead>Safety Item</TableHead>
                    <TableHead>Last Checked</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {safetyChecklist.map((s, i) => (
                    <TableRow key={i}>
                      <TableCell>{getStatusIcon(s.status)}</TableCell>
                      <TableCell className="font-medium">{s.item}</TableCell>
                      <TableCell className="text-sm">{s.lastChecked}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{s.notes}</TableCell>
                      <TableCell>
                        <Badge variant={s.status === "pass" ? "default" : s.status === "warning" ? "secondary" : "destructive"} className="text-xs">
                          {s.status === "pass" ? "Pass" : s.status === "warning" ? "Overdue" : "Fail"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monthly" className="mt-4">
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">Monthly Safety Report — January 2024</CardTitle></CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Metric</TableHead>
                    <TableHead>January</TableHead>
                    <TableHead>December</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {monthlyReport.map((m, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{m.metric}</TableCell>
                      <TableCell className="font-mono">{m.jan}</TableCell>
                      <TableCell className="font-mono text-muted-foreground">{m.dec}</TableCell>
                      <TableCell>{getStatusIcon(m.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="event" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Footfall</TableHead>
                    <TableHead>Peak vs Capacity</TableHead>
                    <TableHead className="text-right">Incidents</TableHead>
                    <TableHead>Response Time</TableHead>
                    <TableHead>Drill Done</TableHead>
                    <TableHead>Verdict</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {eventCompliance.map((e, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{e.event}</TableCell>
                      <TableCell>{e.date}</TableCell>
                      <TableCell className="text-right font-mono">{e.footfall}</TableCell>
                      <TableCell className="font-mono">{e.peakVsCapacity}</TableCell>
                      <TableCell className="text-right">{e.incidents > 3 ? <Badge variant="destructive" className="text-xs">{e.incidents}</Badge> : e.incidents}</TableCell>
                      <TableCell className="font-mono">{e.responseTime}</TableCell>
                      <TableCell>{e.drillDone === "Yes" ? <CheckCircle2 className="h-4 w-4 text-green-600" /> : <XCircle className="h-4 w-4 text-red-500" />}</TableCell>
                      <TableCell><Badge variant={e.verdict === "Acceptable" ? "default" : "secondary"} className="text-xs">{e.verdict}</Badge></TableCell>
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

export default CompliancePreparedness;
