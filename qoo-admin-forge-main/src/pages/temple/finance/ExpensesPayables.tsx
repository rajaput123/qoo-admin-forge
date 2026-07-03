import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Filter, FileText, CheckCircle, Clock } from "lucide-react";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import FinanceDateFilter, { type DateRange } from "@/components/finance/FinanceDateFilter";

const expenses = [
    { id: "EXP-2024-001", vendor: "City Flowers", amount: 12000, date: "2024-02-12", dueDate: "2024-02-19", category: "Festival Expenses", status: "Pending", description: "Flowers for Vaikunta Ekadashi" },
    { id: "EXP-2024-002", vendor: "Power Grid Corp", amount: 45000, date: "2024-02-10", dueDate: "2024-02-15", category: "Utilities", status: "Approved", description: "January Electricity Bill" },
    { id: "EXP-2024-003", vendor: "Sri Krishna Security", amount: 28000, date: "2024-02-01", dueDate: "2024-02-05", category: "Security", status: "Paid", description: "Security Guard Services" },
];

const ExpensesPayables = () => {
    const [activeTab, setActiveTab] = useState("all");
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [dateRange, setDateRange] = useState<DateRange>({ from: null, to: null });
    const itemsPerPage = 5;

    const filtered = expenses.filter(e => {
        const matchesSearch = e.vendor.toLowerCase().includes(search.toLowerCase()) || e.id.toLowerCase().includes(search.toLowerCase());
        if (activeTab === "all" && !matchesSearch) return false;
        if (activeTab !== "all" && !(matchesSearch && e.status.toLowerCase() === activeTab)) return false;
        if (dateRange.from || dateRange.to) {
            const d = new Date(e.date);
            if (dateRange.from && d < dateRange.from) return false;
            if (dateRange.to && d > dateRange.to) return false;
        }
        return true;
    });

    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const paginatedExpenses = filtered.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Expenses & Payables</h1>
                    <p className="text-muted-foreground">Manage vendor invoices and operational expenses</p>
                </div>
                <Button className="gap-2">
                    <Plus className="h-4 w-4" /> Record Expense
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
                        <Clock className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹12,000</div>
                        <p className="text-xs text-muted-foreground">1 invoice pending</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Due for Payment</CardTitle>
                        <FileText className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹45,000</div>
                        <p className="text-xs text-muted-foreground">Due within 7 days</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Paid This Month</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹28,000</div>
                        <p className="text-xs text-muted-foreground">Last updated yesterday</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader className="pb-3">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-[400px]">
                            <TabsList>
                                <TabsTrigger value="all">All</TabsTrigger>
                                <TabsTrigger value="pending">Pending</TabsTrigger>
                                <TabsTrigger value="approved">Approved</TabsTrigger>
                                <TabsTrigger value="paid">Paid</TabsTrigger>
                            </TabsList>
                        </Tabs>
                        <div className="flex items-center gap-2">
                            <FinanceDateFilter onDateRangeChange={setDateRange} />
                            <div className="relative w-64">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="Search expenses..." value={search} onChange={e => setSearch(e.target.value)} className="pl-8" />
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Invoice ID</TableHead>
                                <TableHead>Vendor</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Due Date</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedExpenses.map(expense => (
                                <TableRow key={expense.id}>
                                    <TableCell className="font-mono text-xs">{expense.id}</TableCell>
                                    <TableCell className="font-medium">{expense.vendor}</TableCell>
                                    <TableCell><Badge variant="outline">{expense.category}</Badge></TableCell>
                                    <TableCell className="text-sm text-muted-foreground truncate max-w-[200px]">{expense.description}</TableCell>
                                    <TableCell className="text-sm">{expense.dueDate}</TableCell>
                                    <TableCell className="text-right font-medium">₹{expense.amount.toLocaleString()}</TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className={
                                            expense.status === "Paid" ? "bg-green-100 text-green-700" :
                                                expense.status === "Approved" ? "bg-blue-100 text-blue-700" :
                                                    "bg-amber-100 text-amber-700"
                                        }>{expense.status}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="ghost" size="sm">View</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {totalPages > 1 && (
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
            )}
        </motion.div>
    );
};

export default ExpensesPayables;
