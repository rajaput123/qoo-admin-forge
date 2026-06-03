import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import PeriodFilter from "@/components/reports/PeriodFilter";
import { Download } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, RadialBarChart, RadialBar, Legend,
  AreaChart, Area
} from "recharts";
import { getConsolidatedSummary, getMonthlyTrends, getDonationBreakdown, getChannelBreakdown } from "@/modules/finance/consolidatedFinance";
import { financeSelectors, getFinanceState } from "@/modules/finance/financeStore";
import { getDonationsState } from "@/modules/donations/donationsStore";
import { toast } from "sonner";

const COLORS = ["hsl(16,85%,23%)", "hsl(217,91%,60%)", "hsl(142,60%,40%)", "hsl(45,90%,45%)", "hsl(280,50%,55%)", "hsl(350,65%,50%)", "hsl(190,70%,40%)", "hsl(320,60%,50%)"];

const fmt = (v: number) => {
  if (v >= 10000000) return `₹${(v / 10000000).toFixed(2)}Cr`;
  if (v >= 100000) return `₹${(v / 100000).toFixed(1)}L`;
  if (v >= 1000) return `₹${(v / 1000).toFixed(1)}K`;
  return `₹${v.toLocaleString("en-IN")}`;
};

const FinanceReports = () => {
  const [period, setPeriod] = useState("month");
  const summary = getConsolidatedSummary();
  const trends = getMonthlyTrends();
  const donationBreakdown = getDonationBreakdown();
  const channelBreakdown = getChannelBreakdown();
  const finState = getFinanceState();
  const donState = getDonationsState();

  const transactions = financeSelectors.getTransactions();
  const completedTxns = transactions.filter(t => t.status === "Completed");
  const pendingTxns = transactions.filter(t => t.status === "Pending");
  const incomeTxns = transactions.filter(t => t.type === "Income");
  const expenseTxns = transactions.filter(t => t.type === "Expense");

  const cashBalance = finState.accounts.filter(a => a.type === "Asset" && a.accountCategory === "Cash").reduce((s, a) => s + a.currentBalance, 0);
  const upiBalance = finState.accounts.filter(a => a.type === "Asset" && a.accountCategory === "UPI/Wallet").reduce((s, a) => s + a.currentBalance, 0);
  const activeFunds = finState.funds.filter(f => f.status === "Active").length;
  const totalDonationCount = donState.donations.length;
  const totalDonors = donState.donors.length;
  const avgDonation = totalDonationCount > 0 ? donState.donations.reduce((s, d) => s + d.amount, 0) / totalDonationCount : 0;

  const budgets = finState.budgets;
  const totalBudgeted = budgets.reduce((s, b) => s + b.plannedAmount, 0);
  const totalUtilized = budgets.reduce((s, b) => s + b.usedAmount, 0);
  const budgetUtilPct = totalBudgeted > 0 ? Math.round((totalUtilized / totalBudgeted) * 100) : 0;

  const payrollTotal = finState.payroll.filter(p => p.status === "Paid").reduce((s, p) => s + p.netPay, 0);
  const reconciled = transactions.filter(t => t.reconciliationStatus === "Matched").length;
  const reconciliationRate = transactions.length > 0 ? Math.round((reconciled / transactions.length) * 100) : 100;

  // Chart data preparation
  const revenueVsExpense = [
    { name: "Revenue", value: summary.totalRevenue, fill: "hsl(142,60%,40%)" },
    { name: "Expenses", value: summary.totalExpenses, fill: "hsl(350,65%,50%)" },
    { name: "Net", value: summary.netBalance, fill: "hsl(217,91%,60%)" },
  ];

  const balanceBreakdown = [
    { name: "Bank", value: summary.bankBalance, fill: "hsl(280,50%,55%)" },
    { name: "Cash", value: cashBalance, fill: "hsl(142,60%,40%)" },
    { name: "UPI/Wallet", value: upiBalance, fill: "hsl(217,91%,60%)" },
  ];

  const txnStatusData = [
    { name: "Completed", value: completedTxns.length, fill: "hsl(142,60%,40%)" },
    { name: "Pending", value: pendingTxns.length, fill: "hsl(45,90%,45%)" },
  ];

  const txnTypeData = [
    { name: "Income", value: incomeTxns.length, fill: "hsl(142,60%,40%)" },
    { name: "Expense", value: expenseTxns.length, fill: "hsl(350,65%,50%)" },
    { name: "Transfer", value: transactions.filter(t => t.type === "Transfer").length, fill: "hsl(217,91%,60%)" },
  ];

  const fundSummaries = financeSelectors.getFundSummaries();
  const fundData = fundSummaries.slice(0, 6).map(f => ({ name: f.name.length > 12 ? f.name.slice(0, 12) + "…" : f.name, balance: f.balance }));

  const budgetData = budgets.slice(0, 6).map(b => ({
    name: b.category.length > 10 ? b.category.slice(0, 10) + "…" : b.category,
    planned: b.plannedAmount,
    used: b.usedAmount,
  }));

  const reconData = [
    { name: "Matched", value: reconciled, fill: "hsl(142,60%,40%)" },
    { name: "Unmatched", value: transactions.length - reconciled, fill: "hsl(350,65%,50%)" },
  ];

  const payrollByMonth = finState.payroll.reduce((acc, p) => {
    const key = `${p.month}`;
    acc[key] = (acc[key] || 0) + p.netPay;
    return acc;
  }, {} as Record<string, number>);
  const payrollChartData = Object.entries(payrollByMonth).slice(-6).map(([month, amount]) => ({ month, amount }));

  const donationByChannel = channelBreakdown.map(c => ({ name: c.channel, value: c.amount }));

  const gaugeData = [{ name: "Budget", value: budgetUtilPct, fill: budgetUtilPct > 90 ? "hsl(350,65%,50%)" : budgetUtilPct > 70 ? "hsl(45,90%,45%)" : "hsl(142,60%,40%)" }];

  const handleExport = () => {
    const csv = ["Month,Income,Expense,Net", ...trends.map(t => `${t.month},${t.income},${t.expense},${t.net}`)].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `finance-report-${new Date().toISOString().split("T")[0]}.csv`; a.click(); URL.revokeObjectURL(url);
    toast.success("Finance report exported");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Finance Reports</h1>
          <p className="text-sm text-muted-foreground mt-1">15 key financial KPIs with visual analytics</p>
        </div>
        <div className="flex gap-2">
          <PeriodFilter value={period} onChange={setPeriod} />
          <Button variant="outline" onClick={handleExport} className="gap-2"><Download className="h-4 w-4" />Export</Button>
        </div>
      </div>

      {/* Row 1: Revenue vs Expense | Income-Expense Trend | Net Balance Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-1"><CardTitle className="text-sm flex items-center gap-2">Revenue vs Expenses vs Net<Badge variant="secondary" className="ml-auto text-[10px] font-normal">Bar Chart</Badge></CardTitle></CardHeader>
          <CardContent className="pt-0">
            <p className="text-lg font-bold mb-1">{fmt(summary.totalRevenue)} <span className="text-xs text-muted-foreground font-normal">revenue</span></p>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={revenueVsExpense}><CartesianGrid strokeDasharray="3 3" stroke="hsl(0,0%,90%)" /><XAxis dataKey="name" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} /><Tooltip formatter={(v: number) => fmt(v)} /><Bar dataKey="value" radius={[4,4,0,0]}>{revenueVsExpense.map((e, i) => <Cell key={i} fill={e.fill} />)}</Bar></BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-1"><CardTitle className="text-sm flex items-center gap-2">Income vs Expense Trend<Badge variant="secondary" className="ml-auto text-[10px] font-normal">Area Chart</Badge></CardTitle></CardHeader>
          <CardContent className="pt-0">
            <p className="text-lg font-bold mb-1">{fmt(summary.totalExpenses)} <span className="text-xs text-muted-foreground font-normal">expenses</span></p>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={trends}><CartesianGrid strokeDasharray="3 3" stroke="hsl(0,0%,90%)" /><XAxis dataKey="month" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} /><Tooltip formatter={(v: number) => fmt(v)} /><Area type="monotone" dataKey="income" stroke="hsl(142,60%,40%)" fill="hsl(142,60%,40%)" fillOpacity={0.2} name="Income" /><Area type="monotone" dataKey="expense" stroke="hsl(350,65%,50%)" fill="hsl(350,65%,50%)" fillOpacity={0.2} name="Expense" /></AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-1"><CardTitle className="text-sm flex items-center gap-2">Net Balance Trend<Badge variant="secondary" className="ml-auto text-[10px] font-normal">Line Chart</Badge></CardTitle></CardHeader>
          <CardContent className="pt-0">
            <p className="text-lg font-bold mb-1">{fmt(summary.netBalance)} <span className="text-xs text-muted-foreground font-normal">net</span></p>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={trends}><CartesianGrid strokeDasharray="3 3" stroke="hsl(0,0%,90%)" /><XAxis dataKey="month" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} /><Tooltip formatter={(v: number) => fmt(v)} /><Line type="monotone" dataKey="net" stroke="hsl(217,91%,60%)" strokeWidth={2} dot={{ r: 3 }} /></LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Row 2: Balance Breakdown | Donation by Purpose | Revenue by Channel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-1"><CardTitle className="text-sm flex items-center gap-2">Balance Breakdown (Bank / Cash / UPI)<Badge variant="secondary" className="ml-auto text-[10px] font-normal">Donut Chart</Badge></CardTitle></CardHeader>
          <CardContent className="pt-0">
            <p className="text-lg font-bold mb-1">{fmt(summary.bankBalance + cashBalance + upiBalance)} <span className="text-xs text-muted-foreground font-normal">total</span></p>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart><Pie data={balanceBreakdown} cx="50%" cy="50%" outerRadius={70} innerRadius={40} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>{balanceBreakdown.map((e, i) => <Cell key={i} fill={e.fill} />)}</Pie><Tooltip formatter={(v: number) => fmt(v)} /></PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-1"><CardTitle className="text-sm flex items-center gap-2">Donations by Purpose<Badge variant="secondary" className="ml-auto text-[10px] font-normal">Pie Chart</Badge></CardTitle></CardHeader>
          <CardContent className="pt-0">
            <p className="text-lg font-bold mb-1">{fmt(summary.totalDonations)} <span className="text-xs text-muted-foreground font-normal">{totalDonationCount} donations</span></p>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart><Pie data={donationBreakdown.map(d => ({ name: d.purpose, value: d.amount }))} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}>{donationBreakdown.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip formatter={(v: number) => fmt(v)} /></PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-1"><CardTitle className="text-sm flex items-center gap-2">Revenue by Channel<Badge variant="secondary" className="ml-auto text-[10px] font-normal">Bar Chart</Badge></CardTitle></CardHeader>
          <CardContent className="pt-0">
            <p className="text-lg font-bold mb-1">{fmt(avgDonation)} <span className="text-xs text-muted-foreground font-normal">avg donation</span></p>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={donationByChannel}><CartesianGrid strokeDasharray="3 3" stroke="hsl(0,0%,90%)" /><XAxis dataKey="name" tick={{ fontSize: 9 }} /><YAxis tick={{ fontSize: 10 }} /><Tooltip formatter={(v: number) => fmt(v)} /><Bar dataKey="value" fill="hsl(16,85%,23%)" radius={[4,4,0,0]} /></BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Row 3: Seva Income | Fund Balances | Transaction Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-1"><CardTitle className="text-sm flex items-center gap-2">Seva vs Event vs Other Income<Badge variant="secondary" className="ml-auto text-[10px] font-normal">Donut Chart</Badge></CardTitle></CardHeader>
          <CardContent className="pt-0">
            <p className="text-lg font-bold mb-1">{fmt(summary.totalSevaIncome)} <span className="text-xs text-muted-foreground font-normal">seva income</span></p>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart><Pie data={[
                { name: "Seva", value: summary.totalSevaIncome, fill: "hsl(142,60%,40%)" },
                { name: "Events", value: summary.totalEventCollections, fill: "hsl(280,50%,55%)" },
                { name: "Other", value: Math.max(0, summary.totalRevenue - summary.totalSevaIncome - summary.totalEventCollections), fill: "hsl(45,90%,45%)" },
              ]} cx="50%" cy="50%" outerRadius={70} innerRadius={35} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                <Cell fill="hsl(142,60%,40%)" /><Cell fill="hsl(280,50%,55%)" /><Cell fill="hsl(45,90%,45%)" />
              </Pie><Tooltip formatter={(v: number) => fmt(v)} /></PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-1"><CardTitle className="text-sm flex items-center gap-2">Fund Balances<Badge variant="secondary" className="ml-auto text-[10px] font-normal">Horizontal Bar Chart</Badge></CardTitle></CardHeader>
          <CardContent className="pt-0">
            <p className="text-lg font-bold mb-1">{fmt(summary.fundBalance)} <span className="text-xs text-muted-foreground font-normal">{activeFunds} active funds</span></p>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={fundData} layout="vertical"><CartesianGrid strokeDasharray="3 3" stroke="hsl(0,0%,90%)" /><XAxis type="number" tick={{ fontSize: 10 }} /><YAxis type="category" dataKey="name" tick={{ fontSize: 9 }} width={80} /><Tooltip formatter={(v: number) => fmt(v)} /><Bar dataKey="balance" fill="hsl(190,70%,40%)" radius={[0,4,4,0]} /></BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-1"><CardTitle className="text-sm flex items-center gap-2">Transaction Status<Badge variant="secondary" className="ml-auto text-[10px] font-normal">Donut Chart</Badge></CardTitle></CardHeader>
          <CardContent className="pt-0">
            <p className="text-lg font-bold mb-1">{transactions.length} <span className="text-xs text-muted-foreground font-normal">total transactions</span></p>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart><Pie data={txnStatusData} cx="50%" cy="50%" outerRadius={70} innerRadius={40} dataKey="value" label={({ name, value }) => `${name}: ${value}`} labelLine={false}>{txnStatusData.map((e, i) => <Cell key={i} fill={e.fill} />)}</Pie><Tooltip /></PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Row 4: Transaction Types | Budget Utilization | Payroll */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-1"><CardTitle className="text-sm flex items-center gap-2">Transaction Types (Income / Expense / Transfer)<Badge variant="secondary" className="ml-auto text-[10px] font-normal">Bar Chart</Badge></CardTitle></CardHeader>
          <CardContent className="pt-0">
            <p className="text-lg font-bold mb-1">{pendingTxns.length} <span className="text-xs text-muted-foreground font-normal">pending</span></p>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={txnTypeData}><CartesianGrid strokeDasharray="3 3" stroke="hsl(0,0%,90%)" /><XAxis dataKey="name" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} /><Tooltip /><Bar dataKey="value" radius={[4,4,0,0]}>{txnTypeData.map((e, i) => <Cell key={i} fill={e.fill} />)}</Bar></BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-1"><CardTitle className="text-sm flex items-center gap-2">Budget Utilization<Badge variant="secondary" className="ml-auto text-[10px] font-normal">Grouped Bar Chart</Badge></CardTitle></CardHeader>
          <CardContent className="pt-0">
            <p className="text-lg font-bold mb-1">{budgetUtilPct}% <span className="text-xs text-muted-foreground font-normal">{fmt(totalUtilized)} of {fmt(totalBudgeted)}</span></p>
            {budgetData.length > 0 ? (
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={budgetData}><CartesianGrid strokeDasharray="3 3" stroke="hsl(0,0%,90%)" /><XAxis dataKey="name" tick={{ fontSize: 9 }} /><YAxis tick={{ fontSize: 10 }} /><Tooltip formatter={(v: number) => fmt(v)} /><Bar dataKey="planned" fill="hsl(217,91%,60%)" radius={[4,4,0,0]} name="Planned" /><Bar dataKey="used" fill="hsl(16,85%,23%)" radius={[4,4,0,0]} name="Used" /></BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[180px] flex items-center justify-center text-sm text-muted-foreground">No budget data</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-1"><CardTitle className="text-sm flex items-center gap-2">Payroll Disbursements<Badge variant="secondary" className="ml-auto text-[10px] font-normal">Area Chart</Badge></CardTitle></CardHeader>
          <CardContent className="pt-0">
            <p className="text-lg font-bold mb-1">{fmt(payrollTotal)} <span className="text-xs text-muted-foreground font-normal">{finState.payroll.filter(p => p.status === "Paid").length} paid</span></p>
            {payrollChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={payrollChartData}><CartesianGrid strokeDasharray="3 3" stroke="hsl(0,0%,90%)" /><XAxis dataKey="month" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} /><Tooltip formatter={(v: number) => fmt(v)} /><Area type="monotone" dataKey="amount" stroke="hsl(350,65%,50%)" fill="hsl(350,65%,50%)" fillOpacity={0.15} /></AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[180px] flex items-center justify-center text-sm text-muted-foreground">No payroll data</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Row 5: Reconciliation | Pending Payables | Donors */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-1"><CardTitle className="text-sm flex items-center gap-2">Reconciliation Rate<Badge variant="secondary" className="ml-auto text-[10px] font-normal">Donut Chart</Badge></CardTitle></CardHeader>
          <CardContent className="pt-0">
            <p className="text-lg font-bold mb-1">{reconciliationRate}% <span className="text-xs text-muted-foreground font-normal">{reconciled}/{transactions.length} matched</span></p>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart><Pie data={reconData} cx="50%" cy="50%" outerRadius={70} innerRadius={45} dataKey="value" startAngle={90} endAngle={-270} label={({ name, value }) => `${name}: ${value}`} labelLine={false}>{reconData.map((e, i) => <Cell key={i} fill={e.fill} />)}</Pie><Tooltip /></PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-1"><CardTitle className="text-sm flex items-center gap-2">Pending Payables / Liabilities<Badge variant="secondary" className="ml-auto text-[10px] font-normal">Bar Chart</Badge></CardTitle></CardHeader>
          <CardContent className="pt-0">
            <p className="text-lg font-bold mb-1">{fmt(summary.pendingPayables)} <span className="text-xs text-muted-foreground font-normal">outstanding</span></p>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={[
                { name: "Payables", value: summary.pendingPayables, fill: "hsl(350,65%,50%)" },
                { name: "Revenue", value: summary.totalRevenue, fill: "hsl(142,60%,40%)" },
              ]}><CartesianGrid strokeDasharray="3 3" stroke="hsl(0,0%,90%)" /><XAxis dataKey="name" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} /><Tooltip formatter={(v: number) => fmt(v)} /><Bar dataKey="value" radius={[4,4,0,0]}>{[<Cell key={0} fill="hsl(350,65%,50%)" />, <Cell key={1} fill="hsl(142,60%,40%)" />]}</Bar></BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-1"><CardTitle className="text-sm flex items-center gap-2">Donor & Donation Overview<Badge variant="secondary" className="ml-auto text-[10px] font-normal">Bar Chart</Badge></CardTitle></CardHeader>
          <CardContent className="pt-0">
            <p className="text-lg font-bold mb-1">{totalDonors} <span className="text-xs text-muted-foreground font-normal">donors · {totalDonationCount} donations</span></p>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={[
                { name: "Donors", value: totalDonors },
                { name: "Donations", value: totalDonationCount },
                { name: "Avg (₹K)", value: Math.round(avgDonation / 1000) },
              ]}><CartesianGrid strokeDasharray="3 3" stroke="hsl(0,0%,90%)" /><XAxis dataKey="name" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} /><Tooltip /><Bar dataKey="value" fill="hsl(45,90%,45%)" radius={[4,4,0,0]} /></BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FinanceReports;
