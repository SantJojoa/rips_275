import { CuvService } from './cuvService.js';
import { XmlParser } from '../utils/xmlParser.js';
import logger from '../utils/logger.js';
import { createError } from '../utils/errorHandler.js';

export class ComparisonService {

    static async compareCuvXml(codigoUnicoValidacion, xmlContent) {
        try {
            logger.info('Iniciando comparación CUV-XML', { codigoUnicoValidacion });

            const cuvResponse = await CuvService.consultarCUV(codigoUnicoValidacion);

            if (!cuvResponse.success || !cuvResponse.data) {
                throw createError(400, 'Error al consultar el CUV');
            }

            const cuvData = cuvResponse.data;

            const payableAmount = XmlParser.extractPayableAmount(xmlContent);

            let totalValorServicios = cuvData.TotalValorServicios || 0;

            if (totalValorServicios === 0 && cuvData.TotalFactura) {
                totalValorServicios = cuvData.TotalFactura;
                logger.info('Usando TotalFactura como valor de comparación (TotalValorServicios era 0)', {
                    TotalFactura: cuvData.TotalFactura
                });
            }

            const isMatch = Math.abs(totalValorServicios - payableAmount) < 0.01;
            const difference = totalValorServicios - payableAmount;

            logger.info('Comparación completada', {
                totalValorServicios,
                payableAmount,
                isMatch,
                difference
            });

            return {
                success: true,
                comparison: {
                    isMatch,
                    totalValorServicios,
                    payableAmount,
                    difference: parseFloat(difference.toFixed(2))
                },
                cuvData,
                message: isMatch
                    ? 'Los valores coinciden'
                    : `Los valores no coinciden. Diferencia: $${Math.abs(difference).toLocaleString('es-CO')}`
            };

        } catch (error) {
            logger.error('Error en comparación CUV-XML', { error: error.message });
            throw error;
        }
    }


    static extractCuvFromFile(fileContent) {
        try {
            const json = JSON.parse(fileContent);

            return json.CodigoUnicoValidacion
                || json.codigoUnicoValidacion
                || json['Código Unico de Validación (CUV)']
                || json['Codigo Unico de Validacion (CUV)']
                || json['CUV'];
        } catch {
            const patterns = [
                // Patrones con comillas JSON
                /["']?CodigoUnicoValidacion["']?\s*:\s*["']([^"']+)["']/i,
                /["']?Código\s+Unico\s+de\s+Validación\s*\(CUV\)["']?\s*:\s*["']([^"']+)["']/i,
                /["']?Codigo\s+Unico\s+de\s+Validacion\s*\(CUV\)["']?\s*:\s*["']([^"']+)["']/i,
                /["']?CUV["']?\s*:\s*["']([^"']+)["']/i,
                // Patrones para texto plano (sin comillas) - incluye hashes hexadecimales largos
                /Código\s+Unico\s+de\s+Validación\s*\(CUV\)\s*:\s*([a-fA-F0-9]+)/i,
                /Codigo\s+Unico\s+de\s+Validacion\s*\(CUV\)\s*:\s*([a-fA-F0-9]+)/i,
                /CodigoUnicoValidacion\s*:\s*([a-fA-F0-9]+)/i,
                /CUV\s*:\s*([a-fA-F0-9]+)/i,
                // Patrones alternativos alfanuméricos
                /Código\s+Unico\s+de\s+Validación\s*\(CUV\)\s*:\s*([a-zA-Z0-9]+)/i,
                /Codigo\s+Unico\s+de\s+Validacion\s*\(CUV\)\s*:\s*([a-zA-Z0-9]+)/i,
                /CodigoUnicoValidacion\s*:\s*([a-zA-Z0-9]+)/i,
                /CUV\s*:\s*([a-zA-Z0-9]+)/i
            ];

            for (const pattern of patterns) {
                const match = fileContent.match(pattern);
                if (match && match[1]) {
                    return match[1].trim();
                }
            }

            throw createError(400, 'No se encontró el código CUV en el archivo');
        }
    }
}
