import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Pencil, Loader2, RefreshCw, Plus } from 'lucide-react';
import { apiFetch } from '../lib/api';
import { showError, showSuccess } from '../utils/toastUtils';

const FIELDS = [
    { key: 'nombre_prestador', label: 'Nombre del prestador *', full: true },
    { key: 'nit', label: 'NIT * (sin dígito de verificación)' },
    { key: 'cod_habilitacion', label: 'Código de habilitación' },
    { key: 'razon_social', label: 'Razón social', full: true },
    { key: 'nombre_departamento', label: 'Departamento' },
    { key: 'muni_nombre', label: 'Municipio' },
    { key: 'direccion', label: 'Dirección' },
    { key: 'telefono', label: 'Teléfono' },
    { key: 'email', label: 'Email' },
    { key: 'rep_legal', label: 'Representante legal' },
];

const inputStyle = {
    border: '1px solid #EAEAEA', borderRadius: 6, width: '100%', padding: '8px 12px',
    fontSize: 14, color: '#111111', outline: 'none', boxSizing: 'border-box',
};

async function request(url, method, body) {
    const res = await apiFetch(url, { method, body: JSON.stringify(body) });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || 'Error al guardar el prestador');
    return data;
}

function PrestadorModal({ prestador, onSaved, onCancel }) {
    const isNew = !prestador;
    const [form, setForm] = useState(() =>
        Object.fromEntries(FIELDS.map(f => [f.key, prestador?.[f.key] ?? ''])));
    const [saving, setSaving] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        if (!String(form.nombre_prestador).trim()) return showError('El nombre del prestador es obligatorio');
        if (!/^\d+$/.test(String(form.nit).trim())) return showError('El NIT debe ser numérico');
        setSaving(true);
        try {
            const data = isNew
                ? await request('/api/prestadores', 'POST', form)
                : await request(`/api/prestadores/${prestador.id}`, 'PUT', form);
            showSuccess(data.message);
            onSaved();
        } catch (err) {
            showError(err.message);
        } finally {
            setSaving(false);
        }
    };

    return createPortal(
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, backgroundColor: 'rgba(0,0,0,0.45)' }} onClick={onCancel}>
            <div style={{ backgroundColor: '#fff', borderRadius: 14, padding: 24, width: '100%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
                <p style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>{isNew ? 'Crear prestador' : 'Editar prestador'}</p>
                <form onSubmit={submit}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {FIELDS.map(f => (
                            <div key={f.key} className={f.full ? 'sm:col-span-2' : ''}>
                                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>{f.label}</label>
                                <input style={inputStyle} value={form[f.key]}
                                    onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} />
                            </div>
                        ))}
                    </div>
                    <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                        <button type="button" onClick={onCancel}
                            style={{ flex: 1, padding: '9px 0', borderRadius: 8, border: '1px solid #EAEAEA', backgroundColor: '#F9F9F8', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                            Cancelar
                        </button>
                        <button type="submit" disabled={saving}
                            style={{ flex: 1, padding: '9px 0', borderRadius: 8, border: 'none', backgroundColor: saving ? '#787774' : '#111111', color: '#fff', fontSize: 13, fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer' }}>
                            {saving ? 'Guardando...' : 'Guardar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
}

export default function ManagePrestadores() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [busqueda, setBusqueda] = useState('');
    const [modal, setModal] = useState(null); // null | 'new' | prestador

    const cargar = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await apiFetch('/api/prestadores');
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Error al obtener prestadores');
            setItems(Array.isArray(data) ? data : []);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { cargar(); }, [cargar]);

    const q = busqueda.trim().toLowerCase();
    const filtrados = items.filter(p => !q ||
        [p.nombre_prestador, p.nit, p.cod_habilitacion, p.muni_nombre].some(v => String(v ?? '').toLowerCase().includes(q)));

    const btn = { display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 8, border: '1px solid #EAEAEA', backgroundColor: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#111111' };

    return (
        <div className="fade-up fade-up-1">
            <div className="mb-5 flex items-end justify-between gap-3 flex-wrap">
                <div>
                    <h1 className="text-xl font-semibold text-[#111111] tracking-tight">Gestionar prestadores</h1>
                    <p className="mt-1 text-sm text-[#787774]">Crea y edita los prestadores de servicios de salud.</p>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={cargar} disabled={loading} style={btn}>
                        <RefreshCw style={{ width: 14, height: 14 }} className={loading ? 'animate-spin' : ''} /> Actualizar
                    </button>
                    <button onClick={() => setModal('new')} style={{ ...btn, backgroundColor: '#111111', color: '#fff', border: 'none' }}>
                        <Plus style={{ width: 14, height: 14 }} /> Crear prestador
                    </button>
                </div>
            </div>

            <div style={{ border: '1px solid #EAEAEA', borderRadius: 10, backgroundColor: '#fff', padding: '14px 18px', marginBottom: 16 }}>
                <input type="text" value={busqueda} onChange={e => setBusqueda(e.target.value)}
                    placeholder="Buscar por nombre, NIT, código o municipio..."
                    style={{ width: '100%', padding: '6px 10px', borderRadius: 7, border: '1px solid #D1D5DB', fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
            </div>

            {loading && <div style={{ textAlign: 'center', padding: '48px 0' }}><Loader2 style={{ width: 32, height: 32, margin: '0 auto' }} className="animate-spin" /></div>}
            {error && !loading && <p style={{ fontSize: 13, color: '#B91C1C', fontWeight: 600 }}>Error: {error}</p>}

            {!loading && !error && (
                <div style={{ border: '1px solid #EAEAEA', borderRadius: 10, backgroundColor: '#fff', overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                        <thead>
                            <tr style={{ backgroundColor: '#F9F9F8', borderBottom: '1px solid #EAEAEA' }}>
                                {['Nombre', 'NIT', 'Cód. habilitación', 'Municipio', 'Email', ''].map((h, i) => (
                                    <th key={i} style={{ textAlign: 'left', padding: '10px 16px', fontSize: 11, fontWeight: 600, color: '#787774', textTransform: 'uppercase' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtrados.length === 0 && (
                                <tr><td colSpan={6} style={{ padding: 32, textAlign: 'center', color: '#787774' }}>No hay prestadores que coincidan.</td></tr>
                            )}
                            {filtrados.map(p => (
                                <tr key={p.id} style={{ borderBottom: '1px solid #F0F0EF' }}>
                                    <td style={{ padding: '10px 16px', fontWeight: 600 }}>{p.nombre_prestador || '—'}</td>
                                    <td style={{ padding: '10px 16px' }}>{p.nit ?? '—'}</td>
                                    <td style={{ padding: '10px 16px', color: '#787774' }}>{p.cod_habilitacion || '—'}</td>
                                    <td style={{ padding: '10px 16px', color: '#787774' }}>{p.muni_nombre || '—'}</td>
                                    <td style={{ padding: '10px 16px', color: '#787774' }}>{p.email || '—'}</td>
                                    <td style={{ padding: '10px 16px', textAlign: 'right' }}>
                                        <button onClick={() => setModal(p)} title="Editar prestador"
                                            style={{ padding: 5, borderRadius: 6, border: '1px solid #BFDBFE', backgroundColor: '#EFF6FF', cursor: 'pointer' }}>
                                            <Pencil style={{ width: 14, height: 14, color: '#1D4ED8' }} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {modal && (
                <PrestadorModal
                    prestador={modal === 'new' ? null : modal}
                    onSaved={() => { setModal(null); cargar(); }}
                    onCancel={() => setModal(null)}
                />
            )}
        </div>
    );
}
