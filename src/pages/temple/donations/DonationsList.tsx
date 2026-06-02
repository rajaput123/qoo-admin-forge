import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Download, Eye, FileDown } from "lucide-react";
import { useDonations, useDonors } from "@/modules/donations/hooks";
import { downloadReceipt, printReceipt, sendReceiptEmail } from "@/lib/receiptGenerator";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
const formatCurrency = (val: number | undefined | null): string => {
  try {
    if (val == null || typeof val !== 'number' || !Number.isFinite(val)) {
      return "₹0";
    }
    return `₹${val.toLocaleString('en-IN')}`;
  } catch {
    return "₹0";
  }
};

type DonationType = "All" | "Counter" | "Online/Booking" | "Event" | "Project" | "Other";

const DonationsList = () => {
  const navigate = useNavigate();
  // Hooks must be called unconditionally
  const donations = useDonations();
  const donors = useDonors();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<DonationType>("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Get donation type from donation record
  const getDonationType = (donation: any): DonationType | "Other" => {
    if (donation.sourceModule === "Counter" || donation.counterId) return "Counter";
    if (donation.sourceModule === "Online Portal" || donation.sourceModule === "Booking") return "Online/Booking";
    if (donation.sourceModule === "Event" || donation.sourceRecordId?.startsWith("EVT")) return "Event";
    if (donation.purpose?.includes("Project") || donation.sourceRecordId?.startsWith("PRJ")) return "Project";
    return "Other"; // Default to Other for unknown types
  };

  // Filter donations by type and search
  const filteredDonations = useMemo(() => {
    let filtered = donations;

    // Filter by type
    if (activeTab !== "All") {
      filtered = filtered.filter(d => {
        const type = getDonationType(d);
        return type === activeTab;
      });
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(d => {
        if (!d) return false;
        return (
          (d.donorName && typeof d.donorName === 'string' && d.donorName.toLowerCase().includes(query)) ||
          (d.donationId && typeof d.donationId === 'string' && d.donationId.toLowerCase().includes(query)) ||
          (d.receiptNo && typeof d.receiptNo === 'string' && d.receiptNo.toLowerCase().includes(query)) ||
          (d.purpose && typeof d.purpose === 'string' && d.purpose.toLowerCase().includes(query))
        );
      });
    }

    // Sort by date (newest first) - with safe date handling
    return filtered.sort((a, b) => {
      try {
        const dateA = a?.date ? new Date(a.date).getTime() : 0;
        const dateB = b?.date ? new Date(b.date).getTime() : 0;
        return dateB - dateA;
      } catch {
        return 0;
      }
    });
  }, [donations, activeTab, searchQuery]);

  const getDonorInfo = (donorId: string) => {
    return donors.find(d => d.donorId === donorId);
  };

  const handleDownloadReceipt = (donation: (typeof donations)[number]) => {
    try {
      const donor = getDonorInfo(donation.donorId);
      downloadReceipt(donation, donor || null, donation.is80G || false);
      toast({ title: "Success", description: "Receipt download initiated" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to download receipt", variant: "destructive" });
    }
  };


  const handleExport = () => {
    // Export logic
    const csv = [
      ["Date", "Donor Name", "Amount", "Fund", "Donation Type", "Receipt Number"].join(","),
      ...filteredDonations.map(d => [
        d.date,
        d.donorName,
        d.amount,
        d.purpose,
        getDonationType(d),
        d.receiptNo
      ].join(","))
    ].join("\n");
    
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `donations-${activeTab.toLowerCase()}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Donations</h1>
          <p className="text-sm text-muted-foreground mt-1">View and manage all donations</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => navigate("/temple/donations/add")}>
            <Plus className="h-4 w-4 mr-2" />
            Add Donation
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by donor name, receipt number, or donation ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as DonationType)}>
        <TabsList>
          <TabsTrigger value="All">All</TabsTrigger>
          <TabsTrigger value="Counter">Counter</TabsTrigger>
          <TabsTrigger value="Online/Booking">Online/Booking</TabsTrigger>
          <TabsTrigger value="Event">Event</TabsTrigger>
          <TabsTrigger value="Project">Project</TabsTrigger>
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
                      <TableHead>Donor Name</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead>Fund</TableHead>
                      <TableHead>Donation Type</TableHead>
                      <TableHead>Receipt Number</TableHead>
                      <TableHead>PAN No</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDonations.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                          No donations found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredDonations.map((donation) => {
                        const donationType = getDonationType(donation);
                        const typeColors: Record<string, string> = {
                          Counter: "bg-blue-100 text-blue-700",
                          "Online/Booking": "bg-green-100 text-green-700",
                          Event: "bg-amber-100 text-amber-700",
                          Project: "bg-purple-100 text-purple-700",
                          Other: "bg-gray-100 text-gray-700",
                        };

                        return (
                          <TableRow key={donation.donationId} className="cursor-pointer hover:bg-muted/50">
                            <TableCell>
                              {donation.date ? new Date(donation.date).toLocaleDateString('en-IN', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric'
                              }) : "—"}
                            </TableCell>
                            <TableCell className="font-medium">{donation.donorName || "—"}</TableCell>
                            <TableCell className="text-right font-semibold">
                              {formatCurrency(donation.amount)}
                            </TableCell>
                            <TableCell>{donation.purpose || "—"}</TableCell>
                            <TableCell>
                              <Badge className={typeColors[donationType] || "bg-gray-100 text-gray-700"}>
                                {donationType}
                              </Badge>
                            </TableCell>
                            <TableCell className="font-mono text-sm">
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="link"
                                  size="sm"
                                  className="h-auto p-0 font-mono text-sm text-primary hover:underline"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDownloadReceipt(donation);
                                  }}
                                >
                                  <FileDown className="h-3 w-3 mr-1" />
                                  {donation.receiptNo}
                                </Button>
                                {donation.is80G && (
                                  <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                                    80G
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="font-mono text-xs">
                              {(() => {
                                const amount = typeof donation?.amount === 'number' && Number.isFinite(donation.amount) ? donation.amount : 0;
                                if (amount < 10000) return "—";
                                const donor = getDonorInfo(donation.donorId);
                                return donor?.pan && donor.pan !== "-" ? donor.pan : "—";
                              })()}
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Summary */}
          {filteredDonations.length > 0 && (
            <div className="mt-4 text-sm text-muted-foreground">
              Showing {filteredDonations.length} donation{filteredDonations.length !== 1 ? 's' : ''} • 
              Total: <span className="font-semibold text-foreground">
                {formatCurrency(filteredDonations.reduce((sum, d) => {
                  const amount = typeof d?.amount === 'number' && Number.isFinite(d.amount) ? d.amount : 0;
                  return sum + amount;
                }, 0))}
              </span>
            </div>
          )}
        </TabsContent>
      </Tabs>

    </div>
  );
};
  );
};

export default DonationsList;
