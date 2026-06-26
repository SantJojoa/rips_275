import XLSX from 'xlsx';
import { Sequelize, DataTypes } from 'sequelize';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

console.log(process.env.DB_DATABASE);
console.log(process.env.DB_USERNAME);
console.log(process.env.DB_PASSWORD);
console.log(process.env.DB_HOST);
console.log(process.env.DB_PORT);

const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    port: process.env.DB_PORT,
});

const Prestador = sequelize.define('Prestador', {
    nombre_departamento: DataTypes.STRING,
    cod_habilitacion: DataTypes.STRING,
    nombre_prestador: DataTypes.STRING,
    nit: DataTypes.BIGINT,
    razon_social: DataTypes.STRING,
    ese: DataTypes.STRING,
    direccion: DataTypes.STRING,
    telefono: DataTypes.STRING,
    fax: DataTypes.INTEGER,
    email: DataTypes.STRING,
    nivel: DataTypes.INTEGER,
    carcter: DataTypes.STRING,
    habilitado: DataTypes.STRING,
    naju_nombre: DataTypes.STRING,
    rep_legal: DataTypes.STRING,
    muni_nombre: DataTypes.STRING,
    naju_codigo: DataTypes.STRING,
}, {
    tableName: 'prestadores',
    timestamps: false,
    underscored: false,
    paranoid: false

});

async function importPrestadores() {
    try {
        await sequelize.authenticate();
        console.log('----> Conexión exitosa a la base de datos // importPrestadores.js');

        await sequelize.query('ALTER TABLE prestadores ALTER COLUMN nit TYPE BIGINT USING nit::BIGINT').catch(() => {});
        await sequelize.query('ALTER TABLE prestadores ALTER COLUMN fax TYPE BIGINT USING fax::BIGINT').catch(() => {});

        const workbook = XLSX.readFile(path.join(__dirname, 'Prestadores1.xlsx'));
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(sheet);
        console.log('----> Datos leídos correctamente // importPrestadores.js');

        const toBigInt = (val) => {
            const n = parseInt(val, 10);
            return isNaN(n) ? null : n;
        };
        const toInt = (val) => {
            const n = parseInt(val, 10);
            return isNaN(n) ? null : n;
        };

        await sequelize.query('TRUNCATE TABLE prestadores RESTART IDENTITY CASCADE');

        for (const row of data) {
            await Prestador.create({
                nombre_departamento: row.nombre_departamento,
                cod_habilitacion: row.cod_habilitacion,
                nombre_prestador: row.nombre_prestador,
                nit: toBigInt(row.nit),
                razon_social: row.razon_social,
                ese: row.ese,
                direccion: row.direccion,
                telefono: String(row.telefono ?? ''),
                fax: toBigInt(row.fax),
                email: row.email,
                nivel: toInt(row.nivel),
                carcter: row.carcter,
                habilitado: row.habilitado,
                naju_nombre: row.naju_nombre,
                rep_legal: row.rep_legal,
                muni_nombre: row.muni_nombre,
                naju_codigo: row.naju_codigo,
            });
        }
        console.log('----> Datos importados correctamente // importPrestadores.js');
        await sequelize.close();

    } catch (error) {
        console.error('----> Error al importar los datos // importPrestadores.js', error);
    }
}

importPrestadores();
