import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import PeriodFilter from "@/components/reports/PeriodFilter";
import { Download, Heart, TrendingUp, Users, IndianRupee } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { useDonations, useDonors, useAllocations } from "@/modules/donations/hooks";
import { toast } from "sonner";

const COLORS = ["hsl(16, 85%, 23%)", "hsl(217, 91%, 60%)", "hsl(142, 60%, 40%)", "hsl(45, 90%, 45%)", "hsl(280, 50%, 55%)", "hsl(350, 65%, 50%)"];

const DonationReports = () => {
  const donations = useDonations();
  const donors = useDonors();
  const allocations = useAllocations();
  const [period, setPeriod] = useState("month");

  const totalAmount = donations.reduce((s, d) => s + d.amount, 0);
  const avgDonation = donations.length > 0 ? totalAmount / donations.length : 0;
  const uniqueDonors = new Set(donations.map(d => d.donorId)).size;

  const purposeData = useMemo(() => {
    const map = new Map<string, number>();
    donations.forEach(d => map.set(d.purpose, (map.get(d.purpose) || 0) + d.amount));
    return Array.from(map.entries()).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [donations]);

  const channelData = useMemo(() => {
    const map = new Map<string, number>();
    donations.forEach(d => map.set(d.channel, (map.get(d.channel) || 0) + d.amount));
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [donations]);

  const monthlyTrend = useMemo(() => {
    const map = new Map<string, number>();
    donations.forEach(d => {
      const month = d.date.substring(0, 7);
      map.set(month, (map.get(month) || 0) + d.amount);
    });
    return Array.from(map.entries()).map(([month, amount]) => ({ month, amount })).sort((a, b) => a.month.localeCompare(b.month));
  }, [donations]);

  const handleExport = () => {
    const csv = ["Date,Donor,Amount,Purpose,Channel,Receipt", ...donations.map(d => `${d.date},"${d.donorName}",${d.amount},"${d.purpose}","${d.channel}",${d.receiptNo || ""}`)].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `donations-report-${new Date().toISOString().split("T")[0]}.csv`; a.click();
    URL.revokeObjectURL(url);
    toast.success("Donation report exported");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Donation Reports</h1>
          <p className="text-sm text-muted-foreground mt-1">Comprehensive donation analytics, fund utilization & donor insights</p>
        </div>
        <div className="flex gap-2">
          <PeriodFilter value={period} onChange={setPeriod} />
          <Button variant="outline" onClick={handleExport} className="gap-2"><Download className="h-4 w-4" />Export</Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Donations", value: `₹${(totalAmount / 100000).toFixed(1)}L`, icon: IndianRupee, color: "text-green-600" },
          { label: "Total Count", value: donations.length.toString(), icon: Heart, color: "text-rose-600" },
          { label: "Unique Donors", value: uniqueDonors.toString(), icon: Users, color: "text-blue-600" },
          { label: "Avg Donation", value: `₹${avgDonation.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`, icon: TrendingUp, color: "text-purple-600" },
        ].map((kpi) => (
          <Card key={kpi.label}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
                <span className="text-xs text-muted-foreground">{kpi.label}</span>
              </div>
              <p className="text-2xl font-bold">{kpi.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2">Purpose-wise Breakdown<Badge variant="secondary" className="ml-auto text-[10px] font-normal">Pie Chart</Badge></CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart><Pie data={purposeData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {purposeData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie><Tooltip formatter={(v: number) => `₹${v.toLocaleString()}`} /></PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2">Channel-wise Revenue<Badge variant="secondary" className="ml-auto text-[10px] font-normal">Bar Chart</Badge></CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={channelData}><CartesianGrid strokeDasharray="3 3" stroke="hsl(0,0%,90%)" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip formatter={(v: number) => `₹${v.toLocaleString()}`} /><Bar dataKey="value" fill="hsl(16,85%,23%)" radius={[4,4,0,0]} /></BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2">Monthly Donation Trend<Badge variant="secondary" className="ml-auto text-[10px] font-normal">Line Chart</Badge></CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthlyTrend}><CartesianGrid strokeDasharray="3 3" stroke="hsl(0,0%,90%)" /><XAxis dataKey="month" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip formatter={(v: number) => `₹${v.toLocaleString()}`} /><Line type="monotone" dataKey="amount" stroke="hsl(217,91%,60%)" strokeWidth={2} dot={{ r: 4 }} /></LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default DonationReports;
