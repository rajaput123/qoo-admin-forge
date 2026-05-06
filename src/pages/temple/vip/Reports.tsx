import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  Download,
  Crown,
  TrendingUp,
  Activity as ActivityIcon,
  Users,
  IndianRupee,
  Shield,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { toast } from "sonner";

const vipContribution = [
  { name: "Ramesh Kumar", donations: 125000, bookings: 24 },
  { name: "Lakshmi Devi", donations: 85000, bookings: 32 },
  { name: "Anand Verma", donations: 48000, bookings: 18 },
  { name: "Priya Sharma", donations: 52000, bookings: 12 },
  { name: "Suresh Reddy", donations: 65000, bookings: 15 },
];

const levelWiseBreakdown = [
  { level: "Platinum", devotees: 8, contribution: 780000 },
  { level: "Gold", devotees: 10, contribution: 760000 },
  { level: "Silver", devotees: 6, contribution: 440000 },
];

const vipEngagementTrend = [
  { month: "Sep", visits: 92, events: 18 },
  { month: "Oct", visits: 104, events: 20 },
  { month: "Nov", visits: 118, events: 24 },
  { month: "Dec", visits: 132, events: 28 },
  { month: "Jan", visits: 126, events: 25 },
  { month: "Feb", visits: 88, events: 16 },
];

const sensitivityBreakdown = [
  { name: "Sensitive", value: 6, color: "hsl(16, 85%, 23%)" },
  { name: "Normal", value: 18, color: "hsl(0, 0%, 75%)" },
];

const Reports = () => {
  const [filterPeriod, setFilterPeriod] = useState("month");

  const handleExport = () => {
    const data = [
      "=== VIP Contribution ===",
      "Name,Donations,Bookings",
      ...vipContribution.map((v) => `${v.name},${v.donations},${v.bookings}`),
      "",
      "=== Level-wise Contribution ===",
      "Level,Devotees,Contribution",
      ...levelWiseBreakdown.map((l) => `${l.level},${l.devotees},${l.contribution}`),
      "",
      "=== Engagement Trend ===",
      "Month,Visits,Events",
      ...vipEngagementTrend.map((g) => `${g.month},${g.visits},${g.events}`),
    ].join("\n");
    const blob = new Blob([data], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `vip-reports-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("VIP report exported");
  };

  return (
    <div className="p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-primary" />
              VIP Reports & Audit View
            </h1>
            <p className="text-muted-foreground">
              Contribution, engagement and sensitivity overview for governance and trustees.
            </p>
          </div>
          <div className="flex gap-2">
            <Select value={filterPeriod} onValueChange={setFilterPeriod}>
              <SelectTrigger className="w-[130px] bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">Quarter</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={handleExport} className="gap-2">
              <Download className="h-4 w-4" />
              Export All
            </Button>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Active VIP Devotees", value: "24", icon: Users },
            { label: "Total VIP Contribution", value: "₹19,80,000", icon: IndianRupee },
            { label: "Average per VIP", value: "₹82,500", icon: Crown },
            { label: "Sensitive Profiles", value: "6", icon: Shield },
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
          {/* Top VIP Contribution */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Crown className="h-4 w-4 text-amber-600" />
                  Top VIP Contribution
                </CardTitle>
                <Badge variant="outline" className="text-[10px]">
                  Donations & bookings
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={vipContribution} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 90%)" />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={110} />
                  <Tooltip
                    formatter={(value: number, key: string) =>
                      key === "donations" ? `₹${value.toLocaleString()}` : value
                    }
                  />
                  <Bar dataKey="donations" fill="hsl(16, 85%, 23%)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Level-wise Contribution */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                Level-wise Contribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={levelWiseBreakdown}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 90%)" />
                  <XAxis dataKey="level" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(value: number) => `₹${value.toLocaleString()}`} />
                  <Line
                    type="monotone"
                    dataKey="contribution"
                    stroke="hsl(217, 91%, 60%)"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    name="Contribution"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Engagement Trend */}
          <Card className="lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <ActivityIcon className="h-4 w-4 text-primary" />
                VIP Engagement Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={vipEngagementTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 90%)" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="visits"
                    stroke="hsl(16, 85%, 23%)"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    name="Visits"
                  />
                  <Line
                    type="monotone"
                    dataKey="events"
                    stroke="hsl(217, 91%, 60%)"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    name="Event Participation"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Sensitivity Breakdown */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="h-4 w-4 text-amber-700" />
                Sensitive vs Normal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={170}>
                <PieChart>
                  <Pie
                    data={sensitivityBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={65}
                    dataKey="value"
                  >
                    {sensitivityBreakdown.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1.5 mt-2">
                {sensitivityBreakdown.map((l) => (
                  <div key={l.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: l.color }}
                      />
                      <span className="text-xs text-muted-foreground">{l.name}</span>
                    </div>
                    <span className="text-xs font-medium">{l.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Audit-style summary table (read-only) */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" />
              Governance Snapshot (Read-only)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Metric</TableHead>
                  <TableHead>Current</TableHead>
                  <TableHead className="text-right">Comment</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="text-sm">VIP with override privileges</TableCell>
                  <TableCell className="text-sm">18</TableCell>
                  <TableCell className="text-right text-xs text-muted-foreground">
                    Map to Level where BookingOverride = true
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-sm">VIP with reserved seating & special entry</TableCell>
                  <TableCell className="text-sm">14</TableCell>
                  <TableCell className="text-right text-xs text-muted-foreground">
                    Combination of ReservedSeats & SpecialEntry flags
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-sm">Expired VIPs (privileges disabled)</TableCell>
                  <TableCell className="text-sm">3</TableCell>
                  <TableCell className="text-right text-xs text-muted-foreground">
                    Should be auto-updated by daily scheduler
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Reports;

