import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import Pricing from "@/pages/Pricing";
import { dismissSubscriptionPrompt, shouldShowSubscriptionPrompt } from "@/lib/onboardingFlow";
import { isSubscriptionComplete } from "@/lib/templeConfig";

const OnboardingSubscription = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (isSubscriptionComplete() || !shouldShowSubscriptionPrompt()) {
      navigate("/temple-hub", { replace: true });
    }
  }, [navigate]);

  const skipToHub = () => {
    dismissSubscriptionPrompt();
    navigate("/temple-hub");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3 min-w-0">
            <div className="h-10 w-10 rounded-full bg-elite-orange/10 flex items-center justify-center shrink-0">
              <Crown className="h-5 w-5 text-elite-orange" />
            </div>
            <div className="min-w-0">
              <h1 className="text-base sm:text-lg font-semibold text-foreground">
                Please take a subscription
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                Choose a plan to unlock all modules — you can skip and subscribe later anytime.
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="shrink-0 gap-1.5 text-muted-foreground" onClick={skipToHub}>
            <X className="h-4 w-4" />
            Skip for now
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 pb-12">
        <Pricing embedded onboarding />
      </main>
    </div>
  );
};

export default OnboardingSubscription;
