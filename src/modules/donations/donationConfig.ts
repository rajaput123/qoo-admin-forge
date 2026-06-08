/**
 * Donation business rules — persisted in localStorage and applied across the donation flow.
 */

export interface DonationConfig {
  /** Minimum cash/non-cash value (₹) required to record a donation */
  minDonationAmount: number;
  /** Amount (₹) at or above which 80G is auto-suggested */
  eightyGThreshold: number;
  /** PAN is required for every donation regardless of 80G choice */
  panMandatory: boolean;
  /** Donors may record donations without revealing identity */
  anonymousDonationAllowed: boolean;
  /** Automatically generate receipt PDF on save */
  autoReceiptGeneration: boolean;
  /** Refunds require manual approval before processing */
  refundApprovalRequired: boolean;
  /** Which purpose categories appear in the donation form */
  purposeCategories: {
    general: boolean;
    project: boolean;
    events: boolean;
    others: boolean;
  };
}

export const DEFAULT_DONATION_CONFIG: DonationConfig = {
  minDonationAmount: 1,
  eightyGThreshold: 2000,
  panMandatory: false,
  anonymousDonationAllowed: false,
  autoReceiptGeneration: true,
  refundApprovalRequired: true,
  purposeCategories: {
    general: true,
    project: true,
    events: true,
    others: true,
  },
};

const LS_KEY = "qoo.donation.config";

type Listener = () => void;
const listeners = new Set<Listener>();

// Keep a stable snapshot reference to avoid infinite re-renders with
// `useSyncExternalStore` (it uses Object.is on the snapshot).
let cachedRaw: string | null | undefined = undefined;
let cachedConfig: DonationConfig = DEFAULT_DONATION_CONFIG;

export function subscribeDonationConfig(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function notify() {
  listeners.forEach((l) => l());
}

export function getDonationConfig(): DonationConfig {
  if (typeof window === "undefined") return { ...DEFAULT_DONATION_CONFIG };
  try {
    const raw = localStorage.getItem(LS_KEY);
    // If nothing changed in localStorage, return the exact same object reference.
    if (raw === cachedRaw) return cachedConfig;

    if (raw) {
      const parsed = JSON.parse(raw) as Partial<DonationConfig>;
      cachedConfig = {
        ...DEFAULT_DONATION_CONFIG,
        ...parsed,
        purposeCategories: {
          ...DEFAULT_DONATION_CONFIG.purposeCategories,
          ...parsed.purposeCategories,
        },
      };
    } else {
      cachedConfig = DEFAULT_DONATION_CONFIG;
    }
    cachedRaw = raw;
    return cachedConfig;
  } catch {
    /* ignore */
  }
  return { ...DEFAULT_DONATION_CONFIG };
}

export function saveDonationConfig(partial: Partial<DonationConfig>): DonationConfig {
  const base = getDonationConfig();
  const next: DonationConfig = {
    ...base,
    ...partial,
    purposeCategories: partial.purposeCategories
      ? { ...base.purposeCategories, ...partial.purposeCategories }
      : base.purposeCategories,
  };
  if (typeof window !== "undefined") {
    const raw = JSON.stringify(next);
    localStorage.setItem(LS_KEY, raw);
    cachedRaw = raw;
    cachedConfig = next;
    notify();
  }
  return next;
}
