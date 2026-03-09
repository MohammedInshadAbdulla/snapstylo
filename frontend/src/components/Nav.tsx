"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function Nav() {
    const pathname = usePathname();
    const [credits, setCredits] = useState<number | null>(null);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll, { passive: true });

        const fetchUser = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/users/me`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                setCredits(data.credit_balance);
            } catch (e) { }
        };
        fetchUser();

        return () => window.removeEventListener('scroll', handleScroll);
    }, [pathname]);

    return (
        <header className={`site-nav ${scrolled ? 'scrolled' : ''}`}>
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
                        </svg>
                    </div>
                    <span className="nav__logo-text">Snap<span>Stylo</span></span>
                </Link>

                <ul className="nav__links">
                    <li><Link href="/dashboard" className={pathname === '/dashboard' ? 'active' : ''}>Studio</Link></li>
                    <li><Link href="/gallery" className={pathname === '/gallery' ? 'active' : ''}>Gallery</Link></li>
                    <li><Link href="/pricing" className={pathname === '/pricing' ? 'active' : ''}>Pricing</Link></li>
                </ul>

                <div className="nav__actions">
                    {credits !== null ? (
                        <>
                            <div className="tag" style={{ border: 'none', background: 'rgba(201,168,76,0.1)' }}>
                                <span className="dot"></span>
                                {credits} Credits
                            </div>
                            <button
                                className="btn btn-ghost btn-sm"
                                onClick={() => {
                                    localStorage.removeItem('token');
                                    window.location.href = '/';
                                }}
                            >
                                Sign Out
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className="btn btn-ghost">Sign In</Link>
                            <Link href="/register" className="btn btn-primary">Get Started</Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
