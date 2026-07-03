import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Zap, AlertTriangle } from "lucide-react";

interface CreditConsumptionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  actionName: string;
  creditsRequired: number;
  creditsRemaining: number;
  onConfirm: () => void;
}

const CreditConsumptionModal = ({
  open,
  onOpenChange,
  actionName,
  creditsRequired,
  creditsRemaining,
  onConfirm,
}: CreditConsumptionModalProps) => {
  const [confirming, setConfirming] = useState(false);
  const hasEnough = creditsRemaining >= creditsRequired;
  const afterBalance = creditsRemaining - creditsRequired;
  const isLowAfter = afterBalance <= 20 && afterBalance > 0;

  const handleConfirm = async () => {
    setConfirming(true);
    await new Promise((r) => setTimeout(r, 400));
    onConfirm();
    setConfirming(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <Zap className="h-4 w-4 text-primary" /> Credit Confirmation
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-1">This action will consume</p>
            <p className="text-3xl font-bold text-foreground">{creditsRequired} <span className="text-base font-normal text-muted-foreground">credits</span></p>
            <p className="text-sm text-muted-foreground mt-1">for "{actionName}"</p>
          </div>

          <div className="bg-muted/50 rounded-lg p-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Current Balance</span>
              <span className="font-medium">{creditsRemaining}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Deduction</span>
              <span className="font-medium text-red-600">-{creditsRequired}</span>
            </div>
            <div className="border-t border-border pt-2 flex justify-between text-sm">
              <span className="text-muted-foreground">After Balance</span>
              <span className={`font-semibold ${!hasEnough ? "text-red-600" : isLowAfter ? "text-amber-600" : "text-foreground"}`}>
                {hasEnough ? afterBalance : "Insufficient"}
              </span>
            </div>
          </div>

          {isLowAfter && hasEnough && (
            <div className="flex items-center gap-2 text-amber-700 bg-amber-50 rounded-lg px-3 py-2 text-xs">
              <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
              <span>Your credit balance will be low after this action. Consider buying more credits.</span>
            </div>
          )}

          {!hasEnough && (
            <div className="flex items-center gap-2 text-red-700 bg-red-50 rounded-lg px-3 py-2 text-xs">
              <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
              <span>You don't have enough credits to perform this action.</span>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          {hasEnough ? (
            <Button onClick={handleConfirm} disabled={confirming} className="gap-1">
              {confirming ? "Processing..." : "Confirm & Proceed"}
            </Button>
          ) : (
            <Button onClick={() => {}} className="gap-1">
              <Zap className="h-3.5 w-3.5" /> Buy Credits
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreditConsumptionModal;
