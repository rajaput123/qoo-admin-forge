import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Info } from "lucide-react";
import type { RegistrationData } from "@/pages/temple/events/CreateEvent";

interface Props {
  data: RegistrationData;
  onChange: (data: RegistrationData) => void;
}

const FIELD_GROUPS: { group: string; fields: { key: keyof RegistrationData["requiredFields"]; label: string }[] }[] = [
  {
    group: "Basic",
    fields: [
      { key: "name", label: "Name" },
      { key: "phone", label: "Phone" },
      { key: "email", label: "Email" },
    ],
  },
  {
    group: "Address",
    fields: [
      { key: "address", label: "Address" },
    ],
  },
];

const RegistrationStep = ({ data, onChange }: Props) => {
  const update = (patch: Partial<RegistrationData>) => onChange({ ...data, ...patch });

  const toggleField = (key: keyof RegistrationData["requiredFields"]) => {
    update({
      requiredFields: { ...data.requiredFields, [key]: !data.requiredFields[key] },
    });
  };

  const selectedFieldCount = Object.values(data.requiredFields).filter(Boolean).length;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground">Registration Settings</h3>
        <p className="text-sm text-muted-foreground mt-1">Configure registration for this event</p>
      </div>

      {/* Master Toggle */}
      <div className="flex items-center justify-between py-4 px-4 border rounded-lg bg-muted/30">
        <div>
          <Label className="text-sm font-medium">Enable Registration?</Label>
          <p className="text-xs text-muted-foreground mt-0.5">Allow devotees to register for this event</p>
        </div>
        <Switch checked={data.enabled} onCheckedChange={(v) => update({ enabled: v })} />
      </div>

      {/* Disabled message */}
      {!data.enabled && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-lg border border-dashed border-border bg-muted/20">
          <Info className="h-4 w-4 text-muted-foreground shrink-0" />
          <p className="text-sm text-muted-foreground">Registration is disabled for this event.</p>
        </div>
      )}

      {/* Settings (only when enabled) */}
      {data.enabled && (
        <div className="space-y-6 max-w-5xl">
          {/* Dates & Capacity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <Label>Registration Start Date</Label>
              <Input type="date" value={data.registrationStart} onChange={(e) => update({ registrationStart: e.target.value })} />
              <p className="text-[11px] text-muted-foreground">Must be before event start date</p>
            </div>
            <div className="space-y-1.5">
              <Label>Registration End Date</Label>
              <Input type="date" value={data.registrationEnd} onChange={(e) => update({ registrationEnd: e.target.value })} />
              <p className="text-[11px] text-muted-foreground">Must close before event start</p>
            </div>
            <div className="space-y-1.5">
              <Label>Maximum Capacity</Label>
              <Input type="number" value={data.maxCapacity} onChange={(e) => update({ maxCapacity: parseInt(e.target.value) || 0 })} />
              <p className="text-[11px] text-muted-foreground">Auto-closes when full</p>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <Label>Registration Fee (₹)</Label>
                {data.registrationFee === 0 && (
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0">Free Registration</Badge>
                )}
              </div>
              <Input type="number" value={data.registrationFee} onChange={(e) => update({ registrationFee: parseInt(e.target.value) || 0 })} placeholder="0 for free" />
            </div>
          </div>

          {/* Toggle Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <Label className="text-sm">Allow Waitlist</Label>
              <Switch checked={data.allowWaitlist} onCheckedChange={(v) => update({ allowWaitlist: v })} />
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <Label className="text-sm">QR-based Check-in</Label>
              <Switch checked={data.qrCheckin} onCheckedChange={(v) => update({ qrCheckin: v })} />
            </div>
            <div className="p-3 border rounded-lg space-y-1.5">
              <Label className="text-sm">Approval Mode</Label>
              <Select value={data.approvalMode} onValueChange={(v: any) => update({ approvalMode: v })}>
                <SelectTrigger className="h-8 bg-background"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-popover">
                  <SelectItem value="auto">Auto-confirm</SelectItem>
                  <SelectItem value="manual">Manual Approval</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Required Fields Checklist */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <Label className="text-sm font-medium">Required Registration Fields</Label>
                <p className="text-xs text-muted-foreground mt-0.5">Select mandatory fields for registration</p>
              </div>
              <Badge variant="outline" className="text-xs">{selectedFieldCount} field{selectedFieldCount !== 1 ? "s" : ""} selected</Badge>
            </div>
            <div className="space-y-4">
              {FIELD_GROUPS.map((group) => (
                <div key={group.group}>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{group.group}</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {group.fields.map((field) => (
                      <label
                        key={field.key}
                        className="flex items-center gap-2.5 p-2.5 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                      >
                        <Checkbox
                          checked={data.requiredFields[field.key]}
                          onCheckedChange={() => toggleField(field.key)}
                        />
                        <span className="text-sm">{field.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistrationStep;
