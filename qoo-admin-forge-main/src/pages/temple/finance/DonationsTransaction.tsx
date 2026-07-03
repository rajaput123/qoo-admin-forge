import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Heart, Plus, ChevronUp, Search, Filter, Download } from "lucide-react";
import { toast } from "sonner";
import { exportToCSV } from "@/utils/exportCSV";
import FinanceDateFilter, { type DateRange } from "@/components/finance/FinanceDateFilter";

interface Donation {
  id: string;
  date: string;
  donorName: string;
  donorPhone: string;
  type: string;
  amount: number;
  paymentMode: string;
  linkedTo: string;
  linkedLabel: string;
  receiptNo: string;
  status: "Receipted" | "Pending";
}

const dummyDonations: Donation[] = [
  { id: "DON-001", date: "2025-03-28", donorName: "Ramesh Kumar", donorPhone: "9876543210", type: "General", amount: 51000, paymentMode: "UPI", linkedTo: "", linkedLabel: "", receiptNo: "RCP-2025-0345", status: "Receipted" },
  { id: "DON-002", date: "2025-03-27", donorName: "Sri Trust Foundation", donorPhone: "9845012345", type: "Event-based", amount: 100000, paymentMode: "Bank Transfer", linkedTo: "event", linkedLabel: "Brahmotsavam 2025", receiptNo: "RCP-2025-0344", status: "Receipted" },
  { id: "DON-003", date: "2025-03-26", donorName: "Venkat Reddy", donorPhone: "9912345678", type: "Project-based", amount: 200000, paymentMode: "Cheque", linkedTo: "project", linkedLabel: "Gopuram Renovation", receiptNo: "RCP-2025-0343", status: "Receipted" },
  { id: "DON-004", date: "2025-03-26", donorName: "Srinivas & Family", donorPhone: "9801234567", type: "Physical (Stock/Asset)", amount: 35000, paymentMode: "In-Kind", linkedTo: "", linkedLabel: "", receiptNo: "RCP-2025-0342", status: "Receipted" },
  { id: "DON-005", date: "2025-03-25", donorName: "Anonymous", donorPhone: "", type: "Hundi", amount: 85000, paymentMode: "Cash", linkedTo: "", linkedLabel: "", receiptNo: "", status: "Pending" },
  { id: "DON-006", date: "2025-03-24", donorName: "Lakshmi Prasad", donorPhone: "9876001234", type: "General", amount: 21000, paymentMode: "Cash", linkedTo: "", linkedLabel: "", receiptNo: "RCP-2025-0341", status: "Receipted" },
];

const donationTypes = ["General", "Event-based", "Project-based", "Physical (Stock/Asset)", "Hundi", "Corpus"];
const formatCurrency = (val: number) => `₹${val.toLocaleString("en-IN")}`;

const DonationsTransaction = () => {
  const [donations] = useState<Donation[]>(dummyDonations);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [dateRange, setDateRange] = useState<DateRange>({ from: null, to: null });

  const filtered = donations.filter(d => {
    if (typeFilter !== "all" && d.type !== typeFilter) return false;
    if (searchTerm && !Object.values(d).some(v => String(v).toLowerCase().includes(searchTerm.toLowerCase()))) return false;
    if (dateRange.from || dateRange.to) {
      const dt = new Date(d.date);
      if (dateRange.from && dt < dateRange.from) return false;
      if (dateRange.to && dt > dateRange.to) return false;
    }
    return true;
  });

  const totalFiltered = filtered.reduce((s, d) => s + d.amount, 0);
  const totalDonations = donations.reduce((s, d) => s + d.amount, 0);
  const receiptedCount = donations.filter(d => d.status === "Receipted").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Heart className="h-6 w-6 text-green-600" /> Donations
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">Track all donations — cash, online, in-kind & hundi</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          {showForm ? <ChevronUp className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showForm ? "Close" : "Record Donation"}
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <span className="text-[11px] text-muted-foreground">Total Donations</span>
            <p className="text-lg font-bold text-green-700">{formatCurrency(totalDonations)}</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <span className="text-[11px] text-muted-foreground">Total Donors</span>
            <p className="text-lg font-bold">{donations.length}</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-primary">
          <CardContent className="p-4">
            <span className="text-[11px] text-muted-foreground">Receipted</span>
            <p className="text-lg font-bold">{receiptedCount} / {donations.length}</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="p-4">
            <span className="text-[11px] text-muted-foreground">Pending Receipts</span>
            <p className="text-lg font-bold text-amber-600">{donations.length - receiptedCount}</p>
          </CardContent>
        </Card>
      </div>

      {/* Form */}
      {showForm && (
        <Card className="border-green-200 bg-green-50/30">
          <CardContent className="p-5">
            <h3 className="font-semibold text-sm mb-4">New Donation Entry</h3>
            <form onSubmit={(e) => { e.preventDefault(); setShowForm(false); toast.success("Donation recorded. Ledger updated."); }} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div><Label>Donor Name *</Label><Input placeholder="Enter donor name" className="mt-1 bg-background" required /></div>
                <div><Label>Contact Number</Label><Input placeholder="Phone number" className="mt-1 bg-background" /></div>
                <div><Label>Date *</Label><Input type="date" defaultValue={new Date().toISOString().split("T")[0]} className="mt-1 bg-background" required /></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Donation Type *</Label>
                  <Select><SelectTrigger className="mt-1 bg-background"><SelectValue placeholder="Select type" /></SelectTrigger>
                    <SelectContent>{donationTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label>Amount (₹) *</Label><Input type="number" placeholder="Enter amount" className="mt-1 bg-background" required /></div>
                <div>
                  <Label>Payment Mode *</Label>
                  <Select><SelectTrigger className="mt-1 bg-background"><SelectValue placeholder="Select mode" /></SelectTrigger>
                    <SelectContent>{["Cash", "UPI", "Bank Transfer", "Cheque", "Online", "In-Kind"].map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Link to Event / Project</Label>
                  <Select><SelectTrigger className="mt-1 bg-background"><SelectValue placeholder="None" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="brahmotsavam">Brahmotsavam 2025</SelectItem>
                      <SelectItem value="gopuram">Gopuram Renovation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div><Label>Notes</Label><Textarea placeholder="Additional notes..." className="mt-1 bg-background" rows={1} /></div>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
                <Button type="submit" className="gap-2"><Plus className="h-4 w-4" /> Record Donation</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search donor, type..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-9" />
        </div>
        <FinanceDateFilter onDateRangeChange={setDateRange} />
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[180px]"><Filter className="h-3.5 w-3.5 mr-1.5" /><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {donationTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
          </SelectContent>
        </Select>
        <Badge variant="outline">{filtered.length} donations · {formatCurrency(totalFiltered)}</Badge>
        <Button variant="outline" size="sm" className="gap-1.5" onClick={() => {
          exportToCSV("donations",
            ["ID", "Donor", "Type", "Amount", "Date", "Payment Mode", "Status", "Receipt No"],
            filtered.map(d => [d.id, d.donorName, d.type, String(d.amount), d.date, d.paymentMode, d.status, d.receiptNo])
          );
          toast.success(`Exported ${filtered.length} donations`);
        }}>
          <Download className="h-3.5 w-3.5" /> Export
        </Button>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Date</TableHead>
                  <TableHead className="text-xs">Donor</TableHead>
                  <TableHead className="text-xs">Type</TableHead>
                  <TableHead className="text-xs">Mode</TableHead>
                  <TableHead className="text-xs">Linked To</TableHead>
                  <TableHead className="text-xs text-right">Amount</TableHead>
                  <TableHead className="text-xs text-center">Receipt</TableHead>
                  <TableHead className="text-xs text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(d => (
                  <TableRow key={d.id}>
                    <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(d.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                    </TableCell>
                    <TableCell className="text-xs font-medium">{d.donorName}</TableCell>
                    <TableCell><Badge variant="secondary" className="text-[10px]">{d.type}</Badge></TableCell>
                    <TableCell><Badge variant="outline" className="text-[10px]">{d.paymentMode}</Badge></TableCell>
                    <TableCell className="text-xs">{d.linkedLabel || "—"}</TableCell>
                    <TableCell className="text-right font-medium text-green-700 text-sm">+{formatCurrency(d.amount)}</TableCell>
                    <TableCell className="text-center text-xs font-mono text-primary">{d.receiptNo || "—"}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className={`text-[10px] ${d.status === "Receipted" ? "bg-green-50 text-green-700 border-green-200" : "bg-amber-50 text-amber-700 border-amber-200"}`}>
                        {d.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DonationsTransaction;
