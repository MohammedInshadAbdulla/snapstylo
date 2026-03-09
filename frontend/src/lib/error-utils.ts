export function parseError(err: any): string {
    if (typeof err === 'string') return err;

    if (err && typeof err === 'object') {
        // Handle FastAPI validation error detail list
        if (Array.isArray(err.detail)) {
            return err.detail.map((d: any) => d.msg || d.type || JSON.stringify(d)).join(', ');
        }

        // Handle standard detail string
        if (typeof err.detail === 'string') return err.detail;

        // Handle message property
        if (err.message) return err.message;

        // Final fallback to JSON string if it's an object we don't recognize
        try {
            return JSON.stringify(err);
        } catch (e) {
            return 'An unknown error occurred';
        }
    }

    return String(err || 'An error occurred');
}
