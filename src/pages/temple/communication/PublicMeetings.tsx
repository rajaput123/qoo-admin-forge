import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Plus, Search, Users, Calendar, FileText, Clock, MapPin, Video, Upload, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import SelectWithAddNew from "@/components/SelectWithAddNew";
import CustomFieldsSection, { type CustomField } from "@/components/CustomFieldsSection";

type MeetingStatus = "draft" | "scheduled" | "ongoing" | "completed" | "archived" | "cancelled";

interface Meeting {
  id: string;
  title: string;
  type: string;
  mode: string;
  structure: string;
  date: string;
  startTime: string;
  duration: string;
  venue: string;
  onlineLink: string;
  participantGroup: string;
  individuals: string[];
  maxParticipants: string;
  agenda: string;
  agendaDoc: boolean;
  sendInvitation: boolean;
  status: MeetingStatus;
  attendanceCount: number | null;
  minutesUploaded: boolean;
  decisions: string;
  actionItems: string;
  publicSummary: string;
}

const initialMeetings: Meeting[] = [
  { id: "MTG-001", title: "Q1 Trustee Board Review", type: "Trustee Meeting", mode: "In-Person", structure: "Assembly Hall", date: "2024-01-28", startTime: "10:00", duration: "2 hours", venue: "Assembly Hall - Ground Floor", onlineLink: "", participantGroup: "Trustees", individuals: ["Sri Ramesh", "Sri Govind", "Smt. Lakshmi"], maxParticipants: "15", agenda: "Review Q1 financials, temple expansion update, staffing decisions", agendaDoc: true, sendInvitation: true, status: "completed", attendanceCount: 12, minutesUploaded: true, decisions: "Approved Phase 2 expansion budget. Hired 3 new priests.", actionItems: "Finance team to prepare Phase 2 cost breakdown by Feb 15. HR to onboard priests by March 1.", publicSummary: "" },
  { id: "MTG-002", title: "Annual Donor Appreciation & Update", type: "Donor Meeting", mode: "Hybrid", structure: "Community Hall", date: "2024-03-15", startTime: "09:00", duration: "3 hours", venue: "Community Hall", onlineLink: "https://meet.temple.org/donor-2024", participantGroup: "Donors", individuals: [], maxParticipants: "100", agenda: "Annual financial transparency report, upcoming projects, donor recognition", agendaDoc: true, sendInvitation: false, status: "scheduled", attendanceCount: null, minutesUploaded: false, decisions: "", actionItems: "", publicSummary: "" },
  { id: "MTG-003", title: "Temple Expansion Community Hearing", type: "Community Consultation", mode: "In-Person", structure: "Community Hall", date: "2024-02-02", startTime: "14:00", duration: "2 hours", venue: "Community Hall", onlineLink: "", participantGroup: "Public", individuals: ["Ward Councilor", "Local Residents Assoc."], maxParticipants: "200", agenda: "Present expansion plans, address community concerns, collect feedback", agendaDoc: true, sendInvitation: true, status: "completed", attendanceCount: 156, minutesUploaded: true, decisions: "Community supports expansion with noise mitigation measures.", actionItems: "Architect to present noise mitigation plan. Next hearing in 30 days.", publicSummary: "Temple presented Phase 2 expansion plans. Community feedback was positive with requests for noise control during construction." },
  { id: "MTG-004", title: "Municipal Compliance Review", type: "Government Coordination Meeting", mode: "In-Person", structure: "Meeting Room A", date: "2024-02-14", startTime: "11:00", duration: "1.5 hours", venue: "Meeting Room A", onlineLink: "", participantGroup: "Government", individuals: ["Municipal Inspector", "Fire Safety Officer"], maxParticipants: "10", agenda: "Review fire safety compliance, crowd management plans, structural audit", agendaDoc: true, sendInvitation: true, status: "scheduled", attendanceCount: null, minutesUploaded: false, decisions: "", actionItems: "", publicSummary: "" },
  { id: "MTG-005", title: "Emergency Water Supply Discussion", type: "Crisis / Emergency Meeting", mode: "Online", structure: "Main Temple", date: "2024-02-05", startTime: "08:00", duration: "1 hour", venue: "", onlineLink: "https://meet.temple.org/emergency-water", participantGroup: "Staff", individuals: ["Head Priest", "Maintenance Lead", "Admin Head"], maxParticipants: "", agenda: "Address water supply disruption, arrange tanker service, rationing plan", agendaDoc: false, sendInvitation: false, status: "completed", attendanceCount: 8, minutesUploaded: true, decisions: "Tanker service arranged for 7 days. Rationing protocol activated.", actionItems: "Maintenance to fix pipeline by Feb 12. Finance to release emergency funds.", publicSummary: "" },
  { id: "MTG-006", title: "Festival Committee Planning", type: "Trustee Meeting", mode: "In-Person", structure: "Assembly Hall", date: "2024-02-20", startTime: "15:00", duration: "2 hours", venue: "Assembly Hall", onlineLink: "", participantGroup: "Trustees", individuals: [], maxParticipants: "20", agenda: "", agendaDoc: false, sendInvitation: false, status: "draft", attendanceCount: null, minutesUploaded: false, decisions: "", actionItems: "", publicSummary: "" },
];

const statusConfig: Record<MeetingStatus, { label: string; class: string }> = {
  draft: { label: "Draft", class: "text-muted-foreground bg-muted border-border" },
  scheduled: { label: "Scheduled", class: "text-blue-700 bg-blue-50 border-blue-200" },
  ongoing: { label: "Ongoing", class: "text-orange-700 bg-orange-50 border-orange-200" },
  completed: { label: "Completed", class: "text-green-700 bg-green-50 border-green-200" },
  archived: { label: "Archived", class: "text-muted-foreground bg-muted/50 border-border" },
  cancelled: { label: "Cancelled", class: "text-red-700 bg-red-50 border-red-200" },
};

const emptyMeeting: Omit<Meeting, "id"> = {
  title: "", type: "Trustee Meeting", mode: "In-Person", structure: "", date: "", startTime: "",
  duration: "", venue: "", onlineLink: "", participantGroup: "", individuals: [], maxParticipants: "",
  agenda: "", agendaDoc: false, sendInvitation: false, status: "draft", attendanceCount: null,
  minutesUploaded: false, decisions: "", actionItems: "", publicSummary: "",
};

const PublicMeetings = () => {
  const [meetings, setMeetings] = useState<Meeting[]>(initialMeetings);
  const [search, setSearch] = useState("");
  const [section, setSection] = useState<string>("all");
  const [selected, setSelected] = useState<Meeting | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState<Omit<Meeting, "id">>(emptyMeeting);
  const [individualInput, setIndividualInput] = useState("");

  // Dynamic dropdown options
  const [meetingTypes, setMeetingTypes] = useState(["Trustee Meeting", "Donor Meeting", "Community Consultation", "Government Coordination Meeting", "Crisis / Emergency Meeting"]);
  const [meetingModes, setMeetingModes] = useState(["In-Person", "Online", "Hybrid"]);
  const [structuresList, setStructuresList] = useState(["Main Temple", "Sanctum Sanctorum", "Assembly Hall", "Community Hall", "Meeting Room A", "Meeting Room B"]);
  const [participantGroups, setParticipantGroups] = useState(["Trustees", "Donors", "Staff", "Public", "Government"]);

  // Custom fields
  const [createCustomFields, setCreateCustomFields] = useState<CustomField[]>([]);
  const [detailCustomFields, setDetailCustomFields] = useState<CustomField[]>([]);

  const sectionFilter = (m: Meeting) => {
    if (section === "all") return true;
    return m.status === section;
  };

  const filtered = meetings.filter(m => m.title.toLowerCase().includes(search.toLowerCase())).filter(sectionFilter);

  const counts = {
    draft: meetings.filter(m => m.status === "draft").length,
    scheduled: meetings.filter(m => m.status === "scheduled").length,
    ongoing: meetings.filter(m => m.status === "ongoing").length,
    completed: meetings.filter(m => m.status === "completed").length,
    archived: meetings.filter(m => m.status === "archived").length,
  };

  const handleCreate = () => {
    const newMeeting: Meeting = { ...form, id: `MTG-${String(meetings.length + 1).padStart(3, "0")}` };
    setMeetings(prev => [newMeeting, ...prev]);
    setForm(emptyMeeting);
    setCreateOpen(false);
    setCreateCustomFields([]);
    toast.success("Meeting created");
  };

  const updateStatus = (id: string, status: MeetingStatus) => {
    setMeetings(prev => prev.map(m => m.id === id ? { ...m, status } : m));
    setSelected(prev => prev?.id === id ? { ...prev, status } : prev);
    toast.success(`Meeting marked as ${statusConfig[status].label}`);
  };

  const addIndividual = () => {
    if (!individualInput.trim()) return;
    setForm(prev => ({ ...prev, individuals: [...prev.individuals, individualInput.trim()] }));
    setIndividualInput("");
  };

  const removeIndividual = (idx: number) => {
    setForm(prev => ({ ...prev, individuals: prev.individuals.filter((_, i) => i !== idx) }));
  };

  const updateSelectedField = (field: keyof Meeting, value: any) => {
    if (!selected) return;
    const updated = { ...selected, [field]: value };
    setSelected(updated);
    setMeetings(prev => prev.map(m => m.id === updated.id ? updated : m));
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: "Draft", value: counts.draft, icon: FileText },
          { label: "Scheduled", value: counts.scheduled, icon: Calendar },
          { label: "Ongoing", value: counts.ongoing, icon: Clock },
          { label: "Completed", value: counts.completed, icon: CheckCircle },
          { label: "Archived", value: counts.archived, icon: Users },
        ].map(kpi => (
          <Card key={kpi.label} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSection(kpi.label.toLowerCase())}>
            <CardContent className="p-4">
              <kpi.icon className="h-5 w-5 text-muted-foreground mb-2" />
              <p className="text-2xl font-bold">{kpi.value}</p>
              <p className="text-xs text-muted-foreground">{kpi.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search meetings..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={section} onValueChange={setSection}>
            <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Meetings</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="ongoing">Ongoing</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="h-4 w-4 mr-1" />Create Meeting</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader><DialogTitle>Create Meeting</DialogTitle></DialogHeader>
            <div className="space-y-5">
              <div>
                <h4 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">Basic Details</h4>
                <div className="space-y-3">
                  <div><Label>Meeting Title</Label><Input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="e.g., Q2 Trustee Board Review" /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><Label>Meeting Type</Label>
                      <SelectWithAddNew value={form.type} onValueChange={v => setForm(p => ({ ...p, type: v }))} options={meetingTypes} onAddNew={v => setMeetingTypes(p => [...p, v])} />
                    </div>
                    <div><Label>Linked Structure</Label>
                      <SelectWithAddNew value={form.structure} onValueChange={v => setForm(p => ({ ...p, structure: v }))} placeholder="Select structure" options={structuresList} onAddNew={v => setStructuresList(p => [...p, v])} />
                    </div>
                  </div>
                  <div><Label>Meeting Mode</Label>
                    <SelectWithAddNew value={form.mode} onValueChange={v => setForm(p => ({ ...p, mode: v }))} options={meetingModes} onAddNew={v => setMeetingModes(p => [...p, v])} />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">Schedule</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div><Label>Meeting Date</Label><Input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} /></div>
                  <div><Label>Start Time</Label><Input type="time" value={form.startTime} onChange={e => setForm(p => ({ ...p, startTime: e.target.value }))} /></div>
                  <div><Label>Expected Duration</Label><Input value={form.duration} onChange={e => setForm(p => ({ ...p, duration: e.target.value }))} placeholder="e.g., 2 hours" /></div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">Location</h4>
                <div className="space-y-3">
                  {(form.mode === "In-Person" || form.mode === "Hybrid") && (
                    <div><Label>Venue Name / Hall</Label><Input value={form.venue} onChange={e => setForm(p => ({ ...p, venue: e.target.value }))} placeholder="e.g., Assembly Hall - Ground Floor" /></div>
                  )}
                  {(form.mode === "Online" || form.mode === "Hybrid") && (
                    <div><Label>Online Meeting Link</Label><Input value={form.onlineLink} onChange={e => setForm(p => ({ ...p, onlineLink: e.target.value }))} placeholder="https://meet.example.com/..." /></div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">Participants</h4>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div><Label>Participant Group</Label>
                      <SelectWithAddNew value={form.participantGroup} onValueChange={v => setForm(p => ({ ...p, participantGroup: v }))} placeholder="Select group" options={participantGroups} onAddNew={v => setParticipantGroups(p => [...p, v])} />
                    </div>
                    <div><Label>Max Participants (Optional)</Label><Input value={form.maxParticipants} onChange={e => setForm(p => ({ ...p, maxParticipants: e.target.value }))} placeholder="e.g., 50" /></div>
                  </div>
                  <div>
                    <Label>Specific Individuals</Label>
                    <div className="flex gap-2 mt-1">
                      <Input value={individualInput} onChange={e => setIndividualInput(e.target.value)} placeholder="Add individual name" onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addIndividual())} />
                      <Button type="button" variant="outline" size="sm" onClick={addIndividual}>Add</Button>
                    </div>
                    {form.individuals.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {form.individuals.map((ind, i) => (
                          <Badge key={i} variant="secondary" className="cursor-pointer" onClick={() => removeIndividual(i)}>{ind} ×</Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">Agenda</h4>
                <div className="space-y-3">
                  <div><Label>Agenda Description</Label><Textarea rows={3} value={form.agenda} onChange={e => setForm(p => ({ ...p, agenda: e.target.value }))} placeholder="Describe the meeting agenda..." /></div>
                  <div className="flex items-center gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={() => setForm(p => ({ ...p, agendaDoc: true }))}><Upload className="h-3.5 w-3.5 mr-1" />Attach Agenda Document</Button>
                    {form.agendaDoc && <Badge variant="secondary">Document attached</Badge>}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">Communication (Optional)</h4>
                <div className="flex items-center gap-3">
                  <Switch checked={form.sendInvitation} onCheckedChange={v => setForm(p => ({ ...p, sendInvitation: v }))} />
                  <Label>Send Invitation via Control Center</Label>
                </div>
                {form.sendInvitation && (
                  <p className="text-xs text-muted-foreground mt-2">Invitation will be sent via SMS / Email / Push through the Control Center module.</p>
                )}
              </div>

              <CustomFieldsSection fields={createCustomFields} onFieldsChange={setCreateCustomFields} />

              <div className="flex gap-2 justify-end pt-2 border-t">
                <Button variant="outline" size="sm" onClick={() => { handleCreate(); }}>Save as Draft</Button>
                <Button size="sm" onClick={() => { setForm(p => ({ ...p, status: "scheduled" })); setTimeout(handleCreate, 0); }}>Save & Schedule</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Meetings Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Mode</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Participants</TableHead>
              <TableHead>Minutes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">No meetings found</TableCell></TableRow>
            ) : (
              filtered.map(mtg => (
                <TableRow key={mtg.id} className="cursor-pointer" onClick={() => setSelected(mtg)}>
                  <TableCell className="font-medium">{mtg.title}</TableCell>
                  <TableCell><Badge variant="secondary" className="text-xs">{mtg.type}</Badge></TableCell>
                  <TableCell className="text-xs">
                    <span className="inline-flex items-center gap-1">
                      {mtg.mode === "Online" ? <Video className="h-3 w-3" /> : mtg.mode === "Hybrid" ? <><MapPin className="h-3 w-3" /><Video className="h-3 w-3" /></> : <MapPin className="h-3 w-3" />}
                      {mtg.mode}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs">{mtg.date} {mtg.startTime}</TableCell>
                  <TableCell><Badge variant="outline" className={statusConfig[mtg.status].class}>{statusConfig[mtg.status].label}</Badge></TableCell>
                  <TableCell className="text-xs">{mtg.attendanceCount ?? "-"}</TableCell>
                  <TableCell>{mtg.minutesUploaded ? <Badge variant="outline" className="text-green-700 bg-green-50 border-green-200 text-xs">Uploaded</Badge> : <span className="text-xs text-muted-foreground">—</span>}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Detail Modal */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Meeting Details</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <Badge variant="outline" className={`${statusConfig[selected.status].class} text-sm px-3 py-1`}>{statusConfig[selected.status].label}</Badge>
                <div className="flex gap-2 flex-wrap">
                  {selected.status === "draft" && <Button size="sm" onClick={() => updateStatus(selected.id, "scheduled")}>Schedule</Button>}
                  {selected.status === "scheduled" && <Button size="sm" onClick={() => updateStatus(selected.id, "ongoing")}>Mark Started</Button>}
                  {selected.status === "ongoing" && <Button size="sm" onClick={() => updateStatus(selected.id, "completed")}>Mark Completed</Button>}
                  {selected.status === "completed" && <Button size="sm" variant="outline" onClick={() => updateStatus(selected.id, "archived")}>Archive</Button>}
                  {(selected.status === "draft" || selected.status === "scheduled") && <Button size="sm" variant="destructive" onClick={() => updateStatus(selected.id, "cancelled")}>Cancel</Button>}
                </div>
              </div>

              <Tabs defaultValue="overview">
              <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent flex-wrap">
                <TabsTrigger value="overview" className="rounded-none border-b-2 border-transparent data-[state=active]:border-amber-700 data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:font-medium px-4 py-2 text-sm text-muted-foreground">Overview</TabsTrigger>
                <TabsTrigger value="participants" className="rounded-none border-b-2 border-transparent data-[state=active]:border-amber-700 data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:font-medium px-4 py-2 text-sm text-muted-foreground">Participants</TabsTrigger>
                <TabsTrigger value="agenda" className="rounded-none border-b-2 border-transparent data-[state=active]:border-amber-700 data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:font-medium px-4 py-2 text-sm text-muted-foreground">Agenda</TabsTrigger>
                {(selected.status === "ongoing" || selected.status === "completed" || selected.status === "archived") && (
                  <TabsTrigger value="records" className="rounded-none border-b-2 border-transparent data-[state=active]:border-amber-700 data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:font-medium px-4 py-2 text-sm text-muted-foreground">Post-Meeting</TabsTrigger>
                )}
                <TabsTrigger value="custom" className="rounded-none border-b-2 border-transparent data-[state=active]:border-amber-700 data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:font-medium px-4 py-2 text-sm text-muted-foreground">Custom Fields</TabsTrigger>
              </TabsList>

                <TabsContent value="overview" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><span className="text-muted-foreground block text-xs mb-0.5">Meeting ID</span><span className="font-mono">{selected.id}</span></div>
                    <div><span className="text-muted-foreground block text-xs mb-0.5">Type</span>{selected.type}</div>
                    <div><span className="text-muted-foreground block text-xs mb-0.5">Title</span><span className="font-medium">{selected.title}</span></div>
                    <div><span className="text-muted-foreground block text-xs mb-0.5">Mode</span>{selected.mode}</div>
                    <div><span className="text-muted-foreground block text-xs mb-0.5">Date</span>{selected.date}</div>
                    <div><span className="text-muted-foreground block text-xs mb-0.5">Start Time</span>{selected.startTime}</div>
                    <div><span className="text-muted-foreground block text-xs mb-0.5">Duration</span>{selected.duration}</div>
                    <div><span className="text-muted-foreground block text-xs mb-0.5">Structure</span>{selected.structure || "—"}</div>
                    {selected.venue && <div><span className="text-muted-foreground block text-xs mb-0.5">Venue</span>{selected.venue}</div>}
                    {selected.onlineLink && <div><span className="text-muted-foreground block text-xs mb-0.5">Online Link</span><a href={selected.onlineLink} className="text-primary underline text-xs break-all">{selected.onlineLink}</a></div>}
                    <div><span className="text-muted-foreground block text-xs mb-0.5">Invitation Sent</span>{selected.sendInvitation ? "Yes (via Control Center)" : "No"}</div>
                  </div>
                </TabsContent>

                <TabsContent value="participants" className="space-y-4 mt-4">
                  <div className="text-sm space-y-3">
                    <div><span className="text-muted-foreground block text-xs mb-0.5">Participant Group</span>{selected.participantGroup || "—"}</div>
                    <div><span className="text-muted-foreground block text-xs mb-0.5">Max Participants</span>{selected.maxParticipants || "No limit"}</div>
                    <div>
                      <span className="text-muted-foreground block text-xs mb-1">Specific Individuals</span>
                      {selected.individuals.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">{selected.individuals.map((ind, i) => <Badge key={i} variant="secondary">{ind}</Badge>)}</div>
                      ) : <span className="text-muted-foreground">None specified</span>}
                    </div>
                    {selected.attendanceCount !== null && (
                      <div><span className="text-muted-foreground block text-xs mb-0.5">Recorded Attendance</span><span className="font-semibold text-lg">{selected.attendanceCount}</span></div>
                    )}
                    {selected.status === "ongoing" && (
                      <div className="pt-2 border-t">
                        <Label className="text-xs">Record Attendance Count</Label>
                        <div className="flex gap-2 mt-1">
                          <Input type="number" placeholder="Enter count" className="w-32" onChange={e => updateSelectedField("attendanceCount", parseInt(e.target.value) || 0)} />
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="agenda" className="space-y-4 mt-4">
                  <div className="text-sm space-y-3">
                    <div>
                      <span className="text-muted-foreground block text-xs mb-1">Agenda Description</span>
                      <div className="border rounded-lg p-3 bg-muted/30 whitespace-pre-wrap">{selected.agenda || "No agenda provided"}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground text-xs">Agenda Document:</span>
                      {selected.agendaDoc ? <Badge variant="outline" className="text-green-700 bg-green-50 border-green-200">Attached</Badge> : <span className="text-xs text-muted-foreground">Not attached</span>}
                    </div>
                  </div>
                </TabsContent>

                {(selected.status === "ongoing" || selected.status === "completed" || selected.status === "archived") && (
                  <TabsContent value="records" className="space-y-4 mt-4">
                    <div className="text-sm space-y-4">
                      <div>
                        <span className="text-muted-foreground block text-xs mb-0.5">Attendance Count</span>
                        {selected.status === "completed" || selected.status === "archived" ? (
                          <span className="font-semibold">{selected.attendanceCount ?? "Not recorded"}</span>
                        ) : (
                          <Input type="number" className="w-32" value={selected.attendanceCount ?? ""} onChange={e => updateSelectedField("attendanceCount", parseInt(e.target.value) || 0)} />
                        )}
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-xs mb-1">Minutes of Meeting</span>
                        {selected.minutesUploaded ? (
                          <Badge variant="outline" className="text-green-700 bg-green-50 border-green-200">Document Uploaded</Badge>
                        ) : (
                          <Button variant="outline" size="sm" onClick={() => { updateSelectedField("minutesUploaded", true); toast.success("Minutes uploaded"); }}>
                            <Upload className="h-3.5 w-3.5 mr-1" />Upload Minutes Document
                          </Button>
                        )}
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Key Decisions Taken</Label>
                        <Textarea rows={3} value={selected.decisions} onChange={e => updateSelectedField("decisions", e.target.value)} placeholder="Record key decisions made during the meeting..." />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Action Items</Label>
                        <Textarea rows={3} value={selected.actionItems} onChange={e => updateSelectedField("actionItems", e.target.value)} placeholder="List action items with owners and deadlines..." />
                      </div>
                      {(selected.type === "Community Consultation" || selected.type === "Donor Meeting") && (
                        <div>
                          <Label className="text-xs text-muted-foreground">Public Summary (Optional)</Label>
                          <Textarea rows={2} value={selected.publicSummary} onChange={e => updateSelectedField("publicSummary", e.target.value)} placeholder="Summary for public visibility..." />
                        </div>
                      )}
                      {selected.status === "ongoing" && (
                        <div className="pt-2 border-t flex justify-end">
                          <Button size="sm" onClick={() => updateStatus(selected.id, "completed")}>
                            <CheckCircle className="h-4 w-4 mr-1" />Mark Completed & Save Records
                          </Button>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                )}

                <TabsContent value="custom" className="mt-4">
                  <CustomFieldsSection fields={detailCustomFields} onFieldsChange={setDetailCustomFields} />
                </TabsContent>
              </Tabs>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PublicMeetings;