import db from "../models/index.js";
import { createError } from "../utils/errorHandler.js"
import logger from "../utils/logger.js"

const {
    sequelize,
    Transaccion,
    Users,
    Control,
    Prestador,
    Consultas,
    Procedimiento,
    Hospitalizaciones,
    RecienNacido,
    Urgencias,
    Medicamento,
    OtroServicio,
    UserTransaction
} = db;

export class FacturaService {

    static async findTransaccionByFactura(num_factura) {
        logger.info('Buscando factura', { num_factura })

        const transaccion = await Transaccion.findOne({
            where:
                sequelize.where(
                    sequelize.fn('trim', sequelize.col('num_factura')),
                    '=',
                    num_factura
                ),
            include: [
                {
                    model: Control,
                    include: [{ model: Prestador }]
                },
                {
                    model: Users,
                    through: UserTransaction,
                    required: false,
                    attributes: ['id', 'tipo_doc', 'num_doc', 'tipo_usuario', 'cod_sexo'],
                }
            ]
        });

        if (!transaccion) {
            logger.warn('Factura no encontrada', { num_factura });
            throw createError(404, 'Factura no encontrada');
        }

        if (!transaccion.Users || transaccion.Users.length === 0) {
            logger.warn('Sin usuarios asociados', { num_factura });
            throw createError(404, 'Sin usuarios asociados');
        }

        logger.info('Transaccion encontrada:', {
            num_factura,
            usuarios: transaccion.Users.length
        })

        return transaccion;
    }

    static async getUserServices(userId) {
        logger.info('Buscando servicios del usuario', { userId });

        const [
            consultas,
            procedimientos,
            hospitalizaciones,
            recienNacidos,
            urgencias,
            medicamentos,
            otrosServicios
        ] = await Promise.all([
            Consultas.findAll({ where: { id_user: userId } }),
            Procedimiento.findAll({ where: { id_user: userId } }),
            Hospitalizaciones.findAll({ where: { id_user: userId } }),
            RecienNacido.findAll({ where: { id_user: userId } }),
            Urgencias.findAll({ where: { id_user: userId } }),
            Medicamento.findAll({ where: { id_user: userId } }),
            OtroServicio.findAll({ where: { id_user: userId } })
        ]);

        const stats = {
            consultas: consultas.length,
            procedimientos: procedimientos.length,
            hospitalizaciones: hospitalizaciones.length,
            recienNacidos: recienNacidos.length,
            urgencias: urgencias.length,
            medicamentos: medicamentos.length,
            otrosServicios: otrosServicios.length
        };

        logger.info('Servicios encontrados', { userId, ...stats });

        return {
            consultas,
            procedimientos,
            hospitalizaciones,
            recienNacidos,
            urgencias,
            medicamentos,
            otrosServicios,
            stats
        };
    }

    static prepareMultipleUsersResponse(transaccion) {
        return {
            transaccion,
            control: transaccion.Control,
            users: transaccion.Users.map(user => ({
                id: user.id,
                tipo_doc: user.tipo_doc,
                num_doc: user.num_doc,
                tipo_usuario: user.tipo_usuario,
            })),
            multiple_users: true
        };
    }

    static prepareCompleteResponse(transaccion, selectedUser, services) {
        return {
            transaccion,
            control: transaccion.Control,
            usuario: selectedUser,
            ...services
        };
    }

    static async searchFactura(num_factura, user_id = null) {
        const transaccion = await this.findTransaccionByFactura(num_factura)

        if (transaccion.Users.length > 1 && !user_id) {
            logger.info('Multiples usuarios encontrados, requiere selección');
            return this.prepareMultipleUsersResponse(transaccion);
        }
        const userId = user_id || transaccion.Users[0].id;
        logger.info('Procesando usuario', { userId });

        const services = await this.getUserServices(userId);

        const selectedUser = transaccion.Users.find(
            user => user.id === parseInt(userId)
        );

        if (!selectedUser) {
            logger.warn('Usuario no encontrado', { userId });
            throw createError(404, 'Usuario no encontrado');
        }

        return this.prepareCompleteResponse(transaccion, selectedUser, services);
    }


}
