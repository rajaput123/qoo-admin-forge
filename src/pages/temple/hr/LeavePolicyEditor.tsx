import { useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Plus, Trash2, Edit, ArrowRight, CalendarOff, FileCheck2 } from 'lucide-react';
import {
  leavePolicies as seed,
  upsertLeavePolicy,
  deleteLeavePolicy,
  type LeavePolicyDoc,
  type LeaveTypeQuota,
  type FestivalBlackout,
  type ApprovalStep,
} from '@/data/hr-policy-groups';
import { toast } from 'sonner';

const emptyPolicy = (): LeavePolicyDoc => ({
  id: `lp${Date.now()}`,
  name: '',
  effectiveFrom: new Date().toISOString().slice(0, 10),
  status: 'draft',
  advanceNoticeDays: 3,
  maxConsecutiveDays: 10,
  minServiceMonths: 1,
  quotas: [],
  blackouts: [],
  approvalChain: [],
});

export default function LeavePolicyEditor() {
  const [policies, setPolicies] = useState<LeavePolicyDoc[]>(seed);
  const [open, setOpen] = useState(false);
  const [p, setP] = useState<LeavePolicyDoc>(emptyPolicy());

  const openNew = () => { setP(emptyPolicy()); setOpen(true); };
  const openEdit = (x: LeavePolicyDoc) => { setP(JSON.parse(JSON.stringify(x))); setOpen(true); };
  const save = () => {
    if (!p.name.trim()) { toast.error('Policy name required'); return; }
    upsertLeavePolicy(p);
    setPolicies(prev => {
      const i = prev.findIndex(x => x.id === p.id);
      return i >= 0 ? prev.map(x => x.id === p.id ? p : x) : [...prev, p];
    });
    setOpen(false);
    toast.success('Leave policy saved');
  };
  const remove = (id: string) => {
    deleteLeavePolicy(id);
    setPolicies(prev => prev.filter(x => x.id !== id));
    toast.success('Deleted');
  };

  // ---- Quota editors ----
  const addQuota = () => setP({ ...p, quotas: [...p.quotas, {
    typeId: `lt${Date.now()}`, typeName: 'New Leave Type', annualQuota: 0,
    carryForward: false, maxCarryForward: 0, paid: true, encashable: false,
  }] });
  const updateQuota = (i: number, patch: Partial<LeaveTypeQuota>) =>
    setP({ ...p, quotas: p.quotas.map((q, idx) => idx === i ? { ...q, ...patch } : q) });
  const removeQuota = (i: number) => setP({ ...p, quotas: p.quotas.filter((_, idx) => idx !== i) });

  // ---- Blackout editors ----
  const addBlackout = () => setP({ ...p, blackouts: [...p.blackouts, {
    id: `b${Date.now()}`, name: 'New Blackout', fromDate: p.effectiveFrom, toDate: p.effectiveFrom,
    appliesTo: 'all', reason: '',
  }] });
  const updateBlackout = (i: number, patch: Partial<FestivalBlackout>) =>
    setP({ ...p, blackouts: p.blackouts.map((b, idx) => idx === i ? { ...b, ...patch } : b) });
  const removeBlackout = (i: number) => setP({ ...p, blackouts: p.blackouts.filter((_, idx) => idx !== i) });

  // ---- Approval editors ----
  const addApproval = () => setP({ ...p, approvalChain: [...p.approvalChain, {
    id: `a${Date.now()}`, role: 'Reporting Manager', required: true,
  }] });
  const updateApproval = (i: number, patch: Partial<ApprovalStep>) =>
    setP({ ...p, approvalChain: p.approvalChain.map((a, idx) => idx === i ? { ...a, ...patch } : a) });
  const removeApproval = (i: number) => setP({ ...p, approvalChain: p.approvalChain.filter((_, idx) => idx !== i) });

  return (
    <div className="space-y-4">
      <PageHeader
        title="Leave Policy Editor"
        description="Define leave quotas, festival blackouts and multi-level approval chain. Link a policy to Policy Groups (Grades)."
        actions={<Button onClick={openNew}><Plus className="h-4 w-4 mr-2" />New Policy</Button>}
      />

      <div className="grid gap-4">
        {policies.map(x => (
          <Card key={x.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    <FileCheck2 className="h-4 w-4 text-primary" />
                    {x.name}
                    <Badge variant={x.status === 'active' ? 'default' : x.status === 'draft' ? 'secondary' : 'outline'}>{x.status}</Badge>
                  </CardTitle>
                  <p className="text-xs text-muted-foreground mt-1">
                    Effective from {x.effectiveFrom} · Notice {x.advanceNoticeDays}d · Max consecutive {x.maxConsecutiveDays}d
                  </p>
                </div>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" onClick={() => openEdit(x)}><Edit className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => remove(x.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="font-medium mb-1">Quotas</div>
                <ul className="space-y-0.5 text-xs">
                  {x.quotas.map(q => (
                    <li key={q.typeId} className="flex justify-between">
                      <span>{q.typeName}</span>
                      <span className="text-muted-foreground">{q.annualQuota}d {q.paid ? '· Paid' : '· Unpaid'}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="font-medium mb-1 flex items-center gap-1"><CalendarOff className="h-3.5 w-3.5" /> Blackouts</div>
                <ul className="space-y-0.5 text-xs">
                  {x.blackouts.map(b => (
                    <li key={b.id}>
                      <span className="font-medium">{b.name}</span>
                      <span className="text-muted-foreground"> — {b.fromDate} to {b.toDate} ({b.appliesTo.replace('_', ' ')})</span>
                    </li>
                  ))}
                  {x.blackouts.length === 0 && <li className="text-muted-foreground">None</li>}
                </ul>
              </div>
              <div>
                <div className="font-medium mb-1">Approval Chain</div>
                <div className="flex flex-wrap items-center gap-1 text-xs">
                  {x.approvalChain.map((a, i) => (
                    <div key={a.id} className="flex items-center gap-1">
                      <Badge variant="outline">{a.role}{a.required ? '' : '?'}</Badge>
                      {i < x.approvalChain.length - 1 && <ArrowRight className="h-3 w-3 text-muted-foreground" />}
                    </div>
                  ))}
                  {x.approvalChain.length === 0 && <span className="text-muted-foreground">None</span>}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[92vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{policies.some(x => x.id === p.id) ? 'Edit' : 'New'} Leave Policy</DialogTitle>
          </DialogHeader>
          <div className="space-y-5">
            <div className="grid grid-cols-4 gap-3">
              <div className="col-span-2">
                <Label>Policy Name *</Label>
                <Input value={p.name} onChange={e => setP({ ...p, name: e.target.value })} />
              </div>
              <div>
                <Label>Effective From</Label>
                <Input type="date" value={p.effectiveFrom} onChange={e => setP({ ...p, effectiveFrom: e.target.value })} />
              </div>
              <div>
                <Label>Status</Label>
                <Select value={p.status} onValueChange={v => setP({ ...p, status: v as LeavePolicyDoc['status'] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Advance Notice (days)</Label>
                <Input type="number" min={0} value={p.advanceNoticeDays}
                  onChange={e => setP({ ...p, advanceNoticeDays: +e.target.value })} />
              </div>
              <div>
                <Label>Max Consecutive Days</Label>
                <Input type="number" min={1} value={p.maxConsecutiveDays}
                  onChange={e => setP({ ...p, maxConsecutiveDays: +e.target.value })} />
              </div>
              <div>
                <Label>Min Service (months)</Label>
                <Input type="number" min={0} value={p.minServiceMonths}
                  onChange={e => setP({ ...p, minServiceMonths: +e.target.value })} />
              </div>
            </div>

            {/* Quotas */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Leave Type Quotas</Label>
                <Button size="sm" variant="outline" onClick={addQuota}><Plus className="h-3.5 w-3.5 mr-1" />Add</Button>
              </div>
              <div className="space-y-2">
                {p.quotas.map((q, i) => (
                  <div key={q.typeId} className="grid grid-cols-12 gap-2 items-end p-2 border rounded bg-muted/30">
                    <div className="col-span-3">
                      <Label className="text-xs">Type</Label>
                      <Input value={q.typeName} onChange={e => updateQuota(i, { typeName: e.target.value })} />
                    </div>
                    <div className="col-span-2">
                      <Label className="text-xs">Annual Quota (d)</Label>
                      <Input type="number" value={q.annualQuota} onChange={e => updateQuota(i, { annualQuota: +e.target.value })} />
                    </div>
                    <div className="col-span-2">
                      <Label className="text-xs">Max Carry Fwd</Label>
                      <Input type="number" value={q.maxCarryForward} onChange={e => updateQuota(i, { maxCarryForward: +e.target.value, carryForward: +e.target.value > 0 })} />
                    </div>
                    <div className="col-span-2 flex items-center gap-2 pb-2">
                      <Switch checked={q.paid} onCheckedChange={v => updateQuota(i, { paid: v })} />
                      <Label className="text-xs">Paid</Label>
                    </div>
                    <div className="col-span-2 flex items-center gap-2 pb-2">
                      <Switch checked={q.encashable} onCheckedChange={v => updateQuota(i, { encashable: v })} />
                      <Label className="text-xs">Encashable</Label>
                    </div>
                    <div className="col-span-1 flex justify-end">
                      <Button size="icon" variant="ghost" onClick={() => removeQuota(i)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Blackouts */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Festival Blackout Dates</Label>
                <Button size="sm" variant="outline" onClick={addBlackout}><Plus className="h-3.5 w-3.5 mr-1" />Add</Button>
              </div>
              <div className="space-y-2">
                {p.blackouts.map((b, i) => (
                  <div key={b.id} className="grid grid-cols-12 gap-2 items-end p-2 border rounded bg-muted/30">
                    <div className="col-span-3">
                      <Label className="text-xs">Festival / Name</Label>
                      <Input value={b.name} onChange={e => updateBlackout(i, { name: e.target.value })} />
                    </div>
                    <div className="col-span-2">
                      <Label className="text-xs">From</Label>
                      <Input type="date" value={b.fromDate} onChange={e => updateBlackout(i, { fromDate: e.target.value })} />
                    </div>
                    <div className="col-span-2">
                      <Label className="text-xs">To</Label>
                      <Input type="date" value={b.toDate} onChange={e => updateBlackout(i, { toDate: e.target.value })} />
                    </div>
                    <div className="col-span-2">
                      <Label className="text-xs">Applies To</Label>
                      <Select value={b.appliesTo} onValueChange={v => updateBlackout(i, { appliesTo: v as FestivalBlackout['appliesTo'] })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="priests_only">Priests only</SelectItem>
                          <SelectItem value="non_priests">Non-priests</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-2">
                      <Label className="text-xs">Reason</Label>
                      <Input value={b.reason} onChange={e => updateBlackout(i, { reason: e.target.value })} />
                    </div>
                    <div className="col-span-1 flex justify-end">
                      <Button size="icon" variant="ghost" onClick={() => removeBlackout(i)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Approval Chain */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Approval Chain</Label>
                <Button size="sm" variant="outline" onClick={addApproval}><Plus className="h-3.5 w-3.5 mr-1" />Add Step</Button>
              </div>
              <div className="space-y-2">
                {p.approvalChain.map((a, i) => (
                  <div key={a.id} className="grid grid-cols-12 gap-2 items-end p-2 border rounded bg-muted/30">
                    <div className="col-span-1 text-center text-sm font-semibold text-muted-foreground pb-2">#{i + 1}</div>
                    <div className="col-span-7">
                      <Label className="text-xs">Approver Role</Label>
                      <Input value={a.role} onChange={e => updateApproval(i, { role: e.target.value })} placeholder="e.g., Head Priest, HR Manager, Trustee" />
                    </div>
                    <div className="col-span-3 flex items-center gap-2 pb-2">
                      <Switch checked={a.required} onCheckedChange={v => updateApproval(i, { required: v })} />
                      <Label className="text-xs">Required</Label>
                    </div>
                    <div className="col-span-1 flex justify-end">
                      <Button size="icon" variant="ghost" onClick={() => removeApproval(i)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={save}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}