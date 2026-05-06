import { Briefcase, Users, ClipboardList, CreditCard, Star, BarChart3 } from "lucide-react";
import TempleLayout from "@/components/TempleLayout";

const navItems = [
  { label: "All Freelancers", path: "/temple/freelancers", icon: Users, badge: "34", description: "Manage all freelancer records" },
  { label: "Assignments", path: "/temple/freelancers/assignments", icon: ClipboardList, badge: "12", description: "Track freelancer assignments" },
  { label: "Payments", path: "/temple/freelancers/payments", icon: CreditCard, badge: "8", description: "Settlements & invoices" },
  { label: "Performance", path: "/temple/freelancers/performance", icon: Star, description: "Ratings & reviews" },
];

const FreelancerLayout = () => {
  return <TempleLayout title="Freelancer Management" icon={Briefcase} navItems={navItems} />;
};

export default FreelancerLayout;
