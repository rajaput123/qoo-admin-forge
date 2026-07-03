export interface ReceiptTemplate {
  id: string;
  name: string;
  type: "Seva" | "Donation";
  paperSize: "A4" | "A5" | "3inch" | "80mm" | "Letter";
  orientation: "Portrait" | "Landscape";
  showLogo: boolean;
  logoUrl: string;
  logoPosition: "left" | "center" | "right";
  showQR: boolean;
  headerText: string;
  footerText: string;
  isDefault: boolean;
  fields: string[];
  fontSize: "Small" | "Medium" | "Large";
  borderStyle: "None" | "Simple" | "Double" | "Decorative";
  createdAt: string;
  // Customization fields
  showDeityImage?: boolean;
  deityImageUrl?: string;
  showWatermark?: boolean;
  watermarkText?: string;
  accentColor?: string;
  show80GNote?: boolean;
  showSignatureLines?: boolean;
  signatureLabels?: string[];
  showAmountInWords?: boolean;
  showDuplicateCopy?: boolean;
  duplicateLabel?: string;
  templeAddress?: string;
  templePhone?: string;
  templeEmail?: string;
  language?: string;
}

export const paperSizeLabels: Record<string, string> = {
  "A4": "A4 (210 × 297 mm)",
  "A5": "A5 (148 × 210 mm)",
  "3inch": "3 inch Thermal (80 × 297 mm)",
  "80mm": "80mm Thermal Roll",
  "Letter": "Letter (8.5 × 11 in)",
};

export const defaultSevaFields = [
  "Receipt No", "Date", "Devotee Name", "Gothram", "Nakshatra",
  "Seva Name", "Amount", "Payment Mode",
];

export const defaultDonationFields = [
  "Receipt No", "Date", "Donor Name", "Address", "PAN",
  "Donation Purpose", "Amount", "Payment Mode", "80G Certificate No",
];

export const allSevaFields = [
  ...defaultSevaFields, "Phone", "Email", "Booking ID", "Slot Time",
  "Priest Name", "Temple Name", "Counter Name", "Transaction ID",
  "Star / Rashi", "Deity Name",
];

export const allDonationFields = [
  ...defaultDonationFields, "Phone", "Email", "Transaction ID",
  "Bank Name", "Cheque No", "Temple Name", "Counter Name",
  "Donor ID", "Fund Name",
];

export const receiptTemplates: ReceiptTemplate[] = [
  {
    id: "T1", name: "Standard Seva Receipt", type: "Seva", paperSize: "A5", orientation: "Portrait",
    showLogo: true, logoUrl: "", logoPosition: "center", showQR: true,
    headerText: "|| Sri Venkateswara Temple ||", footerText: "Thank you for your devotion. May God bless you.",
    isDefault: true, fields: defaultSevaFields, fontSize: "Medium", borderStyle: "Simple", createdAt: "2025-01-15",
  },
  {
    id: "T2", name: "Thermal Seva Receipt (3\")", type: "Seva", paperSize: "3inch", orientation: "Portrait",
    showLogo: false, logoUrl: "", logoPosition: "center", showQR: true,
    headerText: "Sri Venkateswara Temple", footerText: "Thank you",
    isDefault: false, fields: ["Receipt No", "Date", "Devotee Name", "Seva Name", "Amount"], fontSize: "Small", borderStyle: "None", createdAt: "2025-02-01",
  },
  {
    id: "T3", name: "A4 Seva Receipt", type: "Seva", paperSize: "A4", orientation: "Portrait",
    showLogo: true, logoUrl: "", logoPosition: "left", showQR: true,
    headerText: "|| Sri Venkateswara Temple ||\nSeva Receipt", footerText: "This is a computer-generated receipt.\nThank you for your devotion.",
    isDefault: false, fields: [...defaultSevaFields, "Phone", "Priest Name"], fontSize: "Medium", borderStyle: "Double", createdAt: "2025-03-01",
  },
  {
    id: "T4", name: "Standard Donation Receipt", type: "Donation", paperSize: "A4", orientation: "Portrait",
    showLogo: true, logoUrl: "", logoPosition: "center", showQR: true,
    headerText: "|| Sri Venkateswara Temple Trust ||\nDonation Receipt",
    footerText: "This receipt is eligible for tax exemption under Section 80G of the Income Tax Act.\nThank you for your generous contribution.",
    isDefault: true, fields: defaultDonationFields, fontSize: "Medium", borderStyle: "Simple", createdAt: "2025-01-15",
  },
  {
    id: "T5", name: "Compact Donation Receipt", type: "Donation", paperSize: "A5", orientation: "Portrait",
    showLogo: true, logoUrl: "", logoPosition: "left", showQR: false,
    headerText: "Sri Venkateswara Temple Trust", footerText: "80G Exemption Applicable",
    isDefault: false, fields: ["Receipt No", "Date", "Donor Name", "Donation Purpose", "Amount", "80G Certificate No"], fontSize: "Medium", borderStyle: "Simple", createdAt: "2025-03-10",
  },
  {
    id: "T6", name: "Thermal Donation Receipt", type: "Donation", paperSize: "3inch", orientation: "Portrait",
    showLogo: false, logoUrl: "", logoPosition: "center", showQR: true,
    headerText: "Sri Venkateswara Temple", footerText: "Thank you for your donation",
    isDefault: false, fields: ["Receipt No", "Date", "Donor Name", "Amount", "Payment Mode"], fontSize: "Small", borderStyle: "None", createdAt: "2025-04-01",
  },
];

// Simple in-memory store with subscriber pattern
let _templates = [...receiptTemplates];
let _listeners: (() => void)[] = [];

const notify = () => _listeners.forEach(fn => fn());

export const getReceiptTemplates = () => _templates;

export const getTemplatesByType = (type: "Seva" | "Donation") =>
  _templates.filter(t => t.type === type);

export const getDefaultTemplate = (type: "Seva" | "Donation") =>
  _templates.find(t => t.type === type && t.isDefault) || _templates.find(t => t.type === type);

export const getTemplateById = (id: string) =>
  _templates.find(t => t.id === id);

export const addReceiptTemplate = (template: ReceiptTemplate) => {
  _templates = [..._templates, template];
  notify();
};

export const updateReceiptTemplate = (id: string, updates: Partial<ReceiptTemplate>) => {
  _templates = _templates.map(t => t.id === id ? { ...t, ...updates } : t);
  notify();
};

export const deleteReceiptTemplate = (id: string) => {
  _templates = _templates.filter(t => t.id !== id);
  notify();
};

export const setDefaultTemplate = (id: string) => {
  const template = _templates.find(t => t.id === id);
  if (!template) return;
  _templates = _templates.map(t =>
    t.type === template.type ? { ...t, isDefault: t.id === id } : t
  );
  notify();
};

export const subscribeTemplates = (listener: () => void) => {
  _listeners = [..._listeners, listener];
  return () => { _listeners = _listeners.filter(l => l !== listener); };
};
