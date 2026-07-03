import { Megaphone, LayoutDashboard, Bell, Newspaper, Video, MessageSquare, Users, Globe, Lock } from "lucide-react";
import TempleLayout from "@/components/TempleLayout";

const currentPlanId = "seva"; // TODO: get from context

const allNavItems = [
  { label: "Control Center", path: "/temple/communication", icon: LayoutDashboard, description: "Central communication hub", freePlan: false },
  { label: "Announcements", path: "/temple/communication/announcements", icon: Bell, description: "Official temple notices", freePlan: false },
  { label: "Media Communication", path: "/temple/communication/media", icon: Newspaper, description: "Press, social & digital media", freePlan: false },
  { label: "Live Broadcast", path: "/temple/communication/broadcast", icon: Video, description: "Streaming & live darshana", freePlan: false },
  { label: "Devotee Experience", path: "/temple/communication/experience", icon: MessageSquare, description: "Devotee experience feed", freePlan: false },
  { label: "Public Meetings", path: "/temple/communication/meetings", icon: Users, description: "Governance & official meetings", freePlan: false },
  { label: "Temple Website", path: "/temple/communication/website", icon: Globe, description: "Generate & manage temple website", freePlan: true, external: true },
];

const navItems = allNavItems.map(({ freePlan, ...rest }) => ({
  ...rest,
  locked: false,
}));

const CommunicationLayout = () => {
  return <TempleLayout title="PR & Communication" icon={Megaphone} navItems={navItems} />;
};

export default CommunicationLayout;
