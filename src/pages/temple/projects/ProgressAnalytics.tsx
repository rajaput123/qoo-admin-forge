import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TrendingUp, AlertTriangle, Clock, CheckCircle2, ArrowUpRight, ArrowDownRight } from "lucide-react";

const projects = [
  { name: "Gopuram Renovation", completion: 68, budgetUsed: 72, timelineVariance: -5, delayDays: 0, riskIndex: 3.2, priority: "Critical", flag: null },
  { name: "New Annadanam Hall", completion: 35, budgetUsed: 28, timelineVariance: 2, delayDays: 8, riskIndex: 2.1, priority: "High", flag: "Minor Delay" },
  { name: "Digital Darshan System", completion: 82, budgetUsed: 78, timelineVariance: -3, delayDays: 0, riskIndex: 1.5, priority: "High", flag: null },
  { name: "Parking Expansion", completion: 15, budgetUsed: 12, timelineVariance: 0, delayDays: 22, riskIndex: 4.8, priority: "Medium", flag: "Major Delay" },
  { name: "Village Outreach", completion: 55, budgetUsed: 60, timelineVariance: 8, delayDays: 0, riskIndex: 2.8, priority: "Medium", flag: "Over Budget" },
  { name: "Heritage Museum", completion: 3, budgetUsed: 3, timelineVariance: 0, delayDays: 0, riskIndex: 1.0, priority: "Low", flag: null },
];

const summaryStats = [
  { label: "Avg Completion", value: "43%", icon: TrendingUp, color: "text-primary" },
  { label: "Delayed Projects", value: "2", icon: Clock, color: "text-amber-600" },
  { label: "Over-Budget", value: "1", icon: AlertTriangle, color: "text-red-600" },
  { label: "On Track", value: "3", icon: CheckCircle2, color: "text-green-600" },
];

const ProgressAnalytics = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Progress Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">Performance metrics, flags, and priority-based project tracking</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {summaryStats.map(s => (
          <Card key={s.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-muted ${s.color}`}><s.icon className="h-5 w-5" /></div>
              <div>
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-base">Project Performance Matrix</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Completion</TableHead>
                <TableHead>Budget Used</TableHead>
                <TableHead>Timeline Var.</TableHead>
                <TableHead className="text-right">Delay</TableHead>
                <TableHead className="text-right">Risk Index</TableHead>
                <TableHead>Flag</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map(p => (
                <TableRow key={p.name} className="cursor-pointer hover:bg-muted/50">
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell>
                    <Badge variant={p.priority === "Critical" ? "destructive" : p.priority === "High" ? "secondary" : "outline"} className="text-[10px]">{p.priority}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="w-24">
                      <div className="flex justify-between text-xs mb-1">
                        <span>{p.completion}%</span>
                      </div>
                      <Progress value={p.completion} className="h-1.5" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="w-24">
                      <div className="flex justify-between text-xs mb-1">
                        <span className={p.budgetUsed > p.completion + 10 ? "text-red-600" : "text-muted-foreground"}>{p.budgetUsed}%</span>
                      </div>
                      <Progress value={p.budgetUsed} className="h-1.5" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {p.timelineVariance > 0 ? (
                        <><ArrowUpRight className="h-3.5 w-3.5 text-red-600" /><span className="text-xs text-red-600">+{p.timelineVariance}%</span></>
                      ) : p.timelineVariance < 0 ? (
                        <><ArrowDownRight className="h-3.5 w-3.5 text-green-600" /><span className="text-xs text-green-600">{p.timelineVariance}%</span></>
                      ) : (
                        <span className="text-xs text-muted-foreground">0%</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm">{p.delayDays > 0 ? `${p.delayDays}d` : "—"}</TableCell>
                  <TableCell className="text-right">
                    <span className={`font-mono text-sm ${p.riskIndex >= 4 ? "text-red-600" : p.riskIndex >= 3 ? "text-amber-600" : "text-green-600"}`}>
                      {p.riskIndex.toFixed(1)}
                    </span>
                  </TableCell>
                  <TableCell>
                    {p.flag ? (
                      <Badge variant={p.flag.includes("Major") || p.flag.includes("Over") ? "destructive" : "secondary"} className="text-[10px]">
                        {p.flag}
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-[10px]">On Track</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-base">System Rules</CardTitle></CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-3 text-sm text-muted-foreground">
            <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800">
              <p className="font-medium mb-1">Delayed Projects</p>
              <p>Automatically flagged when actual timeline exceeds target by &gt;7 days</p>
            </div>
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-800">
              <p className="font-medium mb-1">Budget Overrun</p>
              <p>Flagged when budget utilization exceeds completion % by &gt;10 points</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-blue-800">
              <p className="font-medium mb-1">Priority Sorting</p>
              <p>Critical → High → Medium → Low, with risk index as secondary sort</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgressAnalytics;
