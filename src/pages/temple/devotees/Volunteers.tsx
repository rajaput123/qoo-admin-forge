import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Plus, Download, HandHelping, UserCheck, Clock, Calendar, ChevronLeft, ChevronRight, Shield, Heart, StickyNote, Eye, X, Globe, EyeOff } from "lucide-react";
import { toast } from "sonner";

type Volunteer = {
  id: string;
  devoteeId: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  skills: string[];
  preferredDept: string;
  availability: string;
  emergencyContact: string;
  backgroundStatus: string;
  eventsParticipated: number;
  sevasAssisted: number;
  totalHours: number;
  lastActive: string;
  status: string;
  events: { event: string; date: string; role: string; hours: number }[];
  notes: string[];
};

const volunteers: Volunteer[] = [
  { id: "VOL-001", devoteeId: "DEV-0002", name: "Lakshmi Devi", phone: "+91 87654 32109", email: "lakshmi@email.com", city: "Chennai", skills: ["Cooking", "Admin"], preferredDept: "Annadanam", availability: "Weekends", emergencyContact: "+91 99999 11111", backgroundStatus: "Verified", eventsParticipated: 12, sevasAssisted: 8, totalHours: 96, lastActive: "2026-02-08", status: "Active", events: [{ event: "Pongal Festival Seva", date: "2026-01-15", role: "Lead Cook", hours: 12 }, { event: "Weekend Annadanam", date: "2026-02-08", role: "Cooking", hours: 6 }, { event: "Sankranti Celebrations", date: "2026-01-14", role: "Admin Support", hours: 8 }], notes: ["Very dedicated, leads weekend kitchen team", "Available for emergency support"] },
  { id: "VOL-002", devoteeId: "DEV-0005", name: "Anand Verma", phone: "+91 54321 09876", email: "", city: "Pune", skills: ["Crowd Control", "Ritual Support"], preferredDept: "Operations", availability: "Festival Only", emergencyContact: "+91 88888 22222", backgroundStatus: "Verified", eventsParticipated: 8, sevasAssisted: 14, totalHours: 64, lastActive: "2026-02-06", status: "Active", events: [{ event: "Maha Shivaratri Prep", date: "2026-02-06", role: "Crowd Control", hours: 10 }, { event: "Diwali Festival", date: "2025-11-12", role: "Ritual Support", hours: 14 }], notes: ["Helps during major festivals only"] },
  { id: "VOL-003", devoteeId: "DEV-0007", name: "Vijay Nair", phone: "+91 32109 87654", email: "vijay@email.com", city: "Kochi", skills: ["Admin", "Crowd Control"], preferredDept: "Administration", availability: "Weekdays", emergencyContact: "+91 77777 33333", backgroundStatus: "Verified", eventsParticipated: 15, sevasAssisted: 10, totalHours: 120, lastActive: "2026-02-07", status: "Active", events: [{ event: "Daily Admin Support", date: "2026-02-07", role: "Admin", hours: 4 }, { event: "Special Darshan Mgmt", date: "2026-02-05", role: "Crowd Control", hours: 6 }, { event: "Monthly Planning Meet", date: "2026-02-01", role: "Admin", hours: 3 }], notes: ["Very reliable, always on time", "Can handle admin independently"] },
  { id: "VOL-004", devoteeId: "DEV-0009", name: "Ravi Shankar", phone: "+91 21098 76543", email: "ravi@email.com", city: "Bangalore", skills: ["Crowd Control", "Admin"], preferredDept: "Security", availability: "Weekends", emergencyContact: "+91 66666 44444", backgroundStatus: "Pending", eventsParticipated: 3, sevasAssisted: 2, totalHours: 24, lastActive: "2026-01-28", status: "Active", events: [{ event: "Weekend Security Duty", date: "2026-01-28", role: "Crowd Control", hours: 8 }], notes: ["New volunteer, background verification in progress"] },
  { id: "VOL-005", devoteeId: "DEV-0010", name: "Deepa Murthy", phone: "+91 10987 65432", email: "deepa@email.com", city: "Bangalore", skills: ["Cooking", "Ritual Support"], preferredDept: "Annadanam", availability: "Weekdays", emergencyContact: "+91 55555 55555", backgroundStatus: "Verified", eventsParticipated: 20, sevasAssisted: 18, totalHours: 160, lastActive: "2026-02-09", status: "Active", events: [{ event: "Daily Annadanam", date: "2026-02-09", role: "Lead Cook", hours: 5 }, { event: "Special Prasadam Prep", date: "2026-02-07", role: "Cooking", hours: 4 }], notes: ["Most experienced kitchen volunteer", "Trains new volunteers"] },
  { id: "VOL-006", devoteeId: "DEV-0011", name: "Sunita Bai", phone: "+91 09876 54321", email: "", city: "Mysore", skills: ["Admin"], preferredDept: "Front Desk", availability: "Weekends", emergencyContact: "+91 44444 66666", backgroundStatus: "Verified", eventsParticipated: 6, sevasAssisted: 4, totalHours: 48, lastActive: "2026-02-02", status: "Inactive", events: [{ event: "Weekend Front Desk", date: "2026-02-02", role: "Admin", hours: 8 }], notes: ["On leave since Feb, returning March"] },
];

const ITEMS_PER_PAGE = 8;

const Volunteers = () => {
  const [search, setSearch] = useState("");
  const [filterSkill, setFilterSkill] = useState("all");
  const [filterAvailability, setFilterAvailability] = useState("all");
  const [filterBg, setFilterBg] = useState("all");
  const [viewing, setViewing] = useState<Volunteer | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [page, setPage] = useState(1);
  const [published, setPublished] = useState<Record<string, boolean>>({
    "VOL-001": true,
    "VOL-003": true,
    "VOL-005": true,
  });

  const togglePublish = (id: string, name: string) => {
    setPublished((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      toast.success(
        next[id]
          ? `${name} is now visible on the devotee app`
          : `${name} hidden from devotee app`
      );
      return next;
    });
  };
  const [skillOptions, setSkillOptions] = useState<string[]>([
    "Cooking",
    "Crowd Control",
    "Ritual Support",
    "Admin",
    "Security",
    "Front Desk",
    "Decoration",
    "Sound & Lights",
    "Transport / Driver",
    "First Aid / Medical",
    "Photography",
    "Translation",
    "Teaching / Pravachanam",
    "Music / Bhajan",
    "Garland Making",
    "Cleaning / Housekeeping",
    "IT / Tech Support",
    "Accounting Help",
    "Donor Relations",
    "Event Coordination",
  ]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");

  const addCustomSkill = () => {
    const s = newSkill.trim();
    if (!s) return;
    if (skillOptions.some((x) => x.toLowerCase() === s.toLowerCase())) {
      toast.error("Skill already exists");
      return;
    }
    setSkillOptions((prev) => [...prev, s]);
    setSelectedSkills((prev) => [...prev, s]);
    setNewSkill("");
    toast.success(`Skill "${s}" added`);
  };

  const toggleSkill = (s: string) => {
    setSelectedSkills((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  };

  const filtered = volunteers.filter(v => {
    if (search && !v.name.toLowerCase().includes(search.toLowerCase()) && !v.phone.includes(search)) return false;
    if (filterSkill !== "all" && !v.skills.includes(filterSkill)) return false;
    if (filterAvailability !== "all" && v.availability !== filterAvailability) return false;
    if (filterBg !== "all" && v.backgroundStatus !== filterBg) return false;
    return true;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paged = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const activeCount = volunteers.filter(v => v.status === "Active").length;
  const totalHoursAll = volunteers.reduce((a, v) => a + v.totalHours, 0);

  const handleExport = () => {
    const csv = ["ID,Devotee ID,Name,Phone,Skills,Availability,Background,Events,Hours,Status", ...filtered.map(v => `${v.id},${v.devoteeId},${v.name},${v.phone},"${v.skills.join(";")}",${v.availability},${v.backgroundStatus},${v.eventsParticipated},${v.totalHours},${v.status}`)].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `volunteers-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Volunteers exported");
  };

  return (
    <div className="p-4 space-y-4 w-full overflow-x-hidden max-w-[100vw]">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Volunteers</h1>
            <p className="text-muted-foreground">Manage devotees who serve the temple</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExport} className="gap-2"><Download className="h-4 w-4" />Export</Button>
            <Button onClick={() => setShowAdd(true)} className="gap-2"><Plus className="h-4 w-4" />Add Volunteer</Button>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total Volunteers", value: volunteers.length.toString(), icon: HandHelping },
            { label: "Active", value: activeCount.toString(), icon: UserCheck },
            { label: "Total Hours", value: `${totalHoursAll}h`, icon: Clock },
            { label: "Total Events", value: volunteers.reduce((a, v) => a + v.eventsParticipated, 0).toString(), icon: Calendar },
          ].map((kpi, i) => (
            <Card key={i} className="group hover:shadow-md transition-all duration-200">
              <CardContent className="p-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-muted group-hover:bg-primary group-hover:shadow-lg transition-all duration-200 mb-2">
                  <kpi.icon className="h-5 w-5 text-muted-foreground group-hover:text-primary-foreground transition-colors duration-200" />
                </div>
                <p className="text-xl font-bold">{kpi.value}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{kpi.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search name or phone..." className="pl-9" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
          </div>
          <Select value={filterSkill} onValueChange={v => { setFilterSkill(v); setPage(1); }}>
            <SelectTrigger className="w-[150px] bg-background"><SelectValue placeholder="Skill" /></SelectTrigger>
            <SelectContent className="bg-popover">
              <SelectItem value="all">All Skills</SelectItem>
              {skillOptions.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterAvailability} onValueChange={v => { setFilterAvailability(v); setPage(1); }}>
            <SelectTrigger className="w-[150px] bg-background"><SelectValue placeholder="Availability" /></SelectTrigger>
            <SelectContent className="bg-popover">
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="Weekdays">Weekdays</SelectItem>
              <SelectItem value="Weekends">Weekends</SelectItem>
              <SelectItem value="Festival Only">Festival Only</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterBg} onValueChange={v => { setFilterBg(v); setPage(1); }}>
            <SelectTrigger className="w-[150px] bg-background"><SelectValue placeholder="Verification" /></SelectTrigger>
            <SelectContent className="bg-popover">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Verified">Verified</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
            </SelectContent>
          </Select>
          <Badge variant="secondary" className="ml-auto">{filtered.length} volunteers</Badge>
        </div>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Volunteer</TableHead>
                  <TableHead>Skills</TableHead>
                  <TableHead className="text-center">Hours</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center w-[80px]">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paged.map(v => (
                  <TableRow key={v.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setViewing(v)}>
                    <TableCell>
                      <p className="font-medium text-sm">{v.name}</p>
                      <p className="text-xs text-muted-foreground">{v.phone}</p>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap max-w-[180px]">
                        {v.skills.slice(0, 2).map(s => <Badge key={s} variant="secondary" className="text-[10px] px-1.5 py-0">{s}</Badge>)}
                        {v.skills.length > 2 && <Badge variant="secondary" className="text-[10px] px-1.5 py-0">+{v.skills.length - 2}</Badge>}
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-medium text-sm">{v.totalHours}h</TableCell>
                    <TableCell>
                      <Badge variant={v.status === "Active" ? "default" : "outline"} className="text-[10px]">{v.status}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          setViewing(v);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {paged.length === 0 && (
                  <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No volunteers match filters</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">Showing {(page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(page * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}</p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="h-8 w-8" disabled={page === 1} onClick={() => setPage(p => p - 1)}><ChevronLeft className="h-4 w-4" /></Button>
              {Array.from({ length: totalPages }, (_, i) => (
                <Button key={i} variant={page === i + 1 ? "default" : "outline"} size="icon" className="h-8 w-8" onClick={() => setPage(i + 1)}>{i + 1}</Button>
              ))}
              <Button variant="outline" size="icon" className="h-8 w-8" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}><ChevronRight className="h-4 w-4" /></Button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Volunteer Profile Dialog */}
      <Dialog open={!!viewing} onOpenChange={() => setViewing(null)}>
        <DialogContent className="sm:max-w-[650px] max-h-[85vh] overflow-y-auto bg-background">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle>{viewing?.name}</DialogTitle>
                <DialogDescription>{viewing?.id} · Linked to {viewing?.devoteeId}</DialogDescription>
              </div>
              <div className="flex gap-1.5">
                <Badge variant={viewing?.status === "Active" ? "default" : "outline"} className="text-[10px]">{viewing?.status}</Badge>
                <Badge variant="outline" className={`text-[10px] ${viewing?.backgroundStatus === "Verified" ? "text-green-700 border-green-300 bg-green-50" : "text-amber-700 border-amber-300 bg-amber-50"}`}>{viewing?.backgroundStatus}</Badge>
              </div>
            </div>
          </DialogHeader>
          <Tabs defaultValue="profile" className="mt-2">
            <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
              {[
                { value: "profile", icon: HandHelping, label: "Profile" },
                { value: "events", icon: Calendar, label: "Events" },
                { value: "notes", icon: StickyNote, label: "Notes" },
              ].map(t => (
                <TabsTrigger key={t.value} value={t.value} className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent gap-1.5 text-sm">
                  <t.icon className="h-3.5 w-3.5" />{t.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="profile" className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {[
                  ["Name", viewing?.name], ["Phone", viewing?.phone], ["Email", viewing?.email || "—"],
                  ["City", viewing?.city], ["Preferred Dept", viewing?.preferredDept], ["Availability", viewing?.availability],
                  ["Emergency Contact", viewing?.emergencyContact],
                ].map(([label, value]) => (
                  <div key={label as string} className="p-3 bg-muted/50 rounded-lg"><p className="text-xs text-muted-foreground">{label as string}</p><p className="font-medium text-sm">{String(value)}</p></div>
                ))}
              </div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1.5">Skills</p>
                <div className="flex gap-1.5">{viewing?.skills.map(s => <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>)}</div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-muted/50 rounded-lg text-center"><p className="text-xl font-bold">{viewing?.eventsParticipated}</p><p className="text-[10px] text-muted-foreground">Events</p></div>
                <div className="p-3 bg-muted/50 rounded-lg text-center"><p className="text-xl font-bold">{viewing?.sevasAssisted}</p><p className="text-[10px] text-muted-foreground">Sevas Assisted</p></div>
                <div className="p-3 bg-muted/50 rounded-lg text-center"><p className="text-xl font-bold">{viewing?.totalHours}h</p><p className="text-[10px] text-muted-foreground">Total Hours</p></div>
              </div>
            </TabsContent>

            <TabsContent value="events" className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-center">Hours</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {viewing?.events.map((e, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium text-sm">{e.event}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{e.date}</TableCell>
                      <TableCell><Badge variant="secondary" className="text-xs">{e.role}</Badge></TableCell>
                      <TableCell className="text-center text-sm font-medium">{e.hours}h</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="notes" className="mt-4">
              {viewing?.notes && viewing.notes.length > 0 ? (
                <div className="space-y-2">{viewing.notes.map((n, i) => <div key={i} className="p-3 bg-muted/50 rounded-lg text-sm">{n}</div>)}</div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">No notes</div>
              )}
              <Button variant="outline" size="sm" className="mt-3 gap-2"><Plus className="h-3.5 w-3.5" />Add Note</Button>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Add Volunteer Dialog */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="sm:max-w-[550px] max-h-[85vh] overflow-y-auto bg-background">
          <DialogHeader>
            <DialogTitle>Add Volunteer</DialogTitle>
            <DialogDescription>Convert an existing devotee or add new (auto-creates devotee record)</DialogDescription>
          </DialogHeader>
          <div className="space-y-5 mt-4">
            <div>
              <Label className="text-xs">Link to Devotee (Search by phone or name)</Label>
              <Input placeholder="Search existing devotee..." className="mt-1" />
              <p className="text-[10px] text-muted-foreground mt-1">Leave blank to auto-create a new devotee profile</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2"><Label className="text-xs">Full Name</Label><Input placeholder="Full name" className="mt-1" /></div>
              <div><Label className="text-xs">Mobile *</Label><Input placeholder="+91 XXXXX XXXXX" className="mt-1" /></div>
              <div><Label className="text-xs">Email</Label><Input placeholder="email@example.com" className="mt-1" /></div>
            </div>
            <div>
              <Label className="text-xs mb-2 block">Skills</Label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {skillOptions.map((s) => {
                  const active = selectedSkills.includes(s);
                  return (
                    <button
                      type="button"
                      key={s}
                      onClick={() => toggleSkill(s)}
                      className={`text-[11px] px-2 py-1 rounded-full border transition-colors ${
                        active
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-muted/40 hover:bg-muted border-border text-foreground"
                      }`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Add custom skill (e.g., Drone Pilot)"
                  className="h-8 text-sm"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addCustomSkill();
                    }
                  }}
                />
                <Button type="button" size="sm" variant="outline" className="h-8 gap-1" onClick={addCustomSkill}>
                  <Plus className="h-3 w-3" />
                  Add
                </Button>
              </div>
              {selectedSkills.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {selectedSkills.map((s) => (
                    <Badge key={s} variant="secondary" className="text-[10px] gap-1">
                      {s}
                      <button type="button" onClick={() => toggleSkill(s)} className="hover:text-destructive">
                        <X className="h-2.5 w-2.5" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Preferred Department</Label>
                <Select><SelectTrigger className="mt-1 bg-background"><SelectValue placeholder="Select dept" /></SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="annadanam">Annadanam</SelectItem>
                    <SelectItem value="operations">Operations</SelectItem>
                    <SelectItem value="administration">Administration</SelectItem>
                    <SelectItem value="security">Security</SelectItem>
                    <SelectItem value="front-desk">Front Desk</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Availability</Label>
                <Select><SelectTrigger className="mt-1 bg-background"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="weekdays">Weekdays</SelectItem>
                    <SelectItem value="weekends">Weekends</SelectItem>
                    <SelectItem value="festival">Festival Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div><Label className="text-xs">Emergency Contact</Label><Input placeholder="+91 XXXXX XXXXX" className="mt-1" /></div>
          </div>
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
            <Button onClick={() => { setShowAdd(false); toast.success("Volunteer added successfully"); }}>Add Volunteer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Volunteers;
