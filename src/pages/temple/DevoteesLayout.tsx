import { Users, UsersRound, BarChart3 } from "lucide-react";
import TempleLayout from "@/components/TempleLayout";

const navItems = [
  { label: "All Devotees", path: "/temple/devotees", icon: Users, badge: "1,247", description: "Manage all devotee records" },
  { label: "Segments / Groups", path: "/temple/devotees/segments", icon: UsersRound, description: "Dynamic & static segments" },
  { label: "Insights Dashboard", path: "/temple/devotees/insights", icon: BarChart3, description: "CRM analytics & metrics" },
];

const DevoteesLayout = () => {
  return <TempleLayout title="Devotee Management" icon={Users} navItems={navItems} />;
};

export default DevoteesLayout;
