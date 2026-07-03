import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, FileDown, IndianRupee, CheckCircle2, Clock } from "lucide-react";

const stats = [
  { label: "Total Donations Mapped", value: "₹8.2 Cr", icon: Heart, color: "text-pink-600" },
  { label: "Utilized", value: "₹5.1 Cr", icon: IndianRupee, color: "text-green-600" },
  { label: "Fully Utilized", value: "14", icon: CheckCircle2, color: "text-primary" },
  { label: "Pending Reports", value: "5", icon: Clock, color: "text-amber-600" },
];

const donations = [
  { id: "DON-2024-001", donor: "Sri Ramesh Agarwal", amount: 5000000, allocated: 5000000, project: "Gopuram Renovation", utilization: 82, reportGenerated: true, status: "In Use" },
  { id: "DON-2024-002", donor: "Smt. Padma Foundation", amount: 10000000, allocated: 10000000, project: "New Annadanam Hall", utilization: 28, reportGenerated: false, status: "In Use" },
  { id: "DON-2024-003", donor: "Sri Venkatesh Trust", amount: 2500000, allocated: 2500000, project: "Gopuram Renovation", utilization: 100, reportGenerated: true, status: "Fully Utilized" },
  { id: "DON-2024-004", donor: "Sri Karthik Reddy", amount: 1500000, allocated: 1200000, project: "Digital Darshan System", utilization: 65, reportGenerated: false, status: "In Use" },
  { id: "DON-2024-005", donor: "Village Dev Committee", amount: 500000, allocated: 500000, project: "Village Outreach", utilization: 72, reportGenerated: true, status: "In Use" },
  { id: "DON-2024-006", donor: "Anonymous", amount: 3000000, allocated: 3000000, project: "Gopuram Renovation", utilization: 45, reportGenerated: false, status: "In Use" },
];

const formatCurrency = (val: number) => {
  if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)} Cr`;
  if (val >= 100000) return `₹${(val / 100000).toFixed(1)} L`;
  return `₹${val.toLocaleString()}`;
};

const DonationMapping = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Donation Mapping</h1>
          <p className="text-sm text-muted-foreground mt-1">Trace donor funds to specific projects for full transparency</p>
        </div>
        <Button variant="outline" size="sm" className="gap-2"><FileDown className="h-4 w-4" /> Export Donor Report</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(s => (
          <Card key={s.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-muted ${s.color}`}><s.icon className="h-5 w-5" /></div>
              <div>
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Donation ID</TableHead>
                <TableHead>Donor</TableHead>
                <TableHead>Project</TableHead>
                <TableHead className="text-right">Donation</TableHead>
                <TableHead className="text-right">Allocated</TableHead>
                <TableHead>Utilization</TableHead>
                <TableHead>Report</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {donations.map(d => (
                <TableRow key={d.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell className="font-mono text-xs">{d.id}</TableCell>
                  <TableCell className="font-medium text-sm">{d.donor}</TableCell>
                  <TableCell className="text-sm">{d.project}</TableCell>
                  <TableCell className="text-right font-mono text-sm">{formatCurrency(d.amount)}</TableCell>
                  <TableCell className="text-right font-mono text-sm">{formatCurrency(d.allocated)}</TableCell>
                  <TableCell>
                    <div className="w-24">
                      <div className="flex justify-between text-xs mb-1">
                        <span className={d.utilization >= 80 ? "text-green-600" : "text-muted-foreground"}>{d.utilization}%</span>
                      </div>
                      <Progress value={d.utilization} className="h-1.5" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={d.reportGenerated ? "default" : "outline"} className="text-[10px]">
                      {d.reportGenerated ? "Generated" : "Pending"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={d.status === "Fully Utilized" ? "default" : "secondary"} className="text-[10px]">{d.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-base">Donor Transparency Rules</CardTitle></CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4 text-sm text-muted-foreground">
            <div className="p-3 rounded-lg bg-muted/30 border">
              <p className="font-medium text-foreground mb-1">Traceability</p>
              <p>Every donation linked to a project must have a clear utilization trail from receipt to expenditure.</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/30 border">
              <p className="font-medium text-foreground mb-1">Reporting</p>
              <p>Donor utilization reports must be generated within 30 days of project milestone completion.</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/30 border">
              <p className="font-medium text-foreground mb-1">Export</p>
              <p>All donation mappings must be exportable as audit-ready documents for trustee review.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DonationMapping;
