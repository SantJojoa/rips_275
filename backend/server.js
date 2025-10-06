const express = require('express');
const cors = require('cors')
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const db = require('./models');

dotenv.config();

const app = express();
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Rutas de autenticación (incluyen rutas de importación RIPS)
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 3000;

// Sincronizar modelos y levantar servidor
db.sequelize.sync().then(() => {
    console.log('✅ ----> Conexión exitosa a la base de datos');
    app.listen(PORT, () => {
        console.log(`✅ ----> Servidor corriendo en el puerto ${PORT}`);
    });
}).catch(err => console.error('Error al sincronizar la DB:', err));
