import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, Filter, FileText, Calendar, User, Flag } from "lucide-react";

const projects = [
  { id: "PRJ-001", name: "Gopuram Renovation", category: "Renovation", structure: "Main Gopuram", owner: "Sri Raghav", start: "2025-06-01", target: "2026-12-31", priority: "Critical", status: "Active", description: "Complete restoration of the 400-year-old main gopuram including structural reinforcement and gold plating" },
  { id: "PRJ-002", name: "New Annadanam Hall", category: "Construction", structure: "South Campus", owner: "Sri Venkat", start: "2025-09-15", target: "2027-03-31", priority: "High", status: "Active", description: "Construction of a 5000-capacity Annadanam hall with modern kitchen facilities" },
  { id: "PRJ-003", name: "Digital Darshan System", category: "Digital", structure: "Main Temple", owner: "Sri Karthik", start: "2025-11-01", target: "2026-06-30", priority: "High", status: "Active", description: "Digital darshan booking, QR-based entry, and live streaming infrastructure" },
  { id: "PRJ-004", name: "Parking Expansion Phase 2", category: "Infrastructure", structure: "East Gate", owner: "Sri Mohan", start: "2026-01-15", target: "2027-06-30", priority: "Medium", status: "Pending Approval", description: "Multi-level parking facility with 2000 car and 5000 two-wheeler capacity" },
  { id: "PRJ-005", name: "Village Outreach Program", category: "Outreach", structure: "—", owner: "Smt. Lakshmi", start: "2025-04-01", target: "2026-03-31", priority: "Medium", status: "Active", description: "Education and welfare initiatives across 50 surrounding villages" },
  { id: "PRJ-006", name: "Heritage Museum Setup", category: "Construction", structure: "West Wing", owner: "Sri Suresh", start: "2026-03-01", target: "2027-12-31", priority: "Low", status: "Planned", description: "Interactive heritage museum showcasing temple history and artifacts" },
];

const statusColors: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  Active: "default",
  "Pending Approval": "secondary",
  Planned: "outline",
  "On Hold": "destructive",
  Completed: "default",
  Cancelled: "destructive",
};

const priorityColors: Record<string, "destructive" | "secondary" | "outline"> = {
  Critical: "destructive",
  High: "secondary",
  Medium: "outline",
  Low: "outline",
};

const ProjectMaster = () => {
  const [showCreate, setShowCreate] = useState(false);
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Project Master</h1>
          <p className="text-sm text-muted-foreground mt-1">Create and manage strategic temple projects and initiatives</p>
        </div>
        <Dialog open={showCreate} onOpenChange={setShowCreate}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2"><Plus className="h-4 w-4" /> New Project</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader><DialogTitle>Create New Project</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5"><Label>Project Name</Label><Input placeholder="e.g., Temple Renovation Phase 3" /></div>
                <div className="space-y-1.5"><Label>Category</Label>
                  <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="construction">Construction</SelectItem>
                      <SelectItem value="renovation">Renovation</SelectItem>
                      <SelectItem value="infrastructure">Infrastructure</SelectItem>
                      <SelectItem value="digital">Digital</SelectItem>
                      <SelectItem value="outreach">Outreach</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5"><Label>Linked Structure</Label>
                  <Select><SelectTrigger><SelectValue placeholder="Select (optional)" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="main">Main Temple</SelectItem>
                      <SelectItem value="gopuram">Main Gopuram</SelectItem>
                      <SelectItem value="south">South Campus</SelectItem>
                      <SelectItem value="east">East Gate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5"><Label>Project Owner</Label><Input placeholder="Name" /></div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5"><Label>Start Date</Label><Input type="date" /></div>
                <div className="space-y-1.5"><Label>Target Completion</Label><Input type="date" /></div>
                <div className="space-y-1.5"><Label>Priority</Label>
                  <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-1.5"><Label>Description</Label><Textarea rows={3} placeholder="Project objectives and scope..." /></div>
              <Button className="w-full" onClick={() => setShowCreate(false)}>Create Project</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search projects..." className="pl-9" />
        </div>
        <Select><SelectTrigger className="w-40"><SelectValue placeholder="All Statuses" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="pending">Pending Approval</SelectItem>
            <SelectItem value="planned">Planned</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
        <Select><SelectTrigger className="w-40"><SelectValue placeholder="All Categories" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="construction">Construction</SelectItem>
            <SelectItem value="renovation">Renovation</SelectItem>
            <SelectItem value="infrastructure">Infrastructure</SelectItem>
            <SelectItem value="digital">Digital</SelectItem>
            <SelectItem value="outreach">Outreach</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Project Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Timeline</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map(p => (
                <TableRow key={p.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setSelectedProject(p)}>
                  <TableCell>
                    <div><p className="font-medium">{p.name}</p><p className="text-xs text-muted-foreground font-mono">{p.id}</p></div>
                  </TableCell>
                  <TableCell><Badge variant="outline" className="text-xs">{p.category}</Badge></TableCell>
                  <TableCell className="text-sm">{p.owner}</TableCell>
                  <TableCell>
                    <div className="text-xs">
                      <p>{p.start}</p>
                      <p className="text-muted-foreground">→ {p.target}</p>
                    </div>
                  </TableCell>
                  <TableCell><Badge variant={priorityColors[p.priority]} className="text-xs">{p.priority}</Badge></TableCell>
                  <TableCell><Badge variant={statusColors[p.status]} className="text-xs">{p.status}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Detail Modal */}
      <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>{selectedProject?.name}</DialogTitle></DialogHeader>
          {selectedProject && (
            <Tabs defaultValue="overview" className="mt-2">
              <TabsList><TabsTrigger value="overview">Overview</TabsTrigger><TabsTrigger value="details">Details</TabsTrigger><TabsTrigger value="history">History</TabsTrigger></TabsList>
              <TabsContent value="overview" className="space-y-4 pt-3">
                <div className="flex gap-2">
                  <Badge variant={statusColors[selectedProject.status]}>{selectedProject.status}</Badge>
                  <Badge variant={priorityColors[selectedProject.priority]}>{selectedProject.priority}</Badge>
                  <Badge variant="outline">{selectedProject.category}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{selectedProject.description}</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2"><User className="h-4 w-4 text-muted-foreground" /><span>Owner: {selectedProject.owner}</span></div>
                  <div className="flex items-center gap-2"><FileText className="h-4 w-4 text-muted-foreground" /><span>Structure: {selectedProject.structure}</span></div>
                  <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-muted-foreground" /><span>Start: {selectedProject.start}</span></div>
                  <div className="flex items-center gap-2"><Flag className="h-4 w-4 text-muted-foreground" /><span>Target: {selectedProject.target}</span></div>
                </div>
              </TabsContent>
              <TabsContent value="details" className="pt-3">
                <p className="text-sm text-muted-foreground">Detailed project information, linked milestones, and budget allocation would appear here.</p>
              </TabsContent>
              <TabsContent value="history" className="pt-3">
                <p className="text-sm text-muted-foreground">Audit trail of all project changes, approvals, and status transitions.</p>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectMaster;
