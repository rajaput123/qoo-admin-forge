import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search, Newspaper, Tv, Share2, FileText } from "lucide-react";
import { toast } from "sonner";
import SelectWithAddNew from "@/components/SelectWithAddNew";
import CustomFieldsSection, { type CustomField } from "@/components/CustomFieldsSection";

const mediaRecords = [
  { id: "MED-001", title: "Press Release: Annual Festival", mediaType: "Press Release", date: "2024-02-08", platform: "Deccan Herald, Times of India", spokesperson: "Sri Ramesh Kumar", linkedEvent: "EVT-045", tone: "Positive", summary: "Official press release announcing the 5-day annual festival schedule, visitor guidelines, and special arrangements.", attachment: "festival-press-release.pdf" },
  { id: "MED-002", title: "Social Media - Festival Highlight Reel", mediaType: "Social Media Post", date: "2024-02-09", platform: "Instagram, Facebook", spokesperson: "-", linkedEvent: "EVT-045", tone: "Positive", summary: "Photo and video reel shared across social platforms showcasing Day 1 of the annual festival.", attachment: null },
  { id: "MED-003", title: "TV Interview - Temple Expansion Plans", mediaType: "TV Interview", date: "2024-02-10", platform: "Zee Kannada", spokesperson: "Sri Mohan Rao (Trustee)", linkedEvent: null, tone: "Neutral", summary: "20-minute interview covering the temple expansion project, fundraising progress, and completion timeline.", attachment: "interview-transcript.pdf" },
  { id: "MED-004", title: "Media Coverage: Heritage Restoration", mediaType: "Media Coverage", date: "2024-02-07", platform: "The Hindu", spokesperson: "-", linkedEvent: null, tone: "Positive", summary: "Newspaper article covering the ongoing heritage restoration work funded by donations. Mentions the temple trust positively.", attachment: "clipping-thehindu.jpg" },
  { id: "MED-005", title: "Press Release: Crowd Management Measures", mediaType: "Press Release", date: "2024-02-06", platform: "All Media", spokesperson: "Sri Ramesh Kumar", linkedEvent: null, tone: "Neutral", summary: "Statement issued regarding new crowd management protocols, queue systems, and safety measures for peak season.", attachment: "crowd-mgmt-statement.pdf" },
  { id: "MED-006", title: "Social Media: Annadanam Sponsorship Drive", mediaType: "Social Media Post", date: "2024-02-05", platform: "Facebook, Twitter", spokesperson: "-", linkedEvent: null, tone: "Positive", summary: "Post promoting the Annadanam sponsorship drive with donation link and impact statistics.", attachment: null },
];

const typeColors: Record<string, string> = {
  "Press Release": "text-blue-700 bg-blue-50 border-blue-200",
  "Media Coverage": "text-green-700 bg-green-50 border-green-200",
  "Social Media Post": "text-purple-700 bg-purple-50 border-purple-200",
  "TV Interview": "text-orange-700 bg-orange-50 border-orange-200",
};

const toneColors: Record<string, string> = {
  Positive: "text-green-700 bg-green-50 border-green-200",
  Neutral: "text-muted-foreground bg-muted border-border",
  Negative: "text-red-700 bg-red-50 border-red-200",
  Mixed: "text-amber-700 bg-amber-50 border-amber-200",
};

const MediaCommunication = () => {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<typeof mediaRecords[0] | null>(null);

  // Dynamic options
  const [mediaTypes, setMediaTypes] = useState(["Press Release", "Media Coverage", "Social Media Post", "TV Interview"]);
  const [tones, setTones] = useState(["Positive", "Neutral", "Negative", "Mixed"]);
  const [formType, setFormType] = useState("");
  const [formTone, setFormTone] = useState("");

  // Custom fields
  const [createCustomFields, setCreateCustomFields] = useState<CustomField[]>([]);
  const [detailCustomFields, setDetailCustomFields] = useState<CustomField[]>([]);

  const filtered = mediaRecords.filter(m => m.title.toLowerCase().includes(search.toLowerCase()));

  const typeCounts = {
    "Press Release": mediaRecords.filter(r => r.mediaType === "Press Release").length,
    "Media Coverage": mediaRecords.filter(r => r.mediaType === "Media Coverage").length,
    "Social Media Post": mediaRecords.filter(r => r.mediaType === "Social Media Post").length,
    "TV Interview": mediaRecords.filter(r => r.mediaType === "TV Interview").length,
  };

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Press Releases", value: typeCounts["Press Release"], icon: Newspaper },
          { label: "Media Coverage", value: typeCounts["Media Coverage"], icon: FileText },
          { label: "Social Media Posts", value: typeCounts["Social Media Post"], icon: Share2 },
          { label: "TV Interviews", value: typeCounts["TV Interview"], icon: Tv },
        ].map((kpi) => (
          <Card key={kpi.label}>
            <CardContent className="p-4">
              <kpi.icon className="h-5 w-5 text-muted-foreground mb-2" />
              <p className="text-2xl font-bold">{kpi.value}</p>
              <p className="text-xs text-muted-foreground">{kpi.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search + Create */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search media records..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="h-4 w-4 mr-1" />New Media Record</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
            <DialogHeader><DialogTitle>Log Media Record</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label>Title</Label><Input placeholder="Short summary of the communication" /></div>
              <div><Label>Media Type</Label>
                <SelectWithAddNew value={formType} onValueChange={setFormType} placeholder="Select type" options={mediaTypes} onAddNew={v => setMediaTypes(p => [...p, v])} />
              </div>
              <div><Label>Date of Communication</Label><Input type="date" /></div>
              <div><Label>Platform / Outlet</Label><Input placeholder="e.g., Deccan Herald, Instagram, Zee Kannada" /></div>
              <div><Label>Spokesperson / Representative</Label><Input placeholder="Person who represented the temple" /></div>
              <div><Label>Linked Event (Optional)</Label><Input placeholder="Event ID, e.g., EVT-045" /></div>
              <div><Label>Tone / Sentiment</Label>
                <SelectWithAddNew value={formTone} onValueChange={setFormTone} placeholder="Select tone" options={tones} onAddNew={v => setTones(p => [...p, v])} />
              </div>
              <div><Label>Summary / Notes</Label><Textarea rows={4} placeholder="What was communicated, key points covered..." /></div>
              <div><Label>Attachment (Optional)</Label><Input type="file" /></div>
              <CustomFieldsSection fields={createCustomFields} onFieldsChange={setCreateCustomFields} />
              <div className="flex gap-2 justify-end">
                <Button size="sm" onClick={() => toast.success("Media record logged")}><FileText className="h-4 w-4 mr-1" />Save Record</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Records Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Platform</TableHead>
              <TableHead>Spokesperson</TableHead>
              <TableHead>Tone</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((rec) => (
              <TableRow key={rec.id} className="cursor-pointer" onClick={() => setSelected(rec)}>
                <TableCell className="font-mono text-xs">{rec.id}</TableCell>
                <TableCell className="font-medium">{rec.title}</TableCell>
                <TableCell><Badge variant="outline" className={typeColors[rec.mediaType] || ""}>{rec.mediaType}</Badge></TableCell>
                <TableCell className="text-xs">{rec.date}</TableCell>
                <TableCell className="text-xs">{rec.platform}</TableCell>
                <TableCell className="text-xs">{rec.spokesperson}</TableCell>
                <TableCell><Badge variant="outline" className={toneColors[rec.tone] || ""}>{rec.tone}</Badge></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Detail Modal */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Media Record Details</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-muted-foreground">ID:</span> <span className="font-mono">{selected.id}</span></div>
                <div><span className="text-muted-foreground">Type:</span> <Badge variant="outline" className={typeColors[selected.mediaType] || ""}>{selected.mediaType}</Badge></div>
                <div><span className="text-muted-foreground">Date:</span> {selected.date}</div>
                <div><span className="text-muted-foreground">Tone:</span> <Badge variant="outline" className={toneColors[selected.tone] || ""}>{selected.tone}</Badge></div>
                <div><span className="text-muted-foreground">Platform:</span> {selected.platform}</div>
                <div><span className="text-muted-foreground">Spokesperson:</span> {selected.spokesperson}</div>
                <div><span className="text-muted-foreground">Linked Event:</span> {selected.linkedEvent || "None"}</div>
                <div><span className="text-muted-foreground">Attachment:</span> {selected.attachment || "None"}</div>
              </div>
              <div>
                <Label className="text-muted-foreground text-xs">Summary</Label>
                <p className="text-sm mt-1">{selected.summary}</p>
              </div>
              <CustomFieldsSection fields={detailCustomFields} onFieldsChange={setDetailCustomFields} />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MediaCommunication;