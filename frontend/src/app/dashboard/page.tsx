"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Nav from '@/components/Nav';
import StyleCard from '@/components/StyleCard';
import { getUploadUrl, submitJob, getJobStatus } from '@/lib/api';

const STYLES = [
    { id: 'synthwave', name: 'Synthwave', description: 'Retro-futuristic neon', icon: '🌆', gradientClass: 'style-synthwave', badge: 'HOT', badgeClass: 'badge-hot' },
    { id: 'ghibli', name: 'Ghibli', description: 'Studio Ghibli anime', icon: '🌿', gradientClass: 'style-ghibli', badge: 'NEW', badgeClass: 'badge-new' },
    { id: 'neon', name: 'Cyberpunk', description: 'Neon noir city', icon: '⚡', gradientClass: 'style-neon' },
    { id: 'vintage', name: 'Vintage Film', description: '35mm analog look', icon: '🎞️', gradientClass: 'style-vintage' },
    { id: 'anime', name: 'Shōnen', description: 'Manga portrait', icon: '🌸', gradientClass: 'style-anime', badge: 'PRO', badgeClass: 'badge-pro' },
];

export default function Dashboard() {
    const router = useRouter();
    const [selectedStyle, setSelectedStyle] = useState('synthwave');
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [status, setStatus] = useState('');

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleGenerate = async () => {
        if (!file) return alert("Please upload a photo first");

        setIsGenerating(true);
        setStatus('Preparing upload...');

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/login');
                return;
            }

            // 1. Get Presigned URL
            const { upload_url, key } = await getUploadUrl(token);

            // 2. Upload directly to R2
            setStatus('Uploading photo...');
            await fetch(upload_url, {
                method: 'PUT',
                body: file,
                headers: { 'Content-Type': file.type }
            });

            // 3. Submit Job
            setStatus('Starting AI generation...');
            const idempotencyKey = btoa(file.name + file.size + selectedStyle + Date.now());
            const { job_id } = await submitJob(selectedStyle, key, idempotencyKey, token);

            // 4. Poll and Redirect
            router.push(`/results?jobId=${job_id}`);

        } catch (err: any) {
            alert(err.message);
            setIsGenerating(false);
            setStatus('');
        }
    };

    return (
        <main>
            <Nav />

            <div className="page">
                <section className="section">
                    <div className="section-label">CREATE NEW</div>
                    <h2 className="section-title">CHOOSE YOUR<br />STYLE</h2>

                    <div className="demo-grid" style={{ marginTop: '40px' }}>
                        <div className="two-col">
                            {/* Left Column: Upload */}
                            <div className="demo-block" data-label="STEP 1: UPLOAD">
                                <label className={`upload-zone ${isDragging ? 'dragover' : ''}`}>
                                    <input type="file" hidden onChange={handleFileUpload} accept="image/*" />
                                    <div className="upload-icon">📷</div>
                                    <div className="upload-title">{file ? file.name : 'Drop your photo here'}</div>
                                    <div className="upload-sub">or click to browse</div>
                                </label>

                                {status && (
                                    <div className="gen-status" style={{ marginTop: '20px' }}>
                                        <div className="gen-status-dot"></div>
                                        {status}
                                    </div>
                                )}
                            </div>

                            {/* Right Column: Settings */}
                            <div className="demo-block" data-label="STEP 2: SETTINGS">
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                    <div className="range-group">
                                        <div className="range-header">
                                            <div className="form-label">Style Strength</div>
                                            <div className="range-val">0.82</div>
                                        </div>
                                        <input type="range" min="0" max="1" step="0.01" defaultValue="82" />
                                    </div>

                                    <button
                                        className={`btn btn-primary btn-lg ${isGenerating ? 'disabled' : ''}`}
                                        style={{ width: '100%', marginTop: '10px' }}
                                        onClick={handleGenerate}
                                        disabled={isGenerating}
                                    >
                                        {isGenerating ? 'Processing...' : 'Generate Transformation'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Section: Style Selection */}
                        <div className="demo-block" data-label="STEP 3: SELECT STYLE">
                            <div className="style-grid">
                                {STYLES.map((style) => (
                                    <StyleCard
                                        key={style.id}
                                        {...style}
                                        selected={selectedStyle === style.id}
                                        onSelect={(id) => setSelectedStyle(id)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}
