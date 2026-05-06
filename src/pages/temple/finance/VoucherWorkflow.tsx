import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  FileText, CheckCircle2, XCircle, ShoppingCart, Clock,
  Eye, Search, Filter, Plus, AlertCircle, Package
} from "lucide-react";
import { toast } from "sonner";
import {
  voucherRequests, createRequest, approveRequest, rejectRequest,
  type VoucherRequest, type RequestStatus, type RequestType
} from "@/stores/voucherStore";
import FinanceDateFilter, { type DateRange } from "@/components/finance/FinanceDateFilter";

const statusColor: Record<RequestStatus, string> = {
  Requested: "bg-blue-50 text-blue-700 border-blue-200",
  Approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Rejected: "bg-red-50 text-red-700 border-red-200",
  "PO Created": "bg-amber-50 text-amber-700 border-amber-200",
  Completed: "bg-green-50 text-green-700 border-green-200",
};

const priorityColor: Record<string, string> = {
  Low: "bg-muted text-muted-foreground",
  Medium: "bg-blue-50 text-blue-700",
  High: "bg-amber-50 text-amber-700",
  Urgent: "bg-red-50 text-red-700",
};

const statusIcon: Record<RequestStatus, React.ReactNode> = {
  Requested: <Clock className="h-3.5 w-3.5" />,
  Approved: <CheckCircle2 className="h-3.5 w-3.5" />,
  Rejected: <XCircle className="h-3.5 w-3.5" />,
  "PO Created": <ShoppingCart className="h-3.5 w-3.5" />,
  Completed: <Package className="h-3.5 w-3.5" />,
};

const formatCurrency = (val: number) => `₹${val.toLocaleString("en-IN")}`;

const VoucherWorkflow = () => {
  const [, setTick] = useState(0);
  const refresh = () => setTick(t => t + 1);

  const [selectedRequest, setSelectedRequest] = useState<VoucherRequest | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [dateRange, setDateRange] = useState<DateRange>({ from: null, to: null });

  // Create request dialog
  const [showCreate, setShowCreate] = useState(false);
  const [formType, setFormType] = useState<RequestType>("Purchase");
  const [formDesc, setFormDesc] = useState("");
  const [formDept, setFormDept] = useState("");
  const [formRequestedBy, setFormRequestedBy] = useState("");
  const [formPriority, setFormPriority] = useState<VoucherRequest["priority"]>("Medium");
  const [formNotes, setFormNotes] = useState("");
  const [formItems, setFormItems] = useState<{ name: string; qty: number; estPrice: number }[]>([
    { name: "", qty: 1, estPrice: 0 },
  ]);

  // Reject dialog
  const [showReject, setShowReject] = useState(false);
  const [rejectId, setRejectId] = useState("");
  const [rejectReason, setRejectReason] = useState("");

  const filtered = useMemo(() => {
    return voucherRequests.filter(r => {
      if (activeTab === "pending" && r.status !== "Requested") return false;
      if (activeTab === "approved" && r.status !== "Approved") return false;
      if (activeTab === "rejected" && r.status !== "Rejected") return false;
      if (searchTerm) {
        const s = searchTerm.toLowerCase();
        if (!r.id.toLowerCase().includes(s) && !r.description.toLowerCase().includes(s) && !r.department.toLowerCase().includes(s)) return false;
      }
      if (dateRange.from || dateRange.to) {
        const d = new Date(r.createdDate);
        if (dateRange.from && d < dateRange.from) return false;
        if (dateRange.to && d > dateRange.to) return false;
      }
      return true;
    });
  }, [activeTab, searchTerm, dateRange, voucherRequests.length]);

  const counts = useMemo(() => ({
    all: voucherRequests.length,
    pending: voucherRequests.filter(r => r.status === "Requested").length,
    approved: voucherRequests.filter(r => r.status === "Approved").length,
    rejected: voucherRequests.filter(r => r.status === "Rejected").length,
  }), [voucherRequests.length]);

  const handleCreate = () => {
    if (!formDesc.trim()) { toast.error("Description is required"); return; }
    if (!formDept.trim()) { toast.error("Department is required"); return; }
    if (!formRequestedBy.trim()) { toast.error("Requested By is required"); return; }
    const validItems = formItems.filter(i => i.name.trim());
    if (validItems.length === 0) { toast.error("Add at least one item"); return; }
    const amount = validItems.reduce((s, i) => s + i.qty * i.estPrice, 0);
    createRequest({
      type: formType,
      description: formDesc,
      amount,
      department: formDept,
      requestedBy: formRequestedBy,
      createdDate: new Date().toISOString().slice(0, 10),
      items: validItems,
      priority: formPriority,
      notes: formNotes,
    });
    toast.success("Request created successfully");
    setShowCreate(false);
    resetForm();
    refresh();
  };

  const resetForm = () => {
    setFormType("Purchase");
    setFormDesc("");
    setFormDept("");
    setFormRequestedBy("");
    setFormPriority("Medium");
    setFormNotes("");
    setFormItems([{ name: "", qty: 1, estPrice: 0 }]);
  };

  const handleApprove = (id: string) => {
    if (approveRequest(id, "Finance Head")) {
      toast.success(`Request ${id} approved`);
      setSheetOpen(false);
      refresh();
    }
  };

  const handleReject = () => {
    if (rejectRequest(rejectId, rejectReason)) {
      toast.success(`Request ${rejectId} rejected`);
      setShowReject(false);
      setRejectReason("");
      setSheetOpen(false);
      refresh();
    }
  };

  const openDetail = (req: VoucherRequest) => {
    setSelectedRequest(req);
    setSheetOpen(true);
  };

  const steps: { label: string; status: RequestStatus }[] = [
    { label: "Requested", status: "Requested" },
    { label: "Approved", status: "Approved" },
  ];

  const getStepIndex = (status: RequestStatus) => {
    if (status === "Rejected") return -1;
    return steps.findIndex(s => s.status === status);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" /> Requests & Vouchers
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Create, approve, and track purchase requests. POs require approved requests.
          </p>
        </div>
        <Button size="sm" onClick={() => setShowCreate(true)} className="gap-2">
          <Plus className="h-4 w-4" /> New Request
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          { label: "Pending", count: counts.pending, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Approved", count: counts.approved, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Rejected", count: counts.rejected, color: "text-red-600", bg: "bg-red-50" },
        ].map(c => (
          <Card key={c.label} className="cursor-pointer hover:shadow-sm transition-shadow">
            <CardContent className="p-3 text-center">
              <p className={`text-2xl font-bold ${c.color}`}>{c.count}</p>
              <p className="text-xs text-muted-foreground">{c.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-wrap">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
          <TabsList>
            <TabsTrigger value="all">All ({counts.all})</TabsTrigger>
            <TabsTrigger value="pending">Pending ({counts.pending})</TabsTrigger>
            <TabsTrigger value="approved">Approved ({counts.approved})</TabsTrigger>
            <TabsTrigger value="rejected">Rejected ({counts.rejected})</TabsTrigger>
          </TabsList>
        </Tabs>
        <FinanceDateFilter onDateRangeChange={setDateRange} />
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search requests..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-9 h-9" />
        </div>
      </div>

      {/* Requests Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Request ID</TableHead>
                  <TableHead className="text-xs">Date</TableHead>
                  <TableHead className="text-xs">Type</TableHead>
                  <TableHead className="text-xs">Description</TableHead>
                  <TableHead className="text-xs">Department</TableHead>
                  <TableHead className="text-xs">Priority</TableHead>
                  <TableHead className="text-xs text-right">Amount</TableHead>
                  <TableHead className="text-xs text-center">Status</TableHead>
                  <TableHead className="text-xs text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                      No requests found
                    </TableCell>
                  </TableRow>
                ) : filtered.map(r => (
                  <TableRow key={r.id} className="cursor-pointer hover:bg-muted/50" onClick={() => openDetail(r)}>
                    <TableCell className="text-xs font-medium text-primary">{r.id}</TableCell>
                    <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(r.createdDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                    </TableCell>
                    <TableCell className="text-xs">{r.type}</TableCell>
                    <TableCell className="text-xs max-w-[200px] truncate">{r.description}</TableCell>
                    <TableCell className="text-xs">{r.department}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`text-[10px] ${priorityColor[r.priority]}`}>{r.priority}</Badge>
                    </TableCell>
                    <TableCell className="text-xs text-right font-medium">{formatCurrency(r.amount)}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className={`text-[10px] gap-1 ${statusColor[r.status]}`}>
                        {statusIcon[r.status]} {r.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={e => { e.stopPropagation(); openDetail(r); }}>
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Detail Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="overflow-y-auto w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              {selectedRequest?.id}
              {selectedRequest && (
                <Badge variant="outline" className={`text-[10px] gap-1 ${statusColor[selectedRequest.status]}`}>
                  {statusIcon[selectedRequest.status]} {selectedRequest.status}
                </Badge>
              )}
            </SheetTitle>
          </SheetHeader>
          {selectedRequest && (
            <div className="space-y-5 mt-4">
              {/* Progress Stepper */}
              {selectedRequest.status !== "Rejected" ? (
                <div className="flex items-center gap-1">
                  {steps.map((step, i) => {
                    const current = getStepIndex(selectedRequest.status);
                    const done = i <= current;
                    return (
                      <div key={i} className="flex items-center flex-1">
                        <div className="flex flex-col items-center flex-1">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${done ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                            {i + 1}
                          </div>
                          <span className={`text-[10px] mt-1 text-center ${done ? "font-medium text-foreground" : "text-muted-foreground"}`}>{step.label}</span>
                        </div>
                        {i < steps.length - 1 && (
                          <div className={`h-0.5 flex-1 mx-1 mt-[-16px] ${i < current ? "bg-primary" : "bg-muted"}`} />
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200">
                  <XCircle className="h-5 w-5 text-red-600" />
                  <div>
                    <p className="text-sm font-medium text-red-700">Request Rejected</p>
                    {selectedRequest.rejectionReason && (
                      <p className="text-xs text-red-600 mt-0.5">Reason: {selectedRequest.rejectionReason}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Details */}
              <div className="border rounded-lg p-3 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Type</span><span className="font-medium">{selectedRequest.type}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Department</span><span className="font-medium">{selectedRequest.department}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Requested By</span><span>{selectedRequest.requestedBy}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Priority</span><Badge variant="outline" className={`text-[10px] ${priorityColor[selectedRequest.priority]}`}>{selectedRequest.priority}</Badge></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Created</span><span>{selectedRequest.createdDate}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Updated</span><span>{selectedRequest.updatedDate}</span></div>
                {selectedRequest.approvedBy && (
                  <div className="flex justify-between"><span className="text-muted-foreground">Approved By</span><span className="text-emerald-700 font-medium">{selectedRequest.approvedBy}</span></div>
                )}
                {selectedRequest.linkedPOId && (
                  <div className="flex justify-between"><span className="text-muted-foreground">Linked PO</span><span className="text-primary font-medium">{selectedRequest.linkedPOId}</span></div>
                )}
                {selectedRequest.linkedLedgerEntryId && (
                  <div className="flex justify-between"><span className="text-muted-foreground">Ledger Entry</span><span className="text-primary font-medium">{selectedRequest.linkedLedgerEntryId}</span></div>
                )}
              </div>

              {/* Description */}
              <div className="border rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">Description</p>
                <p className="text-sm">{selectedRequest.description}</p>
                {selectedRequest.notes && (
                  <>
                    <p className="text-xs text-muted-foreground mt-2 mb-1">Notes</p>
                    <p className="text-sm text-muted-foreground">{selectedRequest.notes}</p>
                  </>
                )}
              </div>

              {/* Items */}
              <div className="border rounded-lg overflow-hidden text-sm">
                <div className="bg-muted/50 px-3 py-2 font-medium text-xs">Items</div>
                {selectedRequest.items.map((item, i) => (
                  <div key={i} className="flex justify-between px-3 py-2 border-t">
                    <span>{item.name} × {item.qty}</span>
                    <span>{formatCurrency(item.qty * item.estPrice)}</span>
                  </div>
                ))}
                <div className="flex justify-between px-3 py-2 border-t bg-muted/30 font-medium">
                  <span>Total Estimate</span>
                  <span>{formatCurrency(selectedRequest.amount)}</span>
                </div>
              </div>

              {/* Actions based on status */}
              {selectedRequest.status === "Requested" && (
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleApprove(selectedRequest.id)} className="flex-1 gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Approve
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => { setRejectId(selectedRequest.id); setShowReject(true); }} className="flex-1 gap-1">
                    <XCircle className="h-3.5 w-3.5" /> Reject
                  </Button>
                </div>
              )}
              {selectedRequest.status === "Approved" && !selectedRequest.linkedPOId && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  <p className="text-xs text-amber-700">
                    Approved — go to <span className="font-medium">Inventory → Purchases</span> to create a PO linked to this request.
                  </p>
                </div>
              )}
              {selectedRequest.status === "PO Created" && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-50 border border-blue-200">
                  <ShoppingCart className="h-4 w-4 text-blue-600" />
                  <p className="text-xs text-blue-700">
                    PO <span className="font-medium">{selectedRequest.linkedPOId}</span> created. Will auto-complete when delivery is accepted.
                  </p>
                </div>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Create Request Dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Create New Request</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Type</Label>
                <Select value={formType} onValueChange={v => setFormType(v as RequestType)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Purchase">Purchase</SelectItem>
                    <SelectItem value="Expense">Expense</SelectItem>
                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Priority</Label>
                <Select value={formPriority} onValueChange={v => setFormPriority(v as VoucherRequest["priority"])}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label className="text-xs">Description</Label>
              <Input value={formDesc} onChange={e => setFormDesc(e.target.value)} placeholder="What is this request for?" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Department</Label>
                <Select value={formDept} onValueChange={setFormDept}>
                  <SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger>
                  <SelectContent>
                    {["Pooja & Rituals", "Kitchen & Prasadam", "Maintenance", "Administration", "Events", "Utilities"].map(d => (
                      <SelectItem key={d} value={d}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Requested By</Label>
                <Input value={formRequestedBy} onChange={e => setFormRequestedBy(e.target.value)} placeholder="Name of requester" />
              </div>
            </div>

            {/* Items */}
            <div className="border rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium">Items</p>
                <Button size="sm" variant="outline" onClick={() => setFormItems(p => [...p, { name: "", qty: 1, estPrice: 0 }])}>
                  Add Item
                </Button>
              </div>
              {formItems.map((item, idx) => (
                <div key={idx} className="grid grid-cols-7 gap-2 items-end mb-2">
                  <div className="col-span-3">
                    <Label className="text-xs">Item Name</Label>
                    <Input value={item.name} onChange={e => {
                      const updated = [...formItems];
                      updated[idx] = { ...updated[idx], name: e.target.value };
                      setFormItems(updated);
                    }} placeholder="Item name" />
                  </div>
                  <div>
                    <Label className="text-xs">Qty</Label>
                    <Input type="number" value={String(item.qty)} onChange={e => {
                      const updated = [...formItems];
                      updated[idx] = { ...updated[idx], qty: Number(e.target.value) };
                      setFormItems(updated);
                    }} />
                  </div>
                  <div>
                    <Label className="text-xs">Est. Price</Label>
                    <Input type="number" value={String(item.estPrice)} onChange={e => {
                      const updated = [...formItems];
                      updated[idx] = { ...updated[idx], estPrice: Number(e.target.value) };
                      setFormItems(updated);
                    }} />
                  </div>
                  <div>
                    <Label className="text-xs">Total</Label>
                    <Input value={formatCurrency(item.qty * item.estPrice)} readOnly className="bg-muted/30" />
                  </div>
                  <div>
                    <Button variant="outline" size="sm" className="w-full" onClick={() => setFormItems(p => p.filter((_, i) => i !== idx))} disabled={formItems.length <= 1}>
                      ✕
                    </Button>
                  </div>
                </div>
              ))}
              <div className="flex justify-end mt-2 text-sm font-medium">
                Total: {formatCurrency(formItems.reduce((s, i) => s + i.qty * i.estPrice, 0))}
              </div>
            </div>

            <div>
              <Label className="text-xs">Notes (optional)</Label>
              <Textarea value={formNotes} onChange={e => setFormNotes(e.target.value)} placeholder="Additional notes..." rows={2} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowCreate(false); resetForm(); }}>Cancel</Button>
            <Button onClick={handleCreate}>Create Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={showReject} onOpenChange={setShowReject}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Reject Request {rejectId}</DialogTitle></DialogHeader>
          <div>
            <Label className="text-xs">Reason for rejection</Label>
            <Textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)} placeholder="Provide a reason (recommended)" rows={3} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReject(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleReject}>Reject</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VoucherWorkflow;
