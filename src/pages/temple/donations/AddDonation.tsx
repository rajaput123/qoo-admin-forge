import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Check, Receipt, MessageCircle, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { recordDonation } from "@/modules/donations/donationsStore";

type Purpose = "Counter" | "Project" | "Event" | "Other";
type PaymentMode = "Cash" | "UPI" | "Cheque" | "NEFT";
type DonationNature = "Cash" | "Non-Cash";

const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
const MOBILE_REGEX = /^[6-9]\d{9}$/;

const projectOptions = [
  { value: "project-1", label: "Temple Renovation" },
  { value: "project-2", label: "New Hall Construction" },
  { value: "project-3", label: "Annadanam Fund" },
];
const eventOptions = [
  { value: "event-1", label: "Maha Shivaratri 2025" },
  { value: "event-2", label: "Karthika Deepam" },
  { value: "event-3", label: "Brahmotsavam" },
];

const StepHeader = ({ n, title, done }: { n: number; title: string; done: boolean }) => (
  <div className="flex items-center gap-3 mb-4">
    <div
      className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
        done ? "bg-emerald-500 text-white" : "bg-primary text-primary-foreground"
      }`}
    >
      {done ? <Check className="h-4 w-4" /> : n}
    </div>
    <h3 className="text-base font-semibold">{title}</h3>
  </div>
);

const AddDonation = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Step 1
  const [amount, setAmount] = useState("");
  const [wants80G, setWants80G] = useState<"" | "Yes" | "No">("");
  const [pan, setPan] = useState("");
  const [nature, setNature] = useState<DonationNature>("Cash");
  const [nonCashItem, setNonCashItem] = useState("");

  // Step 2
  const [donorName, setDonorName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  // Step 3
  const [purpose, setPurpose] = useState<"" | Purpose>("");
  const [projectId, setProjectId] = useState("");
  const [eventId, setEventId] = useState("");
  const [remarks, setRemarks] = useState("");

  // Step 4
  const [paymentMode, setPaymentMode] = useState<"" | PaymentMode>("");
  const [counterNo, setCounterNo] = useState("");
  const [collectedBy, setCollectedBy] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [paymentLinkSent, setPaymentLinkSent] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<"Pending Payment" | "Paid">("Pending Payment");
  const [chequeNo, setChequeNo] = useState("");
  const [bankName, setBankName] = useState("");
  const [utrNumber, setUtrNumber] = useState("");

  // Step 5
  const [savedIds, setSavedIds] = useState<{ donationId: string; receiptNo: string } | null>(null);

  const amt = parseFloat(amount) || 0;
  const requires80G = amt >= 2000;
  const effectiveWants80G = requires80G ? "Yes" : wants80G;
  const panRequired = effectiveWants80G === "Yes";
  const panValid = !panRequired || PAN_REGEX.test(pan.toUpperCase());

  // Address: strip double quotes, max 400 chars (per project rule)
  const onAddressChange = (v: string) => setAddress(v.replace(/"/g, "").slice(0, 400));

  // Step 1 valid?
  const step1Valid =
    amt > 0 &&
    (requires80G || wants80G !== "") &&
    panValid &&
    (!panRequired || pan.trim().length === 10) &&
    (nature === "Cash" || nonCashItem.trim().length >= 3);

  // Step 2 valid?
  const nameValid = donorName.trim().length >= 3 && donorName.trim().length <= 100;
  const mobileValid = MOBILE_REGEX.test(mobile.trim());
  const addressValid = address.trim().length === 0 || (address.trim().length >= 10 && address.trim().length <= 400);
  const step2Valid = step1Valid && nameValid && mobileValid && addressValid;

  // Step 3 valid?
  const step3Valid =
    step2Valid &&
    purpose !== "" &&
    (purpose !== "Project" || !!projectId) &&
    (purpose !== "Event" || !!eventId) &&
    (purpose !== "Other" || remarks.trim().length > 0);

  // Step 4 valid?
  const step4Valid =
    step3Valid &&
    paymentMode !== "" &&
    (paymentMode !== "Cash" || (counterNo.trim() !== "" && collectedBy.trim() !== "")) &&
    (paymentMode !== "UPI" || (MOBILE_REGEX.test(whatsappNumber.trim()) && paymentStatus === "Paid")) &&
    (paymentMode !== "Cheque" || (chequeNo.trim() !== "" && bankName.trim() !== "")) &&
    (paymentMode !== "NEFT" || (utrNumber.trim() !== "" && bankName.trim() !== ""));

  const showStep2 = step1Valid;
  const showStep3 = step2Valid;
  const showStep4 = step3Valid;
  const showStep5 = step4Valid;

  const purposeLabel = useMemo(() => {
    if (purpose === "Project") return projectOptions.find(p => p.value === projectId)?.label;
    if (purpose === "Event") return eventOptions.find(e => e.value === eventId)?.label;
    if (purpose === "Other") return remarks.slice(0, 60);
    return "Counter Donation";
  }, [purpose, projectId, eventId, remarks]);

  const generatePaymentLink = () => {
    if (!MOBILE_REGEX.test(whatsappNumber.trim())) {
      toast({ title: "Invalid WhatsApp number", description: "Enter a 10-digit mobile number", variant: "destructive" });
      return;
    }
    setPaymentLinkSent(true);
    setPaymentStatus("Pending Payment");
    toast({
      title: "Payment link sent",
      description: `WhatsApp link sent to +91 ${whatsappNumber}. Mark as Paid once confirmed.`,
    });
  };

  const saveDonation = () => {
    if (!step4Valid) {
      toast({ title: "Incomplete", description: "Please complete all required fields.", variant: "destructive" });
      return;
    }

    const channelMap: Record<PaymentMode, "Cash" | "UPI" | "Cheque" | "Bank Transfer"> = {
      Cash: "Cash",
      UPI: "UPI",
      Cheque: "Cheque",
      NEFT: "Bank Transfer",
    };

    const referenceNo =
      paymentMode === "Cheque" ? chequeNo
      : paymentMode === "NEFT" ? utrNumber
      : paymentMode === "UPI" ? `WA:${whatsappNumber}`
      : undefined;

    const sourceModule =
      purpose === "Counter" ? "Counter"
      : purpose === "Event" ? "Event"
      : "Manual";

    const donation = recordDonation({
      donorName: donorName.trim(),
      phone: mobile.trim(),
      email: email.trim() || undefined,
      city: address.trim() || undefined,
      pan: panRequired ? pan.toUpperCase().trim() : undefined,
      nature,
      amount: amt,
      purpose: nature === "Non-Cash"
        ? `${purposeLabel || "General"} (Non-cash: ${nonCashItem.trim()})`
        : (purposeLabel || "General"),
      channel: channelMap[paymentMode as PaymentMode],
      mode: paymentMode,
      referenceNo,
      remarks: remarks.trim() || undefined,
      sourceModule: sourceModule as any,
      sourceRecordId: projectId || eventId || undefined,
      counterId: paymentMode === "Cash" ? counterNo.trim() : undefined,
      createdBy: collectedBy.trim() || "System",
    });

    setSavedIds({ donationId: donation.donationId, receiptNo: donation.receiptNo });
    toast({ title: "Donation saved", description: `Receipt ${donation.receiptNo} generated.` });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/temple/donations/list")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Add Donation</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Complete each step — the next section opens automatically when valid.
          </p>
        </div>
      </div>

      {/* Step 1 */}
      <Card>
        <CardContent className="pt-6">
          <StepHeader n={1} title="Donation Information" done={step1Valid} />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Donation Amount (₹) *</Label>
              <Input
                type="number"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              {requires80G && (
                <p className="text-[11px] text-amber-600">
                  Amount ≥ ₹2,000 → 80G is auto-enabled and PAN is mandatory.
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Donation Nature *</Label>
              <Select value={nature} onValueChange={(v) => setNature(v as DonationNature)}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="Non-Cash">Non-Cash (Gold, Kind, etc.)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-[11px] text-muted-foreground">
                Choose Non-Cash for gold, silver, kind, or in-kind contributions.
              </p>
            </div>
            <div className="space-y-2">
              <Label>80G Required *</Label>
              <Select
                value={effectiveWants80G || ""}
                onValueChange={(v) => setWants80G(v as "Yes" | "No")}
                disabled={requires80G}
              >
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {panRequired && (
              <div className="space-y-2">
                <Label>PAN Number *</Label>
                <Input
                  placeholder="ABCDE1234F"
                  maxLength={10}
                  value={pan}
                  onChange={(e) => setPan(e.target.value.toUpperCase())}
                />
                {pan.length === 10 && !panValid ? (
                  <p className="text-[11px] text-destructive">
                    Invalid PAN. Expected format: AAAAA9999A (e.g. ABCDE1234F).
                  </p>
                ) : (
                  <p className="text-[11px] text-muted-foreground">
                    Format: AAAAA9999A — Example: ABCDE1234F
                  </p>
                )}
              </div>
            )}
            {nature === "Non-Cash" && (
              <div className="space-y-2 md:col-span-4">
                <Label>Item / Description *</Label>
                <Input
                  placeholder="e.g. 10g Gold Chain, 5kg Rice, Silver Lamp"
                  value={nonCashItem}
                  onChange={(e) => setNonCashItem(e.target.value)}
                />
                {nonCashItem && nonCashItem.trim().length < 3 && (
                  <p className="text-[11px] text-destructive">Enter at least 3 characters.</p>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Step 2 */}
      {showStep2 && (
        <Card>
          <CardContent className="pt-6">
            <StepHeader n={2} title="Donor Information" done={step2Valid} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Donor Name *</Label>
                <Input
                  placeholder="Full name"
                  maxLength={100}
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                />
                {donorName && !nameValid && (
                  <p className="text-[11px] text-destructive">Name must be 3–100 characters.</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Mobile Number *</Label>
                <Input
                  placeholder="10-digit mobile"
                  maxLength={10}
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                />
                {mobile && !mobileValid && (
                  <p className="text-[11px] text-destructive">Enter a valid 10-digit Indian mobile.</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Email Address</Label>
                <Input
                  type="email"
                  placeholder="donor@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Address {panRequired && "*"}</Label>
                <Textarea
                  placeholder="Min 10 characters, max 400"
                  value={address}
                  onChange={(e) => onAddressChange(e.target.value)}
                  rows={2}
                />
                <p className="text-[10px] text-muted-foreground text-right">{address.length}/400</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3 */}
      {showStep3 && (
        <Card>
          <CardContent className="pt-6">
            <StepHeader n={3} title="Donation Purpose" done={step3Valid} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Donation Purpose *</Label>
                <Select value={purpose} onValueChange={(v) => setPurpose(v as Purpose)}>
                  <SelectTrigger><SelectValue placeholder="Select purpose" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Counter">Counter Donation</SelectItem>
                    <SelectItem value="Project">Project Donation</SelectItem>
                    <SelectItem value="Event">Event Donation</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {purpose === "Project" && (
                <div className="space-y-2">
                  <Label>Search Project *</Label>
                  <Select value={projectId} onValueChange={setProjectId}>
                    <SelectTrigger><SelectValue placeholder="Select project" /></SelectTrigger>
                    <SelectContent>
                      {projectOptions.map(p => (
                        <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              {purpose === "Event" && (
                <div className="space-y-2">
                  <Label>Search Event *</Label>
                  <Select value={eventId} onValueChange={setEventId}>
                    <SelectTrigger><SelectValue placeholder="Select event" /></SelectTrigger>
                    <SelectContent>
                      {eventOptions.map(e => (
                        <SelectItem key={e.value} value={e.value}>{e.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              {purpose === "Other" && (
                <div className="space-y-2 md:col-span-2">
                  <Label>Remarks *</Label>
                  <Textarea
                    placeholder="Specify the purpose"
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    rows={2}
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4 */}
      {showStep4 && (
        <Card>
          <CardContent className="pt-6">
            <StepHeader n={4} title="Payment Information" done={step4Valid} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Payment Mode *</Label>
                <Select value={paymentMode} onValueChange={(v) => setPaymentMode(v as PaymentMode)}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cash">Cash</SelectItem>
                    <SelectItem value="UPI">UPI</SelectItem>
                    <SelectItem value="Cheque">Cheque</SelectItem>
                    <SelectItem value="NEFT">NEFT</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {paymentMode === "Cash" && (
                <>
                  <div className="space-y-2">
                    <Label>Counter No *</Label>
                    <Input value={counterNo} onChange={(e) => setCounterNo(e.target.value)} placeholder="e.g. CTR-01" />
                  </div>
                  <div className="space-y-2">
                    <Label>Collected By *</Label>
                    <Input value={collectedBy} onChange={(e) => setCollectedBy(e.target.value)} placeholder="Staff name" />
                  </div>
                </>
              )}

              {paymentMode === "UPI" && (
                <>
                  <div className="space-y-2">
                    <Label>WhatsApp Number *</Label>
                    <Input
                      value={whatsappNumber}
                      onChange={(e) => setWhatsappNumber(e.target.value.replace(/\D/g, ""))}
                      placeholder="10-digit mobile"
                      maxLength={10}
                    />
                  </div>
                  <div className="space-y-2 flex flex-col justify-end">
                    <Button type="button" variant="outline" onClick={generatePaymentLink}>
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Generate Payment Link
                    </Button>
                  </div>
                  {paymentLinkSent && (
                    <div className="md:col-span-2 flex items-center justify-between p-3 rounded-md border bg-muted/30">
                      <div className="text-sm">
                        Status:{" "}
                        <span className={paymentStatus === "Paid" ? "text-emerald-600 font-medium" : "text-amber-600 font-medium"}>
                          {paymentStatus}
                        </span>
                      </div>
                      {paymentStatus === "Pending Payment" && (
                        <Button size="sm" variant="secondary" onClick={() => setPaymentStatus("Paid")}>
                          Mark as Paid
                        </Button>
                      )}
                    </div>
                  )}
                </>
              )}

              {paymentMode === "Cheque" && (
                <>
                  <div className="space-y-2">
                    <Label>Cheque No *</Label>
                    <Input value={chequeNo} onChange={(e) => setChequeNo(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Bank Name *</Label>
                    <Input value={bankName} onChange={(e) => setBankName(e.target.value)} />
                  </div>
                </>
              )}

              {paymentMode === "NEFT" && (
                <>
                  <div className="space-y-2">
                    <Label>UTR Number *</Label>
                    <Input value={utrNumber} onChange={(e) => setUtrNumber(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Bank Name *</Label>
                    <Input value={bankName} onChange={(e) => setBankName(e.target.value)} />
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 5 */}
      {showStep5 && (
        <Card>
          <CardContent className="pt-6">
            <StepHeader n={5} title="Review & Generate Receipt" done={!!savedIds} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="p-3 rounded-md bg-muted/40">
                <p className="text-[10px] text-muted-foreground uppercase">Donation ID</p>
                <p className="font-mono text-sm font-semibold">
                  {savedIds?.donationId || "— auto on save —"}
                </p>
              </div>
              <div className="p-3 rounded-md bg-muted/40">
                <p className="text-[10px] text-muted-foreground uppercase">Receipt Number</p>
                <p className="font-mono text-sm font-semibold">
                  {savedIds?.receiptNo || "— auto on save —"}
                </p>
              </div>
              <div className="p-3 rounded-md bg-muted/40">
                <p className="text-[10px] text-muted-foreground uppercase">Status</p>
                <p className="text-sm font-semibold">
                  {paymentMode === "UPI" ? paymentStatus : "Paid"}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button onClick={saveDonation} disabled={!!savedIds}>
                <Save className="h-4 w-4 mr-2" /> Save Donation
              </Button>
              <Button
                variant="outline"
                disabled={!savedIds}
                onClick={() => toast({ title: "Receipt ready", description: `Generated ${savedIds?.receiptNo}` })}
              >
                <Receipt className="h-4 w-4 mr-2" /> Generate Receipt
              </Button>
              <Button
                variant="outline"
                disabled={!savedIds}
                onClick={() =>
                  toast({
                    title: "Sent via WhatsApp",
                    description: `Receipt link sent to +91 ${mobile}`,
                  })
                }
              >
                <MessageCircle className="h-4 w-4 mr-2" /> Send Receipt via WhatsApp
              </Button>
              {savedIds && (
                <Button variant="ghost" className="ml-auto" onClick={() => navigate("/temple/donations/list")}>
                  Done
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AddDonation;
