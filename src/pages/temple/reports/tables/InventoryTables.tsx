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
  { key: "stock", label: "Stock Register", columns: ["Item", "Category", "Stock", "Unit", "Last Purchase", "Value", "Status"], rows: [
    ["Ghee", "Pooja Items", "120", "Kg", "2024-03-10", "₹48,000", "Sufficient"],
    ["Flowers", "Daily", "50", "Kg", "2024-03-15", "₹15,000", "Low"],
    ["Incense Sticks", "Pooja Items", "500", "Packets", "2024-03-08", "₹25,000", "Sufficient"],
    ["Rice", "Kitchen", "200", "Kg", "2024-03-12", "₹12,000", "Sufficient"],
    ["Coconuts", "Pooja Items", "300", "Nos", "2024-03-14", "₹9,000", "Sufficient"],
    ["Camphor", "Pooja Items", "80", "Packets", "2024-03-11", "₹4,000", "Sufficient"],
    ["Sandalwood Paste", "Pooja Items", "15", "Kg", "2024-03-09", "₹22,500", "Low"],
  ]},
  { key: "purchases", label: "Purchase Orders", columns: ["PO #", "Supplier", "Items", "Amount", "Order Date", "Delivery", "Status"], rows: [
    ["PO-0145", "Sri Lakshmi Stores", "Flowers, Garlands", "₹12,000", "2024-03-14", "2024-03-15", "Delivered"],
    ["PO-0144", "Annapurna Foods", "Rice, Dal, Spices", "₹28,000", "2024-03-12", "2024-03-13", "Delivered"],
    ["PO-0143", "Ganesh Electricals", "Bulbs, Wiring", "₹8,500", "2024-03-10", "2024-03-12", "Delivered"],
    ["PO-0146", "Fresh Farms", "Flowers", "₹6,000", "2024-03-15", "2024-03-16", "Pending"],
  ]},
  { key: "consumption", label: "Consumption Log", columns: ["Item", "Date", "Quantity Used", "Purpose", "Department", "Approved By", "Status"], rows: [
    ["Ghee", "2024-03-15", "5 Kg", "Abhishekam", "Pooja", "Head Priest", "Consumed"],
    ["Flowers", "2024-03-15", "10 Kg", "Daily Pooja", "Pooja", "Head Priest", "Consumed"],
    ["Rice", "2024-03-15", "25 Kg", "Annadanam", "Kitchen", "Head Cook", "Consumed"],
    ["Camphor", "2024-03-15", "3 Packets", "Aarti", "Pooja", "Priest", "Consumed"],
  ]},
];

const renderStatusBadge = (cell: string) => {
  if (["Sufficient", "Delivered", "Consumed"].includes(cell)) return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">{cell}</Badge>;
  if (["Pending"].includes(cell)) return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">{cell}</Badge>;
  if (["Low", "Out of Stock"].includes(cell)) return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">{cell}</Badge>;
  return cell;
};

const InventoryTables = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [period, setPeriod] = useState("month");
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "stock";
  const tab = tabs.find(t => t.key === activeTab) || tabs[0];
  const filtered = tab.rows.filter(r => !searchTerm || r.some(c => c.toLowerCase().includes(searchTerm.toLowerCase())));

  const handleExport = () => {
    const csv = [tab.columns.join(","), ...filtered.map(r => r.map(c => `"${c}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" }); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = `${tab.key}.csv`; a.click(); URL.revokeObjectURL(url);
    toast.success(`${tab.label} exported`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between"><div className="flex items-center gap-2"><BarChart3 className="h-5 w-5 text-primary" /><div><h1 className="text-2xl font-bold text-foreground">{tab.label}</h1><p className="text-sm text-muted-foreground">Inventory data records</p></div></div><PeriodFilter value={period} onChange={setPeriod} /></div>
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

export default InventoryTables;
