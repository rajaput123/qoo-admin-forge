import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Filter, CalendarDays } from "lucide-react";
import { Input } from "@/components/ui/input";
import PeriodFilter from "@/components/reports/PeriodFilter";
import { toast } from "sonner";

const tabs = [
  { key: "events", label: "Event Records", columns: ["Event Name", "Date", "Type", "Registrations", "Revenue", "Budget", "Status"], rows: [
    ["Maha Shivaratri", "2024-03-08", "Festival", "1,200", "₹4,50,000", "₹5,00,000", "Completed"],
    ["Ram Navami", "2024-04-17", "Festival", "0", "—", "₹3,50,000", "Published"],
    ["Vedic Workshop", "2024-03-20", "Workshop", "150", "₹75,000", "₹1,00,000", "Ongoing"],
    ["Annual Day", "2024-02-15", "Cultural", "2,000", "₹8,00,000", "₹7,50,000", "Completed"],
    ["Bhajan Sandhya", "2024-03-25", "Spiritual", "0", "—", "₹50,000", "Published"],
    ["Yoga Camp", "2024-03-18", "Health", "200", "₹1,20,000", "₹1,50,000", "Ongoing"],
  ]},
  { key: "expenses", label: "Event Expenses", columns: ["Event", "Category", "Description", "Amount", "Date"], rows: [
    ["Maha Shivaratri", "Decoration", "Flower arrangements & stage", "₹45,000", "2024-03-06"],
    ["Maha Shivaratri", "Catering", "Prasadam & meals for 1200", "₹1,20,000", "2024-03-07"],
    ["Ram Navami", "Flowers", "Garlands & loose flowers", "₹25,000", "2024-04-15"],
    ["Annual Day", "Sound & Lighting", "PA system & LED setup", "₹80,000", "2024-02-14"],
  ]},
  { key: "registrations", label: "Registrations", columns: ["Event", "Devotee", "Registration Date", "Tickets", "Amount", "Mode", "Status"], rows: [
    ["Ram Navami", "Ramesh K.", "2024-04-01", "4", "₹2,000", "Online", "Confirmed"],
    ["Vedic Workshop", "Lakshmi D.", "2024-03-10", "1", "₹500", "Counter", "Confirmed"],
    ["Bhajan Sandhya", "Suresh P.", "2024-03-20", "2", "₹300", "Online", "Confirmed"],
    ["Yoga Camp", "Anita S.", "2024-03-12", "1", "₹600", "Online", "Cancelled"],
  ]},
];

const renderStatusBadge = (cell: string) => {
  if (["Completed", "Confirmed"].includes(cell)) return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">{cell}</Badge>;
  if (["Published", "Ongoing"].includes(cell)) return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">{cell}</Badge>;
  if (["Cancelled"].includes(cell)) return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">{cell}</Badge>;
  return cell;
};

const EventTables = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [period, setPeriod] = useState("month");
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "events";
  const tab = tabs.find(t => t.key === activeTab) || tabs[0];
  const filtered = tab.rows.filter(r => !searchTerm || r.some(c => c.toLowerCase().includes(searchTerm.toLowerCase())));

  const handleExport = () => {
    const csv = [tab.columns.join(","), ...filtered.map(r => r.map(c => `"${c}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" }); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = `${tab.key}.csv`; a.click(); URL.revokeObjectURL(url);
    toast.success(`${tab.label} exported`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between"><div className="flex items-center gap-2"><CalendarDays className="h-5 w-5 text-primary" /><div><h1 className="text-2xl font-bold text-foreground">{tab.label}</h1><p className="text-sm text-muted-foreground">Event data records</p></div></div><PeriodFilter value={period} onChange={setPeriod} /></div>
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

export default EventTables;
