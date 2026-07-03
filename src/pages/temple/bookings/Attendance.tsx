import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserCheck, Search, Download } from "lucide-react";
import { toast } from "sonner";

interface AttendanceRecord {
  id: string;
  bookingId: string;
  offering: string;
  type: "Ritual" | "Darshan";
  structure: string;
  devotee: string;
  slotTime: string;
  status: "Attended" | "No Show" | "Pending";
}

const mockAttendance: AttendanceRecord[] = [
  { id: "1", bookingId: "BK-2026-0001", offering: "Suprabhatam", type: "Ritual", structure: "Main Temple", devotee: "Ramesh Kumar", slotTime: "5:30 AM", status: "Attended" },
  { id: "2", bookingId: "BK-2026-0002", offering: "Archana", type: "Ritual", structure: "Padmavathi Shrine", devotee: "Lakshmi Devi", slotTime: "7:00 AM", status: "Attended" },
  { id: "3", bookingId: "BK-2026-0003", offering: "Abhishekam", type: "Ritual", structure: "Main Temple", devotee: "Suresh Reddy", slotTime: "9:00 AM", status: "Pending" },
  { id: "4", bookingId: "BK-2026-0004", offering: "VIP Darshan", type: "Darshan", structure: "Main Temple", devotee: "Priya Sharma", slotTime: "8:00 AM", status: "Attended" },
  { id: "5", bookingId: "BK-2026-0005", offering: "Morning Darshan", type: "Darshan", structure: "Main Temple", devotee: "Anand Verma", slotTime: "6:00 AM", status: "Attended" },
  { id: "6", bookingId: "BK-2026-0009", offering: "Evening Darshan", type: "Darshan", structure: "Main Temple", devotee: "Ganesh Prasad", slotTime: "4:00 PM", status: "No Show" },
  { id: "7", bookingId: "BK-2026-0006", offering: "Suprabhatam", type: "Ritual", structure: "Main Temple", devotee: "Meena Iyer", slotTime: "5:30 AM", status: "Pending" },
];

const Attendance = () => {
  const [records, setRecords] = useState<AttendanceRecord[]>(mockAttendance);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const filtered = records.filter(r => {
    if (searchQuery && !r.bookingId.toLowerCase().includes(searchQuery.toLowerCase()) && !r.devotee.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (filterStatus !== "all" && r.status !== filterStatus) return false;
    return true;
  });

  const markAttendance = (id: string, status: "Attended" | "No Show") => {
    setRecords(records.map(r => r.id === id ? { ...r, status } : r));
    toast.success(`Marked as ${status}`);
  };

  const handleExport = () => {
    const csv = [
      ["Booking ID", "Offering", "Type", "Structure", "Devotee", "Slot Time", "Status"].join(","),
      ...filtered.map(r => [r.bookingId, r.offering, r.type, r.structure, r.devotee, r.slotTime, r.status].join(","))
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `attendance-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Exported");
  };

  const statusColor = (s: string) => s === "Attended" ? "default" : s === "No Show" ? "destructive" : "secondary";

  const attended = records.filter(r => r.status === "Attended").length;
  const noShow = records.filter(r => r.status === "No Show").length;
  const pending = records.filter(r => r.status === "Pending").length;

  return (
    <div className="p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Attendance</h1>
            <p className="text-muted-foreground">Track ritual completion and darshan entry</p>
          </div>
          <Button variant="outline" onClick={handleExport} className="gap-2"><Download className="h-4 w-4" />Export</Button>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: "Attended", value: attended, color: "text-emerald-600" },
            { label: "No Show", value: noShow, color: "text-destructive" },
            { label: "Pending", value: pending, color: "text-amber-600" },
          ].map((s, i) => (
            <Card key={i}>
              <CardContent className="p-4 text-center">
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search ID or Devotee..." className="pl-9" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[140px] bg-background"><SelectValue /></SelectTrigger>
            <SelectContent className="bg-popover"><SelectItem value="all">All Status</SelectItem><SelectItem value="Attended">Attended</SelectItem><SelectItem value="No Show">No Show</SelectItem><SelectItem value="Pending">Pending</SelectItem></SelectContent>
          </Select>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg"><UserCheck className="h-5 w-5 text-primary" /></div>
              <div><CardTitle>Today's Attendance</CardTitle><CardDescription>{filtered.length} records</CardDescription></div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Offering</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Structure</TableHead>
                  <TableHead>Devotee</TableHead>
                  <TableHead>Slot Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(r => (
                  <TableRow key={r.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{r.offering}</TableCell>
                    <TableCell><Badge variant={r.type === "Ritual" ? "default" : "secondary"}>{r.type}</Badge></TableCell>
                    <TableCell className="text-muted-foreground text-sm">{r.structure}</TableCell>
                    <TableCell>{r.devotee}</TableCell>
                    <TableCell className="text-sm">{r.slotTime}</TableCell>
                    <TableCell><Badge variant={statusColor(r.status) as any}>{r.status}</Badge></TableCell>
                    <TableCell className="text-right">
                      {r.status === "Pending" && (
                        <div className="flex justify-end gap-1">
                          <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => markAttendance(r.id, "Attended")}>✓ Present</Button>
                          <Button size="sm" variant="ghost" className="h-7 text-xs text-destructive" onClick={() => markAttendance(r.id, "No Show")}>✗ No Show</Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Attendance;
