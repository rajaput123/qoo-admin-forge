import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, XCircle, MessageSquare, Clock, GitPullRequest, ArrowRight, User } from "lucide-react";

const pending = [
  { id: "APR-001", project: "Parking Expansion Phase 2", type: "Project Activation", requestedBy: "Sri Mohan", date: "2026-02-05", stage: "Trustee Review", budget: "₹2.5 Cr" },
  { id: "APR-002", project: "Gopuram Renovation", type: "Budget Revision", requestedBy: "Sri Raghav", date: "2026-02-08", stage: "Trustee Review", budget: "+₹35 L" },
  { id: "APR-003", project: "Digital Darshan System", type: "Timeline Extension", requestedBy: "Sri Karthik", date: "2026-02-09", stage: "Submitted", budget: "—" },
];

const history = [
  { id: "APR-H01", project: "Gopuram Renovation", type: "Project Activation", action: "Approved", by: "Trustee Board", date: "2025-05-28" },
  { id: "APR-H02", project: "New Annadanam Hall", type: "Project Activation", action: "Approved", by: "Trustee Board", date: "2025-09-10" },
  { id: "APR-H03", project: "Village Outreach", type: "Budget Revision", action: "Approved", by: "Sri Chairman", date: "2025-12-15" },
  { id: "APR-H04", project: "Heritage Museum", type: "Project Activation", action: "Rejected", by: "Trustee Board", date: "2026-01-20" },
];

const stages = ["Draft", "Submitted", "Trustee Review", "Approved", "Active"];

const ApprovalWorkflow = () => {
  const [selectedApproval, setSelectedApproval] = useState<typeof pending[0] | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Approval Workflow</h1>
        <p className="text-sm text-muted-foreground mt-1">Governance approval stages for project activation, budget changes, and closures</p>
      </div>

      {/* Workflow Stages Visual */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            {stages.map((stage, i) => (
              <div key={stage} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-medium ${i <= 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                    {i + 1}
                  </div>
                  <span className="text-xs mt-1 text-muted-foreground">{stage}</span>
                </div>
                {i < stages.length - 1 && <ArrowRight className="h-4 w-4 text-muted-foreground mx-3" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pending Approvals */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <GitPullRequest className="h-4 w-4" /> Pending Approvals
              <Badge variant="secondary" className="text-xs">{pending.length}</Badge>
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Requested By</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pending.map(a => (
                <TableRow key={a.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setSelectedApproval(a)}>
                  <TableCell className="font-mono text-xs">{a.id}</TableCell>
                  <TableCell className="font-medium text-sm">{a.project}</TableCell>
                  <TableCell><Badge variant="outline" className="text-[10px]">{a.type}</Badge></TableCell>
                  <TableCell className="text-sm">{a.requestedBy}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{a.date}</TableCell>
                  <TableCell><Badge variant="secondary" className="text-[10px]">{a.stage}</Badge></TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="sm" variant="default" className="h-7 text-xs gap-1"><CheckCircle2 className="h-3 w-3" /> Approve</Button>
                      <Button size="sm" variant="outline" className="h-7 text-xs gap-1"><XCircle className="h-3 w-3" /> Reject</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Approval History */}
      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-base">Approval History</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>By</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map(h => (
                <TableRow key={h.id}>
                  <TableCell className="font-mono text-xs">{h.id}</TableCell>
                  <TableCell className="font-medium text-sm">{h.project}</TableCell>
                  <TableCell><Badge variant="outline" className="text-[10px]">{h.type}</Badge></TableCell>
                  <TableCell>
                    <Badge variant={h.action === "Approved" ? "default" : "destructive"} className="text-[10px]">{h.action}</Badge>
                  </TableCell>
                  <TableCell className="text-sm">{h.by}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{h.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Detail Modal */}
      <Dialog open={!!selectedApproval} onOpenChange={() => setSelectedApproval(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Review: {selectedApproval?.project}</DialogTitle></DialogHeader>
          {selectedApproval && (
            <div className="space-y-4 pt-2">
              <div className="flex gap-2">
                <Badge variant="secondary">{selectedApproval.type}</Badge>
                <Badge variant="outline">{selectedApproval.stage}</Badge>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">Requested By:</span> {selectedApproval.requestedBy}</div>
                <div><span className="text-muted-foreground">Date:</span> {selectedApproval.date}</div>
                <div><span className="text-muted-foreground">Budget Impact:</span> {selectedApproval.budget}</div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Comments</label>
                <Textarea rows={3} placeholder="Add review comments..." />
              </div>
              <div className="flex gap-2">
                <Button className="flex-1 gap-2"><CheckCircle2 className="h-4 w-4" /> Approve</Button>
                <Button variant="destructive" className="flex-1 gap-2"><XCircle className="h-4 w-4" /> Reject</Button>
                <Button variant="outline" className="gap-2"><MessageSquare className="h-4 w-4" /> Clarify</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ApprovalWorkflow;
