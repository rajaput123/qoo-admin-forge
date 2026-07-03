import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Link2, CheckCircle2, Clock, AlertCircle, ListChecks } from "lucide-react";

const projects = [
  { id: "PRJ-001", name: "Gopuram Renovation" },
  { id: "PRJ-002", name: "New Annadanam Hall" },
  { id: "PRJ-003", name: "Digital Darshan System" },
];

const tasks = [
  { id: "TSK-041", title: "Scaffolding installation for east face", phase: "Structural Reinforcement", assignee: "Maintenance Team", status: "Completed", priority: "High", due: "2026-01-15" },
  { id: "TSK-042", title: "Load-bearing column inspection", phase: "Structural Reinforcement", assignee: "Sri Engineer Mohan", status: "Completed", priority: "Critical", due: "2026-01-20" },
  { id: "TSK-043", title: "Cement and steel procurement (Phase 2)", phase: "Structural Reinforcement", assignee: "Procurement Team", status: "In Progress", priority: "High", due: "2026-02-15" },
  { id: "TSK-044", title: "North wall reinforcement work", phase: "Structural Reinforcement", assignee: "Construction Team A", status: "In Progress", priority: "High", due: "2026-02-28" },
  { id: "TSK-045", title: "Electrical rerouting for scaffold area", phase: "Structural Reinforcement", assignee: "Electrician Team", status: "Open", priority: "Medium", due: "2026-03-05" },
  { id: "TSK-046", title: "Safety audit for reinforced sections", phase: "Structural Reinforcement", assignee: "Safety Officer", status: "Open", priority: "Critical", due: "2026-03-10" },
];

const phaseStats = [
  { phase: "Site Assessment & Planning", total: 12, completed: 12, progress: 100 },
  { phase: "Structural Reinforcement", total: 24, completed: 18, progress: 75 },
  { phase: "Stone & Sculpture Work", total: 18, completed: 0, progress: 0 },
  { phase: "Gold Plating & Finishing", total: 8, completed: 0, progress: 0 },
];

const statusColors: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  Completed: "default",
  "In Progress": "secondary",
  Open: "outline",
  Blocked: "destructive",
};

const TaskIntegration = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Task Integration</h1>
          <p className="text-sm text-muted-foreground mt-1">Linked operational tasks synced with Task Management module</p>
        </div>
        <Select defaultValue="PRJ-001">
          <SelectTrigger className="w-56"><SelectValue /></SelectTrigger>
          <SelectContent>
            {projects.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Phase Progress Summary */}
      <div className="grid md:grid-cols-2 gap-4">
        {phaseStats.map(ps => (
          <Card key={ps.phase}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{ps.phase}</span>
                <Badge variant={ps.progress === 100 ? "default" : ps.progress > 0 ? "secondary" : "outline"} className="text-[10px]">
                  {ps.completed}/{ps.total}
                </Badge>
              </div>
              <Progress value={ps.progress} className="h-1.5" />
              <p className="text-xs text-muted-foreground mt-1">{ps.progress}% complete</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Task List */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <ListChecks className="h-4 w-4" /> Active Phase Tasks — Structural Reinforcement
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task</TableHead>
                <TableHead>Assignee</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map(t => (
                <TableRow key={t.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell>
                    <div>
                      <p className="font-medium text-sm">{t.title}</p>
                      <p className="text-xs text-muted-foreground font-mono">{t.id}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{t.assignee}</TableCell>
                  <TableCell>
                    <Badge variant={t.priority === "Critical" ? "destructive" : t.priority === "High" ? "secondary" : "outline"} className="text-[10px]">{t.priority}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{t.due}</TableCell>
                  <TableCell>
                    <Badge variant={statusColors[t.status]} className="text-[10px] gap-1">
                      {t.status === "Completed" && <CheckCircle2 className="h-3 w-3" />}
                      {t.status === "In Progress" && <Clock className="h-3 w-3" />}
                      {t.status === "Open" && <AlertCircle className="h-3 w-3" />}
                      {t.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link2 className="h-4 w-4" />
            <span>Task completion automatically updates milestone progress. Tasks are managed through the Task Management module.</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskIntegration;
