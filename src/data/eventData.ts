// ==========================================
// EVENT MANAGEMENT MODULE - ENHANCED DATA LAYER
// Central coordination hub for all temple events
// ==========================================

import { eventRefs, eventMaterialAllocations, eventFreelancerAllocations, eventVolunteerAllocations, eventSecurityData, kitchenBatches, inventoryItems, freelancerRefs, templeStructures as structures } from "./templeData";
import { templeTasks } from "./taskData";

export { eventRefs, eventMaterialAllocations, eventFreelancerAllocations, eventVolunteerAllocations, eventSecurityData, kitchenBatches, inventoryItems, freelancerRefs, structures };

// Re-export temple tasks filtered for events
export const getEventTasks = (eventId: string) => templeTasks.filter(t => t.eventId === eventId);

// ---- ENHANCED EVENT ENTITY ----
export interface TempleEvent {
  id: string;
  name: string;
  type: "Festival" | "Special Pooja" | "Cultural" | "Fundraiser" | "Annadanam" | "Camp" | "Other" | "VIP" | "Public" | "Special Ritual";
  templeId: string;
  structureId: string;
  structureName: string;
  startDate: string;
  endDate: string;
  estimatedBudget: number;
  actualSpend: number;
  estimatedFootfall: string;
  description: string;
  status: "Published" | "Ongoing" | "Completed";
  organizer: string;
  capacity: number;
  linkedSeva?: string[];
  createdBy: string;
  createdAt: string;
  // Media
  bannerPreview?: string;
  imagePreviews?: string[];
  videoPreviews?: string[];
}

export const templeEvents: TempleEvent[] = [
  {
    id: "EVT-001", name: "Brahmotsavam 2026", type: "Festival", templeId: "TMP-001", structureId: "STR-001", structureName: "Main Temple",
    startDate: "2026-03-15", endDate: "2026-03-24", estimatedBudget: 5000000, actualSpend: 0, estimatedFootfall: "75,000",
    description: "10-day annual Brahmotsavam celebration with all major rituals, processions, and cultural programs.",
    status: "Published", organizer: "Sri Venkateshwara Temple Trust", capacity: 100000, linkedSeva: ["ES-005", "ES-006"],
    createdBy: "Temple Admin", createdAt: "2026-01-15",
  },
  {
    id: "EVT-002", name: "Vaikuntha Ekadasi", type: "Special Ritual", templeId: "TMP-001", structureId: "STR-001", structureName: "Main Temple",
    startDate: "2026-01-10", endDate: "2026-01-10", estimatedBudget: 800000, actualSpend: 785000, estimatedFootfall: "1,00,000",
    description: "Vaikuntha Dwara Darshanam – one of the most sacred days of the year.",
    status: "Completed", organizer: "Chief Priest Office", capacity: 150000, linkedSeva: [],
    createdBy: "Temple Admin", createdAt: "2025-12-01",
  },
  {
    id: "EVT-003", name: "Ugadi Festival", type: "Festival", templeId: "TMP-001", structureId: "STR-001", structureName: "Main Temple",
    startDate: "2026-03-28", endDate: "2026-03-30", estimatedBudget: 1200000, actualSpend: 0, estimatedFootfall: "50,000",
    description: "Telugu New Year celebrations with special puja, cultural events, and prasadam distribution.",
    status: "Published", organizer: "Cultural Committee", capacity: 75000, linkedSeva: [],
    createdBy: "Temple Admin", createdAt: "2026-02-01",
  },
  {
    id: "EVT-004", name: "Maha Shivaratri", type: "Special Ritual", templeId: "TMP-001", structureId: "STR-001", structureName: "Main Temple",
    startDate: "2026-02-15", endDate: "2026-02-15", estimatedBudget: 2500000, actualSpend: 1150000, estimatedFootfall: "80,000",
    description: "Night-long Shiva worship with Rudra Abhishekam, Maha Nyasa Purva, and all-night darshan.",
    status: "Ongoing", organizer: "Ritual Department", capacity: 120000, linkedSeva: ["ES-001", "ES-002", "ES-003", "ES-004"],
    createdBy: "Temple Admin", createdAt: "2026-01-20",
  },
  {
    id: "EVT-005", name: "Ratha Yatra", type: "Festival", templeId: "TMP-001", structureId: "STR-001", structureName: "Main Temple",
    startDate: "2026-04-10", endDate: "2026-04-10", estimatedBudget: 1500000, actualSpend: 0, estimatedFootfall: "60,000",
    description: "Grand chariot procession through the temple complex and surrounding streets.",
    status: "Published", organizer: "Festival Committee", capacity: 80000, linkedSeva: [],
    createdBy: "Temple Admin", createdAt: "2026-02-05",
  },
  {
    id: "EVT-006", name: "Annual Annadanam Drive", type: "Annadanam", templeId: "TMP-001", structureId: "STR-005", structureName: "Annadanam Hall",
    startDate: "2026-04-01", endDate: "2026-04-03", estimatedBudget: 600000, actualSpend: 0, estimatedFootfall: "50,000",
    description: "3-day mass feeding program serving 50,000+ devotees.",
    status: "Published", organizer: "Annadanam Team", capacity: 15000, linkedSeva: [],
    createdBy: "Temple Admin", createdAt: "2026-02-08",
  },
  {
    id: "EVT-007", name: "Classical Music Festival", type: "Cultural", templeId: "TMP-001", structureId: "STR-006", structureName: "Cultural Hall",
    startDate: "2026-05-01", endDate: "2026-05-03", estimatedBudget: 300000, actualSpend: 0, estimatedFootfall: "5,000",
    description: "3-evening Carnatic music festival featuring renowned artists.",
    status: "Published", organizer: "Cultural Affairs", capacity: 2000, linkedSeva: [],
    createdBy: "Temple Admin", createdAt: "2026-02-10",
  },
  {
    id: "EVT-008", name: "New Year Special Abhishekam", type: "Special Ritual", templeId: "TMP-001", structureId: "STR-001", structureName: "Main Temple",
    startDate: "2026-01-01", endDate: "2026-01-01", estimatedBudget: 200000, actualSpend: 195000, estimatedFootfall: "30,000",
    description: "New Year sunrise special Abhishekam with prasadam distribution.",
    status: "Completed", organizer: "Chief Priest Office", capacity: 50000, linkedSeva: [],
    createdBy: "Temple Admin", createdAt: "2025-12-15",
  },
];

// ---- EVENT SEVA ATTACHMENTS ----
export interface EventSeva {
  id: string;
  eventId: string;
  sevaName: string;
  sevaType: "Ritual" | "Darshan" | "Special";
  date: string;
  time: string;
  capacity: number;
  bookingRequired: boolean;
  priest: string;
  status: "Confirmed" | "Pending" | "Cancelled";
  conflict: boolean;
}

export const eventSevas: EventSeva[] = [
  { id: "ES-001", eventId: "EVT-004", sevaName: "Maha Rudra Abhishekam", sevaType: "Ritual", date: "2026-02-15", time: "04:00 AM", capacity: 200, bookingRequired: true, priest: "Sri Ramachandra Sharma", status: "Confirmed", conflict: false },
  { id: "ES-002", eventId: "EVT-004", sevaName: "Sahasranama Archana", sevaType: "Ritual", date: "2026-02-15", time: "06:00 AM", capacity: 300, bookingRequired: true, priest: "Sri Venkateshwara Dikshitar", status: "Confirmed", conflict: false },
  { id: "ES-003", eventId: "EVT-004", sevaName: "Special Night Darshan", sevaType: "Darshan", date: "2026-02-15", time: "08:00 PM", capacity: 5000, bookingRequired: true, priest: "N/A", status: "Confirmed", conflict: false },
  { id: "ES-004", eventId: "EVT-004", sevaName: "Extended Morning Darshan", sevaType: "Darshan", date: "2026-02-15", time: "05:00 AM", capacity: 8000, bookingRequired: false, priest: "N/A", status: "Pending", conflict: true },
  { id: "ES-005", eventId: "EVT-001", sevaName: "Suprabhatam", sevaType: "Ritual", date: "2026-03-15", time: "05:00 AM", capacity: 500, bookingRequired: true, priest: "Sri Gopala Bhatta", status: "Pending", conflict: false },
  { id: "ES-006", eventId: "EVT-001", sevaName: "Kalyanotsavam", sevaType: "Special", date: "2026-03-18", time: "09:00 AM", capacity: 1000, bookingRequired: true, priest: "Sri Ramachandra Sharma", status: "Pending", conflict: false },
];

// ---- EVENT EXPENSES ----
export interface EventExpense {
  id: string;
  eventId: string;
  eventName: string;
  category: "Freelancer Payment" | "Material Cost" | "Kitchen Cost" | "Miscellaneous" | "Decoration" | "Sound & Lighting" | "Transportation" | "Donations Refund";
  description: string;
  amount: number;
  vendor: string;
  date: string;
  status: "Paid" | "Pending" | "Approved" | "Rejected";
  linkedModule?: string;
  linkedId?: string;
}

export const eventExpenses: EventExpense[] = [
  { id: "EXP-001", eventId: "EVT-004", eventName: "Maha Shivaratri", category: "Freelancer Payment", description: "Event Photography & Videography", amount: 25000, vendor: "Pixel Studio", date: "2026-02-15", status: "Approved", linkedModule: "Freelancer", linkedId: "FRL-0001" },
  { id: "EXP-002", eventId: "EVT-004", eventName: "Maha Shivaratri", category: "Sound & Lighting", description: "PA System & Live Stream Setup", amount: 18000, vendor: "Sound Waves Pro", date: "2026-02-15", status: "Approved", linkedModule: "Freelancer", linkedId: "FRL-0003" },
  { id: "EXP-003", eventId: "EVT-004", eventName: "Maha Shivaratri", category: "Decoration", description: "Festival Decoration & Mandap", amount: 45000, vendor: "Decor Dreams", date: "2026-02-14", status: "Pending", linkedModule: "Freelancer", linkedId: "FRL-0002" },
  { id: "EXP-004", eventId: "EVT-004", eventName: "Maha Shivaratri", category: "Sound & Lighting", description: "Festival Lighting Setup", amount: 28000, vendor: "Heritage Electricals", date: "2026-02-14", status: "Pending", linkedModule: "Freelancer", linkedId: "FRL-0007" },
  { id: "EXP-005", eventId: "EVT-004", eventName: "Maha Shivaratri", category: "Material Cost", description: "Flowers & Garlands – 500 pcs Jasmine + 50kg Rose", amount: 52500, vendor: "Sri Lakshmi Flowers", date: "2026-02-13", status: "Paid", linkedModule: "Inventory", linkedId: "REQ-001" },
  { id: "EXP-006", eventId: "EVT-004", eventName: "Maha Shivaratri", category: "Material Cost", description: "Ghee – 200L procurement", amount: 120000, vendor: "Nandi Oil & Ghee", date: "2026-02-12", status: "Paid", linkedModule: "Inventory", linkedId: "PO-2026-010" },
  { id: "EXP-007", eventId: "EVT-004", eventName: "Maha Shivaratri", category: "Kitchen Cost", description: "Annadanam Ingredients – 10,000 meals", amount: 180000, vendor: "Multiple Suppliers", date: "2026-02-14", status: "Approved", linkedModule: "Kitchen", linkedId: "BTH-2026-0888" },
  { id: "EXP-008", eventId: "EVT-004", eventName: "Maha Shivaratri", category: "Miscellaneous", description: "Police coordination & barricade rental", amount: 35000, vendor: "Local Authority", date: "2026-02-13", status: "Paid" },
  { id: "EXP-009", eventId: "EVT-004", eventName: "Maha Shivaratri", category: "Transportation", description: "Volunteer bus transport", amount: 15000, vendor: "City Bus Services", date: "2026-02-15", status: "Pending" },
  { id: "EXP-010", eventId: "EVT-002", eventName: "Vaikuntha Ekadasi", category: "Freelancer Payment", description: "Photography coverage", amount: 20000, vendor: "Pixel Studio", date: "2026-01-10", status: "Paid" },
  { id: "EXP-011", eventId: "EVT-002", eventName: "Vaikuntha Ekadasi", category: "Material Cost", description: "Pooja materials bulk order", amount: 85000, vendor: "Shiva Pooja Stores", date: "2026-01-08", status: "Paid" },
  { id: "EXP-012", eventId: "EVT-002", eventName: "Vaikuntha Ekadasi", category: "Kitchen Cost", description: "Prasadam & Annadanam", amount: 350000, vendor: "Multiple", date: "2026-01-10", status: "Paid" },
  { id: "EXP-013", eventId: "EVT-002", eventName: "Vaikuntha Ekadasi", category: "Decoration", description: "Temple decoration", amount: 120000, vendor: "Decor Dreams", date: "2026-01-09", status: "Paid" },
  { id: "EXP-014", eventId: "EVT-002", eventName: "Vaikuntha Ekadasi", category: "Miscellaneous", description: "Security & logistics", amount: 45000, vendor: "Various", date: "2026-01-10", status: "Paid" },
];

// ---- EVENT KITCHEN LINKS ----
export interface EventKitchenLink {
  id: string;
  eventId: string;
  estimatedBeneficiaries: number;
  menu: string;
  annadanamId?: string;
  linkedBatchIds: string[];
  ingredientRequestStatus: "Pending" | "Raised" | "Fulfilled";
}

export const eventKitchenLinks: EventKitchenLink[] = [
  {
    id: "EKL-001", eventId: "EVT-004", estimatedBeneficiaries: 80000, menu: "Laddu Prasadam, Pulihora, Annadanam Meals (10,000/day)",
    annadanamId: "ANN-004", linkedBatchIds: ["BTH-2026-0888"], ingredientRequestStatus: "Raised",
  },
  {
    id: "EKL-002", eventId: "EVT-001", estimatedBeneficiaries: 500000, menu: "Full Prasadam Set + Annadanam (50,000/day for 10 days)",
    annadanamId: "ANN-001", linkedBatchIds: [], ingredientRequestStatus: "Pending",
  },
];

// ---- EVENT TEMPLATES ----
export interface EventTemplate {
  id: string;
  name: string;
  type: TempleEvent["type"];
  description: string;
  defaultBannerImage?: string;
  // Seva Setup
  enableSevaBooking: boolean;
  attachedSevas: string[];
  defaultPricing?: Record<string, number>;
  slotStructure?: string;
  // Donation Setup
  enableDonations: boolean;
  donationEightyGType?: "80G" | "Non-80G";
  suggestedDonationGoal?: number;
  minimumDonationAmount?: number;
  transparencyNote?: string;
  // Resource Preset
  defaultPriests: string[];
  defaultFreelancers: string[];
  volunteersRequired: string[];
  equipmentNeeded: string[];
  hallAllocation?: string;
  // Estimated Expenses
  estDecorationCost?: number;
  estPriestPayment?: number;
  estFoodCost?: number;
  estMiscellaneous?: number;
  // System
  usageCount: number;
  lastUsedDate?: string;
  createdAt: string;
  createdBy: string;
}

export const eventTemplates: EventTemplate[] = [
  {
    id: "TPL-001",
    name: "Major Festival Template",
    type: "Festival",
    description: "Complete festival setup with all departments — 7-10 day duration",
    enableSevaBooking: true,
    attachedSevas: ["Suprabhatam", "Abhishekam", "Kalyanotsavam", "Special Darshan"],
    enableDonations: true,
    donationEightyGType: "80G",
    suggestedDonationGoal: 2000000,
    minimumDonationAmount: 100,
    defaultPriests: ["Sri Ramachandra Sharma"],
    defaultFreelancers: ["Photography", "Decoration", "Sound System"],
    volunteersRequired: ["Crowd Control", "Kitchen Assistants", "Ritual Support"],
    equipmentNeeded: ["PA System", "Lighting", "Decoration Materials"],
    hallAllocation: "Main Temple",
    estDecorationCost: 450000,
    estPriestPayment: 50000,
    estFoodCost: 300000,
    estMiscellaneous: 200000,
    usageCount: 3,
    lastUsedDate: "2024-02-01",
    createdAt: "2024-01-15",
    createdBy: "Temple Admin",
  },
  {
    id: "TPL-002",
    name: "Single Day Special Pooja",
    type: "Special Pooja",
    description: "One-day ritual event with extended darshan and prasadam",
    enableSevaBooking: true,
    attachedSevas: ["Abhishekam", "Special Darshan"],
    enableDonations: false,
    defaultPriests: ["Sri Venkateshwara Dikshitar"],
    defaultFreelancers: ["Photography", "Sound System"],
    volunteersRequired: ["Ritual Support", "Prasadam Distribution"],
    equipmentNeeded: ["Sound System", "Pooja Materials"],
    estDecorationCost: 50000,
    estPriestPayment: 20000,
    estFoodCost: 100000,
    estMiscellaneous: 30000,
    usageCount: 5,
    lastUsedDate: "2024-02-10",
    createdAt: "2024-01-10",
    createdBy: "Temple Admin",
  },
  {
    id: "TPL-003",
    name: "Annadanam Drive",
    type: "Annadanam",
    description: "Mass feeding program with kitchen batch planning",
    enableSevaBooking: false,
    attachedSevas: [],
    enableDonations: true,
    donationEightyGType: "Non-80G",
    suggestedDonationGoal: 500000,
    minimumDonationAmount: 50,
    transparencyNote: "Donations will be used for procuring ingredients and serving meals to devotees",
    defaultPriests: [],
    defaultFreelancers: [],
    volunteersRequired: ["Kitchen Assistants", "Crowd Control", "Serving"],
    equipmentNeeded: ["Cooking Utensils", "Serving Counters"],
    hallAllocation: "Annadanam Hall",
    estDecorationCost: 0,
    estPriestPayment: 0,
    estFoodCost: 400000,
    estMiscellaneous: 50000,
    usageCount: 4,
    lastUsedDate: "2024-02-05",
    createdAt: "2024-01-20",
    createdBy: "Temple Admin",
  },
  {
    id: "TPL-004",
    name: "Cultural Event",
    type: "Cultural",
    description: "Music/dance festival in Cultural Hall",
    enableSevaBooking: false,
    attachedSevas: [],
    enableDonations: false,
    defaultPriests: [],
    defaultFreelancers: ["Sound System", "Lighting", "Photography"],
    volunteersRequired: ["Stage Management", "Crowd Control"],
    equipmentNeeded: ["Stage Setup", "Audio Equipment", "Lighting"],
    hallAllocation: "Cultural Hall",
    estDecorationCost: 80000,
    estPriestPayment: 0,
    estFoodCost: 50000,
    estMiscellaneous: 70000,
    usageCount: 2,
    lastUsedDate: "2024-01-25",
    createdAt: "2024-01-05",
    createdBy: "Temple Admin",
  },
];

// ---- DROPDOWN OPTIONS ----
export const eventTypes: TempleEvent["type"][] = ["Festival", "Special Pooja", "Cultural", "Fundraiser", "Annadanam", "Camp", "Other", "VIP", "Public", "Special Ritual"];
export const eventStatuses: TempleEvent["status"][] = ["Published", "Ongoing", "Completed"];
export const expenseCategories: EventExpense["category"][] = ["Freelancer Payment", "Material Cost", "Kitchen Cost", "Miscellaneous", "Decoration", "Sound & Lighting", "Transportation", "Donations Refund"];

// ---- HELPER FUNCTIONS ----
export const getEventById = (id: string) => templeEvents.find(e => e.id === id);
export const getEventExpenses = (eventId: string) => eventExpenses.filter(e => e.eventId === eventId);
export const getEventSevas = (eventId: string) => eventSevas.filter(s => s.eventId === eventId);
export const getEventMaterials = (eventId: string) => eventMaterialAllocations.filter(m => m.eventId === eventId);
export const getEventFreelancers = (eventId: string) => eventFreelancerAllocations.filter(f => f.eventId === eventId);
export const getEventVolunteers = (eventId: string) => eventVolunteerAllocations.filter(v => v.eventId === eventId);
export const getEventKitchenLinks = (eventId: string) => eventKitchenLinks.filter(k => k.eventId === eventId);
export const getEventBatches = (eventId: string) => kitchenBatches.filter(b => b.eventId === eventId);

// ==========================================
// EVENT RESOURCES - NEW MODULE
// ==========================================

// ---- EVENT RESOURCE ALLOCATION ----
export interface EventResource {
  id: string;
  eventId: string;
  resourceType: "Material" | "Personnel" | "Infrastructure";
  resourceName: string;
  requiredQuantity: number;
  allocatedQuantity: number;
  unit: string;
  status: "Available" | "Partial" | "Conflict" | "Pending";
  linkedModule?: "Inventory" | "Freelancer" | "Volunteer" | "Infrastructure";
  linkedId?: string;
  notes?: string;
}

export const eventResources: EventResource[] = [
  // Maha Shivaratri Resources
  { id: "RES-001", eventId: "EVT-004", resourceType: "Material", resourceName: "Jasmine Flowers", requiredQuantity: 500, allocatedQuantity: 500, unit: "kg", status: "Available", linkedModule: "Inventory", linkedId: "INV-101" },
  { id: "RES-002", eventId: "EVT-004", resourceType: "Material", resourceName: "Ghee", requiredQuantity: 200, allocatedQuantity: 200, unit: "L", status: "Available", linkedModule: "Inventory", linkedId: "PO-2026-010" },
  { id: "RES-003", eventId: "EVT-004", resourceType: "Personnel", resourceName: "Photographer", requiredQuantity: 2, allocatedQuantity: 2, unit: "persons", status: "Available", linkedModule: "Freelancer", linkedId: "FRL-0001" },
  { id: "RES-004", eventId: "EVT-004", resourceType: "Infrastructure", resourceName: "Sound System", requiredQuantity: 1, allocatedQuantity: 1, unit: "set", status: "Available", linkedModule: "Infrastructure", linkedId: "INFRA-SS-01" },
  { id: "RES-005", eventId: "EVT-004", resourceType: "Personnel", resourceName: "Volunteers", requiredQuantity: 100, allocatedQuantity: 85, unit: "persons", status: "Partial", linkedModule: "Volunteer" },

  // Brahmotsavam Resources
  { id: "RES-006", eventId: "EVT-001", resourceType: "Material", resourceName: "Rose Petals", requiredQuantity: 1000, allocatedQuantity: 600, unit: "kg", status: "Partial", linkedModule: "Inventory" },
  { id: "RES-007", eventId: "EVT-001", resourceType: "Infrastructure", resourceName: "Lighting Equipment", requiredQuantity: 3, allocatedQuantity: 3, unit: "sets", status: "Available", linkedModule: "Infrastructure", linkedId: "INFRA-LT-01" },
  { id: "RES-008", eventId: "EVT-001", resourceType: "Personnel", resourceName: "Decorators", requiredQuantity: 10, allocatedQuantity: 10, unit: "persons", status: "Available", linkedModule: "Freelancer", linkedId: "FRL-0002" },

  // Calendar Conflict - Same sound system booked
  { id: "RES-009", eventId: "EVT-007", resourceType: "Infrastructure", resourceName: "Sound System", requiredQuantity: 1, allocatedQuantity: 0, unit: "set", status: "Conflict", linkedModule: "Infrastructure", linkedId: "INFRA-SS-01", notes: "Already booked for another event" },
];

// ---- RESOURCE CONFLICTS ----
export interface ResourceConflict {
  id: string;
  conflictType: "Structure" | "Resource" | "Personnel" | "Infrastructure";
  eventId1: string;
  eventId2: string;
  resourceId?: string;
  structureId?: string;
  conflictDescription: string;
  severity: "High" | "Medium" | "Low";
  resolved: boolean;
}

export const resourceConflicts: ResourceConflict[] = [
  {
    id: "CONF-001",
    conflictType: "Infrastructure",
    eventId1: "EVT-004",
    eventId2: "EVT-007",
    resourceId: "INFRA-SS-01",
    conflictDescription: "Sound System INFRA-SS-01 double-booked between Maha Shivaratri and Classical Music Festival",
    severity: "High",
    resolved: false,
  },
];

// ---- CAPACITY ALERTS ----
export interface CapacityAlert {
  eventId: string;
  eventName: string;
  capacity: number;
  estimatedAttendance: number;
  utilizationPercent: number;
  alertLevel: "Normal" | "Warning" | "Critical";
  message: string;
}

// ---- CONFLICT DETECTION HELPERS ----

/**
 * Check if a structure has conflicting events for given date range
 */
export const checkStructureConflict = (
  structureId: string,
  startDate: string,
  endDate: string,
  excludeEventId?: string
): boolean => {
  const conflicts = templeEvents.filter(event => {
    if (excludeEventId && event.id === excludeEventId) return false;
    if (event.structureId !== structureId) return false;
    // Check date overlap
    return !(endDate < event.startDate || startDate > event.endDate);
  });
  return conflicts.length > 0;
};

/**
 * Get list of conflicting events for a given structure and date range
 */
export const getConflictingEvents = (
  structureId: string,
  startDate: string,
  endDate: string,
  excludeEventId?: string
): TempleEvent[] => {
  return templeEvents.filter(event => {
    if (excludeEventId && event.id === excludeEventId) return false;
    if (event.structureId !== structureId) return false;
    if (event.status === "Completed") return false;
    // Check date overlap
    return !(endDate < event.startDate || startDate > event.endDate);
  });
};

/**
 * Get capacity alerts for events
 */
export const getCapacityAlerts = (eventId?: string): CapacityAlert[] => {
  const eventsToCheck = eventId ? templeEvents.filter(e => e.id === eventId) : templeEvents;

  return eventsToCheck.map(event => {
    const estimatedAttendance = parseInt(event.estimatedFootfall.replace(/,/g, '')) || 0;
    const utilizationPercent = event.capacity > 0 ? (estimatedAttendance / event.capacity) * 100 : 0;

    let alertLevel: CapacityAlert["alertLevel"] = "Normal";
    let message = "Capacity within normal limits";

    if (utilizationPercent >= 100) {
      alertLevel = "Critical";
      message = `Capacity exceeded! Expected ${estimatedAttendance.toLocaleString()} attendees but capacity is ${event.capacity.toLocaleString()}`;
    } else if (utilizationPercent >= 80) {
      alertLevel = "Warning";
      message = `Nearing capacity (${utilizationPercent.toFixed(0)}% full)`;
    }

    return {
      eventId: event.id,
      eventName: event.name,
      capacity: event.capacity,
      estimatedAttendance,
      utilizationPercent,
      alertLevel,
      message,
    };
  }).filter(alert => alert.alertLevel !== "Normal");
};

/**
 * Get resource allocation for specific event
 */
export const getResourceAllocation = (eventId: string): EventResource[] => {
  return eventResources.filter(r => r.eventId === eventId);
};

/**
 * Detect resource conflicts for specific event
 */
export const detectResourceConflicts = (eventId: string): ResourceConflict[] => {
  return resourceConflicts.filter(c =>
    (c.eventId1 === eventId || c.eventId2 === eventId) && !c.resolved
  );
};

/**
 * Get all unresolved conflicts across all events
 */
export const getAllActiveConflicts = (): ResourceConflict[] => {
  return resourceConflicts.filter(c => !c.resolved);
};
