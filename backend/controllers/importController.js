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
    const applyUpdatesIfNeeded = async (user, extraObj) => {
        if (!extraObj || typeof extraObj !== 'object') return user;

        const updates = {};

        for (const [k, v] of Object.entries(extraObj)) {
            if (v === undefined || v === null) continue;

            if (user[k] === undefined || user[k] === null) updates[k] = v;
        }

        if (Object.keys(updates).length > 0) {
            await user.update(updates, { transaction: t || undefined });
            Object.assign(user, updates);
        }
        return user;
    }
    if (cache.has(key)) {
        const cached = cache.get(key);
        await applyUpdatesIfNeeded(cached, extra);
        return cached;
    }
    let user = await Users.findOne({ where: { tipo_doc, num_doc }, transaction: t || undefined });

    if (user) {
        user = await applyUpdatesIfNeeded(user, extra);
        cache.set(key, user);
        return user;
    }

    user = await Users.create(
        {
            tipo_doc,
            num_doc,
            ...extra,
        },
        { transaction: t || undefined }
    )
    cache.set(key, user);
    return user;
}




function resolveUserDocFromItem(item) {
    const tipo = pick(
        () => item?.tipoDocumentoIdentificacion,
        () => item?.tipoDocUsuario,
        () => item?.usuario?.tipoDocumentoIdentificacion,
        () => item?.tipoDoc,
        () => item?.tipo_documento,
        () => item?.usuario?.tipoDoc


    );
    const num = pick(
        () => item?.numDocumentoIdentificacion,
        () => item?.numDocUsuario,
        () => item?.usuario?.numDocumentoIdentificacion,
        () => item?.numDoc,
        () => item?.numero_documento,
        () => item?.usuario?.numDoc
    );
    return { tipo_doc: tipo, num_doc: num };
}


exports.uploadRipsJsonFile = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'Falta archivo RIPS' });

        const fs = require('fs');
        const text = fs.readFileSync(req.file.path, 'utf8');
        let dataObj = null;
        try {
            dataObj = JSON.parse(text);
        } catch (error) {
            return res.status(400).json({ message: 'Error al parsear el archivo RIPS', error: String(error) });
        }
        req.body = {
            ...req.body,
            data: dataObj,
            route: req.file.path,
        }
        return exports.uploadRipsJson(req, res);
    } catch (error) {
        return res.status(500).json({ message: 'Error al procesar el JSON', error: String(error) });
    }
}

exports.uploadRipsJson = async (req, res) => {
    const { id: id_system_user } = req.user || {};
    const {
        prestadorId: id_prestador,
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

        const userCache = new Map()

        const usuariosArr =
            ripsData.usuarios ||
            ripsData.Usuarios ||
            ripsData.users ||
            ripsData.afiliados ||
            [];

        let principalUser = null;
        if (Array.isArray(usuariosArr)) {
            for (const u of usuariosArr) {
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
                    principalUser = await getOrCreateUserByDoc(null, userCache, tipo_doc, num_doc);
                    break
                }
            }
        }

        if (!principalUser) {
            const collections = [
                'consultas',
                'procedimientos',
                'hospitalizaciones',
                'recienNacidos',
                'urgencias',
                'medicamentos',
                'otrosServicios',
            ];
            for (const key of collections) {
                const arr = ripsData[key];
                if (!Array.isArray(arr) || arr.length === 0) continue;
                const item = arr[0]
                const { tipo_doc, num_doc } = resolveUserDocFromItem(item)
                if (tipo_doc && num_doc) {
                    principalUser = await getOrCreateUserByDoc(null, userCache, tipo_doc, num_doc);
                    break;
                }
            }
        }


        let control = null;

        await sequelize.transaction(async (t) => {

            console.log('[IMPORT] Iniciando transacción...');
            const routeFromBody = req.body.route;
            console.log('[IMPORT] Creando control...', { id_system_user, id_prestador, periodoFac, anioInt, routeFromBody, statusNorm });
            control = await Control.create(
                {
                    id_system_user,
                    id_prestador,
                    periodo_fac: periodoFac,
                    ['año']: anioInt,
                    route: routeFromBody,
                    status: statusNorm,
                },
                { transaction: t }
            );
            console.log('[IMPORT] Control creado con ID:', control.id);
            created.controlId = control.id;

            // Validar si ya existe una factura con el mismo número y NIT
            const existingTransaction = await Transaccion.findOne({
                where: {
                    num_nit: parseInt(String(nit), 10),
                    num_factura: String(numFactura)
                },
                transaction: t
            });

            if (existingTransaction) {
                throw new Error(`Ya existe una factura registrada con el número ${numFactura} para el NIT ${nit}. No se puede procesar una factura duplicada.`);
            }

            const trx = await Transaccion.create(
                {
                    id_control: control.id,
                    id_user: principalUser ? principalUser.id : null,
                    num_nit: parseInt(String(nit), 10),
                    num_factura: String(numFactura),
                    tipo_nota: String(tipoNota),
                    num_nota: String(numNota),
                },
                { transaction: t }
            );
            created.transaccionId = trx.id;


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
                        const tipo = pick(
                            () => u?.tipoDocumentoIdentificacion,
                            () => u?.tipoDoc,
                            () => u?.tipo_documento
                        );
                        const num = pick(
                            () => u?.numDocumentoIdentificacion,
                            () => u?.numDoc,
                            () => u?.numero_documento
                        );
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

        console.log('[IMPORT] Transacción completada exitosamente');

        // Recargar el control para obtener el numero_radicado actualizado
        console.log('[IMPORT] Recargando control para obtener numero_radicado...');
        await control.reload();
        console.log('[IMPORT] Control recargado - numero_radicado:', control.numero_radicado);

        return res.status(201).json({
            message: 'Carga realizada correctamente',
            radicado: control.numero_radicado || `${new Date().getFullYear()}-${control.id}`,
            controlId: control.id,
            created: {
                controlId: control.id,
                transaccionId: created.transaccionId || null,
                usuarios: created.usuarios || 0,
                consultas: created.consultas || 0,
                procedimientos: created.procedimientos || 0,
                hospitalizaciones: created.hospitalizaciones || 0,
                recienNacidos: created.recienNacidos || 0,
                urgencias: created.urgencias || 0,
                medicamentos: created.medicamentos || 0,
                otrosServicios: created.otrosServicios || 0,
            }
        });
    } catch (error) {
        console.error('[IMPORT] Error durante el proceso de importación:', error);
        return res.status(500).json({
            message: 'Error al procesar el JSON',
            error: process.env.NODE_ENV === 'development' ? String(error) : 'Error interno del servidor'
        });
    }
};