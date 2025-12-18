import { useEffect, useMemo, useState } from 'react';
import { apiFetch } from '../lib/api';
import { monthOptions, yearsOptions } from '../data/facturedDateOptions';
import Select from 'react-select'
import { showError, showSuccess } from '../utils/toastUtils';

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


    const prestadorOptions = prestadores.map(p => ({
        value: String(p.id),
        label: `${p.id} - ${p.nombre}${p.nit ? ' • NIT: ' + p.nit : ''}${p.cod ? ' (' + p.cod + ')' : ''}`,
    }))


    const selectedPrestador = prestadorOptions.find(o => o.value === String(prestadorId)) || null


    useEffect(() => {
        (async () => {
            try {
                const res = await apiFetch('/api/auth/prestadores');
                const data = await res.json();
                if (!res.ok) throw new Error(data?.message || 'Error al obtener los prestadores');
                setPrestadores(data || []);
            } catch (e) {
                showError(e?.message || 'Error al obtener los prestadores');
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

            const contarServicios = (nombreServicio) => {
                let total = 0;
                const arrRaiz = obj[nombreServicio];
                if (Array.isArray(arrRaiz)) total += arrRaiz.length;

                const usuarios = obj.usuarios || obj.Usuarios || obj.users || obj.afiliados || [];
                if (Array.isArray(usuarios)) {
                    usuarios.forEach(usuario => {
                        const servicios = usuario.Servicios || usuario.servicios || {};
                        const arrServicio = servicios[nombreServicio];
                        if (Array.isArray(arrServicio)) total += arrServicio.length;
                    });
                }
                return total;
            };

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
                recienNacidos: contarServicios('recienNacidos') + contarServicios('recienNacido'),
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
        setMsg(null);
        setErr(null);

        if (!prestadorId) return showError('Seleccione un prestador');
        if (!periodoFac) return showError('Seleccione un periodo');
        if (!anio) return showError('Seleccione un año');
        if (!file && !jsonText) return showError('Seleccione un archivo o un JSON');

        let parsed = null;
        if (!file) {
            try {
                parsed = JSON.parse(jsonText);
            } catch {
                return showError('El JSON no es válido');
            }
        }

        setLoading(true);

        try {
            let res, data;
            if (file) {
                const fd = new FormData();
                fd.append('file', file);
                fd.append('prestadorId', String(prestadorId));
                if (periodoFac) fd.append('periodo_fac', String(periodoFac));
                if (anio) fd.append('anio', String(anio));

                res = await apiFetch('/api/auth/upload-json-file', {
                    method: 'POST',
                    body: fd,
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

            data = await res.json();
            if (!res.ok) return showError(data?.message || 'Error en la carga');
            //TODO VER SI FUNCIONA BIEN 

            showSuccess(data?.message || 'Carga realizada correctamente');
            if (data?.radicado) showSuccess(prev => `${prev} - Radicado: ${data.radicado}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen  p-6 flex items-center justify-center flex-col">
            <div className="mb-5 text-center">
                <h1 className="text-4xl font-bold text-slate-900 mb-2">
                    Subir archivo JSON
                </h1>
                <p className="text-slate-600">
                    Sube un archivo JSON para cargar la información
                </p>
            </div>

            <div className="w-full max-w-3xl bg-white rounded-3xl shadow-xl border border-slate-200 p-10 transition">

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Prestador</label>

                        <Select
                            options={prestadorOptions}
                            value={selectedPrestador}
                            onChange={(opt) => {
                                if (!opt) {
                                    setPrestadorId('')
                                    setPrestadorText('')
                                    return
                                }
                                setPrestadorId(opt.value)
                                setPrestadorText(opt.label)
                            }}
                            isClearable
                            placeholder="Buscar y seleccionar prestador..."
                            classNamePrefix="react-select"
                            styles={{
                                container: (base) => ({ ...base, width: '100%' }),
                                control: (base) => ({
                                    ...base,
                                    borderRadius: 12,
                                    borderColor: '#CBD5E1',
                                    boxShadow: 'none',
                                    padding: '2px 4px'
                                }),
                                input: (base) => ({ ...base, color: 'inherit' }),
                                menu: (base) => ({ ...base, borderRadius: 12 }),
                            }}
                        />
                    </div>

                    <p className="text-sm font-medium text-slate-700 mb-3">Periodo de facturación:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Mes</label>
                            <Select
                                options={monthOptions}
                                value={monthOptions.find((opt) => opt.value === Number(periodoFac))}
                                onChange={(selected) => setPeriodoFac(selected ? selected.value : '')}
                                placeholder={'Seleccionar mes'}
                                isClearable
                                className="react-select-container"
                                classNamePrefix="react-select"
                                styles={{
                                    container: (base) => ({ ...base, width: '100%' }),
                                    control: (base) => ({
                                        ...base,
                                        borderRadius: 12,
                                        borderColor: '#CBD5E1',
                                        boxShadow: 'none',
                                        padding: '2px 4px'
                                    }),
                                    input: (base) => ({ ...base, color: 'inherit' }),
                                    menu: (base) => ({ ...base, borderRadius: 12 }),
                                }}




                            >


                            </Select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Año</label>

                            <Select
                                options={yearsOptions}
                                value={yearsOptions.find((opt) => opt.value === Number(anio))}
                                onChange={(selected) => setAnio(selected ? selected.value : '')}
                                placeholder={'Seleccionar año'}
                                isClearable
                                className="react-select-container"
                                classNamePrefix="react-select"
                                styles={{
                                    container: (base) => ({ ...base, width: '100%' }),
                                    control: (base) => ({
                                        ...base,
                                        borderRadius: 12,
                                        borderColor: '#CBD5E1',
                                        boxShadow: 'none',
                                        padding: '2px 4px'
                                    }),
                                    input: (base) => ({ ...base, color: 'inherit' }),
                                    menu: (base) => ({ ...base, borderRadius: 12 }),
                                }}
                            >

                            </Select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Archivo JSON</label>
                        <input
                            type="file"
                            accept="application/json,.json"
                            onChange={(e) => handleFile(e.target.files?.[0] || null)}
                            className=" file:cursor-pointer block w-full text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-sky-600 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-sky-700 transition"
                        />
                    </div>

                    {preview && (
                        <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5">
                            <h2 className="text-base font-semibold text-slate-800 mb-3">Vista previa</h2>
                            <dl className="grid grid-cols-2 sm:grid-cols-3 gap-y-2 text-sm">
                                {Object.entries(preview).map(([key, value]) => (
                                    <div key={key}>
                                        <dt className="capitalize text-slate-500">{key.replace(/([A-Z])/g, ' $1')}:</dt>
                                        <dd className="font-medium text-slate-800">{value ?? '-'}</dd>
                                    </div>
                                ))}
                            </dl>
                        </div>
                    )}

                    {err && (
                        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 ring-1 ring-red-200">
                            {err}
                        </div>
                    )}
                    {msg && (
                        <div className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700 ring-1 ring-emerald-200">
                            {msg}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="cursor-pointer w-full py-3 rounded-xl bg-sky-600 text-white font-medium shadow hover:bg-sky-700 focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 transition disabled:opacity-60"
                    >
                        {loading ? 'Cargando...' : 'Subir'}
                    </button>
                </form>
            </div>
        </div>
    );
}
