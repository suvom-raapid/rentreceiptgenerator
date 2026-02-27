import SEOHead from '../components/SEOHead'
import BlogCard from '../components/BlogCard'
import AdPlaceholder from '../components/AdPlaceholder'
import { blogPosts } from '../lib/blogData'

export default function Blog() {
  return (
    <>
      <SEOHead
        title="Blog — HRA, Tax & Rent Receipt Guides | RentReceiptIndia"
        description="Expert guides on HRA exemption, rent receipts, Section 10(13A), income tax tips for salaried employees in India. Free, actionable advice."
        path="/blog"
      />

      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-primary mb-2">Blog</h1>
        <p className="text-text-secondary mb-8">
          Expert guides on HRA exemption, rent receipts, and income tax tips for salaried employees in India.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {blogPosts.slice(0, 4).map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>

        <AdPlaceholder slot="blog-mid" className="my-6" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {blogPosts.slice(4).map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </>
  )
}
