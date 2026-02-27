export interface ReceiptTheme {
  id: string
  name: string
  headerBg: string
  headerText: string
  headerSubtext: string
  amountBg: string
  amountBorder: string
  amountLabel: string
  amountText: string
  amountWords: string
  stampBorder: string
  stampBg: string
  stampText: string
}

export const themes: ReceiptTheme[] = [
  {
    id: 'classic-blue',
    name: 'Classic Blue',
    headerBg: 'bg-[#1a365d]',
    headerText: 'text-white',
    headerSubtext: 'text-blue-200',
    amountBg: 'bg-gradient-to-r from-green-50 to-emerald-50',
    amountBorder: 'border-green-200',
    amountLabel: 'text-green-600',
    amountText: 'text-green-700',
    amountWords: 'text-green-600',
    stampBorder: 'border-amber-400',
    stampBg: 'bg-amber-50',
    stampText: 'text-amber-600',
  },
  {
    id: 'professional-dark',
    name: 'Professional Dark',
    headerBg: 'bg-[#1c1c1e]',
    headerText: 'text-white',
    headerSubtext: 'text-gray-400',
    amountBg: 'bg-gradient-to-r from-gray-50 to-gray-100',
    amountBorder: 'border-gray-300',
    amountLabel: 'text-gray-600',
    amountText: 'text-gray-900',
    amountWords: 'text-gray-500',
    stampBorder: 'border-gray-400',
    stampBg: 'bg-gray-50',
    stampText: 'text-gray-600',
  },
  {
    id: 'royal-maroon',
    name: 'Royal Maroon',
    headerBg: 'bg-[#7b2d3b]',
    headerText: 'text-white',
    headerSubtext: 'text-red-200',
    amountBg: 'bg-gradient-to-r from-rose-50 to-pink-50',
    amountBorder: 'border-rose-200',
    amountLabel: 'text-rose-600',
    amountText: 'text-rose-800',
    amountWords: 'text-rose-500',
    stampBorder: 'border-amber-400',
    stampBg: 'bg-amber-50',
    stampText: 'text-amber-600',
  },
  {
    id: 'forest-green',
    name: 'Forest Green',
    headerBg: 'bg-[#1a4d2e]',
    headerText: 'text-white',
    headerSubtext: 'text-green-200',
    amountBg: 'bg-gradient-to-r from-teal-50 to-emerald-50',
    amountBorder: 'border-teal-200',
    amountLabel: 'text-teal-700',
    amountText: 'text-teal-800',
    amountWords: 'text-teal-600',
    stampBorder: 'border-amber-400',
    stampBg: 'bg-amber-50',
    stampText: 'text-amber-600',
  },
  {
    id: 'minimal-gray',
    name: 'Minimal',
    headerBg: 'bg-white border-b-2 border-gray-800',
    headerText: 'text-gray-900',
    headerSubtext: 'text-gray-500',
    amountBg: 'bg-gray-50',
    amountBorder: 'border-gray-200',
    amountLabel: 'text-gray-500',
    amountText: 'text-gray-900',
    amountWords: 'text-gray-500',
    stampBorder: 'border-gray-300',
    stampBg: 'bg-gray-50',
    stampText: 'text-gray-500',
  },
]

export function getThemeById(id: string): ReceiptTheme {
  return themes.find((t) => t.id === id) || themes[0]
}
