import fs from 'fs';
import { createError } from '../utils/errorHandler.js';
export class RipsValidator {
    static validateBasicRequest(body) {
        const { prestadorId: id_prestador, data } = body || {};

        if (!id_prestador) {
            throw createError(400, 'Falta `prestadorId`');
        }

        if (!data || typeof data !== 'object') {
            throw createError(400, 'Falta `data` (JSON RIPS)');
        }
    }

    static validateRipsData(ripsData) {
        const { numDocumentoIdObligado, numFactura } = ripsData;

        if (numDocumentoIdObligado == null || numFactura == null) {
            throw createError(
                400,
                'El JSON debe incluir `numDocumentoIdObligado` y `numFactura`'
            );
        }

        return {
            nit: numDocumentoIdObligado,
            numFactura,
            tipoNota: ripsData.tipoNota ?? '',
            numNota: ripsData.numNota ?? ''
        };
    }

    static parseJsonFile(filePath) {
        try {
            const text = fs.readFileSync(filePath, 'utf8');
            return JSON.parse(text);
        } catch (error) {
            throw createError(400, `Error al parsear el archivo RIPS: ${error.message}`);
        }
    }
}