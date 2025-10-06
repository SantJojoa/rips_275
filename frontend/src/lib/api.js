import { getToken, clearToken } from './auth';

export async function apiFetch(path, options = {}) {
    const baseURL = 'http://localhost:3000'; // URL del backend
    const fullPath = path.startsWith('http') ? path : `${baseURL}${path}`;

    const headers = { ...options.headers || {} };
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const isFormData = (typeof FormData !== 'undefined') && (options.body instanceof FormData);
    if (!isFormData) {
        headers['Content-Type'] = headers['Content-Type'] || 'application/json';
    }

    const res = await fetch(fullPath, { ...options, headers });

    if (res.status === 401) {
        clearToken();
    }
    return res;
}