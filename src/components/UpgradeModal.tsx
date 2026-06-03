import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Lock,
  Check,
  Sparkles,
  ArrowRight,
  Crown,
  Zap,
} from "lucide-react";
import {
  type Plan,
  getSuggestedPlans,
  MODULE_BENEFITS,
  formatPrice,
  getMinimumPlan,
} from "@/lib/plans";
import { useNavigate } from "react-router-dom";

interface UpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  moduleId: string;
  moduleTitle: string;
  moduleDescription: string;
}

const UpgradeModal = ({
  open,
  onOpenChange,
  moduleId,
  moduleTitle,
  moduleDescription,
}: UpgradeModalProps) => {
  const navigate = useNavigate();
  const suggestedPlans = getSuggestedPlans(moduleId);
  const benefits = MODULE_BENEFITS[moduleId] || [];
  const minPlan = getMinimumPlan(moduleId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[540px] p-0 overflow-hidden bg-card border-border">
        {/* Header */}
        <div className="relative px-6 pt-6 pb-4 bg-gradient-to-br from-primary/5 via-primary/3 to-transparent">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <DialogHeader className="space-y-1 text-left">
                <DialogTitle className="text-xl font-bold text-foreground">
                  Unlock {moduleTitle}
                </DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">
                  {moduleDescription}
                </DialogDescription>
              </DialogHeader>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="px-6 py-4">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            What you'll get
          </h4>
          <div className="space-y-2.5">
            {benefits.map((benefit, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center gap-3"
              >
                <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Check className="h-3 w-3 text-primary" />
                </div>
                <span className="text-sm text-foreground">{benefit}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Plans */}
        <div className="px-6 py-4 bg-muted/30 border-t border-border">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Available in these plans
          </h4>
          <div className="space-y-2.5">
            {suggestedPlans.map((plan, i) => (
              <motion.button
                key={plan.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.08 }}
                onClick={() => {
                  onOpenChange(false);
                  navigate("/temple/settings/upgrade");
                }}
                className={`w-full flex items-center gap-4 p-3.5 rounded-xl border transition-all hover:shadow-md ${
                  plan.recommended
                    ? "border-primary bg-primary/5 hover:bg-primary/8 ring-1 ring-primary/20"
                    : "border-border bg-card hover:bg-muted/50"
                }`}
              >
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">
                      {plan.name}
                    </span>
                    {plan.recommended && (
                      <Badge className="bg-primary text-primary-foreground text-[10px] px-1.5 py-0 h-5">
                        <Sparkles className="h-3 w-3 mr-0.5" />
                        Recommended
                      </Badge>
                    )}
                    {plan.badge && !plan.recommended && (
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5">
                        {plan.badge}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {plan.description}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-lg font-bold text-foreground">
                    {formatPrice(plan.price)}
                  </div>
                  {plan.price > 0 && (
                    <div className="text-[10px] text-muted-foreground">
                      {plan.period}
                    </div>
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Footer CTA */}
        <div className="px-6 py-4 flex gap-3 border-t border-border">
          <Button
            variant="outline"
            className="flex-1 gap-2"
            onClick={() => {
              onOpenChange(false);
              navigate("/temple/settings/subscription");
            }}
          >
            View All Plans
          </Button>
          <Button
            className="flex-1 gap-2"
            onClick={() => {
              onOpenChange(false);
              navigate("/temple/settings/upgrade");
            }}
          >
            <Zap className="h-4 w-4" />
            Upgrade Now
          </Button>
        </div>

        {/* Min plan hint */}
        {minPlan && minPlan.price > 0 && (
          <div className="px-6 pb-4 -mt-2">
            <p className="text-[11px] text-center text-muted-foreground">
              Available from <span className="font-semibold text-foreground">{minPlan.name}</span> plan and above
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UpgradeModal;
