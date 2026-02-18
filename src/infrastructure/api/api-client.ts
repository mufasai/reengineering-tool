const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const apiClient = {
    get: async <T>(path: string): Promise<T> => {
        const response = await fetch(`${BASE_URL}${path}`);
        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }
        return response.json();
    },
    post: async <T>(path: string, body: any): Promise<T> => {
        const response = await fetch(`${BASE_URL}${path}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }
        return response.json();
    },
};
