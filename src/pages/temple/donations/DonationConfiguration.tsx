import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Settings2, Save, Shield, IndianRupee, Tag } from "lucide-react";
import { toast } from "sonner";
import {
  getDonationConfig,
  saveDonationConfig,
  type DonationConfig,
} from "@/modules/donations/donationConfig";
import { get80GStatusLabel } from "@/lib/templeConfig";

const DonationConfiguration = () => {
  const [config, setConfig] = useState<DonationConfig>(() => getDonationConfig());
  const [saved, setSaved] = useState(true);

  const update = <K extends keyof DonationConfig>(key: K, value: DonationConfig[K]) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const updatePurpose = (key: keyof DonationConfig["purposeCategories"], value: boolean) => {
    setConfig((prev) => ({
      ...prev,
      purposeCategories: { ...prev.purposeCategories, [key]: value },
    }));
    setSaved(false);
  };

  const handleSave = () => {
    if (config.minDonationAmount < 0 || config.eightyGThreshold < 0) {
      toast.error("Amounts cannot be negative");
      return;
    }
    const enabledCount = Object.values(config.purposeCategories).filter(Boolean).length;
    if (enabledCount === 0) {
      toast.error("At least one purpose category must be enabled");
      return;
    }
    saveDonationConfig(config);
    setSaved(true);
    toast.success("Donation configuration saved");
  };

  const eightyGStatus = get80GStatusLabel();

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Settings2 className="h-6 w-6 text-primary" />
            Donation Configuration
          </h2>
          <p className="text-muted-foreground mt-1">
            Configure business rules for recording donations, 80G eligibility, and purpose categories.
          </p>
        </div>
        <Badge variant={eightyGStatus === "Active" ? "default" : "secondary"} className="shrink-0">
          80G: {eightyGStatus}
        </Badge>
      </div>

      {/* Amount & compliance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <IndianRupee className="h-4 w-4 text-primary" />
            Amount & Compliance
          </CardTitle>
          <CardDescription>Thresholds and mandatory fields applied during donation entry</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label>Minimum Donation Amount (₹)</Label>
              <Input
                type="number"
                min={0}
                value={config.minDonationAmount}
                onChange={(e) => update("minDonationAmount", parseFloat(e.target.value) || 0)}
              />
              <p className="text-xs text-muted-foreground">Donations below this amount cannot be saved</p>
            </div>
            <div className="space-y-2">
              <Label>80G Auto-Suggest Threshold (₹)</Label>
              <Input
                type="number"
                min={0}
                value={config.eightyGThreshold}
                onChange={(e) => update("eightyGThreshold", parseFloat(e.target.value) || 0)}
              />
              <p className="text-xs text-muted-foreground">Amounts at or above this value suggest 80G exemption</p>
            </div>
          </div>
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label className="text-base flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                PAN Mandatory
              </Label>
              <p className="text-sm text-muted-foreground">
                Require donor PAN for every donation — with or without 80G
              </p>
            </div>
            <Switch
              checked={config.panMandatory}
              onCheckedChange={(v) => update("panMandatory", v)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Purpose categories */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Tag className="h-4 w-4 text-primary" />
            Donation Purpose Categories
          </CardTitle>
          <CardDescription>
            Purpose is selected in Step 1 of the donation form. Enable the categories your temple uses.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {(
            [
              { key: "general" as const, label: "General", desc: "Counter / hundi and general temple donations" },
              { key: "project" as const, label: "Project", desc: "Linked to active temple projects" },
              { key: "events" as const, label: "Events", desc: "Linked to scheduled events" },
              { key: "others" as const, label: "Others", desc: "Custom purpose with mandatory remarks" },
            ] as const
          ).map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label className="text-base">{label}</Label>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
              <Switch
                checked={config.purposeCategories[key]}
                onCheckedChange={(v) => updatePurpose(key, v)}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saved} size="lg">
          <Save className="h-4 w-4 mr-2" />
          {saved ? "Saved" : "Save Configuration"}
        </Button>
      </div>
    </div>
  );
};

export default DonationConfiguration;
