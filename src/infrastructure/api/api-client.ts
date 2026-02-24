const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const getHeaders = () => {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };
    const token = localStorage.getItem('auth_token');
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
};

export const apiClient = {
    get: async <T>(path: string): Promise<T> => {
        const response = await fetch(`${BASE_URL}${path}`, {
            headers: getHeaders(),
        });
        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }
        return response.json();
    },
    post: async <T>(path: string, body: any): Promise<T> => {
        const response = await fetch(`${BASE_URL}${path}`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(body),
        });
        if (!response.ok) {
            const errorBody = await response.json().catch(() => ({}));
            throw new Error(errorBody.message || `API Error: ${response.statusText}`);
        }
        return response.json();
    },
    delete: async <T>(path: string): Promise<T> => {
        const response = await fetch(`${BASE_URL}${path}`, {
            method: 'DELETE',
            headers: getHeaders(),
        });
        if (!response.ok) {
            const errorBody = await response.json().catch(() => ({}));
            throw new Error(errorBody.message || `API Error: ${response.statusText}`);
        }
        return response.json();
    },
    put: async <T>(path: string, body: any): Promise<T> => {
        const response = await fetch(`${BASE_URL}${path}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(body),
        });
        if (!response.ok) {
            const errorBody = await response.json().catch(() => ({}));
            throw new Error(errorBody.message || `API Error: ${response.statusText}`);
        }
        return response.json();
    },
};

