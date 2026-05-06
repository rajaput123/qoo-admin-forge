import { Building2, Image, Clock, MapPin, Phone, Globe, Users } from "lucide-react";
import TempleLayout from "@/components/TempleLayout";

const navItems = [
  { label: "Basic Information", path: "/temple/info", icon: Building2 },
  { label: "Layout Mapping", path: "/temple/info/layout", icon: MapPin },
  { label: "Facilities", path: "/temple/info/facilities", icon: Users },
  { label: "Branches", path: "/temple/info/branches", icon: Globe },
  { label: "Media & Virtual Tour", path: "/temple/info/media", icon: Image },
];

const TempleInfoLayout = () => {
  return <TempleLayout title="Temple Info" icon={Building2} navItems={navItems} />;
};

export default TempleInfoLayout;
