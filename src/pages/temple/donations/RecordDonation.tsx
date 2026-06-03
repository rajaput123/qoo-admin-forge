import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus, IndianRupee, Banknote, Smartphone, Building2, Gift, Calendar, FileDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useDonations, useDonors } from "@/modules/donations/hooks";
import { recordDonation } from "@/modules/donations/donationsStore";
import { downloadReceipt } from "@/lib/receiptGenerator";

const formatCurrency = (val: number) => {
  if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)} Cr`;
  if (val >= 100000) return `₹${(val / 100000).toFixed(1)} L`;
  return `₹${val.toLocaleString()}`;
};

const channelIcons: Record<string, typeof IndianRupee> = {
  "Cash": Banknote,
  "UPI": Smartphone,
  "Bank Transfer": Building2,
  "Online": Smartphone,
  "In-Kind": Gift,
};

const RecordDonation = () => {
  const donations = useDonations();
  const donors = useDonors();
  const [showRecord, setShowRecord] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedRecord, setSelectedRecord] = useState<(typeof donations)[number] | null>(null);
  const { toast } = useToast();
  const [form, setForm] = useState({
    donorName: "",
    phone: "",
    amount: "",
    channel: "" as "" | "Cash" | "UPI" | "Bank Transfer" | "Online" | "Cheque" | "In-Kind",
    purpose: "",
    mode: "",
    referenceNo: "",
    remarks: "",
    sourceModule: "Manual" as "" | "Manual" | "Booking" | "Event" | "Online Portal" | "Campaign" | "Seva" | "Counter",
    sourceRecordId: "",
    counterId: "",
  });

  const filtered = donations.filter(r =>
    r.donorName.toLowerCase().includes(search.toLowerCase()) || r.donationId.toLowerCase().includes(search.toLowerCase()) || r.receiptNo.toLowerCase().includes(search.toLowerCase())
  );

  const handleRecord = () => {
    if (!form.donorName.trim()) return;
    const amt = Number(form.amount);
    if (!Number.isFinite(amt) || amt <= 0) return;
    if (!form.channel) return;
    if (!form.purpose) return;
    if (!form.mode.trim()) return;

    const d = recordDonation({
      donorName: form.donorName.trim(),
      phone: form.phone.trim() || undefined,
      amount: amt,
      purpose: form.purpose,
      channel: form.channel,
      mode: form.mode.trim(),
      referenceNo: form.referenceNo.trim() || undefined,
      remarks: form.remarks.trim() || undefined,
      sourceModule: (form.sourceModule as any) || "Manual",
      sourceRecordId: form.sourceRecordId.trim() || undefined,
      counterId: form.counterId.trim() || undefined,
      createdBy: "System",
    });
    toast({ title: "Donation Recorded", description: `Receipt ${d.receiptNo} generated automatically.` });
    setShowRecord(false);
    setForm({ donorName: "", phone: "", amount: "", channel: "", purpose: "", mode: "", referenceNo: "", remarks: "", sourceModule: "Manual", sourceRecordId: "", counterId: "" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Record Donation</h1>
          <p className="text-sm text-muted-foreground mt-1">Receive and record donations from all channels with auto-receipt generation</p>
        </div>
        <Button size="sm" onClick={() => setShowRecord(true)}>
          <Plus className="h-4 w-4 mr-1" /> New Donation
        </Button>
      </div>

      {/* Channel Quick Stats */}
      <div className="grid grid-cols-5 gap-3">
        {[
          { label: "Cash / Counter", count: "12 today", icon: Banknote },
          { label: "UPI / Online", count: "8 today", icon: Smartphone },
          { label: "Bank Transfer", count: "3 today", icon: Building2 },
          { label: "In-Kind", count: "1 today", icon: Gift },
          { label: "Event-linked", count: "5 today", icon: Calendar },
        ].map(c => (
          <Card key={c.label}>
            <CardContent className="p-3 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-muted"><c.icon className="h-4 w-4 text-primary" /></div>
              <div>
                <p className="text-sm font-medium">{c.count}</p>
                <p className="text-[10px] text-muted-foreground">{c.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Records Table */}
      <Card>
        <CardContent className="p-4">
          <div className="relative max-w-md mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search donations..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Donation ID</TableHead>
                <TableHead>Donor</TableHead>
                <TableHead>Purpose</TableHead>
                <TableHead>Channel</TableHead>
                <TableHead>Mode</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Receipt</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(r => (
                <TableRow key={r.donationId} className="cursor-pointer hover:bg-muted/50" onClick={() => setSelectedRecord(r)}>
                  <TableCell className="font-mono text-xs">{r.donationId}</TableCell>
                  <TableCell className="font-medium text-sm">{r.donorName}</TableCell>
                  <TableCell className="text-sm">{r.purpose}</TableCell>
                  <TableCell><Badge variant="outline" className="text-xs">{r.channel}</Badge></TableCell>
                  <TableCell className="text-xs">{r.mode}</TableCell>
                  <TableCell className="text-right font-mono font-medium">{formatCurrency(r.amount)}</TableCell>
                  <TableCell className="text-xs">{r.date}</TableCell>
                  <TableCell className="font-mono text-xs">
                    {r.receiptNo ? (
                      <Button
                        variant="link"
                        size="sm"
                        className="h-auto p-0 font-mono text-xs text-primary hover:underline"
                        onClick={() => {
                          const donor = donors.find(d => d.donorId === r.donorId);
                          try {
                            downloadReceipt(r, donor || null, r.is80G || false);
                            toast({ title: "Success", description: "Receipt download initiated" });
                          } catch (error: any) {
                            toast({ title: "Error", description: error.message || "Failed to download receipt", variant: "destructive" });
                          }
                        }}
                      >
                        <FileDown className="h-3 w-3 mr-1" />
                        {r.receiptNo}
                      </Button>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Record Detail Modal */}
      <Dialog open={!!selectedRecord} onOpenChange={() => setSelectedRecord(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Donation Details</DialogTitle></DialogHeader>
          {selectedRecord && (
            <Tabs defaultValue="details">
              <TabsList className="w-full">
                <TabsTrigger value="details" className="flex-1">Details</TabsTrigger>
                <TabsTrigger value="receipt" className="flex-1">Receipt</TabsTrigger>
                <TabsTrigger value="allocation" className="flex-1">Allocation</TabsTrigger>
              </TabsList>
               <TabsContent value="details" className="mt-4 space-y-3">
                 <div className="grid grid-cols-2 gap-3">
                   {[
                     ["Donation ID", selectedRecord.donationId],
                     ["Donor", selectedRecord.donorName],
                     ["Amount", formatCurrency(selectedRecord.amount)],
                     ["Purpose", selectedRecord.purpose],
                     ["Channel", selectedRecord.channel],
                     ["Mode", selectedRecord.mode],
                     ["Date", selectedRecord.date],
                     ["Time", selectedRecord.time],
                     ["Source Module", selectedRecord.sourceModule || "Manual"],
                     ["Source Record", selectedRecord.sourceRecordId || "—"],
                     ["Counter", selectedRecord.counterId || "—"],
                     ["Temple ID", selectedRecord.templeId],
                     ["Branch", selectedRecord.branchId || "—"],
                   ].map(([label, value]) => (
                     <div key={label} className="p-2 rounded bg-muted/50">
                       <p className="text-[10px] text-muted-foreground">{label}</p>
                       <p className="text-sm font-medium">{value}</p>
                     </div>
                   ))}
                 </div>
              </TabsContent>
              <TabsContent value="receipt" className="mt-4">
                <div className="p-4 rounded-lg border bg-muted/30 text-center">
                  <p className="font-mono text-lg font-bold">{selectedRecord.receiptNo}</p>
                  <p className="text-sm text-muted-foreground mt-1">Auto-generated on {selectedRecord.date}</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-3"
                    onClick={() => {
                      const donor = donors.find(d => d.donorId === selectedRecord.donorId);
                      try {
                        downloadReceipt(selectedRecord, donor || null, selectedRecord.is80G || false);
                        toast({ title: "Success", description: "Receipt download initiated" });
                      } catch (error: any) {
                        toast({ title: "Error", description: error.message || "Failed to download receipt", variant: "destructive" });
                      }
                    }}
                  >
                    <FileDown className="h-4 w-4 mr-2" />
                    Download Receipt PDF
                  </Button>
                </div>
              </TabsContent>
              <TabsContent value="allocation" className="mt-4">
                <div className="p-4 rounded-lg border bg-muted/30">
                  <p className="text-sm"><span className="font-medium">Purpose:</span> {selectedRecord.purpose}</p>
                  <p className="text-sm mt-2"><span className="font-medium">Allocation Status:</span> <Badge variant="default" className="text-xs ml-1">Recorded</Badge></p>
                  <p className="text-xs text-muted-foreground mt-3">Funds will be allocated via Fund Allocation page.</p>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      {/* New Donation Form */}
      <Dialog open={showRecord} onOpenChange={setShowRecord}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Record New Donation</DialogTitle></DialogHeader>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Donor Name</Label><Input placeholder="Donor name or Anonymous" value={form.donorName} onChange={e => setForm(p => ({ ...p, donorName: e.target.value }))} /></div>
              <div><Label>Phone (optional)</Label><Input placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Amount (₹)</Label><Input type="number" placeholder="e.g. 50000" value={form.amount} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))} /></div>
              <div><Label>Channel</Label>
                <Select value={form.channel} onValueChange={(v) => setForm(p => ({ ...p, channel: v as any }))}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cash">Cash / Counter</SelectItem>
                    <SelectItem value="UPI">UPI</SelectItem>
                    <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                    <SelectItem value="Online">Online Payment</SelectItem>
                    <SelectItem value="Cheque">Cheque / DD</SelectItem>
                    <SelectItem value="In-Kind">In-Kind</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div><Label>Purpose</Label>
              <Select value={form.purpose} onValueChange={(v) => setForm(p => ({ ...p, purpose: v }))}>
                <SelectTrigger><SelectValue placeholder="Select purpose" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="General / Hundi">General / Hundi</SelectItem>
                  <SelectItem value="Annadanam Sponsorship">Annadanam Sponsorship</SelectItem>
                  <SelectItem value="Prasadam Sponsorship">Prasadam Sponsorship</SelectItem>
                  <SelectItem value="Seva Sponsorship">Seva Sponsorship</SelectItem>
                  <SelectItem value="Project-linked">Project-linked</SelectItem>
                  <SelectItem value="Event-linked">Event-linked</SelectItem>
                  <SelectItem value="Corpus Fund">Corpus Fund</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Payment Mode</Label><Input placeholder="e.g. GPay, NEFT, Cash" value={form.mode} onChange={e => setForm(p => ({ ...p, mode: e.target.value }))} /></div>
              <div><Label>Reference No.</Label><Input placeholder="Transaction ref (optional)" value={form.referenceNo} onChange={e => setForm(p => ({ ...p, referenceNo: e.target.value }))} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Source Module</Label>
                <Select value={form.sourceModule} onValueChange={(v) => setForm(p => ({ ...p, sourceModule: v as any }))}>
                  <SelectTrigger><SelectValue placeholder="Source" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Manual">Manual Entry</SelectItem>
                    <SelectItem value="Booking">Booking</SelectItem>
                    <SelectItem value="Event">Event</SelectItem>
                    <SelectItem value="Online Portal">Online Portal</SelectItem>
                    <SelectItem value="Campaign">Campaign</SelectItem>
                    <SelectItem value="Seva">Seva</SelectItem>
                    <SelectItem value="Counter">Counter</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Source Record ID</Label><Input placeholder="e.g. BKG-001, EVT-005" value={form.sourceRecordId} onChange={e => setForm(p => ({ ...p, sourceRecordId: e.target.value }))} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Counter ID (optional)</Label><Input placeholder="e.g. CTR-001" value={form.counterId} onChange={e => setForm(p => ({ ...p, counterId: e.target.value }))} /></div>
            </div>
            <div><Label>Remarks</Label><Textarea placeholder="Any special instructions or donor intent..." rows={2} value={form.remarks} onChange={e => setForm(p => ({ ...p, remarks: e.target.value }))} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRecord(false)}>Cancel</Button>
            <Button onClick={handleRecord}>Record & Generate Receipt</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RecordDonation;
