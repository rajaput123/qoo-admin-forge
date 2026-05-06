import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Phone, ShieldCheck, KeyRound, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from "@/hooks/use-toast";
import heroImage from "@/assets/hero-temple.jpg";

type Step = "mobile" | "otp" | "reset" | "success";

const ForgotMpin = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("mobile");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [newMpin, setNewMpin] = useState("");
  const [confirmMpin, setConfirmMpin] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobile.length < 10) {
      toast({ title: "Enter a valid 10-digit mobile number", variant: "destructive" });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep("otp");
      toast({ title: "OTP sent to your mobile number" });
    }, 1000);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 6) {
      toast({ title: "Enter the 6-digit OTP", variant: "destructive" });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep("reset");
      toast({ title: "OTP verified successfully" });
    }, 1000);
  };

  const handleResetMpin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMpin.length < 4) {
      toast({ title: "MPIN must be 4 digits", variant: "destructive" });
      return;
    }
    if (newMpin !== confirmMpin) {
      toast({ title: "MPINs do not match", variant: "destructive" });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep("success");
    }, 1000);
  };

  const stepConfig = {
    mobile: {
      icon: Phone,
      title: "Forgot MPIN?",
      description: "Enter your registered mobile number to receive a verification OTP.",
    },
    otp: {
      icon: ShieldCheck,
      title: "Verify OTP",
      description: `Enter the 6-digit code sent to +91 ${mobile.slice(0, 2)}****${mobile.slice(-2)}`,
    },
    reset: {
      icon: KeyRound,
      title: "Set New MPIN",
      description: "Create a new 4-digit MPIN for your account.",
    },
    success: {
      icon: CheckCircle2,
      title: "MPIN Reset Successful!",
      description: "Your MPIN has been updated. You can now login with your new MPIN.",
    },
  };

  const current = stepConfig[step];
  const StepIcon = current.icon;

  return (
    <div className="flex min-h-screen">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-12">
        <img src={heroImage} alt="Temple" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/30" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-md text-center"
        >
          <div className="mb-8">
            <h1 className="text-5xl font-bold text-white mb-2 tracking-tight">Digi Devalaya</h1>
            <div className="w-12 h-0.5 bg-white/60 mx-auto" />
          </div>
          <h2 className="text-2xl font-semibold text-white/95 mb-4">
            Reset Your MPIN
          </h2>
          <p className="text-white/75 text-base leading-relaxed">
            Secure your temple account with a new MPIN in just a few steps.
          </p>
        </motion.div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-background">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-md"
        >
          <button
            onClick={() => navigate("/login")}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to login
          </button>

          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <h1 className="text-3xl font-bold text-primary">Digi Devalaya</h1>
            <p className="text-sm text-muted-foreground mt-1">Reset MPIN</p>
          </div>

          <div className="bg-card rounded-2xl card-shadow-lg p-8">
            {/* Step indicators */}
            {step !== "success" && (
            <div className="flex items-center justify-center gap-2 mb-6">
              {(["mobile", "otp", "reset"] as Step[]).map((s, i) => (
                <div key={s} className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                      step === s
                        ? "bg-primary text-primary-foreground"
                        : (["mobile", "otp", "reset"].indexOf(step) > i)
                          ? "bg-primary/20 text-primary"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {i + 1}
                  </div>
                  {i < 2 && (
                    <div className={`w-8 h-0.5 ${["mobile", "otp", "reset"].indexOf(step) > i ? "bg-primary/40" : "bg-muted"}`} />
                  )}
                </div>
              ))}
            </div>
            )}

            {/* Header */}
            <div className="text-center mb-6">
              <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <StepIcon className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground">{current.title}</h2>
              <p className="text-muted-foreground text-sm mt-1">{current.description}</p>
            </div>

            {/* Step: Mobile */}
            {step === "mobile" && (
              <motion.form
                key="mobile"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleSendOtp}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="mobile">Mobile Number</Label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
                      +91
                    </span>
                    <Input
                      id="mobile"
                      type="tel"
                      placeholder="98765 43210"
                      className="h-10 rounded-l-none"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      maxLength={10}
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full h-10 font-medium" disabled={loading}>
                  {loading ? "Sending OTP..." : "Send OTP"}
                </Button>
              </motion.form>
            )}

            {/* Step: OTP */}
            {step === "otp" && (
              <motion.form
                key="otp"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleVerifyOtp}
                className="space-y-4"
              >
                <div className="flex justify-center">
                  <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  Didn't receive the code?{" "}
                  <button type="button" className="text-primary hover:text-accent transition-colors font-medium">
                    Resend OTP
                  </button>
                </p>
                <Button type="submit" className="w-full h-10 font-medium" disabled={loading}>
                  {loading ? "Verifying..." : "Verify OTP"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  onClick={() => { setStep("mobile"); setOtp(""); }}
                >
                  Change mobile number
                </Button>
              </motion.form>
            )}

            {/* Step: Reset */}
            {step === "reset" && (
              <motion.form
                key="reset"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleResetMpin}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="new-mpin">New MPIN</Label>
                  <Input
                    id="new-mpin"
                    type="password"
                    placeholder="••••"
                    className="h-10 tracking-widest text-center"
                    maxLength={4}
                    value={newMpin}
                    onChange={(e) => setNewMpin(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-mpin">Confirm MPIN</Label>
                  <Input
                    id="confirm-mpin"
                    type="password"
                    placeholder="••••"
                    className="h-10 tracking-widest text-center"
                    maxLength={4}
                    value={confirmMpin}
                    onChange={(e) => setConfirmMpin(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  />
                  {confirmMpin.length === 4 && newMpin !== confirmMpin && (
                    <p className="text-xs text-destructive">MPINs do not match</p>
                  )}
                </div>
                <Button type="submit" className="w-full h-10 font-medium" disabled={loading}>
                  {loading ? "Resetting..." : "Reset MPIN"}
                </Button>
              </motion.form>
            )}
          </div>
        </motion.div>
            {/* Step: Success */}
            {step === "success" && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="text-center space-y-6"
              >
                <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle2 className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-foreground">{current.title}</h2>
                  <p className="text-muted-foreground text-sm mt-2">{current.description}</p>
                </div>
                <Button
                  onClick={() => navigate("/login")}
                  className="w-full h-10 font-medium"
                >
                  Go to Login
                </Button>
              </motion.div>
            )}
          </div>
    </div>
  );
};

export default ForgotMpin;
