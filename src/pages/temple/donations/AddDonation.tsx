import { useMemo, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Check, Receipt, MessageCircle, Save, ArrowLeft, ArrowRight, Search, UserPlus, User, Award } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { recordDonation, getReceipt80GForDonation } from "@/modules/donations/donationsStore";
import { useDonationConfig, useDonors } from "@/modules/donations/hooks";
import { downloadReceiptPdf } from "@/lib/pdfDocs";
import { download80GReceiptPdf } from "@/lib/eightyGReceipt";
import { projects } from "@/data/projectData";
import { getEvents } from "@/modules/events/eventStore";
import TempleQRPanel from "@/components/TempleQRPanel";

type PaymentMode = "Cash" | "Online" | "Bank Transfer" | "Cheque";
type OnlineSubMode = "" | "UPI Link" | "QR";
type DonationNature = "Cash" | "Non-Cash";
type Purpose = "Counter" | "Project" | "Event" | "Other";

const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
const MOBILE_REGEX = /^[6-9]\d{9}$/;
const NC_CATEGORIES = ["Metal/Gold/Silver","Grain/Food","Cloth/Fabric","Jewellery","Electronics","Furniture","Other"];
const NC_UNITS = ["pcs","kg","g","bags","sets","litres","metres","units"];

// ── Horizontal step indicator ──────────────────────────────────────────────
const StepBar = ({ steps, current }: { steps: string[]; current: number }) => (
  <div className="flex items-center w-full mb-8">
    {steps.map((label, i) => {
      const done = i < current;
      const active = i === current;
      return (
        <div key={i} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center gap-1">
            <div className={`h-9 w-9 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-all
              ${done ? "bg-emerald-500 border-emerald-500 text-white" : active ? "bg-primary border-primary text-primary-foreground" : "bg-background border-border text-muted-foreground"}`}>
              {done ? <Check className="h-4 w-4" /> : i + 1}
            </div>
            <span className={`text-[10px] font-medium whitespace-nowrap ${active ? "text-primary" : done ? "text-emerald-600" : "text-muted-foreground"}`}>
              {label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className={`flex-1 h-0.5 mx-2 mb-4 transition-colors ${done ? "bg-emerald-400" : "bg-border"}`} />
          )}
        </div>
      );
    })}
  </div>
);

const FieldError = ({ t }: { t: string }) => <p className="text-[11px] text-destructive mt-1">{t}</p>;
const FieldInfo  = ({ t }: { t: string }) => <p className="text-[11px] text-muted-foreground mt-1">{t}</p>;

interface Props { embedded?: boolean; initialNature?: DonationNature; onSaved?: () => void; onClose?: () => void; }

const AddDonation = ({ embedded = false, initialNature, onSaved, onClose }: Props = {}) => {
  const navigate = useNavigate();
  const location  = useLocation();
  const { toast } = useToast();
  const donationConfig = useDonationConfig();

  const nature: DonationNature = (location.state as any)?.nature ?? initialNature ?? "Cash";
  const isCash = nature === "Cash";

  const [step, setStep] = useState(0);

  // Donor search
  const allDonors = useDonors();
  const [donorSearch, setDonorSearch] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [donorSelected, setDonorSelected] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const donorSuggestions = useMemo(() => {
    const q = donorSearch.trim().toLowerCase();
    if (!q || q.length < 2) return [];
    return allDonors
      .filter(d =>
        d.name.toLowerCase().includes(q) ||
        d.phone.replace(/\D/g, "").includes(q)
      )
      .slice(0, 8);
  }, [allDonors, donorSearch]);

  const selectDonor = (d: typeof allDonors[0]) => {
    setDonorName(d.name);
    setDonorSearch(d.name);
    setMobile(d.phone.replace(/\D/g, "").slice(-10));
    setEmail(d.email !== "-" ? d.email : "");
    setAddress(d.city !== "-" ? d.city : "");
    if (d.pan && d.pan !== "-") setPan(d.pan.toUpperCase());
    setDonorSelected(true);
    setShowSuggestions(false);
  };

  const clearDonorSelection = () => {
    setDonorName(""); setDonorSearch(""); setMobile("");
    setEmail(""); setAddress(""); setPan("");
    setDonorSelected(false);
  };

  // ── Fields ──
  const [ncCategory, setNcCategory] = useState("");
  const [ncName, setNcName]         = useState("");
  const [ncQty, setNcQty]           = useState("");
  const [ncUnit, setNcUnit]         = useState("pcs");
  const [ncValue, setNcValue]       = useState("");

  const [amount, setAmount]         = useState("");
  const [wants80G, setWants80G]     = useState<""|"Yes"|"No">("");
  const [pan, setPan]               = useState("");

  const [donorName, setDonorName]   = useState("");
  const [mobile, setMobile]         = useState("");
  const [email, setEmail]           = useState("");
  const [address, setAddress]       = useState("");

  // Combined purpose value: "Counter" | "OTHER" | "PRJ:id" | "EVT:id"
  const [purposeKey, setPurposeKey] = useState("");

  const decodePurpose = (key: string) => {
    if (!key || key === "Counter") return { type: "Counter" as Purpose, projectId: "", eventId: "" };
    if (key === "Other") return { type: "Other" as Purpose, projectId: "", eventId: "" };
    if (key.startsWith("PRJ:")) return { type: "Project" as Purpose, projectId: key.slice(4), eventId: "" };
    if (key.startsWith("EVT:")) return { type: "Event" as Purpose, projectId: "", eventId: key.slice(4) };
    return { type: "Counter" as Purpose, projectId: "", eventId: "" };
  };

  const decoded = decodePurpose(purposeKey);
  const [remarks, setRemarks] = useState("");

  const [paymentMode, setPaymentMode] = useState<""|PaymentMode>("");
  const [onlineSubMode, setOnlineSubMode] = useState<OnlineSubMode>("");
  const [counterNo, setCounterNo]   = useState("");
  const [collectedBy, setCollectedBy] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [paymentLinkSent, setPaymentLinkSent] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<"Pending Payment"|"Paid">("Pending Payment");
  const [chequeNo, setChequeNo]     = useState("");
  const [bankName, setBankName]     = useState("");
  const [utrNumber, setUtrNumber]   = useState("");
  const [savedIds, setSavedIds]     = useState<{donationId:string;receiptNo:string;receipt80GId?:string}|null>(null);

  // ── Derived ──
  const amt = parseFloat(isCash ? amount : ncValue) || 0;
  const suggests80G = amt >= donationConfig.eightyGThreshold;
  const effective80G = wants80G === "" ? (suggests80G ? "Yes" : "") : wants80G;
  const is80GSelected = effective80G === "Yes";
  const panRequired  = false;
  const panValid     = !pan.trim() || PAN_REGEX.test(pan.toUpperCase());
  const panFormatValid = PAN_REGEX.test(pan.toUpperCase());
  const nameValid    = donorName.trim().length >= 3 && donorName.trim().length <= 100;
  const mobileValid  = MOBILE_REGEX.test(mobile.trim());
  const addressValid = !panRequired || (address.trim().length >= 10 && address.trim().length <= 500);

  const activeProjects = projects.filter(p => p.status === "Active");
  const allEvents = useMemo(() => { try { return getEvents(); } catch { return []; } }, []);


  // ── Step definitions ──
  // Cash:     Step 0 = Amount, 80G & Purpose | Step 1 = Donor Info | Step 2 = Payment | Step 3 = Review
  // Non-cash: Step 0 = Material | Step 1 = 80G, PAN & Purpose | Step 2 = Donor Info | Step 3 = Review
  const cashSteps   = ["Amount & Purpose", "Donor Info", "Payment", "Review"];
  const ncashSteps  = ["Material", "80G & Purpose", "Donor Info", "Review"];
  const stepLabels  = isCash ? cashSteps : ncashSteps;

  // ── Step validity ──
  const minOk = amt >= donationConfig.minDonationAmount;
  const ncMaterialOk = ncCategory !== "" && ncName.trim().length >= 2 && parseFloat(ncQty) > 0 && minOk;
  const purposeOk    = purposeKey !== "" && (decoded.type !== "Other" || remarks.trim().length > 0);
  const amtOk        = isCash
    ? (minOk && (effective80G !== "") && panValid && (!panRequired || pan.trim().length === 10) && purposeOk)
    : (ncMaterialOk && (effective80G !== "") && panValid && (!panRequired || pan.trim().length === 10) && purposeOk);
  const donorOk      = nameValid && mobileValid && addressValid;
  const paymentOk    = paymentMode !== "" &&
    (paymentMode !== "Cash"   || (counterNo.trim() !== "" && collectedBy.trim() !== "")) &&
    (paymentMode !== "Online" || (onlineSubMode !== "" && paymentStatus === "Paid")) &&
    (paymentMode !== "Bank Transfer" || utrNumber.trim() !== "") &&
    (paymentMode !== "Cheque" || (chequeNo.trim() !== "" && bankName.trim() !== ""));

  const stepOk = isCash
    ? [amtOk, donorOk, paymentOk, true]
    : [ncMaterialOk, amtOk, donorOk, true];

  const canNext = stepOk[step];

  const purposeLabel = useMemo(() => {
    if (decoded.type === "Project") return activeProjects.find(p => p.id === decoded.projectId)?.title ?? "Project";
    if (decoded.type === "Event")   return allEvents.find(e => e.id === decoded.eventId)?.name ?? "Event";
    if (decoded.type === "Other")   return remarks.slice(0, 60);
    return "Counter Donation";
  }, [purposeKey, remarks]);

  const generateLink = () => {
    if (!MOBILE_REGEX.test(whatsappNumber.trim())) {
      toast({ title: "Invalid number", variant: "destructive" }); return;
    }
    setPaymentLinkSent(true); setPaymentStatus("Pending Payment");
    toast({ title: "Payment link sent", description: `Sent to +91 ${whatsappNumber}` });
  };

  const saveDonation = () => {
    const channelMap: Record<string, string> = {
      Cash: "Cash", Online: "UPI", "Bank Transfer": "Bank Transfer", Cheque: "Cheque",
    };
    const referenceNo = paymentMode === "Cheque" ? chequeNo
      : paymentMode === "Bank Transfer" ? utrNumber.trim()
      : paymentMode === "Online" && onlineSubMode === "QR" && utrNumber.trim() ? utrNumber.trim()
      : paymentMode === "Online" && onlineSubMode === "UPI Link" ? `WA:${whatsappNumber}`
      : undefined;

    const donation = recordDonation({
      donorName: donorName.trim(), phone: mobile.trim(),
      email: email.trim() || undefined, city: address.trim() || undefined,
      pan: panFormatValid ? pan.toUpperCase().trim() : undefined,
      wants80G: effective80G === "Yes",
      nature, amount: amt, purpose: purposeLabel || "General",
      channel: isCash ? (channelMap[paymentMode] as any) : "In-Kind",
      mode: isCash ? (paymentMode === "Online"
              ? (onlineSubMode === "QR" ? "QR Code" : "UPI")
              : paymentMode === "Bank Transfer" ? "Bank Transfer"
              : paymentMode) : "In-Kind",
      referenceNo,
      nonCashDetails: !isCash ? { assetName:ncName.trim(), quantity:parseFloat(ncQty), unit:ncUnit, estimatedValue:amt, category:ncCategory } : undefined,
      sourceModule: decoded.type==="Counter"?"Counter" : decoded.type==="Event"?"Event":"Manual",
      sourceRecordId: decoded.projectId || decoded.eventId || undefined,
      counterId: paymentMode==="Cash" ? counterNo.trim() : undefined,
      createdBy: collectedBy.trim() || "System",
    });
    const receipt80G = getReceipt80GForDonation(donation.donationId);
    setSavedIds({
      donationId: donation.donationId,
      receiptNo: donation.receiptNo,
      receipt80GId: receipt80G?.receipt80GId ?? donation.receipt80GId,
    });
    toast({
      title: "Donation saved ✓",
      description: receipt80G
        ? `Receipt ${donation.receiptNo} · 80G ${receipt80G.receipt80GId} generated`
        : `Receipt ${donation.receiptNo} generated.`,
    });
    onSaved?.();
  };

  const handleDownloadReceipt = () => {
    if (!savedIds) return;
    downloadReceiptPdf({
      receiptNo: savedIds.receiptNo,
      date: new Date().toISOString().slice(0, 10),
      donorName: donorName.trim(),
      donorPan: panFormatValid ? pan.toUpperCase().trim() : undefined,
      donorAddress: address.trim() || undefined,
      amount: amt,
      mode: isCash ? (paymentMode === "Online"
              ? (onlineSubMode === "QR" ? "QR Code" : "UPI")
              : paymentMode) : "In-Kind",
      donationType: purposeLabel.toLowerCase().includes("corpus") ? "Corpus" : "General",
      is80G: is80GSelected,
    });
    toast({ title: "Receipt downloaded", description: `${savedIds.receiptNo}.pdf` });
  };

  const handleDownload80G = () => {
    if (!savedIds?.receipt80GId) return;
    const receipt80G = getReceipt80GForDonation(savedIds.donationId);
    if (!receipt80G) {
      toast({ title: "Not found", description: "80G receipt not generated", variant: "destructive" });
      return;
    }
    download80GReceiptPdf(receipt80G, address.trim() || undefined);
    toast({ title: "80G receipt downloaded", description: "Ready for Income Tax portal submission" });
  };

  // ── Step content renderers ──
  const renderStep = () => {
    // Non-cash step 0 = Material
    if (!isCash && step === 0) return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label>Material Category *</Label>
          <Select value={ncCategory} onValueChange={setNcCategory}>
            <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
            <SelectContent>{NC_CATEGORIES.map(c=><SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Material Name *</Label>
          <Input placeholder="e.g. Gold Chain, Rice Bags" value={ncName} onChange={e=>setNcName(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Quantity *</Label>
          <Input type="number" placeholder="0" value={ncQty} onChange={e=>setNcQty(e.target.value)} min={0} />
        </div>
        <div className="space-y-2">
          <Label>Unit</Label>
          <Select value={ncUnit} onValueChange={setNcUnit}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{NC_UNITS.map(u=><SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>Estimated Value (₹) *</Label>
          <Input type="number" placeholder="0" value={ncValue} onChange={e=>setNcValue(e.target.value)} />
          {amt >= 2000 && <FieldInfo t="Value ≥ ₹2,000 — 80G recommended, PAN will be required if 80G selected." />}
        </div>
      </div>
    );

    // Cash step 0 OR Non-cash step 1 = Amount / 80G / Purpose combined
    const is80GStep = (isCash && step===0) || (!isCash && step===1);
    if (is80GStep) return (
      <div className="space-y-6">
        {/* Amount + 80G + PAN row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {isCash && (
            <div className="space-y-2">
              <Label>Donation Amount (₹) *</Label>
              <Input type="number" placeholder="0" value={amount} onChange={e=>setAmount(e.target.value)} />
              {suggests80G && <p className="text-[11px] text-amber-600">Amount ≥ ₹{donationConfig.eightyGThreshold.toLocaleString("en-IN")} — 80G recommended.</p>}
              {!minOk && amt > 0 && <FieldError t={`Minimum donation amount is ₹${donationConfig.minDonationAmount.toLocaleString("en-IN")}.`} />}
            </div>
          )}
          <div className="space-y-2">
            <Label>80G Tax Exemption *</Label>
            <Select value={effective80G} onValueChange={v=>setWants80G(v as "Yes"|"No")}>
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Yes">Yes — I want 80G</SelectItem>
                <SelectItem value="No">No — Skip 80G</SelectItem>
              </SelectContent>
            </Select>
            {suggests80G && effective80G === "Yes" && <FieldInfo t={`Auto-suggested (amount ≥ ₹${donationConfig.eightyGThreshold.toLocaleString("en-IN")}). You can change this.`} />}
          </div>
          <div className="space-y-2">
            <Label>PAN Number {panRequired && <span className="text-destructive">*</span>}</Label>
            <Input placeholder="ABCDE1234F" maxLength={10} value={pan} onChange={e=>setPan(e.target.value.toUpperCase())} />
            {panRequired && pan.trim().length === 0
              ? <FieldError t="PAN is required." />
              : (pan.trim().length > 0 && !panValid ? <FieldError t="Invalid PAN. Format: AAAAA9999A" /> : <FieldInfo t="Format: AAAAA9999A" />)}
          </div>
        </div>

        {/* Donation Purpose — inline in step 1 */}
        <div className="border-t pt-5 space-y-4">
          <div className="space-y-2">
            <Label>Donation Purpose *</Label>
            <Select value={purposeKey} onValueChange={v => { setPurposeKey(v); setRemarks(""); }}>
              <SelectTrigger><SelectValue placeholder="Select purpose" /></SelectTrigger>
              <SelectContent>
                {donationConfig.purposeCategories.general && (
                  <SelectGroup>
                    <SelectLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-2 py-1">General</SelectLabel>
                    <SelectItem value="Counter">Counter Donation</SelectItem>
                  </SelectGroup>
                )}
                {donationConfig.purposeCategories.events && allEvents.length > 0 && (
                  <SelectGroup>
                    <SelectLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-2 py-1">Events</SelectLabel>
                    {allEvents.map(e => (
                      <SelectItem key={e.id} value={`EVT:${e.id}`}>{e.name}</SelectItem>
                    ))}
                  </SelectGroup>
                )}
                {donationConfig.purposeCategories.project && activeProjects.length > 0 && (
                  <SelectGroup>
                    <SelectLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-2 py-1">Projects</SelectLabel>
                    {activeProjects.map(p => (
                      <SelectItem key={p.id} value={`PRJ:${p.id}`}>{p.title}</SelectItem>
                    ))}
                  </SelectGroup>
                )}
                {donationConfig.purposeCategories.others && (
                  <SelectGroup>
                    <SelectLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-2 py-1">Others</SelectLabel>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectGroup>
                )}
              </SelectContent>
            </Select>
          </div>
          {decoded.type === "Other" && (
            <div className="space-y-2">
              <Label>
                Other Purpose Details <span className="text-destructive">*</span>
              </Label>
              <Textarea
                placeholder="What should this donation be used for? (required)"
                value={remarks}
                onChange={e => setRemarks(e.target.value)}
                rows={2}
              />
            </div>
          )}
        </div>
      </div>
    );

    // Donor Info step
    const donorStep = isCash ? 1 : 2;
    if (step === donorStep) return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Search-or-Add donor */}
        <div className="space-y-2 md:col-span-2">
          <Label>Donor Name *</Label>
          <div className="relative" ref={searchRef}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                className="pl-9 pr-20"
                placeholder="Search by name or mobile, or type a new name…"
                value={donorSearch}
                onChange={e => {
                  setDonorSearch(e.target.value);
                  setDonorName(e.target.value);
                  setDonorSelected(false);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 180)}
                maxLength={100}
              />
              {donorSelected && (
                <Badge className="absolute right-3 top-1/2 -translate-y-1/2 bg-emerald-100 text-emerald-700 text-xs">
                  <User className="h-3 w-3 mr-1" />Existing
                </Badge>
              )}
            </div>
            {/* Suggestions dropdown */}
            {showSuggestions && donorSuggestions.length > 0 && (
              <div className="absolute z-50 top-full mt-1 w-full bg-popover border rounded-xl shadow-lg overflow-hidden">
                {donorSuggestions.map(d => (
                  <button
                    key={d.donorId}
                    type="button"
                    onMouseDown={() => selectDonor(d)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/60 text-left transition-colors border-b last:border-b-0"
                  >
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-xs font-semibold text-primary">{d.name.charAt(0).toUpperCase()}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{d.name}</p>
                      <p className="text-xs text-muted-foreground">{d.phone} {d.pan && d.pan !== "-" ? `· PAN: ${d.pan}` : ""}</p>
                    </div>
                    {d.eligible80G && <Badge className="bg-green-100 text-green-700 text-xs shrink-0">80G</Badge>}
                  </button>
                ))}
                <button
                  type="button"
                  onMouseDown={() => { setDonorSelected(false); setShowSuggestions(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/60 text-left text-sm text-primary font-medium"
                >
                  <UserPlus className="h-4 w-4" />
                  Add "{donorSearch}" as new donor
                </button>
              </div>
            )}
            {showSuggestions && donorSearch.trim().length >= 2 && donorSuggestions.length === 0 && (
              <div className="absolute z-50 top-full mt-1 w-full bg-popover border rounded-xl shadow-lg">
                <div className="flex items-center gap-3 px-4 py-3 text-sm">
                  <UserPlus className="h-4 w-4 text-primary" />
                  <span>No existing donor found — <strong>"{donorSearch}"</strong> will be added as a new donor.</span>
                </div>
              </div>
            )}
          </div>
          {donorName && !nameValid && <FieldError t="Name must be 3–100 characters." />}
          {donorSelected && <p className="text-[11px] text-emerald-600">✓ Existing donor selected — details auto-filled below.</p>}
        </div>
        <div className="space-y-2">
          <Label>Mobile Number *</Label>
          <Input placeholder="10-digit mobile" maxLength={10} value={mobile} onChange={e=>setMobile(e.target.value.replace(/\D/g,""))} />
          {mobile && !mobileValid && <FieldError t="Enter a valid 10-digit Indian mobile." />}
        </div>
        <div className="space-y-2">
          <Label>Email <span className="text-xs text-muted-foreground">(optional)</span></Label>
          <Input type="email" placeholder="donor@example.com" value={email} onChange={e=>setEmail(e.target.value)} />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>Address {panRequired && <span className="text-destructive">*</span>}</Label>
          <Textarea placeholder={panRequired?"Min 10 chars — required for PAN":"Optional"} value={address} onChange={e=>setAddress(e.target.value.slice(0,500))} rows={2} />
          <div className="flex justify-between">
            {panRequired && address.length>0 && address.trim().length<10 && <FieldError t="Min 10 characters for PAN details." />}
            <span className="text-[10px] text-muted-foreground ml-auto">{address.length}/500</span>
          </div>
        </div>
      </div>
    );

    // Payment step (cash only)
    const payStep = 2;
    if (isCash && step===payStep) return (
      <div className="space-y-4">
        {/* Mode selector */}
        <div className="space-y-2">
          <Label>Payment Mode *</Label>
          <Select value={paymentMode} onValueChange={v => { setPaymentMode(v as PaymentMode); setOnlineSubMode(""); setPaymentStatus("Pending Payment"); }}>
            <SelectTrigger><SelectValue placeholder="Select payment mode" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Cash">Cash</SelectItem>
              <SelectItem value="Online">Online Transfer [net banking/upi/qr]</SelectItem>
              <SelectItem value="Bank Transfer">Bank Transfer / NEFT (with UTR)</SelectItem>
              <SelectItem value="Cheque">Cheque</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Cash */}
        {paymentMode === "Cash" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Counter No *</Label><Input value={counterNo} onChange={e => setCounterNo(e.target.value)} placeholder="e.g. CTR-01" /></div>
            <div className="space-y-2"><Label>Collected By *</Label><Input value={collectedBy} onChange={e => setCollectedBy(e.target.value)} placeholder="Staff name" /></div>
          </div>
        )}

        {/* Online — choose sub-mode */}
        {paymentMode === "Online" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Online Payment Method *</Label>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant={onlineSubMode === "UPI Link" ? "default" : "outline"}
                  onClick={() => { setOnlineSubMode("UPI Link"); setPaymentStatus("Pending Payment"); }}
                  className="h-auto py-3 flex flex-col items-start"
                >
                  <span className="text-sm font-semibold">Generate Mobile UPI Link</span>
                  <span className="text-[11px] opacity-80">Send payment link via WhatsApp</span>
                </Button>
                <Button
                  type="button"
                  variant={onlineSubMode === "QR" ? "default" : "outline"}
                  onClick={() => { setOnlineSubMode("QR"); setPaymentStatus("Pending Payment"); }}
                  className="h-auto py-3 flex flex-col items-start"
                >
                  <span className="text-sm font-semibold">Generate QR</span>
                  <span className="text-[11px] opacity-80">Scan with any UPI app</span>
                </Button>
              </div>
            </div>

            {onlineSubMode === "QR" && (
              <TempleQRPanel
                amount={amt}
                mode="QR Code"
                paymentStatus={paymentStatus}
                onConfirmPaid={() => setPaymentStatus("Paid")}
                referenceNo={utrNumber}
                onReferenceNoChange={setUtrNumber}
              />
            )}

            {onlineSubMode === "UPI Link" && (
              <div className="rounded-xl border bg-muted/10 p-4 space-y-3">
                <Label className="text-xs">Donor's WhatsApp Number *</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="10-digit mobile"
                    maxLength={10}
                    value={whatsappNumber}
                    onChange={e => setWhatsappNumber(e.target.value.replace(/\D/g, ""))}
                  />
                  <Button type="button" onClick={generateLink} disabled={!MOBILE_REGEX.test(whatsappNumber)}>
                    {paymentLinkSent ? "Resend Link" : "Send Link"}
                  </Button>
                </div>
                {paymentLinkSent && (
                  <p className="text-[11px] text-emerald-600">✓ UPI payment link sent to +91 {whatsappNumber}</p>
                )}
                <div className="pt-2 border-t">
                  {paymentStatus !== "Paid" ? (
                    <Button className="w-full" variant="outline" disabled={!paymentLinkSent} onClick={() => setPaymentStatus("Paid")}>
                      Confirm Payment Received
                    </Button>
                  ) : (
                    <p className="text-center text-sm font-semibold text-emerald-600">Payment Confirmed</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Bank Transfer — only UTR / bank ref */}
        {paymentMode === "Bank Transfer" && (
          <div className="rounded-xl border bg-muted/10 p-4 space-y-2">
            <Label className="text-xs">UTR / Bank Reference No *</Label>
            <Input
              value={utrNumber}
              onChange={e => setUtrNumber(e.target.value)}
              placeholder="e.g. 412345678901"
              className="font-mono text-sm"
            />
            <p className="text-[11px] text-muted-foreground">
              Enter the UTR / bank reference number for reconciliation.
            </p>
          </div>
        )}

        {paymentMode === "Cheque" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Cheque No *</Label><Input value={chequeNo} onChange={e => setChequeNo(e.target.value)} /></div>
            <div className="space-y-2"><Label>Bank Name *</Label><Input value={bankName} onChange={e => setBankName(e.target.value)} /></div>
          </div>
        )}
      </div>
    );

    // Review & Save (last step)
    return (
      <div className="space-y-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            {label:"Donation ID",   val: savedIds?.donationId || "— auto on save —", mono:true},
            {label:"Receipt No",    val: savedIds?.receiptNo  || "— auto on save —", mono:true},
            {label:"Amount",        val: `₹${amt.toLocaleString("en-IN")}`, mono:false},
            {label:"80G",           val: "", mono:false, badge:true},
          ].map(({label,val,mono,badge})=>(
            <div key={label} className="p-4 rounded-xl bg-muted/40 border space-y-1">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
              {badge
                ? (is80GSelected ? <Badge className="bg-green-100 text-green-700 text-xs">Eligible</Badge> : <Badge variant="outline" className="text-xs">Not Applied</Badge>)
                : <p className={`text-sm font-semibold ${mono?"font-mono":""}`}>{val}</p>}
            </div>
          ))}
        </div>
        {/* Summary table */}
        <div className="rounded-xl border divide-y text-sm">
          {[
            ["Donor", donorName],
            ["Mobile", mobile],
            ["Purpose", purposeLabel],
            isCash ? ["Payment Mode", paymentMode] : ["Material", `${ncQty} ${ncUnit} ${ncName} (${ncCategory})`],
            panFormatValid ? ["PAN", pan.toUpperCase()] : null,
          ].filter(Boolean).map(([k,v])=>(
            <div key={k} className="flex px-4 py-2.5 gap-4">
              <span className="w-32 text-muted-foreground shrink-0">{k}</span>
              <span className="font-medium">{v}</span>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-3 pt-2">
          <Button onClick={saveDonation} disabled={!!savedIds} size="lg">
            <Save className="h-4 w-4 mr-2"/>Save Donation
          </Button>
          <Button variant="outline" disabled={!savedIds} onClick={handleDownloadReceipt}>
            <Receipt className="h-4 w-4 mr-2"/>Download Receipt
          </Button>
          {is80GSelected && (
            <Button variant="outline" disabled={!savedIds?.receipt80GId} onClick={handleDownload80G}>
              <Award className="h-4 w-4 mr-2"/>Download 80G
            </Button>
          )}
          <Button variant="outline" disabled={!savedIds} onClick={()=>toast({title:"Sent via WhatsApp",description:`Receipt sent to +91 ${mobile}`})}>
            <MessageCircle className="h-4 w-4 mr-2"/>Send via WhatsApp
          </Button>
          {savedIds && (
            <Button variant="ghost" className="ml-auto" onClick={onClose ?? (() => navigate("/temple/donations"))}>Done</Button>
          )}
        </div>
      </div>
    );
  };

  const totalSteps = stepLabels.length;

  return (
    <div className="space-y-0">
      {/* Page header */}
      {!embedded && (
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="icon" onClick={()=>navigate("/temple/donations")}>
            <ArrowLeft className="h-4 w-4"/>
          </Button>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">{isCash?"Cash Donation":"Non-Cash Donation"}</h1>
            <Badge className={isCash?"bg-emerald-100 text-emerald-700":"bg-blue-100 text-blue-700"}>
              {isCash?"Cash":"In-Kind"}
            </Badge>
          </div>
        </div>
      )}

      {/* Horizontal step bar */}
      <div className="bg-card rounded-2xl border shadow-sm p-6 mb-5">
        <StepBar steps={stepLabels} current={step} />

        {/* Step content */}
        <div className="min-h-[220px]">
          {renderStep()}
        </div>

        {/* Navigation */}
        {!savedIds && (
          <div className="flex items-center justify-between mt-8 pt-5 border-t">
            <Button variant="outline" disabled={step===0} onClick={()=>setStep(s=>s-1)}>
              <ArrowLeft className="h-4 w-4 mr-2"/>Back
            </Button>
            <span className="text-sm text-muted-foreground">Step {step+1} of {totalSteps}</span>
            {step < totalSteps-1 ? (
              <Button disabled={!canNext} onClick={()=>setStep(s=>s+1)}>
                Next<ArrowRight className="h-4 w-4 ml-2"/>
              </Button>
            ) : (
              <Button onClick={saveDonation} disabled={!!savedIds}>
                <Save className="h-4 w-4 mr-2"/>Save Donation
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddDonation;
