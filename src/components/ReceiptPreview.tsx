import { Download, Printer } from 'lucide-react'
import type { ReceiptData, FormData } from '../lib/generatePDF'
import { downloadPDF } from '../lib/generatePDF'

interface ReceiptPreviewProps {
  receipts: ReceiptData[]
  formData: FormData
}

function formatIndianNumber(num: number): string {
  return num.toLocaleString('en-IN')
}

export default function ReceiptPreview({ receipts, formData }: ReceiptPreviewProps) {
  const handleDownload = () => {
    downloadPDF(receipts, formData)
  }

  const handlePrint = () => {
    window.print()
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
            className="flex items-center gap-2 px-5 py-2.5 bg-accent hover:bg-accent-dark text-white rounded-lg text-sm font-medium transition-colors cursor-pointer border-none shadow-sm"
          >
            <Download size={16} />
            Download PDF
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {receipts.map((receipt, index) => (
          <div
            key={index}
            className="bg-white border border-gray-300 rounded shadow-md print:shadow-none print:rounded-none print:break-inside-avoid"
          >
            {/* Receipt Header Band */}
            <div className="bg-primary px-6 py-3 rounded-t flex items-center justify-between print:bg-gray-800">
              <h3 className="text-white font-bold text-sm uppercase tracking-widest">
                Rent Receipt
              </h3>
              <span className="text-blue-200 text-xs font-medium tracking-wide">
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
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg px-5 py-4 mb-5">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-xs uppercase tracking-wide text-green-600 font-semibold">Amount Received</span>
                </div>
                <div className="text-2xl font-bold text-green-700">
                  ₹{formatIndianNumber(receipt.rentAmount)}/-
                </div>
                <div className="text-xs text-green-600 mt-1 italic">
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
                  {/* Revenue Stamp (left) */}
                  {receipt.includeRevenueStamp ? (
                    <div className="flex flex-col items-center">
                      <div className="w-20 h-20 border-2 border-dashed border-amber-400 bg-amber-50 rounded flex flex-col items-center justify-center">
                        <span className="text-amber-600 font-bold text-sm">₹1</span>
                        <span className="text-[9px] text-amber-500 uppercase tracking-wider font-medium mt-0.5">Revenue</span>
                        <span className="text-[9px] text-amber-500 uppercase tracking-wider font-medium">Stamp</span>
                      </div>
                      <span className="text-[9px] text-gray-400 mt-1">Affix here</span>
                    </div>
                  ) : (
                    <div />
                  )}

                  {/* Signature (right) */}
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
        ))}
      </div>

      <div className="no-print flex flex-wrap gap-3 justify-center mt-10">
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-8 py-3.5 bg-accent hover:bg-accent-dark text-white rounded-lg font-semibold transition-colors cursor-pointer border-none shadow-md text-base"
        >
          <Download size={18} />
          Download PDF
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
