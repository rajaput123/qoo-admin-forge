import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import PeriodFilter from "@/components/reports/PeriodFilter";
import { Download, Users, Heart, Calendar, MapPin, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { devoteesData } from "@/data/devotees";
import { toast } from "sonner";

const COLORS = ["hsl(142,60%,40%)", "hsl(217,91%,60%)", "hsl(45,90%,45%)", "hsl(350,65%,50%)", "hsl(280,50%,55%)", "hsl(16,85%,23%)", "hsl(190,60%,45%)"];

const DevoteeReports = () => {
  const [period, setPeriod] = useState("year");
  const devotees = devoteesData;

  const totalDevotees = devotees.length;
  const activeDevotees = devotees.filter(d => d.status === "Active").length;
  const volunteers = devotees.filter(d => d.isVolunteer).length;
  const totalDonations = devotees.reduce((s, d) => s + d.totalDonations, 0);
  const totalBookings = devotees.reduce((s, d) => s + d.totalBookings, 0);

  // City-wise distribution
  const cityData = useMemo(() => {
    const map = new Map<string, number>();
    devotees.forEach(d => map.set(d.city, (map.get(d.city) || 0) + 1));
    return Array.from(map.entries()).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 8);
  }, []);

  // Tags distribution
  const tagData = useMemo(() => {
    const map = new Map<string, number>();
    devotees.forEach(d => d.tags?.forEach(t => map.set(t, (map.get(t) || 0) + 1)));
    return Array.from(map.entries()).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 8);
  }, []);

  // Source breakdown
  const sourceData = useMemo(() => {
    const map = new Map<string, number>();
    devotees.forEach(d => map.set(d.source || "Unknown", (map.get(d.source || "Unknown") || 0) + 1));
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, []);

  // Gender distribution
  const genderData = useMemo(() => {
    const map = new Map<string, number>();
    devotees.forEach(d => map.set(d.gender || "Unknown", (map.get(d.gender || "Unknown") || 0) + 1));
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, []);

  // Top devotees by engagement
  const topDevotees = useMemo(() => {
    return [...devotees]
      .sort((a, b) => (b.totalBookings + b.totalDonations) - (a.totalBookings + a.totalDonations))
      .slice(0, 10);
  }, []);

  const handleExport = () => {
    const csv = ["ID,Name,Phone,City,Status,Bookings,Donations,Volunteer,Last Visit", ...devotees.map(d => `${d.id},"${d.name}","${d.phone}","${d.city}","${d.status}",${d.totalBookings},${d.totalDonations},${d.isVolunteer},${d.lastVisit}`)].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = `devotee-report-${new Date().toISOString().split("T")[0]}.csv`; a.click(); URL.revokeObjectURL(url);
    toast.success("Devotee report exported");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Devotee Management Reports</h1>
          <p className="text-sm text-muted-foreground mt-1">Devotee demographics, engagement analytics & volunteer insights</p>
        </div>
        <div className="flex gap-2">
          <PeriodFilter value={period} onChange={setPeriod} />
          <Button variant="outline" onClick={handleExport} className="gap-2"><Download className="h-4 w-4" />Export</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: "Total Devotees", value: totalDevotees, icon: Users, color: "text-blue-600" },
          { label: "Active", value: activeDevotees, icon: TrendingUp, color: "text-green-600" },
          { label: "Volunteers", value: volunteers, icon: Heart, color: "text-rose-600" },
          { label: "Total Bookings", value: totalBookings, icon: Calendar, color: "text-amber-600" },
          { label: "Total Donations", value: totalDonations, icon: Heart, color: "text-purple-600" },
        ].map(kpi => (
          <Card key={kpi.label}><CardContent className="p-4"><div className="flex items-center gap-2 mb-1"><kpi.icon className={`h-4 w-4 ${kpi.color}`} /><span className="text-xs text-muted-foreground">{kpi.label}</span></div><p className="text-xl font-bold">{kpi.value}</p></CardContent></Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* City Distribution */}
        <Card><CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><MapPin className="h-4 w-4" />City-wise Distribution<Badge variant="secondary" className="ml-auto text-[10px] font-normal">Bar Chart</Badge></CardTitle></CardHeader><CardContent>
          <ResponsiveContainer width="100%" height={250}><BarChart data={cityData}><CartesianGrid strokeDasharray="3 3" stroke="hsl(0,0%,90%)" /><XAxis dataKey="name" tick={{ fontSize: 10 }} /><YAxis /><Tooltip /><Bar dataKey="value" fill="hsl(217,91%,60%)" radius={[4,4,0,0]} name="Devotees" /></BarChart></ResponsiveContainer>
        </CardContent></Card>

        {/* Gender Distribution */}
        <Card><CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2">Gender Distribution<Badge variant="secondary" className="ml-auto text-[10px] font-normal">Pie Chart</Badge></CardTitle></CardHeader><CardContent>
          <ResponsiveContainer width="100%" height={250}><PieChart><Pie data={genderData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>{genderData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer>
        </CardContent></Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Source */}
        <Card><CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2">Registration Source<Badge variant="secondary" className="ml-auto text-[10px] font-normal">Pie Chart</Badge></CardTitle></CardHeader><CardContent>
          <ResponsiveContainer width="100%" height={250}><PieChart><Pie data={sourceData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>{sourceData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer>
        </CardContent></Card>

        {/* Tags */}
        <Card><CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2">Popular Tags<Badge variant="secondary" className="ml-auto text-[10px] font-normal">Bar Chart</Badge></CardTitle></CardHeader><CardContent>
          <ResponsiveContainer width="100%" height={250}><BarChart data={tagData}><CartesianGrid strokeDasharray="3 3" stroke="hsl(0,0%,90%)" /><XAxis dataKey="name" tick={{ fontSize: 10 }} /><YAxis /><Tooltip /><Bar dataKey="value" fill="hsl(45,90%,45%)" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer>
        </CardContent></Card>
      </div>

      {/* Top Devotees */}
      <Card><CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2">Top Engaged Devotees<Badge variant="secondary" className="ml-auto text-[10px] font-normal">Table</Badge></CardTitle></CardHeader><CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b"><th className="text-left py-2 font-medium text-muted-foreground">Name</th><th className="text-left py-2 font-medium text-muted-foreground">City</th><th className="text-right py-2 font-medium text-muted-foreground">Bookings</th><th className="text-right py-2 font-medium text-muted-foreground">Donations</th><th className="text-left py-2 font-medium text-muted-foreground">Last Visit</th></tr></thead>
            <tbody>{topDevotees.map(d => (
              <tr key={d.id} className="border-b last:border-0"><td className="py-2">{d.name}</td><td className="py-2 text-muted-foreground">{d.city}</td><td className="text-right py-2">{d.totalBookings}</td><td className="text-right py-2">{d.totalDonations}</td><td className="py-2 text-muted-foreground">{d.lastVisit}</td></tr>
            ))}</tbody>
          </table>
        </div>
      </CardContent></Card>
    </div>
  );
};

export default DevoteeReports;
