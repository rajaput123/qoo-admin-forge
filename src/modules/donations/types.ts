export type DonorCategory = "Patron" | "Trust" | "Regular" | "Organization" | "Walk-in" | "Anonymous";

export interface DonorVipInfo {
  level: string; // e.g., "Platinum", "Gold", "Silver"
  validFrom: string; // ISO date
  validTill: string; // ISO date
  status: "Active" | "Expired" | "Inactive";
  approvedBy?: string;
  notes?: string;
}

export interface Donor {
  donorId: string; // e.g. DNR-001
  name: string;
  phone: string; // may be "-"
  email: string; // may be "-"
  city: string; // may be "-"
  pan: string; // may be "-"
  category: DonorCategory;
  eligible80G: boolean;
  vipInfo?: DonorVipInfo; // VIP information if donor is marked as VIP
  createdAt: string; // ISO datetime
}

export type DonationNature = "Cash" | "Non-Cash";

export type DonationChannel = "Cash" | "UPI" | "Bank Transfer" | "Online" | "Cheque" | "In-Kind";

export type DonationPurpose =
  | "General / Hundi"
  | "Annadanam Sponsorship"
  | "Prasadam Sponsorship"
  | "Seva Sponsorship"
  | "Project-linked"
  | "Event-linked"
  | "Corpus Fund";

export type DonationSourceModule = "Manual" | "Booking" | "Event" | "Online Portal" | "Campaign" | "Seva" | "Counter";

export interface NonCashAssetDetails {
  assetName: string;
  quantity: number;
  unit: string; // e.g. "pcs", "kg", "bags", "units"
  estimatedValue: number; // ₹ equivalent
  category?: string; // e.g. "Metal", "Grain", "Cloth", "Jewellery"
}

export interface Donation {
  donationId: string; // e.g. DON-C/2026/06/000001 (Cash) or DON-NC/2026/06/000001 (Non-Cash)
  receiptNo: string; // e.g. REC/2026/06/000001
  templeId: string; // organization owning the donation
  branchId?: string; // optional branch/location ID
  donorId: string; // links to Donor
  donorName: string; // snapshot for receipts/audit
  nature: DonationNature; // Cash or Non-Cash
  amount: number; // For cash: actual amount; For non-cash: estimated value
  purpose: DonationPurpose | string;
  channel: DonationChannel;
  mode: string; // e.g. NEFT, Cash, GPay
  referenceNo?: string;
  remarks?: string;
  nonCashDetails?: NonCashAssetDetails; // Only for Non-Cash donations
  sourceModule: DonationSourceModule; // origin of the donation
  sourceRecordId?: string; // e.g. BKG-001, EVT-005
  counterId?: string; // counter where recorded (if applicable)
  date: string; // ISO date (yyyy-mm-dd)
  time: string; // display time
  status: "Recorded";
  receiptFilePath?: string; // Path to generated PDF receipt
  is80G?: boolean; // Whether this donation is eligible for 80G
  receipt80GId?: string; // Per-donation 80G certificate ID (80GR-YYYY-XXXX)
  settlementId?: string; // Linked settlement ID (SET/YYYY/MM/000001) if grouped
  createdAt: string; // ISO datetime
}

/** Per-donation 80G receipt — generated when an eligible donation is recorded */
export interface Donation80GReceipt {
  receipt80GId: string; // e.g. 80GR-2026-0001
  donationId: string;
  receiptNo: string;
  donorId: string;
  donorName: string;
  pan: string;
  amount: number;
  date: string;
  mode: string;
  donationType: string;
  fy: string; // e.g. 2025-26
  status: "Generated" | "Pending" | "PAN Missing";
  generatedDate: string;
  createdAt: string;
}

export type AllocationLinkedType = "Project" | "Kitchen" | "Prasadam" | "Seva" | "Event" | "General";

export interface Allocation {
  donationId: string;
  purpose: string;
  linkedTo: string;
  linkedType: AllocationLinkedType;
  allocated: number;
  utilized: number;
}

export interface Certificate80G {
  certificateId: string; // e.g. 80G-2025-0045
  donorId: string;
  donorName: string;
  pan: string;
  fy: string; // e.g. 2024-25
  receiptNos: string[];
  totalAmount: number;
  status: "Generated" | "Pending" | "PAN Missing";
  generatedDate: string; // ISO date or "-"
  createdAt: string; // ISO datetime
}

export interface DonationAuditEntry {
  id: string; // AUD-xxx
  timestamp: string; // display timestamp
  action: string;
  entity: string;
  user: string;
  details: string;
}

export interface Fund {
  id: string;
  name: string;
  description?: string;
  openingBalance?: number; // Opening balance when fund is created
  createdAt: string; // ISO datetime
  isActive: boolean;
}

export interface FundExpense {
  id: string;
  fundId: string;
  fundName: string;
  description: string;
  amount: number;
  date: string; // ISO date (yyyy-mm-dd)
  category?: string;
  vendor?: string;
  referenceNo?: string;
  createdAt: string; // ISO datetime
}

/** Settlement — groups multiple recorded donations into a single bank deposit/settlement */
export interface Settlement {
  settlementId: string; // e.g. SET/2026/06/000001
  date: string; // ISO date of settlement
  bankReference: string; // bank UTR / reference number
  bankAccountName: string; // destination bank account
  donationIds: string[]; // list of donation IDs included
  totalAmount: number; // sum of included donation amounts
  status: "Open" | "Settled";
  notes?: string;
  createdAt: string;
  createdBy: string;
}

export interface DonationsState {
  donors: Donor[];
  donations: Donation[];
  allocations: Allocation[];
  certificates80G: Certificate80G[];
  receipts80G: Donation80GReceipt[];
  audit: DonationAuditEntry[];
  funds: Fund[]; // Managed funds list
  fundExpenses: FundExpense[]; // Expenses linked to funds
  settlements: Settlement[]; // Grouped settlement records
}
