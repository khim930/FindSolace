// src/components/layout/Footer.tsx
import Link from 'next/link'

export function Footer() {
  return (
    <footer style={{ background: '#080D18', borderTop: '1px solid #1E2D45', marginTop: '80px' }}>
      <style>{`
        .footer-link { color: #64748B; transition: color 0.2s; }
        .footer-link:hover { color: #94A3B8; }
      `}</style>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '60px 20px 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '40px', marginBottom: '48px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <div style={{ width: '28px', height: '28px', background: 'linear-gradient(135deg, #2563EB, #3B82F6)', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 800, color: '#fff', fontFamily: 'Syne, sans-serif' }}>F</div>
              <span style={{ fontSize: '16px', fontWeight: 800, fontFamily: 'Syne, sans-serif', color: '#F8FAFF' }}>Find<span style={{ color: '#3B82F6' }}>Solace</span></span>
            </div>
            <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.7, marginBottom: '16px' }}>Find what you need, close to home. Ghana's marketplace for local sellers and buyers.</p>
            <p style={{ fontSize: '12px', color: '#475569' }}>📍 Accra, Ghana 🇬🇭</p>
          </div>
          {[
            { title: 'Company', links: [['About us','/about'],['Blog','/blog'],['Contact','/contact'],['FAQ','/faq']] },
            { title: 'Legal', links: [['Privacy policy','/privacy'],['Terms of service','/terms'],['Refund policy','/refund'],['Track order','/track']] },
            { title: 'Sellers', links: [['Start selling','/login?tab=signup'],['Dashboard','/seller'],['Pricing & fees','/terms'],['Help center','/faq']] },
          ].map(col => (
            <div key={col.title}>
              <h4 style={{ fontSize: '12px', fontWeight: 700, color: '#F8FAFF', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '16px', fontFamily: 'Syne, sans-serif' }}>{col.title}</h4>
              {col.links.map(([label, href]) => (
                <Link key={href} href={href} className="footer-link" style={{ display: 'block', fontSize: '13px', marginBottom: '10px', textDecoration: 'none' }}>
                  {label}
                </Link>
              ))}
            </div>
          ))}
        </div>
        <div style={{ borderTop: '1px solid #1E2D45', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <p style={{ fontSize: '12px', color: '#475569' }}>© 2025 FindSolace. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['MTN MoMo', 'Vodafone Cash', 'Visa', 'Mastercard'].map(m => (
              <span key={m} style={{ fontSize: '11px', padding: '3px 10px', background: '#1a2236', color: '#64748B', border: '1px solid #1E2D45', borderRadius: '20px' }}>{m}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
