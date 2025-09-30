const db = require('../models');

const {
    sequelize,
    Control,
    Transaccion,
    Users,
    Prestador,
    Consultas,
    Procedimiento,
    Hospitalizaciones,
    RecienNacido,
    Urgencias,
    Medicamento,
    OtroServicio,
} = db;

function pick(...options) {
    for (const fn of options) {
        const v = typeof fn === 'function' ? fn() : undefined;
        if (v !== undefined && v !== null) return v;
    }
    return undefined;
}

async function getOrCreateUserByDoc(t, cache, tipo_doc, num_doc, extra = {}) {
    const key = `${tipo_doc}|${num_doc}`;
    if (cache.has(key)) return cache.get(key);

    let user = await Users.findOne({ where: { tipo_doc, num_doc }, transaction: t });
    if (!user) {
        user = await Users.create(
            {
                tipo_doc,
                num_doc,
                ...extra,
            },
            { transaction: t }
        );
    }
    cache.set(key, user);
    return user;
}

function resolveUserDocFromItem(item) {
    const tipo = pick(
        () => item?.tipoDocumentoIdentificacion,
        () => item?.tipoDocUsuario,
        () => item?.usuario?.tipoDocumentoIdentificacion
    );
    const num = pick(
        () => item?.numDocumentoIdentificacion,
        () => item?.numDocUsuario,
        () => item?.usuario?.numDocumentoIdentificacion
    );
    return { tipo_doc: tipo, num_doc: num };
}

exports.uploadRipsJson = async (req, res) => {
    const { id: id_system_user } = req.user || {};
    const {
        prestadorId: id_prestador,
        fecha_registro,
        periodo_fac,
        anio,
        status = 'ACT',
        data: ripsData,
    } = req.body || {};

    if (!id_prestador) return res.status(400).json({ message: 'Falta `prestadorId`' });
    if (!ripsData || typeof ripsData !== 'object') {
        return res.status(400).json({ message: 'Falta `data` (JSON RIPS)' });
    }

    try {
        let prestador = null;
        if (id_prestador) {
            prestador = await Prestador.findByPk(id_prestador);
        }
        if (!prestador && req.body.prestadorNit) {
            prestador = await Prestador.findOne({ where: { nit: req.body.prestadorNit } });
        }
        if (!prestador && req.body.prestadorCod) {
            prestador = await Prestador.findOne({ where: { cod_habilitacion: req.body.prestadorCod } });
        }
        if (!prestador) return res.status(404).json({ message: 'Prestador no encontrado' });

        const nit = ripsData.numDocumentoIdObligado;
        const numFactura = ripsData.numFactura;
        const tipoNota = ripsData.tipoNota ?? '';
        const numNota = ripsData.numNota ?? '';

        if (nit == null || numFactura == null) {
            return res.status(400).json({
                message: 'El JSON debe incluir `numDocumentoIdObligado` y `numFactura`',
            });
        }

        const fechaRegistro = fecha_registro ? new Date(fecha_registro) : new Date();
        const periodoFac = periodo_fac != null ? parseInt(periodo_fac, 10) : null;
        const anioInt = anio != null ? parseInt(anio, 10) : null;
        const statusNorm = ['ACT', 'INACT', 'ERROR'].includes(String(status).toUpperCase())
            ? String(status).toUpperCase()
            : 'ACT';

        const created = {
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

        await sequelize.transaction(async (t) => {
            // Crear Control
            const control = await Control.create(
                {
                    id_system_user,
                    id_prestador,
                    fecha_registro: fechaRegistro,
                    periodo_fac: periodoFac,
                    ['año']: anioInt,
                    route: 'API_UPLOAD',
                    status: statusNorm,
                },
                { transaction: t }
            );
            created.controlId = control.id;

            // Crear Transaccion
            const trx = await Transaccion.create(
                {
                    id_control: control.id,
                    num_nit: parseInt(String(nit), 10),
                    num_factura: parseInt(String(numFactura), 10),
                    tipo_nota: String(tipoNota),
                    num_nota: String(numNota),
                    fecha: fechaRegistro,
                },
                { transaction: t }
            );
            created.transaccionId = trx.id;

            // Cache de usuarios por (tipo_doc|num_doc)
            const userCache = new Map();

            // Crear/actualizar usuarios si vienen en el JSON
            const usuariosArr =
                ripsData.usuarios ||
                ripsData.Usuarios ||
                ripsData.users ||
                ripsData.afiliados ||
                [];

            for (const u of Array.isArray(usuariosArr) ? usuariosArr : []) {
                const tipo_doc = pick(
                    () => u.tipoDocumentoIdentificacion,
                    () => u.tipoDoc,
                    () => u.tipo_documento
                );
                const num_doc = pick(
                    () => u.numDocumentoIdentificacion,
                    () => u.numDoc,
                    () => u.numero_documento
                );
                if (tipo_doc && num_doc) {
                    await getOrCreateUserByDoc(
                        t,
                        userCache,
                        tipo_doc,
                        num_doc,
                        {
                            tipo_usuario: pick(() => u.tipoUsuario),
                            fecha_nacimiento: pick(() => u.fechaNacimiento),
                            cod_sexo: pick(() => u.codSexo),
                            cod_pais_residencia: pick(() => u.codPaisResidencia),
                            cod_municipio_residencia: pick(() => u.codMunicipioResidencia),
                            incapacidad: pick(() => u.incapacidad),
                            consecutivo: pick(() => u.consecutivo),
                            cod_pais_origen: pick(() => u.codPaisOrigen),
                        }
                    );
                    created.usuarios += 1;
                }
            }

            // Procesar colecciones anidadas en usuarios[].Servicios.*
            for (const u of Array.isArray(usuariosArr) ? usuariosArr : []) {
                const servicios = u?.Servicios || u?.servicios || {};
                const nestedCollections = [
                    { key: 'consultas', Model: Consultas, counter: 'consultas' },
                    { key: 'procedimientos', Model: Procedimiento, counter: 'procedimientos' },
                    { key: 'hospitalizaciones', Model: Hospitalizaciones, counter: 'hospitalizaciones' },
                    { key: 'hospitalizacion', Model: Hospitalizaciones, counter: 'hospitalizaciones' },
                    { key: 'recienNacidos', Model: RecienNacido, counter: 'recienNacidos' },
                    { key: 'urgencias', Model: Urgencias, counter: 'urgencias' },
                    { key: 'medicamentos', Model: Medicamento, counter: 'medicamentos' },
                    { key: 'otrosServicios', Model: OtroServicio, counter: 'otrosServicios' },
                ];

                for (const { key, Model, counter } of nestedCollections) {
                    const arr = servicios[key];
                    if (!Array.isArray(arr)) continue;

                    console.log(`[IMPORT] Nested ${key} count:`, arr.length);

                    for (const item of arr) {
                        // Usar únicamente el documento del usuario (paciente)
                        const tipo = u?.tipoDocumentoIdentificacion;
                        const num = u?.numDocumentoIdentificacion;
                        if (!tipo || !num) continue;

                        const user = await getOrCreateUserByDoc(t, userCache, tipo, num);
                        await Model.create(
                            {
                                id_user: user.id,
                                tipo_doc_user: tipo,
                                num_doc_user: String(num),
                                data: item,
                            },
                            { transaction: t }
                        );
                        created[counter] += 1;
                    }
                }
            }

            // Mapeo de colecciones -> Modelo
            const collections = [
                { key: 'consultas', Model: Consultas, counter: 'consultas' },
                { key: 'procedimientos', Model: Procedimiento, counter: 'procedimientos' },
                { key: 'hospitalizaciones', Model: Hospitalizaciones, counter: 'hospitalizaciones' },
                { key: 'recienNacidos', Model: RecienNacido, counter: 'recienNacidos' },
                { key: 'urgencias', Model: Urgencias, counter: 'urgencias' },
                { key: 'medicamentos', Model: Medicamento, counter: 'medicamentos' },
                { key: 'otrosServicios', Model: OtroServicio, counter: 'otrosServicios' },
            ];

            for (const { key, Model, counter } of collections) {
                const arr = ripsData[key];
                if (!Array.isArray(arr)) continue;
                console.log(`[IMPORT] Root ${key} count:`, arr.length);

                for (const item of arr) {
                    const { tipo_doc, num_doc } = resolveUserDocFromItem(item);
                    if (!tipo_doc || !num_doc) continue;

                    const user = await getOrCreateUserByDoc(t, userCache, tipo_doc, num_doc);
                    await Model.create(
                        {
                            id_user: user.id,
                            tipo_doc_user: tipo_doc,
                            num_doc_user: String(num_doc),
                            data: item,
                        },
                        { transaction: t }
                    );
                    created[counter] += 1;
                }
            }
        });

        return res.status(201).json({
            message: 'Carga realizada correctamente',
            created,
        });
    } catch (error) {
        return res.status(500).json({ message: 'Error al procesar el JSON', error: String(error) });
    }
};