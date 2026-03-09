"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { parseError } from '@/lib/error-utils';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append('username', email);
            formData.append('password', password);

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/auth/login`, {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();

            if (!res.ok) throw data;

            localStorage.setItem('token', data.access_token);
            router.push('/dashboard');
        } catch (err: any) {
            setError(parseError(err));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
            <div className="demo-block" style={{ width: '100%', maxWidth: '400px', padding: '48px 32px' }} data-label="SECURE ACCESS">
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <h2 className="section-title" style={{ fontSize: '42px', marginBottom: '8px' }}>WELCOME<br /><span>BACK</span></h2>
                    <p style={{ fontSize: '14px', color: 'var(--muted)' }}>Enter your credentials to access your studio.</p>
                </div>

                {error && (
                    <div className="toast toast-error" style={{ marginBottom: '20px', maxWidth: '100%' }}>
                        <div className="toast-icon">⚠</div>
                        <div className="toast-msg">{error}</div>
                    </div>
                )}

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input
                            className="form-input"
                            type="email"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            className="form-input"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        className={`btn btn-primary btn-lg ${isLoading ? 'disabled' : ''}`}
                        style={{ width: '100%', marginTop: '10px' }}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Verifying...' : 'Sign In →'}
                    </button>

                    <p style={{ textAlign: 'center', fontSize: '13px', color: 'var(--muted)', marginTop: '12px' }}>
                        New to SnapStylo? <Link href="/register" style={{ color: 'var(--amber)', textDecoration: 'none' }}>Create an account</Link>
                    </p>
                </form>
            </div>
        </main>
    );
}
