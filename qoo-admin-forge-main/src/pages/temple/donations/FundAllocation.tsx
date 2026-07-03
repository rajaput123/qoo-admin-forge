import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Wallet, Link2, IndianRupee, CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAllocations, useDonations } from "@/modules/donations/hooks";
import { allocateFund } from "@/modules/donations/donationsStore";

const formatCurrency = (val: number) => {
  if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)} Cr`;
  if (val >= 100000) return `₹${(val / 100000).toFixed(1)} L`;
  return `₹${val.toLocaleString()}`;
};

const typeColors: Record<string, string> = {
  Project: "default",
  Kitchen: "secondary",
  Prasadam: "outline",
  Seva: "default",
  Event: "secondary",
};

const FundAllocation = () => {
  const donations = useDonations();
  const allocations = useAllocations();
  const [search, setSearch] = useState("");
  const [showAllocate, setShowAllocate] = useState(false);
  const [selectedAllocation, setSelectedAllocation] = useState<{
    donationId: string;
    donorName: string;
    amount: number;
    purpose: string;
    linkedTo: string;
    linkedType: any;
    allocated: number;
    utilized: number;
  } | null>(null);
  const { toast } = useToast();
  const [allocForm, setAllocForm] = useState({
    donationId: "",
    linkedType: "" as any,
    linkedTo: "",
    allocated: "",
  });

  const viewRows = allocations
    .map(a => {
      const d = donations.find(x => x.donationId === a.donationId);
      return {
        donationId: a.donationId,
        donorName: d?.donorName ?? "—",
        amount: d?.amount ?? 0,
        purpose: a.purpose,
        linkedTo: a.linkedTo,
        linkedType: a.linkedType,
        allocated: a.allocated,
        utilized: a.utilized,
        status: a.allocated <= 0 ? "Unallocated" : a.utilized >= a.allocated ? "Fully Utilized" : "In Use",
      };
    })
    .concat(
      donations
        .filter(d => !allocations.some(a => a.donationId === d.donationId))
        .map(d => ({
          donationId: d.donationId,
          donorName: d.donorName,
          amount: d.amount,
          purpose: d.purpose,
          linkedTo: "—",
          linkedType: "General",
          allocated: 0,
          utilized: 0,
          status: "Unallocated",
        }))
    );

  const filtered = viewRows.filter(a =>
    a.donorName.toLowerCase().includes(search.toLowerCase()) ||
    a.donationId.toLowerCase().includes(search.toLowerCase()) ||
    a.linkedTo.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Fund Allocation</h1>
          <p className="text-sm text-muted-foreground mt-1">Tag donations to purposes and link to Projects, Sevas, Events, Kitchen, or Prasadam</p>
        </div>
        <Button size="sm" onClick={() => setShowAllocate(true)}>
          <Link2 className="h-4 w-4 mr-1" /> Allocate Fund
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-foreground">₹18.65 L</p><p className="text-xs text-muted-foreground">Total Allocated</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-green-600">₹8.05 L</p><p className="text-xs text-muted-foreground">Utilized</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-amber-600">₹2 L</p><p className="text-xs text-muted-foreground">Unallocated</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-primary">5</p><p className="text-xs text-muted-foreground">Linked Modules</p></CardContent></Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="relative max-w-md mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by donor, ID, or linked entity..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Donation ID</TableHead>
                <TableHead>Donor</TableHead>
                <TableHead>Purpose</TableHead>
                <TableHead>Linked To</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Allocated</TableHead>
                <TableHead>Utilization</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(a => {
                const pct = a.allocated > 0 ? Math.round((a.utilized / a.allocated) * 100) : 0;
                return (
                  <TableRow key={a.donationId} className="cursor-pointer hover:bg-muted/50" onClick={() => setSelectedAllocation(a)}>
                    <TableCell className="font-mono text-xs">{a.donationId}</TableCell>
                    <TableCell className="font-medium text-sm">{a.donorName}</TableCell>
                    <TableCell className="text-sm">{a.purpose}</TableCell>
                    <TableCell className="text-sm">{a.linkedTo}</TableCell>
                    <TableCell><Badge variant={typeColors[a.linkedType] as any || "outline"} className="text-[10px]">{a.linkedType}</Badge></TableCell>
                    <TableCell className="text-right font-mono text-sm">{formatCurrency(a.allocated)}</TableCell>
                    <TableCell>
                      <div className="w-20">
                        <div className="text-xs mb-1">{pct}%</div>
                        <Progress value={pct} className="h-1.5" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={a.status === "Fully Utilized" ? "default" : a.status === "Unallocated" ? "destructive" : "secondary"} className="text-[10px]">{a.status}</Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Allocation Detail */}
      <Dialog open={!!selectedAllocation} onOpenChange={() => setSelectedAllocation(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Allocation Details</DialogTitle></DialogHeader>
          {selectedAllocation && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {[
                  ["Donation ID", selectedAllocation.donationId],
                  ["Donor", selectedAllocation.donorName],
                  ["Purpose", selectedAllocation.purpose],
                  ["Linked To", selectedAllocation.linkedTo],
                  ["Linked Type", selectedAllocation.linkedType],
                  ["Donation Amount", formatCurrency(selectedAllocation.amount)],
                  ["Allocated", formatCurrency(selectedAllocation.allocated)],
                  ["Utilized", formatCurrency(selectedAllocation.utilized)],
                ].map(([l, v]) => (
                  <div key={l} className="p-2 rounded bg-muted/50">
                    <p className="text-[10px] text-muted-foreground">{l}</p>
                    <p className="text-sm font-medium">{v}</p>
                  </div>
                ))}
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Utilization</span>
                  <span className="font-medium">{selectedAllocation.allocated > 0 ? Math.round((selectedAllocation.utilized / selectedAllocation.allocated) * 100) : 0}%</span>
                </div>
                <Progress value={selectedAllocation.allocated > 0 ? Math.round((selectedAllocation.utilized / selectedAllocation.allocated) * 100) : 0} className="h-2" />
              </div>
              {selectedAllocation.utilized > selectedAllocation.allocated && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                  <AlertTriangle className="h-4 w-4" /> Utilization exceeds allocation!
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Allocate Fund Dialog */}
      <Dialog open={showAllocate} onOpenChange={setShowAllocate}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Allocate Fund</DialogTitle></DialogHeader>
          <div className="grid gap-4">
            <div>
              <Label>Donation</Label>
              <Select value={allocForm.donationId} onValueChange={(v) => setAllocForm(p => ({ ...p, donationId: v }))}>
                <SelectTrigger><SelectValue placeholder="Select donation" /></SelectTrigger>
                <SelectContent>
                  {donations.map(d => (
                    <SelectItem key={d.donationId} value={d.donationId}>
                      {d.donationId} • {d.donorName} • ₹{d.amount.toLocaleString()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div><Label>Link To Module</Label>
              <Select value={allocForm.linkedType} onValueChange={(v) => setAllocForm(p => ({ ...p, linkedType: v }))}>
                <SelectTrigger><SelectValue placeholder="Select module" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Project">Project</SelectItem>
                  <SelectItem value="Seva">Seva / Ritual</SelectItem>
                  <SelectItem value="Event">Event</SelectItem>
                  <SelectItem value="Kitchen">Kitchen / Annadanam</SelectItem>
                  <SelectItem value="Prasadam">Prasadam</SelectItem>
                  <SelectItem value="General">General</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label>Entity Name</Label><Input placeholder="e.g. Gopuram Renovation, Brahmotsavam 2025" value={allocForm.linkedTo} onChange={e => setAllocForm(p => ({ ...p, linkedTo: e.target.value }))} /></div>
            <div><Label>Allocation Amount (₹)</Label><Input type="number" placeholder="Amount to allocate" value={allocForm.allocated} onChange={e => setAllocForm(p => ({ ...p, allocated: e.target.value }))} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAllocate(false)}>Cancel</Button>
            <Button
              onClick={() => {
                const amt = Number(allocForm.allocated);
                if (!allocForm.donationId || !allocForm.linkedType || !allocForm.linkedTo.trim() || !Number.isFinite(amt) || amt <= 0) return;
                const d = donations.find(x => x.donationId === allocForm.donationId);
                allocateFund({
                  donationId: allocForm.donationId,
                  purpose: d?.purpose ?? "General",
                  linkedType: allocForm.linkedType,
                  linkedTo: allocForm.linkedTo.trim(),
                  allocated: amt,
                  createdBy: "System",
                });
                toast({ title: "Fund Allocated", description: "Donation linked to module successfully." });
                setShowAllocate(false);
                setAllocForm({ donationId: "", linkedType: "" as any, linkedTo: "", allocated: "" });
              }}
            >
              Allocate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FundAllocation;
