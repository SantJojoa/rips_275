import { createUserService, loginService, getProfileService } from '../services/userService.js';


export const createUser = async (req, res) => {
    try {
        const user = await createUserService(req.body, req.user.role);
        res.status(201).json({ message: 'Usuario creado exitosamente', user });
    } catch (error) {
        console.error(error);
        res.status(error.status || 500).json({ message: error.message || 'Error interno del servidor' });
    }

};

export const login = async (req, res) => {
    try {
        const { token } = await loginService(req.body);
        res.status(200).json({ message: 'Inicio de sesión exitoso', token });
    } catch (error) {
        console.error(error);
        res.status(error.status || 500).json({ message: error.message || 'Error interno del servidor' });
    }

};

export const getProfile = async (req, res) => {
    try {
        const user = await getProfileService(req.user.id);
        res.status(200).json({ user });
    } catch (error) {
        console.error(error);
        res
            .status(error.status || 500)
            .json({ message: error.message || "Error interno del servidor" });
    }
};
