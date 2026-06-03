import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search, Building2, Users, Heart, IndianRupee } from "lucide-react";
import { institutions } from "@/data/institutionData";
import { branches } from "@/data/branchData";
import CustomFieldsSection, { CustomField } from "@/components/CustomFieldsSection";
import { toast } from "@/hooks/use-toast";

const AllInstitutions = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showCreate, setShowCreate] = useState(false);
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [perPage, setPerPage] = useState(10);

  const filtered = institutions.filter(inst => {
    const matchSearch = inst.name.toLowerCase().includes(search.toLowerCase()) || inst.city.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "all" || inst.type === typeFilter;
    const matchStatus = statusFilter === "all" || inst.status === statusFilter;
    return matchSearch && matchType && matchStatus;
  });

  const types = [...new Set(institutions.map(i => i.type))];
  const totalDonations = institutions.reduce((s, i) => s + i.monthlyDonations, 0);
  const totalVolunteers = institutions.reduce((s, i) => s + i.volunteerCount, 0);

  const statusColor = (s: string) => {
    if (s === "Active") return "text-green-700 border-green-300 bg-green-50";
    if (s === "Inactive") return "text-red-700 border-red-300 bg-red-50";
    return "text-amber-700 border-amber-300 bg-amber-50";
  };

  const typeColor = (t: string) => {
    const map: Record<string, string> = {
      "School": "bg-blue-50 text-blue-700 border-blue-200",
      "College": "bg-indigo-50 text-indigo-700 border-indigo-200",
      "Hospital": "bg-red-50 text-red-700 border-red-200",
      "Goshala": "bg-green-50 text-green-700 border-green-200",
      "Cultural Center": "bg-purple-50 text-purple-700 border-purple-200",
      "NGO": "bg-teal-50 text-teal-700 border-teal-200",
      "Veda Pathashala": "bg-amber-50 text-amber-700 border-amber-200",
      "Annadanam Foundation": "bg-orange-50 text-orange-700 border-orange-200",
    };
    return map[t] || "";
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">All Institutions</h1>
          <p className="text-muted-foreground text-sm">Manage educational, charitable & social institutions under the Trust</p>
        </div>
        <Button onClick={() => setShowCreate(true)} className="gap-2">
          <Plus className="h-4 w-4" /> Add Institution
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card><CardContent className="p-4"><Building2 className="h-5 w-5 text-primary mb-2" /><p className="text-2xl font-bold">{institutions.length}</p><p className="text-[11px] text-muted-foreground">Total Institutions</p></CardContent></Card>
        <Card><CardContent className="p-4"><Users className="h-5 w-5 text-blue-600 mb-2" /><p className="text-2xl font-bold">{totalVolunteers}</p><p className="text-[11px] text-muted-foreground">Total Volunteers</p></CardContent></Card>
        <Card><CardContent className="p-4"><Heart className="h-5 w-5 text-red-500 mb-2" /><p className="text-2xl font-bold">₹{(totalDonations / 100000).toFixed(1)}L</p><p className="text-[11px] text-muted-foreground">Monthly Donations</p></CardContent></Card>
        <Card><CardContent className="p-4"><IndianRupee className="h-5 w-5 text-green-600 mb-2" /><p className="text-2xl font-bold">{types.length}</p><p className="text-[11px] text-muted-foreground">Institution Types</p></CardContent></Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search institutions..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-9" />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[180px] h-9"><SelectValue placeholder="Type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {types.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px] h-9"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Inactive">Inactive</SelectItem>
            <SelectItem value="Under Setup">Under Setup</SelectItem>
          </SelectContent>
        </Select>
        <Select value={perPage.toString()} onValueChange={v => setPerPage(Number(v))}>
          <SelectTrigger className="w-[100px] h-9"><SelectValue /></SelectTrigger>
          <SelectContent>
            {[10, 25, 50, 100].map(n => <SelectItem key={n} value={n.toString()}>{n} / page</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Institution Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Linked Branch</TableHead>
                <TableHead>Head</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.slice(0, perPage).map(inst => (
                <TableRow key={inst.id} className="cursor-pointer" onClick={() => navigate(`/temple/institutions/${inst.id}`)}>
                  <TableCell>
                    <p className="font-medium text-sm">{inst.name}</p>
                    <p className="text-xs text-muted-foreground">{inst.id}</p>
                  </TableCell>
                  <TableCell><Badge variant="outline" className={`text-xs ${typeColor(inst.type)}`}>{inst.type}</Badge></TableCell>
                  <TableCell className="text-sm">{inst.city}, {inst.state}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{inst.linkedBranch || "—"}</TableCell>
                  <TableCell className="text-sm">{inst.institutionHead}</TableCell>
                  <TableCell><Badge variant="outline" className={`text-xs ${statusColor(inst.status)}`}>{inst.status}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <p className="text-xs text-muted-foreground">Showing {Math.min(perPage, filtered.length)} of {filtered.length} institutions</p>

      {/* Add Institution Popup */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Add New Institution</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Institution Name</Label><Input placeholder="Enter institution name" /></div>
            <div>
              <Label>Institution Type</Label>
              <Select>
                <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>
                  {["School", "College", "Hospital", "Goshala", "Cultural Center", "NGO", "Veda Pathashala", "Annadanam Foundation"].map(t => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Linked Temple Branch (Optional)</Label>
              <Select>
                <SelectTrigger><SelectValue placeholder="Select branch" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {branches.map(b => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div><Label>Address</Label><Textarea placeholder="Full address" rows={2} /></div>
            <div className="grid grid-cols-3 gap-4">
              <div><Label>City</Label><Input placeholder="City" /></div>
              <div><Label>State</Label><Input placeholder="State" /></div>
              <div><Label>Country</Label><Input defaultValue="India" /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Contact Number</Label><Input placeholder="+91..." /></div>
              <div><Label>Email</Label><Input placeholder="email@temple.org" /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Institution Head</Label><Input placeholder="Name" /></div>
              <div><Label>Registration Number</Label><Input placeholder="Reg. number" /></div>
            </div>
            <div>
              <Label>Status</Label>
              <Select defaultValue="Active">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                  <SelectItem value="Under Setup">Under Setup</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <CustomFieldsSection fields={customFields} onFieldsChange={setCustomFields} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button onClick={() => { setShowCreate(false); toast({ title: "Institution Created", description: "New institution has been added successfully." }); }}>
              Save Institution
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default AllInstitutions;
