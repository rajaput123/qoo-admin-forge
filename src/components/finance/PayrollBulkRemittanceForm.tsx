import { cn } from "@/lib/utils";
import type { PayrollBulkRemittanceData } from "@/data/payrollBulkRemittanceData";
import { payrollBulkTotal } from "@/data/payrollBulkRemittanceData";

function formatDisplayDate(iso: string) {
  if (!iso) return "—";
  const d = new Date(iso + "T12:00:00");
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function formatAmount(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

function BulkCopyBlock({
  copyLabel,
  data,
  variant,
}: {
  copyLabel: string;
  data: PayrollBulkRemittanceData;
  variant: "temple" | "banker";
}) {
  const total = payrollBulkTotal(data);

  return (
    <div className="flex-1 min-w-0 border border-foreground/80 p-3 bg-background text-foreground">
      <p className="text-right text-xs font-bold mb-2 underline underline-offset-2">{copyLabel}</p>

      <div className="text-xs space-y-0.5 mb-3 leading-relaxed">
        <p>To</p>
        <p className="font-semibold">The Manager</p>
        <p className="font-semibold">{data.bankName}</p>
        <div className="flex justify-between gap-2 flex-wrap">
          <p className="font-semibold">{data.branchName}</p>
          <p>
            <span className="font-semibold">Date: </span>
            {formatDisplayDate(data.date)}
          </p>
        </div>
      </div>

      <p className="text-[11px] mb-2 leading-snug">
        Dear Sir,
        <br />
        Please remit salary for <span className="font-semibold">{data.month} {data.year}</span> through
        NEFT/RTGS as per the schedule below.
      </p>

      <table className="w-full border-collapse text-[10px] mb-3">
        <tbody>
          <tr>
            <td className="border border-foreground/70 px-2 py-1 font-semibold bg-muted/40 w-[42%]">
              Temple Debit Account No.
            </td>
            <td className="border border-foreground/70 px-2 py-1 font-mono">{data.debitAccountNo}</td>
          </tr>
          <tr>
            <td className="border border-foreground/70 px-2 py-1 font-semibold bg-muted/40">Remitter / Temple</td>
            <td className="border border-foreground/70 px-2 py-1">{data.remitterName}</td>
          </tr>
          <tr>
            <td className="border border-foreground/70 px-2 py-1 font-semibold bg-muted/40">Purpose</td>
            <td className="border border-foreground/70 px-2 py-1">
              Salary — {data.month} {data.year}
            </td>
          </tr>
        </tbody>
      </table>

      <p className="text-center text-[11px] font-bold mb-1.5 uppercase tracking-wide">
        Employee remittance schedule
      </p>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[9px] payroll-bulk-grid">
          <thead>
            <tr className="bg-muted/50">
              {["S.No", "Emp No", "Employee Name", "Account No", "IFSC", "Amount (₹)"].map((h) => (
                <th
                  key={h}
                  className="border border-foreground/70 px-1.5 py-1 text-left font-bold whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.lines.map((line, i) => (
              <tr key={line.employeeNo}>
                <td className="border border-foreground/70 px-1.5 py-1 text-center">{i + 1}</td>
                <td className="border border-foreground/70 px-1.5 py-1 font-mono">{line.employeeNo}</td>
                <td className="border border-foreground/70 px-1.5 py-1">{line.employeeName}</td>
                <td className="border border-foreground/70 px-1.5 py-1 font-mono">{line.accountNo || "—"}</td>
                <td className="border border-foreground/70 px-1.5 py-1 font-mono uppercase">
                  {line.ifscCode || "—"}
                </td>
                <td className="border border-foreground/70 px-1.5 py-1 text-right font-semibold tabular-nums">
                  {formatAmount(line.amount)}
                </td>
              </tr>
            ))}
            <tr className="bg-muted/30 font-bold">
              <td colSpan={5} className="border border-foreground/70 px-1.5 py-1.5 text-right">
                Total
              </td>
              <td className="border border-foreground/70 px-1.5 py-1.5 text-right tabular-nums">
                {formatAmount(total)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {variant === "banker" ? (
        <div className="grid grid-cols-3 gap-2 mt-6 pt-2 border-t border-foreground/30 text-[9px] text-center">
          <div>
            <div className="border-b border-foreground/50 h-8 mb-1" />
            <p className="font-semibold">Authorised Signatory</p>
          </div>
          <div>
            <div className="border-b border-foreground/50 h-8 mb-1" />
            <p className="font-semibold">Posted By</p>
          </div>
          <div>
            <div className="border-b border-foreground/50 h-8 mb-1" />
            <p className="font-semibold">Bank Stamp</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 mt-6 pt-2 border-t border-foreground/30 text-[9px] text-center">
          <div>
            <div className="border-b border-foreground/50 h-8 mb-1" />
            <p className="font-semibold">Prepared By (Accounts)</p>
          </div>
          <div>
            <div className="border-b border-foreground/50 h-8 mb-1" />
            <p className="font-semibold">Temple Trustee / Signatory</p>
          </div>
        </div>
      )}
    </div>
  );
}

export function PayrollBulkRemittanceForm({
  data,
  className,
}: {
  data: PayrollBulkRemittanceData;
  className?: string;
}) {
  return (
    <div className={cn("payroll-bulk-remittance-form voucher-print-sheet neft-rtgs-form", className)}>
      <div className="voucher-print-copies-row flex flex-col lg:flex-row gap-0 lg:divide-x lg:divide-foreground/80">
        <BulkCopyBlock copyLabel="Temple Copy" data={data} variant="temple" />
        <BulkCopyBlock copyLabel="Banker's Copy" data={data} variant="banker" />
      </div>
    </div>
  );
}
