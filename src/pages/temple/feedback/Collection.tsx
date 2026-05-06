import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Filter, AlertTriangle, Eye } from "lucide-react";

type FeedbackType = "Complaint" | "Suggestion" | "Appreciation";
type FeedbackStatus = "Open" | "In Progress" | "Resolved" | "Escalated";
type Sentiment = "positive" | "neutral" | "negative";
type RelatedTo = "Temple" | "Seva" | "Freelancer" | "Kitchen" | "Facilities" | "Other";

interface FeedbackEntry {
  id: string;
  subject: string;
  preview: string;
  relatedTo: RelatedTo;
  sentiment: Sentiment;
  type: FeedbackType;
  date: string;
  status: FeedbackStatus;
  fullContent?: string;
}

const feedbackEntries: FeedbackEntry[] = [
  {
    id: "FB-1201",
    subject: "Excellent Darshan Experience",
    preview: "Wonderful arrangements during Maha Shivaratri. The queue management was smooth...",
    relatedTo: "Temple",
    sentiment: "positive",
    type: "Appreciation",
    date: "2024-02-10",
    status: "Resolved",
    fullContent: "Wonderful arrangements during Maha Shivaratri. The queue management was smooth and the darshan was divine. Thank you for the excellent service.",
  },
  {
    id: "FB-1200",
    subject: "Long Wait Time Despite Booking",
    preview: "Waited 3 hours despite having a slot booking. The system needs improvement...",
    relatedTo: "Seva",
    sentiment: "negative",
    type: "Complaint",
    date: "2024-02-10",
    status: "Open",
    fullContent: "Waited 3 hours despite having a slot booking. The system needs improvement. Very disappointed with the experience.",
  },
  {
    id: "FB-1199",
    subject: "Prasadam Portion Size",
    preview: "Good taste but portions could be larger. Quality is excellent though...",
    relatedTo: "Kitchen",
    sentiment: "neutral",
    type: "Suggestion",
    date: "2024-02-09",
    status: "Resolved",
    fullContent: "Good taste but portions could be larger. Quality is excellent though. Please consider increasing the serving size.",
  },
  {
    id: "FB-1198",
    subject: "Restroom Cleanliness Issue",
    preview: "Restrooms near east gate need attention. Not maintained properly...",
    relatedTo: "Facilities",
    sentiment: "negative",
    type: "Complaint",
    date: "2024-02-09",
    status: "In Progress",
    fullContent: "Restrooms near east gate need attention. Not maintained properly. Please improve the cleanliness standards.",
  },
  {
    id: "FB-1197",
    subject: "Helpful Security Staff",
    preview: "Security staff very helpful and courteous. Made our visit pleasant...",
    relatedTo: "Temple",
    sentiment: "positive",
    type: "Appreciation",
    date: "2024-02-09",
    status: "Resolved",
    fullContent: "Security staff very helpful and courteous. Made our visit pleasant. Great service!",
  },
  {
    id: "FB-1196",
    subject: "Freelancer Service Quality",
    preview: "The freelancer assigned for puja was not professional. Arrived late...",
    relatedTo: "Freelancer",
    sentiment: "negative",
    type: "Complaint",
    date: "2024-02-08",
    status: "Escalated",
    fullContent: "The freelancer assigned for puja was not professional. Arrived late and did not follow proper rituals. Very disappointed.",
  },
  {
    id: "FB-1195",
    subject: "Drinking Water Facility",
    preview: "Drinking water facility insufficient near south entrance. Need more water points...",
    relatedTo: "Facilities",
    sentiment: "neutral",
    type: "Suggestion",
    date: "2024-02-08",
    status: "Open",
    fullContent: "Drinking water facility insufficient near south entrance. Need more water points for devotees.",
  },
  {
    id: "FB-1194",
    subject: "Beautiful Temple Decorations",
    preview: "The temple decorations during festival were amazing. Very well done...",
    relatedTo: "Temple",
    sentiment: "positive",
    type: "Appreciation",
    date: "2024-02-07",
    status: "Resolved",
    fullContent: "The temple decorations during festival were amazing. Very well done. Thank you for the beautiful arrangements.",
  },
];

const FeedbackCollection = () => {
  const [dateRange, setDateRange] = useState<"all" | "today" | "week" | "month">("all");
  const [sentimentFilter, setSentimentFilter] = useState<"all" | Sentiment>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | FeedbackStatus>("all");
  const [viewEntry, setViewEntry] = useState<FeedbackEntry | null>(null);

  // Check for negative spike (more than 5 negative feedbacks in last 24 hours)
  const today = new Date().toISOString().split("T")[0];
  const recentNegative = feedbackEntries.filter(
    f => f.date === today && f.sentiment === "negative"
  ).length;
  const hasNegativeSpike = recentNegative >= 5;

  // Filter feedback
  const filtered = feedbackEntries.filter(entry => {
    const matchDate =
      dateRange === "all" ||
      (dateRange === "today" && entry.date === today) ||
      (dateRange === "week" && new Date(entry.date) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) ||
      (dateRange === "month" && new Date(entry.date) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
    const matchSentiment = sentimentFilter === "all" || entry.sentiment === sentimentFilter;
    const matchStatus = statusFilter === "all" || entry.status === statusFilter;
    return matchDate && matchSentiment && matchStatus;
  });

  const sentimentColor = (sentiment: Sentiment) => {
    if (sentiment === "positive") return "bg-green-100 text-green-700 border-green-200";
    if (sentiment === "negative") return "bg-red-100 text-red-700 border-red-200";
    return "bg-yellow-100 text-yellow-700 border-yellow-200";
  };

  const statusColor = (status: FeedbackStatus) => {
    if (status === "Resolved") return "bg-green-100 text-green-700 border-green-200";
    if (status === "Escalated") return "bg-red-100 text-red-700 border-red-200";
    if (status === "In Progress") return "bg-blue-100 text-blue-700 border-blue-200";
    return "bg-amber-100 text-amber-700 border-amber-200";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Feedback Collection</h1>
        <p className="text-sm text-muted-foreground mt-1">Inbox - Collect, review, and manage devotee feedback</p>
      </div>

      {/* Negative Spike Alert */}
      {hasNegativeSpike && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>Alert:</strong> Negative feedback spike detected! {recentNegative} negative feedback entries today.
            Please review immediately.
          </AlertDescription>
        </Alert>
      )}

      {/* Filters */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Date Range</Label>
              <Select value={dateRange} onValueChange={(v) => setDateRange(v as typeof dateRange)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">Last 7 Days</SelectItem>
                  <SelectItem value="month">Last 30 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Sentiment</Label>
              <Select value={sentimentFilter} onValueChange={(v) => setSentimentFilter(v as typeof sentimentFilter)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sentiments</SelectItem>
                  <SelectItem value="positive">Positive</SelectItem>
                  <SelectItem value="neutral">Neutral</SelectItem>
                  <SelectItem value="negative">Negative</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Resolved">Resolved</SelectItem>
                  <SelectItem value="Escalated">Escalated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feedback Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Feedback Inbox ({filtered.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead>Feedback Preview</TableHead>
                <TableHead>Related To</TableHead>
                <TableHead>Sentiment</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                    No feedback found matching the filters
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((entry) => (
                  <TableRow key={entry.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium text-sm">{entry.subject}</TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-xs">
                      <p className="truncate">{entry.preview}</p>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {entry.relatedTo}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`text-xs ${sentimentColor(entry.sentiment)}`}>
                        {entry.sentiment.charAt(0).toUpperCase() + entry.sentiment.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {entry.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{entry.date}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`text-xs ${statusColor(entry.status)}`}>
                        {entry.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() => setViewEntry(entry)}
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View Detail Modal */}
      <Dialog open={!!viewEntry} onOpenChange={() => setViewEntry(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Feedback Detail — {viewEntry?.id}</DialogTitle>
          </DialogHeader>
          {viewEntry && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Subject</Label>
                  <p className="text-sm font-medium">{viewEntry.subject}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Date</Label>
                  <p className="text-sm">{viewEntry.date}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Related To</Label>
                  <Badge variant="outline" className="text-xs mt-1">
                    {viewEntry.relatedTo}
                  </Badge>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Type</Label>
                  <Badge variant="outline" className="text-xs mt-1">
                    {viewEntry.type}
                  </Badge>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Sentiment</Label>
                  <Badge variant="outline" className={`text-xs mt-1 ${sentimentColor(viewEntry.sentiment)}`}>
                    {viewEntry.sentiment.charAt(0).toUpperCase() + viewEntry.sentiment.slice(1)}
                  </Badge>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Status</Label>
                  <Badge variant="outline" className={`text-xs mt-1 ${statusColor(viewEntry.status)}`}>
                    {viewEntry.status}
                  </Badge>
                </div>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Full Feedback</Label>
                <div className="mt-1 p-3 rounded-lg bg-muted/50 border text-sm">
                  {viewEntry.fullContent || viewEntry.preview}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FeedbackCollection;
