import { useState, useMemo } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DataTable } from '@/components/ui/data-table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  IndianRupee, Edit, Eye, Download, TrendingUp, Users, FileText, History,
  ArrowUpRight, ArrowDownRight, CalendarDays, Wallet
} from 'lucide-react';
import { employees as dummyEmployees } from '@/data/hr-dummy-data';
import { getEmployees as getStoredEmployees } from '@/lib/hr-employee-store';
import { calculateSalaryBreakdown, MONTH_NAMES } from '@/modules/finance/payrollCalculator';
import { toast } from 'sonner';
import { format } from 'date-fns';

// ─── Types ───
interface SalaryStructure {
  employeeId: string;
  employeeName: string;
  department: string;
  designation: string;
  basicSalary: number;
  hra: number;
  da: number;
  ta: number;
  grossPay: number;
  pf: number;
  esi: number;
  pt: number;
  totalDeductions: number;
  netPay: number;
  paymentMode: string;
  bankName?: string;
  accountNumber?: string;
  effectiveFrom: string;
  status: 'active' | 'inactive';
}

interface SalaryRevision {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  previousBasic: number;
  newBasic: number;
  changePercent: number;
  effectiveFrom: string;
  reason: string;
  approvedBy: string;
  date: string;
}

interface Payslip {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  month: string;
  year: number;
  basicSalary: number;
  hra: number;
  da: number;
  ta: number;
  grossPay: number;
  pf: number;
  esi: number;
  pt: number;
  netPay: number;
  status: 'generated' | 'sent' | 'viewed';
  generatedOn: string;
}

// ─── Build data from employees ───
function buildSalaryStructures(): SalaryStructure[] {
  const stored = getStoredEmployees();
  const all = [...dummyEmployees, ...stored].filter(e => e.status === 'active' || e.status === 'on_leave');

  return all.map(emp => {
    const basic = emp.basicSalary || 15000;
    const breakdown = calculateSalaryBreakdown(basic);
    return {
      employeeId: emp.id,
      employeeName: emp.name,
      department: emp.department,
      designation: emp.designation,
      basicSalary: basic,
      ...breakdown,
      netPay: breakdown.grossPay - breakdown.totalDeductions,
      paymentMode: emp.paymentMode || 'bank',
      bankName: emp.bankName,
      accountNumber: emp.bankAccountNumber,
      effectiveFrom: '2025-04-01',
      status: 'active',
    };
  });
}

// ─── Sample revision history ───
const sampleRevisions: SalaryRevision[] = [
  { id: 'rev-1', employeeId: 'emp-1', employeeName: 'Ramesh Kumar', department: 'Rituals', previousBasic: 22000, newBasic: 25000, changePercent: 13.6, effectiveFrom: '2025-04-01', reason: 'Annual Increment', approvedBy: 'Trust Secretary', date: '2025-03-15' },
  { id: 'rev-2', employeeId: 'emp-2', employeeName: 'Lakshmi Devi', department: 'Admin', previousBasic: 18000, newBasic: 20000, changePercent: 11.1, effectiveFrom: '2025-04-01', reason: 'Annual Increment', approvedBy: 'Trust Secretary', date: '2025-03-15' },
  { id: 'rev-3', employeeId: 'emp-3', employeeName: 'Suresh Sharma', department: 'Rituals', previousBasic: 15000, newBasic: 18000, changePercent: 20.0, effectiveFrom: '2025-01-01', reason: 'Promotion', approvedBy: 'HR Manager', date: '2024-12-20' },
];

// ─── Sample payslips ───
function buildPayslips(): Payslip[] {
  const structures = buildSalaryStructures();
  const payslips: Payslip[] = [];
  const months = ['January', 'February', 'March'];

  structures.slice(0, 6).forEach(s => {
    months.forEach((month, idx) => {
      payslips.push({
        id: `ps-${s.employeeId}-${idx}`,
        employeeId: s.employeeId,
        employeeName: s.employeeName,
        department: s.department,
        month,
        year: 2025,
        basicSalary: s.basicSalary,
        hra: s.hra,
        da: s.da,
        ta: s.ta,
        grossPay: s.grossPay,
        pf: s.pf,
        esi: s.esi,
        pt: s.pt,
        netPay: s.netPay,
        status: idx < 2 ? 'sent' : 'generated',
        generatedOn: `2025-${String(idx + 1).padStart(2, '0')}-28`,
      });
    });
  });
  return payslips;
}

const fmt = (n: number) => `₹${n.toLocaleString('en-IN')}`;

export default function SalaryCompensation() {
  const [activeTab, setActiveTab] = useState('register');
  const [structures] = useState(buildSalaryStructures);
  const [revisions] = useState(sampleRevisions);
  const [payslips] = useState(buildPayslips);
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');
  const [selectedEmployee, setSelectedEmployee] = useState<SalaryStructure | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isRevisionOpen, setIsRevisionOpen] = useState(false);
  const [selectedPayslip, setSelectedPayslip] = useState<Payslip | null>(null);
  const [payslipMonth, setPayslipMonth] = useState('March');
  const [payslipYear, setPayslipYear] = useState('2025');

  // Revision form
  const [revisionForm, setRevisionForm] = useState({ employeeId: '', newBasic: '', reason: 'Annual Increment', effectiveFrom: '' });

  const departments = useMemo(() => {
    const depts = new Set(structures.map(s => s.department));
    return ['all', ...Array.from(depts)];
  }, [structures]);

  const filteredStructures = useMemo(() => {
    return structures.filter(s => {
      const matchSearch = !searchTerm || s.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) || s.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
      const matchDept = deptFilter === 'all' || s.department === deptFilter;
      return matchSearch && matchDept;
    });
  }, [structures, searchTerm, deptFilter]);

  const filteredPayslips = useMemo(() => {
    return payslips.filter(p => p.month === payslipMonth && String(p.year) === payslipYear);
  }, [payslips, payslipMonth, payslipYear]);

  // Summary stats
  const totalPayroll = structures.reduce((sum, s) => sum + s.netPay, 0);
  const avgSalary = structures.length ? Math.round(totalPayroll / structures.length) : 0;
  const totalGross = structures.reduce((sum, s) => sum + s.grossPay, 0);
  const totalDeductions = structures.reduce((sum, s) => sum + s.totalDeductions, 0);

  const handleViewDetails = (s: SalaryStructure) => {
    setSelectedEmployee(s);
    setIsDetailOpen(true);
  };

  const handleRevision = (s: SalaryStructure) => {
    setRevisionForm({ employeeId: s.employeeId, newBasic: String(s.basicSalary), reason: 'Annual Increment', effectiveFrom: '' });
    setSelectedEmployee(s);
    setIsRevisionOpen(true);
  };

  const handleSaveRevision = () => {
    if (!revisionForm.newBasic || !revisionForm.effectiveFrom) {
      toast.error('Please fill all required fields');
      return;
    }
    toast.success('Salary revision saved successfully');
    setIsRevisionOpen(false);
  };

  const handleExportRegister = () => {
    const rows = filteredStructures.map(s => [s.employeeId, s.employeeName, s.department, s.designation, s.basicSalary, s.hra, s.da, s.ta, s.grossPay, s.pf, s.esi, s.pt, s.totalDeductions, s.netPay, s.paymentMode].join(','));
    const csv = ['Employee ID,Name,Department,Designation,Basic,HRA,DA,TA,Gross,PF,ESI,PT,Total Deductions,Net Pay,Payment Mode', ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'salary_register.csv';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Salary register exported');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Salary & Compensation"
        description="Manage employee salary structures, revisions, and payslips"
        breadcrumbs={[
          { label: 'Hub', href: '/temple-hub' },
          { label: 'People / HR', href: '/temple/people' },
          { label: 'Salary & Compensation' },
        ]}
        actions={
          <Button variant="outline" size="sm" onClick={handleExportRegister} className="gap-2">
            <Download className="h-4 w-4" />Export Register
          </Button>
        }
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4 pb-3 px-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium">Monthly Payroll</p>
                <p className="text-xl font-bold text-foreground">{fmt(totalPayroll)}</p>
              </div>
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <Wallet className="h-4 w-4 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3 px-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium">Avg. Net Salary</p>
                <p className="text-xl font-bold text-foreground">{fmt(avgSalary)}</p>
              </div>
              <div className="h-9 w-9 rounded-lg bg-accent/10 flex items-center justify-center">
                <IndianRupee className="h-4 w-4 text-accent-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3 px-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium">Total Gross</p>
                <p className="text-xl font-bold text-foreground">{fmt(totalGross)}</p>
              </div>
              <div className="h-9 w-9 rounded-lg bg-green-500/10 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3 px-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium">Total Deductions</p>
                <p className="text-xl font-bold text-foreground">{fmt(totalDeductions)}</p>
              </div>
              <div className="h-9 w-9 rounded-lg bg-destructive/10 flex items-center justify-center">
                <ArrowDownRight className="h-4 w-4 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="register" className="gap-1.5"><Users className="h-3.5 w-3.5" />Salary Register</TabsTrigger>
          <TabsTrigger value="revisions" className="gap-1.5"><History className="h-3.5 w-3.5" />Revisions</TabsTrigger>
          <TabsTrigger value="payslips" className="gap-1.5"><FileText className="h-3.5 w-3.5" />Payslips</TabsTrigger>
        </TabsList>

        {/* ─── Salary Register Tab ─── */}
        <TabsContent value="register" className="space-y-4">
          <div className="flex items-center gap-3 flex-wrap">
            <Input placeholder="Search employee..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="max-w-xs" />
            <Select value={deptFilter} onValueChange={setDeptFilter}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                {departments.map(d => <SelectItem key={d} value={d}>{d === 'all' ? 'All Departments' : d}</SelectItem>)}
              </SelectContent>
            </Select>
            <Badge variant="outline" className="ml-auto">{filteredStructures.length} employees</Badge>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left p-3 font-semibold text-muted-foreground">Employee</th>
                      <th className="text-left p-3 font-semibold text-muted-foreground">Department</th>
                      <th className="text-right p-3 font-semibold text-muted-foreground">Basic</th>
                      <th className="text-right p-3 font-semibold text-muted-foreground">HRA</th>
                      <th className="text-right p-3 font-semibold text-muted-foreground">DA</th>
                      <th className="text-right p-3 font-semibold text-muted-foreground">TA</th>
                      <th className="text-right p-3 font-semibold text-muted-foreground">Gross</th>
                      <th className="text-right p-3 font-semibold text-muted-foreground">Deductions</th>
                      <th className="text-right p-3 font-semibold text-muted-foreground">Net Pay</th>
                      <th className="text-center p-3 font-semibold text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStructures.map(s => (
                      <tr key={s.employeeId} className="border-b hover:bg-muted/30 transition-colors">
                        <td className="p-3">
                          <div>
                            <p className="font-medium text-foreground">{s.employeeName}</p>
                            <p className="text-xs text-muted-foreground">{s.designation}</p>
                          </div>
                        </td>
                        <td className="p-3 text-muted-foreground">{s.department}</td>
                        <td className="p-3 text-right font-mono">{fmt(s.basicSalary)}</td>
                        <td className="p-3 text-right font-mono text-muted-foreground">{fmt(s.hra)}</td>
                        <td className="p-3 text-right font-mono text-muted-foreground">{fmt(s.da)}</td>
                        <td className="p-3 text-right font-mono text-muted-foreground">{fmt(s.ta)}</td>
                        <td className="p-3 text-right font-mono font-medium">{fmt(s.grossPay)}</td>
                        <td className="p-3 text-right font-mono text-destructive">{fmt(s.totalDeductions)}</td>
                        <td className="p-3 text-right font-mono font-bold text-foreground">{fmt(s.netPay)}</td>
                        <td className="p-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleViewDetails(s)}>
                              <Eye className="h-3.5 w-3.5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleRevision(s)}>
                              <Edit className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── Revisions Tab ─── */}
        <TabsContent value="revisions" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Salary Revision History</CardTitle>
              <CardDescription>Track all salary changes and increments</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left p-3 font-semibold text-muted-foreground">Employee</th>
                      <th className="text-left p-3 font-semibold text-muted-foreground">Department</th>
                      <th className="text-right p-3 font-semibold text-muted-foreground">Previous</th>
                      <th className="text-right p-3 font-semibold text-muted-foreground">New</th>
                      <th className="text-center p-3 font-semibold text-muted-foreground">Change</th>
                      <th className="text-left p-3 font-semibold text-muted-foreground">Reason</th>
                      <th className="text-left p-3 font-semibold text-muted-foreground">Effective</th>
                      <th className="text-left p-3 font-semibold text-muted-foreground">Approved By</th>
                    </tr>
                  </thead>
                  <tbody>
                    {revisions.map(r => (
                      <tr key={r.id} className="border-b hover:bg-muted/30 transition-colors">
                        <td className="p-3 font-medium text-foreground">{r.employeeName}</td>
                        <td className="p-3 text-muted-foreground">{r.department}</td>
                        <td className="p-3 text-right font-mono text-muted-foreground">{fmt(r.previousBasic)}</td>
                        <td className="p-3 text-right font-mono font-medium">{fmt(r.newBasic)}</td>
                        <td className="p-3 text-center">
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 gap-0.5">
                            <ArrowUpRight className="h-3 w-3" />{r.changePercent}%
                          </Badge>
                        </td>
                        <td className="p-3 text-muted-foreground">{r.reason}</td>
                        <td className="p-3 text-muted-foreground">{r.effectiveFrom}</td>
                        <td className="p-3 text-muted-foreground">{r.approvedBy}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── Payslips Tab ─── */}
        <TabsContent value="payslips" className="space-y-4">
          <div className="flex items-center gap-3 flex-wrap">
            <Select value={payslipMonth} onValueChange={setPayslipMonth}>
              <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
              <SelectContent>
                {MONTH_NAMES.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={payslipYear} onValueChange={setPayslipYear}>
              <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="2025">2025</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
              </SelectContent>
            </Select>
            <Badge variant="outline" className="ml-auto">{filteredPayslips.length} payslips</Badge>
          </div>

          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {filteredPayslips.map(p => (
              <Card key={p.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedPayslip(p)}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold text-foreground">{p.employeeName}</p>
                      <p className="text-xs text-muted-foreground">{p.department}</p>
                    </div>
                    <Badge variant="outline" className={p.status === 'sent' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-amber-50 text-amber-700 border-amber-200'}>
                      {p.status}
                    </Badge>
                  </div>
                  <Separator className="mb-3" />
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div><span className="text-muted-foreground">Basic:</span> <span className="font-mono">{fmt(p.basicSalary)}</span></div>
                    <div><span className="text-muted-foreground">Gross:</span> <span className="font-mono">{fmt(p.grossPay)}</span></div>
                    <div><span className="text-muted-foreground">Deductions:</span> <span className="font-mono text-destructive">{fmt(p.pf + p.esi + p.pt)}</span></div>
                    <div><span className="text-muted-foreground">Net:</span> <span className="font-mono font-bold">{fmt(p.netPay)}</span></div>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-2">{p.month} {p.year} • Generated {p.generatedOn}</p>
                </CardContent>
              </Card>
            ))}
            {filteredPayslips.length === 0 && (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                No payslips found for {payslipMonth} {payslipYear}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* ─── Salary Detail Sheet ─── */}
      <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <SheetContent className="sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Salary Details</SheetTitle>
          </SheetHeader>
          {selectedEmployee && (
            <ScrollArea className="h-[calc(100vh-120px)] pr-4 mt-4">
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg text-foreground">{selectedEmployee.employeeName}</h3>
                  <p className="text-sm text-muted-foreground">{selectedEmployee.designation} • {selectedEmployee.department}</p>
                </div>

                <Card>
                  <CardHeader className="pb-2"><CardTitle className="text-sm">Earnings</CardTitle></CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-muted-foreground">Basic Salary</span><span className="font-mono font-medium">{fmt(selectedEmployee.basicSalary)}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">HRA (40%)</span><span className="font-mono">{fmt(selectedEmployee.hra)}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">DA (20%)</span><span className="font-mono">{fmt(selectedEmployee.da)}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">TA (Fixed)</span><span className="font-mono">{fmt(selectedEmployee.ta)}</span></div>
                    <Separator />
                    <div className="flex justify-between font-semibold"><span>Gross Pay</span><span className="font-mono">{fmt(selectedEmployee.grossPay)}</span></div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2"><CardTitle className="text-sm">Deductions</CardTitle></CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-muted-foreground">PF (12%)</span><span className="font-mono text-destructive">{fmt(selectedEmployee.pf)}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">ESI (0.75%)</span><span className="font-mono text-destructive">{fmt(selectedEmployee.esi)}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Professional Tax</span><span className="font-mono text-destructive">{fmt(selectedEmployee.pt)}</span></div>
                    <Separator />
                    <div className="flex justify-between font-semibold"><span>Total Deductions</span><span className="font-mono text-destructive">{fmt(selectedEmployee.totalDeductions)}</span></div>
                  </CardContent>
                </Card>

                <Card className="border-primary/20 bg-primary/5">
                  <CardContent className="py-4">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-foreground">Net Pay</span>
                      <span className="text-2xl font-bold text-primary font-mono">{fmt(selectedEmployee.netPay)}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2"><CardTitle className="text-sm">Payment Details</CardTitle></CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-muted-foreground">Mode</span><span className="capitalize">{selectedEmployee.paymentMode}</span></div>
                    {selectedEmployee.bankName && <div className="flex justify-between"><span className="text-muted-foreground">Bank</span><span>{selectedEmployee.bankName}</span></div>}
                    {selectedEmployee.accountNumber && <div className="flex justify-between"><span className="text-muted-foreground">Account</span><span className="font-mono">****{selectedEmployee.accountNumber.slice(-4)}</span></div>}
                    <div className="flex justify-between"><span className="text-muted-foreground">Effective From</span><span>{selectedEmployee.effectiveFrom}</span></div>
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>
          )}
        </SheetContent>
      </Sheet>

      {/* ─── Revision Dialog ─── */}
      <Dialog open={isRevisionOpen} onOpenChange={setIsRevisionOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Salary Revision</DialogTitle>
          </DialogHeader>
          {selectedEmployee && (
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="font-medium">{selectedEmployee.employeeName}</p>
                <p className="text-sm text-muted-foreground">Current Basic: {fmt(selectedEmployee.basicSalary)}</p>
              </div>
              <div className="space-y-2">
                <Label>New Basic Salary (₹)</Label>
                <Input type="number" value={revisionForm.newBasic} onChange={e => setRevisionForm(p => ({ ...p, newBasic: e.target.value }))} />
                {revisionForm.newBasic && Number(revisionForm.newBasic) !== selectedEmployee.basicSalary && (
                  <p className="text-xs text-muted-foreground">
                    Change: {((Number(revisionForm.newBasic) - selectedEmployee.basicSalary) / selectedEmployee.basicSalary * 100).toFixed(1)}%
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Reason</Label>
                <Select value={revisionForm.reason} onValueChange={v => setRevisionForm(p => ({ ...p, reason: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Annual Increment">Annual Increment</SelectItem>
                    <SelectItem value="Promotion">Promotion</SelectItem>
                    <SelectItem value="Performance Bonus">Performance Bonus</SelectItem>
                    <SelectItem value="Restructuring">Restructuring</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Effective From</Label>
                <Input type="date" value={revisionForm.effectiveFrom} onChange={e => setRevisionForm(p => ({ ...p, effectiveFrom: e.target.value }))} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRevisionOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveRevision}>Save Revision</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Payslip Detail Sheet ─── */}
      <Sheet open={!!selectedPayslip} onOpenChange={() => setSelectedPayslip(null)}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Payslip</SheetTitle>
          </SheetHeader>
          {selectedPayslip && (
            <ScrollArea className="h-[calc(100vh-120px)] pr-4 mt-4">
              <div className="space-y-4">
                <div className="text-center border-b pb-4">
                  <h3 className="font-bold text-lg">Monthly Payslip</h3>
                  <p className="text-sm text-muted-foreground">{selectedPayslip.month} {selectedPayslip.year}</p>
                </div>
                <div>
                  <p className="font-semibold">{selectedPayslip.employeeName}</p>
                  <p className="text-sm text-muted-foreground">{selectedPayslip.department}</p>
                </div>
                <Card>
                  <CardContent className="py-3 space-y-2 text-sm">
                    <p className="font-semibold text-xs text-muted-foreground uppercase tracking-wider">Earnings</p>
                    <div className="flex justify-between"><span>Basic</span><span className="font-mono">{fmt(selectedPayslip.basicSalary)}</span></div>
                    <div className="flex justify-between"><span>HRA</span><span className="font-mono">{fmt(selectedPayslip.hra)}</span></div>
                    <div className="flex justify-between"><span>DA</span><span className="font-mono">{fmt(selectedPayslip.da)}</span></div>
                    <div className="flex justify-between"><span>TA</span><span className="font-mono">{fmt(selectedPayslip.ta)}</span></div>
                    <Separator />
                    <div className="flex justify-between font-semibold"><span>Gross</span><span className="font-mono">{fmt(selectedPayslip.grossPay)}</span></div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="py-3 space-y-2 text-sm">
                    <p className="font-semibold text-xs text-muted-foreground uppercase tracking-wider">Deductions</p>
                    <div className="flex justify-between"><span>PF</span><span className="font-mono">{fmt(selectedPayslip.pf)}</span></div>
                    <div className="flex justify-between"><span>ESI</span><span className="font-mono">{fmt(selectedPayslip.esi)}</span></div>
                    <div className="flex justify-between"><span>PT</span><span className="font-mono">{fmt(selectedPayslip.pt)}</span></div>
                    <Separator />
                    <div className="flex justify-between font-semibold"><span>Total</span><span className="font-mono text-destructive">{fmt(selectedPayslip.pf + selectedPayslip.esi + selectedPayslip.pt)}</span></div>
                  </CardContent>
                </Card>
                <Card className="border-primary/20 bg-primary/5">
                  <CardContent className="py-4">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Net Pay</span>
                      <span className="text-2xl font-bold text-primary font-mono">{fmt(selectedPayslip.netPay)}</span>
                    </div>
                  </CardContent>
                </Card>
                <Button className="w-full gap-2" variant="outline">
                  <Download className="h-4 w-4" />Download Payslip
                </Button>
              </div>
            </ScrollArea>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
