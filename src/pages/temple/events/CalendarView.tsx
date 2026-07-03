import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, CalendarDays, MapPin, Clock } from "lucide-react";
import { useEvents } from "@/modules/events/hooks";
import type { TempleEvent } from "@/data/eventData";

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const statusConfig: Record<string, { bg: string; dot: string; text: string }> = {
  Draft: { bg: "bg-muted/60", dot: "bg-gray-400", text: "text-muted-foreground" },
  Scheduled: { bg: "bg-blue-50 dark:bg-blue-950/30", dot: "bg-blue-500", text: "text-blue-700 dark:text-blue-400" },
  Published: { bg: "bg-emerald-50 dark:bg-emerald-950/30", dot: "bg-emerald-500", text: "text-emerald-700 dark:text-emerald-400" },
  Ongoing: { bg: "bg-emerald-50 dark:bg-emerald-950/30", dot: "bg-emerald-500 animate-pulse", text: "text-emerald-700 dark:text-emerald-400" },
  Completed: { bg: "bg-amber-50 dark:bg-amber-950/30", dot: "bg-amber-500", text: "text-amber-700 dark:text-amber-400" },
  Cancelled: { bg: "bg-red-50 dark:bg-red-950/30", dot: "bg-red-500", text: "text-red-700 dark:text-red-400" },
  Archived: { bg: "bg-muted/40", dot: "bg-gray-400", text: "text-muted-foreground" },
};

const typeColors: Record<string, string> = {
  Festival: "border-l-orange-500",
  "Special Pooja": "border-l-purple-500",
  "Special Ritual": "border-l-purple-500",
  Cultural: "border-l-pink-500",
  Fundraiser: "border-l-emerald-500",
  Annadanam: "border-l-amber-500",
  Camp: "border-l-sky-500",
  VIP: "border-l-yellow-500",
  Public: "border-l-blue-500",
  Other: "border-l-gray-400",
};

const CalendarView = () => {
  const navigate = useNavigate();
  const events = useEvents();
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [structureFilter, setStructureFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDay }, (_, i) => i);
  // Fill trailing blanks to complete grid
  const totalCells = blanks.length + days.length;
  const trailingBlanks = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);

  const isToday = (day: number) =>
    currentYear === today.getFullYear() && currentMonth === today.getMonth() && day === today.getDate();

  const getEventsForDay = (day: number): TempleEvent[] => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return events.filter(e => {
      if (dateStr < e.startDate || dateStr > e.endDate) return false;
      if (structureFilter !== "all" && e.structureName !== structureFilter) return false;
      if (typeFilter !== "all" && e.type !== typeFilter) return false;
      if (e.status === "Completed") return false;
      return true;
    });
  };

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
    else setCurrentMonth(m => m - 1);
    setSelectedDay(null);
  };
  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
    else setCurrentMonth(m => m + 1);
    setSelectedDay(null);
  };
  const goToday = () => {
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
    setSelectedDay(today.getDate());
  };

  // Unique structures & types for filters
  const uniqueStructures = useMemo(() => [...new Set(events.map(e => e.structureName))], [events]);
  const uniqueTypes = useMemo(() => [...new Set(events.map(e => e.type))], [events]);

  // Events for selected day detail panel
  const selectedDayEvents = selectedDay ? getEventsForDay(selectedDay) : [];

  // Count total events this month
  const monthEventCount = useMemo(() => {
    let count = 0;
    for (let d = 1; d <= daysInMonth; d++) count += getEventsForDay(d).length;
    return count;
  }, [currentMonth, currentYear, structureFilter, typeFilter, events]);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Calendar</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{monthEventCount} event(s) in {months[currentMonth]} {currentYear}</p>
        </div>
        <Button variant="outline" size="sm" onClick={goToday}>
          <CalendarDays className="h-3.5 w-3.5 mr-1.5" />Today
        </Button>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={prevMonth}><ChevronLeft className="h-4 w-4" /></Button>
          <h2 className="text-lg font-semibold min-w-[180px] text-center select-none">{months[currentMonth]} {currentYear}</h2>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={nextMonth}><ChevronRight className="h-4 w-4" /></Button>
        </div>
        <div className="flex items-center gap-2">
          <Select value={structureFilter} onValueChange={setStructureFilter}>
            <SelectTrigger className="h-8 w-40 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              {uniqueStructures.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="h-8 w-36 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {uniqueTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-5">
        {/* Calendar Grid */}
        <div className="flex-1">
          <div className="rounded-xl border border-border/60 overflow-hidden shadow-sm">
            {/* Day headers */}
            <div className="grid grid-cols-7 bg-muted/50">
              {daysOfWeek.map(d => (
                <div key={d} className="py-2.5 text-center text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{d}</div>
              ))}
            </div>
            {/* Day cells */}
            <div className="grid grid-cols-7">
              {blanks.map(i => (
                <div key={`b-${i}`} className="min-h-[110px] border-t border-r last:border-r-0 bg-muted/10" />
              ))}
              {days.map(day => {
                const dayEvents = getEventsForDay(day);
                const active = selectedDay === day;
                const todayDay = isToday(day);
                return (
                  <div
                    key={day}
                    onClick={() => setSelectedDay(day === selectedDay ? null : day)}
                    className={`min-h-[110px] border-t border-r last:border-r-0 p-1.5 cursor-pointer transition-colors duration-150
                      ${active ? "bg-primary/5 ring-1 ring-inset ring-primary/30" : "hover:bg-muted/30"}
                    `}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full
                        ${todayDay ? "bg-primary text-primary-foreground font-bold" : "text-muted-foreground"}
                      `}>
                        {day}
                      </span>
                      {dayEvents.length > 0 && (
                        <span className="text-[10px] text-muted-foreground bg-muted rounded-full px-1.5 py-0.5">{dayEvents.length}</span>
                      )}
                    </div>
                    <div className="space-y-0.5">
                      {dayEvents.slice(0, 3).map(e => {
                        const cfg = statusConfig[e.status] || statusConfig.Draft;
                        const borderColor = typeColors[e.type] || "border-l-gray-400";
                        return (
                          <button
                            key={e.id}
                            onClick={(ev) => { ev.stopPropagation(); navigate(`/temple/events/${e.id}`); }}
                            className={`w-full text-left text-[10px] leading-tight px-1.5 py-1 rounded-md border-l-2 truncate font-medium transition-all hover:shadow-sm ${borderColor} ${cfg.bg} ${cfg.text}`}
                          >
                            {e.name}
                          </button>
                        );
                      })}
                      {dayEvents.length > 3 && (
                        <p className="text-[10px] text-muted-foreground text-center">+{dayEvents.length - 3} more</p>
                      )}
                    </div>
                  </div>
                );
              })}
              {Array.from({ length: trailingBlanks }).map((_, i) => (
                <div key={`tb-${i}`} className="min-h-[110px] border-t border-r last:border-r-0 bg-muted/10" />
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 mt-3 flex-wrap">
            <span className="text-[11px] font-medium text-muted-foreground">Event Types:</span>
            {Object.entries(typeColors).map(([type, color]) => (
              <div key={type} className="flex items-center gap-1.5">
                <span className={`w-3 h-1 rounded-full ${color.replace("border-l-", "bg-")}`} />
                <span className="text-[11px] text-muted-foreground">{type}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Side Panel — selected day details */}
        {selectedDay && (
          <div className="w-72 shrink-0">
            <Card className="sticky top-4 shadow-sm">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm">
                    {months[currentMonth]} {selectedDay}, {currentYear}
                  </h3>
                  <Badge variant="outline" className="text-[10px]">{selectedDayEvents.length} event(s)</Badge>
                </div>
                {selectedDayEvents.length === 0 ? (
                  <p className="text-xs text-muted-foreground py-6 text-center">No events on this day</p>
                ) : (
                  <div className="space-y-2">
                    {selectedDayEvents.map(e => {
                      const cfg = statusConfig[e.status] || statusConfig.Draft;
                      const borderColor = typeColors[e.type] || "border-l-gray-400";
                      return (
                        <button
                          key={e.id}
                          onClick={() => navigate(`/temple/events/${e.id}`)}
                          className={`w-full text-left p-3 rounded-lg border-l-3 transition-all hover:shadow-md ${borderColor} ${cfg.bg}`}
                        >
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${cfg.dot}`} />
                            <span className={`text-xs font-semibold truncate ${cfg.text}`}>{e.name}</span>
                          </div>
                          <div className="space-y-0.5 pl-3">
                            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                              <MapPin className="h-2.5 w-2.5" />{e.structureName}
                            </div>
                            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                              <Clock className="h-2.5 w-2.5" />{e.startDate === e.endDate ? e.startDate : `${e.startDate} → ${e.endDate}`}
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-2 pl-3">
                            <Badge variant="outline" className="text-[9px] h-4">{e.type}</Badge>
                            <Badge variant="outline" className={`text-[9px] h-4 border-0 ${cfg.bg} ${cfg.text}`}>{e.status}</Badge>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarView;
