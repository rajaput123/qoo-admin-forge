import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, TrendingUp, TrendingDown, DollarSign, Users, Briefcase, Award, BarChart3, PieChart, Calendar, AlertCircle, CheckCircle2, Clock, Download } from "lucide-react";
import { toast } from "sonner";
import { freelancerAssignments } from "@/data/templeData";

// Calculate insights from real data
const calculateInsights = () => {
  const assignments = freelancerAssignments;
  const completed = assignments.filter(a => a.status === "Completed");
  const active = assignments.filter(a => a.status === "Assigned" || a.status === "Confirmed");
  
  const totalSpend = completed.reduce((sum, a) => sum + a.agreedPayment, 0);
  const pendingSpend = active.reduce((sum, a) => sum + a.agreedPayment, 0);
  
  // Group by freelancer
  const freelancerStats = assignments.reduce((acc, a) => {
    if (!acc[a.freelancerName]) {
      acc[a.freelancerName] = {
        name: a.freelancerName,
        id: a.freelancerId,
        totalAssignments: 0,
        completedAssignments: 0,
        totalPaid: 0,
        pendingAmount: 0,
        categories: new Set<string>(),
      };
    }
    acc[a.freelancerName].totalAssignments++;
    if (a.status === "Completed") {
      acc[a.freelancerName].completedAssignments++;
      acc[a.freelancerName].totalPaid += a.agreedPayment;
    } else if (a.status === "Assigned" || a.status === "Confirmed") {
      acc[a.freelancerName].pendingAmount += a.agreedPayment;
    }
    return acc;
  }, {} as Record<string, any>);

  // Group by category (simplified - would need category mapping in real app)
  const categoryStats = assignments.reduce((acc, a) => {
    const category = "General"; // Would map from freelancer data
    if (!acc[category]) {
      acc[category] = { category, assignments: 0, spend: 0, freelancers: new Set() };
    }
    acc[category].assignments++;
    if (a.status === "Completed") {
      acc[category].spend += a.agreedPayment;
    }
    acc[category].freelancers.add(a.freelancerName);
    return acc;
  }, {} as Record<string, any>);

  // Top performers
  const topPerformers = Object.values(freelancerStats)
    .sort((a: any, b: any) => b.completedAssignments - a.completedAssignments)
    .slice(0, 5);

  return {
    totalAssignments: assignments.length,
    completedAssignments: completed.length,
    activeAssignments: active.length,
    totalSpend,
    pendingSpend,
    uniqueFreelancers: Object.keys(freelancerStats).length,
    topPerformers: topPerformers as any[],
    allFreelancerStats: Object.values(freelancerStats) as any[],
    categoryStats: Object.values(categoryStats).map(c => ({
      category: c.category,
      assignments: c.assignments,
      spend: c.spend,
      freelancers: c.freelancers.size,
    })),
    completionRate: assignments.length > 0 ? (completed.length / assignments.length) * 100 : 0,
  };
};

const Insights = () => {
  const [timeRange, setTimeRange] = useState("all");
  const [showExport, setShowExport] = useState(false);
  const [exportType, setExportType] = useState("overview");
  const [exportFormat, setExportFormat] = useState("csv");
  const insights = calculateInsights();

  const handleExport = () => {
    let csv = "";
    let filename = "";

    if (exportType === "overview") {
      filename = `freelancer-insights-overview-${new Date().toISOString().split("T")[0]}.csv`;
      csv = [
        "Metric,Value",
        `Total Assignments,${insights.totalAssignments}`,
        `Completed Assignments,${insights.completedAssignments}`,
        `Active Assignments,${insights.activeAssignments}`,
        `Total Spend,₹${insights.totalSpend.toLocaleString()}`,
        `Pending Spend,₹${insights.pendingSpend.toLocaleString()}`,
        `Active Freelancers,${insights.uniqueFreelancers}`,
        `Completion Rate,${insights.completionRate.toFixed(1)}%`,
      ].join("\n");
    } else if (exportType === "performance") {
      filename = `freelancer-performance-${new Date().toISOString().split("T")[0]}.csv`;
      csv = [
        "Rank,Freelancer Name,Freelancer ID,Total Assignments,Completed Assignments,Total Paid (₹),Pending Amount (₹)",
        ...insights.topPerformers.map((f: any, i: number) => 
          `${i + 1},"${f.name}",${f.id},${f.totalAssignments},${f.completedAssignments},${f.totalPaid},${f.pendingAmount}`
        ),
      ].join("\n");
    } else if (exportType === "financial") {
      filename = `freelancer-financial-${new Date().toISOString().split("T")[0]}.csv`;
      csv = [
        "Category,Amount (₹),Status",
        `Total Paid,${insights.totalSpend},Completed`,
        `Pending Payments,${insights.pendingSpend},Active`,
        `Total Budget,${insights.totalSpend + insights.pendingSpend},Allocated`,
      ].join("\n");
    } else if (exportType === "categories") {
      filename = `freelancer-categories-${new Date().toISOString().split("T")[0]}.csv`;
      csv = [
        "Category,Freelancers,Assignments,Total Spend (₹),Avg per Assignment (₹)",
        ...insights.categoryStats.map(c => 
          `"${c.category}",${c.freelancers},${c.assignments},${c.spend},${c.assignments > 0 ? (c.spend / c.assignments).toFixed(2) : "0"}`
        ),
      ].join("\n");
    }

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    setShowExport(false);
    toast.success(`Insights exported as ${exportFormat.toUpperCase()}`);
  };

  const StatCard = ({ title, value, subtitle, icon: Icon, trend, trendValue }: any) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
            {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
            {trend && (
              <div className={`flex items-center gap-1 mt-2 text-xs ${trend === "up" ? "text-green-600" : "text-red-600"}`}>
                {trend === "up" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                <span>{trendValue}</span>
              </div>
            )}
          </div>
          {Icon && (
            <div className="p-3 bg-primary/10 rounded-lg">
              <Icon className="h-6 w-6 text-primary" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Insights & Analytics</h1>
            <p className="text-muted-foreground mt-1">
              Comprehensive analytics and performance metrics for freelancer management
            </p>
            <div className="mt-3 p-3 bg-muted/50 border rounded-lg text-xs text-muted-foreground">
              <p className="font-medium mb-1">What are Insights?</p>
              <p>
                Insights provide data-driven analysis of your freelancer operations, including spending patterns, 
                performance metrics, and category breakdowns. Use these analytics to make informed decisions about 
                resource allocation, identify top performers, and optimize costs.
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[140px] bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => setShowExport(true)} className="gap-2">
              <Download className="h-4 w-4" />Export
            </Button>
          </div>
        </div>

        {/* Tab-based Content */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-transparent">
            <TabsTrigger value="overview" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
              Overview
            </TabsTrigger>
            <TabsTrigger value="performance" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
              Performance
            </TabsTrigger>
            <TabsTrigger value="financial" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
              Financial
            </TabsTrigger>
            <TabsTrigger value="categories" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
              Categories
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6 mt-6">
            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Total Assignments"
                value={insights.totalAssignments}
                subtitle={`${insights.completedAssignments} completed, ${insights.activeAssignments} active`}
                icon={Briefcase}
              />
              <StatCard
                title="Total Spend"
                value={`₹${insights.totalSpend.toLocaleString()}`}
                subtitle={`₹${insights.pendingSpend.toLocaleString()} pending`}
                icon={DollarSign}
              />
              <StatCard
                title="Active Freelancers"
                value={insights.uniqueFreelancers}
                subtitle="Currently engaged"
                icon={Users}
              />
              <StatCard
                title="Completion Rate"
                value={`${insights.completionRate.toFixed(1)}%`}
                subtitle={`${insights.completedAssignments} of ${insights.totalAssignments} completed`}
                icon={CheckCircle2}
                trend={insights.completionRate >= 70 ? "up" : "down"}
                trendValue={insights.completionRate >= 70 ? "Good" : "Needs attention"}
              />
            </div>

            {/* Status Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-500" />
                  Assignment Status Overview
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Current distribution of assignment statuses
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium">Completed</span>
                      </div>
                      <span className="text-sm font-bold">{insights.completedAssignments}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full transition-all"
                        style={{ width: `${insights.completionRate}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-amber-600" />
                        <span className="text-sm font-medium">Active</span>
                      </div>
                      <span className="text-sm font-bold">{insights.activeAssignments}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-amber-600 h-2 rounded-full transition-all"
                        style={{
                          width: `${insights.totalAssignments > 0 ? (insights.activeAssignments / insights.totalAssignments) * 100 : 0}%`,
                        }}
                      />
                    </div>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Total Assignments</span>
                      <span className="font-bold">{insights.totalAssignments}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Why Insights Matter */}
            <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <AlertCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-2">Why Use Insights?</h3>
                    <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                      <li><strong>Cost Optimization:</strong> Identify spending patterns and optimize budget allocation</li>
                      <li><strong>Performance Tracking:</strong> Monitor freelancer performance and reliability metrics</li>
                      <li><strong>Resource Planning:</strong> Make data-driven decisions for future assignments</li>
                      <li><strong>Category Analysis:</strong> Understand which service categories consume most resources</li>
                      <li><strong>Trend Identification:</strong> Spot patterns in assignment completion and spending</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Award className="h-5 w-5 text-amber-500" />
                    Top Performing Freelancers
                  </CardTitle>
                  <Badge variant="secondary">{insights.topPerformers.length}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Ranked by completed assignments and reliability
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {insights.topPerformers.length > 0 ? (
                    insights.topPerformers.map((f: any, i: number) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                            {i + 1}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{f.name}</p>
                            <p className="text-xs text-muted-foreground">ID: {f.id}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{f.completedAssignments} completed</p>
                          <p className="text-xs text-muted-foreground">₹{f.totalPaid.toLocaleString()}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground text-sm">
                      <Briefcase className="h-8 w-8 mx-auto mb-2 opacity-30" />
                      <p>No completed assignments yet</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* All Freelancers Performance Table */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">All Freelancers Performance</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Complete performance breakdown for all freelancers
                </p>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Freelancer</TableHead>
                        <TableHead className="text-center">Total</TableHead>
                        <TableHead className="text-center">Completed</TableHead>
                        <TableHead className="text-right">Total Paid</TableHead>
                        <TableHead className="text-right">Pending</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {insights.allFreelancerStats.length > 0 ? (
                        insights.allFreelancerStats.map((f: any, i: number) => (
                          <TableRow key={i}>
                            <TableCell>
                              <div>
                                <p className="font-medium">{f.name}</p>
                                <p className="text-xs text-muted-foreground">ID: {f.id}</p>
                              </div>
                            </TableCell>
                            <TableCell className="text-center">{f.totalAssignments}</TableCell>
                            <TableCell className="text-center">
                              <Badge variant={f.completedAssignments > 0 ? "default" : "secondary"}>
                                {f.completedAssignments}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              ₹{f.totalPaid.toLocaleString()}
                            </TableCell>
                            <TableCell className="text-right text-muted-foreground">
                              ₹{f.pendingAmount.toLocaleString()}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                            No freelancer data available
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Financial Tab */}
          <TabsContent value="financial" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-purple-500" />
                  Financial Overview
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Spending analysis and payment status
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <p className="text-xs text-green-700 dark:text-green-300 mb-1">Total Paid</p>
                    <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                      ₹{insights.totalSpend.toLocaleString()}
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                      {insights.completedAssignments} completed assignments
                    </p>
                  </div>
                  <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                    <p className="text-xs text-amber-700 dark:text-amber-300 mb-1">Pending Payments</p>
                    <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">
                      ₹{insights.pendingSpend.toLocaleString()}
                    </p>
                    <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                      {insights.activeAssignments} active assignments
                    </p>
                  </div>
                  <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <p className="text-xs text-blue-700 dark:text-blue-300 mb-1">Total Budget</p>
                    <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                      ₹{(insights.totalSpend + insights.pendingSpend).toLocaleString()}
                    </p>
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                      Allocated across all assignments
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories" className="space-y-6 mt-6">
            {insights.categoryStats.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-indigo-500" />
                    Category Analysis
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Spending and assignment distribution by service category
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Service Category</TableHead>
                          <TableHead className="text-center">Freelancers</TableHead>
                          <TableHead className="text-center">Assignments</TableHead>
                          <TableHead className="text-right">Total Spend</TableHead>
                          <TableHead className="text-right">Avg. per Assignment</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {insights.categoryStats.map((c, i) => (
                          <TableRow key={i}>
                            <TableCell className="font-medium">{c.category}</TableCell>
                            <TableCell className="text-center">
                              <Badge variant="secondary">{c.freelancers}</Badge>
                            </TableCell>
                            <TableCell className="text-center">{c.assignments}</TableCell>
                            <TableCell className="text-right font-medium">
                              ₹{c.spend.toLocaleString()}
                            </TableCell>
                            <TableCell className="text-right text-muted-foreground">
                              ₹{c.assignments > 0 ? (c.spend / c.assignments).toLocaleString() : "0"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  <BarChart3 className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p>No category data available</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Export Modal */}
      <Dialog open={showExport} onOpenChange={setShowExport}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Export Insights</DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Export insights data for analysis and reporting
            </p>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label className="text-xs">Export Type</Label>
              <Select value={exportType} onValueChange={setExportType}>
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="overview">Overview Metrics</SelectItem>
                  <SelectItem value="performance">Performance Data</SelectItem>
                  <SelectItem value="financial">Financial Summary</SelectItem>
                  <SelectItem value="categories">Category Breakdown</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Format</Label>
              <Select value={exportFormat} onValueChange={setExportFormat}>
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowExport(false)}>Cancel</Button>
            <Button onClick={handleExport}>Export</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Insights;
