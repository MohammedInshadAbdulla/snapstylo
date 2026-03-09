"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Nav from '@/components/Nav';
import { getJobStatus } from '@/lib/api';

function ResultsContent() {
    const searchParams = useSearchParams();
    const jobId = searchParams.get('jobId');
    const [job, setJob] = useState<any>(null);
    const [error, setError] = useState('');
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (!jobId) return;

        const fetchStatus = async () => {
            try {
                const token = localStorage.getItem('token') || '';
                const data = await getJobStatus(jobId, token);
                setJob(data);

                if (data.status !== 'completed' && data.status !== 'failed') {
                    setTimeout(fetchStatus, 3000);
                }
            } catch (err: any) {
                setError(err.message);
            }
        };

        fetchStatus();
    }, [jobId]);

    if (!isMounted) return null;
    if (!jobId) return <div className="page">No job ID provided.</div>;

    return (
        <main>
            <Nav />
            <div className="page" style={{ paddingTop: 'calc(var(--nav-h) + 40px)', paddingBottom: '60px' }}>
                <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                    <div className="section-label">GENERATION COMPLETE</div>
                    <h2 className="section-title">YOUR<br /><span>MASTERPIECE</span></h2>
                    {job && (
                        <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '-10px', marginBottom: '20px' }}>
                            Job created at: {job.created_at ? new Date(job.created_at).toLocaleTimeString() : 'Unknown'}
                        </div>
                    )}

                    <div style={{ marginTop: '32px' }}>
                        {error ? (
                            <div className="toast toast-error">
                                <div className="toast-icon">⚠</div>
                                <div className="toast-msg">{error}</div>
                            </div>
                        ) : job?.status === 'completed' ? (
                            <div className="result-card fade-in">
                                <div className="result-image">
                                    <div className="result-image-bg"></div>
                                    <div className="result-image-content">
                                        {job.output ? <img src={job.output} alt="Generated" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '🖼️'}
                                    </div>
                                </div>
                                <div className="result-actions">
                                    <div className="result-meta">Style: {job.style_id?.toUpperCase()}</div>
                                    <div className="result-btns">
                                        <button className="btn btn-secondary btn-sm" onClick={() => {
                                            if (navigator.share) {
                                                navigator.share({ title: 'My STYLR Masterpiece', url: job.output });
                                            } else {
                                                navigator.clipboard.writeText(job.output);
                                                alert('Link copied!');
                                            }
                                        }}>↗ Share</button>
                                        <a href={job.output} download={`Masterpiece-${job.id}.webp`} className="btn btn-primary btn-sm" target="_blank" rel="noreferrer">↓ Download</a>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="gen-card">
                                <div className="gen-header">
                                    <div className="gen-status">
                                        <div className="gen-status-dot"></div>
                                        {job?.status?.toUpperCase() || 'LOADING...'}
                                    </div>
                                </div>
                                <div className="progress-track">
                                    <div className="progress-fill" style={{ width: '100%' }}></div>
                                </div>
                                <p style={{ fontSize: '13px', color: 'var(--muted)', textAlign: 'center' }}>
                                    Please wait while we finalize your artwork.
                                </p>
                                {job?.status === 'failed' && (
                                    <div className="demo-block" style={{ border: '1px solid var(--amber)', background: 'rgba(255, 191, 0, 0.05)' }}>
                                        <h3 style={{ color: 'var(--amber)' }}>ERROR DURING GENERATION</h3>
                                        <p style={{ color: 'var(--muted)', marginTop: '8px' }}>
                                            {job.error || 'An unexpected error occurred while processing your image.'}
                                        </p>
                                        <Link href="/dashboard" className="btn btn-secondary" style={{ marginTop: '20px', width: '100%' }}>
                                            Try Again →
                                        </Link>
                                    </div>
                                )}
                            </div>
                        )}

                        <div style={{ marginTop: '40px', textAlign: 'center' }}>
                            <button onClick={() => window.location.href = '/dashboard'} className="btn btn-ghost">
                                ← Create Another One
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default function Results() {
    return (
        <Suspense fallback={<div className="page">Loading Results...</div>}>
            <ResultsContent />
        </Suspense>
    );
}
