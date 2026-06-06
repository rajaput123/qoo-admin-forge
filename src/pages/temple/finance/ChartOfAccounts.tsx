import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Building, Wallet, ArrowUpRight, ArrowDownLeft, Lock } from "lucide-react";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { financeSelectors, financeActions } from "@/modules/finance/financeStore";
import { toast } from "sonner";
import { AccountType } from "@/modules/finance/types";
import { FinanceTableRadioGroup, FinanceTableRadioHead, FinanceTableRadioCell } from "@/components/finance/FinanceTableRadio";

const ChartOfAccounts = () => {
    const accounts = financeSelectors.getAccounts();
    const [activeTab, setActiveTab] = useState<AccountType | "All">("All");
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [showAdd, setShowAdd] = useState(false);
    const [selectedId, setSelectedId] = useState("");
    const [newAccount, setNewAccount] = useState({
        name: "",
        code: "",
        type: "Income" as AccountType,
        parentAccount: "I-4000",
        description: "",
    });

    const filtered = accounts.filter(a => {
        const matchesTab = activeTab === "All" || a.type === activeTab;
        const matchesSearch = a.name.toLowerCase().includes(search.toLowerCase()) || a.code.includes(search);
        return matchesTab && matchesSearch;
    });

    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const paginatedAccounts = filtered.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleAddAccount = () => {
        if (!newAccount.name || !newAccount.code) {
            toast.error("Name and Code are required");
            return;
        }
        try {
            financeActions.addAccount({
                name: newAccount.name,
                code: newAccount.code,
                type: newAccount.type,
                parentAccount: newAccount.parentAccount,
                description: newAccount.description,
            });
            toast.success("Account created successfully");
            setShowAdd(false);
            setNewAccount({ name: "", code: "", type: "Income", parentAccount: "", description: "" });
        } catch (e: any) {
            toast.error(e.message);
        }
    };

    const getParentOptions = (type: AccountType) => {
        return accounts.filter(a => a.type === type && a.isSystem); // Only allow nesting under system accounts for now
    };

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="flex items-center justify-between">
                <p className="text-muted-foreground">Manage your general ledger accounts and hierarchy</p>
                <Button onClick={() => setShowAdd(true)} className="gap-2">
                    <Plus className="h-4 w-4" /> Add Account
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Total Assets</CardTitle></CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{accounts.filter(a => a.type === "Asset").reduce((s, a) => s + a.currentBalance, 0).toLocaleString()}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">YTD Income</CardTitle></CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">₹{accounts.filter(a => a.type === "Income").reduce((s, a) => s + a.currentBalance, 0).toLocaleString()}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">YTD Expenses</CardTitle></CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">₹{accounts.filter(a => a.type === "Expense").reduce((s, a) => s + a.currentBalance, 0).toLocaleString()}</div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle>Accounts Registry</CardTitle>
                        <div className="relative w-64">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search accounts..." value={search} onChange={e => setSearch(e.target.value)} className="pl-8" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)} className="w-full">
                        <TabsList className="mb-4">
                            <TabsTrigger value="All">All</TabsTrigger>
                            <TabsTrigger value="Asset">Assets</TabsTrigger>
                            <TabsTrigger value="Liability">Liabilities</TabsTrigger>
                            <TabsTrigger value="Equity">Equity</TabsTrigger>
                            <TabsTrigger value="Income">Income</TabsTrigger>
                            <TabsTrigger value="Expense">Expenses</TabsTrigger>
                        </TabsList>

                        <div className="rounded-md border">
                            <FinanceTableRadioGroup value={selectedId} onValueChange={setSelectedId}>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <FinanceTableRadioHead />
                                        <TableHead className="w-[100px]">Code</TableHead>
                                        <TableHead>Account Name</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Parent Account</TableHead>
                                        <TableHead className="text-right">Balance</TableHead>
                                        <TableHead className="w-[50px]"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filtered.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">No accounts found</TableCell>
                                        </TableRow>
                                    ) : (
                                        paginatedAccounts.map(account => (
                                            <TableRow key={account.id} className="hover:bg-muted/50 cursor-pointer" onClick={() => setSelectedId(account.id)}>
                                                <FinanceTableRadioCell value={account.id} />
                                                <TableCell className="font-mono text-xs">{account.code}</TableCell>
                                                <TableCell className="font-medium">
                                                    <div className="flex items-center gap-2">
                                                        {account.name}
                                                        {account.isSystem && <Lock className="h-3 w-3 text-muted-foreground" />}
                                                    </div>
                                                </TableCell>
                                                <TableCell><Badge variant="outline">{account.type}</Badge></TableCell>
                                                <TableCell className="text-sm text-muted-foreground">
                                                    {accounts.find(p => p.id === account.parentAccount)?.name || "-"}
                                                </TableCell>
                                                <TableCell className="text-right font-mono">
                                                    {account.currentBalance !== 0 ? `₹${account.currentBalance.toLocaleString()}` : "-"}
                                                </TableCell>
                                                <TableCell></TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                            </FinanceTableRadioGroup>
                        </div>
                    </Tabs>
                </CardContent>
                {totalPages > 1 && (
                    <div className="py-4 border-t">
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                    />
                                </PaginationItem>
                                {Array.from({ length: totalPages }).map((_, i) => (
                                    <PaginationItem key={i}>
                                        <PaginationLink
                                            isActive={currentPage === i + 1}
                                            onClick={() => setCurrentPage(i + 1)}
                                            className="cursor-pointer"
                                        >
                                            {i + 1}
                                        </PaginationLink>
                                    </PaginationItem>
                                ))}
                                <PaginationItem>
                                    <PaginationNext
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                )}
            </Card>

            <Dialog open={showAdd} onOpenChange={setShowAdd}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Account</DialogTitle>
                        <DialogDescription>Create a new ledger account for tracking specific financial activities.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Account Type</Label>
                                <Select value={newAccount.type} onValueChange={(v: AccountType) => setNewAccount({ ...newAccount, type: v, parentAccount: "" })}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Income">Income</SelectItem>
                                        <SelectItem value="Expense">Expense</SelectItem>
                                        <SelectItem value="Asset">Asset</SelectItem>
                                        <SelectItem value="Liability">Liability</SelectItem>
                                        <SelectItem value="Equity">Equity</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Account Code</Label>
                                <Input placeholder="e.g. 5006" value={newAccount.code} onChange={e => setNewAccount({ ...newAccount, code: e.target.value })} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Account Name</Label>
                            <Input placeholder="e.g. Flower Expenses" value={newAccount.name} onChange={e => setNewAccount({ ...newAccount, name: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Purpose</Label>
                            <Input placeholder="e.g. Track flower purchase expenses" value={newAccount.description} onChange={e => setNewAccount({ ...newAccount, description: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Parent Account (Optional)</Label>
                            <Select value={newAccount.parentAccount} onValueChange={v => setNewAccount({ ...newAccount, parentAccount: v })}>
                                <SelectTrigger><SelectValue placeholder="Select parent category" /></SelectTrigger>
                                <SelectContent>
                                    {getParentOptions(newAccount.type).map(p => (
                                        <SelectItem key={p.id} value={p.id}>{p.name} ({p.code})</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
                        <Button onClick={handleAddAccount}>Create Account</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </motion.div >
    );
};

export default ChartOfAccounts;
