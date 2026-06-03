import { useState, useSyncExternalStore } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  FileText, Pencil, Eye, Plus, Copy, Trash2, Upload, Image as ImageIcon,
  Printer, Star, Check, Settings2, Palette, Type, LayoutTemplate, Globe, Stamp
} from "lucide-react";
import { toast } from "sonner";
import {
  type ReceiptTemplate,
  paperSizeLabels,
  defaultSevaFields, defaultDonationFields,
  allSevaFields, allDonationFields,
  getReceiptTemplates, subscribeTemplates,
  addReceiptTemplate, updateReceiptTemplate, deleteReceiptTemplate, setDefaultTemplate,
} from "@/data/receiptTemplateData";

interface PreviewFormData {
  showDeityImage?: boolean;
  deityImageUrl?: string;
  showWatermark?: boolean;
  watermarkText?: string;
  accentColor?: string;
  showSignatureLines?: boolean;
  signatureLabels?: string[];
  showAmountInWords?: boolean;
  show80GNote?: boolean;
  templeAddress?: string;
  templePhone?: string;
  templeEmail?: string;
  showDuplicateCopy?: boolean;
  duplicateLabel?: string;
}

const previewSizeClass = (size: string) => {
  switch (size) {
    case "3inch":
    case "80mm": return "max-w-[260px] mx-auto text-[10px]";
    case "A5": return "max-w-[360px] mx-auto text-xs";
    default: return "max-w-[460px] mx-auto text-sm";
  }
};

const borderClass = (style: string) => {
  switch (style) {
    case "Double": return "border-4 border-double border-foreground/20";
    case "Decorative": return "border-2 border-dashed border-primary/40";
    case "Simple": return "border border-foreground/15";
    default: return "";
  }
};

const ReceiptPreviewContent = ({ template, form }: { template: ReceiptTemplate; form: PreviewFormData | null }) => {
  // When form is null (card preview), read from saved template data
  const f: PreviewFormData = form || {
    showDeityImage: template.showDeityImage,
    deityImageUrl: template.deityImageUrl,
    showWatermark: template.showWatermark,
    watermarkText: template.watermarkText,
    accentColor: template.accentColor,
    showSignatureLines: template.showSignatureLines,
    signatureLabels: template.signatureLabels,
    showAmountInWords: template.showAmountInWords,
    show80GNote: template.show80GNote,
    templeAddress: template.templeAddress,
    templePhone: template.templePhone,
    templeEmail: template.templeEmail,
    showDuplicateCopy: template.showDuplicateCopy,
    duplicateLabel: template.duplicateLabel,
  };
  const accentColor = f.accentColor || "#7c2d12";
  const showSignatures = f.showSignatureLines !== false;
  const sigLabels = f.signatureLabels || ["Treasurer", "Receiver's Signature"];
  const show80G = f.show80GNote !== false && template.type === "Donation";
  const address = f.templeAddress || "Address Line, City, State - PIN";
  const phone = f.templePhone || "0XXXX-XXXXXX";
  const email = f.templeEmail || "info@temple.org";

  return (
    <div className={`${previewSizeClass(template.paperSize)} ${borderClass(template.borderStyle)} rounded-lg bg-card overflow-hidden relative`}>
      {/* Deity image watermark */}
      {f.showDeityImage && f.deityImageUrl && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 1 }}>
          <img src={f.deityImageUrl} alt="" className="w-2/3 h-2/3 object-contain" style={{ opacity: 0.08 }} />
        </div>
      )}

      {/* Text watermark */}
      {f.showWatermark && f.watermarkText && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 1, transform: "rotate(-30deg)", opacity: 0.06 }}>
          <span className="text-5xl font-bold text-foreground tracking-[0.2em] select-none">{f.watermarkText}</span>
        </div>
      )}

      {/* Top accent bar */}
      <div className="h-2" style={{ backgroundColor: accentColor }} />

      <div className="p-5 space-y-3 relative z-10">
        {/* Header */}
        <div className="text-center space-y-1">
          {template.showLogo && (
            <div className={`flex mb-2 ${template.logoPosition === "center" ? "justify-center" : template.logoPosition === "right" ? "justify-end" : "justify-start"}`}>
              {template.logoUrl ? (
                <img src={template.logoUrl} alt="Logo" className="h-14 w-auto object-contain" />
              ) : (
                <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ backgroundColor: accentColor + "1a" }}>
                  <ImageIcon className="h-7 w-7" style={{ color: accentColor }} />
                </div>
              )}
            </div>
          )}
          <p className={`font-bold whitespace-pre-line font-serif ${template.fontSize === "Small" ? "text-sm" : template.fontSize === "Large" ? "text-xl" : "text-base"}`} style={{ color: accentColor }}>
            {template.headerText || "Temple Name"}
          </p>
          <p className="text-[10px] text-muted-foreground">{address}</p>
          <p className="text-[10px] text-muted-foreground">Tel: {phone} | Email: {email}</p>
        </div>

        <Separator style={{ borderColor: accentColor + "40" }} />

        {/* Receipt No & Date */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className={`font-semibold text-foreground ${template.fontSize === "Small" ? "text-xs" : "text-sm"}`}>No.</span>
            <span className="font-bold text-lg border-b-2 px-3 min-w-[60px] text-center font-serif" style={{ color: accentColor, borderColor: accentColor + "60" }}>1626</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-muted-foreground ${template.fontSize === "Small" ? "text-xs" : "text-sm"}`}>Date:</span>
            <span className="border-b border-dashed border-muted-foreground/40 min-w-[100px] text-center text-sm font-serif">23/03/2026</span>
          </div>
        </div>

        {/* Traditional form fields */}
        <div className="space-y-3 pt-1">
          <div className="flex items-baseline gap-2">
            <span className={`text-foreground shrink-0 ${template.fontSize === "Small" ? "text-xs" : "text-sm"}`}>
              Received with thanks from Smt/Sri
            </span>
            <span className="flex-1 border-b border-dotted border-muted-foreground/40 min-h-[16px]" />
          </div>

          {template.type === "Seva" && template.fields.includes("Gothram") && (
            <div className="flex items-baseline gap-2">
              <span className={`text-foreground shrink-0 ${template.fontSize === "Small" ? "text-xs" : "text-sm"}`}>Gothram</span>
              <span className="flex-1 border-b border-dotted border-muted-foreground/40 min-h-[16px]" />
              <span className={`text-foreground shrink-0 ${template.fontSize === "Small" ? "text-xs" : "text-sm"}`}>Nakshatra</span>
              <span className="flex-1 border-b border-dotted border-muted-foreground/40 min-h-[16px]" />
            </div>
          )}

          {(f.showAmountInWords !== false) && (
            <div className="flex items-baseline gap-2">
              <span className={`text-foreground shrink-0 ${template.fontSize === "Small" ? "text-xs" : "text-sm"}`}>A Sum of Rupees</span>
              <span className="flex-1 border-b border-dotted border-muted-foreground/40 min-h-[16px]" />
              <span className={`text-foreground shrink-0 ${template.fontSize === "Small" ? "text-xs" : "text-sm"}`}>only</span>
            </div>
          )}

          <div className="flex items-baseline gap-2">
            <span className={`text-foreground shrink-0 ${template.fontSize === "Small" ? "text-xs" : "text-sm"}`}>by Cash/DD/Cheque No.</span>
            <span className="flex-1 border-b border-dotted border-muted-foreground/40 min-h-[16px]" />
            <span className={`text-foreground shrink-0 ${template.fontSize === "Small" ? "text-xs" : "text-sm"}`}>Dt.</span>
            <span className="w-[80px] border-b border-dotted border-muted-foreground/40 min-h-[16px]" />
          </div>

          <div className="flex items-baseline gap-2">
            <span className={`text-foreground shrink-0 ${template.fontSize === "Small" ? "text-xs" : "text-sm"}`}>
              {template.type === "Seva" ? "Towards Seva" : "Towards"}
            </span>
            <span className="flex-1 border-b border-dotted border-muted-foreground/40 min-h-[16px]" />
          </div>

          {template.fields
            .filter(fl => !["Receipt No", "Date", "Devotee Name", "Donor Name", "Amount", "Payment Mode", "Gothram", "Nakshatra", "Seva Name", "Donation Purpose"].includes(fl))
            .map(field => (
              <div key={field} className="flex items-baseline gap-2">
                <span className={`text-foreground shrink-0 ${template.fontSize === "Small" ? "text-xs" : "text-sm"}`}>{field}</span>
                <span className="flex-1 border-b border-dotted border-muted-foreground/40 min-h-[16px]" />
              </div>
            ))}
        </div>

        <Separator className="border-muted-foreground/20" />

        {/* Amount box and signatures */}
        <div className="flex justify-between items-end pt-1">
          <div className="border-2 rounded px-3 py-1.5 font-bold text-foreground flex items-center gap-1 font-serif" style={{ borderColor: accentColor + "50" }}>
            <span className="text-sm">Rs.</span>
            <span className="min-w-[60px] border-b border-dotted border-muted-foreground/40" />
          </div>
          {showSignatures && (
            <div className="flex gap-8 text-center">
              <div>
                <div className="border-b border-muted-foreground/40 min-w-[80px] mb-1" />
                <span className="text-[10px] text-muted-foreground">{sigLabels[0]}</span>
              </div>
              <div>
                <div className="border-b border-muted-foreground/40 min-w-[80px] mb-1" />
                <span className="text-[10px] text-muted-foreground">{sigLabels[1]}</span>
              </div>
            </div>
          )}
        </div>

        {/* 80G Tax Note */}
        {show80G && (
          <div className="border rounded p-2 text-center" style={{ borderColor: accentColor + "30" }}>
            <p className="text-[9px] text-muted-foreground">
              Donations are exempt U/s. 80G of the Income Tax Act, 1961.<br />
              This receipt is eligible for tax deduction under Section 80G.
            </p>
          </div>
        )}

        {/* QR Code */}
        {template.showQR && (
          <div className="flex justify-center pt-1">
            <div className="w-12 h-12 border-2 border-dashed border-muted-foreground/30 rounded flex items-center justify-center">
              <span className="text-[8px] text-muted-foreground">QR</span>
            </div>
          </div>
        )}

        {/* Footer */}
        {template.footerText && (
          <p className={`text-center text-muted-foreground whitespace-pre-line italic ${template.fontSize === "Small" ? "text-[8px]" : "text-[10px]"}`}>
            {template.footerText}
          </p>
        )}

        {/* Duplicate copy label */}
        {f.showDuplicateCopy && (
          <p className="text-center text-[9px] text-muted-foreground font-medium uppercase tracking-wider pt-1">— {f.duplicateLabel || "Office Copy"} —</p>
        )}
      </div>

      {/* Bottom accent bar */}
      <div className="h-1.5" style={{ backgroundColor: accentColor + "99" }} />
    </div>
  );
};

const ReceiptTemplates = () => {
  const navigate = useNavigate();
  const templates = useSyncExternalStore(subscribeTemplates, getReceiptTemplates, getReceiptTemplates);
  const [activeTab, setActiveTab] = useState("Seva");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<ReceiptTemplate | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<ReceiptTemplate | null>(null);
  const [editSection, setEditSection] = useState("basic");
  const [showEditPreview, setShowEditPreview] = useState(false);

  const [form, setForm] = useState({
    name: "", type: "Seva" as "Seva" | "Donation",
    paperSize: "A5" as ReceiptTemplate["paperSize"],
    orientation: "Portrait" as "Portrait" | "Landscape",
    showLogo: true, logoUrl: "", logoPosition: "center" as "left" | "center" | "right",
    showQR: true, headerText: "", footerText: "",
    fields: [] as string[],
    fontSize: "Medium" as "Small" | "Medium" | "Large",
    borderStyle: "Simple" as "None" | "Simple" | "Double" | "Decorative",
    // New customization fields
    deityImageUrl: "",
    showDeityImage: false,
    watermarkText: "",
    showWatermark: false,
    language: "English" as "English" | "Hindi" | "Telugu" | "Tamil" | "Kannada" | "Sanskrit",
    showDuplicateCopy: true,
    duplicateLabel: "Office Copy" as "Office Copy" | "Donor Copy" | "Duplicate",
    accentColor: "#7c2d12" as string,
    showSignatureLines: true,
    signatureLabels: ["Treasurer", "Receiver's Signature"] as string[],
    showAmountInWords: true,
    show80GNote: true,
    templeAddress: "",
    templePhone: "",
    templeEmail: "",
  });

  const filtered = templates.filter(t => t.type === activeTab);

  const openEdit = (template?: ReceiptTemplate) => {
    setEditSection("basic");
    if (template) {
      setEditingTemplate(template);
      setForm({
        name: template.name, type: template.type, paperSize: template.paperSize,
        orientation: template.orientation, showLogo: template.showLogo, logoUrl: template.logoUrl,
        logoPosition: template.logoPosition, showQR: template.showQR,
        headerText: template.headerText, footerText: template.footerText,
        fields: [...template.fields], fontSize: template.fontSize, borderStyle: template.borderStyle,
        deityImageUrl: template.deityImageUrl || "",
        showDeityImage: template.showDeityImage || false,
        watermarkText: template.watermarkText || "",
        showWatermark: template.showWatermark || false,
        language: (template.language as any) || "English",
        showDuplicateCopy: template.showDuplicateCopy ?? true,
        duplicateLabel: (template.duplicateLabel as any) || "Office Copy",
        accentColor: template.accentColor || "#7c2d12",
        showSignatureLines: template.showSignatureLines ?? true,
        signatureLabels: template.signatureLabels || ["Treasurer", "Receiver's Signature"],
        showAmountInWords: template.showAmountInWords ?? true,
        show80GNote: template.show80GNote ?? true,
        templeAddress: template.templeAddress || "",
        templePhone: template.templePhone || "",
        templeEmail: template.templeEmail || "",
      });
    } else {
      setEditingTemplate(null);
      const defaults = activeTab === "Seva" ? defaultSevaFields : defaultDonationFields;
      setForm({
        name: "", type: activeTab as "Seva" | "Donation", paperSize: "A5", orientation: "Portrait",
        showLogo: true, logoUrl: "", logoPosition: "center", showQR: true,
        headerText: "", footerText: "", fields: [...defaults], fontSize: "Medium", borderStyle: "Simple",
        deityImageUrl: "", showDeityImage: false, watermarkText: "",
        showWatermark: false, language: "English", showDuplicateCopy: true,
        duplicateLabel: "Office Copy", accentColor: "#7c2d12", showSignatureLines: true,
        signatureLabels: ["Treasurer", "Receiver's Signature"],
        showAmountInWords: true, show80GNote: true,
        templeAddress: "", templePhone: "", templeEmail: "",
      });
    }
    setIsEditOpen(true);
  };

  const handleSave = () => {
    if (!form.name) { toast.error("Template name is required"); return; }
    const customFields = {
      showDeityImage: form.showDeityImage, deityImageUrl: form.deityImageUrl,
      showWatermark: form.showWatermark, watermarkText: form.watermarkText,
      accentColor: form.accentColor, show80GNote: form.show80GNote,
      showSignatureLines: form.showSignatureLines, signatureLabels: form.signatureLabels,
      showAmountInWords: form.showAmountInWords, showDuplicateCopy: form.showDuplicateCopy,
      duplicateLabel: form.duplicateLabel, templeAddress: form.templeAddress,
      templePhone: form.templePhone, templeEmail: form.templeEmail, language: form.language,
    };
    if (editingTemplate) {
      updateReceiptTemplate(editingTemplate.id, {
        name: form.name, type: form.type, paperSize: form.paperSize,
        orientation: form.orientation, showLogo: form.showLogo, logoUrl: form.logoUrl,
        logoPosition: form.logoPosition, showQR: form.showQR,
        headerText: form.headerText, footerText: form.footerText,
        fields: form.fields, fontSize: form.fontSize, borderStyle: form.borderStyle,
        ...customFields,
      });
      toast.success("Template updated");
    } else {
      addReceiptTemplate({
        id: `T${Date.now()}`, name: form.name, type: form.type, paperSize: form.paperSize,
        orientation: form.orientation, showLogo: form.showLogo, logoUrl: form.logoUrl,
        logoPosition: form.logoPosition, showQR: form.showQR,
        headerText: form.headerText, footerText: form.footerText,
        fields: form.fields, fontSize: form.fontSize, borderStyle: form.borderStyle,
        isDefault: false, createdAt: new Date().toISOString().split("T")[0],
        ...customFields,
      });
      toast.success("Template created");
    }
    setIsEditOpen(false);
  };

  const handleDuplicate = (template: ReceiptTemplate) => {
    addReceiptTemplate({
      ...template, id: `T${Date.now()}`, name: `${template.name} (Copy)`,
      isDefault: false, createdAt: new Date().toISOString().split("T")[0],
    });
    toast.success("Template duplicated");
  };

  const handleDelete = (id: string) => {
    const template = templates.find(t => t.id === id);
    if (template?.isDefault) { toast.error("Cannot delete default template"); return; }
    deleteReceiptTemplate(id);
    toast.success("Template deleted");
  };

  const toggleField = (field: string) => {
    setForm(prev => ({
      ...prev,
      fields: prev.fields.includes(field) ? prev.fields.filter(f => f !== field) : [...prev.fields, field],
    }));
  };

  const currentAllFields = form.type === "Seva" ? allSevaFields : allDonationFields;


  const editSections = [
    { id: "basic", label: "Layout & Size", icon: LayoutTemplate },
    { id: "branding", label: "Logo & Branding", icon: ImageIcon },
    { id: "header", label: "Header & Footer", icon: Type },
    { id: "fields", label: "Receipt Fields", icon: FileText },
    { id: "style", label: "Style & Colors", icon: Palette },
    { id: "advanced", label: "Advanced", icon: Settings2 },
  ];

  return (
    <div className="p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        {/* Page Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" />
              Receipt Templates
            </h1>
            <p className="text-muted-foreground mt-1">
              Design and manage receipt layouts for Seva and Donation transactions. Templates can be assigned per offering or donation type.
            </p>
          </div>
          <Button onClick={() => navigate("/temple/settings/templates/builder")} className="gap-2">
            <Plus className="h-4 w-4" />New Template
          </Button>
        </div>


        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="Seva" className="gap-1.5"><Printer className="h-3.5 w-3.5" />Seva Receipts</TabsTrigger>
            <TabsTrigger value="Donation" className="gap-1.5"><FileText className="h-3.5 w-3.5" />Donation Receipts</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map(t => (
                <Card key={t.id} className="relative overflow-hidden hover:shadow-md transition-all group border-border/60">
                  {/* Accent bar */}
                  <div className="h-1 bg-primary/60" />

                  {t.isDefault && (
                    <div className="absolute top-4 right-3 z-10">
                      <Badge className="bg-primary text-primary-foreground text-[10px] gap-1">
                        <Star className="h-2.5 w-2.5" />Default
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="pb-2 pt-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 bg-primary/10 rounded-xl shrink-0">
                        {t.logoUrl ? (
                          <img src={t.logoUrl} alt="Logo" className="h-6 w-6 object-contain" />
                        ) : (
                          <FileText className="h-6 w-6 text-primary" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <CardTitle className="text-sm font-semibold truncate">{t.name}</CardTitle>
                        <CardDescription className="text-xs mt-0.5">
                          {paperSizeLabels[t.paperSize]?.split("(")[0]?.trim() || t.paperSize} · {t.orientation}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0 pb-4">
                    {/* Features */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      <Badge variant="outline" className="text-[10px] h-5">{t.fontSize}</Badge>
                      <Badge variant="outline" className="text-[10px] h-5">{t.borderStyle}</Badge>
                      {t.showLogo && <Badge variant="outline" className="text-[10px] h-5 gap-0.5"><ImageIcon className="h-2.5 w-2.5" />Logo</Badge>}
                      {t.showQR && <Badge variant="outline" className="text-[10px] h-5 gap-0.5"><Stamp className="h-2.5 w-2.5" />QR</Badge>}
                    </div>

                    {/* Fields */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {t.fields.slice(0, 5).map(f => (
                        <Badge key={f} variant="secondary" className="text-[10px] h-5">{f}</Badge>
                      ))}
                      {t.fields.length > 5 && (
                        <Badge variant="secondary" className="text-[10px] h-5">+{t.fields.length - 5} more</Badge>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <Button size="sm" variant="outline" className="h-7 text-xs gap-1 px-2.5" onClick={() => { setPreviewTemplate(t); setIsPreviewOpen(true); }}>
                        <Eye className="h-3 w-3" />Preview
                      </Button>
                      <Button size="sm" variant="outline" className="h-7 text-xs gap-1 px-2.5" onClick={() => navigate(`/temple/settings/templates/builder?id=${t.id}`)}>
                        <Pencil className="h-3 w-3" />Edit
                      </Button>
                      <Button size="sm" variant="outline" className="h-7 text-xs px-2" onClick={() => handleDuplicate(t)} title="Duplicate">
                        <Copy className="h-3 w-3" />
                      </Button>
                      {!t.isDefault && (
                        <>
                          <Button size="sm" variant="outline" className="h-7 text-xs gap-1 px-2.5" onClick={() => { setDefaultTemplate(t.id); toast.success("Default template updated"); }}>
                            <Check className="h-3 w-3" />Set Default
                          </Button>
                          <Button size="sm" variant="ghost" className="h-7 text-xs text-destructive px-2" onClick={() => handleDelete(t.id)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Add New Card */}
              <Card
                className="border-dashed border-2 border-muted-foreground/20 hover:border-primary/40 cursor-pointer transition-colors flex items-center justify-center min-h-[200px]"
                onClick={() => navigate("/temple/settings/templates/builder")}
              >
                <div className="text-center text-muted-foreground">
                  <Plus className="h-8 w-8 mx-auto mb-2 opacity-40" />
                  <p className="text-sm font-medium">Create New Template</p>
                  <p className="text-xs opacity-60">Start from scratch</p>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* ──── Edit/Create Template Dialog ──── */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className={`${showEditPreview ? "sm:max-w-[920px] lg:max-w-[1140px]" : "sm:max-w-[820px]"} max-h-[90vh] w-[calc(100vw-2rem)] p-0 bg-background overflow-hidden transition-all`}>
          <DialogHeader className="px-6 pt-5 pb-3 border-b">
            <DialogTitle className="flex items-center gap-2">
              <Settings2 className="h-5 w-5 text-primary" />
              {editingTemplate ? "Edit Template" : "Create New Template"}
            </DialogTitle>
            <DialogDescription>Configure receipt layout, fields, branding, and style</DialogDescription>
          </DialogHeader>

          <div className={`flex h-[60vh] ${showEditPreview ? "flex-col lg:flex-row" : "flex-row"}`}>
            {/* Left sidebar navigation */}
            <div className={`border-r bg-muted/30 p-3 space-y-1 shrink-0 ${showEditPreview ? "w-full lg:w-48 border-b lg:border-b-0" : "w-48"}`}>
              {editSections.map(s => (
                <button
                  key={s.id}
                  onClick={() => setEditSection(s.id)}
                  className={`w-full flex items-center gap-2 text-xs px-3 py-2 rounded-md transition-colors text-left ${
                    editSection === s.id
                      ? "bg-primary text-primary-foreground font-medium"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <s.icon className="h-3.5 w-3.5 shrink-0" />
                  {s.label}
                </button>
              ))}
            </div>

            {/* Right content area */}
            <ScrollArea className="flex-1 min-h-0">
              <div className="p-5 space-y-5">
                {/* Basic / Layout & Size */}
                {editSection === "basic" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <div>
                      <Label>Template Name *</Label>
                      <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Standard Seva Receipt" className="mt-1" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>Receipt Type</Label>
                        <Select value={form.type} onValueChange={v => setForm({ ...form, type: v as any, fields: v === "Seva" ? [...defaultSevaFields] : [...defaultDonationFields] })}>
                          <SelectTrigger className="bg-background mt-1"><SelectValue /></SelectTrigger>
                          <SelectContent className="bg-popover">
                            <SelectItem value="Seva">Seva Receipt</SelectItem>
                            <SelectItem value="Donation">Donation Receipt</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Paper Size</Label>
                        <Select value={form.paperSize} onValueChange={v => setForm({ ...form, paperSize: v as any })}>
                          <SelectTrigger className="bg-background mt-1"><SelectValue /></SelectTrigger>
                          <SelectContent className="bg-popover">
                            <SelectItem value="A4">A4 (210 × 297 mm)</SelectItem>
                            <SelectItem value="A5">A5 (148 × 210 mm)</SelectItem>
                            <SelectItem value="3inch">3 inch Thermal</SelectItem>
                            <SelectItem value="80mm">80mm Thermal Roll</SelectItem>
                            <SelectItem value="Letter">US Letter</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>Orientation</Label>
                        <Select value={form.orientation} onValueChange={v => setForm({ ...form, orientation: v as any })}>
                          <SelectTrigger className="bg-background mt-1"><SelectValue /></SelectTrigger>
                          <SelectContent className="bg-popover">
                            <SelectItem value="Portrait">Portrait</SelectItem>
                            <SelectItem value="Landscape">Landscape</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Language</Label>
                        <Select value={form.language} onValueChange={v => setForm({ ...form, language: v as any })}>
                          <SelectTrigger className="bg-background mt-1"><SelectValue /></SelectTrigger>
                          <SelectContent className="bg-popover">
                            <SelectItem value="English">English</SelectItem>
                            <SelectItem value="Hindi">Hindi (हिन्दी)</SelectItem>
                            <SelectItem value="Telugu">Telugu (తెలుగు)</SelectItem>
                            <SelectItem value="Tamil">Tamil (தமிழ்)</SelectItem>
                            <SelectItem value="Kannada">Kannada (ಕನ್ನಡ)</SelectItem>
                            <SelectItem value="Sanskrit">Sanskrit (संस्कृतम्)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Separator />
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Print Duplicate Copy</Label>
                          <p className="text-xs text-muted-foreground">Print an additional copy (Original + Office Copy)</p>
                        </div>
                        <Switch checked={form.showDuplicateCopy} onCheckedChange={v => setForm({ ...form, showDuplicateCopy: v })} />
                      </div>
                      {form.showDuplicateCopy && (
                        <div>
                          <Label>Duplicate Label</Label>
                          <Select value={form.duplicateLabel} onValueChange={v => setForm({ ...form, duplicateLabel: v as any })}>
                            <SelectTrigger className="bg-background mt-1 w-48"><SelectValue /></SelectTrigger>
                            <SelectContent className="bg-popover">
                              <SelectItem value="Office Copy">Office Copy</SelectItem>
                              <SelectItem value="Donor Copy">Donor Copy</SelectItem>
                              <SelectItem value="Duplicate">Duplicate</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Branding */}
                {editSection === "branding" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Show Temple Logo</Label>
                        <p className="text-xs text-muted-foreground">Display temple logo on the receipt header</p>
                      </div>
                      <Switch checked={form.showLogo} onCheckedChange={v => setForm({ ...form, showLogo: v })} />
                    </div>
                    <AnimatePresence>
                      {form.showLogo && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="space-y-3 overflow-hidden">
                          <div>
                            <Label>Logo Image</Label>
                            <div className="flex gap-2 mt-1">
                              <Input value={form.logoUrl} onChange={e => setForm({ ...form, logoUrl: e.target.value })} placeholder="Paste URL or upload image" className="flex-1" />
                              <label className="shrink-0">
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={e => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      if (file.size > 2 * 1024 * 1024) {
                                        toast.error("Image must be under 2MB");
                                        return;
                                      }
                                      const reader = new FileReader();
                                      reader.onload = () => setForm(prev => ({ ...prev, logoUrl: reader.result as string }));
                                      reader.readAsDataURL(file);
                                    }
                                  }}
                                />
                                <Button variant="outline" size="icon" className="shrink-0 cursor-pointer" asChild>
                                  <span><Upload className="h-4 w-4" /></span>
                                </Button>
                              </label>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">Upload an image (max 2MB) or paste a URL</p>
                          </div>
                          {form.logoUrl && (
                            <div className="flex items-center gap-3 p-3 border rounded-lg bg-muted/30">
                              <img src={form.logoUrl} alt="Logo preview" className="h-14 w-14 object-contain rounded" onError={e => (e.currentTarget.style.display = 'none')} />
                              <p className="text-xs text-muted-foreground">Logo Preview</p>
                            </div>
                          )}
                          <div>
                            <Label>Logo Position</Label>
                            <Select value={form.logoPosition} onValueChange={v => setForm({ ...form, logoPosition: v as any })}>
                              <SelectTrigger className="bg-background mt-1"><SelectValue /></SelectTrigger>
                              <SelectContent className="bg-popover">
                                <SelectItem value="left">Left</SelectItem>
                                <SelectItem value="center">Center</SelectItem>
                                <SelectItem value="right">Right</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Show Deity Image / Watermark</Label>
                        <p className="text-xs text-muted-foreground">Faded background deity image on the receipt</p>
                      </div>
                      <Switch checked={form.showDeityImage} onCheckedChange={v => setForm({ ...form, showDeityImage: v })} />
                    </div>
                    {form.showDeityImage && (
                      <div>
                        <Label>Deity Image</Label>
                        <div className="flex gap-2 mt-1">
                          <Input value={form.deityImageUrl} onChange={e => setForm({ ...form, deityImageUrl: e.target.value })} placeholder="Paste URL or upload image" className="flex-1" />
                          <label className="shrink-0">
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={e => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  if (file.size > 2 * 1024 * 1024) {
                                    toast.error("Image must be under 2MB");
                                    return;
                                  }
                                  const reader = new FileReader();
                                  reader.onload = () => setForm(prev => ({ ...prev, deityImageUrl: reader.result as string }));
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                            <Button variant="outline" size="icon" className="shrink-0 cursor-pointer" asChild>
                              <span><Upload className="h-4 w-4" /></span>
                            </Button>
                          </label>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Upload an image (max 2MB) or paste a URL</p>
                        {form.deityImageUrl && (
                          <div className="flex items-center gap-3 p-3 border rounded-lg bg-muted/30 mt-2">
                            <img src={form.deityImageUrl} alt="Deity preview" className="h-14 w-14 object-contain rounded opacity-30" onError={e => (e.currentTarget.style.display = 'none')} />
                            <p className="text-xs text-muted-foreground">Deity Image Preview (shown as watermark)</p>
                          </div>
                        )}
                      </div>
                    )}

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Text Watermark</Label>
                        <p className="text-xs text-muted-foreground">Faint diagonal text watermark (e.g. "ORIGINAL")</p>
                      </div>
                      <Switch checked={form.showWatermark} onCheckedChange={v => setForm({ ...form, showWatermark: v })} />
                    </div>
                    {form.showWatermark && (
                      <div>
                        <Label>Watermark Text</Label>
                        <Input value={form.watermarkText} onChange={e => setForm({ ...form, watermarkText: e.target.value })} placeholder="ORIGINAL" className="mt-1 w-48" />
                      </div>
                    )}

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Show QR Code</Label>
                        <p className="text-xs text-muted-foreground">QR code for digital verification</p>
                      </div>
                      <Switch checked={form.showQR} onCheckedChange={v => setForm({ ...form, showQR: v })} />
                    </div>
                  </motion.div>
                )}

                {/* Header & Footer */}
                {editSection === "header" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <div>
                      <Label>Header Text (Temple Name / Title)</Label>
                      <Textarea value={form.headerText} onChange={e => setForm({ ...form, headerText: e.target.value })} placeholder="|| Sri Venkateswara Temple ||" rows={2} className="mt-1 font-serif" />
                      <p className="text-xs text-muted-foreground mt-1">Use \n for multiple lines. E.g. temple name on line 1, subtitle on line 2</p>
                    </div>
                    <div>
                      <Label>Temple Address</Label>
                      <Input value={form.templeAddress} onChange={e => setForm({ ...form, templeAddress: e.target.value })} placeholder="Tirumala, Chittoor District, AP - 517504" className="mt-1" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>Phone</Label>
                        <Input value={form.templePhone} onChange={e => setForm({ ...form, templePhone: e.target.value })} placeholder="+91 877 223 1234" className="mt-1" />
                      </div>
                      <div>
                        <Label>Email</Label>
                        <Input value={form.templeEmail} onChange={e => setForm({ ...form, templeEmail: e.target.value })} placeholder="info@temple.org" className="mt-1" />
                      </div>
                    </div>
                    <Separator />
                    <div>
                      <Label>Footer Text</Label>
                      <Textarea value={form.footerText} onChange={e => setForm({ ...form, footerText: e.target.value })} placeholder="Thank you for your devotion. May God bless you." rows={2} className="mt-1" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Show 80G Tax Note</Label>
                        <p className="text-xs text-muted-foreground">Show tax exemption note on donation receipts</p>
                      </div>
                      <Switch checked={form.show80GNote} onCheckedChange={v => setForm({ ...form, show80GNote: v })} />
                    </div>
                  </motion.div>
                )}

                {/* Receipt Fields */}
                {editSection === "fields" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <div>
                      <Label className="text-sm">Select fields to show on the receipt</Label>
                      <p className="text-xs text-muted-foreground mb-3">Click to toggle fields. Selected fields appear on the printed receipt.</p>
                      <div className="flex flex-wrap gap-2">
                        {currentAllFields.map(field => (
                          <Badge
                            key={field}
                            variant={form.fields.includes(field) ? "default" : "outline"}
                            className={`cursor-pointer select-none px-3 py-1.5 text-xs transition-all ${
                              form.fields.includes(field) ? "shadow-sm" : "opacity-60 hover:opacity-100"
                            }`}
                            onClick={() => toggleField(field)}
                          >
                            {form.fields.includes(field) && <Check className="h-3 w-3 mr-1" />}
                            {field}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Show Amount in Words</Label>
                        <p className="text-xs text-muted-foreground">"A Sum of Rupees Five Hundred Only"</p>
                      </div>
                      <Switch checked={form.showAmountInWords} onCheckedChange={v => setForm({ ...form, showAmountInWords: v })} />
                    </div>
                  </motion.div>
                )}

                {/* Style & Colors */}
                {editSection === "style" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>Font Size</Label>
                        <Select value={form.fontSize} onValueChange={v => setForm({ ...form, fontSize: v as any })}>
                          <SelectTrigger className="bg-background mt-1"><SelectValue /></SelectTrigger>
                          <SelectContent className="bg-popover">
                            <SelectItem value="Small">Small (Thermal)</SelectItem>
                            <SelectItem value="Medium">Medium (Standard)</SelectItem>
                            <SelectItem value="Large">Large</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Border Style</Label>
                        <Select value={form.borderStyle} onValueChange={v => setForm({ ...form, borderStyle: v as any })}>
                          <SelectTrigger className="bg-background mt-1"><SelectValue /></SelectTrigger>
                          <SelectContent className="bg-popover">
                            <SelectItem value="None">None</SelectItem>
                            <SelectItem value="Simple">Simple Line</SelectItem>
                            <SelectItem value="Double">Double Line</SelectItem>
                            <SelectItem value="Decorative">Decorative</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label>Accent Color</Label>
                      <div className="flex items-center gap-3 mt-1">
                        <input type="color" value={form.accentColor} onChange={e => setForm({ ...form, accentColor: e.target.value })} className="w-10 h-10 rounded border cursor-pointer" />
                        <Input value={form.accentColor} onChange={e => setForm({ ...form, accentColor: e.target.value })} className="w-28 font-mono text-xs" />
                        <p className="text-xs text-muted-foreground">Used for header, borders, and receipt number</p>
                      </div>
                    </div>
                    <Separator />
                    <div>
                      <Label className="text-sm mb-2 block">Preview Sizes</Label>
                      <div className="grid grid-cols-3 gap-2">
                        {["A4", "A5", "3inch"].map(size => (
                          <div key={size} className={`border rounded-lg p-3 text-center text-xs cursor-pointer transition-all ${form.paperSize === size ? "border-primary bg-primary/5" : "border-muted hover:border-muted-foreground/40"}`}
                            onClick={() => setForm({ ...form, paperSize: size as any })}
                          >
                            <div className={`mx-auto bg-muted/50 rounded mb-1.5 ${size === "3inch" ? "w-6 h-10" : size === "A5" ? "w-8 h-10" : "w-10 h-12"}`} />
                            <span className="font-medium">{size}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Advanced */}
                {editSection === "advanced" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Show Signature Lines</Label>
                        <p className="text-xs text-muted-foreground">Signature areas at the bottom of the receipt</p>
                      </div>
                      <Switch checked={form.showSignatureLines} onCheckedChange={v => setForm({ ...form, showSignatureLines: v })} />
                    </div>
                    {form.showSignatureLines && (
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label>Left Signature Label</Label>
                          <Input value={form.signatureLabels[0]} onChange={e => setForm({ ...form, signatureLabels: [e.target.value, form.signatureLabels[1]] })} className="mt-1" />
                        </div>
                        <div>
                          <Label>Right Signature Label</Label>
                          <Input value={form.signatureLabels[1]} onChange={e => setForm({ ...form, signatureLabels: [form.signatureLabels[0], e.target.value] })} className="mt-1" />
                        </div>
                      </div>
                    )}
                    <Separator />
                    <div className="p-4 rounded-lg bg-muted/30 border border-dashed">
                      <p className="text-sm font-medium text-muted-foreground mb-1">💡 Tips</p>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        <li>• Use <strong>3 inch / 80mm</strong> paper size for thermal printers at counters</li>
                        <li>• <strong>A5 Portrait</strong> is ideal for standard seva receipts</li>
                        <li>• <strong>A4</strong> works best for donation receipts with 80G details</li>
                        <li>• Enable <strong>Duplicate Copy</strong> to print Original + Office Copy together</li>
                        <li>• Upload a deity image for a traditional watermark look</li>
                      </ul>
                    </div>
                  </motion.div>
                )}
              </div>
            </ScrollArea>

            {/* Live preview panel */}
            {showEditPreview && (
              <ScrollArea className="w-full lg:w-[320px] border-t lg:border-t-0 lg:border-l bg-muted/20 p-4 shrink-0 max-h-[42vh] lg:max-h-none">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Live Preview</p>
                <ReceiptPreviewContent
                  template={{
                    id: "preview", name: form.name, type: form.type, paperSize: form.paperSize,
                    orientation: form.orientation, showLogo: form.showLogo, logoUrl: form.logoUrl,
                    logoPosition: form.logoPosition, showQR: form.showQR,
                    headerText: form.headerText, footerText: form.footerText,
                    fields: form.fields, fontSize: form.fontSize, borderStyle: form.borderStyle,
                    isDefault: false, createdAt: "",
                  }}
                  form={form}
                />
              </ScrollArea>
            )}
          </div>

          <DialogFooter className="px-6 py-3 border-t">
            <Button variant="outline" size="sm" className="mr-auto gap-1.5" onClick={() => setShowEditPreview(p => !p)}>
              <Eye className="h-3.5 w-3.5" />{showEditPreview ? "Hide Preview" : "Live Preview"}
            </Button>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} className="gap-1.5">
              {editingTemplate ? <><Check className="h-4 w-4" />Update Template</> : <><Plus className="h-4 w-4" />Create Template</>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ──── Preview Dialog — Traditional Indian Receipt Style ──── */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="sm:max-w-[620px] bg-background max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" />Receipt Preview
            </DialogTitle>
            <DialogDescription>{previewTemplate?.name} — {paperSizeLabels[previewTemplate?.paperSize || "A5"]}</DialogDescription>
          </DialogHeader>
          {previewTemplate && <ReceiptPreviewContent template={previewTemplate} form={null} />}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReceiptTemplates;
