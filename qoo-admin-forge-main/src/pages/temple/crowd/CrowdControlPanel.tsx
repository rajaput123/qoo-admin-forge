import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DoorClosed, DoorOpen, Route, Bell, Users2, Pause, Siren, Clock, CheckCircle2, XCircle, History, LayoutDashboard, Bell as BellIcon } from "lucide-react";
import { toast } from "sonner";

interface ActionHistory {
  id: string;
  action: string;
  zone?: string;
  status: "success" | "pending" | "failed";
  timestamp: string;
  performedBy: string;
  notes?: string;
}

const actionHistory: ActionHistory[] = [
  {
    id: "ACT-001",
    action: "Close Entry Gate",
    zone: "Main Entrance",
    status: "success",
    timestamp: "2024-01-15 15:45:23",
    performedBy: "Admin User",
    notes: "Gate closed due to 95% occupancy",
  },
  {
    id: "ACT-002",
    action: "Redirect Crowd",
    zone: "Queue Corridor A",
    status: "success",
    timestamp: "2024-01-15 15:30:10",
    performedBy: "Control Operator",
    notes: "Redirected to East Courtyard",
  },
  {
    id: "ACT-003",
    action: "Broadcast Announcement",
    zone: "All Zones",
    status: "success",
    timestamp: "2024-01-15 15:20:45",
    performedBy: "Admin User",
    notes: "Please maintain orderly flow",
  },
  {
    id: "ACT-004",
    action: "Call Volunteers",
    zone: "Prasadam Hall",
    status: "pending",
    timestamp: "2024-01-15 15:15:30",
    performedBy: "Control Operator",
    notes: "Requested 4 volunteers",
  },
  {
    id: "ACT-005",
    action: "Pause Bookings",
    zone: "All Zones",
    status: "success",
    timestamp: "2024-01-15 14:50:15",
    performedBy: "Admin User",
  },
];

const CrowdControlPanel = () => {
  const navigate = useNavigate();
  const [gateStatus, setGateStatus] = useState<Record<string, boolean>>({
    "Main Entrance": true,
    "East Entrance": true,
    "North Exit": true,
    "VIP Gate": true,
  });
  const [showAnnouncement, setShowAnnouncement] = useState(false);
  const [announcementText, setAnnouncementText] = useState("");
  const [selectedZone, setSelectedZone] = useState("all");
  const [history, setHistory] = useState<ActionHistory[]>(actionHistory);
  const [bookingsPaused, setBookingsPaused] = useState(false);

  const handleGateToggle = (gate: string) => {
    const newStatus = !gateStatus[gate];
    setGateStatus({ ...gateStatus, [gate]: newStatus });
    const action: ActionHistory = {
      id: `ACT-${String(history.length + 1).padStart(3, "0")}`,
      action: newStatus ? "Open Entry Gate" : "Close Entry Gate",
      zone: gate,
      status: "success",
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      performedBy: "Control Operator",
    };
    setHistory([action, ...history]);
    toast.success(`Gate ${newStatus ? "opened" : "closed"} successfully`);
  };

  const handleRedirect = (zone: string) => {
    const action: ActionHistory = {
      id: `ACT-${String(history.length + 1).padStart(3, "0")}`,
      action: "Redirect Crowd",
      zone: zone,
      status: "success",
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      performedBy: "Control Operator",
      notes: `Redirected from ${zone} to alternative route`,
    };
    setHistory([action, ...history]);
    toast.success(`Crowd redirected from ${zone}`);
  };

  const handleBroadcastAnnouncement = () => {
    if (!announcementText.trim()) {
      toast.error("Please enter announcement text");
      return;
    }
    const action: ActionHistory = {
      id: `ACT-${String(history.length + 1).padStart(3, "0")}`,
      action: "Broadcast Announcement",
      zone: selectedZone === "all" ? "All Zones" : selectedZone,
      status: "success",
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      performedBy: "Control Operator",
      notes: announcementText,
    };
    setHistory([action, ...history]);
    setShowAnnouncement(false);
    setAnnouncementText("");
    toast.success("Announcement broadcasted successfully");
  };

  const handleCallVolunteers = (zone: string, count: number) => {
    const action: ActionHistory = {
      id: `ACT-${String(history.length + 1).padStart(3, "0")}`,
      action: "Call Volunteers",
      zone: zone,
      status: "pending",
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      performedBy: "Control Operator",
      notes: `Requested ${count} volunteers`,
    };
    setHistory([action, ...history]);
    toast.success(`Requested ${count} volunteers for ${zone}`);
  };

  const handlePauseBookings = () => {
    setBookingsPaused(!bookingsPaused);
    const action: ActionHistory = {
      id: `ACT-${String(history.length + 1).padStart(3, "0")}`,
      action: bookingsPaused ? "Resume Bookings" : "Pause Bookings",
      zone: "All Zones",
      status: "success",
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      performedBy: "Control Operator",
    };
    setHistory([action, ...history]);
    toast.success(`Bookings ${bookingsPaused ? "resumed" : "paused"}`);
  };

  const handleEmergencyProtocol = () => {
    if (!confirm("Are you sure you want to trigger emergency protocol? This will close all gates and broadcast emergency announcement.")) {
      return;
    }
    Object.keys(gateStatus).forEach(gate => {
      if (gateStatus[gate]) {
        setGateStatus({ ...gateStatus, [gate]: false });
      }
    });
    const action: ActionHistory = {
      id: `ACT-${String(history.length + 1).padStart(3, "0")}`,
      action: "Emergency Protocol",
      zone: "All Zones",
      status: "success",
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      performedBy: "Control Operator",
      notes: "Emergency protocol activated - All gates closed",
    };
    setHistory([action, ...history]);
    toast.success("Emergency protocol activated");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return (
          <Badge variant="outline" className="gap-1 text-green-600 border-green-600">
            <CheckCircle2 className="h-3 w-3" /> Success
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="secondary" className="gap-1">
            <Clock className="h-3 w-3" /> Pending
          </Badge>
        );
      case "failed":
        return (
          <Badge variant="destructive" className="gap-1">
            <XCircle className="h-3 w-3" /> Failed
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Crowd Control Panel</h1>
          <p className="text-sm text-muted-foreground mt-1">Quick action controls for crowd management</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={bookingsPaused ? "destructive" : "outline"}>
            {bookingsPaused ? "Bookings Paused" : "Bookings Active"}
          </Badge>
          <Button variant="outline" size="sm" onClick={() => navigate("/temple/crowd/dashboard")} className="gap-2">
            <LayoutDashboard className="h-4 w-4" /> Dashboard
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigate("/temple/crowd/alerts-automation")} className="gap-2">
            <BellIcon className="h-4 w-4" /> Alerts
          </Button>
        </div>
      </div>

      {/* Control Actions */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Gate Controls */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <DoorOpen className="h-4 w-4" /> Entry Gates
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {Object.entries(gateStatus).map(([gate, isOpen]) => (
              <Button
                key={gate}
                variant={isOpen ? "default" : "destructive"}
                className="w-full justify-start gap-2"
                onClick={() => handleGateToggle(gate)}
              >
                {isOpen ? <DoorOpen className="h-4 w-4" /> : <DoorClosed className="h-4 w-4" />}
                {gate} {isOpen ? "(Open)" : "(Closed)"}
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Redirect Crowd */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Route className="h-4 w-4" /> Redirect Crowd
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={() => handleRedirect("Main Sanctum")}
            >
              <Route className="h-4 w-4" />
              Main Sanctum
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={() => handleRedirect("Queue Corridor A")}
            >
              <Route className="h-4 w-4" />
              Queue Corridor A
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={() => handleRedirect("Prasadam Hall")}
            >
              <Route className="h-4 w-4" />
              Prasadam Hall
            </Button>
          </CardContent>
        </Card>

        {/* Announcements */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Bell className="h-4 w-4" /> Announcements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Dialog open={showAnnouncement} onOpenChange={setShowAnnouncement}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Bell className="h-4 w-4" />
                  Broadcast Announcement
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Broadcast Announcement</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <Label>Zone</Label>
                    <Select value={selectedZone} onValueChange={setSelectedZone}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Zones</SelectItem>
                        <SelectItem value="Z-001">Main Sanctum</SelectItem>
                        <SelectItem value="Z-002">Queue Corridor A</SelectItem>
                        <SelectItem value="Z-003">Prasadam Hall</SelectItem>
                        <SelectItem value="Z-004">East Courtyard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Message</Label>
                    <Textarea
                      value={announcementText}
                      onChange={e => setAnnouncementText(e.target.value)}
                      placeholder="Enter announcement message..."
                      rows={4}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => setShowAnnouncement(false)}>
                    Cancel
                  </Button>
                  <Button className="flex-1" onClick={handleBroadcastAnnouncement}>
                    Broadcast
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={() => handleBroadcastAnnouncement()}
            >
              <Bell className="h-4 w-4" />
              Quick: "Maintain Order"
            </Button>
          </CardContent>
        </Card>

        {/* Volunteers & Bookings */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Users2 className="h-4 w-4" /> Volunteers & Bookings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={() => handleCallVolunteers("Main Sanctum", 3)}
            >
              <Users2 className="h-4 w-4" />
              Call Volunteers (3)
            </Button>
            <Button
              variant={bookingsPaused ? "default" : "outline"}
              className="w-full justify-start gap-2"
              onClick={handlePauseBookings}
            >
              <Pause className="h-4 w-4" />
              {bookingsPaused ? "Resume" : "Pause"} Bookings
            </Button>
            <Button
              variant="destructive"
              className="w-full justify-start gap-2"
              onClick={handleEmergencyProtocol}
            >
              <Siren className="h-4 w-4" />
              Emergency Protocol
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Action History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <History className="h-4 w-4" /> Action History & Status Logs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Zone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Performed By</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map(action => (
                <TableRow key={action.id}>
                  <TableCell className="text-xs font-mono">{action.timestamp}</TableCell>
                  <TableCell className="font-medium">{action.action}</TableCell>
                  <TableCell className="text-sm">{action.zone || "—"}</TableCell>
                  <TableCell>{getStatusBadge(action.status)}</TableCell>
                  <TableCell className="text-sm">{action.performedBy}</TableCell>
                  <TableCell className="text-xs text-muted-foreground max-w-xs truncate">
                    {action.notes || "—"}
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

export default CrowdControlPanel;
