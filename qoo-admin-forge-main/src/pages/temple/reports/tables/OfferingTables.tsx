import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Filter, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import PeriodFilter from "@/components/reports/PeriodFilter";
import { toast } from "sonner";

const tabs = [
  { key: "offerings", label: "Offering Records", columns: ["Seva Name", "Date", "Devotee", "Deity", "Amount", "Priest", "Status"], rows: [
    ["Ganapathi Homam", "2024-03-15", "Ramesh K.", "Lord Ganesha", "₹5,000", "Pandit Sharma", "Completed"],
    ["Sahasranama", "2024-03-15", "Lakshmi D.", "Sri Vishnu", "₹1,500", "Pandit Iyer", "Scheduled"],
    ["Rudrabhishekam", "2024-03-14", "Suresh P.", "Lord Shiva", "₹3,000", "Pandit Rao", "Completed"],
    ["Lakshmi Pooja", "2024-03-14", "Anita S.", "Goddess Lakshmi", "₹2,000", "Pandit Sharma", "Completed"],
    ["Navagraha Pooja", "2024-03-13", "Vijay R.", "Navagraha", "₹2,500", "Pandit Iyer", "Completed"],
  ]},
  { key: "rituals", label: "Ritual Performance", columns: ["Ritual Name", "Total Bookings", "Total Revenue", "Growth %", "Avg Amount", "Top Deity"], rows: [
    ["Ganapathi Homam", "185", "₹9,25,000", "+14%", "₹5,000", "Lord Ganesha"],
    ["Sahasranama", "142", "₹2,13,000", "+8%", "₹1,500", "Sri Vishnu"],
    ["Rudrabhishekam", "98", "₹2,94,000", "+18%", "₹3,000", "Lord Shiva"],
    ["Lakshmi Pooja", "210", "₹4,20,000", "+11%", "₹2,000", "Goddess Lakshmi"],
    ["Navagraha Pooja", "76", "₹1,90,000", "-2%", "₹2,500", "Navagraha"],
    ["Sudarshana Homam", "45", "₹2,25,000", "+25%", "₹5,000", "Lord Vishnu"],
  ]},
];

const renderStatusBadge = (cell: string) => {
  if (["Completed"].includes(cell)) return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">{cell}</Badge>;
  if (["Scheduled"].includes(cell)) return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">{cell}</Badge>;
  if (["Cancelled"].includes(cell)) return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">{cell}</Badge>;
  return cell;
};

const OfferingTables = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [period, setPeriod] = useState("month");
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "offerings";
  const tab = tabs.find(t => t.key === activeTab) || tabs[0];
  const filtered = tab.rows.filter(r => !searchTerm || r.some(c => c.toLowerCase().includes(searchTerm.toLowerCase())));

  const handleExport = () => {
    const csv = [tab.columns.join(","), ...filtered.map(r => r.map(c => `"${c}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" }); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = `${tab.key}.csv`; a.click(); URL.revokeObjectURL(url);
    toast.success(`${tab.label} exported`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between"><div className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary" /><div><h1 className="text-2xl font-bold text-foreground">{tab.label}</h1><p className="text-sm text-muted-foreground">Offering data records</p></div></div><PeriodFilter value={period} onChange={setPeriod} /></div>
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

export default OfferingTables;
