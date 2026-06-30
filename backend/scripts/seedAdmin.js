import 'dotenv/config';
import bcrypt from 'bcrypt';
import { Sequelize, DataTypes } from 'sequelize';

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
];

async function seed() {
    try {
        await sequelize.authenticate();

        for (const user of USERS) {
            const existing = await SystemUser.findOne({ where: { username: user.username } });
            if (existing) {
                console.log(`⚠️  Ya existe: ${user.username} — omitido.`);
                continue;
            }
            const hashed = await bcrypt.hash(user.password, 10);
            await SystemUser.create({ ...user, password: hashed });
            console.log(`✅ Creado: ${user.username} (${user.role}) — password: ${user.password}`);
        }

        console.log('   ⚠️  Cambia las contraseñas después de iniciar sesión.');
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await sequelize.close();
    }
}

seed();
