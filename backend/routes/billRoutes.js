import express from 'express';
import {
    getBills,
    getBillById,
    updateBill,
    deleteBill,
    hardDeleteBill,
    getBillsStats
} from '../controllers/billController.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = express.Router();

/**
 * @route   GET /api/bills
 * @desc    Obtener facturas activas con paginación y filtros
 * @query   page, limit, periodo_fac, anio, prestador_id, num_factura
 * @access  Private/Admin
 */
router.get('/', authenticate, authorize, getBills);

/**
 * @route   GET /api/bills/stats
 * @desc    Obtener estadísticas de facturas
 * @access  Private/Admin
 */
router.get('/stats', authenticate, authorize, getBillsStats);

/**
 * @route   GET /api/bills/:id
 * @desc    Obtener factura por ID
 * @access  Private/Admin
 */
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
 * @access  Private/Admin
 */
router.delete('/:id/hard', authenticate, authorize, hardDeleteBill);

export default router;