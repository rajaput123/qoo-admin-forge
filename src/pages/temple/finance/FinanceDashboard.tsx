import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formatIndianCurrency = (val: number) => {
  const isNegative = val < 0;
  const absVal = Math.abs(val);
  const parts = absVal.toFixed(2).split(".");
  let lastThree = parts[0].substring(parts[0].length - 3);
  const otherParts = parts[0].substring(0, parts[0].length - 3);
  if (otherParts !== "") {
    lastThree = "," + lastThree;
  }
  const res = otherParts.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
  const decimalPart = parts[1];
  const formatted = decimalPart !== "00" ? `${res}.${decimalPart}` : res;
  return `${isNegative ? "-" : ""}₹${formatted}`;
};

const FinanceDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"Income" | "Expenses">("Income");
  const [fiscalYear, setFiscalYear] = useState("FY 2026–27");

  const incomeData = [
    { name: "Hundi Collections", value: 10123, percentage: 3.18, color: "#a87a54" },
    { name: "Online / UPI", value: 300001, percentage: 94.33, color: "hsl(var(--primary))" },
    { name: "Other Income (vouchers)", value: 3788, percentage: 1.19, color: "#10b981" },
    { name: "Seva & Bookings", value: 4120, percentage: 1.30, color: "#3b82f6" },
  ];

  const expensesData = [
    { name: "Payroll & Salaries", value: 5915, percentage: 65.0, color: "hsl(var(--primary))" },
    { name: "Maintenance & Repairs", value: 1820, percentage: 20.0, color: "#a87a54" },
    { name: "Utilities & Energy", value: 910, percentage: 10.0, color: "#3b82f6" },
    { name: "Others / Admin", value: 456, percentage: 5.0, color: "#10b981" },
  ];

  const currentData = activeTab === "Income" ? incomeData : expensesData;

  const pieData = currentData.map((d) => ({
    name: d.name,
    value: d.value,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 flex-1 flex flex-col"
    >
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-border/50 shrink-0">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Financial Dashboard
            </h1>
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-semibold">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            Real-time financial health & liquidity position
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => navigate("/temple/finance/transactions?action=new")}
            size="sm"
            className="gap-1.5 shadow-sm text-xs font-semibold"
          >
            <Plus className="h-4 w-4" /> New Voucher
          </Button>
        </div>
      </div>

      {/* Main Category Breakdown Card */}
      <Card className="flex-1 flex flex-col bg-card overflow-hidden">
        {/* Card Header */}
        <CardHeader className="flex flex-row items-center justify-between border-b pb-4 shrink-0 space-y-0">
          <CardTitle className="text-lg font-bold text-foreground">
            Category Breakdown — {activeTab}
          </CardTitle>
          <div className="flex items-center gap-3">
            {/* Toggle tabs */}
            <div className="bg-muted p-1 rounded-lg flex items-center gap-1 border">
              {(["Income", "Expenses"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-[11px] font-semibold px-2.5 py-1 rounded-md transition-all ${
                    activeTab === tab
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* FY Dropdown */}
            <Select value={fiscalYear} onValueChange={setFiscalYear}>
              <SelectTrigger className="w-32 h-8 text-[11px] font-semibold text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card">
                <SelectItem value="FY 2026–27" className="text-[11px]">
                  FY 2026–27
                </SelectItem>
                <SelectItem value="FY 2025–26" className="text-[11px]">
                  FY 2025–26
                </SelectItem>
                <SelectItem value="FY 2024–25" className="text-[11px]">
                  FY 2024–25
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        {/* Card Content */}
        <div className="p-6 flex-1 flex flex-col justify-center bg-card">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center max-w-5xl mx-auto w-full">
            {/* Left: Donut Chart */}
            <div className="flex justify-center items-center relative h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={92}
                    paddingAngle={3}
                    dataKey="value"
                    startAngle={90}
                    endAngle={-270}
                  >
                    {currentData.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Right: Legend & Progress Indicators */}
            <div className="space-y-4">
              {currentData.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  {/* Item Title and Value */}
                  <div className="flex justify-between items-center text-[13px]">
                    <div className="flex items-center gap-2 font-medium text-muted-foreground">
                      <span
                        className="h-2.5 w-2.5 rounded shrink-0"
                        style={{ backgroundColor: item.color }}
                      />
                      <span>{item.name}</span>
                    </div>
                    <div className="font-semibold text-foreground">
                      {formatIndianCurrency(item.value)}
                      <span className="text-[11px] text-muted-foreground font-medium ml-1">
                        ({item.percentage.toFixed(2)}%)
                      </span>
                    </div>
                  </div>

                  {/* Proportional Bar */}
                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden border">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        backgroundColor: item.color,
                        width: `${item.percentage}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Card Footer */}
        <div className="px-6 py-4 border-t bg-muted/30 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-muted-foreground italic">
            Last updated: 05 Jun 2026, 12:00 | Data as at end of day
          </span>
        </div>
      </Card>

      {/* Metrics Row at the bottom */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
        <Card className="bg-card">
          <CardContent className="p-4 flex flex-col justify-between h-24">
            <span className="text-xs text-muted-foreground font-semibold tracking-wider uppercase">
              Total Donations (YTD)
            </span>
            <span className="text-2xl font-bold text-foreground">
              {formatIndianCurrency(310124)}
            </span>
            <span className="text-[11px] text-muted-foreground font-medium">
              Period summary
            </span>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardContent className="p-4 flex flex-col justify-between h-24">
            <span className="text-xs text-muted-foreground font-semibold tracking-wider uppercase">
              Total Expenses (YTD)
            </span>
            <span className="text-2xl font-bold text-foreground">
              {formatIndianCurrency(9101)}
            </span>
            <span className="text-[11px] text-muted-foreground font-medium">
              Period summary
            </span>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardContent className="p-4 flex flex-col justify-between h-24">
            <span className="text-xs text-muted-foreground font-semibold tracking-wider uppercase">
              Net Surplus (YTD)
            </span>
            <span className="text-2xl font-bold text-foreground">
              {formatIndianCurrency(304811)}
            </span>
            <span className="text-[11px] text-primary font-semibold">
              97.1% net margin
            </span>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardContent className="p-4 flex flex-col justify-between h-24">
            <span className="text-xs text-muted-foreground font-semibold tracking-wider uppercase">
              Cash & Bank Balance
            </span>
            <span className="text-2xl font-bold text-foreground">
              {formatIndianCurrency(-204093.99)}
            </span>
            <span className="text-[11px] text-muted-foreground font-medium">
              Synchronized with ledger
            </span>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default FinanceDashboard;
