import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { X, Clock, Plus, ImagePlus } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { Temple } from "@/types/temple-structure";

const countryOptions = [
  "India", "United States", "United Kingdom", "Canada", "Australia", "Singapore", "Malaysia", "Nepal", "Sri Lanka",
];

const stateOptions = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
];

interface TempleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  temple?: Temple | null;
  onSave: (data: Partial<Temple>) => void;
  hasPrimaryTemple?: boolean;
}

interface FormState {
  name: string;
  location: string;
  description: string;
  isPrimary: boolean;
  status: "active" | "inactive";
  deity: string;
  operationalStatus: "open" | "closed" | "maintenance";
  contactPhone: string;
  contactEmail: string;
  templeHistory: string;
  contactAddress: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  latitude: string;
  longitude: string;
  geoFencingRadius: string;
  darshanOpen: string;
  darshanClose: string;
  facilities: string[];
  dressCode: string;
  images: string[];
  customFields: Record<string, string>;
  customFieldTabs: Record<string, "basic" | "details" | "custom">;
}

const defaultForm: FormState = {
  name: "", location: "", description: "", isPrimary: false, status: "active",
  deity: "", operationalStatus: "open", contactPhone: "", contactEmail: "",
  templeHistory: "", contactAddress: "", city: "", state: "", pincode: "", country: "India",
  latitude: "0", longitude: "0", geoFencingRadius: "0",
  darshanOpen: "06:00", darshanClose: "20:00",
  facilities: [], dressCode: "", images: [], customFields: {}, customFieldTabs: {},
};

export function TempleModal({ open, onOpenChange, temple, onSave, hasPrimaryTemple }: TempleModalProps) {
  const [form, setForm] = useState<FormState>(defaultForm);
  const [newFacility, setNewFacility] = useState("");
  const [newFieldKey, setNewFieldKey] = useState("");
  const [newFieldValue, setNewFieldValue] = useState("");
  const [newFieldType, setNewFieldType] = useState<"text" | "number" | "date" | "boolean" | "dropdown" | "radio" | "image">("text");
  const [newFieldOptions, setNewFieldOptions] = useState("");
  const [newFieldTab, setNewFieldTab] = useState<"basic" | "details" | "custom">("basic");


  useEffect(() => {
    if (temple) {
      setForm({
        name: temple.name || "",
        location: temple.location || "",
        description: temple.description || "",
        isPrimary: temple.isPrimary ?? false,
        status: temple.status || "active",
        deity: temple.deity || "",
        operationalStatus: temple.operationalStatus || "open",
        contactPhone: temple.contactPhone || "",
        contactEmail: temple.contactEmail || "",
        templeHistory: temple.templeHistory || "",
        contactAddress: temple.contactAddress || "",
        city: temple.location?.split(",")[0]?.trim() || "",
        state: temple.location?.split(",")[1]?.trim() || "",
        pincode: "",
        country: "India",
        latitude: String(temple.gpsCoordinates?.latitude ?? 0),
        longitude: String(temple.gpsCoordinates?.longitude ?? 0),
        geoFencingRadius: String(temple.geoFencingRadius ?? 0),
        darshanOpen: temple.darshanTimings?.open || "06:00",
        darshanClose: temple.darshanTimings?.close || "20:00",
        facilities: temple.facilities || [],
        dressCode: temple.dressCode || "",
        images: (temple as any).images || [],
        customFields: temple.customFields || {},
        customFieldTabs: (temple as any).customFieldTabs || {},
      });
    } else {
      setForm(defaultForm);
    }
  }, [temple, open]);

  const update = (patch: Partial<FormState>) => setForm(prev => ({ ...prev, ...patch }));

  const addFacility = () => {
    if (newFacility.trim() && !form.facilities.includes(newFacility.trim())) {
      update({ facilities: [...form.facilities, newFacility.trim()] });
      setNewFacility("");
    }
  };

  const removeFacility = (f: string) => update({ facilities: form.facilities.filter(x => x !== f) });

  const addCustomField = () => {
    if (newFieldKey.trim()) {
      const compositeKey = `${newFieldKey.trim()}|${newFieldType}`;
      let val = newFieldValue;
      if (newFieldType === "boolean") val = val || "No";
      if ((newFieldType === "dropdown" || newFieldType === "radio") && newFieldOptions.trim()) {
        val = `${newFieldOptions.trim()}::${val}`;
      }
      if (newFieldType === "image") val = ""; // images added via upload
      update({
        customFields: { ...form.customFields, [compositeKey]: val },
        customFieldTabs: { ...form.customFieldTabs, [compositeKey]: newFieldTab },
      });
      setNewFieldKey("");
      setNewFieldValue("");
      setNewFieldType("text");
      setNewFieldOptions("");
      setNewFieldTab("basic");
    }
  };

  const handleImageUpload = (compositeKey: string, files: FileList | null) => {
    if (!files) return;
    const existingUrls = form.customFields[compositeKey] ? form.customFields[compositeKey].split("|||").filter(Boolean) : [];
    const newFiles = Array.from(files);
    newFiles.forEach(file => {
      const url = URL.createObjectURL(file);
      existingUrls.push(url);
    });
    update({ customFields: { ...form.customFields, [compositeKey]: existingUrls.join("|||") } });
  };

  const removeImage = (compositeKey: string, index: number) => {
    const urls = form.customFields[compositeKey].split("|||").filter(Boolean);
    urls.splice(index, 1);
    update({ customFields: { ...form.customFields, [compositeKey]: urls.join("|||") } });
  };

  const removeCustomField = (key: string) => {
    const updatedFields = { ...form.customFields };
    delete updatedFields[key];
    const updatedTabs = { ...form.customFieldTabs };
    delete updatedTabs[key];
    update({ customFields: updatedFields, customFieldTabs: updatedTabs });
  };

  const handleSave = () => {
    const location = [form.city, form.state].filter(Boolean).join(", ") || form.location;
    onSave({
      name: form.name, location, description: form.description, isPrimary: form.isPrimary,
      status: form.status, deity: form.deity, operationalStatus: form.operationalStatus,
      contactPhone: form.contactPhone, contactEmail: form.contactEmail,
      templeHistory: form.templeHistory, contactAddress: form.contactAddress,
      gpsCoordinates: { latitude: parseFloat(form.latitude) || 0, longitude: parseFloat(form.longitude) || 0 },
      geoFencingRadius: parseInt(form.geoFencingRadius) || 0,
      darshanTimings: { open: form.darshanOpen, close: form.darshanClose, days: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"] },
      facilities: form.facilities, dressCode: form.dressCode, customFields: form.customFields,
    });
    onOpenChange(false);
  };

  const isEdit = !!temple;

  const renderCustomFieldDisplay = (compositeKey: string, value: string) => {
    const parts = compositeKey.includes("|") ? compositeKey.split("|") : [compositeKey, "text"];
    const label = parts[0];
    const type = parts[1];
    const tab = form.customFieldTabs[compositeKey] || "basic";
    let displayValue = value;
    if ((type === "dropdown" || type === "radio") && value.includes("::")) {
      const [options, selected] = value.split("::");
      displayValue = selected || `Options: ${options}`;
    }
    return (
      <div key={compositeKey} className="flex items-center gap-2 p-2.5 border border-border rounded-lg bg-muted/30">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-xs font-medium text-foreground">{label}</p>
            <Badge variant="outline" className="text-[10px] px-1.5 py-0">{type}</Badge>
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{tab} tab</Badge>
          </div>
          <p className="text-xs text-muted-foreground truncate mt-0.5">{displayValue || "—"}</p>
        </div>
        <button onClick={() => removeCustomField(compositeKey)} className="p-1 hover:bg-muted rounded shrink-0"><X className="h-3.5 w-3.5 text-muted-foreground" /></button>
      </div>
    );
  };

  const getFieldsForTab = (tab: "basic" | "details" | "custom") =>
    Object.entries(form.customFields).filter(([key]) => (form.customFieldTabs[key] || "basic") === tab);

  const renderFieldValue = (compositeKey: string, value: string) => {
    const type = compositeKey.includes("|") ? compositeKey.split("|")[1] : "text";
    const label = compositeKey.includes("|") ? compositeKey.split("|")[0] : compositeKey;
    if (type === "dropdown" || type === "radio") {
      const optionsList = value.includes("::") ? value.split("::")[0].split(",").map(o => o.trim()) : [];
      const selected = value.includes("::") ? value.split("::")[1] : "";
      if (type === "dropdown") {
        return (
          <FieldGroup label={label}>
            <Select value={selected} onValueChange={v => {
              update({ customFields: { ...form.customFields, [compositeKey]: `${optionsList.join(",")}::${v}` } });
            }}>
              <SelectTrigger className="text-sm h-9"><SelectValue placeholder="Select..." /></SelectTrigger>
              <SelectContent>
                {optionsList.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
              </SelectContent>
            </Select>
          </FieldGroup>
        );
      }
      return (
        <FieldGroup label={label}>
          <RadioGroup value={selected} onValueChange={v => {
            update({ customFields: { ...form.customFields, [compositeKey]: `${optionsList.join(",")}::${v}` } });
          }} className="flex flex-wrap gap-3">
            {optionsList.map(o => (
              <div key={o} className="flex items-center gap-1.5">
                <RadioGroupItem value={o} id={`${compositeKey}-${o}`} />
                <Label htmlFor={`${compositeKey}-${o}`} className="text-sm">{o}</Label>
              </div>
            ))}
          </RadioGroup>
        </FieldGroup>
      );
    }
    if (type === "boolean") {
      return (
        <FieldGroup label={label}>
          <Switch checked={value === "Yes"} onCheckedChange={c => {
            update({ customFields: { ...form.customFields, [compositeKey]: c ? "Yes" : "No" } });
          }} />
        </FieldGroup>
      );
    }
    return (
      <FieldGroup label={label}>
        <Input
          type={type === "number" ? "number" : type === "date" ? "date" : "text"}
          value={value}
          onChange={e => update({ customFields: { ...form.customFields, [compositeKey]: e.target.value } })}
          className="text-sm h-9"
        />
      </FieldGroup>
    );
  };

  const customFieldsSection = (
    <div className="space-y-3 pt-2">
      <Separator />
      <Label className="text-sm font-medium">Custom Fields</Label>
      {Object.entries(form.customFields).map(([key, val]) => renderCustomFieldDisplay(key, val))}
      <div className="space-y-2.5 p-3 border border-dashed border-border rounded-lg bg-muted/10">
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Field Name</Label>
            <Input value={newFieldKey} onChange={e => setNewFieldKey(e.target.value)} placeholder="e.g. Founded Year" className="text-sm h-9" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Type</Label>
            <Select value={newFieldType} onValueChange={(v: any) => { setNewFieldType(v); setNewFieldValue(""); setNewFieldOptions(""); }}>
              <SelectTrigger className="text-sm h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text</SelectItem>
                <SelectItem value="number">Number</SelectItem>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="boolean">Yes / No</SelectItem>
                <SelectItem value="dropdown">Dropdown</SelectItem>
                <SelectItem value="radio">Radio</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        {(newFieldType === "dropdown" || newFieldType === "radio") && (
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Options (comma separated)</Label>
            <Input value={newFieldOptions} onChange={e => setNewFieldOptions(e.target.value)} placeholder="e.g. Option 1, Option 2, Option 3" className="text-sm h-9" />
          </div>
        )}
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Default Value</Label>
          {newFieldType === "boolean" ? (
            <Select value={newFieldValue || "No"} onValueChange={setNewFieldValue}>
              <SelectTrigger className="text-sm h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Yes">Yes</SelectItem>
                <SelectItem value="No">No</SelectItem>
              </SelectContent>
            </Select>
          ) : (newFieldType === "dropdown" || newFieldType === "radio") ? (
            newFieldOptions.trim() ? (
              <Select value={newFieldValue} onValueChange={setNewFieldValue}>
                <SelectTrigger className="text-sm h-9"><SelectValue placeholder="Select default..." /></SelectTrigger>
                <SelectContent>
                  {newFieldOptions.split(",").map(o => o.trim()).filter(Boolean).map(o => (
                    <SelectItem key={o} value={o}>{o}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <p className="text-xs text-muted-foreground italic py-2">Enter options above first</p>
            )
          ) : (
            <Input
              type={newFieldType === "number" ? "number" : newFieldType === "date" ? "date" : "text"}
              value={newFieldValue}
              onChange={e => setNewFieldValue(e.target.value)}
              placeholder={newFieldType === "number" ? "0" : newFieldType === "date" ? "" : "Enter value"}
              className="text-sm h-9"
            />
          )}
        </div>
        <Button type="button" variant="outline" size="sm" onClick={addCustomField} disabled={!newFieldKey.trim()} className="w-full gap-1 h-8">
          <Plus className="h-3.5 w-3.5" /> Add Custom Field
        </Button>
      </div>
    </div>
  );

  const hasCustomTab = getFieldsForTab("custom").length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-0">
          <DialogTitle>{isEdit ? "Edit Temple" : "Add Temple"}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="basic" className="flex-1 flex flex-col min-h-0">
          <TabsList className="px-6 border-b border-border">
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            {hasCustomTab && <TabsTrigger value="custom">Custom</TabsTrigger>}
          </TabsList>

          <div className="flex-1 overflow-y-auto px-6 py-5">
            {/* ─── Basic Tab ─── */}
            <TabsContent value="basic" className="mt-0 space-y-5">
              <FieldGroup label="Temple Name" required>
                <Input value={form.name} onChange={e => update({ name: e.target.value })} placeholder="Enter temple name" />
              </FieldGroup>
              <FieldGroup label="Location">
                <Input value={form.location} onChange={e => update({ location: e.target.value })} placeholder="e.g., Tirupati, Andhra Pradesh" />
              </FieldGroup>
              <FieldGroup label="Description">
                <Textarea value={form.description} onChange={e => update({ description: e.target.value })} placeholder="About this temple" rows={4} />
              </FieldGroup>

              {/* Images */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Images</Label>
                <p className="text-xs text-muted-foreground">Upload multiple temple images</p>
                {form.images.length > 0 && (
                  <div className="grid grid-cols-4 gap-2">
                    {form.images.map((img, i) => (
                      <div key={i} className="relative group rounded-lg overflow-hidden border border-border aspect-square">
                        <img src={img} alt={`Temple ${i + 1}`} className="w-full h-full object-cover" />
                        <button
                          onClick={() => update({ images: form.images.filter((_, idx) => idx !== i) })}
                          className="absolute top-1 right-1 p-0.5 rounded-full bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3.5 w-3.5 text-destructive" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <label className="flex items-center justify-center gap-2 h-20 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/30 transition-colors">
                  <ImagePlus className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Click to add images</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={e => {
                      if (e.target.files) {
                        const newUrls = Array.from(e.target.files).map(f => URL.createObjectURL(f));
                        update({ images: [...form.images, ...newUrls] });
                      }
                      e.target.value = "";
                    }}
                  />
                </label>
              </div>

              <div className="grid grid-cols-2 gap-6 pt-2">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Primary Temple</Label>
                  <p className="text-xs text-muted-foreground">Only one primary temple per installation</p>
                  <Switch checked={form.isPrimary} onCheckedChange={c => update({ isPrimary: c })} disabled={hasPrimaryTemple && !temple?.isPrimary} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Status</Label>
                  <div className="pt-1">
                    <Switch checked={form.status === "active"} onCheckedChange={c => update({ status: c ? "active" : "inactive" })} />
                  </div>
                </div>
              </div>
              {getFieldsForTab("basic").length > 0 && (
                <div className="space-y-3 pt-2">
                  <Separator />
                  <Label className="text-sm font-medium text-muted-foreground">Custom Fields</Label>
                  {getFieldsForTab("basic").map(([key, val]) => renderFieldValue(key, val))}
                </div>
              )}
              {customFieldsSection}
            </TabsContent>

            {/* ─── Details Tab ─── */}
            <TabsContent value="details" className="mt-0 space-y-5">
              <FieldGroup label="Deity">
                <Input value={form.deity} onChange={e => update({ deity: e.target.value })} placeholder="e.g., Lord Venkateswara" />
              </FieldGroup>
              <FieldGroup label="Operational Status">
                <Select value={form.operationalStatus} onValueChange={(v: "open" | "closed" | "maintenance") => update({ operationalStatus: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </FieldGroup>
              <FieldGroup label="Contact Phone">
                <Input value={form.contactPhone} onChange={e => update({ contactPhone: e.target.value })} placeholder="+91 877 223 1234" />
              </FieldGroup>
              <FieldGroup label="Contact Email">
                <Input value={form.contactEmail} onChange={e => update({ contactEmail: e.target.value })} placeholder="info@temple.org" />
              </FieldGroup>
              <FieldGroup label="Temple History">
                <Textarea value={form.templeHistory} onChange={e => update({ templeHistory: e.target.value })} placeholder="History and significance" rows={3} />
              </FieldGroup>
              <FieldGroup label="Country">
                <Select value={form.country} onValueChange={v => update({ country: v })}>
                  <SelectTrigger><SelectValue placeholder="Select country" /></SelectTrigger>
                  <SelectContent>
                    {countryOptions.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </FieldGroup>
              <div className="grid grid-cols-2 gap-4">
                <FieldGroup label="State">
                  <Select value={form.state} onValueChange={v => update({ state: v })}>
                    <SelectTrigger><SelectValue placeholder="Select state" /></SelectTrigger>
                    <SelectContent>
                      {stateOptions.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </FieldGroup>
                <FieldGroup label="City">
                  <Input value={form.city} onChange={e => update({ city: e.target.value })} placeholder="City" />
                </FieldGroup>
              </div>
              <FieldGroup label="Address Line">
                <Input value={form.contactAddress} onChange={e => update({ contactAddress: e.target.value })} placeholder="Street, area, locality" />
              </FieldGroup>
              <FieldGroup label="Pincode">
                <Input value={form.pincode} onChange={e => update({ pincode: e.target.value })} placeholder="Pincode" />
              </FieldGroup>
              <div className="grid grid-cols-2 gap-4">
                <FieldGroup label="Darshan Open Time">
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input type="time" value={form.darshanOpen} onChange={e => update({ darshanOpen: e.target.value })} className="pl-9" />
                  </div>
                </FieldGroup>
                <FieldGroup label="Darshan Close Time">
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input type="time" value={form.darshanClose} onChange={e => update({ darshanClose: e.target.value })} className="pl-9" />
                  </div>
                </FieldGroup>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Facilities</Label>
                <div className="flex gap-2">
                  <Input value={newFacility} onChange={e => setNewFacility(e.target.value)} placeholder="Enter facility name" onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addFacility())} />
                  <Button type="button" variant="outline" onClick={addFacility} className="shrink-0">Add</Button>
                </div>
                {form.facilities.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {form.facilities.map(f => (
                      <Badge key={f} variant="secondary" className="gap-1 pr-1">
                        {f}
                        <button onClick={() => removeFacility(f)} className="ml-0.5 hover:bg-muted rounded-full p-0.5"><X className="h-3 w-3" /></button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              <FieldGroup label="Dress Code">
                <Textarea value={form.dressCode} onChange={e => update({ dressCode: e.target.value })} placeholder="Dress code requirements" rows={3} />
              </FieldGroup>
              {getFieldsForTab("details").length > 0 && (
                <div className="space-y-3 pt-2">
                  <Separator />
                  <Label className="text-sm font-medium text-muted-foreground">Custom Fields</Label>
                  {getFieldsForTab("details").map(([key, val]) => renderFieldValue(key, val))}
                </div>
              )}
              {customFieldsSection}
            </TabsContent>

            {/* ─── Custom Tab ─── */}
            {hasCustomTab && (
              <TabsContent value="custom" className="mt-0 space-y-5">
                {getFieldsForTab("custom").map(([key, val]) => renderFieldValue(key, val))}
                {customFieldsSection}
              </TabsContent>
            )}
          </div>
        </Tabs>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-border">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={!form.name.trim()}>{isEdit ? "Update" : "Save"}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

const FieldGroup = ({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) => (
  <div className="space-y-1.5">
    <Label className="text-sm font-medium">
      {label} {required && <span className="text-destructive">*</span>}
    </Label>
    {children}
  </div>
);
