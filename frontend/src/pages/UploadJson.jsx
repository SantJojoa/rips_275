import { useEffect, useMemo, useState } from 'react';
import { apiFetch } from '../lib/api';
import { monthOptions, yearsOptions } from '../data/facturedDateOptions';
import Select from 'react-select';
import { showError, showSuccess } from '../utils/toastUtils';
import { UploadCloud } from 'lucide-react';

const selectStyles = {
    control: (base, state) => ({
        ...base,
        borderColor: state.isFocused ? '#462882' : '#EAEAEA',
        borderRadius: 8,
        backgroundColor: '#ffffff',
        boxShadow: state.isFocused ? '0 0 0 3px rgba(70,40,130,0.08)' : 'none',
        minHeight: 40,
        fontSize: 14,
        fontFamily: 'var(--font-sans)',
        '&:hover': { borderColor: '#c0c0c0' },
    }),
    menu:  base => ({ ...base, borderRadius: 8, fontSize: 14 }),
    input: base => ({ ...base, color: '#111111' }),
};

export default function UploadJson() {
    const [prestadores,   setPrestadores]   = useState([]);
    const [prestadorId,   setPrestadorId]   = useState('');
    const [prestadorText, setPrestadorText] = useState('');
    const [periodoFac,    setPeriodoFac]    = useState('');
    const [anio,          setAnio]          = useState('');
    const [file,          setFile]          = useState(null);
    const [jsonText,      setJsonText]      = useState('');
    const [loading,       setLoading]       = useState(false);
    const [dragging,      setDragging]      = useState(false);

    const prestadorOptions = prestadores.map(p => ({
        value: String(p.id),
        label: `${p.nombre}${p.nit ? ' · NIT ' + p.nit : ''}`,
    }));
    const selectedPrestador = prestadorOptions.find(o => o.value === String(prestadorId)) || null;

    useEffect(() => {
        (async () => {
            try {
                const res  = await apiFetch('/api/auth/prestadores');
                const data = await res.json();
                if (!res.ok) throw new Error(data?.message || 'Error');
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
        setJsonText(f ? await f.text() : '');
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        const f = e.dataTransfer.files?.[0];
        if (f) handleFile(f);
    };

    const preview = useMemo(() => {
        try {
            const obj = JSON.parse(jsonText || '{}');
            const contarServicios = (nombre) => {
                let total = Array.isArray(obj[nombre]) ? obj[nombre].length : 0;
                const usuarios = obj.usuarios || obj.Usuarios || obj.users || obj.afiliados || [];
                if (Array.isArray(usuarios)) {
                    usuarios.forEach(u => {
                        const arr = (u.Servicios || u.servicios || {})[nombre];
                        if (Array.isArray(arr)) total += arr.length;
                    });
                }
                return total;
            };
            const usuariosArr = obj.usuarios || obj.Usuarios || obj.users || obj.afiliados || [];
            return {
                nit:             obj.numDocumentoIdObligado,
                factura:         obj.numFactura,
                tipoNota:        obj.tipoNota,
                usuarios:        Array.isArray(usuariosArr) ? usuariosArr.length : 0,
                consultas:       contarServicios('consultas'),
                procedimientos:  contarServicios('procedimientos'),
                hospitalizaciones: contarServicios('hospitalizaciones'),
                recienNacidos:   contarServicios('recienNacidos') + contarServicios('recienNacido'),
                urgencias:       contarServicios('urgencias'),
                medicamentos:    contarServicios('medicamentos'),
                otrosServicios:  contarServicios('otrosServicios'),
            };
        } catch {
            return null;
        }
    }, [jsonText]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!prestadorId) return showError('Seleccione un prestador');
        if (!periodoFac)  return showError('Seleccione un periodo');
        if (!anio)        return showError('Seleccione un año');
        if (!file && !jsonText) return showError('Seleccione un archivo JSON');

        setLoading(true);
        try {
            let res;
            if (file) {
                const fd = new FormData();
                fd.append('file',        file);
                fd.append('prestadorId', String(prestadorId));
                if (periodoFac) fd.append('periodo_fac', String(periodoFac));
                if (anio)       fd.append('anio',        String(anio));
                res = await apiFetch('/api/auth/upload-json-file', { method: 'POST', body: fd });
            } else {
                res = await apiFetch('/api/auth/upload-json', {
                    method: 'POST',
                    body: JSON.stringify({
                        prestadorId: Number(prestadorId),
                        periodo_fac: periodoFac ? Number(periodoFac) : undefined,
                        anio:        anio        ? Number(anio)        : undefined,
                        data:        JSON.parse(jsonText),
                    }),
                });
            }
            const data = await res.json();
            if (!res.ok) return showError(data?.message || 'Error en la carga');
            showSuccess(data?.message || 'Carga realizada correctamente');
            if (data?.radicado) showSuccess(`Radicado: ${data.radicado}`);
        } finally {
            setLoading(false);
        }
    };

    const labelStyle = { display: 'block', fontSize: 13, fontWeight: 500, color: '#111111', marginBottom: 6 };

    return (
        <div className="fade-up fade-up-1">
            <div className="mb-6">
                <h1 className="text-xl font-semibold text-[#111111] tracking-tight">Subir archivo JSON</h1>
                <p className="mt-1 text-sm text-[#787774]">Carga un archivo RIPS en formato JSON.</p>
            </div>

            <div style={{ border: '1px solid #EAEAEA', borderRadius: 8, backgroundColor: '#ffffff' }} className="p-6 max-w-2xl">
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

                    {/* Prestador */}
                    <div>
                        <label style={labelStyle}>Prestador</label>
                        <Select
                            options={prestadorOptions}
                            value={selectedPrestador}
                            onChange={opt => {
                                setPrestadorId(opt?.value || '');
                                setPrestadorText(opt?.label || '');
                            }}
                            isClearable
                            placeholder="Buscar y seleccionar prestador..."
                            classNamePrefix="react-select"
                            styles={selectStyles}
                        />
                    </div>

                    {/* Período */}
                    <div>
                        <label style={{ ...labelStyle, marginBottom: 10 }}>Período de facturación</label>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                            <div>
                                <label style={{ ...labelStyle, color: '#787774', fontSize: 12 }}>Mes</label>
                                <Select
                                    options={monthOptions}
                                    value={monthOptions.find(o => o.value === Number(periodoFac)) || null}
                                    onChange={s => setPeriodoFac(s ? s.value : '')}
                                    placeholder="Seleccionar mes"
                                    isClearable
                                    classNamePrefix="react-select"
                                    styles={selectStyles}
                                />
                            </div>
                            <div>
                                <label style={{ ...labelStyle, color: '#787774', fontSize: 12 }}>Año</label>
                                <Select
                                    options={yearsOptions}
                                    value={yearsOptions.find(o => o.value === Number(anio)) || null}
                                    onChange={s => setAnio(s ? s.value : '')}
                                    placeholder="Seleccionar año"
                                    isClearable
                                    classNamePrefix="react-select"
                                    styles={selectStyles}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Drop zone archivo */}
                    <div>
                        <label style={labelStyle}>Archivo JSON</label>
                        <label
                            onDragOver={e => { e.preventDefault(); setDragging(true); }}
                            onDragLeave={() => setDragging(false)}
                            onDrop={handleDrop}
                            style={{
                                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                gap: 8, padding: '24px 16px', borderRadius: 8, cursor: 'pointer',
                                border: `1.5px dashed ${dragging ? '#462882' : file ? '#1aa154' : '#EAEAEA'}`,
                                backgroundColor: dragging ? 'rgba(70,40,130,0.04)' : file ? 'rgba(26,161,84,0.04)' : '#FBFBFA',
                                transition: 'border-color 150ms, background-color 150ms',
                            }}
                        >
                            <UploadCloud style={{ width: 22, height: 22, color: file ? '#1aa154' : '#787774' }} strokeWidth={1.5} />
                            <span style={{ fontSize: 13, color: file ? '#1aa154' : '#787774', fontWeight: 500, textAlign: 'center' }}>
                                {file ? file.name : 'Arrastra el archivo aquí o haz clic para seleccionar'}
                            </span>
                            {file && (
                                <button
                                    type="button"
                                    onClick={e => { e.preventDefault(); handleFile(null); }}
                                    style={{ fontSize: 11, color: '#787774', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                                >
                                    Quitar archivo
                                </button>
                            )}
                            <input type="file" accept="application/json,.json" onChange={e => handleFile(e.target.files?.[0] || null)} style={{ display: 'none' }} />
                        </label>
                    </div>

                    {/* Vista previa */}
                    {preview && (
                        <div style={{ border: '1px solid #EAEAEA', borderRadius: 8, backgroundColor: '#F9F9F8', padding: '16px 18px' }}>
                            <p style={{ fontSize: 13, fontWeight: 600, color: '#111111', marginBottom: 12 }}>Vista previa</p>
                            <dl style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 10 }}>
                                {Object.entries(preview).map(([key, value]) => (
                                    <div key={key} style={{ backgroundColor: '#ffffff', borderRadius: 6, padding: '8px 10px', border: '1px solid #EAEAEA' }}>
                                        <dt style={{ fontSize: 10, fontWeight: 600, color: '#787774', textTransform: 'uppercase', marginBottom: 2 }}>
                                            {key.replace(/([A-Z])/g, ' $1')}
                                        </dt>
                                        <dd style={{ fontSize: 14, fontWeight: 700, color: '#111111' }}>{value ?? '-'}</dd>
                                    </div>
                                ))}
                            </dl>
                        </div>
                    )}

                    {/* Botón */}
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            borderRadius: 8,
                            backgroundColor: loading ? '#787774' : '#111111',
                            transition: 'background-color 150ms, transform 100ms',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            border: 'none',
                        }}
                        onMouseDown={e => { if (!loading) e.currentTarget.style.transform = 'scale(0.98)'; }}
                        onMouseUp={e => { e.currentTarget.style.transform = 'scale(1)'; }}
                        className="w-full py-2.5 text-sm font-semibold text-white"
                    >
                        {loading ? 'Subiendo...' : 'Subir archivo'}
                    </button>
                </form>
            </div>
        </div>
    );
}
