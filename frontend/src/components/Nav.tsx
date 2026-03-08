"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function Nav() {
    const pathname = usePathname();
    const [credits, setCredits] = useState<number | null>(null);

    useEffect(() => {
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
    }, [pathname]);

    return (
        <nav>
            <div className="nav-inner">
                <div className="nav-logo">STYLR</div>
                <div className="nav-tabs">
                    <Link href="/" className={`nav-tab ${pathname === '/' ? 'active' : ''}`}>
                        Overview
                    </Link>
                    <Link href="/dashboard" className={`nav-tab ${pathname === '/dashboard' ? 'active' : ''}`}>
                        Dashboard
                    </Link>
                    <Link href="/gallery" className={`nav-tab ${pathname === '/gallery' ? 'active' : ''}`}>
                        Gallery
                    </Link>
                    <Link href="/pricing" className={`nav-tab ${pathname === '/pricing' ? 'active' : ''}`}>
                        Pricing
                    </Link>
                </div>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: '12px', alignItems: 'center' }}>
                    {credits !== null ? (
                        <>
                            <div className="credit-pill">
                                <div className="credit-coin">◈</div>
                                <span>{credits}</span>
                            </div>
                            <div className="avatar" title="Sign Out" onClick={() => {
                                localStorage.removeItem('token');
                                window.location.href = '/';
                            }} style={{ cursor: 'pointer' }}>U</div>
                        </>
                    ) : (
                        <Link href="/login" className="btn btn-secondary btn-sm">Sign In</Link>
                    )}
                </div>
            </div>
        </nav>
    );
}
