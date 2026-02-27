import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="no-print bg-primary text-white mt-16">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-3">
              RentReceipt<span className="text-accent-light">India</span>
            </h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              Free online rent receipt generator for salaried employees in India.
              Generate professional rent receipts for HRA tax exemption instantly.
              No login required.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm list-none p-0">
              <li><Link to="/" className="text-gray-300 hover:text-white no-underline transition-colors">Home</Link></li>
              <li><Link to="/blog" className="text-gray-300 hover:text-white no-underline transition-colors">Blog</Link></li>
              <li><Link to="/about" className="text-gray-300 hover:text-white no-underline transition-colors">About</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-white no-underline transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Legal</h4>
            <ul className="space-y-2 text-sm list-none p-0">
              <li><Link to="/privacy-policy" className="text-gray-300 hover:text-white no-underline transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-gray-300 hover:text-white no-underline transition-colors">Terms of Service</Link></li>
              <li><Link to="/disclaimer" className="text-gray-300 hover:text-white no-underline transition-colors">Disclaimer</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-600 text-center text-sm text-gray-400">
          <p className="mb-2">&copy; {new Date().getFullYear()} RentReceiptIndia. All rights reserved.</p>
          <p className="text-xs">
            This tool is for informational purposes only. Please consult a tax professional for advice specific to your situation.
          </p>
        </div>
      </div>
    </footer>
  )
}
