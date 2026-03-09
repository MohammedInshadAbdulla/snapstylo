"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Nav from '@/components/Nav';
import StyleCard from '@/components/StyleCard';
import { getUploadUrl, submitJob } from '@/lib/api';

const STUDIO_TOOLS = [
    { id: 'generate', name: 'AI Transform', description: 'Portrait & Style transfer', icon: '🎨' },
    { id: 'upscale', name: 'Resolution Booster', description: 'Enhance to 4K quality', icon: '💎' },
    { id: 'outpaint', name: 'Image Expansion', description: 'Expand scenes beyond edge', icon: '🖼️' },
    { id: 'background', name: 'Studio Backdrop', description: 'E-commerce background', icon: '📸' },
    { id: 'restore', name: 'Old Photo fix', description: 'Restore & Colorize', icon: '⏳' },
];

const STYLES = [
    { id: 'synthwave', name: 'Synthwave', description: 'Retro-futuristic neon', icon: '🌆', gradientClass: 'style-synthwave', badge: 'HOT', badgeClass: 'badge-hot' },
    { id: 'ghibli', name: 'Ghibli', description: 'Studio Ghibli anime', icon: '🌿', gradientClass: 'style-ghibli', badge: 'NEW', badgeClass: 'badge-new' },
    { id: 'neon', name: 'Cyberpunk', description: 'Neon noir city', icon: '⚡', gradientClass: 'style-neon' },
    { id: 'vintage', name: 'Vintage Film', description: '35mm analog look', icon: '🎞️', gradientClass: 'style-vintage' },
    { id: 'anime', name: 'Shōnen', description: 'Manga portrait', icon: '🌸', gradientClass: 'style-anime', badge: 'PRO', badgeClass: 'badge-pro' },
];

const ASPECT_RATIOS = [
    { id: 'portrait_4_5', label: 'Portrait (4:5)', icon: '📱' },
    { id: 'square_1_1', label: 'Square (1:1)', icon: '🟦' },
    { id: 'landscape_16_9', label: 'Landscape (16:9)', icon: '🖼️' },
];

export default function Dashboard() {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Tool Selection
    const [activeTool, setActiveTool] = useState('generate');

    // Core State
    const [selectedStyle, setSelectedStyle] = useState('synthwave');
    const [file, setFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    // AI Parameters
    const [prompt, setPrompt] = useState('');
    const [aspectRatio, setAspectRatio] = useState('portrait_4_5');
    const [guidanceScale, setGuidanceScale] = useState(3.5);
    const [inferenceSteps, setInferenceSteps] = useState(28);
    const [promptStrength, setPromptStrength] = useState(0.5);
    const [seed, setSeed] = useState<number | undefined>(undefined);

    const [isGenerating, setIsGenerating] = useState(false);
    const [status, setStatus] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }
        setIsAuthenticated(true);
    }, [router]);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleGenerate = async () => {
        if (!file) return alert("Please upload a photo first");

        setIsGenerating(true);
        setStatus('Initializing Engine...');

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/login');
                return;
            }

            // 1. Get Presigned URL
            const { upload_url, key } = await getUploadUrl(token);

            // 2. Upload directly to R2
            setStatus('Secure Portrait Processing...');
            await fetch(upload_url, {
                method: 'PUT',
                body: file,
                headers: { 'Content-Type': file.type }
            });

            // 3. Submit Job with full studio config
            setStatus(`Studio Task: ${activeTool.toUpperCase()}...`);
            const idempotencyKey = btoa(file.name + file.size + selectedStyle + activeTool + Date.now());

            const config = {
                task_type: activeTool,
                prompt: prompt || undefined,
                aspect_ratio: aspectRatio,
                guidance_scale: guidanceScale,
                num_inference_steps: inferenceSteps,
                prompt_strength: promptStrength,
                seed: seed
            };

            const { job_id } = await submitJob(selectedStyle, key, idempotencyKey, token, config);

            // 4. Poll and Redirect
            router.push(`/results?jobId=${job_id}`);

        } catch (err: any) {
            alert(err.message);
            setIsGenerating(false);
            setStatus('');
        }
    };

    if (!isAuthenticated) return null;

    return (
        <main>
            <Nav />

            <div className="page" style={{ paddingBottom: '100px' }}>
                <section className="section">
                    <div className="section-label">SNAPSTYLO ATELIER</div>
                    <h2 className="section-title">THE MAGIC<br /><em>OF FLUX</em></h2>

                    {/* Tool Navigation */}
                    <div className="style-pills" style={{ marginBottom: '40px', justifyContent: 'center' }}>
                        {STUDIO_TOOLS.map(tool => (
                            <button
                                key={tool.id}
                                className={`style-pill ${activeTool === tool.id ? 'active' : ''}`}
                                onClick={() => setActiveTool(tool.id)}
                                style={{ padding: '12px 20px' }}
                            >
                                <span style={{ marginRight: '8px' }}>{tool.icon}</span>
                                {tool.name}
                            </button>
                        ))}
                    </div>

                    <div className="demo-grid">
                        <div className="two-col">
                            {/* Left Column: Visual Assets */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                <div className="demo-block" data-label="UPLOAD SOURCE">
                                    <label
                                        className={`upload-zone ${isDragging ? 'dragover' : ''}`}
                                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                        onDragLeave={() => setIsDragging(false)}
                                        onDrop={(e) => {
                                            e.preventDefault();
                                            setIsDragging(false);
                                            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                                                setFile(e.dataTransfer.files[0]);
                                            }
                                        }}
                                    >
                                        <input type="file" hidden onChange={handleFileUpload} accept="image/*" />
                                        <div className="upload-icon">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
                                        </div>
                                        <div className="upload-title">{file ? file.name : 'Upload Your Baseline'}</div>
                                        <div className="upload-sub">Format: WEBP, JPEG, PNG supported</div>
                                    </label>
                                </div>

                                {activeTool !== 'upscale' && activeTool !== 'restore' && (
                                    <div className="demo-block" data-label="CREATIVE CONTEXT">
                                        <div className="form-label" style={{ marginBottom: '12px' }}>
                                            {activeTool === 'outpaint' ? 'Expansion Theme' :
                                                activeTool === 'background' ? 'Environment Description' :
                                                    'Custom Directives'}
                                        </div>
                                        <textarea
                                            className="form-input"
                                            placeholder={
                                                activeTool === 'outpaint' ? "e.g. 'vast futuristic city', 'lush mountain landscape'..." :
                                                    activeTool === 'background' ? "e.g. 'modern minimal studio with soft shadows', 'busy Paris street'..." :
                                                        "Add specific details like 'golden hour', 'vibrant colors', etc."
                                            }
                                            rows={4}
                                            value={prompt}
                                            onChange={(e) => setPrompt(e.target.value)}
                                            style={{ width: '100%', resize: 'none', background: 'rgba(0,0,0,0.2)' }}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Right Column: Engine Parameters */}
                            <div className="demo-block" data-label="ENGINE OPTIMIZATION">
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                                    {activeTool === 'generate' && (
                                        <div className="param-group">
                                            <div className="form-label" style={{ marginBottom: '12px' }}>Studio Canvas</div>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                {ASPECT_RATIOS.map(ratio => (
                                                    <button
                                                        key={ratio.id}
                                                        className={`style-pill ${aspectRatio === ratio.id ? 'active' : ''}`}
                                                        onClick={() => setAspectRatio(ratio.id)}
                                                        style={{ flex: 1, padding: '10px 4px' }}
                                                    >
                                                        <span style={{ marginRight: '6px' }}>{ratio.icon}</span>
                                                        {ratio.label.split(' ')[0]}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {activeTool === 'generate' && (
                                        <>
                                            <div className="range-group">
                                                <div className="range-header">
                                                    <div className="form-label">Stylization Intensity</div>
                                                    <div className="range-val">{Math.round(promptStrength * 100)}%</div>
                                                </div>
                                                <input
                                                    type="range"
                                                    min="0" max="1" step="0.01"
                                                    value={promptStrength}
                                                    onChange={(e) => setPromptStrength(parseFloat(e.target.value))}
                                                />
                                            </div>

                                            <div className="range-group">
                                                <div className="range-header">
                                                    <div className="form-label">Guidance Scale</div>
                                                    <div className="range-val">{guidanceScale}</div>
                                                </div>
                                                <input
                                                    type="range"
                                                    min="1" max="10" step="0.1"
                                                    value={guidanceScale}
                                                    onChange={(e) => setGuidanceScale(parseFloat(e.target.value))}
                                                />
                                            </div>
                                        </>
                                    )}

                                    <button
                                        className={`btn btn-primary btn-lg ${isGenerating ? 'disabled' : ''}`}
                                        style={{ width: '100%', padding: '18px' }}
                                        onClick={handleGenerate}
                                        disabled={isGenerating}
                                    >
                                        {isGenerating ? (
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                                                <div className="gen-status-dot" /> {status}
                                            </span>
                                        ) : `Start ${STUDIO_TOOLS.find(t => t.id === activeTool)?.name} →`}
                                    </button>

                                    <div style={{ textAlign: 'center', opacity: 0.5, fontSize: '11px', fontStyle: 'italic' }}>
                                        High-priority processing via secure studio nodes
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Section: Style Selection */}
                        {activeTool === 'generate' && (
                            <div className="demo-block" data-label="ARTISTIC COLLECTIONS">
                                <div className="style-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))' }}>
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
                        )}
                    </div>
                </section>
            </div>
        </main>
    );
}
