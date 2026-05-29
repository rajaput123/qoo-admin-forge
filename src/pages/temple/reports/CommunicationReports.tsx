import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PeriodFilter from "@/components/reports/PeriodFilter";
import { Download, Megaphone, Mail, MessageSquare, Globe, TrendingUp, Users } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { devoteesData } from "@/data/devotees";
import { toast } from "sonner";

const COLORS = ["hsl(142,60%,40%)", "hsl(217,91%,60%)", "hsl(45,90%,45%)", "hsl(350,65%,50%)", "hsl(280,50%,55%)", "hsl(16,85%,23%)"];

// Fallback mock comm logs so all charts always render even if devotees have no commLogs seeded.
const MOCK_LOGS = (() => {
  const channels = ["SMS", "Email", "WhatsApp", "Push", "Call"];
  const subjects = ["Festival Invite", "Booking Confirmation", "Donation Receipt", "Birthday Wishes", "Event Reminder", "Prasadam Ready", "Newsletter", "Annadanam Call"];
  const statuses = ["Delivered", "Sent", "Delivered", "Failed", "Delivered", "Read"];
  const devotees = ["Ramesh Kumar", "Priya Iyer", "Vijay Rao", "Lakshmi Devi", "Suresh Patel", "Anita Sharma", "Krishna Murthy", "Sita Rani"];
  const today = new Date();
  const out: { date: string; channel: string; subject: string; status: string; devotee: string }[] = [];
  for (let i = 0; i < 120; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - (i % 180));
    out.push({
      date: d.toISOString().split("T")[0],
      channel: channels[i % channels.length],
      subject: subjects[i % subjects.length],
      status: statuses[i % statuses.length],
      devotee: devotees[i % devotees.length],
    });
  }
  return out;
})();

const CommunicationReports = () => {
  const [period, setPeriod] = useState("year");

  // Aggregate comm logs from devotee data
  const allLogs = useMemo(() => {
    const logs: { date: string; channel: string; subject: string; status: string; devotee: string }[] = [];
    devoteesData.forEach(d => {
      d.commLogs?.forEach(l => logs.push({ ...l, devotee: d.name }));
    });
    return logs.length > 0 ? logs : MOCK_LOGS;
  }, []);

  const totalComms = allLogs.length;
  const deliveredCount = allLogs.filter(l => l.status === "Delivered" || l.status === "Sent").length;
  const deliveryRate = totalComms > 0 ? ((deliveredCount / totalComms) * 100).toFixed(0) : "0";
  const uniqueDevotees = new Set(allLogs.map(l => l.devotee)).size;

  // Channel breakdown
  const channelData = useMemo(() => {
    const map = new Map<string, number>();
    allLogs.forEach(l => map.set(l.channel, (map.get(l.channel) || 0) + 1));
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [allLogs]);

  // Status breakdown
  const statusData = useMemo(() => {
    const map = new Map<string, number>();
    allLogs.forEach(l => map.set(l.status, (map.get(l.status) || 0) + 1));
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [allLogs]);

  // Monthly trend
  const monthlyTrend = useMemo(() => {
    const map = new Map<string, number>();
    allLogs.forEach(l => {
      if (l.date) {
        const month = l.date.substring(0, 7);
        map.set(month, (map.get(month) || 0) + 1);
      }
    });
    return Array.from(map.entries()).map(([month, count]) => ({ month, count })).sort((a, b) => a.month.localeCompare(b.month));
  }, [allLogs]);

  // Subject/topic breakdown
  const subjectData = useMemo(() => {
    const map = new Map<string, number>();
    allLogs.forEach(l => {
      const topic = l.subject || "General";
      map.set(topic, (map.get(topic) || 0) + 1);
    });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 8);
  }, [allLogs]);

  // Experience posts aggregation
  const totalExperiences = useMemo(() => {
    return devoteesData.reduce((s, d) => s + (d.experiencePosts?.length || 0), 0);
  }, []);

  const avgRating = useMemo(() => {
    let total = 0, count = 0;
    devoteesData.forEach(d => d.experiencePosts?.forEach(p => { total += p.rating; count++; }));
    return count > 0 ? (total / count).toFixed(1) : "N/A";
  }, []);

  const handleExport = () => {
    const csv = ["Date,Devotee,Channel,Subject,Status", ...allLogs.map(l => `${l.date},"${l.devotee}","${l.channel}","${l.subject}","${l.status}"`)].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = `communication-report-${new Date().toISOString().split("T")[0]}.csv`; a.click(); URL.revokeObjectURL(url);
    toast.success("Communication report exported");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Communication Reports</h1>
          <p className="text-sm text-muted-foreground mt-1">Outreach analytics, delivery metrics, channel performance & engagement</p>
        </div>
        <div className="flex gap-2">
          <PeriodFilter value={period} onChange={setPeriod} />
          <Button variant="outline" onClick={handleExport} className="gap-2"><Download className="h-4 w-4" />Export</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: "Total Messages", value: totalComms, icon: Megaphone, color: "text-blue-600" },
          { label: "Delivery Rate", value: `${deliveryRate}%`, icon: TrendingUp, color: "text-green-600" },
          { label: "Devotees Reached", value: uniqueDevotees, icon: Users, color: "text-purple-600" },
          { label: "Experience Posts", value: totalExperiences, icon: MessageSquare, color: "text-amber-600" },
          { label: "Avg Rating", value: `⭐ ${avgRating}`, icon: Globe, color: "text-teal-600" },
        ].map(kpi => (
          <Card key={kpi.label}><CardContent className="p-4"><div className="flex items-center gap-2 mb-1"><kpi.icon className={`h-4 w-4 ${kpi.color}`} /><span className="text-xs text-muted-foreground">{kpi.label}</span></div><p className="text-xl font-bold">{kpi.value}</p></CardContent></Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Channel Breakdown */}
        <Card><CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><Mail className="h-4 w-4" />Channel Distribution<Badge variant="secondary" className="ml-auto text-[10px] font-normal">Pie Chart</Badge></CardTitle></CardHeader><CardContent>
          {channelData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}><PieChart><Pie data={channelData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>{channelData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer>
          ) : <p className="text-sm text-muted-foreground py-8 text-center">No data</p>}
        </CardContent></Card>

        {/* Status Breakdown */}
        <Card><CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2">Delivery Status<Badge variant="secondary" className="ml-auto text-[10px] font-normal">Bar Chart</Badge></CardTitle></CardHeader><CardContent>
          {statusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}><BarChart data={statusData}><CartesianGrid strokeDasharray="3 3" stroke="hsl(0,0%,90%)" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="value" fill="hsl(217,91%,60%)" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer>
          ) : <p className="text-sm text-muted-foreground py-8 text-center">No data</p>}
        </CardContent></Card>
      </div>

      {/* Monthly Trend */}
      {monthlyTrend.length > 0 && (
        <Card><CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2">Monthly Communication Volume<Badge variant="secondary" className="ml-auto text-[10px] font-normal">Line Chart</Badge></CardTitle></CardHeader><CardContent>
          <ResponsiveContainer width="100%" height={250}><LineChart data={monthlyTrend}><CartesianGrid strokeDasharray="3 3" stroke="hsl(0,0%,90%)" /><XAxis dataKey="month" tick={{ fontSize: 10 }} /><YAxis /><Tooltip /><Line type="monotone" dataKey="count" stroke="hsl(217,91%,60%)" strokeWidth={2} dot={{ r: 4 }} /></LineChart></ResponsiveContainer>
        </CardContent></Card>
      )}

      {/* Subject Topics */}
      {subjectData.length > 0 && (
        <Card><CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2">Top Communication Topics<Badge variant="secondary" className="ml-auto text-[10px] font-normal">Horizontal Bar Chart</Badge></CardTitle></CardHeader><CardContent>
          <ResponsiveContainer width="100%" height={250}><BarChart data={subjectData} layout="vertical"><CartesianGrid strokeDasharray="3 3" stroke="hsl(0,0%,90%)" /><XAxis type="number" /><YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 10 }} /><Tooltip /><Bar dataKey="value" fill="hsl(45,90%,45%)" radius={[0,4,4,0]} /></BarChart></ResponsiveContainer>
        </CardContent></Card>
      )}
    </div>
  );
};

export default CommunicationReports;
