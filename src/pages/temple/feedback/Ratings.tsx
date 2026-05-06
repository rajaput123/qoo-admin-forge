import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, TrendingUp, TrendingDown } from "lucide-react";

const overallRating = { score: 4.3, total: 2847, change: "+0.2" };

const ratingDistribution = [
  { stars: 5, count: 1138, percentage: 40 },
  { stars: 4, count: 854, percentage: 30 },
  { stars: 3, count: 427, percentage: 15 },
  { stars: 2, count: 285, percentage: 10 },
  { stars: 1, count: 143, percentage: 5 },
];

const categoryRatings = [
  { category: "Darshan Experience", rating: 4.5, reviews: 842, trend: "up", change: "+0.3" },
  { category: "Staff Behaviour", rating: 4.4, reviews: 338, trend: "up", change: "+0.1" },
  { category: "Prasadam Quality", rating: 4.1, reviews: 451, trend: "stable", change: "0" },
  { category: "Cleanliness", rating: 3.8, reviews: 394, trend: "down", change: "-0.2" },
  { category: "Facilities", rating: 3.6, reviews: 258, trend: "down", change: "-0.1" },
  { category: "Queue Management", rating: 3.2, reviews: 564, trend: "up", change: "+0.4" },
];

const monthlyTrend = [
  { month: "Sep 2025", rating: 4.0 },
  { month: "Oct 2025", rating: 4.1 },
  { month: "Nov 2025", rating: 4.0 },
  { month: "Dec 2025", rating: 4.2 },
  { month: "Jan 2026", rating: 4.1 },
  { month: "Feb 2026", rating: 4.3 },
];

const Ratings = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Ratings & Reviews</h1>
          <p className="text-sm text-muted-foreground mt-1">Detailed analysis of devotee ratings across all categories</p>
        </div>
        <Select defaultValue="last-30">
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="last-7">Last 7 Days</SelectItem>
            <SelectItem value="last-30">Last 30 Days</SelectItem>
            <SelectItem value="last-90">Last 90 Days</SelectItem>
            <SelectItem value="all">All Time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Overall Score */}
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-5xl font-bold text-foreground mb-1">{overallRating.score}</div>
            <div className="flex items-center justify-center gap-0.5 mb-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`h-5 w-5 ${i < Math.round(overallRating.score) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`} />
              ))}
            </div>
            <p className="text-sm text-muted-foreground">{overallRating.total.toLocaleString()} reviews</p>
            <Badge variant="outline" className="mt-2 text-green-600 border-green-200 bg-green-50 text-xs gap-0.5">
              <TrendingUp className="h-3 w-3" /> {overallRating.change} this month
            </Badge>
          </CardContent>
        </Card>

        {/* Distribution */}
        <Card className="md:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Rating Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {ratingDistribution.map((d) => (
              <div key={d.stars} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-16">
                  <span className="text-sm font-medium">{d.stars}</span>
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                </div>
                <Progress value={d.percentage} className="flex-1 h-2" />
                <span className="text-sm text-muted-foreground w-16 text-right">{d.count}</span>
                <span className="text-xs text-muted-foreground w-10 text-right">{d.percentage}%</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Category Ratings */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Ratings by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {categoryRatings.map((cat) => (
              <div key={cat.category} className="p-4 rounded-lg border hover:bg-muted/30 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">{cat.category}</span>
                  <div className="flex items-center gap-1">
                    {cat.trend === "up" ? <TrendingUp className="h-3 w-3 text-green-600" /> : cat.trend === "down" ? <TrendingDown className="h-3 w-3 text-red-500" /> : null}
                    <span className={`text-xs ${cat.trend === "up" ? "text-green-600" : cat.trend === "down" ? "text-red-500" : "text-muted-foreground"}`}>{cat.change}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-foreground">{cat.rating}</span>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`h-3 w-3 ${i < Math.round(cat.rating) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`} />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground ml-auto">{cat.reviews} reviews</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Monthly Trend */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Monthly Rating Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-4 h-40">
            {monthlyTrend.map((m) => (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs font-medium">{m.rating}</span>
                <div className="w-full bg-primary/20 rounded-t" style={{ height: `${(m.rating / 5) * 100}%` }}>
                  <div className="w-full h-full bg-primary rounded-t" />
                </div>
                <span className="text-[10px] text-muted-foreground">{m.month.split(" ")[0]}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Ratings;
