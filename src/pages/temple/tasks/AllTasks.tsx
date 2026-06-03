import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search, List, LayoutGrid, Zap, Link2, ArrowLeft, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CustomFieldsSection, { CustomField } from "@/components/CustomFieldsSection";
import SelectWithAddNew from "@/components/SelectWithAddNew";
import type { LinkedModule, Task, TaskPriority, TaskStatus, TaskType } from "@/modules/tasks/types";
import { taskActions, taskSelectors, useCurrentUser, useTasks } from "@/modules/tasks/hooks";
import { isAfter, isBefore, parseISO } from "date-fns";

const priorityColor: Record<string, string> = { Critical: "bg-red-50 text-red-700 border-red-200", High: "bg-orange-50 text-orange-700 border-orange-200", Medium: "bg-amber-50 text-amber-700 border-amber-200", Low: "bg-green-50 text-green-700 border-green-200" };
const statusColor: Record<string, string> = { Pending: "bg-blue-50 text-blue-700 border-blue-200", "In Progress": "bg-amber-50 text-amber-700 border-amber-200", Blocked: "bg-red-50 text-red-700 border-red-200", Completed: "bg-green-50 text-green-700 border-green-200", Cancelled: "bg-muted text-muted-foreground" };

const kanbanStatuses: TaskStatus[] = ["Pending", "In Progress", "Blocked", "Completed"];

const taskTypes: TaskType[] = ["Manual", "Purchase", "Inventory", "Event", "Kitchen", "Assignment", "HR", "System"];
const modules: LinkedModule[] = ["Manual", "Inventory", "Purchase", "Event", "Kitchen", "Assignment", "HR", "System", "ScheduledTemplate"];
const priorities: TaskPriority[] = ["Low", "Medium", "High", "Critical"];
const statuses: TaskStatus[] = ["Pending", "In Progress", "Blocked", "Completed", "Cancelled"];

const AllTasks = () => {
  const tasksAll = useTasks();
  const user = useCurrentUser();
  const tasks = tasksAll.filter((t) => taskSelectors.canViewTask(user, t));

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [moduleFilter, setModuleFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [assigneeFilter, setAssigneeFilter] = useState("all");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [viewMode, setViewMode] = useState<"table" | "kanban">("table");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [perPage, setPerPage] = useState(25);

  const filtered = tasks.filter(t => {
    const ms =
      !search ||
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.taskId.toLowerCase().includes(search.toLowerCase()) ||
      t.assignedTo.toLowerCase().includes(search.toLowerCase());
    const mst = statusFilter === "all" || t.status === statusFilter;
    const mp = priorityFilter === "all" || t.priority === priorityFilter;
    const mm = moduleFilter === "all" || t.linkedModule === moduleFilter;
    const mt = typeFilter === "all" || t.type === typeFilter;
    const ma = assigneeFilter === "all" || t.assignedTo === assigneeFilter;

    const fromOk = !fromDate || !isBefore(parseISO(t.dueDate), parseISO(fromDate));
    const toOk = !toDate || !isAfter(parseISO(t.dueDate), parseISO(toDate));

    return ms && mst && mp && mm && mt && ma && fromOk && toOk;
  });

  const assignees = [...new Set(tasks.map((t) => t.assignedTo))].sort();

  // Inline detail view
  if (selectedTask) {
    const t = selectedTask;
    const overdue = taskSelectors.isTaskOverdue(t, new Date());
    const linked = `${t.linkedModule} · ${t.linkedId}`;

    return (
      <div className="p-6 space-y-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => setSelectedTask(null)}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-semibold tracking-tight">{t.taskId}</h1>
                  <Badge variant="outline" className={statusColor[t.status]}>{t.status}</Badge>
                  {t.isAutoGenerated && <Badge variant="secondary" className="gap-1"><Zap className="h-3 w-3" />Auto-generated</Badge>}
                </div>
                <p className="text-muted-foreground text-sm mt-1">{t.title}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2"><Edit className="h-4 w-4" />Edit</Button>
              <Button variant="outline" size="sm" onClick={() => {
                const newStatus = t.status === "Completed" ? "Pending" : "Completed";
                taskActions.updateTaskStatus(t.taskId, newStatus);
                setSelectedTask({ ...t, status: newStatus });
              }}>
                {t.status === "Completed" ? "Reopen" : "Mark Complete"}
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="details" className="space-y-4">
            <div className="border-b border-border">
              <TabsList className="w-full justify-start border-b-0 rounded-none h-auto p-0 bg-transparent gap-0">
                <TabsTrigger value="details" className="rounded-none border-b-2 border-transparent data-[state=active]:border-amber-700 data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:font-medium px-4 py-2 text-sm text-muted-foreground">
                  Task Details
                </TabsTrigger>
                <TabsTrigger value="linked" className="rounded-none border-b-2 border-transparent data-[state=active]:border-amber-700 data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:font-medium px-4 py-2 text-sm text-muted-foreground">
                  Linked Module Info
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="details" className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Basic Information</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-8 text-sm">
                  <div><span className="text-muted-foreground">Type:</span> <span className="ml-2"><Badge variant="outline" className="text-xs">{t.type}</Badge></span></div>
                  <div><span className="text-muted-foreground">Priority:</span> <span className="ml-2"><Badge variant="outline" className={`text-xs ${priorityColor[t.priority]}`}>{t.priority}</Badge></span></div>
                  <div><span className="text-muted-foreground">Status:</span> <span className="ml-2"><Badge variant="outline" className={`text-xs ${statusColor[t.status]}`}>{t.status}</Badge></span></div>
                  <div><span className="text-muted-foreground">Due Date:</span> <span className={`ml-2 font-medium ${overdue ? 'text-destructive' : ''}`}>{t.dueDate}</span></div>
                  <div><span className="text-muted-foreground">Auto-generated:</span> <span className="ml-2">{t.isAutoGenerated ? "Yes" : "No"}</span></div>
                </div>
              </div>
              <hr className="border-border" />
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Assignment</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-8 text-sm">
                  <div><span className="text-muted-foreground">Assigned To:</span> <span className="ml-2 font-medium">{t.assignedTo}</span></div>
                  <div><span className="text-muted-foreground">Assigned By:</span> <span className="ml-2 font-medium">{t.assignedBy}</span></div>
                </div>
              </div>
              <hr className="border-border" />
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Description</h3>
                <p className="text-sm text-muted-foreground">{t.description || "No description provided."}</p>
              </div>
            </TabsContent>

            <TabsContent value="linked" className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Linked Module Information</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-8 text-sm">
                  <div><span className="text-muted-foreground">Module:</span> <span className="ml-2"><Badge variant="outline" className="text-xs">{t.linkedModule}</Badge></span></div>
                  <div><span className="text-muted-foreground">Linked ID:</span> <span className="ml-2 font-medium font-mono text-xs flex items-center gap-1"><Link2 className="h-3 w-3 text-primary" />{t.linkedId}</span></div>
                </div>
                <div className="mt-4">
                  <p className="text-xs text-muted-foreground">This task is linked to: {linked}</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">All Tasks</h1>
          <p className="text-muted-foreground text-sm">{tasks.length} tasks — {tasks.filter(t => t.isAutoGenerated).length} auto-generated</p>
        </div>
        <div className="flex gap-2">
          <div className="flex border rounded-lg overflow-hidden">
            <button className={`px-3 py-1.5 text-xs ${viewMode === "table" ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:bg-muted"}`} onClick={() => setViewMode("table")}><List className="h-4 w-4" /></button>
            <button className={`px-3 py-1.5 text-xs ${viewMode === "kanban" ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:bg-muted"}`} onClick={() => setViewMode("kanban")}><LayoutGrid className="h-4 w-4" /></button>
          </div>
          <Button size="sm" onClick={() => { setCustomFields([]); setShowCreate(true); }}><Plus className="h-4 w-4 mr-1.5" />Create Task</Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search tasks..." className="pl-9 h-9" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-36 h-9 bg-background"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent className="bg-popover"><SelectItem value="all">All Statuses</SelectItem>{statuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-32 h-9 bg-background"><SelectValue placeholder="Priority" /></SelectTrigger>
          <SelectContent className="bg-popover"><SelectItem value="all">All Priorities</SelectItem>{priorities.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
        </Select>
        <Select value={moduleFilter} onValueChange={setModuleFilter}>
          <SelectTrigger className="w-40 h-9 bg-background"><SelectValue placeholder="Module" /></SelectTrigger>
          <SelectContent className="bg-popover"><SelectItem value="all">All Modules</SelectItem>{modules.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-40 h-9 bg-background"><SelectValue placeholder="Type" /></SelectTrigger>
          <SelectContent className="bg-popover"><SelectItem value="all">All Types</SelectItem>{taskTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
        </Select>
        <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
          <SelectTrigger className="w-44 h-9 bg-background"><SelectValue placeholder="Assignee" /></SelectTrigger>
          <SelectContent className="bg-popover"><SelectItem value="all">All Assignees</SelectItem>{assignees.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}</SelectContent>
        </Select>
        <Input className="w-40 h-9" type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
        <Input className="w-40 h-9" type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
      </div>

      {/* TABLE VIEW */}
      {viewMode === "table" && (
        <>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Module</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.slice(0, perPage).map(t => {
                  const linked = `${t.linkedModule} · ${t.linkedId}`;
                  const overdue = taskSelectors.isTaskOverdue(t, new Date());
                  return (
                    <TableRow key={t.taskId} className="cursor-pointer" onClick={() => setSelectedTask(t)}>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          {t.isAutoGenerated && <Zap className="h-3 w-3 text-purple-500 shrink-0" />}
                          <div>
                            <p className="text-sm font-medium">{t.title}</p>
                            {linked && <p className="text-xs text-muted-foreground flex items-center gap-1"><Link2 className="h-3 w-3 text-primary" />{linked}</p>}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell><Badge variant="outline" className="text-[10px]">{t.linkedModule}</Badge></TableCell>
                      <TableCell><Badge variant="outline" className="text-[10px]">{t.type}</Badge></TableCell>
                      <TableCell>
                        <p className="text-sm">{t.assignedTo}</p>
                        <p className="text-[10px] text-muted-foreground">by {t.assignedBy}</p>
                      </TableCell>
                      <TableCell className={`text-sm ${overdue ? "text-destructive font-medium" : ""}`}>{t.dueDate}</TableCell>
                      <TableCell><Badge variant="outline" className={`text-[10px] ${priorityColor[t.priority]}`}>{t.priority}</Badge></TableCell>
                      <TableCell><Badge variant="outline" className={`text-[10px] ${statusColor[t.status]}`}>{t.status}</Badge></TableCell>
                    </TableRow>
                  );
                })}
                {filtered.length === 0 && <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No tasks found</TableCell></TableRow>}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Showing {Math.min(filtered.length, perPage)} of {filtered.length} tasks</span>
            <div className="flex items-center gap-2">
              <span>Per page:</span>
              {[10, 25, 50, 100].map(n => (
                <button key={n} onClick={() => setPerPage(n)} className={`px-2 py-1 rounded ${perPage === n ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}>{n}</button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* KANBAN VIEW */}
      {viewMode === "kanban" && (
        <div className="grid grid-cols-4 gap-4">
          {kanbanStatuses.map(status => {
            const tasks = filtered.filter(t => t.status === status);
            return (
              <div key={status} className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className={`${statusColor[status]}`}>{status}</Badge>
                  <span className="text-xs text-muted-foreground font-medium">{tasks.length}</span>
                </div>
                <div className="space-y-2 min-h-[200px]">
                  {tasks.map(t => (
                    <Card key={t.taskId} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedTask(t)}>
                      <CardContent className="p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-muted-foreground">{t.linkedModule}</span>
                          <Badge variant="outline" className={`text-[10px] ${priorityColor[t.priority]}`}>{t.priority}</Badge>
                        </div>
                        <div className="flex items-center gap-1">
                          {t.isAutoGenerated && <Zap className="h-3 w-3 text-purple-500 shrink-0" />}
                          <p className="text-sm font-medium leading-tight">{t.title}</p>
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                          <span>{t.assignedTo}</span>
                          <span>{t.dueDate}</span>
                        </div>
                        <div className="flex gap-1">
                          <Badge variant="outline" className="text-[10px]">{t.linkedModule}</Badge>
                          <Badge variant="outline" className="text-[10px]">{t.type}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {tasks.length === 0 && <div className="text-xs text-muted-foreground text-center py-8 border-2 border-dashed rounded-lg">No tasks</div>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Task Modal */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Create New Task</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <CreateTaskForm onDone={() => setShowCreate(false)} />
            <CustomFieldsSection fields={customFields} onFieldsChange={setCustomFields} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


    </motion.div>
  );
};

export default AllTasks;

function CreateTaskForm({
  onDone,
}: {
  onDone: () => void;
}) {
  const user = useCurrentUser();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<TaskType>("Manual");
  const [linkedModule, setLinkedModule] = useState<LinkedModule>("Manual");
  const [linkedId, setLinkedId] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("Medium");
  const [assignedTo, setAssignedTo] = useState(user.displayName);
  const [dueDate, setDueDate] = useState(new Date().toISOString().slice(0, 10));

  function create() {
    taskActions.createTask({
      title,
      description,
      type,
      linkedModule,
      linkedId: linkedId || (linkedModule === "Manual" ? "MANUAL" : ""),
      priority,
      status: "Pending",
      assignedTo,
      assignedBy: user.displayName,
      dueDate: new Date(dueDate).toISOString(),
      isAutoGenerated: false,
    });
    onDone();
  }

  return (
    <div className="space-y-4">
      <div><Label>Task Title</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter task title" /></div>
      <div><Label>Description</Label><Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Task description..." rows={2} /></div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Type</Label>
          <Select value={type} onValueChange={(v) => setType(v as TaskType)}>
            <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
            <SelectContent className="bg-popover">{taskTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div>
          <Label>Priority</Label>
          <Select value={priority} onValueChange={(v) => setPriority(v as TaskPriority)}>
            <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
            <SelectContent className="bg-popover">{priorities.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Assigned To</Label>
          <Input value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} placeholder="e.g., Store Manager" />
        </div>
        <div>
          <Label>Due Date</Label>
          <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Linked Module</Label>
          <Select value={linkedModule} onValueChange={(v) => setLinkedModule(v as LinkedModule)}>
            <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
            <SelectContent className="bg-popover">{modules.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div>
          <Label>Linked ID</Label>
          <Input value={linkedId} onChange={(e) => setLinkedId(e.target.value)} placeholder="e.g., PO-2026-001 / EVT-004 / ITM-001" />
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={create} disabled={!title.trim() || !dueDate}>Create Task</Button>
      </div>
    </div>
  );
}
