import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  ShieldCheck, AlertTriangle, CheckCircle2, XCircle, FileSearch,
  Clock, History, RefreshCw, Download, IndianRupee, CalendarIcon, X
} from "lucide-react";
import { toast } from "sonner";
import { financeSelectors } from "@/modules/finance/financeStore";
import { parseISO, isAfter, isBefore, startOfDay, subDays, format } from "date-fns";
import { getDonationsState } from "@/modules/donations/donationsStore";
import { voucherRequests } from "@/stores/voucherStore";
import { exportToCSV } from "@/utils/exportCSV";
import { cn } from "@/lib/utils";

// ─── Settlement Data Types ───
interface SettlementRecord {
  id: string;
  date: string;
  name: string;
  phone: string;
  amount: number;
  bank: string;
  settlementStatus: "Settled" | "Yet to Settle";
  settlementDate: string;
  paymentId: string;
  transferId: string;
  settlementId: string;
  type: "Donation" | "Seva" | "Event" | "Hundi" | "Sale" | "Manual" | "Other";
}

const formatCurrency = (val: number) => `₹${val.toLocaleString("en-IN")}`;

// ─── Mock settlement data derived from store ───
function buildSettlementData(): SettlementRecord[] {
  const donState = getDonationsState();
  const donations = donState.donations;
  const donors = donState.donors;
  const transactions = financeSelectors.getTransactions();
  const records: SettlementRecord[] = [];
  const usedTxnIds = new Set<string>();

  // 1. Donations
  donations.filter(d => d.status === "Recorded").forEach((d, i) => {
    const txn = transactions.find(t => t.referenceId === d.donationId);
    if (txn) usedTxnIds.add(txn.id);
    const isSettled = txn?.status === "Completed";
    const donor = donors.find(dr => dr.donorId === d.donorId);
    records.push({
      id: `SET-${String(records.length + 1).padStart(4, "0")}`,
      date: d.date,
      name: d.donorName,
      phone: donor?.phone || "—",
      amount: d.amount,
      bank: d.channel === "Cash" ? "Cash" : d.channel === "UPI" ? "UPI/GPay" : d.channel === "Bank Transfer" ? "HDFC Bank" : d.channel === "Cheque" ? "SBI" : "HDFC Bank",
      settlementStatus: isSettled ? "Settled" : "Yet to Settle",
      settlementDate: isSettled ? d.date : "—",
      paymentId: `pay_${d.donationId.replace("DON-", "").toLowerCase()}${Math.random().toString(36).slice(2, 8)}`,
      transferId: isSettled ? `trf_${Math.random().toString(36).slice(2, 10)}` : "—",
      settlementId: isSettled ? `setl_${Math.random().toString(36).slice(2, 10)}` : "—",
      type: "Donation",
    });
  });

  // 2. All remaining income transactions (Seva, Event, Manual, etc.)
  const sourceToType = (src: string): SettlementRecord["type"] => {
    if (src === "Seva") return "Seva";
    if (src === "Event") return "Event";
    if (src === "Manual") return "Manual";
    return "Other";
  };

  transactions
    .filter(t => t.type === "Income" && !usedTxnIds.has(t.id))
    .forEach(t => {
      const bankLabel = t.paymentMethod === "Cash" ? "Cash" : t.paymentMethod === "UPI" ? "UPI/GPay" : t.paymentMethod === "Bank" ? "HDFC Bank" : "HDFC Bank";
      records.push({
        id: `SET-${String(records.length + 1).padStart(4, "0")}`,
        date: t.date,
        name: t.description.split("—")[0]?.trim() || t.description.slice(0, 30) || "—",
        phone: "—",
        amount: t.amount,
        bank: bankLabel,
        settlementStatus: t.status === "Completed" ? "Settled" : "Yet to Settle",
        settlementDate: t.status === "Completed" ? t.date : "—",
        paymentId: `pay_${t.id.toLowerCase().replace(/[^a-z0-9]/g, "")}`,
        transferId: t.status === "Completed" ? `trf_${Math.random().toString(36).slice(2, 10)}` : "—",
        settlementId: t.status === "Completed" ? `setl_${Math.random().toString(36).slice(2, 10)}` : "—",
        type: sourceToType(t.source),
      });
    });

  return records.sort((a, b) => b.date.localeCompare(a.date));
}

// ─── Old reconciliation logic (kept for audit tab) ───
function buildAuditLogs() {
  const transactions = financeSelectors.getTransactions();
  const logs: { time: string; user: string; action: string; type: string }[] = [];
  transactions.slice(0, 15).forEach(txn => {
    logs.push({
      time: txn.createdAt ? new Date(txn.createdAt).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }) : txn.date,
      user: txn.createdBy || "System",
      action: `${txn.type} — ${txn.description.slice(0, 60)}${txn.description.length > 60 ? "..." : ""} (${formatCurrency(txn.amount)})`,
      type: txn.source === "Manual" ? "Manual Entry" : `${txn.source} Sync`,
    });
    if (txn.approvedBy) {
      logs.push({
        time: txn.createdAt ? new Date(txn.createdAt).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }) : txn.date,
        user: txn.approvedBy,
        action: `Approved ${txn.id} — ${formatCurrency(txn.amount)}`,
        type: "Approval",
      });
    }
  });
  return logs.slice(0, 20);
}

type DatePreset = "all" | "today" | "last-week" | "custom";

const ReconciliationPage = () => {
  const [, setTick] = useState(0);
  const [datePreset, setDatePreset] = useState<DatePreset>("all");
  const [customFrom, setCustomFrom] = useState<Date | undefined>();
  const [customTo, setCustomTo] = useState<Date | undefined>();
  const [bankFilter, setBankFilter] = useState("all");

  const allData = useMemo(() => buildSettlementData(), []);
  const auditLogs = useMemo(() => buildAuditLogs(), []);

  // Date filtering
  const getDateRange = () => {
    const now = new Date();
    switch (datePreset) {
      case "today": return { from: startOfDay(now), to: now };
      case "last-week": return { from: startOfDay(subDays(now, 7)), to: now };
      case "custom": return { from: customFrom || null, to: customTo || null };
      default: return { from: null, to: null };
    }
  };

  const filteredData = useMemo(() => {
    const range = getDateRange();
    let data = allData;
    if (range.from || range.to) {
      data = data.filter(r => {
        const d = parseISO(r.date);
        if (range.from && isBefore(d, range.from)) return false;
        if (range.to && isAfter(d, range.to)) return false;
        return true;
      });
    }
    if (bankFilter !== "all") {
      data = data.filter(r => r.bank === bankFilter);
    }
    return data;
  }, [allData, datePreset, customFrom, customTo, bankFilter]);

  // Stats
  const totalDonations = filteredData.filter(r => r.type === "Donation").reduce((s, r) => s + r.amount, 0);
  const totalSevas = filteredData.filter(r => r.type === "Seva").reduce((s, r) => s + r.amount, 0);
  const totalOtherIncome = filteredData.filter(r => !["Donation", "Seva"].includes(r.type)).reduce((s, r) => s + r.amount, 0);
  const pendingSettlements = filteredData.filter(r => r.settlementStatus === "Yet to Settle").reduce((s, r) => s + r.amount, 0);
  const settledAmount = filteredData.filter(r => r.settlementStatus === "Settled").reduce((s, r) => s + r.amount, 0);
  const pendingCount = filteredData.filter(r => r.settlementStatus === "Yet to Settle").length;
  const settledCount = filteredData.filter(r => r.settlementStatus === "Settled").length;

  const banks = useMemo(() => {
    const s = new Set(allData.map(r => r.bank));
    return Array.from(s).sort();
  }, [allData]);

  // Export handlers
  const handleExportTable = () => {
    const headers = ["Date", "Type", "Name", "Phone", "Amount", "Bank", "Settlement Status", "Settlement Date", "Payment ID", "Transfer ID", "Settlement ID"];
    const rows = filteredData.map(r => [
      r.date, r.type, r.name, r.phone, r.amount.toString(), r.bank, r.settlementStatus, r.settlementDate,
      r.paymentId, r.transferId, r.settlementId,
    ]);
    exportToCSV("reconciliation_report", headers, rows);
    toast.success("Reconciliation report exported");
  };

  const handleDownloadCard = (type: "donations" | "sevas" | "pending" | "settled") => {
    let data: SettlementRecord[];
    let filename: string;
    if (type === "donations") {
      data = filteredData.filter(r => r.type === "Donation");
      filename = "donations_data";
    } else if (type === "sevas") {
      data = filteredData.filter(r => r.type === "Seva");
      filename = "sevas_data";
    } else if (type === "pending") {
      data = filteredData.filter(r => r.settlementStatus === "Yet to Settle");
      filename = "pending_settlements";
    } else {
      data = filteredData.filter(r => r.settlementStatus === "Settled");
      filename = "settled_transactions";
    }
    const headers = ["Date", "Name", "Phone", "Amount", "Bank", "Status", "Payment ID", "Transfer ID", "Settlement ID"];
    const rows = data.map(r => [
      r.date, r.name, r.phone, r.amount.toString(), r.bank, r.settlementStatus,
      r.paymentId, r.transferId, r.settlementId,
    ]);
    exportToCSV(filename, headers, rows);
    toast.success(`${filename.replace(/_/g, " ")} exported (${data.length} records)`);
  };

  const handleRerun = () => {
    setTick(t => t + 1);
    toast.success("Reconciliation refreshed from live data");
  };

  const handleClearFilters = () => {
    setDatePreset("all");
    setCustomFrom(undefined);
    setCustomTo(undefined);
    setBankFilter("all");
  };

  const hasActiveFilter = datePreset !== "all" || bankFilter !== "all";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-primary" /> Reconciliation Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">Payment settlements, transaction matching & audit trail</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Date Filter */}
          <Select value={datePreset} onValueChange={(v: DatePreset) => { setDatePreset(v); if (v !== "custom") { setCustomFrom(undefined); setCustomTo(undefined); } }}>
            <SelectTrigger className="w-40 h-9">
              <CalendarIcon className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="last-week">Last 7 Days</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
          {datePreset === "custom" && (
            <div className="flex items-center gap-1">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className={cn("h-9 text-xs", !customFrom && "text-muted-foreground")}>
                    {customFrom ? format(customFrom, "dd MMM yyyy") : "From"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={customFrom} onSelect={setCustomFrom} className="p-3 pointer-events-auto" />
                </PopoverContent>
              </Popover>
              <span className="text-xs text-muted-foreground">–</span>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className={cn("h-9 text-xs", !customTo && "text-muted-foreground")}>
                    {customTo ? format(customTo, "dd MMM yyyy") : "To"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={customTo} onSelect={setCustomTo} className="p-3 pointer-events-auto" />
                </PopoverContent>
              </Popover>
            </div>
          )}
          {/* Bank Filter */}
          <Select value={bankFilter} onValueChange={setBankFilter}>
            <SelectTrigger className="w-36 h-9">
              <SelectValue placeholder="All Banks" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Banks</SelectItem>
              {banks.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
            </SelectContent>
          </Select>
          {hasActiveFilter && (
            <Button variant="ghost" size="icon" className="h-9 w-9" onClick={handleClearFilters}>
              <X className="h-3.5 w-3.5" />
            </Button>
          )}
          <Button variant="outline" size="sm" className="h-9 gap-1.5" onClick={handleExportTable}>
            <Download className="h-3.5 w-3.5" /> Export
          </Button>
          <Button onClick={handleRerun} size="sm" className="h-9 gap-1.5">
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] text-muted-foreground uppercase tracking-wider">Total Donations</span>
                <p className="text-xl font-bold text-green-700">{formatCurrency(totalDonations)}</p>
                <span className="text-[10px] text-muted-foreground">{filteredData.filter(r => r.type === "Donation").length} transactions</span>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-green-700" onClick={() => handleDownloadCard("donations")} title="Download donations data">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] text-muted-foreground uppercase tracking-wider">Total Sevas</span>
                <p className="text-xl font-bold text-blue-700">{formatCurrency(totalSevas)}</p>
                <span className="text-[10px] text-muted-foreground">{filteredData.filter(r => r.type === "Seva").length} transactions</span>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-blue-700" onClick={() => handleDownloadCard("sevas")} title="Download sevas data">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] text-muted-foreground uppercase tracking-wider">Pending Settlements</span>
                <p className="text-xl font-bold text-amber-600">{formatCurrency(pendingSettlements)}</p>
                <span className="text-[10px] text-muted-foreground">{pendingCount} pending</span>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-amber-600" onClick={() => handleDownloadCard("pending")} title="Download pending settlements">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-primary">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] text-muted-foreground uppercase tracking-wider">Settlements</span>
                <p className="text-xl font-bold text-primary">{formatCurrency(settledAmount)}</p>
                <span className="text-[10px] text-muted-foreground">{settledCount} settled</span>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={() => handleDownloadCard("settled")} title="Download settled transactions">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="settlements" className="w-full">
        <TabsList>
          <TabsTrigger value="settlements" className="gap-1.5"><IndianRupee className="h-3.5 w-3.5" /> Settlements ({filteredData.length})</TabsTrigger>
          <TabsTrigger value="audit" className="gap-1.5"><History className="h-3.5 w-3.5" /> Audit Trail</TabsTrigger>
        </TabsList>

        <TabsContent value="settlements" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Date</TableHead>
                      <TableHead className="text-xs">Type</TableHead>
                      <TableHead className="text-xs">Name</TableHead>
                      <TableHead className="text-xs">Phone No</TableHead>
                      <TableHead className="text-xs text-right">Amount</TableHead>
                      <TableHead className="text-xs">Bank</TableHead>
                      <TableHead className="text-xs text-center">Settlement Status</TableHead>
                      <TableHead className="text-xs">Settlement Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.length === 0 ? (
                      <TableRow>
                         <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                          No settlement records found
                        </TableCell>
                      </TableRow>
                    ) : filteredData.map(r => (
                      <TableRow key={r.id} className={r.settlementStatus === "Yet to Settle" ? "bg-amber-50/30" : ""}>
                        <TableCell className="text-xs">{r.date}</TableCell>
                        <TableCell className="text-xs">
                          <Badge variant="outline" className={cn("text-[10px]",
                            r.type === "Donation" && "bg-green-50 text-green-700 border-green-200",
                            r.type === "Seva" && "bg-blue-50 text-blue-700 border-blue-200",
                            r.type === "Event" && "bg-purple-50 text-purple-700 border-purple-200",
                            r.type === "Manual" && "bg-muted text-muted-foreground",
                          )}>{r.type}</Badge>
                        </TableCell>
                        <TableCell className="text-xs font-medium">{r.name}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{r.phone}</TableCell>
                        <TableCell className="text-xs text-right font-semibold">{formatCurrency(r.amount)}</TableCell>
                        <TableCell className="text-xs">
                          <Badge variant="secondary" className="text-[10px]">{r.bank}</Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant="outline"
                            className={cn("text-[10px]",
                              r.settlementStatus === "Settled" && "bg-green-50 text-green-700 border-green-200",
                              r.settlementStatus === "Yet to Settle" && "bg-amber-50 text-amber-700 border-amber-200",
                            )}
                          >
                            {r.settlementStatus === "Settled" && <CheckCircle2 className="h-3 w-3 mr-1" />}
                            {r.settlementStatus === "Yet to Settle" && <Clock className="h-3 w-3 mr-1" />}
                            {r.settlementStatus}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">{r.settlementDate}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="mt-4">
          <Card>
            <CardContent className="p-4">
              <h3 className="text-base font-semibold mb-3">Audit Trail — Live Activity</h3>
              <div className="space-y-0">
                {auditLogs.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">No audit entries</p>
                ) : auditLogs.map((log, i) => (
                  <div key={i} className="flex items-start gap-3 py-3 border-b last:border-0">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <History className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">{log.action}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-muted-foreground">{log.user}</span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">{log.time}</span>
                        <Badge variant="secondary" className="text-[10px]">{log.type}</Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReconciliationPage;
