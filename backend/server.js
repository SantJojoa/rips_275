const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const db = require('./models');

dotenv.config();

const app = express();
app.use(express.json());

// Rutas de autenticación
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 3000;

// Sincronizar modelos y levantar servidor
db.sequelize.sync().then(() => {
    console.log('✅ ----> Conexión exitosa a la base de datos');
    app.listen(PORT, () => {
        console.log(`✅ ----> Servidor corriendo en el puerto ${PORT}`);
    });
}).catch(err => console.error('Error al sincronizar la DB:', err));
