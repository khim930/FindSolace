'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <>
      <style>{`
        .footer-link { color: #94a3b8; text-decoration: none; font-size: 0.875rem; transition: color 0.2s; }
        .footer-link:hover { color: #ffffff; }
        .footer-social { width: 36px; height: 36px; border-radius: 50%; background: #1e293b; display: inline-flex; align-items: center; justify-content: center; color: #94a3b8; text-decoration: none; font-size: 0.8rem; transition: background 0.2s, color 0.2s; }
        .footer-social:hover { background: #3b82f6; color: #ffffff; }
      `}</style>

      <footer style={{ background: '#0a0f1e', borderTop: '1px solid #1e293b', paddingTop: '3rem', paddingBottom: '2rem', marginTop: 'auto' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>

          {/* Top row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>

            {/* Brand */}
            <div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>
                Find<span style={{ color: '#3b82f6' }}>Solace</span>
              </div>
              <p style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1rem' }}>
                Find what you need, close to home. Ghana&apos;s trusted multi-vendor marketplace.
              </p>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="footer-social">𝕏</a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="footer-social">📷</a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="footer-social">f</a>
              </div>
            </div>

            {/* Marketplace */}
            <div>
              <h4 style={{ color: '#fff', fontWeight: 600, marginBottom: '1rem', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Marketplace</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <li><Link href="/products" className="footer-link">Browse Products</Link></li>
                <li><Link href="/seller" className="footer-link">Sell on FindSolace</Link></li>
                <li><Link href="/blog" className="footer-link">Blog</Link></li>
                <li><Link href="/track" className="footer-link">Track Order</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 style={{ color: '#fff', fontWeight: 600, marginBottom: '1rem', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Support</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <li><Link href="/faq" className="footer-link">FAQ</Link></li>
                <li><Link href="/contact" className="footer-link">Contact Us</Link></li>
                <li><Link href="/refund" className="footer-link">Refund Policy</Link></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 style={{ color: '#fff', fontWeight: 600, marginBottom: '1rem', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Legal</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <li><Link href="/about" className="footer-link">About Us</Link></li>
                <li><Link href="/privacy" className="footer-link">Privacy Policy</Link></li>
                <li><Link href="/terms" className="footer-link">Terms of Service</Link></li>
              </ul>
            </div>

          </div>

          {/* Bottom bar */}
          <div style={{ borderTop: '1px solid #1e293b', paddingTop: '1.5rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
            <p style={{ color: '#475569', fontSize: '0.8rem', margin: 0 }}>
              © {new Date().getFullYear()} FindSolace. All rights reserved. Made with ❤️ in Ghana 🇬🇭
            </p>
            <p style={{ color: '#334155', fontSize: '0.75rem', margin: 0 }}>
              Secure payments via Paystack • MTN MoMo • Vodafone Cash
            </p>
          </div>

        </div>
      </footer>
    </>
  );
}
