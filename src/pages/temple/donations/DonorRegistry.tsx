import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, FileDown, Phone, Mail, MapPin, Heart, Crown, AlertTriangle } from "lucide-react";
import { useDonations, useDonors } from "@/modules/donations/hooks";
import { markDonorAsVip, updateDonorVip } from "@/modules/donations/donationsStore";
import { useToast } from "@/hooks/use-toast";
import { downloadReceipt } from "@/lib/receiptGenerator";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import SelectWithAddNew from "@/components/SelectWithAddNew";

const formatCurrency = (val: number | undefined | null): string => {
  try {
    if (val == null || typeof val !== 'number' || !Number.isFinite(val)) {
      return "₹0";
    }
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)} L`;
    return `₹${val.toLocaleString()}`;
  } catch {
    return "₹0";
  }
};

const donorTypeColor = (cat: string) => {
  switch (cat) {
    case "Patron": return "default";
    case "Trust": return "secondary";
    case "Organization": return "secondary";
    case "Anonymous": return "outline";
    default: return "outline" as const;
  }
};

const DonorRegistry = () => {
  // Hooks must be called unconditionally - can't wrap in try-catch
  const donors = useDonors();
  const donations = useDonations();
  const { toast } = useToast();

  // Ensure we have valid arrays with additional null/undefined checks
  const safeDonors = useMemo(() => {
    try {
      return (Array.isArray(donors) ? donors : []).filter(d => d != null);
    } catch (error) {
      console.error('Error processing donors:', error);
      return [];
    }
  }, [donors]);
  
  const safeDonations = useMemo(() => {
    try {
      return (Array.isArray(donations) ? donations : []).filter(d => d != null);
    } catch (error) {
      console.error('Error processing donations:', error);
      return [];
    }
  }, [donations]);
  const [search, setSearch] = useState("");
  const [selectedDonor, setSelectedDonor] = useState<(typeof safeDonors)[number] | null>(null);
  const [showVipDialog, setShowVipDialog] = useState(false);
  
  // VIP form state - same as Devotee Management
  const [vipCategory, setVipCategory] = useState("");
  const [vipLevel, setVipLevel] = useState("");
  const [vipValidFrom, setVipValidFrom] = useState("");
  const [vipValidTill, setVipValidTill] = useState("");
  const [vipApprovalAuthority, setVipApprovalAuthority] = useState("");
  const [vipSensitive, setVipSensitive] = useState(false);
  const [vipNotes, setVipNotes] = useState("");
  const [vipCategoryOptions, setVipCategoryOptions] = useState([
    "High Donor",
    "Volunteer Donor",
    "Festival Patron",
    "Trustee Family",
  ]);
  const [vipLevelOptions, setVipLevelOptions] = useState([
    "Platinum",
    "Gold",
    "Silver",
  ]);
  const [vipApprovalOptions, setVipApprovalOptions] = useState([
    "Temple Admin",
    "Trustee Board",
    "Chairperson",
  ]);

  const resetVipForm = () => {
    setVipCategory("");
    setVipLevel("");
    setVipValidFrom("");
    setVipValidTill("");
    setVipApprovalAuthority("");
    setVipSensitive(false);
    setVipNotes("");
  };

  const handleMarkAsVip = () => {
    if (!selectedDonor) return;

    if (!vipCategory || !vipLevel || !vipValidFrom || !vipValidTill) {
      toast({ title: "Error", description: "Please fill all required VIP fields", variant: "destructive" });
      return;
    }

    if (new Date(vipValidTill) < new Date(vipValidFrom)) {
      toast({ title: "Error", description: "Validity end date must be after start date", variant: "destructive" });
      return;
    }

    try {
      // Combine category and notes for storage (DonorVipInfo doesn't have category field)
      const combinedNotes = [
        vipCategory ? `Category: ${vipCategory}` : "",
        vipNotes || ""
      ].filter(Boolean).join("\n");

      if (selectedDonor.vipInfo) {
        // Update existing VIP
        updateDonorVip({
          donorId: selectedDonor.donorId,
          level: vipLevel,
          validFrom: vipValidFrom,
          validTill: vipValidTill,
          notes: combinedNotes || undefined,
          approvedBy: vipApprovalAuthority || "System",
        });
        toast({ title: "Success", description: `VIP information updated for ${selectedDonor.name}` });
      } else {
        // Mark as new VIP
        markDonorAsVip({
          donorId: selectedDonor.donorId,
          level: vipLevel,
          validFrom: vipValidFrom,
          validTill: vipValidTill,
          notes: combinedNotes || undefined,
          approvedBy: vipApprovalAuthority || "System",
        });
        toast({ title: "Success", description: `${selectedDonor.name} marked as VIP ${vipLevel}` });
      }
      setShowVipDialog(false);
      resetVipForm();
      // Refresh selected donor by closing and reopening dialog
      setSelectedDonor(null);
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to mark donor as VIP", variant: "destructive" });
    }
  };

  const openVipDialog = () => {
    if (selectedDonor?.vipInfo) {
      // Pre-fill form if already VIP
      // Extract category from notes if it exists (format: "Category: X")
      const notes = selectedDonor.vipInfo.notes || "";
      const categoryMatch = notes.match(/Category:\s*(.+)/);
      const extractedCategory = categoryMatch ? categoryMatch[1].split('\n')[0].trim() : "";
      const extractedNotes = notes.replace(/Category:\s*.+(\n|$)/, "").trim();
      
      setVipCategory(extractedCategory);
      setVipLevel(selectedDonor.vipInfo.level || "");
      setVipValidFrom(selectedDonor.vipInfo.validFrom || "");
      setVipValidTill(selectedDonor.vipInfo.validTill || "");
      setVipApprovalAuthority(selectedDonor.vipInfo.approvedBy || "");
      setVipSensitive(false); // Donor VIP doesn't have sensitive flag, but keep for consistency
      setVipNotes(extractedNotes);
    } else {
      // Reset form for new VIP
      resetVipForm();
      // Set default validity (1 year from today)
      const oneYearLater = new Date();
      oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);
      setVipValidFrom(new Date().toISOString().split('T')[0]);
      setVipValidTill(oneYearLater.toISOString().split('T')[0]);
    }
    setShowVipDialog(true);
  };

  const filtered = safeDonors.filter(d => {
    if (!d || !d.name || typeof d.name !== 'string') return false;
    if (!d.donorId || typeof d.donorId !== 'string') return false;
    const searchLower = search.toLowerCase();
    return (
      d.name.toLowerCase().includes(searchLower) ||
      d.donorId.toLowerCase().includes(searchLower) ||
      (d.phone && typeof d.phone === 'string' && d.phone !== "-" && d.phone.toLowerCase().includes(searchLower)) ||
      (d.email && typeof d.email === 'string' && d.email !== "-" && d.email.toLowerCase().includes(searchLower)) ||
      (d.city && typeof d.city === 'string' && d.city !== "-" && d.city.toLowerCase().includes(searchLower))
    );
  });

  // Compute donor stats - wrapped in useMemo with error handling to prevent blank page
  const donorStats = useMemo(() => {
    const stats = new Map<string, { total: number; count: number; last: string }>();
    try {
      for (const don of safeDonations) {
        try {
          if (!don || !don.donorId || typeof don.donorId !== 'string') continue;
          if (typeof don.amount !== 'number' || !Number.isFinite(don.amount)) continue;
          const s = stats.get(don.donorId) ?? { total: 0, count: 0, last: "" };
          s.total += don.amount || 0;
          s.count += 1;
          if (don.date && typeof don.date === 'string' && (!s.last || don.date > s.last)) {
            s.last = don.date;
          }
          stats.set(don.donorId, s);
        } catch (err) {
          // Skip individual donation if it causes error, continue processing others
          console.warn('Error processing donation:', don?.donationId, err);
          continue;
        }
      }
    } catch (err) {
      // If entire loop fails, return empty map instead of crashing
      console.error('Error computing donor stats:', err);
      return new Map<string, { total: number; count: number; last: string }>();
    }
    return stats;
  }, [safeDonations]);

  // Early return if there's a critical error - but arrays can be empty, that's OK
  // Only return error if we truly can't process the data

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Donors</h1>
          <p className="text-sm text-muted-foreground mt-1">All donors automatically created from donation records</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><FileDown className="h-4 w-4 mr-1" /> CSV Export</Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          {safeDonors.length === 0 && !search && (
            <div className="text-center py-8 text-muted-foreground mb-4">
              <Heart className="h-8 w-8 mx-auto mb-2 opacity-30" />
              <p>No donors found. Donors are automatically created when donations are recorded.</p>
            </div>
          )}
          <div className="relative max-w-md mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by name, ID, phone, email or city..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Donor ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>City</TableHead>
                <TableHead className="text-right">Total Donations</TableHead>
                <TableHead>Last Donation</TableHead>
                <TableHead className="w-[120px]">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                    <div className="flex flex-col items-center gap-2">
                      <Heart className="h-8 w-8 opacity-30" />
                      <p>No donors found</p>
                      {search && (
                        <p className="text-xs">Try adjusting your search criteria</p>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map(d => {
                  const stats = donorStats.get(d.donorId);
                  return (
                    <TableRow key={d.donorId}>
                      <TableCell className="font-mono text-xs">{d.donorId}</TableCell>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {d.name}
                          {d.vipInfo?.status === "Active" && d.vipInfo?.level && (
                            <Badge variant="default" className="bg-yellow-100 text-yellow-800 text-xs">
                              <Crown className="h-3 w-3 mr-1" />
                              VIP {d.vipInfo.level}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{d.phone !== "-" ? d.phone : <span className="text-muted-foreground">—</span>}</TableCell>
                      <TableCell className="text-sm">{d.email !== "-" ? d.email : <span className="text-muted-foreground">—</span>}</TableCell>
                      <TableCell className="text-sm">{d.city !== "-" ? d.city : <span className="text-muted-foreground">—</span>}</TableCell>
                      <TableCell className="text-right font-mono font-medium">{formatCurrency(stats?.total)}</TableCell>
                      <TableCell className="text-sm">{stats?.last || "—"}</TableCell>
                      <TableCell>
                        <Button
                          variant={d.vipInfo ? "outline" : "default"}
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedDonor(d);
                            openVipDialog();
                          }}
                        >
                          <Crown className="h-4 w-4 mr-1" />
                          {d.vipInfo ? "VIP" : "Mark VIP"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Donor Detail Modal */}
      <Dialog open={!!selectedDonor} onOpenChange={() => setSelectedDonor(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">{selectedDonor?.name}</DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">Donor ID: {selectedDonor?.donorId}</p>
          </DialogHeader>
          {selectedDonor && (
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-transparent">
                <TabsTrigger value="details" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">Details</TabsTrigger>
                <TabsTrigger value="donations" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">Donations</TabsTrigger>
                <TabsTrigger value="contact" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">Contact</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4 mt-6">
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Basic Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      ["Donor ID", selectedDonor.donorId],
                      ["Category", selectedDonor.category],
                      ["PAN Number", selectedDonor.pan !== "-" ? selectedDonor.pan : "—"],
                      ["80G Eligible", selectedDonor.eligible80G ? "Yes" : "No"],
                      ["Created At", selectedDonor.createdAt ? new Date(selectedDonor.createdAt).toLocaleDateString() : "—"],
                    ].map(([label, value]) => (
                      <div key={label} className="p-3 rounded-lg bg-muted/50">
                        <p className="text-xs text-muted-foreground mb-1">{label}</p>
                        <p className="text-sm font-medium">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
                {selectedDonor.vipInfo && (
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">VIP Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        ["VIP Level", <Badge key="level" variant="default" className="bg-yellow-100 text-yellow-800"><Crown className="h-3 w-3 mr-1" />{selectedDonor.vipInfo?.level || "—"}</Badge>],
                        ["Status", <Badge key="status" variant={selectedDonor.vipInfo?.status === "Active" ? "default" : "secondary"}>{selectedDonor.vipInfo?.status || "—"}</Badge>],
                        ["Valid From", selectedDonor.vipInfo?.validFrom ? new Date(selectedDonor.vipInfo.validFrom).toLocaleDateString() : "—"],
                        ["Valid Till", selectedDonor.vipInfo?.validTill ? new Date(selectedDonor.vipInfo.validTill).toLocaleDateString() : "—"],
                        ["Approved By", selectedDonor.vipInfo?.approvedBy || "—"],
                        ["Notes", selectedDonor.vipInfo?.notes || "—"],
                      ].map(([label, value]) => (
                        <div key={label as string} className="p-3 rounded-lg bg-muted/50">
                          <p className="text-xs text-muted-foreground mb-1">{label}</p>
                          <div className="text-sm font-medium">{value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Donation Summary</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                      <p className="text-xs text-muted-foreground mb-1">Total Donated</p>
                      <p className="text-2xl font-bold">{formatCurrency(donorStats.get(selectedDonor.donorId)?.total)}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                      <p className="text-xs text-muted-foreground mb-1">Donation Count</p>
                      <p className="text-2xl font-bold">{donorStats.get(selectedDonor.donorId)?.count ?? 0}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                      <p className="text-xs text-muted-foreground mb-1">Last Donation</p>
                      <p className="text-sm font-medium">{donorStats.get(selectedDonor.donorId)?.last || "—"}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Notes</h3>
                  <p className="text-sm text-muted-foreground">No notes recorded.</p>
                </div>
              </TabsContent>

              <TabsContent value="donations" className="mt-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Donation History</h3>
                    <Badge variant="secondary">{donorStats.get(selectedDonor.donorId)?.count ?? 0} donations</Badge>
                  </div>
                  {(() => {
                    const donorDonations = safeDonations.filter(d => d.donorId === selectedDonor.donorId);
                    return donorDonations.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                            <TableHead>Fund</TableHead>
                            <TableHead>Channel</TableHead>
                            <TableHead>Receipt</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {donorDonations.map(d => {
                            if (!d || !d.donationId) return null;
                            const donor = safeDonors.find(donor => donor.donorId === d.donorId);
                            return (
                              <TableRow key={d.donationId}>
                                <TableCell className="text-sm">{d.date || "—"}</TableCell>
                                <TableCell className="text-right font-mono font-medium">{formatCurrency(d.amount)}</TableCell>
                                <TableCell className="text-sm">{d.purpose || "—"}</TableCell>
                                <TableCell className="text-sm">{d.channel || "—"}</TableCell>
                                <TableCell className="font-mono text-xs">
                                  {d.receiptNo ? (
                                    <Button
                                      variant="link"
                                      size="sm"
                                      className="h-auto p-0 font-mono text-xs text-primary hover:underline"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        try {
                                          downloadReceipt(d, donor || null, d.is80G || false);
                                          toast({ title: "Success", description: "Receipt download initiated" });
                                        } catch (error: any) {
                                          toast({ title: "Error", description: error.message || "Failed to download receipt", variant: "destructive" });
                                        }
                                      }}
                                    >
                                      <FileDown className="h-3 w-3 mr-1" />
                                      {d.receiptNo}
                                    </Button>
                                  ) : (
                                    "—"
                                  )}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground text-sm">
                        <Heart className="h-8 w-8 mx-auto mb-2 opacity-30" />
                        <p>No donations recorded yet</p>
                      </div>
                    );
                  })()}
                </div>
              </TabsContent>

              <TabsContent value="contact" className="mt-6 space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Contact Information</h3>
                  <div className="space-y-3">
                    {[
                      { icon: Phone, label: "Phone", value: selectedDonor.phone !== "-" ? selectedDonor.phone : "—" },
                      { icon: Mail, label: "Email", value: selectedDonor.email !== "-" ? selectedDonor.email : "—" },
                      { icon: MapPin, label: "Address", value: selectedDonor.city !== "-" ? selectedDonor.city : "—" },
                    ].map(({ icon: Icon, label, value }) => (
                      <div key={label} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">{label}</p>
                          <p className="text-sm font-medium">{value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      {/* Mark as VIP Dialog - Same as Devotee Management */}
      <Dialog open={showVipDialog} onOpenChange={(open) => {
        if (!open) {
          setShowVipDialog(false);
          resetVipForm();
        }
      }}>
        <DialogContent className="max-w-lg bg-background">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-amber-600" />
              {selectedDonor?.vipInfo ? "Update VIP Status" : "Mark as VIP"}
            </DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {selectedDonor?.name} · {selectedDonor?.donorId}
            </p>
          </DialogHeader>
          <div className="space-y-4">
            <div className="rounded-md border bg-muted/40 p-3 text-[11px] text-muted-foreground">
              Assign VIP classification and privileges on top of the existing Donor profile. After saving, VIP status will be updated.
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs">VIP Category *</Label>
                <SelectWithAddNew
                  value={vipCategory}
                  onValueChange={setVipCategory}
                  placeholder="Select category"
                  options={vipCategoryOptions}
                  onAddNew={(v) => setVipCategoryOptions((prev) => [...prev, v])}
                  className="h-9 bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">VIP Level *</Label>
                <SelectWithAddNew
                  value={vipLevel}
                  onValueChange={setVipLevel}
                  placeholder="Select level"
                  options={vipLevelOptions}
                  onAddNew={(v) => setVipLevelOptions((prev) => [...prev, v])}
                  className="h-9 bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Valid From *</Label>
                <Input type="date" className="h-9" value={vipValidFrom} onChange={e => setVipValidFrom(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Valid Till *</Label>
                <Input type="date" className="h-9" value={vipValidTill} onChange={e => setVipValidTill(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Approval Authority</Label>
                <SelectWithAddNew
                  value={vipApprovalAuthority}
                  onValueChange={setVipApprovalAuthority}
                  placeholder="Select approver"
                  options={vipApprovalOptions}
                  onAddNew={(v) => setVipApprovalOptions((prev) => [...prev, v])}
                  className="h-9 bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs flex items-center justify-between">
                  <span>Sensitive Flag</span>
                  <span className="text-[11px] text-muted-foreground">
                    Restricts who can view this record
                  </span>
                </Label>
                <div className="flex items-center justify-between rounded-md border bg-muted/40 px-3 py-2">
                  <span className="text-xs">Mark as sensitive</span>
                  <Switch checked={vipSensitive} onCheckedChange={setVipSensitive} />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Notes / Reason</Label>
              <Textarea
                rows={3}
                placeholder="Reason for VIP classification, context on privileges, etc."
                value={vipNotes}
                onChange={e => setVipNotes(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter className="mt-2 flex items-center justify-between">
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <AlertTriangle className="h-3 w-3" />
              On save, system will activate VIP privileges.
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => { setShowVipDialog(false); resetVipForm(); }}>Cancel</Button>
              <Button size="sm" className="gap-1" onClick={handleMarkAsVip}>
                <Crown className="h-3 w-3" />
                {selectedDonor?.vipInfo ? "Update VIP" : "Mark as VIP"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default DonorRegistry;
