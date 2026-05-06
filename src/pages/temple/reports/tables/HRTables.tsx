import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Filter, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import PeriodFilter from "@/components/reports/PeriodFilter";
import { toast } from "sonner";

const tabs = [
  { key: "employees", label: "Employees", columns: ["Employee", "Department", "Role", "Attendance", "Leave Used", "Salary", "Status"], rows: [
    ["Ramesh Kumar", "Administration", "Manager", "96%", "4/12", "₹45,000", "Active"],
    ["Lakshmi Devi", "Finance", "Accountant", "94%", "6/12", "₹35,000", "Active"],
    ["Suresh Patel", "Security", "Head Guard", "98%", "2/12", "₹28,000", "Active"],
    ["Anita Sharma", "Kitchen", "Head Cook", "92%", "5/12", "₹30,000", "Active"],
    ["Vijay Reddy", "Maintenance", "Supervisor", "95%", "3/12", "₹32,000", "Active"],
    ["Meena Iyer", "Pooja", "Sr. Priest", "97%", "4/12", "₹40,000", "Active"],
  ]},
  { key: "attendance", label: "Attendance Log", columns: ["Employee", "Date", "Check In", "Check Out", "Hours", "Status"], rows: [
    ["Ramesh Kumar", "2024-03-15", "8:55 AM", "5:30 PM", "8.5", "Present"],
    ["Lakshmi Devi", "2024-03-15", "9:10 AM", "6:00 PM", "8.8", "Present"],
    ["Suresh Patel", "2024-03-15", "6:00 AM", "2:00 PM", "8.0", "Present"],
    ["Anita Sharma", "2024-03-15", "—", "—", "0", "On Leave"],
  ]},
  { key: "leaves", label: "Leave Records", columns: ["Employee", "Leave Type", "From", "To", "Days", "Reason", "Status"], rows: [
    ["Anita Sharma", "Casual Leave", "2024-03-15", "2024-03-16", "2", "Family function", "Approved"],
    ["Vijay Reddy", "Sick Leave", "2024-03-10", "2024-03-10", "1", "Fever", "Approved"],
    ["Meena Iyer", "Earned Leave", "2024-03-20", "2024-03-25", "5", "Travel", "Pending"],
  ]},
  { key: "payroll", label: "Payroll", columns: ["Employee", "Basic", "Allowances", "Deductions", "Net Pay", "Month", "Status"], rows: [
    ["Ramesh Kumar", "₹30,000", "₹15,000", "₹5,400", "₹39,600", "Mar 2024", "Paid"],
    ["Lakshmi Devi", "₹22,000", "₹13,000", "₹3,960", "₹31,040", "Mar 2024", "Paid"],
    ["Suresh Patel", "₹18,000", "₹10,000", "₹3,240", "₹24,760", "Mar 2024", "Paid"],
    ["Meena Iyer", "₹28,000", "₹12,000", "₹5,040", "₹34,960", "Mar 2024", "Pending"],
  ]},
];

const renderStatusBadge = (cell: string) => {
  if (["Active", "Present", "Approved", "Paid"].includes(cell)) return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">{cell}</Badge>;
  if (["Pending"].includes(cell)) return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">{cell}</Badge>;
  if (["On Leave", "Rejected"].includes(cell)) return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">{cell}</Badge>;
  return cell;
};

const HRTables = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [period, setPeriod] = useState("month");
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "employees";
  const tab = tabs.find(t => t.key === activeTab) || tabs[0];
  const filtered = tab.rows.filter(r => !searchTerm || r.some(c => c.toLowerCase().includes(searchTerm.toLowerCase())));

  const handleExport = () => {
    const csv = [tab.columns.join(","), ...filtered.map(r => r.map(c => `"${c}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" }); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = `${tab.key}.csv`; a.click(); URL.revokeObjectURL(url);
    toast.success(`${tab.label} exported`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between"><div className="flex items-center gap-2"><Users className="h-5 w-5 text-primary" /><div><h1 className="text-2xl font-bold text-foreground">{tab.label}</h1><p className="text-sm text-muted-foreground">HR data records</p></div></div><PeriodFilter value={period} onChange={setPeriod} /></div>
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

export default HRTables;
