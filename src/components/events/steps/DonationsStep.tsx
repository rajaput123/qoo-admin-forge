import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { IndianRupee, Landmark, Shield } from "lucide-react";
import type { DonationsData } from "@/pages/temple/events/CreateEvent";
import { getTempleConfig } from "@/lib/templeConfig";

interface Props {
  data: DonationsData;
  onChange: (data: DonationsData) => void;
}

const accountOptions = [
  { value: "general-fund", label: "General Fund" },
  { value: "temple-renovation", label: "Temple Renovation Fund" },
  { value: "annadanam-fund", label: "Annadanam Fund" },
  { value: "education-fund", label: "Education & Vedic Studies" },
  { value: "festival-fund", label: "Festival Fund" },
  { value: "maintenance-fund", label: "Maintenance Fund" },
];

const DonationsStep = ({ data, onChange }: Props) => {
  const templeCfg = getTempleConfig();
  const update = (patch: Partial<DonationsData>) => onChange({ ...data, ...patch });

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground">Donation Configuration</h3>
        <p className="text-sm text-muted-foreground mt-1">Enable or disable donations for this event</p>
      </div>

      <div className="flex items-center justify-between py-4 px-4 border rounded-lg bg-muted/30 max-w-xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <IndianRupee className="h-4 w-4 text-primary" />
          </div>
          <div>
            <Label className="text-sm font-medium">Enable Donations</Label>
            <p className="text-xs text-muted-foreground mt-0.5">Allow devotees to contribute to this event</p>
          </div>
        </div>
        <Switch
          checked={data.enabled}
          onCheckedChange={(v) => update({ enabled: v, ...(v ? {} : { eightyGType: "", accountName: "" }) })}
        />
      </div>

      {data.enabled && (
        <div className="space-y-4 max-w-xl">
          <div className="border rounded-lg p-4 bg-muted/20">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="h-4 w-4 text-primary" />
              <Label className="text-sm font-medium">80G Account Type</Label>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              Choose whether contributions for this event are under 80G or non-80G
            </p>
            <Select
              value={data.eightyGType || ""}
              onValueChange={(v) => update({ eightyGType: v as DonationsData["eightyGType"] })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select 80G or Non-80G" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="80G">
                  80G — {templeCfg.registration80G || "tax exempt"}
                </SelectItem>
                <SelectItem value="Non-80G">Non-80G — general</SelectItem>
              </SelectContent>
            </Select>
            {data.eightyGType === "80G" && templeCfg.registration80G && (
              <p className="text-xs text-muted-foreground mt-2">
                Linked to 80G registration {templeCfg.registration80G}
                {templeCfg.pan && ` · PAN ${templeCfg.pan}`}
              </p>
            )}
          </div>

          <div className="border rounded-lg p-4 bg-muted/20">
            <div className="flex items-center gap-2 mb-3">
              <Landmark className="h-4 w-4 text-primary" />
              <Label className="text-sm font-medium">Account / Fund</Label>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              Select the account where amounts for this event will be credited
            </p>
            <Select value={data.accountName} onValueChange={(v) => update({ accountName: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Select account / fund" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                {accountOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="border rounded-lg p-4 bg-muted/20">
            <p className="text-sm text-muted-foreground">
              After creation, amounts and donor details will be linked from the{" "}
              <span className="font-medium text-foreground">Donation Management</span> module
              {data.eightyGType && (
                <> as <span className="font-medium text-foreground">{data.eightyGType}</span></>
              )}
              .
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonationsStep;
