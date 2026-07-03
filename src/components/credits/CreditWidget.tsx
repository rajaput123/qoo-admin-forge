import { Wallet, Eye, ArrowUp, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

interface CreditWidgetProps {
  planName?: string;
  creditsRemaining?: number;
  totalCredits?: number;
  renewalDate?: string;
}

const CreditWidget = ({
  planName = "Starter",
  creditsRemaining = 68,
  totalCredits = 100,
  renewalDate = "2026-03-15",
}: CreditWidgetProps) => {
  const navigate = useNavigate();
  const usagePercent = Math.round((creditsRemaining / totalCredits) * 100);
  const isLow = creditsRemaining <= 20;
  const isCritical = creditsRemaining <= 5;

  return (
    <div className={`rounded-2xl border p-5 ${isCritical ? "border-red-300 bg-red-50/50" : isLow ? "border-amber-300 bg-amber-50/30" : "bg-card"}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isCritical ? "bg-red-100" : isLow ? "bg-amber-100" : "bg-primary/10"}`}>
            <Wallet className={`h-4 w-4 ${isCritical ? "text-red-600" : isLow ? "text-amber-600" : "text-primary"}`} />
          </div>
          <div>
            <span className="text-sm font-medium text-foreground">Credit Balance</span>
            <Badge variant="secondary" className="ml-2 text-[10px]">{planName}</Badge>
          </div>
        </div>
        {isLow && (
          <Badge variant={isCritical ? "destructive" : "outline"} className={`text-xs ${!isCritical && "text-amber-700 border-amber-300 bg-amber-50"}`}>
            {isCritical ? "Critical" : "Low Credits"}
          </Badge>
        )}
      </div>

      <div className="mb-3">
        <div className="flex items-baseline gap-1 mb-2">
          <span className={`text-3xl font-bold ${isCritical ? "text-red-600" : isLow ? "text-amber-600" : "text-foreground"}`}>
            {creditsRemaining}
          </span>
          <span className="text-sm text-muted-foreground">/ {totalCredits}</span>
        </div>
        <Progress
          value={usagePercent}
          className={`h-2 ${isCritical ? "[&>div]:bg-red-500" : isLow ? "[&>div]:bg-amber-500" : ""}`}
        />
        <p className="text-xs text-muted-foreground mt-1.5">Renews on {renewalDate}</p>
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 gap-1 text-xs"
          onClick={() => navigate("/temple/settings/subscription")}
        >
          <Eye className="h-3 w-3" /> View Usage
        </Button>
        <Button
          size="sm"
          className="flex-1 gap-1 text-xs"
          onClick={() => navigate("/temple/settings/upgrade")}
        >
          <Zap className="h-3 w-3" /> Buy Credits
        </Button>
      </div>
    </div>
  );
};

export default CreditWidget;
