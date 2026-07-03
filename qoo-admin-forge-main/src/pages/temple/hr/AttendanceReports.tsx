import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DataTable } from '@/components/ui/data-table';
import { StatusBadge } from '@/components/ui/status-badge';
import { Download, Users, CheckCircle2, XCircle, Clock, TrendingUp } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line, CartesianGrid } from 'recharts';
import type { TempleAttendanceRecord, TemplePerson, TempleRole } from '@/data/temple-attendance-data';
import { roleLabels } from '@/data/temple-attendance-data';

interface Props {
  attendance: TempleAttendanceRecord[];
  personnel: TemplePerson[];
}

export default function AttendanceReports({ attendance, personnel }: Props) {
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [deptFilter, setDeptFilter] = useState<string>('all');
  const [personFilter, setPersonFilter] = useState<string>('all');

  const departments = useMemo(() => [...new Set(personnel.map(p => p.department))], [personnel]);
  const monthStart = startOfMonth(new Date(selectedMonth + '-01'));
  const monthEnd = endOfMonth(new Date(selectedMonth + '-01'));
  const totalDays = eachDayOfInterval({ start: monthStart, end: monthEnd }).length;

  const filteredPersonnel = useMemo(() => {
    let list = personnel.filter(p => p.status === 'active');
    if (roleFilter !== 'all') list = list.filter(p => p.role === roleFilter);
    if (deptFilter !== 'all') list = list.filter(p => p.department === deptFilter);
    if (personFilter !== 'all') list = list.filter(p => p.id === personFilter);
    return list;
  }, [personnel, roleFilter, deptFilter, personFilter]);

  const reportData = useMemo(() => {
    const startStr = format(monthStart, 'yyyy-MM-dd');
    const endStr = format(monthEnd, 'yyyy-MM-dd');

    return filteredPersonnel.map(person => {
      const records = attendance.filter(a => a.personId === person.id && a.date >= startStr && a.date <= endStr);
      const present = records.filter(a => a.status === 'present').length;
      const absent = records.filter(a => a.status === 'absent').length;
      const late = records.filter(a => a.status === 'late').length;
      const leave = records.filter(a => a.status === 'leave').length;
      const attendancePct = totalDays > 0 ? ((present + late) / totalDays * 100).toFixed(1) : '0';

      return {
        id: person.id,
        name: person.name,
        role: person.role,
        department: person.department,
        totalDays,
        present: present + late,
        absent,
        leave,
        lateCount: late,
        attendancePct,
        remarks: late > 3 ? 'Frequent late arrivals' : absent > 5 ? 'High absenteeism' : '',
      };
    });
  }, [filteredPersonnel, attendance, monthStart, monthEnd, totalDays]);

  // KPI totals
  const kpis = useMemo(() => ({
    totalPeople: reportData.length,
    avgAttendance: reportData.length > 0 ? (reportData.reduce((s, r) => s + parseFloat(r.attendancePct), 0) / reportData.length).toFixed(1) : '0',
    totalPresent: reportData.reduce((s, r) => s + r.present, 0),
    totalAbsent: reportData.reduce((s, r) => s + r.absent, 0),
    totalLate: reportData.reduce((s, r) => s + r.lateCount, 0),
  }), [reportData]);

  // Role-wise pie data
  const rolePieData = useMemo(() => {
    const roles: TempleRole[] = ['priest', 'staff', 'volunteer'];
    return roles.map(role => ({
      name: roleLabels[role],
      value: reportData.filter(r => r.role === role).reduce((s, r) => s + r.present, 0),
    })).filter(d => d.value > 0);
  }, [reportData]);

  // Department bar chart
  const deptBarData = useMemo(() => {
    const depts = [...new Set(reportData.map(r => r.department))];
    return depts.map(dept => {
      const deptRecords = reportData.filter(r => r.department === dept);
      return {
        department: dept,
        present: deptRecords.reduce((s, r) => s + r.present, 0),
        absent: deptRecords.reduce((s, r) => s + r.absent, 0),
      };
    });
  }, [reportData]);

  // Attendance trend line
  const trendData = useMemo(() => {
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
    return days.slice(0, Math.min(days.length, 31)).map(day => {
      const dateStr = format(day, 'yyyy-MM-dd');
      const dayAtt = attendance.filter(a => a.date === dateStr && filteredPersonnel.some(p => p.id === a.personId));
      return {
        date: format(day, 'dd'),
        present: dayAtt.filter(a => a.status === 'present' || a.status === 'late').length,
        absent: dayAtt.filter(a => a.status === 'absent').length,
      };
    });
  }, [attendance, filteredPersonnel, monthStart, monthEnd]);

  const COLORS = ['hsl(16, 85%, 30%)', 'hsl(142, 71%, 45%)', 'hsl(38, 92%, 50%)'];

  const handleExport = () => {
    const headers = ['Name', 'Role', 'Department', 'Total Days', 'Present', 'Absent', 'Leave', 'Late', 'Attendance %', 'Remarks'];
    const rows = reportData.map(r => [r.name, roleLabels[r.role], r.department, r.totalDays, r.present, r.absent, r.leave, r.lateCount, r.attendancePct + '%', r.remarks]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance-report-${selectedMonth}.csv`;
    a.click();
  };

  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    {
      key: 'role', label: 'Role',
      render: (v: unknown) => <StatusBadge variant={v === 'priest' ? 'primary' : v === 'staff' ? 'success' : 'warning'} className="text-[10px]">{roleLabels[v as TempleRole]}</StatusBadge>,
    },
    { key: 'department', label: 'Department' },
    { key: 'totalDays', label: 'Total Days', sortable: true },
    { key: 'present', label: 'Present', sortable: true },
    { key: 'absent', label: 'Absent', sortable: true },
    { key: 'leave', label: 'Leave', sortable: true },
    { key: 'lateCount', label: 'Late', sortable: true },
    {
      key: 'attendancePct', label: 'Attendance %', sortable: true,
      render: (v: unknown) => {
        const pct = parseFloat(v as string);
        return <span className={pct >= 90 ? 'text-success font-medium' : pct >= 75 ? 'text-warning font-medium' : 'text-destructive font-medium'}>{String(v)}%</span>;
      },
    },
    { key: 'remarks', label: 'Remarks', render: (v: unknown) => v ? <span className="text-xs text-destructive">{String(v)}</span> : <span>—</span> },
  ];

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-end flex-wrap">
        <div>
          <Label className="mb-1 block text-xs">Month</Label>
          <Input type="month" value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)} className="w-auto" />
        </div>
        <div>
          <Label className="mb-1 block text-xs">Role</Label>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
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
            <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="mb-1 block text-xs">Person</Label>
          <Select value={personFilter} onValueChange={setPersonFilter}>
            <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {filteredPersonnel.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline" onClick={handleExport}>
          <Download className="h-4 w-4 mr-1" /> Export CSV
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: 'Total People', value: kpis.totalPeople, icon: Users },
          { label: 'Attendance %', value: kpis.avgAttendance + '%', icon: TrendingUp },
          { label: 'Total Present', value: kpis.totalPresent, icon: CheckCircle2 },
          { label: 'Total Absent', value: kpis.totalAbsent, icon: XCircle },
          { label: 'Total Late', value: kpis.totalLate, icon: Clock },
        ].map(k => (
          <Card key={k.label}>
            <CardContent className="p-3">
              <div className="flex items-center gap-2 mb-1">
                <k.icon className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{k.label}</span>
              </div>
              <p className="text-xl font-bold">{k.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Trend */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2"><CardTitle className="text-sm">Attendance Trend</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="present" stroke="hsl(142, 71%, 45%)" name="Present" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="absent" stroke="hsl(0, 72%, 51%)" name="Absent" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Role-wise Pie */}
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Role-wise Present Days</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={rolePieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                  {rolePieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Department Bar Chart */}
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm">Department-wise Attendance</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={deptBarData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="department" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="present" fill="hsl(142, 71%, 45%)" name="Present" radius={[4, 4, 0, 0]} />
              <Bar dataKey="absent" fill="hsl(0, 72%, 51%)" name="Absent" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Data Table */}
      <DataTable data={reportData} columns={columns as any} searchPlaceholder="Search by name..." />
    </div>
  );
}
