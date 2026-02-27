import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/blog', label: 'Blog' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { pathname } = useLocation()

  return (
    <header className="no-print sticky top-0 z-40 bg-white border-b border-border shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-primary no-underline">
          RentReceipt<span className="text-accent">India</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm font-medium no-underline transition-colors ${
                pathname === link.to
                  ? 'text-primary'
                  : 'text-text-secondary hover:text-primary'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 text-text-secondary hover:text-primary cursor-pointer bg-transparent border-none"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-border bg-white">
          <nav className="flex flex-col px-4 py-2">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className={`py-3 text-sm font-medium no-underline border-b border-border last:border-b-0 ${
                  pathname === link.to
                    ? 'text-primary'
                    : 'text-text-secondary'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
