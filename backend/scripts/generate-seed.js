/**
 * Genera seed.sql con:
 *  - Usuario admin inicial
 *  - Datos de prestadores desde Prestadores1.xlsx
 *
 * Uso: node scripts/generate-seed.js
 * Salida: seed.sql en la raíz del proyecto
 */

import bcrypt from 'bcrypt';
import XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = path.resolve(__dirname, '../../seed.sql');
const XLSX_PATH = path.resolve(__dirname, 'Prestadores1.xlsx');

function escape(value) {
    if (value === null || value === undefined) return 'NULL';
    if (typeof value === 'number') return value.toString();
    return `'${String(value).replace(/'/g, "''")}'`;
}

async function main() {
    const lines = [];

    lines.push('-- Seed generado automáticamente por generate-seed.js');
    lines.push(`-- ${new Date().toISOString()}`);
    lines.push('');

    // --- Admin user ---
    const hashedPassword = await bcrypt.hash('admin123', 10);
    lines.push('-- Usuario admin inicial');
    lines.push(`INSERT INTO system_users (username, nombres, apellidos, cedula, password, role, created_at, updated_at)`);
    lines.push(`VALUES ('admin', 'Administrador', 'Sistema', '0000000000', '${hashedPassword}', 'ADMIN', NOW(), NOW())`);
    lines.push(`ON CONFLICT (cedula) DO NOTHING;`);
    lines.push('');

    // --- Prestadores desde Excel ---
    if (!fs.existsSync(XLSX_PATH)) {
        console.warn(`⚠️  No se encontró ${XLSX_PATH}. Se omite la carga de prestadores.`);
    } else {
        const workbook = XLSX.readFile(XLSX_PATH);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet);

        lines.push('-- Prestadores');
        lines.push('INSERT INTO prestadores');
        lines.push('  (nombre_departamento, cod_habilitacion, nombre_prestador, nit, razon_social, ese,');
        lines.push('   direccion, telefono, fax, email, nivel, carcter, habilitado,');
        lines.push('   naju_nombre, rep_legal, muni_nombre, naju_codigo, "createdAt", "updatedAt")');
        lines.push('VALUES');

        const valueLines = rows.map((row) =>
            `  (${escape(row.nombre_departamento)}, ${escape(row.cod_habilitacion)}, ${escape(row.nombre_prestador)}, ` +
            `${escape(row.nit)}, ${escape(row.razon_social)}, ${escape(row.ese)}, ` +
            `${escape(row.direccion)}, ${escape(row.telefono)}, ${escape(row.fax)}, ` +
            `${escape(row.email)}, ${escape(row.nivel)}, ${escape(row.carcter)}, ${escape(row.habilitado)}, ` +
            `${escape(row.naju_nombre)}, ${escape(row.rep_legal)}, ${escape(row.muni_nombre)}, ` +
            `${escape(row.naju_codigo)}, NOW(), NOW())`
        );

        lines.push(valueLines.join(',\n'));
        lines.push('ON CONFLICT DO NOTHING;');
        lines.push('');
        console.log(`✅ ${rows.length} prestadores procesados.`);
    }

    fs.writeFileSync(OUTPUT_PATH, lines.join('\n'), 'utf-8');
    console.log(`✅ seed.sql generado en: ${OUTPUT_PATH}`);
    console.log('   Usuario admin: admin / admin123');
}

main().catch((err) => {
    console.error('❌ Error:', err.message);
    process.exit(1);
});
