import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { StatusBadge } from '@/components/ui/status-badge';
import { Textarea } from '@/components/ui/textarea';
import { DataTable } from '@/components/ui/data-table';
import { Calendar as CalendarIcon, CheckCircle2, XCircle, Clock, UserCheck, Save, Users } from 'lucide-react';
import { format } from 'date-fns';
import type { TempleAttendanceRecord, TemplePerson } from '@/data/temple-attendance-data';
import { roleLabels, shiftLabels, dutyTypeLabels } from '@/data/temple-attendance-data';

interface Props {
  attendance: TempleAttendanceRecord[];
  personnel: TemplePerson[];
  onMarkAttendance: (personId: string, date: string, status: TempleAttendanceRecord['status'], remarks?: string) => void;
}

export default function DailyAttendance({ attendance, personnel, onMarkAttendance }: Props) {
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [deptFilter, setDeptFilter] = useState<string>('all');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const departments = useMemo(() => [...new Set(personnel.map(p => p.department))], [personnel]);

  const filteredPersonnel = useMemo(() => {
    let list = personnel.filter(p => p.status === 'active');
    if (roleFilter !== 'all') list = list.filter(p => p.role === roleFilter);
    if (deptFilter !== 'all') list = list.filter(p => p.department === deptFilter);
    return list;
  }, [personnel, roleFilter, deptFilter]);

  const dayRecords = useMemo(() => {
    return filteredPersonnel.map(person => {
      const record = attendance.find(a => a.personId === person.id && a.date === selectedDate);
      return {
        ...person,
        attendanceStatus: record?.status || 'absent' as const,
        clockIn: record?.clockIn || '',
        clockOut: record?.clockOut || '',
        remarks: record?.remarks || '',
        shift: person.shift,
        dutyType: person.dutyType,
      };
    });
  }, [filteredPersonnel, attendance, selectedDate]);

  const statusCounts = useMemo(() => {
    const counts = { present: 0, absent: 0, late: 0, leave: 0, half_day: 0 };
    dayRecords.forEach(r => {
      if (r.attendanceStatus in counts) counts[r.attendanceStatus as keyof typeof counts]++;
    });
    return counts;
  }, [dayRecords]);

  const handleBulkMark = (status: TempleAttendanceRecord['status']) => {
    selectedIds.forEach(id => onMarkAttendance(id, selectedDate, status));
    setSelectedIds(new Set());
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelectedIds(next);
  };

  const columns = [
    {
      key: 'select',
      label: '',
      render: (_: unknown, row: any) => (
        <Checkbox checked={selectedIds.has(row.id)} onCheckedChange={() => toggleSelect(row.id)} onClick={(e: any) => e.stopPropagation()} />
      ),
    },
    { key: 'name', label: 'Name', sortable: true },
    {
      key: 'role',
      label: 'Role',
      render: (value: unknown) => (
        <StatusBadge variant={value === 'priest' ? 'primary' : value === 'staff' ? 'success' : 'warning'} className="text-[10px]">
          {roleLabels[value as keyof typeof roleLabels]}
        </StatusBadge>
      ),
    },
    { key: 'department', label: 'Department' },
    {
      key: 'shift',
      label: 'Shift',
      render: (value: unknown) => <span className="text-xs">{shiftLabels[value as keyof typeof shiftLabels]?.split('(')[0]?.trim()}</span>,
    },
    {
      key: 'dutyType',
      label: 'Duty',
      render: (value: unknown) => <span className="text-xs">{dutyTypeLabels[value as keyof typeof dutyTypeLabels]}</span>,
    },
    {
      key: 'attendanceStatus',
      label: 'Status',
      render: (value: unknown) => {
        const variants: Record<string, 'success' | 'destructive' | 'warning' | 'primary' | 'neutral'> = {
          present: 'success', absent: 'destructive', late: 'warning', leave: 'primary', half_day: 'warning', holiday: 'neutral',
        };
        const labels: Record<string, string> = {
          present: 'Present', absent: 'Absent', late: 'Late', leave: 'Leave', half_day: 'Half Day', holiday: 'Holiday',
        };
        return <StatusBadge variant={variants[value as string] || 'neutral'}>{labels[value as string] || String(value)}</StatusBadge>;
      },
    },
    { key: 'clockIn', label: 'Check In', render: (v: unknown) => v || '—' },
    { key: 'clockOut', label: 'Check Out', render: (v: unknown) => v || '—' },
    {
      key: 'actions',
      label: 'Mark As',
      render: (_: unknown, row: any) => (
        <Select value={row.attendanceStatus} onValueChange={v => onMarkAttendance(row.id, selectedDate, v as any)}>
          <SelectTrigger className="w-28 h-8 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="present">Present</SelectItem>
            <SelectItem value="absent">Absent</SelectItem>
            <SelectItem value="late">Late</SelectItem>
            <SelectItem value="half_day">Half Day</SelectItem>
            <SelectItem value="leave">Leave</SelectItem>
          </SelectContent>
        </Select>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-end">
        <div className="flex-1">
          <Label className="mb-1 block text-xs">Date</Label>
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            <Input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="w-auto" />
          </div>
        </div>
        <div>
          <Label className="mb-1 block text-xs">Role</Label>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="priest">Priests</SelectItem>
              <SelectItem value="staff">Staff</SelectItem>
              <SelectItem value="volunteer">Volunteers</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="mb-1 block text-xs">Department</Label>
          <Select value={deptFilter} onValueChange={setDeptFilter}>
            <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: 'Total', value: dayRecords.length, icon: Users, color: '' },
          { label: 'Present', value: statusCounts.present, icon: CheckCircle2, color: 'text-success' },
          { label: 'Absent', value: statusCounts.absent, icon: XCircle, color: 'text-destructive' },
          { label: 'Late', value: statusCounts.late, icon: Clock, color: 'text-warning' },
          { label: 'On Leave', value: statusCounts.leave, icon: UserCheck, color: 'text-primary' },
        ].map(s => (
          <Card key={s.label}>
            <CardContent className="p-3 flex items-center gap-2">
              <s.icon className={`h-4 w-4 ${s.color}`} />
              <div>
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="text-lg font-bold">{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bulk Actions */}
      {selectedIds.size > 0 && (
        <div className="p-3 bg-muted rounded-lg flex items-center justify-between flex-wrap gap-2">
          <span className="text-sm font-medium">{selectedIds.size} selected</span>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => handleBulkMark('present')}><CheckCircle2 className="h-3.5 w-3.5 mr-1" />Present</Button>
            <Button size="sm" variant="outline" onClick={() => handleBulkMark('absent')}><XCircle className="h-3.5 w-3.5 mr-1" />Absent</Button>
            <Button size="sm" variant="outline" onClick={() => handleBulkMark('leave')}>Leave</Button>
            <Button size="sm" variant="ghost" onClick={() => setSelectedIds(new Set())}>Clear</Button>
          </div>
        </div>
      )}

      {/* Table */}
      <DataTable data={dayRecords} columns={columns as any} searchPlaceholder="Search by name..." />
    </div>
  );
}
