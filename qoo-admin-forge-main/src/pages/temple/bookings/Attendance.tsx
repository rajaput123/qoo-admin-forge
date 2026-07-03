import { useState, useMemo, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { UserCheck, Search, Download, Calendar, Clock, RotateCcw, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface AttendanceRecord {
  id: string;
  bookingId: string;
  offering: string;
  type: "Ritual" | "Darshan";
  structure: string;
  devotee: string;
  date: string;
  slotTime: string;
  slotMinutes: number;
  attendanceStatus: "Attended" | "No Show" | "Pending";
  bookingStatus: "Confirmed" | "Completed";
}

const todayStr = new Date().toISOString().split("T")[0];

const mockAttendance: AttendanceRecord[] = [
  { id: "1", bookingId: "BK-2026-0001", offering: "Suprabhatam",     type: "Ritual",  structure: "Main Temple",       devotee: "Ramesh Kumar",  date: todayStr, slotTime: "5:30 AM",  slotMinutes: 330, attendanceStatus: "Attended", bookingStatus: "Completed" },
  { id: "2", bookingId: "BK-2026-0002", offering: "Archana",         type: "Ritual",  structure: "Padmavathi Shrine", devotee: "Lakshmi Devi",  date: todayStr, slotTime: "7:00 AM",  slotMinutes: 420, attendanceStatus: "Attended", bookingStatus: "Confirmed" },
  { id: "3", bookingId: "BK-2026-0003", offering: "Abhishekam",      type: "Ritual",  structure: "Main Temple",       devotee: "Suresh Reddy",  date: todayStr, slotTime: "9:00 AM",  slotMinutes: 540, attendanceStatus: "Pending",  bookingStatus: "Confirmed" },
  { id: "4", bookingId: "BK-2026-0004", offering: "VIP Darshan",     type: "Darshan", structure: "Main Temple",       devotee: "Priya Sharma",  date: todayStr, slotTime: "8:00 AM",  slotMinutes: 480, attendanceStatus: "Attended", bookingStatus: "Completed" },
  { id: "5", bookingId: "BK-2026-0005", offering: "Morning Darshan", type: "Darshan", structure: "Main Temple",       devotee: "Anand Verma",   date: todayStr, slotTime: "6:00 AM",  slotMinutes: 360, attendanceStatus: "Attended", bookingStatus: "Completed" },
  { id: "6", bookingId: "BK-2026-0009", offering: "Evening Darshan", type: "Darshan", structure: "Main Temple",       devotee: "Ganesh Prasad", date: todayStr, slotTime: "4:00 PM",  slotMinutes: 960, attendanceStatus: "No Show",  bookingStatus: "Confirmed" },
  { id: "7", bookingId: "BK-2026-0006", offering: "Suprabhatam",     type: "Ritual",  structure: "Main Temple",       devotee: "Meena Iyer",    date: todayStr, slotTime: "5:30 AM",  slotMinutes: 330, attendanceStatus: "Pending",  bookingStatus: "Confirmed" },
  { id: "8", bookingId: "BK-2026-0010", offering: "Sahasranamam",    type: "Ritual",  structure: "Padmavathi Shrine", devotee: "Kiran Babu",    date: todayStr, slotTime: "10:00 AM", slotMinutes: 600, attendanceStatus: "Pending",  bookingStatus: "Confirmed" },
  { id: "9", bookingId: "BK-2026-0011", offering: "Special Darshan", type: "Darshan", structure: "Main Temple",       devotee: "Sunitha Rao",   date: todayStr, slotTime: "11:00 AM", slotMinutes: 660, attendanceStatus: "Pending",  bookingStatus: "Confirmed" },
];

const getNowMinutes = () => { const d = new Date(); return d.getHours() * 60 + d.getMinutes(); };

const Attendance = () => {
  const [records, setRecords] = useState<AttendanceRecord[]>(mockAttendance);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [filterDate, setFilterDate] = useState(todayStr);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [revertDialog, setRevertDialog] = useState<{ open: boolean; record: AttendanceRecord | null }>({ open: false, record: null });

  const nowMinutes = getNowMinutes();

  // ── Auto-complete overdue Pending slots ─────────────────────────────────
  // Buffer: 30 min after slot time → auto-mark Attended + Completed
  const AUTO_CLOSE_BUFFER = 30;
  const autoCompleteRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const runAutoComplete = () => {
    const now = getNowMinutes();
    setRecords(prev => {
      const toClose = prev.filter(
        r => r.attendanceStatus === "Pending" && r.slotMinutes + AUTO_CLOSE_BUFFER <= now
      );
      if (toClose.length === 0) return prev;
      toast.info(
        `Auto-completed ${toClose.length} slot${toClose.length > 1 ? "s" : ""} — slot window closed`,
        { description: toClose.map(r => r.offering + " · " + r.devotee).join(", "), duration: 6000 }
      );
      return prev.map(r =>
        r.attendanceStatus === "Pending" && r.slotMinutes + AUTO_CLOSE_BUFFER <= now
          ? { ...r, attendanceStatus: "Attended", bookingStatus: "Completed" }
          : r
      );
    });
  };

  useEffect(() => {
    runAutoComplete(); // run immediately on mount
    autoCompleteRef.current = setInterval(runAutoComplete, 60_000); // check every 60s
    return () => { if (autoCompleteRef.current) clearInterval(autoCompleteRef.current); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const dateRecords = useMemo(() => records.filter(r => r.date === filterDate), [records, filterDate]);

  // Summary counts
  const attended    = dateRecords.filter(r => r.attendanceStatus === "Attended").length;
  const noShow      = dateRecords.filter(r => r.attendanceStatus === "No Show").length;
  const pending     = dateRecords.filter(r => r.attendanceStatus === "Pending").length;
  const completed   = dateRecords.filter(r => r.bookingStatus === "Completed").length;
  const total       = dateRecords.length;
  const rate        = total > 0 ? Math.round((attended / total) * 100) : 0;
  const overdueCount = dateRecords.filter(r => r.attendanceStatus === "Pending" && r.slotMinutes < nowMinutes).length;

  const filtered = useMemo(() =>
    dateRecords
      .filter(r => {
        if (searchQuery && !r.bookingId.toLowerCase().includes(searchQuery.toLowerCase()) && !r.devotee.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        if (filterStatus !== "all" && r.attendanceStatus !== filterStatus) return false;
        if (filterType !== "all" && r.type !== filterType) return false;
        return true;
      })
      .sort((a, b) => a.slotMinutes - b.slotMinutes),
    [dateRecords, searchQuery, filterStatus, filterType]
  );

  // ── Mark attendance ──────────────────────────────────────────────────────
  // Marking Present (any type) → immediately Attended + Completed
  const markAttendance = (id: string, status: "Attended" | "No Show") => {
    setRecords(prev => prev.map(r => {
      if (r.id !== id) return r;
      if (status === "Attended") {
        toast.success(`${r.devotee} — Marked Present & Completed`);
        return { ...r, attendanceStatus: "Attended", bookingStatus: "Completed" };
      }
      toast.error(`${r.devotee} — Marked No Show`);
      return { ...r, attendanceStatus: "No Show" };
    }));
  };

  // ── Revert to Pending ───────────────────────────────────────────────────
  const confirmRevert = () => {
    if (!revertDialog.record) return;
    setRecords(prev => prev.map(r =>
      r.id === revertDialog.record!.id ? { ...r, attendanceStatus: "Pending", bookingStatus: "Confirmed" } : r
    ));
    toast.success(`Reverted ${revertDialog.record.devotee} back to Pending`);
    setRevertDialog({ open: false, record: null });
  };

  // ── Bulk actions ─────────────────────────────────────────────────────────
  const handleBulkMark = (status: "Attended" | "No Show") => {
    if (selectedIds.size === 0) return;
    setRecords(prev => prev.map(r => {
      if (!selectedIds.has(r.id)) return r;
      if (status === "Attended") return { ...r, attendanceStatus: "Attended", bookingStatus: "Completed" };
      return { ...r, attendanceStatus: "No Show" };
    }));
    toast.success(`${selectedIds.size} records marked as ${status}`);
    setSelectedIds(new Set());
  };

  const toggleSelect = (id: string) => { const n = new Set(selectedIds); n.has(id) ? n.delete(id) : n.add(id); setSelectedIds(n); };
  const pendingFiltered = filtered.filter(r => r.attendanceStatus === "Pending");
  const allPendingSelected = pendingFiltered.length > 0 && pendingFiltered.every(r => selectedIds.has(r.id));
  const toggleSelectAll = () => {
    const ids = pendingFiltered.map(r => r.id);
    setSelectedIds(ids.every(id => selectedIds.has(id)) ? new Set() : new Set(ids));
  };

  const handleExport = () => {
    const csv = [
      ["Booking ID", "Offering", "Type", "Structure", "Devotee", "Date", "Slot Time", "Attendance", "Booking Status"].join(","),
      ...filtered.map(r => [r.bookingId, r.offering, r.type, r.structure, r.devotee, r.date, r.slotTime, r.attendanceStatus, r.bookingStatus].join(","))
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `attendance-${filterDate}.csv`; a.click();
    URL.revokeObjectURL(url);
    toast.success("Exported to CSV");
  };

  const clearFilters = () => { setSearchQuery(""); setFilterStatus("all"); setFilterType("all"); setFilterDate(todayStr); };
  const hasActiveFilters = searchQuery || filterStatus !== "all" || filterType !== "all" || filterDate !== todayStr;

  return (
    <div className="p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Attendance</h1>
            <p className="text-muted-foreground text-sm">
              Darshan auto-completes on Present · Rituals require separate seva completion
            </p>
          </div>
          <Button variant="outline" onClick={handleExport} className="gap-2">
            <Download className="h-4 w-4" />Export
          </Button>
        </div>

        {/* Overdue alert */}
        {overdueCount > 0 && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm mb-2">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span><strong>{overdueCount}</strong> Pending booking{overdueCount > 1 ? "s" : ""} past their slot time — please mark attendance.</span>
          </div>
        )}


        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Attended",   value: attended,   sub: `${rate}% attendance rate`,                                              color: "text-emerald-600",  icon: CheckCircle2, iconColor: "text-emerald-500" },
            { label: "No Show",    value: noShow,     sub: `of ${total} total`,                                                        color: "text-destructive",  icon: XCircle,      iconColor: "text-destructive" },
            { label: "Pending",    value: pending,    sub: overdueCount > 0 ? `${overdueCount} overdue` : "awaiting",                  color: "text-amber-600",    icon: Clock,        iconColor: "text-amber-500" },
            { label: "Completed",  value: completed,  sub: "fully fulfilled",                                                          color: "text-emerald-700",  icon: CheckCircle2, iconColor: "text-emerald-600" },
          ].map((s, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <s.icon className={`h-4 w-4 ${s.iconColor}`} />
                </div>
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{s.sub}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-end gap-3 mb-4">
          <div className="relative flex-1 min-w-[180px] max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search ID or Devotee..." className="pl-9" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1">
            <Label className="text-xs text-muted-foreground flex items-center gap-1"><Calendar className="h-3 w-3" />Date</Label>
            <Input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)} className="w-auto" />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[130px] bg-background"><SelectValue /></SelectTrigger>
            <SelectContent className="bg-popover">
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Ritual">Ritual</SelectItem>
              <SelectItem value="Darshan">Darshan</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[140px] bg-background"><SelectValue /></SelectTrigger>
            <SelectContent className="bg-popover">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Attended">Attended</SelectItem>
              <SelectItem value="No Show">No Show</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
            </SelectContent>
          </Select>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground" onClick={clearFilters}>Clear filters</Button>
          )}
        </div>

        {/* Bulk action bar */}
        {selectedIds.size > 0 && (
          <div className="flex items-center justify-between px-4 py-2.5 mb-3 bg-muted rounded-lg border flex-wrap gap-2">
            <span className="text-sm font-medium">{selectedIds.size} selected</span>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="gap-1.5 text-emerald-700 border-emerald-300 hover:bg-emerald-50" onClick={() => handleBulkMark("Attended")}>
                <CheckCircle2 className="h-3.5 w-3.5" />Mark Present
              </Button>
              <Button size="sm" variant="outline" className="gap-1.5 text-destructive border-destructive/40 hover:bg-destructive/5" onClick={() => handleBulkMark("No Show")}>
                <XCircle className="h-3.5 w-3.5" />Mark No Show
              </Button>
              <Button size="sm" variant="ghost" className="text-xs" onClick={() => setSelectedIds(new Set())}>Clear</Button>
            </div>
          </div>
        )}

        {/* Table */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg"><UserCheck className="h-5 w-5 text-primary" /></div>
              <div>
                <CardTitle>Attendance Sheet</CardTitle>
                <CardDescription>{filtered.length} record{filtered.length !== 1 ? "s" : ""} · sorted by slot time</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">
                    <Checkbox checked={allPendingSelected} onCheckedChange={toggleSelectAll} aria-label="Select all pending" />
                  </TableHead>
                  <TableHead>Booking ID</TableHead>
                  <TableHead>Offering</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Devotee</TableHead>
                  <TableHead>Slot Time</TableHead>
                  <TableHead>Attendance</TableHead>
                  <TableHead>Seva Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 && (
                  <TableRow><TableCell colSpan={9} className="text-center py-10 text-muted-foreground">No records match the current filters.</TableCell></TableRow>
                )}
                {filtered.map(r => {
                  const isOverdue = r.attendanceStatus === "Pending" && r.slotMinutes < nowMinutes;

                  return (
                    <TableRow key={r.id} className={`hover:bg-muted/50 ${isOverdue ? "bg-amber-50/30" : ""}`}>
                      <TableCell>
                        {r.attendanceStatus === "Pending" && (
                          <Checkbox checked={selectedIds.has(r.id)} onCheckedChange={() => toggleSelect(r.id)} />
                        )}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground font-mono">{r.bookingId}</TableCell>
                      <TableCell className="font-medium">{r.offering}</TableCell>
                      <TableCell>
                        <Badge variant={r.type === "Ritual" ? "default" : "secondary"} className="text-xs">{r.type}</Badge>
                      </TableCell>
                      <TableCell>{r.devotee}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-sm">
                          <Clock className="h-3.5 w-3.5 text-muted-foreground" />{r.slotTime}
                          {isOverdue && <Badge variant="outline" className="text-[10px] text-amber-600 border-amber-300 bg-amber-50 ml-1 px-1 py-0">overdue</Badge>}
                        </div>
                      </TableCell>

                      {/* Attendance badge */}
                      <TableCell>
                        {r.attendanceStatus === "Attended" && <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100">Attended</Badge>}
                        {r.attendanceStatus === "No Show"  && <Badge variant="destructive">No Show</Badge>}
                        {r.attendanceStatus === "Pending"  && <Badge variant="secondary">Pending</Badge>}
                      </TableCell>

                      {/* Booking status badge */}
                      <TableCell>
                        {r.bookingStatus === "Completed" && (
                          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50">Completed</Badge>
                        )}
                        {r.bookingStatus === "Confirmed" && r.attendanceStatus !== "Attended" && (
                          <Badge variant="outline" className="text-muted-foreground">Confirmed</Badge>
                        )}
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          {r.attendanceStatus === "Pending" && (
                            <>
                              <Button size="sm" variant="outline" className="h-7 text-xs gap-1 text-emerald-700 border-emerald-300 hover:bg-emerald-50" onClick={() => markAttendance(r.id, "Attended")}>
                                <CheckCircle2 className="h-3 w-3" />Present
                              </Button>
                              <Button size="sm" variant="ghost" className="h-7 text-xs gap-1 text-destructive hover:bg-destructive/5" onClick={() => markAttendance(r.id, "No Show")}>
                                <XCircle className="h-3 w-3" />No Show
                              </Button>
                            </>
                          )}
                          {(r.attendanceStatus === "No Show" || r.attendanceStatus === "Attended") && (
                            <Button size="sm" variant="ghost" className="h-7 text-xs gap-1 text-muted-foreground hover:text-foreground" onClick={() => setRevertDialog({ open: true, record: r })} title="Revert to Pending">
                              <RotateCcw className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

      </motion.div>

      {/* Revert dialog */}
      <AlertDialog open={revertDialog.open} onOpenChange={open => setRevertDialog(prev => ({ ...prev, open }))}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Revert Attendance?</AlertDialogTitle>
            <AlertDialogDescription>
              This will revert <strong>{revertDialog.record?.devotee}</strong> ({revertDialog.record?.attendanceStatus}) back to <strong>Pending</strong>. Any seva completion will also be reset.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRevert}>Yes, Revert</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Attendance;
