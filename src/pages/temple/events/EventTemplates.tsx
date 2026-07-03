import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Plus, Copy, Eye, Edit, Trash2, Upload, LayoutTemplate } from "lucide-react";
import { eventTemplates, eventTypes } from "@/data/eventData";
import type { EventTemplate } from "@/data/eventData";
import SelectWithAddNew from "@/components/SelectWithAddNew";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { eventActions } from "@/modules/events/hooks";
import { structures } from "@/data/eventData";

// Mock template store (in real app, this would be in a store)
let templatesData: EventTemplate[] = [...eventTemplates];

function addDaysIso(startDate: string, days: number) {
  const d = new Date(startDate);
  d.setDate(d.getDate() + Math.max(0, days));
  return d.toISOString().slice(0, 10);
}

const EventTemplates = () => {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<EventTemplate[]>(templatesData);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTemplate, setEditTemplate] = useState<EventTemplate | null>(null);
  const [viewTemplate, setViewTemplate] = useState<EventTemplate | null>(null);

  // Form state - Section 1: Basic Template Info
  const [formName, setFormName] = useState("");
  const [formType, setFormType] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formBannerImage, setFormBannerImage] = useState<File | null>(null);

  // Section 2: Seva Setup
  const [formEnableSevaBooking, setFormEnableSevaBooking] = useState(false);
  const [formAttachedSevas, setFormAttachedSevas] = useState<string[]>([]);
  const [formSlotStructure, setFormSlotStructure] = useState("");

  // Section 3: Donation Setup
  const [formEnableDonations, setFormEnableDonations] = useState(false);
  const [formDonationEightyGType, setFormDonationEightyGType] = useState<"" | "80G" | "Non-80G">("");
  const [formDonationGoal, setFormDonationGoal] = useState("");
  const [formMinDonation, setFormMinDonation] = useState("");
  const [formTransparencyNote, setFormTransparencyNote] = useState("");

  // Section 4: Resource Preset
  const [formDefaultPriests, setFormDefaultPriests] = useState<string[]>([]);
  const [formDefaultFreelancers, setFormDefaultFreelancers] = useState<string[]>([]);
  const [formVolunteersRequired, setFormVolunteersRequired] = useState<string[]>([]);
  const [formEquipmentNeeded, setFormEquipmentNeeded] = useState<string[]>([]);
  const [formHallAllocation, setFormHallAllocation] = useState("");

  // Section 5: Estimated Expenses
  const [formEstDecoration, setFormEstDecoration] = useState("");
  const [formEstPriestPayment, setFormEstPriestPayment] = useState("");
  const [formEstFoodCost, setFormEstFoodCost] = useState("");
  const [formEstMiscellaneous, setFormEstMiscellaneous] = useState("");

  const [typeOptions, setTypeOptions] = useState<string[]>([...eventTypes]);
  const [sevaOptions] = useState(["Suprabhatam", "Abhishekam", "Archana", "Special Darshan", "Kalyanotsavam", "Sahasranama", "Rudra Abhishekam"]);
  const [structureOptions] = useState(structures.map(s => s.name));

  function resetForm() {
    setFormName("");
    setFormType("");
    setFormDescription("");
    setFormBannerImage(null);
    setFormEnableSevaBooking(false);
    setFormAttachedSevas([]);
    setFormSlotStructure("");
    setFormEnableDonations(false);
    setFormDonationEightyGType("");
    setFormDonationGoal("");
    setFormMinDonation("");
    setFormTransparencyNote("");
    setFormDefaultPriests([]);
    setFormDefaultFreelancers([]);
    setFormVolunteersRequired([]);
    setFormEquipmentNeeded([]);
    setFormHallAllocation("");
    setFormEstDecoration("");
    setFormEstPriestPayment("");
    setFormEstFoodCost("");
    setFormEstMiscellaneous("");
    setEditTemplate(null);
  }

  function loadTemplateForEdit(template: EventTemplate) {
    setFormName(template.name);
    setFormType(template.type);
    setFormDescription(template.description);
    setFormEnableSevaBooking(template.enableSevaBooking);
    setFormAttachedSevas([...template.attachedSevas]);
    setFormEnableDonations(template.enableDonations);
    setFormDonationEightyGType(template.donationEightyGType || "");
    setFormDonationGoal(template.suggestedDonationGoal?.toString() || "");
    setFormMinDonation(template.minimumDonationAmount?.toString() || "");
    setFormTransparencyNote(template.transparencyNote || "");
    setFormDefaultPriests(template.defaultPriests ? [...template.defaultPriests] : []);
    setFormDefaultFreelancers(template.defaultFreelancers ? [...template.defaultFreelancers] : []);
    setFormVolunteersRequired(template.volunteersRequired ? [...template.volunteersRequired] : []);
    setFormEquipmentNeeded(template.equipmentNeeded ? [...template.equipmentNeeded] : []);
    setFormHallAllocation(template.hallAllocation || "_none_");
    setFormEstDecoration(template.estDecorationCost?.toString() || "");
    setFormEstPriestPayment(template.estPriestPayment?.toString() || "");
    setFormEstFoodCost(template.estFoodCost?.toString() || "");
    setFormEstMiscellaneous(template.estMiscellaneous?.toString() || "");
    setEditTemplate(template);
  }

  function handleSaveTemplate() {
    if (!formName.trim()) {
      toast.error("Template Name is required");
      return;
    }
    if (!formType) {
      toast.error("Event Type is required");
      return;
    }

    const templateData: EventTemplate = {
      id: editTemplate?.id || `TPL-${String(templates.length + 1).padStart(3, "0")}`,
      name: formName.trim(),
      type: formType as EventTemplate["type"],
      description: formDescription,
      enableSevaBooking: formEnableSevaBooking,
      attachedSevas: formAttachedSevas,
      enableDonations: formEnableDonations,
      donationEightyGType: formEnableDonations && formDonationEightyGType ? formDonationEightyGType : undefined,
      suggestedDonationGoal: formDonationGoal ? Number(formDonationGoal) : undefined,
      minimumDonationAmount: formMinDonation ? Number(formMinDonation) : undefined,
      transparencyNote: formTransparencyNote || undefined,
      defaultPriests: formDefaultPriests,
      defaultFreelancers: formDefaultFreelancers,
      volunteersRequired: formVolunteersRequired,
      equipmentNeeded: formEquipmentNeeded,
      hallAllocation: (formHallAllocation && formHallAllocation !== "_none_") ? formHallAllocation : undefined,
      estDecorationCost: formEstDecoration ? Number(formEstDecoration) : undefined,
      estPriestPayment: formEstPriestPayment ? Number(formEstPriestPayment) : undefined,
      estFoodCost: formEstFoodCost ? Number(formEstFoodCost) : undefined,
      estMiscellaneous: formEstMiscellaneous ? Number(formEstMiscellaneous) : undefined,
      usageCount: editTemplate?.usageCount || 0,
      lastUsedDate: editTemplate?.lastUsedDate,
      createdAt: editTemplate?.createdAt || new Date().toISOString().slice(0, 10),
      createdBy: editTemplate?.createdBy || "Temple Admin",
    };

    if (editTemplate) {
      setTemplates(templates.map(t => t.id === editTemplate.id ? templateData : t));
      templatesData = templatesData.map(t => t.id === editTemplate.id ? templateData : t);
      toast.success("Template updated");
    } else {
      setTemplates([templateData, ...templates]);
      templatesData = [templateData, ...templatesData];
      toast.success("Template created");
    }

    setDialogOpen(false);
    resetForm();
  }

  function handleDeleteTemplate(id: string) {
    if (confirm("Are you sure you want to delete this template?")) {
      setTemplates(templates.filter(t => t.id !== id));
      templatesData = templatesData.filter(t => t.id !== id);
      toast.success("Template deleted");
    }
  }

  function handleDuplicateTemplate(template: EventTemplate) {
    const newTemplate: EventTemplate = {
      ...template,
      id: `TPL-${String(templates.length + 1).padStart(3, "0")}`,
      name: `${template.name} (Copy)`,
      usageCount: 0,
      lastUsedDate: undefined,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setTemplates([newTemplate, ...templates]);
    templatesData = [newTemplate, ...templatesData];
    toast.success("Template duplicated");
  }

  function createFromTemplate(template: EventTemplate) {
    const startDate = new Date().toISOString().slice(0, 10);
    const defaultStructure = structures[0] ?? { id: "STR-001", name: "Main Temple" };

    const ev = eventActions.createEvent({
      name: `${template.name} (New)`,
      type: template.type as any,
      templeId: "TMP-001",
      structureId: defaultStructure.id,
      structureName: template.hallAllocation || defaultStructure.name,
      startDate,
      endDate: startDate,
      estimatedBudget: (template.estDecorationCost || 0) +
        (template.estPriestPayment || 0) +
        (template.estFoodCost || 0) +
        (template.estMiscellaneous || 0),
      actualSpend: 0,
      estimatedFootfall: "—",
      description: template.description,
      status: "Published",
      organizer: "—",
      capacity: 0,
      linkedSeva: template.attachedSevas,
    });

    // Update usage count
    const updatedTemplate = {
      ...template,
      usageCount: template.usageCount + 1,
      lastUsedDate: new Date().toISOString().slice(0, 10),
    };
    setTemplates(templates.map(t => t.id === template.id ? updatedTemplate : t));
    templatesData = templatesData.map(t => t.id === template.id ? updatedTemplate : t);

    toast.success("Event created from template");
    navigate(`/temple/events/${ev.id}`);
  }

  const getResourcesCount = (template: EventTemplate) => {
    return template.defaultPriests.length + template.defaultFreelancers.length + template.volunteersRequired.length;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Event Templates</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Reusable event blueprints for quick setup of recurring events
          </p>
        </div>
        <Button onClick={() => { resetForm(); setDialogOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" />Create Template
        </Button>
      </div>

      {/* Templates Table */}
      <Card>
        <CardHeader>
          <CardTitle>Template List</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Template Name</TableHead>
                <TableHead>Event Type</TableHead>
                <TableHead>Attached Sevas Count</TableHead>
                <TableHead>Donation Enabled</TableHead>
                <TableHead>Resources Assigned</TableHead>
                <TableHead>Last Used Date</TableHead>
                <TableHead>Usage Count</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {templates.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                    No templates found. Create your first template to get started.
                  </TableCell>
                </TableRow>
              ) : (
                templates.map(template => (
                  <TableRow key={template.id}>
                    <TableCell className="font-medium">{template.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">{template.type}</Badge>
                    </TableCell>
                    <TableCell className="text-sm">{template.attachedSevas.length}</TableCell>
                    <TableCell>
                      <Badge variant={template.enableDonations ? "default" : "secondary"} className="text-xs">
                        {template.enableDonations ? "Yes" : "No"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{getResourcesCount(template)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {template.lastUsedDate || "Never"}
                    </TableCell>
                    <TableCell className="text-sm">
                      <Badge variant="outline">{template.usageCount}x</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setViewTemplate(template)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => { loadTemplateForEdit(template); setDialogOpen(true); }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleDuplicateTemplate(template)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-600"
                          onClick={() => handleDeleteTemplate(template.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          className="h-8 text-xs"
                          onClick={() => createFromTemplate(template)}
                        >
                          Use Template
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create/Edit Template Dialog */}
      <Dialog open={dialogOpen} onOpenChange={(open) => { if (!open) { resetForm(); } setDialogOpen(open); }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editTemplate ? "Edit Template" : "Create Event Template"}</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="basic" className="mt-4">
            <div className="overflow-x-auto">
              <TabsList className="inline-flex w-full min-w-max">
                <TabsTrigger value="basic" className="text-xs whitespace-nowrap">1. Basic Info</TabsTrigger>
                <TabsTrigger value="seva" className="text-xs whitespace-nowrap">2. Seva Setup</TabsTrigger>
                <TabsTrigger value="donation" className="text-xs whitespace-nowrap">3. Donation</TabsTrigger>
                <TabsTrigger value="resources" className="text-xs whitespace-nowrap">4. Resources</TabsTrigger>
                <TabsTrigger value="expenses" className="text-xs whitespace-nowrap">5. Expenses</TabsTrigger>
              </TabsList>
            </div>

            {/* Section 1: Basic Template Info */}
            <TabsContent value="basic" className="space-y-4 mt-4">
              <div>
                <h3 className="text-sm font-semibold mb-3">🟢 Basic Template Info</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Template Name *</Label>
                    <Input
                      placeholder="e.g. Major Festival Template"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Event Type *</Label>
                    <SelectWithAddNew
                      value={formType}
                      onValueChange={setFormType}
                      placeholder="Select type"
                      options={typeOptions}
                      onAddNew={v => setTypeOptions(p => [...p, v])}
                    />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      placeholder="Template description..."
                      rows={4}
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                    />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label>Default Banner Image (Optional)</Label>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" type="button" onClick={() => document.getElementById("banner-upload")?.click()}>
                        <Upload className="h-4 w-4 mr-1" />
                        Upload Banner
                      </Button>
                      <input type="file" id="banner-upload" className="hidden" accept="image/*" onChange={(e) => setFormBannerImage(e.target.files?.[0] || null)} />
                      {formBannerImage && <span className="text-xs text-muted-foreground">{formBannerImage.name}</span>}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Section 2: Seva Setup */}
            <TabsContent value="seva" className="space-y-4 mt-4">
              <div>
                <h3 className="text-sm font-semibold mb-3">🟢 Seva Setup (Optional)</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="enable-seva-template"
                      checked={formEnableSevaBooking}
                      onCheckedChange={(checked) => setFormEnableSevaBooking(Boolean(checked))}
                    />
                    <Label htmlFor="enable-seva-template" className="cursor-pointer">Enable Seva Booking?</Label>
                  </div>
                  {formEnableSevaBooking && (
                    <>
                      <div className="col-span-2 space-y-2">
                        <Label>Attach Sevas (Multi-select)</Label>
                        <Select
                          value=""
                          onValueChange={(value) => {
                            if (value && !formAttachedSevas.includes(value)) {
                              setFormAttachedSevas([...formAttachedSevas, value]);
                            }
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select seva to add" />
                          </SelectTrigger>
                          <SelectContent>
                            {sevaOptions.filter(s => !formAttachedSevas.includes(s)).map(seva => (
                              <SelectItem key={seva} value={seva}>{seva}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {formAttachedSevas.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {formAttachedSevas.map(seva => (
                              <Badge key={seva} variant="secondary" className="cursor-pointer" onClick={() => setFormAttachedSevas(formAttachedSevas.filter(s => s !== seva))}>
                                {seva} ×
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="col-span-2 space-y-2">
                        <Label>Slot Structure (Optional preset)</Label>
                        <Textarea
                          placeholder="Describe slot structure..."
                          rows={2}
                          value={formSlotStructure}
                          onChange={(e) => setFormSlotStructure(e.target.value)}
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Section 3: Donation Setup */}
            <TabsContent value="donation" className="space-y-4 mt-4">
              <div>
                <h3 className="text-sm font-semibold mb-3">🟢 Donation Setup (Optional)</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="enable-donations-template"
                      checked={formEnableDonations}
                      onCheckedChange={(checked) => setFormEnableDonations(Boolean(checked))}
                    />
                    <Label htmlFor="enable-donations-template" className="cursor-pointer">Enable Donations?</Label>
                  </div>
                  {formEnableDonations && (
                    <>
                      <div className="space-y-2">
                        <Label>80G Account Type</Label>
                        <Select
                          value={formDonationEightyGType || ""}
                          onValueChange={(v) => setFormDonationEightyGType(v as "80G" | "Non-80G")}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select 80G or Non-80G" />
                          </SelectTrigger>
                          <SelectContent className="bg-popover">
                            <SelectItem value="80G">80G</SelectItem>
                            <SelectItem value="Non-80G">Non-80G</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Suggested Donation Goal (₹)</Label>
                        <Input
                          type="number"
                          placeholder="e.g. 500000"
                          value={formDonationGoal}
                          onChange={(e) => setFormDonationGoal(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Minimum Donation Amount (₹)</Label>
                        <Input
                          type="number"
                          placeholder="e.g. 100"
                          value={formMinDonation}
                          onChange={(e) => setFormMinDonation(e.target.value)}
                        />
                      </div>
                      <div className="col-span-2 space-y-2">
                        <Label>Transparency Note</Label>
                        <Textarea
                          placeholder="Note about how donations will be used..."
                          rows={3}
                          value={formTransparencyNote}
                          onChange={(e) => setFormTransparencyNote(e.target.value)}
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Section 4: Resource Preset */}
            <TabsContent value="resources" className="space-y-4 mt-4">
              <div>
                <h3 className="text-sm font-semibold mb-3">🟢 Resource Preset (Optional)</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 space-y-2">
                    <Label>Default Priests / Freelancers</Label>
                    <Textarea
                      placeholder="Enter names (one per line, or comma-separated)"
                      rows={3}
                      value={formDefaultPriests.join(", ")}
                      onChange={(e) => setFormDefaultPriests(e.target.value.split(/[\n,]/).map(s => s.trim()).filter(Boolean))}
                    />
                    <p className="text-xs text-muted-foreground">Separate multiple names with commas</p>
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label>Volunteers Required</Label>
                    <Textarea
                      placeholder="Enter volunteer roles/groups (one per line, or comma-separated)"
                      rows={3}
                      value={formVolunteersRequired.join(", ")}
                      onChange={(e) => setFormVolunteersRequired(e.target.value.split(/[\n,]/).map(s => s.trim()).filter(Boolean))}
                    />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label>Equipment Needed</Label>
                    <Textarea
                      placeholder="Enter equipment (one per line, or comma-separated)"
                      rows={3}
                      value={formEquipmentNeeded.join(", ")}
                      onChange={(e) => setFormEquipmentNeeded(e.target.value.split(/[\n,]/).map(s => s.trim()).filter(Boolean))}
                    />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label>Hall Allocation</Label>
                    <Select value={formHallAllocation} onValueChange={setFormHallAllocation}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select hall/area" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="_none_">None</SelectItem>
                        {structureOptions && structureOptions.length > 0 ? (
                          structureOptions.map(s => (
                            <SelectItem key={s} value={s}>{s}</SelectItem>
                          ))
                        ) : (
                          <SelectItem value="_empty_" disabled>No structures available</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Section 5: Estimated Expenses */}
            <TabsContent value="expenses" className="space-y-4 mt-4">
              <div>
                <h3 className="text-sm font-semibold mb-3">🟢 Estimated Expenses (Optional)</h3>
                <p className="text-xs text-muted-foreground mb-4">Planning estimates only. Actual expenses tracked later in Event Expenses module.</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Decoration Estimate (₹)</Label>
                    <Input
                      type="number"
                      placeholder="e.g. 50000"
                      value={formEstDecoration}
                      onChange={(e) => setFormEstDecoration(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Priest Payment Estimate (₹)</Label>
                    <Input
                      type="number"
                      placeholder="e.g. 30000"
                      value={formEstPriestPayment}
                      onChange={(e) => setFormEstPriestPayment(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Food Cost Estimate (₹)</Label>
                    <Input
                      type="number"
                      placeholder="e.g. 100000"
                      value={formEstFoodCost}
                      onChange={(e) => setFormEstFoodCost(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Miscellaneous Estimate (₹)</Label>
                    <Input
                      type="number"
                      placeholder="e.g. 20000"
                      value={formEstMiscellaneous}
                      onChange={(e) => setFormEstMiscellaneous(e.target.value)}
                    />
                  </div>
                  <div className="col-span-2 pt-2 border-t">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Total Estimated Budget:</span>
                      <span className="text-lg font-bold text-primary">
                        ₹{(
                          Number(formEstDecoration || 0) +
                          Number(formEstPriestPayment || 0) +
                          Number(formEstFoodCost || 0) +
                          Number(formEstMiscellaneous || 0)
                        ).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <Separator className="my-4" />

          <DialogFooter>
            <Button variant="outline" onClick={() => { resetForm(); setDialogOpen(false); }}>
              Cancel
            </Button>
            <Button onClick={handleSaveTemplate}>
              {editTemplate ? "Update Template" : "Create Template"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Template Detail Dialog */}
      <Dialog open={!!viewTemplate} onOpenChange={() => setViewTemplate(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{viewTemplate?.name || "Template Details"}</DialogTitle>
          </DialogHeader>
          {viewTemplate && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs">Type</p>
                  <p className="font-medium">{viewTemplate.type}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Usage Count</p>
                  <p className="font-medium">{viewTemplate.usageCount}x</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Last Used</p>
                  <p className="font-medium">{viewTemplate.lastUsedDate || "Never"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Created</p>
                  <p className="font-medium">{viewTemplate.createdAt}</p>
                </div>
              </div>
              <Separator />
              <div>
                <p className="text-xs text-muted-foreground mb-1">Description</p>
                <p className="text-sm">{viewTemplate.description || "—"}</p>
              </div>
              {viewTemplate.attachedSevas.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Attached Sevas ({viewTemplate.attachedSevas.length})</p>
                  <div className="flex flex-wrap gap-1">
                    {viewTemplate.attachedSevas.map(s => (
                      <Badge key={s} variant="outline" className="text-xs">{s}</Badge>
                    ))}
                  </div>
                </div>
              )}
              {viewTemplate.enableDonations && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Donation Settings</p>
                  <div className="text-sm space-y-1">
                    <p>80G Type: {viewTemplate.donationEightyGType || "—"}</p>
                    <p>Goal: ₹{viewTemplate.suggestedDonationGoal?.toLocaleString() || "—"}</p>
                    <p>Minimum: ₹{viewTemplate.minimumDonationAmount?.toLocaleString() || "—"}</p>
                  </div>
                </div>
              )}
              {(viewTemplate.defaultPriests.length > 0 || viewTemplate.defaultFreelancers.length > 0 || viewTemplate.volunteersRequired.length > 0) && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Resources</p>
                  <div className="text-sm space-y-1">
                    {viewTemplate.defaultPriests.length > 0 && <p>Priests: {viewTemplate.defaultPriests.join(", ")}</p>}
                    {viewTemplate.defaultFreelancers.length > 0 && <p>Freelancers: {viewTemplate.defaultFreelancers.join(", ")}</p>}
                    {viewTemplate.volunteersRequired.length > 0 && <p>Volunteers: {viewTemplate.volunteersRequired.join(", ")}</p>}
                  </div>
                </div>
              )}
              {(viewTemplate.estDecorationCost || viewTemplate.estPriestPayment || viewTemplate.estFoodCost || viewTemplate.estMiscellaneous) && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Estimated Expenses</p>
                  <div className="text-sm space-y-1">
                    {viewTemplate.estDecorationCost && <p>Decoration: ₹{viewTemplate.estDecorationCost.toLocaleString()}</p>}
                    {viewTemplate.estPriestPayment && <p>Priest Payment: ₹{viewTemplate.estPriestPayment.toLocaleString()}</p>}
                    {viewTemplate.estFoodCost && <p>Food Cost: ₹{viewTemplate.estFoodCost.toLocaleString()}</p>}
                    {viewTemplate.estMiscellaneous && <p>Miscellaneous: ₹{viewTemplate.estMiscellaneous.toLocaleString()}</p>}
                    <p className="font-medium pt-1 border-t">
                      Total: ₹{(
                        (viewTemplate.estDecorationCost || 0) +
                        (viewTemplate.estPriestPayment || 0) +
                        (viewTemplate.estFoodCost || 0) +
                        (viewTemplate.estMiscellaneous || 0)
                      ).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewTemplate(null)}>Close</Button>
            <Button onClick={() => { if (viewTemplate) createFromTemplate(viewTemplate); setViewTemplate(null); }}>
              <Copy className="h-4 w-4 mr-2" />Use Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EventTemplates;
