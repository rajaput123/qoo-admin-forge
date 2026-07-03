import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Heart, CalendarDays, IndianRupee, Calendar, Sparkles,
  FolderKanban,
  Users, MessageSquare, ArrowRight, ArrowLeft, BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const moduleCards = [
  { title: "Donations", icon: Heart, path: "/temple/reports/donations", description: "Donor analytics, fund allocation, 80G receipts", gradient: "from-[hsl(350,65%,50%)] to-[hsl(350,60%,38%)]" },
  { title: "Events", icon: CalendarDays, path: "/temple/reports/events", description: "Event-wise budget, spend, resources & tasks", gradient: "from-[hsl(260,55%,55%)] to-[hsl(260,50%,42%)]" },
  { title: "Finance", icon: IndianRupee, path: "/temple/reports/finance", description: "Revenue trends, expense breakdown, audit trail", gradient: "from-[hsl(142,60%,38%)] to-[hsl(142,55%,28%)]" },
  { title: "Bookings", icon: Calendar, path: "/temple/reports/bookings", description: "Booking trends, cancellations, revenue", gradient: "from-[hsl(142,60%,40%)] to-[hsl(142,55%,30%)]" },
  { title: "Offerings", icon: Sparkles, path: "/temple/reports/offerings", description: "Seva bookings, category revenue, performance", gradient: "from-[hsl(45,90%,45%)] to-[hsl(35,85%,38%)]" },
  { title: "Projects", icon: FolderKanban, path: "/temple/reports/projects", description: "Progress tracking, budget utilization, milestones", gradient: "from-[hsl(220,55%,50%)] to-[hsl(220,50%,38%)]" },
  { title: "People & HR", icon: Users, path: "/temple/reports/hr", description: "Employee analytics, salary, shift & dept insights", gradient: "from-[hsl(200,60%,50%)] to-[hsl(200,55%,38%)]" },
  { title: "Devotees", icon: Users, path: "/temple/reports/devotees", description: "Demographics, engagement, volunteer analytics", gradient: "from-[hsl(142,55%,45%)] to-[hsl(142,50%,33%)]" },
  { title: "Communication", icon: MessageSquare, path: "/temple/reports/communication", description: "Outreach analytics, delivery & engagement", gradient: "from-[hsl(190,60%,45%)] to-[hsl(190,55%,33%)]" },
  { title: "Feedback", icon: MessageSquare, path: "/temple/reports/feedback", description: "Sentiment analysis, ratings, improvements", gradient: "from-[hsl(310,50%,50%)] to-[hsl(310,45%,38%)]" },
];


const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.04, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 400, damping: 25 },
  },
};

const ReportsDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(180deg, hsl(30 30% 97%) 0%, hsl(30 20% 95%) 100%)" }}>
      {/* Header */}
      <header className="border-b sticky top-0 z-20 border-border bg-card">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/temple-hub")} className="mr-1">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <BarChart3 className="h-5 w-5 text-primary" />
            <h1 className="text-xl font-bold text-primary">Reports Center</h1>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h2 className="text-2xl font-bold text-foreground">Module Reports</h2>
          <p className="text-sm text-muted-foreground mt-1">Select a module to view detailed analytics and reports</p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {moduleCards.map((mod) => (
            <motion.div key={mod.title} variants={itemVariants}>
              <Card
                className="cursor-pointer hover:shadow-lg transition-all duration-300 group border hover:-translate-y-1"
                onClick={() => navigate(mod.path)}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-2.5 rounded-xl bg-gradient-to-br ${mod.gradient} shadow-sm`}>
                      <mod.icon className="h-5 w-5 text-white" />
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <h3 className="font-semibold text-sm text-foreground">{mod.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">{mod.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </main>
    </div>
  );
};

export default ReportsDashboard;
