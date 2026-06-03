/**
 * Temple master details used across all 80G compliance documents.
 * Single source of truth for receipts, Form 10BD CSV and Form 10BE certificates.
 */
export const TEMPLE_CONFIG = {
  name: "Shri Venkateswara Devasthanam",
  address: "Near Bypass Road, Karwar – 581301, Karnataka",
  pan: "AAATS1234A",
  registration80G: "AAATS1234A/80G/2023-24",
  validityFrom: "01-Apr-2023",
  validityTo: "31-Mar-2028",
  signatory: "Sri T. Ramachandra Bhat, Executive Officer",
  phone: "+91 8382 226 100",
  email: "office@svdevasthanam.org",
} as const;

export type TempleConfig = typeof TEMPLE_CONFIG;