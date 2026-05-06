import { Sparkles, IndianRupee, Calendar, Clock, Users } from "lucide-react";
import TempleLayout from "@/components/TempleLayout";

const navItems = [
  { label: "Seva Categories", path: "/temple/sevas", icon: Sparkles },
  { label: "Seva List", path: "/temple/sevas/list", icon: Sparkles, badge: "12" },
  { label: "Darshan Slots", path: "/temple/sevas/darshan", icon: Calendar },
  { label: "Pricing", path: "/temple/sevas/pricing", icon: IndianRupee },
  { label: "Capacity Control", path: "/temple/sevas/capacity", icon: Users },
];

const SevasLayout = () => {
  return <TempleLayout title="Sevas & Darshan" icon={Sparkles} navItems={navItems} />;
};

export default SevasLayout;
