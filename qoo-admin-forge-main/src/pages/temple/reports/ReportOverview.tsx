import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate, useParams } from "react-router-dom";
import { TrendingUp, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const moduleOverviews: Record<string, {
  title: string;
  kpis: { label: string; value: string; trend: string; color: string }[];
  highlights: string[];
}> = {
  donations: {
    title: "Donation Reports Overview",
    kpis: [
      { label: "Total Donations", value: "₹24.5L", trend: "+12%", color: "text-rose-600" },
      { label: "Donors", value: "847", trend: "+8%", color: "text-blue-600" },
      { label: "Avg. Donation", value: "₹2,890", trend: "+5%", color: "text-green-600" },
      { label: "80G Issued", value: "312", trend: "+15%", color: "text-purple-600" },
    ],
    highlights: ["Monthly donation trends", "Purpose-wise breakdown", "Top donor analysis", "Fund allocation tracking"],
  },
  events: {
    title: "Event Reports Overview",
    kpis: [
      { label: "Total Events", value: "24", trend: "+6", color: "text-purple-600" },
      { label: "Active Events", value: "5", trend: "Live", color: "text-green-600" },
      { label: "Event Revenue", value: "₹8.2L", trend: "+18%", color: "text-blue-600" },
      { label: "Registrations", value: "1,240", trend: "+22%", color: "text-amber-600" },
    ],
    highlights: ["Event budget vs actual", "Resource utilization", "Registration trends", "Revenue per event"],
  },
  finance: {
    title: "Finance Reports Overview",
    kpis: [
      { label: "Total Revenue", value: "₹45.2L", trend: "+14%", color: "text-green-600" },
      { label: "Total Expenses", value: "₹28.1L", trend: "+5%", color: "text-amber-600" },
      { label: "Net Balance", value: "₹17.1L", trend: "+28%", color: "text-blue-600" },
      { label: "Budget Utilization", value: "72%", trend: "On track", color: "text-purple-600" },
    ],
    highlights: ["Monthly revenue trends", "Expense category breakdown", "Budget variance", "Audit trail"],
  },
  bookings: {
    title: "Booking Reports Overview",
    kpis: [
      { label: "Total Bookings", value: "3,450", trend: "+15%", color: "text-blue-600" },
      { label: "Today's Bookings", value: "82", trend: "+12%", color: "text-green-600" },
      { label: "Revenue", value: "₹12.4L", trend: "+10%", color: "text-amber-600" },
      { label: "Cancellations", value: "45", trend: "-8%", color: "text-rose-600" },
    ],
    highlights: ["Peak time analysis", "Channel-wise bookings", "Cancellation trends", "Revenue by type"],
  },
  offerings: {
    title: "Offering Reports Overview",
    kpis: [
      { label: "Total Sevas", value: "1,890", trend: "+20%", color: "text-amber-600" },
      { label: "Slot Utilization", value: "78%", trend: "+5%", color: "text-green-600" },
      { label: "Revenue", value: "₹18.6L", trend: "+16%", color: "text-blue-600" },
      { label: "Unique Devotees", value: "1,120", trend: "+12%", color: "text-purple-600" },
    ],
    highlights: ["Seva-wise performance", "Slot occupancy rates", "Priest assignment stats", "Revenue breakdown"],
  },
  projects: {
    title: "Project Reports Overview",
    kpis: [
      { label: "Active Projects", value: "8", trend: "+2", color: "text-blue-600" },
      { label: "Completed", value: "14", trend: "This year", color: "text-green-600" },
      { label: "Budget Used", value: "₹32.5L", trend: "68%", color: "text-amber-600" },
      { label: "On-time Rate", value: "85%", trend: "+5%", color: "text-purple-600" },
    ],
    highlights: ["Milestone tracking", "Budget utilization", "Risk assessment", "Timeline adherence"],
  },
  branches: {
    title: "Branch Reports Overview",
    kpis: [
      { label: "Total Branches", value: "6", trend: "+1", color: "text-teal-600" },
      { label: "Total Revenue", value: "₹52.3L", trend: "+14%", color: "text-green-600" },
      { label: "Devotees Served", value: "12,450", trend: "+18%", color: "text-blue-600" },
      { label: "Compliance", value: "94%", trend: "+3%", color: "text-purple-600" },
    ],
    highlights: ["Cross-branch comparison", "Revenue contribution", "Performance metrics", "Compliance tracking"],
  },
  institutions: {
    title: "Institution Reports Overview",
    kpis: [
      { label: "Institutions", value: "4", trend: "Active", color: "text-indigo-600" },
      { label: "Students/Patients", value: "850", trend: "+12%", color: "text-blue-600" },
      { label: "Budget Used", value: "₹15.2L", trend: "72%", color: "text-amber-600" },
      { label: "Compliance", value: "92%", trend: "+4%", color: "text-green-600" },
    ],
    highlights: ["Institution performance", "Financial health", "Compliance status", "Growth metrics"],
  },
  hr: {
    title: "People & HR Reports Overview",
    kpis: [
      { label: "Total Staff", value: "124", trend: "+8", color: "text-sky-600" },
      { label: "Attendance Rate", value: "92%", trend: "+2%", color: "text-green-600" },
      { label: "Leave Utilization", value: "68%", trend: "Normal", color: "text-amber-600" },
      { label: "Expense Claims", value: "₹4.2L", trend: "+6%", color: "text-purple-600" },
    ],
    highlights: ["Department-wise attendance", "Leave balance tracking", "Expense analytics", "Org structure"],
  },
  vip: {
    title: "VIP Reports Overview",
    kpis: [
      { label: "VIP Devotees", value: "156", trend: "+12", color: "text-yellow-600" },
      { label: "Contributions", value: "₹28.4L", trend: "+22%", color: "text-green-600" },
      { label: "Active VIPs", value: "98", trend: "63%", color: "text-blue-600" },
      { label: "Events Attended", value: "342", trend: "+18%", color: "text-purple-600" },
    ],
    highlights: ["Contribution analysis", "Engagement levels", "Service utilization", "Retention tracking"],
  },
  freelancers: {
    title: "Freelancer Reports Overview",
    kpis: [
      { label: "Freelancers", value: "32", trend: "+5", color: "text-lime-600" },
      { label: "Active Assignments", value: "18", trend: "56%", color: "text-blue-600" },
      { label: "Payments Made", value: "₹6.8L", trend: "+14%", color: "text-green-600" },
      { label: "Avg. Rating", value: "4.2", trend: "+0.3", color: "text-amber-600" },
    ],
    highlights: ["Assignment tracking", "Payment analytics", "Performance ratings", "Skill distribution"],
  },
  feedback: {
    title: "Feedback Reports Overview",
    kpis: [
      { label: "Total Feedback", value: "2,340", trend: "+25%", color: "text-pink-600" },
      { label: "Avg. Rating", value: "4.3/5", trend: "+0.2", color: "text-green-600" },
      { label: "Positive", value: "78%", trend: "+5%", color: "text-blue-600" },
      { label: "Action Items", value: "24", trend: "Pending", color: "text-amber-600" },
    ],
    highlights: ["Sentiment trends", "Category-wise ratings", "Improvement areas", "Response rate"],
  },
  devotees: {
    title: "Devotee Management Reports",
    kpis: [
      { label: "Total Devotees", value: "1,240", trend: "+15%", color: "text-blue-600" },
      { label: "Active", value: "980", trend: "+12%", color: "text-green-600" },
      { label: "Volunteers", value: "156", trend: "+8%", color: "text-rose-600" },
      { label: "Avg Engagement", value: "72%", trend: "+5%", color: "text-purple-600" },
    ],
    highlights: ["City-wise distribution", "Gender demographics", "Engagement analytics", "Volunteer tracking"],
  },
  communication: {
    title: "Communication Reports",
    kpis: [
      { label: "Total Messages", value: "4,580", trend: "+22%", color: "text-blue-600" },
      { label: "Delivery Rate", value: "94%", trend: "+3%", color: "text-green-600" },
      { label: "Devotees Reached", value: "890", trend: "+18%", color: "text-purple-600" },
      { label: "Engagement Rate", value: "68%", trend: "+7%", color: "text-amber-600" },
    ],
    highlights: ["Channel analytics", "Delivery metrics", "Topic breakdown", "Monthly trends"],
  },
};

const ReportOverview = ({ moduleKey }: { moduleKey: string }) => {
  const navigate = useNavigate();
  const overview = moduleOverviews[moduleKey];

  if (!overview) {
    return <div className="p-6 text-muted-foreground">Module overview not found.</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{overview.title}</h1>
        <p className="text-sm text-muted-foreground mt-1">Key performance indicators and summary</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {overview.kpis.map((kpi) => (
          <Card key={kpi.label}>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">{kpi.label}</p>
              <p className={`text-2xl font-bold mt-1 ${kpi.color}`}>{kpi.value}</p>
              <div className="flex items-center gap-1 mt-1.5">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span className="text-xs text-muted-foreground">{kpi.trend}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Highlights */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4">Available in Tables View</h3>
          <div className="grid grid-cols-2 gap-3">
            {overview.highlights.map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                {item}
              </div>
            ))}
          </div>
          <Button
            className="mt-5"
            onClick={() => navigate(`/temple/reports/${moduleKey}/tables`)}
          >
            View Tables
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportOverview;
