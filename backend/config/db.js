import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
    process.env.DB_DATABASE,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'postgres',
        port: process.env.DB_PORT || 5432,
        logging: false,
    }
);

try {
    await sequelize.authenticate();
    console.log('✅ ----> Conexión exitosa a la base de datos // db.js');
} catch (error) {
    console.error('❌ ----> Error al conectar a la base de datos // db.js', error);
}

export default sequelize;
