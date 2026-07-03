import { LayoutDashboard, Users, UserPlus, Tags, FileText, Truck, CreditCard, Star, BarChart3 } from "lucide-react";
import TempleLayout from "@/components/TempleLayout";

const navItems = [
  { label: "Dashboard", path: "/temple/suppliers", icon: LayoutDashboard, description: "Overview & key metrics" },
  { label: "Supplier Registry", path: "/temple/suppliers/registry", icon: Users, badge: "34", description: "All approved suppliers" },
  { label: "Onboarding", path: "/temple/suppliers/onboarding", icon: UserPlus, badge: "5", description: "New supplier applications" },
  { label: "Categories & Materials", path: "/temple/suppliers/categories", icon: Tags, description: "Manage material categories" },
  { label: "Purchase Orders", path: "/temple/suppliers/purchase-orders", icon: FileText, badge: "12", description: "Procurement management" },
  { label: "Deliveries", path: "/temple/suppliers/deliveries", icon: Truck, badge: "8", description: "Track material receipts" },
  { label: "Payments", path: "/temple/suppliers/payments", icon: CreditCard, badge: "6", description: "Settlements & invoices" },
  { label: "Performance", path: "/temple/suppliers/performance", icon: Star, description: "Ratings & feedback" },
  { label: "Reports", path: "/temple/suppliers/reports", icon: BarChart3, description: "Procurement analytics" },
];

const SupplierLayout = () => {
  return <TempleLayout title="Supplier Management" icon={Truck} navItems={navItems} />;
};

export default SupplierLayout;
