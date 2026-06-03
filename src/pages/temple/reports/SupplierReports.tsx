import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import PeriodFilter from "@/components/reports/PeriodFilter";
import { Download, Truck, IndianRupee, Star, AlertCircle, CheckCircle2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { toast } from "sonner";

const COLORS = ["hsl(16,85%,23%)", "hsl(217,91%,60%)", "hsl(142,60%,40%)", "hsl(45,90%,45%)", "hsl(280,50%,55%)", "hsl(350,65%,50%)", "hsl(190,60%,45%)"];

const monthlyProcurement = [
  { month: "Sep", amount: 320000 }, { month: "Oct", amount: 380000 },
  { month: "Nov", amount: 290000 }, { month: "Dec", amount: 520000 },
  { month: "Jan", amount: 410000 }, { month: "Feb", amount: 485000 },
];
const categorySpend = [
  { name: "Flowers", value: 185000 }, { name: "Grocery", value: 142000 },
  { name: "Pooja Materials", value: 98000 }, { name: "Oil & Ghee", value: 76000 },
  { name: "Decoration", value: 64000 }, { name: "Milk & Dairy", value: 55000 },
  { name: "Others", value: 50000 },
];
const structureWise = [
  { structure: "Main Temple", amount: 295000 }, { structure: "Kitchen", amount: 210000 },
  { structure: "Shrines", amount: 85000 }, { structure: "Event Area", amount: 80000 },
];
const performanceData = [
  { supplier: "Sri Lakshmi Flowers", quality: 4.8, spend: 185000 },
  { supplier: "Annapurna Grocery", quality: 4.5, spend: 142000 },
  { supplier: "Shiva Pooja Stores", quality: 4.7, spend: 98000 },
  { supplier: "Nandi Oil & Ghee", quality: 4.3, spend: 76000 },
  { supplier: "Devi Decorations", quality: 4.6, spend: 64000 },
  { supplier: "Surya Milk Dairy", quality: 4.4, spend: 55000 },
];
const pendingPayments = [
  { supplier: "Sri Lakshmi Flowers", amount: 9000, status: "Pending" },
  { supplier: "Annapurna Grocery", amount: 3500, status: "Partially Paid" },
  { supplier: "Surya Milk Dairy", amount: 3000, status: "Overdue" },
  { supplier: "Nandi Oil & Ghee", amount: 17250, status: "Pending" },
];

const totalProcurement = monthlyProcurement.reduce((s, m) => s + m.amount, 0);
const totalSuppliers = performanceData.length;
const avgQuality = (performanceData.reduce((s, p) => s + p.quality, 0) / performanceData.length).toFixed(1);
const totalPending = pendingPayments.reduce((s, p) => s + p.amount, 0);

const SupplierReports = () => {
  const [period, setPeriod] = useState("month");

  const handleExport = () => {
    const csv = ["Supplier,Quality,Spend", ...performanceData.map(p => `"${p.supplier}",${p.quality},${p.spend}`)].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = `supplier-report-${new Date().toISOString().split("T")[0]}.csv`; a.click(); URL.revokeObjectURL(url);
    toast.success("Supplier report exported");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Supplier Reports</h1>
          <p className="text-sm text-muted-foreground mt-1">Procurement analytics, supplier performance, category spend & payment tracking</p>
        </div>
        <div className="flex gap-2">
          <PeriodFilter value={period} onChange={setPeriod} />
          <Button variant="outline" onClick={handleExport} className="gap-2"><Download className="h-4 w-4" />Export</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: "Total Procurement", value: `₹${(totalProcurement / 100000).toFixed(1)}L`, icon: IndianRupee, color: "text-green-600" },
          { label: "Active Suppliers", value: totalSuppliers, icon: Truck, color: "text-blue-600" },
          { label: "Avg Quality", value: `⭐ ${avgQuality}`, icon: Star, color: "text-amber-600" },
          { label: "On-Time Delivery", value: "93%", icon: CheckCircle2, color: "text-teal-600" },
          { label: "Pending Payments", value: `₹${(totalPending / 1000).toFixed(0)}K`, icon: AlertCircle, color: "text-red-500" },
        ].map(kpi => (
          <Card key={kpi.label}><CardContent className="p-4"><div className="flex items-center gap-2 mb-1"><kpi.icon className={`h-4 w-4 ${kpi.color}`} /><span className="text-xs text-muted-foreground">{kpi.label}</span></div><p className="text-xl font-bold">{kpi.value}</p></CardContent></Card>
        ))}
      </div>

      {/* Procurement Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card><CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2">Monthly Procurement Trend<Badge variant="secondary" className="ml-auto text-[10px] font-normal">Bar Chart</Badge></CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={monthlyProcurement}><CartesianGrid strokeDasharray="3 3" stroke="hsl(0,0%,90%)" /><XAxis dataKey="month" /><YAxis tick={{ fontSize: 11 }} /><Tooltip formatter={(v: number) => `₹${v.toLocaleString()}`} /><Bar dataKey="amount" fill="hsl(16,85%,23%)" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2">Structure-wise Procurement<Badge variant="secondary" className="ml-auto text-[10px] font-normal">Horizontal Bar Chart</Badge></CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={structureWise} layout="vertical"><CartesianGrid strokeDasharray="3 3" stroke="hsl(0,0%,90%)" /><XAxis type="number" tick={{ fontSize: 11 }} /><YAxis dataKey="structure" type="category" tick={{ fontSize: 11 }} width={100} /><Tooltip formatter={(v: number) => `₹${v.toLocaleString()}`} /><Bar dataKey="amount" fill="hsl(217,91%,60%)" radius={[0,4,4,0]} /></BarChart></ResponsiveContainer></CardContent></Card>
      </div>

      {/* Category Spend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card><CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2">Category-wise Spend<Badge variant="secondary" className="ml-auto text-[10px] font-normal">Pie Chart</Badge></CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={300}><PieChart><Pie data={categorySpend} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>{categorySpend.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip formatter={(v: number) => `₹${v.toLocaleString()}`} /></PieChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2">Category Breakdown<Badge variant="secondary" className="ml-auto text-[10px] font-normal">Progress List</Badge></CardTitle></CardHeader><CardContent className="space-y-3">{categorySpend.map((c, i) => (<div key={c.name}><div className="flex items-center justify-between mb-1"><div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} /><span className="text-sm">{c.name}</span></div><span className="text-sm font-semibold">₹{c.value.toLocaleString()}</span></div><Progress value={(c.value / categorySpend[0].value) * 100} className="h-2" /></div>))}</CardContent></Card>
      </div>

      {/* Supplier Spend Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card><CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2">Supplier Spend Comparison<Badge variant="secondary" className="ml-auto text-[10px] font-normal">Bar Chart</Badge></CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><BarChart data={performanceData.map(p => ({ name: p.supplier.split(" ")[0], spend: p.spend }))}><CartesianGrid strokeDasharray="3 3" stroke="hsl(0,0%,90%)" /><XAxis dataKey="name" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip formatter={(v: number) => `₹${v.toLocaleString()}`} /><Bar dataKey="spend" fill="hsl(142,60%,40%)" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-base">Pending Payment Summary</CardTitle></CardHeader><CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-amber-600">₹{totalPending.toLocaleString()}</p><p className="text-xs text-muted-foreground">Total Pending</p></CardContent></Card>
            <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-red-500">{pendingPayments.filter(p => p.status === "Overdue").length}</p><p className="text-xs text-muted-foreground">Overdue</p></CardContent></Card>
            <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-blue-600">{pendingPayments.length}</p><p className="text-xs text-muted-foreground">Pending Invoices</p></CardContent></Card>
          </div>
        </CardContent></Card>
      </div>
    </div>
  );
};

export default SupplierReports;
