import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertTriangle, CheckCircle2, UtensilsCrossed, Boxes, Users, Shield, Plus, Star, Link2, ClipboardList, ArrowRight, Package } from "lucide-react";
import { toast } from "sonner";
import SelectWithAddNew from "@/components/SelectWithAddNew";
import {
  eventRefs, eventMaterialAllocations, eventFreelancerAllocations,
  eventVolunteerAllocations, eventSecurityData, inventoryItems,
  freelancerRefs, kitchenBatches, recipes, autoTasks, templeStructures
} from "@/data/templeData";

const ResourcePlanning = () => {
  const [selectedEvent, setSelectedEvent] = useState("EVT-004");
  const [showAllocateMaterial, setShowAllocateMaterial] = useState(false);
  const [showAllocateFreelancer, setShowAllocateFreelancer] = useState(false);
  const [showAllocateVolunteer, setShowAllocateVolunteer] = useState(false);

  const event = eventRefs.find(e => e.id === selectedEvent);
  const materials = eventMaterialAllocations.filter(m => m.eventId === selectedEvent);
  const freelancers = eventFreelancerAllocations.filter(f => f.eventId === selectedEvent);
  const volunteers = eventVolunteerAllocations.filter(v => v.eventId === selectedEvent);
  const security = eventSecurityData.filter(s => s.eventId === selectedEvent);
  const linkedBatches = kitchenBatches.filter(b => b.eventId === selectedEvent);
  const linkedTasks = autoTasks.filter(t => t.linkedEntityName === event?.name || freelancers.some(f => f.taskId === t.id) || volunteers.some(v => v.taskId === t.id));

  const materialShortages = materials.filter(m => m.allocatedQty < m.requiredQty);
  const totalFreelancerCost = freelancers.reduce((a, f) => a + f.agreedPayment, 0);
  const totalVolunteers = volunteers.reduce((a, v) => a + v.count, 0);

  const [freelancerOptions, setFreelancerOptions] = useState(freelancerRefs.map(f => f.businessName));
  const [roleOptions, setRoleOptions] = useState(["Photography", "Videography", "Sound Engineering", "Decoration", "Lighting", "Catering", "Live Streaming", "Consulting"]);
  const [volunteerRoleOptions, setVolunteerRoleOptions] = useState(["Crowd Control", "Kitchen Assistants", "Ritual Support", "VIP Coordination", "Medical Support", "Parking", "Sanitation"]);
  const [areaOptions, setAreaOptions] = useState(["Main Gate", "Queue Lines", "Main Kitchen", "Annadanam Hall", "Main Temple", "Shrines", "VIP Entrance", "First Aid Counters"]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Resource Planning</h1>
          <p className="text-sm text-muted-foreground mt-1">Integrated resource allocation — materials from inventory, freelancers, volunteers, and logistics</p>
        </div>
        <Select value={selectedEvent} onValueChange={setSelectedEvent}>
          <SelectTrigger className="w-64 bg-background">
            <SelectValue placeholder="Select Event" />
          </SelectTrigger>
          <SelectContent className="bg-popover">
            {eventRefs.map(e => (
              <SelectItem key={e.id} value={e.id}>{e.id} — {e.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {event && (
        <div className="text-sm text-muted-foreground flex gap-4 items-center border rounded-lg p-3 bg-muted/30">
          <span><strong>Event:</strong> {event.name}</span>
          <span><strong>Type:</strong> {event.type}</span>
          <span><strong>Structure:</strong> {event.structure}</span>
          <span><strong>Dates:</strong> {event.startDate}{event.endDate !== event.startDate ? ` → ${event.endDate}` : ""}</span>
          <span><strong>Footfall:</strong> {event.footfall}/day</span>
          <Badge variant={event.status === "Approved" ? "default" : "secondary"}>{event.status}</Badge>
        </div>
      )}

      {/* Readiness Summary */}
      <div className="grid grid-cols-5 gap-4">
        <div className={`flex items-center gap-3 p-4 rounded-lg border ${materialShortages.length > 0 ? "border-amber-200 bg-amber-50/30" : "border-green-200 bg-green-50/30"}`}>
          <Boxes className={`h-5 w-5 ${materialShortages.length > 0 ? "text-amber-600" : "text-green-600"}`} />
          <div>
            <p className="text-sm font-medium">Materials</p>
            <p className={`text-xs ${materialShortages.length > 0 ? "text-amber-600" : "text-green-600"}`}>
              {materialShortages.length > 0 ? `${materialShortages.length} shortage(s)` : "All sourced"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 rounded-lg border border-green-200 bg-green-50/30">
          <Users className="h-5 w-5 text-green-600" />
          <div>
            <p className="text-sm font-medium">Freelancers</p>
            <p className="text-xs text-green-600">{freelancers.length} assigned · ₹{totalFreelancerCost.toLocaleString()}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 rounded-lg border border-green-200 bg-green-50/30">
          <Users className="h-5 w-5 text-green-600" />
          <div>
            <p className="text-sm font-medium">Volunteers</p>
            <p className="text-xs text-green-600">{totalVolunteers} deployed</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 rounded-lg border border-green-200 bg-green-50/30">
          <UtensilsCrossed className="h-5 w-5 text-green-600" />
          <div>
            <p className="text-sm font-medium">Kitchen</p>
            <p className="text-xs text-green-600">{linkedBatches.length} batch(es)</p>
          </div>
        </div>
        <div className={`flex items-center gap-3 p-4 rounded-lg border ${security.some(s => s.status !== "ok") ? "border-amber-200 bg-amber-50/30" : "border-green-200 bg-green-50/30"}`}>
          <Shield className={`h-5 w-5 ${security.some(s => s.status !== "ok") ? "text-amber-600" : "text-green-600"}`} />
          <div>
            <p className="text-sm font-medium">Security</p>
            <p className={`text-xs ${security.some(s => s.status !== "ok") ? "text-amber-600" : "text-green-600"}`}>
              {security.some(s => s.status !== "ok") ? "Warnings" : "Ready"}
            </p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="materials" className="w-full">
        <TabsList>
          <TabsTrigger value="materials">Materials from Inventory</TabsTrigger>
          <TabsTrigger value="freelancers">Freelancers</TabsTrigger>
          <TabsTrigger value="kitchen">Kitchen Batches</TabsTrigger>
          <TabsTrigger value="volunteers">Volunteers</TabsTrigger>
          <TabsTrigger value="security">Security & Logistics</TabsTrigger>
          <TabsTrigger value="tasks">Auto-Generated Tasks</TabsTrigger>
        </TabsList>

        {/* Materials Tab */}
        <TabsContent value="materials">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold">Material Allocation from Inventory</h3>
              <Button size="sm" onClick={() => setShowAllocateMaterial(true)}><Plus className="h-4 w-4 mr-2" />Allocate Material</Button>
            </div>
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Inventory ID</TableHead>
                    <TableHead>Material</TableHead>
                    <TableHead className="text-right">Required</TableHead>
                    <TableHead className="text-right">In Stock</TableHead>
                    <TableHead className="text-right">Allocated</TableHead>
                    <TableHead className="text-right">Deficit</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {materials.map((m, i) => {
                    const inv = inventoryItems.find(inv => inv.id === m.inventoryId);
                    const deficit = m.requiredQty - m.allocatedQty;
                    return (
                      <TableRow key={i} className={deficit > 0 ? "bg-amber-50/50" : ""}>
                        <TableCell className="font-mono text-xs text-primary">{m.inventoryId}</TableCell>
                        <TableCell className="font-medium">{m.inventoryName}</TableCell>
                        <TableCell className="text-right">{m.requiredQty.toLocaleString()} {m.unit}</TableCell>
                        <TableCell className="text-right text-muted-foreground">{inv?.currentStock.toLocaleString() ?? "—"} {m.unit}</TableCell>
                        <TableCell className="text-right font-medium">{m.allocatedQty.toLocaleString()} {m.unit}</TableCell>
                        <TableCell className="text-right">
                          {deficit > 0 ? (
                            <span className="text-amber-600 font-medium">{deficit.toLocaleString()} {m.unit}</span>
                          ) : (
                            <span className="text-green-600">✓ Fulfilled</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant={m.source === "Stock" ? "default" : "secondary"} className="text-xs">
                            {m.source}
                          </Badge>
                          {m.poId && <span className="ml-1 text-xs text-muted-foreground font-mono">{m.poId}</span>}
                        </TableCell>
                        <TableCell>
                          {deficit > 0 ? (
                            <Badge className="bg-amber-100 text-amber-700 border-0 text-xs">
                              <AlertTriangle className="h-3 w-3 mr-1" />Shortage
                            </Badge>
                          ) : (
                            <Badge className="bg-green-100 text-green-700 border-0 text-xs">
                              <CheckCircle2 className="h-3 w-3 mr-1" />Ready
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
            {materialShortages.length > 0 && (
              <div className="border border-amber-200 rounded-lg p-3 bg-amber-50/50">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <span className="text-sm font-semibold text-amber-800">Shortage Alerts → Auto-Generated Tasks</span>
                </div>
                <div className="space-y-1 text-sm text-amber-700">
                  {materialShortages.map((m, i) => (
                    <p key={i}>• {m.inventoryName}: Need {(m.requiredQty - m.allocatedQty).toLocaleString()} {m.unit} more → Task auto-created for procurement</p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Freelancers Tab */}
        <TabsContent value="freelancers">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold">Freelancer Assignments</h3>
                <p className="text-xs text-muted-foreground">Pulled from Freelancer Module • Each assignment auto-generates a Task</p>
              </div>
              <Button size="sm" onClick={() => setShowAllocateFreelancer(true)}><Plus className="h-4 w-4 mr-2" />Assign Freelancer</Button>
            </div>
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Freelancer ID</TableHead>
                    <TableHead>Business Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead className="text-right">Payment</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Linked Task</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {freelancers.map((f, i) => {
                    const ref = freelancerRefs.find(r => r.id === f.freelancerId);
                    return (
                      <TableRow key={i}>
                        <TableCell className="font-mono text-xs text-primary">{f.freelancerId}</TableCell>
                        <TableCell className="font-medium">{f.freelancerName}</TableCell>
                        <TableCell className="text-sm">{f.role}</TableCell>
                        <TableCell className="text-sm">{f.dates}</TableCell>
                        <TableCell className="text-right font-medium">₹{f.agreedPayment.toLocaleString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map(s => (
                              <Star key={s} className={`h-3 w-3 ${s <= Math.round(ref?.rating ?? 0) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`} />
                            ))}
                            <span className="ml-1 text-xs text-muted-foreground">{ref?.rating.toFixed(1)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={f.status === "Confirmed" ? "default" : f.status === "Completed" ? "default" : "secondary"}>{f.status}</Badge>
                        </TableCell>
                        <TableCell>
                          {f.taskId ? (
                            <span className="text-xs font-mono text-primary flex items-center gap-1">
                              <Link2 className="h-3 w-3" />{f.taskId}
                            </span>
                          ) : "—"}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <ClipboardList className="h-3 w-3" /> Total Cost: <strong>₹{totalFreelancerCost.toLocaleString()}</strong> • {freelancers.length} freelancers assigned
            </p>
          </div>
        </TabsContent>

        {/* Kitchen Tab */}
        <TabsContent value="kitchen">
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-semibold">Linked Kitchen Batches</h3>
              <p className="text-xs text-muted-foreground">Batches linked to this event • Materials auto-deducted from Inventory</p>
            </div>
            {linkedBatches.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">No kitchen batches linked to this event yet</p>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Batch ID</TableHead>
                      <TableHead>Prasadam</TableHead>
                      <TableHead>Date/Time</TableHead>
                      <TableHead className="text-right">Qty</TableHead>
                      <TableHead className="text-right">Allocated</TableHead>
                      <TableHead className="text-right">Remaining</TableHead>
                      <TableHead>Inventory Deductions</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {linkedBatches.map(b => (
                      <TableRow key={b.id}>
                        <TableCell className="font-mono text-xs text-primary">{b.id}</TableCell>
                        <TableCell className="font-medium">{b.prasadam}</TableCell>
                        <TableCell className="text-sm">{b.date} {b.time}</TableCell>
                        <TableCell className="text-right font-mono">{b.qty.toLocaleString()}</TableCell>
                        <TableCell className="text-right font-mono">{b.allocated.toLocaleString()}</TableCell>
                        <TableCell className="text-right font-mono">{b.remaining.toLocaleString()}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {b.inventoryDeductions.slice(0, 2).map((d, i) => (
                              <Badge key={i} variant="outline" className="text-[10px]">{d.inventoryName}: {d.qty}{d.unit}</Badge>
                            ))}
                            {b.inventoryDeductions.length > 2 && (
                              <Badge variant="outline" className="text-[10px]">+{b.inventoryDeductions.length - 2} more</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={b.status === "Active" ? "default" : "secondary"}>{b.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Volunteers Tab */}
        <TabsContent value="volunteers">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold">Volunteer Allocation</h3>
              <Button size="sm" onClick={() => setShowAllocateVolunteer(true)}><Plus className="h-4 w-4 mr-2" />Add Role</Button>
            </div>
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-center">Count</TableHead>
                    <TableHead>Shift Timing</TableHead>
                    <TableHead>Assigned Area</TableHead>
                    <TableHead>Linked Task</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {volunteers.map((v, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{v.role}</TableCell>
                      <TableCell className="text-center font-medium">{v.count}</TableCell>
                      <TableCell className="text-sm">{v.shift}</TableCell>
                      <TableCell className="text-sm">{v.area}</TableCell>
                      <TableCell>
                        {v.taskId ? (
                          <span className="text-xs font-mono text-primary flex items-center gap-1">
                            <Link2 className="h-3 w-3" />{v.taskId}
                          </span>
                        ) : "—"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <p className="text-xs text-muted-foreground">Total: <strong>{totalVolunteers}</strong> volunteers across {volunteers.length} roles</p>
          </div>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <div className="space-y-4">
            <h3 className="text-base font-semibold">Security & Logistics</h3>
            <div className="grid grid-cols-2 gap-4">
              {security.map((s, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <p className="text-sm font-medium">{s.item}</p>
                    <p className="text-sm text-muted-foreground">{s.value}</p>
                  </div>
                  {s.status === "ok" ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Auto-Generated Tasks Tab */}
        <TabsContent value="tasks">
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-semibold">Auto-Generated Tasks</h3>
              <p className="text-xs text-muted-foreground">Tasks auto-created from freelancer assignments, volunteer roles, and material shortages</p>
            </div>
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Task ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Linked To</TableHead>
                    <TableHead>Assignee</TableHead>
                    <TableHead>Due</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {linkedTasks.filter(t => t.autoGenerated).map(t => (
                    <TableRow key={t.id}>
                      <TableCell className="font-mono text-xs text-primary">{t.id}</TableCell>
                      <TableCell className="font-medium text-sm">{t.title}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[10px]">
                          {t.sourceType.replace("-", " → ")}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs">
                        {t.linkedEntityId && (
                          <span className="font-mono text-primary">{t.linkedEntityId}</span>
                        )}
                        {t.linkedEntityName && <span className="ml-1 text-muted-foreground">({t.linkedEntityName})</span>}
                      </TableCell>
                      <TableCell className="text-sm">{t.assignee}</TableCell>
                      <TableCell className="text-sm">{t.dueDate}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`text-xs ${
                          t.priority === "Critical" ? "bg-red-100 text-red-700" :
                          t.priority === "High" ? "bg-orange-100 text-orange-700" :
                          "bg-yellow-100 text-yellow-700"
                        }`}>{t.priority}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`text-xs ${
                          t.status === "Open" ? "bg-blue-100 text-blue-700" :
                          t.status === "Assigned" ? "bg-indigo-100 text-indigo-700" :
                          t.status === "In Progress" ? "bg-amber-100 text-amber-700" :
                          "bg-green-100 text-green-700"
                        }`}>{t.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                  {linkedTasks.filter(t => t.autoGenerated).length === 0 && (
                    <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">No auto-generated tasks for this event</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Allocate Material Dialog */}
      <Dialog open={showAllocateMaterial} onOpenChange={setShowAllocateMaterial}>
        <DialogContent className="max-w-lg bg-background">
          <DialogHeader><DialogTitle>Allocate Material from Inventory</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label className="text-xs">Material (from Inventory)</Label>
              <Select>
                <SelectTrigger className="bg-background"><SelectValue placeholder="Select inventory item" /></SelectTrigger>
                <SelectContent className="bg-popover">
                  {inventoryItems.map(inv => (
                    <SelectItem key={inv.id} value={inv.id}>{inv.id} – {inv.name} ({inv.currentStock} {inv.unit} available)</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-xs">Required Qty</Label><Input type="number" placeholder="e.g., 200" /></div>
              <div><Label className="text-xs">Unit</Label><Input placeholder="kg / ltr / pcs" /></div>
            </div>
            <div className="border rounded-lg p-3 bg-muted/30 text-xs text-muted-foreground">
              <Package className="h-4 w-4 inline mr-1" /> System will check current stock. If insufficient, a procurement task will be auto-generated.
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAllocateMaterial(false)}>Cancel</Button>
            <Button onClick={() => { toast.success("Material allocated & stock checked"); setShowAllocateMaterial(false); }}>Allocate</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Freelancer Dialog */}
      <Dialog open={showAllocateFreelancer} onOpenChange={setShowAllocateFreelancer}>
        <DialogContent className="max-w-lg bg-background">
          <DialogHeader><DialogTitle>Assign Freelancer to Event</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label className="text-xs">Freelancer</Label>
              <SelectWithAddNew value="" onValueChange={() => {}} placeholder="Select freelancer" options={freelancerOptions} onAddNew={v => setFreelancerOptions(p => [...p, v])} />
            </div>
            <div>
              <Label className="text-xs">Role / Service</Label>
              <SelectWithAddNew value="" onValueChange={() => {}} placeholder="Select role" options={roleOptions} onAddNew={v => setRoleOptions(p => [...p, v])} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-xs">Dates</Label><Input type="text" placeholder="e.g., 2026-02-15" /></div>
              <div><Label className="text-xs">Agreed Payment (₹)</Label><Input type="number" placeholder="Amount" /></div>
            </div>
            <div className="border rounded-lg p-3 bg-muted/30 text-xs text-muted-foreground">
              <ClipboardList className="h-4 w-4 inline mr-1" /> A task will be auto-generated in the Task module for this assignment.
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAllocateFreelancer(false)}>Cancel</Button>
            <Button onClick={() => { toast.success("Freelancer assigned & task generated"); setShowAllocateFreelancer(false); }}>Assign</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Allocate Volunteer Dialog */}
      <Dialog open={showAllocateVolunteer} onOpenChange={setShowAllocateVolunteer}>
        <DialogContent className="max-w-lg bg-background">
          <DialogHeader><DialogTitle>Add Volunteer Role</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label className="text-xs">Role</Label>
              <SelectWithAddNew value="" onValueChange={() => {}} placeholder="Select role" options={volunteerRoleOptions} onAddNew={v => setVolunteerRoleOptions(p => [...p, v])} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-xs">Count</Label><Input type="number" placeholder="e.g., 50" /></div>
              <div><Label className="text-xs">Shift</Label><Input placeholder="e.g., 6 AM – 2 PM" /></div>
            </div>
            <div>
              <Label className="text-xs">Assigned Area</Label>
              <SelectWithAddNew value="" onValueChange={() => {}} placeholder="Select area" options={areaOptions} onAddNew={v => setAreaOptions(p => [...p, v])} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAllocateVolunteer(false)}>Cancel</Button>
            <Button onClick={() => { toast.success("Volunteer role added & task generated"); setShowAllocateVolunteer(false); }}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ResourcePlanning;
