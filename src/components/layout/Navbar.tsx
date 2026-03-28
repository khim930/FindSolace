'use client'
// src/components/layout/Navbar.tsx
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useCartStore } from '@/lib/store'
import { useState } from 'react'

export function Navbar() {
  const { data: session } = useSession()
  const count = useCartStore(s => s.count())
  const role  = (session?.user as any)?.role
  const [search, setSearch] = useState('')

  return (
    <nav style={{ background: '#0D1424', borderBottom: '1px solid #1E2D45', position: 'sticky', top: 0, zIndex: 50 }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 20px', height: '64px', display: 'flex', alignItems: 'center', gap: '16px' }}>

        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0, textDecoration: 'none' }}>
          <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, #2563EB, #3B82F6)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: 800, color: '#fff', fontFamily: 'Syne, sans-serif' }}>F</div>
          <span style={{ fontSize: '18px', fontWeight: 800, fontFamily: 'Syne, sans-serif', color: '#F8FAFF', letterSpacing: '-0.5px' }}>Find<span style={{ color: '#3B82F6' }}>Solace</span></span>
        </Link>

        {/* Search */}
        <form action="/products" style={{ flex: 1, maxWidth: '420px', display: 'flex', marginLeft: '8px' }}>
          <input
            name="q"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search products, brands, sellers..."
            style={{ flex: 1, padding: '10px 16px', fontSize: '13px', background: '#1a2236', border: '1px solid #1E2D45', borderRight: 'none', borderRadius: '12px 0 0 12px', color: '#F8FAFF', outline: 'none' }}
          />
          <button type="submit" style={{ padding: '10px 16px', background: '#2563EB', color: '#fff', fontSize: '13px', fontWeight: 600, border: 'none', borderRadius: '0 12px 12px 0', cursor: 'pointer' }}>
            Search
          </button>
        </form>

        {/* Nav links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginLeft: 'auto' }}>
          <Link href="/products" style={{ padding: '8px 12px', borderRadius: '10px', fontSize: '13px', color: '#94A3B8', textDecoration: 'none', transition: 'all 0.2s' }}
            onMouseOver={e => { (e.target as HTMLElement).style.color = '#F8FAFF'; (e.target as HTMLElement).style.background = '#1a2236' }}
            onMouseOut={e => { (e.target as HTMLElement).style.color = '#94A3B8'; (e.target as HTMLElement).style.background = 'transparent' }}>
            Shop
          </Link>

          {session ? (
            <>
              {(role === 'SELLER' || role === 'ADMIN') && (
                <Link href="/seller" style={{ padding: '8px 12px', borderRadius: '10px', fontSize: '13px', color: '#94A3B8', textDecoration: 'none' }}>Dashboard</Link>
              )}
              {role === 'ADMIN' && (
                <Link href="/admin" style={{ padding: '8px 12px', borderRadius: '10px', fontSize: '13px', color: '#94A3B8', textDecoration: 'none' }}>Admin</Link>
              )}
              <button onClick={() => signOut({ callbackUrl: '/' })} style={{ padding: '8px 12px', borderRadius: '10px', fontSize: '13px', color: '#94A3B8', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" style={{ padding: '8px 14px', borderRadius: '10px', fontSize: '13px', color: '#94A3B8', textDecoration: 'none' }}>Login</Link>
              <Link href="/login?tab=signup" style={{ padding: '8px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 600, background: '#2563EB', color: '#fff', textDecoration: 'none', border: '1px solid #3B82F6' }}>
                Sign up
              </Link>
            </>
          )}

          {/* Cart */}
          <Link href="/cart" style={{ position: 'relative', padding: '8px', borderRadius: '10px', display: 'flex', alignItems: 'center', marginLeft: '4px' }}>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#94A3B8" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {count > 0 && (
              <span style={{ position: 'absolute', top: '2px', right: '2px', background: '#2563EB', color: '#fff', borderRadius: '50%', width: '16px', height: '16px', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                {count > 9 ? '9+' : count}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  )
}
