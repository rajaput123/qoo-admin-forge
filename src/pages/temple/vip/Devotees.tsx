import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SelectWithAddNew from "@/components/SelectWithAddNew";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Search,
  Crown,
  Users,
  UserCheck,
  IndianRupee,
  Calendar,
  Phone,
  Mail,
  MapPin,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Shield,
  Edit,
  ExternalLink,
  ArrowLeft,
  Plus,
} from "lucide-react";
import { toast } from "sonner";
import { Devotee, devoteesData, VipInfo } from "@/data/devotees";

const VipDevotees = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [filterLevel, setFilterLevel] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterSensitive, setFilterSensitive] = useState("all");
  const [viewing, setViewing] = useState<Devotee | null>(null);
  const [showAddVip, setShowAddVip] = useState(false);
  const [allDevotees, setAllDevotees] = useState<Devotee[]>(devoteesData);

  // Devotee form state (full devotee creation)
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

  // VIP form state
  const [addVipCategory, setAddVipCategory] = useState("");
  const [addVipLevel, setAddVipLevel] = useState("");
  const [addVipValidFrom, setAddVipValidFrom] = useState("");
  const [addVipValidTill, setAddVipValidTill] = useState("");
  const [addVipApproval, setAddVipApproval] = useState("");
  const [addVipSensitive, setAddVipSensitive] = useState(false);
  const [addVipNotes, setAddVipNotes] = useState("");

  // Options
  const [genderOptions, setGenderOptions] = useState(["Male", "Female", "Other"]);
  const [langOptions, setLangOptions] = useState(["Kannada", "Tamil", "Telugu", "Hindi", "Malayalam", "Marathi", "English"]);
  const [cityOptions, setCityOptions] = useState(["Bangalore", "Chennai", "Hyderabad", "Mumbai", "Pune", "Kochi", "Mysore"]);
  const [stateOptions, setStateOptions] = useState(["Karnataka", "Tamil Nadu", "Telangana", "Maharashtra", "Kerala"]);
  const [countryOptions, setCountryOptions] = useState(["India", "USA", "UK", "Singapore", "UAE"]);
  const [tagOptions, setTagOptions] = useState(["Donor", "Regular Devotee", "Festival Participant", "New"]);
  const [sourceOptions, setSourceOptions] = useState(["Walk-in", "Online", "Festival", "Referral"]);
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

  const vipDevotees = allDevotees.filter((d) => d.vip);

  useEffect(() => {
    const devoteeId = searchParams.get("devoteeId");
    if (devoteeId) {
      const devotee = vipDevotees.find(d => d.id === devoteeId);
      if (devotee) {
        setViewing(devotee);
        setSearchParams({});
      }
    }
  }, [searchParams, vipDevotees, setSearchParams]);

  const filtered = vipDevotees.filter((v) => {
    if (
      search &&
      !v.name.toLowerCase().includes(search.toLowerCase()) &&
      !v.phone.includes(search) &&
      !v.email.toLowerCase().includes(search.toLowerCase()) &&
      !v.id.toLowerCase().includes(search.toLowerCase())
    )
      return false;
    if (filterLevel !== "all" && v.vip?.level !== filterLevel) return false;
    if (filterCategory !== "all" && v.vip?.category !== filterCategory) return false;
    if (filterStatus !== "all" && v.vip?.status !== filterStatus) return false;
    if (filterSensitive === "yes" && !v.vip?.sensitive) return false;
    if (filterSensitive === "no" && v.vip?.sensitive) return false;
    return true;
  });

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const totalPages = Math.ceil(filtered.length / perPage) || 1;
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  const handleAddVip = () => {
    if (!addName || !addPhone) {
      toast.error("Name and Mobile are required");
      return;
    }
    if (allDevotees.some(d => d.phone === addPhone)) {
      toast.error("Mobile number already exists");
      return;
    }
    if (!addVipCategory || !addVipLevel || !addVipValidFrom || !addVipValidTill) {
      toast.error("Please fill all required VIP fields");
      return;
    }

    const newId = `DEV-${String(allDevotees.length + 1).padStart(4, "0")}`;
    const vipInfo: VipInfo = {
      status: "Active",
      category: addVipCategory,
      level: addVipLevel,
      validFrom: addVipValidFrom,
      validTill: addVipValidTill,
      sensitive: addVipSensitive,
      approvedBy: addVipApproval,
      notes: addVipNotes,
    };

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
      tags: [...addTags, "VIP"],
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
      customFields: {},
      vip: vipInfo,
    };

    setAllDevotees(prev => [...prev, newDevotee]);
    toast.success(`${addName} added as VIP devotee`);
    setShowAddVip(false);
    resetAddVipForm();
  };

  const resetAddVipForm = () => {
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
    setAddVipCategory("");
    setAddVipLevel("");
    setAddVipValidFrom("");
    setAddVipValidTill("");
    setAddVipApproval("");
    setAddVipSensitive(false);
    setAddVipNotes("");
  };

  // If viewing a detail, show inline detail page
  if (viewing) {
    return (
      <div className="p-6 space-y-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Button
            variant="ghost"
            onClick={() => setViewing(null)}
            className="mb-4 gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to VIP Devotees
          </Button>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Crown className="h-6 w-6 text-amber-600" />
                  <div>
                    <CardTitle className="text-2xl">{viewing.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      VIP Devotee Profile
                    </p>
                  </div>
                  {viewing.vip && (
                    <Badge variant="outline" className="ml-2 text-[11px] gap-1">
                      <Crown className="h-3 w-3 text-amber-500" />
                      {viewing.vip.level}
                    </Badge>
                  )}
                  {viewing.vip?.sensitive && (
                    <Badge
                      variant="outline"
                      className="text-[10px] border-amber-500/70 text-amber-700 gap-1"
                    >
                      <Shield className="h-3 w-3" />
                      Sensitive
                    </Badge>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1"
                  onClick={() => {
                    navigate(`/temple/devotees?devoteeId=${viewing.id}`);
                  }}
                >
                  <ExternalLink className="h-3 w-3" />
                  View in Devotee CRM
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="summary" className="mt-2">
                <div className="border-b border-border">
                  <TabsList className="w-full justify-start border-b-0 rounded-none h-auto p-0 bg-transparent gap-0">
                    <TabsTrigger 
                      value="summary" 
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-amber-700 data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:font-medium px-4 py-2 text-sm text-muted-foreground data-[state=active]:text-foreground"
                    >
                      Summary
                    </TabsTrigger>
                    <TabsTrigger 
                      value="privileges" 
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-amber-700 data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:font-medium px-4 py-2 text-sm text-muted-foreground data-[state=active]:text-foreground"
                    >
                      Privileges
                    </TabsTrigger>
                    <TabsTrigger 
                      value="governance" 
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-amber-700 data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:font-medium px-4 py-2 text-sm text-muted-foreground data-[state=active]:text-foreground"
                    >
                      Governance
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="summary" className="mt-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">VIP Category</span>
                        <Badge variant="outline" className="text-[11px]">
                          {viewing.vip?.category}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Total Donation</span>
                        <span className="text-sm font-medium">
                          ₹{viewing.totalDonations.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Valid Till</span>
                        <span className="text-xs flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {viewing.vip?.validTill}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Status</span>
                        <Badge
                          variant={viewing.vip?.status === "Active" ? "default" : "secondary"}
                          className="text-[11px]"
                        >
                          {viewing.vip?.status}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Phone</span>
                        <span className="text-xs flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {viewing.phone}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Email</span>
                        <span className="text-xs flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {viewing.email || "—"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">City</span>
                        <span className="text-xs flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {viewing.city}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Label className="text-xs">Admin Notes</Label>
                      <Textarea 
                        rows={5} 
                        placeholder="Notes about VIP treatment, preferences, restrictions..." 
                        defaultValue={viewing.vip?.notes || ""}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="privileges" className="mt-4 space-y-3">
                  <p className="text-xs text-muted-foreground">
                    This section represents the effective privileges derived from the selected VIP
                    Level. Actual logic should be centralized in the Privilege Engine.
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      "Booking Override",
                      "Reserved Seating",
                      "Darshan Fast Track",
                      "Discount on Offerings",
                      "Special Entry Access",
                    ].map((p) => (
                      <Card key={p} className="border-dashed">
                        <CardContent className="p-3">
                          <p className="text-xs font-medium">{p}</p>
                          <p className="text-[11px] text-muted-foreground mt-1">
                            Controlled by Level configuration
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="governance" className="mt-4 space-y-3">
                  <p className="text-xs text-muted-foreground">
                    All VIP status changes (create, upgrade, downgrade, deactivate, expiry) must
                    be captured in audit logs with <span className="font-semibold">who</span>,{" "}
                    <span className="font-semibold">what</span>,{" "}
                    <span className="font-semibold">when</span> and{" "}
                    <span className="font-semibold">reason</span>.
                  </p>
                  <div className="rounded-md border bg-muted/40 p-3 text-[11px] space-y-1.5">
                    <p className="font-semibold flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3 text-warning" />
                      Governance guideline
                    </p>
                    <p>
                      Deactivation and downgrades should never hard-delete VIP history. Instead,
                      mark VIP as expired or inactive and keep full audit trail.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
              <Crown className="h-6 w-6 text-amber-600" />
              VIP Devotees
            </h1>
            <p className="text-muted-foreground">
              Manage VIP devotee classification, validity and sensitive flags
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setShowAddVip(true)}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Add VIP Devotee
            </Button>
          </div>
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total VIPs", value: vipDevotees.length.toString(), icon: Users },
            {
              label: "Active",
              value: vipDevotees.filter((v) => v.vip?.status === "Active").length.toString(),
              icon: UserCheck,
            },
            {
              label: "Total VIP Donation",
              value: `₹${vipDevotees
                .reduce((a, d) => a + d.totalDonations, 0)
                .toLocaleString()}`,
              icon: IndianRupee,
            },
            {
              label: "Sensitive Tagged",
              value: vipDevotees.filter((v) => v.vip?.sensitive).length.toString(),
              icon: Shield,
            },
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
            <Input
              placeholder="Search VIP name, phone, email, ID..."
              className="pl-9"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <Select
            value={filterLevel}
            onValueChange={(v) => {
              setFilterLevel(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[140px] bg-background">
              <SelectValue placeholder="Level" />
            </SelectTrigger>
            <SelectContent className="bg-popover">
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="Platinum">Platinum</SelectItem>
              <SelectItem value="Gold">Gold</SelectItem>
              <SelectItem value="Silver">Silver</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={filterCategory}
            onValueChange={(v) => {
              setFilterCategory(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[180px] bg-background">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="bg-popover">
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="High Donor">High Donor</SelectItem>
              <SelectItem value="Volunteer Donor">Volunteer Donor</SelectItem>
              <SelectItem value="Festival Patron">Festival Patron</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={filterStatus}
            onValueChange={(v) => {
              setFilterStatus(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[130px] bg-background">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-popover">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Expired">Expired</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={filterSensitive}
            onValueChange={(v) => {
              setFilterSensitive(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[150px] bg-background">
              <SelectValue placeholder="Sensitive" />
            </SelectTrigger>
            <SelectContent className="bg-popover">
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="yes">Sensitive Only</SelectItem>
              <SelectItem value="no">Non-Sensitive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="bg-card border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>VIP Devotee</TableHead>
                <TableHead>Category / Level</TableHead>
                <TableHead className="text-right">Total Donation</TableHead>
                <TableHead className="text-center">Valid Till</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {paged.map((v) => (
                <TableRow
                  key={v.id}
                  className="cursor-pointer hover:bg-muted/40"
                  onClick={() => setViewing(v)}
                >
                  <TableCell>
                    <div>
                      <p className="font-medium text-sm">{v.name}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                        <Phone className="h-3 w-3" />
                        <span>{v.phone}</span>
                        {v.email && (
                          <>
                            <span>•</span>
                            <Mail className="h-3 w-3" />
                            <span>{v.email}</span>
                          </>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5">
                        <MapPin className="h-3 w-3" />
                        <span>{v.city}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <Badge variant="outline" className="w-fit text-[11px] gap-1">
                        <Crown className="h-3 w-3 text-amber-500" />
                        {v.vip?.level}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{v.vip?.category}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right text-sm font-medium">
                    ₹{v.totalDonations.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-center text-xs">
                    <div className="flex flex-col items-center gap-0.5">
                      <span>{v.vip?.validTill || "—"}</span>
                      {v.vip?.status === "Expired" && (
                        <span className="text-[11px] text-warning flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          Expired
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant={v.vip?.status === "Active" ? "default" : "secondary"}
                      className="text-[11px]"
                    >
                      {v.vip?.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {v.vip?.sensitive && (
                      <Badge
                        variant="outline"
                        className="text-[10px] border-amber-500/70 text-amber-700 gap-1"
                      >
                        <Shield className="h-3 w-3" />
                        Sensitive
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {paged.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-sm text-muted-foreground">
                    No VIP devotees found for the selected filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t bg-muted/40">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>
                Showing {paged.length ? (page - 1) * perPage + 1 : 0}-
                {(page - 1) * perPage + paged.length} of {filtered.length} VIP devotees
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Select
                value={perPage.toString()}
                onValueChange={(v) => {
                  setPerPage(Number(v));
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-[90px] h-8 bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  <SelectItem value="10">10 / page</SelectItem>
                  <SelectItem value="20">20 / page</SelectItem>
                  <SelectItem value="50">50 / page</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-xs text-muted-foreground">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Add VIP Devotee Dialog - Full Devotee Creation Form */}
        <Dialog open={showAddVip} onOpenChange={setShowAddVip}>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto bg-background">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-amber-600" />
                Add New VIP Devotee
              </DialogTitle>
              <DialogDescription>
                Create a new devotee profile with VIP classification and privileges.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 mt-4">
              {/* Basic Info */}
              <div>
                <h3 className="text-sm font-semibold mb-3 text-primary">Basic Info</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <Label className="text-xs">Full Name *</Label>
                    <Input 
                      placeholder="Enter full name" 
                      className="mt-1" 
                      value={addName} 
                      onChange={e => setAddName(e.target.value)} 
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Mobile (Unique) *</Label>
                    <Input 
                      placeholder="+91 XXXXX XXXXX" 
                      className="mt-1" 
                      value={addPhone} 
                      onChange={e => setAddPhone(e.target.value)} 
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Email</Label>
                    <Input 
                      placeholder="email@example.com" 
                      className="mt-1" 
                      value={addEmail} 
                      onChange={e => setAddEmail(e.target.value)} 
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Date of Birth</Label>
                    <Input 
                      type="date" 
                      className="mt-1" 
                      value={addDob} 
                      onChange={e => setAddDob(e.target.value)} 
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Gender</Label>
                    <SelectWithAddNew 
                      value={addGender} 
                      onValueChange={setAddGender} 
                      placeholder="Select gender" 
                      options={genderOptions} 
                      onAddNew={v => setGenderOptions(p => [...p, v])} 
                      className="mt-1 bg-background" 
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Preferred Language</Label>
                    <SelectWithAddNew 
                      value={addLanguage} 
                      onValueChange={setAddLanguage} 
                      placeholder="Select language" 
                      options={langOptions} 
                      onAddNew={v => setLangOptions(p => [...p, v])} 
                      className="mt-1 bg-background" 
                    />
                  </div>
                </div>
              </div>

              {/* Address */}
              <div>
                <h3 className="text-sm font-semibold mb-3 text-primary">Address</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <Label className="text-xs">Address</Label>
                    <Input 
                      placeholder="Street address" 
                      className="mt-1" 
                      value={addAddress} 
                      onChange={e => setAddAddress(e.target.value)} 
                    />
                  </div>
                  <div>
                    <Label className="text-xs">City</Label>
                    <SelectWithAddNew 
                      value={addCity} 
                      onValueChange={setAddCity} 
                      placeholder="Select city" 
                      options={cityOptions} 
                      onAddNew={v => setCityOptions(p => [...p, v])} 
                      className="mt-1 bg-background" 
                    />
                  </div>
                  <div>
                    <Label className="text-xs">State</Label>
                    <SelectWithAddNew 
                      value={addState} 
                      onValueChange={setAddState} 
                      placeholder="Select state" 
                      options={stateOptions} 
                      onAddNew={v => setStateOptions(p => [...p, v])} 
                      className="mt-1 bg-background" 
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Country</Label>
                    <SelectWithAddNew 
                      value={addCountry} 
                      onValueChange={setAddCountry} 
                      placeholder="Select country" 
                      options={countryOptions} 
                      onAddNew={v => setCountryOptions(p => [...p, v])} 
                      className="mt-1 bg-background" 
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Pincode</Label>
                    <Input 
                      placeholder="Pincode" 
                      className="mt-1" 
                      value={addPincode} 
                      onChange={e => setAddPincode(e.target.value)} 
                    />
                  </div>
                </div>
              </div>

              {/* Relationship */}
              <div>
                <h3 className="text-sm font-semibold mb-3 text-primary">Relationship</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <Label className="text-xs">Tags (Multi-select)</Label>
                    <div className="flex flex-wrap gap-3 mt-1.5">
                      {tagOptions.map(tag => (
                        <div key={tag} className="flex items-center gap-2">
                          <Checkbox 
                            id={`tag-${tag}`} 
                            checked={addTags.includes(tag)} 
                            onCheckedChange={checked => {
                              if (checked) setAddTags([...addTags, tag]);
                              else setAddTags(addTags.filter(t => t !== tag));
                            }} 
                          />
                          <Label htmlFor={`tag-${tag}`} className="text-sm">{tag}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs">Source</Label>
                    <SelectWithAddNew 
                      value={addSource} 
                      onValueChange={setAddSource} 
                      placeholder="Select source" 
                      options={sourceOptions} 
                      onAddNew={v => setSourceOptions(p => [...p, v])} 
                      className="mt-1 bg-background" 
                    />
                  </div>
                </div>
              </div>

              {/* VIP Information */}
              <div>
                <h3 className="text-sm font-semibold mb-3 text-amber-600 flex items-center gap-2">
                  <Crown className="h-4 w-4" />
                  VIP Information
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">VIP Category *</Label>
                    <SelectWithAddNew
                      value={addVipCategory}
                      onValueChange={setAddVipCategory}
                      placeholder="Select category"
                      options={vipCategoryOptions}
                      onAddNew={(v) => setVipCategoryOptions((prev) => [...prev, v])}
                      className="mt-1 bg-background"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">VIP Level *</Label>
                    <SelectWithAddNew
                      value={addVipLevel}
                      onValueChange={setAddVipLevel}
                      placeholder="Select level"
                      options={vipLevelOptions}
                      onAddNew={(v) => setVipLevelOptions((prev) => [...prev, v])}
                      className="mt-1 bg-background"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Valid From *</Label>
                    <Input 
                      type="date" 
                      className="mt-1 h-9" 
                      value={addVipValidFrom}
                      onChange={(e) => setAddVipValidFrom(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Valid Till *</Label>
                    <Input 
                      type="date" 
                      className="mt-1 h-9" 
                      value={addVipValidTill}
                      onChange={(e) => setAddVipValidTill(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Approval Authority</Label>
                    <SelectWithAddNew
                      value={addVipApproval}
                      onValueChange={setAddVipApproval}
                      placeholder="Select approver"
                      options={vipApprovalOptions}
                      onAddNew={(v) => setVipApprovalOptions((prev) => [...prev, v])}
                      className="mt-1 bg-background"
                    />
                  </div>
                  <div>
                    <Label className="text-xs flex items-center justify-between">
                      <span>Sensitive Flag</span>
                      <span className="text-[11px] text-muted-foreground">
                        Restricts who can view this record
                      </span>
                    </Label>
                    <div className="flex items-center justify-between rounded-md border bg-muted/40 px-3 py-2 mt-1">
                      <span className="text-xs">Mark as sensitive</span>
                      <Switch 
                        checked={addVipSensitive}
                        onCheckedChange={setAddVipSensitive}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <Label className="text-xs">Notes</Label>
                <Textarea
                  rows={3}
                  placeholder="Additional notes about the devotee..."
                  className="mt-1"
                  value={addNotes}
                  onChange={e => setAddNotes(e.target.value)}
                />
              </div>
              <div>
                <Label className="text-xs">VIP Notes / Reason</Label>
                <Textarea
                  rows={3}
                  placeholder="Reason for VIP classification, context on privileges, etc."
                  className="mt-1"
                  value={addVipNotes}
                  onChange={(e) => setAddVipNotes(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                <AlertTriangle className="h-3 w-3" />
                On save, system should activate privileges and write an audit log (conceptual only
                in this demo).
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => {
                  setShowAddVip(false);
                  resetAddVipForm();
                }}>
                  Cancel
                </Button>
                <Button size="sm" className="gap-1" onClick={handleAddVip}>
                  <Plus className="h-3 w-3" />
                  Add VIP Devotee
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  );
};

export default VipDevotees;

