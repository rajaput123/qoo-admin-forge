import { Sparkles, CalendarCheck, List, Clock, BookOpen, IndianRupee, Users } from "lucide-react";
import TempleLayout from "@/components/TempleLayout";

const navItems = [
  { label: "Today", path: "/temple/offerings", icon: CalendarCheck, description: "Calendar & table operations" },
  { label: "Offerings List", path: "/temple/offerings/list", icon: List, description: "Master configuration" },
  { label: "Slot Management", path: "/temple/offerings/slots", icon: Clock, description: "Date-wise slot control" },
  { label: "Booking Management", path: "/temple/offerings/bookings", icon: BookOpen, description: "View and manage bookings" },
  { label: "Pricing & Rules", path: "/temple/offerings/pricing", icon: IndianRupee, description: "Pricing and booking policies" },
  { label: "Priest Assignment", path: "/temple/offerings/priests", icon: Users, description: "Assign priests to slots" },
  { label: "Panchang", path: "/temple/offerings/panchang", icon: BookOpen, description: "Daily Panchang" },
];

const OfferingsLayout = () => {
  return <TempleLayout title="Offerings" icon={Sparkles} navItems={navItems} />;
};

export default OfferingsLayout;
