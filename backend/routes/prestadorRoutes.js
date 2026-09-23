import express from 'express';
import { Op } from 'sequelize';
import db from '../models/index.js';
import { authenticate, authorizeSuperAdmin } from '../middlewares/auth.js';
import { handleControllerError, createError } from '../utils/errorHandler.js';

const router = express.Router();
const { Prestador } = db;

const FIELDS = [
    'nombre_prestador', 'razon_social', 'nit', 'cod_habilitacion', 'nombre_departamento',
    'muni_nombre', 'direccion', 'telefono', 'email', 'rep_legal', 'ese', 'habilitado',
];

const pickData = (body) => {
    const data = {};
    for (const f of FIELDS) {
        if (body[f] === undefined) continue;
        const v = typeof body[f] === 'string' ? body[f].trim() : body[f];
        data[f] = v === '' ? null : v;
    }
    return data;
};

const validate = (data, { partial }) => {
    if (!partial || data.nombre_prestador !== undefined) {
        if (!data.nombre_prestador) throw createError(400, 'El nombre del prestador es obligatorio');
    }
    if (!partial || data.nit !== undefined) {
        const nit = Number(data.nit);
        if (!data.nit || !Number.isInteger(nit) || nit <= 0) throw createError(400, 'El NIT es obligatorio y debe ser numérico (sin dígito de verificación ni puntos)');
        data.nit = nit;
    }
};

const assertNitFree = async (nit, exceptId) => {
    const where = { nit };
    if (exceptId) where.id = { [Op.ne]: exceptId };
    if (await Prestador.findOne({ where })) throw createError(409, 'Ya existe un prestador con ese NIT');
};

router.get('/', authenticate, authorizeSuperAdmin, async (req, res) => {
    try {
        res.json(await Prestador.findAll({ order: [['nombre_prestador', 'ASC']] }));
    } catch (error) {
        handleControllerError(res, error);
    }
});

router.post('/', authenticate, authorizeSuperAdmin, async (req, res) => {
    try {
        const data = pickData(req.body);
        validate(data, { partial: false });
        await assertNitFree(data.nit);
        const prestador = await Prestador.create(data);
        res.status(201).json({ message: 'Prestador creado correctamente', prestador });
    } catch (error) {
        handleControllerError(res, error);
    }
});

router.put('/:id', authenticate, authorizeSuperAdmin, async (req, res) => {
    try {
        const prestador = await Prestador.findByPk(req.params.id);
        if (!prestador) throw createError(404, 'Prestador no encontrado');
        const data = pickData(req.body);
        validate(data, { partial: true });
        if (data.nit !== undefined) await assertNitFree(data.nit, prestador.id);
        await prestador.update(data);
        res.json({ message: 'Prestador actualizado correctamente', prestador });
    } catch (error) {
        handleControllerError(res, error);
    }
});

export default router;
