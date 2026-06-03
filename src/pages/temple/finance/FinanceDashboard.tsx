import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, ArrowDownLeft, Wallet, TrendingUp, AlertCircle, Building2, RefreshCw, Plus } from "lucide-react";
import { financeSelectors } from "@/modules/finance/financeStore";
import { financeIntegration } from "@/modules/finance/integration";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

const FinanceDashboard = () => {
  const navigate = useNavigate();
  const summary = financeSelectors.getSummary();
  const accounts = financeSelectors.getAccounts();
  const fundSummaries = financeSelectors.getFundSummaries();

  const handleSync = () => {
    try {
      const count = financeIntegration.syncDonationsToLedger();
      if (count > 0) {
        toast.success(`Synced ${count} new donations to Ledger`);
        setTimeout(() => window.location.reload(), 1000);
      } else {
        toast.info("No new donations to sync");
      }
    } catch {
      toast.error("Sync failed");
    }
  };

  const monthlyData = [
    { name: "Jan", income: 450000, expense: 320000 },
    { name: "Feb", income: 520000, expense: 380000 },
    { name: "Mar", income: 480000, expense: 410000 },
    { name: "Apr", income: 600000, expense: 450000 },
    { name: "May", income: 550000, expense: 390000 },
    { name: "Jun", income: 490000, expense: 420000 },
  ];

  const formatL = (v: number) => `₹${(v / 100000).toFixed(1)}L`;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Financial Overview</h1>
          <p className="text-muted-foreground">Real-time financial health & liquidity position</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSync} className="gap-2">
            <RefreshCw className="h-4 w-4" /> Sync Donations
          </Button>
          <Button onClick={() => navigate("/temple/finance/transactions?action=new")} className="gap-2">
            <Plus className="h-4 w-4" /> Add Transaction
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatL(summary.totalIncome)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <ArrowDownLeft className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatL(summary.totalExpense)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Balance</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatL(summary.netBalance)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cash Position</CardTitle>
            <Wallet className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatL(summary.totalCash)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bank Position</CardTitle>
            <Building2 className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatL(summary.totalBank)}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Income vs Expense</CardTitle>
            <CardDescription>Monthly financial performance</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val / 1000}k`} />
                <Tooltip formatter={(val: number) => `₹${val.toLocaleString()}`} />
                <Legend />
                <Bar dataKey="income" name="Income" fill="hsl(142,60%,40%)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" name="Expense" fill="hsl(350,65%,50%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Fund Positions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {fundSummaries.map(f => (
                <div key={f.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{f.name}</p>
                    <p className="text-xs text-muted-foreground">{f.type}</p>
                  </div>
                  <span className="font-bold text-sm">₹{f.balance.toLocaleString()}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-destructive/10 border-destructive/20">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2 text-destructive">
                <AlertCircle className="h-5 w-5" />
                <CardTitle className="text-base">Pending Actions</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Pending Transactions</span>
                <Badge variant="outline" className="bg-background">{summary.pending}</Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span>Bank Reconciliation</span>
                <Badge variant="outline" className="bg-background">Pending</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default FinanceDashboard;
