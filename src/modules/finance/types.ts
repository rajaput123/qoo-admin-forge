// Finance & Accounts Module — Core Type Definitions

export type AccountType = "Asset" | "Liability" | "Equity" | "Income" | "Expense";
export type TransactionType = "Income" | "Expense" | "Transfer";
export type TransactionStatus = "Pending" | "Completed" | "Failed";
export type PaymentStatus = "Unpaid" | "Partially Paid" | "Paid";
export type PaymentMethod = "Cash" | "Bank" | "UPI" | "Cheque";
export type FundType = "General" | "Donation" | "Event" | "Construction" | "Endowment" | "Custom";
export type ReconciliationStatus = "Matched" | "Unmatched" | "Pending";

// ─── Accounts Module ───
export interface FinanceAccount {
  id: string;
  code: string;
  name: string;
  type: AccountType;
  accountCategory?: "Cash" | "Bank" | "UPI/Wallet"; // For Asset accounts
  parentAccount?: string;
  description?: string;
  isSystem?: boolean;
  openingBalance: number;
  currentBalance: number; // Derived from transactions
}

// ─── Fund System (Tag-based) ───
export interface Fund {
  id: string;
  name: string;
  type: FundType;
  description?: string;
  status: "Active" | "Closed";
}

// ─── Transaction Payment ───
export interface TransactionPayment {
  id: string;
  amount: number;
  method: PaymentMethod;
  date: string;
  referenceNumber: string;
}

// ─── Ledger Entry (Auto-generated from Transactions) ───
export interface LedgerEntry {
  id: string;
  transactionId: string;
  date: string;
  accountId: string;
  accountName: string;
  debit: number;
  credit: number;
  description: string;
  fund?: string;
}

// ─── Transaction Attachment ───
export interface TransactionAttachment {
  id: string;
  name: string;
  type: string; // MIME type
  size: number; // bytes
  url: string; // object URL or base64
  uploadedAt: string;
}

// ─── Transaction (Core Engine) ───
export interface FinTransaction {
  id: string;
  type: TransactionType;
  amount: number;
  date: string;
  category: string;
  subCategory: string;
  paymentMethod: PaymentMethod;
  account: string; // Account ID
  accountName: string; // Display name
  destinationAccount?: string; // For transfers
  destinationAccountName?: string;
  // Fund tag
  fund: string; // Fund ID or "general"
  fundName: string;
  // Reference linkages
  referenceId: string; // Donation ID, Expense ID, etc.
  referenceType: string; // "Donation" | "Seva" | "Event" | "Payroll" | "Manual"
  externalReference: string; // UTR, UPI ref, cheque no.
  // Status & Payment
  status: TransactionStatus;
  paymentStatus: PaymentStatus;
  paidAmount: number;
  payments: TransactionPayment[];
  // Metadata
  description: string;
  notes: string;
  createdBy: string;
  approvedBy: string;
  createdAt: string;
  // Reversal
  reversalOfId: string;
  reversedById: string;
  // Ledger
  ledgerEntries: LedgerEntry[];
  // Reconciliation
  reconciliationStatus: ReconciliationStatus;
  // Attachments (receipts, invoices, supporting docs)
  attachments: TransactionAttachment[];
  // Source
  source: "Manual" | "System" | "Donation" | "Seva" | "Event" | "Payroll";
}

// ─── Budget ───
export interface BudgetItem {
  id: string;
  fundId: string;
  fundName: string;
  category: string;
  year: string; // "2025-26"
  plannedAmount: number;
  // Derived
  usedAmount: number; // Sum of expense transactions for this fund+category+year
  remaining: number;
  utilizationPct: number;
  status: "On Track" | "Warning" | "At Risk" | "Exceeded";
}

// ─── Bank Account ───
export interface BankAccount {
  id: string;
  name: string;
  accountNumber: string;
  bankName: string;
  ifsc: string;
  pan?: string;
  linkedLedgerAccountId: string;
  isDefaultDonation?: boolean;
  isDefaultSeva?: boolean;
}

// ─── Payroll ───
export interface SalaryBreakdown {
  hra: number;       // House Rent Allowance (40% of basic)
  da: number;        // Dearness Allowance (20% of basic)
  ta: number;        // Travel Allowance (fixed)
  totalAllowances: number;
  grossPay: number;  // basic + allowances
  pf: number;        // Provident Fund (12% of basic)
  esi: number;       // ESI (0.75% of gross if gross < 21000)
  pt: number;        // Professional Tax (₹200)
  totalDeductions: number;
}

export interface PayrollRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  role: string;
  department: string;
  month: string;
  year: string;
  basicSalary: number;
  salary: SalaryBreakdown;
  deductions: number;      // total deductions (backward compat)
  netPay: number;
  daysPresent: number;
  totalDays: number;
  attendanceMode: "actual" | "full_month"; // whether real attendance was used
  status: "Paid" | "Pending" | "Processing";
  paidDate?: string;
  transactionId?: string;
  bankName?: string;
  bankAccountNumber?: string;
  ifscCode?: string;
  paymentMode?: string;
}

// ─── Categories & Settings ───
export interface FinanceCategory {
  id: string;
  name: string;
  type: "Income" | "Expense";
  suggestedFund?: string; // Auto-suggest fund
}

// ─── Store State ───
export interface FinanceState {
  accounts: FinanceAccount[];
  transactions: FinTransaction[];
  funds: Fund[];
  bankAccounts: BankAccount[];
  budgets: BudgetItem[];
  payroll: PayrollRecord[];
  categories: FinanceCategory[];
  ledgerEntries: LedgerEntry[];
}
