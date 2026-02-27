import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'
import SEOHead from '../components/SEOHead'

export default function NotFound() {
  return (
    <>
      <SEOHead
        title="Page Not Found | RentReceiptIndia"
        description="The page you're looking for doesn't exist."
        path="/404"
      />

      <div className="max-w-lg mx-auto px-4 py-24 text-center">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <p className="text-xl text-text-primary mb-2">Page Not Found</p>
        <p className="text-text-secondary mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary-light text-white font-semibold px-6 py-3 rounded-lg transition-colors no-underline"
        >
          <Home size={18} />
          Go to Homepage
        </Link>
      </div>
    </>
  )
}
