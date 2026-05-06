import { useEffect, useMemo, useState } from 'react';

import { PageHeader } from '@/components/ui/page-header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DataTable } from '@/components/ui/data-table';
import { StatusBadge } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, Users, Eye } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

import { useLocation, useNavigate } from 'react-router-dom';

import { DepartmentModal } from '@/components/hr/DepartmentModal';
import { DesignationModal } from '@/components/hr/DesignationModal';
import { GradePayModal } from '@/components/hr/GradePayModal';
import { ReportingHierarchy } from '@/components/hr/ReportingHierarchy';
import { OrgTreeNode } from '@/components/hr/OrgTreeNode';

import {
  departments as initialDepartments,
  designations as initialDesignations,
  gradePays as initialGradePays,
  employees as allEmployees
} from '@/data/hr-dummy-data';
import { orgTree } from '@/data/hr-dummy-data';

import type { Department, Designation, GradePay } from '@/types/hr';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { usePermissions } from '@/hooks/usePermissions';

export default function Organization() {
  const navigate = useNavigate();
  const location = useLocation();
  const { checkModuleAccess, user } = usePermissions();
  const [activeTab, setActiveTab] = useState('departments');

  // Support deep-linking to a tab, e.g. /hr/organization?tab=orgtree
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    const allowedTabs = new Set(['departments', 'designations', 'gradepay', 'hierarchy', 'orgtree']);
    if (tab && allowedTabs.has(tab)) {
      setActiveTab(tab);
    }
  }, [location.search]);

  // Admin-level access check
  if (!checkModuleAccess('organization')) {
    return (
      <div>
        <PageHeader
          title="Access Denied"
          description="You do not have permission to access this module"
        />
      </div>
    );
  }

  // Data states
  const [departments, setDepartments] = useState(initialDepartments);
  const [designations, setDesignations] = useState(initialDesignations);
  const [gradePays, setGradePays] = useState(initialGradePays);

  // Modal states
  const [deptModalOpen, setDeptModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);

  const [desgModalOpen, setDesgModalOpen] = useState(false);
  const [editingDesg, setEditingDesg] = useState<Designation | null>(null);

  const [gradeModalOpen, setGradeModalOpen] = useState(false);
  const [editingGrade, setEditingGrade] = useState<GradePay | null>(null);
  const [viewDeptOpen, setViewDeptOpen] = useState(false);
  const [viewingDept, setViewingDept] = useState<Department | null>(null);
  const [viewDesgOpen, setViewDesgOpen] = useState(false);
  const [viewingDesg, setViewingDesg] = useState<Designation | null>(null);
  const [viewGradeOpen, setViewGradeOpen] = useState(false);
  const [viewingGrade, setViewingGrade] = useState<GradePay | null>(null);
  const [viewEmployeesOpen, setViewEmployeesOpen] = useState(false);
  const [filteredEmployees, setFilteredEmployees] = useState<typeof allEmployees>([]);
  const [employeeFilterType, setEmployeeFilterType] = useState<'department' | 'designation'>('department');
  const [employeeFilterValue, setEmployeeFilterValue] = useState<string>('');

  // Calculate employee count dynamically
  const departmentsWithCount = useMemo(() => {
    return departments.map(dept => ({
      ...dept,
      employeeCount: allEmployees.filter(emp => emp.department === dept.name).length
    }));
  }, [departments]);

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

  // Department handlers
  const handleSaveDepartment = (dept: Partial<Department>) => {
    if (dept.id) {
      setDepartments(prev => prev.map(d => d.id === dept.id ? { ...d, ...dept } as Department : d));
    } else {
      const newDept: Department = {
        ...dept,
        id: String(departments.length + 1),
        employeeCount: 0,
        createdAt: new Date().toISOString().split('T')[0],
      } as Department;
      setDepartments(prev => [...prev, newDept]);
    }
  };

  const handleAddNewDepartment = (name: string) => {
    const newDept: Department = {
      id: String(departments.length + 1),
      name: name,
      code: name.substring(0, 5).toUpperCase(),
      employeeCount: 0,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setDepartments(prev => [...prev, newDept]);
    setEditingDept(newDept);
    setDeptModalOpen(true);
  };

  const handleDeleteDepartment = (id: string) => {
    setDepartments(prev => prev.filter(d => d.id !== id));
  };

  // Designation handlers
  const handleSaveDesignation = (desg: Partial<Designation>) => {
    if (desg.id) {
      setDesignations(prev => prev.map(d => d.id === desg.id ? { ...d, ...desg } as Designation : d));
    } else {
      const newDesg: Designation = {
        ...desg,
        id: String(designations.length + 1),
      } as Designation;
      setDesignations(prev => [...prev, newDesg]);
    }
  };

  const handleDeleteDesignation = (id: string) => {
    setDesignations(prev => prev.filter(d => d.id !== id));
  };

  // Grade Pay handlers
  const handleSaveGradePay = (grade: Partial<GradePay>) => {
    if (grade.id) {
      setGradePays(prev => prev.map(g => g.id === grade.id ? { ...g, ...grade } as GradePay : g));
    } else {
      const newGrade: GradePay = {
        ...grade,
        id: String(gradePays.length + 1),
      } as GradePay;
      setGradePays(prev => [...prev, newGrade]);
    }
  };

  const handleAddNewGradePay = (name: string) => {
    const newGrade: GradePay = {
      id: String(gradePays.length + 1),
      name: name,
      code: name.substring(0, 5).toUpperCase(),
      minSalary: 0,
      maxSalary: 0,
      allowances: 0,
      level: 1,
      status: 'active',
    };
    setGradePays(prev => [...prev, newGrade]);
    setEditingGrade(newGrade);
    setGradeModalOpen(true);
  };

  const handleDeleteGradePay = (id: string) => {
    setGradePays(prev => prev.filter(g => g.id !== id));
  };

  // Column definitions
  // Build department path for display
  const buildDepartmentPath = (dept: Department, allDepts: Department[]): string => {
    if (!dept.parentDepartmentId) return dept.name;
    const parent = allDepts.find(d => d.id === dept.parentDepartmentId);
    if (!parent) return dept.name;
    return `${buildDepartmentPath(parent, allDepts)} > ${dept.name}`;
  };

  const departmentColumns = [
    { key: 'code', label: 'Code', sortable: true, width: '80px' },
    {
      key: 'name',
      label: 'Department',
      sortable: true,
      render: (value: unknown, row: Department) => {
        const path = buildDepartmentPath(row, departments);
        return (
          <div>
            <div className="font-medium text-foreground">{row.name}</div>
            {row.parentDepartmentId && (
              <div className="text-xs text-muted-foreground">{path}</div>
            )}
          </div>
        );
      }
    },
    { key: 'headEmployee', label: 'Department Head', sortable: true },
    {
      key: 'employeeCount',
      label: 'Employees',
      sortable: true,
      render: (value: unknown, row: Department) => {
        const count = allEmployees.filter(emp => emp.department === row.name).length;
        return (
          <div className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5 text-muted-foreground" />
            <span>{count}</span>
          </div>
        );
      }
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

  const designationColumns = [
    { key: 'name', label: 'Designation', sortable: true },
    { key: 'department', label: 'Department', sortable: true },
    { key: 'grade', label: 'Grade Pay', sortable: true },
    { key: 'level', label: 'Level', sortable: true, width: '80px' },
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

  const gradePayColumns = [
    { key: 'code', label: 'Code', sortable: true, width: '80px' },
    { key: 'name', label: 'Grade Name', sortable: true },
    { key: 'level', label: 'Level', sortable: true, width: '80px' },
    {
      key: 'minSalary',
      label: 'Min Salary',
      sortable: true,
      render: (value: unknown) => `₹${(value as number).toLocaleString('en-IN')}`
    },
    {
      key: 'maxSalary',
      label: 'Max Salary',
      sortable: true,
      render: (value: unknown) => `₹${(value as number).toLocaleString('en-IN')}`
    },
    {
      key: 'allowances',
      label: 'Allowances',
      render: (value: unknown) => `₹${(value as number).toLocaleString('en-IN')}`
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
        title="Organization Structure"
        breadcrumbs={[
          { label: 'Hub', href: '/hub' },
          { label: 'People / HR', href: '/hr' },
          { label: 'Organization' },
        ]}
        actions={
          activeTab !== 'orgtree' && (
            <Button
              size="sm"
              onClick={() => {
                if (activeTab === 'departments') {
                  setEditingDept(null);
                  setDeptModalOpen(true);
                } else if (activeTab === 'designations') {
                  setEditingDesg(null);
                  setDesgModalOpen(true);
                } else if (activeTab === 'gradepay') {
                  setEditingGrade(null);
                  setGradeModalOpen(true);
                }
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add {activeTab === 'departments' ? 'Department' : activeTab === 'designations' ? 'Designation' : 'Grade Pay'}
            </Button>
          )
        }
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="designations">Roles & Designations</TabsTrigger>
          <TabsTrigger value="gradepay">Grade Pay</TabsTrigger>
          <TabsTrigger value="hierarchy">Reporting Hierarchy</TabsTrigger>
          <TabsTrigger value="orgtree">Org Tree</TabsTrigger>
        </TabsList>

        {/* Departments Tab */}
        <TabsContent value="departments" className="m-0">
          <DataTable
            data={departmentsWithCount}
            columns={departmentColumns}
            searchable={false}
            viewToggle={false}
            onRowClick={(row) => {
              setViewingDept(row);
              setViewDeptOpen(true);
            }}
            actions={(row) => (
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => {
                  e.stopPropagation();
                  setEditingDept(row);
                  setDeptModalOpen(true);
                }}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteDepartment(row.id);
                }}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          />
        </TabsContent>

        {/* Designations Tab */}
        <TabsContent value="designations" className="m-0">
          <DataTable
            data={designations}
            columns={designationColumns}
            searchable={false}
            viewToggle={false}
            onRowClick={(row) => {
              setViewingDesg(row);
              setViewDesgOpen(true);
            }}
            actions={(row) => (
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => {
                  e.stopPropagation();
                  setEditingDesg(row);
                  setDesgModalOpen(true);
                }}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteDesignation(row.id);
                }}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          />
        </TabsContent>

        {/* Grade Pay Tab */}
        <TabsContent value="gradepay" className="m-0">
          <DataTable
            data={gradePays}
            columns={gradePayColumns}
            searchable={false}
            viewToggle={false}
            onRowClick={(row) => {
              setViewingGrade(row);
              setViewGradeOpen(true);
            }}
            actions={(row) => (
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => {
                  e.stopPropagation();
                  setEditingGrade(row);
                  setGradeModalOpen(true);
                }}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteGradePay(row.id);
                }}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          />
        </TabsContent>

        {/* Reporting Hierarchy Tab */}
        <TabsContent value="hierarchy" className="m-0">
          <ReportingHierarchy
            departments={departments}
            employees={allEmployees}
            onUpdateReportingManager={(employeeId, managerId) => {
              // Update employee reporting manager
              // In real app, this would update the employee data
              console.log('Update reporting manager', employeeId, managerId);
            }}
          />
        </TabsContent>

        {/* Org Tree Tab */}
        <TabsContent value="orgtree" className="m-0">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-foreground">Organization Tree</h3>
                <p className="text-xs text-muted-foreground mt-1">Visual hierarchy of the organization structure</p>
              </div>
            </div>

            <div className="border border-border rounded-lg bg-card">
              <div className="p-4 border-b border-border text-sm text-muted-foreground">
                Click nodes to expand/collapse
              </div>
              <div className="p-6 overflow-auto">
                <div className="min-w-max">
                  <OrgTreeNode node={orgTree} />
                </div>
              </div>
            </div>
          </div>
        </TabsContent>


      </Tabs>

      {/* Modals */}
      <DepartmentModal
        open={deptModalOpen}
        onOpenChange={setDeptModalOpen}
        department={editingDept}
        departments={departments}
        onSave={handleSaveDepartment}
        onAddDepartment={handleAddNewDepartment}
      />

      <DesignationModal
        open={desgModalOpen}
        onOpenChange={setDesgModalOpen}
        designation={editingDesg}
        departments={departments}
        gradePays={gradePays}
        onSave={handleSaveDesignation}
        onAddDepartment={handleAddNewDepartment}
        onAddGradePay={handleAddNewGradePay}
      />

      <GradePayModal
        open={gradeModalOpen}
        onOpenChange={setGradeModalOpen}
        gradePay={editingGrade}
        onSave={handleSaveGradePay}
      />

      {/* View Department Modal */}
      <Dialog open={viewDeptOpen} onOpenChange={setViewDeptOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Department Details</DialogTitle>
          </DialogHeader>
          {viewingDept && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Department Name</Label>
                  <p className="text-sm font-medium text-gray-900">{viewingDept.name}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Code</Label>
                  <p className="text-sm font-medium text-gray-900">{viewingDept.code}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Department Head</Label>
                  <p className="text-sm font-medium text-gray-900">{viewingDept.headEmployee || 'Not Assigned'}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Employee Count</Label>
                  <p className="text-sm font-medium text-gray-900">
                    {allEmployees.filter(emp => emp.department === viewingDept.name).length}
                  </p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Status</Label>
                  <div className="mt-1">
                    <StatusBadge variant={viewingDept.status === 'active' ? 'success' : 'neutral'}>
                      {viewingDept.status === 'active' ? 'Active' : 'Inactive'}
                    </StatusBadge>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDeptOpen(false)}>
              Close
            </Button>
            <Button onClick={() => {
              if (viewingDept) {
                setFilteredEmployees(allEmployees.filter(emp => emp.department === viewingDept.name));
                setEmployeeFilterType('department');
                setEmployeeFilterValue(viewingDept.name);
                setViewDeptOpen(false);
                setViewEmployeesOpen(true);
              }
            }}>
              <Users className="h-4 w-4 mr-2" />
              View Employees ({allEmployees.filter(emp => viewingDept && emp.department === viewingDept.name).length})
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Designation Modal */}
      <Dialog open={viewDesgOpen} onOpenChange={setViewDesgOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Designation Details</DialogTitle>
          </DialogHeader>
          {viewingDesg && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Designation Name</Label>
                  <p className="text-sm font-medium text-gray-900">{viewingDesg.name}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Department</Label>
                  <p className="text-sm font-medium text-gray-900">{viewingDesg.department || 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Grade Pay</Label>
                  <p className="text-sm font-medium text-gray-900">{viewingDesg.grade || 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Level</Label>
                  <p className="text-sm font-medium text-gray-900">{viewingDesg.level}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Status</Label>
                  <div className="mt-1">
                    <StatusBadge variant={viewingDesg.status === 'active' ? 'success' : 'neutral'}>
                      {viewingDesg.status === 'active' ? 'Active' : 'Inactive'}
                    </StatusBadge>
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Employee Count</Label>
                  <p className="text-sm font-medium text-gray-900">
                    {allEmployees.filter(emp => emp.designation === viewingDesg.name).length}
                  </p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDesgOpen(false)}>
              Close
            </Button>
            <Button onClick={() => {
              if (viewingDesg) {
                setFilteredEmployees(allEmployees.filter(emp => emp.designation === viewingDesg.name));
                setEmployeeFilterType('designation');
                setEmployeeFilterValue(viewingDesg.name);
                setViewDesgOpen(false);
                setViewEmployeesOpen(true);
              }
            }}>
              <Users className="h-4 w-4 mr-2" />
              View Employees ({allEmployees.filter(emp => viewingDesg && emp.designation === viewingDesg.name).length})
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Grade Pay Modal */}
      <Dialog open={viewGradeOpen} onOpenChange={setViewGradeOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Grade Pay Details</DialogTitle>
          </DialogHeader>
          {viewingGrade && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Grade Name</Label>
                  <p className="text-sm font-medium text-gray-900">{viewingGrade.name}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Code</Label>
                  <p className="text-sm font-medium text-gray-900">{viewingGrade.code}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Min Salary</Label>
                  <p className="text-sm font-medium text-gray-900">₹{viewingGrade.minSalary.toLocaleString('en-IN')}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Max Salary</Label>
                  <p className="text-sm font-medium text-gray-900">₹{viewingGrade.maxSalary.toLocaleString('en-IN')}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Allowances</Label>
                  <p className="text-sm font-medium text-gray-900">₹{viewingGrade.allowances.toLocaleString('en-IN')}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Level</Label>
                  <p className="text-sm font-medium text-gray-900">{viewingGrade.level}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Status</Label>
                  <div className="mt-1">
                    <StatusBadge variant={viewingGrade.status === 'active' ? 'success' : 'neutral'}>
                      {viewingGrade.status === 'active' ? 'Active' : 'Inactive'}
                    </StatusBadge>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewGradeOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Employees Modal */}
      <Dialog open={viewEmployeesOpen} onOpenChange={setViewEmployeesOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>
              Employees - {employeeFilterType === 'department' ? `Department: ${employeeFilterValue}` : `Designation: ${employeeFilterValue}`}
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
    </div>
  );
}
