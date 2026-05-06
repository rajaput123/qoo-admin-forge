import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Filter, Briefcase } from "lucide-react";
import { Input } from "@/components/ui/input";
import PeriodFilter from "@/components/reports/PeriodFilter";
import { toast } from "sonner";

const tabs = [
  { key: "freelancers", label: "Freelancer Records", columns: ["Name", "Skill", "Assignments", "Completed", "Payments", "Rating", "Status"], rows: [
    ["Ravi Kumar", "Electrician", "12", "10", "₹1,80,000", "4.5", "Active"],
    ["Sunil Rao", "Carpenter", "8", "7", "₹1,40,000", "4.3", "Active"],
    ["Priya Nair", "Painter", "6", "6", "₹90,000", "4.7", "Active"],
    ["Mohan Das", "Plumber", "10", "9", "₹1,20,000", "4.1", "Active"],
    ["Geetha M.", "Decorator", "15", "14", "₹2,50,000", "4.8", "Active"],
  ]},
  { key: "payments", label: "Payment History", columns: ["Freelancer", "Assignment", "Amount", "Date", "Mode", "Status"], rows: [
    ["Ravi Kumar", "Wiring Work", "₹18,000", "2024-03-10", "Bank Transfer", "Paid"],
    ["Geetha M.", "Festival Decoration", "₹25,000", "2024-03-08", "UPI", "Paid"],
    ["Sunil Rao", "Door Repair", "₹12,000", "2024-03-05", "Cash", "Paid"],
    ["Priya Nair", "Wall Painting", "₹15,000", "2024-03-12", "Bank Transfer", "Pending"],
  ]},
  { key: "assignments", label: "Assignment Log", columns: ["Freelancer", "Task", "Project", "Start Date", "End Date", "Hours", "Status"], rows: [
    ["Ravi Kumar", "Gopuram Wiring", "Gopuram Renovation", "2024-03-01", "2024-03-10", "80", "Completed"],
    ["Geetha M.", "Shivaratri Decor", "Maha Shivaratri", "2024-03-05", "2024-03-08", "36", "Completed"],
    ["Mohan Das", "Kitchen Plumbing", "Kitchen Expansion", "2024-03-10", "—", "40", "In Progress"],
  ]},
];

const renderStatusBadge = (cell: string) => {
  if (["Active", "Paid", "Completed"].includes(cell)) return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">{cell}</Badge>;
  if (["Pending", "In Progress"].includes(cell)) return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">{cell}</Badge>;
  return cell;
};

const FreelancerTables = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [period, setPeriod] = useState("month");
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "freelancers";
  const tab = tabs.find(t => t.key === activeTab) || tabs[0];
  const filtered = tab.rows.filter(r => !searchTerm || r.some(c => c.toLowerCase().includes(searchTerm.toLowerCase())));

  const handleExport = () => {
    const csv = [tab.columns.join(","), ...filtered.map(r => r.map(c => `"${c}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" }); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = `${tab.key}.csv`; a.click(); URL.revokeObjectURL(url);
    toast.success(`${tab.label} exported`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between"><div className="flex items-center gap-2"><Briefcase className="h-5 w-5 text-primary" /><div><h1 className="text-2xl font-bold text-foreground">{tab.label}</h1><p className="text-sm text-muted-foreground">Freelancer data records</p></div></div><PeriodFilter value={period} onChange={setPeriod} /></div>
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

export default FreelancerTables;
