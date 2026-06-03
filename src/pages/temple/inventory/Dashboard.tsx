import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertTriangle, PackageX, Clock, ArrowDownToLine, ArrowUpFromLine, MapPin } from "lucide-react";
import { stockItems, stockTransactions, templeStructures } from "@/data/inventoryData";

const Dashboard = () => {
  const lowStockItems = stockItems.filter(i => i.currentStock <= i.reorderLevel && i.currentStock > 0);
  const outOfStockItems = stockItems.filter(i => i.currentStock <= 0);
  const expiringSoon = stockItems.filter(i => i.expiryApplicable && i.expiryDate && new Date(i.expiryDate) <= new Date("2026-02-12"));
  const todayInward = stockTransactions.filter(t => t.date === "2026-02-10" && (t.transactionType === "Purchase In" || t.transactionType === "Donation In"));
  const todayUsage = stockTransactions.filter(t => t.date === "2026-02-10" && t.transactionType === "Usage Out");

  // Structure-wise summary
  const structureSummary = templeStructures.map(s => {
    const items = stockItems.filter(i => i.defaultStructure === s.name);
    const totalValue = items.reduce((sum, i) => sum + i.currentStock * i.pricePerUnit, 0);
    const lowCount = items.filter(i => i.currentStock <= i.reorderLevel).length;
    return { ...s, itemCount: items.length, totalValue, lowCount };
  }).filter(s => s.itemCount > 0);

  const kpis = [
    { label: "Low Stock Items", value: lowStockItems.length.toString(), icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Out of Stock", value: outOfStockItems.length.toString(), icon: PackageX, color: "text-destructive", bg: "bg-red-50" },
    { label: "Expiring Soon", value: expiringSoon.length.toString(), icon: Clock, color: "text-orange-600", bg: "bg-orange-50" },
    { label: "Today's Inward", value: todayInward.length.toString(), icon: ArrowDownToLine, color: "text-green-600", bg: "bg-green-50" },
    { label: "Today's Usage", value: todayUsage.length.toString(), icon: ArrowUpFromLine, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Structures", value: structureSummary.length.toString(), icon: MapPin, color: "text-primary", bg: "bg-primary/5" },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Stock & Inventory Dashboard</h1>
        <p className="text-muted-foreground text-sm">Operational overview – {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpis.map((kpi, i) => (
          <Card key={i} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${kpi.bg} mb-2`}>
                <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
              </div>
              <p className="text-2xl font-bold">{kpi.value}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{kpi.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Alert */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              Low Stock Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead className="text-right">Current</TableHead>
                  <TableHead className="text-right">Reorder Level</TableHead>
                  <TableHead>Structure</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lowStockItems.length === 0 ? (
                  <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-6">No low stock items</TableCell></TableRow>
                ) : (
                  lowStockItems.map(item => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.code}</p>
                      </TableCell>
                      <TableCell className="text-right font-medium text-sm text-amber-600">{item.currentStock} {item.unit}</TableCell>
                      <TableCell className="text-right text-sm text-muted-foreground">{item.reorderLevel} {item.unit}</TableCell>
                      <TableCell><Badge variant="outline" className="text-xs">{item.defaultStructure}</Badge></TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Expiring Soon */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="h-4 w-4 text-orange-600" />
              Expiring Soon
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Batch</TableHead>
                  <TableHead>Expiry</TableHead>
                  <TableHead className="text-right">Stock</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expiringSoon.length === 0 ? (
                  <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-6">No items expiring soon</TableCell></TableRow>
                ) : (
                  expiringSoon.map(item => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium text-sm">{item.name}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{item.batchNumber}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs text-orange-600 border-orange-200 bg-orange-50">
                          {item.expiryDate}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-sm">{item.currentStock} {item.unit}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Structure-wise Summary */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            Structure-wise Stock Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Structure</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-center">Items</TableHead>
                <TableHead className="text-center">Low Stock</TableHead>
                <TableHead className="text-right">Total Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {structureSummary.map(s => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium text-sm">{s.name}</TableCell>
                  <TableCell><Badge variant="outline" className="text-xs">{s.type}</Badge></TableCell>
                  <TableCell className="text-center text-sm">{s.itemCount}</TableCell>
                  <TableCell className="text-center">
                    {s.lowCount > 0 ? (
                      <Badge variant="destructive" className="text-xs">{s.lowCount}</Badge>
                    ) : (
                      <span className="text-xs text-muted-foreground">0</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right font-medium text-sm">₹{s.totalValue.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Dashboard;
