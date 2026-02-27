// Indian states and union territories
export const INDIAN_STATES = [
  // States (28)
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  // Union Territories (8)
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry',
] as const;

export type IndianState = (typeof INDIAN_STATES)[number];

// Month names
export const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

export const MONTH_NAMES_SHORT = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const;

// Payment modes
export const PAYMENT_MODES = [
  'Cash',
  'Bank Transfer / UPI',
  'Cheque',
] as const;

export type PaymentMode = (typeof PAYMENT_MODES)[number];

// Payment date options for the form dropdown
export const PAYMENT_DATE_OPTIONS = [
  { value: '1', label: '1st of every month' },
  { value: '2', label: '2nd of every month' },
  { value: '3', label: '3rd of every month' },
  { value: '4', label: '4th of every month' },
  { value: '5', label: '5th of every month' },
  { value: '6', label: '6th of every month' },
  { value: '7', label: '7th of every month' },
  { value: '8', label: '8th of every month' },
  { value: '9', label: '9th of every month' },
  { value: '10', label: '10th of every month' },
  { value: '11', label: '11th of every month' },
  { value: '12', label: '12th of every month' },
  { value: '13', label: '13th of every month' },
  { value: '14', label: '14th of every month' },
  { value: '15', label: '15th of every month' },
  { value: '16', label: '16th of every month' },
  { value: '17', label: '17th of every month' },
  { value: '18', label: '18th of every month' },
  { value: '19', label: '19th of every month' },
  { value: '20', label: '20th of every month' },
  { value: '21', label: '21st of every month' },
  { value: '22', label: '22nd of every month' },
  { value: '23', label: '23rd of every month' },
  { value: '24', label: '24th of every month' },
  { value: '25', label: '25th of every month' },
  { value: '26', label: '26th of every month' },
  { value: '27', label: '27th of every month' },
  { value: '28', label: '28th of every month' },
  { value: 'last', label: 'Last day of every month' },
] as const;

// PDF configuration
export const PDF_CONFIG = {
  pageWidth: 210, // A4 width in mm
  pageHeight: 297, // A4 height in mm
  margin: 15,
  receiptHeight: 85, // Height of each receipt in mm
  receiptsPerPage: 3,
  separatorDash: {
    dashLength: 3,
    gapLength: 2,
  },
  fonts: {
    heading: 14,
    subheading: 11,
    body: 9,
    small: 8,
  },
} as const;

// Revenue stamp threshold (INR) - stamps typically required for cash payments >= 5000
export const REVENUE_STAMP_THRESHOLD = 5000;

// PAN format regex for validation
export const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
