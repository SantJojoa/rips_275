import db from "../models/index.js";
import { hashPassword, comparePassword } from "../utils/password.js";
import { generateToken } from "../utils/jwt.js";
import { Op } from "sequelize";


const { SystemUser, Prestador } = db;

export const createUserService = async (data, creatorRole) => {
    if (creatorRole !== 'SUPERADMIN') throw { status: 403, message: 'Acceso denegado: solo SUPERADMIN puede crear usuarios' };

    const { role = "USER" } = data;

    if (role === 'USER') {
        return await createPrestadorUserService(data);
    }

    const { username, nombres, apellidos, cedula, password, id_prestador } = data;

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

/**
 * Crea un usuario de tipo prestador: username, cédula y contraseña inicial
 * se derivan del NIT del prestador seleccionado. Debe cambiar la contraseña
 * en su primer inicio de sesión.
 */
const createPrestadorUserService = async ({ nombres, id_prestador }) => {
    if (!nombres || !nombres.trim()) {
        throw { status: 400, message: "El nombre del prestador es obligatorio" };
    }
    if (!id_prestador) {
        throw { status: 400, message: "Debe seleccionar un prestador" };
    }

    const prestador = await Prestador.findByPk(id_prestador);
    if (!prestador) {
        throw { status: 404, message: "Prestador no encontrado" };
    }
    if (!prestador.nit) {
        throw { status: 400, message: "El prestador seleccionado no tiene NIT configurado" };
    }

    const nit = String(prestador.nit).trim();

    const existing = await SystemUser.findOne({ where: { [Op.or]: [{ username: nit }, { cedula: nit }] } });
    if (existing) {
        throw { status: 409, message: "Ya existe un usuario creado para este prestador" };
    }

    const hashedPassword = await hashPassword(nit);

    const newUser = await SystemUser.create({
        username: nit,
        nombres: nombres.trim(),
        apellidos: '',
        cedula: nit,
        password: hashedPassword,
        role: 'USER',
        id_prestador,
        must_change_password: true,
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
    if (password) {
        updateData.password = await hashPassword(password);
        updateData.must_change_password = true;
    }

    await user.update(updateData);

    const { password: _, ...userWithoutPassword } = user.toJSON();
    return userWithoutPassword;
};

export const changePasswordService = async (userId, currentPassword, newPassword) => {
    if (!currentPassword || !newPassword) {
        throw { status: 400, message: "Debe proporcionar la contraseña actual y la nueva" };
    }

    const user = await SystemUser.findByPk(userId);
    if (!user) throw { status: 404, message: "Usuario no encontrado" };

    const valid = await comparePassword(currentPassword, user.password);
    if (!valid) throw { status: 401, message: "La contraseña actual es incorrecta" };

    if (newPassword.length < 6) {
        throw { status: 400, message: "La nueva contraseña debe tener al menos 6 caracteres" };
    }
    if (newPassword === currentPassword) {
        throw { status: 400, message: "La nueva contraseña debe ser diferente a la actual" };
    }

    user.password = await hashPassword(newPassword);
    user.must_change_password = false;
    await user.save();

    const token = generateToken(user);
    return { token };
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
