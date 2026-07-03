import React, { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Save, Eye, Download, Undo2, Redo2, Type, Image, Minus, Square,
  GripVertical, Bold, Italic, AlignLeft, AlignCenter, AlignRight,
  Trash2, Copy, Move, ChevronLeft, Palette, MousePointerClick,
  ZoomIn, ZoomOut, Layers, Lock, Unlock, LayoutTemplate, FileText, Sparkles
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// ─── Types ───────────────────────────────────────────────────────────────────

interface CanvasElement {
  id: string;
  type: "text" | "image" | "divider" | "box" | "dynamic-field";
  x: number;
  y: number;
  width: number;
  height: number;
  content: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: "normal" | "bold";
  fontStyle?: "normal" | "italic";
  textAlign?: "left" | "center" | "right";
  color?: string;
  fieldKey?: string;
  showLabel?: boolean;
  fieldFormat?: string;
  opacity?: number;
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
  locked?: boolean;
  zIndex?: number;
}

interface AlignGuide {
  type: "vertical" | "horizontal";
  position: number;
}

const SAMPLE_DATA: Record<string, string> = {
  donor_name: "Ravi Kumar",
  amount: "₹500",
  seva_name: "Abhishekam",
  date: "12 Mar 2026",
  receipt_no: "REC-2026-0891",
  phone: "+91 98765 43210",
  address: "12, Temple Street, Chennai",
  pan: "ABCDE1234F",
  payment_mode: "UPI",
  gothram: "Bharadwaja",
};

const DYNAMIC_FIELDS = [
  { key: "donor_name", label: "Donor Name", icon: "👤" },
  { key: "amount", label: "Amount", icon: "💰" },
  { key: "seva_name", label: "Seva Name", icon: "🙏" },
  { key: "date", label: "Date", icon: "📅" },
  { key: "receipt_no", label: "Receipt Number", icon: "#️⃣" },
  { key: "phone", label: "Phone", icon: "📱" },
  { key: "address", label: "Address", icon: "📍" },
  { key: "pan", label: "PAN", icon: "🆔" },
  { key: "payment_mode", label: "Payment Mode", icon: "💳" },
  { key: "gothram", label: "Gothram", icon: "📿" },
];

const FONT_FAMILIES = ["Inter", "Georgia", "Times New Roman", "Arial", "Courier New", "Verdana"];

const CANVAS_W = 420;
const CANVAS_H = 595;
const SNAP_THRESHOLD = 6;
const GRID_SIZE = 5;

let _idCounter = 0;
const uid = () => `el-${++_idCounter}-${Date.now()}`;

// ─── Starter Templates ──────────────────────────────────────────────────────

interface StarterTemplate {
  id: string;
  name: string;
  description: string;
  category: "Seva" | "Donation";
  elements: Omit<CanvasElement, "id">[];
}

const STARTER_TEMPLATES: StarterTemplate[] = [
  {
    id: "starter-seva-classic",
    name: "Classic Seva Receipt",
    description: "Traditional seva receipt with temple header, devotee info, and blessing footer",
    category: "Seva",
    elements: [
      { type: "box", x: 10, y: 10, width: 400, height: 575, content: "", borderColor: "#c9a84c", borderWidth: 2, borderRadius: 0, backgroundColor: "transparent", opacity: 1, zIndex: 0 },
      { type: "box", x: 15, y: 15, width: 390, height: 565, content: "", borderColor: "#c9a84c", borderWidth: 1, borderRadius: 0, backgroundColor: "transparent", opacity: 0.6, zIndex: 1 },
      { type: "text", x: 60, y: 30, width: 300, height: 30, content: "🙏 || Sri Venkateswara Temple || 🙏", fontSize: 16, fontFamily: "Georgia", fontWeight: "bold", fontStyle: "normal", textAlign: "center", color: "#8B1A1A", opacity: 1, zIndex: 2 },
      { type: "text", x: 80, y: 62, width: 260, height: 22, content: "Tirumala, Chittoor District, Andhra Pradesh", fontSize: 10, fontFamily: "Georgia", fontWeight: "normal", fontStyle: "italic", textAlign: "center", color: "#555555", opacity: 1, zIndex: 2 },
      { type: "text", x: 100, y: 84, width: 220, height: 22, content: "📞 +91 877 223 1234  |  ✉ info@tirumala.org", fontSize: 9, fontFamily: "Inter", fontWeight: "normal", fontStyle: "normal", textAlign: "center", color: "#777777", opacity: 1, zIndex: 2 },
      { type: "divider", x: 30, y: 112, width: 360, height: 2, content: "", backgroundColor: "#c9a84c", opacity: 0.7, zIndex: 2 },
      { type: "text", x: 140, y: 120, width: 140, height: 28, content: "SEVA RECEIPT", fontSize: 14, fontFamily: "Georgia", fontWeight: "bold", fontStyle: "normal", textAlign: "center", color: "#8B1A1A", opacity: 1, zIndex: 2 },
      { type: "divider", x: 30, y: 150, width: 360, height: 2, content: "", backgroundColor: "#c9a84c", opacity: 0.7, zIndex: 2 },
      { type: "dynamic-field", x: 30, y: 170, width: 180, height: 28, content: "receipt_no", fontSize: 12, fontFamily: "Inter", fontWeight: "normal", fontStyle: "normal", textAlign: "left", color: "#1a1a1a", fieldKey: "receipt_no", showLabel: true, fieldFormat: "default", opacity: 1, zIndex: 3 },
      { type: "dynamic-field", x: 220, y: 170, width: 170, height: 28, content: "date", fontSize: 12, fontFamily: "Inter", fontWeight: "normal", fontStyle: "normal", textAlign: "right", color: "#1a1a1a", fieldKey: "date", showLabel: true, fieldFormat: "date-long", opacity: 1, zIndex: 3 },
      { type: "divider", x: 30, y: 205, width: 360, height: 1, content: "", backgroundColor: "#e0e0e0", opacity: 0.5, zIndex: 2 },
      { type: "dynamic-field", x: 30, y: 220, width: 360, height: 28, content: "donor_name", fontSize: 13, fontFamily: "Inter", fontWeight: "bold", fontStyle: "normal", textAlign: "left", color: "#1a1a1a", fieldKey: "donor_name", showLabel: true, fieldFormat: "default", opacity: 1, zIndex: 3 },
      { type: "dynamic-field", x: 30, y: 255, width: 180, height: 28, content: "gothram", fontSize: 12, fontFamily: "Inter", fontWeight: "normal", fontStyle: "normal", textAlign: "left", color: "#1a1a1a", fieldKey: "gothram", showLabel: true, fieldFormat: "default", opacity: 1, zIndex: 3 },
      { type: "dynamic-field", x: 220, y: 255, width: 170, height: 28, content: "phone", fontSize: 12, fontFamily: "Inter", fontWeight: "normal", fontStyle: "normal", textAlign: "left", color: "#1a1a1a", fieldKey: "phone", showLabel: true, fieldFormat: "default", opacity: 1, zIndex: 3 },
      { type: "box", x: 30, y: 300, width: 360, height: 80, content: "", backgroundColor: "#FFF8F0", borderColor: "#c9a84c", borderWidth: 1, borderRadius: 6, opacity: 1, zIndex: 2 },
      { type: "dynamic-field", x: 45, y: 310, width: 330, height: 28, content: "seva_name", fontSize: 14, fontFamily: "Georgia", fontWeight: "bold", fontStyle: "normal", textAlign: "left", color: "#8B1A1A", fieldKey: "seva_name", showLabel: true, fieldFormat: "default", opacity: 1, zIndex: 4 },
      { type: "dynamic-field", x: 45, y: 345, width: 330, height: 28, content: "amount", fontSize: 18, fontFamily: "Inter", fontWeight: "bold", fontStyle: "normal", textAlign: "left", color: "#2d6a2e", fieldKey: "amount", showLabel: true, fieldFormat: "currency", opacity: 1, zIndex: 4 },
      { type: "dynamic-field", x: 30, y: 400, width: 360, height: 28, content: "payment_mode", fontSize: 12, fontFamily: "Inter", fontWeight: "normal", fontStyle: "normal", textAlign: "left", color: "#555555", fieldKey: "payment_mode", showLabel: true, fieldFormat: "default", opacity: 1, zIndex: 3 },
      { type: "divider", x: 30, y: 445, width: 360, height: 1, content: "", backgroundColor: "#e0e0e0", opacity: 0.5, zIndex: 2 },
      { type: "text", x: 30, y: 460, width: 170, height: 50, content: "____________________\nDevotee Signature", fontSize: 9, fontFamily: "Inter", fontWeight: "normal", fontStyle: "normal", textAlign: "center", color: "#999999", opacity: 1, zIndex: 2 },
      { type: "text", x: 220, y: 460, width: 170, height: 50, content: "____________________\nTemple Authority", fontSize: 9, fontFamily: "Inter", fontWeight: "normal", fontStyle: "normal", textAlign: "center", color: "#999999", opacity: 1, zIndex: 2 },
      { type: "divider", x: 30, y: 530, width: 360, height: 2, content: "", backgroundColor: "#c9a84c", opacity: 0.7, zIndex: 2 },
      { type: "text", x: 40, y: 540, width: 340, height: 22, content: "🙏 Thank you for your devotion. May God bless you and your family. 🙏", fontSize: 9, fontFamily: "Georgia", fontWeight: "normal", fontStyle: "italic", textAlign: "center", color: "#8B1A1A", opacity: 0.8, zIndex: 2 },
      { type: "text", x: 100, y: 558, width: 220, height: 18, content: "This is a computer-generated receipt", fontSize: 8, fontFamily: "Inter", fontWeight: "normal", fontStyle: "normal", textAlign: "center", color: "#aaaaaa", opacity: 1, zIndex: 2 },
    ],
  },
  {
    id: "starter-donation-formal",
    name: "Formal Donation Receipt",
    description: "Professional donation receipt with 80G tax exemption note and official formatting",
    category: "Donation",
    elements: [
      { type: "box", x: 10, y: 10, width: 400, height: 575, content: "", borderColor: "#1a3a5c", borderWidth: 2, borderRadius: 0, backgroundColor: "transparent", opacity: 1, zIndex: 0 },
      { type: "text", x: 60, y: 25, width: 300, height: 30, content: "SRI VENKATESWARA TEMPLE TRUST", fontSize: 17, fontFamily: "Georgia", fontWeight: "bold", fontStyle: "normal", textAlign: "center", color: "#1a3a5c", opacity: 1, zIndex: 2 },
      { type: "text", x: 80, y: 55, width: 260, height: 20, content: "(Registered under the Charitable Endowments Act)", fontSize: 9, fontFamily: "Inter", fontWeight: "normal", fontStyle: "normal", textAlign: "center", color: "#666666", opacity: 1, zIndex: 2 },
      { type: "text", x: 80, y: 72, width: 260, height: 20, content: "Tirumala, Chittoor District, A.P. | PAN: AACTS1234Q", fontSize: 9, fontFamily: "Inter", fontWeight: "normal", fontStyle: "normal", textAlign: "center", color: "#666666", opacity: 1, zIndex: 2 },
      { type: "divider", x: 20, y: 98, width: 380, height: 3, content: "", backgroundColor: "#1a3a5c", opacity: 1, zIndex: 2 },
      { type: "text", x: 140, y: 108, width: 140, height: 28, content: "DONATION RECEIPT", fontSize: 14, fontFamily: "Georgia", fontWeight: "bold", fontStyle: "normal", textAlign: "center", color: "#1a3a5c", opacity: 1, zIndex: 2 },
      { type: "divider", x: 20, y: 138, width: 380, height: 1, content: "", backgroundColor: "#1a3a5c", opacity: 0.4, zIndex: 2 },
      { type: "dynamic-field", x: 30, y: 155, width: 170, height: 26, content: "receipt_no", fontSize: 11, fontFamily: "Inter", fontWeight: "bold", fontStyle: "normal", textAlign: "left", color: "#1a1a1a", fieldKey: "receipt_no", showLabel: true, fieldFormat: "default", opacity: 1, zIndex: 3 },
      { type: "dynamic-field", x: 230, y: 155, width: 160, height: 26, content: "date", fontSize: 11, fontFamily: "Inter", fontWeight: "normal", fontStyle: "normal", textAlign: "right", color: "#1a1a1a", fieldKey: "date", showLabel: true, fieldFormat: "date-long", opacity: 1, zIndex: 3 },
      { type: "text", x: 30, y: 195, width: 100, height: 20, content: "DONOR DETAILS", fontSize: 10, fontFamily: "Inter", fontWeight: "bold", fontStyle: "normal", textAlign: "left", color: "#1a3a5c", opacity: 1, zIndex: 2 },
      { type: "divider", x: 30, y: 215, width: 360, height: 1, content: "", backgroundColor: "#d0d0d0", opacity: 1, zIndex: 2 },
      { type: "dynamic-field", x: 30, y: 225, width: 360, height: 26, content: "donor_name", fontSize: 13, fontFamily: "Inter", fontWeight: "bold", fontStyle: "normal", textAlign: "left", color: "#1a1a1a", fieldKey: "donor_name", showLabel: true, fieldFormat: "uppercase", opacity: 1, zIndex: 3 },
      { type: "dynamic-field", x: 30, y: 255, width: 360, height: 26, content: "address", fontSize: 11, fontFamily: "Inter", fontWeight: "normal", fontStyle: "normal", textAlign: "left", color: "#333333", fieldKey: "address", showLabel: true, fieldFormat: "default", opacity: 1, zIndex: 3 },
      { type: "dynamic-field", x: 30, y: 285, width: 180, height: 26, content: "phone", fontSize: 11, fontFamily: "Inter", fontWeight: "normal", fontStyle: "normal", textAlign: "left", color: "#333333", fieldKey: "phone", showLabel: true, fieldFormat: "default", opacity: 1, zIndex: 3 },
      { type: "dynamic-field", x: 220, y: 285, width: 170, height: 26, content: "pan", fontSize: 11, fontFamily: "Inter", fontWeight: "normal", fontStyle: "normal", textAlign: "left", color: "#333333", fieldKey: "pan", showLabel: true, fieldFormat: "default", opacity: 1, zIndex: 3 },
      { type: "text", x: 30, y: 325, width: 130, height: 20, content: "DONATION DETAILS", fontSize: 10, fontFamily: "Inter", fontWeight: "bold", fontStyle: "normal", textAlign: "left", color: "#1a3a5c", opacity: 1, zIndex: 2 },
      { type: "divider", x: 30, y: 345, width: 360, height: 1, content: "", backgroundColor: "#d0d0d0", opacity: 1, zIndex: 2 },
      { type: "box", x: 30, y: 355, width: 360, height: 70, content: "", backgroundColor: "#f0f4f8", borderColor: "#1a3a5c", borderWidth: 1, borderRadius: 4, opacity: 1, zIndex: 2 },
      { type: "dynamic-field", x: 45, y: 365, width: 200, height: 26, content: "seva_name", fontSize: 12, fontFamily: "Inter", fontWeight: "bold", fontStyle: "normal", textAlign: "left", color: "#1a3a5c", fieldKey: "seva_name", showLabel: true, fieldFormat: "default", opacity: 1, zIndex: 4 },
      { type: "dynamic-field", x: 45, y: 393, width: 200, height: 26, content: "amount", fontSize: 18, fontFamily: "Inter", fontWeight: "bold", fontStyle: "normal", textAlign: "left", color: "#1a6b30", fieldKey: "amount", showLabel: true, fieldFormat: "currency", opacity: 1, zIndex: 4 },
      { type: "dynamic-field", x: 255, y: 393, width: 120, height: 26, content: "payment_mode", fontSize: 11, fontFamily: "Inter", fontWeight: "normal", fontStyle: "normal", textAlign: "right", color: "#555555", fieldKey: "payment_mode", showLabel: true, fieldFormat: "default", opacity: 1, zIndex: 4 },
      { type: "box", x: 30, y: 440, width: 360, height: 45, content: "", backgroundColor: "#FFFDE7", borderColor: "#c9a84c", borderWidth: 1, borderRadius: 4, opacity: 1, zIndex: 2 },
      { type: "text", x: 40, y: 447, width: 340, height: 30, content: "✅ This donation is eligible for tax exemption under Section 80G\nof the Income Tax Act, 1961. 80G Reg. No: AACTS1234Q/80G/2024", fontSize: 8, fontFamily: "Inter", fontWeight: "normal", fontStyle: "normal", textAlign: "center", color: "#6d5b0e", opacity: 1, zIndex: 4 },
      { type: "divider", x: 30, y: 500, width: 360, height: 1, content: "", backgroundColor: "#e0e0e0", opacity: 0.5, zIndex: 2 },
      { type: "text", x: 30, y: 510, width: 170, height: 45, content: "____________________\nDonor Signature", fontSize: 9, fontFamily: "Inter", fontWeight: "normal", fontStyle: "normal", textAlign: "center", color: "#999999", opacity: 1, zIndex: 2 },
      { type: "text", x: 220, y: 510, width: 170, height: 45, content: "____________________\nAuthorized Signatory\n(For Sri Venkateswara Temple Trust)", fontSize: 8, fontFamily: "Inter", fontWeight: "normal", fontStyle: "normal", textAlign: "center", color: "#999999", opacity: 1, zIndex: 2 },
      { type: "text", x: 60, y: 565, width: 300, height: 15, content: "Thank you for your generous contribution. God bless you!", fontSize: 8, fontFamily: "Georgia", fontWeight: "normal", fontStyle: "italic", textAlign: "center", color: "#888888", opacity: 1, zIndex: 2 },
    ],
  },
  {
    id: "starter-seva-minimal",
    name: "Minimal Seva Receipt",
    description: "Clean, modern minimal design with essential fields only",
    category: "Seva",
    elements: [
      { type: "text", x: 110, y: 30, width: 200, height: 28, content: "Sri Venkateswara Temple", fontSize: 16, fontFamily: "Inter", fontWeight: "bold", fontStyle: "normal", textAlign: "center", color: "#1a1a1a", opacity: 1, zIndex: 2 },
      { type: "text", x: 130, y: 58, width: 160, height: 22, content: "Seva Receipt", fontSize: 12, fontFamily: "Inter", fontWeight: "normal", fontStyle: "normal", textAlign: "center", color: "#888888", opacity: 1, zIndex: 2 },
      { type: "divider", x: 40, y: 90, width: 340, height: 1, content: "", backgroundColor: "#e5e5e5", opacity: 1, zIndex: 2 },
      { type: "dynamic-field", x: 40, y: 110, width: 160, height: 26, content: "receipt_no", fontSize: 11, fontFamily: "Inter", fontWeight: "normal", fontStyle: "normal", textAlign: "left", color: "#666666", fieldKey: "receipt_no", showLabel: true, fieldFormat: "default", opacity: 1, zIndex: 3 },
      { type: "dynamic-field", x: 220, y: 110, width: 160, height: 26, content: "date", fontSize: 11, fontFamily: "Inter", fontWeight: "normal", fontStyle: "normal", textAlign: "right", color: "#666666", fieldKey: "date", showLabel: true, fieldFormat: "date-long", opacity: 1, zIndex: 3 },
      { type: "dynamic-field", x: 40, y: 155, width: 340, height: 30, content: "donor_name", fontSize: 15, fontFamily: "Inter", fontWeight: "bold", fontStyle: "normal", textAlign: "left", color: "#1a1a1a", fieldKey: "donor_name", showLabel: true, fieldFormat: "default", opacity: 1, zIndex: 3 },
      { type: "dynamic-field", x: 40, y: 195, width: 340, height: 26, content: "gothram", fontSize: 11, fontFamily: "Inter", fontWeight: "normal", fontStyle: "normal", textAlign: "left", color: "#555555", fieldKey: "gothram", showLabel: true, fieldFormat: "default", opacity: 1, zIndex: 3 },
      { type: "divider", x: 40, y: 235, width: 340, height: 1, content: "", backgroundColor: "#e5e5e5", opacity: 1, zIndex: 2 },
      { type: "dynamic-field", x: 40, y: 255, width: 340, height: 28, content: "seva_name", fontSize: 14, fontFamily: "Inter", fontWeight: "bold", fontStyle: "normal", textAlign: "left", color: "#1a1a1a", fieldKey: "seva_name", showLabel: true, fieldFormat: "default", opacity: 1, zIndex: 3 },
      { type: "dynamic-field", x: 40, y: 295, width: 340, height: 35, content: "amount", fontSize: 22, fontFamily: "Inter", fontWeight: "bold", fontStyle: "normal", textAlign: "left", color: "#16a34a", fieldKey: "amount", showLabel: false, fieldFormat: "currency", opacity: 1, zIndex: 3 },
      { type: "dynamic-field", x: 40, y: 340, width: 340, height: 26, content: "payment_mode", fontSize: 11, fontFamily: "Inter", fontWeight: "normal", fontStyle: "normal", textAlign: "left", color: "#888888", fieldKey: "payment_mode", showLabel: true, fieldFormat: "default", opacity: 1, zIndex: 3 },
      { type: "divider", x: 40, y: 385, width: 340, height: 1, content: "", backgroundColor: "#e5e5e5", opacity: 1, zIndex: 2 },
      { type: "text", x: 40, y: 400, width: 340, height: 20, content: "Thank you for your devotion 🙏", fontSize: 11, fontFamily: "Inter", fontWeight: "normal", fontStyle: "normal", textAlign: "center", color: "#aaaaaa", opacity: 1, zIndex: 2 },
    ],
  },
  {
    id: "starter-thermal",
    name: "Thermal Printer Receipt",
    description: "Compact receipt optimized for 3-inch thermal printers",
    category: "Seva",
    elements: [
      { type: "text", x: 30, y: 15, width: 360, height: 25, content: "SRI VENKATESWARA TEMPLE", fontSize: 14, fontFamily: "Courier New", fontWeight: "bold", fontStyle: "normal", textAlign: "center", color: "#000000", opacity: 1, zIndex: 2 },
      { type: "text", x: 30, y: 38, width: 360, height: 18, content: "Tirumala, A.P.", fontSize: 10, fontFamily: "Courier New", fontWeight: "normal", fontStyle: "normal", textAlign: "center", color: "#333333", opacity: 1, zIndex: 2 },
      { type: "text", x: 30, y: 56, width: 360, height: 14, content: "================================", fontSize: 10, fontFamily: "Courier New", fontWeight: "normal", fontStyle: "normal", textAlign: "center", color: "#000000", opacity: 1, zIndex: 2 },
      { type: "text", x: 130, y: 72, width: 160, height: 20, content: "SEVA RECEIPT", fontSize: 11, fontFamily: "Courier New", fontWeight: "bold", fontStyle: "normal", textAlign: "center", color: "#000000", opacity: 1, zIndex: 2 },
      { type: "text", x: 30, y: 92, width: 360, height: 14, content: "--------------------------------", fontSize: 10, fontFamily: "Courier New", fontWeight: "normal", fontStyle: "normal", textAlign: "center", color: "#000000", opacity: 1, zIndex: 2 },
      { type: "dynamic-field", x: 30, y: 110, width: 180, height: 22, content: "receipt_no", fontSize: 10, fontFamily: "Courier New", fontWeight: "normal", fontStyle: "normal", textAlign: "left", color: "#000000", fieldKey: "receipt_no", showLabel: true, fieldFormat: "default", opacity: 1, zIndex: 3 },
      { type: "dynamic-field", x: 220, y: 110, width: 170, height: 22, content: "date", fontSize: 10, fontFamily: "Courier New", fontWeight: "normal", fontStyle: "normal", textAlign: "right", color: "#000000", fieldKey: "date", showLabel: true, fieldFormat: "date-short", opacity: 1, zIndex: 3 },
      { type: "dynamic-field", x: 30, y: 140, width: 360, height: 22, content: "donor_name", fontSize: 11, fontFamily: "Courier New", fontWeight: "bold", fontStyle: "normal", textAlign: "left", color: "#000000", fieldKey: "donor_name", showLabel: true, fieldFormat: "default", opacity: 1, zIndex: 3 },
      { type: "dynamic-field", x: 30, y: 168, width: 360, height: 22, content: "seva_name", fontSize: 11, fontFamily: "Courier New", fontWeight: "normal", fontStyle: "normal", textAlign: "left", color: "#000000", fieldKey: "seva_name", showLabel: true, fieldFormat: "default", opacity: 1, zIndex: 3 },
      { type: "text", x: 30, y: 196, width: 360, height: 14, content: "--------------------------------", fontSize: 10, fontFamily: "Courier New", fontWeight: "normal", fontStyle: "normal", textAlign: "center", color: "#000000", opacity: 1, zIndex: 2 },
      { type: "dynamic-field", x: 30, y: 215, width: 360, height: 28, content: "amount", fontSize: 16, fontFamily: "Courier New", fontWeight: "bold", fontStyle: "normal", textAlign: "center", color: "#000000", fieldKey: "amount", showLabel: true, fieldFormat: "currency", opacity: 1, zIndex: 3 },
      { type: "dynamic-field", x: 30, y: 250, width: 360, height: 22, content: "payment_mode", fontSize: 10, fontFamily: "Courier New", fontWeight: "normal", fontStyle: "normal", textAlign: "center", color: "#000000", fieldKey: "payment_mode", showLabel: true, fieldFormat: "default", opacity: 1, zIndex: 3 },
      { type: "text", x: 30, y: 278, width: 360, height: 14, content: "================================", fontSize: 10, fontFamily: "Courier New", fontWeight: "normal", fontStyle: "normal", textAlign: "center", color: "#000000", opacity: 1, zIndex: 2 },
      { type: "text", x: 30, y: 295, width: 360, height: 18, content: "Thank you for your devotion!", fontSize: 9, fontFamily: "Courier New", fontWeight: "normal", fontStyle: "normal", textAlign: "center", color: "#333333", opacity: 1, zIndex: 2 },
    ],
  },
];

// ─── Component ───────────────────────────────────────────────────────────────

const ReceiptTemplateBuilder: React.FC = () => {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLDivElement>(null);
  const canvasWrapRef = useRef<HTMLDivElement>(null);

  const [templateName, setTemplateName] = useState("Untitled Receipt Template");
  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isPreview, setIsPreview] = useState(false);
  const [history, setHistory] = useState<CanvasElement[][]>([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [guides, setGuides] = useState<AlignGuide[]>([]);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [dropIndicator, setDropIndicator] = useState<{ x: number; y: number } | null>(null);
  const [dragGhost, setDragGhost] = useState<{ type: string; label: string; x: number; y: number } | null>(null);
  const [activeDrag, setActiveDrag] = useState(false);
  const [showTemplateGallery, setShowTemplateGallery] = useState(false);

  const selected = elements.find((e) => e.id === selectedId) || null;

  // ── Load starter template ──────────────────────────────────────────────────
  const loadStarterTemplate = (template: StarterTemplate) => {
    const newElements: CanvasElement[] = template.elements.map((el) => ({
      ...el,
      id: uid(),
    }));
    setTemplateName(template.name);
    pushHistory(newElements);
    setShowTemplateGallery(false);
    setSelectedId(null);
    toast.success(`"${template.name}" loaded — customize it to your needs!`);
  };

  // ── History ──────────────────────────────────────────────────────────────

  const pushHistory = useCallback(
    (next: CanvasElement[]) => {
      setHistory((h) => [...h.slice(0, historyIndex + 1), next]);
      setHistoryIndex((i) => i + 1);
      setElements(next);
    },
    [historyIndex]
  );

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex((i) => i - 1);
      setElements(history[historyIndex - 1]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex((i) => i + 1);
      setElements(history[historyIndex + 1]);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "z") {
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
      }
      if (e.key === "Delete" || e.key === "Backspace") {
        if (selectedId && document.activeElement?.tagName !== "INPUT") {
          e.preventDefault();
          deleteElement(selectedId);
        }
      }
      if (e.key === "Escape") setSelectedId(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  // ── Element defaults ──────────────────────────────────────────────────────

  const getDefaults = (type: string, fieldKey?: string): Partial<CanvasElement> => {
    const map: Record<string, Partial<CanvasElement>> = {
      text: { width: 200, height: 32, content: "Your Text Here", fontSize: 14, fontFamily: "Inter", fontWeight: "normal", fontStyle: "normal", textAlign: "left", color: "#1a1a1a" },
      image: { width: 120, height: 60, content: "Logo" },
      divider: { width: 340, height: 2, content: "", backgroundColor: "#d4d4d8" },
      box: { width: 200, height: 100, content: "", backgroundColor: "transparent", borderColor: "#d4d4d8", borderWidth: 1, borderRadius: 4 },
      "dynamic-field": { width: 220, height: 30, content: fieldKey || "", fontSize: 13, fontFamily: "Inter", fontWeight: "normal", fontStyle: "normal", textAlign: "left", color: "#1a1a1a", showLabel: true, fieldKey, fieldFormat: "default" },
    };
    return map[type] || {};
  };

  // ── Add element ───────────────────────────────────────────────────────────

  const addElementAt = (type: CanvasElement["type"], x: number, y: number, fieldKey?: string) => {
    const defaults = getDefaults(type, fieldKey);
    const maxZ = elements.reduce((m, e) => Math.max(m, e.zIndex || 0), 0);
    const el: CanvasElement = {
      id: uid(), type, x, y,
      width: 200, height: 30, content: "", opacity: 1,
      zIndex: maxZ + 1, locked: false,
      ...defaults,
    };
    pushHistory([...elements, el]);
    setSelectedId(el.id);
  };

  const addElement = (type: CanvasElement["type"], fieldKey?: string) => {
    const centerX = CANVAS_W / 2 - 100;
    const usedY = elements.length ? Math.max(...elements.map((e) => e.y + e.height)) + 15 : 40;
    addElementAt(type, centerX, Math.min(usedY, CANVAS_H - 50), fieldKey);
  };

  const updateElement = (id: string, patch: Partial<CanvasElement>) => {
    const next = elements.map((e) => (e.id === id ? { ...e, ...patch } : e));
    pushHistory(next);
  };

  const deleteElement = (id: string) => {
    pushHistory(elements.filter((e) => e.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const duplicateElement = () => {
    if (!selected) return;
    const maxZ = elements.reduce((m, e) => Math.max(m, e.zIndex || 0), 0);
    const dup: CanvasElement = { ...selected, id: uid(), x: selected.x + 15, y: selected.y + 15, zIndex: maxZ + 1 };
    pushHistory([...elements, dup]);
    setSelectedId(dup.id);
  };

  // ── Alignment guides ──────────────────────────────────────────────────────

  const computeGuides = (dragId: string, nx: number, ny: number, nw: number, nh: number): { guides: AlignGuide[]; snapX: number; snapY: number } => {
    const result: AlignGuide[] = [];
    let snapX = nx, snapY = ny;
    const others = elements.filter((e) => e.id !== dragId);

    // Canvas center guides
    const cx = CANVAS_W / 2;
    const cy = CANVAS_H / 2;
    if (Math.abs(nx + nw / 2 - cx) < SNAP_THRESHOLD) { snapX = cx - nw / 2; result.push({ type: "vertical", position: cx }); }
    if (Math.abs(ny + nh / 2 - cy) < SNAP_THRESHOLD) { snapY = cy - nh / 2; result.push({ type: "horizontal", position: cy }); }

    for (const o of others) {
      const edges = [
        { val: o.x, myVal: nx, type: "vertical" as const },
        { val: o.x + o.width, myVal: nx, type: "vertical" as const },
        { val: o.x, myVal: nx + nw, type: "vertical" as const },
        { val: o.x + o.width, myVal: nx + nw, type: "vertical" as const },
        { val: o.x + o.width / 2, myVal: nx + nw / 2, type: "vertical" as const },
        { val: o.y, myVal: ny, type: "horizontal" as const },
        { val: o.y + o.height, myVal: ny, type: "horizontal" as const },
        { val: o.y, myVal: ny + nh, type: "horizontal" as const },
        { val: o.y + o.height, myVal: ny + nh, type: "horizontal" as const },
        { val: o.y + o.height / 2, myVal: ny + nh / 2, type: "horizontal" as const },
      ];
      for (const edge of edges) {
        if (Math.abs(edge.val - edge.myVal) < SNAP_THRESHOLD) {
          if (edge.type === "vertical") snapX = nx + (edge.val - edge.myVal);
          else snapY = ny + (edge.val - edge.myVal);
          result.push({ type: edge.type, position: edge.val });
        }
      }
    }
    return { guides: result, snapX, snapY };
  };

  // ── Canvas drag (move elements) ───────────────────────────────────────────

  const dragState = useRef<{ id: string; startX: number; startY: number; elX: number; elY: number } | null>(null);
  const resizeState = useRef<{ id: string; startX: number; startY: number; startW: number; startH: number; startElX: number; startElY: number; handle: string } | null>(null);

  const onCanvasMouseDown = (e: React.MouseEvent, id: string) => {
    if (isPreview) return;
    const el = elements.find((x) => x.id === id);
    if (!el || el.locked) return;
    e.stopPropagation();
    e.preventDefault();
    setSelectedId(id);
    setActiveDrag(true);
    dragState.current = { id, startX: e.clientX, startY: e.clientY, elX: el.x, elY: el.y };

    const onMove = (ev: MouseEvent) => {
      if (!dragState.current) return;
      const scale = zoom;
      const dx = (ev.clientX - dragState.current.startX) / scale;
      const dy = (ev.clientY - dragState.current.startY) / scale;
      let newX = Math.round((dragState.current.elX + dx) / GRID_SIZE) * GRID_SIZE;
      let newY = Math.round((dragState.current.elY + dy) / GRID_SIZE) * GRID_SIZE;

      const currentEl = elements.find((x) => x.id === id)!;
      const { guides: g, snapX, snapY } = computeGuides(id, newX, newY, currentEl.width, currentEl.height);
      newX = snapX;
      newY = snapY;
      setGuides(g);

      setElements((prev) => prev.map((el) => (el.id === id ? { ...el, x: Math.max(0, Math.min(newX, CANVAS_W - el.width)), y: Math.max(0, Math.min(newY, CANVAS_H - el.height)) } : el)));
    };
    const onUp = () => {
      setActiveDrag(false);
      setGuides([]);
      if (dragState.current) {
        setElements((prev) => {
          pushHistory(prev);
          return prev;
        });
      }
      dragState.current = null;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  const onResizeMouseDown = (e: React.MouseEvent, id: string, handle: string) => {
    if (isPreview) return;
    const el = elements.find((x) => x.id === id);
    if (!el || el.locked) return;
    e.stopPropagation();
    e.preventDefault();
    resizeState.current = { id, startX: e.clientX, startY: e.clientY, startW: el.width, startH: el.height, startElX: el.x, startElY: el.y, handle };

    const onMove = (ev: MouseEvent) => {
      if (!resizeState.current) return;
      const rs = resizeState.current;
      const scale = zoom;
      const dx = (ev.clientX - rs.startX) / scale;
      const dy = (ev.clientY - rs.startY) / scale;

      let newW = rs.startW, newH = rs.startH, newX = rs.startElX, newY = rs.startElY;

      if (handle.includes("e")) newW = Math.max(20, Math.round((rs.startW + dx) / GRID_SIZE) * GRID_SIZE);
      if (handle.includes("s")) newH = Math.max(10, Math.round((rs.startH + dy) / GRID_SIZE) * GRID_SIZE);
      if (handle.includes("w")) {
        const dw = Math.round(dx / GRID_SIZE) * GRID_SIZE;
        newW = Math.max(20, rs.startW - dw);
        newX = rs.startElX + (rs.startW - newW);
      }
      if (handle.includes("n")) {
        const dh = Math.round(dy / GRID_SIZE) * GRID_SIZE;
        newH = Math.max(10, rs.startH - dh);
        newY = rs.startElY + (rs.startH - newH);
      }

      setElements((prev) => prev.map((el) => (el.id === id ? { ...el, width: newW, height: newH, x: newX, y: newY } : el)));
    };
    const onUp = () => {
      resizeState.current = null;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  // ── Drag from panel to canvas ─────────────────────────────────────────────

  const handleDragStart = (e: React.DragEvent, type: string, label: string, fieldKey?: string) => {
    e.dataTransfer.setData("element-type", type);
    e.dataTransfer.setData("field-key", fieldKey || "");
    e.dataTransfer.effectAllowed = "copy";

    // Create a custom drag image
    const ghost = document.createElement("div");
    ghost.style.cssText = `
      padding: 8px 16px; background: hsl(var(--primary)); color: white;
      border-radius: 8px; font-size: 13px; font-weight: 500;
      box-shadow: 0 8px 32px rgba(0,0,0,0.2); position: absolute; top: -1000px;
      display: flex; align-items: center; gap: 6px;
    `;
    ghost.textContent = `+ ${label}`;
    document.body.appendChild(ghost);
    e.dataTransfer.setDragImage(ghost, 40, 20);
    setTimeout(() => document.body.removeChild(ghost), 0);
  };

  const handleCanvasDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
    setIsDraggingOver(true);

    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = Math.round(((e.clientX - rect.left) / zoom) / GRID_SIZE) * GRID_SIZE;
      const y = Math.round(((e.clientY - rect.top) / zoom) / GRID_SIZE) * GRID_SIZE;
      setDropIndicator({ x: Math.max(0, Math.min(x, CANVAS_W - 40)), y: Math.max(0, Math.min(y, CANVAS_H - 20)) });
    }
  };

  const handleCanvasDragLeave = () => {
    setIsDraggingOver(false);
    setDropIndicator(null);
  };

  const handleCanvasDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    setDropIndicator(null);

    const type = e.dataTransfer.getData("element-type");
    const fieldKey = e.dataTransfer.getData("field-key");
    if (!type || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const defaults = getDefaults(type, fieldKey || undefined);
    const w = defaults.width || 200;
    const h = defaults.height || 30;
    const x = Math.round(((e.clientX - rect.left) / zoom - w / 2) / GRID_SIZE) * GRID_SIZE;
    const y = Math.round(((e.clientY - rect.top) / zoom - h / 2) / GRID_SIZE) * GRID_SIZE;
    addElementAt(type as CanvasElement["type"], Math.max(0, x), Math.max(0, y), fieldKey || undefined);
  };

  // ── Render element ─────────────────────────────────────────────────────────

  const renderElement = (el: CanvasElement) => {
    const isSelected = selectedId === el.id && !isPreview;
    const isLocked = el.locked;

    const baseStyle: React.CSSProperties = {
      position: "absolute",
      left: el.x,
      top: el.y,
      width: el.width,
      height: el.height,
      opacity: el.opacity ?? 1,
      cursor: isPreview ? "default" : isLocked ? "not-allowed" : "move",
      zIndex: el.zIndex || 0,
      transition: activeDrag && dragState.current?.id === el.id ? "none" : "box-shadow 0.15s ease",
    };

    let inner: React.ReactNode = null;

    switch (el.type) {
      case "text":
        inner = (
          <div style={{ fontSize: el.fontSize, fontFamily: el.fontFamily, fontWeight: el.fontWeight, fontStyle: el.fontStyle, textAlign: el.textAlign as any, color: el.color, width: "100%", height: "100%", lineHeight: 1.5, overflow: "hidden", display: "flex", alignItems: "center" }}>
            {el.content}
          </div>
        );
        break;
      case "dynamic-field": {
        const fieldDef = DYNAMIC_FIELDS.find((f) => f.key === el.fieldKey);
        const displayValue = isPreview ? SAMPLE_DATA[el.fieldKey || ""] || `{${el.fieldKey}}` : `{${fieldDef?.label || el.fieldKey}}`;
        inner = (
          <div style={{ fontSize: el.fontSize, fontFamily: el.fontFamily, fontWeight: el.fontWeight, fontStyle: el.fontStyle, textAlign: el.textAlign as any, color: el.color, width: "100%", height: "100%", lineHeight: 1.5, overflow: "hidden", display: "flex", alignItems: "center", gap: 6 }}>
            {!isPreview ? (
              <span className="inline-flex items-center gap-1 bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-md text-xs font-medium" style={{ fontSize: el.fontSize ? el.fontSize - 1 : 12 }}>
                <span>{fieldDef?.icon}</span> {displayValue}
              </span>
            ) : (
              <>
                {el.showLabel && <span style={{ color: "#888", fontSize: (el.fontSize || 13) - 1 }}>{fieldDef?.label}: </span>}
                <span>{displayValue}</span>
              </>
            )}
          </div>
        );
        break;
      }
      case "image":
        inner = (
          <div className="w-full h-full border-2 border-dashed border-muted-foreground/20 rounded-lg flex flex-col items-center justify-center bg-muted/20 text-muted-foreground gap-1">
            <Image className="h-5 w-5 opacity-40" />
            <span className="text-[10px] font-medium opacity-60">Drop Logo Here</span>
          </div>
        );
        break;
      case "divider":
        inner = (
          <div className="w-full h-full flex items-center">
            <div className="w-full" style={{ height: Math.max(1, el.height), backgroundColor: el.backgroundColor || "#d4d4d8" }} />
          </div>
        );
        break;
      case "box":
        inner = (
          <div className="w-full h-full" style={{ backgroundColor: el.backgroundColor || "transparent", border: `${el.borderWidth || 1}px solid ${el.borderColor || "#d4d4d8"}`, borderRadius: el.borderRadius || 0 }} />
        );
        break;
    }

    const resizeHandles = ["nw", "ne", "sw", "se", "n", "s", "e", "w"];
    const handlePositions: Record<string, React.CSSProperties> = {
      nw: { top: -4, left: -4, cursor: "nw-resize" },
      ne: { top: -4, right: -4, cursor: "ne-resize" },
      sw: { bottom: -4, left: -4, cursor: "sw-resize" },
      se: { bottom: -4, right: -4, cursor: "se-resize" },
      n: { top: -4, left: "50%", transform: "translateX(-50%)", cursor: "n-resize" },
      s: { bottom: -4, left: "50%", transform: "translateX(-50%)", cursor: "s-resize" },
      e: { top: "50%", right: -4, transform: "translateY(-50%)", cursor: "e-resize" },
      w: { top: "50%", left: -4, transform: "translateY(-50%)", cursor: "w-resize" },
    };

    return (
      <div
        key={el.id}
        style={baseStyle}
        onMouseDown={(e) => onCanvasMouseDown(e, el.id)}
        className={`group/el ${isSelected ? "" : "hover:outline hover:outline-1 hover:outline-primary/30"}`}
      >
        {/* Selection border */}
        {isSelected && (
          <div className="absolute -inset-[1px] border-2 border-primary rounded-[2px] pointer-events-none" style={{ zIndex: 999 }}>
            {/* Element type badge */}
            <div className="absolute -top-6 left-0 flex items-center gap-1">
              <span className="text-[9px] font-semibold bg-primary text-primary-foreground px-1.5 py-0.5 rounded-t-sm uppercase tracking-wider">
                {el.type === "dynamic-field" ? DYNAMIC_FIELDS.find(f => f.key === el.fieldKey)?.label || "Field" : el.type}
              </span>
            </div>
          </div>
        )}

        {inner}

        {/* Resize handles */}
        {isSelected && !isLocked && (
          <>
            {resizeHandles.map((h) => (
              <div
                key={h}
                className="absolute w-[9px] h-[9px] bg-primary border-2 border-background rounded-full shadow-sm hover:scale-125 transition-transform"
                style={{ ...handlePositions[h], zIndex: 1000 }}
                onMouseDown={(e) => onResizeMouseDown(e, el.id, h)}
              />
            ))}
          </>
        )}

        {/* Quick action toolbar */}
        {isSelected && (
          <div className="absolute -top-6 right-0 flex gap-0.5" style={{ zIndex: 1001 }}>
            <button onClick={duplicateElement} className="h-5 w-5 rounded bg-background border shadow-sm flex items-center justify-center hover:bg-muted transition-colors" title="Duplicate">
              <Copy className="h-2.5 w-2.5" />
            </button>
            <button onClick={() => updateElement(el.id, { locked: !el.locked })} className="h-5 w-5 rounded bg-background border shadow-sm flex items-center justify-center hover:bg-muted transition-colors" title={el.locked ? "Unlock" : "Lock"}>
              {el.locked ? <Lock className="h-2.5 w-2.5" /> : <Unlock className="h-2.5 w-2.5" />}
            </button>
            <button onClick={() => deleteElement(el.id)} className="h-5 w-5 rounded bg-background border shadow-sm flex items-center justify-center hover:bg-destructive/10 text-destructive transition-colors" title="Delete">
              <Trash2 className="h-2.5 w-2.5" />
            </button>
          </div>
        )}
      </div>
    );
  };

  // ── Properties Panel ───────────────────────────────────────────────────────

  const renderProperties = () => {
    if (!selected) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-sm p-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-muted/50 flex items-center justify-center mb-3">
            <MousePointerClick className="h-6 w-6 opacity-40" />
          </div>
          <p className="font-medium text-sm">No element selected</p>
          <p className="text-xs mt-1 text-muted-foreground/70">Click an element on the canvas<br/>or drag one from the left panel</p>
        </div>
      );
    }

    return (
      <div className="p-3 space-y-3">
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="capitalize text-[10px]">{selected.type.replace("-", " ")}</Badge>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => updateElement(selected.id, { locked: !selected.locked })}>
              {selected.locked ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
            </Button>
            <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => deleteElement(selected.id)}>
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>

        <Separator />

        {/* Position & Size */}
        <div>
          <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Position & Size</Label>
          <div className="grid grid-cols-2 gap-1.5 mt-1.5">
            {[
              { label: "X", key: "x" },
              { label: "Y", key: "y" },
              { label: "W", key: "width" },
              { label: "H", key: "height" },
            ].map(({ label, key }) => (
              <div key={key} className="relative">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground font-medium">{label}</span>
                <Input type="number" value={(selected as any)[key]} className="h-7 text-xs pl-6" onChange={(e) => updateElement(selected.id, { [key]: +e.target.value })} />
              </div>
            ))}
          </div>
        </div>

        {/* Opacity */}
        <div>
          <div className="flex justify-between items-center">
            <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Opacity</Label>
            <span className="text-[10px] text-muted-foreground">{Math.round((selected.opacity ?? 1) * 100)}%</span>
          </div>
          <Slider value={[(selected.opacity ?? 1) * 100]} onValueChange={([v]) => updateElement(selected.id, { opacity: v / 100 })} min={10} max={100} step={5} className="mt-1" />
        </div>

        <Separator />

        {/* Text properties */}
        {(selected.type === "text" || selected.type === "dynamic-field") && (
          <div className="space-y-2.5">
            <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Typography</Label>

            {selected.type === "text" && (
              <div>
                <Label className="text-[10px]">Content</Label>
                <Input value={selected.content} className="h-7 text-xs" onChange={(e) => updateElement(selected.id, { content: e.target.value })} />
              </div>
            )}

            <div>
              <Label className="text-[10px]">Font</Label>
              <Select value={selected.fontFamily || "Inter"} onValueChange={(v) => updateElement(selected.id, { fontFamily: v })}>
                <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>{FONT_FAMILIES.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              <div>
                <Label className="text-[10px]">Size</Label>
                <Input type="number" value={selected.fontSize || 14} className="h-7 text-xs" onChange={(e) => updateElement(selected.id, { fontSize: +e.target.value })} />
              </div>
              <div>
                <Label className="text-[10px]">Color</Label>
                <div className="flex gap-1 items-center">
                  <input type="color" value={selected.color || "#1a1a1a"} className="w-7 h-7 rounded cursor-pointer border-0 p-0" onChange={(e) => updateElement(selected.id, { color: e.target.value })} />
                  <Input value={selected.color || "#1a1a1a"} className="h-7 text-[10px] flex-1" onChange={(e) => updateElement(selected.id, { color: e.target.value })} />
                </div>
              </div>
            </div>

            <div className="flex gap-0.5 bg-muted/50 rounded-lg p-0.5">
              <Button variant={selected.fontWeight === "bold" ? "default" : "ghost"} size="icon" className="h-7 w-7 flex-1" onClick={() => updateElement(selected.id, { fontWeight: selected.fontWeight === "bold" ? "normal" : "bold" })}>
                <Bold className="h-3 w-3" />
              </Button>
              <Button variant={selected.fontStyle === "italic" ? "default" : "ghost"} size="icon" className="h-7 w-7 flex-1" onClick={() => updateElement(selected.id, { fontStyle: selected.fontStyle === "italic" ? "normal" : "italic" })}>
                <Italic className="h-3 w-3" />
              </Button>
              <Separator orientation="vertical" className="h-5 my-auto" />
              <Button variant={selected.textAlign === "left" ? "default" : "ghost"} size="icon" className="h-7 w-7 flex-1" onClick={() => updateElement(selected.id, { textAlign: "left" })}><AlignLeft className="h-3 w-3" /></Button>
              <Button variant={selected.textAlign === "center" ? "default" : "ghost"} size="icon" className="h-7 w-7 flex-1" onClick={() => updateElement(selected.id, { textAlign: "center" })}><AlignCenter className="h-3 w-3" /></Button>
              <Button variant={selected.textAlign === "right" ? "default" : "ghost"} size="icon" className="h-7 w-7 flex-1" onClick={() => updateElement(selected.id, { textAlign: "right" })}><AlignRight className="h-3 w-3" /></Button>
            </div>
          </div>
        )}

        {/* Dynamic field options */}
        {selected.type === "dynamic-field" && (
          <div className="space-y-2.5">
            <Separator />
            <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Field Options</Label>
            <div className="flex items-center justify-between">
              <Label className="text-[10px]">Show Label</Label>
              <Switch checked={selected.showLabel ?? true} onCheckedChange={(v) => updateElement(selected.id, { showLabel: v })} />
            </div>
            <div>
              <Label className="text-[10px]">Format</Label>
              <Select value={selected.fieldFormat || "default"} onValueChange={(v) => updateElement(selected.id, { fieldFormat: v })}>
                <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="currency">Currency (₹)</SelectItem>
                  <SelectItem value="date-long">Date (12 March 2026)</SelectItem>
                  <SelectItem value="date-short">Date (12/03/2026)</SelectItem>
                  <SelectItem value="uppercase">UPPERCASE</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Box properties */}
        {selected.type === "box" && (
          <div className="space-y-2.5">
            <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Box Style</Label>
            <div>
              <Label className="text-[10px]">Background</Label>
              <div className="flex gap-1 items-center">
                <input type="color" value={selected.backgroundColor || "#ffffff"} className="w-7 h-7 rounded cursor-pointer border-0 p-0" onChange={(e) => updateElement(selected.id, { backgroundColor: e.target.value })} />
                <Input value={selected.backgroundColor || "transparent"} className="h-7 text-[10px] flex-1" onChange={(e) => updateElement(selected.id, { backgroundColor: e.target.value })} />
              </div>
            </div>
            <div>
              <Label className="text-[10px]">Border</Label>
              <div className="flex gap-1 items-center">
                <input type="color" value={selected.borderColor || "#d4d4d8"} className="w-7 h-7 rounded cursor-pointer border-0 p-0" onChange={(e) => updateElement(selected.id, { borderColor: e.target.value })} />
                <Input type="number" value={selected.borderWidth || 1} className="h-7 text-xs w-14" placeholder="W" onChange={(e) => updateElement(selected.id, { borderWidth: +e.target.value })} />
                <Input type="number" value={selected.borderRadius || 0} className="h-7 text-xs w-14" placeholder="R" onChange={(e) => updateElement(selected.id, { borderRadius: +e.target.value })} />
              </div>
            </div>
          </div>
        )}

        {selected.type === "divider" && (
          <div className="space-y-2.5">
            <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Divider</Label>
            <div className="flex gap-1 items-center">
              <Label className="text-[10px] w-10">Color</Label>
              <input type="color" value={selected.backgroundColor || "#d4d4d8"} className="w-7 h-7 rounded cursor-pointer border-0 p-0" onChange={(e) => updateElement(selected.id, { backgroundColor: e.target.value })} />
            </div>
          </div>
        )}
      </div>
    );
  };

  // ── Zoom ───────────────────────────────────────────────────────────────────

  const zoomIn = () => setZoom((z) => Math.min(z + 0.1, 2));
  const zoomOut = () => setZoom((z) => Math.max(z - 0.1, 0.5));

  // ── Main Render ────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b bg-background px-3 py-2 shrink-0">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate("/temple/settings/templates")}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Separator orientation="vertical" className="h-5" />
          <Input
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            className="h-8 w-56 text-sm font-medium border-none shadow-none focus-visible:ring-1"
          />
        </div>
        <div className="flex items-center gap-1.5">
          <div className="flex items-center bg-muted/50 rounded-lg px-1 py-0.5 gap-0.5">
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={undo} disabled={historyIndex <= 0} title="Undo (Ctrl+Z)">
              <Undo2 className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={redo} disabled={historyIndex >= history.length - 1} title="Redo (Ctrl+Shift+Z)">
              <Redo2 className="h-3.5 w-3.5" />
            </Button>
          </div>
          <Separator orientation="vertical" className="h-5" />
          <Button
            variant={isPreview ? "default" : "outline"}
            size="sm"
            className="h-8"
            onClick={() => { setIsPreview(!isPreview); setSelectedId(null); }}
          >
            <Eye className="h-3.5 w-3.5 mr-1.5" /> {isPreview ? "Edit" : "Preview"}
          </Button>
          <Button variant="outline" size="sm" className="h-8" onClick={() => toast.info("Download feature coming soon")}>
            <Download className="h-3.5 w-3.5 mr-1.5" /> Export
          </Button>
          <Button variant="outline" size="sm" className="h-8" onClick={() => setShowTemplateGallery(true)}>
            <LayoutTemplate className="h-3.5 w-3.5 mr-1.5" /> Templates
          </Button>
          <Button size="sm" className="h-8" onClick={() => toast.success("Template saved!")}>
            <Save className="h-3.5 w-3.5 mr-1.5" /> Save
          </Button>
        </div>
      </div>

      {/* 3-Panel Editor */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel */}
        {!isPreview && (
          <div className="w-56 border-r bg-background shrink-0 flex flex-col">
            <div className="px-3 py-2 border-b">
              <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                <Layers className="h-3 w-3" /> Elements
              </h3>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-2.5 space-y-4">
                {/* Basic Elements */}
                <div>
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">Basic</p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { type: "text", label: "Text", icon: Type },
                      { type: "image", label: "Image", icon: Image },
                      { type: "divider", label: "Divider", icon: Minus },
                      { type: "box", label: "Box", icon: Square },
                    ].map((item) => (
                      <div
                        key={item.type}
                        draggable
                        onDragStart={(e) => handleDragStart(e, item.type, item.label)}
                        onClick={() => addElement(item.type as CanvasElement["type"])}
                        className="flex flex-col items-center gap-1.5 px-2 py-3 rounded-lg border border-dashed border-border/60 hover:border-primary/40 hover:bg-primary/5 cursor-grab active:cursor-grabbing transition-all group/item active:scale-95"
                      >
                        <div className="h-8 w-8 rounded-lg bg-muted/60 flex items-center justify-center group-hover/item:bg-primary/10 transition-colors">
                          <item.icon className="h-4 w-4 text-muted-foreground group-hover/item:text-primary transition-colors" />
                        </div>
                        <span className="text-[11px] font-medium text-muted-foreground group-hover/item:text-foreground">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Dynamic Fields */}
                <div>
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">Dynamic Fields</p>
                  <div className="space-y-0.5">
                    {DYNAMIC_FIELDS.map((field) => (
                      <div
                        key={field.key}
                        draggable
                        onDragStart={(e) => handleDragStart(e, "dynamic-field", field.label, field.key)}
                        onClick={() => addElement("dynamic-field", field.key)}
                        className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-primary/5 cursor-grab active:cursor-grabbing transition-all group/field active:scale-[0.98] border border-transparent hover:border-primary/20"
                      >
                        <span className="text-sm">{field.icon}</span>
                        <span className="text-xs font-medium text-muted-foreground group-hover/field:text-foreground flex-1">{field.label}</span>
                        <GripVertical className="h-3 w-3 text-muted-foreground/30 group-hover/field:text-muted-foreground/60" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Center Canvas */}
        <div
          ref={canvasWrapRef}
          className="flex-1 overflow-auto flex items-start justify-center relative"
          style={{ background: "linear-gradient(135deg, hsl(var(--muted)/0.4) 0%, hsl(var(--muted)/0.2) 100%)", backgroundImage: `radial-gradient(circle, hsl(var(--border)/0.3) 1px, transparent 1px)`, backgroundSize: "20px 20px" }}
        >
          {/* Zoom controls */}
          <div className="absolute bottom-4 left-4 flex items-center gap-1 bg-background/90 backdrop-blur-sm rounded-lg border shadow-sm p-0.5 z-10">
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={zoomOut}><ZoomOut className="h-3.5 w-3.5" /></Button>
            <span className="text-[11px] font-medium text-muted-foreground w-10 text-center">{Math.round(zoom * 100)}%</span>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={zoomIn}><ZoomIn className="h-3.5 w-3.5" /></Button>
          </div>

          {/* Element count */}
          <div className="absolute top-3 right-3 text-[10px] text-muted-foreground bg-background/80 backdrop-blur-sm px-2 py-1 rounded border z-10">
            {elements.length} element{elements.length !== 1 ? "s" : ""}
          </div>

          <div className="p-8" style={{ transform: `scale(${zoom})`, transformOrigin: "top center", transition: "transform 0.2s ease" }}>
            {/* Canvas paper */}
            <div
              ref={canvasRef}
              className={`relative bg-white rounded-lg transition-shadow duration-200 ${isDraggingOver ? "shadow-2xl ring-2 ring-primary/40" : "shadow-xl"}`}
              style={{ width: CANVAS_W, height: CANVAS_H, overflow: "hidden" }}
              onClick={(e) => { if (e.target === e.currentTarget) setSelectedId(null); }}
              onDrop={handleCanvasDrop}
              onDragOver={handleCanvasDragOver}
              onDragLeave={handleCanvasDragLeave}
            >
              {/* Grid pattern */}
              {!isPreview && (
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    opacity: 0.04,
                    backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 19px, #888 19px, #888 20px), repeating-linear-gradient(90deg, transparent, transparent 19px, #888 19px, #888 20px)",
                  }}
                />
              )}

              {/* Center guides (always visible faintly) */}
              {!isPreview && (
                <>
                  <div className="absolute top-0 bottom-0 left-1/2 w-px pointer-events-none" style={{ backgroundColor: "rgba(200,200,200,0.15)" }} />
                  <div className="absolute left-0 right-0 top-1/2 h-px pointer-events-none" style={{ backgroundColor: "rgba(200,200,200,0.15)" }} />
                </>
              )}

              {/* Active alignment guides */}
              {guides.map((g, i) => (
                <div
                  key={i}
                  className="absolute pointer-events-none"
                  style={
                    g.type === "vertical"
                      ? { left: g.position, top: 0, width: 1, height: "100%", backgroundColor: "hsl(var(--primary))", opacity: 0.7 }
                      : { top: g.position, left: 0, height: 1, width: "100%", backgroundColor: "hsl(var(--primary))", opacity: 0.7 }
                  }
                />
              ))}

              {/* Drop indicator */}
              {isDraggingOver && dropIndicator && (
                <>
                  <div className="absolute pointer-events-none" style={{ left: dropIndicator.x - 1, top: 0, width: 1, height: "100%", borderLeft: "1px dashed hsl(var(--primary)/0.3)" }} />
                  <div className="absolute pointer-events-none" style={{ top: dropIndicator.y - 1, left: 0, height: 1, width: "100%", borderTop: "1px dashed hsl(var(--primary)/0.3)" }} />
                  <div className="absolute w-3 h-3 rounded-full border-2 border-primary bg-primary/20 pointer-events-none animate-pulse" style={{ left: dropIndicator.x - 6, top: dropIndicator.y - 6 }} />
                </>
              )}

              {/* Drop zone overlay */}
              {isDraggingOver && (
                <div className="absolute inset-0 bg-primary/5 pointer-events-none flex items-center justify-center">
                  <div className="bg-primary/10 border-2 border-dashed border-primary/30 rounded-xl px-6 py-3 pointer-events-none">
                    <p className="text-primary text-sm font-medium">Drop here</p>
                  </div>
                </div>
              )}

              {/* Render elements */}
              {[...elements].sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0)).map(renderElement)}

              {/* Empty state */}
              {elements.length === 0 && !isDraggingOver && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
                  <div className="w-20 h-20 rounded-2xl bg-muted/30 flex items-center justify-center mb-4 border-2 border-dashed border-muted-foreground/15">
                    <Palette className="h-8 w-8 opacity-30" />
                  </div>
                  <p className="font-medium text-sm text-muted-foreground/70">Start from scratch or use a template</p>
                  <p className="text-[11px] mt-1 text-muted-foreground/50 mb-4">Drag elements from the left panel, or pick a starter template</p>
                  <Button variant="outline" size="sm" onClick={() => setShowTemplateGallery(true)} className="gap-2">
                    <Sparkles className="h-3.5 w-3.5" /> Browse Starter Templates
                  </Button>
                </div>
              )}
            </div>

            {/* Canvas label */}
            <div className="text-center mt-3 text-[11px] text-muted-foreground/60 font-medium">
              A5 Receipt — {CANVAS_W} × {CANVAS_H}px
            </div>
          </div>
        </div>

        {/* Right Panel */}
        {!isPreview && (
          <div className="w-60 border-l bg-background shrink-0 flex flex-col">
            <div className="px-3 py-2 border-b">
              <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Properties</h3>
            </div>
            <ScrollArea className="flex-1">
              {renderProperties()}
            </ScrollArea>
          </div>
        )}

        {/* Preview sidebar */}
        {isPreview && (
          <div className="w-60 border-l bg-background shrink-0">
            <div className="px-3 py-2 border-b">
              <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Sample Data</h3>
            </div>
            <div className="p-3 space-y-1.5">
              {Object.entries(SAMPLE_DATA).map(([key, value]) => {
                const field = DYNAMIC_FIELDS.find((f) => f.key === key);
                return (
                  <div key={key} className="flex justify-between items-center text-xs py-1 border-b border-border/30 last:border-0">
                    <span className="text-muted-foreground text-[11px]">{field?.label || key}</span>
                    <span className="font-medium text-[11px]">{value}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
      {/* Template Gallery Dialog */}
      <Dialog open={showTemplateGallery} onOpenChange={setShowTemplateGallery}>
        <DialogContent className="max-w-3xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Starter Templates
            </DialogTitle>
            <p className="text-sm text-muted-foreground">Pick a pre-built template to start with. You can fully customize it after loading.</p>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] pr-2">
            <div className="grid grid-cols-2 gap-4 py-2">
              {STARTER_TEMPLATES.map((tmpl) => (
                <div
                  key={tmpl.id}
                  className="group border rounded-xl p-4 hover:border-primary/50 hover:bg-primary/5 cursor-pointer transition-all"
                  onClick={() => loadStarterTemplate(tmpl)}
                >
                  {/* Mini preview */}
                  <div className="relative w-full aspect-[3/4] bg-white rounded-lg border shadow-sm mb-3 overflow-hidden">
                    <div className="absolute inset-0" style={{ transform: "scale(0.35)", transformOrigin: "top left", width: CANVAS_W, height: CANVAS_H }}>
                      {tmpl.elements.map((el, i) => {
                        const fieldDef = DYNAMIC_FIELDS.find((f) => f.key === el.fieldKey);
                        return (
                          <div
                            key={i}
                            style={{
                              position: "absolute",
                              left: el.x,
                              top: el.y,
                              width: el.width,
                              height: el.height,
                              fontSize: el.fontSize,
                              fontFamily: el.fontFamily,
                              fontWeight: el.fontWeight,
                              fontStyle: el.fontStyle,
                              textAlign: el.textAlign as any,
                              color: el.color,
                              opacity: el.opacity ?? 1,
                              backgroundColor: el.type === "box" ? (el.backgroundColor || "transparent") : el.type === "divider" ? (el.backgroundColor || "#d4d4d8") : undefined,
                              border: el.type === "box" ? `${el.borderWidth || 1}px solid ${el.borderColor || "#d4d4d8"}` : undefined,
                              borderRadius: el.type === "box" ? el.borderRadius : undefined,
                              display: "flex",
                              alignItems: "center",
                              lineHeight: 1.4,
                              overflow: "hidden",
                            }}
                          >
                            {el.type === "text" && el.content}
                            {el.type === "dynamic-field" && (
                              <>
                                {el.showLabel && <span style={{ color: "#888", fontSize: (el.fontSize || 13) - 1, marginRight: 4 }}>{fieldDef?.label}: </span>}
                                <span>{SAMPLE_DATA[el.fieldKey || ""] || `{${el.fieldKey}}`}</span>
                              </>
                            )}
                            {el.type === "divider" && <div style={{ width: "100%", height: Math.max(1, el.height), backgroundColor: el.backgroundColor || "#d4d4d8" }} />}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-semibold text-sm group-hover:text-primary transition-colors">{tmpl.name}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">{tmpl.description}</p>
                    </div>
                    <Badge variant="secondary" className="text-[10px] shrink-0">{tmpl.category}</Badge>
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-[10px] text-muted-foreground">
                    <FileText className="h-3 w-3" />
                    {tmpl.elements.length} elements
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReceiptTemplateBuilder;
