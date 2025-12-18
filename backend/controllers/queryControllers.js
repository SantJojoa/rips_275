import { FacturaService } from '../services/facturaService.js';
import { CuvService } from '../services/cuvService.js';
import { ComparisonService } from '../services/comparisonService.js';
import { QueryValidator } from '../validators/queryValidator.js';
import { handleControllerError } from '../utils/errorHandler.js';
import fs from 'fs/promises';

export const searchByFactura = async (req, res) => {
    try {
        const { num_factura } = QueryValidator.validateFacturaSearch(req.query);
        const user_id = QueryValidator.parseUserId(req.query.user_id);

        const result = await FacturaService.searchFactura(num_factura, user_id);

        return res.status(200).json(result)
    } catch (error) {
        return handleControllerError(res, error);
    }
};

export const consultarCUV = async (req, res) => {
    try {
        const codigoUnicoValidacion = QueryValidator.validateCUV(req.body);

        const result = await CuvService.consultarCUV(codigoUnicoValidacion);

        return res.status(200).json(result.data);
    } catch (error) {
        return handleControllerError(res, error);
    }
};

export const compareCuvXml = async (req, res) => {
    try {
        const cuvText = req.body.cuvText;
        const cuvFile = req.files?.cuv?.[0];
        const xmlFile = req.files?.xml?.[0];

        if (!xmlFile) {
            return res.status(400).json({
                message: 'Se requiere el archivo XML'
            });
        }

        if (!cuvFile && !cuvText) {
            return res.status(400).json({
                message: 'Se requiere el código CUV (archivo o texto)'
            });
        }

        let codigoUnicoValidacion;

        if (cuvFile) {
            const cuvContent = await fs.readFile(cuvFile.path, 'utf-8');
            codigoUnicoValidacion = ComparisonService.extractCuvFromFile(cuvContent);
            await fs.unlink(cuvFile.path).catch(() => { });
        } else {
            codigoUnicoValidacion = cuvText.trim();
        }

        const xmlContent = await fs.readFile(xmlFile.path, 'utf-8');

        QueryValidator.validateCUV({ codigoUnicoValidacion });

        const result = await ComparisonService.compareCuvXml(
            codigoUnicoValidacion,
            xmlContent
        );

        await fs.unlink(xmlFile.path).catch(() => { });

        return res.status(200).json(result);
    } catch (error) {
        if (req.files) {
            if (req.files.cuv?.[0]?.path) {
                await fs.unlink(req.files.cuv[0].path).catch(() => { });
            }
            if (req.files.xml?.[0]?.path) {
                await fs.unlink(req.files.xml[0].path).catch(() => { });
            }
        }
        return handleControllerError(res, error);
    }
};