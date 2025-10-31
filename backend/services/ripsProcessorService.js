import db from '../models/index.js';
import { pick } from '../utils/ripsHelpers.js';
import { resolveUserDocFromItem } from '../utils/ripsHelpers.js';
import logger from '../utils/logger.js';

const {
    Consultas,
    Procedimiento,
    Hospitalizaciones,
    RecienNacido,
    Urgencias,
    Medicamento,
    OtroServicio,
} = db;


const SERVICE_COLLECTIONS = [
    { key: 'consultas', Model: Consultas, counter: 'consultas' },
    { key: 'procedimientos', Model: Procedimiento, counter: 'procedimientos' },
    { key: 'hospitalizaciones', Model: Hospitalizaciones, counter: 'hospitalizaciones' },
    { key: 'hospitalizacion', Model: Hospitalizaciones, counter: 'hospitalizaciones' },
    { key: 'recienNacidos', Model: RecienNacido, counter: 'recienNacidos' },
    { key: 'urgencias', Model: Urgencias, counter: 'urgencias' },
    { key: 'medicamentos', Model: Medicamento, counter: 'medicamentos' },
    { key: 'otrosServicios', Model: OtroServicio, counter: 'otrosServicios' },
];

const ROOT_SERVICE_COLLECTIONS = SERVICE_COLLECTIONS.filter(c => c.key !== 'hospitalizacion');


export class RipsProcessorService {

    static async processUserServices(usuario, usuarioData, transaction, created) {
        const servicios = usuarioData?.servicios || usuarioData?.Servicios || {};

        for (const { key, Model, counter } of SERVICE_COLLECTIONS) {
            const arr = servicios[key];
            if (!Array.isArray(arr)) continue;

            logger.info(
                `Usuario ${usuario.tipo_doc} ${usuario.num_doc} - ${key}: ${arr.length} servicios`
            );

            for (const item of arr) {
                await Model.create(
                    {
                        id_user: usuario.id,
                        tipo_doc_user: usuario.tipo_doc,
                        num_doc_user: String(usuario.num_doc),
                        data: item,
                    },
                    { transaction }
                );
                created[counter] += 1;
            }
        }
    }

    static extractUserData(usuarioData) {
        return {
            tipo_doc: pick(
                () => usuarioData.tipoDocumentoIdentificacion,
                () => usuarioData.tipoDoc,
                () => usuarioData.tipo_documento
            ),
            num_doc: pick(
                () => usuarioData.numDocumentoIdentificacion,
                () => usuarioData.numDoc,
                () => usuarioData.numero_documento
            ),
            extraData: {
                tipo_usuario: pick(() => usuarioData.tipoUsuario),
                fecha_nacimiento: pick(() => usuarioData.fechaNacimiento),
                cod_sexo: pick(() => usuarioData.codSexo),
                cod_pais_residencia: pick(() => usuarioData.codPaisResidencia),
                cod_municipio_residencia: pick(() => usuarioData.codMunicipioResidencia),
                incapacidad: pick(() => usuarioData.incapacidad),
                consecutivo: pick(() => usuarioData.consecutivo),
                cod_pais_origen: pick(() => usuarioData.codPaisOrigen),
            }
        };
    }

    static async processUsers(ripsData, userCacheManager, transaction, created) {
        const usuariosArr = ripsData.usuarios ||
            ripsData.Usuarios ||
            ripsData.users ||
            ripsData.afiliados ||
            [];

        if (!Array.isArray(usuariosArr) || usuariosArr.length === 0) {
            return null;
        }

        logger.info(`Procesando ${usuariosArr.length} usuarios`);

        let principalUser = null;

        for (const usuarioData of usuariosArr) {
            const { tipo_doc, num_doc, extraData } = this.extractUserData(usuarioData);

            if (tipo_doc && num_doc) {
                const usuario = await userCacheManager.getOrCreate(
                    tipo_doc,
                    num_doc,
                    extraData,
                    transaction
                );

                if (!principalUser) principalUser = usuario;

                created.usuarios += 1;

                await this.processUserServices(usuario, usuarioData, transaction, created);
                logger.info(`Usuario procesado: ${tipo_doc} ${num_doc}`);
            }
        }

        return principalUser;
    }

    static async processRootServices(ripsData, userCacheManager, transaction, created) {
        for (const { key, Model, counter } of ROOT_SERVICE_COLLECTIONS) {
            const arr = ripsData[key];
            if (!Array.isArray(arr)) continue;

            logger.info(`Root ${key} count: ${arr.length}`);

            for (const item of arr) {
                const { tipo_doc, num_doc } = resolveUserDocFromItem(item);
                if (!tipo_doc || !num_doc) continue;

                const user = await userCacheManager.getOrCreate(
                    tipo_doc,
                    num_doc,
                    {},
                    transaction
                );

                await Model.create(
                    {
                        id_user: user.id,
                        tipo_doc_user: tipo_doc,
                        num_doc_user: String(num_doc),
                        data: item,
                    },
                    { transaction }
                );
                created[counter] += 1;
            }
        }
    }
}