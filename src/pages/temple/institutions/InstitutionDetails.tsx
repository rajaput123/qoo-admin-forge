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
  ArrowLeft, Building2, Users, Package, CalendarDays, UserCheck,
  BarChart3, Plus, IndianRupee, Heart, Award, Link2
} from "lucide-react";
import {
  institutions, institutionTeamMembers, institutionEvents,
  institutionResources, institutionFinancials, institutionVolunteers,
} from "@/data/institutionData";
import { toast } from "@/hooks/use-toast";

const InstitutionDetails = () => {
  const { institutionId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [showAddTeam, setShowAddTeam] = useState(false);

  const inst = institutions.find(i => i.id === institutionId);
  if (!inst) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">Institution not found.</p>
        <Button variant="outline" onClick={() => navigate("/temple/institutions")} className="mt-4">Back to Institutions</Button>
      </div>
    );
  }

  const team = institutionTeamMembers.filter(t => t.institutionId === institutionId);
  const events = institutionEvents.filter(e => e.institutionId === institutionId);
  const resources = institutionResources.filter(r => r.institutionId === institutionId);
  const financials = institutionFinancials.filter(f => f.institutionId === institutionId);
  const volunteers = institutionVolunteers.filter(v => v.institutionId === institutionId);

  const statusColor = (s: string) => {
    if (s === "Active" || s === "Available") return "text-green-700 border-green-300 bg-green-50";
    if (s === "Inactive" || s === "Cancelled") return "text-red-700 border-red-300 bg-red-50";
    if (s === "Completed") return "text-blue-700 border-blue-300 bg-blue-50";
    if (s === "In Use") return "text-blue-700 border-blue-300 bg-blue-50";
    return "text-amber-700 border-amber-300 bg-amber-50";
  };

  const typeColor: Record<string, string> = {
    "School": "bg-blue-50 text-blue-700 border-blue-200",
    "College": "bg-indigo-50 text-indigo-700 border-indigo-200",
    "Hospital": "bg-red-50 text-red-700 border-red-200",
    "Goshala": "bg-green-50 text-green-700 border-green-200",
    "Cultural Center": "bg-purple-50 text-purple-700 border-purple-200",
    "NGO": "bg-teal-50 text-teal-700 border-teal-200",
    "Veda Pathashala": "bg-amber-50 text-amber-700 border-amber-200",
    "Annadanam Foundation": "bg-orange-50 text-orange-700 border-orange-200",
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/temple/institutions")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-semibold">{inst.name}</h1>
            <Badge variant="outline" className={`text-xs ${typeColor[inst.type] || ""}`}>{inst.type}</Badge>
            <Badge variant="outline" className={`text-xs ${statusColor(inst.status)}`}>{inst.status}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">{inst.id} • {inst.city}, {inst.state}</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex flex-wrap h-auto gap-1">
          <TabsTrigger value="overview" className="gap-1.5 text-xs"><Building2 className="h-3.5 w-3.5" />Overview</TabsTrigger>
          <TabsTrigger value="team" className="gap-1.5 text-xs"><Users className="h-3.5 w-3.5" />Management Team</TabsTrigger>
          <TabsTrigger value="events" className="gap-1.5 text-xs"><CalendarDays className="h-3.5 w-3.5" />Events</TabsTrigger>
          <TabsTrigger value="resources" className="gap-1.5 text-xs"><Package className="h-3.5 w-3.5" />Resources</TabsTrigger>
          <TabsTrigger value="financial" className="gap-1.5 text-xs"><IndianRupee className="h-3.5 w-3.5" />Financial Summary</TabsTrigger>
          <TabsTrigger value="volunteers" className="gap-1.5 text-xs"><UserCheck className="h-3.5 w-3.5" />Volunteers</TabsTrigger>
          <TabsTrigger value="reports" className="gap-1.5 text-xs"><BarChart3 className="h-3.5 w-3.5" />Reports</TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-base">Institution Information</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {[
                  ["Name", inst.name],
                  ["Type", inst.type],
                  ["Address", inst.address],
                  ["City / State", `${inst.city}, ${inst.state}`],
                  ["Country", inst.country],
                  ["Registration No.", inst.registrationNumber],
                  ["Created Date", inst.createdDate],
                ].map(([label, val]) => (
                  <div key={label} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-medium text-right max-w-[60%]">{val}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-base">Contact & Linkage</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {[
                  ["Contact", inst.contactNumber],
                  ["Email", inst.email],
                  ["Institution Head", inst.institutionHead],
                  ["Linked Trust", inst.linkedTrust],
                  ["Linked Branch", inst.linkedBranch || "Not Linked"],
                  ["Total Staff", inst.totalStaff.toString()],
                  ["Status", inst.status],
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
            <Card><CardContent className="p-4"><Heart className="h-5 w-5 text-red-500 mb-2" /><p className="text-2xl font-bold">₹{(inst.monthlyDonations / 1000).toFixed(0)}K</p><p className="text-[11px] text-muted-foreground">Monthly Donations</p></CardContent></Card>
            <Card><CardContent className="p-4"><IndianRupee className="h-5 w-5 text-amber-600 mb-2" /><p className="text-2xl font-bold">₹{(inst.monthlyExpense / 1000).toFixed(0)}K</p><p className="text-[11px] text-muted-foreground">Monthly Expense</p></CardContent></Card>
            <Card><CardContent className="p-4"><UserCheck className="h-5 w-5 text-blue-600 mb-2" /><p className="text-2xl font-bold">{inst.volunteerCount}</p><p className="text-[11px] text-muted-foreground">Volunteers</p></CardContent></Card>
            <Card><CardContent className="p-4"><CalendarDays className="h-5 w-5 text-primary mb-2" /><p className="text-2xl font-bold">{inst.activeEvents}</p><p className="text-[11px] text-muted-foreground">Active Events</p></CardContent></Card>
          </div>
        </TabsContent>

        {/* Management Team */}
        <TabsContent value="team">
          <Card>
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-base">Management Team</CardTitle>
              <Button size="sm" onClick={() => setShowAddTeam(true)} className="gap-1.5"><Plus className="h-3.5 w-3.5" />Add Member</Button>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {team.map(t => (
                    <TableRow key={t.id}>
                      <TableCell>
                        <p className="font-medium text-sm">{t.name}</p>
                        <p className="text-xs text-muted-foreground">{t.mobile}</p>
                      </TableCell>
                      <TableCell><Badge variant="outline" className="text-xs">{t.role}</Badge></TableCell>
                      <TableCell className="text-sm">{t.department}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{t.email}</TableCell>
                      <TableCell><Badge variant="outline" className={`text-xs ${statusColor(t.status)}`}>{t.status}</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Events */}
        <TabsContent value="events">
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">Institution Events</CardTitle></CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Linked Temple Event</TableHead>
                    <TableHead className="text-center">Shared Vol.</TableHead>
                    <TableHead className="text-center">Shared Stock</TableHead>
                    <TableHead className="text-right">Budget</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events.map(e => (
                    <TableRow key={e.id}>
                      <TableCell className="font-medium text-sm">{e.name}</TableCell>
                      <TableCell><Badge variant="outline" className="text-xs">{e.type}</Badge></TableCell>
                      <TableCell className="text-sm">{e.date}{e.endDate !== e.date ? ` – ${e.endDate}` : ""}</TableCell>
                      <TableCell className="text-sm">
                        {e.linkedTempleEvent ? (
                          <span className="inline-flex items-center gap-1 text-primary"><Link2 className="h-3 w-3" />{e.linkedTempleEvent}</span>
                        ) : <span className="text-muted-foreground">—</span>}
                      </TableCell>
                      <TableCell className="text-center">{e.sharedVolunteers ? <Badge className="text-xs bg-blue-100 text-blue-700">Yes</Badge> : <span className="text-xs text-muted-foreground">No</span>}</TableCell>
                      <TableCell className="text-center">{e.sharedStock ? <Badge className="text-xs bg-blue-100 text-blue-700">Yes</Badge> : <span className="text-xs text-muted-foreground">No</span>}</TableCell>
                      <TableCell className="text-right text-sm">₹{e.budget.toLocaleString()}</TableCell>
                      <TableCell><Badge variant="outline" className={`text-xs ${statusColor(e.status)}`}>{e.status}</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Resources */}
        <TabsContent value="resources">
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">Institution Resources</CardTitle></CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Resource</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Ownership</TableHead>
                    <TableHead className="text-center">Quantity</TableHead>
                    <TableHead className="text-right">Value</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {resources.map(r => (
                    <TableRow key={r.id}>
                      <TableCell className="font-medium text-sm">{r.name}</TableCell>
                      <TableCell><Badge variant="outline" className="text-xs">{r.category}</Badge></TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`text-xs ${r.type === "Temple-Shared" ? "bg-blue-50 text-blue-700 border-blue-200" : ""}`}>{r.type}</Badge>
                      </TableCell>
                      <TableCell className="text-center text-sm">{r.quantity} {r.unit}</TableCell>
                      <TableCell className="text-right text-sm font-medium">{r.value > 0 ? `₹${r.value.toLocaleString()}` : "Shared"}</TableCell>
                      <TableCell><Badge variant="outline" className={`text-xs ${statusColor(r.status)}`}>{r.status}</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Financial Summary */}
        <TabsContent value="financial" className="space-y-6">
          {financials.length > 0 && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {(() => {
                  const latest = financials[0];
                  return [
                    { label: "Donations", value: `₹${(latest.donationsReceived / 1000).toFixed(0)}K`, icon: Heart, color: "text-red-500" },
                    { label: "Expenses", value: `₹${(latest.operationalExpenses / 1000).toFixed(0)}K`, icon: IndianRupee, color: "text-amber-600" },
                    { label: "Grants", value: `₹${(latest.grants / 1000).toFixed(0)}K`, icon: Award, color: "text-green-600" },
                    { label: "Sponsorship", value: `₹${(latest.sponsorship / 1000).toFixed(0)}K`, icon: Heart, color: "text-purple-600" },
                    { label: "Surplus", value: `₹${(latest.surplus / 1000).toFixed(0)}K`, icon: IndianRupee, color: latest.surplus >= 0 ? "text-green-600" : "text-red-600" },
                  ].map((kpi, i) => (
                    <Card key={i}><CardContent className="p-4"><kpi.icon className={`h-5 w-5 ${kpi.color} mb-2`} /><p className="text-2xl font-bold">{kpi.value}</p><p className="text-[11px] text-muted-foreground">{kpi.label}</p></CardContent></Card>
                  ));
                })()}
              </div>
              <Card>
                <CardHeader className="pb-3"><CardTitle className="text-base">Monthly Financial History</CardTitle></CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Month</TableHead>
                        <TableHead className="text-right">Donations</TableHead>
                        <TableHead className="text-right">Expenses</TableHead>
                        <TableHead className="text-right">Grants</TableHead>
                        <TableHead className="text-right">Sponsorship</TableHead>
                        <TableHead className="text-right">Surplus</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {financials.map((f, i) => (
                        <TableRow key={i}>
                          <TableCell className="font-medium text-sm">{f.month}</TableCell>
                          <TableCell className="text-right text-sm text-green-600">₹{f.donationsReceived.toLocaleString()}</TableCell>
                          <TableCell className="text-right text-sm">₹{f.operationalExpenses.toLocaleString()}</TableCell>
                          <TableCell className="text-right text-sm">₹{f.grants.toLocaleString()}</TableCell>
                          <TableCell className="text-right text-sm">₹{f.sponsorship.toLocaleString()}</TableCell>
                          <TableCell className={`text-right text-sm font-medium ${f.surplus >= 0 ? "text-green-700" : "text-red-700"}`}>₹{f.surplus.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        {/* Volunteers */}
        <TabsContent value="volunteers">
          <Card>
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-base">Institution Volunteers</CardTitle>
              <Badge variant="secondary" className="text-xs">{volunteers.length} volunteers</Badge>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Shift</TableHead>
                    <TableHead className="text-center">Shared Pool</TableHead>
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
                      <TableCell className="text-center">{v.shared ? <Badge className="text-xs bg-blue-100 text-blue-700">Shared</Badge> : <span className="text-xs text-muted-foreground">Institution</span>}</TableCell>
                      <TableCell><Badge variant="outline" className={`text-xs ${statusColor(v.status)}`}>{v.status}</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reports */}
        <TabsContent value="reports">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-base">Summary</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {[
                  ["Total Events", events.length.toString()],
                  ["Completed Events", events.filter(e => e.status === "Completed").length.toString()],
                  ["Total Event Budget", `₹${events.reduce((s, e) => s + e.budget, 0).toLocaleString()}`],
                  ["Total Resources", resources.length.toString()],
                  ["Own Resources Value", `₹${resources.filter(r => r.type === "Own").reduce((s, r) => s + r.value, 0).toLocaleString()}`],
                  ["Active Volunteers", volunteers.filter(v => v.status === "Active").length.toString()],
                  ["Shared Volunteers", volunteers.filter(v => v.shared).length.toString()],
                ].map(([label, val]) => (
                  <div key={label} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-medium">{val}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-base">Temple Collaboration</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {[
                  ["Events with Temple Link", events.filter(e => e.linkedTempleEvent).length.toString()],
                  ["Events with Shared Volunteers", events.filter(e => e.sharedVolunteers).length.toString()],
                  ["Events with Shared Stock", events.filter(e => e.sharedStock).length.toString()],
                  ["Temple-Shared Resources", resources.filter(r => r.type === "Temple-Shared").length.toString()],
                  ["Linked Branch", inst.linkedBranch || "None"],
                ].map(([label, val]) => (
                  <div key={label} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-medium">{val}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Team Member Popup */}
      <Dialog open={showAddTeam} onOpenChange={setShowAddTeam}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Add Team Member</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Name</Label><Input placeholder="Full name" /></div>
            <div><Label>Email</Label><Input placeholder="email@institution.org" /></div>
            <div><Label>Mobile</Label><Input placeholder="+91..." /></div>
            <div>
              <Label>Role</Label>
              <Select>
                <SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger>
                <SelectContent>
                  {["Principal", "Director", "Admin Officer", "Coordinator", "Manager", "Trustee Representative"].map(r => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div><Label>Department</Label><Input placeholder="Department" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddTeam(false)}>Cancel</Button>
            <Button onClick={() => { setShowAddTeam(false); toast({ title: "Member Added", description: "Team member has been added." }); }}>Add Member</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default InstitutionDetails;
