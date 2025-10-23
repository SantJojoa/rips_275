import express from 'express';
import db from '../models/index.js';

const router = express.Router();

// Desestructuramos los modelos que necesitamos
const { Transaccion, Control, Prestador } = db;

// Obtener todas las facturas activas
router.get('/', async (req, res) => {
    try {
        const facturas = await Transaccion.findAll({
            include: [
                {
                    model: Control,
                    as: 'Control', // ⚠️ el alias debe coincidir con la asociación en el modelo
                    where: { status: 'ACT' },
                    include: [
                        {
                            model: Prestador,
                            as: 'Prestador', // ⚠️ debe coincidir también con el alias de la relación
                            attributes: ['nombre_prestador'],
                        },
                    ],
                    attributes: [
                        'id',
                        'periodo_fac',
                        'año',
                        'status',
                        'createdAt',
                        'updatedAt',
                        'numero_radicado',
                    ],
                },
            ],
            attributes: [
                'id',
                'num_nit',
                'num_factura',
                'valor_factura',
            ],
            order: [[{ model: Control, as: 'Control' }, 'id', 'DESC']],
        });

        res.json(facturas);
    } catch (err) {
        console.error('Error al obtener facturas:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Actualizar una factura
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { num_factura, valor_factura } = req.body;

    try {
        const [updated] = await Transaccion.update(
            { num_factura, valor_factura },
            { where: { id } }
        );

        if (!updated) {
            return res.status(404).json({ error: 'Factura no encontrada' });
        }

        res.json({ message: 'Factura actualizada correctamente' });
    } catch (error) {
        console.error('Error al actualizar factura:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Eliminar una factura
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deleted = await Transaccion.destroy({ where: { id } });

        if (!deleted) {
            return res.status(404).json({ error: 'Factura no encontrada' });
        }

        res.json({ message: 'Factura eliminada correctamente' });
    } catch (error) {
        console.error('Error al eliminar factura:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

export default router;
