import { useState } from 'react';
import ShiftSwap from './ShiftSwap';

import { PageHeader } from '@/components/ui/page-header';
import { DataTable } from '@/components/ui/data-table';
import { StatusBadge } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, Clock } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { ShiftModal } from '@/components/hr/ShiftModal';
import { ShiftScheduler } from '@/components/hr/ShiftScheduler';
import { OvertimeRules } from '@/components/hr/OvertimeRules';
import { ShiftConflictResolver } from '@/components/hr/ShiftConflictResolver';
import { shifts as initialShifts, departments, employees as allEmployees } from '@/data/hr-dummy-data';
import type { Shift, ShiftSchedule, OvertimeRule } from '@/types/hr';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Users } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import { usePermissions } from '@/hooks/usePermissions';

export default function Shifts() {
  const navigate = useNavigate();
  const { checkModuleAccess } = usePermissions();
  const [activeTab, setActiveTab] = useState('shifts');

  // Admin-level access check
  if (!checkModuleAccess('shifts')) {
    return (
      <div>
        <PageHeader
          title="Access Denied"
          description="You do not have permission to access this module"
        />
      </div>
    );
  }
  const [shifts, setShifts] = useState(initialShifts);
  const [shiftSchedules, setShiftSchedules] = useState<ShiftSchedule[]>([]);
  const [overtimeRules, setOvertimeRules] = useState<OvertimeRule[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [viewEmployeesOpen, setViewEmployeesOpen] = useState(false);
  const [editingShift, setEditingShift] = useState<Shift | null>(null);
  const [viewingShift, setViewingShift] = useState<Shift | null>(null);
  const [filteredEmployees, setFilteredEmployees] = useState<typeof allEmployees>([]);

  // Get employees for a shift
  const getShiftEmployees = (shiftId: string) => {
    return allEmployees.filter(emp => emp.shiftId === shiftId);
  };

  // Employee columns for view modal
  const employeeColumns = [
    {
      key: 'name',
      label: 'Employee',
      sortable: true,
      render: (value: unknown, row: typeof allEmployees[0]) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-muted text-foreground text-xs font-semibold">
              {row.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium text-foreground">{row.name}</div>
            <div className="text-xs text-muted-foreground">{row.email}</div>
          </div>
        </div>
      ),
    },
    { key: 'designation', label: 'Designation', sortable: true },
    { key: 'department', label: 'Department', sortable: true },
    {
      key: 'status',
      label: 'Status',
      render: (value: unknown) => {
        const status = value as string;
        const variant = status === 'active' ? 'success' : status === 'on_leave' ? 'warning' : 'neutral';
        return <StatusBadge variant={variant}>{status === 'active' ? 'Active' : status === 'on_leave' ? 'On Leave' : 'Inactive'}</StatusBadge>;
      },
    },
  ];

  const handleSave = (shift: Partial<Shift>) => {
    if (shift.id) {
      setShifts(prev => prev.map(s => s.id === shift.id ? { ...s, ...shift } as Shift : s));
    } else {
      const newShift: Shift = {
        ...shift,
        id: String(shifts.length + 1),
      } as Shift;
      setShifts(prev => [...prev, newShift]);
    }
  };

  const handleDelete = (id: string) => {
    setShifts(prev => prev.filter(s => s.id !== id));
  };

  const columns = [
    { key: 'code', label: 'Code', sortable: true, width: '80px' },
    { key: 'name', label: 'Shift Name', sortable: true },
    {
      key: 'startTime',
      label: 'Timing',
      render: (_: unknown, row: Shift) => (
        <div className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
          <span>{row.startTime} - {row.endTime}</span>
        </div>
      ),
    },
    {
      key: 'workingHours',
      label: 'Working Hours',
      render: (value: unknown) => `${value} hrs`,
    },
    {
      key: 'breakDuration',
      label: 'Break',
      render: (value: unknown) => `${value} mins`,
    },
    {
      key: 'applicableDepartments',
      label: 'Departments',
      render: (value: unknown) => {
        const depts = (value as string[]) || [];
        return (
          <div className="flex flex-wrap gap-1">
            {depts.slice(0, 2).map(dept => (
              <Badge key={dept} variant="secondary" className="text-xs">
                {dept}
              </Badge>
            ))}
            {depts.length > 2 && (
              <Badge variant="secondary" className="text-xs">
                +{depts.length - 2}
              </Badge>
            )}
          </div>
        );
      },
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
    <div>
      <PageHeader
        title="Shift Management"
        description="Configure work shifts and assign to departments"
        breadcrumbs={[
          { label: 'Hub', href: '/hub' },
          { label: 'People / HR', href: '/hr' },
          { label: 'Shifts' },
        ]}
        actions={
          <Button size="sm" onClick={() => {
            setEditingShift(null);
            setModalOpen(true);
          }}>
            <Plus className="h-4 w-4 mr-2" />
            Add Shift
          </Button>
        }
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="shifts">Shifts</TabsTrigger>
          <TabsTrigger value="swap">Swap Requests</TabsTrigger>
          <TabsTrigger value="scheduler">Scheduler</TabsTrigger>
          <TabsTrigger value="overtime">Overtime Rules</TabsTrigger>
          <TabsTrigger value="conflicts">Conflicts</TabsTrigger>
        </TabsList>

        <TabsContent value="shifts" className="m-0">
      <DataTable
        data={shifts}
        columns={columns}
        searchable={false}
        viewToggle={false}
        onRowClick={(row) => {
          setViewingShift(row);
          setViewOpen(true);
        }}
        actions={(row) => (
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => {
              e.stopPropagation();
              setEditingShift(row);
              setModalOpen(true);
            }}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={(e) => {
              e.stopPropagation();
              handleDelete(row.id);
            }}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      />

      <ShiftModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        shift={editingShift}
        departments={departments}
        onSave={handleSave}
      />

      {/* View Shift Details Modal */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Shift Details</DialogTitle>
          </DialogHeader>
          
          {viewingShift && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Code</Label>
                  <p className="text-sm font-medium text-gray-900">{viewingShift.code}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Shift Name</Label>
                  <p className="text-sm font-medium text-gray-900">{viewingShift.name}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Start Time</Label>
                  <p className="text-sm font-medium text-gray-900">{viewingShift.startTime}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">End Time</Label>
                  <p className="text-sm font-medium text-gray-900">{viewingShift.endTime}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Working Hours</Label>
                  <p className="text-sm font-medium text-gray-900">{viewingShift.workingHours} hrs</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Break Duration</Label>
                  <p className="text-sm font-medium text-gray-900">{viewingShift.breakDuration} mins</p>
                </div>
                <div className="col-span-2">
                  <Label className="text-xs text-muted-foreground">Departments</Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {viewingShift.applicableDepartments.map(dept => (
                      <Badge key={dept} variant="secondary" className="text-xs">
                        {dept}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Status</Label>
                  <div className="mt-1">
                    <StatusBadge variant={viewingShift.status === 'active' ? 'success' : 'neutral'}>
                      {viewingShift.status === 'active' ? 'Active' : 'Inactive'}
                    </StatusBadge>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setViewOpen(false)}>
              Close
            </Button>
            <Button variant="outline" onClick={() => {
              if (viewingShift) {
                const shiftEmployees = getShiftEmployees(viewingShift.id);
                setFilteredEmployees(shiftEmployees);
                setViewOpen(false);
                setViewEmployeesOpen(true);
              }
            }}>
              <Users className="h-4 w-4 mr-2" />
              View Employees ({viewingShift ? getShiftEmployees(viewingShift.id).length : 0})
            </Button>
            <Button onClick={() => {
              if (viewingShift) {
                setEditingShift(viewingShift);
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

      {/* View Employees Modal */}
      <Dialog open={viewEmployeesOpen} onOpenChange={setViewEmployeesOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>
              Employees - {viewingShift?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <DataTable
              data={filteredEmployees}
              columns={employeeColumns}
              searchable={false}
              viewToggle={false}
              onRowClick={(row) => {
                navigate(`/hr/employees/${row.id}`);
                setViewEmployeesOpen(false);
              }}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewEmployeesOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

        </TabsContent>

        <TabsContent value="swap" className="m-0">
          <ShiftSwap />
        </TabsContent>
        <TabsContent value="scheduler" className="m-0">
          <ShiftScheduler
            shifts={shifts}
            employees={allEmployees}
            schedules={shiftSchedules}
            onSaveSchedule={(schedule) => {
              if (schedule.id) {
                setShiftSchedules(prev => prev.map(s => s.id === schedule.id ? { ...s, ...schedule } as ShiftSchedule : s));
              } else {
                setShiftSchedules(prev => [...prev, { ...schedule, id: String(prev.length + 1) } as ShiftSchedule]);
              }
            }}
          />
        </TabsContent>

        <TabsContent value="overtime" className="m-0">
          <OvertimeRules
            rules={overtimeRules}
            onSaveRule={(rule) => {
              if (rule.id) {
                setOvertimeRules(prev => prev.map(r => r.id === rule.id ? { ...r, ...rule } as OvertimeRule : r));
              } else {
                setOvertimeRules(prev => [...prev, { ...rule, id: String(prev.length + 1) } as OvertimeRule]);
              }
            }}
            onDeleteRule={(id) => {
              setOvertimeRules(prev => prev.filter(r => r.id !== id));
            }}
            departments={departments.map(d => ({ id: d.id, name: d.name }))}
            designations={[]}
          />
        </TabsContent>

        <TabsContent value="conflicts" className="m-0">
          <ShiftConflictResolver
            schedules={shiftSchedules}
            shifts={shifts}
            employees={allEmployees}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
