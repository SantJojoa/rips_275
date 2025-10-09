const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ message: 'Token no proporcionado' })

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') return res.status(401).json({ message: 'Formato de token invalido' });

    const token = parts[1];
    if (!procees.env.JWT_SECRET) return res.status(500).json({ message: 'JWT_SECRET NO CONFIGURADO' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token inválido' });
    }
};

const authorize = (req, res, next) => {
    if (!req.user || String(req.user.role).toUpperCase() !== 'ADMIN')
        next();
}

module.exports = { authenticate, authorize };