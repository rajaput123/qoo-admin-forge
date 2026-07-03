import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Settings, Tag, MessageSquareText, QrCode, Globe, Phone, FileText, Trash2 } from "lucide-react";

const categories = [
  { id: 1, name: "Darshan Experience", active: true, feedbackCount: 842 },
  { id: 2, name: "Queue Management", active: true, feedbackCount: 564 },
  { id: 3, name: "Prasadam Quality", active: true, feedbackCount: 451 },
  { id: 4, name: "Cleanliness", active: true, feedbackCount: 394 },
  { id: 5, name: "Staff Behaviour", active: true, feedbackCount: 338 },
  { id: 6, name: "Facilities", active: true, feedbackCount: 258 },
  { id: 7, name: "Safety & Security", active: false, feedbackCount: 0 },
];

const channelConfig = [
  { name: "Feedback Kiosk", icon: MessageSquareText, enabled: true, description: "Physical kiosk terminals in temple premises" },
  { name: "QR Code Forms", icon: QrCode, enabled: true, description: "Scannable QR codes at various locations" },
  { name: "Online Portal", icon: Globe, enabled: true, description: "Web-based feedback submission" },
  { name: "Phone / SMS", icon: Phone, enabled: true, description: "Toll-free number and SMS feedback" },
  { name: "Suggestion Box", icon: FileText, enabled: true, description: "Physical suggestion boxes" },
];

const Configuration = () => {
  const [showAddCategory, setShowAddCategory] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Configuration</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage feedback categories, channels, and form settings</p>
      </div>

      {/* Categories */}
      <Card>
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2"><Tag className="h-4 w-4" /> Feedback Categories</CardTitle>
          <Button size="sm" onClick={() => setShowAddCategory(true)} className="gap-1"><Plus className="h-3.5 w-3.5" /> Add</Button>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Feedback Count</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((cat) => (
                <TableRow key={cat.id}>
                  <TableCell className="font-medium text-sm">{cat.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{cat.feedbackCount}</TableCell>
                  <TableCell>
                    <Badge variant={cat.active ? "default" : "outline"} className="text-[10px]">{cat.active ? "Active" : "Inactive"}</Badge>
                  </TableCell>
                  <TableCell>
                    <Switch defaultChecked={cat.active} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Channels */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2"><Settings className="h-4 w-4" /> Feedback Channels</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {channelConfig.map((ch) => (
            <div key={ch.name} className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <ch.icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">{ch.name}</p>
                  <p className="text-xs text-muted-foreground">{ch.description}</p>
                </div>
              </div>
              <Switch defaultChecked={ch.enabled} />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Escalation Settings */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Escalation Rules</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg border">
            <div>
              <p className="text-sm font-medium">Auto-escalate ratings ≤ 2 stars</p>
              <p className="text-xs text-muted-foreground">Automatically escalate low-rated feedback to manager</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg border">
            <div>
              <p className="text-sm font-medium">Alert on safety keywords</p>
              <p className="text-xs text-muted-foreground">Trigger alerts for keywords like "unsafe", "injury", "theft"</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg border">
            <div>
              <p className="text-sm font-medium">Pending review reminder (24 hrs)</p>
              <p className="text-xs text-muted-foreground">Remind admins about unreviewed feedback after 24 hours</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Add Category Dialog */}
      <Dialog open={showAddCategory} onOpenChange={setShowAddCategory}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Add Feedback Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Category Name</Label>
              <Input placeholder="e.g., Parking Experience" />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowAddCategory(false)}>Cancel</Button>
              <Button onClick={() => setShowAddCategory(false)}>Add Category</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Configuration;
