import { useLocation } from "react-router-dom";
import {
  BarChart3, Heart, CalendarDays, IndianRupee, Calendar, Sparkles,
  FolderKanban, GitBranch, Building2, Crown, Briefcase, Users,
  MessageSquare, LayoutDashboard, Table2, FileText, ListChecks,
  Receipt, ClipboardList, BookOpen, Truck, UserCheck, Star,
  Wallet, Scale, ShoppingCart, Package, Activity, Milestone,
  Clock, CreditCard, CalendarCheck, Shield, AlertTriangle,
} from "lucide-react";
import TempleLayout from "@/components/TempleLayout";

const moduleConfigs: Record<string, {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  navItems: { label: string; path: string; icon: React.ComponentType<{ className?: string }>; description?: string }[];
}> = {
  donations: {
    title: "Donation Reports",
    icon: Heart,
    navItems: [
      { label: "KPIs", path: "/temple/reports/donations", icon: LayoutDashboard, description: "Key performance indicators" },
      { label: "Donation Records", path: "/temple/reports/donations/tables?tab=records", icon: FileText, description: "All donation transactions" },
      { label: "Donor Registry", path: "/temple/reports/donations/tables?tab=donors", icon: Users, description: "Registered donor details" },
      { label: "Receipt Log", path: "/temple/reports/donations/tables?tab=receipts", icon: Receipt, description: "Receipt generation log" },
      { label: "Top Donors", path: "/temple/reports/donations/tables?tab=top-donors", icon: Star, description: "Top 10 donors by contribution" },
      
    ],
  },
  events: {
    title: "Event Reports",
    icon: CalendarDays,
    navItems: [
      { label: "KPIs", path: "/temple/reports/events", icon: LayoutDashboard, description: "Key performance indicators" },
      { label: "Event Records", path: "/temple/reports/events/tables?tab=events", icon: FileText, description: "All event data" },
      { label: "Event Expenses", path: "/temple/reports/events/tables?tab=expenses", icon: Wallet, description: "Expense breakdown" },
      { label: "Registrations", path: "/temple/reports/events/tables?tab=registrations", icon: ClipboardList, description: "Registration details" },
      { label: "Event Summary", path: "/temple/reports/events/tables?tab=event-summary", icon: Table2, description: "Event-wise summary" },
    ],
  },
  finance: {
    title: "Finance Reports",
    icon: IndianRupee,
    navItems: [
      { label: "KPIs", path: "/temple/reports/finance", icon: LayoutDashboard, description: "Key performance indicators" },
      { label: "Transactions", path: "/temple/reports/finance/tables?tab=transactions", icon: FileText, description: "All financial transactions" },
      { label: "Ledger", path: "/temple/reports/finance/tables?tab=ledger", icon: BookOpen, description: "Account ledger" },
      { label: "Budget vs Actual", path: "/temple/reports/finance/tables?tab=budgets", icon: Scale, description: "Budget tracking" },
      { label: "Variance Analysis", path: "/temple/reports/finance/tables?tab=variance", icon: BarChart3, description: "Budget vs actual variance" },
    ],
  },
  bookings: {
    title: "Booking Reports",
    icon: Calendar,
    navItems: [
      { label: "KPIs", path: "/temple/reports/bookings", icon: LayoutDashboard, description: "Key performance indicators" },
      { label: "Booking Records", path: "/temple/reports/bookings/tables?tab=bookings", icon: FileText, description: "All booking transactions" },
      { label: "Cancellations & Refunds", path: "/temple/reports/bookings/tables?tab=cancellations", icon: ListChecks, description: "Cancellation data" },
      { label: "Slot Utilization", path: "/temple/reports/bookings/tables?tab=slots", icon: Clock, description: "Slot usage analytics" },
      { label: "Seva Performance", path: "/temple/reports/bookings/tables?tab=seva", icon: Table2, description: "Seva-wise booking performance" },
    ],
  },
  offerings: {
    title: "Offering Reports",
    icon: Sparkles,
    navItems: [
      { label: "KPIs", path: "/temple/reports/offerings", icon: LayoutDashboard, description: "Key performance indicators" },
      { label: "Offering Records", path: "/temple/reports/offerings/tables?tab=offerings", icon: FileText, description: "All offering data" },
      { label: "Ritual Performance", path: "/temple/reports/offerings/tables?tab=rituals", icon: Table2, description: "Ritual-wise performance" },
    ],
  },
  projects: {
    title: "Project Reports",
    icon: FolderKanban,
    navItems: [
      { label: "KPIs", path: "/temple/reports/projects", icon: LayoutDashboard, description: "Key performance indicators" },
      { label: "Project Details", path: "/temple/reports/projects/tables?tab=project-details", icon: ClipboardList, description: "All project data" },
      { label: "Funding Summary", path: "/temple/reports/projects/tables?tab=funding-summary", icon: FileText, description: "Funding & budget overview" },
      { label: "Progress Updates", path: "/temple/reports/projects/tables?tab=progress-updates", icon: ListChecks, description: "Timeline progress entries" },
      { label: "Donation Records", path: "/temple/reports/projects/tables?tab=donations", icon: Table2, description: "Project donations" },
    ],
  },
  hr: {
    title: "People & HR Reports",
    icon: Users,
    navItems: [
      { label: "KPIs", path: "/temple/reports/hr", icon: LayoutDashboard, description: "Key performance indicators" },
      { label: "Employees", path: "/temple/reports/hr/tables?tab=employees", icon: Users, description: "Employee records" },
      { label: "Attendance Log", path: "/temple/reports/hr/tables?tab=attendance", icon: CalendarCheck, description: "Daily attendance" },
      { label: "Leave Records", path: "/temple/reports/hr/tables?tab=leaves", icon: CalendarDays, description: "Leave applications" },
      { label: "Payroll", path: "/temple/reports/hr/tables?tab=payroll", icon: CreditCard, description: "Salary & payroll" },
      { label: "Dept Attendance", path: "/temple/reports/hr/tables?tab=dept-attendance", icon: Table2, description: "Attendance by department" },
      { label: "Leave Utilization", path: "/temple/reports/hr/tables?tab=leave-utilization", icon: CalendarDays, description: "Leave utilization summary" },
      { label: "Dept Expenses", path: "/temple/reports/hr/tables?tab=dept-expenses", icon: Wallet, description: "Department-wise expenses" },
    ],
  },
  vip: {
    title: "VIP Reports",
    icon: Crown,
    navItems: [
      { label: "KPIs", path: "/temple/reports/vip", icon: LayoutDashboard, description: "Key performance indicators" },
      { label: "VIP Devotees", path: "/temple/reports/vip/tables?tab=vips", icon: Star, description: "VIP member list" },
      { label: "VIP Activity Log", path: "/temple/reports/vip/tables?tab=activity", icon: Activity, description: "VIP interactions" },
      { label: "Contribution Table", path: "/temple/reports/vip/tables?tab=contributions", icon: Table2, description: "VIP contribution details" },
      { label: "Governance", path: "/temple/reports/vip/tables?tab=governance", icon: Shield, description: "Governance snapshot" },
    ],
  },
  freelancers: {
    title: "Freelancer Reports",
    icon: Briefcase,
    navItems: [
      { label: "KPIs", path: "/temple/reports/freelancers", icon: LayoutDashboard, description: "Key performance indicators" },
      { label: "Freelancer Records", path: "/temple/reports/freelancers/tables?tab=freelancers", icon: FileText, description: "All freelancer data" },
      { label: "Payment History", path: "/temple/reports/freelancers/tables?tab=payments", icon: CreditCard, description: "Payment records" },
      { label: "Assignment Log", path: "/temple/reports/freelancers/tables?tab=assignments", icon: ClipboardList, description: "Task assignments" },
      { label: "Performance Ranking", path: "/temple/reports/freelancers/tables?tab=performance", icon: Table2, description: "Freelancer performance" },
    ],
  },
  feedback: {
    title: "Feedback Reports",
    icon: MessageSquare,
    navItems: [
      { label: "KPIs", path: "/temple/reports/feedback", icon: LayoutDashboard, description: "Key performance indicators" },
      { label: "Feedback Records", path: "/temple/reports/feedback/tables?tab=feedback", icon: FileText, description: "All feedback data" },
      { label: "Escalations", path: "/temple/reports/feedback/tables?tab=escalations", icon: ListChecks, description: "Escalated issues" },
      { label: "Survey Responses", path: "/temple/reports/feedback/tables?tab=surveys", icon: ClipboardList, description: "Survey data" },
      { label: "Category Analysis", path: "/temple/reports/feedback/tables?tab=categories", icon: Table2, description: "Category-wise analysis" },
      { label: "Monthly Report", path: "/temple/reports/feedback/tables?tab=monthly", icon: Calendar, description: "Monthly feedback report" },
    ],
  },
  inventory: {
    title: "Inventory Reports",
    icon: BarChart3,
    navItems: [
      { label: "KPIs", path: "/temple/reports/inventory", icon: LayoutDashboard, description: "Key performance indicators" },
      { label: "Stock Register", path: "/temple/reports/inventory/tables?tab=stock", icon: Package, description: "Current stock levels" },
      { label: "Purchase Orders", path: "/temple/reports/inventory/tables?tab=purchases", icon: ShoppingCart, description: "PO records" },
      { label: "Consumption Log", path: "/temple/reports/inventory/tables?tab=consumption", icon: Activity, description: "Usage tracking" },
      { label: "Stock Alerts", path: "/temple/reports/inventory/tables?tab=alerts", icon: AlertTriangle, description: "Low & out of stock items" },
    ],
  },
  suppliers: {
    title: "Supplier Reports",
    icon: BarChart3,
    navItems: [
      { label: "KPIs", path: "/temple/reports/suppliers", icon: LayoutDashboard, description: "Key performance indicators" },
      { label: "Supplier Registry", path: "/temple/reports/suppliers/tables?tab=suppliers", icon: FileText, description: "All supplier data" },
      { label: "Invoices", path: "/temple/reports/suppliers/tables?tab=invoices", icon: Receipt, description: "Invoice records" },
      { label: "Delivery Log", path: "/temple/reports/suppliers/tables?tab=deliveries", icon: Truck, description: "Delivery tracking" },
      { label: "Performance Table", path: "/temple/reports/suppliers/tables?tab=performance", icon: Table2, description: "Supplier performance" },
      { label: "Pending Payments", path: "/temple/reports/suppliers/tables?tab=pending-payments", icon: AlertTriangle, description: "Outstanding payments" },
    ],
  },
};

const ReportsLayout = () => {
  const location = useLocation();
  const segments = location.pathname.split("/");
  const moduleKey = segments[3] || "";

  const config = moduleConfigs[moduleKey];

  const title = config?.title || "Reports Center";
  const icon = config?.icon || BarChart3;

  const quickLinks = [
    { label: "All Reports", path: "/temple/reports", icon: BarChart3 },
  ];

  const navItems = config?.navItems || [];

  return <TempleLayout title={title} icon={icon} navItems={navItems} quickLinks={quickLinks} />;
};

export default ReportsLayout;
