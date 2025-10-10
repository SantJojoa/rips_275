const express = require("express")
const { register, login, getProfile } = require('../controllers/authController.js')
const { authenticate, authorize } = require('../middlewares/auth.js')
const { uploadRipsJson, uploadRipsJsonFile } = require('../controllers/importController.js')
const { searchByFactura } = require('../controllers/queryControllers.js')
const db = require('../models');
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });
const router = express.Router()


router.post('/register', register);
router.post('/login', login);
router.get('/profile', authenticate, getProfile);



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

router.post('/upload-json', authenticate, authorize, uploadRipsJson);
router.post('/upload-json-file', authenticate, authorize, upload.single('file'), uploadRipsJsonFile);



router.get('/search/factura', authenticate, searchByFactura);
module.exports = router;