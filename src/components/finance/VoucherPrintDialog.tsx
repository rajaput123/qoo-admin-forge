import { Printer, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface VoucherPrintDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
}

export function VoucherPrintActions({
  onPreview,
  onPrint,
  previewLabel = "Preview",
  printLabel = "Print",
}: {
  onPreview: () => void;
  onPrint: () => void;
  previewLabel?: string;
  printLabel?: string;
}) {
  return (
    <div className="flex flex-wrap gap-2 print:hidden">
      <Button type="button" variant="outline" size="sm" onClick={onPreview}>
        <Eye className="h-4 w-4 mr-1.5" />
        {previewLabel}
      </Button>
      <Button type="button" variant="outline" size="sm" onClick={onPrint}>
        <Printer className="h-4 w-4 mr-1.5" />
        {printLabel}
      </Button>
    </div>
  );
}

export function VoucherPrintDialog({ open, onOpenChange, title, children }: VoucherPrintDialogProps) {
  const handlePrint = () => {
    printVoucherTemplate("voucher-print-root");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[92vh] overflow-y-auto print:hidden bg-white border">
        <DialogHeader className="print:hidden">
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div id="voucher-print-root" className="voucher-print-root py-2">
          {children}
        </div>
        <DialogFooter className="print:hidden">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button onClick={handlePrint} className="gap-2">
            <Printer className="h-4 w-4" />
            Print
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/** Print template only (no dialog chrome) — A4 landscape, both copies side by side */
export function printVoucherTemplate(contentId = "voucher-print-root") {
  const el = document.getElementById(contentId);
  if (!el) {
    window.print();
    return;
  }
  const existing = document.getElementById("voucher-print-clone-host");
  existing?.remove();

  const host = document.createElement("div");
  host.id = "voucher-print-clone-host";
  host.className = "voucher-print-clone-host";
  host.innerHTML = el.innerHTML;
  document.body.appendChild(host);
  document.body.classList.add("voucher-print-active");

  const cleanup = () => {
    document.body.classList.remove("voucher-print-active");
    host.remove();
    window.removeEventListener("afterprint", cleanup);
  };
  window.addEventListener("afterprint", cleanup);

  // Brief delay so clone layout is painted before print/PDF dialog
  requestAnimationFrame(() => {
    requestAnimationFrame(() => window.print());
  });
}
