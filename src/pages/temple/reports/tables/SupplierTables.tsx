import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Filter, BarChart3 } from "lucide-react";
import { Input } from "@/components/ui/input";
import PeriodFilter from "@/components/reports/PeriodFilter";
import { toast } from "sonner";

const tabs = [
  { key: "suppliers", label: "Supplier Registry", columns: ["Supplier", "Category", "Orders", "Delivered", "Pending Amount", "Rating", "Status"], rows: [
    ["Sri Lakshmi Stores", "Pooja Items", "24", "22", "₹45,000", "4.5", "Active"],
    ["Fresh Farms", "Flowers", "48", "46", "₹12,000", "4.3", "Active"],
    ["Ganesh Electricals", "Maintenance", "8", "7", "₹28,000", "4.0", "Active"],
    ["Annapurna Foods", "Kitchen", "36", "35", "₹1,20,000", "4.6", "Active"],
  ]},
  { key: "invoices", label: "Invoices", columns: ["Invoice #", "Supplier", "Amount", "Date", "Due Date", "Payment", "Status"], rows: [
    ["INV-2026-020", "Sri Lakshmi Flowers", "₹9,000", "2024-03-10", "2024-03-25", "—", "Pending"],
    ["INV-2026-019", "Annapurna Grocery", "₹3,500", "2024-03-08", "2024-03-22", "₹2,000", "Partially Paid"],
    ["INV-2026-021", "Surya Milk Dairy", "₹3,000", "2024-03-05", "2024-03-12", "—", "Overdue"],
  ]},
  { key: "deliveries", label: "Delivery Log", columns: ["PO #", "Supplier", "Items", "Expected", "Actual", "Quality", "Status"], rows: [
    ["PO-0145", "Sri Lakshmi Stores", "Flowers, Garlands", "2024-03-15", "2024-03-15", "Good", "On Time"],
    ["PO-0144", "Annapurna Foods", "Rice, Dal", "2024-03-13", "2024-03-13", "Excellent", "On Time"],
    ["PO-0143", "Ganesh Electricals", "Bulbs", "2024-03-12", "2024-03-14", "Good", "Delayed"],
  ]},
];

const renderStatusBadge = (cell: string) => {
  if (["Active", "On Time", "Excellent"].includes(cell)) return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">{cell}</Badge>;
  if (["Pending", "Partially Paid", "Good"].includes(cell)) return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">{cell}</Badge>;
  if (["Overdue", "Delayed", "Poor"].includes(cell)) return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">{cell}</Badge>;
  return cell;
};

const SupplierTables = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [period, setPeriod] = useState("month");
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "suppliers";
  const tab = tabs.find(t => t.key === activeTab) || tabs[0];
  const filtered = tab.rows.filter(r => !searchTerm || r.some(c => c.toLowerCase().includes(searchTerm.toLowerCase())));

  const handleExport = () => {
    const csv = [tab.columns.join(","), ...filtered.map(r => r.map(c => `"${c}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" }); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = `${tab.key}.csv`; a.click(); URL.revokeObjectURL(url);
    toast.success(`${tab.label} exported`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between"><div className="flex items-center gap-2"><BarChart3 className="h-5 w-5 text-primary" /><div><h1 className="text-2xl font-bold text-foreground">{tab.label}</h1><p className="text-sm text-muted-foreground">Supplier data records</p></div></div><PeriodFilter value={period} onChange={setPeriod} /></div>
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm"><Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-9" /></div>
        <Badge variant="outline">{filtered.length} of {tab.rows.length}</Badge>
        <Button variant="outline" size="sm" onClick={handleExport} className="gap-2"><Download className="h-4 w-4" />Export</Button>
      </div>
      <Card><CardContent className="p-0"><div className="overflow-x-auto">
        <Table><TableHeader><TableRow>{tab.columns.map(c => <TableHead key={c} className="whitespace-nowrap font-semibold">{c}</TableHead>)}</TableRow></TableHeader>
        <TableBody>{filtered.map((row, i) => <TableRow key={i}>{row.map((cell, j) => <TableCell key={j} className="whitespace-nowrap">{renderStatusBadge(cell)}</TableCell>)}</TableRow>)}</TableBody></Table>
      </div></CardContent></Card>
    </div>
  );
};

export default SupplierTables;
