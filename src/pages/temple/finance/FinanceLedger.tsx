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

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">General Ledger</h1>
          <p className="text-muted-foreground">Immutable double-entry accounting records</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2"><Download className="h-4 w-4" /> Export</Button>
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Date</TableHead>
                <TableHead className="text-xs">Txn ID</TableHead>
                <TableHead className="text-xs">Account</TableHead>
                <TableHead className="text-xs">Description</TableHead>
                <TableHead className="text-xs">Fund</TableHead>
                <TableHead className="text-xs text-right text-red-600">Debit</TableHead>
                <TableHead className="text-xs text-right text-green-600">Credit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.length === 0 ? (
                <TableRow><TableCell colSpan={7} className="text-center h-24 text-muted-foreground">No entries found</TableCell></TableRow>
              ) : paginated.map(entry => (
                <TableRow key={entry.id}>
                  <TableCell className="text-xs">{entry.date}</TableCell>
                  <TableCell className="text-xs font-mono text-primary">{entry.transactionId}</TableCell>
                  <TableCell className="text-xs font-medium">{entry.accountName}</TableCell>
                  <TableCell className="text-xs max-w-[200px] truncate">{entry.description}</TableCell>
                  <TableCell><Badge variant="secondary" className="text-[10px]">{entry.fund || "General"}</Badge></TableCell>
                  <TableCell className="text-xs text-right font-medium text-red-600">
                    {entry.debit > 0 ? `₹${entry.debit.toLocaleString()}` : ""}
                  </TableCell>
                  <TableCell className="text-xs text-right font-medium text-green-700">
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
