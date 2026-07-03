import { LayoutDashboard, Package, BookOpen, Factory, Warehouse, Store, Globe, Heart, AlertTriangle, BarChart3 } from "lucide-react";
import TempleLayout from "@/components/TempleLayout";

const navItems = [
  { label: "Dashboard", path: "/temple/prasadam", icon: LayoutDashboard, description: "Overview & key metrics" },
  { label: "Prasadam Master", path: "/temple/prasadam/master", icon: Package, badge: "24", description: "All prasadam types" },
  { label: "Recipe & Ingredients", path: "/temple/prasadam/recipes", icon: BookOpen, description: "Recipe & ingredient mapping" },
  { label: "Production Planning", path: "/temple/prasadam/planning", icon: Factory, description: "Daily & festival planning" },
  { label: "Batch Production", path: "/temple/prasadam/batches", icon: Factory, badge: "8", description: "Batch tracking & ledger" },
  { label: "Finished Stock", path: "/temple/prasadam/stock", icon: Warehouse, description: "Finished prasadam stock" },
  { label: "Counter Allocation", path: "/temple/prasadam/counters", icon: Store, badge: "5", description: "Counter allocation & reconciliation" },
  { label: "Online Booking", path: "/temple/prasadam/online", icon: Globe, description: "Online reservation allocation" },
  { label: "Sponsorship", path: "/temple/prasadam/sponsorship", icon: Heart, description: "Sponsorship allocation" },
  { label: "Expiry & Wastage", path: "/temple/prasadam/expiry", icon: AlertTriangle, badge: "3", description: "Expiry control & wastage log" },
  { label: "Reports", path: "/temple/prasadam/reports", icon: BarChart3, description: "Production & distribution analytics" },
];

const PrasadamLayout = () => {
  return <TempleLayout title="Prasadam Management" icon={Package} navItems={navItems} />;
};

export default PrasadamLayout;
