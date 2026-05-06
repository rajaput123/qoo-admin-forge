import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileBarChart, FileDown, Calendar, Eye, Printer, FileText, Heart, ShieldCheck, TrendingUp } from "lucide-react";

const reports = [
  { name: "Project Status Summary", description: "Overview of all active projects with progress and risk indicators", category: "Operations", lastGenerated: "2026-02-09", format: "PDF" },
  { name: "Budget vs Expense Report", description: "Detailed financial comparison across all projects", category: "Financial", lastGenerated: "2026-02-09", format: "Excel" },
  { name: "Donation Utilization Report", description: "Donor-wise fund utilization and traceability", category: "Transparency", lastGenerated: "2026-02-01", format: "PDF" },
  { name: "Milestone Completion Report", description: "Phase-wise milestone progress with locked status", category: "Operations", lastGenerated: "2026-02-05", format: "PDF" },
  { name: "Risk Summary", description: "Active risks, severity distribution, and mitigation status", category: "Governance", lastGenerated: "2026-02-07", format: "PDF" },
  { name: "Annual Development Overview", description: "Year-end comprehensive development and initiative report", category: "Governance", lastGenerated: "2025-12-31", format: "PDF" },
];

const exports = [
  { name: "Trustee Summary Report", description: "Board-level overview for trustee meetings", icon: FileText, audience: "Board of Trustees" },
  { name: "Donor Transparency Report", description: "Individual donor utilization statements", icon: Heart, audience: "Donors" },
  { name: "Audit-Ready Financial Summary", description: "Comprehensive financial trail for audit compliance", icon: ShieldCheck, audience: "Auditors" },
];

const categoryColors: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  Operations: "default",
  Financial: "secondary",
  Transparency: "outline",
  Governance: "secondary",
};

const ReportsGovernance = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reports & Governance Export</h1>
          <p className="text-sm text-muted-foreground mt-1">Generate and export audit-ready governance reports</p>
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Reports</SelectItem>
            <SelectItem value="operations">Operations</SelectItem>
            <SelectItem value="financial">Financial</SelectItem>
            <SelectItem value="governance">Governance</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Standard Reports */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <FileBarChart className="h-4 w-4" /> Available Reports
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Report</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Last Generated</TableHead>
                <TableHead>Format</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map(r => (
                <TableRow key={r.name} className="hover:bg-muted/50">
                  <TableCell>
                    <div>
                      <p className="font-medium text-sm">{r.name}</p>
                      <p className="text-xs text-muted-foreground">{r.description}</p>
                    </div>
                  </TableCell>
                  <TableCell><Badge variant={categoryColors[r.category]} className="text-[10px]">{r.category}</Badge></TableCell>
                  <TableCell className="text-sm text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> {r.lastGenerated}
                  </TableCell>
                  <TableCell><Badge variant="outline" className="text-[10px]">{r.format}</Badge></TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="sm" variant="outline" className="h-7 text-xs gap-1"><Eye className="h-3 w-3" /> View</Button>
                      <Button size="sm" variant="outline" className="h-7 text-xs gap-1"><FileDown className="h-3 w-3" /> Export</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Governance Exports */}
      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-base">Governance Export Templates</CardTitle></CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {exports.map(e => (
              <div key={e.name} className="p-4 rounded-lg border hover:border-primary/30 transition-colors cursor-pointer">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 rounded-lg bg-muted"><e.icon className="h-4 w-4 text-primary" /></div>
                  <div>
                    <p className="font-medium text-sm">{e.name}</p>
                    <p className="text-[10px] text-muted-foreground">For: {e.audience}</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mb-3">{e.description}</p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="h-7 text-xs flex-1 gap-1"><FileDown className="h-3 w-3" /> Generate</Button>
                  <Button size="sm" variant="outline" className="h-7 text-xs gap-1"><Printer className="h-3 w-3" /></Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsGovernance;
