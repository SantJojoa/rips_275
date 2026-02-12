import express from "express"
import { login, getProfile, createUser } from '../controllers/authController.js'
import { authenticate, authorize } from '../middlewares/auth.js'
import { uploadRipsJson, uploadRipsJsonFile } from '../controllers/importController.js'
import { searchByFactura, consultarCUV, compareCuvXml } from '../controllers/queryControllers.js'
import db from '../models/index.js';
import multer from 'multer';
import { handleControllerError } from '../utils/errorHandler.js';

const upload = multer({ dest: 'uploads/' });
const router = express.Router()


router.post('/login', login);
router.get('/profile', authenticate, getProfile);
router.post('/create-user', authenticate, authorize, createUser);



router.get('/prestadores', authenticate, authorize, async (req, res) => {
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
router.post('/upload-json-file', authenticate, authorize, upload.single('file'), uploadRipsJsonFile);



router.get('/search/factura', authenticate, searchByFactura);
router.post('/consultar-cuv', authenticate, consultarCUV);
router.post('/compare-cuv-xml', authenticate, upload.fields([
    { name: 'cuv', maxCount: 1 },
    { name: 'xml', maxCount: 1 }
]), compareCuvXml);
export default router;
