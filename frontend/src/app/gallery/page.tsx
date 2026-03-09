"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Nav from '@/components/Nav';
import Link from 'next/link';

export default function Gallery() {
    const router = useRouter();
    const [jobs, setJobs] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }
        setIsAuthenticated(true);

        const fetchJobs = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/jobs/`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.status === 401) {
                    localStorage.removeItem('token');
                    router.push('/login');
                    return;
                }
                const data = await res.json();
                setJobs(data);
            } catch (e) {
                console.error("Failed to fetch jobs", e);
            } finally {
                setIsLoading(false);
            }
        };

        fetchJobs();
    }, [router]);

    if (!isAuthenticated) return null;

    return (
        <main>
            <Nav />
            <div className="page" style={{ paddingTop: 'calc(var(--nav-h) + 40px)', paddingBottom: '60px' }}>
                <div className="section-label">YOUR COLLECTION</div>
                <h2 className="section-title">THE SNAPSTYLO<br /><span>GALLERY</span></h2>

                {isLoading ? (
                    <div style={{ textAlign: 'center', marginTop: '40px' }}>
                        <div className="gen-status" style={{ justifyContent: 'center' }}>
                            <div className="gen-status-dot"></div>
                            Loading your masterpieces...
                        </div>
                    </div>
                ) : jobs.length === 0 ? (
                    <div className="demo-block" style={{ textAlign: 'center', marginTop: '40px', padding: '60px' }}>
                        <div style={{ fontSize: '48px', marginBottom: '20px' }}>🎨</div>
                        <h3>Your gallery is empty</h3>
                        <p style={{ color: 'var(--muted)', marginBottom: '24px' }}>Start generating to see your work here.</p>
                        <Link href="/dashboard" className="btn btn-primary">Create Your First Art →</Link>
                    </div>
                ) : (
                    <div className="style-grid" style={{ marginTop: '40px' }}>
                        {jobs.map((job) => (
                            <Link href={`/results?jobId=${job.id}`} key={job.id} style={{ textDecoration: 'none' }}>
                                <div className="style-card fade-in">
                                    <div className="style-card-img" style={{ background: 'var(--ink-3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {job.status === 'completed' && job.output ? (
                                            <img
                                                src={job.output}
                                                alt={job.style_id}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                        ) : (
                                            <div className="gen-status">
                                                <div className="gen-status-dot"></div>
                                                {job.status.toUpperCase()}
                                            </div>
                                        )}
                                    </div>
                                    <div className="style-card-overlay">
                                        <div className="style-card-name" style={{ fontSize: '14px' }}>{job.style_id.toUpperCase()}</div>
                                        <div className="style-card-sub" style={{ fontSize: '12px' }}>
                                            {new Date(job.created_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
