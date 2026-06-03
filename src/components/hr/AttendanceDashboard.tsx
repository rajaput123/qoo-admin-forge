import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserCheck, UserX, Clock, AlertTriangle, Bell } from 'lucide-react';
import { format } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts';
import type { TempleAttendanceRecord, TemplePerson } from '@/data/temple-attendance-data';
import { roleLabels, shiftLabels } from '@/data/temple-attendance-data';

interface Props {
  attendance: TempleAttendanceRecord[];
  personnel: TemplePerson[];
}

export function AttendanceDashboard({ attendance, personnel }: Props) {
  const today = format(new Date(), 'yyyy-MM-dd');

  const todayRecords = useMemo(() =>
    attendance.filter(a => a.date === today), [attendance, today]);

  const activePersonnel = personnel.filter(p => p.status === 'active');

  const stats = useMemo(() => {
    const present = todayRecords.filter(a => a.status === 'present' || a.status === 'late').length;
    const absent = todayRecords.filter(a => a.status === 'absent').length;
    const late = todayRecords.filter(a => a.status === 'late').length;
    const onLeave = todayRecords.filter(a => a.status === 'leave').length;
    const ongoingShifts = new Set(todayRecords.filter(a => a.clockIn && !a.clockOut).map(a => a.shift)).size;
    return { total: activePersonnel.length, present, absent, late, onLeave, ongoingShifts };
  }, [todayRecords, activePersonnel]);

  // Alerts
  const alerts = useMemo(() => {
    const items: { message: string; severity: 'high' | 'medium' }[] = [];
    const priestsAbsent = todayRecords.filter(a => a.role === 'priest' && (a.status === 'absent' || a.status === 'late'));
    priestsAbsent.forEach(p => {
      if (p.status === 'absent') items.push({ message: `🛕 ${p.personName} not checked in for ${shiftLabels[p.shift]?.split('(')[0]?.trim() || 'duty'}`, severity: 'high' });
      if (p.status === 'late') items.push({ message: `⏰ ${p.personName} arrived late for duty`, severity: 'medium' });
    });
    const staffMissing = todayRecords.filter(a => a.role === 'staff' && a.status === 'absent');
    if (staffMissing.length > 0) items.push({ message: `👤 ${staffMissing.length} staff member(s) missing for scheduled seva`, severity: 'medium' });
    return items;
  }, [todayRecords]);

  // Role-wise pie chart data
  const roleData = useMemo(() => {
    const roles = ['priest', 'staff', 'volunteer'] as const;
    return roles.map(role => ({
      name: roleLabels[role],
      present: todayRecords.filter(a => a.role === role && (a.status === 'present' || a.status === 'late')).length,
      total: activePersonnel.filter(p => p.role === role).length,
    }));
  }, [todayRecords, activePersonnel]);

  // Daily trend (last 7 days)
  const trendData = useMemo(() => {
    const days: { date: string; present: number; absent: number; late: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = format(d, 'yyyy-MM-dd');
      const dayRecords = attendance.filter(a => a.date === dateStr);
      days.push({
        date: format(d, 'dd MMM'),
        present: dayRecords.filter(a => a.status === 'present').length,
        absent: dayRecords.filter(a => a.status === 'absent').length,
        late: dayRecords.filter(a => a.status === 'late').length,
      });
    }
    return days;
  }, [attendance]);

  const COLORS = ['hsl(16, 85%, 30%)', 'hsl(142, 71%, 45%)', 'hsl(217, 91%, 60%)'];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Total Staff', value: stats.total, icon: Users, color: 'text-foreground' },
          { label: 'Present Today', value: stats.present, icon: UserCheck, color: 'text-success' },
          { label: 'Absent Today', value: stats.absent, icon: UserX, color: 'text-destructive' },
          { label: 'Late Check-ins', value: stats.late, icon: Clock, color: 'text-warning' },
          { label: 'On Leave', value: stats.onLeave, icon: AlertTriangle, color: 'text-muted-foreground' },
          { label: 'Ongoing Shifts', value: stats.ongoingShifts, icon: Bell, color: 'text-primary' },
        ].map(item => (
          <Card key={item.label}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <item.icon className={`h-4 w-4 ${item.color}`} />
                <span className="text-xs text-muted-foreground">{item.label}</span>
              </div>
              <p className="text-2xl font-bold">{item.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <Card className="border-warning/30 bg-warning/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-warning" />
              Today's Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {alerts.map((alert, i) => (
              <div key={i} className={`text-sm p-2 rounded-md ${alert.severity === 'high' ? 'bg-destructive/10 text-destructive' : 'bg-warning/10 text-warning-foreground'}`}>
                {alert.message}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Attendance Trend */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Daily Attendance Trend (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="date" className="text-xs" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="present" stroke="hsl(142, 71%, 45%)" name="Present" strokeWidth={2} />
                <Line type="monotone" dataKey="absent" stroke="hsl(0, 72%, 51%)" name="Absent" strokeWidth={2} />
                <Line type="monotone" dataKey="late" stroke="hsl(38, 92%, 50%)" name="Late" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Role-wise Attendance */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Role-wise Attendance Today</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={roleData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="present" fill="hsl(142, 71%, 45%)" name="Present" radius={[0, 4, 4, 0]} />
                <Bar dataKey="total" fill="hsl(var(--muted))" name="Total" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
