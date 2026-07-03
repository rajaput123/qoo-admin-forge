import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, IndianRupee, Eye } from "lucide-react";
import { eventExpenses } from "@/data/eventData";
import SelectWithAddNew from "@/components/SelectWithAddNew";
import { useEvents } from "@/modules/events/hooks";
import { Button } from "@/components/ui/button";

const statusColors: Record<string, string> = {
  Paid: "bg-green-100 text-green-700",
  Approved: "bg-blue-100 text-blue-700",
  Pending: "bg-amber-100 text-amber-700",
  Rejected: "bg-red-100 text-red-700",
};

const EventExpenses = () => {
  const navigate = useNavigate();
  const events = useEvents();
  const [search, setSearch] = useState("");
  const [eventFilter, setEventFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const filtered = eventExpenses.filter(e => {
    if (search && !e.description.toLowerCase().includes(search.toLowerCase()) && !e.id.toLowerCase().includes(search.toLowerCase())) return false;
    if (eventFilter && eventFilter !== "All Events" && e.eventId !== eventFilter) return false;
    if (categoryFilter && categoryFilter !== "All Categories" && e.category !== categoryFilter) return false;
    return true;
  });

  const totalPaid = filtered.filter(e => e.status === "Paid").reduce((a, e) => a + e.amount, 0);
  const totalPending = filtered.filter(e => e.status === "Pending" || e.status === "Approved").reduce((a, e) => a + e.amount, 0);
  const totalAll = filtered.reduce((a, e) => a + e.amount, 0);

  const eventOptions = ["All Events", ...events.map(e => e.id)];
  const categoryOptions = ["All Categories", "Freelancer Payment", "Material Cost", "Kitchen Cost", "Decoration", "Sound & Lighting", "Transportation", "Miscellaneous"];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Event Expenses</h1>
        <p className="text-sm text-muted-foreground mt-1">Global expense tracking across all events</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Total Expenses</p><p className="text-2xl font-bold">₹{(totalAll / 100000).toFixed(1)}L</p><p className="text-xs text-muted-foreground">{filtered.length} records</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Paid</p><p className="text-2xl font-bold text-green-600">₹{(totalPaid / 100000).toFixed(1)}L</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Pending / Approved</p><p className="text-2xl font-bold text-amber-600">₹{(totalPending / 100000).toFixed(1)}L</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">All Event Expenses</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search expenses..." className="pl-9 h-9 w-56" value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <SelectWithAddNew value={eventFilter} onValueChange={setEventFilter} placeholder="All Events" options={eventOptions} onAddNew={() => {}} className="h-9 w-40" />
              <SelectWithAddNew value={categoryFilter} onValueChange={setCategoryFilter} placeholder="All Categories" options={categoryOptions} onAddNew={() => {}} className="h-9 w-44" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">View</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(e => (
                <TableRow key={e.id}>
                  <TableCell className="text-sm font-medium">{e.eventName}</TableCell>
                  <TableCell><Badge variant="outline" className="text-xs">{e.category}</Badge></TableCell>
                  <TableCell className="text-sm max-w-[200px] truncate">{e.description}</TableCell>
                  <TableCell className="text-sm">{e.vendor}</TableCell>
                  <TableCell className="text-right font-medium">₹{e.amount.toLocaleString()}</TableCell>
                  <TableCell className="text-sm">{e.date}</TableCell>
                  <TableCell><Badge className={`text-xs border-0 ${statusColors[e.status]}`}>{e.status}</Badge></TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate(`/temple/events/${e.eventId}`)}>
                      <Eye className="h-4 w-4" />
                    </Button>
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

export default EventExpenses;
