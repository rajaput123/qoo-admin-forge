// Hierarchical permission tree: Module -> Sub-Module -> Features
// Used by the Permission Matrix UI in User & Access Management.

export interface FeatureNode {
  id: string;          // unique feature key e.g. "donations.entry.cash"
  name: string;        // display name e.g. "Cash Donation"
}

export interface SubModuleNode {
  id: string;          // unique sub-module key e.g. "donations.entry"
  name: string;        // display name e.g. "Donation Entry"
  features: FeatureNode[];
}

export interface ModuleNode {
  id: string;          // unique module key e.g. "donations"
  name: string;        // display name e.g. "Donations"
  subModules: SubModuleNode[];
}

export const permissionTree: ModuleNode[] = [
  {
    id: "donations",
    name: "Donations",
    subModules: [
      {
        id: "donations.entry",
        name: "Donation Entry",
        features: [
          { id: "donations.entry.cash", name: "Cash Donation" },
          { id: "donations.entry.online", name: "Online Donation" },
          { id: "donations.entry.inkind", name: "In-Kind Donation" },
        ],
      },
      {
        id: "donations.receipts",
        name: "Receipts",
        features: [
          { id: "donations.receipts.generate", name: "Generate Receipt" },
          { id: "donations.receipts.reprint", name: "Reprint Receipt" },
          { id: "donations.receipts.80g", name: "80G Tax Receipt" },
        ],
      },
      {
        id: "donations.devotees",
        name: "Devotees",
        features: [
          { id: "donations.devotees.list", name: "Devotee List" },
          { id: "donations.devotees.history", name: "Donation History" },
        ],
      },
    ],
  },
  {
    id: "events",
    name: "Events",
    subModules: [
      {
        id: "events.management",
        name: "Event Management",
        features: [
          { id: "events.management.create", name: "Create Event" },
          { id: "events.management.publish", name: "Publish Event" },
          { id: "events.management.complete", name: "Complete Event" },
        ],
      },
      {
        id: "events.expenses",
        name: "Event Expenses",
        features: [
          { id: "events.expenses.add", name: "Add Expense" },
          { id: "events.expenses.report", name: "Expense Report" },
        ],
      },
      {
        id: "events.donations",
        name: "Event Donations",
        features: [
          { id: "events.donations.collect", name: "Collect Donations" },
          { id: "events.donations.fund", name: "Assign Fund" },
        ],
      },
    ],
  },
  {
    id: "finance",
    name: "Finance & Accounts",
    subModules: [
      {
        id: "finance.transactions",
        name: "Transactions",
        features: [
          { id: "finance.transactions.income", name: "Income" },
          { id: "finance.transactions.expense", name: "Expense" },
          { id: "finance.transactions.transfer", name: "Internal Transfer" },
        ],
      },
      {
        id: "finance.accounts",
        name: "Accounts",
        features: [
          { id: "finance.accounts.bank", name: "Bank Accounts" },
          { id: "finance.accounts.cash", name: "Cash Accounts" },
          { id: "finance.accounts.adjust", name: "Balance Adjustment" },
        ],
      },
      {
        id: "finance.funds",
        name: "Funds",
        features: [
          { id: "finance.funds.view", name: "Fund Balances" },
          { id: "finance.funds.tag", name: "Tag Transactions" },
        ],
      },
      {
        id: "finance.vouchers",
        name: "Vouchers",
        features: [
          { id: "finance.vouchers.create", name: "Create Voucher" },
          { id: "finance.vouchers.approve", name: "Approve Voucher" },
        ],
      },
      {
        id: "finance.reconciliation",
        name: "Reconciliation",
        features: [
          { id: "finance.reconciliation.dashboard", name: "Reconciliation Dashboard" },
          { id: "finance.reconciliation.audit", name: "Audit Trail" },
        ],
      },
      {
        id: "finance.payroll",
        name: "Payroll",
        features: [
          { id: "finance.payroll.run", name: "Run Payroll" },
          { id: "finance.payroll.payout", name: "Batch Payout" },
        ],
      },
    ],
  },
  {
    id: "inventory",
    name: "Inventory",
    subModules: [
      {
        id: "inventory.stock",
        name: "Stock Management",
        features: [
          { id: "inventory.stock.add", name: "Add Stock" },
          { id: "inventory.stock.adjust", name: "Stock Adjustment" },
        ],
      },
      {
        id: "inventory.suppliers",
        name: "Suppliers",
        features: [
          { id: "inventory.suppliers.list", name: "Supplier List" },
          { id: "inventory.suppliers.po", name: "Purchase Orders" },
        ],
      },
    ],
  },
  {
    id: "hr",
    name: "HR & People",
    subModules: [
      {
        id: "hr.employees",
        name: "Employees",
        features: [
          { id: "hr.employees.directory", name: "Employee Directory" },
          { id: "hr.employees.onboarding", name: "Onboarding" },
        ],
      },
      {
        id: "hr.attendance",
        name: "Attendance",
        features: [
          { id: "hr.attendance.mark", name: "Mark Attendance" },
          { id: "hr.attendance.correction", name: "Attendance Correction" },
        ],
      },
      {
        id: "hr.leave",
        name: "Leave",
        features: [
          { id: "hr.leave.apply", name: "Apply Leave" },
          { id: "hr.leave.approve", name: "Approve Leave" },
        ],
      },
      {
        id: "hr.shifts",
        name: "Shifts",
        features: [
          { id: "hr.shifts.assign", name: "Assign Shift" },
          { id: "hr.shifts.swap", name: "Shift Swap" },
        ],
      },
    ],
  },
  {
    id: "crowd",
    name: "Crowd Management",
    subModules: [
      {
        id: "crowd.queue",
        name: "Queue Control",
        features: [
          { id: "crowd.queue.tokens", name: "Issue Tokens" },
          { id: "crowd.queue.monitor", name: "Live Monitoring" },
        ],
      },
      {
        id: "crowd.bookings",
        name: "Darshan Bookings",
        features: [
          { id: "crowd.bookings.slot", name: "Slot Booking" },
          { id: "crowd.bookings.checkin", name: "Check-In" },
        ],
      },
    ],
  },
  {
    id: "freelancers",
    name: "Freelancers",
    subModules: [
      {
        id: "freelancers.directory",
        name: "Directory",
        features: [
          { id: "freelancers.directory.list", name: "Freelancer List" },
          { id: "freelancers.directory.gst", name: "GST & Tax Info" },
        ],
      },
      {
        id: "freelancers.billing",
        name: "Billing",
        features: [
          { id: "freelancers.billing.invoice", name: "Invoices" },
          { id: "freelancers.billing.payment", name: "Payments" },
        ],
      },
    ],
  },
  {
    id: "reports",
    name: "Reports",
    subModules: [
      {
        id: "reports.financial",
        name: "Financial Reports",
        features: [
          { id: "reports.financial.income", name: "Income Report" },
          { id: "reports.financial.expense", name: "Expense Report" },
        ],
      },
      {
        id: "reports.operational",
        name: "Operational Reports",
        features: [
          { id: "reports.operational.donations", name: "Donations" },
          { id: "reports.operational.events", name: "Events" },
          { id: "reports.operational.hr", name: "HR" },
        ],
      },
    ],
  },
  {
    id: "settings",
    name: "Settings",
    subModules: [
      {
        id: "settings.general",
        name: "General Settings",
        features: [
          { id: "settings.general.temple", name: "Temple Profile" },
          { id: "settings.general.locale", name: "Locale & Time" },
        ],
      },
      {
        id: "settings.access",
        name: "Users & Access",
        features: [
          { id: "settings.access.users", name: "Manage Users" },
          { id: "settings.access.roles", name: "Manage Roles" },
          { id: "settings.access.permissions", name: "Permission Matrix" },
        ],
      },
      {
        id: "settings.modules",
        name: "Modules",
        features: [
          { id: "settings.modules.toggle", name: "Toggle Modules" },
        ],
      },
    ],
  },
];

export const allActions: Array<"view" | "create" | "edit" | "delete" | "approve"> = [
  "view",
  "create",
  "edit",
  "delete",
  "approve",
];

// Flatten helpers
export const allFeatureIds = (): string[] =>
  permissionTree.flatMap(m => m.subModules.flatMap(s => s.features.map(f => f.id)));

export const featureIdsForModule = (moduleId: string): string[] => {
  const m = permissionTree.find(x => x.id === moduleId);
  if (!m) return [];
  return m.subModules.flatMap(s => s.features.map(f => f.id));
};

export const featureIdsForSubModule = (subModuleId: string): string[] => {
  for (const m of permissionTree) {
    const s = m.subModules.find(sm => sm.id === subModuleId);
    if (s) return s.features.map(f => f.id);
  }
  return [];
};
