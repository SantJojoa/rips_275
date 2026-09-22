import { createError } from '../utils/errorHandler.js';

const VALID_ROLES = ['SUPERADMIN', 'ADMIN', 'USER'];

/**
 * Validadores para operaciones de gestión de usuarios
 */
export class UserValidator {
    static validateId(id) {
        const parsed = parseInt(id, 10);

        if (isNaN(parsed) || parsed < 1) {
            throw createError(400, 'ID de usuario inválido');
        }

        return parsed;
    }

    static validateUpdateData(data) {
        const { username, nombres, apellidos, cedula, role, id_prestador, password } = data;
        const updates = {};

        if (username !== undefined) {
            if (typeof username !== 'string' || !username.trim()) {
                throw createError(400, 'El username debe ser un texto válido');
            }
            updates.username = username.trim();
        }

        if (nombres !== undefined) {
            if (typeof nombres !== 'string' || !nombres.trim()) {
                throw createError(400, 'Los nombres deben ser un texto válido');
            }
            updates.nombres = nombres.trim();
        }

        if (apellidos !== undefined) {
            if (typeof apellidos !== 'string') {
                throw createError(400, 'Los apellidos deben ser un texto válido');
            }
            updates.apellidos = apellidos.trim();
        }

        if (cedula !== undefined) {
            if (typeof cedula !== 'string' || !cedula.trim()) {
                throw createError(400, 'La cédula debe ser un texto válido');
            }
            updates.cedula = cedula.trim();
        }

        if (role !== undefined) {
            if (!VALID_ROLES.includes(role)) {
                throw createError(400, 'Rol inválido');
            }
            updates.role = role;
        }

        if (id_prestador !== undefined) {
            updates.id_prestador = id_prestador || null;
        }

        if (password !== undefined && password !== '') {
            if (typeof password !== 'string' || password.length < 6) {
                throw createError(400, 'La contraseña debe tener al menos 6 caracteres');
            }
            updates.password = password;
        }

        if (Object.keys(updates).length === 0) {
            throw createError(400, 'Debe proporcionar al menos un campo para actualizar');
        }

        return updates;
    }
}
