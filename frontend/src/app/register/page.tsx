"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { parseError } from '@/lib/error-utils';

export default function Register() {
    const [step, setStep] = useState<'register' | 'verify'>('register');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
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

            setStep('verify');
        } catch (err: any) {
            setError(parseError(err));
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/auth/verify`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, code: verificationCode }),
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
            <div className="demo-block" style={{ width: '100%', maxWidth: '400px', padding: '48px 32px' }} data-label={step === 'register' ? "CREATE ACCOUNT" : "VERIFY EMAIL"}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <h2 className="section-title" style={{ fontSize: '42px', marginBottom: '8px' }}>
                        {step === 'register' ? <>START<br /><span>CREATING</span></> : <>SECURE<br /><span>ACCESS</span></>}
                    </h2>
                    <p style={{ fontSize: '14px', color: 'var(--muted)' }}>
                        {step === 'register' ? 'Join the studio and get 3 free generations.' : `We sent a 6-digit code to ${email}`}
                    </p>
                </div>

                {error && (
                    <div className="toast toast-error" style={{ marginBottom: '20px', maxWidth: '100%' }}>
                        <div className="toast-icon">⚠</div>
                        <div className="toast-msg">{error}</div>
                    </div>
                )}

                {step === 'register' ? (
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
                            {isLoading ? 'Sending OTP...' : 'Get Started Free →'}
                        </button>

                        <p style={{ textAlign: 'center', fontSize: '13px', color: 'var(--muted)', marginTop: '12px' }}>
                            Already have an account? <Link href="/login" style={{ color: 'var(--amber)', textDecoration: 'none' }}>Sign In</Link>
                        </p>
                    </form>
                ) : (
                    <form onSubmit={handleVerify} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div className="form-group">
                            <label className="form-label">Verification Code</label>
                            <input
                                className="form-input"
                                type="text"
                                placeholder="123456"
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value)}
                                maxLength={6}
                                required
                                style={{ textAlign: 'center', letterSpacing: '8px', fontSize: '24px', fontWeight: 'bold' }}
                            />
                        </div>

                        <button
                            className={`btn btn-primary btn-lg ${isLoading ? 'disabled' : ''}`}
                            style={{ width: '100%', marginTop: '10px' }}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Verifying...' : 'Verify & Enter Atelier →'}
                        </button>

                        <p style={{ textAlign: 'center', fontSize: '13px', color: 'var(--muted)', marginTop: '12px' }}>
                            Didn't get the code? <button type="button" onClick={handleRegister} style={{ background: 'none', border: 'none', color: 'var(--amber)', cursor: 'pointer', padding: 0 }}>Resend</button><br />
                            <button type="button" onClick={() => setStep('register')} style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', padding: 0, marginTop: '8px' }}>← Back to Register</button>
                        </p>
                    </form>
                )}
            </div>
        </main>
    );
}
