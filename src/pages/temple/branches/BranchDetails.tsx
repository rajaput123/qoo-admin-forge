import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  ArrowLeft, Building2, Users, Package, CalendarDays, UserCheck, Briefcase,
  UtensilsCrossed, BarChart3, Plus, MapPin, Shield, IndianRupee, AlertTriangle,
  Star, Clock
} from "lucide-react";
import {
  branches, branchAdminUsers, branchStructures, branchStockSummaries,
  branchEvents, branchVolunteers, branchFreelancers, branchKitchenSummaries,
  branchReports
} from "@/data/branchData";
import { toast } from "@/hooks/use-toast";

interface BranchDetailsProps {
  branchId?: string;
  onBack?: () => void;
}

const BranchDetails = ({ branchId: propBranchId, onBack }: BranchDetailsProps) => {
  const { branchId: paramBranchId } = useParams();
  const branchId = propBranchId || paramBranchId || "";
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [showAddAdmin, setShowAddAdmin] = useState(false);

  const branch = branches.find(b => b.id === branchId);
  if (!branch) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">Branch not found.</p>
        <Button variant="outline" onClick={() => onBack ? onBack() : navigate("/temple/branches")} className="mt-4">Back to Branches</Button>
      </div>
    );
  }

  const admins = branchAdminUsers.filter(a => a.branchId === branchId);
  const structures = branchStructures.filter(s => s.branchId === branchId);
  const stockSummary = branchStockSummaries.find(s => s.branchId === branchId);
  const events = branchEvents.filter(e => e.branchId === branchId);
  const volunteers = branchVolunteers.filter(v => v.branchId === branchId);
  const freelancers = branchFreelancers.filter(f => f.branchId === branchId);
  const kitchen = branchKitchenSummaries.find(k => k.branchId === branchId);
  const reports = branchReports.filter(r => r.branchId === branchId);

  const statusColor = (s: string) => {
    if (s === "Active") return "text-green-700 border-green-300 bg-green-50";
    if (s === "Inactive" || s === "Cancelled") return "text-red-700 border-red-300 bg-red-50";
    if (s === "Completed") return "text-blue-700 border-blue-300 bg-blue-50";
    return "text-amber-700 border-amber-300 bg-amber-50";
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => onBack ? onBack() : navigate("/temple/branches")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-semibold">{branch.name}</h1>
              <Badge variant="outline" className={`text-xs ${statusColor(branch.status)}`}>{branch.status}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">{branch.code} • {branch.city}, {branch.state}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent flex-wrap">
          <TabsTrigger value="overview" className="rounded-none border-b-2 border-transparent data-[state=active]:border-amber-700 data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:font-medium px-4 py-2 text-sm text-muted-foreground"><Building2 className="h-3.5 w-3.5" />Overview</TabsTrigger>
          <TabsTrigger value="structures" className="rounded-none border-b-2 border-transparent data-[state=active]:border-amber-700 data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:font-medium px-4 py-2 text-sm text-muted-foreground"><MapPin className="h-3.5 w-3.5" />Structures</TabsTrigger>
          <TabsTrigger value="admins" className="rounded-none border-b-2 border-transparent data-[state=active]:border-amber-700 data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:font-medium px-4 py-2 text-sm text-muted-foreground"><Shield className="h-3.5 w-3.5" />Admin Users</TabsTrigger>
          <TabsTrigger value="stock" className="rounded-none border-b-2 border-transparent data-[state=active]:border-amber-700 data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:font-medium px-4 py-2 text-sm text-muted-foreground"><Package className="h-3.5 w-3.5" />Stock Summary</TabsTrigger>
          <TabsTrigger value="events" className="rounded-none border-b-2 border-transparent data-[state=active]:border-amber-700 data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:font-medium px-4 py-2 text-sm text-muted-foreground"><CalendarDays className="h-3.5 w-3.5" />Events</TabsTrigger>
          <TabsTrigger value="volunteers" className="rounded-none border-b-2 border-transparent data-[state=active]:border-amber-700 data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:font-medium px-4 py-2 text-sm text-muted-foreground"><UserCheck className="h-3.5 w-3.5" />Volunteers</TabsTrigger>
          <TabsTrigger value="freelancers" className="rounded-none border-b-2 border-transparent data-[state=active]:border-amber-700 data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:font-medium px-4 py-2 text-sm text-muted-foreground"><Briefcase className="h-3.5 w-3.5" />Freelancers</TabsTrigger>
          <TabsTrigger value="kitchen" className="rounded-none border-b-2 border-transparent data-[state=active]:border-amber-700 data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:font-medium px-4 py-2 text-sm text-muted-foreground"><UtensilsCrossed className="h-3.5 w-3.5" />Kitchen</TabsTrigger>
          <TabsTrigger value="reports" className="rounded-none border-b-2 border-transparent data-[state=active]:border-amber-700 data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:font-medium px-4 py-2 text-sm text-muted-foreground"><BarChart3 className="h-3.5 w-3.5" />Reports</TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-base">Branch Information</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {[
                  ["Branch Name", branch.name],
                  ["Code", branch.code],
                  ["Address", branch.address],
                  ["City / State", `${branch.city}, ${branch.state}`],
                  ["Country", branch.country],
                  ["Created Date", branch.createdDate],
                ].map(([label, val]) => (
                  <div key={label} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-medium text-right max-w-[60%]">{val}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-base">Contact & Admin</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {[
                  ["Contact", branch.contactNumber],
                  ["Email", branch.email],
                  ["Branch Head", branch.branchHead],
                  ["GST Number", branch.gstNumber || "Not Applicable"],
                  ["Structures", branch.structureCount.toString()],
                  ["Status", branch.status],
                ].map(([label, val]) => (
                  <div key={label} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-medium">{val}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card><CardContent className="p-4"><p className="text-2xl font-bold">₹{(branch.monthlyRevenue / 100000).toFixed(1)}L</p><p className="text-[11px] text-muted-foreground">Monthly Revenue</p></CardContent></Card>
            <Card><CardContent className="p-4"><p className="text-2xl font-bold">₹{(branch.monthlyExpense / 100000).toFixed(1)}L</p><p className="text-[11px] text-muted-foreground">Monthly Expense</p></CardContent></Card>
            <Card><CardContent className="p-4"><p className="text-2xl font-bold">{branch.volunteerCount}</p><p className="text-[11px] text-muted-foreground">Volunteers</p></CardContent></Card>
            <Card><CardContent className="p-4"><p className="text-2xl font-bold">{branch.freelancerCount}</p><p className="text-[11px] text-muted-foreground">Freelancers</p></CardContent></Card>
          </div>
        </TabsContent>

        {/* Structures */}
        <TabsContent value="structures">
          <Card>
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-base">Branch Structures</CardTitle>
              <Badge variant="secondary" className="text-xs">{structures.length} structures</Badge>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-center">Capacity</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {structures.map(s => (
                    <TableRow key={s.id}>
                      <TableCell className="font-medium text-sm">{s.name}</TableCell>
                      <TableCell><Badge variant="outline" className="text-xs">{s.type}</Badge></TableCell>
                      <TableCell className="text-center text-sm">{s.capacity ? s.capacity.toLocaleString() : "—"}</TableCell>
                      <TableCell><Badge variant="outline" className={`text-xs ${statusColor(s.status)}`}>{s.status}</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Admin Users */}
        <TabsContent value="admins">
          <Card>
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-base">Admin Users</CardTitle>
              <Button size="sm" onClick={() => setShowAddAdmin(true)} className="gap-1.5"><Plus className="h-3.5 w-3.5" />Assign User</Button>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Access Scope</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {admins.map(a => (
                    <TableRow key={a.id}>
                      <TableCell>
                        <p className="font-medium text-sm">{a.name}</p>
                        <p className="text-xs text-muted-foreground">{a.mobile}</p>
                      </TableCell>
                      <TableCell><Badge variant="outline" className="text-xs">{a.role}</Badge></TableCell>
                      <TableCell className="text-sm text-muted-foreground">{a.email}</TableCell>
                      <TableCell className="text-sm">{a.accessScope}</TableCell>
                      <TableCell><Badge variant="outline" className={`text-xs ${statusColor(a.status)}`}>{a.status}</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Stock Summary */}
        <TabsContent value="stock" className="space-y-6">
          {stockSummary && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card><CardContent className="p-4"><Package className="h-5 w-5 text-primary mb-2" /><p className="text-2xl font-bold">{stockSummary.totalItems}</p><p className="text-[11px] text-muted-foreground">Total Items</p></CardContent></Card>
                <Card><CardContent className="p-4"><AlertTriangle className="h-5 w-5 text-amber-600 mb-2" /><p className="text-2xl font-bold">{stockSummary.lowStockItems}</p><p className="text-[11px] text-muted-foreground">Low Stock</p></CardContent></Card>
                <Card><CardContent className="p-4"><Package className="h-5 w-5 text-destructive mb-2" /><p className="text-2xl font-bold">{stockSummary.outOfStock}</p><p className="text-[11px] text-muted-foreground">Out of Stock</p></CardContent></Card>
                <Card><CardContent className="p-4"><IndianRupee className="h-5 w-5 text-green-600 mb-2" /><p className="text-2xl font-bold">₹{stockSummary.totalValue.toLocaleString()}</p><p className="text-[11px] text-muted-foreground">Stock Value</p></CardContent></Card>
              </div>
              <Card>
                <CardHeader className="pb-3"><CardTitle className="text-base">Store-wise Breakdown</CardTitle></CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Store</TableHead>
                        <TableHead className="text-center">Items</TableHead>
                        <TableHead className="text-center">Low Stock</TableHead>
                        <TableHead className="text-right">Value</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {stockSummary.storeWise.map(s => (
                        <TableRow key={s.store}>
                          <TableCell className="font-medium text-sm">{s.store}</TableCell>
                          <TableCell className="text-center text-sm">{s.items}</TableCell>
                          <TableCell className="text-center">
                            {s.lowStock > 0 ? <Badge variant="destructive" className="text-xs">{s.lowStock}</Badge> : <span className="text-xs text-muted-foreground">0</span>}
                          </TableCell>
                          <TableCell className="text-right font-medium text-sm">₹{s.value.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        {/* Events */}
        <TabsContent value="events">
          <Card>
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-base">Branch Events</CardTitle>
              <Badge variant="secondary" className="text-xs">{events.length} events</Badge>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Budget</TableHead>
                    <TableHead className="text-right">Actual</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events.map(e => (
                    <TableRow key={e.id}>
                      <TableCell className="font-medium text-sm">{e.name}</TableCell>
                      <TableCell><Badge variant="outline" className="text-xs">{e.type}</Badge></TableCell>
                      <TableCell className="text-sm">{e.startDate}{e.endDate !== e.startDate ? ` – ${e.endDate}` : ""}</TableCell>
                      <TableCell className="text-right text-sm">₹{e.budget.toLocaleString()}</TableCell>
                      <TableCell className="text-right text-sm">₹{e.actualSpend.toLocaleString()}</TableCell>
                      <TableCell><Badge variant="outline" className={`text-xs ${statusColor(e.status)}`}>{e.status}</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Volunteers */}
        <TabsContent value="volunteers">
          <Card>
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-base">Branch Volunteers</CardTitle>
              <Badge variant="secondary" className="text-xs">{volunteers.length} volunteers</Badge>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Shift</TableHead>
                    <TableHead>Structure</TableHead>
                    <TableHead className="text-center">Cross-Branch</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {volunteers.map(v => (
                    <TableRow key={v.id}>
                      <TableCell>
                        <p className="font-medium text-sm">{v.name}</p>
                        <p className="text-xs text-muted-foreground">{v.mobile}</p>
                      </TableCell>
                      <TableCell className="text-sm">{v.role}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{v.shift}</TableCell>
                      <TableCell><Badge variant="outline" className="text-xs">{v.structure}</Badge></TableCell>
                      <TableCell className="text-center">{v.crossBranch ? <Badge className="text-xs bg-blue-100 text-blue-700">Yes</Badge> : <span className="text-xs text-muted-foreground">No</span>}</TableCell>
                      <TableCell><Badge variant="outline" className={`text-xs ${statusColor(v.status)}`}>{v.status}</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Freelancers */}
        <TabsContent value="freelancers">
          <Card>
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-base">Branch Freelancers</CardTitle>
              <Badge variant="secondary" className="text-xs">{freelancers.length} freelancers</Badge>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead className="text-center">Rating</TableHead>
                    <TableHead className="text-center">Assignments</TableHead>
                    <TableHead className="text-right">Total Paid</TableHead>
                    <TableHead className="text-center">Shared</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {freelancers.map(f => (
                    <TableRow key={f.id}>
                      <TableCell>
                        <p className="font-medium text-sm">{f.name}</p>
                        <p className="text-xs text-muted-foreground">{f.mobile}</p>
                      </TableCell>
                      <TableCell className="text-sm">{f.service}</TableCell>
                      <TableCell className="text-center"><span className="inline-flex items-center gap-1 text-sm"><Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />{f.rating}</span></TableCell>
                      <TableCell className="text-center text-sm">{f.totalAssignments}</TableCell>
                      <TableCell className="text-right text-sm font-medium">₹{f.totalPaid.toLocaleString()}</TableCell>
                      <TableCell className="text-center">{f.shared ? <Badge className="text-xs bg-blue-100 text-blue-700">Shared</Badge> : <span className="text-xs text-muted-foreground">Branch</span>}</TableCell>
                      <TableCell><Badge variant="outline" className={`text-xs ${statusColor(f.status)}`}>{f.status}</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Kitchen */}
        <TabsContent value="kitchen" className="space-y-6">
          {kitchen && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <Card><CardContent className="p-4"><p className="text-2xl font-bold">{kitchen.activeBatches}</p><p className="text-[11px] text-muted-foreground">Active Batches</p></CardContent></Card>
                <Card><CardContent className="p-4"><p className="text-2xl font-bold">{kitchen.todayMeals.toLocaleString()}</p><p className="text-[11px] text-muted-foreground">Today's Meals</p></CardContent></Card>
                <Card><CardContent className="p-4"><p className="text-2xl font-bold">{kitchen.ingredientRequests}</p><p className="text-[11px] text-muted-foreground">Ingredient Requests</p></CardContent></Card>
                <Card><CardContent className="p-4"><p className="text-2xl font-bold">{kitchen.pendingRequests}</p><p className="text-[11px] text-muted-foreground">Pending Requests</p></CardContent></Card>
                <Card><CardContent className="p-4"><p className="text-2xl font-bold">{kitchen.wastagePercent}%</p><p className="text-[11px] text-muted-foreground">Wastage Rate</p></CardContent></Card>
              </div>
              <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                  <UtensilsCrossed className="h-8 w-8 mx-auto mb-2 opacity-40" />
                  <p className="text-sm">Kitchen operations for this branch are isolated. Ingredient requests deduct from branch stock only.</p>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        {/* Reports */}
        <TabsContent value="reports">
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">Monthly Reports</CardTitle></CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Month</TableHead>
                    <TableHead className="text-right">Revenue</TableHead>
                    <TableHead className="text-right">Event Cost</TableHead>
                    <TableHead className="text-right">Materials</TableHead>
                    <TableHead className="text-right">Kitchen</TableHead>
                    <TableHead className="text-right">Freelancers</TableHead>
                    <TableHead className="text-center">Vol. Hours</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports.map((r, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium text-sm">{r.month}</TableCell>
                      <TableCell className="text-right text-sm text-green-600 font-medium">₹{r.revenue.toLocaleString()}</TableCell>
                      <TableCell className="text-right text-sm">₹{r.eventCost.toLocaleString()}</TableCell>
                      <TableCell className="text-right text-sm">₹{r.materialUsage.toLocaleString()}</TableCell>
                      <TableCell className="text-right text-sm">₹{r.kitchenConsumption.toLocaleString()}</TableCell>
                      <TableCell className="text-right text-sm">₹{r.freelancerPayments.toLocaleString()}</TableCell>
                      <TableCell className="text-center text-sm">{r.volunteerHours.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Admin Popup */}
      <Dialog open={showAddAdmin} onOpenChange={setShowAddAdmin}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Assign Admin User</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>User Name</Label><Input placeholder="Full name" /></div>
            <div><Label>Email</Label><Input placeholder="email@temple.org" /></div>
            <div><Label>Mobile</Label><Input placeholder="+91..." /></div>
            <div>
              <Label>Role</Label>
              <Select>
                <SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger>
                <SelectContent>
                  {["Branch Admin", "Kitchen Manager", "Store Keeper", "Event Coordinator", "Priest Coordinator", "Finance Manager"].map(r => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Access Scope</Label>
              <Select>
                <SelectTrigger><SelectValue placeholder="Select scope" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Full Access">Full Access</SelectItem>
                  <SelectItem value="Module Specific">Module Specific</SelectItem>
                  <SelectItem value="Read Only">Read Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddAdmin(false)}>Cancel</Button>
            <Button onClick={() => { setShowAddAdmin(false); toast({ title: "User Assigned", description: "Admin user has been assigned to this branch." }); }}>Assign</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default BranchDetails;
