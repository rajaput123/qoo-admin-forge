import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, Zap, ArrowLeft, CreditCard, Gift, Star, Crown, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { markSubscriptionComplete } from "@/lib/templeConfig";

const plans = [
  {
    id: "starter",
    name: "Starter",
    icon: Zap,
    monthlyPrice: 0,
    yearlyPrice: 0,
    credits: 100,
    features: ["Basic Temple Structure", "Up to 5 Sevas", "Single Admin", "Email Support", "Basic Reports"],
    highlighted: false,
    badge: "Free",
  },
  {
    id: "standard",
    name: "Standard",
    icon: Star,
    monthlyPrice: 4999,
    yearlyPrice: 49990,
    credits: 500,
    features: ["Full Temple Structure", "Unlimited Sevas", "Up to 10 Users", "Priority Support", "Advanced Reports", "Donation Management", "Booking Management"],
    highlighted: false,
    badge: null,
  },
  {
    id: "professional",
    name: "Professional",
    icon: Crown,
    monthlyPrice: 9999,
    yearlyPrice: 99990,
    credits: 2000,
    features: ["Everything in Standard", "Unlimited Users", "All Modules", "24/7 Support", "Custom Reports", "API Access", "Branch Management", "Event Management"],
    highlighted: true,
    badge: "Most Popular",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    icon: Shield,
    monthlyPrice: 19999,
    yearlyPrice: 199990,
    credits: 10000,
    features: ["Everything in Professional", "Dedicated Manager", "Custom Integrations", "SLA Guarantee", "On-premise Option", "White Label", "Multi-Temple", "Compliance Suite"],
    highlighted: false,
    badge: null,
  },
];

const creditPacks = [
  { credits: 50, price: 499 },
  { credits: 150, price: 1199 },
  { credits: 500, price: 2999 },
  { credits: 1000, price: 4999 },
];

const SubscriptionUpgrade = () => {
  const navigate = useNavigate();
  const [isYearly, setIsYearly] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const currentPlan = "starter";

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
    setShowCheckout(true);
  };

  const handleBuyCredits = (credits: number) => {
    toast.success(`${credits} credits added to cart`);
  };

  if (showCheckout && selectedPlan) {
    const plan = plans.find((p) => p.id === selectedPlan)!;
    const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => setShowCheckout(false)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Checkout</h1>
            <p className="text-sm text-muted-foreground">Complete your subscription upgrade</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Order Summary */}
          <Card>
            <CardHeader><CardTitle className="text-base">Order Summary</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm">{plan.name} Plan ({isYearly ? "Yearly" : "Monthly"})</span>
                <span className="font-medium">₹{price.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Credits included</span>
                <span>{plan.credits.toLocaleString()} / {isYearly ? "year" : "month"}</span>
              </div>
              {isYearly && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Annual savings</span>
                  <span>₹{((plan.monthlyPrice * 12) - plan.yearlyPrice).toLocaleString()}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>₹{price.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader><CardTitle className="text-base">Payment Method</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {["Credit / Debit Card", "UPI", "Net Banking"].map((method) => (
                  <button key={method} className="w-full text-left border rounded-lg p-3 hover:border-primary/50 transition-colors flex items-center gap-3">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{method}</span>
                  </button>
                ))}
              </div>

              <div className="space-y-2 mt-4">
                <Label className="text-sm">Coupon Code</Label>
                <div className="flex gap-2">
                  <Input placeholder="Enter code" className="text-sm" />
                  <Button variant="outline" size="sm">Apply</Button>
                </div>
              </div>

              <Button
                className="w-full gap-2 mt-4"
                size="lg"
                onClick={() => {
                  markSubscriptionComplete();
                  toast.success("Payment successful! Plan upgraded.");
                  navigate("/temple-hub");
                }}
              >
                Pay ₹{price.toLocaleString()}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Upgrade Plan</h1>
        <p className="text-sm text-muted-foreground mt-1">Choose the right plan for your temple</p>
      </div>

      {/* Billing Toggle */}
      <div className="flex items-center justify-center gap-3 py-4">
        <span className={`text-sm ${!isYearly ? "font-medium text-foreground" : "text-muted-foreground"}`}>Monthly</span>
        <Switch checked={isYearly} onCheckedChange={setIsYearly} />
        <span className={`text-sm ${isYearly ? "font-medium text-foreground" : "text-muted-foreground"}`}>
          Yearly <Badge variant="secondary" className="ml-1 text-[10px] text-green-700 bg-green-50">Save 17%</Badge>
        </span>
      </div>

      {/* Plan Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        {plans.map((plan) => {
          const isCurrent = plan.id === currentPlan;
          const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
          const Icon = plan.icon;

          return (
            <motion.div key={plan.id} whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
              <Card className={`relative h-full ${plan.highlighted ? "border-primary shadow-lg" : ""} ${isCurrent ? "border-green-300 bg-green-50/30" : ""}`}>
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className={plan.highlighted ? "bg-primary" : "bg-muted text-muted-foreground"}>{plan.badge}</Badge>
                  </div>
                )}
                <CardContent className="pt-8 pb-6 px-5">
                  <div className="text-center mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 ${plan.highlighted ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                      <Icon className={`h-6 w-6 ${!plan.highlighted && "text-foreground"}`} />
                    </div>
                    <h3 className="font-semibold text-foreground">{plan.name}</h3>
                    <div className="mt-2">
                      <span className="text-2xl font-bold">
                        {price === 0 ? "Free" : `₹${price.toLocaleString()}`}
                      </span>
                      {price > 0 && <span className="text-xs text-muted-foreground">/{isYearly ? "yr" : "mo"}</span>}
                    </div>
                    <div className="mt-1">
                      <Badge variant="outline" className="text-[10px]">
                        <Zap className="h-2.5 w-2.5 mr-1" /> {plan.credits.toLocaleString()} credits/{isYearly ? "yr" : "mo"}
                      </Badge>
                    </div>
                  </div>

                  <ul className="space-y-2 mb-6 text-xs">
                    {plan.features.map((f, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="h-3.5 w-3.5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{f}</span>
                      </li>
                    ))}
                  </ul>

                  {isCurrent ? (
                    <Button variant="outline" className="w-full" disabled>Current Plan</Button>
                  ) : (
                    <Button
                      variant={plan.highlighted ? "default" : "outline"}
                      className="w-full"
                      onClick={() => handleSelectPlan(plan.id)}
                    >
                      {price === 0 ? "Downgrade" : "Upgrade"}
                    </Button>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <Separator className="my-8" />

      {/* Buy Credits */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-1">Buy Extra Credits</h2>
        <p className="text-sm text-muted-foreground mb-4">Need more credits without upgrading? Purchase add-on packs.</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {creditPacks.map((pack) => (
            <Card key={pack.credits} className="cursor-pointer hover:border-primary/50 transition-colors">
              <CardContent className="py-4 px-4 text-center">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-2">
                  <Gift className="h-5 w-5 text-primary" />
                </div>
                <p className="font-semibold text-foreground">{pack.credits} Credits</p>
                <p className="text-sm text-muted-foreground mb-3">₹{pack.price.toLocaleString()}</p>
                <Button size="sm" variant="outline" className="w-full text-xs" onClick={() => handleBuyCredits(pack.credits)}>
                  Buy Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionUpgrade;
