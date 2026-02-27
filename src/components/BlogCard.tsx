import { Link } from 'react-router-dom'
import { Calendar, Clock } from 'lucide-react'
import type { BlogPost } from '../lib/blogData'

interface BlogCardProps {
  post: BlogPost
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="block bg-white border border-border rounded-lg p-6 hover:shadow-md transition-shadow no-underline group"
    >
      <div className="flex flex-wrap gap-2 mb-3">
        {post.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="text-xs bg-blue-50 text-primary px-2 py-1 rounded"
          >
            {tag}
          </span>
        ))}
      </div>
      <h3 className="text-lg font-semibold text-text-primary group-hover:text-primary transition-colors mb-2 leading-snug">
        {post.title}
      </h3>
      <p className="text-sm text-text-secondary leading-relaxed mb-4">
        {post.excerpt}
      </p>
      <div className="flex items-center gap-4 text-xs text-text-secondary">
        <span className="flex items-center gap-1">
          <Calendar size={12} />
          {post.publishDate}
        </span>
        <span className="flex items-center gap-1">
          <Clock size={12} />
          {post.readTime}
        </span>
      </div>
    </Link>
  )
}
