import { defaultNeftRtgsTemplate } from "@/data/neftRtgsTemplateData";

export interface PayrollBulkLine {
  employeeNo: string;
  employeeName: string;
  accountNo: string;
  ifscCode: string;
  amount: number;
}

export interface PayrollBulkRemittanceData {
  date: string;
  month: string;
  year: string;
  debitAccountNo: string;
  bankName: string;
  branchName: string;
  remitterName: string;
  remitterAddress: string;
  lines: PayrollBulkLine[];
}

export function buildPayrollBulkRemittance(input: {
  month: string;
  year: string;
  employees: Array<{
    id: string;
    name: string;
    accountNo: string;
    ifscCode: string;
    netPay: number;
  }>;
}): PayrollBulkRemittanceData {
  return {
    date: new Date().toISOString().slice(0, 10),
    month: input.month,
    year: input.year,
    debitAccountNo: defaultNeftRtgsTemplate.debitAccountNo,
    bankName: defaultNeftRtgsTemplate.bankName,
    branchName: defaultNeftRtgsTemplate.branchName,
    remitterName: defaultNeftRtgsTemplate.remitterName,
    remitterAddress: defaultNeftRtgsTemplate.remitterAddress,
    lines: input.employees.map((e) => ({
      employeeNo: e.id,
      employeeName: e.name,
      accountNo: e.accountNo,
      ifscCode: e.ifscCode,
      amount: e.netPay,
    })),
  };
}

export function payrollBulkTotal(data: PayrollBulkRemittanceData): number {
  return data.lines.reduce((sum, line) => sum + line.amount, 0);
}
