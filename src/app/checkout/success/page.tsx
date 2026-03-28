// src/app/checkout/success/page.tsx
import Link from 'next/link'
import { db } from '@/lib/db'

interface Props { searchParams: { order?: string } }

export default async function SuccessPage({ searchParams }: Props) {
  const order = searchParams.order
    ? await db.order.findUnique({
        where:   { id: searchParams.order },
        include: { items: { include: { product: { select: { title: true } } } } },
      })
    : null

  return (
    <div className="max-w-md mx-auto px-4 py-16 text-center">
      <div className="text-6xl mb-6">✅</div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Order confirmed!</h1>
      {order ? (
        <>
          <p className="text-gray-500 text-sm mb-2">Order #{order.trackingNumber}</p>
          <p className="text-gray-500 text-sm mb-8">An SMS confirmation has been sent to your phone.</p>

          <div className="card p-5 text-left mb-8 space-y-3">
            <h2 className="font-semibold text-sm text-gray-900">Items ordered</h2>
            {order.items.map(item => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-gray-600">{item.product.title} ×{item.quantity}</span>
                <span className="font-medium">GH₵ {item.lineTotal.toLocaleString('en-GH', { minimumFractionDigits: 2 })}</span>
              </div>
            ))}
            <div className="border-t border-gray-100 pt-3 flex justify-between font-semibold">
              <span>Total paid</span>
              <span className="text-blue-600">GH₵ {order.totalAmount.toLocaleString('en-GH', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>

          <div className="card p-5 text-left mb-8">
            <h2 className="font-semibold text-sm text-gray-900 mb-3">Delivery info</h2>
            <div className="text-sm text-gray-600 space-y-1">
              <p>📍 {(order.shippingAddress as any)?.city}, {(order.shippingAddress as any)?.region}</p>
              <p>⏱ Accra: 1–2 days · Other regions: 3–5 days</p>
              <p>📦 Use <strong>{order.trackingNumber}</strong> to track your order</p>
            </div>
          </div>
        </>
      ) : (
        <p className="text-gray-500 text-sm mb-8">Your payment was successful. You'll receive an SMS confirmation shortly.</p>
      )}

      <div className="flex gap-3 justify-center">
        <Link href="/products" className="btn-primary px-6 py-3">Continue shopping</Link>
        <Link href="/track" className="btn-outline px-6 py-3">Track order</Link>
      </div>
    </div>
  )
}
