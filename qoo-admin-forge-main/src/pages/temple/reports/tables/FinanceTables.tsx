import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Filter, IndianRupee } from "lucide-react";
import { Input } from "@/components/ui/input";
import PeriodFilter from "@/components/reports/PeriodFilter";
import { toast } from "sonner";

const tabs = [
  { key: "transactions", label: "Transactions", columns: ["Date", "Description", "Category", "Type", "Amount", "Account", "Status"], rows: [
    ["2024-03-15", "Electricity Bill", "Utilities", "Expense", "₹45,000", "HDFC Bank", "Paid"],
    ["2024-03-14", "Pooja Income", "Seva Revenue", "Income", "₹1,25,000", "SBI", "Received"],
    ["2024-03-13", "Staff Salary", "Payroll", "Expense", "₹3,50,000", "HDFC Bank", "Paid"],
    ["2024-03-12", "Donation Income", "Donations", "Income", "₹2,80,000", "SBI", "Received"],
    ["2024-03-11", "Maintenance", "Repairs", "Expense", "₹28,000", "Cash", "Paid"],
    ["2024-03-10", "Prasadam Sales", "Revenue", "Income", "₹65,000", "SBI", "Received"],
  ]},
  { key: "ledger", label: "Ledger", columns: ["Account", "Opening Balance", "Debit", "Credit", "Closing Balance", "Status"], rows: [
    ["SBI Main", "₹12,50,000", "₹4,70,000", "₹8,20,000", "₹16,00,000", "Active"],
    ["HDFC Operations", "₹5,80,000", "₹4,23,000", "₹2,10,000", "₹3,67,000", "Active"],
    ["Cash Account", "₹1,20,000", "₹28,000", "₹85,000", "₹1,77,000", "Active"],
  ]},
  { key: "budgets", label: "Budget vs Actual", columns: ["Category", "Budget", "Actual", "Variance", "Utilization", "Status"], rows: [
    ["Pooja Supplies", "₹2,00,000", "₹1,85,000", "₹15,000", "92.5%", "On Track"],
    ["Staff Salaries", "₹4,00,000", "₹3,50,000", "₹50,000", "87.5%", "On Track"],
    ["Maintenance", "₹1,00,000", "₹1,28,000", "-₹28,000", "128%", "Over Budget"],
    ["Events", "₹5,00,000", "₹3,20,000", "₹1,80,000", "64%", "Under Utilized"],
    ["Utilities", "₹80,000", "₹75,000", "₹5,000", "93.8%", "On Track"],
  ]},
];

const renderStatusBadge = (cell: string) => {
  if (["Paid", "Received", "Active", "On Track"].includes(cell)) return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">{cell}</Badge>;
  if (["Pending", "Under Utilized"].includes(cell)) return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">{cell}</Badge>;
  if (["Over Budget"].includes(cell)) return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">{cell}</Badge>;
  return cell;
};

const FinanceTables = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [period, setPeriod] = useState("month");
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "transactions";
  const tab = tabs.find(t => t.key === activeTab) || tabs[0];
  const filtered = tab.rows.filter(r => !searchTerm || r.some(c => c.toLowerCase().includes(searchTerm.toLowerCase())));

  const handleExport = () => {
    const csv = [tab.columns.join(","), ...filtered.map(r => r.map(c => `"${c}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" }); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = `${tab.key}.csv`; a.click(); URL.revokeObjectURL(url);
    toast.success(`${tab.label} exported`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between"><div className="flex items-center gap-2"><IndianRupee className="h-5 w-5 text-primary" /><div><h1 className="text-2xl font-bold text-foreground">{tab.label}</h1><p className="text-sm text-muted-foreground">Finance data records</p></div></div><PeriodFilter value={period} onChange={setPeriod} /></div>
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

export default FinanceTables;
