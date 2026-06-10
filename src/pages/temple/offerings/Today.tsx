import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  CalendarCheck, Users, IndianRupee, Clock, Lock, Eye, AlertCircle, ChevronUp,
  ChevronLeft, ChevronRight, Sparkles, CalendarDays, List,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// --- Table data ---
const allSlots = [
  { id: "1", time: "5:30 AM", name: "Suprabhatam", type: "Ritual" as const, frequency: "Daily", structure: "Main Temple", capacity: 50, booked: 48, available: 2, priest: "Pandit Sharma", walkin: 0, status: "In Progress" },
  { id: "2", time: "7:00 AM", name: "Archana", type: "Ritual" as const, frequency: "Daily", structure: "Padmavathi Shrine", capacity: 30, booked: 30, available: 0, priest: "Pandit Rao", walkin: 0, status: "Fully Booked" },
  { id: "3", time: "9:00 AM", name: "Abhishekam", type: "Ritual" as const, frequency: "Daily", structure: "Main Temple", capacity: 25, booked: 18, available: 7, priest: "Pandit Kumar", walkin: 0, status: "Open" },
  { id: "4", time: "6:00 AM – 8:00 AM", name: "Morning Darshan", type: "Darshan" as const, frequency: "Daily", structure: "Main Temple", capacity: 500, booked: 320, available: 180, priest: "—", walkin: 45, status: "Open" },
  { id: "5", time: "8:00 AM – 10:00 AM", name: "Morning Darshan", type: "Darshan" as const, frequency: "Daily", structure: "Main Temple", capacity: 500, booked: 500, available: 0, priest: "—", walkin: 0, status: "Fully Booked" },
  { id: "6", time: "11:00 AM", name: "Sahasranama", type: "Ritual" as const, frequency: "Weekly", structure: "Varadaraja Shrine", capacity: 40, booked: 12, available: 28, priest: "Pandit Iyer", walkin: 0, status: "Open" },
  { id: "7", time: "10:00 AM – 12:00 PM", name: "Shrine Darshan", type: "Darshan" as const, frequency: "Daily", structure: "Padmavathi Shrine", capacity: 200, booked: 150, available: 50, priest: "—", walkin: 22, status: "Open" },
  { id: "8", time: "4:00 PM", name: "Ashtottara", type: "Ritual" as const, frequency: "Monthly", structure: "Lakshmi Shrine", capacity: 20, booked: 0, available: 20, priest: "Unassigned", walkin: 0, status: "Upcoming" },
  { id: "9", time: "4:00 PM – 6:00 PM", name: "Evening Darshan", type: "Darshan" as const, frequency: "Daily", structure: "Main Temple", capacity: 500, booked: 180, available: 320, priest: "—", walkin: 0, status: "Upcoming" },
  { id: "10", time: "7:00 PM", name: "Ekantha Seva", type: "Ritual" as const, frequency: "Daily", structure: "Main Temple", capacity: 15, booked: 15, available: 0, priest: "Pandit Sharma", walkin: 0, status: "Fully Booked" },
];

// --- Calendar data ---
const calendarOfferings = [
  { id: "1", name: "Suprabhatam", type: "Ritual" as const, structure: "Main Temple", time: "5:30 AM", price: 500, free: false, capacity: 50, booked: 38, frequency: "Daily" as const, color: "hsl(16, 85%, 35%)" },
  { id: "2", name: "Archana", type: "Ritual" as const, structure: "Padmavathi Shrine", time: "7:00 AM", price: 200, free: false, capacity: 30, booked: 22, frequency: "Daily" as const, color: "hsl(30, 80%, 50%)" },
  { id: "3", name: "Abhishekam", type: "Ritual" as const, structure: "Main Temple", time: "9:00 AM", price: 2000, free: false, capacity: 25, booked: 25, frequency: "Daily" as const, color: "hsl(280, 50%, 55%)" },
  { id: "4", name: "Morning Darshan", type: "Darshan" as const, structure: "Main Temple", time: "6:00 AM", price: 0, free: true, capacity: 500, booked: 312, frequency: "Daily" as const, color: "hsl(142, 60%, 40%)" },
  { id: "5", name: "VIP Darshan", type: "Darshan" as const, structure: "Main Temple", time: "8:00 AM", price: 300, free: false, capacity: 100, booked: 67, frequency: "Daily" as const, color: "hsl(200, 60%, 50%)" },
  { id: "6", name: "Sahasranama", type: "Ritual" as const, structure: "Varadaraja Shrine", time: "11:00 AM", price: 1500, free: false, capacity: 40, booked: 15, frequency: "Weekly" as const, daysOfWeek: [5], color: "hsl(45, 90%, 45%)" },
  { id: "7", name: "Special Puja", type: "Ritual" as const, structure: "Main Temple", time: "10:00 AM", price: 500, free: false, capacity: 20, booked: 12, frequency: "Daily" as const, color: "hsl(340, 60%, 50%)" },
];

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const statusColor = (s: string) => {
  if (s === "Fully Booked") return "destructive";
  if (s === "In Progress") return "default";
  if (s === "Open") return "secondary";
  return "outline";
};

const Today = () => {
  const [viewMode, setViewMode] = useState<"calendar" | "table">("calendar");
  const [viewBookings, setViewBookings] = useState<typeof allSlots[0] | null>(null);
  const [filterType, setFilterType] = useState("all");
  const [filterStructure, setFilterStructure] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterFrequency, setFilterFrequency] = useState("all");

  // Calendar state
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<number | null>(today.getDate());

  // Table filters
  const filtered = allSlots.filter(s => {
    if (filterType !== "all" && s.type !== filterType) return false;
    if (filterStructure !== "all" && s.structure !== filterStructure) return false;
    if (filterStatus !== "all" && s.status !== filterStatus) return false;
    if (filterFrequency !== "all" && s.frequency !== filterFrequency) return false;
    return true;
  });

  const structures = [...new Set(allSlots.map(s => s.structure))];
  const totalBookings = allSlots.reduce((a, r) => a + r.booked, 0);
  const fullyBooked = allSlots.filter(r => r.available === 0).length;
  const upcoming = allSlots.filter(s => s.status === "Upcoming");

  const kpis = [
    { label: "Total Bookings", value: totalBookings.toLocaleString(), icon: CalendarCheck },
    { label: "Revenue Today", value: `₹1,24,500`, icon: IndianRupee },
    { label: "Fully Booked", value: fullyBooked.toString(), icon: AlertCircle },
    { label: "Upcoming", value: upcoming.length.toString(), icon: Clock },
  ];

  // Calendar helpers
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const calendarDays = useMemo(() => {
    const days: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(d);
    return days;
  }, [firstDay, daysInMonth]);

  const isToday = (day: number) =>
    day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();

  const getOfferingsForDate = (day: number) => {
    const date = new Date(currentYear, currentMonth, day);
    const dow = date.getDay();
    return calendarOfferings.filter(o => {
      if (filterType !== "all" && o.type !== filterType) return false;
      if (filterStructure !== "all" && o.structure !== filterStructure) return false;
      if (o.frequency === "Daily") return true;
      if (o.frequency === "Weekly" && o.daysOfWeek?.includes(dow)) return true;
      return false;
    });
  };

  const selectedOfferings = selectedDate ? getOfferingsForDate(selectedDate) : [];

  const prevMonth = () => { if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); } else setCurrentMonth(m => m - 1); setSelectedDate(null); };
  const nextMonth = () => { if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); } else setCurrentMonth(m => m + 1); setSelectedDate(null); };
  const goToday = () => { setCurrentMonth(today.getMonth()); setCurrentYear(today.getFullYear()); setSelectedDate(today.getDate()); };

  const getOccupancyColor = (booked: number, capacity: number) => {
    const pct = (booked / capacity) * 100;
    if (pct >= 90) return "text-destructive";
    if (pct >= 60) return "text-amber-600";
    return "text-green-600";
  };

  return (
    <div className="p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        {/* Header with toggle */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Today's Operations</h1>
            <p className="text-muted-foreground">
              {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
          <div className="flex border rounded-lg overflow-hidden">
            <Button
              variant={viewMode === "calendar" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("calendar")}
              className="rounded-none gap-1.5"
            >
              <CalendarDays className="h-4 w-4" /> Calendar
            </Button>
            <Button
              variant={viewMode === "table" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("table")}
              className="rounded-none gap-1.5"
            >
              <List className="h-4 w-4" /> Table
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {kpis.map((kpi, i) => (
            <Card key={i} className="group hover:shadow-md transition-all duration-200">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-muted group-hover:bg-primary group-hover:shadow-lg transition-all duration-200">
                    <kpi.icon className="h-5 w-5 text-muted-foreground group-hover:text-primary-foreground transition-colors duration-200" />
                  </div>
                </div>
                <p className="text-2xl font-bold">{kpi.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{kpi.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ============ CALENDAR VIEW ============ */}
        {viewMode === "calendar" && (
          <div className="space-y-4">
            {/* Calendar Filters */}
            <div className="flex flex-wrap items-center gap-3">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[130px] h-9 bg-background"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Ritual">Rituals</SelectItem>
                  <SelectItem value="Darshan">Darshan</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStructure} onValueChange={setFilterStructure}>
                <SelectTrigger className="w-[160px] h-9 bg-background"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Structures</SelectItem>
                  <SelectItem value="Main Temple">Main Temple</SelectItem>
                  <SelectItem value="Padmavathi Shrine">Padmavathi Shrine</SelectItem>
                  <SelectItem value="Varadaraja Shrine">Varadaraja Shrine</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Calendar Grid */}
              <Card className="lg:col-span-2">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-5">
                    <Button variant="ghost" size="icon" onClick={prevMonth} className="h-9 w-9"><ChevronLeft className="h-5 w-5" /></Button>
                    <div className="flex items-center gap-3">
                      <h2 className="text-xl font-bold text-foreground">{MONTHS[currentMonth]} {currentYear}</h2>
                      <Button variant="outline" size="sm" onClick={goToday} className="text-xs h-7">Today</Button>
                    </div>
                    <Button variant="ghost" size="icon" onClick={nextMonth} className="h-9 w-9"><ChevronRight className="h-5 w-5" /></Button>
                  </div>

                  <div className="grid grid-cols-7 mb-2">
                    {WEEKDAYS.map(d => (
                      <div key={d} className="text-center text-xs font-semibold text-muted-foreground py-2">{d}</div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-1">
                    {calendarDays.map((day, idx) => {
                      if (day === null) return <div key={`e-${idx}`} className="aspect-square" />;
                      const dayOfferings = getOfferingsForDate(day);
                      const isSelected = selectedDate === day;
                      const todayMark = isToday(day);
                      return (
                        <motion.button
                          key={day}
                          whileHover={{ scale: 1.04 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => setSelectedDate(day)}
                          className={cn(
                            "aspect-square rounded-xl p-1.5 flex flex-col items-center justify-start gap-0.5 transition-all border",
                            isSelected ? "bg-primary text-primary-foreground border-primary shadow-lg"
                              : todayMark ? "bg-primary/10 border-primary/30"
                              : "border-transparent hover:bg-muted/60",
                          )}
                        >
                          <span className={cn("text-sm font-semibold", isSelected ? "text-primary-foreground" : todayMark ? "text-primary" : "text-foreground")}>{day}</span>
                          {dayOfferings.length > 0 && (
                            <div className="flex flex-wrap justify-center gap-[2px] mt-0.5">
                              {dayOfferings.slice(0, 4).map(o => (
                                <div key={o.id} className={cn("w-1.5 h-1.5 rounded-full", isSelected && "opacity-80")}
                                  style={{ backgroundColor: isSelected ? "hsl(var(--primary-foreground))" : o.color }} />
                              ))}
                              {dayOfferings.length > 4 && (
                                <span className={cn("text-[8px] leading-none", isSelected ? "text-primary-foreground/70" : "text-muted-foreground")}>+{dayOfferings.length - 4}</span>
                              )}
                            </div>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>

                  {/* Legend */}
                  <div className="flex flex-wrap items-center gap-4 mt-5 pt-4 border-t">
                    <span className="text-xs font-medium text-muted-foreground">Legend:</span>
                    {calendarOfferings.slice(0, 6).map(o => (
                      <div key={o.id} className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: o.color }} />
                        <span className="text-xs text-muted-foreground">{o.name}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Day Detail Panel */}
              <div className="space-y-4">
                <AnimatePresence mode="wait">
                  {selectedDate ? (
                    <motion.div key={selectedDate} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }} className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-bold text-foreground">{selectedDate} {MONTHS[currentMonth].slice(0, 3)} {currentYear}</h3>
                          <p className="text-xs text-muted-foreground">{selectedOfferings.length} offering{selectedOfferings.length !== 1 ? "s" : ""}</p>
                        </div>
                        {isToday(selectedDate) && <Badge className="bg-primary/10 text-primary border-0">Today</Badge>}
                      </div>
                      {selectedOfferings.length === 0 ? (
                        <Card><CardContent className="py-12 text-center"><Sparkles className="h-10 w-10 mx-auto mb-3 text-muted-foreground/30" /><p className="text-sm text-muted-foreground">No offerings on this day</p></CardContent></Card>
                      ) : (
                        selectedOfferings.map(o => {
                          const pct = Math.round((o.booked / o.capacity) * 100);
                          return (
                            <Card key={o.id} className="overflow-hidden hover:shadow-md transition-shadow">
                              <div className="h-1" style={{ backgroundColor: o.color }} />
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between mb-2">
                                  <div><h4 className="font-semibold text-foreground">{o.name}</h4><p className="text-xs text-muted-foreground">{o.structure}</p></div>
                                  <Badge variant={o.type === "Ritual" ? "default" : "secondary"} className="text-[10px]">{o.type}</Badge>
                                </div>
                                <div className="grid grid-cols-3 gap-3 mt-3">
                                  <div className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-muted-foreground" /><span className="text-xs">{o.time}</span></div>
                                  <div className="flex items-center gap-1.5"><IndianRupee className="h-3.5 w-3.5 text-muted-foreground" /><span className="text-xs">{o.free ? "Free" : `₹${o.price}`}</span></div>
                                  <div className="flex items-center gap-1.5"><Users className={cn("h-3.5 w-3.5", getOccupancyColor(o.booked, o.capacity))} /><span className="text-xs">{o.booked}/{o.capacity}</span></div>
                                </div>
                                <div className="mt-3">
                                  <div className="flex justify-between text-[10px] text-muted-foreground mb-1"><span>Occupancy</span><span className={getOccupancyColor(o.booked, o.capacity)}>{pct}%</span></div>
                                  <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                                    <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.5, delay: 0.1 }} className="h-full rounded-full" style={{ backgroundColor: o.color }} />
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })
                      )}
                    </motion.div>
                  ) : (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
                      <Sparkles className="h-12 w-12 mx-auto mb-3 text-muted-foreground/20" />
                      <p className="text-sm text-muted-foreground">Select a date to view offerings</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        )}

        {/* ============ TABLE VIEW ============ */}
        {viewMode === "table" && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[140px] bg-background"><SelectValue placeholder="Type" /></SelectTrigger>
                <SelectContent><SelectItem value="all">All Types</SelectItem><SelectItem value="Ritual">Ritual</SelectItem><SelectItem value="Darshan">Darshan</SelectItem></SelectContent>
              </Select>
              <Select value={filterFrequency} onValueChange={setFilterFrequency}>
                <SelectTrigger className="w-[150px] bg-background"><SelectValue placeholder="Frequency" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Frequencies</SelectItem>
                  <SelectItem value="Daily">Daily</SelectItem>
                  <SelectItem value="Weekly">Weekly</SelectItem>
                  <SelectItem value="Monthly">Monthly</SelectItem>
                  <SelectItem value="Annual">Annual</SelectItem>
                  <SelectItem value="On Demand">On Demand</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStructure} onValueChange={setFilterStructure}>
                <SelectTrigger className="w-[170px] bg-background"><SelectValue placeholder="Structure" /></SelectTrigger>
                <SelectContent><SelectItem value="all">All Structures</SelectItem>{structures.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[150px] bg-background"><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent><SelectItem value="all">All Status</SelectItem><SelectItem value="Open">Open</SelectItem><SelectItem value="Fully Booked">Fully Booked</SelectItem><SelectItem value="In Progress">In Progress</SelectItem><SelectItem value="Upcoming">Upcoming</SelectItem></SelectContent>
              </Select>
              <Badge variant="secondary" className="ml-auto">{filtered.length} slots</Badge>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Time</TableHead>
                      <TableHead>Offering</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Frequency</TableHead>
                      <TableHead>Structure</TableHead>
                      <TableHead className="text-center">Capacity</TableHead>
                      <TableHead className="text-center">Booked</TableHead>
                      <TableHead className="text-center">Available</TableHead>
                      <TableHead className="text-center">Walk-in</TableHead>
                      <TableHead>Priest</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map(r => (
                      <TableRow key={r.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium text-sm">{r.time}</TableCell>
                        <TableCell className="font-medium">{r.name}</TableCell>
                        <TableCell><Badge variant={r.type === "Ritual" ? "default" : "secondary"}>{r.type}</Badge></TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`text-[10px] ${
                            r.frequency === "Daily" ? "text-green-700 border-green-300 bg-green-50"
                            : r.frequency === "Weekly" ? "text-blue-700 border-blue-300 bg-blue-50"
                            : r.frequency === "Monthly" ? "text-amber-700 border-amber-300 bg-amber-50"
                            : "text-purple-700 border-purple-300 bg-purple-50"
                          }`}>{r.frequency}</Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">{r.structure}</TableCell>
                        <TableCell className="text-center">{r.capacity}</TableCell>
                        <TableCell className="text-center font-medium">{r.booked}</TableCell>
                        <TableCell className="text-center"><span className={r.available === 0 ? "text-destructive font-medium" : "text-emerald-600 font-medium"}>{r.available}</span></TableCell>
                        <TableCell className="text-center text-muted-foreground">{r.type === "Darshan" ? r.walkin : "—"}</TableCell>
                        <TableCell className="text-sm">{r.priest}</TableCell>
                        <TableCell><Badge variant={statusColor(r.status) as any}>{r.status}</Badge></TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" onClick={() => toast.success(`Capacity increased for ${r.name}`)}><ChevronUp className="h-3 w-3" /> +Cap</Button>
                            <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" onClick={() => toast.info(`Slot locked: ${r.name}`)}><Lock className="h-3 w-3" /></Button>
                            <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" onClick={() => setViewBookings(r)}><Eye className="h-3 w-3" /></Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filtered.length === 0 && (
                      <TableRow><TableCell colSpan={11} className="text-center py-8 text-muted-foreground">No slots match filters</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}
      </motion.div>

      {/* View Bookings Dialog */}
      <Dialog open={!!viewBookings} onOpenChange={() => setViewBookings(null)}>
        <DialogContent className="sm:max-w-[500px] bg-background">
          <DialogHeader>
            <DialogTitle>Bookings – {viewBookings?.name}</DialogTitle>
            <DialogDescription>{viewBookings?.time} · {viewBookings?.structure} · {viewBookings?.type}</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-muted/50 rounded-lg text-center"><p className="text-xs text-muted-foreground">Capacity</p><p className="text-xl font-bold">{viewBookings?.capacity}</p></div>
              <div className="p-3 bg-muted/50 rounded-lg text-center"><p className="text-xs text-muted-foreground">Booked</p><p className="text-xl font-bold text-primary">{viewBookings?.booked}</p></div>
              <div className="p-3 bg-muted/50 rounded-lg text-center"><p className="text-xs text-muted-foreground">Available</p><p className="text-xl font-bold text-emerald-600">{viewBookings?.available}</p></div>
            </div>
            {viewBookings?.type === "Darshan" && viewBookings.walkin > 0 && (
              <div className="p-3 bg-muted/50 rounded-lg text-center"><p className="text-xs text-muted-foreground">Walk-in Count</p><p className="text-xl font-bold">{viewBookings.walkin}</p></div>
            )}
            <p className="text-sm text-muted-foreground">Priest: {viewBookings?.priest}</p>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setViewBookings(null)}>Close</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Today;
