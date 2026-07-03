import { useState, useMemo } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DataTable } from '@/components/ui/data-table';
import { StatusBadge } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { IndianRupee, Users, Clock, AlertTriangle, Download, Eye, Edit, FileText, UserCheck, CalendarDays } from 'lucide-react';
import { employees as dummyEmployees } from '@/data/hr-dummy-data';
import { getEmployees as getStoredEmployees } from '@/lib/hr-employee-store';
import { usePermissions } from '@/hooks/usePermissions';
import { calculateSalaryBreakdown, getAttendanceForPayroll, MONTH_NAMES } from '@/modules/finance/payrollCalculator';
import { financeActions } from '@/modules/finance/financeStore';
import { toast } from 'sonner';

interface SalaryRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  designation: string;
  monthlySalary: number;
  paymentMode: string;
  effectiveFrom: string;
}

interface PayslipRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  month: string;
  year: number;
  monthlySalary: number;
  grossPay: number;
  hra: number;
  da: number;
  ta: number;
  pf: number;
  esi: number;
  pt: number;
  leaveDays: number;
  leaveDeduction: number;
  daysPresent: number;
  totalDays: number;
  attendanceMode: 'actual' | 'full_month';
  netSalary: number;
  status: 'draft' | 'generated' | 'paid' | 'on_hold';
  paidOn?: string;
}

// Build salary records from dummy + stored employees
function buildSalaryRecords(): SalaryRecord[] {
  const storedEmployees = getStoredEmployees();
  const defaultSalaries = [25000, 35000, 18000, 28000, 22000, 20000, 15000, 14000];

  const dummyRecords = dummyEmployees
    .filter(e => e.status === 'active' || e.status === 'on_leave')
    .map((emp, i) => ({
      id: `sal-${emp.id}`,
      employeeId: emp.id,
      employeeName: emp.name,
      department: emp.department,
      designation: emp.designation,
      monthlySalary: defaultSalaries[i] || 15000,
      paymentMode: 'bank',
      effectiveFrom: '2025-04-01',
    }));

  const storedRecords = storedEmployees
    .filter(e => e.status === 'active' || e.status === 'on_leave')
    .map(emp => ({
      id: `sal-${emp.id}`,
      employeeId: emp.id,
      employeeName: emp.name,
      department: emp.department,
      designation: emp.designation,
      monthlySalary: (emp as any).basicSalary || 15000,
      paymentMode: (emp as any).paymentMode || 'bank',
      effectiveFrom: emp.joiningDate || '2025-04-01',
    }));

  return [...dummyRecords, ...storedRecords];
}

const months = MONTH_NAMES;

const generatePayslips = (month: string, year: number, records?: SalaryRecord[]): PayslipRecord[] => {
  const recs = records || buildSalaryRecords();
  const monthIdx = MONTH_NAMES.indexOf(month);
  
  return recs.map(sal => {
    const breakdown = calculateSalaryBreakdown(sal.monthlySalary);
    const attendance = getAttendanceForPayroll(sal.employeeId, sal.employeeName, monthIdx >= 0 ? monthIdx : 0, year);
    
    let proratedGross = breakdown.grossPay;
    let leaveDeduction = 0;
    let leaveDays = 0;
    
    if (attendance.mode === "actual") {
      leaveDays = attendance.totalDays - attendance.daysPresent;
      proratedGross = Math.round((breakdown.grossPay / attendance.totalDays) * attendance.daysPresent);
      leaveDeduction = breakdown.grossPay - proratedGross;
    }
    
    const netSalary = proratedGross - breakdown.totalDeductions;
    
    return {
      id: `ps-${sal.employeeId}-${month}-${year}`,
      employeeId: sal.employeeId,
      employeeName: sal.employeeName,
      department: sal.department,
      month, year,
      monthlySalary: sal.monthlySalary,
      grossPay: breakdown.grossPay,
      hra: breakdown.hra,
      da: breakdown.da,
      ta: breakdown.ta,
      pf: breakdown.pf,
      esi: breakdown.esi,
      pt: breakdown.pt,
      leaveDays,
      leaveDeduction,
      daysPresent: attendance.daysPresent,
      totalDays: attendance.totalDays,
      attendanceMode: attendance.mode,
      netSalary: Math.max(0, netSalary),
      status: 'generated' as const,
    };
  });
};

export default function Payroll() {
  const { checkModuleAccess } = usePermissions();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedMonth, setSelectedMonth] = useState(months[new Date().getMonth()]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const initialRecords = useMemo(() => buildSalaryRecords(), []);
  const [payslips, setPayslips] = useState<PayslipRecord[]>(() => generatePayslips(MONTH_NAMES[new Date().getMonth()], new Date().getFullYear()));
  const [salaryRecords, setSalaryRecords] = useState<SalaryRecord[]>(initialRecords);

  const [viewPayslip, setViewPayslip] = useState<PayslipRecord | null>(null);
  const [viewSalary, setViewSalary] = useState<SalaryRecord | null>(null);
  const [editSalary, setEditSalary] = useState<SalaryRecord | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  if (!checkModuleAccess('payroll')) {
    return <div><PageHeader title="Access Denied" description="You do not have permission to access this module" /></div>;
  }

  const totalPayout = payslips.reduce((s, p) => s + p.netSalary, 0);
  const pending = payslips.filter(p => p.status === 'generated').length;
  const paid = payslips.filter(p => p.status === 'paid').length;
  const onHold = payslips.filter(p => p.status === 'on_hold').length;

  const fmt = (n: number) => `₹${n.toLocaleString('en-IN')}`;

  const handleGeneratePayslips = () => {
    const latest = buildSalaryRecords();
    setSalaryRecords(latest);
    setPayslips(generatePayslips(selectedMonth, selectedYear, latest));
  };

  const handleMarkPaid = (id: string) => {
    const slip = payslips.find(p => p.id === id);
    if (!slip) return;
    // Create finance transaction
    financeActions.refreshPayrollFromHR(slip.month.slice(0, 3), String(slip.year));
    setPayslips(prev => prev.map(p => p.id === id ? { ...p, status: 'paid' as const, paidOn: new Date().toISOString().split('T')[0] } : p));
    toast.success(`${slip.employeeName} salary sent to Finance module`);
  };

  const handleMarkAllPaid = () => {
    setPayslips(prev => prev.map(p => p.status === 'generated' ? { ...p, status: 'paid' as const, paidOn: new Date().toISOString().split('T')[0] } : p));
  };

  const handleSaveSalary = () => {
    if (!editSalary) return;
    setSalaryRecords(prev => prev.map(s => s.id === editSalary.id ? editSalary : s));
    setEditOpen(false);
  };

  const payslipColumns = [
    { key: 'employeeName', label: 'Employee', sortable: true },
    { key: 'department', label: 'Department', sortable: true },
    { key: 'grossPay', label: 'Gross', sortable: true, render: (v: unknown) => fmt(v as number) },
    { key: 'attendanceMode', label: 'Attendance', render: (v: unknown, row: any) => (
      <Badge variant="outline" className={`text-[10px] ${v === 'actual' ? 'text-blue-700 border-blue-200' : 'text-muted-foreground'}`}>
        {v === 'actual' ? `${row.daysPresent}/${row.totalDays}d` : 'Full'}
      </Badge>
    )},
    { key: 'leaveDeduction', label: 'Deductions', render: (v: unknown, row: any) => {
      const total = (v as number) + (row.pf || 0) + (row.esi || 0) + (row.pt || 0);
      return total > 0 ? <span className="text-destructive">-{fmt(total)}</span> : '—';
    }},
    { key: 'netSalary', label: 'Net Pay', sortable: true, render: (v: unknown) => <span className="font-semibold">{fmt(v as number)}</span> },
    {
      key: 'status', label: 'Status', render: (v: unknown) => {
        const map: Record<string, 'success' | 'warning' | 'neutral' | 'destructive'> = { draft: 'neutral', generated: 'warning', paid: 'success', on_hold: 'destructive' };
        const labels: Record<string, string> = { draft: 'Draft', generated: 'Pending', paid: 'Paid', on_hold: 'On Hold' };
        return <StatusBadge variant={map[v as string]}>{labels[v as string]}</StatusBadge>;
      }
    },
  ];

  const salaryColumns = [
    { key: 'employeeName', label: 'Employee', sortable: true },
    { key: 'department', label: 'Department', sortable: true },
    { key: 'designation', label: 'Role' },
    { key: 'monthlySalary', label: 'Monthly Salary', sortable: true, render: (v: unknown) => <span className="font-semibold">{fmt(v as number)}</span> },
    { key: 'paymentMode', label: 'Pay Mode', render: (v: unknown) => <Badge variant="secondary" className="capitalize">{v as string}</Badge> },
    { key: 'effectiveFrom', label: 'Effective From' },
  ];

  return (
    <div>
      <PageHeader
        title="Payroll Management"
        description="Manage monthly salaries and payslips"
        breadcrumbs={[
          { label: 'Hub', href: '/temple-hub' },
          { label: 'People / HR', href: '/temple/people' },
          { label: 'Payroll' },
        ]}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="flex-wrap">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="payslips">Payslips</TabsTrigger>
          <TabsTrigger value="salary">Salary Details</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        {/* Dashboard */}
        <TabsContent value="dashboard" className="m-0 space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Payout', value: fmt(totalPayout), icon: IndianRupee, color: 'text-primary' },
              { label: 'Pending', value: pending, icon: Clock, color: 'text-amber-500' },
              { label: 'Paid', value: paid, icon: Users, color: 'text-green-500' },
              { label: 'On Hold', value: onHold, icon: AlertTriangle, color: 'text-destructive' },
            ].map(s => (
              <Card key={s.label}>
                <CardContent className="p-4 flex items-center gap-3">
                  <s.icon className={`h-8 w-8 ${s.color}`} />
                  <div>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                    <p className="text-xl font-bold text-foreground">{s.value}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader><CardTitle className="text-base">Department-wise Payroll</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Array.from(new Set(payslips.map(p => p.department))).map(dept => {
                  const deptPayslips = payslips.filter(p => p.department === dept);
                  const total = deptPayslips.reduce((s, p) => s + p.netSalary, 0);
                  return (
                    <div key={dept} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                      <div>
                        <p className="font-medium text-foreground">{dept}</p>
                        <p className="text-xs text-muted-foreground">{deptPayslips.length} employees</p>
                      </div>
                      <p className="font-semibold text-foreground">{fmt(total)}</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payslips */}
        <TabsContent value="payslips" className="m-0 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-end">
            <div>
              <Label className="mb-1 block text-xs">Month</Label>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
                <SelectContent>{months.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label className="mb-1 block text-xs">Year</Label>
              <Select value={String(selectedYear)} onValueChange={v => setSelectedYear(Number(v))}>
                <SelectTrigger className="w-[100px]"><SelectValue /></SelectTrigger>
                <SelectContent>{[2024, 2025, 2026].map(y => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <Button size="sm" onClick={handleGeneratePayslips}>
              <FileText className="h-4 w-4 mr-2" />Generate Payslips
            </Button>
            <Button size="sm" variant="outline" onClick={handleMarkAllPaid} disabled={pending === 0}>
              Mark All Paid
            </Button>
          </div>

          <DataTable
            data={payslips}
            columns={payslipColumns}
            searchPlaceholder="Search employees..."
            onRowClick={(row) => setViewPayslip(row)}
            actions={(row) => (
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); setViewPayslip(row); }}>
                  <Eye className="h-4 w-4" />
                </Button>
                {row.status === 'generated' && (
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-green-600" onClick={(e) => { e.stopPropagation(); handleMarkPaid(row.id); }}>
                    <IndianRupee className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}
          />
        </TabsContent>

        {/* Salary Details */}
        <TabsContent value="salary" className="m-0">
          <DataTable
            data={salaryRecords}
            columns={salaryColumns}
            searchPlaceholder="Search employees..."
            onRowClick={(row) => setViewSalary(row)}
            actions={(row) => (
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); setViewSalary(row); }}>
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); setEditSalary(row); setEditOpen(true); }}>
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            )}
          />
        </TabsContent>

        {/* History */}
        <TabsContent value="history" className="m-0">
          <Card>
            <CardHeader><CardTitle className="text-base">Salary History</CardTitle></CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="text-lg font-medium">Salary History</p>
                <p className="text-sm">Month-by-month payroll records will appear here after processing payslips.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* View Payslip Modal */}
      <Dialog open={!!viewPayslip} onOpenChange={() => setViewPayslip(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Payslip — {viewPayslip?.employeeName}</DialogTitle>
          </DialogHeader>
          {viewPayslip && (
            <div className="space-y-4 py-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Period</span>
                <span className="font-medium">{viewPayslip.month} {viewPayslip.year}</span>
              </div>

              {/* Attendance Mode */}
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2">
                  {viewPayslip.attendanceMode === 'actual' ? (
                    <UserCheck className="h-4 w-4 text-blue-600" />
                  ) : (
                    <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="text-xs">
                    {viewPayslip.attendanceMode === 'actual' ? 'Actual Attendance' : 'Full Month'}
                  </span>
                </div>
                <Badge variant="outline" className="text-xs font-mono">
                  {viewPayslip.daysPresent} / {viewPayslip.totalDays} days
                </Badge>
              </div>

              <Separator />

              {/* Earnings */}
              <div className="space-y-1.5">
                <p className="text-[11px] font-semibold text-muted-foreground uppercase">Earnings</p>
                <div className="flex justify-between text-sm">
                  <span>Basic Salary</span>
                  <span>{fmt(viewPayslip.monthlySalary)}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span className="pl-2">+ HRA (40%)</span>
                  <span>{fmt(viewPayslip.hra)}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span className="pl-2">+ DA (20%)</span>
                  <span>{fmt(viewPayslip.da)}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span className="pl-2">+ TA</span>
                  <span>{fmt(viewPayslip.ta)}</span>
                </div>
                <div className="flex justify-between text-sm font-medium pt-1">
                  <span>Gross Pay</span>
                  <span>{fmt(viewPayslip.grossPay)}</span>
                </div>
              </div>

              <Separator />

              {/* Deductions */}
              <div className="space-y-1.5">
                <p className="text-[11px] font-semibold text-muted-foreground uppercase">Deductions</p>
                {viewPayslip.leaveDeduction > 0 && (
                  <div className="flex justify-between text-sm text-destructive">
                    <span>Attendance ({viewPayslip.leaveDays} days absent)</span>
                    <span>-{fmt(viewPayslip.leaveDeduction)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm text-destructive">
                  <span>PF (12%)</span>
                  <span>-{fmt(viewPayslip.pf)}</span>
                </div>
                {viewPayslip.esi > 0 && (
                  <div className="flex justify-between text-sm text-destructive">
                    <span>ESI (0.75%)</span>
                    <span>-{fmt(viewPayslip.esi)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm text-destructive">
                  <span>Professional Tax</span>
                  <span>-{fmt(viewPayslip.pt)}</span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between font-semibold text-lg">
                <span>Net Pay</span>
                <span className="text-primary">{fmt(viewPayslip.netSalary)}</span>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Status: <StatusBadge variant={viewPayslip.status === 'paid' ? 'success' : 'warning'} className="ml-1">{viewPayslip.status === 'paid' ? 'Paid' : 'Pending'}</StatusBadge></span>
                {viewPayslip.paidOn && <span>Paid on: {viewPayslip.paidOn}</span>}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewPayslip(null)}>Close</Button>
            <Button variant="outline"><Download className="h-4 w-4 mr-2" />Download</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Salary Modal */}
      <Dialog open={!!viewSalary} onOpenChange={() => setViewSalary(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Salary Details — {viewSalary?.employeeName}</DialogTitle>
          </DialogHeader>
          {viewSalary && (
            <div className="space-y-3 py-2 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div><Label className="text-xs text-muted-foreground">Department</Label><p className="font-medium">{viewSalary.department}</p></div>
                <div><Label className="text-xs text-muted-foreground">Role</Label><p className="font-medium">{viewSalary.designation}</p></div>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold text-lg">
                <span>Monthly Salary</span>
                <span className="text-primary">{fmt(viewSalary.monthlySalary)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Payment Mode</span>
                <Badge variant="secondary" className="capitalize">{viewSalary.paymentMode}</Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Effective From</span>
                <span>{viewSalary.effectiveFrom}</span>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewSalary(null)}>Close</Button>
            <Button onClick={() => { if (viewSalary) { setEditSalary(viewSalary); setViewSalary(null); setEditOpen(true); } }}>
              <Edit className="h-4 w-4 mr-2" />Edit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Salary Sheet */}
      <Sheet open={editOpen} onOpenChange={setEditOpen}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader><SheetTitle>Edit Salary</SheetTitle></SheetHeader>
          {editSalary && (
            <div className="space-y-4 py-6">
              <p className="font-medium text-foreground">{editSalary.employeeName}</p>
              <p className="text-sm text-muted-foreground">{editSalary.department} — {editSalary.designation}</p>
              <Separator />
              <div className="form-field">
                <Label className="form-label">Monthly Salary (₹)</Label>
                <Input type="number" value={editSalary.monthlySalary} onChange={e => setEditSalary({ ...editSalary, monthlySalary: Number(e.target.value) })} />
              </div>
              <div className="form-field">
                <Label className="form-label">Payment Mode</Label>
                <Select value={editSalary.paymentMode} onValueChange={v => setEditSalary({ ...editSalary, paymentMode: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bank">Bank Transfer</SelectItem>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="cheque">Cheque</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="form-field">
                <Label className="form-label">Effective From</Label>
                <Input type="date" value={editSalary.effectiveFrom} onChange={e => setEditSalary({ ...editSalary, effectiveFrom: e.target.value })} />
              </div>
            </div>
          )}
          <SheetFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveSalary}>Save Changes</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
