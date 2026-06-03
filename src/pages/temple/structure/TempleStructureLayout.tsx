import { Landmark, Building2, Home, Sparkles, DoorOpen, Monitor, Network, MapPin } from "lucide-react";
import TempleLayout from "@/components/TempleLayout";

const navItems = [
  { label: "Main Temples", path: "/temple/structure", icon: Building2, description: "Primary temple structures" },
  { label: "Child Temples", path: "/temple/structure/child-temples", icon: Home, description: "Sub-temples and shrines" },
  { label: "Sacred Shrines", path: "/temple/structure/sacred", icon: Sparkles, description: "Deities, Samadhi & Brindavana shrines" },
  { label: "Halls & Rooms", path: "/temple/structure/halls", icon: DoorOpen, description: "Halls, rooms, and spaces" },
  { label: "Counters", path: "/temple/structure/counters", icon: Monitor, description: "Service counters and desks" },
  { label: "Hierarchy View", path: "/temple/structure/hierarchy", icon: Network, description: "Visual structure hierarchy" },
  { label: "Zones", path: "/temple/structure/zones", icon: MapPin, description: "Temple zones and areas" },
];

const TempleStructureLayout = () => {
  return <TempleLayout title="Temple Structure" icon={Landmark} navItems={navItems} />;
};

export default TempleStructureLayout;
