import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Package, Factory, Warehouse, Store, AlertTriangle, TrendingUp, Clock, Heart } from "lucide-react";

const kpiData = [
  { title: "Active Prasadam Types", value: "24", icon: Package, trend: "+2 this month", color: "text-primary" },
  { title: "Today's Production", value: "18,500", subtitle: "units across 6 batches", icon: Factory, color: "text-blue-600" },
  { title: "Finished Stock", value: "42,300", subtitle: "units available", icon: Warehouse, color: "text-green-600" },
  { title: "Counter Allocations", value: "12", subtitle: "counters active", icon: Store, color: "text-purple-600" },
  { title: "Expiring Soon", value: "3", subtitle: "batches in 4 hours", icon: AlertTriangle, color: "text-amber-600" },
  { title: "Online Reservations", value: "2,450", subtitle: "pending pickup", icon: Clock, color: "text-cyan-600" },
  { title: "Sponsorship Today", value: "5,000", subtitle: "units sponsored", icon: Heart, color: "text-rose-600" },
  { title: "Monthly Value", value: "₹18.5L", subtitle: "procurement cost", icon: TrendingUp, color: "text-emerald-600" },
];

const recentBatches = [
  { id: "BTH-2024-0891", prasadam: "Laddu Prasadam", qty: 5000, produced: "Today 6:00 AM", expiry: "Today 6:00 PM", status: "Active" },
  { id: "BTH-2024-0890", prasadam: "Pulihora", qty: 3000, produced: "Today 5:30 AM", expiry: "Today 1:30 PM", status: "Active" },
  { id: "BTH-2024-0889", prasadam: "Sweet Pongal", qty: 2500, produced: "Today 5:00 AM", expiry: "Today 11:00 AM", status: "Expiring Soon" },
  { id: "BTH-2024-0888", prasadam: "Vada", qty: 4000, produced: "Today 7:00 AM", expiry: "Today 3:00 PM", status: "Active" },
  { id: "BTH-2024-0887", prasadam: "Curd Rice", qty: 2000, produced: "Yesterday 5:00 PM", expiry: "Today 5:00 AM", status: "Expired" },
];

const topPrasadam = [
  { name: "Laddu Prasadam", daily: "15,000", revenue: "₹3.75L" },
  { name: "Pulihora", daily: "8,000", revenue: "₹1.20L" },
  { name: "Sweet Pongal", daily: "6,000", revenue: "₹1.50L" },
  { name: "Vada", daily: "10,000", revenue: "₹2.00L" },
];

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Prasadam Dashboard</h2>
          <p className="text-sm text-muted-foreground mt-1">Daily production & distribution overview</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">Today's Plan</Button>
          <Button size="sm">New Batch</Button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpiData.map((kpi) => (
          <Card key={kpi.title} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
                {kpi.trend && <span className="text-xs text-green-600">{kpi.trend}</span>}
              </div>
              <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{kpi.subtitle || kpi.title}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Recent Batches */}
        <Card className="md:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Recent Batches</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Batch ID</TableHead>
                  <TableHead>Prasadam</TableHead>
                  <TableHead className="text-right">Qty</TableHead>
                  <TableHead>Expiry</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentBatches.map((batch) => (
                  <TableRow key={batch.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell className="font-mono text-xs">{batch.id}</TableCell>
                    <TableCell className="font-medium">{batch.prasadam}</TableCell>
                    <TableCell className="text-right">{batch.qty.toLocaleString()}</TableCell>
                    <TableCell className="text-xs">{batch.expiry}</TableCell>
                    <TableCell>
                      <Badge variant={batch.status === "Active" ? "default" : batch.status === "Expired" ? "destructive" : "secondary"} className="text-xs">
                        {batch.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Top Prasadam */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Top Prasadam by Volume</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {topPrasadam.map((item, i) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-muted-foreground w-4">{i + 1}</span>
                  <div>
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.daily}/day</p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-foreground">{item.revenue}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      <Card className="border-amber-200 bg-amber-50/50">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <span className="text-sm font-semibold text-amber-800">Active Alerts</span>
          </div>
          <div className="space-y-1.5 text-sm text-amber-700">
            <p>• Batch BTH-2024-0889 (Sweet Pongal) expires in 2 hours — 800 units remaining</p>
            <p>• Low stock: Ghee — only 15kg remaining (minimum: 50kg)</p>
            <p>• Counter C4 has not reconciled yesterday's allocation</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
