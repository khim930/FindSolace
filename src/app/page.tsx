// src/app/page.tsx
import Link from 'next/link'
import { db } from '@/lib/db'
import { ProductCard } from '@/components/product/ProductCard'

export default async function HomePage() {
  const [products, categories] = await Promise.all([
    db.product.findMany({
      where: { status: 'ACTIVE' },
      include: { seller: { select: { shopName: true } }, category: true, reviews: { select: { rating: true } } },
      orderBy: { createdAt: 'desc' },
      take: 8,
    }),
    db.category.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
  ])

  return (
    <div style={{ background: '#0A0F1E', minHeight: '100vh' }}>
      <style>{`
        .hero-btn-primary { display:inline-block; padding:14px 28px; background:#2563EB; color:#fff; border-radius:12px; font-weight:700; font-size:15px; font-family:'Syne',sans-serif; text-decoration:none; border:1px solid #3B82F6; transition:all 0.2s; }
        .hero-btn-primary:hover { background:#3B82F6; transform:translateY(-1px); box-shadow:0 0 24px #2563EB40; }
        .hero-btn-outline { display:inline-block; padding:14px 28px; background:transparent; color:#CBD5E1; border-radius:12px; font-weight:600; font-size:15px; text-decoration:none; border:1px solid #1E2D45; transition:all 0.2s; }
        .hero-btn-outline:hover { border-color:#2563EB; color:#F8FAFF; }
        .cat-link { display:flex; flex-direction:column; align-items:center; gap:6px; min-width:72px; padding:16px 10px; border-bottom:2px solid transparent; text-decoration:none; transition:all 0.2s; }
        .cat-link:hover { border-bottom-color:#2563EB; }
        .cat-link span:last-child { font-size:11px; color:#64748B; white-space:nowrap; }
        .cat-link:hover span:last-child { color:#60A5FA; }
        .trust-card { background:#111827; border:1px solid #1E2D45; border-radius:16px; padding:20px; display:flex; gap:14px; align-items:flex-start; transition:border-color 0.2s; }
        .trust-card:hover { border-color:#2563EB40; }
        .sell-cta-btn { display:inline-block; padding:14px 32px; background:#2563EB; color:#fff; border-radius:12px; font-weight:700; font-size:15px; font-family:'Syne',sans-serif; text-decoration:none; border:1px solid #3B82F6; transition:all 0.2s; }
        .sell-cta-btn:hover { background:#3B82F6; transform:translateY(-1px); }
      `}</style>

      {/* ── Hero ── */}
      <section style={{ background: 'linear-gradient(160deg, #0D1424 0%, #0F1E3A 50%, #0A0F1E 100%)', padding: '80px 20px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '300px', background: '#2563EB10', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: '1280px', margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#1a2236', border: '1px solid #2563EB40', borderRadius: '20px', padding: '6px 16px', fontSize: '12px', color: '#60A5FA', marginBottom: '24px', fontWeight: 500 }}>
            <span style={{ width: '6px', height: '6px', background: '#10B981', borderRadius: '50%', display: 'inline-block' }} />
            Now live across Ghana 🇬🇭
          </div>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(36px, 6vw, 72px)', fontWeight: 800, color: '#F8FAFF', lineHeight: 1.1, marginBottom: '20px', letterSpacing: '-1px' }}>
            Find what you need,<br />
            <span style={{ background: 'linear-gradient(135deg, #2563EB, #60A5FA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>close to home</span>
          </h1>
          <p style={{ fontSize: '18px', color: '#64748B', maxWidth: '520px', margin: '0 auto 40px', lineHeight: 1.7 }}>
            Ghana's marketplace connecting local sellers with buyers. Electronics, fashion, food & more.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/products" className="hero-btn-primary">Browse products →</Link>
            <Link href="/login?tab=signup" className="hero-btn-outline">Start selling free</Link>
          </div>
          <div style={{ display: 'flex', gap: '40px', justifyContent: 'center', marginTop: '56px', flexWrap: 'wrap' }}>
            {[['1,200+','Active sellers'],['8,500+','Products listed'],['24k+','Orders delivered'],['GH₵','Mobile Money']].map(([val, label]) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '24px', fontWeight: 800, color: '#F8FAFF' }}>{val}</div>
                <div style={{ fontSize: '12px', color: '#475569', marginTop: '2px' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section style={{ borderBottom: '1px solid #1E2D45', background: '#0D1424' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 20px', display: 'flex', gap: '4px', overflowX: 'auto' }}>
          <Link href="/products" className="cat-link" style={{ borderBottomColor: '#2563EB' }}>
            <span style={{ fontSize: '22px' }}>🛒</span>
            <span style={{ color: '#60A5FA', fontWeight: 600 }}>All</span>
          </Link>
          {categories.map(cat => (
            <Link key={cat.id} href={`/products?category=${cat.slug}`} className="cat-link">
              <span style={{ fontSize: '22px' }}>{cat.iconUrl}</span>
              <span>{cat.name.split(' ')[0]}</span>
            </Link>
          ))}
        </div>
      </section>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '48px 20px' }}>

        {/* Trust bar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '56px' }}>
          {[
            { icon: '🛡️', title: 'Buyer protection', sub: 'Safe payments on every order' },
            { icon: '🚚', title: 'Nationwide delivery', sub: 'All 16 regions of Ghana' },
            { icon: '💳', title: 'Mobile Money', sub: 'MTN MoMo & Vodafone Cash' },
            { icon: '⚡', title: 'Fast listings', sub: 'AI-powered product descriptions' },
          ].map(t => (
            <div key={t.title} className="trust-card">
              <span style={{ fontSize: '24px', flexShrink: 0 }}>{t.icon}</span>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#F8FAFF', marginBottom: '3px', fontFamily: 'Syne, sans-serif' }}>{t.title}</div>
                <div style={{ fontSize: '12px', color: '#475569' }}>{t.sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Featured products */}
        <div style={{ marginBottom: '48px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '22px', fontWeight: 800, color: '#F8FAFF' }}>Featured products</h2>
            <Link href="/products" style={{ fontSize: '13px', color: '#3B82F6', textDecoration: 'none', fontWeight: 500 }}>View all →</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
            {products.slice(0, 4).map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>

        {/* New arrivals */}
        {products.length > 4 && (
          <div style={{ marginBottom: '48px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '22px', fontWeight: 800, color: '#F8FAFF' }}>New arrivals</h2>
              <Link href="/products" style={{ fontSize: '13px', color: '#3B82F6', textDecoration: 'none', fontWeight: 500 }}>View all →</Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
              {products.slice(4).map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}

        {/* Sell CTA */}
        <div style={{ background: 'linear-gradient(135deg, #1D3B6E 0%, #1a2236 100%)', border: '1px solid #2563EB40', borderRadius: '24px', padding: '48px 40px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '28px', fontWeight: 800, color: '#F8FAFF', marginBottom: '12px' }}>Ready to start selling?</h2>
          <p style={{ color: '#64748B', fontSize: '15px', marginBottom: '28px', maxWidth: '440px', margin: '0 auto 28px' }}>
            Join 1,200+ sellers on FindSolace. Free to list, weekly payouts to your MoMo wallet.
          </p>
          <Link href="/login?tab=signup" className="sell-cta-btn">
            Create seller account — it's free →
          </Link>
        </div>
      </div>
    </div>
  )
}
