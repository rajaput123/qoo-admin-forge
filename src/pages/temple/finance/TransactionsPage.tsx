import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format, startOfDay, startOfWeek, startOfMonth, startOfYear, subMonths, subYears, isAfter, isBefore, parseISO } from "date-fns";
import {
  ArrowUpRight, ArrowDownRight, ArrowRightLeft, Search, Plus, Eye,
  RotateCcw, CreditCard, AlertCircle, XCircle, IndianRupee, Download, RefreshCw, CalendarIcon, X,
  Paperclip, FileText, ImageIcon, Trash2
} from "lucide-react";
import { toast } from "sonner";
import { financeSelectors, financeActions } from "@/modules/finance/financeStore";
import { financeIntegration } from "@/modules/finance/integration";
import type { FinTransaction, TransactionType, TransactionStatus, PaymentMethod, PaymentStatus, TransactionAttachment } from "@/modules/finance/types";
import { useSearchParams } from "react-router-dom";
import { exportToCSV } from "@/utils/exportCSV";

const formatCurrency = (val: number) => `₹${val.toLocaleString("en-IN")}`;

const typeIcons: Record<TransactionType, React.ReactNode> = {
  Income: <ArrowUpRight className="h-4 w-4 text-emerald-600" />,
  Expense: <ArrowDownRight className="h-4 w-4 text-red-600" />,
  Transfer: <ArrowRightLeft className="h-4 w-4 text-blue-600" />,
};

const statusColor: Record<TransactionStatus, string> = {
  Pending: "bg-amber-50 text-amber-700 border-amber-200",
  Completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Failed: "bg-red-50 text-red-700 border-red-200",
};

const payStatusColor: Record<string, string> = {
  Unpaid: "bg-red-50 text-red-700 border-red-200",
  "Partially Paid": "bg-amber-50 text-amber-700 border-amber-200",
  Paid: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

const TransactionsPage = () => {
  const [, setTick] = useState(0);
  const refresh = () => setTick(t => t + 1);
  const [searchParams, setSearchParams] = useSearchParams();

  // Auto-sync donations on load
  useEffect(() => {
    try {
      const count = financeIntegration.syncAll();
      if (count > 0) {
        toast.success(`Synced ${count} record(s) from Donations, Seva, Events & Projects`);
        refresh();
      }
    } catch {
      // Silent fail
    }
  }, []);

  // Open create dialog from URL param (?action=new)
  useEffect(() => {
    if (searchParams.get("action") === "new") {
      setShowCreate(true);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams]);

  const transactions = financeSelectors.getTransactions();
  const accounts = financeSelectors.getAccounts();
  const assetAccounts = accounts.filter(a => a.type === "Asset");
  const categories = financeSelectors.getCategories();
  const funds = financeSelectors.getFunds();
  const summary = financeSelectors.getSummary();

  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [datePreset, setDatePreset] = useState("all");
  const [customFrom, setCustomFrom] = useState<Date | undefined>();
  const [customTo, setCustomTo] = useState<Date | undefined>();

  const getDateRange = (): { from: Date | null; to: Date | null } => {
    const now = new Date();
    switch (datePreset) {
      case "today": return { from: startOfDay(now), to: now };
      case "this-year": return { from: startOfYear(now), to: now };
      case "custom": return { from: customFrom || null, to: customTo || null };
      default: return { from: null, to: null };
    }
  };

  // Detail
  const [selected, setSelected] = useState<FinTransaction | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  // Create dialog
  const [showCreate, setShowCreate] = useState(false);
  const [formType, setFormType] = useState<TransactionType>("Income");
  const [formAmount, setFormAmount] = useState("");
  const [formDate, setFormDate] = useState(new Date().toISOString().slice(0, 10));
  const [formCategory, setFormCategory] = useState("");
  const [formSubCategory, setFormSubCategory] = useState("");
  const [formMethod, setFormMethod] = useState<PaymentMethod>("Cash");
  const [formAccount, setFormAccount] = useState(assetAccounts[0]?.id || "");
  const [formDestAccount, setFormDestAccount] = useState(assetAccounts[1]?.id || "");
  const [formFund, setFormFund] = useState(funds[0]?.id || "");
  const [formDescription, setFormDescription] = useState("");
  const [formNotes, setFormNotes] = useState("");
  const [formExtRef, setFormExtRef] = useState("");
  const [formStatus, setFormStatus] = useState<TransactionStatus>("Completed");
  const [formAttachments, setFormAttachments] = useState<TransactionAttachment[]>([]);
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const handleFileAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach(file => {
      const url = URL.createObjectURL(file);
      setFormAttachments(prev => [...prev, {
        id: `ATT-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        name: file.name,
        type: file.type,
        size: file.size,
        url,
        uploadedAt: new Date().toISOString(),
      }]);
    });
    e.target.value = "";
  };

  const removeAttachment = (attId: string) => {
    setFormAttachments(prev => prev.filter(a => a.id !== attId));
  };

  // Payment dialog
  const [showPayment, setShowPayment] = useState(false);
  const [payTxnId, setPayTxnId] = useState("");
  const [payAmount, setPayAmount] = useState("");
  const [payMethod, setPayMethod] = useState<PaymentMethod>("Cash");
  const [payRef, setPayRef] = useState("");

  const allCategories = useMemo(() => {
    const cats = new Set<string>();
    transactions.forEach(t => cats.add(t.category));
    return Array.from(cats).sort();
  }, [transactions.length]);

  const allSources = useMemo(() => {
    const sources = new Set<string>();
    transactions.forEach(t => sources.add(t.source));
    return Array.from(sources).sort();
  }, [transactions.length]);

  const filtered = useMemo(() => {
    const dateRange = getDateRange();
    return transactions.filter(t => {
      if (activeTab === "income" && t.type !== "Income") return false;
      if (activeTab === "expense" && t.type !== "Expense") return false;
      if (activeTab === "transfer" && t.type !== "Transfer") return false;
      if (statusFilter !== "all" && t.status !== statusFilter) return false;
      if (categoryFilter !== "all" && t.category !== categoryFilter) return false;
      if (sourceFilter !== "all" && t.source !== sourceFilter) return false;
      // Date filter
      if (dateRange.from || dateRange.to) {
        const txnDate = parseISO(t.date);
        if (dateRange.from && isBefore(txnDate, dateRange.from)) return false;
        if (dateRange.to && isAfter(txnDate, dateRange.to)) return false;
      }
      if (searchTerm) {
        const s = searchTerm.toLowerCase();
        return t.id.toLowerCase().includes(s) || t.description.toLowerCase().includes(s) ||
          t.category.toLowerCase().includes(s) || t.referenceId.toLowerCase().includes(s);
      }
      return true;
    });
  }, [activeTab, statusFilter, categoryFilter, sourceFilter, searchTerm, datePreset, customFrom, customTo, transactions.length]);

  const getCategoriesForType = (type: TransactionType) => {
    return categories.filter(c => {
      if (type === "Income") return c.type === "Income";
      if (type === "Expense") return c.type === "Expense";
      return true;
    });
  };

  const handleCreate = () => {
    if (!formAmount || Number(formAmount) <= 0) { toast.error("Amount must be greater than zero"); return; }
    if (!formCategory) { toast.error("Category is required"); return; }
    if (!formDescription.trim()) { toast.error("Description is required"); return; }
    if (!formAccount) { toast.error("Account is required"); return; }
    if (formType === "Transfer" && formAccount === formDestAccount) { toast.error("Source and destination accounts must be different"); return; }

    const acc = accounts.find(a => a.id === formAccount);
    const destAcc = formType === "Transfer" ? accounts.find(a => a.id === formDestAccount) : undefined;
    const fund = funds.find(f => f.id === formFund);

    financeActions.createTransaction({
      type: formType,
      amount: Number(formAmount),
      date: formDate,
      category: formCategory,
      subCategory: formSubCategory,
      paymentMethod: formMethod,
      account: formAccount,
      accountName: acc?.name || "",
      destinationAccount: formType === "Transfer" ? formDestAccount : undefined,
      destinationAccountName: destAcc?.name,
      fund: formFund,
      fundName: fund?.name || "General Fund",
      externalReference: formExtRef,
      status: formStatus,
      description: formDescription,
      notes: formNotes,
      createdBy: "Admin",
      source: "Manual",
      attachments: formAttachments,
    });

    toast.success("Transaction created");
    setShowCreate(false);
    resetForm();
    refresh();
  };

  const handleRecordPayment = () => {
    if (!payAmount || Number(payAmount) <= 0) { toast.error("Enter valid amount"); return; }
    if (financeActions.recordPayment(payTxnId, Number(payAmount), payMethod, payRef)) {
      toast.success("Payment recorded");
      setShowPayment(false);
      setPayTxnId(""); setPayAmount(""); setPayRef("");
      refresh();
    } else {
      toast.error("Payment failed. Check amount doesn't exceed remaining balance.");
    }
  };

  const handleReverse = (txnId: string) => {
    const rev = financeActions.reverseTransaction(txnId, "Admin");
    if (rev) {
      toast.success(`Reversal ${rev.id} created for ${txnId}`);
      setSheetOpen(false);
      refresh();
    } else {
      toast.error("Cannot reverse. Transaction must be Completed and not already reversed.");
    }
  };

  const handleMarkFailed = (txnId: string) => {
    if (financeActions.markFailed(txnId)) {
      toast.success(`Transaction ${txnId} marked as Failed`);
      setSheetOpen(false);
      refresh();
    }
  };

  const handleSync = () => {
    try {
      const count = financeIntegration.syncAll();
      if (count > 0) {
        toast.success(`Synced ${count} new record(s) from all modules`);
        refresh();
      } else {
        toast.info("All records already synced");
      }
    } catch {
      toast.error("Sync failed");
    }
  };

  const resetForm = () => {
    setFormType("Income"); setFormAmount(""); setFormDate(new Date().toISOString().slice(0, 10));
    setFormCategory(""); setFormSubCategory(""); setFormMethod("Cash");
    setFormAccount(assetAccounts[0]?.id || ""); setFormDestAccount(assetAccounts[1]?.id || "");
    setFormFund(funds[0]?.id || ""); setFormDescription(""); setFormNotes(""); setFormExtRef("");
    setFormStatus("Completed");
    setFormAttachments([]);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Transactions</h1>
          <p className="text-muted-foreground text-sm">All financial movements — income, expenses, and transfers</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleSync}><RefreshCw className="h-4 w-4 mr-1" /> Sync</Button>
          <Button variant="outline" size="sm" onClick={() => {
            exportToCSV("transactions", 
              ["ID", "Date", "Type", "Description", "Category", "Source", "Amount", "Account", "Status", "Payment Status", "Fund"],
              filtered.map(t => [t.id, t.date, t.type, t.description, t.category, t.source, String(t.amount), t.accountName, t.status, t.paymentStatus, t.fundName])
            );
            toast.success(`Exported ${filtered.length} transactions`);
          }}><Download className="h-4 w-4 mr-1" /> Export</Button>
          <Button size="sm" onClick={() => setShowCreate(true)}><Plus className="h-4 w-4 mr-1" /> New Transaction</Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Card><CardContent className="p-4">
          <div className="flex items-center gap-2 mb-1">
            <ArrowUpRight className="h-4 w-4 text-emerald-600" />
            <span className="text-xs text-muted-foreground">Income</span>
          </div>
          <div className="text-xl font-bold text-emerald-600">{formatCurrency(summary.totalIncome)}</div>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <div className="flex items-center gap-2 mb-1">
            <ArrowDownRight className="h-4 w-4 text-red-600" />
            <span className="text-xs text-muted-foreground">Expenses</span>
          </div>
          <div className="text-xl font-bold text-red-600">{formatCurrency(summary.totalExpense)}</div>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <div className="flex items-center gap-2 mb-1">
            <ArrowRightLeft className="h-4 w-4 text-blue-600" />
            <span className="text-xs text-muted-foreground">Transfers</span>
          </div>
          <div className="text-xl font-bold text-blue-600">{formatCurrency(summary.totalTransfers)}</div>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <div className="flex items-center gap-2 mb-1">
            <IndianRupee className="h-4 w-4 text-foreground" />
            <span className="text-xs text-muted-foreground">Net</span>
          </div>
          <div className="text-xl font-bold">{formatCurrency(summary.netBalance)}</div>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <div className="flex items-center gap-2 mb-1">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <span className="text-xs text-muted-foreground">Pending</span>
          </div>
          <div className="text-xl font-bold text-amber-600">{summary.pending}</div>
        </CardContent></Card>
      </div>

      {/* Type Tabs + Filters */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center gap-3">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All ({transactions.length})</TabsTrigger>
            <TabsTrigger value="income">Income</TabsTrigger>
            <TabsTrigger value="expense">Expense</TabsTrigger>
            <TabsTrigger value="transfer">Transfer</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex gap-2 flex-wrap flex-1">
          <div className="relative w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-9 h-9" />
          </div>
          <Select value={datePreset} onValueChange={v => { setDatePreset(v); if (v !== "custom") { setCustomFrom(undefined); setCustomTo(undefined); } }}>
            <SelectTrigger className="w-40 h-9"><CalendarIcon className="h-3.5 w-3.5 mr-1 text-muted-foreground" /><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="this-year">This Year</SelectItem>
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
                  <Calendar mode="single" selected={customFrom} onSelect={setCustomFrom} initialFocus className={cn("p-3 pointer-events-auto")} />
                </PopoverContent>
              </Popover>
              <span className="text-xs text-muted-foreground">→</span>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className={cn("h-9 text-xs", !customTo && "text-muted-foreground")}>
                    {customTo ? format(customTo, "dd MMM yyyy") : "To"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={customTo} onSelect={setCustomTo} initialFocus className={cn("p-3 pointer-events-auto")} />
                </PopoverContent>
              </Popover>
            </div>
          )}
          {datePreset !== "all" && (
            <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => { setDatePreset("all"); setCustomFrom(undefined); setCustomTo(undefined); }}>
              <X className="h-3.5 w-3.5" />
            </Button>
          )}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32 h-9"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Failed">Failed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-36 h-9"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {allCategories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={sourceFilter} onValueChange={setSourceFilter}>
            <SelectTrigger className="w-32 h-9"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              {allSources.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">ID</TableHead>
                <TableHead className="text-xs">Date</TableHead>
                <TableHead className="text-xs">Type</TableHead>
                <TableHead className="text-xs">Description</TableHead>
                <TableHead className="text-xs">Category</TableHead>
                <TableHead className="text-xs">Source</TableHead>
                <TableHead className="text-xs text-right">Amount</TableHead>
                <TableHead className="text-xs">Account</TableHead>
                <TableHead className="text-xs">Status</TableHead>
                <TableHead className="text-xs">Payment</TableHead>
                <TableHead className="text-xs text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow><TableCell colSpan={11} className="text-center py-8 text-muted-foreground">No transactions found</TableCell></TableRow>
              ) : filtered.map(t => (
                <TableRow key={t.id} className={`cursor-pointer hover:bg-muted/50 ${t.reversalOfId ? "opacity-60" : ""}`}
                  onClick={() => { setSelected(t); setSheetOpen(true); }}>
                  <TableCell className="text-xs font-medium">{t.id}</TableCell>
                  <TableCell className="text-xs whitespace-nowrap">{t.date}</TableCell>
                  <TableCell className="text-xs">{typeIcons[t.type]}</TableCell>
                  <TableCell className="text-xs max-w-[200px] truncate">{t.description}</TableCell>
                  <TableCell className="text-xs">{t.category}</TableCell>
                  <TableCell><Badge variant="outline" className="text-[10px]">{t.source}</Badge></TableCell>
                  <TableCell className={`text-xs text-right font-medium ${t.type === "Income" ? "text-emerald-600" : t.type === "Expense" ? "text-red-600" : "text-blue-600"}`}>
                    {t.type === "Income" ? "+" : t.type === "Expense" ? "−" : "↔"} {formatCurrency(t.amount)}
                  </TableCell>
                  <TableCell className="text-xs">{t.accountName}{t.destinationAccountName ? ` → ${t.destinationAccountName}` : ""}</TableCell>
                  <TableCell><Badge variant="outline" className={`text-[10px] ${statusColor[t.status]}`}>{t.status}</Badge></TableCell>
                  <TableCell><Badge variant="outline" className={`text-[10px] ${payStatusColor[t.paymentStatus]}`}>{t.paymentStatus}</Badge></TableCell>
                  <TableCell className="text-center">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={e => { e.stopPropagation(); setSelected(t); setSheetOpen(true); }}>
                      <Eye className="h-3.5 w-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Detail Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="sm:max-w-lg overflow-y-auto">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  {typeIcons[selected.type]} {selected.id}
                  <Badge variant="outline" className={`text-[10px] ${statusColor[selected.status]}`}>{selected.status}</Badge>
                </SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-muted-foreground">Type:</span> <span className="font-medium">{selected.type}</span></div>
                  <div><span className="text-muted-foreground">Category:</span> <span className="font-medium">{selected.category}</span></div>
                  <div><span className="text-muted-foreground">Amount:</span> <span className="font-medium">{formatCurrency(selected.amount)}</span></div>
                  <div><span className="text-muted-foreground">Paid:</span> <span className="font-medium">{formatCurrency(selected.paidAmount)}</span></div>
                  <div><span className="text-muted-foreground">Account:</span> <span className="font-medium">{selected.accountName}</span></div>
                  {selected.destinationAccountName && <div><span className="text-muted-foreground">To:</span> <span className="font-medium">{selected.destinationAccountName}</span></div>}
                  <div><span className="text-muted-foreground">Method:</span> <span className="font-medium">{selected.paymentMethod}</span></div>
                  <div><span className="text-muted-foreground">Date:</span> <span className="font-medium">{selected.date}</span></div>
                  <div><span className="text-muted-foreground">Source:</span> <Badge variant="outline" className="text-[10px]">{selected.source}</Badge></div>
                  <div><span className="text-muted-foreground">Fund:</span> <span className="font-medium">{selected.fundName}</span></div>
                  <div><span className="text-muted-foreground">Created By:</span> <span className="font-medium">{selected.createdBy}</span></div>
                </div>

                <p className="text-sm">{selected.description}</p>
                {selected.notes && <p className="text-sm text-muted-foreground bg-muted/50 p-2 rounded">{selected.notes}</p>}

                {/* References */}
                {(selected.referenceId || selected.externalReference) && (
                  <div className="border-t pt-3">
                    <h4 className="text-sm font-medium mb-2">References</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {selected.referenceId && <div>📋 Ref: <span className="font-medium">{selected.referenceId}</span></div>}
                      {selected.referenceType && <div>📌 Type: <span className="font-medium">{selected.referenceType}</span></div>}
                      {selected.externalReference && <div>🔗 Ext Ref: <span className="font-medium">{selected.externalReference}</span></div>}
                    </div>
                  </div>
                )}

                {/* Payment history */}
                {selected.payments.length > 0 && (
                  <div className="border-t pt-3">
                    <h4 className="text-sm font-medium mb-2">Payment History ({selected.payments.length})</h4>
                    <div className="space-y-2">
                      {selected.payments.map(p => (
                        <div key={p.id} className="flex items-center justify-between text-xs bg-muted/50 rounded p-2">
                          <div>
                            <span className="font-medium">{p.id}</span> • {p.method} • {p.date}
                            {p.referenceNumber && <span className="text-muted-foreground"> • Ref: {p.referenceNumber}</span>}
                          </div>
                          <span className="font-medium">{formatCurrency(p.amount)}</span>
                        </div>
                      ))}
                    </div>
                    {selected.paymentStatus !== "Paid" && (
                      <p className="text-xs text-amber-600 mt-2">
                        Remaining: {formatCurrency(selected.amount - selected.paidAmount)}
                      </p>
                    )}
                  </div>
                )}

                {/* Reversal info */}
                {selected.reversalOfId && (
                  <div className="bg-amber-50 border border-amber-200 rounded p-2 text-xs text-amber-700">
                    ↩️ This is a reversal of <span className="font-medium">{selected.reversalOfId}</span>
                  </div>
                )}
                {selected.reversedById && (
                  <div className="bg-red-50 border border-red-200 rounded p-2 text-xs text-red-700">
                    ⚠️ Reversed by <span className="font-medium">{selected.reversedById}</span>
                  </div>
                )}

                {/* Attachments */}
                {selected.attachments && selected.attachments.length > 0 && (
                  <div className="border-t pt-3">
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-1.5">
                      <Paperclip className="h-3.5 w-3.5" /> Attachments ({selected.attachments.length})
                    </h4>
                    <div className="space-y-2">
                      {selected.attachments.map(att => (
                        <a key={att.id} href={att.url} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-2 text-xs bg-muted/50 rounded p-2 hover:bg-muted transition-colors">
                          {att.type.startsWith("image/") ? <ImageIcon className="h-3.5 w-3.5 text-blue-500" /> : <FileText className="h-3.5 w-3.5 text-muted-foreground" />}
                          <span className="font-medium truncate">{att.name}</span>
                          <span className="text-muted-foreground ml-auto">({(att.size / 1024).toFixed(1)} KB)</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="border-t pt-3 flex flex-wrap gap-2">
                  {selected.status === "Pending" && selected.paymentStatus !== "Paid" && (
                    <Button size="sm" onClick={() => {
                      setPayTxnId(selected.id);
                      setPayAmount(String(selected.amount - selected.paidAmount));
                      setShowPayment(true);
                    }}>
                      <CreditCard className="h-3.5 w-3.5 mr-1" /> Record Payment
                    </Button>
                  )}
                  {selected.status === "Completed" && !selected.reversedById && !selected.reversalOfId && (
                    <Button size="sm" variant="outline" onClick={() => handleReverse(selected.id)}>
                      <RotateCcw className="h-3.5 w-3.5 mr-1" /> Reverse
                    </Button>
                  )}
                  {selected.status === "Pending" && (
                    <Button size="sm" variant="destructive" onClick={() => handleMarkFailed(selected.id)}>
                      <XCircle className="h-3.5 w-3.5 mr-1" /> Mark Failed
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Create Transaction Dialog */}
      <Dialog open={showCreate} onOpenChange={v => { if (!v) resetForm(); setShowCreate(v); }}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>New Transaction</DialogTitle></DialogHeader>
          <div className="space-y-4">
            {/* Type selector */}
            <div className="flex gap-2">
              {(["Income", "Expense", "Transfer"] as TransactionType[]).map(t => (
                <Button key={t} variant={formType === t ? "default" : "outline"} size="sm"
                  onClick={() => { setFormType(t); setFormCategory(""); }}>
                  {t === "Income" ? <ArrowUpRight className="h-3.5 w-3.5 mr-1" /> :
                   t === "Expense" ? <ArrowDownRight className="h-3.5 w-3.5 mr-1" /> :
                   <ArrowRightLeft className="h-3.5 w-3.5 mr-1" />}
                  {t}
                </Button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Amount *</Label>
                <Input type="number" value={formAmount} onChange={e => setFormAmount(e.target.value)} placeholder="0" />
              </div>
              <div>
                <Label>Date *</Label>
                <Input type="date" value={formDate} onChange={e => setFormDate(e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Category *</Label>
                {showNewCategory ? (
                  <div className="flex gap-1">
                    <Input value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)} placeholder="New category name" className="h-9" />
                    <Button size="sm" className="h-9 px-2" onClick={() => {
                      if (!newCategoryName.trim()) { toast.error("Enter category name"); return; }
                      const catType = formType === "Transfer" ? "Expense" : formType;
                      const result = financeActions.addCategory({ name: newCategoryName.trim(), type: catType as "Income" | "Expense" });
                      if (result) {
                        setFormCategory(result.name);
                        toast.success(`Category "${result.name}" created`);
                      } else {
                        toast.error("Category already exists");
                      }
                      setNewCategoryName("");
                      setShowNewCategory(false);
                    }}>Add</Button>
                    <Button size="sm" variant="ghost" className="h-9 px-2" onClick={() => { setShowNewCategory(false); setNewCategoryName(""); }}>
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-1">
                    <Select value={formCategory} onValueChange={setFormCategory}>
                      <SelectTrigger className="flex-1"><SelectValue placeholder="Select category" /></SelectTrigger>
                      <SelectContent>
                        {getCategoriesForType(formType).map(c => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Button size="sm" variant="outline" className="h-9 px-2" title="Add custom category" onClick={() => setShowNewCategory(true)}>
                      <Plus className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                )}
              </div>
              <div>
                <Label>Sub-Category</Label>
                <Input value={formSubCategory} onChange={e => setFormSubCategory(e.target.value)} placeholder="Optional" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Payment Method *</Label>
                <Select value={formMethod} onValueChange={v => setFormMethod(v as PaymentMethod)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cash">Cash</SelectItem>
                    <SelectItem value="Bank">Bank Transfer</SelectItem>
                    <SelectItem value="UPI">UPI</SelectItem>
                    <SelectItem value="Cheque">Cheque</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>{formType === "Transfer" ? "From Account *" : "Account *"}</Label>
                <Select value={formAccount} onValueChange={setFormAccount}>
                  <SelectTrigger><SelectValue placeholder="Select account" /></SelectTrigger>
                  <SelectContent>
                    {assetAccounts.map(a => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {formType === "Transfer" && (
              <div>
                <Label>To Account *</Label>
                <Select value={formDestAccount} onValueChange={setFormDestAccount}>
                  <SelectTrigger><SelectValue placeholder="Select destination" /></SelectTrigger>
                  <SelectContent>
                    {assetAccounts.filter(a => a.id !== formAccount).map(a => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Fund</Label>
                <Select value={formFund} onValueChange={setFormFund}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {funds.map(f => <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Status</Label>
                <Select value={formStatus} onValueChange={v => setFormStatus(v as TransactionStatus)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Description *</Label>
              <Input value={formDescription} onChange={e => setFormDescription(e.target.value)} placeholder="Transaction description" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>External Reference</Label>
                <Input value={formExtRef} onChange={e => setFormExtRef(e.target.value)} placeholder="Bank Ref / UPI ID" />
              </div>
              <div>
                <Label>Notes</Label>
                <Input value={formNotes} onChange={e => setFormNotes(e.target.value)} placeholder="Optional notes" />
              </div>
            </div>

            {/* Attachments Section */}
            <div className="border-t pt-3">
              <Label className="flex items-center gap-1.5 mb-2">
                <Paperclip className="h-3.5 w-3.5" /> Attachments (Receipts, Invoices)
              </Label>
              <div className="space-y-2">
                {formAttachments.map(att => (
                  <div key={att.id} className="flex items-center justify-between bg-muted/50 rounded p-2 text-xs">
                    <div className="flex items-center gap-2">
                      {att.type.startsWith("image/") ? <ImageIcon className="h-3.5 w-3.5 text-blue-500" /> : <FileText className="h-3.5 w-3.5 text-muted-foreground" />}
                      <span className="font-medium truncate max-w-[200px]">{att.name}</span>
                      <span className="text-muted-foreground">({(att.size / 1024).toFixed(1)} KB)</span>
                    </div>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeAttachment(att.id)}>
                      <Trash2 className="h-3 w-3 text-red-500" />
                    </Button>
                  </div>
                ))}
                <label className="flex items-center gap-2 cursor-pointer text-xs text-primary hover:underline">
                  <Plus className="h-3.5 w-3.5" /> Add file (receipt, invoice, photo)
                  <input type="file" multiple accept="image/*,.pdf,.doc,.docx" className="hidden" onChange={handleFileAttach} />
                </label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowCreate(false); resetForm(); }}>Cancel</Button>
            <Button onClick={handleCreate}>Create Transaction</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Record Payment Dialog */}
      <Dialog open={showPayment} onOpenChange={setShowPayment}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Record Payment</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Amount</Label>
              <Input type="number" value={payAmount} onChange={e => setPayAmount(e.target.value)} />
            </div>
            <div>
              <Label>Method</Label>
              <Select value={payMethod} onValueChange={v => setPayMethod(v as PaymentMethod)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="Bank">Bank</SelectItem>
                  <SelectItem value="UPI">UPI</SelectItem>
                  <SelectItem value="Cheque">Cheque</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Reference</Label>
              <Input value={payRef} onChange={e => setPayRef(e.target.value)} placeholder="UTR / Ref #" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPayment(false)}>Cancel</Button>
            <Button onClick={handleRecordPayment}>Record</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default TransactionsPage;
