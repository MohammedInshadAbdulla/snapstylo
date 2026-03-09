"use client";

import { useState } from 'react';
import Nav from '@/components/Nav';

const PACKAGES = [
    { id: 'starter', name: 'STARTER', credits: 20, price: 9, description: 'Perfect for a quick profile refresh.', badge: 'POPULAR' },
    { id: 'pro', name: 'PRO STUDIO', credits: 100, price: 29, description: 'Unlimited styles for enthusiasts.', badge: 'BEST VALUE' },
    { id: 'enterprise', name: 'AGENCY', credits: 500, price: 99, description: 'Bulk generation for professionals.', badge: 'HIGH VOLUME' },
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
                throw new Error('Failed to create checkout session');
            }
        } catch (err) {
            alert('Checkout error. Please ensure your backend is running.');
        } finally {
            setIsLoading(null);
        }
    };

    return (
        <main>
            <Nav />
            <div className="page" style={{ paddingTop: 'calc(var(--nav-h) + 40px)', paddingBottom: '80px' }}>
                <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <div className="section-label">THE STUDIO STORE</div>
                    <h2 className="section-title">FUEL YOUR<br /><span>CREATIVITY</span></h2>
                    <p style={{ color: 'var(--muted)', marginTop: '16px', maxWidth: '500px', margin: '16px auto' }}>
                        Choose a credit package to unlock ultra-high resolution generations
                        and premium styles.
                    </p>
                </div>

                <div className="demo-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                    {PACKAGES.map((pkg) => (
                        <div key={pkg.id} className="demo-block" data-label={pkg.name} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ fontSize: '48px', fontWeight: '600', color: 'var(--amber)', fontFamily: 'var(--font-cormorant)' }}>
                                    {pkg.credits}<span style={{ fontSize: '16px', color: 'var(--muted)', marginLeft: '8px' }}>CREDITS</span>
                                </div>
                                {pkg.badge && <div className="style-card-badge badge-pro">{pkg.badge}</div>}
                            </div>

                            <div style={{ height: '2px', background: 'var(--ink-40)' }}></div>

                            <p style={{ color: 'var(--muted)', fontSize: '14px', lineHeight: '1.6' }}>{pkg.description}</p>

                            <div style={{ fontSize: '24px', fontWeight: '500' }}>
                                ${pkg.price}<span style={{ fontSize: '14px', color: 'var(--muted)', fontWeight: '400' }}> / one-time</span>
                            </div>

                            <button
                                className={`btn btn-primary btn-lg ${isLoading === pkg.id ? 'disabled' : ''}`}
                                onClick={() => handlePurchase(pkg.id)}
                                disabled={!!isLoading}
                                style={{ width: '100%' }}
                            >
                                {isLoading === pkg.id ? 'Loading...' : 'Purchase Now'}
                            </button>
                        </div>
                    ))}
                </div>

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
