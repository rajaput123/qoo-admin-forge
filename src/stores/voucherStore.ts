// Shared Voucher/Request Store — Central entity for all purchase workflows
import { financeActions, financeSelectors } from "@/modules/finance/financeStore";

export type RequestType = "Purchase" | "Expense" | "Maintenance";
export type RequestStatus = "Requested" | "Approved" | "Rejected" | "PO Created" | "Completed";

export interface VoucherItem {
  name: string;
  qty: number;
  estPrice: number;
}

export interface VoucherRequest {
  id: string;
  type: RequestType;
  description: string;
  amount: number;
  department: string;
  status: RequestStatus;
  requestedBy: string;
  approvedBy: string;
  rejectionReason: string;
  createdDate: string;
  updatedDate: string;
  linkedPOId: string;
  linkedLedgerEntryId: string;
  items: VoucherItem[];
  priority: "Low" | "Medium" | "High" | "Urgent";
  notes: string;
}

// --- Seed data ---
const seedRequests: VoucherRequest[] = [
  {
    id: "REQ-001", type: "Purchase", description: "Camphor and Ghee for daily pooja",
    amount: 9000, department: "Pooja & Rituals", status: "Completed",
    requestedBy: "Head Priest", approvedBy: "Finance Head", rejectionReason: "",
    createdDate: "2026-03-20", updatedDate: "2026-03-25",
    linkedPOId: "PO-2026-001", linkedLedgerEntryId: "LED-101",
    items: [{ name: "Camphor (5kg)", qty: 5, estPrice: 800 }, { name: "Ghee (10L)", qty: 10, estPrice: 500 }],
    priority: "High", notes: "",
  },
  {
    id: "REQ-002", type: "Purchase", description: "Rice and Dal for Annadanam kitchen",
    amount: 4650, department: "Kitchen & Prasadam", status: "Approved",
    requestedBy: "Kitchen Manager", approvedBy: "Admin", rejectionReason: "",
    createdDate: "2026-03-22", updatedDate: "2026-03-23",
    linkedPOId: "", linkedLedgerEntryId: "",
    items: [{ name: "Rice (50kg)", qty: 50, estPrice: 45 }, { name: "Dal (20kg)", qty: 20, estPrice: 120 }],
    priority: "High", notes: "For daily Annadanam",
  },
  {
    id: "REQ-003", type: "Maintenance", description: "Paint for Gopuram restoration",
    amount: 8000, department: "Maintenance", status: "PO Created",
    requestedBy: "Maintenance Staff", approvedBy: "Admin", rejectionReason: "",
    createdDate: "2026-03-18", updatedDate: "2026-03-22",
    linkedPOId: "PO-2026-003", linkedLedgerEntryId: "",
    items: [{ name: "Paint (20L)", qty: 20, estPrice: 350 }, { name: "Brushes", qty: 10, estPrice: 100 }],
    priority: "Medium", notes: "Gopuram inner painting",
  },
  {
    id: "REQ-004", type: "Expense", description: "Monthly stationery for office",
    amount: 5000, department: "Administration", status: "Requested",
    requestedBy: "Office Staff", approvedBy: "", rejectionReason: "",
    createdDate: "2026-03-25", updatedDate: "2026-03-25",
    linkedPOId: "", linkedLedgerEntryId: "",
    items: [{ name: "Printer Paper (5 Reams)", qty: 5, estPrice: 400 }, { name: "Ink Cartridges", qty: 2, estPrice: 1500 }],
    priority: "Low", notes: "Monthly stationery",
  },
  {
    id: "REQ-005", type: "Purchase", description: "Flower decoration for Brahmotsavam",
    amount: 40000, department: "Events", status: "Requested",
    requestedBy: "Event Coordinator", approvedBy: "", rejectionReason: "",
    createdDate: "2026-03-26", updatedDate: "2026-03-26",
    linkedPOId: "", linkedLedgerEntryId: "",
    items: [{ name: "Flower Decoration Set", qty: 1, estPrice: 25000 }, { name: "Sound System Rental", qty: 1, estPrice: 15000 }],
    priority: "Urgent", notes: "For Brahmotsavam Day 1",
  },
  {
    id: "REQ-006", type: "Purchase", description: "LED Bulbs and wiring for temple lighting",
    amount: 10000, department: "Utilities", status: "Rejected",
    requestedBy: "Electrician", approvedBy: "", rejectionReason: "Budget exceeded for this quarter",
    createdDate: "2026-03-15", updatedDate: "2026-03-17",
    linkedPOId: "", linkedLedgerEntryId: "",
    items: [{ name: "LED Bulbs", qty: 50, estPrice: 150 }, { name: "Wiring (100m)", qty: 1, estPrice: 2500 }],
    priority: "Medium", notes: "",
  },
];

// --- In-memory store ---
export const voucherRequests: VoucherRequest[] = [...seedRequests];

// --- Actions ---
let nextNum = seedRequests.length + 1;

export function createRequest(data: Omit<VoucherRequest, "id" | "status" | "approvedBy" | "rejectionReason" | "updatedDate" | "linkedPOId" | "linkedLedgerEntryId">): VoucherRequest {
  const id = `REQ-${String(nextNum++).padStart(3, "0")}`;
  const now = new Date().toISOString().slice(0, 10);
  const req: VoucherRequest = {
    ...data,
    id,
    status: "Requested",
    approvedBy: "",
    rejectionReason: "",
    updatedDate: now,
    linkedPOId: "",
    linkedLedgerEntryId: "",
  };
  voucherRequests.unshift(req);
  return req;
}

export function approveRequest(id: string, approvedBy: string): boolean {
  const req = voucherRequests.find(r => r.id === id);
  if (!req || req.status !== "Requested") return false;
  req.status = "Approved";
  req.approvedBy = approvedBy;
  req.updatedDate = new Date().toISOString().slice(0, 10);

  // Auto-create expense transaction in Finance ledger
  try {
    const category = req.type === "Maintenance" ? "Maintenance" : req.department.includes("Kitchen") ? "Annadanam" : req.department.includes("Pooja") ? "Pooja Supplies" : req.department.includes("Event") ? "Festival Expenses" : req.department.includes("Utilit") ? "Utilities" : "Administration";
    const suggestedFund = financeSelectors.getSuggestedFund(category);
    const txn = financeActions.createTransaction({
      type: "Expense" as const,
      amount: req.amount,
      date: req.updatedDate,
      category,
      subCategory: req.type,
      paymentMethod: "Bank" as const,
      account: "ACC-002",
      accountName: "SBI Main Account",
      fund: suggestedFund.id,
      fundName: suggestedFund.name,
      referenceId: req.id,
      referenceType: "Voucher",
      status: "Pending" as const,
      description: `[Voucher ${req.id}] ${req.description}`,
      notes: `Department: ${req.department} • Requested by: ${req.requestedBy} • Approved by: ${approvedBy}`,
      createdBy: "System",
      source: "System" as const,
    });
    req.linkedLedgerEntryId = txn.id;
  } catch (e) {
    console.error("Failed to create finance transaction for voucher", e);
  }

  return true;
}

export function rejectRequest(id: string, reason: string): boolean {
  const req = voucherRequests.find(r => r.id === id);
  if (!req || req.status !== "Requested") return false;
  req.status = "Rejected";
  req.rejectionReason = reason;
  req.updatedDate = new Date().toISOString().slice(0, 10);
  return true;
}

export function linkPOToRequest(requestId: string, poId: string): boolean {
  const req = voucherRequests.find(r => r.id === requestId);
  if (!req || req.status !== "Approved") return false;
  req.status = "PO Created";
  req.linkedPOId = poId;
  req.updatedDate = new Date().toISOString().slice(0, 10);
  return true;
}

export function completeRequest(id: string, ledgerEntryId?: string): boolean {
  const req = voucherRequests.find(r => r.id === id);
  if (!req || req.status !== "PO Created") return false;
  req.status = "Completed";
  req.linkedLedgerEntryId = ledgerEntryId || "";
  req.updatedDate = new Date().toISOString().slice(0, 10);
  return true;
}

export function getRequest(id: string): VoucherRequest | undefined {
  return voucherRequests.find(r => r.id === id);
}

export function getRequestsByStatus(status: RequestStatus): VoucherRequest[] {
  return voucherRequests.filter(r => r.status === status);
}

export function getApprovedUnlinkedRequests(): VoucherRequest[] {
  return voucherRequests.filter(r => r.status === "Approved" && !r.linkedPOId);
}
