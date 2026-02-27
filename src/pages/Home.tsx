import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FileText, Shield, Download, Zap, ArrowRight } from 'lucide-react'
import SEOHead from '../components/SEOHead'
import RentReceiptForm from '../components/RentReceiptForm'
import ReceiptPreview from '../components/ReceiptPreview'
import FAQSection from '../components/FAQSection'
import AdPlaceholder from '../components/AdPlaceholder'
import BlogCard from '../components/BlogCard'
import ScrollToTopButton from '../components/ScrollToTopButton'
import { generateReceipts } from '../lib/generatePDF'
import type { FormData, ReceiptData } from '../lib/generatePDF'
import { blogPosts } from '../lib/blogData'

function getReceiptCount(): string {
  const count = parseInt(localStorage.getItem('receiptCount') || '14500', 10)
  return count.toLocaleString('en-IN')
}

export default function Home() {
  const [receipts, setReceipts] = useState<ReceiptData[] | null>(null)
  const [formData, setFormData] = useState<FormData | null>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLDivElement>(null)
  const [receiptCount, setReceiptCount] = useState(getReceiptCount)

  useEffect(() => {
    setReceiptCount(getReceiptCount())
  }, [receipts])

  const handlePreview = (data: FormData) => {
    const generated = generateReceipts(data)
    setReceipts(generated)
    setFormData(data)
    setTimeout(() => {
      previewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      <SEOHead
        title="Free Rent Receipt Generator India | HRA Exemption | RentReceiptIndia"
        description="Generate free rent receipts for HRA tax exemption under Section 10(13A). No login required. Instant PDF download. 100% free for salaried employees in India."
        path="/"
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'RentReceiptIndia - Free Rent Receipt Generator',
            description: 'Generate free rent receipts for HRA tax exemption in India',
            url: 'https://suvomdas.github.io/rentreceiptgenerator/',
            applicationCategory: 'FinanceApplication',
            operatingSystem: 'Any',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'INR',
            },
          }),
        }}
      />

      {/* Hero */}
      <section className="bg-gradient-to-b from-primary to-primary-light text-white py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4">
            Free Rent Receipt Generator<br />
            for HRA Exemption
          </h1>
          <p className="text-lg md:text-xl text-blue-100 mb-6 max-w-2xl mx-auto">
            Generate professional rent receipts for income tax HRA exemption under Section 10(13A).
            No login, no fees, instant PDF download.
          </p>
          <button
            onClick={scrollToForm}
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent-light text-white font-semibold px-8 py-3.5 rounded-lg text-lg transition-colors cursor-pointer border-none shadow-lg"
          >
            Generate Receipts Now
            <ArrowRight size={20} />
          </button>
          <p className="mt-6 text-sm text-blue-200">
            {receiptCount}+ Rent Receipts Generated
          </p>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-8 border-b border-border">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Shield, text: 'No Login Required' },
              { icon: Zap, text: '100% Free' },
              { icon: Shield, text: 'Data Never Leaves Your Browser' },
              { icon: Download, text: 'Instant PDF Download' },
            ].map((badge, i) => (
              <div key={i} className="flex flex-col items-center text-center p-3">
                <badge.icon size={24} className="text-accent mb-2" />
                <span className="text-sm font-medium text-text-primary">{badge.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 bg-bg-light">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-primary text-center mb-8">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: '1',
                title: 'Fill Details',
                desc: 'Enter tenant, landlord, and rent details in the simple form below.',
              },
              {
                step: '2',
                title: 'Preview Receipts',
                desc: 'Review generated receipts on screen before downloading.',
              },
              {
                step: '3',
                title: 'Download PDF',
                desc: 'Download professional A4 PDF with 3 receipts per page. Print-ready!',
              },
            ].map((item) => (
              <div
                key={item.step}
                className="bg-white rounded-xl p-6 text-center border border-border"
              >
                <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-3">
                  {item.step}
                </div>
                <h3 className="font-semibold text-text-primary mb-2">{item.title}</h3>
                <p className="text-sm text-text-secondary">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <AdPlaceholder slot="home-top" className="max-w-4xl mx-auto" />

      {/* Receipt Form */}
      <section className="py-12" ref={formRef} id="generator">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-primary text-center mb-2">
            Rent Receipt Generator
          </h2>
          <p className="text-text-secondary text-center mb-8 text-sm">
            Fill in the details below to generate your rent receipts
          </p>
          <RentReceiptForm onPreview={handlePreview} />
        </div>
      </section>

      <AdPlaceholder slot="home-mid" className="max-w-4xl mx-auto" />

      {/* Receipt Preview */}
      {receipts && formData && (
        <section className="py-12 bg-bg-light" ref={previewRef}>
          <div className="max-w-4xl mx-auto px-4">
            <ReceiptPreview receipts={receipts} formData={formData} />
          </div>
        </section>
      )}

      {/* FAQ */}
      <FAQSection />

      {/* Blog Section */}
      <section className="py-12 bg-bg-light">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-primary text-center mb-8">
            Latest Tax & HRA Guides
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogPosts.slice(0, 3).map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-primary font-medium hover:text-primary-light no-underline"
            >
              View All Articles
              <FileText size={16} />
            </Link>
          </div>
        </div>
      </section>

      <AdPlaceholder slot="home-bottom" className="max-w-4xl mx-auto" />

      <ScrollToTopButton />
    </>
  )
}
