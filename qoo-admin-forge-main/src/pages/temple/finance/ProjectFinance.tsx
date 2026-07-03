import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FolderKanban, TrendingUp, TrendingDown, IndianRupee } from "lucide-react";

const formatCurrency = (val: number) => `₹${val.toLocaleString("en-IN")}`;

const projects = [
  { id: "PRJ-001", name: "Gopuram Renovation", budget: 8000000, income: 5450000, expense: 3200000, status: "Active" },
  { id: "PRJ-002", name: "Kitchen Upgrade", budget: 1200000, income: 920000, expense: 780000, status: "Active" },
  { id: "PRJ-003", name: "Parking Expansion", budget: 3500000, income: 1800000, expense: 1200000, status: "Active" },
  { id: "PRJ-004", name: "CCTV Installation", budget: 500000, income: 500000, expense: 480000, status: "Completed" },
];

const transactions = [
  { id: "TXN-P01", date: "2025-03-28", project: "Gopuram Renovation", type: "Donation", description: "Venkat Reddy - Project Donation", amount: 200000, direction: "Income" as const },
  { id: "TXN-P02", date: "2025-03-27", project: "Gopuram Renovation", type: "Expense", description: "Contractor Payment - Phase 2", amount: 350000, direction: "Expense" as const },
  { id: "TXN-P03", date: "2025-03-26", project: "Kitchen Upgrade", type: "Expense", description: "Kitchen Equipment Purchase", amount: 120000, direction: "Expense" as const },
  { id: "TXN-P04", date: "2025-03-25", project: "Parking Expansion", type: "Donation", description: "Trust Grant - Parking Fund", amount: 500000, direction: "Income" as const },
];

const ProjectFinance = () => {
  const [selectedProject, setSelectedProject] = useState("all");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <FolderKanban className="h-6 w-6 text-primary" /> Project Finance
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">Track project-wise income, expenses & funding status</p>
      </div>

      {/* Project Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map(p => {
          const net = p.income - p.expense;
          const fundingPct = Math.round((p.income / p.budget) * 100);
          return (
            <Card key={p.id} className={p.status === "Completed" ? "border-green-200 bg-green-50/20" : ""}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-sm">{p.name}</h3>
                    <Badge variant={p.status === "Completed" ? "default" : "secondary"} className="text-[10px] mt-1">{p.status}</Badge>
                  </div>
                  <span className="text-lg font-bold text-primary">{fundingPct}%</span>
                </div>
                <Progress value={fundingPct} className="h-2 mb-3" />
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-muted/30 rounded p-2">
                    <p className="text-muted-foreground">Budget</p>
                    <p className="font-bold">{formatCurrency(p.budget)}</p>
                  </div>
                  <div className="bg-green-50 rounded p-2">
                    <p className="text-green-600">Income</p>
                    <p className="font-bold text-green-700">{formatCurrency(p.income)}</p>
                  </div>
                  <div className="bg-red-50 rounded p-2">
                    <p className="text-red-600">Expense</p>
                    <p className="font-bold text-red-600">{formatCurrency(p.expense)}</p>
                  </div>
                </div>
                <div className="mt-3 text-xs text-right">
                  Net: <span className={net >= 0 ? "text-green-700 font-bold" : "text-red-600 font-bold"}>{formatCurrency(net)}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Transactions */}
      <Tabs defaultValue="transactions">
        <TabsList>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="donations">Donations</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
        </TabsList>
        <TabsContent value="transactions" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Date</TableHead>
                      <TableHead className="text-xs">Project</TableHead>
                      <TableHead className="text-xs">Type</TableHead>
                      <TableHead className="text-xs">Description</TableHead>
                      <TableHead className="text-xs text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map(t => (
                      <TableRow key={t.id}>
                        <TableCell className="text-xs text-muted-foreground">{new Date(t.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}</TableCell>
                        <TableCell className="text-xs font-medium">{t.project}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`text-[10px] ${t.direction === "Income" ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"}`}>
                            {t.direction}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs">{t.description}</TableCell>
                        <TableCell className={`text-xs text-right font-medium ${t.direction === "Income" ? "text-green-700" : "text-red-600"}`}>
                          {t.direction === "Income" ? "+" : "-"}{formatCurrency(t.amount)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="donations" className="mt-4">
          <Card><CardContent className="py-8 text-center text-sm text-muted-foreground">Project-linked donations will appear here</CardContent></Card>
        </TabsContent>
        <TabsContent value="expenses" className="mt-4">
          <Card><CardContent className="py-8 text-center text-sm text-muted-foreground">Project-linked expenses will appear here</CardContent></Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectFinance;
