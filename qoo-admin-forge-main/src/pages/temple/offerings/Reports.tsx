import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart3, IndianRupee, TrendingUp, Users, Clock, Landmark, Download } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { toast } from "sonner";

const revenueByStructure = [
  { name: "Main Temple", revenue: 285000, bookings: 1240 },
  { name: "Padmavathi Shrine", revenue: 45000, bookings: 320 },
  { name: "Varadaraja Shrine", revenue: 28000, bookings: 180 },
  { name: "Lakshmi Shrine", revenue: 12000, bookings: 95 },
];

const ritualPerformance = [
  { name: "Suprabhatam", bookings: 450, revenue: 225000, avgOccupancy: 96 },
  { name: "Archana", bookings: 320, revenue: 32000, avgOccupancy: 88 },
  { name: "Abhishekam", bookings: 180, revenue: 360000, avgOccupancy: 72 },
  { name: "Sahasranama", bookings: 95, revenue: 142500, avgOccupancy: 60 },
  { name: "Ashtottara", bookings: 75, revenue: 37500, avgOccupancy: 45 },
];

const darshanLoad = [
  { time: "6-8 AM", count: 1200 },
  { time: "8-10 AM", count: 1800 },
  { time: "10-12 PM", count: 900 },
  { time: "12-2 PM", count: 400 },
  { time: "2-4 PM", count: 600 },
  { time: "4-6 PM", count: 1500 },
  { time: "6-8 PM", count: 1100 },
];

const capacityUtil = [
  { name: "Utilized", value: 78 },
  { name: "Available", value: 22 },
];

const COLORS = ["hsl(16, 85%, 23%)", "hsl(0, 0%, 90%)"];

const exportData = (title: string, data: any[], columns: string[]) => {
  const csv = [columns.join(","), ...data.map(d => columns.map(c => d[c.toLowerCase().replace(/ /g, "")] ?? d[c] ?? "").join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${title.toLowerCase().replace(/ /g, "-")}-${new Date().toISOString().split("T")[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  toast.success(`${title} exported`);
};

const Reports = () => {
  const [filterType, setFilterType] = useState("all");
  const [filterPeriod, setFilterPeriod] = useState("month");

  const totalRevenue = revenueByStructure.reduce((a, r) => a + r.revenue, 0);
  const totalBookings = revenueByStructure.reduce((a, r) => a + r.bookings, 0);

  const handleExportAll = () => {
    const allData = [
      ["=== Revenue by Structure ==="],
      ["Name", "Revenue", "Bookings"].join(","),
      ...revenueByStructure.map(r => [r.name, r.revenue, r.bookings].join(",")),
      [""],
      ["=== Ritual Performance ==="],
      ["Name", "Bookings", "Revenue", "Avg Occupancy"].join(","),
      ...ritualPerformance.map(r => [r.name, r.bookings, r.revenue, r.avgOccupancy + "%"].join(",")),
      [""],
      ["=== Darshan Load ==="],
      ["Time", "Count"].join(","),
      ...darshanLoad.map(d => [d.time, d.count].join(",")),
    ].join("\n");
    const blob = new Blob([allData], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `offerings-report-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Full report exported");
  };

  return (
    <div className="p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Reports</h1>
            <p className="text-muted-foreground">Operational and financial insights</p>
          </div>
          <div className="flex gap-2">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[140px] bg-background"><SelectValue /></SelectTrigger>
              <SelectContent className="bg-popover"><SelectItem value="all">All Types</SelectItem><SelectItem value="Ritual">Ritual</SelectItem><SelectItem value="Darshan">Darshan</SelectItem></SelectContent>
            </Select>
            <Select value={filterPeriod} onValueChange={setFilterPeriod}>
              <SelectTrigger className="w-[130px] bg-background"><SelectValue /></SelectTrigger>
              <SelectContent className="bg-popover"><SelectItem value="week">This Week</SelectItem><SelectItem value="month">This Month</SelectItem><SelectItem value="quarter">Quarter</SelectItem><SelectItem value="year">This Year</SelectItem></SelectContent>
            </Select>
            <Button variant="outline" onClick={handleExportAll} className="gap-2"><Download className="h-4 w-4" />Export All</Button>
          </div>
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total Revenue", value: `₹${totalRevenue.toLocaleString()}`, icon: IndianRupee, description: "Combined revenue this period" },
            { label: "Total Bookings", value: totalBookings.toLocaleString(), icon: TrendingUp, description: "All offerings combined" },
            { label: "Avg Occupancy", value: "78%", icon: Users, description: "Across all slots" },
            { label: "Peak Hour", value: "8–10 AM", icon: Clock, description: "Highest demand window" },
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Revenue by Structure */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2"><Landmark className="h-4 w-4 text-primary" />Revenue by Structure</CardTitle>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => exportData("Revenue by Structure", revenueByStructure, ["name", "revenue", "bookings"])}><Download className="h-3.5 w-3.5" /></Button>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={revenueByStructure}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 90%)" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="hsl(16, 85%, 23%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Darshan Load */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2"><Users className="h-4 w-4 text-blue-600" />Darshan Load by Time</CardTitle>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => exportData("Darshan Load", darshanLoad, ["time", "count"])}><Download className="h-3.5 w-3.5" /></Button>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={darshanLoad}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 90%)" />
                  <XAxis dataKey="time" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="hsl(217, 91%, 60%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Ritual Performance */}
          <Card className="lg:col-span-2">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2"><BarChart3 className="h-4 w-4 text-primary" />Ritual Performance</CardTitle>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => exportData("Ritual Performance", ritualPerformance, ["name", "bookings", "revenue", "avgOccupancy"])}><Download className="h-3.5 w-3.5" /></Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ritual</TableHead>
                    <TableHead className="text-center">Bookings</TableHead>
                    <TableHead className="text-right">Revenue</TableHead>
                    <TableHead className="text-center">Avg Occupancy</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ritualPerformance.map(r => (
                    <TableRow key={r.name}>
                      <TableCell className="font-medium">{r.name}</TableCell>
                      <TableCell className="text-center">{r.bookings}</TableCell>
                      <TableCell className="text-right">₹{r.revenue.toLocaleString()}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full" style={{ width: `${r.avgOccupancy}%` }} />
                          </div>
                          <span className="text-sm">{r.avgOccupancy}%</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Capacity Utilization */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Capacity Utilization</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={capacityUtil} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}%`}>
                    {capacityUtil.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-4 mt-2">
                {capacityUtil.map((c, i) => (
                  <div key={c.name} className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                    <span className="text-xs text-muted-foreground">{c.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
};

export default Reports;
