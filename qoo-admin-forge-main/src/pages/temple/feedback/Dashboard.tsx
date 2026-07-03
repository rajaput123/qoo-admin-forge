import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MessageSquareText, AlertCircle, CheckCircle2, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

// Mock data for last 30 days
const generateLast30DaysData = () => {
  const data = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const day = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    // Simulate feedback volume with some variation
    const baseVolume = 80 + Math.random() * 40;
    const negativeVolume = 10 + Math.random() * 20;
    data.push({
      date: day,
      total: Math.round(baseVolume),
      negative: Math.round(negativeVolume),
    });
  }
  return data;
};

const chartData = generateLast30DaysData();

// Calculate if there's a negative spike (more than 30% increase in negative feedback)
const recentNegative = chartData.slice(-7).reduce((sum, d) => sum + d.negative, 0);
const previousNegative = chartData.slice(-14, -7).reduce((sum, d) => sum + d.negative, 0);
const negativeSpike = recentNegative > previousNegative * 1.3;

// Mock feedback data
const mockFeedback = [
  { id: "FB-1201", type: "Appreciation", sentiment: "positive", status: "Resolved" },
  { id: "FB-1200", type: "Complaint", sentiment: "negative", status: "Open" },
  { id: "FB-1199", type: "Suggestion", sentiment: "neutral", status: "Resolved" },
  { id: "FB-1198", type: "Complaint", sentiment: "negative", status: "In Progress" },
  { id: "FB-1197", type: "Appreciation", sentiment: "positive", status: "Resolved" },
  { id: "FB-1196", type: "Complaint", sentiment: "negative", status: "Escalated" },
];

const totalFeedbackThisMonth = 2847;
const openComplaints = mockFeedback.filter(f => f.type === "Complaint" && f.status === "Open").length + 12;
const resolvedComplaints = mockFeedback.filter(f => f.status === "Resolved").length + 234;
const totalComplaints = mockFeedback.filter(f => f.type === "Complaint").length + 156;
const negativeCount = mockFeedback.filter(f => f.sentiment === "negative").length + 342;
const positiveCount = mockFeedback.filter(f => f.sentiment === "positive").length + 1892;
const escalatedCases = mockFeedback.filter(f => f.status === "Escalated").length + 8;

const negativePercentage = ((negativeCount / totalFeedbackThisMonth) * 100).toFixed(1);
const positivePercentage = ((positiveCount / totalFeedbackThisMonth) * 100).toFixed(1);

const kpis = [
  {
    label: "Total Feedback (This Month)",
    value: totalFeedbackThisMonth.toLocaleString(),
    icon: MessageSquareText,
    color: "text-primary",
    bg: "bg-primary/5",
  },
  {
    label: "Open Complaints",
    value: openComplaints.toString(),
    icon: AlertCircle,
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    label: "Resolved Complaints",
    value: resolvedComplaints.toString(),
    icon: CheckCircle2,
    color: "text-green-600",
    bg: "bg-green-50",
  },
  {
    label: "Negative Feedback %",
    value: `${negativePercentage}%`,
    icon: TrendingDown,
    color: "text-red-600",
    bg: "bg-red-50",
  },
  {
    label: "Positive Feedback %",
    value: `${positivePercentage}%`,
    icon: TrendingUp,
    color: "text-green-600",
    bg: "bg-green-50",
  },
  {
    label: "Escalated Cases",
    value: escalatedCases.toString(),
    icon: AlertTriangle,
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
];

const FeedbackDashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Feedback Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Quick health of devotee feedback
        </p>
      </div>

      {/* Negative Spike Alert */}
      {negativeSpike && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>Negative Feedback Spike Detected:</strong> Negative feedback has increased by{" "}
            {((recentNegative / previousNegative - 1) * 100).toFixed(0)}% in the last 7 days compared to the previous week.
            Please review recent complaints.
          </AlertDescription>
        </Alert>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${kpi.bg} mb-2`}>
                <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
              </div>
              <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{kpi.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Feedback Volume (Last 30 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                interval="preserveStartEnd"
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "6px",
                }}
              />
              <Line
                type="monotone"
                dataKey="total"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ r: 3 }}
                name="Total Feedback"
              />
              <Line
                type="monotone"
                dataKey="negative"
                stroke="hsl(0 84.2% 60.2%)"
                strokeWidth={2}
                dot={{ r: 3 }}
                name="Negative Feedback"
              />
              {negativeSpike && (
                <ReferenceLine
                  x={chartData[chartData.length - 7].date}
                  stroke="hsl(0 84.2% 60.2%)"
                  strokeDasharray="5 5"
                  label={{ value: "Spike Start", position: "top" }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
          {negativeSpike && (
            <div className="mt-2 text-xs text-red-600 flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              Negative feedback spike detected in recent days
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FeedbackDashboard;
