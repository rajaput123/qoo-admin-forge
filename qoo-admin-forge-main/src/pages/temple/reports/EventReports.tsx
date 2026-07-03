import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import PeriodFilter from "@/components/reports/PeriodFilter";
import { Download, CalendarDays, IndianRupee, TrendingUp, CheckCircle2, Clock } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useEvents } from "@/modules/events/hooks";
import { eventExpenses, getEventTasks, getEventFreelancers, getEventVolunteers, getEventMaterials } from "@/data/eventData";
import { toast } from "sonner";

const COLORS = ["hsl(142,60%,40%)", "hsl(217,91%,60%)", "hsl(45,90%,45%)", "hsl(350,65%,50%)", "hsl(280,50%,55%)", "hsl(16,85%,23%)"];

const EventReports = () => {
  const events = useEvents();
  const [period, setPeriod] = useState("month");

  const summaries = useMemo(() => events.map(e => {
    const expenses = eventExpenses.filter(x => x.eventId === e.id);
    const tasks = getEventTasks(e.id);
    const freelancers = getEventFreelancers(e.id);
    const volunteers = getEventVolunteers(e.id);
    const materials = getEventMaterials(e.id);
    const totalSpend = expenses.reduce((a, x) => a + x.amount, 0);
    const shortages = materials.filter(m => m.allocatedQty < m.requiredQty).length;
    const openTasks = tasks.filter(t => t.status !== "Completed").length;
    return { ...e, totalSpend, taskCount: tasks.length, openTasks, freelancerCount: freelancers.length, volunteerCount: volunteers.reduce((a, v) => a + v.count, 0), shortages };
  }), [events]);

  const totalBudget = events.reduce((a, e) => a + e.estimatedBudget, 0);
  const totalSpend = summaries.reduce((a, e) => a + e.totalSpend, 0);
  const activeEventsCount = events.filter(e => e.status === "Ongoing" || e.status === "Published").length;

  const statusData = useMemo(() => {
    const map = new Map<string, number>();
    events.forEach(e => map.set(e.status, (map.get(e.status) || 0) + 1));
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [events]);

  const budgetVsActual = useMemo(() => summaries.map(e => ({
    name: e.name.length > 15 ? e.name.substring(0, 15) + "…" : e.name,
    budget: e.estimatedBudget,
    actual: e.totalSpend,
  })), [summaries]);

  const typeData = useMemo(() => {
    const map = new Map<string, number>();
    events.forEach(e => map.set(e.type, (map.get(e.type) || 0) + 1));
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [events]);

  const handleExport = () => {
    const csv = ["Event,Type,Status,Budget,Spend,Tasks,Open Tasks,Freelancers,Volunteers,Shortages", ...summaries.map(e => `"${e.name}","${e.type}","${e.status}",${e.estimatedBudget},${e.totalSpend},${e.taskCount},${e.openTasks},${e.freelancerCount},${e.volunteerCount},${e.shortages}`)].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `event-reports-${new Date().toISOString().split("T")[0]}.csv`; a.click(); URL.revokeObjectURL(url);
    toast.success("Event report exported");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Event Reports</h1>
          <p className="text-sm text-muted-foreground mt-1">Cross-event analytics, budget tracking & resource governance</p>
        </div>
        <div className="flex gap-2">
          <PeriodFilter value={period} onChange={setPeriod} />
          <Button variant="outline" onClick={handleExport} className="gap-2"><Download className="h-4 w-4" />Export</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: "Total Events", value: events.length, icon: CalendarDays, color: "text-purple-600" },
          { label: "Active/Published", value: activeEventsCount, icon: Clock, color: "text-blue-600" },
          { label: "Total Budget", value: `₹${(totalBudget / 100000).toFixed(1)}L`, icon: IndianRupee, color: "text-green-600" },
          { label: "Total Spend", value: `₹${(totalSpend / 100000).toFixed(1)}L`, icon: TrendingUp, color: "text-amber-600" },
          { label: "Utilization", value: `${totalBudget > 0 ? ((totalSpend / totalBudget) * 100).toFixed(0) : 0}%`, icon: CheckCircle2, color: "text-teal-600" },
        ].map(kpi => (
          <Card key={kpi.label}><CardContent className="p-4"><div className="flex items-center gap-2 mb-1"><kpi.icon className={`h-4 w-4 ${kpi.color}`} /><span className="text-xs text-muted-foreground">{kpi.label}</span></div><p className="text-xl font-bold">{kpi.value}</p></CardContent></Card>
        ))}
      </div>

      {/* Overview Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card><CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2">Events by Status<Badge variant="secondary" className="ml-auto text-[10px] font-normal">Pie Chart</Badge></CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><PieChart><Pie data={statusData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>{statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2">Events by Type<Badge variant="secondary" className="ml-auto text-[10px] font-normal">Bar Chart</Badge></CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><BarChart data={typeData}><CartesianGrid strokeDasharray="3 3" stroke="hsl(0,0%,90%)" /><XAxis dataKey="name" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="value" fill="hsl(260,55%,55%)" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></CardContent></Card>
      </div>

      {/* Budget Analysis */}
      <Card><CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2">Budget vs Actual Spend<Badge variant="secondary" className="ml-auto text-[10px] font-normal">Grouped Bar Chart</Badge></CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={300}><BarChart data={budgetVsActual}><CartesianGrid strokeDasharray="3 3" stroke="hsl(0,0%,90%)" /><XAxis dataKey="name" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip formatter={(v: number) => `₹${v.toLocaleString()}`} /><Bar dataKey="budget" fill="hsl(217,91%,60%)" radius={[4,4,0,0]} name="Budget" /><Bar dataKey="actual" fill="hsl(16,85%,23%)" radius={[4,4,0,0]} name="Actual" /></BarChart></ResponsiveContainer></CardContent></Card>
    </div>
  );
};

export default EventReports;
