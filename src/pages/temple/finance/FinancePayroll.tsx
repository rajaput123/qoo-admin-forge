import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PlayCircle, Download, Search, Eye, Printer, Banknote } from "lucide-react";
import { toast } from "sonner";
import { NeftRtgsFormPanel } from "@/components/finance/NeftRtgsFormPanel";
import { emptyNeftRtgsForm, type NeftRtgsFormData } from "@/data/neftRtgsTemplateData";
import { buildPayrollNeftForm, mergeNeftForm } from "@/lib/neftRtgsUtils";

const formatCurrency = (val: number) => `₹${val.toLocaleString("en-IN")}`;

interface Employee {
  id: string;
  name: string;
  dept: string;
  basicPay: number;
  allowance: number;
  gross: number;
  deductions: number;
  netPay: number;
  bankName: string;
  status: string;
}

const mockEmployees: Employee[] = [
  { id: "EMP-001", name: "Ramesh Kumar", dept: "Priest", basicPay: 25000, allowance: 5000, gross: 30000, deductions: 2000, netPay: 28000, bankName: "SBI", status: "Paid" },
  { id: "EMP-002", name: "Lakshmi Devi", dept: "Administration", basicPay: 22000, allowance: 3000, gross: 25000, deductions: 1500, netPay: 23500, bankName: "HDFC", status: "Paid" },
  { id: "EMP-003", name: "Venkat Sharma", dept: "Security", basicPay: 18000, allowance: 2000, gross: 20000, deductions: 1000, netPay: 19000, bankName: "SBI", status: "Pending" },
  { id: "EMP-004", name: "Priya Patel", dept: "Accounts", basicPay: 28000, allowance: 4000, gross: 32000, deductions: 2500, netPay: 29500, bankName: "HDFC", status: "Pending" },
  { id: "EMP-005", name: "Suresh Reddy", dept: "Maintenance", basicPay: 16000, allowance: 1500, gross: 17500, deductions: 800, netPay: 16700, bankName: "", status: "Pending" },
];

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const FinancePayroll = () => {
  const [selectedMonth, setSelectedMonth] = useState(MONTHS[new Date().getMonth()]);
  const [selectedYear, setSelectedYear] = useState("2026");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [runAllOpen, setRunAllOpen] = useState(false);
  const [viewEmployee, setViewEmployee] = useState<Employee | null>(null);
  const [neftForm, setNeftForm] = useState<NeftRtgsFormData>(emptyNeftRtgsForm);
  const [bulkNeftForms, setBulkNeftForms] = useState<Record<string, NeftRtgsFormData>>({});

  const filtered = mockEmployees.filter((e) => {
    if (statusFilter !== "all" && e.status !== statusFilter) return false;
    if (search && !e.name.toLowerCase().includes(search.toLowerCase()) && !e.dept.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalPayroll = mockEmployees.reduce((s, e) => s + e.netPay, 0);
  const paidCount = mockEmployees.filter((e) => e.status === "Paid").length;
  const pendingCount = mockEmployees.filter((e) => e.status === "Pending").length;
  const pendingAmount = mockEmployees.filter((e) => e.status === "Pending").reduce((s, e) => s + e.netPay, 0);
  const pendingFiltered = filtered.filter((e) => e.status === "Pending");
  const runCount = selectedIds.size > 0 ? selectedIds.size : pendingCount;

  const toggleAll = () => {
    if (pendingFiltered.every((e) => selectedIds.has(e.id))) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(pendingFiltered.map((e) => e.id)));
    }
  };

  const handleRunAll = () => {
    toast.success(`Payroll disbursed for ${runCount} employee(s) — mock`);
    setRunAllOpen(false);
    setSelectedIds(new Set());
  };

  useEffect(() => {
    if (viewEmployee?.bankName) {
      setNeftForm(buildPayrollNeftForm(viewEmployee.name, viewEmployee.netPay, viewEmployee.dept, viewEmployee.bankName));
    }
  }, [viewEmployee]);

  const runPendingEmployees = useMemo(
    () => mockEmployees.filter((e) => e.status === "Pending" && (selectedIds.size === 0 || selectedIds.has(e.id))),
    [selectedIds]
  );
  const runBankEmployees = useMemo(
    () => runPendingEmployees.filter((e) => e.bankName),
    [runPendingEmployees]
  );
  const runCashEmployees = useMemo(
    () => runPendingEmployees.filter((e) => !e.bankName),
    [runPendingEmployees]
  );
  const runTotalAmount = runPendingEmployees.reduce((s, e) => s + e.netPay, 0);
  const runBankAmount = runBankEmployees.reduce((s, e) => s + e.netPay, 0);

  useEffect(() => {
    if (!runAllOpen) return;
    setBulkNeftForms(
      Object.fromEntries(
        runBankEmployees.map((emp) => [
          emp.id,
          buildPayrollNeftForm(emp.name, emp.netPay, emp.dept, emp.bankName),
        ])
      )
    );
  }, [runAllOpen, runBankEmployees]);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <Card>
        <CardContent className="p-5">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-xl font-bold">Payroll</h1>
              <p className="text-xs text-muted-foreground mt-0.5">Auto-synced from HR — Priest & Staff salaries</p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="text-xs h-9 w-[130px]"><SelectValue /></SelectTrigger>
                <SelectContent>{MONTHS.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
              </Select>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="text-xs h-9 w-[90px]"><SelectValue /></SelectTrigger>
                <SelectContent>{["2024", "2025", "2026"].map((y) => <SelectItem key={y} value={y}>{y}</SelectItem>)}</SelectContent>
              </Select>
              <Button size="sm" className="text-xs gap-1.5" disabled={pendingCount === 0} onClick={() => setRunAllOpen(true)}>
                <PlayCircle className="h-3.5 w-3.5" /> Run All ({pendingCount})
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: "Total Payroll", value: formatCurrency(totalPayroll), sub: `${mockEmployees.length} employees`, accent: "border-l-gray-300" },
          { label: "Paid", value: `${paidCount}/${mockEmployees.length}`, sub: "Disbursed", accent: "border-l-green-500", color: "text-green-700" },
          { label: "Pending", value: String(pendingCount), sub: "Awaiting payment", accent: "border-l-amber-500", color: "text-amber-700" },
          { label: "Pending Amount", value: formatCurrency(pendingAmount), sub: "To be disbursed", accent: "border-l-red-500", color: "text-red-700" },
          { label: "With Attendance", value: `0/${mockEmployees.length}`, sub: "Prorated salary", accent: "border-l-blue-500", color: "text-blue-700" },
        ].map((s) => (
          <Card key={s.label} className={`border-l-4 ${s.accent}`}>
            <CardContent className="p-4">
              <div className="text-xs text-muted-foreground font-medium mb-1.5">{s.label}</div>
              <div className={`text-2xl font-black leading-tight ${s.color || ""}`}>{s.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{s.sub}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="flex items-center gap-2 flex-wrap px-5 py-4 border-b">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input placeholder="Search employee..." value={search} onChange={(e) => setSearch(e.target.value)} className="text-xs h-9 pl-8" />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="text-xs h-9 w-[130px]"><SelectValue placeholder="All Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Paid">Paid</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" className="text-xs gap-1.5" onClick={() => toast.success("Payroll exported (mock CSV)")}>
              <Download className="h-3.5 w-3.5" /> Export
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-10">
                  <Checkbox
                    checked={pendingFiltered.length > 0 && pendingFiltered.every((e) => selectedIds.has(e.id))}
                    onCheckedChange={toggleAll}
                  />
                </TableHead>
                <TableHead className="text-xs">Employee</TableHead>
                <TableHead className="text-xs">Department</TableHead>
                <TableHead className="text-xs text-right">Basic</TableHead>
                <TableHead className="text-xs text-right">Allowance</TableHead>
                <TableHead className="text-xs text-right">Gross</TableHead>
                <TableHead className="text-xs text-right">Deductions</TableHead>
                <TableHead className="text-xs text-right">Net Pay</TableHead>
                <TableHead className="text-xs">Bank</TableHead>
                <TableHead className="text-xs text-center">Status</TableHead>
                <TableHead className="text-xs text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((e) => (
                <TableRow key={e.id}>
                  <TableCell>
                    {e.status === "Pending" && (
                      <Checkbox
                        checked={selectedIds.has(e.id)}
                        onCheckedChange={() => {
                          setSelectedIds((prev) => {
                            const n = new Set(prev);
                            n.has(e.id) ? n.delete(e.id) : n.add(e.id);
                            return n;
                          });
                        }}
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="text-xs font-medium">{e.name}</div>
                    <div className="text-[10px] text-muted-foreground">{e.id}</div>
                  </TableCell>
                  <TableCell><Badge variant="outline" className="text-[10px]">{e.dept}</Badge></TableCell>
                  <TableCell className="text-xs text-right">{formatCurrency(e.basicPay)}</TableCell>
                  <TableCell className="text-xs text-right">{formatCurrency(e.allowance)}</TableCell>
                  <TableCell className="text-xs text-right font-medium">{formatCurrency(e.gross)}</TableCell>
                  <TableCell className="text-xs text-right text-red-600">{formatCurrency(e.deductions)}</TableCell>
                  <TableCell className="text-xs text-right font-bold">{formatCurrency(e.netPay)}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{e.bankName || "Cash"}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className={e.status === "Paid" ? "bg-green-50 text-green-700 border-green-200" : "bg-amber-50 text-amber-700 border-amber-200"}>
                      {e.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setViewEmployee(e)}>
                      <Eye className="h-3.5 w-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Run All Confirm Modal */}
      <Dialog open={runAllOpen} onOpenChange={setRunAllOpen}>
        <DialogContent className={runBankEmployees.length > 0 ? "max-w-6xl max-h-[92vh] overflow-y-auto" : "max-w-lg"}>
          <DialogHeader>
            <DialogTitle>Run Payroll — {selectedMonth} {selectedYear}</DialogTitle>
            <DialogDescription>
              Disburse salary for {runCount} pending employee(s) · Total {formatCurrency(runTotalAmount)}
              {runBankEmployees.length > 0 && ` · ${runBankEmployees.length} NEFT/RTGS (${formatCurrency(runBankAmount)})`}
              {runCashEmployees.length > 0 && ` · ${runCashEmployees.length} cash`}
            </DialogDescription>
          </DialogHeader>

          {runPendingEmployees.length > 1 && (
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="text-xs">Employee</TableHead>
                    <TableHead className="text-xs">Bank</TableHead>
                    <TableHead className="text-xs text-right">Net Pay</TableHead>
                    <TableHead className="text-xs">Mode</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {runPendingEmployees.map((emp) => (
                    <TableRow key={emp.id}>
                      <TableCell className="text-xs font-medium">{emp.name}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{emp.bankName || "—"}</TableCell>
                      <TableCell className="text-xs text-right font-medium">{formatCurrency(emp.netPay)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[10px]">
                          {emp.bankName ? "NEFT/RTGS" : "Cash"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {runCashEmployees.length > 0 && (
            <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs text-amber-900">
              <Banknote className="h-4 w-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Cash disbursement ({runCashEmployees.length})</p>
                <p className="text-amber-800/90 mt-0.5">
                  {runCashEmployees.map((e) => e.name).join(", ")} — no bank on file; pay in cash separately.
                </p>
              </div>
            </div>
          )}

          {runBankEmployees.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2 print:hidden">
                <p className="text-sm font-semibold">
                  NEFT / RTGS remittance ({runBankEmployees.length} employee{runBankEmployees.length > 1 ? "s" : ""})
                </p>
                {runBankEmployees.length > 1 && (
                  <Button type="button" variant="outline" size="sm" className="text-xs" onClick={() => window.print()}>
                    <Printer className="h-3.5 w-3.5 mr-1.5" /> Print all forms
                  </Button>
                )}
              </div>

              {runBankEmployees.length === 1 ? (
                bulkNeftForms[runBankEmployees[0].id] && (
                  <NeftRtgsFormPanel
                    title={`NEFT / RTGS — ${runBankEmployees[0].name} (${formatCurrency(runBankEmployees[0].netPay)})`}
                    data={bulkNeftForms[runBankEmployees[0].id]}
                    onChange={(patch) =>
                      setBulkNeftForms((prev) => ({
                        ...prev,
                        [runBankEmployees[0].id]: mergeNeftForm(prev[runBankEmployees[0].id], patch),
                      }))
                    }
                  />
                )
              ) : (
                <Accordion type="multiple" className="max-h-[50vh] overflow-y-auto rounded-lg border px-3">
                  {runBankEmployees.map((emp) => (
                    <AccordionItem key={emp.id} value={emp.id}>
                      <AccordionTrigger className="py-3 text-xs hover:no-underline">
                        <span className="flex flex-1 items-center justify-between gap-3 pr-2 text-left">
                          <span className="font-medium">{emp.name}</span>
                          <span className="text-muted-foreground shrink-0">
                            {emp.bankName} · {formatCurrency(emp.netPay)}
                          </span>
                        </span>
                      </AccordionTrigger>
                      <AccordionContent>
                        {bulkNeftForms[emp.id] && (
                          <NeftRtgsFormPanel
                            title={`NEFT / RTGS — ${emp.name}`}
                            data={bulkNeftForms[emp.id]}
                            onChange={(patch) =>
                              setBulkNeftForms((prev) => ({
                                ...prev,
                                [emp.id]: mergeNeftForm(prev[emp.id], patch),
                              }))
                            }
                          />
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setRunAllOpen(false)}>Cancel</Button>
            <Button onClick={handleRunAll}>Confirm Disbursement</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!viewEmployee} onOpenChange={(open) => !open && setViewEmployee(null)}>
        <DialogContent className={viewEmployee?.bankName ? "max-w-6xl max-h-[92vh] overflow-y-auto" : "max-w-md"}>
          <DialogHeader>
            <DialogTitle>{viewEmployee?.name}</DialogTitle>
            <DialogDescription>{viewEmployee?.id} · {viewEmployee?.dept}</DialogDescription>
          </DialogHeader>
          {viewEmployee && (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Basic Pay</span><span>{formatCurrency(viewEmployee.basicPay)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Allowance</span><span>{formatCurrency(viewEmployee.allowance)}</span></div>
              <div className="flex justify-between font-medium"><span>Gross</span><span>{formatCurrency(viewEmployee.gross)}</span></div>
              <div className="flex justify-between text-red-600"><span>Deductions</span><span>-{formatCurrency(viewEmployee.deductions)}</span></div>
              <div className="flex justify-between font-bold pt-2 border-t"><span>Net Pay</span><span>{formatCurrency(viewEmployee.netPay)}</span></div>
              <div className="flex justify-between pt-1"><span className="text-muted-foreground">Bank</span><span>{viewEmployee.bankName || "Cash"}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Status</span>
                <Badge variant="outline" className={viewEmployee.status === "Paid" ? "bg-green-50 text-green-700 border-green-200" : "bg-amber-50 text-amber-700 border-amber-200"}>{viewEmployee.status}</Badge>
              </div>
            </div>
          )}
          {viewEmployee?.bankName && viewEmployee.status === "Pending" && (
            <NeftRtgsFormPanel
              data={neftForm}
              onChange={(patch) => setNeftForm((prev) => mergeNeftForm(prev, patch))}
              title={`NEFT / RTGS — ${viewEmployee.name}`}
            />
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewEmployee(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default FinancePayroll;
