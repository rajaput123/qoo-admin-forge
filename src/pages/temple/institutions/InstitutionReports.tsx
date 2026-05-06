import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Upload, Building2, IndianRupee, Users, Heart } from "lucide-react";
import { institutions } from "@/data/institutionData";
import { toast } from "sonner";

const InstitutionReports = () => {
  const [isExporting, setIsExporting] = useState(false);

  const totalDonations = institutions.reduce((s, i) => s + i.monthlyDonations, 0);
  const totalExpenses = institutions.reduce((s, i) => s + i.monthlyExpense, 0);
  const totalStaff = institutions.reduce((s, i) => s + i.totalStaff, 0);
  const totalVolunteers = institutions.reduce((s, i) => s + i.volunteerCount, 0);

  const handleExport = () => {
    setIsExporting(true);
    try {
      // Prepare CSV data
      const headers = ["Name", "Type", "City", "State", "Staff", "Volunteers", "Events", "Donations", "Expenses", "Status"];
      const rows = institutions.map(inst => [
        inst.name,
        inst.type,
        inst.city,
        inst.state,
        inst.totalStaff.toString(),
        inst.volunteerCount.toString(),
        inst.activeEvents.toString(),
        inst.monthlyDonations.toString(),
        inst.monthlyExpense.toString(),
        inst.status,
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
      link.setAttribute("download", `institutions-report-${new Date().toISOString().split("T")[0]}.csv`);
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

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".csv";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const text = event.target?.result as string;
            // Simple CSV parsing - in real app, you'd send this to backend
            const lines = text.split("\n");
            const imported = lines.length - 1; // Exclude header
            toast.success(`Imported ${imported} institutions`);
          } catch (error) {
            toast.error("Failed to import file");
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
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
          <h1 className="text-2xl font-semibold tracking-tight">Institution Reports</h1>
          <p className="text-muted-foreground text-sm">Cross-institution analytics & overview</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleImport}
            className="gap-2"
          >
            <Upload className="h-4 w-4" />
            Import
          </Button>
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
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <Building2 className="h-5 w-5 text-primary mb-2" />
            <p className="text-2xl font-bold">{institutions.length}</p>
            <p className="text-[11px] text-muted-foreground">Total Institutions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <IndianRupee className="h-5 w-5 text-green-600 mb-2" />
            <p className="text-2xl font-bold">₹{(totalDonations / 100000).toFixed(1)}L</p>
            <p className="text-[11px] text-muted-foreground">Total Donations</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <Users className="h-5 w-5 text-blue-600 mb-2" />
            <p className="text-2xl font-bold">{totalStaff}</p>
            <p className="text-[11px] text-muted-foreground">Total Staff</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <Heart className="h-5 w-5 text-purple-600 mb-2" />
            <p className="text-2xl font-bold">{totalVolunteers}</p>
            <p className="text-[11px] text-muted-foreground">Total Volunteers</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Institution Overview</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Institution</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-center">Staff</TableHead>
                <TableHead className="text-center">Volunteers</TableHead>
                <TableHead className="text-center">Events</TableHead>
                <TableHead className="text-right">Donations</TableHead>
                <TableHead className="text-right">Expenses</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {institutions.map(inst => (
                <TableRow key={inst.id}>
                  <TableCell>
                    <p className="font-medium text-sm">{inst.name}</p>
                    <p className="text-xs text-muted-foreground">{inst.city}, {inst.state}</p>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">{inst.type}</Badge>
                  </TableCell>
                  <TableCell className="text-center text-sm">{inst.totalStaff}</TableCell>
                  <TableCell className="text-center text-sm">{inst.volunteerCount}</TableCell>
                  <TableCell className="text-center text-sm">{inst.activeEvents}</TableCell>
                  <TableCell className="text-right text-sm text-green-600">
                    ₹{(inst.monthlyDonations / 1000).toFixed(0)}K
                  </TableCell>
                  <TableCell className="text-right text-sm">
                    ₹{(inst.monthlyExpense / 1000).toFixed(0)}K
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-xs ${statusColor(inst.status)}`}>
                      {inst.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default InstitutionReports;
