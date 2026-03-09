"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Nav from '@/components/Nav';
import StyleCard from '@/components/StyleCard';
import { getUploadUrl, submitJob } from '@/lib/api';

const STUDIO_TOOLS = [
    { id: 'generate', name: 'AI Transform', description: 'Portrait & Style transfer', icon: '🎨' },
    { id: 'inpaint', name: 'Magic Brush', description: 'Draw over areas to change them', icon: '🖌️' },
    { id: 'relight', name: 'Cinematic Light', description: 'Change environment lighting', icon: '💡' },
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

export default function Dashboard() {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Tool Selection
    const [activeTool, setActiveTool] = useState('generate');

    // Core State
    const [selectedStyle, setSelectedStyle] = useState('synthwave');
    const [file, setFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    // Drawing State (for Magic Brush)
    const [isDrawing, setIsDrawing] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [imageLoaded, setImageLoaded] = useState(false);

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

    // Canvas Logic for Magic Brush (High-Res)
    const hiddenCanvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (activeTool === 'inpaint' && file && canvasRef.current && hiddenCanvasRef.current && containerRef.current) {
            const canvas = canvasRef.current;
            const hCanvas = hiddenCanvasRef.current;
            const ctx = canvas.getContext('2d');
            const hCtx = hCanvas.getContext('2d');

            const img = new Image();
            img.src = URL.createObjectURL(file);
            img.onload = () => {
                const containerWidth = containerRef.current!.offsetWidth;
                const scale = containerWidth / img.width;

                // Display Canvas (Responsive)
                canvas.width = containerWidth;
                canvas.height = img.height * scale;
                ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

                // Hidden Canvas (Original Res - for Mask)
                hCanvas.width = img.width;
                hCanvas.height = img.height;
                hCtx!.fillStyle = 'black';
                hCtx!.fillRect(0, 0, hCanvas.width, hCanvas.height);

                setImageLoaded(true);
            };
        }
    }, [activeTool, file]);

    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
        setIsDrawing(true);
        draw(e);
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing || !canvasRef.current || !hiddenCanvasRef.current) return;
        const canvas = canvasRef.current;
        const hCanvas = hiddenCanvasRef.current;
        const ctx = canvas.getContext('2d');
        const hCtx = hCanvas.getContext('2d');
        if (!ctx || !hCtx) return;

        const rect = canvas.getBoundingClientRect();
        const x = ('touches' in e) ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
        const y = ('touches' in e) ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

        // Scale coordinates for high-res canvas
        const scaleX = hCanvas.width / canvas.width;
        const scaleY = hCanvas.height / canvas.height;
        const hX = x * scaleX;
        const hY = y * scaleY;

        // Draw on Display Canvas (Visible feedback)
        ctx.lineWidth = 30;
        ctx.lineCap = 'round';
        ctx.strokeStyle = 'rgba(201, 168, 76, 0.5)';
        ctx.globalCompositeOperation = 'source-over';
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);

        // Draw on Hidden Canvas (The actual mask for AI)
        hCtx.lineWidth = 30 * scaleX;
        hCtx.lineCap = 'round';
        hCtx.strokeStyle = 'white';
        hCtx.lineTo(hX, hY);
        hCtx.stroke();
        hCtx.beginPath();
        hCtx.moveTo(hX, hY);
    };

    const clearCanvas = () => {
        if (!canvasRef.current || !hiddenCanvasRef.current || !file) return;
        const canvas = canvasRef.current;
        const hCanvas = hiddenCanvasRef.current;
        const ctx = canvas.getContext('2d');
        const hCtx = hCanvas.getContext('2d');

        ctx?.clearRect(0, 0, canvas.width, canvas.height);
        hCtx?.fillStyle === 'black'; // Reset mask
        hCtx?.fillRect(0, 0, hCanvas.width, hCanvas.height);

        // Redraw base image on visible canvas
        const img = new Image();
        img.src = URL.createObjectURL(file);
        img.onload = () => ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setImageLoaded(false);
        }
    };

    const handleGenerate = async () => {
        if (!file) return alert("Please upload a photo first");

        setIsGenerating(true);
        setStatus('Initializing Studio Engine...');

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/login');
                return;
            }

            // 1. Get Presigned URL for Image
            const { upload_url, key } = await getUploadUrl(token);
            setStatus('Secure Portrait Processing...');
            await fetch(upload_url, {
                method: 'PUT',
                body: file,
                headers: { 'Content-Type': file.type }
            });

            // 2. Handle Inpaint Mask if needed
            let maskKey = null;
            if (activeTool === 'inpaint' && hiddenCanvasRef.current) {
                setStatus('Generating Magic Mask...');
                const maskCanvas = hiddenCanvasRef.current;

                const maskBlob = await new Promise<Blob>((resolve) => maskCanvas.toBlob(b => resolve(b!), 'image/png'));
                const { upload_url: m_url, key: m_key } = await getUploadUrl(token);
                await fetch(m_url, {
                    method: 'PUT',
                    body: maskBlob,
                    headers: { 'Content-Type': 'image/png' }
                });
                maskKey = m_key;
            }

            // 3. Submit Job
            setStatus(`Studio Task: ${activeTool.toUpperCase()}...`);
            const idempotencyKey = btoa(file.name + file.size + activeTool + Date.now());

            const config = {
                task_type: activeTool,
                prompt: prompt || undefined,
                mask_r2_key: maskKey,
                aspect_ratio: aspectRatio,
                guidance_scale: guidanceScale,
                num_inference_steps: inferenceSteps,
                prompt_strength: promptStrength,
                seed: seed
            };

            const { job_id } = await submitJob(selectedStyle, key, idempotencyKey, token, config);
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
                    <p style={{ color: 'var(--muted)', marginTop: '16px', maxWidth: '600px', fontSize: '14px', lineHeight: '1.6' }}>
                        {STUDIO_TOOLS.find(t => t.id === activeTool)?.description}.
                        Powered by secure high-performance studio nodes for instant creative production.
                    </p>

                    {/* Tool Navigation */}
                    <div className="style-pills" style={{ marginBottom: '40px', justifyContent: 'center' }}>
                        {STUDIO_TOOLS.map(tool => (
                            <button
                                key={tool.id}
                                className={`style-pill ${activeTool === tool.id ? 'active' : ''}`}
                                onClick={() => setActiveTool(tool.id)}
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
                                <div className="demo-block" data-label={activeTool === 'inpaint' ? 'MAGIC CANVAS' : 'UPLOAD SOURCE'} ref={containerRef}>
                                    {activeTool === 'inpaint' && file ? (
                                        <div style={{ position: 'relative', cursor: 'crosshair', borderRadius: '8px', overflow: 'hidden' }}>
                                            <canvas
                                                ref={canvasRef}
                                                onMouseDown={startDrawing}
                                                onMouseUp={stopDrawing}
                                                onMouseMove={draw}
                                                onMouseLeave={stopDrawing}
                                                onTouchStart={startDrawing}
                                                onTouchEnd={stopDrawing}
                                                onTouchMove={draw}
                                                style={{ width: '100%', display: 'block' }}
                                            />
                                            {/* Surgical High-Res Mask Engine */}
                                            <canvas ref={hiddenCanvasRef} style={{ display: 'none' }} />

                                            <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', gap: '8px' }}>
                                                <div style={{
                                                    background: 'rgba(0,0,0,0.6)', padding: '6px 12px',
                                                    borderRadius: '100px', fontSize: '11px', color: 'white'
                                                }}>
                                                    Paint over area to change
                                                </div>
                                                <button
                                                    onClick={clearCanvas}
                                                    style={{
                                                        background: 'var(--amber)', color: 'black', padding: '6px 12px',
                                                        borderRadius: '100px', fontSize: '11px', fontWeight: 'bold', border: 'none', cursor: 'pointer'
                                                    }}
                                                >
                                                    Clear
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <label className={`upload-zone ${isDragging ? 'dragover' : ''}`}>
                                            <input type="file" hidden onChange={handleFileUpload} accept="image/*" />
                                            <div className="upload-icon">
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
                                            </div>
                                            <div className="upload-title">{file ? file.name : 'Upload Your Baseline'}</div>
                                            <div className="upload-sub">WebP, JPEG, PNG supported</div>
                                        </label>
                                    )}
                                </div>

                                {activeTool !== 'upscale' && activeTool !== 'restore' && (
                                    <div className="demo-block" data-label="DIRECTIVES">
                                        <textarea
                                            className="form-input"
                                            placeholder={
                                                activeTool === 'inpaint' ? "What should appear in the painted area?" :
                                                    activeTool === 'relight' ? "Describe the lighting: 'neon city', 'warm sunset', etc." :
                                                        "Describe your creative vision..."
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
                            <div className="demo-block" data-label="OPTIMIZATION">
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                                    <button
                                        className={`btn btn-primary btn-lg ${isGenerating ? 'disabled' : ''}`}
                                        style={{ width: '100%', padding: '18px' }}
                                        onClick={handleGenerate}
                                        disabled={isGenerating}
                                    >
                                        {isGenerating ? status : `Start ${STUDIO_TOOLS.find(t => t.id === activeTool)?.name} →`}
                                    </button>

                                    {activeTool === 'generate' && (
                                        <div className="collections-mini">
                                            <div className="form-label" style={{ marginBottom: '12px' }}>Style Preset</div>
                                            <div className="style-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
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
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}
