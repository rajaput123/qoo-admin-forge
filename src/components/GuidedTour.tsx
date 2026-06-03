import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLang, t, type LangCode } from "@/lib/i18n";

export interface TourStep {
  selector: string; // CSS selector for the target
  title: string;
  description: string;
  i18n?: Partial<Record<LangCode, { title: string; description: string }>>;
}

interface GuidedTourProps {
  steps: TourStep[];
  storageKey?: string; // when set, persists "done" state
  autoStart?: boolean;
  startSignal?: number;
  onClose?: () => void;
}

const GuidedTour = ({ steps, storageKey, autoStart = true, startSignal = 0, onClose }: GuidedTourProps) => {
  const [lang] = useLang();
  const [active, setActive] = useState(false);
  const [index, setIndex] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (!autoStart) return;
    const pending = typeof window !== "undefined" && localStorage.getItem("templeHubTourPending") === "1";
    const done = storageKey && typeof window !== "undefined" && localStorage.getItem(storageKey) === "1";
    // Auto-start on first visit (pending flag from Welcome page) OR when tour hasn't been completed yet.
    if (!done && (pending || true)) {
      setActive(true);
      if (pending) localStorage.removeItem("templeHubTourPending");
    }
  }, [autoStart, storageKey]);

  useEffect(() => {
    if (startSignal <= 0) return;
    setIndex(0);
    setActive(true);
  }, [startSignal]);

  // Expose a global trigger so a button anywhere can (re)start the tour.
  useEffect(() => {
    const handler = () => {
      setIndex(0);
      setActive(true);
    };
    window.addEventListener("start-guided-tour", handler);
    return () => window.removeEventListener("start-guided-tour", handler);
  }, []);

  useEffect(() => {
    if (!active) return;
    const step = steps[index];
    if (!step) return;
    const el = document.querySelector(step.selector) as HTMLElement | null;
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      // wait for scroll then measure
      const id = setTimeout(() => setRect(el.getBoundingClientRect()), 350);
      return () => clearTimeout(id);
    } else {
      setRect(null);
    }
  }, [active, index, steps]);

  useEffect(() => {
    if (!active) return;
    const onResize = () => {
      const el = document.querySelector(steps[index]?.selector) as HTMLElement | null;
      setRect(el?.getBoundingClientRect() ?? null);
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onResize, true);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onResize, true);
    };
  }, [active, index, steps]);

  const finish = () => {
    setActive(false);
    if (storageKey) localStorage.setItem(storageKey, "1");
    onClose?.();
  };

  if (!active) return null;
  const step = steps[index];
  if (!step) return null;
  const tr = step.i18n?.[lang];
  const title = tr?.title ?? step.title;
  const description = tr?.description ?? step.description;

  // Position tooltip below the highlighted rect (or center if none)
  const padding = 8;
  const highlightStyle = rect
    ? {
        top: rect.top - padding,
        left: rect.left - padding,
        width: rect.width + padding * 2,
        height: rect.height + padding * 2,
      }
    : null;

  const tooltipTop = rect ? Math.min(rect.bottom + 16, window.innerHeight - 220) : window.innerHeight / 2 - 100;
  const tooltipLeft = rect
    ? Math.min(Math.max(rect.left, 16), window.innerWidth - 340)
    : window.innerWidth / 2 - 160;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] pointer-events-none"
      >
        {/* Dim overlay with cut-out */}
        <svg className="absolute inset-0 w-full h-full pointer-events-auto" onClick={finish}>
          <defs>
            <mask id="tour-mask">
              <rect width="100%" height="100%" fill="white" />
              {highlightStyle && (
                <rect
                  x={highlightStyle.left}
                  y={highlightStyle.top}
                  width={highlightStyle.width}
                  height={highlightStyle.height}
                  rx="12"
                  fill="black"
                />
              )}
            </mask>
          </defs>
          <rect width="100%" height="100%" fill="rgba(15,15,15,0.55)" mask="url(#tour-mask)" />
        </svg>

        {/* Highlight ring */}
        {highlightStyle && (
          <motion.div
            layout
            className="absolute rounded-xl ring-2 ring-primary ring-offset-2 ring-offset-transparent pointer-events-none"
            style={highlightStyle}
          />
        )}

        {/* Tooltip card */}
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute w-[320px] bg-card border border-border rounded-xl shadow-2xl p-4 pointer-events-auto"
          style={{ top: tooltipTop, left: tooltipLeft }}
        >
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <Sparkles className="h-3.5 w-3.5" />
              </div>
              <span className="text-xs font-medium text-muted-foreground">
                {t("step_of", lang, { a: index + 1, b: steps.length })}
              </span>
            </div>
            <button
              onClick={finish}
              className="p-1 rounded hover:bg-muted text-muted-foreground"
              aria-label="Close tour"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <h3 className="text-base font-semibold text-foreground mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground mb-4">{description}</p>

          {/* Progress bar (works for any number of steps) */}
          <div className="h-1 w-full bg-muted rounded-full overflow-hidden mb-3">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${((index + 1) / steps.length) * 100}%` }}
            />
          </div>

          <div className="flex items-center justify-between gap-2">
            <Button
              variant="ghost"
              size="sm"
              disabled={index === 0}
              onClick={() => setIndex((i) => Math.max(0, i - 1))}
              className="gap-1"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              {t("back", lang)}
            </Button>
            <div className="flex items-center gap-2">
              <button
                onClick={finish}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                {t("skip", lang)}
              </button>
              {index < steps.length - 1 ? (
                <Button size="sm" onClick={() => setIndex((i) => i + 1)} className="gap-1">
                  {t("next", lang)}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              ) : (
                <Button size="sm" onClick={finish} className="gap-1">
                  {t("finish", lang)}
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default GuidedTour;