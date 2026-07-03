import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PeriodFilter from "@/components/reports/PeriodFilter";
import { Download, GitBranch, IndianRupee, Users, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { branches } from "@/data/branchData";
import { toast } from "sonner";

const COLORS = ["hsl(142,60%,40%)", "hsl(217,91%,60%)", "hsl(45,90%,45%)", "hsl(350,65%,50%)"];

const BranchReports = () => {
  const [period, setPeriod] = useState("month");
  const totalRevenue = branches.reduce((s, b) => s + b.monthlyRevenue, 0);
  const totalExpense = branches.reduce((s, b) => s + b.monthlyExpense, 0);
  const totalVolunteers = branches.reduce((s, b) => s + b.volunteerCount, 0);

  const revenueData = branches.map(b => ({ name: b.name.length > 15 ? b.name.substring(0, 15) + "…" : b.name, revenue: b.monthlyRevenue, expense: b.monthlyExpense }));
  const statusData = [
    { name: "Active", value: branches.filter(b => b.status === "Active").length },
    { name: "Inactive", value: branches.filter(b => b.status === "Inactive").length },
    { name: "Under Setup", value: branches.filter(b => b.status !== "Active" && b.status !== "Inactive").length },
  ].filter(s => s.value > 0);

  const handleExport = () => {
    const csv = ["Branch,Code,City,State,Revenue,Expenses,Volunteers,Events,Status", ...branches.map(b => `"${b.name}",${b.code},"${b.city}","${b.state}",${b.monthlyRevenue},${b.monthlyExpense},${b.volunteerCount},${b.activeEvents},"${b.status}"`)].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = `branch-reports-${new Date().toISOString().split("T")[0]}.csv`; a.click(); URL.revokeObjectURL(url);
    toast.success("Branch report exported");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Branch Reports</h1>
          <p className="text-sm text-muted-foreground mt-1">Cross-branch analytics, revenue comparison & performance metrics</p>
        </div>
        <div className="flex gap-2">
          <PeriodFilter value={period} onChange={setPeriod} />
          <Button variant="outline" onClick={handleExport} className="gap-2"><Download className="h-4 w-4" />Export</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Branches", value: branches.length, icon: GitBranch, color: "text-teal-600" },
          { label: "Total Revenue", value: `₹${(totalRevenue / 100000).toFixed(1)}L`, icon: IndianRupee, color: "text-green-600" },
          { label: "Total Expense", value: `₹${(totalExpense / 100000).toFixed(1)}L`, icon: TrendingUp, color: "text-amber-600" },
          { label: "Volunteers", value: totalVolunteers, icon: Users, color: "text-purple-600" },
        ].map(kpi => (
          <Card key={kpi.label}><CardContent className="p-4"><div className="flex items-center gap-2 mb-1"><kpi.icon className={`h-4 w-4 ${kpi.color}`} /><span className="text-xs text-muted-foreground">{kpi.label}</span></div><p className="text-xl font-bold">{kpi.value}</p></CardContent></Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2"><CardHeader className="pb-2"><CardTitle className="text-base">Revenue vs Expenses by Branch</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={300}><BarChart data={revenueData}><CartesianGrid strokeDasharray="3 3" stroke="hsl(0,0%,90%)" /><XAxis dataKey="name" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip formatter={(v: number) => `₹${v.toLocaleString()}`} /><Bar dataKey="revenue" fill="hsl(142,60%,40%)" name="Revenue" radius={[4,4,0,0]} /><Bar dataKey="expense" fill="hsl(350,65%,50%)" name="Expense" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-base">Branch Status</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><PieChart><Pie data={statusData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>{statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
      </div>
    </div>
  );
};

export default BranchReports;
