// src/app/blog/page.tsx
import type { Metadata } from 'next'
export const metadata: Metadata = { title: 'Blog — Seller Tips & News' }

const POSTS = [
  { title: 'How to take great product photos with your phone', cat: 'Seller tips', icon: '📸', date: 'Mar 2025', read: '4 min read', excerpt: 'Good photos are the #1 driver of sales on FindSolace. Here\'s how to shoot professional-looking product images using nothing but your smartphone.' },
  { title: 'Top 10 trending products in Ghana this season', cat: 'Trending', icon: '🔥', date: 'Mar 2025', read: '3 min read', excerpt: 'From solar chargers to Ankara fashion, we break down what buyers across Ghana are searching for right now.' },
  { title: 'A complete guide to shipping your products nationwide', cat: 'Logistics', icon: '🚚', date: 'Feb 2025', read: '6 min read', excerpt: 'Everything you need to know about packaging, courier partnerships, and getting your products to buyers across all 16 regions.' },
  { title: 'SEO tips to get your FindSolace listings found on Google', cat: 'Marketing', icon: '📈', date: 'Feb 2025', read: '5 min read', excerpt: 'Use our built-in AI description generator and these proven SEO tactics to drive organic traffic to your product listings.' },
  { title: 'How Accra sellers are growing with FindSolace', cat: 'Success stories', icon: '⭐', date: 'Jan 2025', read: '7 min read', excerpt: 'Three sellers share how they scaled from GH₵ 500 to GH₵ 20,000 monthly revenue using FindSolace\'s tools and audience.' },
  { title: 'Integrating Mobile Money into your business strategy', cat: 'Payments', icon: '💳', date: 'Jan 2025', read: '4 min read', excerpt: 'MoMo is the payment of choice for 72% of Ghanaian shoppers. Here\'s how to leverage it for faster sales and better trust.' },
]

const catColors: Record<string, string> = {
  'Seller tips': 'badge-blue', 'Trending': 'badge-red', 'Logistics': 'badge-green',
  'Marketing': 'badge-blue', 'Success stories': 'badge-amber', 'Payments': 'badge-green',
}

export default function BlogPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">FindSolace blog</h1>
      <p className="text-gray-500 text-sm mb-8">Tips, guides and stories for Ghanaian sellers and buyers.</p>
      <div className="grid sm:grid-cols-3 gap-6">
        {POSTS.map(post => (
          <article key={post.title} className="card hover:border-blue-300 transition-colors cursor-pointer group">
            <div className="h-28 bg-blue-50 flex items-center justify-center text-5xl group-hover:bg-blue-100 transition-colors">
              {post.icon}
            </div>
            <div className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className={`badge ${catColors[post.cat] ?? 'badge-blue'}`}>{post.cat}</span>
                <span className="text-xs text-gray-400">{post.read}</span>
              </div>
              <h2 className="text-sm font-semibold text-gray-900 mb-2 leading-snug group-hover:text-blue-600 transition-colors">{post.title}</h2>
              <p className="text-xs text-gray-500 leading-relaxed mb-3">{post.excerpt}</p>
              <div className="text-xs text-gray-400">{post.date}</div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
