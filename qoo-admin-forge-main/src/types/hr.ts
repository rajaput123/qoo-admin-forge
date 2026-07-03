// HR Types

export interface Employee {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  status: 'active' | 'inactive' | 'terminated' | 'on_leave';
  joiningDate: string;
  [key: string]: any;
}

export interface Attendance {
  id: string;
  employeeId: string;
  date: string;
  clockIn?: string;
  clockOut?: string;
  status: 'present' | 'absent' | 'leave' | 'half-day' | 'half_day' | 'on_leave' | 'holiday' | 'late';
  [key: string]: any;
}

export interface DisciplinaryAction {
  id: string;
  employeeId: string;
  type: string;
  description: string;
  date: string;
  [key: string]: any;
}

export interface AttendancePolicy {
  id: string;
  name: string;
  description: string;
  [key: string]: any;
}

export interface AttendanceReport {
  id?: string;
  employeeId: string;
  period?: string;
  employeeName?: string;
  month?: string;
  totalDays?: number;
  presentDays?: number;
  absentDays?: number;
  leaveDays?: number;
  lateArrivals?: number;
  overtimeHours?: number;
  [key: string]: any;
}

export interface Shift {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  [key: string]: any;
}

export interface ShiftSchedule {
  id: string;
  employeeId: string;
  shiftId: string;
  date: string;
  [key: string]: any;
}

export interface OvertimeRule {
  id: string;
  name: string;
  [key: string]: any;
}

export interface Department {
  id: string;
  name: string;
  [key: string]: any;
}

export interface Designation {
  id: string;
  name: string;
  [key: string]: any;
}

export interface GradePay {
  id: string;
  name: string;
  [key: string]: any;
}

export interface LeaveType {
  id: string;
  name: string;
  [key: string]: any;
}

export interface Holiday {
  id: string;
  name: string;
  date: string;
  [key: string]: any;
}

export interface LeaveApplication {
  id: string;
  employeeId: string;
  leaveTypeId: string;
  startDate: string;
  endDate: string;
  status: string;
  [key: string]: any;
}

export interface LeavePolicy {
  id: string;
  name: string;
  [key: string]: any;
}

export interface Expense {
  id: string;
  employeeId: string;
  amount: number;
  date: string;
  [key: string]: any;
}

export interface ExpensePolicy {
  id: string;
  name: string;
  [key: string]: any;
}

export interface ExpenseAuditLog {
  id: string;
  expenseId: string;
  [key: string]: any;
}

export interface EmployeeDocument {
  id: string;
  employeeId: string;
  name: string;
  type: string;
  [key: string]: any;
}
