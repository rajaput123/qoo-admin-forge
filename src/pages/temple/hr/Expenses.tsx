import { useState } from 'react';

import { PageHeader } from '@/components/ui/page-header';
import { DataTable } from '@/components/ui/data-table';
import { StatusBadge } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { Plus, Eye, Edit, Trash2, Check, X, Upload, Paperclip } from 'lucide-react';
import { DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
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
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { SearchableSelect } from '@/components/ui/searchable-select';

import { expenses as initialExpenses, departments, designations, employees } from '@/data/hr-dummy-data';
import type { Expense, ExpensePolicy, ExpenseAuditLog } from '@/types/hr';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ExpensePolicies } from '@/components/hr/ExpensePolicies';
import { BulkReimbursement } from '@/components/hr/BulkReimbursement';
import { ExpenseAnalytics } from '@/components/hr/ExpenseAnalytics';
import { ExpenseAuditTrail } from '@/components/hr/ExpenseAuditTrail';
import { usePermissions } from '@/hooks/usePermissions';

const expenseTypes = [
  { value: 'travel', label: 'Travel' },
  { value: 'office_supplies', label: 'Office Supplies' },
  { value: 'kitchen_equipment', label: 'Kitchen Equipment' },
  { value: 'maintenance_supplies', label: 'Maintenance Supplies' },
  { value: 'ritual_items', label: 'Ritual Items' },
  { value: 'other', label: 'Other' },
];

export default function Expenses() {
  const navigate = useNavigate();
  const { checkModuleAccess } = usePermissions();
  const [activeTab, setActiveTab] = useState('expenses');

  // Admin-level access check
  if (!checkModuleAccess('expenses')) {
    return (
      <div>
        <PageHeader
          title="Access Denied"
          description="You do not have permission to access this module"
        />
      </div>
    );
  }
  const [expenses, setExpenses] = useState(initialExpenses);
  const [expensePolicies, setExpensePolicies] = useState<ExpensePolicy[]>([]);
  const [auditLogs, setAuditLogs] = useState<ExpenseAuditLog[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [viewingExpense, setViewingExpense] = useState<Expense | null>(null);

  const [formData, setFormData] = useState({
    expenseType: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    description: '',
  });

  const [actionDialog, setActionDialog] = useState<{
    open: boolean;
    action: 'manager_approve' | 'admin_approve' | 'reject';
    expense: Expense | null;
  }>({ open: false, action: 'manager_approve', expense: null });

  const handleSubmit = () => {
    if (editingExpense) {
      setExpenses(prev => prev.map(e =>
        e.id === editingExpense.id
          ? { ...e, ...formData, status: 'submitted', submittedOn: new Date().toISOString().split('T')[0] }
          : e
      ));
    } else {
      const newExpense: Expense = {
        id: String(expenses.length + 1),
        employeeId: '1',
        employeeName: 'Current User',
        ...formData,
        attachments: [],
        status: 'submitted',
        submittedOn: new Date().toISOString().split('T')[0],
      };
      setExpenses(prev => [...prev, newExpense]);
    }
    setDrawerOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      expenseType: '',
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      description: '',
    });
    setEditingExpense(null);
  };

  const handleAction = () => {
    if (!actionDialog.expense) return;

    const statusMap: Record<string, Expense['status']> = {
      manager_approve: 'manager_approved',
      admin_approve: 'admin_approved',
      reject: 'rejected',
    };

    setExpenses(prev => prev.map(e =>
      e.id === actionDialog.expense!.id
        ? {
          ...e,
          status: statusMap[actionDialog.action],
          approvedBy: 'Current User',
          approvedOn: new Date().toISOString().split('T')[0],
        }
        : e
    ));
    setActionDialog({ open: false, action: 'manager_approve', expense: null });
  };

  const columns = [
    {
      key: 'employeeName',
      label: 'Employee',
      sortable: true,
      render: (value: unknown, row: Expense) => (
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
    { key: 'expenseType', label: 'Type', sortable: true },
    {
      key: 'amount',
      label: 'Amount',
      sortable: true,
      render: (value: unknown) => `₹${(value as number).toLocaleString('en-IN')}`,
    },
    {
      key: 'date',
      label: 'Date',
      sortable: true,
      render: (value: unknown) => new Date(value as string).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }),
    },
    {
      key: 'attachments',
      label: 'Attachments',
      render: (value: unknown) => {
        const attachments = value as string[];
        return attachments.length > 0 ? (
          <div className="flex items-center gap-1">
            <Paperclip className="h-3.5 w-3.5 text-muted-foreground" />
            <span>{attachments.length}</span>
          </div>
        ) : (
          <span className="text-muted-foreground">-</span>
        );
      },
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: unknown) => {
        const status = value as Expense['status'];
        const variants: Record<string, 'success' | 'warning' | 'destructive' | 'neutral'> = {
          draft: 'neutral',
          submitted: 'warning',
          manager_approved: 'warning',
          admin_approved: 'success',
          rejected: 'destructive',
          paid: 'success',
        };
        const labels: Record<string, string> = {
          draft: 'Draft',
          submitted: 'Pending',
          manager_approved: 'Manager Approved',
          admin_approved: 'Approved',
          rejected: 'Rejected',
          paid: 'Paid',
        };
        return <StatusBadge variant={variants[status]}>{labels[status]}</StatusBadge>;
      },
    },
  ];

  return (
    <div>
      <PageHeader
        title="Expenses"
        description="Submit and manage expense claims"
        breadcrumbs={[
          { label: 'Hub', href: '/hub' },
          { label: 'People / HR', href: '/hr' },
          { label: 'Expenses' },
        ]}
        actions={
          activeTab === 'expenses' && (
            <Button size="sm" onClick={() => {
              resetForm();
              setDrawerOpen(true);
            }}>
              <Plus className="h-4 w-4 mr-2" />
              New Expense
            </Button>
          )
        }
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="policies">Policies</TabsTrigger>
          <TabsTrigger value="reimbursement">Bulk Reimbursement</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="audit">Audit Trail</TabsTrigger>
        </TabsList>

        <TabsContent value="expenses" className="m-0">
          {/* Summary Cards */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Pending', value: expenses.filter(e => e.status === 'submitted').length, color: 'warning' },
              { label: 'Manager Approved', value: expenses.filter(e => e.status === 'manager_approved').length, color: 'warning' },
              { label: 'Approved', value: expenses.filter(e => e.status === 'admin_approved').length, color: 'success' },
              { label: 'Rejected', value: expenses.filter(e => e.status === 'rejected').length, color: 'destructive' },
            ].map((stat) => (
              <div key={stat.label} className="p-4 border border-border rounded-lg bg-card">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              </div>
            ))}
          </div>

          <DataTable
            data={expenses}
            columns={columns}
            searchable={false}
            viewToggle={false}
            onRowClick={(row) => {
              setViewingExpense(row);
              setViewOpen(true);
            }}
            actions={(row) => (
              <>
                <DropdownMenuItem onClick={() => {
                  setEditingExpense(row);
                  setFormData({
                    expenseType: row.expenseType,
                    amount: row.amount,
                    date: row.date,
                    description: row.description,
                  });
                  setDrawerOpen(true);
                }}>
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </DropdownMenuItem>

                {row.status === 'draft' && (
                  <DropdownMenuItem onClick={() => {
                    setEditingExpense(row);
                    setFormData({
                      expenseType: row.expenseType,
                      amount: row.amount,
                      date: row.date,
                      description: row.description,
                    });
                    setDrawerOpen(true);
                  }}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                )}

                {row.status === 'submitted' && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setActionDialog({ open: true, action: 'manager_approve', expense: row })}>
                      <Check className="h-4 w-4 mr-2 text-success" />
                      Approve (Manager)
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setActionDialog({ open: true, action: 'reject', expense: row })}>
                      <X className="h-4 w-4 mr-2 text-destructive" />
                      Reject
                    </DropdownMenuItem>
                  </>
                )}

                {row.status === 'manager_approved' && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setActionDialog({ open: true, action: 'admin_approve', expense: row })}>
                      <Check className="h-4 w-4 mr-2 text-success" />
                      Final Approve
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setActionDialog({ open: true, action: 'reject', expense: row })}>
                      <X className="h-4 w-4 mr-2 text-destructive" />
                      Reject
                    </DropdownMenuItem>
                  </>
                )}
              </>
            )}
          />
        </TabsContent>

        <TabsContent value="policies" className="m-0">
          <ExpensePolicies
            policies={expensePolicies}
            onSavePolicy={(policy) => {
              if (policy.id) {
                setExpensePolicies(prev => prev.map(p => p.id === policy.id ? { ...p, ...policy } as ExpensePolicy : p));
              } else {
                setExpensePolicies(prev => [...prev, { ...policy, id: String(prev.length + 1), version: 1 } as ExpensePolicy]);
              }
            }}
            onDeletePolicy={(id) => {
              setExpensePolicies(prev => prev.filter(p => p.id !== id));
            }}
            departments={departments.map(d => ({ id: d.id, name: d.name }))}
            designations={designations.map(d => ({ id: d.id, name: d.name }))}
          />
        </TabsContent>

        <TabsContent value="reimbursement" className="m-0">
          <BulkReimbursement
            expenses={expenses}
            onProcessPayment={(expenseIds, paymentMethod, batchId) => {
              setExpenses(prev => prev.map(e =>
                expenseIds.includes(e.id) ? { ...e, status: 'paid' as Expense['status'] } : e
              ));
            }}
          />
        </TabsContent>

        <TabsContent value="analytics" className="m-0">
          <ExpenseAnalytics
            expenses={expenses}
            employees={employees}
          />
        </TabsContent>

        <TabsContent value="audit" className="m-0">
          <ExpenseAuditTrail
            auditLogs={auditLogs}
            onExport={(format) => {
              // Handle export
            }}
          />
        </TabsContent>
      </Tabs>

      {/* Add/Edit Drawer */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent className="sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>{editingExpense ? 'View Expense' : 'New Expense'}</SheetTitle>
          </SheetHeader>

          <div className="space-y-4 py-6">
            <div className="form-field">
              <Label className="form-label">
                Expense Type <span className="form-required">*</span>
              </Label>
              <SearchableSelect
                options={expenseTypes}
                value={formData.expenseType}
                onChange={(value) => setFormData({ ...formData, expenseType: value })}
                placeholder="Select type"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="form-field">
                <Label className="form-label">
                  Amount <span className="form-required">*</span>
                </Label>
                <Input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                  placeholder="0"
                />
              </div>
              <div className="form-field">
                <Label className="form-label">Date</Label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
            </div>

            <div className="form-field">
              <Label className="form-label">Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the expense..."
                rows={3}
              />
            </div>

            <div className="form-field">
              <Label className="form-label">Attachments</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  Drag & drop files here or click to browse
                </p>
              </div>
            </div>
          </div>

          <SheetFooter>
            <Button variant="outline" onClick={() => setDrawerOpen(false)}>
              Cancel
            </Button>
            <Button variant="outline" onClick={() => {
              // Save as draft
              setDrawerOpen(false);
            }}>
              Save Draft
            </Button>
            <Button onClick={handleSubmit} disabled={!formData.expenseType || !formData.amount}>
              Submit
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Action Dialog */}
      <AlertDialog open={actionDialog.open} onOpenChange={(open) => setActionDialog(prev => ({ ...prev, open }))}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionDialog.action === 'reject' ? 'Reject Expense' : 'Approve Expense'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {actionDialog.action === 'reject'
                ? `Are you sure you want to reject this expense claim of ₹${actionDialog.expense?.amount.toLocaleString('en-IN')}?`
                : `Are you sure you want to approve this expense claim of ₹${actionDialog.expense?.amount.toLocaleString('en-IN')}?`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleAction}
              className={actionDialog.action === 'reject' ? 'bg-destructive hover:bg-destructive/90' : ''}
            >
              {actionDialog.action === 'reject' ? 'Reject' : 'Approve'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* View Expense Details Modal */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Expense Details</DialogTitle>
          </DialogHeader>
          {viewingExpense && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Employee</Label>
                  <button
                    onClick={() => {
                      navigate(`/hr/employees/${viewingExpense.employeeId}`);
                      setViewOpen(false);
                    }}
                    className="text-sm font-medium text-primary hover:underline text-left"
                  >
                    {viewingExpense.employeeName}
                  </button>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Type</Label>
                  <p className="text-sm font-medium text-gray-900">{viewingExpense.expenseType}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Amount</Label>
                  <p className="text-sm font-medium text-gray-900">₹{viewingExpense.amount.toLocaleString('en-IN')}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Date</Label>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(viewingExpense.date).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Attachments</Label>
                  <p className="text-sm font-medium text-gray-900">{viewingExpense.attachments.length} file(s)</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Status</Label>
                  <div className="mt-1">
                    <StatusBadge variant={
                      viewingExpense.status === 'admin_approved' || viewingExpense.status === 'paid' ? 'success' :
                        viewingExpense.status === 'submitted' || viewingExpense.status === 'manager_approved' ? 'warning' :
                          viewingExpense.status === 'rejected' ? 'destructive' : 'neutral'
                    }>
                      {viewingExpense.status === 'manager_approved' ? 'Manager Approved' :
                        viewingExpense.status === 'admin_approved' ? 'Approved' :
                          viewingExpense.status.charAt(0).toUpperCase() + viewingExpense.status.slice(1)}
                    </StatusBadge>
                  </div>
                </div>
                <div className="col-span-2">
                  <Label className="text-xs text-muted-foreground">Description</Label>
                  <p className="text-sm text-gray-900 mt-1">{viewingExpense.description || '-'}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewOpen(false)}>Close</Button>
            <Button onClick={() => {
              if (viewingExpense) {
                setEditingExpense(viewingExpense);
                setFormData({
                  expenseType: viewingExpense.expenseType,
                  amount: viewingExpense.amount,
                  date: viewingExpense.date,
                  description: viewingExpense.description,
                });
                setViewOpen(false);
                setDrawerOpen(true);
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
