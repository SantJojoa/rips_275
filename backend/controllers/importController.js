import fs from 'fs';
import { RipsImportService } from '../services/ripsImportService.js';
import { RipsValidator } from '../validators/ripsValidator.js';
import { handleControllerError } from '../utils/errorHandler.js';


export const uploadRipsJsonFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Falta archivo RIPS' });
        }

        const dataObj = RipsValidator.parseJsonFile(req.file.path);

        req.body = {
            ...req.body,
            ...req.body,
            data: dataObj,
            route: req.file.path
        };

        return uploadRipsJson(req, res);
    } catch (error) {
        handleControllerError(res, error);
    }
};

export const uploadRipsJson = async (req, res) => {
    try {
        const { id: id_system_user } = req.user || {};
        const {
            prestadorId: id_prestador,
            prestadorNit,
            prestadorCod,
            periodo_fac,
            anio,
            status,
            route,
            data: ripsData,
        } = req.body || {};

        RipsValidator.validateBasicRequest(req.body);

        const result = await RipsImportService.processRipsImport({
            id_system_user,
            id_prestador,
            prestadorNit,
            prestadorCod,
            periodo_fac,
            anio,
            status,
            route,
            ripsData
        });

        return res.status(201).json({
            message: 'Carga realizada correctamente',
            ...result
        });
    } catch (error) {
        handleControllerError(res, error);
    }
};