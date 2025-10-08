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

// Función para procesar servicios de un usuario específico
async function procesarServiciosUsuario(t, userCache, usuario, usuarioData, created) {
    const servicios = usuarioData?.servicios || usuarioData?.Servicios || {};

    // Procesar servicios anidados (consultas, procedimientos, etc.)
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

        console.log(`[IMPORT] Usuario ${usuario.tipo_doc} ${usuario.num_doc} - ${key}: ${arr.length} servicios`);

        for (const item of arr) {
            await Model.create(
                {
                    id_user: usuario.id,
                    tipo_doc_user: usuario.tipo_doc,
                    num_doc_user: String(usuario.num_doc),
                    data: item,
                },
                { transaction: t }
            );
            created[counter] += 1;
        }
    }
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

        const usuariosArr = ripsData.usuarios || ripsData.Usuarios || ripsData.users || ripsData.afiliados || [];

        let principalUser = null;
        let control = null;

        await sequelize.transaction(async (t) => {

            console.log('[IMPORT] Iniciando transacción...');

            // Procesar múltiples usuarios si existen
            if (Array.isArray(usuariosArr) && usuariosArr.length > 0) {
                console.log(`[IMPORT] Procesando ${usuariosArr.length} usuarios`);

                for (const usuarioData of usuariosArr) {
                    const tipo_doc = pick(
                        () => usuarioData.tipoDocumentoIdentificacion,
                        () => usuarioData.tipoDoc,
                        () => usuarioData.tipo_documento
                    );
                    const num_doc = pick(
                        () => usuarioData.numDocumentoIdentificacion,
                        () => usuarioData.numDoc,
                        () => usuarioData.numero_documento
                    );

                    if (tipo_doc && num_doc) {
                        // Crear o encontrar el usuario
                        const usuario = await getOrCreateUserByDoc(
                            t,
                            userCache,
                            tipo_doc,
                            num_doc,
                            {
                                tipo_usuario: pick(() => usuarioData.tipoUsuario),
                                fecha_nacimiento: pick(() => usuarioData.fechaNacimiento),
                                cod_sexo: pick(() => usuarioData.codSexo),
                                cod_pais_residencia: pick(() => usuarioData.codPaisResidencia),
                                cod_municipio_residencia: pick(() => usuarioData.codMunicipioResidencia),
                                incapacidad: pick(() => usuarioData.incapacidad),
                                consecutivo: pick(() => usuarioData.consecutivo),
                                cod_pais_origen: pick(() => usuarioData.codPaisOrigen),
                            }
                        );

                        // Si es el primer usuario, lo guardamos como principalUser para la transacción
                        if (!principalUser) {
                            principalUser = usuario;
                        }

                        created.usuarios += 1;

                        // Procesar servicios específicos de este usuario
                        await procesarServiciosUsuario(t, userCache, usuario, usuarioData, created);

                        console.log(`[IMPORT] Usuario procesado: ${tipo_doc} ${num_doc}`);
                    }
                }
            }

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
                    num_nit: parseInt(String(nit), 10),
                    num_factura: String(numFactura),
                    tipo_nota: String(tipoNota),
                    num_nota: String(numNota),
                },
                { transaction: t }
            );
            created.transaccionId = trx.id;

            // Asociar todos los usuarios procesados a la transacción
            const processedUsers = Array.from(userCache.values());
            if (processedUsers.length > 0) {
                await trx.addUsers(processedUsers, { transaction: t });
                console.log(`[IMPORT] Asociados ${processedUsers.length} usuarios a la transacción`);
            }

            // Procesar servicios raíz (no asociados a usuarios específicos)
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