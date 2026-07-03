import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import DemoVideoModal from "@/components/DemoVideoModal";
import {
  Building2,
  Calendar,
  Heart,
  Users,
  BarChart3,
  ArrowRight,
  CheckCircle2,
  Play,
  Sparkles,
  Globe,
  Boxes,
  ClipboardList,
  GitBranch,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-temple.jpg";
import dashboardImage from "@/assets/dashboard-preview.jpg";
import templeInterior from "@/assets/temple-interior.jpg";
import multiTemple from "@/assets/multi-temple.jpg";

const features = [
  { icon: Sparkles, title: "Offerings & Sevas", desc: "Digital booking for rituals, darshan slots, and priest assignments" },
  { icon: Calendar, title: "Event Management", desc: "Plan festivals, cultural programs with resource allocation" },
  { icon: Heart, title: "Donation Tracking", desc: "80G receipts, fund allocation, campaign management" },
  { icon: Users, title: "Devotee CRM", desc: "Manage devotee database, segments, and engagement" },
  { icon: Boxes, title: "Inventory & Stock", desc: "Branch-isolated stock, supplier management, purchase orders" },
  { icon: ClipboardList, title: "Task Management", desc: "Operational task coordination across teams" },
  { icon: GitBranch, title: "Branch Management", desc: "Multi-branch operations with centralized governance" },
  { icon: Building2, title: "Institutions", desc: "Schools, hospitals, goshalas under one trust" },
  { icon: MapPin, title: "Crowd & Capacity", desc: "Real-time monitoring, zone configuration, alerts" },
  { icon: BarChart3, title: "Analytics & Reports", desc: "Feedback, sentiment analysis, and insights" },
];

const stats = [
  { value: "10,000+", label: "Temples" },
  { value: "500+", label: "Trusts" },
  { value: "2M+", label: "Devotees Served" },
  { value: "99.9%", label: "Uptime" },
];



const LandingPage = () => {
  const navigate = useNavigate();
  const [demoOpen, setDemoOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-bold text-primary"
          >
            Temple Admin
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <Button variant="ghost" size="sm" onClick={() => navigate("/login")}>
              Sign In
            </Button>
            <Button size="sm" onClick={() => navigate("/temple-register")} className="gap-1">
              Register Temple <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden pt-16">
        <div className="absolute inset-0">
          <img src={heroImage} alt="Temple complex at golden hour" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/30" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6">
              <Globe className="h-4 w-4 text-white/80" />
              <span className="text-sm text-white/80">Complete Temple Management Solution</span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-6">
              Digital Governance
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-400">
                for Temples
              </span>
            </h1>
            <p className="text-lg text-white/70 mb-8 max-w-lg leading-relaxed">
              Transform temple operations with a unified platform for offerings, donations, events, inventory, and multi-branch management.
            </p>
            <div className="flex flex-wrap gap-4 mb-4">
              <Button size="lg" onClick={() => navigate("/temple-hub")} className="h-12 px-8 text-base gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0">
                <Building2 className="h-4 w-4" /> Get Started
              </Button>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" variant="outline" onClick={() => setDemoOpen(true)} className="h-12 px-8 text-base text-white border-white/30 hover:bg-white/10 hover:text-white gap-2">
                <Play className="h-4 w-4" /> Watch Demo
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/temple-register")} className="h-12 px-8 text-base text-white border-white/30 hover:bg-white/10 hover:text-white gap-2">
                Register Temple <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-primary text-primary-foreground py-6">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl font-bold">{stat.value}</div>
                <div className="text-sm text-primary-foreground/70">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>



      {/* Features Grid */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything You Need to Run a Temple
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              20+ modules designed specifically for temple operations, from daily rituals to multi-year projects.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-card p-5 rounded-xl border border-border hover:border-primary/20 hover:shadow-md transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                  <f.icon className="h-5 w-5 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <h3 className="font-semibold text-sm text-foreground mb-1">{f.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Multi-Temple Network Section */}
      <section className="py-20 bg-background relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                One Trust.<br />
                <span className="text-primary">Infinite Temples.</span>
              </h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Manage branches, institutions, and sub-organizations under a single governance framework. Each entity operates independently while the trust maintains full visibility.
              </p>
              <div className="space-y-4">
                {[
                  "Branch-level stock, events, and volunteer isolation",
                  "Centralized trust dashboard with cross-branch analytics",
                  "Institution management for schools, hospitals, goshalas",
                  "Configurable resource sharing policies",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img
                src={multiTemple}
                alt="Connected temple network"
                className="rounded-2xl shadow-2xl border border-border"
              />
              <div className="absolute -bottom-4 -left-4 bg-card rounded-xl p-4 shadow-lg border border-border">
                <div className="text-2xl font-bold text-primary">500+</div>
                <div className="text-xs text-muted-foreground">Trusts Connected</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 brown-gradient relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-transparent" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Transform Your Temple?
            </h2>
            <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of temples already using our platform for digital governance and operational excellence.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => navigate("/temple-register")}
                className="h-12 px-8 text-base bg-white text-primary hover:bg-white/90 gap-2"
              >
                Register Your Temple <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/login")}
                className="h-12 px-8 text-base text-white border-white/30 hover:bg-white/10 hover:text-white"
              >
                Sign In
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-3">Temple Admin</h3>
              <p className="text-sm text-background/60 leading-relaxed">
                Complete digital operations platform for temples, trusts, and religious institutions.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-background/60">
                <li className="hover:text-background cursor-pointer transition-colors">Features</li>
                <li className="hover:text-background cursor-pointer transition-colors">
                  <a href="/pricing">Pricing</a>
                </li>
                <li className="hover:text-background cursor-pointer transition-colors">Documentation</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3">Solutions</h4>
              <ul className="space-y-2 text-sm text-background/60">
                <li className="hover:text-background cursor-pointer transition-colors">Single Temple</li>
                <li className="hover:text-background cursor-pointer transition-colors">Multi-Branch Trust</li>
                <li className="hover:text-background cursor-pointer transition-colors">Institutions</li>
                <li className="hover:text-background cursor-pointer transition-colors">Enterprise</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3">Support</h4>
              <ul className="space-y-2 text-sm text-background/60">
                <li className="hover:text-background cursor-pointer transition-colors">Help Center</li>
                <li className="hover:text-background cursor-pointer transition-colors">Contact Us</li>
                <li className="hover:text-background cursor-pointer transition-colors">Privacy Policy</li>
                <li className="hover:text-background cursor-pointer transition-colors">Terms of Service</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-background/10 pt-6 text-center text-sm text-background/40">
            © 2025 Temple Admin. All rights reserved.
          </div>
        </div>
      </footer>
      <DemoVideoModal open={demoOpen} onOpenChange={setDemoOpen} />
    </div>
  );
};

export default LandingPage;
