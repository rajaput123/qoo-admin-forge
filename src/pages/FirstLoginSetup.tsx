import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, Building2, Sparkles, Heart, Calendar, Users, Landmark, ArrowRight, PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  path: string;
  completed: boolean;
  optional?: boolean;
}

const FirstLoginSetup = () => {
  const navigate = useNavigate();
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    { id: "profile", title: "Complete Temple Profile", description: "Add branding, contact info, and timings", icon: Building2, path: "/temple/settings", completed: false },
    { id: "structure", title: "Add Temple Structure", description: "Set up shrines, halls, and sacred areas", icon: Landmark, path: "/temple/structure", completed: false },
    { id: "sevas", title: "Add Rituals / Sevas", description: "Configure offerings, darshan slots, and pricing", icon: Sparkles, path: "/temple/offerings", completed: false },
    { id: "donations", title: "Configure Donations", description: "Set up donation categories and 80G receipts", icon: Heart, path: "/temple/donations", completed: false },
    { id: "bookings", title: "Setup Bookings", description: "Enable online & counter booking for devotees", icon: Calendar, path: "/temple/bookings", completed: false },
    { id: "staff", title: "Invite Staff Members", description: "Add team members and assign roles", icon: Users, path: "/temple/settings/users", completed: false, optional: true },
  ]);

  const completedCount = checklist.filter((c) => c.completed).length;
  const totalRequired = checklist.filter((c) => !c.optional).length;
  const progressPercent = Math.round((completedCount / checklist.length) * 100);

  const toggleComplete = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  const allRequiredDone = checklist.filter((c) => !c.optional).every((c) => c.completed);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
          <h1 className="text-xl font-bold text-primary">Temple Admin</h1>
          <Button variant="ghost" size="sm" onClick={() => navigate("/temple-hub")} className="text-muted-foreground">
            Skip Setup →
          </Button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <PartyPopper className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Welcome to Temple Admin! 🙏</h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Complete these steps to get your temple fully set up on the platform. You can always come back to finish later.
          </p>
        </motion.div>

        {/* Progress */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-foreground">Setup Progress</span>
              <span className="text-sm text-muted-foreground">{completedCount} of {checklist.length} completed</span>
            </div>
            <Progress value={progressPercent} className="h-3 mb-2" />
            <p className="text-xs text-muted-foreground">{progressPercent}% complete</p>
          </CardContent>
        </Card>

        {/* Checklist */}
        <div className="space-y-3">
          {checklist.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.08 }}
            >
              <Card className={`transition-all ${item.completed ? "bg-muted/30 border-green-200" : "hover:border-primary/30"}`}>
                <CardContent className="py-4 px-5">
                  <div className="flex items-center gap-4">
                    <button onClick={() => toggleComplete(item.id)} className="flex-shrink-0">
                      {item.completed ? (
                        <CheckCircle2 className="h-6 w-6 text-green-600" />
                      ) : (
                        <Circle className="h-6 w-6 text-muted-foreground/40" />
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium ${item.completed ? "text-muted-foreground line-through" : "text-foreground"}`}>
                          {item.title}
                        </span>
                        {item.optional && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">Optional</span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1 text-xs flex-shrink-0"
                      onClick={() => navigate(item.path)}
                    >
                      <item.icon className="h-3.5 w-3.5" />
                      Open
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Action */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-10 text-center">
          <Button
            size="lg"
            className="gap-2 px-8"
            onClick={() => navigate("/temple-hub")}
          >
            {allRequiredDone ? "Go to Dashboard" : "Continue to Dashboard"}
            <ArrowRight className="h-4 w-4" />
          </Button>
          {!allRequiredDone && (
            <p className="text-xs text-muted-foreground mt-3">You can complete remaining steps anytime from Settings</p>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default FirstLoginSetup;
