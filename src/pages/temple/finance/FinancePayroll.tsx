import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Users, IndianRupee, Search, Download, RefreshCw, PlayCircle, CheckCircle2, AlertTriangle, Eye, CalendarDays, UserCheck, Banknote, FileDown } from "lucide-react";
import { toast } from "sonner";
import { exportToCSV } from "@/utils/exportCSV";
import { financeSelectors, financeActions } from "@/modules/finance/financeStore";
import { MONTH_NAMES } from "@/modules/finance/payrollCalculator";
import type { PayrollRecord } from "@/modules/finance/types";

const formatCurrency = (val: number) => `₹${val.toLocaleString("en-IN")}`;

const FinancePayroll = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [, setTick] = useState(0);

  // Month/Year selectors
  const [selectedMonth, setSelectedMonth] = useState(MONTH_NAMES[new Date().getMonth()]);
  const [selectedYear, setSelectedYear] = useState(String(new Date().getFullYear()));

  // Selection for bulk actions
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Confirm dialogs
  const [showBulkConfirm, setShowBulkConfirm] = useState(false);
  const [showRunAllConfirm, setShowRunAllConfirm] = useState(false);
  const [showSingleConfirm, setShowSingleConfirm] = useState<{ id: string; name: string; amount: number } | null>(null);
  const [viewDetail, setViewDetail] = useState<PayrollRecord | null>(null);

  const employees = financeSelectors.getPayroll();
  const accounts = financeSelectors.getAccounts();
  const payableAccounts = accounts.filter(a => a.type === "Asset" && (a.accountCategory === "Bank" || a.accountCategory === "Cash"));
  const defaultBankId = payableAccounts.find(a => a.accountCategory === "Bank")?.id || payableAccounts[0]?.id || "ACC-002";
  const [sourceAccountId, setSourceAccountId] = useState<string>(defaultBankId);
  const sourceAccount = accounts.find(a => a.id === sourceAccountId);

  const filtered = employees.filter(e => {
    if (statusFilter !== "all" && e.status !== statusFilter) return false;
    if (searchTerm && !e.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) && !e.role.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const totalPayroll = employees.reduce((s, e) => s + e.netPay, 0);
  const paidCount = employees.filter(e => e.status === "Paid").length;
  const pendingCount = employees.filter(e => e.status === "Pending" || e.status === "Processing").length;
  const pendingAmount = employees.filter(e => e.status !== "Paid").reduce((s, e) => s + e.netPay, 0);
  const attendanceCount = employees.filter(e => e.attendanceMode === "actual").length;

  const pendingFiltered = filtered.filter(e => e.status === "Pending" || e.status === "Processing");
  const selectedPending = pendingFiltered.filter(e => selectedIds.has(e.id));
  const selectedAmount = selectedPending.reduce((s, e) => s + e.netPay, 0);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedIds.size === pendingFiltered.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(pendingFiltered.map(e => e.id)));
    }
  };

  const handleSinglePay = () => {
    if (!showSingleConfirm) return;
    financeActions.payrollMarkPaid(showSingleConfirm.id, sourceAccountId, sourceAccount?.name);
    toast.success(`${showSingleConfirm.name} salary paid — ${formatCurrency(showSingleConfirm.amount)} expense created`);
    setShowSingleConfirm(null);
    setSelectedIds(prev => { const n = new Set(prev); n.delete(showSingleConfirm.id); return n; });
    setTick(t => t + 1);
  };

  const handleBulkPay = () => {
    let count = 0;
    for (const rec of selectedPending) {
      financeActions.payrollMarkPaid(rec.id, sourceAccountId, sourceAccount?.name);
      count++;
    }
    toast.success(`${count} salaries paid — ${formatCurrency(selectedAmount)} total expense created`);
    setShowBulkConfirm(false);
    setSelectedIds(new Set());
    setTick(t => t + 1);
  };

  const handleRunAll = () => {
    const count = financeActions.payrollBulkPay(sourceAccountId, sourceAccount?.name);
    if (count === 0) {
      toast.info("No pending payroll to process");
    } else {
      toast.success(`All ${count} salaries paid — ₹${pendingAmount.toLocaleString("en-IN")} total expense created & ledger updated`);
    }
    setShowRunAllConfirm(false);
    setSelectedIds(new Set());
    setTick(t => t + 1);
  };

  const handleSync = () => {
    const monthShort = selectedMonth.slice(0, 3);
    const count = financeActions.refreshPayrollFromHR(monthShort, selectedYear);
    toast.success(`Synced ${count} employee(s) for ${selectedMonth} ${selectedYear}`);
    setTick(t => t + 1);
  };

  /** Generate a generic bank-advice CSV (NEFT bulk upload format).
   *  Works as universal template — uploads to most Indian bank corporate portals
   *  (SBI CINB, HDFC ENet, ICICI CIB) after minor column header tweak. */
  const downloadBankAdvice = (records: PayrollRecord[], label: string) => {
    const bankRecs = records.filter(r => (r.paymentMode || "bank").toLowerCase() !== "cash" && r.bankAccountNumber);
    const cashRecs = records.filter(r => (r.paymentMode || "bank").toLowerCase() === "cash" || !r.bankAccountNumber);
    if (bankRecs.length === 0) {
      toast.warning("No bank-payable employees in selection. Cash payouts use the disbursement sheet.");
      return;
    }
    const refDate = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    exportToCSV(
      `bank-advice-${label}-${refDate}`,
      ["Sl No", "Beneficiary Name", "Beneficiary A/c No", "IFSC Code", "Bank Name", "Amount (INR)", "Payment Mode", "Reference / Narration", "Email"],
      bankRecs.map((r, i) => [
        String(i + 1),
        r.employeeName,
        r.bankAccountNumber || "",
        r.ifscCode || "",
        r.bankName || "",
        r.netPay.toFixed(2),
        r.netPay >= 200000 ? "RTGS" : "NEFT",
        `Salary ${r.month} ${r.year} - ${r.id}`,
        "",
      ]),
    );
    const total = bankRecs.reduce((s, r) => s + r.netPay, 0);
    toast.success(`Bank advice ready — ${bankRecs.length} beneficiaries, ${formatCurrency(total)}. Upload to your bank portal.${cashRecs.length ? ` (${cashRecs.length} cash payout(s) excluded.)` : ""}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" /> Payroll
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Auto-synced from HR — calculates with real attendance when available
          </p>
        </div>
        <div className="flex gap-2 flex-wrap items-end">
          <div className="flex gap-1.5 items-center">
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-[120px] h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>{MONTH_NAMES.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-[80px] h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>{["2024", "2025", "2026", "2027"].map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <Button variant="outline" size="sm" className="gap-1.5" onClick={handleSync}>
            <RefreshCw className="h-3.5 w-3.5" /> Sync HR
          </Button>
          {pendingCount > 0 && (
            <Button size="sm" className="gap-1.5" onClick={() => setShowRunAllConfirm(true)}>
              <PlayCircle className="h-3.5 w-3.5" /> Run All ({pendingCount})
            </Button>
          )}
          {pendingCount > 0 && (
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => downloadBankAdvice(employees.filter(e => e.status !== "Paid"), `pending-${selectedMonth}-${selectedYear}`)}>
              <FileDown className="h-3.5 w-3.5" /> Bank Advice
            </Button>
          )}
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => {
            exportToCSV("payroll",
              ["ID", "Employee", "Role", "Department", "Month", "Year", "Basic", "Gross", "Deductions", "Net Pay", "Status", "Days Present", "Total Days"],
              filtered.map(e => [e.id, e.employeeName, e.role, e.department, e.month, e.year, String(e.basicSalary), String(e.salary.grossPay), String(e.salary.totalDeductions), String(e.netPay), e.status, String(e.daysPresent), String(e.totalDays)])
            );
            toast.success(`Exported ${filtered.length} payroll records`);
          }}>
            <Download className="h-3.5 w-3.5" /> Export
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <Card className="border-l-4 border-l-primary">
          <CardContent className="p-4">
            <span className="text-[11px] text-muted-foreground">Total Payroll</span>
            <p className="text-lg font-bold">{formatCurrency(totalPayroll)}</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <span className="text-[11px] text-muted-foreground">Paid</span>
            <p className="text-lg font-bold text-green-700">{paidCount} / {employees.length}</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="p-4">
            <span className="text-[11px] text-muted-foreground">Pending</span>
            <p className="text-lg font-bold text-amber-600">{pendingCount}</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-red-400">
          <CardContent className="p-4">
            <span className="text-[11px] text-muted-foreground">Pending Amount</span>
            <p className="text-lg font-bold text-red-600">{formatCurrency(pendingAmount)}</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-400">
          <CardContent className="p-4">
            <span className="text-[11px] text-muted-foreground">With Attendance</span>
            <p className="text-lg font-bold text-blue-600">{attendanceCount} / {employees.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search employee..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-9" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Paid">Paid</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm" className="gap-1.5" onClick={() => {
          exportToCSV("payroll",
            ["ID", "Employee", "Role", "Department", "Month", "Year", "Basic", "Gross", "Deductions", "Net Pay", "Status", "Days Present", "Total Days"],
            filtered.map(e => [e.id, e.employeeName, e.role, e.department, e.month, e.year, String(e.basicSalary), String(e.salary.grossPay), String(e.salary.totalDeductions), String(e.netPay), e.status, String(e.daysPresent), String(e.totalDays)])
          );
          toast.success(`Exported ${filtered.length} payroll records`);
        }}>
          <Download className="h-3.5 w-3.5" /> Export
        </Button>
      </div>

      {/* Bulk selection bar */}
      {selectedIds.size > 0 && (
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">{selectedIds.size} selected</span>
              <span className="text-sm text-muted-foreground">— {formatCurrency(selectedAmount)}</span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setSelectedIds(new Set())}>Clear</Button>
              <Button variant="outline" size="sm" className="gap-1.5" onClick={() => downloadBankAdvice(selectedPending, `selected-${selectedMonth}-${selectedYear}`)}>
                <FileDown className="h-3.5 w-3.5" /> Bank Advice
              </Button>
              <Button size="sm" className="gap-1.5" onClick={() => setShowBulkConfirm(true)}>
                <IndianRupee className="h-3.5 w-3.5" /> Pay Selected
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Table */}
      <TooltipProvider>
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10">
                      {pendingFiltered.length > 0 && (
                        <Checkbox
                          checked={selectedIds.size === pendingFiltered.length && pendingFiltered.length > 0}
                          onCheckedChange={toggleAll}
                        />
                      )}
                    </TableHead>
                    <TableHead className="text-xs">Employee</TableHead>
                    <TableHead className="text-xs">Department</TableHead>
                    <TableHead className="text-xs text-center">Attendance</TableHead>
                    <TableHead className="text-xs text-right">Gross</TableHead>
                    <TableHead className="text-xs text-right">Deductions</TableHead>
                    <TableHead className="text-xs text-right">Net Pay</TableHead>
                    <TableHead className="text-xs text-center">Use Attendance</TableHead>
                    <TableHead className="text-xs text-center">Status</TableHead>
                    <TableHead className="text-xs text-center">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map(e => (
                    <TableRow key={e.id} className={selectedIds.has(e.id) ? "bg-primary/5" : ""}>
                      <TableCell>
                        {e.status !== "Paid" && (
                          <Checkbox
                            checked={selectedIds.has(e.id)}
                            onCheckedChange={() => toggleSelect(e.id)}
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-xs font-medium">{e.employeeName}</p>
                          <p className="text-[10px] text-muted-foreground">{e.role}</p>
                        </div>
                      </TableCell>
                      <TableCell><Badge variant="secondary" className="text-[10px]">{e.department}</Badge></TableCell>
                      <TableCell className="text-xs text-center">{e.daysPresent}/{e.totalDays}</TableCell>
                      <TableCell className="text-xs text-right">{formatCurrency(e.salary?.grossPay || e.basicSalary)}</TableCell>
                      <TableCell className="text-xs text-right text-destructive">-{formatCurrency(e.deductions)}</TableCell>
                      <TableCell className="text-xs text-right font-bold">{formatCurrency(e.netPay)}</TableCell>
                      <TableCell className="text-center">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center justify-center gap-1.5">
                              <Switch
                                checked={e.attendanceMode === "actual"}
                                disabled={e.status === "Paid"}
                                onCheckedChange={() => {
                                  financeActions.toggleAttendanceMode(e.id);
                                  setTick(t => t + 1);
                                  toast.info(`${e.employeeName}: switched to ${e.attendanceMode === "actual" ? "full month" : "attendance-based"} pay`);
                                }}
                                className="scale-75"
                              />
                              <span className="text-[10px] text-muted-foreground w-8">
                                {e.attendanceMode === "actual" ? "On" : "Off"}
                              </span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            {e.attendanceMode === "actual"
                              ? `Attendance ON — prorated ${e.daysPresent}/${e.totalDays} days. Toggle off for full month.`
                              : "Attendance OFF — full month salary. Toggle on to prorate by attendance."}
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className={`text-[10px] ${
                          e.status === "Paid" ? "bg-green-50 text-green-700 border-green-200" :
                          "bg-amber-50 text-amber-700 border-amber-200"
                        }`}>{e.status}</Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => setViewDetail(e)}>
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                          {(e.status === "Pending" || e.status === "Processing") && (
                            <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={() => setShowSingleConfirm({ id: e.id, name: e.employeeName, amount: e.netPay })}>
                              <IndianRupee className="h-3 w-3" /> Pay
                            </Button>
                          )}
                          {e.status === "Paid" && e.paidDate && (
                            <span className="text-[10px] text-muted-foreground">{e.paidDate}</span>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </TooltipProvider>

      {/* Salary Breakdown Detail Modal */}
      <Dialog open={!!viewDetail} onOpenChange={() => setViewDetail(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <IndianRupee className="h-5 w-5 text-primary" />
              Salary Breakdown — {viewDetail?.employeeName}
            </DialogTitle>
            <DialogDescription>
              {viewDetail?.month} {viewDetail?.year} • {viewDetail?.department} • {viewDetail?.role}
            </DialogDescription>
          </DialogHeader>
          {viewDetail && (
            <div className="space-y-4 py-2">
              {/* Attendance */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2">
                  {viewDetail.attendanceMode === "actual" ? (
                    <UserCheck className="h-4 w-4 text-blue-600" />
                  ) : (
                    <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  )}
                  <div>
                    <p className="text-xs font-medium">
                      {viewDetail.attendanceMode === "actual" ? "Actual Attendance" : "Full Month (No Attendance Data)"}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {viewDetail.attendanceMode === "actual"
                        ? "Salary prorated based on HR attendance records"
                        : "Full salary — attendance tracking not available for this employee"}
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs font-mono">
                  {viewDetail.daysPresent} / {viewDetail.totalDays} days
                </Badge>
              </div>

              {/* Earnings */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Earnings</p>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span>Basic Salary</span>
                    <span>{formatCurrency(viewDetail.basicSalary)}</span>
                  </div>
                  {viewDetail.salary && (
                    <>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span className="pl-2">+ HRA (40%)</span>
                        <span>{formatCurrency(viewDetail.salary.hra)}</span>
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span className="pl-2">+ DA (20%)</span>
                        <span>{formatCurrency(viewDetail.salary.da)}</span>
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span className="pl-2">+ TA (Fixed)</span>
                        <span>{formatCurrency(viewDetail.salary.ta)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between text-sm font-medium">
                        <span>Gross Pay</span>
                        <span>{formatCurrency(viewDetail.salary.grossPay)}</span>
                      </div>
                      {viewDetail.attendanceMode === "actual" && (
                        <div className="flex justify-between text-sm text-blue-600">
                          <span>Prorated ({viewDetail.daysPresent}/{viewDetail.totalDays} days)</span>
                          <span>{formatCurrency(Math.round((viewDetail.salary.grossPay / viewDetail.totalDays) * viewDetail.daysPresent))}</span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Deductions */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Deductions</p>
                <div className="space-y-1.5">
                  {viewDetail.salary && (
                    <>
                      <div className="flex justify-between text-sm text-destructive">
                        <span>PF (12% of Basic)</span>
                        <span>-{formatCurrency(viewDetail.salary.pf)}</span>
                      </div>
                      {viewDetail.salary.esi > 0 && (
                        <div className="flex justify-between text-sm text-destructive">
                          <span>ESI (0.75%)</span>
                          <span>-{formatCurrency(viewDetail.salary.esi)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm text-destructive">
                        <span>Professional Tax</span>
                        <span>-{formatCurrency(viewDetail.salary.pt)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between text-sm font-medium text-destructive">
                        <span>Total Deductions</span>
                        <span>-{formatCurrency(viewDetail.salary.totalDeductions)}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <Separator />

              {/* Net Pay */}
              <div className="flex justify-between text-lg font-bold">
                <span>Net Pay</span>
                <span className="text-primary">{formatCurrency(viewDetail.netPay)}</span>
              </div>

              {/* Bank Details */}
              {viewDetail.bankName && (
                <div className="p-3 rounded-lg bg-muted/30 space-y-1">
                  <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wide">Payment Details</p>
                  <div className="flex justify-between text-xs">
                    <span>Bank</span><span className="font-medium">{viewDetail.bankName}</span>
                  </div>
                  {viewDetail.bankAccountNumber && (
                    <div className="flex justify-between text-xs">
                      <span>Account</span><span className="font-mono">{viewDetail.bankAccountNumber}</span>
                    </div>
                  )}
                  {viewDetail.ifscCode && (
                    <div className="flex justify-between text-xs">
                      <span>IFSC</span><span className="font-mono">{viewDetail.ifscCode}</span>
                    </div>
                  )}
                </div>
              )}

              {viewDetail.status === "Paid" && viewDetail.transactionId && (
                <div className="flex justify-between text-xs text-muted-foreground pt-1">
                  <span>Transaction: <span className="font-mono">{viewDetail.transactionId}</span></span>
                  {viewDetail.paidDate && <span>Paid on: {viewDetail.paidDate}</span>}
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDetail(null)}>Close</Button>
            {viewDetail && viewDetail.status !== "Paid" && (
              <Button onClick={() => { setShowSingleConfirm({ id: viewDetail.id, name: viewDetail.employeeName, amount: viewDetail.netPay }); setViewDetail(null); }} className="gap-1.5">
                <IndianRupee className="h-4 w-4" /> Pay Now
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Single Pay Confirmation */}
      <Dialog open={!!showSingleConfirm} onOpenChange={() => setShowSingleConfirm(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <IndianRupee className="h-5 w-5 text-primary" /> Confirm Salary Payment
            </DialogTitle>
            <DialogDescription>This will create an expense transaction and update the ledger.</DialogDescription>
          </DialogHeader>
          {showSingleConfirm && (
            <div className="space-y-3 py-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Employee</span>
                <span className="font-medium">{showSingleConfirm.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Net Pay</span>
                <span className="font-bold text-primary">{formatCurrency(showSingleConfirm.amount)}</span>
              </div>
              <div className="space-y-1.5">
                <span className="text-xs text-muted-foreground">Pay From Account</span>
                <Select value={sourceAccountId} onValueChange={setSourceAccountId}>
                  <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {payableAccounts.map(a => (
                      <SelectItem key={a.id} value={a.id}>
                        {a.name} ({a.accountCategory}) — Bal {formatCurrency(a.currentBalance)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {showSingleConfirm && (() => {
                  const r = employees.find(e => e.id === showSingleConfirm.id);
                  const isCash = (r?.paymentMode || "bank").toLowerCase() === "cash";
                  return (
                    <p className="text-[11px] text-muted-foreground">
                      Employee pay mode: <span className="font-medium">{isCash ? "Cash" : `Bank — ${r?.bankName || "—"} ${r?.bankAccountNumber || ""}`}</span>
                    </p>
                  );
                })()}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSingleConfirm(null)}>Cancel</Button>
            <Button onClick={handleSinglePay} className="gap-1.5">
              <CheckCircle2 className="h-4 w-4" /> Confirm Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Pay Confirmation */}
      <Dialog open={showBulkConfirm} onOpenChange={setShowBulkConfirm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" /> Bulk Salary Payment
            </DialogTitle>
            <DialogDescription>This will process payments for all selected employees.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Employees</span>
              <span className="font-medium">{selectedPending.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Amount</span>
              <span className="font-bold text-primary">{formatCurrency(selectedAmount)}</span>
            </div>
            <div className="border rounded-lg p-3 max-h-40 overflow-y-auto space-y-1">
              {selectedPending.map(e => (
                <div key={e.id} className="flex justify-between text-xs">
                  <span>{e.employeeName}</span>
                  <span className="font-medium">{formatCurrency(e.netPay)}</span>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBulkConfirm(false)}>Cancel</Button>
            <Button onClick={handleBulkPay} className="gap-1.5">
              <PlayCircle className="h-4 w-4" /> Pay All {selectedPending.length}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Run All Confirmation */}
      <Dialog open={showRunAllConfirm} onOpenChange={setShowRunAllConfirm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <PlayCircle className="h-5 w-5 text-primary" /> Run Full Payroll
            </DialogTitle>
            <DialogDescription>This will process salary payments for ALL pending employees and create expense transactions in the ledger.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Pending Employees</span>
              <span className="font-medium">{pendingCount}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Amount</span>
              <span className="font-bold text-primary">{formatCurrency(pendingAmount)}</span>
            </div>
            <div className="border rounded-lg p-3 max-h-48 overflow-y-auto space-y-1">
              {employees.filter(e => e.status === "Pending" || e.status === "Processing").map(e => (
                <div key={e.id} className="flex justify-between text-xs">
                  <div>
                    <span>{e.employeeName}</span>
                    <Badge variant="outline" className="ml-1.5 text-[9px] scale-90">
                      {e.attendanceMode === "actual" ? `${e.daysPresent}/${e.totalDays}d` : "Full"}
                    </Badge>
                  </div>
                  <span className="font-medium">{formatCurrency(e.netPay)}</span>
                </div>
              ))}
            </div>
            <div className="space-y-1.5">
              <span className="text-xs text-muted-foreground">Pay From Account</span>
              <Select value={sourceAccountId} onValueChange={setSourceAccountId}>
                <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {payableAccounts.map(a => (
                    <SelectItem key={a.id} value={a.id}>
                      {a.name} ({a.accountCategory}) — Bal {formatCurrency(a.currentBalance)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {(() => {
                const pending = employees.filter(e => e.status === "Pending" || e.status === "Processing");
                const bankCount = pending.filter(e => (e.paymentMode || "bank").toLowerCase() !== "cash").length;
                const cashCount = pending.length - bankCount;
                return (
                  <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <Banknote className="h-3 w-3" /> {bankCount} bank transfer(s), {cashCount} cash payout(s). Cash items always settle from Cash on Hand.
                  </p>
                );
              })()}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRunAllConfirm(false)}>Cancel</Button>
            <Button onClick={handleRunAll} className="gap-1.5">
              <CheckCircle2 className="h-4 w-4" /> Confirm & Pay All
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FinancePayroll;
