import { Building2, List, BarChart3, LayoutDashboard } from "lucide-react";
import TempleLayout from "@/components/TempleLayout";

const navItems = [
  { label: "Dashboard", path: "/temple/institutions", icon: LayoutDashboard, description: "Institution overview & metrics" },
  { label: "All Institutions", path: "/temple/institutions/all", icon: List, description: "View & manage all institutions" },
];

const InstitutionLayout = () => {
  return <TempleLayout title="Institutions" icon={Building2} navItems={navItems} />;
};

export default InstitutionLayout;
