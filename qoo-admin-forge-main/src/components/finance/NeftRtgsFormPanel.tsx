import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NeftRtgsRemittanceForm } from "@/components/finance/NeftRtgsRemittanceForm";
import { printVoucherTemplate } from "@/components/finance/VoucherPrintDialog";
import { defaultNeftRtgsTemplate, type NeftRtgsFormData } from "@/data/neftRtgsTemplateData";

interface NeftRtgsFormPanelProps {
  data: NeftRtgsFormData;
  onChange: (patch: Partial<NeftRtgsFormData>) => void;
  className?: string;
  title?: string;
  printRootId?: string;
}

export function NeftRtgsFormPanel({
  data,
  onChange,
  className,
  title = "NEFT / RTGS Remittance Form",
  printRootId = "neft-voucher-print-root",
}: NeftRtgsFormPanelProps) {
  return (
    <div className={className}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 print:hidden">
        <div>
          <p className="text-sm font-semibold">{title}</p>
          <p className="text-xs text-muted-foreground">
            Customer Copy & Banker&apos;s Copy — A4 landscape preview (updates as you fill the form)
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => printVoucherTemplate(printRootId)}
        >
          <Printer className="h-4 w-4 mr-1.5" />
          Print
        </Button>
      </div>

      <div
        id={printRootId}
        className="voucher-print-root border rounded-lg overflow-x-auto bg-background shadow-sm"
      >
        <NeftRtgsRemittanceForm
          template={defaultNeftRtgsTemplate}
          data={data}
          onChange={onChange}
        />
      </div>
    </div>
  );
}
