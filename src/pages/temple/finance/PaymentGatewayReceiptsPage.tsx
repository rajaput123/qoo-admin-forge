import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Download,
  Search,
  CreditCard,
  Clock,
  CheckCircle,
  IndianRupee,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Transaction {
  date: string;
  orderId: string;
  devoteeName: string;
  seva: string;
  amount: number;
  mode: string;
  status: "SETTLED" | "PENDING" | "FAILED";
  settledBank: string;
}

const mockTransactions: Transaction[] = [
  {
    date: "2026-06-05",
    orderId: "pay_SxrH1GgxU59CvN",
    devoteeName: "Aarya S S",
    seva: "General / Hundi",
    amount: 2,
    mode: "TRANSFER",
    status: "SETTLED",
    settledBank: "dscsd - sdsd",
  },
  {
    date: "2026-06-03",
    orderId: "pay_Sy8KdaZ98tUaGm",
    devoteeName: "Aarya",
    seva: "General / Hundi",
    amount: 3,
    mode: "TRANSFER",
    status: "SETTLED",
    settledBank: "dscsd - sdsd",
  },
  {
    date: "2026-06-01",
    orderId: "pay_Tz9LcbY18uVbKn",
    devoteeName: "Rohan Sharma",
    seva: "Special Donation",
    amount: 150,
    mode: "TRANSFER",
    status: "SETTLED",
    settledBank: "HDFC Bank",
  },
  {
    date: "2026-05-28",
    orderId: "pay_Ux2MkaZ24vKbNp",
    devoteeName: "Priya Patel",
    seva: "Abhishekam Seva",
    amount: 100,
    mode: "TRANSFER",
    status: "SETTLED",
    settledBank: "ICICI Bank",
  },
  {
    date: "2026-05-25",
    orderId: "pay_Vw3LiaZ15xMbOp",
    devoteeName: "Ananth Kumar",
    seva: "Annadanam",
    amount: 50,
    mode: "TRANSFER",
    status: "SETTLED",
    settledBank: "State Bank of India",
  },
  {
    date: "2026-05-20",
    orderId: "pay_Wx4MjaZ89yNbPp",
    devoteeName: "Meera Nair",
    seva: "Archana Seva",
    amount: 20,
    mode: "TRANSFER",
    status: "PENDING",
    settledBank: "—",
  },
  {
    date: "2026-05-18",
    orderId: "pay_Yx5KdaZ92zObQp",
    devoteeName: "Vikram Singh",
    seva: "General Donation",
    amount: 44.43,
    mode: "TRANSFER",
    status: "SETTLED",
    settledBank: "HDFC Bank",
  },
];

const trendData = [
  { date: "16-03", receipts: 5, settlements: 5, pending: 0 },
  { date: "17-03", receipts: 10, settlements: 15, pending: 0 },
  { date: "18-03", receipts: 5, settlements: 10, pending: 0 },
  { date: "20-03", receipts: 8, settlements: 12, pending: 0 },
  { date: "23-03", receipts: 4, settlements: 5, pending: 0 },
  { date: "24-03", receipts: 6, settlements: 6, pending: 0 },
  { date: "25-03", receipts: 5, settlements: 10, pending: 0 },
  { date: "30-03", receipts: 12, settlements: 10, pending: 2 },
  { date: "02-04", receipts: 2, settlements: 2, pending: 0 },
  { date: "04-04", receipts: 5, settlements: 210, pending: 0 },
  { date: "06-04", receipts: 6, settlements: 10, pending: 0 },
  { date: "07-04", receipts: 4, settlements: 4, pending: 0 },
  { date: "15-04", receipts: 5, settlements: 5, pending: 0 },
  { date: "16-04", receipts: 3, settlements: 3, pending: 0 },
  { date: "17-04", receipts: 4, settlements: 4, pending: 0 },
  { date: "18-04", receipts: 2, settlements: 2, pending: 0 },
  { date: "20-04", receipts: 8, settlements: 8, pending: 0 },
  { date: "21-04", receipts: 15, settlements: 35, pending: 0 },
  { date: "22-04", receipts: 5, settlements: 12, pending: 0 },
  { date: "23-04", receipts: 3, settlements: 3, pending: 0 },
  { date: "25-04", receipts: 6, settlements: 6, pending: 0 },
  { date: "28-04", receipts: 5, settlements: 5, pending: 0 },
  { date: "29-04", receipts: 4, settlements: 4, pending: 0 },
  { date: "02-05", receipts: 5, settlements: 5, pending: 0 },
  { date: "11-05", receipts: 2, settlements: 2, pending: 0 },
  { date: "13-05", receipts: 3, settlements: 3, pending: 0 },
  { date: "14-05", receipts: 4, settlements: 4, pending: 0 },
  { date: "15-05", receipts: 2, settlements: 2, pending: 0 },
  { date: "16-05", receipts: 5, settlements: 5, pending: 0 },
  { date: "18-05", receipts: 6, settlements: 6, pending: 0 },
  { date: "19-05", receipts: 3, settlements: 3, pending: 0 },
  { date: "20-05", receipts: 8, settlements: 8, pending: 0 },
  { date: "21-05", receipts: 5, settlements: 5, pending: 0 },
  { date: "25-05", receipts: 4, settlements: 4, pending: 0 },
  { date: "27-05", receipts: 3, settlements: 3, pending: 0 },
  { date: "03-06", receipts: 8, settlements: 8, pending: 0 },
  { date: "05-06", receipts: 5, settlements: 5, pending: 0 }
];

const formatCurrency = (val: number) => `₹${val.toLocaleString("en-IN")}`;

const RECEIPTS_PAGE_SIZE = 8;

const PaymentGatewayReceiptsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);

  const filteredTransactions = useMemo(() => {
    return mockTransactions.filter((t) => {
      const matchesSearch =
        t.devoteeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.seva.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStart = startDate ? t.date >= startDate : true;
      const matchesEnd = endDate ? t.date <= endDate : true;

      return matchesSearch && matchesStart && matchesEnd;
    });
  }, [searchTerm, startDate, endDate]);

  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / RECEIPTS_PAGE_SIZE));
  const paginatedTransactions = filteredTransactions.slice((page - 1) * RECEIPTS_PAGE_SIZE, page * RECEIPTS_PAGE_SIZE);

  const handleExportCSV = () => {
    const csvContent = [
      "Date,Order ID / UTR,Devotee Name,Donation / Seva,Amount,Mode,Settlement Status,Settled Bank",
      ...filteredTransactions.map(
        (t) =>
          `${t.date},${t.orderId},"${t.devoteeName}","${t.seva}",${t.amount},${t.mode},${t.status},"${t.settledBank}"`
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `payment_gateway_receipts_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Receipts exported to CSV");
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setStartDate("");
    setEndDate("");
    setPage(1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Gateway status banner — page title/actions are in FinanceLayout topbar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-l-4 border-l-blue-600 bg-white border border-y border-r border-border rounded-r-lg p-4 gap-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shrink-0 font-bold text-lg">
            R
          </div>
          <div>
            <div className="text-sm font-semibold text-foreground">
              Razorpay Payment Gateway
            </div>
            <div className="text-xs text-muted-foreground">
              Connected · Live Mode · MID: RZPLIVETPL2026
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground">
          <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-1 rounded-full">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
            Live sync active
          </div>
          <div>Last updated: Just now</div>
        </div>
      </div>

      {/* Summary Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Receipts */}
        <Card className="border-l-4 border-l-emerald-500 shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                Total Receipts
              </span>
              <p className="text-2xl font-bold text-foreground">₹369.43</p>
              <span className="text-[11px] font-medium text-emerald-600 flex items-center gap-1">
                ↑ 139 transactions overall
              </span>
            </div>
            <div className="h-10 w-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CreditCard className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        {/* Pending Settlement */}
        <Card className="border-l-4 border-l-red-500 shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                Pending Settlement
              </span>
              <p className="text-2xl font-bold text-foreground">₹4</p>
              <span className="text-[11px] font-medium text-red-500">
                Expected in T+2 cycle
              </span>
            </div>
            <div className="h-10 w-10 rounded-lg bg-red-50 text-red-500 flex items-center justify-center">
              <Clock className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        {/* Settled Amount */}
        <Card className="border-l-4 border-l-amber-500 shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                Settled Amount
              </span>
              <p className="text-2xl font-bold text-foreground">₹365.43</p>
              <span className="text-[11px] font-medium text-amber-600">
                Verified by Bank Reconciliation
              </span>
            </div>
            <div className="h-10 w-10 rounded-lg bg-amber-50 text-amber-500 flex items-center justify-center">
              <CheckCircle className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        {/* Gateway Fees (TDR) */}
        <Card className="border-l-4 border-l-blue-500 shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                Gateway Fees (TDR)
              </span>
              <p className="text-2xl font-bold text-foreground">₹0</p>
              <span className="text-[11px] font-medium text-muted-foreground">
                Net effective platform costs
              </span>
            </div>
            <div className="h-10 w-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <IndianRupee className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart Section */}
      <Card className="shadow-sm">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/50">
          <div>
            <CardTitle className="text-sm font-bold text-foreground uppercase tracking-wider">
              Daily Receipt & Settlement Trend
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Consolidated view of platform income vs bank settlements
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-muted-foreground">Receipts</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#7a3411]" />
              <span className="text-muted-foreground">Settlements</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-red-500" />
              <span className="text-muted-foreground">Pending</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.4} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  fontSize={10}
                  tickMargin={8}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  fontSize={10}
                  tickFormatter={(val) => `₹${val}`}
                />
                <Tooltip
                  formatter={(value) => [`₹${value}`, ""]}
                  labelStyle={{ fontSize: "11px", fontWeight: "bold" }}
                  contentStyle={{ fontSize: "11px", borderRadius: "8px" }}
                />
                <Line
                  type="monotone"
                  dataKey="receipts"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="settlements"
                  stroke="#7a3411"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="pending"
                  stroke="#ef4444"
                  strokeWidth={1.5}
                  dot={{ r: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Transaction Register Section */}
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border/50">
          <CardTitle className="text-sm font-bold text-foreground uppercase tracking-wider">
            Transaction Register
          </CardTitle>
          <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={handleExportCSV}>
            <Download className="h-3.5 w-3.5" /> Export CSV
          </Button>
        </CardHeader>
        <CardContent className="pt-4 space-y-4">
          {/* Filters Bar */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 bg-muted/20 p-3 rounded-lg border border-border/40">
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search name, order ID, UTR..."
                  className="pl-9 h-9 text-xs"
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                />
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Input
                  type="date"
                  className="h-9 text-xs w-full sm:w-36"
                  value={startDate}
                  onChange={(e) => { setStartDate(e.target.value); setPage(1); }}
                />
                <span className="text-xs text-muted-foreground">to</span>
                <Input
                  type="date"
                  className="h-9 text-xs w-full sm:w-36"
                  value={endDate}
                  onChange={(e) => { setEndDate(e.target.value); setPage(1); }}
                />
              </div>
            </div>
            {(searchTerm || startDate || endDate) && (
              <Button variant="ghost" size="sm" className="h-9 text-xs text-red-500 hover:text-red-600 shrink-0" onClick={handleClearFilters}>
                Clear
              </Button>
            )}
          </div>

          {/* Table */}
          <div className="border rounded-lg overflow-hidden bg-white">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="text-[11px] font-bold uppercase text-muted-foreground">
                    Date
                  </TableHead>
                  <TableHead className="text-[11px] font-bold uppercase text-muted-foreground">
                    Order ID / UTR
                  </TableHead>
                  <TableHead className="text-[11px] font-bold uppercase text-muted-foreground">
                    Devotee Name
                  </TableHead>
                  <TableHead className="text-[11px] font-bold uppercase text-muted-foreground">
                    Donation / Seva
                  </TableHead>
                  <TableHead className="text-[11px] font-bold uppercase text-muted-foreground text-right">
                    Amount (₹)
                  </TableHead>
                  <TableHead className="text-[11px] font-bold uppercase text-muted-foreground">
                    Mode
                  </TableHead>
                  <TableHead className="text-[11px] font-bold uppercase text-muted-foreground">
                    Settlement Status
                  </TableHead>
                  <TableHead className="text-[11px] font-bold uppercase text-muted-foreground">
                    Settled Bank
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground text-xs">
                      No records found matching filters
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedTransactions.map((t) => (
                    <TableRow key={t.orderId} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="text-xs font-medium text-foreground/80 whitespace-nowrap">
                        {t.date}
                      </TableCell>
                      <TableCell className="text-xs font-mono font-semibold text-primary/90">
                        {t.orderId}
                      </TableCell>
                      <TableCell className="text-xs font-medium text-foreground/85">
                        {t.devoteeName}
                      </TableCell>
                      <TableCell className="text-xs text-foreground/75">
                        {t.seva}
                      </TableCell>
                      <TableCell className="text-xs font-bold text-right text-emerald-600">
                        {t.amount}
                      </TableCell>
                      <TableCell className="text-xs font-medium text-foreground/70">
                        {t.mode}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={cn(
                            "text-[10px] font-bold px-2 py-0.5",
                            t.status === "SETTLED"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : t.status === "PENDING"
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : "bg-red-50 text-red-700 border-red-200"
                          )}
                          variant="outline"
                        >
                          {t.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-foreground/60">
                        {t.settledBank}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between pt-4 mt-2 border-t text-xs text-muted-foreground">
            <span>Showing {filteredTransactions.length === 0 ? 0 : (page - 1) * RECEIPTS_PAGE_SIZE + 1}–{Math.min(page * RECEIPTS_PAGE_SIZE, filteredTransactions.length)} of {filteredTransactions.length} records</span>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="icon" className="h-7 w-7" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                <ChevronLeft className="h-3.5 w-3.5" />
              </Button>
              <span className="px-2">Page {page} of {totalPages}</span>
              <Button variant="outline" size="icon" className="h-7 w-7" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PaymentGatewayReceiptsPage;
