import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Plus, UserPlus, Eye } from "lucide-react";

const onboardingRequests = [
  { id: "ONB-001", name: "Hari Flowers", businessType: "Individual", category: "Flowers", contactPerson: "Hari Prasad", phone: "+91 91234 56789", email: "hari@gmail.com", city: "Tirupati", status: "Submitted", submittedDate: "2026-02-07", gst: "", pan: "ABCDE1234F", yearsInBusiness: 5, address: "10, Flower St, Tirupati", state: "AP", materials: ["Fresh Flowers", "Garlands"], structures: ["Main Temple", "Shrines"], deliverySchedule: "Daily", bankName: "SBI", accountNumber: "123456789", ifsc: "SBIN0001234", upi: "hari@upi", docVerified: false, physicalVerified: false, approvedBy: "", notes: "" },
  { id: "ONB-002", name: "Sai Provisions", businessType: "Proprietorship", category: "Grocery", contactPerson: "Sai Ram", phone: "+91 82345 67890", email: "sai@provisions.com", city: "Tirumala", status: "Under Review", submittedDate: "2026-02-05", gst: "37XYZAB1234C5ZD", pan: "XYZAB1234C", yearsInBusiness: 10, address: "25, Market Rd, Tirumala", state: "AP", materials: ["Rice", "Dal", "Spices"], structures: ["Kitchen"], deliverySchedule: "Weekly", bankName: "HDFC", accountNumber: "987654321", ifsc: "HDFC0005678", upi: "", docVerified: true, physicalVerified: false, approvedBy: "", notes: "Documents verified. Pending physical visit." },
  { id: "ONB-003", name: "Gayatri Silks", businessType: "Company", category: "Decoration", contactPerson: "Meena Kumari", phone: "+91 73456 78901", email: "meena@gayatri.com", city: "Chennai", status: "Draft", submittedDate: "2026-02-08", gst: "33MNOPQ5678R9ZE", pan: "MNOPQ5678R", yearsInBusiness: 3, address: "88, Silk Bazaar, Chennai", state: "TN", materials: ["Silk Cloth", "Vastram"], structures: ["Main Temple", "Shrines"], deliverySchedule: "On Demand", bankName: "Axis", accountNumber: "555666777", ifsc: "UTIB0009012", upi: "meena@axis", docVerified: false, physicalVerified: false, approvedBy: "", notes: "" },
  { id: "ONB-004", name: "Kamala Agarbatti", businessType: "Proprietorship", category: "Pooja Materials", contactPerson: "Kamala Devi", phone: "+91 64567 89012", email: "kamala@agarbatti.com", city: "Mysore", status: "Approved", submittedDate: "2026-01-20", gst: "29RSTUV9012W3ZF", pan: "RSTUV9012W", yearsInBusiness: 18, address: "42, Incense Lane, Mysore", state: "KA", materials: ["Incense", "Camphor", "Kumkum"], structures: ["Main Temple", "Shrines", "Kitchen"], deliverySchedule: "Bi-weekly", bankName: "Canara", accountNumber: "111222333", ifsc: "CNRB0003456", upi: "", docVerified: true, physicalVerified: true, approvedBy: "Admin Rajan", notes: "All checks passed. Reliable vendor." },
  { id: "ONB-005", name: "Quick Fix Electricals", businessType: "Individual", category: "Electrical", contactPerson: "Mohan Das", phone: "+91 55678 90123", email: "mohan@quickfix.com", city: "Tirupati", status: "Rejected", submittedDate: "2026-01-15", gst: "", pan: "WXYZA6789B", yearsInBusiness: 1, address: "99, Service Rd, Tirupati", state: "AP", materials: ["Electrical Services"], structures: ["Main Temple"], deliverySchedule: "On Demand", bankName: "PNB", accountNumber: "444555666", ifsc: "PUNB0001234", upi: "mohan@pnb", docVerified: false, physicalVerified: false, approvedBy: "Admin Rajan", notes: "Insufficient experience. No valid certifications." },
];

const statusColor = (s: string) => {
  if (s === "Draft") return "text-slate-700 border-slate-300 bg-slate-50";
  if (s === "Submitted") return "text-blue-700 border-blue-300 bg-blue-50";
  if (s === "Under Review") return "text-amber-700 border-amber-300 bg-amber-50";
  if (s === "Approved") return "text-green-700 border-green-300 bg-green-50";
  if (s === "Rejected") return "text-red-700 border-red-300 bg-red-50";
  return "text-muted-foreground border-border bg-muted";
};

const Onboarding = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState<typeof onboardingRequests[0] | null>(null);
  const [showNew, setShowNew] = useState(false);

  const filtered = onboardingRequests.filter(o => {
    const matchSearch = o.name.toLowerCase().includes(search.toLowerCase()) || o.contactPerson.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Supplier Onboarding</h1>
            <p className="text-muted-foreground">Manage new supplier applications and direct onboarding</p>
          </div>
          <Button size="sm" onClick={() => setShowNew(true)}><Plus className="h-4 w-4 mr-2" />Direct Onboarding</Button>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search applications..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Submitted">Submitted</SelectItem>
                  <SelectItem value="Under Review">Under Review</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Supplier Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(o => (
                  <TableRow key={o.id}>
                    <TableCell className="font-mono text-xs">{o.id}</TableCell>
                    <TableCell className="font-medium text-sm">{o.name}</TableCell>
                    <TableCell className="text-sm">{o.category}</TableCell>
                    <TableCell>
                      <p className="text-sm">{o.contactPerson}</p>
                      <p className="text-xs text-muted-foreground">{o.phone}</p>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{o.submittedDate}</TableCell>
                    <TableCell><Badge variant="outline" className={`text-[10px] ${statusColor(o.status)}`}>{o.status}</Badge></TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => setSelected(o)}><Eye className="h-4 w-4" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>

      {/* Review Dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          {selected && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <DialogTitle>{selected.name} – Onboarding Review</DialogTitle>
                  <div className="flex gap-2">
                    {selected.status !== "Approved" && selected.status !== "Rejected" && (
                      <>
                        <Button size="sm" variant="destructive">Reject</Button>
                        <Button size="sm">Approve</Button>
                      </>
                    )}
                  </div>
                </div>
              </DialogHeader>
              <Tabs defaultValue="basic">
                <TabsList className="grid grid-cols-6 w-full">
                  <TabsTrigger value="basic">Basic</TabsTrigger>
                  <TabsTrigger value="business">Business</TabsTrigger>
                  <TabsTrigger value="materials">Materials</TabsTrigger>
                  <TabsTrigger value="financial">Financial</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                  <TabsTrigger value="verification">Verification</TabsTrigger>
                </TabsList>
                <TabsContent value="basic" className="mt-4 space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-muted/50 rounded-lg"><p className="text-xs text-muted-foreground">Supplier Name</p><p className="font-medium text-sm">{selected.name}</p></div>
                    <div className="p-3 bg-muted/50 rounded-lg"><p className="text-xs text-muted-foreground">Business Type</p><p className="font-medium text-sm">{selected.businessType}</p></div>
                    <div className="p-3 bg-muted/50 rounded-lg"><p className="text-xs text-muted-foreground">Category</p><p className="font-medium text-sm">{selected.category}</p></div>
                    <div className="p-3 bg-muted/50 rounded-lg"><p className="text-xs text-muted-foreground">Contact Person</p><p className="font-medium text-sm">{selected.contactPerson}</p></div>
                    <div className="p-3 bg-muted/50 rounded-lg"><p className="text-xs text-muted-foreground">Phone</p><p className="font-medium text-sm">{selected.phone}</p></div>
                    <div className="p-3 bg-muted/50 rounded-lg"><p className="text-xs text-muted-foreground">Email</p><p className="font-medium text-sm">{selected.email}</p></div>
                    <div className="p-3 bg-muted/50 rounded-lg col-span-2"><p className="text-xs text-muted-foreground">Address</p><p className="font-medium text-sm">{selected.address}, {selected.city}, {selected.state}</p></div>
                  </div>
                </TabsContent>
                <TabsContent value="business" className="mt-4 space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-muted/50 rounded-lg"><p className="text-xs text-muted-foreground">GST Number</p><p className="font-medium text-sm font-mono">{selected.gst || "N/A"}</p></div>
                    <div className="p-3 bg-muted/50 rounded-lg"><p className="text-xs text-muted-foreground">PAN Number</p><p className="font-medium text-sm font-mono">{selected.pan}</p></div>
                    <div className="p-3 bg-muted/50 rounded-lg"><p className="text-xs text-muted-foreground">Years in Business</p><p className="font-medium text-sm">{selected.yearsInBusiness} years</p></div>
                  </div>
                </TabsContent>
                <TabsContent value="materials" className="mt-4 space-y-3">
                  <div className="p-3 bg-muted/50 rounded-lg"><p className="text-xs text-muted-foreground mb-2">Materials / Services</p><div className="flex flex-wrap gap-2">{selected.materials.map((m, i) => <Badge key={i} variant="secondary" className="text-xs">{m}</Badge>)}</div></div>
                  <div className="p-3 bg-muted/50 rounded-lg"><p className="text-xs text-muted-foreground mb-2">Linked Structures</p><div className="flex flex-wrap gap-2">{selected.structures.map((s, i) => <Badge key={i} variant="outline" className="text-xs">{s}</Badge>)}</div></div>
                  <div className="p-3 bg-muted/50 rounded-lg"><p className="text-xs text-muted-foreground">Delivery Schedule</p><p className="font-medium text-sm">{selected.deliverySchedule}</p></div>
                </TabsContent>
                <TabsContent value="financial" className="mt-4 space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-muted/50 rounded-lg"><p className="text-xs text-muted-foreground">Bank Name</p><p className="font-medium text-sm">{selected.bankName}</p></div>
                    <div className="p-3 bg-muted/50 rounded-lg"><p className="text-xs text-muted-foreground">Account Number</p><p className="font-medium text-sm font-mono">{selected.accountNumber}</p></div>
                    <div className="p-3 bg-muted/50 rounded-lg"><p className="text-xs text-muted-foreground">IFSC</p><p className="font-medium text-sm font-mono">{selected.ifsc}</p></div>
                    <div className="p-3 bg-muted/50 rounded-lg"><p className="text-xs text-muted-foreground">UPI ID</p><p className="font-medium text-sm">{selected.upi || "N/A"}</p></div>
                  </div>
                </TabsContent>
                <TabsContent value="documents" className="mt-4">
                  <div className="text-center py-8 text-muted-foreground">
                    <p className="text-sm">Document upload area – GST Certificate, PAN Copy, Contracts</p>
                    <Button variant="outline" size="sm" className="mt-3">Upload Documents</Button>
                  </div>
                </TabsContent>
                <TabsContent value="verification" className="mt-4 space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-muted/50 rounded-lg flex items-center gap-3">
                      <Checkbox checked={selected.docVerified} disabled />
                      <div><p className="text-sm font-medium">Document Verified</p></div>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg flex items-center gap-3">
                      <Checkbox checked={selected.physicalVerified} disabled />
                      <div><p className="text-sm font-medium">Physical Verification</p></div>
                    </div>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg"><p className="text-xs text-muted-foreground">Approved By</p><p className="font-medium text-sm">{selected.approvedBy || "Pending"}</p></div>
                  <div className="p-3 bg-muted/50 rounded-lg"><p className="text-xs text-muted-foreground">Notes</p><p className="text-sm">{selected.notes || "No notes"}</p></div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Direct Onboarding Dialog */}
      <Dialog open={showNew} onOpenChange={setShowNew}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="flex items-center gap-2"><UserPlus className="h-5 w-5" />Direct Supplier Onboarding</DialogTitle></DialogHeader>
          <Tabs defaultValue="basic">
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="basic">Basic Details</TabsTrigger>
              <TabsTrigger value="business">Business</TabsTrigger>
              <TabsTrigger value="materials">Materials</TabsTrigger>
              <TabsTrigger value="financial">Financial</TabsTrigger>
            </TabsList>
            <TabsContent value="basic" className="mt-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div><Label className="text-xs">Supplier Name</Label><Input placeholder="Enter supplier name" /></div>
                <div><Label className="text-xs">Business Type</Label><Select><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger><SelectContent><SelectItem value="Individual">Individual</SelectItem><SelectItem value="Proprietorship">Proprietorship</SelectItem><SelectItem value="Company">Company</SelectItem></SelectContent></Select></div>
                <div><Label className="text-xs">Category</Label><Select><SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger><SelectContent><SelectItem value="Flowers">Flowers</SelectItem><SelectItem value="Grocery">Grocery</SelectItem><SelectItem value="Pooja Materials">Pooja Materials</SelectItem><SelectItem value="Oil & Ghee">Oil & Ghee</SelectItem><SelectItem value="Decoration">Decoration</SelectItem><SelectItem value="Electrical">Electrical</SelectItem><SelectItem value="Printing">Printing</SelectItem><SelectItem value="Milk & Dairy">Milk & Dairy</SelectItem></SelectContent></Select></div>
                <div><Label className="text-xs">Contact Person</Label><Input placeholder="Contact name" /></div>
                <div><Label className="text-xs">Mobile Number</Label><Input placeholder="+91" /></div>
                <div><Label className="text-xs">Email</Label><Input placeholder="email@example.com" /></div>
                <div className="col-span-2"><Label className="text-xs">Address</Label><Textarea placeholder="Full address" rows={2} /></div>
                <div><Label className="text-xs">City</Label><Input placeholder="City" /></div>
                <div><Label className="text-xs">State</Label><Input placeholder="State" /></div>
              </div>
            </TabsContent>
            <TabsContent value="business" className="mt-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div><Label className="text-xs">GST Number</Label><Input placeholder="Optional" /></div>
                <div><Label className="text-xs">PAN Number</Label><Input placeholder="Optional" /></div>
                <div><Label className="text-xs">Years in Business</Label><Input type="number" placeholder="0" /></div>
                <div><Label className="text-xs">Service Area</Label><Input placeholder="e.g. Tirupati, Tirumala" /></div>
              </div>
            </TabsContent>
            <TabsContent value="materials" className="mt-4 space-y-3">
              <div><Label className="text-xs">Specific Materials</Label><Textarea placeholder="List materials or services offered" rows={3} /></div>
              <div><Label className="text-xs">Preferred Delivery Schedule</Label><Select><SelectTrigger><SelectValue placeholder="Select schedule" /></SelectTrigger><SelectContent><SelectItem value="Daily">Daily</SelectItem><SelectItem value="Weekly">Weekly</SelectItem><SelectItem value="Bi-weekly">Bi-weekly</SelectItem><SelectItem value="Monthly">Monthly</SelectItem><SelectItem value="On Demand">On Demand</SelectItem></SelectContent></Select></div>
            </TabsContent>
            <TabsContent value="financial" className="mt-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div><Label className="text-xs">Bank Account Name</Label><Input placeholder="Account holder name" /></div>
                <div><Label className="text-xs">Bank Name</Label><Input placeholder="Bank name" /></div>
                <div><Label className="text-xs">Account Number</Label><Input placeholder="Account number" /></div>
                <div><Label className="text-xs">IFSC Code</Label><Input placeholder="IFSC code" /></div>
                <div><Label className="text-xs">UPI ID</Label><Input placeholder="Optional" /></div>
              </div>
            </TabsContent>
          </Tabs>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowNew(false)}>Cancel</Button>
            <Button onClick={() => setShowNew(false)}>Submit & Onboard</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Onboarding;
