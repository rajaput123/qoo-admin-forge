import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpRight, Plus, ChevronUp, Filter, Search, Download, IndianRupee, Heart, ShoppingBag, Sparkles, Package } from "lucide-react";
import { toast } from "sonner";
import { exportToCSV } from "@/utils/exportCSV";
import FinanceDateFilter, { type DateRange } from "@/components/finance/FinanceDateFilter";

interface IncomeEntry {
  id: string;
  date: string;
  sourceType: string;
  subType: string;
  amount: number;
  paymentMode: string;
  donor: string;
  linkedTo: string;
  linkedLabel: string;
  notes: string;
  receiptNo: string;
  status: "Recorded" | "Receipted";
}

const sourceTypes: Record<string, string[]> = {
  "Donation": ["General", "Event-based", "Project-based", "Physical (Stock/Asset)"],
  "Seva Booking": ["Abhishekam", "Archana", "Homam", "Sahasranama", "Special Pooja"],
  "Sales": ["Prasadam", "Books", "Pooja Items", "CD/DVD", "Souvenirs"],
  "Hundi Collection": ["Main Hundi", "Branch Hundi", "Online Hundi"],
  "Rental Income": ["Hall Booking", "Room Booking", "Stall Rent"],
  "Other Income": ["Interest", "Miscellaneous"],
};

const dummyIncome: IncomeEntry[] = [
  { id: "INC-001", date: "2025-03-28", sourceType: "Donation", subType: "General", amount: 51000, paymentMode: "UPI", donor: "Ramesh Kumar", linkedTo: "", linkedLabel: "", notes: "Monthly contribution", receiptNo: "RCP-2025-0345", status: "Receipted" },
  { id: "INC-002", date: "2025-03-28", sourceType: "Seva Booking", subType: "Abhishekam", amount: 5000, paymentMode: "Cash", donor: "Lakshmi Devi", linkedTo: "", linkedLabel: "", notes: "", receiptNo: "RCP-2025-0346", status: "Receipted" },
  { id: "INC-003", date: "2025-03-27", sourceType: "Donation", subType: "Event-based", amount: 100000, paymentMode: "Bank Transfer", donor: "Sri Trust Foundation", linkedTo: "event", linkedLabel: "Brahmotsavam 2025", notes: "Towards Brahmotsavam", receiptNo: "RCP-2025-0344", status: "Receipted" },
  { id: "INC-004", date: "2025-03-27", sourceType: "Hundi Collection", subType: "Main Hundi", amount: 85000, paymentMode: "Cash", donor: "Hundi Count", linkedTo: "", linkedLabel: "", notes: "Morning collection", receiptNo: "", status: "Recorded" },
  { id: "INC-005", date: "2025-03-26", sourceType: "Sales", subType: "Prasadam", amount: 12500, paymentMode: "Cash", donor: "Counter Sales", linkedTo: "", linkedLabel: "", notes: "Laddu + Pulihora", receiptNo: "", status: "Recorded" },
  { id: "INC-006", date: "2025-03-26", sourceType: "Donation", subType: "Project-based", amount: 200000, paymentMode: "Cheque", donor: "Venkat Reddy", linkedTo: "project", linkedLabel: "Gopuram Renovation", notes: "CHQ #456789", receiptNo: "RCP-2025-0343", status: "Receipted" },
  { id: "INC-007", date: "2025-03-25", sourceType: "Donation", subType: "Physical (Stock/Asset)", amount: 35000, paymentMode: "In-Kind", donor: "Srinivas & Family", linkedTo: "", linkedLabel: "", notes: "50kg Ghee + 20kg Rice", receiptNo: "RCP-2025-0342", status: "Receipted" },
];

const formatCurrency = (val: number) => `₹${val.toLocaleString("en-IN")}`;

const IncomeManagement = () => {
  const [entries, setEntries] = useState<IncomeEntry[]>(dummyIncome);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSource, setFilterSource] = useState("all");
  const [dateRange, setDateRange] = useState<DateRange>({ from: null, to: null });

  // Form state
  const [sourceType, setSourceType] = useState("");
  const [subType, setSubType] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentMode, setPaymentMode] = useState("");
  const [donor, setDonor] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [linkType, setLinkType] = useState("");
  const [linkedModule, setLinkedModule] = useState("");
  const [notes, setNotes] = useState("");

  const subTypes = sourceType ? sourceTypes[sourceType] || [] : [];

  const resetForm = () => {
    setSourceType(""); setSubType(""); setAmount(""); setPaymentMode("");
    setDonor(""); setDate(new Date().toISOString().split("T")[0]);
    setLinkType(""); setLinkedModule(""); setNotes("");
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceType || !subType || !amount || !paymentMode || !date) {
      toast.error("Fill all required fields"); return;
    }
    const entry: IncomeEntry = {
      id: `INC-${String(entries.length + 1).padStart(3, "0")}`,
      date, sourceType, subType, amount: parseFloat(amount), paymentMode,
      donor, linkedTo: linkType, linkedLabel: linkedModule, notes,
      receiptNo: "", status: "Recorded",
    };
    setEntries(prev => [entry, ...prev]);
    resetForm(); setShowForm(false);
    toast.success("Income entry recorded. Ledger updated automatically.");
  };

  const filtered = entries.filter(e => {
    if (filterSource !== "all" && e.sourceType !== filterSource) return false;
    if (searchTerm && !Object.values(e).some(v => String(v).toLowerCase().includes(searchTerm.toLowerCase()))) return false;
    if (dateRange.from || dateRange.to) {
      const d = new Date(e.date);
      if (dateRange.from && d < dateRange.from) return false;
      if (dateRange.to && d > dateRange.to) return false;
    }
    return true;
  });

  const totalFiltered = filtered.reduce((s, e) => s + e.amount, 0);

  // Summary KPIs
  const todayTotal = entries.filter(e => e.date === new Date().toISOString().split("T")[0]).reduce((s, e) => s + e.amount, 0);
  const donationTotal = entries.filter(e => e.sourceType === "Donation").reduce((s, e) => s + e.amount, 0);
  const sevaTotal = entries.filter(e => e.sourceType === "Seva Booking").reduce((s, e) => s + e.amount, 0);
  const salesTotal = entries.filter(e => e.sourceType === "Sales" || e.sourceType === "Hundi Collection").reduce((s, e) => s + e.amount, 0);

  const getSourceIcon = (src: string) => {
    if (src === "Donation") return <Heart className="h-3.5 w-3.5 text-green-600" />;
    if (src === "Seva Booking") return <Sparkles className="h-3.5 w-3.5 text-primary" />;
    if (src === "Sales") return <ShoppingBag className="h-3.5 w-3.5 text-blue-600" />;
    if (src === "Hundi Collection") return <IndianRupee className="h-3.5 w-3.5 text-amber-600" />;
    if (src.includes("Physical")) return <Package className="h-3.5 w-3.5 text-teal-600" />;
    return <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <ArrowUpRight className="h-6 w-6 text-green-600" /> Income Management
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">Record & track all temple income sources</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          {showForm ? <ChevronUp className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showForm ? "Close" : "Record Income"}
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Today's Income", value: todayTotal, color: "border-l-green-500", icon: IndianRupee },
          { label: "Donations", value: donationTotal, color: "border-l-primary", icon: Heart },
          { label: "Seva Bookings", value: sevaTotal, color: "border-l-blue-500", icon: Sparkles },
          { label: "Sales & Hundi", value: salesTotal, color: "border-l-amber-500", icon: ShoppingBag },
        ].map(kpi => (
          <Card key={kpi.label} className={`border-l-4 ${kpi.color}`}>
            <CardContent className="p-4">
              <div className="flex items-center gap-1.5 mb-1">
                <kpi.icon className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-[11px] text-muted-foreground font-medium">{kpi.label}</span>
              </div>
              <p className="text-lg font-bold">{formatCurrency(kpi.value)}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Entry Form */}
      {showForm && (
        <Card className="border-green-200 bg-green-50/30">
          <CardHeader className="pb-3"><CardTitle className="text-base">New Income Entry</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Source Type *</Label>
                  <Select value={sourceType} onValueChange={v => { setSourceType(v); setSubType(""); }}>
                    <SelectTrigger className="mt-1 bg-background"><SelectValue placeholder="Select source" /></SelectTrigger>
                    <SelectContent>
                      {Object.keys(sourceTypes).map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Sub-type *</Label>
                  <Select value={subType} onValueChange={setSubType} disabled={!sourceType}>
                    <SelectTrigger className="mt-1 bg-background"><SelectValue placeholder={sourceType ? "Select sub-type" : "Pick source first"} /></SelectTrigger>
                    <SelectContent>
                      {subTypes.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Date *</Label>
                  <Input type="date" value={date} onChange={e => setDate(e.target.value)} className="mt-1 bg-background" required />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Amount (₹) *</Label>
                  <Input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Enter amount" className="mt-1 bg-background" required />
                </div>
                <div>
                  <Label>Payment Mode *</Label>
                  <Select value={paymentMode} onValueChange={setPaymentMode}>
                    <SelectTrigger className="mt-1 bg-background"><SelectValue placeholder="Select mode" /></SelectTrigger>
                    <SelectContent>
                      {["Cash", "UPI", "Bank Transfer", "Cheque", "Online", "In-Kind"].map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Donor / Customer</Label>
                  <Input value={donor} onChange={e => setDonor(e.target.value)} placeholder="Name" className="mt-1 bg-background" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Link to Event / Project</Label>
                  <Select value={linkType} onValueChange={v => { setLinkType(v); setLinkedModule(""); }}>
                    <SelectTrigger className="mt-1 bg-background"><SelectValue placeholder="None" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="event">Event</SelectItem>
                      <SelectItem value="project">Project</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {linkType && linkType !== "none" && (
                  <div>
                    <Label>Select {linkType}</Label>
                    <Select value={linkedModule} onValueChange={setLinkedModule}>
                      <SelectTrigger className="mt-1 bg-background"><SelectValue placeholder={`Select ${linkType}`} /></SelectTrigger>
                      <SelectContent>
                        {linkType === "event"
                          ? [{ v: "Brahmotsavam 2025" }, { v: "Maha Shivaratri 2025" }, { v: "Navaratri 2025" }].map(o => <SelectItem key={o.v} value={o.v}>{o.v}</SelectItem>)
                          : [{ v: "Gopuram Renovation" }, { v: "Kitchen Upgrade" }, { v: "Parking Expansion" }].map(o => <SelectItem key={o.v} value={o.v}>{o.v}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div className={linkType && linkType !== "none" ? "" : "md:col-span-2"}>
                  <Label>Notes</Label>
                  <Textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Additional notes..." className="mt-1 bg-background" rows={1} />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => { resetForm(); setShowForm(false); }}>Cancel</Button>
                <Button type="submit" className="gap-2"><Plus className="h-4 w-4" /> Record Income</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Filter & Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by donor, type..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-9" />
        </div>
        <FinanceDateFilter onDateRangeChange={setDateRange} />
        <Select value={filterSource} onValueChange={setFilterSource}>
          <SelectTrigger className="w-[180px]"><Filter className="h-3.5 w-3.5 mr-1.5" /><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sources</SelectItem>
            {Object.keys(sourceTypes).map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <Badge variant="outline">{filtered.length} entries · {formatCurrency(totalFiltered)}</Badge>
        <Button variant="outline" size="sm" className="gap-1.5" onClick={() => {
          exportToCSV("income",
            ["ID", "Date", "Source", "Sub-Type", "Amount", "Payment Mode", "Donor", "Status", "Receipt No"],
            filtered.map(e => [e.id, e.date, e.sourceType, e.subType, String(e.amount), e.paymentMode, e.donor, e.status, e.receiptNo])
          );
          toast.success(`Exported ${filtered.length} income entries`);
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
                  <TableHead className="text-xs">Source</TableHead>
                  <TableHead className="text-xs">Sub-type</TableHead>
                  <TableHead className="text-xs">Donor / Customer</TableHead>
                  <TableHead className="text-xs">Mode</TableHead>
                  <TableHead className="text-xs">Linked To</TableHead>
                  <TableHead className="text-xs text-right">Amount</TableHead>
                  <TableHead className="text-xs text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(entry => (
                  <TableRow key={entry.id}>
                    <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(entry.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        {getSourceIcon(entry.sourceType)}
                        <span className="text-xs font-medium">{entry.sourceType}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs">{entry.subType}</TableCell>
                    <TableCell className="text-xs">{entry.donor || "—"}</TableCell>
                    <TableCell><Badge variant="secondary" className="text-[10px]">{entry.paymentMode}</Badge></TableCell>
                    <TableCell className="text-xs">
                      {entry.linkedLabel ? (
                        <span className="text-primary">{entry.linkedLabel}</span>
                      ) : "—"}
                    </TableCell>
                    <TableCell className="text-right font-medium text-green-700 text-sm whitespace-nowrap">
                      +{formatCurrency(entry.amount)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className={entry.status === "Receipted" ? "bg-green-50 text-green-700 border-green-200 text-[10px]" : "bg-amber-50 text-amber-700 border-amber-200 text-[10px]"}>
                        {entry.status}
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

export default IncomeManagement;
