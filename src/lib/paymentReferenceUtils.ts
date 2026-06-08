export interface PaymentReferenceMeta {
  label: string;
  placeholder: string;
  hint: string;
  required: boolean;
  maxLength: number;
}

export function getPaymentReferenceMeta(mode: string): PaymentReferenceMeta {
  const m = mode.toUpperCase().trim();

  if (m === "CASH") {
    return {
      label: "Bank Reference / UTR No",
      placeholder: "e.g. UTR for cash deposit to bank (optional)",
      hint: "Optional — if cash was deposited to bank",
      required: false,
      maxLength: 30,
    };
  }

  if (m === "UPI" || m.includes("UPI") || m.includes("BANK TRANSFER")) {
    return {
      label: "UPI Reference / Txn ID",
      placeholder: "e.g. 4XXXXXXXXXXX (UTR / UPI ref)",
      hint: "12–30 characters (A-Z, 0-9)",
      required: true,
      maxLength: 30,
    };
  }

  if (m === "CHEQUE" || m.includes("CHEQUE")) {
    return {
      label: "Cheque Number",
      placeholder: "e.g. 123456 — Bank name, cheque date",
      hint: "Cheque no. with bank / date if available",
      required: true,
      maxLength: 30,
    };
  }

  if (m === "CARD") {
    return {
      label: "Card Txn / Approval Code",
      placeholder: "e.g. last 4 digits or approval code",
      hint: "Card transaction or auth code",
      required: true,
      maxLength: 30,
    };
  }

  if (m === "NEFT" || m === "RTGS" || m.includes("NEFT") || m.includes("RTGS")) {
    return {
      label: "UTR / Reference No",
      placeholder: "e.g. NEFT UTR or RTGS reference",
      hint: "12–30 characters (A-Z, 0-9)",
      required: true,
      maxLength: 30,
    };
  }

  return {
    label: "Reference / Txn ID",
    placeholder: "Payment reference (optional)",
    hint: "",
    required: false,
    maxLength: 30,
  };
}
