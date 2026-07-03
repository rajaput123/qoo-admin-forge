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
import { Send, Clock, CheckCircle, AlertTriangle, Plus, Search, MessageSquare, Zap, FileText, ScrollText } from "lucide-react";
import { toast } from "sonner";
import SelectWithAddNew from "@/components/SelectWithAddNew";
import CustomFieldsSection, { type CustomField } from "@/components/CustomFieldsSection";

// --- Data ---
const manualMessages = [
  { id: "MSG-001", title: "Maha Shivaratri Schedule", channels: "SMS, WhatsApp", audience: "All Devotees", status: "sent", scheduledAt: "2024-02-10 09:00", sentAt: "2024-02-10 09:00" },
  { id: "MSG-002", title: "Temple Closure - Maintenance", channels: "Email", audience: "Registered Donors", status: "scheduled", scheduledAt: "2024-02-12 06:00", sentAt: "-" },
  { id: "MSG-003", title: "Special Abhishekam Booking Open", channels: "Push", audience: "Premium Members", status: "sent", scheduledAt: "2024-02-09 14:30", sentAt: "2024-02-09 14:30" },
  { id: "MSG-004", title: "Emergency: Parking Change", channels: "SMS", audience: "Today's Bookings", status: "sent", scheduledAt: "-", sentAt: "2024-02-09 07:15" },
  { id: "MSG-005", title: "Annual Report Summary", channels: "Email", audience: "Donors", status: "draft", scheduledAt: "-", sentAt: "-" },
  { id: "MSG-006", title: "Volunteer Drive Reminder", channels: "WhatsApp", audience: "Seva Participants", status: "failed", scheduledAt: "2024-02-11 10:00", sentAt: "-" },
];

const autoRules = [
  { id: "RULE-001", name: "Booking Confirmation", trigger: "Booking Created", scope: "All Offerings", channel: "SMS, WhatsApp", template: "TPL-001", timing: "Immediate", status: "active" },
  { id: "RULE-002", name: "Slot Reminder", trigger: "Reminder Before Slot", scope: "All Offerings", channel: "SMS", template: "TPL-002", timing: "Before 2 hours", status: "active" },
  { id: "RULE-003", name: "Payment Receipt", trigger: "Payment Success", scope: "All Offerings", channel: "Email", template: "TPL-004", timing: "Immediate", status: "active" },
  { id: "RULE-004", name: "Donation Thank You", trigger: "Donation Received", scope: "All", channel: "SMS, Email", template: "TPL-005", timing: "Immediate", status: "active" },
  { id: "RULE-005", name: "Cancellation Notice", trigger: "Slot Cancelled", scope: "Specific Offering", channel: "SMS", template: "TPL-006", timing: "Immediate", status: "paused" },
];

const templates = [
  { id: "TPL-001", name: "Booking Confirmation", category: "Booking", channel: "SMS", language: "English", status: "active", variables: "{{DevoteeName}}, {{OfferingName}}, {{SlotTime}}, {{TempleName}}" },
  { id: "TPL-002", name: "Slot Reminder", category: "Booking", channel: "SMS", language: "English", status: "active", variables: "{{DevoteeName}}, {{OfferingName}}, {{SlotTime}}" },
  { id: "TPL-003", name: "Festival Announcement", category: "Events", channel: "WhatsApp", language: "English", status: "active", variables: "{{DevoteeName}}, {{TempleName}}" },
  { id: "TPL-004", name: "Payment Receipt", category: "Finance", channel: "Email", language: "English", status: "active", variables: "{{DevoteeName}}, {{Amount}}, {{OfferingName}}" },
  { id: "TPL-005", name: "Donation Thank You", category: "Donation", channel: "Email", language: "English", status: "active", variables: "{{DevoteeName}}, {{Amount}}, {{StructureName}}" },
  { id: "TPL-006", name: "Cancellation Notice", category: "Booking", channel: "SMS", language: "English", status: "archived", variables: "{{DevoteeName}}, {{OfferingName}}, {{SlotTime}}" },
];

const messageLogs = [
  { id: "LOG-001", messageId: "MSG-001", channel: "SMS", recipient: "+91-98765-XXXXX", status: "delivered", sentAt: "2024-02-10 09:00:12", deliveredAt: "2024-02-10 09:00:15" },
  { id: "LOG-002", messageId: "MSG-001", channel: "WhatsApp", recipient: "+91-98765-XXXXX", status: "delivered", sentAt: "2024-02-10 09:00:12", deliveredAt: "2024-02-10 09:00:14" },
  { id: "LOG-003", messageId: "MSG-003", channel: "Push", recipient: "Device-Token-XXX", status: "delivered", sentAt: "2024-02-09 14:30:05", deliveredAt: "2024-02-09 14:30:08" },
  { id: "LOG-004", messageId: "MSG-004", channel: "SMS", recipient: "+91-87654-XXXXX", status: "delivered", sentAt: "2024-02-09 07:15:00", deliveredAt: "2024-02-09 07:15:03" },
  { id: "LOG-005", messageId: "MSG-006", channel: "WhatsApp", recipient: "+91-76543-XXXXX", status: "failed", sentAt: "2024-02-11 10:00:01", deliveredAt: "-" },
];

const msgStatusColors: Record<string, string> = {
  sent: "text-green-700 bg-green-50 border-green-200",
  scheduled: "text-blue-700 bg-blue-50 border-blue-200",
  draft: "text-muted-foreground bg-muted border-border",
  failed: "text-red-700 bg-red-50 border-red-200",
  delivered: "text-green-700 bg-green-50 border-green-200",
  active: "text-green-700 bg-green-50 border-green-200",
  paused: "text-amber-700 bg-amber-50 border-amber-200",
  archived: "text-muted-foreground bg-muted/50 border-border",
};

const ControlCenter = () => {
  const [search, setSearch] = useState("");
  const [selectedMsg, setSelectedMsg] = useState<typeof manualMessages[0] | null>(null);
  const [selectedRule, setSelectedRule] = useState<typeof autoRules[0] | null>(null);
  const [selectedTpl, setSelectedTpl] = useState<typeof templates[0] | null>(null);

  // Dynamic options
  const [audiences, setAudiences] = useState(["All Devotees", "Today's Bookings", "Seva Participants", "Darshan Visitors", "Donors", "Custom Segment"]);
  const [triggers, setTriggers] = useState(["Booking Created", "Reminder Before Slot", "Payment Success", "Donation Received", "Slot Cancelled"]);
  const [scopes, setScopes] = useState(["All Offerings", "Specific Offering", "Specific Structure"]);
  const [channels, setChannels] = useState(["SMS", "WhatsApp", "Email", "Push"]);
  const [timings, setTimings] = useState(["Immediate", "Before Event 1 hour", "Before Event 2 hours", "Before Event 24 hours", "After Event 1 hour"]);
  const [tplCategories, setTplCategories] = useState(["Booking", "Donation", "Events", "Finance", "General"]);
  const [languages, setLanguages] = useState(["English", "Hindi", "Telugu", "Kannada", "Tamil"]);

  // Form state
  const [formAudience, setFormAudience] = useState("");
  const [formTrigger, setFormTrigger] = useState("");
  const [formScope, setFormScope] = useState("");
  const [formChannel, setFormChannel] = useState("");
  const [formTiming, setFormTiming] = useState("");
  const [formTplCat, setFormTplCat] = useState("");
  const [formTplChannel, setFormTplChannel] = useState("");
  const [formLanguage, setFormLanguage] = useState("");
  const [formTemplate, setFormTemplate] = useState("");

  // Custom fields for each create dialog
  const [msgCustomFields, setMsgCustomFields] = useState<CustomField[]>([]);
  const [ruleCustomFields, setRuleCustomFields] = useState<CustomField[]>([]);
  const [tplCustomFields, setTplCustomFields] = useState<CustomField[]>([]);
  const [msgDetailFields, setMsgDetailFields] = useState<CustomField[]>([]);
  const [ruleDetailFields, setRuleDetailFields] = useState<CustomField[]>([]);
  const [tplDetailFields, setTplDetailFields] = useState<CustomField[]>([]);

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Messages Sent Today", value: "47", icon: Send },
          { label: "Scheduled", value: "8", icon: Clock },
          { label: "Active Rules", value: autoRules.filter(r => r.status === "active").length.toString(), icon: Zap },
          { label: "Failed (24h)", value: "1", icon: AlertTriangle },
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

      <Tabs defaultValue="manual">
        <TabsList>
          <TabsTrigger value="manual"><MessageSquare className="h-4 w-4 mr-1" />Manual Messages</TabsTrigger>
          <TabsTrigger value="rules"><Zap className="h-4 w-4 mr-1" />Automatic Rules</TabsTrigger>
          <TabsTrigger value="templates"><FileText className="h-4 w-4 mr-1" />Templates</TabsTrigger>
          <TabsTrigger value="logs"><ScrollText className="h-4 w-4 mr-1" />Message Logs</TabsTrigger>
        </TabsList>

        {/* === MANUAL MESSAGES === */}
        <TabsContent value="manual" className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search messages..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm"><Plus className="h-4 w-4 mr-1" />New Message</Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
                <DialogHeader><DialogTitle>Compose Message</DialogTitle></DialogHeader>
                <div className="space-y-4">
                  <div><Label>Message Title</Label><Input placeholder="Message title" /></div>
                  <div><Label>Template (Optional)</Label>
                    <SelectWithAddNew value={formTemplate} onValueChange={setFormTemplate} placeholder="Select template" options={templates.filter(t => t.status === "active").map(t => `${t.name} (${t.channel})`)} onAddNew={() => {}} />
                  </div>
                  <div><Label>Channel (at least one)</Label>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      {["SMS", "WhatsApp", "Email", "Push"].map(ch => (
                        <div key={ch} className="flex items-center gap-2">
                          <Switch id={`ch-${ch}`} />
                          <Label htmlFor={`ch-${ch}`} className="text-sm">{ch}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div><Label>Audience</Label>
                    <SelectWithAddNew value={formAudience} onValueChange={setFormAudience} placeholder="Select audience" options={audiences} onAddNew={v => setAudiences(p => [...p, v])} />
                  </div>
                  <div><Label>Subject (Email only)</Label><Input placeholder="Email subject line" /></div>
                  <div><Label>Message Body</Label><Textarea rows={4} placeholder="Type your message..." /></div>
                  <div className="flex items-center gap-3">
                    <Switch id="send-now" />
                    <Label htmlFor="send-now">Send Now</Label>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><Label>Schedule Date</Label><Input type="date" /></div>
                    <div><Label>Schedule Time</Label><Input type="time" /></div>
                  </div>
                  <CustomFieldsSection fields={msgCustomFields} onFieldsChange={setMsgCustomFields} />
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" size="sm" onClick={() => toast.success("Saved as draft")}>Save Draft</Button>
                    <Button size="sm" onClick={() => toast.success("Message sent / scheduled")}><Send className="h-4 w-4 mr-1" />Send / Schedule</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Channels</TableHead>
                  <TableHead>Audience</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Scheduled</TableHead>
                  <TableHead>Sent</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {manualMessages.filter(m => m.title.toLowerCase().includes(search.toLowerCase())).map((msg) => (
                  <TableRow key={msg.id} className="cursor-pointer" onClick={() => setSelectedMsg(msg)}>
                    <TableCell className="font-mono text-xs">{msg.id}</TableCell>
                    <TableCell className="font-medium">{msg.title}</TableCell>
                    <TableCell className="text-xs">{msg.channels}</TableCell>
                    <TableCell className="text-xs">{msg.audience}</TableCell>
                    <TableCell><Badge variant="outline" className={msgStatusColors[msg.status]}>{msg.status}</Badge></TableCell>
                    <TableCell className="text-xs">{msg.scheduledAt}</TableCell>
                    <TableCell className="text-xs">{msg.sentAt}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* === AUTOMATIC RULES === */}
        <TabsContent value="rules" className="space-y-4">
          <div className="flex justify-end">
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm"><Plus className="h-4 w-4 mr-1" />New Rule</Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
                <DialogHeader><DialogTitle>Create Automatic Rule</DialogTitle></DialogHeader>
                <div className="space-y-4">
                  <div><Label>Rule Name</Label><Input placeholder="e.g., Booking Confirmation" /></div>
                  <div><Label>Trigger Event</Label>
                    <SelectWithAddNew value={formTrigger} onValueChange={setFormTrigger} placeholder="Select trigger" options={triggers} onAddNew={v => setTriggers(p => [...p, v])} />
                  </div>
                  <div><Label>Scope</Label>
                    <SelectWithAddNew value={formScope} onValueChange={setFormScope} placeholder="Select scope" options={scopes} onAddNew={v => setScopes(p => [...p, v])} />
                  </div>
                  <div><Label>Channel</Label>
                    <SelectWithAddNew value={formChannel} onValueChange={setFormChannel} placeholder="Select channel" options={channels} onAddNew={v => setChannels(p => [...p, v])} />
                  </div>
                  <div><Label>Template (Mandatory)</Label>
                    <SelectWithAddNew value={formTemplate} onValueChange={setFormTemplate} placeholder="Select template" options={templates.filter(t => t.status === "active").map(t => t.name)} onAddNew={() => {}} />
                  </div>
                  <div><Label>Timing</Label>
                    <SelectWithAddNew value={formTiming} onValueChange={setFormTiming} placeholder="Select timing" options={timings} onAddNew={v => setTimings(p => [...p, v])} />
                  </div>
                  <CustomFieldsSection fields={ruleCustomFields} onFieldsChange={setRuleCustomFields} />
                  <div className="flex gap-2 justify-end">
                    <Button size="sm" onClick={() => toast.success("Rule created and activated")}><Zap className="h-4 w-4 mr-1" />Create Rule</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Rule Name</TableHead>
                  <TableHead>Trigger</TableHead>
                  <TableHead>Scope</TableHead>
                  <TableHead>Channel</TableHead>
                  <TableHead>Template</TableHead>
                  <TableHead>Timing</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {autoRules.map((rule) => (
                  <TableRow key={rule.id} className="cursor-pointer" onClick={() => setSelectedRule(rule)}>
                    <TableCell className="font-mono text-xs">{rule.id}</TableCell>
                    <TableCell className="font-medium">{rule.name}</TableCell>
                    <TableCell className="text-xs">{rule.trigger}</TableCell>
                    <TableCell className="text-xs">{rule.scope}</TableCell>
                    <TableCell className="text-xs">{rule.channel}</TableCell>
                    <TableCell className="font-mono text-xs">{rule.template}</TableCell>
                    <TableCell className="text-xs">{rule.timing}</TableCell>
                    <TableCell><Badge variant="outline" className={msgStatusColors[rule.status]}>{rule.status}</Badge></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* === TEMPLATES === */}
        <TabsContent value="templates" className="space-y-4">
          <div className="flex justify-end">
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm"><Plus className="h-4 w-4 mr-1" />New Template</Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
                <DialogHeader><DialogTitle>Create Template</DialogTitle></DialogHeader>
                <div className="space-y-4">
                  <div><Label>Template Name</Label><Input placeholder="e.g., Booking Confirmation" /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><Label>Category</Label>
                      <SelectWithAddNew value={formTplCat} onValueChange={setFormTplCat} placeholder="Select" options={tplCategories} onAddNew={v => setTplCategories(p => [...p, v])} />
                    </div>
                    <div><Label>Channel Type</Label>
                      <SelectWithAddNew value={formTplChannel} onValueChange={setFormTplChannel} placeholder="Select" options={channels} onAddNew={v => setChannels(p => [...p, v])} />
                    </div>
                  </div>
                  <div><Label>Language</Label>
                    <SelectWithAddNew value={formLanguage} onValueChange={setFormLanguage} placeholder="Select" options={languages} onAddNew={v => setLanguages(p => [...p, v])} />
                  </div>
                  <div><Label>Subject (Email only)</Label><Input placeholder="Email subject line" /></div>
                  <div><Label>Message Body</Label><Textarea rows={4} placeholder="Use variables like {{DevoteeName}}, {{OfferingName}}, {{SlotTime}}, {{TempleName}}, {{Amount}}, {{StructureName}}" /></div>
                  <div>
                    <Label className="text-muted-foreground text-xs">Supported Variables</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {["{{DevoteeName}}", "{{OfferingName}}", "{{SlotTime}}", "{{TempleName}}", "{{Amount}}", "{{StructureName}}"].map(v => (
                        <Badge key={v} variant="secondary" className="text-xs font-mono">{v}</Badge>
                      ))}
                    </div>
                  </div>
                  <CustomFieldsSection fields={tplCustomFields} onFieldsChange={setTplCustomFields} />
                  <div className="flex gap-2 justify-end">
                    <Button size="sm" onClick={() => toast.success("Template created")}><FileText className="h-4 w-4 mr-1" />Create Template</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Channel</TableHead>
                  <TableHead>Language</TableHead>
                  <TableHead>Variables</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {templates.map((t) => (
                  <TableRow key={t.id} className="cursor-pointer" onClick={() => setSelectedTpl(t)}>
                    <TableCell className="font-mono text-xs">{t.id}</TableCell>
                    <TableCell className="font-medium">{t.name}</TableCell>
                    <TableCell><Badge variant="secondary">{t.category}</Badge></TableCell>
                    <TableCell className="text-xs">{t.channel}</TableCell>
                    <TableCell className="text-xs">{t.language}</TableCell>
                    <TableCell className="text-xs max-w-[200px] truncate">{t.variables}</TableCell>
                    <TableCell><Badge variant="outline" className={msgStatusColors[t.status]}>{t.status}</Badge></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* === MESSAGE LOGS === */}
        <TabsContent value="logs" className="space-y-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search logs..." className="pl-9" />
          </div>
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Log ID</TableHead>
                  <TableHead>Message ID</TableHead>
                  <TableHead>Channel</TableHead>
                  <TableHead>Recipient</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Sent At</TableHead>
                  <TableHead>Delivered At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {messageLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-mono text-xs">{log.id}</TableCell>
                    <TableCell className="font-mono text-xs">{log.messageId}</TableCell>
                    <TableCell className="text-xs">{log.channel}</TableCell>
                    <TableCell className="font-mono text-xs">{log.recipient}</TableCell>
                    <TableCell><Badge variant="outline" className={msgStatusColors[log.status]}>{log.status}</Badge></TableCell>
                    <TableCell className="text-xs">{log.sentAt}</TableCell>
                    <TableCell className="text-xs">{log.deliveredAt}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Manual Message Detail Modal */}
      <Dialog open={!!selectedMsg} onOpenChange={() => setSelectedMsg(null)}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Message Details</DialogTitle></DialogHeader>
          {selectedMsg && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-muted-foreground">ID:</span> <span className="font-mono">{selectedMsg.id}</span></div>
                <div><span className="text-muted-foreground">Status:</span> <Badge variant="outline" className={msgStatusColors[selectedMsg.status]}>{selectedMsg.status}</Badge></div>
                <div><span className="text-muted-foreground">Channels:</span> {selectedMsg.channels}</div>
                <div><span className="text-muted-foreground">Audience:</span> {selectedMsg.audience}</div>
                <div><span className="text-muted-foreground">Scheduled:</span> {selectedMsg.scheduledAt}</div>
                <div><span className="text-muted-foreground">Sent:</span> {selectedMsg.sentAt}</div>
              </div>
              <CustomFieldsSection fields={msgDetailFields} onFieldsChange={setMsgDetailFields} />
              <div className="flex gap-2">
                {selectedMsg.status === "draft" && <Button size="sm" onClick={() => { toast.success("Message sent"); setSelectedMsg(null); }}><Send className="h-4 w-4 mr-1" />Send Now</Button>}
                {selectedMsg.status === "scheduled" && <Button variant="outline" size="sm" onClick={() => { toast.success("Schedule cancelled"); setSelectedMsg(null); }}>Cancel Schedule</Button>}
                {selectedMsg.status === "failed" && <Button size="sm" onClick={() => { toast.success("Message retried"); setSelectedMsg(null); }}>Retry</Button>}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Rule Detail Modal */}
      <Dialog open={!!selectedRule} onOpenChange={() => setSelectedRule(null)}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Rule Details</DialogTitle></DialogHeader>
          {selectedRule && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-muted-foreground">ID:</span> <span className="font-mono">{selectedRule.id}</span></div>
                <div><span className="text-muted-foreground">Status:</span> <Badge variant="outline" className={msgStatusColors[selectedRule.status]}>{selectedRule.status}</Badge></div>
                <div><span className="text-muted-foreground">Trigger:</span> {selectedRule.trigger}</div>
                <div><span className="text-muted-foreground">Scope:</span> {selectedRule.scope}</div>
                <div><span className="text-muted-foreground">Channel:</span> {selectedRule.channel}</div>
                <div><span className="text-muted-foreground">Template:</span> <span className="font-mono">{selectedRule.template}</span></div>
                <div><span className="text-muted-foreground">Timing:</span> {selectedRule.timing}</div>
              </div>
              <CustomFieldsSection fields={ruleDetailFields} onFieldsChange={setRuleDetailFields} />
              <div className="flex gap-2">
                {selectedRule.status === "active" && <Button variant="outline" size="sm" onClick={() => { toast.success("Rule paused"); setSelectedRule(null); }}>Pause Rule</Button>}
                {selectedRule.status === "paused" && <Button size="sm" onClick={() => { toast.success("Rule activated"); setSelectedRule(null); }}>Activate Rule</Button>}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Template Detail Modal */}
      <Dialog open={!!selectedTpl} onOpenChange={() => setSelectedTpl(null)}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Template Details</DialogTitle></DialogHeader>
          {selectedTpl && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-muted-foreground">ID:</span> <span className="font-mono">{selectedTpl.id}</span></div>
                <div><span className="text-muted-foreground">Status:</span> <Badge variant="outline" className={msgStatusColors[selectedTpl.status]}>{selectedTpl.status}</Badge></div>
                <div><span className="text-muted-foreground">Category:</span> {selectedTpl.category}</div>
                <div><span className="text-muted-foreground">Channel:</span> {selectedTpl.channel}</div>
                <div><span className="text-muted-foreground">Language:</span> {selectedTpl.language}</div>
              </div>
              <div>
                <Label className="text-muted-foreground text-xs">Supported Variables</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedTpl.variables.split(", ").map(v => (
                    <Badge key={v} variant="secondary" className="text-xs font-mono">{v}</Badge>
                  ))}
                </div>
              </div>
              <CustomFieldsSection fields={tplDetailFields} onFieldsChange={setTplDetailFields} />
              <div className="flex gap-2">
                {selectedTpl.status === "active" && <Button variant="outline" size="sm" onClick={() => { toast.success("Template archived"); setSelectedTpl(null); }}>Archive</Button>}
                {selectedTpl.status === "archived" && <Button size="sm" onClick={() => { toast.success("Template reactivated"); setSelectedTpl(null); }}>Reactivate</Button>}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ControlCenter;