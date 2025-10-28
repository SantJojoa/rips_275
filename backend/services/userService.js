import db from "../models/index.js";
import { hashPassword, comparePassword } from "../utils/password.js";
import { generateToken } from "../utils/jwt.js";


const { SystemUser } = db;

export const createUserService = async (data, creatorRole) => {
    if (creatorRole !== 'ADMIN') throw { status: 403, message: 'Acceso denegado' };

    const { username, nombres, apellidos, cedula, password, role = "USER" } = data;

    if (![username, nombres, apellidos, cedula, password].every(Boolean)) {
        throw { status: 400, message: "Todos los campos son obligatorios" };
    }

    const existing = await SystemUser.findOne({ where: { username } }) || await SystemUser.findOne({ where: { cedula } });
    if (existing) {
        throw { status: 409, message: "El username o la cédula ya están en uso" };
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await SystemUser.create({
        username,
        nombres,
        apellidos,
        cedula,
        password: hashedPassword,
        role,
    });

    const { password: _, ...userWithoutPassword } = newUser.toJSON();
    return userWithoutPassword;
};

export const loginService = async ({ username, password }) => {
    const user = await SystemUser.findOne({ where: { username } });
    if (!user) throw { status: 401, message: "Credenciales inválidas" };

    const valid = await comparePassword(password, user.password);
    if (!valid) throw { status: 401, message: "Credenciales inválidas" };

    const token = generateToken(user);
    return { token };
};

export const getProfileService = async (userId) => {
    const user = await SystemUser.findByPk(userId, {
        attributes: { exclude: ["password"] },
    });

    if (!user) throw { status: 404, message: "Usuario no encontrado" };

    return user;
};
