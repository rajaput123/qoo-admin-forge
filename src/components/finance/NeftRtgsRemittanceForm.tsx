import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { NeftRtgsFormData, NeftRtgsTempleTemplate } from "@/data/neftRtgsTemplateData";

interface NeftRtgsRemittanceFormProps {
  template: NeftRtgsTempleTemplate;
  data: NeftRtgsFormData;
  onChange: (patch: Partial<NeftRtgsFormData>) => void;
  className?: string;
}

function formatDisplayDate(iso: string) {
  if (!iso) return "";
  const d = new Date(iso + "T12:00:00");
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }).replace(/ /g, "-");
}

function FormFieldRow({
  label,
  value,
  onChange,
  placeholder,
  readOnly,
}: {
  label: string;
  value: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  readOnly?: boolean;
}) {
  return (
    <tr>
      <td className="border border-foreground/80 px-2 py-1.5 text-[11px] font-semibold w-[44%] align-middle bg-muted/40">
        {label}
      </td>
      <td className="border border-foreground/80 px-1 py-0.5 align-middle">
        {readOnly ? (
          <span className="text-xs px-1 py-1 block min-h-[28px]">{value || "—"}</span>
        ) : (
          <>
            <Input
              value={value}
              onChange={(e) => onChange?.(e.target.value)}
              placeholder={placeholder}
              className="border-0 h-7 text-xs shadow-none focus-visible:ring-0 rounded-none bg-transparent px-1.5 print:hidden"
            />
            <span className="hidden print:block text-xs px-1.5 py-1 min-h-[28px]">{value || "—"}</span>
          </>
        )}
      </td>
    </tr>
  );
}

function CopyBlock({
  copyLabel,
  template,
  data,
  onChange,
  variant,
}: {
  copyLabel: string;
  template: NeftRtgsTempleTemplate;
  data: NeftRtgsFormData;
  onChange: (patch: Partial<NeftRtgsFormData>) => void;
  variant: "customer" | "banker";
}) {
  const readOnlyFields = variant === "banker";

  return (
    <div className="flex-1 min-w-0 border border-foreground/80 p-3 bg-background text-foreground">
      <p className="text-right text-xs font-bold mb-3 underline underline-offset-2">{copyLabel}</p>

      <div className="text-xs space-y-0.5 mb-3 leading-relaxed">
        <p>To</p>
        <p className="font-semibold">The Manager</p>
        <p className="font-semibold">{template.bankName}</p>
        <div className="flex justify-between gap-2">
          <p className="font-semibold">{template.branchName}</p>
          <p>
            <span className="font-semibold">Date: </span>
            {variant === "customer" ? (
              <Input
                type="date"
                value={data.date}
                onChange={(e) => onChange({ date: e.target.value })}
                className="inline-flex w-[130px] h-6 text-xs border-0 border-b border-foreground/40 rounded-none shadow-none px-0 print:hidden"
              />
            ) : null}
            <span className={variant === "customer" ? "hidden print:inline" : ""}>{formatDisplayDate(data.date)}</span>
          </p>
        </div>
      </div>

      <p className="text-[11px] mb-3 leading-snug">
        Dear Sir,
        <br />
        Please make arrangements for remittance of funds through NEFT/RTGS as detailed below.
      </p>

      <table className="w-full border-collapse mb-3">
        <tbody>
          <FormFieldRow label="Debit Account No." value={template.debitAccountNo} readOnly />
          <FormFieldRow
            label="Cheque No."
            value={data.chequeNo}
            onChange={(v) => onChange({ chequeNo: v })}
            placeholder="—"
            readOnly={readOnlyFields}
          />
          <FormFieldRow
            label="Cheque Amount"
            value={data.chequeAmount}
            onChange={(v) => onChange({ chequeAmount: v })}
            placeholder="₹"
            readOnly={readOnlyFields}
          />
          <FormFieldRow label="Remitter's Name" value={template.remitterName} readOnly />
          <FormFieldRow label="Address" value={template.remitterAddress} readOnly />
          <FormFieldRow
            label="Mobile No."
            value={template.remitterMobile}
            readOnly
            placeholder="—"
          />
        </tbody>
      </table>

      <table className="w-full border-collapse mb-3">
        <tbody>
          <FormFieldRow
            label="Beneficiary Name"
            value={data.beneficiaryName}
            onChange={(v) => onChange({ beneficiaryName: v })}
            readOnly={readOnlyFields}
          />
          <FormFieldRow
            label="Account No."
            value={data.beneficiaryAccountNo}
            onChange={(v) => onChange({ beneficiaryAccountNo: v })}
            readOnly={readOnlyFields}
          />
          <FormFieldRow
            label="IFSC Code"
            value={data.ifscCode}
            onChange={(v) => onChange({ ifscCode: v.toUpperCase() })}
            readOnly={readOnlyFields}
          />
          <FormFieldRow
            label="Bank Name"
            value={data.beneficiaryBankName}
            onChange={(v) => onChange({ beneficiaryBankName: v })}
            readOnly={readOnlyFields}
          />
          <FormFieldRow
            label="Branch Name"
            value={data.beneficiaryBranchName}
            onChange={(v) => onChange({ beneficiaryBranchName: v })}
            readOnly={readOnlyFields}
          />
        </tbody>
      </table>

      {variant === "customer" ? (
        <>
          <p className="text-center text-xs font-bold mb-2">For Customer Use only</p>
          <table className="w-full border-collapse">
            <tbody>
              <FormFieldRow
                label="Purpose of NEFT/RTGS"
                value={data.purpose}
                onChange={(v) => onChange({ purpose: v })}
              />
              <FormFieldRow
                label="Payment Head"
                value={data.paymentHead}
                onChange={(v) => onChange({ paymentHead: v })}
              />
              <FormFieldRow
                label="TDS Deducted"
                value={data.tdsDeducted}
                onChange={(v) => onChange({ tdsDeducted: v })}
              />
              <FormFieldRow
                label="TDS Challan No."
                value={data.tdsChallanNo}
                onChange={(v) => onChange({ tdsChallanNo: v })}
              />
              <FormFieldRow label="Bill No" value={data.billNo} onChange={(v) => onChange({ billNo: v })} />
            </tbody>
          </table>
        </>
      ) : (
        <>
          <p className="text-center text-xs font-bold my-6">For Bank Use only</p>
          <div className="grid grid-cols-3 gap-2 mt-8 pt-4 border-t border-foreground/30 text-[10px] text-center">
            <div>
              <div className="border-b border-foreground/50 h-10 mb-1" />
              <p className="font-semibold">Customer Signature</p>
            </div>
            <div>
              <div className="border-b border-foreground/50 h-10 mb-1" />
              <p className="font-semibold">Posted By</p>
            </div>
            <div>
              <div className="border-b border-foreground/50 h-10 mb-1" />
              <p className="font-semibold">Verified By</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export function NeftRtgsRemittanceForm({ template, data, onChange, className }: NeftRtgsRemittanceFormProps) {
  return (
    <div className={cn("neft-rtgs-form voucher-print-sheet", className)}>
      <div className="voucher-print-copies-row flex flex-col lg:flex-row gap-0 lg:divide-x lg:divide-foreground/80">
        <CopyBlock copyLabel="Customer Copy" template={template} data={data} onChange={onChange} variant="customer" />
        <CopyBlock copyLabel="Banker's Copy" template={template} data={data} onChange={onChange} variant="banker" />
      </div>
    </div>
  );
}
