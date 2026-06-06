import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CashUpiVoucherForm } from "@/components/finance/CashUpiVoucherForm";
import { printVoucherTemplate } from "@/components/finance/VoucherPrintDialog";
import type { CashUpiVoucherData } from "@/data/cashUpiVoucherData";

interface CashUpiVoucherPanelProps {
  data: CashUpiVoucherData;
  className?: string;
  title?: string;
  printRootId?: string;
}

export function CashUpiVoucherPanel({
  data,
  className,
  title,
  printRootId = "cash-upi-voucher-print-root",
}: CashUpiVoucherPanelProps) {
  const heading = title ?? `${data.paymentMode} Voucher`;

  return (
    <div className={className}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 print:hidden">
        <div>
          <p className="text-sm font-semibold">{heading}</p>
          <p className="text-xs text-muted-foreground">
            Customer Copy & Office Copy — A4 landscape preview (updates as you fill the form)
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
        <CashUpiVoucherForm data={data} />
      </div>
    </div>
  );
}
