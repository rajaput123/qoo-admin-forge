import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Brain, Calendar, TrendingUp, Users, Shield, UtensilsCrossed, UserCheck, AlertTriangle, CloudSun } from "lucide-react";

const predictions = [
  { date: "2024-01-20", day: "Saturday", event: "Thaipusam", predicted: 92000, peakTime: "6:00–10:00 AM", risk: "Critical", weather: "Clear", confidence: 91 },
  { date: "2024-01-21", day: "Sunday", event: "Thaipusam Day 2", predicted: 78000, peakTime: "7:00–11:00 AM", risk: "High", weather: "Clear", confidence: 87 },
  { date: "2024-01-22", day: "Monday", event: "—", predicted: 35000, peakTime: "10:00–12:00 PM", risk: "Normal", weather: "Partly Cloudy", confidence: 82 },
  { date: "2024-01-23", day: "Tuesday", event: "—", predicted: 32000, peakTime: "10:00–12:00 PM", risk: "Normal", weather: "Rain Expected", confidence: 75 },
  { date: "2024-01-25", day: "Thursday", event: "Pongal Special", predicted: 65000, peakTime: "8:00–11:00 AM", risk: "High", weather: "Clear", confidence: 84 },
  { date: "2024-01-26", day: "Friday", event: "Republic Day", predicted: 55000, peakTime: "9:00–12:00 PM", risk: "High", weather: "Clear", confidence: 80 },
];

const recommendations = [
  { date: "Jan 20 – Thaipusam", security: 180, volunteers: 250, kitchenScale: "3x", notes: "Deploy all security teams. Open Festival Ground." },
  { date: "Jan 21 – Day 2", security: 150, volunteers: 200, kitchenScale: "2.5x", notes: "Maintain extended gate hours. VIP protocol active." },
  { date: "Jan 25 – Pongal", security: 120, volunteers: 150, kitchenScale: "2x", notes: "Special prasadam distribution. Extra counters." },
  { date: "Jan 26 – Republic Day", security: 100, volunteers: 120, kitchenScale: "1.8x", notes: "Government delegation expected. VIP security." },
];

const riskFactors = [
  { factor: "Historical Crowd Data", weight: "35%", status: "Active", dataPoints: "365 days" },
  { factor: "Booking Volume", weight: "25%", status: "Active", dataPoints: "Real-time" },
  { factor: "Event Calendar", weight: "20%", status: "Active", dataPoints: "52 events/year" },
  { factor: "Public Holidays", weight: "10%", status: "Active", dataPoints: "Government calendar" },
  { factor: "Weather Data", weight: "7%", status: "Active", dataPoints: "7-day forecast" },
  { factor: "Social Signals", weight: "3%", status: "Beta", dataPoints: "Trending topics" },
];

const PredictionRisk = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Prediction & Risk Engine</h1>
          <p className="text-sm text-muted-foreground mt-1">AI-powered surge forecasting and risk classification</p>
        </div>
        <Badge variant="secondary" className="gap-1"><Brain className="h-3 w-3" /> ML Model v2.4</Badge>
      </div>

      {/* Warning */}
      <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-amber-800">Predictions are advisory only</p>
          <p className="text-xs text-amber-700">Predictions must not auto-change safety limits. All safety thresholds require manual approval.</p>
        </div>
      </div>

      {/* Prediction Table */}
      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><Calendar className="h-4 w-4" /> 7-Day Forecast</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Day</TableHead>
                <TableHead>Event</TableHead>
                <TableHead className="text-right">Predicted Footfall</TableHead>
                <TableHead>Peak Time</TableHead>
                <TableHead>Risk Level</TableHead>
                <TableHead>Weather</TableHead>
                <TableHead>Confidence</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {predictions.map(p => (
                <TableRow key={p.date}>
                  <TableCell className="font-mono text-sm">{p.date}</TableCell>
                  <TableCell>{p.day}</TableCell>
                  <TableCell>{p.event !== "—" ? <Badge variant="secondary" className="text-xs">{p.event}</Badge> : "—"}</TableCell>
                  <TableCell className="text-right font-mono font-semibold">{p.predicted.toLocaleString()}</TableCell>
                  <TableCell className="text-sm">{p.peakTime}</TableCell>
                  <TableCell>
                    <Badge variant={p.risk === "Critical" ? "destructive" : p.risk === "High" ? "secondary" : "outline"} className="text-xs">{p.risk}</Badge>
                  </TableCell>
                  <TableCell className="text-sm flex items-center gap-1">
                    <CloudSun className="h-3.5 w-3.5 text-muted-foreground" /> {p.weather}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={p.confidence} className="h-1.5 w-12" />
                      <span className="text-xs font-mono">{p.confidence}%</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-base">Operational Recommendations</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date & Event</TableHead>
                <TableHead className="text-center"><Shield className="h-4 w-4 mx-auto" /></TableHead>
                <TableHead className="text-center"><UserCheck className="h-4 w-4 mx-auto" /></TableHead>
                <TableHead className="text-center"><UtensilsCrossed className="h-4 w-4 mx-auto" /></TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recommendations.map(r => (
                <TableRow key={r.date}>
                  <TableCell className="font-medium text-sm">{r.date}</TableCell>
                  <TableCell className="text-center font-mono">{r.security}</TableCell>
                  <TableCell className="text-center font-mono">{r.volunteers}</TableCell>
                  <TableCell className="text-center"><Badge variant="outline" className="text-xs">{r.kitchenScale}</Badge></TableCell>
                  <TableCell className="text-xs text-muted-foreground max-w-xs">{r.notes}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Risk Factors */}
      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-base">Risk Model Inputs</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Factor</TableHead>
                <TableHead>Weight</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data Points</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {riskFactors.map(f => (
                <TableRow key={f.factor}>
                  <TableCell className="font-medium">{f.factor}</TableCell>
                  <TableCell className="font-mono">{f.weight}</TableCell>
                  <TableCell><Badge variant={f.status === "Active" ? "default" : "secondary"} className="text-xs">{f.status}</Badge></TableCell>
                  <TableCell className="text-sm text-muted-foreground">{f.dataPoints}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default PredictionRisk;
