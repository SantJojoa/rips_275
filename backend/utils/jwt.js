import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || "8h";

export const generateToken = (userData) => {
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
    return jwt.verify(token, JWT_SECRET);
};

