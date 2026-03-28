// src/app/terms/page.tsx
import type { Metadata } from 'next'
export const metadata: Metadata = { title: 'Terms of Service' }

export default function TermsPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Terms of service</h1>
      <p className="text-xs text-gray-400 mb-8">Last updated: March 2025</p>
      <div className="space-y-6 text-sm text-gray-600 leading-relaxed">
        {[
          ['Platform fees & commissions', 'FindSolace charges a commission on completed sales based on your monthly revenue tier. Starter sellers (under GH₵ 500/month) pay 0%. Growth tier (GH₵ 500–5,000) pays 5%. Pro tier (GH₵ 5,000–20,000) pays 7%. Enterprise sellers are eligible for a negotiated rate of 3%. The 2% buyer-side platform fee is charged to buyers on every order.'],
          ['Seller responsibilities', 'Sellers must accurately describe all products including condition, specifications, and any defects. Orders must be dispatched within 3 business days of payment confirmation. Sellers must honour FindSolace\'s refund and return policy and respond to buyer messages within 24 hours.'],
          ['Buyer protection', 'Buyers may raise a dispute within 7 days of delivery if goods are not as described, are damaged, or do not arrive. FindSolace will mediate all disputes and may issue full or partial refunds where warranted. Sellers found to have misrepresented products may be suspended.'],
          ['Prohibited items', 'The following are strictly prohibited: counterfeit or infringing goods, illegal substances, weapons or ammunition, stolen property, adult content, and any item prohibited under Ghanaian law. Violation will result in immediate account suspension and referral to authorities where applicable.'],
          ['Account termination', 'FindSolace reserves the right to suspend or terminate accounts that violate these terms, engage in fraudulent activity, or receive sustained negative buyer feedback. Sellers may appeal terminations by contacting hello@findsolace.gh.'],
          ['Governing law', 'These terms are governed by the laws of the Republic of Ghana. Any disputes shall be subject to the jurisdiction of the courts of Accra, Ghana.'],
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
