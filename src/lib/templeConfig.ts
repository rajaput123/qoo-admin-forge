/**
 * Temple master details used across all 80G compliance documents.
 * Loaded from localStorage when available (registration / finance settings).
 */

export interface TempleConfig {
  name: string;
  address: string;
  pan: string;
  registration80G: string;
  validityFrom: string;
  validityTo: string;
  signatory: string;
  phone: string;
  email: string;
  eightyGEnabled: boolean;
  associatedBankAccountId: string | null;
  associated80GBankAccountId: string | null;
}

export const DEFAULT_TEMPLE_CONFIG: TempleConfig = {
  name: "Shri Venkateswara Devasthanam",
  address: "Near Bypass Road, Karwar – 581301, Karnataka",
  pan: "AAATS1234A",
  registration80G: "AAATS1234A/80G/2023-24",
  validityFrom: "2023-04-01",
  validityTo: "2028-03-31",
  signatory: "Sri T. Ramachandra Bhat, Executive Officer",
  phone: "+91 8382 226 100",
  email: "office@svdevasthanam.org",
  eightyGEnabled: true,
  associatedBankAccountId: "BANK-001",
  associated80GBankAccountId: null,
};

/** @deprecated Use getTempleConfig() for runtime values */
export const TEMPLE_CONFIG = DEFAULT_TEMPLE_CONFIG;

const LS_KEY = "qoo.temple.config";

export function getTempleConfig(): TempleConfig {
  if (typeof window === "undefined") return { ...DEFAULT_TEMPLE_CONFIG };
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return { ...DEFAULT_TEMPLE_CONFIG, ...JSON.parse(raw) };
    const reg = localStorage.getItem("registrationData");
    if (reg) {
      const data = JSON.parse(reg) as Record<string, string | undefined>;
      if (data.registration80G || data.pan80G) {
        return {
          ...DEFAULT_TEMPLE_CONFIG,
          name: data.templeName || DEFAULT_TEMPLE_CONFIG.name,
          address: data.fullAddress
            ? `${data.fullAddress}${data.city ? `, ${data.city}` : ""}${data.state ? ` – ${data.state}` : ""}`
            : DEFAULT_TEMPLE_CONFIG.address,
          pan: data.pan80G || DEFAULT_TEMPLE_CONFIG.pan,
          registration80G: data.registration80G || DEFAULT_TEMPLE_CONFIG.registration80G,
          validityFrom: data.validityFrom80G || DEFAULT_TEMPLE_CONFIG.validityFrom,
          validityTo: data.validityTo80G || DEFAULT_TEMPLE_CONFIG.validityTo,
          email: data.email || DEFAULT_TEMPLE_CONFIG.email,
          phone: data.mobile ? `+91 ${data.mobile}` : DEFAULT_TEMPLE_CONFIG.phone,
          eightyGEnabled: data.has80G === "yes" || Boolean(data.registration80G),
        };
      }
    }
  } catch {
    /* ignore */
  }
  return { ...DEFAULT_TEMPLE_CONFIG };
}

export function saveTempleConfig(partial: Partial<TempleConfig>): TempleConfig {
  const next = { ...getTempleConfig(), ...partial };
  if (typeof window !== "undefined") {
    localStorage.setItem(LS_KEY, JSON.stringify(next));
  }
  return next;
}

export function format80GValidity(from: string, to: string): string {
  const fmt = (d: string) => {
    if (!d) return "—";
    const date = new Date(d);
    if (Number.isNaN(date.getTime())) return d;
    return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  };
  return `${fmt(from)} to ${fmt(to)}`;
}

/** True when 80G is enabled and today falls within the validity window */
export function is80GCertificateValid(config?: TempleConfig): boolean {
  const cfg = config ?? getTempleConfig();
  if (!cfg.eightyGEnabled || !cfg.validityFrom || !cfg.validityTo) return false;
  const today = new Date().toISOString().slice(0, 10);
  return today >= cfg.validityFrom && today <= cfg.validityTo;
}

export function get80GStatusLabel(config?: TempleConfig): "Disabled" | "Not configured" | "Active" | "Expired" {
  const cfg = config ?? getTempleConfig();
  if (!cfg.eightyGEnabled) return "Disabled";
  if (!cfg.registration80G || cfg.pan.length !== 10) return "Not configured";
  return is80GCertificateValid(cfg) ? "Active" : "Expired";
}

/** What the temple chose during registration (`yes` / `no`), or null if not registered via app */
export function getRegistration80GChoice(): "yes" | "no" | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("registrationData");
    if (!raw) return null;
    const data = JSON.parse(raw) as { has80G?: string };
    if (data.has80G === "yes" || data.has80G === "no") return data.has80G;
  } catch {
    /* ignore */
  }
  return null;
}

/** True when 80G details were captured at registration and user has not opened edit mode */
export function has80GFromRegistration(): boolean {
  return getRegistration80GChoice() === "yes" && Boolean(getTempleConfig().registration80G);
}

export const ONBOARDING_KEYS = {
  subscriptionComplete: "subscriptionComplete",
  financeSetupComplete: "financeSetupComplete",
} as const;

export function isSubscriptionComplete(): boolean {
  return typeof window !== "undefined" && localStorage.getItem(ONBOARDING_KEYS.subscriptionComplete) === "1";
}

export function isFinanceSetupComplete(): boolean {
  return typeof window !== "undefined" && localStorage.getItem(ONBOARDING_KEYS.financeSetupComplete) === "1";
}

export function markSubscriptionComplete(): void {
  localStorage.setItem(ONBOARDING_KEYS.subscriptionComplete, "1");
}

export function markFinanceSetupComplete(): void {
  localStorage.setItem(ONBOARDING_KEYS.financeSetupComplete, "1");
}
