import axios from "axios";
import https from "https";
import { getCuvApiURL, externalApiConfig } from "../config/externalApis.js";
import { createError } from "../utils/errorHandler.js";
import logger from "../utils/logger.js";

export class CuvService {
    static createHttpsAgent() {
        const { rejectUnauthorized } = externalApiConfig.cuvApi;
        return new https.Agent({
            rejectUnauthorized,
            requestCert: false,
            agent: false
        });
    }

    static hasValidationData(errorResponse) {
        if (!errorResponse || !errorResponse.data) return false;

        return (
            errorResponse.data.ResultadosValidacion ||
            errorResponse.data.ResultState !== undefined
        );
    }

    static async consultarCUV(codigoUnicoValidacion) {
        logger.info('Consultando CUV', { codigoUnicoValidacion });
        const url = getCuvApiURL()
        const { timeout } = externalApiConfig.cuvApi;

        try {
            const response = await axios.post(
                url,
                { codigoUnicoValidacion },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    httpAgent: this.createHttpsAgent(),
                    timeout
                }
            );
            logger.info('CUV consultado exitosamente');
            return {
                success: true,
                data: response.data
            }
        } catch (error) {
            return this.handleCuvError(error);
        }
    }

    static handleCuvError(error) {
        logger.error('Error al consultar el CUV', error.message);

        if (error.response && this.hasValidationData(error.response)) {
            logger.warn('API externa devolvió error con datos de validación');
            return {
                success: true,
                data: error.response.data
            };
        }

        if (error.response) {
            throw createError(
                error.response.status,
                'Error en la API externa',
                { details: error.response.data }
            );
        }

        if (error.request) {
            throw createError(
                503,
                'No se pudo conectar con la API externa'
            );
        }

        throw createError(
            500,
            'Error al consultar el CUV',
            { details: error.message }
        );
    }
}
