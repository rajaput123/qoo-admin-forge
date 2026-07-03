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
import type { ChildTemple, Temple } from "@/types/temple-structure";

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

interface ChildTempleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  childTemple?: ChildTemple | null;
  temples?: Temple[];
  onSave: (data: Partial<ChildTemple>) => void;
}

interface FormState {
  name: string;
  parentTempleId: string;
  location: string;
  description: string;
  status: "active" | "inactive";
  deity: string;
  operationalStatus: "open" | "closed" | "maintenance";
  contactPhone: string;
  contactEmail: string;
  contactAddress: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  latitude: string;
  longitude: string;
  distance: string;
  darshanOpen: string;
  darshanClose: string;
  facilities: string[];
  dressCode: string;
  images: string[];
  customFields: Record<string, string>;
}

const defaultForm: FormState = {
  name: "", parentTempleId: "", location: "", description: "", status: "active",
  deity: "", operationalStatus: "open", contactPhone: "", contactEmail: "",
  contactAddress: "", city: "", state: "", pincode: "", country: "India",
  latitude: "0", longitude: "0", distance: "",
  darshanOpen: "06:00", darshanClose: "20:00",
  facilities: [], dressCode: "", images: [], customFields: {},
};

export function ChildTempleModal({ open, onOpenChange, childTemple, temples, onSave }: ChildTempleModalProps) {
  const [form, setForm] = useState<FormState>(defaultForm);
  const [newFacility, setNewFacility] = useState("");
  const [newFieldKey, setNewFieldKey] = useState("");
  const [newFieldValue, setNewFieldValue] = useState("");
  const [newFieldType, setNewFieldType] = useState<"text" | "number" | "date" | "boolean" | "dropdown" | "radio">("text");
  const [newFieldOptions, setNewFieldOptions] = useState("");

  useEffect(() => {
    if (childTemple) {
      setForm({
        name: childTemple.name || "",
        parentTempleId: childTemple.parentTempleId || "",
        location: childTemple.location || "",
        description: childTemple.description || "",
        status: childTemple.status || "active",
        deity: childTemple.deity || "",
        operationalStatus: childTemple.operationalStatus || "open",
        contactPhone: childTemple.contactPhone || "",
        contactEmail: childTemple.contactEmail || "",
        contactAddress: childTemple.contactAddress || "",
        city: childTemple.location?.split(",")[0]?.trim() || "",
        state: childTemple.location?.split(",")[1]?.trim() || "",
        pincode: childTemple.pincode || "",
        country: childTemple.country || "India",
        latitude: String(childTemple.gpsCoordinates?.latitude ?? 0),
        longitude: String(childTemple.gpsCoordinates?.longitude ?? 0),
        distance: String(childTemple.distance ?? ""),
        darshanOpen: childTemple.darshanTimings?.open || "06:00",
        darshanClose: childTemple.darshanTimings?.close || "20:00",
        facilities: childTemple.facilities || [],
        dressCode: childTemple.dressCode || "",
        images: childTemple.images || [],
        customFields: childTemple.customFields || {},
      });
    } else {
      setForm(defaultForm);
    }
  }, [childTemple, open]);

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
      update({ customFields: { ...form.customFields, [compositeKey]: val } });
      setNewFieldKey("");
      setNewFieldValue("");
      setNewFieldType("text");
      setNewFieldOptions("");
    }
  };

  const removeCustomField = (key: string) => {
    const updated = { ...form.customFields };
    delete updated[key];
    update({ customFields: updated });
  };

  const handleSave = () => {
    const location = [form.city, form.state].filter(Boolean).join(", ") || form.location;
    onSave({
      name: form.name,
      parentTempleId: form.parentTempleId,
      location,
      description: form.description,
      status: form.status,
      deity: form.deity,
      operationalStatus: form.operationalStatus,
      contactPhone: form.contactPhone,
      contactEmail: form.contactEmail,
      contactAddress: form.contactAddress,
      gpsCoordinates: { latitude: parseFloat(form.latitude) || 0, longitude: parseFloat(form.longitude) || 0 },
      distance: parseFloat(form.distance) || 0,
      darshanTimings: { open: form.darshanOpen, close: form.darshanClose, days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] },
      facilities: form.facilities,
      dressCode: form.dressCode,
      images: form.images,
      customFields: form.customFields,
    } as any);
    onOpenChange(false);
  };

  const isEdit = !!childTemple;

  const renderFieldValue = (compositeKey: string, value: string) => {
    const type = compositeKey.includes("|") ? compositeKey.split("|")[1] : "text";
    const label = compositeKey.includes("|") ? compositeKey.split("|")[0] : compositeKey;
    if (type === "dropdown" || type === "radio") {
      const optionsList = value.includes("::") ? value.split("::")[0].split(",").map(o => o.trim()) : [];
      const selected = value.includes("::") ? value.split("::")[1] : "";
      if (type === "dropdown") {
        return (
          <FieldGroup key={compositeKey} label={label}>
            <Select value={selected} onValueChange={v => update({ customFields: { ...form.customFields, [compositeKey]: `${optionsList.join(",")}::${v}` } })}>
              <SelectTrigger className="text-sm h-9"><SelectValue placeholder="Select..." /></SelectTrigger>
              <SelectContent>{optionsList.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
            </Select>
          </FieldGroup>
        );
      }
      return (
        <FieldGroup key={compositeKey} label={label}>
          <RadioGroup value={selected} onValueChange={v => update({ customFields: { ...form.customFields, [compositeKey]: `${optionsList.join(",")}::${v}` } })} className="flex flex-wrap gap-3">
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
        <FieldGroup key={compositeKey} label={label}>
          <Switch checked={value === "Yes"} onCheckedChange={c => update({ customFields: { ...form.customFields, [compositeKey]: c ? "Yes" : "No" } })} />
        </FieldGroup>
      );
    }
    return (
      <FieldGroup key={compositeKey} label={label}>
        <Input type={type === "number" ? "number" : type === "date" ? "date" : "text"} value={value} onChange={e => update({ customFields: { ...form.customFields, [compositeKey]: e.target.value } })} className="text-sm h-9" />
      </FieldGroup>
    );
  };

  const customFieldsSection = (
    <div className="space-y-3 pt-2">
      <Separator />
      <Label className="text-sm font-medium">Additional Info</Label>
      {Object.entries(form.customFields).map(([compositeKey, value]) => {
        const [label, type] = compositeKey.includes("|") ? compositeKey.split("|") : [compositeKey, "text"];
        return (
          <div key={compositeKey} className="flex items-center gap-2 p-2.5 border border-border rounded-lg bg-muted/30">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-xs font-medium text-foreground">{label}</p>
                <Badge variant="outline" className="text-[10px] px-1.5 py-0">{type}</Badge>
              </div>
              <p className="text-xs text-muted-foreground truncate mt-0.5">{value || "—"}</p>
            </div>
            <button onClick={() => removeCustomField(compositeKey)} className="p-1 hover:bg-muted rounded shrink-0"><X className="h-3.5 w-3.5 text-muted-foreground" /></button>
          </div>
        );
      })}
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
          <Plus className="h-3.5 w-3.5" /> Add Info Field
        </Button>
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-0">
          <DialogTitle>{isEdit ? "Edit Child Temple" : "Add Child Temple"}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="basic" className="flex-1 flex flex-col min-h-0">
          <TabsList className="px-6 border-b border-border">
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto px-6 py-5">
            {/* ─── Basic Tab ─── */}
            <TabsContent value="basic" className="mt-0 space-y-5">
              <FieldGroup label="Child Temple Name" required>
                <Input value={form.name} onChange={e => update({ name: e.target.value })} placeholder="Enter child temple name" />
              </FieldGroup>

              {temples && temples.length > 0 && (
                <FieldGroup label="Parent Temple" required>
                  <Select value={form.parentTempleId} onValueChange={v => update({ parentTempleId: v })}>
                    <SelectTrigger><SelectValue placeholder="Select parent temple" /></SelectTrigger>
                    <SelectContent>
                      {temples.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </FieldGroup>
              )}

              <FieldGroup label="Location">
                <Input value={form.location} onChange={e => update({ location: e.target.value })} placeholder="e.g., Tirumala, Andhra Pradesh" />
              </FieldGroup>

              <FieldGroup label="Description">
                <Textarea value={form.description} onChange={e => update({ description: e.target.value })} placeholder="About this child temple" rows={3} />
              </FieldGroup>

              <FieldGroup label="Deity">
                <Input value={form.deity} onChange={e => update({ deity: e.target.value })} placeholder="e.g., Lord Rama" />
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
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Status</Label>
                  <div className="pt-1">
                    <Switch checked={form.status === "active"} onCheckedChange={c => update({ status: c ? "active" : "inactive" })} />
                  </div>
                </div>
              </div>

              {Object.keys(form.customFields).length > 0 && (
                <div className="space-y-3 pt-2">
                  <Separator />
                  <Label className="text-sm font-medium text-muted-foreground">Additional Info</Label>
                  {Object.entries(form.customFields).map(([key, val]) => renderFieldValue(key, val))}
                </div>
              )}
              {customFieldsSection}
            </TabsContent>

            {/* ─── Details Tab ─── */}
            <TabsContent value="details" className="mt-0 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <FieldGroup label="Contact Phone">
                  <Input value={form.contactPhone} onChange={e => update({ contactPhone: e.target.value })} placeholder="+91 877 223 1234" />
                </FieldGroup>
                <FieldGroup label="Contact Email">
                  <Input value={form.contactEmail} onChange={e => update({ contactEmail: e.target.value })} placeholder="info@temple.org" />
                </FieldGroup>
              </div>

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

              <div className="grid grid-cols-2 gap-4">
                <FieldGroup label="Pincode">
                  <Input value={form.pincode} onChange={e => update({ pincode: e.target.value })} placeholder="Pincode" />
                </FieldGroup>
                <FieldGroup label="Distance from Parent (km)">
                  <Input type="number" value={form.distance} onChange={e => update({ distance: e.target.value })} placeholder="e.g. 5" />
                </FieldGroup>
              </div>

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
            </TabsContent>
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
