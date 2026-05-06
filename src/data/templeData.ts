// ==========================================
// TEMPLE RESOURCE & INVENTORY INTEGRATED SYSTEM
// Centralized Data Store
// ==========================================

// ---- INVENTORY / STOCK ----
export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  unit: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  supplier: string;
  lastPOId: string;
  lastRestocked: string;
  pricePerUnit: number;
  structureLinked: string;
  status: "In Stock" | "Low Stock" | "Out of Stock" | "Ordered";
}

export const inventoryItems: InventoryItem[] = [
  { id: "INV-001", name: "Rice (Sona Masuri)", category: "Grocery", unit: "kg", currentStock: 850, minStock: 200, maxStock: 2000, supplier: "Annapurna Grocery", lastPOId: "PO-2026-002", lastRestocked: "2026-02-08", pricePerUnit: 55, structureLinked: "Kitchen", status: "In Stock" },
  { id: "INV-002", name: "Ghee (Cow)", category: "Oil & Ghee", unit: "ltr", currentStock: 45, minStock: 50, maxStock: 200, supplier: "Nandi Oil & Ghee", lastPOId: "PO-2026-003", lastRestocked: "2026-02-05", pricePerUnit: 600, structureLinked: "Kitchen", status: "Low Stock" },
  { id: "INV-003", name: "Sugar", category: "Grocery", unit: "kg", currentStock: 320, minStock: 100, maxStock: 800, supplier: "Annapurna Grocery", lastPOId: "PO-2026-002", lastRestocked: "2026-02-08", pricePerUnit: 45, structureLinked: "Kitchen", status: "In Stock" },
  { id: "INV-004", name: "Besan (Gram Flour)", category: "Grocery", unit: "kg", currentStock: 180, minStock: 50, maxStock: 500, supplier: "Annapurna Grocery", lastPOId: "PO-2026-002", lastRestocked: "2026-02-07", pricePerUnit: 80, structureLinked: "Kitchen", status: "In Stock" },
  { id: "INV-005", name: "Rose Petals", category: "Flowers", unit: "kg", currentStock: 25, minStock: 10, maxStock: 100, supplier: "Sri Lakshmi Flowers", lastPOId: "PO-2026-001", lastRestocked: "2026-02-09", pricePerUnit: 500, structureLinked: "Main Temple", status: "In Stock" },
  { id: "INV-006", name: "Jasmine Garlands", category: "Flowers", unit: "pcs", currentStock: 120, minStock: 50, maxStock: 500, supplier: "Sri Lakshmi Flowers", lastPOId: "PO-2026-001", lastRestocked: "2026-02-09", pricePerUnit: 80, structureLinked: "Main Temple", status: "In Stock" },
  { id: "INV-007", name: "Camphor", category: "Pooja Materials", unit: "kg", currentStock: 8, minStock: 5, maxStock: 30, supplier: "Shiva Pooja Stores", lastPOId: "PO-2026-004", lastRestocked: "2026-02-09", pricePerUnit: 800, structureLinked: "Main Temple", status: "In Stock" },
  { id: "INV-008", name: "Kumkum", category: "Pooja Materials", unit: "kg", currentStock: 5, minStock: 3, maxStock: 15, supplier: "Shiva Pooja Stores", lastPOId: "PO-2026-004", lastRestocked: "2026-02-09", pricePerUnit: 400, structureLinked: "Main Temple", status: "In Stock" },
  { id: "INV-009", name: "Incense Sticks", category: "Pooja Materials", unit: "pkt", currentStock: 200, minStock: 50, maxStock: 500, supplier: "Shiva Pooja Stores", lastPOId: "PO-2026-004", lastRestocked: "2026-02-09", pricePerUnit: 30, structureLinked: "Main Temple", status: "In Stock" },
  { id: "INV-010", name: "Toor Dal", category: "Grocery", unit: "kg", currentStock: 120, minStock: 50, maxStock: 300, supplier: "Annapurna Grocery", lastPOId: "PO-2026-002", lastRestocked: "2026-02-08", pricePerUnit: 120, structureLinked: "Kitchen", status: "In Stock" },
  { id: "INV-011", name: "Sesame Oil", category: "Oil & Ghee", unit: "ltr", currentStock: 30, minStock: 20, maxStock: 100, supplier: "Nandi Oil & Ghee", lastPOId: "PO-2026-003", lastRestocked: "2026-02-05", pricePerUnit: 350, structureLinked: "Kitchen", status: "In Stock" },
  { id: "INV-012", name: "Cashew Nuts", category: "Dry Fruits", unit: "kg", currentStock: 15, minStock: 10, maxStock: 50, supplier: "Annapurna Grocery", lastPOId: "PO-2026-002", lastRestocked: "2026-02-08", pricePerUnit: 900, structureLinked: "Kitchen", status: "In Stock" },
  { id: "INV-013", name: "Milk (Full Cream)", category: "Milk & Dairy", unit: "ltr", currentStock: 80, minStock: 50, maxStock: 200, supplier: "Surya Milk Dairy", lastPOId: "PO-2026-006", lastRestocked: "2026-02-09", pricePerUnit: 60, structureLinked: "Kitchen", status: "In Stock" },
  { id: "INV-014", name: "Flower Arrangement", category: "Decoration", unit: "pcs", currentStock: 3, minStock: 2, maxStock: 20, supplier: "Devi Decorations", lastPOId: "PO-2026-005", lastRestocked: "2026-02-07", pricePerUnit: 2000, structureLinked: "Main Temple", status: "In Stock" },
  { id: "INV-015", name: "Coconut", category: "Pooja Materials", unit: "pcs", currentStock: 350, minStock: 100, maxStock: 1000, supplier: "Shiva Pooja Stores", lastPOId: "PO-2026-004", lastRestocked: "2026-02-09", pricePerUnit: 35, structureLinked: "Main Temple", status: "In Stock" },
  { id: "INV-016", name: "Banana", category: "Fruits", unit: "dozen", currentStock: 60, minStock: 20, maxStock: 200, supplier: "Annapurna Grocery", lastPOId: "", lastRestocked: "2026-02-09", pricePerUnit: 50, structureLinked: "Main Temple", status: "In Stock" },
];

// ---- RECIPES (Prasadam → Inventory mapping) ----
export interface RecipeItem {
  inventoryId: string;
  inventoryName: string;
  qtyPerUnit: number; // qty needed per 1000 units of prasadam
  unit: string;
}

export interface Recipe {
  prasadamName: string;
  items: RecipeItem[];
}

export const recipes: Recipe[] = [
  {
    prasadamName: "Laddu Prasadam",
    items: [
      { inventoryId: "INV-004", inventoryName: "Besan (Gram Flour)", qtyPerUnit: 25, unit: "kg" },
      { inventoryId: "INV-003", inventoryName: "Sugar", qtyPerUnit: 20, unit: "kg" },
      { inventoryId: "INV-002", inventoryName: "Ghee (Cow)", qtyPerUnit: 12, unit: "ltr" },
      { inventoryId: "INV-012", inventoryName: "Cashew Nuts", qtyPerUnit: 2, unit: "kg" },
    ],
  },
  {
    prasadamName: "Pulihora",
    items: [
      { inventoryId: "INV-001", inventoryName: "Rice (Sona Masuri)", qtyPerUnit: 30, unit: "kg" },
      { inventoryId: "INV-011", inventoryName: "Sesame Oil", qtyPerUnit: 5, unit: "ltr" },
    ],
  },
  {
    prasadamName: "Sweet Pongal",
    items: [
      { inventoryId: "INV-001", inventoryName: "Rice (Sona Masuri)", qtyPerUnit: 20, unit: "kg" },
      { inventoryId: "INV-010", inventoryName: "Toor Dal", qtyPerUnit: 10, unit: "kg" },
      { inventoryId: "INV-002", inventoryName: "Ghee (Cow)", qtyPerUnit: 8, unit: "ltr" },
      { inventoryId: "INV-012", inventoryName: "Cashew Nuts", qtyPerUnit: 1.5, unit: "kg" },
    ],
  },
  {
    prasadamName: "Annadanam Meals",
    items: [
      { inventoryId: "INV-001", inventoryName: "Rice (Sona Masuri)", qtyPerUnit: 50, unit: "kg" },
      { inventoryId: "INV-010", inventoryName: "Toor Dal", qtyPerUnit: 15, unit: "kg" },
      { inventoryId: "INV-002", inventoryName: "Ghee (Cow)", qtyPerUnit: 5, unit: "ltr" },
      { inventoryId: "INV-011", inventoryName: "Sesame Oil", qtyPerUnit: 8, unit: "ltr" },
    ],
  },
];

// ---- OFFERINGS → MATERIAL CONSUMPTION ----
export interface OfferingMaterial {
  offeringName: string;
  offeringType: "Ritual" | "Darshan";
  structure: string;
  materialsPerSlot: { inventoryId: string; inventoryName: string; qty: number; unit: string }[];
}

export const offeringMaterials: OfferingMaterial[] = [
  {
    offeringName: "Suprabhatam", offeringType: "Ritual", structure: "Main Temple",
    materialsPerSlot: [
      { inventoryId: "INV-005", inventoryName: "Rose Petals", qty: 0.5, unit: "kg" },
      { inventoryId: "INV-006", inventoryName: "Jasmine Garlands", qty: 5, unit: "pcs" },
      { inventoryId: "INV-007", inventoryName: "Camphor", qty: 0.1, unit: "kg" },
      { inventoryId: "INV-009", inventoryName: "Incense Sticks", qty: 2, unit: "pkt" },
    ],
  },
  {
    offeringName: "Archana", offeringType: "Ritual", structure: "Padmavathi Shrine",
    materialsPerSlot: [
      { inventoryId: "INV-008", inventoryName: "Kumkum", qty: 0.05, unit: "kg" },
      { inventoryId: "INV-015", inventoryName: "Coconut", qty: 5, unit: "pcs" },
      { inventoryId: "INV-016", inventoryName: "Banana", qty: 2, unit: "dozen" },
      { inventoryId: "INV-009", inventoryName: "Incense Sticks", qty: 1, unit: "pkt" },
    ],
  },
  {
    offeringName: "Abhishekam", offeringType: "Ritual", structure: "Main Temple",
    materialsPerSlot: [
      { inventoryId: "INV-013", inventoryName: "Milk (Full Cream)", qty: 5, unit: "ltr" },
      { inventoryId: "INV-005", inventoryName: "Rose Petals", qty: 1, unit: "kg" },
      { inventoryId: "INV-007", inventoryName: "Camphor", qty: 0.2, unit: "kg" },
      { inventoryId: "INV-015", inventoryName: "Coconut", qty: 10, unit: "pcs" },
      { inventoryId: "INV-006", inventoryName: "Jasmine Garlands", qty: 10, unit: "pcs" },
    ],
  },
  {
    offeringName: "Morning Darshan", offeringType: "Darshan", structure: "Main Temple",
    materialsPerSlot: [
      { inventoryId: "INV-006", inventoryName: "Jasmine Garlands", qty: 20, unit: "pcs" },
      { inventoryId: "INV-007", inventoryName: "Camphor", qty: 0.3, unit: "kg" },
      { inventoryId: "INV-009", inventoryName: "Incense Sticks", qty: 5, unit: "pkt" },
    ],
  },
];

// ---- FREELANCERS (Shared Reference) ----
export interface FreelancerRef {
  id: string;
  businessName: string;
  serviceCategories: string[];
  contactPerson: string;
  mobile: string;
  rating: number;
  status: string;
  pricingModel: string;
  availability: string;
}

export const freelancerRefs: FreelancerRef[] = [
  { id: "FRL-0001", businessName: "Pixel Studio", serviceCategories: ["Photography", "Videography"], contactPerson: "Rajesh Kumar", mobile: "+91 98765 43210", rating: 4.8, status: "Active", pricingModel: "Per Event", availability: "Weekends" },
  { id: "FRL-0002", businessName: "Decor Dreams", serviceCategories: ["Decoration", "Floral Arrangement"], contactPerson: "Sunita Patel", mobile: "+91 87654 32109", rating: 4.5, status: "Active", pricingModel: "Per Event", availability: "Festival Only" },
  { id: "FRL-0003", businessName: "Sound Waves Pro", serviceCategories: ["Sound Engineering", "Live Streaming"], contactPerson: "Karthik Menon", mobile: "+91 76543 21098", rating: 4.9, status: "Active", pricingModel: "Per Day", availability: "Weekdays" },
  { id: "FRL-0004", businessName: "CreativeMinds Design", serviceCategories: ["Graphic Design", "Print Design"], contactPerson: "Ananya Desai", mobile: "+91 65432 10987", rating: 4.3, status: "Active", pricingModel: "Per Hour", availability: "Weekdays" },
  { id: "FRL-0005", businessName: "Vastu Consultancy", serviceCategories: ["Consulting"], contactPerson: "Dr. Mohan Rao", mobile: "+91 54321 09876", rating: 4.7, status: "Active", pricingModel: "Custom", availability: "Weekdays" },
  { id: "FRL-0006", businessName: "Digital Stream Co", serviceCategories: ["Live Streaming", "Videography"], contactPerson: "Pradeep Singh", mobile: "+91 43210 98765", rating: 3.8, status: "Active", pricingModel: "Per Event", availability: "Weekends" },
  { id: "FRL-0007", businessName: "Heritage Electricals", serviceCategories: ["Electrical Work", "Lighting"], contactPerson: "Suresh Babu", mobile: "+91 32109 87654", rating: 4.6, status: "Active", pricingModel: "Per Event", availability: "Festival Only" },
  { id: "FRL-0008", businessName: "Akash Catering", serviceCategories: ["Catering"], contactPerson: "Ravi Shankar", mobile: "+91 21098 76543", rating: 4.2, status: "Inactive", pricingModel: "Per Day", availability: "Festival Only" },
];

// ---- EVENTS (Shared Reference) ----
export interface EventRef {
  id: string;
  name: string;
  type: string;
  structure: string;
  startDate: string;
  endDate: string;
  footfall: string;
  status: string;
}

export const eventRefs: EventRef[] = [
  { id: "EVT-001", name: "Brahmotsavam 2026", type: "Festival", structure: "Main Temple", startDate: "2026-03-15", endDate: "2026-03-24", footfall: "75,000", status: "Planned" },
  { id: "EVT-002", name: "Vaikuntha Ekadasi", type: "Special Ritual", structure: "Main Temple", startDate: "2026-01-10", endDate: "2026-01-10", footfall: "1,00,000", status: "Closed" },
  { id: "EVT-003", name: "Ugadi Festival", type: "Festival", structure: "Main Temple", startDate: "2026-03-28", endDate: "2026-03-30", footfall: "50,000", status: "Planned" },
  { id: "EVT-004", name: "Maha Shivaratri", type: "Special Ritual", structure: "Main Temple", startDate: "2026-02-15", endDate: "2026-02-15", footfall: "80,000", status: "Approved" },
  { id: "EVT-005", name: "Ratha Yatra", type: "Festival", structure: "Main Temple", startDate: "2026-04-10", endDate: "2026-04-10", footfall: "60,000", status: "Draft" },
];

// ---- EVENT RESOURCE ALLOCATIONS ----
export interface EventMaterialAllocation {
  eventId: string;
  inventoryId: string;
  inventoryName: string;
  requiredQty: number;
  allocatedQty: number;
  unit: string;
  source: "Stock" | "PO Pending" | "Ordered";
  poId?: string;
}

export const eventMaterialAllocations: EventMaterialAllocation[] = [
  { eventId: "EVT-004", inventoryId: "INV-005", inventoryName: "Rose Petals", requiredQty: 50, allocatedQty: 25, unit: "kg", source: "Stock" },
  { eventId: "EVT-004", inventoryId: "INV-006", inventoryName: "Jasmine Garlands", requiredQty: 500, allocatedQty: 120, unit: "pcs", source: "Stock" },
  { eventId: "EVT-004", inventoryId: "INV-007", inventoryName: "Camphor", requiredQty: 10, allocatedQty: 8, unit: "kg", source: "Stock" },
  { eventId: "EVT-004", inventoryId: "INV-001", inventoryName: "Rice (Sona Masuri)", requiredQty: 2000, allocatedQty: 850, unit: "kg", source: "Stock" },
  { eventId: "EVT-004", inventoryId: "INV-002", inventoryName: "Ghee (Cow)", requiredQty: 200, allocatedQty: 45, unit: "ltr", source: "PO Pending" },
  { eventId: "EVT-004", inventoryId: "INV-014", inventoryName: "Flower Arrangement", requiredQty: 15, allocatedQty: 3, unit: "pcs", source: "PO Pending" },
  { eventId: "EVT-001", inventoryId: "INV-005", inventoryName: "Rose Petals", requiredQty: 200, allocatedQty: 0, unit: "kg", source: "PO Pending" },
  { eventId: "EVT-001", inventoryId: "INV-001", inventoryName: "Rice (Sona Masuri)", requiredQty: 10000, allocatedQty: 0, unit: "kg", source: "PO Pending" },
];

export interface EventFreelancerAllocation {
  eventId: string;
  freelancerId: string;
  freelancerName: string;
  role: string;
  dates: string;
  agreedPayment: number;
  status: "Assigned" | "Confirmed" | "Completed" | "Cancelled";
  taskId?: string;
}

export const eventFreelancerAllocations: EventFreelancerAllocation[] = [
  { eventId: "EVT-004", freelancerId: "FRL-0001", freelancerName: "Pixel Studio", role: "Event Photography & Videography", dates: "2026-02-15", agreedPayment: 25000, status: "Confirmed", taskId: "TSK-020" },
  { eventId: "EVT-004", freelancerId: "FRL-0003", freelancerName: "Sound Waves Pro", role: "PA System & Live Stream", dates: "2026-02-15", agreedPayment: 18000, status: "Confirmed", taskId: "TSK-021" },
  { eventId: "EVT-004", freelancerId: "FRL-0002", freelancerName: "Decor Dreams", role: "Festival Decoration & Mandap", dates: "2026-02-14 – 2026-02-15", agreedPayment: 45000, status: "Assigned", taskId: "TSK-022" },
  { eventId: "EVT-004", freelancerId: "FRL-0007", freelancerName: "Heritage Electricals", role: "Festival Lighting Setup", dates: "2026-02-14 – 2026-02-15", agreedPayment: 28000, status: "Assigned", taskId: "TSK-023" },
  { eventId: "EVT-001", freelancerId: "FRL-0001", freelancerName: "Pixel Studio", role: "Multi-day Coverage", dates: "2026-03-15 – 2026-03-24", agreedPayment: 150000, status: "Assigned" },
  { eventId: "EVT-001", freelancerId: "FRL-0003", freelancerName: "Sound Waves Pro", role: "PA & Broadcasting", dates: "2026-03-15 – 2026-03-24", agreedPayment: 100000, status: "Assigned" },
];

// ---- VOLUNTEER ALLOCATIONS ----
export interface EventVolunteerAllocation {
  eventId: string;
  role: string;
  count: number;
  shift: string;
  area: string;
  taskId?: string;
}

export const eventVolunteerAllocations: EventVolunteerAllocation[] = [
  { eventId: "EVT-004", role: "Crowd Control", count: 120, shift: "6 AM – 2 PM", area: "Main Gate, Queue Lines", taskId: "TSK-024" },
  { eventId: "EVT-004", role: "Kitchen Assistants", count: 80, shift: "4 AM – 12 PM", area: "Main Kitchen, Annadanam Hall", taskId: "TSK-025" },
  { eventId: "EVT-004", role: "Ritual Support", count: 30, shift: "5 AM – 10 AM", area: "Main Temple, Shrines" },
  { eventId: "EVT-004", role: "VIP Coordination", count: 15, shift: "8 AM – 6 PM", area: "VIP Entrance, Dharshan" },
  { eventId: "EVT-004", role: "Medical Support", count: 10, shift: "6 AM – 10 PM", area: "First Aid Counters" },
];

// ---- SECURITY & LOGISTICS ----
export interface EventSecurity {
  eventId: string;
  item: string;
  value: string;
  status: "ok" | "warning" | "critical";
}

export const eventSecurityData: EventSecurity[] = [
  { eventId: "EVT-004", item: "Entry Gates Active", value: "8 / 10", status: "ok" },
  { eventId: "EVT-004", item: "Barricade Sections", value: "24 segments", status: "ok" },
  { eventId: "EVT-004", item: "Medical Teams", value: "4 teams", status: "ok" },
  { eventId: "EVT-004", item: "Police Coordination", value: "Confirmed – SP Office", status: "ok" },
  { eventId: "EVT-004", item: "Emergency Contacts", value: "12 registered", status: "ok" },
  { eventId: "EVT-004", item: "Fire Safety", value: "2 engines standby", status: "warning" },
];

// ---- KITCHEN PRODUCTION → INVENTORY LINK ----
export interface KitchenBatch {
  id: string;
  prasadam: string;
  date: string;
  time: string;
  qty: number;
  allocated: number;
  remaining: number;
  team: string;
  expiry: string;
  status: "Active" | "Expiring Soon" | "Expired" | "Closed";
  eventId?: string;
  inventoryDeductions: { inventoryId: string; inventoryName: string; qty: number; unit: string }[];
}

export const kitchenBatches: KitchenBatch[] = [
  {
    id: "BTH-2026-0891", prasadam: "Laddu Prasadam", date: "2026-02-10", time: "6:00 AM", qty: 5000, allocated: 3200, remaining: 1800, team: "Team A", expiry: "Today 6:00 PM", status: "Active",
    inventoryDeductions: [
      { inventoryId: "INV-004", inventoryName: "Besan (Gram Flour)", qty: 125, unit: "kg" },
      { inventoryId: "INV-003", inventoryName: "Sugar", qty: 100, unit: "kg" },
      { inventoryId: "INV-002", inventoryName: "Ghee (Cow)", qty: 60, unit: "ltr" },
      { inventoryId: "INV-012", inventoryName: "Cashew Nuts", qty: 10, unit: "kg" },
    ],
  },
  {
    id: "BTH-2026-0890", prasadam: "Pulihora", date: "2026-02-10", time: "5:30 AM", qty: 3000, allocated: 2100, remaining: 900, team: "Team B", expiry: "Today 1:30 PM", status: "Active",
    inventoryDeductions: [
      { inventoryId: "INV-001", inventoryName: "Rice (Sona Masuri)", qty: 90, unit: "kg" },
      { inventoryId: "INV-011", inventoryName: "Sesame Oil", qty: 15, unit: "ltr" },
    ],
  },
  {
    id: "BTH-2026-0889", prasadam: "Sweet Pongal", date: "2026-02-10", time: "5:00 AM", qty: 2500, allocated: 1700, remaining: 800, team: "Team A", expiry: "Today 11:00 AM", status: "Expiring Soon",
    inventoryDeductions: [
      { inventoryId: "INV-001", inventoryName: "Rice (Sona Masuri)", qty: 50, unit: "kg" },
      { inventoryId: "INV-010", inventoryName: "Toor Dal", qty: 25, unit: "kg" },
      { inventoryId: "INV-002", inventoryName: "Ghee (Cow)", qty: 20, unit: "ltr" },
      { inventoryId: "INV-012", inventoryName: "Cashew Nuts", qty: 3.75, unit: "kg" },
    ],
  },
  {
    id: "BTH-2026-0888", prasadam: "Annadanam Meals", date: "2026-02-10", time: "10:00 AM", qty: 10000, allocated: 4000, remaining: 6000, team: "Team C", expiry: "Today 4:00 PM", status: "Active", eventId: "EVT-004",
    inventoryDeductions: [
      { inventoryId: "INV-001", inventoryName: "Rice (Sona Masuri)", qty: 500, unit: "kg" },
      { inventoryId: "INV-010", inventoryName: "Toor Dal", qty: 150, unit: "kg" },
      { inventoryId: "INV-002", inventoryName: "Ghee (Cow)", qty: 50, unit: "ltr" },
      { inventoryId: "INV-011", inventoryName: "Sesame Oil", qty: 80, unit: "ltr" },
    ],
  },
];

// ---- AUTO-GENERATED TASKS ----
export interface AutoTask {
  id: string;
  title: string;
  category: string;
  linkedModule: string;
  linkedEntityId: string;
  linkedEntityName: string;
  priority: string;
  dueDate: string;
  assignee: string;
  assigneeType: string;
  status: string;
  notes: string;
  autoGenerated: boolean;
  sourceType: "Event-Freelancer" | "Event-Volunteer" | "Event-Material" | "Kitchen-Batch" | "Seva-Daily" | "Manual";
}

export const autoTasks: AutoTask[] = [
  // Event-generated tasks
  { id: "TSK-020", title: "Event Photography Setup – Maha Shivaratri", category: "Event", linkedModule: "Freelancer", linkedEntityId: "FRL-0001", linkedEntityName: "Pixel Studio", priority: "High", dueDate: "2026-02-15", assignee: "Pixel Studio", assigneeType: "Freelancer", status: "Assigned", notes: "Setup cameras at Main Temple by 4 AM", autoGenerated: true, sourceType: "Event-Freelancer" },
  { id: "TSK-021", title: "PA System & Live Stream Setup – Maha Shivaratri", category: "Event", linkedModule: "Freelancer", linkedEntityId: "FRL-0003", linkedEntityName: "Sound Waves Pro", priority: "High", dueDate: "2026-02-15", assignee: "Sound Waves Pro", assigneeType: "Freelancer", status: "Assigned", notes: "Full PA setup for main hall + live stream", autoGenerated: true, sourceType: "Event-Freelancer" },
  { id: "TSK-022", title: "Festival Decoration – Maha Shivaratri", category: "Event", linkedModule: "Freelancer", linkedEntityId: "FRL-0002", linkedEntityName: "Decor Dreams", priority: "High", dueDate: "2026-02-14", assignee: "Decor Dreams", assigneeType: "Freelancer", status: "Assigned", notes: "Mandap + entrance decoration", autoGenerated: true, sourceType: "Event-Freelancer" },
  { id: "TSK-023", title: "Festival Lighting Setup – Maha Shivaratri", category: "Event", linkedModule: "Freelancer", linkedEntityId: "FRL-0007", linkedEntityName: "Heritage Electricals", priority: "High", dueDate: "2026-02-14", assignee: "Heritage Electricals", assigneeType: "Freelancer", status: "Assigned", notes: "LED & traditional lighting for festival", autoGenerated: true, sourceType: "Event-Freelancer" },
  { id: "TSK-024", title: "Crowd Control Duty – Maha Shivaratri", category: "Event", linkedModule: "Volunteer", linkedEntityId: "EVT-004", linkedEntityName: "Maha Shivaratri", priority: "High", dueDate: "2026-02-15", assignee: "Crowd Control Team (120)", assigneeType: "Volunteer", status: "Open", notes: "Main Gate + Queue management", autoGenerated: true, sourceType: "Event-Volunteer" },
  { id: "TSK-025", title: "Kitchen Support Duty – Maha Shivaratri", category: "Kitchen", linkedModule: "Volunteer", linkedEntityId: "EVT-004", linkedEntityName: "Maha Shivaratri", priority: "Critical", dueDate: "2026-02-15", assignee: "Kitchen Assistants (80)", assigneeType: "Volunteer", status: "Open", notes: "Annadanam hall prep from 4 AM", autoGenerated: true, sourceType: "Event-Volunteer" },
  { id: "TSK-026", title: "Procure Ghee for Maha Shivaratri (200L shortage)", category: "Procurement", linkedModule: "Inventory", linkedEntityId: "INV-002", linkedEntityName: "Ghee (Cow)", priority: "Critical", dueDate: "2026-02-13", assignee: "Store Manager", assigneeType: "Employee", status: "Open", notes: "Current: 45L, Required: 200L. Create PO for Nandi Oil & Ghee", autoGenerated: true, sourceType: "Event-Material" },
  { id: "TSK-027", title: "Procure Flower Arrangements for Maha Shivaratri", category: "Procurement", linkedModule: "Inventory", linkedEntityId: "INV-014", linkedEntityName: "Flower Arrangement", priority: "High", dueDate: "2026-02-13", assignee: "Store Manager", assigneeType: "Employee", status: "Open", notes: "Current: 3, Required: 15. Contact Devi Decorations", autoGenerated: true, sourceType: "Event-Material" },
  // Kitchen-generated tasks
  { id: "TSK-028", title: "Morning Batch Production – Laddu (5000 units)", category: "Kitchen", linkedModule: "Kitchen", linkedEntityId: "BTH-2026-0891", linkedEntityName: "Laddu Prasadam", priority: "High", dueDate: "2026-02-10", assignee: "Team A", assigneeType: "Team", status: "In Progress", notes: "Auto-deducted: 125kg Besan, 100kg Sugar, 60L Ghee, 10kg Cashew", autoGenerated: true, sourceType: "Kitchen-Batch" },
  { id: "TSK-029", title: "Annadanam Preparation – 10,000 Meals", category: "Kitchen", linkedModule: "Kitchen", linkedEntityId: "BTH-2026-0888", linkedEntityName: "Annadanam Meals", priority: "Critical", dueDate: "2026-02-10", assignee: "Team C", assigneeType: "Team", status: "Open", notes: "Linked to EVT-004 Maha Shivaratri", autoGenerated: true, sourceType: "Kitchen-Batch" },
  // Daily seva tasks
  { id: "TSK-030", title: "Morning Abhishekam Material Setup", category: "Ritual", linkedModule: "Offerings", linkedEntityId: "Abhishekam", linkedEntityName: "Abhishekam – Main Temple", priority: "High", dueDate: "2026-02-10", assignee: "Pandit Sharma", assigneeType: "Employee", status: "In Progress", notes: "Materials: 5L Milk, 1kg Rose, 0.2kg Camphor, 10 Coconut", autoGenerated: true, sourceType: "Seva-Daily" },
  // Manual tasks
  { id: "TSK-001", title: "Morning Abhishekam Preparation", category: "Ritual", linkedModule: "Rituals & Sevas", linkedEntityId: "", linkedEntityName: "", priority: "High", dueDate: "2026-02-09", assignee: "Pandit Sharma", assigneeType: "Employee", status: "In Progress", notes: "Ensure all vessels are ready by 4:30 AM", autoGenerated: false, sourceType: "Manual" },
  { id: "TSK-002", title: "Annadanam Kitchen Setup", category: "Kitchen", linkedModule: "Kitchen & Prasadam", linkedEntityId: "", linkedEntityName: "", priority: "Critical", dueDate: "2026-02-09", assignee: "Head Cook Team", assigneeType: "Role", status: "Open", notes: "Prepare for 5000 devotees", autoGenerated: false, sourceType: "Manual" },
  { id: "TSK-005", title: "Generator Maintenance Check", category: "Maintenance", linkedModule: "Asset & Maintenance", linkedEntityId: "", linkedEntityName: "", priority: "High", dueDate: "2026-02-07", assignee: "Electrical Team", assigneeType: "Team", status: "Blocked", notes: "Spare parts awaited", autoGenerated: false, sourceType: "Manual" },
  { id: "TSK-008", title: "Fire Extinguisher Inspection", category: "Security", linkedModule: "Asset & Maintenance", linkedEntityId: "", linkedEntityName: "", priority: "Critical", dueDate: "2026-02-06", assignee: "Safety Officer", assigneeType: "Employee", status: "Open", notes: "Quarterly inspection overdue", autoGenerated: false, sourceType: "Manual" },
];

// ---- STRUCTURES (Shared Reference) ----
export const templeStructures = [
  { id: "STR-001", name: "Main Temple", type: "Main" },
  { id: "STR-002", name: "Padmavathi Shrine", type: "Shrine" },
  { id: "STR-003", name: "Varadaraja Shrine", type: "Shrine" },
  { id: "STR-004", name: "Lakshmi Shrine", type: "Shrine" },
  { id: "STR-005", name: "Annadanam Hall", type: "Hall" },
  { id: "STR-006", name: "Cultural Hall", type: "Hall" },
  { id: "STR-007", name: "Kitchen", type: "Functional" },
  { id: "STR-008", name: "Administration", type: "Functional" },
];

// ---- SUPPLIERS (Shared Reference) ----
export const supplierRefs = [
  { id: "SUP-001", name: "Sri Lakshmi Flowers", category: "Flowers", contact: "Rajesh Kumar" },
  { id: "SUP-002", name: "Annapurna Grocery", category: "Grocery", contact: "Lakshmi Devi" },
  { id: "SUP-003", name: "Shiva Pooja Stores", category: "Pooja Materials", contact: "Venkat Rao" },
  { id: "SUP-004", name: "Nandi Oil & Ghee", category: "Oil & Ghee", contact: "Suresh Reddy" },
  { id: "SUP-005", name: "Devi Decorations", category: "Decoration", contact: "Priya Sharma" },
  { id: "SUP-006", name: "Surya Milk Dairy", category: "Milk & Dairy", contact: "Ganesh Pillai" },
];

// ---- FREELANCER ASSIGNMENTS (Shared Store) ----
export interface FreelancerAssignment {
  id: string;
  freelancerId: string;
  freelancerName: string;
  eventId: string;
  eventName: string;
  linkedStructure: string;
  date: string;
  duration: string;
  agreedPayment: number;
  status: string;
  taskId: string;
  paymentId: string;
}

export const freelancerAssignments: FreelancerAssignment[] = [
  { id: "ASN-001", freelancerId: "FRL-0001", freelancerName: "Pixel Studio", eventId: "EVT-002", eventName: "Vaikuntha Ekadasi", linkedStructure: "Main Temple", date: "2026-01-10", duration: "1 day", agreedPayment: 20000, status: "Completed", taskId: "", paymentId: "PAY-001" },
  { id: "ASN-002", freelancerId: "FRL-0002", freelancerName: "Decor Dreams", eventId: "EVT-002", eventName: "Vaikuntha Ekadasi", linkedStructure: "Main Temple", date: "2026-01-10", duration: "2 days", agreedPayment: 35000, status: "Completed", taskId: "", paymentId: "PAY-002" },
  { id: "ASN-003", freelancerId: "FRL-0003", freelancerName: "Sound Waves Pro", eventId: "", eventName: "Daily Live Broadcast", linkedStructure: "Main Temple", date: "2026-02-09", duration: "Ongoing", agreedPayment: 18000, status: "Assigned", taskId: "", paymentId: "" },
  { id: "ASN-004", freelancerId: "FRL-0001", freelancerName: "Pixel Studio", eventId: "EVT-004", eventName: "Maha Shivaratri", linkedStructure: "Main Temple", date: "2026-02-15", duration: "1 day", agreedPayment: 25000, status: "Confirmed", taskId: "TSK-020", paymentId: "" },
  { id: "ASN-005", freelancerId: "FRL-0003", freelancerName: "Sound Waves Pro", eventId: "EVT-004", eventName: "Maha Shivaratri", linkedStructure: "Main Temple", date: "2026-02-15", duration: "1 day", agreedPayment: 18000, status: "Confirmed", taskId: "TSK-021", paymentId: "" },
  { id: "ASN-006", freelancerId: "FRL-0002", freelancerName: "Decor Dreams", eventId: "EVT-004", eventName: "Maha Shivaratri", linkedStructure: "Main Temple", date: "2026-02-14", duration: "2 days", agreedPayment: 45000, status: "Assigned", taskId: "TSK-022", paymentId: "" },
  { id: "ASN-007", freelancerId: "FRL-0007", freelancerName: "Heritage Electricals", eventId: "EVT-004", eventName: "Maha Shivaratri", linkedStructure: "Main Temple", date: "2026-02-14", duration: "2 days", agreedPayment: 28000, status: "Assigned", taskId: "TSK-023", paymentId: "" },
  { id: "ASN-008", freelancerId: "FRL-0004", freelancerName: "CreativeMinds Design", eventId: "", eventName: "Annual Calendar Design", linkedStructure: "Administration", date: "2026-01-05", duration: "10 days", agreedPayment: 25000, status: "Completed", taskId: "", paymentId: "PAY-004" },
  { id: "ASN-009", freelancerId: "FRL-0001", freelancerName: "Pixel Studio", eventId: "EVT-001", eventName: "Brahmotsavam 2026", linkedStructure: "Main Temple", date: "2026-03-15", duration: "10 days", agreedPayment: 150000, status: "Assigned", taskId: "", paymentId: "" },
  { id: "ASN-010", freelancerId: "FRL-0003", freelancerName: "Sound Waves Pro", eventId: "EVT-001", eventName: "Brahmotsavam 2026", linkedStructure: "Main Temple", date: "2026-03-15", duration: "10 days", agreedPayment: 100000, status: "Assigned", taskId: "", paymentId: "" },
];
