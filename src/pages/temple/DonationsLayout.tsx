import { Heart, LayoutDashboard, Users, IndianRupee, BarChart3, Award, Settings2 } from "lucide-react";
import TempleLayout from "@/components/TempleLayout";

const navItems = [
  { label: "Dashboard",  path: "/temple/donations",          icon: LayoutDashboard, description: "Donation overview & summary" },
  { label: "Donations",  path: "/temple/donations/list",     icon: IndianRupee,     description: "View all donations by type" },
  { label: "Donors",     path: "/temple/donations/donors",   icon: Users,           description: "Donor registry & contact details" },
  { label: "80G Certificates", path: "/temple/donations/80g", icon: Award,          description: "Generate & download 80G receipts for IT filing" },
  { label: "Configuration", path: "/temple/donations/config", icon: Settings2,      description: "Configure donation business rules" },
  { label: "Reports",    path: "/temple/donations/reports",  icon: BarChart3,       description: "Donation & 80G reports" },
];

const DonationsLayout = () => {
  return <TempleLayout title="Donation Management" icon={Heart} navItems={navItems} />;
};

export default DonationsLayout;
