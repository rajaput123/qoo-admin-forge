import { ClipboardList, LayoutDashboard, List, User, AlertTriangle, CheckCircle2, Repeat } from "lucide-react";
import TempleLayout from "@/components/TempleLayout";

const navItems = [
  { label: "Dashboard", path: "/temple/tasks", icon: LayoutDashboard, description: "Operational overview" },
  { label: "All Tasks", path: "/temple/tasks/all", icon: List, description: "All tasks across modules" },
  { label: "My Tasks", path: "/temple/tasks/my", icon: User, description: "Tasks assigned to you" },
  { label: "Overdue Tasks", path: "/temple/tasks/overdue", icon: AlertTriangle, description: "Past due date" },
  { label: "Completed", path: "/temple/tasks/completed", icon: CheckCircle2, description: "Finished tasks" },
  { label: "Scheduled Templates", path: "/temple/tasks/templates", icon: Repeat, description: "Recurring task templates" },
];

const TasksLayout = () => {
  return <TempleLayout title="Task Management" icon={ClipboardList} navItems={navItems} />;
};

export default TasksLayout;
