import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wallet, Building2, CreditCard, ArrowUpRight, ArrowDownRight, ArrowRightLeft, Eye, IndianRupee, TrendingUp, TrendingDown, Settings2, Plus, Scale, Download } from "lucide-react";
import { financeSelectors, financeActions } from "@/modules/finance/financeStore";
import type { FinanceAccount, FinTransaction, TransactionType, PaymentMethod } from "@/modules/finance/types";
import { toast } from "sonner";
import { exportToCSV } from "@/utils/exportCSV";

const formatCurrency = (val: number) => `₹${val.toLocaleString("en-IN")}`;

const accountIcon = (cat?: string) => {
  if (cat === "Cash") return <Wallet className="h-4 w-4 text-green-600" />;
  if (cat === "Bank") return <Building2 className="h-4 w-4 text-blue-600" />;
  if (cat === "UPI/Wallet") return <CreditCard className="h-4 w-4 text-purple-600" />;
  return <IndianRupee className="h-4 w-4 text-muted-foreground" />;
};

const getBalanceChange = (opening: number, current: number) => {
  if (opening === 0) return { pct: 0, direction: "neutral" as const };
  const pct = ((current - opening) / opening) * 100;
  return {
    pct: Math.abs(pct),
    direction: pct > 0 ? "up" as const : pct < 0 ? "down" as const : "neutral" as const,
  };
};

const AccountsPage = () => {
  const navigate = useNavigate();
  const accounts = financeSelectors.getAccounts();
  const assetAccounts = accounts.filter(a => a.type === "Asset");
  const [selectedAccount, setSelectedAccount] = useState<FinanceAccount | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [purposeFilter, setPurposeFilter] = useState("all");

  // Balance Adjustment Dialog
  const [showAdjust, setShowAdjust] = useState(false);
  const [adjType, setAdjType] = useState<TransactionType>("Income");
  const [adjAmount, setAdjAmount] = useState("");
  const [adjAccount, setAdjAccount] = useState(assetAccounts[0]?.id || "");
  const [adjCategory, setAdjCategory] = useState("");
  const [adjMethod, setAdjMethod] = useState<PaymentMethod>("Cash");
  const [adjDescription, setAdjDescription] = useState("");
  const [adjNotes, setAdjNotes] = useState("");
  const [adjDate, setAdjDate] = useState(new Date().toISOString().slice(0, 10));

  const categories = financeSelectors.getCategories();
  const funds = financeSelectors.getFunds();

  const handleAdjustment = () => {
    if (!adjAmount || Number(adjAmount) <= 0) { toast.error("Amount must be greater than zero"); return; }
    if (!adjCategory) { toast.error("Category is required"); return; }
    if (!adjDescription.trim()) { toast.error("Description / reason is required"); return; }

    const acc = accounts.find(a => a.id === adjAccount);
    const fund = funds.find(f => f.id === "FND-001");

    financeActions.createTransaction({
      type: adjType,
      amount: Number(adjAmount),
      date: adjDate,
      category: adjCategory,
      subCategory: "Balance Adjustment",
      paymentMethod: adjMethod,
      account: adjAccount,
      accountName: acc?.name || "",
      fund: "FND-001",
      fundName: fund?.name || "General Fund",
      externalReference: "",
      status: "Completed",
      description: `[Balance Adjustment] ${adjDescription}`,
      notes: adjNotes,
      createdBy: "Admin",
      referenceType: "Manual",
      source: "Manual",
    });

    toast.success("Balance adjustment recorded");
    setShowAdjust(false);
    setAdjType("Income"); setAdjAmount(""); setAdjDescription(""); setAdjNotes("");
    setAdjDate(new Date().toISOString().slice(0, 10)); setAdjCategory("");
  };

  const totalCash = assetAccounts.filter(a => a.accountCategory === "Cash").reduce((s, a) => s + a.currentBalance, 0);
  const totalBank = assetAccounts.filter(a => a.accountCategory === "Bank").reduce((s, a) => s + a.currentBalance, 0);
  const totalUPI = assetAccounts.filter(a => a.accountCategory === "UPI/Wallet").reduce((s, a) => s + a.currentBalance, 0);
  const totalAll = totalCash + totalBank + totalUPI;

  // Derive unique purposes from account types
  const allAccountTypes = [...new Set(accounts.map(a => a.type))].sort();

  const filteredAccounts = purposeFilter === "all"
    ? accounts
    : accounts.filter(a => a.type === purposeFilter);

  const handleAccountClick = (account: FinanceAccount) => {
    setSelectedAccount(account);
    setSheetOpen(true);
  };

  const accountTransactions = selectedAccount
    ? financeSelectors.getAccountTransactions(selectedAccount.id)
    : [];

  const getLastTransaction = (accountId: string): string => {
    const txns = financeSelectors.getAccountTransactions(accountId);
    if (txns.length === 0) return "—";
    const sorted = [...txns].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return sorted[0].date;
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Accounts</h1>
          <p className="text-sm text-muted-foreground">Real-time balances derived from transactions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={() => navigate("/temple/settings/finance")}>
            <Settings2 className="h-3.5 w-3.5" />
            Manage in Settings
          </Button>
          <Button size="sm" className="gap-1.5" onClick={() => setShowAdjust(true)}>
            <Scale className="h-3.5 w-3.5" />
            Balance Adjustment
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => {
            exportToCSV("accounts",
              ["ID", "Code", "Name", "Type", "Category", "Opening Balance", "Current Balance", "Description"],
              filteredAccounts.map(a => [a.id, a.code, a.name, a.type, a.accountCategory || "", String(a.openingBalance), String(a.currentBalance), a.description || ""])
            );
            toast.success(`Exported ${filteredAccounts.length} accounts`);
          }}>
            <Download className="h-3.5 w-3.5" /> Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-primary">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <IndianRupee className="h-4 w-4 text-primary" />
              <span className="text-xs text-muted-foreground">Total Position</span>
            </div>
            <p className="text-xl font-bold">{formatCurrency(totalAll)}</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Wallet className="h-4 w-4 text-green-600" />
              <span className="text-xs text-muted-foreground">Cash</span>
            </div>
            <p className="text-xl font-bold">{formatCurrency(totalCash)}</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Building2 className="h-4 w-4 text-blue-600" />
              <span className="text-xs text-muted-foreground">Bank</span>
            </div>
            <p className="text-xl font-bold">{formatCurrency(totalBank)}</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <CreditCard className="h-4 w-4 text-purple-600" />
              <span className="text-xs text-muted-foreground">UPI / Wallet</span>
            </div>
            <p className="text-xl font-bold">{formatCurrency(totalUPI)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter by Purpose (Account Type) */}
      <Tabs value={purposeFilter} onValueChange={setPurposeFilter}>
        <TabsList>
          <TabsTrigger value="all">All ({accounts.length})</TabsTrigger>
          {allAccountTypes.map(t => (
            <TabsTrigger key={t} value={t}>{t} ({accounts.filter(a => a.type === t).length})</TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Accounts Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Account</TableHead>
                <TableHead className="text-xs">Purpose</TableHead>
                <TableHead className="text-xs text-right">Opening Balance</TableHead>
                <TableHead className="text-xs text-right">Current Balance</TableHead>
                <TableHead className="text-xs text-center">Change</TableHead>
                <TableHead className="text-xs">Last Transaction</TableHead>
                <TableHead className="text-xs text-center">View</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAccounts.map(acc => {
                const change = getBalanceChange(acc.openingBalance, acc.currentBalance);
                const lastTxn = getLastTransaction(acc.id);
                return (
                  <TableRow key={acc.id} className="cursor-pointer hover:bg-muted/50" onClick={() => handleAccountClick(acc)}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {accountIcon(acc.accountCategory)}
                        <span className="font-medium text-sm">{acc.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {acc.description || "—"}
                    </TableCell>
                    <TableCell className="text-right text-xs font-mono text-muted-foreground">
                      {formatCurrency(acc.openingBalance)}
                    </TableCell>
                    <TableCell className="text-right font-bold text-sm">
                      {formatCurrency(acc.currentBalance)}
                    </TableCell>
                    <TableCell className="text-center">
                      {change.direction === "up" && (
                        <span className="inline-flex items-center gap-0.5 text-xs text-green-600 font-medium">
                          <TrendingUp className="h-3 w-3" /> {change.pct.toFixed(1)}%
                        </span>
                      )}
                      {change.direction === "down" && (
                        <span className="inline-flex items-center gap-0.5 text-xs text-red-600 font-medium">
                          <TrendingDown className="h-3 w-3" /> {change.pct.toFixed(1)}%
                        </span>
                      )}
                      {change.direction === "neutral" && (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{lastTxn}</TableCell>
                    <TableCell className="text-center">
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Account Drill-Down Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="sm:max-w-lg overflow-y-auto">
          {selectedAccount && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  {accountIcon(selectedAccount.accountCategory)}
                  {selectedAccount.name}
                </SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <Card>
                    <CardContent className="p-3">
                      <span className="text-[11px] text-muted-foreground">Opening Balance</span>
                      <p className="text-lg font-bold">{formatCurrency(selectedAccount.openingBalance)}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-3">
                      <span className="text-[11px] text-muted-foreground">Current Balance</span>
                      <p className="text-lg font-bold text-primary">{formatCurrency(selectedAccount.currentBalance)}</p>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Transaction History ({accountTransactions.length})</h3>
                  <div className="space-y-2 max-h-[400px] overflow-y-auto">
                    {accountTransactions.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-8">No transactions for this account</p>
                    ) : accountTransactions.map(txn => (
                      <div key={txn.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-2">
                          {txn.type === "Income" && <ArrowUpRight className="h-4 w-4 text-green-600" />}
                          {txn.type === "Expense" && <ArrowDownRight className="h-4 w-4 text-red-600" />}
                          {txn.type === "Transfer" && <ArrowRightLeft className="h-4 w-4 text-blue-600" />}
                          <div>
                            <p className="text-sm font-medium truncate max-w-[200px]">{txn.description}</p>
                            <p className="text-xs text-muted-foreground">{txn.date} • {txn.fundName}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-sm font-bold ${
                            txn.type === "Income" ? "text-green-600" :
                            txn.type === "Expense" ? "text-red-600" : "text-blue-600"
                          }`}>
                            {txn.type === "Income" ? "+" : txn.type === "Expense" ? "−" : "↔"} {formatCurrency(txn.paidAmount)}
                          </p>
                          <Badge variant="outline" className="text-[10px]">{txn.status}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Balance Adjustment Dialog */}
      <Dialog open={showAdjust} onOpenChange={v => { if (!v) { setAdjType("Income"); setAdjAmount(""); setAdjDescription(""); setAdjNotes(""); setAdjCategory(""); } setShowAdjust(v); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Scale className="h-5 w-5" /> Balance Adjustment</DialogTitle>
            <p className="text-sm text-muted-foreground">Record out-of-system cash movements to keep balances accurate</p>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex gap-2">
              {(["Income", "Expense"] as TransactionType[]).map(t => (
                <Button key={t} variant={adjType === t ? "default" : "outline"} size="sm"
                  onClick={() => { setAdjType(t); setAdjCategory(""); }}>
                  {t === "Income" ? <ArrowUpRight className="h-3.5 w-3.5 mr-1" /> : <ArrowDownRight className="h-3.5 w-3.5 mr-1" />}
                  {t === "Income" ? "Cash In" : "Cash Out"}
                </Button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Amount *</Label>
                <Input type="number" value={adjAmount} onChange={e => setAdjAmount(e.target.value)} placeholder="0" />
              </div>
              <div>
                <Label>Date *</Label>
                <Input type="date" value={adjDate} onChange={e => setAdjDate(e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Account *</Label>
                <Select value={adjAccount} onValueChange={setAdjAccount}>
                  <SelectTrigger><SelectValue placeholder="Select account" /></SelectTrigger>
                  <SelectContent>
                    {assetAccounts.map(a => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Category *</Label>
                <Select value={adjCategory} onValueChange={setAdjCategory}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    {categories.filter(c => c.type === adjType).map(c => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Payment Method</Label>
                <Select value={adjMethod} onValueChange={v => setAdjMethod(v as PaymentMethod)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cash">Cash</SelectItem>
                    <SelectItem value="Bank">Bank</SelectItem>
                    <SelectItem value="UPI">UPI</SelectItem>
                    <SelectItem value="Cheque">Cheque</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Description / Reason *</Label>
              <Input value={adjDescription} onChange={e => setAdjDescription(e.target.value)} placeholder="e.g. Cash received from old donation box" />
            </div>
            <div>
              <Label>Notes</Label>
              <Textarea value={adjNotes} onChange={e => setAdjNotes(e.target.value)} placeholder="Additional details..." rows={2} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAdjust(false)}>Cancel</Button>
            <Button onClick={handleAdjustment}>Record Adjustment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default AccountsPage;
