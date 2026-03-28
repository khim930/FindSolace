// src/app/products/[slug]/page.tsx
import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { AddToCartButton } from '@/components/product/AddToCartButton'
import { ProductCard } from '@/components/product/ProductCard'
import Image from 'next/image'
import type { Metadata } from 'next'

interface Props { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await db.product.findUnique({ where: { slug: params.slug } })
  if (!product) return {}
  return {
    title:       product.metaTitle ?? product.title,
    description: product.description.slice(0, 160),
    keywords:    product.metaTags,
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const product = await db.product.findUnique({
    where:   { slug: params.slug },
    include: {
      seller:   { include: { user: { select: { createdAt: true } } } },
      category: true,
      reviews:  { include: { user: { select: { fullName: true } } }, orderBy: { createdAt: 'desc' }, take: 10 },
    },
  })

  if (!product) notFound()

  // Increment view count
  await db.product.update({ where: { id: product.id }, data: { views: { increment: 1 } } })

  const related = await db.product.findMany({
    where:   { categoryId: product.categoryId, status: 'ACTIVE', id: { not: product.id } },
    include: { seller: { select: { shopName: true } }, reviews: { select: { rating: true } } },
    take:    4,
  })

  const images    = Array.isArray(product.images) ? (product.images as any[]) : []
  const mainImage = images[0]?.url ?? null
  const discount  = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0
  const avgRating = product.reviews.length
    ? product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length
    : null

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      {/* Breadcrumb */}
      <nav className="text-xs text-gray-400 mb-6 flex gap-2">
        <a href="/" className="hover:text-blue-600">Home</a> /
        <a href="/products" className="hover:text-blue-600">Shop</a> /
        <a href={`/products?category=${product.category.slug}`} className="hover:text-blue-600">{product.category.name}</a> /
        <span className="text-gray-600">{product.title}</span>
      </nav>

      <div className="grid sm:grid-cols-2 gap-10 mb-14">

        {/* Images */}
        <div>
          <div className="relative aspect-square bg-blue-50 rounded-2xl overflow-hidden mb-3">
            {mainImage ? (
              <Image src={mainImage} alt={product.title} fill className="object-contain p-4" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-8xl">🛍️</div>
            )}
            {product.isSponsored && (
              <span className="absolute top-3 left-3 badge badge-amber">Sponsored</span>
            )}
            {discount > 0 && (
              <span className="absolute top-3 right-3 bg-red-500 text-white text-sm px-2 py-0.5 rounded-full font-medium">
                -{discount}%
              </span>
            )}
          </div>
          {images.slice(1).length > 0 && (
            <div className="flex gap-2 overflow-x-auto">
              {images.slice(1).map((img: any, i: number) => (
                <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200 shrink-0">
                  <Image src={img.thumbnail ?? img.url} alt={`${product.title} ${i + 2}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          {product.isSponsored && <span className="badge badge-amber mb-3">Sponsored listing</span>}
          <h1 className="text-2xl font-bold text-gray-900 mb-3">{product.title}</h1>

          {/* Rating */}
          {avgRating && (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex text-amber-400">
                {[1,2,3,4,5].map(s => (
                  <span key={s} className={s <= Math.round(avgRating) ? 'text-amber-400' : 'text-gray-300'}>★</span>
                ))}
              </div>
              <span className="text-sm text-gray-500">{avgRating.toFixed(1)} · {product.reviews.length} reviews</span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl font-bold text-blue-600">
              GH₵ {product.price.toLocaleString('en-GH', { minimumFractionDigits: 2 })}
            </span>
            {product.comparePrice && (
              <span className="text-lg text-gray-400 line-through">
                GH₵ {product.comparePrice.toLocaleString('en-GH', { minimumFractionDigits: 2 })}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 leading-relaxed mb-6 whitespace-pre-line">{product.description}</p>

          {/* Stock */}
          <div className={`text-sm font-medium mb-6 ${product.stockQty > 5 ? 'text-green-600' : product.stockQty > 0 ? 'text-amber-600' : 'text-red-600'}`}>
            {product.stockQty > 5 ? `✓ In stock (${product.stockQty} available)` :
             product.stockQty > 0 ? `⚡ Only ${product.stockQty} left!` : '✗ Out of stock'}
          </div>

          {/* Actions */}
          <AddToCartButton product={{
            id:       product.id,
            title:    product.title,
            price:    product.price,
            image:    mainImage ?? '',
            seller:   product.seller.shopName,
            sellerId: product.sellerId,
            stock:    product.stockQty,
          }} />

          {/* Seller info */}
          <div className="mt-6 p-4 bg-blue-50 rounded-xl">
            <div className="text-xs text-gray-500 mb-1">Sold by</div>
            <div className="font-medium text-gray-900">{product.seller.shopName}</div>
            <div className="text-xs text-gray-500 mt-1">
              Member since {new Date(product.seller.user.createdAt).getFullYear()} ·
              {product.seller.status === 'ACTIVE' ? ' ✓ Verified seller' : ''}
            </div>
          </div>

          {/* Delivery info */}
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div className="p-3 border border-gray-200 rounded-lg">
              <div className="font-medium text-gray-900 mb-0.5">🚚 Free delivery</div>
              <div className="text-gray-500 text-xs">Accra: 1–2 days · Other: 3–5 days</div>
            </div>
            <div className="p-3 border border-gray-200 rounded-lg">
              <div className="font-medium text-gray-900 mb-0.5">🔄 Easy returns</div>
              <div className="text-gray-500 text-xs">7-day return policy</div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews */}
      {product.reviews.length > 0 && (
        <section className="mb-14">
          <h2 className="text-lg font-semibold mb-5">Customer reviews ({product.reviews.length})</h2>
          <div className="space-y-4">
            {product.reviews.map(r => (
              <div key={r.id} className="card p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-medium text-blue-700">
                    {r.user.fullName[0].toUpperCase()}
                  </div>
                  <div>
                    <div className="text-sm font-medium">{r.user.fullName}</div>
                    <div className="flex text-amber-400 text-xs">
                      {[1,2,3,4,5].map(s => <span key={s} className={s <= r.rating ? '' : 'text-gray-300'}>★</span>)}
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 ml-auto">{new Date(r.createdAt).toLocaleDateString('en-GH')}</span>
                </div>
                {r.comment && <p className="text-sm text-gray-600">{r.comment}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Related products */}
      {related.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-5">You might also like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {related.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  )
}
