import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, ArchiveRestore, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { projects, getStatusColor } from "@/data/projectData";

const Archive = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [filterType, setFilterType] = useState("all");

    // Filter for archived and completed projects
    const archivedProjects = projects.filter(p => p.status === "Archived" || p.status === "Completed" || p.status === "Cancelled");

    const filtered = archivedProjects.filter(p => {
        if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false;
        if (filterType !== "all" && p.type !== filterType) return false;
        return true;
    });

    const handleRestore = (projectId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        toast.success("Project restored to Active status");
    };

    const handleDelete = (projectId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm("Are you sure you want to permanently delete this project? This action cannot be undone.")) {
            toast.success("Project permanently deleted");
        }
    };

    return (
        <div className="p-6 space-y-6">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold tracking-tight">Project Archive</h1>
                    <p className="text-muted-foreground">View archived, completed, and cancelled projects</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="border rounded-lg p-4">
                        <p className="text-xs text-muted-foreground">Completed</p>
                        <p className="text-2xl font-bold mt-1 text-green-600">
                            {archivedProjects.filter(p => p.status === "Completed").length}
                        </p>
                    </div>
                    <div className="border rounded-lg p-4">
                        <p className="text-xs text-muted-foreground">Archived</p>
                        <p className="text-2xl font-bold mt-1 text-slate-600">
                            {archivedProjects.filter(p => p.status === "Archived").length}
                        </p>
                    </div>
                    <div className="border rounded-lg p-4">
                        <p className="text-xs text-muted-foreground">Cancelled</p>
                        <p className="text-2xl font-bold mt-1 text-red-600">
                            {archivedProjects.filter(p => p.status === "Cancelled").length}
                        </p>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex items-center gap-3 mb-4">
                    <div className="relative flex-1 max-w-xs">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search projects..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                    <Select value={filterType} onValueChange={setFilterType}>
                        <SelectTrigger className="w-[160px] bg-background"><SelectValue placeholder="Type" /></SelectTrigger>
                        <SelectContent className="bg-popover">
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="Construction">Construction</SelectItem>
                            <SelectItem value="Renovation">Renovation</SelectItem>
                            <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                        </SelectContent>
                    </Select>
                    <Badge variant="secondary" className="ml-auto">{filtered.length} projects</Badge>
                </div>

                {/* Table */}
                <div className="border rounded-lg overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">ID</TableHead>
                                <TableHead>Project Name</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead className="text-right">Final Amount</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Completed On</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filtered.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                                        No archived projects found
                                    </TableCell>
                                </TableRow>
                            ) : filtered.map(project => (
                                <TableRow
                                    key={project.id}
                                    className="cursor-pointer hover:bg-muted/50"
                                    onClick={() => navigate(`/temple/projects/${project.id}`)}
                                >
                                    <TableCell className="font-medium text-primary">{project.id}</TableCell>
                                    <TableCell>
                                        <div>
                                            <div className="font-medium">{project.title}</div>
                                            <div className="text-xs text-muted-foreground">{project.manager}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-sm">{project.type}</TableCell>
                                    <TableCell className="text-right font-medium">
                                        ₹{(project.raisedAmount / 100000).toFixed(1)}L
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={`${getStatusColor(project.status)} border-0 text-xs`}>
                                            {project.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-sm">{project.endDate}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={(e) => handleRestore(project.id, e)}
                                                className="h-8 text-xs gap-1"
                                            >
                                                <ArchiveRestore className="h-3 w-3" />
                                                Restore
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={(e) => handleDelete(project.id, e)}
                                                className="h-8 text-xs gap-1 text-red-600 hover:text-red-700"
                                            >
                                                <Trash2 className="h-3 w-3" />
                                                Delete
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </motion.div>
        </div>
    );
};

export default Archive;
