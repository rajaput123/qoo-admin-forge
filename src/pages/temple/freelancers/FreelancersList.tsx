import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Plus, Download, Upload, Phone, Mail, MapPin, ChevronLeft, ChevronRight, Star, Edit, FileText, Eye, ArrowLeft, Trash2, Replace, Key, ExternalLink, Copy, RefreshCw, HelpCircle } from "lucide-react";
import { toast } from "sonner";
import SelectWithAddNew from "@/components/SelectWithAddNew";
import CustomFieldsSection, { CustomField } from "@/components/CustomFieldsSection";

type Document = {
  name: string;
  type: string;
  uploadedDate: string;
  uploadedBy: string;
};

type Assignment = {
  id: string;
  eventName: string;
  linkedStructure: string;
  date: string;
  duration: string;
  agreedPayment: number;
  status: string;
};

type Payment = {
  id: string;
  eventName: string;
  paymentDate: string;
  amount: number;
  paymentMode: string;
  invoiceFile: string;
  status: string;
};

type PerformanceRecord = {
  eventName: string;
  date: string;
  rating: number;
  reviewNotes: string;
  reviewedBy: string;
};

type PaymentTerm = {
  rate: number;
  currency: string;
  billingCycle: string;
  paymentTerms: string;
  taxApplicable: boolean;
  tdsPercentage: number;
  notes: string;
};

type Freelancer = {
  id: string;
  businessName: string;
  contactPerson: string;
  mobile: string;
  email: string;
  gstNumber: string;
  panNumber: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  serviceCategories: string[];
  skillsDescription: string;
  equipment: string;
  availability: string;
  pricingModel: string;
  totalAssignments: number;
  totalPaid: number;
  rating: number;
  status: string;
  documents: Document[];
  assignments: Assignment[];
  payments: Payment[];
  performance: PerformanceRecord[];
  customFields: Record<string, string>;
  // Login Credentials
  loginUsername?: string;
  loginPassword?: string;
  portalAccessEnabled: boolean;
  portalUrl?: string;
  // Payment Terms
  paymentTerms?: PaymentTerm;
};

// DEMO/SEED DATA - Remove this array for first-time onboarding
// In production, this would be loaded from a database/API
// For first-time users, start with empty array: const freelancers: Freelancer[] = [];
const seedFreelancers: Freelancer[] = [
  {
    id: "FRL-0001", businessName: "Pixel Studio", contactPerson: "Rajesh Kumar", mobile: "+91 98765 43210", email: "rajesh@pixelstudio.com", gstNumber: "29ABCDE1234F1Z5", panNumber: "ABCDE1234F", address: "12, MG Road", city: "Bangalore", state: "Karnataka", country: "India", pincode: "560001",
    serviceCategories: ["Photography", "Videography"], skillsDescription: "Event photography, drone shots, live streaming", equipment: "Canon R5, DJI Mavic 3, Gimbal", availability: "Weekends", pricingModel: "Per Event",
    totalAssignments: 24, totalPaid: 480000, rating: 4.8, status: "Active",
    documents: [{ name: "ID Proof.pdf", type: "ID Proof", uploadedDate: "2025-06-15", uploadedBy: "Admin" }, { name: "Agreement_2025.pdf", type: "Agreement Copy", uploadedDate: "2025-06-15", uploadedBy: "Admin" }],
    assignments: [{ id: "ASN-001", eventName: "Brahmotsavam 2026", linkedStructure: "Main Temple", date: "2026-02-01", duration: "3 days", agreedPayment: 45000, status: "Completed" }, { id: "ASN-012", eventName: "Ratha Yatra", linkedStructure: "Main Temple", date: "2026-03-15", duration: "1 day", agreedPayment: 15000, status: "Assigned" }],
    payments: [{ id: "PAY-001", eventName: "Brahmotsavam 2026", paymentDate: "2026-02-05", amount: 45000, paymentMode: "Bank Transfer", invoiceFile: "INV-001.pdf", status: "Paid" }],
    performance: [{ eventName: "Brahmotsavam 2026", date: "2026-02-05", rating: 5, reviewNotes: "Excellent coverage, timely delivery", reviewedBy: "Temple Admin" }],
    customFields: {},
    loginUsername: "pixelstudio", loginPassword: "****", portalAccessEnabled: true, portalUrl: "https://portal.templeadmin.com/freelancer/pixelstudio",
    paymentTerms: { rate: 45000, currency: "INR", billingCycle: "Per Event", paymentTerms: "Net 7", taxApplicable: true, tdsPercentage: 2, notes: "Rate includes travel within city" }
  },
  {
    id: "FRL-0002", businessName: "Decor Dreams", contactPerson: "Sunita Patel", mobile: "+91 87654 32109", email: "sunita@decordreams.in", gstNumber: "", panNumber: "FGHIJ5678K", address: "45, Jubilee Hills", city: "Hyderabad", state: "Telangana", country: "India", pincode: "500033",
    serviceCategories: ["Decoration", "Floral Arrangement"], skillsDescription: "Temple decoration, mandap setup, floral art", equipment: "Own materials & team", availability: "Festival Only", pricingModel: "Per Event",
    totalAssignments: 18, totalPaid: 360000, rating: 4.5, status: "Active",
    documents: [{ name: "PAN_Card.pdf", type: "ID Proof", uploadedDate: "2025-08-10", uploadedBy: "Admin" }],
    assignments: [{ id: "ASN-002", eventName: "Vaikunta Ekadasi", linkedStructure: "Main Temple", date: "2026-01-10", duration: "2 days", agreedPayment: 35000, status: "Completed" }],
    payments: [{ id: "PAY-002", eventName: "Vaikunta Ekadasi", paymentDate: "2026-01-12", amount: 35000, paymentMode: "UPI", invoiceFile: "INV-002.pdf", status: "Paid" }],
    performance: [{ eventName: "Vaikunta Ekadasi", date: "2026-01-12", rating: 4, reviewNotes: "Good work, slight delay in setup", reviewedBy: "Event Manager" }],
    customFields: {},
    loginUsername: "decordreams", loginPassword: "****", portalAccessEnabled: true, portalUrl: "https://portal.templeadmin.com/freelancer/decordreams"
  },
  {
    id: "FRL-0003", businessName: "Sound Waves Pro", contactPerson: "Karthik Menon", mobile: "+91 76543 21098", email: "karthik@soundwaves.com", gstNumber: "32LMNOP9876Q1Z8", panNumber: "LMNOP9876Q", address: "78, MG Road", city: "Kochi", state: "Kerala", country: "India", pincode: "682001",
    serviceCategories: ["Sound Engineering", "Live Streaming"], skillsDescription: "PA systems, live mixing, streaming setup", equipment: "JBL PA, Behringer X32, OBS Setup", availability: "Weekdays", pricingModel: "Per Day",
    totalAssignments: 30, totalPaid: 540000, rating: 4.9, status: "Active",
    documents: [{ name: "GST_Certificate.pdf", type: "ID Proof", uploadedDate: "2025-05-20", uploadedBy: "Admin" }, { name: "Insurance.pdf", type: "Insurance", uploadedDate: "2025-05-20", uploadedBy: "Admin" }],
    assignments: [{ id: "ASN-003", eventName: "Daily Live Broadcast", linkedStructure: "Main Temple", date: "2026-02-09", duration: "Ongoing", agreedPayment: 18000, status: "Assigned" }],
    payments: [{ id: "PAY-003", eventName: "January Broadcasting", paymentDate: "2026-02-01", amount: 18000, paymentMode: "Bank Transfer", invoiceFile: "INV-003.pdf", status: "Paid" }],
    performance: [{ eventName: "January Broadcasting", date: "2026-02-01", rating: 5, reviewNotes: "Flawless streaming, zero downtime", reviewedBy: "Temple Admin" }],
    customFields: {},
    loginUsername: "soundwaves", loginPassword: "****", portalAccessEnabled: true, portalUrl: "https://portal.templeadmin.com/freelancer/soundwaves",
    paymentTerms: { rate: 18000, currency: "INR", billingCycle: "Monthly", paymentTerms: "Net 15", taxApplicable: true, tdsPercentage: 2, notes: "Monthly retainer for streaming services" }
  },
  {
    id: "FRL-0004", businessName: "CreativeMinds Design", contactPerson: "Ananya Desai", mobile: "+91 65432 10987", email: "ananya@creativeminds.in", gstNumber: "", panNumber: "RSTUV3456W", address: "23, Koramangala", city: "Bangalore", state: "Karnataka", country: "India", pincode: "560034",
    serviceCategories: ["Graphic Design", "Print Design"], skillsDescription: "Brochures, posters, social media creatives, invitation cards", equipment: "Adobe Suite", availability: "Weekdays", pricingModel: "Per Hour",
    totalAssignments: 15, totalPaid: 120000, rating: 4.3, status: "Active",
    documents: [{ name: "Portfolio.pdf", type: "Other Supporting Documents", uploadedDate: "2025-09-01", uploadedBy: "Admin" }],
    assignments: [{ id: "ASN-004", eventName: "Annual Calendar Design", linkedStructure: "Administration", date: "2026-01-05", duration: "10 days", agreedPayment: 25000, status: "Completed" }],
    payments: [{ id: "PAY-004", eventName: "Annual Calendar Design", paymentDate: "2026-01-18", amount: 25000, paymentMode: "UPI", invoiceFile: "INV-004.pdf", status: "Paid" }],
    performance: [{ eventName: "Annual Calendar Design", date: "2026-01-18", rating: 4, reviewNotes: "Creative work, needed minor revisions", reviewedBy: "PR Head" }],
    customFields: {},
    portalAccessEnabled: false
  },
  {
    id: "FRL-0005", businessName: "Vastu Consultancy", contactPerson: "Dr. Mohan Rao", mobile: "+91 54321 09876", email: "mohan@vastuconsult.com", gstNumber: "36XYZAB1234C1Z2", panNumber: "XYZAB1234C", address: "56, Banjara Hills", city: "Hyderabad", state: "Telangana", country: "India", pincode: "500034",
    serviceCategories: ["Consulting"], skillsDescription: "Vastu consultation for temple renovations and new constructions", equipment: "N/A", availability: "Weekdays", pricingModel: "Custom",
    totalAssignments: 6, totalPaid: 180000, rating: 4.7, status: "Active",
    documents: [{ name: "Certification.pdf", type: "Other Supporting Documents", uploadedDate: "2025-04-10", uploadedBy: "Admin" }],
    assignments: [{ id: "ASN-005", eventName: "New Shrine Consultation", linkedStructure: "Padmavathi Shrine", date: "2026-01-20", duration: "2 days", agreedPayment: 30000, status: "Completed" }],
    payments: [{ id: "PAY-005", eventName: "New Shrine Consultation", paymentDate: "2026-01-25", amount: 30000, paymentMode: "Bank Transfer", invoiceFile: "INV-005.pdf", status: "Paid" }],
    performance: [{ eventName: "New Shrine Consultation", date: "2026-01-25", rating: 5, reviewNotes: "Expert advice, well-documented report", reviewedBy: "Temple Trustee" }],
    customFields: {},
    portalAccessEnabled: false
  },
  {
    id: "FRL-0006", businessName: "Digital Stream Co", contactPerson: "Pradeep Singh", mobile: "+91 43210 98765", email: "pradeep@digitalstream.co", gstNumber: "", panNumber: "DEFGH7890I", address: "90, Anna Nagar", city: "Chennai", state: "Tamil Nadu", country: "India", pincode: "600040",
    serviceCategories: ["Live Streaming", "Videography"], skillsDescription: "Multi-camera streaming, YouTube/Facebook live", equipment: "Sony A7III, ATEM Mini Pro, Streaming PC", availability: "Weekends", pricingModel: "Per Event",
    totalAssignments: 10, totalPaid: 150000, rating: 3.8, status: "Active",
    documents: [],
    assignments: [{ id: "ASN-006", eventName: "Pongal Celebration", linkedStructure: "Main Temple", date: "2026-01-14", duration: "1 day", agreedPayment: 12000, status: "Completed" }],
    payments: [{ id: "PAY-006", eventName: "Pongal Celebration", paymentDate: "2026-01-16", amount: 12000, paymentMode: "Cash", invoiceFile: "", status: "Paid" }],
    performance: [{ eventName: "Pongal Celebration", date: "2026-01-16", rating: 3.5, reviewNotes: "Audio issues during stream, video quality was good", reviewedBy: "IT Head" }],
    customFields: {},
    portalAccessEnabled: false
  },
  {
    id: "FRL-0007", businessName: "Heritage Electricals", contactPerson: "Suresh Babu", mobile: "+91 32109 87654", email: "", gstNumber: "29JKLMN5678O1Z4", panNumber: "JKLMN5678O", address: "34, Chickpet", city: "Bangalore", state: "Karnataka", country: "India", pincode: "560053",
    serviceCategories: ["Electrical Work", "Lighting"], skillsDescription: "Festival lighting, electrical installations, LED setup", equipment: "Own electrical supplies & team", availability: "Festival Only", pricingModel: "Per Event",
    totalAssignments: 20, totalPaid: 320000, rating: 4.6, status: "Active",
    documents: [{ name: "License.pdf", type: "Other Supporting Documents", uploadedDate: "2025-03-15", uploadedBy: "Admin" }],
    assignments: [],
    payments: [],
    performance: [],
    customFields: {},
    portalAccessEnabled: false
  },
  {
    id: "FRL-0008", businessName: "Akash Catering", contactPerson: "Ravi Shankar", mobile: "+91 21098 76543", email: "ravi@akashcatering.com", gstNumber: "", panNumber: "PQRST1234U", address: "67, Jayanagar", city: "Mysore", state: "Karnataka", country: "India", pincode: "570001",
    serviceCategories: ["Catering"], skillsDescription: "Large-scale prasadam distribution support", equipment: "Mobile kitchen units", availability: "Festival Only", pricingModel: "Per Day",
    totalAssignments: 8, totalPaid: 240000, rating: 4.2, status: "Inactive",
    documents: [{ name: "FSSAI_License.pdf", type: "Other Supporting Documents", uploadedDate: "2025-07-01", uploadedBy: "Admin" }],
    assignments: [],
    payments: [],
    performance: [],
    customFields: {},
    portalAccessEnabled: false
  },
];

// For first-time onboarding, start with one dummy data example
// Table will show only freelancers added through the "Add Freelancer" form
const freelancers: Freelancer[] = [
  {
    id: "FRL-0001",
    businessName: "Example Photography Studio",
    contactPerson: "John Doe",
    mobile: "+91 98765 43210",
    email: "john@examplephotography.com",
    gstNumber: "29ABCDE1234F1Z5",
    panNumber: "ABCDE1234F",
    address: "123, Main Street",
    city: "Bangalore",
    state: "Karnataka",
    country: "India",
    pincode: "560001",
    serviceCategories: ["Photography", "Videography"],
    skillsDescription: "Event photography and videography services",
    equipment: "Canon R5, DJI Drone",
    availability: "Weekends",
    pricingModel: "Per Event",
    totalAssignments: 0,
    totalPaid: 0,
    rating: 0,
    status: "Active",
    documents: [],
    assignments: [],
    payments: [],
    performance: [],
    customFields: {},
    portalAccessEnabled: false
  }
]; // One dummy example - rest added through form popup
// const freelancers: Freelancer[] = []; // Uncomment for completely empty table
// const freelancers: Freelancer[] = seedFreelancers; // Uncomment for full demo data

// NOTE: In production, this data would come from a database/API
// The seed data above is just for demo purposes
// New freelancers start with empty arrays - data accumulates as you:
// 1. Create assignments → updates assignments array
// 2. Complete assignments → creates payment records
// 3. Add reviews → updates performance array
// 4. Upload documents → updates documents array

const FreelancersList = () => {
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterCity, setFilterCity] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [viewing, setViewing] = useState<Freelancer | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteName, setInviteName] = useState("");
  const [inviteMobile, setInviteMobile] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [allFreelancers, setAllFreelancers] = useState(freelancers);

  // Helper function to sync freelancer stats from actual data sources
  // In production, this would query assignments, payments, and performance data
  const syncFreelancerStats = (freelancerId: string) => {
    // This is a placeholder - in real app, you'd fetch from:
    // - Assignments module: count assignments for this freelancer
    // - Payments module: sum payments for this freelancer
    // - Performance module: calculate average rating
    // For now, the data is stored in the freelancer object itself
    return null; // Placeholder
  };

  // Add form state
  const [addBusinessName, setAddBusinessName] = useState("");
  const [addContactPerson, setAddContactPerson] = useState("");
  const [addMobile, setAddMobile] = useState("");
  const [addEmail, setAddEmail] = useState("");
  const [addGstNumber, setAddGstNumber] = useState("");
  const [addPanNumber, setAddPanNumber] = useState("");
  const [addAddress, setAddAddress] = useState("");
  const [addCity, setAddCity] = useState("");
  const [addState, setAddState] = useState("");
  const [addCountry, setAddCountry] = useState("");
  const [addPincode, setAddPincode] = useState("");
  const [addServiceCategories, setAddServiceCategories] = useState<string[]>([]);
  const [addAvailability, setAddAvailability] = useState("");
  const [addPricingModel, setAddPricingModel] = useState("");
  const [addEquipment, setAddEquipment] = useState("");
  const [addSkillsDescription, setAddSkillsDescription] = useState("");
  const [addCustomFields, setAddCustomFields] = useState<CustomField[]>([]);
  const [addPortalAccessEnabled, setAddPortalAccessEnabled] = useState(false);
  const [addLoginUsername, setAddLoginUsername] = useState("");
  const [addLoginPassword, setAddLoginPassword] = useState("");
  // Payment Terms state
  const [addPtRate, setAddPtRate] = useState("");
  const [addPtCurrency, setAddPtCurrency] = useState("INR");
  const [addPtBillingCycle, setAddPtBillingCycle] = useState("");
  const [addPtPaymentTerms, setAddPtPaymentTerms] = useState("");
  const [addPtTaxApplicable, setAddPtTaxApplicable] = useState(false);
  const [addPtTdsPercentage, setAddPtTdsPercentage] = useState("");
  const [addPtNotes, setAddPtNotes] = useState("");
  const [cityOptions, setCityOptions] = useState(["Bangalore", "Chennai", "Hyderabad", "Mumbai", "Pune", "Kochi", "Mysore"]);
  const [stateOptions, setStateOptions] = useState(["Karnataka", "Tamil Nadu", "Telangana", "Maharashtra", "Kerala"]);
  const [countryOptions, setCountryOptions] = useState(["India", "USA", "UK", "Singapore", "UAE"]);
  const [categoryOptions, setCategoryOptions] = useState(["Photography", "Videography", "Decoration", "Floral Arrangement", "Sound Engineering", "Live Streaming", "Graphic Design", "Print Design", "Consulting", "Electrical Work", "Lighting", "Catering"]);
  const [availabilityOptions, setAvailabilityOptions] = useState(["Weekdays", "Weekends", "Festival Only", "All Days"]);
  const [pricingOptions, setPricingOptions] = useState(["Per Event", "Per Day", "Per Hour", "Custom"]);
  const [paymentModeOptions, setPaymentModeOptions] = useState(["Bank Transfer", "UPI", "Cash", "Cheque"]);
  const [billingCycleOptions, setBillingCycleOptions] = useState(["Per Event", "Per Day", "Weekly", "Monthly", "Quarterly", "One-time"]);
  const [paymentTermsOptions, setPaymentTermsOptions] = useState(["Advance", "Net 7", "Net 15", "Net 30", "Net 45", "On Completion", "50% Advance + 50% On Completion"]);

  // Export state
  const [exportType, setExportType] = useState("all");
  const [exportFormat, setExportFormat] = useState("csv");

  // Editing
  const [editing, setEditing] = useState<Freelancer | null>(null);

  const allCategories = [...new Set(allFreelancers.flatMap(f => f.serviceCategories))];
  const allCities = [...new Set(allFreelancers.map(f => f.city))];

  const filtered = allFreelancers.filter(f => {
    if (search && !f.businessName.toLowerCase().includes(search.toLowerCase()) && !f.contactPerson.toLowerCase().includes(search.toLowerCase()) && !f.mobile.includes(search) && !f.id.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterCategory !== "all" && !f.serviceCategories.includes(filterCategory)) return false;
    if (filterCity !== "all" && f.city !== filterCity) return false;
    if (filterStatus !== "all" && f.status !== filterStatus) return false;
    return true;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  // Populate form when editing
  useEffect(() => {
    if (editing) {
      setAddBusinessName(editing.businessName);
      setAddContactPerson(editing.contactPerson);
      setAddMobile(editing.mobile);
      setAddEmail(editing.email);
      setAddGstNumber(editing.gstNumber);
      setAddPanNumber(editing.panNumber);
      setAddAddress(editing.address);
      setAddCity(editing.city);
      setAddState(editing.state);
      setAddCountry(editing.country);
      setAddPincode(editing.pincode);
      setAddServiceCategories(editing.serviceCategories);
      setAddAvailability(editing.availability);
      setAddPricingModel(editing.pricingModel);
      setAddEquipment(editing.equipment);
      setAddSkillsDescription(editing.skillsDescription);
      setAddPortalAccessEnabled(editing.portalAccessEnabled || false);
      setAddLoginUsername(editing.loginUsername || "");
      setAddLoginPassword(editing.loginPassword || "");
      setAddCustomFields([]);
      // Payment terms
      setAddPtRate(editing.paymentTerms?.rate?.toString() || "");
      setAddPtCurrency(editing.paymentTerms?.currency || "INR");
      setAddPtBillingCycle(editing.paymentTerms?.billingCycle || "");
      setAddPtPaymentTerms(editing.paymentTerms?.paymentTerms || "");
      setAddPtTaxApplicable(editing.paymentTerms?.taxApplicable || false);
      setAddPtTdsPercentage(editing.paymentTerms?.tdsPercentage?.toString() || "");
      setAddPtNotes(editing.paymentTerms?.notes || "");
    } else {
      resetAddForm();
    }
  }, [editing]);

  const resetAddForm = () => {
    setAddBusinessName("");
    setAddContactPerson("");
    setAddMobile("");
    setAddEmail("");
    setAddGstNumber("");
    setAddPanNumber("");
    setAddAddress("");
    setAddCity("");
    setAddState("");
    setAddCountry("");
    setAddPincode("");
    setAddServiceCategories([]);
    setAddAvailability("");
    setAddPricingModel("");
    setAddEquipment("");
    setAddSkillsDescription("");
    setAddCustomFields([]);
    setAddPortalAccessEnabled(false);
    setAddLoginUsername("");
    setAddLoginPassword("");
    setAddPtRate("");
    setAddPtCurrency("INR");
    setAddPtBillingCycle("");
    setAddPtPaymentTerms("");
    setAddPtTaxApplicable(false);
    setAddPtTdsPercentage("");
    setAddPtNotes("");
  };

  const handleSave = (saveAnother: boolean) => {
    // All fields are optional - just need at least one identifier
    if (!addBusinessName && !addContactPerson && !addMobile) {
      toast.error("Please provide at least Business Name, Contact Person, or Mobile");
      return;
    }
    
    // Generate default values if missing
    const businessName = addBusinessName || "Freelancer";
    const contactPerson = addContactPerson || "Contact Person";
    const mobile = addMobile || `+91 ${String(Math.floor(Math.random() * 10000000000)).padStart(10, "0")}`;
    if (editing) {
      // Update existing freelancer
      const updatedFreelancer: Freelancer = {
        ...editing,
        businessName: addBusinessName || editing.businessName,
        contactPerson: addContactPerson || editing.contactPerson,
        mobile: addMobile || editing.mobile,
        email: addEmail || "",
        gstNumber: addGstNumber || "",
        panNumber: addPanNumber || "",
        address: addAddress || "",
        city: addCity || "",
        state: addState || "",
        country: addCountry || editing.country || "India",
        pincode: addPincode || "",
        serviceCategories: addServiceCategories.length > 0 ? addServiceCategories : editing.serviceCategories,
        availability: addAvailability || editing.availability || "",
        pricingModel: addPricingModel || editing.pricingModel || "",
        equipment: addEquipment || "",
        skillsDescription: addSkillsDescription || "",
        portalAccessEnabled: addPortalAccessEnabled,
        loginUsername: addPortalAccessEnabled ? addLoginUsername : undefined,
        loginPassword: addPortalAccessEnabled ? addLoginPassword : undefined,
        portalUrl: addPortalAccessEnabled ? `https://portal.templeadmin.com/freelancer/${addLoginUsername}` : undefined,
        customFields: addCustomFields.reduce((acc, field) => {
          acc[field.name] = field.value;
          return acc;
        }, {} as Record<string, string>),
        paymentTerms: addPtRate ? {
          rate: Number(addPtRate), currency: addPtCurrency, billingCycle: addPtBillingCycle,
          paymentTerms: addPtPaymentTerms, taxApplicable: addPtTaxApplicable,
          tdsPercentage: Number(addPtTdsPercentage) || 0, notes: addPtNotes
        } : undefined,
      };
      setAllFreelancers(prev => prev.map(f => f.id === editing.id ? updatedFreelancer : f));
      toast.success(`${businessName || addBusinessName || "Freelancer"} updated successfully`);
      if (viewing && viewing.id === editing.id) {
        // Update viewing if it's the same freelancer
        setViewing(updatedFreelancer);
      }
    } else {
      // Create new freelancer
      // Check mobile only if provided
      if (mobile && allFreelancers.some(f => f.mobile === mobile)) {
        toast.error("Mobile number already exists");
        return;
      }
      // Generate ID - handles empty array for first-time onboarding
      const currentMaxId = allFreelancers.length > 0 
        ? Math.max(...allFreelancers.map(f => {
            const num = parseInt(f.id.replace("FRL-", "")) || 0;
            return num;
          }))
        : 0;
      const newId = `FRL-${String(currentMaxId + 1).padStart(4, "0")}`;
      const newFreelancer: Freelancer = {
        id: newId,
        businessName: businessName,
        contactPerson: contactPerson,
        mobile: mobile,
        email: addEmail || "",
        gstNumber: addGstNumber || "",
        panNumber: addPanNumber || "",
        address: addAddress || "",
        city: addCity || "",
        state: addState || "",
        country: addCountry || "India",
        pincode: addPincode || "",
        serviceCategories: addServiceCategories.length > 0 ? addServiceCategories : [],
        skillsDescription: addSkillsDescription || "",
        equipment: addEquipment || "",
        availability: addAvailability || "",
        pricingModel: addPricingModel || "",
        totalAssignments: 0,
        totalPaid: 0,
        rating: 0,
        status: "Active",
        documents: [],
        assignments: [],
        payments: [],
        performance: [],
        portalAccessEnabled: addPortalAccessEnabled,
        loginUsername: addPortalAccessEnabled ? addLoginUsername : undefined,
        loginPassword: addPortalAccessEnabled ? addLoginPassword : undefined,
        portalUrl: addPortalAccessEnabled ? `https://portal.templeadmin.com/freelancer/${addLoginUsername}` : undefined,
        customFields: addCustomFields.reduce((acc, field) => {
          acc[field.name] = field.value;
          return acc;
        }, {} as Record<string, string>),
        paymentTerms: addPtRate ? {
          rate: Number(addPtRate), currency: addPtCurrency, billingCycle: addPtBillingCycle,
          paymentTerms: addPtPaymentTerms, taxApplicable: addPtTaxApplicable,
          tdsPercentage: Number(addPtTdsPercentage) || 0, notes: addPtNotes
        } : undefined,
      };
      setAllFreelancers(prev => [...prev, newFreelancer]);
      toast.success(`${businessName} added successfully`);
    }
    if (!saveAnother) {
      setShowAdd(false);
      setEditing(null);
    }
    resetAddForm();
  };

  const handleExport = () => {
    const data = filtered;
    const csv = ["Freelancer ID,Business Name,Contact Person,Mobile,Email,City,Categories,Total Assignments,Total Paid,Rating,Status", ...data.map(f => `${f.id},"${f.businessName}","${f.contactPerson}",${f.mobile},${f.email},${f.city},"${f.serviceCategories.join(";")}",${f.totalAssignments},${f.totalPaid},${f.rating},${f.status}`)].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `freelancers-${new Date().toISOString().split("T")[0]}.csv`; a.click();
    URL.revokeObjectURL(url);
    setShowExport(false);
    toast.success("Freelancers exported");
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map(s => (
          <Star key={s} className={`h-3.5 w-3.5 ${s <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`} />
        ))}
        <span className="ml-1 text-xs text-muted-foreground">{rating.toFixed(1)}</span>
      </div>
    );
  };

  // Details page view
  if (viewing) {
    const f = viewing;
    const avgRating = f.performance.length > 0 ? (f.performance.reduce((a, p) => a + p.rating, 0) / f.performance.length) : 0;
    const totalPaidCalc = f.payments.filter(p => p.status === "Paid").reduce((a, p) => a + p.amount, 0);

    return (
      <div className="p-6 space-y-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => setViewing(null)}><ArrowLeft className="h-4 w-4" /></Button>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-semibold tracking-tight">{f.businessName}</h1>
                  <Badge variant={f.status === "Active" ? "default" : "secondary"}>{f.status}</Badge>
                </div>
                <p className="text-muted-foreground text-sm">{f.serviceCategories.join(", ")} • {f.mobile}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => { 
                setEditing(f);
                setShowAdd(true);
              }} className="gap-2"><Edit className="h-4 w-4" />Edit</Button>
              <Button variant="outline" onClick={() => {
                setAllFreelancers(prev => prev.map(fr => fr.id === f.id ? { ...fr, status: fr.status === "Active" ? "Inactive" : "Active" } : fr));
                setViewing({ ...f, status: f.status === "Active" ? "Inactive" : "Active" });
                toast.success(`Freelancer marked as ${f.status === "Active" ? "Inactive" : "Active"}`);
              }}>
                {f.status === "Active" ? "Mark Inactive" : "Mark Active"}
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="overview" className="space-y-4">
            <div className="border-b border-border">
              <TabsList className="w-full justify-start border-b-0 rounded-none h-auto p-0 bg-transparent gap-0">
                <TabsTrigger 
                  value="overview" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-amber-700 data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:font-medium px-4 py-2 text-sm text-muted-foreground data-[state=active]:text-foreground"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger 
                  value="assignments" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-amber-700 data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:font-medium px-4 py-2 text-sm text-muted-foreground data-[state=active]:text-foreground"
                >
                  Assignments
                </TabsTrigger>
                <TabsTrigger 
                  value="payments" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-amber-700 data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:font-medium px-4 py-2 text-sm text-muted-foreground data-[state=active]:text-foreground"
                >
                  Payments
                </TabsTrigger>
                <TabsTrigger 
                  value="performance" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-amber-700 data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:font-medium px-4 py-2 text-sm text-muted-foreground data-[state=active]:text-foreground"
                >
                  Performance
                </TabsTrigger>
                <TabsTrigger 
                  value="documents" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-amber-700 data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:font-medium px-4 py-2 text-sm text-muted-foreground data-[state=active]:text-foreground"
                >
                  Documents
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="overview" className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Basic Information</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-8 text-sm">
                  <div><span className="text-muted-foreground">Freelancer ID:</span> <span className="ml-2 font-medium">{f.id}</span></div>
                  <div><span className="text-muted-foreground">Business Name:</span> <span className="ml-2 font-medium">{f.businessName}</span></div>
                  <div><span className="text-muted-foreground">Contact Person:</span> <span className="ml-2 font-medium">{f.contactPerson}</span></div>
                  <div><span className="text-muted-foreground">Mobile:</span> <span className="ml-2 font-medium">{f.mobile}</span></div>
                  <div><span className="text-muted-foreground">Email:</span> <span className="ml-2 font-medium">{f.email || "—"}</span></div>
                  <div><span className="text-muted-foreground">GST Number:</span> <span className="ml-2 font-medium">{f.gstNumber || "—"}</span></div>
                  <div><span className="text-muted-foreground">PAN Number:</span> <span className="ml-2 font-medium">{f.panNumber || "—"}</span></div>
                  <div><span className="text-muted-foreground">Rating:</span> <span className="ml-2">{f.rating === 0 ? <span className="text-muted-foreground text-xs">No ratings yet</span> : renderStars(f.rating)}</span></div>
                </div>
              </div>
              <hr className="border-border" />
              {/* Address */}
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Address</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-8 text-sm">
                  <div><span className="text-muted-foreground">Address:</span> <span className="ml-2 font-medium">{f.address || "—"}</span></div>
                  <div><span className="text-muted-foreground">City:</span> <span className="ml-2 font-medium">{f.city || "—"}</span></div>
                  <div><span className="text-muted-foreground">State:</span> <span className="ml-2 font-medium">{f.state || "—"}</span></div>
                  <div><span className="text-muted-foreground">Country:</span> <span className="ml-2 font-medium">{f.country || "—"}</span></div>
                  <div><span className="text-muted-foreground">Pincode:</span> <span className="ml-2 font-medium">{f.pincode || "—"}</span></div>
                </div>
              </div>
              <hr className="border-border" />
              {/* Service Details */}
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Service Details</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-8 text-sm">
                  <div><span className="text-muted-foreground">Categories:</span> <span className="ml-2 font-medium">{f.serviceCategories.length > 0 ? f.serviceCategories.join(", ") : "—"}</span></div>
                  <div className="col-span-2"><span className="text-muted-foreground">Skills:</span> <span className="ml-2 font-medium">{f.skillsDescription || "—"}</span></div>
                  <div><span className="text-muted-foreground">Equipment:</span> <span className="ml-2 font-medium">{f.equipment || "—"}</span></div>
                  <div><span className="text-muted-foreground">Availability:</span> <span className="ml-2 font-medium">{f.availability || "—"}</span></div>
                  <div><span className="text-muted-foreground">Pricing Model:</span> <span className="ml-2 font-medium">{f.pricingModel || "—"}</span></div>
                </div>
              </div>
              {/* Payment Terms & Pricing */}
              <hr className="border-border" />
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Payment Terms & Pricing</h3>
                {f.paymentTerms ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-8 text-sm">
                    <div><span className="text-muted-foreground">Rate:</span> <span className="ml-2 font-medium">₹{f.paymentTerms.rate.toLocaleString()}</span></div>
                    <div><span className="text-muted-foreground">Currency:</span> <span className="ml-2 font-medium">{f.paymentTerms.currency}</span></div>
                    <div><span className="text-muted-foreground">Billing Cycle:</span> <span className="ml-2 font-medium">{f.paymentTerms.billingCycle || "—"}</span></div>
                    <div><span className="text-muted-foreground">Payment Terms:</span> <span className="ml-2 font-medium">{f.paymentTerms.paymentTerms || "—"}</span></div>
                    <div><span className="text-muted-foreground">Tax Applicable:</span> <span className="ml-2 font-medium">{f.paymentTerms.taxApplicable ? "Yes (GST)" : "No"}</span></div>
                    <div><span className="text-muted-foreground">TDS %:</span> <span className="ml-2 font-medium">{f.paymentTerms.tdsPercentage > 0 ? `${f.paymentTerms.tdsPercentage}%` : "—"}</span></div>
                    {f.paymentTerms.notes && (
                      <div className="col-span-3"><span className="text-muted-foreground">Notes:</span> <span className="ml-2 font-medium">{f.paymentTerms.notes}</span></div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No payment terms configured. Edit freelancer to add pricing details.</p>
                )}
              </div>
              {/* Portal Access & Login Credentials */}
              <hr className="border-border" />
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Portal Access & Login Credentials</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-8 text-sm">
                  <div><span className="text-muted-foreground">Portal Access:</span> <span className="ml-2"><Badge variant={f.portalAccessEnabled ? "default" : "secondary"}>{f.portalAccessEnabled ? "Enabled" : "Disabled"}</Badge></span></div>
                  {f.portalAccessEnabled && (
                    <>
                      <div><span className="text-muted-foreground">Username:</span> <span className="ml-2 font-medium font-mono">{f.loginUsername || "—"}</span></div>
                      <div><span className="text-muted-foreground">Password:</span> <span className="ml-2 font-medium font-mono">{f.loginPassword || "—"}</span></div>
                      {f.portalUrl && (
                        <div className="col-span-3">
                          <span className="text-muted-foreground">Portal URL:</span>
                          <div className="mt-1 flex items-center gap-2">
                            <a href={f.portalUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm font-mono flex items-center gap-1">
                              {f.portalUrl} <ExternalLink className="h-3 w-3" />
                            </a>
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => { navigator.clipboard.writeText(f.portalUrl || ""); toast.success("URL copied"); }}>
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
                {!f.portalAccessEnabled && (
                  <div className="mt-3">
                    <Button variant="outline" size="sm" className="gap-2" onClick={() => {
                      const username = f.businessName.toLowerCase().replace(/\s+/g, '');
                      const password = `TempPass${f.id.slice(-4)}!`;
                      setAllFreelancers(prev => prev.map(fr => fr.id === f.id ? { ...fr, portalAccessEnabled: true, loginUsername: username, loginPassword: password, portalUrl: `https://portal.templeadmin.com/freelancer/${username}` } : fr));
                      setViewing({ ...f, portalAccessEnabled: true, loginUsername: username, loginPassword: password, portalUrl: `https://portal.templeadmin.com/freelancer/${username}` });
                      toast.success("Portal access enabled & credentials generated");
                    }}>
                      <Key className="h-4 w-4" />Enable Portal Access & Generate Credentials
                    </Button>
                  </div>
                )}
                {f.portalAccessEnabled && (
                  <div className="mt-3 flex gap-2">
                    <Button variant="outline" size="sm" className="gap-2" onClick={() => {
                      navigator.clipboard.writeText(`Username: ${f.loginUsername}\nPassword: ${f.loginPassword}\nPortal: ${f.portalUrl}`);
                      toast.success("Credentials copied to clipboard");
                    }}>
                      <Copy className="h-4 w-4" />Copy Credentials
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2" onClick={() => {
                      const newPassword = `TempPass${Math.random().toString(36).slice(-8)}!`;
                      setAllFreelancers(prev => prev.map(fr => fr.id === f.id ? { ...fr, loginPassword: newPassword } : fr));
                      setViewing({ ...f, loginPassword: newPassword });
                      toast.success("Password reset successfully");
                    }}>
                      <RefreshCw className="h-4 w-4" />Reset Password
                    </Button>
                  </div>
                )}
              </div>
              {Object.keys(f.customFields).length > 0 && (
                <>
                  <hr className="border-border" />
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Custom Fields</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-8 text-sm">
                      {Object.entries(f.customFields).map(([k, v]) => (
                        <div key={k}><span className="text-muted-foreground">{k}:</span> <span className="ml-2 font-medium">{v}</span></div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </TabsContent>

            <TabsContent value="assignments">
              {f.assignments.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p className="text-sm mb-2">No assignments yet</p>
                  <p className="text-xs">Assignments will appear here when you create them in the Assignments module</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Assignment ID</TableHead>
                      <TableHead>Event Name</TableHead>
                      <TableHead>Linked Structure</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead className="text-right">Agreed Payment</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {f.assignments.map(a => (
                      <TableRow key={a.id}>
                        <TableCell className="font-medium">{a.id}</TableCell>
                        <TableCell>{a.eventName}</TableCell>
                        <TableCell>{a.linkedStructure}</TableCell>
                        <TableCell>{a.date}</TableCell>
                        <TableCell>{a.duration}</TableCell>
                        <TableCell className="text-right">₹{a.agreedPayment.toLocaleString()}</TableCell>
                        <TableCell><Badge variant={a.status === "Completed" ? "default" : a.status === "Cancelled" ? "destructive" : "secondary"}>{a.status}</Badge></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </TabsContent>

            <TabsContent value="payments" className="space-y-4">
              <p className="text-sm font-medium">Total Paid: <span className="text-lg font-bold">₹{totalPaidCalc.toLocaleString()}</span></p>
              {f.payments.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p className="text-sm mb-2">No payments yet</p>
                  <p className="text-xs">Payments will appear here when assignments are completed and payments are recorded</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Payment ID</TableHead>
                      <TableHead>Event Name</TableHead>
                      <TableHead>Payment Date</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead>Payment Mode</TableHead>
                      <TableHead>Invoice</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {f.payments.map(p => (
                      <TableRow key={p.id}>
                        <TableCell className="font-medium">{p.id}</TableCell>
                        <TableCell>{p.eventName}</TableCell>
                        <TableCell>{p.paymentDate}</TableCell>
                        <TableCell className="text-right">₹{p.amount.toLocaleString()}</TableCell>
                        <TableCell>{p.paymentMode}</TableCell>
                        <TableCell>{p.invoiceFile ? <Button variant="ghost" size="sm" className="gap-1 h-7 text-xs"><FileText className="h-3 w-3" />{p.invoiceFile}</Button> : "—"}</TableCell>
                        <TableCell><Badge variant={p.status === "Paid" ? "default" : "secondary"}>{p.status}</Badge></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </TabsContent>

            <TabsContent value="performance" className="space-y-4">
              <p className="text-sm font-medium">Average Rating: <span className="text-lg font-bold">{avgRating > 0 ? `${avgRating.toFixed(1)} / 5` : "No ratings yet"}</span></p>
              {f.performance.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p className="text-sm mb-2">No performance reviews yet</p>
                  <p className="text-xs">Reviews will appear here after you complete assignments and add performance reviews</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Event Name</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Review Notes</TableHead>
                      <TableHead>Reviewed By</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {f.performance.map((p, i) => (
                      <TableRow key={i}>
                        <TableCell>{p.eventName}</TableCell>
                        <TableCell>{p.date}</TableCell>
                        <TableCell>{renderStars(p.rating)}</TableCell>
                        <TableCell>{p.reviewNotes}</TableCell>
                        <TableCell>{p.reviewedBy}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </TabsContent>

            <TabsContent value="documents">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Uploaded Date</TableHead>
                    <TableHead>Uploaded By</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {f.documents.length === 0 ? (
                    <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">No documents uploaded</TableCell></TableRow>
                  ) : f.documents.map((d, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{d.name}</TableCell>
                      <TableCell>{d.type}</TableCell>
                      <TableCell>{d.uploadedDate}</TableCell>
                      <TableCell>{d.uploadedBy}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => toast.info("View document")}><Eye className="h-3.5 w-3.5" /></Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => toast.info("Replace document")}><Replace className="h-3.5 w-3.5" /></Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => toast.info("Delete document")}><Trash2 className="h-3.5 w-3.5" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">All Freelancers</h1>
            <p className="text-muted-foreground">Manage external service providers and contractors</p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowInvite(true)}
              className="gap-2"
            >
              <HelpCircle className="h-4 w-4" />Invite Freelancer
            </Button>
            <Button variant="outline" onClick={() => setShowExport(true)} className="gap-2"><Download className="h-4 w-4" />Export</Button>
            <Button onClick={() => { 
              setEditing(null);
              resetAddForm();
              setShowAdd(true);
            }} className="gap-2"><Plus className="h-4 w-4" />Add Freelancer</Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search name, mobile, ID..." className="pl-9" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
          </div>
          <Select value={filterCategory} onValueChange={v => { setFilterCategory(v); setPage(1); }}>
            <SelectTrigger className="w-[160px] bg-background"><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent className="bg-popover">
              <SelectItem value="all">All Categories</SelectItem>
              {allCategories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filterCity} onValueChange={v => { setFilterCity(v); setPage(1); }}>
            <SelectTrigger className="w-[130px] bg-background"><SelectValue placeholder="City" /></SelectTrigger>
            <SelectContent className="bg-popover">
              <SelectItem value="all">All Cities</SelectItem>
              {allCities.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
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
          <Badge variant="secondary" className="ml-auto">{filtered.length} freelancers</Badge>
        </div>

        {/* Table */}
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Business Name</TableHead>
                <TableHead>Contact Person</TableHead>
                <TableHead>Mobile</TableHead>
                <TableHead>GST Number</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paged.length === 0 ? (
                <TableRow><TableCell colSpan={8} className="text-center text-muted-foreground py-8">No freelancers found. Click "Add Freelancer" to get started.</TableCell></TableRow>
              ) : paged.map(f => (
                <TableRow key={f.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium text-primary">{f.id}</TableCell>
                  <TableCell className="font-medium">{f.businessName}</TableCell>
                  <TableCell>{f.contactPerson || <span className="text-muted-foreground text-xs">—</span>}</TableCell>
                  <TableCell>{f.mobile || <span className="text-muted-foreground text-xs">—</span>}</TableCell>
                  <TableCell className="font-mono text-xs">{f.gstNumber || <span className="text-muted-foreground">—</span>}</TableCell>
                  <TableCell>{f.city || <span className="text-muted-foreground text-xs">—</span>}</TableCell>
                  <TableCell><Badge variant={f.status === "Active" ? "default" : "secondary"} className="text-[11px]">{f.status}</Badge></TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-7 text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        setViewing(f);
                      }}
                    >
                      View More
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Show</span>
            <Select value={perPage.toString()} onValueChange={v => { setPerPage(Number(v)); setPage(1); }}>
              <SelectTrigger className="w-[70px] h-8 bg-background"><SelectValue /></SelectTrigger>
              <SelectContent className="bg-popover">
                {[10, 25, 50, 100].map(n => <SelectItem key={n} value={n.toString()}>{n}</SelectItem>)}
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">of {filtered.length} records</span>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" className="h-8 w-8" disabled={page === 1} onClick={() => setPage(p => p - 1)}><ChevronLeft className="h-4 w-4" /></Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).slice(Math.max(0, page - 3), page + 2).map(p => (
              <Button key={p} variant={p === page ? "default" : "outline"} size="icon" className="h-8 w-8" onClick={() => setPage(p)}>{p}</Button>
            ))}
            <Button variant="outline" size="icon" className="h-8 w-8" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}><ChevronRight className="h-4 w-4" /></Button>
          </div>
        </div>
      </motion.div>

      {/* Add / Edit Freelancer Modal */}
      <Dialog open={showAdd} onOpenChange={v => { 
        setShowAdd(v); 
        if (!v) {
          setEditing(null);
          resetAddForm();
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader className="sticky top-0 bg-background z-10 pb-4 border-b">
            <DialogTitle>{editing ? "Edit Freelancer" : "Add Freelancer"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {/* Basic Information */}
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Basic Information</p>
              <div className="grid grid-cols-2 gap-3">
                <div><Label className="text-xs">Business Name / Freelancer Name</Label><Input value={addBusinessName} onChange={e => setAddBusinessName(e.target.value)} placeholder="Enter business name (optional)" /></div>
                <div><Label className="text-xs">Contact Person Name</Label><Input value={addContactPerson} onChange={e => setAddContactPerson(e.target.value)} placeholder="Enter contact name (optional)" /></div>
                <div><Label className="text-xs">Mobile</Label><Input value={addMobile} onChange={e => setAddMobile(e.target.value)} placeholder="+91 XXXXX XXXXX (optional)" /></div>
                <div><Label className="text-xs">Email</Label><Input value={addEmail} onChange={e => setAddEmail(e.target.value)} placeholder="email@example.com" /></div>
                <div><Label className="text-xs">GST Number</Label><Input value={addGstNumber} onChange={e => setAddGstNumber(e.target.value)} placeholder="Optional" /></div>
                <div><Label className="text-xs">PAN Number</Label><Input value={addPanNumber} onChange={e => setAddPanNumber(e.target.value)} placeholder="Optional" /></div>
              </div>
            </div>

            {/* Address */}
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Address</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2"><Label className="text-xs">Address Line</Label><Input value={addAddress} onChange={e => setAddAddress(e.target.value)} placeholder="Enter address" /></div>
                <div><Label className="text-xs">City</Label><SelectWithAddNew value={addCity} onValueChange={setAddCity} placeholder="Select city" options={cityOptions} onAddNew={v => setCityOptions(p => [...p, v])} className="bg-background" /></div>
                <div><Label className="text-xs">State</Label><SelectWithAddNew value={addState} onValueChange={setAddState} placeholder="Select state" options={stateOptions} onAddNew={v => setStateOptions(p => [...p, v])} className="bg-background" /></div>
                <div><Label className="text-xs">Country</Label><SelectWithAddNew value={addCountry} onValueChange={setAddCountry} placeholder="Select country" options={countryOptions} onAddNew={v => setCountryOptions(p => [...p, v])} className="bg-background" /></div>
                <div><Label className="text-xs">Pincode</Label><Input value={addPincode} onChange={e => setAddPincode(e.target.value)} placeholder="Enter pincode" /></div>
              </div>
            </div>

            {/* Service Details */}
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Service Details</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <Label className="text-xs">Service Categories</Label>
                  <div className="flex flex-wrap gap-3 mt-1.5">
                    {categoryOptions.map(cat => (
                      <div key={cat} className="flex items-center gap-2">
                        <Checkbox 
                          id={`cat-${cat}`} 
                          checked={addServiceCategories.includes(cat)} 
                          onCheckedChange={checked => {
                            if (checked) setAddServiceCategories([...addServiceCategories, cat]);
                            else setAddServiceCategories(addServiceCategories.filter(c => c !== cat));
                          }} 
                        />
                        <Label htmlFor={`cat-${cat}`} className="text-sm">{cat}</Label>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2">
                    <SelectWithAddNew 
                      value="" 
                      onValueChange={(v) => {
                        if (v && !addServiceCategories.includes(v)) {
                          setAddServiceCategories([...addServiceCategories, v]);
                        }
                      }} 
                      placeholder="Add new category" 
                      options={[]} 
                      onAddNew={v => {
                        setCategoryOptions(p => [...p, v]);
                        if (!addServiceCategories.includes(v)) {
                          setAddServiceCategories([...addServiceCategories, v]);
                        }
                      }} 
                      className="bg-background"
                    />
                  </div>
                </div>
                <div><Label className="text-xs">Availability</Label><SelectWithAddNew value={addAvailability} onValueChange={setAddAvailability} placeholder="Select availability" options={availabilityOptions} onAddNew={v => setAvailabilityOptions(p => [...p, v])} className="bg-background" /></div>
                <div><Label className="text-xs">Pricing Model</Label><SelectWithAddNew value={addPricingModel} onValueChange={setAddPricingModel} placeholder="Select pricing" options={pricingOptions} onAddNew={v => setPricingOptions(p => [...p, v])} className="bg-background" /></div>
                <div><Label className="text-xs">Equipment Provided</Label><Input value={addEquipment} onChange={e => setAddEquipment(e.target.value)} placeholder="Equipment details" /></div>
                <div className="col-span-2"><Label className="text-xs">Skills / Services Description</Label><Textarea value={addSkillsDescription} onChange={e => setAddSkillsDescription(e.target.value)} placeholder="Describe skills and services" rows={2} /></div>
              </div>
            </div>

            {/* Payment Terms & Pricing */}
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Payment Terms & Pricing</p>
              <div className="grid grid-cols-2 gap-3">
                <div><Label className="text-xs">Rate (₹)</Label><Input type="number" value={addPtRate} onChange={e => setAddPtRate(e.target.value)} placeholder="e.g. 45000" /></div>
                <div><Label className="text-xs">Currency</Label>
                  <Select value={addPtCurrency} onValueChange={setAddPtCurrency}>
                    <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-popover">
                      <SelectItem value="INR">INR (₹)</SelectItem>
                      <SelectItem value="USD">USD ($)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div><Label className="text-xs">Billing Cycle</Label>
                  <SelectWithAddNew value={addPtBillingCycle} onValueChange={setAddPtBillingCycle} placeholder="Select billing cycle" options={billingCycleOptions} onAddNew={v => setBillingCycleOptions(p => [...p, v])} className="bg-background" />
                </div>
                <div><Label className="text-xs">Payment Terms</Label>
                  <SelectWithAddNew value={addPtPaymentTerms} onValueChange={setAddPtPaymentTerms} placeholder="Select payment terms" options={paymentTermsOptions} onAddNew={v => setPaymentTermsOptions(p => [...p, v])} className="bg-background" />
                </div>
                <div className="flex items-end gap-3">
                  <div className="flex items-center gap-2 pb-2">
                    <Checkbox id="tax-applicable" checked={addPtTaxApplicable} onCheckedChange={c => setAddPtTaxApplicable(c as boolean)} />
                    <Label htmlFor="tax-applicable" className="text-sm cursor-pointer">GST Applicable</Label>
                  </div>
                </div>
                <div><Label className="text-xs">TDS %</Label><Input type="number" value={addPtTdsPercentage} onChange={e => setAddPtTdsPercentage(e.target.value)} placeholder="e.g. 2" /></div>
                <div className="col-span-2"><Label className="text-xs">Payment Notes</Label><Textarea value={addPtNotes} onChange={e => setAddPtNotes(e.target.value)} placeholder="Any special payment conditions" rows={2} /></div>
              </div>
            </div>

            {/* Document Upload */}
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Documents</p>
              <div className="grid grid-cols-2 gap-3">
                {["ID Proof", "Address Proof", "Agreement Copy", "Bank Details", "Insurance", "Other Supporting Documents"].map(docType => (
                  <div key={docType}>
                    <Label className="text-xs">{docType}</Label>
                    <Input type="file" className="text-xs" accept=".pdf,.jpg,.png" />
                  </div>
                ))}
              </div>
            </div>

            {/* Portal Access & Login Credentials */}
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Portal Access & Login Credentials</p>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Checkbox 
                    id="portal-access" 
                    checked={addPortalAccessEnabled} 
                    onCheckedChange={(checked) => {
                      setAddPortalAccessEnabled(checked as boolean);
                      if (checked) {
                        const username = addBusinessName.toLowerCase().replace(/\s+/g, '') || `freelancer${Date.now()}`;
                        const password = `TempPass${Math.random().toString(36).slice(-6).toUpperCase()}!`;
                        setAddLoginUsername(username);
                        setAddLoginPassword(password);
                      } else {
                        setAddLoginUsername("");
                        setAddLoginPassword("");
                      }
                    }}
                  />
                  <Label htmlFor="portal-access" className="text-sm cursor-pointer">Enable Portal Access (Separate Freelancer Application)</Label>
                </div>
                {addPortalAccessEnabled && (
                  <div className="grid grid-cols-2 gap-3 pl-6 border-l-2 border-primary/20">
                    <div>
                      <Label className="text-xs">Username (Auto-generated)</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Input value={addLoginUsername} onChange={e => setAddLoginUsername(e.target.value)} placeholder="username" className="font-mono" />
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => {
                          const username = addBusinessName.toLowerCase().replace(/\s+/g, '') || `freelancer${Date.now()}`;
                          setAddLoginUsername(username);
                        }}>
                          <RefreshCw className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs">Password (Auto-generated)</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Input type="password" value={addLoginPassword} onChange={e => setAddLoginPassword(e.target.value)} placeholder="password" className="font-mono" />
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => {
                          const password = `TempPass${Math.random().toString(36).slice(-6).toUpperCase()}!`;
                          setAddLoginPassword(password);
                        }}>
                          <RefreshCw className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                    <div className="col-span-2">
                      <div className="text-xs text-muted-foreground bg-muted/30 p-2 rounded border">
                        <Key className="h-3 w-3 inline mr-1" />
                        Portal URL will be: <span className="font-mono">https://portal.templeadmin.com/freelancer/{addLoginUsername || "username"}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Custom Fields */}
            <CustomFieldsSection fields={addCustomFields} onFieldsChange={setAddCustomFields} />
          </div>
          <DialogFooter className="sticky bottom-0 bg-background pt-4 border-t gap-2">
            <Button variant="outline" onClick={() => { 
              setShowAdd(false); 
              setEditing(null);
              resetAddForm();
            }}>Cancel</Button>
            {!editing && (
              <Button variant="outline" onClick={() => handleSave(true)}>Save & Add Another</Button>
            )}
            <Button onClick={() => handleSave(false)}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Export Modal */}
      <Dialog open={showExport} onOpenChange={setShowExport}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Export Freelancers</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label className="text-xs">Export Scope</Label>
              <Select value={exportType} onValueChange={setExportType}>
                <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-popover">
                  <SelectItem value="all">Export All</SelectItem>
                  <SelectItem value="filtered">Export Filtered ({filtered.length} records)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Format</Label>
              <Select value={exportFormat} onValueChange={setExportFormat}>
                <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-popover">
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs mb-2 block">Include Fields</Label>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {["Basic Info", "Service Categories", "Assignment Summary", "Total Paid", "Rating", "Custom Fields"].map(f => (
                  <label key={f} className="flex items-center gap-2"><input type="checkbox" defaultChecked className="rounded" />{f}</label>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowExport(false)}>Cancel</Button>
            <Button onClick={handleExport}>Export</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Invite Freelancer Modal */}
      <Dialog open={showInvite} onOpenChange={setShowInvite}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Invite Freelancer</DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">Send an invitation to a freelancer via SMS/WhatsApp</p>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label className="text-xs">Name *</Label>
              <Input
                placeholder="Enter freelancer name"
                value={inviteName}
                onChange={e => setInviteName(e.target.value)}
              />
            </div>
            <div>
              <Label className="text-xs">Mobile Number *</Label>
              <Input
                type="tel"
                placeholder="+91 98765 43210"
                value={inviteMobile}
                onChange={e => setInviteMobile(e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">Invitation will be sent via SMS/WhatsApp</p>
            </div>
            <div className="bg-muted/30 border rounded-lg p-3 text-xs text-muted-foreground">
              <p className="font-medium mb-1">Invitation Message Preview:</p>
              <p>Hi {inviteName || "[Name]"}, you've been invited to join as a freelancer. Please register using this number: {inviteMobile || "[Mobile]"}</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowInvite(false);
              setInviteName("");
              setInviteMobile("");
            }}>Cancel</Button>
            <Button 
              onClick={() => {
                if (!inviteName.trim() || !inviteMobile.trim()) {
                  toast.error("Please enter both name and mobile number");
                  return;
                }
                // In production, this would send SMS/WhatsApp invitation
                toast.success(`Invitation sent to ${inviteName} (${inviteMobile})`);
                setShowInvite(false);
                setInviteName("");
                setInviteMobile("");
              }}
            >
              Send Invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FreelancersList;
