import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, GitBranch, IndianRupee, TrendingUp, Users, Package } from "lucide-react";
import { branches } from "@/data/branchData";
import { toast } from "sonner";

const BranchReports = () => {
  const [isExporting, setIsExporting] = useState(false);

  const totalRevenue = branches.reduce((s, b) => s + b.monthlyRevenue, 0);
  const totalExpense = branches.reduce((s, b) => s + b.monthlyExpense, 0);
  const totalStock = branches.reduce((s, b) => s + b.totalStockValue, 0);
  const totalVolunteers = branches.reduce((s, b) => s + b.volunteerCount, 0);

  const handleExport = () => {
    setIsExporting(true);
    try {
      // Prepare CSV data
      const headers = ["Name", "Code", "City", "State", "Revenue", "Expenses", "Stock Value", "Volunteers", "Events", "Status"];
      const rows = branches.map(branch => [
        branch.name,
        branch.code,
        branch.city,
        branch.state,
        branch.monthlyRevenue.toString(),
        branch.monthlyExpense.toString(),
        branch.totalStockValue.toString(),
        branch.volunteerCount.toString(),
        branch.activeEvents.toString(),
        branch.status,
      ]);

      const csvContent = [
        headers.join(","),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
      ].join("\n");

      // Create blob and download
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `branches-report-${new Date().toISOString().split("T")[0]}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Report exported successfully");
    } catch (error) {
      toast.error("Failed to export report");
    } finally {
      setIsExporting(false);
    }
  };

  const statusColor = (status: string) => {
    if (status === "Active") return "text-green-700 border-green-300 bg-green-50";
    if (status === "Inactive") return "text-red-700 border-red-300 bg-red-50";
    return "text-amber-700 border-amber-300 bg-amber-50";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Branch Reports</h1>
          <p className="text-muted-foreground text-sm">Cross-branch analytics & overview</p>
        </div>
        <Button
          size="sm"
          onClick={handleExport}
          disabled={isExporting}
          className="gap-2"
        >
          <Download className="h-4 w-4" />
          {isExporting ? "Exporting..." : "Export"}
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <GitBranch className="h-5 w-5 text-primary mb-2" />
            <p className="text-2xl font-bold">{branches.length}</p>
            <p className="text-[11px] text-muted-foreground">Total Branches</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <IndianRupee className="h-5 w-5 text-green-600 mb-2" />
            <p className="text-2xl font-bold">₹{(totalRevenue / 100000).toFixed(1)}L</p>
            <p className="text-[11px] text-muted-foreground">Total Revenue</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <TrendingUp className="h-5 w-5 text-amber-600 mb-2" />
            <p className="text-2xl font-bold">₹{(totalExpense / 100000).toFixed(1)}L</p>
            <p className="text-[11px] text-muted-foreground">Total Expense</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <Users className="h-5 w-5 text-purple-600 mb-2" />
            <p className="text-2xl font-bold">{totalVolunteers}</p>
            <p className="text-[11px] text-muted-foreground">Total Volunteers</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Branch Overview</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Branch</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>City</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
                <TableHead className="text-right">Expenses</TableHead>
                <TableHead className="text-right">Stock Value</TableHead>
                <TableHead className="text-center">Volunteers</TableHead>
                <TableHead className="text-center">Events</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {branches.map(branch => {
                const net = branch.monthlyRevenue - branch.monthlyExpense;
                return (
                  <TableRow key={branch.id}>
                    <TableCell>
                      <p className="font-medium text-sm">{branch.name}</p>
                      <p className="text-xs text-muted-foreground">{branch.state}</p>
                    </TableCell>
                    <TableCell className="text-sm font-mono text-muted-foreground">{branch.code}</TableCell>
                    <TableCell className="text-sm">{branch.city}</TableCell>
                    <TableCell className="text-right text-sm text-green-600">
                      ₹{(branch.monthlyRevenue / 1000).toFixed(0)}K
                    </TableCell>
                    <TableCell className="text-right text-sm">
                      ₹{(branch.monthlyExpense / 1000).toFixed(0)}K
                    </TableCell>
                    <TableCell className="text-right text-sm">
                      ₹{(branch.totalStockValue / 1000).toFixed(0)}K
                    </TableCell>
                    <TableCell className="text-center text-sm">{branch.volunteerCount}</TableCell>
                    <TableCell className="text-center text-sm">{branch.activeEvents}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`text-xs ${statusColor(branch.status)}`}>
                        {branch.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default BranchReports;
