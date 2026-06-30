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

const SystemUser = sequelize.define('SystemUser', {
    username: DataTypes.STRING,
    nombres: DataTypes.STRING,
    apellidos: DataTypes.STRING,
    cedula: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.ENUM('SUPERADMIN', 'ADMIN', 'USER'),
}, {
    tableName: 'system_users',
    timestamps: true,
    paranoid: true,
    underscored: true,
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
    fax: DataTypes.BIGINT,
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
    paranoid: false,
});

// ─── Usuarios fijos ───────────────────────────────────────────────────────────

const USERS = [
    {
        username: 'superadmin',
        nombres: 'Super',
        apellidos: 'Administrador',
        cedula: '0000000001',
        password: 'superadmin123',
        role: 'SUPERADMIN',
    },
    {
        username: 'admin',
        nombres: 'Administrador',
        apellidos: 'Sistema',
        cedula: '0000000000',
        password: 'admin123',
        role: 'ADMIN',
    },
    {
        username: 'usuario_prueba',
        nombres: 'Usuario',
        apellidos: 'Prueba',
        cedula: '1111111111',
        password: 'prueba123',
        role: 'USER',
    },
];

async function seedUsers() {
    console.log('\n👤 Sembrando usuarios...');
    for (const user of USERS) {
        const existing = await SystemUser.findOne({ where: { username: user.username } });
        if (existing) {
            console.log(`   ⚠️  Ya existe: ${user.username} — omitido.`);
            continue;
        }
        const hashed = await bcrypt.hash(user.password, 10);
        await SystemUser.create({ ...user, password: hashed });
        console.log(`   ✅ Creado: ${user.username} (${user.role}) — password: ${user.password}`);
    }
}

// ─── Prestadores ─────────────────────────────────────────────────────────────

const toNum = (val, big = false) => {
    const n = parseInt(val, 10);
    return isNaN(n) ? null : n;
};

async function seedPrestadores() {
    console.log('\n🏥 Sembrando prestadores...');

    await sequelize.query('ALTER TABLE prestadores ALTER COLUMN nit TYPE BIGINT USING nit::BIGINT').catch(() => {});
    await sequelize.query('ALTER TABLE prestadores ALTER COLUMN fax TYPE BIGINT USING fax::BIGINT').catch(() => {});

    const workbook = XLSX.readFile(path.join(__dirname, 'Prestadores1.xlsx'));
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet);
    console.log(`   📄 ${rows.length} registros encontrados en el Excel.`);

    await sequelize.query('TRUNCATE TABLE prestadores RESTART IDENTITY CASCADE');

    for (const row of rows) {
        await Prestador.create({
            nombre_departamento: row.nombre_departamento,
            cod_habilitacion: row.cod_habilitacion,
            nombre_prestador: row.nombre_prestador,
            nit: toNum(row.nit),
            razon_social: row.razon_social,
            ese: row.ese,
            direccion: row.direccion,
            telefono: String(row.telefono ?? ''),
            fax: toNum(row.fax),
            email: row.email,
            nivel: toNum(row.nivel),
            carcter: row.carcter,
            habilitado: row.habilitado,
            naju_nombre: row.naju_nombre,
            rep_legal: row.rep_legal,
            muni_nombre: row.muni_nombre,
            naju_codigo: row.naju_codigo,
        });
    }
    console.log(`   ✅ ${rows.length} prestadores importados.`);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function seed() {
    try {
        await sequelize.authenticate();
        console.log('✅ Conexión exitosa a la base de datos.');

        await seedUsers();
        await seedPrestadores();

        console.log('\n🎉 Seed completado exitosamente.\n');
    } catch (error) {
        console.error('\n❌ Error en el seed:', error.message);
        process.exit(1);
    } finally {
        await sequelize.close();
    }
}

seed();
