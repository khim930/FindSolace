// src/app/refund/page.tsx
import type { Metadata } from 'next'
export const metadata: Metadata = { title: 'Refund & Return Policy' }

export default function RefundPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="bg-green-50 border border-green-200 rounded-2xl p-5 mb-8 flex gap-3 items-start">
        <span className="text-2xl">🛡️</span>
        <div>
          <div className="font-semibold text-green-800 mb-1">FindSolace Buyer Protection</div>
          <div className="text-sm text-green-700">Every order on FindSolace is covered by our buyer protection guarantee.</div>
        </div>
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Refund & return policy</h1>
      <div className="space-y-6 text-sm text-gray-600 leading-relaxed">
        {[
          ['7-day return window', 'If your item is not as described, arrives damaged, or does not arrive at all, you may raise a return request within 7 days of the delivery date. To raise a request, go to your order history and click "Request return" on the relevant order.'],
          ['Eligible items', 'Any item that is significantly not as described, defective, or missing parts is eligible for return. This includes electronics with faults, clothing in wrong sizes (if wrong size was shipped), and food items that are spoiled or incorrect.'],
          ['Non-returnable items', 'Perishable food items (unless spoiled or incorrect), digital goods and downloads, custom-made or personalised products (unless defective), and items marked as "final sale" are not eligible for returns.'],
          ['Refund process', 'Once your return request is approved by our team (usually within 24 hours), you will receive a return label or be given instructions for dropping off the item. Refunds are processed within 3–5 business days to your original payment method — MTN MoMo, Vodafone Cash, or card.'],
          ['Disputes', 'If a seller declines your return request and you believe this is incorrect, you can escalate to FindSolace support within 3 days of the seller\'s decision. Our team will review evidence from both parties and make a final decision within 48 hours.'],
          ['How to contact us', 'Email refunds@findsolace.gh or WhatsApp +233 24 000 0000 with your order number and a description of the issue. Photos of damaged items will help resolve your case faster.'],
        ].map(([title, body]) => (
          <div key={title as string}>
            <h2 className="text-base font-semibold text-gray-900 mb-2">{title}</h2>
            <p>{body}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
