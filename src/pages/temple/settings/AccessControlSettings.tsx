
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ShieldCheck, Plus, Users, Mail, UserPlus, Trash2, Edit } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Permission = 'view' | 'create' | 'update' | 'delete' | 'approve' | 'export';

interface Module {
    id: string;
    name: string;
    permissions: Permission[];
}

interface Role {
    id: string;
    name: string;
    description: string;
    color: string;
}

interface User {
    id: string;
    name: string;
    email: string;
    roleId: string;
    status: 'active' | 'pending';
}

const MODULES: Module[] = [
    { id: 'temple', name: 'Temple Structure', permissions: ['view', 'create', 'update', 'delete'] },
    { id: 'offerings', name: 'Offerings', permissions: ['view', 'create', 'update', 'delete', 'approve'] },
    { id: 'booking', name: 'Booking Management', permissions: ['view', 'create', 'update', 'delete', 'export'] },
    { id: 'donation', name: 'Donation', permissions: ['view', 'create', 'update', 'delete', 'approve', 'export'] },
    { id: 'finance', name: 'Finance', permissions: ['view', 'create', 'update', 'delete', 'approve', 'export'] },
    { id: 'task', name: 'Task Management', permissions: ['view', 'create', 'update', 'delete'] },
    { id: 'inventory', name: 'Inventory', permissions: ['view', 'create', 'update', 'delete', 'approve', 'export'] },
    { id: 'event', name: 'Event Management', permissions: ['view', 'create', 'update', 'delete', 'approve'] },
    { id: 'asset', name: 'Asset Management', permissions: ['view', 'create', 'update', 'delete', 'export'] },
    { id: 'projects', name: 'Projects', permissions: ['view', 'create', 'update', 'delete', 'approve'] },
    { id: 'reports', name: 'Reports', permissions: ['view', 'export'] },
    { id: 'settings', name: 'Settings', permissions: ['view', 'update'] },
];

const INITIAL_SYSTEM_ROLES: Role[] = [
    { id: 'owner', name: 'Owner', description: 'Full system access', color: 'bg-purple-500' },
    { id: 'admin', name: 'Admin', description: 'Administrative privileges', color: 'bg-blue-500' },
    { id: 'operations', name: 'Operations', description: 'Day-to-day operations', color: 'bg-green-500' },
    { id: 'finance', name: 'Finance', description: 'Financial management', color: 'bg-amber-500' },
    { id: 'viewer', name: 'Viewer', description: 'Read-only access', color: 'bg-gray-500' },
];

const COLOR_OPTIONS = [
    { value: 'bg-purple-500', label: 'Purple' },
    { value: 'bg-blue-500', label: 'Blue' },
    { value: 'bg-green-500', label: 'Green' },
    { value: 'bg-amber-500', label: 'Amber' },
    { value: 'bg-red-500', label: 'Red' },
    { value: 'bg-pink-500', label: 'Pink' },
    { value: 'bg-cyan-500', label: 'Cyan' },
    { value: 'bg-gray-500', label: 'Gray' },
];

const PERMISSION_LABELS: Record<Permission, string> = {
    view: 'View',
    create: 'Create',
    update: 'Update',
    delete: 'Delete',
    approve: 'Approve',
    export: 'Export',
};

const AccessControlSettings = () => {
    const [roles, setRoles] = useState<Role[]>(INITIAL_SYSTEM_ROLES);
    const [selectedRole, setSelectedRole] = useState<string>('owner');
    const [permissions, setPermissions] = useState<Record<string, Record<string, Record<string, boolean>>>>({
        owner: Object.fromEntries(MODULES.map(m => [m.id, Object.fromEntries(m.permissions.map(p => [p, true]))])),
        admin: Object.fromEntries(MODULES.map(m => [m.id, Object.fromEntries(m.permissions.map(p => [p, p !== 'delete']))])),
        operations: Object.fromEntries(MODULES.map(m => [m.id, Object.fromEntries(m.permissions.map(p => [p, ['view', 'create', 'update'].includes(p)]))])),
        finance: Object.fromEntries(MODULES.map(m => [m.id, Object.fromEntries(m.permissions.map(p => [p, m.id === 'finance' ? true : p === 'view']))])),
        viewer: Object.fromEntries(MODULES.map(m => [m.id, Object.fromEntries(m.permissions.map(p => [p, p === 'view']))])),
    });

    // User management state
    const [users, setUsers] = useState<User[]>([
        { id: '1', name: 'Admin User', email: 'admin@temple.com', roleId: 'owner', status: 'active' },
        { id: '2', name: 'Finance Manager', email: 'finance@temple.com', roleId: 'finance', status: 'active' },
        { id: '3', name: 'Operations Staff', email: 'ops@temple.com', roleId: 'operations', status: 'active' },
    ]);

    // Create Role Dialog state
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [newRoleName, setNewRoleName] = useState('');
    const [newRoleDescription, setNewRoleDescription] = useState('');
    const [newRoleColor, setNewRoleColor] = useState('bg-blue-500');

    // Invite User Dialog state
    const [showInviteDialog, setShowInviteDialog] = useState(false);
    const [newUserName, setNewUserName] = useState('');
    const [newUserEmail, setNewUserEmail] = useState('');
    const [newUserRole, setNewUserRole] = useState('viewer');

    const togglePermission = (moduleId: string, permission: Permission) => {
        setPermissions(prev => ({
            ...prev,
            [selectedRole]: {
                ...prev[selectedRole],
                [moduleId]: {
                    ...prev[selectedRole][moduleId],
                    [permission]: !prev[selectedRole][moduleId][permission],
                },
            },
        }));
    };

    const handleCreateRole = () => {
        if (!newRoleName.trim()) {
            toast.error('Please enter a role name');
            return;
        }

        const roleId = newRoleName.toLowerCase().replace(/\s+/g, '-');

        if (roles.find(r => r.id === roleId)) {
            toast.error('A role with this name already exists');
            return;
        }

        const newRole: Role = {
            id: roleId,
            name: newRoleName,
            description: newRoleDescription || 'Custom role',
            color: newRoleColor,
        };

        // Initialize permissions for new role (default: view only)
        const newPermissions = Object.fromEntries(
            MODULES.map(m => [m.id, Object.fromEntries(m.permissions.map(p => [p, p === 'view']))])
        );

        setRoles(prev => [...prev, newRole]);
        setPermissions(prev => ({ ...prev, [roleId]: newPermissions }));
        setSelectedRole(roleId);

        // Reset form
        setNewRoleName('');
        setNewRoleDescription('');
        setNewRoleColor('bg-blue-500');
        setShowCreateDialog(false);

        toast.success(`Role "${newRoleName}" created successfully`);
    };

    const handleInviteUser = () => {
        if (!newUserName.trim() || !newUserEmail.trim()) {
            toast.error('Please enter name and email');
            return;
        }

        const newUser: User = {
            id: Date.now().toString(),
            name: newUserName,
            email: newUserEmail,
            roleId: newUserRole,
            status: 'pending',
        };

        setUsers(prev => [...prev, newUser]);

        // Reset form
        setNewUserName('');
        setNewUserEmail('');
        setNewUserRole('viewer');
        setShowInviteDialog(false);

        toast.success(`Invitation sent to ${newUserEmail}`);
    };

    const handleRemoveUser = (userId: string) => {
        setUsers(prev => prev.filter(u => u.id !== userId));
        toast.success('User removed');
    };

    const selectedRoleData = roles.find(r => r.id === selectedRole);

    return (
        <div className="space-y-6 pb-24">
            <div>
                <h2 className="text-2xl font-bold tracking-tight text-primary">Access Control</h2>
                <p className="text-muted-foreground">Manage roles, users, and module permissions at enterprise scale.</p>
            </div>

            <Tabs defaultValue="roles" className="w-full">
                <TabsList className="bg-primary/5 p-1 rounded-lg w-full justify-start h-auto">
                    <TabsTrigger
                        value="roles"
                        className="data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm px-6 py-2"
                    >
                        <ShieldCheck className="mr-2 h-4 w-4" /> Roles Management
                    </TabsTrigger>
                    <TabsTrigger
                        value="users"
                        className="data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm px-6 py-2"
                    >
                        <Users className="mr-2 h-4 w-4" /> User Management
                    </TabsTrigger>
                    <TabsTrigger
                        value="permissions"
                        className="data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm px-6 py-2"
                    >
                        <ShieldCheck className="mr-2 h-4 w-4" /> Permissions Matrix
                    </TabsTrigger>
                </TabsList>

                {/* Tab 1: Roles Management */}
                <TabsContent value="roles" className="mt-6">
                    <Card className="border-primary/20 shadow-sm">
                        <CardHeader className="border-b">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-lg text-primary">System Roles</CardTitle>
                                    <CardDescription className="mt-1">Create and manage role definitions</CardDescription>
                                </div>
                                <Button className="bg-primary hover:bg-primary/90 text-white" onClick={() => setShowCreateDialog(true)}>
                                    <Plus className="mr-2 h-4 w-4" /> Create New Role
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Role Name</TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead>Color</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {roles.map(role => (
                                        <TableRow key={role.id} className="cursor-pointer hover:bg-muted/30">
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-2">
                                                    <div className={cn("w-3 h-3 rounded-full", role.color)} />
                                                    {role.name}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">{role.description}</TableCell>
                                            <TableCell>
                                                <div className={cn("w-8 h-8 rounded-md shadow-sm", role.color)} />
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-primary hover:text-primary/80 hover:bg-primary/10"
                                                >
                                                    <Edit className="h-3 w-3" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Tab 2: User Management */}
                <TabsContent value="users" className="mt-6">
                    <Card className="border-primary/20 shadow-sm">
                        <CardHeader className="border-b">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-lg text-primary">User Management</CardTitle>
                                    <CardDescription className="mt-1">Manage users and assign roles</CardDescription>
                                </div>
                                <Button className="bg-primary hover:bg-primary/90 text-white" onClick={() => setShowInviteDialog(true)}>
                                    <Mail className="mr-2 h-4 w-4" /> Invite User
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.map(user => {
                                        const userRole = roles.find(r => r.id === user.roleId);
                                        return (
                                            <TableRow key={user.id}>
                                                <TableCell className="font-medium">{user.name}</TableCell>
                                                <TableCell className="text-muted-foreground">{user.email}</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <div className={cn("w-2 h-2 rounded-full", userRole?.color || 'bg-gray-500')} />
                                                        <span>{userRole?.name || 'Unknown'}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={user.status === 'active' ? 'default' : 'secondary'} className={user.status === 'active' ? 'bg-green-500' : ''}>
                                                        {user.status === 'active' ? 'Active' : 'Pending'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleRemoveUser(user.id)}
                                                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                    >
                                                        <Trash2 className="h-3 w-3" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Tab 3: Permissions Matrix */}
                <TabsContent value="permissions" className="mt-6">
                    <Card className="border-primary/20 shadow-sm">
                        <CardHeader className="border-b">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-lg text-primary">Permission Matrix</CardTitle>
                                    <CardDescription className="mt-1">Configure module permissions for each role</CardDescription>
                                </div>
                                <Select value={selectedRole} onValueChange={setSelectedRole}>
                                    <SelectTrigger className="w-[250px] border-primary/20 focus:ring-primary">
                                        <SelectValue placeholder="Select a role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {roles.map(role => (
                                            <SelectItem key={role.id} value={role.id}>
                                                <div className="flex items-center gap-2">
                                                    <div className={cn("w-2 h-2 rounded-full", role.color)} />
                                                    <span>{role.name}</span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <ScrollArea className="h-[600px]">
                                <div className="p-6">
                                    <div className="space-y-6">
                                        {MODULES.map(module => (
                                            <div key={module.id} className="border-b border-border pb-6 last:border-0">
                                                <h4 className="font-semibold text-base mb-4 text-foreground">{module.name}</h4>
                                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
                                                    {module.permissions.map(permission => (
                                                        <div key={permission} className="flex items-center space-x-3">
                                                            <Checkbox
                                                                id={`${module.id}-${permission}`}
                                                                checked={permissions[selectedRole]?.[module.id]?.[permission] || false}
                                                                onCheckedChange={() => togglePermission(module.id, permission)}
                                                                className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                                            />
                                                            <label
                                                                htmlFor={`${module.id}-${permission}`}
                                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                                            >
                                                                {PERMISSION_LABELS[permission]}
                                                            </label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <div className="fixed bottom-6 right-6 z-50">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white shadow-xl rounded-full px-8 h-12 text-base">
                    Save Changes
                </Button>
            </div>

            {/* Create Role Dialog */}
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogContent className="bg-background max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-primary">Create New Role</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="roleName">Role Name *</Label>
                            <Input
                                id="roleName"
                                placeholder="e.g., Event Coordinator"
                                value={newRoleName}
                                onChange={(e) => setNewRoleName(e.target.value)}
                                className="border-primary/20 focus-visible:ring-primary"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="roleDescription">Description</Label>
                            <Input
                                id="roleDescription"
                                placeholder="Brief description of the role"
                                value={newRoleDescription}
                                onChange={(e) => setNewRoleDescription(e.target.value)}
                                className="border-primary/20 focus-visible:ring-primary"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>Role Color</Label>
                            <Select value={newRoleColor} onValueChange={setNewRoleColor}>
                                <SelectTrigger className="border-primary/20 focus:ring-primary">
                                    <div className="flex items-center gap-2">
                                        <div className={cn("w-3 h-3 rounded-full", newRoleColor)} />
                                        <SelectValue />
                                    </div>
                                </SelectTrigger>
                                <SelectContent>
                                    {COLOR_OPTIONS.map(option => (
                                        <SelectItem key={option.value} value={option.value}>
                                            <div className="flex items-center gap-2">
                                                <div className={cn("w-3 h-3 rounded-full", option.value)} />
                                                <span>{option.label}</span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg">
                            New roles will be created with view-only permissions by default. You can modify permissions after creation.
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowCreateDialog(false)}>Cancel</Button>
                        <Button onClick={handleCreateRole} className="bg-primary hover:bg-primary/90">Create Role</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Invite User Dialog */}
            <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
                <DialogContent className="bg-background max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-primary">Invite User</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="userName">Full Name *</Label>
                            <Input
                                id="userName"
                                placeholder="e.g., John Doe"
                                value={newUserName}
                                onChange={(e) => setNewUserName(e.target.value)}
                                className="border-primary/20 focus-visible:ring-primary"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="userEmail">Email Address *</Label>
                            <Input
                                id="userEmail"
                                type="email"
                                placeholder="user@example.com"
                                value={newUserEmail}
                                onChange={(e) => setNewUserEmail(e.target.value)}
                                className="border-primary/20 focus-visible:ring-primary"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>Assign Role</Label>
                            <Select value={newUserRole} onValueChange={setNewUserRole}>
                                <SelectTrigger className="border-primary/20 focus:ring-primary">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {roles.map(role => (
                                        <SelectItem key={role.id} value={role.id}>
                                            <div className="flex items-center gap-2">
                                                <div className={cn("w-2 h-2 rounded-full", role.color)} />
                                                <span>{role.name}</span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg">
                            An invitation email will be sent to the user with instructions to set up their account.
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowInviteDialog(false)}>Cancel</Button>
                        <Button onClick={handleInviteUser} className="bg-primary hover:bg-primary/90">Send Invitation</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AccessControlSettings;
