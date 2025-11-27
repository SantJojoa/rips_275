import { BillService } from '../services/billService.js';
import { BillValidator } from '../validators/billValidator.js';
import { handleControllerError } from '../utils/errorHandler.js';

/**
 * Obtiene todas las facturas activas con paginación
 */
export const getBills = async (req, res) => {
    try {
        const pagination = BillValidator.validatePagination(req.query);
        const filters = BillValidator.validateFilters(req.query);

        const result = await BillService.getActiveBills({
            ...pagination,
            filters
        });

        res.status(200).json(result);
    } catch (error) {
        handleControllerError(res, error);
    }
};

/**
 * Obtiene una factura por ID
 */
export const getBillById = async (req, res) => {
    try {
        const id = BillValidator.validateId(req.params.id);
        const factura = await BillService.getBillById(id);

        res.status(200).json(factura);
    } catch (error) {
        handleControllerError(res, error);
    }
};

/**
 * Actualiza una factura
 */
export const updateBill = async (req, res) => {
    try {
        const id = BillValidator.validateId(req.params.id);
        const updateData = BillValidator.validateUpdateData(req.body);

        const factura = await BillService.updateBill(id, updateData);

        res.status(200).json({
            message: 'Factura actualizada correctamente',
            factura
        });
    } catch (error) {
        handleControllerError(res, error);
    }
};

/**
 * Desactiva una factura (soft delete)
 */
export const deleteBill = async (req, res) => {
    try {
        const id = BillValidator.validateId(req.params.id);
        const result = await BillService.softDeleteBill(id);

        res.status(200).json(result);
    } catch (error) {
        handleControllerError(res, error);
    }
};

/**
 * Elimina permanentemente una factura (hard delete)
 */
export const hardDeleteBill = async (req, res) => {
    try {
        const id = BillValidator.validateId(req.params.id);
        const result = await BillService.hardDeleteBill(id);

        res.status(200).json(result);
    } catch (error) {
        handleControllerError(res, error);
    }
};

/**
 * Obtiene estadísticas de facturas
 */
export const getBillsStats = async (req, res) => {
    try {
        const stats = await BillService.getBillsStats();

        res.status(200).json(stats);
    } catch (error) {
        handleControllerError(res, error);
    }
};