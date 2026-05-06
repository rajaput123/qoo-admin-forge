import { useState } from "react";
import { motion } from "framer-motion";
import { Search, ChefHat, Calendar, Sparkles, Eye, Users, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { stockRequests, StockRequest, RequestStatus } from "@/data/inventoryData";

const sourceConfig: Record<string, { icon: any; color: string }> = {
  Kitchen: { icon: ChefHat, color: "bg-orange-50 text-orange-700 border-orange-200" },
  Event: { icon: Calendar, color: "bg-blue-50 text-blue-700 border-blue-200" },
  Seva: { icon: Sparkles, color: "bg-violet-50 text-violet-700 border-violet-200" },
  Darshan: { icon: Eye, color: "bg-cyan-50 text-cyan-700 border-cyan-200" },
  Freelancer: { icon: Users, color: "bg-green-50 text-green-700 border-green-200" },
};

const statusConfig: Record<RequestStatus, string> = {
  Pending: "bg-amber-50 text-amber-700 border-amber-200",
  Approved: "bg-blue-50 text-blue-700 border-blue-200",
  "Partially Issued": "bg-orange-50 text-orange-700 border-orange-200",
  Issued: "bg-green-50 text-green-700 border-green-200",
  Rejected: "bg-red-50 text-red-700 border-red-200",
};

const Requests = () => {
  const [search, setSearch] = useState("");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [detailRequest, setDetailRequest] = useState<StockRequest | null>(null);

  const filtered = stockRequests.filter(r => {
    const matchSearch = !search || r.sourceRefName.toLowerCase().includes(search.toLowerCase()) || r.id.toLowerCase().includes(search.toLowerCase());
    const matchSource = sourceFilter === "all" || r.source === sourceFilter;
    const matchStatus = statusFilter === "all" || r.status === statusFilter;
    return matchSearch && matchSource && matchStatus;
  });

  const pendingCount = stockRequests.filter(r => r.status === "Pending").length;

  if (detailRequest) {
    const r = detailRequest;
    return (
      <div className="p-6 space-y-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Request {r.id}</h1>
              <p className="text-muted-foreground text-sm">{r.sourceRefName} · {r.source}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={`text-xs ${statusConfig[r.status]}`}>{r.status}</Badge>
              <Button size="sm" variant="outline" onClick={() => setDetailRequest(null)}>Back</Button>
            </div>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-muted-foreground">Source:</span> <Badge variant="outline" className={`text-xs ${sourceConfig[r.source].color}`}>{r.source}</Badge></div>
              <div><span className="text-muted-foreground">Status:</span> <Badge variant="outline" className={`text-xs ${statusConfig[r.status]}`}>{r.status}</Badge></div>
              <div><span className="text-muted-foreground">Reference:</span> <span className="font-medium">{r.sourceRefName}</span></div>
              <div><span className="text-muted-foreground">Requested By:</span> <span className="font-medium">{r.requestedBy}</span></div>
              <div><span className="text-muted-foreground">Date:</span> <span className="font-medium">{r.date}</span></div>
              {r.issuedDate && <div><span className="text-muted-foreground">Issued:</span> <span className="font-medium">{r.issuedDate} by {r.issuedBy}</span></div>}
            </div>
            {r.notes && <div className="p-3 bg-muted/50 rounded-lg text-sm">{r.notes}</div>}
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead className="text-right">Requested</TableHead>
                    <TableHead className="text-right">Available</TableHead>
                    <TableHead className="text-right">Issued</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {r.items.map((item, idx) => {
                    const shortage = item.requestedQty > item.available;
                    return (
                      <TableRow key={idx}>
                        <TableCell className="font-medium text-sm">{item.itemName}</TableCell>
                        <TableCell className="text-right text-sm">{item.requestedQty} {item.unit}</TableCell>
                        <TableCell className={`text-right text-sm ${shortage ? 'text-destructive font-medium' : ''}`}>{item.available} {item.unit}</TableCell>
                        <TableCell className="text-right text-sm">{item.issuedQty} {item.unit}</TableCell>
                        <TableCell>
                          {shortage ? (
                            <Badge variant="destructive" className="text-[10px]">Shortage</Badge>
                          ) : item.issuedQty >= item.requestedQty ? (
                            <Badge variant="outline" className="text-[10px] bg-green-50 text-green-700">Fulfilled</Badge>
                          ) : (
                            <Badge variant="outline" className="text-[10px] bg-amber-50 text-amber-700">Pending</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Stock Requests</h1>
        <p className="text-muted-foreground text-sm">Material requests from Kitchen, Events, Sevas & Freelancers — {pendingCount} pending</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search requests..." className="pl-9 h-9" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={sourceFilter} onValueChange={setSourceFilter}>
          <SelectTrigger className="w-36 h-9 bg-background"><SelectValue placeholder="Source" /></SelectTrigger>
          <SelectContent className="bg-popover">
            <SelectItem value="all">All Sources</SelectItem>
            {Object.keys(sourceConfig).map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-44 h-9 bg-background"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent className="bg-popover">
            <SelectItem value="all">All Statuses</SelectItem>
            {(Object.keys(statusConfig) as RequestStatus[]).map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Reference</TableHead>
              <TableHead>Requested By</TableHead>
              <TableHead className="text-center">Items</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(req => {
              const sc = sourceConfig[req.source];
              const hasShortage = req.items.some(i => i.requestedQty > i.available);
              return (
                <TableRow key={req.id} className="cursor-pointer" onClick={() => setDetailRequest(req)}>
                  <TableCell className="text-sm">{req.date}</TableCell>
                  <TableCell><Badge variant="outline" className={`text-xs ${sc.color}`}>{req.source}</Badge></TableCell>
                  <TableCell>
                    <p className="text-sm font-medium">{req.sourceRefName}</p>
                    <p className="text-xs text-muted-foreground">{req.sourceRefId}</p>
                  </TableCell>
                  <TableCell className="text-sm">{req.requestedBy}</TableCell>
                  <TableCell className="text-center">
                    <span className="text-sm">{req.items.length}</span>
                    {hasShortage && <Badge variant="destructive" className="text-[10px] ml-1.5">Shortage</Badge>}
                  </TableCell>
                  <TableCell><Badge variant="outline" className={`text-xs ${statusConfig[req.status]}`}>{req.status}</Badge></TableCell>
                  <TableCell>
                    {req.status === "Pending" && (
                      <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                        <Button size="sm" variant="outline" className="h-7 text-xs text-green-700 hover:bg-green-50"><CheckCircle2 className="h-3.5 w-3.5 mr-1" />Issue</Button>
                        <Button size="sm" variant="outline" className="h-7 text-xs text-red-700 hover:bg-red-50"><XCircle className="h-3.5 w-3.5" /></Button>
                      </div>
                    )}
                    {req.status === "Approved" && (
                      <Button size="sm" variant="outline" className="h-7 text-xs" onClick={e => e.stopPropagation()}>Issue Stock</Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Detail Modal */}
      <Dialog open={!!detailRequest} onOpenChange={() => setDetailRequest(null)}>
        <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto">
          {detailRequest && (
            <>
              <DialogHeader>
                <DialogTitle>Request {detailRequest.id}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-muted-foreground">Source:</span> <Badge variant="outline" className={`text-xs ${sourceConfig[detailRequest.source].color}`}>{detailRequest.source}</Badge></div>
                  <div><span className="text-muted-foreground">Status:</span> <Badge variant="outline" className={`text-xs ${statusConfig[detailRequest.status]}`}>{detailRequest.status}</Badge></div>
                  <div><span className="text-muted-foreground">Reference:</span> <span className="font-medium">{detailRequest.sourceRefName}</span></div>
                  <div><span className="text-muted-foreground">Requested By:</span> <span className="font-medium">{detailRequest.requestedBy}</span></div>
                  <div><span className="text-muted-foreground">Date:</span> <span className="font-medium">{detailRequest.date}</span></div>
                  {detailRequest.issuedDate && <div><span className="text-muted-foreground">Issued:</span> <span className="font-medium">{detailRequest.issuedDate} by {detailRequest.issuedBy}</span></div>}
                </div>
                {detailRequest.notes && (
                  <div className="p-3 bg-muted/50 rounded-lg text-sm">{detailRequest.notes}</div>
                )}
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead className="text-right">Requested</TableHead>
                        <TableHead className="text-right">Available</TableHead>
                        <TableHead className="text-right">Issued</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {detailRequest.items.map((item, idx) => {
                        const shortage = item.requestedQty > item.available;
                        return (
                          <TableRow key={idx}>
                            <TableCell className="font-medium text-sm">{item.itemName}</TableCell>
                            <TableCell className="text-right text-sm">{item.requestedQty} {item.unit}</TableCell>
                            <TableCell className={`text-right text-sm ${shortage ? 'text-destructive font-medium' : ''}`}>{item.available} {item.unit}</TableCell>
                            <TableCell className="text-right text-sm">{item.issuedQty} {item.unit}</TableCell>
                            <TableCell>
                              {shortage ? (
                                <Badge variant="destructive" className="text-[10px]">Shortage</Badge>
                              ) : item.issuedQty >= item.requestedQty ? (
                                <Badge variant="outline" className="text-[10px] bg-green-50 text-green-700">Fulfilled</Badge>
                              ) : (
                                <Badge variant="outline" className="text-[10px] bg-amber-50 text-amber-700">Pending</Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDetailRequest(null)}>Close</Button>
                {detailRequest.status === "Pending" && <Button>Approve & Issue</Button>}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default Requests;
