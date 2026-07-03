import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Plus, Download, Upload, Users, UserCheck, IndianRupee, Calendar, Phone, Mail, MapPin, ChevronLeft, ChevronRight, Heart, BookOpen, HandHelping, StickyNote, Eye, MessageSquare, Star, Edit, FileText, AlertTriangle, Crown, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import SelectWithAddNew from "@/components/SelectWithAddNew";
import CustomFieldsSection, { CustomField } from "@/components/CustomFieldsSection";
import { Devotee, devoteesData } from "@/data/devotees";

const DevoteesList = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filterTag, setFilterTag] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterVolunteer, setFilterVolunteer] = useState("all");
  const [viewing, setViewing] = useState<Devotee | null>(null);
  const [showAddVip, setShowAddVip] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [showConvert, setShowConvert] = useState<Devotee | null>(null);
  const [showVolunteerForm, setShowVolunteerForm] = useState<Devotee | null>(null);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(8);
  const [allDevotees, setAllDevotees] = useState<Devotee[]>(devoteesData || []);

  // Add form state
  const [addName, setAddName] = useState("");
  const [addPhone, setAddPhone] = useState("");
  const [addEmail, setAddEmail] = useState("");
  const [addDob, setAddDob] = useState("");
  const [addGender, setAddGender] = useState("");
  const [addLanguage, setAddLanguage] = useState("");
  const [addAddress, setAddAddress] = useState("");
  const [addCity, setAddCity] = useState("");
  const [addState, setAddState] = useState("");
  const [addCountry, setAddCountry] = useState("");
  const [addPincode, setAddPincode] = useState("");
  const [addTags, setAddTags] = useState<string[]>([]);
  const [addSource, setAddSource] = useState("");
  const [addNotes, setAddNotes] = useState("");
  const [addCustomFields, setAddCustomFields] = useState<CustomField[]>([]);
  const [genderOptions, setGenderOptions] = useState(["Male", "Female", "Other"]);
  const [langOptions, setLangOptions] = useState(["Kannada", "Tamil", "Telugu", "Hindi", "Malayalam", "Marathi", "English"]);
  const [cityOptions, setCityOptions] = useState(["Bangalore", "Chennai", "Hyderabad", "Mumbai", "Pune", "Kochi", "Mysore"]);
  const [stateOptions, setStateOptions] = useState(["Karnataka", "Tamil Nadu", "Telangana", "Maharashtra", "Kerala"]);
  const [countryOptions, setCountryOptions] = useState(["India", "USA", "UK", "Singapore", "UAE"]);
  const [tagOptions, setTagOptions] = useState(["VIP", "Donor", "Regular Devotee", "Festival Participant", "New"]);
  const [sourceOptions, setSourceOptions] = useState(["Walk-in", "Online", "Festival", "Referral"]);

  // Volunteer form state
  const [volunteerSkills, setVolunteerSkills] = useState<string[]>([]);
  const [volunteerSkillOptions, setVolunteerSkillOptions] = useState<string[]>([
    "Cooking",
    "Crowd Control",
    "Ritual Support",
    "Admin",
    "Security",
    "Front Desk",
    "Decoration",
    "Sound & Lights",
    "Transport / Driver",
    "First Aid / Medical",
    "Photography",
    "Translation",
    "Teaching / Pravachanam",
    "Music / Bhajan",
    "Garland Making",
    "Cleaning / Housekeeping",
    "IT / Tech Support",
    "Accounting Help",
    "Donor Relations",
    "Event Coordination",
  ]);
  const [newVolunteerSkill, setNewVolunteerSkill] = useState("");
  const [volunteerDept, setVolunteerDept] = useState("");
  const [volunteerAvailability, setVolunteerAvailability] = useState("");
  const [volunteerEmergencyContact, setVolunteerEmergencyContact] = useState("");
  const [volunteerDeptOptions, setVolunteerDeptOptions] = useState([
    "Annadanam",
    "Operations",
    "Administration",
    "Security",
    "Front Desk",
  ]);
  const [volunteerAvailabilityOptions, setVolunteerAvailabilityOptions] = useState([
    "Weekdays",
    "Weekends",
    "Festival Only",
    "Flexible",
  ]);

  // VIP form state
  const [vipCategory, setVipCategory] = useState("");
  const [vipLevel, setVipLevel] = useState("");
  const [vipValidFrom, setVipValidFrom] = useState("");
  const [vipValidTill, setVipValidTill] = useState("");
  const [vipApprovalAuthority, setVipApprovalAuthority] = useState("");
  const [vipSensitive, setVipSensitive] = useState(false);
  const [vipNotes, setVipNotes] = useState("");
  const [vipCategoryOptions, setVipCategoryOptions] = useState([
    "High Donor",
    "Volunteer Donor",
    "Festival Patron",
    "Trustee Family",
  ]);
  const [vipLevelOptions, setVipLevelOptions] = useState([
    "Platinum",
    "Gold",
    "Silver",
  ]);
  const [vipApprovalOptions, setVipApprovalOptions] = useState([
    "Temple Admin",
    "Trustee Board",
    "Chairperson",
  ]);

  // Export state
  const [exportType, setExportType] = useState("all");
  const [exportFormat, setExportFormat] = useState("csv");

  const filtered = allDevotees.filter(d => {
    if (search && !d.name.toLowerCase().includes(search.toLowerCase()) && !d.phone.includes(search) && !d.email.toLowerCase().includes(search.toLowerCase()) && !d.id.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterTag !== "all" && !d.tags.includes(filterTag)) return false;
    if (filterStatus !== "all" && d.status !== filterStatus) return false;
    if (filterVolunteer === "yes" && !d.isVolunteer) return false;
    if (filterVolunteer === "no" && d.isVolunteer) return false;
    return true;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  const handleConvertToVolunteer = (devotee: Devotee) => {
    setShowConvert(null);
    setShowVolunteerForm(devotee);
  };

  const handleSaveVolunteer = () => {
    if (!showVolunteerForm) return;
    if (!volunteerDept || !volunteerAvailability) {
      toast.error("Please fill department and availability");
      return;
    }
    setAllDevotees(prev => prev.map(d => d.id === showVolunteerForm.id ? {
      ...d,
      isVolunteer: true,
      volunteerStatus: "Active",
      volunteerData: {
        skills: volunteerSkills,
        events: 0,
        hours: 0,
        availability: volunteerAvailability,
        department: volunteerDept,
      }
    } : d));
    setShowVolunteerForm(null);
    setVolunteerSkills([]);
    setVolunteerDept("");
    setVolunteerAvailability("");
    setVolunteerEmergencyContact("");
    toast.success(`${showVolunteerForm.name} converted to volunteer`);
  };

  const handleSaveDevotee = (addAnother = false) => {
    if (!addName || !addPhone) {
      toast.error("Name and Mobile are required");
      return;
    }
    if (allDevotees.some(d => d.phone === addPhone)) {
      toast.error("Mobile number already exists");
      return;
    }
    const newId = `DEV-${String(allDevotees.length + 1).padStart(4, "0")}`;
    const newDevotee: Devotee = {
      id: newId,
      name: addName,
      phone: addPhone,
      email: addEmail,
      city: addCity,
      state: addState,
      country: addCountry,
      dob: addDob,
      gender: addGender,
      preferredLanguage: addLanguage,
      pincode: addPincode,
      address: addAddress,
      tags: addTags,
      source: addSource,
      notes: addNotes,
      totalBookings: 0,
      totalDonations: 0,
      isVolunteer: false,
      volunteerStatus: "Not Converted",
      lastVisit: new Date().toISOString().split("T")[0],
      status: "Active",
      bookings: [],
      donations: [],
      visits: [],
      experiencePosts: [],
      commLogs: [],
      customFields: addCustomFields.reduce((acc, f) => ({ ...acc, [f.name]: f.value }), {}),
    };
    setAllDevotees(prev => [...prev, newDevotee]);
    if (!addAnother) {
      setShowAdd(false);
      resetAddForm();
    } else {
      resetAddForm();
    }
    toast.success(`Devotee ${addAnother ? "saved. Form ready for next entry." : "added successfully"}`);
  };

  const resetAddForm = () => {
    setAddName("");
    setAddPhone("");
    setAddEmail("");
    setAddDob("");
    setAddGender("");
    setAddLanguage("");
    setAddAddress("");
    setAddCity("");
    setAddState("");
    setAddCountry("");
    setAddPincode("");
    setAddTags([]);
    setAddSource("");
    setAddNotes("");
    setAddCustomFields([]);
  };

  const [vipDialogDevotee, setVipDialogDevotee] = useState<Devotee | null>(null);

  const handleMarkAsVip = () => {
    if (!vipDialogDevotee) return;
    if (!vipCategory || !vipLevel || !vipValidFrom || !vipValidTill) {
      toast.error("Please fill all required VIP fields");
      return;
    }
    setAllDevotees(prev => prev.map(d => d.id === vipDialogDevotee.id ? {
      ...d,
      vip: {
        status: "Active",
        category: vipCategory,
        level: vipLevel,
        validFrom: vipValidFrom,
        validTill: vipValidTill,
        sensitive: vipSensitive,
        approvedBy: vipApprovalAuthority,
        notes: vipNotes,
      },
      tags: d.tags.includes("VIP") ? d.tags : [...d.tags, "VIP"],
    } : d));
    const devoteeId = vipDialogDevotee.id;
    setVipDialogDevotee(null);
    setShowAddVip(false);
    resetVipForm();
    toast.success(`${vipDialogDevotee.name} added as VIP`);
    navigate(`/temple/vip/devotees?devoteeId=${devoteeId}`);
  };

  const resetVipForm = () => {
    setVipCategory("");
    setVipLevel("");
    setVipValidFrom("");
    setVipValidTill("");
    setVipApprovalAuthority("");
    setVipSensitive(false);
    setVipNotes("");
  };

  const handleExport = () => {
    const data = filtered;
    const csv = ["Devotee ID,Full Name,Mobile,Email,City,Tags,Total Bookings,Total Donations,Volunteer Status,Last Visit,Status", ...data.map(d => `${d.id},${d.name},${d.phone},${d.email},${d.city},"${d.tags.join(";")}",${d.totalBookings},${d.totalDonations},${d.volunteerStatus},${d.lastVisit},${d.status}`)].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `devotees-${new Date().toISOString().split("T")[0]}.csv`; a.click();
    URL.revokeObjectURL(url);
    setShowExport(false);
    toast.success("Devotees exported");
  };

  // Inline 360° detail view when a devotee row is clicked
  if (viewing) {
    return (
      <div className="p-4 space-y-4 w-full overflow-x-hidden max-w-[100vw]">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-full"
        >
          <Button
            variant="ghost"
            onClick={() => setViewing(null)}
            className="mb-4 gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to All Devotees
          </Button>

          <Card className="overflow-hidden">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg flex items-center gap-2">
                    {viewing.name}
                    {viewing.vip && (
                      <Badge
                        variant="secondary"
                        className="text-[10px] gap-1"
                      >
                        <Crown className="h-3 w-3" />
                        VIP
                      </Badge>
                    )}
                    {viewing.isVolunteer && (
                      <Badge
                        variant="default"
                        className="text-[10px] gap-1"
                      >
                        <HandHelping className="h-3 w-3" />
                        Volunteer
                      </Badge>
                    )}
                  </h2>
                  <p className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                    <Phone className="h-3 w-3" />
                    {viewing.phone}
                    {viewing.email && (
                      <>
                        <span>·</span>
                        <Mail className="h-3 w-3" />
                        {viewing.email}
                      </>
                    )}
                  </p>
                </div>
                <div className="flex gap-1.5 items-center">
                  {viewing.tags.map((t) => (
                    <Badge
                      key={t}
                      variant="outline"
                      className="text-[10px]"
                    >
                      {t}
                    </Badge>
                  ))}
                  <Badge
                    variant={viewing.status === "Active" ? "default" : "outline"}
                    className="text-[10px]"
                  >
                    {viewing.status}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 gap-1 ml-2"
                  >
                    <Edit className="h-3 w-3" />
                    Edit
                  </Button>
                </div>
              </div>

              <Tabs defaultValue="overview" className="mt-4">
                <div className="border-b border-border">
                  <TabsList className="w-full justify-start border-b-0 rounded-none h-auto p-0 bg-transparent flex-wrap gap-0">
                    {[
                      { value: "overview", icon: Users, label: "Overview" },
                      { value: "bookings", icon: BookOpen, label: "Bookings" },
                      { value: "donations", icon: IndianRupee, label: "Donations" },
                      { value: "visits", icon: Eye, label: "Visits" },
                      { value: "experience", icon: Star, label: "Experience" },
                      { value: "commlogs", icon: MessageSquare, label: "Comm Logs" },
                      ...(viewing.isVolunteer
                        ? [{ value: "volunteer", icon: HandHelping, label: "Volunteer" }]
                        : []),
                    ].map((t) => (
                      <TabsTrigger
                        key={t.value}
                        value={t.value}
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-amber-700 data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:font-medium px-4 py-2 text-sm text-muted-foreground data-[state=active]:text-foreground gap-1.5"
                      >
                        <t.icon className="h-3.5 w-3.5" />
                        {t.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>

                <TabsContent value="overview" className="mt-4 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      ["Full Name", viewing.name],
                      ["Mobile", viewing.phone],
                      ["Email", viewing.email || "—"],
                      ["Date of Birth", viewing.dob || "—"],
                      ["Gender", viewing.gender || "—"],
                      ["Language", viewing.preferredLanguage || "—"],
                      ["Address", viewing.address || "—"],
                      ["City", `${viewing.city}, ${viewing.state}`],
                      ["Country", viewing.country || "—"],
                      ["Pincode", viewing.pincode || "—"],
                      ["Source", viewing.source || "—"],
                      ["Devotee ID", viewing.id],
                    ].map(([label, value]) => (
                      <div
                        key={label as string}
                        className="p-3 bg-muted/50 rounded-lg"
                      >
                        <p className="text-xs text-muted-foreground">
                          {label as string}
                        </p>
                        <p className="font-medium text-sm">{String(value)}</p>
                      </div>
                    ))}
                  </div>
                  {viewing.tags && viewing.tags.length > 0 && (
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1.5">
                        Tags
                      </p>
                      <div className="flex gap-1.5 flex-wrap">
                        {viewing.tags.map((t) => (
                          <Badge
                            key={t}
                            variant="secondary"
                            className="text-xs"
                          >
                            {t}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {viewing.notes && (
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground">Notes</p>
                      <p className="text-sm mt-1">
                        {viewing.notes || "No notes"}
                      </p>
                    </div>
                  )}
                  <div className="grid grid-cols-4 gap-3">
                    <div className="p-3 bg-muted/50 rounded-lg text-center">
                      <p className="text-xl font-bold">{viewing.totalBookings}</p>
                      <p className="text-[10px] text-muted-foreground">
                        Bookings
                      </p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg text-center">
                      <p className="text-xl font-bold">
                        ₹{viewing.totalDonations.toLocaleString()}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        Donations
                      </p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg text-center">
                      <p className="text-xl font-bold">
                        {viewing.visits.length}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        Visits
                      </p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg text-center">
                      <p className="text-xl font-bold">{viewing.lastVisit}</p>
                      <p className="text-[10px] text-muted-foreground">
                        Last Visit
                      </p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="bookings" className="mt-4">
                  {viewing.bookings && viewing.bookings.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Offering</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {viewing.bookings.map((b) => (
                          <TableRow key={b.id}>
                            <TableCell className="font-medium text-sm">
                              {b.offering}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  b.type === "Ritual" ? "default" : "secondary"
                                }
                                className="text-[10px]"
                              >
                                {b.type}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {b.date}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className="text-[10px]"
                              >
                                {b.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right font-medium text-sm">
                              {b.amount > 0 ? `₹${b.amount}` : "Free"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No bookings found
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="donations" className="mt-4">
                  {viewing.donations && viewing.donations.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>#</TableHead>
                          <TableHead>Receipt</TableHead>
                          <TableHead>Purpose</TableHead>
                          <TableHead>Mode</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {viewing.donations.map((d, i) => (
                          <TableRow key={d.receipt}>
                            <TableCell className="text-xs text-muted-foreground">
                              {i + 1}
                            </TableCell>
                            <TableCell className="font-mono text-xs">
                              {d.receipt}
                            </TableCell>
                            <TableCell className="text-sm">{d.purpose}</TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className="text-[10px]"
                              >
                                {d.purpose}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {d.date}
                            </TableCell>
                            <TableCell className="text-right font-medium text-sm">
                              ₹{d.amount.toLocaleString()}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No donations found
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="visits" className="mt-4">
                  {viewing.visits && viewing.visits.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Occasion</TableHead>
                          <TableHead>With Family</TableHead>
                          <TableHead>Notes</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {viewing.visits.map((v, i) => (
                          <TableRow key={i}>
                            <TableCell className="text-sm text-muted-foreground">
                              {v.date}
                            </TableCell>
                            <TableCell className="text-sm">{v.type}</TableCell>
                            <TableCell className="text-sm">
                              {v.duration}
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground">
                              {"—"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No visit history found
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="experience" className="mt-4">
                  {viewing.experiencePosts &&
                  viewing.experiencePosts.length > 0 ? (
                    <div className="space-y-3">
                      {viewing.experiencePosts.map((p, i) => (
                        <Card key={i} className="bg-muted/40">
                          <CardContent className="p-3">
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-1.5">
                                <Star className="h-3 w-3 text-yellow-500" />
                                <span className="text-xs font-medium">
                                  {p.content.substring(0, 30)}
                                </span>
                              </div>
                              <span className="text-[11px] text-muted-foreground">
                                {p.date}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {p.content}
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No experience posts recorded
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="commlogs" className="mt-4">
                  {viewing.commLogs && viewing.commLogs.length > 0 ? (
                    <div className="space-y-3">
                      {viewing.commLogs.map((c, i) => (
                        <Card key={i} className="bg-muted/40">
                          <CardContent className="p-3 flex items-start gap-2">
                            <MessageSquare className="h-3.5 w-3.5 mt-0.5 text-muted-foreground" />
                            <div className="space-y-0.5">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-medium">
                                  {c.channel}
                                </span>
                                <span className="text-[11px] text-muted-foreground">
                                  {c.date}
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {c.subject}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No communication logs found
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="volunteer" className="mt-4">
                  {viewing.isVolunteer && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          ["Status", viewing.volunteerStatus],
                          [
                            "Department",
                            viewing.volunteerData?.department || "—",
                          ],
                          [
                            "Availability",
                            viewing.volunteerData?.availability || "—",
                          ],
                          ["Emergency Contact", volunteerEmergencyContact || "—"],
                        ].map(([label, value]) => (
                          <div
                            key={label as string}
                            className="p-3 bg-muted/50 rounded-lg"
                          >
                            <p className="text-xs text-muted-foreground">
                              {label as string}
                            </p>
                            <p className="font-medium text-sm">{String(value)}</p>
                          </div>
                        ))}
                      </div>
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1.5">
                          Skills
                        </p>
                        <div className="flex gap-1.5 flex-wrap">
                          {viewing.volunteerData?.skills.length ? (
                            viewing.volunteerData.skills.map((s) => (
                              <Badge
                                key={s}
                                variant="secondary"
                                className="text-xs"
                              >
                                {s}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-xs text-muted-foreground">
                              No skills listed
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="p-3 bg-muted/50 rounded-lg text-center">
                          <p className="text-xl font-bold">
                            {viewing.volunteerData?.events}
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            Events
                          </p>
                        </div>
                        <div className="p-3 bg-muted/50 rounded-lg text-center">
                          <p className="text-xl font-bold">
                            {viewing.volunteerData?.hours}
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            Hours
                          </p>
                        </div>
                        <div className="p-3 bg-muted/50 rounded-lg text-center">
                          <p className="text-xl font-bold">
                            {viewing.totalDonations.toLocaleString()}
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            Lifetime Donation
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 w-full overflow-x-hidden max-w-[100vw]">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-full">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">All Devotees</h1>
            <p className="text-muted-foreground">Central CRM for all temple devotee records</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowImport(true)} className="gap-2"><Upload className="h-4 w-4" />Import</Button>
            <Button variant="outline" onClick={() => setShowExport(true)} className="gap-2"><Download className="h-4 w-4" />Export</Button>
            <Button variant="outline" onClick={() => setShowAddVip(true)} className="gap-2"><Crown className="h-4 w-4" />Add VIP Devotee</Button>
            <Button onClick={() => setShowAdd(true)} className="gap-2"><Plus className="h-4 w-4" />Add Devotee</Button>
          </div>
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total Devotees", value: allDevotees.length.toString(), icon: Users },
            { label: "Active", value: allDevotees.filter(d => d.status === "Active").length.toString(), icon: UserCheck },
            { label: "Total Donations", value: `₹${allDevotees.reduce((a, d) => a + d.totalDonations, 0).toLocaleString()}`, icon: IndianRupee },
            { label: "Volunteers", value: allDevotees.filter(d => d.isVolunteer).length.toString(), icon: HandHelping },
          ].map((kpi, i) => (
            <Card key={i} className="group hover:shadow-md transition-all duration-200">
              <CardContent className="p-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-muted group-hover:bg-primary group-hover:shadow-lg transition-all duration-200 mb-2">
                  <kpi.icon className="h-5 w-5 text-muted-foreground group-hover:text-primary-foreground transition-colors duration-200" />
                </div>
                <p className="text-xl font-bold">{kpi.value}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{kpi.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search name, phone, email, ID..." className="pl-9" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
          </div>
          <Select value={filterTag} onValueChange={v => { setFilterTag(v); setPage(1); }}>
            <SelectTrigger className="w-[130px] bg-background"><SelectValue placeholder="Tag" /></SelectTrigger>
            <SelectContent className="bg-popover">
              <SelectItem value="all">All Tags</SelectItem>
              {tagOptions.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={v => { setFilterStatus(v); setPage(1); }}>
            <SelectTrigger className="w-[130px] bg-background"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent className="bg-popover">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterVolunteer} onValueChange={v => { setFilterVolunteer(v); setPage(1); }}>
            <SelectTrigger className="w-[140px] bg-background"><SelectValue placeholder="Volunteer" /></SelectTrigger>
            <SelectContent className="bg-popover">
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="yes">Volunteers</SelectItem>
              <SelectItem value="no">Non-Volunteers</SelectItem>
            </SelectContent>
          </Select>
          <Badge variant="secondary" className="ml-auto">{filtered.length} devotees</Badge>
        </div>

        {/* Table */}
        <Card className="overflow-hidden w-full">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Devotee</TableHead>
                  <TableHead>Mobile</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead className="text-right">Donations</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center w-[80px]">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paged.map(d => (
                  <TableRow key={d.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setViewing(d)}>
                    <TableCell>
                      <p className="font-medium text-sm">{d.name}</p>
                    </TableCell>
                    <TableCell className="text-sm">{d.phone}</TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap max-w-[200px]">
                        {d.tags.length > 0 ? (
                          <>
                            {d.tags.slice(0, 2).map(t => <Badge key={t} variant="outline" className="text-[9px] px-1.5 py-0">{t}</Badge>)}
                            {d.tags.length > 2 && <Badge variant="outline" className="text-[9px] px-1.5 py-0">+{d.tags.length - 2}</Badge>}
                          </>
                        ) : <span className="text-xs text-muted-foreground">—</span>}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium text-sm">₹{d.totalDonations.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant={d.status === "Active" ? "default" : "outline"} className="text-[10px]">{d.status}</Badge>
                    </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      {/* VIP Badge or Mark as VIP */}
                      {d.tags.includes("VIP") ? (
                        <Badge
                          variant="secondary"
                          className="text-[9px] gap-1 px-1.5 py-0.5"
                        >
                          <Crown className="h-3 w-3" />
                          VIP
                        </Badge>
                      ) : (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-amber-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            setVipDialogDevotee(d);
                          }}
                          title="Mark as VIP"
                        >
                          <Crown className="h-4 w-4" />
                        </Button>
                      )}

                      {/* Volunteer Action */}
                      {d.tags.includes("Volunteer") ? (
                        <Badge
                          variant="default"
                          className="text-[9px] gap-1 px-1.5 py-0.5 cursor-pointer hover:bg-primary/80"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowConvert(d);
                          }}
                        >
                          <HandHelping className="h-3 w-3" />
                          Vol
                        </Badge>
                      ) : (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowConvert(d);
                          }}
                          title="Convert to Volunteer"
                        >
                          <HandHelping className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                  </TableRow>
                ))}
                {paged.length === 0 && (
                  <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No devotees match filters</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-3">
            <p className="text-sm text-muted-foreground">Showing {filtered.length > 0 ? (page - 1) * perPage + 1 : 0}–{Math.min(page * perPage, filtered.length)} of {filtered.length}</p>
            <Select value={perPage.toString()} onValueChange={v => { setPerPage(Number(v)); setPage(1); }}>
              <SelectTrigger className="w-[80px] h-8 bg-background"><SelectValue /></SelectTrigger>
              <SelectContent className="bg-popover">
                {[10, 25, 50, 100].map(n => <SelectItem key={n} value={n.toString()}>{n}/page</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-8 gap-1" disabled={page === 1} onClick={() => setPage(p => p - 1)}><ChevronLeft className="h-4 w-4" />Previous</Button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const pageNum = totalPages <= 5 ? i + 1 : page <= 3 ? i + 1 : page >= totalPages - 2 ? totalPages - 4 + i : page - 2 + i;
                return <Button key={pageNum} variant={page === pageNum ? "default" : "outline"} size="icon" className="h-8 w-8" onClick={() => setPage(pageNum)}>{pageNum}</Button>;
              })}
              <Button variant="outline" size="sm" className="h-8 gap-1" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next<ChevronRight className="h-4 w-4" /></Button>
            </div>
          )}
        </div>
      </motion.div>

      {/* Convert to Volunteer Confirmation */}
      <Dialog open={!!showConvert} onOpenChange={() => { setShowConvert(null); setShowVolunteerForm(null); }}>
        <DialogContent className="sm:max-w-[420px] bg-background">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><HandHelping className="h-5 w-5 text-primary" />Convert to Volunteer</DialogTitle>
            <DialogDescription>Convert this devotee to volunteer?</DialogDescription>
          </DialogHeader>
          <div className="p-4 bg-muted/50 rounded-lg mt-2">
            <p className="font-medium">{showConvert?.name}</p>
            <p className="text-sm text-muted-foreground">{showConvert?.id} · {showConvert?.phone}</p>
          </div>
          <p className="text-sm text-muted-foreground">This will create a volunteer record linked to the same Devotee ID. A Volunteer tab will appear in their profile.</p>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => { setShowConvert(null); setShowVolunteerForm(null); }}>Cancel</Button>
            <Button onClick={() => showConvert && handleConvertToVolunteer(showConvert)} className="gap-2"><HandHelping className="h-4 w-4" />Add Volunteer Details</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Volunteer Details Form */}
      <Dialog open={!!showVolunteerForm} onOpenChange={() => { setShowVolunteerForm(null); setVolunteerSkills([]); setVolunteerDept(""); setVolunteerAvailability(""); setVolunteerEmergencyContact(""); }}>
        <DialogContent className="sm:max-w-[550px] max-h-[85vh] overflow-y-auto bg-background">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><HandHelping className="h-5 w-5 text-primary" />Add Volunteer Details</DialogTitle>
            <DialogDescription>{showVolunteerForm?.name} · {showVolunteerForm?.id}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label className="text-xs mb-2 block">Skills *</Label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {volunteerSkillOptions.map((skill) => {
                  const active = volunteerSkills.includes(skill);
                  return (
                    <button
                      type="button"
                      key={skill}
                      onClick={() =>
                        setVolunteerSkills(
                          active
                            ? volunteerSkills.filter((s) => s !== skill)
                            : [...volunteerSkills, skill]
                        )
                      }
                      className={`text-[11px] px-2 py-1 rounded-full border transition-colors ${
                        active
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-muted/40 hover:bg-muted border-border text-foreground"
                      }`}
                    >
                      {skill}
                    </button>
                  );
                })}
              </div>
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Add custom skill (e.g., Drone Pilot)"
                  className="h-8 text-sm"
                  value={newVolunteerSkill}
                  onChange={(e) => setNewVolunteerSkill(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      const s = newVolunteerSkill.trim();
                      if (!s) return;
                      if (volunteerSkillOptions.some((x) => x.toLowerCase() === s.toLowerCase())) {
                        toast.error("Skill already exists");
                        return;
                      }
                      setVolunteerSkillOptions((prev) => [...prev, s]);
                      setVolunteerSkills((prev) => [...prev, s]);
                      setNewVolunteerSkill("");
                      toast.success(`Skill "${s}" added`);
                    }
                  }}
                />
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="h-8 gap-1"
                  onClick={() => {
                    const s = newVolunteerSkill.trim();
                    if (!s) return;
                    if (volunteerSkillOptions.some((x) => x.toLowerCase() === s.toLowerCase())) {
                      toast.error("Skill already exists");
                      return;
                    }
                    setVolunteerSkillOptions((prev) => [...prev, s]);
                    setVolunteerSkills((prev) => [...prev, s]);
                    setNewVolunteerSkill("");
                    toast.success(`Skill "${s}" added`);
                  }}
                >
                  <Plus className="h-3 w-3" />
                  Add
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Preferred Department *</Label>
                <SelectWithAddNew
                  value={volunteerDept}
                  onValueChange={setVolunteerDept}
                  placeholder="Select department"
                  options={volunteerDeptOptions}
                  onAddNew={(v) => setVolunteerDeptOptions((prev) => [...prev, v])}
                  className="mt-1 bg-background"
                />
              </div>
              <div>
                <Label className="text-xs">Availability *</Label>
                <SelectWithAddNew
                  value={volunteerAvailability}
                  onValueChange={setVolunteerAvailability}
                  placeholder="Select availability"
                  options={volunteerAvailabilityOptions}
                  onAddNew={(v) => setVolunteerAvailabilityOptions((prev) => [...prev, v])}
                  className="mt-1 bg-background"
                />
              </div>
            </div>
            <div>
              <Label className="text-xs">Emergency Contact</Label>
              <Input placeholder="+91 XXXXX XXXXX" className="mt-1" value={volunteerEmergencyContact} onChange={e => setVolunteerEmergencyContact(e.target.value)} />
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => { setShowVolunteerForm(null); setVolunteerSkills([]); setVolunteerDept(""); setVolunteerAvailability(""); setVolunteerEmergencyContact(""); }}>Cancel</Button>
            <Button onClick={handleSaveVolunteer} className="gap-2"><HandHelping className="h-4 w-4" />Save Volunteer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Devotee Details Dialog (360° View) */}
      <Dialog open={!!viewing} onOpenChange={() => setViewing(null)}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto bg-background">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-lg flex items-center gap-2">
                  {viewing?.name}
                  {viewing?.vip && <Badge variant="secondary" className="text-[10px] gap-1"><Crown className="h-3 w-3" />VIP</Badge>}
                  {viewing?.isVolunteer && <Badge variant="default" className="text-[10px] gap-1"><HandHelping className="h-3 w-3" />Volunteer</Badge>}
                </DialogTitle>
                <DialogDescription className="flex items-center gap-2 mt-1">
                  <Phone className="h-3 w-3" />{viewing?.phone}
                  {viewing?.email && <><span>·</span><Mail className="h-3 w-3" />{viewing?.email}</>}
                </DialogDescription>
              </div>
              <div className="flex gap-1.5 items-center">
                {viewing?.tags.map(t => <Badge key={t} variant="outline" className="text-[10px]">{t}</Badge>)}
                <Badge variant={viewing?.status === "Active" ? "default" : "outline"} className="text-[10px]">{viewing?.status}</Badge>
                <Button variant="outline" size="sm" className="h-7 gap-1 ml-2"><Edit className="h-3 w-3" />Edit</Button>
              </div>
            </div>
          </DialogHeader>
          <Tabs defaultValue="overview" className="mt-2">
            <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent flex-wrap">
              {[
                { value: "overview", icon: Users, label: "Overview" },
                { value: "bookings", icon: BookOpen, label: "Bookings" },
                { value: "donations", icon: IndianRupee, label: "Donations" },
                { value: "visits", icon: Eye, label: "Visits" },
                { value: "experience", icon: Star, label: "Experience" },
                { value: "commlogs", icon: MessageSquare, label: "Comm Logs" },
                ...(viewing?.isVolunteer ? [{ value: "volunteer", icon: HandHelping, label: "Volunteer" }] : []),
                ].map(t => (
                <TabsTrigger key={t.value} value={t.value} className="rounded-none border-b-2 border-transparent data-[state=active]:border-amber-700 data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:font-medium px-4 py-2 text-sm text-muted-foreground">
                  <t.icon className="h-3.5 w-3.5" />{t.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="overview" className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {[
                  ["Full Name", viewing?.name], ["Mobile", viewing?.phone], ["Email", viewing?.email || "—"],
                  ["Date of Birth", viewing?.dob || "—"], ["Gender", viewing?.gender || "—"], ["Language", viewing?.preferredLanguage || "—"],
                  ["Address", viewing?.address || "—"], ["City", `${viewing?.city}, ${viewing?.state}`],
                  ["Country", viewing?.country || "—"], ["Pincode", viewing?.pincode || "—"],
                  ["Source", viewing?.source || "—"], ["Devotee ID", viewing?.id],
                ].map(([label, value]) => (
                  <div key={label as string} className="p-3 bg-muted/50 rounded-lg"><p className="text-xs text-muted-foreground">{label as string}</p><p className="font-medium text-sm">{String(value)}</p></div>
                ))}
              </div>
              {viewing?.tags && viewing.tags.length > 0 && (
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1.5">Tags</p>
                  <div className="flex gap-1.5 flex-wrap">{viewing.tags.map(t => <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>)}</div>
                </div>
              )}
              {viewing?.notes && (
                <div className="p-3 bg-muted/50 rounded-lg"><p className="text-xs text-muted-foreground">Notes</p><p className="text-sm mt-1">{viewing.notes || "No notes"}</p></div>
              )}
              <div className="grid grid-cols-4 gap-3">
                <div className="p-3 bg-muted/50 rounded-lg text-center"><p className="text-xl font-bold">{viewing?.totalBookings}</p><p className="text-[10px] text-muted-foreground">Bookings</p></div>
                <div className="p-3 bg-muted/50 rounded-lg text-center"><p className="text-xl font-bold">₹{viewing?.totalDonations.toLocaleString()}</p><p className="text-[10px] text-muted-foreground">Donations</p></div>
                <div className="p-3 bg-muted/50 rounded-lg text-center"><p className="text-xl font-bold">{viewing?.visits.length}</p><p className="text-[10px] text-muted-foreground">Visits</p></div>
                <div className="p-3 bg-muted/50 rounded-lg text-center"><p className="text-xl font-bold">{viewing?.lastVisit}</p><p className="text-[10px] text-muted-foreground">Last Visit</p></div>
              </div>
            </TabsContent>

            <TabsContent value="bookings" className="mt-4">
              {viewing?.bookings && viewing.bookings.length > 0 ? (
                <Table>
                  <TableHeader><TableRow><TableHead>Offering</TableHead><TableHead>Type</TableHead><TableHead>Date</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Amount</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {viewing.bookings.map(b => (
                      <TableRow key={b.id}>
                        <TableCell className="font-medium text-sm">{b.offering}</TableCell>
                        <TableCell><Badge variant={b.type === "Ritual" ? "default" : "secondary"} className="text-[10px]">{b.type}</Badge></TableCell>
                        <TableCell className="text-sm text-muted-foreground">{b.date}</TableCell>
                        <TableCell><Badge variant="outline" className="text-[10px]">{b.status}</Badge></TableCell>
                        <TableCell className="text-right font-medium text-sm">{b.amount > 0 ? `₹${b.amount}` : "Free"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : <div className="text-center py-8 text-muted-foreground">No bookings found</div>}
            </TabsContent>

            <TabsContent value="donations" className="mt-4">
              {viewing?.donations && viewing.donations.length > 0 ? (
                <Table>
                  <TableHeader><TableRow><TableHead>Date</TableHead><TableHead className="text-right">Amount</TableHead><TableHead>Structure</TableHead><TableHead>Purpose</TableHead><TableHead>Receipt</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {viewing.donations.map((d, i) => (
                      <TableRow key={i}>
                        <TableCell className="text-sm text-muted-foreground">{d.date}</TableCell>
                        <TableCell className="text-right font-medium text-sm">₹{d.amount.toLocaleString()}</TableCell>
                        <TableCell className="text-sm">{d.structure}</TableCell>
                        <TableCell className="text-sm">{d.purpose}</TableCell>
                        <TableCell className="font-mono text-xs text-muted-foreground">{d.receipt}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : <div className="text-center py-8 text-muted-foreground">No donations found</div>}
            </TabsContent>

            <TabsContent value="visits" className="mt-4">
              {viewing?.visits && viewing.visits.length > 0 ? (
                <Table>
                  <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Type</TableHead><TableHead>Duration</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {viewing.visits.map((v, i) => (
                      <TableRow key={i}>
                        <TableCell className="text-sm">{v.date}</TableCell>
                        <TableCell><Badge variant="secondary" className="text-[10px]">{v.type}</Badge></TableCell>
                        <TableCell className="text-sm text-muted-foreground">{v.duration}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : <div className="text-center py-8 text-muted-foreground">No visit records</div>}
            </TabsContent>

            <TabsContent value="experience" className="mt-4">
              {viewing?.experiencePosts && viewing.experiencePosts.length > 0 ? (
                <div className="space-y-3">
                  {viewing.experiencePosts.map((p, i) => (
                    <div key={i} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1">{Array.from({ length: 5 }, (_, j) => <Star key={j} className={`h-3.5 w-3.5 ${j < p.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`} />)}</div>
                        <Badge variant="outline" className="text-[10px]">{p.status}</Badge>
                      </div>
                      <p className="text-sm">{p.content}</p>
                      <p className="text-xs text-muted-foreground mt-1">{p.date}</p>
                    </div>
                  ))}
                </div>
              ) : <div className="text-center py-8 text-muted-foreground">No experience posts</div>}
            </TabsContent>

            <TabsContent value="commlogs" className="mt-4">
              {viewing?.commLogs && viewing.commLogs.length > 0 ? (
                <Table>
                  <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Channel</TableHead><TableHead>Subject</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {viewing.commLogs.map((c, i) => (
                      <TableRow key={i}>
                        <TableCell className="text-sm text-muted-foreground">{c.date}</TableCell>
                        <TableCell><Badge variant="secondary" className="text-[10px]">{c.channel}</Badge></TableCell>
                        <TableCell className="text-sm">{c.subject}</TableCell>
                        <TableCell><Badge variant="outline" className="text-[10px]">{c.status}</Badge></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : <div className="text-center py-8 text-muted-foreground">No communication logs</div>}
            </TabsContent>

            {viewing?.isVolunteer && (
              <TabsContent value="volunteer" className="mt-4 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    ["Department", viewing.volunteerData?.department || "—"],
                    ["Availability", viewing.volunteerData?.availability || "—"],
                  ].map(([label, value]) => (
                    <div key={label} className="p-3 bg-muted/50 rounded-lg"><p className="text-xs text-muted-foreground">{label}</p><p className="font-medium text-sm">{value}</p></div>
                  ))}
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1.5">Skills</p>
                  <div className="flex gap-1.5 flex-wrap">{viewing.volunteerData?.skills.length ? viewing.volunteerData.skills.map(s => <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>) : <span className="text-xs text-muted-foreground">No skills listed</span>}</div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-muted/50 rounded-lg text-center"><p className="text-xl font-bold">{viewing.volunteerData?.events}</p><p className="text-[10px] text-muted-foreground">Events</p></div>
                  <div className="p-3 bg-muted/50 rounded-lg text-center"><p className="text-xl font-bold">{viewing.volunteerData?.hours}h</p><p className="text-[10px] text-muted-foreground">Hours</p></div>
                </div>
              </TabsContent>
            )}
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Add Devotee Dialog */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="sm:max-w-[650px] max-h-[85vh] overflow-y-auto bg-background">
          <DialogHeader>
            <DialogTitle>Add New Devotee</DialogTitle>
            <DialogDescription>Register a new devotee profile in the CRM</DialogDescription>
          </DialogHeader>
          <div className="space-y-6 mt-4">
            <div>
              <h3 className="text-sm font-semibold mb-3 text-primary">Basic Info</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2"><Label className="text-xs">Full Name *</Label><Input placeholder="Enter full name" className="mt-1" value={addName} onChange={e => setAddName(e.target.value)} /></div>
                <div><Label className="text-xs">Mobile (Unique) *</Label><Input placeholder="+91 XXXXX XXXXX" className="mt-1" value={addPhone} onChange={e => setAddPhone(e.target.value)} /></div>
                <div><Label className="text-xs">Email</Label><Input placeholder="email@example.com" className="mt-1" value={addEmail} onChange={e => setAddEmail(e.target.value)} /></div>
                <div><Label className="text-xs">Date of Birth</Label><Input type="date" className="mt-1" value={addDob} onChange={e => setAddDob(e.target.value)} /></div>
                <div><Label className="text-xs">Gender</Label><SelectWithAddNew value={addGender} onValueChange={setAddGender} placeholder="Select gender" options={genderOptions} onAddNew={v => setGenderOptions(p => [...p, v])} className="mt-1 bg-background" /></div>
                <div><Label className="text-xs">Preferred Language</Label><SelectWithAddNew value={addLanguage} onValueChange={setAddLanguage} placeholder="Select language" options={langOptions} onAddNew={v => setLangOptions(p => [...p, v])} className="mt-1 bg-background" /></div>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-3 text-primary">Address</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2"><Label className="text-xs">Address</Label><Input placeholder="Street address" className="mt-1" value={addAddress} onChange={e => setAddAddress(e.target.value)} /></div>
                <div><Label className="text-xs">City</Label><SelectWithAddNew value={addCity} onValueChange={setAddCity} placeholder="Select city" options={cityOptions} onAddNew={v => setCityOptions(p => [...p, v])} className="mt-1 bg-background" /></div>
                <div><Label className="text-xs">State</Label><SelectWithAddNew value={addState} onValueChange={setAddState} placeholder="Select state" options={stateOptions} onAddNew={v => setStateOptions(p => [...p, v])} className="mt-1 bg-background" /></div>
                <div><Label className="text-xs">Country</Label><SelectWithAddNew value={addCountry} onValueChange={setAddCountry} placeholder="Select country" options={countryOptions} onAddNew={v => setCountryOptions(p => [...p, v])} className="mt-1 bg-background" /></div>
                <div><Label className="text-xs">Pincode</Label><Input placeholder="Pincode" className="mt-1" value={addPincode} onChange={e => setAddPincode(e.target.value)} /></div>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-3 text-primary">Relationship</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <Label className="text-xs">Tags (Multi-select)</Label>
                  <div className="flex flex-wrap gap-3 mt-1.5">
                    {tagOptions.map(tag => (
                      <div key={tag} className="flex items-center gap-2">
                        <Checkbox id={`tag-${tag}`} checked={addTags.includes(tag)} onCheckedChange={checked => {
                          if (checked) setAddTags([...addTags, tag]);
                          else setAddTags(addTags.filter(t => t !== tag));
                        }} />
                        <Label htmlFor={`tag-${tag}`} className="text-sm">{tag}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                <div><Label className="text-xs">Source</Label><SelectWithAddNew value={addSource} onValueChange={setAddSource} placeholder="Select source" options={sourceOptions} onAddNew={v => setSourceOptions(p => [...p, v])} className="mt-1 bg-background" /></div>
              </div>
            </div>
            <div>
              <Label className="text-xs">Notes</Label>
              <Textarea placeholder="Any additional notes..." className="mt-1" value={addNotes} onChange={e => setAddNotes(e.target.value)} />
            </div>
            <CustomFieldsSection fields={addCustomFields} onFieldsChange={setAddCustomFields} />
          </div>
          <DialogFooter className="mt-6 gap-2">
            <Button variant="outline" onClick={() => { setShowAdd(false); resetAddForm(); }}>Cancel</Button>
            <Button variant="secondary" onClick={() => handleSaveDevotee(true)}>Save & Add Another</Button>
            <Button onClick={() => handleSaveDevotee(false)}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Import Dialog */}
      <Dialog open={showImport} onOpenChange={setShowImport}>
        <DialogContent className="sm:max-w-[550px] bg-background">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Upload className="h-5 w-5" />Import Devotees</DialogTitle>
            <DialogDescription>Bulk import devotees from CSV or Excel file</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="p-4 border-2 border-dashed rounded-lg text-center">
              <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm font-medium">Drop CSV or Excel file here</p>
              <p className="text-xs text-muted-foreground mt-1">Or click to browse</p>
              <Button variant="outline" size="sm" className="mt-3">Browse Files</Button>
            </div>
            <Button variant="link" size="sm" className="gap-1 p-0 h-auto"><Download className="h-3.5 w-3.5" />Download Template</Button>
            <div className="space-y-3 p-3 bg-muted/50 rounded-lg">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Import Options</p>
              <div className="flex items-center justify-between">
                <Label className="text-sm">Skip duplicates (by Mobile)</Label>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm">Update existing records</Label>
                <Switch />
              </div>
            </div>
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
              <p className="text-xs text-amber-700">Mobile number must be unique. Duplicate entries will be skipped or merged based on your settings.</p>
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setShowImport(false)}>Cancel</Button>
            <Button onClick={() => { setShowImport(false); toast.success("Import started"); }} className="gap-2"><Upload className="h-4 w-4" />Start Import</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Export Dialog */}
      <Dialog open={showExport} onOpenChange={setShowExport}>
        <DialogContent className="sm:max-w-[500px] bg-background">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Download className="h-5 w-5" />Export Devotees</DialogTitle>
            <DialogDescription>Export devotee records with selected options</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label className="text-xs">Export Type</Label>
              <Select value={exportType} onValueChange={setExportType}>
                <SelectTrigger className="mt-1 bg-background"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-popover">
                  <SelectItem value="all">All Devotees ({allDevotees.length})</SelectItem>
                  <SelectItem value="filtered">Filtered ({filtered.length})</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Format</Label>
              <Select value={exportFormat} onValueChange={setExportFormat}>
                <SelectTrigger className="mt-1 bg-background"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-popover">
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs mb-2 block">Fields to Include</Label>
              <div className="space-y-2">
                {["Basic Info", "Booking Summary", "Donation Summary", "Volunteer Info", "Custom Fields"].map(f => (
                  <div key={f} className="flex items-center gap-2"><Checkbox id={`export-${f}`} defaultChecked /><Label htmlFor={`export-${f}`} className="text-sm">{f}</Label></div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setShowExport(false)}>Cancel</Button>
            <Button onClick={handleExport} className="gap-2"><Download className="h-4 w-4" />Export</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add VIP Devotee Dialog - Select Devotee First */}
      {showAddVip && !vipDialogDevotee && (
        <Dialog open={true} onOpenChange={(open) => {
          if (!open) {
            setShowAddVip(false);
            setVipDialogDevotee(null);
          }
        }}>
          <DialogContent className="max-w-lg bg-background">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-amber-600" />
                Add VIP Devotee
              </DialogTitle>
              <DialogDescription>
                Select an existing devotee to mark as VIP
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs">Select Devotee *</Label>
                <Select 
                  value={vipDialogDevotee?.id || ""} 
                  onValueChange={(id) => {
                    const devotee = allDevotees.find(d => d.id === id);
                    if (devotee) {
                      setVipDialogDevotee(devotee);
                      setShowAddVip(false);
                    }
                  }}
                >
                  <SelectTrigger className="h-9 bg-background">
                    <SelectValue placeholder="Search and select devotee" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    {allDevotees.filter(d => !d.vip).map((d) => (
                      <SelectItem key={d.id} value={d.id}>
                        {d.name} ({d.phone}) · {d.id}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {allDevotees.filter(d => !d.vip).length === 0 && (
                  <p className="text-[11px] text-muted-foreground">
                    All devotees are already VIPs
                  </p>
                )}
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => { setShowAddVip(false); setVipDialogDevotee(null); }}>Cancel</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Mark as VIP Dialog - Shows after devotee is selected */}
      {vipDialogDevotee && !showAddVip && (
        <Dialog open={true} onOpenChange={(open) => {
          if (!open) {
            setVipDialogDevotee(null);
            resetVipForm();
          }
        }}>
        <DialogContent className="max-w-lg bg-background">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-amber-600" />
              Mark as VIP
            </DialogTitle>
            <DialogDescription>
              {vipDialogDevotee?.name} · {vipDialogDevotee?.id}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="rounded-md border bg-muted/40 p-3 text-[11px] text-muted-foreground">
              Assign VIP classification and privileges on top of the existing Devotee profile. After saving, you will be redirected to VIP Management.
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs">VIP Category *</Label>
                <SelectWithAddNew
                  value={vipCategory}
                  onValueChange={setVipCategory}
                  placeholder="Select category"
                  options={vipCategoryOptions}
                  onAddNew={(v) => setVipCategoryOptions((prev) => [...prev, v])}
                  className="h-9 bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">VIP Level *</Label>
                <SelectWithAddNew
                  value={vipLevel}
                  onValueChange={setVipLevel}
                  placeholder="Select level"
                  options={vipLevelOptions}
                  onAddNew={(v) => setVipLevelOptions((prev) => [...prev, v])}
                  className="h-9 bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Valid From *</Label>
                <Input type="date" className="h-9" value={vipValidFrom} onChange={e => setVipValidFrom(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Valid Till *</Label>
                <Input type="date" className="h-9" value={vipValidTill} onChange={e => setVipValidTill(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Approval Authority</Label>
                <SelectWithAddNew
                  value={vipApprovalAuthority}
                  onValueChange={setVipApprovalAuthority}
                  placeholder="Select approver"
                  options={vipApprovalOptions}
                  onAddNew={(v) => setVipApprovalOptions((prev) => [...prev, v])}
                  className="h-9 bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs flex items-center justify-between">
                  <span>Sensitive Flag</span>
                  <span className="text-[11px] text-muted-foreground">
                    Restricts who can view this record
                  </span>
                </Label>
                <div className="flex items-center justify-between rounded-md border bg-muted/40 px-3 py-2">
                  <span className="text-xs">Mark as sensitive</span>
                  <Switch checked={vipSensitive} onCheckedChange={setVipSensitive} />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Notes / Reason</Label>
              <Textarea
                rows={3}
                placeholder="Reason for VIP classification, context on privileges, etc."
                value={vipNotes}
                onChange={e => setVipNotes(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter className="mt-2 flex items-center justify-between">
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <AlertTriangle className="h-3 w-3" />
              On save, system will activate privileges and redirect to VIP Management.
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => { setVipDialogDevotee(null); resetVipForm(); }}>Cancel</Button>
              <Button size="sm" className="gap-1" onClick={handleMarkAsVip}>
                <Crown className="h-3 w-3" />
                Mark as VIP
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      )}
    </div>
  );
};

export default DevoteesList;
