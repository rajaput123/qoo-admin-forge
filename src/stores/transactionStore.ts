// Unified Transaction Store — Central financial movement registry
// Handles Income, Expense, Transfer with full lifecycle, payment tracking, and ledger integration

export type TransactionType = "Income" | "Expense" | "Transfer";
export type TransactionStatus = "Pending" | "Completed" | "Failed";
export type PaymentStatus = "Unpaid" | "Partially Paid" | "Paid";
export type PaymentMethod = "Cash" | "Bank" | "UPI" | "Cheque" | "In-Kind";
export type AccountName = "Cash" | "SBI Main" | "HDFC Current" | "UPI Wallet" | "Petty Cash";

export interface TransactionPayment {
  id: string;
  amount: number;
  method: PaymentMethod;
  date: string;
  referenceNumber: string;
}

export interface FinTransaction {
  id: string;
  type: TransactionType;
  amount: number;
  date: string;
  category: string;
  subCategory: string;
  paymentMethod: PaymentMethod;
  account: AccountName;
  // Transfer fields
  destinationAccount?: AccountName;
  // Reference linkages
  requestId: string;
  poId: string;
  payrollId: string;
  externalReference: string;
  // Status
  status: TransactionStatus;
  paymentStatus: PaymentStatus;
  paidAmount: number;
  payments: TransactionPayment[];
  // Metadata
  description: string;
  createdBy: string;
  approvedBy: string;
  notes: string;
  createdDate: string;
  // Reversal
  reversalOfId: string;
  reversedById: string;
  // Ledger link
  ledgerEntryId: string;
  // Source
  source: "Manual" | "System";
}

// --- Categories ---
export const incomeCategories = [
  "Seva Revenue", "Sales", "Hundi Collection", "Rental Income", "Interest", "Other Income"
];
export const expenseCategories = [
  "Purchase", "Salary", "Utilities", "Maintenance", "Events", "Projects", "Administration", "Security", "Other Expense"
];
export const transferCategories = ["Cash to Bank", "Bank to Cash", "Bank to Bank"];

export const accountsList: AccountName[] = ["Cash", "SBI Main", "HDFC Current", "UPI Wallet", "Petty Cash"];

// --- Seed data ---
const seedTransactions: FinTransaction[] = [
  {
    id: "TXN-0001", type: "Income", amount: 51000, date: "2026-03-28",
    category: "Other Income", subCategory: "General", paymentMethod: "UPI", account: "SBI Main",
    requestId: "", poId: "", payrollId: "", externalReference: "UPI-REF-98765",
    status: "Completed", paymentStatus: "Paid", paidAmount: 51000,
    payments: [{ id: "TP-001", amount: 51000, method: "UPI", date: "2026-03-28", referenceNumber: "UPI-REF-98765" }],
    description: "General Donation - Ramesh Kumar", createdBy: "Admin", approvedBy: "", notes: "Monthly contribution",
    createdDate: "2026-03-28", reversalOfId: "", reversedById: "", ledgerEntryId: "LED-T001", source: "Manual"
  },
  {
    id: "TXN-0002", type: "Income", amount: 5000, date: "2026-03-28",
    category: "Seva Revenue", subCategory: "Abhishekam", paymentMethod: "Cash", account: "Cash",
    requestId: "", poId: "", payrollId: "", externalReference: "",
    status: "Completed", paymentStatus: "Paid", paidAmount: 5000,
    payments: [{ id: "TP-002", amount: 5000, method: "Cash", date: "2026-03-28", referenceNumber: "" }],
    description: "Abhishekam Booking - Lakshmi Devi", createdBy: "Counter Staff", approvedBy: "", notes: "",
    createdDate: "2026-03-28", reversalOfId: "", reversedById: "", ledgerEntryId: "LED-T002", source: "Manual"
  },
  {
    id: "TXN-0003", type: "Expense", amount: 9000, date: "2026-03-29",
    category: "Purchase", subCategory: "Pooja Materials", paymentMethod: "Bank", account: "SBI Main",
    requestId: "REQ-001", poId: "PPO-001", payrollId: "", externalReference: "UTR-98765",
    status: "Completed", paymentStatus: "Paid", paidAmount: 9000,
    payments: [{ id: "TP-003", amount: 9000, method: "Bank", date: "2026-03-29", referenceNumber: "UTR-98765" }],
    description: "Camphor & Ghee purchase - Pixel Studio", createdBy: "System", approvedBy: "Finance Head", notes: "",
    createdDate: "2026-03-29", reversalOfId: "", reversedById: "", ledgerEntryId: "LED-T003", source: "System"
  },
  {
    id: "TXN-0004", type: "Income", amount: 100000, date: "2026-03-27",
    category: "Other Income", subCategory: "Event-based", paymentMethod: "Bank", account: "SBI Main",
    requestId: "", poId: "", payrollId: "", externalReference: "NEFT-456",
    status: "Completed", paymentStatus: "Paid", paidAmount: 100000,
    payments: [{ id: "TP-004", amount: 100000, method: "Bank", date: "2026-03-27", referenceNumber: "NEFT-456" }],
    description: "Event Donation - Sri Trust Foundation", createdBy: "Admin", approvedBy: "", notes: "Towards Brahmotsavam",
    createdDate: "2026-03-27", reversalOfId: "", reversedById: "", ledgerEntryId: "LED-T004", source: "Manual"
  },
  {
    id: "TXN-0005", type: "Expense", amount: 45000, date: "2026-03-26",
    category: "Utilities", subCategory: "Electricity", paymentMethod: "Bank", account: "HDFC Current",
    requestId: "", poId: "", payrollId: "", externalReference: "",
    status: "Pending", paymentStatus: "Unpaid", paidAmount: 0, payments: [],
    description: "Monthly Electricity Bill - APSPDCL", createdBy: "Admin", approvedBy: "", notes: "Due: 2026-04-05",
    createdDate: "2026-03-26", reversalOfId: "", reversedById: "", ledgerEntryId: "", source: "Manual"
  },
  {
    id: "TXN-0006", type: "Expense", amount: 185000, date: "2026-03-25",
    category: "Salary", subCategory: "Monthly Salary", paymentMethod: "Bank", account: "SBI Main",
    requestId: "", poId: "", payrollId: "PAY-2026-003", externalReference: "",
    status: "Completed", paymentStatus: "Paid", paidAmount: 185000,
    payments: [{ id: "TP-006", amount: 185000, method: "Bank", date: "2026-03-25", referenceNumber: "" }],
    description: "Staff Salary - March 2026", createdBy: "System", approvedBy: "Finance Head", notes: "",
    createdDate: "2026-03-25", reversalOfId: "", reversedById: "", ledgerEntryId: "LED-T006", source: "System"
  },
  {
    id: "TXN-0007", type: "Transfer", amount: 100000, date: "2026-03-24",
    category: "Cash to Bank", subCategory: "", paymentMethod: "Bank", account: "Cash",
    destinationAccount: "SBI Main",
    requestId: "", poId: "", payrollId: "", externalReference: "",
    status: "Completed", paymentStatus: "Paid", paidAmount: 100000,
    payments: [{ id: "TP-007", amount: 100000, method: "Bank", date: "2026-03-24", referenceNumber: "" }],
    description: "Cash deposit to SBI Main", createdBy: "Admin", approvedBy: "", notes: "Weekly cash deposit",
    createdDate: "2026-03-24", reversalOfId: "", reversedById: "", ledgerEntryId: "LED-T007", source: "Manual"
  },
  {
    id: "TXN-0008", type: "Expense", amount: 8000, date: "2026-03-22",
    category: "Purchase", subCategory: "Maintenance", paymentMethod: "Cash", account: "Petty Cash",
    requestId: "REQ-003", poId: "PPO-002", payrollId: "", externalReference: "",
    status: "Completed", paymentStatus: "Partially Paid", paidAmount: 5000,
    payments: [{ id: "TP-008", amount: 5000, method: "Cash", date: "2026-03-22", referenceNumber: "" }],
    description: "Paint for Gopuram restoration", createdBy: "System", approvedBy: "Admin", notes: "Partial payment",
    createdDate: "2026-03-22", reversalOfId: "", reversedById: "", ledgerEntryId: "LED-T008", source: "System"
  },
  {
    id: "TXN-0009", type: "Income", amount: 85000, date: "2026-03-25",
    category: "Hundi Collection", subCategory: "Main Hundi", paymentMethod: "Cash", account: "Cash",
    requestId: "", poId: "", payrollId: "", externalReference: "",
    status: "Completed", paymentStatus: "Paid", paidAmount: 85000,
    payments: [{ id: "TP-009", amount: 85000, method: "Cash", date: "2026-03-25", referenceNumber: "" }],
    description: "Main Hundi Collection", createdBy: "Counter Staff", approvedBy: "", notes: "Morning collection",
    createdDate: "2026-03-25", reversalOfId: "", reversedById: "", ledgerEntryId: "LED-T009", source: "Manual"
  },
];

// --- In-memory store ---
export const finTransactions: FinTransaction[] = [...seedTransactions];

// --- ID generator ---
const nextId = () => {
  const max = finTransactions.map(t => Number(t.id.split("-").pop()) || 0).reduce((m, n) => Math.max(m, n), 0);
  return `TXN-${String(max + 1).padStart(4, "0")}`;
};

const nextPaymentId = () => {
  const all = finTransactions.flatMap(t => t.payments);
  const max = all.map(p => Number(p.id.split("-").pop()) || 0).reduce((m, n) => Math.max(m, n), 0);
  return `TP-${String(max + 1).padStart(3, "0")}`;
};

// --- Validation ---
export function validateTransaction(data: Partial<FinTransaction>): string | null {
  if (!data.amount || data.amount <= 0) return "Amount must be greater than zero";
  if (!data.type) return "Transaction type is required";
  if (!data.account) return "Account is required";
  if (!data.date) return "Date is required";
  if (data.type === "Transfer" && data.account === data.destinationAccount) return "Source and destination accounts must be different";
  if (data.type === "Transfer" && !data.destinationAccount) return "Destination account is required for transfers";
  return null;
}

// --- Create Transaction ---
export function createTransaction(data: Omit<FinTransaction, "id" | "payments" | "paidAmount" | "paymentStatus" | "ledgerEntryId" | "reversalOfId" | "reversedById" | "createdDate">): FinTransaction | null {
  const error = validateTransaction(data);
  if (error) return null;

  // Prevent duplicate for same request
  if (data.requestId && finTransactions.some(t => t.requestId === data.requestId && !t.reversalOfId)) {
    return null; // Duplicate
  }

  const id = nextId();
  const txn: FinTransaction = {
    ...data,
    id,
    payments: [],
    paidAmount: 0,
    paymentStatus: "Unpaid",
    ledgerEntryId: "",
    reversalOfId: "",
    reversedById: "",
    createdDate: new Date().toISOString().slice(0, 10),
  };

  // If status is Completed, auto-generate ledger entry ID
  if (txn.status === "Completed") {
    txn.ledgerEntryId = `LED-${id}`;
    txn.paidAmount = txn.amount;
    txn.paymentStatus = "Paid";
    txn.payments = [{
      id: nextPaymentId(),
      amount: txn.amount,
      method: txn.paymentMethod,
      date: txn.date,
      referenceNumber: txn.externalReference,
    }];
  }

  finTransactions.unshift(txn);
  return txn;
}

// --- Record Payment ---
export function recordPayment(txnId: string, amount: number, method: PaymentMethod, referenceNumber: string): boolean {
  const txn = finTransactions.find(t => t.id === txnId);
  if (!txn || txn.status === "Failed") return false;

  const remaining = txn.amount - txn.paidAmount;
  if (amount <= 0 || amount > remaining) return false;

  txn.payments.push({
    id: nextPaymentId(),
    amount,
    method,
    date: new Date().toISOString().slice(0, 10),
    referenceNumber,
  });

  txn.paidAmount += amount;
  txn.paymentStatus = txn.paidAmount >= txn.amount ? "Paid" : "Partially Paid";

  if (txn.paymentStatus === "Paid") {
    txn.status = "Completed";
    if (!txn.ledgerEntryId) txn.ledgerEntryId = `LED-${txn.id}`;
  }

  return true;
}

// --- Mark Failed ---
export function markFailed(txnId: string): boolean {
  const txn = finTransactions.find(t => t.id === txnId);
  if (!txn || txn.status === "Completed") return false;
  txn.status = "Failed";
  txn.ledgerEntryId = ""; // No ledger for failed
  return true;
}

// --- Reversal ---
export function reverseTransaction(txnId: string, createdBy: string): FinTransaction | null {
  const original = finTransactions.find(t => t.id === txnId);
  if (!original || original.status !== "Completed" || original.reversedById) return null;

  const reversalId = nextId();
  const reversal: FinTransaction = {
    ...original,
    id: reversalId,
    description: `[REVERSAL] ${original.description}`,
    reversalOfId: txnId,
    reversedById: "",
    createdBy,
    createdDate: new Date().toISOString().slice(0, 10),
    date: new Date().toISOString().slice(0, 10),
    ledgerEntryId: `LED-${reversalId}`,
    notes: `Reversal of ${txnId}`,
    source: "System",
    payments: [{
      id: nextPaymentId(),
      amount: original.amount,
      method: original.paymentMethod,
      date: new Date().toISOString().slice(0, 10),
      referenceNumber: `REV-${txnId}`,
    }],
  };

  // Swap type for reversal display
  if (original.type === "Income") {
    reversal.type = "Expense";
  } else if (original.type === "Expense") {
    reversal.type = "Income";
  }
  // Transfer reversal: swap accounts
  if (original.type === "Transfer") {
    reversal.account = original.destinationAccount || original.account;
    reversal.destinationAccount = original.account;
  }

  original.reversedById = reversalId;
  finTransactions.unshift(reversal);
  return reversal;
}

// --- Queries ---
export const getTransactionsByType = (type: TransactionType) => finTransactions.filter(t => t.type === type);
export const getTransactionsByStatus = (status: TransactionStatus) => finTransactions.filter(t => t.status === status);
export const getTransaction = (id: string) => finTransactions.find(t => t.id === id);

export const getAccountBalance = (account: AccountName) => {
  return finTransactions
    .filter(t => t.status === "Completed" && !t.reversalOfId)
    .reduce((bal, t) => {
      if (t.type === "Income" && t.account === account) return bal + t.paidAmount;
      if (t.type === "Expense" && t.account === account) return bal - t.paidAmount;
      if (t.type === "Transfer") {
        if (t.account === account) return bal - t.paidAmount;
        if (t.destinationAccount === account) return bal + t.paidAmount;
      }
      return bal;
    }, 0);
};

export const getSummary = () => {
  const completed = finTransactions.filter(t => t.status === "Completed" && !t.reversalOfId);
  return {
    totalIncome: completed.filter(t => t.type === "Income").reduce((s, t) => s + t.paidAmount, 0),
    totalExpense: completed.filter(t => t.type === "Expense").reduce((s, t) => s + t.paidAmount, 0),
    totalTransfers: completed.filter(t => t.type === "Transfer").reduce((s, t) => s + t.paidAmount, 0),
    pending: finTransactions.filter(t => t.status === "Pending").length,
    failed: finTransactions.filter(t => t.status === "Failed").length,
  };
};
