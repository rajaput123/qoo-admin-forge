/** Temple-configured NEFT/RTGS bank remittance template (from finance / bank settings) */
export interface NeftRtgsTempleTemplate {
  bankName: string;
  branchName: string;
  debitAccountNo: string;
  remitterName: string;
  remitterAddress: string;
  remitterMobile: string;
}

export interface NeftRtgsFormData {
  date: string;
  chequeNo: string;
  chequeAmount: string;
  beneficiaryName: string;
  beneficiaryAccountNo: string;
  ifscCode: string;
  beneficiaryBankName: string;
  beneficiaryBranchName: string;
  purpose: string;
  paymentHead: string;
  tdsDeducted: string;
  tdsChallanNo: string;
  billNo: string;
  entryType: "payroll" | "vendor" | "other";
  referenceLabel?: string;
}

export const defaultNeftRtgsTemplate: NeftRtgsTempleTemplate = {
  bankName: "Karnataka Grameena Bank",
  branchName: "K R Nagara",
  debitAccountNo: "12122100000809",
  remitterName: "VEDANTHA BHARATHI",
  remitterAddress: "C M Road K R Nagar",
  remitterMobile: "",
};

export const emptyNeftRtgsForm = (): NeftRtgsFormData => ({
  date: new Date().toISOString().slice(0, 10),
  chequeNo: "",
  chequeAmount: "",
  beneficiaryName: "",
  beneficiaryAccountNo: "",
  ifscCode: "",
  beneficiaryBankName: "",
  beneficiaryBranchName: "",
  purpose: "",
  paymentHead: "",
  tdsDeducted: "",
  tdsChallanNo: "",
  billNo: "",
  entryType: "other",
});

export const payrollBeneficiaryPresets = [
  {
    label: "Ramesh Kumar — Priest",
    beneficiaryName: "Ramesh Kumar",
    beneficiaryAccountNo: "30123456789",
    ifscCode: "SBIN0001234",
    beneficiaryBankName: "State Bank of India",
    beneficiaryBranchName: "K R Nagara",
    chequeAmount: "28000",
    purpose: "Salary — Priest",
    paymentHead: "Payroll",
  },
  {
    label: "Priya Patel — Accounts",
    beneficiaryName: "Priya Patel",
    beneficiaryAccountNo: "50112233445",
    ifscCode: "HDFC0005678",
    beneficiaryBankName: "HDFC Bank",
    beneficiaryBranchName: "Mysore Road",
    chequeAmount: "29500",
    purpose: "Salary — Accounts",
    paymentHead: "Payroll",
  },
];

export const vendorBeneficiaryPresets = [
  {
    label: "Sri Pooja Stores",
    beneficiaryName: "Sri Pooja Stores",
    beneficiaryAccountNo: "112233445566",
    ifscCode: "KGBK0001234",
    beneficiaryBankName: "Karnataka Grameena Bank",
    beneficiaryBranchName: "K R Nagara",
    chequeAmount: "12500",
    purpose: "Vendor Payment",
    paymentHead: "Pooja Materials",
    billNo: "INV-inv001",
  },
];
