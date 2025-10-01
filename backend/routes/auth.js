const express = require("express")
const { register, login } = require('../controllers/authController.js')
const { authenticate, authorize } = require('../middlewares/auth.js')
const { uploadRipsJson, uploadRipsJsonFile } = require('../controllers/importController.js')
const db = require('../models');
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });


const router = express.Router()

router.get('/prestadores', authenticate, authorize, async (req, res) => {
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
});

router.get('/debug/prestadores', authenticate, authorize, async (req, res) => {
    const list = await db.Prestador.findAll({ limit: 50, order: [['id', 'ASC']] });
    res.json(list.map(p => ({ id: p.id, nombre: p.nombre_prestador, nit: p.nit, cod: p.cod_habilitacion })));
});

router.get('/debug/prestador/:id', authenticate, authorize, async (req, res) => {
    const p = await db.Prestador.findByPk(req.params.id);
    res.json({ exists: !!p, prestador: p });
});

router.post('/register', register);
router.post('/login', login);

// Rutas protegidas (subir facturas)
router.post('/upload-json', authenticate, authorize, uploadRipsJson);
router.post('/upload-json-file', authenticate, authorize, upload.single('file'), uploadRipsJsonFile);

// Debug: listar y buscar prestadores


module.exports = router;