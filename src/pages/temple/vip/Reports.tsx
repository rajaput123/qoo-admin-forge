import { useState } from "react";
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
import { VipPageShell, SectionHeader, VipKpiCard } from "@/components/vip/VipPageShell";

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
    <VipPageShell
      icon={BarChart3}
      eyebrow="VIP · REPORTS"
      title="VIP Reports & Audit View"
      description="Contribution, engagement and sensitivity overview for governance and trustees."
      actions={
        <>
          <Select value={filterPeriod} onValueChange={setFilterPeriod}>
            <SelectTrigger className="w-[140px] bg-background/80 backdrop-blur border-border/80">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-popover">
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleExport} className="gap-2 bg-primary hover:bg-primary/90 shadow-sm">
            <Download className="h-4 w-4" />
            Export All
          </Button>
        </>
      }
    >
      {/* KPIs */}
      <section>
        <SectionHeader eyebrow="OVERVIEW" title="Governance summary" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <VipKpiCard label="Active VIP Devotees" value="24" icon={Users} accent="primary" />
          <VipKpiCard
            label="Total VIP Contribution"
            value="₹19,80,000"
            icon={IndianRupee}
            accent="green"
            delta={{ value: "8.4%", positive: true }}
          />
          <VipKpiCard label="Average per VIP" value="₹82,500" icon={Crown} accent="amber" />
          <VipKpiCard label="Sensitive Profiles" value="6" icon={Shield} accent="rose" />
        </div>
      </section>

      {/* Charts Row 1 */}
      <section>
        <SectionHeader eyebrow="CONTRIBUTION" title="Top contributors & level mix" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
      </section>

      {/* Charts Row 2 */}
      <section>
        <SectionHeader eyebrow="ENGAGEMENT & SENSITIVITY" title="Visits, events & sensitive mix" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
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
      </section>

      {/* Audit-style summary table (read-only) */}
      <section>
        <SectionHeader eyebrow="AUDIT" title="Governance snapshot (Read-only)" />
        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" />
              Privilege & lifecycle audit
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-muted/40">
                <TableRow>
                  <TableHead>Metric</TableHead>
                  <TableHead>Current</TableHead>
                  <TableHead className="text-right">Comment</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="hover:bg-amber-50/30">
                  <TableCell className="text-sm">VIP with override privileges</TableCell>
                  <TableCell className="text-sm font-semibold">18</TableCell>
                  <TableCell className="text-right text-xs text-muted-foreground">
                    Map to Level where BookingOverride = true
                  </TableCell>
                </TableRow>
                <TableRow className="hover:bg-amber-50/30">
                  <TableCell className="text-sm">VIP with reserved seating & special entry</TableCell>
                  <TableCell className="text-sm font-semibold">14</TableCell>
                  <TableCell className="text-right text-xs text-muted-foreground">
                    Combination of ReservedSeats & SpecialEntry flags
                  </TableCell>
                </TableRow>
                <TableRow className="hover:bg-amber-50/30">
                  <TableCell className="text-sm">Expired VIPs (privileges disabled)</TableCell>
                  <TableCell className="text-sm font-semibold">3</TableCell>
                  <TableCell className="text-right text-xs text-muted-foreground">
                    Should be auto-updated by daily scheduler
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>
    </VipPageShell>
  );
};

export default Reports;

