import { jsPDF } from 'jspdf';
import { parse, format, lastDayOfMonth, addMonths, isBefore, isEqual } from 'date-fns';
import { numberToWords } from './numberToWords';
import { PDF_CONFIG } from './constants';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ReceiptData {
  receiptNumber: string;
  date: string;
  monthYear: string;
  tenantName: string;
  tenantPAN: string;
  landlordName: string;
  landlordPAN: string;
  propertyAddress: string;
  rentAmount: number;
  rentAmountWords: string;
  paymentMode: string;
  includeRevenueStamp: boolean;
}

export interface FormData {
  tenantName: string;
  tenantPAN: string;
  landlordName: string;
  landlordPAN: string;
  propertyAddress: string;
  monthlyRent: number;
  fromMonth: string; // YYYY-MM format
  toMonth: string; // YYYY-MM format
  paymentDate: string; // "1", "last", or custom number "1"-"28"
  includeRevenueStamp: boolean;
  paymentMode: string;
}

// ---------------------------------------------------------------------------
// Receipt generation
// ---------------------------------------------------------------------------

/**
 * Given form data, generates an array of ReceiptData objects, one per month
 * in the [fromMonth, toMonth] range (inclusive).
 */
export function generateReceipts(formData: FormData): ReceiptData[] {
  const receipts: ReceiptData[] = [];

  const fromDate = parse(formData.fromMonth, 'yyyy-MM', new Date());
  const toDate = parse(formData.toMonth, 'yyyy-MM', new Date());

  let current = fromDate;
  let index = 1;

  while (isBefore(current, toDate) || isEqual(current, toDate)) {
    const paymentDate = resolvePaymentDate(current, formData.paymentDate);

    receipts.push({
      receiptNumber: String(index).padStart(3, '0'),
      date: format(paymentDate, 'dd/MM/yyyy'),
      monthYear: format(current, 'MMMM yyyy'),
      tenantName: formData.tenantName,
      tenantPAN: formData.tenantPAN,
      landlordName: formData.landlordName,
      landlordPAN: formData.landlordPAN,
      propertyAddress: formData.propertyAddress,
      rentAmount: formData.monthlyRent,
      rentAmountWords: numberToWords(formData.monthlyRent),
      paymentMode: formData.paymentMode,
      includeRevenueStamp: formData.includeRevenueStamp,
    });

    current = addMonths(current, 1);
    index++;
  }

  return receipts;
}

/**
 * Resolves the actual payment date for a given month based on the user's
 * payment-date preference.
 *
 * - "last" -> last day of the month
 * - "1"-"28" -> that day of the month (clamped to last day if needed)
 */
function resolvePaymentDate(monthDate: Date, paymentDatePref: string): Date {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth(); // 0-indexed

  if (paymentDatePref === 'last') {
    return lastDayOfMonth(monthDate);
  }

  const day = parseInt(paymentDatePref, 10);
  const lastDay = lastDayOfMonth(monthDate).getDate();
  const clampedDay = Math.min(day, lastDay);

  return new Date(year, month, clampedDay);
}

// ---------------------------------------------------------------------------
// PDF generation
// ---------------------------------------------------------------------------

const {
  pageWidth,
  margin,
  receiptHeight,
  receiptsPerPage,
  separatorDash,
  fonts,
} = PDF_CONFIG;

const contentWidth = pageWidth - margin * 2;

/**
 * Draws a dashed horizontal separator line.
 */
function drawDashedLine(doc: jsPDF, y: number): void {
  const { dashLength, gapLength } = separatorDash;
  doc.setDrawColor(150, 150, 150);
  doc.setLineWidth(0.3);

  let x = margin;
  const endX = pageWidth - margin;

  while (x < endX) {
    const segEnd = Math.min(x + dashLength, endX);
    doc.line(x, y, segEnd, y);
    x = segEnd + gapLength;
  }
}

/**
 * Draws a single receipt starting at the given y-offset.
 */
function drawReceipt(doc: jsPDF, receipt: ReceiptData, startY: number): void {
  const leftX = margin;
  const rightX = pageWidth - margin;
  let y = startY;

  // ---- Border rectangle ----
  doc.setDrawColor(0);
  doc.setLineWidth(0.4);
  doc.rect(margin - 2, startY - 2, contentWidth + 4, receiptHeight - 4);

  // ---- Title ----
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(fonts.heading);
  doc.text('RENT RECEIPT', pageWidth / 2, y + 2, { align: 'center' });
  y += 7;

  // ---- Receipt No & Date row ----
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(fonts.body);
  doc.text(`Receipt No: ${receipt.receiptNumber}`, leftX, y);
  doc.text(`Date: ${receipt.date}`, rightX, y, { align: 'right' });
  y += 4;

  doc.text(`Period: ${receipt.monthYear}`, leftX, y);
  y += 6;

  // ---- Main body text ----
  doc.setFontSize(fonts.body);

  const bodyLine1 = `Received a sum of Rs. ${receipt.rentAmount.toLocaleString('en-IN')}/-`;
  doc.text(bodyLine1, leftX, y);
  y += 4;

  const bodyLine2 = `(${receipt.rentAmountWords})`;
  doc.setFont('Helvetica', 'italic');
  doc.text(bodyLine2, leftX, y);
  y += 5;

  doc.setFont('Helvetica', 'normal');
  const bodyLine3 = `from ${receipt.tenantName}${receipt.tenantPAN ? ` (PAN: ${receipt.tenantPAN})` : ''}`;
  doc.text(bodyLine3, leftX, y);
  y += 4;

  const bodyLine4 = `towards rent for the property at: ${receipt.propertyAddress}`;
  // Handle long address by splitting
  const addressLines = doc.splitTextToSize(bodyLine4, contentWidth);
  doc.text(addressLines, leftX, y);
  y += addressLines.length * 3.5 + 1.5;

  const bodyLine5 = `Payment Mode: ${receipt.paymentMode}`;
  doc.text(bodyLine5, leftX, y);
  y += 6;

  // ---- Footer: Landlord info + Signature + Revenue stamp ----
  const footerY = startY + receiptHeight - 16;

  // Landlord details (left side)
  doc.setFontSize(fonts.small);
  doc.text(`Landlord: ${receipt.landlordName}`, leftX, footerY);
  if (receipt.landlordPAN) {
    doc.text(`PAN: ${receipt.landlordPAN}`, leftX, footerY + 4);
  }

  // Revenue stamp box (center)
  if (receipt.includeRevenueStamp) {
    const stampX = pageWidth / 2 - 12;
    const stampY = footerY - 2;
    const stampW = 24;
    const stampH = 12;

    doc.setDrawColor(100);
    doc.setLineWidth(0.3);
    doc.rect(stampX, stampY, stampW, stampH);

    doc.setFontSize(7);
    doc.setFont('Helvetica', 'italic');
    doc.setTextColor(120, 120, 120);
    doc.text('Revenue', pageWidth / 2, footerY + 2, { align: 'center' });
    doc.text('Stamp', pageWidth / 2, footerY + 5.5, { align: 'center' });
    doc.setTextColor(0, 0, 0);
    doc.setFont('Helvetica', 'normal');
  }

  // Signature line (right side)
  const sigLineX = rightX - 45;
  const sigLineEndX = rightX;
  doc.setDrawColor(0);
  doc.setLineWidth(0.3);
  doc.line(sigLineX, footerY + 4, sigLineEndX, footerY + 4);
  doc.setFontSize(fonts.small);
  doc.text('Signature of Landlord', (sigLineX + sigLineEndX) / 2, footerY + 8, {
    align: 'center',
  });
}

/**
 * Generates a PDF containing all rent receipts and triggers a download.
 *
 * Layout: 3 receipts per A4 page, separated by dashed cut-lines.
 */
export function downloadPDF(
  receipts: ReceiptData[],
  formData: FormData
): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  doc.setFont('Helvetica');

  receipts.forEach((receipt, index) => {
    const positionOnPage = index % receiptsPerPage;

    // Add new page when needed (but not for the very first receipt)
    if (index > 0 && positionOnPage === 0) {
      doc.addPage();
    }

    const receiptY = margin + positionOnPage * (receiptHeight + 8);

    drawReceipt(doc, receipt, receiptY);

    // Draw dashed separator after each receipt except the last on the page
    if (positionOnPage < receiptsPerPage - 1 && index < receipts.length - 1) {
      const separatorY = receiptY + receiptHeight;
      drawDashedLine(doc, separatorY);
    }
  });

  // Build filename
  const tenantSlug = formData.tenantName.replace(/\s+/g, '_').replace(/[^\w-]/g, '');
  const fromLabel = formatMonthLabel(formData.fromMonth);
  const toLabel = formatMonthLabel(formData.toMonth);
  const fileName = `Rent_Receipts_${tenantSlug}_${fromLabel}_to_${toLabel}.pdf`;

  doc.save(fileName);
}

/**
 * Converts "YYYY-MM" into a short label like "Jan2025".
 */
function formatMonthLabel(yearMonth: string): string {
  const date = parse(yearMonth, 'yyyy-MM', new Date());
  return format(date, 'MMMyyyy');
}
