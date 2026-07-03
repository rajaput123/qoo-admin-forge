import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Lock, Sparkles, Crown, Globe, Star, Zap, ArrowUpRight, Palette, X, ExternalLink } from "lucide-react";
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
  accent: string; // tailwind gradient classes
  swatch: string[]; // preview colors
  theme: {
    colorScheme: string;
    fontStyle: string;
    heroTagline: string;
    welcomeMessage: string;
    sections: {
      about: boolean; timings: boolean; gallery: boolean;
      donations: boolean; contact: boolean; sevas: boolean; events: boolean;
      childTemples?: boolean; sacredDetails?: boolean; announcements?: boolean;
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
    highlights: ["Hero + about", "Darshan timings", "Sevas & booking", "Donations CTA", "Child Temples", "Adhishtanams", "Contact & map"],
    icon: Zap,
    accent: "from-amber-500 via-orange-500 to-amber-600",
    swatch: ["#92400e", "#d97706", "#fbbf24"],
    theme: {
      colorScheme: "saffron",
      fontStyle: "modern",
      heroTagline: "Welcome to our sacred abode — divine blessings await",
      welcomeMessage: "Om Namaha — Visit us for darshan and seva",
      sections: {
        about: true, timings: true, contact: true,
        sevas: true, events: false, gallery: false, donations: true,
        childTemples: true, sacredDetails: true, announcements: false,
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
    highlights: ["Everything in Plus", "Sevas & online booking", "Events calendar", "Child Temples", "Announcements", "Donate CTA section", "Maroon / Gold themes"],
    icon: Star,
    accent: "from-rose-600 via-red-600 to-rose-700",
    swatch: ["#881337", "#be123c", "#f43f5e"],
    theme: {
      colorScheme: "maroon",
      fontStyle: "modern",
      heroTagline: "Experience divine blessings — book sevas and join festivals online",
      welcomeMessage: "Om Namaha — Welcome to our growing devotee community",
      sections: {
        about: true, timings: true, sevas: true, events: true,
        donations: true, contact: true, gallery: false,
        childTemples: true, sacredDetails: true, announcements: true,
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
    highlights: ["Everything in Featured", "Photo gallery", "Adhishtanams", "Donor list on website", "Project & event P&L visibility", "All theme presets"],
    icon: Crown,
    accent: "from-yellow-500 via-amber-500 to-yellow-600",
    swatch: ["#713f12", "#ca8a04", "#facc15"],
    theme: {
      colorScheme: "gold",
      fontStyle: "traditional",
      heroTagline: "A timeless sanctuary of faith — explore, book, donate and contribute",
      welcomeMessage: "Om Namaha — A sacred home for devotees worldwide",
      sections: {
        about: true, timings: true, sevas: true, events: true,
        donations: true, contact: true, gallery: true,
        childTemples: true, sacredDetails: true, announcements: true,
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
    accent: "from-teal-600 via-emerald-600 to-teal-700",
    swatch: ["#134e4a", "#0d9488", "#5eead4"],
    theme: {
      colorScheme: "teal",
      fontStyle: "traditional",
      heroTagline: "Your temple, reimagined — a bespoke divine experience online",
      welcomeMessage: "Om Namaha — A divine digital home, crafted just for you",
      sections: {
        about: true, timings: true, sevas: true, events: true,
        donations: true, contact: true, gallery: true,
        childTemples: true, sacredDetails: true, announcements: true,
      },
    },
  },
];

const tierOrder: Record<string, number> = { seva: 1, shraddha: 2, sampoorna: 3, sanskriti: 4 };

const TempleWebsite = () => {
  const [openId, setOpenId] = useState<TemplateId | null>(null);

  const isUnlocked = (planId: string) =>
    (tierOrder[planId] ?? 99) <= (tierOrder[currentPlanId] ?? 0);

  const active = TEMPLATES.find(t => t.id === openId) || null;
  const activeUnlocked = active ? isUnlocked(active.planId) : false;
  const currentPlanName = PLANS.find(p => p.id === currentPlanId)?.name ?? currentPlanId;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* ── Hero header ── */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/10 via-card to-card p-8 shadow-sm"
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 20%, hsl(var(--primary)) 0, transparent 40%), radial-gradient(circle at 80% 80%, hsl(var(--primary)) 0, transparent 40%)",
            }}
          />
          <div className="relative flex items-start justify-between gap-6 flex-wrap">
            <div className="flex items-start gap-4">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/20">
                <Globe className="h-7 w-7" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary/70">Communication</span>
                  <span className="h-1 w-1 rounded-full bg-primary/40" />
                  <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground">Website</span>
                </div>
                <h1 className="text-3xl font-bold text-foreground tracking-tight">Temple Website Studio</h1>
                <p className="text-sm text-muted-foreground mt-1.5 max-w-xl">
                  Pick a beautifully crafted template. Each plan tier unlocks richer designs, more sections, and deeper devotee engagement.
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/15 gap-1.5">
                <Crown className="h-3 w-3" /> {currentPlanName} plan
              </Badge>
              <span className="text-[11px] text-muted-foreground">
                {TEMPLATES.filter(t => isUnlocked(t.planId)).length} of {TEMPLATES.length} templates unlocked
              </span>
            </div>
          </div>
        </motion.div>

        {/* ── Template gallery ── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Palette className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">Choose a template</h2>
            </div>
            <span className="text-xs text-muted-foreground hidden sm:block">Click any card to open the live website</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {TEMPLATES.map((t, idx) => {
              const Icon = t.icon;
              const unlocked = isUnlocked(t.planId);
              const isActive = t.id === openId;
              return (
                <motion.button
                  key={t.id}
                  type="button"
                  onClick={() => setOpenId(t.id)}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ y: -4 }}
                  className={`group text-left rounded-2xl border bg-card transition-all relative overflow-hidden ${
                    isActive
                      ? "border-primary/60 ring-2 ring-primary/20 shadow-xl shadow-primary/10"
                      : "border-border hover:border-primary/30 hover:shadow-lg"
                  }`}
                >
                  {/* Top gradient banner */}
                  <div className={`h-24 bg-gradient-to-br ${t.accent} relative overflow-hidden`}>
                    <div
                      className="absolute inset-0 opacity-20"
                      style={{
                        backgroundImage:
                          "radial-gradient(circle at 30% 30%, white 1px, transparent 1px)",
                        backgroundSize: "16px 16px",
                      }}
                    />
                    <div className="absolute top-3 left-3 h-10 w-10 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="absolute top-3 right-3">
                      {unlocked ? (
                        <Badge className="text-[10px] bg-white/25 text-white border-white/30 backdrop-blur-sm gap-1">
                          <ExternalLink className="h-2.5 w-2.5" /> Open
                        </Badge>
                      ) : (
                        <div className="h-7 w-7 rounded-full bg-black/30 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                          <Lock className="h-3.5 w-3.5 text-white" />
                        </div>
                      )}
                    </div>
                    {/* Color swatches */}
                    <div className="absolute bottom-3 left-3 flex -space-x-1.5">
                      {t.swatch.map((s, i) => (
                        <div
                          key={i}
                          className="h-4 w-4 rounded-full border-2 border-white/80 shadow"
                          style={{ background: s }}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex items-baseline justify-between gap-2 mb-1">
                      <h3 className="text-lg font-bold text-foreground">{t.name}</h3>
                      <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
                        {t.tier.split("—")[0].trim()}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-3 line-clamp-2">{t.tagline}</p>
                    <div className="space-y-1.5 pt-3 border-t border-border/60">
                      {t.highlights.slice(0, 3).map(h => (
                        <div key={h} className="flex items-start gap-1.5 text-[11px] text-foreground/75">
                          <Check className="h-3 w-3 text-primary mt-0.5 shrink-0" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 flex items-center justify-between text-[11px] font-semibold text-primary">
                      <span>View website</span>
                      <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ─────── Fullscreen website viewer ─────── */}
      {active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex flex-col"
          onClick={() => setOpenId(null)}
        >
          {/* Browser chrome */}
          <div
            className="flex items-center gap-3 px-4 py-2.5 bg-neutral-900 text-white border-b border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex gap-1.5">
              <button onClick={() => setOpenId(null)} className="h-3 w-3 rounded-full bg-red-500 hover:scale-110 transition-transform" title="Close" />
              <div className="h-3 w-3 rounded-full bg-amber-400" />
              <div className="h-3 w-3 rounded-full bg-emerald-500" />
            </div>
            <div className="flex-1 mx-4 max-w-xl">
              <div className="bg-white/10 rounded-md px-3 py-1 text-xs font-mono text-white/80 flex items-center gap-2">
                <Globe className="h-3 w-3" />
                yourtemple.devalaya.app
                <span className="text-white/40">·</span>
                <span className="text-[10px] uppercase tracking-wider text-white/50">{active.name} template</span>
              </div>
            </div>
            <Badge className={`bg-gradient-to-r ${active.accent} text-white border-0 text-[10px]`}>{active.tier}</Badge>
            {activeUnlocked ? (
              <Button
                size="sm"
                className="gap-1.5 h-7 text-xs"
                onClick={() => { toast.success(`${active.name} template applied`); setOpenId(null); }}
              >
                <Check className="h-3.5 w-3.5" /> Apply
              </Button>
            ) : (
              <Button
                size="sm"
                className={`gap-1.5 h-7 text-xs bg-gradient-to-r ${active.accent} text-white border-0 hover:opacity-90`}
                onClick={() => toast.info(`Upgrade to ${active.tier} to unlock`)}
              >
                <Crown className="h-3.5 w-3.5" /> Upgrade
              </Button>
            )}
            <button
              onClick={() => setOpenId(null)}
              className="h-8 w-8 rounded-md hover:bg-white/10 flex items-center justify-center transition-colors"
              title="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Website content */}
          <div
            className="flex-1 overflow-y-auto bg-white relative"
            onClick={(e) => e.stopPropagation()}
          >
            {!activeUnlocked && (
              <div className="sticky top-0 z-30 bg-foreground/90 text-background backdrop-blur-md px-4 py-2 text-xs flex items-center justify-center gap-2">
                <Lock className="h-3 w-3" />
                This template is locked. Upgrade to {active.tier} to use it on your live site.
              </div>
            )}
            <TempleWebsitePreview theme={active.theme} />
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default TempleWebsite;
