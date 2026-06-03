import { useEffect, useState } from "react";

export type LangCode = "en" | "hi" | "sa" | "ta" | "te" | "kn";

export const LANGUAGES: { code: LangCode; label: string; native: string }[] = [
  { code: "en", label: "English", native: "English" },
  { code: "hi", label: "Hindi", native: "हिन्दी" },
  { code: "sa", label: "Sanskrit", native: "संस्कृतम्" },
  { code: "ta", label: "Tamil", native: "தமிழ்" },
  { code: "te", label: "Telugu", native: "తెలుగు" },
  { code: "kn", label: "Kannada", native: "ಕನ್ನಡ" },
];

const STORAGE_KEY = "appLang";
const EVENT = "app-lang-change";

export function getLang(): LangCode {
  if (typeof window === "undefined") return "en";
  return (localStorage.getItem(STORAGE_KEY) as LangCode) || "en";
}

export function setLang(code: LangCode) {
  localStorage.setItem(STORAGE_KEY, code);
  window.dispatchEvent(new CustomEvent(EVENT, { detail: code }));
}

export function useLang(): [LangCode, (c: LangCode) => void] {
  const [lang, setLangState] = useState<LangCode>(() => getLang());
  useEffect(() => {
    const h = () => setLangState(getLang());
    window.addEventListener(EVENT, h);
    window.addEventListener("storage", h);
    return () => {
      window.removeEventListener(EVENT, h);
      window.removeEventListener("storage", h);
    };
  }, []);
  return [lang, setLang];
}

// UI chrome dictionary. Add keys here as needed.
type Dict = Partial<Record<LangCode, string>>;
const D: Record<string, Dict> = {
  back: { en: "Back", hi: "पीछे", sa: "पूर्वम्", ta: "பின்", te: "వెనుక", kn: "ಹಿಂದೆ" },
  next: { en: "Next", hi: "आगे", sa: "अग्रे", ta: "அடுத்து", te: "తదుపరి", kn: "ಮುಂದೆ" },
  skip: { en: "Skip", hi: "छोड़ें", sa: "त्यजतु", ta: "தவிர்", te: "దాటవేయి", kn: "ಬಿಡಿ" },
  finish: { en: "Finish", hi: "समाप्त", sa: "समाप्तिः", ta: "முடிக்க", te: "ముగించు", kn: "ಮುಗಿಸಿ" },
  step_of: { en: "Step {a} of {b}", hi: "चरण {a} / {b}", sa: "सोपानम् {a} / {b}", ta: "படி {a} / {b}", te: "దశ {a} / {b}", kn: "ಹಂತ {a} / {b}" },
  take_tour: { en: "Take a tour", hi: "टूर लें", sa: "परिदर्शनम्", ta: "சுற்றுப்பயணம்", te: "టూర్ తీసుకోండి", kn: "ಪ್ರವಾಸ" },
  welcome_back: { en: "Welcome back", hi: "पुनः स्वागत है", sa: "पुनः स्वागतम्", ta: "மீண்டும் வரவேற்கிறோம்", te: "తిరిగి స్వాగతం", kn: "ಮರಳಿ ಸ್ವಾಗತ" },
  welcome_intro: {
    en: "Let's get your temple fully ready on Digi Devalaya. Follow this short journey, or jump straight into the dashboard.",
    hi: "आइए आपके मंदिर को डिजि देवालय पर पूरी तरह तैयार करें। इस छोटी यात्रा का अनुसरण करें या सीधे डैशबोर्ड पर जाएँ।",
    sa: "देवालयं डिजिदेवालये सज्जीकुर्मः। एतां लघुयात्रां अनुसरतु अथवा साक्षात् फलकं गच्छतु।",
    ta: "உங்கள் கோயிலை Digi Devalaya-வில் முழுமையாக தயார்படுத்துவோம். இந்த சிறிய பயணத்தைப் பின்தொடரவும் அல்லது நேரடியாக டாஷ்போர்டுக்கு செல்லவும்.",
    te: "మీ ఆలయాన్ని Digi Devalaya లో పూర్తిగా సిద్ధం చేద్దాం. ఈ చిన్న ప్రయాణాన్ని అనుసరించండి లేదా నేరుగా డాష్‌బోర్డుకు వెళ్లండి.",
    kn: "ನಿಮ್ಮ ದೇವಾಲಯವನ್ನು Digi Devalaya ನಲ್ಲಿ ಸಂಪೂರ್ಣವಾಗಿ ಸಿದ್ಧಪಡಿಸೋಣ. ಈ ಸಣ್ಣ ಪ್ರಯಾಣವನ್ನು ಅನುಸರಿಸಿ ಅಥವಾ ನೇರವಾಗಿ ಡ್ಯಾಶ್‌ಬೋರ್ಡಿಗೆ ಹೋಗಿ.",
  },
  setup_journey: { en: "Your setup journey", hi: "आपकी सेटअप यात्रा", sa: "सज्जीकरणयात्रा", ta: "உங்கள் அமைப்பு பயணம்", te: "మీ సెటప్ ప్రయాణం", kn: "ನಿಮ್ಮ ಸೆಟಪ್ ಪ್ರಯಾಣ" },
  done_of: { en: "{a} of {b} done", hi: "{b} में से {a} पूर्ण", sa: "{b} मध्ये {a} पूर्णम्", ta: "{b} இல் {a} முடிந்தது", te: "{b} లో {a} పూర్తి", kn: "{b} ರಲ್ಲಿ {a} ಮುಗಿದಿದೆ" },
  start_setup: { en: "Start guided setup", hi: "गाइडेड सेटअप शुरू करें", sa: "निर्देशितसज्जीकरणं आरभतु", ta: "வழிகாட்டப்பட்ட அமைப்பு தொடங்கவும்", te: "గైడెడ్ సెటప్ ప్రారంభించండి", kn: "ಮಾರ್ಗದರ್ಶಿ ಸೆಟಪ್ ಪ್ರಾರಂಭಿಸಿ" },
  quick_tour: { en: "Take a quick tour", hi: "एक त्वरित टूर लें", sa: "शीघ्रपरिदर्शनम्", ta: "விரைவு சுற்றுப்பயணம்", te: "త్వరిత టూర్", kn: "ತ್ವರಿತ ಪ್ರವಾಸ" },
  skip_dashboard: { en: "Skip for now, go to dashboard", hi: "अभी छोड़ें, डैशबोर्ड पर जाएँ", sa: "अधुना त्यजतु, फलकं गच्छतु", ta: "இப்போது தவிர், டாஷ்போர்டுக்கு செல்லவும்", te: "ఇప్పుడు దాటవేసి డాష్‌బోర్డుకు వెళ్లండి", kn: "ಈಗ ಬಿಟ್ಟು ಡ್ಯಾಶ್‌ಬೋರ್ಡಿಗೆ ಹೋಗಿ" },
  language: { en: "Language", hi: "भाषा", sa: "भाषा", ta: "மொழி", te: "భాష", kn: "ಭಾಷೆ" },
  // Journey step titles
  j1_t: { en: "Complete temple profile", hi: "मंदिर प्रोफ़ाइल पूरी करें", sa: "देवालयविवरणं पूरयतु", ta: "கோயில் சுயவிவரம் முடிக்க", te: "ఆలయ ప్రొఫైల్ పూర్తి చేయండి", kn: "ದೇವಾಲಯ ಪ್ರೊಫೈಲ್ ಪೂರ್ಣಗೊಳಿಸಿ" },
  j1_d: { en: "Add branding, contact info & timings", hi: "ब्रांडिंग, संपर्क और समय जोड़ें", sa: "चिह्नं संपर्कं समयं च योजयतु", ta: "முத்திரை, தொடர்பு, நேரம் சேர்க்க", te: "బ్రాండింగ్, సంప్రదింపు, సమయాలు జోడించండి", kn: "ಬ್ರ್ಯಾಂಡಿಂಗ್, ಸಂಪರ್ಕ, ಸಮಯ ಸೇರಿಸಿ" },
  j2_t: { en: "Set up sevas & offerings", hi: "सेवाएँ और प्रसाद सेट करें", sa: "सेवाः अर्पणानि च स्थापयतु", ta: "சேவைகளை அமைக்க", te: "సేవలు సెటప్ చేయండి", kn: "ಸೇವೆಗಳನ್ನು ಹೊಂದಿಸಿ" },
  j2_d: { en: "Configure rituals, slots and pricing", hi: "अनुष्ठान, स्लॉट और मूल्य कॉन्फ़िगर करें", sa: "विधीन् समयान् मूल्यानि च व्यवस्थापयतु", ta: "சடங்குகள், நேரம், விலை அமைக்க", te: "క్రతువులు, స్లాట్‌లు, ధరలు సెట్ చేయండి", kn: "ವಿಧಿಗಳು, ಸ್ಲಾಟ್‌ಗಳು, ಬೆಲೆ ಹೊಂದಿಸಿ" },
  j3_t: { en: "Enable donations", hi: "दान सक्षम करें", sa: "दानं सक्रियं करोतु", ta: "நன்கொடைகள் இயக்கு", te: "విరాళాలు ఎనేబుల్ చేయండి", kn: "ದಾನಗಳನ್ನು ಸಕ್ರಿಯಗೊಳಿಸಿ" },
  j3_d: { en: "Funds, receipts and 80G setup", hi: "फंड, रसीदें और 80G सेटअप", sa: "निधयः रसीदाः 80G च", ta: "நிதி, ரசீது, 80G", te: "ఫండ్‌లు, రశీదులు, 80G", kn: "ಫಂಡ್, ರಶೀದಿ, 80G" },
  j4_t: { en: "Invite your team", hi: "अपनी टीम आमंत्रित करें", sa: "स्वसंघं आमन्त्रयतु", ta: "உங்கள் குழுவை அழைக்க", te: "మీ టీమ్‌ను ఆహ్వానించండి", kn: "ನಿಮ್ಮ ತಂಡವನ್ನು ಆಹ್ವಾನಿಸಿ" },
  j4_d: { en: "Add staff and assign roles", hi: "स्टाफ़ जोड़ें और भूमिकाएँ निर्दिष्ट करें", sa: "कर्मचारिणं योजयतु भूमिकाश्च नियोजयतु", ta: "ஊழியர் சேர்த்து பாத்திரம் ஒதுக்கவும்", te: "సిబ్బందిని జోడించి పాత్రలు కేటాయించండి", kn: "ಸಿಬ್ಬಂದಿ ಸೇರಿಸಿ ಪಾತ್ರಗಳನ್ನು ನಿಯೋಜಿಸಿ" },
  // Category labels
  cat_temple: { en: "Temple & Worship", hi: "मंदिर एवं पूजा", sa: "देवालयः पूजा च", ta: "கோயில் & வழிபாடு", te: "ఆలయం & పూజ", kn: "ದೇವಾಲಯ & ಪೂಜೆ" },
  cat_management: { en: "People & Management", hi: "लोग एवं प्रबंधन", sa: "जनाः व्यवस्थापनं च", ta: "மக்கள் & நிர்வாகம்", te: "ప్రజలు & నిర్వహణ", kn: "ಜನರು & ನಿರ್ವಹಣೆ" },
  cat_growth: { en: "Growth & Intelligence", hi: "विकास एवं विश्लेषण", sa: "वृद्धिः विवेकश्च", ta: "வளர்ச்சி & நுண்ணறிவு", te: "వృద్ధి & విశ్లేషణ", kn: "ಬೆಳವಣಿಗೆ & ಒಳನೋಟ" },
  welcome: { en: "Welcome", hi: "स्वागत", sa: "स्वागतम्", ta: "வரவேற்பு", te: "స్వాగతం", kn: "ಸ್ವಾಗತ" },
  how_to_use: { en: "How to use", hi: "उपयोग कैसे करें", sa: "उपयोगविधिः", ta: "எப்படி பயன்படுத்த", te: "ఎలా ఉపయోగించాలి", kn: "ಬಳಸುವುದು ಹೇಗೆ" },
  locked: { en: "Locked", hi: "लॉक्ड", sa: "अवरुद्धम्", ta: "பூட்டப்பட்டது", te: "లాక్ చేయబడింది", kn: "ಲಾಕ್ ಆಗಿದೆ" },
  upgrade: { en: "Upgrade", hi: "अपग्रेड", sa: "उन्नतीकरणम्", ta: "மேம்படுத்து", te: "అప్‌గ్రేడ్", kn: "ಅಪ್‌ಗ್ರೇಡ್" },
  manage_plan: { en: "Manage Plan", hi: "योजना प्रबंधन", sa: "योजनां व्यवस्थापयतु", ta: "திட்டத்தை நிர்வகி", te: "ప్లాన్ నిర్వహించండి", kn: "ಯೋಜನೆ ನಿರ್ವಹಿಸಿ" },
  // Module titles (keyed by module id)
  "mod_temple-structure": { en: "Temple Structure", hi: "मंदिर संरचना", sa: "देवालयसंरचना", ta: "கோயில் கட்டமைப்பு", te: "ఆలయ నిర్మాణం", kn: "ದೇವಾಲಯ ರಚನೆ" },
  mod_offerings: { en: "Offerings", hi: "अर्पण", sa: "अर्पणानि", ta: "சேவைகள்", te: "సేవలు", kn: "ಸೇವೆಗಳು" },
  mod_bookings: { en: "Bookings", hi: "बुकिंग्स", sa: "आरक्षणानि", ta: "முன்பதிவுகள்", te: "బుకింగ్‌లు", kn: "ಬುಕಿಂಗ್‌ಗಳು" },
  mod_donations: { en: "Donations", hi: "दान", sa: "दानानि", ta: "நன்கொடைகள்", te: "విరాళాలు", kn: "ದಾನಗಳು" },
  "mod_prasadam-kitchen": { en: "Prasadam & Kitchen", hi: "प्रसादम् एवं रसोई", sa: "प्रसादः पाकशाला च", ta: "பிரசாதம் & சமையல்", te: "ప్రసాదం & వంటగది", kn: "ಪ್ರಸಾದ & ಅಡುಗೆಮನೆ" },
  mod_crowd: { en: "Crowd Management", hi: "भीड़ प्रबंधन", sa: "जनसमूहव्यवस्थापनम्", ta: "கூட்ட நிர்வாகம்", te: "జనసమూహ నిర్వహణ", kn: "ಜನಸಂದಣಿ ನಿರ್ವಹಣೆ" },
  mod_devotees: { en: "Devotees", hi: "भक्तगण", sa: "भक्ताः", ta: "பக்தர்கள்", te: "భక్తులు", kn: "ಭಕ್ತರು" },
  "mod_vip-devotee": { en: "VIP Devotees", hi: "विशिष्ट भक्त", sa: "विशिष्टभक्ताः", ta: "VIP பக்தர்கள்", te: "VIP భక్తులు", kn: "VIP ಭಕ್ತರು" },
  "mod_people-hr": { en: "People & HR", hi: "लोग एवं HR", sa: "जनाः मानवसंपदा च", ta: "மக்கள் & HR", te: "ప్రజలు & HR", kn: "ಜನರು & HR" },
  mod_finance: { en: "Finance & Accounts", hi: "वित्त एवं लेखा", sa: "अर्थः लेखाश्च", ta: "நிதி & கணக்குகள்", te: "ఆర్థిక & ఖాతాలు", kn: "ಹಣಕಾಸು & ಖಾತೆಗಳು" },
  mod_suppliers: { en: "Inventory", hi: "इन्वेंट्री", sa: "सञ्चयः", ta: "சரக்கு", te: "ఇన్వెంటరీ", kn: "ದಾಸ್ತಾನು" },
  mod_tasks: { en: "Tasks", hi: "कार्य", sa: "कार्याणि", ta: "பணிகள்", te: "పనులు", kn: "ಕಾರ್ಯಗಳು" },
  mod_freelancer: { en: "Freelancer", hi: "फ्रीलांसर", sa: "स्वतन्त्रकर्मी", ta: "சுயதொழிலாளர்", te: "ఫ్రీలాన్సర్", kn: "ಫ್ರೀಲಾನ್ಸರ್" },
  mod_communication: { en: "Communication", hi: "संचार", sa: "संचारः", ta: "தொடர்பு", te: "కమ్యూనికేషన్", kn: "ಸಂವಹನ" },
  mod_assets: { en: "Assets", hi: "संपत्तियाँ", sa: "सम्पत्तयः", ta: "சொத்துக்கள்", te: "ఆస్తులు", kn: "ಆಸ್ತಿಗಳು" },
  mod_events: { en: "Events", hi: "उत्सव", sa: "उत्सवाः", ta: "நிகழ்வுகள்", te: "ఈవెంట్‌లు", kn: "ಕಾರ್ಯಕ್ರಮಗಳು" },
  mod_projects: { en: "Projects", hi: "परियोजनाएँ", sa: "परियोजनाः", ta: "திட்டங்கள்", te: "ప్రాజెక్టులు", kn: "ಯೋಜನೆಗಳು" },
  mod_branches: { en: "Branches", hi: "शाखाएँ", sa: "शाखाः", ta: "கிளைகள்", te: "శాఖలు", kn: "ಶಾಖೆಗಳು" },
  mod_institution: { en: "Institutions", hi: "संस्थान", sa: "संस्थाः", ta: "நிறுவனங்கள்", te: "సంస్థలు", kn: "ಸಂಸ್ಥೆಗಳು" },
  mod_feedback: { en: "Feedback", hi: "प्रतिक्रिया", sa: "प्रतिक्रिया", ta: "கருத்து", te: "అభిప్రాయం", kn: "ಪ್ರತಿಕ್ರಿಯೆ" },
  mod_knowledge: { en: "Knowledge Base", hi: "ज्ञान आधार", sa: "ज्ञानकोषः", ta: "அறிவுத் தளம்", te: "విజ్ఞాన స్థావరం", kn: "ಜ್ಞಾನ ಕೋಶ" },
  mod_reports: { en: "Reports Center", hi: "रिपोर्ट केंद्र", sa: "प्रतिवेदनकेन्द्रम्", ta: "அறிக்கை மையம்", te: "నివేదికల కేంద్రం", kn: "ವರದಿಗಳ ಕೇಂದ್ರ" },
  mod_planner: { en: "Planner", hi: "योजनाकार", sa: "योजकः", ta: "திட்டமிடுபவர்", te: "ప్లానర్", kn: "ಯೋಜಕ" },
  mod_settings: { en: "Settings", hi: "सेटिंग्स", sa: "विन्यासाः", ta: "அமைப்புகள்", te: "సెట్టింగ్‌లు", kn: "ಸೆಟ್ಟಿಂಗ್‌ಗಳು" },
  mod_help: { en: "Help & Support", hi: "सहायता एवं समर्थन", sa: "साहाय्यम्", ta: "உதவி & ஆதரவு", te: "సహాయం & మద్దతు", kn: "ಸಹಾಯ & ಬೆಂಬಲ" },
};

export function t(key: string, lang: LangCode = getLang(), vars?: Record<string, string | number>): string {
  const entry = D[key];
  let s = (entry && (entry[lang] ?? entry.en)) ?? key;
  if (vars) for (const k in vars) s = s.replace(`{${k}}`, String(vars[k]));
  return s;
}