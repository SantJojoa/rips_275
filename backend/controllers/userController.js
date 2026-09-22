import {
    getUsersService,
    getUserByIdService,
    updateUserService,
    deleteUserService,
} from '../services/userService.js';
import { UserValidator } from '../validators/userValidator.js';
import { handleControllerError } from '../utils/errorHandler.js';

export const getUsers = async (req, res) => {
    try {
        const users = await getUsersService();
        res.status(200).json(users);
    } catch (error) {
        handleControllerError(res, error);
    }
};

export const getUserById = async (req, res) => {
    try {
        const id = UserValidator.validateId(req.params.id);
        const user = await getUserByIdService(id);
        res.status(200).json(user);
    } catch (error) {
        handleControllerError(res, error);
    }
};

export const updateUser = async (req, res) => {
    try {
        const id = UserValidator.validateId(req.params.id);
        const updateData = UserValidator.validateUpdateData(req.body);
        const user = await updateUserService(id, updateData);
        res.status(200).json({ message: 'Usuario actualizado correctamente', user });
    } catch (error) {
        handleControllerError(res, error);
    }
};

export const deleteUser = async (req, res) => {
    try {
        const id = UserValidator.validateId(req.params.id);
        const result = await deleteUserService(id, req.user.id);
        res.status(200).json(result);
    } catch (error) {
        handleControllerError(res, error);
    }
};
