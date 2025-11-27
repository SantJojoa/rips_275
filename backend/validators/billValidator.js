import { createError } from '../utils/errorHandler.js';

/**
 * Validadores para operaciones de facturas
 */
export class BillValidator {
    /**
     * Valida parámetros de paginación
     */
    static validatePagination(query) {
        const page = parseInt(query.page, 10) || 1;
        const limit = parseInt(query.limit, 10) || 50;

        if (page < 1) {
            throw createError(400, 'El número de página debe ser mayor a 0');
        }

        if (limit < 1 || limit > 100) {
            throw createError(400, 'El límite debe estar entre 1 y 100');
        }

        return { page, limit, offset: (page - 1) * limit };
    }

    /**
     * Valida ID de factura
     */
    static validateId(id) {
        const parsed = parseInt(id, 10);

        if (isNaN(parsed) || parsed < 1) {
            throw createError(400, 'ID de factura inválido');
        }

        return parsed;
    }

    /**
     * Valida datos para actualizar factura
     */
    static validateUpdateData(data) {
        const { num_factura, valor_factura } = data;

        if (!num_factura && valor_factura === undefined) {
            throw createError(400, 'Debe proporcionar al menos un campo para actualizar');
        }

        const updates = {};

        if (num_factura !== undefined) {
            if (typeof num_factura !== 'string' || num_factura.trim() === '') {
                throw createError(400, 'El número de factura debe ser un string válido');
            }
            updates.num_factura = num_factura.trim();
        }

        if (valor_factura !== undefined) {
            const parsed = parseFloat(valor_factura);
            if (isNaN(parsed) || parsed < 0) {
                throw createError(400, 'El valor de factura debe ser un número positivo');
            }
            updates.valor_factura = parsed;
        }

        return updates;
    }

    /**
     * Valida filtros de búsqueda
     */
    static validateFilters(query) {
        const filters = {};

        if (query.periodo_fac) {
            const periodo = parseInt(query.periodo_fac, 10);
            if (!isNaN(periodo) && periodo >= 1 && periodo <= 12) {
                filters.periodo_fac = periodo;
            }
        }

        if (query.anio) {
            const anio = parseInt(query.anio, 10);
            if (!isNaN(anio) && anio >= 2000 && anio <= 2100) {
                filters.anio = anio;
            }
        }

        if (query.prestador_id) {
            const prestadorId = parseInt(query.prestador_id, 10);
            if (!isNaN(prestadorId)) {
                filters.prestador_id = prestadorId;
            }
        }

        if (query.num_factura) {
            filters.num_factura = query.num_factura.trim();
        }

        return filters;
    }
}