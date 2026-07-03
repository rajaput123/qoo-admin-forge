import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, Plus, Search, Filter, Eye, Pencil, Copy, Trash2 } from "lucide-react";

const mockEvents = [
  { id: "EVT-001", name: "Brahmotsavam 2025", type: "Festival", structure: "Main Temple", start: "2025-03-15", end: "2025-03-24", footfall: "75,000", status: "Approved", multiDay: true },
  { id: "EVT-002", name: "Vaikuntha Ekadasi", type: "Special Ritual", structure: "Main Temple", start: "2025-01-10", end: "2025-01-10", footfall: "1,00,000", status: "Active", multiDay: false },
  { id: "EVT-003", name: "Annual Annadanam Drive", type: "Annadanam", structure: "Annadanam Hall", start: "2025-04-01", end: "2025-04-03", footfall: "50,000", status: "Draft", multiDay: true },
  { id: "EVT-004", name: "Classical Music Festival", type: "Cultural", structure: "Cultural Hall", start: "2025-02-20", end: "2025-02-22", footfall: "5,000", status: "Planned", multiDay: true },
  { id: "EVT-005", name: "New Year Special Abhishekam", type: "Special Ritual", structure: "Shrine - Lord Ganesha", start: "2025-01-01", end: "2025-01-01", footfall: "30,000", status: "Closed", multiDay: false },
];

const statusColors: Record<string, string> = {
  Draft: "bg-muted text-muted-foreground",
  Planned: "bg-blue-100 text-blue-700",
  Approved: "bg-amber-100 text-amber-700",
  Active: "bg-green-100 text-green-700",
  Closed: "bg-gray-200 text-gray-600",
};

const EventSetup = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);

  const stats = [
    { label: "Total Events", value: "23", sub: "This year" },
    { label: "Active Now", value: "2", sub: "In execution" },
    { label: "Upcoming", value: "5", sub: "Next 30 days" },
    { label: "Avg. Footfall", value: "58K", sub: "Per event" },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Event Setup</h1>
          <p className="text-sm text-muted-foreground mt-1">Create, configure, and manage temple events</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />Create Event</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Event</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <Label>Event Name</Label>
                <Input placeholder="e.g. Brahmotsavam 2025" />
              </div>
              <div className="space-y-2">
                <Label>Event Type</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="festival">Festival</SelectItem>
                    <SelectItem value="special-ritual">Special Ritual</SelectItem>
                    <SelectItem value="cultural">Cultural</SelectItem>
                    <SelectItem value="annadanam">Annadanam</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Structure</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select structure" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="main">Main Temple</SelectItem>
                    <SelectItem value="shrine-ganesha">Shrine - Lord Ganesha</SelectItem>
                    <SelectItem value="hall-cultural">Cultural Hall</SelectItem>
                    <SelectItem value="hall-annadanam">Annadanam Hall</SelectItem>
                    <SelectItem value="campus">Campus</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Multi-Day Event</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input type="date" />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input type="date" />
              </div>
              <div className="space-y-2">
                <Label>Expected Daily Footfall</Label>
                <Input type="number" placeholder="e.g. 50000" />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Draft" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="planned">Planned</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 space-y-2">
                <Label>Description</Label>
                <Textarea placeholder="Event description and objectives..." rows={3} />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={() => setDialogOpen(false)}>Create Event</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">{s.label}</p>
              <p className="text-2xl font-bold text-foreground mt-1">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters & Table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">All Events</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search events..." className="pl-9 h-9 w-64" />
              </div>
              <Select>
                <SelectTrigger className="h-9 w-36"><SelectValue placeholder="All Types" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="festival">Festival</SelectItem>
                  <SelectItem value="special-ritual">Special Ritual</SelectItem>
                  <SelectItem value="cultural">Cultural</SelectItem>
                  <SelectItem value="annadanam">Annadanam</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="h-9 w-36"><SelectValue placeholder="All Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="planned">Planned</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event ID</TableHead>
                <TableHead>Event Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Structure</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Est. Footfall</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockEvents.map((event) => (
                <TableRow key={event.id}>
                  <TableCell className="font-mono text-xs">{event.id}</TableCell>
                  <TableCell className="font-medium">{event.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">{event.type}</Badge>
                  </TableCell>
                  <TableCell className="text-sm">{event.structure}</TableCell>
                  <TableCell className="text-sm">
                    {event.multiDay ? `${event.start} → ${event.end}` : event.start}
                  </TableCell>
                  <TableCell className="text-sm">{event.footfall}/day</TableCell>
                  <TableCell>
                    <Badge className={`${statusColors[event.status]} border-0 text-xs`}>{event.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8"><Eye className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8"><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8"><Copy className="h-4 w-4" /></Button>
                    </div>
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

export default EventSetup;
