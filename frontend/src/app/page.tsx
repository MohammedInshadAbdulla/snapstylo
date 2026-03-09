import Link from 'next/link';

export default function Home() {
  return (
    <main>
      {/* NAV */}
      <nav>
        <div className="nav-inner">
          <div className="nav-logo">SNAPSTYLO</div>
          <div className="nav-tabs">
            <button className="nav-tab active">Overview</button>
            <button className="nav-tab">Gallery</button>
            <button className="nav-tab">Styles</button>
            <button className="nav-tab">Pricing</button>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '12px', alignItems: 'center' }}>
            <Link href="/login" className="nav-tab">Login</Link>
            <Link href="/register" className="btn btn-primary btn-sm">Get Started</Link>
          </div>
        </div>
      </nav>

      <div className="page">
        {/* HERO */}
        <div className="hero">
          <div className="hero-bg"></div>
          <div className="hero-tag">AI-POWERED GENERATION</div>
          <h1 className="hero-headline">
            SNAP<br /><span>STYLO</span><br />AI STUDIO
          </h1>
          <p className="hero-desc">
            Transform your portraits into cinematic masterpieces.
            Professional AI styling, face restoration, and high-fidelity output in seconds.
          </p>
          <div className="hero-actions">
            <Link href="/register" className="btn btn-primary btn-lg">Start Creating →</Link>
            <button className="btn btn-secondary btn-lg">Explore Styles</button>
          </div>
        </div>

        {/* SECTION PREVIEW */}
        <section className="section">
          <div className="section-label">01 — The Experience</div>
          <h2 className="section-title">ONE CLICK.<br />INFINITE STYLE.</h2>
          <p className="section-sub">
            Our pipeline combines state-of-the-art models with custom face restoration
            to ensure every generation is social-media ready.
          </p>

          <div className="demo-grid">
            <div className="demo-block" data-label="PIPELINE PREVIEW">
              <div className="stat-row">
                <div className="stat-card">
                  <div className="stat-label">GEN TIME</div>
                  <div className="stat-value">~14s</div>
                  <div className="stat-delta">p95 optimization</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">RESOLUTION</div>
                  <div className="stat-value">4K</div>
                  <div className="stat-delta">premium tier</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">STYLES</div>
                  <div className="stat-value">24+</div>
                  <div className="stat-delta">trained LoRAs</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">MODELS</div>
                  <div className="stat-value">FLUX</div>
                  <div className="stat-delta">state of the art</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{ padding: '80px 20px', borderTop: '1px solid var(--border)', marginTop: '80px' }}>
          <div className="nav-inner" style={{ flexDirection: 'column', gap: '40px', alignItems: 'flex-start' }}>
            <div className="nav-logo" style={{ fontSize: '32px' }}>SNAPSTYLO</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', width: '100%', gap: '40px' }}>
              <div>
                <div style={{ color: 'var(--amber)', fontSize: '13px', fontWeight: 600, marginBottom: '20px' }}>PRODUCT</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', color: 'var(--muted)' }}>
                  <Link href="/dashboard" style={{ color: 'inherit', textDecoration: 'none' }}>Studio</Link>
                  <Link href="/gallery" style={{ color: 'inherit', textDecoration: 'none' }}>Gallery</Link>
                  <Link href="/pricing" style={{ color: 'inherit', textDecoration: 'none' }}>Pricing</Link>
                </div>
              </div>
              <div>
                <div style={{ color: 'var(--amber)', fontSize: '13px', fontWeight: 600, marginBottom: '20px' }}>COMPANY</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', color: 'var(--muted)' }}>
                  <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>About</a>
                  <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Contact</a>
                  <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Terms</a>
                </div>
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <div style={{ color: 'var(--amber)', fontSize: '13px', fontWeight: 600, marginBottom: '20px' }}>NEWSLETTER</div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input className="form-input" placeholder="Enter your email" style={{ maxWidth: '250px' }} />
                  <button className="btn btn-primary btn-sm">Join</button>
                </div>
              </div>
            </div>
            <div style={{ width: '100%', paddingTop: '40px', borderTop: '1px solid var(--border)', fontSize: '12px', color: 'var(--muted)', display: 'flex', justifyContent: 'space-between' }}>
              <span>© 2026 SNAPSTYLO AI. ALL RIGHTS RESERVED.</span>
              <div style={{ display: 'flex', gap: '20px' }}>
                <span>INSTAGRAM</span>
                <span>TWITTER</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
