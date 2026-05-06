import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Filter, FolderKanban } from "lucide-react";
import { Input } from "@/components/ui/input";
import PeriodFilter from "@/components/reports/PeriodFilter";
import { toast } from "sonner";

const tabs = [
  { key: "project-details", label: "Project Details", columns: ["Title", "Type", "Category", "Priority", "Status", "Start Date", "End Date", "Estimated Cost", "Donations Enabled"], rows: [
    ["New Gopuram Construction", "Construction", "Temple Infrastructure", "High", "Active", "01/03/2025", "31/12/2026", "₹1,50,00,000", "Yes"],
    ["Temple Pond Restoration", "Renovation", "Environmental", "Medium", "Active", "15/01/2025", "31/08/2025", "₹50,00,000", "Yes"],
    ["Annadanam Hall Expansion", "Infrastructure", "Community Welfare", "High", "Inactive", "01/01/2026", "30/06/2026", "₹80,00,000", "No"],
    ["Vedic Library Setup", "Infrastructure", "Education & Knowledge", "Medium", "Active", "01/04/2025", "—", "₹12,00,000", "Yes"],
    ["Boundary Wall Repair", "Renovation", "Temple Infrastructure", "Low", "Completed", "10/02/2025", "15/05/2025", "₹6,00,000", "No"],
  ]},
  { key: "funding-summary", label: "Funding Summary", columns: ["Project", "Estimated Cost", "Raised", "Spent", "Remaining", "Funding %", "Finance Account"], rows: [
    ["New Gopuram Construction", "₹1,50,00,000", "₹85,00,000", "₹32,00,000", "₹1,18,00,000", "57%", "Donation Trust Account"],
    ["Temple Pond Restoration", "₹50,00,000", "₹42,00,000", "₹28,00,000", "₹22,00,000", "84%", "Temple Main Account"],
    ["Annadanam Hall Expansion", "₹80,00,000", "₹5,00,000", "₹0", "₹80,00,000", "6%", "—"],
    ["Vedic Library Setup", "₹12,00,000", "₹8,50,000", "₹4,20,000", "₹7,80,000", "71%", "Construction Fund"],
    ["Boundary Wall Repair", "₹6,00,000", "₹6,00,000", "₹5,80,000", "₹20,000", "100%", "Temple Main Account"],
  ]},
  { key: "progress-updates", label: "Progress Updates", columns: ["Project", "Update Title", "Date", "Spent (₹)", "Notes"], rows: [
    ["Gopuram Construction", "Foundation Completed Successfully", "05/07/2025", "₹25,00,000", "Foundation work completed ahead of schedule with excellent quality."],
    ["Gopuram Construction", "First Tier Progress", "15/11/2025", "₹32,00,000", "First tier stonework and carving in progress."],
    ["Pond Restoration", "Cleaning Phase Done", "01/04/2025", "₹10,00,000", "Complete cleaning of the sacred pond finished."],
    ["Pond Restoration", "Filtration Installation Started", "10/05/2025", "₹18,00,000", "Modern filtration equipment being installed."],
    ["Boundary Wall Repair", "Wall Repair Complete", "15/05/2025", "₹5,80,000", "All boundary sections repaired and painted."],
  ]},
  { key: "donations", label: "Donation Records", columns: ["Project", "Donor", "Amount", "Date", "Payment Mode", "Anonymous"], rows: [
    ["Gopuram Construction", "Rajesh Kumar", "₹1,00,000", "15/04/2025", "Bank Transfer", "No"],
    ["Gopuram Construction", "Anonymous", "₹5,00,000", "20/05/2025", "Cheque", "Yes"],
    ["Gopuram Construction", "Sunita Patel", "₹25,000", "10/06/2025", "UPI", "No"],
    ["Pond Restoration", "Mohan Rao", "₹50,000", "10/02/2025", "Cash", "No"],
    ["Annadanam Hall", "Corporate CSR", "₹5,00,000", "01/12/2025", "Bank Transfer", "No"],
  ]},
];

const renderStatusBadge = (cell: string) => {
  if (["Completed", "Paid"].includes(cell)) return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">{cell}</Badge>;
  if (["Active", "In Progress", "Yes"].includes(cell)) return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">{cell}</Badge>;
  if (["Pending", "Inactive"].includes(cell)) return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">{cell}</Badge>;
  if (["Delayed", "Overdue"].includes(cell)) return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">{cell}</Badge>;
  if (cell === "No") return <Badge variant="outline" className="bg-muted text-muted-foreground">{cell}</Badge>;
  if (cell === "High") return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">{cell}</Badge>;
  if (cell === "Medium") return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">{cell}</Badge>;
  if (cell === "Low") return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">{cell}</Badge>;
  return cell;
};

const ProjectTables = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [period, setPeriod] = useState("month");
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "project-details";
  const tab = tabs.find(t => t.key === activeTab) || tabs[0];
  const filtered = tab.rows.filter(r => !searchTerm || r.some(c => c.toLowerCase().includes(searchTerm.toLowerCase())));

  const handleExport = () => {
    const csv = [tab.columns.join(","), ...filtered.map(r => r.map(c => `"${c}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" }); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = `${tab.key}.csv`; a.click(); URL.revokeObjectURL(url);
    toast.success(`${tab.label} exported`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FolderKanban className="h-5 w-5 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-foreground">{tab.label}</h1>
            <p className="text-sm text-muted-foreground">Project data records</p>
          </div>
        </div>
        <PeriodFilter value={period} onChange={setPeriod} />
      </div>
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-9" />
        </div>
        <Badge variant="outline">{filtered.length} of {tab.rows.length}</Badge>
        <Button variant="outline" size="sm" onClick={handleExport} className="gap-2"><Download className="h-4 w-4" />Export</Button>
      </div>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {tab.columns.map(c => <TableHead key={c} className="whitespace-nowrap font-semibold">{c}</TableHead>)}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={tab.columns.length} className="text-center text-muted-foreground py-8">No records found</TableCell>
                  </TableRow>
                ) : filtered.map((row, i) => (
                  <TableRow key={i}>
                    {row.map((cell, j) => (
                      <TableCell key={j} className="whitespace-nowrap">{renderStatusBadge(cell)}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectTables;
