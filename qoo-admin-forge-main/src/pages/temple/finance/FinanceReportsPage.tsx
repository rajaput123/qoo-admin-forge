import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Download, TrendingUp, Heart, ShoppingBag, Calendar } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell,
} from "recharts";
import { toast } from "sonner";
import { financeSelectors } from "@/modules/finance/financeStore";
import { parseISO, format, startOfYear, subMonths } from "date-fns";

const formatCurrency = (val: number) => `₹${val.toLocaleString("en-IN")}`;

const COLORS = [
  "hsl(16, 85%, 35%)", "hsl(142, 60%, 40%)", "hsl(200, 60%, 50%)",
  "hsl(45, 90%, 45%)", "hsl(280, 50%, 55%)", "hsl(350, 65%, 50%)",
  "hsl(180, 50%, 40%)", "hsl(30, 80%, 50%)", "hsl(260, 50%, 50%)",
];

const reportTypes = [
  { name: "Income vs Expense", icon: TrendingUp, desc: "Monthly comparison of income and expenses" },
  { name: "Donation Reports", icon: Heart, desc: "Donor-wise, type-wise donation analysis" },
  { name: "Expense Breakdown", icon: ShoppingBag, desc: "Category-wise expense analysis" },
  { name: "Event Profitability", icon: Calendar, desc: "Event-wise income, expense & P/L" },
];

function getMonthlyData(transactions: ReturnType<typeof financeSelectors.getTransactions>, months: number) {
  const now = new Date();
  const monthMap = new Map<string, { income: number; expense: number }>();

  for (let i = months - 1; i >= 0; i--) {
    const d = subMonths(now, i);
    const key = format(d, "MMM");
    monthMap.set(key, { income: 0, expense: 0 });
  }

  const cutoff = subMonths(now, months);
  transactions
    .filter(t => t.status === "Completed" && !t.reversalOfId)
    .forEach(t => {
      const txDate = parseISO(t.date);
      if (txDate < cutoff) return;
      const key = format(txDate, "MMM");
      const entry = monthMap.get(key);
      if (!entry) return;
      if (t.type === "Income") entry.income += t.paidAmount;
      if (t.type === "Expense") entry.expense += t.paidAmount;
    });

  return Array.from(monthMap.entries()).map(([month, data]) => ({ month, ...data }));
}

function getExpenseBreakdown(transactions: ReturnType<typeof financeSelectors.getTransactions>) {
  const catMap = new Map<string, number>();
  transactions
    .filter(t => t.type === "Expense" && t.status === "Completed" && !t.reversalOfId)
    .forEach(t => {
      catMap.set(t.category, (catMap.get(t.category) || 0) + t.paidAmount);
    });
  return Array.from(catMap.entries())
    .map(([name, value], i) => ({ name, value, color: COLORS[i % COLORS.length] }))
    .sort((a, b) => b.value - a.value);
}

const FinanceReportsPage = () => {
  const [period, setPeriod] = useState("6months");
  const transactions = financeSelectors.getTransactions();

  const monthCount = period === "month" ? 1 : period === "quarter" ? 3 : period === "6months" ? 6 : 12;

  const incomeVsExpense = useMemo(() => getMonthlyData(transactions, monthCount), [transactions.length, monthCount]);
  const expenseBreakdown = useMemo(() => getExpenseBreakdown(transactions), [transactions.length]);

  const totalIncome = incomeVsExpense.reduce((s, d) => s + d.income, 0);
  const totalExpense = incomeVsExpense.reduce((s, d) => s + d.expense, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-primary" /> Finance Reports
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">Live financial analytics from transaction data</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2" onClick={() => toast.success("Report exported")}>
            <Download className="h-4 w-4" /> Export All
          </Button>
        </div>
      </div>

      {/* Quick Report Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {reportTypes.map(r => (
          <Card key={r.name} className="cursor-pointer hover:border-primary/50 transition-colors">
            <CardContent className="p-4">
              <r.icon className="h-5 w-5 text-primary mb-2" />
              <p className="text-sm font-semibold">{r.name}</p>
              <p className="text-xs text-muted-foreground mt-1">{r.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="p-4 text-center">
            <span className="text-xs text-muted-foreground">Total Income</span>
            <p className="text-xl font-bold text-green-600">{formatCurrency(totalIncome)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <span className="text-xs text-muted-foreground">Total Expense</span>
            <p className="text-xl font-bold text-red-600">{formatCurrency(totalExpense)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <span className="text-xs text-muted-foreground">Net</span>
            <p className={`text-xl font-bold ${totalIncome - totalExpense >= 0 ? "text-emerald-600" : "text-red-600"}`}>
              {formatCurrency(totalIncome - totalExpense)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Income vs Expense Trend</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={incomeVsExpense}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `₹${(v / 1000)}K`} />
                <Tooltip formatter={(v: number) => formatCurrency(v)} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="income" fill="hsl(142, 60%, 40%)" name="Income" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" fill="hsl(0, 65%, 55%)" name="Expense" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Expense Breakdown</CardTitle></CardHeader>
          <CardContent>
            {expenseBreakdown.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-16">No expense data for this period</p>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={expenseBreakdown} cx="50%" cy="50%" innerRadius={55} outerRadius={95} dataKey="value" paddingAngle={3}>
                    {expenseBreakdown.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip formatter={(v: number) => formatCurrency(v)} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FinanceReportsPage;
