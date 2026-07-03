import { motion } from "framer-motion";
import {
  MapPin, Phone, Mail, Clock, Heart, Calendar, ChevronRight,
  Facebook, Instagram, Youtube, ArrowRight, Sparkles, Sun,
  Users, Gift, Camera, Flower2, Bell, PlayCircle, Star, Award,
  TrendingUp, Quote, ChevronDown, Building2, BookOpen, Megaphone,
  AlertCircle, Info, PartyPopper,
} from "lucide-react";
import templeHero from "@/assets/temple-hero.jpg";

interface ThemeConfig {
  colorScheme: string;
  fontStyle: string;
  heroTagline: string;
  welcomeMessage: string;
  template?: "plus" | "featured" | "advanced" | "custom";
  sections: {
    about: boolean; timings: boolean; gallery: boolean;
    donations: boolean; contact: boolean; sevas: boolean; events: boolean;
    childTemples?: boolean; sacredDetails?: boolean; announcements?: boolean;
  };
}

/* ─────── Modern color palettes per template ─────── */
const palettes: Record<string, {
  // raw HEX values for inline gradients (template previews live outside design tokens)
  bg: string; surface: string; text: string; muted: string;
  accent: string; accentSoft: string; gradient: string; heroGrad: string;
  brand: string; ring: string;
}> = {
  saffron: {
    bg: "#fffaf3", surface: "#ffffff", text: "#1a0f08", muted: "#7a5a3f",
    accent: "#ea580c", accentSoft: "#fff1e6",
    gradient: "linear-gradient(135deg,#f97316 0%,#ea580c 50%,#9a3412 100%)",
    heroGrad: "linear-gradient(135deg,#fef3c7 0%,#fed7aa 35%,#fb923c 100%)",
    brand: "#9a3412", ring: "rgba(234,88,12,0.18)",
  },
  maroon: {
    bg: "#1a0a10", surface: "#26121a", text: "#fde9ef", muted: "#b88a98",
    accent: "#f43f5e", accentSoft: "#3b1622",
    gradient: "linear-gradient(135deg,#f43f5e 0%,#be123c 50%,#4c0519 100%)",
    heroGrad: "linear-gradient(135deg,#1a0a10 0%,#3b0a1f 50%,#7f1d1d 100%)",
    brand: "#fda4af", ring: "rgba(244,63,94,0.25)",
  },
  gold: {
    bg: "#0a0a0a", surface: "#161312", text: "#fefce8", muted: "#a8a29e",
    accent: "#facc15", accentSoft: "#1f1a0a",
    gradient: "linear-gradient(135deg,#fde047 0%,#facc15 50%,#a16207 100%)",
    heroGrad: "linear-gradient(135deg,#0a0a0a 0%,#1c1917 50%,#451a03 100%)",
    brand: "#fde047", ring: "rgba(250,204,21,0.25)",
  },
  teal: {
    bg: "#f0fdfa", surface: "#ffffff", text: "#042f2e", muted: "#5b8a87",
    accent: "#0d9488", accentSoft: "#ccfbf1",
    gradient: "linear-gradient(135deg,#5eead4 0%,#0d9488 50%,#134e4a 100%)",
    heroGrad: "linear-gradient(135deg,#ccfbf1 0%,#5eead4 35%,#0d9488 100%)",
    brand: "#0f766e", ring: "rgba(13,148,136,0.18)",
  },
};

/* ─────── Demo data ─────── */
const data = {
  name: "Sri Venkateswara Swamy Temple",
  short: "Tirumala",
  deity: "Lord Venkateswara",
  est: "1509",
  location: "Tirumala Hills, Tirupati, AP",
  phone: "+91 877 227 7777",
  email: "info@tirumala.org",
  stats: [
    { v: "50K+", l: "Daily Devotees", icon: Users },
    { v: "₹3,000Cr", l: "Annual Seva", icon: Gift },
    { v: "515+", l: "Years of Faith", icon: Award },
    { v: "365", l: "Days Open", icon: TrendingUp },
  ],
  timings: [
    { n: "Suprabhatam", t: "3:00 AM", k: "Special" },
    { n: "Morning Darshan", t: "6:00 AM – 12:00 PM", k: "General" },
    { n: "Afternoon Pause", t: "12:00 – 1:00 PM", k: "Closed" },
    { n: "Evening Darshan", t: "1:00 PM – 7:00 PM", k: "General" },
    { n: "Sahasra Deepalankarana", t: "7:00 PM", k: "Special" },
    { n: "Ekanta Seva", t: "10:00 PM", k: "Special" },
  ],
  sevas: [
    { n: "Suprabhatam Seva", p: "₹300", d: "Wake-up hymns to the Lord", img: "🌅", tag: "Popular" },
    { n: "Thomala Seva", p: "₹500", d: "Sacred garland decoration", img: "🌸", tag: "Daily" },
    { n: "Archana", p: "₹150", d: "Chanting of 108 divine names", img: "🪔", tag: "Quick" },
    { n: "Kalyanotsavam", p: "₹10,000", d: "Celestial wedding ceremony", img: "💍", tag: "Premium" },
  ],
  events: [
    { n: "Brahmotsavam", d: "Oct 1 – 9", desc: "9-day grand annual festival", emoji: "🎊" },
    { n: "Vaikunta Ekadasi", d: "Dec 22", desc: "Gateway to Vaikuntam opens", emoji: "🚪" },
    { n: "Rathasapthami", d: "Feb 15", desc: "Sacred chariot festival", emoji: "🛕" },
    { n: "Ugadi", d: "Mar 22", desc: "Telugu New Year abhishekam", emoji: "🌺" },
  ],
  gallery: ["Main Gopuram", "Golden Vimana", "Padmavathi", "Hundi Hall", "Garuda Mandapam", "Night Aarti"],
  testimonial: {
    text: "Visiting Tirumala is not a journey — it is a homecoming. The serenity, devotion and divine grace touch your soul.",
    by: "Ramesh Iyer", role: "Devotee since 1985",
  },
  childTemples: [
    { name: "Padmavathi Ammavari Temple", location: "Tiruchanur, Tirupati", deity: "Goddess Padmavathi", emoji: "🌸", timings: "6 AM – 8 PM", distance: "3 km" },
    { name: "Govindaraja Swamy Temple", location: "Tirupati Town", deity: "Lord Govindaraja", emoji: "🛕", timings: "6 AM – 9 PM", distance: "12 km" },
    { name: "Kapila Theertham Temple", location: "Tirupati", deity: "Lord Shiva", emoji: "🔱", timings: "5 AM – 8 PM", distance: "8 km" },
    { name: "Sri Kodandarama Swamy Temple", location: "Tirupati", deity: "Lord Rama", emoji: "🏹", timings: "6 AM – 8 PM", distance: "5 km" },
  ],
  sacredDetails: {
    scriptures: [
      { t: "Sri Venkateswara Swamy", desc: "Principal deity enshrined in the Garbhagriha — Lord Venkateswara, the Kaliyuga Daivam" },
      { t: "Sri Bhudevi & Sri Sridevi", desc: "Consorts of Lord Venkateswara enshrined on either side of the sanctum" },
      { t: "Yoga Narasimha Swamy", desc: "Fierce form of Lord Vishnu enshrined in the Snapana Mandapam" },
      { t: "Sri Varadaraja Swamy", desc: "Benevolent form of Lord Vishnu worshipped in the inner prakara" },
    ],
    rituals: [
      { t: "Sri Ramanujacharya Adhishtanam", emoji: "🛕", desc: "Sacred samadhi of the revered Vaishnava philosopher-saint Sri Ramanujacharya" },
      { t: "Sri Annangaracharya Brindavanam", emoji: "🌸", desc: "Samadhi of the composer of Venkatesha Suprabhatam, located in the inner complex" },
      { t: "Hathiramji Mutt Adhishtanam", emoji: "✨", desc: "Ancient mutt serving the temple since the 16th century, with sacred shrines within" },
      { t: "Sri Govindaraja Swamy Shrine", emoji: "🔱", desc: "Reclining form of Lord Vishnu enshrined in the outer prakara of the main temple" },
    ],
    significance: "Tirumala is considered the most sacred Vaishnava shrine in the world. The presiding deity, Lord Venkateswara, is believed to be the Kaliyuga Daivam — the God of this era. The seven hills represent the seven-headed serpent Adisesha, and the temple sits atop the highest hill at 3,200 feet.",
  },
  announcements: [
    { id: 1, type: "urgent", title: "Brahmotsavam 2024 — Booking Now Open", desc: "Online booking for Brahmotsavam special sevas starts Sep 1. Limited slots available.", date: "Sep 1 – Oct 9", emoji: "🎊" },
    { id: 2, type: "info", title: "New Darshan Token System", desc: "Digital token-based darshan queue system launched for smoother devotee experience.", date: "From Aug 15", emoji: "📱" },
    { id: 3, type: "festival", title: "Vaikunta Ekadasi — Vaikunta Dwara Darshanam", desc: "The golden gate to Vaikuntam opens at 3 AM on Dec 22. Early registration mandatory.", date: "Dec 22", emoji: "🚪" },
    { id: 4, type: "info", title: "Dress Code Strictly Enforced", desc: "Traditional attire mandatory. Men: Dhoti/Veshti. Women: Saree/Churidar. No shorts or sleeveless.", date: "Ongoing", emoji: "👘" },
  ],
};

/* ─────── Reusable bits ─────── */
const Eyebrow = ({ children, color }: { children: React.ReactNode; color: string }) => (
  <div className="inline-flex items-center gap-2 mb-4">
    <span className="h-px w-8" style={{ background: color, opacity: 0.4 }} />
    <span className="text-[10px] uppercase tracking-[0.3em] font-bold" style={{ color }}>{children}</span>
    <span className="h-px w-8" style={{ background: color, opacity: 0.4 }} />
  </div>
);

const TempleWebsitePreview = ({ theme }: { theme: ThemeConfig }) => {
  const p = palettes[theme.colorScheme] || palettes.saffron;
  const dark = theme.colorScheme === "maroon" || theme.colorScheme === "gold";

  return (
    <div className="w-full antialiased" style={{ background: p.bg, color: p.text, fontFamily: "'Inter',system-ui,sans-serif" }}>

      {/* ═══════ FLOATING NAV ═══════ */}
      <nav className="sticky top-0 z-30 backdrop-blur-xl border-b" style={{
        background: dark ? "rgba(20,10,16,0.75)" : "rgba(255,255,255,0.75)",
        borderColor: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
      }}>
        <div className="max-w-6xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl flex items-center justify-center text-white text-lg shadow-lg" style={{ background: p.gradient }}>
              ॐ
            </div>
            <div>
              <div className="text-[15px] font-bold tracking-tight leading-none" style={{ color: p.text }}>{data.short}</div>
              <div className="text-[9px] tracking-[0.2em] uppercase mt-0.5" style={{ color: p.muted }}>Divine Sanctuary</div>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-7 text-[13px] font-medium" style={{ color: p.muted }}>
            <span style={{ color: p.text }}>Home</span>
            {theme.sections.about && <span className="cursor-pointer hover:opacity-100">About</span>}
            {theme.sections.sevas && <span className="cursor-pointer">Sevas</span>}
            {theme.sections.events && <span className="cursor-pointer">Events</span>}
            {theme.sections.gallery && <span className="cursor-pointer">Gallery</span>}
          </div>
          <button className="rounded-full px-4 py-2 text-xs font-semibold text-white shadow-md flex items-center gap-1.5" style={{ background: p.gradient }}>
            <Calendar className="h-3.5 w-3.5" /> Book Darshan
          </button>
        </div>
      </nav>

      {/* ═══════ HERO — ASYMMETRIC EDITORIAL ═══════ */}
      {/* ═══════ HERO — CINEMATIC FULL-BLEED ═══════ */}
      <section className="relative w-full overflow-hidden" style={{ height: "min(92vh, 820px)", minHeight: 620 }}>
        {/* Background image with slow Ken-Burns */}
        <motion.div
          initial={{ scale: 1.08 }}
          animate={{ scale: 1.18 }}
          transition={{ duration: 22, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <img
            src={templeHero}
            alt="Temple gopuram at golden hour"
            className="h-full w-full object-cover object-center"
          />
        </motion.div>

        {/* Strong readability gradient — dark at top + bottom */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 30%, rgba(0,0,0,0.45) 65%, rgba(0,0,0,0.85) 100%)",
          }}
        />
        {/* Color tint */}
        <div
          className="absolute inset-0 mix-blend-soft-light opacity-60"
          style={{ background: `linear-gradient(135deg, ${p.accent} 0%, transparent 70%)` }}
        />
        {/* Left-side readability gradient */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 40%, transparent 70%)",
          }}
        />

        {/* Floating glass info pill — top right */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="absolute top-24 right-6 z-20 hidden md:flex items-center gap-2 rounded-full backdrop-blur-xl bg-white/10 border border-white/25 px-4 py-2 text-white text-xs font-medium shadow-2xl"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          Live Aarti · 12,408 watching
        </motion.div>

        {/* Content — vertically centered */}
        <div className="relative z-10 h-full max-w-6xl mx-auto px-6 flex flex-col justify-center pt-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 mb-6 text-[11px] font-semibold text-white backdrop-blur-md bg-white/15 border border-white/25 shadow-lg">
              <Sparkles className="h-3 w-3" style={{ color: "#fde047" }} />
              <span className="tracking-[0.2em] uppercase">{data.short} · Est. {data.est}</span>
            </div>

            <h1
              className="font-black tracking-tight text-white mb-5"
              style={{
                fontSize: "clamp(38px, 7vw, 84px)",
                lineHeight: 0.95,
                textShadow: "0 4px 30px rgba(0,0,0,0.5)",
              }}
            >
              Where the{" "}
              <span
                className="italic font-serif"
                style={{
                  background: p.gradient,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  filter: "drop-shadow(0 2px 12px rgba(0,0,0,0.3))",
                }}
              >
                divine
              </span>
              <br />
              meets devotion.
            </h1>

            <p
              className="text-base md:text-lg text-white leading-relaxed mb-8 max-w-xl font-normal"
              style={{ textShadow: "0 2px 16px rgba(0,0,0,0.8), 0 1px 3px rgba(0,0,0,0.6)" }}
            >
              {theme.heroTagline}
            </p>

            <div className="flex gap-3 flex-wrap">
              <button
                className="px-7 py-3.5 rounded-full text-sm font-bold text-white shadow-2xl flex items-center gap-2 hover:scale-[1.03] transition-transform"
                style={{
                  background: p.gradient,
                  boxShadow: `0 18px 40px -10px ${p.ring}, 0 4px 12px rgba(0,0,0,0.3)`,
                }}
              >
                <Calendar className="h-4 w-4" /> Book Darshan <ArrowRight className="h-4 w-4" />
              </button>
              <button className="px-7 py-3.5 rounded-full text-sm font-semibold text-white flex items-center gap-2 backdrop-blur-md bg-white/10 border border-white/30 hover:bg-white/20 transition-colors">
                <PlayCircle className="h-4 w-4" /> Watch Live Aarti
              </button>
            </div>
          </motion.div>
        </div>

        {/* Bottom info strip — glassmorphic, anchored */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="absolute bottom-6 left-6 right-6 z-10 max-w-6xl mx-auto"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 rounded-2xl overflow-hidden backdrop-blur-2xl bg-black/30 border border-white/15 shadow-2xl divide-x divide-white/10">
            {[
              { l: "Next Darshan", v: "6:00 AM", s: "Tomorrow" },
              { l: "Today's Seva", v: "Suprabhatam", s: "₹300" },
              { l: "Festival", v: "Brahmotsavam", s: "in 12 days" },
              { l: "Devotees Today", v: "48,237", s: "Live now" },
            ].map((item) => (
              <div key={item.l} className="px-5 py-4">
                <div className="text-[10px] uppercase tracking-[0.18em] text-white/60 font-semibold mb-1">
                  {item.l}
                </div>
                <div className="text-base md:text-lg font-bold text-white leading-tight truncate">
                  {item.v}
                </div>
                <div className="text-[11px] mt-0.5 font-medium" style={{ color: "#fde047" }}>
                  {item.s}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ═══════ STATS BAR ═══════ */}
      <section className="border-y" style={{ borderColor: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)", background: p.surface }}>
        <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
          {data.stats.map(s => (
            <div key={s.l} className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl flex items-center justify-center" style={{ background: p.accentSoft }}>
                <s.icon className="h-5 w-5" style={{ color: p.accent }} />
              </div>
              <div>
                <div className="text-2xl font-black tracking-tight" style={{ color: p.text }}>{s.v}</div>
                <div className="text-[11px] font-medium uppercase tracking-wider" style={{ color: p.muted }}>{s.l}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════ ABOUT — TWO COLUMN EDITORIAL ═══════ */}
      {theme.sections.about && (
        <section className="py-24" style={{ background: p.bg }}>
          <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-12 gap-12 items-center">
            <div className="md:col-span-5">
              <div className="aspect-[4/5] rounded-3xl shadow-2xl overflow-hidden relative" style={{ background: p.gradient }}>
                <div className="absolute inset-0 flex items-center justify-center text-[200px] opacity-30">🛕</div>
                <div className="absolute top-6 left-6 right-6 flex items-center justify-between text-white">
                  <div className="text-[10px] uppercase tracking-[0.2em] opacity-80">Established</div>
                  <div className="text-2xl font-black">{data.est}</div>
                </div>
              </div>
            </div>
            <div className="md:col-span-7">
              <Eyebrow color={p.accent}>Our Story</Eyebrow>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-[1.05] mb-6" style={{ color: p.text }}>
                A timeless sanctuary<br/>of <span className="italic font-serif" style={{ color: p.accent }}>faith</span> & devotion.
              </h2>
              <p className="text-base leading-[1.85] mb-6" style={{ color: p.muted }}>
                Nestled atop the seven sacred hills of Tirumala, our temple has been a beacon of spiritual solace for over five centuries. Dedicated to Lord Venkateswara, an incarnation of Lord Vishnu, this divine abode welcomes millions of devotees every year seeking blessings, peace, and divine grace.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { t: "Sacred Hills", d: "3,200 ft above sea" },
                  { t: "Daily Aartis", d: "8 ceremonies" },
                  { t: "365 Days", d: "Open year-round" },
                  { t: "Heritage", d: "UNESCO recognized" },
                ].map(f => (
                  <div key={f.t} className="rounded-2xl p-4 border" style={{
                    background: p.surface,
                    borderColor: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)",
                  }}>
                    <div className="text-sm font-bold" style={{ color: p.text }}>{f.t}</div>
                    <div className="text-xs mt-0.5" style={{ color: p.muted }}>{f.d}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ═══════ CHILD TEMPLES ═══════ */}
      {theme.sections.childTemples && (
        <section className="py-24" style={{ background: p.surface }}>
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-14">
              <Eyebrow color={p.accent}>Associated Temples</Eyebrow>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-3" style={{ color: p.text }}>
                Child <span className="italic font-serif" style={{ color: p.accent }}>Temples</span>
              </h2>
              <p className="text-sm max-w-xl mx-auto" style={{ color: p.muted }}>
                Visit the sacred temples associated with Tirumala — each a divine abode in its own right.
              </p>
            </div>

            <div className={data.childTemples.length === 1
              ? 'max-w-sm mx-auto'
              : data.childTemples.length === 2
              ? 'grid md:grid-cols-2 gap-5 max-w-3xl mx-auto'
              : 'grid md:grid-cols-2 lg:grid-cols-4 gap-5'
            }>
              {data.childTemples.map((ct, i) => (
                <motion.div
                  key={ct.name}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                  className="group rounded-2xl overflow-hidden border cursor-pointer transition-all hover:-translate-y-2 hover:shadow-2xl"
                  style={{ background: p.bg, borderColor: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)" }}
                >
                  {/* Gradient top banner */}
                  <div className="h-36 relative overflow-hidden flex flex-col items-center justify-center" style={{ background: p.gradient }}>
                    <div className="absolute inset-0 opacity-15" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "14px 14px" }} />
                    {/* Floating emoji */}
                    <div className="relative z-10 text-5xl mb-2 drop-shadow-lg group-hover:scale-110 transition-transform duration-300">
                      {ct.emoji}
                    </div>
                    {/* Distance badge — top right */}
                    <div className="absolute top-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-md bg-white/20 border border-white/30 text-white">
                      {ct.distance}
                    </div>
                  </div>

                  {/* Card body */}
                  <div className="p-5">
                    <div className="text-base font-bold leading-tight mb-1" style={{ color: p.text }}>{ct.name}</div>
                    <div className="text-xs font-semibold mb-3" style={{ color: p.accent }}>{ct.deity}</div>

                    {/* Info rows */}
                    <div className="space-y-2 pt-3 border-t" style={{ borderColor: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }}>
                      <div className="flex items-center gap-2 text-[11px]" style={{ color: p.muted }}>
                        <MapPin className="h-3 w-3 shrink-0" style={{ color: p.accent }} />
                        <span className="truncate">{ct.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px]" style={{ color: p.muted }}>
                        <Clock className="h-3 w-3 shrink-0" style={{ color: p.accent }} />
                        <span>{ct.timings}</span>
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="mt-4 flex items-center justify-between text-[11px] font-semibold" style={{ color: p.accent }}>
                      <span>View details</span>
                      <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}


      {/* ═══════ ADHISHTANAMS ═══════ */}
      {theme.sections.sacredDetails && (
        <section className="py-24" style={{ background: p.bg }}>
          <div className="max-w-6xl mx-auto px-6">

            {/* Header */}
            <div className="text-center mb-16">
              <Eyebrow color={p.accent}>Sacred Shrines</Eyebrow>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4" style={{ color: p.text }}>
                Adhish<span className="italic font-serif" style={{ color: p.accent }}>tanams</span>
              </h2>
              <p className="text-sm leading-relaxed max-w-2xl mx-auto" style={{ color: p.muted }}>
                {data.sacredDetails.significance}
              </p>
            </div>

            {/* Deity Shrines — premium 2×2 gradient cards */}
            {data.sacredDetails.scriptures.length > 0 && (
              <div className="mb-16">
                <div className="flex items-center gap-3 mb-8">
                  <div className="h-px flex-1" style={{ background: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)" }} />
                  <span className="text-[11px] uppercase tracking-[0.25em] font-bold px-4" style={{ color: p.accent }}>Deity Shrines</span>
                  <div className="h-px flex-1" style={{ background: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)" }} />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {data.sacredDetails.scriptures.map((s, i) => (
                    <motion.div
                      key={s.t}
                      initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                      className="group rounded-2xl overflow-hidden border cursor-pointer transition-all hover:-translate-y-1 hover:shadow-2xl"
                      style={{ background: p.surface, borderColor: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)" }}
                    >
                      {/* Gradient top band with deity number */}
                      <div className="h-28 relative flex items-center justify-center" style={{ background: p.gradient }}>
                        <div className="absolute inset-0 opacity-15" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "14px 14px" }} />
                        <div className="relative text-center text-white">
                          <div className="text-4xl mb-1">🛕</div>
                          <div className="text-[9px] uppercase tracking-[0.2em] opacity-70 font-semibold">Shrine {i + 1}</div>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="text-sm font-bold leading-tight mb-2" style={{ color: p.text }}>{s.t}</div>
                        <div className="text-[11px] leading-relaxed" style={{ color: p.muted }}>{s.desc}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Samadhi & Brindavana — elegant timeline */}
            {data.sacredDetails.rituals.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-8">
                  <div className="h-px flex-1" style={{ background: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)" }} />
                  <span className="text-[11px] uppercase tracking-[0.25em] font-bold px-4" style={{ color: p.accent }}>Samadhi & Brindavana</span>
                  <div className="h-px flex-1" style={{ background: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)" }} />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {data.sacredDetails.rituals.map((r, i) => (
                    <motion.div
                      key={r.t}
                      initial={{ opacity: 0, x: i % 2 === 0 ? -16 : 16 }} whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                      className="group flex items-start gap-4 rounded-2xl p-5 border transition-all hover:shadow-xl cursor-pointer"
                      style={{ background: p.surface, borderColor: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)" }}
                    >
                      {/* Left accent line */}
                      <div className="w-1 self-stretch rounded-full shrink-0" style={{ background: p.gradient, minHeight: 48 }} />
                      <div className="h-12 w-12 rounded-xl flex items-center justify-center text-2xl shrink-0" style={{ background: p.accentSoft }}>
                        {r.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold mb-1 leading-tight" style={{ color: p.text }}>{r.t}</div>
                        <div className="text-[11px] leading-relaxed" style={{ color: p.muted }}>{r.desc}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </section>
      )}


      {/* ═══════ TIMINGS ═══════ */}
      {theme.sections.timings && (
        <section className="py-24" style={{ background: p.surface }}>
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-14">
              <Eyebrow color={p.accent}>Daily Schedule</Eyebrow>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight" style={{ color: p.text }}>
                Plan your <span className="italic font-serif" style={{ color: p.accent }}>darshan</span>
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {data.timings.map((t, i) => (
                <motion.div
                  key={t.n} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                  className="group rounded-2xl p-6 border transition-all hover:shadow-xl"
                  style={{
                    background: p.bg,
                    borderColor: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
                  }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ background: p.accentSoft }}>
                      <Clock className="h-5 w-5" style={{ color: p.accent }} />
                    </div>
                    <span className="text-[9px] uppercase tracking-wider font-bold px-2 py-1 rounded-full" style={{
                      background: t.k === "Special" ? "#fef3c7" : t.k === "Closed" ? "#fee2e2" : "#d1fae5",
                      color: t.k === "Special" ? "#92400e" : t.k === "Closed" ? "#991b1b" : "#065f46",
                    }}>{t.k}</span>
                  </div>
                  <div className="text-base font-bold mb-1" style={{ color: p.text }}>{t.n}</div>
                  <div className="text-sm font-medium" style={{ color: p.accent }}>{t.t}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════ SEVAS — RICH CARDS ═══════ */}
      {theme.sections.sevas && (
        <section className="py-24" style={{ background: p.bg }}>
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
              <div>
                <Eyebrow color={p.accent}>Sacred Offerings</Eyebrow>
                <h2 className="text-4xl md:text-5xl font-black tracking-tight" style={{ color: p.text }}>
                  Book a <span className="italic font-serif" style={{ color: p.accent }}>seva</span>
                </h2>
              </div>
              <button className="text-sm font-semibold flex items-center gap-1" style={{ color: p.accent }}>
                View all sevas <ArrowRight className="h-4 w-4" />
              </button>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {data.sevas.map((s, i) => (
                <motion.div
                  key={s.n} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                  className="group rounded-3xl overflow-hidden border transition-all hover:-translate-y-1 hover:shadow-2xl cursor-pointer"
                  style={{
                    background: p.surface,
                    borderColor: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)",
                  }}
                >
                  <div className="h-40 relative flex items-center justify-center text-7xl" style={{ background: p.gradient }}>
                    <div className="absolute inset-0 opacity-20" style={{
                      backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
                      backgroundSize: "20px 20px",
                    }} />
                    <span className="relative">{s.img}</span>
                    <span className="absolute top-3 right-3 text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-full bg-white/90 text-gray-900">{s.tag}</span>
                  </div>
                  <div className="p-5">
                    <div className="text-base font-bold mb-1" style={{ color: p.text }}>{s.n}</div>
                    <div className="text-xs leading-relaxed mb-4" style={{ color: p.muted }}>{s.d}</div>
                    <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)" }}>
                      <div className="text-xl font-black" style={{ color: p.accent }}>{s.p}</div>
                      <div className="h-9 w-9 rounded-full flex items-center justify-center transition-all group-hover:scale-110" style={{ background: p.gradient }}>
                        <ChevronRight className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════ EVENTS — TIMELINE ═══════ */}
      {theme.sections.events && (
        <section className="py-24" style={{ background: p.surface }}>
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-14">
              <Eyebrow color={p.accent}>Sacred Calendar</Eyebrow>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight" style={{ color: p.text }}>
                Upcoming <span className="italic font-serif" style={{ color: p.accent }}>festivals</span>
              </h2>
            </div>
            <div className="space-y-3">
              {data.events.map((e, i) => (
                <motion.div
                  key={e.n} initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                  className="group flex items-center gap-5 rounded-2xl p-5 border transition-all hover:shadow-lg"
                  style={{
                    background: p.bg,
                    borderColor: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)",
                  }}
                >
                  <div className="h-16 w-16 rounded-2xl flex items-center justify-center text-3xl shrink-0" style={{ background: p.gradient }}>
                    {e.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-lg font-bold" style={{ color: p.text }}>{e.n}</div>
                    <div className="text-sm" style={{ color: p.muted }}>{e.desc}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-bold" style={{ color: p.accent }}>{e.d}</div>
                    <div className="text-[10px] uppercase tracking-wider" style={{ color: p.muted }}>2024</div>
                  </div>
                  <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" style={{ color: p.muted }} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════ GALLERY — BENTO ═══════ */}
      {theme.sections.gallery && (
        <section className="py-24" style={{ background: p.bg }}>
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <Eyebrow color={p.accent}>Glimpses</Eyebrow>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight" style={{ color: p.text }}>
                Sacred <span className="italic font-serif" style={{ color: p.accent }}>moments</span>
              </h2>
            </div>
            <div className="grid grid-cols-4 grid-rows-2 gap-3 h-[420px]">
              {data.gallery.map((g, i) => {
                const spans = [
                  "col-span-2 row-span-2", "col-span-1 row-span-1", "col-span-1 row-span-1",
                  "col-span-1 row-span-1", "col-span-1 row-span-1", "col-span-2 row-span-1",
                ];
                return (
                  <div key={g} className={`${spans[i]} rounded-2xl overflow-hidden relative group cursor-pointer`} style={{ background: p.gradient }}>
                    <div className="absolute inset-0 opacity-20" style={{
                      backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
                      backgroundSize: "16px 16px",
                    }} />
                    <div className="absolute inset-0 flex items-center justify-center text-5xl opacity-50">🛕</div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-3 left-3 right-3 text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                      <Camera className="h-3 w-3" /> {g}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ═══════ TESTIMONIAL ═══════ */}
      <section className="py-24" style={{ background: p.surface }}>
        <div className="max-w-3xl mx-auto px-6 text-center">
          <Quote className="h-10 w-10 mx-auto mb-6 opacity-30" style={{ color: p.accent }} />
          <p className="text-2xl md:text-3xl font-medium leading-snug mb-6 font-serif italic" style={{ color: p.text }}>
            "{data.testimonial.text}"
          </p>
          <div className="flex items-center justify-center gap-3">
            <div className="h-10 w-10 rounded-full flex items-center justify-center text-white font-bold" style={{ background: p.gradient }}>R</div>
            <div className="text-left">
              <div className="text-sm font-bold" style={{ color: p.text }}>{data.testimonial.by}</div>
              <div className="text-xs" style={{ color: p.muted }}>{data.testimonial.role}</div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ DONATION CTA — BIG STATEMENT ═══════ */}
      {theme.sections.donations && (
        <section className="relative overflow-hidden py-20" style={{ background: p.gradient }}>
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }} />
          <motion.div
            animate={{ rotate: [0, 360] }} transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
            className="absolute -top-20 -right-20 text-[300px] opacity-10 text-white select-none"
          >🪷</motion.div>
          <div className="relative max-w-4xl mx-auto px-6 text-center text-white">
            <Flower2 className="h-12 w-12 mx-auto mb-5 opacity-90" />
            <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.05] mb-5">
              Be part of a<br/><span className="italic font-serif">divine legacy</span>.
            </h2>
            <p className="text-base md:text-lg opacity-85 mb-8 max-w-xl mx-auto leading-relaxed">
              Your generous contributions sustain daily worship, nourish devotees through Annadanam, and preserve centuries of spiritual heritage.
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <button className="px-7 py-3.5 rounded-full bg-white text-sm font-bold shadow-2xl flex items-center gap-2 hover:scale-105 transition-transform" style={{ color: p.brand }}>
                <Gift className="h-4 w-4" /> Donate Now <ArrowRight className="h-4 w-4" />
              </button>
              <button className="px-7 py-3.5 rounded-full text-sm font-semibold border-2 border-white/40 backdrop-blur-sm hover:bg-white/10 transition-colors flex items-center gap-2">
                <Heart className="h-4 w-4" /> Monthly Pledge
              </button>
            </div>
            <div className="mt-8 flex items-center justify-center gap-6 text-xs opacity-75 flex-wrap">
              <span className="flex items-center gap-1.5"><Award className="h-3.5 w-3.5" /> 80G Tax Benefits</span>
              <span className="flex items-center gap-1.5"><Sparkles className="h-3.5 w-3.5" /> Instant Receipt</span>
              <span className="flex items-center gap-1.5"><Sun className="h-3.5 w-3.5" /> Special Pooja</span>
            </div>
          </div>
        </section>
      )}

      {/* ═══════ CONTACT ═══════ */}
      {theme.sections.contact && (
        <section className="py-24" style={{ background: p.bg }}>
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <Eyebrow color={p.accent}>Visit Us</Eyebrow>
                <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-8" style={{ color: p.text }}>
                  Come, find your <span className="italic font-serif" style={{ color: p.accent }}>peace</span>.
                </h2>
                <div className="space-y-5">
                  {[
                    { i: MapPin, l: "Address", v: data.location },
                    { i: Phone, l: "Phone", v: data.phone },
                    { i: Mail, l: "Email", v: data.email },
                    { i: Clock, l: "Hours", v: "Open 365 days · 3 AM – 10 PM" },
                  ].map(item => (
                    <div key={item.l} className="flex items-start gap-4">
                      <div className="h-11 w-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: p.accentSoft }}>
                        <item.i className="h-5 w-5" style={{ color: p.accent }} />
                      </div>
                      <div>
                        <div className="text-[10px] uppercase tracking-[0.2em] font-bold mb-1" style={{ color: p.muted }}>{item.l}</div>
                        <div className="text-sm font-medium" style={{ color: p.text }}>{item.v}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="aspect-square rounded-3xl relative overflow-hidden shadow-2xl" style={{ background: p.gradient }}>
                <div className="absolute inset-0 opacity-20" style={{
                  backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                }} />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                  <MapPin className="h-12 w-12 mb-3 opacity-90" />
                  <div className="text-sm font-bold tracking-wide">Tirumala Hills</div>
                  <div className="text-xs opacity-80 mt-1">Tirupati, Andhra Pradesh</div>
                  <button className="mt-5 px-4 py-2 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold border border-white/30 flex items-center gap-1.5">
                    Get Directions <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ═══════ ANNOUNCEMENTS ═══════ */}
      {theme.sections.announcements && (
        <section className="py-24" style={{ background: p.bg }}>
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
              <div>
                <Eyebrow color={p.accent}>Temple Notices</Eyebrow>
                <h2 className="text-4xl md:text-5xl font-black tracking-tight" style={{ color: p.text }}>
                  Announce<span className="italic font-serif" style={{ color: p.accent }}>ments</span>
                </h2>
              </div>
              {data.announcements.length > 2 && (
                <button className="text-sm font-semibold flex items-center gap-1" style={{ color: p.accent }}>
                  View all <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>
            {data.announcements.length === 1 ? (
              <motion.div
                initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="rounded-3xl p-8 border flex items-start gap-6"
                style={{ background: p.surface, borderColor: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)" }}
              >
                <div className="h-16 w-16 rounded-2xl flex items-center justify-center text-4xl shrink-0" style={{ background: p.gradient }}>
                  {data.announcements[0].emoji}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="text-lg font-bold" style={{ color: p.text }}>{data.announcements[0].title}</span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: p.accentSoft, color: p.accent }}>
                      {data.announcements[0].type}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed mb-3" style={{ color: p.muted }}>{data.announcements[0].desc}</p>
                  <div className="text-sm font-bold" style={{ color: p.accent }}>{data.announcements[0].date}</div>
                </div>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {data.announcements.map((ann, i) => {
                  const TypeIcon = ann.type === "urgent" ? AlertCircle : ann.type === "festival" ? PartyPopper : Info;
                  const typeColor = ann.type === "urgent" ? "#ef4444" : ann.type === "festival" ? p.accent : "#3b82f6";
                  const typeBg = ann.type === "urgent" ? "#fef2f2" : ann.type === "festival" ? p.accentSoft : "#eff6ff";
                  return (
                    <motion.div
                      key={ann.id}
                      initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                      className="group flex items-start gap-5 rounded-2xl p-5 border transition-all hover:shadow-lg cursor-pointer"
                      style={{ background: p.surface, borderColor: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)" }}
                    >
                      <div className="h-12 w-12 rounded-xl flex items-center justify-center text-2xl shrink-0" style={{ background: p.gradient }}>
                        {ann.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="text-sm font-bold" style={{ color: p.text }}>{ann.title}</span>
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: typeBg, color: typeColor }}>
                            <TypeIcon className="h-2.5 w-2.5" />
                            {ann.type}
                          </span>
                        </div>
                        <p className="text-xs leading-relaxed" style={{ color: p.muted }}>{ann.desc}</p>
                      </div>
                      <div className="shrink-0 text-right">
                        <div className="text-xs font-bold" style={{ color: p.accent }}>{ann.date}</div>
                        <ChevronRight className="h-4 w-4 mt-2 ml-auto transition-transform group-hover:translate-x-1" style={{ color: p.muted }} />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ═══════ NEWSLETTER ═══════ */}
      <section className="py-16 border-t" style={{
        background: p.surface,
        borderColor: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
      }}>
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h3 className="text-2xl md:text-3xl font-black tracking-tight mb-2" style={{ color: p.text }}>
            Stay <span className="italic font-serif" style={{ color: p.accent }}>blessed</span>, stay informed.
          </h3>
          <p className="text-sm mb-6" style={{ color: p.muted }}>Get daily panchang, festival reminders, and seva updates.</p>
          <div className="flex gap-2 max-w-md mx-auto">
            <input
              placeholder="your@email.com"
              className="flex-1 px-4 py-3 rounded-full text-sm border outline-none"
              style={{
                background: p.bg, color: p.text,
                borderColor: dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)",
              }}
            />
            <button className="px-5 py-3 rounded-full text-sm font-bold text-white" style={{ background: p.gradient }}>Subscribe</button>
          </div>
        </div>
      </section>

      {/* ═══════ FOOTER ═══════ */}
      <footer style={{ background: dark ? "#0a0408" : "#1a0f08", color: "#fff" }}>
        <div className="max-w-6xl mx-auto px-6 py-14 grid md:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="h-10 w-10 rounded-xl flex items-center justify-center text-white text-xl shadow-lg" style={{ background: p.gradient }}>ॐ</div>
              <span className="font-bold text-lg">{data.short}</span>
            </div>
            <p className="text-xs opacity-60 leading-relaxed">A timeless sanctuary serving devotees with divine grace since {data.est}.</p>
            <div className="flex gap-2 mt-5">
              {[Facebook, Instagram, Youtube].map((I, i) => (
                <div key={i} className="h-9 w-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center cursor-pointer transition-colors">
                  <I className="h-4 w-4" />
                </div>
              ))}
            </div>
          </div>
          {[
            { t: "Devotee Services", l: ["Online Darshan", "Sevas", "Accommodation", "Prasadam"] },
            { t: "About", l: ["History", "Trust Board", "Reach Us", "Dress Code"] },
            { t: "Contact", l: [data.phone, data.email, "Tirumala, AP", "Help Center"] },
          ].map(col => (
            <div key={col.t}>
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60 mb-4">{col.t}</div>
              <div className="space-y-2.5 text-xs opacity-75">
                {col.l.map(x => <div key={x} className="hover:opacity-100 cursor-pointer">{x}</div>)}
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-white/10">
          <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between text-[11px] opacity-50 flex-wrap gap-2">
            <span>© 2024 {data.name}. All rights reserved.</span>
            <span>Crafted with 🪷 by Devalaya</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TempleWebsitePreview;
