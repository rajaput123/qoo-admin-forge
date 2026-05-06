import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart3, TrendingDown, TrendingUp, AlertTriangle, Package, IndianRupee } from "lucide-react";
import { stockItems, stockTransactions, stockRequests, stockAdjustments } from "@/data/inventoryData";

const Reports = () => {
  // Stock valuation
  const totalValue = stockItems.reduce((sum, i) => sum + i.currentStock * i.pricePerUnit, 0);
  const totalItems = stockItems.length;
  const lowStockCount = stockItems.filter(i => i.currentStock <= i.reorderLevel).length;
  const ritualItems = stockItems.filter(i => i.ritualUse).length;

  // Transaction summary
  const totalInward = stockTransactions.filter(t => t.transactionType === "Purchase In" || t.transactionType === "Donation In").reduce((sum, t) => sum + t.quantity, 0);
  const totalOutward = stockTransactions.filter(t => t.transactionType === "Usage Out").reduce((sum, t) => sum + t.quantity, 0);
  const totalWaste = stockTransactions.filter(t => t.transactionType === "Damage / Waste").reduce((sum, t) => sum + t.quantity, 0);

  // Category-wise breakdown
  const categoryBreakdown = stockItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = { count: 0, value: 0, lowStock: 0 };
    acc[item.category].count++;
    acc[item.category].value += item.currentStock * item.pricePerUnit;
    if (item.currentStock <= item.reorderLevel) acc[item.category].lowStock++;
    return acc;
  }, {} as Record<string, { count: number; value: number; lowStock: number }>);

  // Top consumed items (by outward transactions)
  const consumptionMap = stockTransactions
    .filter(t => t.transactionType === "Usage Out")
    .reduce((acc, t) => {
      acc[t.itemName] = (acc[t.itemName] || 0) + t.quantity;
      return acc;
    }, {} as Record<string, number>);

  const topConsumed = Object.entries(consumptionMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  const kpis = [
    { label: "Total Items", value: totalItems.toString(), icon: Package, color: "text-primary" },
    { label: "Stock Valuation", value: `₹${totalValue.toLocaleString()}`, icon: IndianRupee, color: "text-green-600" },
    { label: "Low Stock Items", value: lowStockCount.toString(), icon: AlertTriangle, color: "text-amber-600" },
    { label: "Total Inward", value: totalInward.toString(), icon: TrendingUp, color: "text-green-600" },
    { label: "Total Usage", value: totalOutward.toString(), icon: TrendingDown, color: "text-blue-600" },
    { label: "Wastage", value: totalWaste.toString(), icon: AlertTriangle, color: "text-red-600" },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Inventory Reports</h1>
        <p className="text-muted-foreground text-sm">Stock analytics, consumption patterns & audit data</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpis.map((kpi, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <kpi.icon className={`h-5 w-5 ${kpi.color} mb-2`} />
              <p className="text-xl font-bold">{kpi.value}</p>
              <p className="text-[11px] text-muted-foreground">{kpi.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" />
              Category-wise Stock
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-center">Items</TableHead>
                  <TableHead className="text-center">Low Stock</TableHead>
                  <TableHead className="text-right">Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(categoryBreakdown).sort((a, b) => b[1].value - a[1].value).map(([cat, data]) => (
                  <TableRow key={cat}>
                    <TableCell className="font-medium text-sm">{cat}</TableCell>
                    <TableCell className="text-center text-sm">{data.count}</TableCell>
                    <TableCell className="text-center">
                      {data.lowStock > 0 ? <Badge variant="destructive" className="text-xs">{data.lowStock}</Badge> : <span className="text-xs text-muted-foreground">0</span>}
                    </TableCell>
                    <TableCell className="text-right font-medium text-sm">₹{data.value.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Top Consumed Items */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-blue-600" />
              Top Consumed Items
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead className="text-right">Total Usage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topConsumed.map(([name, qty]) => (
                  <TableRow key={name}>
                    <TableCell className="font-medium text-sm">{name}</TableCell>
                    <TableCell className="text-right font-medium text-sm">{qty}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Adjustment Audit Trail */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Audit Trail – Recent Adjustments</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead className="text-right">Difference</TableHead>
                <TableHead>By</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stockAdjustments.map(adj => (
                <TableRow key={adj.id}>
                  <TableCell className="text-sm">{adj.date}</TableCell>
                  <TableCell className="font-medium text-sm">{adj.itemName}</TableCell>
                  <TableCell><Badge variant="outline" className="text-xs">{adj.reason}</Badge></TableCell>
                  <TableCell className={`text-right text-sm font-medium ${adj.difference < 0 ? 'text-destructive' : 'text-green-600'}`}>
                    {adj.difference > 0 ? "+" : ""}{adj.difference}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{adj.adjustedBy}</TableCell>
                  <TableCell className="text-xs text-muted-foreground max-w-[200px] truncate">{adj.notes}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Request Summary */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Stock Request Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {(["Pending", "Approved", "Partially Issued", "Issued", "Rejected"] as const).map(status => {
              const count = stockRequests.filter(r => r.status === status).length;
              return (
                <div key={status} className="text-center p-3 border rounded-lg">
                  <p className="text-2xl font-bold">{count}</p>
                  <p className="text-xs text-muted-foreground">{status}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Reports;
