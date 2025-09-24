const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../models');
const { SystemUser } = db;


const dotenv = require('dotenv');

dotenv.config();

const SALT_ROUNDS = 10;

const register = async (req, res) => {
    const { username, password, role = 'USER' } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        const user = await SystemUser.create({ username, password: hashedPassword, role });
        res.status(201).json({ message: 'Usuario creado exitosamente', user });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el usuario', error });
    }
}

const login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await SystemUser.findOne({ where: { username } });
        if (!user) return res.status(401).json({ message: 'Usuario no encontrado' });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ message: 'Contraseña incorrecta' });

        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "8h" }
        );
        res.status(200).json({ message: 'Inicio de sesión exitoso', token });
    } catch (error) {
        res.status(500).json({ message: 'Error al iniciar sesión', error });
    }
};

module.exports = { register, login };