import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, ArrowRight, Check, Phone, Building2, MapPin,
  FileText, Camera, Globe, UploadCloud, CheckCircle2,
  X, Shield, Pencil
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

/* ─── Types ─── */
type EntityType = "temple" | "trust" | "";
type ManagementType = "self" | "committee" | "registered-trust" | "govt-board" | "";

interface FormData {
  mobile: string;
  otpSent: boolean;
  otpVerified: boolean;
  mpin: string;
  confirmMpin: string;
  entityType: EntityType;
  templeName: string;
  country: string;
  city: string;
  state: string;
  primaryDeity: string;
  managementType: ManagementType;
  trustName: string;
  trustRegNumber: string;
  registeredTrustName: string;
  registeredTrustRegNumber: string;
  registeredTrustRegDate: string;
  contactPerson: string;
  contactDesignation: string;
  email: string;
  aadhaarNumber: string;
  fullAddress: string;
  pincode: string;
  mapLink: string;
  exteriorPhoto: string | null;
  sanctumPhoto: string | null;
  proofType: "photo" | "google-maps" | "committee-letter" | "govt-reference" | "";
  proofValue: string;
  proofFile: string | null;
  trustCertificate: string | null;
  trustDeed: string | null;
  idProof: string | null;
  infoTrue: boolean;
  termsAccepted: boolean;
}

const countryOptions = [
  "India", "United States", "United Kingdom", "Canada", "Australia", "Singapore", "Malaysia", "Nepal", "Sri Lanka",
];

const designationOptions = [
  "Trustee", "Chairman", "Temple Manager", "Administrator", "Executive Officer", "Chief Priest", "Secretary",
];

const initialData: FormData = {
  mobile: "", otpSent: false, otpVerified: false, mpin: "", confirmMpin: "",
  entityType: "", templeName: "", country: "India", city: "", state: "", primaryDeity: "",
  managementType: "", trustName: "", trustRegNumber: "",
  registeredTrustName: "", registeredTrustRegNumber: "", registeredTrustRegDate: "",
  contactPerson: "", contactDesignation: "", email: "", aadhaarNumber: "",
  fullAddress: "", pincode: "", mapLink: "",
  exteriorPhoto: null, sanctumPhoto: null, proofType: "", proofValue: "", proofFile: null,
  trustCertificate: null, trustDeed: null, idProof: null,
  infoTrue: false, termsAccepted: false,
};

const tabs = [
  { id: 1, label: "Mobile", icon: Phone },
  { id: 2, label: "Entity Info", icon: Building2 },
  { id: 3, label: "Contact", icon: MapPin },
  { id: 4, label: "Documents", icon: Camera },
  { id: 5, label: "Review", icon: CheckCircle2 },
];

const stateOptions = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
];

/* ─── Main Component ─── */
const TempleRegister = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<FormData>(initialData);
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);

  const update = (patch: Partial<FormData>) => setData(prev => ({ ...prev, ...patch }));

  const handleSubmit = () => {
    setSaving(true);
    // Save registration data to localStorage for auto-fill after approval
    const registrationData = {
      templeName: data.templeName,
      city: data.city,
      state: data.state,
      country: data.country,
      primaryDeity: data.primaryDeity,
      managementType: data.managementType,
      trustName: data.trustName || data.registeredTrustName,
      trustRegNumber: data.trustRegNumber || data.registeredTrustRegNumber,
      contactPerson: data.contactPerson,
      contactDesignation: data.contactDesignation,
      email: data.email,
      aadhaarNumber: data.aadhaarNumber,
      mobile: data.mobile,
      fullAddress: data.fullAddress,
      pincode: data.pincode,
      mapLink: data.mapLink,
      entityType: data.entityType,
    };
    localStorage.setItem('registrationData', JSON.stringify(registrationData));
    setTimeout(() => {
      setSaving(false);
      setSubmitted(true);
      toast.success("Application submitted for admin review!");
    }, 800);
  };

  const referenceNumber = `REG-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 999999)).padStart(6, '0')}`;

  /* ─── Submitted Screen ─── */
  if (submitted) {
    const entityName = data.entityType === "temple" ? data.templeName : data.registeredTrustName;
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full">
          <div className="bg-card border border-border rounded-2xl p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-xl font-bold text-foreground mb-1">Application Submitted!</h1>
            <p className="text-sm text-muted-foreground mb-6">We'll notify you via SMS and email once approved.</p>

            <div className="bg-muted/40 rounded-xl p-4 mb-5 text-left space-y-3">
              <div>
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">Reference</p>
                <p className="text-lg font-mono font-bold text-foreground mt-0.5">{referenceNumber}</p>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">Entity</p>
                  <p className="text-sm font-semibold mt-0.5">{entityName || "N/A"}</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">Status</p>
                  <Badge className="bg-accent/10 text-accent border-accent/20 hover:bg-accent/10 text-xs mt-0.5">Under Review</Badge>
                </div>
              </div>
            </div>

            <div className="bg-muted/30 rounded-xl p-4 mb-6 text-left">
              <h3 className="font-semibold text-foreground mb-2 text-sm">What happens next?</h3>
              <div className="space-y-2">
                {["Our team reviews your documents", "We may request additional verification", "Upon approval, you'll receive login credentials", "Average review time: 2–3 business days"].map((text, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">{i + 1}</span>
                    <p className="text-sm text-muted-foreground">{text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 h-10" onClick={() => navigate("/application-status")}>Track Status</Button>
              <Button className="flex-1 h-10 gap-2" onClick={() => navigate("/")}><ArrowLeft className="h-4 w-4" /> Home</Button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <button onClick={() => navigate("/")} className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors text-sm">
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          <h1 className="text-sm font-semibold text-foreground">Registration</h1>
          <div className="w-14" />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
        {/* ─── Tab Bar ─── */}
        <div className="flex items-center border-b border-border mb-6 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const isActive = step === tab.id;
            const isCompleted = step > tab.id;
            const isClickable = tab.id <= step;
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                onClick={() => { if (isClickable) setStep(tab.id); }}
                disabled={!isClickable}
                className={`relative flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors shrink-0 ${
                  isActive
                    ? "text-primary"
                    : isCompleted
                      ? "text-foreground hover:text-primary cursor-pointer"
                      : "text-muted-foreground/50 cursor-not-allowed"
                }`}
              >
                {isCompleted ? (
                  <span className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                    <Check className="h-3 w-3 text-primary-foreground" />
                  </span>
                ) : (
                  <Icon className="h-4 w-4" />
                )}
                <span className="hidden sm:inline">{tab.label}</span>
                {/* Active underline */}
                {isActive && (
                  <motion.div
                    layoutId="tab-underline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* ─── Progress bar ─── */}
        <div className="h-1 w-full bg-muted rounded-full mb-6 overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            animate={{ width: `${(step / 5) * 100}%` }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        </div>

        {/* ─── Tab Content ─── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {step === 1 && <Tab1Mobile data={data} update={update} />}
            {step === 2 && <Tab2EntityInfo data={data} update={update} />}
            {step === 3 && <Tab3Contact data={data} update={update} />}
            {step === 4 && <Tab4PhotosProof data={data} update={update} />}
            {step === 5 && <Tab5Review data={data} update={update} setStep={setStep} />}
          </motion.div>
        </AnimatePresence>

        {/* ─── Navigation ─── */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
          <Button
            variant="ghost"
            onClick={() => setStep(s => s - 1)}
            disabled={step === 1}
            className="gap-1.5 h-10"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>

          <span className="text-xs text-muted-foreground font-medium">{step} / 5</span>

          {step === 5 ? (
            <Button
              onClick={handleSubmit}
              disabled={saving || !data.infoTrue || !data.termsAccepted}
              className="gap-1.5 h-10 px-6"
            >
              {saving ? "Submitting..." : "Submit"} <Check className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={() => setStep(s => s + 1)}
              disabled={step === 1 && !data.otpVerified}
              className="gap-1.5 h-10 px-6"
            >
              Continue <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </main>
    </div>
  );
};

/* ═══════════════════════════ TAB 1 — Mobile Verification ═══════════════════════════ */

const Tab1Mobile = ({ data, update }: { data: FormData; update: (p: Partial<FormData>) => void }) => {
  const [otp, setOtp] = useState("");

  return (
    <section className="space-y-6">
      <SectionHeader title="Mobile Verification" subtitle="Verify your phone number to create your account" />

      <div className="space-y-4">
        <FieldGroup label="Mobile Number *">
          <div className="flex">
            <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-input bg-muted text-muted-foreground text-sm font-medium">+91</span>
            <Input
              placeholder="98765 43210"
              className="rounded-l-none h-10"
              value={data.mobile}
              onChange={e => update({ mobile: e.target.value })}
              disabled={data.otpVerified}
            />
          </div>
        </FieldGroup>

        {!data.otpVerified && !data.otpSent && (
          <Button onClick={() => update({ otpSent: true })} disabled={data.mobile.length < 10} className="w-full h-10">
            Send OTP
          </Button>
        )}

        {data.otpSent && !data.otpVerified && (
          <div className="space-y-3 p-4 rounded-lg bg-muted/40 border border-border">
            <FieldGroup label="Enter 6-digit OTP">
              <div className="flex gap-2">
                <Input placeholder="••••••" className="text-center tracking-[0.3em] font-mono h-10" maxLength={6} value={otp} onChange={e => setOtp(e.target.value)} />
                <Button onClick={() => { if (otp.length === 6) update({ otpVerified: true }); }} disabled={otp.length < 6} className="h-10 px-5 shrink-0">Verify</Button>
              </div>
            </FieldGroup>
            <p className="text-xs text-muted-foreground">
              Didn't receive? <button className="text-primary font-medium hover:underline" onClick={() => update({ otpSent: true })}>Resend</button>
            </p>
          </div>
        )}

        {data.otpVerified && (
          <div className="flex items-center gap-2.5 px-4 py-3 bg-primary/5 border border-primary/20 rounded-lg">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            <span className="text-sm text-foreground font-medium">Mobile verified successfully</span>
          </div>
        )}
      </div>

      {/* Set MPIN */}
      {data.otpVerified && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 pt-2">
          <Separator />
          <SectionHeader title="Set MPIN" subtitle="Create a 4-digit MPIN for quick login" />
          <div className="grid grid-cols-2 gap-4">
            <FieldGroup label="MPIN *">
              <Input
                type="password"
                placeholder="••••"
                className="h-10 text-center tracking-[0.4em] font-mono"
                maxLength={4}
                value={data.mpin}
                onChange={e => { const v = e.target.value.replace(/\D/g, ''); update({ mpin: v }); }}
              />
            </FieldGroup>
            <FieldGroup label="Confirm MPIN *">
              <Input
                type="password"
                placeholder="••••"
                className="h-10 text-center tracking-[0.4em] font-mono"
                maxLength={4}
                value={data.confirmMpin}
                onChange={e => { const v = e.target.value.replace(/\D/g, ''); update({ confirmMpin: v }); }}
              />
            </FieldGroup>
          </div>
          {data.mpin.length === 4 && data.confirmMpin.length === 4 && data.mpin !== data.confirmMpin && (
            <p className="text-xs text-destructive font-medium">MPINs do not match</p>
          )}
          {data.mpin.length === 4 && data.confirmMpin.length === 4 && data.mpin === data.confirmMpin && (
            <div className="flex items-center gap-2 text-xs text-primary font-medium">
              <CheckCircle2 className="h-3.5 w-3.5" /> MPIN set successfully
            </div>
          )}
        </motion.div>
      )}

      <InfoBox icon={Phone} text="This mobile number will be your primary login ID." />
    </section>
  );
};

/* ═══════════════════════════ TAB 2 — Entity Information ═══════════════════════════ */

const Tab2EntityInfo = ({ data, update }: { data: FormData; update: (p: Partial<FormData>) => void }) => (
  <section className="space-y-6">
    <SectionHeader title="Entity Information" subtitle="Tell us what you're registering" />

    {/* Entity type selection */}
    <div className="space-y-2">
      <Label className="text-sm font-medium">What are you registering? *</Label>
      <RadioGroup value={data.entityType} onValueChange={(v: EntityType) => update({ entityType: v })} className="grid grid-cols-2 gap-3">
        <label className={`flex items-center gap-3 p-3.5 border rounded-lg cursor-pointer transition-all ${data.entityType === "temple" ? "border-primary bg-primary/5 ring-1 ring-primary/20" : "border-border hover:border-muted-foreground/30"}`}>
          <RadioGroupItem value="temple" />
          <Building2 className={`h-4 w-4 shrink-0 ${data.entityType === "temple" ? "text-primary" : "text-muted-foreground"}`} />
          <div>
            <p className="text-sm font-medium">Temple</p>
          </div>
        </label>
        <label className={`flex items-center gap-3 p-3.5 border rounded-lg cursor-pointer transition-all ${data.entityType === "trust" ? "border-primary bg-primary/5 ring-1 ring-primary/20" : "border-border hover:border-muted-foreground/30"}`}>
          <RadioGroupItem value="trust" />
          <FileText className={`h-4 w-4 shrink-0 ${data.entityType === "trust" ? "text-primary" : "text-muted-foreground"}`} />
          <div>
            <p className="text-sm font-medium">Trust / Institution</p>
          </div>
        </label>
      </RadioGroup>
    </div>

    {/* Temple Fields */}
    {data.entityType === "temple" && (
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 pt-2">
        <FieldGroup label="Temple Name *">
          <Input value={data.templeName} onChange={e => update({ templeName: e.target.value })} placeholder="e.g., Sri Venkateswara Temple" className="h-10" />
        </FieldGroup>
        <div className="grid grid-cols-2 gap-4">
          <FieldGroup label="City *">
            <Input value={data.city} onChange={e => update({ city: e.target.value })} placeholder="e.g., Tirupati" className="h-10" />
          </FieldGroup>
          <FieldGroup label="State *">
            <Select value={data.state} onValueChange={v => update({ state: v })}>
              <SelectTrigger className="h-10"><SelectValue placeholder="Select State" /></SelectTrigger>
              <SelectContent>
                {stateOptions.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </FieldGroup>
        </div>
        <FieldGroup label="Primary Deity (optional)">
          <Input value={data.primaryDeity} onChange={e => update({ primaryDeity: e.target.value })} placeholder="e.g., Lord Venkateswara" className="h-10" />
        </FieldGroup>
        <FieldGroup label="Who manages this temple? *">
          <Select value={data.managementType} onValueChange={(v: ManagementType) => update({ managementType: v })}>
            <SelectTrigger className="h-10"><SelectValue placeholder="Select management type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="self">Self / Family</SelectItem>
              <SelectItem value="committee">Committee</SelectItem>
              <SelectItem value="registered-trust">Registered Trust</SelectItem>
              <SelectItem value="govt-board">Government Board</SelectItem>
            </SelectContent>
          </Select>
        </FieldGroup>

        {data.managementType === "registered-trust" && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 p-4 border border-dashed border-primary/30 rounded-lg bg-primary/5">
            <p className="text-xs font-semibold text-primary uppercase tracking-wider">Trust Details (optional)</p>
            <div className="grid grid-cols-2 gap-4">
              <FieldGroup label="Trust Name">
                <Input value={data.trustName} onChange={e => update({ trustName: e.target.value })} placeholder="Trust name" className="h-10" />
              </FieldGroup>
              <FieldGroup label="Registration Number">
                <Input value={data.trustRegNumber} onChange={e => update({ trustRegNumber: e.target.value })} placeholder="Reg. number" className="h-10" />
              </FieldGroup>
            </div>
          </motion.div>
        )}
      </motion.div>
    )}

    {/* Trust Fields */}
    {data.entityType === "trust" && (
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 pt-2">
        <FieldGroup label="Registered Trust Name *">
          <Input value={data.registeredTrustName} onChange={e => update({ registeredTrustName: e.target.value })} placeholder="e.g., Sri Venkateswara Temple Trust" className="h-10" />
        </FieldGroup>
        <div className="grid grid-cols-2 gap-4">
          <FieldGroup label="Registration Number *">
            <Input value={data.registeredTrustRegNumber} onChange={e => update({ registeredTrustRegNumber: e.target.value })} placeholder="e.g., TRN/2020/12345" className="h-10" />
          </FieldGroup>
          <FieldGroup label="Registration Date *">
            <Input type="date" value={data.registeredTrustRegDate} onChange={e => update({ registeredTrustRegDate: e.target.value })} className="h-10" />
          </FieldGroup>
        </div>
      </motion.div>
    )}
  </section>
);

/* ═══════════════════════════ TAB 3 — Contact & Location ═══════════════════════════ */

const Tab3Contact = ({ data, update }: { data: FormData; update: (p: Partial<FormData>) => void }) => (
  <section className="space-y-6">
    <SectionHeader title="Admin & Location" subtitle="Authorized person details and temple address" />

    {/* Admin Details */}
    <div className="grid grid-cols-2 gap-4">
      <FieldGroup label="Contact Person Name *">
        <Input value={data.contactPerson} onChange={e => update({ contactPerson: e.target.value })} placeholder="Full name" className="h-10" />
      </FieldGroup>
      <FieldGroup label="Designation *">
        <Select value={data.contactDesignation} onValueChange={v => update({ contactDesignation: v })}>
          <SelectTrigger className="h-10"><SelectValue placeholder="Select Designation" /></SelectTrigger>
          <SelectContent>
            {designationOptions.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
          </SelectContent>
        </Select>
      </FieldGroup>
    </div>
    <div className="grid grid-cols-2 gap-4">
      <FieldGroup label="Email *">
        <Input type="email" value={data.email} onChange={e => update({ email: e.target.value })} placeholder="admin@temple.org" className="h-10" />
      </FieldGroup>
      <FieldGroup label="Aadhaar Number *">
        <Input
          value={data.aadhaarNumber}
          onChange={e => { const v = e.target.value.replace(/\D/g, ''); update({ aadhaarNumber: v }); }}
          placeholder="XXXX XXXX XXXX"
          className="h-10 tracking-wider"
          maxLength={12}
        />
      </FieldGroup>
    </div>

    <Separator />

    {/* Location */}
    <div className="grid grid-cols-2 gap-4">
      <FieldGroup label="Country *">
        <Select value={data.country} onValueChange={v => update({ country: v })}>
          <SelectTrigger className="h-10"><SelectValue placeholder="Select Country" /></SelectTrigger>
          <SelectContent>
            {countryOptions.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </FieldGroup>
      <FieldGroup label="State *">
        <Select value={data.state} onValueChange={v => update({ state: v })}>
          <SelectTrigger className="h-10"><SelectValue placeholder="Select State" /></SelectTrigger>
          <SelectContent>
            {stateOptions.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </FieldGroup>
    </div>
    <div className="grid grid-cols-2 gap-4">
      <FieldGroup label="City / Town *">
        <Input value={data.city} onChange={e => update({ city: e.target.value })} placeholder="e.g., Tirupati" className="h-10" />
      </FieldGroup>
      <FieldGroup label="Pincode *">
        <Input value={data.pincode} onChange={e => update({ pincode: e.target.value })} placeholder="e.g., 517501" className="h-10" />
      </FieldGroup>
    </div>
    <FieldGroup label="Full Address *">
      <Textarea value={data.fullAddress} onChange={e => update({ fullAddress: e.target.value })} placeholder="Street, area, locality with landmarks" rows={2} />
    </FieldGroup>
    <FieldGroup label="Google Map Link (optional)">
      <Input value={data.mapLink} onChange={e => update({ mapLink: e.target.value })} placeholder="https://maps.google.com/..." className="h-10" />
    </FieldGroup>
  </section>
);

/* ═══════════════════════════ TAB 4 — Photos & Proof ═══════════════════════════ */

const Tab4PhotosProof = ({ data, update }: { data: FormData; update: (p: Partial<FormData>) => void }) => {
  if (data.entityType === "trust") {
    return (
      <section className="space-y-6">
        <SectionHeader title="Documents" subtitle="Upload trust documents for verification" />
        <div className="space-y-4">
          <DocUpload label="Trust Certificate *" file={data.trustCertificate} mockName="trust_certificate.pdf" onUpload={() => update({ trustCertificate: "trust_certificate.pdf" })} onRemove={() => update({ trustCertificate: null })} />
          <DocUpload label="Trust Deed *" file={data.trustDeed} mockName="trust_deed.pdf" onUpload={() => update({ trustDeed: "trust_deed.pdf" })} onRemove={() => update({ trustDeed: null })} />
          <DocUpload label="ID Proof of Authorized Person *" file={data.idProof} mockName="id_proof.pdf" onUpload={() => update({ idProof: "id_proof.pdf" })} onRemove={() => update({ idProof: null })} />
        </div>
      </section>
    );
  }

  const proofOptions = [
    { value: "photo" as const, label: "Photo", icon: Camera },
    { value: "google-maps" as const, label: "Google Maps", icon: Globe },
    { value: "committee-letter" as const, label: "Committee Letter", icon: FileText },
    { value: "govt-reference" as const, label: "Govt Reference", icon: Shield },
  ];

  return (
    <section className="space-y-6">
      <SectionHeader title="Photos & Proof" subtitle="Upload temple photos and one proof document" />

      {/* Photo uploads */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Temple Photos *</Label>
        <div className="grid grid-cols-2 gap-4">
          <PhotoUpload label="Exterior Photo" file={data.exteriorPhoto} onUpload={() => update({ exteriorPhoto: "temple_exterior.jpg" })} onRemove={() => update({ exteriorPhoto: null })} />
          <PhotoUpload label="Sanctum Photo" file={data.sanctumPhoto} onUpload={() => update({ sanctumPhoto: "sanctum_photo.jpg" })} onRemove={() => update({ sanctumPhoto: null })} />
        </div>
      </div>

      <Separator />

      {/* Proof selection */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">One Proof Required *</Label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {proofOptions.map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => update({ proofType: opt.value, proofValue: "", proofFile: null })}
              className={`flex flex-col items-center gap-1.5 p-3 border rounded-lg text-center transition-all ${
                data.proofType === opt.value ? "border-primary bg-primary/5 ring-1 ring-primary/20" : "border-border hover:border-muted-foreground/30"
              }`}
            >
              <opt.icon className={`h-4 w-4 ${data.proofType === opt.value ? "text-primary" : "text-muted-foreground"}`} />
              <span className="text-xs font-medium">{opt.label}</span>
            </button>
          ))}
        </div>

        {data.proofType && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="pt-1">
            {data.proofType === "google-maps" ? (
              <FieldGroup label="Google Maps URL">
                <Input value={data.proofValue} onChange={e => update({ proofValue: e.target.value })} placeholder="https://maps.google.com/..." className="h-10" />
              </FieldGroup>
            ) : (
              <DocUpload
                label={`Upload ${data.proofType === "photo" ? "Photo" : data.proofType === "committee-letter" ? "Committee Letter" : "Govt Reference"}`}
                file={data.proofFile}
                mockName={`${data.proofType}_proof.pdf`}
                onUpload={() => update({ proofFile: `${data.proofType}_proof.pdf` })}
                onRemove={() => update({ proofFile: null })}
              />
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
};

/* ═══════════════════════════ TAB 5 — Review & Submit ═══════════════════════════ */

const Tab5Review = ({ data, update, setStep }: { data: FormData; update: (p: Partial<FormData>) => void; setStep: (s: number) => void }) => {
  const isTemple = data.entityType === "temple";

  return (
    <section className="space-y-5">
      <SectionHeader title="Review & Submit" subtitle="Confirm your details before submitting" />

      <ReviewSection title="Mobile & MPIN" onEdit={() => setStep(1)}>
        <ReviewRow label="Mobile" value={`+91 ${data.mobile}`} />
        <ReviewRow label="Verified" value={data.otpVerified ? "✓ Yes" : "✗ No"} />
        <ReviewRow label="MPIN" value={data.mpin.length === 4 ? "✓ Set" : "Not set"} />
      </ReviewSection>

      <ReviewSection title="Entity Information" onEdit={() => setStep(2)}>
        <ReviewRow label="Type" value={isTemple ? "Temple" : "Trust / Institution"} />
        {isTemple ? (
          <>
            <ReviewRow label="Temple Name" value={data.templeName} />
            <ReviewRow label="City" value={data.city} />
            <ReviewRow label="State" value={data.state} />
            <ReviewRow label="Primary Deity" value={data.primaryDeity || "—"} />
            <ReviewRow label="Management" value={data.managementType || "—"} />
            {data.managementType === "registered-trust" && (
              <>
                <ReviewRow label="Trust Name" value={data.trustName || "—"} />
                <ReviewRow label="Trust Reg#" value={data.trustRegNumber || "—"} />
              </>
            )}
          </>
        ) : (
          <>
            <ReviewRow label="Trust Name" value={data.registeredTrustName} />
            <ReviewRow label="Reg. Number" value={data.registeredTrustRegNumber} />
            <ReviewRow label="Reg. Date" value={data.registeredTrustRegDate} />
          </>
        )}
      </ReviewSection>

      <ReviewSection title="Admin & Location" onEdit={() => setStep(3)}>
        <ReviewRow label="Contact" value={data.contactPerson} />
        <ReviewRow label="Designation" value={data.contactDesignation} />
        <ReviewRow label="Email" value={data.email} />
        <ReviewRow label="Aadhaar" value={data.aadhaarNumber ? `XXXX XXXX ${data.aadhaarNumber.slice(-4)}` : "—"} />
        <ReviewRow label="Country" value={data.country} />
        <ReviewRow label="State" value={data.state} />
        <ReviewRow label="City" value={data.city} />
        <ReviewRow label="Address" value={data.fullAddress} />
        <ReviewRow label="Pincode" value={data.pincode} />
      </ReviewSection>

      <ReviewSection title="Documents" onEdit={() => setStep(4)}>
        {isTemple ? (
          <>
            <ReviewRow label="Exterior Photo" value={data.exteriorPhoto ? "✓ Uploaded" : "—"} />
            <ReviewRow label="Sanctum Photo" value={data.sanctumPhoto ? "✓ Uploaded" : "—"} />
            <ReviewRow label="Proof" value={data.proofFile ? "✓ Uploaded" : data.proofValue ? "✓ Provided" : "—"} />
          </>
        ) : (
          <>
            <ReviewRow label="Trust Certificate" value={data.trustCertificate ? "✓ Uploaded" : "—"} />
            <ReviewRow label="Trust Deed" value={data.trustDeed ? "✓ Uploaded" : "—"} />
            <ReviewRow label="ID Proof" value={data.idProof ? "✓ Uploaded" : "—"} />
          </>
        )}
      </ReviewSection>

      <Separator />

      <div className="space-y-3">
        <label className="flex items-start gap-3 cursor-pointer">
          <Checkbox checked={data.infoTrue} onCheckedChange={c => update({ infoTrue: Boolean(c) })} className="mt-0.5" />
          <span className="text-sm text-foreground leading-relaxed">I confirm that all information is true and accurate.</span>
        </label>
        <label className="flex items-start gap-3 cursor-pointer">
          <Checkbox checked={data.termsAccepted} onCheckedChange={c => update({ termsAccepted: Boolean(c) })} className="mt-0.5" />
          <span className="text-sm text-foreground leading-relaxed">
            I agree to the <span className="underline text-primary font-medium">Terms of Service</span> and <span className="underline text-primary font-medium">Privacy Policy</span>.
          </span>
        </label>
      </div>
    </section>
  );
};

/* ═══════════════════════════ Shared Helpers ═══════════════════════════ */

const SectionHeader = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <div className="mb-1">
    <h2 className="text-lg font-semibold text-foreground">{title}</h2>
    <p className="text-sm text-muted-foreground">{subtitle}</p>
  </div>
);

const FieldGroup = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="space-y-1.5">
    <Label className="text-sm font-medium">{label}</Label>
    {children}
  </div>
);

const InfoBox = ({ icon: Icon, text }: { icon: React.ElementType; text: string }) => (
  <div className="flex items-start gap-2.5 p-3 rounded-lg bg-muted/40 border border-border">
    <Icon className="h-4 w-4 text-primary mt-0.5 shrink-0" />
    <p className="text-sm text-muted-foreground">{text}</p>
  </div>
);

const PhotoUpload = ({ label, file, onUpload, onRemove }: { label: string; file: string | null; onUpload: () => void; onRemove: () => void }) => (
  <div>
    {!file ? (
      <div onClick={onUpload} className="border border-dashed border-border rounded-lg p-5 text-center hover:border-primary/40 transition-all cursor-pointer group">
        <Camera className="h-5 w-5 text-muted-foreground mx-auto mb-1.5 group-hover:text-primary transition-colors" />
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className="text-[10px] text-muted-foreground mt-0.5">JPG, PNG (max 5MB)</p>
      </div>
    ) : (
      <div className="flex items-center gap-2.5 p-2.5 bg-primary/5 rounded-lg border border-primary/20">
        <Camera className="h-4 w-4 text-primary shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium truncate">{file}</p>
          <p className="text-[10px] text-muted-foreground">{label}</p>
        </div>
        <button onClick={onRemove} className="p-1 hover:bg-muted rounded transition-colors"><X className="h-3.5 w-3.5 text-muted-foreground" /></button>
      </div>
    )}
  </div>
);

const DocUpload = ({ label, file, mockName, onUpload, onRemove }: { label: string; file: string | null; mockName: string; onUpload: () => void; onRemove: () => void }) => (
  <div>
    <p className="text-sm font-medium text-foreground mb-1.5">{label}</p>
    {!file ? (
      <div onClick={onUpload} className="border border-dashed border-border rounded-lg p-4 text-center hover:border-primary/40 transition-all cursor-pointer group">
        <UploadCloud className="h-5 w-5 text-muted-foreground mx-auto mb-1 group-hover:text-primary transition-colors" />
        <p className="text-xs text-muted-foreground">Click to upload • PDF, JPG, PNG</p>
      </div>
    ) : (
      <div className="flex items-center gap-2.5 p-2.5 bg-primary/5 rounded-lg border border-primary/20">
        <FileText className="h-4 w-4 text-primary shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{file}</p>
          <p className="text-[10px] text-muted-foreground">Uploaded</p>
        </div>
        <button onClick={onRemove} className="p-1 hover:bg-muted rounded transition-colors"><X className="h-3.5 w-3.5 text-muted-foreground" /></button>
      </div>
    )}
  </div>
);

const ReviewSection = ({ title, onEdit, children }: { title: string; onEdit?: () => void; children: React.ReactNode }) => (
  <div className="border border-border rounded-lg overflow-hidden">
    <div className="flex items-center justify-between px-4 py-2.5 bg-muted/30 border-b border-border">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</p>
      {onEdit && (
        <button onClick={onEdit} className="flex items-center gap-1 text-xs text-primary font-medium hover:underline">
          <Pencil className="h-3 w-3" /> Edit
        </button>
      )}
    </div>
    <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 p-4">{children}</div>
  </div>
);

const ReviewRow = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</p>
    <p className="text-sm text-foreground font-medium mt-0.5">{value || "—"}</p>
  </div>
);

export default TempleRegister;
