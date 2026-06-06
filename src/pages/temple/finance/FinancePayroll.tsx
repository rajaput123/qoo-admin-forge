import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { PlayCircle, Download, Search, Eye, Banknote } from "lucide-react";
import { toast } from "sonner";
import { PayrollBulkRemittanceForm } from "@/components/finance/PayrollBulkRemittanceForm";
import { VoucherPrintDialog } from "@/components/finance/VoucherPrintDialog";
import { buildPayrollBulkRemittance, type PayrollBulkRemittanceData } from "@/data/payrollBulkRemittanceData";
import { exportPayrollBulkToExcel } from "@/lib/payrollBulkExport";

const formatCurrency = (val: number) => `₹${val.toLocaleString("en-IN")}`;

interface Employee {
  id: string;
  name: string;
  dept: string;
  basicPay: number;
  allowance: number;
  gross: number;
  deductions: number;
  netPay: number;
  bankName: string;
  accountNo: string;
  ifscCode: string;
  status: string;
}

const mockEmployees: Employee[] = [
  { id: "EMP-001", name: "Ramesh Kumar", dept: "Priest", basicPay: 25000, allowance: 5000, gross: 30000, deductions: 2000, netPay: 28000, bankName: "SBI", accountNo: "30123456789", ifscCode: "SBIN0001234", status: "Paid" },
  { id: "EMP-002", name: "Lakshmi Devi", dept: "Administration", basicPay: 22000, allowance: 3000, gross: 25000, deductions: 1500, netPay: 23500, bankName: "HDFC", accountNo: "60112233445", ifscCode: "HDFC0005678", status: "Paid" },
  { id: "EMP-003", name: "Venkat Sharma", dept: "Security", basicPay: 18000, allowance: 2000, gross: 20000, deductions: 1000, netPay: 19000, bankName: "SBI", accountNo: "40112233445", ifscCode: "SBIN0001234", status: "Pending" },
  { id: "EMP-004", name: "Priya Patel", dept: "Accounts", basicPay: 28000, allowance: 4000, gross: 32000, deductions: 2500, netPay: 29500, bankName: "HDFC", accountNo: "50112233445", ifscCode: "HDFC0005678", status: "Pending" },
  { id: "EMP-005", name: "Suresh Reddy", dept: "Maintenance", basicPay: 16000, allowance: 1500, gross: 17500, deductions: 800, netPay: 16700, bankName: "", accountNo: "", ifscCode: "", status: "Pending" },
];

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const FinancePayroll = () => {
  const [selectedMonth, setSelectedMonth] = useState(MONTHS[new Date().getMonth()]);
  const [selectedYear, setSelectedYear] = useState("2026");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [runAllOpen, setRunAllOpen] = useState(false);
  const [viewEmployee, setViewEmployee] = useState<Employee | null>(null);
  const [bulkPreviewOpen, setBulkPreviewOpen] = useState(false);
  const [bulkPreviewData, setBulkPreviewData] = useState<PayrollBulkRemittanceData | null>(null);

  const filtered = mockEmployees.filter((e) => {
    if (statusFilter !== "all" && e.status !== statusFilter) return false;
    if (search && !e.name.toLowerCase().includes(search.toLowerCase()) && !e.dept.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalPayroll = mockEmployees.reduce((s, e) => s + e.netPay, 0);
  const paidCount = mockEmployees.filter((e) => e.status === "Paid").length;
  const pendingCount = mockEmployees.filter((e) => e.status === "Pending").length;
  const pendingAmount = mockEmployees.filter((e) => e.status === "Pending").reduce((s, e) => s + e.netPay, 0);
  const pendingFiltered = filtered.filter((e) => e.status === "Pending");
  const runCount = selectedIds.size > 0 ? selectedIds.size : pendingCount;

  const toggleAll = () => {
    if (pendingFiltered.every((e) => selectedIds.has(e.id))) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(pendingFiltered.map((e) => e.id)));
    }
  };

  const handleRunAll = () => {
    toast.success(`Payroll disbursed for ${runCount} employee(s) — mock`);
    setRunAllOpen(false);
    setSelectedIds(new Set());
  };

  const runPendingEmployees = useMemo(
    () => mockEmployees.filter((e) => e.status === "Pending" && (selectedIds.size === 0 || selectedIds.has(e.id))),
    [selectedIds]
  );
  const runBankEmployees = useMemo(
    () => runPendingEmployees.filter((e) => e.bankName),
    [runPendingEmployees]
  );
  const runCashEmployees = useMemo(
    () => runPendingEmployees.filter((e) => !e.bankName),
    [runPendingEmployees]
  );
  const runTotalAmount = runPendingEmployees.reduce((s, e) => s + e.netPay, 0);
  const runBankAmount = runBankEmployees.reduce((s, e) => s + e.netPay, 0);

  const buildBulkRemittanceSnapshot = () =>
    buildPayrollBulkRemittance({
      month: selectedMonth,
      year: selectedYear,
      employees: runBankEmployees.map((e) => ({
        id: e.id,
        name: e.name,
        accountNo: e.accountNo,
        ifscCode: e.ifscCode,
        netPay: e.netPay,
      })),
    });

  const handleOpenBulkPreview = () => {
    if (runBankEmployees.length === 0) return;
    setBulkPreviewData(buildBulkRemittanceSnapshot());
    setBulkPreviewOpen(true);
  };

  const handleExportBulkExcel = () => {
    if (runBankEmployees.length === 0) {
      toast.error("No bank employees to export");
      return;
    }
    exportPayrollBulkToExcel(buildBulkRemittanceSnapshot());
    toast.success("Payroll bulk remittance exported to Excel (CSV)");
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <Card>
        <CardContent className="p-5">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-xl font-bold">Payroll</h1>
              <p className="text-xs text-muted-foreground mt-0.5">Auto-synced from HR — Priest & Staff salaries</p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="text-xs h-9 w-[130px]"><SelectValue /></SelectTrigger>
                <SelectContent>{MONTHS.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
              </Select>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="text-xs h-9 w-[90px]"><SelectValue /></SelectTrigger>
                <SelectContent>{["2024", "2025", "2026"].map((y) => <SelectItem key={y} value={y}>{y}</SelectItem>)}</SelectContent>
              </Select>
              <Button size="sm" className="text-xs gap-1.5" disabled={pendingCount === 0} onClick={() => setRunAllOpen(true)}>
                <PlayCircle className="h-3.5 w-3.5" /> Run All ({pendingCount})
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: "Total Payroll", value: formatCurrency(totalPayroll), sub: `${mockEmployees.length} employees`, accent: "border-l-gray-300" },
          { label: "Paid", value: `${paidCount}/${mockEmployees.length}`, sub: "Disbursed", accent: "border-l-green-500", color: "text-green-700" },
          { label: "Pending", value: String(pendingCount), sub: "Awaiting payment", accent: "border-l-amber-500", color: "text-amber-700" },
          { label: "Pending Amount", value: formatCurrency(pendingAmount), sub: "To be disbursed", accent: "border-l-red-500", color: "text-red-700" },
          { label: "With Attendance", value: `0/${mockEmployees.length}`, sub: "Prorated salary", accent: "border-l-blue-500", color: "text-blue-700" },
        ].map((s) => (
          <Card key={s.label} className={`border-l-4 ${s.accent}`}>
            <CardContent className="p-4">
              <div className="text-xs text-muted-foreground font-medium mb-1.5">{s.label}</div>
              <div className={`text-2xl font-black leading-tight ${s.color || ""}`}>{s.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{s.sub}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="flex items-center gap-2 flex-wrap px-5 py-4 border-b">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input placeholder="Search employee..." value={search} onChange={(e) => setSearch(e.target.value)} className="text-xs h-9 pl-8" />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="text-xs h-9 w-[130px]"><SelectValue placeholder="All Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Paid">Paid</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" className="text-xs gap-1.5" onClick={() => toast.success("Payroll exported (mock CSV)")}>
              <Download className="h-3.5 w-3.5" /> Export
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-10">
                  <Checkbox
                    checked={pendingFiltered.length > 0 && pendingFiltered.every((e) => selectedIds.has(e.id))}
                    onCheckedChange={toggleAll}
                  />
                </TableHead>
                <TableHead className="text-xs">Employee</TableHead>
                <TableHead className="text-xs">Department</TableHead>
                <TableHead className="text-xs text-right">Basic</TableHead>
                <TableHead className="text-xs text-right">Allowance</TableHead>
                <TableHead className="text-xs text-right">Gross</TableHead>
                <TableHead className="text-xs text-right">Deductions</TableHead>
                <TableHead className="text-xs text-right">Net Pay</TableHead>
                <TableHead className="text-xs">Bank</TableHead>
                <TableHead className="text-xs text-center">Status</TableHead>
                <TableHead className="text-xs text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((e) => (
                <TableRow key={e.id}>
                  <TableCell>
                    {e.status === "Pending" && (
                      <Checkbox
                        checked={selectedIds.has(e.id)}
                        onCheckedChange={() => {
                          setSelectedIds((prev) => {
                            const n = new Set(prev);
                            n.has(e.id) ? n.delete(e.id) : n.add(e.id);
                            return n;
                          });
                        }}
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="text-xs font-medium">{e.name}</div>
                    <div className="text-[10px] text-muted-foreground">{e.id}</div>
                  </TableCell>
                  <TableCell><Badge variant="outline" className="text-[10px]">{e.dept}</Badge></TableCell>
                  <TableCell className="text-xs text-right">{formatCurrency(e.basicPay)}</TableCell>
                  <TableCell className="text-xs text-right">{formatCurrency(e.allowance)}</TableCell>
                  <TableCell className="text-xs text-right font-medium">{formatCurrency(e.gross)}</TableCell>
                  <TableCell className="text-xs text-right text-red-600">{formatCurrency(e.deductions)}</TableCell>
                  <TableCell className="text-xs text-right font-bold">{formatCurrency(e.netPay)}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{e.bankName || "Cash"}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className={e.status === "Paid" ? "bg-green-50 text-green-700 border-green-200" : "bg-amber-50 text-amber-700 border-amber-200"}>
                      {e.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setViewEmployee(e)}>
                      <Eye className="h-3.5 w-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Run All Confirm Modal */}
      <Dialog open={runAllOpen} onOpenChange={setRunAllOpen}>
        <DialogContent className="max-w-lg bg-white border">
          <DialogHeader>
            <DialogTitle>Run Payroll — {selectedMonth} {selectedYear}</DialogTitle>
            <DialogDescription>
              Disburse salary for {runCount} pending employee(s) · Total {formatCurrency(runTotalAmount)}
              {runBankEmployees.length > 0 && ` · ${runBankEmployees.length} NEFT/RTGS (${formatCurrency(runBankAmount)})`}
              {runCashEmployees.length > 0 && ` · ${runCashEmployees.length} cash`}
            </DialogDescription>
          </DialogHeader>

          {runPendingEmployees.length > 1 && (
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="text-xs">Employee</TableHead>
                    <TableHead className="text-xs">Bank</TableHead>
                    <TableHead className="text-xs text-right">Net Pay</TableHead>
                    <TableHead className="text-xs">Mode</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {runPendingEmployees.map((emp) => (
                    <TableRow key={emp.id}>
                      <TableCell className="text-xs font-medium">{emp.name}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{emp.bankName || "—"}</TableCell>
                      <TableCell className="text-xs text-right font-medium">{formatCurrency(emp.netPay)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[10px]">
                          {emp.bankName ? "NEFT/RTGS" : "Cash"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {runCashEmployees.length > 0 && (
            <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs text-amber-900">
              <Banknote className="h-4 w-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Cash disbursement ({runCashEmployees.length})</p>
                <p className="text-amber-800/90 mt-0.5">
                  {runCashEmployees.map((e) => e.name).join(", ")} — no bank on file; pay in cash separately.
                </p>
              </div>
            </div>
          )}

          {runBankEmployees.length > 0 && (
            <div className="rounded-lg border border-blue-200 bg-blue-50/50 px-3 py-3 space-y-2 text-xs text-blue-950">
              <p className="font-semibold">
                Bank remittance — {runBankEmployees.length} employee{runBankEmployees.length > 1 ? "s" : ""} ·{" "}
                {formatCurrency(runBankAmount)}
              </p>
              <p className="text-blue-900/80">
                Temple debit account, date, and employee account details in one bulk form for the bank visit.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={handleOpenBulkPreview}
                  className="text-[11px] text-[#7a3411] hover:text-[#63290d] hover:underline underline-offset-2 font-medium"
                >
                  Preview bulk remittance form →
                </button>
                <button
                  type="button"
                  onClick={handleExportBulkExcel}
                  className="inline-flex items-center gap-1 text-[11px] text-[#7a3411] hover:text-[#63290d] hover:underline underline-offset-2 font-medium"
                >
                  <Download className="h-3 w-3" />
                  Export Excel
                </button>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setRunAllOpen(false)}>Cancel</Button>
            <Button onClick={handleRunAll}>Confirm Disbursement</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <VoucherPrintDialog
        open={bulkPreviewOpen}
        onOpenChange={setBulkPreviewOpen}
        title={`Payroll Bulk Remittance — ${selectedMonth} ${selectedYear}`}
      >
        {bulkPreviewData && <PayrollBulkRemittanceForm data={bulkPreviewData} />}
      </VoucherPrintDialog>

      <Dialog open={!!viewEmployee} onOpenChange={(open) => !open && setViewEmployee(null)}>
        <DialogContent className="max-w-md bg-white border">
          <DialogHeader>
            <DialogTitle>{viewEmployee?.name}</DialogTitle>
            <DialogDescription>{viewEmployee?.id} · {viewEmployee?.dept}</DialogDescription>
          </DialogHeader>
          {viewEmployee && (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Basic Pay</span><span>{formatCurrency(viewEmployee.basicPay)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Allowance</span><span>{formatCurrency(viewEmployee.allowance)}</span></div>
              <div className="flex justify-between font-medium"><span>Gross</span><span>{formatCurrency(viewEmployee.gross)}</span></div>
              <div className="flex justify-between text-red-600"><span>Deductions</span><span>-{formatCurrency(viewEmployee.deductions)}</span></div>
              <div className="flex justify-between font-bold pt-2 border-t"><span>Net Pay</span><span>{formatCurrency(viewEmployee.netPay)}</span></div>
              <div className="flex justify-between pt-1"><span className="text-muted-foreground">Bank</span><span>{viewEmployee.bankName || "Cash"}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Status</span>
                <Badge variant="outline" className={viewEmployee.status === "Paid" ? "bg-green-50 text-green-700 border-green-200" : "bg-amber-50 text-amber-700 border-amber-200"}>{viewEmployee.status}</Badge>
              </div>
            </div>
          )}
          {viewEmployee?.bankName && viewEmployee.status === "Pending" && (
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => {
                  setBulkPreviewData(
                    buildPayrollBulkRemittance({
                      month: selectedMonth,
                      year: selectedYear,
                      employees: [
                        {
                          id: viewEmployee.id,
                          name: viewEmployee.name,
                          accountNo: viewEmployee.accountNo,
                          ifscCode: viewEmployee.ifscCode,
                          netPay: viewEmployee.netPay,
                        },
                      ],
                    })
                  );
                  setBulkPreviewOpen(true);
                }}
                className="text-[11px] text-[#7a3411] hover:underline underline-offset-2 font-medium"
              >
                Preview remittance form →
              </button>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewEmployee(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default FinancePayroll;
