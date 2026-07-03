import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { TableCell, TableHead } from "@/components/ui/table";
import { cn } from "@/lib/utils";

export { RadioGroup as FinanceTableRadioGroup };

export function FinanceTableRadioHead({ className }: { className?: string }) {
  return <TableHead className={cn("w-10 px-2", className)} />;
}

export function FinanceTableRadioCell({ value, className }: { value: string; className?: string }) {
  return (
    <TableCell className={cn("w-10 px-2 py-2.5", className)} onClick={(e) => e.stopPropagation()}>
      <RadioGroupItem value={value} aria-label={`Select row ${value}`} />
    </TableCell>
  );
}
