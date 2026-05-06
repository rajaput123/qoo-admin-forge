import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Search, Plus, ChevronLeft, ChevronRight, Link2, Zap, ClipboardList, ArrowLeft, User, Calendar as CalendarIcon, IndianRupee, Building2, Clock, FileText, Edit, Star } from "lucide-react";
import { toast } from "sonner";
import SelectWithAddNew from "@/components/SelectWithAddNew";
import { eventRefs, freelancerRefs, templeStructures, autoTasks, freelancerAssignments, type FreelancerAssignment } from "@/data/templeData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type AssignmentRow = FreelancerAssignment;

const Assignments = () => {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterEvent, setFilterEvent] = useState("all");
  const [showAdd, setShowAdd] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [selectedAssignment, setSelectedAssignment] = useState<AssignmentRow | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  const [allAssignments, setAllAssignments] = useState<AssignmentRow[]>(freelancerAssignments);

  const [freelancerOptions, setFreelancerOptions] = useState(freelancerRefs.map(f => f.businessName));
  const [eventOptions, setEventOptions] = useState(eventRefs.map(e => `${e.id} — ${e.name}`));
  const [structureOptions, setStructureOptions] = useState(templeStructures.map(s => s.name));

  // Add form state
  const [addFreelancerName, setAddFreelancerName] = useState("");
  const [addFreelancerId, setAddFreelancerId] = useState("");
  const [addEventId, setAddEventId] = useState<string>("none");
  const [addEventName, setAddEventName] = useState<string>("");
  const [addStructure, setAddStructure] = useState("");
  const [addDate, setAddDate] = useState("");
  const [addDuration, setAddDuration] = useState("");
  const [addPayment, setAddPayment] = useState("");
  const [addTaskName, setAddTaskName] = useState("");
  const [addTaskDescription, setAddTaskDescription] = useState("");

  const filtered = allAssignments.filter(a => {
    if (search && !a.freelancerName.toLowerCase().includes(search.toLowerCase()) && !a.eventName.toLowerCase().includes(search.toLowerCase()) && !a.id.toLowerCase().includes(search.toLowerCase())) return false;
    // Tab-based filtering (primary filter)
    if (activeTab !== "all" && a.status !== activeTab) return false;
    // Event filter
    if (filterEvent !== "all" && a.eventId !== filterEvent) return false;
    return true;
  });

  // Count assignments by status for tab badges
  const statusCounts = {
    all: allAssignments.length,
    Assigned: allAssignments.filter(a => a.status === "Assigned").length,
    Confirmed: allAssignments.filter(a => a.status === "Confirmed").length,
    Completed: allAssignments.filter(a => a.status === "Completed").length,
    Cancelled: allAssignments.filter(a => a.status === "Cancelled").length,
  };

  const totalPages = Math.ceil(filtered.length / perPage) || 1;
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  const [viewing, setViewing] = useState<AssignmentRow | null>(null);
  const navigate = useNavigate();

  if (viewing) {
    return (
      <div className="p-6 space-y-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => setViewing(null)}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-2xl font-semibold tracking-tight">{viewing.id} · {viewing.eventName || "Assignment"}</h1>
                <p className="text-muted-foreground text-sm">{viewing.freelancerName} • {viewing.linkedStructure}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={viewing.status === "Completed" ? "default" : viewing.status === "Confirmed" ? "default" : "secondary"} className="text-[11px]">{viewing.status}</Badge>
              {viewing.status === "Completed" && (
                <Button size="sm" className="gap-1" onClick={() => navigate("/temple/freelancers/performance")}>
                  <Star className="h-3.5 w-3.5" />Review Performance
                </Button>
              )}
              <Button size="sm" variant="outline" onClick={() => {
                if (viewing.taskId) navigate(`/temple/tasks?taskId=${viewing.taskId}`);
                else navigate("/temple/tasks");
              }}>
                View Task
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 p-3 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground">Freelancer</p>
              <p className="font-medium">{viewing.freelancerName} <span className="text-xs text-muted-foreground ml-2">{viewing.freelancerId}</span></p>
              <p className="text-xs text-muted-foreground">Event</p>
              {viewing.eventId ? (
                <button className="text-sm text-primary underline" onClick={() => navigate(`/temple/events/${viewing.eventId}`)}>{viewing.eventName} · {viewing.eventId}</button>
              ) : <p className="text-sm">{viewing.eventName}</p>}
              <p className="text-xs text-muted-foreground">Structure</p>
              <p className="text-sm font-medium">{viewing.linkedStructure}</p>
              <p className="text-xs text-muted-foreground">Date / Duration</p>
              <p className="text-sm">{viewing.date} · {viewing.duration}</p>
            </div>
            <div className="space-y-2 p-3 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground">Agreed Payment</p>
              <p className="text-xl font-bold">₹{viewing.agreedPayment.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Task ID</p>
              <p className="text-sm font-medium">{viewing.taskId || "—"}</p>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  const resetAddForm = () => {
    setAddFreelancerName("");
    setAddFreelancerId("");
    setAddEventId("none");
    setAddEventName("");
    setAddStructure("");
    setAddDate("");
    setAddDuration("");
    setAddPayment("");
    setAddTaskName("");
    setAddTaskDescription("");
  };

  const handleSaveAssignment = () => {
    if (!addFreelancerName || !addStructure || !addDate || !addDuration || !addPayment) {
      toast.error("Freelancer, Structure, Date, Duration and Payment are required");
      return;
    }

    const amount = Number(addPayment);
    if (Number.isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid payment amount");
      return;
    }

    const nextNum =
      allAssignments
        .map(a => Number(a.id.replace("ASN-", "")) || 0)
        .reduce((max, n) => Math.max(max, n), 0) + 1;
    const newId = `ASN-${String(nextNum).padStart(3, "0")}`;

    const maxTaskNum = [...allAssignments.map(a => a.taskId)]
      .filter(id => !!id)
      .map(id => Number(id.replace("TSK-", "")) || 0)
      .concat(autoTasks.map(t => Number(t.id.replace("TSK-", "")) || 0))
      .reduce((max, n) => Math.max(max, n), 0);
    const newTaskId = `TSK-${String(maxTaskNum + 1).padStart(3, "0")}`;

    const eventId = addEventId === "none" ? "" : addEventId;
    const eventName =
      addEventId === "none"
        ? addEventName || "Non-event assignment"
        : eventRefs.find(e => e.id === addEventId)?.name || addEventName || "";

    const freelancerId =
      addFreelancerId ||
      freelancerRefs.find(f => f.businessName === addFreelancerName)?.id ||
      "";

    const newAssignment: AssignmentRow = {
      id: newId,
      freelancerId: freelancerId || "FRL-NEW",
      freelancerName: addFreelancerName,
      eventId,
      eventName,
      linkedStructure: addStructure,
      date: addDate,
      duration: addDuration,
      agreedPayment: amount,
      status: "Assigned",
      taskId: newTaskId,
      paymentId: "", // Payment record will be auto-created when assignment is completed
    };
    // Create corresponding auto-task in the shared autoTasks store
    const taskTitle = addTaskName || `Freelancer Assignment – ${eventName || addFreelancerName}`;
    const taskNotes = addTaskDescription || "Auto-generated from assignment";
    
    autoTasks.push({
      id: newTaskId,
      title: taskTitle,
      category: "Event",
      linkedModule: "Freelancer",
      linkedEntityId: freelancerId || "FRL-NEW",
      linkedEntityName: addFreelancerName,
      priority: "Medium",
      dueDate: addDate,
      assignee: addFreelancerName,
      assigneeType: "Freelancer",
      status: "Assigned",
      notes: taskNotes,
      autoGenerated: true,
      sourceType: "Event-Freelancer",
    });

    setAllAssignments(prev => [newAssignment, ...prev]);
    toast.success("Assignment created & task auto-generated");
    setShowAdd(false);
    resetAddForm();
  };


  // Details page view
  if (selectedAssignment) {
    const a = selectedAssignment;

    return (
      <div className="p-6 space-y-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => setSelectedAssignment(null)}><ArrowLeft className="h-4 w-4" /></Button>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-semibold tracking-tight">{a.id}</h1>
                  <Badge variant={a.status === "Completed" ? "default" : a.status === "Confirmed" ? "default" : a.status === "Cancelled" ? "destructive" : "secondary"}>{a.status}</Badge>
                </div>
                <p className="text-muted-foreground text-sm">{a.eventName} • {a.freelancerName}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2"><Edit className="h-4 w-4" />Edit</Button>
              {a.status === "Completed" && (
                <Button className="gap-2" onClick={() => navigate("/temple/freelancers/performance")}>
                  <Star className="h-4 w-4" />Review Performance
                </Button>
              )}
              <Button variant="outline" onClick={() => {
                const newStatus = a.status === "Cancelled" ? "Assigned" : a.status === "Completed" ? "Cancelled" : "Completed";
                let updatedAssignment = { ...a, status: newStatus };

                // Auto-generate payment record when marking as Completed
                if (newStatus === "Completed" && !a.paymentId) {
                  const paymentId = `PAY-${String(Math.floor(Math.random() * 900) + 100).padStart(3, '0')}`;
                  updatedAssignment = { ...updatedAssignment, paymentId };

                  // Here we would normally add to a shared payments data store
                  // For now, just show success message
                  toast.success(`Assignment completed & payment record ${paymentId} created (Pending)`);
                } else {
                  toast.success(`Assignment marked as ${newStatus}`);
                }

                setAllAssignments(prev => prev.map(asn => asn.id === a.id ? updatedAssignment : asn));
                // Update shared store
                const idx = freelancerAssignments.findIndex(asn => asn.id === a.id);
                if (idx >= 0) {
                  freelancerAssignments[idx] = updatedAssignment;
                }
                setSelectedAssignment(updatedAssignment);
              }}>
                {a.status === "Cancelled" ? "Reactivate" : a.status === "Completed" ? "Cancel" : "Mark Completed"}
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="details" className="space-y-4">
            <div className="border-b border-border">
              <TabsList className="w-full justify-start border-b-0 rounded-none h-auto p-0 bg-transparent gap-0">
                <TabsTrigger
                  value="details"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-amber-700 data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:font-medium px-4 py-2 text-sm text-muted-foreground data-[state=active]:text-foreground"
                >
                  Assignment Details
                </TabsTrigger>
                <TabsTrigger
                  value="freelancer"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-amber-700 data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:font-medium px-4 py-2 text-sm text-muted-foreground data-[state=active]:text-foreground"
                >
                  Freelancer Info
                </TabsTrigger>
                <TabsTrigger
                  value="task"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-amber-700 data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:font-medium px-4 py-2 text-sm text-muted-foreground data-[state=active]:text-foreground"
                >
                  Task Info
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="details" className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Basic Information</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-8 text-sm">
                  <div><span className="text-muted-foreground">Assignment ID:</span> <span className="ml-2 font-medium">{a.id}</span></div>
                  <div><span className="text-muted-foreground">Status:</span> <span className="ml-2"><Badge variant={a.status === "Completed" ? "default" : a.status === "Confirmed" ? "default" : a.status === "Cancelled" ? "destructive" : "secondary"}>{a.status}</Badge></span></div>
                  <div><span className="text-muted-foreground">Date:</span> <span className="ml-2 font-medium">{a.date}</span></div>
                  <div><span className="text-muted-foreground">Duration:</span> <span className="ml-2 font-medium">{a.duration}</span></div>
                  <div><span className="text-muted-foreground">Agreed Payment:</span> <span className="ml-2 font-medium">₹{a.agreedPayment.toLocaleString()}</span></div>
                  <div>
                    <span className="text-muted-foreground">Payment Status:</span>
                    <span className="ml-2">
                      {a.paymentId ? (
                        <span className="font-medium font-mono text-xs text-green-600">{a.paymentId} (Pending)</span>
                      ) : a.status === "Completed" ? (
                        <span className="text-xs text-amber-600">Generating...</span>
                      ) : (
                        <span className="text-xs text-muted-foreground">Not generated</span>
                      )}
                    </span>
                  </div>
                </div>
              </div>
              <hr className="border-border" />
              {/* Event Details */}
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Event Details</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-8 text-sm">
                  <div><span className="text-muted-foreground">Event Name:</span> <span className="ml-2 font-medium">{a.eventName}</span></div>
                  {a.eventId && <div><span className="text-muted-foreground">Event ID:</span> <span className="ml-2 font-medium font-mono text-xs">{a.eventId}</span></div>}
                  <div><span className="text-muted-foreground">Linked Structure:</span> <span className="ml-2 font-medium">{a.linkedStructure}</span></div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="freelancer" className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Freelancer Information</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-8 text-sm">
                  <div><span className="text-muted-foreground">Business Name:</span> <span className="ml-2 font-medium">{a.freelancerName}</span></div>
                  <div><span className="text-muted-foreground">Freelancer ID:</span> <span className="ml-2 font-medium font-mono text-xs">{a.freelancerId}</span></div>
                </div>
                <div className="mt-4">
                  <Button variant="outline" size="sm">View Full Freelancer Profile</Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="task" className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Task Information</h3>
                {a.taskId ? (
                  <>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-8 text-sm">
                      <div><span className="text-muted-foreground">Task ID:</span> <span className="ml-2 font-medium font-mono text-xs flex items-center gap-1"><Zap className="h-3 w-3 text-purple-500" />{a.taskId}</span></div>
                      <div><span className="text-muted-foreground">Status:</span> <span className="ml-2 font-medium">Auto-generated task</span></div>
                    </div>
                    <div className="mt-4">
                      <Button variant="outline" size="sm">View Task Details</Button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <ClipboardList className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">No task linked to this assignment</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Assignments</h1>
            <p className="text-muted-foreground">Freelancer assignments linked to Events & Tasks — auto-generates task entries</p>
          </div>
          <Button onClick={() => setShowAdd(true)} className="gap-2"><Plus className="h-4 w-4" />Add Assignment</Button>
        </div>

        {/* Tabs for Status Filtering */}
        <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v); setPage(1); }} className="space-y-4">
          <div className="flex items-center justify-between">
            <TabsList className="bg-muted/50">
              <TabsTrigger value="all" className="data-[state=active]:bg-background">
                All <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-[10px]">{statusCounts.all}</Badge>
              </TabsTrigger>
              <TabsTrigger value="Assigned" className="data-[state=active]:bg-background">
                Assigned <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-[10px]">{statusCounts.Assigned}</Badge>
              </TabsTrigger>
              <TabsTrigger value="Confirmed" className="data-[state=active]:bg-background">
                Confirmed <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-[10px]">{statusCounts.Confirmed}</Badge>
              </TabsTrigger>
              <TabsTrigger value="Completed" className="data-[state=active]:bg-background">
                Completed <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-[10px]">{statusCounts.Completed}</Badge>
              </TabsTrigger>
              <TabsTrigger value="Cancelled" className="data-[state=active]:bg-background">
                Cancelled <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-[10px]">{statusCounts.Cancelled}</Badge>
              </TabsTrigger>
            </TabsList>
            <Badge variant="secondary">{filtered.length} assignments</Badge>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search freelancer, event, ID..." className="pl-9" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
            </div>
            <Select value={filterEvent} onValueChange={v => { setFilterEvent(v); setPage(1); }}>
              <SelectTrigger className="w-[180px] bg-background"><SelectValue placeholder="All Events" /></SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="all">All Events</SelectItem>
                {eventRefs.map(e => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {/* Table Content for All Tabs */}
          <TabsContent value={activeTab} className="mt-0">
            <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Freelancer</TableHead>
                <TableHead>Event</TableHead>
                <TableHead>Structure</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead className="text-right">Payment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Task Link</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paged.length === 0 ? (
                <TableRow><TableCell colSpan={9} className="text-center text-muted-foreground py-8">No assignments found</TableCell></TableRow>
              ) : paged.map(a => (
                <TableRow
                  key={a.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => setSelectedAssignment(a)}
                >
                  <TableCell className="font-medium text-primary">{a.id}</TableCell>
                  <TableCell>
                    <div>
                      <span className="font-medium">{a.freelancerName}</span>
                      <span className="block text-[10px] text-muted-foreground font-mono">{a.freelancerId}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <span className="text-sm">{a.eventName}</span>
                      {a.eventId && <span className="block text-[10px] text-primary font-mono">{a.eventId}</span>}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{a.linkedStructure}</TableCell>
                  <TableCell className="text-sm">{a.date}</TableCell>
                  <TableCell className="text-sm">{a.duration}</TableCell>
                  <TableCell className="text-right font-medium">₹{a.agreedPayment.toLocaleString()}</TableCell>
                  <TableCell><Badge variant={a.status === "Completed" ? "default" : a.status === "Confirmed" ? "default" : a.status === "Cancelled" ? "destructive" : "secondary"}>{a.status}</Badge></TableCell>
                  <TableCell>
                    {a.taskId ? (
                      <span className="text-xs font-mono text-primary flex items-center gap-1">
                        <Zap className="h-3 w-3 text-purple-500" />{a.taskId}
                      </span>
                    ) : <span className="text-xs text-muted-foreground">—</span>}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Show</span>
            <Select value={perPage.toString()} onValueChange={v => { setPerPage(Number(v)); setPage(1); }}>
              <SelectTrigger className="w-[70px] h-8 bg-background"><SelectValue /></SelectTrigger>
              <SelectContent className="bg-popover">{[10, 25, 50, 100].map(n => <SelectItem key={n} value={n.toString()}>{n}</SelectItem>)}</SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">of {filtered.length} records</span>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" className="h-8 w-8" disabled={page === 1} onClick={() => setPage(p => p - 1)}><ChevronLeft className="h-4 w-4" /></Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).slice(Math.max(0, page - 3), page + 2).map(p => (
              <Button key={p} variant={p === page ? "default" : "outline"} size="icon" className="h-8 w-8" onClick={() => setPage(p)}>{p}</Button>
            ))}
            <Button variant="outline" size="icon" className="h-8 w-8" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}><ChevronRight className="h-4 w-4" /></Button>
          </div>
        </div>
      </motion.div>

      {/* Add Assignment Modal */}
      <Dialog
        open={showAdd}
        onOpenChange={open => {
          setShowAdd(open);
          if (!open) resetAddForm();
        }}
      >
        <DialogContent className="max-w-2xl bg-background">
          <DialogHeader><DialogTitle>Add Assignment</DialogTitle></DialogHeader>
          <Tabs defaultValue="assignment" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-transparent">
              <TabsTrigger value="assignment" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">Assignment Details</TabsTrigger>
              <TabsTrigger value="task" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">Task Details</TabsTrigger>
            </TabsList>
            
            <TabsContent value="assignment" className="space-y-4 py-4 mt-4">
              <div>
                <Label className="text-xs">Freelancer *</Label>
                <SelectWithAddNew
                  value={addFreelancerName}
                  onValueChange={v => {
                    setAddFreelancerName(v);
                    const ref = freelancerRefs.find(f => f.businessName === v);
                    setAddFreelancerId(ref?.id || "");
                  }}
                  placeholder="Select freelancer"
                  options={freelancerOptions}
                  onAddNew={v => {
                    setFreelancerOptions(p => [...p, v]);
                    setAddFreelancerName(v);
                  }}
                />
              </div>
              <div>
                <Label className="text-xs">Event (from Event Module)</Label>
                <Select
                  value={addEventId}
                  onValueChange={v => {
                    setAddEventId(v);
                    if (v === "none") {
                      setAddEventName("");
                    } else {
                      const ev = eventRefs.find(e => e.id === v);
                      setAddEventName(ev?.name || "");
                    }
                  }}
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select event" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="none">Non-event assignment</SelectItem>
                    {eventRefs.map(e => (
                      <SelectItem key={e.id} value={e.id}>
                        {e.id} — {e.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Linked Structure *</Label>
                <SelectWithAddNew
                  value={addStructure}
                  onValueChange={setAddStructure}
                  placeholder="Select structure"
                  options={structureOptions.slice()}
                  onAddNew={v => setStructureOptions(p => [...p, v])}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Date *</Label>
                  <Input type="date" value={addDate} onChange={e => setAddDate(e.target.value)} />
                </div>
                <div>
                  <Label className="text-xs">Duration *</Label>
                  <Input placeholder="e.g., 2 days" value={addDuration} onChange={e => setAddDuration(e.target.value)} />
                </div>
              </div>
              <div>
                <Label className="text-xs">Agreed Payment (₹) *</Label>
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={addPayment}
                  onChange={e => setAddPayment(e.target.value)}
                />
              </div>
            </TabsContent>

            <TabsContent value="task" className="space-y-4 py-4 mt-4">
              <div className="border rounded-lg p-3 bg-muted/30 text-xs text-muted-foreground mb-4">
                <Zap className="h-4 w-4 inline mr-1 text-purple-500" />
                A task will be auto-created in the Task module when this assignment is saved.
              </div>
              <div>
                <Label className="text-xs">Task Name</Label>
                <Input
                  placeholder="Enter task name (optional - auto-generated if empty)"
                  value={addTaskName}
                  onChange={e => setAddTaskName(e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">If empty, will use: "Freelancer Assignment – [Event Name]"</p>
              </div>
              <div>
                <Label className="text-xs">Task Description / Notes</Label>
                <Textarea
                  placeholder="Enter task description or notes (optional)"
                  value={addTaskDescription}
                  onChange={e => setAddTaskDescription(e.target.value)}
                  rows={4}
                />
                <p className="text-xs text-muted-foreground mt-1">This will be added as notes in the auto-generated task</p>
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setShowAdd(false);
                resetAddForm();
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveAssignment}>Save Assignment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Assignments;
