import { useState } from 'react'
import { Mail, Send } from 'lucide-react'
import SEOHead from '../components/SEOHead'
export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const mailtoLink = `mailto:suvom.iitp@gmail.com?subject=${encodeURIComponent(
      form.subject
    )}&body=${encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`
    )}`
    window.location.href = mailtoLink
  }

  const inputClass =
    'w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition'

  return (
    <>
      <SEOHead
        title="Contact Us | RentReceiptIndia"
        description="Get in touch with the RentReceiptIndia team. Have questions about rent receipts, HRA exemption, or our tool? We'd love to hear from you."
        path="/contact"
      />

      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-primary mb-4">Contact Us</h1>

        <p className="text-text-secondary leading-relaxed mb-6">
          Have a question, suggestion, or feedback about our rent receipt generator? We'd love to
          hear from you. Whether you need help using the tool, have a feature request, or want to
          report an issue, feel free to reach out.
        </p>

        <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-lg px-5 py-4 mb-8">
          <Mail className="text-primary shrink-0" size={20} />
          <div>
            <p className="text-sm font-medium text-text-primary">Email us directly</p>
            <a
              href="mailto:suvom.iitp@gmail.com"
              className="text-primary underline text-sm"
            >
              suvom.iitp@gmail.com
            </a>
          </div>
        </div>

        <div className="bg-white border border-border rounded-xl p-6">
          <h2 className="text-lg font-semibold text-primary mb-4">Send us a message</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Your Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Rahul Sharma"
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Your Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="rahul@example.com"
                  required
                  className={inputClass}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Subject</label>
              <input
                type="text"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                placeholder="e.g., Question about HRA exemption"
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Message</label>
              <textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Your message..."
                rows={5}
                required
                className={inputClass}
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent-dark text-white font-semibold px-6 py-3 rounded-lg transition-colors cursor-pointer border-none"
            >
              <Send size={16} />
              Send Message
            </button>
          </form>
          <p className="text-xs text-text-secondary mt-4">
            This will open your email client. We typically respond within 1-2 business days.
          </p>
        </div>

      </div>
    </>
  )
}
