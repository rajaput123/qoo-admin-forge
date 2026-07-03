import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Wallet, ShieldCheck, Lock, ArrowRight } from "lucide-react";
import { financeSelectors } from "@/modules/finance/financeStore";

const FundManagement = () => {
  const fundSummaries = financeSelectors.getFundSummaries();
  const totalFunds = fundSummaries.reduce((s, f) => s + f.balance, 0);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Fund Management</h1>
          <p className="text-muted-foreground">Track fund-wise income, expenses, and balances</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 bg-primary text-primary-foreground">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-full">
                <Wallet className="h-8 w-8" />
              </div>
              <div>
                <p className="font-medium opacity-80">Total Funds Position</p>
                <h2 className="text-4xl font-bold mt-1">₹{totalFunds.toLocaleString()}</h2>
              </div>
            </div>
            <div className="mt-8 grid grid-cols-3 gap-4">
              {["General", "Donation", "Event", "Construction", "Endowment"].map(type => {
                const sum = fundSummaries.filter(f => f.type === type).reduce((s, f) => s + f.balance, 0);
                if (sum === 0) return null;
                return (
                  <div key={type}>
                    <p className="text-sm opacity-80">{type}</p>
                    <p className="text-xl font-bold">₹{sum.toLocaleString()}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Fund Health</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium">All Funds Active</p>
                <p className="text-xs text-muted-foreground">{fundSummaries.filter(f => f.status === "Active").length} funds tracked</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Lock className="h-5 w-5 text-amber-600" />
              <div>
                <p className="text-sm font-medium">Endowment Corpus</p>
                <p className="text-xs text-muted-foreground">Locked (Interest Only)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {fundSummaries.map(fund => (
          <Card key={fund.id} className="overflow-hidden">
            <div className={`h-2 w-full ${
              fund.type === "General" ? "bg-blue-500" :
              fund.type === "Donation" ? "bg-green-500" :
              fund.type === "Event" ? "bg-amber-500" :
              fund.type === "Construction" ? "bg-orange-500" :
              "bg-purple-500"
            }`} />
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <Badge variant="outline" className="mb-2">{fund.type}</Badge>
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Active</Badge>
              </div>
              <CardTitle className="text-lg">{fund.name}</CardTitle>
              <CardDescription className="line-clamp-2 min-h-[40px]">{fund.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Income</span>
                  <span className="text-green-600 font-medium">₹{fund.income.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Expense</span>
                  <span className="text-red-600 font-medium">₹{fund.expense.toLocaleString()}</span>
                </div>
                <div className="pt-2 border-t">
                  <p className="text-sm text-muted-foreground mb-1">Balance</p>
                  <p className="text-2xl font-bold">₹{fund.balance.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/20 border-t p-3">
              <Button variant="ghost" size="sm" className="w-full text-xs gap-1">
                View Transactions <ArrowRight className="h-3 w-3" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </motion.div>
  );
};

export default FundManagement;
