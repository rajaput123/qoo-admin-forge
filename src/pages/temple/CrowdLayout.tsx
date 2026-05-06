import { MapPin, LayoutDashboard, Map, List, Bell, TrendingUp, Settings, Database, AlertTriangle, Users } from "lucide-react";
import TempleLayout from "@/components/TempleLayout";

const navItems = [
  { label: "Crowd Dashboard", path: "/temple/crowd/dashboard", icon: LayoutDashboard, badge: "LIVE", description: "Live hierarchical view & heatmap" },
  { label: "Queue Management", path: "/temple/crowd/queues", icon: List, description: "Monitor queues & waiting times" },
  { label: "Heatmap View", path: "/temple/crowd/heatmap", icon: Map, description: "Visual density map overlay" },
  { label: "Alerts & Automation", path: "/temple/crowd/alerts-automation", icon: Bell, badge: "2", description: "Alert rules & automation" },
  { label: "Prediction & Forecast", path: "/temple/crowd/prediction-forecast", icon: TrendingUp, description: "Crowd surge prediction" },
  { label: "Control Panel", path: "/temple/crowd/control", icon: Settings, description: "Quick action controls" },
  { label: "Data Collection Workflow", path: "/temple/crowd/workflow", icon: Database, description: "How data is collected & processed" },
  { label: "Implementation Status", path: "/temple/crowd/status", icon: AlertTriangle, description: "Current phase & what's implemented" },
  { label: "Practical Operations", path: "/temple/crowd/practical", icon: Users, description: "How to collect data & operate in real-world" },
];

const CrowdLayout = () => {
  return <TempleLayout title="Crowd & Capacity" icon={MapPin} navItems={navItems} />;
};

export default CrowdLayout;
