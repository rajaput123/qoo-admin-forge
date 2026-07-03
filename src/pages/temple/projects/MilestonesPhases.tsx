import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Lock, Milestone, Calendar, User, CheckCircle2, Clock, AlertTriangle, ChevronRight } from "lucide-react";

const projects = [
  { id: "PRJ-001", name: "Gopuram Renovation" },
  { id: "PRJ-002", name: "New Annadanam Hall" },
  { id: "PRJ-003", name: "Digital Darshan System" },
];

const phases = [
  { id: "PH-001", name: "Site Assessment & Planning", project: "PRJ-001", start: "2025-06-01", end: "2025-08-31", responsible: "Sri Raghav", tasks: 12, completed: 12, budget: "₹15 L", progress: 100, status: "Completed", locked: true },
  { id: "PH-002", name: "Structural Reinforcement", project: "PRJ-001", start: "2025-09-01", end: "2026-02-28", responsible: "Sri Mohan", tasks: 24, completed: 18, budget: "₹1.2 Cr", progress: 68, status: "In Progress", locked: false },
  { id: "PH-003", name: "Stone & Sculpture Work", project: "PRJ-001", start: "2026-03-01", end: "2026-08-31", responsible: "Sri Suresh", tasks: 18, completed: 0, budget: "₹1.8 Cr", progress: 0, status: "Planned", locked: false },
  { id: "PH-004", name: "Gold Plating & Finishing", project: "PRJ-001", start: "2026-09-01", end: "2026-12-31", responsible: "Sri Raghav", tasks: 8, completed: 0, budget: "₹1.2 Cr", progress: 0, status: "Planned", locked: false },
];

const statusIcon = (status: string) => {
  if (status === "Completed") return <CheckCircle2 className="h-4 w-4 text-green-600" />;
  if (status === "In Progress") return <Clock className="h-4 w-4 text-amber-600" />;
  return <AlertTriangle className="h-4 w-4 text-muted-foreground" />;
};

const MilestonesPhases = () => {
  const [selectedPhase, setSelectedPhase] = useState<typeof phases[0] | null>(null);
  const [selectedProject, setSelectedProject] = useState("PRJ-001");

  const filtered = phases.filter(p => p.project === selectedProject);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Milestones & Phases</h1>
          <p className="text-sm text-muted-foreground mt-1">Sequential phase tracking with dependency management</p>
        </div>
        <Select value={selectedProject} onValueChange={setSelectedProject}>
          <SelectTrigger className="w-56"><SelectValue /></SelectTrigger>
          <SelectContent>
            {projects.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Phase Timeline */}
      <div className="space-y-1">
        {filtered.map((phase, i) => (
          <div key={phase.id} className="flex items-stretch gap-4">
            {/* Timeline connector */}
            <div className="flex flex-col items-center w-8">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${phase.status === "Completed" ? "bg-green-100 text-green-700" : phase.status === "In Progress" ? "bg-amber-100 text-amber-700" : "bg-muted text-muted-foreground"}`}>
                {phase.locked ? <Lock className="h-3.5 w-3.5" /> : statusIcon(phase.status)}
              </div>
              {i < filtered.length - 1 && <div className="w-0.5 flex-1 bg-border my-1" />}
            </div>

            {/* Phase Card */}
            <Card className="flex-1 mb-3 cursor-pointer hover:border-primary/30 transition-colors" onClick={() => setSelectedPhase(phase)}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{phase.name}</span>
                    {phase.locked && <Badge variant="outline" className="text-[10px] gap-1"><Lock className="h-2.5 w-2.5" /> Locked</Badge>}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={phase.status === "Completed" ? "default" : phase.status === "In Progress" ? "secondary" : "outline"} className="text-[10px]">
                      {phase.status}
                    </Badge>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {phase.start} → {phase.end}</div>
                  <div className="flex items-center gap-1"><User className="h-3 w-3" /> {phase.responsible}</div>
                  <div className="flex items-center gap-1"><Milestone className="h-3 w-3" /> {phase.completed}/{phase.tasks} tasks</div>
                  <div className="font-mono">{phase.budget}</div>
                </div>
                <div className="mt-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-mono">{phase.progress}%</span>
                  </div>
                  <Progress value={phase.progress} className="h-1.5" />
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {/* Phase Detail Modal */}
      <Dialog open={!!selectedPhase} onOpenChange={() => setSelectedPhase(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{selectedPhase?.name}</DialogTitle></DialogHeader>
          {selectedPhase && (
            <Tabs defaultValue="overview">
              <TabsList><TabsTrigger value="overview">Overview</TabsTrigger><TabsTrigger value="tasks">Tasks</TabsTrigger></TabsList>
              <TabsContent value="overview" className="space-y-3 pt-3">
                <div className="flex gap-2">
                  <Badge variant={selectedPhase.status === "Completed" ? "default" : "secondary"}>{selectedPhase.status}</Badge>
                  {selectedPhase.locked && <Badge variant="outline"><Lock className="h-3 w-3 mr-1" /> Locked</Badge>}
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-muted-foreground">Start:</span> {selectedPhase.start}</div>
                  <div><span className="text-muted-foreground">End:</span> {selectedPhase.end}</div>
                  <div><span className="text-muted-foreground">Responsible:</span> {selectedPhase.responsible}</div>
                  <div><span className="text-muted-foreground">Budget:</span> {selectedPhase.budget}</div>
                </div>
                <Progress value={selectedPhase.progress} className="h-2" />
                <p className="text-xs text-muted-foreground">{selectedPhase.completed} of {selectedPhase.tasks} tasks completed</p>
                {selectedPhase.locked && (
                  <div className="p-3 rounded-lg bg-muted text-xs text-muted-foreground">
                    This milestone is locked. Reopening requires admin override with audit logging.
                  </div>
                )}
              </TabsContent>
              <TabsContent value="tasks" className="pt-3">
                <p className="text-sm text-muted-foreground">Linked tasks from Task Management module would display here.</p>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MilestonesPhases;
