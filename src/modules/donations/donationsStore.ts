import { DonationsState, Donor, Donation, Allocation, Certificate80G, Donation80GReceipt, DonationAuditEntry, DonationChannel, DonationSourceModule, DonationNature, NonCashAssetDetails, Fund, FundExpense, DonorCategory, DonorVipInfo, Settlement } from "./types";
import { getTempleConfig } from "@/lib/templeConfig";

const LS_KEY = "qoo.donations.v3";

function nowIso() {
  return new Date().toISOString();
}

function isoDate(d = new Date()) {
  return d.toISOString().slice(0, 10);
}

function displayTime(d = new Date()) {
  return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

function displayTimestamp(d = new Date()) {
  return `${isoDate(d)} ${d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}`;
}

function safeJsonParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function getMaxNumericSuffix(values: string[], prefix: string) {
  let max = 0;
  for (const v of values) {
    if (!v.startsWith(prefix)) continue;
    const n = Number(v.slice(prefix.length));
    if (Number.isFinite(n)) max = Math.max(max, n);
  }
  return max;
}

function nextDonorId(state: DonationsState) {
  // DNR-001 style
  const nums = state.donors
    .map(d => d.donorId)
    .filter(id => id.startsWith("DNR-"))
    .map(id => Number(id.replace("DNR-", "")))
    .filter(n => Number.isFinite(n));
  const next = (nums.length ? Math.max(...nums) : 0) + 1;
  return `DNR-${String(next).padStart(3, "0")}`;
}

/**
 * Monthly sequenced ID generator.
 * Donation IDs:  DON-C/YYYY/MM/000001  (Cash)  or  DON-NC/YYYY/MM/000001  (Non-Cash)
 * Receipt IDs:   REC/YYYY/MM/000001
 * Settlement IDs: SET/YYYY/MM/000001
 */
function nextDonationIds(state: DonationsState, nature: DonationNature, date: string) {
  const [year, month] = date.split("-");
  const ym = `${year}/${month}`;
  const typePrefix = nature === "Cash" ? `DON-C/${ym}/` : `DON-NC/${ym}/`;
  const recPrefix = `REC/${ym}/`;

  const maxDon = state.donations
    .map(d => d.donationId)
    .filter(id => id.startsWith(typePrefix))
    .reduce((m, id) => {
      const n = Number(id.slice(typePrefix.length));
      return Number.isFinite(n) ? Math.max(m, n) : m;
    }, 0);
  const maxRec = state.donations
    .map(d => d.receiptNo)
    .filter(r => r.startsWith(recPrefix))
    .reduce((m, r) => {
      const n = Number(r.slice(recPrefix.length));
      return Number.isFinite(n) ? Math.max(m, n) : m;
    }, 0);

  const nextSeq = Math.max(maxDon, maxRec) + 1;
  const suffix = String(nextSeq).padStart(6, "0");
  return {
    donationId: `${typePrefix}${suffix}`,
    receiptNo: `${recPrefix}${suffix}`,
  };
}

function nextSettlementId(state: DonationsState, date: string) {
  const [year, month] = date.split("-");
  const prefix = `SET/${year}/${month}/`;
  const max = (state.settlements ?? []).map(s => s.settlementId)
    .filter(id => id.startsWith(prefix))
    .reduce((m, id) => {
      const n = Number(id.slice(prefix.length));
      return Number.isFinite(n) ? Math.max(m, n) : m;
    }, 0);
  return `${prefix}${String(max + 1).padStart(6, "0")}`;
}

function nextAuditId(state: DonationsState) {
  const prefix = "AUD-";
  const existing = state.audit.map(a => a.id);
  const max = getMaxNumericSuffix(existing, prefix);
  return `AUD-${String(max + 1).padStart(3, "0")}`;
}

function next80GId(state: DonationsState, year: number) {
  const prefix = `80G-${year}-`;
  const existing = state.certificates80G.map(c => c.certificateId).filter(id => id.startsWith(prefix));
  const max = getMaxNumericSuffix(existing, prefix);
  return `80G-${year}-${String(max + 1).padStart(4, "0")}`;
}

export function getFinancialYear(dateIso: string): string {
  const [y, m] = dateIso.split("-").map(Number);
  if (!y || !m) return `${new Date().getFullYear()}-${String(new Date().getFullYear() + 1).slice(2)}`;
  const startYear = m >= 4 ? y : y - 1;
  return `${startYear}-${String(startYear + 1).slice(2)}`;
}

function next80GReceiptId(state: DonationsState, year: number) {
  const prefix = `80GR-${year}-`;
  const existing = (state.receipts80G ?? []).map(r => r.receipt80GId).filter(id => id.startsWith(prefix));
  const max = getMaxNumericSuffix(existing, prefix);
  return `80GR-${year}-${String(max + 1).padStart(4, "0")}`;
}

function donationTypeFromPurpose(purpose: string): string {
  return (purpose || "").toLowerCase().includes("corpus") ? "Corpus" : "General";
}

function build80GReceiptRecord(
  state: DonationsState,
  donation: Donation,
  donor: Donor,
  createdBy: string
): Donation80GReceipt {
  const fy = getFinancialYear(donation.date);
  const fyYear = Number(fy.slice(0, 4)) || new Date().getFullYear();
  const hasPan = donor.pan && donor.pan !== "-" && donor.pan.length >= 10;
  const status: Donation80GReceipt["status"] = !hasPan
    ? "PAN Missing"
    : donation.is80G
      ? "Generated"
      : "Pending";

  return {
    receipt80GId: next80GReceiptId(state, fyYear),
    donationId: donation.donationId,
    receiptNo: donation.receiptNo,
    donorId: donor.donorId,
    donorName: donor.name,
    pan: donor.pan,
    amount: donation.amount,
    date: donation.date,
    mode: donation.mode || donation.channel,
    donationType: donationTypeFromPurpose(donation.purpose),
    fy,
    status,
    generatedDate: status === "Generated" ? isoDate() : "-",
    createdAt: nowIso(),
  };
}

function seedState(): DonationsState {
  const createdAt = nowIso();

  const donors: Donor[] = [
    { donorId: "DNR-001", name: "Sri Ramesh Agarwal", phone: "+91 98765 43210", email: "ramesh@email.com", city: "Hyderabad", pan: "ABCPA1234R", category: "Patron", eligible80G: true, createdAt },
    { donorId: "DNR-002", name: "Smt. Padma Foundation", phone: "+91 87654 32109", email: "info@padma.org", city: "Chennai", pan: "AAATA5678B", category: "Trust", eligible80G: true, createdAt },
    { donorId: "DNR-003", name: "Sri Venkatesh Trust", phone: "+91 76543 21098", email: "trust@venkatesh.org", city: "Tirupati", pan: "BBBTV9012C", category: "Trust", eligible80G: true, createdAt },
    { donorId: "DNR-004", name: "Karthik Reddy", phone: "+91 65432 10987", email: "karthik@email.com", city: "Bangalore", pan: "CCCPK3456D", category: "Regular", eligible80G: true, createdAt },
    { donorId: "DNR-005", name: "Village Dev Committee", phone: "+91 54321 09876", email: "-", city: "Anantapur", pan: "DDDPV7890E", category: "Organization", eligible80G: false, createdAt },
    { donorId: "DNR-006", name: "Anonymous Devotee", phone: "-", email: "-", city: "-", pan: "-", category: "Anonymous", eligible80G: false, createdAt },
    { donorId: "DNR-007", name: "Lakshmi Narasimha Bhakta Mandali", phone: "+91 43210 98765", email: "lnbm@email.com", city: "Vijayawada", pan: "EEEPN1234F", category: "Patron", eligible80G: true, createdAt },
    { donorId: "DNR-008", name: "Dr. Suresh Iyer", phone: "+91 99887 76655", email: "suresh.iyer@email.com", city: "Plot 12, Jubilee Hills, Hyderabad - 500033", pan: "AKLPI8821M", category: "Regular", eligible80G: true, createdAt },
    { donorId: "DNR-009", name: "Anitha Rao", phone: "+91 90000 11122", email: "anitha.rao@email.com", city: "Flat 304, Banjara Hills, Hyderabad - 500034", pan: "BNZPA4421K", category: "Regular", eligible80G: true, createdAt },
    { donorId: "DNR-010", name: "Sundaram Charitable Trust", phone: "+91 90000 22233", email: "trust@sundaram.org", city: "12 Cathedral Rd, Chennai - 600086", pan: "AAGTS1122F", category: "Trust", eligible80G: true, createdAt },
    { donorId: "DNR-011", name: "Vikram Mehta", phone: "+91 90000 33344", email: "vikram@email.com", city: "B-22 Vasant Vihar, New Delhi - 110057", pan: "CKMPM7788Q", category: "Patron", eligible80G: true, createdAt },
    { donorId: "DNR-012", name: "Priya Krishnan", phone: "+91 90000 44455", email: "priya.k@email.com", city: "5 Adyar Main Rd, Chennai - 600020", pan: "DLNPK9911R", category: "Regular", eligible80G: true, createdAt },
    // Example donor — 80G enabled with PAN (demo)
    { donorId: "DNR-013", name: "Meera Nair", phone: "+91 98765 12340", email: "meera.nair@email.com", city: "HSR Layout, Bengaluru 560102", pan: "ABCPM5678K", category: "Regular", eligible80G: true, createdAt },
  ];

  // ===== 80G Compliance sample donors (FY 2024-25 spec) =====
  donors.push(
    { donorId: "DNR-101", name: "Ramesh Kumar Sharma", phone: "+91 98800 11111", email: "ramesh.sharma@email.com", city: "14/2 MG Road, Bengaluru 560001", pan: "ABCPS1234R", category: "Regular", eligible80G: true, createdAt },
    { donorId: "DNR-102", name: "Sunita Prabhu", phone: "+91 98800 22222", email: "sunita.prabhu@email.com", city: "7 Sea View Road, Karwar 581301", pan: "BCDQP5678S", category: "Regular", eligible80G: true, createdAt },
    { donorId: "DNR-103", name: "Devidas Hegde", phone: "+91 98800 33333", email: "devidas.hegde@email.com", city: "18 Hill Top Colony, Sirsi 581401", pan: "CDEQH9012T", category: "Patron", eligible80G: true, createdAt },
    { donorId: "DNR-104", name: "Asha Naik", phone: "+91 98800 44444", email: "asha.naik@email.com", city: "5 Temple Street, Ankola 581314", pan: "DEFAN3456U", category: "Regular", eligible80G: true, createdAt },
    { donorId: "DNR-105", name: "Prakash Shetty", phone: "+91 98800 55555", email: "prakash.shetty@email.com", city: "22 NH 66 Main Road, Kumta 581343", pan: "EFGPS7890V", category: "Regular", eligible80G: true, createdAt },
  );

  const donations: Donation[] = [
    // Example — 80G donation with both receipts auto-generated
    {
      donationId: "DON-C/2026/06/000001",
      receiptNo: "REC/2026/06/000001",
      templeId: "TMPL-001",
      branchId: "BR-MAIN",
      donorId: "DNR-013",
      donorName: "Meera Nair",
      nature: "Cash",
      amount: 25000,
      purpose: "General / Hundi",
      channel: "UPI",
      mode: "UPI",
      referenceNo: "UPI-MEERA-25000",
      sourceModule: "Manual",
      date: "2026-06-04",
      time: "10:30 AM",
      status: "Recorded",
      is80G: true,
      remarks: "80G enabled — donation receipt + 80G certificate issued",
      createdAt,
    },
    { donationId: "DON-2025-0891", receiptNo: "REC-2025-0891", templeId: "TMPL-001", branchId: "BR-MAIN", donorId: "DNR-001", donorName: "Sri Ramesh Agarwal", nature: "Cash", amount: 500000, purpose: "Project-linked", channel: "Bank Transfer", mode: "NEFT", sourceModule: "Manual", date: "2025-02-10", time: "10:30 AM", status: "Recorded", createdAt },
    { donationId: "DON-2025-0890", receiptNo: "REC-2025-0890", templeId: "TMPL-001", branchId: "BR-MAIN", donorId: "DNR-006", donorName: "Anonymous Devotee", nature: "Cash", amount: 25000, purpose: "General / Hundi", channel: "Cash", mode: "Cash", sourceModule: "Counter", counterId: "CTR-001", date: "2025-02-10", time: "09:15 AM", status: "Recorded", createdAt },
    { donationId: "DON-2025-0889", receiptNo: "REC-2025-0889", templeId: "TMPL-001", branchId: "BR-MAIN", donorId: "DNR-004", donorName: "Karthik Reddy", nature: "Cash", amount: 100000, purpose: "Annadanam Sponsorship", channel: "UPI", mode: "GPay", sourceModule: "Online Portal", date: "2025-02-09", time: "04:45 PM", status: "Recorded", createdAt },
    { donationId: "DON-2025-0888", receiptNo: "REC-2025-0888", templeId: "TMPL-001", branchId: "BR-TIRUCHANUR", donorId: "DNR-003", donorName: "Sri Venkatesh Trust", nature: "Cash", amount: 1000000, purpose: "Project-linked", channel: "Bank Transfer", mode: "RTGS", sourceModule: "Manual", date: "2025-02-09", time: "11:00 AM", status: "Recorded", createdAt },
    { donationId: "DON-2025-0887", receiptNo: "REC-2025-0887", templeId: "TMPL-001", donorId: "DNR-004", donorName: "Karthik Reddy", nature: "Cash", amount: 15000, purpose: "Prasadam Sponsorship", channel: "Online", mode: "Razorpay", sourceModule: "Online Portal", date: "2025-02-08", time: "06:20 PM", status: "Recorded", createdAt },
    { donationId: "DON-2025-0886", receiptNo: "REC-2025-0886", templeId: "TMPL-001", branchId: "BR-MAIN", donorId: "DNR-002", donorName: "Smt. Padma Foundation", nature: "Cash", amount: 2500000, purpose: "Event-linked", channel: "Bank Transfer", mode: "NEFT", sourceModule: "Event", sourceRecordId: "EVT-2025-003", date: "2025-02-07", time: "02:00 PM", status: "Recorded", createdAt },
    { donationId: "DON-2025-0885", receiptNo: "REC-2025-0885", templeId: "TMPL-001", branchId: "BR-MAIN", donorId: "DNR-007", donorName: "Lakshmi Narasimha Bhakta Mandali", nature: "Cash", amount: 50000, purpose: "Seva Sponsorship", channel: "Cash", mode: "Cash", sourceModule: "Booking", sourceRecordId: "BKG-2025-0142", counterId: "CTR-002", date: "2025-02-06", time: "08:30 AM", status: "Recorded", createdAt },
    { donationId: "DON-2025-0884", receiptNo: "REC-2025-0884", templeId: "TMPL-001", branchId: "BR-TIRUCHANUR", donorId: "DNR-005", donorName: "Village Dev Committee", nature: "Non-Cash", amount: 75000, purpose: "Corpus Fund", channel: "In-Kind", mode: "In-Kind", sourceModule: "Campaign", sourceRecordId: "CMP-2025-001", date: "2025-02-05", time: "11:45 AM", status: "Recorded", nonCashDetails: { assetName: "Rice Bags", quantity: 50, unit: "bags", estimatedValue: 75000 }, createdAt },
    { donationId: "DON-2025-0892", receiptNo: "REC-2025-0892", templeId: "TMPL-001", branchId: "BR-MAIN", donorId: "DNR-008", donorName: "Dr. Suresh Iyer", nature: "Cash", amount: 51000, purpose: "Corpus Fund", channel: "Bank Transfer", mode: "NEFT", referenceNo: "NEFT-SBI-786543210", sourceModule: "Manual", date: "2025-02-11", time: "11:20 AM", status: "Recorded", is80G: true, remarks: "80G eligible donation — Corpus contribution towards temple development", createdAt },
    { donationId: "DON-2024-0501", receiptNo: "REC-2024-0501", templeId: "TMPL-001", branchId: "BR-MAIN", donorId: "DNR-009", donorName: "Anitha Rao", nature: "Cash", amount: 25000, purpose: "General / Hundi", channel: "UPI", mode: "UPI", referenceNo: "UPI-512987654321", sourceModule: "Online Portal", date: "2024-06-12", time: "10:00 AM", status: "Recorded", is80G: true, remarks: "80G eligible — general donation", createdAt },
    { donationId: "DON-2024-0502", receiptNo: "REC-2024-0502", templeId: "TMPL-001", branchId: "BR-MAIN", donorId: "DNR-010", donorName: "Sundaram Charitable Trust", nature: "Cash", amount: 500000, purpose: "Corpus Fund", channel: "Bank Transfer", mode: "RTGS", referenceNo: "RTGS-HDFC-998877665", sourceModule: "Manual", date: "2024-08-21", time: "03:00 PM", status: "Recorded", remarks: "Corpus contribution from trust", createdAt },
    { donationId: "DON-2024-0503", receiptNo: "REC-2024-0503", templeId: "TMPL-001", branchId: "BR-MAIN", donorId: "DNR-011", donorName: "Vikram Mehta", nature: "Cash", amount: 150000, purpose: "Project-linked", channel: "Bank Transfer", mode: "NEFT", referenceNo: "NEFT-ICICI-445566778", sourceModule: "Manual", date: "2024-11-05", time: "12:30 PM", status: "Recorded", remarks: "Gopuram renovation contribution", createdAt },
    { donationId: "DON-2024-0504", receiptNo: "REC-2024-0504", templeId: "TMPL-001", branchId: "BR-MAIN", donorId: "DNR-012", donorName: "Priya Krishnan", nature: "Cash", amount: 11000, purpose: "Annadanam Sponsorship", channel: "UPI", mode: "UPI", referenceNo: "UPI-339911228877", sourceModule: "Online Portal", date: "2024-12-18", time: "07:45 PM", status: "Recorded", remarks: "Annadanam sponsorship", createdAt },
    { donationId: "DON-2024-0505", receiptNo: "REC-2024-0505", templeId: "TMPL-001", branchId: "BR-MAIN", donorId: "DNR-009", donorName: "Anitha Rao", nature: "Cash", amount: 31000, purpose: "Seva Sponsorship", channel: "UPI", mode: "UPI", referenceNo: "UPI-778899001122", sourceModule: "Manual", date: "2025-01-14", time: "09:30 AM", status: "Recorded", remarks: "Abhishekam seva", createdAt },
    { donationId: "DON-2024-0506", receiptNo: "REC-2024-0506", templeId: "TMPL-001", branchId: "BR-MAIN", donorId: "DNR-011", donorName: "Vikram Mehta", nature: "Cash", amount: 75000, purpose: "Corpus Fund", channel: "Bank Transfer", mode: "NEFT", referenceNo: "NEFT-ICICI-887766554", sourceModule: "Manual", date: "2025-03-02", time: "10:15 AM", status: "Recorded", remarks: "Additional corpus contribution", createdAt },
  ];

  // ===== 80G Compliance sample donations (FY 2024-25 spec, RCT-2025-XXXX) =====
  donations.push(
    { donationId: "DON-2025-1001", receiptNo: "RCT-2025-0001", templeId: "TMPL-001", donorId: "DNR-101", donorName: "Ramesh Kumar Sharma", nature: "Cash", amount: 5000, purpose: "General / Hundi", channel: "Bank Transfer", mode: "NEFT", sourceModule: "Manual", date: "2024-04-02", time: "10:00 AM", status: "Recorded", is80G: true, createdAt },
    { donationId: "DON-2025-1002", receiptNo: "RCT-2025-0002", templeId: "TMPL-001", donorId: "DNR-102", donorName: "Sunita Prabhu", nature: "Cash", amount: 2500, purpose: "General / Hundi", channel: "UPI", mode: "UPI", sourceModule: "Manual", date: "2024-05-15", time: "11:15 AM", status: "Recorded", is80G: true, createdAt },
    { donationId: "DON-2025-1003", receiptNo: "RCT-2025-0003", templeId: "TMPL-001", donorId: "DNR-103", donorName: "Devidas Hegde", nature: "Cash", amount: 110000, purpose: "Corpus Fund", channel: "Bank Transfer", mode: "NEFT", sourceModule: "Manual", date: "2024-06-20", time: "12:00 PM", status: "Recorded", is80G: true, createdAt },
    { donationId: "DON-2025-1004", receiptNo: "RCT-2025-0004", templeId: "TMPL-001", donorId: "DNR-104", donorName: "Asha Naik", nature: "Cash", amount: 1500, purpose: "General / Hundi", channel: "Cash", mode: "Cash", sourceModule: "Counter", counterId: "CTR-001", date: "2024-08-10", time: "09:30 AM", status: "Recorded", is80G: true, createdAt },
    { donationId: "DON-2025-1005", receiptNo: "RCT-2025-0005", templeId: "TMPL-001", donorId: "DNR-105", donorName: "Prakash Shetty", nature: "Cash", amount: 33000, purpose: "General / Hundi", channel: "UPI", mode: "UPI", sourceModule: "Manual", date: "2024-11-25", time: "02:45 PM", status: "Recorded", is80G: true, createdAt },
  );

  const allocations: Allocation[] = [
    { donationId: "DON-2025-0891", purpose: "Project-linked", linkedTo: "Gopuram Renovation", linkedType: "Project", allocated: 500000, utilized: 410000 },
    { donationId: "DON-2025-0889", purpose: "Annadanam", linkedTo: "Daily Annadanam", linkedType: "Kitchen", allocated: 100000, utilized: 100000 },
    { donationId: "DON-2025-0888", purpose: "Project-linked", linkedTo: "New Hall Construction", linkedType: "Project", allocated: 1000000, utilized: 280000 },
    { donationId: "DON-2025-0887", purpose: "Prasadam Sponsorship", linkedTo: "Laddu Prasadam - Vaikunta Ekadashi", linkedType: "Prasadam", allocated: 15000, utilized: 15000 },
  ];

  const certificates80G: Certificate80G[] = [
    { certificateId: "80G-2025-0045", donorId: "DNR-001", donorName: "Sri Ramesh Agarwal", pan: "ABCPA1234R", fy: "2024-25", receiptNos: Array.from({ length: 8 }, (_, i) => `REC-2025-${String(800 + i).padStart(4, "0")}`), totalAmount: 2500000, status: "Generated", generatedDate: "2025-02-01", createdAt },
    { certificateId: "80G-2025-0044", donorId: "DNR-002", donorName: "Smt. Padma Foundation", pan: "AAATA5678B", fy: "2024-25", receiptNos: Array.from({ length: 3 }, (_, i) => `REC-2025-${String(700 + i).padStart(4, "0")}`), totalAmount: 10000000, status: "Generated", generatedDate: "2025-01-28", createdAt },
    { certificateId: "80G-2025-0043", donorId: "DNR-003", donorName: "Sri Venkatesh Trust", pan: "BBBTV9012C", fy: "2024-25", receiptNos: Array.from({ length: 12 }, (_, i) => `REC-2025-${String(600 + i).padStart(4, "0")}`), totalAmount: 5000000, status: "Pending", generatedDate: "-", createdAt },
    { certificateId: "80G-2025-0042", donorId: "DNR-004", donorName: "Karthik Reddy", pan: "CCCPK3456D", fy: "2024-25", receiptNos: Array.from({ length: 5 }, (_, i) => `REC-2025-${String(500 + i).padStart(4, "0")}`), totalAmount: 350000, status: "Generated", generatedDate: "2025-01-15", createdAt },
  ];

  const audit: DonationAuditEntry[] = [
    { id: "AUD-001", action: "Donation Recorded", entity: "DON-2025-0891", user: "System", timestamp: "2025-02-10 10:30", details: "₹5L from Sri Ramesh Agarwal via Bank Transfer" },
    { id: "AUD-002", action: "Fund Allocated", entity: "DON-2025-0891", user: "System", timestamp: "2025-02-10 10:35", details: "Allocated to Gopuram Renovation project" },
    { id: "AUD-003", action: "Receipt Generated", entity: "REC-2025-0891", user: "System", timestamp: "2025-02-10 10:30", details: "Auto-generated receipt for DON-2025-0891" },
  ];

  // Seed funds from existing donation purposes
  const funds: Fund[] = [
    { id: "fund-general-hundi", name: "General / Hundi", description: "General donations and hundi collections", openingBalance: 0, createdAt, isActive: true },
    { id: "fund-annadanam", name: "Annadanam Sponsorship", description: "Food sponsorship and feeding programs", openingBalance: 0, createdAt, isActive: true },
    { id: "fund-prasadam", name: "Prasadam Sponsorship", description: "Prasadam distribution sponsorship", openingBalance: 0, createdAt, isActive: true },
    { id: "fund-seva", name: "Seva Sponsorship", description: "Seva and ritual sponsorship", openingBalance: 0, createdAt, isActive: true },
    { id: "fund-project", name: "Project-linked", description: "Donations for specific projects", openingBalance: 0, createdAt, isActive: true },
    { id: "fund-event", name: "Event-linked", description: "Donations for events and festivals", openingBalance: 0, createdAt, isActive: true },
    { id: "fund-corpus", name: "Corpus Fund", description: "Corpus and endowment funds", openingBalance: 0, createdAt, isActive: true },
  ];

  const fundExpenses: FundExpense[] = [];
  const settlements: Settlement[] = [];

  const receipts80G: Donation80GReceipt[] = donations
    .filter((d) => d.is80G)
    .map((d, i) => {
      const donor = donors.find((x) => x.donorId === d.donorId);
      if (!donor) return null;
      const fy = getFinancialYear(d.date);
      const fyYear = Number(fy.slice(0, 4));
      return {
        receipt80GId: `80GR-${fyYear}-${String(i + 1).padStart(4, "0")}`,
        donationId: d.donationId,
        receiptNo: d.receiptNo,
        donorId: d.donorId,
        donorName: d.donorName,
        pan: donor.pan,
        amount: d.amount,
        date: d.date,
        mode: d.mode || d.channel,
        donationType: donationTypeFromPurpose(d.purpose),
        fy,
        status: donor.pan && donor.pan !== "-" ? "Generated" as const : "PAN Missing" as const,
        generatedDate: donor.pan && donor.pan !== "-" ? d.date : "-",
        createdAt: d.createdAt,
      };
    })
    .filter(Boolean) as Donation80GReceipt[];

  donations.forEach((d) => {
    const rec = receipts80G.find((r) => r.donationId === d.donationId);
    if (rec) d.receipt80GId = rec.receipt80GId;
  });

  return { donors, donations, allocations, certificates80G, receipts80G, audit, funds, fundExpenses, settlements };
}

let stateCache: DonationsState | null = null;
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

function persist() {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(stateCache));
  } catch {
    // ignore
  }
}

function isValidDonationsState(state: any): state is DonationsState {
  if (!state || typeof state !== 'object') return false;
  // Check if all required properties exist and are arrays
  return (
    Array.isArray(state.donors) &&
    Array.isArray(state.donations) &&
    Array.isArray(state.allocations) &&
    Array.isArray(state.certificates80G) &&
    Array.isArray(state.audit) &&
    Array.isArray(state.funds) &&
    Array.isArray(state.fundExpenses)
  );
  // Note: settlements is optional for backwards compatibility — migrated below
}

export function getDonationsState(): DonationsState {
  if (stateCache) return stateCache;
  try {
    const fromLS = safeJsonParse<DonationsState>(typeof window !== "undefined" ? localStorage.getItem(LS_KEY) : null);
    // Validate the structure before using it
    if (fromLS && isValidDonationsState(fromLS)) {
      // Migrate: add settlements if not present (backwards compat)
      if (!Array.isArray(fromLS.settlements)) {
        (fromLS as any).settlements = [];
      }
      if (!Array.isArray(fromLS.receipts80G)) {
        (fromLS as any).receipts80G = [];
      }
      stateCache = fromLS;
      return stateCache;
    } else {
      // If corrupted, reset to seed state
      console.warn('Donations state in localStorage is corrupted, resetting to default');
      stateCache = seedState();
      return stateCache;
    }
  } catch (error) {
    console.error('Error loading donations state from localStorage:', error);
    stateCache = seedState();
    return stateCache;
  }
}

export function subscribeDonationsStore(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function setState(next: DonationsState) {
  stateCache = next;
  persist();
  emit();
}

// Safe wrapper to get state with fallback - prevents crashes
function getSafeDonationsState(): DonationsState {
  try {
    return getDonationsState();
  } catch (error) {
    console.error('Critical error getting donations state, using seed state:', error);
    // Reset cache and return seed state
    stateCache = null;
    try {
      return seedState();
    } catch (seedError) {
      console.error('Critical error creating seed state:', seedError);
      // Return minimal valid state as last resort
      const createdAt = nowIso();
      return {
        donors: [],
        donations: [],
        allocations: [],
        certificates80G: [],
        receipts80G: [],
        audit: [],
        funds: [],
        fundExpenses: [],
        settlements: [],
      };
    }
  }
}

export const donationSelectors = {
  getDonors(): Donor[] {
    try {
      const state = getSafeDonationsState();
      return Array.isArray(state?.donors) ? state.donors : [];
    } catch (error) {
      console.error('Error in getDonors selector:', error);
      return [];
    }
  },
  getDonations(): Donation[] {
    try {
      const state = getSafeDonationsState();
      return Array.isArray(state?.donations) ? state.donations : [];
    } catch {
      return [];
    }
  },
  getAllocations(): Allocation[] {
    try {
      const state = getSafeDonationsState();
      return Array.isArray(state?.allocations) ? state.allocations : [];
    } catch {
      return [];
    }
  },
  getCertificates(): Certificate80G[] {
    try {
      const state = getSafeDonationsState();
      return Array.isArray(state?.certificates80G) ? state.certificates80G : [];
    } catch {
      return [];
    }
  },
  getReceipts80G(): Donation80GReceipt[] {
    try {
      const state = getSafeDonationsState();
      return Array.isArray(state?.receipts80G) ? state.receipts80G : [];
    } catch {
      return [];
    }
  },
  getAudit(): DonationAuditEntry[] {
    try {
      const state = getSafeDonationsState();
      return Array.isArray(state?.audit) ? state.audit : [];
    } catch {
      return [];
    }
  },
  getFunds(): Fund[] {
    try {
      const state = getSafeDonationsState();
      return Array.isArray(state?.funds) ? state.funds : [];
    } catch {
      return [];
    }
  },
  getDonorById(donorId: string) {
    return getDonationsState().donors.find(d => d.donorId === donorId) ?? null;
  },
  getDonationsForDonor(donorId: string) {
    return getDonationsState().donations.filter(d => d.donorId === donorId);
  },
  getDonationById(donationId: string) {
    return getDonationsState().donations.find(d => d.donationId === donationId) ?? null;
  },
  getAllocationForDonation(donationId: string) {
    return getDonationsState().allocations.find(a => a.donationId === donationId) ?? null;
  },
  getPendingAllocationAmount() {
    const st = getDonationsState();
    const allocatedSet = new Set(st.allocations.map(a => a.donationId));
    return st.donations.filter(d => !allocatedSet.has(d.donationId)).reduce((sum, d) => sum + d.amount, 0);
  },
  getFundExpenses(): FundExpense[] {
    try {
      const state = getSafeDonationsState();
      return Array.isArray(state?.fundExpenses) ? state.fundExpenses : [];
    } catch {
      return [];
    }
  },
  getExpensesForFund(fundId: string): FundExpense[] {
    return getDonationsState().fundExpenses.filter(e => e.fundId === fundId);
  },
};

function normalizePhone(phone: string) {
  return phone.replace(/\s+/g, "").trim();
}

function findOrCreateDonor(params: { name: string; phone?: string; email?: string; city?: string; pan?: string; category?: DonorCategory }): { nextState: DonationsState; donor: Donor } {
  const st = getDonationsState();
  const name = params.name.trim() || "Anonymous Devotee";
  const phone = params.phone?.trim() || "-";
  const pan = params.pan?.trim() || "-";

  const isAnonymous = name.toLowerCase() === "anonymous" || name.toLowerCase().includes("anonymous");
  let category: DonorCategory = params.category || (isAnonymous ? "Anonymous" : "Regular");

  if (isAnonymous && !params.category) {
    const anon = st.donors.find(d => d.category === "Anonymous") ?? st.donors.find(d => d.name.toLowerCase().includes("anonymous"));
    if (anon) return { nextState: st, donor: anon };
  }

  const byPhone = phone !== "-" ? st.donors.find(d => d.phone !== "-" && normalizePhone(d.phone) === normalizePhone(phone)) : undefined;
  const byPan = pan !== "-" ? st.donors.find(d => d.pan !== "-" && d.pan.toUpperCase() === pan.toUpperCase()) : undefined;
  const byName = st.donors.find(d => d.name.toLowerCase() === name.toLowerCase());
  const existing = byPan ?? byPhone ?? byName;
  if (existing) {
    const updated: Donor = {
      ...existing,
      name,
      phone: phone === "-" ? existing.phone : phone,
      email: params.email?.trim() || existing.email,
      city: params.city?.trim() || existing.city,
      pan: pan === "-" ? existing.pan : pan,
      category: params.category || existing.category,
      eligible80G: (pan !== "-" && pan.length >= 10) ? true : existing.eligible80G,
    };
    const nextState: DonationsState = {
      ...st,
      donors: st.donors.map(d => (d.donorId === existing.donorId ? updated : d)),
    };
    return { nextState, donor: updated };
  }

  const donorId = nextDonorId(st);
  const donor: Donor = {
    donorId,
    name,
    phone,
    email: params.email?.trim() || "-",
    city: params.city?.trim() || "-",
    pan,
    category,
    eligible80G: pan !== "-" && pan.length >= 10,
    createdAt: nowIso(),
  };
  const nextState: DonationsState = { ...st, donors: [donor, ...st.donors] };
  return { nextState, donor };
}

export function createDonor(input: Omit<Donor, "donorId" | "createdAt">) {
  const st = getDonationsState();
  const donor: Donor = { ...input, donorId: nextDonorId(st), createdAt: nowIso() };
  const nextState = { ...st, donors: [donor, ...st.donors] };
  setState(nextState);
  return donor;
}

export function recordDonation(input: {
  donorName: string;
  phone?: string;
  email?: string;
  city?: string;
  pan?: string;
  category?: DonorCategory;
  nature?: DonationNature;
  amount: number;
  purpose: string;
  channel: DonationChannel;
  mode: string;
  referenceNo?: string;
  remarks?: string;
  nonCashDetails?: NonCashAssetDetails;
  sourceModule?: DonationSourceModule;
  sourceRecordId?: string;
  counterId?: string;
  templeId?: string;
  branchId?: string;
  date?: string;
  time?: string;
  createdBy?: string;
  wants80G?: boolean;
}) {
  const createdBy = input.createdBy ?? "System";
  const date = input.date ?? isoDate();
  const time = input.time ?? displayTime();
  const nature: DonationNature = input.nature ?? "Cash";

  const { nextState: afterDonor, donor } = findOrCreateDonor({
    name: input.donorName,
    phone: input.phone,
    email: input.email,
    city: input.city,
    pan: input.pan,
    category: input.category,
  });

  const ids = nextDonationIds(afterDonor, nature, date);
  const hasPan = input.pan !== undefined && input.pan !== "-" && input.pan.length >= 10;
  const is80G = getTempleConfig().eightyGEnabled && input.wants80G !== false && hasPan;
  const receiptFilePath = `/receipts/${ids.receiptNo}.pdf`;

  const donation: Donation = {
    donationId: ids.donationId,
    receiptNo: ids.receiptNo,
    templeId: input.templeId ?? "TMPL-001",
    branchId: input.branchId,
    donorId: donor.donorId,
    donorName: donor.name,
    nature,
    amount: input.amount,
    purpose: input.purpose,
    channel: input.channel,
    mode: input.mode,
    referenceNo: input.referenceNo,
    remarks: input.remarks,
    nonCashDetails: nature === "Non-Cash" ? input.nonCashDetails : undefined,
    sourceModule: input.sourceModule ?? "Manual",
    sourceRecordId: input.sourceRecordId,
    counterId: input.counterId,
    date,
    time,
    status: "Recorded",
    receiptFilePath,
    is80G,
    createdAt: nowIso(),
  };

  const auditDonation: DonationAuditEntry = {
    id: nextAuditId(afterDonor),
    timestamp: displayTimestamp(),
    action: "Donation Recorded",
    entity: donation.donationId,
    user: createdBy,
    details: `₹${donation.amount.toLocaleString()} from ${donation.donorName} via ${donation.channel}`,
  };
  const auditReceipt: DonationAuditEntry = {
    id: `AUD-${String(Number(auditDonation.id.replace("AUD-", "")) + 1).padStart(3, "0")}`,
    timestamp: auditDonation.timestamp,
    action: "Receipt Generated",
    entity: donation.receiptNo,
    user: "System",
    details: `Auto-generated receipt for ${donation.donationId}`,
  };

  let nextState: DonationsState = {
    ...afterDonor,
    donations: [donation, ...afterDonor.donations],
    audit: [auditReceipt, auditDonation, ...afterDonor.audit],
    receipts80G: afterDonor.receipts80G ?? [],
  };

  if (is80G) {
    const receipt80G = build80GReceiptRecord(nextState, donation, donor, createdBy);
    donation.receipt80GId = receipt80G.receipt80GId;
    const audit80G: DonationAuditEntry = {
      id: nextAuditId(nextState),
      timestamp: displayTimestamp(),
      action: "80G Receipt Generated",
      entity: receipt80G.receipt80GId,
      user: createdBy,
      details: `80G certificate for ${donation.receiptNo} — ${donor.name}`,
    };
    nextState = {
      ...nextState,
      donations: [{ ...donation, receipt80GId: receipt80G.receipt80GId }, ...afterDonor.donations],
      receipts80G: [receipt80G, ...(nextState.receipts80G ?? [])],
      audit: [audit80G, ...nextState.audit],
    };
  } else {
    setState(nextState);
    return donation;
  }

  setState(nextState);
  return { ...donation, receipt80GId: donation.receipt80GId };
}

export function allocateFund(input: {
  donationId: string;
  purpose: string;
  linkedType: Allocation["linkedType"];
  linkedTo: string;
  allocated: number;
  utilized?: number;
  createdBy?: string;
}) {
  const st = getDonationsState();
  const existing = st.allocations.find(a => a.donationId === input.donationId);
  const allocation: Allocation = {
    donationId: input.donationId,
    purpose: input.purpose,
    linkedTo: input.linkedTo,
    linkedType: input.linkedType,
    allocated: input.allocated,
    utilized: input.utilized ?? (existing?.utilized ?? 0),
  };

  const audit: DonationAuditEntry = {
    id: nextAuditId(st),
    timestamp: displayTimestamp(),
    action: "Fund Allocated",
    entity: input.donationId,
    user: input.createdBy ?? "System",
    details: `Allocated to ${input.linkedTo} (${input.linkedType})`,
  };

  const nextState: DonationsState = {
    ...st,
    allocations: existing ? st.allocations.map(a => (a.donationId === input.donationId ? allocation : a)) : [allocation, ...st.allocations],
    audit: [audit, ...st.audit],
  };
  setState(nextState);
  return allocation;
}

export function getReceipt80GForDonation(donationId: string): Donation80GReceipt | null {
  const st = getDonationsState();
  return (st.receipts80G ?? []).find((r) => r.donationId === donationId) ?? null;
}

export function generate80GReceiptForDonation(donationId: string, createdBy = "System"): Donation80GReceipt | null {
  const st = getDonationsState();
  const donation = st.donations.find((d) => d.donationId === donationId);
  if (!donation) return null;

  const existing = (st.receipts80G ?? []).find((r) => r.donationId === donationId);
  if (existing?.status === "Generated") return existing;

  const donor = st.donors.find((d) => d.donorId === donation.donorId);
  if (!donor) return null;

  const receipt80G = build80GReceiptRecord(st, { ...donation, is80G: true }, donor, createdBy);

  const audit: DonationAuditEntry = {
    id: nextAuditId(st),
    timestamp: displayTimestamp(),
    action: "80G Receipt Generated",
    entity: receipt80G.receipt80GId,
    user: createdBy,
    details: `80G certificate for ${donation.receiptNo} — ${donor.name}`,
  };

  const nextReceipts = existing
    ? (st.receipts80G ?? []).map((r) => (r.donationId === donationId ? receipt80G : r))
    : [receipt80G, ...(st.receipts80G ?? [])];

  const nextState: DonationsState = {
    ...st,
    donations: st.donations.map((d) =>
      d.donationId === donationId ? { ...d, is80G: true, receipt80GId: receipt80G.receipt80GId } : d
    ),
    receipts80G: nextReceipts,
    audit: [audit, ...st.audit],
  };
  setState(nextState);
  return receipt80G;
}

export function generate80GCertificate(input: { donorId: string; fy: string; createdBy?: string }) {
  const st = getDonationsState();
  const donor = st.donors.find(d => d.donorId === input.donorId);
  if (!donor) return null;

  const fyYear = Number(input.fy.slice(0, 4)) || new Date().getFullYear();
  const receiptNos = st.donations
    .filter(d => d.donorId === donor.donorId)
    .map(d => d.receiptNo);
  const totalAmount = st.donations.filter(d => d.donorId === donor.donorId).reduce((s, d) => s + d.amount, 0);

  const status: Certificate80G["status"] =
    donor.pan === "-" ? "PAN Missing" : donor.eligible80G ? "Generated" : "Pending";

  const cert: Certificate80G = {
    certificateId: next80GId(st, fyYear),
    donorId: donor.donorId,
    donorName: donor.name,
    pan: donor.pan,
    fy: input.fy,
    receiptNos,
    totalAmount,
    status,
    generatedDate: status === "Generated" ? isoDate() : "-",
    createdAt: nowIso(),
  };

  const audit: DonationAuditEntry = {
    id: nextAuditId(st),
    timestamp: displayTimestamp(),
    action: "80G Certificate Generated",
    entity: cert.certificateId,
    user: input.createdBy ?? "System",
    details: `${cert.fy} certificate for ${donor.name}`,
  };

  const nextState: DonationsState = {
    ...st,
    certificates80G: [cert, ...st.certificates80G],
    audit: [audit, ...st.audit],
  };
  setState(nextState);
  return cert;
}

function nextFundId(state: DonationsState) {
  const prefix = "fund-";
  const existing = state.funds.map(f => f.id).filter(id => id.startsWith(prefix));
  const max = getMaxNumericSuffix(existing, prefix);
  return `fund-${String(max + 1).padStart(3, "0")}`;
}

export function createFund(input: { name: string; description?: string; openingBalance?: number; isActive?: boolean; createdBy?: string }) {
  const st = getDonationsState();
  
  // Check if fund with same name already exists
  const existing = st.funds.find(f => f.name.toLowerCase() === input.name.toLowerCase().trim());
  if (existing) {
    throw new Error(`Fund "${input.name}" already exists`);
  }

  const fund: Fund = {
    id: nextFundId(st),
    name: input.name.trim(),
    description: input.description?.trim(),
    openingBalance: input.openingBalance ?? 0,
    createdAt: nowIso(),
    isActive: input.isActive ?? true,
  };

  const audit: DonationAuditEntry = {
    id: nextAuditId(st),
    timestamp: displayTimestamp(),
    action: "Fund Created",
    entity: fund.id,
    user: input.createdBy ?? "System",
    details: `Created fund: ${fund.name}`,
  };

  const nextState: DonationsState = {
    ...st,
    funds: [fund, ...st.funds],
    audit: [audit, ...st.audit],
  };

  setState(nextState);
  return fund;
}

export function updateFund(fundId: string, input: { name?: string; description?: string; openingBalance?: number; isActive?: boolean; updatedBy?: string }) {
  const st = getDonationsState();
  const existing = st.funds.find(f => f.id === fundId);
  if (!existing) {
    throw new Error(`Fund with ID ${fundId} not found`);
  }

  // Check if name change conflicts with another fund
  if (input.name && input.name.trim().toLowerCase() !== existing.name.toLowerCase()) {
    const nameConflict = st.funds.find(f => f.id !== fundId && f.name.toLowerCase() === input.name.toLowerCase().trim());
    if (nameConflict) {
      throw new Error(`Fund "${input.name}" already exists`);
    }
  }

  const updated: Fund = {
    ...existing,
    ...(input.name !== undefined && { name: input.name.trim() }),
    ...(input.description !== undefined && { description: input.description.trim() || undefined }),
    ...(input.openingBalance !== undefined && { openingBalance: input.openingBalance }),
    ...(input.isActive !== undefined && { isActive: input.isActive }),
  };

  const audit: DonationAuditEntry = {
    id: nextAuditId(st),
    timestamp: displayTimestamp(),
    action: "Fund Updated",
    entity: fundId,
    user: input.updatedBy ?? "System",
    details: `Updated fund: ${updated.name}`,
  };

  const nextState: DonationsState = {
    ...st,
    funds: st.funds.map(f => f.id === fundId ? updated : f),
    audit: [audit, ...st.audit],
  };

  setState(nextState);
  return updated;
}

export function deleteFund(fundId: string, deletedBy?: string) {
  const st = getDonationsState();
  const fund = st.funds.find(f => f.id === fundId);
  if (!fund) {
    throw new Error(`Fund with ID ${fundId} not found`);
  }

  // Check if fund is used in any donations
  const hasDonations = st.donations.some(d => d.purpose === fund.name);
  if (hasDonations) {
    // Deactivate instead of delete
    return updateFund(fundId, { isActive: false, updatedBy: deletedBy });
  }

  const audit: DonationAuditEntry = {
    id: nextAuditId(st),
    timestamp: displayTimestamp(),
    action: "Fund Deleted",
    entity: fundId,
    user: deletedBy ?? "System",
    details: `Deleted fund: ${fund.name}`,
  };

  const nextState: DonationsState = {
    ...st,
    funds: st.funds.filter(f => f.id !== fundId),
    audit: [audit, ...st.audit],
  };

  setState(nextState);
  return fund;
}

function nextExpenseId(state: DonationsState) {
  const prefix = "EXP-";
  const existing = state.fundExpenses.map(e => e.id).filter(id => id.startsWith(prefix));
  const max = getMaxNumericSuffix(existing, prefix);
  return `EXP-${String(max + 1).padStart(3, "0")}`;
}

export function createFundExpense(input: {
  fundId: string;
  fundName: string;
  description: string;
  amount: number;
  date?: string;
  category?: string;
  vendor?: string;
  referenceNo?: string;
  createdBy?: string;
}) {
  const st = getDonationsState();
  const fund = st.funds.find(f => f.id === input.fundId);
  if (!fund) {
    throw new Error(`Fund with ID ${input.fundId} not found`);
  }

  const expense: FundExpense = {
    id: nextExpenseId(st),
    fundId: input.fundId,
    fundName: input.fundName,
    description: input.description.trim(),
    amount: input.amount,
    date: input.date ?? isoDate(),
    category: input.category?.trim(),
    vendor: input.vendor?.trim(),
    referenceNo: input.referenceNo?.trim(),
    createdAt: nowIso(),
  };

  const audit: DonationAuditEntry = {
    id: nextAuditId(st),
    timestamp: displayTimestamp(),
    action: "Fund Expense Recorded",
    entity: expense.id,
    user: input.createdBy ?? "System",
    details: `₹${expense.amount.toLocaleString()} expense for ${fund.name}: ${expense.description}`,
  };

  const nextState: DonationsState = {
    ...st,
    fundExpenses: [expense, ...st.fundExpenses],
    audit: [audit, ...st.audit],
  };

  setState(nextState);
  return expense;
}

export function updateFundExpense(expenseId: string, input: {
  description?: string;
  amount?: number;
  date?: string;
  category?: string;
  vendor?: string;
  referenceNo?: string;
  updatedBy?: string;
}) {
  const st = getDonationsState();
  const existing = st.fundExpenses.find(e => e.id === expenseId);
  if (!existing) {
    throw new Error(`Expense with ID ${expenseId} not found`);
  }

  const updated: FundExpense = {
    ...existing,
    ...(input.description !== undefined && { description: input.description.trim() }),
    ...(input.amount !== undefined && { amount: input.amount }),
    ...(input.date !== undefined && { date: input.date }),
    ...(input.category !== undefined && { category: input.category.trim() }),
    ...(input.vendor !== undefined && { vendor: input.vendor.trim() }),
    ...(input.referenceNo !== undefined && { referenceNo: input.referenceNo.trim() }),
  };

  const audit: DonationAuditEntry = {
    id: nextAuditId(st),
    timestamp: displayTimestamp(),
    action: "Fund Expense Updated",
    entity: expenseId,
    user: input.updatedBy ?? "System",
    details: `Updated expense: ${updated.description}`,
  };

  const nextState: DonationsState = {
    ...st,
    fundExpenses: st.fundExpenses.map(e => e.id === expenseId ? updated : e),
    audit: [audit, ...st.audit],
  };

  setState(nextState);
  return updated;
}

export function deleteFundExpense(expenseId: string, deletedBy?: string) {
  const st = getDonationsState();
  const expense = st.fundExpenses.find(e => e.id === expenseId);
  if (!expense) {
    throw new Error(`Expense with ID ${expenseId} not found`);
  }

  const audit: DonationAuditEntry = {
    id: nextAuditId(st),
    timestamp: displayTimestamp(),
    action: "Fund Expense Deleted",
    entity: expenseId,
    user: deletedBy ?? "System",
    details: `Deleted expense: ${expense.description}`,
  };

  const nextState: DonationsState = {
    ...st,
    fundExpenses: st.fundExpenses.filter(e => e.id !== expenseId),
    audit: [audit, ...st.audit],
  };

  setState(nextState);
  return expense;
}

export function markDonorAsVip(input: {
  donorId: string;
  level: string;
  validFrom: string;
  validTill: string;
  approvedBy?: string;
  notes?: string;
}) {
  const st = getDonationsState();
  const donor = st.donors.find(d => d.donorId === input.donorId);
  if (!donor) {
    throw new Error(`Donor with ID ${input.donorId} not found`);
  }

  const now = new Date();
  const validFrom = new Date(input.validFrom);
  const validTill = new Date(input.validTill);
  
  let status: "Active" | "Expired" | "Inactive" = "Active";
  if (validTill < now) {
    status = "Expired";
  }

  const vipInfo: DonorVipInfo = {
    level: input.level,
    validFrom: input.validFrom,
    validTill: input.validTill,
    status,
    approvedBy: input.approvedBy,
    notes: input.notes,
  };

  const updated: Donor = {
    ...donor,
    vipInfo,
  };

  const audit: DonationAuditEntry = {
    id: nextAuditId(st),
    timestamp: displayTimestamp(),
    action: "Donor Marked as VIP",
    entity: input.donorId,
    user: input.approvedBy ?? "System",
    details: `Marked as VIP ${input.level} (valid till ${input.validTill})`,
  };

  const nextState: DonationsState = {
    ...st,
    donors: st.donors.map(d => d.donorId === input.donorId ? updated : d),
    audit: [audit, ...st.audit],
  };

  setState(nextState);
  return updated;
}

export function updateDonorVip(input: {
  donorId: string;
  level?: string;
  validFrom?: string;
  validTill?: string;
  status?: "Active" | "Expired" | "Inactive";
  approvedBy?: string;
  notes?: string;
}) {
  const st = getDonationsState();
  const donor = st.donors.find(d => d.donorId === input.donorId);
  if (!donor || !donor.vipInfo) {
    throw new Error(`Donor with ID ${input.donorId} is not marked as VIP`);
  }

  const now = new Date();
  const validTill = input.validTill ? new Date(input.validTill) : new Date(donor.vipInfo.validTill);
  
  let status = input.status || donor.vipInfo.status;
  if (!input.status && validTill < now) {
    status = "Expired";
  }

  const updatedVipInfo: DonorVipInfo = {
    ...donor.vipInfo,
    ...(input.level && { level: input.level }),
    ...(input.validFrom && { validFrom: input.validFrom }),
    ...(input.validTill && { validTill: input.validTill }),
    status,
    ...(input.approvedBy && { approvedBy: input.approvedBy }),
    ...(input.notes !== undefined && { notes: input.notes }),
  };

  const updated: Donor = {
    ...donor,
    vipInfo: updatedVipInfo,
  };

  const audit: DonationAuditEntry = {
    id: nextAuditId(st),
    timestamp: displayTimestamp(),
    action: "VIP Information Updated",
    entity: input.donorId,
    user: input.approvedBy ?? "System",
    details: `Updated VIP information for ${donor.name}`,
  };

  const nextState: DonationsState = {
    ...st,
    donors: st.donors.map(d => d.donorId === input.donorId ? updated : d),
    audit: [audit, ...st.audit],
  };

  setState(nextState);
  return updated;
}

// ─── Settlements ───────────────────────────────────────────────────────────

export function getSettlements(): Settlement[] {
  return (getDonationsState().settlements ?? []);
}

export function recordSettlement(input: {
  date?: string;
  bankReference: string;
  bankAccountName: string;
  donationIds: string[];
  notes?: string;
  createdBy?: string;
}): Settlement {
  const st = getDonationsState();
  const date = input.date ?? isoDate();
  const settlementId = nextSettlementId(st, date);

  // Calculate total from linked donations
  const linkedDonations = st.donations.filter(d => input.donationIds.includes(d.donationId));
  const totalAmount = linkedDonations.reduce((sum, d) => sum + (d.amount || 0), 0);

  const settlement: Settlement = {
    settlementId,
    date,
    bankReference: input.bankReference,
    bankAccountName: input.bankAccountName,
    donationIds: input.donationIds,
    totalAmount,
    status: "Settled",
    notes: input.notes,
    createdAt: nowIso(),
    createdBy: input.createdBy ?? "System",
  };

  // Mark each included donation with this settlementId
  const updatedDonations = st.donations.map(d =>
    input.donationIds.includes(d.donationId) ? { ...d, settlementId } : d
  );

  const audit: DonationAuditEntry = {
    id: nextAuditId(st),
    timestamp: displayTimestamp(),
    action: "Settlement Created",
    entity: settlementId,
    user: input.createdBy ?? "System",
    details: `Settled ${input.donationIds.length} donations totalling ₹${totalAmount.toLocaleString("en-IN")} — Ref: ${input.bankReference}`,
  };

  setState({
    ...st,
    donations: updatedDonations,
    settlements: [settlement, ...(st.settlements ?? [])],
    audit: [audit, ...st.audit],
  });

  return settlement;
}