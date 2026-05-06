import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Repeat, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { RecurrenceType, TaskPriority, TaskTemplate } from "@/modules/tasks/types";
import { taskActions, useTemplates } from "@/modules/tasks/hooks";

const priorities: TaskPriority[] = ["Low", "Medium", "High", "Critical"];
const recurrenceTypes: RecurrenceType[] = ["Daily", "Weekly", "Monthly", "Yearly"];

export default function ScheduledTemplates() {
  const templates = useTemplates();
  const [open, setOpen] = useState(false);

  const [draft, setDraft] = useState<Omit<TaskTemplate, "templateId">>({
    title: "",
    description: "",
    linkedModule: "System",
    priority: "Medium",
    defaultAssignee: "Store Manager",
    recurrenceType: "Weekly",
    startDate: new Date().toISOString().slice(0, 10),
    endDate: null,
    timeOfDay: "10:00",
    isActive: true,
  });

  const activeCount = useMemo(() => templates.filter((t) => t.isActive).length, [templates]);

  function onCreate() {
    const templateId = `TPL-${Date.now().toString().slice(-6)}`;
    taskActions.upsertTemplate({ templateId, ...draft });
    setOpen(false);
    setDraft((p) => ({ ...p, title: "", description: "" }));
  }

  function addDummyTemplate() {
    const templateId = `TPL-DUMMY-${Date.now().toString().slice(-6)}`;
    taskActions.upsertTemplate({
      templateId,
      title: "Weekly stock audit (Dummy)",
      description: "Dummy template for demo: verify physical vs system quantities and log adjustments.",
      linkedModule: "Inventory",
      priority: "Medium",
      defaultAssignee: "Store Manager",
      recurrenceType: "Weekly",
      startDate: new Date().toISOString().slice(0, 10),
      endDate: null,
      timeOfDay: "10:00",
      isActive: true,
    });
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
            <Repeat className="h-5 w-5 text-primary" />
            Scheduled Templates
          </h1>
          <p className="text-muted-foreground text-sm">{templates.length} templates — {activeCount} active</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={addDummyTemplate}>
            Add Dummy Template
          </Button>
          <Button size="sm" onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4 mr-1.5" />
            New Template
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Recurring Task Templates</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Template</TableHead>
                <TableHead>Module</TableHead>
                <TableHead>Recurrence</TableHead>
                <TableHead>Assignee</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {templates.map((t) => (
                <TableRow key={t.templateId}>
                  <TableCell>
                    <p className="text-sm font-medium">{t.title}</p>
                    <p className="text-xs text-muted-foreground">{t.templateId}</p>
                  </TableCell>
                  <TableCell><Badge variant="outline" className="text-[10px]">{t.linkedModule}</Badge></TableCell>
                  <TableCell className="text-sm">
                    {t.recurrenceType}
                    <span className="text-xs text-muted-foreground"> · {t.timeOfDay}</span>
                  </TableCell>
                  <TableCell className="text-sm">{t.defaultAssignee}</TableCell>
                  <TableCell><Badge variant="outline" className="text-[10px]">{t.priority}</Badge></TableCell>
                  <TableCell>
                    {t.isActive ? <Badge variant="secondary" className="text-[10px]">Active</Badge> : <Badge variant="outline" className="text-[10px]">Paused</Badge>}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive"
                      onClick={() => taskActions.deleteTemplate(t.templateId)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {templates.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No templates yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Scheduled Template</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input value={draft.title} onChange={(e) => setDraft((p) => ({ ...p, title: e.target.value }))} placeholder="e.g., Daily stock check" />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={draft.description} onChange={(e) => setDraft((p) => ({ ...p, description: e.target.value }))} rows={2} placeholder="What should be done?" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Recurrence</Label>
                <Select value={draft.recurrenceType} onValueChange={(v) => setDraft((p) => ({ ...p, recurrenceType: v as RecurrenceType }))}>
                  <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-popover">
                    {recurrenceTypes.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Time of Day</Label>
                <Input type="time" value={draft.timeOfDay} onChange={(e) => setDraft((p) => ({ ...p, timeOfDay: e.target.value }))} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Start Date</Label>
                <Input type="date" value={draft.startDate} onChange={(e) => setDraft((p) => ({ ...p, startDate: e.target.value }))} />
              </div>
              <div>
                <Label>End Date</Label>
                <Input type="date" value={draft.endDate ?? ""} onChange={(e) => setDraft((p) => ({ ...p, endDate: e.target.value || null }))} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Default Assignee</Label>
                <Input value={draft.defaultAssignee} onChange={(e) => setDraft((p) => ({ ...p, defaultAssignee: e.target.value }))} placeholder="e.g., Store Manager" />
              </div>
              <div>
                <Label>Priority</Label>
                <Select value={draft.priority} onValueChange={(v) => setDraft((p) => ({ ...p, priority: v as TaskPriority }))}>
                  <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-popover">
                    {priorities.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={onCreate} disabled={!draft.title.trim()}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

