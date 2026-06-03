import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, CheckCircle, Clock, AlertCircle, TrendingUp, IndianRupee } from "lucide-react";
import { projects } from "@/data/projectData";

const Timeline = () => {
    const [filterProject, setFilterProject] = useState("all");
    const [filterType, setFilterType] = useState("all");

    // Collect all milestones from all projects
    const allMilestones = projects
        .filter(p => filterProject === "all" || p.id === filterProject)
        .flatMap(project =>
            project.milestones.map(milestone => ({
                ...milestone,
                projectId: project.id,
                projectTitle: project.title,
                projectType: project.type,
                projectStatus: project.status,
            }))
        )
        .sort((a, b) => new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime());

    const filtered = allMilestones.filter(m => {
        if (filterType === "all") return true;
        return m.status === filterType;
    });

    const stats = {
        total: allMilestones.length,
        completed: allMilestones.filter(m => m.status === "Completed").length,
        inProgress: allMilestones.filter(m => m.status === "In Progress").length,
        pending: allMilestones.filter(m => m.status === "Pending").length,
        delayed: allMilestones.filter(m => m.status === "Delayed").length,
    };

    return (
        <div className="p-6 space-y-6">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-amber-700 to-amber-900 bg-clip-text text-transparent">
                        Project Timeline
                    </h1>
                    <p className="text-muted-foreground mt-1">View all project milestones in chronological order</p>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-5 gap-4 mb-6">
                    <Card className="p-4 border-0">
                        <p className="text-xs text-muted-foreground">Total Milestones</p>
                        <p className="text-2xl font-bold mt-1">{stats.total}</p>
                    </Card>
                    <Card className="p-4 border-0">
                        <p className="text-xs text-muted-foreground">Completed</p>
                        <p className="text-2xl font-bold text-green-600 mt-1">{stats.completed}</p>
                    </Card>
                    <Card className="p-4 border-0">
                        <p className="text-xs text-muted-foreground">In Progress</p>
                        <p className="text-2xl font-bold text-blue-600 mt-1">{stats.inProgress}</p>
                    </Card>
                    <Card className="p-4 border-0">
                        <p className="text-xs text-muted-foreground">Pending</p>
                        <p className="text-2xl font-bold text-gray-600 mt-1">{stats.pending}</p>
                    </Card>
                    <Card className="p-4 border-0">
                        <p className="text-xs text-muted-foreground">Delayed</p>
                        <p className="text-2xl font-bold text-red-600 mt-1">{stats.delayed}</p>
                    </Card>
                </div>

                {/* Filters */}
                <div className="flex items-center gap-3 mb-6">
                    <Select value={filterProject} onValueChange={setFilterProject}>
                        <SelectTrigger className="w-[250px] bg-background">
                            <SelectValue placeholder="Select Project" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover">
                            <SelectItem value="all">All Projects</SelectItem>
                            {projects.map(p => (
                                <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select value={filterType} onValueChange={setFilterType}>
                        <SelectTrigger className="w-[160px] bg-background">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover">
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="Completed">Completed</SelectItem>
                            <SelectItem value="In Progress">In Progress</SelectItem>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="Delayed">Delayed</SelectItem>
                        </SelectContent>
                    </Select>
                    <Badge variant="secondary" className="ml-auto">{filtered.length} milestones</Badge>
                </div>

                {/* Timeline */}
                <div className="space-y-6">
                    {filtered.length === 0 ? (
                        <div className="text-center text-muted-foreground py-20 border rounded-lg">
                            <Clock className="h-12 w-12 mx-auto mb-3 opacity-30" />
                            <p className="font-medium">No milestones found</p>
                            <p className="text-sm mt-1">Try adjusting your filters</p>
                        </div>
                    ) : (
                        filtered.map((milestone, index) => {
                            const isOverdue = new Date(milestone.targetDate) < new Date() && milestone.status !== "Completed";

                            return (
                                <motion.div
                                    key={`${milestone.projectId}-${milestone.id}`}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="relative"
                                >
                                    {/* Timeline connector */}
                                    {index !== filtered.length - 1 && (
                                        <div className="absolute left-6 top-14 bottom-0 w-0.5 bg-gradient-to-b from-border to-transparent" />
                                    )}

                                    <div className="flex gap-5">
                                        {/* Icon */}
                                        <div className={`flex-shrink-0 mt-1.5 p-3 rounded-full shadow-sm ${milestone.status === "Completed" ? "bg-green-100" :
                                                milestone.status === "In Progress" ? "bg-blue-100" :
                                                    milestone.status === "Delayed" ? "bg-red-100" :
                                                        "bg-gray-100"
                                            }`}>
                                            {milestone.status === "Completed" && <CheckCircle className="h-5 w-5 text-green-600" />}
                                            {milestone.status === "In Progress" && <TrendingUp className="h-5 w-5 text-blue-600" />}
                                            {milestone.status === "Delayed" && <AlertCircle className="h-5 w-5 text-red-600" />}
                                            {milestone.status === "Pending" && <Clock className="h-5 w-5 text-gray-600" />}
                                        </div>

                                        {/* Content Card */}
                                        <Card className="flex-1 p-5 border-0 shadow-sm hover:shadow-md transition-shadow">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <h3 className="font-semibold text-base">{milestone.title}</h3>
                                                        <Badge className={
                                                            milestone.status === "Completed" ? "bg-green-100 text-green-700 border-0" :
                                                                milestone.status === "In Progress" ? "bg-blue-100 text-blue-700 border-0" :
                                                                    milestone.status === "Delayed" ? "bg-red-100 text-red-700 border-0" :
                                                                        "bg-gray-100 text-gray-700 border-0"
                                                        }>
                                                            {milestone.status}
                                                        </Badge>
                                                        {isOverdue && <Badge className="bg-red-100 text-red-700 border-0">Overdue</Badge>}
                                                    </div>
                                                    <p className="text-sm text-muted-foreground mb-3">{milestone.description}</p>
                                                    <div className="flex items-center gap-2 text-xs">
                                                        <Badge variant="outline" className="font-medium">
                                                            {milestone.projectTitle}
                                                        </Badge>
                                                        <span className="text-muted-foreground">•</span>
                                                        <span className="text-muted-foreground">{milestone.projectType}</span>
                                                    </div>
                                                </div>

                                                {/* Right side info */}
                                                <div className="text-right flex-shrink-0">
                                                    <div className="flex items-center justify-end gap-1.5 text-sm text-muted-foreground mb-2">
                                                        <Calendar className="h-4 w-4" />
                                                        <span>{milestone.targetDate}</span>
                                                    </div>
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        <IndianRupee className="h-4 w-4 text-amber-700" />
                                                        <span className="text-sm font-semibold text-amber-700">
                                                            ₹{(milestone.estimatedCost / 100000).toFixed(1)}L
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    </div>
                                </motion.div>
                            );
                        })
                    )}
                </div>

                {/* Legend */}
                {filtered.length > 0 && (
                    <div className="flex items-center justify-center gap-8 text-xs text-muted-foreground pt-4">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-green-100" />
                            <span>Completed</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-blue-100" />
                            <span>In Progress</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-gray-100" />
                            <span>Pending</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-100" />
                            <span>Delayed</span>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default Timeline;
