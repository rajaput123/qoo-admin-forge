import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const mockAccounts = [
  { name: "SBI Current Account", detail: "A/C: 1234567890 • IFSC: SBIN0001234", balance: 8800000, label: "Current Balance", status: "Active", statusClass: "bg-green-50 text-green-700 border-green-200" },
  { name: "HDFC Fixed Deposit", detail: "A/C: 0987654321 • Matures: 12 Dec 2026", balance: 28000000, label: "Principal Amount", status: "Active", statusClass: "bg-green-50 text-green-700 border-green-200" },
  { name: "Main Cash Counter", detail: "Physical Cash in Safe", balance: 245000, label: "Cash in Hand", status: "Cash", statusClass: "bg-blue-50 text-blue-700 border-blue-200" },
];

const formatCurrency = (val: number) => `₹${val.toLocaleString("en-IN")}`;

const AccountsPage = () => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-sm font-semibold">Bank & Cash Accounts Manager</h1>
          <Button size="sm" className="text-xs">+ New Account</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockAccounts.map((acc) => (
            <div key={acc.name} className="border rounded-lg p-4 hover:shadow-md cursor-pointer transition-shadow">
              <div className="flex items-center justify-between border-b pb-2 mb-2">
                <span className="font-semibold text-sm">{acc.name}</span>
                <Badge variant="outline" className={acc.statusClass}>{acc.status}</Badge>
              </div>
              <div className="text-xs text-muted-foreground mb-1">{acc.detail}</div>
              <div className="flex items-end justify-between mt-4">
                <span className="text-xs text-muted-foreground">{acc.label}</span>
                <span className="text-lg font-bold">{formatCurrency(acc.balance)}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

export default AccountsPage;
