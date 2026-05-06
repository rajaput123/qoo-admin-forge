import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, UserCheck, TrendingUp, HandHelping, Crown, Activity, MapPin, Calendar, Download, IndianRupee } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { toast } from "sonner";

const topDonors = [
  { name: "Ramesh Kumar", phone: "+91 98765 43210", totalDonation: 125000, visits: 48 },
  { name: "Lakshmi Devi", phone: "+91 87654 32109", totalDonation: 85000, visits: 62 },
  { name: "Suresh Reddy", phone: "+91 76543 21098", totalDonation: 65000, visits: 35 },
  { name: "Priya Sharma", phone: "+91 65432 10987", totalDonation: 52000, visits: 29 },
  { name: "Anand Verma", phone: "+91 54321 09876", totalDonation: 48000, visits: 41 },
];

const cityDistribution = [
  { name: "Bangalore", value: 412, color: "hsl(16, 85%, 23%)" },
  { name: "Chennai", value: 186, color: "hsl(217, 91%, 60%)" },
  { name: "Hyderabad", value: 142, color: "hsl(142, 71%, 45%)" },
  { name: "Mumbai", value: 128, color: "hsl(38, 92%, 50%)" },
  { name: "Others", value: 379, color: "hsl(0, 0%, 75%)" },
];

const growthTrend = [
  { month: "Sep", devotees: 980, newThisMonth: 38 },
  { month: "Oct", devotees: 1020, newThisMonth: 40 },
  { month: "Nov", devotees: 1080, newThisMonth: 60 },
  { month: "Dec", devotees: 1150, newThisMonth: 70 },
  { month: "Jan", devotees: 1200, newThisMonth: 50 },
  { month: "Feb", devotees: 1247, newThisMonth: 47 },
];

const bookingTrend = [
  { month: "Sep", bookings: 180, donations: 85 },
  { month: "Oct", bookings: 195, donations: 92 },
  { month: "Nov", bookings: 240, donations: 110 },
  { month: "Dec", bookings: 310, donations: 145 },
  { month: "Jan", bookings: 220, donations: 105 },
  { month: "Feb", bookings: 165, donations: 78 },
];

const engagementBreakdown = [
  { name: "Active", value: 834, color: "hsl(142, 71%, 45%)" },
  { name: "Inactive", value: 413, color: "hsl(0, 0%, 75%)" },
];

const Dashboard = () => {
  const [period, setPeriod] = useState("month");

  return (
    <div className="p-4 space-y-4 w-full overflow-x-hidden max-w-[100vw]">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Insights Dashboard</h1>
            <p className="text-muted-foreground">CRM analytics, devotee metrics & engagement trends</p>
          </div>
          <div className="flex gap-2">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-[130px] bg-background"><SelectValue /></SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">Quarter</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => toast.success("Report exported")} className="gap-2"><Download className="h-4 w-4" />Export</Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total Devotees", value: "1,247", icon: Users, sub: "+47 this month" },
            { label: "New This Month", value: "47", icon: TrendingUp, sub: "↑ 12% from last month" },
            { label: "Active vs Inactive", value: "834 / 413", icon: UserCheck, sub: "67% active rate" },
            { label: "Volunteer Count", value: "86", icon: HandHelping, sub: "52 active this month" },
          ].map((kpi, i) => (
            <Card key={i} className="group hover:shadow-md transition-all duration-200">
              <CardContent className="p-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-muted group-hover:bg-primary group-hover:shadow-lg transition-all duration-200 mb-2">
                  <kpi.icon className="h-5 w-5 text-muted-foreground group-hover:text-primary-foreground transition-colors duration-200" />
                </div>
                <p className="text-xl font-bold">{kpi.value}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{kpi.label}</p>
                <p className="text-[10px] text-muted-foreground/70 mt-0.5">{kpi.sub}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card className="lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2"><TrendingUp className="h-4 w-4 text-primary" />Devotee Growth Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={growthTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 90%)" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="devotees" stroke="hsl(16, 85%, 23%)" strokeWidth={2} dot={{ r: 4 }} name="Total Devotees" />
                  <Line type="monotone" dataKey="newThisMonth" stroke="hsl(217, 91%, 60%)" strokeWidth={2} dot={{ r: 4 }} name="New/Month" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" />City Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                  <Pie data={cityDistribution} cx="50%" cy="50%" innerRadius={35} outerRadius={60} dataKey="value">
                    {cityDistribution.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1 mt-2">
                {cityDistribution.map(c => (
                  <div key={c.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} /><span className="text-xs text-muted-foreground">{c.name}</span></div>
                    <span className="text-xs font-medium">{c.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" />Booking & Donation Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={bookingTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 90%)" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="bookings" fill="hsl(16, 85%, 23%)" radius={[3, 3, 0, 0]} name="Bookings" />
                  <Bar dataKey="donations" fill="hsl(217, 91%, 60%)" radius={[3, 3, 0, 0]} name="Donations" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2"><Activity className="h-4 w-4 text-primary" />Active vs Inactive</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                  <Pie data={engagementBreakdown} cx="50%" cy="50%" innerRadius={40} outerRadius={60} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {engagementBreakdown.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-6 mt-2">
                {engagementBreakdown.map(e => (
                  <div key={e.name} className="flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={{ backgroundColor: e.color }} /><span className="text-sm"><span className="font-bold">{e.value}</span> <span className="text-muted-foreground">{e.name}</span></span></div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Donors Table */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2"><Crown className="h-4 w-4 text-amber-600" />Top Donors</CardTitle>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => toast.success("Exported")}><Download className="h-3.5 w-3.5" /></Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader><TableRow><TableHead>Devotee</TableHead><TableHead className="text-right">Total Donated</TableHead><TableHead className="text-center">Visits</TableHead></TableRow></TableHeader>
              <TableBody>
                {topDonors.map((d, i) => (
                  <TableRow key={i}>
                    <TableCell><p className="font-medium text-sm">{d.name}</p><p className="text-xs text-muted-foreground">{d.phone}</p></TableCell>
                    <TableCell className="text-right font-medium text-sm">₹{d.totalDonation.toLocaleString()}</TableCell>
                    <TableCell className="text-center text-sm text-muted-foreground">{d.visits}</TableCell>
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

export default Dashboard;
