/**
 * TempleQRPanel.tsx
 *
 * Displays the official temple QR code and UPI ID for counter/booking payments.
 * Used in the donation wizard payment step to enforce use of the official temple payment method.
 */
import { QRCodeSVG } from "qrcode.react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck, Copy, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

// ── Temple configuration ──────────────────────────────────────────────────────
// In production, these values should come from the temple settings API/store.
export const TEMPLE_CONFIG = {
  name: "Sri Venkateswara Temple",
  upiId: "temple.svt@hdfcbank",
  upiDisplayName: "Sri Venkateswara Temple",
  merchantCode: "SVT-001",
};

interface TempleQRPanelProps {
  amount: number;
  mode: "QR Code" | "UPI";
  paymentStatus: "Pending Payment" | "Paid";
  onConfirmPaid: () => void;
  referenceNo?: string;
  onReferenceNoChange?: (val: string) => void;
}

const TempleQRPanel = ({ amount, mode, paymentStatus, onConfirmPaid, referenceNo, onReferenceNoChange }: TempleQRPanelProps) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  // Build UPI deep-link string for QR code
  const upiString = `upi://pay?pa=${TEMPLE_CONFIG.upiId}&pn=${encodeURIComponent(TEMPLE_CONFIG.upiDisplayName)}&am=${amount}&cu=INR&tn=${encodeURIComponent("Temple Donation")}`;

  const copyUpiId = () => {
    navigator.clipboard.writeText(TEMPLE_CONFIG.upiId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({ title: "UPI ID copied!", description: TEMPLE_CONFIG.upiId });
    });
  };

  return (
    <div className="rounded-xl border bg-muted/10 overflow-hidden">
      {/* Official banner */}
      <div className="bg-primary/90 text-primary-foreground px-4 py-2.5 flex items-center gap-2">
        <ShieldCheck className="h-4 w-4 shrink-0" />
        <p className="text-sm font-medium">Official Temple Payment — Use only this QR / UPI ID</p>
      </div>

      <div className="p-5 space-y-5">
        {/* QR Code (shown for QR mode, or as secondary for UPI) */}
        {mode === "QR Code" && (
          <div className="flex flex-col items-center gap-3">
            <div className="p-4 bg-white rounded-2xl shadow-sm border">
              <QRCodeSVG
                value={upiString}
                size={180}
                level="M"
                includeMargin={false}
                imageSettings={{
                  src: "",
                  height: 0,
                  width: 0,
                  excavate: false,
                }}
              />
            </div>
            <div className="text-center space-y-0.5">
              <p className="text-xs text-muted-foreground">Scan with any UPI app</p>
              <p className="text-xs text-muted-foreground">(PhonePe, GPay, Paytm, BHIM…)</p>
            </div>
          </div>
        )}

        {/* UPI ID card */}
        <div className="rounded-xl border bg-background p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] text-muted-foreground uppercase tracking-wide">UPI ID</p>
              <p className="font-mono font-semibold text-base mt-0.5">{TEMPLE_CONFIG.upiId}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{TEMPLE_CONFIG.upiDisplayName}</p>
            </div>
            <Button size="sm" variant="outline" onClick={copyUpiId} className="shrink-0">
              {copied ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
              <span className="ml-1.5 text-xs">{copied ? "Copied" : "Copy"}</span>
            </Button>
          </div>
          <div className="flex items-center justify-between pt-2 border-t">
            <span className="text-sm text-muted-foreground">Amount to pay</span>
            <span className="font-bold text-lg">₹{amount.toLocaleString("en-IN")}</span>
          </div>
        </div>

        {/* UTR / Bank Reference capture */}
        {onReferenceNoChange && (
          <div className="rounded-xl border bg-background p-4 space-y-2">
            <Label className="text-xs">
              UTR / Bank Reference No <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Input
              value={referenceNo ?? ""}
              onChange={(e) => onReferenceNoChange(e.target.value)}
              placeholder="e.g. 412345678901"
              className="font-mono text-sm"
            />
            <p className="text-[11px] text-muted-foreground">
              Enter the UTR shown in the donor's UPI app for reconciliation.
            </p>
          </div>
        )}

        {/* Payment confirmation */}
        {paymentStatus !== "Paid" ? (
          <div className="space-y-2">
            <p className="text-xs text-center text-muted-foreground">
              After the donor completes payment, confirm it below
            </p>
            <Button className="w-full" onClick={onConfirmPaid}>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Confirm Payment Received
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-50 border border-emerald-200">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            <span className="font-semibold text-emerald-700">Payment Confirmed</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TempleQRPanel;
