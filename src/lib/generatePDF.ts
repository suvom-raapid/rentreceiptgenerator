import { jsPDF } from 'jspdf';
import { parse, format, lastDayOfMonth, addMonths, isBefore, isEqual } from 'date-fns';
import { numberToWords } from './numberToWords';

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

function resolvePaymentDate(monthDate: Date, paymentDatePref: string): Date {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();

  if (paymentDatePref === 'last') {
    return lastDayOfMonth(monthDate);
  }

  const day = parseInt(paymentDatePref, 10);
  const lastDay = lastDayOfMonth(monthDate).getDate();
  const clampedDay = Math.min(day, lastDay);

  return new Date(year, month, clampedDay);
}

// ---------------------------------------------------------------------------
// PDF generation — Professional receipt layout
// ---------------------------------------------------------------------------

const PAGE_W = 210;
const MARGIN = 15;
const CONTENT_W = PAGE_W - MARGIN * 2;
const RECEIPT_H = 85;
const RECEIPTS_PER_PAGE = 3;
const GAP = 8;

function drawDashedLine(doc: jsPDF, y: number): void {
  doc.setDrawColor(160, 160, 160);
  doc.setLineWidth(0.2);
  let x = MARGIN;
  while (x < PAGE_W - MARGIN) {
    const end = Math.min(x + 3, PAGE_W - MARGIN);
    doc.line(x, y, end, y);
    x = end + 2;
  }
}

function drawReceipt(doc: jsPDF, receipt: ReceiptData, startY: number): void {
  const left = MARGIN;
  const right = PAGE_W - MARGIN;

  // Outer border — double line effect
  doc.setDrawColor(40, 40, 40);
  doc.setLineWidth(0.6);
  doc.rect(left, startY, CONTENT_W, RECEIPT_H);
  doc.setLineWidth(0.2);
  doc.rect(left + 1.5, startY + 1.5, CONTENT_W - 3, RECEIPT_H - 3);

  let y = startY + 6;

  // ── Title bar ──
  doc.setFillColor(26, 54, 93); // primary color
  doc.rect(left + 3, y - 4, CONTENT_W - 6, 9, 'F');
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text('RENT RECEIPT', PAGE_W / 2, y + 1.5, { align: 'center' });

  // Receipt number on the right of title bar
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(7);
  doc.text(`No. ${receipt.receiptNumber}`, right - 6, y + 1.5, { align: 'right' });
  doc.setTextColor(0, 0, 0);
  y += 10;

  // ── Date & Period row ──
  doc.setFontSize(8);
  doc.setFont('Helvetica', 'bold');
  doc.text('Date:', left + 4, y);
  doc.setFont('Helvetica', 'normal');
  doc.text(receipt.date, left + 16, y);

  doc.setFont('Helvetica', 'bold');
  doc.text('Period:', left + 55, y);
  doc.setFont('Helvetica', 'normal');
  doc.text(receipt.monthYear, left + 70, y);

  doc.setFont('Helvetica', 'bold');
  doc.text('Mode:', right - 40, y);
  doc.setFont('Helvetica', 'normal');
  doc.text(receipt.paymentMode, right - 28, y);
  y += 5;

  // Thin separator
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.15);
  doc.line(left + 4, y, right - 4, y);
  y += 4;

  // ── Body paragraph ──
  doc.setFontSize(8.5);
  doc.setFont('Helvetica', 'normal');

  const amountStr = `Rs. ${receipt.rentAmount.toLocaleString('en-IN')}/-`;
  const line1 = `Received a sum of  ${amountStr}  (${receipt.rentAmountWords})`;
  const wrappedLine1 = doc.splitTextToSize(line1, CONTENT_W - 10);
  doc.text(wrappedLine1, left + 4, y);

  // Bold the amount within the first line
  const amountX = left + 4 + doc.getTextWidth('Received a sum of  ');
  doc.setFont('Helvetica', 'bold');
  doc.text(amountStr, amountX, y);
  doc.setFont('Helvetica', 'normal');
  y += wrappedLine1.length * 3.5 + 1;

  const tenantLine = `from Mr./Ms. ${receipt.tenantName}${receipt.tenantPAN ? `  (PAN: ${receipt.tenantPAN})` : ''}`;
  doc.text(tenantLine, left + 4, y);
  y += 4;

  const addressLine = `towards rent for the month of ${receipt.monthYear} for the property at:`;
  doc.text(addressLine, left + 4, y);
  y += 3.5;

  doc.setFont('Helvetica', 'italic');
  const addressWrapped = doc.splitTextToSize(receipt.propertyAddress, CONTENT_W - 10);
  doc.text(addressWrapped, left + 4, y);
  doc.setFont('Helvetica', 'normal');

  // ── Footer section ──
  const footerY = startY + RECEIPT_H - 22;

  // Thin separator above footer
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.15);
  doc.line(left + 4, footerY - 2, right - 4, footerY - 2);

  // Revenue stamp (bottom-left)
  if (receipt.includeRevenueStamp) {
    const stampX = left + 5;
    const stampY = footerY;
    const stampW = 18;
    const stampH = 18;

    // Stamp border
    doc.setDrawColor(180, 140, 40);
    doc.setLineWidth(0.4);
    doc.rect(stampX, stampY, stampW, stampH);
    // Inner border
    doc.setLineWidth(0.15);
    doc.rect(stampX + 1, stampY + 1, stampW - 2, stampH - 2);

    // Stamp text
    doc.setFontSize(7);
    doc.setFont('Helvetica', 'bold');
    doc.setTextColor(150, 110, 20);
    doc.text('REVENUE', stampX + stampW / 2, stampY + 6, { align: 'center' });
    doc.text('STAMP', stampX + stampW / 2, stampY + 9.5, { align: 'center' });
    doc.setFontSize(9);
    doc.text('₹1', stampX + stampW / 2, stampY + 14, { align: 'center' });
    doc.setTextColor(0, 0, 0);
    doc.setFont('Helvetica', 'normal');
  }

  // Landlord info (center)
  const centerX = PAGE_W / 2;
  doc.setFontSize(7.5);
  doc.setFont('Helvetica', 'normal');
  doc.text(`Landlord: ${receipt.landlordName}`, centerX, footerY + 6, { align: 'center' });
  if (receipt.landlordPAN) {
    doc.text(`PAN: ${receipt.landlordPAN}`, centerX, footerY + 10, { align: 'center' });
  }

  // Signature line (bottom-right)
  const sigStart = right - 50;
  const sigEnd = right - 5;
  doc.setDrawColor(80, 80, 80);
  doc.setLineWidth(0.3);
  doc.line(sigStart, footerY + 12, sigEnd, footerY + 12);
  doc.setFontSize(7);
  doc.text('Signature of Landlord', (sigStart + sigEnd) / 2, footerY + 16, { align: 'center' });

  // "Received with thanks" at very bottom
  doc.setFontSize(6.5);
  doc.setTextColor(120, 120, 120);
  doc.setFont('Helvetica', 'italic');
  doc.text('Received with thanks', PAGE_W / 2, startY + RECEIPT_H - 2.5, { align: 'center' });
  doc.setTextColor(0, 0, 0);
  doc.setFont('Helvetica', 'normal');
}

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
    const positionOnPage = index % RECEIPTS_PER_PAGE;

    if (index > 0 && positionOnPage === 0) {
      doc.addPage();
    }

    const receiptY = MARGIN + positionOnPage * (RECEIPT_H + GAP);

    drawReceipt(doc, receipt, receiptY);

    if (positionOnPage < RECEIPTS_PER_PAGE - 1 && index < receipts.length - 1) {
      const separatorY = receiptY + RECEIPT_H + GAP / 2;
      drawDashedLine(doc, separatorY);
    }
  });

  const tenantSlug = formData.tenantName.replace(/\s+/g, '_').replace(/[^\w-]/g, '');
  const fromLabel = formatMonthLabel(formData.fromMonth);
  const toLabel = formatMonthLabel(formData.toMonth);
  const fileName = `Rent_Receipts_${tenantSlug}_${fromLabel}_to_${toLabel}.pdf`;

  doc.save(fileName);
}

function formatMonthLabel(yearMonth: string): string {
  const date = parse(yearMonth, 'yyyy-MM', new Date());
  return format(date, 'MMMyyyy');
}
