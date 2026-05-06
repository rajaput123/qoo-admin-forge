import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import {
  CalendarIcon, TrendingUp, TrendingDown, IndianRupee, Heart,
  FolderKanban, CalendarDays, ArrowUpRight, ArrowDownRight, Filter,
  ChevronDown, ChevronUp,
  Landmark, RefreshCw,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import {
  getConsolidatedSummary,
  getEventFinanceSummaries, getProjectFinanceSummaries,
} from "@/modules/finance/consolidatedFinance";
import { toast } from "sonner";
import { financeIntegration } from "@/modules/finance/integration";

const COLORS = [
  "hsl(16, 85%, 35%)", "hsl(142, 60%, 40%)", "hsl(200, 60%, 50%)",
  "hsl(280, 50%, 55%)", "hsl(45, 90%, 45%)", "hsl(0, 50%, 50%)",
  "hsl(30, 80%, 50%)",
];

const formatCurrency = (val: number) => {
  if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)}Cr`;
  if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
  if (val >= 1000) return `₹${(val / 1000).toFixed(0)}K`;
  return `₹${val.toLocaleString("en-IN")}`;
};

const formatFull = (val: number) => `₹${val.toLocaleString("en-IN")}`;

const ConsolidatedFinanceDashboard = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [categoryFilter, setCategoryFilter] = useState("all");

  const filters = useMemo(() => ({
    dateFrom: dateRange.from ? format(dateRange.from, "yyyy-MM-dd") : undefined,
    dateTo: dateRange.to ? format(dateRange.to, "yyyy-MM-dd") : undefined,
    category: categoryFilter !== "all" ? categoryFilter : undefined,
  }), [dateRange, categoryFilter]);

  const summary = useMemo(() => getConsolidatedSummary(filters), [filters]);
  const eventSummaries = useMemo(() => getEventFinanceSummaries(), []);
  const projectSummaries = useMemo(() => getProjectFinanceSummaries(), []);

  // Inline analytics data
  const incomeDistribution = [
    { name: "Hundi Collection", value: 1800000 },
    { name: "Online Donations", value: 1200000 },
    { name: "Counter Donations", value: 650000 },
    { name: "Seva Bookings", value: 2100000 },
    { name: "Event Income", value: 350000 },
    { name: "Project Funds", value: 500000 },
  ];
  const expenseDistribution = [
    { name: "Daily Operations", value: 1200000 },
    { name: "Pooja & Rituals", value: 850000 },
    { name: "Maintenance", value: 650000 },
    { name: "Utilities", value: 380000 },
    { name: "Staff Salaries", value: 1600000 },
    { name: "Priest Honorarium", value: 480000 },
    { name: "Security", value: 360000 },
  ];
  const projectFinanceData = [
    { name: "Gopuram Renovation", allocated: 2500000, actual: 2180000 },
    { name: "Kitchen Upgrade", allocated: 800000, actual: 920000 },
    { name: "Garden Landscaping", allocated: 350000, actual: 310000 },
    { name: "Parking Expansion", allocated: 1200000, actual: 1050000 },
  ];
  const eventFinanceData = [
    { name: "Brahmotsavam", budget: 1500000, collections: 1250000, expenses: 1080000 },
    { name: "Maha Shivaratri", budget: 800000, collections: 680000, expenses: 620000 },
    { name: "Ganesh Chaturthi", budget: 600000, collections: 520000, expenses: 490000 },
    { name: "Navaratri", budget: 1000000, collections: 890000, expenses: 780000 },
  ];

  const handleSync = () => {
    try {
      const count = financeIntegration.syncDonationsToLedger();
      if (count > 0) toast.success(`Synced ${count} donations to ledger`);
      else toast.info("All donations already synced");
    } catch { toast.error("Sync failed"); }
  };

  const kpiCards = [
    {
      title: "Total Revenue",
      value: summary.totalRevenue,
      icon: IndianRupee,
      trend: "+12.4%",
      positive: true,
      color: "text-green-600",
      border: "border-l-green-500",
    },
    {
      title: "Total Donations",
      value: summary.totalDonations,
      icon: Heart,
      trend: "+18.2%",
      positive: true,
      color: "text-primary",
      border: "border-l-primary",
    },
    {
      title: "Total Expenses",
      value: summary.totalExpenses,
      icon: TrendingDown,
      trend: "+8.5%",
      positive: false,
      color: "text-red-500",
      border: "border-l-red-400",
    },
    {
      title: "Net Balance",
      value: summary.netBalance,
      icon: TrendingUp,
      trend: "+22.1%",
      positive: true,
      color: "text-emerald-600",
      border: "border-l-emerald-500",
    },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload) return null;
    return (
      <div className="bg-popover border border-border rounded-lg p-3 shadow-lg text-sm">
        <p className="font-medium text-foreground mb-1">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color }} className="text-xs">
            {p.name}: {formatCurrency(p.value)}
          </p>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Finance & Accounts</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Consolidated view · All modules aggregated · FY 2025-26
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleSync} className="gap-1.5">
            <RefreshCw className="h-3.5 w-3.5" />Sync Ledger
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className="gap-1.5">
            <Filter className="h-3.5 w-3.5" />Filters
            {showFilters ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </Button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <Card className="border-primary/20 bg-primary/[0.02]">
          <CardContent className="pt-4 pb-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <Label className="text-xs font-medium">Date Range</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full justify-start text-left font-normal mt-1">
                      <CalendarIcon className="mr-2 h-3.5 w-3.5" />
                      {dateRange.from
                        ? dateRange.to
                          ? `${format(dateRange.from, "dd MMM")} – ${format(dateRange.to, "dd MMM")}`
                          : format(dateRange.from, "dd MMM yy")
                        : "All dates"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      selected={{ from: dateRange.from, to: dateRange.to }}
                      onSelect={(range) => setDateRange(range || {})}
                      numberOfMonths={2}
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label className="text-xs font-medium">Category</Label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="bg-background mt-1 h-9"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="donations">Donations Only</SelectItem>
                    <SelectItem value="seva">Seva Income</SelectItem>
                    <SelectItem value="events">Event Collections</SelectItem>
                    <SelectItem value="projects">Project Funds</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end gap-2">
                <Button size="sm" className="mt-1" onClick={() => { setDateRange({}); setCategoryFilter("all"); }}>
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpiCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <Card key={i} className={cn("border-l-4 relative", card.border)}>
              <CardContent className="p-4">
                <div className="flex items-center gap-1.5 mb-1">
                  <Icon className={cn("h-3.5 w-3.5", card.color)} />
                  <span className="text-[11px] text-muted-foreground font-medium truncate">{card.title}</span>
                </div>
                <p className="text-lg font-bold text-foreground">{formatCurrency(card.value)}</p>
                <div className="absolute top-3 right-3">
                  <span className={cn("flex items-center gap-0.5 text-[10px] font-semibold", card.positive ? "text-green-600" : "text-red-500")}>
                    {card.positive ? <ArrowUpRight className="h-2.5 w-2.5" /> : <ArrowDownRight className="h-2.5 w-2.5" />}
                    {card.trend}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Income & Expense Distribution */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Income Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={incomeDistribution} cx="50%" cy="50%" innerRadius={55} outerRadius={95} paddingAngle={3} dataKey="value">
                  {incomeDistribution.map((entry, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v: number) => formatFull(v)} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1 mt-3">
              {incomeDistribution.map((source, i) => (
                <div key={i} className="flex items-center justify-between text-xs px-2.5 py-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <span className="text-muted-foreground">{source.name}</span>
                  </div>
                  <span className="font-medium">{formatCurrency(source.value)}</span>
                </div>
              ))}
            </div>
            <div className="border-t mt-3 pt-2 flex justify-between items-center text-sm font-bold px-2.5">
              <span>Total Income</span>
              <span>{formatCurrency(incomeDistribution.reduce((s, d) => s + d.value, 0))}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Expense Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={expenseDistribution} cx="50%" cy="50%" innerRadius={55} outerRadius={95} paddingAngle={3} dataKey="value">
                  {expenseDistribution.map((entry, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v: number) => formatFull(v)} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1 mt-3">
              {expenseDistribution.map((cat, i) => (
                <div key={i} className="flex items-center justify-between text-xs px-2.5 py-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <span className="text-muted-foreground">{cat.name}</span>
                  </div>
                  <span className="font-medium">{formatCurrency(cat.value)}</span>
                </div>
              ))}
            </div>
            <div className="border-t mt-3 pt-2 flex justify-between items-center text-sm font-bold px-2.5">
              <span>Total Expenses</span>
              <span>{formatCurrency(expenseDistribution.reduce((s, d) => s + d.value, 0))}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Project & Event Variance Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Projects — Budget vs Actual</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={projectFinanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" fontSize={10} angle={-15} textAnchor="end" height={50} stroke="hsl(var(--muted-foreground))" />
                <YAxis fontSize={10} tickFormatter={(v) => formatCurrency(v)} stroke="hsl(var(--muted-foreground))" />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="allocated" fill="hsl(30, 80%, 50%)" name="Allocated" radius={[4, 4, 0, 0]} barSize={24} />
                <Bar dataKey="actual" fill="hsl(16, 85%, 35%)" name="Actual" radius={[4, 4, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Events — Budget vs Collections vs Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={eventFinanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" fontSize={10} angle={-15} textAnchor="end" height={50} stroke="hsl(var(--muted-foreground))" />
                <YAxis fontSize={10} tickFormatter={(v) => formatCurrency(v)} stroke="hsl(var(--muted-foreground))" />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="budget" fill="hsl(200, 60%, 50%)" name="Budget" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="collections" fill="hsl(142, 60%, 40%)" name="Collections" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="expenses" fill="hsl(16, 85%, 35%)" name="Expenses" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tabs: Events & Projects Detail */}
      <Tabs defaultValue="events" className="w-full">
        <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
          {[
            { value: "events", label: "Event-wise Finance", icon: CalendarDays },
            { value: "projects", label: "Project-wise Funds", icon: FolderKanban },
          ].map(tab => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:font-medium px-4 py-2.5 text-sm text-muted-foreground gap-1.5"
            >
              <tab.icon className="h-3.5 w-3.5" />{tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="events" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Event</TableHead>
                    <TableHead className="text-xs">Type</TableHead>
                    <TableHead className="text-xs">Status</TableHead>
                    <TableHead className="text-xs text-right">Budget</TableHead>
                    <TableHead className="text-xs text-right">Actual Spend</TableHead>
                    <TableHead className="text-xs text-right">Donations</TableHead>
                    <TableHead className="text-xs text-right">Variance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {eventSummaries.map(e => (
                    <TableRow key={e.eventId}>
                      <TableCell className="font-medium text-sm">{e.eventName}</TableCell>
                      <TableCell><Badge variant="outline" className="text-[10px]">{e.type}</Badge></TableCell>
                      <TableCell>
                        <Badge className={cn("text-[10px] border-0",
                          e.status === "Completed" ? "bg-green-100 text-green-700" :
                          e.status === "Ongoing" ? "bg-blue-100 text-blue-700" :
                          e.status === "Draft" ? "bg-gray-100 text-gray-700" :
                          "bg-amber-100 text-amber-700"
                        )}>{e.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right text-sm">{formatCurrency(e.estimatedBudget)}</TableCell>
                      <TableCell className="text-right text-sm">{formatCurrency(e.actualSpend)}</TableCell>
                      <TableCell className="text-right text-sm">{formatCurrency(e.linkedDonations)}</TableCell>
                      <TableCell className={cn("text-right text-sm font-medium", e.variance >= 0 ? "text-green-600" : "text-red-500")}>
                        {e.variance >= 0 ? "+" : ""}{formatCurrency(Math.abs(e.variance))}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Project</TableHead>
                    <TableHead className="text-xs">Type</TableHead>
                    <TableHead className="text-xs">Status</TableHead>
                    <TableHead className="text-xs text-right">Goal</TableHead>
                    <TableHead className="text-xs text-right">Raised</TableHead>
                    <TableHead className="text-xs text-right">Spent</TableHead>
                    <TableHead className="text-xs text-right">Balance</TableHead>
                    <TableHead className="text-xs text-right">Progress</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projectSummaries.map(p => (
                    <TableRow key={p.projectId}>
                      <TableCell className="font-medium text-sm">{p.projectTitle}</TableCell>
                      <TableCell><Badge variant="outline" className="text-[10px]">{p.type}</Badge></TableCell>
                      <TableCell>
                        <Badge className={cn("text-[10px] border-0",
                          p.status === "Active" ? "bg-blue-100 text-blue-700" :
                          p.status === "Draft" ? "bg-gray-100 text-gray-700" :
                          p.status === "Completed" ? "bg-green-100 text-green-700" :
                          "bg-amber-100 text-amber-700"
                        )}>{p.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right text-sm">{formatCurrency(p.goalAmount)}</TableCell>
                      <TableCell className="text-right text-sm">{formatCurrency(p.raisedAmount)}</TableCell>
                      <TableCell className="text-right text-sm">{formatCurrency(p.spentAmount)}</TableCell>
                      <TableCell className={cn("text-right text-sm font-medium", p.balance >= 0 ? "text-green-600" : "text-red-500")}>
                        {formatCurrency(Math.abs(p.balance))}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Progress value={p.completion} className="h-1.5 w-16" />
                          <span className="text-xs text-muted-foreground">{p.completion}%</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Data Source Attribution */}
      <Card className="bg-muted/30">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            <span className="font-medium text-foreground">Data Sources:</span>
            <div className="flex items-center gap-1.5">
              <Heart className="h-3 w-3" /><span>Donations Module</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CalendarDays className="h-3 w-3" /><span>Events Module</span>
            </div>
            <div className="flex items-center gap-1.5">
              <FolderKanban className="h-3 w-3" /><span>Projects Module</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Landmark className="h-3 w-3" /><span>Finance Ledger</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConsolidatedFinanceDashboard;
