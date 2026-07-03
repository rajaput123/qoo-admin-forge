import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import PeriodFilter from "@/components/reports/PeriodFilter";
import { Download, Briefcase, IndianRupee, CheckCircle2, Clock, Award } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { freelancerAssignments } from "@/data/templeData";
import { toast } from "sonner";

const FreelancerReports = () => {
  const [period, setPeriod] = useState("month");
  const assignments = freelancerAssignments;
  const completed = assignments.filter(a => a.status === "Completed");
  const active = assignments.filter(a => a.status === "Assigned" || a.status === "Confirmed");
  const totalSpend = completed.reduce((s, a) => s + a.agreedPayment, 0);
  const pendingSpend = active.reduce((s, a) => s + a.agreedPayment, 0);
  const completionRate = assignments.length > 0 ? (completed.length / assignments.length) * 100 : 0;

  const freelancerStats = useMemo(() => {
    const map = new Map<string, { name: string; total: number; completed: number; paid: number; pending: number }>();
    assignments.forEach(a => {
      const prev = map.get(a.freelancerName) || { name: a.freelancerName, total: 0, completed: 0, paid: 0, pending: 0 };
      prev.total++;
      if (a.status === "Completed") { prev.completed++; prev.paid += a.agreedPayment; }
      else if (a.status === "Assigned" || a.status === "Confirmed") { prev.pending += a.agreedPayment; }
      map.set(a.freelancerName, prev);
    });
    return Array.from(map.values()).sort((a, b) => b.completed - a.completed);
  }, []);

  const spendData = freelancerStats.map(f => ({ name: f.name.split(" ")[0], paid: f.paid, pending: f.pending }));

  const handleExport = () => {
    const csv = ["Freelancer,Total Assignments,Completed,Paid,Pending", ...freelancerStats.map(f => `"${f.name}",${f.total},${f.completed},${f.paid},${f.pending}`)].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = `freelancer-report-${new Date().toISOString().split("T")[0]}.csv`; a.click(); URL.revokeObjectURL(url);
    toast.success("Freelancer report exported");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Freelancer Reports</h1>
          <p className="text-sm text-muted-foreground mt-1">Assignment analytics, spend tracking & performance metrics</p>
        </div>
        <div className="flex gap-2">
          <PeriodFilter value={period} onChange={setPeriod} />
          <Button variant="outline" onClick={handleExport} className="gap-2"><Download className="h-4 w-4" />Export</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: "Total Assignments", value: assignments.length, icon: Briefcase, color: "text-blue-600" },
          { label: "Completed", value: completed.length, icon: CheckCircle2, color: "text-green-600" },
          { label: "Active", value: active.length, icon: Clock, color: "text-amber-600" },
          { label: "Total Paid", value: `₹${totalSpend.toLocaleString()}`, icon: IndianRupee, color: "text-teal-600" },
          { label: "Completion Rate", value: `${completionRate.toFixed(0)}%`, icon: Award, color: "text-purple-600" },
        ].map(kpi => (
          <Card key={kpi.label}><CardContent className="p-4"><div className="flex items-center gap-2 mb-1"><kpi.icon className={`h-4 w-4 ${kpi.color}`} /><span className="text-xs text-muted-foreground">{kpi.label}</span></div><p className="text-xl font-bold">{kpi.value}</p></CardContent></Card>
        ))}
      </div>

      {/* Financial Chart */}
      <Card><CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2">Spend by Freelancer<Badge variant="secondary" className="ml-auto text-[10px] font-normal">Grouped Bar Chart</Badge></CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={300}><BarChart data={spendData}><CartesianGrid strokeDasharray="3 3" stroke="hsl(0,0%,90%)" /><XAxis dataKey="name" /><YAxis /><Tooltip formatter={(v: number) => `₹${v.toLocaleString()}`} /><Bar dataKey="paid" fill="hsl(142,60%,40%)" name="Paid" radius={[4,4,0,0]} stackId="a" /><Bar dataKey="pending" fill="hsl(45,90%,45%)" name="Pending" radius={[4,4,0,0]} stackId="a" /></BarChart></ResponsiveContainer></CardContent></Card>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-green-600">₹{totalSpend.toLocaleString()}</p><p className="text-xs text-muted-foreground">Total Paid</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-amber-600">₹{pendingSpend.toLocaleString()}</p><p className="text-xs text-muted-foreground">Pending</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold">₹{(totalSpend + pendingSpend).toLocaleString()}</p><p className="text-xs text-muted-foreground">Total Allocated</p></CardContent></Card>
      </div>
    </div>
  );
};

export default FreelancerReports;
