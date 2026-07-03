import { cn } from "@/lib/utils";
import { defaultTempleReceiptHeader, type CashUpiVoucherData } from "@/data/cashUpiVoucherData";

function formatDisplayDate(iso: string) {
  if (!iso) return "—";
  const d = new Date(iso + "T12:00:00");
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function formatAmount(amount: string) {
  const n = Number(amount);
  if (!amount || Number.isNaN(n)) return "—";
  return `₹${n.toLocaleString("en-IN")}`;
}

function VoucherCopy({
  label,
  data,
  variant,
}: {
  label: string;
  data: CashUpiVoucherData;
  variant: "customer" | "office";
}) {
  return (
    <div className="flex-1 min-w-0 border border-foreground/80 p-4 bg-background text-foreground">
      <p className="text-right text-xs font-bold mb-2 underline underline-offset-2">{label}</p>
      <div className="text-center border-b border-foreground/30 pb-2 mb-3">
        <p className="text-sm font-bold">{defaultTempleReceiptHeader.name}</p>
        <p className="text-[10px] text-muted-foreground">{defaultTempleReceiptHeader.address}</p>
        <p className="text-[10px]">{defaultTempleReceiptHeader.phone}</p>
      </div>

      <p className="text-center text-xs font-bold uppercase tracking-wide mb-3">
        {data.voucherType} Voucher — {data.paymentMode}
      </p>

      <table className="w-full border-collapse text-[11px]">
        <tbody>
          {[
            ["Voucher No.", data.voucherNo || "—"],
            ["Date", formatDisplayDate(data.date)],
            ["Temple / Unit", data.temple],
            ["Name", data.payerName || "—"],
            ["Mobile", data.mobile || "—"],
            ["PAN", data.pan || "—"],
            ["Category", data.category || "—"],
            ["Account Head", data.accountHead || "—"],
            ["Amount", formatAmount(data.amount)],
            ...(data.paymentMode.toUpperCase().includes("UPI")
              ? [["UPI / Ref No.", data.utrRef || "—"]]
              : []),
            ["Purpose", data.purpose || "—"],
            ["Narration", data.narration || "—"],
            ["80G Certificate", data.certificate80G],
            ["Approved By", data.approvedBy || "—"],
          ].map(([field, value]) => (
            <tr key={field}>
              <td className="border border-foreground/70 px-2 py-1.5 font-semibold w-[38%] bg-muted/40 align-top">
                {field}
              </td>
              <td className="border border-foreground/70 px-2 py-1.5 align-top">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="grid grid-cols-2 gap-4 mt-8 pt-2 text-[10px] text-center">
        <div>
          <div className="border-b border-foreground/50 h-10 mb-1" />
          <p className="font-semibold">{variant === "customer" ? "Receiver Signature" : "Accounts Signature"}</p>
        </div>
        <div>
          <div className="border-b border-foreground/50 h-10 mb-1" />
          <p className="font-semibold">{variant === "customer" ? "Devotee / Payee" : "Authorised Signatory"}</p>
        </div>
      </div>
    </div>
  );
}

export function CashUpiVoucherForm({ data, className }: { data: CashUpiVoucherData; className?: string }) {
  return (
    <div className={cn("cash-upi-voucher-form voucher-print-sheet", className)}>
      <div className="voucher-print-copies-row flex flex-col lg:flex-row gap-0 lg:divide-x lg:divide-foreground/80">
        <VoucherCopy label="Customer Copy" data={data} variant="customer" />
        <VoucherCopy label="Office Copy" data={data} variant="office" />
      </div>
    </div>
  );
}
