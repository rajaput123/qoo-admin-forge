import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Radio, Calendar as CalendarIcon, Sparkles, Repeat, Smartphone, Cctv, Camera, Webcam, MonitorPlay,
  Wifi, Battery, QrCode, Copy, CheckCircle2, AlertTriangle, ArrowLeft, ArrowRight, Play,
  Mic, Video as VideoIcon, Signal, Gauge, ImagePlus, MessageSquare, HandCoins, Bell, CircleDot,
  Users, Clock, Square, RefreshCw, MicOff, Flag, Heart, Layout, Building2, TrendingUp
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

type StreamType = "now" | "schedule" | "festival" | "recurring";
type SourceType = "mobile" | "ip" | "dslr" | "webcam" | "cctv";

const STREAM_TYPES: {
  id: StreamType; title: string; desc: string; eta: string; icon: any; cta: string; tone: string;
}[] = [
  { id: "now", title: "Go Live Now", desc: "Start streaming darshan instantly to all devotees.", eta: "Under 2 minutes", icon: Radio, cta: "Start Now", tone: "from-orange-500 to-amber-500" },
  { id: "schedule", title: "Schedule Darshan", desc: "Plan a live broadcast for a specific date and time.", eta: "5 minutes setup", icon: CalendarIcon, cta: "Schedule", tone: "from-amber-500 to-yellow-500" },
  { id: "festival", title: "Festival Event Stream", desc: "Multi-camera grand event with sponsors and banners.", eta: "10 minutes setup", icon: Sparkles, cta: "Setup Festival", tone: "from-rose-500 to-orange-500" },
  { id: "recurring", title: "Daily Recurring Pooja", desc: "Auto-stream daily aarti and rituals at fixed times.", eta: "One-time setup", icon: Repeat, cta: "Configure", tone: "from-yellow-500 to-orange-500" },
];

const SOURCES: { id: SourceType; name: string; icon: any; difficulty: string; signal: number; status: "ready" | "available" | "offline" }[] = [
  { id: "mobile", name: "Mobile Camera", icon: Smartphone, difficulty: "Easiest", signal: 4, status: "ready" },
  { id: "ip", name: "IP Camera", icon: Cctv, difficulty: "Easy", signal: 3, status: "available" },
  { id: "dslr", name: "DSLR via OBS", icon: Camera, difficulty: "Advanced", signal: 4, status: "available" },
  { id: "webcam", name: "Webcam", icon: Webcam, difficulty: "Easy", signal: 3, status: "available" },
  { id: "cctv", name: "CCTV Feed", icon: MonitorPlay, difficulty: "Medium", signal: 2, status: "offline" },
];

const STEPS = ["Type", "Camera", "Configure", "Test", "Go Live"];

/* -------------------- Small UI helpers -------------------- */

const StepBar = ({ step }: { step: number }) => (
  <div className="flex items-center gap-2 sm:gap-3">
    {STEPS.map((label, i) => {
      const active = i === step;
      const done = i < step;
      return (
        <div key={label} className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
          <div className={cn(
            "h-9 w-9 rounded-full grid place-items-center text-sm font-semibold shrink-0 transition-all",
            done && "bg-orange-500 text-white",
            active && "bg-orange-500 text-white ring-4 ring-orange-200",
            !done && !active && "bg-orange-50 text-orange-400 border border-orange-100"
          )}>
            {done ? <CheckCircle2 className="h-5 w-5" /> : i + 1}
          </div>
          <span className={cn("text-sm font-medium hidden md:inline truncate", active ? "text-orange-700" : "text-muted-foreground")}>{label}</span>
          {i < STEPS.length - 1 && <div className={cn("h-[2px] flex-1 rounded-full", done ? "bg-orange-400" : "bg-orange-100")} />}
        </div>
      );
    })}
  </div>
);

const SignalBars = ({ value }: { value: number }) => (
  <div className="flex items-end gap-0.5 h-4">
    {[1, 2, 3, 4].map(i => (
      <div key={i} className={cn("w-1 rounded-sm", i <= value ? "bg-emerald-500" : "bg-muted")} style={{ height: `${i * 25}%` }} />
    ))}
  </div>
);

const LivePreview = ({ small = false, label = "Sanctum Camera" }: { small?: boolean; label?: string }) => (
  <div className={cn("relative rounded-2xl overflow-hidden bg-gradient-to-br from-amber-900 via-orange-800 to-rose-900", small ? "aspect-video" : "aspect-video")}>
    <div className="absolute inset-0 opacity-40 mix-blend-overlay" style={{
      backgroundImage: "radial-gradient(circle at 30% 40%, hsl(45 100% 70%) 0%, transparent 50%), radial-gradient(circle at 70% 60%, hsl(20 100% 60%) 0%, transparent 50%)"
    }} />
    <div className="absolute inset-0 grid place-items-center">
      <div className="text-center text-white/90">
        <div className="text-5xl mb-2">🕉️</div>
        <div className="text-xs uppercase tracking-[0.3em] opacity-80">{label}</div>
      </div>
    </div>
    <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">
      <CircleDot className="h-3 w-3 animate-pulse" /> PREVIEW
    </div>
  </div>
);

/* -------------------- Step Screens -------------------- */

const TypeStep = ({ onPick }: { onPick: (t: StreamType) => void }) => (
  <div className="space-y-6">
    <div className="text-center max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold tracking-tight">How would you like to stream today?</h2>
      <p className="text-muted-foreground mt-2">Pick a starting point. You can change anything in the next steps.</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {STREAM_TYPES.map(t => {
        const Icon = t.icon;
        return (
          <button
            key={t.id}
            onClick={() => onPick(t.id)}
            className="group text-left rounded-3xl border bg-card hover:shadow-xl hover:-translate-y-1 transition-all p-6 relative overflow-hidden"
          >
            <div className={cn("absolute -top-10 -right-10 h-40 w-40 rounded-full opacity-10 bg-gradient-to-br", t.tone)} />
            <div className={cn("h-14 w-14 rounded-2xl grid place-items-center bg-gradient-to-br text-white shadow-lg", t.tone)}>
              <Icon className="h-7 w-7" />
            </div>
            <h3 className="text-xl font-bold mt-4">{t.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{t.desc}</p>
            <div className="flex items-center justify-between mt-5">
              <Badge variant="secondary" className="rounded-full"><Clock className="h-3 w-3 mr-1" />{t.eta}</Badge>
              <span className="text-orange-600 font-semibold text-sm group-hover:translate-x-1 transition-transform">
                {t.cta} →
              </span>
            </div>
          </button>
        );
      })}
    </div>
  </div>
);

const CameraStep = ({ source, setSource }: { source: SourceType | null; setSource: (s: SourceType) => void }) => {
  return (
    <div className="grid lg:grid-cols-[340px_1fr] gap-6">
      <div className="space-y-3">
        <div>
          <h2 className="text-xl font-bold">Connect a camera</h2>
          <p className="text-sm text-muted-foreground">Pick the device closest to your sanctum.</p>
        </div>
        {SOURCES.map(s => {
          const Icon = s.icon;
          const active = source === s.id;
          return (
            <button
              key={s.id}
              onClick={() => setSource(s.id)}
              disabled={s.status === "offline"}
              className={cn(
                "w-full text-left rounded-2xl border p-4 flex items-center gap-3 transition-all",
                active ? "border-orange-500 bg-orange-50/60 ring-2 ring-orange-200" : "hover:border-orange-200 hover:bg-orange-50/30",
                s.status === "offline" && "opacity-50 cursor-not-allowed"
              )}
            >
              <div className={cn("h-11 w-11 rounded-xl grid place-items-center", active ? "bg-orange-500 text-white" : "bg-orange-100 text-orange-600")}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm">{s.name}</div>
                <div className="text-xs text-muted-foreground">{s.difficulty} setup</div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <SignalBars value={s.signal} />
                <span className={cn("text-[10px] font-medium uppercase",
                  s.status === "ready" && "text-emerald-600",
                  s.status === "available" && "text-muted-foreground",
                  s.status === "offline" && "text-rose-500")}>{s.status}</span>
              </div>
            </button>
          );
        })}
      </div>
      <Card className="rounded-3xl border-orange-100">
        <CardContent className="p-6">
          {!source && (
            <div className="h-full min-h-[400px] grid place-items-center text-center">
              <div>
                <div className="h-20 w-20 rounded-full bg-orange-50 grid place-items-center mx-auto">
                  <VideoIcon className="h-9 w-9 text-orange-400" />
                </div>
                <p className="mt-4 font-medium">Select a device to begin</p>
                <p className="text-sm text-muted-foreground">We'll guide you step-by-step.</p>
              </div>
            </div>
          )}
          {source === "mobile" && <MobileSetup />}
          {source === "ip" && <IpCameraSetup />}
          {source === "dslr" && <DslrSetup />}
          {source === "webcam" && <WebcamSetup />}
          {source === "cctv" && <CctvSetup />}
        </CardContent>
      </Card>
    </div>
  );
};

const MobileSetup = () => (
  <div className="grid md:grid-cols-2 gap-6">
    <div>
      <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 rounded-full">Easiest setup</Badge>
      <h3 className="text-2xl font-bold mt-2">Use your mobile camera</h3>
      <p className="text-muted-foreground text-sm mt-1">Scan the QR code with the Temple Streaming app to pair instantly.</p>
      <div className="mt-5 p-5 rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100">
        <div className="bg-white p-3 rounded-xl inline-block shadow-sm">
          <div className="h-40 w-40 grid place-items-center bg-[conic-gradient(from_0deg,#000_0deg,#000_30deg,transparent_30deg,transparent_60deg,#000_60deg,#000_90deg,transparent_90deg,transparent_120deg,#000_120deg,#000_180deg)] rounded-md">
            <QrCode className="h-24 w-24 text-white drop-shadow" />
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-3">Pairing code: <span className="font-mono font-semibold text-foreground">DEV-7821</span></p>
      </div>
      <Button variant="outline" className="mt-4 w-full rounded-xl h-11"><Smartphone className="h-4 w-4 mr-2" />Open Temple Streaming App</Button>
    </div>
    <div className="space-y-4">
      <LivePreview label="Sanctum Mobile" />
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-3">
          <div className="flex items-center gap-2 text-emerald-700"><Battery className="h-4 w-4" /><span className="text-xs font-medium">Battery</span></div>
          <div className="text-2xl font-bold text-emerald-700 mt-1">87%</div>
        </div>
        <div className="rounded-xl bg-blue-50 border border-blue-100 p-3">
          <div className="flex items-center gap-2 text-blue-700"><Wifi className="h-4 w-4" /><span className="text-xs font-medium">Internet</span></div>
          <div className="text-2xl font-bold text-blue-700 mt-1">Strong</div>
        </div>
      </div>
      <div className="flex items-center gap-2 text-emerald-600 text-sm font-medium">
        <CheckCircle2 className="h-4 w-4" /> Device connected and ready
      </div>
    </div>
  </div>
);

const IpCameraSetup = () => {
  const [tested, setTested] = useState(false);
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-3">
        <h3 className="text-2xl font-bold">IP Camera details</h3>
        <p className="text-sm text-muted-foreground">Enter your camera's RTSP feed credentials.</p>
        <div className="space-y-3 mt-3">
          <div><Label>Camera Name</Label><Input placeholder="Garbhagriha Cam 1" className="h-11 rounded-xl" /></div>
          <div><Label>RTSP URL</Label><Input placeholder="rtsp://192.168.1.10:554/stream" className="h-11 rounded-xl font-mono text-sm" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Username</Label><Input placeholder="admin" className="h-11 rounded-xl" /></div>
            <div><Label>Password</Label><Input type="password" placeholder="••••••" className="h-11 rounded-xl" /></div>
          </div>
        </div>
        <div className="flex gap-2 pt-2">
          <Button onClick={() => { setTested(true); toast.success("Camera connected"); }} className="rounded-xl bg-orange-500 hover:bg-orange-600 h-11 flex-1">Test Connection</Button>
          <Button variant="outline" className="rounded-xl h-11">Preview</Button>
        </div>
      </div>
      <div className="space-y-3">
        {tested ? (
          <>
            <LivePreview label="IP Camera" />
            <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 flex items-center gap-3">
              <CheckCircle2 className="h-6 w-6 text-emerald-600" />
              <div><div className="font-semibold text-emerald-800">Connection successful</div><div className="text-xs text-emerald-700">1080p · 30fps · Stable</div></div>
            </div>
          </>
        ) : (
          <div className="aspect-video rounded-2xl border-2 border-dashed border-orange-200 grid place-items-center text-center text-muted-foreground">
            <div><Cctv className="h-10 w-10 mx-auto opacity-40" /><p className="text-sm mt-2">Test connection to see preview</p></div>
          </div>
        )}
      </div>
    </div>
  );
};

const DslrSetup = () => {
  const rtmp = "rtmp://stream.devalaya.com/live";
  const key = "tmpl_8x73-92qr-aaq2";
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <h3 className="text-2xl font-bold">Connect via OBS</h3>
        <p className="text-sm text-muted-foreground">Copy these into OBS → Settings → Stream.</p>
        <div className="rounded-2xl bg-muted/50 border p-4 space-y-3">
          <div>
            <Label className="text-xs uppercase tracking-wide text-muted-foreground">RTMP Server URL</Label>
            <div className="flex gap-2 mt-1">
              <Input readOnly value={rtmp} className="font-mono text-sm rounded-xl" />
              <Button size="icon" variant="outline" className="rounded-xl shrink-0" onClick={() => { navigator.clipboard.writeText(rtmp); toast.success("Copied"); }}><Copy className="h-4 w-4" /></Button>
            </div>
          </div>
          <div>
            <Label className="text-xs uppercase tracking-wide text-muted-foreground">Stream Key</Label>
            <div className="flex gap-2 mt-1">
              <Input readOnly value={key} type="password" className="font-mono text-sm rounded-xl" />
              <Button size="icon" variant="outline" className="rounded-xl shrink-0" onClick={() => { navigator.clipboard.writeText(key); toast.success("Copied"); }}><Copy className="h-4 w-4" /></Button>
            </div>
          </div>
        </div>
        <ol className="text-sm space-y-2 text-muted-foreground">
          <li><span className="font-semibold text-foreground">1.</span> Open OBS Studio on your computer</li>
          <li><span className="font-semibold text-foreground">2.</span> Settings → Stream → Service: Custom</li>
          <li><span className="font-semibold text-foreground">3.</span> Paste server & key above</li>
          <li><span className="font-semibold text-foreground">4.</span> Click Start Streaming in OBS</li>
        </ol>
      </div>
      <div>
        <div className="aspect-video rounded-2xl bg-gradient-to-br from-slate-900 to-slate-700 grid place-items-center text-center text-white/70">
          <div>
            <div className="h-14 w-14 rounded-full border-4 border-amber-300 border-t-transparent animate-spin mx-auto" />
            <p className="mt-4 font-medium">Waiting for OBS connection…</p>
            <p className="text-xs opacity-70">Once started, your DSLR feed appears here</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const WebcamSetup = () => (
  <div className="grid md:grid-cols-2 gap-6">
    <div>
      <h3 className="text-2xl font-bold">Browser Webcam</h3>
      <p className="text-sm text-muted-foreground">Allow camera access in your browser to begin.</p>
      <Button className="mt-4 rounded-xl bg-orange-500 hover:bg-orange-600 h-11"><Webcam className="h-4 w-4 mr-2" />Enable Webcam</Button>
    </div>
    <LivePreview label="Webcam" />
  </div>
);

const CctvSetup = () => (
  <div className="text-center py-12">
    <AlertTriangle className="h-10 w-10 text-amber-500 mx-auto" />
    <p className="mt-3 font-semibold">CCTV bridge offline</p>
    <p className="text-sm text-muted-foreground">Contact support to enable the CCTV gateway.</p>
  </div>
);

/* -------------------- Configure -------------------- */

const DAYS = ["S", "M", "T", "W", "T", "F", "S"];

const ConfigureStep = ({ schedule, setSchedule, type }: { schedule: Date | undefined; setSchedule: (d: Date | undefined) => void; type: StreamType | null }) => {
  const isSchedule = type === "schedule";
  const isRecurring = type === "recurring";
  const isFestival = type === "festival";
  const [days, setDays] = useState<number[]>([1, 2, 3, 4, 5, 6, 0]);
  const toggleDay = (d: number) => setDays(p => p.includes(d) ? p.filter(x => x !== d) : [...p, d]);
  return (
  <div className="grid lg:grid-cols-3 gap-6">
    <Card className="lg:col-span-2 rounded-3xl">
      <CardContent className="p-6 space-y-5">
        <div>
          <h2 className="text-xl font-bold">{isFestival ? "Festival stream details" : "Stream details"}</h2>
          <p className="text-sm text-muted-foreground">These help devotees find and trust your broadcast.</p>
        </div>
        <div>
          <Label>Stream Title</Label>
          <Input placeholder={isFestival ? "Maha Shivaratri — Grand Live Darshan" : "Sandhya Aarti — Live from Garbhagriha"} className="h-11 rounded-xl" />
        </div>
        <div>
          <Label>Description</Label>
          <Textarea placeholder="A brief blessing for devotees joining this aarti..." className="rounded-xl min-h-24" />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label>Language</Label>
            <Input defaultValue="Sanskrit + English" className="h-11 rounded-xl" />
          </div>
          <div>
            <Label>Visibility</Label>
            <Input defaultValue="Public" className="h-11 rounded-xl" />
          </div>
        </div>
        <div>
          <Label>Thumbnail</Label>
          <div className="mt-1 aspect-[16/6] rounded-2xl border-2 border-dashed border-orange-200 grid place-items-center text-muted-foreground hover:bg-orange-50/40 cursor-pointer">
            <div className="text-center"><ImagePlus className="h-7 w-7 mx-auto opacity-50" /><p className="text-sm mt-1">Drop image or click to upload</p></div>
          </div>
        </div>
        {isFestival && (
          <div className="space-y-4 pt-2 border-t">
            <div className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-rose-500" /><h3 className="font-bold">Festival mode</h3></div>
            <div>
              <Label>Event banner text</Label>
              <Input placeholder="Maha Shivaratri 2026 · Live from Sanctum" className="h-11 rounded-xl" />
            </div>
            <div>
              <Label className="mb-2 block">Multi-camera layout</Label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: "single", label: "Single", grid: "grid-cols-1" },
                  { id: "split", label: "Split (2)", grid: "grid-cols-2" },
                  { id: "quad", label: "Quad (4)", grid: "grid-cols-2 grid-rows-2" },
                ].map((l, i) => (
                  <button key={l.id} className={cn("rounded-2xl border-2 p-3 text-left transition-all", i === 1 ? "border-rose-500 bg-rose-50" : "border-muted hover:border-rose-200")}>
                    <div className={cn("grid gap-1 aspect-video", l.grid)}>
                      {Array.from({ length: l.id === "quad" ? 4 : l.id === "split" ? 2 : 1 }).map((_, k) => (
                        <div key={k} className="bg-gradient-to-br from-amber-400 to-rose-400 rounded" />
                      ))}
                    </div>
                    <div className="text-xs font-semibold mt-2">{l.label}</div>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label>Sponsor logos</Label>
              <div className="mt-1 rounded-2xl border-2 border-dashed border-rose-200 p-4 grid grid-cols-4 gap-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="aspect-square rounded-xl bg-rose-50 grid place-items-center text-xs text-rose-400 font-medium">Logo {i}</div>
                ))}
                <button className="aspect-square rounded-xl border-2 border-dashed border-rose-300 grid place-items-center text-rose-500 hover:bg-rose-50">
                  <ImagePlus className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="rounded-2xl bg-gradient-to-r from-amber-50 to-rose-50 border border-rose-100 p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-rose-500 grid place-items-center text-white"><TrendingUp className="h-5 w-5" /></div>
              <div className="flex-1"><div className="text-sm font-semibold">High-traffic mode</div><div className="text-xs text-muted-foreground">Auto-scale for 50,000+ concurrent devotees</div></div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between rounded-2xl border p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 grid place-items-center"><HandCoins className="h-5 w-5" /></div>
                <div><div className="text-sm font-semibold">Donation highlights</div><div className="text-xs text-muted-foreground">Show top donors live on screen</div></div>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
    <div className="space-y-5">
      <Card className="rounded-3xl">
        <CardContent className="p-6 space-y-4">
          <h3 className="font-bold">Stream features</h3>
          {[
            { icon: MessageSquare, label: "Live chat", desc: "Let devotees send blessings" },
            { icon: HandCoins, label: "Donations", desc: "Show donation panel" },
            { icon: VideoIcon, label: "Recording", desc: "Save for later viewing" },
            { icon: Bell, label: "Notifications", desc: "Notify followers" },
          ].map(f => {
            const Icon = f.icon;
            return (
              <div key={f.label} className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-orange-50 text-orange-600 grid place-items-center"><Icon className="h-4 w-4" /></div>
                <div className="flex-1"><div className="text-sm font-medium">{f.label}</div><div className="text-xs text-muted-foreground">{f.desc}</div></div>
                <Switch defaultChecked />
              </div>
            );
          })}
        </CardContent>
      </Card>
      {isSchedule && (
        <Card className="rounded-3xl">
          <CardContent className="p-6 space-y-4">
            <h3 className="font-bold flex items-center gap-2"><CalendarIcon className="h-4 w-4 text-orange-600" />Schedule</h3>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start rounded-xl h-11">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  {schedule ? format(schedule, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={schedule} onSelect={setSchedule} initialFocus className={cn("p-3 pointer-events-auto")} /></PopoverContent>
            </Popover>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Start time</Label><Input type="time" defaultValue="06:00" className="h-11 rounded-xl" /></div>
              <div><Label>Duration</Label><Input defaultValue="45 min" className="h-11 rounded-xl" /></div>
            </div>
          </CardContent>
        </Card>
      )}
      {isRecurring && (
        <Card className="rounded-3xl">
          <CardContent className="p-6 space-y-4">
            <h3 className="font-bold flex items-center gap-2"><Repeat className="h-4 w-4 text-orange-600" />Recurrence</h3>
            <div>
              <Label className="mb-2 block">Repeat on</Label>
              <div className="flex gap-1.5">
                {DAYS.map((d, i) => {
                  const on = days.includes(i);
                  return (
                    <button key={i} onClick={() => toggleDay(i)} className={cn("h-10 w-10 rounded-full text-sm font-semibold transition-all", on ? "bg-orange-500 text-white shadow-md" : "bg-muted text-muted-foreground hover:bg-orange-100")}>{d}</button>
                  );
                })}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Start time</Label><Input type="time" defaultValue="06:00" className="h-11 rounded-xl" /></div>
              <div><Label>Duration</Label><Input defaultValue="45 min" className="h-11 rounded-xl" /></div>
            </div>
            <div>
              <Label>Starts from</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start rounded-xl h-11 mt-1">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    {schedule ? format(schedule, "PPP") : "Today"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={schedule} onSelect={setSchedule} initialFocus className={cn("p-3 pointer-events-auto")} /></PopoverContent>
              </Popover>
            </div>
            <div className="rounded-xl bg-orange-50 border border-orange-100 p-3 text-xs text-orange-700">
              Will auto-stream {days.length} day{days.length !== 1 ? "s" : ""} a week at the set time.
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  </div>
  );
};

/* -------------------- Test -------------------- */

const TestStep = () => {
  const [audio, setAudio] = useState(0);
  useEffect(() => {
    const i = setInterval(() => setAudio(20 + Math.random() * 70), 200);
    return () => clearInterval(i);
  }, []);
  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <LivePreview label="Final Preview" />
        <div className="rounded-2xl bg-gradient-to-r from-emerald-50 to-emerald-100/50 border border-emerald-200 p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-emerald-500 grid place-items-center text-white"><CheckCircle2 className="h-6 w-6" /></div>
          <div className="flex-1"><div className="font-bold text-emerald-800">Your stream is ready</div><div className="text-sm text-emerald-700">All systems healthy. You can go live whenever you wish.</div></div>
        </div>
      </div>
      <div className="space-y-3">
        {[
          { icon: VideoIcon, label: "Camera health", value: "Excellent", tone: "emerald" },
          { icon: Wifi, label: "Internet quality", value: "82 Mbps", tone: "emerald" },
          { icon: Gauge, label: "Bitrate", value: "4500 kbps", tone: "blue" },
          { icon: Signal, label: "Stream quality", value: "1080p · 30fps", tone: "blue" },
        ].map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className={cn("rounded-2xl p-4 border flex items-center gap-3",
              s.tone === "emerald" && "bg-emerald-50 border-emerald-100",
              s.tone === "blue" && "bg-blue-50 border-blue-100")}>
              <div className={cn("h-10 w-10 rounded-xl grid place-items-center text-white",
                s.tone === "emerald" ? "bg-emerald-500" : "bg-blue-500")}><Icon className="h-4 w-4" /></div>
              <div className="flex-1"><div className="text-xs text-muted-foreground">{s.label}</div><div className="font-semibold">{s.value}</div></div>
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            </div>
          );
        })}
        <div className="rounded-2xl p-4 border bg-card">
          <div className="flex items-center gap-2 text-sm font-medium mb-2"><Mic className="h-4 w-4 text-orange-600" />Audio level</div>
          <div className="h-3 rounded-full bg-muted overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-500 transition-all" style={{ width: `${audio}%` }} />
          </div>
          <div className="text-xs text-muted-foreground mt-1">Microphone active</div>
        </div>
      </div>
    </div>
  );
};

/* -------------------- Live Control -------------------- */

const LiveControl = ({ onEnd }: { onEnd: () => void }) => {
  const [duration, setDuration] = useState(0);
  const startedAt = useRef(Date.now());
  useEffect(() => {
    const i = setInterval(() => setDuration(Math.floor((Date.now() - startedAt.current) / 1000)), 1000);
    return () => clearInterval(i);
  }, []);
  const fmt = (s: number) => `${String(Math.floor(s / 3600)).padStart(2, "0")}:${String(Math.floor(s / 60) % 60).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div className="grid lg:grid-cols-[1fr_340px] gap-6">
      <div className="space-y-4">
        <div className="relative">
          <LivePreview label="Live Darshan" />
          <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
            <CircleDot className="h-3 w-3 animate-pulse" /> LIVE
          </div>
          <div className="absolute top-3 right-3 flex gap-2">
            <Badge className="bg-black/60 text-white hover:bg-black/60 backdrop-blur rounded-full"><Users className="h-3 w-3 mr-1" />2,184</Badge>
            <Badge className="bg-black/60 text-white hover:bg-black/60 backdrop-blur rounded-full"><Clock className="h-3 w-3 mr-1" />{fmt(duration)}</Badge>
          </div>
        </div>
        <Card className="rounded-2xl">
          <CardContent className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Button variant="outline" className="h-14 rounded-xl flex-col gap-1"><RefreshCw className="h-5 w-5" /><span className="text-xs">Switch Cam</span></Button>
            <Button variant="outline" className="h-14 rounded-xl flex-col gap-1"><MicOff className="h-5 w-5" /><span className="text-xs">Mute</span></Button>
            <Button variant="outline" className="h-14 rounded-xl flex-col gap-1"><Flag className="h-5 w-5" /><span className="text-xs">Add Banner</span></Button>
            <Button onClick={onEnd} className="h-14 rounded-xl flex-col gap-1 bg-red-500 hover:bg-red-600"><Square className="h-5 w-5" /><span className="text-xs">End Stream</span></Button>
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardContent className="p-4 grid grid-cols-3 gap-4">
            {[
              { label: "Connection", value: "Healthy", icon: Wifi, tone: "text-emerald-600" },
              { label: "Bitrate", value: "4.5 Mbps", icon: Gauge, tone: "text-blue-600" },
              { label: "Donations", value: "₹12,450", icon: HandCoins, tone: "text-amber-600" },
            ].map(s => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="text-center">
                  <Icon className={cn("h-5 w-5 mx-auto", s.tone)} />
                  <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
                  <div className="font-bold text-sm">{s.value}</div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
      <Card className="rounded-2xl flex flex-col">
        <CardContent className="p-0 flex flex-col h-[600px]">
          <div className="p-4 border-b font-semibold flex items-center gap-2"><MessageSquare className="h-4 w-4 text-orange-600" />Live chat & blessings</div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {[
              { name: "Priya S.", msg: "Har Har Mahadev 🙏", icon: "🙏" },
              { name: "Ramesh K.", msg: "Beautiful aarti today", icon: "🌺" },
              { name: "Anjali", msg: "Donated ₹501 for prasadam", icon: "💛", donation: true },
              { name: "Suresh", msg: "Jai Shri Krishna", icon: "🕉️" },
              { name: "Meera", msg: "Blessings from Mumbai", icon: "✨" },
            ].map((c, i) => (
              <div key={i} className={cn("rounded-xl p-3 text-sm", c.donation ? "bg-amber-50 border border-amber-200" : "bg-muted/50")}>
                <div className="flex items-center gap-2 font-semibold text-xs">
                  <span>{c.icon}</span>{c.name}
                  {c.donation && <Badge className="bg-amber-500 hover:bg-amber-500 text-[10px] rounded-full"><Heart className="h-2.5 w-2.5 mr-0.5" />Donation</Badge>}
                </div>
                <div className="text-muted-foreground mt-1">{c.msg}</div>
              </div>
            ))}
          </div>
          <div className="p-3 border-t"><Input placeholder="Send a blessing..." className="rounded-xl h-10" /></div>
        </CardContent>
      </Card>
    </div>
  );
};

/* -------------------- Main Page -------------------- */

export default function LiveBroadcast() {
  const [step, setStep] = useState(0);
  const [type, setType] = useState<StreamType | null>(null);
  const [source, setSource] = useState<SourceType | null>(null);
  const [schedule, setSchedule] = useState<Date | undefined>();
  const [live, setLive] = useState(false);

  const isSchedule = type === "schedule" || type === "recurring";
  const isFestival = type === "festival";

  const next = () => {
    if (step === 1 && !source) { toast.error("Please select a camera source"); return; }
    setStep(s => Math.min(s + 1, STEPS.length - 1));
  };
  const back = () => setStep(s => Math.max(s - 1, 0));

  const goLive = () => {
    setLive(true);
    toast.success(isSchedule ? "Broadcast scheduled" : "You are live");
  };

  if (live) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Live Darshan in progress</h1>
            <p className="text-sm text-muted-foreground">Devotees worldwide are watching.</p>
          </div>
          <Badge className="bg-red-500 hover:bg-red-500 text-white rounded-full px-3 py-1.5"><CircleDot className="h-3 w-3 mr-1 animate-pulse" />ON AIR</Badge>
        </div>
        <LiveControl onEnd={() => { setLive(false); setStep(0); setType(null); setSource(null); toast.success("Broadcast ended"); }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50/40 via-background to-background">
      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-sm text-orange-600 font-medium"><Radio className="h-4 w-4" />Live Broadcast Studio</div>
            <h1 className="text-3xl font-bold tracking-tight mt-1">Set up your darshan stream</h1>
            <p className="text-muted-foreground text-sm">A guided, calm experience — go live in just a few taps.</p>
          </div>
          {step > 0 && (
            <div className="flex items-center gap-2">
              <div className="h-10 px-4 rounded-full bg-orange-50 border border-orange-100 flex items-center gap-2 text-sm">
                <Sparkles className="h-4 w-4 text-orange-500" />
                <span className="font-medium">{STREAM_TYPES.find(s => s.id === type)?.title}</span>
              </div>
            </div>
          )}
        </div>

        <Card className="rounded-3xl border-orange-100/70">
          <CardContent className="p-4 md:p-5"><StepBar step={step} /></CardContent>
        </Card>

        <div className="animate-fade-in">
          {step === 0 && <TypeStep onPick={(t) => { setType(t); setStep(1); }} />}
          {step === 1 && <CameraStep source={source} setSource={setSource} />}
          {step === 2 && <ConfigureStep schedule={schedule} setSchedule={setSchedule} type={type} />}
          {step === 3 && <TestStep />}
          {step === 4 && (
            <div className="text-center max-w-xl mx-auto py-8">
              <div className="h-24 w-24 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 grid place-items-center mx-auto shadow-2xl shadow-orange-500/40 animate-scale-in">
                <Play className="h-10 w-10 text-white ml-1" fill="white" />
              </div>
              <h2 className="text-3xl font-bold mt-6">{isSchedule ? "Ready to schedule" : isFestival ? "Festival stream is ready" : "You're ready to go live"}</h2>
              <p className="text-muted-foreground mt-2">{isSchedule ? "Your darshan will be broadcast at the scheduled time." : isFestival ? "Multi-camera festival broadcast is configured. Begin the grand event when ready." : "Tap below to begin your darshan broadcast. Devotees will be notified instantly."}</p>
              <div className="mt-6 flex justify-center gap-3">
                <Button variant="outline" onClick={back} className="h-12 rounded-xl px-6"><ArrowLeft className="h-4 w-4 mr-2" />Back</Button>
                <Button onClick={goLive} className="h-12 rounded-xl px-8 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-lg shadow-orange-500/30">
                  {isSchedule ? <><CalendarIcon className="h-4 w-4 mr-2" />Schedule Broadcast</> : <><Radio className="h-4 w-4 mr-2" />Go Live Now</>}
                </Button>
              </div>
            </div>
          )}
        </div>

        {step > 0 && step < 4 && (
          <>
            <Separator />
            <div className="flex items-center justify-between">
              <Button variant="ghost" onClick={back} className="rounded-xl"><ArrowLeft className="h-4 w-4 mr-2" />Back</Button>
              <Button onClick={next} className="rounded-xl bg-orange-500 hover:bg-orange-600 h-11 px-6">Continue<ArrowRight className="h-4 w-4 ml-2" /></Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}