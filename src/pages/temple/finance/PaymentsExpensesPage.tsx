import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Download, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";

const formatCurrency = (val: number) => `₹${val.toLocaleString("en-IN")}`;

const mockSummary = { totalPayments: 245000, pendingApproval: 32000, approved: 213000 };

const mockPayments = [
  { voucher_no: "JV-2026-A1B2C3", date: "2026-06-05", payee: "Sri Pooja Stores", category: "Pooja Materials", temple: "Ganesha Temple", payment_mode: "BANK", amount: 8750, gst: "Nil", status: "Approved" },
  { voucher_no: "JV-2026-D4E5F6", date: "2026-06-04", payee: "Philips Electricals", category: "Utilities", temple: "Ganesha Temple", payment_mode: "NEFT", amount: 9800, gst: "18%", status: "Approved" },
  { voucher_no: "JV-2026-G7H8I9", date: "2026-06-03", payee: "Temple Catering Co.", category: "Annadanam", temple: "Ganesha Temple", payment_mode: "CHEQUE", amount: 15000, gst: "Nil", status: "Pending" },
  { voucher_no: "JV-2026-J1K2L3", date: "2026-06-02", payee: "Security Services Ltd", category: "Security", temple: "Ganesha Temple", payment_mode: "BANK", amount: 22000, gst: "18%", status: "Approved" },
  { voucher_no: "JV-2026-M4N5O6", date: "2026-06-01", payee: "Flower Vendor", category: "Pooja Materials", temple: "Ganesha Temple", payment_mode: "CASH", amount: 4500, gst: "Nil", status: "Pending" },
];

const PAGE_SIZE = 3;

const PaymentsExpensesPage = () => {
  const [filterCat, setFilterCat] = useState("all");
  const [filterApproval, setFilterApproval] = useState("all");
  const [page, setPage] = useState(1);

  const filtered = mockPayments.filter((p) => {
    if (filterCat !== "all" && p.category !== filterCat) return false;
    if (filterApproval !== "all" && p.status !== filterApproval) return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const categories = [...new Set(mockPayments.map((p) => p.category))];

  const handleFilterChange = (setter: (v: string) => void) => (v: string) => {
    setter(v);
    setPage(1);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <Card>
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-5">
            <h1 className="text-lg font-semibold">Payments & Expense Register</h1>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="text-xs gap-1.5" onClick={() => toast.success("Expense register exported (mock PDF)")}>
                <Download className="h-3.5 w-3.5" /> Export PDF
              </Button>
              <Button variant="outline" size="sm" className="text-xs gap-1.5" onClick={() => toast.success("Expense register exported (mock CSV)")}>
                <Download className="h-3.5 w-3.5" /> Export CSV
              </Button>
            </div>
          </div>

          <div className="flex gap-2 mb-5 flex-wrap">
            <Select value={filterCat} onValueChange={handleFilterChange(setFilterCat)}>
              <SelectTrigger className="text-xs h-9 w-[180px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterApproval} onValueChange={handleFilterChange(setFilterApproval)}>
              <SelectTrigger className="text-xs h-9 w-[160px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Pending">Pending Approval</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="rounded-lg p-3 border">
              <div className="text-xs text-muted-foreground uppercase font-medium">Total Payments</div>
              <div className="text-xl font-bold text-red-700">{formatCurrency(mockSummary.totalPayments)}</div>
            </div>
            <div className="rounded-lg p-3 border">
              <div className="text-xs text-muted-foreground uppercase font-medium">Pending Approval</div>
              <div className="text-xl font-bold text-amber-700">{formatCurrency(mockSummary.pendingApproval)}</div>
            </div>
            <div className="rounded-lg p-3 border">
              <div className="text-xs text-muted-foreground uppercase font-medium">Approved</div>
              <div className="text-xl font-bold text-green-700">{formatCurrency(mockSummary.approved)}</div>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="text-xs">Voucher No</TableHead>
                <TableHead className="text-xs">Date</TableHead>
                <TableHead className="text-xs">Payee</TableHead>
                <TableHead className="text-xs">Category</TableHead>
                <TableHead className="text-xs">Temple</TableHead>
                <TableHead className="text-xs">Mode</TableHead>
                <TableHead className="text-xs text-center">Amount (₹)</TableHead>
                <TableHead className="text-xs text-center">GST</TableHead>
                <TableHead className="text-xs text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.map((p) => (
                <TableRow key={p.voucher_no}>
                  <TableCell className="text-xs text-primary font-medium">{p.voucher_no.slice(0, 12)}...</TableCell>
                  <TableCell className="text-xs">{p.date}</TableCell>
                  <TableCell className="text-xs font-medium">{p.payee}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-[10px]">{p.category}</Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{p.temple}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-[10px] uppercase">{p.payment_mode}</Badge>
                  </TableCell>
                  <TableCell className="text-xs font-bold text-red-700 text-center">{formatCurrency(p.amount)}</TableCell>
                  <TableCell className="text-xs text-center text-muted-foreground">{p.gst}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className={p.status === "Approved" ? "bg-green-50 text-green-700 border-green-200" : "bg-amber-50 text-amber-700 border-amber-200"}>
                      {p.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex items-center justify-between pt-5 mt-2 border-t text-xs text-muted-foreground">
            <span>Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} records</span>
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

export default PaymentsExpensesPage;
