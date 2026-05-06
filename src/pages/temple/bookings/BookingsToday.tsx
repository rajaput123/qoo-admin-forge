import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarCheck, IndianRupee, Store, Globe, Clock, AlertCircle, Image, ArrowLeft, Printer, MessageSquare } from "lucide-react";

const todayBookings = [
  { id: "1", bookingId: "BK-0001", time: "5:30 AM", offering: "Suprabhatam", type: "Ritual" as const, structure: "Main Temple", devotee: "Ramesh Kumar", quantity: 2, amount: 1000, source: "Online" as const, paymentStatus: "Paid", bookingStatus: "Confirmed", phone: "+91 98765 43210", email: "ramesh@email.com", gothram: "Bharadwaja", nakshatra: "Rohini", priest: "Pandit Sharma", paymentMode: "UPI", txnId: "TXN-98765", images: ["https://images.unsplash.com/photo-1600693577615-9f3a0f7a16ba?w=400"], notes: "Family prayer", createdAt: "2026-02-08" },
  { id: "2", bookingId: "BK-0002", time: "7:00 AM", offering: "Archana", type: "Ritual" as const, structure: "Padmavathi Shrine", devotee: "Lakshmi Devi", quantity: 1, amount: 100, source: "Counter" as const, paymentStatus: "Paid", bookingStatus: "Completed", phone: "+91 87654 32109", email: "", gothram: "Kashyapa", nakshatra: "Ashwini", priest: "Pandit Rao", paymentMode: "Cash", txnId: "CSH-001", images: [], notes: "", createdAt: "2026-02-09" },
  { id: "3", bookingId: "BK-0003", time: "9:00 AM", offering: "Abhishekam", type: "Ritual" as const, structure: "Main Temple", devotee: "Suresh Reddy", quantity: 1, amount: 2000, source: "Online" as const, paymentStatus: "Paid", bookingStatus: "Confirmed", phone: "+91 76543 21098", email: "suresh@email.com", gothram: "Vasishta", nakshatra: "Pushya", priest: "Pandit Kumar", paymentMode: "Card", txnId: "TXN-54321", images: [], notes: "", createdAt: "2026-02-07" },
  { id: "4", bookingId: "BK-0004", time: "6:00 AM", offering: "Morning Darshan", type: "Darshan" as const, structure: "Main Temple", devotee: "Priya Sharma", quantity: 4, amount: 0, source: "Online" as const, paymentStatus: "Paid", bookingStatus: "Completed", phone: "+91 65432 10987", email: "priya@email.com", gothram: "", nakshatra: "", priest: "—", paymentMode: "Free", txnId: "—", images: [], notes: "Group visit", createdAt: "2026-02-08" },
  { id: "5", bookingId: "BK-0005", time: "8:00 AM", offering: "VIP Darshan", type: "Darshan" as const, structure: "Main Temple", devotee: "Anand Verma", quantity: 2, amount: 600, source: "Counter" as const, paymentStatus: "Paid", bookingStatus: "Confirmed", phone: "+91 54321 09876", email: "", gothram: "", nakshatra: "", priest: "—", paymentMode: "UPI", txnId: "CSH-002", images: [], notes: "", createdAt: "2026-02-09" },
  { id: "6", bookingId: "BK-0006", time: "11:00 AM", offering: "Sahasranama", type: "Ritual" as const, structure: "Varadaraja Shrine", devotee: "Meena Iyer", quantity: 1, amount: 1500, source: "Admin" as const, paymentStatus: "Pending", bookingStatus: "Pending Payment", phone: "+91 43210 98765", email: "meena@email.com", gothram: "Atri", nakshatra: "Swati", priest: "Pandit Iyer", paymentMode: "—", txnId: "—", images: [], notes: "Admin manual booking", createdAt: "2026-02-09" },
  { id: "7", bookingId: "BK-0007", time: "4:00 PM", offering: "Evening Darshan", type: "Darshan" as const, structure: "Main Temple", devotee: "Vijay Nair", quantity: 3, amount: 0, source: "Online" as const, paymentStatus: "Paid", bookingStatus: "Confirmed", phone: "+91 32109 87654", email: "vijay@email.com", gothram: "", nakshatra: "", priest: "—", paymentMode: "Free", txnId: "—", images: [], notes: "", createdAt: "2026-02-08" },
];

const statusColor = (s: string) => {
  if (s === "Confirmed") return "default";
  if (s === "Completed") return "secondary";
  if (s === "Cancelled") return "destructive";
  if (s === "Pending Payment") return "outline";
  return "outline";
};

const sourceIcon = (s: string) => s === "Online" ? "🌐" : s === "Counter" ? "🏪" : "👤";

const BookingsToday = () => {
  const [filterType, setFilterType] = useState("all");
  const [filterSource, setFilterSource] = useState("all");
  const [viewing, setViewing] = useState<typeof todayBookings[0] | null>(null);

  const filtered = todayBookings.filter(b => {
    if (filterType !== "all" && b.type !== filterType) return false;
    if (filterSource !== "all" && b.source !== filterSource) return false;
    return true;
  });

  const totalBookings = todayBookings.length;
  const onlineCount = todayBookings.filter(b => b.source === "Online").length;
  const counterCount = todayBookings.filter(b => b.source === "Counter").length;
  const totalRevenue = todayBookings.reduce((a, b) => a + b.amount, 0);
  const pendingPayments = todayBookings.filter(b => b.paymentStatus === "Pending").length;

  const kpis = [
    { label: "Total Bookings", value: totalBookings.toString(), icon: CalendarCheck, description: "All sources combined" },
    { label: "Online Bookings", value: onlineCount.toString(), icon: Globe, description: "App & website bookings" },
    { label: "Counter Bookings", value: counterCount.toString(), icon: Store, description: "Seva counter bookings" },
    { label: "Revenue Today", value: `₹${totalRevenue.toLocaleString()}`, icon: IndianRupee, description: "Confirmed payments" },
    { label: "Pending Payments", value: pendingPayments.toString(), icon: AlertCircle, description: "Awaiting payment" },
  ];

  // Inline detail view
  if (viewing) {
    const b = viewing;
    return (
      <div className="p-6 space-y-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => setViewing(null)}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-semibold tracking-tight">{b.bookingId}</h1>
                  <Badge variant={b.paymentStatus === "Paid" ? "default" : "secondary"}>{b.paymentStatus}</Badge>
                  <Badge variant={statusColor(b.bookingStatus) as any}>{b.bookingStatus}</Badge>
                </div>
                <p className="text-muted-foreground text-sm mt-1">{b.offering} · {b.structure} · {sourceIcon(b.source)} {b.source}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2"><Printer className="h-4 w-4" />Print Receipt</Button>
              <Button variant="outline" size="sm" className="gap-2"><MessageSquare className="h-4 w-4" />SMS</Button>
              {b.bookingStatus === "Confirmed" && <Button size="sm">Mark Completed</Button>}
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="booking" className="space-y-4">
            <div className="border-b border-border">
              <TabsList className="w-full justify-start border-b-0 rounded-none h-auto p-0 bg-transparent gap-0">
                <TabsTrigger value="booking" className="rounded-none border-b-2 border-transparent data-[state=active]:border-amber-700 data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:font-medium px-4 py-2 text-sm text-muted-foreground">
                  Booking Details
                </TabsTrigger>
                <TabsTrigger value="devotee" className="rounded-none border-b-2 border-transparent data-[state=active]:border-amber-700 data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:font-medium px-4 py-2 text-sm text-muted-foreground">
                  Devotee Info
                </TabsTrigger>
                <TabsTrigger value="payment" className="rounded-none border-b-2 border-transparent data-[state=active]:border-amber-700 data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:font-medium px-4 py-2 text-sm text-muted-foreground">
                  Payment
                </TabsTrigger>
                <TabsTrigger value="gallery" className="rounded-none border-b-2 border-transparent data-[state=active]:border-amber-700 data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:font-medium px-4 py-2 text-sm text-muted-foreground">
                  Gallery
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="booking" className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Booking Information</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-8 text-sm">
                  <div><span className="text-muted-foreground">Booking ID:</span> <span className="ml-2 font-medium font-mono text-xs">{b.bookingId}</span></div>
                  <div><span className="text-muted-foreground">Source:</span> <span className="ml-2">{sourceIcon(b.source)} {b.source}</span></div>
                  <div><span className="text-muted-foreground">Offering:</span> <span className="ml-2 font-medium">{b.offering}</span></div>
                  <div><span className="text-muted-foreground">Type:</span> <span className="ml-2"><Badge variant={b.type === "Ritual" ? "default" : "secondary"}>{b.type}</Badge></span></div>
                  <div><span className="text-muted-foreground">Structure:</span> <span className="ml-2 font-medium">{b.structure}</span></div>
                  <div><span className="text-muted-foreground">Time:</span> <span className="ml-2 font-medium">{b.time}</span></div>
                  <div><span className="text-muted-foreground">Quantity:</span> <span className="ml-2 font-medium">{b.quantity}</span></div>
                  <div><span className="text-muted-foreground">Priest:</span> <span className="ml-2 font-medium">{b.priest}</span></div>
                </div>
              </div>
              {b.notes && (
                <>
                  <hr className="border-border" />
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Notes</h3>
                    <p className="text-sm text-muted-foreground">{b.notes}</p>
                  </div>
                </>
              )}
            </TabsContent>

            <TabsContent value="devotee" className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Devotee Information</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-8 text-sm">
                  <div><span className="text-muted-foreground">Name:</span> <span className="ml-2 font-medium">{b.devotee}</span></div>
                  <div><span className="text-muted-foreground">Phone:</span> <span className="ml-2 font-medium">{b.phone}</span></div>
                  <div><span className="text-muted-foreground">Email:</span> <span className="ml-2 font-medium">{b.email || "—"}</span></div>
                  {b.gothram && <div><span className="text-muted-foreground">Gothram:</span> <span className="ml-2 font-medium">{b.gothram}</span></div>}
                  {b.nakshatra && <div><span className="text-muted-foreground">Nakshatra:</span> <span className="ml-2 font-medium">{b.nakshatra}</span></div>}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="payment" className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Payment Details</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-8 text-sm">
                  <div><span className="text-muted-foreground">Amount:</span> <span className="ml-2 font-medium text-lg">{b.amount > 0 ? `₹${b.amount}` : "Free"}</span></div>
                  <div><span className="text-muted-foreground">Payment Mode:</span> <span className="ml-2 font-medium">{b.paymentMode}</span></div>
                  <div><span className="text-muted-foreground">Transaction ID:</span> <span className="ml-2 font-mono text-xs">{b.txnId}</span></div>
                  <div><span className="text-muted-foreground">Booked On:</span> <span className="ml-2 font-medium">{b.createdAt}</span></div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="gallery" className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Images</h3>
                {b.images && b.images.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {b.images.map((img, i) => (
                      <img key={i} src={img} alt="" className="w-full h-48 object-cover rounded-lg border" />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center py-12 text-muted-foreground">
                    <Image className="h-12 w-12 mb-2 opacity-30" />
                    <p className="text-sm">No images attached</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">Today's Bookings</h1>
          <p className="text-muted-foreground">Real-time booking activity for {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          {kpis.map((kpi, i) => (
            <Card key={i} className="group hover:shadow-md transition-all duration-200">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-muted group-hover:bg-primary group-hover:shadow-lg transition-all duration-200">
                    <kpi.icon className="h-5 w-5 text-muted-foreground group-hover:text-primary-foreground transition-colors duration-200" />
                  </div>
                </div>
                <p className="text-xl font-bold">{kpi.value}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{kpi.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[140px] bg-background"><SelectValue /></SelectTrigger>
            <SelectContent className="bg-popover"><SelectItem value="all">All Types</SelectItem><SelectItem value="Ritual">Ritual</SelectItem><SelectItem value="Darshan">Darshan</SelectItem></SelectContent>
          </Select>
          <Select value={filterSource} onValueChange={setFilterSource}>
            <SelectTrigger className="w-[140px] bg-background"><SelectValue /></SelectTrigger>
            <SelectContent className="bg-popover"><SelectItem value="all">All Sources</SelectItem><SelectItem value="Online">Online</SelectItem><SelectItem value="Counter">Counter</SelectItem><SelectItem value="Admin">Admin</SelectItem></SelectContent>
          </Select>
          <Badge variant="secondary" className="ml-auto">{filtered.length} bookings</Badge>
        </div>

        {/* Unified Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Offering</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Structure</TableHead>
                  <TableHead>Devotee</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead className="text-center">Qty</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(b => (
                  <TableRow key={b.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setViewing(b)}>
                    <TableCell className="font-medium text-sm">{b.time}</TableCell>
                    <TableCell className="font-medium">{b.offering}</TableCell>
                    <TableCell><Badge variant={b.type === "Ritual" ? "default" : "secondary"}>{b.type}</Badge></TableCell>
                    <TableCell className="text-muted-foreground text-sm">{b.structure}</TableCell>
                    <TableCell>{b.devotee}</TableCell>
                    <TableCell><span className="text-sm">{sourceIcon(b.source)} {b.source}</span></TableCell>
                    <TableCell className="text-center">{b.quantity}</TableCell>
                    <TableCell className="text-right font-medium">{b.amount > 0 ? `₹${b.amount}` : "Free"}</TableCell>
                    <TableCell><Badge variant={b.paymentStatus === "Paid" ? "default" : b.paymentStatus === "Pending" ? "secondary" : "outline"}>{b.paymentStatus}</Badge></TableCell>
                    <TableCell><Badge variant={statusColor(b.bookingStatus) as any}>{b.bookingStatus}</Badge></TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow><TableCell colSpan={10} className="text-center py-8 text-muted-foreground">No bookings match filters</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>


    </div>
  );
};

export default BookingsToday;
