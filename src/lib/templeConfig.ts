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
          eightyGEnabled: Boolean(data.registration80G),
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
