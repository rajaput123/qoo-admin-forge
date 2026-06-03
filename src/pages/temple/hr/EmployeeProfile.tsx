import { useParams, useNavigate } from 'react-router-dom';

import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { StatusBadge } from '@/components/ui/status-badge';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DataTable } from '@/components/ui/data-table';
import { ArrowLeft, Calendar, Clock, DollarSign, FileText, Users, Briefcase } from 'lucide-react';
import { employees, shifts, gradePays, leaveApplications, leaveTypes, expenses, departments, designations } from '@/data/hr-dummy-data';
import type { Employee } from '@/types/erp';
import { useMemo } from 'react';

export default function EmployeeProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const employee = useMemo(() => {
    return employees.find(e => e.id === id);
  }, [id]);

  if (!employee) {
    return (
      <div>
        <PageHeader title="Employee Not Found" />
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">Employee not found</p>
          <Button onClick={() => navigate('/hr/employees')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Employees
          </Button>
        </div>
      </div>
    );
  }

  const shift = employee.shiftId ? shifts.find(s => s.id === employee.shiftId) : null;
  const gradePay = employee.gradePayId ? gradePays.find(g => g.id === employee.gradePayId) : null;
  const reportingManager = employee.reportingToId ? employees.find(e => e.id === employee.reportingToId) : null;
  const department = departments.find(d => d.name === employee.department);
  const designation = designations.find(d => d.name === employee.designation);

  // Leave balance calculation
  const leaveBalance = useMemo(() => {
    const balance: Record<string, { total: number; used: number; available: number }> = {};
    
    leaveTypes.forEach(lt => {
      const used = leaveApplications
        .filter(la => la.employeeId === employee.id && la.leaveType === lt.name && la.status === 'approved')
        .reduce((sum, la) => sum + la.days, 0);
      
      balance[lt.name] = {
        total: lt.annualQuota,
        used,
        available: lt.annualQuota - used
      };
    });
    
    return balance;
  }, [employee.id]);

  const employeeLeaveApplications = useMemo(() => {
    return leaveApplications.filter(la => la.employeeId === employee.id);
  }, [employee.id]);

  const employeeExpenses = useMemo(() => {
    return expenses.filter(e => e.employeeId === employee.id);
  }, [employee.id]);

  const leaveColumns = [
    { key: 'leaveType', label: 'Leave Type', sortable: true },
    { key: 'fromDate', label: 'From', sortable: true, render: (value: unknown) => new Date(value as string).toLocaleDateString('en-IN') },
    { key: 'toDate', label: 'To', sortable: true, render: (value: unknown) => new Date(value as string).toLocaleDateString('en-IN') },
    { key: 'days', label: 'Days', sortable: true },
    { key: 'status', label: 'Status', render: (value: unknown) => {
      const status = value as string;
      const variant = status === 'approved' ? 'success' : status === 'pending' ? 'warning' : 'destructive';
      return <StatusBadge variant={variant}>{status.charAt(0).toUpperCase() + status.slice(1)}</StatusBadge>;
    }},
    { key: 'reason', label: 'Reason' },
  ];

  const expenseColumns = [
    { key: 'expenseType', label: 'Type', sortable: true },
    { key: 'amount', label: 'Amount', sortable: true, render: (value: unknown) => `₹${(value as number).toLocaleString('en-IN')}` },
    { key: 'date', label: 'Date', sortable: true, render: (value: unknown) => new Date(value as string).toLocaleDateString('en-IN') },
    { key: 'status', label: 'Status', render: (value: unknown) => {
      const status = value as string;
      const variant = status === 'admin_approved' || status === 'paid' ? 'success' : 
                     status === 'manager_approved' || status === 'submitted' ? 'warning' : 
                     status === 'rejected' ? 'destructive' : 'neutral';
      return <StatusBadge variant={variant}>{status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</StatusBadge>;
    }},
    { key: 'description', label: 'Description' },
  ];

  return (
    <div>
      <PageHeader
        title="Employee Profile"
        breadcrumbs={[
          { label: 'Hub', href: '/hub' },
          { label: 'People / HR', href: '/hr' },
          { label: 'Employees', href: '/hr/employees' },
          { label: employee.name },
        ]}
        actions={
          <Button variant="outline" onClick={() => navigate('/hr/employees')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        }
      />

      <div className="space-y-6">
        {/* Employee Header Card */}
        <Card className="p-6">
          <div className="flex items-start gap-6">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="bg-muted text-foreground text-xl font-semibold">
                {employee.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">{employee.name}</h1>
                <StatusBadge variant={employee.status === 'active' ? 'success' : employee.status === 'on_leave' ? 'warning' : 'neutral'}>
                  {employee.status === 'active' ? 'Active' : employee.status === 'on_leave' ? 'On Leave' : 'Inactive'}
                </StatusBadge>
              </div>
              <p className="text-lg text-muted-foreground mb-4">{employee.designation} • {employee.department}</p>
              {employee.employeeCode && (
                <p className="text-sm text-muted-foreground">Employee Code: {employee.employeeCode}</p>
              )}
            </div>
          </div>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Shift</p>
                <p className="text-sm font-semibold text-gray-900">{shift?.name || 'Not Assigned'}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Grade Pay</p>
                <p className="text-sm font-semibold text-gray-900">{gradePay?.name || 'Not Assigned'}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Reporting To</p>
                <p className="text-sm font-semibold text-gray-900">{reportingManager?.name || 'None'}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Join Date</p>
                <p className="text-sm font-semibold text-gray-900">
                  {new Date(employee.joinDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Detailed Information Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="leave">Leave</TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
            <TabsTrigger value="salary">Salary</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm font-medium text-gray-900">{employee.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="text-sm font-medium text-gray-900">{employee.phone}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Department</p>
                    <p className="text-sm font-medium text-gray-900">{employee.department}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Designation</p>
                    <p className="text-sm font-medium text-gray-900">{employee.designation}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Work Details</h3>
                <div className="space-y-3">
                  {shift && (
                    <div>
                      <p className="text-xs text-muted-foreground">Shift</p>
                      <p className="text-sm font-medium text-gray-900">{shift.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">{shift.startTime} - {shift.endTime}</p>
                    </div>
                  )}
                  {reportingManager && (
                    <div>
                      <p className="text-xs text-muted-foreground">Reporting Manager</p>
                      <p className="text-sm font-medium text-gray-900">{reportingManager.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">{reportingManager.designation}</p>
                    </div>
                  )}
                  {department && (
                    <div>
                      <p className="text-xs text-muted-foreground">Department Head</p>
                      <p className="text-sm font-medium text-gray-900">{department.headEmployee || 'Not Assigned'}</p>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="leave" className="space-y-4">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Leave Balance</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {Object.entries(leaveBalance).map(([leaveType, balance]) => (
                  <div key={leaveType} className="p-4 border rounded-lg">
                    <p className="text-sm font-medium text-gray-900 mb-2">{leaveType}</p>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Total:</span>
                        <span className="font-medium">{balance.total}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Used:</span>
                        <span className="font-medium text-orange-600">{balance.used}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Available:</span>
                        <span className="font-medium text-green-600">{balance.available}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Leave History</h3>
              <DataTable
                data={employeeLeaveApplications}
                columns={leaveColumns}
                searchable={false}
                viewToggle={false}
              />
            </Card>
          </TabsContent>

          <TabsContent value="expenses" className="space-y-4">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Expense History</h3>
              <DataTable
                data={employeeExpenses}
                columns={expenseColumns}
                searchable={false}
                viewToggle={false}
              />
            </Card>
          </TabsContent>

          <TabsContent value="salary" className="space-y-4">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Salary Details</h3>
              {gradePay ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Grade Pay</p>
                    <p className="text-sm font-medium text-gray-900">{gradePay.name} ({gradePay.code})</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Salary Range</p>
                      <p className="text-sm font-medium text-gray-900">
                        ₹{gradePay.minSalary.toLocaleString('en-IN')} - ₹{gradePay.maxSalary.toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Allowances</p>
                      <p className="text-sm font-medium text-gray-900">₹{gradePay.allowances.toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Grade pay not assigned</p>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
