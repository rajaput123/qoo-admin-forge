import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Filter, Heart } from "lucide-react";
import { Input } from "@/components/ui/input";
import PeriodFilter from "@/components/reports/PeriodFilter";
import { toast } from "sonner";

const tabs = [
  { key: "records", label: "Donation Records", columns: ["Date", "Donor Name", "Amount", "Purpose", "Mode", "Receipt", "Status"], rows: [
    ["2024-03-15", "Ramesh Kumar", "₹25,000", "Temple Renovation", "Online", "RCT-001", "Completed"],
    ["2024-03-14", "Lakshmi Devi", "₹10,000", "Annadanam", "Cash", "RCT-002", "Completed"],
    ["2024-03-14", "Suresh Patel", "₹50,000", "General Fund", "Bank Transfer", "RCT-003", "Completed"],
    ["2024-03-13", "Anita Sharma", "₹5,000", "Festival Fund", "UPI", "RCT-004", "Completed"],
    ["2024-03-12", "Vijay Reddy", "₹1,00,000", "Temple Renovation", "Cheque", "RCT-005", "Pending"],
    ["2024-03-11", "Meena Iyer", "₹15,000", "Education Fund", "Online", "RCT-006", "Completed"],
    ["2024-03-10", "Ganesh Rao", "₹8,000", "Annadanam", "Cash", "RCT-007", "Completed"],
    ["2024-03-09", "Priya Nair", "₹20,000", "General Fund", "UPI", "RCT-008", "Completed"],
  ]},
  { key: "donors", label: "Donor Registry", columns: ["Donor", "Total Donated", "Count", "Last Donation", "Preferred Mode", "Status"], rows: [
    ["Ramesh Kumar", "₹2,50,000", "12", "2024-03-15", "Online", "Active"],
    ["Suresh Patel", "₹1,80,000", "8", "2024-03-14", "Bank Transfer", "Active"],
    ["Vijay Reddy", "₹1,50,000", "5", "2024-03-12", "Cheque", "Active"],
    ["Lakshmi Devi", "₹85,000", "10", "2024-03-14", "Cash", "Active"],
    ["Priya Nair", "₹60,000", "6", "2024-03-09", "UPI", "Active"],
  ]},
  { key: "receipts", label: "Receipt Log", columns: ["Receipt #", "Date", "Donor", "Amount", "Type", "Status", "Delivery"], rows: [
    ["RCT-001", "2024-03-15", "Ramesh Kumar", "₹25,000", "80G", "Generated", "Sent"],
    ["RCT-002", "2024-03-14", "Lakshmi Devi", "₹10,000", "Regular", "Generated", "Sent"],
    ["RCT-003", "2024-03-14", "Suresh Patel", "₹50,000", "80G", "Generated", "Pending"],
    ["RCT-005", "2024-03-12", "Vijay Reddy", "₹1,00,000", "80G", "Pending", "Not Sent"],
  ]},
];

const renderStatusBadge = (cell: string) => {
  if (["Completed", "Active", "Generated", "Sent"].includes(cell)) return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">{cell}</Badge>;
  if (["Pending", "Not Sent"].includes(cell)) return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">{cell}</Badge>;
  return cell;
};

const DonationTables = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [period, setPeriod] = useState("month");
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "records";
  const tab = tabs.find(t => t.key === activeTab) || tabs[0];
  const filtered = tab.rows.filter(r => !searchTerm || r.some(c => c.toLowerCase().includes(searchTerm.toLowerCase())));

  const handleExport = () => {
    const csv = [tab.columns.join(","), ...filtered.map(r => r.map(c => `"${c}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = `${tab.key}.csv`; a.click(); URL.revokeObjectURL(url);
    toast.success(`${tab.label} exported`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2"><Heart className="h-5 w-5 text-primary" /><div><h1 className="text-2xl font-bold text-foreground">{tab.label}</h1><p className="text-sm text-muted-foreground">Donation data records</p></div></div>
        <PeriodFilter value={period} onChange={setPeriod} />
      </div>
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

export default DonationTables;
