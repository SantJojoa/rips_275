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

        const existing = await SystemUser.findOne({ where: { username: 'admin' } });
        if (existing) {
            console.log('⚠️  Ya existe un usuario admin, no se creó otro.');
            return;
        }

        const hashedPassword = await bcrypt.hash('admin123', 10);
        await SystemUser.create({
            username: 'admin',
            nombres: 'Administrador',
            apellidos: 'Sistema',
            cedula: '0000000000',
            password: hashedPassword,
            role: 'ADMIN',
        });

        console.log('✅ Usuario admin creado exitosamente.');
        console.log('   Username: admin');
        console.log('   Password: admin123');
        console.log('   ⚠️  Cambia la contraseña después de iniciar sesión.');
    } catch (error) {
        console.error('❌ Error al crear el admin:', error.message);
    } finally {
        await sequelize.close();
    }
}

seed();
