import { useState, useMemo, useCallback } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Calendar, Sun, Moon, Star, AlertTriangle, Clock, ChevronLeft, ChevronRight, Sparkles, Plus, Pencil, Trash2, X } from 'lucide-react';
import { format, addDays, subDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, getDay } from 'date-fns';
import { getPanchangEntries, getPanchangByDate, savePanchangEntry, deletePanchangEntry, type PanchangEntry } from '@/lib/panchang-store';
import { toast } from 'sonner';

// Options for dropdowns
const tithiOptions = ['Prathama', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami', 'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami', 'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima', 'Amavasya'];
const nakshatraOptions = ['Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashirsha', 'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha', 'Moola', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'];
const yogaOptions = ['Vishkambha', 'Preeti', 'Ayushman', 'Saubhagya', 'Shobhana', 'Atiganda', 'Sukarma', 'Dhriti', 'Shoola', 'Ganda', 'Vriddhi', 'Dhruva', 'Vyaghata', 'Harshana', 'Vajra', 'Siddhi', 'Vyatipata', 'Variyan', 'Parigha', 'Shiva', 'Siddha', 'Sadhya', 'Shubha', 'Shukla', 'Brahma', 'Indra', 'Vaidhriti'];
const karanaOptions = ['Bava', 'Balava', 'Kaulava', 'Taitila', 'Garija', 'Vanija', 'Vishti', 'Shakuni', 'Chatushpada', 'Naga', 'Kimstughna'];
const masaOptions = ['Chaitra', 'Vaishakha', 'Jyeshtha', 'Ashadha', 'Shravana', 'Bhadrapada', 'Ashwin', 'Kartik', 'Margashirsha', 'Pausha', 'Magha', 'Phalguna'];
const samvatsaraOptions = ['Prabhava', 'Vibhava', 'Shukla', 'Pramoda', 'Prajapati', 'Angirasa', 'Shrimukha', 'Bhava', 'Yuva', 'Dhatri'];

// Fallback generator for dates without manual entries
function generateFallbackPanchang(date: Date) {
  const dateStr = format(date, 'yyyy-MM-dd');
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000);
  return {
    date: dateStr,
    tithi: tithiOptions[dayOfYear % tithiOptions.length],
    nakshatra: nakshatraOptions[dayOfYear % nakshatraOptions.length],
    yoga: yogaOptions[dayOfYear % yogaOptions.length],
    karana: karanaOptions[dayOfYear % karanaOptions.length],
    rahukalam: ['07:30-09:00', '09:00-10:30', '12:00-13:30', '15:00-16:30', '13:30-15:00', '10:30-12:00', '16:30-18:00'][getDay(date)],
    yamagandam: ['10:30-12:00', '07:30-09:00', '09:00-10:30', '12:00-13:30', '15:00-16:30', '13:30-15:00', '07:30-09:00'][getDay(date)],
    gulikakalam: ['13:30-15:00', '12:00-13:30', '10:30-12:00', '09:00-10:30', '07:30-09:00', '16:30-18:00', '15:00-16:30'][getDay(date)],
    sunrise: '06:12',
    sunset: '18:25',
    moonrise: `${17 + (dayOfYear % 6)}:${String(dayOfYear % 60).padStart(2, '0')}`,
    moonset: '05:30',
    abhijitMuhurta: '11:48-12:36',
    amritKalam: '02:15-03:45',
    paksha: (dayOfYear % 30 < 15 ? 'Shukla' : 'Krishna') as 'Shukla' | 'Krishna',
    masa: masaOptions[date.getMonth() % masaOptions.length],
    samvatsara: samvatsaraOptions[0],
    isAuspicious: dayOfYear % 7 === 0,
    specialDay: '',
    festivals: [] as string[],
    notes: '',
    isManual: false,
  };
}

const emptyForm = (date: string): Omit<PanchangEntry, 'createdAt' | 'updatedAt'> => ({
  id: crypto.randomUUID(),
  date,
  tithi: tithiOptions[0],
  nakshatra: nakshatraOptions[0],
  yoga: yogaOptions[0],
  karana: karanaOptions[0],
  paksha: 'Shukla',
  masa: masaOptions[0],
  samvatsara: samvatsaraOptions[0],
  sunrise: '06:12',
  sunset: '18:25',
  moonrise: '17:30',
  moonset: '05:30',
  rahukalam: '07:30-09:00',
  yamagandam: '10:30-12:00',
  gulikakalam: '13:30-15:00',
  abhijitMuhurta: '11:48-12:36',
  amritKalam: '02:15-03:45',
  isAuspicious: false,
  specialDay: '',
  festivals: [],
  notes: '',
});

export default function Panchang() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'day' | 'month'>('day');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [festivalInput, setFestivalInput] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  const dateStr = format(selectedDate, 'yyyy-MM-dd');

  const [form, setForm] = useState<Omit<PanchangEntry, 'createdAt' | 'updatedAt'>>(emptyForm(dateStr));

  const manualEntry = useMemo(() => getPanchangByDate(dateStr), [dateStr, refreshKey]);

  const panchang = useMemo(() => {
    if (manualEntry) return { ...manualEntry, isManual: true };
    return generateFallbackPanchang(selectedDate);
  }, [manualEntry, selectedDate]);

  const monthDays = useMemo(() => {
    const start = startOfMonth(selectedDate);
    const end = endOfMonth(selectedDate);
    return eachDayOfInterval({ start, end }).map(d => {
      const ds = format(d, 'yyyy-MM-dd');
      const manual = getPanchangByDate(ds);
      return {
        date: d,
        panchang: manual ? { ...manual, isManual: true } : generateFallbackPanchang(d),
      };
    });
  }, [selectedDate, refreshKey]);

  const openAdd = useCallback(() => {
    if (manualEntry) {
      const { createdAt, updatedAt, ...rest } = manualEntry;
      setForm(rest);
    } else {
      const fallback = generateFallbackPanchang(selectedDate);
      setForm({
        id: crypto.randomUUID(),
        date: dateStr,
        tithi: fallback.tithi,
        nakshatra: fallback.nakshatra,
        yoga: fallback.yoga,
        karana: fallback.karana,
        paksha: fallback.paksha,
        masa: fallback.masa,
        samvatsara: fallback.samvatsara,
        sunrise: fallback.sunrise,
        sunset: fallback.sunset,
        moonrise: fallback.moonrise,
        moonset: fallback.moonset,
        rahukalam: fallback.rahukalam,
        yamagandam: fallback.yamagandam,
        gulikakalam: fallback.gulikakalam,
        abhijitMuhurta: fallback.abhijitMuhurta,
        amritKalam: fallback.amritKalam,
        isAuspicious: fallback.isAuspicious,
        specialDay: fallback.specialDay,
        festivals: fallback.festivals,
        notes: fallback.notes,
      });
    }
    setFestivalInput('');
    setDialogOpen(true);
  }, [manualEntry, selectedDate, dateStr]);

  const handleSave = () => {
    savePanchangEntry({
      ...form,
      createdAt: manualEntry?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    setRefreshKey(k => k + 1);
    setDialogOpen(false);
    toast.success(manualEntry ? 'Panchang updated' : 'Panchang added');
  };

  const handleDelete = () => {
    if (manualEntry) {
      deletePanchangEntry(manualEntry.id);
      setRefreshKey(k => k + 1);
      toast.success('Manual entry deleted, showing auto-generated data');
    }
  };

  const addFestival = () => {
    const val = festivalInput.trim();
    if (val && !form.festivals.includes(val)) {
      setForm(f => ({ ...f, festivals: [...f.festivals, val] }));
      setFestivalInput('');
    }
  };

  const removeFestival = (name: string) => {
    setForm(f => ({ ...f, festivals: f.festivals.filter(x => x !== name) }));
  };

  const updateField = (key: string, value: any) => setForm(f => ({ ...f, [key]: value }));

  return (
    <div>
      <PageHeader
        title="Panchang"
        description="Hindu calendar with daily details — Tithi, Nakshatra, Rahukalam & auspicious timings"
        actions={
          <div className="flex gap-2">
            <Button size="sm" variant={viewMode === 'day' ? 'default' : 'outline'} onClick={() => setViewMode('day')}>Day View</Button>
            <Button size="sm" variant={viewMode === 'month' ? 'default' : 'outline'} onClick={() => setViewMode('month')}>Month View</Button>
            <Button size="sm" onClick={openAdd} className="gap-1.5">
              {manualEntry ? <Pencil className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
              {manualEntry ? 'Edit Panchang' : 'Add Panchang'}
            </Button>
          </div>
        }
      />

      {/* Date Navigation */}
      <div className="flex items-center justify-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => setSelectedDate(prev => viewMode === 'day' ? subDays(prev, 1) : new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div className="text-center">
          <p className="text-lg font-semibold text-foreground">
            {viewMode === 'day' ? format(selectedDate, 'EEEE, dd MMMM yyyy') : format(selectedDate, 'MMMM yyyy')}
          </p>
          <div className="flex items-center justify-center gap-2 mt-1">
            {viewMode === 'day' && panchang.specialDay && (
              <Badge className="bg-amber-100 text-amber-800 border-amber-300">
                <Sparkles className="h-3 w-3 mr-1" />{panchang.specialDay}
              </Badge>
            )}
            {viewMode === 'day' && (panchang as any).isManual && (
              <Badge variant="outline" className="text-xs border-primary text-primary">Manual Entry</Badge>
            )}
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setSelectedDate(prev => viewMode === 'day' ? addDays(prev, 1) : new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}>
          <ChevronRight className="h-5 w-5" />
        </Button>
        {!isToday(selectedDate) && (
          <Button size="sm" variant="outline" onClick={() => setSelectedDate(new Date())}>Today</Button>
        )}
      </div>

      {viewMode === 'day' ? (
        <div className="space-y-4">
          {/* Hindu Calendar Info */}
          {(panchang as any).paksha && (
            <div className="flex flex-wrap gap-3 text-sm">
              <Badge variant="secondary">Paksha: {(panchang as any).paksha}</Badge>
              <Badge variant="secondary">Masa: {(panchang as any).masa}</Badge>
              <Badge variant="secondary">Samvatsara: {(panchang as any).samvatsara}</Badge>
            </div>
          )}

          {/* Main Panchang Details */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Tithi', value: panchang.tithi, icon: Moon, color: 'text-indigo-500' },
              { label: 'Nakshatra', value: panchang.nakshatra, icon: Star, color: 'text-amber-500' },
              { label: 'Yoga', value: panchang.yoga, icon: Sun, color: 'text-orange-500' },
              { label: 'Karana', value: panchang.karana, icon: Calendar, color: 'text-primary' },
            ].map(item => (
              <Card key={item.label} className={panchang.isAuspicious ? 'border-amber-300 bg-amber-50/30' : ''}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <item.icon className={`h-4 w-4 ${item.color}`} />
                    <p className="text-xs text-muted-foreground font-medium uppercase">{item.label}</p>
                  </div>
                  <p className="text-lg font-semibold text-foreground">{item.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Sun & Moon Times */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Sun className="h-4 w-4 text-orange-500" />Sun Timings</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Sunrise</span><span className="font-medium text-foreground">{panchang.sunrise}</span></div>
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Sunset</span><span className="font-medium text-foreground">{panchang.sunset}</span></div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Moon className="h-4 w-4 text-indigo-500" />Moon</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Moonrise</span><span className="font-medium text-foreground">{panchang.moonrise}</span></div>
                {(panchang as any).moonset && <div className="flex justify-between text-sm"><span className="text-muted-foreground">Moonset</span><span className="font-medium text-foreground">{(panchang as any).moonset}</span></div>}
              </CardContent>
            </Card>
          </div>

          {/* Auspicious Timings */}
          {((panchang as any).abhijitMuhurta || (panchang as any).amritKalam) && (
            <Card className="border-green-200">
              <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Sparkles className="h-4 w-4 text-green-600" />Auspicious Timings</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(panchang as any).abhijitMuhurta && (
                    <div className="bg-green-50/50 rounded-lg p-3 border border-green-100">
                      <p className="text-xs text-muted-foreground font-medium">Abhijit Muhurta</p>
                      <p className="text-base font-semibold text-green-700 flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" />{(panchang as any).abhijitMuhurta}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">Best for important activities</p>
                    </div>
                  )}
                  {(panchang as any).amritKalam && (
                    <div className="bg-green-50/50 rounded-lg p-3 border border-green-100">
                      <p className="text-xs text-muted-foreground font-medium">Amrit Kalam</p>
                      <p className="text-base font-semibold text-green-700 flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" />{(panchang as any).amritKalam}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">Highly auspicious period</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Inauspicious Timings */}
          <Card className="border-red-200">
            <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-destructive" />Inauspicious Timings</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: 'Rahukalam', value: panchang.rahukalam, desc: 'Avoid important activities' },
                  { label: 'Yamagandam', value: panchang.yamagandam, desc: 'Not ideal for new ventures' },
                  { label: 'Gulika Kalam', value: panchang.gulikakalam, desc: 'Avoid auspicious tasks' },
                ].map(t => (
                  <div key={t.label} className="bg-red-50/50 rounded-lg p-3 border border-red-100">
                    <p className="text-xs text-muted-foreground font-medium">{t.label}</p>
                    <p className="text-base font-semibold text-destructive flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" />{t.value}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{t.desc}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Festivals */}
          {panchang.festivals && panchang.festivals.length > 0 && (
            <Card className="border-amber-300 bg-amber-50/20">
              <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Sparkles className="h-4 w-4 text-amber-500" />Festivals & Events</CardTitle></CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {panchang.festivals.map(f => (
                    <Badge key={f} className="bg-amber-100 text-amber-800 border-amber-300">{f}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notes */}
          {(panchang as any).notes && (
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Notes</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground">{(panchang as any).notes}</p></CardContent>
            </Card>
          )}

          {/* Delete manual entry */}
          {(panchang as any).isManual && (
            <div className="flex justify-end">
              <Button variant="outline" size="sm" className="text-destructive gap-1.5" onClick={handleDelete}>
                <Trash2 className="h-3.5 w-3.5" />Delete Manual Entry
              </Button>
            </div>
          )}
        </div>
      ) : (
        /* Month View */
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-7 gap-1">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                <div key={d} className="text-center text-xs font-medium text-muted-foreground py-2">{d}</div>
              ))}
              {Array.from({ length: getDay(startOfMonth(selectedDate)) }).map((_, i) => (
                <div key={`pad-${i}`} />
              ))}
              {monthDays.map(({ date, panchang: p }) => (
                <button
                  key={format(date, 'yyyy-MM-dd')}
                  onClick={() => { setSelectedDate(date); setViewMode('day'); }}
                  className={`
                    p-1.5 rounded-lg text-left transition-colors hover:bg-muted/50 min-h-[72px] border
                    ${isToday(date) ? 'border-primary bg-primary/5' : 'border-transparent'}
                    ${isSameDay(date, selectedDate) ? 'ring-2 ring-primary' : ''}
                    ${p.isAuspicious ? 'bg-amber-50/40' : ''}
                  `}
                >
                  <div className="flex items-center gap-1">
                    <p className={`text-sm font-medium ${isToday(date) ? 'text-primary' : 'text-foreground'}`}>
                      {format(date, 'd')}
                    </p>
                    {(p as any).isManual && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
                  </div>
                  <p className="text-[9px] text-muted-foreground truncate">{p.tithi}</p>
                  <p className="text-[9px] text-muted-foreground truncate">{p.nakshatra}</p>
                  {p.specialDay && <Sparkles className="h-3 w-3 text-amber-500 mt-0.5" />}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Panchang Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{manualEntry ? 'Edit' : 'Add'} Panchang — {format(selectedDate, 'dd MMM yyyy')}</DialogTitle>
          </DialogHeader>

          <div className="space-y-5">
            {/* Core Details */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3">Core Details</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Tithi</Label>
                  <Select value={form.tithi} onValueChange={v => updateField('tithi', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{tithiOptions.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Nakshatra</Label>
                  <Select value={form.nakshatra} onValueChange={v => updateField('nakshatra', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{nakshatraOptions.map(n => <SelectItem key={n} value={n}>{n}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Yoga</Label>
                  <Select value={form.yoga} onValueChange={v => updateField('yoga', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{yogaOptions.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Karana</Label>
                  <Select value={form.karana} onValueChange={v => updateField('karana', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{karanaOptions.map(k => <SelectItem key={k} value={k}>{k}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Separator />

            {/* Hindu Calendar */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3">Hindu Calendar</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label>Paksha</Label>
                  <Select value={form.paksha} onValueChange={v => updateField('paksha', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Shukla">Shukla (Bright)</SelectItem>
                      <SelectItem value="Krishna">Krishna (Dark)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Masa (Month)</Label>
                  <Select value={form.masa} onValueChange={v => updateField('masa', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{masaOptions.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Samvatsara</Label>
                  <Select value={form.samvatsara} onValueChange={v => updateField('samvatsara', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{samvatsaraOptions.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Separator />

            {/* Timings */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3">Sun & Moon Timings</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { key: 'sunrise', label: 'Sunrise' },
                  { key: 'sunset', label: 'Sunset' },
                  { key: 'moonrise', label: 'Moonrise' },
                  { key: 'moonset', label: 'Moonset' },
                ].map(f => (
                  <div key={f.key} className="space-y-1.5">
                    <Label>{f.label}</Label>
                    <Input type="time" value={(form as any)[f.key]} onChange={e => updateField(f.key, e.target.value)} />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3">Inauspicious Timings</h4>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { key: 'rahukalam', label: 'Rahukalam' },
                  { key: 'yamagandam', label: 'Yamagandam' },
                  { key: 'gulikakalam', label: 'Gulika Kalam' },
                ].map(f => (
                  <div key={f.key} className="space-y-1.5">
                    <Label>{f.label}</Label>
                    <Input placeholder="HH:MM-HH:MM" value={(form as any)[f.key]} onChange={e => updateField(f.key, e.target.value)} />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3">Auspicious Timings</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Abhijit Muhurta</Label>
                  <Input placeholder="HH:MM-HH:MM" value={form.abhijitMuhurta} onChange={e => updateField('abhijitMuhurta', e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>Amrit Kalam</Label>
                  <Input placeholder="HH:MM-HH:MM" value={form.amritKalam} onChange={e => updateField('amritKalam', e.target.value)} />
                </div>
              </div>
            </div>

            <Separator />

            {/* Special Day & Festivals */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3">Special Day & Festivals</h4>
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label>Special Day Name</Label>
                  <Input placeholder="e.g., Ram Navami, Purnima" value={form.specialDay} onChange={e => updateField('specialDay', e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>Festivals</Label>
                  <div className="flex gap-2">
                    <Input placeholder="Add festival name" value={festivalInput} onChange={e => setFestivalInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addFestival())} />
                    <Button type="button" size="sm" variant="outline" onClick={addFestival}>Add</Button>
                  </div>
                  {form.festivals.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {form.festivals.map(f => (
                        <Badge key={f} className="bg-amber-100 text-amber-800 border-amber-300 gap-1">
                          {f}
                          <button onClick={() => removeFestival(f)}><X className="h-3 w-3" /></button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <Switch checked={form.isAuspicious} onCheckedChange={v => updateField('isAuspicious', v)} />
                  <Label>Mark as Auspicious Day</Label>
                </div>
              </div>
            </div>

            <Separator />

            {/* Notes */}
            <div className="space-y-1.5">
              <Label>Notes</Label>
              <Textarea placeholder="Additional notes or instructions for this day..." value={form.notes} onChange={e => updateField('notes', e.target.value)} rows={3} />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{manualEntry ? 'Update' : 'Save'} Panchang</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
