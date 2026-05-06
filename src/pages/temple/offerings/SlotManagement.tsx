import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Clock, Plus, Lock, XCircle, ChevronUp, ChevronDown, Users, LayoutGrid, List, ChevronLeft, ChevronRight, Calendar, Info } from "lucide-react";
import { toast } from "sonner";
import SearchableSelect from "@/components/SearchableSelect";
import { cn } from "@/lib/utils";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek } from "date-fns";

interface Slot {
  id: string;
  date: string;
  time: string;
  offering: string;
  structure: string;
  type: "Ritual" | "Darshan";
  capacity: number;
  booked: number;
  available: number;
  priest: string;
  status: "Open" | "Locked" | "Cancelled" | "Completed";
}

const mockSlots: Slot[] = [
  { id: "1", date: "2026-02-09", time: "5:30 AM", offering: "Suprabhatam", structure: "Main Temple", type: "Ritual", capacity: 50, booked: 48, available: 2, priest: "Pandit Sharma", status: "Completed" },
  { id: "2", date: "2026-02-09", time: "7:00 AM", offering: "Archana", structure: "Padmavathi Shrine", type: "Ritual", capacity: 30, booked: 30, available: 0, priest: "Pandit Rao", status: "Completed" },
  { id: "3", date: "2026-02-09", time: "9:00 AM", offering: "Abhishekam", structure: "Main Temple", type: "Ritual", capacity: 25, booked: 18, available: 7, priest: "Pandit Kumar", status: "Open" },
  { id: "4", date: "2026-02-09", time: "6:00 AM", offering: "Morning Darshan", structure: "Main Temple", type: "Darshan", capacity: 500, booked: 320, available: 180, priest: "—", status: "Open" },
  { id: "5", date: "2026-02-10", time: "5:30 AM", offering: "Suprabhatam", structure: "Main Temple", type: "Ritual", capacity: 50, booked: 12, available: 38, priest: "Pandit Sharma", status: "Open" },
  { id: "6", date: "2026-02-10", time: "7:00 AM", offering: "Archana", structure: "Padmavathi Shrine", type: "Ritual", capacity: 30, booked: 5, available: 25, priest: "Unassigned", status: "Open" },
  { id: "7", date: "2026-02-10", time: "9:00 AM", offering: "Abhishekam", structure: "Main Temple", type: "Ritual", capacity: 25, booked: 0, available: 25, priest: "Unassigned", status: "Open" },
  { id: "8", date: "2026-02-11", time: "5:30 AM", offering: "Suprabhatam", structure: "Main Temple", type: "Ritual", capacity: 50, booked: 0, available: 50, priest: "Unassigned", status: "Open" },
  { id: "9", date: "2026-02-12", time: "9:00 AM", offering: "Abhishekam", structure: "Main Temple", type: "Ritual", capacity: 25, booked: 10, available: 15, priest: "Pandit Kumar", status: "Open" },
  { id: "10", date: "2026-02-14", time: "5:30 AM", offering: "Suprabhatam", structure: "Main Temple", type: "Ritual", capacity: 50, booked: 5, available: 45, priest: "Pandit Sharma", status: "Open" },
  { id: "11", date: "2026-02-14", time: "6:00 AM", offering: "Morning Darshan", structure: "Main Temple", type: "Darshan", capacity: 500, booked: 100, available: 400, priest: "—", status: "Open" },
  { id: "12", date: "2026-02-15", time: "7:00 AM", offering: "Archana", structure: "Padmavathi Shrine", type: "Ritual", capacity: 30, booked: 0, available: 30, priest: "Unassigned", status: "Open" },
];

const priestOptions = [
  { value: "Pandit Sharma", label: "Pandit Sharma" },
  { value: "Pandit Rao", label: "Pandit Rao" },
  { value: "Pandit Kumar", label: "Pandit Kumar" },
  { value: "Pandit Iyer", label: "Pandit Iyer" },
];

const statusColor = (s: string) => {
  if (s === "Open") return "secondary";
  if (s === "Locked") return "outline";
  if (s === "Cancelled") return "destructive";
  return "default";
};

const SlotManagement = () => {
  const [slots, setSlots] = useState<Slot[]>(mockSlots);
  const [viewMode, setViewMode] = useState<"table" | "calendar">("calendar");
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 1, 1));
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date(2026, 1, 9));
  const [filterOffering, setFilterOffering] = useState("all");
  const [isGenerateOpen, setIsGenerateOpen] = useState(false);
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [assignPriest, setAssignPriest] = useState("");
  const [genFrom, setGenFrom] = useState("");
  const [genTo, setGenTo] = useState("");
  const [genOffering, setGenOffering] = useState("all");
  const [genTime, setGenTime] = useState("");

  const filtered = slots.filter(s => {
    if (filterOffering !== "all" && s.offering !== filterOffering) return false;
    return true;
  });

  const handleCapacity = (id: string, delta: number) => {
    setSlots(slots.map(s => {
      if (s.id !== id) return s;
      const newCap = Math.max(s.booked, s.capacity + delta);
      return { ...s, capacity: newCap, available: newCap - s.booked };
    }));
    toast.success(`Capacity ${delta > 0 ? "increased" : "decreased"}`);
  };

  const handleLock = (id: string) => {
    setSlots(slots.map(s => s.id === id ? { ...s, status: "Locked" } : s));
    toast.info("Slot locked");
  };

  const handleCancel = (id: string) => {
    setSlots(slots.map(s => s.id === id ? { ...s, status: "Cancelled" } : s));
    toast.warning("Slot cancelled");
  };

  const handleAssign = () => {
    if (selectedSlot && assignPriest) {
      setSlots(slots.map(s => s.id === selectedSlot.id ? { ...s, priest: assignPriest } : s));
      toast.success(`Priest assigned: ${assignPriest}`);
    }
    setIsAssignOpen(false);
    setSelectedSlot(null);
    setAssignPriest("");
  };

  const uniqueOfferings = [...new Set(slots.map(s => s.offering))];

  // Get offering details from existing slots (in real app, fetch from offerings API)
  const getOfferingDetails = (offeringName: string) => {
    const existingSlot = slots.find(s => s.offering === offeringName);
    if (existingSlot) {
      return {
        time: existingSlot.time,
        structure: existingSlot.structure,
        type: existingSlot.type,
        capacity: existingSlot.capacity,
      };
    }
    // Default fallback
    return {
      time: "9:00 AM",
      structure: "Main Temple",
      type: "Ritual" as const,
      capacity: 50,
    };
  };

  const formatTime = (timeStr: string) => {
    // Convert "05:30" to "5:30 AM" format
    const [hours, minutes] = timeStr.split(":");
    const hour = parseInt(hours, 10);
    const min = minutes;
    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${min} ${period}`;
  };

  const handleGenerate = () => {
    if (!genFrom || !genTo) {
      toast.error("Please select date range");
      return;
    }
    if (genOffering === "all") {
      toast.error("Please select an offering");
      return;
    }
    if (!genTime) {
      toast.error("Please enter time");
      return;
    }

    const from = new Date(genFrom);
    const to = new Date(genTo);
    if (from > to) {
      toast.error("From date must be before To date");
      return;
    }

    const offeringDetails = getOfferingDetails(genOffering);
    const formattedTime = formatTime(genTime);
    const newSlots: Slot[] = [];
    const currentDate = new Date(from);

    while (currentDate <= to) {
      const dateStr = format(currentDate, "yyyy-MM-dd");
      // Check if slot already exists for this date + offering + time
      const exists = slots.some(s => s.date === dateStr && s.offering === genOffering && s.time === formattedTime);
      if (!exists) {
        newSlots.push({
          id: `gen-${Date.now()}-${newSlots.length}`,
          date: dateStr,
          time: formattedTime,
          offering: genOffering,
          structure: offeringDetails.structure,
          type: offeringDetails.type,
          capacity: offeringDetails.capacity,
          booked: 0,
          available: offeringDetails.capacity,
          priest: "Unassigned",
          status: "Open",
        });
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    if (newSlots.length === 0) {
      toast.info("No new slots to generate (all slots already exist)");
    } else {
      setSlots([...slots, ...newSlots]);
      toast.success(`Generated ${newSlots.length} slot(s)`);
    }

    setIsGenerateOpen(false);
    setGenFrom("");
    setGenTo("");
    setGenOffering("all");
    setGenTime("");
  };

  // Calendar helpers
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calStart = startOfWeek(monthStart);
  const calEnd = endOfWeek(monthEnd);
  const calDays = eachDayOfInterval({ start: calStart, end: calEnd });

  const getSlotsForDate = (date: Date) => filtered.filter(s => s.date === format(date, "yyyy-MM-dd"));
  const selectedDateSlots = selectedDate ? getSlotsForDate(selectedDate) : [];

  return (
    <div className="p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Slot Management</h1>
            <p className="text-muted-foreground">Control date-wise execution of offerings</p>
          </div>
          <div className="flex gap-2">
            <div className="flex border rounded-lg overflow-hidden">
              <Button variant={viewMode === "calendar" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("calendar")} className="rounded-none gap-1"><LayoutGrid className="h-4 w-4" />Calendar</Button>
              <Button variant={viewMode === "table" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("table")} className="rounded-none gap-1"><List className="h-4 w-4" />Table</Button>
            </div>
            <Button onClick={() => setIsGenerateOpen(true)} className="gap-2"><Plus className="h-4 w-4" />Generate Slots</Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <Select value={filterOffering} onValueChange={setFilterOffering}>
            <SelectTrigger className="w-[180px] bg-background"><SelectValue placeholder="Offering" /></SelectTrigger>
            <SelectContent className="bg-popover">
              <SelectItem value="all">All Offerings</SelectItem>
              {uniqueOfferings.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {viewMode === "calendar" ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendar */}
            <Card className="lg:col-span-2">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{format(currentMonth, "MMMM yyyy")}</CardTitle>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}><ChevronLeft className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}><ChevronRight className="h-4 w-4" /></Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
                    <div key={d} className="bg-muted/50 p-2 text-center text-xs font-medium text-muted-foreground">{d}</div>
                  ))}
                  {calDays.map((day, i) => {
                    const daySlots = getSlotsForDate(day);
                    const inMonth = isSameMonth(day, currentMonth);
                    const today = isToday(day);
                    const selected = selectedDate && isSameDay(day, selectedDate);
                    const hasSlots = daySlots.length > 0;
                    const fullyBooked = daySlots.length > 0 && daySlots.every(s => s.available === 0);

                    return (
                      <button
                        key={i}
                        onClick={() => setSelectedDate(day)}
                        className={`bg-card p-2 min-h-[80px] text-left transition-all hover:bg-muted/50 ${
                          !inMonth ? "opacity-30" : ""
                        } ${selected ? "ring-2 ring-primary ring-inset" : ""}`}
                      >
                        <div className={`text-xs font-medium mb-1 ${today ? "text-primary font-bold" : ""}`}>
                          {format(day, "d")}
                        </div>
                        {hasSlots && (
                          <div className="space-y-0.5">
                            {daySlots.slice(0, 3).map(s => (
                              <div key={s.id} className={`text-[10px] px-1 py-0.5 rounded truncate ${
                                s.available === 0 ? "bg-destructive/10 text-destructive" :
                                s.status === "Completed" ? "bg-muted text-muted-foreground" :
                                "bg-primary/10 text-primary"
                              }`}>
                                {s.time.split(" ")[0]} {s.offering.substring(0, 8)}
                              </div>
                            ))}
                            {daySlots.length > 3 && (
                              <p className="text-[10px] text-muted-foreground pl-1">+{daySlots.length - 3} more</p>
                            )}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Selected Date Slots */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">
                  {selectedDate ? format(selectedDate, "EEE, dd MMM yyyy") : "Select a date"}
                </CardTitle>
                <CardDescription>{selectedDateSlots.length} slots</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 max-h-[500px] overflow-y-auto">
                {selectedDateSlots.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">No slots for this date</p>
                ) : (
                  selectedDateSlots.map(s => (
                    <div key={s.id} className={`p-3 border rounded-lg space-y-2 ${s.status === "Cancelled" ? "opacity-50" : ""}`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">{s.offering}</p>
                          <p className="text-xs text-muted-foreground">{s.time} · {s.structure}</p>
                        </div>
                        <Badge variant={statusColor(s.status) as any} className="text-[10px]">{s.status}</Badge>
                      </div>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="text-muted-foreground">Cap: <strong>{s.capacity}</strong></span>
                        <span className="text-muted-foreground">Booked: <strong>{s.booked}</strong></span>
                        <span className={s.available === 0 ? "text-destructive font-medium" : "text-emerald-600 font-medium"}>Avail: {s.available}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">Priest: {s.priest}</p>
                        {s.status === "Open" && (
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleCapacity(s.id, 5)}><ChevronUp className="h-3 w-3" /></Button>
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleCapacity(s.id, -5)}><ChevronDown className="h-3 w-3" /></Button>
                            {s.type === "Ritual" && <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => { setSelectedSlot(s); setIsAssignOpen(true); }}><Users className="h-3 w-3" /></Button>}
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleLock(s.id)}><Lock className="h-3 w-3" /></Button>
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleCancel(s.id)}><XCircle className="h-3 w-3 text-destructive" /></Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg"><Clock className="h-5 w-5 text-primary" /></div>
                <div><CardTitle>All Slots</CardTitle><CardDescription>{filtered.length} slots</CardDescription></div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Offering</TableHead>
                    <TableHead>Structure</TableHead>
                    <TableHead className="text-center">Capacity</TableHead>
                    <TableHead className="text-center">Booked</TableHead>
                    <TableHead className="text-center">Available</TableHead>
                    <TableHead>Priest</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map(s => (
                    <TableRow key={s.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium text-sm">{s.date}</TableCell>
                      <TableCell className="text-sm">{s.time}</TableCell>
                      <TableCell className="font-medium">{s.offering}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">{s.structure}</TableCell>
                      <TableCell className="text-center">{s.capacity}</TableCell>
                      <TableCell className="text-center font-medium">{s.booked}</TableCell>
                      <TableCell className="text-center"><span className={s.available === 0 ? "text-destructive font-medium" : "text-emerald-600 font-medium"}>{s.available}</span></TableCell>
                      <TableCell className="text-sm">{s.priest}</TableCell>
                      <TableCell><Badge variant={statusColor(s.status) as any}>{s.status}</Badge></TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleCapacity(s.id, 5)} disabled={s.status !== "Open"}><ChevronUp className="h-3 w-3" /></Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleCapacity(s.id, -5)} disabled={s.status !== "Open"}><ChevronDown className="h-3 w-3" /></Button>
                          {s.type === "Ritual" && <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setSelectedSlot(s); setIsAssignOpen(true); }} disabled={s.status !== "Open"}><Users className="h-3 w-3" /></Button>}
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleLock(s.id)} disabled={s.status !== "Open"}><Lock className="h-3 w-3" /></Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleCancel(s.id)} disabled={s.status !== "Open"}><XCircle className="h-3 w-3 text-destructive" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </motion.div>

      {/* Generate Slots Dialog */}
      <Dialog open={isGenerateOpen} onOpenChange={() => { setIsGenerateOpen(false); setGenFrom(""); setGenTo(""); setGenOffering("all"); setGenTime(""); }}>
        <DialogContent className="sm:max-w-[450px] bg-background">
          <DialogHeader><DialogTitle>Generate Slots</DialogTitle><DialogDescription>Bulk generate slots for a date range</DialogDescription></DialogHeader>
          <div className="space-y-3 py-2">
            <div><Label>From Date</Label><Input type="date" value={genFrom} onChange={e => setGenFrom(e.target.value)} /></div>
            <div><Label>To Date</Label><Input type="date" value={genTo} onChange={e => setGenTo(e.target.value)} /></div>
            <div><Label>Offering</Label>
              <Select value={genOffering} onValueChange={setGenOffering}>
                <SelectTrigger className="bg-background"><SelectValue placeholder="Select offering" /></SelectTrigger>
                <SelectContent className="bg-popover">
                  <SelectItem value="all">All Active Offerings</SelectItem>
                  {uniqueOfferings.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div><Label>Time</Label><Input type="time" value={genTime} onChange={e => setGenTime(e.target.value)} placeholder="e.g. 05:30" /></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => { setIsGenerateOpen(false); setGenFrom(""); setGenTo(""); setGenOffering("all"); setGenTime(""); }}>Cancel</Button><Button onClick={handleGenerate}>Generate</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Priest Dialog */}
      <Dialog open={isAssignOpen} onOpenChange={setIsAssignOpen}>
        <DialogContent className="sm:max-w-[400px] bg-background">
          <DialogHeader><DialogTitle>Assign Priest</DialogTitle><DialogDescription>{selectedSlot?.offering} – {selectedSlot?.date} {selectedSlot?.time}</DialogDescription></DialogHeader>
          <SearchableSelect options={priestOptions} value={assignPriest} onValueChange={setAssignPriest} placeholder="Select priest" />
          <DialogFooter><Button variant="outline" onClick={() => setIsAssignOpen(false)}>Cancel</Button><Button onClick={handleAssign}>Assign</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SlotManagement;
