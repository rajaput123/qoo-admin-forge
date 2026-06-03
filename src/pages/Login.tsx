import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Phone, Mail, ArrowLeft, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import heroImage from "@/assets/hero-temple.jpg";

type LoginRole = "super-admin" | "temple-admin";
type TempleAuthMethod = "password" | "otp";

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const roleParam = searchParams.get("role") as LoginRole | null;
  const role: LoginRole = roleParam === "temple-admin" ? "temple-admin" : "super-admin";

  const [showPassword, setShowPassword] = useState(false);
  const [authMethod, setAuthMethod] = useState<TempleAuthMethod>("password");
  const [otpSent, setOtpSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === "super-admin") {
      navigate("/temple-hub");
    } else {
      // Show Welcome page until setup is complete
      const setupDone = typeof window !== "undefined" && localStorage.getItem("templeSetupComplete") === "1";
      navigate(setupDone ? "/temple-hub" : "/welcome");
    }
  };

  const handleSendOtp = () => {
    setOtpSent(true);
  };

  const isTemple = role === "temple-admin";

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
            Digital Governance for Temples
          </h2>
          <p className="text-white/75 text-base leading-relaxed">
            {isTemple
              ? "Manage your temple operations digitally"
              : "Manage temple directory and onboarding at scale"
            }
          </p>
          <div className="mt-12 flex items-center justify-center gap-8 text-white/50 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-white/80">10K+</div>
              <div>Temples</div>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div className="text-center">
              <div className="text-2xl font-bold text-white/80">500+</div>
              <div>Organizations</div>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div className="text-center">
              <div className="text-2xl font-bold text-white/80">99.9%</div>
              <div>Uptime</div>
            </div>
          </div>
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
          {/* Back to website */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to website
          </button>

          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <h1 className="text-3xl font-bold text-primary">Digi Devalaya</h1>
            <p className="text-sm text-muted-foreground mt-1">Digital Governance for Temples</p>
          </div>

          <div className="bg-card rounded-2xl card-shadow-lg p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-foreground">
                {isTemple ? "Temple Login" : "Welcome back"}
              </h2>
              <p className="text-muted-foreground text-sm mt-1">
                {isTemple
                  ? "Access your temple management dashboard"
                  : "Sign in to your admin dashboard"
                }
              </p>
            </div>

            {isTemple ? (
              <>
                {/* Auth Method Toggle */}
                <div className="flex gap-2 mb-6">
                  <Button
                    type="button"
                    variant={authMethod === "password" ? "default" : "outline"}
                    size="sm"
                    onClick={() => { setAuthMethod("password"); setOtpSent(false); }}
                    className="flex-1 gap-2"
                  >
                    <Lock className="h-4 w-4" />
                    MPIN
                  </Button>
                  <Button
                    type="button"
                    variant={authMethod === "otp" ? "default" : "outline"}
                    size="sm"
                    onClick={() => { setAuthMethod("otp"); setOtpSent(false); }}
                    className="flex-1 gap-2"
                  >
                    <Phone className="h-4 w-4" />
                    OTP
                  </Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="mobile">Mobile Number</Label>
                    <Input id="mobile" type="tel" placeholder="+91 98765 43210" className="h-10" />
                  </div>

                  {authMethod === "password" ? (
                    <div className="space-y-2">
                      <Label htmlFor="temple-mpin">MPIN</Label>
                      <div className="relative">
                        <Input
                          id="temple-mpin"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••"
                          className="h-10 pr-10 tracking-widest text-center"
                          maxLength={4}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {!otpSent ? (
                        <Button type="button" variant="outline" className="w-full h-10" onClick={handleSendOtp}>
                          Send OTP
                        </Button>
                      ) : (
                        <div className="space-y-2">
                          <Label htmlFor="otp">Enter OTP</Label>
                          <Input id="otp" type="text" placeholder="Enter 6-digit OTP" className="h-10 text-center tracking-widest" maxLength={6} />
                          <p className="text-xs text-muted-foreground text-center">OTP sent to your mobile number</p>
                        </div>
                      )}
                    </>
                  )}

                  {(authMethod === "password" || otpSent) && (
                    <Button type="submit" className="w-full h-10 font-medium">Sign In</Button>
                  )}
                </form>

                <div className="mt-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    New temple?{" "}
                    <button onClick={() => navigate("/temple-register")} className="text-primary hover:text-accent font-medium transition-colors">
                      Register your temple
                    </button>
                  </p>
                </div>
              </>
            ) : (
            <>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="sa-mobile">Mobile Number</Label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
                        +91
                      </span>
                      <Input id="sa-mobile" type="tel" placeholder="98765 43210" className="h-10 rounded-l-none" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sa-mpin">MPIN</Label>
                    <div className="relative">
                      <Input
                        id="sa-mpin"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••"
                        className="h-10 pr-10 tracking-widest text-center"
                        maxLength={4}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Checkbox id="remember" />
                      <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">Remember me</Label>
                    </div>
                    <button type="button" onClick={() => navigate("/forgot-mpin")} className="text-sm text-primary hover:text-accent transition-colors">Forgot MPIN?</button>
                  </div>

                  <Button type="submit" className="w-full h-10 font-medium">Sign In</Button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    Don't have an account?{" "}
                    <button onClick={() => navigate("/temple-register")} className="text-primary hover:text-accent font-medium transition-colors">
                      Register
                    </button>
                  </p>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
