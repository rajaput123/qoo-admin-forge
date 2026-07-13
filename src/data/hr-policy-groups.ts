// Local dummy store for Policy Groups, Late-Login Engine, and Leave Policy Editor.
// Kept in-memory (module-level) so pages share edits within a session.

export interface LateTier {
  id: string;
  fromMin: number; // inclusive lower bound in minutes past shift start (after grace)
  toMin: number;   // inclusive upper bound
  penalty: 'none' | 'half_day' | 'loss_of_pay' | 'warning';
  label: string;
}

export interface LateLoginConfig {
  graceMinutes: number;
  strictForPriests: boolean;
  tiers: LateTier[];
  holidayWorked: {
    mode: 'comp_off' | 'double_pay' | 'both_choice';
    compOffMultiplier: number; // e.g., 1 = one day
    overtimeMultiplier: number; // e.g., 2 = double pay
  };
  autoMarkAbsentAfterMin: number; // treat as absent if late by more than X
}

export interface ApprovalStep {
  id: string;
  role: string; // e.g., "Reporting Manager", "HR", "Temple Trustee"
  required: boolean;
}

export interface FestivalBlackout {
  id: string;
  name: string;
  fromDate: string;
  toDate: string;
  appliesTo: 'all' | 'priests_only' | 'non_priests';
  reason: string;
}

export interface LeaveTypeQuota {
  typeId: string;
  typeName: string;
  annualQuota: number;
  carryForward: boolean;
  maxCarryForward: number;
  paid: boolean;
  encashable: boolean;
}

export interface LeavePolicyDoc {
  id: string;
  name: string;
  effectiveFrom: string;
  quotas: LeaveTypeQuota[];
  blackouts: FestivalBlackout[];
  approvalChain: ApprovalStep[];
  advanceNoticeDays: number;
  maxConsecutiveDays: number;
  minServiceMonths: number;
  status: 'draft' | 'active' | 'archived';
}

export interface PolicyGroup {
  id: string;
  name: string; // e.g., "Priest Grade", "Admin Staff"
  description: string;
  shiftId?: string;
  attendancePolicyId?: string;
  leavePolicyId?: string;
  templeRuleDocIds: string[]; // links to Temple Rules
  membersCount: number;
  status: 'active' | 'inactive';
}

export interface TempleRuleDoc {
  id: string;
  title: string;
  category: 'Dress Code' | 'Ritual Duty' | 'Conduct' | 'Safety' | 'Other';
  summary: string;
}

// -------- Seed data --------

export const templeRuleDocs: TempleRuleDoc[] = [
  { id: 'tr1', title: 'Priest Dress Code', category: 'Dress Code', summary: 'Traditional dhoti, no leather, tilak mandatory during rituals.' },
  { id: 'tr2', title: 'Sanctum Entry Rules', category: 'Ritual Duty', summary: 'Only initiated priests may enter garbhagriha; head covered.' },
  { id: 'tr3', title: 'Festival Duty Roster', category: 'Ritual Duty', summary: 'Mandatory duty on Ekadashi, Purnima, Amavasya, and major festivals.' },
  { id: 'tr4', title: 'Kitchen Hygiene (Prasad)', category: 'Safety', summary: 'Health cert. required, hairnets, no outside food, monthly checks.' },
  { id: 'tr5', title: 'Devotee Conduct', category: 'Conduct', summary: 'Courteous behavior, no accepting cash outside donation counter.' },
  { id: 'tr6', title: 'Security Protocol', category: 'Safety', summary: 'CCTV monitoring, hundi opening only in team of 3+.' },
];

export const shifts = [
  { id: 's1', name: 'Brahma Muhurta (04:00–12:00)' },
  { id: 's2', name: 'Morning (06:00–14:00)' },
  { id: 's3', name: 'General (09:00–18:00)' },
  { id: 's4', name: 'Evening (14:00–22:00)' },
];

export const attendancePoliciesRef = [
  { id: 'ap1', name: 'Standard 6-day (15 min grace)' },
  { id: 'ap2', name: 'Priest — Zero Tolerance' },
  { id: 'ap3', name: 'Flexi — Office Staff' },
];

export let lateLoginConfig: LateLoginConfig = {
  graceMinutes: 15,
  strictForPriests: true,
  autoMarkAbsentAfterMin: 240,
  tiers: [
    { id: 't1', fromMin: 1, toMin: 30, penalty: 'warning', label: 'Late — Warning' },
    { id: 't2', fromMin: 31, toMin: 120, penalty: 'half_day', label: 'Half Day' },
    { id: 't3', fromMin: 121, toMin: 240, penalty: 'loss_of_pay', label: 'Loss of Pay (½ day)' },
  ],
  holidayWorked: {
    mode: 'both_choice',
    compOffMultiplier: 1,
    overtimeMultiplier: 2,
  },
};

export function updateLateLoginConfig(next: LateLoginConfig) {
  lateLoginConfig = { ...next };
}

export let leavePolicies: LeavePolicyDoc[] = [
  {
    id: 'lp1',
    name: 'Priest Leave Policy FY 2025-26',
    effectiveFrom: '2025-04-01',
    status: 'active',
    advanceNoticeDays: 7,
    maxConsecutiveDays: 10,
    minServiceMonths: 3,
    quotas: [
      { typeId: 'lt1', typeName: 'Casual Leave', annualQuota: 8, carryForward: false, maxCarryForward: 0, paid: true, encashable: false },
      { typeId: 'lt2', typeName: 'Sick Leave', annualQuota: 10, carryForward: true, maxCarryForward: 5, paid: true, encashable: false },
      { typeId: 'lt3', typeName: 'Earned Leave', annualQuota: 15, carryForward: true, maxCarryForward: 30, paid: true, encashable: true },
    ],
    blackouts: [
      { id: 'b1', name: 'Diwali Week', fromDate: '2025-10-18', toDate: '2025-10-25', appliesTo: 'all', reason: 'Peak devotee footfall' },
      { id: 'b2', name: 'Maha Shivratri', fromDate: '2026-02-15', toDate: '2026-02-17', appliesTo: 'priests_only', reason: 'Ritual duty mandatory' },
      { id: 'b3', name: 'Brahmotsavam', fromDate: '2025-09-20', toDate: '2025-09-30', appliesTo: 'all', reason: 'Annual festival' },
    ],
    approvalChain: [
      { id: 'a1', role: 'Head Priest', required: true },
      { id: 'a2', role: 'HR Manager', required: true },
      { id: 'a3', role: 'Temple Trustee', required: false },
    ],
  },
  {
    id: 'lp2',
    name: 'Admin Staff Leave Policy',
    effectiveFrom: '2025-04-01',
    status: 'active',
    advanceNoticeDays: 3,
    maxConsecutiveDays: 15,
    minServiceMonths: 1,
    quotas: [
      { typeId: 'lt1', typeName: 'Casual Leave', annualQuota: 12, carryForward: false, maxCarryForward: 0, paid: true, encashable: false },
      { typeId: 'lt2', typeName: 'Sick Leave', annualQuota: 12, carryForward: true, maxCarryForward: 6, paid: true, encashable: false },
      { typeId: 'lt3', typeName: 'Earned Leave', annualQuota: 21, carryForward: true, maxCarryForward: 45, paid: true, encashable: true },
    ],
    blackouts: [
      { id: 'b1', name: 'Financial Year End', fromDate: '2026-03-25', toDate: '2026-03-31', appliesTo: 'non_priests', reason: 'Books closing' },
    ],
    approvalChain: [
      { id: 'a1', role: 'Reporting Manager', required: true },
      { id: 'a2', role: 'HR Manager', required: true },
    ],
  },
];

export function upsertLeavePolicy(p: LeavePolicyDoc) {
  const i = leavePolicies.findIndex(x => x.id === p.id);
  if (i >= 0) leavePolicies[i] = p;
  else leavePolicies = [...leavePolicies, p];
}

export function deleteLeavePolicy(id: string) {
  leavePolicies = leavePolicies.filter(p => p.id !== id);
}

export let policyGroups: PolicyGroup[] = [
  {
    id: 'pg1',
    name: 'Priest Grade',
    description: 'All initiated priests, archakas, and pujaris on ritual duty.',
    shiftId: 's1',
    attendancePolicyId: 'ap2',
    leavePolicyId: 'lp1',
    templeRuleDocIds: ['tr1', 'tr2', 'tr3'],
    membersCount: 12,
    status: 'active',
  },
  {
    id: 'pg2',
    name: 'Admin & Office Staff',
    description: 'Front desk, accountants, and back-office employees.',
    shiftId: 's3',
    attendancePolicyId: 'ap3',
    leavePolicyId: 'lp2',
    templeRuleDocIds: ['tr5'],
    membersCount: 6,
    status: 'active',
  },
  {
    id: 'pg3',
    name: 'Prasad & Kitchen Team',
    description: 'Cooks, servers, and kitchen assistants.',
    shiftId: 's2',
    attendancePolicyId: 'ap1',
    leavePolicyId: 'lp2',
    templeRuleDocIds: ['tr4', 'tr5'],
    membersCount: 8,
    status: 'active',
  },
  {
    id: 'pg4',
    name: 'Security',
    description: 'Guards and CCTV monitoring team on rotating shifts.',
    shiftId: 's4',
    attendancePolicyId: 'ap1',
    leavePolicyId: 'lp2',
    templeRuleDocIds: ['tr6', 'tr5'],
    membersCount: 10,
    status: 'active',
  },
];

export function upsertPolicyGroup(g: PolicyGroup) {
  const i = policyGroups.findIndex(x => x.id === g.id);
  if (i >= 0) policyGroups[i] = g;
  else policyGroups = [...policyGroups, g];
}

export function deletePolicyGroup(id: string) {
  policyGroups = policyGroups.filter(p => p.id !== id);
}

// -------- Late-login evaluator (used by simulator) --------
export function evaluateLateLogin(minutesLate: number, cfg: LateLoginConfig = lateLoginConfig) {
  const effective = Math.max(0, minutesLate - cfg.graceMinutes);
  if (effective <= 0) return { effective: 0, penalty: 'none' as const, label: 'On Time (within grace)' };
  if (minutesLate >= cfg.autoMarkAbsentAfterMin) {
    return { effective, penalty: 'loss_of_pay' as const, label: 'Marked Absent' };
  }
  const tier = cfg.tiers.find(t => effective >= t.fromMin && effective <= t.toMin);
  if (!tier) return { effective, penalty: 'warning' as const, label: 'Late' };
  return { effective, penalty: tier.penalty, label: tier.label };
}