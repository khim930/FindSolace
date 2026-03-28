'use client'
// src/app/checkout/page.tsx

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useCartStore } from '@/lib/store'
import { calculateOrderFees } from '@/lib/commission'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'

const REGIONS = ['Greater Accra','Ashanti','Central','Eastern','Western','Northern','Upper East','Upper West','Volta','Oti','Ahafo','Bono','Bono East','North East','Savannah','Western North']

export default function CheckoutPage() {
  const { data: session } = useSession()
  const { items, total, clearCart } = useCartStore()
  const router  = useRouter()
  const fees    = calculateOrderFees(total())
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    fullName: (session?.user?.name ?? ''),
    email:    (session?.user?.email ?? ''),
    phone:    '',
    region:   'Greater Accra',
    city:     '',
    address:  '',
  })

  function update(k: string, v: string) {
    setForm(f => ({ ...f, [k]: v }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (items.length === 0) { toast.error('Your cart is empty'); return }
    if (!form.phone || !form.city || !form.address) { toast.error('Please fill all required fields'); return }

    setLoading(true)
    try {
      // 1. Create the order in DB
      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items:           items.map(i => ({ productId: i.id, sellerId: i.sellerId, quantity: i.quantity, unitPrice: i.price })),
          shippingAddress: form,
          subtotal:        fees.subtotal,
          shippingFee:     fees.shippingFee,
          platformFee:     fees.platformFee,
          totalAmount:     fees.total,
        }),
      })

      if (!orderRes.ok) throw new Error('Failed to create order')
      const { orderId, reference } = await orderRes.json()

      // 2. Initialize Paystack payment
      const payRes = await fetch('/api/payments/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          reference,
          email:     form.email,
          amountGHS: fees.total,
          metadata:  { orderId, buyerName: form.fullName, cartItems: items.map(i => ({ title: i.title, quantity: i.quantity, price: i.price })) },
        }),
      })

      if (!payRes.ok) throw new Error('Failed to initialize payment')
      const { authorizationUrl } = await payRes.json()

      // 3. Clear cart & redirect to Paystack
      clearCart()
      window.location.href = authorizationUrl

    } catch (err: any) {
      toast.error(err.message || 'Something went wrong')
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="text-5xl mb-4">🛒</div>
        <h2 className="text-xl font-semibold mb-3">Nothing to checkout</h2>
        <Link href="/products" className="btn-primary">Continue shopping</Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Checkout</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid sm:grid-cols-3 gap-8">

          {/* Delivery form */}
          <div className="sm:col-span-2 space-y-6">
            <div className="card p-6">
              <h2 className="font-semibold text-gray-900 mb-4">Delivery information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Full name *</label>
                  <input className="input" value={form.fullName} onChange={e => update('fullName', e.target.value)} required />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Email *</label>
                  <input className="input" type="email" value={form.email} onChange={e => update('email', e.target.value)} required />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Phone (WhatsApp) *</label>
                  <input className="input" placeholder="+233 24 000 0000" value={form.phone} onChange={e => update('phone', e.target.value)} required />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Region *</label>
                  <select className="input" value={form.region} onChange={e => update('region', e.target.value)}>
                    {REGIONS.map(r => <option key={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">City / Town *</label>
                  <input className="input" placeholder="e.g. Accra, Kumasi" value={form.city} onChange={e => update('city', e.target.value)} required />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Delivery address *</label>
                  <textarea className="input resize-none" rows={2} placeholder="Street name, landmark, house number" value={form.address} onChange={e => update('address', e.target.value)} required />
                </div>
              </div>
            </div>

            {/* Payment method info */}
            <div className="card p-6">
              <h2 className="font-semibold text-gray-900 mb-3">Payment</h2>
              <p className="text-sm text-gray-500 mb-4">You'll be redirected to Paystack to complete payment securely.</p>
              <div className="flex flex-wrap gap-2">
                {['MTN MoMo','Vodafone Cash','Airtel Money','Visa','Mastercard'].map(m => (
                  <span key={m} className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-600 bg-gray-50">{m}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Order summary */}
          <div>
            <div className="card p-5 sticky top-20">
              <h2 className="font-semibold text-gray-900 mb-4">Order summary</h2>
              <div className="space-y-3 mb-4">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-600 truncate flex-1 mr-2">{item.title} ×{item.quantity}</span>
                    <span className="text-gray-900 shrink-0">GH₵ {(item.price * item.quantity).toLocaleString('en-GH', { minimumFractionDigits: 2 })}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-200 pt-3 space-y-2 text-sm">
                <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>GH₵ {fees.subtotal.toLocaleString('en-GH', { minimumFractionDigits: 2 })}</span></div>
                <div className="flex justify-between text-gray-500"><span>Shipping</span><span>GH₵ {fees.shippingFee.toFixed(2)}</span></div>
                <div className="flex justify-between text-gray-500"><span>Platform fee</span><span>GH₵ {fees.platformFee.toFixed(2)}</span></div>
                <div className="flex justify-between font-semibold text-base border-t border-gray-200 pt-2">
                  <span>Total</span>
                  <span className="text-blue-600">GH₵ {fees.total.toLocaleString('en-GH', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
              <button type="submit" disabled={loading} className="w-full btn-primary py-3 mt-4 text-sm flex items-center justify-center gap-2">
                {loading ? (
                  <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Processing...</>
                ) : (
                  `Pay GH₵ ${fees.total.toLocaleString('en-GH', { minimumFractionDigits: 2 })}`
                )}
              </button>
              <p className="text-xs text-gray-400 text-center mt-2">🔒 Secured by Paystack</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
