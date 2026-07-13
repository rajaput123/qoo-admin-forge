import { useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Plus, Users, Edit, Trash2, ShieldCheck, Clock, CalendarDays, FileText } from 'lucide-react';
import {
  policyGroups as seedGroups,
  templeRuleDocs,
  shifts,
  attendancePoliciesRef,
  leavePolicies,
  upsertPolicyGroup,
  deletePolicyGroup,
  type PolicyGroup,
} from '@/data/hr-policy-groups';
import { toast } from 'sonner';

const emptyGroup: PolicyGroup = {
  id: '',
  name: '',
  description: '',
  shiftId: undefined,
  attendancePolicyId: undefined,
  leavePolicyId: undefined,
  templeRuleDocIds: [],
  membersCount: 0,
  status: 'active',
};

export default function PolicyGroups() {
  const [groups, setGroups] = useState<PolicyGroup[]>(seedGroups);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<PolicyGroup>(emptyGroup);

  const openNew = () => { setForm({ ...emptyGroup, id: `pg${Date.now()}` }); setOpen(true); };
  const openEdit = (g: PolicyGroup) => { setForm({ ...g }); setOpen(true); };
  const save = () => {
    if (!form.name.trim()) { toast.error('Grade name is required'); return; }
    upsertPolicyGroup(form);
    setGroups(prev => {
      const idx = prev.findIndex(p => p.id === form.id);
      return idx >= 0 ? prev.map(p => p.id === form.id ? form : p) : [...prev, form];
    });
    setOpen(false);
    toast.success('Policy group saved');
  };
  const remove = (id: string) => {
    deletePolicyGroup(id);
    setGroups(prev => prev.filter(p => p.id !== id));
    toast.success('Deleted');
  };
  const toggleRule = (rid: string) => {
    setForm(f => ({
      ...f,
      templeRuleDocIds: f.templeRuleDocIds.includes(rid)
        ? f.templeRuleDocIds.filter(x => x !== rid)
        : [...f.templeRuleDocIds, rid],
    }));
  };

  const shiftName = (id?: string) => shifts.find(s => s.id === id)?.name || '—';
  const apName = (id?: string) => attendancePoliciesRef.find(a => a.id === id)?.name || '—';
  const lpName = (id?: string) => leavePolicies.find(l => l.id === id)?.name || '—';

  return (
    <div className="space-y-4">
      <PageHeader
        title="Policy Groups (Grades)"
        description="Bundle Temple Rules, Shift, Attendance & Leave Policy — assign employees to a grade instead of configuring per-person."
        actions={
          <Button onClick={openNew}>
            <Plus className="h-4 w-4 mr-2" /> New Grade
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-2">
        {groups.map(g => (
          <Card key={g.id} className="border-l-4 border-l-primary/70">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                    {g.name}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground mt-1">{g.description}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Badge variant={g.status === 'active' ? 'default' : 'secondary'}>{g.status}</Badge>
                  <Button size="icon" variant="ghost" onClick={() => openEdit(g)}><Edit className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => remove(g.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-center gap-2"><Users className="h-3.5 w-3.5 text-muted-foreground" /> <span className="text-muted-foreground">Members:</span> <b>{g.membersCount}</b></div>
              <div className="flex items-center gap-2"><Clock className="h-3.5 w-3.5 text-muted-foreground" /> <span className="text-muted-foreground">Shift:</span> {shiftName(g.shiftId)}</div>
              <div className="flex items-center gap-2"><CalendarDays className="h-3.5 w-3.5 text-muted-foreground" /> <span className="text-muted-foreground">Attendance:</span> {apName(g.attendancePolicyId)}</div>
              <div className="flex items-center gap-2"><CalendarDays className="h-3.5 w-3.5 text-muted-foreground" /> <span className="text-muted-foreground">Leave Policy:</span> {lpName(g.leavePolicyId)}</div>
              <div className="flex items-start gap-2">
                <FileText className="h-3.5 w-3.5 text-muted-foreground mt-0.5" />
                <div className="flex flex-wrap gap-1">
                  {g.templeRuleDocIds.length === 0 && <span className="text-muted-foreground">No rules linked</span>}
                  {g.templeRuleDocIds.map(rid => {
                    const r = templeRuleDocs.find(x => x.id === rid);
                    return r ? <Badge key={rid} variant="outline" className="text-xs">{r.title}</Badge> : null;
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{groups.some(g => g.id === form.id) ? 'Edit' : 'New'} Policy Group</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <Label>Grade Name *</Label>
                <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g., Priest Grade" />
              </div>
              <div className="col-span-2">
                <Label>Description</Label>
                <Textarea rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              </div>
              <div>
                <Label>Shift</Label>
                <Select value={form.shiftId || 'none'} onValueChange={v => setForm({ ...form, shiftId: v === 'none' ? undefined : v })}>
                  <SelectTrigger><SelectValue placeholder="Select shift" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">— none —</SelectItem>
                    {shifts.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Attendance Policy</Label>
                <Select value={form.attendancePolicyId || 'none'} onValueChange={v => setForm({ ...form, attendancePolicyId: v === 'none' ? undefined : v })}>
                  <SelectTrigger><SelectValue placeholder="Select policy" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">— none —</SelectItem>
                    {attendancePoliciesRef.map(a => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Leave Policy</Label>
                <Select value={form.leavePolicyId || 'none'} onValueChange={v => setForm({ ...form, leavePolicyId: v === 'none' ? undefined : v })}>
                  <SelectTrigger><SelectValue placeholder="Select policy" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">— none —</SelectItem>
                    {leavePolicies.map(l => <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Status</Label>
                <Select value={form.status} onValueChange={v => setForm({ ...form, status: v as 'active' | 'inactive' })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2">
                <Label>Linked Temple Rules</Label>
                <div className="mt-2 grid grid-cols-2 gap-2 border rounded-md p-3 bg-muted/30">
                  {templeRuleDocs.map(r => (
                    <label key={r.id} className="flex items-start gap-2 text-sm cursor-pointer">
                      <Checkbox checked={form.templeRuleDocIds.includes(r.id)} onCheckedChange={() => toggleRule(r.id)} />
                      <span>
                        <span className="font-medium">{r.title}</span>
                        <span className="block text-xs text-muted-foreground">{r.summary}</span>
                      </span>
                    </label>
                  ))}
                </div>
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