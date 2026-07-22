import fs from 'fs';
import path from 'path';
import db from '../models/index.js';
import { RipsImportService } from '../services/ripsImportService.js';
import { RipsValidator } from '../validators/ripsValidator.js';
import { handleControllerError } from '../utils/errorHandler.js';

// Mueve un archivo temporal a destino y devuelve la ruta final.
function moveFile(src, dest) {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    try {
        fs.renameSync(src, dest);
    } catch {
        // renameSync falla entre particiones; fallback a copy+unlink
        fs.copyFileSync(src, dest);
        fs.unlinkSync(src);
    }
    return dest;
}

export const uploadRipsJsonFile = async (req, res) => {
    // Acepta campo 'file' (admin legacy) o 'rip' (usuario con 3 archivos)
    const ripFile = req.files?.rip?.[0] || req.files?.file?.[0] || req.file || null;
    const cuvFile = req.files?.cuv?.[0] || null;
    const xmlFile = req.files?.xml?.[0] || null;

    if (!ripFile) {
        return res.status(400).json({ message: 'Falta archivo RIPS' });
    }

    try {
        const dataObj = RipsValidator.parseJsonFile(ripFile.path);

        const { id: id_system_user, id_prestador } = req.user || {};
        const { periodo_fac, anio, status, valorFactura, numero_cuenta_cobro } = req.body;

        if (!numero_cuenta_cobro || !String(numero_cuenta_cobro).trim()) {
            [ripFile, cuvFile, xmlFile].forEach(f => {
                if (f?.path && fs.existsSync(f.path)) {
                    try { fs.unlinkSync(f.path); } catch { /* ignorar */ }
                }
            });
            return res.status(400).json({ message: 'El número de cuenta de cobro es obligatorio' });
        }

        // Importar a BD con ruta temporal; la actualizamos luego con la carpeta real
        const result = await RipsImportService.processRipsImport({
            id_system_user,
            id_prestador,
            periodo_fac,
            anio,
            status,
            route: ripFile.path,
            ripsData: dataObj,
            valorFactura: valorFactura != null ? parseFloat(valorFactura) : null,
            numero_cuenta_cobro: String(numero_cuenta_cobro).trim(),
        });

        // ── Organizar archivos ────────────────────────────────────────────────
        const numFactura = String(dataObj.numFactura || dataObj.NumFactura || 'SIN_FACTURA')
            .replace(/[/\\:*?"<>|]/g, '_'); // sanear para nombre de carpeta
        const radicado  = String(result.radicado).replace(/[/\\:*?"<>|]/g, '_');
        const baseName  = `${numFactura}_${radicado}`;
        const folderPath = path.join('uploads', baseName);

        fs.mkdirSync(folderPath, { recursive: true });

        const ripExt = path.extname(ripFile.originalname) || '.json';
        moveFile(ripFile.path, path.join(folderPath, `${baseName}_RIP${ripExt}`));

        if (cuvFile) {
            const cuvExt = path.extname(cuvFile.originalname) || '.json';
            moveFile(cuvFile.path, path.join(folderPath, `${baseName}_CUV${cuvExt}`));
        }

        if (xmlFile) {
            moveFile(xmlFile.path, path.join(folderPath, `${baseName}_XML.xml`));
        }

        // Actualizar route en la transacción (cada factura anexada tiene su propia carpeta)
        await db.Transaccion.update({ route: folderPath }, { where: { id: result.created.transaccionId } });

        return res.status(201).json({
            message: 'Carga realizada correctamente',
            ...result,
        });
    } catch (error) {
        // Limpiar archivos temporales si algo falló
        [ripFile, cuvFile, xmlFile].forEach(f => {
            if (f?.path && fs.existsSync(f.path)) {
                try { fs.unlinkSync(f.path); } catch { /* ignorar */ }
            }
        });
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
            numero_cuenta_cobro,
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
            ripsData,
            numero_cuenta_cobro,
        });

        return res.status(201).json({
            message: 'Carga realizada correctamente',
            ...result,
        });
    } catch (error) {
        handleControllerError(res, error);
    }
};
