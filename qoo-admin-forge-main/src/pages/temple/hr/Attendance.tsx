import { useState, useCallback } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DailyAttendance from './DailyAttendance';
import AttendanceReports from './AttendanceReports';
import AttendancePolicies from './AttendancePolicies';
import AttendanceCorrections from './AttendanceCorrections';
import { AttendanceDashboard } from '@/components/hr/AttendanceDashboard';
import { ClockInOut } from '@/components/hr/ClockInOut';
import { DisciplinaryActions } from '@/components/hr/DisciplinaryActions';
import { templePersonnel, seedAttendanceRecords, seedActivityLogs } from '@/data/temple-attendance-data';
import type { TempleAttendanceRecord, ActivityLog } from '@/data/temple-attendance-data';
import { format } from 'date-fns';

export default function Attendance() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [attendance, setAttendance] = useState<TempleAttendanceRecord[]>(seedAttendanceRecords);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(seedActivityLogs);

  const handleClockIn = useCallback((personId: string, time: string, location?: string) => {
    const person = templePersonnel.find(p => p.id === personId);
    if (!person) return;
    const today = format(new Date(), 'yyyy-MM-dd');

    setAttendance(prev => {
      const existing = prev.find(a => a.personId === personId && a.date === today);
      if (existing) {
        return prev.map(a => a.id === existing.id ? { ...a, status: 'present' as const, clockIn: time, checkStatus: 'on_time' as const, location } : a);
      }
      return [...prev, {
        id: `att-${personId}-${today}`,
        personId,
        personName: person.name,
        role: person.role,
        department: person.department,
        date: today,
        status: 'present' as const,
        clockIn: time,
        checkStatus: 'on_time' as const,
        shift: person.shift,
        dutyType: person.dutyType,
        location,
      }];
    });
  }, []);

  const handleClockOut = useCallback((personId: string, time: string) => {
    const today = format(new Date(), 'yyyy-MM-dd');
    setAttendance(prev => prev.map(a =>
      a.personId === personId && a.date === today ? { ...a, clockOut: time } : a
    ));
  }, []);

  const handleMarkAttendance = useCallback((personId: string, date: string, status: TempleAttendanceRecord['status'], remarks?: string) => {
    const person = templePersonnel.find(p => p.id === personId);
    if (!person) return;
    setAttendance(prev => {
      const existing = prev.find(a => a.personId === personId && a.date === date);
      if (existing) {
        return prev.map(a => a.id === existing.id ? { ...a, status, remarks } : a);
      }
      return [...prev, {
        id: `att-${personId}-${date}`,
        personId,
        personName: person.name,
        role: person.role,
        department: person.department,
        date,
        status,
        shift: person.shift,
        dutyType: person.dutyType,
        remarks,
      }];
    });
  }, []);

  const handleAddLog = useCallback((log: Omit<ActivityLog, 'id'>) => {
    setActivityLogs(prev => [{ ...log, id: `log-${Date.now()}` }, ...prev]);
  }, []);

  return (
    <div>
      <PageHeader
        title="Attendance Management"
        description="Manage daily attendance for priests, staff, and volunteers"
        breadcrumbs={[
          { label: 'Hub', href: '/hub' },
          { label: 'People / HR', href: '/temple/people' },
          { label: 'Attendance' },
        ]}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="flex-wrap">
          <TabsTrigger value="dashboard">Overview</TabsTrigger>
          <TabsTrigger value="daily">Daily Attendance</TabsTrigger>
          <TabsTrigger value="clock">Clock In/Out</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="policies">Temple Rules</TabsTrigger>
          <TabsTrigger value="corrections">Corrections</TabsTrigger>
          <TabsTrigger value="disciplinary">Activity Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="m-0">
          <AttendanceDashboard attendance={attendance} personnel={templePersonnel} />
        </TabsContent>

        <TabsContent value="daily" className="m-0">
          <DailyAttendance
            attendance={attendance}
            personnel={templePersonnel}
            onMarkAttendance={handleMarkAttendance}
          />
        </TabsContent>

        <TabsContent value="clock" className="m-0">
          <ClockInOut
            personnel={templePersonnel}
            attendance={attendance}
            onClockIn={handleClockIn}
            onClockOut={handleClockOut}
          />
        </TabsContent>

        <TabsContent value="reports" className="m-0">
          <AttendanceReports attendance={attendance} personnel={templePersonnel} />
        </TabsContent>

        <TabsContent value="policies" className="m-0">
          <AttendancePolicies />
        </TabsContent>

        <TabsContent value="corrections" className="m-0">
          <AttendanceCorrections />
        </TabsContent>

        <TabsContent value="disciplinary" className="m-0">
          <DisciplinaryActions
            logs={activityLogs}
            personnel={templePersonnel}
            onAddLog={handleAddLog}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
