import { Crown, LayoutDashboard, Users, Settings2, Activity, Sparkles } from "lucide-react";
import TempleLayout from "@/components/TempleLayout";

const navItems = [
  {
    label: "VIP Dashboard",
    path: "/temple/vip",
    icon: LayoutDashboard,
    description: "VIP devotee insights & KPIs",
  },
  {
    label: "VIP Devotees",
    path: "/temple/vip/devotees",
    icon: Users,
    badge: "24",
    description: "Manage VIP devotees & profiles",
  },
  {
    label: "Levels & Privileges",
    path: "/temple/vip/levels",
    icon: Settings2,
    description: "VIP levels, benefits & governance",
  },
  {
    label: "Activity & Engagement",
    path: "/temple/vip/activity",
    icon: Activity,
    description: "VIP bookings, donations & visits",
  },
  {
    label: "Eligibility Engine",
    path: "/temple/vip/eligibility",
    icon: Sparkles,
    description: "Auto-detect & promote eligible devotees",
  },
];

const VipLayout = () => {
  return <TempleLayout title="VIP Devotee Management" icon={Crown} navItems={navItems} />;
};

export default VipLayout;

