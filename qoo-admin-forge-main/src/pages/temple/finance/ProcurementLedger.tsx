import { useMemo } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, BookOpen } from "lucide-react";
import { procurementLedger } from "@/stores/procurementStore";

const formatCurrency = (val: number) => `₹${val.toLocaleString("en-IN")}`;

const ProcurementLedger = () => {
  const stats = useMemo(() => ({
    total: procurementLedger.length,
    totalAmount: procurementLedger.reduce((s, l) => s + l.amount, 0),
  }), [procurementLedger.length]);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Procurement Ledger</h1>
        <p className="text-muted-foreground text-sm">Auto-posted double-entry accounting records from procurement payments</p>
      </div>

      <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 rounded-lg p-3">
        <BookOpen className="h-4 w-4" />
        <span>Every payment auto-posts: <strong>Debit</strong> Expense Account → <strong>Credit</strong> Cash/Bank Account</span>
      </div>

      <div className="grid grid-cols-2 gap-3 max-w-md">
        <Card><CardContent className="p-4 text-center">
          <div className="text-2xl font-bold">{stats.total}</div>
          <div className="text-xs text-muted-foreground">Entries</div>
        </CardContent></Card>
        <Card><CardContent className="p-4 text-center">
          <div className="text-2xl font-bold">{formatCurrency(stats.totalAmount)}</div>
          <div className="text-xs text-muted-foreground">Total Recorded</div>
        </CardContent></Card>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ledger ID</TableHead>
              <TableHead>Txn ID</TableHead>
              <TableHead>Request</TableHead>
              <TableHead>PO</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Debit</TableHead>
              <TableHead>Credit</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {procurementLedger.map(entry => (
              <TableRow key={entry.id}>
                <TableCell className="font-medium">{entry.id}</TableCell>
                <TableCell>{entry.transactionId}</TableCell>
                <TableCell>{entry.requestId}</TableCell>
                <TableCell>{entry.poId}</TableCell>
                <TableCell className="text-right font-medium">{formatCurrency(entry.amount)}</TableCell>
                <TableCell className="text-red-600">{entry.debitAccount}</TableCell>
                <TableCell className="text-emerald-600">{entry.creditAccount}</TableCell>
                <TableCell>{entry.date}</TableCell>
                <TableCell className="max-w-[200px] truncate text-muted-foreground">{entry.description}</TableCell>
              </TableRow>
            ))}
            {procurementLedger.length === 0 && (
              <TableRow><TableCell colSpan={9} className="text-center py-8 text-muted-foreground">No ledger entries yet. Record a payment to auto-post.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Full chain */}
      {procurementLedger.length > 0 && (
        <div className="bg-muted/50 rounded-lg p-4 text-xs space-y-2">
          <div className="font-medium text-sm">Full Traceability Example:</div>
          {procurementLedger.slice(0, 1).map(entry => (
            <div key={entry.id} className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline">Request: {entry.requestId}</Badge>
              <ArrowRight className="h-3 w-3" />
              <Badge variant="outline">PO: {entry.poId}</Badge>
              <ArrowRight className="h-3 w-3" />
              <Badge variant="outline">Invoice: {entry.invoiceId}</Badge>
              <ArrowRight className="h-3 w-3" />
              <Badge variant="outline">Payment: {entry.paymentId}</Badge>
              <ArrowRight className="h-3 w-3" />
              <Badge variant="outline">Txn: {entry.transactionId}</Badge>
              <ArrowRight className="h-3 w-3" />
              <Badge variant="outline">Ledger: {entry.id}</Badge>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default ProcurementLedger;
