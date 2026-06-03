import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  CheckCircle2, XCircle, Clock, Eye, IndianRupee,
  AlertTriangle, ArrowUpRight, FileText, User
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ApprovalItem {
  id: string;
  title: string;
  amount: number;
  requestedBy: string;
  department: string;
  date: string;
  category: string;
  status: "Pending" | "Approved" | "Rejected";
  priority: "Normal" | "Urgent";
  description: string;
}

const approvalItems: ApprovalItem[] = [
  { id: "EXP-2026-001", title: "Gopuram Lighting Repair", amount: 45000, requestedBy: "Ravi Kumar", department: "Maintenance", date: "2026-02-28", category: "Maintenance", status: "Pending", priority: "Urgent", description: "Emergency repair needed for main gopuram lighting system" },
  { id: "EXP-2026-002", title: "Prasadam Ingredients - March", amount: 85000, requestedBy: "Lakshmi Devi", department: "Kitchen", date: "2026-02-27", category: "Annadanam", status: "Pending", priority: "Normal", description: "Monthly purchase of rice, dal, and cooking supplies for Annadanam" },
  { id: "EXP-2026-003", title: "Sound System - Brahmotsavam", amount: 120000, requestedBy: "Suresh Babu", department: "Events", date: "2026-02-26", category: "Events", status: "Pending", priority: "Normal", description: "PA system rental for upcoming Brahmotsavam festivities" },
  { id: "EXP-2026-004", title: "Garden Maintenance Tools", amount: 15000, requestedBy: "Venkat Rao", department: "Maintenance", date: "2026-02-25", category: "Maintenance", status: "Approved", priority: "Normal", description: "Purchase of gardening tools and fertilizers" },
  { id: "EXP-2026-005", title: "Staff Uniform - New Batch", amount: 32000, requestedBy: "HR Admin", department: "HR", date: "2026-02-24", category: "Staff", status: "Approved", priority: "Normal", description: "Uniforms for newly joined temple staff" },
  { id: "EXP-2026-006", title: "Unauthorized Vendor Payment", amount: 55000, requestedBy: "Unknown", department: "Admin", date: "2026-02-23", category: "Other", status: "Rejected", priority: "Normal", description: "Payment to non-registered vendor - rejected for policy violation" },
];

const formatCurrency = (val: number) => `₹${val.toLocaleString("en-IN")}`;

const ExpenseApprovals = () => {
  const [selectedItem, setSelectedItem] = useState<ApprovalItem | null>(null);
  const [tab, setTab] = useState("pending");

  const pending = approvalItems.filter(i => i.status === "Pending");
  const approved = approvalItems.filter(i => i.status === "Approved");
  const rejected = approvalItems.filter(i => i.status === "Rejected");
  const filtered = tab === "pending" ? pending : tab === "approved" ? approved : rejected;

  const totalPending = pending.reduce((s, i) => s + i.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Expense Approvals</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Review and approve expense requests</p>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="h-4 w-4 text-amber-600" />
              <span className="text-xs text-muted-foreground">Pending</span>
            </div>
            <p className="text-xl font-bold">{pending.length}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{formatCurrency(totalPending)} total</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span className="text-xs text-muted-foreground">Approved</span>
            </div>
            <p className="text-xl font-bold">{approved.length}</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-red-400">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <XCircle className="h-4 w-4 text-red-500" />
              <span className="text-xs text-muted-foreground">Rejected</span>
            </div>
            <p className="text-xl font-bold">{rejected.length}</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-primary">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <IndianRupee className="h-4 w-4 text-primary" />
              <span className="text-xs text-muted-foreground">This Month</span>
            </div>
            <p className="text-xl font-bold">{formatCurrency(approvalItems.reduce((s, i) => s + i.amount, 0))}</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="bg-muted/50 h-9">
          <TabsTrigger value="pending" className="text-xs gap-1">
            <Clock className="h-3.5 w-3.5" /> Pending ({pending.length})
          </TabsTrigger>
          <TabsTrigger value="approved" className="text-xs gap-1">
            <CheckCircle2 className="h-3.5 w-3.5" /> Approved ({approved.length})
          </TabsTrigger>
          <TabsTrigger value="rejected" className="text-xs gap-1">
            <XCircle className="h-3.5 w-3.5" /> Rejected ({rejected.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={tab} className="mt-4">
          <div className="space-y-2">
            {filtered.map((item) => (
              <Card key={item.id} className={cn("hover:shadow-md transition-shadow cursor-pointer", item.priority === "Urgent" && item.status === "Pending" && "border-amber-300 bg-amber-50/30")}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                        item.status === "Pending" ? "bg-amber-100 text-amber-700" :
                        item.status === "Approved" ? "bg-green-100 text-green-700" :
                        "bg-red-100 text-red-600"
                      )}>
                        {item.status === "Pending" ? <Clock className="h-5 w-5" /> :
                         item.status === "Approved" ? <CheckCircle2 className="h-5 w-5" /> :
                         <XCircle className="h-5 w-5" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-medium text-sm">{item.title}</p>
                          {item.priority === "Urgent" && (
                            <Badge className="bg-red-100 text-red-700 hover:bg-red-100 text-[10px]">
                              <AlertTriangle className="h-3 w-3 mr-0.5" /> Urgent
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1 flex-wrap">
                          <span>{item.id}</span>
                          <span>·</span>
                          <span>{item.requestedBy}</span>
                          <span>·</span>
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0">{item.category}</Badge>
                          <span>·</span>
                          <span>{item.date}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1.5">{item.description}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <p className="font-bold text-sm">{formatCurrency(item.amount)}</p>
                      {item.status === "Pending" && (
                        <div className="flex gap-1.5">
                          <Button size="sm" variant="outline" className="h-7 text-xs gap-1 text-green-700 border-green-300 hover:bg-green-50">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Approve
                          </Button>
                          <Button size="sm" variant="outline" className="h-7 text-xs gap-1 text-red-600 border-red-300 hover:bg-red-50">
                            <XCircle className="h-3.5 w-3.5" /> Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {filtered.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                  No {tab} requests found.
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ExpenseApprovals;
