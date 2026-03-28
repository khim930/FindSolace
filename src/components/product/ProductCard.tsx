'use client'
// src/components/product/ProductCard.tsx
import Link from 'next/link'
import Image from 'next/image'
import { useCartStore } from '@/lib/store'
import toast from 'react-hot-toast'

interface Product {
  id: string; title: string; slug: string; price: number
  comparePrice: number | null; images: any; isSponsored: boolean
  seller: { shopName: string }; reviews?: { rating: number }[]
}

export function ProductCard({ product: p }: { product: Product }) {
  const addItem = useCartStore(s => s.addItem)
  const images  = Array.isArray(p.images) ? p.images : []
  const img     = images[0]?.thumbnail ?? images[0]?.url ?? null
  const disc    = p.comparePrice ? Math.round(((p.comparePrice - p.price) / p.comparePrice) * 100) : 0
  const avgRating = p.reviews?.length
    ? (p.reviews.reduce((s, r) => s + r.rating, 0) / p.reviews.length).toFixed(1)
    : null

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault()
    addItem({
      id: p.id, title: p.title, price: p.price, image: img ?? '',
      seller: p.seller.shopName, sellerId: (p as any).sellerId ?? '',
      stock: (p as any).stockQty ?? 99,
    })
    toast.success(`${p.title} added to cart`)
  }

  return (
    <>
      <style>{`
        .prod-card { background:#111827; border:1px solid #1E2D45; border-radius:16px; overflow:hidden; transition:all 0.2s; cursor:pointer; text-decoration:none; display:block; }
        .prod-card:hover { border-color:#2563EB; transform:translateY(-2px); box-shadow:0 0 30px #2563EB20; }
        .prod-add-btn { width:100%; padding:9px; background:#1D3B6E; color:#60A5FA; border:1px solid #2563EB40; border-radius:10px; font-size:13px; font-weight:600; cursor:pointer; transition:all 0.2s; }
        .prod-add-btn:hover { background:#2563EB; color:#fff; border-color:#3B82F6; }
      `}</style>
      <Link href={`/products/${p.slug}`} className="prod-card">
        <div style={{ position: 'relative', height: '180px', background: '#1a2236', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {img ? (
            <Image src={img} alt={p.title} fill style={{ objectFit: 'cover' }} />
          ) : (
            <span style={{ fontSize: '48px', opacity: 0.3 }}>🛍️</span>
          )}
          {p.isSponsored && (
            <span style={{ position: 'absolute', top: '10px', left: '10px', background: '#451A03', color: '#FCD34D', fontSize: '10px', fontWeight: 700, padding: '3px 8px', borderRadius: '20px', border: '1px solid #F59E0B40' }}>Sponsored</span>
          )}
          {disc > 0 && (
            <span style={{ position: 'absolute', top: '10px', right: '10px', background: '#450A0A', color: '#F87171', fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '20px' }}>-{disc}%</span>
          )}
        </div>
        <div style={{ padding: '14px 16px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#F8FAFF', marginBottom: '6px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', fontFamily: 'DM Sans, sans-serif' }}>{p.title}</h3>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '6px' }}>
            <span style={{ fontSize: '18px', fontWeight: 800, color: '#60A5FA', fontFamily: 'Syne, sans-serif' }}>
              GH₵ {p.price.toLocaleString('en-GH', { minimumFractionDigits: 2 })}
            </span>
            {p.comparePrice && (
              <span style={{ fontSize: '12px', color: '#475569', textDecoration: 'line-through' }}>
                GH₵ {p.comparePrice.toLocaleString('en-GH', { minimumFractionDigits: 2 })}
              </span>
            )}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '12px', color: '#475569', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', maxWidth: '130px' }}>{p.seller.shopName}</span>
            {avgRating && <span style={{ fontSize: '12px', color: '#F59E0B', fontWeight: 600 }}>★ {avgRating}</span>}
          </div>
          <button onClick={handleAdd} className="prod-add-btn">Add to cart</button>
        </div>
      </Link>
    </>
  )
}
