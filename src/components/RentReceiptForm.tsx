import { useState, useEffect } from 'react'
import { Info } from 'lucide-react'
import type { FormData } from '../lib/generatePDF'

interface RentReceiptFormProps {
  onPreview: (data: FormData) => void
}

const STORAGE_KEY = 'rentReceiptFormData'

const paymentModes = ['Cash', 'Bank Transfer / UPI', 'Cheque']
const paymentDateOptions = [
  { value: '1', label: '1st of every month' },
  { value: 'last', label: 'Last day of every month' },
  { value: 'custom', label: 'Custom date (1-28)' },
]

function formatIndianNumber(num: number): string {
  const str = num.toString()
  const lastThree = str.slice(-3)
  const remaining = str.slice(0, -3)
  if (remaining) {
    return remaining.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree
  }
  return lastThree
}

function getMonthOptions(): { value: string; label: string }[] {
  const months = []
  const now = new Date()
  for (let i = -24; i <= 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1)
    const val = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    const label = d.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
    months.push({ value: val, label })
  }
  return months
}

export default function RentReceiptForm({ onPreview }: RentReceiptFormProps) {
  const monthOptions = getMonthOptions()
  const currentMonth = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`

  const [showWelcomeBack, setShowWelcomeBack] = useState(false)
  const [form, setForm] = useState<FormData>({
    tenantName: '',
    tenantPAN: '',
    landlordName: '',
    landlordPAN: '',
    propertyAddress: '',
    monthlyRent: 0,
    fromMonth: currentMonth,
    toMonth: currentMonth,
    paymentDate: '1',
    includeRevenueStamp: true,
    paymentMode: 'Cash',
  })
  const [customDate, setCustomDate] = useState('5')
  const [showCustomDate, setShowCustomDate] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as FormData
        setForm(parsed)
        setShowWelcomeBack(true)
        if (!['1', 'last'].includes(parsed.paymentDate)) {
          setShowCustomDate(true)
          setCustomDate(parsed.paymentDate)
        }
      } catch { /* ignore */ }
    }
  }, [])

  const updateField = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: '' }))
  }

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}
    if (!form.tenantName.trim()) newErrors.tenantName = 'Tenant name is required'
    if (!form.landlordName.trim()) newErrors.landlordName = 'Landlord name is required'
    if (!form.propertyAddress.trim()) newErrors.propertyAddress = 'Property address is required'
    if (!form.monthlyRent || form.monthlyRent <= 0) newErrors.monthlyRent = 'Enter a valid rent amount'
    if (!form.fromMonth) newErrors.fromMonth = 'Select start month'
    if (!form.toMonth) newErrors.toMonth = 'Select end month'
    if (form.fromMonth > form.toMonth) newErrors.toMonth = 'End month must be after start month'

    if (form.tenantPAN && !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(form.tenantPAN.toUpperCase())) {
      newErrors.tenantPAN = 'Invalid PAN format (e.g., ABCDE1234F)'
    }
    if (form.landlordPAN && !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(form.landlordPAN.toUpperCase())) {
      newErrors.landlordPAN = 'Invalid PAN format (e.g., ABCDE1234F)'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    const finalForm = {
      ...form,
      tenantPAN: form.tenantPAN.toUpperCase(),
      landlordPAN: form.landlordPAN.toUpperCase(),
      paymentDate: showCustomDate ? customDate : form.paymentDate,
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(finalForm))

    const count = parseInt(localStorage.getItem('receiptCount') || '14500', 10)
    const fromDate = new Date(finalForm.fromMonth + '-01')
    const toDate = new Date(finalForm.toMonth + '-01')
    let monthsCount = (toDate.getFullYear() - fromDate.getFullYear()) * 12 + (toDate.getMonth() - fromDate.getMonth()) + 1
    if (monthsCount < 1) monthsCount = 1
    localStorage.setItem('receiptCount', String(count + monthsCount))

    onPreview(finalForm)
  }

  const clearSavedData = () => {
    localStorage.removeItem(STORAGE_KEY)
    setForm({
      tenantName: '',
      tenantPAN: '',
      landlordName: '',
      landlordPAN: '',
      propertyAddress: '',
      monthlyRent: 0,
      fromMonth: currentMonth,
      toMonth: currentMonth,
      paymentDate: '1',
      includeRevenueStamp: true,
      paymentMode: 'Cash',
    })
    setShowWelcomeBack(false)
    setErrors({})
  }

  const inputClass = (field: string) =>
    `w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition ${
      errors[field] ? 'border-red-400' : 'border-border'
    }`

  const Tooltip = ({ text }: { text: string }) => (
    <span className="relative group ml-1 inline-flex">
      <Info size={14} className="text-text-secondary cursor-help" />
      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 bg-gray-800 text-white text-xs rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 leading-relaxed">
        {text}
      </span>
    </span>
  )

  return (
    <form onSubmit={handleSubmit} id="receipt-form" className="max-w-2xl mx-auto">
      {showWelcomeBack && (
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 flex items-center justify-between">
          <span className="text-sm text-blue-800">
            Welcome back! We've pre-filled your details from last time.
          </span>
          <button
            type="button"
            onClick={clearSavedData}
            className="text-xs text-blue-600 hover:text-blue-800 underline cursor-pointer bg-transparent border-none"
          >
            Clear Saved Data
          </button>
        </div>
      )}

      {/* Tenant Details */}
      <div className="bg-white border border-border rounded-xl p-6 mb-6">
        <h3 className="text-lg font-semibold text-primary mb-4">Tenant (Employee) Details</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.tenantName}
              onChange={(e) => updateField('tenantName', e.target.value)}
              placeholder="e.g., Rahul Sharma"
              className={inputClass('tenantName')}
            />
            {errors.tenantName && <p className="text-red-500 text-xs mt-1">{errors.tenantName}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              PAN Number
              <span className="text-text-secondary text-xs ml-1">(Optional)</span>
              <Tooltip text="PAN is needed if your annual rent exceeds ₹1,00,000 as per Income Tax rules." />
            </label>
            <input
              type="text"
              value={form.tenantPAN}
              onChange={(e) => updateField('tenantPAN', e.target.value.toUpperCase())}
              placeholder="e.g., ABCDE1234F"
              maxLength={10}
              className={inputClass('tenantPAN')}
            />
            {errors.tenantPAN && <p className="text-red-500 text-xs mt-1">{errors.tenantPAN}</p>}
          </div>
        </div>
      </div>

      {/* Landlord & Property Details */}
      <div className="bg-white border border-border rounded-xl p-6 mb-6">
        <h3 className="text-lg font-semibold text-primary mb-4">Landlord & Property Details</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Landlord Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.landlordName}
              onChange={(e) => updateField('landlordName', e.target.value)}
              placeholder="e.g., Suresh Kumar"
              className={inputClass('landlordName')}
            />
            {errors.landlordName && <p className="text-red-500 text-xs mt-1">{errors.landlordName}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Landlord PAN Number
              <span className="text-text-secondary text-xs ml-1">(Optional)</span>
              <Tooltip text="Mandatory if annual rent exceeds ₹1,00,000. If the landlord doesn't have PAN, they can provide a declaration in Form 60." />
            </label>
            <input
              type="text"
              value={form.landlordPAN}
              onChange={(e) => updateField('landlordPAN', e.target.value.toUpperCase())}
              placeholder="e.g., XYZAB5678C"
              maxLength={10}
              className={inputClass('landlordPAN')}
            />
            {errors.landlordPAN && <p className="text-red-500 text-xs mt-1">{errors.landlordPAN}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Rented Property Address <span className="text-red-500">*</span>
            </label>
            <textarea
              value={form.propertyAddress}
              onChange={(e) => updateField('propertyAddress', e.target.value)}
              placeholder="e.g., Flat 302, Building Name, Street, City, State - PIN Code"
              rows={3}
              className={inputClass('propertyAddress')}
            />
            {errors.propertyAddress && <p className="text-red-500 text-xs mt-1">{errors.propertyAddress}</p>}
          </div>
        </div>
      </div>

      {/* Rent Details */}
      <div className="bg-white border border-border rounded-xl p-6 mb-6">
        <h3 className="text-lg font-semibold text-primary mb-4">Rent Details</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Monthly Rent Amount (₹) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={form.monthlyRent || ''}
              onChange={(e) => updateField('monthlyRent', parseInt(e.target.value) || 0)}
              placeholder="e.g., 15000"
              min={1}
              className={inputClass('monthlyRent')}
            />
            {form.monthlyRent > 0 && (
              <p className="text-xs text-text-secondary mt-1">
                ₹{formatIndianNumber(form.monthlyRent)} per month
              </p>
            )}
            {errors.monthlyRent && <p className="text-red-500 text-xs mt-1">{errors.monthlyRent}</p>}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                From Month <span className="text-red-500">*</span>
              </label>
              <select
                value={form.fromMonth}
                onChange={(e) => updateField('fromMonth', e.target.value)}
                className={inputClass('fromMonth')}
              >
                {monthOptions.map((m) => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
              {errors.fromMonth && <p className="text-red-500 text-xs mt-1">{errors.fromMonth}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                To Month <span className="text-red-500">*</span>
              </label>
              <select
                value={form.toMonth}
                onChange={(e) => updateField('toMonth', e.target.value)}
                className={inputClass('toMonth')}
              >
                {monthOptions.map((m) => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
              {errors.toMonth && <p className="text-red-500 text-xs mt-1">{errors.toMonth}</p>}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Rent Payment Date</label>
            <select
              value={showCustomDate ? 'custom' : form.paymentDate}
              onChange={(e) => {
                if (e.target.value === 'custom') {
                  setShowCustomDate(true)
                  updateField('paymentDate', customDate)
                } else {
                  setShowCustomDate(false)
                  updateField('paymentDate', e.target.value)
                }
              }}
              className={inputClass('paymentDate')}
            >
              {paymentDateOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            {showCustomDate && (
              <input
                type="number"
                min={1}
                max={28}
                value={customDate}
                onChange={(e) => {
                  setCustomDate(e.target.value)
                  updateField('paymentDate', e.target.value)
                }}
                placeholder="Enter date (1-28)"
                className={`${inputClass('paymentDate')} mt-2`}
              />
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Payment Mode</label>
            <select
              value={form.paymentMode}
              onChange={(e) => updateField('paymentMode', e.target.value)}
              className={inputClass('paymentMode')}
            >
              {paymentModes.map((mode) => (
                <option key={mode} value={mode}>{mode}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Options */}
      <div className="bg-white border border-border rounded-xl p-6 mb-6">
        <h3 className="text-lg font-semibold text-primary mb-4">Options</h3>
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={form.includeRevenueStamp}
            onChange={(e) => updateField('includeRevenueStamp', e.target.checked)}
            className="mt-0.5 w-4 h-4 accent-primary"
          />
          <span className="text-sm">
            Include Revenue Stamp (₹1)
            <Tooltip text="A ₹1 revenue stamp is customary for cash rent payments above ₹5,000. Not required for bank transfers or UPI." />
          </span>
        </label>
        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
          <p className="text-xs text-blue-800 leading-relaxed">
            <strong>GST Note:</strong> Rent on residential property is exempt from GST when rented for personal use by salaried individuals. GST (18%) applies only when the tenant is a registered business entity and the landlord's turnover exceeds ₹20 lakh.
          </p>
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-accent hover:bg-accent-dark text-white font-semibold py-3.5 rounded-lg transition-colors text-base cursor-pointer border-none shadow-sm"
      >
        Preview Receipts
      </button>
    </form>
  )
}
