import { ArrowLeft, Check, AlertCircle, Info, Bell, Search, Plus, Trash2, Edit, Download, Upload, Star, Heart, ChevronRight, Mail, Lock, Eye, EyeOff, Copy, Crown, Building2, Users, Calendar, Settings, LogOut, Landmark, Clock, MapPin, MoreVertical, PanelLeftClose } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useRef, useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="space-y-4">
    <h2 className="text-lg font-semibold text-foreground border-b border-border pb-2">{title}</h2>
    {children}
  </div>
);

// Helper to convert RGB to Hex
const rgbToHex = (r: number, g: number, b: number) =>
  "#" + [r, g, b].map((x) => Math.round(x).toString(16).padStart(2, "0")).join("");

// Helper to get computed color as hex from a CSS variable
const getColorFromToken = (token: string): { hsl: string; hex: string } => {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(token).trim();
  if (!raw) return { hsl: "N/A", hex: "N/A" };
  // raw is like "16 85% 23%"
  const hsl = `hsl(${raw})`;
  // Parse and convert
  const parts = raw.split(/\s+/);
  if (parts.length < 3) return { hsl: raw, hex: "N/A" };
  const h = parseFloat(parts[0]);
  const s = parseFloat(parts[1]) / 100;
  const l = parseFloat(parts[2]) / 100;
  // HSL to RGB
  const a2 = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    return l - a2 * Math.max(Math.min(k - 3, 9 - k, 1), -1);
  };
  const hex = rgbToHex(f(0) * 255, f(8) * 255, f(4) * 255);
  return { hsl: `hsl(${raw})`, hex: hex.toUpperCase() };
};

const ColorSwatch = ({ name, className, token }: { name: string; className: string; token: string }) => {
  const [colors, setColors] = useState({ hsl: "", hex: "" });

  useEffect(() => {
    setColors(getColorFromToken(token));
  }, [token]);

  const copyHex = () => {
    navigator.clipboard.writeText(colors.hex);
    toast.success(`Copied ${colors.hex}`);
  };

  return (
    <div className="flex flex-col items-center gap-1.5 w-[100px]">
      <div className={`w-16 h-16 rounded-lg border border-border ${className} relative group cursor-pointer`} onClick={copyHex}>
        <div className="absolute inset-0 rounded-lg bg-foreground/0 group-hover:bg-foreground/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
          <Copy className="h-3.5 w-3.5 text-primary-foreground drop-shadow" />
        </div>
      </div>
      <span className="text-xs font-medium text-foreground text-center leading-tight">{name}</span>
      <span className="text-[10px] text-primary font-mono font-semibold">{colors.hex}</span>
      <span className="text-[10px] text-muted-foreground font-mono leading-tight text-center">{colors.hsl}</span>
      <span className="text-[10px] text-muted-foreground font-mono">{token}</span>
    </div>
  );
};

const ShadowBox = ({ name, className }: { name: string; className: string }) => (
  <div className="flex flex-col items-center gap-2">
    <div className={`w-24 h-24 rounded-lg bg-card ${className}`} />
    <span className="text-xs font-medium text-foreground">{name}</span>
  </div>
);

const UIKit = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center gap-3">
          <button onClick={() => navigate("/temple-hub")} className="p-2 rounded-lg hover:bg-muted transition-colors">
            <ArrowLeft className="h-4 w-4 text-muted-foreground" />
          </button>
          <h1 className="text-lg font-bold text-foreground">UI Kit & Design System</h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-6">
        <Tabs defaultValue="design-system" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="design-system">Design System</TabsTrigger>
            <TabsTrigger value="app-usage">Application Usage</TabsTrigger>
          </TabsList>

          {/* ═══════════════ TAB 1: DESIGN SYSTEM ═══════════════ */}
          <TabsContent value="design-system" className="space-y-12">

            {/* ───── COLORS ───── */}
            <Section title="Colors">
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">Core Palette</h3>
                  <div className="flex flex-wrap gap-4">
                    <ColorSwatch name="Primary" className="bg-primary" token="--primary" />
                    <ColorSwatch name="Primary FG" className="bg-primary-foreground border-2" token="--primary-foreground" />
                    <ColorSwatch name="Secondary" className="bg-secondary" token="--secondary" />
                    <ColorSwatch name="Destructive" className="bg-destructive" token="--destructive" />
                    <ColorSwatch name="Background" className="bg-background" token="--background" />
                    <ColorSwatch name="Foreground" className="bg-foreground" token="--foreground" />
                    <ColorSwatch name="Muted" className="bg-muted" token="--muted" />
                    <ColorSwatch name="Muted FG" className="bg-muted-foreground" token="--muted-foreground" />
                    <ColorSwatch name="Accent" className="bg-accent" token="--accent" />
                    <ColorSwatch name="Card" className="bg-card" token="--card" />
                    <ColorSwatch name="Popover" className="bg-popover" token="--popover" />
                    <ColorSwatch name="Border" className="bg-border" token="--border" />
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">Semantic Colors</h3>
                  <div className="flex flex-wrap gap-4">
                    <ColorSwatch name="Success" className="bg-success" token="--success" />
                    <ColorSwatch name="Warning" className="bg-warning" token="--warning" />
                    <ColorSwatch name="Info" className="bg-info" token="--info" />
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">Brown Scale</h3>
                  <div className="flex flex-wrap gap-4">
                    <ColorSwatch name="Brown" className="bg-brown" token="--primary" />
                    <ColorSwatch name="Brown Deep" className="bg-brown-deep" token="--brown-deep" />
                    <ColorSwatch name="Brown Darkest" className="bg-brown-darkest" token="--brown-darkest" />
                    <ColorSwatch name="Brown Light" className="bg-brown-light" token="--brown-light" />
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">Gradients</h3>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-32 h-16 rounded-lg brown-gradient" />
                      <span className="text-xs font-medium text-foreground">Brown Gradient</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-32 h-16 rounded-lg brown-gradient-soft" />
                      <span className="text-xs font-medium text-foreground">Brown Soft</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-32 h-16 rounded-lg bg-gradient-subtle border border-border" />
                      <span className="text-xs font-medium text-foreground">Subtle</span>
                    </div>
                  </div>
                </div>
              </div>
            </Section>

            {/* ───── TYPOGRAPHY ───── */}
            <Section title="Typography">
              <div className="space-y-4">
                <div className="space-y-3">
                  {[
                    { label: "h1 / 3xl", cls: "text-3xl font-bold" },
                    { label: "h2 / 2xl", cls: "text-2xl font-semibold" },
                    { label: "h3 / xl", cls: "text-xl font-semibold" },
                    { label: "h4 / lg", cls: "text-lg font-medium" },
                    { label: "body", cls: "text-base" },
                    { label: "sm", cls: "text-sm" },
                    { label: "xs", cls: "text-xs" },
                  ].map((t) => (
                    <div key={t.label} className="flex items-baseline gap-4">
                      <span className="text-xs text-muted-foreground w-20 shrink-0 font-mono">{t.label}</span>
                      <p className={`${t.cls} text-foreground`}>The quick brown fox jumps</p>
                    </div>
                  ))}
                  <div className="flex items-baseline gap-4">
                    <span className="text-xs text-muted-foreground w-20 shrink-0 font-mono">mono</span>
                    <p className="text-sm font-mono text-foreground">TNT-2024-001234</p>
                  </div>
                </div>
                <Separator />
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">Font Weights</h3>
                  <div className="space-y-1">
                    {[
                      { w: "font-light", label: "Light (300)" },
                      { w: "font-normal", label: "Regular (400)" },
                      { w: "font-medium", label: "Medium (500)" },
                      { w: "font-semibold", label: "Semibold (600)" },
                      { w: "font-bold", label: "Bold (700)" },
                      { w: "font-extrabold", label: "Extrabold (800)" },
                    ].map((f) => (
                      <p key={f.label} className={`text-base ${f.w} text-foreground`}>{f.label}</p>
                    ))}
                  </div>
                </div>
              </div>
            </Section>

            {/* ───── SHADOWS ───── */}
            <Section title="Shadows">
              <div className="flex flex-wrap gap-6">
                <ShadowBox name="shadow-sm" className="shadow-sm" />
                <ShadowBox name="shadow" className="shadow" />
                <ShadowBox name="shadow-md" className="shadow-md" />
                <ShadowBox name="shadow-lg" className="shadow-lg" />
                <ShadowBox name="shadow-xl" className="shadow-xl" />
                <ShadowBox name="card-shadow" className="card-shadow" />
                <ShadowBox name="card-shadow-hover" className="card-shadow-hover" />
                <ShadowBox name="card-shadow-lg" className="card-shadow-lg" />
                <ShadowBox name="glass-shadow" className="glass-shadow" />
              </div>
            </Section>

            {/* ───── BORDER RADIUS ───── */}
            <Section title="Border Radius (Corners)">
              <div className="flex flex-wrap gap-6">
                {[
                  { name: "none", cls: "rounded-none" },
                  { name: "sm", cls: "rounded-sm" },
                  { name: "md", cls: "rounded-md" },
                  { name: "lg (default)", cls: "rounded-lg" },
                  { name: "xl", cls: "rounded-xl" },
                  { name: "2xl", cls: "rounded-2xl" },
                  { name: "full", cls: "rounded-full" },
                ].map((r) => (
                  <div key={r.name} className="flex flex-col items-center gap-2">
                    <div className={`w-20 h-20 bg-primary/10 border-2 border-primary ${r.cls}`} />
                    <span className="text-xs font-medium text-foreground">{r.name}</span>
                    <span className="text-[10px] text-muted-foreground font-mono">{r.cls}</span>
                  </div>
                ))}
              </div>
            </Section>

            {/* ───── BORDERS ───── */}
            <Section title="Borders">
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">Border Widths</h3>
                  <div className="flex flex-wrap gap-6">
                    {[
                      { name: "border (1px)", cls: "border" },
                      { name: "border-2", cls: "border-2" },
                      { name: "border-4", cls: "border-4" },
                      { name: "border-8", cls: "border-8" },
                    ].map((b) => (
                      <div key={b.name} className="flex flex-col items-center gap-2">
                        <div className={`w-20 h-20 rounded-lg ${b.cls} border-border bg-card`} />
                        <span className="text-xs font-medium text-foreground">{b.name}</span>
                        <span className="text-[10px] text-muted-foreground font-mono">{b.cls}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">Border Styles</h3>
                  <div className="flex flex-wrap gap-6">
                    {[
                      { name: "Solid", cls: "border-2 border-solid border-border" },
                      { name: "Dashed", cls: "border-2 border-dashed border-border" },
                      { name: "Dotted", cls: "border-2 border-dotted border-border" },
                      { name: "Double", cls: "border-4 border-double border-border" },
                    ].map((b) => (
                      <div key={b.name} className="flex flex-col items-center gap-2">
                        <div className={`w-20 h-20 rounded-lg ${b.cls} bg-card`} />
                        <span className="text-xs font-medium text-foreground">{b.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">Border Colors</h3>
                  <div className="flex flex-wrap gap-6">
                    {[
                      { name: "Border", cls: "border-2 border-border" },
                      { name: "Primary", cls: "border-2 border-primary" },
                      { name: "Destructive", cls: "border-2 border-destructive" },
                      { name: "Muted", cls: "border-2 border-muted" },
                      { name: "Input", cls: "border-2 border-input" },
                      { name: "Ring", cls: "border-2 border-ring" },
                    ].map((b) => (
                      <div key={b.name} className="flex flex-col items-center gap-2">
                        <div className={`w-20 h-20 rounded-lg ${b.cls} bg-card`} />
                        <span className="text-xs font-medium text-foreground">{b.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">Border Sides</h3>
                  <div className="flex flex-wrap gap-6">
                    {[
                      { name: "All", cls: "border-2 border-primary" },
                      { name: "Top", cls: "border-t-2 border-primary" },
                      { name: "Right", cls: "border-r-2 border-primary" },
                      { name: "Bottom", cls: "border-b-2 border-primary" },
                      { name: "Left", cls: "border-l-2 border-primary" },
                      { name: "X axis", cls: "border-x-2 border-primary" },
                      { name: "Y axis", cls: "border-y-2 border-primary" },
                    ].map((b) => (
                      <div key={b.name} className="flex flex-col items-center gap-2">
                        <div className={`w-20 h-20 rounded-lg ${b.cls} bg-card`} />
                        <span className="text-xs font-medium text-foreground">{b.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Section>

            {/* ───── SPACING ───── */}
            <Section title="Spacing Scale">
              <div className="flex flex-wrap items-end gap-3">
                {[1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24].map((s) => (
                  <div key={s} className="flex flex-col items-center gap-1">
                    <div className="bg-primary/20 border border-primary/40" style={{ width: `${s * 4}px`, height: `${s * 4}px` }} />
                    <span className="text-[10px] font-mono text-muted-foreground">{s}</span>
                    <span className="text-[10px] text-muted-foreground">{s * 4}px</span>
                  </div>
                ))}
              </div>
            </Section>

            {/* ───── BUTTONS ───── */}
            <Section title="Buttons">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">Variants</h3>
                  <div className="flex flex-wrap gap-3">
                    <Button>Default</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="destructive">Destructive</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="link">Link</Button>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">Sizes</h3>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button size="sm">Small</Button>
                    <Button size="default">Default</Button>
                    <Button size="lg">Large</Button>
                    <Button size="icon"><Plus className="h-4 w-4" /></Button>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">With Icons</h3>
                  <div className="flex flex-wrap gap-3">
                    <Button><Plus className="h-4 w-4" /> Add New</Button>
                    <Button variant="outline"><Download className="h-4 w-4" /> Export</Button>
                    <Button variant="destructive"><Trash2 className="h-4 w-4" /> Delete</Button>
                    <Button variant="secondary"><Edit className="h-4 w-4" /> Edit</Button>
                    <Button variant="ghost"><Upload className="h-4 w-4" /> Upload</Button>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">States</h3>
                  <div className="flex flex-wrap gap-3">
                    <Button>Enabled</Button>
                    <Button disabled>Disabled</Button>
                  </div>
                </div>
              </div>
            </Section>

            {/* ───── BADGES ───── */}
            <Section title="Badges">
              <div className="flex flex-wrap gap-3">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="destructive">Destructive</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge className="bg-success text-success-foreground">Success</Badge>
                <Badge className="bg-warning text-warning-foreground">Warning</Badge>
                <Badge className="bg-info text-info-foreground">Info</Badge>
              </div>
            </Section>

            {/* ───── INPUTS & FORMS ───── */}
            <Section title="Inputs & Form Controls">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Text Input</Label>
                    <Input placeholder="Enter text..." />
                  </div>
                  <div className="space-y-2">
                    <Label>With Icon</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Search..." className="pl-9" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Disabled</Label>
                    <Input placeholder="Disabled input" disabled />
                  </div>
                  <div className="space-y-2">
                    <Label>Textarea</Label>
                    <Textarea placeholder="Enter description..." rows={3} />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Select</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose option..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Option 1</SelectItem>
                        <SelectItem value="2">Option 2</SelectItem>
                        <SelectItem value="3">Option 3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-3">
                    <Switch id="switch-demo" />
                    <Label htmlFor="switch-demo">Toggle Switch</Label>
                  </div>
                  <div className="flex items-center gap-3">
                    <Checkbox id="check-demo" />
                    <Label htmlFor="check-demo">Checkbox</Label>
                  </div>
                </div>
              </div>
            </Section>

            {/* ───── CARDS ───── */}
            <Section title="Cards">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Basic Card</CardTitle>
                    <CardDescription>Default card with header and content.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Card body content goes here.</p>
                  </CardContent>
                </Card>
                <Card className="card-shadow-hover">
                  <CardHeader>
                    <CardTitle className="text-base">Elevated Card</CardTitle>
                    <CardDescription>With card-shadow-hover utility.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Hover shadow applied.</p>
                  </CardContent>
                </Card>
                <Card className="glass-card glass-shadow">
                  <CardHeader>
                    <CardTitle className="text-base">Glass Card</CardTitle>
                    <CardDescription>With glass-card + glass-shadow.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Glassmorphism effect.</p>
                  </CardContent>
                </Card>
              </div>
            </Section>

            {/* ───── AVATARS ───── */}
            <Section title="Avatars">
              <div className="flex flex-wrap items-center gap-4">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">SV</AvatarFallback>
                </Avatar>
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm">RK</AvatarFallback>
                </Avatar>
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-primary text-primary-foreground">AB</AvatarFallback>
                </Avatar>
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-muted text-muted-foreground text-lg">MN</AvatarFallback>
                </Avatar>
              </div>
            </Section>

            {/* ───── TABS DEMO ───── */}
            <Section title="Tabs">
              <Tabs defaultValue="tab1" className="w-full">
                <TabsList>
                  <TabsTrigger value="tab1">Overview</TabsTrigger>
                  <TabsTrigger value="tab2">Details</TabsTrigger>
                  <TabsTrigger value="tab3">Media</TabsTrigger>
                </TabsList>
                <TabsContent value="tab1" className="mt-3">
                  <p className="text-sm text-muted-foreground">Tab 1 content — Overview section.</p>
                </TabsContent>
                <TabsContent value="tab2" className="mt-3">
                  <p className="text-sm text-muted-foreground">Tab 2 content — Details section.</p>
                </TabsContent>
                <TabsContent value="tab3" className="mt-3">
                  <p className="text-sm text-muted-foreground">Tab 3 content — Media section.</p>
                </TabsContent>
              </Tabs>
            </Section>

            {/* ───── PROGRESS ───── */}
            <Section title="Progress">
              <div className="space-y-3 max-w-md">
                {[25, 50, 75, 100].map((v) => (
                  <div key={v} className="space-y-1">
                    <span className="text-xs text-muted-foreground">{v}%</span>
                    <Progress value={v} />
                  </div>
                ))}
              </div>
            </Section>

            {/* ───── GLASSMORPHISM ───── */}
            <Section title="Glassmorphism">
              <div className="bg-gradient-subtle p-8 rounded-xl flex flex-wrap gap-6">
                <div className="glass p-6 rounded-lg w-48">
                  <p className="text-sm font-medium text-foreground">.glass</p>
                  <p className="text-xs text-muted-foreground mt-1">70% white, blur 12px</p>
                </div>
                <div className="glass-card p-6 rounded-lg w-48">
                  <p className="text-sm font-medium text-foreground">.glass-card</p>
                  <p className="text-xs text-muted-foreground mt-1">85% white, blur 20px</p>
                </div>
                <div className="glass-sidebar p-6 rounded-lg w-48">
                  <p className="text-sm font-medium text-foreground">.glass-sidebar</p>
                  <p className="text-xs text-muted-foreground mt-1">90% white, blur 24px</p>
                </div>
              </div>
            </Section>

            {/* ───── ANIMATIONS ───── */}
            <Section title="Animations & Transitions">
              <div className="flex flex-wrap gap-4">
                <div className="w-24 h-24 bg-primary/10 border border-primary/30 rounded-lg flex items-center justify-center hover-lift cursor-pointer card-shadow hover:card-shadow-hover">
                  <span className="text-xs text-foreground font-medium">hover-lift</span>
                </div>
                <div className="w-24 h-24 bg-primary/10 border border-primary/30 rounded-lg flex items-center justify-center animate-fade-up">
                  <span className="text-xs text-foreground font-medium">fade-up</span>
                </div>
                <div className="w-24 h-24 bg-primary/10 border border-primary/30 rounded-lg flex items-center justify-center animate-scale-in">
                  <span className="text-xs text-foreground font-medium">scale-in</span>
                </div>
                <div className="w-24 h-24 bg-primary/10 border border-primary/30 rounded-lg flex items-center justify-center animate-float">
                  <span className="text-xs text-foreground font-medium">float</span>
                </div>
              </div>
            </Section>

            {/* ───── SEPARATORS ───── */}
            <Section title="Separators">
              <div className="space-y-4 max-w-md">
                <Separator />
                <p className="text-xs text-muted-foreground">Horizontal separator above and below</p>
                <Separator />
                <div className="flex items-center gap-4 h-8">
                  <span className="text-sm text-foreground">Left</span>
                  <Separator orientation="vertical" />
                  <span className="text-sm text-foreground">Right</span>
                </div>
              </div>
            </Section>

          </TabsContent>

          {/* ═══════════════ TAB 2: APPLICATION USAGE ═══════════════ */}
          <TabsContent value="app-usage" className="space-y-10">

            <div className="bg-muted/50 border border-border rounded-xl p-6">
              <h2 className="text-lg font-semibold text-foreground mb-1">How the Design System is Used in the Application</h2>
              <p className="text-sm text-muted-foreground">
                Live visual examples showing exactly how each design token, component, and pattern appears across the Digi Devalaya platform.
              </p>
            </div>

            {/* ═══ 1. HEADER BAR — as used in Hub & Modules ═══ */}
            <Section title="1. Header Bar">
              <p className="text-xs text-muted-foreground mb-3">Used in: Temple Hub, all module pages. Tokens: <code className="text-primary font-mono">bg-card</code>, <code className="text-primary font-mono">border-border</code>, <code className="text-primary font-mono">bg-primary</code> (avatar), <code className="text-primary font-mono">rounded-full</code> (notification dot).</p>
              <div className="border border-border rounded-xl overflow-hidden">
                <div className="border-b border-border bg-card px-6 h-14 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xl font-bold text-primary">Digi Devalaya</span>
                    <Badge variant="secondary" className="text-xs gap-1"><Crown className="h-3 w-3" />Premium</Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
                      <Bell className="h-5 w-5 text-muted-foreground" />
                      <span className="absolute top-1 right-1 h-2.5 w-2.5 bg-destructive rounded-full border-2 border-card" />
                    </button>
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">SV</AvatarFallback>
                    </Avatar>
                  </div>
                </div>
                <div className="bg-muted/30 px-6 py-3">
                  <p className="text-[10px] font-mono text-muted-foreground">
                    bg-card · border-b border-border · h-14 · Avatar(bg-primary, rounded-full) · Bell + destructive dot(rounded-full) · Badge(variant="secondary")
                  </p>
                </div>
              </div>
            </Section>

            {/* ═══ 2. STATUS BANNERS ═══ */}
            <Section title="2. Status Banners">
              <p className="text-xs text-muted-foreground mb-3">Used in: Temple Hub for trial/expired/suspended states. Shows semantic color tokens in action.</p>
              <div className="space-y-3">
                {[
                  { label: "Trial", bg: "bg-warning/10", border: "border-warning/30", text: "text-warning", icon: Clock, msg: "Trial Period: 14 days remaining", action: "Upgrade Now" },
                  { label: "Expired", bg: "bg-destructive/10", border: "border-destructive/30", text: "text-destructive", icon: AlertCircle, msg: "Your subscription has expired.", action: "Renew" },
                  { label: "Success", bg: "bg-success/10", border: "border-success/30", text: "text-success", icon: Check, msg: "Temple registration approved successfully!", action: "View" },
                ].map((b) => (
                  <div key={b.label} className={`${b.bg} ${b.border} border rounded-lg px-5 py-3 flex items-center justify-between`}>
                    <div className={`flex items-center gap-2 ${b.text}`}>
                      <b.icon className="h-4 w-4" />
                      <span className="text-sm font-medium">{b.msg}</span>
                    </div>
                    <button className="text-sm font-medium text-primary hover:underline">{b.action}</button>
                  </div>
                ))}
                <div className="bg-muted/30 px-5 py-2 rounded-lg">
                  <p className="text-[10px] font-mono text-muted-foreground">
                    bg-warning/10 · border-warning/30 · text-warning · bg-destructive/10 · bg-success/10 — semantic color tokens for state communication
                  </p>
                </div>
              </div>
            </Section>

            {/* ═══ 3. MODULE CARDS — as used in Hub ═══ */}
            <Section title="3. Module Cards (Hub Grid)">
              <p className="text-xs text-muted-foreground mb-3">Used in: Temple Hub module grid. Tokens: <code className="text-primary font-mono">card-shadow</code> → <code className="text-primary font-mono">card-shadow-hover</code>, <code className="text-primary font-mono">hover-lift</code>, <code className="text-primary font-mono">rounded-xl</code>, <code className="text-primary font-mono">bg-primary/10</code> icon bg.</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { title: "Temple Structure", icon: Landmark, enabled: true },
                  { title: "People & HR", icon: Users, enabled: true },
                  { title: "Events", icon: Calendar, enabled: true },
                  { title: "Crowd Mgmt", icon: MapPin, enabled: false },
                ].map((m) => (
                  <div
                    key={m.title}
                    className={`relative border border-border rounded-xl p-4 transition-all duration-200 cursor-pointer card-shadow hover:card-shadow-hover hover-lift ${!m.enabled ? "opacity-50" : ""}`}
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                      <m.icon className="h-5 w-5 text-primary" />
                    </div>
                    <p className="text-sm font-medium text-foreground">{m.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">Module description here</p>
                    {!m.enabled && (
                      <Badge variant="secondary" className="absolute top-3 right-3 text-[10px]">Coming Soon</Badge>
                    )}
                  </div>
                ))}
              </div>
              <div className="bg-muted/30 px-5 py-2 rounded-lg mt-3">
                <p className="text-[10px] font-mono text-muted-foreground">
                  rounded-xl · card-shadow · hover:card-shadow-hover · hover-lift · bg-primary/10 (icon) · text-primary (icon) · opacity-50 (disabled) · Badge(variant="secondary")
                </p>
              </div>
            </Section>

            {/* ═══ 4. SIDEBAR — as used in modules ═══ */}
            <Section title="4. Sidebar Navigation">
              <p className="text-xs text-muted-foreground mb-3">Used in: All module layouts (TempleLayout, DomainLayout). Tokens: <code className="text-primary font-mono">bg-card</code>, <code className="text-primary font-mono">border-border</code>, active = <code className="text-primary font-mono">bg-primary text-primary-foreground</code>.</p>
              <div className="border border-border rounded-xl overflow-hidden flex">
                <div className="w-56 bg-card border-r border-border p-3 space-y-1">
                  <div className="h-10 flex items-center justify-center border-b border-border mb-2">
                    <span className="text-lg font-bold text-primary">Qoo</span>
                  </div>
                  {[
                    { label: "Overview", icon: Landmark, active: true },
                    { label: "Submissions", icon: Download, active: false },
                    { label: "Temples", icon: Building2, active: false },
                    { label: "Contributors", icon: Users, active: false },
                    { label: "Settings", icon: Settings, active: false },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                        item.active
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      <span>{item.label}</span>
                    </div>
                  ))}
                  <Separator className="my-2" />
                  <div className="flex items-center gap-3 px-2 py-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs">SA</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium text-foreground">Super Admin</span>
                  </div>
                </div>
                <div className="flex-1 p-6 bg-background">
                  <p className="text-sm text-muted-foreground">Main content area</p>
                </div>
              </div>
              <div className="bg-muted/30 px-5 py-2 rounded-lg mt-3">
                <p className="text-[10px] font-mono text-muted-foreground">
                  Active: bg-primary text-primary-foreground · Inactive: text-muted-foreground hover:bg-muted · rounded-lg · border-r border-border · Avatar(bg-primary)
                </p>
              </div>
            </Section>

            {/* ═══ 5. DATA TABLE ROW ═══ */}
            <Section title="5. Data Table Pattern">
              <p className="text-xs text-muted-foreground mb-3">Used in: Temple lists, Employee lists, Event lists, Donation lists. Tokens: <code className="text-primary font-mono">border-border</code>, <code className="text-primary font-mono">hover:bg-muted/50</code>, <code className="text-primary font-mono">text-muted-foreground</code>.</p>
              <div className="border border-border rounded-xl overflow-hidden">
                <div className="bg-card px-4 py-3 border-b border-border flex items-center justify-between">
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search temples..." className="pl-9 h-9" />
                  </div>
                  <Button size="sm"><Plus className="h-4 w-4" /> Add Temple</Button>
                </div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="text-left py-2.5 px-4 font-medium text-foreground">Name</th>
                      <th className="text-left py-2.5 px-4 font-medium text-foreground">Type</th>
                      <th className="text-left py-2.5 px-4 font-medium text-foreground">Status</th>
                      <th className="text-left py-2.5 px-4 font-medium text-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {[
                      { name: "Sri Venkateswara Temple", type: "Main Temple", status: "Active" },
                      { name: "Ganesh Shrine", type: "Sub-shrine", status: "Active" },
                      { name: "Meditation Hall", type: "Hall", status: "Inactive" },
                    ].map((row) => (
                      <tr key={row.name} className="hover:bg-muted/50 transition-colors">
                        <td className="py-2.5 px-4 font-medium text-foreground">{row.name}</td>
                        <td className="py-2.5 px-4 text-muted-foreground">{row.type}</td>
                        <td className="py-2.5 px-4">
                          <Badge variant={row.status === "Active" ? "default" : "secondary"} className={row.status === "Active" ? "bg-success text-success-foreground" : ""}>{row.status}</Badge>
                        </td>
                        <td className="py-2.5 px-4">
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8"><Edit className="h-3.5 w-3.5" /></Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8"><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="bg-muted/30 px-5 py-2 rounded-lg mt-3">
                <p className="text-[10px] font-mono text-muted-foreground">
                  bg-muted/30 (header) · divide-y divide-border · hover:bg-muted/50 · Badge(bg-success) · Button(variant="ghost", size="icon") · Input with Search icon (pl-9)
                </p>
              </div>
            </Section>

            {/* ═══ 6. DETAIL PAGE HEADER ═══ */}
            <Section title="6. Detail Page Header">
              <p className="text-xs text-muted-foreground mb-3">Used in: ZoneDetail, HallRoomDetail, CounterDetail, etc. Pattern: Back button → Title + badges → action buttons.</p>
              <div className="border border-border rounded-xl overflow-hidden bg-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" className="h-8 w-8"><ArrowLeft className="h-4 w-4" /></Button>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl font-semibold text-foreground">Main Worship Zone</h2>
                        <Badge className="bg-success text-success-foreground">Active</Badge>
                        <Badge variant="outline">Worship</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5">Parent: Sri Venkateswara Temple</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm"><Edit className="h-4 w-4" /> Edit</Button>
                    <Button variant="destructive" size="sm"><Trash2 className="h-4 w-4" /> Delete</Button>
                  </div>
                </div>
                <Tabs defaultValue="overview">
                  <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="location">Location</TabsTrigger>
                    <TabsTrigger value="capacity">Capacity</TabsTrigger>
                    <TabsTrigger value="media">Media</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <div className="bg-muted/30 px-5 py-2 rounded-lg mt-3">
                <p className="text-[10px] font-mono text-muted-foreground">
                  Button(variant="ghost", size="icon") back · text-xl font-semibold · Badge(bg-success) + Badge(variant="outline") · Button(variant="outline/destructive", size="sm") · Tabs pattern
                </p>
              </div>
            </Section>

            {/* ═══ 7. METRIC CARDS ═══ */}
            <Section title="7. Dashboard Metric Cards">
              <p className="text-xs text-muted-foreground mb-3">Used in: All dashboard pages (Donations, Finance, Events, HR). Shows card + icon bg + typography hierarchy.</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Total Temples", value: "24", change: "+3 this month", icon: Building2, color: "bg-primary/10 text-primary" },
                  { label: "Active Events", value: "8", change: "2 upcoming", icon: Calendar, color: "bg-info/10 text-info" },
                  { label: "Total Donations", value: "₹4.2L", change: "+12% vs last month", icon: Heart, color: "bg-success/10 text-success" },
                  { label: "Pending Tasks", value: "15", change: "3 overdue", icon: AlertCircle, color: "bg-warning/10 text-warning" },
                ].map((m) => (
                  <Card key={m.label} className="card-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className={`w-9 h-9 rounded-lg ${m.color} flex items-center justify-center`}>
                          <m.icon className="h-4.5 w-4.5" />
                        </div>
                      </div>
                      <p className="text-2xl font-bold text-foreground">{m.value}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{m.label}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">{m.change}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="bg-muted/30 px-5 py-2 rounded-lg mt-3">
                <p className="text-[10px] font-mono text-muted-foreground">
                  Card + card-shadow · bg-primary/10 / bg-info/10 / bg-success/10 / bg-warning/10 (icon bg) · text-2xl font-bold (value) · text-xs text-muted-foreground (label) · rounded-lg
                </p>
              </div>
            </Section>

            {/* ═══ 8. FORM PATTERNS ═══ */}
            <Section title="8. Multi-Tab Modal Form">
              <p className="text-xs text-muted-foreground mb-3">Used in: Zone Modal, Counter Modal, Hall Modal. Pattern: Dialog with tabbed sections — Basic, Location, Media.</p>
              <div className="border border-border rounded-xl overflow-hidden bg-card">
                <div className="px-6 py-4 border-b border-border">
                  <h3 className="text-lg font-semibold text-foreground">Add New Zone</h3>
                  <p className="text-sm text-muted-foreground">Fill in the zone details across all sections.</p>
                </div>
                <div className="p-6">
                  <Tabs defaultValue="basic" className="w-full">
                    <TabsList className="mb-4">
                      <TabsTrigger value="basic">Basic Details</TabsTrigger>
                      <TabsTrigger value="location">Location</TabsTrigger>
                      <TabsTrigger value="media">Media</TabsTrigger>
                    </TabsList>
                    <TabsContent value="basic" className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Zone Name <span className="text-destructive">*</span></Label>
                          <Input placeholder="e.g. Main Worship Area" />
                        </div>
                        <div className="space-y-2">
                          <Label>Zone Type</Label>
                          <Select>
                            <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="worship">Worship</SelectItem>
                              <SelectItem value="queue">Queue Area</SelectItem>
                              <SelectItem value="dining">Dining</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea placeholder="Brief description of the zone..." rows={3} />
                      </div>
                      <div className="flex items-center gap-3">
                        <Switch id="form-active" defaultChecked />
                        <Label htmlFor="form-active">Active Status</Label>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
                <div className="px-6 py-4 border-t border-border bg-muted/30 flex justify-end gap-3">
                  <Button variant="outline">Cancel</Button>
                  <Button>Save Zone</Button>
                </div>
              </div>
              <div className="bg-muted/30 px-5 py-2 rounded-lg mt-3">
                <p className="text-[10px] font-mono text-muted-foreground">
                  border-b border-border (header) · Tabs with TabsList · Label + Input (grid cols-2 gap-4) · Select + SelectContent · Switch + Label · border-t bg-muted/30 (footer) · Button(variant="outline") + Button (primary)
                </p>
              </div>
            </Section>

            {/* ═══ 9. INFO CARDS IN DETAIL PAGES ═══ */}
            <Section title="9. Info Cards (Detail Pages)">
              <p className="text-xs text-muted-foreground mb-3">Used in: Zone/Hall/Counter detail Overview tab. Grid of label-value info cards inside a Card container.</p>
              <Card className="card-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Zone Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[
                      { label: "Zone Name", value: "Main Worship Area" },
                      { label: "Zone Type", value: "Worship" },
                      { label: "Status", value: "Active", isBadge: true },
                      { label: "Parent Temple", value: "Sri Venkateswara Temple" },
                      { label: "Capacity", value: "500 persons" },
                      { label: "Map Reference", value: "Block A, Grid 3-5" },
                    ].map((item) => (
                      <div key={item.label}>
                        <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                        {item.isBadge ? (
                          <Badge className="bg-success text-success-foreground">{item.value}</Badge>
                        ) : (
                          <p className="text-sm font-medium text-foreground">{item.value}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <div className="bg-muted/30 px-5 py-2 rounded-lg mt-3">
                <p className="text-[10px] font-mono text-muted-foreground">
                  Card + card-shadow · CardTitle(text-base) · grid cols-2 md:cols-3 gap-4 · text-xs text-muted-foreground (label) · text-sm font-medium (value) · Badge(bg-success)
                </p>
              </div>
            </Section>

            {/* ═══ 10. TYPOGRAPHY HIERARCHY IN PRACTICE ═══ */}
            <Section title="10. Typography Hierarchy">
              <p className="text-xs text-muted-foreground mb-3">How the font scale is applied throughout the application for consistent visual hierarchy.</p>
              <Card className="card-shadow">
                <CardContent className="p-6 space-y-4">
                  <div className="border-l-4 border-primary pl-4">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-1">Page Title (Hub, Module headers)</p>
                    <h1 className="text-2xl font-bold text-foreground">Sri Venkateswara Temple</h1>
                  </div>
                  <div className="border-l-4 border-info pl-4">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-1">Section Title (Card headers, Detail titles)</p>
                    <h2 className="text-lg font-semibold text-foreground">Temple Structure</h2>
                  </div>
                  <div className="border-l-4 border-success pl-4">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-1">Card Title</p>
                    <h3 className="text-base font-medium text-foreground">Zone Information</h3>
                  </div>
                  <div className="border-l-4 border-warning pl-4">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-1">Body / Description text</p>
                    <p className="text-sm text-muted-foreground">This zone encompasses the main worship area including the sanctum and surrounding prayer halls.</p>
                  </div>
                  <div className="border-l-4 border-border pl-4">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-1">Labels, Captions, Metadata</p>
                    <p className="text-xs text-muted-foreground">Created on 15 Jan 2024 · Last updated 3 days ago · <span className="font-mono">TNT-2024-001234</span></p>
                  </div>
                  <div className="border-l-4 border-destructive pl-4">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-1">Metric Values (Dashboards)</p>
                    <p className="text-3xl font-bold text-foreground">₹4,25,000</p>
                  </div>
                </CardContent>
              </Card>
            </Section>

            {/* ═══ 11. SHADOWS & CORNERS IN CONTEXT ═══ */}
            <Section title="11. Shadows & Corners in Context">
              <p className="text-xs text-muted-foreground mb-3">How shadow and radius tokens create depth and visual hierarchy across the interface.</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-foreground">Level 1: Flat (Sidebar items)</h4>
                  <div className="bg-card border border-border rounded-lg p-4">
                    <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm">
                      <Landmark className="h-4 w-4" /> Active Item
                    </div>
                    <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground text-sm mt-1 hover:bg-muted cursor-pointer transition-colors">
                      <Users className="h-4 w-4" /> Hover Item
                    </div>
                  </div>
                  <p className="text-[10px] font-mono text-muted-foreground">rounded-lg · no shadow · bg-primary (active) · hover:bg-muted</p>
                </div>
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-foreground">Level 2: Elevated (Cards)</h4>
                  <Card className="card-shadow">
                    <CardContent className="p-4">
                      <p className="text-sm font-medium text-foreground">Dashboard Card</p>
                      <p className="text-2xl font-bold text-foreground mt-2">128</p>
                      <p className="text-xs text-muted-foreground">Total entries</p>
                    </CardContent>
                  </Card>
                  <p className="text-[10px] font-mono text-muted-foreground">rounded-lg · card-shadow · border border-border</p>
                </div>
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-foreground">Level 3: Floating (Dropdowns)</h4>
                  <div className="bg-popover border border-border rounded-lg shadow-lg p-2 space-y-0.5">
                    <div className="px-3 py-2 rounded-md hover:bg-muted text-sm cursor-pointer flex items-center gap-2">
                      <Settings className="h-4 w-4" /> Settings
                    </div>
                    <div className="px-3 py-2 rounded-md hover:bg-muted text-sm cursor-pointer flex items-center gap-2">
                      <Info className="h-4 w-4" /> Help
                    </div>
                    <Separator />
                    <div className="px-3 py-2 rounded-md hover:bg-muted text-sm cursor-pointer flex items-center gap-2 text-destructive">
                      <LogOut className="h-4 w-4" /> Sign Out
                    </div>
                  </div>
                  <p className="text-[10px] font-mono text-muted-foreground">rounded-lg · shadow-lg · bg-popover · rounded-md (items)</p>
                </div>
              </div>
            </Section>

            {/* ═══ 12. BORDER PATTERNS ═══ */}
            <Section title="12. Border Patterns in Context">
              <p className="text-xs text-muted-foreground mb-3">How border tokens create separation, grouping, and visual boundaries across the app.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-foreground">Section Dividers</h4>
                  <div className="bg-card border border-border rounded-lg overflow-hidden">
                    <div className="px-4 py-3 border-b border-border"><span className="text-sm font-medium text-foreground">Header</span></div>
                    <div className="px-4 py-3 border-b border-border"><span className="text-sm text-muted-foreground">Row 1</span></div>
                    <div className="px-4 py-3 border-b border-border"><span className="text-sm text-muted-foreground">Row 2</span></div>
                    <div className="px-4 py-3"><span className="text-sm text-muted-foreground">Row 3</span></div>
                  </div>
                  <p className="text-[10px] font-mono text-muted-foreground">border border-border (container) · border-b border-border (dividers)</p>
                </div>
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-foreground">Accent Borders</h4>
                  <div className="space-y-2">
                    <div className="border-l-4 border-primary bg-primary/5 rounded-r-lg px-4 py-3">
                      <p className="text-sm font-medium text-foreground">Primary accent border</p>
                    </div>
                    <div className="border-l-4 border-success bg-success/5 rounded-r-lg px-4 py-3">
                      <p className="text-sm font-medium text-foreground">Success accent border</p>
                    </div>
                    <div className="border-l-4 border-destructive bg-destructive/5 rounded-r-lg px-4 py-3">
                      <p className="text-sm font-medium text-foreground">Destructive accent border</p>
                    </div>
                  </div>
                  <p className="text-[10px] font-mono text-muted-foreground">border-l-4 border-primary · bg-primary/5 · rounded-r-lg</p>
                </div>
              </div>
            </Section>

            {/* ═══ 13. GLASSMORPHISM IN USE ═══ */}
            <Section title="13. Glassmorphism in Use">
              <p className="text-xs text-muted-foreground mb-3">Used in: Landing page, featured overlays, sidebar glass effect.</p>
              <div className="brown-gradient rounded-xl p-8 flex flex-wrap gap-6">
                <div className="glass p-5 rounded-lg w-52">
                  <p className="text-sm font-semibold text-primary-foreground">Feature Card</p>
                  <p className="text-xs text-primary-foreground/70 mt-1">Glass overlay on gradient background — used on landing page.</p>
                </div>
                <div className="glass-card p-5 rounded-lg w-52">
                  <p className="text-sm font-semibold text-foreground">Stat Card</p>
                  <p className="text-2xl font-bold text-foreground mt-2">1,234</p>
                  <p className="text-xs text-muted-foreground">Total devotees</p>
                </div>
              </div>
              <div className="bg-muted/30 px-5 py-2 rounded-lg mt-3">
                <p className="text-[10px] font-mono text-muted-foreground">
                  brown-gradient (container bg) · .glass (semi-transparent) · .glass-card (higher opacity) · text-primary-foreground on dark bg
                </p>
              </div>
            </Section>

            {/* ═══ 14. COMPLETE PAGE COMPOSITION ═══ */}
            <Section title="14. Complete Page Composition">
              <p className="text-xs text-muted-foreground mb-3">A mini replica showing how all tokens compose together in a typical module page.</p>
              <div className="border border-border rounded-xl overflow-hidden" style={{ maxHeight: 420 }}>
                <div className="flex h-full">
                  {/* Mini sidebar */}
                  <div className="w-44 bg-card border-r border-border p-2 space-y-1 shrink-0">
                    <div className="h-8 flex items-center px-2 border-b border-border mb-1">
                      <span className="text-sm font-bold text-primary">Menu</span>
                    </div>
                    <div className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-primary text-primary-foreground text-xs">
                      <Landmark className="h-3 w-3" /> Temples
                    </div>
                    <div className="flex items-center gap-2 px-2 py-1.5 rounded-md text-muted-foreground text-xs hover:bg-muted">
                      <MapPin className="h-3 w-3" /> Zones
                    </div>
                    <div className="flex items-center gap-2 px-2 py-1.5 rounded-md text-muted-foreground text-xs hover:bg-muted">
                      <Building2 className="h-3 w-3" /> Halls
                    </div>
                  </div>
                  {/* Mini content */}
                  <div className="flex-1 bg-background p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-semibold text-foreground">Temples</h3>
                      <Button size="sm" className="h-7 text-xs"><Plus className="h-3 w-3" /> Add</Button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { v: "24", l: "Total" },
                        { v: "18", l: "Active" },
                      ].map((c) => (
                        <Card key={c.l} className="card-shadow">
                          <CardContent className="p-3">
                            <p className="text-lg font-bold text-foreground">{c.v}</p>
                            <p className="text-[10px] text-muted-foreground">{c.l}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    <div className="border border-border rounded-lg overflow-hidden text-xs">
                      <div className="bg-muted/30 px-3 py-2 border-b border-border font-medium text-foreground flex">
                        <span className="flex-1">Name</span><span className="w-16">Status</span>
                      </div>
                      {["Sri Venkateswara", "Ganesh Shrine"].map((n) => (
                        <div key={n} className="px-3 py-2 border-b border-border flex items-center hover:bg-muted/50 transition-colors">
                          <span className="flex-1 text-foreground">{n}</span>
                          <Badge className="bg-success text-success-foreground text-[9px] h-5">Active</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-muted/30 px-5 py-2 rounded-lg mt-3">
                <p className="text-[10px] font-mono text-muted-foreground">
                  Full composition: Sidebar(bg-card, border-r) + Content(bg-background) · Metric Cards(card-shadow) · DataTable(border, divide, hover:bg-muted/50) · All tokens working together
                </p>
              </div>
            </Section>

          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default UIKit;
