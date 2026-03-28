// src/app/page.tsx
import Link from 'next/link'
import { db } from '@/lib/db'
import { ProductCard } from '@/components/product/ProductCard'

export default async function HomePage() {
  const [products, categories, sponsored] = await Promise.all([
    db.product.findMany({
      where:   { status: 'ACTIVE' },
      include: { seller: { select: { shopName: true } }, category: true },
      orderBy: { createdAt: 'desc' },
      take:    8,
    }),
    db.category.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
    db.sponsoredContent.findMany({
      where:   { status: 'LIVE' },
      include: { seller: { select: { shopName: true } } },
      take:    3,
    }),
  ])

  const featured   = products.filter(p => p.isSponsored).slice(0, 4)
  const recent     = products.filter(p => !p.isSponsored).slice(0, 4)

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="bg-blue-600 text-white px-4 py-14 sm:py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 leading-tight">
            Find what you need, close to home
          </h1>
          <p className="text-blue-100 text-base sm:text-lg mb-8 max-w-xl mx-auto">
            Shop from local sellers across Ghana — electronics, fashion, food & more. Fast delivery, Mobile Money accepted.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/products" className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium text-sm hover:bg-blue-50 transition-colors">
              Browse products
            </Link>
            <Link href="/login?tab=signup" className="border border-white text-white px-6 py-3 rounded-lg font-medium text-sm hover:bg-blue-500 transition-colors">
              Start selling free
            </Link>
          </div>
        </div>
      </section>

      {/* ── Trust badges ─────────────────────────────────────────────── */}
      <section className="bg-blue-50 border-b border-blue-100 py-4 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-3 gap-4 text-center">
          {[
            { icon: '🛡️', label: 'Buyer protection', sub: 'Safe payments & refunds' },
            { icon: '🚚', label: 'Nationwide delivery', sub: 'Accra, Kumasi & more' },
            { icon: '💳', label: 'Mobile Money', sub: 'MTN MoMo & Vodafone Cash' },
          ].map(t => (
            <div key={t.label}>
              <div className="text-2xl mb-1">{t.icon}</div>
              <div className="text-xs font-medium text-blue-900">{t.label}</div>
              <div className="text-xs text-blue-500 hidden sm:block">{t.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Categories ───────────────────────────────────────────────── */}
      <section className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-7xl mx-auto flex gap-3 overflow-x-auto pb-1">
          <Link href="/products" className="flex flex-col items-center gap-1 min-w-[64px] p-2 rounded-lg hover:bg-blue-50 border border-transparent hover:border-blue-200 transition-colors">
            <span className="text-xl">🛒</span>
            <span className="text-xs text-gray-600 whitespace-nowrap">All</span>
          </Link>
          {categories.map(cat => (
            <Link key={cat.id} href={`/products?category=${cat.slug}`} className="flex flex-col items-center gap-1 min-w-[64px] p-2 rounded-lg hover:bg-blue-50 border border-transparent hover:border-blue-200 transition-colors">
              <span className="text-xl">{cat.iconUrl}</span>
              <span className="text-xs text-gray-600 whitespace-nowrap">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">

        {/* ── Featured / sponsored products ────────────────────────── */}
        {featured.length > 0 && (
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Featured products</h2>
              <Link href="/products?sponsored=true" className="text-sm text-blue-600 hover:underline">See all</Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {featured.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}

        {/* ── Sponsored content ────────────────────────────────────── */}
        {sponsored.length > 0 && (
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Sponsored content</h2>
              <Link href="/blog" className="text-sm text-blue-600 hover:underline">View blog</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {sponsored.map(s => (
                <div key={s.id} className="card hover:border-blue-300 transition-colors cursor-pointer">
                  <div className="h-24 bg-blue-50 flex items-center justify-center text-4xl">📰</div>
                  <div className="p-4">
                    <span className="badge badge-amber mb-2">Sponsored</span>
                    <h3 className="text-sm font-medium text-gray-900 mb-1">{s.title}</h3>
                    <p className="text-xs text-gray-500">by {s.seller.shopName}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── New arrivals ─────────────────────────────────────────── */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">New arrivals</h2>
            <Link href="/products" className="text-sm text-blue-600 hover:underline">See all</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {(recent.length > 0 ? recent : products.slice(0, 4)).map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>

        {/* ── Sell CTA ─────────────────────────────────────────────── */}
        <section className="bg-blue-600 rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-3">Ready to start selling?</h2>
          <p className="text-blue-100 mb-6 max-w-md mx-auto text-sm">
            Join 1,200+ sellers on FindSolace. Free to list, weekly payouts to your MoMo wallet.
          </p>
          <Link href="/login?tab=signup" className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium text-sm hover:bg-blue-50 transition-colors inline-block">
            Create seller account — it's free
          </Link>
        </section>

      </div>
    </>
  )
}
