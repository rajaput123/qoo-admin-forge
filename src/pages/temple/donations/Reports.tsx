import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, FileText, BarChart3, FileDown } from "lucide-react";
import { useDonations, useDonors, useAllocations } from "@/modules/donations/hooks";
import { downloadReceipt } from "@/lib/receiptGenerator";
import { downloadCsv } from "@/lib/csvExport";
import { useToast } from "@/hooks/use-toast";
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
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

type DonationType = "General" | "Projects" | "Events" | "Other";

const Reports = () => {
  // Hooks must be called unconditionally
  const donations = useDonations();
  const donors = useDonors();
  const allocations = useAllocations();
  const { toast } = useToast();

  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedFund, setSelectedFund] = useState("all");
  const [selectedDonor, setSelectedDonor] = useState("all");
  const [selectedType, setSelectedType] = useState<DonationType | "all">("all");
  const [taxFilter, setTaxFilter] = useState<"all" | "80g" | "no-80g">("all");

  // Get unique funds and donors
  const funds = Array.from(new Set(donations.map(d => d.purpose)));
  const donorOptions = donors.map(d => ({ value: d.donorId, label: d.name }));

  // Get donation type
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

  // Filter donations
  const filteredDonations = useMemo(() => {
    let filtered = donations;

    if (dateFrom) {
      filtered = filtered.filter(d => d.date >= dateFrom);
    }
    if (dateTo) {
      filtered = filtered.filter(d => d.date <= dateTo);
    }
    if (selectedFund !== "all") {
      filtered = filtered.filter(d => d.purpose === selectedFund);
    }
    if (selectedDonor !== "all") {
      filtered = filtered.filter(d => d.donorId === selectedDonor);
    }
    if (selectedType !== "all") {
      filtered = filtered.filter(d => getDonationType(d) === selectedType);
    }
    if (taxFilter === "80g") {
      filtered = filtered.filter(d => d.is80G === true);
    } else if (taxFilter === "no-80g") {
      filtered = filtered.filter(d => d.is80G !== true);
    }

    return filtered;
  }, [donations, dateFrom, dateTo, selectedFund, selectedDonor, selectedType, taxFilter]);

  // Donation Register Report
  const donationRegister = filteredDonations.sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Fund Utilization Report
  const fundUtilization = useMemo(() => {
    try {
      const fundMap = new Map<string, { received: number; allocated: number; utilized: number }>();
      
      filteredDonations.forEach(d => {
        try {
          if (!d || !d.purpose) return;
          const fund = fundMap.get(d.purpose) || { received: 0, allocated: 0, utilized: 0 };
          const amount = typeof d.amount === 'number' && Number.isFinite(d.amount) ? d.amount : 0;
          fund.received += amount;
          fundMap.set(d.purpose, fund);
        } catch (err) {
          console.warn('Error processing donation for fund utilization:', d?.donationId, err);
        }
      });

      allocations.forEach(a => {
        try {
          if (!a || !a.purpose) return;
          const fund = fundMap.get(a.purpose) || { received: 0, allocated: 0, utilized: 0 };
          const allocated = typeof a.allocated === 'number' && Number.isFinite(a.allocated) ? a.allocated : 0;
          const utilized = typeof a.utilized === 'number' && Number.isFinite(a.utilized) ? a.utilized : 0;
          fund.allocated += allocated;
          fund.utilized += utilized;
          fundMap.set(a.purpose, fund);
        } catch (err) {
          console.warn('Error processing allocation:', a?.donationId, err);
        }
      });

      return Array.from(fundMap.entries()).map(([name, data]) => ({
        fund: name,
        received: data.received,
        allocated: data.allocated,
        utilized: data.utilized,
        balance: data.received - data.allocated,
      }));
    } catch (err) {
      console.error('Error calculating fund utilization:', err);
      return [];
    }
  }, [filteredDonations, allocations]);

  // Donor Contribution Report
  const donorContribution = useMemo(() => {
    try {
      const donorMap = new Map<string, { name: string; total: number; count: number; lastDate: string }>();
      
      filteredDonations.forEach(d => {
        try {
          if (!d || !d.donorId) return;
          const donor = donors.find(dr => dr.donorId === d.donorId);
          const data = donorMap.get(d.donorId) || { 
            name: donor?.name || d.donorName || "Unknown", 
            total: 0, 
            count: 0, 
            lastDate: "" 
          };
          const amount = typeof d.amount === 'number' && Number.isFinite(d.amount) ? d.amount : 0;
          data.total += amount;
          data.count += 1;
          if (d.date && typeof d.date === 'string' && (!data.lastDate || d.date > data.lastDate)) {
            data.lastDate = d.date;
          }
          donorMap.set(d.donorId, data);
        } catch (err) {
          console.warn('Error processing donation for donor contribution:', d?.donationId, err);
        }
      });

      return Array.from(donorMap.values())
        .sort((a, b) => b.total - a.total)
        .slice(0, 20); // Top 20 donors
    } catch (err) {
      console.error('Error calculating donor contribution:', err);
      return [];
    }
  }, [filteredDonations, donors]);

  // Type-wise Analysis
  const typeAnalysis = useMemo(() => {
    try {
      const typeMap = new Map<DonationType | "Other", number>();
      filteredDonations.forEach(d => {
        try {
          if (!d) return;
          const type = getDonationType(d);
          const amount = typeof d.amount === 'number' && Number.isFinite(d.amount) ? d.amount : 0;
          typeMap.set(type, (typeMap.get(type) || 0) + amount);
        } catch (err) {
          console.warn('Error processing donation for type analysis:', d?.donationId, err);
        }
      });
      return Array.from(typeMap.entries()).map(([type, amount]) => ({
        type,
        amount,
        count: filteredDonations.filter(d => getDonationType(d) === type).length,
      }));
    } catch (err) {
      console.error('Error calculating type analysis:', err);
      return [];
    }
  }, [filteredDonations]);

  const handleExport = (format: "csv" | "pdf") => {
    if (format === "csv") {
      const rows = donationRegister.map(d => {
        const donor = donors.find(dr => dr.donorId === d.donorId);
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
      downloadCsv(rows as any[], `donation-report-${new Date().toISOString().split('T')[0]}.csv`);
      toast({ title: "CSV exported", description: `${rows.length} donation${rows.length !== 1 ? "s" : ""} downloaded` });
    } else {
      // PDF export would require a library like jsPDF
      alert("PDF export feature coming soon");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Reports</h1>
          <p className="text-sm text-muted-foreground mt-1">Generate and export donation reports</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleExport("csv")}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline" onClick={() => handleExport("pdf")}>
            <FileText className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="space-y-2">
              <Label>Date From</Label>
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Date To</Label>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Fund</Label>
              <Select value={selectedFund} onValueChange={setSelectedFund}>
                <SelectTrigger>
                  <SelectValue placeholder="All Funds" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Funds</SelectItem>
                  {funds.map(fund => (
                    <SelectItem key={fund} value={fund}>{fund}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Donor</Label>
              <Select value={selectedDonor} onValueChange={setSelectedDonor}>
                <SelectTrigger>
                  <SelectValue placeholder="All Donors" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Donors</SelectItem>
                  {donorOptions.map(donor => (
                    <SelectItem key={donor.value} value={donor.value}>{donor.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Donation Type</Label>
              <Select value={selectedType} onValueChange={(v) => setSelectedType(v as DonationType | "all")}>
                <SelectTrigger>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="General">General</SelectItem>
                  <SelectItem value="Projects">Projects</SelectItem>
                  <SelectItem value="Events">Events</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>80G Eligibility</Label>
              <Select value={taxFilter} onValueChange={(v) => setTaxFilter(v as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="80g">80G</SelectItem>
                  <SelectItem value="no-80g">No 80G</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reports Tabs */}
      <Tabs defaultValue="register" className="space-y-4">
        <TabsList>
          <TabsTrigger value="register">Donation Register</TabsTrigger>
          <TabsTrigger value="fund">Fund Utilization</TabsTrigger>
          <TabsTrigger value="donor">Donor Contribution</TabsTrigger>
          <TabsTrigger value="type">Type-wise Analysis</TabsTrigger>
        </TabsList>

        {/* Donation Register */}
        <TabsContent value="register">
          <Card>
            <CardHeader>
              <CardTitle>Donation Register</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Donor Name</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Fund</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Ref No / Txn ID</TableHead>
                      <TableHead>Receipt Number</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {donationRegister.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                          No donations found for selected filters
                        </TableCell>
                      </TableRow>
                    ) : (
                      donationRegister.map(donation => (
                        <TableRow key={donation.donationId}>
                          <TableCell>{donation.date}</TableCell>
                          <TableCell className="font-medium">{donation.donorName}</TableCell>
                          <TableCell className="font-semibold">{formatCurrency(donation.amount)}</TableCell>
                          <TableCell>{donation.purpose}</TableCell>
                          <TableCell>{getDonationType(donation)}</TableCell>
                          <TableCell className="font-mono text-xs">{donation.referenceNo || "—"}</TableCell>
                          <TableCell className="font-mono text-sm">
                            {donation.receiptNo ? (
                              <Button
                                variant="link"
                                size="sm"
                                className="h-auto p-0 font-mono text-sm text-primary hover:underline"
                                onClick={() => {
                                  const donor = donors.find(d => d.donorId === donation.donorId);
                                  try {
                                    downloadReceipt(donation, donor || null, donation.is80G || false);
                                    toast({ title: "Success", description: "Receipt download initiated" });
                                  } catch (error: any) {
                                    toast({ title: "Error", description: error.message || "Failed to download receipt", variant: "destructive" });
                                  }
                                }}
                              >
                                <FileDown className="h-3 w-3 mr-1" />
                                {donation.receiptNo}
                              </Button>
                            ) : (
                              "—"
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              {donationRegister.length > 0 && (
                <div className="mt-4 text-sm text-muted-foreground">
                  Total: <span className="font-semibold text-foreground">
                    {formatCurrency(donationRegister.reduce((sum, d) => sum + d.amount, 0))}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Fund Utilization */}
        <TabsContent value="fund">
          <Card>
            <CardHeader>
              <CardTitle>Fund Utilization</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fund Name</TableHead>
                      <TableHead className="text-right">Received</TableHead>
                      <TableHead className="text-right">Allocated</TableHead>
                      <TableHead className="text-right">Utilized</TableHead>
                      <TableHead className="text-right">Balance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fundUtilization.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                          No fund data available
                        </TableCell>
                      </TableRow>
                    ) : (
                      fundUtilization.map(fund => (
                        <TableRow key={fund.fund}>
                          <TableCell className="font-medium">{fund.fund}</TableCell>
                          <TableCell className="text-right font-semibold">
                            {formatCurrency(fund.received)}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(fund.allocated)}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(fund.utilized)}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(fund.balance)}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Donor Contribution */}
        <TabsContent value="donor">
          <Card>
            <CardHeader>
              <CardTitle>Top Donors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Donor Name</TableHead>
                      <TableHead className="text-right">Total Donated</TableHead>
                      <TableHead className="text-right">Number of Donations</TableHead>
                      <TableHead>Last Donation</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {donorContribution.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                          No donor data available
                        </TableCell>
                      </TableRow>
                    ) : (
                      donorContribution.map(donor => (
                        <TableRow key={donor.name}>
                          <TableCell className="font-medium">{donor.name}</TableCell>
                          <TableCell className="text-right font-semibold">
                            {formatCurrency(donor.total)}
                          </TableCell>
                          <TableCell className="text-right">{donor.count}</TableCell>
                          <TableCell>
                            {new Date(donor.lastDate).toLocaleDateString('en-IN')}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Type-wise Analysis */}
        <TabsContent value="type">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Type-wise Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={typeAnalysis}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ type, percent }) => `${type} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="amount"
                    >
                      {typeAnalysis.map((entry, index) => {
                        const colors: Record<string, string> = {
                          General: "#3b82f6",
                          Events: "#f59e0b",
                          Projects: "#8b5cf6",
                          Other: "#6b7280",
                        };
                        return <Cell key={`cell-${index}`} fill={colors[entry.type] || "#6b7280"} />;
                      })}
                    </Pie>
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Type-wise Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead className="text-right">Count</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {typeAnalysis.map(type => (
                        <TableRow key={type.type}>
                          <TableCell className="font-medium">{type.type}</TableCell>
                          <TableCell className="text-right font-semibold">
                            {formatCurrency(type.amount)}
                          </TableCell>
                          <TableCell className="text-right">{type.count}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
