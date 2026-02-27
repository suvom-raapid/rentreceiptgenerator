import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const faqs = [
  {
    q: 'What is a rent receipt?',
    a: 'A rent receipt is a written acknowledgement from a landlord confirming that they have received rent payment from a tenant. It serves as proof of rent payment for claiming HRA (House Rent Allowance) exemption under Section 10(13A) of the Income Tax Act.',
  },
  {
    q: 'Why do I need rent receipts?',
    a: 'If you are a salaried employee receiving HRA as part of your salary and your annual rent exceeds ₹1,00,000, you must submit rent receipts to your employer to claim HRA exemption. Even if rent is below ₹1 lakh, it is good practice to maintain receipts for tax records.',
  },
  {
    q: 'Is this tool completely free?',
    a: 'Yes, this tool is 100% free to use. There are no hidden charges, no premium plans, and no signup required. You can generate unlimited rent receipts at no cost.',
  },
  {
    q: 'Is my data safe?',
    a: 'Absolutely. All data processing happens entirely in your browser. Your personal details like name, PAN, address, and rent amount are never sent to any server. Nothing is stored on our end. When you close the browser tab, the data is gone (unless you choose to save it locally for convenience).',
  },
  {
    q: 'What if my annual rent exceeds ₹1 lakh?',
    a: "If your annual rent exceeds ₹1,00,000 (₹1 lakh), you are required to provide your landlord's PAN number to your employer. This is a mandatory requirement under Income Tax rules. Our tool allows you to include the landlord's PAN on the receipt.",
  },
  {
    q: "Do I need my landlord's PAN number?",
    a: "Landlord's PAN is mandatory only if your total annual rent payment exceeds ₹1,00,000. If your annual rent is below this threshold, PAN is optional. However, if the landlord doesn't have a PAN, they can provide a declaration in Form 60.",
  },
  {
    q: 'Is a revenue stamp necessary on rent receipts?',
    a: 'A ₹1 revenue stamp is customarily affixed on rent receipts for cash payments exceeding ₹5,000. It is not required for payments made via bank transfer, UPI, or cheque. While the legal requirement has been debated, it is considered good practice for cash payments.',
  },
  {
    q: 'Can I pay rent to my parents and claim HRA?',
    a: "Yes, you can pay rent to your parents and claim HRA exemption, provided it is a genuine rental arrangement. Your parents must declare the rental income in their ITR. You cannot pay rent to your spouse and claim HRA. Ensure you have a rent agreement and rent receipts as proof.",
  },
  {
    q: 'What format should rent receipts be in?',
    a: 'The Income Tax Department does not mandate a specific format. Rent receipts can be handwritten, printed, or digitally generated. They must include key details: tenant name, landlord name, property address, rent amount, payment date, and period. Revenue stamp (for cash payments above ₹5,000) and landlord signature are recommended.',
  },
  {
    q: 'How many months of receipts can I generate at once?',
    a: 'You can generate receipts for any number of months in a single batch — from 1 month to 12 months or even more. Most employees generate receipts for the full financial year (April to March) at once. Our tool generates one receipt per month for your selected date range.',
  },
]

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="max-w-3xl mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold text-primary text-center mb-8">
        Frequently Asked Questions
      </h2>

      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <div key={i} className="border border-border rounded-lg overflow-hidden">
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full flex items-center justify-between px-5 py-4 text-left bg-white hover:bg-bg-light transition-colors cursor-pointer border-none"
            >
              <span className="font-medium text-text-primary pr-4">{faq.q}</span>
              <ChevronDown
                size={18}
                className={`text-text-secondary shrink-0 transition-transform ${
                  openIndex === i ? 'rotate-180' : ''
                }`}
              />
            </button>
            {openIndex === i && (
              <div className="px-5 pb-4 text-sm text-text-secondary leading-relaxed border-t border-border">
                <p className="mt-3">{faq.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.map((faq) => ({
              '@type': 'Question',
              name: faq.q,
              acceptedAnswer: {
                '@type': 'Answer',
                text: faq.a,
              },
            })),
          }),
        }}
      />
    </section>
  )
}
