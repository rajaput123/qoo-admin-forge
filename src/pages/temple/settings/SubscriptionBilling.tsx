import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Check,
  Crown,
  Sparkles,
  Zap,
  Shield,
  Building2,
  ArrowRight,
  Star,
  Minus,
  CreditCard,
  Lock,
  X,
} from "lucide-react";
import { PLANS, formatPrice, type Plan } from "@/lib/plans";
import { toast } from "sonner";
import planSeva from "@/assets/plans/plan-seva.png";
import planShraddha from "@/assets/plans/plan-shraddha.png";
import planSampoorna from "@/assets/plans/plan-sampoorna.png";
import planSanskriti from "@/assets/plans/plan-sanskriti.png";

const currentPlanId = "seva";

const planImages: Record<string, string> = {
  seva: planSeva,
  shraddha: planShraddha,
  sampoorna: planSampoorna,
  sanskriti: planSanskriti,
};

const planMeta: Record<string, {
  icon: any;
  gradient: string;
  iconBg: string;
  accent: string;
}> = {
  seva: {
    icon: Sparkles,
    gradient: "from-[hsl(142,45%,94%)] to-[hsl(142,35%,88%)]",
    iconBg: "bg-[hsl(142,50%,42%)]",
    accent: "hsl(142, 50%, 42%)",
  },
  shraddha: {
    icon: Crown,
    gradient: "from-[hsl(340,60%,95%)] to-[hsl(340,45%,88%)]",
    iconBg: "bg-primary",
    accent: "hsl(340, 65%, 47%)",
  },
  sampoorna: {
    icon: Shield,
    gradient: "from-[hsl(260,50%,95%)] to-[hsl(260,40%,88%)]",
    iconBg: "bg-[hsl(260,55%,52%)]",
    accent: "hsl(260, 55%, 52%)",
  },
  sanskriti: {
    icon: Building2,
    gradient: "from-[hsl(45,70%,94%)] to-[hsl(35,60%,85%)]",
    iconBg: "bg-[hsl(35,75%,42%)]",
    accent: "hsl(35, 75%, 42%)",
  },
};

const SubscriptionBilling = () => {
  const navigate = useNavigate();
  const [annual, setAnnual] = useState(false);
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null);
  const [checkoutPlan, setCheckoutPlan] = useState<Plan | null>(null);
  const [processing, setProcessing] = useState(false);

  const annualDiscount = 0.15;

  const getPrice = (plan: Plan) => {
    if (plan.price === 0) return "Free";
    const price = annual ? Math.round(plan.price * (1 - annualDiscount)) : plan.price;
    return `₹${price.toLocaleString("en-IN")}`;
  };

  const getAnnualTotal = (plan: Plan) => {
    if (plan.price === 0) return null;
    const total = annual ? Math.round(plan.price * 12 * (1 - annualDiscount)) : plan.price * 12;
    return `₹${total.toLocaleString("en-IN")}/yr`;
  };

  const getOriginalPrice = (plan: Plan) => {
    if (!annual || plan.price === 0) return null;
    return `₹${plan.price.toLocaleString("en-IN")}`;
  };

  const getSavings = (plan: Plan) => {
    if (!annual || plan.price === 0) return null;
    const monthlySaving = plan.price - Math.round(plan.price * (1 - annualDiscount));
    const yearlySaving = monthlySaving * 12;
    return { monthly: monthlySaving, yearly: yearlySaving };
  };

  const handleSelectPlan = (plan: Plan) => {
    if (plan.id === currentPlanId) return;
    setCheckoutPlan(plan);
  };

  const handlePayment = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setCheckoutPlan(null);
      toast.success("Payment successful! Your plan has been upgraded.");
    }, 2000);
  };

  const featureRows = [
    { feature: "Temple Structure", modules: ["temple-structure"] },
    { feature: "Offerings & Darshan", modules: ["offerings"] },
    { feature: "Bookings", modules: ["bookings"] },
    { feature: "Prasadam & Kitchen", modules: ["prasadam-kitchen"] },
    { feature: "Donations", modules: ["donations"] },
    { feature: "Events", modules: ["events"] },
    { feature: "Devotee Management", modules: ["devotees", "vip-devotee"] },
    { feature: "Communication", modules: ["communication"] },
    { feature: "People & HR", modules: ["people-hr"] },
    { feature: "Finance & Accounts", modules: ["finance"] },
    { feature: "Tasks & Freelancer", modules: ["tasks", "freelancer"] },
    { feature: "Inventory & Assets", modules: ["suppliers", "assets"] },
    { feature: "Reports & Feedback", modules: ["reports", "feedback"] },
    { feature: "Projects & Knowledge", modules: ["projects", "knowledge"] },
    { feature: "Crowd Management", modules: ["crowd"] },
    { feature: "Branches & Institutions", modules: ["branches", "institution"] },
    { feature: "Planner", modules: ["planner"] },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto pb-16">
      {/* Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4">
          <Star className="h-3.5 w-3.5" />
          Simple, transparent pricing
        </div>
        <h1 className="text-3xl font-extrabold text-foreground mb-2 tracking-tight">
          Choose the perfect plan for your temple
        </h1>
        <p className="text-muted-foreground max-w-lg mx-auto text-sm">
          Start free and scale as your temple grows. All plans include temple structure management and settings.
        </p>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-3 mt-6">
          <span className={`text-sm font-medium transition-colors ${!annual ? "text-foreground" : "text-muted-foreground"}`}>
            Monthly
          </span>
          <Switch checked={annual} onCheckedChange={setAnnual} />
          <span className={`text-sm font-medium transition-colors ${annual ? "text-foreground" : "text-muted-foreground"}`}>
            Annual
          </span>
          {annual && (
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
              <Badge className="bg-[hsl(142,50%,42%)] text-white border-0 text-[10px] px-2">
                Save 15%
              </Badge>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 mb-16">
        {PLANS.map((plan, i) => {
          const meta = planMeta[plan.id] || planMeta.seva;
          const Icon = meta.icon;
          const isCurrent = plan.id === currentPlanId;
          const isRecommended = plan.recommended;
          const isHovered = hoveredPlan === plan.id;

          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, type: "spring", stiffness: 300, damping: 25 }}
              onMouseEnter={() => setHoveredPlan(plan.id)}
              onMouseLeave={() => setHoveredPlan(null)}
              className="relative"
            >
              {/* Recommended glow */}
              {isRecommended && (
                <div
                  className="absolute -inset-[2px] rounded-2xl opacity-60"
                  style={{
                    background: `linear-gradient(135deg, ${meta.accent}, hsl(45, 80%, 60%))`,
                  }}
                />
              )}

              <div
                className={`relative h-full flex flex-col rounded-2xl border overflow-hidden transition-all duration-300 ${
                  isRecommended
                    ? "border-transparent shadow-xl"
                    : isCurrent
                      ? "border-primary/40 shadow-sm"
                      : "border-border hover:shadow-lg hover:-translate-y-1"
                } bg-card`}
              >
                {/* Palm-leaf manuscript image */}
                <div className="relative w-full h-28 overflow-hidden bg-muted/20">
                  <img
                    src={planImages[plan.id]}
                    alt={`${plan.name} plan manuscript`}
                    loading="lazy"
                    width={768}
                    height={512}
                    className="w-full h-full object-cover opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
                </div>

                {/* Badges */}
                {isRecommended && (
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-primary text-primary-foreground text-[10px] px-2 gap-1 shadow-md">
                      <Sparkles className="h-3 w-3" /> Best Value
                    </Badge>
                  </div>
                )}
                {isCurrent && (
                  <div className="absolute top-4 right-4">
                    <Badge variant="outline" className="text-primary border-primary text-[10px] px-2">
                      Current
                    </Badge>
                  </div>
                )}

                <div className="p-5 flex-1 flex flex-col">
                  {/* Plan icon & name */}
                  <div className="mb-5">
                    <div
                      className={`h-11 w-11 rounded-xl flex items-center justify-center mb-3 ${meta.iconBg} text-white shadow-sm`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground">{plan.name}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{plan.description}</p>
                  </div>

                  {/* Price */}
                  <div className="mb-5">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-4xl font-extrabold text-foreground tracking-tight">
                        {getPrice(plan)}
                      </span>
                      {plan.price > 0 && (
                        <span className="text-sm text-muted-foreground">/mo</span>
                      )}
                    </div>
                    {getOriginalPrice(plan) && (
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <span className="text-xs text-muted-foreground line-through">{getOriginalPrice(plan)}/mo</span>
                        <Badge className="bg-[hsl(142,50%,42%)]/10 text-[hsl(142,50%,32%)] border-0 text-[10px] px-1.5 py-0 h-4 font-semibold">
                          Save ₹{getSavings(plan)?.monthly.toLocaleString("en-IN")}/mo
                        </Badge>
                      </div>
                    )}
                    {plan.price > 0 && (
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        {getAnnualTotal(plan)} billed {annual ? "annually" : "monthly"}
                      </p>
                    )}
                    {annual && getSavings(plan) && (
                      <p className="text-[11px] font-semibold text-[hsl(142,50%,32%)] mt-0.5">
                        You save ₹{getSavings(plan)?.yearly.toLocaleString("en-IN")} per year
                      </p>
                    )}
                    {plan.price === 0 && (
                      <p className="text-[11px] text-muted-foreground mt-0.5">No credit card required</p>
                    )}
                  </div>

                  {/* Module list */}
                  <div className="flex-1 mb-5">
                    <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-3">
                      {plan.modules.length} modules
                    </p>
                    <div className="space-y-2">
                      {plan.modules.slice(0, 5).map((modId) => (
                        <div key={modId} className="flex items-center gap-2.5">
                          <div className="h-4 w-4 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: `${meta.accent}20` }}>
                            <Check className="h-2.5 w-2.5" style={{ color: meta.accent }} />
                          </div>
                          <span className="text-xs text-foreground capitalize">
                            {modId.replace(/-/g, " ")}
                          </span>
                        </div>
                      ))}
                      {plan.modules.length > 5 && (
                        <p className="text-[11px] font-semibold pl-[26px]" style={{ color: meta.accent }}>
                          + {plan.modules.length - 5} more
                        </p>
                      )}
                    </div>
                  </div>

                  {/* CTA — palm-leaf manuscript style */}
                  {isCurrent ? (
                    <div className="w-full h-10 rounded-xl flex items-center justify-center border border-primary/30 bg-primary/5 text-primary text-sm font-semibold">
                      Current Plan
                    </div>
                  ) : plan.price === 0 ? (
                    <Button
                      className="w-full gap-2 rounded-xl h-10 font-semibold"
                      variant="outline"
                      onClick={() => handleSelectPlan(plan)}
                    >
                      Get Started Free <ArrowRight className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      className="w-full gap-2 rounded-xl h-11 font-semibold shadow-sm"
                      variant={isRecommended ? "default" : "outline"}
                      onClick={() => handleSelectPlan(plan)}
                    >
                      <Crown className="h-4 w-4" />
                      Upgrade Now
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Feature Comparison Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-1">Compare all features</h2>
          <p className="text-sm text-muted-foreground">See exactly what's included in each plan</p>
        </div>

        <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left px-5 py-4 font-bold text-foreground text-xs uppercase tracking-wider">
                    Feature
                  </th>
                  {PLANS.map((p) => {
                    const meta = planMeta[p.id] || planMeta.seva;
                    return (
                      <th
                        key={p.id}
                        className={`text-center px-4 py-4 text-xs font-bold uppercase tracking-wider ${
                          p.id === currentPlanId ? "bg-primary/5" : ""
                        }`}
                        style={{ color: meta.accent }}
                      >
                        {p.name}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {featureRows.map((row, idx) => (
                  <tr
                    key={idx}
                    className={`border-b border-border/50 last:border-0 transition-colors hover:bg-muted/20 ${
                      idx % 2 === 0 ? "" : "bg-muted/5"
                    }`}
                  >
                    <td className="px-5 py-3 text-foreground font-medium text-sm">{row.feature}</td>
                    {PLANS.map((p) => {
                      const hasAll = row.modules.every(m => p.modules.includes(m));
                      const meta = planMeta[p.id] || planMeta.seva;
                      return (
                        <td
                          key={p.id}
                          className={`text-center px-4 py-3 ${p.id === currentPlanId ? "bg-primary/5" : ""}`}
                        >
                          {hasAll ? (
                            <div
                              className="h-5 w-5 rounded-full flex items-center justify-center mx-auto"
                              style={{ backgroundColor: `${meta.accent}15` }}
                            >
                              <Check className="h-3 w-3" style={{ color: meta.accent }} />
                            </div>
                          ) : (
                            <Minus className="h-4 w-4 text-muted-foreground/25 mx-auto" />
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.55 }}
        className="mt-12 text-center"
      >
        <div className="inline-flex flex-col items-center gap-2 p-6 rounded-2xl bg-muted/30 border border-border">
          <Building2 className="h-6 w-6 text-muted-foreground mb-1" />
          <p className="text-sm font-semibold text-foreground">Need a custom solution?</p>
          <p className="text-xs text-muted-foreground max-w-sm">
            For multi-temple organizations or custom requirements, we offer tailored enterprise plans.
          </p>
          <Button variant="outline" size="sm" className="mt-2 gap-2 rounded-lg">
            Contact Sales <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </motion.div>

      {/* Payment Dialog */}
      <Dialog open={!!checkoutPlan} onOpenChange={(open) => !open && setCheckoutPlan(null)}>
        <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden bg-card border-border rounded-2xl">
          {checkoutPlan && (() => {
            const meta = planMeta[checkoutPlan.id] || planMeta.seva;
            const price = annual
              ? Math.round(checkoutPlan.price * (1 - annualDiscount))
              : checkoutPlan.price;
            const totalLabel = annual
              ? `₹${Math.round(checkoutPlan.price * 12 * (1 - annualDiscount)).toLocaleString("en-IN")}/yr`
              : `₹${checkoutPlan.price.toLocaleString("en-IN")}/mo`;

            return (
              <>
                {/* Header */}
                <div className={`px-6 pt-6 pb-4 bg-gradient-to-br ${meta.gradient}`}>
                  <DialogHeader className="space-y-1">
                    <DialogTitle className="text-xl font-bold text-foreground flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Upgrade to {checkoutPlan.name}
                    </DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground">
                      Complete your payment to activate the {checkoutPlan.name} plan
                    </DialogDescription>
                  </DialogHeader>
                </div>

                {/* Order summary */}
                <div className="px-6 py-4 border-b border-border space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">{checkoutPlan.name} Plan</span>
                    <span className="text-xs text-muted-foreground">Billed {annual ? "annually" : "monthly"}</span>
                  </div>
                  {annual ? (
                    <>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="text-foreground line-through">
                          ₹{(checkoutPlan.price * 12).toLocaleString("en-IN")}/yr
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[hsl(142,50%,32%)] font-medium flex items-center gap-1.5">
                          Discount
                          <Badge className="bg-[hsl(142,50%,42%)]/10 text-[hsl(142,50%,32%)] border-0 text-[10px] px-1.5 py-0 h-4">
                            15% off
                          </Badge>
                        </span>
                        <span className="text-[hsl(142,50%,32%)] font-semibold">
                          − ₹{((checkoutPlan.price * 12) - Math.round(checkoutPlan.price * 12 * (1 - annualDiscount))).toLocaleString("en-IN")}
                        </span>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-border">
                        <span className="text-sm font-bold text-foreground">Total</span>
                        <div className="text-right">
                          <div className="text-base font-bold text-foreground">{totalLabel}</div>
                          <div className="text-[10px] text-muted-foreground">≈ ₹{price.toLocaleString("en-IN")}/mo</div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-sm font-bold text-foreground">Total</span>
                      <span className="text-base font-bold text-foreground">₹{price.toLocaleString("en-IN")}/mo</span>
                    </div>
                  )}
                </div>

                {/* Payment form */}
                <div className="px-6 py-5 space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-foreground">Card Number</Label>
                    <div className="relative">
                      <Input
                        placeholder="1234 5678 9012 3456"
                        className="pl-10 h-10 rounded-lg"
                      />
                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label className="text-xs font-semibold text-foreground">Expiry</Label>
                      <Input placeholder="MM/YY" className="h-10 rounded-lg" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-semibold text-foreground">CVV</Label>
                      <Input placeholder="123" type="password" className="h-10 rounded-lg" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-foreground">Name on Card</Label>
                    <Input placeholder="Ramesh Kumar" className="h-10 rounded-lg" />
                  </div>
                </div>

                {/* Pay button */}
                <div className="px-6 pb-6 space-y-3">
                  <Button
                    className="w-full h-11 gap-2 rounded-xl font-semibold text-sm shadow-md"
                    disabled={processing}
                    onClick={handlePayment}
                  >
                    {processing ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                          className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                        />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Lock className="h-4 w-4" />
                        Pay ₹{price.toLocaleString("en-IN")} & Upgrade
                      </>
                    )}
                  </Button>
                  <div className="flex items-center justify-center gap-1.5 text-[10px] text-muted-foreground">
                    <Lock className="h-3 w-3" />
                    Secured with 256-bit SSL encryption
                  </div>
                </div>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubscriptionBilling;
