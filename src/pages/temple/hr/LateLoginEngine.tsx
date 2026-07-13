import { useMemo, useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Save, Play, AlertTriangle } from 'lucide-react';
import {
  lateLoginConfig as initial,
  updateLateLoginConfig,
  evaluateLateLogin,
  type LateLoginConfig,
  type LateTier,
} from '@/data/hr-policy-groups';
import { toast } from 'sonner';

const penaltyOptions: { value: LateTier['penalty']; label: string }[] = [
  { value: 'warning', label: 'Warning' },
  { value: 'half_day', label: 'Half Day' },
  { value: 'loss_of_pay', label: 'Loss of Pay' },
  { value: 'none', label: 'None' },
];

const penaltyColor: Record<LateTier['penalty'], string> = {
  none: 'bg-emerald-100 text-emerald-800',
  warning: 'bg-amber-100 text-amber-800',
  half_day: 'bg-orange-100 text-orange-800',
  loss_of_pay: 'bg-red-100 text-red-800',
};

export default function LateLoginEngine() {
  const [cfg, setCfg] = useState<LateLoginConfig>(initial);
  const [simMin, setSimMin] = useState(0);
  const [holidayHours, setHolidayHours] = useState(8);

  const addTier = () => {
    const last = cfg.tiers[cfg.tiers.length - 1];
    const from = last ? last.toMin + 1 : 1;
    setCfg({
      ...cfg,
      tiers: [...cfg.tiers, { id: `t${Date.now()}`, fromMin: from, toMin: from + 30, penalty: 'warning', label: 'Late' }],
    });
  };
  const removeTier = (id: string) => setCfg({ ...cfg, tiers: cfg.tiers.filter(t => t.id !== id) });
  const updateTier = (id: string, patch: Partial<LateTier>) =>
    setCfg({ ...cfg, tiers: cfg.tiers.map(t => t.id === id ? { ...t, ...patch } : t) });

  const save = () => {
    updateLateLoginConfig(cfg);
    toast.success('Late-login engine saved. Applied on next attendance run.');
  };

  const simResult = useMemo(() => evaluateLateLogin(simMin, cfg), [simMin, cfg]);

  const holidayResult = useMemo(() => {
    const { mode, compOffMultiplier, overtimeMultiplier } = cfg.holidayWorked;
    const compOffDays = (holidayHours / 8) * compOffMultiplier;
    const otHours = holidayHours * overtimeMultiplier;
    if (mode === 'comp_off') return { line: `${compOffDays.toFixed(2)} day(s) Comp-Off credited` };
    if (mode === 'double_pay') return { line: `${otHours} hrs paid @ ${overtimeMultiplier}× regular` };
    return { line: `Employee chooses: ${compOffDays.toFixed(2)} day Comp-Off OR ${otHours} hrs @ ${overtimeMultiplier}× pay` };
  }, [cfg.holidayWorked, holidayHours]);

  return (
    <div className="space-y-4">
      <PageHeader
        title="Late-Login Grace Engine"
        description="Configure grace period, late-arrival penalty tiers, and holiday-worked compensation. Applied globally in Daily Attendance."
        actions={<Button onClick={save}><Save className="h-4 w-4 mr-2" />Save</Button>}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Grace Period & Tiers</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label>Grace (minutes)</Label>
                <Input type="number" min={0} value={cfg.graceMinutes}
                  onChange={e => setCfg({ ...cfg, graceMinutes: +e.target.value })} />
              </div>
              <div>
                <Label>Auto-Absent After (min)</Label>
                <Input type="number" min={0} value={cfg.autoMarkAbsentAfterMin}
                  onChange={e => setCfg({ ...cfg, autoMarkAbsentAfterMin: +e.target.value })} />
              </div>
              <div className="flex flex-col justify-end">
                <div className="flex items-center gap-2 pb-2">
                  <Switch checked={cfg.strictForPriests}
                    onCheckedChange={v => setCfg({ ...cfg, strictForPriests: v })} />
                  <Label className="cursor-pointer">Zero-tolerance for Priests</Label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Penalty Tiers (minutes past grace)</Label>
                <Button size="sm" variant="outline" onClick={addTier}><Plus className="h-3.5 w-3.5 mr-1" />Add Tier</Button>
              </div>
              <div className="space-y-2">
                {cfg.tiers.map(t => (
                  <div key={t.id} className="grid grid-cols-12 gap-2 items-end p-3 rounded-md border bg-muted/30">
                    <div className="col-span-2">
                      <Label className="text-xs">From (min)</Label>
                      <Input type="number" value={t.fromMin} onChange={e => updateTier(t.id, { fromMin: +e.target.value })} />
                    </div>
                    <div className="col-span-2">
                      <Label className="text-xs">To (min)</Label>
                      <Input type="number" value={t.toMin} onChange={e => updateTier(t.id, { toMin: +e.target.value })} />
                    </div>
                    <div className="col-span-3">
                      <Label className="text-xs">Penalty</Label>
                      <Select value={t.penalty} onValueChange={v => updateTier(t.id, { penalty: v as LateTier['penalty'] })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {penaltyOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-4">
                      <Label className="text-xs">Label</Label>
                      <Input value={t.label} onChange={e => updateTier(t.id, { label: e.target.value })} />
                    </div>
                    <div className="col-span-1 flex justify-end">
                      <Button size="icon" variant="ghost" onClick={() => removeTier(t.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><Play className="h-4 w-4" />Simulator</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label>Employee arrived (min late)</Label>
              <Input type="number" min={0} value={simMin} onChange={e => setSimMin(+e.target.value)} />
            </div>
            <div className="rounded-md border p-3 bg-muted/30 space-y-2 text-sm">
              <div>After grace: <b>{simResult.effective} min late</b></div>
              <div>Result: <span className={`px-2 py-0.5 rounded text-xs font-medium ${penaltyColor[simResult.penalty]}`}>{simResult.label}</span></div>
              {simResult.penalty === 'loss_of_pay' && (
                <div className="flex items-center gap-1 text-xs text-red-700">
                  <AlertTriangle className="h-3.5 w-3.5" /> Payroll deduction will apply
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Holiday-Worked Compensation</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label>Mode</Label>
              <Select value={cfg.holidayWorked.mode}
                onValueChange={v => setCfg({ ...cfg, holidayWorked: { ...cfg.holidayWorked, mode: v as any } })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="comp_off">Comp-Off only</SelectItem>
                  <SelectItem value="double_pay">Double Pay only</SelectItem>
                  <SelectItem value="both_choice">Employee chooses</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Comp-Off Multiplier</Label>
              <Input type="number" step={0.5} value={cfg.holidayWorked.compOffMultiplier}
                onChange={e => setCfg({ ...cfg, holidayWorked: { ...cfg.holidayWorked, compOffMultiplier: +e.target.value } })} />
            </div>
            <div>
              <Label>Overtime Pay Multiplier</Label>
              <Input type="number" step={0.5} value={cfg.holidayWorked.overtimeMultiplier}
                onChange={e => setCfg({ ...cfg, holidayWorked: { ...cfg.holidayWorked, overtimeMultiplier: +e.target.value } })} />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 items-end">
            <div>
              <Label>Simulate: hours worked on holiday</Label>
              <Input type="number" min={0} value={holidayHours} onChange={e => setHolidayHours(+e.target.value)} />
            </div>
            <div className="col-span-2 rounded-md border p-3 bg-muted/30 text-sm">
              <span className="text-muted-foreground">Result:</span> <b>{holidayResult.line}</b>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Holiday-worked flags automatically credit Comp-Off / overtime into payroll based on this configuration.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}