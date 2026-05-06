import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import {
    ArrowLeft, Edit, Archive, Trash2, Plus, Calendar,
    IndianRupee, TrendingUp, FileText, Users, Activity,
    CheckCircle, Clock, X, ImageIcon, MapPin
} from "lucide-react";
import { toast } from "sonner";
import { projects, Project, getStatusColor, getPriorityColor } from "@/data/projectData";
import CustomFieldsSection from "@/components/CustomFieldsSection";
import { format } from "date-fns";

// --- Progress Update type ---
interface ProgressUpdate {
    id: string;
    title: string;
    note?: string;
    date?: string;
    spentLakhs?: number;
    images: string[];
}

const ProjectDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const project = projects.find(p => p.id === id);

    const [activeTab, setActiveTab] = useState("overview");
    const [showMilestoneDialog, setShowMilestoneDialog] = useState(false);
    const [showExpenseDialog, setShowExpenseDialog] = useState(false);
    const [showDonationDialog, setShowDonationDialog] = useState(false);
    const [showUpdateDialog, setShowUpdateDialog] = useState(false);

    // Progress updates state
    const [progressUpdates, setProgressUpdates] = useState<ProgressUpdate[]>([]);
    const [updateDate, setUpdateDate] = useState(new Date().toISOString().split("T")[0]);
    const [updateTitle, setUpdateTitle] = useState("");
    const [updateSpent, setUpdateSpent] = useState("");
    const [updateNotes, setUpdateNotes] = useState("");
    const [updatePhotos, setUpdatePhotos] = useState<File[]>([]);
    const [updatePhotoPreviews, setUpdatePhotoPreviews] = useState<string[]>([]);

    if (!project) {
        return (
            <div className="p-6">
                <div className="text-center py-20">
                    <h2 className="text-xl font-semibold mb-2">Project Not Found</h2>
                    <Button onClick={() => navigate("/temple/projects/all")} variant="outline">
                        Back to Projects
                    </Button>
                </div>
            </div>
        );
    }

    const fundingProgress = (project.raisedAmount / project.goalAmount) * 100;
    const remainingBudget = project.goalAmount - project.spentAmount;
    const budgetVariance = ((project.spentAmount - project.goalAmount) / project.goalAmount) * 100;

    // Derive effective status
    const getEffectiveStatus = () => {
        if (project.status === "Cancelled") return "Cancelled";
        if (project.status === "Archived") return "Archived";
        if (project.endDate && new Date(project.endDate) < new Date()) return "Completed";
        if (project.status === "Active") return "Active";
        return project.status;
    };
    const effectiveStatus = getEffectiveStatus();

    // Format date as DD/MM/YYYY
    const formatDate = (dateStr: string) => {
        try {
            return format(new Date(dateStr), "dd/MM/yyyy");
        } catch {
            return dateStr;
        }
    };

    // Virtual entry for progress updates when none exist
    const getDisplayUpdates = (): ProgressUpdate[] => {
        if (progressUpdates.length > 0) return progressUpdates;
        const fallbackDate = project.startDate || project.endDate || "";
        return [{
            id: "virtual",
            title: project.title,
            note: project.description,
            date: fallbackDate,
            spentLakhs: project.spentAmount / 100000,
            images: [],
        }];
    };

    // Add Update validation & save
    const handleSaveUpdate = () => {
        if (!updateDate) {
            toast.error("Date is required");
            return;
        }
        const startD = project.startDate ? new Date(project.startDate) : new Date();
        const today = new Date();
        const picked = new Date(updateDate);
        if (picked < startD || picked > today) {
            toast.error(`Pick a date between ${formatDate(project.startDate || today.toISOString().split("T")[0])} and ${formatDate(today.toISOString().split("T")[0])} (project start through today).`);
            return;
        }
        if (updateSpent && isNaN(Number(updateSpent))) {
            toast.error("Spent amount must be a valid number");
            return;
        }
        if (updateSpent && Number(updateSpent) < 0) {
            toast.error("Spent amount cannot be negative");
            return;
        }

        const newUpdate: ProgressUpdate = {
            id: `PU-${Date.now()}`,
            title: updateTitle || "Progress update",
            note: updateNotes || undefined,
            date: updateDate,
            spentLakhs: updateSpent ? Number(updateSpent) / 100000 : undefined,
            images: updatePhotoPreviews,
        };

        setProgressUpdates(prev => [newUpdate, ...prev]);
        setShowUpdateDialog(false);
        setUpdateDate(new Date().toISOString().split("T")[0]);
        setUpdateTitle("");
        setUpdateSpent("");
        setUpdateNotes("");
        setUpdatePhotos([]);
        setUpdatePhotoPreviews([]);
        toast.success("Progress update added");
    };

    const handleUpdatePhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setUpdatePhotos(prev => [...prev, ...files]);
        setUpdatePhotoPreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
    };

    const removeUpdatePhoto = (idx: number) => {
        setUpdatePhotos(prev => prev.filter((_, i) => i !== idx));
        setUpdatePhotoPreviews(prev => prev.filter((_, i) => i !== idx));
    };

    // Status badge color
    const getEffectiveStatusColor = (s: string) => {
        const map: Record<string, string> = {
            "Active": "bg-primary/10 text-primary",
            "Inactive": "bg-muted text-muted-foreground",
            "Completed": "bg-green-100 text-green-700",
            "Archived": "bg-muted text-muted-foreground",
            "Cancelled": "bg-destructive/10 text-destructive",
        };
        return map[s] || "bg-muted text-muted-foreground";
    };

    const priorityColor = (p: string) => {
        const map: Record<string, string> = {
            "High": "bg-destructive/10 text-destructive",
            "Medium": "bg-amber-100 text-amber-700",
            "Low": "bg-green-100 text-green-700",
        };
        return map[p] || "bg-muted text-muted-foreground";
    };

    return (
        <div className="p-6 space-y-6">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => navigate("/temple/projects/all")}>
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">{project.title}</h1>
                            <p className="text-muted-foreground">{project.type} • {project.manager}</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="gap-2">
                            <Edit className="h-4 w-4" />Edit
                        </Button>
                        <Button variant="outline" size="sm" className="gap-2">
                            <Archive className="h-4 w-4" />Archive
                        </Button>
                    </div>
                </div>

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <div className="border-b border-border">
                        <TabsList className="w-full justify-start border-b-0 rounded-none h-auto p-0 bg-transparent gap-0">
                            <TabsTrigger value="overview" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2">
                                <FileText className="h-4 w-4 mr-2" />Overview
                            </TabsTrigger>
                            <TabsTrigger value="timeline" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2">
                                <Clock className="h-4 w-4 mr-2" />Timeline
                            </TabsTrigger>
                            <TabsTrigger value="funding" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2">
                                <IndianRupee className="h-4 w-4 mr-2" />Funding
                            </TabsTrigger>
                            <TabsTrigger value="expenses" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2">
                                <TrendingUp className="h-4 w-4 mr-2" />Expenses
                            </TabsTrigger>
                            <TabsTrigger value="activity" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2">
                                <Activity className="h-4 w-4 mr-2" />Activity Log
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    {/* ═══════════ OVERVIEW TAB ═══════════ */}
                    <TabsContent value="overview" className="space-y-6 mt-6">
                        {/* Hero: Title + Short description + Badges */}
                        <Card className="p-6 border-0">
                            <h2 className="text-xl font-bold mb-1">{project.title}</h2>
                            {/* Short description placeholder - using first line of description */}
                            <p className="text-sm text-muted-foreground mb-4">
                                {project.description.length > 120
                                    ? project.description.slice(0, 120) + "…"
                                    : project.description}
                            </p>

                            {/* Badges */}
                            <div className="flex flex-wrap items-center gap-2">
                                <Badge className={`${getEffectiveStatusColor(effectiveStatus)} border-0`}>
                                    {effectiveStatus}
                                </Badge>
                                <Badge className={`${priorityColor(project.priority)} border-0`}>
                                    {project.priority}
                                </Badge>
                                {project.type && (
                                    <Badge variant="outline">{project.type}</Badge>
                                )}
                            </div>
                        </Card>

                        {/* Description Card */}
                        {project.description && (
                            <Card className="p-6 border-0">
                                <h3 className="font-semibold mb-3">Description</h3>
                                <p className="text-sm text-muted-foreground whitespace-pre-line">{project.description}</p>
                            </Card>
                        )}

                        {/* Religious Significance - only if data present (mock) */}
                        {project.type === "Religious Program" && (
                            <Card className="p-6 border-0">
                                <h3 className="font-semibold mb-3">Religious Significance</h3>
                                <p className="text-sm text-muted-foreground">
                                    This project holds deep spiritual significance rooted in the traditions of the temple.
                                </p>
                            </Card>
                        )}

                        {/* Milestones */}
                        <Card className="p-6 border-0">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold">Milestones</h3>
                                <Button size="sm" onClick={() => setShowMilestoneDialog(true)} className="gap-2">
                                    <Plus className="h-4 w-4" />Add Milestone
                                </Button>
                            </div>
                            <div className="space-y-3">
                                {project.milestones.length === 0 ? (
                                    <p className="text-sm text-muted-foreground text-center py-6">No milestones added yet.</p>
                                ) : project.milestones.map(milestone => (
                                    <div key={milestone.id} className="border rounded-lg p-4">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h4 className="font-medium">{milestone.title}</h4>
                                                    <Badge className={
                                                        milestone.status === "Completed" ? "bg-green-100 text-green-700" :
                                                            milestone.status === "In Progress" ? "bg-primary/10 text-primary" :
                                                                milestone.status === "Delayed" ? "bg-destructive/10 text-destructive" :
                                                                    "bg-muted text-muted-foreground"
                                                    }>
                                                        {milestone.status}
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-muted-foreground">{milestone.description}</p>
                                                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="h-3 w-3" />
                                                        {formatDate(milestone.targetDate)}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <IndianRupee className="h-3 w-3" />
                                                        ₹{(milestone.estimatedCost / 100000).toFixed(1)}L
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </TabsContent>

                    {/* ═══════════ TIMELINE TAB ═══════════ */}
                    <TabsContent value="timeline" className="space-y-6 mt-6">
                        {/* Important Dates */}
                        <Card className="p-6 border-0">
                            <h3 className="font-semibold mb-4">Important Dates</h3>
                            {(!project.startDate && !project.endDate) ? (
                                <p className="text-sm text-muted-foreground">No dates added.</p>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    {project.startDate && (
                                        <div>
                                            <p className="text-xs text-muted-foreground mb-1">Start Date</p>
                                            <p className="text-sm font-medium">{formatDate(project.startDate)}</p>
                                        </div>
                                    )}
                                    {project.endDate && (
                                        <div>
                                            <p className="text-xs text-muted-foreground mb-1">Expected End Date</p>
                                            <p className="text-sm font-medium">{formatDate(project.endDate)}</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </Card>

                        {/* Progress Updates */}
                        <Card className="p-6 border-0">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="font-semibold">Progress Updates</h3>
                                <Button size="sm" onClick={() => setShowUpdateDialog(true)} className="gap-2">
                                    <Plus className="h-4 w-4" />Add Update
                                </Button>
                            </div>
                            <p className="text-xs text-muted-foreground mb-4">
                                Track how much of the project is completed at each update.
                            </p>

                            <div className="space-y-4">
                                {getDisplayUpdates().map((u, idx) => (
                                    <div key={u.id} className="border-l-2 border-primary/30 pl-4 py-2">
                                        <div className="flex items-start justify-between">
                                            <h4 className="font-medium text-sm">
                                                {u.title === "Project created" ? project.title : u.title}
                                            </h4>
                                            {u.date && (
                                                <span className="text-xs text-muted-foreground ml-2 shrink-0">
                                                    {formatDate(u.date)}
                                                </span>
                                            )}
                                        </div>
                                        {u.note && (
                                            <p className="text-sm text-muted-foreground mt-1">{u.note}</p>
                                        )}
                                        {u.spentLakhs !== undefined && u.spentLakhs > 0 && (
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Spent: ₹{(u.spentLakhs * 100000).toLocaleString()}
                                            </p>
                                        )}
                                        {u.images && u.images.length > 0 && (
                                            <div className="flex gap-2 mt-2">
                                                {u.images.map((img, i) => (
                                                    <img key={i} src={img} alt="" className="w-16 h-16 rounded object-cover border" />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </TabsContent>

                    {/* ═══════════ FUNDING TAB ═══════════ */}
                    <TabsContent value="funding" className="space-y-6 mt-6">
                        {/* Progress Banner */}
                        <Card className="p-6 border-0">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-muted-foreground">Funding Progress</span>
                                <span className="text-sm font-medium">{fundingProgress.toFixed(0)}%</span>
                            </div>
                            <div className="h-3 bg-muted rounded-full overflow-hidden mb-4">
                                <div
                                    className="h-full bg-primary transition-all"
                                    style={{ width: `${Math.min(fundingProgress, 100)}%` }}
                                />
                            </div>
                            <div className="grid grid-cols-4 gap-4">
                                <div>
                                    <p className="text-xs text-muted-foreground">Goal Amount</p>
                                    <p className="text-lg font-bold">₹{(project.goalAmount / 100000).toFixed(1)}L</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Raised</p>
                                    <p className="text-lg font-bold text-green-600">₹{(project.raisedAmount / 100000).toFixed(1)}L</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Spent</p>
                                    <p className="text-lg font-bold text-amber-600">₹{(project.spentAmount / 100000).toFixed(1)}L</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Remaining</p>
                                    <p className={`text-lg font-bold ${remainingBudget >= 0 ? 'text-primary' : 'text-destructive'}`}>
                                        ₹{Math.abs(remainingBudget / 100000).toFixed(1)}L
                                    </p>
                                </div>
                            </div>
                        </Card>

                        {/* Fundraising Config */}
                        <Card className="p-6 border-0">
                            <h3 className="font-semibold mb-4">Fundraising Configuration</h3>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-sm font-medium">Minimum Contribution</Label>
                                        <Input value={`₹${project.minimumContribution}`} readOnly className="mt-1.5" />
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium">Suggested Slabs</Label>
                                        <div className="flex gap-2 mt-1.5 flex-wrap">
                                            {project.suggestedSlabs.map((slab, i) => (
                                                <Badge key={i} variant="outline">₹{slab.toLocaleString()}</Badge>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <Label className="text-sm font-medium">Show Donor Names</Label>
                                    <Switch checked={project.showDonorNames} />
                                </div>
                                <div className="flex items-center justify-between">
                                    <Label className="text-sm font-medium">Public Visibility</Label>
                                    <Switch checked={project.publicVisibility} />
                                </div>
                                {project.transparencyNote && (
                                    <div>
                                        <Label className="text-sm font-medium">Transparency Note</Label>
                                        <p className="text-sm text-muted-foreground mt-1.5">{project.transparencyNote}</p>
                                    </div>
                                )}
                            </div>
                        </Card>

                        {/* Donations Table */}
                        <Card className="p-6 border-0">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold">Donations Received</h3>
                                <Button size="sm" onClick={() => setShowDonationDialog(true)} className="gap-2">
                                    <Plus className="h-4 w-4" />Record Donation
                                </Button>
                            </div>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Donor</TableHead>
                                        <TableHead className="text-right">Amount</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Payment Mode</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {project.donations.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                                                No donations recorded yet
                                            </TableCell>
                                        </TableRow>
                                    ) : project.donations.map(donation => (
                                        <TableRow key={donation.id}>
                                            <TableCell className="font-medium">
                                                {donation.anonymous ? "Anonymous" : donation.donorName}
                                            </TableCell>
                                            <TableCell className="text-right font-medium text-green-600">
                                                ₹{donation.amount.toLocaleString()}
                                            </TableCell>
                                            <TableCell className="text-sm">{formatDate(donation.date)}</TableCell>
                                            <TableCell className="text-sm">{donation.paymentMode}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Card>
                    </TabsContent>

                    {/* ═══════════ EXPENSES TAB ═══════════ */}
                    <TabsContent value="expenses" className="space-y-6 mt-6">
                        <div className="grid grid-cols-3 gap-4">
                            <Card className="p-4 border-0">
                                <p className="text-xs text-muted-foreground">Total Spent</p>
                                <p className="text-2xl font-bold text-amber-600">₹{(project.spentAmount / 100000).toFixed(1)}L</p>
                            </Card>
                            <Card className="p-4 border-0">
                                <p className="text-xs text-muted-foreground">Remaining Budget</p>
                                <p className={`text-2xl font-bold ${remainingBudget >= 0 ? 'text-primary' : 'text-destructive'}`}>
                                    ₹{Math.abs(remainingBudget / 100000).toFixed(1)}L
                                </p>
                            </Card>
                            <Card className="p-4 border-0">
                                <p className="text-xs text-muted-foreground">Budget Variance</p>
                                <p className={`text-2xl font-bold ${budgetVariance > 0 ? 'text-destructive' : 'text-green-600'}`}>
                                    {budgetVariance > 0 ? '+' : ''}{budgetVariance.toFixed(1)}%
                                </p>
                            </Card>
                        </div>

                        <Card className="p-6 border-0">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold">Expense Tracking</h3>
                                <Button size="sm" onClick={() => setShowExpenseDialog(true)} className="gap-2">
                                    <Plus className="h-4 w-4" />Add Expense
                                </Button>
                            </div>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Expense Title</TableHead>
                                        <TableHead>Vendor</TableHead>
                                        <TableHead>Category</TableHead>
                                        <TableHead className="text-right">Amount</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Approved By</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {project.expenses.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                                                No expenses recorded yet
                                            </TableCell>
                                        </TableRow>
                                    ) : project.expenses.map(expense => (
                                        <TableRow key={expense.id}>
                                            <TableCell className="font-medium">{expense.title}</TableCell>
                                            <TableCell className="text-sm">{expense.vendor}</TableCell>
                                            <TableCell className="text-sm">{expense.category}</TableCell>
                                            <TableCell className="text-right font-medium">₹{expense.amount.toLocaleString()}</TableCell>
                                            <TableCell className="text-sm">{formatDate(expense.date)}</TableCell>
                                            <TableCell>
                                                <Badge className={
                                                    expense.paidStatus === "Paid" ? "bg-green-100 text-green-700" :
                                                        expense.paidStatus === "Overdue" ? "bg-destructive/10 text-destructive" :
                                                            "bg-amber-100 text-amber-700"
                                                }>
                                                    {expense.paidStatus}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-sm">{expense.approvedBy || "—"}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Card>
                    </TabsContent>

                    {/* ═══════════ ACTIVITY LOG TAB ═══════════ */}
                    <TabsContent value="activity" className="space-y-6 mt-6">
                        <Card className="p-6 border-0">
                            <h3 className="font-semibold mb-4">Activity Timeline</h3>
                            <div className="space-y-3">
                                {project.activityLog.map(log => (
                                    <div key={log.id} className="flex gap-3 pb-3 border-b last:border-b-0">
                                        <div className={`mt-1 p-1.5 rounded-full ${log.type === 'donation' ? 'bg-green-100' :
                                            log.type === 'expense' ? 'bg-amber-100' :
                                                log.type === 'milestone' ? 'bg-primary/10' :
                                                    log.type === 'status' ? 'bg-purple-100' :
                                                        'bg-muted'
                                            }`}>
                                            {log.type === 'donation' && <IndianRupee className="h-3 w-3 text-green-600" />}
                                            {log.type === 'expense' && <TrendingUp className="h-3 w-3 text-amber-600" />}
                                            {log.type === 'milestone' && <CheckCircle className="h-3 w-3 text-primary" />}
                                            {log.type === 'status' && <Activity className="h-3 w-3 text-purple-600" />}
                                            {log.type === 'update' && <FileText className="h-3 w-3 text-muted-foreground" />}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm font-medium">{log.event}</p>
                                                <span className="text-xs text-muted-foreground">{formatDate(log.timestamp.split("T")[0])}</span>
                                            </div>
                                            <p className="text-sm text-muted-foreground">{log.description}</p>
                                            <p className="text-xs text-muted-foreground mt-0.5">by {log.user}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </TabsContent>
                </Tabs>
            </motion.div>

            {/* ═══════════ DIALOGS ═══════════ */}

            {/* Add Milestone Dialog */}
            <Dialog open={showMilestoneDialog} onOpenChange={setShowMilestoneDialog}>
                <DialogContent className="bg-background">
                    <DialogHeader>
                        <DialogTitle>Add Milestone</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label>Milestone Title *</Label>
                            <Input placeholder="e.g., Foundation Work" className="mt-1.5" />
                        </div>
                        <div>
                            <Label>Description</Label>
                            <Textarea placeholder="Milestone details..." rows={3} className="mt-1.5" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Target Date *</Label>
                                <Input type="date" className="mt-1.5" />
                            </div>
                            <div>
                                <Label>Estimated Cost *</Label>
                                <Input type="number" placeholder="0" className="mt-1.5" />
                            </div>
                        </div>
                        <div>
                            <Label>Status</Label>
                            <Select defaultValue="Pending">
                                <SelectTrigger className="mt-1.5 bg-background">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-popover">
                                    <SelectItem value="Pending">Pending</SelectItem>
                                    <SelectItem value="In Progress">In Progress</SelectItem>
                                    <SelectItem value="Completed">Completed</SelectItem>
                                    <SelectItem value="Delayed">Delayed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowMilestoneDialog(false)}>Cancel</Button>
                        <Button onClick={() => { toast.success("Milestone added"); setShowMilestoneDialog(false); }}>Add Milestone</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Record Donation Dialog */}
            <Dialog open={showDonationDialog} onOpenChange={setShowDonationDialog}>
                <DialogContent className="bg-background max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Record Donation</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Donor Name *</Label>
                                <Input placeholder="Enter donor name" className="mt-1.5" />
                            </div>
                            <div>
                                <Label>Contact Number</Label>
                                <Input placeholder="Phone number" className="mt-1.5" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Donation Amount *</Label>
                                <Input type="number" placeholder="0" className="mt-1.5" />
                            </div>
                            <div>
                                <Label>Donation Date *</Label>
                                <Input type="date" className="mt-1.5" />
                            </div>
                        </div>
                        <div>
                            <Label>Payment Mode *</Label>
                            <Select defaultValue="Online">
                                <SelectTrigger className="mt-1.5 bg-background">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-popover">
                                    <SelectItem value="Online">Online Transfer</SelectItem>
                                    <SelectItem value="Card">Credit/Debit Card</SelectItem>
                                    <SelectItem value="Cash">Cash</SelectItem>
                                    <SelectItem value="Cheque">Cheque</SelectItem>
                                    <SelectItem value="UPI">UPI</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center gap-2">
                            <Switch id="anonymous" />
                            <Label htmlFor="anonymous" className="cursor-pointer">Mark as Anonymous</Label>
                        </div>
                        <div>
                            <Label>Notes</Label>
                            <Textarea placeholder="Additional notes..." rows={3} className="mt-1.5" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowDonationDialog(false)}>Cancel</Button>
                        <Button onClick={() => { toast.success("Donation recorded successfully"); setShowDonationDialog(false); }}>
                            Record Donation
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Add Expense Dialog */}
            <Dialog open={showExpenseDialog} onOpenChange={setShowExpenseDialog}>
                <DialogContent className="bg-background max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Add Expense</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                        <div>
                            <Label>Expense Title *</Label>
                            <Input placeholder="e.g., Steel bars purchase" className="mt-1.5" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Vendor Name *</Label>
                                <Input placeholder="Vendor/Supplier name" className="mt-1.5" />
                            </div>
                            <div>
                                <Label>Category *</Label>
                                <Select defaultValue="Materials">
                                    <SelectTrigger className="mt-1.5 bg-background">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-popover">
                                        <SelectItem value="Materials">Construction Materials</SelectItem>
                                        <SelectItem value="Labor">Labor Costs</SelectItem>
                                        <SelectItem value="Equipment">Equipment Rental</SelectItem>
                                        <SelectItem value="Professional">Professional Services</SelectItem>
                                        <SelectItem value="Administrative">Administrative</SelectItem>
                                        <SelectItem value="Other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Amount *</Label>
                                <Input type="number" placeholder="0" className="mt-1.5" />
                            </div>
                            <div>
                                <Label>Expense Date *</Label>
                                <Input type="date" className="mt-1.5" />
                            </div>
                        </div>
                        <div>
                            <Label>Payment Status *</Label>
                            <Select defaultValue="Pending">
                                <SelectTrigger className="mt-1.5 bg-background">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-popover">
                                    <SelectItem value="Pending">Pending</SelectItem>
                                    <SelectItem value="Paid">Paid</SelectItem>
                                    <SelectItem value="Overdue">Overdue</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Description</Label>
                            <Textarea placeholder="Expense details..." rows={3} className="mt-1.5" />
                        </div>
                        <div>
                            <Label>Upload Bill/Invoice (Optional)</Label>
                            <Input type="file" className="mt-1.5" accept=".pdf,.jpg,.jpeg,.png" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowExpenseDialog(false)}>Cancel</Button>
                        <Button onClick={() => { toast.success("Expense added successfully"); setShowExpenseDialog(false); }}>
                            Add Expense
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Add Progress Update Dialog */}
            <Dialog open={showUpdateDialog} onOpenChange={setShowUpdateDialog}>
                <DialogContent className="bg-background max-w-lg">
                    <DialogHeader>
                        <DialogTitle>New progress update</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                        <div>
                            <Label>Date *</Label>
                            <Input
                                type="date"
                                value={updateDate}
                                onChange={e => setUpdateDate(e.target.value)}
                                className="mt-1.5"
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                                Updates can be added after the project start date.
                            </p>
                        </div>
                        <div>
                            <Label>Title</Label>
                            <Input
                                placeholder="Update title"
                                value={updateTitle}
                                onChange={e => setUpdateTitle(e.target.value)}
                                className="mt-1.5"
                            />
                        </div>
                        <div>
                            <Label>Spent amount (₹)</Label>
                            <Input
                                type="number"
                                placeholder="0"
                                value={updateSpent}
                                onChange={e => setUpdateSpent(e.target.value)}
                                min="0"
                                className="mt-1.5"
                            />
                        </div>
                        <div>
                            <Label>Notes (optional)</Label>
                            <Textarea
                                placeholder="Add notes..."
                                value={updateNotes}
                                onChange={e => setUpdateNotes(e.target.value)}
                                rows={3}
                                className="mt-1.5"
                            />
                        </div>
                        <div>
                            <Label>Photos</Label>
                            <div className="flex flex-wrap gap-2 mt-1.5">
                                {updatePhotoPreviews.map((preview, idx) => (
                                    <div key={idx} className="relative w-16 h-16 rounded overflow-hidden border">
                                        <img src={preview} alt="" className="w-full h-full object-cover" />
                                        <button
                                            onClick={() => removeUpdatePhoto(idx)}
                                            className="absolute top-0.5 right-0.5 bg-background/80 rounded-full p-0.5"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                ))}
                                <label className="flex items-center justify-center w-16 h-16 border-2 border-dashed rounded cursor-pointer hover:bg-muted/50 transition-colors">
                                    <ImageIcon className="h-5 w-5 text-muted-foreground" />
                                    <input type="file" accept="image/png,image/jpeg" multiple className="hidden" onChange={handleUpdatePhotos} />
                                </label>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowUpdateDialog(false)}>Cancel</Button>
                        <Button onClick={handleSaveUpdate}>Save update</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ProjectDetail;
