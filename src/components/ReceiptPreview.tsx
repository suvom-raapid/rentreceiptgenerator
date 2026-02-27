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

export default function ReceiptPreview({ receipts, formData, themeId }: ReceiptPreviewProps) {
  const printRef = useRef<HTMLDivElement>(null)
  const [downloading, setDownloading] = useState(false)
  const theme = getThemeById(themeId)

  const handleDownload = async () => {
    if (!printRef.current) return
    setDownloading(true)

    try {
      const receiptEls = printRef.current.querySelectorAll<HTMLElement>('.receipt-card')
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
      const pageW = 210
      const pageH = 297
      const margin = 10
      const usableW = pageW - margin * 2
      const receiptH = (pageH - margin * 2 - 10) / 3 // 3 per page with gaps

      for (let i = 0; i < receiptEls.length; i++) {
        const posOnPage = i % 3
        if (i > 0 && posOnPage === 0) doc.addPage()

        const canvas = await html2canvas(receiptEls[i], {
          scale: 2,
          useCORS: true,
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

      const tenantSlug = formData.tenantName.replace(/\s+/g, '_').replace(/[^\w-]/g, '')
      const fromLabel = formatMonthLabel(formData.fromMonth)
      const toLabel = formatMonthLabel(formData.toMonth)
      doc.save(`Rent_Receipts_${tenantSlug}_${fromLabel}_to_${toLabel}.pdf`)
    } catch (err) {
      console.error('PDF generation failed:', err)
    } finally {
      setDownloading(false)
    }
  }

  const handlePrint = () => {
    const printArea = printRef.current
    if (!printArea) return

    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    // Grab all stylesheets from the current page
    const styleSheets = Array.from(document.styleSheets)
    let cssText = ''
    for (const sheet of styleSheets) {
      try {
        const rules = Array.from(sheet.cssRules || [])
        cssText += rules.map((r) => r.cssText).join('\n')
      } catch {
        // cross-origin sheets — skip
      }
    }

    printWindow.document.write(`<!DOCTYPE html>
<html><head><title>Rent Receipts</title>
<style>${cssText}
@media print {
  body { margin: 0; padding: 10px; }
  .receipt-card { break-inside: avoid; page-break-inside: avoid; margin-bottom: 12px; box-shadow: none !important; }
}
</style></head><body>${printArea.innerHTML}</body></html>`)
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
