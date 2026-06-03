import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Calendar, Info, Plus, X } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Frequency = "daily" | "weekly" | "monthly" | "annually" | "on-demand";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

const SlotCreation = () => {
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [frequency, setFrequency] = useState<Frequency>("daily");
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [monthlyDate, setMonthlyDate] = useState("1");
  const [annualDates, setAnnualDates] = useState<Date[]>([]);
  const [onDemandDates, setOnDemandDates] = useState<Date[]>([]);

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const toggleDate = (date: Date | undefined, list: Date[], setList: React.Dispatch<React.SetStateAction<Date[]>>) => {
    if (!date) return;
    const key = format(date, "yyyy-MM-dd");
    const exists = list.find((d) => format(d, "yyyy-MM-dd") === key);
    if (exists) {
      setList(list.filter((d) => format(d, "yyyy-MM-dd") !== key));
    } else {
      setList([...list, date]);
    }
  };

  const removeDate = (date: Date, setList: React.Dispatch<React.SetStateAction<Date[]>>) => {
    setList((prev) => prev.filter((d) => format(d, "yyyy-MM-dd") !== format(date, "yyyy-MM-dd")));
  };

  const helperText: Record<Frequency, string> = {
    daily: "This seva will be available every day within the selected date range.",
    weekly: "Seva will repeat on selected weekdays within the date range.",
    monthly: "Seva will repeat on a specific date every month within the range.",
    annually: "Seva will occur on the specific dates you pick each year.",
    "on-demand": "Admin picks the exact dates when this seva is available.",
  };

  const showDateRange = frequency === "daily" || frequency === "weekly" || frequency === "monthly";

  return (
    <div className="p-6 max-w-2xl">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-1">Create Seva Slot</h1>
          <p className="text-muted-foreground text-sm">Configure scheduling for this seva</p>
        </div>

        <div className="glass-card rounded-xl p-6 space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Scheduling</h2>
          </div>

          {/* Time Pickers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-time">Start Time</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="start-time" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="pl-10" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-time">End Time</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="end-time" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="pl-10" />
              </div>
            </div>
          </div>

          {/* Frequency */}
          <div className="space-y-2">
            <Label>Frequency</Label>
            <Select value={frequency} onValueChange={(v) => setFrequency(v as Frequency)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="annually">Annually</SelectItem>
                <SelectItem value="on-demand">On Demand</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Helper Text */}
          <div className="flex items-start gap-2 rounded-lg bg-muted/50 p-3">
            <Info className="h-4 w-4 text-primary mt-0.5 shrink-0" />
            <p className="text-sm text-muted-foreground">{helperText[frequency]}</p>
          </div>

          {/* Date Range for daily/weekly/monthly */}
          {showDateRange && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Active From</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !dateFrom && "text-muted-foreground")}>
                      <Calendar className="mr-2 h-4 w-4" />
                      {dateFrom ? format(dateFrom, "PPP") : "Pick start date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent mode="single" selected={dateFrom} onSelect={setDateFrom} initialFocus className="p-3 pointer-events-auto" />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label>Active Until</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !dateTo && "text-muted-foreground")}>
                      <Calendar className="mr-2 h-4 w-4" />
                      {dateTo ? format(dateTo, "PPP") : "Pick end date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent mode="single" selected={dateTo} onSelect={setDateTo} initialFocus className="p-3 pointer-events-auto" />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          )}

          {/* Frequency-specific controls */}
          <AnimatePresence mode="wait">
            {frequency === "weekly" && (
              <motion.div key="weekly" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="space-y-2 overflow-hidden">
                <Label>Select Days of Week</Label>
                <div className="flex flex-wrap gap-2">
                  {WEEKDAYS.map((day) => {
                    const active = selectedDays.includes(day);
                    return (
                      <Badge
                        key={day}
                        variant={active ? "default" : "outline"}
                        className={cn("cursor-pointer select-none px-3 py-1.5 text-sm transition-colors", active ? "bg-primary text-primary-foreground hover:bg-primary/90" : "hover:bg-muted")}
                        onClick={() => toggleDay(day)}
                      >
                        {day}
                      </Badge>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {frequency === "monthly" && (
              <motion.div key="monthly" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">On the</span>
                  <Select value={monthlyDate} onValueChange={setMonthlyDate}>
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 31 }, (_, i) => (
                        <SelectItem key={i + 1} value={String(i + 1)}>{i + 1}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <span className="text-sm text-muted-foreground">of every month</span>
                </div>
              </motion.div>
            )}

            {frequency === "annually" && (
              <motion.div key="annually" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="space-y-3 overflow-hidden">
                <Label>Pick Dates (yearly recurrence)</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal text-muted-foreground">
                      <Calendar className="mr-2 h-4 w-4" />
                      Select dates ({annualDates.length} selected)
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={undefined}
                      onSelect={(d) => toggleDate(d, annualDates, setAnnualDates)}
                      initialFocus
                      className="p-3 pointer-events-auto"
                      modifiers={{ selected: annualDates }}
                      modifiersStyles={{ selected: { backgroundColor: "hsl(var(--primary))", color: "hsl(var(--primary-foreground))" } }}
                    />
                  </PopoverContent>
                </Popover>
                {annualDates.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {annualDates.sort((a, b) => a.getTime() - b.getTime()).map((d) => (
                      <Badge key={d.toISOString()} variant="secondary" className="gap-1 text-xs">
                        {format(d, "dd MMM")}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => removeDate(d, setAnnualDates)} />
                      </Badge>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {frequency === "on-demand" && (
              <motion.div key="on-demand" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="space-y-3 overflow-hidden">
                <Label>Pick Available Dates</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal text-muted-foreground">
                      <Calendar className="mr-2 h-4 w-4" />
                      Select dates ({onDemandDates.length} selected)
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={undefined}
                      onSelect={(d) => toggleDate(d, onDemandDates, setOnDemandDates)}
                      initialFocus
                      className="p-3 pointer-events-auto"
                      modifiers={{ selected: onDemandDates }}
                      modifiersStyles={{ selected: { backgroundColor: "hsl(var(--primary))", color: "hsl(var(--primary-foreground))" } }}
                    />
                  </PopoverContent>
                </Popover>
                {onDemandDates.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {onDemandDates.sort((a, b) => a.getTime() - b.getTime()).map((d) => (
                      <Badge key={d.toISOString()} variant="secondary" className="gap-1 text-xs">
                        {format(d, "dd MMM yyyy")}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => removeDate(d, setOnDemandDates)} />
                      </Badge>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="outline">Cancel</Button>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Slot
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SlotCreation;
