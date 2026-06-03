// Plan definitions and module access mapping

export type BillingType = "both" | "monthly" | "annual";

export interface Plan {
  id: string;
  name: string;
  price: number; // base monthly price in INR, 0 = free
  period: string;
  description: string;
  modules: string[]; // module IDs included
  recommended?: boolean;
  badge?: string;
  /** Promotional discount % applied to subtotal (before GST). */
  discountPercent?: number;
  /** GST % applied on subtotal. */
  gstPercent?: number;
  /** Free months credited when paying annually (e.g. 2 = 2 months free). */
  freeMonths?: number;
  /** Which billing cycles this plan supports. */
  billingType?: BillingType;
  /** If true, hides numeric pricing and shows custom label/CTA (e.g. "Contact Sales"). */
  isCustomPrice?: boolean;
  /** Bold custom price label, e.g. "Platform fee" or "Let's talk". */
  customPriceLabel?: string;
  /** Subtitle for custom-priced plans, e.g. "Based on temple size". */
  customPriceDescription?: string;
  /** CTA button text, e.g. "Book a demo", "Get Started". */
  ctaText?: string;
}

export const PLANS: Plan[] = [
  {
    id: "seva",
    name: "Seva (T1)",
    price: 8999,
    period: "/month",
    description: "Digital presence + online bookings to launch your temple online",
    modules: [
      "temple-structure", "offerings", "bookings", "prasadam-kitchen",
      "donations", "communication", "events", "settings",
    ],
    discountPercent: 5,
    gstPercent: 18,
    freeMonths: 2,
    billingType: "both",
  },
  {
    id: "shraddha",
    name: "Shraddha (T2)",
    price: 18999,
    period: "/month",
    description: "Advanced PR, branded devotee app and rich engagement",
    modules: [
      "temple-structure", "offerings", "bookings", "donations", "events",
      "devotees", "vip-devotee", "prasadam-kitchen", "communication", "settings",
    ],
    recommended: true,
    badge: "🔥 Most Popular",
    discountPercent: 10,
    gstPercent: 18,
    freeMonths: 2,
    billingType: "both",
  },
  {
    id: "sampoorna",
    name: "Sampoorna (T3)",
    price: 28999,
    period: "/month",
    description: "Full back-office: finance, HR, payroll, projects & analytics",
    modules: [
      "temple-structure", "offerings", "bookings", "donations", "events",
      "devotees", "vip-devotee", "prasadam-kitchen", "communication",
      "people-hr", "finance", "freelancer", "tasks", "reports",
      "feedback", "knowledge", "projects", "settings",
    ],
    discountPercent: 10,
    gstPercent: 18,
    freeMonths: 2,
    billingType: "both",
  },
  {
    id: "sanskriti",
    name: "Custom (T6)",
    price: 0,
    period: "/month",
    description: "AI insights, custom integrations & white-label for large temples",
    modules: [
      "temple-structure", "offerings", "bookings", "donations", "events",
      "devotees", "vip-devotee", "prasadam-kitchen", "crowd", "communication",
      "people-hr", "finance", "freelancer", "tasks", "reports",
      "feedback", "knowledge", "projects", "branches", "institution",
      "suppliers", "assets", "planner", "settings",
    ],
    badge: "Enterprise / AI",
    discountPercent: 15,
    gstPercent: 18,
    freeMonths: 2,
    billingType: "both",
    isCustomPrice: true,
    customPriceLabel: "Let's talk",
    customPriceDescription: "Tailored pricing with dedicated SLA, custom AI services and white-label branding.",
    ctaText: "Book a demo",
  },
];

// Which plans to suggest when a locked module is clicked
export const MODULE_PLAN_SUGGESTIONS: Record<string, string[]> = {
  "offerings": ["seva", "shraddha", "sampoorna"],
  "bookings": ["seva", "shraddha", "sampoorna"],
  "prasadam-kitchen": ["seva", "shraddha", "sampoorna"],
  "donations": ["shraddha", "sampoorna", "sanskriti"],
  "events": ["shraddha", "sampoorna", "sanskriti"],
  "devotees": ["shraddha", "sampoorna", "sanskriti"],
  "vip-devotee": ["shraddha", "sampoorna", "sanskriti"],
  "communication": ["shraddha", "sampoorna", "sanskriti"],
  "people-hr": ["sampoorna", "sanskriti"],
  "finance": ["sampoorna", "sanskriti"],
  "freelancer": ["sampoorna", "sanskriti"],
  "tasks": ["sampoorna", "sanskriti"],
  "reports": ["sampoorna", "sanskriti"],
  "feedback": ["sampoorna", "sanskriti"],
  "knowledge": ["sampoorna", "sanskriti"],
  "projects": ["sampoorna", "sanskriti"],
  "crowd": ["sanskriti"],
  "branches": ["sanskriti"],
  "institution": ["sanskriti"],
  "suppliers": ["sanskriti"],
  "assets": ["sanskriti"],
  "planner": ["sanskriti"],
};

// Module benefits for the upgrade modal
export const MODULE_BENEFITS: Record<string, string[]> = {
  "offerings": ["Configure rituals & darshan slots", "Set custom pricing rules", "Assign priests automatically"],
  "bookings": ["Online & counter booking system", "Attendance tracking", "Real-time availability"],
  "donations": ["Donor management & receipts", "Fund allocation tracking", "80G certificate generation"],
  "events": ["Create & manage temple events", "Online registration & ticketing", "Capacity management"],
  "devotees": ["Devotee database & profiles", "Family & group management", "Communication preferences"],
  "vip-devotee": ["VIP devotee tracking", "Priority darshan management", "Special services coordination"],
  "prasadam-kitchen": ["Prasadam production planning", "Annadanam management", "Kitchen inventory tracking"],
  "communication": ["Announcements & notifications", "SMS & email campaigns", "Social media integration"],
  "people-hr": ["Employee management", "Attendance & leave tracking", "Payroll processing"],
  "finance": ["Income & expense tracking", "Voucher management", "Financial reports & audit"],
  "freelancer": ["Freelance worker management", "Contract tracking", "Payment processing"],
  "tasks": ["Task assignment & tracking", "Team coordination", "Priority management"],
  "reports": ["Cross-module analytics", "Custom report builder", "Export & share reports"],
  "feedback": ["Devotee feedback collection", "Ratings & sentiment analysis", "Service improvement insights"],
  "knowledge": ["Document management", "SOPs & guidelines", "Knowledge sharing"],
  "projects": ["Project planning & milestones", "Budget governance", "Team collaboration"],
  "crowd": ["Real-time crowd monitoring", "Queue management", "Safety alerts"],
  "branches": ["Multi-branch management", "Centralized controls", "Branch-level reporting"],
  "institution": ["School & hospital management", "Goshala tracking", "Trust entity management"],
  "suppliers": ["Supplier management", "Purchase orders", "Delivery tracking"],
  "assets": ["Asset register & tracking", "Maintenance scheduling", "Depreciation management"],
  "planner": ["Calendar & scheduling", "Event planning", "Resource allocation"],
  "settings": ["Temple profile", "User management", "System configuration"],
};

// Get the minimum plan required for a module
export function getMinimumPlan(moduleId: string): Plan | null {
  for (const plan of PLANS) {
    if (plan.modules.includes(moduleId)) return plan;
  }
  return null;
}

// Check if module is accessible under a given plan
export function isModuleAccessible(moduleId: string, currentPlanId: string): boolean {
  const plan = PLANS.find(p => p.id === currentPlanId);
  if (!plan) return false;
  return plan.modules.includes(moduleId);
}

// Get suggested plans for a module
export function getSuggestedPlans(moduleId: string): Plan[] {
  const planIds = MODULE_PLAN_SUGGESTIONS[moduleId] || ["shraddha", "sampoorna"];
  return planIds.map(id => PLANS.find(p => p.id === id)!).filter(Boolean);
}

// Format price
export function formatPrice(price: number): string {
  if (price === 0) return "Free";
  return `₹${price.toLocaleString("en-IN")}`;
}

// ----- Pricing math (synced with Admin pricing module) -----

export type BillingCycle = "monthly" | "annual";

export interface PriceBreakdown {
  /** Base list price for the cycle (monthly = monthlyPrice; annual = monthly * 12). */
  basePrice: number;
  /** Annual list price reduced by free months (annual only). */
  netBase: number;
  /** Discount amount in INR, applied to netBase. */
  discountAmount: number;
  /** Subtotal after discount, before GST. */
  subtotal: number;
  /** GST amount. */
  gstAmount: number;
  /** Final payable. */
  total: number;
  /** Effective price per month (total / 12 for annual; total for monthly). */
  perMonth: number;
  /** For annual: savings vs paying 12x the monthly final payable. */
  annualSavings: number;
}

/** Compute the full pricing breakdown for a plan and billing cycle. */
export function computePrice(plan: Plan, cycle: BillingCycle): PriceBreakdown {
  const monthly = plan.price;
  const discountPercent = plan.discountPercent ?? 0;
  const gstPercent = plan.gstPercent ?? 0;
  const freeMonths = plan.freeMonths ?? 0;

  if (monthly === 0) {
    return {
      basePrice: 0,
      netBase: 0,
      discountAmount: 0,
      subtotal: 0,
      gstAmount: 0,
      total: 0,
      perMonth: 0,
      annualSavings: 0,
    };
  }

  if (cycle === "monthly") {
    const basePrice = monthly;
    const discountAmount = Math.round(basePrice * (discountPercent / 100));
    const subtotal = basePrice - discountAmount;
    const gstAmount = Math.round(subtotal * (gstPercent / 100));
    const total = subtotal + gstAmount;
    return {
      basePrice,
      netBase: basePrice,
      discountAmount,
      subtotal,
      gstAmount,
      total,
      perMonth: total,
      annualSavings: 0,
    };
  }

  // Annual
  const basePrice = monthly * 12;
  const netBase = basePrice - monthly * freeMonths;
  const discountAmount = Math.round(netBase * (discountPercent / 100));
  const subtotal = netBase - discountAmount;
  const gstAmount = Math.round(subtotal * (gstPercent / 100));
  const total = subtotal + gstAmount;

  // Compare to paying monthly (with discount + GST) for 12 months
  const monthlyEquivalent = computePrice(plan, "monthly").total * 12;
  const annualSavings = Math.max(0, monthlyEquivalent - total);

  return {
    basePrice,
    netBase,
    discountAmount,
    subtotal,
    gstAmount,
    total,
    perMonth: Math.round(total / 12),
    annualSavings,
  };
}
