import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Download, FileDown, User, Phone, Mail, MapPin, CreditCard, Hash, Banknote, Receipt, X, Award, Upload } from "lucide-react";
import { useDonations, useDonors, useReceipts80G } from "@/modules/donations/hooks";
import { downloadReceiptPdf } from "@/lib/pdfDocs";
import { download80GReceiptPdf } from "@/lib/eightyGReceipt";
import { downloadCsv } from "@/lib/csvExport";
import { useToast } from "@/hooks/use-toast";
import AddDonationDialog from "./AddDonationDialog";
import BulkImportDonationsDialog from "./BulkImportDonationsDialog";

const formatCurrency = (val: number | undefined | null): string => {
  try {
    if (val == null || typeof val !== "number" || !Number.isFinite(val)) return "₹0";
    return `₹${val.toLocaleString("en-IN")}`;
  } catch { return "₹0"; }
};

type DonationType = "All" | "General" | "Projects" | "Events" | "Other";

const DonationsList = () => {
  const navigate = useNavigate();
  const [addOpen, setAddOpen] = useState(false);
  const [bulkImportOpen, setBulkImportOpen] = useState(false);
  const donations = useDonations();
  const donors = useDonors();
  const receipts80G = useReceipts80G();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<DonationType>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [taxFilter, setTaxFilter] = useState<"all" | "80g" | "no-80g">("all");
  const [selectedDonation, setSelectedDonation] = useState<(typeof donations)[number] | null>(null);

  const getDonationType = (donation: any): DonationType => {
    if (donation.sourceModule === "Event" || donation.sourceRecordId?.startsWith("EVT")) return "Events";
    if (donation.purpose?.includes("Project") || donation.sourceRecordId?.startsWith("PRJ")) return "Projects";
    if (
      donation.sourceModule === "Counter" ||
      donation.counterId ||
      donation.sourceModule === "Online Portal" ||
      donation.sourceModule === "Booking" ||
      donation.purpose === "Counter Donation" ||
      donation.purpose === "General"
    ) {
      return "General";
    }
    return "Other";
  };

  const filteredDonations = useMemo(() => {
    let filtered = donations;
    if (activeTab !== "All") {
      filtered = filtered.filter(d => getDonationType(d) === activeTab);
    }
    if (taxFilter === "80g") {
      filtered = filtered.filter(d => d?.is80G === true);
    } else if (taxFilter === "no-80g") {
      filtered = filtered.filter(d => d?.is80G !== true);
    }
    if (fromDate) filtered = filtered.filter(d => d?.date && d.date >= fromDate);
    if (toDate) filtered = filtered.filter(d => d?.date && d.date <= toDate);
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(d => {
        if (!d) return false;
        return (
          (d.donorName && d.donorName.toLowerCase().includes(query)) ||
          (d.donationId && d.donationId.toLowerCase().includes(query)) ||
          (d.receiptNo && d.receiptNo.toLowerCase().includes(query)) ||
          (d.purpose && d.purpose.toLowerCase().includes(query))
        );
      });
    }
    return filtered.sort((a, b) => {
      try { return new Date(b?.date ?? 0).getTime() - new Date(a?.date ?? 0).getTime(); }
      catch { return 0; }
    });
  }, [donations, activeTab, searchQuery, fromDate, toDate, taxFilter]);

  const getDonorInfo = (donorId: string) => donors.find(d => d.donorId === donorId);

  const get80GReceipt = (donationId: string) =>
    receipts80G.find((r) => r.donationId === donationId && r.status === "Generated");

  const handleDownloadReceipt = (donation: (typeof donations)[number]) => {
    try {
      const donor = getDonorInfo(donation.donorId);
      downloadReceiptPdf({
        receiptNo: donation.receiptNo, date: donation.date, donorName: donation.donorName,
        donorPan: donor?.pan && donor.pan !== "-" ? donor.pan : undefined,
        donorAddress: donor?.city && donor.city !== "-" ? donor.city : undefined,
        amount: donation.amount, mode: donation.mode || donation.channel,
        donationType: (donation.purpose || "").toLowerCase().includes("corpus") ? "Corpus" : "General",
        remarks: donation.remarks, is80G: donation.is80G,
      });
      toast({ title: "Receipt downloaded", description: `${donation.receiptNo}.pdf saved` });
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to download receipt", variant: "destructive" });
    }
  };

  const handleDownload80G = (donation: (typeof donations)[number]) => {
    try {
      const receipt = get80GReceipt(donation.donationId);
      if (!receipt) {
        toast({ title: "80G not available", description: "Certificate not generated for this donation", variant: "destructive" });
        return;
      }
      const donor = getDonorInfo(donation.donorId);
      download80GReceiptPdf(receipt, donor?.city && donor.city !== "-" ? donor.city : undefined);
      toast({ title: "80G receipt downloaded", description: `${receipt.receipt80GId}.pdf — for IT portal` });
    } catch (error: unknown) {
      toast({ title: "Error", description: error instanceof Error ? error.message : "Failed to download 80G", variant: "destructive" });
    }
  };

  const handleExport = () => {
    const rows = filteredDonations.map(d => {
      const donor = getDonorInfo(d.donorId);
      return {
        "Donation ID": d.donationId,
        "Receipt No": d.receiptNo || "—",
        "Date": d.date,
        "Time": d.time || "—",
        "Amount": d.amount,
        "Fund / Purpose": d.purpose || "—",
        "Category / Type": getDonationType(d),
        "Payment Channel": d.channel || "—",
        "Payment Mode": d.mode || "—",
        "Ref No / Txn ID": d.referenceNo || "—",
        "Nature": d.nature || "—",
        "Source Module": d.sourceModule || "—",
        "Source Record ID": d.sourceRecordId || "—",
        "Counter ID": d.counterId || "—",
        "80G Eligible": d.is80G ? "Yes" : "No",
        "80G Receipt ID": d.receipt80GId || "—",
        "Settlement ID": d.settlementId || "—",
        "Remarks": d.remarks || "—",
        "Created At": d.createdAt || "—",
        "Donor ID": d.donorId,
        "Donor Name": d.donorName,
        "Donor Phone": donor?.phone && donor.phone !== "-" ? donor.phone : "—",
        "Donor Email": donor?.email && donor.email !== "-" ? donor.email : "—",
        "Donor City": donor?.city && donor.city !== "-" ? donor.city : "—",
        "Donor PAN": donor?.pan && donor.pan !== "-" ? donor.pan : "—",
        "Donor Category": donor?.category || "—",
        "Donor 80G Consent": donor?.eligible80G ? "Yes" : "No"
      };
    });
    downloadCsv(rows as any[], `donation-register-${activeTab.toLowerCase()}-${new Date().toISOString().split("T")[0]}.csv`);
    toast({ title: "CSV exported", description: `${rows.length} donation${rows.length !== 1 ? "s" : ""} downloaded` });
  };

  const sel = selectedDonation;
  const selDonor = sel ? getDonorInfo(sel.donorId) : null;
  const selType = sel ? getDonationType(sel) : "";

  const typeColors: Record<string, string> = {
    General: "bg-blue-100 text-blue-700",
    Events: "bg-amber-100 text-amber-700",
    Projects: "bg-purple-100 text-purple-700",
    Other: "bg-gray-100 text-gray-700",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="shrink-0">
          <h1 className="text-2xl font-bold">Donations</h1>
          <p className="text-sm text-muted-foreground mt-1">View and manage all donations</p>
        </div>
        <div className="flex items-center gap-2 ml-auto flex-wrap justify-end">
          <div className="flex items-center gap-1.5">
            <label className="text-xs text-muted-foreground whitespace-nowrap">From</label>
            <Input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="w-36 h-9 text-sm" />
          </div>
          <div className="flex items-center gap-1.5">
            <label className="text-xs text-muted-foreground whitespace-nowrap">To</label>
            <Input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="w-36 h-9 text-sm" />
          </div>
          {(fromDate || toDate) && (
            <Button variant="ghost" size="sm" onClick={() => { setFromDate(""); setToDate(""); }}>Clear</Button>
          )}
          <Button variant="outline" onClick={handleExport}><Download className="h-4 w-4 mr-2" />Export</Button>
          <Button variant="outline" onClick={() => setBulkImportOpen(true)} className="gap-2 border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800">
            <Upload className="h-4 w-4" />Bulk Import
          </Button>
          <Button onClick={() => setAddOpen(true)}><Plus className="h-4 w-4 mr-2" />Add Donation</Button>
        </div>
      </div>
      <AddDonationDialog open={addOpen} onOpenChange={setAddOpen} />
      <BulkImportDonationsDialog open={bulkImportOpen} onOpenChange={setBulkImportOpen} />

      {/* Search & Filters */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by donor name, receipt number, or donation ID..."
            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
        </div>
        <Select value={taxFilter} onValueChange={(v) => setTaxFilter(v as any)}>
          <SelectTrigger className="w-[180px] shrink-0">
            <SelectValue placeholder="80G Eligibility" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All (80G & Non-80G)</SelectItem>
            <SelectItem value="80g">80G Tax Exemption</SelectItem>
            <SelectItem value="no-80g">Non-80G / Direct</SelectItem>
          </SelectContent>
        </Select>
      </div>



      {/* Tabs + Table (UNCHANGED) */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as DonationType)}>
        <TabsList>
          <TabsTrigger value="All">All</TabsTrigger>
          <TabsTrigger value="General">General</TabsTrigger>
          <TabsTrigger value="Projects">Projects</TabsTrigger>
          <TabsTrigger value="Events">Events</TabsTrigger>
          <TabsTrigger value="Other">Other</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Donation ID</TableHead>
                      <TableHead>Donor Name</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead>Fund</TableHead>
                      <TableHead>Donation Type</TableHead>
                      <TableHead>Ref No / Txn ID</TableHead>
                      <TableHead>Donation Receipt</TableHead>
                      <TableHead>80G Receipt</TableHead>
                      <TableHead>PAN No</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDonations.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={10} className="text-center text-muted-foreground py-8">No donations found</TableCell>
                      </TableRow>
                    ) : filteredDonations.map((donation) => {
                      const donationType = getDonationType(donation);
                      const isSelected = sel?.donationId === donation.donationId;
                      const receipt80G = get80GReceipt(donation.donationId);
                      return (
                        <TableRow
                          key={donation.donationId}
                          className={`cursor-pointer transition-colors ${isSelected ? "bg-primary/5 ring-1 ring-inset ring-primary/30" : "hover:bg-muted/50"}`}
                          onClick={() => setSelectedDonation(isSelected ? null : donation)}
                        >
                          <TableCell>
                            {donation.date ? new Date(donation.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
                          </TableCell>
                          <TableCell className="font-mono text-xs">{donation.donationId || "—"}</TableCell>
                          <TableCell className="font-medium">{donation.donorName || "—"}</TableCell>
                          <TableCell className="text-right font-semibold">{formatCurrency(donation.amount)}</TableCell>
                          <TableCell>{donation.purpose || "—"}</TableCell>
                          <TableCell>
                            <Badge className={typeColors[donationType] || "bg-gray-100 text-gray-700"}>{donationType}</Badge>
                          </TableCell>
                          <TableCell className="font-mono text-xs">{donation.referenceNo || "—"}</TableCell>
                          <TableCell className="font-mono text-xs">
                            <Button variant="link" size="sm"
                              className="h-auto p-0 text-xs text-primary hover:underline"
                              onClick={(e) => { e.stopPropagation(); handleDownloadReceipt(donation); }}>
                              <Receipt className="h-3 w-3 mr-1" />{donation.receiptNo}
                            </Button>
                          </TableCell>
                          <TableCell className="font-mono text-xs">
                            {receipt80G ? (
                              <Button variant="link" size="sm"
                                className="h-auto p-0 text-xs text-green-700 hover:underline"
                                onClick={(e) => { e.stopPropagation(); handleDownload80G(donation); }}>
                                <Award className="h-3 w-3 mr-1" />{receipt80G.receipt80GId}
                              </Button>
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </TableCell>
                          <TableCell className="font-mono text-xs">
                            {(() => {
                              const amount = typeof donation?.amount === "number" && Number.isFinite(donation.amount) ? donation.amount : 0;
                              if (amount < 10000) return "—";
                              const donor = getDonorInfo(donation.donorId);
                              return donor?.pan && donor.pan !== "-" ? donor.pan : "—";
                            })()}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {filteredDonations.length > 0 && (
            <div className="mt-4 text-sm text-muted-foreground">
              Showing {filteredDonations.length} donation{filteredDonations.length !== 1 ? "s" : ""} •{" "}
              Total: <span className="font-semibold text-foreground">
                {formatCurrency(filteredDonations.reduce((sum, d) => {
                  const a = typeof d?.amount === "number" && Number.isFinite(d.amount) ? d.amount : 0;
                  return sum + a;
                }, 0))}
              </span>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* ── Detail panel — fixed to right side of viewport, no scroll ── */}
      {sel && (
        /* Backdrop: clicking outside closes the panel */
        <div
          className="fixed inset-0 z-30"
          onClick={() => setSelectedDonation(null)}
        />
      )}
      {sel && (
        <div className="fixed top-0 right-0 h-screen w-[360px] z-40 flex flex-col shadow-2xl border-l bg-background">
          <CardContent className="p-4 flex flex-col h-full">

            {/* Header */}
            <div className="flex items-center justify-between mb-3 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="font-bold text-primary">{sel.donorName?.charAt(0)?.toUpperCase() ?? "D"}</span>
                </div>
                <div>
                  <p className="font-semibold text-sm leading-tight">{sel.donorName}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Badge className={`text-[10px] px-1.5 py-0 ${typeColors[selType] || ""}`}>{selType}</Badge>
                    {sel.is80G && <Badge className="text-[10px] px-1.5 py-0 bg-green-100 text-green-700">80G</Badge>}
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => setSelectedDonation(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Amount */}
            <div className="rounded-xl bg-primary/5 border border-primary/15 px-4 py-3 text-center mb-4 shrink-0">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Donation Amount</p>
              <p className="text-3xl font-bold text-primary mt-0.5">{formatCurrency(sel.amount)}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {sel.date ? new Date(sel.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
              </p>
            </div>

            {/* Donation details */}
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1 shrink-0">Donation</p>
            <Separator className="mb-2 shrink-0" />
            <div className="grid grid-cols-2 gap-x-3 shrink-0">
              {[
                { icon: Hash, label: "Donation ID", value: sel.donationId },
                { icon: Banknote, label: "Purpose", value: sel.purpose },
                { icon: CreditCard, label: "Payment", value: sel.mode || sel.channel },
                ...(sel.referenceNo ? [{ icon: Hash, label: "Ref No", value: sel.referenceNo }] : []),
                ...(sel.counterId ? [{ icon: Hash, label: "Counter", value: sel.counterId }] : []),
              ].map(({ icon: Icon, label, value }) => value ? (
                <div key={label} className="flex items-start gap-2 py-1.5">
                  <div className="h-6 w-6 rounded bg-muted flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="h-3 w-3 text-muted-foreground" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[9px] text-muted-foreground uppercase tracking-wide">{label}</p>
                    <p className="text-xs font-medium mt-0.5 break-all">{value}</p>
                  </div>
                </div>
              ) : null)}
            </div>

            {/* Donor details */}
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mt-3 mb-1 shrink-0">Donor</p>
            <Separator className="mb-2 shrink-0" />
            <div className="grid grid-cols-2 gap-x-3 shrink-0">
              {[
                { icon: User, label: "Name", value: selDonor?.name || sel.donorName },
                { icon: Phone, label: "Mobile", value: selDonor?.phone },
                { icon: Mail, label: "Email", value: selDonor?.email && selDonor.email !== "-" ? selDonor.email : undefined },
                { icon: CreditCard, label: "PAN", value: selDonor?.pan && selDonor.pan !== "-" ? selDonor.pan : undefined },
                { icon: MapPin, label: "City", value: selDonor?.city && selDonor.city !== "-" ? selDonor.city : undefined },
              ].map(({ icon: Icon, label, value }) => value ? (
                <div key={label} className="flex items-start gap-2 py-1.5">
                  <div className="h-6 w-6 rounded bg-muted flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="h-3 w-3 text-muted-foreground" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[9px] text-muted-foreground uppercase tracking-wide">{label}</p>
                    <p className="text-xs font-medium mt-0.5 break-all">{value}</p>
                  </div>
                </div>
              ) : null)}
            </div>

            {/* Spacer */}
            <div className="flex-1" />
          </CardContent>
        </div>
      )}
    </div>
  );
};

export default DonationsList;
