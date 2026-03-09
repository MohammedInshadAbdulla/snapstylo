"use client";

import { useEffect, useRef } from 'react';
import Link from 'next/link';

export default function Home() {
  const revealRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

    const currentRefs = revealRefs.current;
    currentRefs.forEach(ref => {
      if (ref) observer.observe(ref);
    });

    return () => {
      currentRefs.forEach(ref => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  const addToRefs = (el: HTMLDivElement | null) => {
    if (el && !revealRefs.current.includes(el)) {
      revealRefs.current.push(el);
    }
  };

  return (
    <main>
      {/* ====================== NAVIGATION ====================== */}
      <header className="nav" id="nav">
        <div className="container">
          <div className="nav__inner">
            <Link href="/" className="nav__logo">
              <div className="nav__logo-mark">
                <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="18" cy="18" r="13" stroke="#C9A84C" strokeWidth="1.2" opacity="0.5" />
                  <circle cx="18" cy="18" r="8" stroke="#C9A84C" strokeWidth="1.5" />
                  <circle cx="18" cy="18" r="3.5" fill="#C9A84C" />
                  <line x1="18" y1="5" x2="18" y2="10" stroke="#C9A84C" strokeWidth="1.2" opacity="0.6" />
                  <line x1="18" y1="26" x2="18" y2="31" stroke="#C9A84C" strokeWidth="1.2" opacity="0.6" />
                  <line x1="5" y1="18" x2="10" y2="18" stroke="#C9A84C" strokeWidth="1.2" opacity="0.6" />
                  <line x1="26" y1="18" x2="31" y2="18" stroke="#C9A84C" strokeWidth="1.2" opacity="0.6" />
                  <line x1="28" y1="8" x2="24" y2="12" stroke="#E2C06A" strokeWidth="1" opacity="0.8" />
                  <line x1="30" y1="12" x2="26.5" y2="13.5" stroke="#E2C06A" strokeWidth="1" opacity="0.5" />
                  <line x1="24" y1="6" x2="23" y2="9.5" stroke="#E2C06A" strokeWidth="1" opacity="0.5" />
                </svg>
              </div>
              <span className="nav__logo-text">Snap<span>Stylo</span></span>
            </Link>

            <nav>
              <ul className="nav__links">
                <li><a href="#styles">Styles</a></li>
                <li><a href="#how">How It Works</a></li>
                <li><a href="#gallery">Gallery</a></li>
                <li><a href="#pricing">Pricing</a></li>
              </ul>
            </nav>

            <div className="nav__actions">
              <Link href="/login" className="btn btn-ghost">Sign In</Link>
              <Link href="/register" className="btn btn-primary">Start Free Trial</Link>
            </div>
          </div>
        </div>
      </header>

      {/* ====================== HERO ====================== */}
      <section className="hero">
        <div className="hero__grid-lines" aria-hidden="true">
          <svg viewBox="0 0 1400 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
            <line x1="0" y1="150" x2="1400" y2="150" stroke="#C9A84C" strokeWidth="0.5" />
            <line x1="0" y1="300" x2="1400" y2="300" stroke="#C9A84C" strokeWidth="0.5" />
            <line x1="0" y1="600" x2="1400" y2="600" stroke="#C9A84C" strokeWidth="0.5" />
            <line x1="0" y1="750" x2="1400" y2="750" stroke="#C9A84C" strokeWidth="0.5" />
            <line x1="200" y1="0" x2="200" y2="900" stroke="#C9A84C" strokeWidth="0.5" />
            <line x1="500" y1="0" x2="500" y2="900" stroke="#C9A84C" strokeWidth="0.5" />
            <line x1="900" y1="0" x2="900" y2="900" stroke="#C9A84C" strokeWidth="0.5" />
            <line x1="1200" y1="0" x2="1200" y2="900" stroke="#C9A84C" strokeWidth="0.5" />
            <line x1="0" y1="900" x2="700" y2="0" stroke="#C9A84C" strokeWidth="0.3" />
            <line x1="700" y1="900" x2="1400" y2="0" stroke="#C9A84C" strokeWidth="0.3" />
          </svg>
        </div>

        <div className="hero__content" ref={addToRefs}>
          <div className="tag hero__eyebrow">
            <span className="dot"></span>
            Powered by FLUX 1.1 Pro · Now Live
          </div>

          <h1 className="hero__headline">
            Transform<br />Portraits into<br /><em>Masterpieces</em>
          </h1>

          <p className="hero__sub">
            The elite AI photo studio — where every portrait becomes a cinematic statement. Professional-grade transformations in seconds.
          </p>

          <div className="hero__cta">
            <Link href="/register" className="btn btn-primary btn-lg">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
              Start Creating
            </Link>
            <a href="#gallery" className="btn btn-ghost btn-lg">View Gallery</a>
          </div>

          <div className="hero__stats">
            <div className="hero__stat">
              <div className="hero__stat-num">2.4<span>M+</span></div>
              <div className="hero__stat-label">Portraits Created</div>
            </div>
            <div className="hero__stat-divider"></div>
            <div className="hero__stat">
              <div className="hero__stat-num">48<span>+</span></div>
              <div className="hero__stat-label">Artistic Styles</div>
            </div>
            <div className="hero__stat-divider"></div>
            <div className="hero__stat">
              <div className="hero__stat-num">4<span>K</span></div>
              <div className="hero__stat-label">Output Resolution</div>
            </div>
            <div className="hero__stat-divider"></div>
            <div className="hero__stat">
              <div className="hero__stat-num">&lt;30<span>s</span></div>
              <div className="hero__stat-label">Generation Time</div>
            </div>
          </div>
        </div>

        <div className="scroll-hint" aria-hidden="true">
          <span>Scroll</span>
          <div className="scroll-hint__line"></div>
        </div>
      </section>

      {/* ====================== STYLES STRIP ====================== */}
      <section className="styles-strip" id="styles">
        <div className="styles-strip__header reveal" ref={addToRefs}>
          <div>
            <div className="tag" style={{ marginBottom: '16px' }}>
              <span className="dot"></span> 48 Unique Styles
            </div>
            <h2 className="section-title">Curated<br /><em>Aesthetic</em> Styles</h2>
          </div>
          <p className="section-sub">From noir cinema to baroque oil painting — every style is precision-tuned by visual artists.</p>
        </div>

        <div className="styles-grid reveal" ref={addToRefs}>
          {[
            { id: 1, name: "Crimson Noir", label: "Style 01", desc: "High-contrast shadows with deep red undertones. Inspired by classic film noir." },
            { id: 2, name: "Arctic Blueprint", label: "Style 02", desc: "Cold steel tones and precise geometric framing. Architectural minimalism." },
            { id: 3, name: "Emerald Forest", label: "Style 03", desc: "Rich botanical greens with organic, painterly strokes." },
            { id: 4, name: "Amber Renaissance", label: "Style 04", desc: "Warm golden-hour palette with Old Masters chiaroscuro depth." },
            { id: 5, name: "Violet Dream", label: "Style 05", desc: "Surreal purple haze with soft, dream-like diffusion." }
          ].map((style) => (
            <div className="style-card" key={style.id}>
              <div className="style-card__bg"></div>
              <div className="style-card__overlay"></div>
              <div className="style-card__corner">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </div>
              <div className="style-card__body">
                <span className="style-card__label">{style.label}</span>
                <h3 className="style-card__name" dangerouslySetInnerHTML={{ __html: style.name.replace(' ', '<br/>') }}></h3>
                <p className="style-card__desc">{style.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ====================== HOW IT WORKS ====================== */}
      <section className="how" id="how">
        <div className="container">
          <div className="how__header reveal" ref={addToRefs}>
            <div className="tag" style={{ marginBottom: '20px' }}><span className="dot"></span>Simple Process</div>
            <h2 className="section-title">Three Steps to<br /><em>Brilliance</em></h2>
          </div>

          <div className="steps reveal" ref={addToRefs}>
            {[
              { num: "01", title: "Upload Your Portrait", body: "Drag & drop or browse for any portrait. Supports JPEG, PNG, HEIC, and RAW files up to 50MB. Our pre-processing engine auto-detects faces and optimal crop zones." },
              { num: "02", title: "Select Your Style", body: "Choose from 48 curated artistic presets — from Renaissance portraiture to cyberpunk neon. Fine-tune intensity, mood, and color grading with precision sliders." },
              { num: "03", title: "Download & Share", body: "Your transformed portrait renders at full 4K resolution in under 30 seconds via FLUX 1.1 Pro. Download in JPEG, PNG, or TIFF — print-ready and social-ready." }
            ].map((step) => (
              <div className="step" key={step.num}>
                <div className="step__num">{step.num}</div>
                <h3 className="step__title">{step.title}</h3>
                <p className="step__body">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====================== DEMO PANEL ====================== */}
      <section className="demo">
        <div className="container">
          <div className="demo__inner">
            <div className="demo__copy reveal" ref={addToRefs}>
              <div className="tag"><span className="dot"></span>Upload & Transform</div>
              <h2 className="section-title" style={{ textAlign: 'left' }}>Your Studio.<br /><em>Your Vision.</em></h2>
              <p className="section-sub" style={{ textAlign: 'left', maxWidth: '420px' }}>A professional-grade workspace designed for speed. Every control exactly where you need it.</p>

              <div className="demo__features">
                {[
                  { title: "Lossless Quality", desc: "Outputs preserve full 4K fidelity. No compression artifacts, no quality loss." },
                  { title: "Sub-30 Second Generation", desc: "FLUX 1.1 Pro processes transformations on dedicated H100 clusters." },
                  { title: "Batch Processing", desc: "Upload up to 50 portraits and apply one style across all simultaneously." }
                ].map((f, i) => (
                  <div className="demo__feature" key={i}>
                    <div>
                      <div className="demo__feature-title">{f.title}</div>
                      <div className="demo__feature-desc">{f.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="upload-panel reveal" ref={addToRefs}>
              <div className="upload-panel__header">
                <span className="upload-panel__title">AI Transform Studio</span>
                <div className="upload-panel__status"><span className="dot"></span> Ready</div>
              </div>
              <div className="upload-panel__body">
                <div className="drop-zone">
                  <div className="drop-zone__icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                  </div>
                  <div className="drop-zone__title">Drop your portrait here</div>
                  <div className="drop-zone__sub">or click to browse files</div>
                </div>

                <div className="style-selector">
                  <div className="style-selector__label">Quick Style</div>
                  <div className="style-pills">
                    {["Cinematic", "Oil Paint", "Noir", "Watercolor", "Baroque"].map((s, i) => (
                      <button key={i} className={`style-pill ${i === 0 ? 'active' : ''}`}>{s}</button>
                    ))}
                  </div>
                </div>

                <Link href="/dashboard" className="btn btn-primary generate-btn">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                  Generate Transform
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================== GALLERY ====================== */}
      <section className="gallery" id="gallery">
        <div className="gallery__header reveal" ref={addToRefs}>
          <div className="tag" style={{ marginBottom: '20px' }}><span className="dot"></span>Community Gallery</div>
          <h2 className="section-title">Created with<br /><em>SnapStylo</em></h2>
        </div>

        <div className="gallery-masonry reveal" ref={addToRefs}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div className="gallery-item" key={i}>
              <div className="gallery-placeholder" style={{ background: `var(--ink-${(i % 4) + 1})` }}></div>
            </div>
          ))}
        </div>
      </section>

      {/* ====================== FOOTER ====================== */}
      <footer className="footer">
        <div className="container">
          <div className="footer__top">
            <div className="footer__brand">
              <Link href="/" className="nav__logo">
                <span className="nav__logo-text">Snap<span>Stylo</span></span>
              </Link>
              <p>The elite AI photo studio. Powered by FLUX 1.1 Pro. Transform portraits into cinematic masterpieces.</p>
            </div>
            <div>
              <div className="footer__col-title">Product</div>
              <ul className="footer__links">
                <li><Link href="/dashboard">Studio</Link></li>
                <li><Link href="/pricing">Pricing</Link></li>
                <li><Link href="/gallery">Gallery</Link></li>
              </ul>
            </div>
          </div>
          <div className="footer__bottom">
            <span className="footer__copy">© 2026 SnapStylo · All rights reserved</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
