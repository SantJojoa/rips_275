const db = require('../models');
const { sequelize, Transaccion, Users, Control, Prestador, Consultas, Procedimiento, Hospitalizaciones, RecienNacido, Urgencias, Medicamento, OtroServicio } = db;

exports.searchByFactura = async (req, res) => {
    const { num_factura } = req.query;

    console.log('🔍 Buscando factura:', num_factura);
    if (!num_factura) {
        return res.status(400).json({ message: 'El número de factura es requerido' });
    }

    try {
        // Buscar transacción por número de factura
        const transaccion = await Transaccion.findOne({
            where: { num_factura: parseInt(num_factura, 10) },
            include: [
                {
                    model: Control,
                    include: [
                        { model: Prestador },
                    ]
                },
                {
                    model: Users,
                    attributes: ['id', 'tipo_doc', 'num_doc', 'tipo_usuario', 'cod_sexo']
                }
            ]
        });

        console.log('📋 Transacción encontrada:', transaccion ? 'SÍ' : 'NO');

        if (!transaccion) {
            return res.status(404).json({ message: 'No se encontró la factura' });
        }

        // Buscar todos los datos relacionados
        const userId = transaccion.id_user;
        console.log('👤 User ID:', userId);

        const [consultas, procedimientos, hospitalizaciones, recienNacidos, urgencias, medicamentos, otrosServicios] = await Promise.all([
            Consultas.findAll({ where: { id_user: userId } }),
            Procedimiento.findAll({ where: { id_user: userId } }),
            Hospitalizaciones.findAll({ where: { id_user: userId } }),
            RecienNacido.findAll({ where: { id_user: userId } }),
            Urgencias.findAll({ where: { id_user: userId } }),
            Medicamento.findAll({ where: { id_user: userId } }),
            OtroServicio.findAll({ where: { id_user: userId } })
        ]);

        console.log('📊 Datos encontrados:', {
            consultas: consultas.length,
            procedimientos: procedimientos.length,
            hospitalizaciones: hospitalizaciones.length,
            recienNacidos: recienNacidos.length,
            urgencias: urgencias.length,
            medicamentos: medicamentos.length,
            otrosServicios: otrosServicios.length
        });

        const response = {
            transaccion,
            control: transaccion.Control,
            usuario: transaccion.User,
            consultas,
            procedimientos,
            hospitalizaciones,
            urgencias,
            medicamentos,
            otrosServicios,
            recienNacidos
        };

        console.log('✅ Enviando respuesta exitosa');
        return res.status(200).json(response);

    } catch (error) {
        console.error('❌ Error en searchByFactura:', error);
        return res.status(500).json({ message: 'Error al buscar la factura', error: String(error) });
    }
};