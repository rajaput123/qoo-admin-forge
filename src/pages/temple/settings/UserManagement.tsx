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
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Edit, Trash2, Users, Key, CheckCircle2, XCircle, Search, UserCheck } from "lucide-react";
import { toast } from "sonner";
import { employees as hrEmployees } from "@/data/hr-dummy-data";
import { getEmployees } from "@/lib/hr-employee-store";

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

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([
    {
      id: "USR-001",
      name: "Swami Prasad",
      email: "admin@temple.org",
      role: "Super Admin",
      phone: "+91 877 123 4567",
      loginAccess: true,
      status: "active",
      lastLogin: "2024-01-15 10:30",
      moduleAccess: ["All Modules"],
    },
    {
      id: "USR-002",
      name: "Priest Kumar",
      email: "priest@temple.org",
      role: "Temple Admin",
      phone: "+91 877 123 4568",
      loginAccess: true,
      status: "active",
      lastLogin: "2024-01-15 09:15",
      moduleAccess: ["Donations", "Events", "Inventory"],
    },
    {
      id: "USR-003",
      name: "Finance Manager",
      email: "finance@temple.org",
      role: "Finance Manager",
      phone: "+91 877 123 4569",
      loginAccess: true,
      status: "active",
      lastLogin: "2024-01-14 16:45",
      moduleAccess: ["Finance", "Donations", "Reports"],
    },
  ]);

  const [showAddUser, setShowAddUser] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    loginAccess: true,
    moduleAccess: [] as string[],
  });

  const roles = ["Super Admin", "Temple Admin", "Finance Manager", "Event Manager", "Volunteer Manager", "Inventory Manager"];
  const modules = ["Donations", "Events", "Finance", "Inventory", "Settings", "Crowd Management", "Freelancers", "Reports"];

  // Merge HR dummy data + localStorage employees
  const allEmployees = useMemo(() => {
    const stored = getEmployees();
    const combined = [...hrEmployees];
    stored.forEach(emp => {
      if (!combined.find(e => e.id === emp.id)) combined.push(emp);
    });
    return combined;
  }, [showAddUser]);

  // Filter employees matching search
  const filteredEmployees = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return allEmployees
      .filter(emp =>
        emp.name.toLowerCase().includes(q) ||
        emp.email.toLowerCase().includes(q) ||
        emp.employeeId.toLowerCase().includes(q) ||
        emp.phone.toLowerCase().includes(q)
      )
      .slice(0, 5);
  }, [searchQuery, allEmployees]);

  const handleSelectEmployee = (emp: any) => {
    setSelectedEmployee(emp);

    // Check if this employee already has a user account with a role
    const existingUser = users.find(
      u => u.email.toLowerCase() === emp.email.toLowerCase() || u.name.toLowerCase() === emp.name.toLowerCase()
    );

    setUserForm({
      ...userForm,
      name: emp.name,
      email: emp.email,
      phone: emp.phone,
      role: existingUser?.role || userForm.role,
    });

    if (existingUser) {
      toast.info(`This employee already has a user account with role "${existingUser.role}"`);
    }

    setSearchQuery("");
  };

  const handleClearSelection = () => {
    setSelectedEmployee(null);
    setUserForm({ name: "", email: "", phone: "", role: "", loginAccess: true, moduleAccess: [] });
  };

  const handleAddUser = () => {
    if (!userForm.name || !userForm.email || !userForm.role) {
      toast.error("Please fill required fields");
      return;
    }
    const newUser: User = {
      id: `USR-${String(users.length + 1).padStart(3, "0")}`,
      ...userForm,
      status: "active",
      linkedEmployeeId: selectedEmployee?.id,
    };
    setUsers([...users, newUser]);
    setUserForm({ name: "", email: "", phone: "", role: "", loginAccess: true, moduleAccess: [] });
    setSelectedEmployee(null);
    setSearchQuery("");
    setShowAddUser(false);
    toast.success("User added successfully");
  };

  const handleToggleStatus = (id: string) => {
    setUsers(users.map(user =>
      user.id === id ? { ...user, status: user.status === "active" ? "inactive" : "active" } : user
    ));
    toast.success("User status updated");
  };

  const handleDeleteUser = (id: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter(user => user.id !== id));
      toast.success("User deleted");
    }
  };

  const handleResetPassword = (id: string) => {
    toast.success("Password reset link sent to user's email");
  };

  const handleToggleModuleAccess = (module: string) => {
    if (userForm.moduleAccess.includes(module)) {
      setUserForm({ ...userForm, moduleAccess: userForm.moduleAccess.filter(m => m !== module) });
    } else {
      setUserForm({ ...userForm, moduleAccess: [...userForm.moduleAccess, module] });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">User Management</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage system users, access, and permissions</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="h-4 w-4" /> Users
            </CardTitle>
            <Dialog open={showAddUser} onOpenChange={(open) => {
              setShowAddUser(open);
              if (!open) {
                handleClearSelection();
                setSearchQuery("");
              }
            }}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" /> Add User
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New User</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  {/* Employee Search Section */}
                  <Card className="border-dashed border-primary/40 bg-primary/5">
                    <CardContent className="pt-4 pb-3 space-y-3">
                      <div className="flex items-center gap-2 text-sm font-medium text-primary">
                        <Search className="h-4 w-4" />
                        Search Existing Employee
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Type a name, email, or employee ID to auto-fill from existing employee records.
                      </p>

                      {selectedEmployee ? (
                        <div className="flex items-center gap-3 p-3 rounded-lg border bg-background">
                          <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                            <UserCheck className="h-4 w-4 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{selectedEmployee.name}</p>
                            <p className="text-xs text-muted-foreground truncate">
                              {selectedEmployee.employeeId} · {selectedEmployee.department} · {selectedEmployee.designation}
                            </p>
                          </div>
                          <Button variant="ghost" size="sm" onClick={handleClearSelection} className="text-xs">
                            Clear
                          </Button>
                        </div>
                      ) : (
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by name, email, or employee ID..."
                            className="pl-9"
                          />
                          {filteredEmployees.length > 0 && (
                            <div className="absolute z-50 mt-1 w-full rounded-lg border bg-popover shadow-md max-h-48 overflow-y-auto">
                              {filteredEmployees.map(emp => (
                                <button
                                  key={emp.id}
                                  className="w-full flex items-center gap-3 p-3 hover:bg-accent text-left transition-colors"
                                  onClick={() => handleSelectEmployee(emp)}
                                >
                                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                    <span className="text-xs font-semibold text-primary">
                                      {emp.name.split(" ").map(n => n[0]).join("")}
                                    </span>
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-sm font-medium truncate">{emp.name}</p>
                                    <p className="text-xs text-muted-foreground truncate">
                                      {emp.employeeId} · {emp.email} · {emp.department}
                                    </p>
                                  </div>
                                  <Badge variant="outline" className="ml-auto shrink-0 text-[10px]">
                                    {emp.status}
                                  </Badge>
                                </button>
                              ))}
                            </div>
                          )}
                          {searchQuery.trim() && filteredEmployees.length === 0 && (
                            <div className="absolute z-50 mt-1 w-full rounded-lg border bg-popover shadow-md p-3">
                              <p className="text-sm text-muted-foreground text-center">No matching employees found</p>
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* User Details Form */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label>Name *</Label>
                      <Input
                        value={userForm.name}
                        onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                        placeholder="Enter user name"
                      />
                    </div>
                    <div>
                      <Label>Email *</Label>
                      <Input
                        type="email"
                        value={userForm.email}
                        onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                        placeholder="user@temple.org"
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label>Phone</Label>
                      <Input
                        type="tel"
                        value={userForm.phone}
                        onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
                        placeholder="+91 XXXXX XXXXX"
                      />
                    </div>
                    <div>
                      <Label>Role *</Label>
                      <Select value={userForm.role} onValueChange={(value) => setUserForm({ ...userForm, role: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          {roles.map(role => (
                            <SelectItem key={role} value={role}>{role}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Show linked employee info if selected */}
                  {selectedEmployee && (
                    <div className="grid grid-cols-2 gap-3 p-3 rounded-lg border bg-muted/30">
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Department</p>
                        <p className="text-sm font-medium">{selectedEmployee.department}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Designation</p>
                        <p className="text-sm font-medium">{selectedEmployee.designation}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Employee ID</p>
                        <p className="text-sm font-medium">{selectedEmployee.employeeId}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Joining Date</p>
                        <p className="text-sm font-medium">{selectedEmployee.joiningDate}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <Label>Login Access</Label>
                    <Switch
                      checked={userForm.loginAccess}
                      onCheckedChange={(checked) => setUserForm({ ...userForm, loginAccess: checked })}
                    />
                  </div>
                  <div>
                    <Label>Module Access</Label>
                    <p className="text-xs text-muted-foreground mb-2">Select modules this user can access</p>
                    <div className="grid grid-cols-2 gap-2 p-3 rounded-lg border bg-muted/30 max-h-48 overflow-y-auto">
                      {modules.map(module => (
                        <div key={module} className="flex items-center space-x-2">
                          <Checkbox
                            id={`module-${module}`}
                            checked={userForm.moduleAccess.includes(module)}
                            onCheckedChange={() => handleToggleModuleAccess(module)}
                          />
                          <Label htmlFor={`module-${module}`} className="text-sm font-normal cursor-pointer">
                            {module}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => setShowAddUser(false)}>
                    Cancel
                  </Button>
                  <Button className="flex-1" onClick={handleAddUser}>
                    Add User
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
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
                  <TableCell>
                    <Badge variant="outline">{user.role}</Badge>
                  </TableCell>
                  <TableCell>
                    {user.loginAccess ? (
                      <Badge variant="default" className="gap-1">
                        <CheckCircle2 className="h-3 w-3" /> Enabled
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="gap-1">
                        <XCircle className="h-3 w-3" /> Disabled
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.status === "active" ? "default" : "secondary"}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleResetPassword(user.id)} title="Reset Password">
                        <Key className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleStatus(user.id)}
                      >
                        {user.status === "active" ? "Deactivate" : "Activate"}
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteUser(user.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;
