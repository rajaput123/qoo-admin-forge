import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  CreditCard,
  Wallet,
  Receipt,
  ShoppingCart,
  FileText,
  Users,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  FolderOpen,
  Layers,
  Send,
  Printer,
  Plus,
  GitMerge,
  Landmark,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SidebarGroup {
  title: string;
  items: {
    label: string;
    path: string;
    icon: React.ComponentType<{ className?: string }>;
  }[];
}

const sidebarGroups: SidebarGroup[] = [
  {
    title: "OVERVIEW",
    items: [
      {
        label: "Dashboard",
        path: "/temple/finance",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: "TRANSACTIONS",
    items: [
      {
        label: "Journal Voucher",
        path: "/temple/finance/vouchers",
        icon: BookOpen,
      },
      {
        label: "Payment Gateway Receipts",
        path: "/temple/finance/gateway-receipts",
        icon: CreditCard,
      },
      {
        label: "Cash & Non Cash",
        path: "/temple/finance/accounts",
        icon: Wallet,
      },
      {
        label: "Payments & Expenses",
        path: "/temple/finance/transactions",
        icon: Receipt,
      },
    ],
  },
  {
    title: "VENDORS & PAYABLES",
    items: [
      {
        label: "Purchase Orders",
        path: "/temple/finance/purchase-orders",
        icon: ShoppingCart,
      },
      {
        label: "Bills & Invoices",
        path: "/temple/finance/invoices",
        icon: FileText,
      },
      {
        label: "Vendor Payments",
        path: "/temple/finance/payments",
        icon: Send,
      },
    ],
  },
  {
    title: "HR & PAYROLL",
    items: [
      {
        label: "Payroll",
        path: "/temple/finance/payroll",
        icon: Users,
      },
    ],
  },
  {
    title: "FLOW & ASSETS",
    items: [
      {
        label: "Cash & Fund Flow",
        path: "/temple/finance/funds",
        icon: Layers,
      },
    ],
  },
  {
    title: "RECONCILIATION",
    items: [
      { label: "Transactions Recon", path: "/temple/finance/reconciliation", icon: GitMerge },
      { label: "Bank Statement Recon", path: "/temple/finance/reconciliation/bank", icon: Landmark },
    ],
  },
  {
    title: "ACCOUNTING",
    items: [
      {
        label: "General Ledger",
        path: "/temple/finance/ledger",
        icon: BookOpen,
      },
      {
        label: "Financial Reports",
        path: "/temple/finance/statements",
        icon: FileText,
      },
    ],
  },
];

const getPageTitle = (pathname: string) => {
  if (pathname === "/temple/finance" || pathname === "/temple/finance/") return "Financial Dashboard";
  if (pathname.includes("/vouchers")) return "Journal Voucher";
  if (pathname.includes("/gateway-receipts")) return "Payment Gateway Receipts";
  if (pathname.includes("/accounts")) return "Cash & Non Cash";
  if (pathname.includes("/transactions")) return "Payments & Expense Register";
  if (pathname.includes("/create-po")) return "Create Purchase Order (PO)";
  if (pathname.includes("/purchase-orders")) return "Purchase Orders Register";
  if (pathname.includes("/invoices")) return "Bills & Invoices Register";
  if (pathname.includes("/payments")) return "Vendor Payments";
  if (pathname.includes("/payroll")) return "Payroll — Priest & Staff";
  if (pathname.includes("/funds")) return "Cash & Fund Flow Statement";
  if (pathname.includes("/ledger")) return "General Ledger";
  if (pathname.includes("/reconciliation/bank")) return "Bank Statement Reconciliation";
  if (pathname.includes("/reconciliation")) return "Transactions Reconciliation";
  if (pathname.includes("/statements")) return "Financial Reports";
  return "Finance & Accounts";
};

const hideTopbarActions = (pathname: string) =>
  pathname === "/temple/finance" || pathname === "/temple/finance/" || pathname.includes("/funds");

const FinanceLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (path: string) => {
    const current = location.pathname + location.search;
    if (path.includes("?")) {
      return current === path;
    }
    return location.pathname === path;
  };

  const isGroupActive = (group: SidebarGroup) => {
    return group.items.some((item) => isActive(item.path));
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-screen bg-white border-r border-border z-30 flex flex-col transition-all duration-300",
          collapsed ? "w-16" : "w-64"
        )}
      >
        {/* Sidebar Header */}
        <div className="h-14 flex items-center px-4 border-b border-border shrink-0">
          <button
            onClick={() => navigate("/temple-hub")}
            className="flex items-center gap-2.5 font-bold text-left transition-opacity hover:opacity-80 overflow-hidden"
          >
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <FolderOpen className="h-4.5 w-4.5" />
            </div>
            {!collapsed && (
              <span className="text-primary text-[15px] font-bold tracking-tight whitespace-nowrap">
                Finance System
              </span>
            )}
          </button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-5 overflow-y-auto">
          {sidebarGroups.map((group, gIdx) => {
            const groupActive = isGroupActive(group);
            return (
              <div key={gIdx} className="space-y-1.5">
                {!collapsed && (
                  <p
                    className={cn(
                      "px-2 text-[10px] font-bold tracking-wider uppercase transition-colors duration-150",
                      groupActive ? "text-primary font-extrabold" : "text-muted-foreground"
                    )}
                  >
                    {group.title}
                  </p>
                )}
                <div className="space-y-1">
                  {group.items.map((item, iIdx) => {
                    const active = isActive(item.path);
                    return (
                      <button
                        key={iIdx}
                        onClick={() => navigate(item.path)}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-150 font-medium",
                          active
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        )}
                      >
                        <item.icon
                          className={cn(
                            "h-4 w-4 shrink-0",
                            active ? "text-primary-foreground" : "text-muted-foreground"
                          )}
                        />
                        {!collapsed && (
                          <span className="truncate text-[13px]">{item.label}</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>

        {/* Sidebar Footer - Profile Section */}
        <div className="p-3 border-t border-border bg-muted/30 shrink-0">
          <div
            className={cn(
              "flex items-center justify-between gap-2",
              collapsed ? "flex-col" : "flex-row"
            )}
          >
            <div className="flex items-center gap-3 min-w-0">
              <Avatar className="h-9 w-9 shrink-0">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                  SH
                </AvatarFallback>
              </Avatar>
              {!collapsed && (
                <div className="min-w-0 text-left">
                  <p className="text-sm font-semibold text-foreground truncate leading-none">
                    Shashank
                  </p>
                  <span className="text-[11px] text-muted-foreground font-medium leading-none mt-1 block">
                    SuperAdmin
                  </span>
                </div>
              )}
            </div>
            {!collapsed && (
              <button
                onClick={() => navigate("/login")}
                className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                title="Log Out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Collapse/Expand Toggle Button on Border */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className={cn(
          "fixed top-1/2 -translate-y-1/2 z-40 p-1.5 bg-white border border-border rounded-full shadow-sm hover:bg-muted text-muted-foreground hover:text-foreground transition-all duration-300",
          collapsed ? "left-[52px]" : "left-[244px]"
        )}
      >
        {collapsed ? (
          <PanelLeftOpen className="h-3.5 w-3.5" />
        ) : (
          <PanelLeftClose className="h-3.5 w-3.5" />
        )}
      </button>

      {/* Main content pane */}
      <main
        className={cn(
          "flex-1 transition-all duration-300 min-w-0 flex flex-col min-h-screen",
          collapsed ? "ml-16" : "ml-64"
        )}
      >
        <div className="p-6 flex-1 flex flex-col">
          {/* Topbar — matches temple Finance.jsx */}
          {!location.pathname.includes("/reconciliation") && (
            <div className="flex items-center justify-between mb-5 pb-4 border-b border-border shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <h1 className="text-lg font-semibold truncate">{getPageTitle(location.pathname)}</h1>
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[11px] shrink-0">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse inline-block mr-1.5" />
                  Live
                </Badge>
              </div>
              {!hideTopbarActions(location.pathname) && (
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    size="sm"
                    className="text-xs gap-1.5"
                    onClick={() => navigate("/temple/finance/vouchers?action=new")}
                  >
                    <Plus className="h-3.5 w-3.5" /> New Voucher
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs gap-1.5" onClick={() => window.print()}>
                    <Printer className="h-3.5 w-3.5" /> Print
                  </Button>
                </div>
              )}
            </div>
          )}
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default FinanceLayout;
