'use client'
// src/app/faq/page.tsx
import { useState } from 'react'

const FAQS = [
  { q: 'How do I create a seller account?', a: 'Click "Sign up" and select "Sell products". Fill in your shop name and details. Your account will be reviewed and approved within 24 hours.' },
  { q: 'What payment methods are accepted?', a: 'We accept MTN Mobile Money, Vodafone Cash, Airtel Money, and major credit/debit cards via Paystack. All payments are processed securely.' },
  { q: 'How long does delivery take?', a: 'Within Accra: 1–2 business days. Other regions: 3–5 business days. Express same-day delivery is available within Accra for an additional fee.' },
  { q: 'When do sellers get paid?', a: 'Sellers receive weekly payouts every Friday, directly to their registered Mobile Money wallet. Minimum payout is GH₵ 10.' },
  { q: 'What is the platform commission?', a: 'Starter sellers (under GH₵ 500/month revenue) pay 0% commission. Growth tier (GH₵ 500–5,000) pays 5%. Pro tier (GH₵ 5,000–20,000) pays 7%. Enterprise sellers pay a negotiated 3%.' },
  { q: 'How do I track my order?', a: 'Visit the "Track order" page and enter your order number from your SMS confirmation. You can see real-time status of your delivery.' },
  { q: 'What is buyer protection?', a: 'All orders are covered by FindSolace Buyer Protection. If your item is not as described or doesn\'t arrive, you can raise a dispute within 7 days and receive a full refund.' },
  { q: 'Can I sell food and perishable items?', a: 'Yes. Food sellers must ensure proper packaging. Note that perishable items are not eligible for returns due to their nature, unless the item is damaged or incorrect.' },
]

export default function FAQPage() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Frequently asked questions</h1>
      <p className="text-sm text-gray-500 mb-8">Can't find your answer? <a href="/contact" className="text-blue-600 hover:underline">Contact us</a></p>
      <div className="space-y-2">
        {FAQS.map((faq, i) => (
          <div key={i} className="card overflow-hidden">
            <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex justify-between items-center px-5 py-4 text-left text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors">
              {faq.q}
              <span className="text-gray-400 text-lg ml-3 shrink-0">{open === i ? '−' : '+'}</span>
            </button>
            {open === i && (
              <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100">{faq.a}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
