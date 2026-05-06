import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { TrendingUp, AlertTriangle, Calendar, Clock, Users, LayoutDashboard, Map } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, AreaChart, Area } from "recharts";

const predictionData30 = Array.from({ length: 6 }, (_, i) => ({
  time: `${String(14 + i).padStart(2, "0")}:00`,
  predicted: Math.floor(Math.random() * 500) + 2000,
  current: 1850,
}));

const predictionData60 = Array.from({ length: 12 }, (_, i) => ({
  time: `${String(14 + i).padStart(2, "0")}:00`,
  predicted: Math.floor(Math.random() * 800) + 1500,
  current: 1850,
}));

const peakHourData = [
  { hour: "6:00", crowd: 1200 },
  { hour: "8:00", crowd: 3500 },
  { hour: "10:00", crowd: 5200 },
  { hour: "12:00", crowd: 4800 },
  { hour: "14:00", crowd: 3200 },
  { hour: "16:00", crowd: 4100 },
  { hour: "18:00", crowd: 5800 },
  { hour: "20:00", crowd: 4200 },
  { hour: "22:00", crowd: 1800 },
];

const eventSurgeData = [
  { event: "Morning Aarti", impact: 35, time: "6:00 AM" },
  { event: "Special Darshan", impact: 25, time: "10:00 AM" },
  { event: "Evening Aarti", impact: 45, time: "6:00 PM" },
  { event: "Night Darshan", impact: 20, time: "8:00 PM" },
];

const riskZones = [
  { zone: "Main Sanctum", risk: "High", predictedOccupancy: 92, time: "15:30", reason: "Peak hour approaching" },
  { zone: "Queue Corridor A", risk: "Critical", predictedOccupancy: 98, time: "15:00", reason: "Event surge expected" },
  { zone: "Prasadam Hall", risk: "Medium", predictedOccupancy: 75, time: "16:00", reason: "Lunch hour peak" },
  { zone: "East Courtyard", risk: "Low", predictedOccupancy: 45, time: "17:00", reason: "Normal flow" },
];

const PredictionForecast = () => {
  const navigate = useNavigate();
  const [timeWindow, setTimeWindow] = useState<"30min" | "60min">("30min");

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case "Critical":
        return <Badge variant="destructive">Critical</Badge>;
      case "High":
        return <Badge variant="destructive" className="bg-orange-600">High</Badge>;
      case "Medium":
        return <Badge variant="secondary">Medium</Badge>;
      default:
        return <Badge variant="outline">Low</Badge>;
    }
  };

  const predictionData = timeWindow === "30min" ? predictionData30 : predictionData60;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Prediction & Forecast</h1>
          <p className="text-sm text-muted-foreground mt-1">Crowd surge prediction and risk analysis</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate("/temple/crowd/dashboard")} className="gap-2">
            <LayoutDashboard className="h-4 w-4" /> Dashboard
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigate("/temple/crowd/heatmap")} className="gap-2">
            <Map className="h-4 w-4" /> Heatmap
          </Button>
          <Label className="text-xs">Time Window:</Label>
          <Select value={timeWindow} onValueChange={(v: "30min" | "60min") => setTimeWindow(v)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30min">30 Minutes</SelectItem>
              <SelectItem value="60min">60 Minutes</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <p className="text-2xl font-bold">2,450</p>
            <p className="text-xs text-muted-foreground">Expected in {timeWindow === "30min" ? "30 min" : "1 hour"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-2xl font-bold">+32%</p>
            <p className="text-xs text-muted-foreground">Increase expected</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
            <p className="text-2xl font-bold">15:30</p>
            <p className="text-xs text-muted-foreground">Peak hour</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <p className="text-2xl font-bold">2</p>
            <p className="text-xs text-muted-foreground">Risk zones</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Prediction Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Expected Crowd in Next {timeWindow === "30min" ? "30 Minutes" : "1 Hour"}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={predictionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="predicted"
                  stroke="#8b5cf6"
                  fill="#8b5cf6"
                  fillOpacity={0.6}
                  name="Predicted"
                />
                <Line type="monotone" dataKey="current" stroke="#ef4444" strokeDasharray="5 5" name="Current" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Peak Hour Prediction */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Peak Hour Prediction</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={peakHourData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="crowd" fill="#3b82f6" name="Expected Crowd" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Event Surge Impact */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="h-4 w-4" /> Event Surge Impact
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {eventSurgeData.map((event, i) => (
              <div key={i} className="p-4 rounded-lg border bg-muted/30">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-sm">{event.event}</p>
                  <Badge variant="secondary">+{event.impact}%</Badge>
                </div>
                <p className="text-xs text-muted-foreground">{event.time}</p>
                <div className="mt-2">
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${event.impact}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Risk Zones */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-600" /> Risk Zones List
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {riskZones.map((zone, i) => (
              <div
                key={i}
                className={`p-4 rounded-lg border-2 ${
                  zone.risk === "Critical"
                    ? "border-red-300 bg-red-50"
                    : zone.risk === "High"
                    ? "border-orange-300 bg-orange-50"
                    : zone.risk === "Medium"
                    ? "border-amber-300 bg-amber-50"
                    : "border-green-300 bg-green-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="font-semibold">{zone.zone}</p>
                      {getRiskBadge(zone.risk)}
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-xs text-muted-foreground">Predicted Occupancy</p>
                        <p className="font-semibold">{zone.predictedOccupancy}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Time</p>
                        <p className="font-semibold">{zone.time}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Reason</p>
                        <p className="font-semibold text-xs">{zone.reason}</p>
                      </div>
                    </div>
                  </div>
                  <Button size="sm" variant={zone.risk === "Critical" ? "destructive" : "outline"}>
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Timeline Visualization */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Timeline Visualization</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative h-32 bg-muted/30 rounded-lg p-4 overflow-x-auto">
            <div className="flex items-center gap-4 h-full">
              {Array.from({ length: 24 }, (_, i) => {
                const hour = i;
                const isPeak = [8, 10, 18, 20].includes(hour);
                const isCurrent = hour === 14;
                return (
                  <div
                    key={i}
                    className={`flex flex-col items-center justify-end h-full ${
                      isPeak ? "w-12" : "w-8"
                    }`}
                  >
                    <div
                      className={`w-full rounded-t ${
                        isPeak
                          ? "bg-red-500 h-24"
                          : isCurrent
                          ? "bg-primary h-16"
                          : "bg-muted-foreground/30 h-8"
                      }`}
                    />
                    <span className={`text-xs mt-1 ${isCurrent ? "font-bold" : ""}`}>
                      {String(hour).padStart(2, "0")}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex items-center gap-4 mt-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded" />
              <span>Peak Hours</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-primary rounded" />
              <span>Current Time</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-muted-foreground/30 rounded" />
              <span>Normal Hours</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PredictionForecast;
