import db from '../models/index.js';
import logger from '../utils/logger.js';

const { Prestador } = db;


export class PrestadorService {
    static async getPrestadoresList(limit = 5000) {
        logger.info('Obteniendo lista de prestadores');

        const prestadores = await Prestador.findAll({
            attributes: ['id', 'nombre_prestador', 'nit', 'cod_habilitacion'],
            order: [['id', 'ASC']],
            limit,
        });

        return prestadores.map(p => ({
            id: p.id,
            nombre: p.nombre_prestador,
            nit: p.nit,
            cod: p.cod_habilitacion,
        }));
    }

    static async findById(id) {
        logger.info(`Buscando prestador con id ${id}`);
        return await Prestador.findByPk(id);
    }

}