import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import db from '../models/index.js'; // Ajusta si tu export default es db
const { SystemUser } = db;

dotenv.config();

const SALT_ROUNDS = 10;

export const createUser = async (req, res) => {
    try {
        if (req.user.role !== 'ADMIN') return res.status(401).json({ message: 'No tienes permiso para crear usuarios' });
        const { username, nombres, apellidos, cedula, password, role = 'USER' } = req.body;
        if (!username || !password || !nombres || !apellidos || !cedula) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }
        const existing = await SystemUser.findOne({ where: { username } });
        if (existing) {
            return res.status(400).json({ message: 'El nombre de usuario ya está registrado' });
        }
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        const newUser = await SystemUser.create({
            username,
            nombres,
            apellidos,
            cedula,
            password: hashedPassword,
            role
        });
        res.status(201).json({
            message: 'Usuario creado exitosamente', user: {
                id: newUser.id,
                username: newUser.username,
                nombres: newUser.nombres,
                apellidos: newUser.apellidos,
                cedula: newUser.cedula,
                role: newUser.role
            }
        });
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
