import type { PayrollBulkRemittanceData } from "@/data/payrollBulkRemittanceData";
import { payrollBulkTotal } from "@/data/payrollBulkRemittanceData";

function csvCell(value: string | number): string {
  const s = String(value);
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export function exportPayrollBulkToExcel(data: PayrollBulkRemittanceData, filename?: string) {
  const total = payrollBulkTotal(data);
  const rows = [
    ["Payroll Bulk NEFT/RTGS Remittance"],
    [],
    ["Temple / Remitter", data.remitterName],
    ["Temple Debit Account No.", data.debitAccountNo],
    ["Bank", data.bankName],
    ["Branch", data.branchName],
    ["Date", data.date],
    ["Salary Month", `${data.month} ${data.year}`],
    [],
    ["S.No", "Employee No", "Employee Name", "Account Number", "IFSC Code", "Amount (₹)"],
    ...data.lines.map((line, i) => [
      i + 1,
      line.employeeNo,
      line.employeeName,
      line.accountNo,
      line.ifscCode,
      line.amount,
    ]),
    [],
    ["", "", "", "", "Total", total],
  ];

  const csv = "\uFEFF" + rows.map((row) => row.map(csvCell).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download =
    filename ?? `payroll_bulk_${data.month}_${data.year}_${data.date}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
