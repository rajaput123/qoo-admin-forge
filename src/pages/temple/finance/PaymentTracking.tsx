import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import {
  CreditCard, Search, Filter, AlertCircle, CheckCircle2, Clock,
  IndianRupee, Building2, Users, Bell
} from "lucide-react";
import { toast } from "sonner";
import FinanceDateFilter, { type DateRange } from "@/components/finance/FinanceDateFilter";

interface Payment {
  id: string;
  date: string;
  dueDate: string;
  type: "Vendor" | "Salary" | "Utility" | "Contractor" | "Refund";
  payee: string;
  description: string;
  amount: number;
  paidAmount: number;
  status: "Paid" | "Partial" | "Due" | "Overdue";
  voucherId: string;
}

const dummyPayments: Payment[] = [
  { id: "PMT-001", date: "2025-03-28", dueDate: "2025-04-05", type: "Vendor", payee: "Sri Pooja Stores", description: "Pooja materials - March supply", amount: 28000, paidAmount: 28000, status: "Paid", voucherId: "VCH-2025-001" },
  { id: "PMT-002", date: "2025-03-25", dueDate: "2025-03-31", type: "Salary", payee: "All Staff (12)", description: "March 2025 Staff Salary", amount: 185000, paidAmount: 185000, status: "Paid", voucherId: "PAY-2025-003" },
  { id: "PMT-003", date: "2025-03-20", dueDate: "2025-03-30", type: "Vendor", payee: "Berger Paints Dealer", description: "Paint supplies for Gopuram", amount: 45000, paidAmount: 25000, status: "Partial", voucherId: "VCH-2025-003" },
  { id: "PMT-004", date: "2025-03-15", dueDate: "2025-03-28", type: "Utility", payee: "APSPDCL", description: "March electricity bill", amount: 45000, paidAmount: 0, status: "Overdue", voucherId: "EXP-2025-031" },
  { id: "PMT-005", date: "2025-03-22", dueDate: "2025-04-10", type: "Contractor", payee: "Sri Constructions", description: "Gopuram renovation Phase 2", amount: 350000, paidAmount: 0, status: "Due", voucherId: "VCH-2025-008" },
  { id: "PMT-006", date: "2025-03-18", dueDate: "2025-04-01", type: "Vendor", payee: "Flower Market Wholesale", description: "Weekly flower supply agreement", amount: 15000, paidAmount: 0, status: "Due", voucherId: "VCH-2025-010" },
  { id: "PMT-007", date: "2025-03-10", dueDate: "2025-03-25", type: "Vendor", payee: "Kitchen Supplies Co.", description: "Rice, dal, ghee bulk order", amount: 65000, paidAmount: 0, status: "Overdue", voucherId: "VCH-2025-009" },
  { id: "PMT-008", date: "2025-03-28", dueDate: "2025-04-15", type: "Refund", payee: "Devotee - Cancelled Seva", description: "Refund for cancelled Abhishekam", amount: 2500, paidAmount: 0, status: "Due", voucherId: "REF-2025-003" },
];

const formatCurrency = (val: number) => `₹${val.toLocaleString("en-IN")}`;

const PaymentTracking = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [dateRange, setDateRange] = useState<DateRange>({ from: null, to: null });

  const filtered = dummyPayments.filter(p => {
    if (statusFilter !== "all" && p.status !== statusFilter) return false;
    if (typeFilter !== "all" && p.type !== typeFilter) return false;
    if (searchTerm && !p.payee.toLowerCase().includes(searchTerm.toLowerCase()) && !p.description.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (dateRange.from || dateRange.to) {
      const d = new Date(p.date);
      if (dateRange.from && d < dateRange.from) return false;
      if (dateRange.to && d > dateRange.to) return false;
    }
    return true;
  });

  const totalDue = dummyPayments.filter(p => ["Due", "Overdue", "Partial"].includes(p.status)).reduce((s, p) => s + (p.amount - p.paidAmount), 0);
  const totalOverdue = dummyPayments.filter(p => p.status === "Overdue").reduce((s, p) => s + (p.amount - p.paidAmount), 0);
  const totalPaid = dummyPayments.filter(p => p.status === "Paid").reduce((s, p) => s + p.paidAmount, 0);
  const overdueCount = dummyPayments.filter(p => p.status === "Overdue").length;

  const handleMarkPaid = (id: string) => {
    toast.success(`Payment ${id} marked as paid. Ledger updated.`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <CreditCard className="h-6 w-6 text-primary" /> Payment Tracking
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">Track vendor payments, salaries & dues</p>
        </div>
      </div>

      {/* Alert for overdue */}
      {overdueCount > 0 && (
        <Card className="border-red-200 bg-red-50/30">
          <CardContent className="py-3 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800">{overdueCount} Overdue Payment{overdueCount > 1 ? "s" : ""} — {formatCurrency(totalOverdue)}</p>
              <p className="text-xs text-red-600">These payments have crossed their due date</p>
            </div>
            <Button size="sm" variant="destructive" className="gap-1.5" onClick={() => toast.info("Reminder sent to accounts team")}>
              <Bell className="h-3.5 w-3.5" /> Send Reminder
            </Button>
          </CardContent>
        </Card>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-1.5 mb-1">
              <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
              <span className="text-[11px] text-muted-foreground">Total Paid</span>
            </div>
            <p className="text-lg font-bold text-green-700">{formatCurrency(totalPaid)}</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-1.5 mb-1">
              <Clock className="h-3.5 w-3.5 text-amber-600" />
              <span className="text-[11px] text-muted-foreground">Pending Due</span>
            </div>
            <p className="text-lg font-bold text-amber-700">{formatCurrency(totalDue)}</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-red-400">
          <CardContent className="p-4">
            <div className="flex items-center gap-1.5 mb-1">
              <AlertCircle className="h-3.5 w-3.5 text-red-500" />
              <span className="text-[11px] text-muted-foreground">Overdue</span>
            </div>
            <p className="text-lg font-bold text-red-600">{formatCurrency(totalOverdue)}</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-primary">
          <CardContent className="p-4">
            <div className="flex items-center gap-1.5 mb-1">
              <IndianRupee className="h-3.5 w-3.5 text-primary" />
              <span className="text-[11px] text-muted-foreground">Total Outflow</span>
            </div>
            <p className="text-lg font-bold">{formatCurrency(totalPaid + totalDue)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search payee, description..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-9" />
        </div>
        <FinanceDateFilter onDateRangeChange={setDateRange} />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Paid">Paid</SelectItem>
            <SelectItem value="Due">Due</SelectItem>
            <SelectItem value="Overdue">Overdue</SelectItem>
            <SelectItem value="Partial">Partial</SelectItem>
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="Vendor">Vendor</SelectItem>
            <SelectItem value="Salary">Salary</SelectItem>
            <SelectItem value="Utility">Utility</SelectItem>
            <SelectItem value="Contractor">Contractor</SelectItem>
            <SelectItem value="Refund">Refund</SelectItem>
          </SelectContent>
        </Select>
        <Badge variant="outline">{filtered.length} payments</Badge>
      </div>

      {/* Payments Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Due Date</TableHead>
                  <TableHead className="text-xs">Type</TableHead>
                  <TableHead className="text-xs">Payee</TableHead>
                  <TableHead className="text-xs">Description</TableHead>
                  <TableHead className="text-xs">Voucher</TableHead>
                  <TableHead className="text-xs text-right">Amount</TableHead>
                  <TableHead className="text-xs text-right">Paid</TableHead>
                  <TableHead className="text-xs text-center">Progress</TableHead>
                  <TableHead className="text-xs text-center">Status</TableHead>
                  <TableHead className="text-xs text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(p => {
                  const pct = p.amount > 0 ? Math.round((p.paidAmount / p.amount) * 100) : 0;
                  return (
                    <TableRow key={p.id} className={p.status === "Overdue" ? "bg-red-50/30" : ""}>
                      <TableCell className="text-xs whitespace-nowrap">
                        <span className={p.status === "Overdue" ? "text-red-600 font-medium" : "text-muted-foreground"}>
                          {new Date(p.dueDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-[10px]">{p.type}</Badge>
                      </TableCell>
                      <TableCell className="text-xs font-medium">{p.payee}</TableCell>
                      <TableCell className="text-xs max-w-[160px] truncate text-muted-foreground">{p.description}</TableCell>
                      <TableCell className="text-xs font-mono text-primary">{p.voucherId}</TableCell>
                      <TableCell className="text-xs text-right font-medium">{formatCurrency(p.amount)}</TableCell>
                      <TableCell className="text-xs text-right">{p.paidAmount > 0 ? formatCurrency(p.paidAmount) : "—"}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center gap-1.5">
                          <Progress value={pct} className="h-1.5 w-12" />
                          <span className="text-[10px] text-muted-foreground">{pct}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className={`text-[10px] ${
                          p.status === "Paid" ? "bg-green-50 text-green-700 border-green-200" :
                          p.status === "Overdue" ? "bg-red-50 text-red-700 border-red-200" :
                          p.status === "Partial" ? "bg-amber-50 text-amber-700 border-amber-200" :
                          "bg-blue-50 text-blue-700 border-blue-200"
                        }`}>{p.status}</Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        {p.status !== "Paid" && (
                          <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => handleMarkPaid(p.id)}>
                            Mark Paid
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentTracking;
