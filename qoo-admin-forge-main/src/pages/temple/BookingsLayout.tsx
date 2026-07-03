import { Calendar, Clock, BookOpen, Store, UserCheck, BarChart3, Cookie } from "lucide-react";
import TempleLayout from "@/components/TempleLayout";

const navItems = [
  { label: "Today", path: "/temple/bookings", icon: Clock, badge: "Live" },
  { label: "All Bookings", path: "/temple/bookings/all", icon: BookOpen, badge: "156" },
  { label: "Counter Booking", path: "/temple/bookings/counter", icon: Store },
  { label: "Prasad Counter", path: "/temple/bookings/prasad", icon: Cookie },
  { label: "Attendance", path: "/temple/bookings/attendance", icon: UserCheck },
];

const BookingsLayout = () => {
  return <TempleLayout title="Booking Management" icon={Calendar} navItems={navItems} />;
};

export default BookingsLayout;
