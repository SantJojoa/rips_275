import { createError } from '../utils/errorHandler.js';

export class QueryValidator {
    static validateFacturaSearch(query) {
        const { num_factura } = query;

        if (!num_factura) throw createError(400, 'El número de factura es requerido');

        return {
            num_factura: num_factura.toString().trim()
        };
    }

    static validateCUV(body) {
        const { codigoUnicoValidacion } = body;
        if (!codigoUnicoValidacion) throw createError(400, 'El código único de validación es requerido');

        return codigoUnicoValidacion;
    }

    static parseUserId(user_id) {
        if (!user_id) return null;

        const parsed = parseInt(user_id);
        if (isNaN(parsed)) throw createError(400, 'El id del usuario debe ser un número válido');

        return parsed;
    }
}