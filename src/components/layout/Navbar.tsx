'use client'
// src/components/layout/Navbar.tsx

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useCartStore } from '@/lib/store'

export function Navbar() {
  const { data: session } = useSession()
  const count = useCartStore(s => s.count())
  const role  = (session?.user as any)?.role

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-4">

        {/* Logo */}
        <Link href="/" className="text-lg font-bold text-blue-600 shrink-0">
          Find<span className="text-blue-300">Solace</span>
        </Link>

        {/* Search */}
        <form action="/products" className="flex-1 max-w-md hidden sm:flex">
          <input
            name="q"
            placeholder="Search products, brands, sellers..."
            className="flex-1 px-3 py-2 text-sm border border-r-0 border-gray-300 rounded-l-lg focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-r-lg hover:bg-blue-700 transition-colors"
          >
            Search
          </button>
        </form>

        {/* Nav links */}
        <div className="flex items-center gap-1 ml-auto">
          <Link href="/products" className="btn-ghost text-sm hidden sm:block">Shop</Link>

          {session ? (
            <>
              {(role === 'SELLER' || role === 'ADMIN') && (
                <Link href="/seller" className="btn-ghost text-sm hidden sm:block">Dashboard</Link>
              )}
              {role === 'ADMIN' && (
                <Link href="/admin" className="btn-ghost text-sm hidden sm:block">Admin</Link>
              )}
              <button onClick={() => signOut({ callbackUrl: '/' })} className="btn-ghost text-sm">
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn-ghost text-sm">Login</Link>
              <Link href="/login?tab=signup" className="btn-primary text-sm">Sign up</Link>
            </>
          )}

          {/* Cart */}
          <Link href="/cart" className="relative p-2 hover:bg-gray-100 rounded-lg ml-1">
            <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {count > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-medium">
                {count > 9 ? '9+' : count}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  )
}
