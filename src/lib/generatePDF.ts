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

/**
 * Converts "YYYY-MM" into a short label like "Jan2025".
 */
export function formatMonthLabel(yearMonth: string): string {
  const date = parse(yearMonth, 'yyyy-MM', new Date());
  return format(date, 'MMMyyyy');
}
