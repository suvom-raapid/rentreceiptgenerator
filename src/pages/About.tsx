import SEOHead from '../components/SEOHead'
import AdPlaceholder from '../components/AdPlaceholder'

export default function About() {
  return (
    <>
      <SEOHead
        title="About Us | RentReceiptIndia - Free Rent Receipt Generator"
        description="Learn about RentReceiptIndia, a free online tool to generate rent receipts for HRA tax exemption. No signup, no fees, no data collection."
        path="/about"
      />

      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-primary mb-6">About RentReceiptIndia</h1>

        <div className="prose prose-slate max-w-none space-y-5 text-text-secondary leading-relaxed">
          <p>
            <strong>RentReceiptIndia</strong> is a free, no-signup-required online tool designed to help
            millions of salaried employees across India generate professional rent receipts for claiming
            <strong> HRA (House Rent Allowance) exemption</strong> under Section 10(13A) of the Income Tax Act.
          </p>

          <h2 className="text-xl font-semibold text-primary mt-8 mb-3">What This Tool Does</h2>
          <p>
            Our rent receipt generator allows you to create clean, professional, print-ready rent receipts
            in just a few clicks. Simply enter your tenant details, landlord information, property address,
            and rent amount — and the tool generates individual receipts for each month in your selected
            date range. You can preview receipts on screen, download them as a PDF file, or print them
            directly from your browser.
          </p>

          <h2 className="text-xl font-semibold text-primary mt-8 mb-3">Who Is This For?</h2>
          <p>
            This tool is built specifically for <strong>salaried employees in India</strong> who receive
            HRA as part of their salary and need to submit rent receipts to their employer for tax exemption.
            Whether you live in a metro city like Mumbai, Delhi, Bangalore, or Chennai, or in a tier-2 or
            tier-3 city — if you pay rent and want to claim HRA, this tool is for you.
          </p>

          <h2 className="text-xl font-semibold text-primary mt-8 mb-3">Why We Built This</h2>
          <p>
            We built this tool out of frustration. Every year, millions of employees in India go through
            the tedious process of creating rent receipts for their employers. The existing options were
            far from ideal — some required unnecessary signups, others were slow and cluttered with ads,
            and many looked unprofessional or outright sketchy. We wanted something better: a tool that
            is genuinely free, fast, clean, and trustworthy.
          </p>

          <h2 className="text-xl font-semibold text-primary mt-8 mb-3">Our Privacy Commitment</h2>
          <p>
            Your privacy is our top priority. <strong>We do not collect, store, or transmit any of your
            personal data</strong>. Everything — your name, PAN number, rent details, and generated receipts —
            is processed entirely within your browser. No data ever leaves your device. We don't have a
            database, we don't have user accounts, and we don't track what you enter in the form.
          </p>
          <p>
            The only data we store is a cookie-based counter of total receipts generated (for our
            homepage badge) and your form preferences in your browser's local storage (so you don't have
            to re-enter details next time). Both of these are stored on <em>your</em> device, not on our servers.
          </p>

          <h2 className="text-xl font-semibold text-primary mt-8 mb-3">Our Mission</h2>
          <p>
            We believe essential financial tools should be accessible to everyone, regardless of their
            technical expertise or willingness to pay. Our mission is to simplify the rent receipt
            generation process for every salaried Indian, saving them time and effort during tax season.
          </p>
          <p>
            If this tool helped you, consider sharing it with your colleagues and friends. That's the
            best way to support us and help more people discover this free resource.
          </p>

          <h2 className="text-xl font-semibold text-primary mt-8 mb-3">Disclaimer</h2>
          <p>
            This tool is provided for informational purposes only. It is not a substitute for
            professional tax or legal advice. Always consult a qualified Chartered Accountant or tax
            professional for advice specific to your financial situation. Generating fraudulent rent
            receipts is a punishable offense under Indian law.
          </p>
        </div>

        <AdPlaceholder slot="about-bottom" className="mt-8" />
      </div>
    </>
  )
}
