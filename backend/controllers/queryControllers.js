import { FacturaService } from '../services/facturaService.js';
import { CuvService } from '../services/cuvService.js';
import { ComparisonService } from '../services/comparisonService.js';
import { QueryValidator } from '../validators/queryValidator.js';
import { handleControllerError } from '../utils/errorHandler.js';
import fs from 'fs/promises';
import path from 'path';

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

export const compareCuvXmlBatch = async (req, res) => {
    const cuvFiles = req.files?.cuv || [];
    const xmlFiles = req.files?.xml || [];

    const allTempPaths = [
        ...cuvFiles.map(f => f.path),
        ...xmlFiles.map(f => f.path)
    ];

    const cleanup = async (paths) => {
        for (const p of paths) {
            await fs.unlink(p).catch(() => { });
        }
    };

    try {
        if (cuvFiles.length === 0 || xmlFiles.length === 0) {
            await cleanup(allTempPaths);
            return res.status(400).json({ message: 'Se requieren archivos CUV y XML' });
        }

        const extractCuvKey = (filename) => {
            const m = filename.match(/^FEV(.+)_CUV\.(json|txt)$/i);
            return m ? m[1] : path.basename(filename, path.extname(filename));
        };

        const extractXmlKey = (filename) => {
            const m = filename.match(/^FEV(.+)\.xml$/i);
            return m ? m[1] : path.basename(filename, path.extname(filename));
        };

        const cuvMap = new Map();
        for (const f of cuvFiles) {
            cuvMap.set(extractCuvKey(f.originalname), f);
        }

        const xmlMap = new Map();
        for (const f of xmlFiles) {
            xmlMap.set(extractXmlKey(f.originalname), f);
        }

        const matched = [];
        const unmatchedCuv = [];
        const unmatchedXml = [];

        for (const [name, cuv] of cuvMap) {
            if (xmlMap.has(name)) {
                matched.push({ name, cuvFile: cuv, xmlFile: xmlMap.get(name) });
            } else {
                unmatchedCuv.push(cuv.originalname);
            }
        }
        for (const [name, xml] of xmlMap) {
            if (!cuvMap.has(name)) {
                unmatchedXml.push(xml.originalname);
            }
        }

        const results = [];
        for (const { name, cuvFile, xmlFile } of matched) {
            try {
                const cuvContent = await fs.readFile(cuvFile.path, 'utf-8');
                const codigoUnicoValidacion = ComparisonService.extractCuvFromFile(cuvContent);
                QueryValidator.validateCUV({ codigoUnicoValidacion });
                const xmlContent = await fs.readFile(xmlFile.path, 'utf-8');
                const result = await ComparisonService.compareCuvXml(codigoUnicoValidacion, xmlContent);
                results.push({
                    name,
                    cuvFileName: cuvFile.originalname,
                    xmlFileName: xmlFile.originalname,
                    success: true,
                    ...result
                });
            } catch (err) {
                results.push({
                    name,
                    cuvFileName: cuvFile.originalname,
                    xmlFileName: xmlFile.originalname,
                    success: false,
                    message: err.message
                });
            }
        }

        await cleanup(allTempPaths);

        return res.status(200).json({
            total: matched.length,
            results,
            unmatchedCuv,
            unmatchedXml
        });

    } catch (error) {
        await cleanup(allTempPaths);
        return handleControllerError(res, error);
    }
};