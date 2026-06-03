import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  ClipboardList,
  ShieldCheck,
  UserPlus,
  AlertTriangle,
  FileCheck,
  Search,
  Bell,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  HelpCircle,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const sidebarItems = [
  { 
    label: "Overview", 
    icon: LayoutDashboard, 
    path: "/domain/onboarding/overview", 
    description: "Operational metrics, funnel analytics, and activity logs" 
  },
  { 
    label: "Registration Pipeline", 
    icon: ClipboardList, 
    path: "/domain/onboarding/registration-pipeline", 
    description: "Manage temple self-registration submissions" 
  },
  { 
    label: "Verification Queue", 
    icon: ShieldCheck, 
    path: "/domain/onboarding/verification-queue", 
    description: "Document verification and compliance checks" 
  },
  { 
    label: "Direct Onboarding", 
    icon: UserPlus, 
    path: "/domain/onboarding/direct-onboarding", 
    description: "Platform-initiated temple and tenant creation" 
  },
  { 
    label: "Compliance & Risk", 
    icon: AlertTriangle, 
    path: "/domain/onboarding/compliance-risk", 
    description: "Risk monitoring and compliance oversight" 
  },
  { 
    label: "Approval Logs", 
    icon: FileCheck, 
    path: "/domain/onboarding/approval-logs", 
    description: "Complete audit trail of all onboarding actions" 
  },
];

const OnboardingLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 64 : 240 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed left-0 top-0 h-screen bg-white border-r border-border z-30 flex flex-col"
      >
        {/* Logo */}
        <div className="h-14 flex items-center justify-center px-4 border-b border-border">
          <AnimatePresence mode="wait">
            {!collapsed ? (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => navigate("/hub")}
                className="text-lg font-bold text-primary"
              >
                Qoo
              </motion.button>
            ) : (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => navigate("/hub")}
                className="text-lg font-bold text-primary"
              >
                Q
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Global Search */}
        <div className={cn("p-3 pb-2", collapsed && "px-2")}>
          {!collapsed ? (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search onboarding..."
                className="h-9 pl-9 bg-muted/50 border-0 text-sm"
              />
            </div>
          ) : (
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <button className="w-full p-2 rounded-lg hover:bg-muted transition-colors flex items-center justify-center">
                  <Search className="h-4 w-4 text-muted-foreground" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="text-xs">
                Search Onboarding
              </TooltipContent>
            </Tooltip>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-2 space-y-0.5 overflow-auto">
          {sidebarItems.map((item) => {
            const active = location.pathname.startsWith(item.path);
            const button = (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </button>
            );

            return (
              <Tooltip key={item.path} delayDuration={collapsed ? 0 : 500}>
                <TooltipTrigger asChild>{button}</TooltipTrigger>
                <TooltipContent side="right" className="max-w-[200px]">
                  <p className="font-medium text-xs">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </nav>

        {/* Bottom - Profile + Notification */}
        <div className="p-2 border-t border-border">
          <div className={cn(
            "flex items-center gap-2",
            collapsed ? "flex-col" : "flex-row"
          )}>
            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className={cn(
                  "flex-1 flex items-center gap-3 px-2 py-2 rounded-lg transition-all hover:bg-muted",
                  collapsed && "justify-center px-0"
                )}>
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                      SA
                    </AvatarFallback>
                  </Avatar>
                  {!collapsed && (
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium text-foreground truncate">Super Admin</p>
                    </div>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align={collapsed ? "center" : "end"} side="top" className="w-52 bg-white border shadow-lg mb-1">
                <DropdownMenuItem onClick={() => navigate("/profile")} className="gap-2">
                  <Settings className="h-4 w-4" />
                  My Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2">
                  <HelpCircle className="h-4 w-4" />
                  Help & Support
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/")} className="gap-2 text-destructive focus:text-destructive">
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Notification Bell - Right side */}
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
                  <Bell className="h-4 w-4 text-muted-foreground" />
                  <span className="absolute top-1 right-1 h-2 w-2 bg-destructive rounded-full" />
                </button>
              </TooltipTrigger>
              <TooltipContent side={collapsed ? "right" : "top"}>
                <p>Notifications</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </motion.aside>

      {/* Collapse Toggle on Divider */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className={cn(
          "fixed top-1/2 -translate-y-1/2 z-40 p-1.5 bg-white border border-border rounded-full shadow-md hover:bg-muted transition-all duration-300",
          collapsed ? "left-[52px]" : "left-[228px]"
        )}
      >
        {collapsed ? (
          <PanelLeftOpen className="h-4 w-4 text-muted-foreground" />
        ) : (
          <PanelLeftClose className="h-4 w-4 text-muted-foreground" />
        )}
      </button>

      {/* Main Content */}
      <main 
        className={cn(
          "flex-1 transition-all duration-300",
          collapsed ? "ml-16" : "ml-60"
        )}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default OnboardingLayout;
