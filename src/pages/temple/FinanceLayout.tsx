import {
  LayoutDashboard, ArrowRightLeft, BookOpen, ShieldCheck, Users,
  BarChart3, Tag, Wallet, Banknote, Building2, PiggyBank, FileText
} from "lucide-react";
import TempleLayout from "@/components/TempleLayout";

const navItems = [
  {
    label: "Dashboard",
    path: "/temple/finance",
    icon: LayoutDashboard,
    description: "Financial overview & analytics",
  },
  {
    label: "Accounts",
    path: "/temple/finance/accounts",
    icon: Building2,
    description: "View account balances & transaction history",
  },
  {
    label: "Transactions",
    path: "/temple/finance/transactions",
    icon: ArrowRightLeft,
    description: "All financial movements",
  },
  {
    label: "Funds",
    path: "/temple/finance/funds",
    icon: PiggyBank,
    description: "Fund-wise classification & tracking",
  },
  {
    label: "Accounting",
    path: "/temple/finance/accounting",
    icon: BookOpen,
    description: "Ledger & reconciliation",
    children: [
      { label: "Ledger", path: "/temple/finance/ledger", icon: BookOpen, description: "Double-entry accounting records" },
      { label: "Reconciliation", path: "/temple/finance/reconciliation", icon: ShieldCheck, description: "Match & verify transactions" },
    ],
  },
  {
    label: "Payroll",
    path: "/temple/finance/payroll",
    icon: Users,
    description: "Salary processing & payments",
  },
  {
    label: "Reports & Settings",
    path: "/temple/finance/reports-settings",
    icon: BarChart3,
    description: "Reports, categories & payment methods",
    children: [
      { label: "Reports", path: "/temple/finance/reports", icon: BarChart3, description: "Income, expense & fund reports" },
      { label: "Financial Statements", path: "/temple/finance/statements", icon: FileText, description: "P&L, Balance Sheet, Fund Flow" },
      { label: "Categories", path: "/temple/finance/categories", icon: Tag, description: "Manage income & expense categories" },
      { label: "Payment Methods", path: "/temple/finance/payment-methods", icon: Wallet, description: "Manage payment modes" },
    ],
  },
];

const FinanceLayout = () => {
  return <TempleLayout title="Finance & Accounts" icon={Banknote} navItems={navItems} />;
};

export default FinanceLayout;
