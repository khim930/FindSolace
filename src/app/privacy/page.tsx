// src/app/privacy/page.tsx
import type { Metadata } from 'next'
export const metadata: Metadata = { title: 'Privacy Policy' }

export default function PrivacyPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Privacy policy</h1>
      <p className="text-xs text-gray-400 mb-8">Last updated: March 2025</p>
      <div className="space-y-6 text-sm text-gray-600 leading-relaxed">
        {[
          ['Data we collect', 'We collect your name, email address, phone number, delivery addresses, and payment reference numbers (we never store full card details or MoMo PINs). We also store your product listings and order history to operate the marketplace.'],
          ['How we use your data', 'Your data is used to process orders, send delivery SMS updates, personalise product recommendations, and continuously improve our platform. We do not sell your personal data to third parties under any circumstances.'],
          ['Data sharing', 'We share your delivery address and phone number with our courier partners solely to fulfil your order. Payment processing is handled by Paystack, who have their own privacy policy. Sellers receive your name and delivery region (not full address) at time of order confirmation.'],
          ['Your rights', 'You may request a full export or deletion of your personal data at any time by emailing hello@findsolace.gh. Account deletion will be processed within 7 business days. Transactional records may be retained for legal compliance purposes.'],
          ['Cookies', 'FindSolace uses only functional cookies required to keep you logged in and maintain your cart session. We do not use advertising or tracking cookies without your explicit consent.'],
          ['Security', 'All data is transmitted over HTTPS. Passwords are hashed using bcrypt. Payment data is processed directly by Paystack and never touches our servers.'],
          ['Contact', 'For privacy-related questions, contact our Data Protection Officer at privacy@findsolace.gh or write to us at our Accra office.'],
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
