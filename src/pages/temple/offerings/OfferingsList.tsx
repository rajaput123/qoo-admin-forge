import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, Pencil, Eye, List, Clock, IndianRupee, Image as ImageIcon, History, LayoutGrid, Calendar, Info, AlertTriangle, Ban } from "lucide-react";
import { toast } from "sonner";
import SearchableSelect from "@/components/SearchableSelect";
import CustomFieldsSection, { CustomField } from "@/components/CustomFieldsSection";
import { getTemplatesByType } from "@/data/receiptTemplateData";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format, isPast, parseISO } from "date-fns";

type FrequencyType = "Daily" | "Weekly" | "Monthly" | "Annual" | "On Demand";
type MonthlyMode = "specific-date" | "nth-weekday";
const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;
const NTH_OPTIONS = ["1st", "2nd", "3rd", "4th", "Last"] as const;
const WEEKDAY_FULL = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] as const;

interface PrasadamItem {
  name: string;
  quantity: number;
  price: number;
  showOnline: boolean;
}

interface Offering {
  id: string;
  name: string;
  type: "Ritual" | "Darshan";
  category: string;
  structure: string;
  defaultTime: string;
  basePrice: number;
  price: number;
  capacity: number;
  status: "Active" | "Inactive" | "Draft";
  description: string;
  endTime: string;
  frequency: string;
  dateRange: string;
  endDate?: string;
  maxPerDevotee: number;
  groupBooking: boolean;
  free: boolean;
  refundable: boolean;
  priestRequired: boolean;
  sankalpam: boolean;
  gothram: boolean;
  nakshatra: boolean;
  walkinTracking: boolean;
  vipEnabled: boolean;
  availableOnline: boolean;
  availableCounter: boolean;
  prasadamIncluded?: boolean;
  prasadamItems?: PrasadamItem[];
  images: string[];
  createdAt: string;
}

const mockOfferings: Offering[] = [
  { id: "1", name: "Suprabhatam", type: "Ritual", category: "Daily Seva", structure: "Main Temple", defaultTime: "5:30 AM", basePrice: 500, price: 500, capacity: 50, status: "Active", description: "Morning awakening ceremony for the deity", endTime: "6:00 AM", frequency: "Daily", dateRange: "All Year", maxPerDevotee: 2, groupBooking: false, free: false, refundable: true, priestRequired: true, sankalpam: true, gothram: true, nakshatra: false, walkinTracking: false, vipEnabled: false, availableOnline: true, availableCounter: true, prasadamIncluded: true, prasadamItems: [{ name: "Laddu Prasadam", quantity: 2, price: 50, showOnline: true }], images: ["https://images.unsplash.com/photo-1600693577615-9f3a0f7a16ba?w=400", "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=400"], createdAt: "2024-01-15" },
  { id: "2", name: "Archana", type: "Ritual", category: "Daily Seva", structure: "Padmavathi Shrine", defaultTime: "7:00 AM", basePrice: 100, price: 200, capacity: 30, status: "Active", description: "Chanting of 108 names", endTime: "7:30 AM", frequency: "Daily", dateRange: "All Year", endDate: "2026-06-30", maxPerDevotee: 5, groupBooking: true, free: false, refundable: false, priestRequired: true, sankalpam: true, gothram: true, nakshatra: true, walkinTracking: false, vipEnabled: false, availableOnline: true, availableCounter: true, prasadamIncluded: true, prasadamItems: [{ name: "Pulihora", quantity: 1, price: 0, showOnline: false }], images: ["https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=400"], createdAt: "2024-01-10" },
  { id: "3", name: "Abhishekam", type: "Ritual", category: "Special Seva", structure: "Main Temple", defaultTime: "9:00 AM", basePrice: 2000, price: 2000, capacity: 25, status: "Active", description: "Sacred bathing ceremony with milk, honey, and holy water", endTime: "10:00 AM", frequency: "Daily", dateRange: "All Year", endDate: "2026-12-31", maxPerDevotee: 1, groupBooking: false, free: false, refundable: true, priestRequired: true, sankalpam: true, gothram: true, nakshatra: true, walkinTracking: false, vipEnabled: false, availableOnline: true, availableCounter: true, images: ["https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=400"], createdAt: "2024-01-12" },
  { id: "4", name: "Morning Darshan", type: "Darshan", category: "Regular", structure: "Main Temple", defaultTime: "6:00 AM", basePrice: 0, price: 0, capacity: 500, status: "Active", description: "General morning darshan", endTime: "10:00 AM", frequency: "Daily", dateRange: "All Year", maxPerDevotee: 10, groupBooking: true, free: true, refundable: false, priestRequired: false, sankalpam: false, gothram: false, nakshatra: false, walkinTracking: true, vipEnabled: true, availableOnline: true, availableCounter: true, images: ["https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=400"], createdAt: "2024-01-08" },
  { id: "5", name: "VIP Darshan", type: "Darshan", category: "VIP", structure: "Main Temple", defaultTime: "8:00 AM", basePrice: 300, price: 150, capacity: 100, status: "Active", description: "Priority darshan with shorter wait", endTime: "10:00 AM", frequency: "Daily", dateRange: "All Year", endDate: "2026-04-15", maxPerDevotee: 4, groupBooking: true, free: false, refundable: true, priestRequired: false, sankalpam: false, gothram: false, nakshatra: false, walkinTracking: false, vipEnabled: true, availableOnline: true, availableCounter: false, images: [], createdAt: "2024-01-09" },
  { id: "6", name: "Sahasranama", type: "Ritual", category: "Special Seva", structure: "Varadaraja Shrine", defaultTime: "11:00 AM", basePrice: 1500, price: 1500, capacity: 40, status: "Inactive", description: "Recitation of 1000 names", endTime: "12:00 PM", frequency: "Weekly", dateRange: "All Year", endDate: "2026-03-31", maxPerDevotee: 2, groupBooking: false, free: false, refundable: true, priestRequired: true, sankalpam: true, gothram: true, nakshatra: false, walkinTracking: false, vipEnabled: false, availableOnline: false, availableCounter: true, images: [], createdAt: "2024-02-01" },
  { id: "7", name: "Special Puja", type: "Ritual", category: "Special Seva", structure: "Main Temple", defaultTime: "10:00 AM", basePrice: 1000, price: 500, capacity: 20, status: "Active", description: "Special puja with 50% discount", endTime: "11:00 AM", frequency: "Daily", dateRange: "All Year", maxPerDevotee: 3, groupBooking: true, free: false, refundable: true, priestRequired: true, sankalpam: true, gothram: true, nakshatra: true, walkinTracking: false, vipEnabled: false, availableOnline: true, availableCounter: true, images: [], createdAt: "2024-02-05" },
];

const structureOptions = [
  { value: "Main Temple", label: "Main Temple" },
  { value: "Padmavathi Shrine", label: "↳ Padmavathi Shrine" },
  { value: "Varadaraja Shrine", label: "↳ Varadaraja Shrine" },
  { value: "Lakshmi Shrine", label: "↳ Lakshmi Shrine" },
  { value: "Samadhi Hall", label: "↳ Samadhi Hall" },
];

const categoryOptions = [
  { value: "Daily Seva", label: "Daily Seva" },
  { value: "Special Seva", label: "Special Seva" },
  { value: "Festival Seva", label: "Festival Seva" },
  { value: "Regular", label: "Regular" },
  { value: "VIP", label: "VIP" },
];

const frequencyOptions = [
  { value: "Daily", label: "Daily" },
  { value: "Weekly", label: "Weekly" },
  { value: "Monthly", label: "Monthly" },
  { value: "Annual", label: "Annual" },
  { value: "On Demand", label: "On Demand" },
];

const OfferingsList = () => {
  const [offerings, setOfferings] = useState<Offering[]>(mockOfferings);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [editing, setEditing] = useState<Offering | null>(null);
  const [viewing, setViewing] = useState<Offering | null>(null);
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStructure, setFilterStructure] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [isAddStructureOpen, setIsAddStructureOpen] = useState(false);

  const [form, setForm] = useState({
    name: "", type: "Ritual" as "Ritual" | "Darshan", category: "", structure: "", description: "",
    defaultTime: "", endTime: "", frequency: "Daily" as FrequencyType, dateRange: "",
    capacity: 50, maxPerDevotee: 2, groupBooking: false,
    free: false, basePrice: 0, price: 0,
    priestRequired: true, sankalpam: true, gothram: true, nakshatra: false,
    walkinTracking: false, vipEnabled: false,
    availableOnline: true, availableCounter: true,
    assignedPriest: "",
    receiptTemplate: "",
    prasadamIncluded: false,
    prasadamItems: [] as PrasadamItem[],
  });
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [monthlyMode, setMonthlyMode] = useState<MonthlyMode>("specific-date");
  const [specificDate, setSpecificDate] = useState("1");
  const [nthOrdinal, setNthOrdinal] = useState("2nd");
  const [nthWeekday, setNthWeekday] = useState("Saturday");
  // "all" = every month, "specific" = only chosen months
  const [monthlyScope, setMonthlyScope] = useState<"all" | "specific">("all");
  const [selectedMonths, setSelectedMonths] = useState<number[]>([]);
  // Per-month selected dates for Monthly frequency (multi-date calendar)
  const [monthlyDates, setMonthlyDates] = useState<Date[]>([]);

  const toggleDay = (day: string) => {
    setSelectedDays((prev) => prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]);
  };

  const frequencyHelper: Record<string, string> = {
    Daily: "This seva will be available every day within the selected date range.",
    Weekly: "Seva will repeat on selected weekdays.",
    Monthly: "Seva will repeat monthly based on selected pattern.",
    Annual: "Seva will be available once a year on the specified date.",
    "On Demand": "Seva will be available on-demand without a fixed schedule.",
  };

  const resetForm = () => {
    setForm({ name: "", type: "Ritual", category: "", structure: "", description: "", defaultTime: "", endTime: "", frequency: "Daily" as FrequencyType, dateRange: "", capacity: 50, maxPerDevotee: 2, groupBooking: false, free: false, basePrice: 0, price: 0, priestRequired: true, sankalpam: true, gothram: true, nakshatra: false, walkinTracking: false, vipEnabled: false, availableOnline: true, availableCounter: true, assignedPriest: "", receiptTemplate: "", prasadamIncluded: false, prasadamItems: [] });
    setEditing(null);
    setCustomFields([]);
  };

  const getDiscount = () => {
    if (!form.basePrice || form.basePrice === 0) return { amount: 0, percent: 0 };
    const diff = form.price - form.basePrice;
    const amount = Math.abs(diff);
    const percent = Math.round((amount / form.basePrice) * 100);
    return { amount, percent, isIncrease: diff > 0 };
  };

  const openModal = (o?: Offering) => {
    if (o) {
      setEditing(o);
      setForm({ name: o.name, type: o.type, category: o.category, structure: o.structure, description: o.description, defaultTime: o.defaultTime, endTime: o.endTime, frequency: o.frequency as FrequencyType, dateRange: o.dateRange, capacity: o.capacity, maxPerDevotee: o.maxPerDevotee, groupBooking: o.groupBooking, free: o.free, basePrice: o.basePrice, price: o.price || o.basePrice, priestRequired: o.priestRequired, sankalpam: o.sankalpam, gothram: o.gothram, nakshatra: o.nakshatra, walkinTracking: o.walkinTracking, vipEnabled: o.vipEnabled, availableOnline: o.availableOnline ?? true, availableCounter: o.availableCounter ?? true, assignedPriest: (o as any).assignedPriest || "", receiptTemplate: (o as any).receiptTemplate || "", prasadamIncluded: o.prasadamIncluded || false, prasadamItems: (o.prasadamItems || []).map(item => ({ ...item, showOnline: item.showOnline ?? true })) });
    } else resetForm();
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (editing) {
      setOfferings(offerings.map(o => o.id === editing.id ? { ...o, ...form } : o));
      toast.success("Offering updated");
    } else {
      setOfferings([...offerings, { id: Date.now().toString(), ...form, refundable: false, status: "Active", images: [], createdAt: new Date().toISOString().split("T")[0] }]);
      toast.success("Offering created");
    }
    setIsModalOpen(false);
    resetForm();
  };

  const isExpired = (o: Offering) => o.endDate ? isPast(parseISO(o.endDate)) : false;

  const getEffectiveStatus = (o: Offering): string => {
    if (isExpired(o)) return "Expired";
    return o.status;
  };

  const getStatusBadge = (o: Offering) => {
    const status = getEffectiveStatus(o);
    if (status === "Expired") {
      return <Badge variant="destructive" className="gap-1"><AlertTriangle className="h-3 w-3" />Expired</Badge>;
    }
    return <Badge variant={o.status === "Active" ? "default" : "secondary"}>{o.status}</Badge>;
  };

  const filtered = offerings.filter(o => {
    if (searchQuery && !o.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (filterType !== "all" && o.type !== filterType) return false;
    if (filterStructure !== "all" && o.structure !== filterStructure) return false;
    if (filterStatus !== "all") {
      const effective = getEffectiveStatus(o);
      if (effective !== filterStatus) return false;
    }
    return true;
  });

  return (
    <div className="p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Offerings List</h1>
            <p className="text-muted-foreground">Create and manage Rituals and Darshan definitions</p>
          </div>
          <div className="flex gap-2">
            <div className="flex border rounded-lg overflow-hidden">
              <Button variant={viewMode === "table" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("table")} className="rounded-none gap-1"><List className="h-4 w-4" /></Button>
              <Button variant={viewMode === "grid" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("grid")} className="rounded-none gap-1"><LayoutGrid className="h-4 w-4" /></Button>
            </div>
            <Button onClick={() => openModal()} className="gap-2"><Plus className="h-4 w-4" />Add Offering</Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search offerings..." className="pl-9" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[140px] bg-background"><SelectValue placeholder="Type" /></SelectTrigger>
            <SelectContent className="bg-popover"><SelectItem value="all">All Types</SelectItem><SelectItem value="Ritual">Ritual</SelectItem><SelectItem value="Darshan">Darshan</SelectItem></SelectContent>
          </Select>
          <Select value={filterStructure} onValueChange={setFilterStructure}>
            <SelectTrigger className="w-[160px] bg-background"><SelectValue placeholder="Structure" /></SelectTrigger>
            <SelectContent className="bg-popover"><SelectItem value="all">All Structures</SelectItem>{structureOptions.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[130px] bg-background"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent className="bg-popover"><SelectItem value="all">All Status</SelectItem><SelectItem value="Active">Active</SelectItem><SelectItem value="Inactive">Inactive</SelectItem><SelectItem value="Draft">Draft</SelectItem><SelectItem value="Expired">Expired</SelectItem></SelectContent>
          </Select>
        </div>

        {viewMode === "table" ? (
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg"><List className="h-5 w-5 text-primary" /></div>
                <div><CardTitle>All Offerings</CardTitle><CardDescription>{filtered.length} offerings configured</CardDescription></div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[60px]">Image</TableHead>
                    <TableHead>Offering Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Structure</TableHead>
                    <TableHead>Default Time</TableHead>
                    <TableHead className="text-right">Base Price</TableHead>
                    <TableHead className="text-center">Capacity</TableHead>
                    <TableHead>Channels</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map(o => (
                    <TableRow key={o.id} className="cursor-pointer hover:bg-muted/50" onClick={() => { setViewing(o); setIsViewOpen(true); }}>
                      <TableCell>
                        {o.images.length > 0 ? (
                          <img src={o.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover" />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center"><ImageIcon className="h-4 w-4 text-muted-foreground" /></div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{o.name}</TableCell>
                      <TableCell><Badge variant={o.type === "Ritual" ? "default" : "secondary"}>{o.type}</Badge></TableCell>
                      <TableCell className="text-muted-foreground text-sm">{o.structure}</TableCell>
                      <TableCell className="text-sm">{o.defaultTime}</TableCell>
                      <TableCell className="text-right">{o.free ? "Free" : `₹${o.basePrice}`}</TableCell>
                      <TableCell className="text-center">{o.capacity}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {o.availableOnline && <Badge variant="outline" className="text-[10px]">Online</Badge>}
                          {o.availableCounter && <Badge variant="outline" className="text-[10px]">Counter</Badge>}
                          {!o.availableOnline && !o.availableCounter && <span className="text-xs text-muted-foreground">—</span>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          {getStatusBadge(o)}
                          {o.endDate && !isExpired(o) && (
                            <span className="text-[10px] text-muted-foreground whitespace-nowrap">Ends: {format(new Date(o.endDate), "dd MMM yyyy")}</span>
                          )}
                          {isExpired(o) && (
                            <span className="text-[10px] text-destructive whitespace-nowrap flex items-center gap-0.5"><Ban className="h-2.5 w-2.5" />Bookings Closed</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" onClick={e => { e.stopPropagation(); setViewing(o); setIsViewOpen(true); }}><Eye className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" onClick={e => { e.stopPropagation(); openModal(o); }}><Pencil className="h-4 w-4" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filtered.length === 0 && (
                    <TableRow><TableCell colSpan={10} className="text-center py-8 text-muted-foreground">No offerings found</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(o => (
              <Card key={o.id} className="cursor-pointer hover:shadow-md transition-all overflow-hidden group" onClick={() => { setViewing(o); setIsViewOpen(true); }}>
                <div className="relative h-40 bg-muted">
                  {o.images.length > 0 ? (
                    <img src={o.images[0]} alt={o.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"><ImageIcon className="h-10 w-10 text-muted-foreground opacity-40" /></div>
                  )}
                  {o.images.length > 1 && (
                    <Badge variant="secondary" className="absolute bottom-2 right-2 text-[10px]">+{o.images.length - 1} photos</Badge>
                  )}
                  <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                    <Badge variant={o.type === "Ritual" ? "default" : "secondary"}>{o.type}</Badge>
                    {getStatusBadge(o)}
                    {o.endDate && !isExpired(o) && (
                      <Badge variant="outline" className="text-[9px] bg-background/80">Ends: {format(new Date(o.endDate), "dd MMM yyyy")}</Badge>
                    )}
                    {isExpired(o) && (
                      <Badge variant="destructive" className="text-[9px] gap-0.5"><Ban className="h-2.5 w-2.5" />Bookings Closed</Badge>
                    )}
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-1">{o.name}</h3>
                  <p className="text-xs text-muted-foreground mb-2">{o.structure} · {o.defaultTime}</p>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{o.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm">{o.free ? "Free" : `₹${o.basePrice}`}</span>
                    <span className="text-xs text-muted-foreground">Cap: {o.capacity}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
            {filtered.length === 0 && (
              <div className="col-span-3 text-center py-12 text-muted-foreground">No offerings found</div>
            )}
          </div>
        )}
      </motion.div>

      {/* View Detail Modal */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto bg-background">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg"><List className="h-5 w-5 text-primary" /></div>
                <div>
                  <DialogTitle>{viewing?.name}</DialogTitle>
                  <DialogDescription>{viewing?.type} · {viewing?.structure}</DialogDescription>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {viewing && getStatusBadge(viewing)}
                {viewing?.endDate && !isExpired(viewing) && (
                  <Badge variant="outline" className="text-[10px]">Ends: {format(new Date(viewing.endDate), "dd MMM yyyy")}</Badge>
                )}
                {viewing && isExpired(viewing) && (
                  <Badge variant="destructive" className="text-[10px] gap-1"><Ban className="h-3 w-3" />Bookings Closed</Badge>
                )}
                <Button size="sm" variant="outline" onClick={() => { setIsViewOpen(false); if (viewing) openModal(viewing); }}>Edit</Button>
              </div>
            </div>
          </DialogHeader>
          <Tabs defaultValue="overview" className="mt-4">
            <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
              {["overview", "schedule", "pricing", "settings", "gallery", "history"].map(t => (
                <TabsTrigger key={t} value={t} className="rounded-none border-b-2 border-transparent data-[state=active]:border-amber-700 data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:font-medium px-4 py-2 text-sm text-muted-foreground capitalize">{t}</TabsTrigger>
              ))}
            </TabsList>
            <TabsContent value="overview" className="mt-4 space-y-4">
              {viewing?.images && viewing.images.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {viewing.images.map((img, i) => (
                    <img key={i} src={img} alt={viewing.name} className={`w-full ${i === 0 && viewing.images.length === 1 ? "h-48 col-span-2" : "h-32"} object-cover rounded-lg`} />
                  ))}
                </div>
              )}
              <p className="text-sm text-muted-foreground">{viewing?.description}</p>
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-muted/50 rounded-lg"><p className="text-xs text-muted-foreground">Category</p><p className="font-medium">{viewing?.category}</p></div>
                <div className="p-3 bg-muted/50 rounded-lg"><p className="text-xs text-muted-foreground">Frequency</p><p className="font-medium">{viewing?.frequency}</p></div>
                <div className="p-3 bg-muted/50 rounded-lg"><p className="text-xs text-muted-foreground">Capacity</p><p className="font-medium">{viewing?.capacity}</p></div>
              </div>
            </TabsContent>
            <TabsContent value="schedule" className="mt-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 border rounded-lg"><p className="text-sm text-muted-foreground">Start Time</p><p className="font-medium">{viewing?.defaultTime}</p></div>
                <div className="p-4 border rounded-lg"><p className="text-sm text-muted-foreground">End Time</p><p className="font-medium">{viewing?.endTime}</p></div>
                <div className="p-4 border rounded-lg"><p className="text-sm text-muted-foreground">Frequency</p><p className="font-medium">{viewing?.frequency}</p></div>
                <div className="p-4 border rounded-lg"><p className="text-sm text-muted-foreground">Date Range</p><p className="font-medium">{viewing?.dateRange || "All Year"}</p></div>
              </div>
            </TabsContent>
            <TabsContent value="pricing" className="mt-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 border rounded-lg"><p className="text-sm text-muted-foreground">Price</p><p className="font-medium">{viewing?.free ? "Free" : `₹${viewing?.basePrice}`}</p></div>
                <div className="p-4 border rounded-lg"><p className="text-sm text-muted-foreground">Refundable</p><p className="font-medium">{viewing?.refundable ? "Yes" : "No"}</p></div>
                <div className="p-4 border rounded-lg"><p className="text-sm text-muted-foreground">Max per Devotee</p><p className="font-medium">{viewing?.maxPerDevotee}</p></div>
                <div className="p-4 border rounded-lg"><p className="text-sm text-muted-foreground">Group Booking</p><p className="font-medium">{viewing?.groupBooking ? "Enabled" : "Disabled"}</p></div>
              </div>
            </TabsContent>
            <TabsContent value="settings" className="mt-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 border rounded-lg flex items-center justify-between"><p className="text-sm">Available Online</p><Badge variant={viewing?.availableOnline ? "default" : "secondary"}>{viewing?.availableOnline ? "Yes" : "No"}</Badge></div>
                <div className="p-4 border rounded-lg flex items-center justify-between"><p className="text-sm">Available at Counter</p><Badge variant={viewing?.availableCounter ? "default" : "secondary"}>{viewing?.availableCounter ? "Yes" : "No"}</Badge></div>
              </div>
              {viewing?.type === "Ritual" ? (
                <div className="grid grid-cols-2 gap-3">
                  {[["Priest Required", viewing.priestRequired], ["Sankalpam Required", viewing.sankalpam], ["Gothram Required", viewing.gothram], ["Nakshatra Required", viewing.nakshatra]].map(([l, v]) => (
                    <div key={l as string} className="p-4 border rounded-lg flex items-center justify-between"><p className="text-sm">{l as string}</p><Badge variant={(v as boolean) ? "default" : "secondary"}>{(v as boolean) ? "Yes" : "No"}</Badge></div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 border rounded-lg flex items-center justify-between"><p className="text-sm">Walk-in Tracking</p><Badge variant={viewing?.walkinTracking ? "default" : "secondary"}>{viewing?.walkinTracking ? "Enabled" : "Disabled"}</Badge></div>
                  <div className="p-4 border rounded-lg flex items-center justify-between"><p className="text-sm">VIP Enabled</p><Badge variant={viewing?.vipEnabled ? "default" : "secondary"}>{viewing?.vipEnabled ? "Enabled" : "Disabled"}</Badge></div>
                </div>
              )}
              {/* Prasadam Info */}
              <div className="mt-4">
                <p className="text-sm font-medium mb-2">Prasadam</p>
                {viewing?.prasadamIncluded && viewing?.prasadamItems?.length ? (
                  <div className="space-y-2">
                    {viewing.prasadamItems.map((item, i) => (
                      <div key={i} className="p-3 border rounded-lg flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">{item.name}</p>
                          <p className="text-xs text-muted-foreground">Qty: {item.quantity} · {item.price > 0 ? `₹${item.price}` : "Free"}</p>
                        </div>
                        <div className="flex gap-1">
                          <Badge variant="default">Included</Badge>
                          <Badge variant="outline">{item.showOnline ? "Online" : "Counter Only"}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No prasadam included</p>
                )}
              </div>
            </TabsContent>
            <TabsContent value="gallery" className="mt-4">
              {viewing?.images && viewing.images.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">{viewing.images.map((img, i) => <img key={i} src={img} alt="" className="w-full h-32 object-cover rounded-lg border" />)}</div>
              ) : (
                <div className="flex flex-col items-center py-8 text-muted-foreground"><ImageIcon className="h-12 w-12 mb-2 opacity-50" /><p>No images</p></div>
              )}
            </TabsContent>
            <TabsContent value="history" className="mt-4">
              <div className="p-4 border rounded-lg flex items-start gap-3"><History className="h-5 w-5 text-primary mt-0.5" /><div><p className="font-medium">Created</p><p className="text-sm text-muted-foreground">{viewing?.createdAt}</p></div></div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={() => { setIsModalOpen(false); resetForm(); }}>
        <DialogContent className="sm:max-w-[650px] max-h-[85vh] overflow-y-auto bg-background">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Offering" : "Add Offering"}</DialogTitle>
            <DialogDescription>Configure ritual or darshan details</DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-2">
            {/* Section A – Basic Details */}
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Basic Details</p>
              <div className="space-y-3">
                <div><Label>Offering Name</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Suprabhatam" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Offering Type</Label>
                    <Select value={form.type} onValueChange={v => setForm({ ...form, type: v as any })}>
                      <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
                      <SelectContent className="bg-popover"><SelectItem value="Ritual">Ritual</SelectItem><SelectItem value="Darshan">Darshan</SelectItem></SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Category</Label>
                    <SearchableSelect options={categoryOptions} value={form.category} onValueChange={v => setForm({ ...form, category: v })} placeholder="Select category" onAddNew={() => setIsAddCategoryOpen(true)} addNewLabel="Add Category" />
                  </div>
                </div>
                <div>
                  <Label>Location (Structure)</Label>
                  <SearchableSelect options={structureOptions} value={form.structure} onValueChange={v => setForm({ ...form, structure: v })} placeholder="Select structure" onAddNew={() => setIsAddStructureOpen(true)} addNewLabel="Add Structure" />
                </div>
                <div><Label>Description</Label><Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Describe this offering" rows={2} /></div>
                <div>
                  <Label>Assign Priest</Label>
                  <SearchableSelect
                    options={[
                      { value: "Pandit Sharma", label: "Pandit Sharma" },
                      { value: "Pandit Rao", label: "Pandit Rao" },
                      { value: "Pandit Kumar", label: "Pandit Kumar" },
                      { value: "Pandit Iyer", label: "Pandit Iyer" },
                      { value: "Pandit Venkatesh", label: "Pandit Venkatesh" },
                    ]}
                    value={form.assignedPriest}
                    onValueChange={v => setForm({ ...form, assignedPriest: v })}
                    placeholder="Select priest (optional)"
                  />
                </div>
                <div>
                  <Label>Images</Label>
                  <p className="text-xs text-muted-foreground mb-2">Add multiple image URLs (one per line)</p>
                  <Textarea placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg" rows={3} />
                </div>
              </div>
            </div>

            <Separator />

            {/* Section B – Scheduling */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="h-4 w-4 text-primary" />
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Scheduling</p>
              </div>
              <div className="space-y-4">
                {/* Time Pickers */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>Default Start Time</Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input type="time" value={form.defaultTime} onChange={e => setForm({ ...form, defaultTime: e.target.value })} className="pl-10" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Default End Time</Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input type="time" value={form.endTime} onChange={e => setForm({ ...form, endTime: e.target.value })} className="pl-10" />
                    </div>
                  </div>
                </div>

                {/* Frequency */}
                <div className="space-y-1.5">
                  <Label>Frequency</Label>
                  <Select value={form.frequency} onValueChange={v => setForm({ ...form, frequency: v as FrequencyType })}>
                    <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-popover">
                      <SelectItem value="Daily">Daily</SelectItem>
                      <SelectItem value="Weekly">Weekly</SelectItem>
                      <SelectItem value="Monthly">Monthly</SelectItem>
                      <SelectItem value="Annual">Annual</SelectItem>
                      <SelectItem value="On Demand">On Demand</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Active Date Range — hidden for Monthly since months selector handles it */}
                {form.frequency !== "Monthly" && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label>Active From</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !dateFrom && "text-muted-foreground")}>
                            <Calendar className="mr-2 h-4 w-4" />
                            {dateFrom ? format(dateFrom, "PPP") : "Pick start date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent mode="single" selected={dateFrom} onSelect={setDateFrom} initialFocus className="p-3 pointer-events-auto" />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-1.5">
                      <Label>Active Until</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !dateTo && "text-muted-foreground")}>
                            <Calendar className="mr-2 h-4 w-4" />
                            {dateTo ? format(dateTo, "PPP") : "Pick end date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent mode="single" selected={dateTo} onSelect={setDateTo} initialFocus className="p-3 pointer-events-auto" />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                )}

                {/* Helper Text */}
                {frequencyHelper[form.frequency] && (
                  <div className="flex items-start gap-2 rounded-lg bg-muted/50 p-3">
                    <Info className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <p className="text-sm text-muted-foreground">{frequencyHelper[form.frequency]}</p>
                  </div>
                )}

                {/* Conditional: Weekly */}
                <AnimatePresence mode="wait">
                  {form.frequency === "Weekly" && (
                    <motion.div key="weekly" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="space-y-2 overflow-hidden">
                      <Label>Select Days of Week</Label>
                      <div className="flex flex-wrap gap-2">
                        {WEEKDAYS.map((day) => {
                          const active = selectedDays.includes(day);
                          return (
                            <Badge
                              key={day}
                              variant={active ? "default" : "outline"}
                              className={cn("cursor-pointer select-none px-3 py-1.5 text-sm transition-colors", active ? "bg-primary text-primary-foreground hover:bg-primary/90" : "hover:bg-muted")}
                              onClick={() => toggleDay(day)}
                            >
                              {day}
                            </Badge>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}

                  {/* Conditional: Monthly */}
                  {form.frequency === "Monthly" && (
                    <motion.div key="monthly" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="space-y-4 overflow-hidden">

                      {/* Step 1 — Scope */}
                      <div className="space-y-2">
                        <Label>Applies to</Label>
                        <div className="grid grid-cols-2 gap-2">
                          <button type="button"
                            onClick={() => { setMonthlyScope("all"); setSelectedMonths([]); }}
                            className={cn("flex flex-col items-start gap-0.5 p-3 rounded-xl border text-left transition-all",
                              monthlyScope === "all" ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border hover:border-primary/50 hover:bg-muted/30")}>
                            <span className="text-sm font-semibold">Every month of the year</span>
                            <span className="text-xs text-muted-foreground">e.g. Ekadashi, Amavasya — date may vary per month</span>
                          </button>
                          <button type="button"
                            onClick={() => setMonthlyScope("specific")}
                            className={cn("flex flex-col items-start gap-0.5 p-3 rounded-xl border text-left transition-all",
                              monthlyScope === "specific" ? "border-amber-600 bg-amber-50/60 ring-1 ring-amber-600" : "border-border hover:border-amber-500/50 hover:bg-muted/30")}>
                            <span className="text-sm font-semibold">Only in specific months</span>
                            <span className="text-xs text-muted-foreground">e.g. festival sevas, seasonal pujas</span>
                          </button>
                        </div>
                      </div>

                      {/* Step 2 — Month selector (only for specific) */}
                      <AnimatePresence>
                        {monthlyScope === "specific" && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden space-y-2">
                            <Label className="text-sm">Select Months</Label>
                            <div className="flex flex-wrap gap-1.5">
                              {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map((month, idx) => {
                                const active = selectedMonths.includes(idx + 1);
                                return (
                                  <button key={month} type="button"
                                    onClick={() => setSelectedMonths(prev => active ? prev.filter(m => m !== idx + 1) : [...prev, idx + 1].sort((a,b) => a-b))}
                                    className={cn("px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border",
                                      active ? "bg-amber-700 text-white border-amber-700 shadow-sm" : "bg-background text-foreground border-border hover:border-amber-600 hover:bg-amber-50")}>
                                    {month}
                                  </button>
                                );
                              })}
                            </div>
                            {selectedMonths.length === 0 && <p className="text-xs text-destructive">Select at least one month.</p>}
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Step 3 — Multi-date calendar picker */}
                      {monthlyMode === "specific-date" && (
                        <div className="space-y-2 border-t pt-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <Label className="text-sm">Select Dates on Calendar</Label>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                Click to select the exact dates each month this seva occurs (e.g. Jan 11, Feb 9, Mar 10 for Ekadashi).
                              </p>
                            </div>
                            {monthlyDates.length > 0 && (
                              <button type="button" onClick={() => setMonthlyDates([])}
                                className="text-xs text-destructive hover:underline shrink-0 ml-2">Clear all</button>
                            )}
                          </div>
                          <div className="border rounded-xl overflow-hidden bg-card">
                            <CalendarComponent
                              mode="multiple"
                              selected={monthlyDates}
                              onSelect={(dates) => setMonthlyDates(dates ?? [])}
                              numberOfMonths={2}
                              className="p-3 pointer-events-auto"
                              disabled={monthlyScope === "specific"
                                ? (date) => !selectedMonths.includes(date.getMonth() + 1)
                                : undefined}
                            />
                          </div>
                          {monthlyDates.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                              {[...monthlyDates]
                                .sort((a, b) => a.getTime() - b.getTime())
                                .map((d, i) => (
                                  <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                                    {format(d, "dd MMM")}
                                    <button type="button" onClick={() => setMonthlyDates(prev => prev.filter(x => x.getTime() !== d.getTime()))} className="hover:text-destructive">×</button>
                                  </span>
                                ))}
                            </div>
                          )}
                        </div>
                      )}


                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <Separator />

            {/* Section C – Capacity */}
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Capacity</p>
              <div className="grid grid-cols-3 gap-3">
                <div><Label>Default Capacity</Label><Input type="number" value={form.capacity} onChange={e => setForm({ ...form, capacity: +e.target.value })} /></div>
                <div><Label>Max per Devotee</Label><Input type="number" value={form.maxPerDevotee} onChange={e => setForm({ ...form, maxPerDevotee: +e.target.value })} /></div>
                <div className="flex items-end gap-2 pb-1"><Switch checked={form.groupBooking} onCheckedChange={v => setForm({ ...form, groupBooking: v })} /><Label>Group Booking</Label></div>
              </div>
            </div>

            <Separator />

            {/* Section D – Pricing */}
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Pricing</p>
              <div className="space-y-3">
                <div className="flex items-center gap-2"><Switch checked={form.free} onCheckedChange={v => setForm({ ...form, free: v })} /><Label>Free</Label></div>
                {!form.free && (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div><Label>Base Price (₹)</Label><Input type="number" value={form.basePrice} onChange={e => setForm({ ...form, basePrice: +e.target.value })} /></div>
                      <div><Label>Price (₹)</Label><Input type="number" value={form.price} onChange={e => setForm({ ...form, price: +e.target.value })} /></div>
                    </div>
                    {!form.free && form.basePrice > 0 && (
                      <div>
                        <Label>Discount</Label>
                        <Input
                          type="text"
                          value={
                            (() => {
                              const discount = getDiscount();
                              if (discount.amount === 0) return "No discount";
                              if (discount.isIncrease) {
                                return `₹${discount.amount} increase (${discount.percent}% increase)`;
                              }
                              return `₹${discount.amount} off (${discount.percent}% off)`;
                            })()
                          }
                          readOnly
                          className="bg-muted"
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            <Separator />

            {/* Section D1 – Booking Channels */}
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Booking Channels</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 p-3 border rounded-lg">
                  <Switch checked={form.availableOnline} onCheckedChange={v => setForm({ ...form, availableOnline: v })} />
                  <Label>Available Online</Label>
                </div>
                <div className="flex items-center gap-2 p-3 border rounded-lg">
                  <Switch checked={form.availableCounter} onCheckedChange={v => setForm({ ...form, availableCounter: v })} />
                  <Label>Available at Counter</Label>
                </div>
              </div>
              {!form.availableOnline && !form.availableCounter && (
                <p className="text-xs text-destructive mt-2">At least one channel should be enabled.</p>
              )}
            </div>

            <Separator />

            {/* Section D2 – Prasadam */}
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Prasadam</p>
              <div className="space-y-3">
                <div className="flex items-center gap-2 p-3 border rounded-lg">
                  <Switch checked={form.prasadamIncluded} onCheckedChange={v => setForm({ ...form, prasadamIncluded: v, prasadamItems: v && form.prasadamItems.length === 0 ? [{ name: "", quantity: 1, price: 0, showOnline: true }] : form.prasadamItems })} />
                  <Label>Prasadam Included</Label>
                </div>
                <AnimatePresence>
                  {form.prasadamIncluded && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="space-y-3 overflow-hidden">
                      {form.prasadamItems.map((item, idx) => (
                        <div key={idx} className="border rounded-lg p-3 space-y-3 bg-muted/30">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-medium text-muted-foreground">Prasadam #{idx + 1}</p>
                            {form.prasadamItems.length > 1 && (
                              <Button variant="ghost" size="sm" className="h-6 text-xs text-destructive" onClick={() => setForm({ ...form, prasadamItems: form.prasadamItems.filter((_, i) => i !== idx) })}>Remove</Button>
                            )}
                          </div>
                          <div className="grid grid-cols-3 gap-3">
                            <div>
                              <Label className="text-xs">Prasadam Name</Label>
                              <Input value={item.name} onChange={e => { const items = [...form.prasadamItems]; items[idx] = { ...items[idx], name: e.target.value }; setForm({ ...form, prasadamItems: items }); }} placeholder="e.g. Laddu" className="mt-1" />
                            </div>
                            <div>
                              <Label className="text-xs">Quantity</Label>
                              <Input type="number" min={1} value={item.quantity} onChange={e => { const items = [...form.prasadamItems]; items[idx] = { ...items[idx], quantity: parseInt(e.target.value) || 1 }; setForm({ ...form, prasadamItems: items }); }} className="mt-1" />
                            </div>
                            <div>
                              <Label className="text-xs">Price (₹)</Label>
                              <Input type="number" min={0} value={item.price} onChange={e => { const items = [...form.prasadamItems]; items[idx] = { ...items[idx], price: parseFloat(e.target.value) || 0 }; setForm({ ...form, prasadamItems: items }); }} placeholder="0 = Free" className="mt-1" />
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch checked={item.showOnline} onCheckedChange={v => { const items = [...form.prasadamItems]; items[idx] = { ...items[idx], showOnline: v }; setForm({ ...form, prasadamItems: items }); }} />
                            <Label className="text-xs">Show in Online Booking</Label>
                          </div>
                        </div>
                      ))}
                      <Button variant="outline" size="sm" className="gap-1" onClick={() => setForm({ ...form, prasadamItems: [...form.prasadamItems, { name: "", quantity: 1, price: 0, showOnline: true }] })}>
                        <Plus className="h-3 w-3" /> Add Prasadam Item
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <Separator />

            {/* Section E – Type-Specific */}
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                {form.type === "Ritual" ? "Ritual Settings" : "Darshan Settings"}
              </p>
              {form.type === "Ritual" ? (
                <div className="grid grid-cols-2 gap-3">
                  {[["Priest Required", "priestRequired"], ["Sankalpam Required", "sankalpam"], ["Gothram Required", "gothram"], ["Nakshatra Required", "nakshatra"]].map(([label, key]) => (
                    <div key={key} className="flex items-center gap-2 p-3 border rounded-lg">
                      <Switch checked={(form as any)[key]} onCheckedChange={v => setForm({ ...form, [key]: v })} />
                      <Label>{label}</Label>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 p-3 border rounded-lg"><Switch checked={form.walkinTracking} onCheckedChange={v => setForm({ ...form, walkinTracking: v })} /><Label>Walk-in Tracking</Label></div>
                  <div className="flex items-center gap-2 p-3 border rounded-lg"><Switch checked={form.vipEnabled} onCheckedChange={v => setForm({ ...form, vipEnabled: v })} /><Label>VIP Enabled</Label></div>
                </div>
              )}
            </div>

            <Separator />
            <CustomFieldsSection fields={customFields} onFieldsChange={setCustomFields} />

            <Separator />

            {/* Receipt Template Selection */}
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Receipt Template</p>
              <div>
                <Label>Select Receipt Template</Label>
                <Select value={form.receiptTemplate || "default"} onValueChange={v => setForm({ ...form, receiptTemplate: v === "default" ? "" : v })}>
                  <SelectTrigger className="bg-background mt-1.5"><SelectValue placeholder="Use default template" /></SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="default">Use Default Template</SelectItem>
                    {getTemplatesByType("Seva").map(t => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.name} ({t.paperSize}){t.isDefault ? " ★" : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">Choose a specific receipt template for this offering, or use the default from Settings → Templates</p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsModalOpen(false); resetForm(); }}>Cancel</Button>
            <Button onClick={handleSave}>{editing ? "Update" : "Create"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Category Mini Dialog */}
      <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
        <DialogContent className="sm:max-w-[400px] bg-background">
          <DialogHeader><DialogTitle>Add Category</DialogTitle></DialogHeader>
          <Input placeholder="Category name" />
          <DialogFooter><Button variant="outline" onClick={() => setIsAddCategoryOpen(false)}>Cancel</Button><Button onClick={() => { setIsAddCategoryOpen(false); toast.success("Category added"); }}>Add</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Structure Mini Dialog */}
      <Dialog open={isAddStructureOpen} onOpenChange={setIsAddStructureOpen}>
        <DialogContent className="sm:max-w-[400px] bg-background">
          <DialogHeader><DialogTitle>Add Structure</DialogTitle></DialogHeader>
          <Input placeholder="Structure name" />
          <DialogFooter><Button variant="outline" onClick={() => setIsAddStructureOpen(false)}>Cancel</Button><Button onClick={() => { setIsAddStructureOpen(false); toast.success("Structure added"); }}>Add</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OfferingsList;
