import { useRef, useState } from 'react'
import { Download, Printer, Loader2 } from 'lucide-react'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'
import type { ReceiptData, FormData } from '../lib/generatePDF'
import { formatMonthLabel } from '../lib/generatePDF'
import type { ReceiptTheme } from '../lib/themes'
import { getThemeById } from '../lib/themes'

interface ReceiptPreviewProps {
  receipts: ReceiptData[]
  formData: FormData
  themeId: string
}

function formatIndianNumber(num: number): string {
  return num.toLocaleString('en-IN')
}

// Raw hex colors per theme for inline-styled print/PDF output
const THEME_COLORS: Record<string, { header: string; headerText: string; headerBorder: string; amountBg: string; amountBorder: string; amountText: string; amountLabel: string; stamp: string; stampBg: string }> = {
  'classic-blue':      { header: '#1a365d', headerText: '#ffffff', headerBorder: '', amountBg: '#f0fdf4', amountBorder: '#bbf7d0', amountText: '#15803d', amountLabel: '#16a34a', stamp: '#d97706', stampBg: '#fffbeb' },
  'professional-dark': { header: '#1c1c1e', headerText: '#ffffff', headerBorder: '', amountBg: '#f9fafb', amountBorder: '#d1d5db', amountText: '#111827', amountLabel: '#6b7280', stamp: '#6b7280', stampBg: '#f9fafb' },
  'royal-maroon':      { header: '#7b2d3b', headerText: '#ffffff', headerBorder: '', amountBg: '#fff1f2', amountBorder: '#fecdd3', amountText: '#9f1239', amountLabel: '#e11d48', stamp: '#d97706', stampBg: '#fffbeb' },
  'forest-green':      { header: '#1a4d2e', headerText: '#ffffff', headerBorder: '', amountBg: '#f0fdfa', amountBorder: '#99f6e4', amountText: '#115e59', amountLabel: '#0f766e', stamp: '#d97706', stampBg: '#fffbeb' },
  'minimal-gray':      { header: '#ffffff', headerText: '#111827', headerBorder: 'border-bottom: 2px solid #1f2937;', amountBg: '#f9fafb', amountBorder: '#e5e7eb', amountText: '#111827', amountLabel: '#6b7280', stamp: '#6b7280', stampBg: '#f9fafb' },
}

function getColors(themeId: string) {
  return THEME_COLORS[themeId] || THEME_COLORS['classic-blue']
}

function buildReceiptHTML(r: ReceiptData, c: ReturnType<typeof getColors>): string {
  return `<div class="receipt" style="border:1px solid #d1d5db;border-radius:4px;overflow:hidden;font-family:'DM Sans',system-ui,-apple-system,sans-serif;font-size:11px;background:#fff;">
  <div style="background:${c.header};color:${c.headerText};padding:6px 16px;display:flex;justify-content:space-between;align-items:center;${c.headerBorder}">
    <strong style="font-size:11px;text-transform:uppercase;letter-spacing:2px;">Rent Receipt</strong>
    <span style="font-size:10px;opacity:0.8;">No. ${r.receiptNumber}</span>
  </div>
  <div style="padding:10px 16px;">
    <div style="display:flex;justify-content:space-between;border-bottom:1px solid #e5e7eb;padding-bottom:6px;margin-bottom:8px;">
      <div style="display:flex;gap:20px;">
        <div><div style="font-size:8px;text-transform:uppercase;color:#9ca3af;letter-spacing:0.5px;">Date</div><div style="font-weight:500;color:#1f2937;">${r.date}</div></div>
        <div><div style="font-size:8px;text-transform:uppercase;color:#9ca3af;letter-spacing:0.5px;">Period</div><div style="font-weight:500;color:#1f2937;">${r.monthYear}</div></div>
      </div>
      <div><div style="font-size:8px;text-transform:uppercase;color:#9ca3af;letter-spacing:0.5px;">Payment Mode</div><div style="font-weight:500;color:#1f2937;">${r.paymentMode}</div></div>
    </div>
    <div style="background:${c.amountBg};border:1px solid ${c.amountBorder};border-radius:6px;padding:6px 12px;margin-bottom:8px;">
      <div style="font-size:8px;text-transform:uppercase;color:${c.amountLabel};font-weight:600;letter-spacing:0.5px;">Amount Received</div>
      <div style="font-size:18px;font-weight:bold;color:${c.amountText};">\u20B9${formatIndianNumber(r.rentAmount)}/-</div>
      <div style="font-size:9px;color:${c.amountLabel};font-style:italic;">${r.rentAmountWords}</div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px;">
      <div>
        <div style="font-size:8px;text-transform:uppercase;color:#9ca3af;letter-spacing:0.5px;">Received From (Tenant)</div>
        <div style="font-weight:600;color:#1f2937;">${r.tenantName}${r.tenantPAN ? ` <span style="font-size:9px;color:#6b7280;background:#f3f4f6;padding:1px 4px;border-radius:3px;">PAN: ${r.tenantPAN}</span>` : ''}</div>
        <div style="font-size:8px;text-transform:uppercase;color:#9ca3af;margin-top:4px;letter-spacing:0.5px;">Property Address</div>
        <div style="font-size:10px;color:#4b5563;">${r.propertyAddress}</div>
      </div>
      <div>
        <div style="font-size:8px;text-transform:uppercase;color:#9ca3af;letter-spacing:0.5px;">Received By (Landlord)</div>
        <div style="font-weight:600;color:#1f2937;">${r.landlordName}${r.landlordPAN ? ` <span style="font-size:9px;color:#6b7280;background:#f3f4f6;padding:1px 4px;border-radius:3px;">PAN: ${r.landlordPAN}</span>` : ''}</div>
      </div>
    </div>
    <div style="border-top:1px solid #e5e7eb;padding-top:8px;display:flex;justify-content:space-between;align-items:flex-end;">
      ${r.includeRevenueStamp ? `<div style="text-align:center;">
        <div style="width:45px;height:45px;border:1.5px dashed ${c.stamp};background:${c.stampBg};border-radius:4px;display:flex;flex-direction:column;align-items:center;justify-content:center;">
          <span style="color:${c.stamp};font-weight:bold;font-size:10px;">\u20B91</span>
          <span style="font-size:6px;color:${c.stamp};text-transform:uppercase;letter-spacing:0.5px;">Revenue</span>
          <span style="font-size:6px;color:${c.stamp};text-transform:uppercase;letter-spacing:0.5px;">Stamp</span>
        </div>
        <div style="font-size:7px;color:#9ca3af;margin-top:1px;">Affix here</div>
      </div>` : '<div></div>'}
      <div style="text-align:center;">
        <div style="width:120px;border-bottom:1.5px solid #9ca3af;margin-bottom:4px;height:14px;"></div>
        <div style="font-size:9px;color:#6b7280;font-weight:500;">Signature of Landlord</div>
        <div style="font-size:8px;color:#9ca3af;">(${r.landlordName})</div>
      </div>
    </div>
    <div style="text-align:center;font-size:8px;color:#9ca3af;margin-top:6px;font-style:italic;border-top:1px dashed #e5e7eb;padding-top:4px;">
      This receipt is issued as acknowledgement of rent received for the above mentioned property.
    </div>
  </div>
</div>`
}

export default function ReceiptPreview({ receipts, formData, themeId }: ReceiptPreviewProps) {
  const printRef = useRef<HTMLDivElement>(null)
  const [downloading, setDownloading] = useState(false)
  const theme = getThemeById(themeId)

  const handleDownload = async () => {
    setDownloading(true)

    try {
      const colors = getColors(themeId)
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
      const pageW = 210
      const pageH = 297
      const margin = 10
      const usableW = pageW - margin * 2
      const receiptH = (pageH - margin * 2 - 10) / 3

      // Hidden container for rendering inline-styled receipts
      const container = document.createElement('div')
      container.style.cssText = `position:absolute;left:-9999px;top:0;width:700px;font-family:'DM Sans',system-ui,sans-serif;background:#fff;`
      document.body.appendChild(container)

      for (let i = 0; i < receipts.length; i++) {
        const posOnPage = i % 3
        if (i > 0 && posOnPage === 0) doc.addPage()

        container.innerHTML = buildReceiptHTML(receipts[i], colors)
        const el = container.firstElementChild as HTMLElement

        const canvas = await html2canvas(el, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          logging: false,
        })

        const imgData = canvas.toDataURL('image/png')
        const imgAspect = canvas.width / canvas.height
        let drawW = usableW
        let drawH = drawW / imgAspect
        if (drawH > receiptH) {
          drawH = receiptH
          drawW = drawH * imgAspect
        }

        const y = margin + posOnPage * (receiptH + 5)
        const x = margin + (usableW - drawW) / 2
        doc.addImage(imgData, 'PNG', x, y, drawW, drawH)
      }

      document.body.removeChild(container)

      const tenantSlug = formData.tenantName.replace(/\s+/g, '_').replace(/[^\w-]/g, '')
      const fromLabel = formatMonthLabel(formData.fromMonth)
      const toLabel = formatMonthLabel(formData.toMonth)
      doc.save(`Rent_Receipts_${tenantSlug}_${fromLabel}_to_${toLabel}.pdf`)
    } catch (err) {
      console.error('PDF generation failed:', err)
      alert('PDF generation failed. Please try the Print button and select "Save as PDF".')
    } finally {
      setDownloading(false)
    }
  }

  const handlePrint = () => {
    const printWindow = window.open('', '_blank')
    if (!printWindow) {
      alert('Pop-up blocked. Please allow pop-ups for this site to print receipts.')
      return
    }

    const colors = getColors(themeId)
    const receiptHTML = receipts.map(r => buildReceiptHTML(r, colors)).join('')

    printWindow.document.write(`<!DOCTYPE html>
<html><head><title>Rent Receipts</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', system-ui, -apple-system, sans-serif; padding: 0; }
  @page { size: A4; margin: 6mm 8mm; }
  .receipt { break-inside: avoid; page-break-inside: avoid; margin-bottom: 4px; }
</style>
</head><body>${receiptHTML}</body></html>`)
    printWindow.document.close()
    printWindow.focus()
    setTimeout(() => {
      printWindow.print()
      printWindow.close()
    }, 500)
  }

  return (
    <div id="receipt-preview">
      <div className="no-print flex flex-wrap items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-primary">
            Receipt Preview
          </h2>
          <p className="text-sm text-text-secondary mt-1">
            {receipts.length} {receipts.length === 1 ? 'receipt' : 'receipts'} generated — review below, then download or print
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2.5 border border-border rounded-lg text-sm font-medium text-text-primary hover:bg-bg-light transition-colors cursor-pointer bg-white"
          >
            <Printer size={16} />
            Print
          </button>
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex items-center gap-2 px-5 py-2.5 bg-accent hover:bg-accent-dark text-white rounded-lg text-sm font-medium transition-colors cursor-pointer border-none shadow-sm disabled:opacity-60"
          >
            {downloading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
            {downloading ? 'Generating...' : 'Download PDF'}
          </button>
        </div>
      </div>

      <div ref={printRef} id="print-area" className="space-y-6">
        {receipts.map((receipt, index) => (
          <ReceiptCard key={index} receipt={receipt} theme={theme} />
        ))}
      </div>

      <div className="no-print flex flex-wrap gap-3 justify-center mt-10">
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="flex items-center gap-2 px-8 py-3.5 bg-accent hover:bg-accent-dark text-white rounded-lg font-semibold transition-colors cursor-pointer border-none shadow-md text-base disabled:opacity-60"
        >
          {downloading ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
          {downloading ? 'Generating PDF...' : 'Download PDF'}
        </button>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-8 py-3.5 border border-border rounded-lg font-semibold text-text-primary hover:bg-bg-light transition-colors cursor-pointer bg-white text-base"
        >
          <Printer size={18} />
          Print Receipts
        </button>
      </div>
    </div>
  )
}

function ReceiptCard({ receipt, theme }: { receipt: ReceiptData; theme: ReceiptTheme }) {
  return (
    <div className="receipt-card bg-white border border-gray-300 rounded shadow-md overflow-hidden">
      {/* Header Band */}
      <div className={`${theme.headerBg} px-6 py-3 flex items-center justify-between`}>
        <h3 className={`${theme.headerText} font-bold text-sm uppercase tracking-widest`}>
          Rent Receipt
        </h3>
        <span className={`${theme.headerSubtext} text-xs font-medium tracking-wide`}>
          No. {receipt.receiptNumber}
        </span>
      </div>

      <div className="p-6">
        {/* Meta Row */}
        <div className="flex flex-wrap justify-between text-sm text-text-secondary mb-5 pb-4 border-b border-gray-200">
          <div className="flex gap-6">
            <span>
              <span className="text-xs uppercase tracking-wide text-gray-400 block">Date</span>
              <span className="font-medium text-text-primary">{receipt.date}</span>
            </span>
            <span>
              <span className="text-xs uppercase tracking-wide text-gray-400 block">Period</span>
              <span className="font-medium text-text-primary">{receipt.monthYear}</span>
            </span>
          </div>
          <div>
            <span className="text-xs uppercase tracking-wide text-gray-400 block">Payment Mode</span>
            <span className="font-medium text-text-primary">{receipt.paymentMode}</span>
          </div>
        </div>

        {/* Amount Highlight */}
        <div className={`${theme.amountBg} border ${theme.amountBorder} rounded-lg px-5 py-4 mb-5`}>
          <div className="flex items-baseline gap-2 mb-1">
            <span className={`text-xs uppercase tracking-wide ${theme.amountLabel} font-semibold`}>Amount Received</span>
          </div>
          <div className={`text-2xl font-bold ${theme.amountText}`}>
            ₹{formatIndianNumber(receipt.rentAmount)}/-
          </div>
          <div className={`text-xs ${theme.amountWords} mt-1 italic`}>
            {receipt.rentAmountWords}
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          <div className="space-y-3">
            <div>
              <span className="text-xs uppercase tracking-wide text-gray-400 block mb-0.5">Received From (Tenant)</span>
              <span className="font-semibold text-text-primary">{receipt.tenantName}</span>
              {receipt.tenantPAN && (
                <span className="text-xs text-text-secondary ml-2 bg-gray-100 px-2 py-0.5 rounded">
                  PAN: {receipt.tenantPAN}
                </span>
              )}
            </div>
            <div>
              <span className="text-xs uppercase tracking-wide text-gray-400 block mb-0.5">Property Address</span>
              <span className="text-sm text-text-secondary leading-relaxed">{receipt.propertyAddress}</span>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <span className="text-xs uppercase tracking-wide text-gray-400 block mb-0.5">Received By (Landlord)</span>
              <span className="font-semibold text-text-primary">{receipt.landlordName}</span>
              {receipt.landlordPAN && (
                <span className="text-xs text-text-secondary ml-2 bg-gray-100 px-2 py-0.5 rounded">
                  PAN: {receipt.landlordPAN}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Footer: Signature + Revenue Stamp */}
        <div className="border-t border-gray-200 pt-5 mt-5">
          <div className="flex items-end justify-between">
            {receipt.includeRevenueStamp ? (
              <div className="flex flex-col items-center">
                <div className={`w-20 h-20 border-2 border-dashed ${theme.stampBorder} ${theme.stampBg} rounded flex flex-col items-center justify-center`}>
                  <span className={`${theme.stampText} font-bold text-sm`}>₹1</span>
                  <span className={`text-[9px] ${theme.stampText} uppercase tracking-wider font-medium mt-0.5`}>Revenue</span>
                  <span className={`text-[9px] ${theme.stampText} uppercase tracking-wider font-medium`}>Stamp</span>
                </div>
                <span className="text-[9px] text-gray-400 mt-1">Affix here</span>
              </div>
            ) : (
              <div />
            )}

            <div className="text-center">
              <div className="w-40 border-b-2 border-gray-400 mb-2 h-8"></div>
              <p className="text-xs text-text-secondary font-medium">Signature of Landlord</p>
              <p className="text-[10px] text-gray-400">({receipt.landlordName})</p>
            </div>
          </div>

          <p className="text-center text-xs text-gray-400 mt-4 italic border-t border-dashed border-gray-200 pt-3">
            This receipt is issued as acknowledgement of rent received for the above mentioned property.
          </p>
        </div>
      </div>
    </div>
  )
}
