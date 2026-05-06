import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const periodOptions = [
  { value: "today", label: "Today" },
  { value: "year", label: "This Year" },
  { value: "custom", label: "Custom Range" },
];

const PeriodFilter = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
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
);

export default PeriodFilter;
