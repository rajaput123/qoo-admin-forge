import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Filter, Crown } from "lucide-react";
import { Input } from "@/components/ui/input";
import PeriodFilter from "@/components/reports/PeriodFilter";
import { toast } from "sonner";

const tabs = [
  { key: "vips", label: "VIP Devotees", columns: ["Name", "VIP Level", "Total Contribution", "Last Visit", "Events Attended", "Services Used", "Status"], rows: [
    ["Dr. Rajesh Gupta", "Platinum", "₹15,00,000", "2024-03-14", "24", "Premium Darshan", "Active"],
    ["Mrs. Kamala Reddy", "Gold", "₹8,50,000", "2024-03-12", "18", "VIP Pooja", "Active"],
    ["Mr. Suresh Rao", "Platinum", "₹12,00,000", "2024-03-10", "22", "All Services", "Active"],
    ["Mrs. Anita Devi", "Silver", "₹3,20,000", "2024-03-08", "12", "Special Darshan", "Active"],
  ]},
  { key: "activity", label: "VIP Activity Log", columns: ["VIP Name", "Date", "Activity", "Service", "Amount", "Rating", "Status"], rows: [
    ["Dr. Rajesh Gupta", "2024-03-14", "Special Pooja", "Premium Darshan", "₹10,000", "5/5", "Completed"],
    ["Mrs. Kamala Reddy", "2024-03-12", "Donation", "Temple Fund", "₹50,000", "—", "Completed"],
    ["Mr. Suresh Rao", "2024-03-10", "Festival VIP Pass", "Shivaratri", "₹25,000", "4.8", "Completed"],
    ["Mrs. Anita Devi", "2024-03-08", "Special Darshan", "Morning Slot", "₹5,000", "4.5", "Completed"],
  ]},
];

const renderStatusBadge = (cell: string) => {
  if (["Active", "Completed"].includes(cell)) return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">{cell}</Badge>;
  if (["Platinum"].includes(cell)) return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">{cell}</Badge>;
  if (["Gold"].includes(cell)) return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">{cell}</Badge>;
  if (["Silver"].includes(cell)) return <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">{cell}</Badge>;
  return cell;
};

const VipTables = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [period, setPeriod] = useState("month");
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "vips";
  const tab = tabs.find(t => t.key === activeTab) || tabs[0];
  const filtered = tab.rows.filter(r => !searchTerm || r.some(c => c.toLowerCase().includes(searchTerm.toLowerCase())));

  const handleExport = () => {
    const csv = [tab.columns.join(","), ...filtered.map(r => r.map(c => `"${c}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" }); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = `${tab.key}.csv`; a.click(); URL.revokeObjectURL(url);
    toast.success(`${tab.label} exported`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between"><div className="flex items-center gap-2"><Crown className="h-5 w-5 text-primary" /><div><h1 className="text-2xl font-bold text-foreground">{tab.label}</h1><p className="text-sm text-muted-foreground">VIP data records</p></div></div><PeriodFilter value={period} onChange={setPeriod} /></div>
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

export default VipTables;
