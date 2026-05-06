import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Download, ArrowUpDown } from "lucide-react";
import { projects, Project, getStatusColor, getPriorityColor } from "@/data/projectData";

const AllProjects = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [filterType, setFilterType] = useState("all");
    const [filterStatus, setFilterStatus] = useState("all");
    const [filterPriority, setFilterPriority] = useState("all");
    const [allProjects, setAllProjects] = useState(projects);

    const allTypes = [...new Set(allProjects.map(p => p.type))];

    const filtered = allProjects.filter(p => {
        if (search && !p.title.toLowerCase().includes(search.toLowerCase()) && !p.manager.toLowerCase().includes(search.toLowerCase())) return false;
        if (filterType !== "all" && p.type !== filterType) return false;
        if (filterStatus !== "all" && p.status !== filterStatus) return false;
        if (filterPriority !== "all" && p.priority !== filterPriority) return false;
        return true;
    });

    const stats = {
        total: allProjects.length,
        active: allProjects.filter(p => p.status === "Active").length,
        draft: allProjects.filter(p => p.status === "Draft").length,
        completed: allProjects.filter(p => p.status === "Completed").length,
    };

    const handleExport = () => {
        const csv = [
            "Project ID,Title,Type,Goal Amount,Raised,Spent,% Complete,Status,Priority,Manager",
            ...filtered.map(p => `${p.id},"${p.title}",${p.type},${p.goalAmount},${p.raisedAmount},${p.spentAmount},${p.completion},${p.status},${p.priority},"${p.manager}"`)
        ].join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `projects-${new Date().toISOString().split("T")[0]}.csv`;
        link.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="p-6 space-y-6">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">All Projects</h1>
                        <p className="text-muted-foreground">Manage temple projects and initiatives</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={handleExport} className="gap-2">
                            <Download className="h-4 w-4" />Export
                        </Button>
                        <Button onClick={() => navigate("/temple/projects/create")} className="gap-2">
                            <Plus className="h-4 w-4" />Create Project
                        </Button>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                    <div className="border rounded-lg p-4">
                        <p className="text-xs text-muted-foreground">Total Projects</p>
                        <p className="text-2xl font-bold mt-1">{stats.total}</p>
                    </div>
                    <div className="border rounded-lg p-4">
                        <p className="text-xs text-muted-foreground">Active</p>
                        <p className="text-2xl font-bold mt-1 text-blue-600">{stats.active}</p>
                    </div>
                    <div className="border rounded-lg p-4">
                        <p className="text-xs text-muted-foreground">Draft</p>
                        <p className="text-2xl font-bold mt-1 text-gray-600">{stats.draft}</p>
                    </div>
                    <div className="border rounded-lg p-4">
                        <p className="text-xs text-muted-foreground">Completed</p>
                        <p className="text-2xl font-bold mt-1 text-green-600">{stats.completed}</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-3 mb-4">
                    <div className="relative flex-1 max-w-xs">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search project, manager..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                    <Select value={filterType} onValueChange={setFilterType}>
                        <SelectTrigger className="w-[160px] bg-background"><SelectValue placeholder="Type" /></SelectTrigger>
                        <SelectContent className="bg-popover">
                            <SelectItem value="all">All Types</SelectItem>
                            {allTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                        <SelectTrigger className="w-[140px] bg-background"><SelectValue placeholder="Status" /></SelectTrigger>
                        <SelectContent className="bg-popover">
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="Draft">Draft</SelectItem>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="On Hold">On Hold</SelectItem>
                            <SelectItem value="Completed">Completed</SelectItem>
                            <SelectItem value="Cancelled">Cancelled</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={filterPriority} onValueChange={setFilterPriority}>
                        <SelectTrigger className="w-[130px] bg-background"><SelectValue placeholder="Priority" /></SelectTrigger>
                        <SelectContent className="bg-popover">
                            <SelectItem value="all">All Priority</SelectItem>
                            <SelectItem value="High">High</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="Low">Low</SelectItem>
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
                                <TableHead>Start Date</TableHead>
                                <TableHead>End Date</TableHead>
                                <TableHead>Priority</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filtered.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center text-muted-foreground py-8">No projects found</TableCell>
                                </TableRow>
                            ) : filtered.map(project => {
                                return (
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
                                        <TableCell className="text-sm">{project.startDate || "—"}</TableCell>
                                        <TableCell className="text-sm">{project.endDate || "—"}</TableCell>
                                        <TableCell>
                                            <span className={`text-sm font-medium ${getPriorityColor(project.priority)}`}>
                                                {project.priority}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={`${getStatusColor(project.status)} border-0 text-xs`}>
                                                {project.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(`/temple/projects/${project.id}`);
                                                }}
                                                className="h-8 text-xs"
                                            >
                                                Add More Details
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
            </motion.div>
        </div>
    );
};

export default AllProjects;
