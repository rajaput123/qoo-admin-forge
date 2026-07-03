import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StatusBadge } from '@/components/ui/status-badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Plus, Search, AlertTriangle, Clock, UserX, FileText } from 'lucide-react';
import { format } from 'date-fns';
import type { ActivityLog, TemplePerson } from '@/data/temple-attendance-data';
import { roleLabels } from '@/data/temple-attendance-data';

interface Props {
  logs: ActivityLog[];
  personnel: TemplePerson[];
  onAddLog: (log: Omit<ActivityLog, 'id'>) => void;
}

const typeLabels: Record<string, string> = {
  late_arrival: 'Late Arrival',
  absence: 'Absence',
  missed_duty: 'Missed Duty',
  early_departure: 'Early Departure',
  note: 'Note',
};

const typeIcons: Record<string, typeof Clock> = {
  late_arrival: Clock,
  absence: UserX,
  missed_duty: AlertTriangle,
  early_departure: Clock,
  note: FileText,
};

const severityVariants: Record<string, 'destructive' | 'warning' | 'neutral'> = {
  high: 'destructive',
  medium: 'warning',
  low: 'neutral',
};

export function DisciplinaryActions({ logs, personnel, onAddLog }: Props) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    personId: '',
    type: 'late_arrival' as ActivityLog['type'],
    description: '',
    severity: 'medium' as ActivityLog['severity'],
    notes: '',
    actionTaken: '',
  });

  const filteredLogs = useMemo(() => {
    let list = [...logs];
    if (search) list = list.filter(l => l.personName.toLowerCase().includes(search.toLowerCase()) || l.description.toLowerCase().includes(search.toLowerCase()));
    if (typeFilter !== 'all') list = list.filter(l => l.type === typeFilter);
    return list;
  }, [logs, search, typeFilter]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const person = personnel.find(p => p.id === formData.personId);
    if (!person) return;
    onAddLog({
      personId: person.id,
      personName: person.name,
      role: person.role,
      type: formData.type,
      description: formData.description,
      date: format(new Date(), 'yyyy-MM-dd'),
      severity: formData.severity,
      notes: formData.notes || undefined,
      actionTaken: formData.actionTaken || undefined,
    });
    setModalOpen(false);
    setFormData({ personId: '', type: 'late_arrival', description: '', severity: 'medium', notes: '', actionTaken: '' });
  };

  // Person history count
  const personCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    logs.forEach(l => { counts[l.personId] = (counts[l.personId] || 0) + 1; });
    return counts;
  }, [logs]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h3 className="text-lg font-semibold">Activity & Disciplinary Logs</h3>
          <p className="text-sm text-muted-foreground">Track late arrivals, absences, missed duties</p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus className="h-4 w-4 mr-1" /> Add Entry
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search logs..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {Object.entries(typeLabels).map(([k, v]) => (
              <SelectItem key={k} value={k}>{v}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Logs List */}
      <div className="space-y-3">
        {filteredLogs.map(log => {
          const Icon = typeIcons[log.type] || FileText;
          return (
            <Card key={log.id}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${log.severity === 'high' ? 'bg-destructive/10' : log.severity === 'medium' ? 'bg-warning/10' : 'bg-muted'}`}>
                    <Icon className={`h-4 w-4 ${log.severity === 'high' ? 'text-destructive' : log.severity === 'medium' ? 'text-warning' : 'text-muted-foreground'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-sm">{log.personName}</span>
                      <StatusBadge variant={log.role === 'priest' ? 'primary' : log.role === 'staff' ? 'success' : 'warning'} className="text-[10px] px-1.5 py-0">
                        {roleLabels[log.role]}
                      </StatusBadge>
                      <StatusBadge variant={severityVariants[log.severity]} className="text-[10px] px-1.5 py-0">
                        {log.severity}
                      </StatusBadge>
                    </div>
                    <p className="text-sm mt-1">{log.description}</p>
                    {log.notes && <p className="text-xs text-muted-foreground mt-1">📝 {log.notes}</p>}
                    {log.actionTaken && <p className="text-xs text-primary mt-1">✅ Action: {log.actionTaken}</p>}
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                      <span>{typeLabels[log.type]}</span>
                      <span>•</span>
                      <span>{log.date}</span>
                      {personCounts[log.personId] > 1 && (
                        <>
                          <span>•</span>
                          <span className="text-destructive">{personCounts[log.personId]} total entries</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
        {filteredLogs.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">No activity logs found.</div>
        )}
      </div>

      {/* Add Log Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Activity Log</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Person *</Label>
              <Select value={formData.personId} onValueChange={v => setFormData({ ...formData, personId: v })}>
                <SelectTrigger><SelectValue placeholder="Select person" /></SelectTrigger>
                <SelectContent>
                  {personnel.filter(p => p.status === 'active').map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.name} ({roleLabels[p.role]})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Type *</Label>
                <Select value={formData.type} onValueChange={v => setFormData({ ...formData, type: v as any })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(typeLabels).map(([k, v]) => (
                      <SelectItem key={k} value={k}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Severity *</Label>
                <Select value={formData.severity} onValueChange={v => setFormData({ ...formData, severity: v as any })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Description *</Label>
              <Textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="e.g. Missed morning aarti duty" required />
            </div>
            <div>
              <Label>Notes</Label>
              <Textarea value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} placeholder="Additional context..." rows={2} />
            </div>
            <div>
              <Label>Action Taken</Label>
              <Input value={formData.actionTaken} onChange={e => setFormData({ ...formData, actionTaken: e.target.value })} placeholder="e.g. Warning issued" />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={!formData.personId || !formData.description}>Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
