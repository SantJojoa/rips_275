import { FacturaService } from '../services/facturaService.js';
import { CuvService } from '../services/cuvService.js'
import { QueryValidator } from '../validators/queryValidator.js'
import { handleControllerError } from '../utils/errorHandler.js';

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
}