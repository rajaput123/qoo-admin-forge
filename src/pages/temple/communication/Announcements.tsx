import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Plus, Search, Bell, Calendar, Archive, Globe, Lock } from "lucide-react";
import { toast } from "sonner";
import SelectWithAddNew from "@/components/SelectWithAddNew";
import CustomFieldsSection, { type CustomField } from "@/components/CustomFieldsSection";

const externalAnnouncements = [
  { id: "ANN-E001", title: "Maha Shivaratri Festival Schedule", category: "Festival", priority: "urgent", status: "published", publishDate: "2024-02-08", publishTime: "09:00", expiryDate: "2024-02-15", audienceScope: "All Devotees", linkedStructure: "Main Temple", pinned: true, views: 3420 },
  { id: "ANN-E002", title: "Temple Timing Change - Ekadashi", category: "Operations", priority: "important", status: "published", publishDate: "2024-02-06", publishTime: "06:00", expiryDate: "2024-02-12", audienceScope: "All Devotees", linkedStructure: null, pinned: false, views: 1850 },
  { id: "ANN-E003", title: "New Prasadam Counter Opening", category: "Infrastructure", priority: "normal", status: "draft", publishDate: "-", publishTime: "-", expiryDate: "-", audienceScope: "All Devotees", linkedStructure: "Prasadam Hall", pinned: false, views: 0 },
  { id: "ANN-E004", title: "Annual Donor Appreciation Ceremony", category: "Events", priority: "important", status: "scheduled", publishDate: "2024-03-01", publishTime: "10:00", expiryDate: "2024-03-15", audienceScope: "Donors", linkedStructure: null, pinned: false, views: 0 },
  { id: "ANN-E005", title: "Parking Lot Renovation Notice", category: "Operations", priority: "normal", status: "expired", publishDate: "2024-01-15", publishTime: "08:00", expiryDate: "2024-02-01", audienceScope: "All Devotees", linkedStructure: null, pinned: false, views: 4210 },
];

const internalAnnouncements = [
  { id: "ANN-I001", title: "New Leave Policy Update", department: "All", priority: "important", target: "All Staff", status: "published", requiresAck: true, readTracking: true, readCount: 42, totalTarget: 56 },
  { id: "ANN-I002", title: "Festival Duty Roster - Shivaratri", department: "Priests", priority: "urgent", target: "Priests", status: "published", requiresAck: true, readTracking: true, readCount: 18, totalTarget: 22 },
  { id: "ANN-I003", title: "Security Protocol Update", department: "Security", priority: "important", target: "All Staff", status: "draft", requiresAck: false, readTracking: false, readCount: 0, totalTarget: 56 },
  { id: "ANN-I004", title: "Monthly Accounts Submission Reminder", department: "Finance", priority: "normal", target: "Specific Employees", status: "published", requiresAck: true, readTracking: true, readCount: 5, totalTarget: 8 },
  { id: "ANN-I005", title: "Staff Meeting - Q1 Review", department: "Admin", priority: "normal", target: "All Staff", status: "archived", requiresAck: false, readTracking: true, readCount: 50, totalTarget: 56 },
];

const extStatusColors: Record<string, string> = {
  draft: "text-muted-foreground bg-muted border-border",
  scheduled: "text-blue-700 bg-blue-50 border-blue-200",
  published: "text-green-700 bg-green-50 border-green-200",
  expired: "text-muted-foreground bg-muted/50 border-border",
};

const intStatusColors: Record<string, string> = {
  draft: "text-muted-foreground bg-muted border-border",
  published: "text-green-700 bg-green-50 border-green-200",
  archived: "text-muted-foreground bg-muted/50 border-border",
};

const priorityColors: Record<string, string> = {
  normal: "text-muted-foreground bg-muted border-border",
  important: "text-amber-700 bg-amber-50 border-amber-200",
  urgent: "text-red-700 bg-red-50 border-red-200",
};

const Announcements = () => {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("external");
  const [createOpen, setCreateOpen] = useState(false);
  const [createType, setCreateType] = useState<"external" | "internal" | null>(null);
  const [selectedExt, setSelectedExt] = useState<typeof externalAnnouncements[0] | null>(null);
  const [selectedInt, setSelectedInt] = useState<typeof internalAnnouncements[0] | null>(null);

  // Dynamic dropdown options
  const [categories, setCategories] = useState(["Festival", "Operations", "Events", "Infrastructure", "Policy Update"]);
  const [audiences, setAudiences] = useState(["All Devotees", "Registered", "Donors", "Premium", "Custom Segment"]);
  const [structures, setStructures] = useState(["Main Temple", "Prasadam Hall", "Assembly Hall", "Community Hall"]);
  const [departments, setDepartments] = useState(["All", "Admin", "Priests", "Security", "Finance"]);
  const [targets, setTargets] = useState(["All Staff", "Priests", "Specific Employees"]);

  // Form state
  const [formCategory, setFormCategory] = useState("");
  const [formPriority, setFormPriority] = useState("");
  const [formAudience, setFormAudience] = useState("");
  const [formStructure, setFormStructure] = useState("");
  const [formDept, setFormDept] = useState("");
  const [formTarget, setFormTarget] = useState("");

  // Custom fields
  const [extCustomFields, setExtCustomFields] = useState<CustomField[]>([]);
  const [intCustomFields, setIntCustomFields] = useState<CustomField[]>([]);
  const [extDetailFields, setExtDetailFields] = useState<CustomField[]>([]);
  const [intDetailFields, setIntDetailFields] = useState<CustomField[]>([]);

  const filteredExt = externalAnnouncements.filter(a => a.title.toLowerCase().includes(search.toLowerCase()));
  const filteredInt = internalAnnouncements.filter(a => a.title.toLowerCase().includes(search.toLowerCase()));

  const extCounts = { published: externalAnnouncements.filter(a => a.status === "published").length, scheduled: externalAnnouncements.filter(a => a.status === "scheduled").length, draft: externalAnnouncements.filter(a => a.status === "draft").length, expired: externalAnnouncements.filter(a => a.status === "expired").length };
  const intCounts = { published: internalAnnouncements.filter(a => a.status === "published").length, draft: internalAnnouncements.filter(a => a.status === "draft").length, archived: internalAnnouncements.filter(a => a.status === "archived").length };

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Published (External)", value: extCounts.published, icon: Globe },
          { label: "Scheduled", value: extCounts.scheduled, icon: Calendar },
          { label: "Published (Internal)", value: intCounts.published, icon: Lock },
          { label: "Expired / Archived", value: extCounts.expired + intCounts.archived, icon: Archive },
        ].map((kpi) => (
          <Card key={kpi.label}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <kpi.icon className="h-5 w-5 text-muted-foreground" />
              </div>
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
          <Input placeholder="Search announcements..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Dialog open={createOpen} onOpenChange={(open) => { setCreateOpen(open); if (!open) setCreateType(null); }}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="h-4 w-4 mr-1" />New Announcement</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
            <DialogHeader><DialogTitle>Create Announcement</DialogTitle></DialogHeader>

            {!createType ? (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">Select announcement type:</p>
                <div className="grid grid-cols-2 gap-4">
                  <Card className="cursor-pointer hover:border-primary/50 transition-colors" onClick={() => setCreateType("external")}>
                    <CardContent className="p-4 text-center space-y-2">
                      <Globe className="h-8 w-8 mx-auto text-primary" />
                      <p className="font-medium text-sm">External (Public)</p>
                      <p className="text-xs text-muted-foreground">Visible to devotees</p>
                    </CardContent>
                  </Card>
                  <Card className="cursor-pointer hover:border-primary/50 transition-colors" onClick={() => setCreateType("internal")}>
                    <CardContent className="p-4 text-center space-y-2">
                      <Lock className="h-8 w-8 mx-auto text-primary" />
                      <p className="font-medium text-sm">Internal (Staff)</p>
                      <p className="text-xs text-muted-foreground">Staff dashboard only</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : createType === "external" ? (
              <div className="space-y-4">
                <Badge variant="outline" className="mb-2"><Globe className="h-3 w-3 mr-1" />External (Public)</Badge>
                <div><Label>Title</Label><Input placeholder="Announcement title" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Category</Label>
                    <SelectWithAddNew value={formCategory} onValueChange={setFormCategory} placeholder="Select" options={categories} onAddNew={v => setCategories(p => [...p, v])} />
                  </div>
                  <div><Label>Priority</Label>
                    <SelectWithAddNew value={formPriority} onValueChange={setFormPriority} placeholder="Select" options={["Normal", "Important", "Urgent"]} onAddNew={() => {}} />
                  </div>
                </div>
                <div><Label>Linked Structure (Optional)</Label>
                  <SelectWithAddNew value={formStructure} onValueChange={setFormStructure} placeholder="Select structure" options={structures} onAddNew={v => setStructures(p => [...p, v])} />
                </div>
                <div><Label>Audience Scope</Label>
                  <SelectWithAddNew value={formAudience} onValueChange={setFormAudience} placeholder="Select audience" options={audiences} onAddNew={v => setAudiences(p => [...p, v])} />
                </div>
                <div><Label>Content</Label><Textarea rows={4} placeholder="Rich announcement content..." /></div>
                <div><Label>Cover Image (Optional)</Label><Input type="file" accept="image/*" /></div>
                <div><Label>Attachment (Optional)</Label><Input type="file" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Publish Date</Label><Input type="date" /></div>
                  <div><Label>Publish Time</Label><Input type="time" /></div>
                </div>
                <div><Label>Expiry Date (Optional)</Label><Input type="date" /></div>
                <div className="flex items-center gap-3">
                  <Switch id="pin-top" />
                  <Label htmlFor="pin-top">Pin to Top</Label>
                </div>
                <CustomFieldsSection fields={extCustomFields} onFieldsChange={setExtCustomFields} />
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" size="sm" onClick={() => { toast.success("Saved as draft"); setCreateOpen(false); setCreateType(null); }}>Save Draft</Button>
                  <Button size="sm" onClick={() => { toast.success("Announcement published"); setCreateOpen(false); setCreateType(null); }}>Publish</Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <Badge variant="outline" className="mb-2"><Lock className="h-3 w-3 mr-1" />Internal (Staff Only)</Badge>
                <div><Label>Title</Label><Input placeholder="Announcement title" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Department</Label>
                    <SelectWithAddNew value={formDept} onValueChange={setFormDept} placeholder="Select" options={departments} onAddNew={v => setDepartments(p => [...p, v])} />
                  </div>
                  <div><Label>Priority</Label>
                    <SelectWithAddNew value={formPriority} onValueChange={setFormPriority} placeholder="Select" options={["Normal", "Important", "Urgent"]} onAddNew={() => {}} />
                  </div>
                </div>
                <div><Label>Target</Label>
                  <SelectWithAddNew value={formTarget} onValueChange={setFormTarget} placeholder="Select" options={targets} onAddNew={v => setTargets(p => [...p, v])} />
                </div>
                <div><Label>Message Content</Label><Textarea rows={4} placeholder="Staff announcement content..." /></div>
                <div><Label>Attachment (Optional)</Label><Input type="file" /></div>
                <div className="flex items-center gap-3">
                  <Switch id="req-ack" />
                  <Label htmlFor="req-ack">Requires Acknowledgement</Label>
                </div>
                <div className="flex items-center gap-3">
                  <Switch id="read-track" />
                  <Label htmlFor="read-track">Read Tracking</Label>
                </div>
                <CustomFieldsSection fields={intCustomFields} onFieldsChange={setIntCustomFields} />
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" size="sm" onClick={() => { toast.success("Saved as draft"); setCreateOpen(false); setCreateType(null); }}>Save Draft</Button>
                  <Button size="sm" onClick={() => { toast.success("Internal announcement published"); setCreateOpen(false); setCreateType(null); }}>Publish</Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabs: External / Internal */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="external"><Globe className="h-4 w-4 mr-1" />External ({externalAnnouncements.length})</TabsTrigger>
          <TabsTrigger value="internal"><Lock className="h-4 w-4 mr-1" />Internal ({internalAnnouncements.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="external" className="mt-4">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Audience</TableHead>
                  <TableHead>Publish</TableHead>
                  <TableHead>Views</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExt.map((ann) => (
                  <TableRow key={ann.id} className="cursor-pointer" onClick={() => setSelectedExt(ann)}>
                    <TableCell className="font-mono text-xs">{ann.id}</TableCell>
                    <TableCell className="font-medium">
                      {ann.pinned && <span className="text-primary mr-1">📌</span>}
                      {ann.title}
                    </TableCell>
                    <TableCell><Badge variant="secondary">{ann.category}</Badge></TableCell>
                    <TableCell><Badge variant="outline" className={priorityColors[ann.priority]}>{ann.priority}</Badge></TableCell>
                    <TableCell><Badge variant="outline" className={extStatusColors[ann.status]}>{ann.status}</Badge></TableCell>
                    <TableCell className="text-xs">{ann.audienceScope}</TableCell>
                    <TableCell className="text-xs">{ann.publishDate !== "-" ? `${ann.publishDate} ${ann.publishTime}` : "-"}</TableCell>
                    <TableCell>{ann.views.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="internal" className="mt-4">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ack</TableHead>
                  <TableHead>Read</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInt.map((ann) => (
                  <TableRow key={ann.id} className="cursor-pointer" onClick={() => setSelectedInt(ann)}>
                    <TableCell className="font-mono text-xs">{ann.id}</TableCell>
                    <TableCell className="font-medium">{ann.title}</TableCell>
                    <TableCell><Badge variant="secondary">{ann.department}</Badge></TableCell>
                    <TableCell><Badge variant="outline" className={priorityColors[ann.priority]}>{ann.priority}</Badge></TableCell>
                    <TableCell className="text-xs">{ann.target}</TableCell>
                    <TableCell><Badge variant="outline" className={intStatusColors[ann.status]}>{ann.status}</Badge></TableCell>
                    <TableCell>{ann.requiresAck ? "Yes" : "No"}</TableCell>
                    <TableCell>{ann.readTracking ? `${ann.readCount}/${ann.totalTarget}` : "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>

      {/* External Detail Modal */}
      <Dialog open={!!selectedExt} onOpenChange={() => setSelectedExt(null)}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>External Announcement</DialogTitle></DialogHeader>
          {selectedExt && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-muted-foreground">ID:</span> <span className="font-mono">{selectedExt.id}</span></div>
                <div><span className="text-muted-foreground">Status:</span> <Badge variant="outline" className={extStatusColors[selectedExt.status]}>{selectedExt.status}</Badge></div>
                <div><span className="text-muted-foreground">Category:</span> {selectedExt.category}</div>
                <div><span className="text-muted-foreground">Priority:</span> <Badge variant="outline" className={priorityColors[selectedExt.priority]}>{selectedExt.priority}</Badge></div>
                <div><span className="text-muted-foreground">Audience:</span> {selectedExt.audienceScope}</div>
                <div><span className="text-muted-foreground">Structure:</span> {selectedExt.linkedStructure || "None"}</div>
                <div><span className="text-muted-foreground">Published:</span> {selectedExt.publishDate !== "-" ? `${selectedExt.publishDate} ${selectedExt.publishTime}` : "-"}</div>
                <div><span className="text-muted-foreground">Expiry:</span> {selectedExt.expiryDate}</div>
                <div><span className="text-muted-foreground">Views:</span> {selectedExt.views.toLocaleString()}</div>
                <div><span className="text-muted-foreground">Pinned:</span> {selectedExt.pinned ? "Yes" : "No"}</div>
              </div>
              <CustomFieldsSection fields={extDetailFields} onFieldsChange={setExtDetailFields} />
              <div className="flex gap-2">
                {selectedExt.status === "draft" && <Button size="sm" onClick={() => { toast.success("Announcement published"); setSelectedExt(null); }}>Publish Now</Button>}
                {selectedExt.status === "published" && <Button variant="outline" size="sm" onClick={() => { toast.success("Announcement archived"); setSelectedExt(null); }}>Archive</Button>}
                {selectedExt.status === "scheduled" && <Button variant="outline" size="sm" onClick={() => { toast.success("Publish cancelled"); setSelectedExt(null); }}>Cancel Schedule</Button>}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Internal Detail Modal */}
      <Dialog open={!!selectedInt} onOpenChange={() => setSelectedInt(null)}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Internal Announcement</DialogTitle></DialogHeader>
          {selectedInt && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-muted-foreground">ID:</span> <span className="font-mono">{selectedInt.id}</span></div>
                <div><span className="text-muted-foreground">Status:</span> <Badge variant="outline" className={intStatusColors[selectedInt.status]}>{selectedInt.status}</Badge></div>
                <div><span className="text-muted-foreground">Department:</span> {selectedInt.department}</div>
                <div><span className="text-muted-foreground">Priority:</span> <Badge variant="outline" className={priorityColors[selectedInt.priority]}>{selectedInt.priority}</Badge></div>
                <div><span className="text-muted-foreground">Target:</span> {selectedInt.target}</div>
                <div><span className="text-muted-foreground">Requires Ack:</span> {selectedInt.requiresAck ? "Yes" : "No"}</div>
                {selectedInt.readTracking && (
                  <>
                    <div><span className="text-muted-foreground">Read:</span> {selectedInt.readCount}/{selectedInt.totalTarget}</div>
                    <div><span className="text-muted-foreground">Read %:</span> {Math.round((selectedInt.readCount / selectedInt.totalTarget) * 100)}%</div>
                  </>
                )}
              </div>
              <CustomFieldsSection fields={intDetailFields} onFieldsChange={setIntDetailFields} />
              <div className="flex gap-2">
                {selectedInt.status === "draft" && <Button size="sm" onClick={() => { toast.success("Published to staff"); setSelectedInt(null); }}>Publish</Button>}
                {selectedInt.status === "published" && <Button variant="outline" size="sm" onClick={() => { toast.success("Archived"); setSelectedInt(null); }}>Archive</Button>}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Announcements;