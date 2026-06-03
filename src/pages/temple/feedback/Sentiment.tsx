import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ThumbsUp, ThumbsDown, Minus, TrendingUp, AlertTriangle, MessageSquareText } from "lucide-react";

const sentimentOverview = {
  positive: 78,
  neutral: 14,
  negative: 8,
};

const topPositiveThemes = [
  { theme: "Darshan arrangements", mentions: 342, sentiment: 92 },
  { theme: "Courteous staff", mentions: 218, sentiment: 89 },
  { theme: "Prasadam quality", mentions: 195, sentiment: 84 },
  { theme: "Festival decorations", mentions: 167, sentiment: 91 },
  { theme: "Clean premises", mentions: 145, sentiment: 80 },
];

const topNegativeThemes = [
  { theme: "Long queue wait times", mentions: 287, sentiment: 18 },
  { theme: "Insufficient restrooms", mentions: 134, sentiment: 22 },
  { theme: "Drinking water shortage", mentions: 98, sentiment: 25 },
  { theme: "Parking difficulties", mentions: 87, sentiment: 20 },
  { theme: "Crowding near sanctum", mentions: 76, sentiment: 15 },
];

const weeklyTrend = [
  { week: "W1", positive: 75, neutral: 16, negative: 9 },
  { week: "W2", positive: 72, neutral: 18, negative: 10 },
  { week: "W3", positive: 80, neutral: 12, negative: 8 },
  { week: "W4", positive: 78, neutral: 14, negative: 8 },
];

const alertKeywords = [
  { keyword: "unsafe", count: 12, severity: "High" },
  { keyword: "rude staff", count: 8, severity: "Medium" },
  { keyword: "theft", count: 5, severity: "High" },
  { keyword: "injury", count: 3, severity: "Critical" },
  { keyword: "overcrowded", count: 23, severity: "Medium" },
];

const Sentiment = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Sentiment Analysis</h1>
          <p className="text-sm text-muted-foreground mt-1">AI-powered sentiment trends, keyword alerts, and theme extraction</p>
        </div>
        <Select defaultValue="last-30">
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="last-7">Last 7 Days</SelectItem>
            <SelectItem value="last-30">Last 30 Days</SelectItem>
            <SelectItem value="last-90">Last 90 Days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Sentiment Donut Summary */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <ThumbsUp className="h-6 w-6 text-green-600 mx-auto mb-2" />
            <p className="text-3xl font-bold text-green-600">{sentimentOverview.positive}%</p>
            <p className="text-xs text-muted-foreground">Positive</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Minus className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
            <p className="text-3xl font-bold text-muted-foreground">{sentimentOverview.neutral}%</p>
            <p className="text-xs text-muted-foreground">Neutral</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <ThumbsDown className="h-6 w-6 text-red-500 mx-auto mb-2" />
            <p className="text-3xl font-bold text-red-500">{sentimentOverview.negative}%</p>
            <p className="text-xs text-muted-foreground">Negative</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Positive Themes */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2"><ThumbsUp className="h-4 w-4 text-green-600" /> Top Positive Themes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {topPositiveThemes.map((t) => (
              <div key={t.theme}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm">{t.theme}</span>
                  <span className="text-xs text-muted-foreground">{t.mentions} mentions</span>
                </div>
                <Progress value={t.sentiment} className="h-1.5" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Negative Themes */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2"><ThumbsDown className="h-4 w-4 text-red-500" /> Top Negative Themes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {topNegativeThemes.map((t) => (
              <div key={t.theme}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm">{t.theme}</span>
                  <span className="text-xs text-muted-foreground">{t.mentions} mentions</span>
                </div>
                <Progress value={100 - t.sentiment} className="h-1.5 [&>div]:bg-red-500" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Alert Keywords */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-amber-500" /> Alert Keywords Detected</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {alertKeywords.map((kw) => (
              <div key={kw.keyword} className="p-3 rounded-lg border text-center">
                <p className="text-sm font-medium text-foreground">"{kw.keyword}"</p>
                <p className="text-lg font-bold text-foreground mt-1">{kw.count}</p>
                <Badge variant="outline" className={`text-[10px] mt-1 ${kw.severity === "Critical" ? "bg-red-100 text-red-700" : kw.severity === "High" ? "bg-orange-100 text-orange-700" : "bg-amber-100 text-amber-700"}`}>
                  {kw.severity}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Weekly Trend */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Weekly Sentiment Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {weeklyTrend.map((w) => (
              <div key={w.week} className="flex items-center gap-3">
                <span className="text-sm font-medium w-8">{w.week}</span>
                <div className="flex-1 flex h-5 rounded-full overflow-hidden">
                  <div className="bg-green-500 h-full" style={{ width: `${w.positive}%` }} />
                  <div className="bg-muted h-full" style={{ width: `${w.neutral}%` }} />
                  <div className="bg-red-400 h-full" style={{ width: `${w.negative}%` }} />
                </div>
                <span className="text-xs text-muted-foreground w-20 text-right">{w.positive}% positive</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Sentiment;
