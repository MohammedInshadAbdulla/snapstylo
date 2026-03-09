const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function submitJob(styleId: string, inputKey: string, idempotencyKey: string, token: string, config: any = {}) {
    const response = await fetch(`${API_URL}/jobs/submit`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            style_id: styleId,
            input_r2_key: inputKey,
            idempotency_key: idempotencyKey,
            ...config
        })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to submit job');
    }

    return response.json();
}

export async function getJobStatus(jobId: string, token: string) {
    const response = await fetch(`${API_URL}/jobs/${jobId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) throw new Error('Failed to fetch job status');

    return response.json();
}

export async function getUploadUrl(token: string) {
    const response = await fetch(`${API_URL}/jobs/upload-url`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) throw new Error('Failed to get upload URL');

    return response.json();
}
