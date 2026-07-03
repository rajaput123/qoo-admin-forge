import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings, Shield, Package, Users, AlertTriangle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const InstitutionSettings = () => {
  const [sharedVolunteers, setSharedVolunteers] = useState(true);
  const [sharedResources, setSharedResources] = useState(false);
  const [financialIntegration, setFinancialIntegration] = useState(true);
  const [eventCollaboration, setEventCollaboration] = useState(true);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Institution Settings</h1>
        <p className="text-muted-foreground text-sm">Global configuration for institution operations</p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            Collaboration Rules
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium">Shared Volunteer Pool</Label>
              <p className="text-xs text-muted-foreground mt-0.5">Allow volunteers to be shared between temple and institutions</p>
            </div>
            <Switch checked={sharedVolunteers} onCheckedChange={setSharedVolunteers} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium">Resource Sharing</Label>
              <p className="text-xs text-muted-foreground mt-0.5">Allow institutions to request temple resources (with approval)</p>
            </div>
            <Switch checked={sharedResources} onCheckedChange={setSharedResources} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium">Financial Integration</Label>
              <p className="text-xs text-muted-foreground mt-0.5">Show institution financials in trust-level reports</p>
            </div>
            <Switch checked={financialIntegration} onCheckedChange={setFinancialIntegration} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium">Event Collaboration</Label>
              <p className="text-xs text-muted-foreground mt-0.5">Allow institutions to link events with temple festivals</p>
            </div>
            <Switch checked={eventCollaboration} onCheckedChange={setEventCollaboration} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            Operational Constraints
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-3 border rounded-lg bg-muted/30">
            <div className="flex items-center gap-2 mb-1">
              <Package className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm font-medium">Resource Isolation</p>
            </div>
            <p className="text-xs text-muted-foreground">Institution resources are independent. Cross-entity resource use must be logged and approved. No silent transfers.</p>
          </div>
          <div className="p-3 border rounded-lg bg-muted/30">
            <div className="flex items-center gap-2 mb-1">
              <Users className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm font-medium">Staff Separation</p>
            </div>
            <p className="text-xs text-muted-foreground">Institution management team is separate from temple staff. Only volunteers may be shared between entities.</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Settings className="h-4 w-4 text-primary" />
            Default Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Default Institution Status</Label>
            <Select defaultValue="Under Setup">
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Under Setup">Under Setup</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Financial Reporting Frequency</Label>
            <Select defaultValue="monthly">
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="annual">Annual</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={() => toast({ title: "Settings Saved", description: "Institution configuration has been updated." })}>
          Save Settings
        </Button>
      </div>
    </motion.div>
  );
};

export default InstitutionSettings;
