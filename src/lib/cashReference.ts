/**
 * Cash / Transaction Reference Number generator.
 *
 * Every cash transaction in Booking-Seva and Donation modules gets a unique,
 * sequential reference for tracking, reconciliation and audit.
 *
 * Format:  CSH-DON/2026/08/000123   |   CSH-SVA/2026/08/000045
 */

const SEQ_KEY = "qoo.cashref.seq.v1";

export type CashRefScope = "DON" | "SVA";

type SeqMap = Record<string, number>;

function readSeq(): SeqMap {
  try {
    const raw = localStorage.getItem(SEQ_KEY);
    if (raw) return JSON.parse(raw) as SeqMap;
  } catch { /* ignore */ }
  return {};
}

function writeSeq(map: SeqMap) {
  try { localStorage.setItem(SEQ_KEY, JSON.stringify(map)); } catch { /* ignore */ }
}

/** Generates the next sequential cash reference number for the given scope/date. */
export function generateCashReference(scope: CashRefScope, date?: string): string {
  const d = date ? new Date(date) : new Date();
  const safe = isNaN(d.getTime()) ? new Date() : d;
  const yyyy = safe.getFullYear();
  const mm = String(safe.getMonth() + 1).padStart(2, "0");
  const bucket = `${scope}-${yyyy}-${mm}`;

  const map = readSeq();
  const next = (map[bucket] ?? 0) + 1;
  map[bucket] = next;
  writeSeq(map);

  return `CSH-${scope}/${yyyy}/${mm}/${String(next).padStart(6, "0")}`;
}

/** True when the payment channel/method settles as physical cash. */
export function isCashPayment(value?: string): boolean {
  if (!value) return false;
  return value.trim().toLowerCase() === "cash";
}
