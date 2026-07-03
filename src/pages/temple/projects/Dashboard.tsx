import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FolderKanban, IndianRupee, TrendingUp, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { projects, calculateBudgetVariance } from "@/data/projectData";

const Dashboard = () => {
    const activeProjects = projects.filter(p => p.status === "Active");
    const totalGoal = projects.reduce((sum, p) => sum + p.goalAmount, 0);
    const totalRaised = projects.reduce((sum, p) => sum + p.raisedAmount, 0);
    const totalSpent = projects.reduce((sum, p) => sum + p.spentAmount, 0);
    const avgCompletion = projects.length > 0 ? projects.reduce((sum, p) => sum + p.completion, 0) / projects.length : 0;

    const overBudgetProjects = projects.filter(p => calculateBudgetVariance(p) > 0);

    return (
        <div className="p-6 space-y-6">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold tracking-tight">Projects Dashboard</h1>
                    <p className="text-muted-foreground">Overview of all temple projects and initiatives</p>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <Card className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-muted-foreground">Active Projects</p>
                                <p className="text-2xl font-bold mt-1">{activeProjects.length}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    of {projects.length} total
                                </p>
                            </div>
                            <FolderKanban className="h-8 w-8 text-blue-600" />
                        </div>
                    </Card>

                    <Card className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-muted-foreground">Total Goal</p>
                                <p className="text-2xl font-bold mt-1">₹{(totalGoal / 10000000).toFixed(1)}Cr</p>
                                <p className="text-xs text-green-600 mt-1">
                                    ₹{(totalRaised / 10000000).toFixed(1)}Cr raised
                                </p>
                            </div>
                            <IndianRupee className="h-8 w-8 text-green-600" />
                        </div>
                    </Card>

                    <Card className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-muted-foreground">Total Spent</p>
                                <p className="text-2xl font-bold mt-1">₹{(totalSpent / 10000000).toFixed(1)}Cr</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {((totalSpent / totalGoal) * 100).toFixed(1)}% of goal
                                </p>
                            </div>
                            <TrendingUp className="h-8 w-8 text-amber-600" />
                        </div>
                    </Card>

                    <Card className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-muted-foreground">Avg Completion</p>
                                <p className="text-2xl font-bold mt-1">{avgCompletion.toFixed(0)}%</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    across all projects
                                </p>
                            </div>
                            <Clock className="h-8 w-8 text-purple-600" />
                        </div>
                    </Card>
                </div>

                {/* Over Budget Alert */}
                {overBudgetProjects.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="mb-6 border border-red-200 rounded-lg p-4 bg-red-50"
                    >
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                            <div className="flex-1">
                                <h3 className="text-sm font-semibold text-red-800 mb-1">
                                    Over Budget Alert
                                </h3>
                                <p className="text-sm text-red-700 mb-2">
                                    {overBudgetProjects.length} project(s) have exceeded their budget
                                </p>
                                <div className="space-y-1">
                                    {overBudgetProjects.map(p => (
                                        <div key={p.id} className="text-xs text-red-600">
                                            {p.title} - {calculateBudgetVariance(p).toFixed(1)}% over budget
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Active Projects List */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold">Active Projects</h2>
                    {activeProjects.length === 0 ? (
                        <Card className="p-8 text-center">
                            <p className="text-muted-foreground">No active projects</p>
                        </Card>
                    ) : (
                        <div className="grid gap-4">
                            {activeProjects.map(project => {
                                const variance = calculateBudgetVariance(project);
                                const fundingProgress = (project.raisedAmount / project.goalAmount) * 100;

                                return (
                                    <motion.div
                                        key={project.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                    >
                                        <Card className="p-5 hover:shadow-md transition-shadow cursor-pointer">
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h3 className="font-semibold">{project.title}</h3>
                                                        <Badge variant="outline" className={project.priority === "High" ? "text-red-600 border-red-300" : project.priority === "Medium" ? "text-amber-600 border-amber-300" : "text-green-600 border-green-300"}>
                                                            {project.priority}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground">{project.type} • {project.manager}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-lg font-bold">₹{(project.raisedAmount / 100000).toFixed(1)}L</p>
                                                    <p className="text-xs text-muted-foreground">of ₹{(project.goalAmount / 100000).toFixed(1)}L</p>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                {/* Progress Bar */}
                                                <div>
                                                    <div className="flex items-center justify-between text-xs mb-1">
                                                        <span className="text-muted-foreground">Completion</span>
                                                        <span className="font-medium">{project.completion}%</span>
                                                    </div>
                                                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-gradient-to-r from-amber-600 to-amber-800 transition-all"
                                                            style={{ width: `${project.completion}%` }}
                                                        />
                                                    </div>
                                                </div>

                                                {/* Funding Progress */}
                                                <div>
                                                    <div className="flex items-center justify-between text-xs mb-1">
                                                        <span className="text-muted-foreground">Funding</span>
                                                        <span className="font-medium">{fundingProgress.toFixed(0)}%</span>
                                                    </div>
                                                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-green-600 transition-all"
                                                            style={{ width: `${Math.min(fundingProgress, 100)}%` }}
                                                        />
                                                    </div>
                                                </div>

                                                {/* Stats Row */}
                                                <div className="flex items-center gap-4 pt-2 text-xs">
                                                    <div className="flex items-center gap-1">
                                                        <CheckCircle className="h-3.5 w-3.5 text-green-600" />
                                                        <span>{project.milestones.filter(m => m.status === "Completed").length}/{project.milestones.length} Milestones</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <IndianRupee className="h-3.5 w-3.5 text-amber-600" />
                                                        <span>₹{(project.spentAmount / 100000).toFixed(1)}L Spent</span>
                                                        {variance > 0 && (
                                                            <span className="text-red-600 font-medium">({variance.toFixed(0)}% over)</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default Dashboard;
