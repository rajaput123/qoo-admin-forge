import { Heart, LayoutDashboard, Users, Wallet, FileBarChart, IndianRupee } from "lucide-react";
import TempleLayout from "@/components/TempleLayout";

const navItems = [
  { label: "Dashboard", path: "/temple/donations", icon: LayoutDashboard, description: "Donation overview & summary" },
  { label: "Donations", path: "/temple/donations/list", icon: IndianRupee, description: "View all donations by type" },
  { label: "Donors", path: "/temple/donations/donors", icon: Users, description: "Donor list & donation history" },
  { label: "Funds", path: "/temple/donations/funds", icon: Wallet, description: "Fund balances & management" },
];

const DonationsLayout = () => {
  return <TempleLayout title="Donation Management" icon={Heart} navItems={navItems} />;
};

export default DonationsLayout;
