import { AlertTriangle, Zap, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface LowCreditBannerProps {
  creditsRemaining: number;
  onDismiss?: () => void;
}

const LowCreditBanner = ({ creditsRemaining, onDismiss }: LowCreditBannerProps) => {
  const navigate = useNavigate();
  const isCritical = creditsRemaining <= 5;

  if (creditsRemaining > 20) return null;

  return (
    <div className={`${isCritical ? "bg-red-50 border-red-200" : "bg-amber-50 border-amber-200"} border-b`}>
      <div className="max-w-5xl mx-auto px-6 py-2.5 flex items-center justify-between">
        <div className={`flex items-center gap-2 ${isCritical ? "text-red-800" : "text-amber-800"}`}>
          <AlertTriangle className="h-4 w-4" />
          <span className="text-sm font-medium">
            {isCritical
              ? `Critical: Only ${creditsRemaining} credits remaining. Some features may be restricted.`
              : `You have only ${creditsRemaining} credits left. Consider recharging.`}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Button
            size="sm"
            variant={isCritical ? "destructive" : "outline"}
            className="gap-1 h-7 text-xs"
            onClick={() => navigate("/temple/settings/upgrade")}
          >
            <Zap className="h-3 w-3" /> Buy Credits
          </Button>
          {onDismiss && (
            <button onClick={onDismiss} className={`p-1 rounded transition-colors ${isCritical ? "hover:bg-red-100" : "hover:bg-amber-100"}`}>
              <X className={`h-3.5 w-3.5 ${isCritical ? "text-red-600" : "text-amber-600"}`} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LowCreditBanner;
