import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, Search, Download, ChevronLeft, ChevronRight, Image, FileText, Printer } from "lucide-react";
import { toast } from "sonner";

interface Booking {
  id: string;
  bookingId: string;
  offering: string;
  type: "Ritual" | "Darshan";
  structure: string;
  devotee: string;
  devoteePhone: string;
  devoteeEmail: string;
  date: string;
  time: string;
  quantity: number;
  amount: number;
  paymentStatus: "Paid" | "Pending" | "Refunded";
  bookingStatus: "Confirmed" | "Cancelled" | "Completed" | "No Show";
  gothram: string;
  nakshatra: string;
  priest: string;
  images: string[];
  notes: string;
  createdAt: string;
}

const mockBookings: Booking[] = [
  { id: "1", bookingId: "BK-2026-0001", offering: "Suprabhatam", type: "Ritual", structure: "Main Temple", devotee: "Ramesh Kumar", devoteePhone: "+91 98765 43210", devoteeEmail: "ramesh@email.com", date: "2026-02-09", time: "5:30 AM", quantity: 2, amount: 1000, paymentStatus: "Paid", bookingStatus: "Confirmed", gothram: "Bharadwaja", nakshatra: "Rohini", priest: "Pandit Sharma", images: ["https://images.unsplash.com/photo-1600693577615-9f3a0f7a16ba?w=400"], notes: "Special prayer requested", createdAt: "2026-02-07" },
  { id: "2", bookingId: "BK-2026-0002", offering: "Archana", type: "Ritual", structure: "Padmavathi Shrine", devotee: "Lakshmi Devi", devoteePhone: "+91 87654 32109", devoteeEmail: "lakshmi@email.com", date: "2026-02-09", time: "7:00 AM", quantity: 1, amount: 100, paymentStatus: "Paid", bookingStatus: "Completed", gothram: "Kashyapa", nakshatra: "Ashwini", priest: "Pandit Rao", images: [], notes: "", createdAt: "2026-02-06" },
  { id: "3", bookingId: "BK-2026-0003", offering: "Abhishekam", type: "Ritual", structure: "Main Temple", devotee: "Suresh Reddy", devoteePhone: "+91 76543 21098", devoteeEmail: "suresh@email.com", date: "2026-02-09", time: "9:00 AM", quantity: 1, amount: 2000, paymentStatus: "Paid", bookingStatus: "Confirmed", gothram: "Vasishta", nakshatra: "Pushya", priest: "Pandit Kumar", images: ["https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=400"], notes: "Family event", createdAt: "2026-02-05" },
  { id: "4", bookingId: "BK-2026-0004", offering: "VIP Darshan", type: "Darshan", structure: "Main Temple", devotee: "Priya Sharma", devoteePhone: "+91 65432 10987", devoteeEmail: "priya@email.com", date: "2026-02-09", time: "8:00 AM", quantity: 4, amount: 1200, paymentStatus: "Paid", bookingStatus: "Confirmed", gothram: "", nakshatra: "", priest: "—", images: [], notes: "Group of 4 family members", createdAt: "2026-02-04" },
  { id: "5", bookingId: "BK-2026-0005", offering: "Morning Darshan", type: "Darshan", structure: "Main Temple", devotee: "Anand Verma", devoteePhone: "+91 54321 09876", devoteeEmail: "anand@email.com", date: "2026-02-09", time: "6:00 AM", quantity: 2, amount: 0, paymentStatus: "Paid", bookingStatus: "Completed", gothram: "", nakshatra: "", priest: "—", images: [], notes: "", createdAt: "2026-02-08" },
  { id: "6", bookingId: "BK-2026-0006", offering: "Suprabhatam", type: "Ritual", structure: "Main Temple", devotee: "Meena Iyer", devoteePhone: "+91 43210 98765", devoteeEmail: "meena@email.com", date: "2026-02-10", time: "5:30 AM", quantity: 1, amount: 500, paymentStatus: "Pending", bookingStatus: "Confirmed", gothram: "Atri", nakshatra: "Swati", priest: "Pandit Sharma", images: [], notes: "", createdAt: "2026-02-08" },
  { id: "7", bookingId: "BK-2026-0007", offering: "Archana", type: "Ritual", structure: "Padmavathi Shrine", devotee: "Vijay Nair", devoteePhone: "+91 32109 87654", devoteeEmail: "vijay@email.com", date: "2026-02-10", time: "7:00 AM", quantity: 3, amount: 300, paymentStatus: "Paid", bookingStatus: "Cancelled", gothram: "Gautama", nakshatra: "Mrigashira", priest: "Pandit Rao", images: [], notes: "Cancelled due to travel", createdAt: "2026-02-07" },
  { id: "8", bookingId: "BK-2026-0008", offering: "Abhishekam", type: "Ritual", structure: "Main Temple", devotee: "Kavitha Rao", devoteePhone: "+91 21098 76543", devoteeEmail: "kavitha@email.com", date: "2026-02-11", time: "9:00 AM", quantity: 1, amount: 2000, paymentStatus: "Refunded", bookingStatus: "Cancelled", gothram: "Vishwamitra", nakshatra: "Hasta", priest: "Pandit Kumar", images: [], notes: "Refund processed", createdAt: "2026-02-06" },
];

const ITEMS_PER_PAGE = 5;

const BookingManagement = () => {
  const [bookings] = useState<Booking[]>(mockBookings);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [viewing, setViewing] = useState<Booking | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = bookings.filter(b => {
    if (searchQuery && !b.bookingId.toLowerCase().includes(searchQuery.toLowerCase()) && !b.devotee.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (filterType !== "all" && b.type !== filterType) return false;
    if (filterStatus !== "all" && b.bookingStatus !== filterStatus) return false;
    return true;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleExport = () => {
    const csv = [
      ["Booking ID", "Offering", "Type", "Structure", "Devotee", "Date", "Qty", "Amount", "Payment", "Status"].join(","),
      ...filtered.map(b => [b.bookingId, b.offering, b.type, b.structure, b.devotee, b.date, b.quantity, b.amount, b.paymentStatus, b.bookingStatus].join(","))
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bookings-export-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Bookings exported");
  };

  const payColor = (s: string) => s === "Paid" ? "default" : s === "Pending" ? "secondary" : "outline";
  const bookColor = (s: string) => s === "Confirmed" ? "default" : s === "Completed" ? "secondary" : s === "Cancelled" ? "destructive" : "outline";

  return (
    <div className="p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Booking Management</h1>
            <p className="text-muted-foreground">View and manage all bookings</p>
          </div>
          <Button variant="outline" onClick={handleExport} className="gap-2"><Download className="h-4 w-4" />Export CSV</Button>
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by Booking ID or Devotee..." className="pl-9" value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }} />
          </div>
          <Select value={filterType} onValueChange={v => { setFilterType(v); setCurrentPage(1); }}>
            <SelectTrigger className="w-[140px] bg-background"><SelectValue /></SelectTrigger>
            <SelectContent className="bg-popover"><SelectItem value="all">All Types</SelectItem><SelectItem value="Ritual">Ritual</SelectItem><SelectItem value="Darshan">Darshan</SelectItem></SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={v => { setFilterStatus(v); setCurrentPage(1); }}>
            <SelectTrigger className="w-[150px] bg-background"><SelectValue /></SelectTrigger>
            <SelectContent className="bg-popover"><SelectItem value="all">All Status</SelectItem><SelectItem value="Confirmed">Confirmed</SelectItem><SelectItem value="Completed">Completed</SelectItem><SelectItem value="Cancelled">Cancelled</SelectItem></SelectContent>
          </Select>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg"><BookOpen className="h-5 w-5 text-primary" /></div>
              <div><CardTitle>All Bookings</CardTitle><CardDescription>{filtered.length} bookings</CardDescription></div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Booking ID</TableHead>
                  <TableHead>Offering</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Structure</TableHead>
                  <TableHead>Devotee</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-center">Qty</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.map(b => (
                  <TableRow key={b.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setViewing(b)}>
                    <TableCell className="font-mono text-xs font-medium">{b.bookingId}</TableCell>
                    <TableCell className="font-medium">{b.offering}</TableCell>
                    <TableCell><Badge variant={b.type === "Ritual" ? "default" : "secondary"}>{b.type}</Badge></TableCell>
                    <TableCell className="text-muted-foreground text-sm">{b.structure}</TableCell>
                    <TableCell>{b.devotee}</TableCell>
                    <TableCell className="text-sm">{b.date}</TableCell>
                    <TableCell className="text-center">{b.quantity}</TableCell>
                    <TableCell className="text-right font-medium">{b.amount > 0 ? `₹${b.amount}` : "Free"}</TableCell>
                    <TableCell><Badge variant={payColor(b.paymentStatus) as any}>{b.paymentStatus}</Badge></TableCell>
                    <TableCell><Badge variant={bookColor(b.bookingStatus) as any}>{b.bookingStatus}</Badge></TableCell>
                  </TableRow>
                ))}
                {paginated.length === 0 && (
                  <TableRow><TableCell colSpan={10} className="text-center py-8 text-muted-foreground">No bookings found</TableCell></TableRow>
                )}
              </TableBody>
            </Table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t">
                <p className="text-sm text-muted-foreground">
                  Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}
                </p>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <Button key={i} variant={currentPage === i + 1 ? "default" : "ghost"} size="icon" className="h-8 w-8" onClick={() => setCurrentPage(i + 1)}>
                      {i + 1}
                    </Button>
                  ))}
                  <Button variant="ghost" size="icon" className="h-8 w-8" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* View Booking Detail Dialog */}
      <Dialog open={!!viewing} onOpenChange={() => setViewing(null)}>
        <DialogContent className="sm:max-w-[650px] max-h-[85vh] overflow-y-auto bg-background">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle>Booking {viewing?.bookingId}</DialogTitle>
                <DialogDescription>{viewing?.offering} · {viewing?.structure} · {viewing?.date}</DialogDescription>
              </div>
              <div className="flex gap-2">
                <Badge variant={payColor(viewing?.paymentStatus || "") as any}>{viewing?.paymentStatus}</Badge>
                <Badge variant={bookColor(viewing?.bookingStatus || "") as any}>{viewing?.bookingStatus}</Badge>
              </div>
            </div>
          </DialogHeader>
          <Tabs defaultValue="details" className="mt-2">
            <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
              {["details", "devotee", "payment", "gallery", "receipt"].map(t => (
                <TabsTrigger key={t} value={t} className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent capitalize">{t}</TabsTrigger>
              ))}
            </TabsList>
            <TabsContent value="details" className="mt-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-muted/50 rounded-lg"><p className="text-xs text-muted-foreground">Offering</p><p className="font-medium">{viewing?.offering}</p></div>
                <div className="p-3 bg-muted/50 rounded-lg"><p className="text-xs text-muted-foreground">Type</p><p className="font-medium">{viewing?.type}</p></div>
                <div className="p-3 bg-muted/50 rounded-lg"><p className="text-xs text-muted-foreground">Structure</p><p className="font-medium">{viewing?.structure}</p></div>
                <div className="p-3 bg-muted/50 rounded-lg"><p className="text-xs text-muted-foreground">Time</p><p className="font-medium">{viewing?.time}</p></div>
                <div className="p-3 bg-muted/50 rounded-lg"><p className="text-xs text-muted-foreground">Quantity</p><p className="font-medium">{viewing?.quantity}</p></div>
                <div className="p-3 bg-muted/50 rounded-lg"><p className="text-xs text-muted-foreground">Priest</p><p className="font-medium">{viewing?.priest}</p></div>
                {viewing?.gothram && <div className="p-3 bg-muted/50 rounded-lg"><p className="text-xs text-muted-foreground">Gothram</p><p className="font-medium">{viewing.gothram}</p></div>}
                {viewing?.nakshatra && <div className="p-3 bg-muted/50 rounded-lg"><p className="text-xs text-muted-foreground">Nakshatra</p><p className="font-medium">{viewing.nakshatra}</p></div>}
              </div>
              {viewing?.notes && (
                <div className="p-3 bg-muted/50 rounded-lg"><p className="text-xs text-muted-foreground">Notes</p><p className="text-sm mt-1">{viewing.notes}</p></div>
              )}
            </TabsContent>
            <TabsContent value="devotee" className="mt-4 space-y-3">
              <div className="grid grid-cols-1 gap-3">
                <div className="p-4 border rounded-lg"><p className="text-sm text-muted-foreground">Name</p><p className="font-medium text-lg">{viewing?.devotee}</p></div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 border rounded-lg"><p className="text-sm text-muted-foreground">Phone</p><p className="font-medium">{viewing?.devoteePhone}</p></div>
                  <div className="p-4 border rounded-lg"><p className="text-sm text-muted-foreground">Email</p><p className="font-medium">{viewing?.devoteeEmail}</p></div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="payment" className="mt-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 border rounded-lg"><p className="text-sm text-muted-foreground">Amount</p><p className="font-medium text-xl">{viewing?.amount ? `₹${viewing.amount}` : "Free"}</p></div>
                <div className="p-4 border rounded-lg"><p className="text-sm text-muted-foreground">Payment Status</p><Badge variant={payColor(viewing?.paymentStatus || "") as any} className="mt-1">{viewing?.paymentStatus}</Badge></div>
                <div className="p-4 border rounded-lg"><p className="text-sm text-muted-foreground">Booked On</p><p className="font-medium">{viewing?.createdAt}</p></div>
                <div className="p-4 border rounded-lg"><p className="text-sm text-muted-foreground">Booking Status</p><Badge variant={bookColor(viewing?.bookingStatus || "") as any} className="mt-1">{viewing?.bookingStatus}</Badge></div>
              </div>
            </TabsContent>
            <TabsContent value="gallery" className="mt-4">
              {viewing?.images && viewing.images.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {viewing.images.map((img, i) => (
                    <img key={i} src={img} alt="" className="w-full h-40 object-cover rounded-lg border" />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center py-8 text-muted-foreground">
                  <Image className="h-12 w-12 mb-2 opacity-50" />
                  <p>No images attached</p>
                </div>
              )}
            </TabsContent>
            <TabsContent value="receipt" className="mt-4">
              <div id="receipt-content" className="bg-white p-6 rounded-lg border-2 border-dashed border-muted-foreground/20">
                {/* Receipt Header */}
                <div className="text-center mb-6 pb-4 border-b">
                  <h2 className="text-2xl font-bold mb-1">Temple Receipt</h2>
                  <p className="text-sm text-muted-foreground">Booking Confirmation</p>
                </div>

                {/* Receipt Details */}
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Receipt Number</p>
                      <p className="font-mono font-semibold">{viewing?.bookingId}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground mb-1">Date</p>
                      <p className="font-medium">{viewing?.createdAt}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Offering</p>
                      <p className="font-medium">{viewing?.offering}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Type</p>
                      <Badge variant={viewing?.type === "Ritual" ? "default" : "secondary"}>{viewing?.type}</Badge>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Structure</p>
                      <p className="font-medium">{viewing?.structure}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Scheduled Date & Time</p>
                      <p className="font-medium">{viewing?.date} at {viewing?.time}</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <p className="text-xs text-muted-foreground mb-2">Devotee Details</p>
                    <div className="bg-muted/30 p-3 rounded">
                      <p className="font-medium">{viewing?.devotee}</p>
                      <p className="text-sm text-muted-foreground mt-1">{viewing?.devoteePhone}</p>
                      <p className="text-sm text-muted-foreground">{viewing?.devoteeEmail}</p>
                    </div>
                  </div>

                  {viewing?.type === "Ritual" && (viewing.gothram || viewing.nakshatra) && (
                    <div className="pt-4 border-t">
                      <p className="text-xs text-muted-foreground mb-2">Ritual Details</p>
                      <div className="grid grid-cols-2 gap-3">
                        {viewing.gothram && (
                          <div>
                            <p className="text-xs text-muted-foreground">Gothram</p>
                            <p className="font-medium">{viewing.gothram}</p>
                          </div>
                        )}
                        {viewing.nakshatra && (
                          <div>
                            <p className="text-xs text-muted-foreground">Nakshatra</p>
                            <p className="font-medium">{viewing.nakshatra}</p>
                          </div>
                        )}
                        {viewing.priest && viewing.priest !== "—" && (
                          <div>
                            <p className="text-xs text-muted-foreground">Assigned Priest</p>
                            <p className="font-medium">{viewing.priest}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-sm font-medium">Quantity</p>
                      <p className="font-medium">{viewing?.quantity}</p>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-sm font-medium">Amount</p>
                      <p className="font-medium">{viewing?.amount > 0 ? `₹${viewing.amount}` : "Free"}</p>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t mt-2">
                      <p className="text-lg font-bold">Total Amount</p>
                      <p className="text-lg font-bold">{viewing?.amount > 0 ? `₹${viewing.amount}` : "Free"}</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-xs text-muted-foreground">Payment Status</p>
                      <Badge variant={payColor(viewing?.paymentStatus || "") as any}>{viewing?.paymentStatus}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-muted-foreground">Booking Status</p>
                      <Badge variant={bookColor(viewing?.bookingStatus || "") as any}>{viewing?.bookingStatus}</Badge>
                    </div>
                  </div>

                  {viewing?.notes && (
                    <div className="pt-4 border-t">
                      <p className="text-xs text-muted-foreground mb-1">Notes</p>
                      <p className="text-sm">{viewing.notes}</p>
                    </div>
                  )}
                </div>

                {/* Receipt Footer */}
                <div className="pt-4 border-t text-center">
                  <p className="text-xs text-muted-foreground">Thank you for your devotion</p>
                  <p className="text-xs text-muted-foreground mt-1">This is a system-generated receipt</p>
                </div>
              </div>

              {/* Receipt Actions */}
              <div className="flex gap-2 mt-4">
                <Button variant="outline" className="flex-1 gap-2" onClick={() => {
                  const content = document.getElementById("receipt-content");
                  if (content) {
                    const printWindow = window.open("", "_blank");
                    if (printWindow) {
                      printWindow.document.write(`
                        <html>
                          <head>
                            <title>Receipt - ${viewing?.bookingId}</title>
                            <style>
                              body { font-family: Arial, sans-serif; padding: 20px; }
                              * { margin: 0; padding: 0; box-sizing: border-box; }
                              .receipt { max-width: 600px; margin: 0 auto; }
                            </style>
                          </head>
                          <body>
                            <div class="receipt">${content.innerHTML}</div>
                            <script>window.print();</script>
                          </body>
                        </html>
                      `);
                      printWindow.document.close();
                    }
                  }
                }}>
                  <Printer className="h-4 w-4" />
                  Print Receipt
                </Button>
                <Button variant="outline" className="flex-1 gap-2" onClick={() => {
                  const content = document.getElementById("receipt-content");
                  if (content) {
                    const printWindow = window.open("", "_blank");
                    if (printWindow) {
                      printWindow.document.write(`
                        <html>
                          <head>
                            <title>Receipt - ${viewing?.bookingId}</title>
                            <style>
                              body { font-family: Arial, sans-serif; padding: 20px; }
                              * { margin: 0; padding: 0; box-sizing: border-box; }
                              .receipt { max-width: 600px; margin: 0 auto; }
                            </style>
                          </head>
                          <body>
                            <div class="receipt">${content.innerHTML}</div>
                          </body>
                        </html>
                      `);
                      printWindow.document.close();
                      toast.success("Receipt opened in new window");
                    }
                  }
                }}>
                  <FileText className="h-4 w-4" />
                  View Receipt
                </Button>
              </div>
            </TabsContent>
          </Tabs>
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewing(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookingManagement;
