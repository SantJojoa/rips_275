import 'dotenv/config';
import XLSX from 'xlsx';
import bcrypt from 'bcrypt';
import { Sequelize, DataTypes } from 'sequelize';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sequelize = new Sequelize(
    process.env.DB_DATABASE,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'postgres',
        port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
        logging: false,
    }
);

const Municipio = sequelize.define('Municipio', {
    id_municipio: DataTypes.STRING,
    nom_municipio: DataTypes.STRING,
    codigo_dane: DataTypes.STRING,
}, {
    tableName: 'municipios',
    timestamps: true,
    paranoid: false,
    underscored: true,
});

const SystemUser = sequelize.define('SystemUser', {
    username: DataTypes.STRING,
    nombres: DataTypes.STRING,
    apellidos: DataTypes.STRING,
    cedula: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.ENUM('ADMIN', 'USER'),
}, {
    tableName: 'system_users',
    timestamps: true,
    paranoid: true,
    underscored: true,
});

async function seed() {
    try {
        await sequelize.authenticate();
        console.log('✅ Conexión exitosa a la base de datos.');

        await Municipio.sync({ force: false });
        await SystemUser.sync({ force: false });

        const workbook = XLSX.readFile(path.join(__dirname, 'public_municipio.xlsx'));
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet);
        console.log(`📄 ${rows.length} municipios encontrados en el Excel.`);

        let createdMuni = 0;
        let createdUser = 0;
        let skipped = 0;

        for (const row of rows) {
            const idMunicipio = String(row['id_municipio']).trim();
            const nomMunicipio = String(row['nom_municipio']).trim();
            const codigoDane = String(row['CODIGO DANE']).trim();

            // Extraer solo el código numérico del DANE (ej: "52001 - Pasto" -> "52001")
            const codigoDaneNumerico = codigoDane.split('-')[0].trim();

            // Crear o actualizar municipio
            const [municipio, muniCreated] = await Municipio.findOrCreate({
                where: { id_municipio: idMunicipio },
                defaults: {
                    nom_municipio: nomMunicipio,
                    codigo_dane: codigoDane,
                },
            });

            if (muniCreated) createdMuni++;

            // Username = nombre del municipio en minúsculas sin espacios
            const username = nomMunicipio.toLowerCase().replace(/\s+/g, '_').normalize('NFD').replace(/[̀-ͯ]/g, '');

            const existingUser = await SystemUser.findOne({ where: { username } });
            if (existingUser) {
                skipped++;
                continue;
            }

            const hashedPassword = await bcrypt.hash(codigoDaneNumerico, 10);

            await SystemUser.create({
                username,
                nombres: nomMunicipio,
                apellidos: '',
                cedula: codigoDaneNumerico,
                password: hashedPassword,
                role: 'USER',
            });

            createdUser++;
        }

        console.log(`✅ Municipios creados: ${createdMuni}`);
        console.log(`✅ Usuarios creados: ${createdUser}`);
        console.log(`⚠️  Usuarios ya existentes (omitidos): ${skipped}`);

    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error(error);
    } finally {
        await sequelize.close();
    }
}

seed();
