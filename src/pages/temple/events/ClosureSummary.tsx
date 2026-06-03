import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { FileCheck, Download, Lock, Users, UtensilsCrossed, Package, Boxes, Heart, UserCheck, AlertTriangle, BarChart3, IndianRupee } from "lucide-react";

const summaryMetrics = [
  { icon: Users, label: "Actual Footfall", value: "6,82,000", sub: "10 days total", color: "text-blue-600" },
  { icon: BarChart3, label: "Total Seva Bookings", value: "1,24,500", sub: "Online + Counter", color: "text-primary" },
  { icon: UtensilsCrossed, label: "Prasadam Produced", value: "4,50,000", sub: "All varieties", color: "text-green-600" },
  { icon: Package, label: "Total Distributed", value: "4,38,200", sub: "98% utilization", color: "text-green-600" },
  { icon: UtensilsCrossed, label: "Annadanam Count", value: "5,25,000", sub: "Free meals served", color: "text-amber-600" },
  { icon: Boxes, label: "Inventory Consumed", value: "₹28.5L", sub: "Against ₹30L budget", color: "text-blue-600" },
  { icon: AlertTriangle, label: "Wastage", value: "2.6%", sub: "Below 3% target", color: "text-green-600" },
  { icon: IndianRupee, label: "Donations Linked", value: "₹1.85 Cr", sub: "142 sponsors", color: "text-primary" },
  { icon: UserCheck, label: "Volunteer Count", value: "255", sub: "84% avg attendance", color: "text-blue-600" },
  { icon: Heart, label: "Sponsorships", value: "142", sub: "Linked to event", color: "text-pink-600" },
];

const incidentSummary = [
  { type: "Crowd", total: 8, resolved: 8, severity: "5 Medium, 3 Low" },
  { type: "Medical", total: 12, resolved: 12, severity: "2 High, 6 Medium, 4 Low" },
  { type: "Logistics", total: 5, resolved: 4, severity: "1 Medium, 4 Low" },
  { type: "Security", total: 2, resolved: 2, severity: "1 High, 1 Medium" },
];

const dayWiseFootfall = [
  { day: "Day 1 - Mar 15", footfall: "55,000", sevas: "9,800", prasadam: "38,000", annadanam: "42,000" },
  { day: "Day 2 - Mar 16", footfall: "62,000", sevas: "11,200", prasadam: "42,500", annadanam: "48,000" },
  { day: "Day 3 - Mar 17", footfall: "58,000", sevas: "10,500", prasadam: "40,000", annadanam: "45,000" },
  { day: "Day 4 - Mar 18", footfall: "65,000", sevas: "12,000", prasadam: "44,000", annadanam: "52,000" },
  { day: "Day 5 - Mar 19", footfall: "72,000", sevas: "13,500", prasadam: "48,000", annadanam: "58,000" },
  { day: "Day 6 - Mar 20", footfall: "68,000", sevas: "12,800", prasadam: "45,000", annadanam: "55,000" },
  { day: "Day 7 - Mar 21", footfall: "70,000", sevas: "13,200", prasadam: "47,000", annadanam: "56,000" },
  { day: "Day 8 - Mar 22", footfall: "75,000", sevas: "14,000", prasadam: "50,000", annadanam: "60,000" },
  { day: "Day 9 - Mar 23", footfall: "82,000", sevas: "14,800", prasadam: "52,000", annadanam: "62,000" },
  { day: "Day 10 - Mar 24", footfall: "75,000", sevas: "12,700", prasadam: "44,700", annadanam: "47,000" },
];

const ClosureSummary = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Closure & Summary</h1>
          <p className="text-sm text-muted-foreground mt-1">Post-event governance report — auto-generated</p>
        </div>
        <div className="flex items-center gap-2">
          <Select>
            <SelectTrigger className="w-56">
              <SelectValue placeholder="Select Event" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="evt-005">EVT-005 — New Year Abhishekam (Closed)</SelectItem>
              <SelectItem value="evt-001">EVT-001 — Brahmotsavam 2025 (Closed)</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline"><Download className="h-4 w-4 mr-2" />Export PDF</Button>
        </div>
      </div>

      {/* Event Status Banner */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Lock className="h-5 w-5 text-green-700" />
            <div>
              <p className="text-sm font-medium text-green-800">Event Closed — Read Only</p>
              <p className="text-xs text-green-600">Brahmotsavam 2025 | Mar 15–24, 2025 | 10 Days | Admin override required for changes</p>
            </div>
          </div>
          <Badge className="bg-green-100 text-green-700 border-0">Closed</Badge>
        </CardContent>
      </Card>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-5 gap-4">
        {summaryMetrics.map((m, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <m.icon className={`h-5 w-5 ${m.color} mb-2`} />
              <p className="text-xs text-muted-foreground">{m.label}</p>
              <p className="text-xl font-bold text-foreground">{m.value}</p>
              <p className="text-xs text-muted-foreground">{m.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Day-wise Breakdown */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Day-wise Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Day</TableHead>
                <TableHead>Footfall</TableHead>
                <TableHead>Seva Bookings</TableHead>
                <TableHead>Prasadam Distributed</TableHead>
                <TableHead>Annadanam Meals</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dayWiseFootfall.map((d, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium text-sm">{d.day}</TableCell>
                  <TableCell>{d.footfall}</TableCell>
                  <TableCell>{d.sevas}</TableCell>
                  <TableCell>{d.prasadam}</TableCell>
                  <TableCell>{d.annadanam}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Incident Summary */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Incident Summary</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Total Incidents</TableHead>
                <TableHead>Resolved</TableHead>
                <TableHead>Unresolved</TableHead>
                <TableHead>Severity Breakdown</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {incidentSummary.map((inc, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{inc.type}</TableCell>
                  <TableCell>{inc.total}</TableCell>
                  <TableCell className="text-green-600">{inc.resolved}</TableCell>
                  <TableCell className={inc.total - inc.resolved > 0 ? "text-amber-600 font-medium" : ""}>
                    {inc.total - inc.resolved}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{inc.severity}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClosureSummary;
