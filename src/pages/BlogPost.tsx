import { useParams, Link, Navigate } from 'react-router-dom'
import { ArrowLeft, Calendar, Clock, Share2, Copy, Check } from 'lucide-react'
import { useState, useMemo } from 'react'
import SEOHead from '../components/SEOHead'
import BlogCard from '../components/BlogCard'
import { blogPosts } from '../lib/blogData'

function extractHeadings(html: string): { id: string; text: string }[] {
  const regex = /<h2[^>]*>(.*?)<\/h2>/gi
  const headings: { id: string; text: string }[] = []
  let match
  while ((match = regex.exec(html)) !== null) {
    const text = match[1].replace(/<[^>]*>/g, '')
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
    headings.push({ id, text })
  }
  return headings
}

function addIdsToHeadings(html: string): string {
  return html.replace(/<h2([^>]*)>(.*?)<\/h2>/gi, (_match, attrs, content) => {
    const text = content.replace(/<[^>]*>/g, '')
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
    return `<h2${attrs} id="${id}">${content}</h2>`
  })
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>()
  const post = blogPosts.find((p) => p.slug === slug)
  const [copied, setCopied] = useState(false)

  const headings = useMemo(() => (post ? extractHeadings(post.content) : []), [post])
  const contentWithIds = useMemo(() => (post ? addIdsToHeadings(post.content) : ''), [post])

  if (!post) return <Navigate to="/404" replace />

  const relatedPosts = blogPosts.filter((p) => post.relatedSlugs.includes(p.slug))
  const currentUrl = window.location.href

  const shareWhatsApp = () => {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(`${post.title} — ${currentUrl}`)}`,
      '_blank'
    )
  }

  const shareTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(currentUrl)}`,
      '_blank'
    )
  }

  const shareLinkedIn = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`,
      '_blank'
    )
  }

  const copyLink = async () => {
    await navigator.clipboard.writeText(currentUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <SEOHead
        title={`${post.title} | RentReceiptIndia`}
        description={post.metaDescription}
        path={`/blog/${post.slug}`}
        type="article"
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: post.title,
            description: post.metaDescription,
            datePublished: post.publishDate,
            dateModified: post.publishDate,
            author: {
              '@type': 'Organization',
              name: 'RentReceiptIndia',
            },
          }),
        }}
      />

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-text-secondary mb-6">
          <Link to="/" className="hover:text-primary no-underline">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/blog" className="hover:text-primary no-underline">Blog</Link>
          <span className="mx-2">/</span>
          <span className="text-text-primary">{post.title}</span>
        </nav>

        <Link
          to="/blog"
          className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-primary no-underline mb-6"
        >
          <ArrowLeft size={14} />
          Back to Blog
        </Link>

        <h1 className="text-3xl md:text-4xl font-bold text-primary leading-tight mb-4">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary mb-6">
          <span className="flex items-center gap-1">
            <Calendar size={14} />
            {post.publishDate}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={14} />
            {post.readTime}
          </span>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span key={tag} className="bg-blue-50 text-primary px-2 py-0.5 rounded text-xs">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Table of Contents */}
        {headings.length > 0 && (
          <div className="bg-bg-light border border-border rounded-lg p-5 mb-8">
            <h2 className="text-sm font-semibold text-primary mb-3 uppercase tracking-wide">
              Table of Contents
            </h2>
            <ul className="space-y-1.5 list-none p-0">
              {headings.map((h) => (
                <li key={h.id}>
                  <a
                    href={`#${h.id}`}
                    className="text-sm text-text-secondary hover:text-primary no-underline"
                  >
                    {h.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Article Content */}
        <article
          className="prose prose-slate max-w-none [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-primary [&_h2]:mt-8 [&_h2]:mb-3 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-text-primary [&_h3]:mt-6 [&_h3]:mb-2 [&_p]:text-text-secondary [&_p]:leading-relaxed [&_p]:mb-4 [&_ul]:pl-6 [&_ul]:space-y-1 [&_ol]:pl-6 [&_ol]:space-y-1 [&_li]:text-text-secondary [&_strong]:text-text-primary [&_table]:w-full [&_table]:border-collapse [&_th]:bg-bg-light [&_th]:border [&_th]:border-border [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:text-sm [&_th]:font-semibold [&_td]:border [&_td]:border-border [&_td]:px-3 [&_td]:py-2 [&_td]:text-sm"
          dangerouslySetInnerHTML={{ __html: contentWithIds }}
        />

        {/* CTA */}
        <div className="bg-accent/10 border border-accent/30 rounded-xl p-6 text-center my-8">
          <h3 className="text-lg font-semibold text-primary mb-2">
            Need to generate rent receipts?
          </h3>
          <p className="text-sm text-text-secondary mb-4">
            Use our free tool to generate professional rent receipts for HRA exemption instantly.
          </p>
          <Link
            to="/"
            className="inline-block bg-accent hover:bg-accent-dark text-white font-semibold px-6 py-3 rounded-lg transition-colors no-underline"
          >
            Generate Rent Receipts Free
          </Link>
        </div>

        {/* Share */}
        <div className="border-t border-border pt-6 mb-8">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="flex items-center gap-1 text-sm font-medium text-text-primary">
              <Share2 size={16} />
              Share this article:
            </span>
            <button
              onClick={shareWhatsApp}
              className="px-4 py-2 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors cursor-pointer border-none"
            >
              WhatsApp
            </button>
            <button
              onClick={shareTwitter}
              className="px-4 py-2 bg-sky-500 text-white text-sm rounded-lg hover:bg-sky-600 transition-colors cursor-pointer border-none"
            >
              Twitter / X
            </button>
            <button
              onClick={shareLinkedIn}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors cursor-pointer border-none"
            >
              LinkedIn
            </button>
            <button
              onClick={copyLink}
              className="flex items-center gap-1 px-4 py-2 bg-gray-200 text-text-primary text-sm rounded-lg hover:bg-gray-300 transition-colors cursor-pointer border-none"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-primary mb-4">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {relatedPosts.slice(0, 3).map((rp) => (
                <BlogCard key={rp.slug} post={rp} />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
