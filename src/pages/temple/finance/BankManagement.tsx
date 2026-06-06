import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Building2, Wallet, ArrowRight, Plus, RefreshCw, AlertCircle, CheckCircle } from "lucide-react";
import { financeSelectors } from "@/modules/finance/financeStore";

const BankManagement = () => {
    const accounts = financeSelectors.getAccounts();
    const bankAccounts = financeSelectors.getBankAccounts();
    const cashAccount = accounts.find(a => a.name === "Cash on Hand");

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="flex items-center justify-between">
                <p className="text-muted-foreground">Monitor liquidity, bank accounts, and perform reconciliations</p>
                <Button className="gap-2">
                    <Plus className="h-4 w-4" /> Add Bank Account
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Cash Box */}
                <Card className="border-l-4 border-l-green-500">
                    <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                            <Badge variant="outline" className="flex gap-1 items-center"><Wallet className="h-3 w-3" /> Cash</Badge>
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Active</Badge>
                        </div>
                        <CardTitle className="text-lg mt-2">Temple Cash Box</CardTitle>
                        <CardDescription>Main Hundi & Office Cash</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="mt-2">
                            <p className="text-sm text-muted-foreground mb-1">Current Balance</p>
                            <p className="text-3xl font-bold tracking-tight">₹{cashAccount?.currentBalance.toLocaleString() ?? "0"}</p>
                        </div>
                    </CardContent>
                    <CardFooter className="bg-muted/20 border-t p-3">
                        <Button variant="ghost" size="sm" className="w-full text-xs gap-1">View Ledger <ArrowRight className="h-3 w-3" /></Button>
                    </CardFooter>
                </Card>

                {/* Bank Accounts */}
                {bankAccounts.map(bank => (
                    <Card key={bank.id} className="border-l-4 border-l-blue-500">
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                                <Badge variant="outline" className="flex gap-1 items-center"><Building2 className="h-3 w-3" /> Bank</Badge>
                                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Connected</Badge>
                            </div>
                            <CardTitle className="text-lg mt-2">{bank.name}</CardTitle>
                            <CardDescription>{bank.bankName} • {bank.accountNumber}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="mt-2">
                                <p className="text-sm text-muted-foreground mb-1">Ledger Balance</p>
                                <p className="text-3xl font-bold tracking-tight">₹{(financeSelectors.getAccountById(bank.linkedLedgerAccountId)?.currentBalance || 0).toLocaleString()}</p>
                            </div>
                            <div className="mt-4 space-y-2">
                                <div className="flex justify-between text-xs">
                                    <span className="text-muted-foreground">Reconciliation Status</span>
                                    <span className="text-amber-600 font-medium flex items-center gap-1"><AlertCircle className="h-3 w-3" /> Pending (Jan)</span>
                                </div>
                                <Progress value={85} className="h-1.5" />
                            </div>
                        </CardContent>
                        <CardFooter className="bg-muted/20 border-t p-3 grid grid-cols-2 gap-2">
                            <Button variant="outline" size="sm" className="w-full text-xs gap-1"><RefreshCw className="h-3 w-3" /> Reconcile</Button>
                            <Button variant="ghost" size="sm" className="w-full text-xs gap-1">View Ledger <ArrowRight className="h-3 w-3" /></Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Reconciliation History</CardTitle>
                    <CardDescription>Past bank reconciliation statements</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {[
                            { month: "December 2023", bank: "SBI Main Account", status: "Reconciled", date: "2024-01-05", by: "Admin User" },
                            { month: "November 2023", bank: "SBI Main Account", status: "Reconciled", date: "2023-12-04", by: "Admin User" },
                            { month: "December 2023", bank: "HDFC Projects", status: "Reconciled", date: "2024-01-05", by: "Admin User" },
                        ].map((rec, i) => (
                            <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-green-100 rounded-full"><CheckCircle className="h-4 w-4 text-green-600" /></div>
                                    <div>
                                        <p className="font-medium text-sm">{rec.month}</p>
                                        <p className="text-xs text-muted-foreground">{rec.bank}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">{rec.status}</Badge>
                                    <p className="text-xs text-muted-foreground mt-1">On {rec.date} by {rec.by}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default BankManagement;
