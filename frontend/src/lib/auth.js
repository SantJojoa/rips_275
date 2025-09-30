const KEY = 'token';

export function getToken() {
    return localStorage.getItem(KEY);
}

export function setToken(token) {
    localStorage.setItem(KEY, token);
}

export function clearToken() {
    localStorage.removeItem(KEY);
}

function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const json = decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
        return JSON.parse(json);
    } catch (error) {
        return null;
    }
}

export function getUser() {
    const token = getToken();
    if (!token) return null;
    const payload = parseJwt(token);
    if (!payload) return null;
    const { id, username, role } = payload || {};
    return { id, username, role };
}

export function isAdmin() {
    return getUser()?.role === 'ADMIN';
}