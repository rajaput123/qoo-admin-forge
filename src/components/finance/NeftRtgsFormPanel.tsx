import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NeftRtgsRemittanceForm } from "@/components/finance/NeftRtgsRemittanceForm";
import { defaultNeftRtgsTemplate, type NeftRtgsFormData } from "@/data/neftRtgsTemplateData";

interface NeftRtgsFormPanelProps {
  data: NeftRtgsFormData;
  onChange: (patch: Partial<NeftRtgsFormData>) => void;
  className?: string;
  title?: string;
}

export function NeftRtgsFormPanel({
  data,
  onChange,
  className,
  title = "NEFT / RTGS Remittance Form",
}: NeftRtgsFormPanelProps) {
  return (
    <div className={className}>
      <div className="flex items-center justify-between gap-2 mb-3 print:hidden">
        <div>
          <p className="text-sm font-semibold">{title}</p>
          <p className="text-xs text-muted-foreground">
            Temple bank template — Customer Copy & Banker&apos;s Copy (auto-filled from payment details)
          </p>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={() => window.print()}>
          <Printer className="h-4 w-4 mr-1.5" /> Print
        </Button>
      </div>
      <div className="border rounded-lg overflow-hidden bg-background">
        <NeftRtgsRemittanceForm
          template={defaultNeftRtgsTemplate}
          data={data}
          onChange={onChange}
        />
      </div>
    </div>
  );
}
