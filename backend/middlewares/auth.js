import { verifyToken, validateDecodedToken } from '../utils/jwt.js';
import { extractTokenFromHeader, normalizeRole } from '../utils/tokenHelpers.js';


export const authenticate = (req, res, next) => {
    try {
        const { token, error: extractError } = extractTokenFromHeader(
            req.headers['authorization']
        );
        if (extractError) {
            return res.status(401).json({ message: extractError });
        }

        const { decoded, error: verifyError } = verifyToken(token);
        if (verifyError) {
            return res.status(verifyError.status || 401).json({
                message: verifyError.message
            });
        }

        if (!validateDecodedToken(decoded)) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        req.user = decoded;
        next();
    } catch (error) {
        return res.status(500).json({
            message: 'Error al procesar la autenticación',
            error: process.env.NODE_ENV === 'development' ? error : undefined
        });
    }
};

export const authorize = (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Usuario no autenticado' });
        }
        const userRole = normalizeRole(req.user.role);

        if (userRole !== 'ADMIN') {
            return res.status(403).json({
                message: 'Acceso denegado: se requiere rol ADMIN'
            });
        }

        next();
    } catch (error) {
        return res.status(500).json({
            message: 'Error al verificar autorización',
            error: process.env.NODE_ENV === 'development' ? error : undefined
        });
    }
};

export const authorizeRoles = (allowedRoles = []) => {
    return (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({
                    message: 'Usuario no autenticado'
                });
            }
            const userRole = normalizeRole(req.user.role);
            const normalizedAllowedRoles = allowedRoles.map(normalizeRole);

            if (!normalizedAllowedRoles.includes(userRole)) {
                return res.status(403).json({
                    message: `Acceso denegado: se requiere uno de los siguientes roles: ${allowedRoles.join(', ')}`
                });
            }

            next();
        } catch (error) {
            return res.status(500).json({
                message: 'Error al verificar autorización',
                error: process.env.NODE_ENV === 'development' ? error : undefined
            });
        }
    };
};

export const optionalAuth = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        req.user = null;
        return next();
    }

    const { token, error: extractError } = extractTokenFromHeader(authHeader);

    if (extractError) {
        req.user = null;
        return next();
    }

    const { decoded } = verifyToken(token);

    req.user = decoded || null;
    next();
}