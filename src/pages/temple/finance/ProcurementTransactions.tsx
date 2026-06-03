import { useMemo } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { procurementTransactions } from "@/stores/procurementStore";

const formatCurrency = (val: number) => `₹${val.toLocaleString("en-IN")}`;

const ProcurementTransactions = () => {
  const stats = useMemo(() => ({
    total: procurementTransactions.length,
    totalAmount: procurementTransactions.reduce((s, t) => s + t.amount, 0),
  }), [procurementTransactions.length]);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Transactions</h1>
        <p className="text-muted-foreground text-sm">Auto-generated from payments — actual money movement records</p>
      </div>

      <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 rounded-lg p-3">
        <span className="font-medium">Source:</span>
        <span>Payment recorded</span> <ArrowRight className="h-3 w-3" />
        <span className="font-medium">Transaction auto-created</span> <ArrowRight className="h-3 w-3" />
        <span>Ledger auto-posted</span>
      </div>

      <div className="grid grid-cols-2 gap-3 max-w-md">
        <Card><CardContent className="p-4 text-center">
          <div className="text-2xl font-bold">{stats.total}</div>
          <div className="text-xs text-muted-foreground">Transactions</div>
        </CardContent></Card>
        <Card><CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{formatCurrency(stats.totalAmount)}</div>
          <div className="text-xs text-muted-foreground">Total Expenses</div>
        </CardContent></Card>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Txn ID</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Request</TableHead>
              <TableHead>PO</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Account</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {procurementTransactions.map(txn => (
              <TableRow key={txn.id}>
                <TableCell className="font-medium">{txn.id}</TableCell>
                <TableCell>{txn.paymentId}</TableCell>
                <TableCell>{txn.requestId}</TableCell>
                <TableCell>{txn.poId}</TableCell>
                <TableCell><Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">{txn.type}</Badge></TableCell>
                <TableCell className="text-right font-medium text-red-600">{formatCurrency(txn.amount)}</TableCell>
                <TableCell>{txn.account}</TableCell>
                <TableCell>{txn.date}</TableCell>
                <TableCell className="max-w-[200px] truncate text-muted-foreground">{txn.description}</TableCell>
              </TableRow>
            ))}
            {procurementTransactions.length === 0 && (
              <TableRow><TableCell colSpan={9} className="text-center py-8 text-muted-foreground">No transactions yet. Record a payment to auto-generate.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </motion.div>
  );
};

export default ProcurementTransactions;
