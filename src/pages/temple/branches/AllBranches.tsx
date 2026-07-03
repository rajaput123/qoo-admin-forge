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
import { Plus, Search, GitBranch, MapPin, Building2, IndianRupee } from "lucide-react";
import { branches } from "@/data/branchData";
import CustomFieldsSection, { CustomField } from "@/components/CustomFieldsSection";
import { toast } from "@/hooks/use-toast";
import BranchDetails from "./BranchDetails";

const AllBranches = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [stateFilter, setStateFilter] = useState("all");
  const [showCreate, setShowCreate] = useState(false);
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [perPage, setPerPage] = useState(10);
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);

  const filtered = branches.filter(b => {
    const matchSearch = b.name.toLowerCase().includes(search.toLowerCase()) || b.city.toLowerCase().includes(search.toLowerCase()) || b.code.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || b.status === statusFilter;
    const matchState = stateFilter === "all" || b.state === stateFilter;
    return matchSearch && matchStatus && matchState;
  });

  const states = [...new Set(branches.map(b => b.state))];

  const totalStockValue = branches.reduce((s, b) => s + b.totalStockValue, 0);
  const totalEvents = branches.reduce((s, b) => s + b.activeEvents, 0);
  const totalVolunteers = branches.reduce((s, b) => s + b.volunteerCount, 0);

  const statusColor = (s: string) => {
    if (s === "Active") return "text-green-700 border-green-300 bg-green-50";
    if (s === "Inactive") return "text-red-700 border-red-300 bg-red-50";
    return "text-amber-700 border-amber-300 bg-amber-50";
  };

  if (selectedBranchId) {
    return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
        <BranchDetails branchId={selectedBranchId} onBack={() => setSelectedBranchId(null)} />
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">All Branches</h1>
          <p className="text-muted-foreground text-sm">Manage temple branches across locations</p>
        </div>
        <Button onClick={() => setShowCreate(true)} className="gap-2">
          <Plus className="h-4 w-4" /> Add Branch
        </Button>
      </div>

      {/* Trust-level KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <GitBranch className="h-5 w-5 text-primary mb-2" />
            <p className="text-2xl font-bold">{branches.length}</p>
            <p className="text-[11px] text-muted-foreground">Total Branches</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <Building2 className="h-5 w-5 text-blue-600 mb-2" />
            <p className="text-2xl font-bold">{totalEvents}</p>
            <p className="text-[11px] text-muted-foreground">Active Events</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <IndianRupee className="h-5 w-5 text-green-600 mb-2" />
            <p className="text-2xl font-bold">₹{(totalStockValue / 100000).toFixed(1)}L</p>
            <p className="text-[11px] text-muted-foreground">Total Stock Value</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <MapPin className="h-5 w-5 text-amber-600 mb-2" />
            <p className="text-2xl font-bold">{totalVolunteers}</p>
            <p className="text-[11px] text-muted-foreground">Total Volunteers</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search branches..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-9" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px] h-9"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Inactive">Inactive</SelectItem>
            <SelectItem value="Under Setup">Under Setup</SelectItem>
          </SelectContent>
        </Select>
        <Select value={stateFilter} onValueChange={setStateFilter}>
          <SelectTrigger className="w-[160px] h-9"><SelectValue placeholder="State" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All States</SelectItem>
            {states.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
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
                <TableHead>Branch Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Main Structure</TableHead>
                <TableHead className="text-center">Active Events</TableHead>
                <TableHead className="text-right">Stock Value</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.slice(0, perPage).map(branch => (
                <TableRow key={branch.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setSelectedBranchId(branch.id)}>
                  <TableCell>
                    <p className="font-medium text-sm">{branch.name}</p>
                    <p className="text-xs text-muted-foreground">{branch.code}</p>
                  </TableCell>
                  <TableCell className="text-sm">{branch.city}, {branch.state}</TableCell>
                  <TableCell className="text-sm">{branch.mainStructure}</TableCell>
                  <TableCell className="text-center text-sm font-medium">{branch.activeEvents}</TableCell>
                  <TableCell className="text-right text-sm font-medium">₹{branch.totalStockValue.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-xs ${statusColor(branch.status)}`}>{branch.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <p className="text-xs text-muted-foreground">Showing {Math.min(perPage, filtered.length)} of {filtered.length} branches</p>

      {/* Add Branch Popup */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Add New Branch</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Branch Name</Label><Input placeholder="Enter branch name" /></div>
              <div><Label>Branch Code</Label><Input placeholder="e.g. SVT-MAIN" /></div>
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
              <div><Label>Branch Head</Label><Input placeholder="Name" /></div>
              <div><Label>GST Number</Label><Input placeholder="Optional" /></div>
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
            <Button onClick={() => { setShowCreate(false); toast({ title: "Branch Created", description: "New branch has been added successfully." }); }}>
              Save Branch
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default AllBranches;
