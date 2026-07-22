import db from '../models/index.js';
import { createError } from '../utils/errorHandler.js';
import logger from '../utils/logger.js';
import { Op } from 'sequelize';

const { Transaccion, Control, Prestador, sequelize } = db;


/**
 * Servicio para gestión de facturas
 */
export class BillService {
    /**
     * Obtiene facturas activas con paginación y filtros
     */
    static async getActiveBills({ page = 1, limit = 50, offset = 0, filters = {} }) {
        logger.info('Obteniendo facturas activas', { page, limit, filters });

        // Construir filtros para Control
        const controlWhere = { status: 'ACT' };

        if (filters.periodo_fac) {
            controlWhere.periodo_fac = filters.periodo_fac;
        }

        if (filters.anio) {
            controlWhere.año = filters.anio;
        }

        if (filters.prestador_id) {
            controlWhere.id_prestador = filters.prestador_id;
        }

        if (filters.numero_cuenta_cobro) {
            controlWhere.numero_cuenta_cobro = { [Op.iLike]: `%${filters.numero_cuenta_cobro}%` };
        }

        // Construir filtros para Transaccion
        const transaccionWhere = {};

        if (filters.num_factura) {
            transaccionWhere.num_factura = { [Op.iLike]: `%${filters.num_factura}%` };
        }

        // Query principal
        const { count, rows: facturas } = await Transaccion.findAndCountAll({
            where: transaccionWhere,
            include: [
                {
                    model: Control,
                    as: 'Control',
                    where: controlWhere,
                    include: [
                        {
                            model: Prestador,
                            as: 'Prestador',
                            attributes: ['id', 'nombre_prestador', 'nit']
                        }
                    ],
                    attributes: [
                        'id',
                        'periodo_fac',
                        'año',
                        'status',
                        'createdAt',
                        'updatedAt',
                        'numero_radicado',
                        'numero_cuenta_cobro'
                    ]
                }
            ],
            attributes: [
                'id',
                'num_nit',
                'num_factura',
                'valor_factura',
                'tipo_nota',
                'num_nota'
            ],
            order: [[{ model: Control, as: 'Control' }, 'id', 'DESC']],
            limit,
            offset,
            distinct: true // Para count correcto con includes
        });

        const totalPages = Math.ceil(count / limit);

        logger.info('Facturas obtenidas', {
            total: count,
            page,
            totalPages,
            returned: facturas.length
        });

        return {
            facturas,
            pagination: {
                total: count,
                page,
                limit,
                totalPages,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        };
    }

    /**
     * Obtiene una factura por ID
     */
    static async getBillById(id) {
        logger.info('Obteniendo factura por ID', { id });

        const factura = await Transaccion.findByPk(id, {
            include: [
                {
                    model: Control,
                    as: 'Control',
                    include: [
                        {
                            model: Prestador,
                            as: 'Prestador'
                        }
                    ]
                }
            ]
        });

        if (!factura) {
            throw createError(404, 'Factura no encontrada');
        }

        return factura;
    }

    /**
     * Actualiza una factura
     */
    static async updateBill(id, updateData) {
        logger.info('Actualizando factura', { id, updateData });

        // Verificar que existe
        const factura = await this.getBillById(id);

        // Actualizar
        await factura.update(updateData);

        logger.info('Factura actualizada exitosamente', { id });

        return factura;
    }

    /**
     * Soft delete de una factura (cambiar status del control a INACT)
     */
    static async softDeleteBill(id, motivo = null) {
        logger.info('Desactivando factura', { id });

        const factura = await this.getBillById(id);

        if (!factura.Control) {
            throw createError(400, 'La factura no tiene control asociado');
        }

        await factura.Control.update({ status: 'INACT', motivo_desactivacion: motivo || null });

        logger.info('Factura desactivada exitosamente', { id });

        return { message: 'Factura desactivada correctamente' };
    }

    static async getInactiveBills() {
        logger.info('Obteniendo facturas inactivas');

        const { sequelize: seq } = db;

        const rows = await seq.query(`
            SELECT
                c.id                  AS control_id,
                c.numero_radicado,
                c.numero_cuenta_cobro,
                c.periodo_fac,
                c."año",
                c."createdAt"         AS fecha,
                c."updatedAt"         AS fecha_desactivacion,
                c.motivo_desactivacion,
                c.id_system_user,
                su.username,
                su.nombres            AS usuario_nombres,
                su.apellidos          AS usuario_apellidos,
                t.id                  AS transaccion_id,
                t.num_factura,
                t.num_nit,
                t.valor_factura,
                p.nombre_prestador
            FROM control c
            LEFT JOIN transaccion  t  ON t.id_control  = c.id
            LEFT JOIN prestadores  p  ON p.id           = c.id_prestador
            LEFT JOIN system_users su ON su.id          = c.id_system_user
            WHERE c.status = 'INACT'
            ORDER BY c."updatedAt" DESC
        `, { type: seq.QueryTypes.SELECT });

        return rows;
    }

    /**
     * Hard delete de una factura (PELIGROSO - usar con cuidado)
     */
    static async hardDeleteBill(id) {
        logger.warn('HARD DELETE de factura', { id });

        const factura = await this.getBillById(id);

        // Usar transacción para eliminar todo relacionado
        await sequelize.transaction(async (t) => {
            // Eliminar factura
            await factura.destroy({ transaction: t });

            // Si quieres eliminar también el control:
            // await factura.Control.destroy({ transaction: t });
        });

        logger.warn('Factura eliminada permanentemente', { id });

        return { message: 'Factura eliminada correctamente' };
    }

    /**
     * Obtiene estadísticas de facturas
     */
    static async getBillsStats() {
        logger.info('Obteniendo estadísticas de facturas');

        const [stats] = await sequelize.query(`
            SELECT 
                COUNT(*) as total_facturas,
                SUM(CAST(valor_factura AS DECIMAL)) as valor_total,
                AVG(CAST(valor_factura AS DECIMAL)) as valor_promedio
            FROM transaccion t
            INNER JOIN control c ON t.id_control = c.id
            WHERE c.status = 'ACT'
        `);

        return stats[0] || {
            total_facturas: 0,
            valor_total: 0,
            valor_promedio: 0
        };
    }
}
