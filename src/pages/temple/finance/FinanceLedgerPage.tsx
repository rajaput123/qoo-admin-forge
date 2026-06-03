import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BookOpen, Search, Filter, Download, ArrowUpRight, ArrowDownRight, IndianRupee } from "lucide-react";
import { toast } from "sonner";
import FinanceDateFilter, { type DateRange } from "@/components/finance/FinanceDateFilter";

interface LedgerEntry {
  id: string;
  date: string;
  type: "Income" | "Expense" | "Transfer" | "Payroll";
  referenceId: string;
  referenceType: string;
  description: string;
  debit: number;
  credit: number;
  balance: number;
  category: string;
  linkedTo: string;
}

const dummyLedger: LedgerEntry[] = [
  { id: "TXN-001", date: "2025-03-28", type: "Income", referenceId: "DON-2025-0345", referenceType: "Donation", description: "General Donation - Ramesh Kumar", debit: 0, credit: 51000, balance: 3251000, category: "Donations", linkedTo: "" },
  { id: "TXN-002", date: "2025-03-28", type: "Income", referenceId: "SVA-2025-0789", referenceType: "Seva Booking", description: "Abhishekam Booking - Lakshmi Devi", debit: 0, credit: 5000, balance: 3256000, category: "Seva Revenue", linkedTo: "" },
  { id: "TXN-003", date: "2025-03-27", type: "Expense", referenceId: "VCH-2025-001", referenceType: "Voucher", description: "Pooja Materials - Sri Pooja Stores", debit: 8750, credit: 0, balance: 3247250, category: "Pooja & Rituals", linkedTo: "" },
  { id: "TXN-004", date: "2025-03-27", type: "Income", referenceId: "DON-2025-0344", referenceType: "Donation", description: "Event Donation - Sri Trust Foundation", debit: 0, credit: 100000, balance: 3347250, category: "Donations", linkedTo: "Brahmotsavam 2025" },
  { id: "TXN-005", date: "2025-03-26", type: "Expense", referenceId: "VCH-2025-005", referenceType: "Voucher", description: "LED Bulbs & Wiring - Philips", debit: 9800, credit: 0, balance: 3337450, category: "Utilities", linkedTo: "" },
  { id: "TXN-006", date: "2025-03-26", type: "Income", referenceId: "DON-2025-0343", referenceType: "Donation", description: "Project Donation - Venkat Reddy", debit: 0, credit: 200000, balance: 3537450, category: "Donations", linkedTo: "Gopuram Renovation" },
  { id: "TXN-007", date: "2025-03-25", type: "Income", referenceId: "HND-2025-028", referenceType: "Hundi", description: "Main Hundi Collection", debit: 0, credit: 85000, balance: 3622450, category: "Hundi", linkedTo: "" },
  { id: "TXN-008", date: "2025-03-25", type: "Expense", referenceId: "EXP-2025-031", referenceType: "Expense", description: "Monthly Electricity Bill", debit: 45000, credit: 0, balance: 3577450, category: "Utilities", linkedTo: "" },
  { id: "TXN-009", date: "2025-03-24", type: "Payroll", referenceId: "PAY-2025-003", referenceType: "Salary", description: "Staff Salary - March 2025", debit: 185000, credit: 0, balance: 3392450, category: "Salaries", linkedTo: "" },
  { id: "TXN-010", date: "2025-03-24", type: "Income", referenceId: "SLS-2025-056", referenceType: "Sales", description: "Prasadam Counter Sales", debit: 0, credit: 12500, balance: 3404950, category: "Sales", linkedTo: "" },
  { id: "TXN-011", date: "2025-03-23", type: "Expense", referenceId: "VCH-2025-006", referenceType: "Voucher", description: "Brahmotsavam Day 1 Arrangements", debit: 40000, credit: 0, balance: 3364950, category: "Events", linkedTo: "Brahmotsavam 2025" },
  { id: "TXN-012", date: "2025-03-22", type: "Transfer", referenceId: "TRF-2025-004", referenceType: "Fund Transfer", description: "Transfer to Building Fund", debit: 100000, credit: 0, balance: 3264950, category: "Transfers", linkedTo: "Gopuram Renovation" },
];

const formatCurrency = (val: number) => `₹${val.toLocaleString("en-IN")}`;

const FinanceLedgerPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [dateRange, setDateRange] = useState<DateRange>({ from: null, to: null });

  const filtered = dummyLedger.filter(e => {
    if (typeFilter !== "all" && e.type !== typeFilter) return false;
    if (categoryFilter !== "all" && e.category !== categoryFilter) return false;
    if (searchTerm && !Object.values(e).some(v => String(v).toLowerCase().includes(searchTerm.toLowerCase()))) return false;
    if (dateRange.from || dateRange.to) {
      const d = new Date(e.date);
      if (dateRange.from && d < dateRange.from) return false;
      if (dateRange.to && d > dateRange.to) return false;
    }
    return true;
  });

  const totalDebit = filtered.reduce((s, e) => s + e.debit, 0);
  const totalCredit = filtered.reduce((s, e) => s + e.credit, 0);
  const categories = [...new Set(dummyLedger.map(e => e.category))];

  const handleExport = () => {
    const csv = ["Date,Type,Reference,Description,Debit,Credit,Balance,Category,Linked To", ...filtered.map(e => `${e.date},${e.type},${e.referenceId},"${e.description}",${e.debit},${e.credit},${e.balance},${e.category},"${e.linkedTo}"`)].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "ledger.csv"; a.click(); URL.revokeObjectURL(url);
    toast.success("Ledger exported");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" /> Central Ledger
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">Every transaction recorded — full traceability</p>
        </div>
        <Button variant="outline" className="gap-2" onClick={handleExport}>
          <Download className="h-4 w-4" /> Export Ledger
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <span className="text-[11px] text-muted-foreground">Total Credits (Income)</span>
            <p className="text-lg font-bold text-green-700">{formatCurrency(totalCredit)}</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-red-400">
          <CardContent className="p-4">
            <span className="text-[11px] text-muted-foreground">Total Debits (Outflow)</span>
            <p className="text-lg font-bold text-red-600">{formatCurrency(totalDebit)}</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <span className="text-[11px] text-muted-foreground">Net Position</span>
            <p className="text-lg font-bold">{formatCurrency(totalCredit - totalDebit)}</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-primary">
          <CardContent className="p-4">
            <span className="text-[11px] text-muted-foreground">Transactions</span>
            <p className="text-lg font-bold">{filtered.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search description, reference..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-9" />
        </div>
        <FinanceDateFilter onDateRangeChange={setDateRange} />
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="Income">Income</SelectItem>
            <SelectItem value="Expense">Expense</SelectItem>
            <SelectItem value="Payroll">Payroll</SelectItem>
            <SelectItem value="Transfer">Transfer</SelectItem>
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Ledger Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Date</TableHead>
                  <TableHead className="text-xs">Type</TableHead>
                  <TableHead className="text-xs">Reference</TableHead>
                  <TableHead className="text-xs">Description</TableHead>
                  <TableHead className="text-xs">Category</TableHead>
                  <TableHead className="text-xs text-right text-red-600">Debit</TableHead>
                  <TableHead className="text-xs text-right text-green-600">Credit</TableHead>
                  <TableHead className="text-xs text-right">Balance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(entry => (
                  <TableRow key={entry.id}>
                    <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(entry.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {entry.type === "Income" && <ArrowUpRight className="h-3 w-3 text-green-600" />}
                        {entry.type === "Expense" && <ArrowDownRight className="h-3 w-3 text-red-500" />}
                        {entry.type === "Payroll" && <IndianRupee className="h-3 w-3 text-purple-600" />}
                        {entry.type === "Transfer" && <ArrowUpRight className="h-3 w-3 text-blue-600" />}
                        <Badge variant="outline" className={`text-[10px] ${
                          entry.type === "Income" ? "bg-green-50 text-green-700 border-green-200" :
                          entry.type === "Expense" ? "bg-red-50 text-red-700 border-red-200" :
                          entry.type === "Payroll" ? "bg-purple-50 text-purple-700 border-purple-200" :
                          "bg-blue-50 text-blue-700 border-blue-200"
                        }`}>{entry.type}</Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs font-mono text-primary">{entry.referenceId}</TableCell>
                    <TableCell className="text-xs max-w-[200px] truncate">
                      {entry.description}
                      {entry.linkedTo && <span className="text-primary ml-1">({entry.linkedTo})</span>}
                    </TableCell>
                    <TableCell><Badge variant="secondary" className="text-[10px]">{entry.category}</Badge></TableCell>
                    <TableCell className="text-xs text-right font-medium text-red-600">
                      {entry.debit > 0 ? formatCurrency(entry.debit) : ""}
                    </TableCell>
                    <TableCell className="text-xs text-right font-medium text-green-700">
                      {entry.credit > 0 ? formatCurrency(entry.credit) : ""}
                    </TableCell>
                    <TableCell className="text-xs text-right font-bold whitespace-nowrap">{formatCurrency(entry.balance)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <tfoot>
                <tr className="bg-muted/30 font-medium text-sm">
                  <td colSpan={5} className="p-3 text-right">Totals</td>
                  <td className="p-3 text-right text-red-600">{formatCurrency(totalDebit)}</td>
                  <td className="p-3 text-right text-green-700">{formatCurrency(totalCredit)}</td>
                  <td className="p-3 text-right font-bold">{formatCurrency(totalCredit - totalDebit)}</td>
                </tr>
              </tfoot>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinanceLedgerPage;
