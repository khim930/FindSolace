'use client'
// src/components/product/AddToCartButton.tsx

import { useState } from 'react'
import { useCartStore } from '@/lib/store'
import toast from 'react-hot-toast'

interface Props {
  product: {
    id: string; title: string; price: number
    image: string; seller: string; sellerId: string; stock: number
  }
}

export function AddToCartButton({ product }: Props) {
  const [qty, setQty]   = useState(1)
  const addItem         = useCartStore(s => s.addItem)
  const isOutOfStock    = product.stock === 0

  function handleAdd() {
    for (let i = 0; i < qty; i++) addItem(product)
    toast.success(`${qty}× ${product.title} added to cart`)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <label className="text-sm font-medium text-gray-700">Quantity</label>
        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
          <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-3 py-2 text-gray-600 hover:bg-gray-100 text-sm">−</button>
          <span className="px-4 py-2 text-sm font-medium border-x border-gray-300">{qty}</span>
          <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} className="px-3 py-2 text-gray-600 hover:bg-gray-100 text-sm">+</button>
        </div>
      </div>
      <div className="flex gap-3">
        <button
          onClick={handleAdd}
          disabled={isOutOfStock}
          className="flex-1 btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isOutOfStock ? 'Out of stock' : 'Add to cart'}
        </button>
        <button
          onClick={() => { handleAdd() ; window.location.href = '/cart' }}
          disabled={isOutOfStock}
          className="flex-1 btn-outline py-3 disabled:opacity-50"
        >
          Buy now
        </button>
      </div>
    </div>
  )
}
