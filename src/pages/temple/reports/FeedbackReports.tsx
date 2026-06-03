import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import PeriodFilter from "@/components/reports/PeriodFilter";
import { Download, MessageSquare, TrendingUp, Star, AlertTriangle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { toast } from "sonner";

const monthlyReport = [
  { month: "Feb 2026", total: 487, positive: 381, negative: 38, avgRating: 4.3, responseRate: 91, escalated: 12 },
  { month: "Jan 2026", total: 512, positive: 389, negative: 46, avgRating: 4.1, responseRate: 87, escalated: 18 },
  { month: "Dec 2025", total: 623, positive: 492, negative: 43, avgRating: 4.2, responseRate: 85, escalated: 15 },
  { month: "Nov 2025", total: 398, positive: 298, negative: 36, avgRating: 4.0, responseRate: 82, escalated: 22 },
  { month: "Oct 2025", total: 421, positive: 324, negative: 42, avgRating: 4.1, responseRate: 88, escalated: 14 },
  { month: "Sep 2025", total: 406, positive: 308, negative: 38, avgRating: 4.0, responseRate: 84, escalated: 16 },
];
const sentimentData = [
  { name: "Positive", value: 72, color: "hsl(142,60%,40%)" },
  { name: "Neutral", value: 20, color: "hsl(0,0%,75%)" },
  { name: "Negative", value: 8, color: "hsl(350,65%,50%)" },
];
const trendData = monthlyReport.map(r => ({ month: r.month.split(" ")[0], rating: r.avgRating, responseRate: r.responseRate })).reverse();

const FeedbackReports = () => {
  const [period, setPeriod] = useState("year");
  const totalFeedback = monthlyReport.reduce((s, r) => s + r.total, 0);
  const avgRating = (monthlyReport.reduce((s, r) => s + r.avgRating, 0) / monthlyReport.length).toFixed(1);
  const avgResponseRate = Math.round(monthlyReport.reduce((s, r) => s + r.responseRate, 0) / monthlyReport.length);
  const totalEscalated = monthlyReport.reduce((s, r) => s + r.escalated, 0);

  const handleExport = () => {
    const csv = ["Month,Total,Positive,Negative,Avg Rating,Response Rate,Escalated", ...monthlyReport.map(r => `"${r.month}",${r.total},${r.positive},${r.negative},${r.avgRating},${r.responseRate}%,${r.escalated}`)].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = `feedback-report-${new Date().toISOString().split("T")[0]}.csv`; a.click(); URL.revokeObjectURL(url);
    toast.success("Feedback report exported");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Feedback Reports</h1>
          <p className="text-sm text-muted-foreground mt-1">Sentiment analytics, category insights, monthly trends & response metrics</p>
        </div>
        <div className="flex gap-2">
          <PeriodFilter value={period} onChange={setPeriod} />
          <Button variant="outline" onClick={handleExport} className="gap-2"><Download className="h-4 w-4" />Export</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Feedback", value: totalFeedback.toLocaleString(), icon: MessageSquare, color: "text-blue-600" },
          { label: "Avg Rating", value: `⭐ ${avgRating}`, icon: Star, color: "text-amber-600" },
          { label: "Response Rate", value: `${avgResponseRate}%`, icon: TrendingUp, color: "text-green-600" },
          { label: "Escalated", value: totalEscalated, icon: AlertTriangle, color: "text-red-500" },
        ].map(kpi => (
          <Card key={kpi.label}><CardContent className="p-4"><div className="flex items-center gap-2 mb-1"><kpi.icon className={`h-4 w-4 ${kpi.color}`} /><span className="text-xs text-muted-foreground">{kpi.label}</span></div><p className="text-xl font-bold">{kpi.value}</p></CardContent></Card>
        ))}
      </div>

      {/* Trends */}
      <Card><CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2">Rating & Response Rate Trend<Badge variant="secondary" className="ml-auto text-[10px] font-normal">Line Chart</Badge></CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={300}><LineChart data={trendData}><CartesianGrid strokeDasharray="3 3" stroke="hsl(0,0%,90%)" /><XAxis dataKey="month" /><YAxis yAxisId="left" domain={[3, 5]} /><YAxis yAxisId="right" orientation="right" domain={[70, 100]} /><Tooltip /><Line yAxisId="left" type="monotone" dataKey="rating" stroke="hsl(45,90%,45%)" strokeWidth={2} dot={{ r: 4 }} name="Avg Rating" /><Line yAxisId="right" type="monotone" dataKey="responseRate" stroke="hsl(142,60%,40%)" strokeWidth={2} dot={{ r: 4 }} name="Response %" /></LineChart></ResponsiveContainer></CardContent></Card>

      <Card><CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2">Monthly Feedback Volume<Badge variant="secondary" className="ml-auto text-[10px] font-normal">Grouped Bar Chart</Badge></CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><BarChart data={monthlyReport.map(r => ({ month: r.month.split(" ")[0], positive: r.positive, negative: r.negative })).reverse()}><CartesianGrid strokeDasharray="3 3" stroke="hsl(0,0%,90%)" /><XAxis dataKey="month" /><YAxis /><Tooltip /><Bar dataKey="positive" fill="hsl(142,60%,40%)" name="Positive" radius={[4,4,0,0]} stackId="a" /><Bar dataKey="negative" fill="hsl(350,65%,50%)" name="Negative" radius={[4,4,0,0]} stackId="a" /></BarChart></ResponsiveContainer></CardContent></Card>

      {/* Sentiment */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card><CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2">Sentiment Distribution<Badge variant="secondary" className="ml-auto text-[10px] font-normal">Pie Chart</Badge></CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><PieChart><Pie data={sentimentData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, value }) => `${name}: ${value}%`}>{sentimentData.map((e, i) => <Cell key={i} fill={e.color} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2">Sentiment Summary<Badge variant="secondary" className="ml-auto text-[10px] font-normal">Progress List</Badge></CardTitle></CardHeader><CardContent className="space-y-4">{sentimentData.map(s => (<div key={s.name}><div className="flex items-center justify-between mb-1"><span className="text-sm font-medium">{s.name}</span><span className="text-sm font-bold">{s.value}%</span></div><Progress value={s.value} className="h-3" /></div>))}</CardContent></Card>
      </div>
    </div>
  );
};

export default FeedbackReports;
