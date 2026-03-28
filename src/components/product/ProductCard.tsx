'use client'
// src/components/product/ProductCard.tsx

import Link from 'next/link'
import Image from 'next/image'
import { useCartStore } from '@/lib/store'
import toast from 'react-hot-toast'

interface Product {
  id:          string
  title:       string
  slug:        string
  price:       number
  comparePrice: number | null
  images:      any
  isSponsored: boolean
  seller:      { shopName: string }
  reviews?:    { rating: number }[]
}

export function ProductCard({ product: p }: { product: Product }) {
  const addItem = useCartStore(s => s.addItem)
  const images  = Array.isArray(p.images) ? p.images : []
  const img     = images[0]?.thumbnail ?? images[0]?.url ?? null
  const disc    = p.comparePrice ? Math.round(((p.comparePrice - p.price) / p.comparePrice) * 100) : 0
  const avgRating = p.reviews?.length
    ? (p.reviews.reduce((s, r) => s + r.rating, 0) / p.reviews.length).toFixed(1)
    : null

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault()
    addItem({
      id:       p.id,
      title:    p.title,
      price:    p.price,
      image:    img ?? '',
      seller:   p.seller.shopName,
      sellerId: (p as any).sellerId ?? '',
      stock:    (p as any).stockQty ?? 99,
    })
    toast.success(`${p.title} added to cart`)
  }

  return (
    <Link href={`/products/${p.slug}`} className="card group hover:border-blue-300 transition-colors">
      {/* Image */}
      <div className="relative h-40 bg-blue-50 overflow-hidden">
        {img ? (
          <Image src={img} alt={p.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl bg-blue-50">🛍️</div>
        )}
        {p.isSponsored && (
          <span className="absolute top-2 left-2 badge badge-amber text-xs">Sponsored</span>
        )}
        {disc > 0 && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded font-medium">-{disc}%</span>
        )}
      </div>

      {/* Body */}
      <div className="p-3">
        <h3 className="text-sm font-medium text-gray-900 truncate mb-1">{p.title}</h3>
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-base font-semibold text-blue-600">
            GH₵ {p.price.toLocaleString('en-GH', { minimumFractionDigits: 2 })}
          </span>
          {p.comparePrice && (
            <span className="text-xs text-gray-400 line-through">
              GH₵ {p.comparePrice.toLocaleString('en-GH', { minimumFractionDigits: 2 })}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400 truncate">{p.seller.shopName}</span>
          {avgRating && <span className="text-xs text-amber-500">★ {avgRating}</span>}
        </div>
      </div>

      {/* Add to cart */}
      <div className="px-3 pb-3">
        <button
          onClick={handleAddToCart}
          className="w-full btn-primary text-xs py-2"
        >
          Add to cart
        </button>
      </div>
    </Link>
  )
}
