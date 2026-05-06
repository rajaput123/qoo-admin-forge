import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, Activity, TrendingUp, TrendingDown, Users, Heart, IndianRupee, Calendar, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

type DevoteeEngagement = {
  id: string;
  name: string;
  phone: string;
  totalSevas: number;
  totalDarshans: number;
  totalDonations: number;
  volunteerHours: number;
  lastVisit: string;
  level: string;
  trend: string;
};

const engagementData: DevoteeEngagement[] = [
  { id: "DEV-0001", name: "Ramesh Kumar", phone: "+91 98765 43210", totalSevas: 28, totalDarshans: 48, totalDonations: 125000, volunteerHours: 0, lastVisit: "2026-02-09", level: "Highly Active", trend: "up" },
  { id: "DEV-0002", name: "Lakshmi Devi", phone: "+91 87654 32109", totalSevas: 42, totalDarshans: 62, totalDonations: 85000, volunteerHours: 96, lastVisit: "2026-02-08", level: "Highly Active", trend: "up" },
  { id: "DEV-0006", name: "Meena Iyer", phone: "+91 43210 98765", totalSevas: 45, totalDarshans: 86, totalDonations: 32000, volunteerHours: 0, lastVisit: "2026-02-09", level: "Highly Active", trend: "up" },
  { id: "DEV-0007", name: "Vijay Nair", phone: "+91 32109 87654", totalSevas: 38, totalDarshans: 72, totalDonations: 18000, volunteerHours: 120, lastVisit: "2026-02-08", level: "Highly Active", trend: "stable" },
  { id: "DEV-0003", name: "Suresh Reddy", phone: "+91 76543 21098", totalSevas: 18, totalDarshans: 35, totalDonations: 65000, volunteerHours: 0, lastVisit: "2026-02-01", level: "Active", trend: "stable" },
  { id: "DEV-0005", name: "Anand Verma", phone: "+91 54321 09876", totalSevas: 22, totalDarshans: 41, totalDonations: 48000, volunteerHours: 64, lastVisit: "2026-02-08", level: "Active", trend: "up" },
  { id: "DEV-0008", name: "Kavita Rao", phone: "+91 21098 76543", totalSevas: 31, totalDarshans: 55, totalDonations: 12000, volunteerHours: 0, lastVisit: "2026-02-07", level: "Active", trend: "stable" },
  { id: "DEV-0004", name: "Priya Sharma", phone: "+91 65432 10987", totalSevas: 12, totalDarshans: 29, totalDonations: 52000, volunteerHours: 0, lastVisit: "2026-01-15", level: "Occasional", trend: "down" },
  { id: "DEV-0009", name: "Ganesh Pillai", phone: "+91 10987 65432", totalSevas: 8, totalDarshans: 12, totalDonations: 5000, volunteerHours: 0, lastVisit: "2025-12-20", level: "Occasional", trend: "down" },
  { id: "DEV-0010", name: "Arjun Menon", phone: "+91 09876 54321", totalSevas: 2, totalDarshans: 4, totalDonations: 1000, volunteerHours: 0, lastVisit: "2025-10-05", level: "Inactive", trend: "down" },
];

const levelDistribution = [
  { name: "Highly Active", value: 4, color: "hsl(142, 71%, 45%)" },
  { name: "Active", value: 3, color: "hsl(217, 91%, 60%)" },
  { name: "Occasional", value: 2, color: "hsl(38, 92%, 50%)" },
  { name: "Inactive", value: 1, color: "hsl(0, 0%, 75%)" },
];

const monthlyActivity = [
  { month: "Sep", sevas: 85, darshans: 180 },
  { month: "Oct", sevas: 92, darshans: 195 },
  { month: "Nov", sevas: 110, darshans: 240 },
  { month: "Dec", sevas: 130, darshans: 280 },
  { month: "Jan", sevas: 105, darshans: 220 },
  { month: "Feb", sevas: 78, darshans: 165 },
];

const levelColor = (level: string) => {
  if (level === "Highly Active") return "text-green-700 border-green-300 bg-green-50";
  if (level === "Active") return "text-blue-700 border-blue-300 bg-blue-50";
  if (level === "Occasional") return "text-amber-700 border-amber-300 bg-amber-50";
  return "text-muted-foreground border-border bg-muted";
};

const ITEMS_PER_PAGE = 8;

const Engagement = () => {
  const [search, setSearch] = useState("");
  const [filterLevel, setFilterLevel] = useState("all");
  const [viewing, setViewing] = useState<DevoteeEngagement | null>(null);
  const [page, setPage] = useState(1);

  const filtered = engagementData.filter(d => {
    if (search && !d.name.toLowerCase().includes(search.toLowerCase()) && !d.phone.includes(search)) return false;
    if (filterLevel !== "all" && d.level !== filterLevel) return false;
    return true;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paged = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <div className="p-4 space-y-4 w-full overflow-x-hidden max-w-[100vw]">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">Engagement Tracking</h1>
          <p className="text-muted-foreground">Monitor devotee participation and engagement levels</p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Highly Active", value: engagementData.filter(d => d.level === "Highly Active").length.toString(), icon: TrendingUp },
            { label: "Active", value: engagementData.filter(d => d.level === "Active").length.toString(), icon: Activity },
            { label: "Occasional", value: engagementData.filter(d => d.level === "Occasional").length.toString(), icon: Users },
            { label: "Inactive", value: engagementData.filter(d => d.level === "Inactive").length.toString(), icon: TrendingDown },
          ].map((kpi, i) => (
            <Card key={i} className="group hover:shadow-md transition-all duration-200">
              <CardContent className="p-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-muted group-hover:bg-primary group-hover:shadow-lg transition-all duration-200 mb-2">
                  <kpi.icon className="h-5 w-5 text-muted-foreground group-hover:text-primary-foreground transition-colors duration-200" />
                </div>
                <p className="text-xl font-bold">{kpi.value}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{kpi.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card className="lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2"><Activity className="h-4 w-4 text-primary" />Monthly Activity Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={monthlyActivity}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 90%)" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="sevas" fill="hsl(16, 85%, 23%)" radius={[3, 3, 0, 0]} name="Sevas" />
                  <Bar dataKey="darshans" fill="hsl(217, 91%, 60%)" radius={[3, 3, 0, 0]} name="Darshans" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Engagement Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={170}>
                <PieChart>
                  <Pie data={levelDistribution} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {levelDistribution.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-2 justify-center mt-2">
                {levelDistribution.map(l => (
                  <div key={l.name} className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: l.color }} />
                    <span className="text-[10px] text-muted-foreground">{l.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search devotee..." className="pl-9" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
          </div>
          <Select value={filterLevel} onValueChange={v => { setFilterLevel(v); setPage(1); }}>
            <SelectTrigger className="w-[160px] bg-background"><SelectValue placeholder="Level" /></SelectTrigger>
            <SelectContent className="bg-popover">
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="Highly Active">Highly Active</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Occasional">Occasional</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <Badge variant="secondary" className="ml-auto">{filtered.length} devotees</Badge>
        </div>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Devotee</TableHead>
                  <TableHead className="text-center">Activity</TableHead>
                  <TableHead className="text-right">Donations</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead className="text-center w-[80px]">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paged.map(d => (
                  <TableRow key={d.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setViewing(d)}>
                    <TableCell>
                      <p className="font-medium text-sm">{d.name}</p>
                      <p className="text-xs text-muted-foreground">{d.id}</p>
                    </TableCell>
                    <TableCell className="text-center">
                      <p className="font-medium text-sm">{d.totalSevas + d.totalDarshans}</p>
                      <p className="text-[10px] text-muted-foreground">{d.totalSevas}S + {d.totalDarshans}D</p>
                    </TableCell>
                    <TableCell className="text-right font-medium text-sm">₹{d.totalDonations.toLocaleString()}</TableCell>
                    <TableCell><Badge variant="outline" className={`text-[10px] ${levelColor(d.level)}`}>{d.level}</Badge></TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          setViewing(d);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">Showing {(page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(page * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}</p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="h-8 w-8" disabled={page === 1} onClick={() => setPage(p => p - 1)}><ChevronLeft className="h-4 w-4" /></Button>
              {Array.from({ length: totalPages }, (_, i) => (
                <Button key={i} variant={page === i + 1 ? "default" : "outline"} size="icon" className="h-8 w-8" onClick={() => setPage(i + 1)}>{i + 1}</Button>
              ))}
              <Button variant="outline" size="icon" className="h-8 w-8" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}><ChevronRight className="h-4 w-4" /></Button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Detail Dialog */}
      <Dialog open={!!viewing} onOpenChange={() => setViewing(null)}>
        <DialogContent className="sm:max-w-[550px] bg-background">
          <DialogHeader>
            <DialogTitle>{viewing?.name}</DialogTitle>
            <DialogDescription>{viewing?.id} · {viewing?.phone}</DialogDescription>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {[
                ["Total Sevas", viewing?.totalSevas, Heart],
                ["Total Darshans", viewing?.totalDarshans, Calendar],
                ["Donations", `₹${viewing?.totalDonations.toLocaleString()}`, IndianRupee],
                ["Volunteer Hours", viewing?.volunteerHours ? `${viewing.volunteerHours}h` : "—", Users],
              ].map(([label, value, Icon]) => {
                const IconComponent = Icon as React.ComponentType<{ className?: string }>;
                return (
                  <div key={label as string} className="p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-1.5 mb-1"><IconComponent className="h-3.5 w-3.5 text-muted-foreground" /><p className="text-xs text-muted-foreground">{label as string}</p></div>
                    <p className="font-bold text-lg">{String(value)}</p>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="text-xs text-muted-foreground">Engagement Level</p>
                <Badge variant="outline" className={`mt-1 ${levelColor(viewing?.level || "")}`}>{viewing?.level}</Badge>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Last Visit</p>
                <p className="font-medium text-sm mt-1">{viewing?.lastVisit}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Trend</p>
                <div className="mt-1">{viewing?.trend === "up" ? <Badge variant="outline" className="text-green-700 border-green-300 bg-green-50 text-[10px]">↑ Rising</Badge> : viewing?.trend === "down" ? <Badge variant="outline" className="text-red-700 border-red-300 bg-red-50 text-[10px]">↓ Declining</Badge> : <Badge variant="outline" className="text-[10px]">— Stable</Badge>}</div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Engagement;
