import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const periodOptions = [
  { value: "today", label: "Today" },
  { value: "year", label: "This Year" },
  { value: "custom", label: "Custom Range" },
];

export type CustomRange = { from?: Date; to?: Date };

interface PeriodFilterProps {
  value: string;
  onChange: (v: string) => void;
  customRange?: CustomRange;
  onCustomRangeChange?: (range: CustomRange) => void;
}

const PeriodFilter = ({ value, onChange, customRange, onCustomRangeChange }: PeriodFilterProps) => {
  const [localRange, setLocalRange] = useState<CustomRange>({});
  const range = customRange ?? localRange;
  const setRange = (r: CustomRange) => {
    setLocalRange(r);
    onCustomRangeChange?.(r);
  };

  return (
    <div className="flex items-center gap-2">
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-[150px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {periodOptions.map(o => (
            <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      {value === "custom" && (
        <div className="flex items-center gap-1">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className={cn("h-9 text-xs justify-start gap-1", !range.from && "text-muted-foreground")}>
                <CalendarIcon className="h-3.5 w-3.5" />
                {range.from ? format(range.from, "dd MMM yyyy") : "From"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={range.from} onSelect={(d) => setRange({ ...range, from: d })} initialFocus className={cn("p-3 pointer-events-auto")} />
            </PopoverContent>
          </Popover>
          <span className="text-xs text-muted-foreground">–</span>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className={cn("h-9 text-xs justify-start gap-1", !range.to && "text-muted-foreground")}>
                <CalendarIcon className="h-3.5 w-3.5" />
                {range.to ? format(range.to, "dd MMM yyyy") : "To"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={range.to} onSelect={(d) => setRange({ ...range, to: d })} initialFocus className={cn("p-3 pointer-events-auto")} />
            </PopoverContent>
          </Popover>
        </div>
      )}
    </div>
  );
};

export default PeriodFilter;
