import SEOHead from '../components/SEOHead'
export default function PrivacyPolicy() {
  return (
    <>
      <SEOHead
        title="Privacy Policy | RentReceiptIndia"
        description="Privacy Policy for RentReceiptIndia. Learn how we handle your data — no personal data is collected or stored. Everything runs client-side."
        path="/privacy-policy"
      />

      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-primary mb-2">Privacy Policy</h1>
        <p className="text-sm text-text-secondary mb-8">Last updated: January 1, 2025</p>

        <div className="prose prose-slate max-w-none space-y-5 text-text-secondary leading-relaxed">
          <p>
            At <strong>RentReceiptIndia</strong>, we take your privacy extremely seriously. This Privacy
            Policy explains how we handle information when you use our website and rent receipt generator
            tool. Please read this policy carefully to understand our practices.
          </p>

          <h2 className="text-xl font-semibold text-primary mt-8 mb-3">1. Data Collection</h2>
          <p>
            <strong>We do not collect any personal data.</strong> Our rent receipt generator is a
            client-side application, which means all processing happens entirely within your web browser.
            When you enter your name, PAN number, address, rent amount, or any other details into our
            form, that information is processed locally on your device. It is <em>never</em> sent to our
            servers or any third-party server.
          </p>
          <p>
            We do not have a database. We do not have user accounts. We do not require registration or
            login. There is no server-side processing of your personal information whatsoever.
          </p>

          <h2 className="text-xl font-semibold text-primary mt-8 mb-3">2. Local Storage</h2>
          <p>
            Our website may use your browser's <strong>localStorage</strong> feature to save your form
            preferences for convenience. This means if you return to our website, your previously entered
            details (such as tenant name, landlord name, and rent amount) may be pre-filled in the form.
          </p>
          <p>
            This data is stored <strong>entirely on your device</strong> — in your browser's local
            storage. It never leaves your device and is not accessible to us or anyone else. You can
            clear this saved data at any time by clicking the "Clear Saved Data" button on the form,
            or by clearing your browser's local storage/cache.
          </p>

          <h2 className="text-xl font-semibold text-primary mt-8 mb-3">3. Cookies</h2>
          <p>
            Our website itself does not set any cookies for tracking purposes. However, third-party
            services integrated into our website may set cookies:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Google AdSense:</strong> We use Google AdSense to display advertisements on our
              website. Google may use cookies and web beacons to serve ads based on your prior visits
              to our website and other websites on the internet. These cookies allow Google and its
              partners to serve ads to you based on your browsing patterns.
            </li>
            <li>
              <strong>Google Analytics:</strong> We may use Google Analytics to understand how visitors
              use our website. Google Analytics uses cookies to collect information about website
              traffic and user behavior in an aggregated, anonymous form. This helps us improve our
              tool and user experience.
            </li>
          </ul>
          <p>
            You can opt out of personalized advertising by visiting{' '}
            <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-primary underline">
              Google's Ads Settings
            </a>. You can also install the{' '}
            <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-primary underline">
              Google Analytics Opt-out Browser Add-on
            </a>{' '}
            to prevent Google Analytics from collecting data about your visits.
          </p>

          <h2 className="text-xl font-semibold text-primary mt-8 mb-3">4. Google AdSense</h2>
          <p>
            We use Google AdSense, a web advertising service provided by Google LLC, to display
            advertisements on our website. Google AdSense uses cookies to serve ads based on your
            prior visits to our website and/or other websites. Google's use of advertising cookies
            enables it and its partners to serve ads to you based on your visit to our website
            and/or other sites on the Internet.
          </p>
          <p>
            Third-party vendors, including Google, use cookies to serve ads based on a user's prior
            visits to our website. Google's use of the DoubleClick cookie enables it and its partners
            to serve ads based on your visit to our sites and/or other sites on the Internet.
          </p>

          <h2 className="text-xl font-semibold text-primary mt-8 mb-3">5. Information We Do NOT Collect</h2>
          <p>To be absolutely clear, we do <strong>NOT</strong> collect:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Your name, PAN number, or any personal identification details</li>
            <li>Your landlord's name, PAN number, or address</li>
            <li>Your rent amount or payment details</li>
            <li>The content of your generated rent receipts</li>
            <li>Your email address (unless you voluntarily contact us)</li>
            <li>Your phone number</li>
            <li>Your location (other than anonymous, aggregated analytics data)</li>
          </ul>

          <h2 className="text-xl font-semibold text-primary mt-8 mb-3">6. PDF Generation</h2>
          <p>
            The rent receipt PDFs are generated entirely within your browser using a client-side
            JavaScript library (jsPDF). The PDF is created on your device and downloaded directly
            to your computer or phone. At no point is the PDF or its contents sent to any server.
          </p>

          <h2 className="text-xl font-semibold text-primary mt-8 mb-3">7. Third-Party Links</h2>
          <p>
            Our website may contain links to other websites that are not operated by us. If you click
            on a third-party link, you will be directed to that third party's site. We strongly advise
            you to review the Privacy Policy of every site you visit. We have no control over and
            assume no responsibility for the content, privacy policies, or practices of any third-party
            sites or services.
          </p>

          <h2 className="text-xl font-semibold text-primary mt-8 mb-3">8. Children's Privacy</h2>
          <p>
            Our website is not directed at children under the age of 13. We do not knowingly collect
            personal information from children under 13. If you are a parent or guardian and believe
            that your child has provided us with personal information, please contact us so that we
            can take appropriate action.
          </p>

          <h2 className="text-xl font-semibold text-primary mt-8 mb-3">9. Data Security</h2>
          <p>
            Since we do not collect or store any personal data on our servers, there is no risk of
            data breaches from our end. Your data remains on your device at all times. However, we
            recommend that you take standard precautions to protect your device, such as keeping your
            browser and operating system updated.
          </p>

          <h2 className="text-xl font-semibold text-primary mt-8 mb-3">10. Changes to This Privacy Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by
            posting the new Privacy Policy on this page and updating the "Last updated" date at the
            top. You are advised to review this Privacy Policy periodically for any changes.
          </p>

          <h2 className="text-xl font-semibold text-primary mt-8 mb-3">11. Contact Us</h2>
          <p>
            If you have any questions or concerns about this Privacy Policy, please contact us at:
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
