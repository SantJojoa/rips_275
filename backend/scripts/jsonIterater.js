'use strict';

const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const {
    sequelize,
    Control,
    Transaccion,
} = require('../models');

const defaultJsonPath = path.resolve(__dirname, '../rips.json');

// Ayuda simple por CLI
function printHelp() {
    console.log(
        `Uso:
  node backend/scripts/jsonIterater.js [ruta_json] [fecha_registro] [periodo_fac] [anio] [status]

Ejemplos:
  node backend/scripts/jsonIterater.js
  node backend/scripts/jsonIterater.js ./backend/rips.json 2025-09-26 9 2025 ACT

Notas:
- ruta_json: ruta al archivo JSON; por defecto: ${defaultJsonPath}
- fecha_registro: ISO (YYYY-MM-DD) o fecha parseable por JS
- periodo_fac: número entero (1..12)
- anio: número entero (ej. 2025)
- status: ACT | INACT | ERROR
`
    );
}

async function main() {
    const args = process.argv.slice(2);

    if (args[0] === '--help' || args[0] === '-h') {
        printHelp();
        process.exit(0);
    }

    const jsonPath = args[0]
        ? path.resolve(process.cwd(), args[0])
        : defaultJsonPath;

    if (!fs.existsSync(jsonPath)) {
        console.error(`Archivo JSON no encontrado: ${jsonPath}`);
        process.exit(1);
    }

    // Metadatos (prioridad CLI > ENV > por defecto)
    const fechaRegistroRaw = args[1] || process.env.FECHA_REGISTRO || new Date().toISOString();
    const periodoFacRaw = args[2] || process.env.PERIODO_FAC;
    const anioRaw = args[3] || process.env.ANIO;
    const statusRaw = (args[4] || process.env.STATUS || 'ACT').toUpperCase();

    const fechaRegistro = new Date(fechaRegistroRaw);
    if (isNaN(fechaRegistro.getTime())) {
        console.error(`fecha_registro inválida: ${fechaRegistroRaw}`);
        process.exit(1);
    }

    const periodoFac = periodoFacRaw != null ? parseInt(periodoFacRaw, 10) : null;
    const anio = anioRaw != null ? parseInt(anioRaw, 10) : null;
    const status = ['ACT', 'INACT', 'ERROR'].includes(statusRaw) ? statusRaw : 'ACT';

    // Leer JSON RIPS
    const ripsData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

    // Validar campos requeridos en el JSON para transacción
    const nit = ripsData.numDocumentoIdObligado;
    const numFactura = ripsData.numFactura;
    const tipoNota = ripsData.tipoNota ?? '';
    const numNota = ripsData.numNota ?? '';

    if (nit == null || numFactura == null) {
        console.error('El JSON debe incluir "numDocumentoIdObligado" y "numFactura".');
        process.exit(1);
    }

    // Persistencia atómica
    await sequelize.transaction(async (t) => {
        // Crear Control (metadatos de carga)
        const control = await Control.create({
            fecha_registro: fechaRegistro,
            periodo_fac: periodoFac,
            ['año']: anio, // el modelo usa clave con ñ
            route: jsonPath,
            status: status,
        }, { transaction: t });

        // Crear Transaccion (datos del encabezado del JSON)
        await Transaccion.create({
            id_control: control.id,
            // id_user: null, // opcional si en el futuro se asocia un usuario
            num_nit: parseInt(String(nit), 10),
            num_factura: parseInt(String(numFactura), 10),
            // valor_favtura: null, // si luego se calcula
            tipo_nota: String(tipoNota),
            num_nota: String(numNota),
            fecha: fechaRegistro,
        }, { transaction: t });
    });

    // Si deseas además iterar usuarios (solo logging por ahora)
    if (Array.isArray(ripsData.usuarios)) {
        ripsData.usuarios.forEach((usuario, idx) => {
            console.log(`Usuario ${idx + 1}:`, {
                tipoDocumentoIdentificacion: usuario.tipoDocumentoIdentificacion,
                numDocumentoIdentificacion: usuario.numDocumentoIdentificacion,
                tipoUsuario: usuario.tipoUsuario,
            });
        });
    }

    console.log('Importación completada: Control y Transacción creados correctamente.');
}

main().catch((err) => {
    console.error('Error en importación:', err);
    process.exit(1);
});