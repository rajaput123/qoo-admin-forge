import {
  emptyNeftRtgsForm,
  payrollBeneficiaryPresets,
  vendorBeneficiaryPresets,
  type NeftRtgsFormData,
} from "@/data/neftRtgsTemplateData";

export function isCashOrUpiMode(mode: string): boolean {
  const m = mode.toUpperCase().trim();
  return m === "CASH" || m === "UPI" || m.includes("UPI");
}

export function isNeftRtgsMode(mode: string): boolean {
  if (isCashOrUpiMode(mode)) return false;
  const m = mode.toUpperCase().replace(/\s+/g, "");
  return (
    m === "NEFT" ||
    m === "RTGS" ||
    m.includes("NEFT") ||
    m.includes("RTGS") ||
    m === "CHEQUE" ||
    m === "CARD" ||
    m === "BANK" ||
    m.includes("CHEQUE") ||
    m.includes("BANKTRANSFER")
  );
}

export function mergeNeftForm(
  base: NeftRtgsFormData,
  patch: Partial<NeftRtgsFormData>
): NeftRtgsFormData {
  return { ...base, ...patch };
}

export function buildVendorNeftForm(
  vendor: string,
  amount: string,
  invoiceNo: string,
  tds?: string
): NeftRtgsFormData {
  const preset = vendorBeneficiaryPresets.find(
    (p) => p.beneficiaryName === vendor || vendor.includes(p.beneficiaryName)
  );
  return mergeNeftForm(emptyNeftRtgsForm(), {
    entryType: "vendor",
    beneficiaryName: vendor,
    chequeAmount: amount,
    billNo: invoiceNo,
    purpose: "Vendor Payment",
    paymentHead: "Vendor Payables",
    tdsDeducted: tds ?? "",
    ...(preset
      ? {
          beneficiaryAccountNo: preset.beneficiaryAccountNo,
          ifscCode: preset.ifscCode,
          beneficiaryBankName: preset.beneficiaryBankName,
          beneficiaryBranchName: preset.beneficiaryBranchName,
        }
      : {}),
  });
}

export function buildPayrollNeftForm(
  name: string,
  netPay: number,
  dept: string,
  bankName?: string
): NeftRtgsFormData {
  const preset = payrollBeneficiaryPresets.find((p) => p.beneficiaryName === name);
  return mergeNeftForm(emptyNeftRtgsForm(), {
    entryType: "payroll",
    beneficiaryName: name,
    chequeAmount: String(netPay),
    purpose: `Salary — ${dept}`,
    paymentHead: "Payroll",
    ...(preset
      ? {
          beneficiaryAccountNo: preset.beneficiaryAccountNo,
          ifscCode: preset.ifscCode,
          beneficiaryBankName: preset.beneficiaryBankName,
          beneficiaryBranchName: preset.beneficiaryBranchName,
        }
      : bankName
        ? { beneficiaryBankName: bankName }
        : {}),
  });
}

export function buildPaymentVoucherNeftForm(
  payee: string,
  amount: string,
  purpose: string,
  accountHead?: string
): NeftRtgsFormData {
  return mergeNeftForm(emptyNeftRtgsForm(), {
    entryType: "other",
    beneficiaryName: payee,
    chequeAmount: amount,
    purpose: purpose || "Payment",
    paymentHead: accountHead || "Expenses",
  });
}
