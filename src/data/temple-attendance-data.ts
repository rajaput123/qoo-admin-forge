// Temple Attendance Module - Data & Types
import { format, subDays, addDays } from 'date-fns';

export type TempleRole = 'priest' | 'staff' | 'volunteer';
export type DutyType = 'ritual' | 'maintenance' | 'admin' | 'seva' | 'kitchen' | 'security';
export type TempleShift = 'morning_pooja' | 'evening_aarti' | 'full_day' | 'night_watch';
export type CheckStatus = 'on_time' | 'late' | 'missed';

export interface TemplePerson {
  id: string;
  name: string;
  role: TempleRole;
  department: string;
  designation: string;
  phone: string;
  shift: TempleShift;
  dutyType: DutyType;
  status: 'active' | 'inactive';
}

export interface TempleAttendanceRecord {
  id: string;
  personId: string;
  personName: string;
  role: TempleRole;
  department: string;
  date: string;
  status: 'present' | 'absent' | 'leave' | 'half_day' | 'late' | 'holiday';
  clockIn?: string;
  clockOut?: string;
  checkStatus?: CheckStatus;
  shift: TempleShift;
  dutyType: DutyType;
  remarks?: string;
  location?: string;
}

export interface ActivityLog {
  id: string;
  personId: string;
  personName: string;
  role: TempleRole;
  type: 'late_arrival' | 'absence' | 'missed_duty' | 'early_departure' | 'note';
  description: string;
  date: string;
  severity: 'low' | 'medium' | 'high';
  notes?: string;
  actionTaken?: string;
}

export const roleLabels: Record<TempleRole, string> = {
  priest: 'Priest (Pujari)',
  staff: 'Staff',
  volunteer: 'Volunteer (Sevak)',
};

export const shiftLabels: Record<TempleShift, string> = {
  morning_pooja: 'Morning Pooja (5:00 AM – 12:00 PM)',
  evening_aarti: 'Evening Aarti (4:00 PM – 9:00 PM)',
  full_day: 'Full Day (8:00 AM – 6:00 PM)',
  night_watch: 'Night Watch (9:00 PM – 5:00 AM)',
};

export const dutyTypeLabels: Record<DutyType, string> = {
  ritual: 'Ritual',
  maintenance: 'Maintenance',
  admin: 'Admin',
  seva: 'Seva',
  kitchen: 'Kitchen',
  security: 'Security',
};

export const templePersonnel: TemplePerson[] = [
  { id: 'tp-1', name: 'Pandit Ramesh Sharma', role: 'priest', department: 'Rituals', designation: 'Head Priest', phone: '+91 98765 43210', shift: 'morning_pooja', dutyType: 'ritual', status: 'active' },
  { id: 'tp-2', name: 'Pandit Suresh Mishra', role: 'priest', department: 'Rituals', designation: 'Assistant Priest', phone: '+91 98765 43211', shift: 'morning_pooja', dutyType: 'ritual', status: 'active' },
  { id: 'tp-3', name: 'Pandit Govind Das', role: 'priest', department: 'Rituals', designation: 'Evening Priest', phone: '+91 98765 43212', shift: 'evening_aarti', dutyType: 'ritual', status: 'active' },
  { id: 'tp-4', name: 'Lakshmi Devi', role: 'staff', department: 'Admin', designation: 'Office Manager', phone: '+91 98765 43213', shift: 'full_day', dutyType: 'admin', status: 'active' },
  { id: 'tp-5', name: 'Venkat Rao', role: 'staff', department: 'Security', designation: 'Security Head', phone: '+91 98765 43214', shift: 'full_day', dutyType: 'security', status: 'active' },
  { id: 'tp-6', name: 'Meena Singh', role: 'staff', department: 'Kitchen', designation: 'Kitchen Manager', phone: '+91 98765 43215', shift: 'morning_pooja', dutyType: 'kitchen', status: 'active' },
  { id: 'tp-7', name: 'Gopal Reddy', role: 'staff', department: 'Maintenance', designation: 'Maintenance Lead', phone: '+91 98765 43216', shift: 'full_day', dutyType: 'maintenance', status: 'active' },
  { id: 'tp-8', name: 'Anitha Kumari', role: 'staff', department: 'Operations', designation: 'Seva Counter Staff', phone: '+91 98765 43217', shift: 'full_day', dutyType: 'seva', status: 'active' },
  { id: 'tp-9', name: 'Ravi Kumar', role: 'volunteer', department: 'Seva', designation: 'Volunteer Coordinator', phone: '+91 98765 43218', shift: 'morning_pooja', dutyType: 'seva', status: 'active' },
  { id: 'tp-10', name: 'Priya Nair', role: 'volunteer', department: 'Seva', designation: 'Volunteer', phone: '+91 98765 43219', shift: 'evening_aarti', dutyType: 'seva', status: 'active' },
  { id: 'tp-11', name: 'Deepak Joshi', role: 'volunteer', department: 'Kitchen', designation: 'Kitchen Helper', phone: '+91 98765 43220', shift: 'morning_pooja', dutyType: 'kitchen', status: 'active' },
  { id: 'tp-12', name: 'Sanjay Gupta', role: 'staff', department: 'Security', designation: 'Night Security', phone: '+91 98765 43221', shift: 'night_watch', dutyType: 'security', status: 'active' },
];

// Generate seed attendance data for last 30 days
function generateSeedAttendance(): TempleAttendanceRecord[] {
  const records: TempleAttendanceRecord[] = [];
  const today = new Date();

  for (let i = 0; i < 30; i++) {
    const date = format(subDays(today, i), 'yyyy-MM-dd');
    templePersonnel.filter(p => p.status === 'active').forEach(person => {
      const rand = Math.random();
      let status: TempleAttendanceRecord['status'];
      let checkStatus: CheckStatus | undefined;
      let clockIn: string | undefined;
      let clockOut: string | undefined;
      let remarks: string | undefined;

      if (rand < 0.7) {
        status = 'present';
        checkStatus = 'on_time';
        clockIn = person.shift === 'morning_pooja' ? '04:55' :
                  person.shift === 'evening_aarti' ? '15:55' :
                  person.shift === 'full_day' ? '07:58' : '20:55';
        clockOut = person.shift === 'morning_pooja' ? '12:05' :
                   person.shift === 'evening_aarti' ? '21:05' :
                   person.shift === 'full_day' ? '18:02' : '05:10';
      } else if (rand < 0.85) {
        status = 'late';
        checkStatus = 'late';
        clockIn = person.shift === 'morning_pooja' ? '05:25' :
                  person.shift === 'evening_aarti' ? '16:20' :
                  person.shift === 'full_day' ? '08:35' : '21:30';
        clockOut = person.shift === 'morning_pooja' ? '12:10' :
                   person.shift === 'evening_aarti' ? '21:10' :
                   person.shift === 'full_day' ? '18:05' : '05:15';
        remarks = 'Late arrival';
      } else if (rand < 0.93) {
        status = 'absent';
        checkStatus = 'missed';
        remarks = i === 0 && person.role === 'priest' ? 'Not checked in for morning pooja' : undefined;
      } else {
        status = 'leave';
        remarks = 'Personal leave';
      }

      records.push({
        id: `att-${person.id}-${date}`,
        personId: person.id,
        personName: person.name,
        role: person.role,
        department: person.department,
        date,
        status,
        clockIn,
        clockOut,
        checkStatus,
        shift: person.shift,
        dutyType: person.dutyType,
        remarks,
      });
    });
  }
  return records;
}

function generateSeedActivityLogs(): ActivityLog[] {
  const logs: ActivityLog[] = [];
  const today = new Date();

  const sampleLogs: Omit<ActivityLog, 'id' | 'date'>[] = [
    { personId: 'tp-2', personName: 'Pandit Suresh Mishra', role: 'priest', type: 'late_arrival', description: 'Arrived 25 minutes late for morning pooja', severity: 'high', notes: 'Missed morning aarti duty' },
    { personId: 'tp-7', personName: 'Gopal Reddy', role: 'staff', type: 'absence', description: 'Absent without prior notice', severity: 'medium' },
    { personId: 'tp-10', personName: 'Priya Nair', role: 'volunteer', type: 'missed_duty', description: 'Did not report for evening seva duty', severity: 'medium', notes: 'Contacted - was unwell' },
    { personId: 'tp-1', personName: 'Pandit Ramesh Sharma', role: 'priest', type: 'note', description: 'On temple duty outside - visiting branch temple', severity: 'low', notes: 'Approved by admin' },
    { personId: 'tp-5', personName: 'Venkat Rao', role: 'staff', type: 'late_arrival', description: 'Late by 15 minutes', severity: 'low' },
    { personId: 'tp-11', personName: 'Deepak Joshi', role: 'volunteer', type: 'absence', description: 'No-show for kitchen duty', severity: 'high', notes: 'Third absence this month' },
    { personId: 'tp-3', personName: 'Pandit Govind Das', role: 'priest', type: 'missed_duty', description: 'Missed evening aarti preparation', severity: 'high', actionTaken: 'Warning issued' },
  ];

  sampleLogs.forEach((log, i) => {
    logs.push({
      ...log,
      id: `log-${i + 1}`,
      date: format(subDays(today, Math.floor(Math.random() * 14)), 'yyyy-MM-dd'),
    });
  });

  return logs.sort((a, b) => b.date.localeCompare(a.date));
}

export const seedAttendanceRecords = generateSeedAttendance();
export const seedActivityLogs = generateSeedActivityLogs();
