// src/app/about/page.tsx
import type { Metadata } from 'next'
export const metadata: Metadata = { title: 'About us' }

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="bg-blue-600 text-white rounded-2xl p-8 mb-10 text-center">
        <h1 className="text-3xl font-bold mb-3">About FindSolace</h1>
        <p className="text-blue-100">Find what you need, close to home</p>
      </div>
      <div className="prose prose-sm max-w-none text-gray-600 space-y-5">
        <p className="text-base">FindSolace was built to give every Ghanaian entrepreneur a professional online storefront without complexity. Whether you're a market trader in Makola, a fashion designer in Kumasi, or a tech reseller in Accra — FindSolace is your platform.</p>
        <p>We support Mobile Money payments, offer buyer protection on every transaction, and pay sellers weekly directly to their MoMo wallet. Our mission is to power the next generation of Ghanaian commerce.</p>
        <div className="grid grid-cols-3 gap-4 my-8">
          {[['1,240+','Active sellers'],['8,500+','Products listed'],['24,000+','Orders delivered']].map(([val, label]) => (
            <div key={label} className="bg-gray-50 rounded-xl p-5 text-center border border-gray-200">
              <div className="text-2xl font-bold text-blue-600 mb-1">{val}</div>
              <div className="text-xs text-gray-500">{label}</div>
            </div>
          ))}
        </div>
        <h2 className="text-lg font-semibold text-gray-900">Our values</h2>
        <ul className="space-y-2 list-none pl-0">
          {['Trust — Every transaction is protected by our buyer guarantee.','Accessibility — Simple enough for first-time sellers.','Local first — Built specifically for Ghanaian buyers and sellers.','Fair pricing — Starter sellers pay 0% commission.'].map(v => (
            <li key={v} className="flex gap-2"><span className="text-blue-500">✓</span><span>{v}</span></li>
          ))}
        </ul>
      </div>
    </div>
  )
}
