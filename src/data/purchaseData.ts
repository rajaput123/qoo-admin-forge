// Shared Purchase Data Store
export type POLine = {
    id: string;
    itemId: string;
    itemName: string;
    qty: number;
    unitPrice: number;
    total: number;
};

export type PurchaseOrder = {
    id: string;
    supplier: string;
    lines: POLine[];
    totalAmount: number;
    expectedDate: string;
    status: "Draft" | "Ordered" | "Partial" | "Closed";
    createdDate: string;
    createdBy: string;
};

export type DeliveryLine = {
    id: string;
    poLineId: string;
    itemId: string;
    itemName: string;
    orderedQty: number;
    deliveredQty: number;
    acceptedQty: number;
    rejectedQty: number;
    unitPrice: number;
    totalAmount: number;
};

export type Delivery = {
    id: string;
    poId: string;
    supplier: string;
    receivedDate: string;
    status: "Accepted" | "Pending" | "Partial";
    receivedBy?: string;
    notes?: string;
    invoiceNo?: string;
    lines: DeliveryLine[];
};

export const purchaseOrders: PurchaseOrder[] = [
    {
        id: "PO-2026-001",
        supplier: "Sri Lakshmi Flowers",
        lines: [
            { id: "L-1", itemId: "ITM-005", itemName: "Rose Petals", qty: 10, unitPrice: 500, total: 5000 }
        ],
        totalAmount: 5000,
        expectedDate: "2026-02-10",
        status: "Closed",
        createdDate: "2026-02-06",
        createdBy: "Admin"
    },
    {
        id: "PO-2026-002",
        supplier: "Divine Supplies",
        lines: [
            { id: "L-1", itemId: "ITM-002", itemName: "Ghee (Cow)", qty: 20, unitPrice: 450, total: 9000 }
        ],
        totalAmount: 9000,
        expectedDate: "2026-02-15",
        status: "Partial",
        createdDate: "2026-02-08",
        createdBy: "Store Manager"
    },
    {
        id: "PO-2026-003",
        supplier: "Temple Store Co",
        lines: [
            { id: "L-1", itemId: "ITM-007", itemName: "Camphor", qty: 15, unitPrice: 200, total: 3000 }
        ],
        totalAmount: 3000,
        expectedDate: "2026-02-12",
        status: "Ordered",
        createdDate: "2026-02-05",
        createdBy: "Admin"
    },
];

export const deliveries: Delivery[] = [
    {
        id: "DEL-001",
        poId: "PO-2026-001",
        supplier: "Sri Lakshmi Flowers",
        receivedDate: "2026-02-11",
        status: "Accepted",
        receivedBy: "Store Manager",
        notes: "All items received in good condition",
        invoiceNo: "INV-1102",
        lines: [
            {
                id: "DL-1",
                poLineId: "L-1",
                itemId: "ITM-005",
                itemName: "Rose Petals",
                orderedQty: 10,
                deliveredQty: 10,
                acceptedQty: 10,
                rejectedQty: 0,
                unitPrice: 500,
                totalAmount: 5000
            }
        ]
    },
    {
        id: "DEL-002",
        poId: "PO-2026-002",
        supplier: "Divine Supplies",
        receivedDate: "2026-02-09",
        status: "Pending",
        receivedBy: "Admin",
        notes: "Awaiting quality check",
        invoiceNo: "INV-2109",
        lines: [
            {
                id: "DL-1",
                poLineId: "L-1",
                itemId: "ITM-002",
                itemName: "Ghee (Cow)",
                orderedQty: 20,
                deliveredQty: 10,
                acceptedQty: 0,
                rejectedQty: 0,
                unitPrice: 450,
                totalAmount: 0
            }
        ]
    },
    {
        id: "DEL-003",
        poId: "PO-2026-002",
        supplier: "Divine Supplies",
        receivedDate: "2026-02-12",
        status: "Partial",
        receivedBy: "Store Manager",
        notes: "Received 10 of 20 items ordered",
        invoiceNo: "INV-2112",
        lines: [
            {
                id: "DL-1",
                poLineId: "L-1",
                itemId: "ITM-002",
                itemName: "Ghee (Cow)",
                orderedQty: 20,
                deliveredQty: 10,
                acceptedQty: 10,
                rejectedQty: 0,
                unitPrice: 450,
                totalAmount: 4500
            }
        ]
    },
];

export const addPurchaseOrder = (po: PurchaseOrder) => {
    purchaseOrders.unshift(po);
    return po;
};

export const addDelivery = (delivery: Delivery) => {
    deliveries.unshift(delivery);
    return delivery;
};

export const getPurchaseOrder = (poId: string) => purchaseOrders.find(p => p.id === poId);
export const getDelivery = (deliveryId: string) => deliveries.find(d => d.id === deliveryId);

export const nextPurchaseOrderId = () => {
    const max = purchaseOrders
        .map(p => Number(String(p.id).split("-").pop()) || 0)
        .reduce((m, n) => Math.max(m, n), 0);
    return `PO-2026-${String(max + 1).padStart(3, "0")}`;
};

export const nextDeliveryId = () => {
    const max = deliveries
        .map(d => Number(String(d.id).split("-").pop()) || 0)
        .reduce((m, n) => Math.max(m, n), 0);
    return `DEL-${String(max + 1).padStart(3, "0")}`;
};

// Helper functions
export const getDeliveriesForPO = (poId: string): Delivery[] => {
    return deliveries.filter(d => d.poId === poId);
};

export const getPOForDelivery = (deliveryId: string): PurchaseOrder | undefined => {
    const delivery = deliveries.find(d => d.id === deliveryId);
    if (!delivery) return undefined;
    return purchaseOrders.find(po => po.id === delivery.poId);
};

export const getPOStatus = (poId: string): PurchaseOrder["status"] => {
    const po = purchaseOrders.find(p => p.id === poId);
    if (!po) return "Draft";

    const poDeliveries = getDeliveriesForPO(poId);
    if (poDeliveries.length === 0) return po.status;

    // Compute cumulative accepted qty against ordered qty, per PO line
    const acceptedByLine = new Map<string, number>();
    for (const d of poDeliveries) {
        for (const ln of d.lines || []) {
            acceptedByLine.set(ln.poLineId, (acceptedByLine.get(ln.poLineId) || 0) + (ln.acceptedQty || 0));
        }
    }

    const lineStates = po.lines.map(l => {
        const accepted = acceptedByLine.get(l.id) || 0;
        if (accepted >= l.qty) return "full";
        if (accepted > 0) return "partial";
        return "none";
    });

    if (lineStates.every(s => s === "full")) return "Closed";
    if (lineStates.some(s => s === "partial" || s === "full")) return "Partial";
    return po.status === "Draft" ? "Draft" : "Ordered";
};
