import { useEffect, useMemo, useState } from 'react';
import { apiFetch } from '../lib/api';

export default function UploadJson() {
    const [prestadores, setPrestadores] = useState([]);
    const [prestadorText, setPrestadorText] = useState('');
    const [prestadorId, setPrestadorId] = useState('');
    const [periodoFac, setPeriodoFac] = useState('');
    const [anio, setAnio] = useState('');
    const [file, setFile] = useState(null);
    const [jsonText, setJsonText] = useState('');
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState(null);
    const [err, setErr] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const res = await apiFetch('/api/auth/prestadores');
                const data = await res.json();
                if (!res.ok) throw new Error(data?.message || 'Error al obtener los prestadores');
                setPrestadores(data || []);
            } catch (e) {
                setErr(e?.message || 'Error al obtener los prestadores');
            }
        })();
    }, []);

    useEffect(() => {
        const m = /^\s*(\d+)\s*-/.exec(prestadorText || '');
        if (m) setPrestadorId(m[1]);
    }, [prestadorText]);

    const handleFile = async (f) => {
        setFile(f || null);
        if (f) {
            const text = await f.text();
            setJsonText(text);
        } else {
            setJsonText('');
        }
    };
    const preview = useMemo(() => {
        try {
            const obj = JSON.parse(jsonText || '{}');

            // Función mejorada para contar servicios
            const contarServicios = (nombreServicio) => {
                let total = 0;

                // 1. Buscar en nivel raíz
                const arrRaiz = obj[nombreServicio];
                if (Array.isArray(arrRaiz)) {
                    total += arrRaiz.length;
                }

                // 2. Buscar dentro de usuarios (Servicios anidados)
                const usuarios = obj.usuarios || obj.Usuarios || obj.users || obj.afiliados || [];
                if (Array.isArray(usuarios)) {
                    usuarios.forEach(usuario => {
                        const servicios = usuario.Servicios || usuario.servicios || {};
                        const arrServicio = servicios[nombreServicio];
                        if (Array.isArray(arrServicio)) {
                            total += arrServicio.length;
                        }
                    });
                }

                return total;
            };

            // Contar usuarios
            const usuariosArr = obj.usuarios || obj.Usuarios || obj.users || obj.afiliados || [];
            const totalUsuarios = Array.isArray(usuariosArr) ? usuariosArr.length : 0;

            return {
                nit: obj.numDocumentoIdObligado,
                factura: obj.numFactura,
                tipoNota: obj.tipoNota,
                usuarios: totalUsuarios,
                consultas: contarServicios('consultas'),
                procedimientos: contarServicios('procedimientos'),
                hospitalizaciones: contarServicios('hospitalizaciones'),
                recienNacidos: contarServicios('recienNacidos') + contarServicios('recienNacido'), // Ambos nombres
                urgencias: contarServicios('urgencias'),
                medicamentos: contarServicios('medicamentos'),
                otrosServicios: contarServicios('otrosServicios'),
            };
        } catch {
            return null;
        }
    }, [jsonText]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMsg(null); setErr(null);
        if (!prestadorId) {
            setErr('Seleccione un prestador');
            return;
        }

        let parsed = null
        if (!file) {
            try {
                parsed = JSON.parse(jsonText);
            } catch {
                setErr('El JSON no es valido')
                return;
            }
        }

        setLoading(true)

        try {
            let res, data;
            if (file) {
                const fd = new FormData();
                fd.append('file', file)
                fd.append('prestadorId', String(prestadorId));
                if (periodoFac) fd.append('periodo_fac', String(periodoFac));
                if (anio) fd.append('anio', String(anio));

                res = await apiFetch('/api/auth/upload-json-file', {
                    method: 'POST',
                    body: fd
                });

            } else {
                res = await apiFetch('/api/auth/upload-json', {
                    method: 'POST',
                    body: JSON.stringify({
                        prestadorId: Number(prestadorId),
                        periodo_fac: periodoFac ? Number(periodoFac) : undefined,
                        anio: anio ? Number(anio) : undefined,
                        data: parsed,
                    }),
                });
            }
            data = await res.json()
            if (!res.ok) {
                setErr(data?.message || 'Error en la carga');
                return;
            }
            setMsg(data?.message || 'Carga realizada correctamente');
            if (data?.radicado) {
                setMsg(prev => `${prev} - Radicado: ${data.radicado}`);
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
            <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow-lg ring-1 ring-slate-200">
                <h1 className="text-2xl font-bold text-slate-900">Subir JSON</h1>
                <p className="mt-1 text-sm text-slate-500">
                    Complete los campos y cargue el archivo JSON para registrar la información.
                </p>

                <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
                    {/* Prestador */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Prestador</label>
                        <input
                            list="prestadores"
                            value={prestadorText}
                            onChange={(e) => setPrestadorText(e.target.value)}
                            placeholder="Escriba y seleccione ID - nombre"
                            className="mt-2 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 shadow-sm focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                            required
                        />
                        <datalist id="prestadores">
                            {prestadores.map(p => (
                                <option
                                    key={p.id}
                                    value={`${p.id} - ${p.nombre}`}
                                    label={`${p.nit ?? ''} ${p.cod ? '(' + p.cod + ')' : ''}`}
                                />
                            ))}
                        </datalist>
                    </div>

                    {/* Fechas y periodo */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                        <div>
                            <label className="block text-sm font-medium text-slate-700">Periodo (mes)</label>
                            <input
                                type="number"
                                min="1"
                                max="12"
                                value={periodoFac}
                                onChange={(e) => setPeriodoFac(e.target.value)}
                                className="mt-1 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 shadow-sm focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Año</label>
                            <input
                                type="number"
                                min="1990"
                                max="2100"
                                value={anio}
                                onChange={(e) => setAnio(e.target.value)}
                                className="mt-1 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 shadow-sm focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                            />
                        </div>
                    </div>

                    {/* Archivo */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 ">Archivo JSON</label>
                        <input
                            type="file"
                            accept="application/json,.json"
                            onChange={(e) => handleFile(e.target.files?.[0] || null)}
                            className="mt-2 file:cursor-pointer block w-full text-sm text-slate-600 file:mr-4 file:rounded-md file:border-0 file:bg-sky-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-sky-700 hover:file:bg-sky-100 "
                        />
                    </div>

                    {/* Vista previa */}
                    {preview && (
                        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm">
                            <h2 className="font-medium text-slate-800 mb-2">Vista previa</h2>
                            <dl className="grid grid-cols-2 gap-x-6 gap-y-2">
                                <div><dt className="text-slate-500">Nit:</dt><dd>{preview.nit ?? '-'}</dd></div>
                                <div><dt className="text-slate-500">Factura:</dt><dd>{preview.factura ?? '-'}</dd></div>
                                <div><dt className="text-slate-500">Usuarios:</dt><dd>{preview.usuarios}</dd></div>
                                <div><dt className="text-slate-500">Consultas:</dt><dd>{preview.consultas}</dd></div>
                                <div><dt className="text-slate-500">Procedimientos:</dt><dd>{preview.procedimientos}</dd></div>
                                <div><dt className="text-slate-500">Hospitalizaciones:</dt><dd>{preview.hospitalizaciones}</dd></div>
                                <div><dt className="text-slate-500">RN:</dt><dd>{preview.recienNacidos}</dd></div>
                                <div><dt className="text-slate-500">Urgencias:</dt><dd>{preview.urgencias}</dd></div>
                                <div><dt className="text-slate-500">Medicamentos:</dt><dd>{preview.medicamentos}</dd></div>
                                <div><dt className="text-slate-500">Otros:</dt><dd>{preview.otrosServicios}</dd></div>
                            </dl>
                        </div>
                    )}

                    {/* Mensajes */}
                    {err && <div className="rounded-md bg-red-50 p-3 text-sm text-red-700 ring-1 ring-red-200">{err}</div>}
                    {msg && <div className="rounded-md bg-emerald-50 p-3 text-sm text-emerald-700 ring-1 ring-emerald-200">{msg}</div>}

                    {/* Botón */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-sky-600 px-4 py-3 text-white font-medium shadow-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-1 disabled:opacity-60 cursor-pointer"
                    >
                        {loading ? 'Cargando...' : 'Subir'}
                    </button>
                </form>
            </div>
        </div>
    );
}
