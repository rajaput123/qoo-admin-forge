import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { StatusBadge } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Plus, Check, X, ArrowRightLeft, Clock, Calendar } from 'lucide-react';
import { employees, shifts } from '@/data/hr-dummy-data';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface SwapRequest {
  id: string;
  requesterId: string;
  requesterName: string;
  requesterShift: string;
  targetId: string;
  targetName: string;
  targetShift: string;
  date: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  remarks?: string;
}

const initialSwapRequests: SwapRequest[] = [
  {
    id: 'swap-1',
    requesterId: 'emp-1', requesterName: 'Ramesh Kumar', requesterShift: 'Morning Shift',
    targetId: 'emp-5', targetName: 'Venkat Rao', targetShift: 'Afternoon Shift',
    date: '2026-04-02', reason: 'Family function in evening',
    status: 'pending', createdAt: '2026-03-30',
  },
  {
    id: 'swap-2',
    requesterId: 'emp-3', requesterName: 'Suresh Sharma', requesterShift: 'Morning Shift',
    targetId: 'emp-8', targetName: 'Anitha Kumari', targetShift: 'Morning Shift',
    date: '2026-04-05', reason: 'Medical appointment',
    status: 'approved', createdAt: '2026-03-28', reviewedBy: 'Admin', reviewedAt: '2026-03-29',
  },
  {
    id: 'swap-3',
    requesterId: 'emp-6', requesterName: 'Meena Singh', requesterShift: 'Morning Shift',
    targetId: 'emp-2', targetName: 'Lakshmi Devi', targetShift: 'Morning Shift',
    date: '2026-04-01', reason: 'Personal work',
    status: 'rejected', createdAt: '2026-03-27', reviewedBy: 'Admin', reviewedAt: '2026-03-28', remarks: 'Both in same shift, swap not applicable',
  },
];

export default function ShiftSwap() {
  const [requests, setRequests] = useState<SwapRequest[]>(initialSwapRequests);
  const [createOpen, setCreateOpen] = useState(false);
  const [actionDialog, setActionDialog] = useState<{ open: boolean; action: 'approve' | 'reject'; request: SwapRequest | null; remarks: string }>({
    open: false, action: 'approve', request: null, remarks: '',
  });
  const [viewRequest, setViewRequest] = useState<SwapRequest | null>(null);

  const [form, setForm] = useState({ requesterId: '', targetId: '', date: '', reason: '' });

  const activeEmployees = employees.filter(e => e.status === 'active');

  const handleCreate = () => {
    const requester = activeEmployees.find(e => e.id === form.requesterId);
    const target = activeEmployees.find(e => e.id === form.targetId);
    if (!requester || !target) return;

    const reqShift = shifts.find(s => s.id === requester.shiftId);
    const tgtShift = shifts.find(s => s.id === target.shiftId);

    const newReq: SwapRequest = {
      id: `swap-${Date.now()}`,
      requesterId: requester.id, requesterName: requester.name, requesterShift: reqShift?.name || 'N/A',
      targetId: target.id, targetName: target.name, targetShift: tgtShift?.name || 'N/A',
      date: form.date, reason: form.reason,
      status: 'pending', createdAt: new Date().toISOString().split('T')[0],
    };
    setRequests(prev => [newReq, ...prev]);
    setCreateOpen(false);
    setForm({ requesterId: '', targetId: '', date: '', reason: '' });
  };

  const handleAction = () => {
    if (!actionDialog.request) return;
    setRequests(prev => prev.map(r =>
      r.id === actionDialog.request!.id
        ? { ...r, status: (actionDialog.action === 'approve' ? 'approved' : 'rejected') as SwapRequest['status'], reviewedBy: 'Admin', reviewedAt: new Date().toISOString().split('T')[0], remarks: actionDialog.remarks || undefined }
        : r
    ));
    setActionDialog({ open: false, action: 'approve', request: null, remarks: '' });
  };

  const pendingCount = requests.filter(r => r.status === 'pending').length;
  const approvedCount = requests.filter(r => r.status === 'approved').length;

  const columns = [
    {
      key: 'requesterName', label: 'Requester', sortable: true,
      render: (_: unknown, row: SwapRequest) => (
        <div>
          <p className="font-medium text-foreground">{row.requesterName}</p>
          <p className="text-xs text-muted-foreground">{row.requesterShift}</p>
        </div>
      ),
    },
    {
      key: 'swap', label: '', width: '40px',
      render: () => <ArrowRightLeft className="h-4 w-4 text-muted-foreground mx-auto" />,
    },
    {
      key: 'targetName', label: 'Swap With', sortable: true,
      render: (_: unknown, row: SwapRequest) => (
        <div>
          <p className="font-medium text-foreground">{row.targetName}</p>
          <p className="text-xs text-muted-foreground">{row.targetShift}</p>
        </div>
      ),
    },
    {
      key: 'date', label: 'Date', sortable: true,
      render: (v: unknown) => (
        <div className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
          <span>{new Date(v as string).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
        </div>
      ),
    },
    { key: 'reason', label: 'Reason' },
    {
      key: 'status', label: 'Status',
      render: (v: unknown) => {
        const map: Record<string, 'warning' | 'success' | 'destructive'> = { pending: 'warning', approved: 'success', rejected: 'destructive' };
        return <StatusBadge variant={map[v as string]}>{(v as string).charAt(0).toUpperCase() + (v as string).slice(1)}</StatusBadge>;
      },
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div />
        <Button size="sm" onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />New Swap Request
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Pending', value: pendingCount, icon: Clock, color: 'text-amber-500' },
          { label: 'Approved', value: approvedCount, icon: Check, color: 'text-green-500' },
          { label: 'Total Requests', value: requests.length, icon: ArrowRightLeft, color: 'text-primary' },
        ].map(s => (
          <Card key={s.label}>
            <CardContent className="p-3 flex items-center gap-3">
              <s.icon className={`h-5 w-5 ${s.color}`} />
              <div>
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="text-lg font-bold text-foreground">{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <DataTable
        data={requests}
        columns={columns}
        searchPlaceholder="Search swap requests..."
        onRowClick={(row) => setViewRequest(row)}
        actions={(row) => row.status === 'pending' ? (
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-green-600" onClick={(e) => { e.stopPropagation(); setActionDialog({ open: true, action: 'approve', request: row, remarks: '' }); }}>
              <Check className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={(e) => { e.stopPropagation(); setActionDialog({ open: true, action: 'reject', request: row, remarks: '' }); }}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : null}
      />

      {/* Create Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>New Shift Swap Request</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="form-field">
              <Label className="form-label">Requesting Employee *</Label>
              <Select value={form.requesterId} onValueChange={v => setForm({ ...form, requesterId: v })}>
                <SelectTrigger><SelectValue placeholder="Select employee" /></SelectTrigger>
                <SelectContent>
                  {activeEmployees.map(e => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="form-field">
              <Label className="form-label">Swap With *</Label>
              <Select value={form.targetId} onValueChange={v => setForm({ ...form, targetId: v })}>
                <SelectTrigger><SelectValue placeholder="Select employee" /></SelectTrigger>
                <SelectContent>
                  {activeEmployees.filter(e => e.id !== form.requesterId).map(e => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="form-field">
              <Label className="form-label">Date *</Label>
              <Input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
            </div>
            <div className="form-field">
              <Label className="form-label">Reason</Label>
              <Textarea value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} placeholder="Why is the swap needed?" rows={2} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={!form.requesterId || !form.targetId || !form.date}>Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Detail Modal */}
      <Dialog open={!!viewRequest} onOpenChange={() => setViewRequest(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Swap Request Details</DialogTitle></DialogHeader>
          {viewRequest && (
            <div className="space-y-3 py-2 text-sm">
              <div className="flex items-center gap-3 justify-center">
                <div className="text-center">
                  <p className="font-medium">{viewRequest.requesterName}</p>
                  <Badge variant="secondary" className="text-xs">{viewRequest.requesterShift}</Badge>
                </div>
                <ArrowRightLeft className="h-5 w-5 text-muted-foreground" />
                <div className="text-center">
                  <p className="font-medium">{viewRequest.targetName}</p>
                  <Badge variant="secondary" className="text-xs">{viewRequest.targetShift}</Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label className="text-xs text-muted-foreground">Date</Label><p>{new Date(viewRequest.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p></div>
                <div><Label className="text-xs text-muted-foreground">Status</Label><div><StatusBadge variant={viewRequest.status === 'approved' ? 'success' : viewRequest.status === 'rejected' ? 'destructive' : 'warning'}>{viewRequest.status.charAt(0).toUpperCase() + viewRequest.status.slice(1)}</StatusBadge></div></div>
              </div>
              {viewRequest.reason && <div><Label className="text-xs text-muted-foreground">Reason</Label><p>{viewRequest.reason}</p></div>}
              {viewRequest.remarks && <div><Label className="text-xs text-muted-foreground">Admin Remarks</Label><p>{viewRequest.remarks}</p></div>}
              {viewRequest.reviewedBy && <div className="text-xs text-muted-foreground">Reviewed by {viewRequest.reviewedBy} on {viewRequest.reviewedAt}</div>}
            </div>
          )}
          <DialogFooter><Button variant="outline" onClick={() => setViewRequest(null)}>Close</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Action Dialog */}
      <AlertDialog open={actionDialog.open} onOpenChange={(open) => setActionDialog(prev => ({ ...prev, open }))}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{actionDialog.action === 'approve' ? 'Approve' : 'Reject'} Swap Request</AlertDialogTitle>
            <AlertDialogDescription>
              {actionDialog.action === 'approve'
                ? `Approve shift swap between ${actionDialog.request?.requesterName} and ${actionDialog.request?.targetName}?`
                : `Reject shift swap request from ${actionDialog.request?.requesterName}?`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-2">
            <Label className="text-sm">Remarks (optional)</Label>
            <Textarea value={actionDialog.remarks} onChange={e => setActionDialog(prev => ({ ...prev, remarks: e.target.value }))} placeholder="Add remarks..." rows={2} />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleAction}>
              {actionDialog.action === 'approve' ? 'Approve' : 'Reject'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
