import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  GitBranch,
  Users,
  IndianRupee,
  TrendingUp,
  Calendar,
  Package,
  Plus,
  ArrowRight,
} from "lucide-react";
import { branches } from "@/data/branchData";

const Dashboard = () => {
  const navigate = useNavigate();

  // Calculate KPIs
  const totalBranches = branches.length;
  const activeBranches = branches.filter(b => b.status === "Active").length;
  const totalRevenue = branches.reduce((sum, b) => sum + b.monthlyRevenue, 0);
  const totalExpenses = branches.reduce((sum, b) => sum + b.monthlyExpense, 0);
  const totalVolunteers = branches.reduce((sum, b) => sum + b.volunteerCount, 0);
  const totalEvents = branches.reduce((sum, b) => sum + b.activeEvents, 0);
  const totalStockValue = branches.reduce((sum, b) => sum + b.totalStockValue, 0);
  const netSurplus = totalRevenue - totalExpenses;

  // Recent branches
  const recentBranches = [...branches]
    .sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime())
    .slice(0, 5);

  // Top branches by revenue
  const topByRevenue = [...branches]
    .sort((a, b) => b.monthlyRevenue - a.monthlyRevenue)
    .slice(0, 5);

  const statusColor = (status: string) => {
    if (status === "Active") return "text-green-700 border-green-300 bg-green-50";
    if (status === "Inactive") return "text-red-700 border-red-300 bg-red-50";
    return "text-amber-700 border-amber-300 bg-amber-50";
  };

  const kpis = [
    {
      label: "Total Branches",
      value: totalBranches.toString(),
      icon: GitBranch,
      sub: `${activeBranches} active`,
      color: "text-primary",
      bg: "bg-primary/5",
    },
    {
      label: "Monthly Revenue",
      value: `₹${(totalRevenue / 100000).toFixed(1)}L`,
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
      label: "Total Volunteers",
      value: totalVolunteers.toLocaleString(),
      icon: Users,
      sub: "Across all branches",
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Active Events",
      value: totalEvents.toString(),
      icon: Calendar,
      sub: "Ongoing events",
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      label: "Stock Value",
      value: `₹${(totalStockValue / 100000).toFixed(1)}L`,
      icon: Package,
      sub: "Total inventory",
      color: "text-cyan-600",
      bg: "bg-cyan-50",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Branch Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Overview of all temple branches and operations
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate("/temple/branches/all")}>
            View All
          </Button>
          <Button size="sm" onClick={() => navigate("/temple/branches/all")}>
            <Plus className="h-4 w-4 mr-1" />
            Add Branch
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
              <span className="text-sm text-muted-foreground">Total Revenue</span>
              <span className="text-lg font-semibold text-green-600">
                ₹{(totalRevenue / 100000).toFixed(1)}L
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
            <CardTitle className="text-base">Status Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Active</span>
              <Badge className="bg-green-50 text-green-700 border-green-200">
                {activeBranches}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Inactive</span>
              <Badge className="bg-red-50 text-red-700 border-red-200">
                {branches.filter(b => b.status === "Inactive").length}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Under Setup</span>
              <Badge className="bg-amber-50 text-amber-700 border-amber-200">
                {branches.filter(b => b.status === "Under Setup").length}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Quick Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Structures</span>
              <span className="text-sm font-semibold">
                {branches.reduce((sum, b) => sum + b.structureCount, 0)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Freelancers</span>
              <span className="text-sm font-semibold">
                {branches.reduce((sum, b) => sum + b.freelancerCount, 0)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Avg Revenue/Branch</span>
              <span className="text-sm font-semibold">
                ₹{((totalRevenue / totalBranches) / 1000).toFixed(0)}K
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tables Row */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Recent Branches</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/temple/branches/all")}
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
                  <TableHead className="h-8">Branch</TableHead>
                  <TableHead className="h-8">City</TableHead>
                  <TableHead className="h-8">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentBranches.map(branch => (
                  <TableRow
                    key={branch.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => navigate(`/temple/branches/${branch.id}`)}
                  >
                    <TableCell className="font-medium text-sm">{branch.name}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{branch.city}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusColor(branch.status)}>
                        {branch.status}
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
              <CardTitle className="text-base">Top by Revenue</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/temple/branches/reports")}
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
                  <TableHead className="h-8">Branch</TableHead>
                  <TableHead className="h-8">City</TableHead>
                  <TableHead className="h-8 text-right">Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topByRevenue.map(branch => (
                  <TableRow
                    key={branch.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => navigate(`/temple/branches/${branch.id}`)}
                  >
                    <TableCell className="font-medium text-sm">{branch.name}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{branch.city}</TableCell>
                    <TableCell className="text-right font-semibold text-green-600">
                      ₹{(branch.monthlyRevenue / 1000).toFixed(0)}K
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
