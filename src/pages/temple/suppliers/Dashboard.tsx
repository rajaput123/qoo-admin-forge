import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, FileText, Truck, CreditCard, IndianRupee, AlertCircle, TrendingUp } from "lucide-react";

const kpis = [
  { label: "Active Suppliers", value: "34", icon: Users, description: "Verified & active" },
  { label: "Pending Onboarding", value: "5", icon: Users, description: "Awaiting review" },
  { label: "Open POs", value: "12", icon: FileText, description: "Pending delivery" },
  { label: "Pending Deliveries", value: "8", icon: Truck, description: "Expected this week" },
  { label: "Pending Payments", value: "6", icon: CreditCard, description: "Awaiting settlement" },
  { label: "Monthly Procurement", value: "₹4,85,000", icon: IndianRupee, description: "Feb 2026" },
];

const topSuppliers = [
  { name: "Sri Lakshmi Flowers", category: "Flowers", totalSpend: 185000, orders: 24, rating: 4.8 },
  { name: "Annapurna Grocery", category: "Grocery", totalSpend: 142000, orders: 18, rating: 4.5 },
  { name: "Shiva Pooja Stores", category: "Pooja Materials", totalSpend: 98000, orders: 15, rating: 4.7 },
  { name: "Nandi Oil & Ghee", category: "Oil & Ghee", totalSpend: 76000, orders: 12, rating: 4.3 },
  { name: "Devi Decorations", category: "Decoration", totalSpend: 64000, orders: 8, rating: 4.6 },
];

const alerts = [
  { type: "warning", message: "PO-2026-042 delivery overdue by 2 days – Sri Lakshmi Flowers" },
  { type: "info", message: "3 new onboarding requests pending review" },
  { type: "warning", message: "Payment overdue for INV-2026-018 – Annapurna Grocery" },
  { type: "info", message: "Nandi Oil & Ghee contract renewal due in 15 days" },
];

const Dashboard = () => {
  return (
    <div className="p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">Supplier Dashboard</h1>
          <p className="text-muted-foreground">Procurement overview and key metrics</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          {kpis.map((kpi, i) => (
            <Card key={i} className="group hover:shadow-md transition-all duration-200">
              <CardContent className="p-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-muted group-hover:bg-primary group-hover:shadow-lg transition-all duration-200 mb-2">
                  <kpi.icon className="h-5 w-5 text-muted-foreground group-hover:text-primary-foreground transition-colors duration-200" />
                </div>
                <p className="text-xl font-bold">{kpi.value}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{kpi.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                Top Suppliers by Spend
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Supplier</TableHead>
                    <TableHead className="text-right">Total Spend</TableHead>
                    <TableHead className="text-center">Orders</TableHead>
                    <TableHead className="text-center">Rating</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topSuppliers.map((s, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <p className="font-medium text-sm">{s.name}</p>
                        <p className="text-xs text-muted-foreground">{s.category}</p>
                      </TableCell>
                      <TableCell className="text-right font-medium text-sm">₹{s.totalSpend.toLocaleString()}</TableCell>
                      <TableCell className="text-center text-sm">{s.orders}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className="text-xs">⭐ {s.rating}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                Alerts & Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {alerts.map((a, i) => (
                <div key={i} className={`flex items-start gap-3 p-3 rounded-lg border ${a.type === "warning" ? "border-amber-200 bg-amber-50" : "border-blue-200 bg-blue-50"}`}>
                  <AlertCircle className={`h-4 w-4 mt-0.5 shrink-0 ${a.type === "warning" ? "text-amber-600" : "text-blue-600"}`} />
                  <p className="text-sm">{a.message}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
