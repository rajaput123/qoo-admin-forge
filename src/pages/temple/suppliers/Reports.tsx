import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BarChart3, PieChart as PieIcon, TrendingUp, AlertCircle } from "lucide-react";

const monthlyProcurement = [
  { month: "Sep", amount: 320000 },
  { month: "Oct", amount: 380000 },
  { month: "Nov", amount: 290000 },
  { month: "Dec", amount: 520000 },
  { month: "Jan", amount: 410000 },
  { month: "Feb", amount: 485000 },
];

const categorySpend = [
  { name: "Flowers", value: 185000, color: "#ec4899" },
  { name: "Grocery", value: 142000, color: "#22c55e" },
  { name: "Pooja Materials", value: 98000, color: "#f97316" },
  { name: "Oil & Ghee", value: 76000, color: "#f59e0b" },
  { name: "Decoration", value: 64000, color: "#a855f7" },
  { name: "Milk & Dairy", value: 55000, color: "#06b6d4" },
  { name: "Others", value: 50000, color: "#64748b" },
];

const structureWise = [
  { structure: "Main Temple", amount: 295000 },
  { structure: "Kitchen", amount: 210000 },
  { structure: "Shrines", amount: 85000 },
  { structure: "Event Area", amount: 80000 },
];

const performanceData = [
  { supplier: "Sri Lakshmi Flowers", orders: 24, onTime: 24, quality: 4.8, spend: 185000, dependency: "High" },
  { supplier: "Annapurna Grocery", orders: 18, onTime: 17, quality: 4.5, spend: 142000, dependency: "High" },
  { supplier: "Shiva Pooja Stores", orders: 15, onTime: 15, quality: 4.7, spend: 98000, dependency: "Medium" },
  { supplier: "Nandi Oil & Ghee", orders: 12, onTime: 11, quality: 4.3, spend: 76000, dependency: "Medium" },
  { supplier: "Devi Decorations", orders: 8, onTime: 7, quality: 4.6, spend: 64000, dependency: "Low" },
  { supplier: "Surya Milk Dairy", orders: 30, onTime: 26, quality: 4.4, spend: 55000, dependency: "High" },
];

const pendingPayments = [
  { supplier: "Sri Lakshmi Flowers", invoice: "INV-2026-020", amount: 9000, dueDate: "2026-02-15", status: "Pending" },
  { supplier: "Annapurna Grocery", invoice: "INV-2026-019", amount: 3500, dueDate: "2026-02-12", status: "Partially Paid" },
  { supplier: "Surya Milk Dairy", invoice: "INV-2026-021", amount: 3000, dueDate: "2026-02-08", status: "Overdue" },
  { supplier: "Nandi Oil & Ghee", invoice: "—", amount: 17250, dueDate: "—", status: "Pending" },
];

const Reports = () => {
  return (
    <div className="p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">Supplier Reports</h1>
          <p className="text-muted-foreground">Procurement analytics and insights</p>
        </div>

        <Tabs defaultValue="procurement">
          <TabsList className="grid grid-cols-5 w-full max-w-2xl">
            <TabsTrigger value="procurement">Procurement</TabsTrigger>
            <TabsTrigger value="category">Category</TabsTrigger>
            <TabsTrigger value="structure">Structure</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
          </TabsList>

          <TabsContent value="procurement" className="mt-6">
            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><BarChart3 className="h-4 w-4" />Monthly Procurement Summary</CardTitle></CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyProcurement}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="month" className="text-xs" />
                      <YAxis className="text-xs" tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
                      <Tooltip formatter={(v: number) => [`₹${v.toLocaleString()}`, "Amount"]} />
                      <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="category" className="mt-6">
            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><PieIcon className="h-4 w-4" />Category-wise Spend</CardTitle></CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={categorySpend} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                        {categorySpend.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                      </Pie>
                      <Tooltip formatter={(v: number) => [`₹${v.toLocaleString()}`, "Spend"]} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="structure" className="mt-6">
            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-base">Structure-wise Procurement</CardTitle></CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={structureWise} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis type="number" tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} className="text-xs" />
                      <YAxis dataKey="structure" type="category" className="text-xs" width={100} />
                      <Tooltip formatter={(v: number) => [`₹${v.toLocaleString()}`, "Amount"]} />
                      <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="mt-6">
            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><TrendingUp className="h-4 w-4" />Supplier Performance Report</CardTitle></CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Supplier</TableHead>
                      <TableHead className="text-center">Orders</TableHead>
                      <TableHead className="text-center">On-Time %</TableHead>
                      <TableHead className="text-center">Quality</TableHead>
                      <TableHead className="text-right">Total Spend</TableHead>
                      <TableHead>Dependency</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {performanceData.map((p, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium text-sm">{p.supplier}</TableCell>
                        <TableCell className="text-center text-sm">{p.orders}</TableCell>
                        <TableCell className="text-center text-sm">{Math.round(p.onTime / p.orders * 100)}%</TableCell>
                        <TableCell className="text-center"><Badge variant="outline" className="text-xs">⭐ {p.quality}</Badge></TableCell>
                        <TableCell className="text-right text-sm">₹{p.spend.toLocaleString()}</TableCell>
                        <TableCell><Badge variant="secondary" className={`text-xs ${p.dependency === "High" ? "bg-red-100 text-red-700" : p.dependency === "Medium" ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"}`}>{p.dependency}</Badge></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="mt-6">
            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><AlertCircle className="h-4 w-4 text-amber-600" />Pending Payments Report</CardTitle></CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Supplier</TableHead>
                      <TableHead>Invoice</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingPayments.map((p, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium text-sm">{p.supplier}</TableCell>
                        <TableCell className="font-mono text-xs">{p.invoice}</TableCell>
                        <TableCell className="text-right font-medium text-sm">₹{p.amount.toLocaleString()}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{p.dueDate}</TableCell>
                        <TableCell><Badge variant="outline" className={`text-[10px] ${p.status === "Overdue" ? "text-red-700 border-red-300 bg-red-50" : p.status === "Partially Paid" ? "text-amber-700 border-amber-300 bg-amber-50" : "text-blue-700 border-blue-300 bg-blue-50"}`}>{p.status}</Badge></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default Reports;
