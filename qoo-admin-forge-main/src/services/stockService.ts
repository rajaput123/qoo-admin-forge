import { stockItems, stockTransactions, StockTransaction } from "@/data/inventoryData";

type UpdateMeta = {
  transactionType?: StockTransaction["transactionType"];
  storeLocation?: string;
  structureId?: string;
  structureName?: string;
  linkedEvent?: string;
  linkedKitchenRequest?: string;
  linkedFreelancer?: string;
  notes?: string;
  createdBy?: string;
  unitPrice?: number;
  totalAmount?: number;
};

export function getItemById(itemId: string) {
  return stockItems.find(i => i.id === itemId) || null;
}

export function updateStock(itemId: string, delta: number, meta: UpdateMeta = {}) {
  const item = stockItems.find(i => i.id === itemId);
  if (!item) return null;
  const prev = item.currentStock || 0;
  const newBalance = prev + delta;
  item.currentStock = newBalance;
  item.lastRestocked = new Date().toISOString().slice(0,10);
  item.status = item.currentStock <= item.reorderLevel ? "Low Stock" : "In Stock";

  const txnId = `TXN-${String(stockTransactions.length + 1).padStart(3, "0")}`;
  const txn: StockTransaction = {
    id: txnId,
    date: new Date().toISOString().slice(0,10),
    time: new Date().toLocaleTimeString(),
    itemId: item.id,
    itemName: item.name,
    transactionType: meta.transactionType || (delta >= 0 ? "Purchase In" : "Usage Out"),
    quantity: Math.abs(delta),
    balanceAfter: newBalance,
    storeLocation: meta.storeLocation || item.storageLocation || "Main Store Room A",
    templeId: item.templeId,
    structureId: meta.structureId || item.defaultStructure,
    structureName: meta.structureName || item.defaultStructure,
    linkedEvent: meta.linkedEvent,
    linkedKitchenRequest: meta.linkedKitchenRequest,
    linkedFreelancer: meta.linkedFreelancer,
    notes: meta.notes || "",
    createdBy: meta.createdBy || "System",
    // optional pricing for Purchase In
    ...(meta.unitPrice ? { unitPrice: meta.unitPrice } : {}),
    ...(meta.totalAmount ? { totalAmount: meta.totalAmount } : {}),
  };
  stockTransactions.push(txn);
  return txn;
}

export function createOrUpdateItem(partial: Partial<typeof stockItems[0]>) {
  if (!partial.name) return null;
  if (partial.id) {
    const idx = stockItems.findIndex(i => i.id === partial.id);
    if (idx >= 0) {
      stockItems[idx] = { ...stockItems[idx], ...partial } as any;
      return stockItems[idx];
    }
  }
  // create new id
  const next = stockItems.length + 1;
  const newId = partial.code ? `${partial.code}` : `ITM-${String(next).padStart(3,"0")}`;
  const newItem = {
    id: newId,
    name: partial.name || "Unknown",
    code: partial.code || newId,
    itemType: (partial as any).itemType || "Consumable",
    category: partial.category || "General",
    unit: partial.unit || "pcs",
    templeId: partial.templeId || "TMP-001",
    defaultStructure: partial.defaultStructure || "Kitchen",
    currentStock: partial.currentStock ?? 0,
    reorderLevel: partial.reorderLevel ?? 0,
    minimumLevel: partial.minimumLevel ?? 0,
    storageLocation: partial.storageLocation || "Main Store Room A",
    ritualUse: partial.ritualUse ?? false,
    expiryApplicable: partial.expiryApplicable ?? false,
    pricePerUnit: partial.pricePerUnit ?? 0,
    supplier: partial.supplier || "",
    lastRestocked: partial.lastRestocked || new Date().toISOString().slice(0,10),
    status: (partial.currentStock ?? 0) <= (partial.reorderLevel ?? 0) ? "Low Stock" : "In Stock",
  } as any;
  stockItems.push(newItem);
  return newItem;
}

