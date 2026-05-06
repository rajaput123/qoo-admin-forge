// ==========================================
// STOCK & INVENTORY MODULE - DATA LAYER
// ==========================================

import { inventoryItems, templeStructures, eventRefs, kitchenBatches, offeringMaterials, supplierRefs, freelancerRefs } from "./templeData";

// Re-export for convenience
export { inventoryItems, templeStructures, eventRefs, kitchenBatches, offeringMaterials, supplierRefs, freelancerRefs };

// ---- EXTENDED ITEM MASTER ----
export interface StockItem {
  id: string;
  name: string;
  code: string;
  itemType: "Consumable" | "Perishable" | "Asset" | "Donation Item";
  category: string;
  unit: string;
  templeId: string;
  defaultStructure: string;
  currentStock: number;
  reorderLevel: number;
  minimumLevel: number;
  storageLocation: string;
  ritualUse: boolean;
  expiryApplicable: boolean;
  // Perishable fields
  batchNumber?: string;
  expiryDate?: string;
  // Asset fields
  serialNumber?: string;
  condition?: "New" | "Good" | "Fair" | "Poor" | "Damaged";
  assignedLocation?: string;
  // Pricing
  pricePerUnit: number;
  supplier: string;
  lastRestocked: string;
  status: "In Stock" | "Low Stock" | "Out of Stock";
}

export const stockItems: StockItem[] = [
  { id: "ITM-001", name: "Rice (Sona Masuri)", code: "GRO-001", itemType: "Consumable", category: "Grocery", unit: "kg", templeId: "TMP-001", defaultStructure: "Kitchen", currentStock: 850, reorderLevel: 200, minimumLevel: 100, storageLocation: "Main Store Room A", ritualUse: false, expiryApplicable: false, pricePerUnit: 55, supplier: "Annapurna Grocery", lastRestocked: "2026-02-08", status: "In Stock" },
  { id: "ITM-002", name: "Ghee (Cow)", code: "OIL-001", itemType: "Consumable", category: "Oil & Ghee", unit: "ltr", templeId: "TMP-001", defaultStructure: "Kitchen", currentStock: 45, reorderLevel: 50, minimumLevel: 20, storageLocation: "Main Store Room B", ritualUse: true, expiryApplicable: true, batchNumber: "GH-2026-02", expiryDate: "2026-06-15", pricePerUnit: 600, supplier: "Nandi Oil & Ghee", lastRestocked: "2026-02-05", status: "Low Stock" },
  { id: "ITM-003", name: "Sugar", code: "GRO-002", itemType: "Consumable", category: "Grocery", unit: "kg", templeId: "TMP-001", defaultStructure: "Kitchen", currentStock: 320, reorderLevel: 100, minimumLevel: 50, storageLocation: "Main Store Room A", ritualUse: false, expiryApplicable: false, pricePerUnit: 45, supplier: "Annapurna Grocery", lastRestocked: "2026-02-08", status: "In Stock" },
  { id: "ITM-004", name: "Besan (Gram Flour)", code: "GRO-003", itemType: "Consumable", category: "Grocery", unit: "kg", templeId: "TMP-001", defaultStructure: "Kitchen", currentStock: 180, reorderLevel: 50, minimumLevel: 25, storageLocation: "Main Store Room A", ritualUse: false, expiryApplicable: false, pricePerUnit: 80, supplier: "Annapurna Grocery", lastRestocked: "2026-02-07", status: "In Stock" },
  { id: "ITM-005", name: "Rose Petals", code: "FLW-001", itemType: "Perishable", category: "Flowers", unit: "kg", templeId: "TMP-001", defaultStructure: "Main Temple", currentStock: 25, reorderLevel: 10, minimumLevel: 5, storageLocation: "Cold Store", ritualUse: true, expiryApplicable: true, batchNumber: "RP-2026-02-09", expiryDate: "2026-02-11", pricePerUnit: 500, supplier: "Sri Lakshmi Flowers", lastRestocked: "2026-02-09", status: "In Stock" },
  { id: "ITM-006", name: "Jasmine Garlands", code: "FLW-002", itemType: "Perishable", category: "Flowers", unit: "pcs", templeId: "TMP-001", defaultStructure: "Main Temple", currentStock: 120, reorderLevel: 50, minimumLevel: 20, storageLocation: "Cold Store", ritualUse: true, expiryApplicable: true, batchNumber: "JG-2026-02-09", expiryDate: "2026-02-10", pricePerUnit: 80, supplier: "Sri Lakshmi Flowers", lastRestocked: "2026-02-09", status: "In Stock" },
  { id: "ITM-007", name: "Camphor", code: "POO-001", itemType: "Consumable", category: "Pooja Materials", unit: "kg", templeId: "TMP-001", defaultStructure: "Main Temple", currentStock: 8, reorderLevel: 5, minimumLevel: 2, storageLocation: "Pooja Store", ritualUse: true, expiryApplicable: false, pricePerUnit: 800, supplier: "Shiva Pooja Stores", lastRestocked: "2026-02-09", status: "In Stock" },
  { id: "ITM-008", name: "Kumkum", code: "POO-002", itemType: "Consumable", category: "Pooja Materials", unit: "kg", templeId: "TMP-001", defaultStructure: "Main Temple", currentStock: 5, reorderLevel: 3, minimumLevel: 1, storageLocation: "Pooja Store", ritualUse: true, expiryApplicable: false, pricePerUnit: 400, supplier: "Shiva Pooja Stores", lastRestocked: "2026-02-09", status: "In Stock" },
  { id: "ITM-009", name: "Incense Sticks", code: "POO-003", itemType: "Consumable", category: "Pooja Materials", unit: "pkt", templeId: "TMP-001", defaultStructure: "Main Temple", currentStock: 200, reorderLevel: 50, minimumLevel: 20, storageLocation: "Pooja Store", ritualUse: true, expiryApplicable: false, pricePerUnit: 30, supplier: "Shiva Pooja Stores", lastRestocked: "2026-02-09", status: "In Stock" },
  { id: "ITM-010", name: "Toor Dal", code: "GRO-004", itemType: "Consumable", category: "Grocery", unit: "kg", templeId: "TMP-001", defaultStructure: "Kitchen", currentStock: 120, reorderLevel: 50, minimumLevel: 25, storageLocation: "Main Store Room A", ritualUse: false, expiryApplicable: false, pricePerUnit: 120, supplier: "Annapurna Grocery", lastRestocked: "2026-02-08", status: "In Stock" },
  { id: "ITM-011", name: "Sesame Oil", code: "OIL-002", itemType: "Consumable", category: "Oil & Ghee", unit: "ltr", templeId: "TMP-001", defaultStructure: "Kitchen", currentStock: 30, reorderLevel: 20, minimumLevel: 10, storageLocation: "Main Store Room B", ritualUse: false, expiryApplicable: false, pricePerUnit: 350, supplier: "Nandi Oil & Ghee", lastRestocked: "2026-02-05", status: "In Stock" },
  { id: "ITM-012", name: "Cashew Nuts", code: "DRY-001", itemType: "Consumable", category: "Dry Fruits", unit: "kg", templeId: "TMP-001", defaultStructure: "Kitchen", currentStock: 15, reorderLevel: 10, minimumLevel: 5, storageLocation: "Main Store Room A", ritualUse: false, expiryApplicable: false, pricePerUnit: 900, supplier: "Annapurna Grocery", lastRestocked: "2026-02-08", status: "In Stock" },
  { id: "ITM-013", name: "Milk (Full Cream)", code: "MLK-001", itemType: "Perishable", category: "Milk & Dairy", unit: "ltr", templeId: "TMP-001", defaultStructure: "Kitchen", currentStock: 80, reorderLevel: 50, minimumLevel: 20, storageLocation: "Cold Store", ritualUse: true, expiryApplicable: true, batchNumber: "MK-2026-02-09", expiryDate: "2026-02-12", pricePerUnit: 60, supplier: "Surya Milk Dairy", lastRestocked: "2026-02-09", status: "In Stock" },
  { id: "ITM-014", name: "Flower Arrangement", code: "DEC-001", itemType: "Consumable", category: "Decoration", unit: "pcs", templeId: "TMP-001", defaultStructure: "Main Temple", currentStock: 3, reorderLevel: 2, minimumLevel: 1, storageLocation: "Decoration Store", ritualUse: false, expiryApplicable: false, pricePerUnit: 2000, supplier: "Devi Decorations", lastRestocked: "2026-02-07", status: "In Stock" },
  { id: "ITM-015", name: "Coconut", code: "POO-004", itemType: "Consumable", category: "Pooja Materials", unit: "pcs", templeId: "TMP-001", defaultStructure: "Main Temple", currentStock: 350, reorderLevel: 100, minimumLevel: 50, storageLocation: "Pooja Store", ritualUse: true, expiryApplicable: false, pricePerUnit: 35, supplier: "Shiva Pooja Stores", lastRestocked: "2026-02-09", status: "In Stock" },
  { id: "ITM-016", name: "Banana", code: "FRT-001", itemType: "Perishable", category: "Fruits", unit: "dozen", templeId: "TMP-001", defaultStructure: "Main Temple", currentStock: 60, reorderLevel: 20, minimumLevel: 10, storageLocation: "Cold Store", ritualUse: true, expiryApplicable: true, batchNumber: "BN-2026-02-09", expiryDate: "2026-02-12", pricePerUnit: 50, supplier: "Annapurna Grocery", lastRestocked: "2026-02-09", status: "In Stock" },
  // Assets
  { id: "ITM-017", name: "Brass Lamp (Large)", code: "AST-001", itemType: "Asset", category: "Ritual Equipment", unit: "pcs", templeId: "TMP-001", defaultStructure: "Main Temple", currentStock: 12, reorderLevel: 2, minimumLevel: 1, storageLocation: "Temple Store", ritualUse: true, expiryApplicable: false, serialNumber: "BL-001 to BL-012", condition: "Good", assignedLocation: "Main Temple", pricePerUnit: 5000, supplier: "Shiva Pooja Stores", lastRestocked: "2025-12-01", status: "In Stock" },
  { id: "ITM-018", name: "Silver Plate Set", code: "AST-002", itemType: "Asset", category: "Ritual Equipment", unit: "set", templeId: "TMP-001", defaultStructure: "Main Temple", currentStock: 6, reorderLevel: 1, minimumLevel: 1, storageLocation: "Secure Storage", ritualUse: true, expiryApplicable: false, serialNumber: "SP-001 to SP-006", condition: "Good", assignedLocation: "Main Temple", pricePerUnit: 25000, supplier: "Shiva Pooja Stores", lastRestocked: "2025-10-15", status: "In Stock" },
  // Donation Items
  { id: "ITM-019", name: "Saree (Silk)", code: "DON-001", itemType: "Donation Item", category: "Donation Items", unit: "pcs", templeId: "TMP-001", defaultStructure: "Administration", currentStock: 45, reorderLevel: 10, minimumLevel: 5, storageLocation: "Donation Store", ritualUse: false, expiryApplicable: false, pricePerUnit: 0, supplier: "Donated", lastRestocked: "2026-02-08", status: "In Stock" },
  { id: "ITM-020", name: "Blankets", code: "DON-002", itemType: "Donation Item", category: "Donation Items", unit: "pcs", templeId: "TMP-001", defaultStructure: "Administration", currentStock: 120, reorderLevel: 20, minimumLevel: 10, storageLocation: "Donation Store", ritualUse: false, expiryApplicable: false, pricePerUnit: 0, supplier: "Donated", lastRestocked: "2026-01-20", status: "In Stock" },
];

// ---- STOCK TRANSACTIONS ----
export type TransactionType = "Purchase In" | "Donation In" | "Usage Out" | "Transfer" | "Return" | "Damage / Waste";

export interface StockTransaction {
  id: string;
  date: string;
  time: string;
  itemId: string;
  itemName: string;
  transactionType: TransactionType;
  quantity: number;
  balanceAfter: number;
  storeLocation: string;
  templeId: string;
  structureId: string;
  structureName: string;
  linkedEvent?: string;
  linkedSeva?: string;
  linkedDarshan?: string;
  linkedKitchenRequest?: string;
  linkedFreelancer?: string;
  notes: string;
  unitPrice?: number;
  totalAmount?: number;
  createdBy: string;
}

export const stockTransactions: StockTransaction[] = [
  { id: "TXN-001", date: "2026-02-10", time: "06:15 AM", itemId: "ITM-004", itemName: "Besan (Gram Flour)", transactionType: "Usage Out", quantity: 125, balanceAfter: 55, storeLocation: "Main Store Room A", templeId: "TMP-001", structureId: "STR-007", structureName: "Kitchen", linkedKitchenRequest: "REQ-001", notes: "Batch BTH-2026-0891 – Laddu production", createdBy: "Store Keeper" },
  { id: "TXN-002", date: "2026-02-10", time: "06:15 AM", itemId: "ITM-003", itemName: "Sugar", transactionType: "Usage Out", quantity: 100, balanceAfter: 220, storeLocation: "Main Store Room A", templeId: "TMP-001", structureId: "STR-007", structureName: "Kitchen", linkedKitchenRequest: "REQ-001", notes: "Batch BTH-2026-0891 – Laddu production", createdBy: "Store Keeper" },
  { id: "TXN-003", date: "2026-02-10", time: "06:15 AM", itemId: "ITM-002", itemName: "Ghee (Cow)", transactionType: "Usage Out", quantity: 60, balanceAfter: -15, storeLocation: "Main Store Room B", templeId: "TMP-001", structureId: "STR-007", structureName: "Kitchen", linkedKitchenRequest: "REQ-001", notes: "Batch BTH-2026-0891 – Laddu production (SHORTAGE)", createdBy: "Store Keeper" },
  { id: "TXN-004", date: "2026-02-10", time: "05:30 AM", itemId: "ITM-005", itemName: "Rose Petals", transactionType: "Usage Out", quantity: 0.5, balanceAfter: 24.5, storeLocation: "Cold Store", templeId: "TMP-001", structureId: "STR-001", structureName: "Main Temple", linkedSeva: "Suprabhatam", notes: "Morning Suprabhatam ritual", createdBy: "Temple Attendant" },
  { id: "TXN-005", date: "2026-02-10", time: "05:30 AM", itemId: "ITM-006", itemName: "Jasmine Garlands", transactionType: "Usage Out", quantity: 5, balanceAfter: 115, storeLocation: "Cold Store", templeId: "TMP-001", structureId: "STR-001", structureName: "Main Temple", linkedSeva: "Suprabhatam", notes: "Morning Suprabhatam ritual", createdBy: "Temple Attendant" },
  { id: "TXN-006", date: "2026-02-09", time: "04:00 PM", itemId: "ITM-001", itemName: "Rice (Sona Masuri)", transactionType: "Purchase In", quantity: 500, balanceAfter: 850, storeLocation: "Main Store Room A", templeId: "TMP-001", structureId: "STR-007", structureName: "Kitchen", notes: "PO-2026-002 delivery from Annapurna Grocery", createdBy: "Store Manager" },
  { id: "TXN-007", date: "2026-02-09", time: "03:30 PM", itemId: "ITM-005", itemName: "Rose Petals", transactionType: "Purchase In", quantity: 15, balanceAfter: 25, storeLocation: "Cold Store", templeId: "TMP-001", structureId: "STR-001", structureName: "Main Temple", notes: "PO-2026-001 delivery from Sri Lakshmi Flowers", createdBy: "Store Manager" },
  { id: "TXN-008", date: "2026-02-09", time: "10:00 AM", itemId: "ITM-019", itemName: "Saree (Silk)", transactionType: "Donation In", quantity: 10, balanceAfter: 45, storeLocation: "Donation Store", templeId: "TMP-001", structureId: "STR-008", structureName: "Administration", notes: "Donated by Lakshmi Trust – Ref DT-2026-042", createdBy: "Admin Office" },
  { id: "TXN-009", date: "2026-02-09", time: "09:00 AM", itemId: "ITM-017", itemName: "Brass Lamp (Large)", transactionType: "Transfer", quantity: 2, balanceAfter: 10, storeLocation: "Temple Store", templeId: "TMP-001", structureId: "STR-002", structureName: "Padmavathi Shrine", notes: "Transferred from Main Temple to Padmavathi Shrine for festival", createdBy: "Store Keeper" },
  { id: "TXN-010", date: "2026-02-08", time: "11:00 AM", itemId: "ITM-006", itemName: "Jasmine Garlands", transactionType: "Damage / Waste", quantity: 15, balanceAfter: 120, storeLocation: "Cold Store", templeId: "TMP-001", structureId: "STR-001", structureName: "Main Temple", notes: "Wilted – not usable for afternoon rituals", createdBy: "Temple Attendant" },
  { id: "TXN-011", date: "2026-02-08", time: "09:30 AM", itemId: "ITM-015", itemName: "Coconut", transactionType: "Usage Out", quantity: 50, balanceAfter: 350, storeLocation: "Pooja Store", templeId: "TMP-001", structureId: "STR-001", structureName: "Main Temple", linkedSeva: "Archana", notes: "Morning Archana – 10 slots", createdBy: "Temple Attendant" },
  { id: "TXN-012", date: "2026-02-08", time: "02:00 PM", itemId: "ITM-018", itemName: "Silver Plate Set", transactionType: "Return", quantity: 1, balanceAfter: 6, storeLocation: "Secure Storage", templeId: "TMP-001", structureId: "STR-001", structureName: "Main Temple", linkedEvent: "EVT-002", notes: "Returned after Vaikuntha Ekadasi", createdBy: "Store Manager" },
];

// ---- STOCK REQUESTS ----
export type RequestSource = "Kitchen" | "Event" | "Seva" | "Darshan" | "Freelancer";
export type RequestStatus = "Pending" | "Approved" | "Partially Issued" | "Issued" | "Rejected";

export interface StockRequest {
  id: string;
  date: string;
  source: RequestSource;
  sourceRefId: string;
  sourceRefName: string;
  requestedBy: string;
  items: { itemId: string; itemName: string; requestedQty: number; issuedQty: number; unit: string; available: number }[];
  status: RequestStatus;
  notes: string;
  issuedDate?: string;
  issuedBy?: string;
}

export const stockRequests: StockRequest[] = [
  {
    id: "REQ-001", date: "2026-02-10", source: "Kitchen", sourceRefId: "BTH-2026-0891", sourceRefName: "Laddu Prasadam – 5000 units", requestedBy: "Head Cook – Team A", status: "Issued", notes: "Morning batch production", issuedDate: "2026-02-10", issuedBy: "Store Keeper",
    items: [
      { itemId: "ITM-004", itemName: "Besan (Gram Flour)", requestedQty: 125, issuedQty: 125, unit: "kg", available: 180 },
      { itemId: "ITM-003", itemName: "Sugar", requestedQty: 100, issuedQty: 100, unit: "kg", available: 320 },
      { itemId: "ITM-002", itemName: "Ghee (Cow)", requestedQty: 60, issuedQty: 45, unit: "ltr", available: 45 },
      { itemId: "ITM-012", itemName: "Cashew Nuts", requestedQty: 10, issuedQty: 10, unit: "kg", available: 15 },
    ],
  },
  {
    id: "REQ-002", date: "2026-02-10", source: "Kitchen", sourceRefId: "BTH-2026-0888", sourceRefName: "Annadanam Meals – 10,000", requestedBy: "Head Cook – Team C", status: "Pending", notes: "Linked to Maha Shivaratri – EVT-004",
    items: [
      { itemId: "ITM-001", itemName: "Rice (Sona Masuri)", requestedQty: 500, issuedQty: 0, unit: "kg", available: 850 },
      { itemId: "ITM-010", itemName: "Toor Dal", requestedQty: 150, issuedQty: 0, unit: "kg", available: 120 },
      { itemId: "ITM-002", itemName: "Ghee (Cow)", requestedQty: 50, issuedQty: 0, unit: "ltr", available: 45 },
      { itemId: "ITM-011", itemName: "Sesame Oil", requestedQty: 80, issuedQty: 0, unit: "ltr", available: 30 },
    ],
  },
  {
    id: "REQ-003", date: "2026-02-13", source: "Event", sourceRefId: "EVT-004", sourceRefName: "Maha Shivaratri", requestedBy: "Event Coordinator", status: "Pending", notes: "Festival material allocation",
    items: [
      { itemId: "ITM-005", itemName: "Rose Petals", requestedQty: 50, issuedQty: 0, unit: "kg", available: 25 },
      { itemId: "ITM-006", itemName: "Jasmine Garlands", requestedQty: 500, issuedQty: 0, unit: "pcs", available: 120 },
      { itemId: "ITM-007", itemName: "Camphor", requestedQty: 10, issuedQty: 0, unit: "kg", available: 8 },
      { itemId: "ITM-014", itemName: "Flower Arrangement", requestedQty: 15, issuedQty: 0, unit: "pcs", available: 3 },
    ],
  },
  {
    id: "REQ-004", date: "2026-02-10", source: "Seva", sourceRefId: "Abhishekam", sourceRefName: "Morning Abhishekam – Main Temple", requestedBy: "Pandit Sharma", status: "Approved", notes: "Daily ritual requirement",
    items: [
      { itemId: "ITM-013", itemName: "Milk (Full Cream)", requestedQty: 5, issuedQty: 0, unit: "ltr", available: 80 },
      { itemId: "ITM-005", itemName: "Rose Petals", requestedQty: 1, issuedQty: 0, unit: "kg", available: 25 },
      { itemId: "ITM-007", itemName: "Camphor", requestedQty: 0.2, issuedQty: 0, unit: "kg", available: 8 },
      { itemId: "ITM-015", itemName: "Coconut", requestedQty: 10, issuedQty: 0, unit: "pcs", available: 350 },
    ],
  },
  {
    id: "REQ-005", date: "2026-02-14", source: "Freelancer", sourceRefId: "FRL-0002", sourceRefName: "Decor Dreams – Festival Decoration", requestedBy: "Decor Dreams", status: "Pending", notes: "Materials for Maha Shivaratri decoration setup",
    items: [
      { itemId: "ITM-014", itemName: "Flower Arrangement", requestedQty: 8, issuedQty: 0, unit: "pcs", available: 3 },
      { itemId: "ITM-006", itemName: "Jasmine Garlands", requestedQty: 100, issuedQty: 0, unit: "pcs", available: 120 },
    ],
  },
];

// ---- STOCK ADJUSTMENTS ----
export type AdjustmentReason = "Physical Count" | "Damage" | "Expired" | "Correction" | "Theft / Loss" | "System Error";

export interface StockAdjustment {
  id: string;
  date: string;
  itemId: string;
  itemName: string;
  systemQty: number;
  actualQty: number;
  difference: number;
  reason: AdjustmentReason;
  structureName: string;
  storeLocation: string;
  notes: string;
  adjustedBy: string;
}

export const stockAdjustments: StockAdjustment[] = [
  { id: "ADJ-001", date: "2026-02-09", itemId: "ITM-006", itemName: "Jasmine Garlands", systemQty: 135, actualQty: 120, difference: -15, reason: "Damage", structureName: "Main Temple", storeLocation: "Cold Store", notes: "15 garlands wilted due to delayed refrigeration", adjustedBy: "Store Keeper" },
  { id: "ADJ-002", date: "2026-02-07", itemId: "ITM-009", itemName: "Incense Sticks", systemQty: 210, actualQty: 200, difference: -10, reason: "Physical Count", structureName: "Main Temple", storeLocation: "Pooja Store", notes: "Count mismatch during weekly audit", adjustedBy: "Store Manager" },
  { id: "ADJ-003", date: "2026-02-05", itemId: "ITM-013", itemName: "Milk (Full Cream)", systemQty: 90, actualQty: 80, difference: -10, reason: "Expired", structureName: "Kitchen", storeLocation: "Cold Store", notes: "10L expired – batch MK-2026-02-04", adjustedBy: "Store Keeper" },
  { id: "ADJ-004", date: "2026-02-03", itemId: "ITM-015", itemName: "Coconut", systemQty: 340, actualQty: 350, difference: 10, reason: "Correction", structureName: "Main Temple", storeLocation: "Pooja Store", notes: "Under-counted in previous audit", adjustedBy: "Store Manager" },
  { id: "ADJ-005", date: "2026-02-01", itemId: "ITM-008", itemName: "Kumkum", systemQty: 6, actualQty: 5, difference: -1, reason: "Physical Count", structureName: "Main Temple", storeLocation: "Pooja Store", notes: "Minor discrepancy – monthly reconciliation", adjustedBy: "Store Keeper" },
];

// ---- ITEM CATEGORIES & UNITS (Dropdowns with Add New) ----
export const itemCategories = [
  "Grocery", "Oil & Ghee", "Flowers", "Pooja Materials", "Dry Fruits",
  "Milk & Dairy", "Fruits", "Decoration", "Ritual Equipment", "Donation Items",
  "Cleaning Supplies", "Electrical", "Stationery",
];

export const itemUnits = [
  "kg", "ltr", "pcs", "pkt", "dozen", "set", "box", "bundle", "gm", "ml",
];

export const storageLocations = [
  "Main Store Room A", "Main Store Room B", "Cold Store", "Pooja Store",
  "Decoration Store", "Temple Store", "Secure Storage", "Donation Store",
  "Kitchen Pantry", "Event Store",
];

export const adjustmentReasons: AdjustmentReason[] = [
  "Physical Count", "Damage", "Expired", "Correction", "Theft / Loss", "System Error",
];
