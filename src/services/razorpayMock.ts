/**
 * razorpayMock.ts
 * ---------------
 * Mock Razorpay settlement reference fetch.
 * Replace `fetchRazorpayRef` with a real Razorpay API call when ready.
 * The shape: pay_<random 14-char alphanumeric>
 */

const MOCK_REFS: Record<string, string> = {
  "TXN-2026-0101": "pay_Nx81KqTbAa1201",
  "TXN-2026-0102": "pay_Qr94MsTcBb1202",
  "TXN-2026-0103": "pay_Lm55JkRaXx1203",
  "TXN-2026-0111": "pay_Pp73WwYzCc1211",
  "TXN-2026-0112": "pay_Rr61VvXdDd1212",
};

/**
 * Stub: fetches a Razorpay payment reference for a given transaction.
 * Returns null if the transaction is not a Payment Gateway transaction.
 */
export async function fetchRazorpayRef(txnId: string): Promise<string | null> {
  // Simulate network latency
  await new Promise((r) => setTimeout(r, 150));
  return MOCK_REFS[txnId] ?? `pay_${Math.random().toString(36).slice(2, 16).toUpperCase()}`;
}

/**
 * Returns true if a transaction nature triggers Razorpay auto-fetch.
 */
export function isRazorpayNature(nature: string): boolean {
  return nature === "Payment Gateway";
}
