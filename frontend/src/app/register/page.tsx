"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { parseError } from '@/lib/error-utils';

export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
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
            <div className="demo-block" style={{ width: '100%', maxWidth: '400px', padding: '48px 32px' }} data-label="CREATE ACCOUNT">
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <h2 className="section-title" style={{ fontSize: '42px', marginBottom: '8px' }}>START<br /><span>CREATING</span></h2>
                    <p style={{ fontSize: '14px', color: 'var(--muted)' }}>Join the studio and get 3 free generations.</p>
                </div>

                {error && (
                    <div className="toast toast-error" style={{ marginBottom: '20px', maxWidth: '100%' }}>
                        <div className="toast-icon">⚠</div>
                        <div className="toast-msg">{error}</div>
                    </div>
                )}

                <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
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
                        <label className="form-label">Create Password</label>
                        <input
                            className="form-input"
                            type="password"
                            placeholder="Min. 8 characters"
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
                        {isLoading ? 'Creating Studio...' : 'Get Started Free →'}
                    </button>

                    <p style={{ textAlign: 'center', fontSize: '13px', color: 'var(--muted)', marginTop: '12px' }}>
                        Already have an account? <Link href="/login" style={{ color: 'var(--amber)', textDecoration: 'none' }}>Sign In</Link>
                    </p>
                </form>
            </div>
        </main>
    );
}
