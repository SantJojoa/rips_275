import express from "express"
import { login, getProfile, createUser } from '../controllers/authController.js'
import { authenticate, authorize } from '../middlewares/auth.js'
import { uploadRipsJson, uploadRipsJsonFile } from '../controllers/importController.js'
import { searchByFactura } from '../controllers/queryControllers.js'
import db from '../models/index.js';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });
const router = express.Router()


router.post('/login', login);
router.get('/profile', authenticate, getProfile);
router.post('/create-user', authenticate, authorize, createUser);



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
export default router;
