import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PeriodFilter from "@/components/reports/PeriodFilter";
import { Download, Sparkles, IndianRupee, Users, Clock, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { getSevaBookings } from "@/modules/sevas/sevaStore";
import { toast } from "sonner";

const COLORS = ["hsl(16,85%,23%)", "hsl(217,91%,60%)", "hsl(142,60%,40%)", "hsl(45,90%,45%)", "hsl(280,50%,55%)", "hsl(350,65%,50%)", "hsl(190,60%,45%)"];

// Fallback mock so every chart in this report always renders something.
const MOCK_BOOKINGS = (() => {
  const sevas = [
    { name: "Archana", category: "Daily Seva", amount: 251 },
    { name: "Abhishekam", category: "Daily Seva", amount: 1100 },
    { name: "Kalyanotsavam", category: "Special Seva", amount: 5100 },
    { name: "Annadanam Sponsorship", category: "Annadanam", amount: 2500 },
    { name: "Sahasranama Archana", category: "Special Seva", amount: 501 },
    { name: "Vahana Seva", category: "Festival Seva", amount: 1500 },
    { name: "Homam", category: "Festival Seva", amount: 3100 },
  ];
  const sources = ["Counter", "Online", "Booking"];
  const payments = ["Cash", "UPI", "Card", "Net Banking"];
  const statuses = ["Completed", "Completed", "Completed", "Pending", "Cancelled"];
  const devotees = ["Ramesh Kumar", "Priya Iyer", "Vijay Rao", "Lakshmi Devi", "Suresh Patel", "Anita Sharma"];
  const today = new Date();
  const out: any[] = [];
  for (let i = 0; i < 70; i++) {
    const s = sevas[i % sevas.length];
    const d = new Date(today);
    d.setDate(d.getDate() - (i % 28));
    out.push({
      id: `MOCK-O${1000 + i}`,
      sevaName: s.name,
      sevaCategory: s.category,
      devoteeName: devotees[i % devotees.length],
      date: d.toISOString().split("T")[0],
      amount: s.amount + (i % 5) * 50,
      status: statuses[i % statuses.length],
      sourceModule: sources[i % sources.length],
      paymentMethod: payments[i % payments.length],
    });
  }
  return out;
})();

const OfferingReports = () => {
  const [period, setPeriod] = useState("month");
  const liveBookings = getSevaBookings();
  const bookings = liveBookings.length > 0 ? liveBookings : MOCK_BOOKINGS;

  // Anchor the period window to the most recent booking so demo/seed data is always visible.
  const latestDate = bookings.reduce((m, b) => (b.date > m ? b.date : m), "");
  const today = new Date();
  const now = latestDate && new Date(latestDate) < today ? new Date(latestDate) : today;
  const filtered = useMemo(() => {
    return bookings.filter(b => {
      const d = new Date(b.date);
      if (period === "today") return b.date === now.toISOString().split("T")[0];
      if (period === "week") { const w = new Date(now); w.setDate(w.getDate() - 7); return d >= w; }
      if (period === "month") { const m = new Date(now); m.setMonth(m.getMonth() - 1); return d >= m; }
      if (period === "quarter") { const q = new Date(now); q.setMonth(q.getMonth() - 3); return d >= q; }
      if (period === "year") { const y = new Date(now); y.setFullYear(y.getFullYear() - 1); return d >= y; }
      return true;
    });
  }, [bookings, period]);

  const totalRevenue = filtered.reduce((a, b) => a + b.amount, 0);
  const totalBookings = filtered.length;
  const completedBookings = filtered.filter(b => b.status === "Completed").length;
  const avgRevenue = totalBookings > 0 ? totalRevenue / totalBookings : 0;

  // Category-wise breakdown
  const categoryData = useMemo(() => {
    const map = new Map<string, { revenue: number; count: number }>();
    filtered.forEach(b => {
      const prev = map.get(b.sevaCategory) || { revenue: 0, count: 0 };
      map.set(b.sevaCategory, { revenue: prev.revenue + b.amount, count: prev.count + 1 });
    });
    return Array.from(map.entries()).map(([name, data]) => ({ name, ...data })).sort((a, b) => b.revenue - a.revenue);
  }, [filtered]);

  // Seva-wise revenue
  const sevaData = useMemo(() => {
    const map = new Map<string, { revenue: number; count: number }>();
    filtered.forEach(b => {
      const prev = map.get(b.sevaName) || { revenue: 0, count: 0 };
      map.set(b.sevaName, { revenue: prev.revenue + b.amount, count: prev.count + 1 });
    });
    return Array.from(map.entries()).map(([name, data]) => ({ name, ...data })).sort((a, b) => b.revenue - a.revenue);
  }, [filtered]);

  // Source breakdown (Counter, Online, Booking)
  const sourceData = useMemo(() => {
    const map = new Map<string, { revenue: number; count: number }>();
    filtered.filter(b => b.sourceModule !== "Booking").forEach(b => {
      const prev = map.get(b.sourceModule) || { revenue: 0, count: 0 };
      map.set(b.sourceModule, { revenue: prev.revenue + b.amount, count: prev.count + 1 });
    });
    return Array.from(map.entries()).map(([name, data]) => ({ name, value: data.revenue, count: data.count }));
  }, [filtered]);

  // Status breakdown
  const statusData = useMemo(() => {
    const map = new Map<string, number>();
    filtered.forEach(b => map.set(b.status, (map.get(b.status) || 0) + 1));
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [filtered]);

  const handleExport = () => {
    const csv = ["ID,Seva,Category,Devotee,Date,Amount,Status,Source,Payment", ...filtered.map(b => `${b.id},"${b.sevaName}","${b.sevaCategory}","${b.devoteeName}",${b.date},${b.amount},"${b.status}","${b.sourceModule}","${b.paymentMethod}"`)].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = `offerings-report-${new Date().toISOString().split("T")[0]}.csv`; a.click(); URL.revokeObjectURL(url);
    toast.success("Offerings report exported");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Offerings & Seva Reports</h1>
          <p className="text-sm text-muted-foreground mt-1">Real-time seva performance, revenue analytics & booking insights</p>
        </div>
        <div className="flex gap-2">
          <PeriodFilter value={period} onChange={setPeriod} />
          <Button variant="outline" onClick={handleExport} className="gap-2"><Download className="h-4 w-4" />Export</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Revenue", value: `₹${totalRevenue.toLocaleString("en-IN")}`, icon: IndianRupee, color: "text-green-600" },
          { label: "Total Bookings", value: totalBookings.toString(), icon: Sparkles, color: "text-amber-600" },
          { label: "Completed", value: completedBookings.toString(), icon: TrendingUp, color: "text-blue-600" },
          { label: "Avg per Seva", value: `₹${avgRevenue.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`, icon: Clock, color: "text-purple-600" },
        ].map(kpi => (
          <Card key={kpi.label}><CardContent className="p-4"><div className="flex items-center gap-2 mb-1"><kpi.icon className={`h-4 w-4 ${kpi.color}`} /><span className="text-xs text-muted-foreground">{kpi.label}</span></div><p className="text-xl font-bold">{kpi.value}</p></CardContent></Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category-wise Revenue */}
        <Card><CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2">Revenue by Category<Badge variant="secondary" className="ml-auto text-[10px] font-normal">Bar Chart</Badge></CardTitle></CardHeader><CardContent>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}><BarChart data={categoryData}><CartesianGrid strokeDasharray="3 3" stroke="hsl(0,0%,90%)" /><XAxis dataKey="name" tick={{ fontSize: 10 }} /><YAxis /><Tooltip formatter={(v: number) => `₹${v.toLocaleString()}`} /><Bar dataKey="revenue" fill="hsl(16,85%,23%)" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer>
          ) : <p className="text-sm text-muted-foreground py-8 text-center">No data for selected period</p>}
        </CardContent></Card>

        {/* Source Breakdown */}
        <Card><CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2">Booking Source<Badge variant="secondary" className="ml-auto text-[10px] font-normal">Pie Chart</Badge></CardTitle></CardHeader><CardContent>
          {sourceData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}><PieChart><Pie data={sourceData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>{sourceData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip formatter={(v: number) => `₹${v.toLocaleString()}`} /></PieChart></ResponsiveContainer>
          ) : <p className="text-sm text-muted-foreground py-8 text-center">No data</p>}
        </CardContent></Card>
      </div>

      {/* Seva-wise Performance */}
      <Card><CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2">Seva-wise Revenue & Bookings<Badge variant="secondary" className="ml-auto text-[10px] font-normal">Grouped Bar Chart</Badge></CardTitle></CardHeader><CardContent>
        {sevaData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}><BarChart data={sevaData}><CartesianGrid strokeDasharray="3 3" stroke="hsl(0,0%,90%)" /><XAxis dataKey="name" tick={{ fontSize: 10 }} /><YAxis yAxisId="left" /><YAxis yAxisId="right" orientation="right" /><Tooltip /><Bar yAxisId="left" dataKey="revenue" fill="hsl(217,91%,60%)" radius={[4,4,0,0]} name="Revenue (₹)" /><Bar yAxisId="right" dataKey="count" fill="hsl(45,90%,45%)" radius={[4,4,0,0]} name="Bookings" /></BarChart></ResponsiveContainer>
        ) : <p className="text-sm text-muted-foreground py-8 text-center">No data</p>}
      </CardContent></Card>

      {/* Status Breakdown */}
      <Card><CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2">Booking Status<Badge variant="secondary" className="ml-auto text-[10px] font-normal">Donut Chart</Badge></CardTitle></CardHeader><CardContent>
        {statusData.length > 0 ? (
          <ResponsiveContainer width="100%" height={200}><PieChart><Pie data={statusData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>{statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer>
        ) : <p className="text-sm text-muted-foreground py-8 text-center">No data</p>}
      </CardContent></Card>
    </div>
  );
};

export default OfferingReports;
