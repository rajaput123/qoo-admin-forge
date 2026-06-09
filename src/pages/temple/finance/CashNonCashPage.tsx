import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Download, Wallet, CreditCard, Banknote, ArrowRightLeft, IndianRupee, Check } from "lucide-react";
import { toast } from "sonner";

const formatCurrency = (val: number) => `₹${val.toLocaleString("en-IN")}`;

const mockSummary = {
  cash: { total: 125000, count: 18 },
  upi_online: { total: 342500, count: 45 },
  cheque_dd: { total: 85000, count: 3 },
  neft_rtgs: { total: 200000, count: 2 },
  grand_total: 752500,
  grand_txn_count: 68,
};

const mockTransactions = [
  { id: "1", devotee_name: "Ramesh Kumar", purpose_or_seva: "General Donation", payment_mode: "CASH", ref_utr_cheque: "—", amount: 5000, txn_time: "09:15", handover_status: "Pending" },
  { id: "2", devotee_name: "Lakshmi Devi", purpose_or_seva: "Abhishekam Seva", payment_mode: "UPI", ref_utr_cheque: "UTR88291034", amount: 2500, txn_time: "10:42", handover_status: "Handed Over" },
  { id: "3", devotee_name: "Venkat Reddy", purpose_or_seva: "Annadanam Fund", payment_mode: "CHEQUE", ref_utr_cheque: "CHQ-445821", amount: 25000, txn_time: "11:08", handover_status: "Pending" },
  { id: "4", devotee_name: "Priya Patel", purpose_or_seva: "Special Puja", payment_mode: "CASH", ref_utr_cheque: "—", amount: 1100, txn_time: "12:30", handover_status: "Pending" },
  { id: "5", devotee_name: "Sri Trust Foundation", purpose_or_seva: "Building Fund", payment_mode: "NEFT", ref_utr_cheque: "NEFT9928341", amount: 200000, txn_time: "14:15", handover_status: "Handed Over" },
];

const statCards = [
  { key: "cash", label: "Cash", ...mockSummary.cash, color: "text-green-700", bg: "bg-green-50", border: "border-green-200", icon: Wallet, clickable: true },
  { key: "upi", label: "UPI / Online", total: mockSummary.upi_online.total, count: mockSummary.upi_online.count, color: "text-blue-700", bg: "bg-blue-50", border: "border-blue-200", icon: CreditCard, clickable: false },
  { key: "cheque", label: "Cheque / DD", total: mockSummary.cheque_dd.total, count: mockSummary.cheque_dd.count, color: "text-amber-800", bg: "bg-amber-50", border: "border-amber-200", icon: Banknote, clickable: false },
  { key: "neft", label: "NEFT / RTGS", total: mockSummary.neft_rtgs.total, count: mockSummary.neft_rtgs.count, color: "text-purple-700", bg: "bg-purple-50", border: "border-purple-200", icon: ArrowRightLeft, clickable: false },
  { key: "total", label: "Grand Total", total: mockSummary.grand_total, count: mockSummary.grand_txn_count, color: "text-red-700", bg: "bg-red-50", border: "border-red-200", icon: IndianRupee, clickable: false },
];

const CashNonCashPage = () => {
  const [counter, setCounter] = useState("counter-main");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [showHandover, setShowHandover] = useState(false);

  const handleHandover = () => {
    toast.success("Cash handover recorded (mock)");
    setShowHandover(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <Card>
        <CardContent className="p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-lg font-semibold">Cash & Non-Cash Collection</h1>
              <p className="text-xs text-muted-foreground mt-1">Select counter / source to view collection details</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                counter-main · {date}
              </Badge>
              <Button variant="outline" size="sm" className="text-xs gap-1.5" onClick={() => toast.success("Collection report exported (mock PDF)")}>
                <Download className="h-3.5 w-3.5" /> Export PDF
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap items-end gap-4">
            <div className="space-y-1.5 min-w-[220px]">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Counter / Source *</Label>
              <Select value={counter} onValueChange={setCounter}>
                <SelectTrigger className="text-xs h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="counter-main">counter-main</SelectItem>
                  <SelectItem value="hundi-counter">Hundi Counter</SelectItem>
                  <SelectItem value="prasad-counter">Prasad Counter</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Date</Label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="text-xs h-9 w-[160px]" />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {statCards.map((s) => (
          <Card
            key={s.key}
            className={`cursor-pointer transition-all hover:-translate-y-0.5 ${s.clickable && showHandover ? "ring-2 ring-green-600/30 border-green-600" : ""}`}
            onClick={() => s.clickable && setShowHandover(!showHandover)}
          >
            <CardContent className={`p-3.5 ${s.bg} border ${s.border} rounded-lg m-0`}>
              <div className="text-xs text-muted-foreground uppercase font-medium tracking-wide mb-1">{s.label}</div>
              <div className={`text-xl font-bold ${s.color}`}>{formatCurrency(s.total)}</div>
              <div className={`text-xs mt-1 ${s.color} opacity-80`}>{s.count} transactions</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {showHandover && (
        <Card className="border-green-200">
          <CardContent className="p-5">
            <div className="mb-4">
              <h3 className="text-green-700 font-semibold">Cash Handover — Accounts Department</h3>
              <p className="text-xs text-muted-foreground">Record details of person accepting cash from counter</p>
            </div>
            <div className="bg-green-50 border border-green-200 text-green-700 text-sm font-semibold px-4 py-3 rounded-lg mb-5">
              Cash to be handed over: {formatCurrency(mockSummary.cash.total)} from counter-main
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="space-y-1.5">
                <Label className="text-xs">Received By (Accounts) *</Label>
                <Select defaultValue="officer-1">
                  <SelectTrigger className="text-xs h-9"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="officer-1">Shashank (Accounts Head)</SelectItem>
                    <SelectItem value="officer-2">Priya Sharma (Accounts)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Handover Time *</Label>
                <Input type="time" defaultValue="18:00" className="text-xs h-9" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Cash Bag / Seal No</Label>
                <Input placeholder="e.g. BAG-20260606-C2" className="text-xs h-9" />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" size="sm" onClick={() => setShowHandover(false)}>Cancel</Button>
              <Button size="sm" className="gap-1.5" onClick={handleHandover}>
                <Check className="h-3.5 w-3.5" /> Sign Off & Complete Handover
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-5">
          <div className="mb-4">
            <h3 className="text-sm font-semibold">Transactions — counter-main</h3>
            <p className="text-xs text-muted-foreground">Daily collection register from {date}</p>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="text-xs text-center">S.No</TableHead>
                <TableHead className="text-xs">Devotee / Donor</TableHead>
                <TableHead className="text-xs">Seva / Donation</TableHead>
                <TableHead className="text-xs">Mode</TableHead>
                <TableHead className="text-xs">Ref / UTR</TableHead>
                <TableHead className="text-xs text-right">Amount (₹)</TableHead>
                <TableHead className="text-xs text-center">Time</TableHead>
                <TableHead className="text-xs">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockTransactions.map((row, i) => (
                <TableRow key={row.id}>
                  <TableCell className="text-xs text-center text-muted-foreground">{i + 1}</TableCell>
                  <TableCell className="text-xs font-medium">{row.devotee_name}</TableCell>
                  <TableCell className="text-xs">{row.purpose_or_seva}</TableCell>
                  <TableCell className="text-xs font-bold text-primary uppercase">{row.payment_mode}</TableCell>
                  <TableCell className="text-xs font-mono text-muted-foreground">{row.ref_utr_cheque}</TableCell>
                  <TableCell className="text-xs font-bold text-green-700 text-right">{row.amount.toLocaleString("en-IN")}</TableCell>
                  <TableCell className="text-xs text-center text-muted-foreground">{row.txn_time}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={row.handover_status === "Pending" ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-green-50 text-green-700 border-green-200"}>
                      {row.handover_status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-primary/5">
                <TableCell colSpan={5} className="text-xs font-bold text-right">Sum Total</TableCell>
                <TableCell className="text-sm font-bold text-green-700 text-right">{formatCurrency(mockSummary.grand_total)}</TableCell>
                <TableCell colSpan={2} className="text-xs text-muted-foreground">{mockSummary.grand_txn_count} txns</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CashNonCashPage;
