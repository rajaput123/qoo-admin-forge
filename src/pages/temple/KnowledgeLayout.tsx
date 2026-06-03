import { BookOpen, LayoutDashboard, FolderTree, UserPlus, Library, MessageSquare } from "lucide-react";
import TempleLayout from "@/components/TempleLayout";

const navItems = [
  { label: "Dashboard", path: "/temple/knowledge", icon: LayoutDashboard, description: "Knowledge overview & stats" },
  { label: "Category Management", path: "/temple/knowledge/categories", icon: FolderTree, description: "Organize knowledge categories" },
  { label: "Onboarding", path: "/temple/knowledge/onboarding", icon: UserPlus, description: "Onboarding guides & checklists" },
  { label: "Knowledge Library", path: "/temple/knowledge/library", icon: Library, description: "Documents, SOPs & knowledge base" },
  { label: "Chat Assist", path: "/temple/knowledge/chat", icon: MessageSquare, description: "AI-powered knowledge assistant" },
];

const KnowledgeLayout = () => {
  return <TempleLayout title="Knowledge Management" icon={BookOpen} navItems={navItems} />;
};

export default KnowledgeLayout;
