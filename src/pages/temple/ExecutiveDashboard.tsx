import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft, IndianRupee, Heart, Users, Calendar, CalendarDays, FolderKanban,
  Sparkles, MessageSquare, TrendingUp, TrendingDown, AlertTriangle, CheckCircle2,
  Package, UserCog, Building2, Bell, Wallet, Target,
  HandHeart, Utensils, Boxes, Megaphone, Clock,
} from "lucide-react";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, BarChart, Bar, Legend, AreaChart, Area,
} from "recharts";

const kpis = [
  { label: "Total Revenue (FY)", value: "₹4.82 Cr", delta: "+18.4%", up: true, icon: IndianRupee, color: "text-emerald-600", bg: "bg-emerald-50" },
  { label: "Donations (FY)", value: "₹3.14 Cr", delta: "+22.1%", up: true, icon: Heart, color: "text-rose-600", bg: "bg-rose-50" },
  { label: "Seva Bookings", value: "12,483", delta: "+9.3%", up: true, icon: Sparkles, color: "text-amber-600", bg: "bg-amber-50" },
  { label: "Active Devotees", value: "48,912", delta: "+6.8%", up: true, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
  { label: "Events Hosted", value: "126", delta: "+11", up: true, icon: CalendarDays, color: "text-violet-600", bg: "bg-violet-50" },
  { label: "Active Projects", value: "12", delta: "3 at risk", up: false, icon: FolderKanban, color: "text-indigo-600", bg: "bg-indigo-50" },
  { label: "Staff On Duty", value: "184 / 210", delta: "87.6%", up: true, icon: UserCog, color: "text-cyan-600", bg: "bg-cyan-50" },
  { label: "Pending Approvals", value: "23", delta: "5 urgent", up: false, icon: Bell, color: "text-orange-600", bg: "bg-orange-50" },
];

const revenueTrend = [
  { m: "Apr", donations: 22, sevas: 8, events: 3 },
  { m: "May", donations: 26, sevas: 9, events: 4 },
  { m: "Jun", donations: 24, sevas: 10, events: 5 },
  { m: "Jul", donations: 30, sevas: 12, events: 4 },
  { m: "Aug", donations: 34, sevas: 11, events: 6 },
  { m: "Sep", donations: 29, sevas: 13, events: 5 },
  { m: "Oct", donations: 38, sevas: 14, events: 8 },
  { m: "Nov", donations: 42, sevas: 15, events: 7 },
  { m: "Dec", donations: 45, sevas: 16, events: 9 },
  { m: "Jan", donations: 33, sevas: 12, events: 5 },
  { m: "Feb", donations: 36, sevas: 13, events: 6 },
  { m: "Mar", donations: 41, sevas: 15, events: 7 },
];

const donationSplit = [
  { name: "General", value: 42, color: "#c2410c" },
  { name: "Annadanam", value: 24, color: "#059669" },
  { name: "Gopuram Fund", value: 18, color: "#7c3aed" },
  { name: "Renovation", value: 10, color: "#0284c7" },
  { name: "Others", value: 6, color: "#64748b" },
];

const channelData = [
  { c: "Cash", v: 28 },
  { c: "UPI/QR", v: 41 },
  { c: "Bank", v: 19 },
  { c: "Cheque", v: 7 },
  { c: "Online GW", v: 5 },
];

const projects = [
  { n: "Gopuram Renovation", p: 68, r: "High" },
  { n: "Annadanam Hall", p: 35, r: "Normal" },
  { n: "Digital Darshan", p: 82, r: "Normal" },
  { n: "Parking Expansion", p: 15, r: "High" },
];

const alerts = [
  { t: "Form 10BD filing due", d: "31 May 2026 · 84 donors pending", sev: "high" },
  { t: "Low stock: Camphor", d: "12 kg left · reorder point 25 kg", sev: "med" },
  { t: "Cash reconciliation pending", d: "Counter 2 · ₹18,420 unmatched", sev: "med" },
  { t: "Priest attendance below target", d: "3 priests <90% this month", sev: "low" },
];

const topDonors = [
  { n: "Ramesh Kumar Sharma", a: "₹5,10,000", c: 12 },
  { n: "Lakshmi Narayan Trust", a: "₹3,25,000", c: 4 },
  { n: "Dr. Suresh Iyer", a: "₹2,80,000", c: 8 },
  { n: "Anjali Menon", a: "₹1,95,000", c: 6 },
  { n: "Vikram Shetty", a: "₹1,50,000", c: 5 },
];

const upcoming = [
  { d: "12 Feb", n: "Maha Shivaratri", type: "Festival" },
  { d: "18 Feb", n: "VIP Darshan - Governor", type: "VIP Visit" },
  { d: "24 Feb", n: "Board Meeting Q4", type: "Meeting" },
  { d: "02 Mar", n: "Annadanam Drive", type: "Event" },
];

// Somnath Mandir authority requirements (Mr. Joshi Sir)
const hourlyFootfall = [
  { h: "5 AM", v: 320 }, { h: "7 AM", v: 940 }, { h: "9 AM", v: 1420 },
  { h: "11 AM", v: 1180 }, { h: "1 PM", v: 760 }, { h: "3 PM", v: 640 },
  { h: "5 PM", v: 1280 }, { h: "7 PM", v: 1520 }, { h: "9 PM", v: 780 },
];

const donationsOfferings = [
  { l: "Hundi Collection", v: "₹1,24,850", sub: "Today · 3 boxes" },
  { l: "Counter Donations", v: "₹86,420", sub: "142 receipts" },
  { l: "Online / UPI", v: "₹2,14,600", sub: "318 txns" },
  { l: "In-kind Offerings", v: "₹42,300", sub: "Gold 12g, Silver 340g" },
];

const prasadOps = [
  { l: "Prasad Prepared", v: "4,200 plates", pct: 100 },
  { l: "Distributed", v: "3,240 plates", pct: 77 },
  { l: "Reserved (Sevas)", v: "620 plates", pct: 15 },
  { l: "Wastage", v: "68 plates", pct: 2 },
];

const sevaParticipation = [
  { s: "Abhishekam", booked: 84, done: 78 },
  { s: "Archana", booked: 156, done: 148 },
  { s: "Kalyanotsavam", booked: 22, done: 20 },
  { s: "Annadanam Sponsor", booked: 38, done: 38 },
  { s: "Homam", booked: 14, done: 12 },
];

const inventoryMovement = [
  { item: "Camphor (kg)", inQ: 40, outQ: 28, bal: 12, low: true },
  { item: "Ghee (L)", inQ: 120, outQ: 84, bal: 210, low: false },
  { item: "Flowers (kg)", inQ: 85, outQ: 78, bal: 22, low: false },
  { item: "Rice (kg)", inQ: 500, outQ: 340, bal: 1240, low: false },
  { item: "Oil Lamps", inQ: 200, outQ: 180, bal: 45, low: true },
];

const volunteerActivity = [
  { l: "On Duty Today", v: "84", c: "text-emerald-600" },
  { l: "Hours Logged (Week)", v: "1,240 hrs", c: "text-blue-600" },
  { l: "New Sign-ups (Month)", v: "28", c: "text-violet-600" },
  { l: "Assigned to Events", v: "36", c: "text-amber-600" },
];

const communications = [
  { t: "Maha Shivaratri Schedule", ch: "SMS + WhatsApp", reach: "42,180", when: "2h ago" },
  { t: "Annadanam Sponsorship Drive", ch: "Email", reach: "18,420", when: "Yesterday" },
  { t: "Darshan Timing Update", ch: "Website + App", reach: "—", when: "2 days ago" },
  { t: "Board Announcement Q4", ch: "Notice Board", reach: "Internal", when: "3 days ago" },
];

function ExecutiveDashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(180deg, hsl(30 30% 97%) 0%, hsl(30 20% 95%) 100%)" }}>
      <header className="border-b sticky top-0 z-20 border-border bg-card/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/temple-hub")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Building2 className="h-5 w-5 text-primary" />
            <div>
              <h1 className="text-lg font-bold text-primary leading-tight">Executive Dashboard</h1>
              <p className="text-[11px] text-muted-foreground">Unified view across all modules · FY 2024-25</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[10px]">Live</Badge>
            <Button size="sm" variant="outline" onClick={() => navigate("/temple/reports")}>Detailed Reports</Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* KPI grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {kpis.map(k => (
            <Card key={k.label} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-lg ${k.bg}`}><k.icon className={`h-4 w-4 ${k.color}`} /></div>
                  <span className={`text-[11px] flex items-center gap-0.5 ${k.up ? "text-emerald-600" : "text-orange-600"}`}>
                    {k.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />} {k.delta}
                  </span>
                </div>
                <p className="text-xl font-bold text-foreground">{k.value}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{k.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Revenue trend + Donation split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2"><TrendingUp className="h-4 w-4" /> Revenue Trend (₹ Lakhs)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={revenueTrend}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="m" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Line type="monotone" dataKey="donations" stroke="#c2410c" strokeWidth={2} />
                  <Line type="monotone" dataKey="sevas" stroke="#059669" strokeWidth={2} />
                  <Line type="monotone" dataKey="events" stroke="#7c3aed" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2"><Heart className="h-4 w-4" /> Donation Split</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={donationSplit} dataKey="value" nameKey="name" innerRadius={45} outerRadius={80} paddingAngle={2}>
                    {donationSplit.map(d => <Cell key={d.name} fill={d.color} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-1 mt-2">
                {donationSplit.map(d => (
                  <div key={d.name} className="flex items-center gap-1.5 text-[11px]">
                    <span className="h-2 w-2 rounded-full" style={{ background: d.color }} />
                    <span className="text-muted-foreground">{d.name}</span>
                    <span className="ml-auto font-mono">{d.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Channel + Projects + Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2"><Wallet className="h-4 w-4" /> Payment Channels</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={channelData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="c" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="v" fill="#c2410c" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2"><Target className="h-4 w-4" /> Active Projects</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {projects.map(p => (
                <div key={p.n}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium">{p.n}</span>
                    <span className="flex items-center gap-2">
                      {p.r === "High" && <Badge variant="destructive" className="text-[9px] h-4">Risk</Badge>}
                      <span className="font-mono">{p.p}%</span>
                    </span>
                  </div>
                  <Progress value={p.p} className="h-1.5" />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2"><AlertTriangle className="h-4 w-4" /> Alerts & Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {alerts.map(a => (
                <div key={a.t} className="p-2 rounded-lg border flex items-start gap-2">
                  <span className={`mt-1 h-2 w-2 rounded-full shrink-0 ${a.sev === "high" ? "bg-red-500" : a.sev === "med" ? "bg-amber-500" : "bg-blue-500"}`} />
                  <div className="min-w-0">
                    <p className="text-xs font-medium">{a.t}</p>
                    <p className="text-[11px] text-muted-foreground">{a.d}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Top donors + Upcoming + Ops snapshot */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2"><Heart className="h-4 w-4" /> Top Donors (FY)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {topDonors.map((d, i) => (
                <div key={d.n} className="flex items-center justify-between text-xs p-2 rounded hover:bg-muted/40">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-muted-foreground w-4">{i + 1}</span>
                    <div className="min-w-0">
                      <p className="font-medium truncate">{d.n}</p>
                      <p className="text-[10px] text-muted-foreground">{d.c} donations</p>
                    </div>
                  </div>
                  <span className="font-mono font-semibold text-emerald-700">{d.a}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2"><Calendar className="h-4 w-4" /> Upcoming</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {upcoming.map(u => (
                <div key={u.n} className="flex items-center gap-3 p-2 rounded border">
                  <div className="text-center shrink-0 w-12">
                    <p className="text-[10px] text-muted-foreground uppercase">{u.d.split(" ")[1]}</p>
                    <p className="text-lg font-bold leading-none">{u.d.split(" ")[0]}</p>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium truncate">{u.n}</p>
                    <Badge variant="secondary" className="text-[9px] h-4 mt-0.5">{u.type}</Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Operations Snapshot</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { l: "Today's Footfall", v: "8,412", icon: Users, c: "text-blue-600" },
                { l: "Sevas Completed Today", v: "146 / 168", icon: Sparkles, c: "text-amber-600" },
                { l: "Prasadam Served", v: "3,240 plates", icon: Package, c: "text-emerald-600" },
                { l: "Feedback Avg (30d)", v: "4.6 / 5", icon: MessageSquare, c: "text-violet-600" },
                { l: "Cash in Hand", v: "₹2,84,510", icon: IndianRupee, c: "text-rose-600" },
              ].map(r => (
                <div key={r.l} className="flex items-center gap-3 text-xs">
                  <r.icon className={`h-4 w-4 ${r.c}`} />
                  <span className="flex-1 text-muted-foreground">{r.l}</span>
                  <span className="font-mono font-semibold">{r.v}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* ============ Somnath Mandir Authority Requirements ============ */}
        <div className="pt-2">
          <h2 className="text-sm font-semibold text-primary uppercase tracking-wide flex items-center gap-2">
            <Building2 className="h-4 w-4" /> Daily Operations Overview
          </h2>
          <p className="text-[11px] text-muted-foreground">Unified daily snapshot across all temple operations</p>
        </div>

        {/* Footfall + Donations & Offerings */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-4 w-4" /> Daily Devotee Footfall
                <Badge variant="secondary" className="text-[9px] h-4 ml-1">Today: 8,412</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={hourlyFootfall}>
                  <defs>
                    <linearGradient id="ff" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#c2410c" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="#c2410c" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="h" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="v" stroke="#c2410c" strokeWidth={2} fill="url(#ff)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2"><HandHeart className="h-4 w-4" /> Donations & Offerings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {donationsOfferings.map(d => (
                <div key={d.l} className="flex items-center justify-between p-2 rounded border">
                  <div className="min-w-0">
                    <p className="text-xs font-medium">{d.l}</p>
                    <p className="text-[10px] text-muted-foreground">{d.sub}</p>
                  </div>
                  <span className="font-mono text-sm font-semibold text-emerald-700">{d.v}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Prasad + Seva Participation */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2"><Utensils className="h-4 w-4" /> Prasad Preparation & Distribution</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {prasadOps.map(p => (
                <div key={p.l}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium">{p.l}</span>
                    <span className="font-mono">{p.v}</span>
                  </div>
                  <Progress value={p.pct} className="h-1.5" />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2"><Sparkles className="h-4 w-4" /> Seva Participation (Today)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={sevaParticipation} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis dataKey="s" type="category" tick={{ fontSize: 11 }} width={110} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="booked" fill="#c2410c" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="done" fill="#059669" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Inventory + Volunteers + Communications */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2"><Boxes className="h-4 w-4" /> Inventory Movement (Today)</CardTitle>
            </CardHeader>
            <CardContent>
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-[10px] text-muted-foreground uppercase border-b">
                    <th className="text-left py-1.5">Item</th>
                    <th className="text-right py-1.5">In</th>
                    <th className="text-right py-1.5">Out</th>
                    <th className="text-right py-1.5">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {inventoryMovement.map(i => (
                    <tr key={i.item} className="border-b last:border-0">
                      <td className="py-1.5">{i.item}</td>
                      <td className="text-right font-mono text-emerald-700">+{i.inQ}</td>
                      <td className="text-right font-mono text-rose-700">-{i.outQ}</td>
                      <td className={`text-right font-mono font-semibold ${i.low ? "text-orange-600" : ""}`}>
                        {i.bal}{i.low && " ⚠"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2"><UserCog className="h-4 w-4" /> Volunteer Activities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                {volunteerActivity.map(v => (
                  <div key={v.l} className="p-2 rounded border text-center">
                    <p className={`text-lg font-bold ${v.c}`}>{v.v}</p>
                    <p className="text-[10px] text-muted-foreground leading-tight">{v.l}</p>
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t space-y-1.5">
                <p className="text-[11px] font-medium text-muted-foreground uppercase">Active Assignments</p>
                {[
                  { n: "Crowd Management", c: 24 },
                  { n: "Annadanam Serving", c: 18 },
                  { n: "Shoe Stand & Cloak", c: 12 },
                  { n: "Queue & Darshan", c: 30 },
                ].map(a => (
                  <div key={a.n} className="flex justify-between text-xs">
                    <span>{a.n}</span>
                    <span className="font-mono">{a.c}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2"><Megaphone className="h-4 w-4" /> Communications & Announcements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {communications.map(c => (
                <div key={c.t} className="p-2 rounded border">
                  <div className="flex justify-between items-start gap-2">
                    <p className="text-xs font-medium">{c.t}</p>
                    <span className="text-[10px] text-muted-foreground shrink-0 flex items-center gap-0.5">
                      <Clock className="h-3 w-3" /> {c.when}
                    </span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <Badge variant="secondary" className="text-[9px] h-4">{c.ch}</Badge>
                    <span className="text-[10px] text-muted-foreground">Reach: <span className="font-mono">{c.reach}</span></span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Events & Operations */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2"><CalendarDays className="h-4 w-4" /> Temple Events & Operations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {[
                { l: "Events This Week", v: "7", c: "text-violet-600" },
                { l: "Ongoing Now", v: "2", c: "text-emerald-600" },
                { l: "Priests On Duty", v: "18 / 22", c: "text-amber-600" },
                { l: "Halls Occupied", v: "4 / 6", c: "text-blue-600" },
                { l: "Security Staff", v: "34", c: "text-rose-600" },
                { l: "VIP Visits Today", v: "3", c: "text-indigo-600" },
              ].map(x => (
                <div key={x.l} className="p-3 rounded-lg border text-center">
                  <p className={`text-xl font-bold ${x.c}`}>{x.v}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{x.l}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

export default ExecutiveDashboard;