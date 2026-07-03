import { useState } from 'react';
import { DataTable } from '@/components/ui/data-table';
import { StatusBadge } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { attendancePolicies as initialPolicies } from '@/data/hr-dummy-data';
import type { AttendancePolicy } from '@/types/hr';

export default function AttendancePolicies() {
  const [policies, setPolicies] = useState(initialPolicies);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<AttendancePolicy | null>(null);
  const [viewingPolicy, setViewingPolicy] = useState<AttendancePolicy | null>(null);

  const handleSave = (policy: Partial<AttendancePolicy>) => {
    if (policy.id) {
      setPolicies(prev => prev.map(p => p.id === policy.id ? { ...p, ...policy } as AttendancePolicy : p));
    } else {
      setPolicies(prev => [...prev, { ...policy, id: String(prev.length + 1), createdAt: new Date().toISOString().split('T')[0] } as AttendancePolicy]);
    }
    setModalOpen(false);
    setEditingPolicy(null);
  };

  const columns = [
    { key: 'name', label: 'Policy Name', sortable: true },
    {
      key: 'applicableTo',
      label: 'Applicable To',
      render: (value: unknown, row: AttendancePolicy) => {
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
      key: 'workHoursPerDay',
      label: 'Work Hours/Day',
      render: (value: unknown) => `${value} hrs`,
    },
    {
      key: 'workDaysPerWeek',
      label: 'Work Days/Week',
      render: (value: unknown) => `${value} days`,
    },
    {
      key: 'lateArrivalGraceMinutes',
      label: 'Grace Period',
      render: (value: unknown) => `${value} mins`,
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
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Attendance Policies</h3>
          <p className="text-sm text-muted-foreground">Manage attendance rules and policies</p>
        </div>
        <Button onClick={() => {
          setEditingPolicy(null);
          setModalOpen(true);
        }}>
          <Plus className="h-4 w-4 mr-2" />
          Add Policy
        </Button>
      </div>

      <DataTable
        data={policies}
        columns={columns as any}
        onRowClick={(row) => {
          setViewingPolicy(row);
          setViewOpen(true);
        }}
        actions={(row) => (
          <>
            <DropdownMenuItem onClick={() => {
              setViewingPolicy(row);
              setViewOpen(true);
            }}>
              <Eye className="h-4 w-4 mr-2" />
              View
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => {
              setEditingPolicy(row);
              setModalOpen(true);
            }}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => setPolicies(prev => prev.filter(p => p.id !== row.id))}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </>
        )}
      />

      {/* Add/Edit Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingPolicy ? 'Edit Attendance Policy' : 'Add Attendance Policy'}</DialogTitle>
          </DialogHeader>
          <PolicyForm
            policy={editingPolicy}
            onSave={handleSave}
            onCancel={() => {
              setModalOpen(false);
              setEditingPolicy(null);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* View Modal */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Attendance Policy Details</DialogTitle>
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
                  <Label className="text-xs text-muted-foreground">Work Hours/Day</Label>
                  <p className="text-sm font-medium text-gray-900">{viewingPolicy.workHoursPerDay} hrs</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Work Days/Week</Label>
                  <p className="text-sm font-medium text-gray-900">{viewingPolicy.workDaysPerWeek} days</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Grace Period</Label>
                  <p className="text-sm font-medium text-gray-900">{viewingPolicy.lateArrivalGraceMinutes} mins</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Overtime Rate</Label>
                  <p className="text-sm font-medium text-gray-900">{viewingPolicy.overtimeRate ? `${viewingPolicy.overtimeRate}x` : 'N/A'}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                <div className="flex items-center gap-2">
                  <Switch checked={viewingPolicy.halfDayAllowed} disabled />
                  <Label>Half Day Allowed</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={viewingPolicy.overtimeAllowed} disabled />
                  <Label>Overtime Allowed</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={viewingPolicy.biometricRequired} disabled />
                  <Label>Biometric Required</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={viewingPolicy.flexibleTimings} disabled />
                  <Label>Flexible Timings</Label>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewOpen(false)}>Close</Button>
            <Button onClick={() => {
              if (viewingPolicy) {
                setEditingPolicy(viewingPolicy);
                setViewOpen(false);
                setModalOpen(true);
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

function PolicyForm({ policy, onSave, onCancel }: { policy: AttendancePolicy | null; onSave: (p: Partial<AttendancePolicy>) => void; onCancel: () => void }) {
  const [formData, setFormData] = useState<Partial<AttendancePolicy>>({
    name: policy?.name || '',
    description: policy?.description || '',
    applicableTo: policy?.applicableTo || 'all',
    workHoursPerDay: policy?.workHoursPerDay || 8,
    workDaysPerWeek: policy?.workDaysPerWeek || 6,
    lateArrivalGraceMinutes: policy?.lateArrivalGraceMinutes || 15,
    earlyDepartureAllowed: policy?.earlyDepartureAllowed || false,
    halfDayAllowed: policy?.halfDayAllowed || true,
    overtimeAllowed: policy?.overtimeAllowed || false,
    overtimeRate: policy?.overtimeRate || 1.5,
    biometricRequired: policy?.biometricRequired || true,
    flexibleTimings: policy?.flexibleTimings || false,
    status: policy?.status || 'active',
  });

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      onSave({ ...formData, id: policy?.id });
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
          <Label htmlFor="workHoursPerDay">Work Hours/Day</Label>
          <Input
            id="workHoursPerDay"
            type="number"
            value={formData.workHoursPerDay}
            onChange={(e) => setFormData({ ...formData, workHoursPerDay: Number(e.target.value) })}
            min={1}
            max={24}
            required
          />
        </div>
        <div>
          <Label htmlFor="workDaysPerWeek">Work Days/Week</Label>
          <Input
            id="workDaysPerWeek"
            type="number"
            value={formData.workDaysPerWeek}
            onChange={(e) => setFormData({ ...formData, workDaysPerWeek: Number(e.target.value) })}
            min={1}
            max={7}
            required
          />
        </div>
        <div>
          <Label htmlFor="gracePeriod">Grace Period (minutes)</Label>
          <Input
            id="gracePeriod"
            type="number"
            value={formData.lateArrivalGraceMinutes}
            onChange={(e) => setFormData({ ...formData, lateArrivalGraceMinutes: Number(e.target.value) })}
            min={0}
            required
          />
        </div>
        <div>
          <Label htmlFor="overtimeRate">Overtime Rate</Label>
          <Input
            id="overtimeRate"
            type="number"
            step="0.1"
            value={formData.overtimeRate}
            onChange={(e) => setFormData({ ...formData, overtimeRate: Number(e.target.value) })}
            min={1}
            disabled={!formData.overtimeAllowed}
          />
        </div>
        <div className="flex items-center gap-2">
          <Switch
            checked={formData.halfDayAllowed}
            onCheckedChange={(checked) => setFormData({ ...formData, halfDayAllowed: checked })}
          />
          <Label>Half Day Allowed</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            checked={formData.overtimeAllowed}
            onCheckedChange={(checked) => setFormData({ ...formData, overtimeAllowed: checked })}
          />
          <Label>Overtime Allowed</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            checked={formData.biometricRequired}
            onCheckedChange={(checked) => setFormData({ ...formData, biometricRequired: checked })}
          />
          <Label>Biometric Required</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            checked={formData.flexibleTimings}
            onCheckedChange={(checked) => setFormData({ ...formData, flexibleTimings: checked })}
          />
          <Label>Flexible Timings</Label>
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
        <Button type="submit">Save</Button>
      </DialogFooter>
    </form>
  );
}
