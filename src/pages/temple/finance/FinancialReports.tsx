import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Printer, TrendingUp, PieChart, FileBarChart } from "lucide-react";
import { financeSelectors } from "@/modules/finance/financeStore";

const FinancialReports = () => {
  const accounts = financeSelectors.getAccounts();
  const [reportPeriod] = useState("FY 2025-26");

  const getSum = (type: string) => accounts.filter(a => a.type === type).reduce((s, a) => s + a.currentBalance, 0);

  const totalIncome = getSum("Income");
  const totalExpense = getSum("Expense");
  const netSurplus = totalIncome - totalExpense;
  const totalAssets = getSum("Asset");
  const totalLiabilities = getSum("Liability");
  const totalEquity = getSum("Equity");

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Financial Reports</h1>
          <p className="text-muted-foreground">Standardized financial statements and analysis</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2"><Printer className="h-4 w-4" /> Print</Button>
          <Button variant="outline" className="gap-2"><Download className="h-4 w-4" /> Export PDF</Button>
        </div>
      </div>

      <Tabs defaultValue="pnl" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pnl" className="gap-2"><TrendingUp className="h-4 w-4" /> Income & Expense</TabsTrigger>
          <TabsTrigger value="bs" className="gap-2"><PieChart className="h-4 w-4" /> Balance Sheet</TabsTrigger>
          <TabsTrigger value="funds" className="gap-2"><FileBarChart className="h-4 w-4" /> Fund Flow</TabsTrigger>
        </TabsList>

        <TabsContent value="pnl" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Statement of Income & Expenditure</CardTitle>
              <CardDescription>For the period {reportPeriod}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border p-4">
                <Table>
                  <TableBody>
                    <TableRow className="bg-muted/50 font-bold"><TableCell colSpan={2}>INCOME</TableCell></TableRow>
                    {accounts.filter(a => a.type === "Income" && a.currentBalance > 0).map(a => (
                      <TableRow key={a.id}>
                        <TableCell>{a.name}</TableCell>
                        <TableCell className="text-right font-mono">₹{a.currentBalance.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="font-bold border-t-2"><TableCell>Total Income</TableCell><TableCell className="text-right">₹{totalIncome.toLocaleString()}</TableCell></TableRow>

                    <TableRow className="h-4 border-none"><TableCell colSpan={2}></TableCell></TableRow>

                    <TableRow className="bg-muted/50 font-bold"><TableCell colSpan={2}>EXPENSES</TableCell></TableRow>
                    {accounts.filter(a => a.type === "Expense" && a.currentBalance > 0).map(a => (
                      <TableRow key={a.id}>
                        <TableCell>{a.name}</TableCell>
                        <TableCell className="text-right font-mono">₹{a.currentBalance.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="font-bold border-t-2"><TableCell>Total Expenses</TableCell><TableCell className="text-right">₹{totalExpense.toLocaleString()}</TableCell></TableRow>

                    <TableRow className="h-8 border-none"><TableCell colSpan={2}></TableCell></TableRow>

                    <TableRow className="bg-green-50 font-bold text-lg text-green-700">
                      <TableCell>NET SURPLUS / (DEFICIT)</TableCell>
                      <TableCell className="text-right">₹{netSurplus.toLocaleString()}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Statement of Financial Position</CardTitle>
              <CardDescription>As of {new Date().toLocaleDateString()}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="font-bold text-lg border-b pb-2">ASSETS</h3>
                  <Table>
                    <TableBody>
                      {accounts.filter(a => a.type === "Asset" && a.currentBalance > 0).map(a => (
                        <TableRow key={a.id}>
                          <TableCell>{a.name}</TableCell>
                          <TableCell className="text-right font-mono">₹{a.currentBalance.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="font-bold bg-muted/20">
                        <TableCell>TOTAL ASSETS</TableCell>
                        <TableCell className="text-right">₹{totalAssets.toLocaleString()}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
                <div className="space-y-4">
                  <h3 className="font-bold text-lg border-b pb-2">LIABILITIES & EQUITY</h3>
                  <Table>
                    <TableBody>
                      <TableRow className="bg-muted/50 font-bold"><TableCell colSpan={2}>LIABILITIES</TableCell></TableRow>
                      {accounts.filter(a => a.type === "Liability" && a.currentBalance > 0).map(a => (
                        <TableRow key={a.id}>
                          <TableCell>{a.name}</TableCell>
                          <TableCell className="text-right font-mono">₹{a.currentBalance.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="font-bold"><TableCell>Total Liabilities</TableCell><TableCell className="text-right">₹{totalLiabilities.toLocaleString()}</TableCell></TableRow>
                      <TableRow className="h-4 border-none"><TableCell colSpan={2}></TableCell></TableRow>
                      <TableRow className="bg-muted/50 font-bold"><TableCell colSpan={2}>EQUITY & FUNDS</TableCell></TableRow>
                      {accounts.filter(a => a.type === "Equity" && a.currentBalance > 0).map(a => (
                        <TableRow key={a.id}>
                          <TableCell>{a.name}</TableCell>
                          <TableCell className="text-right font-mono">₹{a.currentBalance.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell>Retained Earnings (Current Year)</TableCell>
                        <TableCell className="text-right font-mono">₹{netSurplus.toLocaleString()}</TableCell>
                      </TableRow>
                      <TableRow className="font-bold bg-muted/20 border-t-2">
                        <TableCell>TOTAL LIABILITIES & EQUITY</TableCell>
                        <TableCell className="text-right">₹{(totalLiabilities + totalEquity + netSurplus).toLocaleString()}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="funds">
          <Card>
            <CardHeader><CardTitle>Fund Flow Statement</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fund</TableHead>
                    <TableHead className="text-right">Income</TableHead>
                    <TableHead className="text-right">Expense</TableHead>
                    <TableHead className="text-right">Balance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {financeSelectors.getFundSummaries().map(f => (
                    <TableRow key={f.id}>
                      <TableCell className="font-medium">{f.name}</TableCell>
                      <TableCell className="text-right text-green-600 font-mono">₹{f.income.toLocaleString()}</TableCell>
                      <TableCell className="text-right text-red-600 font-mono">₹{f.expense.toLocaleString()}</TableCell>
                      <TableCell className="text-right font-bold font-mono">₹{f.balance.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default FinancialReports;
