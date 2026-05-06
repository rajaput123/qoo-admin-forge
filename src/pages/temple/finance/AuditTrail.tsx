import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { History, Search, Filter, Download, User, ArrowUpRight, ArrowDownRight, Edit2, Trash2, Plus, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import FinanceDateFilter, { type DateRange } from "@/components/finance/FinanceDateFilter";

interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: "Created" | "Updated" | "Deleted" | "Approved" | "Rejected" | "Posted";
  module: string;
  entityId: string;
  description: string;
  amount?: number;
}

const auditLogs: AuditLog[] = [
  { id: "AL-001", timestamp: "2026-02-28 14:32:10", user: "Ravi Kumar", action: "Created", module: "Expense", entityId: "EXP-2026-001", description: "Created expense request: Gopuram Lighting Repair", amount: 45000 },
  { id: "AL-002", timestamp: "2026-02-28 13:15:45", user: "Admin", action: "Approved", module: "Expense", entityId: "EXP-2026-004", description: "Approved expense: Garden Maintenance Tools", amount: 15000 },
  { id: "AL-003", timestamp: "2026-02-28 11:20:33", user: "System", action: "Posted", module: "Transaction", entityId: "TXN-2026-00412", description: "Posted journal entry: Hundi Collection - Morning", amount: 45000 },
  { id: "AL-004", timestamp: "2026-02-27 16:45:20", user: "Lakshmi Devi", action: "Updated", module: "Budget", entityId: "BUD-003", description: "Updated budget allocation: Festival Expenses from ₹18L to ₹20L" },
  { id: "AL-005", timestamp: "2026-02-27 14:30:10", user: "Admin", action: "Rejected", module: "Expense", entityId: "EXP-2026-006", description: "Rejected expense: Unauthorized Vendor Payment - policy violation", amount: 55000 },
  { id: "AL-006", timestamp: "2026-02-27 10:15:50", user: "Suresh Babu", action: "Created", module: "Donation", entityId: "DON-2026-0892", description: "Recorded donation: Sri Raghav Trust - Gold Sponsor", amount: 200000 },
  { id: "AL-007", timestamp: "2026-02-26 17:20:30", user: "System", action: "Posted", module: "Transaction", entityId: "TXN-2026-00410", description: "Auto-posted salary disbursement for Feb 2026", amount: 285000 },
  { id: "AL-008", timestamp: "2026-02-26 09:10:15", user: "Admin", action: "Updated", module: "Fund", entityId: "F-002", description: "Updated fund balance: Gopuram Renovation - added ₹50,000 from new donation" },
  { id: "AL-009", timestamp: "2026-02-25 15:45:00", user: "Venkat Rao", action: "Deleted", module: "Budget", entityId: "BUD-009", description: "Deleted draft budget item: Temporary Staff (duplicate)" },
  { id: "AL-010", timestamp: "2026-02-25 11:30:22", user: "Admin", action: "Approved", module: "Expense", entityId: "EXP-2026-005", description: "Approved expense: Staff Uniform - New Batch", amount: 32000 },
];

const actionIcons: Record<string, React.ReactNode> = {
  Created: <Plus className="h-3.5 w-3.5" />,
  Updated: <Edit2 className="h-3.5 w-3.5" />,
  Deleted: <Trash2 className="h-3.5 w-3.5" />,
  Approved: <CheckCircle2 className="h-3.5 w-3.5" />,
  Rejected: <History className="h-3.5 w-3.5" />,
  Posted: <ArrowUpRight className="h-3.5 w-3.5" />,
};

const actionColors: Record<string, string> = {
  Created: "text-blue-700 bg-blue-100 border-blue-300",
  Updated: "text-amber-700 bg-amber-100 border-amber-300",
  Deleted: "text-red-600 bg-red-100 border-red-300",
  Approved: "text-green-700 bg-green-100 border-green-300",
  Rejected: "text-red-600 bg-red-100 border-red-300",
  Posted: "text-primary bg-primary/10 border-primary/30",
};

const AuditTrail = () => {
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [moduleFilter, setModuleFilter] = useState("all");
  const [dateRange, setDateRange] = useState<DateRange>({ from: null, to: null });

  const filtered = auditLogs.filter(log => {
    const matchSearch = !search || log.description.toLowerCase().includes(search.toLowerCase()) || log.user.toLowerCase().includes(search.toLowerCase());
    const matchAction = actionFilter === "all" || log.action === actionFilter;
    const matchModule = moduleFilter === "all" || log.module === moduleFilter;
    if (dateRange.from || dateRange.to) {
      const d = new Date(log.timestamp);
      if (dateRange.from && d < dateRange.from) return false;
      if (dateRange.to && d > dateRange.to) return false;
    }
    return matchSearch && matchAction && matchModule;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Audit Trail</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Complete log of all financial activities</p>
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="h-4 w-4" /> Export Logs
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-4 pb-4">
          <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search logs..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
            <FinanceDateFilter onDateRangeChange={setDateRange} />
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-[150px] bg-background"><SelectValue placeholder="Action" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="Created">Created</SelectItem>
                <SelectItem value="Updated">Updated</SelectItem>
                <SelectItem value="Deleted">Deleted</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
                <SelectItem value="Posted">Posted</SelectItem>
              </SelectContent>
            </Select>
            <Select value={moduleFilter} onValueChange={setModuleFilter}>
              <SelectTrigger className="w-[150px] bg-background"><SelectValue placeholder="Module" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Modules</SelectItem>
                <SelectItem value="Expense">Expense</SelectItem>
                <SelectItem value="Transaction">Transaction</SelectItem>
                <SelectItem value="Budget">Budget</SelectItem>
                <SelectItem value="Donation">Donation</SelectItem>
                <SelectItem value="Fund">Fund</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Audit Log Timeline */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Activity Log ({filtered.length} entries)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {filtered.map((log) => (
              <div key={log.id} className="flex items-start gap-3 p-3 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors">
                <div className={cn("w-8 h-8 rounded-full flex items-center justify-center shrink-0 border", actionColors[log.action])}>
                  {actionIcons[log.action]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm">{log.description}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1 flex-wrap">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {log.user}
                    </div>
                    <span>·</span>
                    <span>{log.timestamp}</span>
                    <span>·</span>
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0">{log.module}</Badge>
                    <span>·</span>
                    <span className="font-mono text-[10px]">{log.entityId}</span>
                  </div>
                </div>
                {log.amount && (
                  <p className="text-sm font-bold shrink-0">₹{log.amount.toLocaleString("en-IN")}</p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditTrail;
