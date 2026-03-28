'use client'
// src/app/login/page.tsx

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const [tab, setTab]     = useState<'login'|'signup'>(searchParams.get('tab') === 'signup' ? 'signup' : 'login')
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ fullName: '', email: '', password: '', role: 'BUYER', shopName: '' })

  function update(k: string, v: string) { setForm(f => ({ ...f, [k]: v })) }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const res = await signIn('credentials', { email: form.email, password: form.password, redirect: false })
    setLoading(false)
    if (res?.error) { toast.error('Invalid email or password'); return }
    toast.success('Welcome back!')
    router.push(form.role === 'ADMIN' ? '/admin' : '/seller')
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    if (form.role === 'SELLER' && !form.shopName.trim()) { toast.error('Shop name is required'); return }
    setLoading(true)
    try {
      const res  = await fetch('/api/auth/register', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) { toast.error(data.error); return }
      toast.success(data.message)
      // Auto-login after signup
      await signIn('credentials', { email: form.email, password: form.password, redirect: false })
      router.push(form.role === 'SELLER' ? '/seller' : '/')
    } catch { toast.error('Something went wrong') }
    finally { setLoading(false) }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <Link href="/" className="text-2xl font-bold text-blue-600">Find<span className="text-blue-300">Solace</span></Link>
        <p className="text-gray-500 text-sm mt-2">Find what you need, close to home</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        {(['login','signup'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${tab === t ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            {t === 'login' ? 'Log in' : 'Create account'}
          </button>
        ))}
      </div>

      <form onSubmit={tab === 'login' ? handleLogin : handleSignup} className="space-y-4">
        {tab === 'signup' && (
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Full name *</label>
            <input className="input" placeholder="Your full name" value={form.fullName} onChange={e => update('fullName', e.target.value)} required />
          </div>
        )}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Email address *</label>
          <input className="input" type="email" placeholder="you@example.com" value={form.email} onChange={e => update('email', e.target.value)} required />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Password *</label>
          <input className="input" type="password" placeholder="••••••••" value={form.password} onChange={e => update('password', e.target.value)} required minLength={6} />
        </div>
        {tab === 'signup' && (
          <>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">I want to</label>
              <select className="input" value={form.role} onChange={e => update('role', e.target.value)}>
                <option value="BUYER">Buy products</option>
                <option value="SELLER">Sell products</option>
              </select>
            </div>
            {form.role === 'SELLER' && (
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Shop name *</label>
                <input className="input" placeholder="e.g. Kofi's TechStore" value={form.shopName} onChange={e => update('shopName', e.target.value)} required />
              </div>
            )}
          </>
        )}

        <button type="submit" disabled={loading} className="w-full btn-primary py-3 flex items-center justify-center gap-2">
          {loading ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Please wait...</> :
           tab === 'login' ? 'Log in' : 'Create account'}
        </button>

        <p className="text-xs text-gray-400 text-center">
          By continuing, you agree to our{' '}
          <Link href="/terms" className="text-blue-500 hover:underline">Terms</Link> &{' '}
          <Link href="/privacy" className="text-blue-500 hover:underline">Privacy Policy</Link>
        </p>
      </form>

      {tab === 'signup' && (
        <div className="mt-6 p-4 bg-blue-50 rounded-xl text-sm text-blue-700">
          <strong>Why sell on FindSolace?</strong><br />
          ✓ Free to list &nbsp;·&nbsp; ✓ Weekly MoMo payouts &nbsp;·&nbsp; ✓ 50,000+ buyers
        </div>
      )}
    </div>
  )
}
