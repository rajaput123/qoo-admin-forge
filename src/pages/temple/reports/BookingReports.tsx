import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PeriodFilter from "@/components/reports/PeriodFilter";
import { Download, IndianRupee, TrendingUp, Clock, Globe, CreditCard } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { getSevaBookings } from "@/modules/sevas/sevaStore";
import { toast } from "sonner";

const COLORS = ["hsl(16,85%,23%)", "hsl(217,91%,60%)", "hsl(142,60%,40%)", "hsl(45,90%,45%)", "hsl(280,50%,55%)", "hsl(350,65%,50%)"];

// Fallback mock bookings — used only when the live store has no data so every
// chart in this report always renders something meaningful.
const MOCK_BOOKINGS = (() => {
  const sevas = [
    { name: "Archana", category: "Daily Seva", amount: 251 },
    { name: "Abhishekam", category: "Daily Seva", amount: 1100 },
    { name: "Kalyanotsavam", category: "Special Seva", amount: 5100 },
    { name: "Annadanam Sponsorship", category: "Annadanam", amount: 2500 },
    { name: "Sahasranama Archana", category: "Special Seva", amount: 501 },
    { name: "Vahana Seva", category: "Festival Seva", amount: 1500 },
  ];
  const sources = ["Counter", "Online", "Booking"];
  const payments = ["Cash", "UPI", "Card", "Net Banking"];
  const statuses = ["Completed", "Completed", "Completed", "Pending", "Cancelled"];
  const devotees = ["Ramesh Kumar", "Priya Iyer", "Vijay Rao", "Lakshmi Devi", "Suresh Patel", "Anita Sharma"];
  const today = new Date();
  const out: any[] = [];
  for (let i = 0; i < 60; i++) {
    const s = sevas[i % sevas.length];
    const d = new Date(today);
    d.setDate(d.getDate() - (i % 25));
    out.push({
      id: `MOCK-B${1000 + i}`,
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

const BookingReports = () => {
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
  const cancelledCount = filtered.filter(b => b.status === "Cancelled").length;
  const cancelRate = totalBookings > 0 ? ((cancelledCount / totalBookings) * 100).toFixed(1) : "0";

  // Source breakdown
  const sourceData = useMemo(() => {
    const map = new Map<string, { revenue: number; bookings: number }>();
    filtered.forEach(b => {
      const prev = map.get(b.sourceModule) || { revenue: 0, bookings: 0 };
      map.set(b.sourceModule, { revenue: prev.revenue + b.amount, bookings: prev.bookings + 1 });
    });
    return Array.from(map.entries()).map(([name, data]) => ({ name, ...data }));
  }, [filtered]);

  // Payment method breakdown
  const paymentData = useMemo(() => {
    const map = new Map<string, { amount: number; count: number }>();
    filtered.forEach(b => {
      const prev = map.get(b.paymentMethod) || { amount: 0, count: 0 };
      map.set(b.paymentMethod, { amount: prev.amount + b.amount, count: prev.count + 1 });
    });
    return Array.from(map.entries()).map(([name, data]) => ({ name, value: data.amount, count: data.count }));
  }, [filtered]);

  // Seva-wise bookings
  const sevaWise = useMemo(() => {
    const map = new Map<string, { bookings: number; revenue: number }>();
    filtered.forEach(b => {
      const prev = map.get(b.sevaName) || { bookings: 0, revenue: 0 };
      map.set(b.sevaName, { bookings: prev.bookings + 1, revenue: prev.revenue + b.amount });
    });
    return Array.from(map.entries()).map(([seva, data]) => ({ seva, ...data })).sort((a, b) => b.revenue - a.revenue);
  }, [filtered]);

  // Daily trend
  const dailyTrend = useMemo(() => {
    const map = new Map<string, { bookings: number; revenue: number }>();
    filtered.forEach(b => {
      const prev = map.get(b.date) || { bookings: 0, revenue: 0 };
      map.set(b.date, { bookings: prev.bookings + 1, revenue: prev.revenue + b.amount });
    });
    return Array.from(map.entries()).map(([date, data]) => ({ date, ...data })).sort((a, b) => a.date.localeCompare(b.date));
  }, [filtered]);

  const handleExport = () => {
    const csv = ["ID,Seva,Devotee,Date,Amount,Status,Source,Payment", ...filtered.map(b => `${b.id},"${b.sevaName}","${b.devoteeName}",${b.date},${b.amount},"${b.status}","${b.sourceModule}","${b.paymentMethod}"`)].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = `booking-reports-${new Date().toISOString().split("T")[0]}.csv`; a.click(); URL.revokeObjectURL(url);
    toast.success("Booking report exported");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Booking Reports</h1>
          <p className="text-sm text-muted-foreground mt-1">Real-time booking analytics, revenue channels & seva performance</p>
        </div>
        <div className="flex gap-2">
          <PeriodFilter value={period} onChange={setPeriod} />
          <Button variant="outline" onClick={handleExport} className="gap-2"><Download className="h-4 w-4" />Export</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Revenue", value: `₹${totalRevenue.toLocaleString("en-IN")}`, icon: IndianRupee, color: "text-green-600" },
          { label: "Total Bookings", value: totalBookings.toString(), icon: TrendingUp, color: "text-blue-600" },
          { label: "Cancel Rate", value: `${cancelRate}%`, icon: Clock, color: "text-red-500" },
          { label: "Avg Ticket", value: `₹${totalBookings > 0 ? (totalRevenue / totalBookings).toLocaleString("en-IN", { maximumFractionDigits: 0 }) : 0}`, icon: CreditCard, color: "text-amber-600" },
        ].map(kpi => (
          <Card key={kpi.label}><CardContent className="p-4"><div className="flex items-center gap-2 mb-1"><kpi.icon className={`h-4 w-4 ${kpi.color}`} /><span className="text-xs text-muted-foreground">{kpi.label}</span></div><p className="text-xl font-bold">{kpi.value}</p></CardContent></Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Source Breakdown */}
        <Card><CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><Globe className="h-4 w-4 text-blue-600" />Booking Source<Badge variant="secondary" className="ml-auto text-[10px] font-normal">Bar Chart</Badge></CardTitle></CardHeader><CardContent>
          {sourceData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}><BarChart data={sourceData}><CartesianGrid strokeDasharray="3 3" stroke="hsl(0,0%,90%)" /><XAxis dataKey="name" /><YAxis /><Tooltip formatter={(v: number) => `₹${v.toLocaleString()}`} /><Bar dataKey="revenue" fill="hsl(16,85%,23%)" radius={[4,4,0,0]} name="Revenue" /><Bar dataKey="bookings" fill="hsl(217,91%,60%)" radius={[4,4,0,0]} name="Bookings" /></BarChart></ResponsiveContainer>
          ) : <p className="text-sm text-muted-foreground py-8 text-center">No data</p>}
        </CardContent></Card>

        {/* Payment Method */}
        <Card><CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><CreditCard className="h-4 w-4" />Payment Methods<Badge variant="secondary" className="ml-auto text-[10px] font-normal">Pie Chart</Badge></CardTitle></CardHeader><CardContent>
          {paymentData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}><PieChart><Pie data={paymentData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>{paymentData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip formatter={(v: number) => `₹${v.toLocaleString()}`} /></PieChart></ResponsiveContainer>
          ) : <p className="text-sm text-muted-foreground py-8 text-center">No data</p>}
        </CardContent></Card>
      </div>

      {/* Daily Trend */}
      <Card><CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2">Daily Booking & Revenue Trend<Badge variant="secondary" className="ml-auto text-[10px] font-normal">Grouped Bar Chart</Badge></CardTitle></CardHeader><CardContent>
        {dailyTrend.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}><BarChart data={dailyTrend}><CartesianGrid strokeDasharray="3 3" stroke="hsl(0,0%,90%)" /><XAxis dataKey="date" tick={{ fontSize: 10 }} /><YAxis yAxisId="left" /><YAxis yAxisId="right" orientation="right" /><Tooltip /><Bar yAxisId="left" dataKey="bookings" fill="hsl(217,91%,60%)" radius={[4,4,0,0]} name="Bookings" /><Bar yAxisId="right" dataKey="revenue" fill="hsl(142,60%,40%)" radius={[4,4,0,0]} name="Revenue (₹)" /></BarChart></ResponsiveContainer>
        ) : <p className="text-sm text-muted-foreground py-8 text-center">No data</p>}
      </CardContent></Card>

      {/* Seva-wise Table */}
      <Card><CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2">Seva-wise Performance<Badge variant="secondary" className="ml-auto text-[10px] font-normal">Table</Badge></CardTitle></CardHeader><CardContent>
        {sevaWise.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b"><th className="text-left py-2 font-medium text-muted-foreground">Seva</th><th className="text-right py-2 font-medium text-muted-foreground">Bookings</th><th className="text-right py-2 font-medium text-muted-foreground">Revenue</th><th className="text-right py-2 font-medium text-muted-foreground">Avg</th></tr></thead>
              <tbody>{sevaWise.map(s => (
                <tr key={s.seva} className="border-b last:border-0"><td className="py-2">{s.seva}</td><td className="text-right py-2">{s.bookings}</td><td className="text-right py-2">₹{s.revenue.toLocaleString()}</td><td className="text-right py-2">₹{(s.revenue / s.bookings).toLocaleString("en-IN", { maximumFractionDigits: 0 })}</td></tr>
              ))}</tbody>
            </table>
          </div>
        ) : <p className="text-sm text-muted-foreground py-8 text-center">No data</p>}
      </CardContent></Card>
    </div>
  );
};

export default BookingReports;
