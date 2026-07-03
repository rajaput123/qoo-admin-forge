import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Zap, ArrowRight, CreditCard, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const creditPacks = [
  { id: "small", credits: 50, price: 499, popular: false },
  { id: "medium", credits: 150, price: 1199, popular: true },
  { id: "large", credits: 500, price: 2999, popular: false },
];

const OutOfCreditScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full text-center">
        <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
          <Zap className="h-10 w-10 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">You're Out of Credits</h1>
        <p className="text-muted-foreground mb-8">
          Your credit balance is zero. Recharge now to continue using platform features.
        </p>

        <div className="space-y-3 mb-8">
          {creditPacks.map((pack) => (
            <Card key={pack.id} className={`cursor-pointer hover:border-primary/50 transition-colors ${pack.popular ? "border-primary bg-primary/5" : ""}`}>
              <CardContent className="py-4 px-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${pack.popular ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                      <Gift className={`h-5 w-5 ${!pack.popular && "text-muted-foreground"}`} />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-foreground">
                        {pack.credits} Credits
                        {pack.popular && <span className="text-xs text-primary ml-2">Popular</span>}
                      </p>
                      <p className="text-xs text-muted-foreground">₹{pack.price.toLocaleString()}</p>
                    </div>
                  </div>
                  <Button size="sm" variant={pack.popular ? "default" : "outline"} className="gap-1">
                    <CreditCard className="h-3.5 w-3.5" /> Buy
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-3">
          <Button className="w-full gap-2" size="lg" onClick={() => navigate("/temple/settings/upgrade")}>
            View All Plans <ArrowRight className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => navigate("/temple-hub")} className="text-muted-foreground">
            Back to Dashboard
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default OutOfCreditScreen;
