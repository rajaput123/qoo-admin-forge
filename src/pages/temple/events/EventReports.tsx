import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, BarChart3 } from "lucide-react";
import { eventExpenses, eventSevas, getEventTasks, getEventFreelancers, getEventVolunteers, getEventMaterials } from "@/data/eventData";
import { useEvents } from "@/modules/events/hooks";
import { useNavigate } from "react-router-dom";

const EventReports = () => {
  const navigate = useNavigate();
  const events = useEvents();
  const activeEvents = events;

  const eventSummaries = activeEvents.map(event => {
    const expenses = eventExpenses.filter(e => e.eventId === event.id);
    const sevas = eventSevas.filter(s => s.eventId === event.id);
    const tasks = getEventTasks(event.id);
    const freelancers = getEventFreelancers(event.id);
    const volunteers = getEventVolunteers(event.id);
    const materials = getEventMaterials(event.id);
    const totalSpend = expenses.reduce((a, e) => a + e.amount, 0);
    const shortages = materials.filter(m => m.allocatedQty < m.requiredQty).length;
    const openTasks = tasks.filter(t => t.status === "Open" || t.status === "In Progress" || t.status === "Overdue").length;

    return { ...event, totalSpend, sevaCount: sevas.length, taskCount: tasks.length, openTasks, freelancerCount: freelancers.length, volunteerCount: volunteers.reduce((a, v) => a + v.count, 0), shortages };
  });

  const totalBudget = activeEvents.reduce((a, e) => a + e.estimatedBudget, 0);
  const totalSpend = eventSummaries.reduce((a, e) => a + e.totalSpend, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Event Reports</h1>
          <p className="text-sm text-muted-foreground mt-1">Cross-event analytics and governance reports</p>
        </div>
        <Button variant="outline"><Download className="h-4 w-4 mr-2" />Export Report</Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Total Events</p><p className="text-2xl font-bold">{activeEvents.length}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Total Budget</p><p className="text-2xl font-bold">₹{(totalBudget / 100000).toFixed(1)}L</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Total Spend</p><p className="text-2xl font-bold">₹{(totalSpend / 100000).toFixed(1)}L</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Budget Utilization</p><p className="text-2xl font-bold">{totalBudget > 0 ? ((totalSpend / totalBudget) * 100).toFixed(0) : 0}%</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Event-wise Summary</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Budget</TableHead>
                <TableHead className="text-right">Spend</TableHead>
                <TableHead className="text-center">Sevas</TableHead>
                <TableHead className="text-center">Tasks</TableHead>
                <TableHead className="text-center">Freelancers</TableHead>
                <TableHead className="text-center">Volunteers</TableHead>
                <TableHead className="text-center">Shortages</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {eventSummaries.map(e => (
                <TableRow key={e.id} className="cursor-pointer hover:bg-muted/50" onClick={() => navigate(`/temple/events/${e.id}`)}>
                  <TableCell className="font-medium">{e.name}</TableCell>
                  <TableCell><Badge variant="outline" className="text-xs">{e.type}</Badge></TableCell>
                  <TableCell><Badge className={`text-xs border-0 ${
                    e.status === "Ongoing" ? "bg-green-100 text-green-700" :
                    e.status === "Published" ? "bg-blue-100 text-blue-700" :
                    e.status === "Completed" ? "bg-amber-100 text-amber-700" :
                    "bg-muted text-muted-foreground"
                  }`}>{e.status}</Badge></TableCell>
                  <TableCell className="text-right">₹{(e.estimatedBudget / 100000).toFixed(1)}L</TableCell>
                  <TableCell className="text-right">₹{(e.totalSpend / 100000).toFixed(1)}L</TableCell>
                  <TableCell className="text-center">{e.sevaCount}</TableCell>
                  <TableCell className="text-center">{e.taskCount} <span className="text-xs text-muted-foreground">({e.openTasks} open)</span></TableCell>
                  <TableCell className="text-center">{e.freelancerCount}</TableCell>
                  <TableCell className="text-center">{e.volunteerCount}</TableCell>
                  <TableCell className="text-center">
                    {e.shortages > 0 ? <Badge className="bg-amber-100 text-amber-700 border-0 text-xs">{e.shortages}</Badge> : <span className="text-green-600 text-xs">✓</span>}
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

export default EventReports;
