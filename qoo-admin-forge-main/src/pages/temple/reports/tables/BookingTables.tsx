import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Filter, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import PeriodFilter from "@/components/reports/PeriodFilter";
import { toast } from "sonner";

const tabs = [
  { key: "bookings", label: "Booking Records", columns: ["Booking ID", "Date", "Devotee", "Service", "Amount", "Slot", "Status"], rows: [
    ["BK-1001", "2024-03-15", "Ramesh K.", "Archana", "₹500", "9:00 AM", "Confirmed"],
    ["BK-1002", "2024-03-15", "Sita D.", "Abhishekam", "₹2,500", "10:00 AM", "Confirmed"],
    ["BK-1003", "2024-03-15", "Mohan L.", "Special Darshan", "₹1,000", "11:00 AM", "Completed"],
    ["BK-1004", "2024-03-15", "Priya R.", "Homam", "₹5,000", "6:00 AM", "Confirmed"],
    ["BK-1005", "2024-03-14", "Vijay S.", "Archana", "₹500", "9:30 AM", "Cancelled"],
    ["BK-1006", "2024-03-14", "Geetha M.", "Abhishekam", "₹2,500", "10:30 AM", "Completed"],
  ]},
  { key: "cancellations", label: "Cancellations & Refunds", columns: ["Booking ID", "Devotee", "Service", "Amount", "Cancel Date", "Refund", "Status"], rows: [
    ["BK-1005", "Vijay S.", "Archana", "₹500", "2024-03-14", "₹500", "Refunded"],
    ["BK-0998", "Mohan R.", "Abhishekam", "₹2,500", "2024-03-12", "₹2,000", "Partial Refund"],
    ["BK-0985", "Sita M.", "Homam", "₹5,000", "2024-03-10", "₹0", "No Refund"],
  ]},
  { key: "slots", label: "Slot Utilization", columns: ["Slot Time", "Service", "Capacity", "Booked", "Available", "Utilization", "Status"], rows: [
    ["5:00 AM", "Suprabhatam", "50", "48", "2", "96%", "Almost Full"],
    ["6:00 AM", "Homam", "20", "18", "2", "90%", "Active"],
    ["9:00 AM", "Archana", "100", "85", "15", "85%", "Active"],
    ["10:00 AM", "Abhishekam", "30", "28", "2", "93%", "Almost Full"],
    ["4:00 PM", "Special Darshan", "200", "120", "80", "60%", "Active"],
  ]},
  { key: "seva", label: "Seva Performance", columns: ["Seva", "Bookings", "Revenue", "Growth %", "Rev/Booking"], rows: [
    ["Suprabhatam", "450", "₹2,25,000", "+12%", "₹500"],
    ["Archana", "320", "₹32,000", "+8%", "₹100"],
    ["Abhishekam", "180", "₹3,60,000", "+15%", "₹2,000"],
    ["VIP Darshan", "95", "₹1,42,500", "+22%", "₹1,500"],
    ["Sahasranama", "75", "₹37,500", "-3%", "₹500"],
  ]},
];

const renderStatusBadge = (cell: string) => {
  if (["Completed", "Confirmed", "Refunded", "Active"].includes(cell)) return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">{cell}</Badge>;
  if (["Pending", "Partial Refund", "Almost Full"].includes(cell)) return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">{cell}</Badge>;
  if (["Cancelled", "No Refund"].includes(cell)) return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">{cell}</Badge>;
  return cell;
};

const BookingTables = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [period, setPeriod] = useState("month");
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "bookings";
  const tab = tabs.find(t => t.key === activeTab) || tabs[0];
  const filtered = tab.rows.filter(r => !searchTerm || r.some(c => c.toLowerCase().includes(searchTerm.toLowerCase())));

  const handleExport = () => {
    const csv = [tab.columns.join(","), ...filtered.map(r => r.map(c => `"${c}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = `${tab.key}.csv`; a.click(); URL.revokeObjectURL(url);
    toast.success(`${tab.label} exported`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-foreground">{tab.label}</h1>
            <p className="text-sm text-muted-foreground">Booking data records</p>
          </div>
        </div>
        <PeriodFilter value={period} onChange={setPeriod} />
      </div>
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm"><Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-9" /></div>
        <Badge variant="outline">{filtered.length} of {tab.rows.length}</Badge>
        <Button variant="outline" size="sm" onClick={handleExport} className="gap-2"><Download className="h-4 w-4" />Export</Button>
      </div>
      <Card><CardContent className="p-0"><div className="overflow-x-auto">
        <Table><TableHeader><TableRow>{tab.columns.map(c => <TableHead key={c} className="whitespace-nowrap font-semibold">{c}</TableHead>)}</TableRow></TableHeader>
        <TableBody>{filtered.map((row, i) => <TableRow key={i}>{row.map((cell, j) => <TableCell key={j} className="whitespace-nowrap">{renderStatusBadge(cell)}</TableCell>)}</TableRow>)}</TableBody></Table>
      </div></CardContent></Card>
    </div>
  );
};

export default BookingTables;
