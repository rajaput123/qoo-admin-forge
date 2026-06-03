import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileDown, FileBarChart, Shield, Users, IndianRupee, Calendar, CheckCircle2, Eye } from "lucide-react";
import { useDonationAudit } from "@/modules/donations/hooks";

const trusteeReports = [
  { id: "RPT-001", title: "Monthly Donation Summary – Jan 2025", type: "Monthly", period: "Jan 2025", totalAmount: "₹62.5 L", donors: 312, generated: "2025-02-01", status: "Published" },
  { id: "RPT-002", title: "Monthly Donation Summary – Dec 2024", type: "Monthly", period: "Dec 2024", totalAmount: "₹78.2 L", donors: 428, generated: "2025-01-01", status: "Published" },
  { id: "RPT-003", title: "Quarterly Review – Q3 FY25", type: "Quarterly", period: "Oct-Dec 2024", totalAmount: "₹1.91 Cr", donors: 1045, generated: "2025-01-05", status: "Published" },
  { id: "RPT-004", title: "Annual Donation Report – FY 2023-24", type: "Annual", period: "Apr 2023 - Mar 2024", totalAmount: "₹3.85 Cr", donors: 2156, generated: "2024-04-15", status: "Published" },
  { id: "RPT-005", title: "Campaign Performance – Gopuram Fund", type: "Campaign", period: "Aug 2024 - Present", totalAmount: "₹3.2 Cr", donors: 245, generated: "2025-02-05", status: "Draft" },
];

const governanceRules = [
  { rule: "Every donation ≥ ₹10,000 requires PAN linkage for 80G eligibility", category: "Compliance" },
  { rule: "Utilization must not exceed allocated amount for any donation", category: "Finance" },
  { rule: "Monthly trustee report must be published within 5 days of month end", category: "Reporting" },
  { rule: "Anonymous donations above ₹1L require Board approval", category: "Governance" },
  { rule: "Campaign funds can only be utilized against linked entity (Project/Event)", category: "Allocation" },
  { rule: "All donation records must be exportable as audit-ready documents", category: "Audit" },
];

const ReportsGovernance = () => {
  const [reportPeriod, setReportPeriod] = useState("all");
  const auditRecords = useDonationAudit();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reports & Governance</h1>
          <p className="text-sm text-muted-foreground mt-1">Trustee-level reporting, audit trail, and governance rules for donation transparency</p>
        </div>
        <Button variant="outline" size="sm"><FileDown className="h-4 w-4 mr-1" /> Export All</Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Card><CardContent className="p-4 flex items-center gap-3"><div className="p-2 rounded-lg bg-muted"><FileBarChart className="h-4 w-4 text-primary" /></div><div><p className="text-xl font-bold">{trusteeReports.length}</p><p className="text-xs text-muted-foreground">Reports Generated</p></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3"><div className="p-2 rounded-lg bg-muted"><Shield className="h-4 w-4 text-green-600" /></div><div><p className="text-xl font-bold">{auditRecords.length}</p><p className="text-xs text-muted-foreground">Audit Entries</p></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3"><div className="p-2 rounded-lg bg-muted"><CheckCircle2 className="h-4 w-4 text-primary" /></div><div><p className="text-xl font-bold">{governanceRules.length}</p><p className="text-xs text-muted-foreground">Active Rules</p></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3"><div className="p-2 rounded-lg bg-muted"><Eye className="h-4 w-4 text-amber-600" /></div><div><p className="text-xl font-bold">100%</p><p className="text-xs text-muted-foreground">Traceability Score</p></div></CardContent></Card>
      </div>

      <Tabs defaultValue="reports">
        <TabsList>
          <TabsTrigger value="reports">Trustee Reports</TabsTrigger>
          <TabsTrigger value="audit">Audit Trail</TabsTrigger>
          <TabsTrigger value="governance">Governance Rules</TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="mt-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-4">
                <Select value={reportPeriod} onValueChange={setReportPeriod}>
                  <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Reports</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="annual">Annual</SelectItem>
                    <SelectItem value="campaign">Campaign</SelectItem>
                  </SelectContent>
                </Select>
                <Button size="sm">Generate Report</Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead className="text-right">Total Amount</TableHead>
                    <TableHead className="text-right">Donors</TableHead>
                    <TableHead>Generated</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trusteeReports.filter(r => reportPeriod === "all" || r.type.toLowerCase() === reportPeriod).map(r => (
                    <TableRow key={r.id}>
                      <TableCell>
                        <div><p className="font-medium text-sm">{r.title}</p><p className="font-mono text-[10px] text-muted-foreground">{r.id}</p></div>
                      </TableCell>
                      <TableCell><Badge variant="outline" className="text-[10px]">{r.type}</Badge></TableCell>
                      <TableCell className="text-sm">{r.period}</TableCell>
                      <TableCell className="text-right font-mono font-medium">{r.totalAmount}</TableCell>
                      <TableCell className="text-right">{r.donors}</TableCell>
                      <TableCell className="text-xs">{r.generated}</TableCell>
                      <TableCell><Badge variant={r.status === "Published" ? "default" : "secondary"} className="text-[10px]">{r.status}</Badge></TableCell>
                      <TableCell><Button variant="ghost" size="sm" className="h-7 text-xs"><FileDown className="h-3 w-3 mr-1" />PDF</Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="mt-4">
          <Card>
            <CardContent className="p-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Entity</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditRecords.map(a => (
                    <TableRow key={a.id}>
                      <TableCell className="font-mono text-xs">{a.timestamp}</TableCell>
                      <TableCell><Badge variant="outline" className="text-[10px]">{a.action}</Badge></TableCell>
                      <TableCell className="font-mono text-xs">{a.entity}</TableCell>
                      <TableCell className="text-sm">{a.user}</TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-xs truncate">{a.details}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="governance" className="mt-4">
          <Card>
            <CardContent className="p-4">
              <div className="space-y-3">
                {governanceRules.map((g, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg border bg-muted/30">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm text-foreground">{g.rule}</p>
                      <Badge variant="outline" className="text-[10px] mt-1">{g.category}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsGovernance;
