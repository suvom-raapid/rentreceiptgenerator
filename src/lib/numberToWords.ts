/**
 * Converts a number to Indian English words.
 * Uses the Indian numbering system: Lakh (1,00,000), Crore (1,00,00,000).
 *
 * @param amount - The number to convert
 * @returns A string in the format "Rupees [Amount in Words] Only"
 *
 * @example
 * numberToWords(15000)   // "Rupees Fifteen Thousand Only"
 * numberToWords(150000)  // "Rupees One Lakh Fifty Thousand Only"
 * numberToWords(0)       // "Rupees Zero Only"
 */

const ones: string[] = [
  '',
  'One',
  'Two',
  'Three',
  'Four',
  'Five',
  'Six',
  'Seven',
  'Eight',
  'Nine',
  'Ten',
  'Eleven',
  'Twelve',
  'Thirteen',
  'Fourteen',
  'Fifteen',
  'Sixteen',
  'Seventeen',
  'Eighteen',
  'Nineteen',
];

const tens: string[] = [
  '',
  '',
  'Twenty',
  'Thirty',
  'Forty',
  'Fifty',
  'Sixty',
  'Seventy',
  'Eighty',
  'Ninety',
];

/**
 * Converts a number from 0 to 99 into words.
 */
function twoDigitToWords(n: number): string {
  if (n < 20) {
    return ones[n];
  }
  const ten = tens[Math.floor(n / 10)];
  const one = ones[n % 10];
  return one ? `${ten} ${one}` : ten;
}

/**
 * Converts a number from 0 to 999 into words.
 */
function threeDigitToWords(n: number): string {
  if (n === 0) return '';

  const hundred = Math.floor(n / 100);
  const remainder = n % 100;

  const parts: string[] = [];

  if (hundred > 0) {
    parts.push(`${ones[hundred]} Hundred`);
  }

  if (remainder > 0) {
    parts.push(twoDigitToWords(remainder));
  }

  return parts.join(' ');
}

/**
 * Converts a non-negative integer into Indian English words.
 *
 * Indian numbering system breakdown:
 *   1,00,00,00,000 = Hundred Crore
 *   1,00,00,000     = Crore
 *   1,00,000         = Lakh
 *   1,000             = Thousand
 *   100               = Hundred
 */
function integerToWords(n: number): string {
  if (n === 0) return 'Zero';

  // Safety: handle very large numbers gracefully
  if (n >= 1_00_00_00_00_000) {
    // Beyond typical Indian numbering; fallback
    return n.toLocaleString('en-IN');
  }

  const parts: string[] = [];

  // Crore (1,00,00,000 = 10^7)
  const crore = Math.floor(n / 1_00_00_000);
  if (crore > 0) {
    // Crore itself can be in hundreds, so use threeDigitToWords for up to 999 crore
    // For amounts beyond 999 crore, we recursively break down
    if (crore > 99) {
      parts.push(`${threeDigitToWords(crore)} Crore`);
    } else {
      parts.push(`${twoDigitToWords(crore)} Crore`);
    }
  }
  n = n % 1_00_00_000;

  // Lakh (1,00,000 = 10^5)
  const lakh = Math.floor(n / 1_00_000);
  if (lakh > 0) {
    parts.push(`${twoDigitToWords(lakh)} Lakh`);
  }
  n = n % 1_00_000;

  // Thousand (1,000 = 10^3)
  const thousand = Math.floor(n / 1_000);
  if (thousand > 0) {
    parts.push(`${twoDigitToWords(thousand)} Thousand`);
  }
  n = n % 1_000;

  // Hundred and remainder
  if (n > 0) {
    parts.push(threeDigitToWords(n));
  }

  return parts.join(' ');
}

/**
 * Main export: converts a numeric amount to Indian Rupee words.
 *
 * - Handles zero, negative numbers, and decimals (rounds to nearest rupee).
 * - Returns format: "Rupees [Amount] Only"
 */
export function numberToWords(amount: number): string {
  // Handle NaN and non-finite
  if (!Number.isFinite(amount)) {
    return 'Rupees Zero Only';
  }

  // Handle negatives
  const isNegative = amount < 0;
  const absoluteAmount = Math.abs(amount);

  // Round to nearest rupee (handle decimals)
  const rounded = Math.round(absoluteAmount);

  const words = integerToWords(rounded);
  const prefix = isNegative ? 'Minus ' : '';

  return `Rupees ${prefix}${words} Only`;
}

export default numberToWords;
