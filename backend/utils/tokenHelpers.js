export const extractTokenFromHeader = (authHeader) => {
    if (!authHeader) {
        return { error: 'Token no proporcionado' };
    }

    const parts = authHeader.split(' ')

    if (parts.length !== 2) {
        return { error: 'Formato de token inválido' }
    }

    const [scheme, token] = parts;

    if (scheme !== 'Bearer') {
        return { error: 'Esquema de autenticación debe ser Bearer' };
    }

    if (!token) {
        return { error: 'Token no proporcionado' };
    }

    return { token };
}

export const normalizeRole = (role) => {
    return String(role || '').toUpperCase();
}