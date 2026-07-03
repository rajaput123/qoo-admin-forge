import { useSyncExternalStore } from "react";

/**
 * Seva Booking Store
 * Manages seva bookings with payment info for finance integration
 */

export interface SevaBooking {
  id: string;
  sevaName: string;
  sevaCategory: string;
  devoteeName: string;
  devoteePhone: string;
  date: string; // ISO date
  time: string;
  amount: number;
  paymentMethod: "Cash" | "UPI" | "Bank" | "Online";
  paymentMode: string; // GPay, Cash, NEFT, etc.
  referenceNo: string;
  status: "Confirmed" | "Completed" | "Cancelled";
  counterId?: string;
  sourceModule: "Counter" | "Online" | "Booking";
  createdAt: string;
}

const LS_KEY = "qoo.sevas.bookings.v1";

let cache: SevaBooking[] | null = null;
const listeners = new Set<() => void>();

function notify() { listeners.forEach(l => l()); }

function persist(data: SevaBooking[]) {
  cache = data;
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(data));
  } catch {}
  notify();
}

function seedBookings(): SevaBooking[] {
  const createdAt = new Date().toISOString();
  return [
    { id: "SVA-2026-001", sevaName: "Suprabhatam", sevaCategory: "Daily Sevas", devoteeName: "Lakshmi Devi", devoteePhone: "+91 98765 43210", date: "2026-03-28", time: "05:00 AM", amount: 5000, paymentMethod: "Cash", paymentMode: "Cash", referenceNo: "", status: "Completed", counterId: "CTR-001", sourceModule: "Counter", createdAt },
    { id: "SVA-2026-002", sevaName: "Abhishekam", sevaCategory: "Special Sevas", devoteeName: "Ramesh Kumar", devoteePhone: "+91 87654 32109", date: "2026-03-28", time: "06:30 AM", amount: 10000, paymentMethod: "UPI", paymentMode: "GPay", referenceNo: "UPI-SVA-78901", status: "Completed", counterId: "CTR-002", sourceModule: "Counter", createdAt },
    { id: "SVA-2026-003", sevaName: "Kalyanotsavam", sevaCategory: "Special Sevas", devoteeName: "Venkat Reddy", devoteePhone: "+91 76543 21098", date: "2026-03-27", time: "09:00 AM", amount: 25000, paymentMethod: "Bank", paymentMode: "NEFT", referenceNo: "NEFT-SVA-456", status: "Completed", sourceModule: "Online", createdAt },
    { id: "SVA-2026-004", sevaName: "Sahasranama Archana", sevaCategory: "Daily Sevas", devoteeName: "Padma Iyer", devoteePhone: "+91 65432 10987", date: "2026-03-29", time: "07:00 AM", amount: 3000, paymentMethod: "Cash", paymentMode: "Cash", referenceNo: "", status: "Confirmed", counterId: "CTR-001", sourceModule: "Counter", createdAt },
    { id: "SVA-2026-005", sevaName: "VIP Darshan", sevaCategory: "VIP Darshan", devoteeName: "Suresh Gupta", devoteePhone: "+91 54321 09876", date: "2026-03-26", time: "10:00 AM", amount: 5000, paymentMethod: "Online", paymentMode: "Razorpay", referenceNo: "RZP-SVA-123", status: "Completed", sourceModule: "Online", createdAt },
    { id: "SVA-2026-006", sevaName: "Ganapathi Homam", sevaCategory: "Festival Sevas", devoteeName: "Meena Nair", devoteePhone: "+91 43210 98765", date: "2026-03-25", time: "08:00 AM", amount: 15000, paymentMethod: "UPI", paymentMode: "PhonePe", referenceNo: "UPI-SVA-34567", status: "Completed", counterId: "CTR-002", sourceModule: "Counter", createdAt },
    { id: "SVA-2026-007", sevaName: "Annaprasana", sevaCategory: "Special Sevas", devoteeName: "Karthik Reddy", devoteePhone: "+91 32109 87654", date: "2026-03-24", time: "11:00 AM", amount: 8000, paymentMethod: "Cash", paymentMode: "Cash", referenceNo: "", status: "Completed", sourceModule: "Booking", createdAt },
    { id: "SVA-2026-008", sevaName: "Prasadam Distribution", sevaCategory: "Prasadam", devoteeName: "Anonymous", devoteePhone: "-", date: "2026-03-23", time: "12:00 PM", amount: 2000, paymentMethod: "Cash", paymentMode: "Cash", referenceNo: "", status: "Completed", counterId: "CTR-001", sourceModule: "Counter", createdAt },
  ];
}

export function getSevaBookings(): SevaBooking[] {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      cache = JSON.parse(raw) as SevaBooking[];
      return cache;
    }
  } catch {}
  const seed = seedBookings();
  persist(seed);
  return seed;
}

export function subscribeSevaStore(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export const sevaSelectors = {
  getBookings: () => getSevaBookings(),
  getCompletedBookings: () => getSevaBookings().filter(b => b.status === "Completed"),
};

export function useSevaBookings() {
  return useSyncExternalStore(subscribeSevaStore, getSevaBookings, getSevaBookings);
}

export function recordSevaBookings(bookingsInput: Omit<SevaBooking, "id" | "createdAt">[]) {
  const current = getSevaBookings();
  const newBookings = bookingsInput.map((input, index) => {
    const nextSeq = current.length + index + 1;
    const id = `SVA-2026-${String(nextSeq).padStart(3, "0")}`;
    return {
      ...input,
      id,
      createdAt: new Date().toISOString()
    } as SevaBooking;
  });
  persist([...newBookings, ...current]);
  return newBookings;
}

