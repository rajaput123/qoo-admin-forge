import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { PageHeader } from '@/components/ui/page-header';
import { DataTable } from '@/components/ui/data-table';
import { StatusBadge } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import {
  Plus,
  Download,
  Upload,
  Eye,
  Edit,
  Trash2,
  Filter,
  X
} from 'lucide-react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SearchableSelect } from '@/components/ui/searchable-select';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { EmployeeBulkImport } from '@/components/hr/EmployeeBulkImport';
import { usePermissions } from '@/hooks/usePermissions';
import { filterEmployeesByRole } from '@/lib/permissions';
import type { Employee } from '@/types/erp';
import { departments as orgDepartments, designations as orgDesignations } from '@/data/hr-dummy-data';
import { useToast } from '@/hooks/use-toast';
import { getEmployees as getStoredEmployees, setEmployees as setStoredEmployees } from '@/lib/hr-employee-store';

// Convert organization data to select options
const departments = orgDepartments.map(d => ({ value: d.name.toLowerCase(), label: d.name }));
const designations = orgDesignations.map(d => ({ value: d.name.toLowerCase().replace(/ /g, '_'), label: d.name }));

export default function Employees() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, checkWriteAccess, isReadOnly } = usePermissions();
  const [employees, setEmployees] = useState(getStoredEmployees());
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [viewingEmployee, setViewingEmployee] = useState<Employee | null>(null);
  const [departmentOptions, setDepartmentOptions] = useState(departments);
  const [designationOptions, setDesignationOptions] = useState(designations);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    designation: '',
  });

  // Advanced filters
  const [filters, setFilters] = useState({
    departments: [] as string[],
    status: [] as string[],
    email: '',
    phone: '',
    joinDateFrom: '',
    joinDateTo: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState<Set<string>>(new Set());

  // Filter employees based on role and filters
  const filteredEmployees = useMemo(() => {
    let filtered = filterEmployeesByRole(employees, user?.role || 'super_admin');

    if (filters.departments.length > 0) {
      filtered = filtered.filter(emp => filters.departments.includes(emp.department));
    }

    if (filters.status.length > 0) {
      filtered = filtered.filter(emp => filters.status.includes(emp.status));
    }

    if (filters.email) {
      filtered = filtered.filter(emp => emp.email.toLowerCase().includes(filters.email.toLowerCase()));
    }

    if (filters.phone) {
      filtered = filtered.filter(emp => emp.phone.includes(filters.phone));
    }

    if (filters.joinDateFrom) {
      filtered = filtered.filter(emp => (emp.joiningDate || emp.joinDate || '') >= filters.joinDateFrom);
    }

    if (filters.joinDateTo) {
      filtered = filtered.filter(emp => (emp.joiningDate || emp.joinDate || '') <= filters.joinDateTo);
    }

    return filtered;
  }, [employees, filters, user?.role]);

  const columns = [
    {
      key: 'name',
      label: 'Employee',
      sortable: true,
      render: (value: unknown, row: Employee) => (
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
    {
      key: 'designation',
      label: 'Designation',
      sortable: true,
    },
    {
      key: 'department',
      label: 'Department',
      sortable: true,
    },
    {
      key: 'phone',
      label: 'Phone',
    },
    {
      key: 'joiningDate',
      label: 'Join Date',
      sortable: true,
      render: (_: unknown, row: Employee) => {
        const dateStr = row.joiningDate || (row as any).joinDate;
        if (!dateStr) return '-';
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        });
      },
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: unknown) => {
        const status = value as Employee['status'];
        const variant = status === 'active' ? 'success' : status === 'on_leave' ? 'warning' : 'neutral';
        const label = status === 'active' ? 'Active' : status === 'on_leave' ? 'On Leave' : 'Inactive';
        return <StatusBadge variant={variant}>{label}</StatusBadge>;
      },
    },
  ];

  const handleAddNew = () => {
    if (!checkWriteAccess('employees')) {
      toast({
        title: 'Access denied',
        description: 'You do not have permission to add employees.',
        variant: 'destructive',
      });
      return;
    }

    try {
      navigate('/temple/people/onboarding');
    } catch (error) {
      console.error('Error navigating to employee onboarding:', error);
      window.location.href = '/temple/people/onboarding';
    }
  };

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setFormData({
      name: employee.name,
      email: employee.email,
      phone: employee.phone,
      department: employee.department.toLowerCase(),
      designation: employee.designation.toLowerCase().replace(/ /g, '_'),
    });
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    const next = employees.filter(e => e.id !== id);
    setEmployees(next);
    setStoredEmployees(next);
  };

  const handleSubmit = () => {
    if (editingEmployee) {
      const next = employees.map(e =>
        e.id === editingEmployee.id
          ? { ...e, ...formData, department: departmentOptions.find(d => d.value === formData.department)?.label || formData.department, designation: designationOptions.find(d => d.value === formData.designation)?.label || formData.designation }
          : e
      );
      setEmployees(next);
      setStoredEmployees(next);
    } else {
      const newEmployee: Employee = {
        id: String(employees.length + 1),
        employeeId: `EMP-${String(employees.length + 1).padStart(4, '0')}`,
        ...formData,
        department: departmentOptions.find(d => d.value === formData.department)?.label || formData.department,
        designation: designationOptions.find(d => d.value === formData.designation)?.label || formData.designation,
        status: 'active',
        joiningDate: new Date().toISOString().split('T')[0],
      };
      const next = [...employees, newEmployee];
      setEmployees(next);
      setStoredEmployees(next);
    }
    setIsFormOpen(false);
  };

  const handleAddDepartment = (name: string) => {
    const newDept = { value: name.toLowerCase().replace(/ /g, '_'), label: name };
    setDepartmentOptions([...departmentOptions, newDept]);
    return newDept;
  };

  const handleAddDesignation = (name: string) => {
    const newDesg = { value: name.toLowerCase().replace(/ /g, '_'), label: name };
    setDesignationOptions([...designationOptions, newDesg]);
    return newDesg;
  };

  const handleBulkImport = (importedEmployees: Partial<Employee>[]) => {
    const newEmployees: Employee[] = importedEmployees.map((emp, index) => {
      const fName = (emp as any).firstName || "";
      const lName = (emp as any).lastName || "";
      const name = emp.name || `${fName} ${lName}`.trim() || "Imported Employee";
      
      return {
        id: String(Date.now() + index),
        employeeId: (emp as any).employeeCode || `EMP-${String(employees.length + index + 1).padStart(4, "0")}`,
        name,
        email: emp.email || "",
        phone: emp.phone || "",
        department: emp.department || "",
        designation: emp.designation || "",
        status: (emp.status as any) || "active",
        joiningDate: emp.joiningDate || new Date().toISOString().split("T")[0],
        ...emp,
      };
    });

    const next = [...employees, ...newEmployees];
    setEmployees(next);
    setStoredEmployees(next);
  };

  const handleExport = () => {
    const headers = ['Name', 'Email', 'Phone', 'Department', 'Designation', 'Status', 'Join Date'];
    const rows = filteredEmployees.map(emp => [
      emp.name,
      emp.email,
      emp.phone,
      emp.department,
      emp.designation,
      emp.status,
      (emp as any).joinDate || emp.joiningDate,
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `employees-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleBulkStatusUpdate = (status: Employee['status']) => {
    const updated = employees.map(emp =>
      selectedEmployees.has(emp.id) ? { ...emp, status } : emp
    );
    setEmployees(updated);
    setSelectedEmployees(new Set());
  };

  const handleBulkDepartmentTransfer = (department: string) => {
    const updated = employees.map(emp =>
      selectedEmployees.has(emp.id) ? { ...emp, department } : emp
    );
    setEmployees(updated);
    setSelectedEmployees(new Set());
  };

  const clearFilters = () => {
    setFilters({
      departments: [],
      status: [],
      email: '',
      phone: '',
      joinDateFrom: '',
      joinDateTo: '',
    });
  };

  const hasActiveFilters = filters.departments.length > 0 ||
    filters.status.length > 0 ||
    filters.email ||
    filters.phone ||
    filters.joinDateFrom ||
    filters.joinDateTo;

  return (
    <div>
      <PageHeader
        title="Employees"
        description="Manage all employees"
        actions={
          <>
            {!isReadOnly && (
              <>
                <Button variant="outline" size="sm" onClick={() => setIsBulkImportOpen(true)}>
                  <Upload className="h-4 w-4 mr-2" />
                  Import
                </Button>
                <Button variant="outline" size="sm" onClick={handleExport}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button
                  size="sm"
                  onClick={handleAddNew}
                  title={!checkWriteAccess('employees') ? 'You do not have permission to add employees' : 'Add new employee'}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Employee
                </Button>
              </>
            )}
          </>
        }
      />

      {/* Advanced Filters Panel */}
      {showFilters && (
        <div className="mt-4 mb-4 p-4 border rounded-lg bg-card space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label className="text-xs text-muted-foreground mb-2 block">Department</Label>
              <Select
                value={filters.departments[0] || ''}
                onValueChange={(value) => {
                  setFilters({ ...filters, departments: value ? [value] : [] });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Departments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Departments</SelectItem>
                  {[...new Set(employees.map(e => e.department))].map(dept => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs text-muted-foreground mb-2 block">Status</Label>
              <div className="flex flex-wrap gap-2">
                {['active', 'inactive', 'on_leave'].map(status => (
                  <div key={status} className="flex items-center space-x-2">
                    <Checkbox
                      id={`status-${status}`}
                      checked={filters.status.includes(status)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFilters({ ...filters, status: [...filters.status, status] });
                        } else {
                          setFilters({ ...filters, status: filters.status.filter(s => s !== status) });
                        }
                      }}
                    />
                    <Label htmlFor={`status-${status}`} className="text-sm font-normal cursor-pointer capitalize">
                      {status.replace('_', ' ')}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-xs text-muted-foreground mb-2 block">Email (Primary)</Label>
              <Input
                value={filters.email}
                onChange={(e) => setFilters({ ...filters, email: e.target.value })}
                placeholder="Search by email"
              />
            </div>

            <div>
              <Label className="text-xs text-muted-foreground mb-2 block">Phone (Primary)</Label>
              <Input
                value={filters.phone}
                onChange={(e) => setFilters({ ...filters, phone: e.target.value })}
                placeholder="Search by phone"
              />
            </div>

            <div>
              <Label className="text-xs text-muted-foreground mb-2 block">Join Date From</Label>
              <Input
                type="date"
                value={filters.joinDateFrom}
                onChange={(e) => setFilters({ ...filters, joinDateFrom: e.target.value })}
              />
            </div>

            <div>
              <Label className="text-xs text-muted-foreground mb-2 block">Join Date To</Label>
              <Input
                type="date"
                value={filters.joinDateTo}
                onChange={(e) => setFilters({ ...filters, joinDateTo: e.target.value })}
              />
            </div>
          </div>
        </div>
      )}

      {/* Bulk Actions */}
      {selectedEmployees.size > 0 && !isReadOnly && (
        <div className="mb-4 p-3 bg-muted rounded-lg flex items-center justify-between">
          <span className="text-sm text-foreground">
            {selectedEmployees.size} employee(s) selected
          </span>
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  Update Status
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <div className="space-y-2">
                  <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => handleBulkStatusUpdate('active')}>
                    Set Active
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => handleBulkStatusUpdate('inactive')}>
                    Set Inactive
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => handleBulkStatusUpdate('on_leave')}>
                    Set On Leave
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  Transfer Department
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <Select onValueChange={handleBulkDepartmentTransfer}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departmentOptions.map(dept => (
                      <SelectItem key={dept.value} value={dept.label}>
                        {dept.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </PopoverContent>
            </Popover>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export Selected
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setSelectedEmployees(new Set())}>
              Clear Selection
            </Button>
          </div>
        </div>
      )}

      <DataTable
        data={filteredEmployees}
        columns={columns}
        searchPlaceholder="Search employees..."
        selectable={!isReadOnly}
        selectedRows={selectedEmployees}
        onSelectionChange={setSelectedEmployees}
        onRowClick={(row) => {
          setViewingEmployee(row);
          setIsViewOpen(true);
        }}
        toolbarActions={
          <>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4 mr-2" />
                Clear
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              {hasActiveFilters && (
                <span className="mr-2 bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
                  {filters.departments.length + filters.status.length + (filters.email ? 1 : 0) + (filters.phone ? 1 : 0) + (filters.joinDateFrom ? 1 : 0) + (filters.joinDateTo ? 1 : 0)}
                </span>
              )}
              Filters
            </Button>
          </>
        }
        actions={(row) => (
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => {
              e.stopPropagation();
              setViewingEmployee(row);
              setIsViewOpen(true);
            }}>
              <Eye className="h-4 w-4" />
            </Button>
            {!isReadOnly && checkWriteAccess('employees') && (
              <>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => {
                  e.stopPropagation();
                  handleEdit(row);
                }}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(row.id);
                }}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        )}
      />

      {/* Employee Form Modal */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingEmployee ? 'Edit Employee' : 'Add New Employee'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="form-field">
              <Label htmlFor="name" className="form-label">
                Full Name <span className="form-required">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter full name"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="form-field">
                <Label htmlFor="email" className="form-label">
                  Email <span className="form-required">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@temple.org"
                />
              </div>
              <div className="form-field">
                <Label htmlFor="phone" className="form-label">
                  Phone
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>

            <div className="form-field">
              <Label className="form-label">
                Department <span className="form-required">*</span>
              </Label>
              <SearchableSelect
                options={departmentOptions}
                value={formData.department}
                onChange={(value) => setFormData({ ...formData, department: value })}
                placeholder="Select department"
                addNewLabel="+ Add Department"
                onAddNew={handleAddDepartment}
              />
            </div>

            <div className="form-field">
              <Label className="form-label">
                Designation <span className="form-required">*</span>
              </Label>
              <SearchableSelect
                options={designationOptions}
                value={formData.designation}
                onChange={(value) => setFormData({ ...formData, designation: value })}
                placeholder="Select designation"
                addNewLabel="+ Add Designation"
                onAddNew={handleAddDesignation}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFormOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {editingEmployee ? 'Save Changes' : 'Add Employee'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Employee View Details Modal */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Employee Details</DialogTitle>
          </DialogHeader>

          {viewingEmployee && (
            <div className="space-y-6 py-4">
              <div className="flex items-center gap-4 pb-4 border-b">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-muted text-foreground text-lg font-semibold">
                    {viewingEmployee.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{viewingEmployee.name}</h3>
                  <p className="text-sm text-muted-foreground">{viewingEmployee.designation}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Email</Label>
                  <p className="text-sm font-medium text-gray-900">{viewingEmployee.email}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Phone</Label>
                  <p className="text-sm font-medium text-gray-900">{viewingEmployee.phone}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Department</Label>
                  <p className="text-sm font-medium text-gray-900">{viewingEmployee.department}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Designation</Label>
                  <p className="text-sm font-medium text-gray-900">{viewingEmployee.designation}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Join Date</Label>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date((viewingEmployee as any).joinDate || viewingEmployee.joiningDate || new Date()).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Status</Label>
                  <div className="mt-1">
                    <StatusBadge variant={viewingEmployee.status === 'active' ? 'success' : viewingEmployee.status === 'on_leave' ? 'warning' : 'neutral'}>
                      {viewingEmployee.status === 'active' ? 'Active' : viewingEmployee.status === 'on_leave' ? 'On Leave' : 'Inactive'}
                    </StatusBadge>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewOpen(false)}>
              Close
            </Button>
            <Button variant="outline" onClick={() => {
              if (viewingEmployee) {
                navigate(`/hr/employees/${viewingEmployee.id}`);
                setIsViewOpen(false);
              }
            }}>
              <Eye className="h-4 w-4 mr-2" />
              View Full Profile
            </Button>
            <Button onClick={() => {
              if (viewingEmployee) {
                handleEdit(viewingEmployee);
                setIsViewOpen(false);
              }
            }}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Import Dialog */}
      <EmployeeBulkImport
        open={isBulkImportOpen}
        onOpenChange={setIsBulkImportOpen}
        onImport={handleBulkImport}
      />
    </div>
  );
}
