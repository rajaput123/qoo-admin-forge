import { downloadForm10BEPdf, buildForm10BEPdf, type Form10BEInput } from "@/lib/pdfDocs";
import type { Donation80GReceipt } from "@/modules/donations/types";

export function receipt80GToPdfInput(
  receipt: Donation80GReceipt,
  donorAddress?: string
): Form10BEInput {
  return {
    donorName: receipt.donorName,
    donorPan: receipt.pan,
    donorAddress: donorAddress && donorAddress !== "-" ? donorAddress : "—",
    amount: receipt.amount,
    date: receipt.date,
    mode: receipt.mode,
    donationType: receipt.donationType,
    fy: receipt.fy,
    receiptNo: receipt.receiptNo,
    certificateId: receipt.receipt80GId,
  };
}

export function download80GReceiptPdf(receipt: Donation80GReceipt, donorAddress?: string) {
  const input = receipt80GToPdfInput(receipt, donorAddress);
  const safe = receipt.donorName.replace(/[^a-z0-9]+/gi, "_");
  downloadForm10BEPdf(input, `80G_${receipt.receiptNo}_${safe}.pdf`);
}

export function build80GReceiptPdfBlob(receipt: Donation80GReceipt, donorAddress?: string) {
  return buildForm10BEPdf(receipt80GToPdfInput(receipt, donorAddress)).output("blob");
}

export { download80GBlankTemplatePdf, build80GBlankTemplatePdf } from "@/lib/pdfDocs";
