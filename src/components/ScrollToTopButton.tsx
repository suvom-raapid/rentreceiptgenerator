import { useState, useEffect } from 'react'
import { ArrowUp } from 'lucide-react'

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!visible) return null

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="no-print fixed bottom-6 right-6 z-50 bg-primary text-white p-3 rounded-full shadow-lg hover:bg-primary-light transition-colors cursor-pointer"
      aria-label="Scroll to top"
    >
      <ArrowUp size={20} />
    </button>
  )
}
