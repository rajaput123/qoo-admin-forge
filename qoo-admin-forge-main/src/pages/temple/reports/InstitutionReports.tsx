import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PeriodFilter from "@/components/reports/PeriodFilter";
import { Download, Building2, IndianRupee, Users, Heart } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { institutions } from "@/data/institutionData";
import { toast } from "sonner";

const COLORS = ["hsl(142,60%,40%)", "hsl(217,91%,60%)", "hsl(45,90%,45%)", "hsl(350,65%,50%)", "hsl(280,50%,55%)", "hsl(16,85%,23%)", "hsl(190,60%,45%)", "hsl(310,50%,50%)"];

const InstitutionReports = () => {
  const [period, setPeriod] = useState("month");
  const totalDonations = institutions.reduce((s, i) => s + i.monthlyDonations, 0);
  const totalStaff = institutions.reduce((s, i) => s + i.totalStaff, 0);
  const totalVolunteers = institutions.reduce((s, i) => s + i.volunteerCount, 0);

  const typeData = (() => {
    const map = new Map<string, number>();
    institutions.forEach(i => map.set(i.type, (map.get(i.type) || 0) + 1));
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  })();

  const financeData = institutions.map(i => ({
    name: i.name.length > 18 ? i.name.substring(0, 18) + "…" : i.name,
    donations: i.monthlyDonations, expenses: i.monthlyExpense,
  }));

  const statusData = [
    { name: "Active", value: institutions.filter(i => i.status === "Active").length },
    { name: "Inactive", value: institutions.filter(i => i.status === "Inactive").length },
    { name: "Under Setup", value: institutions.filter(i => i.status === "Under Setup").length },
  ].filter(s => s.value > 0);

  const handleExport = () => {
    const csv = ["Institution,Type,City,Staff,Volunteers,Events,Donations,Expenses,Status", ...institutions.map(i => `"${i.name}","${i.type}","${i.city}",${i.totalStaff},${i.volunteerCount},${i.activeEvents},${i.monthlyDonations},${i.monthlyExpense},"${i.status}"`)].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = `institution-reports-${new Date().toISOString().split("T")[0]}.csv`; a.click(); URL.revokeObjectURL(url);
    toast.success("Institution report exported");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Institution Reports</h1>
          <p className="text-sm text-muted-foreground mt-1">Cross-institution analytics, financial overview & entity performance</p>
        </div>
        <div className="flex gap-2">
          <PeriodFilter value={period} onChange={setPeriod} />
          <Button variant="outline" onClick={handleExport} className="gap-2"><Download className="h-4 w-4" />Export</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Institutions", value: institutions.length, icon: Building2, color: "text-indigo-600" },
          { label: "Total Donations", value: `₹${(totalDonations / 100000).toFixed(1)}L`, icon: IndianRupee, color: "text-green-600" },
          { label: "Total Staff", value: totalStaff, icon: Users, color: "text-blue-600" },
          { label: "Volunteers", value: totalVolunteers, icon: Heart, color: "text-purple-600" },
        ].map(kpi => (
          <Card key={kpi.label}><CardContent className="p-4"><div className="flex items-center gap-2 mb-1"><kpi.icon className={`h-4 w-4 ${kpi.color}`} /><span className="text-xs text-muted-foreground">{kpi.label}</span></div><p className="text-xl font-bold">{kpi.value}</p></CardContent></Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card><CardHeader className="pb-2"><CardTitle className="text-base">Institutions by Type</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><PieChart><Pie data={typeData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>{typeData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-base">Status Distribution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><BarChart data={statusData}><CartesianGrid strokeDasharray="3 3" stroke="hsl(0,0%,90%)" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="value" fill="hsl(250,50%,55%)" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></CardContent></Card>
      </div>

      {/* Financial Chart */}
      <Card><CardHeader className="pb-2"><CardTitle className="text-base">Donations vs Expenses by Institution</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={300}><BarChart data={financeData}><CartesianGrid strokeDasharray="3 3" stroke="hsl(0,0%,90%)" /><XAxis dataKey="name" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip formatter={(v: number) => `₹${v.toLocaleString()}`} /><Bar dataKey="donations" fill="hsl(142,60%,40%)" name="Donations" radius={[4,4,0,0]} /><Bar dataKey="expenses" fill="hsl(350,65%,50%)" name="Expenses" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></CardContent></Card>
    </div>
  );
};

export default InstitutionReports;
