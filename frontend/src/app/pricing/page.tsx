"use client";

import { useState } from 'react';
import Nav from '@/components/Nav';
import Link from 'next/link';

const PACKAGES = [
    {
        id: 'starter',
        name: 'Starter',
        price: 9,
        period: 'per month · billed monthly',
        features: ['50 transforms / month', 'Full HD output (2K)', '20 style presets'],
        disabledFeatures: ['4K resolution', 'Batch processing', 'Priority render queue']
    },
    {
        id: 'pro',
        name: 'Pro',
        price: 29,
        period: 'per month · billed monthly',
        badge: 'Most Popular',
        features: ['300 transforms / month', '4K Ultra HD output', 'All 48 style presets', 'Batch processing (10)', 'Priority render queue', 'Custom style training'],
        disabledFeatures: []
    },
    {
        id: 'studio',
        name: 'Studio',
        price: 79,
        period: 'per month · billed monthly',
        features: ['Unlimited transforms', '4K + TIFF export', 'All 48 style presets', 'Batch processing (50)', 'Dedicated render nodes', 'Custom style training'],
        disabledFeatures: []
    },
];

export default function Pricing() {
    const [isLoading, setIsLoading] = useState<string | null>(null);

    const handlePurchase = async (packageId: string) => {
        setIsLoading(packageId);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                window.location.href = '/login';
                return;
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/payments/create-checkout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ package_id: packageId })
            });

            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                throw new Error(data.detail || 'Failed to create checkout session');
            }
        } catch (err: any) {
            alert(err.message || 'Checkout error. Please ensure your backend is running.');
        } finally {
            setIsLoading(null);
        }
    };

    return (
        <main>
            <Nav />
            <div className="page" style={{ paddingTop: 'calc(var(--nav-h) + 40px)', paddingBottom: '80px' }}>
                <section className="pricing" style={{ padding: '40px 0' }}>
                    <div className="container">
                        <div className="pricing__header" style={{ textAlign: 'center', marginBottom: '56px' }}>
                            <div className="tag" style={{ marginBottom: 20 }}>
                                <span className="dot" />
                                Simple Pricing
                            </div>
                            <h2 className="section-title">Upgrade Your<br /><em>Creative Studio</em></h2>
                            <p style={{ color: 'var(--muted)', marginTop: '16px', maxWidth: '500px', margin: '16px auto' }}>
                                Choose a professional plan to unlock ultra-high resolution generations
                                and premium artistic styles.
                            </p>
                        </div>

                        <div className="pricing-grid">
                            {PACKAGES.map((pkg) => (
                                <div key={pkg.id} className={`pricing-card ${pkg.badge ? 'featured' : ''}`}>
                                    {pkg.badge && <div className="pricing-card__badge">{pkg.badge}</div>}
                                    <div className="pricing-card__tier">{pkg.name}</div>
                                    <div className="pricing-card__price">
                                        <sup>$</sup>{pkg.price}
                                    </div>
                                    <div className="pricing-card__period">{pkg.period}</div>
                                    <div className="pricing-card__divider" />

                                    <div className="pricing-card__features">
                                        {pkg.features.map((f, i) => (
                                            <div className="pricing-feature" key={i}>
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                                                    <polyline points="20 6 9 17 4 12" />
                                                </svg>
                                                {f}
                                            </div>
                                        ))}
                                        {pkg.disabledFeatures.map((f, i) => (
                                            <div className="pricing-feature disabled" key={`d${i}`}>
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                                                    <line x1="18" y1="6" x2="6" y2="18" />
                                                    <line x1="6" y1="6" x2="18" y2="18" />
                                                </svg>
                                                {f}
                                            </div>
                                        ))}
                                    </div>

                                    <button
                                        className={`btn ${pkg.badge ? 'btn-primary' : 'btn-ghost'} ${isLoading === pkg.id ? 'disabled' : ''}`}
                                        onClick={() => handlePurchase(pkg.id)}
                                        disabled={!!isLoading}
                                        style={{
                                            width: '100%',
                                            justifyContent: 'center',
                                            padding: '14px',
                                            borderRadius: pkg.badge ? '12px' : 'var(--radius-md)',
                                            borderColor: pkg.badge ? 'none' : 'rgba(255,255,255,0.1)'
                                        }}
                                    >
                                        {isLoading === pkg.id ? 'Processing...' : 'Upgrade Now →'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <div style={{ marginTop: '80px', textAlign: 'center', opacity: 0.6 }}>
                    <div className="stat-row" style={{ justifyContent: 'center', border: 'none' }}>
                        <div className="stat-card">
                            <div className="stat-label">TRUSTED BY</div>
                            <div className="stat-value">2.4k+</div>
                            <div className="stat-delta">active creators</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-label">SECURE</div>
                            <div className="stat-value">SSL</div>
                            <div className="stat-delta">encrypted payments</div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
