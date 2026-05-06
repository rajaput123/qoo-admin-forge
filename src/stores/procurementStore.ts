// Procurement Store — Full lifecycle: Request → PO → GRN → Invoice → Payment → Transaction → Ledger
// Uses Freelancer entity as Supplier

export type POStatus = "Created" | "Sent" | "Ready for Delivery" | "Closed";

export interface ProcurementPO {
  id: string;
  requestId: string;
  freelancerId: string;
  freelancerName: string;
  items: { name: string; qty: number; unitPrice: number; total: number }[];
  totalAmount: number;
  expectedDate: string;
  status: POStatus;
  createdDate: string;
  createdBy: string;
}

export interface GoodsReceipt {
  id: string;
  poId: string;
  requestId: string;
  freelancerId: string;
  freelancerName: string;
  items: { name: string; orderedQty: number; receivedQty: number; acceptedQty: number; rejectedQty: number; unitPrice: number }[];
  receivedDate: string;
  receivedBy: string;
  status: "Full" | "Partial" | "Pending";
  notes: string;
}

export interface ProcurementInvoice {
  id: string;
  invoiceNumber: string;
  grnId: string;
  poId: string;
  requestId: string;
  freelancerId: string;
  freelancerName: string;
  amount: number;
  invoiceDate: string;
  dueDate: string;
  status: "Pending" | "Verified" | "Paid";
  notes: string;
}

export interface ProcurementPayment {
  id: string;
  invoiceId: string;
  poId: string;
  requestId: string;
  freelancerId: string;
  freelancerName: string;
  amount: number;
  paymentMethod: "Cash" | "Bank" | "UPI";
  paymentDate: string;
  referenceNumber: string;
  status: "Full" | "Partial";
}

export interface ProcurementTransaction {
  id: string;
  paymentId: string;
  invoiceId: string;
  poId: string;
  requestId: string;
  freelancerId: string;
  type: "Expense";
  amount: number;
  date: string;
  account: "Cash" | "Bank";
  description: string;
}

export interface ProcurementLedgerEntry {
  id: string;
  transactionId: string;
  paymentId: string;
  invoiceId: string;
  poId: string;
  requestId: string;
  amount: number;
  date: string;
  debitAccount: string;
  creditAccount: string;
  description: string;
}

// --- Seed data ---
const seedPOs: ProcurementPO[] = [
  {
    id: "PPO-001", requestId: "REQ-001", freelancerId: "FRL-0001", freelancerName: "Pixel Studio",
    items: [{ name: "Camphor (5kg)", qty: 5, unitPrice: 800, total: 4000 }, { name: "Ghee (10L)", qty: 10, unitPrice: 500, total: 5000 }],
    totalAmount: 9000, expectedDate: "2026-03-28", status: "Closed", createdDate: "2026-03-21", createdBy: "Admin"
  },
  {
    id: "PPO-002", requestId: "REQ-003", freelancerId: "FRL-0002", freelancerName: "Decor Dreams",
    items: [{ name: "Paint (20L)", qty: 20, unitPrice: 350, total: 7000 }, { name: "Brushes", qty: 10, unitPrice: 100, total: 1000 }],
    totalAmount: 8000, expectedDate: "2026-03-25", status: "Ready for Delivery", createdDate: "2026-03-22", createdBy: "Admin"
  },
];

const seedGRNs: GoodsReceipt[] = [
  {
    id: "GRN-001", poId: "PPO-001", requestId: "REQ-001", freelancerId: "FRL-0001", freelancerName: "Pixel Studio",
    items: [
      { name: "Camphor (5kg)", orderedQty: 5, receivedQty: 5, acceptedQty: 5, rejectedQty: 0, unitPrice: 800 },
      { name: "Ghee (10L)", orderedQty: 10, receivedQty: 10, acceptedQty: 10, rejectedQty: 0, unitPrice: 500 },
    ],
    receivedDate: "2026-03-28", receivedBy: "Store Manager", status: "Full", notes: "All items received in good condition"
  },
];

const seedInvoices: ProcurementInvoice[] = [
  {
    id: "INV-001", invoiceNumber: "SUP-INV-2026-001", grnId: "GRN-001", poId: "PPO-001", requestId: "REQ-001",
    freelancerId: "FRL-0001", freelancerName: "Pixel Studio",
    amount: 9000, invoiceDate: "2026-03-28", dueDate: "2026-04-05", status: "Paid", notes: ""
  },
];

const seedPayments: ProcurementPayment[] = [
  {
    id: "PPAY-001", invoiceId: "INV-001", poId: "PPO-001", requestId: "REQ-001",
    freelancerId: "FRL-0001", freelancerName: "Pixel Studio",
    amount: 9000, paymentMethod: "Bank", paymentDate: "2026-03-29", referenceNumber: "UTR-98765", status: "Full"
  },
];

const seedTransactions: ProcurementTransaction[] = [
  {
    id: "PTXN-001", paymentId: "PPAY-001", invoiceId: "INV-001", poId: "PPO-001", requestId: "REQ-001",
    freelancerId: "FRL-0001", type: "Expense", amount: 9000, date: "2026-03-29",
    account: "Bank", description: "Payment for Camphor & Ghee - Pixel Studio"
  },
];

const seedLedger: ProcurementLedgerEntry[] = [
  {
    id: "PLED-001", transactionId: "PTXN-001", paymentId: "PPAY-001", invoiceId: "INV-001",
    poId: "PPO-001", requestId: "REQ-001", amount: 9000, date: "2026-03-29",
    debitAccount: "Expense - Pooja & Rituals", creditAccount: "Bank Account",
    description: "Camphor & Ghee purchase - Pixel Studio"
  },
];

// --- In-memory stores ---
export const procurementPOs: ProcurementPO[] = [...seedPOs];
export const goodsReceipts: GoodsReceipt[] = [...seedGRNs];
export const procurementInvoices: ProcurementInvoice[] = [...seedInvoices];
export const procurementPayments: ProcurementPayment[] = [...seedPayments];
export const procurementTransactions: ProcurementTransaction[] = [...seedTransactions];
export const procurementLedger: ProcurementLedgerEntry[] = [...seedLedger];

// --- ID generators ---
const nextId = (arr: { id: string }[], prefix: string) => {
  const max = arr.map(a => Number(a.id.split("-").pop()) || 0).reduce((m, n) => Math.max(m, n), 0);
  return `${prefix}-${String(max + 1).padStart(3, "0")}`;
};

// --- Freelancer data accessor (inline to avoid circular deps) ---
export const getFreelancerList = (): { id: string; name: string }[] => {
  // This returns a static list; in production this would query the freelancer module
  return [
    { id: "FRL-0001", name: "Pixel Studio" },
    { id: "FRL-0002", name: "Decor Dreams" },
    { id: "FRL-0003", name: "Sound Waves Pro" },
    { id: "FRL-0004", name: "Vidya's Catering" },
    { id: "FRL-0005", name: "Green Gardens" },
    { id: "FRL-0006", name: "Temple Electricals" },
    { id: "FRL-0007", name: "Swami Translations" },
    { id: "FRL-0008", name: "Ravi Security Services" },
  ];
};

// === STRICT LIFECYCLE ACTIONS ===

// 1. Create PO (only from Approved Request)
export function createProcurementPO(data: Omit<ProcurementPO, "id" | "status" | "createdDate">): ProcurementPO | null {
  const id = nextId(procurementPOs, "PPO");
  const po: ProcurementPO = { ...data, id, status: "Created", createdDate: new Date().toISOString().slice(0, 10) };
  procurementPOs.unshift(po);
  return po;
}

export function updatePOStatus(poId: string, status: POStatus): boolean {
  const po = procurementPOs.find(p => p.id === poId);
  if (!po) return false;
  po.status = status;
  return true;
}

// 2. Create GRN (only from valid PO)
export function createGRN(data: Omit<GoodsReceipt, "id">): GoodsReceipt | null {
  const po = procurementPOs.find(p => p.id === data.poId);
  if (!po || po.status === "Created") return null; // PO must be at least Sent
  const id = nextId(goodsReceipts, "GRN");
  const grn: GoodsReceipt = { ...data, id };
  goodsReceipts.unshift(grn);
  return grn;
}

// 3. Create Invoice (only from valid GRN)
export function createInvoice(data: Omit<ProcurementInvoice, "id" | "status">): ProcurementInvoice | null {
  const grn = goodsReceipts.find(g => g.id === data.grnId);
  if (!grn) return null;
  const id = nextId(procurementInvoices, "INV");
  const inv: ProcurementInvoice = { ...data, id, status: "Pending" };
  procurementInvoices.unshift(inv);
  return inv;
}

export function verifyInvoice(invoiceId: string): boolean {
  const inv = procurementInvoices.find(i => i.id === invoiceId);
  if (!inv || inv.status !== "Pending") return false;
  inv.status = "Verified";
  return true;
}

// 4. Create Payment (only from valid Invoice)
// Also auto-creates Transaction + Ledger entry
export function createPayment(data: Omit<ProcurementPayment, "id">): { payment: ProcurementPayment; transaction: ProcurementTransaction; ledger: ProcurementLedgerEntry } | null {
  const inv = procurementInvoices.find(i => i.id === data.invoiceId);
  if (!inv || inv.status === "Paid") return null;

  // Create Payment
  const payId = nextId(procurementPayments, "PPAY");
  const payment: ProcurementPayment = { ...data, id: payId };
  procurementPayments.unshift(payment);

  // Mark invoice paid
  inv.status = "Paid";

  // Auto-create Transaction
  const txnId = nextId(procurementTransactions, "PTXN");
  const txn: ProcurementTransaction = {
    id: txnId, paymentId: payId, invoiceId: data.invoiceId,
    poId: data.poId, requestId: data.requestId, freelancerId: data.freelancerId,
    type: "Expense", amount: data.amount, date: data.paymentDate,
    account: data.paymentMethod === "Cash" ? "Cash" : "Bank",
    description: `Payment to ${data.freelancerName} - ${inv.invoiceNumber}`
  };
  procurementTransactions.unshift(txn);

  // Auto-create Ledger Entry
  const ledId = nextId(procurementLedger, "PLED");
  const ledger: ProcurementLedgerEntry = {
    id: ledId, transactionId: txnId, paymentId: payId,
    invoiceId: data.invoiceId, poId: data.poId, requestId: data.requestId,
    amount: data.amount, date: data.paymentDate,
    debitAccount: "Expense Account", creditAccount: data.paymentMethod === "Cash" ? "Cash Account" : "Bank Account",
    description: txn.description
  };
  procurementLedger.unshift(ledger);

  return { payment, transaction: txn, ledger };
}

// --- Query helpers ---
export const getPOsForRequest = (reqId: string) => procurementPOs.filter(p => p.requestId === reqId);
export const getGRNsForPO = (poId: string) => goodsReceipts.filter(g => g.poId === poId);
export const getInvoicesForGRN = (grnId: string) => procurementInvoices.filter(i => i.grnId === grnId);
export const getPaymentsForInvoice = (invId: string) => procurementPayments.filter(p => p.invoiceId === invId);
export const getTransactionForPayment = (payId: string) => procurementTransactions.find(t => t.paymentId === payId);
export const getLedgerForTransaction = (txnId: string) => procurementLedger.find(l => l.transactionId === txnId);

// Full traceability chain
export function getTraceChain(requestId: string) {
  const pos = getPOsForRequest(requestId);
  return pos.map(po => {
    const grns = getGRNsForPO(po.id);
    return {
      po,
      grns: grns.map(grn => {
        const invoices = getInvoicesForGRN(grn.id);
        return {
          grn,
          invoices: invoices.map(inv => {
            const payments = getPaymentsForInvoice(inv.id);
            return {
              invoice: inv,
              payments: payments.map(pay => {
                const txn = getTransactionForPayment(pay.id);
                const ledger = txn ? getLedgerForTransaction(txn.id) : undefined;
                return { payment: pay, transaction: txn, ledger };
              })
            };
          })
        };
      })
    };
  });
}
