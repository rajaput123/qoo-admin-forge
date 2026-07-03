import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Download } from "lucide-react";
import { toast } from "sonner";
import { projects } from "@/data/projectData";

const Reports = () => {
    const [reportType, setReportType] = useState("");
    const [format, setFormat] = useState("pdf");
    const [projectFilter, setProjectFilter] = useState("all");

    const reportTypes = [
        { value: "fundraising", label: "Fundraising Summary", description: "Overview of all donations and funding progress" },
        { value: "expenses", label: "Expense Breakdown", description: "Detailed expense tracking and categories" },
        { value: "donors", label: "Donor Report", description: "List of all donors and their contributions" },
        { value: "transparency", label: "Transparency Report", description: "Public-facing financial transparency document" },
        { value: "milestones", label: "Milestone Progress", description: "Status of all project milestones" },
    ];

    const handleGenerate = () => {
        if (!reportType) {
            toast.error("Please select a report type");
            return;
        }
        toast.success(`Generating ${reportTypes.find(r => r.value === reportType)?.label} as ${format.toUpperCase()}...`);
    };

    return (
        <div className="p-6 space-y-6">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold tracking-tight">Project Reports</h1>
                    <p className="text-muted-foreground">Generate comprehensive project reports</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Report Configuration */}
                    <div className="lg:col-span-2 space-y-4">
                        <Card className="p-6">
                            <h2 className="text-lg font-semibold mb-4">Report Configuration</h2>

                            <div className="space-y-4">
                                {/* Report Type */}
                                <div>
                                    <label className="text-sm font-medium mb-1.5 block">Report Type</label>
                                    <Select value={reportType} onValueChange={setReportType}>
                                        <SelectTrigger className="bg-background">
                                            <SelectValue placeholder="Select report type" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-popover">
                                            {reportTypes.map(r => (
                                                <SelectItem key={r.value} value={r.value}>
                                                    <div>
                                                        <div className="font-medium">{r.label}</div>
                                                        <div className="text-xs text-muted-foreground">{r.description}</div>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Project Filter */}
                                <div>
                                    <label className="text-sm font-medium mb-1.5 block">Project Scope</label>
                                    <Select value={projectFilter} onValueChange={setProjectFilter}>
                                        <SelectTrigger className="bg-background">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-popover">
                                            <SelectItem value="all">All Projects</SelectItem>
                                            <SelectItem value="active">Active Projects Only</SelectItem>
                                            <SelectItem value="completed">Completed Projects Only</SelectItem>
                                            {projects.map(p => (
                                                <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Export Format */}
                                <div>
                                    <label className="text-sm font-medium mb-1.5 block">Export Format</label>
                                    <Select value={format} onValueChange={setFormat}>
                                        <SelectTrigger className="bg-background">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-popover">
                                            <SelectItem value="pdf">PDF Document</SelectItem>
                                            <SelectItem value="csv">CSV Spreadsheet</SelectItem>
                                            <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Generate Button */}
                                <Button onClick={handleGenerate} className="w-full gap-2">
                                    <Download className="h-4 w-4" />
                                    Generate Report
                                </Button>
                            </div>
                        </Card>
                    </div>

                    {/* Quick Reports */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold">Quick Reports</h2>

                        {reportTypes.map(report => (
                            <Card key={report.value} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                                <div className="flex items-start gap-3">
                                    <FileText className="h-5 w-5 text-primary mt-0.5" />
                                    <div>
                                        <h3 className="font-medium text-sm">{report.label}</h3>
                                        <p className="text-xs text-muted-foreground mt-0.5">{report.description}</p>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Recent Reports */}
                <Card className="p-6 mt-6">
                    <h2 className="text-lg font-semibold mb-4">Recent Reports</h2>
                    <div className="text-center text-muted-foreground py-8">
                        No reports generated yet
                    </div>
                </Card>
            </motion.div>
        </div>
    );
};

export default Reports;
