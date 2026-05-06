import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Building2,
  Calendar,
  Heart,
  Users,
  Megaphone,
  Package,
  ClipboardList,
  BarChart3,
  Settings,
  LogOut,
  Bell,
  User,
  HelpCircle,
  AlertCircle,
  Sparkles,
  Video,
  MapPin,
  Briefcase,
  X,
  Crown,
  ShieldAlert,
  Clock,
  BookOpen,
  CalendarDays,
  GitBranch,
  Boxes,
  UserCheck,
  Landmark,
  Truck,
  UtensilsCrossed,
  FolderKanban,
  IndianRupee,
  Wallet,
  Palette,
  Lock,
  Zap,
  ArrowRight,
} from "lucide-react";
import DemoVideoModal from "@/components/DemoVideoModal";
import UpgradeModal from "@/components/UpgradeModal";
import LotusBloom from "@/components/LotusBloom";
import { isModuleAccessible, getMinimumPlan, formatPrice } from "@/lib/plans";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Account status types
type AccountStatus = "active" | "trial" | "expired" | "suspended" | "compliance_pending";

// Mock tenant data - simulates different states
const tenantData = {
  templeName: "Sri Venkateswara Temple",
  tenantId: "TNT-2024-001234",
  plan: "Prarambh",
  planId: "prarambh", // Current plan ID for access control
  tier: "Free",
  status: "active" as AccountStatus,
  trialDaysLeft: 0,
  region: "Karnataka",
  healthScore: "Healthy",
  subscriptionExpiry: "—",
  complianceIssues: [],
  // Subscription / discount info
  billingCycle: "Annual" as "Annual" | "Monthly",
  discountPercent: 15, // 0 = no discount applied
  discountLabel: "Annual Saver",
  nextRenewalDate: "12 Apr 2026",
};

// All Temple Management Modules matching reference image
const allModules = [
  // Temple & Worship
  { id: "temple-structure", title: "Temple Structure", icon: Landmark, enabled: true, path: "/temple/structure",
    description: "Temple hierarchy, shrines, halls and counters", category: "temple",
    gradient: "from-[hsl(16,85%,35%)] to-[hsl(16,70%,25%)]", bgTint: "bg-[hsl(16,60%,95%)]" },
  { id: "offerings", title: "Offerings", icon: Sparkles, enabled: true, path: "/temple/offerings",
    description: "Rituals, darshan, slots, bookings, pricing", category: "temple",
    gradient: "from-[hsl(45,90%,45%)] to-[hsl(35,85%,38%)]", bgTint: "bg-[hsl(45,80%,95%)]" },
  { id: "bookings", title: "Bookings", icon: Calendar, enabled: true, path: "/temple/bookings",
    description: "Online & counter bookings, attendance, reports", category: "temple",
    gradient: "from-[hsl(142,60%,40%)] to-[hsl(142,55%,30%)]", bgTint: "bg-[hsl(142,50%,95%)]" },
  { id: "donations", title: "Donations", icon: Heart, enabled: true, path: "/temple/donations",
    description: "Donor records, receipts, fund tracking", category: "temple",
    gradient: "from-[hsl(350,65%,50%)] to-[hsl(350,60%,38%)]", bgTint: "bg-[hsl(350,50%,96%)]" },
  { id: "prasadam-kitchen", title: "Prasadam & Kitchen", icon: UtensilsCrossed, enabled: true, path: "/temple/prasadam",
    description: "Prasadam production, Annadanam, kitchen operations", category: "temple",
    gradient: "from-[hsl(340,60%,50%)] to-[hsl(340,55%,38%)]", bgTint: "bg-[hsl(340,45%,96%)]" },
  { id: "crowd", title: "Crowd Management", icon: MapPin, enabled: true, path: "/temple/crowd",
    description: "Real-time crowd monitoring", category: "temple",
    gradient: "from-[hsl(0,60%,50%)] to-[hsl(0,55%,38%)]", bgTint: "bg-[hsl(0,45%,96%)]" },
  { id: "devotees", title: "Devotees", icon: UserCheck, enabled: true, path: "/temple/devotees",
    description: "Devotee database and volunteer management", category: "temple",
    gradient: "from-[hsl(142,55%,45%)] to-[hsl(142,50%,33%)]", bgTint: "bg-[hsl(142,45%,95%)]" },
  { id: "vip-devotee", title: "VIP Devotees", icon: Crown, enabled: true, path: "/temple/vip",
    description: "VIP devotee tracking and services", category: "temple",
    gradient: "from-[hsl(45,90%,48%)] to-[hsl(38,85%,38%)]", bgTint: "bg-[hsl(45,75%,95%)]" },

  // People & Management
  { id: "people-hr", title: "People & HR", icon: Users, enabled: true, path: "/temple/people",
    description: "Employee management, attendance, payroll", category: "management",
    gradient: "from-[hsl(200,60%,50%)] to-[hsl(200,55%,38%)]", bgTint: "bg-[hsl(200,50%,95%)]" },
  { id: "finance", title: "Finance & Accounts", icon: IndianRupee, enabled: true, path: "/temple/finance",
    description: "Income, expenses, vouchers, ledger, payments & audit", category: "management",
    gradient: "from-[hsl(142,60%,38%)] to-[hsl(142,55%,28%)]", bgTint: "bg-[hsl(142,45%,95%)]" },
  { id: "suppliers", title: "Inventory", icon: Boxes, enabled: true, path: "/temple/inventory/items",
    description: "Stock management, items, transactions", category: "management",
    gradient: "from-[hsl(30,80%,50%)] to-[hsl(25,75%,38%)]", bgTint: "bg-[hsl(30,65%,95%)]" },
  { id: "tasks", title: "Tasks", icon: ClipboardList, enabled: true, path: "/temple/tasks",
    description: "Operational task coordination & tracking", category: "management",
    gradient: "from-[hsl(220,60%,55%)] to-[hsl(220,55%,42%)]", bgTint: "bg-[hsl(220,50%,96%)]" },
  { id: "freelancer", title: "Freelancer", icon: Briefcase, enabled: true, path: "/temple/freelancers",
    description: "Manage freelance workers", category: "management",
    gradient: "from-[hsl(35,80%,50%)] to-[hsl(30,75%,38%)]", bgTint: "bg-[hsl(35,65%,95%)]" },
  { id: "communication", title: "Communication", icon: Megaphone, enabled: true, path: "/temple/communication",
    description: "Announcements, notifications, media", category: "management",
    gradient: "from-[hsl(280,50%,55%)] to-[hsl(280,45%,42%)]", bgTint: "bg-[hsl(280,40%,96%)]" },
  { id: "assets", title: "Assets", icon: Package, enabled: true, path: "/temple/assets",
    description: "Temple asset tracking and maintenance", category: "management",
    gradient: "from-[hsl(160,50%,45%)] to-[hsl(160,45%,33%)]", bgTint: "bg-[hsl(160,40%,95%)]" },

  // Growth & Intelligence
  { id: "events", title: "Events", icon: CalendarDays, enabled: true, path: "/temple/events",
    description: "Event creation, registration, capacity", category: "growth",
    gradient: "from-[hsl(260,55%,55%)] to-[hsl(260,50%,42%)]", bgTint: "bg-[hsl(260,45%,96%)]" },
  { id: "projects", title: "Projects", icon: FolderKanban, enabled: true, path: "/temple/projects",
    description: "Strategic projects, milestones, budget governance", category: "growth",
    gradient: "from-[hsl(220,55%,50%)] to-[hsl(220,50%,38%)]", bgTint: "bg-[hsl(220,45%,96%)]" },
  { id: "branches", title: "Branches", icon: GitBranch, enabled: true, path: "/temple/branches",
    description: "Multi-branch temple management", category: "growth",
    gradient: "from-[hsl(170,50%,45%)] to-[hsl(170,45%,33%)]", bgTint: "bg-[hsl(170,40%,95%)]" },
  { id: "institution", title: "Institutions", icon: Building2, enabled: true, path: "/temple/institutions",
    description: "Schools, hospitals, goshalas & trust entities", category: "growth",
    gradient: "from-[hsl(250,50%,55%)] to-[hsl(250,45%,42%)]", bgTint: "bg-[hsl(250,40%,96%)]" },
  { id: "feedback", title: "Feedback", icon: BarChart3, enabled: true, path: "/temple/feedback",
    description: "Devotee feedback, ratings, sentiment analysis", category: "growth",
    gradient: "from-[hsl(310,50%,50%)] to-[hsl(310,45%,38%)]", bgTint: "bg-[hsl(310,40%,96%)]" },
  { id: "knowledge", title: "Knowledge Base", icon: BookOpen, enabled: true, path: "/temple/knowledge",
    description: "Documents, SOPs, and knowledge base", category: "growth",
    gradient: "from-[hsl(190,60%,45%)] to-[hsl(190,55%,33%)]", bgTint: "bg-[hsl(190,50%,95%)]" },
  { id: "reports", title: "Reports Center", icon: BarChart3, enabled: true, path: "/temple/reports",
    description: "Consolidated reports across all modules", category: "management",
    gradient: "from-[hsl(270,55%,55%)] to-[hsl(270,50%,42%)]", bgTint: "bg-[hsl(270,45%,96%)]" },
  { id: "planner", title: "Planner", icon: Calendar, enabled: true, path: "/temple/planner",
    description: "Calendar and scheduling planner", category: "growth",
    gradient: "from-[hsl(200,50%,50%)] to-[hsl(200,45%,38%)]", bgTint: "bg-[hsl(200,40%,95%)]" },
  { id: "settings", title: "Settings", icon: Settings, enabled: true, path: "/temple/settings",
    description: "Temple profile, subscription, users", category: "growth",
    gradient: "from-[hsl(220,10%,50%)] to-[hsl(220,10%,38%)]", bgTint: "bg-[hsl(220,8%,96%)]" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 25,
    },
  },
};

const TempleHub = () => {
  const navigate = useNavigate();
  const [showBanner, setShowBanner] = useState(true);
  const [helpVideoOpen, setHelpVideoOpen] = useState(false);
  const [iconStyle, setIconStyle] = useState<"glass" | "filled">("glass");
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);

  // Upgrade modal state
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [selectedLockedModule, setSelectedLockedModule] = useState<typeof allModules[0] | null>(null);

  // Lotus bloom state
  const [lotusVisible, setLotusVisible] = useState(false);
  const [lotusState, setLotusState] = useState<"blooming" | "locked" | "idle">("idle");
  const [pendingModule, setPendingModule] = useState<typeof allModules[0] | null>(null);
  const [lotusTargetRect, setLotusTargetRect] = useState<DOMRect | null>(null);

  const currentPlanId = tenantData.planId;

  const isSuspended = tenantData.status === "suspended";

  const getModuleState = (module: typeof allModules[0]): "suspended" | "locked" | "enabled" => {
    if (isSuspended) return "suspended";
    // Mock: all modules unlocked regardless of plan
    return "enabled";
  };

  const handleModuleClick = (module: typeof allModules[0], event: React.MouseEvent) => {
    const state = getModuleState(module);
    if (state === "suspended") return;

    // Capture the clicked element's rect for positioning lotus on the card
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    setLotusTargetRect(rect);
    setPendingModule(module);

    if (state === "locked") {
      setLotusState("locked");
      setLotusVisible(true);
      setSelectedLockedModule(module);
    } else {
      setLotusState("blooming");
      setLotusVisible(true);
      setActiveModuleId(module.id);
    }
  };

  const handleLotusComplete = () => {
    setLotusVisible(false);
    if (pendingModule) {
      navigate(pendingModule.path);
    }
  };

  const handleLotusLockedComplete = () => {
    setLotusVisible(false);
  };

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(180deg, hsl(30 30% 97%) 0%, hsl(30 20% 95%) 100%)" }}>
      {/* Header */}
      <header className="border-b sticky top-0 z-20 border-border bg-card">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <h1 className="text-xl font-bold text-primary">Digi Devalaya</h1>
            <Badge variant="secondary" className="text-xs gap-1">
              {tenantData.plan}
            </Badge>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            {/* UI Kit */}
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => navigate("/temple/ui-kit")}
                  className="relative p-2 rounded-lg transition-colors hover:bg-muted"
                >
                  <Palette className="h-5 w-5 text-muted-foreground" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>UI Kit</p>
              </TooltipContent>
            </Tooltip>

            {/* Notification Bell */}
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <button className="relative p-2 rounded-lg transition-colors hover:bg-muted">
                  <Bell className="h-5 w-5 text-muted-foreground" />
                  <span className="absolute top-1 right-1 h-2.5 w-2.5 bg-destructive rounded-full border-2 border-transparent" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>View notifications</p>
              </TooltipContent>
            </Tooltip>

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs font-semibold bg-primary text-primary-foreground">
                      SV
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52 bg-popover border shadow-lg">
                <div className="px-2 py-1.5 border-b border-border mb-1">
                  <p className="text-sm font-medium">Ramesh Kumar</p>
                  <p className="text-xs text-muted-foreground">Temple Administrator</p>
                </div>
                <DropdownMenuItem onClick={() => navigate("/profile")} className="gap-2">
                  <User className="h-4 w-4" />
                  My Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/temple/settings")} className="gap-2">
                  <Settings className="h-4 w-4" />
                  Temple Settings
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
          </motion.div>
        </div>
      </header>

      {/* Suspended Overlay */}
      {isSuspended && (
        <div className="bg-red-50 border-b border-red-200 py-8 text-center">
          <ShieldAlert className="h-12 w-12 text-red-500 mx-auto mb-3" />
          <h2 className="text-lg font-semibold text-red-800 mb-1">Account Suspended</h2>
          <p className="text-sm text-red-700 mb-4">Your temple account has been suspended. All modules are disabled.</p>
          <Button variant="destructive" size="sm">Contact Support</Button>
        </div>
      )}

      {/* Upgrade Banner */}
      {showBanner && currentPlanId === "prarambh" && !isSuspended && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary/10 via-primary/5 to-amber-50 border-b border-primary/10"
        >
          <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Zap className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Upgrade your plan to unlock powerful features
                </p>
                <p className="text-xs text-muted-foreground">
                  You're on the free plan. Unlock seva bookings, donations, finance & more.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                className="gap-1.5 h-8"
                onClick={() => navigate("/temple/settings/upgrade")}
              >
                <Crown className="h-3.5 w-3.5" />
                View Plans
              </Button>
              <button
                onClick={() => setShowBanner(false)}
                className="p-1.5 rounded-lg hover:bg-primary/10 transition-colors"
              >
                <X className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            </div>
          </div>
        </motion.div>
      )}

      <main className="max-w-5xl mx-auto px-6 py-4">
        {/* Temple Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-4"
        >
          <h1 className="text-2xl font-bold mb-1 text-foreground">{tenantData.templeName}</h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span className="font-mono text-xs px-2 py-0.5 rounded bg-muted">{tenantData.tenantId}</span>
            <span>•</span>
            <span>{tenantData.region}</span>
            <span>•</span>
            <Badge variant="outline" className="text-xs text-green-700 border-green-300 bg-green-50">
              {tenantData.healthScore}
            </Badge>
          </div>
        </motion.div>

        {/* Plan & Discount Bar */}
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-6 relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/5 via-amber-50/60 to-primary/5"
        >
          {/* Decorative glow */}
          <div className="pointer-events-none absolute -top-12 -right-12 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-amber-200/30 blur-3xl" />

          <div className="relative px-4 sm:px-5 py-3.5 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
            {/* Plan identity */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-amber-500 flex items-center justify-center shadow-sm shrink-0">
                <Crown className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
                  You are on
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-base font-bold text-foreground truncate">
                    {tenantData.plan} Plan
                  </span>
                  <Badge variant="outline" className="text-[10px] h-5 px-1.5 border-primary/30 text-primary bg-primary/5">
                    {tenantData.tier}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="hidden sm:block h-10 w-px bg-border/70" />

            {/* Discount / Billing info */}
            <div className="flex-1 flex items-center gap-3 min-w-0">
              {tenantData.discountPercent > 0 ? (
                <>
                  <div className="h-9 w-9 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
                    <Sparkles className="h-4 w-4 text-green-700" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-sm font-semibold text-foreground">
                        {tenantData.discountPercent}% discount applied
                      </span>
                      <Badge className="text-[10px] h-5 px-1.5 bg-green-600 hover:bg-green-600 text-white border-0">
                        {tenantData.discountLabel}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {tenantData.billingCycle} billing • Renews {tenantData.nextRenewalDate}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    <Zap className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground">
                      Save 15% with annual billing
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      Switch to yearly to unlock savings on your subscription.
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <Button
                size="sm"
                variant="outline"
                className="text-xs h-8 gap-1"
                onClick={() => navigate("/temple/settings/subscription")}
              >
                Manage Plan
              </Button>
              {currentPlanId === "prarambh" && (
                <Button
                  size="sm"
                  className="text-xs h-8 gap-1 bg-gradient-to-r from-primary to-amber-500 hover:opacity-90 text-primary-foreground border-0"
                  onClick={() => navigate("/temple/settings/subscription")}
                >
                  <Zap className="h-3 w-3" /> Upgrade
                </Button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Module Categories */}
        {!isSuspended && (
          <div className="space-y-7">
            {[
              { key: "temple", label: "Temple & Worship", icon: Landmark },
              { key: "management", label: "People & Management", icon: Users },
              { key: "growth", label: "Growth & Intelligence", icon: BarChart3 },
            ].map((cat) => {
              const catModules = allModules.filter(m => m.category === cat.key);
              if (catModules.length === 0) return null;
              return (
                <div key={cat.key}>
                  <div className="flex items-center gap-2 mb-3">
                    <cat.icon className="h-4 w-4 text-primary" />
                    <h2 className="text-sm font-semibold tracking-wide text-foreground">{cat.label}</h2>
                    <div className="flex-1 h-px ml-2 bg-border" />
                    {cat.key === "temple" && (
                      <button
                        onClick={() => setIconStyle(iconStyle === "glass" ? "filled" : "glass")}
                        className="text-[10px] font-medium px-2 py-0.5 rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
                      >
                        {iconStyle === "glass" ? "Filled" : "Glass"}
                      </button>
                    )}
                  </div>
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-3"
                  >
                    {catModules.map((module) => {
                      const state = getModuleState(module);
                      const isLocked = state === "locked";
                      const minPlan = isLocked ? getMinimumPlan(module.id) : null;

                      return (
                        <Tooltip key={module.id} delayDuration={300}>
                          <TooltipTrigger asChild>
                            <motion.button
                              variants={itemVariants}
                              whileHover={{ y: -5, transition: { duration: 0.2 } }}
                              whileTap={{ scale: 0.96 }}
                              onClick={(e) => handleModuleClick(module, e)}
                              className={`group flex flex-col items-center text-center focus:outline-none relative py-3 px-1.5 rounded-xl transition-all duration-300 ${
                                isLocked
                                  ? "bg-card/60 hover:bg-muted/50 opacity-75 hover:opacity-100"
                                  : activeModuleId === module.id
                                    ? "bg-primary shadow-lg scale-[1.02]"
                                    : "bg-card hover:bg-primary hover:shadow-md"
                              }`}
                            >
                              {/* Lock badge */}
                              {isLocked && (
                                <span className="absolute -top-1.5 -right-1 z-10 rounded-full p-1 bg-muted border border-border shadow-sm">
                                  <Lock className="h-3 w-3 text-muted-foreground" />
                                </span>
                              )}

                              {/* Icon */}
                              {activeModuleId === module.id ? (
                                <div className="relative w-16 h-16 rounded-2xl flex items-center justify-center mb-2.5 bg-primary-foreground/20">
                                  <module.icon className="h-7 w-7 text-primary-foreground" strokeWidth={1.5} />
                                </div>
                              ) : isLocked ? (
                                <div className="relative w-16 h-16 rounded-2xl flex items-center justify-center mb-2.5 border border-dashed border-border bg-muted/30">
                                  <module.icon
                                    className="h-7 w-7 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors"
                                    strokeWidth={1.5}
                                  />
                                </div>
                              ) : iconStyle === "filled" ? (
                                <div className="relative w-16 h-16 rounded-2xl flex items-center justify-center mb-2.5 transition-all duration-300 overflow-hidden bg-primary group-hover:bg-primary-foreground/20 group-hover:scale-105">
                                  <module.icon
                                    className="h-7 w-7 relative z-10 transition-all duration-300 text-primary-foreground group-hover:scale-110"
                                    strokeWidth={1.5}
                                  />
                                </div>
                              ) : (
                                <div className="relative w-16 h-16 rounded-2xl flex items-center justify-center mb-2.5 transition-all duration-300 overflow-hidden border border-primary/10 group-hover:bg-primary-foreground/20 group-hover:border-primary-foreground/20 group-hover:scale-105">
                                  <module.icon
                                    className="h-7 w-7 relative z-10 transition-all duration-300 text-primary group-hover:text-primary-foreground group-hover:scale-110"
                                    strokeWidth={1.5}
                                  />
                                </div>
                              )}

                              {/* Title */}
                              <span className={`text-xs font-semibold leading-snug max-w-[84px] transition-colors duration-300 ${
                                isLocked
                                  ? "text-muted-foreground"
                                  : activeModuleId === module.id
                                    ? "text-primary-foreground"
                                    : "text-foreground group-hover:text-primary-foreground"
                              }`}>
                                {module.title}
                              </span>

                              {/* Status indicator */}
                              {isLocked ? (
                                <span className="text-[9px] text-muted-foreground mt-1 leading-tight flex items-center gap-0.5">
                                  <Lock className="h-2.5 w-2.5" />
                                  Locked
                                </span>
                              ) : (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setHelpVideoOpen(true);
                                  }}
                                  className="flex items-center gap-0.5 mt-1 text-[10px] font-medium text-primary group-hover:text-primary-foreground/80 hover:underline transition-colors"
                                >
                                  <Video className="h-3 w-3" />
                                  How to use
                                </button>
                              )}
                            </motion.button>
                          </TooltipTrigger>
                          <TooltipContent side="bottom" className="max-w-[200px] text-center">
                            <p className="text-xs">{module.description}</p>
                            {isLocked && minPlan && (
                              <p className="text-xs text-muted-foreground mt-1">
                                Available in {minPlan.name} plan & above
                              </p>
                            )}
                          </TooltipContent>
                        </Tooltip>
                      );
                    })}
                  </motion.div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <DemoVideoModal open={helpVideoOpen} onOpenChange={setHelpVideoOpen} />

      {/* Lotus Bloom Animation */}
      <LotusBloom
        isVisible={lotusVisible}
        state={lotusState}
        targetRect={lotusTargetRect}
        onComplete={handleLotusComplete}
        onLockedComplete={handleLotusLockedComplete}
      />

      {/* Upgrade Modal */}
      {selectedLockedModule && (
        <UpgradeModal
          open={upgradeModalOpen}
          onOpenChange={setUpgradeModalOpen}
          moduleId={selectedLockedModule.id}
          moduleTitle={selectedLockedModule.title}
          moduleDescription={selectedLockedModule.description}
        />
      )}
    </div>
  );
};

export default TempleHub;
