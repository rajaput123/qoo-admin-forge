import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, FileDown, Phone, Mail, MapPin, Heart, Award, Hash, CreditCard, X, Receipt } from "lucide-react";
import { useDonations, useDonors, useReceipts80G } from "@/modules/donations/hooks";
import { useToast } from "@/hooks/use-toast";
import { downloadReceiptPdf } from "@/lib/pdfDocs";
import { download80GReceiptPdf } from "@/lib/eightyGReceipt";

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

const categoryBadgeClass: Record<string, string> = {
  Patron: "bg-purple-100 text-purple-700",
  Trust: "bg-blue-100 text-blue-700",
  Organization: "bg-slate-100 text-slate-700",
  Anonymous: "bg-gray-100 text-gray-600",
  Regular: "bg-emerald-100 text-emerald-700",
};

const DonorRegistry = () => {
  // Hooks must be called unconditionally - can't wrap in try-catch
  const donors = useDonors();
  const donations = useDonations();
  const receipts80G = useReceipts80G();
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
  const [eightyGFilter, setEightyGFilter] = useState<"all" | "80g" | "non-80g">("all");
  const [selectedDonor, setSelectedDonor] = useState<(typeof safeDonors)[number] | null>(null);

  const filtered = safeDonors.filter(d => {
    if (!d || !d.name || typeof d.name !== 'string') return false;
    if (!d.donorId || typeof d.donorId !== 'string') return false;
    if (eightyGFilter === "80g" && !d.eligible80G) return false;
    if (eightyGFilter === "non-80g" && d.eligible80G) return false;
    const searchLower = search.toLowerCase();
    return (
      d.name.toLowerCase().includes(searchLower) ||
      d.donorId.toLowerCase().includes(searchLower) ||
      (d.phone && typeof d.phone === 'string' && d.phone !== "-" && d.phone.toLowerCase().includes(searchLower)) ||
      (d.email && typeof d.email === 'string' && d.email !== "-" && d.email.toLowerCase().includes(searchLower)) ||
      (d.city && typeof d.city === 'string' && d.city !== "-" && d.city.toLowerCase().includes(searchLower)) ||
      (d.pan && typeof d.pan === 'string' && d.pan !== "-" && d.pan.toLowerCase().includes(searchLower))
    );
  });

  const donorCounts = useMemo(() => ({
    total: safeDonors.length,
    with80G: safeDonors.filter((d) => d.eligible80G).length,
    without80G: safeDonors.filter((d) => !d.eligible80G).length,
  }), [safeDonors]);

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

  const sel = selectedDonor;
  const selStats = sel ? donorStats.get(sel.donorId) : null;
  const selDonations = sel
    ? safeDonations.filter((d) => d.donorId === sel.donorId).sort((a, b) => (b.date || "").localeCompare(a.date || ""))
    : [];

  const handleDownloadReceipt = (d: (typeof safeDonations)[number]) => {
    if (!sel) return;
    try {
      downloadReceiptPdf({
        receiptNo: d.receiptNo,
        date: d.date,
        donorName: sel.name,
        donorPan: sel.pan && sel.pan !== "-" ? sel.pan : undefined,
        donorAddress: sel.city && sel.city !== "-" ? sel.city : undefined,
        amount: d.amount,
        mode: d.mode || d.channel,
        donationType: (d.purpose || "").toLowerCase().includes("corpus") ? "Corpus" : "General",
        remarks: d.remarks,
        is80G: d.is80G,
      });
      toast({ title: "Donation receipt downloaded", description: `${d.receiptNo}.pdf saved` });
    } catch (error: unknown) {
      toast({ title: "Error", description: error instanceof Error ? error.message : "Failed", variant: "destructive" });
    }
  };

  const get80GReceipt = (donationId: string) =>
    receipts80G.find((r) => r.donationId === donationId && r.status === "Generated");

  const handleDownload80G = (d: (typeof safeDonations)[number]) => {
    if (!sel) return;
    const receipt = get80GReceipt(d.donationId);
    if (!receipt) {
      toast({ title: "80G not available", description: "No 80G certificate for this donation", variant: "destructive" });
      return;
    }
    try {
      download80GReceiptPdf(receipt, sel.city && sel.city !== "-" ? sel.city : undefined);
      toast({ title: "80G receipt downloaded", description: `${receipt.receipt80GId}.pdf saved` });
    } catch (error: unknown) {
      toast({ title: "Error", description: error instanceof Error ? error.message : "Failed", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Donor Registry</h1>
          <p className="text-sm text-muted-foreground mt-1">All donors — 80G eligible and non-80G</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><FileDown className="h-4 w-4 mr-1" /> CSV Export</Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total Donors", value: donorCounts.total },
          { label: "80G Eligible", value: donorCounts.with80G, color: "text-green-700" },
          { label: "Without 80G", value: donorCounts.without80G, color: "text-muted-foreground" },
        ].map(({ label, value, color }) => (
          <Card key={label}>
            <CardContent className="p-4">
              <p className={`text-2xl font-bold ${color || ""}`}>{value}</p>
              <p className="text-xs text-muted-foreground mt-1">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-4">
          {safeDonors.length === 0 && !search && (
            <div className="text-center py-8 text-muted-foreground mb-4">
              <Heart className="h-8 w-8 mx-auto mb-2 opacity-30" />
              <p>No donors found. Donors are automatically created when donations are recorded.</p>
            </div>
          )}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search by name, ID, phone, PAN..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
            </div>
            <Select value={eightyGFilter} onValueChange={(v) => setEightyGFilter(v as typeof eightyGFilter)}>
              <SelectTrigger className="w-[160px]"><SelectValue placeholder="80G filter" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Donors</SelectItem>
                <SelectItem value="80g">80G Eligible</SelectItem>
                <SelectItem value="non-80g">Without 80G</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Donor ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>City</TableHead>
                <TableHead className="text-right">Total Donations</TableHead>
                <TableHead>Last Donation</TableHead>
                <TableHead className="text-center w-[100px]">80G</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
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
                    <TableRow key={d.donorId} className="cursor-pointer hover:bg-muted/50" onClick={() => setSelectedDonor(d)}>
                      <TableCell className="font-mono text-xs">{d.donorId}</TableCell>
                      <TableCell className="font-medium">{d.name}</TableCell>
                      <TableCell className="text-sm">{d.phone !== "-" ? d.phone : <span className="text-muted-foreground">—</span>}</TableCell>
                      <TableCell className="text-sm">{d.city !== "-" ? d.city : <span className="text-muted-foreground">—</span>}</TableCell>
                      <TableCell className="text-right font-mono font-medium">{formatCurrency(stats?.total)}</TableCell>
                      <TableCell className="text-sm">{stats?.last || "—"}</TableCell>
                      <TableCell className="text-center">
                        {d.eligible80G ? (
                          <Badge variant="outline" className="text-[10px] bg-green-50 text-green-700 border-green-200">
                            <Award className="h-3 w-3 mr-1" />80G
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-[10px] text-muted-foreground">No 80G</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {sel && selDonations.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <p className="text-sm font-semibold mb-3">Donations — {sel.name}</p>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Fund</TableHead>
                  <TableHead>Donation Receipt</TableHead>
                  <TableHead>80G Receipt</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selDonations.map((d) => {
                  const receipt80G = get80GReceipt(d.donationId);
                  return (
                    <TableRow key={d.donationId}>
                      <TableCell className="text-sm">
                        {d.date ? new Date(d.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
                      </TableCell>
                      <TableCell className="text-right font-medium">{formatCurrency(d.amount)}</TableCell>
                      <TableCell className="text-sm">{d.purpose || "—"}</TableCell>
                      <TableCell className="font-mono text-xs">
                        <Button variant="link" size="sm" className="h-auto p-0 text-xs"
                          onClick={() => handleDownloadReceipt(d)}>
                          <Receipt className="h-3 w-3 mr-1" />{d.receiptNo}
                        </Button>
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {receipt80G ? (
                          <Button variant="link" size="sm" className="h-auto p-0 text-xs text-green-700"
                            onClick={() => handleDownload80G(d)}>
                            <Award className="h-3 w-3 mr-1" />{receipt80G.receipt80GId}
                          </Button>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Detail panel — donor info only */}
      {sel && (
        <div className="fixed inset-0 z-30" onClick={() => setSelectedDonor(null)} />
      )}
      {sel && (
        <div className="fixed top-0 right-0 h-screen w-[360px] z-40 flex flex-col shadow-2xl border-l bg-background overflow-y-auto">
          <CardContent className="p-4 flex flex-col min-h-full">
            <div className="flex items-center justify-between mb-3 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="font-bold text-primary">{sel.name?.charAt(0)?.toUpperCase() ?? "D"}</span>
                </div>
                <div>
                  <p className="font-semibold text-sm leading-tight">{sel.name}</p>
                  <div className="flex items-center gap-1 mt-0.5 flex-wrap">
                    <Badge className={`text-[10px] px-1.5 py-0 ${categoryBadgeClass[sel.category] || "bg-gray-100 text-gray-700"}`}>
                      {sel.category}
                    </Badge>
                    {sel.eligible80G ? (
                      <Badge className="text-[10px] px-1.5 py-0 bg-green-100 text-green-700">80G</Badge>
                    ) : (
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0 text-muted-foreground">No 80G</Badge>
                    )}
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => setSelectedDonor(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="rounded-xl bg-primary/5 border border-primary/15 px-4 py-3 text-center mb-4 shrink-0">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Total Donated</p>
              <p className="text-3xl font-bold text-primary mt-0.5">{formatCurrency(selStats?.total)}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {selStats?.count ?? 0} donation{(selStats?.count ?? 0) !== 1 ? "s" : ""}
                {selStats?.last && ` · Last ${new Date(selStats.last).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}`}
              </p>
            </div>

            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1 shrink-0">Donor</p>
            <Separator className="mb-2 shrink-0" />
            <div className="grid grid-cols-2 gap-x-3 shrink-0">
              {[
                { icon: Hash, label: "Donor ID", value: sel.donorId },
                { icon: CreditCard, label: "PAN", value: sel.pan && sel.pan !== "-" ? sel.pan : "—" },
                { icon: Phone, label: "Mobile", value: sel.phone && sel.phone !== "-" ? sel.phone : undefined },
                { icon: Mail, label: "Email", value: sel.email && sel.email !== "-" ? sel.email : undefined },
                { icon: MapPin, label: "City", value: sel.city && sel.city !== "-" ? sel.city : undefined },
                { icon: Award, label: "80G Status", value: sel.eligible80G ? "Eligible" : "Not eligible" },
              ].map(({ icon: Icon, label, value }) => (value !== undefined ? (
                <div key={label} className="flex items-start gap-2 py-1.5">
                  <div className="h-6 w-6 rounded bg-muted flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="h-3 w-3 text-muted-foreground" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[9px] text-muted-foreground uppercase tracking-wide">{label}</p>
                    <p className={`text-xs font-medium mt-0.5 break-all ${label === "PAN" ? "font-mono" : ""}`}>{value}</p>
                  </div>
                </div>
              ) : null))}
            </div>
          </CardContent>
        </div>
      )}
    </div>
  );
};

export default DonorRegistry;
