import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Filter, Building2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import PeriodFilter from "@/components/reports/PeriodFilter";
import { toast } from "sonner";

const tabs = [
  { key: "institutions", label: "Institution Records", columns: ["Institution", "Type", "Students/Patients", "Revenue", "Expenses", "Compliance", "Status"], rows: [
    ["Vedic School", "Education", "120", "₹8,50,000", "₹6,20,000", "95%", "Active"],
    ["Temple Hospital", "Healthcare", "450", "₹12,00,000", "₹10,80,000", "92%", "Active"],
    ["Goshala", "Cow Shelter", "85 cows", "₹3,50,000", "₹4,20,000", "88%", "Active"],
    ["Annadanam Center", "Food Service", "500/day", "₹5,00,000", "₹4,80,000", "96%", "Active"],
  ]},
  { key: "financials", label: "Financial Summary", columns: ["Institution", "Budget", "Income", "Expenses", "Surplus/Deficit", "Fund Source", "Status"], rows: [
    ["Vedic School", "₹10,00,000", "₹8,50,000", "₹6,20,000", "₹2,30,000", "Donations + Fees", "Surplus"],
    ["Temple Hospital", "₹15,00,000", "₹12,00,000", "₹10,80,000", "₹1,20,000", "Trust Fund", "Surplus"],
    ["Goshala", "₹5,00,000", "₹3,50,000", "₹4,20,000", "-₹70,000", "Donations", "Deficit"],
    ["Annadanam Center", "₹6,00,000", "₹5,00,000", "₹4,80,000", "₹20,000", "Sponsorship", "Surplus"],
  ]},
];

const renderStatusBadge = (cell: string) => {
  if (["Active", "Surplus"].includes(cell)) return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">{cell}</Badge>;
  if (["Deficit"].includes(cell)) return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">{cell}</Badge>;
  return cell;
};

const InstitutionTables = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [period, setPeriod] = useState("month");
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "institutions";
  const tab = tabs.find(t => t.key === activeTab) || tabs[0];
  const filtered = tab.rows.filter(r => !searchTerm || r.some(c => c.toLowerCase().includes(searchTerm.toLowerCase())));

  const handleExport = () => {
    const csv = [tab.columns.join(","), ...filtered.map(r => r.map(c => `"${c}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" }); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = `${tab.key}.csv`; a.click(); URL.revokeObjectURL(url);
    toast.success(`${tab.label} exported`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between"><div className="flex items-center gap-2"><Building2 className="h-5 w-5 text-primary" /><div><h1 className="text-2xl font-bold text-foreground">{tab.label}</h1><p className="text-sm text-muted-foreground">Institution data records</p></div></div><PeriodFilter value={period} onChange={setPeriod} /></div>
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

export default InstitutionTables;
