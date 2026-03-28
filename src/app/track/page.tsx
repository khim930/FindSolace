'use client'
// src/app/track/page.tsx

import { useState } from 'react'

const STEPS = ['Order confirmed', 'Packed by seller', 'With courier', 'Out for delivery', 'Delivered']

export default function TrackPage() {
  const [query, setQuery]   = useState('')
  const [order, setOrder]   = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState('')

  async function handleTrack(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim()) return
    setLoading(true)
    setError('')
    setOrder(null)

    try {
      const res  = await fetch(`/api/orders/track?ref=${encodeURIComponent(query.trim())}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Order not found')
      setOrder(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const stepIndex = order
    ? ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'].indexOf(order.status)
    : -1

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Track your order</h1>
      <p className="text-sm text-gray-500 mb-8">Enter your order number from your SMS confirmation.</p>

      <form onSubmit={handleTrack} className="flex gap-2 mb-8">
        <input
          className="input flex-1"
          placeholder="e.g. FS-M5X2K1-ABC123"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <button type="submit" disabled={loading} className="btn-primary px-5">
          {loading ? '...' : 'Track'}
        </button>
      </form>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-600 mb-6">{error}</div>
      )}

      {order && (
        <div className="card p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="text-xs text-gray-500 mb-0.5">Order number</div>
              <div className="font-mono font-medium text-gray-900">{order.trackingNumber}</div>
            </div>
            <span className={`badge ${order.status === 'DELIVERED' ? 'badge-green' : order.status === 'CANCELLED' ? 'badge-red' : 'badge-blue'}`}>
              {order.status.toLowerCase()}
            </span>
          </div>

          {/* Progress steps */}
          <div className="space-y-4 mb-6">
            {STEPS.map((step, i) => {
              const done    = i <= stepIndex
              const current = i === stepIndex
              return (
                <div key={step} className="flex gap-3 items-start">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold ${
                    done    ? 'bg-blue-600 text-white' :
                    current ? 'bg-blue-100 text-blue-600 border-2 border-blue-600' :
                              'bg-gray-100 text-gray-400'
                  }`}>
                    {done ? '✓' : i + 1}
                  </div>
                  <div>
                    <div className={`text-sm font-medium ${done ? 'text-gray-900' : 'text-gray-400'}`}>{step}</div>
                    {current && (
                      <div className="text-xs text-blue-600 mt-0.5">Current status</div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Order summary */}
          <div className="border-t border-gray-100 pt-4">
            <div className="text-xs font-medium text-gray-500 mb-2">Items</div>
            {order.items?.map((item: any) => (
              <div key={item.id} className="flex justify-between text-sm py-1">
                <span className="text-gray-600">{item.product?.title} ×{item.quantity}</span>
                <span className="font-medium">GH₵ {item.lineTotal.toLocaleString('en-GH', { minimumFractionDigits: 2 })}</span>
              </div>
            ))}
            <div className="flex justify-between text-sm font-semibold border-t border-gray-100 pt-2 mt-1">
              <span>Total</span>
              <span className="text-blue-600">GH₵ {order.totalAmount.toLocaleString('en-GH', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>

          {/* Delivery address */}
          {order.shippingAddress && (
            <div className="border-t border-gray-100 pt-4 mt-2">
              <div className="text-xs font-medium text-gray-500 mb-1">Delivery address</div>
              <div className="text-sm text-gray-600">
                {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.region}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
