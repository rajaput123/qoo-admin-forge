import { Settings, User, CreditCard, Users, LayoutGrid, Cog, FileText, Zap, FileType } from "lucide-react";
import TempleLayout from "@/components/TempleLayout";

const navItems = [
  { label: "Profile", path: "/temple/settings", icon: User, description: "Organization profile & contact details" },
  { label: "Plans & Pricing", path: "/temple/settings/subscription", icon: Zap, description: "View all plans & upgrade" },
  { label: "Finance", path: "/temple/settings/finance", icon: CreditCard, description: "Bank accounts & tax information" },
  { label: "Invoice", path: "/temple/settings/invoice", icon: FileText, description: "Invoice management & downloads" },
  { label: "Templates", path: "/temple/settings/templates", icon: FileType, description: "Configure Seva & Donation receipt templates" },
  { label: "Users & Access", path: "/temple/settings/users", icon: Users, description: "User management, roles & permissions" },
  { label: "Modules", path: "/temple/settings/modules", icon: LayoutGrid, description: "Module access control" },
  { label: "System", path: "/temple/settings/system", icon: Cog, description: "System-wide settings" },
];

const SettingsLayout = () => {
  return <TempleLayout title="Settings" icon={Settings} navItems={navItems} />;
};

export default SettingsLayout;
