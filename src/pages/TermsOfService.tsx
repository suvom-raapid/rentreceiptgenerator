import SEOHead from '../components/SEOHead'
export default function TermsOfService() {
  return (
    <>
      <SEOHead
        title="Terms of Service | RentReceiptIndia"
        description="Terms of Service for RentReceiptIndia rent receipt generator. Read our terms covering usage, liability, and legal obligations."
        path="/terms"
      />

      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-primary mb-2">Terms of Service</h1>
        <p className="text-sm text-text-secondary mb-8">Last updated: January 1, 2025</p>

        <div className="prose prose-slate max-w-none space-y-5 text-text-secondary leading-relaxed">
          <p>
            Welcome to <strong>RentReceiptIndia</strong>. By accessing or using our website and rent
            receipt generator tool, you agree to be bound by these Terms of Service. If you do not
            agree with any part of these terms, please do not use our website.
          </p>

          <h2 className="text-xl font-semibold text-primary mt-8 mb-3">1. Acceptance of Terms</h2>
          <p>
            By using this website, you confirm that you have read, understood, and agree to be bound
            by these Terms of Service, along with our Privacy Policy and Disclaimer. These terms
            apply to all visitors, users, and others who access or use the website.
          </p>

          <h2 className="text-xl font-semibold text-primary mt-8 mb-3">2. Description of Service</h2>
          <p>
            RentReceiptIndia provides a free, client-side rent receipt generator tool. The tool allows
            users to input their rental details and generate rent receipt documents in PDF format. The
            service is provided "as is" for <strong>informational and convenience purposes only</strong>.
            The tool does not provide tax advice, legal advice, or any professional financial services.
          </p>

          <h2 className="text-xl font-semibold text-primary mt-8 mb-3">3. User Responsibilities</h2>
          <p>By using this tool, you acknowledge and agree that:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              You are solely responsible for the <strong>accuracy and truthfulness</strong> of all
              information entered into the rent receipt generator.
            </li>
            <li>
              The rent receipts generated are templates based on the information you provide. You must
              verify that all details are correct before using them for any purpose.
            </li>
            <li>
              You will use the generated receipts only for <strong>lawful purposes</strong> — specifically,
              for claiming legitimate HRA exemptions for rent you have actually paid.
            </li>
            <li>
              You will not use this tool to generate <strong>fraudulent or false rent receipts</strong>.
            </li>
          </ul>

          <h2 className="text-xl font-semibold text-primary mt-8 mb-3">4. Legal Warning — Fraudulent Receipts</h2>
          <p>
            <strong>Generating fake or fraudulent rent receipts is a serious criminal offense under
            Indian law.</strong> It can attract penalties and prosecution under:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Section 420 of the Indian Penal Code (IPC)</strong> — Cheating and dishonestly
              inducing delivery of property, punishable with imprisonment up to 7 years and fine.
            </li>
            <li>
              <strong>Section 277 of the Income Tax Act</strong> — False statement in verification,
              punishable with rigorous imprisonment up to 7 years and fine.
            </li>
            <li>
              <strong>Section 270A of the Income Tax Act</strong> — Penalty for under-reporting and
              misreporting of income, with penalties ranging from 50% to 200% of the tax payable on
              under-reported income.
            </li>
          </ul>
          <p>
            We strongly condemn the use of this tool for generating false rent receipts and reserve
            the right to cooperate with law enforcement agencies if required.
          </p>

          <h2 className="text-xl font-semibold text-primary mt-8 mb-3">5. Not Professional Advice</h2>
          <p>
            The information provided on this website, including blog posts and the rent receipt
            generator, is for general informational purposes only. It does <strong>not</strong> constitute
            tax advice, legal advice, or professional financial advice. Always consult a qualified
            Chartered Accountant (CA) or tax professional for advice specific to your individual
            financial situation.
          </p>

          <h2 className="text-xl font-semibold text-primary mt-8 mb-3">6. Intellectual Property</h2>
          <p>
            The content, design, code, and all materials on this website are the intellectual property
            of RentReceiptIndia and are protected by applicable copyright and trademark laws. You may
            not reproduce, distribute, or create derivative works from our content without prior
            written consent.
          </p>
          <p>
            The rent receipts generated by you using our tool are your own documents. We claim no
            ownership or rights over the content of your generated receipts.
          </p>

          <h2 className="text-xl font-semibold text-primary mt-8 mb-3">7. Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by law, RentReceiptIndia and its creators shall not be
            liable for any direct, indirect, incidental, special, consequential, or punitive damages
            arising out of or related to your use of this website or tool. This includes, but is not
            limited to:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Errors or inaccuracies in generated rent receipts</li>
            <li>Tax penalties or notices resulting from use of generated receipts</li>
            <li>Loss of data or any damages caused by website downtime</li>
            <li>Any issues arising from third-party services (ads, analytics)</li>
          </ul>

          <h2 className="text-xl font-semibold text-primary mt-8 mb-3">8. Modifications to Service</h2>
          <p>
            We reserve the right to modify, suspend, or discontinue the website or tool at any time
            without prior notice. We shall not be liable to you or any third party for any
            modification, suspension, or discontinuance of the service.
          </p>

          <h2 className="text-xl font-semibold text-primary mt-8 mb-3">9. Governing Law</h2>
          <p>
            These Terms of Service shall be governed by and construed in accordance with the laws of
            <strong> India</strong>. Any disputes arising from these terms shall be subject to the
            exclusive jurisdiction of the courts in India.
          </p>

          <h2 className="text-xl font-semibold text-primary mt-8 mb-3">10. Changes to Terms</h2>
          <p>
            We reserve the right to update or modify these Terms of Service at any time. Changes will
            be effective immediately upon posting on this page. Your continued use of the website
            after any changes constitutes acceptance of the updated terms.
          </p>

          <h2 className="text-xl font-semibold text-primary mt-8 mb-3">11. Contact Us</h2>
          <p>
            If you have any questions about these Terms of Service, please contact us at:
          </p>
          <p>
            <strong>Email:</strong>{' '}
            <a href="mailto:suvom.iitp@gmail.com" className="text-primary underline">
              suvom.iitp@gmail.com
            </a>
          </p>
        </div>

      </div>
    </>
  )
}
