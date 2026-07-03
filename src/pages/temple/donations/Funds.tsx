import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Eye, Edit } from "lucide-react";
import { useDonations, useFunds } from "@/modules/donations/hooks";
import { createFund, updateFund } from "@/modules/donations/donationsStore";
import { useToast } from "@/hooks/use-toast";
import type { Fund } from "@/modules/donations/types";

const formatCurrency = (val: number) => {
  return `₹${val.toLocaleString('en-IN')}`;
};

const Funds = () => {
  const navigate = useNavigate();
  const donations = useDonations();
  const funds = useFunds();
  const { toast } = useToast();
  const [showAddFund, setShowAddFund] = useState(false);
  const [editingFund, setEditingFund] = useState<Fund | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    openingBalance: "",
    status: "Active" as "Active" | "Inactive",
  });

  // Calculate fund totals
  const calculateFundStats = (fund: Fund) => {
    const totalReceived = donations
      .filter(d => d.purpose === fund.name)
      .reduce((sum, d) => sum + d.amount, 0);
    
    const openingBalance = fund.openingBalance ?? 0;
    const availableBalance = openingBalance + totalReceived;

    return { totalReceived, availableBalance, openingBalance };
  };

  const allFundsWithStats = funds.map(fund => ({
    ...fund,
    ...calculateFundStats(fund),
  }));

  const handleAddFund = () => {
    if (!formData.name.trim()) {
      toast({ title: "Error", description: "Fund name is required", variant: "destructive" });
      return;
    }

    try {
      createFund({
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        openingBalance: formData.openingBalance ? parseFloat(formData.openingBalance) : 0,
        isActive: formData.status === "Active",
        createdBy: "System",
      });
      setFormData({ name: "", description: "", openingBalance: "", status: "Active" });
      setShowAddFund(false);
      toast({ title: "Success", description: `Fund "${formData.name.trim()}" created successfully` });
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to create fund", variant: "destructive" });
    }
  };

  const handleEditFund = (fund: Fund) => {
    setEditingFund(fund);
    setFormData({
      name: fund.name,
      description: fund.description || "",
      openingBalance: fund.openingBalance?.toString() || "",
      status: fund.isActive ? "Active" : "Inactive",
    });
    setShowAddFund(true);
  };

  const handleUpdateFund = () => {
    if (!editingFund || !formData.name.trim()) {
      toast({ title: "Error", description: "Fund name is required", variant: "destructive" });
      return;
    }

    try {
      updateFund(editingFund.id, {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        openingBalance: formData.openingBalance ? parseFloat(formData.openingBalance) : 0,
        isActive: formData.status === "Active",
        updatedBy: "System",
      });
      setFormData({ name: "", description: "", openingBalance: "", status: "Active" });
      setEditingFund(null);
      setShowAddFund(false);
      toast({ title: "Success", description: "Fund updated successfully" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to update fund", variant: "destructive" });
    }
  };

  const handleViewDetails = (fundId: string) => {
    navigate(`/temple/donations/funds/${fundId}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Funds Management</h1>
          <p className="text-sm text-muted-foreground mt-1">Create and manage donation funds</p>
        </div>
        <Button onClick={() => {
          setEditingFund(null);
          setFormData({ name: "", description: "", openingBalance: "", status: "Active" });
          setShowAddFund(true);
        }}>
          <Plus className="h-4 w-4 mr-2" />
          Add Fund
        </Button>
      </div>

      {/* Funds Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Funds</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fund Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Total Received</TableHead>
                  <TableHead className="text-right">Available Balance</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[120px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allFundsWithStats.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      No funds found. Click "Add Fund" to create your first fund.
                    </TableCell>
                  </TableRow>
                ) : (
                  allFundsWithStats.map((fund) => (
                    <TableRow key={fund.id}>
                      <TableCell className="font-medium">{fund.name}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {fund.description || "-"}
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {formatCurrency(fund.totalReceived)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge 
                          variant={fund.availableBalance >= 0 ? "default" : "destructive"}
                          className="font-semibold"
                        >
                          {formatCurrency(fund.availableBalance)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={fund.isActive ? "default" : "secondary"}
                          className={fund.isActive ? "bg-green-100 text-green-700" : ""}
                        >
                          {fund.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetails(fund.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditFund(fund)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Fund Dialog */}
      <Dialog open={showAddFund} onOpenChange={setShowAddFund}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingFund ? "Edit Fund" : "Add New Fund"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Fund Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Annadanam Fund, Construction Fund"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Optional description of the fund's purpose"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="openingBalance">Opening Balance</Label>
              <Input
                id="openingBalance"
                type="number"
                placeholder="0.00"
                value={formData.openingBalance}
                onChange={(e) => setFormData({ ...formData, openingBalance: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">Starting balance when creating this fund</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value: "Active" | "Inactive") => setFormData({ ...formData, status: value })}>
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowAddFund(false);
              setEditingFund(null);
              setFormData({ name: "", description: "", openingBalance: "", status: "Active" });
            }}>
              Cancel
            </Button>
            <Button onClick={editingFund ? handleUpdateFund : handleAddFund}>
              {editingFund ? "Update" : "Create"} Fund
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Funds;
