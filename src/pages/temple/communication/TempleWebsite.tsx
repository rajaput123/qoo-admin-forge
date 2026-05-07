import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Lock, Sparkles, Crown, Globe, Star, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import TempleWebsitePreview from "@/components/communication/TempleWebsitePreview";
import { PLANS } from "@/lib/plans";
import { toast } from "sonner";

// Mock current plan — would come from tenant context
const currentPlanId = "seva";

type TemplateId = "plus" | "featured" | "advanced" | "custom";

interface TemplateDef {
  id: TemplateId;
  name: string;
  tier: string;
  planId: string;
  tagline: string;
  description: string;
  highlights: string[];
  icon: typeof Zap;
  theme: {
    colorScheme: string;
    fontStyle: string;
    heroTagline: string;
    welcomeMessage: string;
    sections: {
      about: boolean; timings: boolean; gallery: boolean;
      donations: boolean; contact: boolean; sevas: boolean; events: boolean;
    };
  };
}

const TEMPLATES: TemplateDef[] = [
  {
    id: "plus",
    name: "Plus",
    tier: "T1 — Seva",
    planId: "seva",
    tagline: "Essential temple presence",
    description: "A clean single-page Saffron site covering temple identity, timings and contact.",
    highlights: ["Hero + about", "Darshan timings", "Contact & map", "Saffron theme only"],
    icon: Zap,
    theme: {
      colorScheme: "saffron",
      fontStyle: "modern",
      heroTagline: "Welcome to our sacred abode — divine blessings await",
      welcomeMessage: "Om Namaha — Visit us for darshan and seva",
      sections: {
        about: true, timings: true, contact: true,
        sevas: false, events: false, gallery: false, donations: false,
      },
    },
  },
  {
    id: "featured",
    name: "Featured",
    tier: "T2 — Shraddha",
    planId: "shraddha",
    tagline: "Engagement-rich devotee site",
    description: "Adds online sevas, events and donations CTA — designed for active devotee engagement.",
    highlights: ["Everything in Plus", "Sevas & online booking", "Events calendar", "Donate CTA section", "Maroon / Gold themes"],
    icon: Star,
    theme: {
      colorScheme: "maroon",
      fontStyle: "modern",
      heroTagline: "Experience divine blessings — book sevas and join festivals online",
      welcomeMessage: "Om Namaha — Welcome to our growing devotee community",
      sections: {
        about: true, timings: true, sevas: true, events: true,
        donations: true, contact: true, gallery: false,
      },
    },
  },
  {
    id: "advanced",
    name: "Advanced",
    tier: "T3 — Sampoorna",
    planId: "sampoorna",
    tagline: "Full-featured temple portal",
    description: "Complete site with gallery, donor wall, projects and analytics-ready sections.",
    highlights: ["Everything in Featured", "Photo gallery", "Donor list on website", "Project & event P&L visibility", "All theme presets"],
    icon: Crown,
    theme: {
      colorScheme: "gold",
      fontStyle: "traditional",
      heroTagline: "A timeless sanctuary of faith — explore, book, donate and contribute",
      welcomeMessage: "Om Namaha — A sacred home for devotees worldwide",
      sections: {
        about: true, timings: true, sevas: true, events: true,
        donations: true, contact: true, gallery: true,
      },
    },
  },
  {
    id: "custom",
    name: "Custom",
    tier: "T6 — Custom / AI",
    planId: "sanskriti",
    tagline: "White-label, AI-powered website",
    description: "Bespoke design, custom domain, AI devotee insights and full integrations.",
    highlights: ["Everything in Advanced", "Custom domain & branding", "AI devotee insights", "Custom integrations / API", "Dedicated SLA & support"],
    icon: Sparkles,
    theme: {
      colorScheme: "teal",
      fontStyle: "traditional",
      heroTagline: "Your temple, reimagined — a bespoke divine experience online",
      welcomeMessage: "Om Namaha — A divine digital home, crafted just for you",
      sections: {
        about: true, timings: true, sevas: true, events: true,
        donations: true, contact: true, gallery: true,
      },
    },
  },
];

const tierOrder: Record<string, number> = { seva: 1, shraddha: 2, sampoorna: 3, sanskriti: 4 };

const TempleWebsite = () => {
  const [selected, setSelected] = useState<TemplateId>(() => {
    const t = TEMPLATES.find(t => t.planId === currentPlanId);
    return (t?.id ?? "plus") as TemplateId;
  });

  const isUnlocked = (planId: string) =>
    (tierOrder[planId] ?? 99) <= (tierOrder[currentPlanId] ?? 0);

  const active = TEMPLATES.find(t => t.id === selected)!;
  const activeUnlocked = isUnlocked(active.planId);

  return (
    <div className="min-h-screen p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Globe className="h-6 w-6 text-primary" /> Temple Website
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Choose a website template — each tier unlocks a richer design and more sections.
          </p>
        </div>
        <Badge variant="outline" className="text-xs border-primary/30 text-primary bg-primary/5">
          Current plan: {PLANS.find(p => p.id === currentPlanId)?.name ?? currentPlanId}
        </Badge>
      </div>

      {/* Template selector */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {TEMPLATES.map((t) => {
          const Icon = t.icon;
          const unlocked = isUnlocked(t.planId);
          const isActive = t.id === selected;
          return (
            <motion.button
              key={t.id}
              type="button"
              onClick={() => setSelected(t.id)}
              whileHover={{ y: -2 }}
              className={`text-left rounded-2xl border p-4 transition-all relative overflow-hidden ${
                isActive
                  ? "border-primary/60 ring-2 ring-primary/20 shadow-lg bg-card"
                  : "border-border bg-card hover:border-primary/30 hover:shadow-md"
              } ${!unlocked ? "opacity-80" : ""}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                  unlocked ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                }`}>
                  <Icon className="h-5 w-5" />
                </div>
                {unlocked ? (
                  isActive && <Badge className="text-[10px] bg-primary text-primary-foreground">Selected</Badge>
                ) : (
                  <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                )}
              </div>
              <h3 className="text-base font-bold text-foreground">{t.name}</h3>
              <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold mt-0.5">
                {t.tier}
              </p>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{t.tagline}</p>
              <div className="mt-3 space-y-1.5">
                {t.highlights.slice(0, 3).map(h => (
                  <div key={h} className="flex items-start gap-1.5 text-[11px] text-foreground/80">
                    <Check className="h-3 w-3 text-primary mt-0.5 shrink-0" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Active template details */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-lg font-bold text-foreground">
              {active.name} template preview
            </h2>
            <p className="text-sm text-muted-foreground mt-1">{active.description}</p>
          </div>
          {activeUnlocked ? (
            <Button
              size="sm"
              className="gap-1.5"
              onClick={() => toast.success(`${active.name} template applied`)}
            >
              <Check className="h-4 w-4" /> Apply this template
            </Button>
          ) : (
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5 border-primary/40 text-primary"
              onClick={() => toast.info(`Upgrade to ${active.tier} to unlock`)}
            >
              <Crown className="h-4 w-4" /> Upgrade to unlock
            </Button>
          )}
        </div>
      </div>

      {/* Live preview */}
      <div className={`rounded-2xl overflow-hidden border border-border bg-white shadow-sm relative ${
        !activeUnlocked ? "opacity-95" : ""
      }`}>
        {!activeUnlocked && (
          <div className="absolute top-3 right-3 z-30">
            <Badge className="bg-foreground/80 text-background gap-1 backdrop-blur-sm">
              <Lock className="h-3 w-3" /> Locked preview
            </Badge>
          </div>
        )}
        <TempleWebsitePreview theme={active.theme} />
      </div>
    </div>
  );
};

export default TempleWebsite;
