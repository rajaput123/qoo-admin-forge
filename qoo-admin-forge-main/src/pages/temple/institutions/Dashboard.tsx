import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Building2,
  Users,
  Heart,
  IndianRupee,
  TrendingUp,
  Calendar,
  AlertCircle,
  Plus,
  ArrowRight,
} from "lucide-react";
import { institutions } from "@/data/institutionData";

const Dashboard = () => {
  const navigate = useNavigate();
  const [period, setPeriod] = useState<"week" | "month" | "year">("month");

  // Calculate KPIs
  const totalInstitutions = institutions.length;
  const activeInstitutions = institutions.filter(i => i.status === "Active").length;
  const totalStaff = institutions.reduce((sum, i) => sum + i.totalStaff, 0);
  const totalVolunteers = institutions.reduce((sum, i) => sum + i.volunteerCount, 0);
  const totalDonations = institutions.reduce((sum, i) => sum + i.monthlyDonations, 0);
  const totalExpenses = institutions.reduce((sum, i) => sum + i.monthlyExpense, 0);
  const totalEvents = institutions.reduce((sum, i) => sum + i.activeEvents, 0);
  const netSurplus = totalDonations - totalExpenses;

  // Group by type
  const byType = institutions.reduce((acc, inst) => {
    acc[inst.type] = (acc[inst.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Recent institutions
  const recentInstitutions = [...institutions]
    .sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime())
    .slice(0, 5);

  // Top institutions by donations
  const topByDonations = [...institutions]
    .sort((a, b) => b.monthlyDonations - a.monthlyDonations)
    .slice(0, 5);

  const statusColor = (status: string) => {
    if (status === "Active") return "text-green-700 border-green-300 bg-green-50";
    if (status === "Inactive") return "text-red-700 border-red-300 bg-red-50";
    return "text-amber-700 border-amber-300 bg-amber-50";
  };

  const kpis = [
    {
      label: "Total Institutions",
      value: totalInstitutions.toString(),
      icon: Building2,
      sub: `${activeInstitutions} active`,
      color: "text-primary",
      bg: "bg-primary/5",
    },
    {
      label: "Total Staff",
      value: totalStaff.toLocaleString(),
      icon: Users,
      sub: "Across all institutions",
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Total Volunteers",
      value: totalVolunteers.toLocaleString(),
      icon: Heart,
      sub: "Active volunteers",
      color: "text-rose-600",
      bg: "bg-rose-50",
    },
    {
      label: "Monthly Donations",
      value: `₹${(totalDonations / 100000).toFixed(1)}L`,
      icon: IndianRupee,
      sub: "This month",
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Monthly Expenses",
      value: `₹${(totalExpenses / 100000).toFixed(1)}L`,
      icon: TrendingUp,
      sub: "Operational costs",
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "Active Events",
      value: totalEvents.toString(),
      icon: Calendar,
      sub: "Ongoing events",
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Institutions Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Overview of all institutions, schools, hospitals, and trust entities
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate("/temple/institutions/all")}>
            View All
          </Button>
          <Button size="sm" onClick={() => navigate("/temple/institutions/all")}>
            <Plus className="h-4 w-4 mr-1" />
            Add Institution
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpis.map((kpi, i) => (
          <Card key={i} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${kpi.bg} mb-2`}>
                <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
              </div>
              <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{kpi.label}</p>
              <p className="text-[10px] text-muted-foreground/70 mt-0.5">{kpi.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Financial Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Donations</span>
              <span className="text-lg font-semibold text-green-600">
                ₹{(totalDonations / 100000).toFixed(1)}L
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Expenses</span>
              <span className="text-lg font-semibold text-amber-600">
                ₹{(totalExpenses / 100000).toFixed(1)}L
              </span>
            </div>
            <div className="border-t pt-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Net Surplus</span>
                <span className={`text-lg font-bold ${netSurplus >= 0 ? "text-green-600" : "text-red-600"}`}>
                  ₹{(Math.abs(netSurplus) / 100000).toFixed(1)}L
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Institution Types</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {Object.entries(byType)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 5)
              .map(([type, count]) => (
                <div key={type} className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{type}</span>
                  <Badge variant="secondary">{count}</Badge>
                </div>
              ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Status Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Active</span>
              <Badge className="bg-green-50 text-green-700 border-green-200">
                {activeInstitutions}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Inactive</span>
              <Badge className="bg-red-50 text-red-700 border-red-200">
                {institutions.filter(i => i.status === "Inactive").length}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Under Setup</span>
              <Badge className="bg-amber-50 text-amber-700 border-amber-200">
                {institutions.filter(i => i.status === "Under Setup").length}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tables Row */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Recent Institutions</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/temple/institutions/all")}
                className="h-7 text-xs"
              >
                View All <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="h-8">Name</TableHead>
                  <TableHead className="h-8">Type</TableHead>
                  <TableHead className="h-8">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentInstitutions.map(inst => (
                  <TableRow
                    key={inst.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => navigate(`/temple/institutions/${inst.id}`)}
                  >
                    <TableCell className="font-medium text-sm">{inst.name}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{inst.type}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusColor(inst.status)}>
                        {inst.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Top by Donations</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/temple/institutions/reports")}
                className="h-7 text-xs"
              >
                View Reports <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="h-8">Institution</TableHead>
                  <TableHead className="h-8">Type</TableHead>
                  <TableHead className="h-8 text-right">Donations</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topByDonations.map(inst => (
                  <TableRow
                    key={inst.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => navigate(`/temple/institutions/${inst.id}`)}
                  >
                    <TableCell className="font-medium text-sm">{inst.name}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{inst.type}</TableCell>
                    <TableCell className="text-right font-semibold text-green-600">
                      ₹{(inst.monthlyDonations / 100000).toFixed(1)}L
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
