import { useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Download, Users, CheckCircle, XCircle, Clock, User } from "lucide-react";
import { toast } from "sonner";
import SearchableSelect from "@/components/SearchableSelect";
import { createTask } from "@/modules/tasks/taskEngineStore";

interface Assignment {
  id: string;
  date: string;
  time: string;
  offering: string;
  structure: string;
  priestName: string;
  status: "Assigned" | "Completed" | "Absent" | "Unassigned";
  assignedBy?: string;
  assignedAt?: string;
}

const mockAssignments: Assignment[] = [
  { id: "A001", date: "2026-02-09", time: "5:30 AM", offering: "Suprabhatam", structure: "Main Temple", priestName: "Pandit Sharma", status: "Completed", assignedBy: "Admin", assignedAt: "2026-02-08 10:30 AM" },
  { id: "A002", date: "2026-02-09", time: "7:00 AM", offering: "Archana", structure: "Padmavathi Shrine", priestName: "Pandit Rao", status: "Completed", assignedBy: "Admin", assignedAt: "2026-02-08 10:32 AM" },
  { id: "A003", date: "2026-02-09", time: "9:00 AM", offering: "Abhishekam", structure: "Main Temple", priestName: "Pandit Kumar", status: "Completed", assignedBy: "Admin", assignedAt: "2026-02-08 10:35 AM" },
  { id: "A004", date: "2026-02-09", time: "11:00 AM", offering: "Sahasranama", structure: "Varadaraja Shrine", priestName: "Pandit Iyer", status: "Completed", assignedBy: "Admin", assignedAt: "2026-02-08 10:40 AM" },
  { id: "A005", date: "2026-02-09", time: "7:00 PM", offering: "Ekantha Seva", structure: "Main Temple", priestName: "Pandit Sharma", status: "Completed", assignedBy: "Admin", assignedAt: "2026-02-08 11:00 AM" },
  { id: "A006", date: "2026-02-09", time: "4:00 PM", offering: "Ashtottara", structure: "Lakshmi Shrine", priestName: "", status: "Unassigned" },
  { id: "A007", date: "2026-02-10", time: "5:30 AM", offering: "Suprabhatam", structure: "Main Temple", priestName: "", status: "Unassigned" },
  { id: "A008", date: "2026-02-10", time: "7:00 AM", offering: "Archana", structure: "Padmavathi Shrine", priestName: "", status: "Unassigned" },
  { id: "A009", date: "2026-02-10", time: "9:00 AM", offering: "Abhishekam", structure: "Main Temple", priestName: "Pandit Kumar", status: "Assigned", assignedBy: "Admin", assignedAt: "2026-02-09 03:00 PM" },
  { id: "A010", date: "2026-02-10", time: "11:00 AM", offering: "Sahasranama", structure: "Varadaraja Shrine", priestName: "Pandit Iyer", status: "Assigned", assignedBy: "Admin", assignedAt: "2026-02-09 03:05 PM" },
];

const priestOptions = [
  { value: "Pandit Sharma", label: "Pandit Sharma" },
  { value: "Pandit Rao", label: "Pandit Rao" },
  { value: "Pandit Kumar", label: "Pandit Kumar" },
  { value: "Pandit Iyer", label: "Pandit Iyer" },
  { value: "Pandit Venkatesh", label: "Pandit Venkatesh" },
];

const PriestAssignment = () => {
  const [search, setSearch] = useState("");
  const [filterDate, setFilterDate] = useState("all");
  const [filterPriest, setFilterPriest] = useState("all");
  const [filterStructure, setFilterStructure] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [assignPriest, setAssignPriest] = useState("");
  const [assignments, setAssignments] = useState(mockAssignments);

  const allDates = [...new Set(assignments.map(a => a.date))].sort();
  const allPriests = [...new Set(assignments.filter(a => a.priestName).map(a => a.priestName))];
  const allStructures = [...new Set(assignments.map(a => a.structure))];

  const filtered = assignments.filter(a => {
    if (search && !a.offering.toLowerCase().includes(search.toLowerCase()) && !a.priestName.toLowerCase().includes(search.toLowerCase()) && !a.id.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterDate !== "all" && a.date !== filterDate) return false;
    if (filterPriest !== "all" && a.priestName !== filterPriest) return false;
    if (filterStructure !== "all" && a.structure !== filterStructure) return false;
    if (filterStatus !== "all" && a.status !== filterStatus) return false;
    return true;
  });

  const stats = {
    total: assignments.length,
    assigned: assignments.filter(a => a.status === "Assigned").length,
    completed: assignments.filter(a => a.status === "Completed").length,
    unassigned: assignments.filter(a => a.status === "Unassigned").length,
    absent: assignments.filter(a => a.status === "Absent").length,
  };

  const handleAssign = () => {
    if (!assignPriest || !selectedAssignment) return;

    const updated = assignments.map(a =>
      a.id === selectedAssignment.id
        ? { ...a, priestName: assignPriest, status: "Assigned" as const, assignedBy: "Admin", assignedAt: new Date().toLocaleString() }
        : a
    );
    setAssignments(updated);

    // Auto-create task in Task Management
    createTask({
      title: `Perform ${selectedAssignment.offering} – ${assignPriest}`,
      description: `${assignPriest} is assigned to perform ${selectedAssignment.offering} at ${selectedAssignment.structure} on ${selectedAssignment.date} at ${selectedAssignment.time}.`,
      type: "Offering",
      linkedModule: "Offering",
      linkedId: selectedAssignment.id,
      priority: "High",
      status: "Pending",
      assignedTo: assignPriest,
      assignedBy: "Admin",
      dueDate: new Date(selectedAssignment.date + "T" + (selectedAssignment.time.includes("AM") || selectedAssignment.time.includes("PM") ? "00:00:00" : selectedAssignment.time)).toISOString(),
      isAutoGenerated: true,
    });

    toast.success(`Assigned ${assignPriest} to ${selectedAssignment.offering} — task created`);
    setIsAssignOpen(false);
    setSelectedAssignment(null);
    setAssignPriest("");
  };

  const handleMarkAttendance = (assignment: Assignment, present: boolean) => {
    const updated = assignments.map(a =>
      a.id === assignment.id
        ? { ...a, status: present ? "Completed" as const : "Absent" as const }
        : a
    );
    setAssignments(updated);
    toast.success(`Marked ${assignment.priestName} as ${present ? "Present" : "Absent"} for ${assignment.offering}`);
  };

  const handleReassign = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setAssignPriest(assignment.priestName);
    setIsAssignOpen(true);
  };

  const handleExport = () => {
    const csv = [
      "Assignment ID,Date,Time,Offering,Structure,Priest,Status,Assigned By,Assigned At",
      ...filtered.map(a => `${a.id},${a.date},${a.time},"${a.offering}","${a.structure}","${a.priestName}",${a.status},${a.assignedBy || ""},${a.assignedAt || ""}`)
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `priest-assignments-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Assignments exported");
  };

  const statusColors = {
    Assigned: "bg-blue-100 text-blue-700",
    Completed: "bg-green-100 text-green-700",
    Absent: "bg-red-100 text-red-700",
    Unassigned: "bg-amber-100 text-amber-700",
  };

  return (
    <div className="p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Priest Assignment</h1>
            <p className="text-muted-foreground">Assign priests to ritual slots and track attendance</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExport} className="gap-2">
              <Download className="h-4 w-4" />Export
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-5 gap-4 mb-6">
          <div className="border rounded-lg p-4 bg-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Total Slots</p>
                <p className="text-2xl font-bold mt-1">{stats.total}</p>
              </div>
              <Clock className="h-8 w-8 text-muted-foreground" />
            </div>
          </div>
          <div className="border rounded-lg p-4 bg-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Assigned</p>
                <p className="text-2xl font-bold mt-1 text-blue-600">{stats.assigned}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <div className="border rounded-lg p-4 bg-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold mt-1 text-green-600">{stats.completed}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <div className="border rounded-lg p-4 bg-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Unassigned</p>
                <p className="text-2xl font-bold mt-1 text-amber-600">{stats.unassigned}</p>
              </div>
              <User className="h-8 w-8 text-amber-600" />
            </div>
          </div>
          <div className="border rounded-lg p-4 bg-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Absent</p>
                <p className="text-2xl font-bold mt-1 text-red-600">{stats.absent}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search offering, priest, ID..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <Select value={filterDate} onValueChange={setFilterDate}>
            <SelectTrigger className="w-[140px] bg-background"><SelectValue placeholder="Date" /></SelectTrigger>
            <SelectContent className="bg-popover">
              <SelectItem value="all">All Dates</SelectItem>
              {allDates.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filterPriest} onValueChange={setFilterPriest}>
            <SelectTrigger className="w-[150px] bg-background"><SelectValue placeholder="Priest" /></SelectTrigger>
            <SelectContent className="bg-popover">
              <SelectItem value="all">All Priests</SelectItem>
              {allPriests.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filterStructure} onValueChange={setFilterStructure}>
            <SelectTrigger className="w-[180px] bg-background"><SelectValue placeholder="Structure" /></SelectTrigger>
            <SelectContent className="bg-popover">
              <SelectItem value="all">All Structures</SelectItem>
              {allStructures.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[140px] bg-background"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent className="bg-popover">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Assigned">Assigned</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Unassigned">Unassigned</SelectItem>
              <SelectItem value="Absent">Absent</SelectItem>
            </SelectContent>
          </Select>
          <Badge variant="secondary" className="ml-auto">{filtered.length} assignments</Badge>
        </div>

        {/* Table */}
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Offering</TableHead>
                <TableHead>Structure</TableHead>
                <TableHead>Priest</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground py-8">No assignments found</TableCell>
                </TableRow>
              ) : filtered.map(a => (
                <TableRow key={a.id} className={a.status === "Unassigned" ? "bg-amber-50/50" : ""}>
                  <TableCell className="font-medium text-primary">{a.id}</TableCell>
                  <TableCell className="text-sm">{a.date}</TableCell>
                  <TableCell className="font-medium text-sm">{a.time}</TableCell>
                  <TableCell className="font-medium">{a.offering}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{a.structure}</TableCell>
                  <TableCell className="text-sm">
                    {a.priestName || <span className="text-muted-foreground italic">—</span>}
                  </TableCell>
                  <TableCell>
                    <Badge className={`${statusColors[a.status]} border-0 text-xs`}>
                      {a.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {a.status === "Unassigned" && (
                        <Button size="sm" variant="outline" onClick={() => { setSelectedAssignment(a); setAssignPriest(""); setIsAssignOpen(true); }} className="h-8 text-xs gap-1">
                          <Users className="h-3 w-3" />Assign
                        </Button>
                      )}
                      {a.status === "Assigned" && (
                        <>
                          <Button size="sm" variant="outline" onClick={() => handleMarkAttendance(a, true)} className="h-8 text-xs gap-1">
                            <CheckCircle className="h-3 w-3" />Present
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleMarkAttendance(a, false)} className="h-8 text-xs gap-1 text-red-600">
                            <XCircle className="h-3 w-3" />Absent
                          </Button>
                        </>
                      )}
                      {(a.status === "Assigned" || a.status === "Completed" || a.status === "Absent") && (
                        <Button size="sm" variant="ghost" onClick={() => handleReassign(a)} className="h-8 text-xs">
                          Reassign
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </motion.div>

      {/* Assign/Reassign Priest Dialog */}
      <Dialog open={isAssignOpen} onOpenChange={setIsAssignOpen}>
        <DialogContent className="sm:max-w-[400px] bg-background">
          <DialogHeader>
            <DialogTitle>{selectedAssignment?.priestName ? "Reassign Priest" : "Assign Priest"}</DialogTitle>
            <DialogDescription>
              {selectedAssignment?.offering} – {selectedAssignment?.time} ({selectedAssignment?.date})
              {selectedAssignment?.priestName && (
                <span className="block mt-1 text-xs">Currently assigned: <strong>{selectedAssignment.priestName}</strong></span>
              )}
            </DialogDescription>
          </DialogHeader>
          <SearchableSelect options={priestOptions} value={assignPriest} onValueChange={setAssignPriest} placeholder="Select priest" />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAssignOpen(false)}>Cancel</Button>
            <Button onClick={handleAssign} disabled={!assignPriest}>
              {selectedAssignment?.priestName ? "Reassign" : "Assign"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PriestAssignment;
