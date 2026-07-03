import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Filter, MessageSquare } from "lucide-react";
import { Input } from "@/components/ui/input";
import PeriodFilter from "@/components/reports/PeriodFilter";
import { toast } from "sonner";

const tabs = [
  { key: "feedback", label: "Feedback Records", columns: ["Date", "Devotee", "Category", "Rating", "Sentiment", "Comment", "Status"], rows: [
    ["2024-03-15", "Ramesh K.", "Cleanliness", "5/5", "Positive", "Very well maintained", "Reviewed"],
    ["2024-03-14", "Lakshmi D.", "Service", "4/5", "Positive", "Good pooja arrangements", "Reviewed"],
    ["2024-03-13", "Suresh P.", "Queue", "2/5", "Negative", "Long waiting time", "Action Taken"],
    ["2024-03-12", "Anita S.", "Prasadam", "5/5", "Positive", "Excellent quality", "Reviewed"],
    ["2024-03-11", "Vijay R.", "Parking", "3/5", "Neutral", "Needs improvement", "Pending"],
  ]},
  { key: "escalations", label: "Escalations", columns: ["Date", "Devotee", "Category", "Issue", "Assigned To", "Resolution", "Status"], rows: [
    ["2024-03-13", "Suresh P.", "Queue", "2hr wait in VIP line", "Queue Manager", "Added more counters", "Resolved"],
    ["2024-03-10", "Mohan L.", "Safety", "Slippery floor near shrine", "Maintenance", "Anti-slip mats installed", "Resolved"],
    ["2024-03-08", "Anita D.", "Staff", "Rude behavior at counter", "HR Manager", "Under review", "Pending"],
  ]},
  { key: "surveys", label: "Survey Responses", columns: ["Survey Name", "Respondents", "Avg Rating", "Completion Rate", "Period", "Status"], rows: [
    ["Q1 Devotee Satisfaction", "450", "4.3/5", "78%", "Jan-Mar 2024", "Active"],
    ["Festival Experience", "280", "4.6/5", "92%", "Shivaratri 2024", "Completed"],
    ["Staff Feedback", "38", "3.8/5", "84%", "Mar 2024", "Active"],
  ]},
];

const renderStatusBadge = (cell: string) => {
  if (["Reviewed", "Resolved", "Completed", "Positive"].includes(cell)) return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">{cell}</Badge>;
  if (["Pending", "Active", "Neutral", "Action Taken"].includes(cell)) return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">{cell}</Badge>;
  if (["Negative"].includes(cell)) return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">{cell}</Badge>;
  return cell;
};

const FeedbackTables = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [period, setPeriod] = useState("month");
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "feedback";
  const tab = tabs.find(t => t.key === activeTab) || tabs[0];
  const filtered = tab.rows.filter(r => !searchTerm || r.some(c => c.toLowerCase().includes(searchTerm.toLowerCase())));

  const handleExport = () => {
    const csv = [tab.columns.join(","), ...filtered.map(r => r.map(c => `"${c}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" }); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = `${tab.key}.csv`; a.click(); URL.revokeObjectURL(url);
    toast.success(`${tab.label} exported`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between"><div className="flex items-center gap-2"><MessageSquare className="h-5 w-5 text-primary" /><div><h1 className="text-2xl font-bold text-foreground">{tab.label}</h1><p className="text-sm text-muted-foreground">Feedback data records</p></div></div><PeriodFilter value={period} onChange={setPeriod} /></div>
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm"><Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-9" /></div>
        <Badge variant="outline">{filtered.length} of {tab.rows.length}</Badge>
        <Button variant="outline" size="sm" onClick={handleExport} className="gap-2"><Download className="h-4 w-4" />Export</Button>
      </div>
      <Card><CardContent className="p-0"><div className="overflow-x-auto">
        <Table><TableHeader><TableRow>{tab.columns.map(c => <TableHead key={c} className="whitespace-nowrap font-semibold">{c}</TableHead>)}</TableRow></TableHeader>
        <TableBody>{filtered.map((row, i) => <TableRow key={i}>{row.map((cell, j) => <TableCell key={j} className="whitespace-nowrap">{renderStatusBadge(cell)}</TableCell>)}</TableRow>)}</TableBody></Table>
      </div></CardContent></Card>
    </div>
  );
};

export default FeedbackTables;
