import { createUserService, loginService, getProfileService } from '../services/userService.js';
import { handleControllerError } from '../utils/errorHandler.js';


export const createUser = async (req, res) => {
    try {
        const user = await createUserService(req.body, req.user.role);
        res.status(201).json({ message: 'Usuario creado exitosamente', user });
    } catch (error) {
        handleControllerError(res, error);
    }

};

export const login = async (req, res) => {
    try {
        const { token } = await loginService(req.body);
        res.status(200).json({ message: 'Inicio de sesión exitoso', token });
    } catch (error) {
        handleControllerError(res, error);
    }

};

export const getProfile = async (req, res) => {
    try {
        const user = await getProfileService(req.user.id);
        res.status(200).json({ message: 'Perfil obtenido exitosamente', user });
    } catch (error) {
        handleControllerError(res, error);
    }
};
