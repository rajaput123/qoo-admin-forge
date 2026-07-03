import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Filter, GitBranch } from "lucide-react";
import { Input } from "@/components/ui/input";
import PeriodFilter from "@/components/reports/PeriodFilter";
import { toast } from "sonner";

const tabs = [
  { key: "branches", label: "Branch Performance", columns: ["Branch Name", "Location", "Revenue", "Devotees", "Staff", "Rating", "Status"], rows: [
    ["Main Temple", "Bangalore", "₹18,50,000", "5,200", "45", "4.8", "Active"],
    ["North Branch", "Mysore", "₹8,20,000", "2,100", "18", "4.5", "Active"],
    ["East Branch", "Mandya", "₹5,60,000", "1,400", "12", "4.3", "Active"],
    ["West Branch", "Hassan", "₹4,80,000", "1,100", "10", "4.6", "Active"],
  ]},
  { key: "comparison", label: "Revenue Comparison", columns: ["Branch", "Donations", "Sevas", "Events", "Prasadam", "Total", "Growth"], rows: [
    ["Main Temple", "₹8,50,000", "₹5,20,000", "₹3,00,000", "₹1,80,000", "₹18,50,000", "+12%"],
    ["North Branch", "₹3,50,000", "₹2,80,000", "₹1,20,000", "₹70,000", "₹8,20,000", "+8%"],
    ["East Branch", "₹2,40,000", "₹1,80,000", "₹80,000", "₹60,000", "₹5,60,000", "+5%"],
    ["West Branch", "₹2,00,000", "₹1,50,000", "₹90,000", "₹40,000", "₹4,80,000", "+3%"],
  ]},
];

const renderStatusBadge = (cell: string) => {
  if (["Active"].includes(cell)) return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">{cell}</Badge>;
  if (["Inactive"].includes(cell)) return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">{cell}</Badge>;
  return cell;
};

const BranchTables = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [period, setPeriod] = useState("month");
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "branches";
  const tab = tabs.find(t => t.key === activeTab) || tabs[0];
  const filtered = tab.rows.filter(r => !searchTerm || r.some(c => c.toLowerCase().includes(searchTerm.toLowerCase())));

  const handleExport = () => {
    const csv = [tab.columns.join(","), ...filtered.map(r => r.map(c => `"${c}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" }); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = `${tab.key}.csv`; a.click(); URL.revokeObjectURL(url);
    toast.success(`${tab.label} exported`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between"><div className="flex items-center gap-2"><GitBranch className="h-5 w-5 text-primary" /><div><h1 className="text-2xl font-bold text-foreground">{tab.label}</h1><p className="text-sm text-muted-foreground">Branch data records</p></div></div><PeriodFilter value={period} onChange={setPeriod} /></div>
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

export default BranchTables;
