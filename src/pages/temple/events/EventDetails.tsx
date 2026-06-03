import { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  ArrowLeft, Plus, CheckCircle2, Clock, IndianRupee, Send, Archive, Download, Copy,
  TrendingUp, Users, AlertTriangle, Image, Play, X, Pencil, Save, Upload, Trash2, StickyNote,
} from "lucide-react";
import { toast } from "sonner";
import {
  getEventExpenses, getEventSevas, getEventTasks,
  structures, expenseCategories,
} from "@/data/eventData";
import type { TempleEvent } from "@/data/eventData";
import { useEventById, eventActions } from "@/modules/events/hooks";
import { Separator } from "@/components/ui/separator";

const statusColors: Record<string, string> = {
  Draft: "bg-gray-100 text-gray-700",
  Scheduled: "bg-blue-100 text-blue-700",
  Published: "bg-green-100 text-green-700",
  Ongoing: "bg-green-100 text-green-700",
  Completed: "bg-amber-100 text-amber-700",
  Cancelled: "bg-red-100 text-red-700",
  Archived: "bg-gray-200 text-gray-600",
};

const priorityColors: Record<string, string> = {
  Low: "bg-muted text-muted-foreground",
  Medium: "bg-yellow-100 text-yellow-700",
  High: "bg-orange-100 text-orange-700",
  Critical: "bg-red-100 text-red-700",
};

const sevaTypeColors: Record<string, string> = {
  Ritual: "bg-purple-100 text-purple-700",
  Darshan: "bg-blue-100 text-blue-700",
  Special: "bg-amber-100 text-amber-700",
};

const mockRegistration = {
  enabled: true, registrationStart: "2026-02-01", registrationEnd: "2026-02-14",
  maxCapacity: 5000, registeredCount: 3245, waitlistCount: 120, allowWaitlist: true,
  registrationFee: 0, approvalMode: "auto" as const, qrCheckin: true, checkedInCount: 0,
};

const mockManpower = [
  { name: "Ramesh Kumar", phone: "9876543210", category: "Devotee" },
  { name: "Anitha Rao", phone: "9876543220", category: "Volunteer" },
  { name: "Gopala Sharma (Priest)", phone: "9876543240", category: "Employee" },
  { name: "Photographer - Pixel Studio", phone: "9876543230", category: "Freelancer" },
  { name: "Venkat Kumar", phone: "9876543221", category: "Volunteer" },
  { name: "Security - Ravi Kumar", phone: "9876543242", category: "Employee" },
];

const mockLinkedSevas = [
  { name: "Suprabhatam", category: "Ritual", defaultPrice: 500, status: "Active" },
  { name: "Abhishekam", category: "Ritual", defaultPrice: 1000, status: "Active" },
  { name: "Special Darshan", category: "Darshan", defaultPrice: 300, status: "Active" },
  { name: "Kalyanotsavam", category: "Special", defaultPrice: 5000, status: "Active" },
];

const categoryColors: Record<string, string> = {
  Devotee: "bg-blue-100 text-blue-700",
  Volunteer: "bg-green-100 text-green-700",
  Freelancer: "bg-purple-100 text-purple-700",
  Employee: "bg-amber-100 text-amber-700",
};

interface ProgressNote {
  id: string;
  text: string;
  date: string;
  author: string;
  images?: string[];
  videos?: string[];
}

const EventDetails = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const event = useEventById(eventId || "");

  // Edit mode
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<TempleEvent>>({});

  // Media upload refs
  const bannerRef = useRef<HTMLInputElement>(null);
  const imagesRef = useRef<HTMLInputElement>(null);
  const videosRef = useRef<HTMLInputElement>(null);

  // Dialogs
  const [showExpenseDialog, setShowExpenseDialog] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [showProgressDialog, setShowProgressDialog] = useState(false);
  const [progressNote, setProgressNote] = useState("");
  const [progressImages, setProgressImages] = useState<string[]>([]);
  const [progressVideos, setProgressVideos] = useState<string[]>([]);
  const progressImgRef = useRef<HTMLInputElement>(null);
  const progressVidRef = useRef<HTMLInputElement>(null);

  // Progress notes (stored in localStorage for now)
  const [progressNotes, setProgressNotes] = useState<ProgressNote[]>(() => {
    try {
      const raw = localStorage.getItem(`event-notes-${eventId}`);
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  });

  if (!event) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => navigate("/temple/events")}><ArrowLeft className="h-4 w-4 mr-2" />Back to Events</Button>
        <p className="text-muted-foreground">Event not found.</p>
      </div>
    );
  }

  const hasMedia = !!(event.bannerPreview || event.imagePreviews?.length || event.videoPreviews?.length);
  const sevas = getEventSevas(event.id);
  const expenses = getEventExpenses(event.id);
  const tasks = getEventTasks(event.id);
  const totalExpenses = expenses.reduce((a, e) => a + e.amount, 0);
  const openTasks = tasks.filter(t => t.status === "Open" || t.status === "In Progress" || t.status === "Overdue");

  const isReadOnly = event.status === "Completed";

  // ---- Edit helpers ----
  const startEditing = () => {
    setEditForm({
      name: event.name,
      type: event.type,
      description: event.description,
      startDate: event.startDate,
      endDate: event.endDate,
      capacity: event.capacity,
      estimatedBudget: event.estimatedBudget,
      organizer: event.organizer,
      structureName: event.structureName,
      bannerPreview: event.bannerPreview,
      imagePreviews: event.imagePreviews ? [...event.imagePreviews] : [],
      videoPreviews: event.videoPreviews ? [...event.videoPreviews] : [],
    });
    setIsEditing(true);
  };

  const cancelEditing = () => { setIsEditing(false); setEditForm({}); };

  const saveEdits = () => {
    eventActions.updateEvent(event.id, editForm);
    setIsEditing(false);
    setEditForm({});
    toast.success("Event updated successfully!");
  };

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setEditForm(prev => ({ ...prev, bannerPreview: reader.result as string }));
    reader.readAsDataURL(file);
  };

  const handleImagesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        setEditForm(prev => ({
          ...prev,
          imagePreviews: [...(prev.imagePreviews || []), reader.result as string],
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleVideosUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        setEditForm(prev => ({
          ...prev,
          videoPreviews: [...(prev.videoPreviews || []), reader.result as string],
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeEditImage = (idx: number) => {
    setEditForm(prev => ({
      ...prev,
      imagePreviews: (prev.imagePreviews || []).filter((_, i) => i !== idx),
    }));
  };

  const removeEditVideo = (idx: number) => {
    setEditForm(prev => ({
      ...prev,
      videoPreviews: (prev.videoPreviews || []).filter((_, i) => i !== idx),
    }));
  };

  const removeBanner = () => setEditForm(prev => ({ ...prev, bannerPreview: undefined }));

  // ---- Progress notes ----
  const handleProgressImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    Array.from(e.target.files || []).forEach(file => {
      const reader = new FileReader();
      reader.onload = () => setProgressImages(prev => [...prev, reader.result as string]);
      reader.readAsDataURL(file);
    });
  };

  const handleProgressVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    Array.from(e.target.files || []).forEach(file => {
      const reader = new FileReader();
      reader.onload = () => setProgressVideos(prev => [...prev, reader.result as string]);
      reader.readAsDataURL(file);
    });
  };

  const addProgressNote = () => {
    if (!progressNote.trim() && !progressImages.length && !progressVideos.length) return;
    const note: ProgressNote = {
      id: Date.now().toString(),
      text: progressNote.trim(),
      date: new Date().toISOString().slice(0, 16).replace("T", " "),
      author: "Temple Admin",
      images: progressImages.length ? progressImages : undefined,
      videos: progressVideos.length ? progressVideos : undefined,
    };
    const next = [note, ...progressNotes];
    setProgressNotes(next);
    localStorage.setItem(`event-notes-${eventId}`, JSON.stringify(next));
    setProgressNote("");
    setProgressImages([]);
    setProgressVideos([]);
    setShowProgressDialog(false);
    toast.success("Progress update added");
  };

  const deleteProgressNote = (id: string) => {
    const next = progressNotes.filter(n => n.id !== id);
    setProgressNotes(next);
    localStorage.setItem(`event-notes-${eventId}`, JSON.stringify(next));
  };

  // ---- Lifecycle ----
  const getWorkflowPhase = () => {
    switch (event.status) {
      case "Published": return { label: "Published — Bookings, sevas & donations open", step: 1 };
      case "Ongoing": return { label: "Ongoing — Event in execution", step: 2 };
      case "Completed": return { label: "Completed — Read-only except reports", step: 3 };
      default: return { label: "Unknown", step: 0 };
    }
  };

  const phase = getWorkflowPhase();
  const canPublish = false;
  const canStart = event.status === "Published";
  const canComplete = event.status === "Ongoing";
  const canArchive = false;

  const handlePublish = () => { eventActions.updateEvent(event.id, { status: "Published" }); toast.success("Event published!"); };
  const handleStartEvent = () => { eventActions.updateEvent(event.id, { status: "Ongoing" }); toast.success("Event started!"); };
  const handleCompleteEvent = () => { if (!confirm("Mark event as completed?")) return; eventActions.updateEvent(event.id, { status: "Completed", actualSpend: totalExpenses }); toast.success("Event completed!"); };

  const handleDuplicate = () => {
    const newEvent = eventActions.createEvent({
      name: `${event.name} (Copy)`, type: event.type, templeId: event.templeId, structureId: event.structureId,
      structureName: event.structureName, startDate: new Date().toISOString().slice(0, 10),
      endDate: new Date().toISOString().slice(0, 10), estimatedBudget: event.estimatedBudget,
      actualSpend: 0, estimatedFootfall: event.estimatedFootfall, description: event.description,
      status: "Published", organizer: event.organizer, capacity: event.capacity, linkedSeva: event.linkedSeva || [],
    });
    toast.success("Event duplicated");
    navigate(`/temple/events/${newEvent.id}`);
  };

  const handleExportReport = () => {
    const csv = [["Event Report", ""], ["Event Name", event.name], ["Event ID", event.id], ["Dates", `${event.startDate} to ${event.endDate}`], ["Total Expenses", totalExpenses]].map(row => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `event-report-${event.id}.csv`; a.click();
    toast.success("Report exported");
  };

  // Current media (from edit form when editing, else from event)
  const currentBanner = isEditing ? editForm.bannerPreview : event.bannerPreview;
  const currentImages = isEditing ? (editForm.imagePreviews || []) : (event.imagePreviews || []);
  const currentVideos = isEditing ? (editForm.videoPreviews || []) : (event.videoPreviews || []);

  // Media from progress updates
  const updateImages = progressNotes.flatMap(n => (n.images || []).map(img => ({ src: img, date: n.date, author: n.author })));
  const updateVideos = progressNotes.flatMap(n => (n.videos || []).map(vid => ({ src: vid, date: n.date, author: n.author })));

  const currentHasMedia = !!(currentBanner || currentImages.length || currentVideos.length || updateImages.length || updateVideos.length);

  return (
    <div className="space-y-6">
      {/* Hidden file inputs */}
      <input ref={bannerRef} type="file" accept="image/*" className="hidden" onChange={handleBannerUpload} />
      <input ref={imagesRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImagesUpload} />
      <input ref={videosRef} type="file" accept="video/*" multiple className="hidden" onChange={handleVideosUpload} />

      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/temple/events")}><ArrowLeft className="h-4 w-4" /></Button>
            <div>
              <div className="flex items-center gap-3">
                {isEditing ? (
                  <Input value={editForm.name || ""} onChange={e => setEditForm(p => ({ ...p, name: e.target.value }))} className="text-2xl font-bold h-auto py-1 px-2 w-80" />
                ) : (
                  <h1 className="text-2xl font-bold text-foreground">{event.name}</h1>
                )}
                <Badge className={`${statusColors[event.status] || "bg-gray-100 text-gray-700"} border-0`}>{event.status}</Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {event.id} • {event.type} • {event.structureName} • {event.startDate}{event.startDate !== event.endDate ? ` → ${event.endDate}` : ""}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Edit / Save / Cancel */}
            {!isReadOnly && !isEditing && (
              <Button variant="outline" onClick={startEditing}><Pencil className="h-4 w-4 mr-2" />Edit</Button>
            )}
            {isEditing && (
              <>
                <Button variant="outline" onClick={cancelEditing}>Cancel</Button>
                <Button onClick={saveEdits} className="bg-green-600 hover:bg-green-700 text-white"><Save className="h-4 w-4 mr-2" />Save Changes</Button>
              </>
            )}
            {/* Progress Note */}
            {!isReadOnly && !isEditing && (
              <Button variant="outline" onClick={() => setShowProgressDialog(true)}><StickyNote className="h-4 w-4 mr-2" />Add Update</Button>
            )}
            {/* Lifecycle */}
            {!isEditing && canPublish && <Button onClick={handlePublish} className="bg-green-600 hover:bg-green-700"><Send className="h-4 w-4 mr-2" />Publish</Button>}
            {!isEditing && canStart && <Button onClick={handleStartEvent} className="bg-blue-600 hover:bg-blue-700 text-white"><Clock className="h-4 w-4 mr-2" />Start Event</Button>}
            {!isEditing && canComplete && <Button onClick={handleCompleteEvent} className="bg-amber-600 hover:bg-amber-700 text-white"><CheckCircle2 className="h-4 w-4 mr-2" />Complete</Button>}
            {!isEditing && event.status === "Completed" && (
              <>
                <Button variant="outline" onClick={handleDuplicate}><Copy className="h-4 w-4 mr-2" />Duplicate</Button>
                <Button variant="outline" onClick={handleExportReport}><Download className="h-4 w-4 mr-2" />Export</Button>
              </>
            )}
          </div>
        </div>

        {/* Lifecycle Progress */}
        <Card className="bg-muted/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{phase.label}</span>
              </div>
              {isReadOnly && <Badge variant="outline" className="text-xs">Read-Only</Badge>}
            </div>
            <div className="flex items-center gap-1">
              {[
                { step: 1, label: "Draft" }, { step: 2, label: "Published" },
                { step: 3, label: "Ongoing" }, { step: 4, label: "Completed" }, { step: 5, label: "Archived" },
              ].map((s, i) => (
                <div key={s.step} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${phase.step >= s.step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                      {phase.step > s.step ? "✓" : s.step}
                    </div>
                    <span className={`text-[10px] mt-1 ${phase.step >= s.step ? "text-foreground font-medium" : "text-muted-foreground"}`}>{s.label}</span>
                  </div>
                  {i < 4 && <div className={`h-0.5 flex-1 mx-1 ${phase.step > s.step ? "bg-primary" : "bg-border"}`} />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Progress Notes (if any) */}
        {progressNotes.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2"><StickyNote className="h-4 w-4" />Progress Updates ({progressNotes.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {progressNotes.slice(0, 5).map(note => (
                <div key={note.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/40 group">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
                  <div className="flex-1 min-w-0 space-y-2">
                    {note.text && <p className="text-sm">{note.text}</p>}
                    {/* Media thumbnails */}
                    {(note.images?.length || note.videos?.length) ? (
                      <div className="flex flex-wrap gap-2">
                        {note.images?.map((img, i) => (
                          <img key={i} src={img} alt="Update" className="h-16 w-16 rounded-md object-cover cursor-pointer border border-border hover:opacity-80 transition-opacity" onClick={() => setLightboxImage(img)} />
                        ))}
                        {note.videos?.map((vid, i) => (
                          <video key={i} src={vid} className="h-16 w-24 rounded-md object-cover border border-border" controls muted />
                        ))}
                      </div>
                    ) : null}
                    <p className="text-[10px] text-muted-foreground">{note.date} • {note.author}</p>
                  </div>
                  {!isReadOnly && (
                    <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" onClick={() => deleteProgressNote(note.id)}>
                      <Trash2 className="h-3 w-3 text-muted-foreground" />
                    </Button>
                  )}
                </div>
              ))}
              {progressNotes.length > 5 && <p className="text-xs text-muted-foreground pl-5">+{progressNotes.length - 5} more updates</p>}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent flex-wrap">
          {["Overview", "Media", "Registration", "Seva Linking", "Donations", "Manpower", "Expenses", "Reports"].map(tab => (
            <TabsTrigger key={tab} value={tab.toLowerCase().replace(" ", "-")} className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:font-medium px-4 py-2 text-sm text-muted-foreground">
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* ===== OVERVIEW ===== */}
        <TabsContent value="overview">
          <div className="space-y-6">
            {/* Banner quick view */}
            {currentBanner && !isEditing && (
              <div className="relative rounded-xl overflow-hidden border border-border/60 cursor-pointer group" onClick={() => setLightboxImage(currentBanner)}>
                <img src={currentBanner} alt={`${event.name} banner`} className="w-full h-56 object-cover group-hover:scale-[1.02] transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <Badge className="absolute top-3 left-3 bg-black/50 text-white border-0 text-[10px]"><Image className="h-3 w-3 mr-1" />Banner</Badge>
              </div>
            )}

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="border rounded-lg p-4 space-y-3">
                  <h3 className="font-semibold text-sm">Basic Information</h3>
                  {isEditing ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-xs">Event Type</Label>
                          <Select value={editForm.type} onValueChange={v => setEditForm(p => ({ ...p, type: v as TempleEvent["type"] }))}>
                            <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {["Festival", "Special Pooja", "Cultural", "Fundraiser", "Annadanam", "Camp", "Other", "VIP", "Public", "Special Ritual"].map(t => (
                                <SelectItem key={t} value={t}>{t}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div><Label className="text-xs">Location</Label><Input value={editForm.structureName || ""} onChange={e => setEditForm(p => ({ ...p, structureName: e.target.value }))} className="mt-1" /></div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div><Label className="text-xs">Start Date</Label><Input type="date" value={editForm.startDate || ""} onChange={e => setEditForm(p => ({ ...p, startDate: e.target.value }))} className="mt-1" /></div>
                        <div><Label className="text-xs">End Date</Label><Input type="date" value={editForm.endDate || ""} onChange={e => setEditForm(p => ({ ...p, endDate: e.target.value }))} className="mt-1" /></div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div><Label className="text-xs">Capacity</Label><Input type="number" value={editForm.capacity || 0} onChange={e => setEditForm(p => ({ ...p, capacity: Number(e.target.value) }))} className="mt-1" /></div>
                        <div><Label className="text-xs">Organizer</Label><Input value={editForm.organizer || ""} onChange={e => setEditForm(p => ({ ...p, organizer: e.target.value }))} className="mt-1" /></div>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div><p className="text-muted-foreground text-xs">Type</p><p>{event.type}</p></div>
                      <div><p className="text-muted-foreground text-xs">Location</p><p>{event.structureName}</p></div>
                      <div><p className="text-muted-foreground text-xs">Start Date</p><p>{event.startDate}</p></div>
                      <div><p className="text-muted-foreground text-xs">End Date</p><p>{event.endDate}</p></div>
                      <div><p className="text-muted-foreground text-xs">Capacity</p><p>{event.capacity.toLocaleString()}</p></div>
                      <div><p className="text-muted-foreground text-xs">Created By</p><p>{event.createdBy}</p></div>
                    </div>
                  )}
                </div>
                <div className="border rounded-lg p-4 space-y-2">
                  <h3 className="font-semibold text-sm">Description</h3>
                  {isEditing ? (
                    <Textarea value={editForm.description || ""} onChange={e => setEditForm(p => ({ ...p, description: e.target.value }))} rows={4} />
                  ) : (
                    <p className="text-sm text-muted-foreground">{event.description}</p>
                  )}
                </div>
              </div>
              <div className="space-y-4">
                <div className="border rounded-lg p-4 space-y-3">
                  <h3 className="font-semibold text-sm">Budget Summary</h3>
                  {isEditing ? (
                    <div><Label className="text-xs">Estimated Budget (₹)</Label><Input type="number" value={editForm.estimatedBudget || 0} onChange={e => setEditForm(p => ({ ...p, estimatedBudget: Number(e.target.value) }))} className="mt-1" /></div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div><p className="text-muted-foreground text-xs">Estimated Budget</p><p className="text-lg font-bold">₹{(event.estimatedBudget / 100000).toFixed(1)}L</p></div>
                      <div><p className="text-muted-foreground text-xs">Actual Spend</p><p className="text-lg font-bold">₹{(totalExpenses / 100000).toFixed(1)}L</p></div>
                      <div><p className="text-muted-foreground text-xs">Remaining</p><p className={`text-lg font-bold ${event.estimatedBudget - totalExpenses < 0 ? "text-destructive" : "text-green-600"}`}>₹{((event.estimatedBudget - totalExpenses) / 100000).toFixed(1)}L</p></div>
                      <div><p className="text-muted-foreground text-xs">Utilization</p><p className="text-lg font-bold">{event.estimatedBudget > 0 ? ((totalExpenses / event.estimatedBudget) * 100).toFixed(0) : 0}%</p></div>
                    </div>
                  )}
                </div>
                <div className="border rounded-lg p-4 space-y-3">
                  <h3 className="font-semibold text-sm">Quick Stats</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div><p className="text-muted-foreground text-xs">Sevas Linked</p><p className="font-medium">{mockLinkedSevas.length}</p></div>
                    <div><p className="text-muted-foreground text-xs">Manpower Assigned</p><p className="font-medium">{mockManpower.length}</p></div>
                    <div><p className="text-muted-foreground text-xs">Registered</p><p className="font-medium">{mockRegistration.registeredCount.toLocaleString()}</p></div>
                    <div><p className="text-muted-foreground text-xs">Open Tasks</p><p className="font-medium">{openTasks.length}</p></div>
                  </div>
                </div>
              </div>

              {/* Donation Summary */}
              <div className="col-span-2 border rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <IndianRupee className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-semibold text-sm">Donation Summary</h3>
                  <Badge variant="outline" className="text-[10px] ml-auto">Linked from Donation Management</Badge>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="border rounded-lg p-3 bg-muted/20"><p className="text-muted-foreground text-xs">Total Donations</p><p className="text-xl font-bold mt-1">₹2,45,000</p></div>
                  <div className="border rounded-lg p-3 bg-muted/20"><p className="text-muted-foreground text-xs">No. of Donors</p><p className="text-xl font-bold mt-1">38</p></div>
                  <div className="border rounded-lg p-3 bg-muted/20"><p className="text-muted-foreground text-xs">Avg. Donation</p><p className="text-xl font-bold mt-1">₹6,447</p></div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ===== MEDIA ===== */}
        <TabsContent value="media">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold">Event Media</h3>
                <p className="text-xs text-muted-foreground mt-1">Upload and manage banner, images, and videos for this event</p>
              </div>
              {!isReadOnly && !isEditing && (
                <Button variant="outline" onClick={startEditing}><Pencil className="h-4 w-4 mr-2" />Edit Media</Button>
              )}
              {isEditing && (
                <div className="flex gap-2">
                  <Button variant="outline" onClick={cancelEditing}>Cancel</Button>
                  <Button onClick={saveEdits} className="bg-green-600 hover:bg-green-700 text-white"><Save className="h-4 w-4 mr-2" />Save</Button>
                </div>
              )}
            </div>

            {/* Banner */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Banner Image</Label>
              {currentBanner ? (
                <div className="relative rounded-xl overflow-hidden border border-border/60 group">
                  <img src={currentBanner} alt="Banner" className="w-full h-56 object-cover" onClick={() => !isEditing && setLightboxImage(currentBanner)} />
                  {isEditing && (
                    <div className="absolute top-3 right-3 flex gap-2">
                      <Button size="sm" variant="secondary" className="h-8" onClick={() => bannerRef.current?.click()}><Upload className="h-3 w-3 mr-1" />Replace</Button>
                      <Button size="sm" variant="destructive" className="h-8" onClick={removeBanner}><Trash2 className="h-3 w-3" /></Button>
                    </div>
                  )}
                </div>
              ) : isEditing ? (
                <div className="border-2 border-dashed rounded-xl p-12 flex flex-col items-center gap-3 cursor-pointer hover:bg-muted/30 transition-colors" onClick={() => bannerRef.current?.click()}>
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Click to upload banner image</p>
                </div>
              ) : (
                <div className="border rounded-xl p-8 text-center text-muted-foreground text-sm">No banner uploaded</div>
              )}
            </div>

            {/* Gallery Images */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Gallery Images ({currentImages.length})</Label>
                {isEditing && (
                  <Button size="sm" variant="outline" onClick={() => imagesRef.current?.click()}><Plus className="h-3 w-3 mr-1" />Add Images</Button>
                )}
              </div>
              {currentImages.length > 0 ? (
                <div className="grid grid-cols-4 gap-3">
                  {currentImages.map((img, i) => (
                    <div key={`img-${i}`} className="relative rounded-lg overflow-hidden border border-border/60 aspect-video group">
                      <img src={img} alt={`Image ${i + 1}`} className="w-full h-full object-cover cursor-pointer" onClick={() => !isEditing && setLightboxImage(img)} />
                      {isEditing && (
                        <Button size="icon" variant="destructive" className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => removeEditImage(i)}>
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                isEditing ? (
                  <div className="border-2 border-dashed rounded-lg p-8 flex flex-col items-center gap-2 cursor-pointer hover:bg-muted/30 transition-colors" onClick={() => imagesRef.current?.click()}>
                    <Image className="h-6 w-6 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Click to add gallery images</p>
                  </div>
                ) : (
                  <div className="border rounded-lg p-6 text-center text-muted-foreground text-sm">No images uploaded</div>
                )
              )}
            </div>

            {/* Videos */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Videos ({currentVideos.length})</Label>
                {isEditing && (
                  <Button size="sm" variant="outline" onClick={() => videosRef.current?.click()}><Plus className="h-3 w-3 mr-1" />Add Videos</Button>
                )}
              </div>
              {currentVideos.length > 0 ? (
                <div className="grid grid-cols-3 gap-3">
                  {currentVideos.map((vid, i) => (
                    <div key={`vid-${i}`} className="relative rounded-lg overflow-hidden border border-border/60 aspect-video bg-black group">
                      <video src={vid} className="w-full h-full object-cover" controls playsInline preload="metadata" />
                      <Badge className="absolute top-2 left-2 bg-black/60 text-white border-0 text-[10px] pointer-events-none"><Play className="h-3 w-3 mr-1" />Video</Badge>
                      {isEditing && (
                        <Button size="icon" variant="destructive" className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => removeEditVideo(i)}>
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                isEditing ? (
                  <div className="border-2 border-dashed rounded-lg p-8 flex flex-col items-center gap-2 cursor-pointer hover:bg-muted/30 transition-colors" onClick={() => videosRef.current?.click()}>
                    <Play className="h-6 w-6 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Click to add videos</p>
                  </div>
                ) : (
                  <div className="border rounded-lg p-6 text-center text-muted-foreground text-sm">No videos uploaded</div>
                )
              )}
            </div>
            {/* From Progress Updates */}
            {(updateImages.length > 0 || updateVideos.length > 0) && (
              <>
                <Separator />
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium">From Progress Updates</Label>
                    <p className="text-xs text-muted-foreground mt-0.5">Media attached to progress updates</p>
                  </div>
                  {updateImages.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground">Images ({updateImages.length})</p>
                      <div className="grid grid-cols-4 gap-3">
                        {updateImages.map((img, i) => (
                          <div key={`upd-img-${i}`} className="relative rounded-lg overflow-hidden border border-border/60 aspect-video group">
                            <img src={img.src} alt={`Update ${i + 1}`} className="w-full h-full object-cover cursor-pointer" onClick={() => setLightboxImage(img.src)} />
                            <div className="absolute bottom-0 inset-x-0 bg-black/50 px-2 py-0.5">
                              <p className="text-[9px] text-white truncate">{img.date} • {img.author}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {updateVideos.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground">Videos ({updateVideos.length})</p>
                      <div className="grid grid-cols-3 gap-3">
                        {updateVideos.map((vid, i) => (
                          <div key={`upd-vid-${i}`} className="relative rounded-lg overflow-hidden border border-border/60 aspect-video bg-black group">
                            <video src={vid.src} className="w-full h-full object-cover" controls playsInline preload="metadata" />
                            <div className="absolute bottom-0 inset-x-0 bg-black/50 px-2 py-0.5 pointer-events-none">
                              <p className="text-[9px] text-white truncate">{vid.date} • {vid.author}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </TabsContent>

        {/* ===== REGISTRATION ===== */}
        <TabsContent value="registration">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div><h3 className="text-base font-semibold">Registration Summary</h3><p className="text-xs text-muted-foreground mt-1">Registration settings and live stats</p></div>
              <Badge variant="outline" className={mockRegistration.enabled ? "bg-green-50 text-green-700 border-green-200" : "bg-muted text-muted-foreground"}>
                {mockRegistration.enabled ? "Registration Enabled" : "Registration Disabled"}
              </Badge>
            </div>
            {mockRegistration.enabled && (
              <>
                <div className="grid grid-cols-4 gap-4">
                  <div className="border rounded-lg p-4"><p className="text-xs text-muted-foreground">Registered</p><p className="text-2xl font-bold mt-1">{mockRegistration.registeredCount.toLocaleString()}</p><p className="text-xs text-muted-foreground">of {mockRegistration.maxCapacity.toLocaleString()} max</p></div>
                  <div className="border rounded-lg p-4"><p className="text-xs text-muted-foreground">Waitlist</p><p className="text-2xl font-bold mt-1">{mockRegistration.waitlistCount}</p></div>
                  <div className="border rounded-lg p-4"><p className="text-xs text-muted-foreground">Registration Fee</p><p className="text-2xl font-bold mt-1">{mockRegistration.registrationFee === 0 ? "Free" : `₹${mockRegistration.registrationFee}`}</p></div>
                  <div className="border rounded-lg p-4"><p className="text-xs text-muted-foreground">Checked In</p><p className="text-2xl font-bold mt-1">{mockRegistration.checkedInCount}</p></div>
                </div>
                <div className="border rounded-lg p-4 space-y-3">
                  <h3 className="font-semibold text-sm">Configuration</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div><p className="text-muted-foreground text-xs">Registration Period</p><p>{mockRegistration.registrationStart} → {mockRegistration.registrationEnd}</p></div>
                    <div><p className="text-muted-foreground text-xs">Approval Mode</p><p className="capitalize">{mockRegistration.approvalMode === "auto" ? "Auto-confirm" : "Manual approval"}</p></div>
                    <div><p className="text-muted-foreground text-xs">QR-based Check-in</p><p>{mockRegistration.qrCheckin ? "Enabled" : "Disabled"}</p></div>
                    <div><p className="text-muted-foreground text-xs">Allow Waitlist</p><p>{mockRegistration.allowWaitlist ? "Yes" : "No"}</p></div>
                  </div>
                </div>
              </>
            )}
          </div>
        </TabsContent>

        {/* ===== SEVA LINKING ===== */}
        <TabsContent value="seva-linking">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div><h3 className="text-base font-semibold">Linked Sevas</h3><p className="text-xs text-muted-foreground mt-1">Sevas selected from Seva Management</p></div>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">{mockLinkedSevas.length} linked</Badge>
            </div>
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader><TableRow><TableHead>Seva Name</TableHead><TableHead>Category</TableHead><TableHead className="text-right">Default Price (₹)</TableHead><TableHead className="text-center">Status</TableHead></TableRow></TableHeader>
                <TableBody>
                  {mockLinkedSevas.length === 0 ? (
                    <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">No sevas linked</TableCell></TableRow>
                  ) : mockLinkedSevas.map((s, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{s.name}</TableCell>
                      <TableCell><Badge variant="outline" className={`text-[10px] ${sevaTypeColors[s.category] || ""}`}>{s.category}</Badge></TableCell>
                      <TableCell className="text-right tabular-nums">₹{s.defaultPrice.toLocaleString("en-IN")}</TableCell>
                      <TableCell className="text-center"><Badge variant="outline" className={`text-[10px] ${s.status === "Active" ? "bg-green-50 text-green-700 border-green-200" : "bg-muted text-muted-foreground"}`}>{s.status}</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>

        {/* ===== DONATIONS ===== */}
        <TabsContent value="donations">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div><h3 className="text-base font-semibold">Donation Summary</h3><p className="text-xs text-muted-foreground mt-1">Linked from Donation Management module</p></div>
              <Badge variant="outline" className="text-[10px]">Read-only</Badge>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="border rounded-lg p-4"><p className="text-xs text-muted-foreground">Total Donations</p><p className="text-2xl font-bold mt-1">₹2,45,000</p></div>
              <div className="border rounded-lg p-4"><p className="text-xs text-muted-foreground">No. of Donors</p><p className="text-2xl font-bold mt-1">38</p></div>
              <div className="border rounded-lg p-4"><p className="text-xs text-muted-foreground">Average Donation</p><p className="text-2xl font-bold mt-1">₹6,447</p></div>
            </div>
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader><TableRow><TableHead>Donor Name</TableHead><TableHead>Phone</TableHead><TableHead>Date</TableHead><TableHead className="text-right">Amount</TableHead></TableRow></TableHeader>
                <TableBody>
                  {[
                    { name: "Rajesh Sharma", phone: "98765 43210", date: "2026-01-15", amount: 25000 },
                    { name: "Lakshmi Devi", phone: "87654 32109", date: "2026-01-16", amount: 50000 },
                    { name: "Venkat Rao", phone: "76543 21098", date: "2026-01-17", amount: 10000 },
                    { name: "Sunita Patel", phone: "65432 10987", date: "2026-01-18", amount: 15000 },
                    { name: "Anonymous", phone: "—", date: "2026-01-19", amount: 5000 },
                  ].map((d, i) => (
                    <TableRow key={i}>
                      <TableCell className="text-sm font-medium">{d.name}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{d.phone}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{d.date}</TableCell>
                      <TableCell className="text-sm text-right font-medium">₹{d.amount.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>

        {/* ===== MANPOWER ===== */}
        <TabsContent value="manpower">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div><h3 className="text-base font-semibold">Assigned Manpower</h3><p className="text-xs text-muted-foreground mt-1">People assigned from Devotees, Volunteers, Freelancers & Employees</p></div>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">{mockManpower.length} assigned</Badge>
            </div>
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Phone</TableHead><TableHead>Category</TableHead></TableRow></TableHeader>
                <TableBody>
                  {mockManpower.length === 0 ? (
                    <TableRow><TableCell colSpan={3} className="text-center py-8 text-muted-foreground">No manpower assigned</TableCell></TableRow>
                  ) : mockManpower.map((p, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium text-sm">{p.name}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{p.phone}</TableCell>
                      <TableCell><Badge variant="outline" className={`text-[10px] ${categoryColors[p.category] || ""}`}>{p.category}</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>

        {/* ===== EXPENSES ===== */}
        <TabsContent value="expenses">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div><h3 className="text-base font-semibold">Event Expenses</h3><p className="text-xs text-muted-foreground mt-1">Track all event expenses</p></div>
              {!isReadOnly && <Button size="sm" onClick={() => setShowExpenseDialog(true)}><Plus className="h-4 w-4 mr-2" />Add Expense</Button>}
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="border rounded-lg p-3"><p className="text-xs text-muted-foreground">Budget</p><p className="text-lg font-bold">₹{(event.estimatedBudget / 100000).toFixed(1)}L</p></div>
              <div className="border rounded-lg p-3"><p className="text-xs text-muted-foreground">Actual Spend</p><p className="text-lg font-bold">₹{(totalExpenses / 100000).toFixed(1)}L</p></div>
              <div className="border rounded-lg p-3"><p className="text-xs text-muted-foreground">Variance</p><p className={`text-lg font-bold ${totalExpenses > event.estimatedBudget ? "text-destructive" : "text-green-600"}`}>{totalExpenses > event.estimatedBudget ? "-" : "+"}₹{(Math.abs(event.estimatedBudget - totalExpenses) / 100000).toFixed(1)}L</p></div>
            </div>
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader><TableRow><TableHead>Category</TableHead><TableHead>Description</TableHead><TableHead>Vendor</TableHead><TableHead className="text-right">Amount</TableHead><TableHead>Date</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
                <TableBody>
                  {expenses.length === 0 ? (
                    <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No expenses recorded</TableCell></TableRow>
                  ) : expenses.map(e => (
                    <TableRow key={e.id}>
                      <TableCell><Badge variant="outline" className="text-xs">{e.category}</Badge></TableCell>
                      <TableCell className="text-sm">{e.description}</TableCell>
                      <TableCell className="text-sm">{e.vendor}</TableCell>
                      <TableCell className="text-right font-medium">₹{e.amount.toLocaleString()}</TableCell>
                      <TableCell className="text-sm">{e.date}</TableCell>
                      <TableCell><Badge className={`text-xs border-0 ${e.status === "Paid" ? "bg-green-100 text-green-700" : e.status === "Approved" ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"}`}>{e.status}</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>

        {/* ===== REPORTS ===== */}
        <TabsContent value="reports">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold">Event Performance Report</h3>
              <Button onClick={handleExportReport} variant="outline"><Download className="h-4 w-4 mr-2" />Export CSV</Button>
            </div>
            <Card>
              <CardHeader><CardTitle className="text-base flex items-center gap-2"><IndianRupee className="h-4 w-4" />Financial Summary</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1"><p className="text-xs text-muted-foreground">Total Donations</p><p className="text-2xl font-bold text-green-600">₹2,45,000</p></div>
                  <div className="space-y-1"><p className="text-xs text-muted-foreground">Total Expenses</p><p className="text-2xl font-bold text-red-600">₹{totalExpenses.toLocaleString()}</p></div>
                  <div className="space-y-1"><p className="text-xs text-muted-foreground">Net Surplus / Deficit</p><p className={`text-2xl font-bold ${245000 - totalExpenses >= 0 ? "text-green-600" : "text-red-600"}`}>₹{(245000 - totalExpenses).toLocaleString()}</p></div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-base flex items-center gap-2"><TrendingUp className="h-4 w-4" />Performance Metrics</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1"><p className="text-xs text-muted-foreground">Registrations</p><p className="text-2xl font-bold">{mockRegistration.registeredCount.toLocaleString()}</p></div>
                  <div className="space-y-1"><p className="text-xs text-muted-foreground">Sevas Linked</p><p className="text-2xl font-bold">{mockLinkedSevas.length}</p></div>
                  <div className="space-y-1"><p className="text-xs text-muted-foreground">Manpower Assigned</p><p className="text-2xl font-bold">{mockManpower.length}</p></div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-base">Event Timeline</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm"><div className="w-2 h-2 rounded-full bg-green-500" /><div className="flex-1"><p className="font-medium">Event Created</p><p className="text-xs text-muted-foreground">{event.createdAt} by {event.createdBy}</p></div></div>
                  {event.status !== "Published" && <div className="flex items-center gap-3 text-sm"><div className="w-2 h-2 rounded-full bg-blue-500" /><div className="flex-1"><p className="font-medium">Published</p></div></div>}
                  {event.status === "Ongoing" && <div className="flex items-center gap-3 text-sm"><div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /><div className="flex-1"><p className="font-medium">Event Started</p></div></div>}
                  {event.status === "Completed" && <div className="flex items-center gap-3 text-sm"><div className="w-2 h-2 rounded-full bg-amber-500" /><div className="flex-1"><p className="font-medium">Completed — {event.endDate}</p></div></div>}
                  {/* Show progress notes in timeline */}
                  {progressNotes.map(note => (
                    <div key={note.id} className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      <div className="flex-1"><p className="font-medium">{note.text}</p><p className="text-xs text-muted-foreground">{note.date} • {note.author}</p></div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Expense Dialog */}
      <Dialog open={showExpenseDialog} onOpenChange={setShowExpenseDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Add Expense</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div><Label className="text-xs">Category</Label><Input placeholder="e.g., Decoration" className="mt-1" /></div>
            <div><Label className="text-xs">Description</Label><Input placeholder="Expense description" className="mt-1" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-xs">Amount (₹)</Label><Input type="number" placeholder="Amount" className="mt-1" /></div>
              <div><Label className="text-xs">Vendor</Label><Input placeholder="Vendor name" className="mt-1" /></div>
            </div>
            <div><Label className="text-xs">Date</Label><Input type="date" className="mt-1" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowExpenseDialog(false)}>Cancel</Button>
            <Button onClick={() => { toast.success("Expense recorded"); setShowExpenseDialog(false); }}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Progress Note Dialog */}
      <input ref={progressImgRef} type="file" accept="image/*" multiple className="hidden" onChange={handleProgressImageUpload} />
      <input ref={progressVidRef} type="file" accept="video/*" multiple className="hidden" onChange={handleProgressVideoUpload} />
      <Dialog open={showProgressDialog} onOpenChange={v => { if (!v) { setProgressNote(""); setProgressImages([]); setProgressVideos([]); } setShowProgressDialog(v); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle className="flex items-center gap-2"><StickyNote className="h-4 w-4" />Add Progress Update</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label className="text-xs">Update / Note</Label>
              <Textarea
                placeholder="e.g., Decoration vendor confirmed. Stage setup starts tomorrow..."
                value={progressNote}
                onChange={e => setProgressNote(e.target.value)}
                rows={3}
                className="mt-1"
              />
            </div>
            {/* Media attachments */}
            <div className="space-y-3">
              <Label className="text-xs">Attach Media</Label>
              <div className="flex gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => progressImgRef.current?.click()}>
                  <Image className="h-4 w-4 mr-1" />Photos
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={() => progressVidRef.current?.click()}>
                  <Play className="h-4 w-4 mr-1" />Videos
                </Button>
              </div>
              {/* Preview attached media */}
              {(progressImages.length > 0 || progressVideos.length > 0) && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {progressImages.map((img, i) => (
                    <div key={`img-${i}`} className="relative group">
                      <img src={img} alt="Attached" className="h-20 w-20 rounded-md object-cover border border-border" />
                      <Button variant="ghost" size="icon" className="absolute -top-1.5 -right-1.5 h-5 w-5 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => setProgressImages(prev => prev.filter((_, idx) => idx !== i))}>
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                  {progressVideos.map((vid, i) => (
                    <div key={`vid-${i}`} className="relative group">
                      <video src={vid} className="h-20 w-28 rounded-md object-cover border border-border" muted />
                      <Button variant="ghost" size="icon" className="absolute -top-1.5 -right-1.5 h-5 w-5 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => setProgressVideos(prev => prev.filter((_, idx) => idx !== i))}>
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground">This update with media will appear in the event timeline.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setProgressNote(""); setProgressImages([]); setProgressVideos([]); setShowProgressDialog(false); }}>Cancel</Button>
            <Button onClick={addProgressNote} disabled={!progressNote.trim() && !progressImages.length && !progressVideos.length}><Plus className="h-4 w-4 mr-2" />Add Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Image Lightbox */}
      {lightboxImage && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-8" onClick={() => setLightboxImage(null)}>
          <Button variant="ghost" size="icon" className="absolute top-4 right-4 text-white hover:bg-white/20" onClick={() => setLightboxImage(null)}>
            <X className="h-5 w-5" />
          </Button>
          <img src={lightboxImage} alt="Preview" className="max-w-full max-h-full object-contain rounded-lg" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
};

export default EventDetails;
