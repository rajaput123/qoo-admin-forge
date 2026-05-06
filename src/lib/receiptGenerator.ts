import { Donation } from "@/modules/donations/types";
import { Donor } from "@/modules/donations/types";

/**
 * Generate receipt HTML for printing/downloading
 */
function generateReceiptHTML(
  donation: Donation,
  donor: Donor | null,
  is80G: boolean = false
): string {
  const formatCurrency = (val: number) => `₹${val.toLocaleString('en-IN')}`;
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const templeName = "Sri Venkateswara Temple";
  const templeAddress = "Tirumala, Chittoor District, Andhra Pradesh";
  const templePhone = "+91 877 223 1234";
  const templeEmail = "info@tirumala.org";

  const numberToWords = (num: number): string => {
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
      'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    if (num === 0) return 'Zero';
    if (num < 20) return ones[num];
    if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 ? ' ' + ones[num % 10] : '');
    if (num < 1000) return ones[Math.floor(num / 100)] + ' Hundred' + (num % 100 ? ' and ' + numberToWords(num % 100) : '');
    if (num < 100000) return numberToWords(Math.floor(num / 1000)) + ' Thousand' + (num % 1000 ? ' ' + numberToWords(num % 1000) : '');
    if (num < 10000000) return numberToWords(Math.floor(num / 100000)) + ' Lakh' + (num % 100000 ? ' ' + numberToWords(num % 100000) : '');
    return numberToWords(Math.floor(num / 10000000)) + ' Crore' + (num % 10000000 ? ' ' + numberToWords(num % 10000000) : '');
  };

  const amountInWords = numberToWords(Math.floor(donation.amount)) + ' Rupees Only';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Receipt ${donation.receiptNo}</title>
  <style>
    @media print {
      @page { size: A4; margin: 20mm; }
      body { margin: 0; padding: 0; }
    }
    body {
      font-family: 'Georgia', 'Times New Roman', serif;
      max-width: 210mm;
      margin: 0 auto;
      padding: 20mm;
      color: #1f2937;
    }
    .receipt-box {
      border: 2px solid #7c2d12;
      border-radius: 4px;
      padding: 0;
      overflow: hidden;
    }
    .top-bar { height: 6px; background: #7c2d12; }
    .bottom-bar { height: 4px; background: #7c2d12; }
    .inner { padding: 24px 32px; }
    .header {
      text-align: center;
      border-bottom: 1px solid #d1d5db;
      padding-bottom: 16px;
      margin-bottom: 20px;
    }
    .header h1 {
      font-size: 24px;
      font-weight: bold;
      margin: 8px 0 4px;
      color: #7c2d12;
      letter-spacing: 2px;
      text-transform: uppercase;
    }
    .header p {
      font-size: 12px;
      color: #4b5563;
      margin: 2px 0;
    }
    .receipt-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }
    .receipt-no {
      font-size: 18px;
      font-weight: bold;
      color: #7c2d12;
      border-bottom: 2px solid #7c2d12;
      padding: 2px 12px;
    }
    .field-line {
      display: flex;
      align-items: baseline;
      gap: 8px;
      margin-bottom: 14px;
      font-size: 14px;
    }
    .field-label {
      color: #1f2937;
      font-weight: 500;
      white-space: nowrap;
    }
    .field-value {
      flex: 1;
      border-bottom: 1px dotted #9ca3af;
      padding-bottom: 2px;
      min-height: 18px;
      font-weight: 600;
      color: #111827;
    }
    .field-suffix {
      color: #1f2937;
      white-space: nowrap;
    }
    .amount-signatures {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-top: 20px;
      padding-top: 16px;
      border-top: 1px solid #e5e7eb;
    }
    .amount-box {
      border: 2px solid #374151;
      border-radius: 4px;
      padding: 6px 16px;
      font-weight: bold;
      font-size: 16px;
      color: #111827;
    }
    .signatures {
      display: flex;
      gap: 48px;
      text-align: center;
    }
    .sig-line {
      border-top: 1px solid #9ca3af;
      min-width: 100px;
      padding-top: 4px;
      font-size: 11px;
      color: #6b7280;
    }
    .footer {
      margin-top: 16px;
      text-align: center;
      font-size: 11px;
      color: #6b7280;
      font-style: italic;
    }
    ${is80G ? `
    .tax-note {
      margin-top: 12px;
      padding: 8px 12px;
      border: 1px solid #d1d5db;
      border-radius: 4px;
      font-size: 11px;
      color: #4b5563;
      text-align: center;
    }` : ''}
  </style>
</head>
<body>
  <div class="receipt-box">
    <div class="top-bar"></div>
    <div class="inner">
      <div class="header">
        <h1>${templeName}</h1>
        <p>${templeAddress}</p>
        <p>Tel: ${templePhone} | Email: ${templeEmail}</p>
        ${is80G ? '<p style="font-weight:600; margin-top:8px; color:#7c2d12;">80G Tax Exemption Certificate</p>' : ''}
      </div>

      <div class="receipt-row">
        <div>
          <span style="font-size:14px; font-weight:600;">No.</span>
          <span class="receipt-no">${donation.receiptNo}</span>
        </div>
        <div>
          <span style="font-size:14px; color:#6b7280;">Date: </span>
          <span style="font-size:14px; font-weight:600;">${formatDate(donation.date)}</span>
        </div>
      </div>

      <div class="field-line">
        <span class="field-label">Received with thanks from Smt/Sri</span>
        <span class="field-value">${donation.donorName}</span>
      </div>

      ${donor?.phone && donor.phone !== "-" ? `
      <div class="field-line">
        <span class="field-label">Phone</span>
        <span class="field-value">${donor.phone}</span>
        ${donor?.email && donor.email !== "-" ? `<span class="field-label" style="margin-left:16px;">Email</span><span class="field-value">${donor.email}</span>` : ''}
      </div>` : ''}

      ${donor?.city && donor.city !== "-" ? `
      <div class="field-line">
        <span class="field-label">Address</span>
        <span class="field-value">${donor.city}</span>
      </div>` : ''}

      <div class="field-line">
        <span class="field-label">A Sum of Rupees</span>
        <span class="field-value">${amountInWords}</span>
        <span class="field-suffix">only</span>
      </div>

      <div class="field-line">
        <span class="field-label">by Cash/DD/Cheque No.</span>
        <span class="field-value">${donation.channel}${donation.referenceNo ? ' — ' + donation.referenceNo : ''}</span>
        <span class="field-suffix">Dt.</span>
        <span class="field-value" style="max-width:120px;">${formatDate(donation.date)}</span>
      </div>

      <div class="field-line">
        <span class="field-label">Towards</span>
        <span class="field-value">${donation.purpose}</span>
      </div>

      ${is80G && donor?.pan && donor.pan !== "-" ? `
      <div class="field-line">
        <span class="field-label">PAN</span>
        <span class="field-value">${donor.pan}</span>
      </div>` : ''}

      <div class="amount-signatures">
        <div class="amount-box">Rs. ${formatCurrency(donation.amount).replace('₹', '')}</div>
        <div class="signatures">
          <div class="sig-line">Treasurer</div>
          <div class="sig-line">Receiver's Signature</div>
        </div>
      </div>

      ${is80G ? `
      <div class="tax-note">
        Donations are exempt U/s. 80G of the Income Tax Act, 1961.<br/>
        This receipt is eligible for tax deduction under Section 80G.
      </div>` : ''}

      <div class="footer">
        <p>This is a computer-generated receipt.</p>
        <p>Thank you for your generous contribution. May the divine blessings be with you.</p>
      </div>
    </div>
    <div class="bottom-bar"></div>
  </div>
</body>
</html>
  `;
}

/**
 * Download receipt as PDF (opens print dialog for saving as PDF)
 */
export function downloadReceipt(
  donation: Donation,
  donor: Donor | null,
  is80G: boolean = false
) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    throw new Error('Unable to open print window. Please allow popups.');
  }

  const receiptHTML = generateReceiptHTML(donation, donor, is80G);
  
  printWindow.document.write(receiptHTML);
  printWindow.document.close();
  
  // Wait for content to load, then trigger print
  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.print();
      // After print dialog closes, close the window
      setTimeout(() => {
        printWindow.close();
      }, 100);
    }, 250);
  };
}

/**
 * Print receipt directly
 */
export function printReceipt(
  donation: Donation,
  donor: Donor | null,
  is80G: boolean = false
) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    throw new Error('Unable to open print window. Please allow popups.');
  }

  const receiptHTML = generateReceiptHTML(donation, donor, is80G);
  
  printWindow.document.write(receiptHTML);
  printWindow.document.close();
  
  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };
}

/**
 * Generate PDF receipt and return file path (for storage)
 */
export async function generateReceiptPDF(
  donation: Donation,
  donor: Donor | null,
  is80G: boolean = false
): Promise<string> {
  // In a real implementation, this would:
  // 1. Generate PDF on server
  // 2. Store file on server/storage
  // 3. Return file path/URL
  
  // For now, we'll just return a file path
  // The actual PDF generation happens via downloadReceipt/printReceipt
  const filePath = `/receipts/${donation.receiptNo}.pdf`;
  return filePath;
}

/**
 * Send receipt via email (placeholder - would integrate with email service)
 */
export async function sendReceiptEmail(
  donation: Donation,
  donor: Donor | null,
  email: string,
  is80G: boolean = false
): Promise<void> {
  // In a real implementation, this would call an API endpoint
  // that sends the email with the receipt PDF attachment
  
  // For now, we'll use mailto as a fallback
  const subject = encodeURIComponent(`Donation Receipt ${donation.receiptNo}`);
  const body = encodeURIComponent(
    `Dear ${donation.donorName},\n\n` +
    `Thank you for your donation of ₹${donation.amount.toLocaleString('en-IN')}.\n\n` +
    `Receipt Number: ${donation.receiptNo}\n` +
    `Date: ${new Date(donation.date).toLocaleDateString('en-IN')}\n` +
    `Purpose: ${donation.purpose}\n\n` +
    `Please find the receipt attached.\n\n` +
    `With regards,\n` +
    `Temple Administration`
  );
  
  window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
}
