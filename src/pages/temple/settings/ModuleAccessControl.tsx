import { useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Lock,
  CheckCircle2,
  Zap,
  Crown,
  Landmark,
  Megaphone,
  Sparkles,
  Calendar,
  Boxes,
  UtensilsCrossed,
  ClipboardList,
  GitBranch,
  Building2,
  BookOpen,
  Package,
  MapPin,
  UserCheck,
  Briefcase,
  CalendarDays,
  BarChart3,
  Heart,
  IndianRupee,
  FolderKanban,
  Settings,
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";

interface ModuleItem {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  tier: "free" | "standard" | "premium";
}

const modules: ModuleItem[] = [
  // Free Tier
  { id: "temple-structure", name: "Temple Structure", description: "Hierarchy, shrines, halls & counters", icon: Landmark, tier: "free" },
  { id: "offerings", name: "Offerings & Sevas", description: "Rituals, darshan, slots & bookings", icon: Sparkles, tier: "free" },
  { id: "bookings", name: "Booking Management", description: "Online & counter bookings", icon: Calendar, tier: "free" },
  { id: "donations", name: "Donation Management", description: "Donor records, receipts & 80G", icon: Heart, tier: "free" },
  { id: "devotees", name: "Devotee Management", description: "Devotee database & volunteers", icon: UserCheck, tier: "free" },
  { id: "tasks", name: "Task Management", description: "Operational task tracking", icon: ClipboardList, tier: "free" },
  { id: "communication", name: "PR & Communication", description: "Announcements & notifications", icon: Megaphone, tier: "free" },
  { id: "settings", name: "Settings", description: "Temple profile & configuration", icon: Settings, tier: "free" },

  // Standard Tier
  { id: "inventory", name: "Stock / Inventory", description: "Stock management & transactions", icon: Boxes, tier: "standard" },
  { id: "finance", name: "Finance & Accounts", description: "Budget, expenses & reports", icon: IndianRupee, tier: "standard" },
  { id: "events", name: "Event Management", description: "Event creation & registration", icon: CalendarDays, tier: "standard" },
  { id: "feedback", name: "Feedback & Analytics", description: "Ratings & sentiment analysis", icon: BarChart3, tier: "standard" },
  { id: "freelancer", name: "Freelancer Management", description: "Freelance workers & payments", icon: Briefcase, tier: "standard" },
  { id: "branches", name: "Branch Management", description: "Multi-branch operations", icon: GitBranch, tier: "standard" },

  // Premium Tier
  { id: "prasadam", name: "Prasadam & Kitchen", description: "Production, recipes & distribution", icon: UtensilsCrossed, tier: "premium" },
  { id: "projects", name: "Projects & Initiatives", description: "Strategic projects & milestones", icon: FolderKanban, tier: "premium" },
  { id: "institution", name: "Institutions", description: "Schools, hospitals & trust entities", icon: Building2, tier: "premium" },
  { id: "crowd", name: "Crowd Management", description: "Real-time crowd monitoring", icon: MapPin, tier: "premium" },
  { id: "knowledge", name: "Knowledge Management", description: "Documents, SOPs & knowledge base", icon: BookOpen, tier: "premium" },
  { id: "assets", name: "Asset Management", description: "Asset tracking & maintenance", icon: Package, tier: "premium" },
];

const currentTier = "free"; // Simulates a free-tier temple after registration

const tierOrder = { free: 0, standard: 1, premium: 2 };
const isUnlocked = (tier: string) => tierOrder[tier as keyof typeof tierOrder] <= tierOrder[currentTier as keyof typeof tierOrder];

const tierConfig = {
  free: { label: "Free", badge: "bg-emerald-100 text-emerald-800 border-emerald-200", color: "text-emerald-600" },
  standard: { label: "Standard", badge: "bg-blue-100 text-blue-800 border-blue-200", color: "text-blue-600" },
  premium: { label: "Premium", badge: "bg-amber-100 text-amber-800 border-amber-200", color: "text-amber-600" },
};

const ModuleCard = ({ module, unlocked }: { module: ModuleItem; unlocked: boolean }) => {
  const Icon = module.icon;
  const config = tierConfig[module.tier];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative rounded-xl border p-4 transition-all ${
        unlocked
          ? "bg-card border-border hover:shadow-md hover:border-primary/20 cursor-pointer"
          : "bg-muted/30 border-border/50 opacity-70"
      }`}
    >
      {!unlocked && (
        <div className="absolute top-3 right-3">
          <Lock className="h-3.5 w-3.5 text-muted-foreground" />
        </div>
      )}
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${unlocked ? "bg-primary/10" : "bg-muted"}`}>
          <Icon className={`h-4.5 w-4.5 ${unlocked ? "text-primary" : "text-muted-foreground"}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h4 className={`text-sm font-semibold ${unlocked ? "text-foreground" : "text-muted-foreground"}`}>
              {module.name}
            </h4>
          </div>
          <p className={`text-xs ${unlocked ? "text-muted-foreground" : "text-muted-foreground/70"}`}>
            {module.description}
          </p>
        </div>
      </div>
      {unlocked && (
        <div className="mt-3 flex items-center gap-1.5">
          <CheckCircle2 className="h-3 w-3 text-emerald-600" />
          <span className="text-[11px] text-emerald-700 font-medium">Active</span>
        </div>
      )}
    </motion.div>
  );
};

const ModuleAccessControl = () => {
  const freeModules = modules.filter(m => m.tier === "free");
  const standardModules = modules.filter(m => m.tier === "standard");
  const premiumModules = modules.filter(m => m.tier === "premium");

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Modules</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Your current plan: <Badge variant="outline" className="ml-1 text-emerald-700 border-emerald-300 bg-emerald-50">Free Tier</Badge>
        </p>
      </div>

      {/* Active Modules — Free Tier */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <h2 className="text-base font-semibold text-foreground">Active Modules</h2>
          <Badge variant="outline" className="text-[11px] bg-emerald-50 text-emerald-700 border-emerald-200">{freeModules.length} included</Badge>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {freeModules.map(m => (
            <ModuleCard key={m.id} module={m} unlocked={true} />
          ))}
        </div>
      </div>

      <Separator />

      {/* Upgrade Banner */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-primary/20 bg-gradient-to-r from-primary/5 via-primary/3 to-transparent p-5 flex items-center justify-between gap-4 flex-wrap"
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-full bg-primary/10">
            <Zap className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-sm">Unlock more modules</h3>
            <p className="text-xs text-muted-foreground">Upgrade your plan to access Standard & Premium modules</p>
          </div>
        </div>
        <Button
          size="sm"
          className="gap-1.5"
          onClick={() => toast.info("Upgrade flow coming soon")}
        >
          <Crown className="h-3.5 w-3.5" />
          Upgrade Plan
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Button>
      </motion.div>

      {/* Standard Tier — Locked */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Lock className="h-4 w-4 text-blue-500" />
          <h2 className="text-base font-semibold text-foreground">Standard Modules</h2>
          <Badge variant="outline" className="text-[11px] bg-blue-50 text-blue-700 border-blue-200">Upgrade Required</Badge>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {standardModules.map(m => (
            <ModuleCard key={m.id} module={m} unlocked={isUnlocked(m.tier)} />
          ))}
        </div>
      </div>

      {/* Premium Tier — Locked */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Crown className="h-4 w-4 text-amber-500" />
          <h2 className="text-base font-semibold text-foreground">Premium Modules</h2>
          <Badge variant="outline" className="text-[11px] bg-amber-50 text-amber-700 border-amber-200">Premium Plan</Badge>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {premiumModules.map(m => (
            <ModuleCard key={m.id} module={m} unlocked={isUnlocked(m.tier)} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModuleAccessControl;
