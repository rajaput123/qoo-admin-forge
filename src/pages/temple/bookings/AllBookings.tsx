import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Download, Calendar, Clock, User, IndianRupee, MoreVertical, Eye, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSevaBookings } from "@/modules/sevas/sevaStore";
import BulkImportBookingsDialog from "./BulkImportBookingsDialog";
import { toast } from "sonner";

const MOCK_BOOKINGS = [
  { id: "BK-001234", devoteeName: "Ramesh Kumar", sevaName: "Abhishekam", date: "2026-06-10", time: "10:30 AM", amount: 1100, status: "Confirmed" as const, sourceModule: "Online" as const, paymentMethod: "Online" as const, paymentMode: "Razorpay", referenceNo: "ref-1", sevaCategory: "Special Sevas" },
  { id: "BK-001235", devoteeName: "Sita Devi", sevaName: "Archana", date: "2026-06-10", time: "11:00 AM", amount: 251, status: "Confirmed" as const, sourceModule: "Online" as const, paymentMethod: "Online" as const, paymentMode: "Razorpay", referenceNo: "ref-2", sevaCategory: "Daily Sevas" },
  { id: "BK-001236", devoteeName: "Krishna Murthy", sevaName: "VIP Darshan", date: "2026-06-10", time: "11:30 AM", amount: 500, status: "Completed" as const, sourceModule: "Counter" as const, paymentMethod: "Cash" as const, paymentMode: "Cash", referenceNo: "", sevaCategory: "VIP Darshan" },
  { id: "BK-001237", devoteeName: "Lakshmi N", sevaName: "Kalyanam", date: "2026-06-10", time: "12:00 PM", amount: 5000, status: "Confirmed" as const, sourceModule: "Online" as const, paymentMethod: "Online" as const, paymentMode: "Razorpay", referenceNo: "ref-3", sevaCategory: "Special Sevas" },
  { id: "BK-001238", devoteeName: "Venkat Rao", sevaName: "Sahasranamam", date: "2026-06-10", time: "02:00 PM", amount: 2500, status: "Confirmed" as const, sourceModule: "Online" as const, paymentMethod: "Online" as const, paymentMode: "Razorpay", referenceNo: "ref-4", sevaCategory: "Special Sevas" },
];

const AllBookings = () => {
  const liveBookings = useSevaBookings();
  const bookings: any[] = liveBookings.length > 0 ? liveBookings : MOCK_BOOKINGS;

  const [searchQuery, setSearchQuery] = useState("");
  const [timeFilter, setTimeFilter] = useState<"all" | "today" | "week">("all");
  const [frequencyFilter, setFrequencyFilter] = useState("all");
  const [importOpen, setImportOpen] = useState(false);

  // Stats calculation
  const stats = useMemo(() => {
    const todayStr = new Date().toISOString().split("T")[0];
    const totalRevenue = bookings.reduce((sum, b) => sum + b.amount, 0);
    const todayCount = bookings.filter(b => b.date === todayStr).length;
    const uniqueDevotees = new Set(bookings.map(b => b.devoteeName)).size;

    return [
      { label: "Total Bookings", value: bookings.length.toString(), icon: Calendar },
      { label: "Today's Bookings", value: todayCount.toString(), icon: Clock },
      { label: "Total Revenue", value: `₹${totalRevenue.toLocaleString("en-IN")}`, icon: IndianRupee },
      { label: "Unique Devotees", value: uniqueDevotees.toString(), icon: User },
    ];
  }, [bookings]);

  // Filter logic
  const filteredBookings = useMemo(() => {
    let filtered: any[] = bookings;

    if (timeFilter === "today") {
      const todayStr = new Date().toISOString().split("T")[0];
      filtered = filtered.filter(b => b.date === todayStr);
    } else if (timeFilter === "week") {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      filtered = filtered.filter(b => new Date(b.date) >= oneWeekAgo);
    }

    if (frequencyFilter !== "all") {
      filtered = filtered.filter(b =>
        (b.sevaCategory ?? "").toLowerCase().includes(frequencyFilter.toLowerCase())
      );
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        b =>
          b.devoteeName.toLowerCase().includes(query) ||
          b.sevaName.toLowerCase().includes(query) ||
          b.id.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [bookings, searchQuery, timeFilter, frequencyFilter]);

  const handleExport = () => {
    const headers = "ID,Devotee Name,Seva Name,Category,Date,Time,Amount,Payment Method,Payment Mode,Reference No,Status\n";
    const csvContent = filteredBookings.map(b => 
      `${b.id},"${b.devoteeName}","${b.sevaName}","${b.sevaCategory || ""}",${b.date},${b.time},${b.amount},${b.paymentMethod},"${b.paymentMode}","${b.referenceNo || ""}",${b.status}`
    ).join("\n");
    const blob = new Blob([headers + csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bookings_export_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Bookings exported to CSV");
  };

  const formatBookingDate = (dateStr: string, timeStr: string) => {
    try {
      const todayStr = new Date().toISOString().split("T")[0];
      if (dateStr === todayStr) {
        return `Today, ${timeStr}`;
      }
      const dateObj = new Date(dateStr);
      if (isNaN(dateObj.getTime())) return `${dateStr}, ${timeStr}`;
      const dateLabel = dateObj.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
      return `${dateLabel}, ${timeStr}`;
    } catch {
      return `${dateStr}, ${timeStr}`;
    }
  };

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-1">All Bookings</h1>
            <p className="text-muted-foreground">Manage seva and darshan bookings</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2" onClick={handleExport}>
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button className="gap-2 bg-amber-700 hover:bg-amber-800 text-white font-medium" onClick={() => setImportOpen(true)}>
              <Upload className="h-4 w-4" />
              Bulk Import
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {stats.map((stat) => (
            <div key={stat.label} className="glass-card rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <stat.icon className="h-4 w-4 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
              <p className="text-xl font-bold text-foreground">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search bookings..." 
              className="pl-9" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {/* Frequency filter */}
          <Select value={frequencyFilter} onValueChange={setFrequencyFilter}>
            <SelectTrigger className="w-[155px] bg-background">
              <SelectValue placeholder="Frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Frequencies</SelectItem>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="festival">Festival</SelectItem>
              <SelectItem value="special">Special</SelectItem>
              <SelectItem value="vip">VIP</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            variant={timeFilter === "today" ? "default" : "outline"}
            onClick={() => setTimeFilter(timeFilter === "today" ? "all" : "today")}
          >
            Today
          </Button>
          <Button 
            variant={timeFilter === "week" ? "default" : "outline"}
            onClick={() => setTimeFilter(timeFilter === "week" ? "all" : "week")}
          >
            This Week
          </Button>
          {(frequencyFilter !== "all" || timeFilter !== "all" || searchQuery) && (
            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground" onClick={() => { setFrequencyFilter("all"); setTimeFilter("all"); setSearchQuery(""); }}>
              Clear filters
            </Button>
          )}
        </div>

        {/* Bookings Table */}
        <div className="glass-card rounded-xl">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Devotee</TableHead>
                <TableHead>Seva</TableHead>
                <TableHead>Frequency / Type</TableHead>
                <TableHead>Date &amp; Time</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBookings.map((booking) => (
                <TableRow key={booking.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell className="font-medium">{booking.devoteeName}</TableCell>
                  <TableCell>{booking.sevaName}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-[10px] ${
                      booking.sevaCategory?.toLowerCase().includes("daily") ? "text-green-700 border-green-300 bg-green-50"
                      : booking.sevaCategory?.toLowerCase().includes("festival") ? "text-purple-700 border-purple-300 bg-purple-50"
                      : booking.sevaCategory?.toLowerCase().includes("special") ? "text-blue-700 border-blue-300 bg-blue-50"
                      : booking.sevaCategory?.toLowerCase().includes("vip") ? "text-amber-700 border-amber-300 bg-amber-50"
                      : "text-muted-foreground border-border"
                    }`}>
                      {booking.sevaCategory || "—"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      {formatBookingDate(booking.date, booking.time)}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">₹{booking.amount.toLocaleString("en-IN")}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {booking.sourceModule}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        booking.status === "Confirmed" 
                          ? "text-green-700 border-green-300 bg-green-50" 
                          : booking.status === "Completed"
                          ? "text-blue-700 border-blue-300 bg-blue-50"
                          : "text-amber-700 border-amber-300 bg-amber-50"
                      }`}
                    >
                      {booking.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredBookings.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No bookings found matching filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </motion.div>

      <BulkImportBookingsDialog open={importOpen} onOpenChange={setImportOpen} />
    </div>
  );
};

export default AllBookings;
