import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { shouldShowSubscriptionPrompt } from "@/lib/onboardingFlow";

/** Legacy route — redirects to subscription prompt or hub */
const Welcome = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(shouldShowSubscriptionPrompt() ? "/onboarding/subscription" : "/temple-hub", { replace: true });
  }, [navigate]);

  return null;
};

export default Welcome;
