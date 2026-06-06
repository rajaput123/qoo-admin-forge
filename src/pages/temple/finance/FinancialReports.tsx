import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Download, Printer } from "lucide-react";
import { toast } from "sonner";

const formatCurrency = (val: number) => val.toLocaleString("en-IN");

const mockIncomeExpenditure = {
  income: {
    total: 318032,
    lines: [
      { label: "Hundi Collections", amount: 10123 },
      { label: "Online / UPI Donations", amount: 300001 },
      { label: "Seva & Bookings", amount: 4120 },
      { label: "Other Income (vouchers)", amount: 3788 },
    ],
  },
  expenditure: {
    total: 301415,
    lines: [
      { label: "Payroll & Salaries", amount: 116700 },
      { label: "Pooja Materials", amount: 45200 },
      { label: "Utilities & Maintenance", amount: 38300 },
      { label: "Annadanam & Catering", amount: 45000 },
      { label: "Admin & Misc", amount: 56215 },
    ],
  },
  net_surplus: 16617,
};

const mockReceiptsPayments = {
  opening: { cash_in_hand: 245000, bank_accounts: [{ name: "SBI Current", bank_name: "SBI", amount: 8800000 }], total_opening_cash_bank: 9045000 },
  receipts_during_period: {
    lines: [
      { label: "Donations & Hundi", amount: 185000 },
      { label: "Seva & Bookings", amount: 42000 },
      { label: "Online / UPI Receipts", amount: 342500 },
    ],
  },
  payments_during_period: {
    lines: [
      { label: "Vendor Payments", amount: 87500 },
      { label: "Payroll & Salaries", amount: 185000 },
      { label: "Utilities & Maintenance", amount: 28300 },
    ],
  },
  closing: { cash_in_hand: 298700, bank_accounts: [{ name: "SBI Current", bank_name: "SBI", amount: 8854200 }], total_closing_cash_bank: 9152900 },
  totals: { receipts_side: 9332500, payments_side: 300800, net_movement: 9031700 },
};

const SectionHeader = ({ children }: { children: React.ReactNode }) => (
  <div className="text-xs font-semibold px-3 py-2 bg-muted border-l-4 border-primary rounded-r-lg mb-2">{children}</div>
);

const FinancialReports = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const { income, expenditure, net_surplus } = mockIncomeExpenditure;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Financial Reports</h1>
          <p className="text-sm text-muted-foreground">Income & Expenditure and Receipts & Payments</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={() => window.print()}>
            <Printer className="h-3.5 w-3.5" /> Print
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={() => toast.success("Report exported (mock PDF)")}>
            <Download className="h-3.5 w-3.5" /> Export PDF
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-end gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Start Date</Label>
              <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="text-xs h-9 w-[160px]" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">End Date</Label>
              <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="text-xs h-9 w-[160px]" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="income">
        <TabsList>
          <TabsTrigger value="income" className="text-xs">Income & Expenditure</TabsTrigger>
          <TabsTrigger value="receipts" className="text-xs">Receipts & Payments</TabsTrigger>
        </TabsList>

        <TabsContent value="income" className="mt-4">
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <SectionHeader>Expenditure</SectionHeader>
                  <div className="space-y-1 mb-6">
                    {expenditure.lines.map((row) => (
                      <div key={row.label} className="flex justify-between py-2 text-xs px-4 text-muted-foreground border-b last:border-0">
                        <span>{row.label}</span>
                        <span className="font-mono">₹{formatCurrency(row.amount)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between py-3 px-4 font-bold bg-muted border-t text-xs mb-1">
                    <span>Total Expenditure</span>
                    <span className="font-mono">₹{formatCurrency(expenditure.total)}</span>
                  </div>
                  <div className={`flex justify-between py-3 px-4 font-bold border-y text-xs mb-8 ${net_surplus >= 0 ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"}`}>
                    <span>{net_surplus >= 0 ? "Surplus" : "Deficit"}</span>
                    <span className="font-mono">₹{formatCurrency(Math.abs(net_surplus))}</span>
                  </div>
                </div>

                <div>
                  <SectionHeader>Income</SectionHeader>
                  <div className="space-y-1 mb-6">
                    {income.lines.map((row) => (
                      <div key={row.label} className="flex justify-between py-2 text-xs px-4 text-muted-foreground border-b last:border-0">
                        <span>{row.label}</span>
                        <span className="font-mono">₹{formatCurrency(row.amount)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between py-3 px-4 font-bold bg-muted border-t text-xs">
                    <span>Total Income</span>
                    <span className="font-mono">₹{formatCurrency(income.total)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="receipts" className="mt-4">
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <SectionHeader>Receipts</SectionHeader>
                  <div className="text-xs font-bold mb-1 px-2">Opening Balance</div>
                  <div className="divide-y mb-6">
                    <div className="flex justify-between py-2 text-xs px-4 text-muted-foreground">
                      <span>Cash in Hand</span>
                      <span className="font-mono">₹{formatCurrency(mockReceiptsPayments.opening.cash_in_hand)}</span>
                    </div>
                    {mockReceiptsPayments.opening.bank_accounts.map((b, i) => (
                      <div key={i} className="flex justify-between py-2 text-xs px-4 text-muted-foreground">
                        <span>{b.name} ({b.bank_name})</span>
                        <span className="font-mono">₹{formatCurrency(b.amount)}</span>
                      </div>
                    ))}
                    <div className="flex justify-between py-2.5 text-xs px-4 font-bold bg-muted">
                      <span>Total Opening</span>
                      <span className="font-mono">₹{formatCurrency(mockReceiptsPayments.opening.total_opening_cash_bank)}</span>
                    </div>
                  </div>
                  <div className="text-xs font-bold mb-1 px-2">During the Period</div>
                  {mockReceiptsPayments.receipts_during_period.lines.map((row) => (
                    <div key={row.label} className="flex justify-between py-2 text-xs px-4 text-muted-foreground border-b">
                      <span>{row.label}</span>
                      <span className="font-mono">₹{formatCurrency(row.amount)}</span>
                    </div>
                  ))}
                </div>

                <div>
                  <SectionHeader>Payments</SectionHeader>
                  <div className="text-xs font-bold mb-1 px-2">During the Period</div>
                  {mockReceiptsPayments.payments_during_period.lines.map((row) => (
                    <div key={row.label} className="flex justify-between py-2 text-xs px-4 text-muted-foreground border-b">
                      <span>{row.label}</span>
                      <span className="font-mono">₹{formatCurrency(row.amount)}</span>
                    </div>
                  ))}
                  <div className="mt-8">
                    <div className="text-xs font-bold mb-1 px-2">Closing Balance</div>
                    <div className="flex justify-between py-2 text-xs px-4 text-muted-foreground">
                      <span>Cash in Hand</span>
                      <span className="font-mono">₹{formatCurrency(mockReceiptsPayments.closing.cash_in_hand)}</span>
                    </div>
                    {mockReceiptsPayments.closing.bank_accounts.map((b, i) => (
                      <div key={i} className="flex justify-between py-2 text-xs px-4 text-muted-foreground">
                        <span>{b.name}</span>
                        <span className="font-mono">₹{formatCurrency(b.amount)}</span>
                      </div>
                    ))}
                    <div className="flex justify-between py-2.5 text-xs px-4 font-bold bg-muted mt-2">
                      <span>Total Closing</span>
                      <span className="font-mono">₹{formatCurrency(mockReceiptsPayments.closing.total_closing_cash_bank)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default FinancialReports;
