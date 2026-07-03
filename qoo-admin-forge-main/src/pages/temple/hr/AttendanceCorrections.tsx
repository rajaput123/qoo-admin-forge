import { useState } from 'react';
import { DataTable } from '@/components/ui/data-table';
import { StatusBadge } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Plus, Check, X, Clock, FileEdit } from 'lucide-react';
import { employees } from '@/data/hr-dummy-data';
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

interface CorrectionRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  currentStatus: string;
  requestedStatus: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  reviewedBy?: string;
}

const initialCorrections: CorrectionRequest[] = [
  { id: 'cor-1', employeeId: 'emp-1', employeeName: 'Ramesh Kumar', date: '2026-03-28', currentStatus: 'absent', requestedStatus: 'present', reason: 'Was present but forgot to clock in', status: 'pending', createdAt: '2026-03-29' },
  { id: 'cor-2', employeeId: 'emp-3', employeeName: 'Suresh Sharma', date: '2026-03-25', currentStatus: 'half_day', requestedStatus: 'present', reason: 'System error, was present full day', status: 'approved', createdAt: '2026-03-26', reviewedBy: 'Admin' },
];

export default function AttendanceCorrections() {
  const [corrections, setCorrections] = useState<CorrectionRequest[]>(initialCorrections);
  const [createOpen, setCreateOpen] = useState(false);
  const [actionDialog, setActionDialog] = useState<{ open: boolean; action: 'approve' | 'reject'; correction: CorrectionRequest | null }>({
    open: false, action: 'approve', correction: null,
  });

  const [form, setForm] = useState({ employeeId: '', date: '', currentStatus: '', requestedStatus: '', reason: '' });

  const activeEmployees = employees.filter(e => e.status === 'active' || e.status === 'on_leave');
  const statusOptions = [
    { value: 'present', label: 'Present' },
    { value: 'absent', label: 'Absent' },
    { value: 'half_day', label: 'Half Day' },
    { value: 'leave', label: 'Leave' },
    { value: 'late', label: 'Late' },
  ];

  const handleCreate = () => {
    const emp = activeEmployees.find(e => e.id === form.employeeId);
    if (!emp) return;
    const newReq: CorrectionRequest = {
      id: `cor-${Date.now()}`,
      employeeId: emp.id,
      employeeName: emp.name,
      date: form.date,
      currentStatus: form.currentStatus,
      requestedStatus: form.requestedStatus,
      reason: form.reason,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setCorrections(prev => [newReq, ...prev]);
    setCreateOpen(false);
    setForm({ employeeId: '', date: '', currentStatus: '', requestedStatus: '', reason: '' });
  };

  const handleAction = () => {
    if (!actionDialog.correction) return;
    setCorrections(prev => prev.map(c =>
      c.id === actionDialog.correction!.id
        ? { ...c, status: (actionDialog.action === 'approve' ? 'approved' : 'rejected') as CorrectionRequest['status'], reviewedBy: 'Admin' }
        : c
    ));
    setActionDialog({ open: false, action: 'approve', correction: null });
  };

  const statusLabel = (s: string) => {
    const map: Record<string, string> = { present: 'Present', absent: 'Absent', half_day: 'Half Day', leave: 'Leave', late: 'Late' };
    return map[s] || s;
  };
  const statusVariant = (s: string): 'success' | 'destructive' | 'warning' | 'primary' | 'neutral' => {
    const map: Record<string, 'success' | 'destructive' | 'warning' | 'primary' | 'neutral'> = { present: 'success', absent: 'destructive', half_day: 'warning', leave: 'primary', late: 'warning' };
    return map[s] || 'neutral';
  };

  const columns = [
    { key: 'employeeName', label: 'Employee', sortable: true },
    { key: 'date', label: 'Date', sortable: true, render: (v: unknown) => new Date(v as string).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) },
    { key: 'currentStatus', label: 'Current', render: (v: unknown) => <StatusBadge variant={statusVariant(v as string)}>{statusLabel(v as string)}</StatusBadge> },
    { key: 'requestedStatus', label: 'Requested', render: (v: unknown) => <StatusBadge variant={statusVariant(v as string)}>{statusLabel(v as string)}</StatusBadge> },
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
          <Plus className="h-4 w-4 mr-2" />Request Correction
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Pending', value: corrections.filter(c => c.status === 'pending').length, icon: Clock, color: 'text-amber-500' },
          { label: 'Approved', value: corrections.filter(c => c.status === 'approved').length, icon: Check, color: 'text-green-500' },
          { label: 'Total', value: corrections.length, icon: FileEdit, color: 'text-primary' },
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
        data={corrections}
        columns={columns}
        searchPlaceholder="Search corrections..."
        actions={(row) => row.status === 'pending' ? (
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-green-600" onClick={(e) => { e.stopPropagation(); setActionDialog({ open: true, action: 'approve', correction: row }); }}>
              <Check className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={(e) => { e.stopPropagation(); setActionDialog({ open: true, action: 'reject', correction: row }); }}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : null}
      />

      {/* Create Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Request Attendance Correction</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="form-field">
              <Label className="form-label">Employee *</Label>
              <Select value={form.employeeId} onValueChange={v => setForm({ ...form, employeeId: v })}>
                <SelectTrigger><SelectValue placeholder="Select employee" /></SelectTrigger>
                <SelectContent>{activeEmployees.map(e => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="form-field">
              <Label className="form-label">Date *</Label>
              <Input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="form-field">
                <Label className="form-label">Current Status</Label>
                <Select value={form.currentStatus} onValueChange={v => setForm({ ...form, currentStatus: v })}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>{statusOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="form-field">
                <Label className="form-label">Correct To *</Label>
                <Select value={form.requestedStatus} onValueChange={v => setForm({ ...form, requestedStatus: v })}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>{statusOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="form-field">
              <Label className="form-label">Reason *</Label>
              <Textarea value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} placeholder="Explain why correction is needed..." rows={2} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={!form.employeeId || !form.date || !form.requestedStatus || !form.reason}>Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Action Dialog */}
      <AlertDialog open={actionDialog.open} onOpenChange={(open) => setActionDialog(prev => ({ ...prev, open }))}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{actionDialog.action === 'approve' ? 'Approve' : 'Reject'} Correction</AlertDialogTitle>
            <AlertDialogDescription>
              {actionDialog.action === 'approve'
                ? `Change ${actionDialog.correction?.employeeName}'s attendance from ${statusLabel(actionDialog.correction?.currentStatus || '')} to ${statusLabel(actionDialog.correction?.requestedStatus || '')}?`
                : `Reject the correction request from ${actionDialog.correction?.employeeName}?`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleAction}>{actionDialog.action === 'approve' ? 'Approve' : 'Reject'}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
