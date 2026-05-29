import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import PeriodFilter from "@/components/reports/PeriodFilter";
import { Download, Package, AlertTriangle, TrendingUp, IndianRupee, BarChart3 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { stockItems } from "@/data/inventoryData";
import { toast } from "sonner";

const COLORS = ["hsl(142,60%,40%)", "hsl(217,91%,60%)", "hsl(45,90%,45%)", "hsl(350,65%,50%)", "hsl(280,50%,55%)", "hsl(16,85%,23%)", "hsl(190,60%,45%)"];

const InventoryReports = () => {
  const [period, setPeriod] = useState("month");

  const totalItems = stockItems.length;
  const inStock = stockItems.filter(i => i.status === "In Stock").length;
  const lowStock = stockItems.filter(i => i.status === "Low Stock").length;
  const outOfStock = stockItems.filter(i => i.status === "Out of Stock").length;
  const totalValue = stockItems.reduce((s, i) => s + i.currentStock * i.pricePerUnit, 0);
  const ritualItems = stockItems.filter(i => i.ritualUse).length;

  const categoryData = useMemo(() => {
    const map = new Map<string, { count: number; value: number }>();
    stockItems.forEach(i => {
      const prev = map.get(i.category) || { count: 0, value: 0 };
      map.set(i.category, { count: prev.count + 1, value: prev.value + i.currentStock * i.pricePerUnit });
    });
    return Array.from(map.entries()).map(([name, d]) => ({ name, ...d })).sort((a, b) => b.value - a.value);
  }, []);

  const statusData = [
    { name: "In Stock", value: inStock },
    { name: "Low Stock", value: lowStock },
    { name: "Out of Stock", value: outOfStock },
  ].filter(s => s.value > 0);

  const typeData = useMemo(() => {
    const map = new Map<string, number>();
    stockItems.forEach(i => map.set(i.itemType, (map.get(i.itemType) || 0) + 1));
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, []);

  const locationData = useMemo(() => {
    const map = new Map<string, number>();
    stockItems.forEach(i => {
      const loc = i.defaultStructure || "Unassigned";
      map.set(loc, (map.get(loc) || 0) + i.currentStock * i.pricePerUnit);
    });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, []);

  const consumptionTrend = [
    { month: "Oct", consumption: 280000, restocked: 310000 },
    { month: "Nov", consumption: 245000, restocked: 260000 },
    { month: "Dec", consumption: 420000, restocked: 450000 },
    { month: "Jan", consumption: 310000, restocked: 340000 },
    { month: "Feb", consumption: 295000, restocked: 320000 },
    { month: "Mar", consumption: 330000, restocked: 350000 },
  ];

  const handleExport = () => {
    const csv = ["Item,Code,Category,Type,Stock,Unit,Reorder Level,Status,Value,Supplier",
      ...stockItems.map(i => `"${i.name}",${i.code},"${i.category}","${i.itemType}",${i.currentStock},"${i.unit}",${i.reorderLevel},"${i.status}",${i.currentStock * i.pricePerUnit},"${i.supplier}"`)
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = `inventory-report-${new Date().toISOString().split("T")[0]}.csv`; a.click(); URL.revokeObjectURL(url);
    toast.success("Inventory report exported");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Inventory Reports</h1>
          <p className="text-sm text-muted-foreground mt-1">Stock analytics, category breakdown, consumption trends & alerts</p>
        </div>
        <div className="flex gap-2">
          <PeriodFilter value={period} onChange={setPeriod} />
          <Button variant="outline" onClick={handleExport} className="gap-2"><Download className="h-4 w-4" />Export</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {[
          { label: "Total Items", value: totalItems, icon: Package, color: "text-blue-600" },
          { label: "In Stock", value: inStock, icon: TrendingUp, color: "text-green-600" },
          { label: "Low Stock", value: lowStock, icon: AlertTriangle, color: "text-amber-600" },
          { label: "Out of Stock", value: outOfStock, icon: AlertTriangle, color: "text-red-500" },
          { label: "Stock Value", value: `₹${(totalValue / 100000).toFixed(1)}L`, icon: IndianRupee, color: "text-teal-600" },
          { label: "Ritual Items", value: ritualItems, icon: BarChart3, color: "text-purple-600" },
        ].map(kpi => (
          <Card key={kpi.label}><CardContent className="p-4"><div className="flex items-center gap-2 mb-1"><kpi.icon className={`h-4 w-4 ${kpi.color}`} /><span className="text-xs text-muted-foreground">{kpi.label}</span></div><p className="text-xl font-bold">{kpi.value}</p></CardContent></Card>
        ))}
      </div>

      {/* Overview Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card><CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2">Category-wise Stock Value<Badge variant="secondary" className="ml-auto text-[10px] font-normal">Bar Chart</Badge></CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><BarChart data={categoryData}><CartesianGrid strokeDasharray="3 3" stroke="hsl(0,0%,90%)" /><XAxis dataKey="name" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip formatter={(v: number) => `₹${v.toLocaleString()}`} /><Bar dataKey="value" fill="hsl(16,85%,23%)" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2">Stock Status Distribution<Badge variant="secondary" className="ml-auto text-[10px] font-normal">Pie Chart</Badge></CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={280}><PieChart><Pie data={statusData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>{statusData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card><CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2">Items by Type<Badge variant="secondary" className="ml-auto text-[10px] font-normal">Donut Chart</Badge></CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><PieChart><Pie data={typeData} cx="50%" cy="50%" innerRadius={50} outerRadius={85} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>{typeData.map((_, i) => <Cell key={i} fill={COLORS[(i + 2) % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2">Stock Value by Location<Badge variant="secondary" className="ml-auto text-[10px] font-normal">Horizontal Bar Chart</Badge></CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><BarChart data={locationData} layout="vertical"><CartesianGrid strokeDasharray="3 3" stroke="hsl(0,0%,90%)" /><XAxis type="number" tick={{ fontSize: 11 }} /><YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={100} /><Tooltip formatter={(v: number) => `₹${v.toLocaleString()}`} /><Bar dataKey="value" fill="hsl(217,91%,60%)" radius={[0,4,4,0]} /></BarChart></ResponsiveContainer></CardContent></Card>
      </div>

      {/* Consumption Trends */}
      <Card><CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2">Monthly Consumption vs Restocking<Badge variant="secondary" className="ml-auto text-[10px] font-normal">Grouped Bar Chart</Badge></CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={300}><BarChart data={consumptionTrend}><CartesianGrid strokeDasharray="3 3" stroke="hsl(0,0%,90%)" /><XAxis dataKey="month" /><YAxis tick={{ fontSize: 11 }} /><Tooltip formatter={(v: number) => `₹${v.toLocaleString()}`} /><Bar dataKey="consumption" fill="hsl(350,65%,50%)" name="Consumed" radius={[4,4,0,0]} /><Bar dataKey="restocked" fill="hsl(142,60%,40%)" name="Restocked" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></CardContent></Card>

      <Card><CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2">Net Stock Movement<Badge variant="secondary" className="ml-auto text-[10px] font-normal">Line Chart</Badge></CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={250}><LineChart data={consumptionTrend.map(c => ({ ...c, net: c.restocked - c.consumption }))}><CartesianGrid strokeDasharray="3 3" stroke="hsl(0,0%,90%)" /><XAxis dataKey="month" /><YAxis tick={{ fontSize: 11 }} /><Tooltip formatter={(v: number) => `₹${v.toLocaleString()}`} /><Line type="monotone" dataKey="net" stroke="hsl(217,91%,60%)" strokeWidth={2} dot={{ r: 4 }} name="Net Movement" /></LineChart></ResponsiveContainer></CardContent></Card>
    </div>
  );
};

export default InventoryReports;
