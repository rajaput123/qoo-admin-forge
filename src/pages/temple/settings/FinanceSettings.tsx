import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Shield,
  ExternalLink,
  Pencil,
  CheckCircle2,
  Building2,
  Edit,
  Link2,
  MoreHorizontal,
  Trash2,
  XCircle,
  Eye,
  AlertTriangle,
  Info,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import { download80GBlankTemplatePdf } from "@/lib/eightyGReceipt";
import {
  getTempleConfig,
  saveTempleConfig,
  markFinanceSetupComplete,
  format80GValidity,
  get80GStatusLabel,
  getRegistration80GChoice,
  isFinanceSetupComplete,
} from "@/lib/templeConfig";

const BANKS_LS_KEY = "qoo.finance.banks";
const PURPOSE_OPTIONS = ["Donations", "Seva Payments", "Event Payments", "Salaries", "General Expenses", "Project Funds"];
type EightyGLink = "Non-80G" | "80G" | "Both";

interface BankAccount {
  id: string;
  accountName: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  branch: string;
  isPrimary: boolean;
  gatewayAccountId?: string;
  purpose?: string;
  panNumber?: string;
  eightyGLink: EightyGLink;
  isDefaultDonation: boolean;
  isDefaultSeva: boolean;
  status: "Active" | "Paused";
}

function normalizeBank(raw: Partial<BankAccount> & Pick<BankAccount, "id">): BankAccount {
  return {
    id: raw.id,
    accountName: raw.accountName ?? "",
    bankName: raw.bankName ?? "",
    accountNumber: raw.accountNumber ?? "",
    ifscCode: raw.ifscCode ?? "",
    branch: raw.branch ?? "",
    isPrimary: raw.isPrimary ?? false,
    gatewayAccountId: raw.gatewayAccountId,
    purpose: raw.purpose,
    panNumber: raw.panNumber,
    eightyGLink: raw.eightyGLink ?? "Non-80G",
    isDefaultDonation: raw.isDefaultDonation ?? false,
    isDefaultSeva: raw.isDefaultSeva ?? false,
    status: raw.status ?? "Active",
  };
}

function loadBankAccounts(): BankAccount[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(BANKS_LS_KEY);
    if (raw) return (JSON.parse(raw) as Partial<BankAccount>[]).map(normalizeBank);
  } catch {
    /* ignore */
  }
  return [];
}

const emptyBankForm = () => ({
  accountName: "",
  bankName: "",
  accountNumber: "",
  ifscCode: "",
  branch: "",
  purpose: "",
  panNumber: "",
  eightyGLink: "Non-80G" as EightyGLink,
  isDefaultDonation: false,
  isDefaultSeva: false,
});

function resolvePrimaryBankId(accounts: BankAccount[]): string {
  return accounts.find((a) => a.isDefaultDonation)?.id || accounts[0]?.id || "";
}

const FinanceSettings = () => {
  const navigate = useNavigate();
  const reg80GChoice = getRegistration80GChoice();
  const templeCfg = getTempleConfig();

  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(loadBankAccounts);
  const [activeTab, setActiveTab] = useState("bank");
  const [showAddBank, setShowAddBank] = useState(false);
  const [editingBank, setEditingBank] = useState<BankAccount | null>(null);
  const [bankForm, setBankForm] = useState(emptyBankForm());
  const [showAccountIdModal, setShowAccountIdModal] = useState(false);
  const [accountIdTarget, setAccountIdTarget] = useState<string | null>(null);
  const [gatewayAccountId, setGatewayAccountId] = useState("");
  const [eightyGEditing, setEightyGEditing] = useState(false);
  const [eightyGEnabled, setEightyGEnabled] = useState(
    reg80GChoice === "yes" ? true : reg80GChoice === "no" ? false : templeCfg.eightyGEnabled
  );
  const [eightyGForm, setEightyGForm] = useState({
    registration80G: templeCfg.registration80G,
    pan: templeCfg.pan,
    validityFrom: templeCfg.validityFrom,
    validityTo: templeCfg.validityTo,
    signatory: templeCfg.signatory,
  });

  useEffect(() => {
    localStorage.setItem(BANKS_LS_KEY, JSON.stringify(bankAccounts));
    const primaryId = resolvePrimaryBankId(bankAccounts);
    if (primaryId) {
      saveTempleConfig({ associatedBankAccountId: primaryId });
      markFinanceSetupComplete();
      localStorage.removeItem("financeSetupPromptDismissed");
    }
  }, [bankAccounts]);

  const defaultDonationAccount = bankAccounts.find((a) => a.isDefaultDonation);
  const hasDefaultDonationAccount = Boolean(defaultDonationAccount);
  const bankStepDone = bankAccounts.length > 0 && hasDefaultDonationAccount;
  const eightyGReady =
    eightyGEnabled &&
    Boolean(eightyGForm.registration80G) &&
    eightyGForm.pan.length === 10 &&
    Boolean(eightyGForm.validityFrom) &&
    Boolean(eightyGForm.validityTo);
  const eightyGStepDone = reg80GChoice === "yes" ? eightyGReady : !eightyGEnabled || eightyGReady;
  const eightyGStatus = get80GStatusLabel({
    ...templeCfg,
    eightyGEnabled,
    registration80G: eightyGForm.registration80G,
    pan: eightyGForm.pan,
    validityFrom: eightyGForm.validityFrom,
    validityTo: eightyGForm.validityTo,
  });

  const show80GRegSummary = reg80GChoice === "yes" && eightyGReady && !eightyGEditing;
  const show80GSkipped = reg80GChoice === "no" && !eightyGEnabled && !eightyGEditing;
  const show80GForm = !show80GRegSummary && !show80GSkipped;

  const openAddBank = () => {
    setEditingBank(null);
    setBankForm({
      ...emptyBankForm(),
      isDefaultDonation: bankAccounts.length === 0,
    });
    setShowAddBank(true);
  };

  const handleAddBank = () => {
    if (!bankForm.accountName || !bankForm.bankName || !bankForm.accountNumber) {
      toast.error("Please fill account name, bank name and account number");
      return;
    }
    const isFirstAccount = bankAccounts.length === 0;
    const isDefaultDonation = bankForm.isDefaultDonation || isFirstAccount;
    let updatedAccounts = [...bankAccounts];
    if (isDefaultDonation) {
      updatedAccounts = updatedAccounts.map((a) => ({ ...a, isDefaultDonation: false }));
    }
    if (bankForm.isDefaultSeva) {
      updatedAccounts = updatedAccounts.map((a) => ({ ...a, isDefaultSeva: false }));
    }
    const newAccount: BankAccount = {
      id: `BANK-${String(bankAccounts.length + 1).padStart(3, "0")}`,
      ...bankForm,
      isDefaultDonation,
      isPrimary: isFirstAccount,
      status: "Active",
    };
    setBankAccounts([...updatedAccounts, newAccount]);
    setBankForm(emptyBankForm());
    setShowAddBank(false);
    toast.success("Bank account added");
  };

  const handleEditBank = (account: BankAccount) => {
    setEditingBank(account);
    setBankForm({
      accountName: account.accountName,
      bankName: account.bankName,
      accountNumber: account.accountNumber.replace(/\*/g, ""),
      ifscCode: account.ifscCode,
      branch: account.branch,
      purpose: account.purpose || "",
      panNumber: account.panNumber || "",
      eightyGLink: account.eightyGLink,
      isDefaultDonation: account.isDefaultDonation,
      isDefaultSeva: account.isDefaultSeva,
    });
    setShowAddBank(true);
  };

  const handleUpdateBank = () => {
    if (!editingBank) return;
    let updated = bankAccounts.map((acc) =>
      acc.id === editingBank.id ? { ...acc, ...bankForm } : acc
    );
    if (bankForm.isDefaultDonation) {
      updated = updated.map((a) => (a.id === editingBank.id ? a : { ...a, isDefaultDonation: false }));
    }
    if (bankForm.isDefaultSeva) {
      updated = updated.map((a) => (a.id === editingBank.id ? a : { ...a, isDefaultSeva: false }));
    }
    setBankAccounts(updated);
    setShowAddBank(false);
    setEditingBank(null);
    setBankForm(emptyBankForm());
    toast.success("Bank account updated");
  };

  const handleDeleteBank = (id: string) => {
    if (bankAccounts.length <= 1) {
      toast.error("Keep at least one bank account");
      return;
    }
    const next = bankAccounts.filter((acc) => acc.id !== id);
    setBankAccounts(next);
    toast.success("Bank account deleted");
  };

  const handleOpenAccountId = (accountId: string) => {
    const account = bankAccounts.find((a) => a.id === accountId);
    setAccountIdTarget(accountId);
    setGatewayAccountId(account?.gatewayAccountId || "");
    setShowAccountIdModal(true);
  };

  const handleSaveAccountId = () => {
    if (!accountIdTarget) return;
    setBankAccounts(
      bankAccounts.map((acc) =>
        acc.id === accountIdTarget ? { ...acc, gatewayAccountId: gatewayAccountId.trim() || undefined } : acc
      )
    );
    setShowAccountIdModal(false);
    setAccountIdTarget(null);
    setGatewayAccountId("");
    toast.success("Gateway account ID saved");
  };

  const handleSave80G = () => {
    if (eightyGEnabled && (!eightyGForm.registration80G.trim() || eightyGForm.pan.length !== 10)) {
      toast.error("Enter registration number and 10-digit PAN");
      return;
    }
    if (eightyGEnabled && (!eightyGForm.validityFrom || !eightyGForm.validityTo)) {
      toast.error("Enter validity dates");
      return;
    }
    saveTempleConfig({
      eightyGEnabled,
      registration80G: eightyGEnabled ? eightyGForm.registration80G.trim() : "",
      pan: eightyGEnabled ? eightyGForm.pan.toUpperCase() : templeCfg.pan,
      validityFrom: eightyGEnabled ? eightyGForm.validityFrom : "",
      validityTo: eightyGEnabled ? eightyGForm.validityTo : "",
      signatory: eightyGForm.signatory.trim() || templeCfg.signatory,
    });
    setEightyGEditing(false);
    toast.success("80G details saved");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Finance Setup</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Bank accounts receive donations & payouts. 80G is for donor tax certificates — set at registration.
          </p>
        </div>
        <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={() => navigate("/temple/finance/accounts")}>
          <Eye className="h-3.5 w-3.5" />
          View Accounts
        </Button>
      </div>

      <Alert className="border-blue-200/80 bg-blue-50/50">
        <Info className="h-4 w-4 text-blue-700" />
        <AlertTitle className="text-blue-900 text-sm">How donations, 80G & accounting work together</AlertTitle>
        <AlertDescription className="text-blue-800/90 text-xs space-y-1.5 mt-1">
          <p>
            <strong>Registration:</strong> If you chose Yes for 80G, your certificate details appear in the 80G tab. If No, that step is skipped.
          </p>
          <p>
            <strong>Bank tab:</strong> Mark one account as <strong>Default Donation Account</strong>. Online, UPI & bank donations are routed there — without it, amounts cannot be credited to a temple bank account.
          </p>
          <p>
            <strong>80G tab:</strong> Controls tax certificates for eligible donors (PAN required). It does not change where money is deposited — that is always the default donation account above.
          </p>
          <p>
            <strong>Accounting:</strong> Recorded donations sync to Finance → Payments & Expenses. 80G donations generate certificates; ledger entries use the payment channel (cash/UPI/bank) and donation category.
          </p>
        </AlertDescription>
      </Alert>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="border-b w-full max-w-md">
          <TabsTrigger value="bank" className="gap-2">
            <Building2 className="h-4 w-4" />
            Bank Accounts
            {bankStepDone && <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />}
          </TabsTrigger>
          <TabsTrigger value="80g" className="gap-2">
            <Shield className="h-4 w-4" />
            80G Certificates
            {eightyGStepDone && eightyGEnabled && <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="bank" className="mt-4 space-y-4">
      <Card className={bankStepDone ? "border-green-200/80" : "border-primary/30"}>
        <CardHeader>
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Bank accounts
              </CardTitle>
              <CardDescription>Add temple bank accounts and set defaults</CardDescription>
            </div>
            <Dialog open={showAddBank} onOpenChange={setShowAddBank}>
              <DialogTrigger asChild>
                <Button size="sm" onClick={openAddBank}>
                  <Plus className="h-4 w-4 mr-2" /> Add Account
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[85vh] flex flex-col sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>{editingBank ? "Edit Bank Account" : "Add Bank Account"}</DialogTitle>
                  <p className="text-xs text-muted-foreground pt-1">
                    Link this account to your temple 80G registration in the 80G tab, or mark it as non-80G.
                  </p>
                </DialogHeader>
                <div className="space-y-4 py-2 overflow-y-auto flex-1 pr-1">
                  <div>
                    <Label>Account Name *</Label>
                    <Input
                      value={bankForm.accountName}
                      onChange={(e) => setBankForm({ ...bankForm, accountName: e.target.value })}
                      placeholder="e.g., Main Temple Account"
                    />
                  </div>
                  <div>
                    <Label>Bank Name *</Label>
                    <Input
                      value={bankForm.bankName}
                      onChange={(e) => setBankForm({ ...bankForm, bankName: e.target.value })}
                      placeholder="e.g., State Bank of India"
                    />
                  </div>
                  <div>
                    <Label>Account Number *</Label>
                    <Input
                      value={bankForm.accountNumber}
                      onChange={(e) => setBankForm({ ...bankForm, accountNumber: e.target.value })}
                      placeholder="Enter account number"
                      className="font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>IFSC Code</Label>
                      <Input
                        value={bankForm.ifscCode}
                        onChange={(e) => setBankForm({ ...bankForm, ifscCode: e.target.value.toUpperCase() })}
                        placeholder="SBIN0001234"
                        className="font-mono uppercase"
                      />
                    </div>
                    <div>
                      <Label>Branch</Label>
                      <Input
                        value={bankForm.branch}
                        onChange={(e) => setBankForm({ ...bankForm, branch: e.target.value })}
                        placeholder="Branch name"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Purpose / Tags</Label>
                    <div className="flex flex-wrap gap-2 mt-1.5">
                      {PURPOSE_OPTIONS.map((tag) => {
                        const selected = bankForm.purpose.split(", ").filter(Boolean).includes(tag);
                        return (
                          <Badge
                            key={tag}
                            variant={selected ? "default" : "outline"}
                            className="cursor-pointer text-xs"
                            onClick={() => {
                              const current = bankForm.purpose.split(", ").filter(Boolean);
                              const updated = selected ? current.filter((t) => t !== tag) : [...current, tag];
                              setBankForm({ ...bankForm, purpose: updated.join(", ") });
                            }}
                          >
                            {tag}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                  <div>
                    <Label>PAN Number (optional)</Label>
                    <Input
                      value={bankForm.panNumber}
                      onChange={(e) => setBankForm({ ...bankForm, panNumber: e.target.value.toUpperCase() })}
                      placeholder="ABCDE1234F"
                      maxLength={10}
                      className="font-mono uppercase"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>80G Account Type</Label>
                    <Select
                      value={bankForm.eightyGLink}
                      onValueChange={(v) => setBankForm({ ...bankForm, eightyGLink: v as EightyGLink })}
                    >
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover z-[100]">
                        <SelectItem value="Non-80G">Non-80G — general</SelectItem>
                        <SelectItem value="80G">
                          80G — {eightyGForm.registration80G || templeCfg.registration80G || "tax exempt"}
                        </SelectItem>
                        <SelectItem value="Both">Both — 80G & Non-80G</SelectItem>
                      </SelectContent>
                    </Select>
                    {bankForm.eightyGLink !== "Non-80G" && (eightyGForm.registration80G || templeCfg.registration80G) && (
                      <p className="text-xs text-muted-foreground">
                        80G reg: {eightyGForm.registration80G || templeCfg.registration80G}
                        {(eightyGForm.pan || templeCfg.pan) && ` · PAN ${eightyGForm.pan || templeCfg.pan}`}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <Label className="text-sm font-medium">Default Account</Label>
                      <p className="text-xs text-muted-foreground">
                        Required — online, UPI & bank receipts credit this account. Check for the Default badge in the table.
                      </p>
                    </div>
                    <Switch
                      checked={bankForm.isDefaultDonation}
                      onCheckedChange={(checked) => setBankForm({ ...bankForm, isDefaultDonation: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <Label className="text-sm font-medium">Default Seva Account</Label>
                      <p className="text-xs text-muted-foreground">Receive seva payments to this account</p>
                    </div>
                    <Switch
                      checked={bankForm.isDefaultSeva}
                      onCheckedChange={(checked) => setBankForm({ ...bankForm, isDefaultSeva: checked })}
                    />
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" className="flex-1" onClick={() => setShowAddBank(false)}>
                    Cancel
                  </Button>
                  <Button className="flex-1" onClick={editingBank ? handleUpdateBank : handleAddBank}>
                    {editingBank ? "Update" : "Add"} Account
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {bankAccounts.length === 0 ? (
            <Alert variant="destructive" className="border-amber-300 bg-amber-50 text-amber-950 [&>svg]:text-amber-700">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle className="text-sm">No bank account yet</AlertTitle>
              <AlertDescription className="text-xs">
                Add at least one account and turn on <strong>Default Account</strong>. Until then, online/UPI/bank amounts cannot be routed to your temple account.
              </AlertDescription>
            </Alert>
          ) : !hasDefaultDonationAccount ? (
            <Alert variant="destructive" className="border-amber-300 bg-amber-50 text-amber-950 [&>svg]:text-amber-700">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle className="text-sm">Default account not set</AlertTitle>
              <AlertDescription className="text-xs">
                Edit an account and enable <strong>Default Account</strong>. Amounts will not be credited until one account has the <strong>Default</strong> badge in the table below.
              </AlertDescription>
            </Alert>
          ) : (
            <Alert className="border-green-200/80 bg-green-50/50">
              <CheckCircle2 className="h-4 w-4 text-green-700" />
              <AlertTitle className="text-green-900 text-sm">Default account configured</AlertTitle>
              <AlertDescription className="text-green-800/90 text-xs">
                Default account: <strong>{defaultDonationAccount!.accountName}</strong> ({defaultDonationAccount!.bankName} · {defaultDonationAccount!.accountNumber}).
                Look for the <strong>Default</strong> badge in the table to verify.
              </AlertDescription>
            </Alert>
          )}

          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Account Name</TableHead>
                <TableHead>Bank</TableHead>
                <TableHead>Account No.</TableHead>
                <TableHead>IFSC</TableHead>
                <TableHead>Gateway ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bankAccounts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-sm text-muted-foreground">
                    No accounts yet. Click <strong>Add Account</strong> to add your temple bank account.
                  </TableCell>
                </TableRow>
              ) : (
                bankAccounts.map((account) => (
                  <TableRow key={account.id}>
                    <TableCell className="font-medium">
                      <div className="space-y-1">
                        <span>{account.accountName}</span>
                        <div className="flex flex-wrap gap-1">
                          {account.eightyGLink !== "Non-80G" && (
                            <Badge variant="outline" className="text-[10px]">
                              {account.eightyGLink === "80G" ? "80G" : "80G & Non-80G"}
                            </Badge>
                          )}
                          {account.isDefaultDonation && (
                            <Badge variant="outline" className="text-[10px]">Default</Badge>
                          )}
                          {account.isDefaultSeva && (
                            <Badge variant="outline" className="text-[10px]">Seva</Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{account.bankName}</TableCell>
                    <TableCell className="font-mono text-xs">{account.accountNumber}</TableCell>
                    <TableCell className="font-mono text-xs">{account.ifscCode || "—"}</TableCell>
                    <TableCell>
                      {account.gatewayAccountId ? (
                        <Badge variant="outline" className="font-mono text-[10px] gap-1">
                          <Link2 className="h-3 w-3" />
                          {account.gatewayAccountId}
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={account.status === "Active" ? "default" : "secondary"} className="text-xs">
                        {account.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditBank(account)}>
                            <Edit className="h-4 w-4 mr-2" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleOpenAccountId(account.id)}>
                            <Link2 className="h-4 w-4 mr-2" />
                            {account.gatewayAccountId ? "Edit" : "Add"} Gateway ID
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setBankAccounts(
                                bankAccounts.map((acc) =>
                                  acc.id === account.id
                                    ? { ...acc, status: acc.status === "Active" ? "Paused" : "Active" }
                                    : acc
                                )
                              );
                              toast.success(`Account ${account.status === "Active" ? "paused" : "activated"}`);
                            }}
                          >
                            {account.status === "Active" ? (
                              <>
                                <XCircle className="h-4 w-4 mr-2" /> Pause
                              </>
                            ) : (
                              <>
                                <CheckCircle2 className="h-4 w-4 mr-2" /> Activate
                              </>
                            )}
                          </DropdownMenuItem>
                          {bankAccounts.length > 1 && (
                            <DropdownMenuItem
                              onClick={() => handleDeleteBank(account.id)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" /> Delete
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {bankStepDone && isFinanceSetupComplete() && (
            <p className="text-xs text-green-700 flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5" /> Bank setup complete — amounts will credit your default account
            </p>
          )}
        </CardContent>
      </Card>
        </TabsContent>

        <TabsContent value="80g" className="mt-4 space-y-4">
      <Card className={`max-w-2xl ${eightyGStepDone && eightyGEnabled ? "border-green-200/80" : ""}`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2 flex-wrap w-full">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                80G for donors
              </CardTitle>
              <CardDescription>Tax certificates from registration — separate from bank accounts</CardDescription>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {eightyGEnabled && eightyGReady && (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  {eightyGStatus}
                </Badge>
              )}
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={() => {
                  download80GBlankTemplatePdf();
                  toast.success("Blank 80G template downloaded");
                }}
              >
                <FileText className="h-3.5 w-3.5" />
                Blank template
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="border-muted bg-muted/30">
            <Info className="h-4 w-4" />
            <AlertTitle className="text-sm">80G vs bank account</AlertTitle>
            <AlertDescription className="text-xs space-y-1">
              {reg80GChoice === "yes" ? (
                <p>You registered with 80G — certificate details are shown below when complete.</p>
              ) : reg80GChoice === "no" ? (
                <p>You chose No 80G at registration — this tab is optional unless you obtained 80G later.</p>
              ) : (
                <p>Configure 80G here if your temple is registered under Section 80G.</p>
              )}
              <p>
                80G only issues tax certificates when a donor has PAN. Payment still goes to your{" "}
                <button type="button" className="underline font-medium" onClick={() => setActiveTab("bank")}>
                  default bank account
                </button>
                {hasDefaultDonationAccount ? "." : " (not set yet — configure in Bank Accounts tab)."}
              </p>
            </AlertDescription>
          </Alert>

          {show80GRegSummary && (
            <div className="rounded-lg bg-green-50/80 border border-green-200/80 px-4 py-3 space-y-2">
              <p className="text-sm font-medium text-green-900 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Already set up at registration
              </p>
              <p className="text-xs text-green-800/90">
                {eightyGForm.registration80G} · PAN {eightyGForm.pan} · Valid{" "}
                {format80GValidity(eightyGForm.validityFrom, eightyGForm.validityTo)}
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <Button variant="outline" size="sm" onClick={() => navigate("/temple/donations/80g")}>
                  <ExternalLink className="h-3.5 w-3.5 mr-1" /> View certificates
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setEightyGEditing(true)}>
                  <Pencil className="h-3.5 w-3.5 mr-1" /> Edit
                </Button>
              </div>
            </div>
          )}

          {show80GSkipped && (
            <div className="rounded-lg bg-muted/40 px-4 py-3 space-y-2">
              <p className="text-sm font-medium">You chose &quot;No 80G&quot; at registration</p>
              <p className="text-xs text-muted-foreground">Nothing to do unless you got 80G registration later.</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setEightyGEnabled(true);
                  setEightyGEditing(true);
                }}
              >
                I have 80G now — add details
              </Button>
            </div>
          )}

          {show80GForm && (
            <div className="space-y-3">
              {eightyGEditing && reg80GChoice === "yes" && (
                <p className="text-xs text-muted-foreground">Update your 80G details</p>
              )}
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2 space-y-1.5">
                  <Label className="text-xs">80G registration number</Label>
                  <Input
                    value={eightyGForm.registration80G}
                    onChange={(e) => setEightyGForm({ ...eightyGForm, registration80G: e.target.value })}
                    placeholder="AAATS1234A/80G/2023-24"
                    className="font-mono text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Temple PAN</Label>
                  <Input
                    value={eightyGForm.pan}
                    onChange={(e) =>
                      setEightyGForm({
                        ...eightyGForm,
                        pan: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10),
                      })
                    }
                    maxLength={10}
                    className="font-mono uppercase text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Signatory (optional)</Label>
                  <Input
                    value={eightyGForm.signatory}
                    onChange={(e) => setEightyGForm({ ...eightyGForm, signatory: e.target.value })}
                    className="text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Valid from</Label>
                  <Input
                    type="date"
                    value={eightyGForm.validityFrom}
                    onChange={(e) => setEightyGForm({ ...eightyGForm, validityFrom: e.target.value })}
                    className="text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Valid to</Label>
                  <Input
                    type="date"
                    value={eightyGForm.validityTo}
                    min={eightyGForm.validityFrom || undefined}
                    onChange={(e) => setEightyGForm({ ...eightyGForm, validityTo: e.target.value })}
                    className="text-sm"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleSave80G}>
                  Save 80G
                </Button>
                {eightyGEditing && (
                  <Button size="sm" variant="outline" onClick={() => setEightyGEditing(false)}>
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={showAccountIdModal} onOpenChange={setShowAccountIdModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Link2 className="h-4 w-4" /> Link Payment Gateway
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <p className="text-sm text-muted-foreground">
              Razorpay or other gateway account ID for online donations and seva payments.
            </p>
            <div>
              <Label>Gateway Account ID</Label>
              <Input
                value={gatewayAccountId}
                onChange={(e) => setGatewayAccountId(e.target.value)}
                placeholder="e.g., acc_XXXXXXXXXX"
                className="font-mono"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => setShowAccountIdModal(false)}>
              Cancel
            </Button>
            <Button className="flex-1" onClick={handleSaveAccountId}>
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FinanceSettings;
