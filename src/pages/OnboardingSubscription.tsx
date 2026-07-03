import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

/** Redirects to hub — subscription prompt is shown as a dialog there */
const OnboardingSubscription = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/temple-hub", { replace: true });
  }, [navigate]);

  return null;
};

export default OnboardingSubscription;
