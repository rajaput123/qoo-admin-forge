import { useState } from "react";
import { format, startOfDay, startOfYear } from "date-fns";
import { CalendarIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

export type DateRange = { from: Date | null; to: Date | null };

interface FinanceDateFilterProps {
  onDateRangeChange: (range: DateRange) => void;
}

const FinanceDateFilter = ({ onDateRangeChange }: FinanceDateFilterProps) => {
  const [preset, setPreset] = useState("all");
  const [customFrom, setCustomFrom] = useState<Date | undefined>();
  const [customTo, setCustomTo] = useState<Date | undefined>();

  const getRange = (p: string, from?: Date, to?: Date): DateRange => {
    const now = new Date();
    switch (p) {
      case "today": return { from: startOfDay(now), to: now };
      case "this-year": return { from: startOfYear(now), to: now };
      case "custom": return { from: from || null, to: to || null };
      default: return { from: null, to: null };
    }
  };

  const handlePresetChange = (v: string) => {
    setPreset(v);
    if (v !== "custom") { setCustomFrom(undefined); setCustomTo(undefined); }
    onDateRangeChange(getRange(v));
  };

  const handleClear = () => {
    setPreset("all");
    setCustomFrom(undefined);
    setCustomTo(undefined);
    onDateRangeChange({ from: null, to: null });
  };

  return (
    <div className="flex items-center gap-2">
      <Select value={preset} onValueChange={handlePresetChange}>
        <SelectTrigger className="w-40 h-9">
          <CalendarIcon className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Time</SelectItem>
          <SelectItem value="today">Today</SelectItem>
          <SelectItem value="this-year">This Year</SelectItem>
          <SelectItem value="custom">Custom Range</SelectItem>
        </SelectContent>
      </Select>
      {preset === "custom" && (
        <div className="flex items-center gap-1">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className={cn("h-9 text-xs", !customFrom && "text-muted-foreground")}>
                {customFrom ? format(customFrom, "dd MMM yyyy") : "From"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={customFrom} onSelect={d => { setCustomFrom(d); onDateRangeChange(getRange("custom", d, customTo)); }} className={cn("p-3 pointer-events-auto")} />
            </PopoverContent>
          </Popover>
          <span className="text-xs text-muted-foreground">–</span>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className={cn("h-9 text-xs", !customTo && "text-muted-foreground")}>
                {customTo ? format(customTo, "dd MMM yyyy") : "To"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={customTo} onSelect={d => { setCustomTo(d); onDateRangeChange(getRange("custom", customFrom, d)); }} className={cn("p-3 pointer-events-auto")} />
            </PopoverContent>
          </Popover>
        </div>
      )}
      {preset !== "all" && (
        <Button variant="ghost" size="icon" className="h-9 w-9" onClick={handleClear}>
          <X className="h-3.5 w-3.5" />
        </Button>
      )}
    </div>
  );
};

export default FinanceDateFilter;
