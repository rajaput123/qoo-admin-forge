import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { XCircle, Search, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";

const mockCancellations = [
  { id: "1", bookingId: "BK-2026-0007", source: "Online", offering: "Archana", structure: "Padmavathi Shrine", cancelledBy: "Devotee", refundAmount: 300, refundMode: "UPI", refundStatus: "Processed", cancelDate: "2026-02-09" },
  { id: "2", bookingId: "BK-2026-0008", source: "Online", offering: "Abhishekam", structure: "Main Temple", cancelledBy: "Admin", refundAmount: 2000, refundMode: "Card", refundStatus: "Processed", cancelDate: "2026-02-08" },
  { id: "3", bookingId: "BK-2026-0012", source: "Counter", offering: "Suprabhatam", structure: "Main Temple", cancelledBy: "Staff", refundAmount: 500, refundMode: "Cash", refundStatus: "Manual", cancelDate: "2026-02-08" },
  { id: "4", bookingId: "BK-2026-0015", source: "Online", offering: "VIP Darshan", structure: "Main Temple", cancelledBy: "Devotee", refundAmount: 600, refundMode: "UPI", refundStatus: "Pending", cancelDate: "2026-02-07" },
  { id: "5", bookingId: "BK-2026-0018", source: "Online", offering: "Sahasranama", structure: "Varadaraja Shrine", cancelledBy: "System", refundAmount: 0, refundMode: "—", refundStatus: "Not Eligible", cancelDate: "2026-02-06" },
];

const ITEMS_PER_PAGE = 5;

const CancellationsRefunds = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRefundStatus, setFilterRefundStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = mockCancellations.filter(c => {
    if (searchQuery && !c.bookingId.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (filterRefundStatus !== "all" && c.refundStatus !== filterRefundStatus) return false;
    return true;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleExport = () => {
    const csv = [
      ["Booking ID", "Source", "Offering", "Structure", "Cancelled By", "Refund Amount", "Refund Mode", "Refund Status", "Date"].join(","),
      ...filtered.map(c => [c.bookingId, c.source, c.offering, c.structure, c.cancelledBy, c.refundAmount, c.refundMode, c.refundStatus, c.cancelDate].join(","))
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cancellations-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Exported");
  };

  const refundColor = (s: string) => s === "Processed" ? "default" : s === "Pending" ? "secondary" : s === "Manual" ? "outline" : "destructive";

  return (
    <div className="p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Cancellations & Refunds</h1>
            <p className="text-muted-foreground">Track and control cancellations and refunds</p>
          </div>
          <Button variant="outline" onClick={handleExport} className="gap-2"><Download className="h-4 w-4" />Export</Button>
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search Booking ID..." className="pl-9" value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }} />
          </div>
          <Select value={filterRefundStatus} onValueChange={v => { setFilterRefundStatus(v); setCurrentPage(1); }}>
            <SelectTrigger className="w-[160px] bg-background"><SelectValue /></SelectTrigger>
            <SelectContent className="bg-popover"><SelectItem value="all">All Status</SelectItem><SelectItem value="Processed">Processed</SelectItem><SelectItem value="Pending">Pending</SelectItem><SelectItem value="Manual">Manual</SelectItem><SelectItem value="Not Eligible">Not Eligible</SelectItem></SelectContent>
          </Select>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-destructive/10 rounded-lg"><XCircle className="h-5 w-5 text-destructive" /></div>
              <div><CardTitle>Cancellations</CardTitle><CardDescription>{filtered.length} records</CardDescription></div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Source</TableHead>
                  <TableHead>Offering</TableHead>
                  <TableHead>Structure</TableHead>
                  <TableHead>Cancelled By</TableHead>
                  <TableHead className="text-right">Refund Amt</TableHead>
                  <TableHead>Refund Mode</TableHead>
                  <TableHead>Refund Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.map(c => (
                  <TableRow key={c.id} className="hover:bg-muted/50">
                    <TableCell className="text-sm">{c.source === "Online" ? "🌐" : "🏪"} {c.source}</TableCell>
                    <TableCell className="font-medium">{c.offering}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{c.structure}</TableCell>
                    <TableCell className="text-sm">{c.cancelledBy}</TableCell>
                    <TableCell className="text-right font-medium">{c.refundAmount > 0 ? `₹${c.refundAmount}` : "—"}</TableCell>
                    <TableCell className="text-sm">{c.refundMode}</TableCell>
                    <TableCell><Badge variant={refundColor(c.refundStatus) as any}>{c.refundStatus}</Badge></TableCell>
                    <TableCell className="text-sm">{c.cancelDate}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t">
                <p className="text-sm text-muted-foreground">Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}</p>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}><ChevronLeft className="h-4 w-4" /></Button>
                  {Array.from({ length: totalPages }, (_, i) => <Button key={i} variant={currentPage === i + 1 ? "default" : "ghost"} size="icon" className="h-8 w-8" onClick={() => setCurrentPage(i + 1)}>{i + 1}</Button>)}
                  <Button variant="ghost" size="icon" className="h-8 w-8" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}><ChevronRight className="h-4 w-4" /></Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default CancellationsRefunds;
