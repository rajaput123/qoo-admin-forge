import { FolderKanban, LayoutDashboard, FileBarChart, Archive, Clock } from "lucide-react";
import TempleLayout from "@/components/TempleLayout";

const navItems = [
  { label: "Dashboard", path: "/temple/projects", icon: LayoutDashboard, description: "Overview of all projects & KPIs" },
  { label: "All Projects", path: "/temple/projects/all", icon: FolderKanban, description: "Manage all projects" },
  { label: "Timeline", path: "/temple/projects/timeline", icon: Clock, description: "Project timeline & milestones" },
  { label: "Archive", path: "/temple/projects/archive", icon: Archive, description: "Archived & completed projects" },
];

const ProjectsLayout = () => {
  return <TempleLayout title="Projects & Initiatives" icon={FolderKanban} navItems={navItems} />;
};

export default ProjectsLayout;
