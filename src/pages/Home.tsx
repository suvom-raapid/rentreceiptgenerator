import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FileText, Shield, Download, Zap, ArrowRight, CheckCircle, Lock, Clock } from 'lucide-react'
import SEOHead from '../components/SEOHead'
import RentReceiptForm from '../components/RentReceiptForm'
import ReceiptPreview from '../components/ReceiptPreview'
import FAQSection from '../components/FAQSection'
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
            url: 'https://rentreceiptindia.com/',
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
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-light to-[#234e8e] text-white py-16 md:py-24">
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }} />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <div className="inline-block bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm text-blue-100 mb-6">
            {receiptCount}+ Rent Receipts Generated
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-[3.5rem] font-bold leading-tight mb-5 tracking-tight">
            Free Rent Receipt Generator
            <br />
            <span className="text-accent-light">for HRA Exemption</span>
          </h1>
          <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
            Generate professional rent receipts for income tax HRA exemption under Section 10(13A).
            No login, no fees, instant PDF download.
          </p>
          <button
            onClick={scrollToForm}
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent-light text-white font-semibold px-10 py-4 rounded-xl text-lg transition-all cursor-pointer border-none shadow-xl shadow-accent/30 hover:shadow-accent/40 hover:-translate-y-0.5"
          >
            Generate Receipts Now
            <ArrowRight size={20} />
          </button>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-6 bg-white border-b border-border">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { icon: Lock, text: 'No Login Required', color: 'text-blue-600' },
              { icon: Zap, text: '100% Free Forever', color: 'text-amber-500' },
              { icon: Shield, text: 'Data Never Stored', color: 'text-green-600' },
              { icon: Download, text: 'Instant PDF Download', color: 'text-purple-600' },
            ].map((badge, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-bg-light">
                <badge.icon size={22} className={badge.color} />
                <span className="text-sm font-medium text-text-primary">{badge.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-14 bg-bg-light">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-primary text-center mb-3">
            How It Works
          </h2>
          <p className="text-text-secondary text-center mb-10 max-w-xl mx-auto">
            Generate your rent receipts in three simple steps — takes less than 2 minutes
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            <div className="hidden md:block absolute top-12 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20" />
            {[
              {
                step: '1',
                icon: FileText,
                title: 'Fill Details',
                desc: 'Enter tenant, landlord, and rent details in the form below.',
              },
              {
                step: '2',
                icon: CheckCircle,
                title: 'Preview Receipts',
                desc: 'Review generated receipts on screen before downloading.',
              },
              {
                step: '3',
                icon: Download,
                title: 'Download PDF',
                desc: 'Download A4 PDF with 3 receipts per page — print-ready!',
              },
            ].map((item) => (
              <div
                key={item.step}
                className="relative bg-white rounded-2xl p-7 text-center border border-border shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary-light text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
                  <item.icon size={24} />
                </div>
                <div className="inline-block bg-primary/10 text-primary text-xs font-bold rounded-full px-3 py-1 mb-3">
                  Step {item.step}
                </div>
                <h3 className="font-bold text-text-primary mb-2 text-lg">{item.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Receipt Form */}
      <section className="py-14" ref={formRef} id="generator">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-accent/10 text-accent-dark text-sm font-semibold rounded-full px-4 py-1.5 mb-4">
              <Clock size={14} />
              Takes less than 2 minutes
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-3">
              Rent Receipt Generator
            </h2>
            <p className="text-text-secondary max-w-lg mx-auto">
              Fill in your details below and generate professional rent receipts instantly.
              Your data stays in your browser — we never store it.
            </p>
          </div>
          <RentReceiptForm onPreview={handlePreview} />
        </div>
      </section>

      {/* Receipt Preview */}
      {receipts && formData && (
        <section className="py-14 bg-bg-light" ref={previewRef}>
          <div className="max-w-5xl mx-auto px-4">
            <ReceiptPreview receipts={receipts} formData={formData} />
          </div>
        </section>
      )}

      {/* FAQ */}
      <FAQSection />

      {/* Blog Section */}
      <section className="py-14 bg-bg-light">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-primary text-center mb-3">
            Latest Tax & HRA Guides
          </h2>
          <p className="text-text-secondary text-center mb-10">
            Expert articles to help you understand HRA exemption and save tax
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogPosts.slice(0, 3).map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-primary font-semibold hover:text-primary-light no-underline transition-colors"
            >
              View All Articles
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <ScrollToTopButton />
    </>
  )
}
