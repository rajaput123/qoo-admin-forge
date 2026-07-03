import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Bell,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  HelpCircle,
  User,
  ChevronDown,
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

interface NavItemType {
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  description?: string;
  children?: NavItemType[];
  locked?: boolean;
  lockedHint?: string;
  external?: boolean;
}

interface QuickLinkType {
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface TempleLayoutProps {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  navItems: NavItemType[];
  quickLinks?: QuickLinkType[];
}

const TempleLayout = ({ title, icon: Icon, navItems, quickLinks }: TempleLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(() => {
    // Auto-expand group containing current path
    const set = new Set<string>();
    for (const item of navItems) {
      if (item.children?.some(c => location.pathname === c.path)) {
        set.add(item.label);
      }
    }
    return set;
  });

  const toggleGroup = (label: string) => {
    setExpandedGroups(prev => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 64 : 240 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed left-0 top-0 h-screen bg-white border-r border-border z-30 flex flex-col"
      >
        {/* Logo / Module Title */}
        <div className="h-14 flex items-center justify-center px-4 border-b border-border">
          <AnimatePresence mode="wait">
            {!collapsed ? (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => navigate("/temple-hub")}
                className="flex items-center gap-2 text-lg font-bold text-primary"
              >
                <Icon className="h-5 w-5" />
                <span className="truncate">{title}</span>
              </motion.button>
            ) : (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => navigate("/temple-hub")}
                className="text-primary"
              >
                <Icon className="h-5 w-5" />
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
                placeholder="Search..."
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
                Search
              </TooltipContent>
            </Tooltip>
          )}
        </div>

        <nav className="flex-1 px-2 py-2 space-y-0.5 overflow-auto">
          {navItems.map((item) => {
            const hasChildren = item.children && item.children.length > 0;
            const isGroupExpanded = expandedGroups.has(item.label);
            const fullPath = location.pathname + location.search;
            const active = fullPath === item.path || location.pathname === item.path ||
              (item.path === navItems[0]?.path && location.pathname === navItems[0]?.path.replace(/\/[^/]+$/, ''));
            const childActive = hasChildren && item.children!.some(c => fullPath === c.path || location.pathname === c.path);

            if (hasChildren) {
              const groupButton = (
                <button
                  key={item.path}
                  onClick={() => collapsed ? navigate(item.children![0].path) : toggleGroup(item.label)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200",
                    childActive
                      ? "text-primary font-medium bg-primary/5"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {!collapsed && (
                    <>
                      <span className="flex-1 text-left truncate">{item.label}</span>
                      <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", isGroupExpanded && "rotate-180")} />
                    </>
                  )}
                </button>
              );

              return (
                <div key={item.path}>
                  <Tooltip delayDuration={collapsed ? 0 : 500}>
                    <TooltipTrigger asChild>{groupButton}</TooltipTrigger>
                    <TooltipContent side="right" className="max-w-[200px]">
                      <p className="font-medium text-xs">{item.label}</p>
                      {item.description && <p className="text-xs text-muted-foreground">{item.description}</p>}
                    </TooltipContent>
                  </Tooltip>
                  <AnimatePresence>
                    {isGroupExpanded && !collapsed && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="ml-4 pl-3 border-l border-border/50 space-y-0.5 py-1">
                          {item.children!.map(child => {
                            const childIsActive = (location.pathname + location.search) === child.path || location.pathname === child.path;
                            return (
                              <Tooltip key={child.path} delayDuration={500}>
                                <TooltipTrigger asChild>
                                  <button
                                    onClick={() => navigate(child.path)}
                                    className={cn(
                                      "w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-[13px] transition-all duration-200",
                                      childIsActive
                                        ? "bg-primary text-primary-foreground"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                    )}
                                  >
                                    <child.icon className="h-3.5 w-3.5 shrink-0" />
                                    <span className="flex-1 text-left truncate">{child.label}</span>
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent side="right">
                                  <p className="text-xs">{child.description || child.label}</p>
                                </TooltipContent>
                              </Tooltip>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            }

            // Flat item (no children)
            const isLocked = item.locked;
            const button = (
              <button
                key={item.path}
                onClick={() => !isLocked && (item.external ? navigate(item.path) : navigate(item.path))}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200",
                  isLocked
                    ? "text-muted-foreground/50 cursor-not-allowed opacity-60"
                    : active
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {!collapsed && (
                  <>
                    <span className="flex-1 text-left truncate">{item.label}</span>
                    {isLocked && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full font-medium bg-muted text-muted-foreground">
                        🔒
                      </span>
                    )}
                    {!isLocked && item.badge && (
                      <span className={cn(
                        "text-[10px] px-1.5 py-0.5 rounded-full font-medium",
                        active
                          ? "bg-primary-foreground/20 text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      )}>
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </button>
            );

            return (
              <Tooltip key={item.path} delayDuration={collapsed ? 0 : 500}>
                <TooltipTrigger asChild>{button}</TooltipTrigger>
                <TooltipContent side="right" className="max-w-[200px]">
                  <p className="font-medium text-xs">{item.label}</p>
                  {isLocked && <p className="text-xs text-muted-foreground">Upgrade plan to unlock</p>}
                  {!isLocked && item.description && (
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  )}
                </TooltipContent>
              </Tooltip>
            );
          })}
          
          {/* Quick Links Section */}
          {quickLinks && quickLinks.length > 0 && (
            <div className="mt-4 pt-3 border-t border-border/50">
              {!collapsed && (
                <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Quick Links
                </p>
              )}
              <div className={cn("space-y-1", collapsed ? "px-0" : "px-1")}>
                {quickLinks.map((link) => {
                  const isActive = location.pathname === link.path;
                  const btn = (
                    <button
                      key={link.path}
                      onClick={() => navigate(link.path)}
                      className={cn(
                        "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 border",
                        isActive
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-primary/5 text-primary border-primary/20 hover:bg-primary/10 hover:border-primary/40"
                      )}
                    >
                      <link.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span className="truncate">{link.label}</span>}
                    </button>
                  );
                  return (
                    <Tooltip key={link.path} delayDuration={collapsed ? 0 : 500}>
                      <TooltipTrigger asChild>{btn}</TooltipTrigger>
                      <TooltipContent side="right">
                        <p className="text-xs">{link.label}</p>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
            </div>
          )}
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
                      RK
                    </AvatarFallback>
                  </Avatar>
                  {!collapsed && (
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium text-foreground truncate">Temple Admin</p>
                    </div>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align={collapsed ? "center" : "end"} side="top" className="w-52 bg-white border shadow-lg mb-1">
                <DropdownMenuItem onClick={() => navigate("/profile")} className="gap-2">
                  <User className="h-4 w-4" />
                  My Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/temple/settings")} className="gap-2">
                  <Settings className="h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2">
                  <HelpCircle className="h-4 w-4" />
                  Help & Support
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/login")} className="gap-2 text-destructive focus:text-destructive">
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
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default TempleLayout;
