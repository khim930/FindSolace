'use client'
// src/app/cart/page.tsx

import { useCartStore } from '@/lib/store'
import { calculateOrderFees } from '@/lib/commission'
import Link from 'next/link'
import Image from 'next/image'

export default function CartPage() {
  const { items, removeItem, updateQty, total } = useCartStore()
  const fees = calculateOrderFees(total())

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 text-sm mb-6">Add some products and they'll appear here.</p>
        <Link href="/products" className="btn-primary">Browse products</Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Your cart ({items.length} item{items.length !== 1 ? 's' : ''})</h1>

      <div className="grid sm:grid-cols-3 gap-8">

        {/* Cart items */}
        <div className="sm:col-span-2 space-y-4">
          {items.map(item => (
            <div key={item.id} className="card p-4 flex gap-4">
              <div className="relative w-20 h-20 bg-blue-50 rounded-lg overflow-hidden shrink-0">
                {item.image ? (
                  <Image src={item.image} alt={item.title} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl">🛍️</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 text-sm truncate">{item.title}</h3>
                <p className="text-xs text-gray-400 mb-2">by {item.seller}</p>
                <div className="font-semibold text-blue-600 text-sm mb-3">
                  GH₵ {(item.price * item.quantity).toLocaleString('en-GH', { minimumFractionDigits: 2 })}
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                    <button onClick={() => updateQty(item.id, item.quantity - 1)} className="px-2.5 py-1 text-gray-500 hover:bg-gray-100 text-sm">−</button>
                    <span className="px-3 py-1 text-sm font-medium border-x border-gray-200">{item.quantity}</span>
                    <button onClick={() => updateQty(item.id, item.quantity + 1)} className="px-2.5 py-1 text-gray-500 hover:bg-gray-100 text-sm">+</button>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="text-xs text-red-400 hover:text-red-600">Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order summary */}
        <div>
          <div className="card p-5 sticky top-20">
            <h2 className="font-semibold text-gray-900 mb-4">Order summary</h2>
            <div className="space-y-3 text-sm mb-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>GH₵ {fees.subtotal.toLocaleString('en-GH', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>GH₵ {fees.shippingFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Platform fee (2%)</span>
                <span>GH₵ {fees.platformFee.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-200 pt-3 flex justify-between font-semibold text-base">
                <span>Total</span>
                <span className="text-blue-600">GH₵ {fees.total.toLocaleString('en-GH', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
            <Link href="/checkout" className="block w-full btn-primary text-center py-3 text-sm">
              Proceed to checkout
            </Link>
            <p className="text-xs text-gray-400 text-center mt-3">
              MTN MoMo · Vodafone Cash · Visa / Mastercard
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
