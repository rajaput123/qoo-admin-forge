import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, ClipboardList, Compass, PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLang, t } from "@/lib/i18n";

// In a real app these would come from auth/tenant context
const templeName = "Sri Venkateswara Temple";
const adminName = "Ramesh Kumar";

const journeyKeys: { t: string; d: string }[] = [
  { t: "j1_t", d: "j1_d" },
  { t: "j2_t", d: "j2_d" },
  { t: "j3_t", d: "j3_d" },
  { t: "j4_t", d: "j4_d" },
];

const Welcome = () => {
  const navigate = useNavigate();
  const [lang] = useLang();
  const completed = 0; // wire up when checklist persistence lands
  const progress = Math.round((completed / journeyKeys.length) * 100);

  const startTour = () => {
    localStorage.setItem("templeHubTourPending", "1");
    navigate("/temple-hub");
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center px-6 py-10"
      style={{ background: "linear-gradient(180deg, hsl(30 30% 97%) 0%, hsl(30 20% 92%) 100%)" }}
    >
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
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
          <p className="text-sm text-muted-foreground mb-1">{t("welcome_back", lang)}, {adminName} 🙏</p>
          <h1 className="text-3xl font-bold text-foreground mb-2">{templeName}</h1>
          <p className="text-muted-foreground max-w-md mx-auto text-sm">{t("welcome_intro", lang)}</p>
        </div>

        <Card className="mb-6 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-foreground">{t("setup_journey", lang)}</span>
              <span className="text-xs text-muted-foreground">{t("done_of", lang, { a: completed, b: journeyKeys.length })}</span>
            </div>
            <Progress value={progress} className="h-2 mb-5" />

            <div className="space-y-3">
              {journeyKeys.map((s, i) => (
                <motion.div
                  key={s.t}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.08 }}
                  className="flex items-start gap-3 p-3 rounded-lg bg-muted/40"
                >
                  <div className="h-7 w-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold flex-shrink-0">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{t(s.t, lang)}</p>
                    <p className="text-xs text-muted-foreground">{t(s.d, lang)}</p>
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
            {t("start_setup", lang)}
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="flex-1 gap-2"
            onClick={startTour}
          >
            <Compass className="h-4 w-4" />
            {t("quick_tour", lang)}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="text-center mt-4">
          <button
            onClick={() => navigate("/temple-hub")}
            className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
          >
            <Sparkles className="h-3 w-3" />
            {t("skip_dashboard", lang)}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Welcome;