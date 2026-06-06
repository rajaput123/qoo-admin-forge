import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  Sparkles,
  Info,
  ArrowLeft,
  ShieldCheck,
  Gift,
  Crown,
  Zap,
  Star,
  Leaf,
  PhoneCall,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  PLANS,
  computePrice,
  formatPrice,
  type BillingCycle,
  type Plan,
} from "@/lib/plans";
import { markSubscriptionComplete } from "@/lib/templeConfig";
import { toast } from "sonner";

const planIcons: Record<string, typeof Zap> = {
  seva: Zap,
  shraddha: Star,
  sampoorna: Crown,
  sanskriti: ShieldCheck,
};

// Hierarchical, enterprise-style feature groups per plan.
// Each group has a parent title + nested sub-features.
interface FeatureGroup {
  title: string;
  items: string[];
}

const planFeatureGroups: Record<string, FeatureGroup[]> = {
  seva: [
    {
      title: "Digital presence",
      items: ["Temple website (Plus template)", "Online seva booking — up to 500", "Online donation — up to 500", "Payment gateway"],
    },
    {
      title: "Devotee interactions",
      items: ["Push notifications (App)", "PR & event notifications", "WhatsApp messaging", "Basic event management"],
    },
    {
      title: "Operations",
      items: ["Prasadam & kitchen", "Counter & cart workflow", "Up to 5 staff users"],
    },
  ],
  shraddha: [
    {
      title: "Digital presence (Featured)",
      items: ["Featured website template", "Online seva booking — up to 2,500", "Online donation — up to 2,500"],
    },
    {
      title: "Advanced engagement",
      items: ["Branded devotee mobile app", "Advanced PR & communications", "WhatsApp included", "Basic devotee analytics"],
    },
    {
      title: "Donations & events",
      items: ["Donor CRM, 80G certificates", "Event ticketing & capacity", "VIP devotee tracking"],
    },
  ],
  sampoorna: [
    {
      title: "Digital presence (Advanced)",
      items: ["Advanced website template", "Online seva booking — up to 5,000", "Online donation — up to 5,000", "Donor list on website"],
    },
    {
      title: "Growth & accounting",
      items: ["Accounting & audit module", "Project & event P&L", "Devotee/projects/events analytics", "Basic stocks management"],
    },
    {
      title: "People & operations",
      items: ["Employee payroll", "Task management", "Full stocks management", "Child / sub-temple management", "Multi-branch dashboard"],
    },
  ],
  sanskriti: [
    {
      title: "Custom website & unlimited",
      items: ["Custom website template", "Unlimited online seva bookings", "Unlimited online donations", "Featured devotee analytics"],
    },
    {
      title: "AI & integrations",
      items: ["AI-powered devotee insights", "Custom integrations / API", "White-label branding", "Custom AI services"],
    },
    {
      title: "Premium support",
      items: ["Dedicated success manager", "Custom integrations", "Priority SLA"],
    },
  ],
};

interface PricingProps {
  embedded?: boolean;
  /** Post-login onboarding: any plan completes subscription and goes to hub */
  onboarding?: boolean;
}

const Pricing = ({ embedded = false, onboarding = false }: PricingProps) => {
  const navigate = useNavigate();
  const [cycle, setCycle] = useState<BillingCycle>("annual");

  const plans = useMemo(() => PLANS, []);

  return (
    <div className={embedded ? "font-sans antialiased" : "min-h-screen bg-background font-sans antialiased"}>
      {!embedded && (
        <div className="pointer-events-none fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--elite-green-soft))] via-background to-background" />
          <div className="absolute -top-40 -left-20 w-[420px] h-[420px] rounded-full bg-elite-green/10 blur-3xl" />
          <div className="absolute top-1/4 -right-20 w-[420px] h-[420px] rounded-full bg-elite-orange/10 blur-3xl" />
        </div>
      )}

      {!embedded && (
        <header className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-20">
          <div className="container mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-elite-green text-white flex items-center justify-center font-bold tracking-tight">
                D
              </div>
              <span className="font-bold text-lg text-foreground tracking-tight">
                Devalaya
              </span>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="text-foreground/70 hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </Button>
          </div>
        </header>
      )}

      <main className={embedded ? "" : "container mx-auto px-4 sm:px-6 py-12 sm:py-20"}>
        {/* Hero */}
        <div className={`text-center mx-auto ${embedded ? "max-w-2xl mb-8" : "max-w-3xl mb-12"}`}>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {!embedded && (
              <Badge
                variant="outline"
                className="border-border bg-muted/60 text-foreground/80 mb-5 px-3 py-1"
              >
                <Sparkles className="h-3 w-3 mr-1.5 text-elite-orange" />
                Transparent, enterprise-ready pricing
              </Badge>
            )}
            <h1 className={`font-bold text-foreground tracking-tight leading-[1.05] ${embedded ? "text-2xl sm:text-3xl" : "text-4xl sm:text-6xl"}`}>
              {embedded ? (
                <>Plans & <span className="text-elite-green">Pricing</span></>
              ) : (
                <>Pricing built for <span className="text-elite-green">every temple</span></>
              )}
            </h1>
            <p className={`text-muted-foreground leading-relaxed ${embedded ? "mt-2 text-sm" : "mt-5 text-base sm:text-lg"}`}>
              {embedded
                ? "Choose the plan that fits your temple. Upgrade or downgrade anytime."
                : "Start free with the essentials. Scale to a full enterprise platform with finance, HR and multi-temple governance — all on one trusted system."}
            </p>
          </motion.div>

          {/* Billing toggle */}
          <div className={`inline-flex items-center gap-4 bg-card border border-border px-5 py-2.5 rounded-full shadow-sm ${embedded ? "mt-5" : "mt-8"}`}>
            <span
              className={`text-sm font-medium transition-colors ${
                cycle === "monthly" ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              Monthly
            </span>
            <Switch
              checked={cycle === "annual"}
              onCheckedChange={(c) => setCycle(c ? "annual" : "monthly")}
              className="data-[state=checked]:bg-elite-green data-[state=unchecked]:bg-muted"
            />
            <span
              className={`text-sm font-medium transition-colors flex items-center gap-2 ${
                cycle === "annual" ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              Annual
              <Badge className="bg-success/15 text-success hover:bg-success/15 border border-success/30 text-[10px] font-semibold">
                2 months FREE
              </Badge>
            </span>
          </div>
        </div>

        {/* Plan grid: 3-col desktop */}
        <TooltipProvider delayDuration={150}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {plans.map((plan, idx) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                cycle={cycle}
                index={idx}
                previousPlanName={idx > 0 ? plans[idx - 1].name : undefined}
                onSelect={() => {
                  if (onboarding) {
                    markSubscriptionComplete();
                    toast.success(`${plan.name} plan activated!`);
                    navigate("/temple-hub");
                    return;
                  }
                  if (embedded && plan.price === 0) {
                    markSubscriptionComplete();
                    toast.success("Free plan activated!");
                    navigate("/temple-hub");
                    return;
                  }
                  navigate("/temple/settings/upgrade");
                }}
              />
            ))}
          </div>
        </TooltipProvider>

        {/* Trust strip */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto">
          {[
            { icon: ShieldCheck, label: "Secure payments" },
            { icon: Gift, label: "No setup fees" },
            { icon: Sparkles, label: "Cancel anytime" },
            { icon: Crown, label: "GST invoiced" },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2 justify-center text-sm text-muted-foreground bg-card border border-border rounded-xl py-3"
            >
              <Icon className="h-4 w-4 text-elite-orange" />
              {label}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

// --------------------------------------------------------------------------

interface PlanCardProps {
  plan: Plan;
  cycle: BillingCycle;
  index: number;
  previousPlanName?: string;
  onSelect: () => void;
}

const PlanCard = ({
  plan,
  cycle,
  index,
  previousPlanName,
  onSelect,
}: PlanCardProps) => {
  const Icon = planIcons[plan.id] ?? Zap;
  const billingType = plan.billingType ?? "both";
  const supportsCycle =
    billingType === "both" ||
    (billingType === "monthly" && cycle === "monthly") ||
    (billingType === "annual" && cycle === "annual");

  const effectiveCycle: BillingCycle = supportsCycle
    ? cycle
    : billingType === "monthly"
    ? "monthly"
    : "annual";

  const breakdown = computePrice(plan, effectiveCycle);
  const isFree = plan.price === 0;
  const isCustom = !!plan.isCustomPrice;
  const recommended = !!plan.recommended;
  const groups = planFeatureGroups[plan.id] ?? [];

  const ctaLabel =
    plan.ctaText ??
    (isCustom
      ? "Book a demo"
      : isFree
      ? "Start Free"
      : `Choose ${plan.name}`);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.06 }}
      whileHover={{ y: -4, scale: 1.005 }}
      className="relative h-full"
    >
      {recommended && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
          <Badge className="bg-elite-orange text-white border-0 shadow-lg shadow-elite-orange/30 px-3 py-1 font-semibold">
            ⭐ {plan.badge ?? "Most Popular"}
          </Badge>
        </div>
      )}

      <Card
        className={`h-full relative overflow-hidden border bg-card transition-all duration-300 ${
          recommended
            ? "border-elite-orange/40 shadow-2xl shadow-elite-orange/10 ring-1 ring-elite-orange/20"
            : "border-border shadow-sm hover:shadow-lg hover:border-foreground/20"
        }`}
      >
        {recommended && (
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-elite-orange via-elite-gold to-elite-orange" />
        )}

        <div className="p-6 sm:p-7 flex flex-col h-full">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center border ${
                recommended
                  ? "bg-elite-orange/10 text-elite-orange border-elite-orange/20"
                  : "bg-muted/60 text-foreground border-border"
              }`}
            >
              <Icon className="h-5 w-5" />
            </div>
            {plan.badge && !recommended && (
              <Badge
                variant="outline"
                className="border-border text-muted-foreground bg-muted/40 text-[10px] font-semibold uppercase tracking-wide"
              >
                {plan.badge}
              </Badge>
            )}
          </div>

          <h3 className="text-xl font-bold text-foreground tracking-tight">
            {plan.name}
          </h3>
          <p className="text-sm text-muted-foreground mt-1.5 min-h-[40px] leading-relaxed">
            {plan.description}
          </p>

          {/* Price block */}
          <div className="mt-6 mb-2 min-h-[110px]">
            <AnimatePresence mode="wait">
              {isCustom ? (
                <motion.div
                  key={`${plan.id}-custom`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
                    {plan.customPriceLabel ?? "Let's talk"}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                    {plan.customPriceDescription ??
                      "Custom pricing tailored to your organization."}
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key={`${plan.id}-${effectiveCycle}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                >
                  {isFree ? (
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-4xl font-bold text-foreground tracking-tight">
                        Free
                      </span>
                      <span className="text-sm text-muted-foreground">forever</span>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-4xl font-bold text-foreground tracking-tight">
                          ₹{breakdown.perMonth.toLocaleString("en-IN")}
                        </span>
                        <span className="text-sm text-muted-foreground">/month</span>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              type="button"
                              className="ml-1 p-1 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                              aria-label="Price breakdown"
                            >
                              <Info className="h-3.5 w-3.5" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent
                            side="top"
                            className="bg-foreground text-background border-foreground max-w-xs"
                          >
                            <PriceBreakdownTooltip
                              plan={plan}
                              cycle={effectiveCycle}
                            />
                          </TooltipContent>
                        </Tooltip>
                      </div>

                      {/* Original price + savings (inline) */}
                      {(plan.discountPercent ?? 0) > 0 && breakdown.perMonth < plan.price && (
                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                          <span className="text-sm text-muted-foreground line-through">
                            ₹{plan.price.toLocaleString("en-IN")}/month
                          </span>
                          <Badge className="bg-success/10 text-success border border-success/30 text-[10px] font-semibold px-1.5 py-0 h-5">
                            Save ₹{(plan.price - breakdown.perMonth).toLocaleString("en-IN")}/mo
                          </Badge>
                        </div>
                      )}

                      <div className="text-xs text-muted-foreground mt-1.5">
                        {effectiveCycle === "annual" ? (
                          <>
                            Billed{" "}
                            <span className="font-semibold text-foreground">
                              ₹{breakdown.total.toLocaleString("en-IN")}
                            </span>{" "}
                            / year · incl. {plan.gstPercent ?? 0}% GST
                            {(plan.discountPercent ?? 0) > 0 && (
                              <>
                                {" "}·{" "}
                                <span className="line-through">
                                  ₹{(plan.price * 12).toLocaleString("en-IN")}
                                </span>{" "}
                                <span className="font-semibold text-success">
                                  −₹{((plan.price * 12) - breakdown.total).toLocaleString("en-IN")} ({plan.discountPercent}% off)
                                </span>
                              </>
                            )}
                          </>
                        ) : (
                          <>
                            Billed{" "}
                            <span className="font-semibold text-foreground">
                              ₹{breakdown.total.toLocaleString("en-IN")}
                            </span>{" "}
                            / month · incl. {plan.gstPercent ?? 0}% GST
                          </>
                        )}
                      </div>

                      {effectiveCycle === "annual" &&
                        (plan.freeMonths ?? 0) > 0 && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center gap-1.5 mt-2.5 px-2.5 py-1 rounded-full bg-success/10 text-success text-[11px] font-semibold border border-success/30"
                          >
                            <Gift className="h-3 w-3" />
                            🎁 {plan.freeMonths} months FREE
                          </motion.div>
                        )}
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Inheritance line */}
          {previousPlanName && (
            <div className="mt-3 mb-4 px-3 py-2 rounded-lg bg-muted/50 border border-border">
              <p className="text-[12px] text-foreground/80 font-medium flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-elite-green flex-shrink-0" />
                Includes everything in{" "}
                <span className="font-bold">{previousPlanName}</span>, plus:
              </p>
            </div>
          )}

          {/* Hierarchical features */}
          <div className="space-y-4 mt-2 mb-6 flex-1">
            {groups.map((group) => (
              <div key={group.title}>
                <p className="text-[11px] uppercase tracking-wider font-bold text-foreground/70 mb-2">
                  {group.title}
                </p>
                <ul className="space-y-1.5">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-sm text-foreground/85 leading-snug"
                    >
                      <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-elite-green" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Billing-only note */}
          {billingType !== "both" && !isCustom && (
            <p className="text-[11px] text-muted-foreground italic mb-3">
              Available on {billingType === "monthly" ? "monthly" : "annual"} billing only
            </p>
          )}

          <Button
            onClick={onSelect}
            size="lg"
            className={`w-full font-semibold ${
              recommended
                ? "bg-elite-orange hover:bg-elite-orange/90 text-white shadow-lg shadow-elite-orange/30"
                : isCustom
                ? "bg-foreground hover:bg-foreground/90 text-background"
                : isFree
                ? "bg-card border-2 border-foreground/80 text-foreground hover:bg-foreground hover:text-background"
                : "bg-elite-green hover:bg-elite-green-mid text-white"
            }`}
          >
            {isCustom && <PhoneCall className="h-4 w-4 mr-2" />}
            {ctaLabel}
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};

// --------------------------------------------------------------------------

const PriceBreakdownTooltip = ({
  plan,
  cycle,
}: {
  plan: Plan;
  cycle: BillingCycle;
}) => {
  const b = computePrice(plan, cycle);
  const isAnnual = cycle === "annual";
  const Row = ({
    label,
    value,
    accent,
  }: {
    label: string;
    value: string;
    accent?: "muted" | "discount" | "total";
  }) => (
    <div className="flex justify-between items-center text-xs py-0.5">
      <span
        className={
          accent === "muted"
            ? "text-background/60"
            : accent === "discount"
            ? "text-elite-gold"
            : "text-background/90"
        }
      >
        {label}
      </span>
      <span
        className={
          accent === "discount"
            ? "text-elite-gold font-medium"
            : accent === "total"
            ? "text-background font-bold"
            : "text-background font-medium"
        }
      >
        {value}
      </span>
    </div>
  );

  return (
    <div className="space-y-1 py-1 min-w-[220px]">
      <p className="text-[10px] uppercase tracking-wider text-background/60 mb-1">
        {isAnnual ? "Annual" : "Monthly"} breakdown
      </p>
      <Row
        label={isAnnual ? "Base (12 months)" : "Base price"}
        value={formatPrice(b.basePrice)}
        accent="muted"
      />
      {isAnnual && (plan.freeMonths ?? 0) > 0 && (
        <Row
          label={`− ${plan.freeMonths} months free`}
          value={`− ${formatPrice(plan.price * (plan.freeMonths ?? 0))}`}
          accent="discount"
        />
      )}
      {(plan.discountPercent ?? 0) > 0 && (
        <Row
          label={`− ${plan.discountPercent}% offer`}
          value={`− ${formatPrice(b.discountAmount)}`}
          accent="discount"
        />
      )}
      <div className="border-t border-background/15 my-1" />
      <Row label="Subtotal" value={formatPrice(b.subtotal)} />
      <Row
        label={`+ ${plan.gstPercent ?? 0}% GST`}
        value={`+ ${formatPrice(b.gstAmount)}`}
        accent="muted"
      />
      <div className="border-t border-background/15 my-1" />
      <Row
        label={isAnnual ? "Total / year" : "Total / month"}
        value={formatPrice(b.total)}
        accent="total"
      />
    </div>
  );
};

export default Pricing;
