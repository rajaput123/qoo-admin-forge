import { Heart, LayoutDashboard, Users, IndianRupee, FileSpreadsheet } from "lucide-react";
import TempleLayout from "@/components/TempleLayout";

const navItems = [
  { label: "Dashboard", path: "/temple/donations", icon: LayoutDashboard, description: "Donation overview & summary" },
  { label: "Donations", path: "/temple/donations/list", icon: IndianRupee, description: "View all donations by type" },
  { label: "Donors", path: "/temple/donations/donors", icon: Users, description: "Donors, receipts & 80G certificates" },
  { label: "Form 10BD", path: "/temple/donations/form-10bd", icon: FileSpreadsheet, description: "Annual statement CSV for IT e-filing" },
];

const DonationsLayout = () => {
  return <TempleLayout title="Donation Management" icon={Heart} navItems={navItems} />;
};

export default DonationsLayout;
