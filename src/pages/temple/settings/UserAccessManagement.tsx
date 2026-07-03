import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Edit, Trash2, Users, Shield, CheckCircle2, XCircle, Search, UserCheck, Key, Copy, UserPlus, X } from "lucide-react";
import { toast } from "sonner";
import { employees as hrEmployees } from "@/data/hr-dummy-data";
import { getEmployees } from "@/lib/hr-employee-store";
import PermissionMatrixHierarchical, { type RoleFeaturePermissionMap } from "@/components/settings/PermissionMatrixHierarchical";
import { allActions as featureActions } from "@/data/permission-tree";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  phone: string;
  loginAccess: boolean;
  status: "active" | "inactive";
  lastLogin?: string;
  moduleAccess: string[];
  linkedEmployeeId?: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Record<string, {
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
    approve: boolean;
  }>;
  assignedEmployees: string[];
}

const modules = ["Donations", "Events", "Finance", "Inventory", "Settings", "HR & People", "Crowd Management", "Freelancers", "Reports"];
const actions: Array<"view" | "create" | "edit" | "delete" | "approve"> = ["view", "create", "edit", "delete", "approve"];

const UserAccessManagement = () => {
  // Shared state
  const [roles, setRoles] = useState<Role[]>([
    {
      id: "ROLE-001",
      name: "Super Admin",
      description: "Full access to all modules and settings",
      assignedEmployees: ["emp-2"],
      permissions: Object.fromEntries(modules.map(m => [m, { view: true, create: true, edit: true, delete: true, approve: true }])),
    },
    {
      id: "ROLE-002",
      name: "Temple Admin",
      description: "Manage temple operations and daily activities",
      assignedEmployees: ["emp-1"],
      permissions: {
        "Donations": { view: true, create: true, edit: true, delete: false, approve: false },
        "Events": { view: true, create: true, edit: true, delete: true, approve: true },
        "Finance": { view: true, create: false, edit: false, delete: false, approve: false },
        "Inventory": { view: true, create: true, edit: true, delete: false, approve: false },
        "Settings": { view: true, create: false, edit: false, delete: false, approve: false },
        "HR & People": { view: true, create: false, edit: false, delete: false, approve: false },
        "Crowd Management": { view: true, create: true, edit: true, delete: false, approve: false },
        "Freelancers": { view: false, create: false, edit: false, delete: false, approve: false },
        "Reports": { view: true, create: false, edit: false, delete: false, approve: false },
      },
    },
    {
      id: "ROLE-003",
      name: "Finance Manager",
      description: "Manage financial operations and reports",
      assignedEmployees: ["emp-4"],
      permissions: {
        "Donations": { view: true, create: true, edit: true, delete: false, approve: true },
        "Events": { view: true, create: false, edit: false, delete: false, approve: false },
        "Finance": { view: true, create: true, edit: true, delete: true, approve: true },
        "Inventory": { view: true, create: false, edit: false, delete: false, approve: false },
        "Settings": { view: true, create: false, edit: false, delete: false, approve: false },
        "HR & People": { view: false, create: false, edit: false, delete: false, approve: false },
        "Crowd Management": { view: false, create: false, edit: false, delete: false, approve: false },
        "Freelancers": { view: false, create: false, edit: false, delete: false, approve: false },
        "Reports": { view: true, create: true, edit: false, delete: false, approve: false },
      },
    },
  ]);

  const [users, setUsers] = useState<User[]>([
    { id: "USR-001", name: "Swami Prasad", email: "admin@temple.org", role: "Super Admin", phone: "+91 877 123 4567", loginAccess: true, status: "active", lastLogin: "2024-01-15 10:30", moduleAccess: ["All Modules"] },
    { id: "USR-002", name: "Priest Kumar", email: "priest@temple.org", role: "Temple Admin", phone: "+91 877 123 4568", loginAccess: true, status: "active", lastLogin: "2024-01-15 09:15", moduleAccess: ["Donations", "Events", "Inventory"] },
    { id: "USR-003", name: "Finance Manager", email: "finance@temple.org", role: "Finance Manager", phone: "+91 877 123 4569", loginAccess: true, status: "active", lastLogin: "2024-01-14 16:45", moduleAccess: ["Finance", "Donations", "Reports"] },
  ]);

  // User form state
  const [showAddUser, setShowAddUser] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [userForm, setUserForm] = useState({ name: "", email: "", phone: "", role: "", loginAccess: true, moduleAccess: [] as string[] });

  // Role form state
  const [showAddRole, setShowAddRole] = useState(false);
  const [showAssignEmployee, setShowAssignEmployee] = useState<string | null>(null);
  const [assignSearch, setAssignSearch] = useState("");
  const [roleForm, setRoleForm] = useState({ name: "", description: "" });
  const [selectedMatrixRole, setSelectedMatrixRole] = useState<string>(roles[0]?.id || "");

  // Feature-level permission map per role: roleId -> featureId -> action -> bool
  const [featurePermissions, setFeaturePermissions] = useState<Record<string, RoleFeaturePermissionMap>>({});

  const getRoleFeaturePerms = (roleId: string): RoleFeaturePermissionMap => featurePermissions[roleId] || {};

  const handleFeatureChange = (roleId: string, featureId: string, action: string, value: boolean) => {
    setFeaturePermissions(prev => {
      const roleMap = { ...(prev[roleId] || {}) };
      const featMap = { ...(roleMap[featureId] || {}) };
      featMap[action] = value;
      roleMap[featureId] = featMap;
      return { ...prev, [roleId]: roleMap };
    });
  };

  const handleFeatureBulkChange = (roleId: string, featureIds: string[], action: string | "all", value: boolean) => {
    setFeaturePermissions(prev => {
      const roleMap = { ...(prev[roleId] || {}) };
      featureIds.forEach(fid => {
        const featMap = { ...(roleMap[fid] || {}) };
        if (action === "all") {
          featureActions.forEach(a => { featMap[a] = value; });
        } else {
          featMap[action] = value;
        }
        roleMap[fid] = featMap;
      });
      return { ...prev, [roleId]: roleMap };
    });
  };

  // Merge HR employees
  const allEmployees = useMemo(() => {
    const stored = getEmployees();
    const combined = [...hrEmployees];
    stored.forEach(emp => {
      if (!combined.find(e => e.id === emp.id)) combined.push(emp);
    });
    return combined;
  }, [showAddUser, showAssignEmployee]);

  const getEmployee = (id: string) => allEmployees.find(e => e.id === id);
  const getEmployeeRole = (empId: string) => roles.find(r => r.assignedEmployees.includes(empId));

  // Employee search for Add User
  const filteredEmployees = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return allEmployees.filter(emp =>
      emp.name.toLowerCase().includes(q) || emp.email.toLowerCase().includes(q) ||
      emp.employeeId.toLowerCase().includes(q) || emp.phone.toLowerCase().includes(q)
    ).slice(0, 5);
  }, [searchQuery, allEmployees]);

  // Employee search for Assign
  const filteredAssignEmployees = useMemo(() => {
    if (!assignSearch.trim()) return allEmployees.filter(e => e.status === "active");
    const q = assignSearch.toLowerCase();
    return allEmployees.filter(emp =>
      emp.status === "active" && (
        emp.name.toLowerCase().includes(q) || emp.email.toLowerCase().includes(q) ||
        emp.employeeId.toLowerCase().includes(q) || emp.department.toLowerCase().includes(q)
      )
    );
  }, [assignSearch, allEmployees]);

  // ---- User Handlers ----
  const handleSelectEmployee = (emp: any) => {
    setSelectedEmployee(emp);
    const existingUser = users.find(u => u.email.toLowerCase() === emp.email.toLowerCase() || u.name.toLowerCase() === emp.name.toLowerCase());
    setUserForm({ ...userForm, name: emp.name, email: emp.email, phone: emp.phone, role: existingUser?.role || userForm.role });
    if (existingUser) toast.info(`This employee already has a user account with role "${existingUser.role}"`);
    setSearchQuery("");
  };

  const handleClearSelection = () => {
    setSelectedEmployee(null);
    setUserForm({ name: "", email: "", phone: "", role: "", loginAccess: true, moduleAccess: [] });
  };

  const handleAddUser = () => {
    if (!userForm.name || !userForm.email || !userForm.role) { toast.error("Please fill required fields"); return; }
    const newUser: User = { id: `USR-${String(users.length + 1).padStart(3, "0")}`, ...userForm, status: "active", linkedEmployeeId: selectedEmployee?.id };
    setUsers([...users, newUser]);
    setUserForm({ name: "", email: "", phone: "", role: "", loginAccess: true, moduleAccess: [] });
    setSelectedEmployee(null);
    setSearchQuery("");
    setShowAddUser(false);
    toast.success("User added successfully");
  };

  const handleToggleStatus = (id: string) => {
    setUsers(users.map(user => user.id === id ? { ...user, status: user.status === "active" ? "inactive" : "active" } : user));
    toast.success("User status updated");
  };

  const handleDeleteUser = (id: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter(user => user.id !== id));
      toast.success("User deleted");
    }
  };

  const handleToggleModuleAccess = (module: string) => {
    setUserForm(prev => ({
      ...prev,
      moduleAccess: prev.moduleAccess.includes(module) ? prev.moduleAccess.filter(m => m !== module) : [...prev.moduleAccess, module],
    }));
  };

  // ---- Role Handlers ----
  const handleAddRole = () => {
    if (!roleForm.name || !roleForm.description) { toast.error("Please fill required fields"); return; }
    const newRole: Role = {
      id: `ROLE-${String(roles.length + 1).padStart(3, "0")}`,
      ...roleForm,
      permissions: Object.fromEntries(modules.map(m => [m, { view: false, create: false, edit: false, delete: false, approve: false }])),
      assignedEmployees: [],
    };
    setRoles([...roles, newRole]);
    setRoleForm({ name: "", description: "" });
    setShowAddRole(false);
    toast.success("Role created successfully");
  };

  const handleCloneRole = (role: Role) => {
    const cloned: Role = { ...role, id: `ROLE-${String(roles.length + 1).padStart(3, "0")}`, name: `${role.name} (Copy)`, assignedEmployees: [], permissions: JSON.parse(JSON.stringify(role.permissions)) };
    setRoles([...roles, cloned]);
    toast.success("Role cloned successfully");
  };

  const handleTogglePermission = (roleId: string, module: string, action: string) => {
    setRoles(roles.map(role =>
      role.id === roleId
        ? { ...role, permissions: { ...role.permissions, [module]: { ...role.permissions[module], [action]: !role.permissions[module]?.[action as keyof typeof role.permissions[string]] } } }
        : role
    ));
  };

  const handleAssignEmployee = (roleId: string, empId: string) => {
    const updated = roles.map(r => ({ ...r, assignedEmployees: r.assignedEmployees.filter(id => id !== empId) }));
    setRoles(updated.map(r => r.id === roleId ? { ...r, assignedEmployees: [...r.assignedEmployees, empId] } : r));
    toast.success(`${getEmployee(empId)?.name} assigned to this role`);
  };

  const handleRemoveEmployee = (roleId: string, empId: string) => {
    setRoles(roles.map(r => r.id === roleId ? { ...r, assignedEmployees: r.assignedEmployees.filter(id => id !== empId) } : r));
    toast.success(`${getEmployee(empId)?.name} removed from this role`);
  };

  const roleNames = roles.map(r => r.name);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">User & Access Management</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage users, roles, and module permissions in one place</p>
      </div>

      <Tabs defaultValue="roles" className="w-full">
        <TabsList>
          <TabsTrigger value="roles">
            <Shield className="h-4 w-4 mr-2" /> Roles
          </TabsTrigger>
          <TabsTrigger value="users">
            <Users className="h-4 w-4 mr-2" /> Users
          </TabsTrigger>
          <TabsTrigger value="permissions">
            <Key className="h-4 w-4 mr-2" /> Permission Matrix
          </TabsTrigger>
        </TabsList>

        {/* ========== USERS TAB (View Only) ========== */}
        <TabsContent value="users" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-4 w-4" /> Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Login Access</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map(user => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phone}</TableCell>
                      <TableCell><Badge variant="outline">{user.role}</Badge></TableCell>
                      <TableCell>
                        {user.loginAccess ? (
                          <Badge variant="default" className="gap-1"><CheckCircle2 className="h-3 w-3" /> Enabled</Badge>
                        ) : (
                          <Badge variant="secondary" className="gap-1"><XCircle className="h-3 w-3" /> Disabled</Badge>
                        )}
                      </TableCell>
                      <TableCell><Badge variant={user.status === "active" ? "default" : "secondary"}>{user.status}</Badge></TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleToggleStatus(user.id)}>{user.status === "active" ? "Deactivate" : "Activate"}</Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteUser(user.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ========== ROLES TAB ========== */}
        <TabsContent value="roles" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2"><Shield className="h-4 w-4" /> Roles</CardTitle>
                <Dialog open={showAddRole} onOpenChange={setShowAddRole}>
                  <DialogTrigger asChild>
                    <Button size="sm" onClick={() => setRoleForm({ name: "", description: "" })}><Plus className="h-4 w-4 mr-2" /> Create Role</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader><DialogTitle>Create Custom Role</DialogTitle></DialogHeader>
                    <div className="space-y-4 py-4">
                      <div><Label>Role Name *</Label><Input value={roleForm.name} onChange={(e) => setRoleForm({ ...roleForm, name: e.target.value })} placeholder="e.g., Event Manager" /></div>
                      <div><Label>Description *</Label><Input value={roleForm.description} onChange={(e) => setRoleForm({ ...roleForm, description: e.target.value })} placeholder="Describe the role's responsibilities" /></div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1" onClick={() => setShowAddRole(false)}>Cancel</Button>
                      <Button className="flex-1" onClick={handleAddRole}>Create Role</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {roles.map(role => (
                  <div key={role.id} className="p-4 rounded-lg border">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold">{role.name}</h3>
                        <p className="text-xs text-muted-foreground">{role.description}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => { setShowAssignEmployee(role.id); setAssignSearch(""); }}>
                          <UserPlus className="h-4 w-4 mr-1" /> Assign Employee
                        </Button>
                        <Button variant="ghost" size="sm"><Edit className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="sm"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                      </div>
                    </div>
                    {role.assignedEmployees.length > 0 ? (
                      <div className="mt-3 pt-3 border-t">
                        <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1"><Users className="h-3 w-3" /> Assigned Employees ({role.assignedEmployees.length})</p>
                        <div className="flex flex-wrap gap-2">
                          {role.assignedEmployees.map(empId => {
                            const emp = getEmployee(empId);
                            if (!emp) return null;
                            return (
                              <div key={empId} className="flex items-center gap-2 px-3 py-1.5 rounded-lg border bg-muted/30 text-sm">
                                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                  <span className="text-[10px] font-semibold text-primary">{emp.name.split(" ").map(n => n[0]).join("")}</span>
                                </div>
                                <span className="font-medium">{emp.name}</span>
                                <span className="text-muted-foreground text-xs">{emp.department} · {emp.designation}</span>
                                <Button variant="ghost" size="sm" className="h-5 w-5 p-0 hover:bg-destructive/10" onClick={() => handleRemoveEmployee(role.id, empId)}>
                                  <X className="h-3 w-3 text-destructive" />
                                </Button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <div className="mt-3 pt-3 border-t"><p className="text-xs text-muted-foreground italic">No employees assigned to this role</p></div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Assign Employee Dialog */}
          <Dialog open={!!showAssignEmployee} onOpenChange={(open) => { if (!open) setShowAssignEmployee(null); }}>
            <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5" /> Assign Employee to {roles.find(r => r.id === showAssignEmployee)?.name}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-3 py-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input value={assignSearch} onChange={(e) => setAssignSearch(e.target.value)} placeholder="Search by name, email, department..." className="pl-9" />
                </div>
                <div className="space-y-1 max-h-96 overflow-y-auto">
                  {filteredAssignEmployees.map(emp => {
                    const existingRole = getEmployeeRole(emp.id);
                    const isAssignedHere = showAssignEmployee ? roles.find(r => r.id === showAssignEmployee)?.assignedEmployees.includes(emp.id) : false;
                    return (
                      <div key={emp.id} className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${isAssignedHere ? "bg-primary/5 border-primary/30" : "hover:bg-accent"}`}>
                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <span className="text-xs font-semibold text-primary">{emp.name.split(" ").map(n => n[0]).join("")}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{emp.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{emp.employeeId} · {emp.department} · {emp.designation}</p>
                          {existingRole && !isAssignedHere && <p className="text-xs text-amber-600 mt-0.5">Currently assigned: {existingRole.name}</p>}
                        </div>
                        {isAssignedHere ? (
                          <Badge variant="default" className="gap-1 shrink-0"><UserCheck className="h-3 w-3" /> Assigned</Badge>
                        ) : (
                          <Button size="sm" variant="outline" className="shrink-0" onClick={() => showAssignEmployee && handleAssignEmployee(showAssignEmployee, emp.id)}>
                            {existingRole ? "Reassign" : "Assign"}
                          </Button>
                        )}
                      </div>
                    );
                  })}
                  {filteredAssignEmployees.length === 0 && <p className="text-sm text-muted-foreground text-center py-6">No matching employees found</p>}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* ========== PERMISSION MATRIX TAB (Hierarchical) ========== */}
        <TabsContent value="permissions" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <CardTitle className="text-base">Permission Matrix</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Configure access at <span className="font-medium text-foreground">module</span>,{" "}
                    <span className="font-medium text-foreground">sub-module</span>, and{" "}
                    <span className="font-medium text-foreground">feature</span> level. Toggle a parent to apply to all children.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Label className="text-xs text-muted-foreground">Role</Label>
                  <Select value={selectedMatrixRole} onValueChange={setSelectedMatrixRole}>
                    <SelectTrigger className="w-[220px]">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map(role => (
                        <SelectItem key={role.id} value={role.id}>
                          {role.name} ({role.assignedEmployees.length})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {(() => {
                const role = roles.find(r => r.id === selectedMatrixRole);
                if (!role) {
                  return (
                    <p className="text-sm text-muted-foreground text-center py-6">
                      Select a role to configure permissions
                    </p>
                  );
                }
                return (
                  <PermissionMatrixHierarchical
                    permissions={getRoleFeaturePerms(role.id)}
                    onChange={(featureId, action, value) => handleFeatureChange(role.id, featureId, action, value)}
                    onBulkChange={(featureIds, action, value) => handleFeatureBulkChange(role.id, featureIds, action, value)}
                  />
                );
              })()}
            </CardContent>
          </Card>
          <div className="flex justify-end">
            <Button onClick={() => toast.success("Permissions saved successfully")}>Save All Permissions</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserAccessManagement;
