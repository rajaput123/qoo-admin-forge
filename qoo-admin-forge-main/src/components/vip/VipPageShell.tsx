import { ReactNode } from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface VipPageShellProps {
  eyebrow?: string;
  title: string;
  description: string;
  icon: LucideIcon;
  actions?: ReactNode;
  children: ReactNode;
}

/**
 * Shared premium hero shell for VIP module pages (Dashboard, Activity, Reports).
 * Provides a saffron gradient header band with subtle ornamental pattern,
 * eyebrow label, large title, description and a slot for actions.
 */
export const VipPageShell = ({
  eyebrow = "VIP MODULE",
  title,
  description,
  icon: Icon,
  actions,
  children,
}: VipPageShellProps) => {
  return (
    <div className="min-h-full bg-gradient-to-b from-amber-50/40 via-background to-background">
      {/* Hero band */}
      <div className="relative overflow-hidden border-b border-border/60">
        <div
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 25% 30%, hsl(var(--primary)) 0, transparent 40%), radial-gradient(circle at 80% 70%, hsl(38 92% 50%) 0, transparent 35%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, hsl(var(--primary)) 0 1px, transparent 1px 14px)",
          }}
        />
        <div className="relative px-6 pt-7 pb-6 md:px-10">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
          >
            <div className="flex items-start gap-4">
              <div className="hidden md:flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-[hsl(16_75%_22%)] shadow-lg shadow-primary/20 ring-1 ring-amber-200/40">
                <Icon className="h-7 w-7 text-primary-foreground" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="h-px w-6 bg-primary/60" />
                  <span className="text-[10px] font-semibold tracking-[0.18em] text-primary/80">
                    {eyebrow}
                  </span>
                </div>
                <h1 className="text-2xl md:text-[28px] font-semibold tracking-tight text-foreground leading-tight">
                  {title}
                </h1>
                <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
                  {description}
                </p>
              </div>
            </div>
            {actions && (
              <div className="flex flex-wrap items-center gap-2">{actions}</div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 md:px-10 py-6 space-y-6">{children}</div>
    </div>
  );
};

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  trailing?: ReactNode;
}

export const SectionHeader = ({ eyebrow, title, trailing }: SectionHeaderProps) => (
  <div className="flex items-end justify-between mb-3">
    <div>
      {eyebrow && (
        <p className="text-[10px] font-semibold tracking-[0.16em] text-primary/70 mb-1">
          {eyebrow}
        </p>
      )}
      <h2 className="text-base font-semibold tracking-tight">{title}</h2>
    </div>
    {trailing}
  </div>
);

interface VipKpiCardProps {
  label: string;
  value: string;
  sub?: string;
  icon: LucideIcon;
  accent?: "primary" | "amber" | "blue" | "green" | "rose";
  delta?: { value: string; positive?: boolean };
}

const accentMap: Record<NonNullable<VipKpiCardProps["accent"]>, { bar: string; chip: string }> = {
  primary: {
    bar: "bg-gradient-to-b from-primary to-[hsl(16_75%_22%)]",
    chip: "bg-primary/10 text-primary",
  },
  amber: {
    bar: "bg-gradient-to-b from-amber-500 to-amber-700",
    chip: "bg-amber-500/10 text-amber-700",
  },
  blue: {
    bar: "bg-gradient-to-b from-sky-500 to-blue-700",
    chip: "bg-sky-500/10 text-sky-700",
  },
  green: {
    bar: "bg-gradient-to-b from-emerald-500 to-emerald-700",
    chip: "bg-emerald-500/10 text-emerald-700",
  },
  rose: {
    bar: "bg-gradient-to-b from-rose-500 to-rose-700",
    chip: "bg-rose-500/10 text-rose-700",
  },
};

export const VipKpiCard = ({
  label,
  value,
  sub,
  icon: Icon,
  accent = "primary",
  delta,
}: VipKpiCardProps) => {
  const a = accentMap[accent];
  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-card shadow-sm hover:shadow-md transition-all duration-200">
      <div className={`absolute left-0 top-0 h-full w-1 ${a.bar}`} />
      <div className="p-4 pl-5">
        <div className="flex items-start justify-between">
          <p className="text-[11px] uppercase tracking-wider font-medium text-muted-foreground">
            {label}
          </p>
          <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${a.chip}`}>
            <Icon className="h-4 w-4" />
          </div>
        </div>
        <p className="text-2xl font-bold tracking-tight mt-2 text-foreground">{value}</p>
        <div className="flex items-center justify-between mt-1">
          {sub && <p className="text-[11px] text-muted-foreground">{sub}</p>}
          {delta && (
            <span
              className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                delta.positive
                  ? "bg-emerald-500/10 text-emerald-700"
                  : "bg-rose-500/10 text-rose-700"
              }`}
            >
              {delta.positive ? "▲" : "▼"} {delta.value}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};