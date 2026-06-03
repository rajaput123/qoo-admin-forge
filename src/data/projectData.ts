// Projects & Initiatives - Data Types and Sample Data

export interface CustomField {
    id: string;
    name: string;
    type: "text" | "number" | "date" | "dropdown" | "file";
    value: string;
    options?: string[]; // for dropdown
}

export interface Milestone {
    id: string;
    title: string;
    targetDate: string;
    estimatedCost: number;
    status: "Pending" | "In Progress" | "Completed" | "Delayed";
    photos: string[];
    description: string;
}

export interface Donation {
    id: string;
    donorName: string;
    amount: number;
    date: string;
    milestoneLinked?: string;
    anonymous: boolean;
    paymentMode: string;
}

export interface Expense {
    id: string;
    title: string;
    vendor: string;
    category: string;
    amount: number;
    billFile?: string;
    paidStatus: "Pending" | "Paid" | "Overdue";
    approvedBy?: string;
    date: string;
    milestoneLinked?: string;
}

export interface Update {
    id: string;
    type: "Progress" | "Photo Gallery" | "Completion" | "Delay Notice";
    title: string;
    content: string;
    photos: string[];
    date: string;
    author: string;
    visibleToDevotees: boolean;
}

export interface ActivityLog {
    id: string;
    event: string;
    description: string;
    timestamp: string;
    user: string;
    type: "donation" | "expense" | "milestone" | "status" | "update";
}

export interface Project {
    id: string;
    title: string;
    type: "Construction" | "Renovation" | "Infrastructure" | "Religious Program" | "Community Service" | "Other";
    description: string;
    startDate: string;
    endDate: string;
    priority: "High" | "Medium" | "Low";
    status: "Draft" | "Active" | "On Hold" | "Completed" | "Cancelled" | "Archived";
    manager: string;
    goalAmount: number;
    raisedAmount: number;
    spentAmount: number;
    completion: number;

    // Funding settings
    minimumContribution: number;
    suggestedSlabs: number[];
    showDonorNames: boolean;
    transparencyNote: string;
    publicVisibility: boolean;

    // Relations
    milestones: Milestone[];
    donations: Donation[];
    expenses: Expense[];
    updates: Update[];
    activityLog: ActivityLog[];

    // Custom fields per tab
    customFields: {
        overview: CustomField[];
        funding: CustomField[];
        expenses: CustomField[];
        updates: CustomField[];
    };

    createdAt: string;
    createdBy: string;
    lastUpdated: string;
}

// Sample Projects Data
export const projects: Project[] = [
    {
        id: "PRJ-001",
        title: "New Gopuram Construction",
        type: "Construction",
        description: "Construction of a new 5-tier Gopuram at the main entrance with traditional Dravidian architecture.",
        startDate: "2025-03-01",
        endDate: "2026-12-31",
        priority: "High",
        status: "Active",
        manager: "Architect Krishnan",
        goalAmount: 15000000,
        raisedAmount: 8500000,
        spentAmount: 3200000,
        completion: 35,
        minimumContribution: 1000,
        suggestedSlabs: [1000, 5000, 10000, 25000, 50000, 100000],
        showDonorNames: true,
        transparencyNote: "All donations will be used exclusively for Gopuram construction materials and skilled labor.",
        publicVisibility: true,
        milestones: [
            {
                id: "M001",
                title: "Foundation Work",
                targetDate: "2025-06-30",
                estimatedCost: 2500000,
                status: "Completed",
                photos: [],
                description: "Deep foundation work completed with traditional methods"
            },
            {
                id: "M002",
                title: "First Tier Construction",
                targetDate: "2025-12-31",
                estimatedCost: 4000000,
                status: "In Progress",
                photos: [],
                description: "First tier stonework and carving in progress"
            },
            {
                id: "M003",
                title: "Second Tier Construction",
                targetDate: "2026-06-30",
                estimatedCost: 3500000,
                status: "Pending",
                photos: [],
                description: "Second tier construction phase"
            },
        ],
        donations: [
            { id: "D001", donorName: "Rajesh Kumar", amount: 100000, date: "2025-04-15", milestoneLinked: "M001", anonymous: false, paymentMode: "Bank Transfer" },
            { id: "D002", donorName: "Anonymous", amount: 500000, date: "2025-05-20", milestoneLinked: "M001", anonymous: true, paymentMode: "Cheque" },
            { id: "D003", donorName: "Sunita Patel", amount: 25000, date: "2025-06-10", milestoneLinked: "M002", anonymous: false, paymentMode: "UPI" },
        ],
        expenses: [
            { id: "E001", title: "Granite Procurement", vendor: "Stone Suppliers Ltd", category: "Materials", amount: 1200000, paidStatus: "Paid", approvedBy: "Temple Trustee", date: "2025-04-20", milestoneLinked: "M001" },
            { id: "E002", title: "Labor Payment - May", vendor: "Contractor Team", category: "Labor", amount: 800000, paidStatus: "Paid", approvedBy: "Project Manager", date: "2025-05-31", milestoneLinked: "M001" },
            { id: "E003", title: "Scaffolding Rental", vendor: "Equipment Rentals", category: "Equipment", amount: 150000, paidStatus: "Pending", date: "2025-07-01", milestoneLinked: "M002" },
        ],
        updates: [
            { id: "U001", type: "Progress", title: "Foundation Completed Successfully", content: "The foundation work for the Gopuram has been completed ahead of schedule with excellent quality.", photos: [], date: "2025-07-05", author: "Architect Krishnan", visibleToDevotees: true },
            { id: "U002", type: "Photo Gallery", title: "First Tier Progress Photos", content: "Progress photos of the first tier construction.", photos: [], date: "2025-11-15", author: "Site Engineer", visibleToDevotees: true },
        ],
        activityLog: [
            { id: "A001", event: "Project Created", description: "New Gopuram Construction project initiated", timestamp: "2025-03-01T10:00:00", user: "Admin", type: "status" },
            { id: "A002", event: "Donation Received", description: "₹1,00,000 received from Rajesh Kumar", timestamp: "2025-04-15T14:30:00", user: "System", type: "donation" },
            { id: "A003", event: "Milestone Completed", description: "Foundation Work completed", timestamp: "2025-07-01T09:00:00", user: "System", type: "milestone" },
        ],
        customFields: {
            overview: [
                { id: "CF001", name: "Archaeological Approval Number", type: "text", value: "ARCH-2025-TN-456" },
                { id: "CF002", name: "Heritage Committee Clearance", type: "file", value: "clearance.pdf" },
            ],
            funding: [
                { id: "CF003", name: "CSR Grant Reference", type: "text", value: "CSR-GOV-2025-123" },
                { id: "CF004", name: "Trust Fund Allocation", type: "number", value: "2000000" },
            ],
            expenses: [
                { id: "CF005", name: "Central PO Number", type: "text", value: "PO-2025-CONS-789" },
            ],
            updates: [],
        },
        createdAt: "2025-03-01T10:00:00",
        createdBy: "Temple Admin",
        lastUpdated: "2025-11-20T16:45:00",
    },
    {
        id: "PRJ-002",
        title: "Temple Pond Restoration",
        type: "Renovation",
        description: "Complete restoration and beautification of the sacred temple pond including water quality improvement.",
        startDate: "2025-01-15",
        endDate: "2025-08-31",
        priority: "Medium",
        status: "Active",
        manager: "Dr. Environmental Expert",
        goalAmount: 5000000,
        raisedAmount: 4200000,
        spentAmount: 2800000,
        completion: 65,
        minimumContribution: 500,
        suggestedSlabs: [500, 2000, 5000, 10000, 25000],
        showDonorNames: true,
        transparencyNote: "Funds used for eco-friendly restoration and water purification systems.",
        publicVisibility: true,
        milestones: [
            { id: "M004", title: "Pond Cleaning", targetDate: "2025-03-31", estimatedCost: 1000000, status: "Completed", photos: [], description: "Complete cleaning of pond" },
            { id: "M005", title: "Water Filtration System", targetDate: "2025-06-30", estimatedCost: 1500000, status: "In Progress", photos: [], description: "Installing modern filtration" },
        ],
        donations: [
            { id: "D004", donorName: "Mohan Rao", amount: 50000, date: "2025-02-10", anonymous: false, paymentMode: "Cash" },
        ],
        expenses: [
            { id: "E004", title: "Cleaning Equipment", vendor: "Clean Water Co", category: "Equipment", amount: 600000, paidStatus: "Paid", date: "2025-02-20" },
        ],
        updates: [],
        activityLog: [
            { id: "A004", event: "Project Created", description: "Temple Pond Restoration initiated", timestamp: "2025-01-15T11:00:00", user: "Admin", type: "status" },
        ],
        customFields: { overview: [], funding: [], expenses: [], updates: [] },
        createdAt: "2025-01-15T11:00:00",
        createdBy: "Temple Admin",
        lastUpdated: "2025-11-18T10:20:00",
    },
    {
        id: "PRJ-003",
        title: "Annadanam Hall Expansion",
        type: "Infrastructure",
        description: "Expanding the Annadanam (free food) hall to serve 5000 devotees daily.",
        startDate: "2026-01-01",
        endDate: "2026-06-30",
        priority: "High",
        status: "Draft",
        manager: "Civil Engineer Suresh",
        goalAmount: 8000000,
        raisedAmount: 500000,
        spentAmount: 0,
        completion: 0,
        minimumContribution: 1000,
        suggestedSlabs: [1000, 5000, 10000, 50000],
        showDonorNames: true,
        transparencyNote: "Supporting daily food service for devotees",
        publicVisibility: false,
        milestones: [],
        donations: [
            { id: "D005", donorName: "Corporate CSR", amount: 500000, date: "2025-12-01", anonymous: false, paymentMode: "Bank Transfer" },
        ],
        expenses: [],
        updates: [],
        activityLog: [
            { id: "A005", event: "Project Created", description: "Annadanam Hall Expansion planned", timestamp: "2025-11-01T09:00:00", user: "Admin", type: "status" },
        ],
        customFields: { overview: [], funding: [], expenses: [], updates: [] },
        createdAt: "2025-11-01T09:00:00",
        createdBy: "Temple Admin",
        lastUpdated: "2025-12-01T14:30:00",
    },
];

// Project Types
export const projectTypes = [
    "Construction",
    "Renovation",
    "Infrastructure",
    "Religious Program",
    "Community Service",
    "Other"
];

// Project Categories
export const projectCategories = [
    "Temple Infrastructure",
    "Deity & Worship",
    "Community Welfare",
    "Education & Knowledge",
    "Cultural & Heritage",
    "Environmental",
    "Administrative",
    "Other"
];

// Helper Functions
export const calculateBudgetVariance = (project: Project): number => {
    return ((project.spentAmount - project.goalAmount) / project.goalAmount) * 100;
};

export const calculateRemainingBudget = (project: Project): number => {
    return project.goalAmount - project.spentAmount;
};

export const getStatusColor = (status: Project["status"]): string => {
    const colors: Record<Project["status"], string> = {
        "Draft": "bg-gray-100 text-gray-700",
        "Active": "bg-blue-100 text-blue-700",
        "On Hold": "bg-amber-100 text-amber-700",
        "Completed": "bg-green-100 text-green-700",
        "Cancelled": "bg-red-100 text-red-700",
        "Archived": "bg-slate-100 text-slate-700",
    };
    return colors[status];
};

export const getPriorityColor = (priority: Project["priority"]): string => {
    const colors: Record<Project["priority"], string> = {
        "High": "text-red-600",
        "Medium": "text-amber-600",
        "Low": "text-green-600",
    };
    return colors[priority];
};
