/**
 * Payroll Calculator — Salary calculation with real attendance integration
 * 
 * FLOW:
 * 1. Fetch employee data from HR
 * 2. Check attendance for selected month (actual or fallback to full month)
 * 3. Calculate: Basic → Allowances → Gross → Prorate by attendance → Deductions → Net
 * 
 * WITH ATTENDANCE: Net = (Gross / totalDays) × daysPresent - Deductions
 * WITHOUT ATTENDANCE: Net = Gross - Deductions (full month assumed)
 */

import type { SalaryBreakdown } from "./types";
import type { Employee } from "@/types/hr";
import { seedAttendanceRecords, templePersonnel } from "@/data/temple-attendance-data";
import { employees as hrEmployees } from "@/data/hr-dummy-data";
import { getEmployees as getOnboardedEmployees } from "@/lib/hr-employee-store";
import { format, getDaysInMonth } from "date-fns";

// ─── Constants ───
const HRA_RATE = 0.40;    // 40% of basic
const DA_RATE = 0.20;     // 20% of basic
const TA_FIXED = 1500;    // Fixed travel allowance
const PF_RATE = 0.12;     // 12% of basic
const ESI_RATE = 0.0075;  // 0.75% of gross (only if gross < 21000)
const ESI_THRESHOLD = 21000;
const PT_FIXED = 200;     // Professional tax

// ─── Salary Breakdown Calculator ───
export function calculateSalaryBreakdown(basicSalary: number): SalaryBreakdown {
  const hra = Math.round(basicSalary * HRA_RATE);
  const da = Math.round(basicSalary * DA_RATE);
  const ta = TA_FIXED;
  const totalAllowances = hra + da + ta;
  const grossPay = basicSalary + totalAllowances;

  const pf = Math.round(basicSalary * PF_RATE);
  const esi = grossPay < ESI_THRESHOLD ? Math.round(grossPay * ESI_RATE) : 0;
  const pt = PT_FIXED;
  const totalDeductions = pf + esi + pt;

  return { hra, da, ta, totalAllowances, grossPay, pf, esi, pt, totalDeductions };
}

// ─── Attendance Fetcher ───
export interface AttendanceResult {
  daysPresent: number;
  totalDays: number;
  mode: "actual" | "full_month";
}

/**
 * Get attendance for an employee in a given month/year.
 * Maps HR employee IDs to temple attendance personnel IDs.
 * Returns full_month mode if no attendance data found.
 */
export function getAttendanceForPayroll(
  employeeId: string,
  employeeName: string,
  monthIndex: number, // 0-based
  year: number
): AttendanceResult {
  const totalDays = getDaysInMonth(new Date(year, monthIndex));
  const monthStr = `${year}-${String(monthIndex + 1).padStart(2, "0")}`;

  // Try to find matching temple personnel by name
  const person = templePersonnel.find(
    p => p.name.toLowerCase().includes(employeeName.toLowerCase().split(" ")[0]) ||
         employeeName.toLowerCase().includes(p.name.toLowerCase().split(" ")[0])
  );

  if (!person) {
    // No attendance data — full month mode
    return { daysPresent: totalDays, totalDays, mode: "full_month" };
  }

  // Filter attendance records for this person and month
  const records = seedAttendanceRecords.filter(
    r => r.personId === person.id && r.date.startsWith(monthStr)
  );

  if (records.length === 0) {
    return { daysPresent: totalDays, totalDays, mode: "full_month" };
  }

  // Count present + late as working days
  const daysPresent = records.filter(
    r => r.status === "present" || r.status === "late" || r.status === "half_day"
  ).length;

  return { daysPresent, totalDays, mode: "actual" };
}

// ─── Net Pay Calculator ───
export function calculateNetPay(
  basicSalary: number,
  attendance: AttendanceResult
): { salary: SalaryBreakdown; netPay: number; deductions: number } {
  const salary = calculateSalaryBreakdown(basicSalary);

  if (attendance.mode === "full_month") {
    // No attendance data — pay full gross minus deductions
    const netPay = salary.grossPay - salary.totalDeductions;
    return { salary, netPay, deductions: salary.totalDeductions };
  }

  // Prorate gross based on attendance
  const proratedGross = Math.round(
    (salary.grossPay / attendance.totalDays) * attendance.daysPresent
  );
  
  // Deductions are calculated on full amounts (PF/ESI are statutory)
  const netPay = proratedGross - salary.totalDeductions;
  return { salary, netPay: Math.max(0, netPay), deductions: salary.totalDeductions };
}

// ─── Get All Eligible Employees ───
export function getEligibleEmployees(): Employee[] {
  const onboarded = getOnboardedEmployees();
  const allEmployees = [...hrEmployees, ...onboarded];
  return allEmployees.filter(e => e.status === "active" || e.status === "on_leave");
}

// ─── Month helpers ───
export const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export function getMonthIndex(monthName: string): number {
  return MONTH_NAMES.findIndex(m => m === monthName);
}
