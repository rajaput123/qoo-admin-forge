import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Save, Receipt, Plus, Package } from "lucide-react";
import { getTemplatesByType } from "@/data/receiptTemplateData";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useDonations, useDonors } from "@/modules/donations/hooks";
import { recordDonation } from "@/modules/donations/donationsStore";
import { generateReceiptPDF } from "@/lib/receiptGenerator";
import { financeSelectors } from "@/modules/finance/financeStore";


type DonationType = "Counter" | "Event" | "Project" | "Other";

const AddDonation = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const donations = useDonations();
  const donors = useDonors();
  const bankAccounts = financeSelectors.getBankAccounts();

  const [formData, setFormData] = useState({
    // Donation Nature
    donationNature: "Cash" as "Cash" | "Non-Cash",
    
    // Step 1: Donation Basics
    amount: "",
    date: new Date().toISOString().split('T')[0],
    
    donationType: "" as DonationType | "",
    
    // Step 2: Donor Section
    donorName: "",
    donorPhone: "",
    
    // Step 3: Tax Receipt Option
    wants80G: false,
    pan: "",
    address: "",
    email: "",
    
    // Step 4: Channel Details (conditional based on donation type)
    counterId: "",
    paymentMode: "Cash" as "Cash" | "UPI" | "QR" | "Cheque" | "In-Kind",
    paymentReference: "",
    eventName: "",
    projectName: "",
    otherTypeName: "",
    bankAccountId: "",

    // Non-Cash Asset Details
    assetName: "",
    assetQuantity: "",
    assetUnit: "pcs",
    assetEstimatedValue: "",
    
    // Additional
    receiptTemplate: "",
    remarks: "",
  });

  
  const [showAddCounter, setShowAddCounter] = useState(false);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [showAddProject, setShowAddProject] = useState(false);
  
  const [newCounterName, setNewCounterName] = useState("");
  const [newEventName, setNewEventName] = useState("");
  const [newProjectName, setNewProjectName] = useState("");


  // Get available counters
  const [availableCounters, setAvailableCounters] = useState([
    { value: "counter-1", label: "Main Counter" },
    { value: "counter-2", label: "Donation Counter" },
    { value: "counter-3", label: "Seva Counter" },
  ]);

  // Get available events
  const [availableEvents, setAvailableEvents] = useState([
    { value: "event-1", label: "Maha Shivaratri 2025" },
    { value: "event-2", label: "Karthika Deepam" },
  ]);

  // Get available projects
  const [availableProjects, setAvailableProjects] = useState([
    { value: "project-1", label: "Temple Renovation" },
    { value: "project-2", label: "New Hall Construction" },
  ]);

  // Validate PAN format
  const validatePAN = (pan: string): boolean => {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return panRegex.test(pan.toUpperCase());
  };

  const handleSubmit = async () => {
    const isCash = formData.donationNature === "Cash";

    if (isCash) {
      if (!formData.amount || parseFloat(formData.amount) <= 0) {
        toast({ title: "Error", description: "Please enter a valid amount", variant: "destructive" });
        return;
      }
    } else {
      // Non-cash validations
      if (!formData.assetName.trim()) {
        toast({ title: "Error", description: "Please enter asset name", variant: "destructive" });
        return;
      }
      if (!formData.assetQuantity || parseFloat(formData.assetQuantity) <= 0) {
        toast({ title: "Error", description: "Please enter valid quantity", variant: "destructive" });
        return;
      }
      if (!formData.assetEstimatedValue || parseFloat(formData.assetEstimatedValue) <= 0) {
        toast({ title: "Error", description: "Please enter estimated value", variant: "destructive" });
        return;
      }
    }
    if (!formData.donationType) {
      toast({ title: "Error", description: "Please select donation type", variant: "destructive" });
      return;
    }

    if (!formData.donorName.trim()) {
      toast({ title: "Error", description: "Please enter donor name", variant: "destructive" });
      return;
    }

    if (!formData.donorPhone.trim()) {
      toast({ title: "Error", description: "Please enter donor mobile number", variant: "destructive" });
      return;
    }

    // Validate 80G fields if requested
    if (formData.wants80G) {
      if (!formData.pan.trim()) {
        toast({ title: "Error", description: "PAN number is required for 80G receipt", variant: "destructive" });
        return;
      }
      if (!validatePAN(formData.pan)) {
        toast({ title: "Error", description: "Invalid PAN format. Format: ABCDE1234F", variant: "destructive" });
        return;
      }
      if (!formData.address.trim()) {
        toast({ title: "Error", description: "Address is required for 80G receipt", variant: "destructive" });
        return;
      }
    }

    // Conditional validation based on donation type
    if (formData.donationType === "Event" && !formData.eventName) {
      toast({ title: "Error", description: "Please select an event", variant: "destructive" });
      return;
    }

    if (formData.donationType === "Project" && !formData.projectName) {
      toast({ title: "Error", description: "Please select a project", variant: "destructive" });
      return;
    }

    if (formData.donationType === "Other" && !formData.otherTypeName.trim()) {
      toast({ title: "Error", description: "Please specify the donation type", variant: "destructive" });
      return;
    }

    // Bank account required for non-cash payment modes
    const needsBank = formData.donationNature === "Cash" && ["UPI", "QR", "Cheque"].includes(formData.paymentMode);
    if (needsBank && !formData.bankAccountId) {
      toast({ title: "Error", description: "Please select the bank account where funds are received", variant: "destructive" });
      return;
    }

    // Map donation type to source module
    const sourceModuleMap: Record<DonationType, string> = {
      "Counter": "Counter",
      "Event": "Event",
      "Project": "Manual",
      "Other": "Manual",
    };

    const isCashNature = formData.donationNature === "Cash";
    
    // Determine channel based on nature and payment mode
    let channel: "Cash" | "UPI" | "Bank Transfer" | "Online" | "Cheque" | "In-Kind" = "Cash";
    if (!isCashNature) {
      channel = "In-Kind";
    } else {
      // QR maps to UPI channel (it's UPI under the hood)
      channel = formData.paymentMode === "QR" ? "UPI" : formData.paymentMode;
    }

    const donationAmount = isCashNature
      ? parseFloat(formData.amount)
      : parseFloat(formData.assetEstimatedValue);

    // Record donation
    const donation = recordDonation({
      donorName: formData.donorName.trim(),
      phone: formData.donorPhone.trim(),
      email: formData.email.trim() || undefined,
      city: formData.address.trim() || undefined,
      pan: formData.wants80G ? formData.pan.toUpperCase().trim() : undefined,
      nature: formData.donationNature,
      amount: donationAmount,
      purpose: undefined,
      channel: channel,
      mode: isCashNature ? formData.paymentMode : "In-Kind",
      referenceNo: formData.paymentReference || undefined,
      remarks: formData.remarks.trim() || undefined,
      nonCashDetails: !isCashNature ? {
        assetName: formData.assetName.trim(),
        quantity: parseFloat(formData.assetQuantity),
        unit: formData.assetUnit,
        estimatedValue: parseFloat(formData.assetEstimatedValue),
      } : undefined,
      sourceModule: sourceModuleMap[formData.donationType] as any,
      sourceRecordId: formData.eventName || formData.projectName || undefined,
      counterId: formData.counterId || undefined,
      date: formData.date,
      createdBy: "System",
    });

    // Generate receipt (file path stored in donation record)
    try {
      const donor = donors.find(d => d.donorId === donation.donorId);
      await generateReceiptPDF(donation, donor || null, formData.wants80G);
      
      toast({
        title: "Donation Recorded",
        description: formData.wants80G 
          ? `80G receipt ${donation.receiptNo} generated successfully. You can download it from the donations list.`
          : `Receipt ${donation.receiptNo} generated successfully. You can download it from the donations list.`,
      });
    } catch (error) {
      toast({
        title: "Donation Recorded",
        description: `Receipt ${donation.receiptNo} generated. You can download it from the donations list.`,
      });
    }

    // Navigate back to donations list
    navigate("/temple/donations/list");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/temple/donations/list")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Add Donation</h1>
          <p className="text-sm text-muted-foreground mt-1">Record a new donation</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Donation Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Donation Nature Toggle */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Donation Nature</h3>
            <div className="flex gap-3">
              {(["Cash", "Non-Cash"] as const).map(nature => (
                <button
                  key={nature}
                  type="button"
                  onClick={() => setFormData({ ...formData, donationNature: nature })}
                  className={`flex-1 p-4 rounded-lg border-2 transition-all text-center ${
                    formData.donationNature === nature
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-muted-foreground/30"
                  }`}
                >
                  <div className="flex flex-col items-center gap-1.5">
                    {nature === "Cash" ? (
                      <span className="text-lg">💰</span>
                    ) : (
                      <Package className="h-5 w-5 text-muted-foreground" />
                    )}
                    <span className="text-sm font-medium">{nature}</span>
                    <span className="text-[10px] text-muted-foreground">
                      {nature === "Cash" ? "Cash, UPI, Bank Transfer" : "Assets, Goods, Materials"}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Step 1: Donation Basics */}
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold mb-3">Step 1 — Enter Donation Basics</h3>

              {formData.donationNature === "Cash" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Amount (₹) *</Label>
                    <Input
                      type="number"
                      placeholder="Enter amount"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Date *</Label>
                    <Input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Donation Type *</Label>
                    <Select 
                      value={formData.donationType} 
                      onValueChange={(v) => setFormData({ ...formData, donationType: v as DonationType })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select donation type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Counter">Counter</SelectItem>
                        <SelectItem value="Event">Event</SelectItem>
                        <SelectItem value="Project">Project</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {formData.donationType === "Other" && (
                    <div className="space-y-2">
                      <Label>Specify Donation Type *</Label>
                      <Input
                        placeholder="e.g., Memorial Fund, Special Occasion, etc."
                        value={formData.otherTypeName}
                        onChange={(e) => setFormData({ ...formData, otherTypeName: e.target.value })}
                      />
                    </div>
                  )}
                  {formData.donationType === "Project" && (
                    <>
                      <div className="space-y-2">
                        <Label>Project Name *</Label>
                        <Select value={formData.projectName} onValueChange={(v) => setFormData({ ...formData, projectName: v })}>
                          <SelectTrigger><SelectValue placeholder="Select project" /></SelectTrigger>
                          <SelectContent>
                            {availableProjects.map(p => (
                              <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Linked Bank Account *</Label>
                        <Select value={formData.bankAccountId} onValueChange={(v) => setFormData({ ...formData, bankAccountId: v })}>
                          <SelectTrigger><SelectValue placeholder="Select bank account" /></SelectTrigger>
                          <SelectContent>
                            {bankAccounts.map(b => (
                              <SelectItem key={b.id} value={b.id}>
                                {b.name} — {b.bankName} ({b.accountNumber}){b.isDefaultDonation ? " ★" : ""}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                /* Non-Cash Asset Details */
                <div className="space-y-4">
                  <div className="p-4 rounded-lg border bg-muted/20 space-y-1 mb-4">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">Non-Cash Donation</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Capture asset details. Estimated value will be used for financial records and inventory update.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Asset Name *</Label>
                      <Input
                        placeholder="e.g., Rice Bags, Gold Ornament, Cooking Vessels"
                        value={formData.assetName}
                        onChange={(e) => setFormData({ ...formData, assetName: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Quantity *</Label>
                      <Input
                        type="number"
                        placeholder="Enter quantity"
                        value={formData.assetQuantity}
                        onChange={(e) => setFormData({ ...formData, assetQuantity: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Unit</Label>
                      <Select value={formData.assetUnit} onValueChange={(v) => setFormData({ ...formData, assetUnit: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {["pcs", "kg", "bags", "liters", "units", "grams", "sets"].map(u => (
                            <SelectItem key={u} value={u}>{u}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Estimated Value (₹) *</Label>
                      <Input
                        type="number"
                        placeholder="Enter estimated value"
                        value={formData.assetEstimatedValue}
                        onChange={(e) => setFormData({ ...formData, assetEstimatedValue: e.target.value })}
                      />
                      <p className="text-[10px] text-muted-foreground">This value is used for financial entry: Dr Inventory, Cr Donation Income</p>
                    </div>
                    <div className="space-y-2">
                      <Label>Date *</Label>
                      <Input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Donation Type *</Label>
                      <Select 
                        value={formData.donationType} 
                        onValueChange={(v) => setFormData({ ...formData, donationType: v as DonationType })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select donation type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Counter">Counter</SelectItem>
                          <SelectItem value="Event">Event</SelectItem>
                          <SelectItem value="Project">Project</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                    </Select>
                    </div>
                    {formData.donationType === "Other" && (
                      <div className="space-y-2">
                        <Label>Specify Donation Type *</Label>
                        <Input
                          placeholder="e.g., Memorial Fund, Special Occasion, etc."
                          value={formData.otherTypeName}
                          onChange={(e) => setFormData({ ...formData, otherTypeName: e.target.value })}
                        />
                      </div>
                    )}
                    {formData.donationType === "Project" && (
                      <>
                        <div className="space-y-2">
                          <Label>Project Name *</Label>
                          <Select value={formData.projectName} onValueChange={(v) => setFormData({ ...formData, projectName: v })}>
                            <SelectTrigger><SelectValue placeholder="Select project" /></SelectTrigger>
                            <SelectContent>
                              {availableProjects.map(p => (
                                <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Linked Bank Account *</Label>
                          <Select value={formData.bankAccountId} onValueChange={(v) => setFormData({ ...formData, bankAccountId: v })}>
                            <SelectTrigger><SelectValue placeholder="Select bank account" /></SelectTrigger>
                            <SelectContent>
                              {bankAccounts.map(b => (
                                <SelectItem key={b.id} value={b.id}>
                                  {b.name} — {b.bankName} ({b.accountNumber}){b.isDefaultDonation ? " ★" : ""}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Step 2: Donor Section */}
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold mb-3">Step 2 — Donor Section</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Donor Name *</Label>
                  <Input
                    placeholder="Enter donor name"
                    value={formData.donorName}
                    onChange={(e) => setFormData({ ...formData, donorName: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Mobile *</Label>
                  <Input
                    placeholder="Enter mobile number"
                    value={formData.donorPhone}
                    onChange={(e) => setFormData({ ...formData, donorPhone: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Step 3: Tax Receipt Option */}
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold mb-3">Step 3 — Tax Receipt Option</h3>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-0.5">
                  <Label htmlFor="80g-toggle" className="text-base">Donor wants tax receipt (80G)?</Label>
                  <p className="text-sm text-muted-foreground">Enable to generate 80G certificate</p>
                </div>
                <Switch
                  id="80g-toggle"
                  checked={formData.wants80G}
                  onCheckedChange={(checked) => setFormData({ ...formData, wants80G: checked })}
                />
              </div>

              {formData.wants80G && (
                <div className="mt-4 space-y-4 p-4 border rounded-lg bg-muted/30">
                  <div className="space-y-2">
                    <Label>PAN Number *</Label>
                    <Input
                      placeholder="ABCDE1234F"
                      value={formData.pan}
                      onChange={(e) => setFormData({ ...formData, pan: e.target.value.toUpperCase() })}
                      maxLength={10}
                    />
                    <p className="text-xs text-muted-foreground">Format: ABCDE1234F (5 letters, 4 digits, 1 letter)</p>
                  </div>

                  <div className="space-y-2">
                    <Label>Address *</Label>
                    <Textarea
                      placeholder="Enter complete address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Email (Optional)</Label>
                    <Input
                      type="email"
                      placeholder="Enter email address"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Step 4: Channel Details */}
          {formData.donationType && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold mb-3">Step 4 — Channel Details</h3>
                
                {formData.donationType === "Counter" && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Counter *</Label>
                      <Select value={formData.counterId} onValueChange={(v) => setFormData({ ...formData, counterId: v })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select counter" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableCounters.map(counter => (
                            <SelectItem key={counter.value} value={counter.value}>{counter.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {formData.donationType === "Event" && (
                  <div className="space-y-2">
                    <Label>Event Name *</Label>
                    <Select value={formData.eventName} onValueChange={(v) => setFormData({ ...formData, eventName: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select event" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableEvents.map(event => (
                          <SelectItem key={event.value} value={event.value}>{event.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {formData.donationType === "Project" && (
                  null
                )}

              {/* Payment Mode — shown for ALL donation types when Cash nature */}
              {formData.donationNature === "Cash" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="space-y-2">
                    <Label>Payment Mode *</Label>
                    <Select
                      value={formData.paymentMode}
                      onValueChange={(v: any) => setFormData({ ...formData, paymentMode: v, paymentReference: v === "Cash" ? "" : formData.paymentReference })}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Cash">Cash</SelectItem>
                        <SelectItem value="UPI">UPI</SelectItem>
                        <SelectItem value="QR">QR Code</SelectItem>
                        <SelectItem value="Cheque">Cheque</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {formData.paymentMode !== "Cash" && (
                    <div className="space-y-2">
                      <Label>
                        {formData.paymentMode === "UPI" && "UPI Reference / Txn ID *"}
                        {formData.paymentMode === "QR" && "QR Txn / UPI Ref *"}
                        {formData.paymentMode === "Cheque" && "Cheque Number *"}
                      </Label>
                      <Input
                        placeholder={
                          formData.paymentMode === "UPI" ? "e.g. 4XXXXXXXXXXX" :
                          formData.paymentMode === "QR" ? "e.g. UPI ref from QR scan" :
                          "e.g. 123456 — Bank, Date"
                        }
                        value={formData.paymentReference}
                        onChange={(e) => setFormData({ ...formData, paymentReference: e.target.value })}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Bank Account — required for non-cash payment modes (any donation type) */}
              {formData.donationNature === "Cash" && formData.paymentMode !== "Cash" && formData.donationType !== "Project" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="space-y-2">
                    <Label>Receiving Bank Account *</Label>
                    <Select value={formData.bankAccountId} onValueChange={(v) => setFormData({ ...formData, bankAccountId: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select bank account" />
                      </SelectTrigger>
                      <SelectContent>
                        {bankAccounts.map(b => (
                          <SelectItem key={b.id} value={b.id}>
                            {b.name} — {b.bankName} ({b.accountNumber}){b.isDefaultDonation ? " ★" : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-[10px] text-muted-foreground">Account where funds will be credited</p>
                  </div>
                </div>
              )}

              </div>
            </div>
          )}

          {/* Receipt Template Selection */}
          <div className="space-y-2">
            <Label>Receipt Template</Label>
            <Select value={formData.receiptTemplate || "default"} onValueChange={(v) => setFormData({ ...formData, receiptTemplate: v === "default" ? "" : v })}>
              <SelectTrigger>
                <SelectValue placeholder="Use default template" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Use Default Template</SelectItem>
                {getTemplatesByType("Donation").map(t => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.name} ({t.paperSize}){t.isDefault ? " ★" : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">Choose a receipt layout for this donation, or use the default from Settings → Templates</p>
          </div>

          {/* Additional Remarks */}
          <div className="space-y-2">
            <Label>Remarks (Optional)</Label>
            <Textarea
              placeholder="Any additional notes..."
              value={formData.remarks}
              onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
              rows={2}
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => navigate("/temple/donations/list")}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              <Save className="h-4 w-4 mr-2" />
              Save Donation
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddDonation;
