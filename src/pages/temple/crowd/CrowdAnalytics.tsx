import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Download, TrendingUp, Users, Clock, AlertTriangle } from "lucide-react";

const dailyData = [
  { date: "2024-01-15", event: "Makara Sankranti", hourlyPeak: "10:00 AM", peakCount: 8200, totalEntries: 85000, totalExits: 84200, vipCount: 45, incidents: 2 },
  { date: "2024-01-14", event: "—", hourlyPeak: "11:00 AM", peakCount: 4500, totalEntries: 42000, totalExits: 41800, vipCount: 12, incidents: 0 },
  { date: "2024-01-13", event: "—", hourlyPeak: "10:30 AM", peakCount: 4200, totalEntries: 38500, totalExits: 38400, vipCount: 8, incidents: 0 },
  { date: "2024-01-12", event: "Vaikuntha Ekadashi", hourlyPeak: "6:00 AM", peakCount: 12000, totalEntries: 98000, totalExits: 97500, vipCount: 78, incidents: 5 },
  { date: "2024-01-11", event: "—", hourlyPeak: "11:00 AM", peakCount: 3800, totalEntries: 35000, totalExits: 34900, vipCount: 6, incidents: 0 },
];

const peakHourBreakdown = [
  { hour: "5:00 AM", count: 2200, pct: 5 },
  { hour: "6:00 AM", count: 5500, pct: 12 },
  { hour: "7:00 AM", count: 7200, pct: 16 },
  { hour: "8:00 AM", count: 6800, pct: 15 },
  { hour: "9:00 AM", count: 5400, pct: 12 },
  { hour: "10:00 AM", count: 8200, pct: 18 },
  { hour: "11:00 AM", count: 4500, pct: 10 },
  { hour: "12:00 PM", count: 2800, pct: 6 },
  { hour: "1:00 PM", count: 1400, pct: 3 },
  { hour: "2:00 PM", count: 1200, pct: 3 },
];

const slotUtilization = [
  { slot: "General Darshan 6AM", capacity: 500, utilized: 498, pct: 99 },
  { slot: "General Darshan 7AM", capacity: 500, utilized: 480, pct: 96 },
  { slot: "Special Darshan 8AM", capacity: 200, utilized: 195, pct: 98 },
  { slot: "General Darshan 10AM", capacity: 500, utilized: 500, pct: 100 },
  { slot: "VIP Darshan 11AM", capacity: 50, utilized: 32, pct: 64 },
  { slot: "Evening Darshan 5PM", capacity: 800, utilized: 620, pct: 78 },
];

const CrowdAnalytics = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Crowd Data & Analytics</h1>
          <p className="text-sm text-muted-foreground mt-1">Historical crowd data collection and analysis</p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="7d">
            <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 90 Days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="gap-2"><Download className="h-4 w-4" /> Export</Button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card><CardContent className="p-4">
          <div className="flex items-center gap-2 mb-1"><Users className="h-4 w-4 text-primary" /><span className="text-xs text-muted-foreground">Avg Daily Footfall</span></div>
          <p className="text-2xl font-bold">59,700</p>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <div className="flex items-center gap-2 mb-1"><Clock className="h-4 w-4 text-blue-600" /><span className="text-xs text-muted-foreground">Peak Hour</span></div>
          <p className="text-2xl font-bold">10:00 AM</p>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <div className="flex items-center gap-2 mb-1"><TrendingUp className="h-4 w-4 text-green-600" /><span className="text-xs text-muted-foreground">Highest Day</span></div>
          <p className="text-2xl font-bold">98,000</p>
          <p className="text-xs text-muted-foreground">Vaikuntha Ekadashi</p>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <div className="flex items-center gap-2 mb-1"><AlertTriangle className="h-4 w-4 text-red-600" /><span className="text-xs text-muted-foreground">Total Incidents</span></div>
          <p className="text-2xl font-bold">7</p>
        </CardContent></Card>
      </div>

      <Tabs defaultValue="daily">
        <TabsList>
          <TabsTrigger value="daily">Daily Summary</TabsTrigger>
          <TabsTrigger value="peak">Peak Hour Analysis</TabsTrigger>
          <TabsTrigger value="slots">Slot Utilization</TabsTrigger>
          <TabsTrigger value="incidents">Incident Frequency</TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Event</TableHead>
                    <TableHead>Peak Hour</TableHead>
                    <TableHead className="text-right">Peak Count</TableHead>
                    <TableHead className="text-right">Total Entries</TableHead>
                    <TableHead className="text-right">Total Exits</TableHead>
                    <TableHead className="text-right">VIP</TableHead>
                    <TableHead className="text-right">Incidents</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dailyData.map(d => (
                    <TableRow key={d.date}>
                      <TableCell className="font-mono text-sm">{d.date}</TableCell>
                      <TableCell>{d.event !== "—" ? <Badge variant="secondary" className="text-xs">{d.event}</Badge> : "—"}</TableCell>
                      <TableCell>{d.hourlyPeak}</TableCell>
                      <TableCell className="text-right font-mono">{d.peakCount.toLocaleString()}</TableCell>
                      <TableCell className="text-right font-mono">{d.totalEntries.toLocaleString()}</TableCell>
                      <TableCell className="text-right font-mono">{d.totalExits.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{d.vipCount}</TableCell>
                      <TableCell className="text-right">
                        {d.incidents > 0 ? <Badge variant="destructive" className="text-xs">{d.incidents}</Badge> : "0"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="peak" className="mt-4">
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">Hourly Distribution (Jan 15)</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {peakHourBreakdown.map(h => (
                <div key={h.hour} className="flex items-center gap-4">
                  <span className="text-sm font-mono w-20">{h.hour}</span>
                  <div className="flex-1">
                    <div className="h-6 bg-muted rounded overflow-hidden">
                      <div className="h-full bg-primary/70 rounded" style={{ width: `${h.pct}%` }} />
                    </div>
                  </div>
                  <span className="text-sm font-mono w-16 text-right">{h.count.toLocaleString()}</span>
                  <span className="text-xs text-muted-foreground w-10 text-right">{h.pct}%</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="slots" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Slot</TableHead>
                    <TableHead className="text-right">Capacity</TableHead>
                    <TableHead className="text-right">Utilized</TableHead>
                    <TableHead>Utilization %</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {slotUtilization.map(s => (
                    <TableRow key={s.slot}>
                      <TableCell className="font-medium">{s.slot}</TableCell>
                      <TableCell className="text-right font-mono">{s.capacity}</TableCell>
                      <TableCell className="text-right font-mono">{s.utilized}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-20"><Progress value={s.pct} className="h-1.5" /></div>
                          <span className={`text-xs font-medium ${s.pct >= 95 ? "text-red-600" : s.pct >= 80 ? "text-amber-600" : "text-green-600"}`}>{s.pct}%</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="incidents" className="mt-4">
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              <AlertTriangle className="h-10 w-10 mx-auto mb-3 text-muted-foreground/50" />
              <p className="font-medium">7 incidents in the last 7 days</p>
              <p className="text-sm mt-1">5 during Vaikuntha Ekadashi, 2 during Makara Sankranti</p>
              <p className="text-sm mt-1">Most common: Queue overcrowding (4), Medical emergency (2), Stampede risk (1)</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CrowdAnalytics;
