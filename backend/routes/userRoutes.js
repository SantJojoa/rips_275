import express from 'express';
import { getUsers, getUserById, updateUser, deleteUser } from '../controllers/userController.js';
import { authenticate, authorizeSuperAdmin } from '../middlewares/auth.js';

const router = express.Router();

/**
 * @route   GET /api/users
 * @desc    Listar todos los usuarios del sistema
 * @access  Private/SuperAdmin
 */
router.get('/', authenticate, authorizeSuperAdmin, getUsers);

/**
 * @route   GET /api/users/:id
 * @desc    Obtener un usuario por ID
 * @access  Private/SuperAdmin
 */
router.get('/:id', authenticate, authorizeSuperAdmin, getUserById);

/**
 * @route   PUT /api/users/:id
 * @desc    Actualizar un usuario
 * @access  Private/SuperAdmin
 */
router.put('/:id', authenticate, authorizeSuperAdmin, updateUser);

/**
 * @route   DELETE /api/users/:id
 * @desc    Eliminar (soft delete) un usuario
 * @access  Private/SuperAdmin
 */
router.delete('/:id', authenticate, authorizeSuperAdmin, deleteUser);

export default router;
