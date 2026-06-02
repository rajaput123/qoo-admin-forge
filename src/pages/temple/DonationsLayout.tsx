import { Heart, LayoutDashboard, Users, Wallet, IndianRupee, Receipt, FileSpreadsheet } from "lucide-react";
import TempleLayout from "@/components/TempleLayout";

const navItems = [
  { label: "Dashboard", path: "/temple/donations", icon: LayoutDashboard, description: "Donation overview & summary" },
  { label: "Donations", path: "/temple/donations/list", icon: IndianRupee, description: "View all donations by type" },
  { label: "Donors", path: "/temple/donations/donors", icon: Users, description: "Donor list & donation history" },
  { label: "Funds", path: "/temple/donations/funds", icon: Wallet, description: "Fund balances & management" },
  { label: "Receipts & 80G", path: "/temple/donations/receipts", icon: Receipt, description: "Receipts & Form 10BE certificates (bulk ZIP)" },
  { label: "Form 10BD", path: "/temple/donations/form-10bd", icon: FileSpreadsheet, description: "Annual statement CSV for IT e-filing" },
];

const DonationsLayout = () => {
  return <TempleLayout title="Donation Management" icon={Heart} navItems={navItems} />;
};

export default DonationsLayout;
