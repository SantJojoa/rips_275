import express from 'express';
import {
    getBills,
    getBillById,
    updateBill,
    deleteBill,
    hardDeleteBill,
    getBillsStats,
    getInactiveBills
} from '../controllers/billController.js';
import { authenticate, authorize, authorizeSuperAdmin } from '../middlewares/auth.js';

const router = express.Router();

/**
 * @route   GET /api/bills
 * @desc    Obtener facturas activas con paginación y filtros
 * @query   page, limit, periodo_fac, anio, prestador_id, num_factura
 * @access  Private/Admin
 */
router.get('/', authenticate, authorize, getBills);
router.get('/stats', authenticate, authorize, getBillsStats);
router.get('/inactivas', authenticate, authorize, getInactiveBills);
router.get('/:id', authenticate, authorize, getBillById);

/**
 * @route   PUT /api/bills/:id
 * @desc    Actualizar una factura
 * @access  Private/Admin
 */
router.put('/:id', authenticate, authorize, updateBill);

/**
 * @route   DELETE /api/bills/:id
 * @desc    Desactivar una factura (soft delete)
 * @access  Private/Admin
 */
router.delete('/:id', authenticate, authorize, deleteBill);

/**
 * @route   DELETE /api/bills/:id/hard
 * @desc    Eliminar permanentemente una factura (hard delete)
 * @access  Private/SuperAdmin
 */
router.delete('/:id/hard', authenticate, authorizeSuperAdmin, hardDeleteBill);

export default router;