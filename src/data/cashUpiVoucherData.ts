export interface CashUpiVoucherData {
  date: string;
  voucherType: string;
  voucherNo: string;
  temple: string;
  payerName: string;
  pan: string;
  mobile: string;
  amount: string;
  paymentMode: string;
  utrRef: string;
  accountHead: string;
  category: string;
  narration: string;
  approvedBy: string;
  purpose: string;
  certificate80G: string;
}

export const defaultTempleReceiptHeader = {
  name: "Sri Ganesha Temple",
  address: "Temple Street, K R Nagar, Karnataka — 571602",
  phone: "+91 98765 43210",
};

export function emptyCashUpiVoucher(): CashUpiVoucherData {
  return {
    date: new Date().toISOString().slice(0, 10),
    voucherType: "Receipt",
    voucherNo: "",
    temple: defaultTempleReceiptHeader.name,
    payerName: "",
    pan: "",
    mobile: "",
    amount: "",
    paymentMode: "Cash",
    utrRef: "",
    accountHead: "",
    category: "",
    narration: "",
    approvedBy: "",
    purpose: "",
    certificate80G: "No",
  };
}

export function buildCashUpiVoucherFromForm(input: {
  date: string;
  voucherType: string;
  temple: string;
  payerName: string;
  pan: string;
  mobile: string;
  amount: string;
  paymentMode: string;
  utrRef: string;
  accountHead: string;
  category: string;
  narration: string;
  approvedBy: string;
  purpose: string;
  certificate80G: string;
  voucherNo?: string;
}): CashUpiVoucherData {
  return {
    ...emptyCashUpiVoucher(),
    date: input.date,
    voucherType: input.voucherType,
    voucherNo: input.voucherNo ?? `JV-${Date.now().toString(36).toUpperCase()}`,
    temple: input.temple,
    payerName: input.payerName,
    pan: input.pan,
    mobile: input.mobile,
    amount: input.amount,
    paymentMode: input.paymentMode,
    utrRef: input.utrRef,
    accountHead: input.accountHead,
    category: input.category,
    narration: input.narration,
    approvedBy: input.approvedBy,
    purpose: input.purpose,
    certificate80G: input.certificate80G,
  };
}
