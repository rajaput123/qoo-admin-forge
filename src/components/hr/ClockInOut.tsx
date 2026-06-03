import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StatusBadge } from '@/components/ui/status-badge';
import { LogIn, LogOut, Clock, Search, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import type { TempleAttendanceRecord, TemplePerson } from '@/data/temple-attendance-data';
import { roleLabels, shiftLabels } from '@/data/temple-attendance-data';

interface Props {
  personnel: TemplePerson[];
  attendance: TempleAttendanceRecord[];
  onClockIn: (personId: string, time: string, location?: string) => void;
  onClockOut: (personId: string, time: string) => void;
}

export function ClockInOut({ personnel, attendance, onClockIn, onClockOut }: Props) {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const today = format(new Date(), 'yyyy-MM-dd');

  const activePersonnel = useMemo(() => {
    let list = personnel.filter(p => p.status === 'active');
    if (roleFilter !== 'all') list = list.filter(p => p.role === roleFilter);
    if (search) list = list.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    return list;
  }, [personnel, roleFilter, search]);

  const getPersonAttendance = (personId: string) =>
    attendance.find(a => a.personId === personId && a.date === today);

  const getStatus = (person: TemplePerson) => {
    const record = getPersonAttendance(person.id);
    if (!record || record.status === 'absent') return 'not_checked_in';
    if (record.clockIn && !record.clockOut) return 'checked_in';
    if (record.clockIn && record.clockOut) return 'checked_out';
    return 'not_checked_in';
  };

  const now = format(new Date(), 'HH:mm');

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by name..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="priest">Priests</SelectItem>
            <SelectItem value="staff">Staff</SelectItem>
            <SelectItem value="volunteer">Volunteers</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Time Display */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            <span className="text-lg font-semibold">{format(new Date(), 'hh:mm a')}</span>
            <span className="text-sm text-muted-foreground">• {format(new Date(), 'EEEE, dd MMMM yyyy')}</span>
          </div>
          <StatusBadge variant="success">{activePersonnel.length} Active</StatusBadge>
        </CardContent>
      </Card>

      {/* Personnel Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {activePersonnel.map(person => {
          const status = getStatus(person);
          const record = getPersonAttendance(person.id);

          return (
            <Card key={person.id} className={`transition-all ${status === 'checked_in' ? 'border-success/40 bg-success/5' : status === 'checked_out' ? 'border-muted bg-muted/30' : ''}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h4 className="font-medium">{person.name}</h4>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <StatusBadge variant={person.role === 'priest' ? 'primary' : person.role === 'staff' ? 'success' : 'warning'} className="text-[10px] px-1.5 py-0">
                        {roleLabels[person.role]}
                      </StatusBadge>
                      <span>{person.department}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{shiftLabels[person.shift]?.split('(')[0]?.trim()}</p>
                    {record?.clockIn && (
                      <div className="flex items-center gap-3 text-xs mt-1">
                        <span className="text-success">In: {record.clockIn}</span>
                        {record.clockOut && <span className="text-muted-foreground">Out: {record.clockOut}</span>}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-1">
                    {status === 'not_checked_in' && (
                      <Button size="sm" onClick={() => onClockIn(person.id, now, 'Temple Premises')} className="gap-1.5">
                        <LogIn className="h-3.5 w-3.5" />
                        Check In
                      </Button>
                    )}
                    {status === 'checked_in' && (
                      <Button size="sm" variant="outline" onClick={() => onClockOut(person.id, now)} className="gap-1.5">
                        <LogOut className="h-3.5 w-3.5" />
                        Check Out
                      </Button>
                    )}
                    {status === 'checked_out' && (
                      <StatusBadge variant="neutral" className="text-xs">Completed</StatusBadge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {activePersonnel.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No personnel found matching your search.
        </div>
      )}
    </div>
  );
}
