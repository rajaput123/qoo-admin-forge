import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { PageHeader } from '@/components/ui/page-header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DataTable } from '@/components/ui/data-table';
import { StatusBadge } from '@/components/ui/status-badge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, Check, X, Calendar, CheckSquare, Square, Send, Eye, Globe, EyeOff } from 'lucide-react';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LeaveTypeModal } from '@/components/hr/LeaveTypeModal';
import { HolidayModal } from '@/components/hr/HolidayModal';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

import {
  leaveTypes as initialLeaveTypes,
  holidays as initialHolidays,
  leaveApplications as initialApplications,
  leavePolicies as initialLeavePolicies,
  employees,
} from '@/data/hr-dummy-data';

import type { LeaveType, Holiday, LeaveApplication, LeavePolicy } from '@/types/hr';
import { LeaveBalanceTracker } from '@/components/hr/LeaveBalanceTracker';
import { CoverageImpactAnalysis } from '@/components/hr/CoverageImpactAnalysis';
import { usePermissions } from '@/hooks/usePermissions';

export default function Leave() {
  const { checkModuleAccess } = usePermissions();
  const [activeTab, setActiveTab] = useState('applications');

  // Admin-level access check
  if (!checkModuleAccess('leave')) {
    return (
      <div>
        <PageHeader
          title="Access Denied"
          description="You do not have permission to access this module"
        />
      </div>
    );
  }

  // Data
  const [leaveTypes, setLeaveTypes] = useState(initialLeaveTypes);
  const [holidays, setHolidays] = useState(initialHolidays);
  const [applications, setApplications] = useState(initialApplications);
  const [leavePolicies, setLeavePolicies] = useState(initialLeavePolicies);
  
  // Bulk selection
  const [selectedApplications, setSelectedApplications] = useState<Set<string>>(new Set());
  const [bulkActionDialog, setBulkActionDialog] = useState<{
    open: boolean;
    action: 'approve' | 'reject';
  }>({ open: false, action: 'approve' });

  // Modals
  const [leaveTypeModalOpen, setLeaveTypeModalOpen] = useState(false);
  const [editingLeaveType, setEditingLeaveType] = useState<LeaveType | null>(null);
  const [viewLeaveTypeOpen, setViewLeaveTypeOpen] = useState(false);
  const [viewingLeaveType, setViewingLeaveType] = useState<LeaveType | null>(null);
  
  const [holidayModalOpen, setHolidayModalOpen] = useState(false);
  const [editingHoliday, setEditingHoliday] = useState<Holiday | null>(null);
  const [viewHolidayOpen, setViewHolidayOpen] = useState(false);
  const [viewingHoliday, setViewingHoliday] = useState<Holiday | null>(null);

  const [viewApplicationOpen, setViewApplicationOpen] = useState(false);
  const [viewingApplication, setViewingApplication] = useState<LeaveApplication | null>(null);

  const [leavePolicyModalOpen, setLeavePolicyModalOpen] = useState(false);
  const [editingLeavePolicy, setEditingLeavePolicy] = useState<LeavePolicy | null>(null);
  const [viewLeavePolicyOpen, setViewLeavePolicyOpen] = useState(false);
  const [viewingLeavePolicy, setViewingLeavePolicy] = useState<LeavePolicy | null>(null);

  // Action dialog
  const [actionDialog, setActionDialog] = useState<{
    open: boolean;
    action: 'approve' | 'reject';
    application: LeaveApplication | null;
    remarks?: string;
  }>({ open: false, action: 'approve', application: null });

  // Leave Type handlers
  const handleSaveLeaveType = (lt: Partial<LeaveType>) => {
    if (lt.id) {
      setLeaveTypes(prev => prev.map(l => l.id === lt.id ? { ...l, ...lt } as LeaveType : l));
    } else {
      setLeaveTypes(prev => [...prev, { ...lt, id: String(prev.length + 1), published: false } as LeaveType]);
    }
  };

  const [selectedLeaveTypes, setSelectedLeaveTypes] = useState<Set<string>>(new Set());
  const [bulkPublishLeaveTypesDialog, setBulkPublishLeaveTypesDialog] = useState<{
    open: boolean;
    action: 'publish' | 'unpublish';
  }>({ open: false, action: 'publish' });

  const handlePublishLeaveType = (id: string) => {
    setLeaveTypes(prev => prev.map(lt => 
      lt.id === id 
        ? { ...lt, published: true, publishedOn: new Date().toISOString().split('T')[0], publishedBy: 'Current User' }
        : lt
    ));
  };

  const handleUnpublishLeaveType = (id: string) => {
    setLeaveTypes(prev => prev.map(lt => 
      lt.id === id 
        ? { ...lt, published: false, publishedOn: undefined, publishedBy: undefined }
        : lt
    ));
  };

  const handleBulkPublishLeaveTypes = () => {
    const selectedIds = Array.from(selectedLeaveTypes);
    setLeaveTypes(prev => prev.map(lt => 
      selectedIds.includes(lt.id)
        ? { 
            ...lt, 
            published: bulkPublishLeaveTypesDialog.action === 'publish',
            publishedOn: bulkPublishLeaveTypesDialog.action === 'publish' ? new Date().toISOString().split('T')[0] : undefined,
            publishedBy: bulkPublishLeaveTypesDialog.action === 'publish' ? 'Current User' : undefined
          }
        : lt
    ));
    setSelectedLeaveTypes(new Set());
    setBulkPublishLeaveTypesDialog({ open: false, action: 'publish' });
  };

  const toggleLeaveTypeSelection = (id: string) => {
    const newSelection = new Set(selectedLeaveTypes);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedLeaveTypes(newSelection);
  };

  // Holiday handlers
  const handleSaveHoliday = (h: Partial<Holiday>) => {
    if (h.id) {
      setHolidays(prev => prev.map(hol => hol.id === h.id ? { ...hol, ...h } as Holiday : hol));
    } else {
      setHolidays(prev => [...prev, { ...h, id: String(prev.length + 1), published: false } as Holiday]);
    }
  };

  const [selectedHolidays, setSelectedHolidays] = useState<Set<string>>(new Set());
  const [bulkPublishDialog, setBulkPublishDialog] = useState<{
    open: boolean;
    action: 'publish' | 'unpublish';
  }>({ open: false, action: 'publish' });

  const handlePublishHoliday = (id: string) => {
    setHolidays(prev => prev.map(hol => 
      hol.id === id 
        ? { ...hol, published: true, publishedOn: new Date().toISOString().split('T')[0], publishedBy: 'Current User' }
        : hol
    ));
  };

  const handleUnpublishHoliday = (id: string) => {
    setHolidays(prev => prev.map(hol => 
      hol.id === id 
        ? { ...hol, published: false, publishedOn: undefined, publishedBy: undefined }
        : hol
    ));
  };

  const handleBulkPublishHolidays = () => {
    const selectedIds = Array.from(selectedHolidays);
    setHolidays(prev => prev.map(hol => 
      selectedIds.includes(hol.id)
        ? { 
            ...hol, 
            published: bulkPublishDialog.action === 'publish',
            publishedOn: bulkPublishDialog.action === 'publish' ? new Date().toISOString().split('T')[0] : undefined,
            publishedBy: bulkPublishDialog.action === 'publish' ? 'Current User' : undefined
          }
        : hol
    ));
    setSelectedHolidays(new Set());
    setBulkPublishDialog({ open: false, action: 'publish' });
  };

  const toggleHolidaySelection = (id: string) => {
    const newSelection = new Set(selectedHolidays);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedHolidays(newSelection);
  };

  const toggleAllHolidays = () => {
    if (selectedHolidays.size === holidays.length) {
      setSelectedHolidays(new Set());
    } else {
      setSelectedHolidays(new Set(holidays.map(h => h.id)));
    }
  };

  // Calculate leave balance for an employee
  const calculateLeaveBalance = (employeeId: string, leaveTypeName: string) => {
    const leaveType = leaveTypes.find(lt => lt.name === leaveTypeName);
    if (!leaveType) return { total: 0, used: 0, available: 0 };

    const used = applications
      .filter(la => 
        la.employeeId === employeeId && 
        la.leaveType === leaveTypeName && 
        la.status === 'approved'
      )
      .reduce((sum, la) => sum + la.days, 0);

    return {
      total: leaveType.annualQuota,
      used,
      available: leaveType.annualQuota - used,
    };
  };

  // Check if application complies with policy
  const checkPolicyCompliance = (application: LeaveApplication): { compliant: boolean; reason?: string } => {
    // Find applicable policy
    const employee = employees.find(e => e.id === application.employeeId);
    if (!employee) return { compliant: false, reason: 'Employee not found' };

    const applicablePolicy = leavePolicies.find(p => {
      if (p.status !== 'active') return false;
      if (p.applicableTo === 'all') return true;
      if (p.applicableTo === 'department' && p.applicableIds?.includes(employee.department)) return true;
      if (p.applicableTo === 'designation' && p.applicableIds?.includes(employee.designation)) return true;
      if (p.applicableTo === 'employee' && p.applicableIds?.includes(employee.id)) return true;
      return false;
    });

    if (!applicablePolicy) return { compliant: true }; // No policy = allowed

    // Check if leave type is in policy
    const leaveType = leaveTypes.find(lt => lt.name === application.leaveType);
    if (!leaveType || !applicablePolicy.leaveTypes.includes(leaveType.id)) {
      return { compliant: false, reason: 'Leave type not covered by policy' };
    }

    // Check max consecutive days
    if (applicablePolicy.maxConsecutiveDays && application.days > applicablePolicy.maxConsecutiveDays) {
      return { compliant: false, reason: `Exceeds max consecutive days (${applicablePolicy.maxConsecutiveDays})` };
    }

    // Check advance notice
    if (applicablePolicy.advanceNoticeDays) {
      const fromDate = new Date(application.fromDate);
      const today = new Date();
      const daysDiff = Math.ceil((fromDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      if (daysDiff < applicablePolicy.advanceNoticeDays) {
        return { compliant: false, reason: `Requires ${applicablePolicy.advanceNoticeDays} days advance notice` };
      }
    }

    return { compliant: true };
  };

  // Application handlers
  const handleApplicationAction = () => {
    if (!actionDialog.application) return;

    const application = actionDialog.application;

    // If approving, check balance and policy
    if (actionDialog.action === 'approve') {
      const balance = calculateLeaveBalance(application.employeeId, application.leaveType);
      if (balance.available < application.days) {
        // Show error - insufficient balance
        alert(`Insufficient leave balance. Available: ${balance.available} days, Requested: ${application.days} days`);
        return;
      }

      const policyCheck = checkPolicyCompliance(application);
      if (!policyCheck.compliant) {
        alert(`Policy violation: ${policyCheck.reason}`);
        return;
      }
    }
    
    setApplications(prev => prev.map(app => 
      app.id === actionDialog.application!.id
        ? { 
            ...app, 
            status: actionDialog.action === 'approve' ? 'approved' : 'rejected',
            approvedBy: 'Current User',
            approvedOn: new Date().toISOString().split('T')[0],
            remarks: actionDialog.remarks || app.remarks,
          }
        : app
    ));
    setActionDialog({ open: false, action: 'approve', application: null });
  };

  // Bulk approval handlers
  const handleBulkAction = () => {
    const selectedIds = Array.from(selectedApplications);
    const selectedApps = applications.filter(app => selectedIds.includes(app.id));

    // If approving, check balances and policies
    if (bulkActionDialog.action === 'approve') {
      const issues: string[] = [];
      selectedApps.forEach(app => {
        const balance = calculateLeaveBalance(app.employeeId, app.leaveType);
        if (balance.available < app.days) {
          issues.push(`${app.employeeName}: Insufficient balance (Available: ${balance.available}, Requested: ${app.days})`);
        }
        const policyCheck = checkPolicyCompliance(app);
        if (!policyCheck.compliant) {
          issues.push(`${app.employeeName}: ${policyCheck.reason}`);
        }
      });

      if (issues.length > 0) {
        alert(`Cannot approve some applications:\n\n${issues.join('\n')}`);
        return;
      }
    }

    setApplications(prev => prev.map(app => 
      selectedIds.includes(app.id)
        ? { 
            ...app, 
            status: bulkActionDialog.action === 'approve' ? 'approved' : 'rejected',
            approvedBy: 'Current User',
            approvedOn: new Date().toISOString().split('T')[0],
          }
        : app
    ));
    setSelectedApplications(new Set());
    setBulkActionDialog({ open: false, action: 'approve' });
  };

  const toggleApplicationSelection = (id: string) => {
    const newSelection = new Set(selectedApplications);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedApplications(newSelection);
  };

  const toggleAllApplications = () => {
    const pendingApps = applications.filter(a => a.status === 'pending');
    if (selectedApplications.size === pendingApps.length) {
      setSelectedApplications(new Set());
    } else {
      setSelectedApplications(new Set(pendingApps.map(a => a.id)));
    }
  };

  const pendingApplications = useMemo(() => 
    applications.filter(a => a.status === 'pending'),
    [applications]
  );

  const navigate = useNavigate();

  // Column definitions
  const applicationColumns = [
    {
      key: 'select',
      label: '',
      width: '50px',
      render: (_: unknown, row: LeaveApplication) => (
        row.status === 'pending' ? (
          <Checkbox
            checked={selectedApplications.has(row.id)}
            onCheckedChange={() => toggleApplicationSelection(row.id)}
            onClick={(e) => e.stopPropagation()}
          />
        ) : null
      ),
    },
    { 
      key: 'employeeName', 
      label: 'Employee', 
      sortable: true,
      render: (value: unknown, row: LeaveApplication) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/hr/employees/${row.employeeId}`);
          }}
          className="text-primary hover:underline text-left font-medium"
        >
          {value as string}
        </button>
      )
    },
    { key: 'leaveType', label: 'Leave Type', sortable: true },
    {
      key: 'fromDate',
      label: 'Period',
      render: (_: unknown, row: LeaveApplication) => (
        <div className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
          <span>{new Date(row.fromDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })} - {new Date(row.toDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</span>
        </div>
      ),
    },
    { key: 'days', label: 'Days', width: '80px' },
    { key: 'reason', label: 'Reason' },
    {
      key: 'status',
      label: 'Status',
      render: (value: unknown) => {
        const status = value as LeaveApplication['status'];
        const variants: Record<string, 'success' | 'warning' | 'destructive' | 'neutral'> = {
          pending: 'warning',
          approved: 'success',
          rejected: 'destructive',
          cancelled: 'neutral',
        };
        return (
          <StatusBadge variant={variants[status]}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </StatusBadge>
        );
      },
    },
  ];

  const leaveTypeColumns = [
    {
      key: 'select',
      label: '',
      width: '50px',
      render: (_: unknown, row: LeaveType) => (
        <Checkbox
          checked={selectedLeaveTypes.has(row.id)}
          onCheckedChange={() => toggleLeaveTypeSelection(row.id)}
          onClick={(e) => e.stopPropagation()}
        />
      ),
    },
    { key: 'code', label: 'Code', sortable: true, width: '80px' },
    { key: 'name', label: 'Leave Type', sortable: true },
    { key: 'annualQuota', label: 'Annual Quota', sortable: true, render: (v: unknown) => `${v} days` },
    {
      key: 'carryForward',
      label: 'Carry Forward',
      render: (value: unknown, row: LeaveType) => 
        value ? `Yes (max ${row.maxCarryForward})` : 'No',
    },
    {
      key: 'paid',
      label: 'Paid',
      render: (value: unknown) => (
        <StatusBadge variant="neutral">
          {value ? 'Paid' : 'Unpaid'}
        </StatusBadge>
      ),
    },
    {
      key: 'published',
      label: 'Published',
      render: (value: unknown, row: LeaveType) => (
        <div className="flex flex-col gap-1">
          <StatusBadge variant={row.published ? 'success' : 'neutral'}>
            {row.published ? (
              <div className="flex items-center gap-1">
                <Globe className="h-3 w-3" />
                Published
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <EyeOff className="h-3 w-3" />
                Draft
              </div>
            )}
          </StatusBadge>
          {row.published && row.publishedOn && (
            <span className="text-xs text-muted-foreground">
              {new Date(row.publishedOn).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: unknown) => (
        <StatusBadge variant={value === 'active' ? 'success' : 'neutral'}>
          {value === 'active' ? 'Active' : 'Inactive'}
        </StatusBadge>
      ),
    },
  ];

  const holidayColumns = [
    {
      key: 'select',
      label: '',
      width: '50px',
      render: (_: unknown, row: Holiday) => (
        <Checkbox
          checked={selectedHolidays.has(row.id)}
          onCheckedChange={() => toggleHolidaySelection(row.id)}
          onClick={(e) => e.stopPropagation()}
        />
      ),
    },
    { 
      key: 'date', 
      label: 'Date', 
      sortable: true,
      render: (value: unknown) => new Date(value as string).toLocaleDateString('en-IN', { 
        weekday: 'short', 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric' 
      }),
    },
    { key: 'name', label: 'Holiday Name', sortable: true },
    {
      key: 'type',
      label: 'Type',
      render: (value: unknown) => {
        const types: Record<string, string> = {
          national: 'National',
          religious: 'Religious',
          optional: 'Optional',
        };
        return <StatusBadge variant="neutral">{types[value as string]}</StatusBadge>;
      },
    },
    {
      key: 'published',
      label: 'Status',
      render: (value: unknown, row: Holiday) => (
        <div className="flex flex-col gap-1">
          <StatusBadge variant={row.published ? 'success' : 'neutral'}>
            {row.published ? (
              <div className="flex items-center gap-1">
                <Globe className="h-3 w-3" />
                Published
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <EyeOff className="h-3 w-3" />
                Draft
              </div>
            )}
          </StatusBadge>
          {row.published && row.publishedOn && (
            <span className="text-xs text-muted-foreground">
              {new Date(row.publishedOn).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'publishedBy',
      label: 'Published By',
      render: (value: unknown, row: Holiday) => (
        row.published ? (
          <span className="text-sm text-muted-foreground">{row.publishedBy || '-'}</span>
        ) : (
          <span className="text-sm text-muted-foreground">-</span>
        )
      ),
    },
    { key: 'year', label: 'Year', sortable: true, width: '100px' },
  ];


  return (
    <div>
      <PageHeader
        title="Leave Management"
        description="Manage leave applications, types, and holidays"
        breadcrumbs={[
          { label: 'Hub', href: '/hub' },
          { label: 'People / HR', href: '/hr' },
          { label: 'Leave Management' },
        ]}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="applications">
              Applications
              {pendingApplications.length > 0 && (
                <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 text-xs">
                  {pendingApplications.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="types">Leave Types</TabsTrigger>
            <TabsTrigger value="holidays">Holidays</TabsTrigger>
            <TabsTrigger value="policies">Leave Policies</TabsTrigger>
            <TabsTrigger value="balance">Leave Balance</TabsTrigger>
          </TabsList>

          {activeTab === 'types' && (
            <Button size="sm" onClick={() => {
              setEditingLeaveType(null);
              setLeaveTypeModalOpen(true);
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Leave Type
            </Button>
          )}
          {activeTab === 'holidays' && (
            <Button size="sm" onClick={() => {
              setEditingHoliday(null);
              setHolidayModalOpen(true);
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Holiday
            </Button>
          )}
          {activeTab === 'policies' && (
            <Button size="sm" onClick={() => {
              setEditingLeavePolicy(null);
              setLeavePolicyModalOpen(true);
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Leave Policy
            </Button>
          )}
        </div>

        {/* Applications Tab */}
        <TabsContent value="applications" className="m-0">
          {pendingApplications.length > 0 && selectedApplications.size > 0 && (
            <div className="mb-4 p-3 bg-muted rounded-lg flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900">
                {selectedApplications.size} application{selectedApplications.size > 1 ? 's' : ''} selected
              </span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setBulkActionDialog({ open: true, action: 'approve' })}
                >
                  <Check className="h-4 w-4 mr-2" />
                  Approve Selected ({selectedApplications.size})
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setBulkActionDialog({ open: true, action: 'reject' })}
                  className="text-destructive hover:text-destructive"
                >
                  <X className="h-4 w-4 mr-2" />
                  Reject Selected ({selectedApplications.size})
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setSelectedApplications(new Set())}
                >
                  Clear Selection
                </Button>
              </div>
            </div>
          )}
          <DataTable
            data={applications}
            columns={applicationColumns}
            searchable={false}
            viewToggle={false}
            selectable={false}
            onRowClick={(row) => {
              setViewingApplication(row);
              setViewApplicationOpen(true);
            }}
            actions={(row) => (
              <>
                {row.status === 'pending' && (
                  <>
                    <DropdownMenuItem onClick={(e) => {
                      e.stopPropagation();
                      // Quick approve - one click for policy-compliant leaves
                      const canQuickApprove = true; // TODO: Add policy check
                      if (canQuickApprove) {
                        setApplications(prev => prev.map(app => 
                          app.id === row.id 
                            ? { 
                                ...app, 
                                status: 'approved',
                                approvedBy: 'Current User',
                                approvedOn: new Date().toISOString().split('T')[0],
                              }
                            : app
                        ));
                      } else {
                        setActionDialog({ open: true, action: 'approve', application: row, remarks: '' });
                      }
                    }}>
                      <Check className="h-4 w-4 mr-2 text-success" />
                      Quick Approve
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => {
                      e.stopPropagation();
                      setActionDialog({ open: true, action: 'approve', application: row, remarks: '' });
                    }}>
                      <CheckSquare className="h-4 w-4 mr-2" />
                      Approve with Remarks
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => {
                      e.stopPropagation();
                      setActionDialog({ open: true, action: 'reject', application: row, remarks: '' });
                    }}>
                      <X className="h-4 w-4 mr-2 text-destructive" />
                      Reject
                    </DropdownMenuItem>
                  </>
                )}
              </>
            )}
          />
        </TabsContent>

        {/* Leave Types Tab */}
        <TabsContent value="types" className="m-0">
          {selectedLeaveTypes.size > 0 && (
            <div className="mb-4 p-3 bg-muted rounded-lg flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900">
                {selectedLeaveTypes.size} leave type{selectedLeaveTypes.size > 1 ? 's' : ''} selected
              </span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setBulkPublishLeaveTypesDialog({ open: true, action: 'publish' })}
                >
                  <Globe className="h-4 w-4 mr-2" />
                  Publish Selected ({selectedLeaveTypes.size})
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setBulkPublishLeaveTypesDialog({ open: true, action: 'unpublish' })}
                >
                  <EyeOff className="h-4 w-4 mr-2" />
                  Unpublish Selected ({selectedLeaveTypes.size})
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setSelectedLeaveTypes(new Set())}
                >
                  Clear Selection
                </Button>
              </div>
            </div>
          )}
          <DataTable
            data={leaveTypes}
            columns={leaveTypeColumns}
            searchable={false}
            viewToggle={false}
            selectable={false}
            onRowClick={(row) => {
              setViewingLeaveType(row);
              setViewLeaveTypeOpen(true);
            }}
            actions={(row) => (
              <>
                {!row.published && (
                  <DropdownMenuItem onClick={() => {
                    setViewingLeaveType(row);
                    setViewLeaveTypeOpen(true);
                  }}>
                    <Globe className="h-4 w-4 mr-2" />
                    Publish
                  </DropdownMenuItem>
                )}
                {row.published && (
                  <DropdownMenuItem onClick={() => {
                    setViewingLeaveType(row);
                    setViewLeaveTypeOpen(true);
                  }}>
                    <EyeOff className="h-4 w-4 mr-2" />
                    Unpublish
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => {
                  setEditingLeaveType(row);
                  setLeaveTypeModalOpen(true);
                }}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => setLeaveTypes(prev => prev.filter(l => l.id !== row.id))}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </>
            )}
          />
        </TabsContent>

        {/* Holidays Tab */}
        <TabsContent value="holidays" className="m-0">
          {selectedHolidays.size > 0 && (
            <div className="mb-4 p-3 bg-muted rounded-lg flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900">
                {selectedHolidays.size} holiday{selectedHolidays.size > 1 ? 's' : ''} selected
              </span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setBulkPublishDialog({ open: true, action: 'publish' })}
                >
                  <Globe className="h-4 w-4 mr-2" />
                  Publish Selected ({selectedHolidays.size})
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setBulkPublishDialog({ open: true, action: 'unpublish' })}
                >
                  <EyeOff className="h-4 w-4 mr-2" />
                  Unpublish Selected ({selectedHolidays.size})
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setSelectedHolidays(new Set())}
                >
                  Clear Selection
                </Button>
              </div>
            </div>
          )}
          <DataTable
            data={holidays}
            columns={holidayColumns}
            searchable={false}
            viewToggle={false}
            selectable={false}
            onRowClick={(row) => {
              setViewingHoliday(row);
              setViewHolidayOpen(true);
            }}
            actions={(row) => (
              <>
                {!row.published && (
                  <DropdownMenuItem onClick={() => {
                    setViewingHoliday(row);
                    setViewHolidayOpen(true);
                  }}>
                    <Globe className="h-4 w-4 mr-2" />
                    Publish
                  </DropdownMenuItem>
                )}
                {row.published && (
                  <DropdownMenuItem onClick={() => {
                    setViewingHoliday(row);
                    setViewHolidayOpen(true);
                  }}>
                    <EyeOff className="h-4 w-4 mr-2" />
                    Unpublish
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => {
                  setEditingHoliday(row);
                  setHolidayModalOpen(true);
                }}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => setHolidays(prev => prev.filter(h => h.id !== row.id))}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </>
            )}
          />
        </TabsContent>

        {/* Leave Policies Tab */}
        <TabsContent value="policies" className="m-0">
          <LeavePoliciesTab
            policies={leavePolicies}
            leaveTypes={leaveTypes}
            onSave={(policy) => {
              if (policy.id) {
                setLeavePolicies(prev => prev.map(p => p.id === policy.id ? { ...p, ...policy } as LeavePolicy : p));
              } else {
                setLeavePolicies(prev => [...prev, { ...policy, id: String(prev.length + 1), createdAt: new Date().toISOString().split('T')[0] } as LeavePolicy]);
              }
              setLeavePolicyModalOpen(false);
              setEditingLeavePolicy(null);
            }}
            onEdit={(policy) => {
              setEditingLeavePolicy(policy);
              setLeavePolicyModalOpen(true);
            }}
            onView={(policy) => {
              setViewingLeavePolicy(policy);
              setViewLeavePolicyOpen(true);
            }}
            onDelete={(id) => {
              setLeavePolicies(prev => prev.filter(p => p.id !== id));
            }}
            modalOpen={leavePolicyModalOpen}
            onModalOpenChange={setLeavePolicyModalOpen}
            editingPolicy={editingLeavePolicy}
            viewOpen={viewLeavePolicyOpen}
            onViewOpenChange={setViewLeavePolicyOpen}
            viewingPolicy={viewingLeavePolicy}
          />
        </TabsContent>

        {/* Leave Balance Tab */}
        <TabsContent value="balance" className="m-0">
          <LeaveBalanceTracker
            employees={employees}
            leaveTypes={leaveTypes}
            leaveApplications={applications}
            balances={[]} // TODO: Calculate from applications
            onUpdateBalance={(balance) => {
              // Handle balance update
            }}
          />
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <LeaveTypeModal
        open={leaveTypeModalOpen}
        onOpenChange={setLeaveTypeModalOpen}
        leaveType={editingLeaveType}
        onSave={handleSaveLeaveType}
      />

      <HolidayModal
        open={holidayModalOpen}
        onOpenChange={setHolidayModalOpen}
        holiday={editingHoliday}
        onSave={handleSaveHoliday}
      />

      {/* Approve/Reject Dialog */}
      <Dialog open={actionDialog.open} onOpenChange={(open) => setActionDialog(prev => ({ ...prev, open }))}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {actionDialog.action === 'approve' ? 'Approve Leave' : 'Reject Leave'}
            </DialogTitle>
          </DialogHeader>
          {actionDialog.application && (() => {
            const balance = actionDialog.action === 'approve' 
              ? calculateLeaveBalance(actionDialog.application.employeeId, actionDialog.application.leaveType)
              : null;
            const policyCheck = actionDialog.action === 'approve'
              ? checkPolicyCompliance(actionDialog.application)
              : null;
            
            return (
              <div className="space-y-4 py-4">
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Employee</p>
                  <p className="font-medium text-gray-900">{actionDialog.application.employeeName}</p>
                  <p className="text-sm text-muted-foreground mt-2 mb-1">Leave Type</p>
                  <p className="font-medium text-gray-900">{actionDialog.application.leaveType}</p>
                  <p className="text-sm text-muted-foreground mt-2 mb-1">Period</p>
                  <p className="font-medium text-gray-900">
                    {new Date(actionDialog.application.fromDate).toLocaleDateString('en-IN')} - {new Date(actionDialog.application.toDate).toLocaleDateString('en-IN')}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2 mb-1">Days</p>
                  <p className="font-medium text-gray-900">{actionDialog.application.days} days</p>
                </div>
                {actionDialog.action === 'approve' && balance && (
                  <div className="p-3 border rounded-lg">
                    <p className="text-sm font-medium text-gray-900 mb-2">Leave Balance</p>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total:</span>
                        <span className="font-medium">{balance.total} days</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Used:</span>
                        <span className="font-medium">{balance.used} days</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Available:</span>
                        <span className={`font-medium ${balance.available >= actionDialog.application.days ? 'text-green-600' : 'text-red-600'}`}>
                          {balance.available} days
                        </span>
                      </div>
                      {balance.available < actionDialog.application.days && (
                        <p className="text-xs text-red-600 mt-2">⚠️ Insufficient balance</p>
                      )}
                    </div>
                  </div>
                )}
                {actionDialog.action === 'approve' && policyCheck && (
                  <div className={`p-3 border rounded-lg ${policyCheck.compliant ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                    <p className="text-sm font-medium text-gray-900 mb-1">Policy Compliance</p>
                    {policyCheck.compliant ? (
                      <p className="text-xs text-green-700">✓ Compliant with leave policies</p>
                    ) : (
                      <p className="text-xs text-red-700">⚠️ {policyCheck.reason}</p>
                    )}
                  </div>
                )}
                <div className="form-field">
                  <Label className="form-label">
                    Remarks {actionDialog.action === 'reject' && <span className="form-required">*</span>}
                  </Label>
                  <Textarea
                    value={actionDialog.remarks || ''}
                    onChange={(e) => setActionDialog(prev => ({ ...prev, remarks: e.target.value }))}
                    placeholder={actionDialog.action === 'approve' ? 'Optional remarks...' : 'Please provide reason for rejection...'}
                    rows={3}
                  />
                </div>
              </div>
            );
          })()}
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialog({ open: false, action: 'approve', application: null })}>
              Cancel
            </Button>
            <Button
              onClick={handleApplicationAction}
              className={actionDialog.action === 'reject' ? 'bg-destructive hover:bg-destructive/90' : ''}
              disabled={actionDialog.action === 'reject' && !actionDialog.remarks?.trim()}
            >
              {actionDialog.action === 'approve' ? 'Approve' : 'Reject'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Approve/Reject Dialog */}
      <AlertDialog open={bulkActionDialog.open} onOpenChange={(open) => setBulkActionDialog(prev => ({ ...prev, open }))}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {bulkActionDialog.action === 'approve' ? 'Bulk Approve Leaves' : 'Bulk Reject Leaves'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {bulkActionDialog.action === 'approve' 
                ? `Are you sure you want to approve ${selectedApplications.size} leave application${selectedApplications.size > 1 ? 's' : ''}?`
                : `Are you sure you want to reject ${selectedApplications.size} leave application${selectedApplications.size > 1 ? 's' : ''}?`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkAction}
              className={bulkActionDialog.action === 'reject' ? 'bg-destructive hover:bg-destructive/90' : ''}
            >
              {bulkActionDialog.action === 'approve' ? `Approve ${selectedApplications.size}` : `Reject ${selectedApplications.size}`}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* View Leave Application Modal */}
      <Dialog open={viewApplicationOpen} onOpenChange={setViewApplicationOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Leave Application Details</DialogTitle>
          </DialogHeader>
          {viewingApplication && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Employee</Label>
                  <button
                    onClick={() => {
                      navigate(`/hr/employees/${viewingApplication.employeeId}`);
                      setViewApplicationOpen(false);
                    }}
                    className="text-sm font-medium text-primary hover:underline text-left"
                  >
                    {viewingApplication.employeeName}
                  </button>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Leave Type</Label>
                  <p className="text-sm font-medium text-gray-900">{viewingApplication.leaveType}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">From Date</Label>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(viewingApplication.fromDate).toLocaleDateString('en-IN', { 
                      day: '2-digit', 
                      month: 'short', 
                      year: 'numeric' 
                    })}
                  </p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">To Date</Label>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(viewingApplication.toDate).toLocaleDateString('en-IN', { 
                      day: '2-digit', 
                      month: 'short', 
                      year: 'numeric' 
                    })}
                  </p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Days</Label>
                  <p className="text-sm font-medium text-gray-900">{viewingApplication.days}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Status</Label>
                  <div className="mt-1">
                    <StatusBadge variant={
                      viewingApplication.status === 'approved' ? 'success' :
                      viewingApplication.status === 'pending' ? 'warning' :
                      viewingApplication.status === 'rejected' ? 'destructive' : 'neutral'
                    }>
                      {viewingApplication.status.charAt(0).toUpperCase() + viewingApplication.status.slice(1)}
                    </StatusBadge>
                  </div>
                </div>
                <div className="col-span-2">
                  <Label className="text-xs text-muted-foreground">Reason</Label>
                  <p className="text-sm text-gray-900 mt-1">{viewingApplication.reason || '-'}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewApplicationOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Leave Type Modal */}
      <Dialog open={viewLeaveTypeOpen} onOpenChange={setViewLeaveTypeOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Leave Type Details</DialogTitle>
          </DialogHeader>
          {viewingLeaveType && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Code</Label>
                  <p className="text-sm font-medium text-gray-900">{viewingLeaveType.code}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Name</Label>
                  <p className="text-sm font-medium text-gray-900">{viewingLeaveType.name}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Annual Quota</Label>
                  <p className="text-sm font-medium text-gray-900">{viewingLeaveType.annualQuota} days</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Carry Forward</Label>
                  <p className="text-sm font-medium text-gray-900">{viewingLeaveType.carryForward ? 'Yes' : 'No'}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Status</Label>
                  <div className="mt-1">
                    <StatusBadge variant={viewingLeaveType.status === 'active' ? 'success' : 'neutral'}>
                      {viewingLeaveType.status === 'active' ? 'Active' : 'Inactive'}
                    </StatusBadge>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewLeaveTypeOpen(false)}>Close</Button>
            {viewingLeaveType && !viewingLeaveType.published && (
              <Button onClick={() => {
                if (viewingLeaveType) {
                  handlePublishLeaveType(viewingLeaveType.id);
                  setViewLeaveTypeOpen(false);
                }
              }}>
                <Globe className="h-4 w-4 mr-2" />
                Publish
              </Button>
            )}
            {viewingLeaveType && viewingLeaveType.published && (
              <Button variant="outline" onClick={() => {
                if (viewingLeaveType) {
                  handleUnpublishLeaveType(viewingLeaveType.id);
                  setViewLeaveTypeOpen(false);
                }
              }}>
                <EyeOff className="h-4 w-4 mr-2" />
                Unpublish
              </Button>
            )}
            <Button onClick={() => {
              if (viewingLeaveType) {
                setEditingLeaveType(viewingLeaveType);
                setViewLeaveTypeOpen(false);
                setLeaveTypeModalOpen(true);
              }
            }}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Publish/Unpublish Leave Types Dialog */}
      <AlertDialog open={bulkPublishLeaveTypesDialog.open} onOpenChange={(open) => setBulkPublishLeaveTypesDialog(prev => ({ ...prev, open }))}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {bulkPublishLeaveTypesDialog.action === 'publish' ? 'Bulk Publish Leave Types' : 'Bulk Unpublish Leave Types'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {bulkPublishLeaveTypesDialog.action === 'publish' 
                ? `Are you sure you want to publish ${selectedLeaveTypes.size} leave type${selectedLeaveTypes.size > 1 ? 's' : ''}? Published leave types will be available for employees to apply.`
                : `Are you sure you want to unpublish ${selectedLeaveTypes.size} leave type${selectedLeaveTypes.size > 1 ? 's' : ''}? Unpublished leave types will no longer be available for new applications.`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleBulkPublishLeaveTypes}>
              {bulkPublishLeaveTypesDialog.action === 'publish' ? `Publish ${selectedLeaveTypes.size}` : `Unpublish ${selectedLeaveTypes.size}`}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* View Holiday Modal */}
      <Dialog open={viewHolidayOpen} onOpenChange={setViewHolidayOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Holiday Details</DialogTitle>
          </DialogHeader>
          {viewingHoliday && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Name</Label>
                  <p className="text-sm font-medium text-gray-900">{viewingHoliday.name}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Date</Label>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(viewingHoliday.date).toLocaleDateString('en-IN', { 
                      day: '2-digit', 
                      month: 'short', 
                      year: 'numeric' 
                    })}
                  </p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Type</Label>
                  <p className="text-sm font-medium text-gray-900 capitalize">{viewingHoliday.type}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Published Status</Label>
                  <div className="mt-1">
                    <StatusBadge variant={viewingHoliday.published ? 'success' : 'neutral'}>
                      {viewingHoliday.published ? (
                        <div className="flex items-center gap-1">
                          <Globe className="h-3 w-3" />
                          Published
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <EyeOff className="h-3 w-3" />
                          Draft
                        </div>
                      )}
                    </StatusBadge>
                  </div>
                </div>
                {viewingHoliday.published && viewingHoliday.publishedOn && (
                  <>
                    <div>
                      <Label className="text-xs text-muted-foreground">Published On</Label>
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(viewingHoliday.publishedOn).toLocaleDateString('en-IN', { 
                          day: '2-digit', 
                          month: 'short', 
                          year: 'numeric' 
                        })}
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Published By</Label>
                      <p className="text-sm font-medium text-gray-900">{viewingHoliday.publishedBy || '-'}</p>
                    </div>
                  </>
                )}
                <div>
                  <Label className="text-xs text-muted-foreground">Status</Label>
                  <div className="mt-1">
                    <StatusBadge variant={viewingHoliday.status === 'active' ? 'success' : 'neutral'}>
                      {viewingHoliday.status === 'active' ? 'Active' : 'Inactive'}
                    </StatusBadge>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewHolidayOpen(false)}>Close</Button>
            {viewingHoliday && !viewingHoliday.published && (
              <Button onClick={() => {
                if (viewingHoliday) {
                  handlePublishHoliday(viewingHoliday.id);
                  setViewHolidayOpen(false);
                }
              }}>
                <Globe className="h-4 w-4 mr-2" />
                Publish
              </Button>
            )}
            {viewingHoliday && viewingHoliday.published && (
              <Button variant="outline" onClick={() => {
                if (viewingHoliday) {
                  handleUnpublishHoliday(viewingHoliday.id);
                  setViewHolidayOpen(false);
                }
              }}>
                <EyeOff className="h-4 w-4 mr-2" />
                Unpublish
              </Button>
            )}
            <Button onClick={() => {
              if (viewingHoliday) {
                setEditingHoliday(viewingHoliday);
                setViewHolidayOpen(false);
                setHolidayModalOpen(true);
              }
            }}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Leave Policies Tab Component
function LeavePoliciesTab({
  policies,
  leaveTypes,
  onSave,
  onEdit,
  onView,
  onDelete,
  modalOpen,
  onModalOpenChange,
  editingPolicy,
  viewOpen,
  onViewOpenChange,
  viewingPolicy,
}: {
  policies: LeavePolicy[];
  leaveTypes: LeaveType[];
  onSave: (policy: Partial<LeavePolicy>) => void;
  onEdit: (policy: LeavePolicy) => void;
  onView: (policy: LeavePolicy) => void;
  onDelete: (id: string) => void;
  modalOpen: boolean;
  onModalOpenChange: (open: boolean) => void;
  editingPolicy: LeavePolicy | null;
  viewOpen: boolean;
  onViewOpenChange: (open: boolean) => void;
  viewingPolicy: LeavePolicy | null;
}) {
  const columns = [
    { key: 'name', label: 'Policy Name', sortable: true },
    {
      key: 'applicableTo',
      label: 'Applicable To',
      render: (value: unknown) => {
        const labels: Record<string, string> = {
          all: 'All Employees',
          department: 'Department',
          designation: 'Designation',
          employee: 'Employee',
        };
        return labels[value as string] || value;
      },
    },
    {
      key: 'leaveTypes',
      label: 'Leave Types',
      render: (value: unknown, row: LeavePolicy) => {
        const types = row.leaveTypes.map(id => leaveTypes.find(lt => lt.id === id)?.name || id).join(', ');
        return <span className="text-sm">{types || '-'}</span>;
      },
    },
    {
      key: 'maxConsecutiveDays',
      label: 'Max Days',
      render: (value: unknown) => value ? `${value} days` : '-' as React.ReactNode,
    },
    {
      key: 'autoApprove',
      label: 'Auto Approve',
      render: (value: unknown) => (
        <StatusBadge variant={value ? 'success' : 'neutral'}>
          {value ? 'Yes' : 'No'}
        </StatusBadge>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: unknown) => (
        <StatusBadge variant={value === 'active' ? 'success' : 'neutral'}>
          {value === 'active' ? 'Active' : 'Inactive'}
        </StatusBadge>
      ),
    },
  ];

  return (
    <>
      <DataTable
        data={policies}
        columns={columns as any}
        searchable={false}
        viewToggle={false}
        selectable={false}
        onRowClick={(row) => {
          onView(row);
        }}
        actions={(row) => (
          <>
            <DropdownMenuItem onClick={() => onView(row)}>
              <Eye className="h-4 w-4 mr-2" />
              View
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(row)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => onDelete(row.id)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </>
        )}
      />

      {/* Add/Edit Modal */}
      <Dialog open={modalOpen} onOpenChange={onModalOpenChange}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingPolicy ? 'Edit Leave Policy' : 'Add Leave Policy'}</DialogTitle>
          </DialogHeader>
          <LeavePolicyForm
            policy={editingPolicy}
            leaveTypes={leaveTypes}
            onSave={onSave}
            onCancel={() => {
              onModalOpenChange(false);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* View Modal */}
      <Dialog open={viewOpen} onOpenChange={onViewOpenChange}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Leave Policy Details</DialogTitle>
          </DialogHeader>
          {viewingPolicy && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Name</Label>
                  <p className="text-sm font-medium text-gray-900">{viewingPolicy.name}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Status</Label>
                  <div className="mt-1">
                    <StatusBadge variant={viewingPolicy.status === 'active' ? 'success' : 'neutral'}>
                      {viewingPolicy.status === 'active' ? 'Active' : 'Inactive'}
                    </StatusBadge>
                  </div>
                </div>
                <div className="col-span-2">
                  <Label className="text-xs text-muted-foreground">Description</Label>
                  <p className="text-sm text-gray-900">{viewingPolicy.description || '-'}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Applicable To</Label>
                  <p className="text-sm font-medium text-gray-900 capitalize">{viewingPolicy.applicableTo}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Max Consecutive Days</Label>
                  <p className="text-sm font-medium text-gray-900">{viewingPolicy.maxConsecutiveDays || '-'}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Advance Notice</Label>
                  <p className="text-sm font-medium text-gray-900">{viewingPolicy.advanceNoticeDays ? `${viewingPolicy.advanceNoticeDays} days` : '-'}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Auto Approve</Label>
                  <p className="text-sm font-medium text-gray-900">{viewingPolicy.autoApprove ? 'Yes' : 'No'}</p>
                </div>
                <div className="col-span-2">
                  <Label className="text-xs text-muted-foreground">Leave Types</Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {viewingPolicy.leaveTypes.map(id => {
                      const lt = leaveTypes.find(t => t.id === id);
                      return lt ? (
                        <Badge key={id} variant="outline">{lt.name}</Badge>
                      ) : null;
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => onViewOpenChange(false)}>Close</Button>
            <Button onClick={() => {
              if (viewingPolicy) {
                onEdit(viewingPolicy);
                onViewOpenChange(false);
                onModalOpenChange(true);
              }
            }}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function LeavePolicyForm({
  policy,
  leaveTypes,
  onSave,
  onCancel,
}: {
  policy: LeavePolicy | null;
  leaveTypes: LeaveType[];
  onSave: (p: Partial<LeavePolicy>) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<Partial<LeavePolicy>>({
    name: policy?.name || '',
    description: policy?.description || '',
    leaveTypes: policy?.leaveTypes || [],
    applicableTo: policy?.applicableTo || 'all',
    maxConsecutiveDays: policy?.maxConsecutiveDays,
    advanceNoticeDays: policy?.advanceNoticeDays,
    requiresApproval: policy?.requiresApproval ?? true,
    autoApprove: policy?.autoApprove || false,
    status: policy?.status || 'active',
  });

  const [selectedLeaveTypes, setSelectedLeaveTypes] = useState<Set<string>>(
    new Set(policy?.leaveTypes || [])
  );

  const toggleLeaveType = (id: string) => {
    const newSet = new Set(selectedLeaveTypes);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedLeaveTypes(newSet);
    setFormData({ ...formData, leaveTypes: Array.from(newSet) });
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      onSave({ ...formData, id: policy?.id, leaveTypes: Array.from(selectedLeaveTypes) });
    }} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <Label htmlFor="name">Policy Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div className="col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
          />
        </div>
        <div>
          <Label htmlFor="applicableTo">Applicable To</Label>
          <Select
            value={formData.applicableTo}
            onValueChange={(value) => setFormData({ ...formData, applicableTo: value as any })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Employees</SelectItem>
              <SelectItem value="department">Department</SelectItem>
              <SelectItem value="designation">Designation</SelectItem>
              <SelectItem value="employee">Employee</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="maxConsecutiveDays">Max Consecutive Days</Label>
          <Input
            id="maxConsecutiveDays"
            type="number"
            value={formData.maxConsecutiveDays || ''}
            onChange={(e) => setFormData({ ...formData, maxConsecutiveDays: e.target.value ? Number(e.target.value) : undefined })}
            min={1}
          />
        </div>
        <div>
          <Label htmlFor="advanceNoticeDays">Advance Notice (days)</Label>
          <Input
            id="advanceNoticeDays"
            type="number"
            value={formData.advanceNoticeDays || ''}
            onChange={(e) => setFormData({ ...formData, advanceNoticeDays: e.target.value ? Number(e.target.value) : undefined })}
            min={0}
          />
        </div>
        <div className="col-span-2">
          <Label>Leave Types *</Label>
          <div className="mt-2 p-3 border rounded-lg max-h-40 overflow-y-auto">
            {leaveTypes.filter(lt => lt.published).map(lt => (
              <div key={lt.id} className="flex items-center gap-2 py-1">
                <Checkbox
                  checked={selectedLeaveTypes.has(lt.id)}
                  onCheckedChange={() => toggleLeaveType(lt.id)}
                />
                <Label className="font-normal cursor-pointer" onClick={() => toggleLeaveType(lt.id)}>
                  {lt.name} ({lt.code})
                </Label>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            checked={formData.requiresApproval}
            onCheckedChange={(checked) => setFormData({ ...formData, requiresApproval: checked })}
          />
          <Label>Requires Approval</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            checked={formData.autoApprove}
            onCheckedChange={(checked) => setFormData({ ...formData, autoApprove: checked })}
            disabled={!formData.requiresApproval}
          />
          <Label>Auto Approve</Label>
        </div>
        <div>
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => setFormData({ ...formData, status: value as 'active' | 'inactive' })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={selectedLeaveTypes.size === 0}>Save</Button>
      </DialogFooter>
    </form>
  );
}
