import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { createError } from './errorHandler.js';


dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || "8h";

const validateJWTSecret = () => {
    if (!JWT_SECRET) {
        throw createError(500, 'JWT_SECRET no configurado en las variables de entorno');
    }
}

export const generateToken = (userData) => {
    validateJWTSecret();
    const payload = {
        id: userData.id,
        username: userData.username,
        nombres: userData.nombres,
        apellidos: userData.apellidos,
        cedula: userData.cedula,
        role: userData.role
    };

    return jwt.sign(
        payload,
        JWT_SECRET,
        { expiresIn: JWT_EXPIRATION }
    );
};


export const verifyToken = (token) => {
    validateJWTSecret();
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return { decoded, error: null };
    } catch (error) {
        return { decoded: null, error: handleJwtError(error) };
    }
};
const handleJwtError = (error) => {
    switch (error.name) {
        case 'TokenExpiredError':
            return createError(401, 'El token ha expirado');
        case 'JsonWebTokenError':
            return createError(401, 'Token inválido');
        case 'NotBeforeError':
            return createError(401, 'Token aún no es válido');
        default:
            return createError(401, 'Error al verificar el token');
    }
};

export const decodeToken = (token) => {
    return jwt.decode(token);
};

export const validateDecodedToken = (decoded) => {
    if (!decoded || typeof decoded !== 'object') {
        return false;
    }

    return decoded.id !== undefined && decoded.role !== undefined;
};
