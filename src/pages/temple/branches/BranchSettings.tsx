import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings, Shield, GitBranch, Users, Package, AlertTriangle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const BranchSettings = () => {
  const [crossBranchVolunteers, setCrossBranchVolunteers] = useState(true);
  const [crossBranchFreelancers, setCrossBranchFreelancers] = useState(false);
  const [stockTransfer, setStockTransfer] = useState(false);
  const [centralReporting, setCentralReporting] = useState(true);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Branch Settings</h1>
        <p className="text-muted-foreground text-sm">Global configuration for multi-branch operations</p>
      </div>

      {/* Isolation Rules */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            Branch Isolation Rules
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium">Cross-Branch Volunteers</Label>
              <p className="text-xs text-muted-foreground mt-0.5">Allow volunteers to be shared across branches</p>
            </div>
            <Switch checked={crossBranchVolunteers} onCheckedChange={setCrossBranchVolunteers} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium">Cross-Branch Freelancers</Label>
              <p className="text-xs text-muted-foreground mt-0.5">Allow freelancers to be assigned across branches</p>
            </div>
            <Switch checked={crossBranchFreelancers} onCheckedChange={setCrossBranchFreelancers} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium">Inter-Branch Stock Transfer</Label>
              <p className="text-xs text-muted-foreground mt-0.5">Allow stock transfer between branches (with approval)</p>
            </div>
            <Switch checked={stockTransfer} onCheckedChange={setStockTransfer} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium">Centralized Reporting</Label>
              <p className="text-xs text-muted-foreground mt-0.5">Enable trust-level aggregate reports</p>
            </div>
            <Switch checked={centralReporting} onCheckedChange={setCentralReporting} />
          </div>
        </CardContent>
      </Card>

      {/* Operational Constraints */}
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
              <p className="text-sm font-medium">Stock Isolation</p>
            </div>
            <p className="text-xs text-muted-foreground">Stock cannot move across branches without explicit transfer request & approval. Each branch maintains independent inventory.</p>
          </div>
          <div className="p-3 border rounded-lg bg-muted/30">
            <div className="flex items-center gap-2 mb-1">
              <GitBranch className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm font-medium">Event Isolation</p>
            </div>
            <p className="text-xs text-muted-foreground">Events cannot use resources from another branch. Materials, volunteers, and freelancers are branch-scoped.</p>
          </div>
          <div className="p-3 border rounded-lg bg-muted/30">
            <div className="flex items-center gap-2 mb-1">
              <Users className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm font-medium">Kitchen Isolation</p>
            </div>
            <p className="text-xs text-muted-foreground">Kitchen ingredient requests deduct from branch stock only. No cross-branch ingredient sharing.</p>
          </div>
        </CardContent>
      </Card>

      {/* Default Branch Config */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Settings className="h-4 w-4 text-primary" />
            Default Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Default Branch Status</Label>
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
            <Label>Branch Naming Convention</Label>
            <Select defaultValue="trust-prefix">
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="trust-prefix">Trust Name – Branch Name</SelectItem>
                <SelectItem value="code-prefix">Branch Code – Branch Name</SelectItem>
                <SelectItem value="standalone">Standalone Name</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={() => toast({ title: "Settings Saved", description: "Branch configuration has been updated." })}>
          Save Settings
        </Button>
      </div>
    </motion.div>
  );
};

export default BranchSettings;
