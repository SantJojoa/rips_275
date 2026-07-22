import express from "express"
import { login, getProfile, createUser } from '../controllers/authController.js'
import { authenticate, authorize, authorizeSuperAdmin } from '../middlewares/auth.js'
import { uploadRipsJson, uploadRipsJsonFile } from '../controllers/importController.js'
import { searchByFactura, consultarCUV, compareCuvXml, compareCuvXmlBatch } from '../controllers/queryControllers.js'
import db from '../models/index.js';
import multer from 'multer';
import { handleControllerError } from '../utils/errorHandler.js';
import fs from 'fs';
import path from 'path';

const upload = multer({ dest: 'uploads/' });
const router = express.Router()


router.post('/login', login);
router.get('/profile', authenticate, getProfile);
router.post('/create-user', authenticate, authorizeSuperAdmin, createUser);



router.get('/prestadores', authenticate, async (req, res) => {
    try {
        const list = await db.Prestador.findAll({
            attributes: ['id', 'nombre_prestador', 'nit', 'cod_habilitacion'],
            order: [['id', 'ASC']],
            limit: 5000,
        });
        res.json(list.map(p => ({
            id: p.id,
            nombre: p.nombre_prestador,
            nit: p.nit,
            cod: p.cod_habilitacion,
        })));
    } catch (error) {
        handleControllerError(res, error);
    }
});

router.post('/upload-json', authenticate, authorize, uploadRipsJson);
router.post('/upload-json-file', authenticate, upload.fields([
    { name: 'file', maxCount: 1 }, // admin (legacy)
    { name: 'rip',  maxCount: 1 }, // user
    { name: 'cuv',  maxCount: 1 },
    { name: 'xml',  maxCount: 1 },
]), uploadRipsJsonFile);



// ── Todos los registros (ADMIN) ─────────────────────────────────────────────
router.get('/todos-registros', authenticate, authorize, async (req, res) => {
    try {
        const { sequelize } = db;

        const rows = await sequelize.query(`
            SELECT
                c.id                  AS control_id,
                c.numero_radicado,
                c.numero_cuenta_cobro,
                c.periodo_fac,
                c."año",
                COALESCE(t.route, c.route) AS route,
                c."createdAt"         AS fecha,
                c.id_system_user,
                su.username,
                su.nombres            AS usuario_nombres,
                su.apellidos          AS usuario_apellidos,
                t.id                  AS transaccion_id,
                t.num_factura,
                t.num_nit,
                t.valor_factura,
                p.id                  AS prestador_id,
                p.nombre_prestador,
                p.nit                 AS prestador_nit,
                (SELECT COUNT(*) FROM user_transactions ut WHERE ut.id_transaction = t.id)                      AS num_usuarios,
                (SELECT COUNT(*) FROM consultas         co JOIN user_transactions ut ON co.id_user = ut.id_user WHERE ut.id_transaction = t.id) AS num_consultas,
                (SELECT COUNT(*) FROM procedimientos    pr JOIN user_transactions ut ON pr.id_user = ut.id_user WHERE ut.id_transaction = t.id) AS num_procedimientos,
                (SELECT COUNT(*) FROM medicamentos      me JOIN user_transactions ut ON me.id_user = ut.id_user WHERE ut.id_transaction = t.id) AS num_medicamentos,
                (SELECT COUNT(*) FROM hospitalizaciones ho JOIN user_transactions ut ON ho.id_user = ut.id_user WHERE ut.id_transaction = t.id) AS num_hospitalizaciones,
                (SELECT COUNT(*) FROM urgencias         ur JOIN user_transactions ut ON ur.id_user = ut.id_user WHERE ut.id_transaction = t.id) AS num_urgencias,
                (SELECT COUNT(*) FROM otro_servicios    os JOIN user_transactions ut ON os.id_user = ut.id_user WHERE ut.id_transaction = t.id) AS num_otros
            FROM control c
            LEFT JOIN transaccion   t  ON t.id_control   = c.id
            LEFT JOIN prestadores   p  ON p.id            = c.id_prestador
            LEFT JOIN system_users  su ON su.id           = c.id_system_user
            WHERE c.status = 'ACT'
            ORDER BY c."createdAt" DESC
        `, { type: sequelize.QueryTypes.SELECT });

        const registros = rows.map(r => {
            let archivos = { rip: null, cuv: null, xml: null };
            if (r.route && fs.existsSync(r.route)) {
                const files = fs.readdirSync(r.route);
                archivos.rip = files.find(f => f.includes('_RIP')) || null;
                archivos.cuv = files.find(f => f.includes('_CUV')) || null;
                archivos.xml = files.find(f => f.includes('_XML')) || null;
            }
            return { ...r, archivos };
        });

        res.json(registros);
    } catch (error) {
        handleControllerError(res, error);
    }
});

// ── Descarga admin (sin restricción de usuario) ──────────────────────────────
router.get('/descargar-archivo-admin', authenticate, authorize, async (req, res) => {
    try {
        const { transaccionId, filename } = req.query;
        if (!transaccionId || !filename) return res.status(400).json({ message: 'Faltan parámetros' });

        const transaccion = await db.Transaccion.findByPk(transaccionId, {
            include: [{ model: db.Control, as: 'Control' }],
        });
        if (!transaccion) return res.status(404).json({ message: 'Factura no encontrada' });

        const folder = transaccion.route || transaccion.Control?.route;
        if (!folder) return res.status(404).json({ message: 'Archivo no encontrado' });

        const filePath = path.join(folder, filename);
        if (!fs.existsSync(filePath)) return res.status(404).json({ message: 'Archivo no encontrado' });

        res.download(filePath, filename);
    } catch (error) {
        handleControllerError(res, error);
    }
});

// ── Mis registros (USER) ────────────────────────────────────────────────────
router.get('/mis-registros', authenticate, async (req, res) => {
    try {
        const userId = req.user.id;
        const { sequelize } = db;

        const rows = await sequelize.query(`
            SELECT
                c.id                  AS control_id,
                c.numero_radicado,
                c.numero_cuenta_cobro,
                c.periodo_fac,
                c."año",
                COALESCE(t.route, c.route) AS route,
                c."createdAt"         AS fecha,
                t.id                  AS transaccion_id,
                t.num_factura,
                t.num_nit,
                t.valor_factura,
                p.nombre_prestador,
                p.nit                 AS prestador_nit,
                (SELECT COUNT(*) FROM user_transactions ut WHERE ut.id_transaction = t.id)                      AS num_usuarios,
                (SELECT COUNT(*) FROM consultas         co JOIN user_transactions ut ON co.id_user = ut.id_user WHERE ut.id_transaction = t.id) AS num_consultas,
                (SELECT COUNT(*) FROM procedimientos    pr JOIN user_transactions ut ON pr.id_user = ut.id_user WHERE ut.id_transaction = t.id) AS num_procedimientos,
                (SELECT COUNT(*) FROM medicamentos      me JOIN user_transactions ut ON me.id_user = ut.id_user WHERE ut.id_transaction = t.id) AS num_medicamentos,
                (SELECT COUNT(*) FROM hospitalizaciones ho JOIN user_transactions ut ON ho.id_user = ut.id_user WHERE ut.id_transaction = t.id) AS num_hospitalizaciones,
                (SELECT COUNT(*) FROM urgencias         ur JOIN user_transactions ut ON ur.id_user = ut.id_user WHERE ut.id_transaction = t.id) AS num_urgencias,
                (SELECT COUNT(*) FROM otro_servicios    os JOIN user_transactions ut ON os.id_user = ut.id_user WHERE ut.id_transaction = t.id) AS num_otros
            FROM control c
            LEFT JOIN transaccion   t ON t.id_control   = c.id
            LEFT JOIN prestadores   p ON p.id            = c.id_prestador
            WHERE c.id_system_user = :userId AND c.status = 'ACT'
            ORDER BY c."createdAt" DESC
        `, { replacements: { userId }, type: sequelize.QueryTypes.SELECT });

        // Adjuntar qué archivos existen en la carpeta
        const registros = rows.map(r => {
            let archivos = { rip: null, cuv: null, xml: null };
            if (r.route && fs.existsSync(r.route)) {
                const files = fs.readdirSync(r.route);
                archivos.rip = files.find(f => f.includes('_RIP')) || null;
                archivos.cuv = files.find(f => f.includes('_CUV')) || null;
                archivos.xml = files.find(f => f.includes('_XML')) || null;
            }
            return { ...r, archivos };
        });

        res.json(registros);
    } catch (error) {
        handleControllerError(res, error);
    }
});

// ── Descarga de archivo por control ─────────────────────────────────────────
router.get('/descargar-archivo', authenticate, async (req, res) => {
    try {
        const { transaccionId, filename } = req.query;
        const userId = req.user.id;

        if (!transaccionId || !filename) return res.status(400).json({ message: 'Faltan parámetros' });

        const transaccion = await db.Transaccion.findByPk(transaccionId, {
            include: [{ model: db.Control, as: 'Control' }],
        });
        if (!transaccion || transaccion.Control?.id_system_user !== userId) {
            return res.status(403).json({ message: 'Sin acceso a este registro' });
        }

        const folder = transaccion.route || transaccion.Control?.route;
        if (!folder) return res.status(404).json({ message: 'Archivo no encontrado' });

        const filePath = path.join(folder, filename);
        if (!fs.existsSync(filePath)) return res.status(404).json({ message: 'Archivo no encontrado' });

        res.download(filePath, filename);
    } catch (error) {
        handleControllerError(res, error);
    }
});

router.get('/search/factura', authenticate, searchByFactura);
router.post('/consultar-cuv', authenticate, consultarCUV);
router.post('/compare-cuv-xml', authenticate, upload.fields([
    { name: 'cuv', maxCount: 1 },
    { name: 'xml', maxCount: 1 }
]), compareCuvXml);
router.post('/compare-cuv-xml-batch', authenticate, upload.fields([
    { name: 'cuv', maxCount: 100 },
    { name: 'xml', maxCount: 100 }
]), compareCuvXmlBatch);
export default router;
