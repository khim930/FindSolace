// src/components/layout/Footer.tsx
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-blue-900 text-blue-100 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="text-white font-bold text-lg mb-3">Find<span className="text-blue-300">Solace</span></div>
            <p className="text-sm text-blue-300 leading-relaxed">Find what you need, close to home. Ghana's marketplace for local sellers and buyers.</p>
            <p className="text-sm text-blue-300 mt-3">📍 Accra, Ghana 🇬🇭</p>
          </div>
          <div>
            <h4 className="text-white font-medium text-sm mb-3">Company</h4>
            {[['About us','/about'],['Blog','/blog'],['Contact','/contact'],['FAQ','/faq']].map(([label,href]) => (
              <Link key={href} href={href} className="block text-sm text-blue-300 hover:text-white mb-2">{label}</Link>
            ))}
          </div>
          <div>
            <h4 className="text-white font-medium text-sm mb-3">Legal</h4>
            {[['Privacy policy','/privacy'],['Terms of service','/terms'],['Refund policy','/refund'],['Track order','/track']].map(([label,href]) => (
              <Link key={href} href={href} className="block text-sm text-blue-300 hover:text-white mb-2">{label}</Link>
            ))}
          </div>
          <div>
            <h4 className="text-white font-medium text-sm mb-3">Sellers</h4>
            {[['Start selling','/login?tab=signup'],['Seller dashboard','/seller'],['Pricing & fees','/terms'],['Help center','/faq']].map(([label,href]) => (
              <Link key={href} href={href} className="block text-sm text-blue-300 hover:text-white mb-2">{label}</Link>
            ))}
            <div className="mt-4">
              <p className="text-xs text-blue-400 mb-2">We accept</p>
              <div className="flex gap-2 flex-wrap">
                {['MTN MoMo','Vodafone Cash','Visa/MC'].map(m => (
                  <span key={m} className="text-xs bg-blue-800 text-blue-200 px-2 py-0.5 rounded">{m}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-blue-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-sm text-blue-400">© 2025 FindSolace. All rights reserved.</p>
          <p className="text-sm text-blue-400">Built with care in Ghana 🇬🇭</p>
        </div>
      </div>
    </footer>
  )
}
