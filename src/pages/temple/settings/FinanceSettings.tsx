import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash2, Edit, CheckCircle2, XCircle, Building2, CreditCard, Calendar, MoreHorizontal, Link2, Eye, Shield, Landmark } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  getTempleConfig,
  saveTempleConfig,
  markFinanceSetupComplete,
  format80GValidity,
} from "@/lib/templeConfig";

const BANKS_LS_KEY = "qoo.finance.banks";

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
  isDefaultDonation: boolean;
  isDefaultSeva: boolean;
  status: "Active" | "Paused";
}

const PURPOSE_OPTIONS = ["Donations", "Seva Payments", "Event Payments", "Salaries", "General Expenses", "Project Funds"];

const defaultBankAccounts: BankAccount[] = [
    {
      id: "BANK-001",
      accountName: "Main Temple Account",
      bankName: "State Bank of India",
      accountNumber: "****1234",
      ifscCode: "SBIN0001234",
      branch: "Tirupati Main Branch",
      isPrimary: true,
      panNumber: "ABCDE1234F",
      isDefaultDonation: true,
      isDefaultSeva: false,
      purpose: "Donations, Seva Payments",
      status: "Active",
    },
    {
      id: "BANK-002",
      accountName: "Donation Account",
      bankName: "HDFC Bank",
      accountNumber: "****5678",
      ifscCode: "HDFC0005678",
      branch: "Tirupati Branch",
      isPrimary: false,
      panNumber: "",
      isDefaultDonation: false,
      isDefaultSeva: true,
      purpose: "Event Payments",
      status: "Active",
    },
];

function loadBankAccounts(): BankAccount[] {
  if (typeof window === "undefined") return defaultBankAccounts;
  try {
    const raw = localStorage.getItem(BANKS_LS_KEY);
    if (raw) return JSON.parse(raw) as BankAccount[];
  } catch {
    /* ignore */
  }
  return defaultBankAccounts;
}

const FinanceSettings = () => {
  const navigate = useNavigate();
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(loadBankAccounts);
  const templeCfg = getTempleConfig();
  const [associatedBankId, setAssociatedBankId] = useState<string>(
    templeCfg.associatedBankAccountId || defaultBankAccounts.find(b => b.isPrimary)?.id || ""
  );
  const [eightyGEnabled, setEightyGEnabled] = useState(templeCfg.eightyGEnabled);
  const [eightyGForm, setEightyGForm] = useState({
    registration80G: templeCfg.registration80G,
    pan: templeCfg.pan,
    validityFrom: templeCfg.validityFrom,
    validityTo: templeCfg.validityTo,
  });
  const [showAddBank, setShowAddBank] = useState(false);
  const [editingBank, setEditingBank] = useState<BankAccount | null>(null);
  const [bankForm, setBankForm] = useState({
    accountName: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    branch: "",
    purpose: "",
    panNumber: "",
    isDefaultDonation: false,
    isDefaultSeva: false,
  });
  const [taxInfo, setTaxInfo] = useState({
    gstNumber: "29ABCDE1234F1Z5",
    panNumber: "ABCDE1234F",
    tanNumber: "",
    otherTaxIds: "",
  });
  const [panVerified, setPanVerified] = useState(true);
  const [currency, setCurrency] = useState("INR");
  const [showAccountIdModal, setShowAccountIdModal] = useState(false);
  const [accountIdTarget, setAccountIdTarget] = useState<string | null>(null);
  const [gatewayAccountId, setGatewayAccountId] = useState("");
  const [financialYear, setFinancialYear] = useState("2024-2025");

  useEffect(() => {
    localStorage.setItem(BANKS_LS_KEY, JSON.stringify(bankAccounts));
  }, [bankAccounts]);

  const handleSaveFinanceSetup = () => {
    if (!associatedBankId) {
      toast.error("Please select an associated bank account");
      return;
    }
    if (eightyGEnabled && (!eightyGForm.registration80G || eightyGForm.pan.length !== 10)) {
      toast.error("Please provide valid 80G registration number and PAN");
      return;
    }
    saveTempleConfig({
      associatedBankAccountId: associatedBankId,
      eightyGEnabled,
      registration80G: eightyGForm.registration80G,
      pan: eightyGForm.pan.toUpperCase(),
      validityFrom: eightyGForm.validityFrom,
      validityTo: eightyGForm.validityTo,
    });
    markFinanceSetupComplete();
    localStorage.removeItem("financeSetupPromptDismissed");
    toast.success("Finance setup saved successfully");
  };

  const handleAddBank = () => {
    if (!bankForm.accountName || !bankForm.bankName || !bankForm.accountNumber) {
      toast.error("Please fill required fields");
      return;
    }
    // If setting as default donation, unset others
    let updatedAccounts = [...bankAccounts];
    if (bankForm.isDefaultDonation) {
      updatedAccounts = updatedAccounts.map(a => ({ ...a, isDefaultDonation: false }));
    }
    if (bankForm.isDefaultSeva) {
      updatedAccounts = updatedAccounts.map(a => ({ ...a, isDefaultSeva: false }));
    }
    const newAccount: BankAccount = {
      id: `BANK-${String(bankAccounts.length + 1).padStart(3, "0")}`,
      ...bankForm,
      isPrimary: bankAccounts.length === 0,
      status: "Active",
    };
    setBankAccounts([...updatedAccounts, newAccount]);
    setBankForm({ accountName: "", bankName: "", accountNumber: "", ifscCode: "", branch: "", purpose: "", panNumber: "", isDefaultDonation: false, isDefaultSeva: false });
    setShowAddBank(false);
    toast.success("Bank account added successfully");
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
      isDefaultDonation: account.isDefaultDonation,
      isDefaultSeva: account.isDefaultSeva,
    });
    setShowAddBank(true);
  };

  const handleUpdateBank = () => {
    if (!editingBank) return;
    let updated = bankAccounts.map(acc => 
      acc.id === editingBank.id ? { ...acc, ...bankForm } : acc
    );
    // If setting as default, unset others
    if (bankForm.isDefaultDonation) {
      updated = updated.map(a => a.id === editingBank.id ? a : { ...a, isDefaultDonation: false });
    }
    if (bankForm.isDefaultSeva) {
      updated = updated.map(a => a.id === editingBank.id ? a : { ...a, isDefaultSeva: false });
    }
    setBankAccounts(updated);
    setShowAddBank(false);
    setEditingBank(null);
    setBankForm({ accountName: "", bankName: "", accountNumber: "", ifscCode: "", branch: "", purpose: "", panNumber: "", isDefaultDonation: false, isDefaultSeva: false });
    toast.success("Bank account updated successfully");
  };

  const handleDeleteBank = (id: string) => {
    if (bankAccounts.find(acc => acc.id === id)?.isPrimary) {
      toast.error("Cannot delete primary account");
      return;
    }
    setBankAccounts(bankAccounts.filter(acc => acc.id !== id));
    toast.success("Bank account deleted");
  };

  const handleSetPrimary = (id: string) => {
    setBankAccounts(bankAccounts.map(acc => ({
      ...acc,
      isPrimary: acc.id === id,
    })));
    toast.success("Primary account updated");
  };

  const handleOpenAccountId = (accountId: string) => {
    const account = bankAccounts.find(a => a.id === accountId);
    setAccountIdTarget(accountId);
    setGatewayAccountId(account?.gatewayAccountId || "");
    setShowAccountIdModal(true);
  };

  const handleSaveAccountId = () => {
    if (!accountIdTarget) return;
    setBankAccounts(bankAccounts.map(acc =>
      acc.id === accountIdTarget ? { ...acc, gatewayAccountId: gatewayAccountId.trim() || undefined } : acc
    ));
    setShowAccountIdModal(false);
    setAccountIdTarget(null);
    setGatewayAccountId("");
    toast.success("Gateway Account ID saved successfully");
  };

  const handleSaveTaxInfo = () => {
    toast.success("Tax information saved successfully");
  };

  const handleVerifyPAN = () => {
    setPanVerified(true);
    toast.success("PAN verified successfully");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Finance Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">Configure financial operations and bank accounts</p>
        </div>
        <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={() => navigate("/temple/finance/accounts")}>
          <Eye className="h-3.5 w-3.5" />
          View Accounts
        </Button>
      </div>

      {/* Associated Bank Account & 80G */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Landmark className="h-4 w-4" /> Finance Onboarding
          </CardTitle>
          <CardDescription>
            Link your primary bank account and configure 80G for donation receipts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="mb-2 block">Associated Bank Account *</Label>
            <Select value={associatedBankId} onValueChange={setAssociatedBankId}>
              <SelectTrigger>
                <SelectValue placeholder="Select bank account for donations & payouts" />
              </SelectTrigger>
              <SelectContent>
                {bankAccounts.map((acc) => (
                  <SelectItem key={acc.id} value={acc.id}>
                    {acc.accountName} — {acc.bankName} ({acc.accountNumber})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1.5">
              This account is used for online donations, NEFT payouts and finance reconciliation.
            </p>
          </div>

          <div className="rounded-lg border p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  Enable 80G
                </Label>
                <p className="text-xs text-muted-foreground">
                  When enabled, eligible donations auto-generate 80G certificates
                </p>
              </div>
              <Switch checked={eightyGEnabled} onCheckedChange={setEightyGEnabled} />
            </div>

            {eightyGEnabled && (
              <div className="grid md:grid-cols-2 gap-4 pt-2 border-t">
                <div className="md:col-span-2">
                  <Label>80G Registration Number</Label>
                  <Input
                    value={eightyGForm.registration80G}
                    onChange={(e) => setEightyGForm({ ...eightyGForm, registration80G: e.target.value })}
                    placeholder="AAATS1234A/80G/2023-24"
                  />
                </div>
                <div>
                  <Label>PAN</Label>
                  <Input
                    value={eightyGForm.pan}
                    onChange={(e) => setEightyGForm({ ...eightyGForm, pan: e.target.value.toUpperCase() })}
                    maxLength={10}
                    className="font-mono uppercase"
                  />
                </div>
                <div>
                  <Label>Validity Period</Label>
                  <p className="text-sm text-muted-foreground mt-2">
                    {eightyGForm.validityFrom && eightyGForm.validityTo
                      ? format80GValidity(eightyGForm.validityFrom, eightyGForm.validityTo)
                      : "Not set"}
                  </p>
                </div>
                <div>
                  <Label>Valid From</Label>
                  <Input
                    type="date"
                    value={eightyGForm.validityFrom}
                    onChange={(e) => setEightyGForm({ ...eightyGForm, validityFrom: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Valid To</Label>
                  <Input
                    type="date"
                    value={eightyGForm.validityTo}
                    min={eightyGForm.validityFrom || undefined}
                    onChange={(e) => setEightyGForm({ ...eightyGForm, validityTo: e.target.value })}
                  />
                </div>
              </div>
            )}
          </div>

          <Button onClick={handleSaveFinanceSetup}>Save Finance Setup</Button>
        </CardContent>
      </Card>

      {/* Bank Account Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Building2 className="h-4 w-4" /> Bank Account Management
            </CardTitle>
            <Dialog open={showAddBank} onOpenChange={setShowAddBank}>
              <DialogTrigger asChild>
                <Button size="sm" onClick={() => { setEditingBank(null); setBankForm({ accountName: "", bankName: "", accountNumber: "", ifscCode: "", branch: "", purpose: "", panNumber: "", isDefaultDonation: false, isDefaultSeva: false }); }}>
                  <Plus className="h-4 w-4 mr-2" /> Add Account
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[85vh] flex flex-col">
                <DialogHeader>
                  <DialogTitle>{editingBank ? "Edit Bank Account" : "Add Bank Account"}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4 overflow-y-auto flex-1 pr-1">
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
                    />
                  </div>
                  <div>
                    <Label>IFSC Code</Label>
                    <Input
                      value={bankForm.ifscCode}
                      onChange={(e) => setBankForm({ ...bankForm, ifscCode: e.target.value })}
                      placeholder="e.g., SBIN0001234"
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
                  <div>
                    <Label>Purpose / Tags</Label>
                    <div className="flex flex-wrap gap-2 mt-1.5">
                      {PURPOSE_OPTIONS.map(tag => {
                        const selected = bankForm.purpose.split(", ").filter(Boolean).includes(tag);
                        return (
                          <Badge
                            key={tag}
                            variant={selected ? "default" : "outline"}
                            className="cursor-pointer text-xs"
                            onClick={() => {
                              const current = bankForm.purpose.split(", ").filter(Boolean);
                              const updated = selected
                                ? current.filter(t => t !== tag)
                                : [...current, tag];
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
                    <Label>PAN Number</Label>
                    <Input
                      value={bankForm.panNumber}
                      onChange={(e) => setBankForm({ ...bankForm, panNumber: e.target.value.toUpperCase() })}
                      placeholder="e.g., ABCDE1234F"
                      maxLength={10}
                    />
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <Label className="text-sm font-medium">Default Donation Account</Label>
                      <p className="text-xs text-muted-foreground">This will be the default account used for receiving all donations</p>
                    </div>
                    <Switch
                      checked={bankForm.isDefaultDonation}
                      onCheckedChange={(checked) => setBankForm({ ...bankForm, isDefaultDonation: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <Label className="text-sm font-medium">Default Seva Account</Label>
                      <p className="text-xs text-muted-foreground">This will be the default account used for receiving all seva payments</p>
                    </div>
                    <Switch
                      checked={bankForm.isDefaultSeva}
                      onCheckedChange={(checked) => setBankForm({ ...bankForm, isDefaultSeva: checked })}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
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
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Account Name</TableHead>
                <TableHead>Bank Name</TableHead>
                <TableHead>Account Number</TableHead>
                <TableHead>IFSC Code</TableHead>
                <TableHead>Gateway ID</TableHead>
                <TableHead>Purpose</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bankAccounts.map(account => (
                <TableRow key={account.id}>
                  <TableCell className="font-medium">
                    <div className="space-y-1">
                      <span>{account.accountName}</span>
                      <div className="flex flex-wrap gap-1">
                        {account.panNumber && (
                          <Badge variant="outline" className="text-xs font-mono">PAN: {account.panNumber}</Badge>
                        )}
                        {account.isDefaultDonation && (
                          <Badge className="text-xs bg-green-100 text-green-700 hover:bg-green-100">Default Donation</Badge>
                        )}
                        {account.isDefaultSeva && (
                          <Badge className="text-xs bg-blue-100 text-blue-700 hover:bg-blue-100">Default Seva</Badge>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{account.bankName}</TableCell>
                  <TableCell className="font-mono text-xs">{account.accountNumber}</TableCell>
                  <TableCell className="font-mono text-xs">{account.ifscCode}</TableCell>
                  <TableCell>
                    {account.gatewayAccountId ? (
                      <Badge variant="outline" className="font-mono text-xs gap-1">
                        <Link2 className="h-3 w-3" />
                        {account.gatewayAccountId}
                      </Badge>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {account.purpose ? (
                      <div className="flex flex-wrap gap-1">
                        {account.purpose.split(", ").map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                        ))}
                      </div>
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
                          <Edit className="h-4 w-4 mr-2" /> Edit Account
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleOpenAccountId(account.id)}>
                          <Link2 className="h-4 w-4 mr-2" /> {account.gatewayAccountId ? "Edit" : "Add"} Account ID
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          setBankAccounts(bankAccounts.map(acc =>
                            acc.id === account.id ? { ...acc, status: acc.status === "Active" ? "Paused" : "Active" } : acc
                          ));
                          toast.success(`Account ${account.status === "Active" ? "paused" : "activated"}`);
                        }}>
                          {account.status === "Active" ? (
                            <><XCircle className="h-4 w-4 mr-2" /> Pause Account</>
                          ) : (
                            <><CheckCircle2 className="h-4 w-4 mr-2" /> Activate Account</>
                          )}
                        </DropdownMenuItem>
                        {!account.isPrimary && (
                          <DropdownMenuItem onClick={() => handleDeleteBank(account.id)} className="text-destructive focus:text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" /> Delete Account
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Account ID Modal */}
      <Dialog open={showAccountIdModal} onOpenChange={setShowAccountIdModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Link2 className="h-4 w-4" /> Link Payment Gateway Account
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              Enter the payment gateway account identifier (e.g., Razorpay Account ID) to link this bank account for processing donations, seva payments, and event transactions.
            </p>
            <div>
              <Label>Gateway Account ID *</Label>
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
              Save Account ID
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Tax Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <CreditCard className="h-4 w-4" /> Tax Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>GST Number</Label>
              <Input
                value={taxInfo.gstNumber}
                onChange={(e) => setTaxInfo({ ...taxInfo, gstNumber: e.target.value })}
                placeholder="29ABCDE1234F1Z5"
              />
            </div>
            <div>
              <Label>PAN Number</Label>
              <div className="flex items-center gap-2">
                <Input
                  value={taxInfo.panNumber}
                  onChange={(e) => setTaxInfo({ ...taxInfo, panNumber: e.target.value })}
                  placeholder="ABCDE1234F"
                  maxLength={10}
                />
                {panVerified ? (
                  <Badge variant="default" className="gap-1">
                    <CheckCircle2 className="h-3 w-3" /> Verified
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="gap-1">
                    <XCircle className="h-3 w-3" /> Not Verified
                  </Badge>
                )}
              </div>
              {!panVerified && (
                <Button variant="outline" size="sm" className="mt-2" onClick={handleVerifyPAN}>
                  Verify PAN
                </Button>
              )}
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>TAN Number</Label>
              <Input
                value={taxInfo.tanNumber}
                onChange={(e) => setTaxInfo({ ...taxInfo, tanNumber: e.target.value })}
                placeholder="Enter TAN number"
              />
            </div>
            <div>
              <Label>Other Tax IDs</Label>
              <Input
                value={taxInfo.otherTaxIds}
                onChange={(e) => setTaxInfo({ ...taxInfo, otherTaxIds: e.target.value })}
                placeholder="Enter other tax identification numbers"
              />
            </div>
          </div>
          <Button onClick={handleSaveTaxInfo}>Save Tax Information</Button>
        </CardContent>
      </Card>

      {/* Financial Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="h-4 w-4" /> Financial Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Default Currency</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INR">Indian Rupee (₹)</SelectItem>
                  <SelectItem value="USD">US Dollar ($)</SelectItem>
                  <SelectItem value="EUR">Euro (€)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Financial Year</Label>
              <Select value={financialYear} onValueChange={setFinancialYear}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2023-2024">2023-2024</SelectItem>
                  <SelectItem value="2024-2025">2024-2025</SelectItem>
                  <SelectItem value="2025-2026">2025-2026</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={() => toast.success("Financial settings saved")}>Save Settings</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinanceSettings;
