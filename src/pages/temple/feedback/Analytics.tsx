import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, FileText, BarChart3, PieChart, TrendingUp, Calendar } from "lucide-react";

const summaryStats = [
  { label: "Total Feedback (YTD)", value: "2,847" },
  { label: "Response Rate", value: "89%" },
  { label: "Avg Resolution Time", value: "4.2 hrs" },
  { label: "Actionable Insights", value: "142" },
];

const monthlyReport = [
  { month: "Feb 2026", total: 487, positive: 381, negative: 38, avgRating: 4.3, responseRate: "91%", escalated: 12 },
  { month: "Jan 2026", total: 512, positive: 389, negative: 46, avgRating: 4.1, responseRate: "87%", escalated: 18 },
  { month: "Dec 2025", total: 623, positive: 492, negative: 43, avgRating: 4.2, responseRate: "85%", escalated: 15 },
  { month: "Nov 2025", total: 398, positive: 298, negative: 36, avgRating: 4.0, responseRate: "82%", escalated: 22 },
  { month: "Oct 2025", total: 421, positive: 324, negative: 42, avgRating: 4.1, responseRate: "88%", escalated: 14 },
  { month: "Sep 2025", total: 406, positive: 308, negative: 38, avgRating: 4.0, responseRate: "84%", escalated: 16 },
];

const exportReports = [
  { name: "Monthly Feedback Summary", format: "PDF", description: "Comprehensive monthly report with trends" },
  { name: "Category-wise Analysis", format: "Excel", description: "Detailed breakdown by feedback category" },
  { name: "Sentiment Trend Report", format: "PDF", description: "Sentiment analysis with keyword insights" },
  { name: "Action Items Export", format: "CSV", description: "All actionable feedback items" },
  { name: "Devotee Satisfaction Index", format: "PDF", description: "Overall satisfaction scoring" },
];

const FeedbackAnalytics = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analytics & Reports</h1>
          <p className="text-sm text-muted-foreground mt-1">Deep analytics, monthly trends, and exportable reports</p>
        </div>
        <Select defaultValue="2026">
          <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="2026">2026</SelectItem>
            <SelectItem value="2025">2025</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {summaryStats.map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Monthly Report Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2"><Calendar className="h-4 w-4" /> Monthly Report</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Month</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Positive</TableHead>
                <TableHead>Negative</TableHead>
                <TableHead>Avg Rating</TableHead>
                <TableHead>Response Rate</TableHead>
                <TableHead>Escalated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {monthlyReport.map((r) => (
                <TableRow key={r.month}>
                  <TableCell className="font-medium text-sm">{r.month}</TableCell>
                  <TableCell>{r.total}</TableCell>
                  <TableCell className="text-green-600">{r.positive}</TableCell>
                  <TableCell className="text-red-500">{r.negative}</TableCell>
                  <TableCell><Badge variant="outline" className="text-[10px]">{r.avgRating}</Badge></TableCell>
                  <TableCell>{r.responseRate}</TableCell>
                  <TableCell><Badge variant={r.escalated > 15 ? "destructive" : "outline"} className="text-[10px]">{r.escalated}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Export Reports */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2"><Download className="h-4 w-4" /> Export Reports</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {exportReports.map((report) => (
            <div key={report.name} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/30 transition-colors">
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{report.name}</p>
                  <p className="text-xs text-muted-foreground">{report.description}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="gap-1 text-xs">
                <Download className="h-3 w-3" /> {report.format}
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default FeedbackAnalytics;
