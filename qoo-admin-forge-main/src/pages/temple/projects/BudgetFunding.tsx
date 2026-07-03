import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wallet, TrendingUp, AlertTriangle, IndianRupee, ArrowUpRight, ArrowDownRight } from "lucide-react";

const stats = [
  { label: "Total Approved Budget", value: "₹18.5 Cr", icon: Wallet, color: "text-primary" },
  { label: "Allocated", value: "₹15.2 Cr", icon: TrendingUp, color: "text-blue-600" },
  { label: "Actual Expense", value: "₹10.8 Cr", icon: IndianRupee, color: "text-green-600" },
  { label: "Over-Budget Projects", value: "2", icon: AlertTriangle, color: "text-red-600" },
];

const budgets = [
  { project: "Gopuram Renovation", approved: 420, allocated: 380, actual: 302, capex: 85, opex: 15, source: "Specific Donation", utilization: 72, variance: -5 },
  { project: "New Annadanam Hall", approved: 680, allocated: 550, actual: 190, capex: 90, opex: 10, source: "General Fund", utilization: 28, variance: 2 },
  { project: "Digital Darshan System", approved: 120, allocated: 120, actual: 94, capex: 70, opex: 30, source: "Sponsor", utilization: 78, variance: -3 },
  { project: "Parking Expansion", approved: 250, allocated: 100, actual: 30, capex: 95, opex: 5, source: "General Fund", utilization: 12, variance: 0 },
  { project: "Village Outreach", approved: 45, allocated: 45, actual: 27, capex: 20, opex: 80, source: "Specific Donation", utilization: 60, variance: 8 },
  { project: "Heritage Museum", approved: 200, allocated: 50, actual: 5, capex: 80, opex: 20, source: "General Fund", utilization: 3, variance: 0 },
];

const BudgetFunding = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Budget & Funding Control</h1>
          <p className="text-sm text-muted-foreground mt-1">Track budget allocation, expenses, and variance across projects</p>
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Projects</SelectItem>
            <SelectItem value="active">Active Only</SelectItem>
            <SelectItem value="overbudget">Over-Budget</SelectItem>
          </SelectContent>
        </Select>
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
                <TableHead>Project</TableHead>
                <TableHead className="text-right">Approved (₹L)</TableHead>
                <TableHead className="text-right">Allocated (₹L)</TableHead>
                <TableHead className="text-right">Actual (₹L)</TableHead>
                <TableHead>CapEx/OpEx</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Utilization</TableHead>
                <TableHead>Variance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {budgets.map(b => (
                <TableRow key={b.project} className="cursor-pointer hover:bg-muted/50">
                  <TableCell className="font-medium">{b.project}</TableCell>
                  <TableCell className="text-right font-mono">{b.approved}</TableCell>
                  <TableCell className="text-right font-mono">{b.allocated}</TableCell>
                  <TableCell className="text-right font-mono">{b.actual}</TableCell>
                  <TableCell>
                    <div className="text-xs">
                      <span className="text-muted-foreground">{b.capex}% / {b.opex}%</span>
                    </div>
                  </TableCell>
                  <TableCell><Badge variant="outline" className="text-[10px]">{b.source}</Badge></TableCell>
                  <TableCell>
                    <div className="w-24">
                      <div className="flex justify-between text-xs mb-1">
                        <span className={b.utilization >= 80 ? "text-amber-600" : "text-muted-foreground"}>{b.utilization}%</span>
                      </div>
                      <Progress value={b.utilization} className="h-1.5" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {b.variance > 0 ? (
                        <><ArrowUpRight className="h-3.5 w-3.5 text-red-600" /><span className="text-xs text-red-600">+{b.variance}%</span></>
                      ) : b.variance < 0 ? (
                        <><ArrowDownRight className="h-3.5 w-3.5 text-green-600" /><span className="text-xs text-green-600">{b.variance}%</span></>
                      ) : (
                        <span className="text-xs text-muted-foreground">0%</span>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-base">Budget Alerts</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {[
              { msg: "Village Outreach: Expense exceeds allocation by 8%", level: "warning" },
              { msg: "Gopuram Renovation: 72% budget utilized — approaching 80% threshold", level: "info" },
              { msg: "Digital Darshan: Budget revision pending approval", level: "info" },
            ].map((a, i) => (
              <div key={i} className={`p-3 rounded-lg border text-sm flex items-center gap-2 ${a.level === "warning" ? "border-amber-200 bg-amber-50 text-amber-800" : "border-blue-200 bg-blue-50 text-blue-800"}`}>
                <AlertTriangle className="h-4 w-4 shrink-0" />
                {a.msg}
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-base">Funding Sources Summary</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {[
              { source: "General Fund", amount: "₹11.3 Cr", projects: 3 },
              { source: "Specific Donations", amount: "₹4.65 Cr", projects: 2 },
              { source: "Sponsors", amount: "₹1.2 Cr", projects: 1 },
            ].map(f => (
              <div key={f.source} className="flex items-center justify-between p-2 rounded hover:bg-muted/30">
                <span className="text-sm">{f.source}</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-mono">{f.amount}</span>
                  <Badge variant="outline" className="text-xs">{f.projects} projects</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BudgetFunding;
