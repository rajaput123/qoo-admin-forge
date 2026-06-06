/**
 * Finance Store — Single Source of Truth
 * All financial data flows through this store.
 * Every transaction auto-generates ledger entries.
 * Account balances are derived from transactions only.
 */

import {
  FinanceState, FinanceAccount, FinTransaction, Fund, BankAccount,
  BudgetItem, PayrollRecord, FinanceCategory, LedgerEntry,
  TransactionType, TransactionStatus, PaymentMethod, PaymentStatus,
  AccountType, FundType
} from "./types";
import { employees as hrEmployees } from "@/data/hr-dummy-data";
import { getEmployees as getOnboardedEmployees } from "@/lib/hr-employee-store";
import {
  calculateNetPay, getAttendanceForPayroll, getEligibleEmployees,
  getMonthIndex, MONTH_NAMES
} from "./payrollCalculator";
const LS_KEY = "qoo.finance.v2";

// ─── Helpers ───
const now = () => new Date().toISOString();
const today = () => new Date().toISOString().slice(0, 10);

function nextId(prefix: string, items: { id: string }[]) {
  const year = new Date().getFullYear();
  const pfx = `${prefix}-${year}-`;
  const max = items
    .map(i => i.id)
    .filter(id => id.startsWith(pfx))
    .reduce((m, id) => Math.max(m, Number(id.replace(pfx, "")) || 0), 0);
  return `${pfx}${String(max + 1).padStart(5, "0")}`;
}

function simpleId(prefix: string, items: { id: string }[]) {
  const max = items
    .map(i => Number(i.id.replace(`${prefix}-`, "")) || 0)
    .reduce((m, n) => Math.max(m, n), 0);
  return `${prefix}-${String(max + 1).padStart(3, "0")}`;
}

// ─── Seed Data ───
function seedAccounts(): FinanceAccount[] {
  return [
    // Assets
    { id: "ACC-001", code: "1000", name: "Cash on Hand", type: "Asset", accountCategory: "Cash", openingBalance: 150000, currentBalance: 0, isSystem: true },
    { id: "ACC-002", code: "1001", name: "SBI Main Account", type: "Asset", accountCategory: "Bank", openingBalance: 2500000, currentBalance: 0, isSystem: true },
    { id: "ACC-003", code: "1002", name: "HDFC Project Account", type: "Asset", accountCategory: "Bank", openingBalance: 1000000, currentBalance: 0, isSystem: true },
    { id: "ACC-004", code: "1003", name: "UPI Wallet", type: "Asset", accountCategory: "UPI/Wallet", openingBalance: 25000, currentBalance: 0, isSystem: true },
    { id: "ACC-005", code: "1004", name: "Petty Cash", type: "Asset", accountCategory: "Cash", openingBalance: 10000, currentBalance: 0, isSystem: true },
    // Income
    { id: "ACC-010", code: "4000", name: "Donation Income", type: "Income", openingBalance: 0, currentBalance: 0, isSystem: true },
    { id: "ACC-011", code: "4001", name: "Seva Revenue", type: "Income", openingBalance: 0, currentBalance: 0, isSystem: true },
    { id: "ACC-012", code: "4002", name: "Hundi Collection", type: "Income", openingBalance: 0, currentBalance: 0, isSystem: true },
    { id: "ACC-013", code: "4003", name: "Event Income", type: "Income", openingBalance: 0, currentBalance: 0, isSystem: true },
    { id: "ACC-014", code: "4004", name: "Rental Income", type: "Income", openingBalance: 0, currentBalance: 0, isSystem: true },
    { id: "ACC-015", code: "4005", name: "Interest Income", type: "Income", openingBalance: 0, currentBalance: 0, isSystem: true },
    { id: "ACC-016", code: "4006", name: "Other Income", type: "Income", openingBalance: 0, currentBalance: 0, isSystem: true },
    // Expenses
    { id: "ACC-020", code: "5000", name: "Annadanam Expense", type: "Expense", openingBalance: 0, currentBalance: 0, isSystem: true },
    { id: "ACC-021", code: "5001", name: "Maintenance Expense", type: "Expense", openingBalance: 0, currentBalance: 0, isSystem: true },
    { id: "ACC-022", code: "5002", name: "Salary Expense", type: "Expense", openingBalance: 0, currentBalance: 0, isSystem: true },
    { id: "ACC-023", code: "5003", name: "Utilities Expense", type: "Expense", openingBalance: 0, currentBalance: 0, isSystem: true },
    { id: "ACC-024", code: "5004", name: "Festival Expense", type: "Expense", openingBalance: 0, currentBalance: 0, isSystem: true },
    { id: "ACC-025", code: "5005", name: "Construction Expense", type: "Expense", openingBalance: 0, currentBalance: 0, isSystem: true },
    { id: "ACC-026", code: "5006", name: "Pooja Supplies", type: "Expense", openingBalance: 0, currentBalance: 0, isSystem: true },
    { id: "ACC-027", code: "5007", name: "Security Expense", type: "Expense", openingBalance: 0, currentBalance: 0, isSystem: true },
    { id: "ACC-028", code: "5008", name: "Administration", type: "Expense", openingBalance: 0, currentBalance: 0, isSystem: true },
    { id: "ACC-029", code: "5009", name: "Other Expense", type: "Expense", openingBalance: 0, currentBalance: 0, isSystem: true },
    // Liabilities
    { id: "ACC-030", code: "2000", name: "Vendor Payables", type: "Liability", openingBalance: 50000, currentBalance: 0, isSystem: true },
    // Equity
    { id: "ACC-040", code: "3000", name: "General Fund Equity", type: "Equity", openingBalance: 0, currentBalance: 0, isSystem: true },
  ];
}

function seedFunds(): Fund[] {
  return [
    { id: "FND-001", name: "General Fund", type: "General", status: "Active", description: "Unrestricted funds for general operations" },
    { id: "FND-002", name: "Donation Fund", type: "Donation", status: "Active", description: "Earmarked donation collections" },
    { id: "FND-003", name: "Event Fund", type: "Event", status: "Active", description: "Event-specific collections and expenses" },
    { id: "FND-004", name: "Gopuram Construction", type: "Construction", status: "Active", description: "Gopuram renovation project fund" },
    { id: "FND-005", name: "Annadanam Corpus", type: "Endowment", status: "Active", description: "Endowment for daily feeding programme" },
  ];
}

function seedCategories(): FinanceCategory[] {
  return [
    { id: "CAT-001", name: "General Donation", type: "Income", suggestedFund: "FND-002" },
    { id: "CAT-002", name: "Seva Revenue", type: "Income", suggestedFund: "FND-001" },
    { id: "CAT-003", name: "Hundi Collection", type: "Income", suggestedFund: "FND-001" },
    { id: "CAT-004", name: "Event Collection", type: "Income", suggestedFund: "FND-003" },
    { id: "CAT-005", name: "Project Donation", type: "Income", suggestedFund: "FND-004" },
    { id: "CAT-006", name: "Rental Income", type: "Income", suggestedFund: "FND-001" },
    { id: "CAT-007", name: "Interest Income", type: "Income", suggestedFund: "FND-001" },
    { id: "CAT-008", name: "Other Income", type: "Income", suggestedFund: "FND-001" },
    { id: "CAT-009", name: "Non-Cash Donation", type: "Income", suggestedFund: "FND-002" },
    { id: "CAT-010", name: "Annadanam", type: "Expense", suggestedFund: "FND-005" },
    { id: "CAT-011", name: "Maintenance", type: "Expense", suggestedFund: "FND-001" },
    { id: "CAT-012", name: "Salary", type: "Expense", suggestedFund: "FND-001" },
    { id: "CAT-013", name: "Utilities", type: "Expense", suggestedFund: "FND-001" },
    { id: "CAT-014", name: "Festival Expenses", type: "Expense", suggestedFund: "FND-003" },
    { id: "CAT-015", name: "Construction", type: "Expense", suggestedFund: "FND-004" },
    { id: "CAT-016", name: "Pooja Supplies", type: "Expense", suggestedFund: "FND-001" },
    { id: "CAT-017", name: "Security", type: "Expense", suggestedFund: "FND-001" },
    { id: "CAT-018", name: "Administration", type: "Expense", suggestedFund: "FND-001" },
    { id: "CAT-019", name: "Other Expense", type: "Expense", suggestedFund: "FND-001" },
  ];
}

function seedBankAccounts(): BankAccount[] {
  return [
    { id: "BNK-001", name: "SBI Main", bankName: "State Bank of India", accountNumber: "XXXX1234", ifsc: "SBIN0001234", pan: "AAACT1234A", linkedLedgerAccountId: "ACC-002", isDefaultDonation: true },
    { id: "BNK-002", name: "HDFC Projects", bankName: "HDFC Bank", accountNumber: "XXXX5678", ifsc: "HDFC0005678", pan: "AAACT1234A", linkedLedgerAccountId: "ACC-003" },
  ];
}

function seedTransactions(): FinTransaction[] {
  const txns: FinTransaction[] = [
    makeTxn("TXN-2026-00001", "Income", 51000, "2026-03-28", "General Donation", "", "UPI", "ACC-004", "UPI Wallet", "FND-002", "Donation Fund", "DON-001", "Donation", "UPI-REF-98765", "Completed", "Paid", 51000, "General Donation - Ramesh Kumar", "Monthly contribution", "Admin", "System"),
    makeTxn("TXN-2026-00002", "Income", 5000, "2026-03-28", "Seva Revenue", "Abhishekam", "Cash", "ACC-001", "Cash on Hand", "FND-001", "General Fund", "SVA-001", "Seva", "", "Completed", "Paid", 5000, "Abhishekam Booking - Lakshmi Devi", "", "Counter", "System"),
    makeTxn("TXN-2026-00003", "Expense", 9000, "2026-03-29", "Pooja Supplies", "", "Bank", "ACC-002", "SBI Main Account", "FND-001", "General Fund", "EXP-001", "Manual", "UTR-98765", "Completed", "Paid", 9000, "Camphor & Ghee purchase", "", "System", "Finance Head"),
    makeTxn("TXN-2026-00004", "Income", 100000, "2026-03-27", "Event Collection", "", "Bank", "ACC-002", "SBI Main Account", "FND-003", "Event Fund", "DON-002", "Event", "NEFT-456", "Completed", "Paid", 100000, "Event Donation - Sri Trust Foundation", "Towards Brahmotsavam", "Admin", ""),
    makeTxn("TXN-2026-00005", "Expense", 45000, "2026-03-26", "Utilities", "Electricity", "Bank", "ACC-003", "HDFC Project Account", "FND-001", "General Fund", "", "Manual", "", "Pending", "Unpaid", 0, "Monthly Electricity Bill - APSPDCL", "Due: 2026-04-05", "Admin", ""),
    makeTxn("TXN-2026-00006", "Expense", 185000, "2026-03-25", "Salary", "Monthly", "Bank", "ACC-002", "SBI Main Account", "FND-001", "General Fund", "PAY-001", "Payroll", "", "Completed", "Paid", 185000, "Staff Salary - March 2026", "", "System", "Finance Head"),
    makeTxn("TXN-2026-00007", "Transfer", 100000, "2026-03-24", "Cash to Bank", "", "Bank", "ACC-001", "Cash on Hand", "FND-001", "General Fund", "", "Manual", "", "Completed", "Paid", 100000, "Cash deposit to SBI Main", "Weekly deposit", "Admin", "", "ACC-002", "SBI Main Account"),
    makeTxn("TXN-2026-00008", "Expense", 8000, "2026-03-22", "Maintenance", "", "Cash", "ACC-005", "Petty Cash", "FND-004", "Gopuram Construction", "EXP-002", "Manual", "", "Completed", "Partially Paid", 5000, "Paint for Gopuram restoration", "Partial payment", "System", "Admin"),
    makeTxn("TXN-2026-00009", "Income", 85000, "2026-03-25", "Hundi Collection", "Main Hundi", "Cash", "ACC-001", "Cash on Hand", "FND-001", "General Fund", "HND-001", "Manual", "", "Completed", "Paid", 85000, "Main Hundi Collection", "Morning collection", "Counter", ""),
    makeTxn("TXN-2026-00010", "Income", 200000, "2026-03-20", "Project Donation", "", "Bank", "ACC-002", "SBI Main Account", "FND-004", "Gopuram Construction", "DON-003", "Donation", "NEFT-789", "Completed", "Paid", 200000, "Gopuram Renovation Donation - Venkat Reddy", "", "Admin", ""),
    makeTxn("TXN-2026-00011", "Expense", 40000, "2026-03-23", "Festival Expenses", "", "Bank", "ACC-002", "SBI Main Account", "FND-003", "Event Fund", "EVT-001", "Event", "", "Completed", "Paid", 40000, "Brahmotsavam Day 1 Arrangements", "", "Admin", "Finance Head"),
    makeTxn("TXN-2026-00012", "Income", 12500, "2026-03-24", "Other Income", "Prasadam Sales", "Cash", "ACC-001", "Cash on Hand", "FND-001", "General Fund", "SLS-001", "Manual", "", "Completed", "Paid", 12500, "Prasadam Counter Sales", "", "Counter", ""),
  ];
  return txns;
}

function makeTxn(
  id: string, type: TransactionType, amount: number, date: string,
  category: string, subCategory: string, method: PaymentMethod,
  account: string, accountName: string, fund: string, fundName: string,
  refId: string, refType: string, extRef: string,
  status: TransactionStatus, payStatus: PaymentStatus, paidAmount: number,
  description: string, notes: string, createdBy: string, approvedBy: string,
  destAccount?: string, destAccountName?: string
): FinTransaction {
  const payments: TransactionPayment[] = paidAmount > 0 ? [{
    id: `TP-${id}`, amount: paidAmount, method, date, referenceNumber: extRef
  }] : [];

  return {
    id, type, amount, date, category, subCategory, paymentMethod: method,
    account, accountName, destinationAccount: destAccount, destinationAccountName: destAccountName,
    fund, fundName, referenceId: refId, referenceType: refType, externalReference: extRef,
    status, paymentStatus: payStatus, paidAmount, payments,
    description, notes, createdBy, approvedBy, createdAt: now(),
    reversalOfId: "", reversedById: "",
    ledgerEntries: [], // Generated on load
    reconciliationStatus: status === "Completed" ? "Matched" : "Pending",
    attachments: [],
    source: refType === "Donation" ? "Donation" : refType === "Seva" ? "Seva" : refType === "Event" ? "Event" : refType === "Payroll" ? "Payroll" : "Manual",
  };
}

import type { TransactionPayment } from "./types";

function seedBudgets(): BudgetItem[] {
  return [
    { id: "BDG-001", fundId: "FND-005", fundName: "Annadanam Corpus", category: "Annadanam", year: "2025-26", plannedAmount: 1200000, usedAmount: 890000, remaining: 310000, utilizationPct: 74, status: "On Track" },
    { id: "BDG-002", fundId: "FND-001", fundName: "General Fund", category: "Maintenance", year: "2025-26", plannedAmount: 1000000, usedAmount: 950000, remaining: 50000, utilizationPct: 95, status: "At Risk" },
    { id: "BDG-003", fundId: "FND-003", fundName: "Event Fund", category: "Festival Expenses", year: "2025-26", plannedAmount: 2000000, usedAmount: 1200000, remaining: 800000, utilizationPct: 60, status: "On Track" },
    { id: "BDG-004", fundId: "FND-001", fundName: "General Fund", category: "Salary", year: "2025-26", plannedAmount: 1500000, usedAmount: 1350000, remaining: 150000, utilizationPct: 90, status: "Warning" },
    { id: "BDG-005", fundId: "FND-001", fundName: "General Fund", category: "Utilities", year: "2025-26", plannedAmount: 500000, usedAmount: 380000, remaining: 120000, utilizationPct: 76, status: "On Track" },
    { id: "BDG-006", fundId: "FND-004", fundName: "Gopuram Construction", category: "Construction", year: "2025-26", plannedAmount: 3000000, usedAmount: 1800000, remaining: 1200000, utilizationPct: 60, status: "On Track" },
    { id: "BDG-007", fundId: "FND-001", fundName: "General Fund", category: "Pooja Supplies", year: "2025-26", plannedAmount: 400000, usedAmount: 320000, remaining: 80000, utilizationPct: 80, status: "On Track" },
  ];
}

/** Generate payroll from HR employee data */
function seedPayroll(): PayrollRecord[] {
  const eligible = getEligibleEmployees();
  const currentMonth = new Date().getMonth(); // 0-based
  const currentYear = new Date().getFullYear();
  const monthName = MONTH_NAMES[currentMonth].slice(0, 3);
  
  return eligible.map((emp, idx) => {
    const basicSalary = emp.basicSalary || 10000;
    const attendance = getAttendanceForPayroll(emp.employeeId, emp.name, currentMonth, currentYear);
    const calc = calculateNetPay(basicSalary, attendance);
    
    const isPaid = idx < 2;
    
    return {
      id: `PAY-${String(idx + 1).padStart(3, "0")}`,
      employeeId: emp.employeeId,
      employeeName: emp.name,
      role: emp.designation,
      department: emp.department,
      month: monthName,
      year: String(currentYear),
      basicSalary,
      salary: calc.salary,
      deductions: calc.deductions,
      netPay: calc.netPay,
      daysPresent: attendance.daysPresent,
      totalDays: attendance.totalDays,
      attendanceMode: attendance.mode,
      status: isPaid ? "Paid" as const : "Pending" as const,
      ...(isPaid ? { paidDate: today(), transactionId: `TXN-${currentYear}-0000${idx + 6}` } : {}),
      bankName: emp.bankName || "",
      bankAccountNumber: emp.bankAccountNumber || "",
      ifscCode: emp.ifscCode || "",
      paymentMode: emp.paymentMode || "bank",
    };
  });
}

function seedState(): FinanceState {
  const state: FinanceState = {
    accounts: seedAccounts(),
    transactions: seedTransactions(),
    funds: seedFunds(),
    bankAccounts: seedBankAccounts(),
    budgets: seedBudgets(),
    payroll: seedPayroll(),
    categories: seedCategories(),
    ledgerEntries: [],
  };
  // Generate ledger entries from transactions and compute balances
  state.ledgerEntries = generateAllLedgerEntries(state);
  state.accounts = computeAccountBalances(state);
  return state;
}

// ─── Ledger Entry Generation ───
function generateLedgerEntries(txn: FinTransaction): LedgerEntry[] {
  if (txn.status !== "Completed") return [];
  const entries: LedgerEntry[] = [];
  const base = { transactionId: txn.id, date: txn.date, description: txn.description, fund: txn.fundName };

  if (txn.type === "Income") {
    // Dr Asset (account), Cr Income (category account)
    entries.push({ ...base, id: `LED-${txn.id}-D`, accountId: txn.account, accountName: txn.accountName, debit: txn.paidAmount, credit: 0 });
    entries.push({ ...base, id: `LED-${txn.id}-C`, accountId: getCategoryAccountId(txn.category, "Income"), accountName: txn.category, debit: 0, credit: txn.paidAmount });
  } else if (txn.type === "Expense") {
    // Dr Expense (category), Cr Asset (account)
    entries.push({ ...base, id: `LED-${txn.id}-D`, accountId: getCategoryAccountId(txn.category, "Expense"), accountName: txn.category, debit: txn.paidAmount, credit: 0 });
    entries.push({ ...base, id: `LED-${txn.id}-C`, accountId: txn.account, accountName: txn.accountName, debit: 0, credit: txn.paidAmount });
  } else if (txn.type === "Transfer") {
    // Dr Destination, Cr Source
    entries.push({ ...base, id: `LED-${txn.id}-D`, accountId: txn.destinationAccount || "", accountName: txn.destinationAccountName || "", debit: txn.paidAmount, credit: 0 });
    entries.push({ ...base, id: `LED-${txn.id}-C`, accountId: txn.account, accountName: txn.accountName, debit: 0, credit: txn.paidAmount });
  }
  return entries;
}

function getCategoryAccountId(category: string, type: "Income" | "Expense"): string {
  const map: Record<string, string> = {
    "General Donation": "ACC-010", "Seva Revenue": "ACC-011", "Hundi Collection": "ACC-012",
    "Event Collection": "ACC-013", "Project Donation": "ACC-010", "Rental Income": "ACC-014",
    "Interest Income": "ACC-015", "Other Income": "ACC-016",
    "Annadanam": "ACC-020", "Maintenance": "ACC-021", "Salary": "ACC-022",
    "Utilities": "ACC-023", "Festival Expenses": "ACC-024", "Construction": "ACC-025",
    "Pooja Supplies": "ACC-026", "Security": "ACC-027", "Administration": "ACC-028",
    "Other Expense": "ACC-029",
  };
  return map[category] || (type === "Income" ? "ACC-016" : "ACC-029");
}

function generateAllLedgerEntries(state: FinanceState): LedgerEntry[] {
  return state.transactions.flatMap(t => generateLedgerEntries(t));
}

function computeAccountBalances(state: FinanceState): FinanceAccount[] {
  const balanceMap = new Map<string, number>();

  state.ledgerEntries.forEach(entry => {
    const acc = state.accounts.find(a => a.id === entry.accountId);
    if (!acc) return;
    const current = balanceMap.get(entry.accountId) || 0;
    if (["Asset", "Expense"].includes(acc.type)) {
      balanceMap.set(entry.accountId, current + entry.debit - entry.credit);
    } else {
      balanceMap.set(entry.accountId, current + entry.credit - entry.debit);
    }
  });

  return state.accounts.map(a => ({
    ...a,
    currentBalance: a.openingBalance + (balanceMap.get(a.id) || 0),
  }));
}

// ─── Store Singleton ───
let stateCache: FinanceState | null = null;
const listeners = new Set<() => void>();

function emit() { listeners.forEach(l => l()); }
function persist() { try { localStorage.setItem(LS_KEY, JSON.stringify(stateCache)); } catch {} }

export function getFinanceState(): FinanceState {
  if (stateCache) return stateCache;
  const raw = typeof window !== "undefined" ? localStorage.getItem(LS_KEY) : null;
  stateCache = raw ? JSON.parse(raw) : seedState();
  return stateCache!;
}

export function resetFinanceStore() {
  localStorage.removeItem(LS_KEY);
  stateCache = null;
}

export function subscribeFinanceStore(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function setState(next: FinanceState) {
  stateCache = next;
  persist();
  emit();
}

function refreshBalances(state: FinanceState): FinanceState {
  const ledgerEntries = generateAllLedgerEntries(state);
  const accounts = computeAccountBalances({ ...state, ledgerEntries });
  return { ...state, ledgerEntries, accounts };
}

// ─── Actions ───
export const financeActions = {
  createTransaction(input: {
    type: TransactionType;
    amount: number;
    date: string;
    category: string;
    subCategory?: string;
    paymentMethod: PaymentMethod;
    account: string;
    accountName: string;
    destinationAccount?: string;
    destinationAccountName?: string;
    fund: string;
    fundName: string;
    referenceId?: string;
    referenceType?: string;
    externalReference?: string;
    status: TransactionStatus;
    description: string;
    notes?: string;
    createdBy: string;
    approvedBy?: string;
    source?: FinTransaction["source"];
    attachments?: FinTransaction["attachments"];
  }): FinTransaction {
    const st = getFinanceState();
    const id = nextId("TXN", st.transactions);

    const isPaid = input.status === "Completed";
    const payments: TransactionPayment[] = isPaid ? [{
      id: `TP-${id}`, amount: input.amount, method: input.paymentMethod, date: input.date,
      referenceNumber: input.externalReference || "",
    }] : [];

    const txn: FinTransaction = {
      id,
      type: input.type,
      amount: input.amount,
      date: input.date,
      category: input.category,
      subCategory: input.subCategory || "",
      paymentMethod: input.paymentMethod,
      account: input.account,
      accountName: input.accountName,
      destinationAccount: input.destinationAccount,
      destinationAccountName: input.destinationAccountName,
      fund: input.fund,
      fundName: input.fundName,
      referenceId: input.referenceId || "",
      referenceType: input.referenceType || "Manual",
      externalReference: input.externalReference || "",
      status: input.status,
      paymentStatus: isPaid ? "Paid" : "Unpaid",
      paidAmount: isPaid ? input.amount : 0,
      payments,
      description: input.description,
      notes: input.notes || "",
      createdBy: input.createdBy,
      approvedBy: input.approvedBy || "",
      createdAt: now(),
      reversalOfId: "",
      reversedById: "",
      ledgerEntries: [],
      reconciliationStatus: isPaid ? "Matched" : "Pending",
      attachments: input.attachments || [],
      source: input.source || "Manual",
    };

    const nextState = refreshBalances({
      ...st,
      transactions: [txn, ...st.transactions],
    });
    setState(nextState);
    return txn;
  },

  recordPayment(txnId: string, amount: number, method: PaymentMethod, ref: string): boolean {
    const st = getFinanceState();
    const txn = st.transactions.find(t => t.id === txnId);
    if (!txn || txn.status === "Failed") return false;
    const remaining = txn.amount - txn.paidAmount;
    if (amount <= 0 || amount > remaining) return false;

    const updated = st.transactions.map(t => {
      if (t.id !== txnId) return t;
      const newPaid = t.paidAmount + amount;
      const newPayments = [...t.payments, {
        id: `TP-${t.id}-${t.payments.length + 1}`, amount, method, date: today(), referenceNumber: ref,
      }];
      const paymentStatus: PaymentStatus = newPaid >= t.amount ? "Paid" : "Partially Paid";
      const status: TransactionStatus = paymentStatus === "Paid" ? "Completed" : t.status;
      return { ...t, paidAmount: newPaid, payments: newPayments, paymentStatus, status };
    });

    setState(refreshBalances({ ...st, transactions: updated }));
    return true;
  },

  reverseTransaction(txnId: string, createdBy: string): FinTransaction | null {
    const st = getFinanceState();
    const original = st.transactions.find(t => t.id === txnId);
    if (!original || original.status !== "Completed" || original.reversedById) return null;

    const id = nextId("TXN", st.transactions);
    const reversal: FinTransaction = {
      ...original,
      id,
      description: `[REVERSAL] ${original.description}`,
      type: original.type === "Income" ? "Expense" : original.type === "Expense" ? "Income" : "Transfer",
      reversalOfId: txnId,
      reversedById: "",
      createdBy,
      createdAt: now(),
      date: today(),
      notes: `Reversal of ${txnId}`,
      source: "System",
      payments: [{ id: `TP-${id}`, amount: original.amount, method: original.paymentMethod, date: today(), referenceNumber: `REV-${txnId}` }],
    };

    if (original.type === "Transfer") {
      reversal.account = original.destinationAccount || original.account;
      reversal.accountName = original.destinationAccountName || original.accountName;
      reversal.destinationAccount = original.account;
      reversal.destinationAccountName = original.accountName;
    }

    const updatedTxns = st.transactions.map(t => t.id === txnId ? { ...t, reversedById: id } : t);
    setState(refreshBalances({ ...st, transactions: [reversal, ...updatedTxns] }));
    return reversal;
  },

  markFailed(txnId: string): boolean {
    const st = getFinanceState();
    const txn = st.transactions.find(t => t.id === txnId);
    if (!txn || txn.status === "Completed") return false;
    const updated = st.transactions.map(t => t.id === txnId ? { ...t, status: "Failed" as TransactionStatus } : t);
    setState(refreshBalances({ ...st, transactions: updated }));
    return true;
  },

  addAccount(input: { name: string; code: string; type: AccountType; accountCategory?: FinanceAccount["accountCategory"]; parentAccount?: string; description?: string }) {
    const st = getFinanceState();
    const id = simpleId("ACC", st.accounts);
    const account: FinanceAccount = {
      id, code: input.code, name: input.name, type: input.type,
      accountCategory: input.accountCategory, parentAccount: input.parentAccount,
      description: input.description, isSystem: false, openingBalance: 0, currentBalance: 0,
    };
    setState({ ...st, accounts: [...st.accounts, account] });
    return account;
  },

  addFund(input: { name: string; type: FundType; description?: string }) {
    const st = getFinanceState();
    const id = simpleId("FND", st.funds);
    const fund: Fund = { id, name: input.name, type: input.type, description: input.description, status: "Active" };
    setState({ ...st, funds: [...st.funds, fund] });
    return fund;
  },

  addCategory(input: { name: string; type: "Income" | "Expense"; suggestedFund?: string }) {
    const st = getFinanceState();
    if (st.categories.some(c => c.name.toLowerCase() === input.name.toLowerCase())) return null;
    const id = simpleId("CAT", st.categories);
    const cat: FinanceCategory = { id, name: input.name, type: input.type, suggestedFund: input.suggestedFund };
    setState({ ...st, categories: [...st.categories, cat] });
    return cat;
  },

  addBudget(input: Omit<BudgetItem, "id" | "usedAmount" | "remaining" | "utilizationPct" | "status">) {
    const st = getFinanceState();
    const id = simpleId("BDG", st.budgets);
    const budget: BudgetItem = { ...input, id, usedAmount: 0, remaining: input.plannedAmount, utilizationPct: 0, status: "On Track" };
    setState({ ...st, budgets: [...st.budgets, budget] });
    return budget;
  },

  /** Refresh payroll records from HR employee data with optional month/year */
  refreshPayrollFromHR(monthName?: string, year?: string) {
    const st = getFinanceState();
    const targetMonth = monthName || MONTH_NAMES[new Date().getMonth()].slice(0, 3);
    const targetYear = year || String(new Date().getFullYear());
    // Keep records for OTHER months as-is. Only regenerate for the selected month/year.
    const otherMonthRecords = st.payroll.filter(p => !(p.month === targetMonth && p.year === targetYear));
    const sameMonthPaid = st.payroll.filter(p => p.month === targetMonth && p.year === targetYear && p.status === "Paid");
    const paidEmployeeIds = new Set(sameMonthPaid.map(p => p.employeeId));
    const eligible = getEligibleEmployees().filter(e => !paidEmployeeIds.has(e.employeeId));
    const monthIdx = MONTH_NAMES.findIndex(m => m.startsWith(targetMonth));
    const yearNum = parseInt(targetYear);
    
    const newRecords: PayrollRecord[] = eligible.map((emp, idx) => {
      const basicSalary = emp.basicSalary || 10000;
      const attendance = getAttendanceForPayroll(emp.employeeId, emp.name, monthIdx >= 0 ? monthIdx : new Date().getMonth(), yearNum);
      const calc = calculateNetPay(basicSalary, attendance);
      
      return {
        id: simpleId("PAY", [...st.payroll, ...eligible.slice(0, idx).map((_, i) => ({ id: `PAY-${900 + i}` }))]),
        employeeId: emp.employeeId,
        employeeName: emp.name,
        role: emp.designation,
        department: emp.department,
        month: targetMonth,
        year: targetYear,
        basicSalary,
        salary: calc.salary,
        deductions: calc.deductions,
        netPay: calc.netPay,
        daysPresent: attendance.daysPresent,
        totalDays: attendance.totalDays,
        attendanceMode: attendance.mode,
        status: "Pending" as const,
        bankName: emp.bankName || "",
        bankAccountNumber: emp.bankAccountNumber || "",
        ifscCode: emp.ifscCode || "",
        paymentMode: emp.paymentMode || "bank",
      };
    });
    
    setState({ ...st, payroll: [...otherMonthRecords, ...sameMonthPaid, ...newRecords] });
    return newRecords.length;
  },

  payrollMarkPaid(payrollId: string, sourceAccountId?: string, sourceAccountName?: string) {
    const st = getFinanceState();
    const rec = st.payroll.find(p => p.id === payrollId);
    if (!rec || rec.status === "Paid") return;

    const isCashEmp = (rec.paymentMode || "bank").toLowerCase() === "cash";
    const accId = sourceAccountId || (isCashEmp ? "ACC-001" : "ACC-002");
    const accName = sourceAccountName || (isCashEmp ? "Cash on Hand" : "SBI Main Account");
    const payMethod = isCashEmp ? "Cash" : "Bank";

    // Create expense transaction
    const txn = financeActions.createTransaction({
      type: "Expense", amount: rec.netPay, date: today(), category: "Salary",
      paymentMethod: payMethod as any, account: accId, accountName: accName,
      fund: "FND-001", fundName: "General Fund", referenceId: payrollId,
      referenceType: "Payroll", status: "Completed",
      description: `Salary - ${rec.employeeName} (${rec.month} ${rec.year})`,
      createdBy: "System", source: "Payroll",
    });

    // Re-read state since createTransaction already modified it
    const currentState = getFinanceState();
    const updatedPayroll = currentState.payroll.map(p =>
      p.id === payrollId ? { ...p, status: "Paid" as const, paidDate: today(), transactionId: txn.id } : p
    );
    setState({ ...currentState, payroll: updatedPayroll });
  },

  /** Bulk pay all pending payroll records */
  payrollBulkPay(sourceAccountId?: string, sourceAccountName?: string): number {
    const st = getFinanceState();
    const pending = st.payroll.filter(p => p.status === "Pending" || p.status === "Processing");
    if (pending.length === 0) return 0;

    let count = 0;
    for (const rec of pending) {
      financeActions.payrollMarkPaid(rec.id, sourceAccountId, sourceAccountName);
      count++;
    }
    return count;
  },

  /** Reset (delete) all payroll records for a given month/year — for testing/re-runs */
  resetPayrollMonth(monthName: string, year: string): number {
    const st = getFinanceState();
    const monthShort = monthName.slice(0, 3);
    const removed = st.payroll.filter(p => p.month === monthShort && p.year === year);
    const remaining = st.payroll.filter(p => !(p.month === monthShort && p.year === year));
    setState({ ...st, payroll: remaining });
    return removed.length;
  },

  /** Toggle attendance mode for a payroll record and recalculate */
  toggleAttendanceMode(payrollId: string) {
    const st = getFinanceState();
    const rec = st.payroll.find(p => p.id === payrollId);
    if (!rec || rec.status === "Paid") return;

    const newMode: "actual" | "full_month" = rec.attendanceMode === "actual" ? "full_month" : "actual";
    const monthIdx = MONTH_NAMES.findIndex(m => m.startsWith(rec.month));
    const attendance = getAttendanceForPayroll(rec.employeeId, rec.employeeName, monthIdx >= 0 ? monthIdx : 0, parseInt(rec.year));

    const overriddenAttendance = newMode === "full_month"
      ? { daysPresent: attendance.totalDays, totalDays: attendance.totalDays, mode: "full_month" as const }
      : attendance;

    const calc = calculateNetPay(rec.basicSalary, overriddenAttendance);

    const updatedPayroll: PayrollRecord[] = st.payroll.map(p =>
      p.id === payrollId ? {
        ...p,
        attendanceMode: newMode,
        daysPresent: overriddenAttendance.daysPresent,
        totalDays: overriddenAttendance.totalDays,
        salary: calc.salary,
        deductions: calc.deductions,
        netPay: calc.netPay,
      } : p
    );
    setState({ ...st, payroll: updatedPayroll });
  },
};

// ─── Selectors ───
export const financeSelectors = {
  getAccounts: () => getFinanceState().accounts,
  getAssetAccounts: () => getFinanceState().accounts.filter(a => a.type === "Asset"),
  getTransactions: () => getFinanceState().transactions,
  getFunds: () => getFinanceState().funds,
  getBankAccounts: () => getFinanceState().bankAccounts,
  getBudgets: () => getFinanceState().budgets,
  getPayroll: () => getFinanceState().payroll,
  getCategories: () => getFinanceState().categories,
  getLedgerEntries: () => getFinanceState().ledgerEntries,
  getAccountById: (id: string) => getFinanceState().accounts.find(a => a.id === id),

  getAccountTransactions: (accountId: string) => {
    return getFinanceState().transactions.filter(t =>
      t.account === accountId || t.destinationAccount === accountId
    );
  },

  getFundBalance: (fundId: string) => {
    const txns = getFinanceState().transactions.filter(t => t.fund === fundId && t.status === "Completed" && !t.reversalOfId);
    const income = txns.filter(t => t.type === "Income").reduce((s, t) => s + t.paidAmount, 0);
    const expense = txns.filter(t => t.type === "Expense").reduce((s, t) => s + t.paidAmount, 0);
    return income - expense;
  },

  getFundSummaries: () => {
    const st = getFinanceState();
    return st.funds.map(f => ({
      ...f,
      balance: financeSelectors.getFundBalance(f.id),
      income: st.transactions.filter(t => t.fund === f.id && t.type === "Income" && t.status === "Completed" && !t.reversalOfId).reduce((s, t) => s + t.paidAmount, 0),
      expense: st.transactions.filter(t => t.fund === f.id && t.type === "Expense" && t.status === "Completed" && !t.reversalOfId).reduce((s, t) => s + t.paidAmount, 0),
    }));
  },

  getSuggestedFund: (category: string) => {
    const cats = getFinanceState().categories;
    const cat = cats.find(c => c.name === category);
    if (!cat?.suggestedFund) return { id: "FND-001", name: "General Fund" };
    const fund = getFinanceState().funds.find(f => f.id === cat.suggestedFund);
    return fund ? { id: fund.id, name: fund.name } : { id: "FND-001", name: "General Fund" };
  },

  getSummary: () => {
    const txns = getFinanceState().transactions.filter(t => t.status === "Completed" && !t.reversalOfId);
    const totalIncome = txns.filter(t => t.type === "Income").reduce((s, t) => s + t.paidAmount, 0);
    const totalExpense = txns.filter(t => t.type === "Expense").reduce((s, t) => s + t.paidAmount, 0);
    const totalTransfers = txns.filter(t => t.type === "Transfer").reduce((s, t) => s + t.paidAmount, 0);
    const pending = getFinanceState().transactions.filter(t => t.status === "Pending").length;
    const accounts = getFinanceState().accounts.filter(a => a.type === "Asset");
    const totalCash = accounts.filter(a => a.accountCategory === "Cash").reduce((s, a) => s + a.currentBalance, 0);
    const totalBank = accounts.filter(a => a.accountCategory === "Bank").reduce((s, a) => s + a.currentBalance, 0);
    return { totalIncome, totalExpense, totalTransfers, netBalance: totalIncome - totalExpense, pending, totalCash, totalBank, totalAssets: totalCash + totalBank };
  },

  getTrialBalance: () => getFinanceState().accounts.filter(a => a.currentBalance !== 0),
};
