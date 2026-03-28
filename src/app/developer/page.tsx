export default function DeveloperPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

        .dev-page { font-family: 'DM Sans', sans-serif; background: #0a0f1e; color: #fff; min-height: 100vh; overflow-x: hidden; }

        .hero-section {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          padding: 6rem 1.5rem 4rem;
          text-align: center;
        }

        .hero-bg {
          position: absolute; inset: 0;
          background: radial-gradient(ellipse 80% 60% at 50% 0%, rgba(59,130,246,0.15) 0%, transparent 70%),
                      radial-gradient(ellipse 40% 40% at 80% 80%, rgba(99,102,241,0.1) 0%, transparent 60%);
        }

        .grid-overlay {
          position: absolute; inset: 0;
          background-image: linear-gradient(rgba(59,130,246,0.05) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(59,130,246,0.05) 1px, transparent 1px);
          background-size: 60px 60px;
        }

        .badge {
          display: inline-flex; align-items: center; gap: 0.5rem;
          background: rgba(59,130,246,0.1); border: 1px solid rgba(59,130,246,0.3);
          color: #93c5fd; padding: 0.4rem 1rem; border-radius: 999px;
          font-size: 0.8rem; font-weight: 500; margin-bottom: 2rem;
          animation: fadeUp 0.6s ease both;
        }

        .dot { width: 6px; height: 6px; border-radius: 50%; background: #3b82f6; animation: pulse 2s infinite; }

        .hero-name {
          font-family: 'Syne', sans-serif;
          font-size: clamp(3rem, 8vw, 6rem);
          font-weight: 800;
          line-height: 1;
          letter-spacing: -0.03em;
          margin-bottom: 1rem;
          animation: fadeUp 0.6s 0.1s ease both;
        }

        .hero-name span { color: #3b82f6; }

        .hero-title {
          font-size: clamp(1rem, 2vw, 1.25rem);
          color: #64748b;
          font-weight: 300;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 1.5rem;
          animation: fadeUp 0.6s 0.2s ease both;
        }

        .hero-desc {
          max-width: 520px; margin: 0 auto 3rem;
          color: #94a3b8; font-size: 1.05rem; line-height: 1.7;
          animation: fadeUp 0.6s 0.3s ease both;
        }

        .cta-btn {
          display: inline-flex; align-items: center; gap: 0.75rem;
          background: linear-gradient(135deg, #25d366, #128c7e);
          color: #fff; padding: 0.9rem 2rem; border-radius: 999px;
          font-weight: 600; font-size: 1rem; text-decoration: none;
          box-shadow: 0 0 30px rgba(37,211,102,0.3);
          transition: all 0.3s; animation: fadeUp 0.6s 0.4s ease both;
        }
        .cta-btn:hover { transform: translateY(-2px); box-shadow: 0 0 40px rgba(37,211,102,0.5); }

        .email-btn {
          display: inline-flex; align-items: center; gap: 0.75rem;
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.15);
          color: #fff; padding: 0.9rem 2rem; border-radius: 999px;
          font-weight: 600; font-size: 1rem; text-decoration: none;
          transition: all 0.3s; margin-left: 1rem;
        }
        .email-btn:hover { background: rgba(255,255,255,0.1); transform: translateY(-2px); }

        .wa-icon { font-size: 1.2rem; }

        /* Stats */
        .stats-section {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 1px; background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 1rem; overflow: hidden;
          max-width: 600px; margin: 0 auto 6rem; padding: 0;
        }

        .stat { background: rgba(255,255,255,0.02); padding: 2rem 1rem; text-align: center; }
        .stat-num { font-family: 'Syne', sans-serif; font-size: 2rem; font-weight: 800; color: #fff; }
        .stat-num span { color: #3b82f6; }
        .stat-label { color: #475569; font-size: 0.8rem; margin-top: 0.25rem; }

        /* Services */
        .section { padding: 5rem 1.5rem; max-width: 1100px; margin: 0 auto; }
        .section-label { color: #3b82f6; font-size: 0.8rem; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 0.75rem; }
        .section-title { font-family: 'Syne', sans-serif; font-size: clamp(2rem, 4vw, 3rem); font-weight: 800; margin-bottom: 3rem; line-height: 1.1; }

        .services-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; }

        .service-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 1.25rem; padding: 2rem;
          transition: all 0.3s; position: relative; overflow: hidden;
        }
        .service-card::before {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(59,130,246,0.05), transparent);
          opacity: 0; transition: opacity 0.3s;
        }
        .service-card:hover { border-color: rgba(59,130,246,0.3); transform: translateY(-4px); }
        .service-card:hover::before { opacity: 1; }

        .service-icon { font-size: 2rem; margin-bottom: 1rem; }
        .service-name { font-family: 'Syne', sans-serif; font-size: 1.2rem; font-weight: 700; margin-bottom: 0.5rem; }
        .service-desc { color: #64748b; font-size: 0.9rem; line-height: 1.6; }
        .service-tags { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 1rem; }
        .tag { background: rgba(59,130,246,0.1); color: #93c5fd; padding: 0.2rem 0.6rem; border-radius: 999px; font-size: 0.75rem; }

        /* Portfolio */
        .portfolio-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 1.25rem; overflow: hidden;
          transition: all 0.3s;
        }
        .portfolio-card:hover { border-color: rgba(59,130,246,0.3); transform: translateY(-4px); }

        .portfolio-preview {
          background: linear-gradient(135deg, #0f172a, #1e1b4b);
          padding: 2rem; display: flex; align-items: center; justify-content: center;
          min-height: 180px; position: relative; overflow: hidden;
        }

        .portfolio-logo { font-family: 'Syne', sans-serif; font-size: 2rem; font-weight: 800; color: #fff; }
        .portfolio-logo span { color: #3b82f6; }

        .portfolio-body { padding: 1.5rem; }
        .portfolio-name { font-family: 'Syne', sans-serif; font-size: 1.1rem; font-weight: 700; margin-bottom: 0.5rem; }
        .portfolio-desc { color: #64748b; font-size: 0.875rem; line-height: 1.6; margin-bottom: 1rem; }

        .portfolio-link {
          display: inline-flex; align-items: center; gap: 0.4rem;
          color: #3b82f6; font-size: 0.875rem; font-weight: 500; text-decoration: none;
        }
        .portfolio-link:hover { text-decoration: underline; }

        /* CTA bottom */
        .cta-section {
          text-align: center; padding: 5rem 1.5rem;
          background: linear-gradient(180deg, transparent, rgba(59,130,246,0.05));
          border-top: 1px solid rgba(255,255,255,0.05);
        }

        .cta-title { font-family: 'Syne', sans-serif; font-size: clamp(1.8rem, 4vw, 3rem); font-weight: 800; margin-bottom: 1rem; }
        .cta-sub { color: #64748b; margin-bottom: 2rem; font-size: 1rem; }

        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
      `}</style>

      <div className="dev-page">

        {/* Hero */}
        <div className="hero-section">
          <div className="hero-bg" />
          <div className="grid-overlay" />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div className="badge">
              <span className="dot" />
              Available for new projects
            </div>
            <h1 className="hero-name">Joachim<br /><span>Naakureh</span></h1>
            <p className="hero-title">Full-Stack Developer · Ghana 🇬🇭</p>
            <p className="hero-desc">
              I build fast, beautiful, and functional web platforms for businesses across Ghana and beyond.
              From e-commerce marketplaces to custom web apps — I bring ideas to life.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
              <a href="https://wa.me/233531113498" target="_blank" rel="noopener noreferrer" className="cta-btn">
                <span className="wa-icon">💬</span>
                Chat on WhatsApp
              </a>
              <a href="mailto:joachimnaakureh07@gmail.com" className="email-btn">
                ✉️ Send Email
              </a>
            </div>

            {/* Stats */}
            <div style={{ marginTop: '4rem' }}>
              <div className="stats-section">
                <div className="stat">
                  <div className="stat-num">1<span>+</span></div>
                  <div className="stat-label">Live Projects</div>
                </div>
                <div className="stat">
                  <div className="stat-num">3<span>+</span></div>
                  <div className="stat-label">Services Offered</div>
                </div>
                <div className="stat">
                  <div className="stat-num">24<span>/7</span></div>
                  <div className="stat-label">Support</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Services */}
        <div className="section">
          <p className="section-label">What I do</p>
          <h2 className="section-title">Services I Offer</h2>
          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon">🌐</div>
              <div className="service-name">Web Development</div>
              <div className="service-desc">Full-stack websites and web apps built with modern technologies. Fast, responsive, and scalable.</div>
              <div className="service-tags">
                <span className="tag">Next.js</span>
                <span className="tag">React</span>
                <span className="tag">Node.js</span>
                <span className="tag">TypeScript</span>
              </div>
            </div>
            <div className="service-card">
              <div className="service-icon">📱</div>
              <div className="service-name">Mobile Apps</div>
              <div className="service-desc">Cross-platform mobile applications that work seamlessly on both Android and iOS devices.</div>
              <div className="service-tags">
                <span className="tag">React Native</span>
                <span className="tag">Expo</span>
                <span className="tag">Android</span>
                <span className="tag">iOS</span>
              </div>
            </div>
            <div className="service-card">
              <div className="service-icon">🗄️</div>
              <div className="service-name">Database Design</div>
              <div className="service-desc">Efficient, well-structured databases that scale with your business. From schema design to optimization.</div>
              <div className="service-tags">
                <span className="tag">PostgreSQL</span>
                <span className="tag">Prisma</span>
                <span className="tag">MySQL</span>
                <span className="tag">Redis</span>
              </div>
            </div>
          </div>
        </div>

        {/* Portfolio */}
        <div className="section">
          <p className="section-label">My Work</p>
          <h2 className="section-title">Projects I've Built</h2>
          <div className="services-grid">
            <div className="portfolio-card">
              <div className="portfolio-preview">
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'radial-gradient(ellipse at center, rgba(59,130,246,0.2), transparent 70%)'
                }} />
                <div className="portfolio-logo" style={{ position: 'relative' }}>Find<span>Solace</span></div>
              </div>
              <div className="portfolio-body">
                <div className="portfolio-name">FindSolace Marketplace</div>
                <div className="portfolio-desc">
                  A full-featured multi-vendor e-commerce marketplace for Ghana. Built with Next.js, PostgreSQL, Paystack payments, and AI-powered product descriptions.
                </div>
                <div className="service-tags" style={{ marginBottom: '1rem' }}>
                  <span className="tag">Next.js</span>
                  <span className="tag">PostgreSQL</span>
                  <span className="tag">Paystack</span>
                  <span className="tag">AI</span>
                </div>
                <a href="https://find-solace-xizu.vercel.app" target="_blank" rel="noopener noreferrer" className="portfolio-link">
                  View live site →
                </a>
              </div>
            </div>

            <div className="portfolio-card">
              <div className="portfolio-preview" style={{ background: 'linear-gradient(135deg, #0a0f1e, #1a1200)' }}>
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'radial-gradient(ellipse at center, rgba(201,168,76,0.2), transparent 70%)'
                }} />
                <div className="portfolio-logo" style={{ position: 'relative', color: '#fff' }}>
                  J<span style={{ color: '#C9A84C' }}>him</span>Fit
                </div>
              </div>
              <div className="portfolio-body">
                <div className="portfolio-name">JhimFit — Ghana Fitness App</div>
                <div className="portfolio-desc">
                  A full PWA fitness tracker built for Ghana. Features Ghanaian meal database, guided workout plans with live timers, Supabase cloud sync, multi-profile support, streak tracking, XP gamification, and Three.js shader animations. Installable on Android, iPhone and desktop.
                </div>
                <div className="service-tags" style={{ marginBottom: '1rem' }}>
                  <span className="tag">React</span>
                  <span className="tag">Supabase</span>
                  <span className="tag">PWA</span>
                  <span className="tag">Three.js</span>
                  <span className="tag">Vite</span>
                </div>
                <a href="https://jhim-fitness.vercel.app" target="_blank" rel="noopener noreferrer" className="portfolio-link">
                  View live site →
                </a>
              </div>
            </div>

            <div className="portfolio-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px', border: '2px dashed rgba(255,255,255,0.08)' }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🚀</div>
              <div style={{ color: '#475569', fontSize: '0.9rem', textAlign: 'center', padding: '0 2rem' }}>
                More projects coming soon.<br />Got an idea? Let's build it together.
              </div>
              <a href="https://wa.me/233531113498" target="_blank" rel="noopener noreferrer" style={{ marginTop: '1.5rem', color: '#3b82f6', fontSize: '0.875rem', textDecoration: 'none', fontWeight: 500 }}>
                Start a project →
              </a>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="cta-section">
          <h2 className="cta-title">Ready to build something?</h2>
          <p className="cta-sub">Let's talk about your project. I'm based in Ghana and available now.</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
            <a href="https://wa.me/233531113498" target="_blank" rel="noopener noreferrer" className="cta-btn">
              <span className="wa-icon">💬</span>
              WhatsApp me now
            </a>
            <a href="mailto:joachimnaakureh07@gmail.com" className="email-btn">
              ✉️ joachimnaakureh07@gmail.com
            </a>
          </div>
          <p style={{ color: '#334155', fontSize: '0.75rem', marginTop: '3rem' }}>
            This page is hosted on <a href="/" style={{ color: '#3b82f6', textDecoration: 'none' }}>FindSolace</a> — also built by Joachim Naakureh
          </p>
        </div>

      </div>
    </>
  )
}
