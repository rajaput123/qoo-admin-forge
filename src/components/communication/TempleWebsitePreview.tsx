import { motion } from "framer-motion";
import {
  MapPin, Phone, Mail, Clock, Heart, Calendar, Star, ChevronRight,
  Menu, Facebook, Instagram, Youtube, ArrowRight, Flame, Sparkles,
  Sun, BookOpen, Users, Gift, Camera,
} from "lucide-react";

interface ThemeConfig {
  colorScheme: string;
  fontStyle: string;
  heroTagline: string;
  welcomeMessage: string;
  template?: "plus" | "featured" | "advanced" | "custom";
  sections: {
    about: boolean;
    timings: boolean;
    gallery: boolean;
    donations: boolean;
    contact: boolean;
    sevas: boolean;
    events: boolean;
  };
}

const colorSchemes: Record<string, {
  hero: string; accent: string; accentBg: string; headerBg: string;
  lightBg: string; border: string; badgeBg: string; badgeText: string;
  goldAccent: string; darkText: string;
}> = {
  saffron: {
    hero: "from-amber-900 via-orange-800 to-amber-700",
    accent: "text-amber-800", accentBg: "bg-amber-800",
    headerBg: "bg-gradient-to-r from-amber-950 via-amber-900 to-amber-950",
    lightBg: "bg-amber-50/60", border: "border-amber-200/60",
    badgeBg: "bg-amber-100", badgeText: "text-amber-800",
    goldAccent: "text-amber-600", darkText: "text-amber-950",
  },
  maroon: {
    hero: "from-rose-950 via-red-900 to-rose-800",
    accent: "text-rose-800", accentBg: "bg-rose-800",
    headerBg: "bg-gradient-to-r from-rose-950 via-red-950 to-rose-950",
    lightBg: "bg-rose-50/60", border: "border-rose-200/60",
    badgeBg: "bg-rose-100", badgeText: "text-rose-800",
    goldAccent: "text-rose-600", darkText: "text-rose-950",
  },
  gold: {
    hero: "from-yellow-900 via-amber-800 to-yellow-700",
    accent: "text-yellow-800", accentBg: "bg-yellow-800",
    headerBg: "bg-gradient-to-r from-yellow-950 via-amber-950 to-yellow-950",
    lightBg: "bg-yellow-50/60", border: "border-yellow-200/60",
    badgeBg: "bg-yellow-100", badgeText: "text-yellow-800",
    goldAccent: "text-yellow-600", darkText: "text-yellow-950",
  },
  teal: {
    hero: "from-teal-950 via-teal-800 to-emerald-700",
    accent: "text-teal-800", accentBg: "bg-teal-800",
    headerBg: "bg-gradient-to-r from-teal-950 via-teal-900 to-teal-950",
    lightBg: "bg-teal-50/60", border: "border-teal-200/60",
    badgeBg: "bg-teal-100", badgeText: "text-teal-800",
    goldAccent: "text-teal-600", darkText: "text-teal-950",
  },
};

const templeData = {
  name: "Sri Venkateswara Swamy Temple",
  shortName: "TTD Tirumala",
  deity: "Lord Venkateswara (Balaji)",
  established: "1509 AD",
  location: "Tirumala Hills, Tirupati, Andhra Pradesh, India",
  phone: "+91 877 227 7777",
  email: "info@tirumalatemple.org",
  website: "www.tirumala.org",
  description:
    "One of the most sacred and ancient temples in India, nestled atop the seven hills of Tirumala. Dedicated to Lord Venkateswara — an incarnation of Lord Vishnu — this divine abode has been a beacon of faith and devotion for over five centuries. Millions of devotees from across the world visit annually seeking blessings, spiritual solace, and divine grace.",
  highlights: [
    { label: "Daily Devotees", value: "50,000+", icon: Users },
    { label: "Annual Revenue", value: "₹3,000 Cr", icon: Gift },
    { label: "Established", value: "1509 AD", icon: BookOpen },
    { label: "Altitude", value: "3,200 ft", icon: Sun },
  ],
  timings: [
    { name: "Suprabhatam", time: "3:00 AM", type: "Special" },
    { name: "Morning Darshan", time: "6:00 AM – 12:00 PM", type: "General" },
    { name: "Afternoon Break", time: "12:00 – 1:00 PM", type: "Closed" },
    { name: "Evening Darshan", time: "1:00 PM – 7:00 PM", type: "General" },
    { name: "Sahasra Deepalankarana", time: "7:00 PM", type: "Special" },
    { name: "Ekanta Seva", time: "10:00 PM", type: "Special" },
  ],
  sevas: [
    { name: "Suprabhatam Seva", price: "₹300", desc: "Wake-up hymns to the Lord at dawn", slots: "Limited" },
    { name: "Thomala Seva", price: "₹500", desc: "Sacred garland decoration service", slots: "Available" },
    { name: "Archana", price: "₹150", desc: "Chanting of 108 divine names", slots: "Available" },
    { name: "Kalyanotsavam", price: "₹10,000", desc: "Celestial wedding ceremony of the Lord", slots: "Booking" },
    { name: "Unjal Seva", price: "₹2,000", desc: "Divine swing festival service", slots: "Limited" },
    { name: "Sahasra Deepalankarana", price: "₹5,000", desc: "Thousand lamps illumination", slots: "Booking" },
  ],
  events: [
    { name: "Brahmotsavam", date: "Oct 1 – 9", month: "OCT", day: "1-9", desc: "The grand 9-day annual festival with celestial processions" },
    { name: "Vaikunta Ekadasi", date: "Dec 22", month: "DEC", day: "22", desc: "The divine gateway to Vaikuntam opens for devotees" },
    { name: "Rathasapthami", date: "Feb 15", month: "FEB", day: "15", desc: "Sacred chariot festival celebrating the Sun God" },
    { name: "Ugadi", date: "Mar 22", month: "MAR", day: "22", desc: "Telugu New Year with special abhishekam" },
  ],
  galleryImages: [
    "Main Gopuram", "Golden Vimana", "Padmavathi Temple",
    "Srivari Mettu", "Hundi Hall", "Laddu Kitchen",
    "Garuda Mandapam", "Night Illumination",
  ],
};

/* ─── Decorative Divider ─── */
const OrnamentDivider = ({ color }: { color: string }) => (
  <div className="flex items-center justify-center gap-3 py-1">
    <div className={`h-px w-12 ${color} opacity-30`} style={{ background: "currentColor" }} />
    <Sparkles className={`h-3 w-3 ${color} opacity-40`} />
    <div className={`h-px w-12 ${color} opacity-30`} style={{ background: "currentColor" }} />
  </div>
);

/* ─── Section Header ─── */
const SectionTitle = ({ icon: Icon, title, subtitle, color }: {
  icon: React.ElementType; title: string; subtitle?: string; color: string;
}) => (
  <div className="mb-8 text-center">
    <div className={`inline-flex items-center justify-center h-10 w-10 rounded-full ${color} bg-opacity-10 mb-3`}
      style={{ backgroundColor: "currentColor", opacity: 0.08 }}>
      <Icon className={`h-5 w-5 ${color}`} />
    </div>
    <h2 className={`text-2xl font-bold ${color} tracking-tight`}>{title}</h2>
    {subtitle && <p className="text-sm text-gray-500 mt-1 max-w-md mx-auto">{subtitle}</p>}
    <OrnamentDivider color={color} />
  </div>
);

const TempleWebsitePreview = ({ theme }: { theme: ThemeConfig }) => {
  const c = colorSchemes[theme.colorScheme] || colorSchemes.saffron;

  return (
    <div className="w-full bg-white text-gray-800 font-sans antialiased">

      {/* ═══════════════ NAVIGATION ═══════════════ */}
      <nav className={`${c.headerBg} text-white sticky top-0 z-20`}>
        {/* Top utility bar */}
        <div className="border-b border-white/10">
          <div className="max-w-5xl mx-auto px-6 py-1.5 flex items-center justify-between text-[10px] opacity-70">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1"><Phone className="h-2.5 w-2.5" /> {templeData.phone}</span>
              <span className="flex items-center gap-1"><Mail className="h-2.5 w-2.5" /> {templeData.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="hover:opacity-100 cursor-pointer">🔔 Alerts</span>
              <span className="hover:opacity-100 cursor-pointer">🌐 English</span>
            </div>
          </div>
        </div>
        {/* Main nav */}
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-white/10 backdrop-blur flex items-center justify-center text-base border border-white/10">
              🕉️
            </div>
            <div>
              <div className="text-base font-bold tracking-tight leading-none">{templeData.shortName}</div>
              <div className="text-[9px] opacity-50 tracking-[0.2em] uppercase mt-0.5">Official Temple Portal</div>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6 text-[13px] font-medium tracking-wide">
            <span className="text-white cursor-pointer pb-0.5 border-b-2 border-white/60">Home</span>
            {theme.sections.about && <span className="text-white/70 hover:text-white cursor-pointer transition-colors">About</span>}
            {theme.sections.sevas && <span className="text-white/70 hover:text-white cursor-pointer transition-colors">Sevas</span>}
            {theme.sections.timings && <span className="text-white/70 hover:text-white cursor-pointer transition-colors">Timings</span>}
            {theme.sections.events && <span className="text-white/70 hover:text-white cursor-pointer transition-colors">Events</span>}
            {theme.sections.gallery && <span className="text-white/70 hover:text-white cursor-pointer transition-colors">Gallery</span>}
            {theme.sections.donations && (
              <span className="bg-white/15 text-white px-3 py-1 rounded-md text-xs font-semibold hover:bg-white/25 cursor-pointer transition-colors border border-white/20">
                Donate
              </span>
            )}
            {theme.sections.contact && <span className="text-white/70 hover:text-white cursor-pointer transition-colors">Contact</span>}
          </div>
          <button className="md:hidden p-1.5 rounded-lg hover:bg-white/10 transition-colors">
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </nav>

      {/* ═══════════════ HERO ═══════════════ */}
      <section className={`bg-gradient-to-br ${c.hero} text-white relative overflow-hidden`}>
        {/* Decorative pattern overlay */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: `repeating-linear-gradient(45deg, white 0, white 1px, transparent 0, transparent 50%), repeating-linear-gradient(-45deg, white 0, white 1px, transparent 0, transparent 50%)`, backgroundSize: "20px 20px" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10" />
        <div className="relative max-w-5xl mx-auto px-6 py-20 md:py-28 text-center">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 text-[11px] font-medium tracking-wide border border-white/15 mb-6">
              <Flame className="h-3 w-3" /> Welcome to the Sacred Abode
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-3 tracking-tight leading-[1.1]">
              {templeData.name}
            </h1>
            <p className="text-lg md:text-xl opacity-85 font-medium mb-2">{templeData.deity}</p>
            <p className="text-sm opacity-65 max-w-lg mx-auto leading-relaxed mt-4">
              {theme.heroTagline}
            </p>
            <div className="mt-8 flex gap-3 justify-center flex-wrap">
              <button className="bg-white text-gray-900 px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-white/90 transition-all shadow-lg shadow-black/20 inline-flex items-center gap-2">
                <Calendar className="h-4 w-4" /> Book Darshan
              </button>
              <button className="bg-white/15 backdrop-blur-sm text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-white/25 transition-all border border-white/25 inline-flex items-center gap-2">
                <Heart className="h-4 w-4" /> Online Seva
              </button>
            </div>
          </motion.div>
        </div>
        {/* Bottom ornamental band */}
        <div className="h-1.5 bg-gradient-to-r from-transparent via-yellow-400/40 to-transparent" />
      </section>

      {/* ═══════════════ WELCOME STRIP ═══════════════ */}
      {theme.welcomeMessage && (
        <div className={`${c.lightBg} border-b ${c.border}`}>
          <div className="max-w-5xl mx-auto px-6 py-4 text-center">
            <p className="text-sm italic text-gray-600 leading-relaxed font-serif">
              ✦ {theme.welcomeMessage} ✦
            </p>
          </div>
        </div>
      )}

      {/* ═══════════════ HIGHLIGHTS BAR ═══════════════ */}
      <section className="border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {templeData.highlights.map((h) => (
              <div key={h.label} className="text-center group">
                <div className={`inline-flex items-center justify-center h-11 w-11 rounded-xl ${c.lightBg} mb-2 group-hover:scale-110 transition-transform`}>
                  <h.icon className={`h-5 w-5 ${c.accent}`} />
                </div>
                <div className={`text-xl font-bold ${c.darkText} tracking-tight`}>{h.value}</div>
                <div className="text-xs text-gray-500 mt-0.5 font-medium">{h.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ ABOUT ═══════════════ */}
      {theme.sections.about && (
        <section className="py-16">
          <div className="max-w-3xl mx-auto px-6">
            <SectionTitle icon={Star} title="About the Temple" subtitle="A legacy of devotion spanning centuries" color={c.accent} />
            <p className="text-base text-gray-600 leading-[1.8] text-center mb-8">{templeData.description}</p>
            <div className="flex flex-wrap justify-center gap-3">
              <span className={`flex items-center gap-2 ${c.badgeBg} ${c.badgeText} rounded-full px-4 py-2 text-xs font-semibold`}>
                <Star className="h-3.5 w-3.5" /> Est. {templeData.established}
              </span>
              <span className={`flex items-center gap-2 ${c.badgeBg} ${c.badgeText} rounded-full px-4 py-2 text-xs font-semibold`}>
                <MapPin className="h-3.5 w-3.5" /> Tirumala, Andhra Pradesh
              </span>
              <span className={`flex items-center gap-2 ${c.badgeBg} ${c.badgeText} rounded-full px-4 py-2 text-xs font-semibold`}>
                <Users className="h-3.5 w-3.5" /> 50,000+ Daily Visitors
              </span>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════ DARSHAN TIMINGS ═══════════════ */}
      {theme.sections.timings && (
        <section className={`py-16 ${c.lightBg}`}>
          <div className="max-w-4xl mx-auto px-6">
            <SectionTitle icon={Clock} title="Darshan Timings" subtitle="Plan your visit with our daily schedule" color={c.accent} />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {templeData.timings.map((t) => (
                <div key={t.name} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-md ${
                      t.type === "Special" ? "bg-amber-100 text-amber-700" : t.type === "Closed" ? "bg-red-100 text-red-600" : "bg-emerald-100 text-emerald-700"
                    }`}>{t.type}</span>
                  </div>
                  <h3 className="text-sm font-bold text-gray-800 mb-1">{t.name}</h3>
                  <div className="text-xs text-gray-500 flex items-center gap-1.5">
                    <Clock className="h-3 w-3" /> {t.time}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════ SEVAS ═══════════════ */}
      {theme.sections.sevas && (
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-6">
            <SectionTitle icon={Heart} title="Sevas & Offerings" subtitle="Participate in sacred rituals and worship services" color={c.accent} />
            <div className="grid md:grid-cols-2 gap-3">
              {templeData.sevas.map((s) => (
                <div key={s.name} className="flex items-center justify-between bg-white rounded-xl p-4 border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all group cursor-pointer">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-bold text-gray-800">{s.name}</h3>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold ${
                        s.slots === "Limited" ? "bg-amber-100 text-amber-700" : s.slots === "Booking" ? "bg-blue-100 text-blue-700" : "bg-emerald-100 text-emerald-700"
                      }`}>{s.slots}</span>
                    </div>
                    <p className="text-xs text-gray-500">{s.desc}</p>
                  </div>
                  <div className="flex items-center gap-3 ml-4">
                    <span className={`text-base font-bold ${c.accent}`}>{s.price}</span>
                    <div className={`h-7 w-7 rounded-lg flex items-center justify-center ${c.lightBg} group-hover:${c.accentBg} group-hover:text-white transition-colors`}>
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════ EVENTS ═══════════════ */}
      {theme.sections.events && (
        <section className={`py-16 ${c.lightBg}`}>
          <div className="max-w-4xl mx-auto px-6">
            <SectionTitle icon={Calendar} title="Upcoming Festivals" subtitle="Sacred celebrations throughout the year" color={c.accent} />
            <div className="grid md:grid-cols-2 gap-4">
              {templeData.events.map((e) => (
                <div key={e.name} className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow group cursor-pointer flex">
                  <div className={`w-20 ${c.accentBg} text-white flex flex-col items-center justify-center shrink-0`}>
                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">{e.month}</span>
                    <span className="text-2xl font-bold leading-none mt-0.5">{e.day}</span>
                  </div>
                  <div className="p-4 flex-1">
                    <h3 className="text-sm font-bold text-gray-800 mb-1 group-hover:${c.accent} transition-colors">{e.name}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">{e.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════ GALLERY ═══════════════ */}
      {theme.sections.gallery && (
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-6">
            <SectionTitle icon={Camera} title="Photo Gallery" subtitle="Glimpses of divine beauty and sacred spaces" color={c.accent} />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {templeData.galleryImages.map((label, i) => (
                <div key={i} className={`${i < 2 ? "md:col-span-2 aspect-[16/9]" : "aspect-square"} bg-gradient-to-br from-gray-100 via-gray-150 to-gray-200 rounded-xl flex items-center justify-center text-xs text-gray-400 font-medium text-center p-3 hover:from-gray-200 hover:to-gray-300 transition-all cursor-pointer group relative overflow-hidden`}>
                  <span className="group-hover:scale-105 transition-transform">{label}</span>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors rounded-xl" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════ DONATION CTA ═══════════════ */}
      {theme.sections.donations && (
        <section className={`bg-gradient-to-br ${c.hero} text-white relative overflow-hidden`}>
          <div className="absolute inset-0 bg-black/15" />
          <div className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`, backgroundSize: "24px 24px" }}
          />
          <div className="relative max-w-3xl mx-auto px-6 py-16 text-center">
            <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-white/10 backdrop-blur-sm mb-4 border border-white/15">
              <Heart className="h-7 w-7" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2 tracking-tight">Support the Temple</h2>
            <p className="text-sm opacity-75 mb-6 leading-relaxed max-w-md mx-auto">
              Your generous contributions sustain daily worship, nourish devotees through Annadanam, and preserve centuries of spiritual heritage for future generations.
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <button className="bg-white text-gray-900 px-7 py-3 rounded-lg text-sm font-bold hover:bg-white/90 transition-all shadow-lg shadow-black/20 inline-flex items-center gap-2">
                <Gift className="h-4 w-4" /> Donate Now <ArrowRight className="h-4 w-4" />
              </button>
              <button className="bg-white/15 backdrop-blur-sm text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-white/25 transition-all border border-white/20">
                Monthly Pledge
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════ CONTACT ═══════════════ */}
      {theme.sections.contact && (
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-6">
            <SectionTitle icon={MapPin} title="Visit & Contact" subtitle="We welcome you to the sacred hills" color={c.accent} />
            <div className="grid md:grid-cols-5 gap-6">
              <div className="md:col-span-2 space-y-4">
                {[
                  { icon: MapPin, label: "Address", value: templeData.location },
                  { icon: Phone, label: "Phone", value: templeData.phone },
                  { icon: Mail, label: "Email", value: templeData.email },
                  { icon: Clock, label: "Open Hours", value: "Open 365 days a year" },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-3">
                    <div className={`h-9 w-9 rounded-lg ${c.lightBg} flex items-center justify-center shrink-0`}>
                      <item.icon className={`h-4 w-4 ${c.accent}`} />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-800 mb-0.5">{item.label}</div>
                      <div className="text-sm text-gray-500 leading-relaxed">{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="md:col-span-3 bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl h-52 flex flex-col items-center justify-center text-gray-400 border border-gray-100">
                <MapPin className="h-8 w-8 mb-2 opacity-40" />
                <span className="text-sm font-medium">Interactive Map</span>
                <span className="text-[10px] mt-0.5 opacity-60">Tirumala Hills, Tirupati</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════ FOOTER ═══════════════ */}
      <footer className={`${c.headerBg} text-white`}>
        <div className="max-w-5xl mx-auto px-6 py-10">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">🕉️</span>
                <span className="font-bold text-base tracking-tight">{templeData.shortName}</span>
              </div>
              <p className="text-xs opacity-50 leading-relaxed">
                Serving millions of devotees with divine grace since {templeData.established}. A timeless sanctuary of faith and devotion.
              </p>
              <div className="flex gap-2 mt-4">
                {[Facebook, Instagram, Youtube].map((Icon, i) => (
                  <div key={i} className="h-8 w-8 rounded-lg bg-white/8 flex items-center justify-center hover:bg-white/15 cursor-pointer transition-colors border border-white/10">
                    <Icon className="h-3.5 w-3.5 opacity-70" />
                  </div>
                ))}
              </div>
            </div>
            {/* Quick Links */}
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.15em] opacity-60 mb-3">Devotee Services</h4>
              <div className="space-y-2 text-xs opacity-50">
                {["Online Darshan Booking", "Seva Tickets", "Accommodation", "Laddu Prasadam", "Special Darshan"].map((link) => (
                  <div key={link} className="hover:opacity-100 cursor-pointer transition-opacity">{link}</div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.15em] opacity-60 mb-3">Information</h4>
              <div className="space-y-2 text-xs opacity-50">
                {["Temple History", "How to Reach", "Dress Code", "Trust Board", "Photo Gallery"].map((link) => (
                  <div key={link} className="hover:opacity-100 cursor-pointer transition-opacity">{link}</div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.15em] opacity-60 mb-3">Contact</h4>
              <div className="space-y-2 text-xs opacity-50">
                <div className="flex items-center gap-2"><Phone className="h-3 w-3" /> {templeData.phone}</div>
                <div className="flex items-center gap-2"><Mail className="h-3 w-3" /> {templeData.email}</div>
                <div className="flex items-center gap-2"><MapPin className="h-3 w-3" /> Tirumala, AP</div>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-white/8">
          <div className="max-w-5xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between text-[10px] opacity-40">
            <span>© 2024 {templeData.name}. All rights reserved.</span>
            <span className="mt-1 md:mt-0">Powered by QOO Temple ERP</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TempleWebsitePreview;
