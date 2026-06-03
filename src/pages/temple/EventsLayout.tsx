import { CalendarDays, List, Calendar, IndianRupee, BarChart3, Archive } from "lucide-react";
import TempleLayout from "@/components/TempleLayout";

const navItems = [
  { label: "All Events", path: "/temple/events", icon: List, description: "Create & manage all events" },
  { label: "Calendar View", path: "/temple/events/calendar", icon: Calendar, description: "Visual event calendar" },
  { label: "Event Expenses", path: "/temple/events/expenses", icon: IndianRupee, description: "Track expenses across events" },
  { label: "Event Archive", path: "/temple/events/archive", icon: Archive, description: "Completed & archived events" },
];

const EventsLayout = () => {
  return <TempleLayout title="Event Management" icon={CalendarDays} navItems={navItems} />;
};

export default EventsLayout;
