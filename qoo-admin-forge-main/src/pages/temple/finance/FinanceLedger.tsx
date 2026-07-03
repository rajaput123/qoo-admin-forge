import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Filter, Download, ChevronDown, ChevronUp } from "lucide-react";
import { financeSelectors } from "@/modules/finance/financeStore";
import { LedgerEntry } from "@/modules/finance/types";
import {
  Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious,
} from "@/components/ui/pagination";

const FinanceLedger = () => {
  const ledgerEntries = financeSelectors.getLedgerEntries();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const filtered = ledgerEntries.filter(e =>
    e.description.toLowerCase().includes(search.toLowerCase()) ||
    e.transactionId.toLowerCase().includes(search.toLowerCase()) ||
    e.accountName.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleExport = () => {
    const headers = ["Date", "Txn ID", "Account", "Description", "Fund", "Debit (₹)", "Credit (₹)"];
    const rows = filtered.map(e => [
      e.date,
      e.transactionId,
      e.accountName,
      `"${e.description.replace(/"/g, '""')}"`,
      e.fund || "General",
      e.debit > 0 ? e.debit.toString() : "",
      e.credit > 0 ? e.credit.toString() : "",
    ]);
    const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ledger_export_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">General Ledger</h1>
          <p className="text-muted-foreground">Immutable double-entry accounting records</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={handleExport}><Download className="h-4 w-4" /> Export CSV</Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Ledger Entries</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search ledger..." value={search} onChange={e => setSearch(e.target.value)} className="pl-8" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table className="border-collapse">
            <TableHeader>
              <TableRow className="border-b border-border">
                <TableHead className="text-xs border border-border">Date</TableHead>
                <TableHead className="text-xs border border-border">Txn ID</TableHead>
                <TableHead className="text-xs border border-border">Account</TableHead>
                <TableHead className="text-xs border border-border">Description</TableHead>
                <TableHead className="text-xs border border-border">Fund</TableHead>
                <TableHead className="text-xs text-right text-red-600 border border-border">Debit</TableHead>
                <TableHead className="text-xs text-right text-green-600 border border-border">Credit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.length === 0 ? (
                <TableRow><TableCell colSpan={7} className="text-center h-24 text-muted-foreground border border-border">No entries found</TableCell></TableRow>
              ) : paginated.map(entry => (
                <TableRow key={entry.id} className="border-b border-border">
                  <TableCell className="text-xs border border-border">{entry.date}</TableCell>
                  <TableCell className="text-xs font-mono text-primary border border-border">{entry.transactionId}</TableCell>
                  <TableCell className="text-xs font-medium border border-border">{entry.accountName}</TableCell>
                  <TableCell className="text-xs max-w-[200px] truncate border border-border">{entry.description}</TableCell>
                  <TableCell className="border border-border"><Badge variant="secondary" className="text-[10px]">{entry.fund || "General"}</Badge></TableCell>
                  <TableCell className="text-xs text-right font-medium text-red-600 border border-border">
                    {entry.debit > 0 ? `₹${entry.debit.toLocaleString()}` : ""}
                  </TableCell>
                  <TableCell className="text-xs text-right font-medium text-green-700 border border-border">
                    {entry.credit > 0 ? `₹${entry.credit.toLocaleString()}` : ""}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious onClick={() => setCurrentPage(p => Math.max(1, p - 1))} className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"} />
            </PaginationItem>
            {Array.from({ length: totalPages }).map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink isActive={currentPage === i + 1} onClick={() => setCurrentPage(i + 1)} className="cursor-pointer">{i + 1}</PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </motion.div>
  );
};

export default FinanceLedger;
