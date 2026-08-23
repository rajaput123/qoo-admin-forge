/**
 * Ledger / Account mapping resolver.
 *
 * Single source of truth used by counter entry, bulk import and the General
 * Ledger sync so an imported transaction always lands on the SAME configured
 * account as a manually-entered one. Unmapped rows are flagged, never silently
 * defaulted.
 */

import type { PaymentMethod } from "./types";

export interface AccountMapping {
  /** Asset account money lands in (debit side) */
  accountId: string;
  accountName: string;
  paymentMethod: PaymentMethod;
  /** Income account (credit side) used for reporting/verification */
  incomeAccountId: string;
  incomeAccountName: string;
  /** false → mapping could not be resolved and must be flagged to the user */
  mapped: boolean;
  reason?: string;
}

const CASH = { accountId: "ACC-001", accountName: "Cash on Hand", paymentMethod: "Cash" as PaymentMethod };
const BANK = { accountId: "ACC-002", accountName: "SBI Main Account", paymentMethod: "Bank" as PaymentMethod };
const UPI = { accountId: "ACC-004", accountName: "UPI Wallet", paymentMethod: "UPI" as PaymentMethod };
const CHEQUE = { accountId: "ACC-002", accountName: "SBI Main Account", paymentMethod: "Cheque" as PaymentMethod };

const DONATION_INCOME = { incomeAccountId: "ACC-010", incomeAccountName: "Donation Income" };
const HUNDI_INCOME = { incomeAccountId: "ACC-012", incomeAccountName: "Hundi Collection" };
const SEVA_INCOME = { incomeAccountId: "ACC-011", incomeAccountName: "Seva Revenue" };
const EVENT_INCOME = { incomeAccountId: "ACC-013", incomeAccountName: "Event Income" };

function resolveSettlement(raw: string) {
  const v = (raw || "").toLowerCase();
  if (!v) return null;
  if (v.includes("cheque") || v.includes("check") || v.includes("chq")) return CHEQUE;
  if (v.includes("upi") || v.includes("gpay") || v.includes("phonepe") || v.includes("paytm") || v.includes("qr")) return UPI;
  if (v.includes("bank") || v.includes("neft") || v.includes("rtgs") || v.includes("imps") || v.includes("transfer") || v.includes("online") || v.includes("razorpay") || v.includes("card")) return BANK;
  if (v.includes("cash")) return CASH;
  return null;
}

/** Resolve the ledger accounts for a Donation row. */
export function resolveDonationAccount(channel: string, nature: string, purpose?: string): AccountMapping {
  if (nature === "Non-Cash") {
    return {
      accountId: "ACC-010", accountName: "Donation Income", paymentMethod: "Cash",
      ...DONATION_INCOME, mapped: true,
    };
  }
  const settlement = resolveSettlement(channel);
  const income =
    purpose?.toLowerCase().includes("hundi") ? HUNDI_INCOME
      : purpose?.toLowerCase().includes("seva") ? SEVA_INCOME
        : purpose?.toLowerCase().includes("event") ? EVENT_INCOME
          : DONATION_INCOME;

  if (!settlement) {
    return {
      accountId: "", accountName: "", paymentMethod: "Cash", ...income,
      mapped: false,
      reason: `No ledger account configured for payment channel "${channel || "(blank)"}".`,
    };
  }
  return { ...settlement, ...income, mapped: true };
}

/** Resolve the ledger accounts for a Booking / Seva row. */
export function resolveSevaAccount(paymentMethod: string, paymentMode?: string): AccountMapping {
  const settlement = resolveSettlement(paymentMethod) || resolveSettlement(paymentMode || "");
  if (!settlement) {
    return {
      accountId: "", accountName: "", paymentMethod: "Cash", ...SEVA_INCOME,
      mapped: false,
      reason: `No ledger account configured for payment method "${paymentMethod || "(blank)"}".`,
    };
  }
  return { ...settlement, ...SEVA_INCOME, mapped: true };
}
