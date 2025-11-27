import express from 'express';
import cors from 'cors'
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import billsRoutes from './routes/billRoutes.js';
import db from './models/index.js';

dotenv.config();

const app = express();
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

if (process.env.NODE_ENV !== 'production') {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    console.log('⚠️  Verificación SSL deshabilitada (solo desarrollo)');
}

// Rutas de autenticación (incluyen rutas de importación RIPS)
app.use('/api/auth', authRoutes);
app.use('/api/bills', billsRoutes);


const PORT = process.env.PORT || 3000;

// Sincronizar modelos y levantar servidor
db.sequelize.sync().then(() => {
    console.log('✅ ----> Conexión exitosa a la base de datos');
    app.listen(PORT, () => {
        console.log(`✅ ----> Servidor corriendo en el puerto ${PORT}`);
    });
}).catch(err => console.error('Error al sincronizar la DB:', err));

export default app;