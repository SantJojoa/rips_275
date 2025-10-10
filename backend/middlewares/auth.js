const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ message: 'Token no proporcionado' });
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return res.status(401).json({ message: 'Formato de token inválido' });
    }

    const token = parts[1];
    if (!process.env.JWT_SECRET) {
        return res.status(500).json({ message: 'JWT_SECRET no configurado en las variables de entorno' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'El token ha expirado' });
        }
        res.status(401).json({ message: 'Token inválido' });
    }
};

const authorize = (req, res, next) => {
    if (!req.user || String(req.user.role).toUpperCase() !== 'ADMIN') {
        return res.status(403).json({ message: 'Acceso denegado: se requiere rol ADMIN' });
    }
    next();
};

module.exports = { authenticate, authorize };
