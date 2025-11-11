import express from 'express';
import { getPrestadores, getPrestadorById } from '../controllers/prestadorController.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = express.Router();


router.get('/', authenticate, getPrestadores);
router.get('/:id', authenticate, getPrestadorById);

export default router;
