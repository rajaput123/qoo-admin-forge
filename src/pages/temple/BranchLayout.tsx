import { GitBranch, List, BarChart3, LayoutDashboard } from "lucide-react";
import TempleLayout from "@/components/TempleLayout";

const navItems = [
  { label: "Dashboard", path: "/temple/branches", icon: LayoutDashboard, description: "Branch overview & metrics" },
  { label: "All Branches", path: "/temple/branches/all", icon: List, description: "View & manage all branches" },
];

const BranchLayout = () => {
  return <TempleLayout title="Branch Management" icon={GitBranch} navItems={navItems} />;
};

export default BranchLayout;
