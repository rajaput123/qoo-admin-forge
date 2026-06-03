import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Download, Crown, TrendingUp, Activity, Users, HandHelping, Calendar } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { toast } from "sonner";

const topDonorsReport = [
  { name: "Ramesh Kumar", donations: 125000, count: 8 },
  { name: "Lakshmi Devi", donations: 85000, count: 12 },
  { name: "Suresh Reddy", donations: 65000, count: 5 },
  { name: "Priya Sharma", donations: 52000, count: 4 },
  { name: "Anand Verma", donations: 48000, count: 6 },
];

const mostActive = [
  { name: "Meena Iyer", sevas: 45, darshans: 86, total: 131 },
  { name: "Lakshmi Devi", sevas: 42, darshans: 62, total: 104 },
  { name: "Vijay Nair", sevas: 38, darshans: 72, total: 110 },
  { name: "Kavita Rao", sevas: 31, darshans: 55, total: 86 },
  { name: "Ramesh Kumar", sevas: 28, darshans: 48, total: 76 },
];

const volunteerActivity = [
  { name: "Deepa Murthy", hours: 160, events: 20 },
  { name: "Vijay Nair", hours: 120, events: 15 },
  { name: "Lakshmi Devi", hours: 96, events: 12 },
  { name: "Anand Verma", hours: 64, events: 8 },
  { name: "Sunita Bai", hours: 48, events: 6 },
];

const growthTrend = [
  { month: "Sep", devotees: 980, volunteers: 62 },
  { month: "Oct", devotees: 1020, volunteers: 68 },
  { month: "Nov", devotees: 1080, volunteers: 72 },
  { month: "Dec", devotees: 1150, volunteers: 78 },
  { month: "Jan", devotees: 1200, volunteers: 82 },
  { month: "Feb", devotees: 1247, volunteers: 86 },
];

const engagementBreakdown = [
  { name: "Highly Active", value: 280, color: "hsl(142, 71%, 45%)" },
  { name: "Active", value: 554, color: "hsl(217, 91%, 60%)" },
  { name: "Occasional", value: 312, color: "hsl(38, 92%, 50%)" },
  { name: "Inactive", value: 101, color: "hsl(0, 0%, 75%)" },
];

const Reports = () => {
  const [filterPeriod, setFilterPeriod] = useState("month");

  const handleExportAll = () => {
    const data = [
      "=== Top Donors ===",
      "Name,Total Donations,Count",
      ...topDonorsReport.map(d => `${d.name},${d.donations},${d.count}`),
      "",
      "=== Most Active ===",
      "Name,Sevas,Darshans,Total",
      ...mostActive.map(d => `${d.name},${d.sevas},${d.darshans},${d.total}`),
      "",
      "=== Volunteer Activity ===",
      "Name,Hours,Events",
      ...volunteerActivity.map(v => `${v.name},${v.hours},${v.events}`),
      "",
      "=== Growth Trend ===",
      "Month,Devotees,Volunteers",
      ...growthTrend.map(g => `${g.month},${g.devotees},${g.volunteers}`),
    ].join("\n");
    const blob = new Blob([data], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `devotee-reports-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Report exported");
  };

  return (
    <div className="p-4 space-y-4 w-full overflow-x-hidden max-w-[100vw]">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">CRM Reports</h1>
            <p className="text-muted-foreground">Devotee and volunteer analytics</p>
          </div>
          <div className="flex gap-2">
            <Select value={filterPeriod} onValueChange={setFilterPeriod}>
              <SelectTrigger className="w-[130px] bg-background"><SelectValue /></SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">Quarter</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={handleExportAll} className="gap-2"><Download className="h-4 w-4" />Export All</Button>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total Devotees", value: "1,247", icon: Users },
            { label: "New This Month", value: "+47", icon: TrendingUp },
            { label: "Active Volunteers", value: "52", icon: HandHelping },
            { label: "Engagement Rate", value: "67%", icon: Activity },
          ].map((kpi, i) => (
            <Card key={i} className="group hover:shadow-md transition-all duration-200">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-muted group-hover:bg-primary group-hover:shadow-lg transition-all duration-200">
                    <kpi.icon className="h-5 w-5 text-muted-foreground group-hover:text-primary-foreground transition-colors duration-200" />
                  </div>
                </div>
                <p className="text-2xl font-bold">{kpi.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{kpi.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Top Donors Chart */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2"><Crown className="h-4 w-4 text-amber-600" />Top Donors</CardTitle>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => toast.success("Exported")}><Download className="h-3.5 w-3.5" /></Button>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={topDonorsReport} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 90%)" />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={100} />
                  <Tooltip formatter={(value: number) => `₹${value.toLocaleString()}`} />
                  <Bar dataKey="donations" fill="hsl(16, 85%, 23%)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Most Active */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2"><Activity className="h-4 w-4 text-primary" />Most Active Devotees</CardTitle>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => toast.success("Exported")}><Download className="h-3.5 w-3.5" /></Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Devotee</TableHead>
                    <TableHead className="text-center">Sevas</TableHead>
                    <TableHead className="text-center">Darshans</TableHead>
                    <TableHead className="text-center">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mostActive.map((d, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium text-sm">{d.name}</TableCell>
                      <TableCell className="text-center text-sm">{d.sevas}</TableCell>
                      <TableCell className="text-center text-sm">{d.darshans}</TableCell>
                      <TableCell className="text-center font-bold text-sm">{d.total}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Growth Trend */}
          <Card className="lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2"><TrendingUp className="h-4 w-4 text-green-600" />Devotee Growth Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={growthTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 90%)" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="devotees" stroke="hsl(16, 85%, 23%)" strokeWidth={2} dot={{ r: 4 }} name="Devotees" />
                  <Line type="monotone" dataKey="volunteers" stroke="hsl(217, 91%, 60%)" strokeWidth={2} dot={{ r: 4 }} name="Volunteers" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Engagement Analysis */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Engagement Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={170}>
                <PieChart>
                  <Pie data={engagementBreakdown} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value">
                    {engagementBreakdown.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1.5 mt-2">
                {engagementBreakdown.map(l => (
                  <div key={l.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: l.color }} />
                      <span className="text-xs text-muted-foreground">{l.name}</span>
                    </div>
                    <span className="text-xs font-medium">{l.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Volunteer Activity Report */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2"><HandHelping className="h-4 w-4 text-primary" />Volunteer Activity Report</CardTitle>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => toast.success("Exported")}><Download className="h-3.5 w-3.5" /></Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Volunteer</TableHead>
                  <TableHead className="text-center">Total Hours</TableHead>
                  <TableHead className="text-center">Events</TableHead>
                  <TableHead className="text-center">Avg Hours/Event</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {volunteerActivity.map((v, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium text-sm">{v.name}</TableCell>
                    <TableCell className="text-center font-bold text-sm">{v.hours}h</TableCell>
                    <TableCell className="text-center text-sm">{v.events}</TableCell>
                    <TableCell className="text-center text-sm">{(v.hours / v.events).toFixed(1)}h</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Reports;
