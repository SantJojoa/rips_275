import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import db from '../models/index.js'; // Ajusta si tu export default es db
const { SystemUser } = db;

dotenv.config();

const SALT_ROUNDS = 10;

export const register = async (req, res) => {
    const { username, nombres, apellidos, cedula, password, role = 'USER' } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        const user = await SystemUser.create({
            username,
            nombres,
            apellidos,
            cedula,
            password: hashedPassword,
            role
        });
        res.status(201).json({ message: 'Usuario creado exitosamente', user });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el usuario', error });
    }
};

export const login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await SystemUser.findOne({ where: { username } });
        if (!user) return res.status(401).json({ message: 'Usuario no encontrado' });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ message: 'Contraseña incorrecta' });

        const token = jwt.sign(
            {
                id: user.id,
                username: user.username,
                nombres: user.nombres,
                apellidos: user.apellidos,
                cedula: user.cedula,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: "8h" }
        );
        res.status(200).json({ message: 'Inicio de sesión exitoso', token });
    } catch (error) {
        res.status(500).json({ message: 'Error al iniciar sesión', error });
    }
};

export const getProfile = async (req, res) => {
    try {
        const user = await SystemUser.findByPk(req.user.id, {
            attributes: { exclude: ['password'] }
        });
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener perfil', error });
    }
};
