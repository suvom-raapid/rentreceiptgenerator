import { useEffect } from 'react'

interface SEOHeadProps {
  title: string
  description: string
  path?: string
  type?: string
}

const BASE_URL = 'https://rentreceiptindia.com'

export default function SEOHead({ title, description, path = '', type = 'website' }: SEOHeadProps) {
  useEffect(() => {
    document.title = title

    const setMeta = (name: string, content: string, isProperty = false) => {
      const attr = isProperty ? 'property' : 'name'
      let el = document.querySelector(`meta[${attr}="${name}"]`)
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute(attr, name)
        document.head.appendChild(el)
      }
      el.setAttribute('content', content)
    }

    setMeta('description', description)
    setMeta('og:title', title, true)
    setMeta('og:description', description, true)
    setMeta('og:url', `${BASE_URL}/#${path}`, true)
    setMeta('og:type', type, true)
    setMeta('twitter:title', title)
    setMeta('twitter:description', description)
  }, [title, description, path, type])

  return null
}
