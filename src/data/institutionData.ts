// ==========================================
// INSTITUTIONS MANAGEMENT DATA LAYER
// Trust → Institution (parallel to Branch)
// ==========================================

export type InstitutionType = "School" | "College" | "Hospital" | "Goshala" | "Cultural Center" | "NGO" | "Veda Pathashala" | "Annadanam Foundation";

export interface Institution {
  id: string;
  name: string;
  type: InstitutionType;
  linkedTrust: string;
  linkedBranch: string;
  linkedBranchId: string;
  address: string;
  city: string;
  state: string;
  country: string;
  contactNumber: string;
  email: string;
  institutionHead: string;
  registrationNumber: string;
  status: "Active" | "Inactive" | "Under Setup";
  createdDate: string;
  totalStaff: number;
  volunteerCount: number;
  activeEvents: number;
  monthlyDonations: number;
  monthlyExpense: number;
}

export interface InstitutionTeamMember {
  id: string;
  institutionId: string;
  name: string;
  role: "Principal" | "Director" | "Admin Officer" | "Coordinator" | "Manager" | "Trustee Representative";
  email: string;
  mobile: string;
  department: string;
  status: "Active" | "Inactive";
  joinedDate: string;
}

export interface InstitutionEvent {
  id: string;
  institutionId: string;
  name: string;
  type: string;
  date: string;
  endDate: string;
  linkedTempleEvent: string;
  sharedVolunteers: boolean;
  sharedStock: boolean;
  budget: number;
  actualSpend: number;
  status: "Planning" | "Scheduled" | "In Progress" | "Completed";
}

export interface InstitutionResource {
  id: string;
  institutionId: string;
  name: string;
  type: "Own" | "Temple-Shared";
  category: string;
  quantity: number;
  unit: string;
  value: number;
  status: "Available" | "In Use" | "Under Maintenance";
}

export interface InstitutionFinancial {
  institutionId: string;
  month: string;
  donationsReceived: number;
  operationalExpenses: number;
  grants: number;
  sponsorship: number;
  surplus: number;
}

export interface InstitutionVolunteer {
  id: string;
  institutionId: string;
  name: string;
  role: string;
  mobile: string;
  shift: string;
  shared: boolean;
  status: "Active" | "Inactive";
}

// ---- MOCK DATA ----

export const institutions: Institution[] = [
  {
    id: "INST-001", name: "Sri Venkateswara Vidyalaya", type: "School",
    linkedTrust: "Sri Venkateswara Temple Trust", linkedBranch: "Sri Venkateswara Main Temple", linkedBranchId: "BR-001",
    address: "Education Lane, Tirumala Hills", city: "Tirupati", state: "Andhra Pradesh", country: "India",
    contactNumber: "+91 877 230 1111", email: "vidyalaya@svtemple.org", institutionHead: "Dr. Lakshmi Narasimhan",
    registrationNumber: "EDU/AP/2018/4523", status: "Active", createdDate: "2018-06-15",
    totalStaff: 85, volunteerCount: 30, activeEvents: 2, monthlyDonations: 350000, monthlyExpense: 520000,
  },
  {
    id: "INST-002", name: "Sri Padmavathi Goshala", type: "Goshala",
    linkedTrust: "Sri Venkateswara Temple Trust", linkedBranch: "Sri Padmavathi Temple", linkedBranchId: "BR-002",
    address: "Green Pastures Road, Tiruchanur", city: "Tiruchanur", state: "Andhra Pradesh", country: "India",
    contactNumber: "+91 877 230 2222", email: "goshala@svtemple.org", institutionHead: "Sri Gopala Krishna",
    registrationNumber: "GOS/AP/2020/8891", status: "Active", createdDate: "2020-01-10",
    totalStaff: 25, volunteerCount: 45, activeEvents: 1, monthlyDonations: 180000, monthlyExpense: 280000,
  },
  {
    id: "INST-003", name: "SVT Charitable Hospital", type: "Hospital",
    linkedTrust: "Sri Venkateswara Temple Trust", linkedBranch: "Sri Govindaraja Swamy Temple", linkedBranchId: "BR-004",
    address: "Medical Campus, Car Street", city: "Tirupati", state: "Andhra Pradesh", country: "India",
    contactNumber: "+91 877 230 3333", email: "hospital@svtemple.org", institutionHead: "Dr. Anand Reddy",
    registrationNumber: "HSP/AP/2015/1247", status: "Active", createdDate: "2015-03-20",
    totalStaff: 120, volunteerCount: 60, activeEvents: 3, monthlyDonations: 750000, monthlyExpense: 1200000,
  },
  {
    id: "INST-004", name: "Vedic Heritage Pathashala", type: "Veda Pathashala",
    linkedTrust: "Sri Venkateswara Temple Trust", linkedBranch: "Sri Venkateswara Main Temple", linkedBranchId: "BR-001",
    address: "Temple Complex East Wing", city: "Tirupati", state: "Andhra Pradesh", country: "India",
    contactNumber: "+91 877 230 4444", email: "vedic@svtemple.org", institutionHead: "Pandit Subrahmanyam Sharma",
    registrationNumber: "VPT/AP/2019/6734", status: "Active", createdDate: "2019-08-01",
    totalStaff: 18, volunteerCount: 12, activeEvents: 1, monthlyDonations: 95000, monthlyExpense: 140000,
  },
  {
    id: "INST-005", name: "Dharma Cultural Center", type: "Cultural Center",
    linkedTrust: "Sri Venkateswara Temple Trust", linkedBranch: "", linkedBranchId: "",
    address: "Heritage Block, Tirupati Town", city: "Tirupati", state: "Andhra Pradesh", country: "India",
    contactNumber: "+91 877 230 5555", email: "culture@svtemple.org", institutionHead: "Smt. Saraswathi Devi",
    registrationNumber: "CUL/AP/2022/3389", status: "Active", createdDate: "2022-04-15",
    totalStaff: 15, volunteerCount: 25, activeEvents: 2, monthlyDonations: 120000, monthlyExpense: 185000,
  },
  {
    id: "INST-006", name: "SVT Annadanam Foundation", type: "Annadanam Foundation",
    linkedTrust: "Sri Venkateswara Temple Trust", linkedBranch: "Sri Venkateswara Main Temple", linkedBranchId: "BR-001",
    address: "Annadanam Complex, Tirumala", city: "Tirupati", state: "Andhra Pradesh", country: "India",
    contactNumber: "+91 877 230 6666", email: "annadanam@svtemple.org", institutionHead: "Sri Dharma Rao",
    registrationNumber: "ANN/AP/2017/2156", status: "Active", createdDate: "2017-11-01",
    totalStaff: 40, volunteerCount: 80, activeEvents: 1, monthlyDonations: 450000, monthlyExpense: 680000,
  },
  {
    id: "INST-007", name: "Rural Welfare NGO", type: "NGO",
    linkedTrust: "Sri Venkateswara Temple Trust", linkedBranch: "", linkedBranchId: "",
    address: "Community Service Block", city: "Chandragiri", state: "Andhra Pradesh", country: "India",
    contactNumber: "+91 877 230 7777", email: "ngo@svtemple.org", institutionHead: "Sri Narayana Murthy",
    registrationNumber: "NGO/AP/2023/9912", status: "Under Setup", createdDate: "2023-09-10",
    totalStaff: 8, volunteerCount: 15, activeEvents: 0, monthlyDonations: 45000, monthlyExpense: 65000,
  },
];

export const institutionTeamMembers: InstitutionTeamMember[] = [
  { id: "ITM-001", institutionId: "INST-001", name: "Dr. Lakshmi Narasimhan", role: "Principal", email: "lakshmi.n@svtemple.org", mobile: "+91 98765 11111", department: "Administration", status: "Active", joinedDate: "2018-06-15" },
  { id: "ITM-002", institutionId: "INST-001", name: "Smt. Radha Kumari", role: "Admin Officer", email: "radha@svtemple.org", mobile: "+91 98765 11112", department: "Office", status: "Active", joinedDate: "2019-01-10" },
  { id: "ITM-003", institutionId: "INST-001", name: "Sri Prakash Rao", role: "Coordinator", email: "prakash@svtemple.org", mobile: "+91 98765 11113", department: "Academics", status: "Active", joinedDate: "2020-06-01" },
  { id: "ITM-004", institutionId: "INST-002", name: "Sri Gopala Krishna", role: "Manager", email: "gopala@svtemple.org", mobile: "+91 87654 22221", department: "Operations", status: "Active", joinedDate: "2020-01-10" },
  { id: "ITM-005", institutionId: "INST-002", name: "Ramu Yadav", role: "Coordinator", email: "ramu@svtemple.org", mobile: "+91 87654 22222", department: "Animal Care", status: "Active", joinedDate: "2020-03-15" },
  { id: "ITM-006", institutionId: "INST-003", name: "Dr. Anand Reddy", role: "Director", email: "anand@svtemple.org", mobile: "+91 76543 33331", department: "Medical", status: "Active", joinedDate: "2015-03-20" },
  { id: "ITM-007", institutionId: "INST-003", name: "Dr. Priya Sharma", role: "Admin Officer", email: "priya.s@svtemple.org", mobile: "+91 76543 33332", department: "Administration", status: "Active", joinedDate: "2016-06-01" },
  { id: "ITM-008", institutionId: "INST-003", name: "Sri Venkat Rao", role: "Trustee Representative", email: "venkat.r@svtemple.org", mobile: "+91 76543 33333", department: "Governance", status: "Active", joinedDate: "2015-03-20" },
  { id: "ITM-009", institutionId: "INST-004", name: "Pandit Subrahmanyam Sharma", role: "Director", email: "subra@svtemple.org", mobile: "+91 65432 44441", department: "Vedic Studies", status: "Active", joinedDate: "2019-08-01" },
  { id: "ITM-010", institutionId: "INST-005", name: "Smt. Saraswathi Devi", role: "Director", email: "saraswathi@svtemple.org", mobile: "+91 54321 55551", department: "Cultural Programs", status: "Active", joinedDate: "2022-04-15" },
  { id: "ITM-011", institutionId: "INST-006", name: "Sri Dharma Rao", role: "Manager", email: "dharma@svtemple.org", mobile: "+91 43210 66661", department: "Operations", status: "Active", joinedDate: "2017-11-01" },
];

export const institutionEvents: InstitutionEvent[] = [
  { id: "IE-001", institutionId: "INST-001", name: "Annual Day 2026", type: "Annual Day", date: "2026-03-15", endDate: "2026-03-15", linkedTempleEvent: "", sharedVolunteers: true, sharedStock: false, budget: 250000, actualSpend: 0, status: "Planning" },
  { id: "IE-002", institutionId: "INST-001", name: "Science Exhibition", type: "Cultural Program", date: "2026-04-10", endDate: "2026-04-12", linkedTempleEvent: "", sharedVolunteers: false, sharedStock: false, budget: 80000, actualSpend: 0, status: "Planning" },
  { id: "IE-003", institutionId: "INST-002", name: "Goshala Utsavam", type: "Cultural Program", date: "2026-02-20", endDate: "2026-02-20", linkedTempleEvent: "Padmavathi Jayanti", sharedVolunteers: true, sharedStock: true, budget: 120000, actualSpend: 0, status: "Scheduled" },
  { id: "IE-004", institutionId: "INST-003", name: "Free Health Camp", type: "Health Camp", date: "2026-02-25", endDate: "2026-02-25", linkedTempleEvent: "", sharedVolunteers: true, sharedStock: false, budget: 180000, actualSpend: 0, status: "Scheduled" },
  { id: "IE-005", institutionId: "INST-003", name: "Blood Donation Drive", type: "Awareness Drive", date: "2026-03-05", endDate: "2026-03-05", linkedTempleEvent: "", sharedVolunteers: true, sharedStock: false, budget: 50000, actualSpend: 0, status: "Planning" },
  { id: "IE-006", institutionId: "INST-003", name: "Eye Care Camp – Jan", type: "Health Camp", date: "2026-01-20", endDate: "2026-01-20", linkedTempleEvent: "", sharedVolunteers: false, sharedStock: false, budget: 95000, actualSpend: 88000, status: "Completed" },
  { id: "IE-007", institutionId: "INST-004", name: "Veda Parayanam", type: "Cultural Program", date: "2026-02-15", endDate: "2026-02-15", linkedTempleEvent: "Maha Shivaratri", sharedVolunteers: true, sharedStock: true, budget: 45000, actualSpend: 0, status: "Scheduled" },
  { id: "IE-008", institutionId: "INST-005", name: "Classical Dance Festival", type: "Cultural Program", date: "2026-03-20", endDate: "2026-03-22", linkedTempleEvent: "", sharedVolunteers: true, sharedStock: false, budget: 150000, actualSpend: 0, status: "Planning" },
  { id: "IE-009", institutionId: "INST-005", name: "Heritage Lecture Series", type: "Awareness Drive", date: "2026-04-01", endDate: "2026-04-05", linkedTempleEvent: "", sharedVolunteers: false, sharedStock: false, budget: 35000, actualSpend: 0, status: "Planning" },
  { id: "IE-010", institutionId: "INST-006", name: "Maha Annadanam – Shivaratri", type: "Annadanam", date: "2026-02-15", endDate: "2026-02-15", linkedTempleEvent: "Maha Shivaratri", sharedVolunteers: true, sharedStock: true, budget: 300000, actualSpend: 0, status: "Scheduled" },
];

export const institutionResources: InstitutionResource[] = [
  { id: "IR-001", institutionId: "INST-001", name: "Projectors", type: "Own", category: "Electronics", quantity: 12, unit: "pcs", value: 480000, status: "Available" },
  { id: "IR-002", institutionId: "INST-001", name: "School Bus Fleet", type: "Own", category: "Vehicle", quantity: 5, unit: "units", value: 2500000, status: "In Use" },
  { id: "IR-003", institutionId: "INST-001", name: "Temple Hall (Event Use)", type: "Temple-Shared", category: "Venue", quantity: 1, unit: "unit", value: 0, status: "Available" },
  { id: "IR-004", institutionId: "INST-002", name: "Cattle", type: "Own", category: "Livestock", quantity: 85, unit: "heads", value: 3400000, status: "In Use" },
  { id: "IR-005", institutionId: "INST-002", name: "Fodder Stock", type: "Own", category: "Feed", quantity: 2000, unit: "kg", value: 120000, status: "Available" },
  { id: "IR-006", institutionId: "INST-002", name: "Milk Processing Unit", type: "Own", category: "Equipment", quantity: 1, unit: "unit", value: 800000, status: "In Use" },
  { id: "IR-007", institutionId: "INST-003", name: "Medical Equipment", type: "Own", category: "Medical", quantity: 45, unit: "sets", value: 5200000, status: "In Use" },
  { id: "IR-008", institutionId: "INST-003", name: "Ambulance", type: "Own", category: "Vehicle", quantity: 2, unit: "units", value: 1800000, status: "In Use" },
  { id: "IR-009", institutionId: "INST-004", name: "Vedic Library Collection", type: "Own", category: "Books", quantity: 2500, unit: "volumes", value: 450000, status: "Available" },
  { id: "IR-010", institutionId: "INST-005", name: "PA System", type: "Temple-Shared", category: "Electronics", quantity: 1, unit: "set", value: 0, status: "Available" },
  { id: "IR-011", institutionId: "INST-006", name: "Kitchen Equipment", type: "Own", category: "Kitchen", quantity: 15, unit: "sets", value: 950000, status: "In Use" },
  { id: "IR-012", institutionId: "INST-006", name: "Dining Hall (Shared)", type: "Temple-Shared", category: "Venue", quantity: 1, unit: "unit", value: 0, status: "Available" },
];

export const institutionFinancials: InstitutionFinancial[] = [
  { institutionId: "INST-001", month: "2026-01", donationsReceived: 350000, operationalExpenses: 520000, grants: 200000, sponsorship: 80000, surplus: 110000 },
  { institutionId: "INST-001", month: "2025-12", donationsReceived: 320000, operationalExpenses: 510000, grants: 200000, sponsorship: 65000, surplus: 75000 },
  { institutionId: "INST-002", month: "2026-01", donationsReceived: 180000, operationalExpenses: 280000, grants: 50000, sponsorship: 30000, surplus: -20000 },
  { institutionId: "INST-002", month: "2025-12", donationsReceived: 165000, operationalExpenses: 270000, grants: 50000, sponsorship: 25000, surplus: -30000 },
  { institutionId: "INST-003", month: "2026-01", donationsReceived: 750000, operationalExpenses: 1200000, grants: 400000, sponsorship: 150000, surplus: 100000 },
  { institutionId: "INST-004", month: "2026-01", donationsReceived: 95000, operationalExpenses: 140000, grants: 60000, sponsorship: 0, surplus: 15000 },
  { institutionId: "INST-005", month: "2026-01", donationsReceived: 120000, operationalExpenses: 185000, grants: 40000, sponsorship: 35000, surplus: 10000 },
  { institutionId: "INST-006", month: "2026-01", donationsReceived: 450000, operationalExpenses: 680000, grants: 150000, sponsorship: 100000, surplus: 20000 },
  { institutionId: "INST-007", month: "2026-01", donationsReceived: 45000, operationalExpenses: 65000, grants: 20000, sponsorship: 0, surplus: 0 },
];

export const institutionVolunteers: InstitutionVolunteer[] = [
  { id: "IV-001", institutionId: "INST-001", name: "Sundar Raj", role: "Teaching Assistant", mobile: "+91 99001 11001", shift: "8 AM – 3 PM", shared: false, status: "Active" },
  { id: "IV-002", institutionId: "INST-001", name: "Meena Kumari", role: "Library Helper", mobile: "+91 99001 11002", shift: "9 AM – 1 PM", shared: true, status: "Active" },
  { id: "IV-003", institutionId: "INST-002", name: "Raju Yadav", role: "Animal Care", mobile: "+91 88002 22001", shift: "5 AM – 11 AM", shared: false, status: "Active" },
  { id: "IV-004", institutionId: "INST-002", name: "Laxmi Bai", role: "Milk Collection", mobile: "+91 88002 22002", shift: "5 AM – 8 AM", shared: false, status: "Active" },
  { id: "IV-005", institutionId: "INST-003", name: "Dr. Kavitha", role: "Medical Volunteer", mobile: "+91 77003 33001", shift: "9 AM – 5 PM", shared: true, status: "Active" },
  { id: "IV-006", institutionId: "INST-003", name: "Ramesh Babu", role: "Patient Care", mobile: "+91 77003 33002", shift: "6 AM – 2 PM", shared: true, status: "Active" },
  { id: "IV-007", institutionId: "INST-004", name: "Pandit Shyam", role: "Teaching Support", mobile: "+91 66004 44001", shift: "6 AM – 12 PM", shared: false, status: "Active" },
  { id: "IV-008", institutionId: "INST-005", name: "Anjali Devi", role: "Event Coordination", mobile: "+91 55005 55001", shift: "10 AM – 6 PM", shared: true, status: "Active" },
  { id: "IV-009", institutionId: "INST-006", name: "Gopi Krishna", role: "Kitchen Volunteer", mobile: "+91 44006 66001", shift: "4 AM – 12 PM", shared: true, status: "Active" },
  { id: "IV-010", institutionId: "INST-006", name: "Seetha Devi", role: "Serving Coordinator", mobile: "+91 44006 66002", shift: "10 AM – 2 PM", shared: true, status: "Active" },
];
