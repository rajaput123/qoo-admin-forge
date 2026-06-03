import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, UsersRound, Users, Megaphone, Search, Send, Mail, MessageSquare, Filter, Tag } from "lucide-react";
import { toast } from "sonner";
import SelectWithAddNew from "@/components/SelectWithAddNew";
import CustomFieldsSection, { CustomField } from "@/components/CustomFieldsSection";

type Segment = {
  id: string;
  name: string;
  description: string;
  type: "Dynamic" | "Static";
  criteria: string;
  memberCount: number;
  volunteerCount: number;
  lastCommunication: string;
  createdAt: string;
  members: { name: string; phone: string; type: string; city: string }[];
};

const segments: Segment[] = [
  { id: "SEG-001", name: "Frequent Visitors", description: "Devotees who visited 10+ times in the last 6 months", type: "Dynamic", criteria: "Visits ≥ 10 in last 6 months", memberCount: 186, volunteerCount: 22, lastCommunication: "2026-02-08", createdAt: "2025-06-01", members: [{ name: "Meena Iyer", phone: "+91 43210 98765", type: "Devotee", city: "Bangalore" }, { name: "Lakshmi Devi", phone: "+91 87654 32109", type: "Volunteer", city: "Chennai" }, { name: "Vijay Nair", phone: "+91 32109 87654", type: "Volunteer", city: "Kochi" }] },
  { id: "SEG-002", name: "High Donors", description: "Devotees with lifetime donations above ₹50,000", type: "Dynamic", criteria: "Total Donations ≥ ₹50,000", memberCount: 45, volunteerCount: 8, lastCommunication: "2026-02-05", createdAt: "2025-07-15", members: [{ name: "Ramesh Kumar", phone: "+91 98765 43210", type: "Devotee", city: "Bangalore" }, { name: "Lakshmi Devi", phone: "+91 87654 32109", type: "Volunteer", city: "Chennai" }, { name: "Suresh Reddy", phone: "+91 76543 21098", type: "Devotee", city: "Hyderabad" }, { name: "Priya Sharma", phone: "+91 65432 10987", type: "Devotee", city: "Mumbai" }] },
  { id: "SEG-003", name: "Volunteers", description: "All devotees with active volunteer status", type: "Dynamic", criteria: "Volunteer Status = Active", memberCount: 52, volunteerCount: 52, lastCommunication: "2026-02-09", createdAt: "2025-04-10", members: [{ name: "Lakshmi Devi", phone: "+91 87654 32109", type: "Volunteer", city: "Chennai" }, { name: "Anand Verma", phone: "+91 54321 09876", type: "Volunteer", city: "Pune" }, { name: "Vijay Nair", phone: "+91 32109 87654", type: "Volunteer", city: "Kochi" }] },
  { id: "SEG-004", name: "Festival Attendees", description: "Devotees who attended at least one festival event", type: "Dynamic", criteria: "Festival Events ≥ 1", memberCount: 328, volunteerCount: 45, lastCommunication: "2026-02-01", createdAt: "2025-09-20", members: [{ name: "Anand Verma", phone: "+91 54321 09876", type: "Volunteer", city: "Pune" }, { name: "Meena Iyer", phone: "+91 43210 98765", type: "Devotee", city: "Bangalore" }] },
  { id: "SEG-005", name: "Bangalore Devotees", description: "Devotees from Bangalore city", type: "Dynamic", criteria: "City = Bangalore", memberCount: 412, volunteerCount: 18, lastCommunication: "2026-02-06", createdAt: "2025-07-01", members: [{ name: "Ramesh Kumar", phone: "+91 98765 43210", type: "Devotee", city: "Bangalore" }, { name: "Meena Iyer", phone: "+91 43210 98765", type: "Devotee", city: "Bangalore" }] },
  { id: "SEG-006", name: "VIP Devotees", description: "Manually curated list of VIP devotees", type: "Static", criteria: "Manual Selection", memberCount: 18, volunteerCount: 3, lastCommunication: "2026-02-07", createdAt: "2025-05-01", members: [{ name: "Ramesh Kumar", phone: "+91 98765 43210", type: "Devotee", city: "Bangalore" }, { name: "Lakshmi Devi", phone: "+91 87654 32109", type: "Volunteer", city: "Chennai" }] },
  { id: "SEG-007", name: "Inactive Devotees", description: "Devotees who haven't visited in 6+ months", type: "Dynamic", criteria: "Last Visit > 6 months ago", memberCount: 101, volunteerCount: 0, lastCommunication: "2026-01-15", createdAt: "2025-10-01", members: [{ name: "Ganesh Pillai", phone: "+91 10987 65432", type: "Devotee", city: "Trivandrum" }, { name: "Arjun Menon", phone: "+91 09876 54321", type: "Devotee", city: "Calicut" }] },
];

const Groups = () => {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [viewing, setViewing] = useState<Segment | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showComm, setShowComm] = useState<Segment | null>(null);
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [segTypeOptions, setSegTypeOptions] = useState(["Dynamic", "Static"]);

  const filtered = segments.filter(g => {
    if (search && !g.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterType !== "all" && g.type !== filterType) return false;
    return true;
  });

  return (
    <div className="p-4 space-y-4 w-full overflow-x-hidden max-w-[100vw]">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Segments / Groups</h1>
            <p className="text-muted-foreground">Create dynamic or static devotee segments for targeted engagement</p>
          </div>
          <Button onClick={() => setShowAdd(true)} className="gap-2"><Plus className="h-4 w-4" />Create Segment</Button>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total Segments", value: segments.length.toString(), icon: UsersRound },
            { label: "Dynamic", value: segments.filter(s => s.type === "Dynamic").length.toString(), icon: Filter },
            { label: "Static", value: segments.filter(s => s.type === "Static").length.toString(), icon: Tag },
            { label: "Total Reach", value: segments.reduce((a, g) => a + g.memberCount, 0).toLocaleString(), icon: Users },
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

        {/* Search */}
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search segments..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <SelectWithAddNew value={filterType} onValueChange={setFilterType} placeholder="Filter type" options={["all", ...segTypeOptions]} onAddNew={v => setSegTypeOptions(p => [...p, v])} className="w-[130px] bg-background" />
          <Badge variant="secondary" className="ml-auto">{filtered.length} segments</Badge>
        </div>

        {/* Segment Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(g => (
            <Card key={g.id} className="hover:shadow-md transition-all cursor-pointer" onClick={() => setViewing(g)}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">{g.name}</CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">{g.description}</p>
                  </div>
                  <Badge variant={g.type === "Dynamic" ? "default" : "secondary"} className="text-[10px]">{g.type}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm mb-2">
                  <div className="flex items-center gap-1.5 text-muted-foreground"><Users className="h-3.5 w-3.5" />{g.memberCount} members</div>
                  {g.volunteerCount > 0 && <Badge variant="outline" className="text-[10px]">{g.volunteerCount} volunteers</Badge>}
                </div>
                <p className="text-[10px] text-muted-foreground mb-3">Criteria: {g.criteria}</p>
                <div className="flex items-center justify-between">
                  <p className="text-[10px] text-muted-foreground">Last sent: {g.lastCommunication}</p>
                  <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" onClick={e => { e.stopPropagation(); setShowComm(g); }}><Send className="h-3 w-3" />Send</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* Segment Detail Dialog */}
      <Dialog open={!!viewing} onOpenChange={() => setViewing(null)}>
        <DialogContent className="sm:max-w-[650px] max-h-[85vh] overflow-y-auto bg-background">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle>{viewing?.name}</DialogTitle>
                <DialogDescription>{viewing?.description}</DialogDescription>
              </div>
              <Badge variant={viewing?.type === "Dynamic" ? "default" : "secondary"} className="text-[10px]">{viewing?.type}</Badge>
            </div>
          </DialogHeader>
          <Tabs defaultValue="members" className="mt-2">
            <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
              <TabsTrigger value="members" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent text-sm">Members</TabsTrigger>
              <TabsTrigger value="info" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent text-sm">Details</TabsTrigger>
            </TabsList>
            <TabsContent value="members" className="mt-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-muted-foreground">{viewing?.members.length} of {viewing?.memberCount} shown</p>
                <Button variant="outline" size="sm" className="gap-1.5 text-xs"><Plus className="h-3 w-3" />Add Members</Button>
              </div>
              <Table>
                <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Phone</TableHead><TableHead>City</TableHead><TableHead>Type</TableHead></TableRow></TableHeader>
                <TableBody>
                  {viewing?.members.map((m, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium text-sm">{m.name}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{m.phone}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{m.city}</TableCell>
                      <TableCell><Badge variant={m.type === "Volunteer" ? "default" : "secondary"} className="text-[10px]">{m.type}</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            <TabsContent value="info" className="mt-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                {[
                  ["Segment ID", viewing?.id], ["Type", viewing?.type], ["Created", viewing?.createdAt],
                  ["Total Members", viewing?.memberCount], ["Volunteers", viewing?.volunteerCount],
                  ["Criteria", viewing?.criteria], ["Last Communication", viewing?.lastCommunication],
                ].map(([label, value]) => (
                  <div key={label as string} className="p-3 bg-muted/50 rounded-lg"><p className="text-xs text-muted-foreground">{label as string}</p><p className="font-medium text-sm">{String(value)}</p></div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
          <DialogFooter>
            <Button variant="outline" className="gap-2" onClick={() => { setViewing(null); setShowComm(viewing); }}><Send className="h-4 w-4" />Send Communication</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Send Communication Dialog */}
      <Dialog open={!!showComm} onOpenChange={() => setShowComm(null)}>
        <DialogContent className="sm:max-w-[500px] bg-background">
          <DialogHeader>
            <DialogTitle>Send Communication</DialogTitle>
            <DialogDescription>To: {showComm?.name} ({showComm?.memberCount} members)</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label className="text-xs mb-1.5 block">Channel</Label>
              <div className="flex gap-2">
                {[{ icon: MessageSquare, label: "SMS" }, { icon: MessageSquare, label: "WhatsApp" }, { icon: Mail, label: "Email" }].map(ch => (
                  <Button key={ch.label} variant="outline" size="sm" className="gap-1.5 flex-1"><ch.icon className="h-3.5 w-3.5" />{ch.label}</Button>
                ))}
              </div>
            </div>
            <div><Label className="text-xs">Subject</Label><Input placeholder="Message subject..." className="mt-1" /></div>
            <div><Label className="text-xs">Message</Label><Textarea placeholder="Type your message..." className="mt-1 min-h-[100px]" /></div>
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setShowComm(null)}>Cancel</Button>
            <Button onClick={() => { setShowComm(null); toast.success("Communication sent via Control Center"); }} className="gap-2"><Send className="h-4 w-4" />Send</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Segment Dialog */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="sm:max-w-[550px] max-h-[85vh] overflow-y-auto bg-background">
          <DialogHeader>
            <DialogTitle>Create New Segment</DialogTitle>
            <DialogDescription>Create a dynamic or static devotee segment</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div><Label className="text-xs">Segment Name</Label><Input placeholder="e.g. Frequent Visitors" className="mt-1" /></div>
            <div><Label className="text-xs">Description</Label><Textarea placeholder="Describe the purpose..." className="mt-1" /></div>
            <div><Label className="text-xs">Segment Type</Label><SelectWithAddNew value="" onValueChange={() => { }} placeholder="Select type" options={segTypeOptions} onAddNew={v => setSegTypeOptions(p => [...p, v])} className="mt-1 bg-background" /></div>
            <div><Label className="text-xs">Criteria / Rules</Label><Textarea placeholder="Define criteria e.g. Visits ≥ 10 in last 6 months" className="mt-1" /></div>
            <div>
              <Label className="text-xs">Add Members (Search)</Label>
              <Input placeholder="Search devotees by name/phone..." className="mt-1" />
              <p className="text-[10px] text-muted-foreground mt-1">For dynamic segments, members auto-update based on criteria</p>
            </div>
            <CustomFieldsSection fields={customFields} onFieldsChange={setCustomFields} />
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
            <Button onClick={() => { setShowAdd(false); toast.success("Segment created"); }}>Create Segment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Groups;
