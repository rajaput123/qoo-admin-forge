import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { FinanceTableRadioGroup, FinanceTableRadioHead, FinanceTableRadioCell } from "@/components/finance/FinanceTableRadio";

interface LedgerEntry {
  id: string;
  date: string;
  voucher_no: string;
  account_head: string;
  sub_ledger: string;
  narration: string;
  income: number;
  expense: number;
  balance: number;
}

const mockLedger: LedgerEntry[] = [
  { id: "1", date: "2026-06-05", voucher_no: "JV-2026-F17C90", account_head: "Donations", sub_ledger: "General Fund", narration: "General Donation - Ramesh Kumar", income: 51000, expense: 0, balance: 3251000 },
  { id: "2", date: "2026-06-04", voucher_no: "JV-2026-DDB879", account_head: "Seva Revenue", sub_ledger: "Abhishekam", narration: "Abhishekam Booking - Lakshmi Devi", income: 5000, expense: 0, balance: 3256000 },
  { id: "3", date: "2026-06-03", voucher_no: "JV-2026-C50BF9", account_head: "Pooja Materials", sub_ledger: "Vendor Payables", narration: "Pooja Materials - Sri Pooja Stores", income: 0, expense: 8750, balance: 3247250 },
  { id: "4", date: "2026-06-02", voucher_no: "JV-2026-AD8156", account_head: "Utilities", sub_ledger: "Electricity", narration: "Monthly Electricity Bill", income: 0, expense: 45000, balance: 3202250 },
  { id: "5", date: "2026-06-01", voucher_no: "JV-2026-B12C34", account_head: "Hundi", sub_ledger: "Main Counter", narration: "Main Hundi Collection", income: 85000, expense: 0, balance: 3287250 },
  { id: "6", date: "2026-05-30", voucher_no: "PAY-2026-003", account_head: "Salaries", sub_ledger: "Staff Payroll", narration: "Staff Salary - May 2026", income: 0, expense: 185000, balance: 3102250 },
];

const formatCurrency = (val: number) => (val > 0 ? val.toLocaleString("en-IN") : "—");
const formatVoucher = (v: string) => (v.length > 10 ? `${v.slice(0, 10)}...` : v);

const FinanceLedgerPage = () => {
  const [selectedId, setSelectedId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedAccount, setSelectedAccount] = useState("All Accounts");

  const accountHeads = [...new Set(mockLedger.map((t) => t.account_head))];
  const filtered = mockLedger.filter((txn) => {
    if (selectedAccount !== "All Accounts" && txn.account_head !== selectedAccount) return false;
    if (startDate && txn.date < startDate) return false;
    if (endDate && txn.date > endDate) return false;
    return true;
  });

  const totalIncome = filtered.reduce((s, t) => s + t.income, 0);
  const totalExpense = filtered.reduce((s, t) => s + t.expense, 0);
  const netBalance = totalIncome - totalExpense;

  const handleExport = () => {
    toast.success("Ledger exported (mock PDF)");
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground mb-1.5 font-medium">Total Income</div>
            <div className="text-2xl font-bold">₹{formatCurrency(totalIncome)}</div>
            <div className="text-xs text-green-700 mt-1">Up to date</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground mb-1.5 font-medium">Total Expense</div>
            <div className="text-2xl font-bold">₹{formatCurrency(totalExpense)}</div>
            <div className="text-xs text-red-700 mt-1">Up to date</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground mb-1.5 font-medium">Net Balance</div>
            <div className="text-2xl font-bold">₹{formatCurrency(netBalance)}</div>
            <div className="text-xs text-muted-foreground mt-1">Current period</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-5">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <span className="text-sm font-semibold">General Ledger</span>
            <div className="flex flex-wrap items-center gap-2">
              <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="text-xs h-9 w-[140px]" />
              <span className="text-xs text-muted-foreground">to</span>
              <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="text-xs h-9 w-[140px]" />
              <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                <SelectTrigger className="text-xs h-9 w-[160px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Accounts">All Accounts</SelectItem>
                  {accountHeads.map((h) => <SelectItem key={h} value={h}>{h}</SelectItem>)}
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" className="text-xs gap-1.5" onClick={handleExport}>
                <Download className="h-3.5 w-3.5" /> Export PDF
              </Button>
            </div>
          </div>

          <FinanceTableRadioGroup value={selectedId} onValueChange={setSelectedId}>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <FinanceTableRadioHead />
                <TableHead className="text-xs">Date</TableHead>
                <TableHead className="text-xs">Voucher No</TableHead>
                <TableHead className="text-xs">Account Head</TableHead>
                <TableHead className="text-xs">Sub-Ledger</TableHead>
                <TableHead className="text-xs">Narration</TableHead>
                <TableHead className="text-xs text-right">Income (+) (₹)</TableHead>
                <TableHead className="text-xs text-right">Expense (−) (₹)</TableHead>
                <TableHead className="text-xs text-right">Balance (₹)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-10 text-muted-foreground text-xs">
                    No ledger entries found.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((txn) => (
                  <TableRow key={txn.id} className="hover:bg-muted/50 cursor-pointer" onClick={() => setSelectedId(txn.id)}>
                    <FinanceTableRadioCell value={txn.id} />
                    <TableCell className="text-xs">{txn.date}</TableCell>
                    <TableCell className="text-xs font-mono text-primary" title={txn.voucher_no}>{formatVoucher(txn.voucher_no)}</TableCell>
                    <TableCell className="text-xs font-semibold">{txn.account_head}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{txn.sub_ledger}</TableCell>
                    <TableCell className="text-xs max-w-[200px] truncate text-muted-foreground">{txn.narration}</TableCell>
                    <TableCell className="text-xs text-right font-mono text-green-700">{formatCurrency(txn.income)}</TableCell>
                    <TableCell className="text-xs text-right font-mono text-red-700">{formatCurrency(txn.expense)}</TableCell>
                    <TableCell className="text-xs text-right font-mono font-semibold">{txn.balance.toLocaleString("en-IN")}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          </FinanceTableRadioGroup>

          <div className="flex justify-between pt-4 mt-2 border-t text-xs text-muted-foreground">
            <span>Showing {filtered.length} of {mockLedger.length} records</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinanceLedgerPage;
