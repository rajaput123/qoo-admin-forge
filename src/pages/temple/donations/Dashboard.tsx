import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { IndianRupee, Users, Wallet, CalendarCheck, Plus, TrendingUp, Banknote, Coins } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { useDonations, useDonors, useAllocations, useCertificates80G } from "@/modules/donations/hooks";
import { Badge } from "@/components/ui/badge";
import ComplianceTracker from "@/components/donations/ComplianceTracker";
import AddDonationDialog from "./AddDonationDialog";

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

const donationTypeColors: Record<string, string> = {
  General: "#3b82f6",
  Events: "#f59e0b",
  Projects: "#8b5cf6",
  Other: "#6b7280",
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [addOpen, setAddOpen] = useState(false);
  // Hooks must be called unconditionally
  const donations = useDonations();
  const donors = useDonors();
  const allocations = useAllocations();
  const certificates80G = useCertificates80G();

  const today = new Date().toISOString().slice(0, 10);
  const currentMonth = new Date().toISOString().slice(0, 7);

  // Calculate metrics with safe handling
  const todayTotal = donations.filter(d => d?.date === today).reduce((s, d) => {
    const amount = typeof d?.amount === 'number' && Number.isFinite(d.amount) ? d.amount : 0;
    return s + amount;
  }, 0);
  const monthlyTotal = donations.filter(d => d?.date && typeof d.date === 'string' && d.date.startsWith(currentMonth)).reduce((s, d) => {
    const amount = typeof d?.amount === 'number' && Number.isFinite(d.amount) ? d.amount : 0;
    return s + amount;
  }, 0);
  const activeDonors = new Set(donations.filter(d => d?.donorId).map(d => d.donorId)).size;
  
  // Fund balance = total donations - utilized allocations
  const totalDonations = donations.reduce((s, d) => {
    const amount = typeof d?.amount === 'number' && Number.isFinite(d.amount) ? d.amount : 0;
    return s + amount;
  }, 0);
  const totalUtilized = allocations.reduce((s, a) => {
    const utilized = typeof a?.utilized === 'number' && Number.isFinite(a.utilized) ? a.utilized : 0;
    return s + utilized;
  }, 0);
  const fundBalance = totalDonations - totalUtilized;

  // ====== 80G Compliance metrics ======
  // Current financial year (Apr 1 – Mar 31)
  const now = new Date();
  const fyStartYear = now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1;
  const fyStart = `${fyStartYear}-04-01`;
  const fyEnd = `${fyStartYear + 1}-03-31`;
  const fyLabel = `${fyStartYear}-${String(fyStartYear + 1).slice(2)}`;

  const fyDonations = donations.filter(d => d?.date && d.date >= fyStart && d.date <= fyEnd);
  const fyTotal = fyDonations.reduce((s, d) => s + (Number.isFinite(d?.amount) ? d.amount : 0), 0);
  const fyDonorCount = new Set(fyDonations.map(d => d.donorId)).size;
  const fyCashTotal = fyDonations.filter(d => d.nature === "Cash").reduce((s, d) => s + d.amount, 0);
  const fyNonCashTotal = fyDonations.filter(d => d.nature === "Non-Cash").reduce((s, d) => s + d.amount, 0);



  const cashSplitData = [
    { name: "Cash / Bank", value: fyCashTotal, color: "#22c55e" },
    { name: "Non-Cash (In-Kind)", value: fyNonCashTotal, color: "#3b82f6" },
  ].filter(x => x.value > 0);

  // Donation distribution by type - wrapped in useMemo with error handling
  const typeData = useMemo(() => {
    try {
      const typeAgg = new Map<string, number>();
      donations.forEach(d => {
        try {
          let type = (d as any).donationType;
          
          // Determine type from donation data
          if (!type) {
            if (d.sourceModule === "Event" || d.sourceRecordId?.startsWith("EVT")) type = "Events";
            else if (d.purpose?.includes("Project") || d.sourceRecordId?.startsWith("PRJ")) type = "Projects";
            else if (
              d.sourceModule === "Counter" ||
              d.counterId ||
              d.sourceModule === "Online Portal" ||
              d.sourceModule === "Booking" ||
              d.purpose === "Counter Donation" ||
              d.purpose === "General"
            ) {
              type = "General";
            } else {
              type = "Other";
            }
          }
          
          // Map to standard types or "Other"
          const standardTypes = ["General", "Events", "Projects"];
          const finalType = standardTypes.includes(type) ? type : "Other";
          
          const currentAmount = typeof d.amount === 'number' && Number.isFinite(d.amount) ? d.amount : 0;
          typeAgg.set(finalType, (typeAgg.get(finalType) || 0) + currentAmount);
        } catch (err) {
          // Skip individual donation if it causes error, continue processing others
          console.warn('Error processing donation for type distribution:', d?.donationId, err);
        }
      });
      
      return Array.from(typeAgg.entries()).map(([name, value]) => ({
        name,
        value,
        color: donationTypeColors[name] || "#6b7280",
      }));
    } catch (err) {
      // If entire calculation fails, return empty array instead of crashing
      console.error('Error calculating donation type distribution:', err);
      return [];
    }
  }, [donations]);

  // Recent donations (last 10) - with safe handling
  const recentDonations = [...donations]
    .filter(d => d != null)
    .sort((a, b) => {
      try {
        const dateA = a?.date ? new Date(a.date).getTime() : 0;
        const dateB = b?.date ? new Date(b.date).getTime() : 0;
        return dateB - dateA;
      } catch {
        return 0;
      }
    })
    .slice(0, 10);

  const getDonorName = (donorId: string) => {
    const donor = donors.find(d => d.donorId === donorId);
    return donor?.name || "Unknown";
  };

  const getDonationType = (donation: any): string => {
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

  return (
    <div className="space-y-6">


      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Donations</CardTitle>
            <CalendarCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(todayTotal)}</div>
            <p className="text-xs text-muted-foreground">
              {donations.filter(d => d?.date === today).length} donations today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Total</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(monthlyTotal)}</div>
            <p className="text-xs text-muted-foreground">
              {donations.filter(d => d?.date && typeof d.date === 'string' && d.date.startsWith(currentMonth)).length} donations this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Donors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeDonors}</div>
            <p className="text-xs text-muted-foreground">
              Active donors
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fund Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(fundBalance)}</div>
            <p className="text-xs text-muted-foreground">
              Available for allocation
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 80G Compliance Section */}
      <div>
        <h2 className="text-lg font-semibold mb-3">80G Compliance — FY {fyLabel}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">FY Total Donations</CardTitle>
              <IndianRupee className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(fyTotal)}</div>
              <p className="text-xs text-muted-foreground">{fyDonorCount} donors</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cash vs Non-Cash</CardTitle>
              <Coins className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">Cash</p>
                  <p className="text-sm font-bold text-green-600">{formatCurrency(fyCashTotal)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Non-Cash</p>
                  <p className="text-sm font-bold text-blue-600">{formatCurrency(fyNonCashTotal)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Compliance Checklist & Deadlines */}
      <ComplianceTracker
        fyLabel={fyLabel}
        fyStartYear={fyStartYear}
        receiptsIssued={fyDonations.length}
        registerCount={fyDonations.length}
      />

      {/* Action Button */}
      <div className="flex justify-end">
        <Button onClick={() => setAddOpen(true)} size="lg">
          <Plus className="h-4 w-4 mr-2" />
          Add Donation
        </Button>
      </div>
      <AddDonationDialog open={addOpen} onOpenChange={setAddOpen} />

      {/* Charts and Recent Donations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Donation Distribution by Type */}
        <Card>
          <CardHeader>
            <CardTitle>Cash vs Non-Cash Split (FY {fyLabel})</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={cashSplitData.length ? cashSplitData : typeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {(cashSplitData.length ? cashSplitData : typeData).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Donations Table */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Donations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Donor</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Type</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentDonations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground">
                        No donations yet
                      </TableCell>
                    </TableRow>
                  ) : (
                    recentDonations.map((donation) => {
                      if (!donation || !donation.donationId) return null;
                      return (
                        <TableRow key={donation.donationId} className="cursor-pointer" onClick={() => navigate(`/temple/donations/list`)}>
                          <TableCell className="text-sm">
                            {donation.date ? new Date(donation.date).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric'
                            }) : "—"}
                          </TableCell>
                          <TableCell className="font-medium">{getDonorName(donation.donorId) || "—"}</TableCell>
                          <TableCell className="font-semibold">{formatCurrency(donation.amount)}</TableCell>
                        <TableCell>
                          <Badge variant="outline" style={{ borderColor: donationTypeColors[getDonationType(donation)] || "#6b7280" }}>
                            {getDonationType(donation)}
                          </Badge>
                        </TableCell>
                      </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
            {recentDonations.length > 0 && (
              <div className="mt-4 text-center">
                <Button variant="outline" onClick={() => navigate("/temple/donations/list")}>
                  View All Donations
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
