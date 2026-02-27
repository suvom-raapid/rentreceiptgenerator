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
      <div className="no-print flex flex-wrap items-center justify-between mb-6 gap-4">
        <h2 className="text-xl font-bold text-primary">
          Receipt Preview ({receipts.length} {receipts.length === 1 ? 'receipt' : 'receipts'})
        </h2>
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

      <div className="space-y-4">
        {receipts.map((receipt, index) => (
          <div
            key={index}
            className="bg-white border border-border rounded-lg p-6 shadow-sm print:shadow-none print:border print:rounded-none print:break-inside-avoid"
          >
            <div className="text-center mb-4">
              <h3 className="text-base font-bold text-primary uppercase tracking-wide">
                Rent Receipt
              </h3>
            </div>

            <div className="flex justify-between text-sm mb-3">
              <span>
                <strong>Receipt No:</strong> {receipt.receiptNumber}
              </span>
              <span>
                <strong>Date:</strong> {receipt.date}
              </span>
            </div>

            <div className="text-sm mb-2">
              <strong>Period:</strong> {receipt.monthYear}
            </div>

            <div className="border-t border-dashed border-border pt-3 mt-3 space-y-2 text-sm">
              <p>
                <strong>Received from:</strong> {receipt.tenantName}
                {receipt.tenantPAN && (
                  <span className="text-text-secondary"> (PAN: {receipt.tenantPAN})</span>
                )}
              </p>
              <p>
                <strong>Amount:</strong>{' '}
                <span className="text-base font-semibold text-accent-dark">
                  ₹{formatIndianNumber(receipt.rentAmount)}
                </span>
              </p>
              <p className="text-text-secondary italic text-xs">
                {receipt.rentAmountWords}
              </p>
              <p>
                <strong>Towards rent for property at:</strong> {receipt.propertyAddress}
              </p>
              <p>
                <strong>Payment Mode:</strong> {receipt.paymentMode}
              </p>
            </div>

            <div className="flex items-end justify-between mt-6 pt-4 border-t border-dashed border-border">
              <div className="text-sm">
                <p className="font-medium">{receipt.landlordName}</p>
                {receipt.landlordPAN && (
                  <p className="text-xs text-text-secondary">PAN: {receipt.landlordPAN}</p>
                )}
                <p className="text-xs text-text-secondary mt-1">Landlord / Owner</p>
              </div>

              {receipt.includeRevenueStamp && (
                <div className="border-2 border-dashed border-gray-400 w-16 h-16 flex items-center justify-center text-center">
                  <span className="text-[10px] text-gray-500 leading-tight">
                    ₹1<br />Revenue<br />Stamp
                  </span>
                </div>
              )}

              <div className="text-center">
                <div className="w-32 border-t border-gray-400 mb-1"></div>
                <p className="text-xs text-text-secondary">Landlord's Signature</p>
              </div>
            </div>

            <p className="text-xs text-text-secondary text-center mt-3 italic">
              Received with thanks
            </p>
          </div>
        ))}
      </div>

      <div className="no-print flex flex-wrap gap-3 justify-center mt-8">
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-8 py-3 bg-accent hover:bg-accent-dark text-white rounded-lg font-semibold transition-colors cursor-pointer border-none shadow-sm"
        >
          <Download size={18} />
          Download PDF
        </button>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-8 py-3 border border-border rounded-lg font-semibold text-text-primary hover:bg-bg-light transition-colors cursor-pointer bg-white"
        >
          <Printer size={18} />
          Print Receipts
        </button>
      </div>
    </div>
  )
}
