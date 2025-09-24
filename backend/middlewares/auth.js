const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Token no proporcionado' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token inválido' });
    }
};

const authorize = (req, res, next) => {
    if (req.user.role !== 'ADMIN') return res.status(403).json({ message: 'Acceso denegado' });
    next();
}

module.exports = { authenticate, authorize };