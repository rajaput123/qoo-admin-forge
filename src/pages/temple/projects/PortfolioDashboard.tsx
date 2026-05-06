import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { FolderKanban, TrendingUp, Wallet, AlertTriangle, Heart, Milestone, Clock, CheckCircle2 } from "lucide-react";

const stats = [
  { label: "Active Projects", value: "12", icon: FolderKanban, color: "text-primary", change: "+2 this quarter" },
  { label: "Total Budget", value: "₹18.5 Cr", icon: Wallet, color: "text-green-600", change: "₹12.3 Cr utilized" },
  { label: "At Risk", value: "3", icon: AlertTriangle, color: "text-red-600", change: "Budget or timeline" },
  { label: "Donation-Funded", value: "7", icon: Heart, color: "text-pink-600", change: "₹8.2 Cr mapped" },
];

const activeProjects = [
  { name: "Gopuram Renovation", category: "Renovation", priority: "Critical", progress: 68, budget: "₹4.2 Cr", utilized: 72, status: "Active", risk: "High" },
  { name: "New Annadanam Hall", category: "Construction", priority: "High", progress: 35, budget: "₹6.8 Cr", utilized: 28, status: "Active", risk: "Normal" },
  { name: "Digital Darshan System", category: "Digital", priority: "High", progress: 82, budget: "₹1.2 Cr", utilized: 78, status: "Active", risk: "Normal" },
  { name: "Parking Expansion", category: "Infrastructure", priority: "Medium", progress: 15, budget: "₹2.5 Cr", utilized: 12, status: "Active", risk: "High" },
  { name: "Village Outreach Program", category: "Outreach", priority: "Medium", progress: 55, budget: "₹45 L", utilized: 60, status: "Active", risk: "Normal" },
];

const upcomingMilestones = [
  { project: "Gopuram Renovation", milestone: "Structural Reinforcement Complete", due: "2026-02-28", status: "On Track" },
  { project: "New Annadanam Hall", milestone: "Foundation Approval", due: "2026-03-15", status: "At Risk" },
  { project: "Digital Darshan System", milestone: "Beta Launch", due: "2026-02-20", status: "On Track" },
  { project: "Parking Expansion", milestone: "Land Survey Report", due: "2026-03-01", status: "Delayed" },
];

const PortfolioDashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Portfolio Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Strategic overview of all projects and initiatives</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(s => (
          <Card key={s.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-muted ${s.color}`}><s.icon className="h-5 w-5" /></div>
              <div>
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="text-[10px] text-muted-foreground">{s.change}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Active Projects */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Active Projects</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {activeProjects.map(p => (
                <div key={p.name} className="p-3 rounded-lg border hover:bg-muted/30 cursor-pointer transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{p.name}</span>
                      <Badge variant="outline" className="text-[10px]">{p.category}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      {p.risk === "High" && <Badge variant="destructive" className="text-[10px]">At Risk</Badge>}
                      <Badge variant={p.priority === "Critical" ? "destructive" : "secondary"} className="text-[10px]">{p.priority}</Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-mono">{p.progress}%</span>
                      </div>
                      <Progress value={p.progress} className="h-1.5" />
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-mono">{p.budget}</p>
                      <p className="text-[10px] text-muted-foreground">{p.utilized}% used</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Milestones */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Milestone className="h-4 w-4" /> Upcoming Milestones
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingMilestones.map((m, i) => (
              <div key={i} className="p-3 rounded-lg border space-y-1">
                <p className="text-sm font-medium">{m.milestone}</p>
                <p className="text-xs text-muted-foreground">{m.project}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {m.due}
                  </span>
                  <Badge
                    variant={m.status === "On Track" ? "default" : m.status === "At Risk" ? "secondary" : "destructive"}
                    className="text-[10px]"
                  >
                    {m.status}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Category Distribution */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Projects by Category</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {[
              { cat: "Construction", count: 3, budget: "₹9.2 Cr" },
              { cat: "Renovation", count: 4, budget: "₹5.8 Cr" },
              { cat: "Infrastructure", count: 2, budget: "₹3.1 Cr" },
              { cat: "Digital", count: 2, budget: "₹1.8 Cr" },
              { cat: "Outreach", count: 1, budget: "₹45 L" },
            ].map(c => (
              <div key={c.cat} className="flex items-center justify-between p-2 rounded hover:bg-muted/30">
                <span className="text-sm">{c.cat}</span>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">{c.budget}</span>
                  <Badge variant="outline" className="text-xs">{c.count}</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Timeline Risk Indicators</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {[
              { label: "On Schedule", count: 7, icon: CheckCircle2, color: "text-green-600" },
              { label: "Minor Delay (< 2 weeks)", count: 2, icon: Clock, color: "text-amber-600" },
              { label: "Major Delay (> 2 weeks)", count: 2, icon: AlertTriangle, color: "text-red-600" },
              { label: "On Hold", count: 1, icon: TrendingUp, color: "text-muted-foreground" },
            ].map(r => (
              <div key={r.label} className="flex items-center gap-3 p-2 rounded hover:bg-muted/30">
                <r.icon className={`h-4 w-4 ${r.color}`} />
                <span className="flex-1 text-sm">{r.label}</span>
                <span className="text-lg font-bold">{r.count}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PortfolioDashboard;
