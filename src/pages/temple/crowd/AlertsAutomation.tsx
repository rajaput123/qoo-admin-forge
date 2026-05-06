import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, Bell, Plus, Trash2, Edit, Clock, CheckCircle2, XCircle, LayoutDashboard, Settings } from "lucide-react";
import { toast } from "sonner";

interface AlertRule {
  id: string;
  name: string;
  condition: string;
  threshold: number;
  action: string;
  enabled: boolean;
  zone?: string;
  lastTriggered?: string;
  triggerCount: number;
}

interface AlertHistory {
  id: string;
  ruleName: string;
  zone: string;
  message: string;
  severity: "low" | "medium" | "high" | "critical";
  timestamp: string;
  acknowledged: boolean;
}

const initialRules: AlertRule[] = [
  {
    id: "R-001",
    name: "High Occupancy Alert",
    condition: "occupancy",
    threshold: 90,
    action: "notify_staff",
    enabled: true,
    zone: "All Zones",
    lastTriggered: "2024-01-15 14:30",
    triggerCount: 12,
  },
  {
    id: "R-002",
    name: "Auto Close Gate",
    condition: "occupancy",
    threshold: 95,
    action: "close_gate",
    enabled: true,
    zone: "Main Sanctum",
    lastTriggered: "2024-01-15 15:45",
    triggerCount: 3,
  },
  {
    id: "R-003",
    name: "Queue Length Alert",
    condition: "queue_length",
    threshold: 200,
    action: "notify_staff",
    enabled: true,
    zone: "All Queues",
    lastTriggered: "2024-01-15 13:20",
    triggerCount: 8,
  },
  {
    id: "R-004",
    name: "Auto Announcement",
    condition: "occupancy",
    threshold: 85,
    action: "trigger_announcement",
    enabled: false,
    zone: "All Zones",
    triggerCount: 0,
  },
];

const alertHistory: AlertHistory[] = [
  {
    id: "A-001",
    ruleName: "High Occupancy Alert",
    zone: "Queue Corridor A",
    message: "Occupancy exceeded 90% threshold",
    severity: "high",
    timestamp: "2024-01-15 15:45:23",
    acknowledged: true,
  },
  {
    id: "A-002",
    ruleName: "Auto Close Gate",
    zone: "Main Sanctum",
    message: "Gate automatically closed due to 95% occupancy",
    severity: "critical",
    timestamp: "2024-01-15 15:45:15",
    acknowledged: true,
  },
  {
    id: "A-003",
    ruleName: "Queue Length Alert",
    zone: "Prasadam Counter 1",
    message: "Queue length exceeded 200 people",
    severity: "medium",
    timestamp: "2024-01-15 14:30:10",
    acknowledged: false,
  },
  {
    id: "A-004",
    ruleName: "High Occupancy Alert",
    zone: "West Courtyard",
    message: "Occupancy exceeded 90% threshold",
    severity: "high",
    timestamp: "2024-01-15 13:20:45",
    acknowledged: true,
  },
];

const AlertsAutomation = () => {
  const navigate = useNavigate();
  const [rules, setRules] = useState<AlertRule[]>(initialRules);
  const [history, setHistory] = useState<AlertHistory[]>(alertHistory);
  const [showRuleEditor, setShowRuleEditor] = useState(false);
  const [editingRule, setEditingRule] = useState<AlertRule | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    condition: "occupancy",
    threshold: 90,
    action: "notify_staff",
    enabled: true,
    zone: "all",
  });

  const handleSaveRule = () => {
    if (editingRule) {
      setRules(rules.map(r => r.id === editingRule.id ? { ...editingRule, ...formData } : r));
      toast.success("Rule updated successfully");
    } else {
      const newRule: AlertRule = {
        id: `R-${String(rules.length + 1).padStart(3, "0")}`,
        ...formData,
        triggerCount: 0,
      };
      setRules([...rules, newRule]);
      toast.success("Rule created successfully");
    }
    setShowRuleEditor(false);
    setEditingRule(null);
    setFormData({ name: "", condition: "occupancy", threshold: 90, action: "notify_staff", enabled: true, zone: "all" });
  };

  const handleEditRule = (rule: AlertRule) => {
    setEditingRule(rule);
    setFormData({
      name: rule.name,
      condition: rule.condition,
      threshold: rule.threshold,
      action: rule.action,
      enabled: rule.enabled,
      zone: rule.zone || "all",
    });
    setShowRuleEditor(true);
  };

  const handleDeleteRule = (id: string) => {
    setRules(rules.filter(r => r.id !== id));
    toast.success("Rule deleted");
  };

  const toggleRule = (id: string) => {
    setRules(rules.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
  };

  const acknowledgeAlert = (id: string) => {
    setHistory(history.map(a => a.id === id ? { ...a, acknowledged: true } : a));
    toast.success("Alert acknowledged");
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical":
        return <Badge variant="destructive">Critical</Badge>;
      case "high":
        return <Badge variant="destructive" className="bg-orange-600">High</Badge>;
      case "medium":
        return <Badge variant="secondary">Medium</Badge>;
      default:
        return <Badge variant="outline">Low</Badge>;
    }
  };

  const getActionLabel = (action: string) => {
    switch (action) {
      case "notify_staff":
        return "Notify Staff";
      case "close_gate":
        return "Close Gate";
      case "trigger_announcement":
        return "Trigger Announcement";
      case "redirect_crowd":
        return "Redirect Crowd";
      default:
        return action;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Alerts & Automation</h1>
          <p className="text-sm text-muted-foreground mt-1">Define alert rules and automation triggers</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate("/temple/crowd/dashboard")} className="gap-2">
            <LayoutDashboard className="h-4 w-4" /> Dashboard
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigate("/temple/crowd/control")} className="gap-2">
            <Settings className="h-4 w-4" /> Control Panel
          </Button>
        </div>
        <Dialog open={showRuleEditor} onOpenChange={setShowRuleEditor}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingRule(null); setFormData({ name: "", condition: "occupancy", threshold: 90, action: "notify_staff", enabled: true, zone: "all" }); }}>
              <Plus className="h-4 w-4 mr-2" /> Add Rule
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingRule ? "Edit Alert Rule" : "Create Alert Rule"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label>Rule Name</Label>
                <Input
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., High Occupancy Alert"
                />
              </div>
              <div>
                <Label>Condition</Label>
                <Select value={formData.condition} onValueChange={v => setFormData({ ...formData, condition: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="occupancy">Occupancy Percentage</SelectItem>
                    <SelectItem value="queue_length">Queue Length</SelectItem>
                    <SelectItem value="wait_time">Wait Time</SelectItem>
                    <SelectItem value="entry_rate">Entry Rate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Threshold</Label>
                <Input
                  type="number"
                  value={formData.threshold}
                  onChange={e => setFormData({ ...formData, threshold: Number(e.target.value) })}
                  placeholder="90"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {formData.condition === "occupancy" ? "Percentage (0-100)" : "Number of people/minutes"}
                </p>
              </div>
              <div>
                <Label>Action</Label>
                <Select value={formData.action} onValueChange={v => setFormData({ ...formData, action: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="notify_staff">Notify Staff</SelectItem>
                    <SelectItem value="close_gate">Close Gate Automatically</SelectItem>
                    <SelectItem value="trigger_announcement">Trigger Announcement</SelectItem>
                    <SelectItem value="redirect_crowd">Redirect Crowd</SelectItem>
                    <SelectItem value="pause_booking">Pause Bookings</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Zone</Label>
                <Select value={formData.zone} onValueChange={v => setFormData({ ...formData, zone: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Zones</SelectItem>
                    <SelectItem value="Z-001">Main Sanctum</SelectItem>
                    <SelectItem value="Z-002">Queue Corridor A</SelectItem>
                    <SelectItem value="Z-003">Prasadam Hall</SelectItem>
                    <SelectItem value="Z-004">East Courtyard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <Label>Enable Rule</Label>
                <Switch checked={formData.enabled} onCheckedChange={v => setFormData({ ...formData, enabled: v })} />
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setShowRuleEditor(false)}>
                Cancel
              </Button>
              <Button className="flex-1" onClick={handleSaveRule}>
                {editingRule ? "Update" : "Create"} Rule
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Rules Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Bell className="h-4 w-4" /> Alert Rules
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rule Name</TableHead>
                <TableHead>Condition</TableHead>
                <TableHead>Threshold</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Zone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Triggers</TableHead>
                <TableHead>Last Triggered</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rules.map(rule => (
                <TableRow key={rule.id}>
                  <TableCell className="font-medium">{rule.name}</TableCell>
                  <TableCell className="capitalize">{rule.condition.replace("_", " ")}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{rule.threshold}</Badge>
                  </TableCell>
                  <TableCell>{getActionLabel(rule.action)}</TableCell>
                  <TableCell className="text-sm">{rule.zone || "All"}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch checked={rule.enabled} onCheckedChange={() => toggleRule(rule.id)} />
                      <Badge variant={rule.enabled ? "default" : "secondary"}>
                        {rule.enabled ? "Active" : "Disabled"}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{rule.triggerCount}</Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {rule.lastTriggered || "Never"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEditRule(rule)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteRule(rule.id)}>
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Alert History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="h-4 w-4" /> Alert History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Rule</TableHead>
                <TableHead>Zone</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map(alert => (
                <TableRow key={alert.id}>
                  <TableCell className="text-xs font-mono">{alert.timestamp}</TableCell>
                  <TableCell className="font-medium">{alert.ruleName}</TableCell>
                  <TableCell className="text-sm">{alert.zone}</TableCell>
                  <TableCell className="text-sm">{alert.message}</TableCell>
                  <TableCell>{getSeverityBadge(alert.severity)}</TableCell>
                  <TableCell>
                    {alert.acknowledged ? (
                      <Badge variant="outline" className="gap-1">
                        <CheckCircle2 className="h-3 w-3" /> Acknowledged
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="gap-1">
                        <XCircle className="h-3 w-3" /> Pending
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {!alert.acknowledged && (
                      <Button size="sm" variant="outline" onClick={() => acknowledgeAlert(alert.id)}>
                        Acknowledge
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AlertsAutomation;
