import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import PeriodFilter from "@/components/reports/PeriodFilter";
import { Download, FolderKanban, IndianRupee, TrendingUp, CheckCircle2, Clock } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { projects } from "@/data/projectData";
import { toast } from "sonner";

const COLORS = ["hsl(142,60%,40%)", "hsl(217,91%,60%)", "hsl(45,90%,45%)", "hsl(350,65%,50%)", "hsl(280,50%,55%)", "hsl(16,85%,23%)"];

const ProjectReports = () => {
  const [period, setPeriod] = useState("month");
  const totalGoal = projects.reduce((s, p) => s + p.goalAmount, 0);
  const totalRaised = projects.reduce((s, p) => s + p.raisedAmount, 0);
  const avgCompletion = projects.length > 0 ? projects.reduce((s, p) => s + p.completion, 0) / projects.length : 0;
  const activeProjects = projects.filter(p => p.status === "Active").length;

  const statusData = useMemo(() => {
    const map = new Map<string, number>();
    projects.forEach(p => map.set(p.status, (map.get(p.status) || 0) + 1));
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, []);

  const typeData = useMemo(() => {
    const map = new Map<string, number>();
    projects.forEach(p => map.set(p.type, (map.get(p.type) || 0) + 1));
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, []);

  const fundingData = projects.map(p => ({
    name: p.title.length > 18 ? p.title.substring(0, 18) + "…" : p.title,
    goal: p.goalAmount, raised: p.raisedAmount, spent: p.spentAmount,
  }));

  const milestoneStats = useMemo(() => {
    let completed = 0, inProgress = 0, delayed = 0, pending = 0;
    projects.forEach(p => p.milestones.forEach(m => {
      if (m.status === "Completed") completed++;
      else if (m.status === "In Progress") inProgress++;
      else if (m.status === "Delayed") delayed++;
      else pending++;
    }));
    return { completed, inProgress, delayed, pending };
  }, []);

  const handleExport = () => {
    const csv = ["Project,Type,Status,Goal,Raised,Spent,Completion%,Milestones", ...projects.map(p => `"${p.title}","${p.type}","${p.status}",${p.goalAmount},${p.raisedAmount},${p.spentAmount},${p.completion},${p.milestones.length}`)].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = `project-reports-${new Date().toISOString().split("T")[0]}.csv`; a.click(); URL.revokeObjectURL(url);
    toast.success("Project report exported");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Project Reports</h1>
          <p className="text-sm text-muted-foreground mt-1">Project progress tracking, fundraising analysis & milestone governance</p>
        </div>
        <div className="flex gap-2">
          <PeriodFilter value={period} onChange={setPeriod} />
          <Button variant="outline" onClick={handleExport} className="gap-2"><Download className="h-4 w-4" />Export</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: "Total Projects", value: projects.length, icon: FolderKanban, color: "text-blue-600" },
          { label: "Active", value: activeProjects, icon: Clock, color: "text-green-600" },
          { label: "Goal Amount", value: `₹${(totalGoal / 10000000).toFixed(1)}Cr`, icon: IndianRupee, color: "text-purple-600" },
          { label: "Raised", value: `₹${(totalRaised / 10000000).toFixed(2)}Cr`, icon: TrendingUp, color: "text-teal-600" },
          { label: "Avg Completion", value: `${avgCompletion.toFixed(0)}%`, icon: CheckCircle2, color: "text-amber-600" },
        ].map(kpi => (
          <Card key={kpi.label}><CardContent className="p-4"><div className="flex items-center gap-2 mb-1"><kpi.icon className={`h-4 w-4 ${kpi.color}`} /><span className="text-xs text-muted-foreground">{kpi.label}</span></div><p className="text-xl font-bold">{kpi.value}</p></CardContent></Card>
        ))}
      </div>

      {/* Overview Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card><CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2">Projects by Status<Badge variant="secondary" className="ml-auto text-[10px] font-normal">Pie Chart</Badge></CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><PieChart><Pie data={statusData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>{statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2">Projects by Type<Badge variant="secondary" className="ml-auto text-[10px] font-normal">Bar Chart</Badge></CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><BarChart data={typeData}><CartesianGrid strokeDasharray="3 3" stroke="hsl(0,0%,90%)" /><XAxis dataKey="name" tick={{ fontSize: 10 }} /><YAxis /><Tooltip /><Bar dataKey="value" fill="hsl(220,55%,50%)" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></CardContent></Card>
      </div>

      {/* Funding Analysis */}
      <Card><CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2">Goal vs Raised vs Spent<Badge variant="secondary" className="ml-auto text-[10px] font-normal">Grouped Bar Chart</Badge></CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={300}><BarChart data={fundingData}><CartesianGrid strokeDasharray="3 3" stroke="hsl(0,0%,90%)" /><XAxis dataKey="name" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip formatter={(v: number) => `₹${(v / 100000).toFixed(1)}L`} /><Bar dataKey="goal" fill="hsl(217,91%,60%)" name="Goal" radius={[4,4,0,0]} /><Bar dataKey="raised" fill="hsl(142,60%,40%)" name="Raised" radius={[4,4,0,0]} /><Bar dataKey="spent" fill="hsl(350,65%,50%)" name="Spent" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></CardContent></Card>

      {/* Milestone Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Completed", value: milestoneStats.completed, color: "text-green-600" },
          { label: "In Progress", value: milestoneStats.inProgress, color: "text-blue-600" },
          { label: "Delayed", value: milestoneStats.delayed, color: "text-red-500" },
          { label: "Pending", value: milestoneStats.pending, color: "text-muted-foreground" },
        ].map(s => (
          <Card key={s.label}><CardContent className="p-4 text-center"><p className={`text-2xl font-bold ${s.color}`}>{s.value}</p><p className="text-xs text-muted-foreground">{s.label}</p></CardContent></Card>
        ))}
      </div>
    </div>
  );
};

export default ProjectReports;
