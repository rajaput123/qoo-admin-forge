// ==========================================
// BRANCH MANAGEMENT DATA LAYER
// Trust → Branch → Structure → Operations
// ==========================================

export interface Branch {
  id: string;
  name: string;
  code: string;
  address: string;
  city: string;
  state: string;
  country: string;
  contactNumber: string;
  email: string;
  branchHead: string;
  gstNumber: string;
  status: "Active" | "Inactive" | "Under Setup";
  createdDate: string;
  mainStructure: string;
  structureCount: number;
  activeEvents: number;
  totalStockValue: number;
  volunteerCount: number;
  freelancerCount: number;
  monthlyRevenue: number;
  monthlyExpense: number;
}

export interface BranchAdminUser {
  id: string;
  branchId: string;
  name: string;
  role: "Branch Admin" | "Kitchen Manager" | "Store Keeper" | "Event Coordinator" | "Priest Coordinator" | "Finance Manager";
  email: string;
  mobile: string;
  accessScope: "Full Access" | "Module Specific" | "Read Only";
  status: "Active" | "Inactive";
  assignedDate: string;
}

export interface BranchStructure {
  id: string;
  branchId: string;
  name: string;
  type: "Main Temple" | "Shrine" | "Kitchen" | "Store Room" | "Event Hall" | "Counter" | "Office";
  status: "Active" | "Under Maintenance" | "Inactive";
  capacity?: number;
}

export interface BranchStockSummary {
  branchId: string;
  totalItems: number;
  lowStockItems: number;
  outOfStock: number;
  totalValue: number;
  storeWise: { store: string; items: number; value: number; lowStock: number }[];
}

export interface BranchEvent {
  id: string;
  branchId: string;
  name: string;
  type: string;
  startDate: string;
  endDate: string;
  status: "Planning" | "Scheduled" | "In Progress" | "Completed" | "Archived";
  budget: number;
  actualSpend: number;
}

export interface BranchVolunteer {
  id: string;
  branchId: string;
  name: string;
  role: string;
  mobile: string;
  shift: string;
  structure: string;
  crossBranch: boolean;
  status: "Active" | "Inactive";
}

export interface BranchFreelancer {
  id: string;
  branchId: string;
  name: string;
  service: string;
  mobile: string;
  rating: number;
  totalAssignments: number;
  totalPaid: number;
  shared: boolean;
  status: "Active" | "Inactive";
}

export interface BranchKitchenSummary {
  branchId: string;
  activeBatches: number;
  todayMeals: number;
  ingredientRequests: number;
  pendingRequests: number;
  wastagePercent: number;
}

export interface BranchReport {
  branchId: string;
  month: string;
  eventCost: number;
  materialUsage: number;
  volunteerHours: number;
  freelancerPayments: number;
  kitchenConsumption: number;
  revenue: number;
}

// ---- MOCK DATA ----

export const branches: Branch[] = [
  {
    id: "BR-001",
    name: "Sri Venkateswara Main Temple",
    code: "SVT-MAIN",
    address: "Temple Road, Tirumala Hills",
    city: "Tirupati",
    state: "Andhra Pradesh",
    country: "India",
    contactNumber: "+91 877 223 3333",
    email: "main@svtemple.org",
    branchHead: "Sri Ramesh Sharma",
    gstNumber: "37AABCS1234A1Z5",
    status: "Active",
    createdDate: "2020-01-15",
    mainStructure: "Main Temple",
    structureCount: 8,
    activeEvents: 3,
    totalStockValue: 485000,
    volunteerCount: 245,
    freelancerCount: 12,
    monthlyRevenue: 2850000,
    monthlyExpense: 1420000,
  },
  {
    id: "BR-002",
    name: "Sri Padmavathi Temple",
    code: "SPT-ALM",
    address: "Alamelumangapuram Road",
    city: "Tiruchanur",
    state: "Andhra Pradesh",
    country: "India",
    contactNumber: "+91 877 228 4444",
    email: "padmavathi@svtemple.org",
    branchHead: "Sri Venkatesh Iyer",
    gstNumber: "37AABCS1234A2Z4",
    status: "Active",
    createdDate: "2021-06-10",
    mainStructure: "Padmavathi Shrine",
    structureCount: 5,
    activeEvents: 2,
    totalStockValue: 215000,
    volunteerCount: 120,
    freelancerCount: 6,
    monthlyRevenue: 1450000,
    monthlyExpense: 780000,
  },
  {
    id: "BR-003",
    name: "Sri Kalyana Venkateswara Temple",
    code: "SKV-SRI",
    address: "Srinivasa Mangapuram",
    city: "Srinivasa Mangapuram",
    state: "Andhra Pradesh",
    country: "India",
    contactNumber: "+91 877 229 5555",
    email: "kalyana@svtemple.org",
    branchHead: "Sri Prasad Reddy",
    gstNumber: "37AABCS1234A3Z3",
    status: "Active",
    createdDate: "2022-03-20",
    mainStructure: "Kalyana Mandapam",
    structureCount: 4,
    activeEvents: 1,
    totalStockValue: 142000,
    volunteerCount: 85,
    freelancerCount: 4,
    monthlyRevenue: 920000,
    monthlyExpense: 510000,
  },
  {
    id: "BR-004",
    name: "Sri Govindaraja Swamy Temple",
    code: "SGS-TPT",
    address: "Car Street, Tirupati Town",
    city: "Tirupati",
    state: "Andhra Pradesh",
    country: "India",
    contactNumber: "+91 877 225 6666",
    email: "govindaraja@svtemple.org",
    branchHead: "Sri Mohan Rao",
    gstNumber: "37AABCS1234A4Z2",
    status: "Active",
    createdDate: "2023-01-05",
    mainStructure: "Govindaraja Temple",
    structureCount: 6,
    activeEvents: 2,
    totalStockValue: 198000,
    volunteerCount: 95,
    freelancerCount: 5,
    monthlyRevenue: 1100000,
    monthlyExpense: 620000,
  },
  {
    id: "BR-005",
    name: "Sri Kapileswara Swamy Temple",
    code: "SKS-TPT",
    address: "Kapila Theertham Road",
    city: "Tirupati",
    state: "Andhra Pradesh",
    country: "India",
    contactNumber: "+91 877 226 7777",
    email: "kapileswara@svtemple.org",
    branchHead: "Sri Suresh Babu",
    gstNumber: "",
    status: "Under Setup",
    createdDate: "2025-11-15",
    mainStructure: "Hill Shrine",
    structureCount: 2,
    activeEvents: 0,
    totalStockValue: 35000,
    volunteerCount: 20,
    freelancerCount: 2,
    monthlyRevenue: 180000,
    monthlyExpense: 95000,
  },
];

export const branchAdminUsers: BranchAdminUser[] = [
  { id: "BA-001", branchId: "BR-001", name: "Ramesh Kumar", role: "Branch Admin", email: "ramesh@svtemple.org", mobile: "+91 98765 43210", accessScope: "Full Access", status: "Active", assignedDate: "2020-01-15" },
  { id: "BA-002", branchId: "BR-001", name: "Lakshmi Devi", role: "Kitchen Manager", email: "lakshmi@svtemple.org", mobile: "+91 98765 43211", accessScope: "Module Specific", status: "Active", assignedDate: "2020-03-10" },
  { id: "BA-003", branchId: "BR-001", name: "Suresh Nair", role: "Store Keeper", email: "suresh@svtemple.org", mobile: "+91 98765 43212", accessScope: "Module Specific", status: "Active", assignedDate: "2021-01-05" },
  { id: "BA-004", branchId: "BR-001", name: "Priya Sharma", role: "Event Coordinator", email: "priya@svtemple.org", mobile: "+91 98765 43213", accessScope: "Module Specific", status: "Active", assignedDate: "2022-06-15" },
  { id: "BA-005", branchId: "BR-001", name: "Karthik Reddy", role: "Finance Manager", email: "karthik@svtemple.org", mobile: "+91 98765 43214", accessScope: "Module Specific", status: "Active", assignedDate: "2023-02-20" },
  { id: "BA-006", branchId: "BR-002", name: "Venkatesh Iyer", role: "Branch Admin", email: "venkatesh@svtemple.org", mobile: "+91 87654 32109", accessScope: "Full Access", status: "Active", assignedDate: "2021-06-10" },
  { id: "BA-007", branchId: "BR-002", name: "Meera Kumari", role: "Kitchen Manager", email: "meera@svtemple.org", mobile: "+91 87654 32110", accessScope: "Module Specific", status: "Active", assignedDate: "2021-08-01" },
  { id: "BA-008", branchId: "BR-003", name: "Prasad Reddy", role: "Branch Admin", email: "prasad@svtemple.org", mobile: "+91 76543 21098", accessScope: "Full Access", status: "Active", assignedDate: "2022-03-20" },
  { id: "BA-009", branchId: "BR-004", name: "Mohan Rao", role: "Branch Admin", email: "mohan@svtemple.org", mobile: "+91 65432 10987", accessScope: "Full Access", status: "Active", assignedDate: "2023-01-05" },
  { id: "BA-010", branchId: "BR-004", name: "Anitha Devi", role: "Priest Coordinator", email: "anitha@svtemple.org", mobile: "+91 65432 10988", accessScope: "Module Specific", status: "Active", assignedDate: "2023-04-10" },
];

export const branchStructures: BranchStructure[] = [
  // BR-001
  { id: "BS-001", branchId: "BR-001", name: "Main Temple", type: "Main Temple", status: "Active", capacity: 5000 },
  { id: "BS-002", branchId: "BR-001", name: "Padmavathi Shrine", type: "Shrine", status: "Active", capacity: 500 },
  { id: "BS-003", branchId: "BR-001", name: "Andal Shrine", type: "Shrine", status: "Active", capacity: 300 },
  { id: "BS-004", branchId: "BR-001", name: "Main Kitchen", type: "Kitchen", status: "Active" },
  { id: "BS-005", branchId: "BR-001", name: "Central Store", type: "Store Room", status: "Active" },
  { id: "BS-006", branchId: "BR-001", name: "Kalyana Mandapam", type: "Event Hall", status: "Active", capacity: 2000 },
  { id: "BS-007", branchId: "BR-001", name: "Counter Block A", type: "Counter", status: "Active" },
  { id: "BS-008", branchId: "BR-001", name: "Admin Office", type: "Office", status: "Active" },
  // BR-002
  { id: "BS-009", branchId: "BR-002", name: "Padmavathi Temple", type: "Main Temple", status: "Active", capacity: 3000 },
  { id: "BS-010", branchId: "BR-002", name: "Kitchen Hall", type: "Kitchen", status: "Active" },
  { id: "BS-011", branchId: "BR-002", name: "Store Room", type: "Store Room", status: "Active" },
  { id: "BS-012", branchId: "BR-002", name: "Seva Counter", type: "Counter", status: "Active" },
  { id: "BS-013", branchId: "BR-002", name: "Event Pavilion", type: "Event Hall", status: "Active", capacity: 1000 },
  // BR-003
  { id: "BS-014", branchId: "BR-003", name: "Kalyana Venkateswara Shrine", type: "Main Temple", status: "Active", capacity: 2000 },
  { id: "BS-015", branchId: "BR-003", name: "Prasadam Kitchen", type: "Kitchen", status: "Active" },
  { id: "BS-016", branchId: "BR-003", name: "Material Store", type: "Store Room", status: "Active" },
  { id: "BS-017", branchId: "BR-003", name: "Reception Counter", type: "Counter", status: "Active" },
  // BR-004
  { id: "BS-018", branchId: "BR-004", name: "Govindaraja Temple", type: "Main Temple", status: "Active", capacity: 4000 },
  { id: "BS-019", branchId: "BR-004", name: "Parthasarathi Shrine", type: "Shrine", status: "Active", capacity: 400 },
  { id: "BS-020", branchId: "BR-004", name: "Kitchen Block", type: "Kitchen", status: "Active" },
  { id: "BS-021", branchId: "BR-004", name: "Central Store", type: "Store Room", status: "Active" },
  { id: "BS-022", branchId: "BR-004", name: "Booking Counter", type: "Counter", status: "Active" },
  { id: "BS-023", branchId: "BR-004", name: "Utsava Mandapam", type: "Event Hall", status: "Active", capacity: 1500 },
  // BR-005
  { id: "BS-024", branchId: "BR-005", name: "Hill Shrine", type: "Main Temple", status: "Active", capacity: 800 },
  { id: "BS-025", branchId: "BR-005", name: "Store", type: "Store Room", status: "Under Maintenance" },
];

export const branchStockSummaries: BranchStockSummary[] = [
  {
    branchId: "BR-001",
    totalItems: 48,
    lowStockItems: 5,
    outOfStock: 1,
    totalValue: 485000,
    storeWise: [
      { store: "Central Store", items: 30, value: 320000, lowStock: 3 },
      { store: "Main Kitchen", items: 12, value: 125000, lowStock: 2 },
      { store: "Main Temple", items: 6, value: 40000, lowStock: 0 },
    ],
  },
  {
    branchId: "BR-002",
    totalItems: 28,
    lowStockItems: 3,
    outOfStock: 0,
    totalValue: 215000,
    storeWise: [
      { store: "Store Room", items: 18, value: 145000, lowStock: 2 },
      { store: "Kitchen Hall", items: 10, value: 70000, lowStock: 1 },
    ],
  },
  {
    branchId: "BR-003",
    totalItems: 22,
    lowStockItems: 2,
    outOfStock: 0,
    totalValue: 142000,
    storeWise: [
      { store: "Material Store", items: 15, value: 98000, lowStock: 1 },
      { store: "Prasadam Kitchen", items: 7, value: 44000, lowStock: 1 },
    ],
  },
  {
    branchId: "BR-004",
    totalItems: 35,
    lowStockItems: 4,
    outOfStock: 1,
    totalValue: 198000,
    storeWise: [
      { store: "Central Store", items: 22, value: 130000, lowStock: 2 },
      { store: "Kitchen Block", items: 13, value: 68000, lowStock: 2 },
    ],
  },
  {
    branchId: "BR-005",
    totalItems: 10,
    lowStockItems: 1,
    outOfStock: 0,
    totalValue: 35000,
    storeWise: [
      { store: "Store", items: 10, value: 35000, lowStock: 1 },
    ],
  },
];

export const branchEvents: BranchEvent[] = [
  { id: "BE-001", branchId: "BR-001", name: "Maha Shivaratri", type: "Special Ritual", startDate: "2026-02-15", endDate: "2026-02-15", status: "Scheduled", budget: 500000, actualSpend: 0 },
  { id: "BE-002", branchId: "BR-001", name: "Brahmotsavam 2026", type: "Festival", startDate: "2026-03-15", endDate: "2026-03-24", status: "Planning", budget: 2500000, actualSpend: 0 },
  { id: "BE-003", branchId: "BR-001", name: "Ugadi Festival", type: "Festival", startDate: "2026-03-28", endDate: "2026-03-30", status: "Planning", budget: 800000, actualSpend: 0 },
  { id: "BE-004", branchId: "BR-002", name: "Padmavathi Jayanti", type: "Special Ritual", startDate: "2026-02-20", endDate: "2026-02-20", status: "Scheduled", budget: 300000, actualSpend: 0 },
  { id: "BE-005", branchId: "BR-002", name: "Annual Flower Festival", type: "Festival", startDate: "2026-04-05", endDate: "2026-04-07", status: "Planning", budget: 450000, actualSpend: 0 },
  { id: "BE-006", branchId: "BR-003", name: "Kalyana Utsavam", type: "Festival", startDate: "2026-03-10", endDate: "2026-03-10", status: "Planning", budget: 200000, actualSpend: 0 },
  { id: "BE-007", branchId: "BR-004", name: "Vaikunta Ekadasi Special", type: "Special Ritual", startDate: "2026-01-10", endDate: "2026-01-10", status: "Completed", budget: 350000, actualSpend: 320000 },
  { id: "BE-008", branchId: "BR-004", name: "Ratha Yatra", type: "Festival", startDate: "2026-04-10", endDate: "2026-04-10", status: "Planning", budget: 600000, actualSpend: 0 },
];

export const branchVolunteers: BranchVolunteer[] = [
  { id: "BV-001", branchId: "BR-001", name: "Arun Kumar", role: "Crowd Control", mobile: "+91 99887 76655", shift: "6 AM – 2 PM", structure: "Main Temple", crossBranch: false, status: "Active" },
  { id: "BV-002", branchId: "BR-001", name: "Sita Devi", role: "Kitchen Assistant", mobile: "+91 99887 76656", shift: "4 AM – 12 PM", structure: "Main Kitchen", crossBranch: false, status: "Active" },
  { id: "BV-003", branchId: "BR-001", name: "Ravi Teja", role: "Ritual Support", mobile: "+91 99887 76657", shift: "5 AM – 10 AM", structure: "Main Temple", crossBranch: true, status: "Active" },
  { id: "BV-004", branchId: "BR-002", name: "Padma Lakshmi", role: "Counter Staff", mobile: "+91 88776 65544", shift: "8 AM – 4 PM", structure: "Seva Counter", crossBranch: false, status: "Active" },
  { id: "BV-005", branchId: "BR-002", name: "Ganesh Babu", role: "Crowd Control", mobile: "+91 88776 65545", shift: "6 AM – 2 PM", structure: "Padmavathi Temple", crossBranch: false, status: "Active" },
  { id: "BV-006", branchId: "BR-003", name: "Krishna Murthy", role: "General Support", mobile: "+91 77665 54433", shift: "6 AM – 2 PM", structure: "Kalyana Venkateswara Shrine", crossBranch: true, status: "Active" },
  { id: "BV-007", branchId: "BR-004", name: "Venkat Reddy", role: "Crowd Control", mobile: "+91 66554 43322", shift: "6 AM – 2 PM", structure: "Govindaraja Temple", crossBranch: false, status: "Active" },
];

export const branchFreelancers: BranchFreelancer[] = [
  { id: "BF-001", branchId: "BR-001", name: "Pixel Studio", service: "Photography", mobile: "+91 98765 43210", rating: 4.8, totalAssignments: 24, totalPaid: 350000, shared: true, status: "Active" },
  { id: "BF-002", branchId: "BR-001", name: "Decor Dreams", service: "Decoration", mobile: "+91 87654 32109", rating: 4.5, totalAssignments: 18, totalPaid: 520000, shared: false, status: "Active" },
  { id: "BF-003", branchId: "BR-001", name: "Sound Waves Pro", service: "Sound Engineering", mobile: "+91 76543 21098", rating: 4.9, totalAssignments: 15, totalPaid: 280000, shared: true, status: "Active" },
  { id: "BF-004", branchId: "BR-002", name: "Floral Elegance", service: "Floral Arrangement", mobile: "+91 65432 10987", rating: 4.3, totalAssignments: 12, totalPaid: 180000, shared: false, status: "Active" },
  { id: "BF-005", branchId: "BR-004", name: "Heritage Electricals", service: "Lighting", mobile: "+91 32109 87654", rating: 4.6, totalAssignments: 10, totalPaid: 220000, shared: true, status: "Active" },
];

export const branchKitchenSummaries: BranchKitchenSummary[] = [
  { branchId: "BR-001", activeBatches: 4, todayMeals: 12000, ingredientRequests: 8, pendingRequests: 2, wastagePercent: 3.2 },
  { branchId: "BR-002", activeBatches: 2, todayMeals: 5000, ingredientRequests: 4, pendingRequests: 1, wastagePercent: 2.8 },
  { branchId: "BR-003", activeBatches: 1, todayMeals: 2500, ingredientRequests: 3, pendingRequests: 0, wastagePercent: 1.5 },
  { branchId: "BR-004", activeBatches: 3, todayMeals: 8000, ingredientRequests: 6, pendingRequests: 1, wastagePercent: 4.1 },
  { branchId: "BR-005", activeBatches: 0, todayMeals: 0, ingredientRequests: 0, pendingRequests: 0, wastagePercent: 0 },
];

export const branchReports: BranchReport[] = [
  { branchId: "BR-001", month: "2026-01", eventCost: 450000, materialUsage: 180000, volunteerHours: 4800, freelancerPayments: 120000, kitchenConsumption: 320000, revenue: 2850000 },
  { branchId: "BR-001", month: "2025-12", eventCost: 380000, materialUsage: 165000, volunteerHours: 4200, freelancerPayments: 95000, kitchenConsumption: 290000, revenue: 2650000 },
  { branchId: "BR-002", month: "2026-01", eventCost: 180000, materialUsage: 85000, volunteerHours: 2400, freelancerPayments: 55000, kitchenConsumption: 140000, revenue: 1450000 },
  { branchId: "BR-002", month: "2025-12", eventCost: 150000, materialUsage: 72000, volunteerHours: 2100, freelancerPayments: 42000, kitchenConsumption: 125000, revenue: 1320000 },
  { branchId: "BR-003", month: "2026-01", eventCost: 95000, materialUsage: 52000, volunteerHours: 1500, freelancerPayments: 28000, kitchenConsumption: 85000, revenue: 920000 },
  { branchId: "BR-004", month: "2026-01", eventCost: 320000, materialUsage: 110000, volunteerHours: 2800, freelancerPayments: 72000, kitchenConsumption: 195000, revenue: 1100000 },
  { branchId: "BR-005", month: "2026-01", eventCost: 0, materialUsage: 12000, volunteerHours: 400, freelancerPayments: 8000, kitchenConsumption: 0, revenue: 180000 },
];
