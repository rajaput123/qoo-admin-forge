// HR Employee Store - Local storage based employee management
import type { Employee } from '@/types/hr';
export type { Employee } from '@/types/hr';

const STORAGE_KEY = 'hr_employees';

export function getEmployees(): Employee[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function setEmployees(employees: Employee[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
  } catch (error) {
    console.error('Failed to save employees:', error);
  }
}

export function addEmployee(employee: Employee): void {
  const employees = getEmployees();
  employees.push(employee);
  setEmployees(employees);
}

export function updateEmployee(id: string, updates: Partial<Employee>): void {
  const employees = getEmployees();
  const index = employees.findIndex(e => e.id === id);
  if (index !== -1) {
    employees[index] = { ...employees[index], ...updates };
    setEmployees(employees);
  }
}

export function deleteEmployee(id: string): void {
  const employees = getEmployees();
  setEmployees(employees.filter(e => e.id !== id));
}
