import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { 
  Search, ChevronDown, ChevronRight, CheckCircle2, 
  Upload, Edit, Check, Zap, CheckSquare, RefreshCw
} from "lucide-react";
import { toast } from "sonner";

// ─── TYPES ───
interface GroupedSplitTransaction {
  id: string; // Transaction ID
  mode: "Cash" | "Razorpay" | "QR- Razoray" | "Temple QR" | "NEFT" | "Cheque";
  amount: number;
  reconciledAmount: number;
  status: "YES" | "NO" | "Auto" | "Post upload of Bank Statement / User key In";
  bankRef: string;
  reconciliationRule: string;
}

interface GroupedTransaction {
  donationId: string; // Donation ID / Doc ID (System Generated)
  date: string;
  particulars: "Donation" | "Journal Voucher" | "Vendor Payment" | "Transfer";
  splits: GroupedSplitTransaction[];
}

// ─── NEW GROUPED TRANSACTIONS MOCK DATA ───
const initialGroupedTransactions: GroupedTransaction[] = [
  {
    donationId: "D2606001",
    date: "2026-06-12",
    particulars: "Donation",
    splits: [
      { id: "R2526XXXXX", mode: "Cash", amount: 15000, reconciledAmount: 5000, status: "NO", bankRef: "UTR-CASH-78912", reconciliationRule: "Manual User Key In" },
      { id: "R252600201", mode: "Razorpay", amount: 12000, reconciledAmount: 12000, status: "Auto", bankRef: "URT No", reconciliationRule: "Auto Sync" },
      { id: "R252600202", mode: "QR- Razoray", amount: 8500, reconciledAmount: 8500, status: "Auto", bankRef: "Auto", reconciliationRule: "Auto QR Settlement" },
      { id: "R252600203", mode: "Temple QR", amount: 10000, reconciledAmount: 0, status: "Post upload of Bank Statement / User key In", bankRef: "Pending Match", reconciliationRule: "Post upload statement" }
    ]
  },
  {
    donationId: "JV-2606002",
    date: "2026-06-11",
    particulars: "Journal Voucher",
    splits: [
      { id: "—", mode: "Cash", amount: 18000, reconciledAmount: 18000, status: "YES", bankRef: "UTR-JV-99012", reconciliationRule: "Manual User Key In" }
    ]
  },
  {
    donationId: "VP-2606003",
    date: "2026-06-10",
    particulars: "Vendor Payment",
    splits: [
      { id: "TXN-NEFT-881", mode: "NEFT", amount: 45000, reconciledAmount: 45000, status: "YES", bankRef: "UTR-NEFT-88912", reconciliationRule: "Bank Statement Match" }
    ]
  },
  {
    donationId: "TRF-2606004",
    date: "2026-06-09",
    particulars: "Transfer",
    splits: [
      { id: "TXN-CHQ-102", mode: "Cheque", amount: 100000, reconciledAmount: 100000, status: "YES", bankRef: "CHQ-778129", reconciliationRule: "Manual Clearance" }
    ]
  },
  {
    donationId: "D2606005",
    date: "2026-06-08",
    particulars: "Donation",
    splits: [
      { id: "R252600501", mode: "Temple QR", amount: 7500, reconciledAmount: 0, status: "Post upload of Bank Statement / User key In", bankRef: "Pending Match", reconciliationRule: "Post upload statement" }
    ]
  },
  {
    donationId: "D2606006",
    date: "2026-06-07",
    particulars: "Donation",
    splits: [
      { id: "R252600601", mode: "Razorpay", amount: 22000, reconciledAmount: 22000, status: "Auto", bankRef: "URT No", reconciliationRule: "Auto Sync" }
    ]
  },
  {
    donationId: "JV-2606007",
    date: "2026-06-06",
    particulars: "Journal Voucher",
    splits: [
      { id: "—", mode: "Cash", amount: 9000, reconciledAmount: 0, status: "NO", bankRef: "Pending Key In", reconciliationRule: "Manual User Key In" }
    ]
  }
];

const formatCurrency = (val: number) => (val > 0 ? `₹${val.toLocaleString("en-IN")}` : "—");

const FinanceLedgerPage = () => {
  // Tab 2 (Grouped Reconciliation) state with Safe LocalStorage parsing and schema conversion
  const [groupedTxns, setGroupedTxns] = useState<GroupedTransaction[]>(() => {
    try {
      const saved = localStorage.getItem("qoo.grouped_transactions");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.every(g => g && Array.isArray(g.splits))) {
          // Defensively map splits to ensure both status and reconciliation fields are resolved
          return parsed.map(g => ({
            ...g,
            splits: g.splits.map((s: any) => {
              const statusVal = s.status || s.reconciliation || "NO";
              return {
                ...s,
                status: statusVal,
                reconciliation: statusVal
              };
            })
          }));
        }
      }
    } catch (e) {
      console.error("Error reading qoo.grouped_transactions from localStorage:", e);
    }
    return initialGroupedTransactions;
  });
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({ "D2606001": true });
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [particularFilter, setParticularFilter] = useState("all");
  const [modeFilter, setModeFilter] = useState("all");
  const [reconFilter, setReconFilter] = useState("all");

  // BULK TRANSACTION SELECTIONS
  const [selectedSplits, setSelectedSplits] = useState<Record<string, boolean>>({});

  // Edit dialog state
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingParentId, setEditingParentId] = useState("");
  const [editingSplitIdx, setEditingSplitIdx] = useState<number | null>(null);
  const [editReconciledAmt, setEditReconciledAmt] = useState(0);
  const [editStatus, setEditStatus] = useState<any>("NO");
  const [editBankRef, setEditBankRef] = useState("");

  // Bank Statement Upload Dialog state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isProcessingUpload, setIsProcessingUpload] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);

  // Save changes helper
  const saveGroupedData = (newData: GroupedTransaction[]) => {
    setGroupedTxns(newData);
    localStorage.setItem("qoo.grouped_transactions", JSON.stringify(newData));
  };

  // Expand / Collapse toggler
  const toggleRow = (id: string) => {
    setExpandedRows(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Edit split dialog opener
  const openEditDialog = (parentId: string, splitIdx: number, split: GroupedSplitTransaction) => {
    setEditingParentId(parentId);
    setEditingSplitIdx(splitIdx);
    setEditReconciledAmt(split.reconciledAmount);
    setEditStatus(split.status || (split as any).reconciliation || "NO");
    setEditBankRef(split.bankRef);
    setIsEditDialogOpen(true);
  };

  // Handle Edit Submission
  const handleSaveReconciliation = () => {
    if (editingSplitIdx === null) return;
    
    const parent = groupedTxns.find(g => g.donationId === editingParentId);
    if (!parent) return;

    const originalSplit = parent.splits[editingSplitIdx];
    if (editReconciledAmt > originalSplit.amount) {
      toast.error(`Reconciled amount cannot exceed total split amount of ₹${originalSplit.amount}`);
      return;
    }

    const updated = groupedTxns.map(g => {
      if (g.donationId !== editingParentId) return g;
      const newSplits = [...g.splits];
      newSplits[editingSplitIdx] = {
        ...newSplits[editingSplitIdx],
        reconciledAmount: Number(editReconciledAmt),
        status: editStatus,
        reconciliation: editStatus, // backward compat
        bankRef: editBankRef || "—"
      } as any;
      return { ...g, splits: newSplits };
    });

    saveGroupedData(updated);
    setIsEditDialogOpen(false);
    toast.success(`Updated reconciliation for document ${editingParentId}`);
  };

  // UX ENHANCEMENTS: ONE-CLICK QUICK RECONCILE
  const handleQuickReconcile = (parentId: string, splitIdx: number) => {
    const updated = groupedTxns.map(g => {
      if (g.donationId !== parentId) return g;
      const newSplits = [...g.splits];
      const split = newSplits[splitIdx];
      const defaultRef = split.bankRef && split.bankRef !== "Pending Match" && split.bankRef !== "Pending Key In" && split.bankRef !== "—"
        ? split.bankRef 
        : split.mode === "Cash" 
        ? `UTR-CASH-${Math.floor(100000 + Math.random() * 900000)}` 
        : split.mode === "Cheque"
        ? `CHQ-${Math.floor(100000 + Math.random() * 900000)}`
        : `UTR-NEFT-${Math.floor(100000 + Math.random() * 900000)}`;

      newSplits[splitIdx] = {
        ...split,
        reconciledAmount: split.amount,
        status: "YES" as const,
        reconciliation: "YES" as const,
        bankRef: defaultRef,
        reconciliationRule: "One-Click Quick Reconcile"
      } as any;
      return { ...g, splits: newSplits };
    });
    saveGroupedData(updated);
    toast.success(`Instantly reconciled ${parentId} split payment!`);
  };

  // UX ENHANCEMENTS: QUICK SUGGESTED STATEMENT MATCH
  const handleQuickMatch = (parentId: string, splitIdx: number) => {
    const updated = groupedTxns.map(g => {
      if (g.donationId !== parentId) return g;
      const newSplits = [...g.splits];
      const split = newSplits[splitIdx];
      const matchedRef = g.donationId === "D2606001" ? "UTR-STMT-99021" : "UTR-STMT-33812";
      
      newSplits[splitIdx] = {
        ...split,
        reconciledAmount: split.amount,
        status: "YES" as const,
        reconciliation: "YES" as const,
        bankRef: matchedRef,
        reconciliationRule: "Matched via Quick Link"
      } as any;
      return { ...g, splits: newSplits };
    });
    saveGroupedData(updated);
    toast.success(`Matched ${parentId} Temple QR payment with bank statement suggestion!`);
  };

  // UX ENHANCEMENTS: INLINE AMOUNT CHANGE
  const handleInlineAmountChange = (parentId: string, splitIdx: number, val: number) => {
    const parent = groupedTxns.find(g => g.donationId === parentId);
    if (!parent) return;
    const split = parent.splits[splitIdx];

    if (val > split.amount) {
      toast.error(`Reconciled amount cannot exceed ₹${split.amount}`);
      return;
    }

    const updated = groupedTxns.map(g => {
      if (g.donationId !== parentId) return g;
      const newSplits = [...g.splits];
      const nextStatus = val === split.amount ? "YES" : val > 0 ? "YES" : "NO";
      newSplits[splitIdx] = {
        ...newSplits[splitIdx],
        reconciledAmount: val,
        status: nextStatus,
        reconciliation: nextStatus
      } as any;
      return { ...g, splits: newSplits };
    });
    saveGroupedData(updated);
  };

  // UX ENHANCEMENTS: INLINE BANK REF CHANGE
  const handleInlineBankRefChange = (parentId: string, splitIdx: number, val: string) => {
    const updated = groupedTxns.map(g => {
      if (g.donationId !== parentId) return g;
      const newSplits = [...g.splits];
      newSplits[splitIdx] = {
        ...newSplits[splitIdx],
        bankRef: val
      };
      return { ...g, splits: newSplits };
    });
    saveGroupedData(updated);
  };

  // UX ENHANCEMENTS: AUTO-RECONCILE GATEWAY PAYMENTS
  const handleAutoReconcileGateways = () => {
    let count = 0;
    const updated = groupedTxns.map(g => {
      const newSplits = g.splits.map(s => {
        if ((s.mode === "Razorpay" || s.mode === "QR- Razoray") && s.reconciledAmount < s.amount) {
          count++;
          return {
            ...s,
            reconciledAmount: s.amount,
            status: "Auto" as const,
            reconciliation: "Auto" as const,
            bankRef: s.bankRef === "Pending Match" || s.bankRef === "—" || s.bankRef === "Auto" ? `PAY-SYNC-${Math.floor(100000 + Math.random() * 900000)}` : s.bankRef,
            reconciliationRule: "Auto Gateway Sync"
          } as any;
        }
        return s;
      });
      return { ...g, splits: newSplits };
    });

    if (count > 0) {
      saveGroupedData(updated);
      toast.success(`Successfully auto-matched and reconciled ${count} gateway payments!`);
    } else {
      toast.info("All gateway payments are already reconciled.");
    }
  };

  // UX ENHANCEMENTS: BULK RECONCILE SELECTED CHECKS
  const handleBulkReconcileSelected = () => {
    const toReconcile = Object.entries(selectedSplits).filter(([_, isSelected]) => isSelected);
    if (toReconcile.length === 0) {
      toast.error("No split transactions selected for bulk action.");
      return;
    }

    const updated = groupedTxns.map(g => {
      const newSplits = g.splits.map((s, idx) => {
        const key = `${g.donationId}-${idx}`;
        if (selectedSplits[key]) {
          const defaultRef = s.bankRef && s.bankRef !== "Pending Match" && s.bankRef !== "Pending Key In" && s.bankRef !== "—"
            ? s.bankRef 
            : `UTR-BULK-${Math.floor(100000 + Math.random() * 900000)}`;
          return {
            ...s,
            reconciledAmount: s.amount,
            status: "YES" as const,
            reconciliation: "YES" as const,
            bankRef: defaultRef,
            reconciliationRule: "Bulk Checked Action"
          } as any;
        }
        return s;
      });
      return { ...g, splits: newSplits };
    });

    saveGroupedData(updated);
    setSelectedSplits({});
    toast.success(`Successfully bulk-reconciled ${toReconcile.length} selected splits!`);
  };

  // Toggle selection checklist
  const toggleSplitSelection = (parentId: string, idx: number) => {
    const key = `${parentId}-${idx}`;
    setSelectedSplits(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Simulate bank statement processing
  const handleUploadAndProcess = () => {
    if (!uploadedFile) {
      toast.error("Please select a statement file first.");
      return;
    }
    setIsProcessingUpload(true);
    setTimeout(() => {
      const updated = groupedTxns.map(g => {
        const newSplits = g.splits.map(s => {
          const statusVal = s.status || (s as any).reconciliation || "NO";
          if (s.mode === "Temple QR" && (statusVal.includes("Post upload") || statusVal === "NO")) {
            const matchedRef = g.donationId === "D2606001" ? "UTR-STMT-99021" : "UTR-STMT-33812";
            return {
              ...s,
              reconciledAmount: s.amount,
              status: "YES" as const,
              reconciliation: "YES" as const,
              bankRef: matchedRef,
              reconciliationRule: "Matched via Statement"
            } as any;
          }
          return s;
        });
        return { ...g, splits: newSplits };
      });

      saveGroupedData(updated);
      setIsProcessingUpload(false);
      setIsUploadOpen(false);
      setUploadedFile(null);
      toast.success("Bank statement processed! matched D2606001 and D2606005.");
    }, 1500);
  };

  // ─── TAB 2: GROUPED RECONCILIATION FILTERING ───
  const filteredGrouped = useMemo(() => {
    return groupedTxns.filter(g => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = q === "" || 
        g.donationId.toLowerCase().includes(q) || 
        g.particulars.toLowerCase().includes(q) ||
        (Array.isArray(g.splits) && g.splits.some(s => s.id.toLowerCase().includes(q) || s.bankRef.toLowerCase().includes(q)));

      if (!matchesSearch) return false;

      if (startDate && g.date < startDate) return false;
      if (endDate && g.date > endDate) return false;

      if (particularFilter !== "all" && g.particulars !== particularFilter) return false;

      if (modeFilter !== "all" && (!Array.isArray(g.splits) || !g.splits.some(s => s.mode === modeFilter))) return false;

      if (reconFilter !== "all") {
        const totalAmt = (g.splits || []).reduce((s, sp) => s + sp.amount, 0);
        const totalRec = (g.splits || []).reduce((s, sp) => s + sp.reconciledAmount, 0);
        
        if (reconFilter === "fully") {
          return totalRec === totalAmt;
        } else if (reconFilter === "partial") {
          return totalRec > 0 && totalRec < totalAmt;
        } else if (reconFilter === "unreconciled") {
          return totalRec === 0;
        }
      }

      return true;
    });
  }, [groupedTxns, searchQuery, startDate, endDate, particularFilter, modeFilter, reconFilter]);

  // Grouped Metrics Calculations
  const metrics = useMemo(() => {
    let totalAmt = 0;
    let totalRec = 0;
    let pendingCount = 0;

    groupedTxns.forEach(g => {
      if (Array.isArray(g.splits)) {
        g.splits.forEach(s => {
          totalAmt += s.amount;
          totalRec += s.reconciledAmount;
          const statusVal = s.status || (s as any).reconciliation || "NO";
          if (statusVal === "NO" || statusVal.includes("Post upload")) {
            pendingCount++;
          }
        });
      }
    });

    const rate = totalAmt > 0 ? Math.round((totalRec / totalAmt) * 100) : 0;

    return {
      totalAmt,
      totalRec,
      remaining: totalAmt - totalRec,
      rate,
      pendingCount
    };
  }, [groupedTxns]);

  // Real-time Auditing & Compliance calculations
  const auditMetrics = useMemo(() => {
    let unreconciledCount = 0;
    let unreconciledSum = 0;
    let partialCount = 0;
    let exceptionCount = 0;

    groupedTxns.forEach(g => {
      if (Array.isArray(g.splits)) {
        g.splits.forEach(s => {
          const statusVal = s.status || (s as any).reconciliation || "NO";
          // Unreconciled: transaction amount hasn't been matched/reconciled at all
          if (s.reconciledAmount === 0) {
            unreconciledCount++;
            unreconciledSum += s.amount;
          }
          
          // Mismatches: reconciled amount doesn't match total split amount but is greater than 0
          if (s.reconciledAmount > 0 && s.reconciledAmount < s.amount) {
            partialCount++;
          }
          
          // Exceptions: Reconciled or auto-sync, but has a pending or missing reference/UTR
          const hasMissingRef = (statusVal === "YES" || statusVal === "Auto") && 
            (!s.bankRef || s.bankRef === "—" || s.bankRef === "Pending Match" || s.bankRef === "Pending Key In");
            
          // Or exception where status is NO but UTR is entered
          const hasUnreconciledWithRef = statusVal === "NO" && 
            s.bankRef && s.bankRef !== "—" && s.bankRef !== "Pending Match" && s.bankRef !== "Pending Key In";
            
          if (hasMissingRef || hasUnreconciledWithRef) {
            exceptionCount++;
          }
        });
      }
    });

    return {
      unreconciledCount,
      unreconciledSum,
      partialCount,
      exceptionCount
    };
  }, [groupedTxns]);

  const selectedCount = Object.values(selectedSplits).filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* ─── TYPOGRAPHY: H2 HEADER & ACTION BUTTONS (NO CARD BORDERS) ─── */}
      <div className="flex justify-between items-center pb-2">
        <div>
          <h2 className="text-[28px] font-semibold text-foreground tracking-tight">Ledger Reconciliation</h2>
          <p className="text-[14px] text-muted-foreground">Audit split transaction modes, verify references, and reconcile balances with bank statements.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8 text-[12px] gap-1.5 text-primary border-primary hover:bg-primary/5" onClick={handleAutoReconcileGateways}>
            <Zap className="h-3.5 w-3.5 fill-primary" /> Match Gateways
          </Button>
          <Button size="sm" className="h-8 text-[12px] gap-1.5" onClick={() => setIsUploadOpen(true)}>
            <Upload className="h-3.5 w-3.5" /> Upload Statement
          </Button>
        </div>
      </div>

      {/* ─── AUDITING & COMPLIANCE SUMMARY (STANDARD ENTERPRISE RULES) ─── */}
      <div className="bg-slate-50/50 rounded-lg p-3 text-xs space-y-2">
        <div className="flex items-center justify-between border-b border-slate-100/60 pb-1.5">
          <span className="font-semibold text-foreground text-[11px] uppercase tracking-wider block">Auditing & Compliance Report</span>
          <Badge variant="outline" className="bg-slate-100 text-slate-700 border-none text-[10px]">
            Real-time Audit Active
          </Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[12px] text-muted-foreground">
          {/* Rule 1: Unreconciled Transaction Detection */}
          <div className="space-y-1">
            <span className="font-semibold text-foreground block">Unreconciled Transactions</span>
            <p>
              {auditMetrics.unreconciledCount > 0 ? (
                <span>Detected <strong className="text-amber-700">{auditMetrics.unreconciledCount} outstanding splits</strong> (₹{auditMetrics.unreconciledSum.toLocaleString("en-IN")}) requiring reconciliation.</span>
              ) : (
                <span className="text-emerald-700">✓ All transaction splits reconciled.</span>
              )}
            </p>
          </div>
          {/* Rule 2: Mismatch Detection */}
          <div className="space-y-1">
            <span className="font-semibold text-foreground block">Mismatch Detection</span>
            <p>
              {auditMetrics.partialCount > 0 ? (
                <span>Detected <strong className="text-red-700">{auditMetrics.partialCount} splits</strong> with partial/mismatched reconciled amounts.</span>
              ) : (
                <span className="text-emerald-700">✓ No reconciled amount mismatches detected.</span>
              )}
            </p>
          </div>
          {/* Rule 3: Exception Reporting */}
          <div className="space-y-1">
            <span className="font-semibold text-foreground block">Exception Reporting</span>
            <p>
              {auditMetrics.exceptionCount > 0 ? (
                <span>Detected <strong className="text-rose-700">{auditMetrics.exceptionCount} entries</strong> with missing/mismatched reference references.</span>
              ) : (
                <span className="text-emerald-700">✓ No reference exceptions found.</span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* SLEEK, COMPACT HORIZONTAL KPI STATS BAR (NO BORDERS, SOFT BACKGROUND) */}
      <div className="flex items-center justify-between bg-slate-50/40 rounded-lg p-4 shadow-none text-xs gap-4">
        <div className="flex-1 min-w-[140px]">
          <span className="text-muted-foreground font-semibold uppercase text-[10px] tracking-wider block">Total Booked</span>
          <span className="text-[20px] font-bold text-foreground">{formatCurrency(metrics.totalAmt)}</span>
        </div>
        <div className="flex-1 min-w-[160px]">
          <span className="text-muted-foreground font-semibold uppercase text-[10px] tracking-wider block">Reconciled Amount</span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-[20px] font-bold text-emerald-700">{formatCurrency(metrics.totalRec)}</span>
            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-none text-[10px] px-1.5 py-0">
              {metrics.rate}% Match
            </Badge>
          </div>
        </div>
        <div className="flex-1 min-w-[140px]">
          <span className="text-muted-foreground font-semibold uppercase text-[10px] tracking-wider block">Unreconciled Balance</span>
          <span className="text-[20px] font-bold text-amber-600">{formatCurrency(metrics.remaining)}</span>
        </div>
        <div className="flex-1 min-w-[120px]">
          <span className="text-muted-foreground font-semibold uppercase text-[10px] tracking-wider block">Pending Splits</span>
          <span className="text-[20px] font-bold text-sky-700">{metrics.pendingCount} items</span>
        </div>
      </div>

      {/* MAIN CONTAINER (NO OUTER CARD WRAPPER OR BORDERS) */}
      <div className="space-y-4">
        {/* FILTERS PANEL (BORDERLESS, SOFT BG WITH DATE RANGE SELECTORS) */}
        <div className="flex flex-wrap items-center gap-2 bg-slate-50/30 p-2.5 rounded-lg">
          <div className="relative flex-1 min-w-[180px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by ID, transaction ID or reference..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-8 text-[12px] h-8 bg-transparent border-slate-200 focus:border-primary"
            />
          </div>

          {/* DATE RANGE FILTER PANEL */}
          <div className="flex items-center gap-1.5 bg-transparent mr-1">
            <Input 
              type="date" 
              value={startDate} 
              onChange={e => setStartDate(e.target.value)} 
              className="text-[12px] h-8 w-[125px] bg-transparent border-slate-200" 
              title="Start Date"
            />
            <span className="text-[11px] text-muted-foreground">to</span>
            <Input 
              type="date" 
              value={endDate} 
              onChange={e => setEndDate(e.target.value)} 
              className="text-[12px] h-8 w-[125px] bg-transparent border-slate-200" 
              title="End Date"
            />
          </div>

          <div className="w-[120px]">
            <Select value={particularFilter} onValueChange={setParticularFilter}>
              <SelectTrigger className="text-[12px] h-8 bg-transparent border-slate-200">
                <SelectValue placeholder="Particulars" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Particulars</SelectItem>
                <SelectItem value="Donation">Donation</SelectItem>
                <SelectItem value="Journal Voucher">Journal Voucher</SelectItem>
                <SelectItem value="Vendor Payment">Vendor Payment</SelectItem>
                <SelectItem value="Transfer">Transfer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-[120px]">
            <Select value={modeFilter} onValueChange={setModeFilter}>
              <SelectTrigger className="text-[12px] h-8 bg-transparent border-slate-200">
                <SelectValue placeholder="Payment Mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Modes</SelectItem>
                <SelectItem value="Cash">Cash</SelectItem>
                <SelectItem value="Razorpay">Razorpay</SelectItem>
                <SelectItem value="QR- Razoray">QR- Razorpay</SelectItem>
                <SelectItem value="Temple QR">Temple QR</SelectItem>
                <SelectItem value="NEFT">NEFT</SelectItem>
                <SelectItem value="Cheque">Cheque</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-[130px]">
            <Select value={reconFilter} onValueChange={setReconFilter}>
              <SelectTrigger className="text-[12px] h-8 bg-transparent border-slate-200">
                <SelectValue placeholder="Reconciliation Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="fully">Fully Reconciled</SelectItem>
                <SelectItem value="partial">Partially Reconciled</SelectItem>
                <SelectItem value="unreconciled">Unreconciled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* BULK ACTIONS FLOATING TOOLBAR */}
        {selectedCount > 0 && (
          <div className="flex items-center justify-between bg-primary/5 border border-primary/10 rounded-md p-2 px-3 text-[13px] text-primary font-medium animate-fadeIn">
            <div className="flex items-center gap-2">
              <CheckSquare className="h-4 w-4 text-primary" />
              <span>Selected <strong>{selectedCount}</strong> split items for bulk reconciliation.</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Button size="sm" onClick={handleBulkReconcileSelected} className="h-7 text-[12px] bg-primary hover:bg-primary/95 text-white">
                Confirm Reconcile Selected
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setSelectedSplits({})} className="h-7 text-[12px] hover:bg-slate-100">
                Clear Selection
              </Button>
            </div>
          </div>
        )}

        {/* TABLE CONTAINER - COMPLETELY BORDERLESS OVERALL VIEWPORT */}
        <div className="overflow-x-auto">
          <Table className="border-none shadow-none">
            <TableHeader className="bg-slate-50/50">
              <TableRow className="border-b border-slate-100">
                <TableHead className="w-[40px] text-center"></TableHead>
                <TableHead className="text-[12px] font-semibold text-foreground py-2.5">Donation/Doc ID</TableHead>
                <TableHead className="text-[12px] font-semibold text-foreground py-2.5">Date</TableHead>
                <TableHead className="text-[12px] font-semibold text-foreground py-2.5">Particulars / Mode</TableHead>
                <TableHead className="text-[12px] font-semibold text-foreground py-2.5 text-right">Total Split Amount</TableHead>
                <TableHead className="text-[12px] font-semibold text-foreground py-2.5 text-right w-[150px]">Reconciled Amount</TableHead>
                <TableHead className="text-[12px] font-semibold text-foreground py-2.5 text-center w-[120px]">Reconciliation Status</TableHead>
                <TableHead className="text-[12px] font-semibold text-foreground py-2.5 w-[200px]">Bank Reference (UTR / Chq)</TableHead>
                <TableHead className="text-[12px] font-semibold text-foreground py-2.5 text-right w-[180px]">Actions / Easy Tools</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredGrouped.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-muted-foreground text-[13px]">
                    No grouped transactions found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredGrouped.map(group => {
                  const isExpanded = expandedRows[group.donationId];
                  const totalAmt = (group.splits || []).reduce((s, sp) => s + sp.amount, 0);
                  const totalRec = (group.splits || []).reduce((s, sp) => s + sp.reconciledAmount, 0);
                  
                  let badgeColor = "bg-red-50 text-red-700";
                  let badgeLabel = "Unreconciled";
                  if (totalRec === totalAmt) {
                    badgeColor = "bg-green-50 text-green-700";
                    badgeLabel = "Fully Reconciled";
                  } else if (totalRec > 0) {
                    badgeColor = "bg-amber-50 text-amber-700";
                    badgeLabel = "Partially Reconciled";
                  }

                  let particularsColor = "bg-slate-100 text-slate-700";
                  if (group.particulars === "Donation") particularsColor = "bg-emerald-50 text-emerald-700";
                  else if (group.particulars === "Journal Voucher") particularsColor = "bg-purple-50 text-purple-700";
                  else if (group.particulars === "Vendor Payment") particularsColor = "bg-blue-50 text-blue-700";
                  else if (group.particulars === "Transfer") particularsColor = "bg-orange-50 text-orange-700";

                  return (
                    <React.Fragment key={group.donationId}>
                      {/* TOP LEVEL PARENT ROW */}
                      <TableRow 
                        className="hover:bg-slate-50/40 cursor-pointer font-medium border-b border-slate-100/60 bg-slate-50/10"
                        onClick={() => toggleRow(group.donationId)}
                      >
                        {/* Expand / Collapse Action cell */}
                        <TableCell className="p-1 text-center" onClick={(e) => { e.stopPropagation(); toggleRow(group.donationId); }}>
                          {isExpanded ? <ChevronDown className="h-4 w-4 text-muted-foreground inline" /> : <ChevronRight className="h-4 w-4 text-muted-foreground inline" />}
                        </TableCell>
                        <TableCell className="text-[13px] font-semibold text-primary py-2.5">{group.donationId}</TableCell>
                        <TableCell className="text-[13px] py-2.5">{group.date}</TableCell>
                        <TableCell className="text-[13px] py-2.5">
                          <Badge variant="outline" className={`border-none ${particularsColor}`}>{group.particulars}</Badge>
                        </TableCell>
                        <TableCell className="text-[13px] text-right font-mono font-bold text-foreground py-2.5">
                          {formatCurrency(totalAmt)}
                        </TableCell>
                        <TableCell className="text-[13px] text-right font-mono text-emerald-600 font-bold py-2.5">
                          {formatCurrency(totalRec)}
                        </TableCell>
                        <TableCell className="text-center py-1">
                          <Badge variant="outline" className={`border-none ${badgeColor}`}>{badgeLabel}</Badge>
                        </TableCell>
                        <TableCell className="text-[12px] text-muted-foreground py-2.5" colSpan={2}>
                          {Array.isArray(group.splits) ? group.splits.map(s => s.mode).join(" + ") : ""} ({Array.isArray(group.splits) ? group.splits.length : 0} splits)
                        </TableCell>
                      </TableRow>

                      {/* EXPANDED CHILD SIBLING ROWS (FLAT WITH NO CELL BORDERS) */}
                      {isExpanded && Array.isArray(group.splits) && group.splits.map((split, sIdx) => {
                        const statusVal = split.status || (split as any).reconciliation || "NO";
                        let statusColor = "bg-slate-50 text-slate-600";
                        if (statusVal === "YES") statusColor = "bg-green-50 text-green-700";
                        else if (statusVal === "NO") statusColor = "bg-red-50 text-red-700";
                        else if (statusVal === "Auto") statusColor = "bg-emerald-50 text-emerald-800 font-semibold";
                        else if (statusVal.includes("Post upload")) statusColor = "bg-amber-50 text-amber-700";

                        const isReconciled = split.reconciledAmount === split.amount;
                        const splitKey = `${group.donationId}-${sIdx}`;
                        const isChecked = !!selectedSplits[splitKey];

                        return (
                          <TableRow key={splitKey} className="hover:bg-slate-50/50 border-b border-slate-100/40 bg-slate-50/5 transition-colors">
                            {/* Checkbox selector */}
                            <TableCell className="p-1 text-center">
                              {!isReconciled && (
                                <Checkbox 
                                  checked={isChecked}
                                  onCheckedChange={() => toggleSplitSelection(group.donationId, sIdx)}
                                />
                              )}
                            </TableCell>
                            
                            {/* Indented Transaction / Split ID */}
                            <TableCell className="text-[12px] font-mono pl-6 text-muted-foreground py-2">
                              <span className="text-muted-foreground/30 mr-1.5">└─</span>
                              <span>{split.id}</span>
                            </TableCell>
                            
                            {/* Blank/Silent Date cell */}
                            <TableCell className="text-[12px] text-muted-foreground/40 py-2"></TableCell>
                            
                            {/* Split Mode / Details */}
                            <TableCell className="text-[12px] font-semibold text-foreground/80 py-2">{split.mode}</TableCell>
                            
                            {/* Split Amount */}
                            <TableCell className="text-[12px] text-right font-mono text-foreground/80 py-2">{formatCurrency(split.amount)}</TableCell>
                            
                            {/* BORDERLESS INLINE AMOUNT INPUT */}
                            <TableCell className="text-right py-2">
                              <div className="flex justify-end items-center gap-1">
                                <span className="text-[10px] text-muted-foreground/60">₹</span>
                                <input
                                  type="number"
                                  value={split.reconciledAmount}
                                  onChange={e => handleInlineAmountChange(group.donationId, sIdx, Number(e.target.value))}
                                  className="h-6 text-[12px] font-mono w-20 text-right bg-transparent border-none focus:bg-white px-1 outline-none transition-all rounded-sm focus:ring-1 focus:ring-primary/20"
                                  max={split.amount}
                                  min={0}
                                />
                              </div>
                            </TableCell>

                            {/* Status badge */}
                            <TableCell className="text-center py-1">
                              <Badge variant="outline" className={`text-[10px] uppercase font-mono px-2 py-0.5 border-none ${statusColor}`}>
                                {statusVal}
                              </Badge>
                            </TableCell>
                            
                            {/* BORDERLESS INLINE BANK REF INPUT */}
                            <TableCell className="py-2">
                              <input
                                type="text"
                                value={split.bankRef}
                                placeholder="Enter UTR/Cheque"
                                onChange={e => handleInlineBankRefChange(group.donationId, sIdx, e.target.value)}
                                className="h-6 text-[12px] font-mono w-36 bg-transparent border-none focus:bg-white px-1.5 outline-none transition-all rounded-sm focus:ring-1 focus:ring-primary/20"
                              />
                            </TableCell>
                            
                            {/* Quick Actions */}
                            <TableCell className="text-right gap-1.5 flex justify-end items-center py-1">
                              {/* Match suggest link */}
                              {split.mode === "Temple QR" && !isReconciled && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleQuickMatch(group.donationId, sIdx)}
                                  className="h-6 px-1.5 text-[10px] gap-1 text-indigo-700 bg-indigo-50 border-none hover:bg-indigo-100 hover:text-indigo-800"
                                  title="Suggested match found. Click to link."
                                >
                                  <ChevronDown className="h-3 w-3 text-indigo-600" /> Suggest Match
                                </Button>
                              )}

                              {/* Quick reconcile cash/NEFT */}
                              {!isReconciled && split.mode !== "Temple QR" && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleQuickReconcile(group.donationId, sIdx)}
                                  className="h-6 px-1.5 text-[10px] gap-0.5 text-primary border-none bg-primary/5 hover:bg-primary/10"
                                >
                                  <Check className="h-3 w-3" /> Quick Rec
                                </Button>
                              )}

                              {isReconciled && (
                                <span className="text-[10px] text-green-700 font-semibold px-2">✓ Reconciled</span>
                              )}

                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-6 w-6 text-muted-foreground hover:text-primary"
                                onClick={() => openEditDialog(group.donationId, sIdx, split)}
                                title="Detailed options"
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </React.Fragment>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* ─── DIALOG: EDIT RECONCILIATION DETAIL ─── */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle className="text-[18px] font-semibold text-foreground">Edit Reconciliation Status</DialogTitle>
            <DialogDescription className="text-[12px] text-muted-foreground">
              Adjust detailed reconciliation configurations for transaction split in document {editingParentId}.
            </DialogDescription>
          </DialogHeader>

          {editingSplitIdx !== null && (
            <div className="space-y-3 py-2">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-2.5 rounded border text-[12px]">
                <div>
                  <span className="text-muted-foreground font-semibold">Payment Mode:</span>
                  <p className="font-bold text-foreground">
                    {groupedTxns.find(g => g.donationId === editingParentId)?.splits[editingSplitIdx]?.mode}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground font-semibold">Total Amount:</span>
                  <p className="font-bold text-foreground">
                    {formatCurrency(groupedTxns.find(g => g.donationId === editingParentId)?.splits[editingSplitIdx]?.amount || 0)}
                  </p>
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="recon-status" className="text-[12px] font-medium text-foreground">Reconciliation Status</Label>
                <Select value={editStatus} onValueChange={setEditStatus}>
                  <SelectTrigger className="text-[12px] h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="YES">YES (Reconciled)</SelectItem>
                    <SelectItem value="NO">NO (Unreconciled)</SelectItem>
                    <SelectItem value="Auto">Auto (Gateway Reconciled)</SelectItem>
                    <SelectItem value="Post upload of Bank Statement / User key In">Post Statement Matching / Pending Upload</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="reconciled-amount" className="text-[12px] font-medium text-foreground">Reconciled Amount (₹)</Label>
                <Input 
                  id="reconciled-amount"
                  type="number" 
                  value={editReconciledAmt}
                  onChange={e => setEditReconciledAmt(Number(e.target.value))}
                  className="text-[12px] h-8"
                />
                <span className="text-[10px] text-muted-foreground block">
                  Max allowable: ₹{groupedTxns.find(g => g.donationId === editingParentId)?.splits[editingSplitIdx]?.amount}.
                </span>
              </div>

              <div className="space-y-1">
                <Label htmlFor="bank-ref" className="text-[12px] font-medium text-foreground">Bank Reference (UTR / Cheque No)</Label>
                <Input 
                  id="bank-ref"
                  placeholder="e.g. UTR-998811 or Cheque No"
                  value={editBankRef}
                  onChange={e => setEditBankRef(e.target.value)}
                  className="text-[12px] h-8"
                />
              </div>

              {/* SUGGESTED MATCH PANEL */}
              <div className="space-y-2 border-t pt-3">
                <span className="font-semibold text-[11px] text-muted-foreground uppercase tracking-wider block">SBI Match Suggestion</span>
                <div 
                  className="flex justify-between items-center p-2 rounded border border-emerald-200 bg-emerald-50/20 hover:bg-emerald-50/50 cursor-pointer transition-colors text-[12px]"
                  onClick={() => {
                    setEditReconciledAmt(groupedTxns.find(g => g.donationId === editingParentId)?.splits[editingSplitIdx]?.amount || 0);
                    setEditStatus("YES");
                    setEditBankRef("UTR-STMT-99021");
                    toast.success("Suggested match applied!");
                  }}
                >
                  <div>
                    <span className="font-semibold text-emerald-800">SBI Match (CR)</span>
                    <p className="text-[10px] text-muted-foreground">UTR-STMT-99021</p>
                  </div>
                  <span className="font-bold text-emerald-700">
                    {formatCurrency(groupedTxns.find(g => g.donationId === editingParentId)?.splits[editingSplitIdx]?.amount || 0)}
                  </span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button variant="outline" size="sm" className="text-[12px] h-8" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" className="text-[12px] h-8" onClick={handleSaveReconciliation}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── DIALOG: BANK STATEMENT UPLOAD SIMULATION ─── */}
      <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-[18px]">
              <Upload className="h-5 w-5 text-primary" /> Bank Statement Reconciler
            </DialogTitle>
            <DialogDescription className="text-[12px]">
              Upload a bank statement to auto-verify and reconcile UPI and QR-code split payments.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-[12px]">
            <div className="space-y-1">
              <Label className="font-medium text-[12px]">Select Bank Account</Label>
              <Select defaultValue="sbi">
                <SelectTrigger className="text-[12px] h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sbi">State Bank of India — SBI Main (ACC-002)</SelectItem>
                  <SelectItem value="hdfc">HDFC Bank — Project (ACC-003)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* MOCK DROPZONE */}
            <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center bg-muted/10 border-muted hover:bg-muted/20 cursor-pointer transition-colors" onClick={() => setUploadedFile("sbi_statement_june_2026.csv")}>
              <Upload className="h-8 w-8 text-muted-foreground mb-2" />
              {uploadedFile ? (
                <div className="text-center">
                  <p className="font-bold text-foreground">{uploadedFile}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Click to replace file</p>
                </div>
              ) : (
                <div className="text-center">
                  <p className="font-bold text-foreground">Click to upload statement file</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Supports CSV, XLSX, and MT940 formats</p>
                </div>
              )}
            </div>

            {uploadedFile && (
              <div className="space-y-2 border rounded p-3 bg-slate-50/50">
                <div className="flex justify-between items-center border-b pb-1.5 mb-1.5">
                  <span className="font-semibold text-muted-foreground text-[10px] uppercase tracking-wider">Statement Preview</span>
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-none text-[10px]">
                    2 potential matches found
                  </Badge>
                </div>
                <div className="space-y-1.5 font-mono text-[10px] text-slate-700">
                  <div className="flex justify-between border-b pb-1 last:border-0 last:pb-0">
                    <span>12/06/2026 - UPI CR / UTR-STMT-99021</span>
                    <span className="font-bold text-emerald-700">+₹10,000.00</span>
                  </div>
                  <div className="flex justify-between border-b pb-1 last:border-0 last:pb-0">
                    <span>08/06/2026 - UPI CR / UTR-STMT-33812</span>
                    <span className="font-bold text-emerald-700">+₹7,500.00</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" size="sm" className="text-[12px] h-8" onClick={() => { setIsUploadOpen(false); setUploadedFile(null); }}>
              Cancel
            </Button>
            <Button size="sm" className="text-[12px] h-8 gap-1.5" onClick={handleUploadAndProcess} disabled={isProcessingUpload || !uploadedFile}>
              {isProcessingUpload ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" /> Matching...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5" /> Reconcile Selected
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FinanceLedgerPage;
