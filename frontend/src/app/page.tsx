"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import Nav from '@/components/Nav';

export default function Home() {
  const revealRefs = useRef<HTMLElement[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const [particles, setParticles] = useState<{ left: string; top: string; delay: string; duration: string; size: string; opacity: number }[]>([]);

  const addRef = (el: HTMLElement | null) => {
    if (el && !revealRefs.current.includes(el)) {
      revealRefs.current.push(el);
    }
  };

  useEffect(() => {
    // Fix Hydration Mismatch: Generate particles on client only
    const p = [...Array(40)].map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${Math.random() * 5}s`,
      duration: `${10 + Math.random() * 20}s`,
      size: `${1 + Math.random() * 2}px`,
      opacity: 0.1 + Math.random() * 0.2
    }));
    setParticles(p);

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1
    });

    revealRefs.current.forEach(ref => {
      if (ref) observer.observe(ref);
    });

    return () => {
      observer.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "SnapStylo",
    "operatingSystem": "Web",
    "applicationCategory": "MultimediaApplication",
    "offers": {
      "@type": "Offer",
      "price": "9.00",
      "priceCurrency": "USD"
    },
    "description": "The elite AI photo studio — where every portrait becomes a cinematic statement. Professional-grade transformations in seconds via FLUX 1.1 Pro."
  };

  return (
    <main style={{ position: 'relative', overflow: 'hidden' }}>
      <div className="noise-overlay" />
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ═══════ INTERACTIVE OVERLAYS ═══════ */}
      <div
        className="cursor-glow"
        style={{
          left: mousePos.x,
          top: mousePos.y,
          transform: 'translate(-50%, -50%)'
        }}
      />

      {particles.map((p, i) => (
        <div
          key={i}
          className="particle"
          style={{
            left: p.left,
            top: p.top,
            animationDelay: p.delay,
            animationDuration: p.duration,
            width: p.size,
            height: p.size,
            opacity: p.opacity
          }}
        />
      ))}

      {/* ═══════ AMBIENT GLOWS ═══════ */}
      <div className="bg-glow glow-amber" style={{ top: '5%', left: '-10%', opacity: 0.15 }}></div>
      <div className="bg-glow glow-violet" style={{ top: '30%', right: '-10%', opacity: 0.1, width: '800px', height: '800px' }}></div>
      <div className="bg-glow glow-cyan" style={{ top: '60%', left: '-5%', opacity: 0.08 }}></div>
      <div className="bg-glow glow-amber" style={{ bottom: '10%', right: '0%', opacity: 0.12 }}></div>

      <Nav />
      {/* ═══════ HERO ═══════ */}
      <section className="hero">
        <div className="hero__bg-grid">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
                <path d="M 100 0 L 0 0 0 100" fill="none" stroke="rgba(201, 168, 76, 0.04)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            <line x1="200" y1="0" x2="200" y2="900" stroke="#C9A84C" strokeWidth="0.5" />
            <line x1="1200" y1="0" x2="1200" y2="900" stroke="#C9A84C" strokeWidth="0.5" />
          </svg>
        </div>

        {/* Floating Accent Orb */}
        <div className="bg-glow glow-amber" style={{ top: '20%', left: '50%', transform: 'translateX(-50%)', width: '400px', height: '400px', opacity: 0.2 }}></div>

        <div className="hero__content">
          <div className="tag hero__eyebrow">
            <span className="dot"></span>
            Powered by FLUX 1.1 Pro · Now Live
          </div>
          <h1 className="hero__headline">Transform<br />Portraits into<br /><em>Masterpieces</em></h1>
          <p className="hero__sub">The elite AI photo studio — where every portrait becomes a cinematic statement. Professional-grade transformations in seconds.</p>
          <div className="hero__cta">
            <Link href="/register" className="btn btn-primary btn-lg">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3" /></svg>
              Start Creating
            </Link>
            <a href="#gallery" className="btn btn-ghost btn-lg">View Gallery</a>
          </div>
          <div className="hero__stats">
            <div className="hero__stat">
              <div className="hero__stat-num">2.4<span>M+</span></div>
              <div className="hero__stat-label">Portraits Created</div>
            </div>
            <div className="hero__stat-divider" />
            <div className="hero__stat">
              <div className="hero__stat-num">48<span>+</span></div>
              <div className="hero__stat-label">Artistic Styles</div>
            </div>
            <div className="hero__stat-divider" />
            <div className="hero__stat">
              <div className="hero__stat-num">4<span>K</span></div>
              <div className="hero__stat-label">Output Resolution</div>
            </div>
            <div className="hero__stat-divider" />
            <div className="hero__stat">
              <div className="hero__stat-num">&lt;30<span>s</span></div>
              <div className="hero__stat-label">Generation Time</div>
            </div>
          </div>
        </div>
        <div className="scroll-hint" aria-hidden="true">
          <span>Scroll</span>
          <div className="scroll-hint__line" />
        </div>
      </section>

      {/* ═══════ STYLES ═══════ */}
      <section className="styles-strip" id="styles">
        <div className="container" style={{ position: 'relative' }}>
          <div className="styles-strip__header reveal" ref={addRef}>
            <div>
              <div className="tag" style={{ marginBottom: 16 }}><span className="dot" /> 48 Unique Styles</div>
              <h2 className="section-title">Curated<br /><em>Aesthetic</em> Styles</h2>
            </div>
            <p className="section-sub">From noir cinema to baroque oil painting — every style is precision-tuned by visual artists.</p>
          </div>
          <div className="styles-grid reveal" ref={addRef}>
            {[
              { name: 'Crimson\nNoir', label: 'Style 01', desc: 'High-contrast shadows with deep red undertones.' },
              { name: 'Arctic\nBlueprint', label: 'Style 02', desc: 'Cold steel tones and precise geometric framing.' },
              { name: 'Emerald\nForest', label: 'Style 03', desc: 'Rich botanical greens with organic strokes.' },
              { name: 'Gilded\nBaroque', label: 'Style 04', desc: 'Classical lighting with ornate gold detailing.' },
              { name: 'Midnight\nCyber', label: 'Style 05', desc: 'Neon highlights against obsidian deep space.' }
            ].map((s, i) => (
              <div className="style-card" key={i}>
                <div className="style-card__bg" />
                <div className="style-card__overlay" />
                <div className="style-card__corner">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
                </div>
                <div className="style-card__body">
                  <div className="style-card__label">{s.label}</div>
                  <h3 className="style-card__name">{s.name}</h3>
                  <p className="style-card__desc">{s.desc}</p>
                  <Link href="/register" className="style-card__link">
                    Select <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ HOW IT WORKS ═══════ */}
      <section className="how" id="how">
        <div className="container" style={{ position: 'relative' }}>
          <div className="bg-glow glow-violet" style={{ top: '0', right: '-20%', width: '600px', height: '600px', opacity: 0.1 }}></div>
          <div className="how__header reveal" ref={addRef}>
            <div className="tag"><span className="dot" />Process</div>
            <h2 className="section-title">Studio-Grade<br /><em>Workflow</em></h2>
          </div>

          <div className="steps reveal" ref={addRef}>
            {[
              { n: '01', t: 'Upload Baseline', b: 'Start with a high-resolution portrait. Our AI analyzes facial geometry and lighting for perfect restoration.' },
              { n: '02', t: 'Select Your Style', b: 'Choose from 48 curated artistic presets — from Renaissance portraiture to cyberpunk neon.' },
              { n: '03', t: 'Download & Share', b: 'Your portrait renders at full 4K in under 30 seconds via FLUX 1.1 Pro. Print-ready and social-ready.' }
            ].map(s => (
              <div className="step" key={s.n}>
                <div className="step__num">{s.n}</div>
                <h3 className="step__title">{s.t}</h3>
                <p className="step__body">{s.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ DEMO PANEL ═══════ */}
      <section className="demo">
        <div className="container">
          <div className="demo__inner">
            <div className="demo__copy reveal" ref={addRef}>
              <div className="tag"><span className="dot" />Upload &amp; Transform</div>
              <h2 className="section-title">Your Studio.<br /><em>Your Vision.</em></h2>
              <p className="section-sub" style={{ textAlign: 'left' }}>A professional-grade workspace designed for speed.</p>
              <div className="demo__features">
                {[
                  { t: 'Lossless Quality', d: 'Full 4K output. No compression artifacts.' },
                  { t: 'Sub-30s Generation', d: 'FLUX 1.1 Pro on dedicated H100 clusters.' },
                  { t: 'Batch Processing', d: 'Up to 50 portraits with one style at once.' }
                ].map((f, i) => (
                  <div className="demo__feature" key={i}>
                    <div>
                      <div className="demo__feature-title">{f.t}</div>
                      <div className="demo__feature-desc">{f.d}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="upload-panel reveal" ref={addRef}>
              <div className="upload-panel__header">
                <span>AI Transform Studio</span>
                <div className="upload-panel__status"><span className="dot" /> Ready</div>
              </div>
              <div className="upload-panel__body">
                <Link href="/login" style={{ textDecoration: 'none', display: 'block' }}>
                  <div className="drop-zone">
                    <div className="drop-zone__icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                    </div>
                    <div className="drop-zone__title">Drop your portrait here</div>
                    <div className="drop-zone__sub">Sign in to start creating</div>
                  </div>
                </Link>
                <div className="style-selector">
                  <div className="style-selector__label">Quick Style</div>
                  <div className="style-pills">
                    {['Cinematic', 'Oil Paint', 'Noir', 'Watercolor', 'Baroque'].map((s, i) => (
                      <button key={i} className={`style-pill ${i === 0 ? 'active' : ''}`}>{s}</button>
                    ))}
                  </div>
                </div>
                <Link href="/login" className="btn btn-primary generate-btn">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                  Sign In to Generate
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ STUDIO POWER ═══════ */}
      <section className="studio-power" id="features">
        <div className="container">
          <div className="studio-power__header reveal" ref={addRef} style={{ textAlign: 'center', marginBottom: 64 }}>
            <div className="tag" style={{ marginBottom: 20 }}><span className="dot" />Professional Suite</div>
            <h2 className="section-title">Beyond Simple<br /><em>Generations</em></h2>
            <p style={{ color: 'var(--muted)', marginTop: '20px', maxWidth: '600px', margin: '20px auto' }}>
              SnapStylo gives you the same high-fidelity tools used by professional digital ateliers and photographers.
            </p>
          </div>

          <div className="features-grid reveal" ref={addRef}>
            {[
              { t: 'Resolution Booster', i: '💎', d: 'Intelligent 4K upscaling using Aura-SR. Not just bigger—smarter detail generation for professional printing.' },
              { t: 'Magic Brush', i: '🖌️', d: 'Surgical Generative Fill. Paint over any area to change clothes, add objects, or fix details with FLUX precision.' },
              { t: 'Cinematic Light', i: '💡', d: 'Transform the mood. Change lighting from flat office bulbs to golden hour glow while preserving subject identity.' },
              { t: 'Image Expansion', i: '🖼️', d: 'Professional AI Outpainting. Effortlessly expand tight crops into sprawling cinematic scenes.' },
              { t: 'Studio Backdrop', i: '📸', d: 'Instant background replacement with lighting consistency. Create e-commerce ready lifestyle shots in seconds.' },
              { t: 'Old Photo Fix', i: '⏳', d: 'Complete restoration and colorization suite. Revive historical portraits or low-res photos with AI repair.' }
            ].map((f, i) => (
              <div className="feature-card" key={i}>
                <div className="feature-card__icon">{f.i}</div>
                <h3 className="feature-card__title">{f.t}</h3>
                <p className="feature-card__desc">{f.d}</p>
                <Link href="/login" className="feature-card__link">Enter the Atelier →</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ GALLERY ═══════ */}
      <section className="gallery" id="gallery">
        <div className="container">
          <div className="gallery__header reveal" ref={addRef}>
            <div className="tag" style={{ marginBottom: 20 }}><span className="dot" />Community Gallery</div>
            <h2 className="section-title">Created with<br /><em>SnapStylo</em></h2>
          </div>
          <div className="gallery-masonry reveal" ref={addRef}>
            {[
              '/images/gallery_1.png',
              '/images/gallery_2.png',
              '/images/gallery_3.png',
              '/images/gallery_4.png',
              '/images/gallery_5.png',
              '/images/gallery_6.png'
            ].map((img, i) => (
              <div className="gallery-item" key={i}>
                <div className="gallery-placeholder" style={{ background: `url('${img}') center/cover no-repeat` }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ PRICING ═══════ */}
      <section className="pricing" id="pricing">
        <div className="container">
          <div className="pricing__header reveal" ref={addRef} style={{ textAlign: 'center', marginBottom: 56 }}>
            <div className="tag" style={{ marginBottom: 20 }}><span className="dot" />Simple Pricing</div>
            <h2 className="section-title">Invest in Your<br /><em>Craft</em></h2>
          </div>

          <div className="pricing-grid reveal" ref={addRef}>
            <div className="pricing-card">
              <div className="pricing-card__tier">Starter</div>
              <div className="pricing-card__price"><sup>$</sup>9</div>
              <div className="pricing-card__period">per month · billed monthly</div>
              <div className="pricing-card__divider" />
              <div className="pricing-card__features">
                {['50 transforms / month', 'Full HD output (2K)', '20 style presets', '4K resolution', 'Batch processing', 'Priority render queue'].map((f, i) => (
                  <div className={`pricing-feature ${i > 2 ? 'disabled' : ''}`} key={i}>
                    {i <= 2 ? (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><polyline points="20 6 9 17 4 12" /></svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                    )}
                    {f}
                  </div>
                ))}
              </div>
              <Link href="/register" className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center', borderColor: 'rgba(255,255,255,0.1)', padding: 14 }}>Get Started</Link>
            </div>

            <div className="pricing-card featured">
              <div className="pricing-card__badge">Most Popular</div>
              <div className="pricing-card__tier">Pro</div>
              <div className="pricing-card__price"><sup>$</sup>29</div>
              <div className="pricing-card__period">per month · billed monthly</div>
              <div className="pricing-card__divider" />
              <div className="pricing-card__features">
                {['300 transforms / month', '4K Ultra HD output', 'All 48 style presets', 'Batch processing (10)', 'Priority render queue', 'Custom style training'].map((f, i) => (
                  <div className="pricing-feature" key={i}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><polyline points="20 6 9 17 4 12" /></svg>
                    {f}
                  </div>
                ))}
              </div>
              <Link href="/register" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: 14 }}>Upgrade Now →</Link>
            </div>

            <div className="pricing-card">
              <div className="pricing-card__tier">Studio</div>
              <div className="pricing-card__price"><sup>$</sup>79</div>
              <div className="pricing-card__period">per month · billed monthly</div>
              <div className="pricing-card__divider" />
              <div className="pricing-card__features">
                {['Unlimited transforms', '4K + TIFF export', 'All 48 style presets', 'Batch processing (50)', 'Dedicated render nodes', 'Custom style training'].map((f, i) => (
                  <div className="pricing-feature" key={i}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><polyline points="20 6 9 17 4 12" /></svg>
                    {f}
                  </div>
                ))}
              </div>
              <Link href="/register" className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center', borderColor: 'rgba(255,255,255,0.1)', padding: 14 }}>Get Started</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ FOOTER ═══════ */}
      <footer className="footer">
        <div className="container">
          <div className="footer__top">
            <div className="footer__brand">
              <div className="footer__logo">SNAPSTYLO</div>
              <p className="footer__tagline">The elite AI photo studio for creators and models.</p>
            </div>
            <div className="footer__grid">
              <div className="footer__col">
                <div className="footer__col-title">Studio</div>
                <ul className="footer__links">
                  <li><a href="#styles">Artistic Styles</a></li>
                  <li><a href="#gallery">Gallery</a></li>
                  <li><a href="#how">Process</a></li>
                </ul>
              </div>
              <div className="footer__col">
                <div className="footer__col-title">Account</div>
                <ul className="footer__links">
                  <li><Link href="/login">Sign In</Link></li>
                  <li><Link href="/register">Create Studio</Link></li>
                  <li><Link href="/pricing">Pricing</Link></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="footer__bottom">
            <div className="footer__copy">© 2026 SNAPSTYLO ATELIER. ALL RIGHTS RESERVED.</div>
            <div className="footer__links" style={{ flexDirection: 'row', gap: 20 }}>
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
