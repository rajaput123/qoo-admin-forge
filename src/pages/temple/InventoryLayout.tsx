import { LayoutDashboard, Package, ArrowLeftRight, FileText, SlidersHorizontal, BarChart3 } from "lucide-react";
import TempleLayout from "@/components/TempleLayout";

const navItems = [
  { label: "Dashboard", path: "/temple/inventory", icon: LayoutDashboard, description: "Stock overview & alerts" },
  { label: "Items", path: "/temple/inventory/items", icon: Package, badge: "20", description: "Item master data" },
  { label: "Purchases", path: "/temple/inventory/purchases", icon: FileText, description: "Procurement & POs" },
  { label: "Transactions", path: "/temple/inventory/transactions", icon: ArrowLeftRight, badge: "12", description: "Inward / Outward log" },
  { label: "Requests", path: "/temple/inventory/requests", icon: FileText, badge: "5", description: "Kitchen / Event requests" },
  { label: "Adjustments", path: "/temple/inventory/adjustments", icon: SlidersHorizontal, description: "Stock corrections" },
];

const InventoryLayout = () => {
  return <TempleLayout title="Stock & Inventory" icon={Package} navItems={navItems} />;
};

export default InventoryLayout;
