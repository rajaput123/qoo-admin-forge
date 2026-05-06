import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Plus, Radio, Eye, Clock, Play, Square, Pause, RotateCcw, X, Video, Calendar, Users, Timer } from "lucide-react";
import { toast } from "sonner";
import SelectWithAddNew from "@/components/SelectWithAddNew";
import CustomFieldsSection, { type CustomField } from "@/components/CustomFieldsSection";

type BroadcastStatus = "live" | "scheduled" | "completed" | "interrupted" | "cancelled";

interface Broadcast {
  id: string;
  title: string;
  purpose: string;
  structure: string;
  description: string;
  date: string;
  startTime: string;
  duration: string;
  platforms: string[];
  visibility: string;
  reminder: boolean;
  reminderTiming: string[];
  status: BroadcastStatus;
  viewers: number;
  actualDuration: string;
  daily: boolean;
}

const initialBroadcasts: Broadcast[] = [
  { id: "BRC-001", title: "Morning Abhishekam Live", purpose: "Daily Darshan", structure: "Main Sanctum", description: "", date: "Daily", startTime: "06:00", duration: "45 min", platforms: ["Temple App", "YouTube"], visibility: "Public", reminder: true, reminderTiming: ["15 min before"], status: "live", viewers: 1245, actualDuration: "32 min", daily: true },
  { id: "BRC-002", title: "Maha Shivaratri Night Puja", purpose: "Festival / Event", structure: "Main Temple", description: "Annual night-long puja broadcast", date: "2024-02-13", startTime: "20:00", duration: "3 hrs", platforms: ["YouTube", "Facebook"], visibility: "Public", reminder: true, reminderTiming: ["1 hour before", "15 min before"], status: "scheduled", viewers: 0, actualDuration: "-", daily: false },
  { id: "BRC-003", title: "Evening Aarti", purpose: "Daily Darshan", structure: "Main Sanctum", description: "", date: "Daily", startTime: "18:30", duration: "20 min", platforms: ["Temple App"], visibility: "Public", reminder: false, reminderTiming: [], status: "scheduled", viewers: 0, actualDuration: "-", daily: true },
  { id: "BRC-004", title: "Guru Discourse Series – Ep 12", purpose: "Discourse", structure: "Discourse Hall", description: "Weekly discourse by Head Priest", date: "2024-02-11", startTime: "10:00", duration: "90 min", platforms: ["YouTube"], visibility: "Members Only", reminder: true, reminderTiming: ["1 hour before"], status: "scheduled", viewers: 0, actualDuration: "-", daily: false },
  { id: "BRC-005", title: "Temple Heritage Walk", purpose: "Festival / Event", structure: "Full Campus", description: "Virtual heritage tour", date: "2024-02-05", startTime: "11:00", duration: "60 min", platforms: ["YouTube", "Facebook"], visibility: "Public", reminder: false, reminderTiming: [], status: "completed", viewers: 3420, actualDuration: "58 min", daily: false },
  { id: "BRC-006", title: "Sanctum Live View", purpose: "Daily Darshan", structure: "Main Sanctum", description: "Continuous darshan feed", date: "Daily", startTime: "05:00", duration: "Ongoing", platforms: ["Temple App"], visibility: "App Only", reminder: false, reminderTiming: [], status: "live", viewers: 432, actualDuration: "4h 12m", daily: true },
  { id: "BRC-007", title: "Noon Aarti", purpose: "Daily Darshan", structure: "Main Sanctum", description: "", date: "Daily", startTime: "12:00", duration: "15 min", platforms: ["Temple App"], visibility: "Public", reminder: false, reminderTiming: [], status: "completed", viewers: 312, actualDuration: "14 min", daily: true },
  { id: "BRC-008", title: "Emergency Flood Update", purpose: "Emergency", structure: "Main Temple", description: "Live update on temple flood situation", date: "2024-01-28", startTime: "09:00", duration: "30 min", platforms: ["YouTube", "Facebook", "Temple App"], visibility: "Public", reminder: false, reminderTiming: [], status: "completed", viewers: 5200, actualDuration: "42 min", daily: false },
  { id: "BRC-009", title: "Navratri Day 5 Special", purpose: "Festival / Event", structure: "Durga Shrine", description: "", date: "2024-02-15", startTime: "07:00", duration: "2 hrs", platforms: ["YouTube", "Temple App"], visibility: "Public", reminder: true, reminderTiming: ["1 hour before"], status: "cancelled", viewers: 0, actualDuration: "-", daily: false },
];

const statusConfig: Record<BroadcastStatus, { label: string; className: string }> = {
  live: { label: "● LIVE", className: "text-red-700 bg-red-50 border-red-200" },
  scheduled: { label: "Scheduled", className: "text-blue-700 bg-blue-50 border-blue-200" },
  completed: { label: "Completed", className: "text-green-700 bg-green-50 border-green-200" },
  interrupted: { label: "Interrupted", className: "text-orange-700 bg-orange-50 border-orange-200" },
  cancelled: { label: "Cancelled", className: "text-muted-foreground bg-muted border-border" },
};

const LiveBroadcast = () => {
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>(initialBroadcasts);
  const [selected, setSelected] = useState<Broadcast | null>(null);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [step, setStep] = useState(1);

  // Dynamic dropdown options
  const [purposes, setPurposes] = useState(["Daily Darshan", "Festival / Event", "Discourse", "Emergency"]);
  const [structures, setStructures] = useState(["Main Sanctum", "Main Temple", "Discourse Hall", "Durga Shrine", "Full Campus", "Hanuman Shrine"]);
  const [platformOptions, setPlatformOptions] = useState(["Temple App", "YouTube", "Facebook"]);
  const [visibilityOptions, setVisibilityOptions] = useState(["Public", "App Only", "Members Only"]);

  // Custom fields
  const [scheduleCustomFields, setScheduleCustomFields] = useState<CustomField[]>([]);
  const [detailCustomFields, setDetailCustomFields] = useState<CustomField[]>([]);

  // Schedule form state
  const [form, setForm] = useState({
    purpose: "", title: "", structure: "", description: "",
    daily: false, date: "", startTime: "", duration: "",
    platforms: [] as string[], reminder: false, reminderTiming: [] as string[],
    visibility: "Public",
  });

  const resetForm = () => {
    setForm({ purpose: "", title: "", structure: "", description: "", daily: false, date: "", startTime: "", duration: "", platforms: [], reminder: false, reminderTiming: [], visibility: "Public" });
    setStep(1);
    setScheduleCustomFields([]);
  };

  const liveBroadcasts = broadcasts.filter(b => b.status === "live");
  const todayScheduled = broadcasts.filter(b => b.status === "scheduled" && (b.daily || b.date === "2024-02-10"));
  const upcoming = broadcasts.filter(b => b.status === "scheduled" && !b.daily && b.date > "2024-02-10");
  const completed = broadcasts.filter(b => b.status === "completed" || b.status === "interrupted");
  const cancelled = broadcasts.filter(b => b.status === "cancelled");

  const handleStatusChange = (id: string, newStatus: BroadcastStatus) => {
    setBroadcasts(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
    const labels: Record<string, string> = { live: "started", completed: "ended", interrupted: "paused", cancelled: "cancelled" };
    toast.success(`Broadcast ${labels[newStatus] || newStatus}`);
    setSelected(null);
  };

  const togglePlatform = (p: string) => {
    setForm(prev => ({ ...prev, platforms: prev.platforms.includes(p) ? prev.platforms.filter(x => x !== p) : [...prev.platforms, p] }));
  };

  const toggleReminder = (t: string) => {
    setForm(prev => ({ ...prev, reminderTiming: prev.reminderTiming.includes(t) ? prev.reminderTiming.filter(x => x !== t) : [...prev.reminderTiming, t] }));
  };

  const handleSchedule = () => {
    const newBroadcast: Broadcast = {
      id: `BRC-${String(broadcasts.length + 1).padStart(3, "0")}`,
      ...form,
      status: "scheduled",
      viewers: 0,
      actualDuration: "-",
    };
    setBroadcasts(prev => [...prev, newBroadcast]);
    toast.success("Broadcast scheduled");
    setScheduleOpen(false);
    resetForm();
  };

  const canNext = () => {
    if (step === 1) return !!form.purpose;
    if (step === 2) return !!form.title && !!form.structure;
    if (step === 3) return !!form.startTime && !!form.duration && (form.daily || !!form.date);
    if (step === 4) return form.platforms.length > 0;
    return true;
  };

  const renderBroadcastCard = (b: Broadcast, showControls: "live" | "scheduled" | "past") => (
    <Card key={b.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelected(b)}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium truncate">{b.title}</span>
              <Badge variant="outline" className={statusConfig[b.status].className}>{statusConfig[b.status].label}</Badge>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span>{b.structure}</span>
              <span>{b.daily ? `Daily ${b.startTime}` : `${b.date} ${b.startTime}`}</span>
              <span>{b.platforms.join(", ")}</span>
              {b.status === "live" && <span className="text-foreground font-medium">{b.viewers.toLocaleString()} viewers</span>}
              {b.status === "live" && <span>{b.actualDuration} elapsed</span>}
              {showControls === "past" && b.viewers > 0 && <span>{b.viewers.toLocaleString()} viewers</span>}
              {showControls === "past" && b.actualDuration !== "-" && <span>{b.actualDuration}</span>}
            </div>
          </div>
          <div className="flex gap-1" onClick={e => e.stopPropagation()}>
            {showControls === "live" && (
              <>
                <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => handleStatusChange(b.id, "interrupted")} title="Pause"><Pause className="h-3.5 w-3.5" /></Button>
                <Button size="icon" variant="destructive" className="h-8 w-8" onClick={() => handleStatusChange(b.id, "completed")} title="End"><Square className="h-3.5 w-3.5" /></Button>
              </>
            )}
            {showControls === "scheduled" && (
              <>
                <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => handleStatusChange(b.id, "live")} title="Start Now"><Play className="h-3.5 w-3.5" /></Button>
                <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleStatusChange(b.id, "cancelled")} title="Cancel"><X className="h-3.5 w-3.5" /></Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Live Now", value: liveBroadcasts.length, icon: Radio, extra: "text-red-600" },
          { label: "Total Viewers", value: liveBroadcasts.reduce((s, b) => s + b.viewers, 0).toLocaleString(), icon: Eye },
          { label: "Today's Schedule", value: todayScheduled.length + liveBroadcasts.length, icon: Calendar },
          { label: "This Month", value: broadcasts.length, icon: Video },
        ].map(kpi => (
          <Card key={kpi.label}><CardContent className="p-4">
            <kpi.icon className={`h-5 w-5 mb-2 ${kpi.extra || "text-muted-foreground"}`} />
            <p className="text-2xl font-bold">{kpi.value}</p>
            <p className="text-xs text-muted-foreground">{kpi.label}</p>
          </CardContent></Card>
        ))}
      </div>

      {/* Schedule Button */}
      <div className="flex justify-end">
        <Dialog open={scheduleOpen} onOpenChange={(o) => { setScheduleOpen(o); if (!o) resetForm(); }}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-1" />Schedule Broadcast</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
            <DialogHeader><DialogTitle>Schedule Broadcast – Step {step} of 6</DialogTitle></DialogHeader>
            <div className="space-y-4">
              {step === 1 && (
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Select Purpose</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {purposes.map(p => (
                      <Card key={p} className={`cursor-pointer transition-colors ${form.purpose === p ? "border-primary bg-primary/5" : "hover:bg-muted/50"}`} onClick={() => setForm(prev => ({ ...prev, purpose: p, daily: p === "Daily Darshan" }))}>
                        <CardContent className="p-4 text-center">
                          <p className="text-sm font-medium">{p}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" className="w-full" onClick={() => {
                    const name = prompt("Enter new purpose:");
                    if (name?.trim()) setPurposes(p => [...p, name.trim()]);
                  }}>+ Add New Purpose</Button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-3">
                  <div><Label>Title</Label><Input value={form.title} onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))} placeholder="Broadcast title" /></div>
                  <div><Label>Linked Structure</Label>
                    <SelectWithAddNew value={form.structure} onValueChange={v => setForm(prev => ({ ...prev, structure: v }))} placeholder="Select structure" options={structures} onAddNew={v => setStructures(p => [...p, v])} />
                  </div>
                  <div><Label>Description (Optional)</Label><Textarea rows={2} value={form.description} onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))} placeholder="Brief description..." /></div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-3">
                  {form.purpose === "Daily Darshan" ? (
                    <>
                      <p className="text-sm text-muted-foreground">This is a daily recurring broadcast.</p>
                      <div><Label>Start Time</Label><Input type="time" value={form.startTime} onChange={e => setForm(prev => ({ ...prev, startTime: e.target.value }))} /></div>
                      <div><Label>Expected Duration</Label><Input value={form.duration} onChange={e => setForm(prev => ({ ...prev, duration: e.target.value }))} placeholder="e.g. 45 min" /></div>
                    </>
                  ) : (
                    <>
                      <div><Label>Date</Label><Input type="date" value={form.date} onChange={e => setForm(prev => ({ ...prev, date: e.target.value }))} /></div>
                      <div><Label>Start Time</Label><Input type="time" value={form.startTime} onChange={e => setForm(prev => ({ ...prev, startTime: e.target.value }))} /></div>
                      <div><Label>Expected Duration</Label><Input value={form.duration} onChange={e => setForm(prev => ({ ...prev, duration: e.target.value }))} placeholder="e.g. 2 hrs" /></div>
                    </>
                  )}
                </div>
              )}

              {step === 4 && (
                <div className="space-y-3">
                  <Label>Select Platforms (at least one)</Label>
                  {platformOptions.map(p => (
                    <div key={p} className="flex items-center gap-2">
                      <Checkbox checked={form.platforms.includes(p)} onCheckedChange={() => togglePlatform(p)} id={`plat-${p}`} />
                      <Label htmlFor={`plat-${p}`} className="cursor-pointer font-normal">{p}</Label>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" className="w-full" onClick={() => {
                    const name = prompt("Enter new platform:");
                    if (name?.trim()) setPlatformOptions(p => [...p, name.trim()]);
                  }}>+ Add New Platform</Button>
                </div>
              )}

              {step === 5 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Send Reminder</Label>
                    <Switch checked={form.reminder} onCheckedChange={v => setForm(prev => ({ ...prev, reminder: v, reminderTiming: v ? prev.reminderTiming : [] }))} />
                  </div>
                  {form.reminder && (
                    <div className="space-y-2 pl-1">
                      {["15 min before", "1 hour before"].map(t => (
                        <div key={t} className="flex items-center gap-2">
                          <Checkbox checked={form.reminderTiming.includes(t)} onCheckedChange={() => toggleReminder(t)} id={`rem-${t}`} />
                          <Label htmlFor={`rem-${t}`} className="cursor-pointer font-normal">{t}</Label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {step === 6 && (
                <div className="space-y-3">
                  <Label>Visibility</Label>
                  <SelectWithAddNew value={form.visibility} onValueChange={v => setForm(prev => ({ ...prev, visibility: v }))} options={visibilityOptions} onAddNew={v => setVisibilityOptions(p => [...p, v])} />
                  <Separator />
                  <div className="text-sm space-y-1">
                    <p><span className="text-muted-foreground">Purpose:</span> {form.purpose}</p>
                    <p><span className="text-muted-foreground">Title:</span> {form.title}</p>
                    <p><span className="text-muted-foreground">Structure:</span> {form.structure}</p>
                    <p><span className="text-muted-foreground">Timing:</span> {form.daily ? `Daily ${form.startTime}` : `${form.date} ${form.startTime}`} ({form.duration})</p>
                    <p><span className="text-muted-foreground">Platforms:</span> {form.platforms.join(", ")}</p>
                    <p><span className="text-muted-foreground">Reminder:</span> {form.reminder ? form.reminderTiming.join(", ") : "No"}</p>
                  </div>
                  <CustomFieldsSection fields={scheduleCustomFields} onFieldsChange={setScheduleCustomFields} />
                </div>
              )}

              <div className="flex justify-between pt-2">
                <Button variant="outline" size="sm" onClick={() => step > 1 ? setStep(step - 1) : setScheduleOpen(false)}>{step === 1 ? "Cancel" : "Back"}</Button>
                {step < 6 ? (
                  <Button size="sm" disabled={!canNext()} onClick={() => setStep(step + 1)}>Next</Button>
                ) : (
                  <Button size="sm" onClick={handleSchedule}>Schedule Broadcast</Button>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* LIVE NOW */}
      {liveBroadcasts.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold flex items-center gap-2"><Radio className="h-4 w-4 text-red-600" />Live Now</h3>
          <div className="grid gap-3">{liveBroadcasts.map(b => renderBroadcastCard(b, "live"))}</div>
        </div>
      )}

      {/* TODAY'S SCHEDULE */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold flex items-center gap-2"><Clock className="h-4 w-4" />Today's Schedule</h3>
        {todayScheduled.length > 0 ? (
          <div className="grid gap-3">{todayScheduled.map(b => renderBroadcastCard(b, "scheduled"))}</div>
        ) : (
          <Card><CardContent className="p-4 text-sm text-muted-foreground">No scheduled broadcasts for today.</CardContent></Card>
        )}
      </div>

      {/* UPCOMING */}
      {upcoming.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold flex items-center gap-2"><Calendar className="h-4 w-4" />Upcoming</h3>
          <div className="grid gap-3">{upcoming.map(b => renderBroadcastCard(b, "scheduled"))}</div>
        </div>
      )}

      {/* COMPLETED */}
      {(completed.length > 0 || cancelled.length > 0) && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold flex items-center gap-2"><Video className="h-4 w-4" />Completed</h3>
          <div className="grid gap-3">
            {completed.map(b => renderBroadcastCard(b, "past"))}
            {cancelled.map(b => renderBroadcastCard(b, "past"))}
          </div>
        </div>
      )}

      {/* Detail Modal */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Broadcast Details</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">ID:</span> <span className="font-mono">{selected.id}</span></div>
                <div><span className="text-muted-foreground">Status:</span> <Badge variant="outline" className={statusConfig[selected.status].className}>{statusConfig[selected.status].label}</Badge></div>
                <div><span className="text-muted-foreground">Purpose:</span> {selected.purpose}</div>
                <div><span className="text-muted-foreground">Structure:</span> {selected.structure}</div>
                <div><span className="text-muted-foreground">Schedule:</span> {selected.daily ? `Daily ${selected.startTime}` : `${selected.date} ${selected.startTime}`}</div>
                <div><span className="text-muted-foreground">Duration:</span> {selected.duration}</div>
                <div><span className="text-muted-foreground">Platforms:</span> {selected.platforms.join(", ")}</div>
                <div><span className="text-muted-foreground">Visibility:</span> {selected.visibility}</div>
                <div><span className="text-muted-foreground">Reminder:</span> {selected.reminder ? selected.reminderTiming.join(", ") : "None"}</div>
                <div><span className="text-muted-foreground">Viewers:</span> {selected.viewers > 0 ? selected.viewers.toLocaleString() : "-"}</div>
                {selected.actualDuration !== "-" && <div><span className="text-muted-foreground">Actual Duration:</span> {selected.actualDuration}</div>}
              </div>
              {selected.description && <p className="text-sm"><span className="text-muted-foreground">Description:</span> {selected.description}</p>}
              <CustomFieldsSection fields={detailCustomFields} onFieldsChange={setDetailCustomFields} />
              <Separator />
              <div className="flex gap-2 flex-wrap">
                {selected.status === "live" && (
                  <>
                    <Button size="sm" variant="outline" onClick={() => handleStatusChange(selected.id, "interrupted")}><Pause className="h-3.5 w-3.5 mr-1" />Pause</Button>
                    <Button size="sm" variant="destructive" onClick={() => handleStatusChange(selected.id, "completed")}><Square className="h-3.5 w-3.5 mr-1" />End Broadcast</Button>
                  </>
                )}
                {selected.status === "interrupted" && (
                  <Button size="sm" onClick={() => handleStatusChange(selected.id, "live")}><RotateCcw className="h-3.5 w-3.5 mr-1" />Restart</Button>
                )}
                {selected.status === "scheduled" && (
                  <>
                    <Button size="sm" onClick={() => handleStatusChange(selected.id, "live")}><Play className="h-3.5 w-3.5 mr-1" />Start Now</Button>
                    <Button size="sm" variant="outline" onClick={() => handleStatusChange(selected.id, "cancelled")}><X className="h-3.5 w-3.5 mr-1" />Cancel</Button>
                  </>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LiveBroadcast;