import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Users, Clock, AlertTriangle, DoorClosed, Route, Bell, Users2, TrendingUp, TrendingDown } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

// Mock data for a zone
const mockZoneData = {
  id: "Z-001",
  name: "Main Sanctum Zone",
  current: 420,
  capacity: 500,
  queueLength: 145,
  avgWaitingTime: 28,
  entryRate: 45,
  exitRate: 38,
  predictedCongestionTime: "15:30",
  status: "Active",
  structure: "Main Temple",
};

const flowData = Array.from({ length: 24 }, (_, i) => ({
  time: `${String(i).padStart(2, "0")}:00`,
  entry: Math.floor(Math.random() * 50) + 30,
  exit: Math.floor(Math.random() * 45) + 25,
}));

const occupancyData = Array.from({ length: 12 }, (_, i) => ({
  hour: `${String(i * 2).padStart(2, "0")}:00`,
  occupancy: Math.floor(Math.random() * 200) + 300,
  capacity: 500,
}));

const ZoneDetail = () => {
  const { zoneId } = useParams<{ zoneId: string }>();
  const navigate = useNavigate();
  const [zoneData, setZoneData] = useState(mockZoneData);
  const [gateClosed, setGateClosed] = useState(false);
  const [redirectActive, setRedirectActive] = useState(false);
  const [notificationsSent, setNotificationsSent] = useState(false);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setZoneData(prev => ({
        ...prev,
        current: Math.max(0, prev.current + Math.floor(Math.random() * 10) - 5),
        queueLength: Math.max(0, prev.queueLength + Math.floor(Math.random() * 20) - 10),
        entryRate: Math.max(0, prev.entryRate + Math.floor(Math.random() * 6) - 3),
        exitRate: Math.max(0, prev.exitRate + Math.floor(Math.random() * 6) - 3),
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const occupancyPct = (zoneData.current / zoneData.capacity) * 100;
  const statusColor = occupancyPct >= 90 ? "red" : occupancyPct >= 70 ? "yellow" : "green";

  const handleCloseGate = () => {
    setGateClosed(true);
    setTimeout(() => setGateClosed(false), 5000);
  };

  const handleRedirect = () => {
    setRedirectActive(true);
    setTimeout(() => setRedirectActive(false), 5000);
  };

  const handleNotifyVolunteers = () => {
    setNotificationsSent(true);
    setTimeout(() => setNotificationsSent(false), 3000);
  };

  const handleTriggerAnnouncement = () => {
    alert("Announcement triggered: 'Please maintain orderly flow. Follow security instructions.'");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate("/temple/crowd/dashboard")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{zoneData.name}</h1>
            <p className="text-sm text-muted-foreground">{zoneData.structure}</p>
          </div>
        </div>
        <Badge variant={statusColor === "red" ? "destructive" : statusColor === "yellow" ? "secondary" : "outline"}>
          {statusColor === "red" ? "Critical" : statusColor === "yellow" ? "Moderate" : "Safe"}
        </Badge>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Users className="h-5 w-5 text-primary" />
              <Badge variant="outline" className="text-xs">{Math.round(occupancyPct)}%</Badge>
            </div>
            <p className="text-2xl font-bold">{zoneData.current.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">of {zoneData.capacity.toLocaleString()} capacity</p>
            <Progress value={occupancyPct} className="h-2 mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Users2 className="h-5 w-5 text-amber-600" />
            </div>
            <p className="text-2xl font-bold">{zoneData.queueLength}</p>
            <p className="text-xs text-muted-foreground">People in queue</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
            <p className="text-2xl font-bold">{zoneData.avgWaitingTime} min</p>
            <p className="text-xs text-muted-foreground">Average waiting time</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <p className="text-2xl font-bold">{zoneData.predictedCongestionTime}</p>
            <p className="text-xs text-muted-foreground">Predicted congestion</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Charts */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Entry vs Exit Flow</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={flowData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="entry" stackId="1" stroke="#22c55e" fill="#22c55e" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="exit" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Occupancy Trend (Last 24 Hours)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={occupancyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="occupancy" stroke="#8b5cf6" strokeWidth={2} />
                  <Line type="monotone" dataKey="capacity" stroke="#ef4444" strokeDasharray="5 5" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Actions Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Control Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant={gateClosed ? "destructive" : "outline"}
              className="w-full justify-start gap-2"
              onClick={handleCloseGate}
            >
              <DoorClosed className="h-4 w-4" />
              {gateClosed ? "Gate Closed" : "Close Entry Gate"}
            </Button>
            <Button
              variant={redirectActive ? "default" : "outline"}
              className="w-full justify-start gap-2"
              onClick={handleRedirect}
            >
              <Route className="h-4 w-4" />
              {redirectActive ? "Redirecting..." : "Redirect Crowd"}
            </Button>
            <Button
              variant={notificationsSent ? "default" : "outline"}
              className="w-full justify-start gap-2"
              onClick={handleNotifyVolunteers}
            >
              <Users2 className="h-4 w-4" />
              {notificationsSent ? "Notified" : "Notify Volunteers"}
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={handleTriggerAnnouncement}
            >
              <Bell className="h-4 w-4" />
              Trigger Announcement
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Flow Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Flow Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg border bg-muted/30">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">Entry Rate</span>
              </div>
              <p className="text-2xl font-bold">{zoneData.entryRate}/min</p>
              <p className="text-xs text-muted-foreground">People entering</p>
            </div>
            <div className="p-4 rounded-lg border bg-muted/30">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">Exit Rate</span>
              </div>
              <p className="text-2xl font-bold">{zoneData.exitRate}/min</p>
              <p className="text-xs text-muted-foreground">People exiting</p>
            </div>
            <div className="p-4 rounded-lg border bg-muted/30">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-4 w-4 text-amber-600" />
                <span className="text-sm font-medium">Net Flow</span>
              </div>
              <p className="text-2xl font-bold text-amber-600">
                +{zoneData.entryRate - zoneData.exitRate}/min
              </p>
              <p className="text-xs text-muted-foreground">Increasing occupancy</p>
            </div>
            <div className="p-4 rounded-lg border bg-muted/30">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium">Time to Full</span>
              </div>
              <p className="text-2xl font-bold">
                {Math.ceil((zoneData.capacity - zoneData.current) / (zoneData.entryRate - zoneData.exitRate))} min
              </p>
              <p className="text-xs text-muted-foreground">At current rate</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ZoneDetail;
