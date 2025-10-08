const db = require('../models');
const { sequelize, Transaccion, Users, Control, Prestador, Consultas, Procedimiento, Hospitalizaciones, RecienNacido, Urgencias, Medicamento, OtroServicio, UserTransaction } = db;

exports.searchByFactura = async (req, res) => {
    const { num_factura, user_id } = req.query;

    console.log(' Buscando factura:', num_factura);
    if (!num_factura) {
        return res.status(400).json({ message: 'El número de factura es requerido' });
    }

    try {
        // Buscar transacción y usuarios asociados
        const transaccion = await Transaccion.findOne({
            where: sequelize.where(
                sequelize.fn('trim', sequelize.col('num_factura')),
                '=',
                num_factura.toString().trim()
            ),
            include: [
                {
                    model: Control,
                    include: [
                        { model: Prestador },
                    ]
                },
                {
                    model: Users,
                    through: UserTransaction,
                    required: false,
                    attributes: ['id', 'tipo_doc', 'num_doc', 'tipo_usuario', 'cod_sexo'] // Only include existing columns
                }
            ]
        });

        console.log(' Transacción encontrada:', transaccion ? 'SÍ' : 'NO');

        if (!transaccion) {
            return res.status(404).json({ message: 'No se encontró la factura' });
        }

        // Si no hay usuarios asociados, retornar un error
        if (!transaccion.Users || transaccion.Users.length === 0) {
            return res.status(404).json({ message: 'No se encontraron usuarios asociados a esta factura' });
        }

        // Si hay múltiples usuarios y no se especificó uno, retornar la lista de usuarios
        if (transaccion.Users.length > 1 && !user_id) {
            return res.status(200).json({
                transaccion,
                control: transaccion.Control,
                users: transaccion.Users.map(user => ({
                    id: user.id,
                    tipo_doc: user.tipo_doc,
                    num_doc: user.num_doc,
                    tipo_usuario: user.tipo_usuario
                })),
                multipleUsers: true
            });
        }

        // Si se especificó un usuario o solo hay uno, buscar sus datos
        const userId = user_id || transaccion.Users[0].id;
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

        // Encontrar el usuario específico de la lista de usuarios
        const selectedUser = transaccion.Users.find(user => user.id === parseInt(userId));

        const response = {
            transaccion,
            control: transaccion.Control,
            usuario: selectedUser, // Enviamos el usuario seleccionado
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