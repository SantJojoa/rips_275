import db from "../models/index.js";
import { hashPassword, comparePassword } from "../utils/password.js";
import { generateToken } from "../utils/jwt.js";
import { Op } from "sequelize";


const { SystemUser, Prestador } = db;

export const createUserService = async (data, creatorRole) => {
    if (creatorRole !== 'SUPERADMIN') throw { status: 403, message: 'Acceso denegado: solo SUPERADMIN puede crear usuarios' };

    const { username, nombres, apellidos, cedula, password, role = "USER", id_prestador } = data;

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
        id_prestador: id_prestador || null,
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

export const getUsersService = async () => {
    return await SystemUser.findAll({
        attributes: { exclude: ["password"] },
        include: [{ model: Prestador, as: "prestador", attributes: ["id", "nombre_prestador", "nit"] }],
        order: [["id", "ASC"]],
    });
};

export const getUserByIdService = async (id) => {
    const user = await SystemUser.findByPk(id, {
        attributes: { exclude: ["password"] },
        include: [{ model: Prestador, as: "prestador", attributes: ["id", "nombre_prestador", "nit"] }],
    });

    if (!user) throw { status: 404, message: "Usuario no encontrado" };

    return user;
};

export const updateUserService = async (id, data) => {
    const user = await SystemUser.findByPk(id);
    if (!user) throw { status: 404, message: "Usuario no encontrado" };

    const { username, cedula, password, ...rest } = data;

    if (username || cedula) {
        const orConditions = [];
        if (username) orConditions.push({ username });
        if (cedula) orConditions.push({ cedula });

        const existing = await SystemUser.findOne({
            where: { [Op.and]: [{ id: { [Op.ne]: id } }, { [Op.or]: orConditions }] },
        });
        if (existing) throw { status: 409, message: "El username o la cédula ya están en uso" };
    }

    const updateData = { ...rest };
    if (username !== undefined) updateData.username = username;
    if (cedula !== undefined) updateData.cedula = cedula;
    if (password) updateData.password = await hashPassword(password);

    await user.update(updateData);

    const { password: _, ...userWithoutPassword } = user.toJSON();
    return userWithoutPassword;
};

export const deleteUserService = async (id, requesterId) => {
    if (Number(id) === Number(requesterId)) {
        throw { status: 400, message: "No puedes eliminar tu propio usuario" };
    }

    const user = await SystemUser.findByPk(id);
    if (!user) throw { status: 404, message: "Usuario no encontrado" };

    await user.destroy();

    return { message: "Usuario eliminado correctamente" };
};
