import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ArrowUpRight, ArrowDownLeft, Wallet, Building2, CreditCard, Landmark, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";

const formatCurrency = (val: number) => `₹${Math.abs(val).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

const mockFlow = {
  opening: { cash_in_hand: 245000, bank_total: 8800000, upi_wallet: 125000 },
  inflows: [
    { label: "Donations & Hundi", amount: 185000 },
    { label: "Seva & Bookings", amount: 42000 },
    { label: "Online / UPI Receipts", amount: 342500 },
  ],
  outflows: [
    { label: "Vendor Payments", amount: 87500 },
    { label: "Payroll & Salaries", amount: 185000 },
    { label: "Utilities & Maintenance", amount: 28300 },
  ],
  closing: { cash_in_hand: 298700, bank_total: 8854200, upi_wallet: 158000 },
};

const CashFundFlowPage = () => {
  const [reportDate, setReportDate] = useState(new Date().toISOString().split("T")[0]);
  const [signOffOpen, setSignOffOpen] = useState(false);
  const [overrideOpen, setOverrideOpen] = useState(false);
  const [overrideValues, setOverrideValues] = useState({
    cash: String(mockFlow.opening.cash_in_hand),
    bank: String(mockFlow.opening.bank_total),
    upi: String(mockFlow.opening.upi_wallet),
    reason: "",
  });
  const totalIn = mockFlow.inflows.reduce((s, i) => s + i.amount, 0);
  const totalOut = mockFlow.outflows.reduce((s, i) => s + i.amount, 0);

  const handleSignOff = () => {
    toast.success(`Day signed off for ${reportDate} (mock)`);
    setSignOffOpen(false);
  };

  const handleOverride = () => {
    if (!overrideValues.reason.trim()) {
      toast.error("Please provide a reason for the override");
      return;
    }
    toast.success("Opening balance override saved (mock)");
    setOverrideOpen(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <div>
        <h1 className="text-lg font-semibold">Cash & Fund Flow Statement</h1>
        <p className="text-xs text-muted-foreground mt-0.5">Daily cash position and fund movement</p>
      </div>
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-2.5 flex items-center gap-3">
            <AlertCircle className="h-4 w-4 text-amber-800 shrink-0" />
            <span className="text-amber-800 text-xs">
              Showing data for <strong>{reportDate}</strong>. Opening balance from previous day&apos;s closing.
            </span>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <Label className="text-xs text-muted-foreground">Report Date:</Label>
            <Input type="date" value={reportDate} onChange={(e) => setReportDate(e.target.value)} className="text-xs h-9 w-[160px]" max={new Date().toISOString().split("T")[0]} />
            <Button variant="outline" size="sm" className="text-xs ml-auto" onClick={() => setSignOffOpen(true)}>
              Sign Off Day
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Override Opening Balance Panel */}
      <Card>
        <CardContent className="p-0">
          <button
            type="button"
            className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium hover:bg-muted/50"
            onClick={() => setOverrideOpen(!overrideOpen)}
          >
            <span>Override Opening Balance</span>
            {overrideOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          {overrideOpen && (
            <div className="px-4 pb-4 space-y-3 border-t pt-3">
              <p className="text-xs text-muted-foreground">Adjust opening balances if previous day closing was incorrect.</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Cash In Hand (₹)</Label>
                  <Input type="number" value={overrideValues.cash} onChange={(e) => setOverrideValues((p) => ({ ...p, cash: e.target.value }))} className="text-xs h-9" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Bank Total (₹)</Label>
                  <Input type="number" value={overrideValues.bank} onChange={(e) => setOverrideValues((p) => ({ ...p, bank: e.target.value }))} className="text-xs h-9" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">UPI / Wallet (₹)</Label>
                  <Input type="number" value={overrideValues.upi} onChange={(e) => setOverrideValues((p) => ({ ...p, upi: e.target.value }))} className="text-xs h-9" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Reason for Override *</Label>
                <Input placeholder="e.g. Previous day closing correction" value={overrideValues.reason} onChange={(e) => setOverrideValues((p) => ({ ...p, reason: e.target.value }))} className="text-xs h-9" />
              </div>
              <Button size="sm" className="text-xs" onClick={handleOverride}>Save Override</Button>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Opening Cash", value: mockFlow.opening.cash_in_hand, icon: Wallet, color: "text-green-700" },
          { label: "Opening Bank", value: mockFlow.opening.bank_total, icon: Building2, color: "text-blue-700" },
          { label: "Total Inflows", value: totalIn, icon: ArrowUpRight, color: "text-green-700" },
          { label: "Total Outflows", value: totalOut, icon: ArrowDownLeft, color: "text-red-700" },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <s.icon className={`h-4 w-4 ${s.color}`} />
                <span className="text-xs text-muted-foreground uppercase">{s.label}</span>
              </div>
              <div className={`text-xl font-bold ${s.color}`}>{formatCurrency(s.value)}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-5">
            <h3 className="text-sm font-semibold text-green-700 mb-4 flex items-center gap-2">
              <ArrowUpRight className="h-4 w-4" /> Inflows
            </h3>
            <Table>
              <TableBody>
                {mockFlow.inflows.map((row) => (
                  <TableRow key={row.label}>
                    <TableCell className="text-xs">{row.label}</TableCell>
                    <TableCell className="text-xs font-bold text-green-700 text-right">{formatCurrency(row.amount)}</TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-green-50/50">
                  <TableCell className="text-xs font-bold">Total Inflows</TableCell>
                  <TableCell className="text-xs font-bold text-green-700 text-right">{formatCurrency(totalIn)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <h3 className="text-sm font-semibold text-red-700 mb-4 flex items-center gap-2">
              <ArrowDownLeft className="h-4 w-4" /> Outflows
            </h3>
            <Table>
              <TableBody>
                {mockFlow.outflows.map((row) => (
                  <TableRow key={row.label}>
                    <TableCell className="text-xs">{row.label}</TableCell>
                    <TableCell className="text-xs font-bold text-red-700 text-right">{formatCurrency(row.amount)}</TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-red-50/50">
                  <TableCell className="text-xs font-bold">Total Outflows</TableCell>
                  <TableCell className="text-xs font-bold text-red-700 text-right">{formatCurrency(totalOut)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-5">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <Landmark className="h-4 w-4" /> Closing Balances — {reportDate}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: "Cash In Hand", value: mockFlow.closing.cash_in_hand, icon: Wallet },
              { label: "Bank Accounts", value: mockFlow.closing.bank_total, icon: Building2 },
              { label: "UPI / Wallet", value: mockFlow.closing.upi_wallet, icon: CreditCard },
            ].map((b) => (
              <div key={b.label} className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <b.icon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{b.label}</span>
                </div>
                <div className="text-lg font-bold">{formatCurrency(b.value)}</div>
                <Badge variant="outline" className="mt-2 text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200">Verified</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sign Off Day Modal */}
      <Dialog open={signOffOpen} onOpenChange={setSignOffOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Sign Off Day — {reportDate}</DialogTitle>
            <DialogDescription>
              Confirm closing balances and lock this day&apos;s fund flow. This action cannot be undone without admin override.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 text-sm bg-muted/50 rounded-lg p-3">
            <div className="flex justify-between"><span>Cash In Hand</span><span className="font-bold">{formatCurrency(mockFlow.closing.cash_in_hand)}</span></div>
            <div className="flex justify-between"><span>Bank Accounts</span><span className="font-bold">{formatCurrency(mockFlow.closing.bank_total)}</span></div>
            <div className="flex justify-between"><span>UPI / Wallet</span><span className="font-bold">{formatCurrency(mockFlow.closing.upi_wallet)}</span></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSignOffOpen(false)}>Cancel</Button>
            <Button onClick={handleSignOff}>Confirm Sign Off</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default CashFundFlowPage;
