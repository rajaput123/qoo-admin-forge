import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Crown,
  Users,
  TrendingUp,
  IndianRupee,
  Activity,
  Download,
  Star,
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

const vipLevelBreakdown = [
  { name: "Platinum", value: 8, color: "hsl(16, 85%, 23%)" },
  { name: "Gold", value: 10, color: "hsl(38, 92%, 50%)" },
  { name: "Silver", value: 6, color: "hsl(217, 91%, 60%)" },
];

const vipGrowthTrend = [
  { month: "Sep", vipCount: 14, upgrades: 3 },
  { month: "Oct", vipCount: 16, upgrades: 2 },
  { month: "Nov", vipCount: 18, upgrades: 4 },
  { month: "Dec", vipCount: 20, upgrades: 3 },
  { month: "Jan", vipCount: 22, upgrades: 2 },
  { month: "Feb", vipCount: 24, upgrades: 2 },
];

const vipContributionTrend = [
  { month: "Sep", donations: 280000, bookings: 85 },
  { month: "Oct", donations: 320000, bookings: 92 },
  { month: "Nov", donations: 360000, bookings: 110 },
  { month: "Dec", donations: 410000, bookings: 125 },
  { month: "Jan", donations: 390000, bookings: 118 },
  { month: "Feb", donations: 245000, bookings: 76 },
];

const expiringSoon = [
  { name: "Ramesh Kumar", level: "Platinum", category: "High Donor", validTill: "2026-02-28", status: "Active" },
  { name: "Lakshmi Devi", level: "Gold", category: "Volunteer Donor", validTill: "2026-03-05", status: "Active" },
  { name: "Anand Verma", level: "Gold", category: "Festival Patron", validTill: "2026-03-10", status: "Active" },
];

const Dashboard = () => {
  const [period, setPeriod] = useState("month");

  return (
    <VipPageShell
      icon={Crown}
      eyebrow="VIP · DASHBOARD"
      title="VIP Devotee Dashboard"
      description="Classification, privileges and contribution overview for high-value devotees."
      actions={
        <>
          <Select value={period} onValueChange={setPeriod}>
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
          <Button
            onClick={() => toast.success("VIP dashboard exported")}
            className="gap-2 bg-primary hover:bg-primary/90 shadow-sm"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
        </>
      }
    >
      {/* KPI Cards */}
      <section>
        <SectionHeader eyebrow="AT A GLANCE" title="Year-to-date snapshot" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <VipKpiCard
            label="Active VIP Devotees"
            value="24"
            sub="Platinum / Gold / Silver"
            icon={Users}
            accent="primary"
            delta={{ value: "12%", positive: true }}
          />
          <VipKpiCard
            label="VIP Contribution (YTD)"
            value="₹19,80,000"
            sub="Donations & sponsorships"
            icon={IndianRupee}
            accent="green"
            delta={{ value: "8.4%", positive: true }}
          />
          <VipKpiCard
            label="VIP Bookings (YTD)"
            value="606"
            sub="Sevas & darshans"
            icon={Activity}
            accent="blue"
          />
          <VipKpiCard
            label="Upgrades This Year"
            value="14"
            sub="Level changes & upgrades"
            icon={TrendingUp}
            accent="amber"
          />
        </div>
      </section>

      {/* Charts Row 1 */}
      <section>
        <SectionHeader eyebrow="GROWTH" title="Devotee growth & level mix" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                VIP Growth & Upgrades
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={vipGrowthTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 90%)" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="vipCount"
                    stroke="hsl(16, 85%, 23%)"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    name="Active VIPs"
                  />
                  <Line
                    type="monotone"
                    dataKey="upgrades"
                    stroke="hsl(217, 91%, 60%)"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    name="Upgrades"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Crown className="h-4 w-4 text-amber-600" />
                VIP Levels Mix
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie
                    data={vipLevelBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={35}
                    outerRadius={60}
                    dataKey="value"
                  >
                    {vipLevelBreakdown.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1 mt-2">
                {vipLevelBreakdown.map((l) => (
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

      {/* Charts Row 2 */}
      <section>
        <SectionHeader eyebrow="CONTRIBUTION & GOVERNANCE" title="Contribution flow & expiring devotees" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <IndianRupee className="h-4 w-4 text-primary" />
                VIP Donations & Bookings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={vipContributionTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 90%)" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    formatter={(value: number, key: string) =>
                      key === "donations" ? `₹${value.toLocaleString()}` : value
                    }
                  />
                  <Bar
                    dataKey="donations"
                    fill="hsl(16, 85%, 23%)"
                    radius={[3, 3, 0, 0]}
                    name="Donations"
                  />
                  <Bar
                    dataKey="bookings"
                    fill="hsl(217, 91%, 60%)"
                    radius={[3, 3, 0, 0]}
                    name="Bookings"
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="h-4 w-4 text-amber-700" />
                Expiring & Sensitive VIPs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {expiringSoon.map((v) => (
                  <div
                    key={v.name}
                    className="flex items-center justify-between rounded-lg border border-border/70 bg-gradient-to-r from-amber-50/40 to-transparent p-3 hover:border-primary/40 transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{v.name}</span>
                        <Badge variant="outline" className="text-[10px] gap-1">
                          <Star className="h-3 w-3 text-amber-500" />
                          {v.level}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Category: {v.category}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium">Valid till {v.validTill}</p>
                      <p className="text-[11px] text-muted-foreground">{v.status}</p>
                    </div>
                  </div>
                ))}
                <p className="text-[11px] text-muted-foreground/80 flex items-center gap-1">
                  <Shield className="h-3 w-3" />
                  Daily scheduler should review expiring VIPs and auto-update status.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </VipPageShell>
  );
};

export default Dashboard;

