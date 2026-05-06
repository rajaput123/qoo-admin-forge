import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart3, IndianRupee, TrendingUp, Clock, Landmark, Download, Globe, Store } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { toast } from "sonner";

const onlineVsCounter = [
  { name: "Online", revenue: 245000, bookings: 890 },
  { name: "Counter", revenue: 125000, bookings: 520 },
  { name: "Admin", revenue: 15000, bookings: 45 },
];

const revenueByStructure = [
  { name: "Main Temple", revenue: 285000 },
  { name: "Padmavathi", revenue: 45000 },
  { name: "Varadaraja", revenue: 28000 },
  { name: "Lakshmi", revenue: 12000 },
];

const peakTimes = [
  { time: "5-6 AM", bookings: 120 },
  { time: "6-8 AM", bookings: 380 },
  { time: "8-10 AM", bookings: 450 },
  { time: "10-12 PM", bookings: 200 },
  { time: "12-2 PM", bookings: 80 },
  { time: "2-4 PM", bookings: 150 },
  { time: "4-6 PM", bookings: 350 },
  { time: "6-8 PM", bookings: 280 },
];

const cancellationData = [
  { name: "Cancelled", value: 8 },
  { name: "Active", value: 92 },
];

const noShowData = [
  { name: "No Show", value: 5 },
  { name: "Attended", value: 95 },
];

const COLORS_CANCEL = ["hsl(0, 84%, 60%)", "hsl(0, 0%, 90%)"];
const COLORS_NOSHOW = ["hsl(38, 92%, 50%)", "hsl(0, 0%, 90%)"];

const BookingReports = () => {
  const [filterPeriod, setFilterPeriod] = useState("month");

  const totalRevenue = onlineVsCounter.reduce((a, r) => a + r.revenue, 0);
  const totalBookings = onlineVsCounter.reduce((a, r) => a + r.bookings, 0);

  const handleExportAll = () => {
    const data = [
      "=== Online vs Counter ===",
      "Source,Revenue,Bookings",
      ...onlineVsCounter.map(r => `${r.name},${r.revenue},${r.bookings}`),
      "",
      "=== Revenue by Structure ===",
      "Structure,Revenue",
      ...revenueByStructure.map(r => `${r.name},${r.revenue}`),
      "",
      "=== Peak Times ===",
      "Time,Bookings",
      ...peakTimes.map(p => `${p.time},${p.bookings}`),
    ].join("\n");
    const blob = new Blob([data], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `booking-reports-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Report exported");
  };

  return (
    <div className="p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Booking Reports</h1>
            <p className="text-muted-foreground">Operational and financial review</p>
          </div>
          <div className="flex gap-2">
            <Select value={filterPeriod} onValueChange={setFilterPeriod}>
              <SelectTrigger className="w-[130px] bg-background"><SelectValue /></SelectTrigger>
              <SelectContent className="bg-popover"><SelectItem value="week">This Week</SelectItem><SelectItem value="month">This Month</SelectItem><SelectItem value="quarter">Quarter</SelectItem><SelectItem value="year">This Year</SelectItem></SelectContent>
            </Select>
            <Button variant="outline" onClick={handleExportAll} className="gap-2"><Download className="h-4 w-4" />Export All</Button>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total Revenue", value: `₹${totalRevenue.toLocaleString()}`, icon: IndianRupee },
            { label: "Total Bookings", value: totalBookings.toLocaleString(), icon: TrendingUp },
            { label: "Cancel Rate", value: "8%", icon: BarChart3 },
            { label: "Peak Time", value: "8–10 AM", icon: Clock },
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
          {/* Online vs Counter */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2"><Globe className="h-4 w-4 text-blue-600" />Online vs Counter Revenue</CardTitle>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => toast.success("Chart exported")}><Download className="h-3.5 w-3.5" /></Button>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={onlineVsCounter}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 90%)" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="hsl(16, 85%, 23%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Revenue by Structure */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2"><Landmark className="h-4 w-4 text-primary" />Revenue by Structure</CardTitle>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => toast.success("Chart exported")}><Download className="h-3.5 w-3.5" /></Button>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={revenueByStructure}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 90%)" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="hsl(217, 91%, 60%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Peak Times */}
          <Card className="lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2"><Clock className="h-4 w-4 text-amber-600" />Peak Time Slots</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={peakTimes}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 90%)" />
                  <XAxis dataKey="time" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="bookings" fill="hsl(38, 92%, 50%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Cancel & No Show Rates */}
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-base">Cancel & No Show</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Cancellation Rate</p>
                <ResponsiveContainer width="100%" height={100}>
                  <PieChart>
                    <Pie data={cancellationData} cx="50%" cy="50%" innerRadius={25} outerRadius={40} dataKey="value">
                      {cancellationData.map((_, i) => <Cell key={i} fill={COLORS_CANCEL[i]} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <p className="text-center text-sm font-bold">8%</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">No Show Rate</p>
                <ResponsiveContainer width="100%" height={100}>
                  <PieChart>
                    <Pie data={noShowData} cx="50%" cy="50%" innerRadius={25} outerRadius={40} dataKey="value">
                      {noShowData.map((_, i) => <Cell key={i} fill={COLORS_NOSHOW[i]} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <p className="text-center text-sm font-bold">5%</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
};

export default BookingReports;
