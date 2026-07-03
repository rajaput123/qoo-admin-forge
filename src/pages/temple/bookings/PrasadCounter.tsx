import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Search, Cookie, CheckCircle, Eye, Printer, Clock, Package, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";

interface PrasadBooking {
  bookingId: string;
  receiptNo: string;
  devotee: string;
  phone: string;
  seva: string;
  structure: string;
  slotTime: string;
  bookingDate: string;
  prasadamItems: { name: string; quantity: number; price: number }[];
  prasadamTotal: number;
  sevaTotal: number;
  paymentMode: string;
  source: "Counter" | "Online";
  sevaCompleted: boolean;
  completedBy?: string;
  completedAt?: string;
  status: "Pending" | "Ready" | "Handed Over" | "No Show";
}

const dummyBookings: PrasadBooking[] = [
  {
    bookingId: "BKG-2024-9001", receiptNo: "RCT-2024-5501", devotee: "Rajesh Sharma", phone: "+91 98765 43210",
    seva: "Suprabhatam", structure: "Main Temple", slotTime: "5:30 AM", bookingDate: "2024-12-15",
    prasadamItems: [{ name: "Laddu Prasadam", quantity: 2, price: 50 }], prasadamTotal: 100, sevaTotal: 500,
    paymentMode: "Cash", source: "Counter", sevaCompleted: true, completedBy: "Pandit Ramesh", completedAt: "6:05 AM", status: "Ready",
  },
  {
    bookingId: "BKG-2024-9002", receiptNo: "RCT-2024-5502", devotee: "Priya Devi", phone: "+91 87654 32109",
    seva: "Archana", structure: "Padmavathi Shrine", slotTime: "7:00 AM", bookingDate: "2024-12-15",
    prasadamItems: [{ name: "Pulihora", quantity: 1, price: 0 }], prasadamTotal: 0, sevaTotal: 100,
    paymentMode: "UPI", source: "Online", sevaCompleted: true, completedBy: "Pandit Suresh", completedAt: "7:25 AM", status: "Pending",
  },
  {
    bookingId: "BKG-2024-9003", receiptNo: "RCT-2024-5503", devotee: "Venkat Rao", phone: "+91 76543 21098",
    seva: "Abhishekam", structure: "Main Temple", slotTime: "9:00 AM", bookingDate: "2024-12-15",
    prasadamItems: [{ name: "Sweet Pongal", quantity: 1, price: 100 }, { name: "Laddu", quantity: 2, price: 50 }],
    prasadamTotal: 200, sevaTotal: 2000, paymentMode: "Card", source: "Counter",
    sevaCompleted: true, completedBy: "Pandit Ramesh", completedAt: "9:50 AM", status: "Handed Over",
  },
  {
    bookingId: "BKG-2024-9004", receiptNo: "RCT-2024-5504", devotee: "Lakshmi N", phone: "+91 65432 10987",
    seva: "VIP Darshan", structure: "Main Temple", slotTime: "8:00 AM", bookingDate: "2024-12-15",
    prasadamItems: [{ name: "Laddu Prasadam", quantity: 1, price: 50 }], prasadamTotal: 50, sevaTotal: 300,
    paymentMode: "Cash", source: "Online", sevaCompleted: true, completedBy: "Pandit Suresh", completedAt: "8:30 AM", status: "No Show",
  },
  {
    bookingId: "BKG-2024-9005", receiptNo: "RCT-2024-5505", devotee: "Karthik S", phone: "+91 54321 09876",
    seva: "Sahasranama", structure: "Varadaraja Shrine", slotTime: "11:00 AM", bookingDate: "2024-12-15",
    prasadamItems: [{ name: "Pulihora", quantity: 1, price: 0 }], prasadamTotal: 0, sevaTotal: 1500,
    paymentMode: "UPI", source: "Counter", sevaCompleted: false, status: "Pending",
  },
  {
    bookingId: "BKG-2024-9006", receiptNo: "RCT-2024-5506", devotee: "Meena K", phone: "+91 43210 98765",
    seva: "Suprabhatam", structure: "Main Temple", slotTime: "5:30 AM", bookingDate: "2024-12-16",
    prasadamItems: [{ name: "Laddu Prasadam", quantity: 2, price: 50 }], prasadamTotal: 100, sevaTotal: 500,
    paymentMode: "Cash", source: "Counter", sevaCompleted: true, completedBy: "Pandit Ramesh", completedAt: "6:10 AM", status: "Ready",
  },
  {
    bookingId: "BKG-2024-9007", receiptNo: "RCT-2024-5507", devotee: "Suresh P", phone: "+91 32109 87654",
    seva: "Archana", structure: "Main Temple", slotTime: "7:00 AM", bookingDate: "2024-12-16",
    prasadamItems: [{ name: "Pulihora", quantity: 1, price: 0 }], prasadamTotal: 0, sevaTotal: 100,
    paymentMode: "UPI", source: "Online", sevaCompleted: false, status: "Pending",
  },
  {
    bookingId: "BKG-2024-9008", receiptNo: "RCT-2024-5508", devotee: "Anitha R", phone: "+91 21098 76543",
    seva: "Abhishekam", structure: "Main Temple", slotTime: "9:00 AM", bookingDate: "2024-12-16",
    prasadamItems: [{ name: "Sweet Pongal", quantity: 1, price: 100 }, { name: "Laddu", quantity: 2, price: 50 }],
    prasadamTotal: 200, sevaTotal: 2000, paymentMode: "Card", source: "Counter", sevaCompleted: false, status: "Pending",
  },
];

const statusConfig: Record<PrasadBooking["status"], { variant: "default" | "secondary" | "destructive" | "outline"; label: string }> = {
  Pending: { variant: "outline", label: "Pending" },
  Ready: { variant: "secondary", label: "Ready" },
  "Handed Over": { variant: "default", label: "Handed Over" },
  "No Show": { variant: "destructive", label: "No Show" },
};

const PrasadCounter = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [bookings, setBookings] = useState(dummyBookings);
  const [viewDetail, setViewDetail] = useState<PrasadBooking | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const completedBookings = bookings.filter(b => b.sevaCompleted);
  const inProgressBookings = bookings.filter(b => !b.sevaCompleted);

  const filtered = completedBookings.filter(b =>
    (statusFilter === "all" || b.status === statusFilter) &&
    (b.devotee.toLowerCase().includes(search.toLowerCase()) ||
     b.bookingId.toLowerCase().includes(search.toLowerCase()) ||
     b.receiptNo.toLowerCase().includes(search.toLowerCase()) ||
     b.seva.toLowerCase().includes(search.toLowerCase()))
  );

  const totalPending = completedBookings.filter(b => b.status === "Pending").length;
  const totalReady = completedBookings.filter(b => b.status === "Ready").length;
  const totalHandedOver = completedBookings.filter(b => b.status === "Handed Over").length;
  const totalNoShow = completedBookings.filter(b => b.status === "No Show").length;

  const markReady = (id: string) => {
    setBookings(prev => prev.map(b => b.bookingId === id ? { ...b, status: "Ready" as const } : b));
  };

  const markHandedOver = (id: string) => {
    setBookings(prev => prev.map(b => b.bookingId === id ? { ...b, status: "Handed Over" as const } : b));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Prasad Counter</h2>
        <p className="text-sm text-muted-foreground mt-1">Prasadam appears here only after the seva/pooja is completed by the priest</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="border-dashed">
          <CardContent className="p-4 text-center">
            <AlertCircle className="h-5 w-5 text-muted-foreground mx-auto mb-1" />
            <p className="text-2xl font-bold text-muted-foreground">{inProgressBookings.length}</p>
            <p className="text-xs text-muted-foreground">Seva In Progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-5 w-5 text-amber-600 mx-auto mb-1" />
            <p className="text-2xl font-bold text-amber-600">{totalPending}</p>
            <p className="text-xs text-muted-foreground">Pending Pickup</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Package className="h-5 w-5 text-primary mx-auto mb-1" />
            <p className="text-2xl font-bold text-primary">{totalReady}</p>
            <p className="text-xs text-muted-foreground">Ready</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-5 w-5 text-primary mx-auto mb-1" />
            <p className="text-2xl font-bold text-primary">{totalHandedOver}</p>
            <p className="text-xs text-muted-foreground">Handed Over</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Cookie className="h-5 w-5 text-destructive mx-auto mb-1" />
            <p className="text-2xl font-bold text-destructive">{totalNoShow}</p>
            <p className="text-xs text-muted-foreground">No Show</p>
          </CardContent>
        </Card>
      </div>

      {/* Seva In Progress - waiting section */}
      {inProgressBookings.length > 0 && (
        <Card className="border-dashed">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm font-medium text-muted-foreground">Seva In Progress — Waiting for completion</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {inProgressBookings.map(b => (
                <div key={b.bookingId} className="p-3 border border-dashed rounded-lg bg-muted/20">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-xs text-muted-foreground">{b.bookingId}</span>
                    <Badge variant="outline" className="text-[9px]">In Progress</Badge>
                  </div>
                  <p className="font-medium text-sm">{b.devotee}</p>
                  <p className="text-xs text-muted-foreground">{b.seva} · {b.structure}</p>
                  <p className="text-xs text-muted-foreground">{b.slotTime} · {b.bookingDate}</p>
                  <div className="mt-1.5 flex items-center gap-1">
                    <Cookie className="h-3 w-3 text-muted-foreground" />
                    <span className="text-[10px] text-muted-foreground">{b.prasadamItems.map(p => p.name).join(", ")}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-4">
          <div className="flex gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by devotee, booking ID, receipt no, or seva..."
                value={search}
                onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={v => { setStatusFilter(v); setCurrentPage(1); }}>
              <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Ready">Ready</SelectItem>
                <SelectItem value="Handed Over">Handed Over</SelectItem>
                <SelectItem value="No Show">No Show</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Booking ID</TableHead>
                <TableHead>Receipt No</TableHead>
                <TableHead>Devotee</TableHead>
                <TableHead>Seva</TableHead>
                <TableHead>Prasadam</TableHead>
                <TableHead className="text-right">Prasad Value</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(() => {
                const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
                const safePage = Math.min(currentPage, totalPages);
                const paginated = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);
                return paginated.length > 0 ? paginated.map(b => (
                <TableRow key={b.bookingId}>
                  <TableCell className="font-mono text-xs">{b.bookingId}</TableCell>
                  <TableCell className="font-mono text-xs">{b.receiptNo}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-sm">{b.devotee}</p>
                      <p className="text-[10px] text-muted-foreground">{b.phone}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm">{b.seva}</p>
                      <p className="text-[10px] text-muted-foreground">{b.structure} · {b.slotTime}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-0.5">
                      {b.prasadamItems.map((p, i) => (
                        <p key={i} className="text-xs">
                          {p.name} <span className="text-muted-foreground">×{p.quantity}</span>
                        </p>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm">
                    {b.prasadamTotal > 0 ? `₹${b.prasadamTotal}` : <span className="text-muted-foreground">Free</span>}
                  </TableCell>
                  <TableCell>
                    <Badge variant={b.source === "Counter" ? "secondary" : "outline"} className="text-[10px]">
                      {b.source}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusConfig[b.status].variant} className="text-xs">
                      {statusConfig[b.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setViewDetail(b)}>
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                      {b.status === "Pending" && (
                        <Button variant="ghost" size="sm" className="text-xs h-7" onClick={() => markReady(b.bookingId)}>
                          <Package className="h-3 w-3 mr-1" />Ready
                        </Button>
                      )}
                      {b.status === "Ready" && (
                        <Button variant="ghost" size="sm" className="text-xs h-7" onClick={() => markHandedOver(b.bookingId)}>
                          <CheckCircle className="h-3 w-3 mr-1" />Hand Over
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                    No prasadam bookings found
                  </TableCell>
                </TableRow>
              );
              })()}
            </TableBody>
          </Table>

          {/* Pagination */}
          {filtered.length > pageSize && (() => {
            const totalPages = Math.ceil(filtered.length / pageSize);
            const safePage = Math.min(currentPage, totalPages);
            return (
              <div className="flex items-center justify-between pt-4 border-t mt-4">
                <p className="text-xs text-muted-foreground">
                  Showing {(safePage - 1) * pageSize + 1}–{Math.min(safePage * pageSize, filtered.length)} of {filtered.length}
                </p>
                <div className="flex items-center gap-1">
                  <Button variant="outline" size="icon" className="h-8 w-8" disabled={safePage <= 1} onClick={() => setCurrentPage(safePage - 1)}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <Button
                      key={page}
                      variant={page === safePage ? "default" : "outline"}
                      size="icon"
                      className="h-8 w-8 text-xs"
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  ))}
                  <Button variant="outline" size="icon" className="h-8 w-8" disabled={safePage >= totalPages} onClick={() => setCurrentPage(safePage + 1)}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })()}
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={!!viewDetail} onOpenChange={() => setViewDetail(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Cookie className="h-5 w-5 text-primary" />
              Prasad Booking Detail
            </DialogTitle>
          </DialogHeader>
          {viewDetail && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs">Booking ID</p>
                  <p className="font-mono font-medium">{viewDetail.bookingId}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Receipt No</p>
                  <p className="font-mono font-medium">{viewDetail.receiptNo}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Devotee</p>
                  <p className="font-medium">{viewDetail.devotee}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Phone</p>
                  <p className="font-medium">{viewDetail.phone}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Seva</p>
                  <p className="font-medium">{viewDetail.seva}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Structure</p>
                  <p className="font-medium">{viewDetail.structure}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Slot Time</p>
                  <p className="font-medium">{viewDetail.slotTime}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Booking Date</p>
                  <p className="font-medium">{viewDetail.bookingDate}</p>
                </div>
              </div>

              {viewDetail.completedBy && (
                <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Seva Completed</p>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Completed By</span>
                    <span className="font-medium">{viewDetail.completedBy}</span>
                  </div>
                  {viewDetail.completedAt && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Completed At</span>
                      <span className="font-medium">{viewDetail.completedAt}</span>
                    </div>
                  )}
                </div>
              )}

              <Separator />

              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Prasadam Items</p>
                <div className="space-y-2">
                  {viewDetail.prasadamItems.map((p, i) => (
                    <div key={i} className="flex justify-between items-center p-2 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Cookie className="h-3.5 w-3.5 text-primary" />
                        <span className="text-sm font-medium">{p.name}</span>
                        <span className="text-xs text-muted-foreground">×{p.quantity}</span>
                      </div>
                      <span className="text-sm font-medium">
                        {p.price > 0 ? `₹${p.price * p.quantity}` : "Free"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Seva Amount</span>
                  <span>₹{viewDetail.sevaTotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Prasadam Amount</span>
                  <span>{viewDetail.prasadamTotal > 0 ? `₹${viewDetail.prasadamTotal}` : "Free"}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>₹{viewDetail.sevaTotal + viewDetail.prasadamTotal}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs">Payment</p>
                  <p className="font-medium">{viewDetail.paymentMode}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Source</p>
                  <Badge variant="secondary" className="text-[10px]">{viewDetail.source}</Badge>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Status</p>
                  <Badge variant={statusConfig[viewDetail.status].variant} className="text-xs">
                    {statusConfig[viewDetail.status].label}
                  </Badge>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="outline" className="flex-1 gap-1.5" size="sm">
                  <Printer className="h-3.5 w-3.5" />Print Slip
                </Button>
                {viewDetail.status === "Pending" && (
                  <Button className="flex-1 gap-1.5" size="sm" onClick={() => { markReady(viewDetail.bookingId); setViewDetail({ ...viewDetail, status: "Ready" }); }}>
                    <Package className="h-3.5 w-3.5" />Mark Ready
                  </Button>
                )}
                {viewDetail.status === "Ready" && (
                  <Button className="flex-1 gap-1.5" size="sm" onClick={() => { markHandedOver(viewDetail.bookingId); setViewDetail({ ...viewDetail, status: "Handed Over" }); }}>
                    <CheckCircle className="h-3.5 w-3.5" />Hand Over
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PrasadCounter;
