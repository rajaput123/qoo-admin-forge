import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Store, ChevronRight, Check, Printer, MessageSquare, ShoppingCart, Plus, Trash2, X, Cookie, MessageCircle, Banknote, QrCode, FileText, Smartphone, Loader2 } from "lucide-react";
import { TEMPLE_CONFIG } from "@/components/TempleQRPanel";
import { toast } from "sonner";
import SearchableSelect from "@/components/SearchableSelect";
import CustomFieldsSection, { CustomField } from "@/components/CustomFieldsSection";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CalendarIcon } from "lucide-react";
import { recordSevaBookings } from "@/modules/sevas/sevaStore";

interface PrasadamItem {
  name: string;
  quantity: number;
  price: number;
  showOnline?: boolean;
}

const offerings = [
  { id: "1", name: "Suprabhatam", type: "Ritual", structure: "Main Temple", time: "5:30 AM", price: 500, available: 12, availableCounter: true, prasadamIncluded: true, prasadamItems: [{ name: "Laddu Prasadam", quantity: 2, price: 50, showOnline: true }] as PrasadamItem[] },
  { id: "2", name: "Archana", type: "Ritual", structure: "Padmavathi Shrine", time: "7:00 AM", price: 100, available: 8, availableCounter: true, prasadamIncluded: true, prasadamItems: [{ name: "Pulihora", quantity: 1, price: 0, showOnline: false }] as PrasadamItem[] },
  { id: "3", name: "Abhishekam", type: "Ritual", structure: "Main Temple", time: "9:00 AM", price: 2000, available: 5, availableCounter: true, prasadamIncluded: true, prasadamItems: [{ name: "Sweet Pongal", quantity: 1, price: 100, showOnline: true }, { name: "Laddu", quantity: 2, price: 50, showOnline: true }] as PrasadamItem[] },
  { id: "4", name: "Morning Darshan", type: "Darshan", structure: "Main Temple", time: "6:00 AM – 10:00 AM", price: 0, available: 180, availableCounter: true, prasadamIncluded: false, prasadamItems: [] as PrasadamItem[] },
  { id: "5", name: "VIP Darshan", type: "Darshan", structure: "Main Temple", time: "8:00 AM – 10:00 AM", price: 300, available: 45, availableCounter: false, prasadamIncluded: true, prasadamItems: [{ name: "Laddu Prasadam", quantity: 1, price: 50, showOnline: true }] as PrasadamItem[] },
  { id: "6", name: "Sahasranama", type: "Ritual", structure: "Varadaraja Shrine", time: "11:00 AM", price: 1500, available: 28, availableCounter: true, prasadamIncluded: true, prasadamItems: [{ name: "Pulihora", quantity: 1, price: 0, showOnline: false }] as PrasadamItem[] },
  { id: "7", name: "Lalitha Sahasranama", type: "Ritual", structure: "Padmavathi Shrine", time: "10:00 AM", price: 800, available: 15, availableCounter: true, prasadamIncluded: false, prasadamItems: [] as PrasadamItem[] },
  { id: "8", name: "Evening Darshan", type: "Darshan", structure: "Main Temple", time: "4:00 PM – 8:00 PM", price: 0, available: 200, availableCounter: true, prasadamIncluded: false, prasadamItems: [] as PrasadamItem[] },
];

const structureOptions = [
  { value: "all", label: "All Structures" },
  { value: "Main Temple", label: "Main Temple" },
  { value: "Padmavathi Shrine", label: "Padmavathi Shrine" },
  { value: "Varadaraja Shrine", label: "Varadaraja Shrine" },
];

const gothramOptions = [
  { value: "Bharadwaja", label: "Bharadwaja" }, { value: "Kashyapa", label: "Kashyapa" },
  { value: "Vasishta", label: "Vasishta" }, { value: "Atri", label: "Atri" },
  { value: "Gautama", label: "Gautama" }, { value: "Vishwamitra", label: "Vishwamitra" },
  { value: "Jamadagni", label: "Jamadagni" },
];

const nakshatraOptions = [
  { value: "Ashwini", label: "Ashwini" }, { value: "Bharani", label: "Bharani" },
  { value: "Rohini", label: "Rohini" }, { value: "Mrigashira", label: "Mrigashira" },
  { value: "Pushya", label: "Pushya" }, { value: "Swati", label: "Swati" },
  { value: "Anuradha", label: "Anuradha" }, { value: "Hasta", label: "Hasta" },
  { value: "Uttara", label: "Uttara" },
];

type SlotOption = { id: string; dateLabel: string; dateIso: string; timeLabel: string; available: number };

interface CartItem {
  cartId: string;
  offering: typeof offerings[0];
  slot: SlotOption;
  quantity: number;
  includePrasadam: boolean;
}

function parse12hToMinutes(raw: string) {
  const m = raw.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!m) return null;
  let h = Number(m[1]);
  const min = Number(m[2]);
  const ampm = m[3].toUpperCase();
  if (!Number.isFinite(h) || !Number.isFinite(min)) return null;
  h = h % 12;
  if (ampm === "PM") h += 12;
  return h * 60 + min;
}

function minutesTo12hLabel(totalMinutes: number) {
  const h24 = Math.floor(totalMinutes / 60) % 24;
  const min = totalMinutes % 60;
  const ampm = h24 >= 12 ? "PM" : "AM";
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${String(min).padStart(2, "0")} ${ampm}`;
}

function getTodayIso(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

function getDateLabel(offsetDays = 0) {
  if (offsetDays === 0) return "Today";
  if (offsetDays === 1) return "Tomorrow";
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toLocaleDateString("en-IN", { weekday: "short", day: "2-digit", month: "short" });
}

function dateToIso(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function buildSlotsForDate(offering: typeof offerings[0], date: Date): SlotOption[] {
  const iso = dateToIso(date);
  const label = format(date, "EEE, dd MMM");
  const time = offering.time;
  if (time.includes("–") || time.includes("-")) {
    const parts = time.split("–").length > 1 ? time.split("–") : time.split("-");
    const startMin = parse12hToMinutes(parts[0]?.trim() ?? "");
    const endMin = parse12hToMinutes(parts[1]?.trim() ?? "");
    if (startMin != null && endMin != null && endMin > startMin) {
      const interval = 30;
      const times: number[] = [];
      for (let t = startMin; t <= endMin; t += interval) times.push(t);
      const count = times.length || 1;
      const base = Math.max(1, Math.floor(offering.available / count));
      let remainder = Math.max(0, offering.available - base * count);
      return times.map(t => {
        const extra = remainder > 0 ? 1 : 0;
        remainder = Math.max(0, remainder - extra);
        return { id: `${iso}-${t}`, dateLabel: label, dateIso: iso, timeLabel: minutesTo12hLabel(t), available: base + extra };
      });
    }
  }
  const fixed = parse12hToMinutes(time);
  const timeLabel = fixed != null ? minutesTo12hLabel(fixed) : time;
  return [{ id: `${iso}-${timeLabel}`, dateLabel: label, dateIso: iso, timeLabel, available: offering.available }];
}

function buildSlotOptions(offering: typeof offerings[0]): SlotOption[] {
  const time = offering.time;
  if (time.includes("–") || time.includes("-")) {
    const parts = time.split("–").length > 1 ? time.split("–") : time.split("-");
    const startMin = parse12hToMinutes(parts[0]?.trim() ?? "");
    const endMin = parse12hToMinutes(parts[1]?.trim() ?? "");
    if (startMin != null && endMin != null && endMin > startMin) {
      const interval = 30;
      const times: number[] = [];
      for (let t = startMin; t <= endMin; t += interval) times.push(t);
      const count = times.length || 1;
      const base = Math.max(1, Math.floor(offering.available / count));
      let remainder = Math.max(0, offering.available - base * count);
      return times.map(t => {
        const extra = remainder > 0 ? 1 : 0;
        remainder = Math.max(0, remainder - extra);
        return { id: `${getTodayIso(0)}-${t}`, dateLabel: "Today", dateIso: getTodayIso(0), timeLabel: minutesTo12hLabel(t), available: base + extra };
      });
    }
  }
  const fixed = parse12hToMinutes(time);
  const timeLabel = fixed != null ? minutesTo12hLabel(fixed) : time;
  return [0, 1, 2].map(d => ({
    id: `${getTodayIso(d)}-${timeLabel}`, dateLabel: getDateLabel(d), dateIso: getTodayIso(d), timeLabel, available: offering.available,
  }));
}

const steps = ["Browse & Add to Cart", "Devotee Details", "Payment", "Confirm"];

const COUNTER_PAYMENT_MODES = [
  { id: "Cash", label: "Cash", purpose: "Cash received directly at the counter" },
  {
    id: "Temple QR / Bank Transfer",
    label: "Online Transfer [net banking/upi/qr]",
    purpose: "Direct transfer or NEFT — record reference no",
    refLabel: "Reference No / UTR",
    refPlaceholder: "e.g. UTR4827384 or bank transfer reference",
  },
  {
    id: "Cheque",
    label: "Cheque",
    purpose: "Payment by cheque — record cheque details for bank deposit",
    refLabel: "Cheque Number",
    refPlaceholder: "e.g. 123456 — Bank name, cheque date",
  },
  { id: "UPI", label: "Generate Mobile UPI Link", purpose: "Send payment link to devotee via WhatsApp on mobile" },
  { id: "QR Code", label: "Generate QR", purpose: "Open temple QR — devotee scans and pays at counter" },
] as const;

const COUNTER_PAYMENT_GROUPS = [
  {
    title: "Cash -- Online Transfer [net banking/upi/qr] -- Cheque",
    modes: ["Cash", "Temple QR / Bank Transfer", "Cheque"] as const,
  },
  {
    title: "Online payment gateway",
    modes: ["UPI", "QR Code"] as const,
  },
] as const;

type CounterPaymentMode = (typeof COUNTER_PAYMENT_MODES)[number]["id"];

function getCounterPaymentMode(mode: string) {
  return COUNTER_PAYMENT_MODES.find((m) => m.id === mode) ?? COUNTER_PAYMENT_MODES[0];
}

function paymentModeNeedsRef(mode: string) {
  return mode === "Cheque" || mode === "Temple QR / Bank Transfer";
}

function buildSevaUpiLink(amount: number) {
  return `upi://pay?pa=${TEMPLE_CONFIG.upiId}&pn=${encodeURIComponent(TEMPLE_CONFIG.upiDisplayName)}&am=${amount}&cu=INR&tn=${encodeURIComponent("Seva Booking")}`;
}

function DigitalPaymentWaiting({
  mode,
  amount,
  phone,
  received,
  onPaymentReceived,
}: {
  mode: "UPI" | "QR Code";
  amount: number;
  phone: string;
  received: boolean;
  onPaymentReceived: () => void;
}) {
  if (received) {
    return (
      <div className="flex flex-col items-center py-8 text-center space-y-2 rounded-xl border border-emerald-200 bg-emerald-50/50">
        <Check className="h-10 w-10 text-emerald-600" />
        <p className="font-semibold text-emerald-800">Payment received</p>
        <p className="text-sm text-emerald-700/80">You can confirm and continue</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center py-8 px-4 text-center space-y-4 rounded-xl border border-dashed bg-muted/20">
      <Loader2 className="h-12 w-12 text-primary animate-spin" />
      <div className="space-y-1.5">
        <p className="font-semibold text-base">Waiting for payment</p>
        <p className="text-sm text-muted-foreground max-w-xs mx-auto">
          {mode === "UPI"
            ? `Payment link already sent via WhatsApp to +91 ${phone || "__________"}`
            : "QR is active — waiting for devotee to scan and pay"}
        </p>
      </div>
      <p className="text-2xl font-bold">₹{amount.toLocaleString("en-IN")}</p>
      <p className="text-xs text-muted-foreground">Tap below once payment is completed</p>
      <Button type="button" className="w-full" onClick={onPaymentReceived}>
        Payment Received
      </Button>
    </div>
  );
}

function paymentModeIcon(mode: CounterPaymentMode) {
  switch (mode) {
    case "Cash": return Banknote;
    case "Temple QR / Bank Transfer": return QrCode;
    case "Cheque": return FileText;
    case "UPI": return MessageCircle;
    case "QR Code": return Smartphone;
    default: return Banknote;
  }
}

const CounterBooking = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [filterStructure, setFilterStructure] = useState("all");
  const [filterType, setFilterType] = useState("all");

  // Cart state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [addingOffering, setAddingOffering] = useState<typeof offerings[0] | null>(null);
  const [addingSlot, setAddingSlot] = useState<SlotOption | null>(null);
  const [addingDate, setAddingDate] = useState<Date | undefined>(new Date());
  const [addingQty, setAddingQty] = useState(1);
  const [addingPrasadam, setAddingPrasadam] = useState(false);

  // Devotee & payment state
  const [devotee, setDevotee] = useState({ name: "", phone: "", email: "", gothram: "", nakshatra: "", sankalpam: "" });
  const [paymentMode, setPaymentMode] = useState<CounterPaymentMode>("Cash");
  const [refNumber, setRefNumber] = useState("");
  const [upiLinkSent, setUpiLinkSent] = useState(false);
  const [upiPaymentReceived, setUpiPaymentReceived] = useState(false);
  const [qrPaymentStatus, setQrPaymentStatus] = useState<"Pending Payment" | "Paid">("Pending Payment");
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [paymentConfigured, setPaymentConfigured] = useState(false);

  const validatePaymentDetails = (mode: CounterPaymentMode): string | null => {
    if (mode === "UPI" && !upiPaymentReceived) return "Mark payment as received on the waiting screen";
    if (mode === "QR Code" && qrPaymentStatus !== "Paid") return "Mark payment as received on the waiting screen";
    if (paymentModeNeedsRef(mode) && !refNumber.trim()) {
      const meta = getCounterPaymentMode(mode);
      return `${"refLabel" in meta ? meta.refLabel : "Reference"} is required`;
    }
    return null;
  };

  const selectPaymentMode = (modeId: CounterPaymentMode) => {
    if (modeId !== paymentMode) {
      setRefNumber("");
      setUpiLinkSent(false);
      setUpiPaymentReceived(false);
      setQrPaymentStatus("Pending Payment");
      setPaymentConfigured(false);
    }
    setPaymentMode(modeId);
    setPaymentDialogOpen(true);
  };

  useEffect(() => {
    if (!paymentDialogOpen || paymentMode !== "UPI" || upiLinkSent) return;
    const phone = devotee.phone.replace(/\D/g, "").slice(-10);
    if (phone.length === 10) {
      sendWhatsAppPaymentLink();
    }
  }, [paymentDialogOpen, paymentMode]);

  const confirmPaymentDialog = () => {
    const error = validatePaymentDetails(paymentMode);
    if (error) {
      toast.error(error);
      return;
    }
    setPaymentConfigured(true);
    setPaymentDialogOpen(false);
    toast.success(`${getCounterPaymentMode(paymentMode).label} payment details saved`);
  };

  const filteredOfferings = offerings.filter(o => {
    if (filterStructure !== "all" && o.structure !== filterStructure) return false;
    if (filterType !== "all" && o.type !== filterType) return false;
    if (!o.availableCounter) return false;
    return o.available > 0;
  });

  const cartTotal = cart.reduce((sum, item) => {
    const prasadamCost = item.includePrasadam && item.offering.prasadamIncluded && item.offering.prasadamItems.length > 0 ? item.offering.prasadamItems.reduce((s, p) => s + p.price * p.quantity, 0) * item.quantity : 0;
    return sum + item.offering.price * item.quantity + prasadamCost;
  }, 0);
  const hasRitualInCart = cart.some(item => item.offering.type === "Ritual");

  const addToCart = () => {
    if (!addingOffering || !addingSlot) return;
    const cartItem: CartItem = {
      cartId: `C-${Date.now()}`,
      offering: addingOffering,
      slot: addingSlot,
      quantity: addingQty,
      includePrasadam: addingPrasadam && addingOffering.prasadamIncluded,
    };
    setCart(prev => [...prev, cartItem]);
    toast.success(`${addingOffering.name} added to cart`);
    setAddingOffering(null);
    setAddingSlot(null);
    setAddingDate(new Date());
    setAddingQty(1);
    setAddingPrasadam(false);
  };

  const removeFromCart = (cartId: string) => {
    setCart(prev => prev.filter(item => item.cartId !== cartId));
  };

  const updateCartQty = (cartId: string, qty: number) => {
    setCart(prev => prev.map(item =>
      item.cartId === cartId ? { ...item, quantity: Math.max(1, Math.min(qty, item.slot.available)) } : item
    ));
  };

  const sendWhatsAppPaymentLink = () => {
    const phone = devotee.phone.replace(/\D/g, "").slice(-10);
    if (phone.length !== 10) {
      toast.error("Add a valid 10-digit mobile number in devotee details");
      return;
    }
    const message = encodeURIComponent(
      `Namaste ${devotee.name || "Devotee"},\n\nPlease pay ₹${cartTotal.toLocaleString("en-IN")} for your seva booking at ${TEMPLE_CONFIG.name}.\n\nUPI ID: ${TEMPLE_CONFIG.upiId}\nPayment link: ${buildSevaUpiLink(cartTotal)}\n\nThank you.`
    );
    window.open(`https://wa.me/91${phone}?text=${message}`, "_blank");
    setUpiLinkSent(true);
    toast.success("Payment link opened in WhatsApp");
  };


  const handleConfirm = () => {
    const bookingsToRecord = cart.map(item => {
      let paymentMethod: "Cash" | "UPI" | "Bank" | "Online" = "Cash";
      let paymentModeStr = "Cash";
      
      if (paymentMode === "Cash") {
        paymentMethod = "Cash";
        paymentModeStr = "Cash";
      } else if (paymentMode === "Temple QR / Bank Transfer") {
        paymentMethod = "Bank";
        paymentModeStr = "Bank Transfer";
      } else if (paymentMode === "Cheque") {
        paymentMethod = "Bank";
        paymentModeStr = "Cheque";
      } else if (paymentMode === "UPI" || paymentMode === "QR Code") {
        paymentMethod = "UPI";
        paymentModeStr = paymentMode;
      }
      
      const itemPrasadamCost = item.includePrasadam && item.offering.prasadamIncluded && item.offering.prasadamItems.length > 0
        ? item.offering.prasadamItems.reduce((s, p) => s + p.price * p.quantity, 0) * item.quantity
        : 0;
      const totalItemAmount = (item.offering.price * item.quantity) + itemPrasadamCost;

      return {
        sevaName: item.offering.name,
        sevaCategory: item.offering.type === "Ritual" ? "Daily Sevas" : "Darshan",
        devoteeName: devotee.name,
        devoteePhone: devotee.phone,
        date: item.slot.dateIso,
        time: item.slot.timeLabel,
        amount: totalItemAmount,
        paymentMethod,
        paymentMode: paymentModeStr,
        referenceNo: refNumber || "",
        status: "Confirmed" as const,
        counterId: "CTR-001",
        sourceModule: "Counter" as const,
      };
    });

    recordSevaBookings(bookingsToRecord);
    setBookingComplete(true);
    toast.success("Counter booking created successfully!");
  };

  const handleReset = () => {
    setCurrentStep(0);
    setCart([]);
    setAddingOffering(null);
    setAddingSlot(null);
    setAddingDate(new Date());
    setAddingQty(1);
    setDevotee({ name: "", phone: "", email: "", gothram: "", nakshatra: "", sankalpam: "" });
    setPaymentMode("Cash");
    setRefNumber("");
    setUpiLinkSent(false);
    setUpiPaymentReceived(false);
    setQrPaymentStatus("Pending Payment");
    setPaymentDialogOpen(false);
    setPaymentConfigured(false);
    setAddingPrasadam(false);
    setCustomFields([]);
    setBookingComplete(false);
  };

  if (bookingComplete) {
    return (
      <div className="p-6">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-lg mx-auto">
          <Card>
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                <Check className="h-8 w-8 text-emerald-600" />
              </div>
              <h2 className="text-xl font-bold mb-1">Booking Confirmed!</h2>
              <p className="text-muted-foreground mb-4">{cart.length} seva(s) booked successfully.</p>
              <div className="text-left space-y-3 p-4 bg-muted/50 rounded-lg mb-6">
                {cart.map(item => {
                  const prasadamCost = item.includePrasadam && item.offering.prasadamIncluded && item.offering.prasadamItems.length > 0 ? item.offering.prasadamItems.reduce((s, p) => s + p.price * p.quantity, 0) * item.quantity : 0;
                  return (
                    <div key={item.cartId} className="text-sm">
                      <div className="flex justify-between">
                        <div>
                          <span className="font-medium">{item.offering.name}</span>
                          <span className="text-muted-foreground"> × {item.quantity}</span>
                        </div>
                        <span className="font-medium">₹{item.offering.price * item.quantity}</span>
                      </div>
                      {item.includePrasadam && item.offering.prasadamIncluded && item.offering.prasadamItems.length > 0 && (
                        <div className="flex justify-between text-xs text-muted-foreground ml-4">
                          <span>+ {item.offering.prasadamItems.map(p => p.name).join(", ")} × {item.quantity}</span>
                          <span>{item.offering.prasadamItems.reduce((s, p) => s + p.price * p.quantity, 0) > 0 ? `₹${prasadamCost}` : "Free"}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
                <Separator />
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Devotee</span><span className="font-medium">{devotee.name}</span></div>
                <div className="flex justify-between text-sm font-bold text-base"><span>Total</span><span>₹{cartTotal}</span></div>
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Payment</span><span className="font-medium">{getCounterPaymentMode(paymentMode).label}</span></div>
                {paymentMode === "UPI" && upiLinkSent && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">WhatsApp Link</span>
                    <span className="font-medium text-xs">Sent to +91 {devotee.phone.replace(/\D/g, "").slice(-10)}</span>
                  </div>
                )}
                {paymentMode === "QR Code" && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">QR Payment</span>
                    <Badge variant="secondary">{qrPaymentStatus}</Badge>
                  </div>
                )}
                {refNumber && paymentModeNeedsRef(paymentMode) && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{(getCounterPaymentMode(paymentMode) as { refLabel?: string }).refLabel ?? "Reference"}</span>
                    <span className="font-medium font-mono text-xs">{refNumber}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Source</span><Badge variant="secondary">Counter</Badge></div>
              </div>
              <div className="flex gap-2 justify-center">
                <Button variant="outline" className="gap-2"><Printer className="h-4 w-4" />Print Receipt</Button>
                <Button variant="outline" className="gap-2"><MessageSquare className="h-4 w-4" />SMS Confirmation</Button>
                <Button onClick={handleReset}>New Booking</Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">Counter Booking</h1>
          <p className="text-muted-foreground">Book multiple sevas for a devotee at the counter</p>
        </div>

        {/* Step Progress */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
          {steps.map((step, i) => (
            <div key={i} className="flex items-center gap-2 flex-shrink-0">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${i < currentStep ? "bg-primary text-primary-foreground" :
                  i === currentStep ? "bg-primary text-primary-foreground ring-4 ring-primary/20" :
                    "bg-muted text-muted-foreground"
                }`}>{i < currentStep ? <Check className="h-4 w-4" /> : i + 1}</div>
              <span className={`text-xs font-medium ${i <= currentStep ? "text-foreground" : "text-muted-foreground"}`}>{step}</span>
              {i < steps.length - 1 && <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 1 – Browse & Add to Cart */}
            {currentStep === 0 && (
              <div className="space-y-4">
                {/* Slot selection for a specific offering */}
                <AnimatePresence>
                  {addingOffering && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                      <Card className="border-primary">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <CardTitle className="text-base">Select Slot for {addingOffering.name}</CardTitle>
                              <CardDescription>{addingOffering.structure} · {addingOffering.time}</CardDescription>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => { setAddingOffering(null); setAddingSlot(null); setAddingDate(new Date()); setAddingQty(1); }}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex items-center gap-3 flex-wrap">
                            <div className="flex-1 min-w-[180px]">
                              <Label className="text-xs text-muted-foreground">Date</Label>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button variant="outline" className="w-full justify-start h-9 font-normal mt-1">
                                    <CalendarIcon className="h-4 w-4 mr-2" />
                                    {addingDate ? format(addingDate, "EEE, dd MMM yyyy") : "Pick a date"}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                  <Calendar
                                    mode="single"
                                    selected={addingDate}
                                    onSelect={(d) => { setAddingDate(d); setAddingSlot(null); }}
                                    disabled={(d) => {
                                      const today = new Date();
                                      today.setHours(0, 0, 0, 0);
                                      return d < today;
                                    }}
                                    initialFocus
                                    className="pointer-events-auto"
                                  />
                                </PopoverContent>
                              </Popover>
                            </div>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">
                              {addingDate ? `Available time slots` : "Pick a date to view slots"}
                            </Label>
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 mt-2 max-h-[180px] overflow-y-auto pr-1">
                              {addingDate && buildSlotsForDate(addingOffering, addingDate).map(slot => (
                                <button
                                  key={slot.id}
                                  onClick={() => { setAddingSlot(slot); setAddingQty(q => Math.min(q, slot.available)); }}
                                  className={`p-2 border rounded-lg text-left transition-all text-sm hover:bg-muted/50 ${addingSlot?.id === slot.id ? "border-primary bg-primary/5 ring-2 ring-primary/20" : ""
                                    }`}
                                >
                                  <p className="font-semibold text-xs">{slot.timeLabel}</p>
                                  <Badge variant="secondary" className="text-[9px] mt-1">{slot.available} left</Badge>
                                </button>
                              ))}
                            </div>
                          </div>
                          {addingOffering.prasadamIncluded && (
                            <div className="flex items-center justify-between rounded-lg border p-3 bg-muted/30">
                              <div className="flex items-center gap-2">
                                <Cookie className="h-4 w-4 text-primary" />
                                <div>
                                  <p className="text-sm font-medium">{addingOffering.prasadamItems.map(p => p.name).join(", ")}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {addingOffering.prasadamItems.reduce((s, p) => s + p.price * p.quantity, 0) > 0 ? `₹${addingOffering.prasadamItems.reduce((s, p) => s + p.price * p.quantity, 0)} per unit` : "Free"}
                                  </p>
                                </div>
                              </div>
                              <Switch checked={addingPrasadam} onCheckedChange={setAddingPrasadam} />
                            </div>
                          )}
                          <div className="flex items-end gap-3">
                            <div className="flex-1">
                              <Label className="text-xs">Quantity</Label>
                              <Input
                                type="number" min={1}
                                max={addingSlot?.available ?? addingOffering.available}
                                value={addingQty}
                                onChange={e => setAddingQty(Math.min(+e.target.value, addingSlot?.available ?? addingOffering.available))}
                                className="w-24 h-9"
                                disabled={!addingSlot}
                              />
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-muted-foreground">Subtotal</p>
                              <p className="font-bold text-lg">
                                ₹{(addingOffering.price + (addingPrasadam && addingOffering.prasadamIncluded ? addingOffering.prasadamItems.reduce((s, p) => s + p.price * p.quantity, 0) : 0)) * addingQty}
                              </p>
                            </div>
                            <Button onClick={addToCart} disabled={!addingSlot} className="gap-1.5">
                              <Plus className="h-4 w-4" />Add to Cart
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Offerings Grid */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Available Offerings</CardTitle>
                    <CardDescription>Click an offering to select slot and add to cart</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-3 mb-4">
                      <Select value={filterStructure} onValueChange={setFilterStructure}>
                        <SelectTrigger className="w-[160px] bg-background"><SelectValue /></SelectTrigger>
                        <SelectContent className="bg-popover">{structureOptions.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}</SelectContent>
                      </Select>
                      <Select value={filterType} onValueChange={setFilterType}>
                        <SelectTrigger className="w-[130px] bg-background"><SelectValue /></SelectTrigger>
                        <SelectContent className="bg-popover"><SelectItem value="all">All Types</SelectItem><SelectItem value="Ritual">Ritual</SelectItem><SelectItem value="Darshan">Darshan</SelectItem></SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {filteredOfferings.map(o => {
                        const inCart = cart.some(c => c.offering.id === o.id);
                        return (
                          <button
                            key={o.id}
                            onClick={() => { setAddingOffering(o); setAddingSlot(null); setAddingQty(1); setAddingPrasadam(false); }}
                            className={`p-4 border rounded-lg text-left hover:border-primary hover:bg-muted/50 transition-all relative ${addingOffering?.id === o.id ? "border-primary bg-primary/5" : ""
                              }`}
                          >
                            {inCart && (
                              <div className="absolute top-2 right-2">
                                <Badge variant="default" className="text-[10px] gap-1"><ShoppingCart className="h-2.5 w-2.5" />In Cart</Badge>
                              </div>
                            )}
                            <div className="flex items-center justify-between mb-1 pr-16">
                              <span className="font-medium">{o.name}</span>
                              <Badge variant={o.type === "Ritual" ? "default" : "secondary"} className="text-[10px]">{o.type}</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">{o.structure} · {o.time}</p>
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-sm">{o.price > 0 ? `₹${o.price}` : "Free"}</span>
                                {o.prasadamIncluded && (
                                  <Badge variant="outline" className="text-[9px] gap-0.5">
                                    <Cookie className="h-2.5 w-2.5" />Prasad
                                  </Badge>
                                )}
                              </div>
                              <span className="text-xs text-muted-foreground font-medium">{o.available} available</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Step 2 – Devotee Details */}
            {currentStep === 1 && (
              <Card>
                <CardHeader><CardTitle className="text-base">Devotee Details</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div><Label>Name</Label><Input value={devotee.name} onChange={e => setDevotee({ ...devotee, name: e.target.value })} placeholder="Devotee full name" /></div>
                    <div><Label>Mobile Number</Label><Input value={devotee.phone} onChange={e => setDevotee({ ...devotee, phone: e.target.value })} placeholder="+91 XXXXX XXXXX" /></div>
                  </div>
                  <div><Label>Email (Optional)</Label><Input value={devotee.email} onChange={e => setDevotee({ ...devotee, email: e.target.value })} placeholder="email@example.com" /></div>
                  {hasRitualInCart && (
                    <>
                      <Separator />
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Ritual Details</p>
                      <div className="grid grid-cols-2 gap-3">
                        <div><Label>Gothram</Label><SearchableSelect options={gothramOptions} value={devotee.gothram} onValueChange={v => setDevotee({ ...devotee, gothram: v })} placeholder="Select Gothram" /></div>
                        <div><Label>Nakshatra</Label><SearchableSelect options={nakshatraOptions} value={devotee.nakshatra} onValueChange={v => setDevotee({ ...devotee, nakshatra: v })} placeholder="Select Nakshatra" /></div>
                      </div>
                      <div><Label>Sankalpam</Label><Input value={devotee.sankalpam} onChange={e => setDevotee({ ...devotee, sankalpam: e.target.value })} placeholder="Enter sankalpam details" /></div>
                    </>
                  )}
                  <Separator />
                  <CustomFieldsSection fields={customFields} onFieldsChange={setCustomFields} />
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setCurrentStep(0)}>Back</Button>
                    <Button onClick={() => setCurrentStep(2)} disabled={!devotee.name || !devotee.phone}>Continue</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3 – Payment */}
            {currentStep === 2 && (
              <Card>
                <CardHeader><CardTitle className="text-base">Payment</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                    {cart.map(item => {
                      const prasadamCost = item.includePrasadam && item.offering.prasadamIncluded && item.offering.prasadamItems.length > 0 ? item.offering.prasadamItems.reduce((s, p) => s + p.price * p.quantity, 0) * item.quantity : 0;
                      return (
                        <div key={item.cartId} className="text-sm">
                          <div className="flex justify-between">
                            <span>{item.offering.name} <span className="text-muted-foreground">× {item.quantity}</span></span>
                            <span className="font-medium">₹{item.offering.price * item.quantity}</span>
                          </div>
                          {item.includePrasadam && item.offering.prasadamIncluded && item.offering.prasadamItems.length > 0 && (
                            <div className="flex justify-between text-xs text-muted-foreground ml-4">
                              <span>+ {item.offering.prasadamItems.map(p => p.name).join(", ")}</span>
                              <span>{item.offering.prasadamItems.reduce((s, p) => s + p.price * p.quantity, 0) > 0 ? `₹${prasadamCost}` : "Free"}</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                    <Separator className="my-2" />
                    <div className="flex justify-between font-bold text-lg"><span>Total</span><span>₹{cartTotal}</span></div>
                  </div>
                  <div className="space-y-4">
                    <Label>Payment Mode</Label>
                    {COUNTER_PAYMENT_GROUPS.map((group, groupIndex) => (
                      <div
                        key={group.title}
                        className={`rounded-xl border p-3 space-y-2.5 ${groupIndex === 0 ? "bg-amber-50/60 border-amber-200/80" : "bg-sky-50/50 border-sky-200/80"}`}
                      >
                        <p
                          className={`text-xs font-bold uppercase tracking-wide px-2.5 py-1 rounded-md w-fit ${groupIndex === 0
                              ? "bg-amber-100 text-amber-900 border border-amber-200"
                              : "bg-sky-100 text-sky-900 border border-sky-200"
                            }`}
                        >
                          {group.title}
                        </p>
                        <div className={`grid gap-2 ${group.modes.length === 3 ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-2"}`}>
                          {group.modes.map((modeId) => {
                            const mode = getCounterPaymentMode(modeId);
                            const selected = paymentMode === mode.id;
                            return (
                              <button
                                key={mode.id}
                                type="button"
                                onClick={() => selectPaymentMode(mode.id)}
                                className={`p-3 border-2 rounded-lg text-left transition-all ${selected
                                    ? groupIndex === 0
                                      ? "border-amber-600 bg-amber-100/80 shadow-sm ring-1 ring-amber-300/50"
                                      : "border-sky-600 bg-sky-100/80 shadow-sm ring-1 ring-sky-300/50"
                                    : "border-border bg-background hover:bg-muted/30"
                                  }`}
                              >
                                <span className={`text-sm font-semibold block ${selected ? "text-foreground" : ""}`}>
                                  {mode.label}
                                </span>
                                <span className={`text-[10px] leading-snug mt-1 block ${selected ? "text-foreground/80" : "text-muted-foreground"}`}>
                                  {mode.purpose}
                                </span>
                                {selected && paymentConfigured ? (
                                  <span className="text-[9px] font-semibold mt-2 block text-emerald-700">✓ Ready — tap to edit</span>
                                ) : (
                                  <span className={`text-[9px] mt-2 block ${selected ? (groupIndex === 0 ? "text-amber-700 font-semibold" : "text-sky-700 font-semibold") : "text-muted-foreground/70"}`}>
                                    {selected ? "Complete in popup" : "Tap to open"}
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>

                  {paymentConfigured && (
                    <div className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50/60 px-3 py-2.5 text-sm">
                      <span className="text-emerald-800">
                        <span className="font-medium">{getCounterPaymentMode(paymentMode).label}</span> payment ready
                        {refNumber && paymentModeNeedsRef(paymentMode) && (
                          <span className="text-emerald-700/80"> · Ref: {refNumber}</span>
                        )}
                      </span>
                      <Button type="button" variant="ghost" size="sm" className="h-7 text-xs text-emerald-800" onClick={() => setPaymentDialogOpen(true)}>
                        Edit
                      </Button>
                    </div>
                  )}

                  <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
                    <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                      {(() => {
                        const modeMeta = getCounterPaymentMode(paymentMode);
                        const ModeIcon = paymentModeIcon(paymentMode);
                        return (
                          <>
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-2">
                                <ModeIcon className="h-5 w-5 text-primary" />
                                {modeMeta.label}
                              </DialogTitle>
                              <DialogDescription>{modeMeta.purpose}</DialogDescription>
                            </DialogHeader>

                            <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2 text-sm">
                              <span className="text-muted-foreground">Amount to collect</span>
                              <span className="font-bold">₹{cartTotal.toLocaleString("en-IN")}</span>
                            </div>

                            <div className="space-y-4 py-1">
                              {paymentMode === "Cash" && (
                                <p className="text-sm text-muted-foreground">
                                  Collect <span className="font-semibold text-foreground">₹{cartTotal.toLocaleString("en-IN")}</span> in cash at the counter. No reference number is needed.
                                </p>
                              )}

                              {paymentMode === "UPI" && (
                                <>
                                  {devotee.phone.replace(/\D/g, "").slice(-10).length !== 10 ? (
                                    <p className="text-sm text-destructive rounded-lg border border-destructive/30 bg-destructive/5 p-3">
                                      Add a valid 10-digit mobile number in devotee details to send the WhatsApp payment link.
                                    </p>
                                  ) : (
                                    <DigitalPaymentWaiting
                                      mode="UPI"
                                      amount={cartTotal}
                                      phone={devotee.phone.replace(/\D/g, "").slice(-10)}
                                      received={upiPaymentReceived}
                                      onPaymentReceived={() => setUpiPaymentReceived(true)}
                                    />
                                  )}
                                  {upiLinkSent && !upiPaymentReceived && (
                                    <p className="text-[11px] text-center text-muted-foreground">Link sent · waiting for devotee to pay</p>
                                  )}
                                </>
                              )}

                              {paymentMode === "QR Code" && (
                                <DigitalPaymentWaiting
                                  mode="QR Code"
                                  amount={cartTotal}
                                  phone=""
                                  received={qrPaymentStatus === "Paid"}
                                  onPaymentReceived={() => setQrPaymentStatus("Paid")}
                                />
                              )}

                              {paymentModeNeedsRef(paymentMode) && (
                                <div className="space-y-2">
                                  <Label>
                                    {"refLabel" in modeMeta ? modeMeta.refLabel : "Reference"} *
                                  </Label>
                                  <Input
                                    value={refNumber}
                                    onChange={(e) => setRefNumber(e.target.value)}
                                    placeholder={"refPlaceholder" in modeMeta ? modeMeta.refPlaceholder : ""}
                                    autoFocus
                                  />
                                  <p className="text-[11px] text-muted-foreground">
                                    Enter the reference from cheque, bank receipt, or UPI confirmation.
                                  </p>
                                </div>
                              )}
                            </div>

                            <DialogFooter className="gap-2 sm:gap-0">
                              <Button type="button" variant="outline" onClick={() => setPaymentDialogOpen(false)}>
                                Cancel
                              </Button>
                              <Button type="button" onClick={confirmPaymentDialog}>
                                Confirm Payment
                              </Button>
                            </DialogFooter>
                          </>
                        );
                      })()}
                    </DialogContent>
                  </Dialog>

                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setCurrentStep(1)}>Back</Button>
                    <Button
                      onClick={() => {
                        if (!paymentConfigured) {
                          toast.error("Select a payment mode and complete the popup first");
                          setPaymentDialogOpen(true);
                          return;
                        }
                        setCurrentStep(3);
                      }}
                    >
                      Continue
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 4 – Confirm */}
            {currentStep === 3 && (
              <Card>
                <CardHeader><CardTitle className="text-base">Confirm Booking</CardTitle><CardDescription>Review all details before confirming</CardDescription></CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 p-4 border rounded-lg">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Sevas ({cart.length})</p>
                    {cart.map(item => {
                      const prasadamCost = item.includePrasadam && item.offering.prasadamIncluded && item.offering.prasadamItems.length > 0 ? item.offering.prasadamItems.reduce((s, p) => s + p.price * p.quantity, 0) * item.quantity : 0;
                      return (
                        <div key={item.cartId} className="text-sm">
                          <div className="flex justify-between">
                            <div>
                              <span className="font-medium">{item.offering.name}</span>
                              <span className="text-muted-foreground text-xs ml-2">{item.offering.structure} · {item.slot.dateLabel} {item.slot.timeLabel} · ×{item.quantity}</span>
                            </div>
                            <span className="font-medium">₹{item.offering.price * item.quantity}</span>
                          </div>
                          {item.includePrasadam && item.offering.prasadamIncluded && item.offering.prasadamItems.length > 0 && (
                            <div className="flex justify-between text-xs text-muted-foreground ml-4">
                              <span>+ {item.offering.prasadamItems.map(p => p.name).join(", ")} × {item.quantity}</span>
                              <span>{item.offering.prasadamItems.reduce((s, p) => s + p.price * p.quantity, 0) > 0 ? `₹${prasadamCost}` : "Free"}</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                    <Separator />
                    <div className="flex justify-between text-sm"><span className="text-muted-foreground">Devotee</span><span className="font-medium">{devotee.name}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-muted-foreground">Phone</span><span className="font-medium">{devotee.phone}</span></div>
                    {devotee.gothram && <div className="flex justify-between text-sm"><span className="text-muted-foreground">Gothram</span><span className="font-medium">{devotee.gothram}</span></div>}
                    {devotee.nakshatra && <div className="flex justify-between text-sm"><span className="text-muted-foreground">Nakshatra</span><span className="font-medium">{devotee.nakshatra}</span></div>}
                    <Separator />
                    <div className="flex justify-between text-sm"><span className="text-muted-foreground">Payment</span><span className="font-medium">{getCounterPaymentMode(paymentMode).label}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-muted-foreground">Purpose</span><span className="text-right text-xs max-w-[60%]">{getCounterPaymentMode(paymentMode).purpose}</span></div>
                    {paymentMode === "UPI" && upiLinkSent && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">WhatsApp Link</span>
                        <span className="font-medium text-xs">Sent to +91 {devotee.phone.replace(/\D/g, "").slice(-10)}</span>
                      </div>
                    )}
                    {paymentMode === "QR Code" && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">QR Payment</span>
                        <Badge variant="secondary">{qrPaymentStatus}</Badge>
                      </div>
                    )}
                    {refNumber && paymentModeNeedsRef(paymentMode) && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{(getCounterPaymentMode(paymentMode) as { refLabel?: string }).refLabel ?? "Reference"}</span>
                        <span className="font-medium font-mono text-xs">{refNumber}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm font-bold text-base"><span>Total Amount</span><span>₹{cartTotal}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-muted-foreground">Source</span><Badge variant="secondary">Counter</Badge></div>
                  </div>
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setCurrentStep(2)}>Back</Button>
                    <Button onClick={handleConfirm} className="gap-2"><Store className="h-4 w-4" />Confirm & Book</Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Cart Sidebar – always visible */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      <ShoppingCart className="h-4 w-4" />Cart
                    </CardTitle>
                    <Badge variant="secondary">{cart.length} item{cart.length !== 1 ? "s" : ""}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {cart.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground">
                      <ShoppingCart className="h-8 w-8 mx-auto mb-2 opacity-40" />
                      <p className="text-sm">Cart is empty</p>
                      <p className="text-xs mt-1">Click an offering to add</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <AnimatePresence>
                        {cart.map(item => (
                          <motion.div
                            key={item.cartId}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="p-3 border rounded-lg space-y-2"
                          >
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="font-medium text-sm">{item.offering.name}</p>
                                <p className="text-[10px] text-muted-foreground">{item.offering.structure}</p>
                                <p className="text-[10px] text-muted-foreground">{item.slot.dateLabel} · {item.slot.timeLabel}</p>
                                {item.includePrasadam && item.offering.prasadamIncluded && item.offering.prasadamItems.length > 0 && (
                                  <p className="text-[10px] text-primary flex items-center gap-1 mt-0.5">
                                    <Cookie className="h-2.5 w-2.5" />
                                    {item.offering.prasadamItems.map(p => p.name).join(", ")} {item.offering.prasadamItems.reduce((s, p) => s + p.price * p.quantity, 0) > 0 ? `(₹${item.offering.prasadamItems.reduce((s, p) => s + p.price * p.quantity, 0)})` : "(Free)"}
                                  </p>
                                )}
                              </div>
                              <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive hover:text-destructive" onClick={() => removeFromCart(item.cartId)}>
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1">
                                <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateCartQty(item.cartId, item.quantity - 1)} disabled={item.quantity <= 1}>
                                  <span className="text-xs">−</span>
                                </Button>
                                <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                                <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateCartQty(item.cartId, item.quantity + 1)} disabled={item.quantity >= item.slot.available}>
                                  <span className="text-xs">+</span>
                                </Button>
                              </div>
                              <span className="font-semibold text-sm">₹{(item.offering.price + (item.includePrasadam && item.offering.prasadamIncluded && item.offering.prasadamItems.length > 0 ? item.offering.prasadamItems.reduce((s, p) => s + p.price * p.quantity, 0) : 0)) * item.quantity}</span>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>

                      <Separator />

                      <div className="flex justify-between font-bold">
                        <span>Total</span>
                        <span>₹{cartTotal}</span>
                      </div>

                      {currentStep === 0 && (
                        <Button className="w-full gap-2" onClick={() => setCurrentStep(1)} disabled={cart.length === 0}>
                          Proceed <ChevronRight className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CounterBooking;
