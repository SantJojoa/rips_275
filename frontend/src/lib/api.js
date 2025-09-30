import { getToken, clearToken } from './auth';

export async function apiFetch(path, options = {}) {
    const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(path, { ...options, headers });

    if (res.status === 401) {
        clearToken();
    }
    return res;
}