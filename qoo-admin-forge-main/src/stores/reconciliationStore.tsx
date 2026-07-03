import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { differenceInDays, parseISO } from "date-fns";

// ─── Types ────────────────────────────────────────────────────────────────────

export type TxnType = "Donation" | "Seva" | "Expenses";
export type TxnNature = "Cash" | "Temple QR" | "Cheque" | "Payment Gateway";
export type ReconciliationStatus = "Reconciled" | "Pending" | "Priority";

export interface Transaction {
  id: string;           // TXN-YYYY-NNNN
  date: string;         // ISO date string YYYY-MM-DD
  type: TxnType;
  nature: TxnNature;
  description: string;
  amount: number;       // positive = credit, negative = debit
  bankRefNo: string | null;
  rzpAutoRef?: boolean; // true when ref was auto-fetched from Razorpay
  linkedStatementLineId: string | null;
}

export interface BankStatementLine {
  id: string;
  txnDate: string;      // ISO date string
  valueDate: string;    // ISO date string
  narration: string;
  refNo: string;
  debit: number | null;
  credit: number | null;
  balance: number;
  linkedTxnIds: string[]; // Transaction IDs linked to this line
}

// ─── Status Logic ─────────────────────────────────────────────────────────────

export function getTransactionStatus(txn: Transaction, now: Date): ReconciliationStatus {
  if (txn.bankRefNo) return "Reconciled";
  const daysOld = differenceInDays(now, parseISO(txn.date));
  if (daysOld > 7) return "Priority";
  return "Pending";
}

export function getStatementStatus(line: BankStatementLine, now: Date): ReconciliationStatus {
  if (line.linkedTxnIds.length > 0) return "Reconciled";
  const daysOld = differenceInDays(now, parseISO(line.txnDate));
  if (daysOld > 7) return "Priority";
  return "Pending";
}

export function getDaysOverdue(date: string, now: Date): number {
  return differenceInDays(now, parseISO(date));
}

// ─── Currency Formatter ───────────────────────────────────────────────────────

export function formatINR(amount: number): string {
  const abs = Math.abs(amount);
  const formatted = abs.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `₹${formatted}`;
}

// ─── Seed Data ────────────────────────────────────────────────────────────────

const TODAY = "2026-06-17";
const SEED_TRANSACTIONS: Transaction[] = [
  {
    id: "TXN-2026-0101",
    date: "2026-06-17",
    type: "Donation",
    nature: "Payment Gateway",
    description: "Annadanam Fund — Online Drive (Razorpay)",
    amount: 25000,
    bankRefNo: "pay_Nx81KqTbAa1201",
    rzpAutoRef: true,
    linkedStatementLineId: "STMT-001",
  },
  {
    id: "TXN-2026-0102",
    date: "2026-06-17",
    type: "Donation",
    nature: "Payment Gateway",
    description: "Corpus Fund — Sri Devasthanam Trust Online Donation",
    amount: 50000,
    bankRefNo: "pay_Qr94MsTcBb1202",
    rzpAutoRef: true,
    linkedStatementLineId: "STMT-002",
  },
  {
    id: "TXN-2026-0103",
    date: "2026-06-16",
    type: "Seva",
    nature: "Payment Gateway",
    description: "Abhisheka Seva — Dr. Ravi Kumar (Razorpay Batch)",
    amount: 5100,
    bankRefNo: "pay_Lm55JkRaXx1203",
    rzpAutoRef: true,
    linkedStatementLineId: "STMT-001",
  },
  {
    id: "TXN-2026-0104",
    date: "2026-06-16",
    type: "Donation",
    nature: "Cash",
    description: "Hundi Cash Deposit — Counted & Recorded by Priest",
    amount: 112500,
    bankRefNo: null,
    linkedStatementLineId: null,
  },
  {
    id: "TXN-2026-0105",
    date: "2026-06-15",
    type: "Expenses",
    nature: "Cheque",
    description: "Flower Vendor — Sri Mahalakshmi Flowers (Cheque No. 00241)",
    amount: -8400,
    bankRefNo: null,
    linkedStatementLineId: null,
  },
  {
    id: "TXN-2026-0106",
    date: "2026-06-14",
    type: "Expenses",
    nature: "Payment Gateway",
    description: "HESCOM Electricity Bill — June 2026 (BBPS Gateway)",
    amount: -14200,
    bankRefNo: "pay_Pp73WwYzCc1206",
    rzpAutoRef: true,
    linkedStatementLineId: null,
  },
  {
    id: "TXN-2026-0107",
    date: "2026-06-09",
    type: "Donation",
    nature: "Temple QR",
    description: "Navaratri Special Donation — QR Counter (2-Jun)",
    amount: 3500,
    bankRefNo: null,
    linkedStatementLineId: null,
  },
  {
    id: "TXN-2026-0108",
    date: "2026-06-08",
    type: "Seva",
    nature: "Temple QR",
    description: "Satyanarayana Puja Seva — QR Terminal #3",
    amount: 2100,
    bankRefNo: null,
    linkedStatementLineId: null,
  },
  {
    id: "TXN-2026-0109",
    date: "2026-06-07",
    type: "Donation",
    nature: "Cheque",
    description: "Endowment Trust — Cheque Deposit (SB/2026/ET-004)",
    amount: 250000,
    bankRefNo: null,
    linkedStatementLineId: null,
  },
  {
    id: "TXN-2026-0110",
    date: "2026-06-17",
    type: "Expenses",
    nature: "Cash",
    description: "Agarbathi & Pooja Materials — Daily Consumables",
    amount: -1800,
    bankRefNo: null,
    linkedStatementLineId: null,
  },
  {
    id: "TXN-2026-0111",
    date: "2026-06-16",
    type: "Donation",
    nature: "Payment Gateway",
    description: "Annadanam Fund — Daily Online Contribution (Batch)",
    amount: 12000,
    bankRefNo: "pay_Pp73WwYzCc1211",
    rzpAutoRef: true,
    linkedStatementLineId: "STMT-001",
  },
  {
    id: "TXN-2026-0112",
    date: "2026-06-15",
    type: "Seva",
    nature: "Payment Gateway",
    description: "Lakshmi Kubera Homam Seva — Booking Confirmed",
    amount: 8500,
    bankRefNo: "pay_Rr61VvXdDd1212",
    rzpAutoRef: true,
    linkedStatementLineId: "STMT-001",
  },
];

const SEED_STATEMENT_LINES: BankStatementLine[] = [
  {
    id: "STMT-001",
    txnDate: "2026-06-17",
    valueDate: "2026-06-17",
    narration: "NEFT CR-RAZORPAY SETTLEMENTS PVT LTD",
    refNo: "NEFT-SBIN52201",
    debit: null,
    credit: 45500,
    balance: 892340.5,
    linkedTxnIds: ["TXN-2026-0101", "TXN-2026-0111", "TXN-2026-0112"],
  },
  {
    id: "STMT-002",
    txnDate: "2026-06-17",
    valueDate: "2026-06-17",
    narration: "IMPS CR-CORPUS FUND ONLINE DONATION",
    refNo: "IMPS-HDFC80042",
    debit: null,
    credit: 50000,
    balance: 942340.5,
    linkedTxnIds: ["TXN-2026-0102"],
  },
  {
    id: "STMT-003",
    txnDate: "2026-06-16",
    valueDate: "2026-06-16",
    narration: "NEFT CR-RAZORPAY ABHISHEKA SEVA",
    refNo: "RAZORPAY-SEV01",
    debit: null,
    credit: 5100,
    balance: 846840.5,
    linkedTxnIds: ["TXN-2026-0103"],
  },
  {
    id: "STMT-004",
    txnDate: "2026-06-16",
    valueDate: "2026-06-16",
    narration: "CASH DEPOSIT-HUNDI COLLECTION",
    refNo: "CDM-SBI-0016",
    debit: null,
    credit: 112500,
    balance: 841740.5,
    linkedTxnIds: [],
  },
  {
    id: "STMT-005",
    txnDate: "2026-06-15",
    valueDate: "2026-06-15",
    narration: "CHQ CLR-SRI MAHALAKSHMI FLOWERS",
    refNo: "CHQ-00241",
    debit: 8400,
    credit: null,
    balance: 729240.5,
    linkedTxnIds: [],
  },
  {
    id: "STMT-006",
    txnDate: "2026-06-14",
    valueDate: "2026-06-14",
    narration: "BBPS-HESCOM ELECTRICITY BILL JUN26",
    refNo: "BBPS-HES8812",
    debit: 14200,
    credit: null,
    balance: 737640.5,
    linkedTxnIds: [],
  },
  {
    id: "STMT-007",
    txnDate: "2026-06-09",
    valueDate: "2026-06-09",
    narration: "UPI CR-TEMPLE QR NAVARATRI DONATION",
    refNo: "UPIREF-QR0709",
    debit: null,
    credit: 3500,
    balance: 751840.5,
    linkedTxnIds: [],
  },
  {
    id: "STMT-008",
    txnDate: "2026-06-08",
    valueDate: "2026-06-08",
    narration: "UPI CR-TEMPLE QR SATYANARAYANA PUJA",
    refNo: "UPIREF-QR0908",
    debit: null,
    credit: 2100,
    balance: 748340.5,
    linkedTxnIds: [],
  },
  {
    id: "STMT-009",
    txnDate: "2026-06-07",
    valueDate: "2026-06-08",
    narration: "CHQ DEP-ENDOWMENT TRUST SB 2026",
    refNo: "CHQDEP-ET0608",
    debit: null,
    credit: 250000,
    balance: 746240.5,
    linkedTxnIds: [],
  },
  {
    id: "STMT-010",
    txnDate: "2026-06-10",
    valueDate: "2026-06-10",
    narration: "CASH WITHDRAWAL-PETTY CASH OFFICE",
    refNo: "CASH-WD-0610",
    debit: 5000,
    credit: null,
    balance: 496240.5,
    linkedTxnIds: [],
  },
];

// ─── Context ──────────────────────────────────────────────────────────────────

interface ReconciliationState {
  transactions: Transaction[];
  statementLines: BankStatementLine[];
  now: Date;
  // Transaction actions
  applyBankRef: (txnId: string, ref: string, statementLineId?: string) => void;
  bulkApplyBankRef: (txnIds: string[], ref: string) => void;
  // Statement actions
  linkStatementLine: (lineId: string, txnId: string) => void;
  unlinkStatementLine: (lineId: string, txnId: string) => void;
  appendStatementLines: (lines: BankStatementLine[]) => void;
}

const ReconciliationContext = createContext<ReconciliationState | null>(null);

export function ReconciliationProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactionsState] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem("qoo.recon_transactions");
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return SEED_TRANSACTIONS;
  });
  const [statementLines, setStatementLinesState] = useState<BankStatementLine[]>(() => {
    try {
      const saved = localStorage.getItem("qoo.recon_statement_lines");
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return SEED_STATEMENT_LINES;
  });
  const now = new Date("2026-06-17T11:43:09+05:30");

  const setTransactions = (val: Transaction[] | ((prev: Transaction[]) => Transaction[])) => {
    setTransactionsState(prev => {
      const next = typeof val === "function" ? val(prev) : val;
      localStorage.setItem("qoo.recon_transactions", JSON.stringify(next));
      return next;
    });
  };

  const setStatementLines = (val: BankStatementLine[] | ((prev: BankStatementLine[]) => BankStatementLine[])) => {
    setStatementLinesState(prev => {
      const next = typeof val === "function" ? val(prev) : val;
      localStorage.setItem("qoo.recon_statement_lines", JSON.stringify(next));
      return next;
    });
  };

  const applyBankRef = useCallback((txnId: string, ref: string, statementLineId?: string) => {
    setTransactions(prev =>
      prev.map(t =>
        t.id === txnId
          ? { ...t, bankRefNo: ref, linkedStatementLineId: statementLineId ?? t.linkedStatementLineId }
          : t
      )
    );
    if (statementLineId) {
      setStatementLines(prev =>
        prev.map(l =>
          l.id === statementLineId && !l.linkedTxnIds.includes(txnId)
            ? { ...l, linkedTxnIds: [...l.linkedTxnIds, txnId] }
            : l
        )
      );
    }
  }, []);

  const bulkApplyBankRef = useCallback((txnIds: string[], ref: string) => {
    // Find a matching statement line by ref
    const matchingLine = statementLines.find(l => l.refNo === ref);
    setTransactions(prev =>
      prev.map(t =>
        txnIds.includes(t.id)
          ? { ...t, bankRefNo: ref, linkedStatementLineId: matchingLine?.id ?? t.linkedStatementLineId }
          : t
      )
    );
    if (matchingLine) {
      setStatementLines(prev =>
        prev.map(l =>
          l.id === matchingLine.id
            ? { ...l, linkedTxnIds: [...new Set([...l.linkedTxnIds, ...txnIds])] }
            : l
        )
      );
    }
  }, [statementLines]);

  const linkStatementLine = useCallback((lineId: string, txnId: string) => {
    setStatementLines(prev =>
      prev.map(l =>
        l.id === lineId && !l.linkedTxnIds.includes(txnId)
          ? { ...l, linkedTxnIds: [...l.linkedTxnIds, txnId] }
          : l
      )
    );
    // Find the ref from the statement line and apply to transaction
    const line = statementLines.find(l => l.id === lineId);
    if (line) {
      setTransactions(prev =>
        prev.map(t =>
          t.id === txnId ? { ...t, bankRefNo: line.refNo, linkedStatementLineId: lineId } : t
        )
      );
    }
  }, [statementLines]);

  const unlinkStatementLine = useCallback((lineId: string, txnId: string) => {
    setStatementLines(prev =>
      prev.map(l =>
        l.id === lineId ? { ...l, linkedTxnIds: l.linkedTxnIds.filter(id => id !== txnId) } : l
      )
    );
    setTransactions(prev =>
      prev.map(t =>
        t.id === txnId ? { ...t, bankRefNo: null, linkedStatementLineId: null } : t
      )
    );
  }, []);

  const appendStatementLines = useCallback((lines: BankStatementLine[]) => {
    setStatementLines(prev => {
      const existingRefs = new Set(prev.map(l => l.refNo));
      const newLines = lines.filter(l => !existingRefs.has(l.refNo));
      return [...prev, ...newLines];
    });
  }, []);

  return (
    <ReconciliationContext.Provider
      value={{
        transactions,
        statementLines,
        now,
        applyBankRef,
        bulkApplyBankRef,
        linkStatementLine,
        unlinkStatementLine,
        appendStatementLines,
      }}
    >
      {children}
    </ReconciliationContext.Provider>
  );
}

export function useReconciliation() {
  const ctx = useContext(ReconciliationContext);
  if (!ctx) throw new Error("useReconciliation must be used inside ReconciliationProvider");
  return ctx;
}

export { TODAY };
