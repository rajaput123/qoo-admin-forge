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
}

export interface Donation {
  donationId: string; // e.g. DON-2025-0891
  receiptNo: string; // e.g. REC-2025-0891
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
  createdAt: string; // ISO datetime
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

export interface DonationsState {
  donors: Donor[];
  donations: Donation[];
  allocations: Allocation[];
  certificates80G: Certificate80G[];
  audit: DonationAuditEntry[];
  funds: Fund[]; // Managed funds list
  fundExpenses: FundExpense[]; // Expenses linked to funds
}
