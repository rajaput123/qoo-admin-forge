/**
 * Counter ↔ Employee (Math staff) mapping master.
 *
 * Every counter transaction (Booking/Seva + Donation) must capture WHICH staff
 * member operated WHICH counter, so transactions are traceable to a person.
 */

export interface CounterMaster {
  counterId: string;
  name: string;
  type: "Seva" | "Donation" | "Prasad" | "General";
  location: string;
  status: "Active" | "Inactive";
}

export interface CounterStaff {
  employeeId: string;
  name: string;
  designation: string;
  /** Counters this staff member is authorised to operate */
  counterIds: string[];
  status: "Active" | "Inactive";
}

export const COUNTERS: CounterMaster[] = [
  { counterId: "CTR-001", name: "Main Seva Counter", type: "Seva", location: "Darshan Hall Entrance", status: "Active" },
  { counterId: "CTR-002", name: "Donation Counter", type: "Donation", location: "Temple Office", status: "Active" },
  { counterId: "CTR-003", name: "Prasad Counter", type: "Prasad", location: "Annadanam Hall", status: "Active" },
  { counterId: "CTR-004", name: "VIP / Special Counter", type: "General", location: "North Gate", status: "Active" },
];

export const COUNTER_STAFF: CounterStaff[] = [
  { employeeId: "EMP-1001", name: "Ravi Shankar Joshi", designation: "Counter Executive", counterIds: ["CTR-001", "CTR-004"], status: "Active" },
  { employeeId: "EMP-1002", name: "Sunita Kulkarni", designation: "Donation Clerk", counterIds: ["CTR-002"], status: "Active" },
  { employeeId: "EMP-1003", name: "Mahesh Patil", designation: "Prasad Counter Staff", counterIds: ["CTR-003"], status: "Active" },
  { employeeId: "EMP-1004", name: "Anil Deshpande", designation: "Senior Accountant", counterIds: ["CTR-001", "CTR-002", "CTR-003", "CTR-004"], status: "Active" },
];

const SESSION_KEY = "qoo.counter.session.v1";

export interface CounterSession {
  counterId: string;
  counterName: string;
  employeeId: string;
  employeeName: string;
}

export function getCounterName(counterId?: string): string {
  return COUNTERS.find(c => c.counterId === counterId)?.name || counterId || "—";
}

export function getStaffName(employeeId?: string): string {
  return COUNTER_STAFF.find(s => s.employeeId === employeeId)?.name || employeeId || "—";
}

export function getStaffForCounter(counterId: string): CounterStaff[] {
  return COUNTER_STAFF.filter(s => s.status === "Active" && s.counterIds.includes(counterId));
}

/** The counter/staff pairing currently in use — defaults to the first active pairing. */
export function getCounterSession(): CounterSession {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (raw) return JSON.parse(raw) as CounterSession;
  } catch { /* ignore */ }
  const counter = COUNTERS[0];
  const staff = getStaffForCounter(counter.counterId)[0];
  return {
    counterId: counter.counterId,
    counterName: counter.name,
    employeeId: staff.employeeId,
    employeeName: staff.name,
  };
}

export function setCounterSession(session: CounterSession) {
  try { localStorage.setItem(SESSION_KEY, JSON.stringify(session)); } catch { /* ignore */ }
}

export function buildSession(counterId: string, employeeId: string): CounterSession {
  return {
    counterId,
    counterName: getCounterName(counterId),
    employeeId,
    employeeName: getStaffName(employeeId),
  };
}
