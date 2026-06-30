import { getToken, clearToken, isTokenExpired } from './auth';

export async function apiFetch(path, options = {}) {
    const baseURL = import.meta.env.VITE_API_URL || '';
    const fullPath = path.startsWith('http') ? path : `${baseURL}${path}`;

    const headers = { ...options.headers || {} };
    const token = getToken();

    if (token) {
        if (isTokenExpired(token)) {
            clearToken();
            window.location.href = '/login';
            return; // Detener la ejecución si el token expiró
        }
        headers['Authorization'] = `Bearer ${token}`;
    }

    const isFormData = (typeof FormData !== 'undefined') && (options.body instanceof FormData);
    if (!isFormData) {
        headers['Content-Type'] = headers['Content-Type'] || 'application/json';
    }

    const res = await fetch(fullPath, { ...options, headers });


    if (res.status === 401) {
        clearToken();
        window.location.href = '/login';
    }
    return res;
}