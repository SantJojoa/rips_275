import { PrestadorService } from "../services/prestadorService.js";
import { handleControllerError } from "../utils/errorHandler.js";

export const getPrestadores = async (req, res) => {
    try {
        const { limit } = req.query;
        const prestadores = await PrestadorService.getPrestadoresList(
            limit ? parseInt(limit, 10) : undefined
        );

        res.status(200).json(prestadores);
    } catch (error) {
        handleControllerError(res, error);
    }
};

export const getPrestadorById = async (req, res) => {
    try {
        const { id } = req.params;
        const prestador = await PrestadorService.findById(id)

        if (!prestador) {
            return res.status(404).json({ message: 'Prestador no encontrado' })
        }

        res.status(200).json(prestador)
    } catch (error) {
        handleControllerError(res, error)
    }
};