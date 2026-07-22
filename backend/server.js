import 'dotenv/config';
import express from 'express';
import cors from 'cors'
import authRoutes from './routes/auth.js';
import billsRoutes from './routes/billRoutes.js';
import db from './models/index.js';


const app = express();
const allowedOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',')
    : ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:3001'];

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

if (process.env.NODE_TLS_REJECT_UNAUTHORIZED === '0') {
    console.log('⚠️  Verificación SSL deshabilitada');
}

// Rutas de autenticación (incluyen rutas de importación RIPS)
app.use('/api/auth', authRoutes);
app.use('/api/bills', billsRoutes);


const PORT = process.env.PORT || 3000;

// Sincronizar modelos y levantar servidor
db.sequelize.sync()
    .then(async () => {
        // Migraciones idempotentes — añadir columnas nuevas si no existen
        await db.sequelize.query(`
            ALTER TABLE system_users
            ADD COLUMN IF NOT EXISTS id_prestador INTEGER REFERENCES prestadores(id);
        `).catch(() => {});
        await db.sequelize.query(`
            ALTER TABLE control
            ADD COLUMN IF NOT EXISTS motivo_desactivacion TEXT;
        `).catch(() => {});
        console.log('✅ ----> Conexión exitosa a la base de datos');
        app.listen(PORT, () => {
            console.log(`✅ ----> Servidor corriendo en el puerto ${PORT}`);
        });
    })
    .catch(err => console.error('Error al sincronizar la DB:', err));

export default app;