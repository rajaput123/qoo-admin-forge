import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, ClipboardList, Compass, PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

// In a real app these would come from auth/tenant context
const templeName = "Sri Venkateswara Temple";
const adminName = "Ramesh Kumar";

const journeySteps = [
  { title: "Complete temple profile", description: "Add branding, contact info & timings" },
  { title: "Set up sevas & offerings", description: "Configure rituals, slots and pricing" },
  { title: "Enable donations", description: "Funds, receipts and 80G setup" },
  { title: "Invite your team", description: "Add staff and assign roles" },
];

const Welcome = () => {
  const navigate = useNavigate();
  const completed = 0; // wire up when checklist persistence lands
  const progress = Math.round((completed / journeySteps.length) * 100);

  const startTour = () => {
    localStorage.setItem("templeHubTourPending", "1");
    navigate("/temple-hub");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6 py-10"
      style={{ background: "linear-gradient(180deg, hsl(30 30% 97%) 0%, hsl(30 20% 92%) 100%)" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <PartyPopper className="h-8 w-8 text-primary" />
          </div>
          <p className="text-sm text-muted-foreground mb-1">Welcome back, {adminName} 🙏</p>
          <h1 className="text-3xl font-bold text-foreground mb-2">{templeName}</h1>
          <p className="text-muted-foreground max-w-md mx-auto text-sm">
            Let's get your temple fully ready on Digi Devalaya. Follow this short journey, or jump straight into the dashboard.
          </p>
        </div>

        <Card className="mb-6 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-foreground">Your setup journey</span>
              <span className="text-xs text-muted-foreground">{completed} of {journeySteps.length} done</span>
            </div>
            <Progress value={progress} className="h-2 mb-5" />

            <div className="space-y-3">
              {journeySteps.map((s, i) => (
                <motion.div
                  key={s.title}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.08 }}
                  className="flex items-start gap-3 p-3 rounded-lg bg-muted/40"
                >
                  <div className="h-7 w-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold flex-shrink-0">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{s.title}</p>
                    <p className="text-xs text-muted-foreground">{s.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            size="lg"
            className="flex-1 gap-2"
            onClick={() => navigate("/temple-welcome")}
          >
            <ClipboardList className="h-4 w-4" />
            Start guided setup
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="flex-1 gap-2"
            onClick={startTour}
          >
            <Compass className="h-4 w-4" />
            Take a quick tour
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="text-center mt-4">
          <button
            onClick={() => navigate("/temple-hub")}
            className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
          >
            <Sparkles className="h-3 w-3" />
            Skip for now, go to dashboard
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Welcome;