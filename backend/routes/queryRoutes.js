import express from 'express';
import { searchByFactura, consultarCUV } from '../controllers/queryControllers.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();



router.get('/factura', authenticate, searchByFactura);

router.post('consultar-cuv', authenticate, consultarCUV);

export default router;
