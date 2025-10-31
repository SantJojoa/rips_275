import db from '../models/index.js';
import { UserCacheManager } from '../utils/userCacheManager.js';
import { RipsValidator } from '../validators/ripsValidator.js';
import { RipsProcessorService } from './ripsProcessorService.js';
import { normalizeStatus, parseIntSafe } from '../utils/ripsHelpers.js';
import { createError } from '../utils/errorHandler.js';
import logger from '../utils/logger.js';

const { sequelize, Control, Transaccion, Prestador } = db;

export class RipsImportService {

    static async findPrestador(id_prestador, prestadorNit, prestadorCod) {
        let prestador = null;

        if (id_prestador) {
            prestador = await Prestador.findByPk(id_prestador);
        }

        if (!prestador && prestadorNit) {
            prestador = await Prestador.findOne({ where: { nit: prestadorNit } });
        }

        if (!prestador && prestadorCod) {
            prestador = await Prestador.findOne({ where: { cod_habilitacion: prestadorCod } });
        }

        if (!prestador) {
            throw createError(404, 'Prestador no encontrado');
        }

        return prestador;
    }


    static async validateDuplicateInvoice(nit, numFactura, transaction) {
        const existingTransaction = await Transaccion.findOne({
            where: {
                num_nit: parseInt(String(nit), 10),
                num_factura: String(numFactura)
            },
            transaction
        });

        if (existingTransaction) {
            throw createError(
                409,
                `Ya existe una factura registrada con el número ${numFactura} para el NIT ${nit}.`
            );
        }
    }

    static async createControl(data, transaction) {
        const { id_system_user, id_prestador, periodo_fac, anio, route, status } = data;

        logger.info('Creando control...', {
            id_system_user,
            id_prestador,
            periodo_fac,
            anio,
            route,
            status
        });

        const control = await Control.create(
            {
                id_system_user,
                id_prestador,
                periodo_fac: parseIntSafe(periodo_fac),
                ['año']: parseIntSafe(anio),
                route,
                status: normalizeStatus(status),
            },
            { transaction }
        );

        logger.info('Control creado con ID:', control.id);
        return control;
    }

    static async createTransaction(controlId, invoiceData, userCacheManager, transaction) {
        const { nit, numFactura, tipoNota, numNota } = invoiceData;

        await this.validateDuplicateInvoice(nit, numFactura, transaction);
        const trx = await Transaccion.create(
            {
                id_control: controlId,
                num_nit: parseInt(String(nit), 10),
                num_factura: String(numFactura),
                tipo_nota: String(tipoNota),
                num_nota: String(numNota),
            },
            { transaction }
        );

        const processedUsers = userCacheManager.getAllUsers();
        if (processedUsers.length > 0) {
            await trx.addUsers(processedUsers, { transaction });
            logger.info(`Asociados ${processedUsers.length} usuarios a la transacción`);
        }

        return trx;
    }

    static initializeCreatedCounter() {
        return {
            controlId: null,
            transaccionId: null,
            usuarios: 0,
            consultas: 0,
            procedimientos: 0,
            hospitalizaciones: 0,
            recienNacidos: 0,
            urgencias: 0,
            medicamentos: 0,
            otrosServicios: 0,
        };
    }

    static async processRipsImport(requestData) {
        const {
            id_system_user,
            id_prestador,
            prestadorNit,
            prestadorCod,
            periodo_fac,
            anio,
            status,
            route,
            ripsData
        } = requestData;

        const invoiceData = RipsValidator.validateRipsData(ripsData);

        const prestador = await this.findPrestador(id_prestador, prestadorNit, prestadorCod);

        const created = this.initializeCreatedCounter();
        const userCacheManager = new UserCacheManager();

        let control = null;

        await sequelize.transaction(async (t) => {
            logger.info('Iniciando transacción de importación...');

            await RipsProcessorService.processUsers(
                ripsData,
                userCacheManager,
                t,
                created
            );

            control = await this.createControl(
                {
                    id_system_user,
                    id_prestador: prestador.id,
                    periodo_fac,
                    anio,
                    route,
                    status
                },
                t
            );
            created.controlId = control.id;

            const trx = await this.createTransaction(
                control.id,
                invoiceData,
                userCacheManager,
                t
            );
            created.transaccionId = trx.id;

            await RipsProcessorService.processRootServices(
                ripsData,
                userCacheManager,
                t,
                created
            );
        });

        logger.info('Transacción completada exitosamente');

        await control.reload();
        logger.info('Control recargado - numero_radicado:', control.numero_radicado);

        return {
            radicado: control.numero_radicado || `${new Date().getFullYear()}-${control.id}`,
            controlId: control.id,
            created
        };
    }
}