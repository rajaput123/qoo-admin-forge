import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, FileSpreadsheet } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, PieChart, Pie, Cell,
} from "recharts";

// Income sources
const incomeData = [
  { name: "Hundi Collection", value: 1800000, color: "hsl(16, 85%, 35%)" },
  { name: "Online Donations", value: 1200000, color: "hsl(30, 80%, 50%)" },
  { name: "Counter Donations", value: 650000, color: "hsl(45, 90%, 50%)" },
  { name: "Seva Bookings", value: 2100000, color: "hsl(142, 60%, 40%)" },
  { name: "Event Income", value: 350000, color: "hsl(200, 60%, 50%)" },
  { name: "Project Funds", value: 500000, color: "hsl(280, 50%, 55%)" },
];

// Expense categories
const expenseData = [
  { name: "Daily Operations", value: 1200000, color: "hsl(16, 85%, 35%)" },
  { name: "Pooja & Rituals", value: 850000, color: "hsl(30, 80%, 50%)" },
  { name: "Maintenance", value: 650000, color: "hsl(45, 90%, 50%)" },
  { name: "Utilities", value: 380000, color: "hsl(200, 60%, 50%)" },
  { name: "Staff Salaries", value: 1600000, color: "hsl(142, 60%, 40%)" },
  { name: "Priest Honorarium", value: 480000, color: "hsl(280, 50%, 55%)" },
  { name: "Security", value: 360000, color: "hsl(0, 50%, 50%)" },
  { name: "Admin Staff", value: 420000, color: "hsl(16, 50%, 40%)" },
];

// Project financials
const projectData = [
  { name: "Gopuram Renovation", allocated: 2500000, actual: 2180000 },
  { name: "Kitchen Upgrade", allocated: 800000, actual: 920000 },
  { name: "Garden Landscaping", allocated: 350000, actual: 310000 },
  { name: "Parking Expansion", allocated: 1200000, actual: 1050000 },
  { name: "CCTV Installation", allocated: 450000, actual: 480000 },
];

// Event financials
const eventData = [
  { name: "Brahmotsavam", budget: 1500000, collections: 1250000, expenses: 1080000 },
  { name: "Maha Shivaratri", budget: 800000, collections: 680000, expenses: 620000 },
  { name: "Ganesh Chaturthi", budget: 600000, collections: 520000, expenses: 490000 },
  { name: "Navaratri", budget: 1000000, collections: 890000, expenses: 780000 },
  { name: "Diwali", budget: 850000, collections: 720000, expenses: 650000 },
];

const formatCurrency = (val: number) => {
  if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)}Cr`;
  if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
  return `₹${val.toLocaleString("en-IN")}`;
};

const SimpleFinanceDashboard = () => {
  const [selectedIncomeSources, setSelectedIncomeSources] = useState<string[]>([]);

  const filteredIncomeData = selectedIncomeSources.length > 0
    ? incomeData.filter(d => selectedIncomeSources.includes(d.name))
    : incomeData;

  const toggleIncomeSource = (source: string) => {
    setSelectedIncomeSources(prev =>
      prev.includes(source) ? prev.filter(s => s !== source) : [...prev, source]
    );
  };

  const handleDownload = (fmt: "pdf" | "excel", chartName: string) => {
    alert(`Downloading ${chartName} as ${fmt.toUpperCase()}`);
  };

  const DownloadButtons = ({ chartName }: { chartName: string }) => (
    <div className="flex items-center gap-1">
      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleDownload("pdf", chartName)} title="Download PDF">
        <FileText className="h-3.5 w-3.5 text-destructive" />
      </Button>
      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleDownload("excel", chartName)} title="Download Excel">
        <FileSpreadsheet className="h-3.5 w-3.5 text-green-600" />
      </Button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Detailed Analytics</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Income, expense, project & event financial analysis · FY 2025-26
        </p>
      </div>

      {/* Income & Expense */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Income Distribution</CardTitle>
              <DownloadButtons chartName="Income Distribution" />
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={filteredIncomeData} cx="50%" cy="50%" innerRadius={55} outerRadius={95} paddingAngle={3} dataKey="value">
                  {filteredIncomeData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip formatter={(value: number) => `₹${value.toLocaleString("en-IN")}`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1 mt-3">
              {incomeData.map((source, i) => {
                const isSelected = selectedIncomeSources.length === 0 || selectedIncomeSources.includes(source.name);
                return (
                  <button key={i} onClick={() => toggleIncomeSource(source.name)}
                    className={cn("w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-all", isSelected ? "bg-muted/50" : "opacity-40")}>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: source.color }} />
                      <span>{source.name}</span>
                    </div>
                    <span className="font-medium">{formatCurrency(source.value)}</span>
                  </button>
                );
              })}
              {selectedIncomeSources.length > 0 && (
                <Button variant="ghost" size="sm" className="text-xs w-full mt-1" onClick={() => setSelectedIncomeSources([])}>Show All</Button>
              )}
            </div>
            <div className="border-t mt-3 pt-2 flex justify-between items-center text-sm font-bold px-2.5">
              <span>Total Income</span>
              <span>{formatCurrency(filteredIncomeData.reduce((s, d) => s + d.value, 0))}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Expense Distribution</CardTitle>
              <DownloadButtons chartName="Expense Distribution" />
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={expenseData} cx="50%" cy="50%" innerRadius={55} outerRadius={95} paddingAngle={3} dataKey="value">
                  {expenseData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip formatter={(value: number) => `₹${value.toLocaleString("en-IN")}`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1 mt-3">
              {expenseData.map((cat, i) => (
                <div key={i} className="flex items-center justify-between text-xs px-2.5 py-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                    <span className="text-muted-foreground">{cat.name}</span>
                  </div>
                  <span className="font-medium">{formatCurrency(cat.value)}</span>
                </div>
              ))}
            </div>
            <div className="border-t mt-3 pt-2 flex justify-between items-center text-sm font-bold px-2.5">
              <span>Total Expenses</span>
              <span>{formatCurrency(expenseData.reduce((s, d) => s + d.value, 0))}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Project & Event Finance */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Projects — Budget vs Actual</CardTitle>
              <DownloadButtons chartName="Project Variance" />
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={projectData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" fontSize={10} angle={-15} textAnchor="end" height={50} stroke="hsl(var(--muted-foreground))" />
                <YAxis fontSize={10} tickFormatter={(v) => formatCurrency(v)} stroke="hsl(var(--muted-foreground))" />
                <Tooltip formatter={(value: number) => `₹${value.toLocaleString("en-IN")}`} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="allocated" fill="hsl(30, 80%, 50%)" name="Allocated" radius={[4, 4, 0, 0]} barSize={24} />
                <Bar dataKey="actual" fill="hsl(16, 85%, 35%)" name="Actual" radius={[4, 4, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 border rounded-lg overflow-hidden text-xs">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/50 border-b">
                    <th className="text-left p-2 font-medium">Project</th>
                    <th className="text-right p-2 font-medium">Allocated</th>
                    <th className="text-right p-2 font-medium">Actual</th>
                    <th className="text-right p-2 font-medium">Variance</th>
                  </tr>
                </thead>
                <tbody>
                  {projectData.map((item, i) => {
                    const variance = item.allocated - item.actual;
                    const isOver = variance < 0;
                    return (
                      <tr key={i} className="border-b last:border-b-0">
                        <td className="p-2">{item.name}</td>
                        <td className="p-2 text-right">{formatCurrency(item.allocated)}</td>
                        <td className="p-2 text-right">{formatCurrency(item.actual)}</td>
                        <td className={cn("p-2 text-right font-medium", isOver ? "text-destructive" : "text-green-600")}>
                          {isOver ? "-" : "+"}{formatCurrency(Math.abs(variance))}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Events — Budget vs Collections vs Expenses</CardTitle>
              <DownloadButtons chartName="Event Finance" />
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={eventData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" fontSize={10} angle={-15} textAnchor="end" height={50} stroke="hsl(var(--muted-foreground))" />
                <YAxis fontSize={10} tickFormatter={(v) => formatCurrency(v)} stroke="hsl(var(--muted-foreground))" />
                <Tooltip formatter={(value: number) => `₹${value.toLocaleString("en-IN")}`} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="budget" fill="hsl(200, 60%, 50%)" name="Budget" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="collections" fill="hsl(142, 60%, 40%)" name="Collections" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="expenses" fill="hsl(16, 85%, 35%)" name="Expenses" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 border rounded-lg overflow-hidden text-xs">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/50 border-b">
                    <th className="text-left p-2 font-medium">Event</th>
                    <th className="text-right p-2 font-medium">Budget</th>
                    <th className="text-right p-2 font-medium">Collections</th>
                    <th className="text-right p-2 font-medium">Expenses</th>
                    <th className="text-right p-2 font-medium">Net</th>
                  </tr>
                </thead>
                <tbody>
                  {eventData.map((item, i) => {
                    const net = item.collections - item.expenses;
                    return (
                      <tr key={i} className="border-b last:border-b-0">
                        <td className="p-2">{item.name}</td>
                        <td className="p-2 text-right">{formatCurrency(item.budget)}</td>
                        <td className="p-2 text-right">{formatCurrency(item.collections)}</td>
                        <td className="p-2 text-right">{formatCurrency(item.expenses)}</td>
                        <td className={cn("p-2 text-right font-medium", net < 0 ? "text-destructive" : "text-green-600")}>
                          {net < 0 ? "-" : "+"}{formatCurrency(Math.abs(net))}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SimpleFinanceDashboard;
