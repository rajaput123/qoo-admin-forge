import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import PeriodFilter from "@/components/reports/PeriodFilter";
import { Download, Crown, IndianRupee, Users, Shield } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { toast } from "sonner";

const vipContribution = [
  { name: "Ramesh Kumar", donations: 125000, bookings: 24, level: "Platinum" },
  { name: "Lakshmi Devi", donations: 85000, bookings: 32, level: "Gold" },
  { name: "Anand Verma", donations: 48000, bookings: 18, level: "Silver" },
  { name: "Priya Sharma", donations: 52000, bookings: 12, level: "Gold" },
  { name: "Suresh Reddy", donations: 65000, bookings: 15, level: "Platinum" },
];
const levelData = [
  { level: "Platinum", devotees: 8, contribution: 780000 },
  { level: "Gold", devotees: 10, contribution: 760000 },
  { level: "Silver", devotees: 6, contribution: 440000 },
];
const engagementTrend = [
  { month: "Sep", visits: 92, events: 18 }, { month: "Oct", visits: 104, events: 20 },
  { month: "Nov", visits: 118, events: 24 }, { month: "Dec", visits: 132, events: 28 },
  { month: "Jan", visits: 126, events: 25 }, { month: "Feb", visits: 88, events: 16 },
];
const sensitivityData = [
  { name: "Sensitive", value: 6, color: "hsl(16,85%,23%)" },
  { name: "Normal", value: 18, color: "hsl(0,0%,75%)" },
];

const VipReports = () => {
  const [period, setPeriod] = useState("month");
  const totalVIPs = levelData.reduce((s, l) => s + l.devotees, 0);
  const totalContribution = levelData.reduce((s, l) => s + l.contribution, 0);

  const handleExport = () => {
    const csv = ["Name,Level,Donations,Bookings", ...vipContribution.map(v => `"${v.name}","${v.level}",${v.donations},${v.bookings}`)].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = `vip-report-${new Date().toISOString().split("T")[0]}.csv`; a.click(); URL.revokeObjectURL(url);
    toast.success("VIP report exported");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">VIP Devotee Reports</h1>
          <p className="text-sm text-muted-foreground mt-1">Contribution analytics, engagement trends & governance audit view</p>
        </div>
        <div className="flex gap-2">
          <PeriodFilter value={period} onChange={setPeriod} />
          <Button variant="outline" onClick={handleExport} className="gap-2"><Download className="h-4 w-4" />Export</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Active VIPs", value: totalVIPs, icon: Users, color: "text-amber-600" },
          { label: "Total Contribution", value: `₹${(totalContribution / 100000).toFixed(1)}L`, icon: IndianRupee, color: "text-green-600" },
          { label: "Avg per VIP", value: `₹${Math.round(totalContribution / totalVIPs).toLocaleString()}`, icon: Crown, color: "text-purple-600" },
          { label: "Sensitive Profiles", value: "6", icon: Shield, color: "text-red-500" },
        ].map(kpi => (
          <Card key={kpi.label}><CardContent className="p-4"><div className="flex items-center gap-2 mb-1"><kpi.icon className={`h-4 w-4 ${kpi.color}`} /><span className="text-xs text-muted-foreground">{kpi.label}</span></div><p className="text-xl font-bold">{kpi.value}</p></CardContent></Card>
        ))}
      </div>

      {/* Contribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card><CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2">Top VIP Contributors<Badge variant="secondary" className="ml-auto text-[10px] font-normal">Horizontal Bar Chart</Badge></CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><BarChart data={vipContribution} layout="vertical"><CartesianGrid strokeDasharray="3 3" stroke="hsl(0,0%,90%)" /><XAxis type="number" /><YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={110} /><Tooltip formatter={(v: number) => `₹${v.toLocaleString()}`} /><Bar dataKey="donations" fill="hsl(16,85%,23%)" radius={[0,4,4,0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2">Level-wise Contribution<Badge variant="secondary" className="ml-auto text-[10px] font-normal">Bar Chart</Badge></CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><BarChart data={levelData}><CartesianGrid strokeDasharray="3 3" stroke="hsl(0,0%,90%)" /><XAxis dataKey="level" /><YAxis /><Tooltip formatter={(v: number) => `₹${v.toLocaleString()}`} /><Bar dataKey="contribution" fill="hsl(217,91%,60%)" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></CardContent></Card>
      </div>

      {/* Engagement Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2"><CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2">Engagement Trend<Badge variant="secondary" className="ml-auto text-[10px] font-normal">Line Chart</Badge></CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><LineChart data={engagementTrend}><CartesianGrid strokeDasharray="3 3" stroke="hsl(0,0%,90%)" /><XAxis dataKey="month" /><YAxis /><Tooltip /><Line type="monotone" dataKey="visits" stroke="hsl(16,85%,23%)" strokeWidth={2} dot={{ r: 4 }} name="Visits" /><Line type="monotone" dataKey="events" stroke="hsl(217,91%,60%)" strokeWidth={2} dot={{ r: 4 }} name="Events" /></LineChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2">Sensitivity Breakdown<Badge variant="secondary" className="ml-auto text-[10px] font-normal">Donut Chart</Badge></CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={200}><PieChart><Pie data={sensitivityData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value">{sensitivityData.map((e, i) => <Cell key={i} fill={e.color} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer><div className="space-y-1.5 mt-2">{sensitivityData.map(l => (<div key={l.name} className="flex items-center justify-between"><div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: l.color }} /><span className="text-xs text-muted-foreground">{l.name}</span></div><span className="text-xs font-medium">{l.value}</span></div>))}</div></CardContent></Card>
      </div>
    </div>
  );
};

export default VipReports;
