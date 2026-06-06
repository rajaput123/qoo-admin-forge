import jsPDF from "jspdf";
import { getTempleConfig, format80GValidity } from "./templeConfig";
import { rupeesInWords } from "./numberToWords";

export interface ReceiptInput {
  receiptNo: string;
  date: string;          // ISO yyyy-mm-dd
  donorName: string;
  donorPan?: string;
  donorAddress?: string;
  amount: number;
  mode: string;          // Cash / Cheque / NEFT / UPI ...
  donationType: string;  // General / Corpus
  remarks?: string;
  is80G?: boolean;
}

export interface Form10BEInput {
  donorName: string;
  donorPan: string;
  donorAddress: string;
  amount: number;
  date: string;
  mode: string;
  donationType: string;
  fy: string;            // e.g. "2024-25"
  receiptNo?: string;
  certificateId?: string;
}

function formatDateLong(iso: string): string {
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  } catch {
    return iso;
  }
}

function addTempleHeader(doc: jsPDF, subtitle: string): number {
  const cfg = getTempleConfig();
  const w = doc.internal.pageSize.getWidth();
  doc.setDrawColor(124, 45, 18);
  doc.setLineWidth(0.8);
  doc.rect(12, 10, w - 24, doc.internal.pageSize.getHeight() - 20);

  doc.setFont("times", "bold");
  doc.setFontSize(18);
  doc.setTextColor(124, 45, 18);
  doc.text(cfg.name.toUpperCase(), w / 2, 22, { align: "center" });

  doc.setFont("times", "normal");
  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  doc.text(cfg.address, w / 2, 28, { align: "center" });
  doc.text(
    `PAN: ${cfg.pan}   |   80G Reg: ${cfg.registration80G}`,
    w / 2, 33.5, { align: "center" }
  );
  doc.text(
    `80G Validity: ${format80GValidity(cfg.validityFrom, cfg.validityTo)}`,
    w / 2,  38.5, { align: "center" }
  );

  doc.setDrawColor(180, 180, 180);
  doc.setLineWidth(0.2);
  doc.line(20, 42, w - 20, 42);

  doc.setFont("times", "bold");
  doc.setFontSize(13);
  doc.setTextColor(124, 45, 18);
  doc.text(subtitle, w / 2, 50, { align: "center" });

  return 58; // next Y
}

function addSignatures(doc: jsPDF, y: number) {
  const cfg = getTempleConfig();
  const w = doc.internal.pageSize.getWidth();
  doc.setDrawColor(120, 120, 120);
  doc.line(25, y, 80, y);
  doc.line(w - 80, y, w - 25, y);
  doc.setFont("times", "normal");
  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  doc.text("Date and Stamp", 52, y + 5, { align: "center" });
  doc.text("Authorised Signatory", w - 52, y + 5, { align: "center" });
  doc.setFontSize(9);
  doc.text(cfg.signatory, w - 52, y + 10, { align: "center" });
}

function drawField(doc: jsPDF, label: string, value: string, y: number, opts?: { bold?: boolean }) {
  doc.setFont("times", "normal");
  doc.setFontSize(11);
  doc.setTextColor(70, 70, 70);
  doc.text(`${label}:`, 22, y);
  doc.setFont("times", opts?.bold ? "bold" : "normal");
  doc.setTextColor(20, 20, 20);
  const wrapped = doc.splitTextToSize(value || "—", 130);
  doc.text(wrapped, 65, y);
  return y + 6 + Math.max(0, (wrapped.length - 1) * 5);
}

/* ---------------- DONATION RECEIPT ---------------- */
export function buildReceiptPdf(input: ReceiptInput): jsPDF {
  const cfg = getTempleConfig();
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  let y = addTempleHeader(doc, "DONATION RECEIPT");

  // Receipt # and Date row
  doc.setFont("times", "bold");
  doc.setFontSize(11);
  doc.setTextColor(124, 45, 18);
  doc.text(`Receipt No: ${input.receiptNo}`, 22, y);
  doc.text(`Date: ${formatDateLong(input.date)}`, doc.internal.pageSize.getWidth() - 22, y, { align: "right" });
  y += 8;

  doc.setDrawColor(220, 220, 220);
  doc.line(20, y - 3, doc.internal.pageSize.getWidth() - 20, y - 3);

  y = drawField(doc, "Donor Name", input.donorName, y, { bold: true });
  if (input.donorPan) y = drawField(doc, "Donor PAN", input.donorPan, y);
  if (input.donorAddress) y = drawField(doc, "Donor Address", input.donorAddress, y);
  y = drawField(doc, "Amount", `Rs. ${input.amount.toLocaleString("en-IN")} /-`, y, { bold: true });
  y = drawField(doc, "Amount in Words", rupeesInWords(input.amount), y);
  y = drawField(doc, "Mode of Payment", input.mode, y);
  y = drawField(doc, "Donation Type", input.donationType, y);
  if (input.remarks) y = drawField(doc, "Remarks", input.remarks, y);

  // 80G declaration
  y += 4;
  doc.setFillColor(254, 240, 217);
  doc.setDrawColor(124, 45, 18);
  doc.rect(20, y, doc.internal.pageSize.getWidth() - 40, 18, "FD");
  doc.setFont("times", "italic");
  doc.setFontSize(10);
  doc.setTextColor(80, 30, 10);
  const declaration =
    "This donation is eligible for 50% deduction under Section 80G of the Income Tax Act, 1961. " +
    `(80G Registration: ${cfg.registration80G})`;
  const wrapped = doc.splitTextToSize(declaration, doc.internal.pageSize.getWidth() - 50);
  doc.text(wrapped, doc.internal.pageSize.getWidth() / 2, y + 7, { align: "center" });
  y += 26;

  addSignatures(doc, Math.max(y + 20, doc.internal.pageSize.getHeight() - 40));
  return doc;
}

export function downloadReceiptPdf(input: ReceiptInput) {
  const doc = buildReceiptPdf(input);
  doc.save(`${input.receiptNo}.pdf`);
}

/* ---------------- FORM 10BE CERTIFICATE ---------------- */
export function buildForm10BEPdf(input: Form10BEInput): jsPDF {
  const cfg = getTempleConfig();
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  let y = addTempleHeader(doc, "80G DONATION CERTIFICATE");

  doc.setFont("times", "italic");
  doc.setFontSize(10);
  doc.setTextColor(80, 80, 80);
  doc.text("[Temple-issued acknowledgment under Section 80G(5). Official Form 10BE is issued by the Income Tax Department after Form 10BD filing.]",
    doc.internal.pageSize.getWidth() / 2, y, { align: "center" });
  y += 10;

  if (input.certificateId || input.receiptNo) {
    doc.setFont("times", "bold");
    doc.setFontSize(10);
    doc.setTextColor(124, 45, 18);
    if (input.certificateId) doc.text(`80G Certificate No: ${input.certificateId}`, 22, y);
    if (input.receiptNo) doc.text(`Donation Receipt No: ${input.receiptNo}`, doc.internal.pageSize.getWidth() - 22, y, { align: "right" });
    y += 8;
  }

  doc.setFont("times", "normal");
  doc.setFontSize(11);
  doc.setTextColor(20, 20, 20);

  const body =
    `I/We, ${cfg.name}, having PAN ${cfg.pan}, registered under section 80G ` +
    `vide reference number ${cfg.registration80G}, hereby certify that ${input.donorName}, ` +
    `PAN ${input.donorPan}, residing at ${input.donorAddress}, made a donation of ` +
    `Rs. ${input.amount.toLocaleString("en-IN")} (${rupeesInWords(input.amount)}) ` +
    `on ${formatDateLong(input.date)} by ${input.mode}. ` +
    `Nature of donation: ${input.donationType}. Financial Year: ${input.fy}. ` +
    `This certificate is issued under section 80G(5)(viii) read with Rule 18AB of the Income Tax Rules, 1962.`;

  const wrapped = doc.splitTextToSize(body, doc.internal.pageSize.getWidth() - 44);
  doc.text(wrapped, 22, y, { lineHeightFactor: 1.5 });
  y += wrapped.length * 6 + 10;

  // Key fields recap
  doc.setDrawColor(200, 200, 200);
  doc.rect(20, y, doc.internal.pageSize.getWidth() - 40, 40);
  let yk = y + 7;
  yk = drawField(doc, "Donor Name", input.donorName, yk, { bold: true });
  yk = drawField(doc, "Donor PAN", input.donorPan, yk);
  yk = drawField(doc, "Amount", `Rs. ${input.amount.toLocaleString("en-IN")} /-`, yk, { bold: true });
  yk = drawField(doc, "Financial Year", input.fy, yk);

  const sigY = doc.internal.pageSize.getHeight() - 30;
  const w = doc.internal.pageSize.getWidth();
  doc.setFont("times", "italic");
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text(
    "Disclaimer: Temple-issued acknowledgment only — not a substitute for Form 10BE from the Income Tax Department.",
    w / 2,
    sigY - 6,
    { align: "center" }
  );
  addSignatures(doc, sigY);

  return doc;
}

export function downloadForm10BEPdf(input: Form10BEInput, fileName?: string) {
  const doc = buildForm10BEPdf(input);
  const safe = input.donorName.replace(/[^a-z0-9]+/gi, "_");
  doc.save(fileName || `80G_Certificate_${safe}_FY${input.fy}.pdf`);
}

/** Blank 80G certificate layout — labels only, no donor/donation data (for preview or manual fill) */
export function build80GBlankTemplatePdf(): jsPDF {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const w = doc.internal.pageSize.getWidth();
  const h = doc.internal.pageSize.getHeight();

  doc.setDrawColor(124, 45, 18);
  doc.setLineWidth(0.8);
  doc.rect(12, 10, w - 24, h - 20);

  doc.setFont("times", "bold");
  doc.setFontSize(14);
  doc.setTextColor(124, 45, 18);
  doc.text("NAME OF TEMPLE / TRUST / INSTITUTION", w / 2, 22, { align: "center" });

  doc.setFont("times", "normal");
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text("Address: _________________________________________________________________", w / 2, 29, { align: "center" });
  doc.text("PAN: _______________     |     80G Registration No: _________________________", w / 2, 35, { align: "center" });
  doc.text("80G Validity: From _______________  To _______________", w / 2, 41, { align: "center" });

  doc.setDrawColor(180, 180, 180);
  doc.setLineWidth(0.2);
  doc.line(20, 45, w - 20, 45);

  doc.setFont("times", "bold");
  doc.setFontSize(13);
  doc.setTextColor(124, 45, 18);
  doc.text("80G DONATION CERTIFICATE", w / 2, 53, { align: "center" });

  doc.setFont("times", "italic");
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text(
    "(Sample format — Temple-issued acknowledgment under Section 80G(5). Official Form 10BE is issued by the Income Tax Department.)",
    w / 2,
    59,
    { align: "center" }
  );

  let y = 68;
  doc.setFont("times", "bold");
  doc.setFontSize(10);
  doc.setTextColor(124, 45, 18);
  doc.text("80G Certificate No: _______________________", 22, y);
  doc.text("Donation Receipt No: _______________________", w - 22, y, { align: "right" });
  y += 12;

  doc.setFont("times", "normal");
  doc.setFontSize(11);
  doc.setTextColor(40, 40, 40);
  const bodyTemplate =
    "I/We, ________________________________ (Name of Trust/Temple), having PAN ________________, " +
    "registered under section 80G vide reference number ________________________________, hereby certify that " +
    "________________________ (Name of Donor), PAN ________________, residing at " +
    "________________________________________________________________________, made a donation of " +
    "Rs. __________________ (Rupees __________________________________________________________) " +
    "on __________________ (Date) by __________________ (Mode of payment). " +
    "Nature of donation: __________________. Financial Year: __________. " +
    "This certificate is issued under section 80G(5)(viii) read with Rule 18AB of the Income Tax Rules, 1962.";
  const wrappedBody = doc.splitTextToSize(bodyTemplate, w - 44);
  doc.text(wrappedBody, 22, y, { lineHeightFactor: 1.55 });

  const sigY = Math.max(y + wrappedBody.length * 5.5 + 28, h - 32);
  doc.setFont("times", "italic");
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text(
    "Disclaimer: Temple-issued acknowledgment only — not a substitute for Form 10BE from the Income Tax Department.",
    w / 2,
    sigY - 6,
    { align: "center" }
  );
  doc.setDrawColor(120, 120, 120);
  doc.line(25, sigY, 80, sigY);
  doc.line(w - 80, sigY, w - 25, sigY);
  doc.setFont("times", "normal");
  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  doc.text("Date and Stamp", 52, sigY + 5, { align: "center" });
  doc.text("Authorised Signatory", w - 52, sigY + 5, { align: "center" });
  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  doc.text("(Name & designation)", w - 52, sigY + 10, { align: "center" });

  return doc;
}

export function download80GBlankTemplatePdf(fileName = "80G_Blank_Template.pdf") {
  build80GBlankTemplatePdf().save(fileName);
}