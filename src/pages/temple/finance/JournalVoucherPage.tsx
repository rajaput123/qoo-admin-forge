import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Download, ArrowDown, ArrowUp, ArrowLeftRight, ChevronsLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { NeftRtgsRemittanceForm } from "@/components/finance/NeftRtgsRemittanceForm";
import { VoucherPrintDialog } from "@/components/finance/VoucherPrintDialog";
import { defaultNeftRtgsTemplate, type NeftRtgsFormData } from "@/data/neftRtgsTemplateData";
import { isNeftRtgsMode, buildPaymentVoucherNeftForm, mergeNeftForm } from "@/lib/neftRtgsUtils";

interface Voucher {
  id: string;
  date: string;
  type: "Receipt" | "Payment" | "Contra" | "Refund";
  temple: string;
  accountHead: string;
  narration: string;
  amount: number;
  status: "Approved" | "Pending";
}

const PAGE_SIZE = 5;

const initialVouchers: Voucher[] = [
  {
    id: "JV-2026-F17C90",
    date: "2026-05-25",
    type: "Receipt",
    temple: "Sri Ganesha Temple",
    accountHead: "Cash",
    narration: "SDCFGVBHN shravani",
    amount: 788,
    status: "Approved",
  },
  {
    id: "JV-2026-DDB879",
    date: "2026-05-25",
    type: "Receipt",
    temple: "Sri Ganesha Temple",
    accountHead: "Cash",
    narration: "dfghbj nkmbhnjmk,lhjkil dcfvg",
    amount: 1000,
    status: "Approved",
  },
  {
    id: "JV-2026-C50BF9",
    date: "2026-05-25",
    type: "Payment",
    temple: "Sri Ganesha Temple",
    accountHead: "Office Supplies",
    narration: "dfghbj nkmbhnjmk,lhjkil",
    amount: 1000,
    status: "Approved",
  },
  {
    id: "JV-2026-AD8156",
    date: "2026-05-25",
    type: "Payment",
    temple: "Sri Ganesha Temple",
    accountHead: "Office Supplies",
    narration: "dfghbj nkmbhnjmk,lhjkil",
    amount: 1000,
    status: "Approved",
  },
];

const formatCurrency = (val: number) => `₹${val.toLocaleString("en-IN")}`;

const JournalVoucherPage = () => {
  const [vouchers, setVouchers] = useState<Voucher[]>(initialVouchers);
  const [filterType, setFilterType] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get("action") === "new") {
      setShowCreateDialog(true);
      const next = new URLSearchParams(searchParams);
      next.delete("action");
      setSearchParams(next, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  // Form states
  const [formType, setFormType] = useState<"Receipt" | "Payment" | "Contra" | "Refund">("Receipt");
  const [formDate, setFormDate] = useState(new Date().toISOString().slice(0, 10));
  const [formTemple, setFormTemple] = useState("Sri Ganesha Temple");
  const [formAccount, setFormAccount] = useState("");
  const [formDonorName, setFormDonorName] = useState("");
  const [formPanNumber, setFormPanNumber] = useState("");
  const [formMobile, setFormMobile] = useState("");
  const [formDonationCategory, setFormDonationCategory] = useState("Special Donation");
  const [formAmount, setFormAmount] = useState("");
  const [formPaymentMode, setFormPaymentMode] = useState("Cash");
  const [formUtrCheque, setFormUtrCheque] = useState("");
  const [form80G, setForm80G] = useState("No");
  const [formNarration, setFormNarration] = useState("");
  const [formApprovedBy, setFormApprovedBy] = useState("");
  const [formPurpose, setFormPurpose] = useState("");
  const [voucherPreviewOpen, setVoucherPreviewOpen] = useState(false);
  const [previewNeftForm, setPreviewNeftForm] = useState<NeftRtgsFormData | null>(null);

  const showNeftForm = isNeftRtgsMode(formPaymentMode);

  const handleOpenNeftPreview = () => {
    setPreviewNeftForm(
      buildPaymentVoucherNeftForm(
        formDonorName || formAccount || "Payee",
        formAmount,
        formNarration,
        formAccount
      )
    );
    setVoucherPreviewOpen(true);
  };

  const resetForm = () => {
    setFormType("Receipt");
    setFormDate(new Date().toISOString().slice(0, 10));
    setFormTemple("Sri Ganesha Temple");
    setFormAccount("");
    setFormDonorName("");
    setFormPanNumber("");
    setFormMobile("");
    setFormDonationCategory("Special Donation");
    setFormAmount("");
    setFormPaymentMode("Cash");
    setFormUtrCheque("");
    setForm80G("No");
    setFormNarration("");
    setFormApprovedBy("");
    setFormPurpose("");
    setPreviewNeftForm(null);
    setVoucherPreviewOpen(false);
  };

  const filtered = vouchers.filter((v) => {
    if (filterType === "receipt" && v.type !== "Receipt") return false;
    if (filterType === "payment" && v.type !== "Payment") return false;
    if (filterType === "contra" && v.type !== "Contra") return false;
    if (filterType === "refund" && v.type !== "Refund") return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const totalIncome = filtered
    .filter((v) => v.type === "Receipt")
    .reduce((sum, v) => sum + v.amount, 0);

  const totalExpense = filtered
    .filter((v) => v.type === "Payment")
    .reduce((sum, v) => sum + v.amount, 0);

  const balance = totalIncome - totalExpense;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formAmount || Number(formAmount) <= 0) {
      toast.error("Amount must be greater than zero");
      return;
    }
    if (!formNarration.trim()) {
      toast.error("Narration is required");
      return;
    }

    const newVoucher: Voucher = {
      id: `JV-2026-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      date: formDate,
      type: formType,
      temple: formTemple,
      accountHead: formAccount || "Cash",
      narration: formNarration,
      amount: Number(formAmount),
      status: "Approved",
    };

    setVouchers([newVoucher, ...vouchers]);
    setShowCreateDialog(false);
    resetForm();
    toast.success("Journal Voucher created successfully");
  };

  const handleExportCSV = () => {
    const csvContent = [
      "Voucher No,Date,Type,Temple,Account Head,Narration,Income,Expense,Status",
      ...filtered.map(
        (v) =>
          `${v.id},${v.date},${v.type},"${v.temple}","${v.accountHead}","${v.narration}",${
            v.type === "Receipt" ? v.amount : 0
          },${v.type === "Payment" ? v.amount : 0},${v.status}`
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `journal_vouchers_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Vouchers exported to CSV");
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Page toolbar — title/actions live in FinanceLayout topbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
        <div>
          <h2 className="text-lg font-bold text-foreground">Journal Voucher Entry</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Manage and record financial transactions</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={handleExportCSV}>
            <Download className="h-3.5 w-3.5" /> Export CSV
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={() => window.print()}>
            <Download className="h-3.5 w-3.5" /> Export PDF
          </Button>
        </div>
      </div>

      {/* Type filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="w-44">
          <Select value={filterType} onValueChange={(v) => { setFilterType(v); setPage(1); }}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="receipt">Receipts</SelectItem>
              <SelectItem value="payment">Payments</SelectItem>
              <SelectItem value="contra">Contra</SelectItem>
              <SelectItem value="refund">Refund</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Total Income
            </span>
            <p className="text-2xl font-bold text-green-700 mt-1">
              {formatCurrency(totalIncome)}
            </p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-4">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Total Expense
            </span>
            <p className="text-2xl font-bold text-red-600 mt-1">
              {formatCurrency(totalExpense)}
            </p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Balance (DR-CR)
            </span>
            <p className="text-2xl font-bold mt-1 text-foreground">
              {formatCurrency(balance)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Table wrapped in Card */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="text-xs font-bold uppercase text-muted-foreground">
                    Voucher No
                  </TableHead>
                  <TableHead className="text-xs font-bold uppercase text-muted-foreground">
                    Date
                  </TableHead>
                  <TableHead className="text-xs font-bold uppercase text-muted-foreground">
                    Type
                  </TableHead>
                  <TableHead className="text-xs font-bold uppercase text-muted-foreground">
                    Temple
                  </TableHead>
                  <TableHead className="text-xs font-bold uppercase text-muted-foreground">
                    Account Head
                  </TableHead>
                  <TableHead className="text-xs font-bold uppercase text-muted-foreground">
                    Narration
                  </TableHead>
                  <TableHead className="text-xs font-bold uppercase text-muted-foreground text-right">
                    Income (₹)
                  </TableHead>
                  <TableHead className="text-xs font-bold uppercase text-muted-foreground text-right">
                    Expense (₹)
                  </TableHead>
                  <TableHead className="text-xs font-bold uppercase text-muted-foreground">
                    Status
                  </TableHead>
                  <TableHead className="text-xs font-bold uppercase text-muted-foreground text-center">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                      No vouchers found
                    </TableCell>
                  </TableRow>
                ) : (
                  paginated.map((v) => (
                    <TableRow key={v.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell>
                        <button
                          onClick={() => setSelectedVoucher(v)}
                          className="text-xs font-semibold text-primary hover:underline"
                        >
                          {v.id}
                        </button>
                      </TableCell>
                      <TableCell className="text-xs whitespace-nowrap text-foreground/80">
                        {v.date}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={cn(
                            "text-[10px] font-semibold px-2 py-0.5",
                            v.type === "Receipt"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : v.type === "Payment"
                              ? "bg-red-50 text-red-700 border-red-200"
                              : v.type === "Contra"
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : "bg-amber-50 text-amber-700 border-amber-200"
                          )}
                          variant="outline"
                        >
                          {v.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs font-medium text-foreground/85">
                        {v.temple}
                      </TableCell>
                      <TableCell className="text-xs text-foreground/75">
                        {v.accountHead}
                      </TableCell>
                      <TableCell className="text-xs max-w-[180px] truncate text-foreground/70" title={v.narration}>
                        {v.narration}
                      </TableCell>
                      <TableCell className="text-xs text-right font-semibold text-emerald-600">
                        {v.type === "Receipt" || v.type === "Contra" ? formatCurrency(v.amount) : "—"}
                      </TableCell>
                      <TableCell className="text-xs text-right font-semibold text-red-500">
                        {v.type === "Payment" || v.type === "Refund" || v.type === "Contra" ? formatCurrency(v.amount) : "—"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] font-semibold"
                          variant="outline"
                        >
                          {v.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted"
                          onClick={() => setSelectedVoucher(v)}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between pt-4 mt-2 border-t text-xs text-muted-foreground">
            <span>Showing {filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} records</span>
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

      {/* View Details Dialog */}
      <Dialog open={selectedVoucher !== null} onOpenChange={(open) => !open && setSelectedVoucher(null)}>
        {selectedVoucher && (
          <DialogContent className="max-w-md bg-white border">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-foreground">
                Journal Voucher Details
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground text-xs block uppercase tracking-wider font-semibold">Voucher No</span>
                  <span className="font-mono text-primary font-bold">{selectedVoucher.id}</span>
                </div>
                <div>
                  <span className="text-muted-foreground text-xs block uppercase tracking-wider font-semibold">Date</span>
                  <span className="font-semibold text-foreground">{selectedVoucher.date}</span>
                </div>
                <div>
                  <span className="text-muted-foreground text-xs block uppercase tracking-wider font-semibold">Type</span>
                  <Badge
                    className={cn(
                      "mt-0.5 text-[10px]",
                      selectedVoucher.type === "Receipt"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : selectedVoucher.type === "Payment"
                        ? "bg-red-50 text-red-700 border-red-200"
                        : selectedVoucher.type === "Contra"
                        ? "bg-blue-50 text-blue-700 border-blue-200"
                        : "bg-amber-50 text-amber-700 border-amber-200"
                    )}
                    variant="outline"
                  >
                    {selectedVoucher.type}
                  </Badge>
                </div>
                <div>
                  <span className="text-muted-foreground text-xs block uppercase tracking-wider font-semibold">Status</span>
                  <Badge
                    className="mt-0.5 bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]"
                    variant="outline"
                  >
                    {selectedVoucher.status}
                  </Badge>
                </div>
                <div>
                  <span className="text-muted-foreground text-xs block uppercase tracking-wider font-semibold">Temple</span>
                  <span className="font-semibold text-foreground">{selectedVoucher.temple}</span>
                </div>
                <div>
                  <span className="text-muted-foreground text-xs block uppercase tracking-wider font-semibold">Account Head</span>
                  <span className="font-semibold text-foreground">{selectedVoucher.accountHead}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-muted-foreground text-xs block uppercase tracking-wider font-semibold">Amount</span>
                  <span
                    className={cn(
                      "text-xl font-bold",
                      selectedVoucher.type === "Receipt" || selectedVoucher.type === "Contra" ? "text-emerald-600" : "text-red-500"
                    )}
                  >
                    {formatCurrency(selectedVoucher.amount)}
                  </span>
                </div>
                <div className="col-span-2 border-t pt-3 mt-1">
                  <span className="text-muted-foreground text-xs block uppercase tracking-wider font-semibold">Narration</span>
                  <p className="text-sm text-foreground/80 mt-1 whitespace-pre-line bg-muted/30 p-2.5 rounded-lg border border-border/50">
                    {selectedVoucher.narration}
                  </p>
                </div>
              </div>
            </div>
            <DialogFooter className="border-t pt-3">
              <Button variant="outline" size="sm" onClick={() => setSelectedVoucher(null)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      {/* Create New Voucher Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={(open) => {
        if (!open) {
          setShowCreateDialog(false);
          resetForm();
        } else {
          setShowCreateDialog(true);
        }
      }}>
        <DialogContent className="max-w-2xl bg-white border">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-foreground">
              New Journal Voucher
            </DialogTitle>
            <p className="text-xs text-muted-foreground">
              All entries follow double-entry bookkeeping standard
            </p>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4 pt-2">
            {/* Scrollable Form Body */}
            <div className="max-h-[60vh] overflow-y-auto pr-3 space-y-5 py-2">
              {/* Row 1: Voucher Type & Date */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-3 space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Voucher Type *</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {/* Receipt Card */}
                    <button
                      type="button"
                      onClick={() => setFormType("Receipt")}
                      className={cn(
                        "flex flex-col items-center justify-center p-3 rounded-lg border text-center transition-all h-20",
                        formType === "Receipt"
                          ? "border-[#7a3411] bg-[#7a3411]/5 text-[#7a3411] shadow-sm"
                          : "border-gray-200 bg-white hover:bg-gray-50 text-gray-700"
                      )}
                    >
                      <ArrowDown className="h-4 w-4 mb-1" />
                      <span className="text-xs font-bold block">Receipt</span>
                      <span className="text-[9px] opacity-85 block font-medium">Money in</span>
                    </button>

                    {/* Payment Card */}
                    <button
                      type="button"
                      onClick={() => setFormType("Payment")}
                      className={cn(
                        "flex flex-col items-center justify-center p-3 rounded-lg border text-center transition-all h-20",
                        formType === "Payment"
                          ? "border-[#7a3411] bg-[#7a3411]/5 text-[#7a3411] shadow-sm"
                          : "border-gray-200 bg-white hover:bg-gray-50 text-gray-700"
                      )}
                    >
                      <ArrowUp className="h-4 w-4 mb-1" />
                      <span className="text-xs font-bold block">Payment</span>
                      <span className="text-[9px] opacity-85 block font-medium">Money out</span>
                    </button>

                    {/* Contra Card */}
                    <button
                      type="button"
                      onClick={() => setFormType("Contra")}
                      className={cn(
                        "flex flex-col items-center justify-center p-3 rounded-lg border text-center transition-all h-20",
                        formType === "Contra"
                          ? "border-[#7a3411] bg-[#7a3411]/5 text-[#7a3411] shadow-sm"
                          : "border-gray-200 bg-white hover:bg-gray-50 text-gray-700"
                      )}
                    >
                      <ArrowLeftRight className="h-4 w-4 mb-1" />
                      <span className="text-xs font-bold block">Contra</span>
                      <span className="text-[9px] opacity-85 block font-medium">Money movement</span>
                    </button>

                    {/* Refund Card */}
                    <button
                      type="button"
                      onClick={() => setFormType("Refund")}
                      className={cn(
                        "flex flex-col items-center justify-center p-3 rounded-lg border text-center transition-all h-20",
                        formType === "Refund"
                          ? "border-[#7a3411] bg-[#7a3411]/5 text-[#7a3411] shadow-sm"
                          : "border-gray-200 bg-white hover:bg-gray-50 text-gray-700"
                      )}
                    >
                      <ChevronsLeft className="h-4 w-4 mb-1" />
                      <span className="text-xs font-bold block">Refund</span>
                      <span className="text-[9px] opacity-85 block font-medium">Refund issued</span>
                    </button>
                  </div>
                </div>
                <div className="md:col-span-1 space-y-2">
                  <Label htmlFor="formDate" className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Date *</Label>
                  <Input
                    id="formDate"
                    type="date"
                    className="h-20 text-center text-xs font-semibold cursor-pointer border-gray-200 bg-white"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Row 2: Temple & Account Head */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="formTemple" className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Temple *</Label>
                  <Select value={formTemple} onValueChange={setFormTemple}>
                    <SelectTrigger id="formTemple" className="h-10 text-xs">
                      <SelectValue placeholder="Select Temple" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sri Ganesha Temple">Sri Ganesha Temple</SelectItem>
                      <SelectItem value="Sri Shiva Temple">Sri Shiva Temple</SelectItem>
                      <SelectItem value="Sri Hanuman Temple">Sri Hanuman Temple</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="formAccount" className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Account Head *</Label>
                  <Select value={formAccount} onValueChange={setFormAccount}>
                    <SelectTrigger id="formAccount" className="h-10 text-xs">
                      <SelectValue placeholder="— Select account head —" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cash">Cash</SelectItem>
                      <SelectItem value="Bank Account">Bank Account</SelectItem>
                      <SelectItem value="Office Supplies">Office Supplies</SelectItem>
                      <SelectItem value="Maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Centered Line Divider: Donor Details */}
              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="flex-shrink mx-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">Donor Details</span>
                <div className="flex-grow border-t border-gray-200"></div>
              </div>

              {/* Row 3: Donor Name, PAN Number & Mobile */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="formDonorName" className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Donor Name</Label>
                  <Input
                    id="formDonorName"
                    placeholder="Full name or 'Anonymous'"
                    className="h-10 text-xs"
                    value={formDonorName}
                    onChange={(e) => setFormDonorName(e.target.value.slice(0, 50))}
                  />
                  <div className="text-[9px] text-muted-foreground/80 text-right">{formDonorName.length}/50 characters</div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="formPanNumber" className="text-[10px] font-bold uppercase tracking-wider text-gray-500">PAN Number</Label>
                  <Input
                    id="formPanNumber"
                    placeholder="ABCDE1234F"
                    className="h-10 text-xs font-mono uppercase"
                    value={formPanNumber}
                    onChange={(e) => setFormPanNumber(e.target.value.slice(0, 10))}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="formMobile" className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Mobile</Label>
                  <Input
                    id="formMobile"
                    placeholder="10-digit"
                    className="h-10 text-xs"
                    value={formMobile}
                    onChange={(e) => setFormMobile(e.target.value.slice(0, 10))}
                  />
                </div>
              </div>

              {/* Row 4: Donation Category, Amount (₹) & Payment Mode */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="formDonationCategory" className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Donation Category *</Label>
                  <Select value={formDonationCategory} onValueChange={setFormDonationCategory}>
                    <SelectTrigger id="formDonationCategory" className="h-10 text-xs">
                      <SelectValue placeholder="Special Donation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Special Donation">Special Donation</SelectItem>
                      <SelectItem value="General Donation">General Donation</SelectItem>
                      <SelectItem value="Annadanam">Annadanam</SelectItem>
                      <SelectItem value="Temple Construction">Temple Construction</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="formAmount" className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Amount (₹) *</Label>
                  <Input
                    id="formAmount"
                    type="number"
                    placeholder="0.00"
                    className="h-10 text-xs font-semibold"
                    value={formAmount}
                    onChange={(e) => setFormAmount(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="formPaymentMode" className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Payment Mode</Label>
                  <Select value={formPaymentMode} onValueChange={setFormPaymentMode}>
                    <SelectTrigger id="formPaymentMode" className="h-10 text-xs">
                      <SelectValue placeholder="Cash" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cash">Cash</SelectItem>
                      <SelectItem value="NEFT">NEFT</SelectItem>
                      <SelectItem value="RTGS">RTGS</SelectItem>
                      <SelectItem value="UPI / Bank Transfer">UPI / Bank Transfer</SelectItem>
                      <SelectItem value="Cheque">Cheque</SelectItem>
                      <SelectItem value="Card">Card</SelectItem>
                    </SelectContent>
                  </Select>
                  {showNeftForm && (
                    <button
                      type="button"
                      onClick={handleOpenNeftPreview}
                      className="text-[11px] text-[#7a3411] hover:text-[#63290d] hover:underline underline-offset-2 font-medium"
                    >
                      Preview bank remittance form →
                    </button>
                  )}
                </div>
              </div>

              {/* Row 5: UTR / Cheque No & 80G Certificate */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="formUtrCheque" className="text-[10px] font-bold uppercase tracking-wider text-gray-500">UTR / Cheque No</Label>
                  <Input
                    id="formUtrCheque"
                    placeholder="E.g. UTR4827384 (12-30 CHARS)"
                    className="h-10 text-xs font-mono uppercase"
                    value={formUtrCheque}
                    onChange={(e) => setFormUtrCheque(e.target.value.slice(0, 30))}
                  />
                  <div className="text-[9px] text-muted-foreground/80 text-right">{formUtrCheque.length}/30 characters (A-Z, 0-9, min 12 if entered)</div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="form80G" className="text-[10px] font-bold uppercase tracking-wider text-gray-500">80G Certificate</Label>
                  <Select value={form80G} onValueChange={setForm80G}>
                    <SelectTrigger id="form80G" className="h-10 text-xs">
                      <SelectValue placeholder="No" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="No">No</SelectItem>
                      <SelectItem value="Yes">Yes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Row 6: Narration */}
              <div className="space-y-1.5">
                <Label htmlFor="formNarration" className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Narration *</Label>
                <Textarea
                  id="formNarration"
                  placeholder="e.g. Being hundi collection for 02-Apr-2026 at Shri Venkateswara Temple, Tirupati"
                  className="text-xs"
                  rows={3}
                  value={formNarration}
                  onChange={(e) => setFormNarration(e.target.value.slice(0, 100))}
                  required
                />
                <div className="text-[9px] text-muted-foreground/80 text-right">{formNarration.length}/100 characters — appears in ledger and audit trail.</div>
              </div>

              {/* Row 7: Approved By & Purpose / Occasion */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="formApprovedBy" className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Approved By</Label>
                  <Select value={formApprovedBy} onValueChange={setFormApprovedBy}>
                    <SelectTrigger id="formApprovedBy" className="h-10 text-xs">
                      <SelectValue placeholder="— Select Approver —" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Shashank (SuperAdmin)">Shashank (SuperAdmin)</SelectItem>
                      <SelectItem value="Temple Trustee">Temple Trustee</SelectItem>
                      <SelectItem value="Chief Treasurer">Chief Treasurer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="formPurpose" className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Purpose / Occasion</Label>
                  <Input
                    id="formPurpose"
                    placeholder="e.g. Brahmotsavam 2026, Birthday seva"
                    className="h-10 text-xs"
                    value={formPurpose}
                    onChange={(e) => setFormPurpose(e.target.value)}
                  />
                </div>
              </div>

              {/* Voucher Preview Section — ledger Dr/Cr (screen only) */}
              <div className="bg-amber-50/50 border border-dashed border-amber-200 p-4 rounded-lg space-y-2 print:hidden">
                <h3 className="text-[10px] font-bold uppercase tracking-wider text-amber-800/80">Voucher Preview</h3>
                <div className="text-xs space-y-1 font-mono">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Dr.</span>
                    <div className="flex justify-between w-[80%]">
                      <span className="text-foreground">{formAccount || "— Select account head —"}</span>
                      <span className="text-emerald-600 font-bold">₹{formAmount ? Number(formAmount).toLocaleString("en-IN") : "0"}</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cr.</span>
                    <div className="flex justify-between w-[80%]">
                      <span className="text-foreground">{formPaymentMode || "Cash"}</span>
                      <span className="text-red-500 font-bold">₹{formAmount ? Number(formAmount).toLocaleString("en-IN") : "0"}</span>
                    </div>
                  </div>
                  <div className="border-t border-amber-200/50 my-1 pt-1 flex justify-between">
                    <span className="text-muted-foreground">Narration:</span>
                    <span className="text-foreground/80 w-[80%] truncate text-left">{formNarration || "—"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Dialog Footer Actions */}
            <DialogFooter className="border-t pt-4 mt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => {
                setShowCreateDialog(false);
                resetForm();
              }}>
                Cancel
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => {
                toast.info("Voucher saved as Draft");
                setShowCreateDialog(false);
                resetForm();
              }}>
                Save as Draft
              </Button>
              <Button type="submit" size="sm" className="bg-[#7a3411] hover:bg-[#63290d] text-white">
                Post Voucher
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <VoucherPrintDialog
        open={voucherPreviewOpen}
        onOpenChange={setVoucherPreviewOpen}
        title={`${formPaymentMode} — Bank Remittance Preview`}
      >
        {previewNeftForm && (
          <NeftRtgsRemittanceForm
            template={defaultNeftRtgsTemplate}
            data={previewNeftForm}
            onChange={(patch) => setPreviewNeftForm((prev) => (prev ? mergeNeftForm(prev, patch) : prev))}
          />
        )}
      </VoucherPrintDialog>
    </motion.div>
  );
};

export default JournalVoucherPage;
