'use client'
import { Suspense } from 'react'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [tab, setTab] = useState(searchParams.get('tab') === 'signup' ? 'signup' : 'login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const res = await signIn('credentials', { email, password, redirect: false })
    setLoading(false)
    if (res?.ok) { toast.success('Welcome back!'); router.push('/') }
    else toast.error('Invalid email or password')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-6">
          {tab === 'login' ? 'Sign In' : 'Create Account'}
        </h1>
        <div className="flex mb-6 border rounded-xl overflow-hidden">
          <button onClick={() => setTab('login')} className={`flex-1 py-2 text-sm font-medium ${tab === 'login' ? 'bg-blue-700 text-white' : 'text-gray-500'}`}>Sign In</button>
          <button onClick={() => setTab('signup')} className={`flex-1 py-2 text-sm font-medium ${tab === 'signup' ? 'bg-blue-700 text-white' : 'text-gray-500'}`}>Sign Up</button>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <input className="w-full border rounded-xl px-4 py-3 text-sm" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
          <input className="w-full border rounded-xl px-4 py-3 text-sm" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
          <button type="submit" disabled={loading} className="w-full bg-blue-700 text-white py-3 rounded-xl font-semibold">
            {loading ? 'Please wait...' : tab === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <LoginContent />
    </Suspense>
  )
}