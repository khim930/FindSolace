// src/app/products/page.tsx
import { db } from '@/lib/db'
import { ProductCard } from '@/components/product/ProductCard'
import Link from 'next/link'

interface Props {
  searchParams: { q?: string; category?: string; sort?: string; sponsored?: string }
}

export default async function ProductsPage({ searchParams }: Props) {
  const { q, category, sort, sponsored } = searchParams

  const categories = await db.category.findMany({
    where: { isActive: true }, orderBy: { sortOrder: 'asc' },
  })

  const where: any = { status: 'ACTIVE' }
  if (q)         where.title      = { contains: q, mode: 'insensitive' }
  if (category)  where.category   = { slug: category }
  if (sponsored) where.isSponsored = true

  let orderBy: any = { createdAt: 'desc' }
  if (sort === 'price_asc')  orderBy = { price: 'asc' }
  if (sort === 'price_desc') orderBy = { price: 'desc' }
  if (sort === 'popular')    orderBy = { views: 'desc' }

  const products = await db.product.findMany({
    where,
    orderBy,
    include: {
      seller:   { select: { shopName: true } },
      category: true,
      reviews:  { select: { rating: true } },
    },
    take: 48,
  })

  const activeCat = categories.find(c => c.slug === category)

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900 mb-1">
          {q ? `Results for "${q}"` : activeCat ? activeCat.name : 'All products'}
        </h1>
        <p className="text-sm text-gray-500">{products.length} product{products.length !== 1 ? 's' : ''} found</p>
      </div>

      <div className="flex gap-6">

        {/* Sidebar filters */}
        <aside className="hidden sm:block w-48 shrink-0">
          <div className="sticky top-20 space-y-6">
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Categories</h3>
              <div className="space-y-1">
                <Link href="/products" className={`block px-3 py-2 rounded-lg text-sm ${!category ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}>
                  All categories
                </Link>
                {categories.map(cat => (
                  <Link key={cat.id} href={`/products?category=${cat.slug}`} className={`block px-3 py-2 rounded-lg text-sm ${category === cat.slug ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}>
                    {cat.iconUrl} {cat.name}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Sort by</h3>
              <div className="space-y-1">
                {[
                  { label: 'Newest first', value: '' },
                  { label: 'Price: low to high', value: 'price_asc' },
                  { label: 'Price: high to low', value: 'price_desc' },
                  { label: 'Most popular', value: 'popular' },
                ].map(s => (
                  <Link key={s.value} href={`/products?${new URLSearchParams({ ...(category ? { category } : {}), ...(q ? { q } : {}), sort: s.value }).toString()}`}
                    className={`block px-3 py-2 rounded-lg text-sm ${(sort ?? '') === s.value ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}>
                    {s.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Product grid */}
        <main className="flex-1">
          {products.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🔍</div>
              <h2 className="text-lg font-medium text-gray-900 mb-2">No products found</h2>
              <p className="text-gray-500 text-sm mb-6">Try a different search term or browse all categories.</p>
              <Link href="/products" className="btn-primary">Browse all products</Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
